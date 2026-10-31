// src/hooks/useVaultStorage.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { getSupabase, isVaultConfigured } from '../utils/supabaseClient';
import { deleteHousehold, fetchAllMembers } from '../services/memberService';

export function useVaultStorage(tableName, initialFallbackData = []) {
  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem(`graceos_vault_${tableName}`);
      return cached ? JSON.parse(cached) : initialFallbackData;
    } catch {
      return initialFallbackData;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const fallbackRef = useRef(initialFallbackData);

  // 1. Fetch & Parse (Supabase -> Mobile App Vault)
  const loadData = useCallback(async () => {
    setIsLoading(true);

    if (isVaultConfigured()) {
      const client = getSupabase();
      if (client) {
        try {
          const { data: cloudData, error } = tableName === 'members'
            ? { data: await fetchAllMembers(), error: null }
            : await client
              .from(tableName)
              .select('*');

          if (!error && Array.isArray(cloudData) && (cloudData.length > 0 || tableName === 'members')) {
            const parsedCloudData = cloudData.map(row => {
              let payload = {};
              if (row.raw_payload) {
                payload = typeof row.raw_payload === 'string' 
                  ? JSON.parse(row.raw_payload) 
                  : row.raw_payload;
              }

              const householdPayload = Boolean(
                payload.headMember ||
                Array.isArray(payload.members) ||
                typeof payload.members === 'string'
              );

              return {
                ...row,
                id: row.id || row.family_id || payload.familyId,
                familyId: row.family_id || row.id || payload.familyId,
                familyName: row.family_name || payload.familyName,
                campus: row.campus || payload.campus || 'Main Sanctuary',
                ...payload,
                ...(householdPayload ? {
                  headMember: {
                    ...(payload.headMember || {}),
                    name: payload.headMember?.name || row.head_name,
                    phone: payload.headMember?.phone || row.phone
                  }
                } : {})
              };
            });

            setData(parsedCloudData);
            localStorage.setItem(`graceos_vault_${tableName}`, JSON.stringify(parsedCloudData));
            setIsCloudSynced(true);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.warn(`[Vault] Cloud sync skipped for ${tableName}:`, err);
        }
      }
    }

    // Local Vault fallback
    try {
      const localData = localStorage.getItem(`graceos_vault_${tableName}`);
      if (localData) {
        setData(JSON.parse(localData));
      } else {
        setData(fallbackRef.current);
        localStorage.setItem(`graceos_vault_${tableName}`, JSON.stringify(fallbackRef.current));
      }
    } catch {
      setData(fallbackRef.current);
    }

    setIsCloudSynced(false);
    setIsLoading(false);
  }, [tableName]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Listen to vault credential changes to auto-refresh
  useEffect(() => {
    const handleVaultChange = () => {
      loadData();
    };
    window.addEventListener('grace_vault_credentials_changed', handleVaultChange);
    return () => window.removeEventListener('grace_vault_credentials_changed', handleVaultChange);
  }, [loadData]);

  // 2. Save & Push (Mobile App Vault -> Supabase Delta)
  const saveData = async (updatedData) => {
    // 1. Always save immediately to local offline vault
    setData(updatedData);
    localStorage.setItem(`graceos_vault_${tableName}`, JSON.stringify(updatedData));

    // 2. Delta Push to Cloud if configured
    if (isVaultConfigured()) {
      const client = getSupabase();
      if (client) {
        try {
          const exactPayload = updatedData.map((item, idx) => {
            const head = item.headMember || {};
            const famId = String(item.familyId || item.id || `FAM-${idx + 101}`);
            const famName = item.familyName || `${head.name || 'Believer'} & Household`;
            const headName = head.name || item.head_name || 'Believer';
            const phone = head.phone || item.phone || '';
            const campus = item.campus || head.campus || 'Main Sanctuary';

            return {
              id: famId,
              family_id: famId,
              family_name: famName,
              head_name: headName,
              phone: phone,
              campus: campus,
              raw_payload: typeof item === 'string' ? item : JSON.stringify(item),
              updated_at: new Date().toISOString()
            };
          });

          const { error } = await client
            .from(tableName)
            .upsert(exactPayload, { onConflict: 'id' });

          if (error) {
            throw error;
          }

          setIsCloudSynced(true);
          return true;
        } catch (err) {
          setIsCloudSynced(false);
          console.warn(`[Vault] Cloud push deferred to background:`, err);
        }
      }
    }

    setIsCloudSynced(false);
    return true;
  };

  const deleteData = async (recordId) => {
    if (isVaultConfigured()) {
      const client = getSupabase();
      if (client) {
        try {
          if (tableName === 'members') {
            await deleteHousehold(recordId);
          } else {
            await client.from(tableName).delete().eq('id', recordId);
          }
        } catch (error) {
          console.warn(`[Vault] Cloud delete deferred:`, error);
        }
      }
    }

    const updatedData = data.filter(item => String(item.familyId || item.id) !== String(recordId));
    setData(updatedData);
    localStorage.setItem(`graceos_vault_${tableName}`, JSON.stringify(updatedData));
    setIsCloudSynced(isVaultConfigured());
    return true;
  };

  return {
    data,
    saveData,
    deleteData,
    isLoading,
    isCloudSynced,
    refreshData: loadData
  };
}
