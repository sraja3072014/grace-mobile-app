// src/lib/supabase.js
// Re-export dynamically initialized client from zero-hardcode local vault
export { 
  supabase, 
  getSupabase, 
  isVaultConfigured, 
  getVaultCredentials, 
  saveVaultCredentials, 
  testSupabaseConnection 
} from '../utils/supabaseClient';
