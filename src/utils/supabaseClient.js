// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const VAULT_STORAGE_KEY = 'grace_mobile_vault_credentials';
export const PAIRING_PAYLOAD_PREFIX = 'graceos://pair/';

// Simple reversible XOR + Base64 vault encryption to prevent plaintext secrets storage on device
const VAULT_SALT = 'GraceOS_Mobile_Vault_Key_2026';
function encryptVaultString(str) {
  if (!str) return '';
  try {
    const bytes = new TextEncoder().encode(str);
    const saltBytes = new TextEncoder().encode(VAULT_SALT);
    const xorBytes = bytes.map((b, i) => b ^ saltBytes[i % saltBytes.length]);
    return btoa(String.fromCharCode(...xorBytes));
  } catch {
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
  } catch {
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
    const stored = typeof localStorage !== 'undefined'
      ? localStorage.getItem(VAULT_STORAGE_KEY)
      : null;
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

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(payload));
  }
  _activeClient = null; // Reset singleton client to refresh
  notifyVaultChange();
}

/**
 * Clear vault credentials
 */
export function clearVaultCredentials() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(VAULT_STORAGE_KEY);
  }
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

/**
 * Persist scanned credentials and rebuild the active client immediately.
 * This is the single entry point used by the mobile pairing flow.
 */
export function configureSupabaseSession(supabaseUrl, supabaseAnonKey) {
  const url = (supabaseUrl || '').trim();
  const key = (supabaseAnonKey || '').trim();

  if (!url || !key || !url.startsWith('https://')) {
    throw new Error('A valid Supabase HTTPS URL and anon key are required.');
  }

  saveVaultCredentials(url, key);
  return getSupabase();
}

function encodeBase64Url(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeBase64Url(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Create a compact QR-safe pairing string from portal credentials. */
export function createPairingPayload({ campus = 'Headquarters' } = {}) {
  return `${PAIRING_PAYLOAD_PREFIX}${encodeBase64Url(JSON.stringify({
    supabaseUrl: import.meta.env?.VITE_SUPABASE_URL || '',
    supabaseAnonKey: import.meta.env?.VITE_SUPABASE_ANON_KEY || '',
    campus,
    issuedAt: Date.now()
  }))}`;
}

/** Decode either the compact QR format or the raw JSON requested by the portal contract. */
export function parsePairingPayload(rawPayload) {
  const raw = String(rawPayload || '').trim();
  if (!raw) throw new Error('The QR code was empty.');

  try {
    const json = raw.startsWith(PAIRING_PAYLOAD_PREFIX)
      ? decodeBase64Url(raw.slice(PAIRING_PAYLOAD_PREFIX.length))
      : raw;
    const payload = JSON.parse(json);
    if (!payload.supabaseUrl || !payload.supabaseAnonKey) {
      throw new Error('This QR code does not contain Supabase credentials.');
    }
    return payload;
  } catch (error) {
    throw new Error(error.message || 'Unable to read the GraceOS pairing QR code.', { cause: error });
  }
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
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('grace_vault_credentials_changed'));
  }
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
