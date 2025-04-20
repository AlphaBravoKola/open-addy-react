import { createClient } from '@supabase/supabase-js';

// These would be environment variables in a real application
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 