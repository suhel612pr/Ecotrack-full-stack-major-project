import { createClient, SupabaseClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

let supabaseClientInstance: SupabaseClient | null = null;

// Only initialize if the keys are valid and not placeholders
const isRealUrl = supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' && !supabaseUrl.includes('dummy-sandbox-project');
const isRealKey = supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' && !supabaseAnonKey.includes('dummy-anon-key');

if (isRealUrl && isRealKey) {
  try {
    supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    console.log('EcoTrack AI DB Layer: Connected to real Supabase/PostgreSQL.');
  } catch (err) {
    console.error('EcoTrack AI DB Layer: Failed to initialize Supabase client:', err);
  }
} else {
  console.log('EcoTrack AI DB Layer: Supabase keys missing or placeholders. Running in highly resilient Local/Simulation Mode.');
}

export function getSupabase(): SupabaseClient | null {
  return supabaseClientInstance;
}

export function isSupabaseActive(): boolean {
  return supabaseClientInstance !== null;
}
