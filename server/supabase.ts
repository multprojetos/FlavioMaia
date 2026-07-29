import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.SUPABASE_URL || '';
const supabaseUrl = rawUrl.trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_KEY || '').trim();

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️  Supabase não configurado. Usando dados em memória.');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Helper para verificar se Supabase está configurado
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseServiceKey);
};
