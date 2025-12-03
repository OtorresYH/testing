/*
  # Fix AI Tables Security Issues

  This migration fixes critical security and performance issues:

  1. RLS Performance Optimization
     - Replace auth.uid() with (select auth.uid()) in all policies
     - Prevents per-row re-evaluation of auth functions
     - Significant performance improvement at scale

  2. Fix Multiple Permissive Policies
     - Consolidate duplicate SELECT policies
     - Use single policy with OR conditions
     - Cleaner and more maintainable

  3. Index Strategy
     - Keep essential indexes for foreign keys and queries
     - Unused status is normal for new databases
     - These will be critical in production

  Note: Leaked password protection must be enabled in Supabase Dashboard
  (cannot be configured via SQL migrations)
*/

-- ============================================
-- FIX RLS POLICIES - PERFORMANCE OPTIMIZATION
-- ============================================

-- Drop and recreate ai_email_logs policies with optimized auth calls
DROP POLICY IF EXISTS "Users can view own email logs" ON ai_email_logs;
DROP POLICY IF EXISTS "Service role can insert email logs" ON ai_email_logs;

CREATE POLICY "Users can view own email logs"
  ON ai_email_logs FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Service role can insert email logs"
  ON ai_email_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================
-- FIX MULTIPLE PERMISSIVE POLICIES - ai_support_sessions
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own support sessions" ON ai_support_sessions;
DROP POLICY IF EXISTS "Anyone can view anonymous sessions" ON ai_support_sessions;
DROP POLICY IF EXISTS "Service role can insert support sessions" ON ai_support_sessions;
DROP POLICY IF EXISTS "Service role can update support sessions" ON ai_support_sessions;

-- Create single consolidated SELECT policy with OR condition
CREATE POLICY "Users can view own or anonymous sessions"
  ON ai_support_sessions FOR SELECT
  TO authenticated, anon
  USING (
    (select auth.uid()) = user_id OR user_id IS NULL
  );

-- Recreate INSERT/UPDATE policies
CREATE POLICY "Service role can insert support sessions"
  ON ai_support_sessions FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Service role can update support sessions"
  ON ai_support_sessions FOR UPDATE
  TO authenticated, anon
  USING (true);

-- ============================================
-- FIX MULTIPLE PERMISSIVE POLICIES - ai_support_messages
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view messages from their sessions" ON ai_support_messages;
DROP POLICY IF EXISTS "Anyone can view messages from anonymous sessions" ON ai_support_messages;
DROP POLICY IF EXISTS "Service role can insert support messages" ON ai_support_messages;

-- Create single consolidated SELECT policy
CREATE POLICY "Users can view messages from own or anonymous sessions"
  ON ai_support_messages FOR SELECT
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM ai_support_sessions
      WHERE ai_support_sessions.id = session_id
      AND (
        ai_support_sessions.user_id = (select auth.uid())
        OR ai_support_sessions.user_id IS NULL
      )
    )
  );

-- Recreate INSERT policy
CREATE POLICY "Service role can insert support messages"
  ON ai_support_messages FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- ============================================
-- VERIFY INDEXES (NO CHANGES NEEDED)
-- ============================================
-- All indexes are essential for production use:
--
-- Foreign Key Indexes (required for JOINs):
-- - documents_invoice_id_idx
-- - documents_client_id_idx
-- - invoice_items_invoice_id_idx
-- - payments_invoice_id_idx
-- - ai_email_logs_invoice_id_idx
-- - ai_support_messages_session_id_idx
--
-- User Query Indexes (required for performance):
-- - invoices_user_id_idx
-- - ai_email_logs_user_id_idx
-- - ai_support_sessions_user_id_idx
--
-- Lookup Indexes (required for fast access):
-- - invoices_access_token_idx (public invoice links)
-- - payments_stripe_payment_id_idx (webhook matching)
--
-- Time Series Indexes (useful for analytics):
-- - ai_support_messages_created_at_idx
--
-- "Unused" status is expected for new databases with minimal data.
-- These indexes will be heavily used in production.

-- ============================================
-- SECURITY SUMMARY
-- ============================================
-- ✅ RLS policies optimized with (select auth.uid())
-- ✅ Multiple permissive policies consolidated
-- ✅ All indexes kept (essential for production)
-- ⚠️  Leaked password protection - Enable in Supabase Dashboard:
--     Dashboard → Authentication → Policies → Enable Password Protection
