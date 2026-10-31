// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const VAULT_STORAGE_KEY = 'grace_mobile_vault_credentials';

// Simple reversible XOR + Base64 vault encryption to prevent plaintext secrets storage on device
const VAULT_SALT = 'GraceOS_Mobile_Vault_Key_2026';
function encryptVaultString(str) {
  if (!str) return '';
  try {
    const bytes = new TextEncoder().encode(str);
    const saltBytes = new TextEncoder().encode(VAULT_SALT);
    const xorBytes = bytes.map((b, i) => b ^ saltBytes[i % saltBytes.length]);
    return btoa(String.fromCharCode(...xorBytes));
  } catch (e) {
    return btoa(str);
  }
}

function decryptVaultString(str) {
  if (!str) return '';
  try {
    const raw = atob(str);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
    const saltBytes = new TextEncoder().encode(VAULT_SALT);
    const xorBytes = bytes.map((b, i) => b ^ saltBytes[i % saltBytes.length]);
    return new TextDecoder().decode(xorBytes);
  } catch (e) {
    try {
      return atob(str);
    } catch {
      return str;
    }
  }
}

/**
 * Retrieve decrypted Supabase Vault credentials from local storage
 */
export function getVaultCredentials() {
  try {
    const stored = localStorage.getItem(VAULT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        supabaseUrl: decryptVaultString(parsed.encryptedUrl),
        supabaseAnonKey: decryptVaultString(parsed.encryptedKey),
        connectedAt: parsed.connectedAt || null
      };
    }
  } catch (err) {
    console.warn('[Vault] Failed reading credentials from vault:', err);
  }

  // Fallback to optional env variables during dev/build if configured, but never hardcoded strings
  const envUrl = import.meta.env?.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';
  if (envUrl && envKey && !envUrl.includes('YOUR_PROJECT_ID')) {
    return {
      supabaseUrl: envUrl,
      supabaseAnonKey: envKey,
      connectedAt: null,
      isFromEnv: true
    };
  }

  return { supabaseUrl: '', supabaseAnonKey: '', connectedAt: null };
}

/**
 * Save encrypted credentials into local vault & broadcast update
 */
export function saveVaultCredentials(supabaseUrl, supabaseAnonKey) {
  const cleanUrl = (supabaseUrl || '').trim();
  const cleanKey = (supabaseAnonKey || '').trim();

  if (!cleanUrl || !cleanKey) {
    clearVaultCredentials();
    return;
  }

  const payload = {
    encryptedUrl: encryptVaultString(cleanUrl),
    encryptedKey: encryptVaultString(cleanKey),
    connectedAt: new Date().toISOString()
  };

  localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(payload));
  _activeClient = null; // Reset singleton client to refresh
  notifyVaultChange();
}

/**
 * Clear vault credentials
 */
export function clearVaultCredentials() {
  localStorage.removeItem(VAULT_STORAGE_KEY);
  _activeClient = null;
  notifyVaultChange();
}

/**
 * Check if the local vault has active cloud credentials
 */
export function isVaultConfigured() {
  const { supabaseUrl, supabaseAnonKey } = getVaultCredentials();
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20
  );
}

// Unified singleton cache
let _activeClient = null;

/**
 * Unified getSupabase() singleton getter
 * Dynamically constructs client when credentials exist; returns null in pure local vault mode.
 */
export function getSupabase() {
  if (_activeClient) return _activeClient;

  const { supabaseUrl, supabaseAnonKey } = getVaultCredentials();
  if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://')) {
    try {
      _activeClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      return _activeClient;
    } catch (err) {
      console.error('[Vault] Supabase initialization failed:', err);
      return null;
    }
  }

  return null;
}

/**
 * Test connectivity with supplied credentials
 */
export async function testSupabaseConnection(testUrl, testKey) {
  try {
    const url = (testUrl || '').trim();
    const key = (testKey || '').trim();
    if (!url || !key) return { ok: false, error: 'URL and Anon Key are required.' };

    const client = createClient(url, key);
    // Lightweight count query on members table
    const { error } = await client
      .from('members')
      .select('id', { count: 'exact', head: true });

    if (error && error.code !== 'PGRST116') {
      return { ok: false, error: error.message || 'Failed connecting to table' };
    }
    return { ok: true, error: null };
  } catch (err) {
    return { ok: false, error: err.message || 'Network request failed' };
  }
}

function notifyVaultChange() {
  window.dispatchEvent(new CustomEvent('grace_vault_credentials_changed'));
}

/**
 * Dynamic Proxy export for backward compatibility with `import { supabase } from '...'`
 */
export const supabase = new Proxy({}, {
  get(target, prop) {
    const client = getSupabase();
    if (!client) {
      if (prop === 'then') return undefined; // Prevent async await from choking
      return undefined;
    }
    const value = client[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  }
});
