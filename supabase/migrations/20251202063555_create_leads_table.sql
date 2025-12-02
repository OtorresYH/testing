/*
  # Create leads table for trial signups

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `email` (text, unique, not null) - User's email address
      - `name` (text) - User's full name
      - `business_type` (text) - Type of business (freelancer, service pro, local shop)
      - `phone` (text) - Optional phone number
      - `source` (text) - Where they signed up from (hero, pricing, final-cta)
      - `plan_interest` (text) - Which plan they're interested in (starter, team)
      - `created_at` (timestamptz) - When they signed up
      - `status` (text) - Lead status (new, contacted, converted)
  
  2. Security
    - Enable RLS on `leads` table
    - Add policy for inserting new leads (public access for signup)
    - Add policy for service role to read all leads
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  business_type text,
  phone text,
  source text DEFAULT 'unknown',
  plan_interest text DEFAULT 'starter',
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert leads"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Service role can read all leads"
  ON leads
  FOR SELECT
  TO service_role
  USING (true);
