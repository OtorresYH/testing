/*
  # Create AI Activity Logging Tables

  1. New Tables
    - `ai_email_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `invoice_id` (uuid, references invoices, optional)
      - `type` (text) - email type (invoice_created, payment_reminder, etc)
      - `subject` (text) - generated subject line
      - `body_text` (text) - generated email body (text)
      - `body_html` (text) - generated email body (HTML)
      - `extra_notes` (text) - user's custom notes
      - `created_at` (timestamptz)
    
    - `ai_support_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users, optional)
      - `session_start` (timestamptz)
      - `session_end` (timestamptz, optional)
      - `message_count` (integer)
      - `created_at` (timestamptz)
    
    - `ai_support_messages`
      - `id` (uuid, primary key)
      - `session_id` (uuid, references ai_support_sessions)
      - `role` (text) - user, assistant, or system
      - `content` (text) - message content
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Users can view their own logs
    - Service role can insert logs (for Netlify Functions)
*/

-- ============================================
-- AI EMAIL LOGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS ai_email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  invoice_id uuid REFERENCES invoices(id) ON DELETE SET NULL,
  type text NOT NULL,
  subject text NOT NULL,
  body_text text NOT NULL,
  body_html text,
  extra_notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_email_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own email logs
CREATE POLICY "Users can view own email logs"
  ON ai_email_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role can insert logs (for Netlify Functions)
CREATE POLICY "Service role can insert email logs"
  ON ai_email_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Index for user queries
CREATE INDEX IF NOT EXISTS ai_email_logs_user_id_idx ON ai_email_logs(user_id);
CREATE INDEX IF NOT EXISTS ai_email_logs_invoice_id_idx ON ai_email_logs(invoice_id);

-- ============================================
-- AI SUPPORT SESSIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS ai_support_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_start timestamptz DEFAULT now(),
  session_end timestamptz,
  message_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_support_sessions ENABLE ROW LEVEL SECURITY;

-- Users can view their own sessions
CREATE POLICY "Users can view own support sessions"
  ON ai_support_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Anyone can view anonymous sessions (no user_id)
CREATE POLICY "Anyone can view anonymous sessions"
  ON ai_support_sessions FOR SELECT
  TO anon, authenticated
  USING (user_id IS NULL);

-- Service role can insert/update sessions
CREATE POLICY "Service role can insert support sessions"
  ON ai_support_sessions FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Service role can update support sessions"
  ON ai_support_sessions FOR UPDATE
  TO authenticated, anon
  USING (true);

-- Index for user queries
CREATE INDEX IF NOT EXISTS ai_support_sessions_user_id_idx ON ai_support_sessions(user_id);

-- ============================================
-- AI SUPPORT MESSAGES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS ai_support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES ai_support_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_support_messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages from their sessions
CREATE POLICY "Users can view messages from their sessions"
  ON ai_support_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_support_sessions
      WHERE ai_support_sessions.id = session_id
      AND ai_support_sessions.user_id = auth.uid()
    )
  );

-- Anyone can view messages from anonymous sessions
CREATE POLICY "Anyone can view messages from anonymous sessions"
  ON ai_support_messages FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_support_sessions
      WHERE ai_support_sessions.id = session_id
      AND ai_support_sessions.user_id IS NULL
    )
  );

-- Service role can insert messages
CREATE POLICY "Service role can insert support messages"
  ON ai_support_messages FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Index for session queries
CREATE INDEX IF NOT EXISTS ai_support_messages_session_id_idx ON ai_support_messages(session_id);
CREATE INDEX IF NOT EXISTS ai_support_messages_created_at_idx ON ai_support_messages(created_at);
