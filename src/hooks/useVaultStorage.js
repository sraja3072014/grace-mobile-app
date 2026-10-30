// src/hooks/useVaultStorage.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../utils/supabaseClient';
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

  // 1. Fetch & Parse (Supabase -> Mobile App)
  const loadData = useCallback(async () => {
    setIsLoading(true);

    if (supabase) {
      try {
        const { data: cloudData, error } = tableName === 'members'
          ? { data: await fetchAllMembers(), error: null }
          : await supabase
            .from(tableName)
            .select('*');

        if (!error && Array.isArray(cloudData) && (cloudData.length > 0 || tableName === 'members')) {
          // Supabase-ன் raw_payload மற்றும் நேரடிக் காலம்களை ஒருங்கிணைத்தல்
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
              campus: row.campus || payload.campus || 'Headquarters',
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
        console.warn(`[Vault] Cloud sync skipped for ${tableName}`, err);
      }
    }

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

  // 2. Save & Push (Mobile App -> Supabase Exact Columns)
  const saveData = async (updatedData) => {
    // உள்ளூர் சேமிப்பு
    setData(updatedData);
    localStorage.setItem(`graceos_vault_${tableName}`, JSON.stringify(updatedData));

    // Supabase சேமிப்பு (உங்கள் டேபிளின் அசல் காலம்கள் வடிவில்)
    if (supabase) {
      try {
        const exactPayload = updatedData.map((item, idx) => {
          const head = item.headMember || {};
          const famId = String(item.familyId || item.id || `FAM-${idx + 101}`);
          const famName = item.familyName || `${head.name || 'Believer'} & Household`;
          const headName = head.name || item.head_name || 'Believer';
          const phone = head.phone || item.phone || '';
          const campus = item.campus || head.campus || 'Headquarters';

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

        const { error } = await supabase
          .from(tableName)
          .upsert(exactPayload, { onConflict: 'id' });

        if (error) {
          throw error;
        }

        setIsCloudSynced(true);
        return true;
      } catch (err) {
        setIsCloudSynced(false);
        console.error(`[Vault] Cloud save exception:`, err);
        throw err;
      }
    }

    setIsCloudSynced(false);
    return true;
  };

  const deleteData = async (recordId) => {
    if (tableName === 'members' && supabase) {
      try {
        await deleteHousehold(recordId);
      } catch (error) {
        setIsCloudSynced(false);
        throw error;
      }
    } else if (supabase) {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', recordId);

      if (error) {
        setIsCloudSynced(false);
        console.error(`[Vault] Cloud delete exception for ${tableName}:`, error);
        throw error;
      }
    }

    const updatedData = data.filter(item => String(item.familyId || item.id) !== String(recordId));
    setData(updatedData);
    localStorage.setItem(`graceos_vault_${tableName}`, JSON.stringify(updatedData));
    setIsCloudSynced(Boolean(supabase));
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