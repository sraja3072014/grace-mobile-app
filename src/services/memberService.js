// src/services/memberService.js
import { getSupabase } from '../utils/supabaseClient';

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
  const { error } = await client
    .from('members')
    .upsert({
      ...memberData,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });

  if (error) {
    console.error('Error saving member to cloud:', error);
    throw error;
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
