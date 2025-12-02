import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Lead {
  id?: string;
  email: string;
  name?: string;
  business_type?: string;
  phone?: string;
  source?: string;
  plan_interest?: string;
  status?: string;
  created_at?: string;
}

export const createLead = async (leadData: Lead) => {
  const { data, error } = await supabase
    .from('leads')
    .insert([leadData])
    .select()
    .maybeSingle();

  if (error) {
    if (error.code === '23505') {
      throw new Error('This email is already registered for a trial.');
    }
    throw new Error(error.message || 'Failed to submit. Please try again.');
  }

  return data;
};
