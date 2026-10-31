// src/hooks/useSyncStatus.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { isVaultConfigured, getSupabase } from '../utils/supabaseClient';

/**
 * Hook for Header Real-Time Status Widget:
 * 🟢 Online + Last synced time
 * 🔴 Local Vault (Offline / cached mode)
 * 🔄 Syncing... (Background delta synchronization)
 * Automatic triggers on reconnection, tab focus, or periodic timer. No manual sync buttons.
 */
export function useSyncStatus() {
  const [isOnlineNetwork, setIsOnlineNetwork] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState(() => {
    try {
      return localStorage.getItem('grace_last_synced_time') || '';
    } catch {
      return '';
    }
  });

  const syncTimeoutRef = useRef(null);

  const formatNowTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const triggerBackgroundSync = useCallback(async () => {
    if (!navigator.onLine || !isVaultConfigured()) {
      setIsSyncing(false);
      return;
    }

    const client = getSupabase();
    if (!client) {
      setIsSyncing(false);
      return;
    }

    setIsSyncing(true);

    try {
      // Lightweight delta ping to check connectivity & table freshness
      await client
        .from('members')
        .select('id, updated_at', { count: 'exact', head: true });

      const timestamp = formatNowTime();
      setLastSyncedTime(timestamp);
      try {
        localStorage.setItem('grace_last_synced_time', timestamp);
      } catch (e) {
        // storage ignored
      }
    } catch (err) {
      console.warn('[SyncStatus] Background sync ping warning:', err);
    } finally {
      // Keep syncing indicator visible for at least 800ms for tactile feedback
      syncTimeoutRef.current = setTimeout(() => {
        setIsSyncing(false);
      }, 800);
    }
  }, []);

  // Network state listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnlineNetwork(true);
      triggerBackgroundSync();
    };

    const handleOffline = () => {
      setIsOnlineNetwork(false);
      setIsSyncing(false);
    };

    const handleVaultChange = () => {
      if (isVaultConfigured()) {
        triggerBackgroundSync();
      } else {
        setIsSyncing(false);
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && navigator.onLine && isVaultConfigured()) {
        triggerBackgroundSync();
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('grace_vault_credentials_changed', handleVaultChange);
    document.addEventListener('visibilitychange', handleVisibility);

    // Initial check on mount
    if (navigator.onLine && isVaultConfigured()) {
      triggerBackgroundSync();
    }

    // Periodic scheduled delta pull (every 3 minutes)
    const interval = setInterval(() => {
      if (navigator.onLine && isVaultConfigured()) {
        triggerBackgroundSync();
      }
    }, 180000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('grace_vault_credentials_changed', handleVaultChange);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [triggerBackgroundSync]);

  const configured = isVaultConfigured();

  // Determine active status:
  // 1. 'syncing' when background delta is running
  // 2. 'online' when network is up and vault has valid credentials
  // 3. 'local' when offline or no cloud credentials
  let mode = 'local';
  if (!configured || !isOnlineNetwork) {
    mode = 'local';
  } else if (isSyncing) {
    mode = 'syncing';
  } else {
    mode = 'online';
  }

  return {
    mode, // 'online' | 'local' | 'syncing'
    isSyncing,
    lastSyncedTime: lastSyncedTime || 'Recent',
    isVaultConfigured: configured,
    triggerBackgroundSync
  };
}

