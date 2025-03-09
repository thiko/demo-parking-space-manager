import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseAnonKey) {
    console.error('Supabase Anon Key fehlt. Bitte stelle sicher, dass die Umgebungsvariable VITE_SUPABASE_ANON_KEY gesetzt ist.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 