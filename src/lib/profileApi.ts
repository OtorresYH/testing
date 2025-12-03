import { supabase } from './supabase';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  company_name?: string;
  company_address?: string;
  company_phone?: string;
  company_logo_url?: string;
  created_at?: string;
  updated_at?: string;
}

export async function getProfile(): Promise<{ data: Profile | null; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      return { data: null, error };
    }

    if (!data) {
      const newProfile: Partial<Profile> = {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || '',
      };

      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();

      if (createError) {
        return { data: null, error: createError };
      }

      return { data: createdProfile, error: null };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateProfile(updates: Partial<Profile>): Promise<{ data: Profile | null; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } };
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createProfile(profile: Partial<Profile>): Promise<{ data: Profile | null; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: { message: 'Not authenticated' } };
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        id: user.id,
        email: user.email || '',
        ...profile,
      }])
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}
