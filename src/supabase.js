import { createClient } from '@supabase/supabase-js';

// Access environment variables using import.meta.env for Vite (fallback to dummy for preview without DB)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://glqxyzlmotdtozbirlfv.supabase.co"; 
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_HyK5G1bL2HngyMICs7yeJw_d60Cp...";

export const supabase = createClient(supabaseUrl, supabaseKey);