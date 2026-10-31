// src/services/memberService.js
import { getSupabase } from '../utils/supabaseClient';
import { sanitizeMemberPayload } from '../utils/schemaSanitizer';

export const MEMBERS_CACHE_KEY = 'graceos_vault_members';
export const MEMBERS_SYNC_META_KEY = 'grace_members_sync_meta';

function notifyOfflineVault(reason = 'Cloud unavailable') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('grace_offline_vault_active', { detail: { reason } }));
  }
}

/**
 * Retrieve cached members from LocalStorage
 */
export function getCachedMembers() {
  try {
    const raw = localStorage.getItem(MEMBERS_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[memberService] Error reading cached members:', err);
    return [];
  }
}

/**
 * Cache member records locally upon successful fetch
 */
export function cacheMembers(records = []) {
  if (!Array.isArray(records)) return;
  try {
    localStorage.setItem(MEMBERS_CACHE_KEY, JSON.stringify(records));
    const meta = {
      lastSyncedAt: new Date().toISOString(),
      count: records.length,
      platform: 'mobile'
    };
    localStorage.setItem(MEMBERS_SYNC_META_KEY, JSON.stringify(meta));
  } catch (err) {
    console.warn('[memberService] Error caching members to localStorage:', err);
  }
}

/**
 * Update or insert a single member in local cache
 */
export function updateCachedMember(memberRecord) {
  if (!memberRecord || !memberRecord.id) return;
  try {
    const current = getCachedMembers();
    const index = current.findIndex(m => String(m.id) === String(memberRecord.id));
    let next;
    if (index >= 0) {
      next = [...current];
      next[index] = { ...next[index], ...memberRecord };
    } else {
      next = [memberRecord, ...current];
    }
    cacheMembers(next);
  } catch (err) {
    console.warn('[memberService] Error updating cached member:', err);
  }
}

/**
 * Remove a member from local cache
 */
export function removeCachedMember(memberId) {
  if (!memberId) return;
  try {
    const current = getCachedMembers();
    const idStr = String(memberId);
    const next = current.filter(m => String(m.id) !== idStr && String(m.memberId) !== idStr);
    cacheMembers(next);
  } catch (err) {
    console.warn('[memberService] Error removing cached member:', err);
  }
}

function requireSupabase() {
  const client = getSupabase();
  if (!client) {
    throw new Error('Local Vault mode active: Cloud Supabase is not configured.');
  }
  return client;
}

/**
 * Fetch all members with Offline-First Resilience:
 * 1. Checks network status; if offline, serves cached directory immediately.
 * 2. Fetches from Supabase and atomically updates local vault cache on success.
 * 3. Gracefully catches network/cloud failures and falls back to cached records.
 */
export async function fetchAllMembers(options = {}) {
  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

  // 1. Explicitly offline: serve cached directory
  if (isOffline) {
    console.info('[memberService] Offline mode active: Serving cached member directory');
    notifyOfflineVault('Device is offline');
    return getCachedMembers();
  }

  // 2. Unconfigured Supabase: serve cached directory
  const client = getSupabase();
  if (!client) {
    console.info('[memberService] Cloud client unconfigured: Serving cached member directory');
    notifyOfflineVault('No cloud pairing configured');
    return getCachedMembers();
  }

  // 3. Cloud query with cache update and graceful fallback
  try {
    const { data, error } = await client
      .from('members')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('[memberService] Supabase fetch error, serving cached directory:', error);
      const cached = getCachedMembers();
      if (cached && cached.length > 0) {
        notifyOfflineVault(error.message || 'Supabase fetch failed');
        return cached;
      }
      notifyOfflineVault(error.message || 'Supabase fetch failed');
      return [];
    }

    if (Array.isArray(data)) {
      // 🌟 Atomically cache member records locally upon successful fetch
      cacheMembers(data);
      return data;
    }

    return [];
  } catch (err) {
    console.warn('[memberService] Fetch exception, gracefully serving cached directory:', err);
    const cached = getCachedMembers();
    if (cached && cached.length > 0) {
      notifyOfflineVault(err.message || 'Network request failed');
      return cached;
    }
    notifyOfflineVault(err.message || 'Network request failed');
    return [];
  }
}

export async function upsertMember(memberData) {
  const sanitized = sanitizeMemberPayload(memberData);

  // 🌟 Immediately persist to local cache for 0ms offline responsiveness
  updateCachedMember(sanitized);

  const client = getSupabase();
  if (!client || (typeof navigator !== 'undefined' && !navigator.onLine)) {
    // Offline mode: saved to local vault, will sync when reconnected
    return true;
  }

  const { error } = await client
    .from('members')
    .upsert({
      ...sanitized,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });

  if (error) {
    console.error('Error saving member to cloud:', error);
    throw error;
  }

  return true;
}

/**
 * 🌟 Atomic Batch Upsert & Delete:
 * Eliminates serial N+1 HTTP request waterfalls.
 * Dispatches all member records in a single network request.
 * Synchronizes local cache immediately.
 */
export async function batchUpsertMembers(records = [], removedIds = []) {
  const sanitizedBatch = Array.isArray(records) 
    ? records.map(record => sanitizeMemberPayload(record)) 
    : [];

  // 1. Immediately sync to local cache
  try {
    let cached = getCachedMembers();
    sanitizedBatch.forEach(rec => {
      const idx = cached.findIndex(c => String(c.id) === String(rec.id));
      if (idx >= 0) {
        cached[idx] = { ...cached[idx], ...rec };
      } else {
        cached.unshift(rec);
      }
    });

    if (Array.isArray(removedIds) && removedIds.length > 0) {
      const removeSet = new Set(removedIds.map(String));
      cached = cached.filter(c => !removeSet.has(String(c.id)));
    }
    cacheMembers(cached);
  } catch (cacheErr) {
    console.warn('[memberService] Cache sync warning during batch:', cacheErr);
  }

  const client = getSupabase();
  if (!client || (typeof navigator !== 'undefined' && !navigator.onLine)) {
    // Offline: persisted locally
    return true;
  }

  // 2. Single Atomic Batch Upsert to Cloud
  if (sanitizedBatch.length > 0) {
    try {
      const { error: upsertError } = await client
        .from('members')
        .upsert(sanitizedBatch, { onConflict: 'id' });

      if (upsertError) throw upsertError;
    } catch (error) {
      notifyOfflineVault(error.message || 'Cloud upsert failed');
      return true;
    }
  }

  // 3. Single Atomic Batch Delete in Cloud
  if (Array.isArray(removedIds) && removedIds.length > 0) {
    try {
      const { error: deleteError } = await client
        .from('members')
        .delete()
        .in('id', removedIds);

      if (deleteError) throw deleteError;
    } catch (error) {
      notifyOfflineVault(error.message || 'Cloud delete failed');
    }
  }

  return true;
}

export async function deleteMemberById(memberId) {
  // 1. Remove from local cache immediately
  removeCachedMember(memberId);

  const client = getSupabase();
  if (!client || (typeof navigator !== 'undefined' && !navigator.onLine)) {
    return true;
  }

  const { error } = await client
    .from('members')
    .delete()
    .eq('id', memberId);

  if (error) {
    console.error('Error deleting member:', error);
    throw error;
  }

  return true;
}

export async function deleteHousehold(familyId) {
  const client = getSupabase();
  const idStr = String(familyId);

  // 1. Clean local cache of matching family members
  try {
    const cached = getCachedMembers();
    const filtered = cached.filter(m => 
      String(m.family_id) !== idStr && 
      String(m.familyId) !== idStr && 
      String(m.id) !== idStr
    );
    cacheMembers(filtered);
  } catch (err) {
    console.warn('[memberService] Error cleaning local cache for family:', err);
  }

  if (!client || (typeof navigator !== 'undefined' && !navigator.onLine)) {
    return true;
  }

  const { data: familyRows, error: selectError } = await client
    .from('members')
    .select('id')
    .eq('family_id', familyId);

  if (selectError) {
    console.error('Error finding household members:', selectError);
    throw selectError;
  }

  const memberIds = [...new Set([familyId, ...(familyRows || []).map(row => row.id)])];
  const { error } = await client
    .from('members')
    .delete()
    .in('id', memberIds);

  if (error) {
    console.error('Error deleting household:', error);
    throw error;
  }

  return true;
}

export const deleteEntireFamily = deleteHousehold;
