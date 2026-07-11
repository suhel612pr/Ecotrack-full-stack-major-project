import { createClient, SupabaseClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};
const supabaseUrl = String(env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = String(env.VITE_SUPABASE_ANON_KEY || '').trim();

const hasSupabaseUrl = supabaseUrl.length > 0;
const hasSupabaseAnonKey = supabaseAnonKey.length > 0;
const hasSupabaseVars = hasSupabaseUrl && hasSupabaseAnonKey;

let supabaseClientInstance: SupabaseClient | null = null;

function createSupabaseClient(): SupabaseClient | null {
  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.error('Failed to create Supabase client using current environment values:', err);
    return null;
  }
}

if (hasSupabaseVars) {
  supabaseClientInstance = createSupabaseClient();
} else {
  console.error('Supabase credentials are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.');
}

export function getSupabase(): SupabaseClient | null {
  return supabaseClientInstance;
}

export function isSupabaseActive(): boolean {
  return hasSupabaseVars;
}
