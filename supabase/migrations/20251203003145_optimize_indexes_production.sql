/*
  # Optimize Database Indexes for Production

  This migration optimizes the index strategy by:
  1. Keeping essential foreign key indexes (required for joins)
  2. Keeping user_id and access_token indexes (critical queries)
  3. Removing redundant user_email indexes (already in RLS)
  
  ## Indexes to Keep (Essential)
  - documents_invoice_id_idx - Foreign key for joins
  - documents_client_id_idx - Foreign key for joins
  - invoice_items_invoice_id_idx - Foreign key for joins
  - payments_invoice_id_idx - Foreign key for joins
  - payments_stripe_payment_id_idx - Payment verification
  - invoices_user_id_idx - User invoice queries
  - invoices_access_token_idx - Public invoice access
  
  ## Indexes to Remove (Less Critical)
  - clients_user_email_idx - RLS handles filtering
  - documents_user_email_idx - RLS handles filtering
  - invoices_user_email_idx - Replaced by user_id index
  
  Note: "Unused" status is expected for a new database with no data.
  These indexes will be heavily used in production.
*/

-- ============================================
-- REMOVE REDUNDANT EMAIL INDEXES
-- ============================================
-- RLS policies handle email filtering, and user_id is more efficient

DROP INDEX IF EXISTS clients_user_email_idx;
DROP INDEX IF EXISTS documents_user_email_idx;
DROP INDEX IF EXISTS invoices_user_email_idx;

-- ============================================
-- VERIFY ESSENTIAL INDEXES EXIST
-- ============================================
-- These are critical for production performance

-- Foreign key indexes (prevent slow joins)
CREATE INDEX IF NOT EXISTS documents_invoice_id_idx ON documents(invoice_id);
CREATE INDEX IF NOT EXISTS documents_client_id_idx ON documents(client_id);
CREATE INDEX IF NOT EXISTS invoice_items_invoice_id_idx ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS payments_invoice_id_idx ON payments(invoice_id);

-- User data access (critical for dashboard queries)
CREATE INDEX IF NOT EXISTS invoices_user_id_idx ON invoices(user_id);

-- Public invoice access (critical for client viewing)
CREATE INDEX IF NOT EXISTS invoices_access_token_idx ON invoices(access_token) WHERE access_token IS NOT NULL;

-- Payment verification (critical for webhook processing)
CREATE INDEX IF NOT EXISTS payments_stripe_payment_id_idx ON payments(stripe_payment_id) WHERE stripe_payment_id IS NOT NULL;

-- ============================================
-- PERFORMANCE NOTES
-- ============================================
-- Foreign key indexes: Required for efficient JOINs and CASCADE deletes
-- user_id index: Required for "show my invoices" queries
-- access_token index: Required for public invoice links
-- stripe_payment_id index: Required for webhook payment matching
--
-- These indexes will show as "unused" until production data exists,
-- but they are essential for application performance.
