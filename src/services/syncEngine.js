// src/services/syncEngine.js
/**
 * ⚡ GraceOS Bidirectional Sync Engine
 *
 * Handles true two-way synchronization between Supabase cloud and local
 * localStorage cache, resolving conflicts via `updated_at` timestamps.
 *
 * Strategy:
 *   - Remote-newer  → download & update local cache
 *   - Local-newer   → batch upsert to Supabase
 *   - Remote-only   → pull down and merge into local
 *   - Local-only    → push up to Supabase
 *
 * All payloads are sanitized through schemaSanitizer before dispatch
 * to prevent schema cache errors (e.g. strips emergency_contact).
 */

import { getSupabase } from '../utils/supabaseClient';
import { sanitizeMemberPayload } from '../utils/schemaSanitizer';
import {
  getCachedMembers,
  cacheMembers,
  MEMBERS_SYNC_META_KEY,
} from './memberService';

/** Dispatch a custom DOM event for UI listeners */
function emit(name, detail = {}) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  }
}

/**
 * Parse an ISO timestamp string into a numeric epoch (ms).
 * Returns 0 for null / invalid values so records without a
 * timestamp are always treated as "older".
 */
function toEpoch(isoString) {
  if (!isoString) return 0;
  const ms = Date.parse(isoString);
  return isNaN(ms) ? 0 : ms;
}

/**
 * Perform a full bidirectional sync for the `public.members` table.
 *
 * @param {Object}   [opts]
 * @param {Function} [opts.onProgress]  Called with { phase, message } during sync
 * @param {Function} [opts.onComplete]  Called with { merged, pushed, pulled } on success
 * @param {Function} [opts.onError]     Called with an Error on failure
 * @returns {Promise<{ merged: Object[], pushed: number, pulled: number }>}
 */
export async function bidirectionalSyncMembers(opts = {}) {
  const { onProgress, onComplete, onError } = opts;

  const progress = (phase, message) => {
    console.info(`[SyncEngine] [${phase}] ${message}`);
    if (onProgress) onProgress({ phase, message });
  };

  // ── Guard: network ────────────────────────────────────────────────────────
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    const err = new Error('Device is offline. Sync skipped.');
    if (onError) onError(err);
    throw err;
  }

  // ── Guard: Supabase configured ────────────────────────────────────────────
  const client = getSupabase();
  if (!client) {
    const err = new Error('No cloud pairing configured. Connect to Supabase first.');
    if (onError) onError(err);
    throw err;
  }

  try {
    // ── Phase 1: Fetch all remote records ─────────────────────────────────
    progress('FETCH', 'Fetching remote records from Supabase…');

    const { data: remoteRows, error: fetchError } = await client
      .from('members')
      .select('*')
      .order('updated_at', { ascending: false });

    if (fetchError) throw fetchError;

    const remoteRecords = Array.isArray(remoteRows) ? remoteRows : [];
    progress('FETCH', `Retrieved ${remoteRecords.length} remote records.`);

    // ── Phase 2: Load local cache ─────────────────────────────────────────
    progress('LOCAL', 'Reading local cache…');
    const localRecords = getCachedMembers();
    progress('LOCAL', `Found ${localRecords.length} local records.`);

    // Build lookup maps keyed by record id (string-coerced for safety)
    const remoteMap = new Map(remoteRecords.map(r => [String(r.id), r]));
    const localMap  = new Map(localRecords.map(r  => [String(r.id || r.memberId), r]));

    const toUpsertRemote = []; // local-newer  → push to Supabase
    const toUpdateLocal  = []; // remote-newer → pull into local cache
    let   pulled = 0;

    // ── Phase 3: Diff & classify ──────────────────────────────────────────
    progress('DIFF', 'Comparing timestamps and classifying records…');

    // Walk over remote records
    remoteRecords.forEach(remote => {
      const id    = String(remote.id);
      const local = localMap.get(id);

      if (!local) {
        // Remote-only → pull down
        toUpdateLocal.push(remote);
        return;
      }

      const remoteTs = toEpoch(remote.updated_at);
      const localTs  = toEpoch(local.updated_at || local.created_at);

      if (remoteTs > localTs) {
        // Remote is newer → update local
        toUpdateLocal.push(remote);
      } else if (localTs > remoteTs) {
        // Local is newer → push to remote
        toUpsertRemote.push(local);
      }
      // Equal timestamps → no-op
    });

    // Walk over local records that have NO remote counterpart → push up
    localRecords.forEach(local => {
      const id = String(local.id || local.memberId);
      if (!remoteMap.has(id)) {
        toUpsertRemote.push(local);
      }
    });

    progress(
      'DIFF',
      `↑ ${toUpsertRemote.length} local-newer  |  ↓ ${toUpdateLocal.length} remote-newer/remote-only`
    );

    // ── Phase 4: Push local-newer records to Supabase ─────────────────────
    let pushed = 0;
    if (toUpsertRemote.length > 0) {
      progress('PUSH', `Uploading ${toUpsertRemote.length} local record(s) to Supabase…`);

      // Sanitize every payload before dispatch (strips emergency_contact etc.)
      const sanitizedBatch = toUpsertRemote.map(rec => ({
        ...sanitizeMemberPayload(rec),
        updated_at: rec.updated_at || new Date().toISOString(),
      }));

      const { error: upsertError } = await client
        .from('members')
        .upsert(sanitizedBatch, { onConflict: 'id' });

      if (upsertError) {
        console.warn('[SyncEngine] Upsert error (non-fatal):', upsertError);
        emit('grace_sync_warning', { message: upsertError.message });
      } else {
        pushed = sanitizedBatch.length;
        progress('PUSH', `Successfully uploaded ${pushed} record(s).`);
      }
    }

    // ── Phase 5: Merge remote-newer records into local cache ──────────────
    if (toUpdateLocal.length > 0) {
      progress('PULL', `Merging ${toUpdateLocal.length} remote record(s) into local cache…`);

      // Start from current local state, then overlay remote winners
      const mergedMap = new Map(localRecords.map(r => [String(r.id || r.memberId), r]));

      toUpdateLocal.forEach(remote => {
        mergedMap.set(String(remote.id), remote);
      });

      pulled = toUpdateLocal.length;

      // Persist merged cache
      const mergedArray = Array.from(mergedMap.values());
      cacheMembers(mergedArray);
      progress('PULL', `Local cache updated — ${mergedArray.length} total records.`);
    }

    // ── Phase 6: Build final merged list for UI consumption ───────────────
    progress('FINALIZE', 'Finalizing merged member list…');

    // Re-read cache (reflects both local winners and freshly pulled remote)
    const finalRecords = getCachedMembers();

    // Update sync metadata
    const meta = {
      lastBidirSyncAt: new Date().toISOString(),
      count: finalRecords.length,
      pushedCount: pushed,
      pulledCount: pulled,
      platform: 'desktop',
    };
    try {
      localStorage.setItem(MEMBERS_SYNC_META_KEY, JSON.stringify(meta));
    } catch { /* non-fatal */ }

    progress('DONE', `Sync complete. ↑${pushed} pushed, ↓${pulled} pulled, ${finalRecords.length} total.`);

    const result = { merged: finalRecords, pushed, pulled };
    if (onComplete) onComplete(result);
    emit('grace_bidir_sync_complete', result);
    return result;

  } catch (err) {
    console.error('[SyncEngine] Bidirectional sync failed:', err);
    emit('grace_bidir_sync_error', { message: err.message });
    if (onError) onError(err);
    throw err;
  }
}

/**
 * Read sync metadata written by the last bidirectional sync run.
 * @returns {{ lastBidirSyncAt: string|null, count: number, pushedCount: number, pulledCount: number }|null}
 */
export function getSyncMeta() {
  try {
    const raw = localStorage.getItem(MEMBERS_SYNC_META_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const VISITORS_CACHE_KEY = 'graceos_vault_visitors';

function visitorFromRow(row = {}) {
  return {
    ...row,
    id: String(row.id || ''),
    name: row.name || '',
    phone: row.phone || '',
    area: row.area || '',
    invitedBy: row.invited_by || row.invitedBy || '',
    stage: row.stage || 'FIRST_VISIT',
    visitDate: row.visit_date || row.visitDate || '',
    notes: row.notes || '',
    updated_at: row.updated_at || null
  };
}

function visitorToRow(visitor = {}) {
  const row = {
    id: String(visitor.id || ''),
    name: visitor.name || '',
    phone: visitor.phone || '',
    area: visitor.area || '',
    invited_by: visitor.invitedBy || visitor.invited_by || '',
    stage: visitor.stage || 'FIRST_VISIT',
    visit_date: visitor.visitDate || visitor.visit_date || null,
    notes: visitor.notes || ''
  };
  if (visitor.updated_at) row.updated_at = visitor.updated_at;
  return row;
}

export function getCachedVisitors() {
  try {
    const raw = localStorage.getItem(VISITORS_CACHE_KEY);
    if (!raw) return [];
    const records = JSON.parse(raw);
    return Array.isArray(records) ? records.map(visitorFromRow) : [];
  } catch (error) {
    console.warn('[SyncEngine] Unable to read the visitor cache:', error);
    return [];
  }
}

export function cacheVisitors(records = []) {
  if (!Array.isArray(records)) return;
  localStorage.setItem(VISITORS_CACHE_KEY, JSON.stringify(records.map(visitorFromRow)));
}

export async function batchUpsertVisitors(records = [], removedIds = []) {
  if (!Array.isArray(records) || records.some(visitor => !visitor?.id)) {
    throw new Error('Every visitor record must have an ID before it can be saved.');
  }
  const cached = getCachedVisitors();
  const byId = new Map(cached.map(visitor => [String(visitor.id), visitor]));
  records.forEach(visitor => {
    if (visitor?.id) byId.set(String(visitor.id), visitorFromRow(visitor));
  });
  const removed = new Set(removedIds.map(String));
  removed.forEach(id => byId.delete(id));
  cacheVisitors([...byId.values()]);

  const client = getSupabase();
  if (!client || (typeof navigator !== 'undefined' && !navigator.onLine)) return true;

  if (records.length) {
    const { error } = await client
      .from('visitors')
      .upsert(records.map(visitorToRow), { onConflict: 'id' });
    if (error) throw error;
  }
  if (removed.size) {
    const { error } = await client.from('visitors').delete().in('id', [...removed]);
    if (error) throw error;
  }
  return true;
}

export async function syncVisitors() {
  const localRecords = getCachedVisitors();
  const client = getSupabase();
  if (!client || (typeof navigator !== 'undefined' && !navigator.onLine)) {
    return localRecords;
  }

  const { data, error } = await client.from('visitors').select('*');
  if (error) throw error;

  const remoteRecords = (data || []).map(visitorFromRow);
  const remoteById = new Map(remoteRecords.map(visitor => [String(visitor.id), visitor]));
  const mergedById = new Map(remoteById);
  const localToPush = [];

  for (const local of localRecords) {
    const remote = remoteById.get(String(local.id));
    if (!remote) {
      localToPush.push(local);
      mergedById.set(String(local.id), local);
      continue;
    }

    const localTime = Date.parse(local.updated_at || '') || 0;
    const remoteTime = Date.parse(remote.updated_at || '') || 0;
    if (localTime > remoteTime) {
      localToPush.push(local);
      mergedById.set(String(local.id), local);
    }
  }

  if (localToPush.length) {
    await batchUpsertVisitors(localToPush);
  }
  const merged = [...mergedById.values()];
  cacheVisitors(merged);
  return merged;
}

let realtimeChannel = null;
let realtimeClient = null;
let realtimeSubscribers = new Set();
let realtimeQueue = [];
let realtimeTimer = null;
let realtimeStatus = 'DISCONNECTED';
let realtimeError = null;

function updateRealtimeCache(payload) {
  const row = payload.eventType === 'DELETE' ? payload.old : payload.new;
  if (!row?.id) return;

  if (payload.table === 'members') {
    const members = getCachedMembers();
    const updated = payload.eventType === 'DELETE'
      ? members.filter(member => String(member.id || member.memberId) !== String(row.id))
      : members.some(member => String(member.id || member.memberId) === String(row.id))
        ? members.map(member => String(member.id || member.memberId) === String(row.id) ? { ...member, ...row } : member)
        : [row, ...members];
    cacheMembers(updated);
  } else if (payload.table === 'visitors') {
    const visitors = getCachedVisitors();
    const updated = payload.eventType === 'DELETE'
      ? visitors.filter(visitor => String(visitor.id) !== String(row.id))
      : visitors.some(visitor => String(visitor.id) === String(row.id))
        ? visitors.map(visitor => String(visitor.id) === String(row.id) ? visitorFromRow({ ...visitor, ...row }) : visitor)
        : [visitorFromRow(row), ...visitors];
    cacheVisitors(updated);
  }
}

function flushRealtimeQueue() {
  const events = realtimeQueue;
  realtimeQueue = [];
  events.forEach(payload => {
    updateRealtimeCache(payload);
    realtimeSubscribers.forEach(handlers => {
      handlers.onPayload?.(payload);
      const row = payload.eventType === 'DELETE' ? payload.old : payload.new;
      if (!row) return;
      if (payload.eventType === 'INSERT') handlers.onInsert?.(row, payload);
      if (payload.eventType === 'UPDATE') handlers.onUpdate?.(row, payload);
      if (payload.eventType === 'DELETE') handlers.onDelete?.(row, payload);
    });
  });
}

function dispatchRealtime(payload) {
  realtimeQueue.push(payload);
  if (realtimeTimer) clearTimeout(realtimeTimer);
  realtimeTimer = setTimeout(flushRealtimeQueue, 800);
}

function notifyRealtimeStatus(status, error) {
  realtimeStatus = status;
  realtimeError = error || null;
  realtimeSubscribers.forEach(handlers => handlers.onStatus?.(status, error));
}

function ensureRealtimeChannel(client) {
  if (realtimeChannel) return;
  realtimeClient = client;
  try {
    realtimeChannel = client
      .channel('grace_mobile_data_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, dispatchRealtime)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'visitors' }, dispatchRealtime)
      .subscribe((status, error) => {
        notifyRealtimeStatus(status, error);
        if (status === 'SUBSCRIBED') {
          emit('grace_realtime_connected', { channel: 'grace_mobile_data_realtime' });
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          emit('grace_realtime_error', { status, error });
        } else if (status === 'CLOSED') {
          emit('grace_realtime_disconnected', { channel: 'grace_mobile_data_realtime' });
        }
      });
  } catch (error) {
    realtimeChannel = null;
    realtimeClient = null;
    throw error;
  }
}

export function subscribeRealtimeChanges(handlers = {}) {
  const client = getSupabase();
  if (!client) {
    console.warn('[SyncEngine] Realtime subscription skipped: no Supabase client.');
    handlers.onStatus?.('CLOSED');
    return { unsubscribe: () => {} };
  }

  realtimeSubscribers.add(handlers);
  if (realtimeChannel) handlers.onStatus?.(realtimeStatus, realtimeError);
  try {
    ensureRealtimeChannel(client);
  } catch (error) {
    realtimeSubscribers.delete(handlers);
    console.error('[SyncEngine] Failed to create the shared realtime channel:', error);
    handlers.onStatus?.('CHANNEL_ERROR', error);
    return { unsubscribe: () => {} };
  }

  return {
    unsubscribe: () => {
      realtimeSubscribers.delete(handlers);
      if (!realtimeSubscribers.size && realtimeChannel) {
        if (realtimeTimer) clearTimeout(realtimeTimer);
        realtimeTimer = null;
        realtimeQueue = [];
        realtimeClient?.removeChannel(realtimeChannel);
        realtimeChannel = null;
        realtimeClient = null;
        realtimeStatus = 'DISCONNECTED';
        realtimeError = null;
      }
    }
  };
}

/**
 * Backward-compatible member-only callback adapter over the shared channel.
 */
export function subscribeRealtimeMembers({ onInsert, onUpdate, onDelete } = {}) {
  return subscribeRealtimeChanges({
    onInsert: (row, payload) => {
      if (payload.table === 'members') onInsert?.(row, payload);
    },
    onUpdate: (row, payload) => {
      if (payload.table === 'members') onUpdate?.(row, payload);
    },
    onDelete: (row, payload) => {
      if (payload.table === 'members') onDelete?.(row, payload);
    }
  });
}
