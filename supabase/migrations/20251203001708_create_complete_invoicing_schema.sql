/*
  # Complete Invoicing System Schema

  1. New Tables
    - `profiles` - User profile information linked to auth.users
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `company_name` (text, optional)
      - `company_address` (text, optional)
      - `company_phone` (text, optional)
      - `company_logo_url` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `invoice_items` - Line items for invoices
      - `id` (uuid, primary key)
      - `invoice_id` (uuid, foreign key to invoices)
      - `description` (text)
      - `quantity` (numeric)
      - `unit_price` (numeric)
      - `amount` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `payments` - Payment records for invoices
      - `id` (uuid, primary key)
      - `invoice_id` (uuid, foreign key to invoices)
      - `amount` (numeric)
      - `payment_method` (text, optional)
      - `stripe_payment_id` (text, optional)
      - `status` (text, default: pending)
      - `paid_at` (timestamptz, optional)
      - `created_at` (timestamptz)

  2. Updates to Existing Tables
    - `invoices` - Add missing fields for proper invoicing
      - `user_id` (uuid, references auth.users)
      - `access_token` (text, unique) - For public invoice access
      - `issue_date` (date)
      - `client_address` (text, optional)
      - `subtotal` (numeric)
      - `tax` (numeric)
      - `total` (numeric)

  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated user access
    - Allow public read access for invoices via access_token

  4. Indexes
    - Add indexes for foreign keys and frequently queried fields
    - Add index for access_token lookups

  5. Functions
    - Create function to generate invoice numbers
    - Create trigger to auto-generate access tokens
*/

-- ============================================
-- 1. CREATE PROFILES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  company_name text,
  company_address text,
  company_phone text,
  company_logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- ============================================
-- 2. UPDATE INVOICES TABLE
-- ============================================

-- Add missing columns to invoices table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'user_id') THEN
    ALTER TABLE invoices ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'access_token') THEN
    ALTER TABLE invoices ADD COLUMN access_token text UNIQUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'issue_date') THEN
    ALTER TABLE invoices ADD COLUMN issue_date date DEFAULT CURRENT_DATE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'client_address') THEN
    ALTER TABLE invoices ADD COLUMN client_address text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'subtotal') THEN
    ALTER TABLE invoices ADD COLUMN subtotal numeric DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'tax') THEN
    ALTER TABLE invoices ADD COLUMN tax numeric DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'total') THEN
    ALTER TABLE invoices ADD COLUMN total numeric DEFAULT 0;
  END IF;
END $$;

-- Create index on user_id and access_token
CREATE INDEX IF NOT EXISTS invoices_user_id_idx ON invoices(user_id);
CREATE INDEX IF NOT EXISTS invoices_access_token_idx ON invoices(access_token) WHERE access_token IS NOT NULL;

-- Update RLS policies for invoices
DROP POLICY IF EXISTS "Users can read own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can insert own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can update own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can delete own invoices" ON invoices;
DROP POLICY IF EXISTS "Public can view invoices with token" ON invoices;

CREATE POLICY "Users can read own invoices"
  ON invoices
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Public can view invoices with token"
  ON invoices
  FOR SELECT
  TO anon
  USING (access_token IS NOT NULL);

CREATE POLICY "Users can insert own invoices"
  ON invoices
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own invoices"
  ON invoices
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own invoices"
  ON invoices
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- ============================================
-- 3. CREATE INVOICE_ITEMS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  quantity numeric DEFAULT 1 NOT NULL,
  unit_price numeric DEFAULT 0 NOT NULL,
  amount numeric DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS invoice_items_invoice_id_idx ON invoice_items(invoice_id);

ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view invoice items for own invoices"
  ON invoice_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Public can view invoice items with token"
  ON invoice_items
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.access_token IS NOT NULL
    )
  );

CREATE POLICY "Users can insert invoice items for own invoices"
  ON invoice_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can update invoice items for own invoices"
  ON invoice_items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can delete invoice items for own invoices"
  ON invoice_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = (SELECT auth.uid())
    )
  );

-- ============================================
-- 4. CREATE PAYMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  payment_method text,
  stripe_payment_id text UNIQUE,
  status text DEFAULT 'pending' NOT NULL,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payments_invoice_id_idx ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS payments_stripe_payment_id_idx ON payments(stripe_payment_id) WHERE stripe_payment_id IS NOT NULL;

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view payments for own invoices"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = payments.invoice_id
      AND invoices.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Public can view payments with token"
  ON payments
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = payments.invoice_id
      AND invoices.access_token IS NOT NULL
    )
  );

CREATE POLICY "System can insert payments"
  ON payments
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "System can update payments"
  ON payments
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = payments.invoice_id
      AND invoices.user_id = (SELECT auth.uid())
    )
  );

-- ============================================
-- 5. UTILITY FUNCTIONS
-- ============================================

-- Function to generate unique invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number integer;
  invoice_num text;
BEGIN
  SELECT COUNT(*) + 1 INTO next_number FROM invoices;
  invoice_num := 'INV-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(next_number::text, 5, '0');
  RETURN invoice_num;
END;
$$;

-- Function to auto-generate access tokens for invoices
CREATE OR REPLACE FUNCTION generate_access_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64');
END;
$$;

-- Trigger to auto-generate access token on invoice insert
CREATE OR REPLACE FUNCTION set_invoice_access_token()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.access_token IS NULL THEN
    NEW.access_token := generate_access_token();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS invoice_access_token_trigger ON invoices;
CREATE TRIGGER invoice_access_token_trigger
  BEFORE INSERT ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION set_invoice_access_token();

-- ============================================
-- 6. ADD UPDATED_AT TRIGGER FOR NEW TABLES
-- ============================================

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_invoice_items_updated_at ON invoice_items;
CREATE TRIGGER update_invoice_items_updated_at
  BEFORE UPDATE ON invoice_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
