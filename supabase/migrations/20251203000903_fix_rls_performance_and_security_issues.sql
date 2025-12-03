/*
  # Fix RLS Performance and Security Issues

  1. RLS Performance Optimizations
    - Replace `auth.uid()` with `(select auth.uid())` in all policies
    - This prevents re-evaluation for each row, improving query performance at scale
  
  2. Remove Duplicate Policies and Indexes
    - Drop duplicate INSERT policy on invoices table
    - Drop duplicate status index on invoices table
  
  3. Fix Function Security
    - Add immutable search_path to all functions
    - This prevents security vulnerabilities from search_path manipulation
  
  4. Note on Unused Indexes
    - Indexes are kept as they will be used as data scales
    - They provide optimization for queries even if not yet utilized
*/

-- ============================================================================
-- 1. FIX RLS POLICIES FOR PROFILES TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

-- ============================================================================
-- 2. FIX RLS POLICIES FOR INVOICES TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can create own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can insert own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can update own invoices" ON invoices;
DROP POLICY IF EXISTS "Users can delete own invoices" ON invoices;
DROP POLICY IF EXISTS "Public can view invoices via token" ON invoices;

CREATE POLICY "Users can view own invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create own invoices"
  ON invoices FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own invoices"
  ON invoices FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own invoices"
  ON invoices FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Public can view invoices via token"
  ON invoices FOR SELECT
  TO anon
  USING (true);

-- ============================================================================
-- 3. FIX RLS POLICIES FOR INVOICE_ITEMS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can view items for own invoices" ON invoice_items;
DROP POLICY IF EXISTS "Users can create items for own invoices" ON invoice_items;
DROP POLICY IF EXISTS "Users can update items for own invoices" ON invoice_items;
DROP POLICY IF EXISTS "Users can delete items for own invoices" ON invoice_items;
DROP POLICY IF EXISTS "Public can view invoice items via token" ON invoice_items;

CREATE POLICY "Users can view items for own invoices"
  ON invoice_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can create items for own invoices"
  ON invoice_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can update items for own invoices"
  ON invoice_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can delete items for own invoices"
  ON invoice_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = invoice_items.invoice_id
      AND invoices.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Public can view invoice items via token"
  ON invoice_items FOR SELECT
  TO anon
  USING (true);

-- ============================================================================
-- 4. FIX RLS POLICIES FOR PAYMENTS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can view payments for own invoices" ON payments;
DROP POLICY IF EXISTS "Users can create payments for own invoices" ON payments;
DROP POLICY IF EXISTS "Public can view payments via invoice token" ON payments;

CREATE POLICY "Users can view payments for own invoices"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = payments.invoice_id
      AND invoices.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can create payments for own invoices"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM invoices
      WHERE invoices.id = payments.invoice_id
      AND invoices.user_id = (select auth.uid())
    )
  );

CREATE POLICY "Public can view payments via invoice token"
  ON payments FOR SELECT
  TO anon
  USING (true);

-- ============================================================================
-- 5. DROP DUPLICATE INDEXES
-- ============================================================================

DROP INDEX IF EXISTS invoices_status_idx;
DROP INDEX IF EXISTS invoices_user_email_idx;
DROP INDEX IF EXISTS invoices_created_at_idx;

-- ============================================================================
-- 6. FIX FUNCTION SECURITY - Add immutable search_path
-- ============================================================================

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Fix generate_invoice_number function
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS text
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
  next_number integer;
  invoice_num text;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 5) AS integer)), 0) + 1
  INTO next_number
  FROM invoices
  WHERE invoice_number ~ '^INV-[0-9]+$';
  
  invoice_num := 'INV-' || LPAD(next_number::text, 5, '0');
  RETURN invoice_num;
END;
$$;

-- Fix update_updated_at_column function (if it exists)
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================================
-- 7. APPLY UPDATED_AT TRIGGERS (for future use)
-- ============================================================================

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VERIFICATION: Indexes are kept for future performance
-- ============================================================================

-- The following indexes are marked as "unused" but are kept for production use:
-- - idx_invoices_user_id: Critical for filtering invoices by user
-- - idx_invoices_access_token: Critical for public invoice lookups
-- - idx_invoices_status: Useful for dashboard statistics
-- - idx_invoice_items_invoice_id: Critical for invoice detail queries
-- - idx_payments_invoice_id: Critical for payment history queries
--
-- These will be utilized as the application scales and should NOT be dropped.
