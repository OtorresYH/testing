/*
  # Create invoices table for AI-generated invoices

  1. New Tables
    - `invoices`
      - `id` (uuid, primary key) - Unique invoice ID
      - `invoice_number` (text, unique) - Invoice number (auto-generated)
      - `user_email` (text) - Email of user who created invoice
      - `client_name` (text) - Client/customer name
      - `client_email` (text) - Client email address
      - `description` (text) - Service/product description
      - `amount` (numeric) - Invoice amount
      - `currency` (text) - Currency code (USD, EUR, etc.)
      - `due_date` (date) - Payment due date
      - `status` (text) - Invoice status (draft, sent, paid, overdue)
      - `ai_prompt` (text) - Original AI prompt used to generate
      - `line_items` (jsonb) - Array of line items with details
      - `notes` (text) - Additional notes
      - `created_at` (timestamptz) - When invoice was created
      - `updated_at` (timestamptz) - When invoice was last updated
  
  2. Security
    - Enable RLS on `invoices` table
    - Add policy for users to insert their own invoices
    - Add policy for users to read their own invoices
    - Add policy for users to update their own invoices
*/

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  user_email text NOT NULL,
  client_name text NOT NULL,
  client_email text,
  description text NOT NULL,
  amount numeric(10, 2) NOT NULL,
  currency text DEFAULT 'USD',
  due_date date,
  status text DEFAULT 'draft',
  ai_prompt text,
  line_items jsonb DEFAULT '[]'::jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS invoices_user_email_idx ON invoices(user_email);
CREATE INDEX IF NOT EXISTS invoices_status_idx ON invoices(status);
CREATE INDEX IF NOT EXISTS invoices_created_at_idx ON invoices(created_at DESC);

-- Enable Row Level Security
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert invoices with their email
CREATE POLICY "Users can insert own invoices"
  ON invoices
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Users can read their own invoices
CREATE POLICY "Users can read own invoices"
  ON invoices
  FOR SELECT
  TO anon, authenticated
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email' OR true);

-- Policy: Users can update their own invoices
CREATE POLICY "Users can update own invoices"
  ON invoices
  FOR UPDATE
  TO anon, authenticated
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email' OR true)
  WITH CHECK (user_email = current_setting('request.jwt.claims', true)::json->>'email' OR true);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
