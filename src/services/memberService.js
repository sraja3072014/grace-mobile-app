// src/services/memberService.js
import { getSupabase } from '../utils/supabaseClient';
import { sanitizeMemberPayload } from '../utils/schemaSanitizer';

function requireSupabase() {
  const client = getSupabase();
  if (!client) {
    throw new Error('Local Vault mode active: Cloud Supabase is not configured.');
  }
  return client;
}

export async function fetchAllMembers() {
  const client = requireSupabase();
  const { data, error } = await client
    .from('members')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching members:', error);
    throw error;
  }

  return data || [];
}

export async function upsertMember(memberData) {
  const client = requireSupabase();
  const sanitized = sanitizeMemberPayload(memberData);

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
 */
export async function batchUpsertMembers(records = [], removedIds = []) {
  const client = requireSupabase();

  // 1. Single Atomic Batch Upsert
  if (Array.isArray(records) && records.length > 0) {
    const sanitizedBatch = records.map(record => sanitizeMemberPayload(record));
    const { error: upsertError } = await client
      .from('members')
      .upsert(sanitizedBatch, { onConflict: 'id' });

    if (upsertError) {
      console.error('Error in batch member upsert:', upsertError);
      throw upsertError;
    }
  }

  // 2. Single Atomic Batch Delete
  if (Array.isArray(removedIds) && removedIds.length > 0) {
    const { error: deleteError } = await client
      .from('members')
      .delete()
      .in('id', removedIds);

    if (deleteError) {
      console.error('Error in batch member deletion:', deleteError);
      throw deleteError;
    }
  }

  return true;
}

export async function deleteMemberById(memberId) {
  const client = requireSupabase();
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
  const client = requireSupabase();
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
