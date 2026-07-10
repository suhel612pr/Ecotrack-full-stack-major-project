import { createClient, SupabaseClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};
const supabaseUrl = String(env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = String(env.VITE_SUPABASE_ANON_KEY || '').trim();

const hasSupabaseUrl = supabaseUrl.length > 0;
const hasSupabaseAnonKey = supabaseAnonKey.length > 0;
const hasSupabaseVars = hasSupabaseUrl && hasSupabaseAnonKey;

console.log('SUPABASE URL', supabaseUrl);
console.log('SUPABASE ANON KEY PRESENT', hasSupabaseAnonKey);
console.log('SUPABASE ACTIVE', hasSupabaseVars);

let supabaseClientInstance: SupabaseClient | null = null;

function createSupabaseClient(): SupabaseClient | null {
  try {
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    console.log('CLIENT CREATED');
    return client;
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
