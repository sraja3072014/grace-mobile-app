// src/hooks/useRealtimeSync.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { getSupabase, isVaultConfigured } from '../utils/supabaseClient';

/**
 * Custom hook to subscribe to Supabase Realtime Postgres Changes
 * on specified table (default 'members') with automatic offline detection,
 * reconnection handling, and anti-desynchronization guard.
 *
 * @param {Object} options
 * @param {string} [options.table='members'] - Supabase table name
 * @param {string} [options.schema='public'] - Database schema
 * @param {boolean} [options.enabled=true] - Whether subscription is active
 * @param {Function} [options.onInsert] - Callback when a row is inserted
 * @param {Function} [options.onUpdate] - Callback when a row is updated
 * @param {Function} [options.onDelete] - Callback when a row is deleted
 * @param {Function} [options.onPayload] - Callback for all postgres changes
 * @param {Function} [options.onSync] - Callback invoked when connection is restored to reconcile data
 */
export function useRealtimeSync(options = {}) {
  const {
    table = 'members',
    schema = 'public',
    enabled = true,
    onInsert,
    onUpdate,
    onDelete,
    onPayload,
    onSync
  } = options;

  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [channelStatus, setChannelStatus] = useState('DISCONNECTED'); // 'DISCONNECTED' | 'SUBSCRIBING' | 'SUBSCRIBED' | 'ERROR'
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [lastEvent, setLastEvent] = useState(null);
  const [error, setError] = useState(null);

  // Store callbacks in refs to avoid re-subscribing on every parent render
  const callbacksRef = useRef({ onInsert, onUpdate, onDelete, onPayload, onSync });
  useEffect(() => {
    callbacksRef.current = { onInsert, onUpdate, onDelete, onPayload, onSync };
  }, [onInsert, onUpdate, onDelete, onPayload, onSync]);

  const channelRef = useRef(null);

  // Cleanup helper
  const teardownChannel = useCallback(() => {
    if (channelRef.current) {
      try {
        const client = getSupabase();
        if (client) {
          client.removeChannel(channelRef.current);
        } else {
          channelRef.current.unsubscribe();
        }
      } catch (err) {
        console.warn('[useRealtimeSync] Error tearing down channel:', err);
      }
      channelRef.current = null;
    }
    setIsRealtimeConnected(false);
    setChannelStatus('DISCONNECTED');
  }, []);

  // Setup channel helper
  const setupChannel = useCallback(() => {
    teardownChannel();

    if (!enabled || !isVaultConfigured() || (typeof navigator !== 'undefined' && !navigator.onLine)) {
      return;
    }

    const client = getSupabase();
    if (!client) {
      return;
    }

    try {
      setChannelStatus('SUBSCRIBING');
      const channelId = `realtime_${table}_${Date.now()}`;

      const channel = client
        .channel(channelId)
        .on(
          'postgres_changes',
          { event: '*', schema, table },
          (payload) => {
            const timestamp = new Date().toISOString();
            setLastEvent({ ...payload, receivedAt: timestamp });

            if (callbacksRef.current.onPayload) {
              callbacksRef.current.onPayload(payload);
            }

            switch (payload.eventType) {
              case 'INSERT':
                if (callbacksRef.current.onInsert) {
                  callbacksRef.current.onInsert(payload.new, payload);
                }
                break;
              case 'UPDATE':
                if (callbacksRef.current.onUpdate) {
                  callbacksRef.current.onUpdate(payload.new, payload);
                }
                break;
              case 'DELETE':
                if (callbacksRef.current.onDelete) {
                  callbacksRef.current.onDelete(payload.old, payload);
                }
                break;
              default:
                break;
            }
          }
        )
        .subscribe((status, subError) => {
          setChannelStatus(status);
          if (status === 'SUBSCRIBED') {
            setIsRealtimeConnected(true);
            setError(null);
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            setIsRealtimeConnected(false);
            setError(subError || new Error(`Channel status: ${status}`));
          } else if (status === 'CLOSED') {
            setIsRealtimeConnected(false);
          }
        });

      channelRef.current = channel;
    } catch (err) {
      console.error('[useRealtimeSync] Failed to initialize realtime channel:', err);
      setError(err);
      setIsRealtimeConnected(false);
      setChannelStatus('ERROR');
    }
  }, [table, schema, enabled, teardownChannel]);

  // Reconciliation handler to guard against state desynchronization
  const handleResync = useCallback(() => {
    if (callbacksRef.current.onSync) {
      callbacksRef.current.onSync();
    }
  }, []);

  // Network online/offline and visibility event listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // When network comes back online:
      // 1. Re-establish realtime channel
      setupChannel();
      // 2. Trigger reconciliation to guard against state desync while offline
      handleResync();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsRealtimeConnected(false);
      setChannelStatus('DISCONNECTED');
      teardownChannel();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        // App brought to foreground: check channel health, resync
        if (!channelRef.current || !isRealtimeConnected) {
          setupChannel();
        }
        handleResync();
      }
    };

    const handleVaultChange = () => {
      setupChannel();
      handleResync();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('grace_vault_credentials_changed', handleVaultChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial setup on mount
    setupChannel();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('grace_vault_credentials_changed', handleVaultChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      teardownChannel();
    };
  }, [setupChannel, teardownChannel, handleResync]);

  return {
    isRealtimeConnected,
    channelStatus,
    isOnline,
    isOffline: !isOnline,
    lastEvent,
    error,
    resync: () => {
      setupChannel();
      handleResync();
    }
  };
}

