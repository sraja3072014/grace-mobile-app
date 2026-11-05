import { useState, useEffect, useRef, useCallback } from 'react';
import { isVaultConfigured } from '../utils/supabaseClient';
import { subscribeRealtimeChanges } from '../services/syncEngine';

/**
 * Subscribes to the shared Supabase Realtime channel and dispatches events
 * for the requested tables. The channel multiplexes members and visitors.
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
  const tableKey = (Array.isArray(options.tables) ? options.tables : [table]).join(',');

  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [channelStatus, setChannelStatus] = useState('DISCONNECTED');
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [lastEvent, setLastEvent] = useState(null);
  const [error, setError] = useState(null);
  const callbacksRef = useRef({});
  const subscriptionRef = useRef(null);
  const connectedRef = useRef(false);
  const tablesRef = useRef(new Set(tableKey.split(',')));

  useEffect(() => {
    callbacksRef.current = { onInsert, onUpdate, onDelete, onPayload, onSync };
    tablesRef.current = new Set(tableKey.split(','));
  }, [onInsert, onUpdate, onDelete, onPayload, onSync, tableKey]);

  useEffect(() => {
    connectedRef.current = isRealtimeConnected;
  }, [isRealtimeConnected]);

  const teardownChannel = useCallback(() => {
    subscriptionRef.current?.unsubscribe();
    subscriptionRef.current = null;
    connectedRef.current = false;
    setIsRealtimeConnected(false);
    setChannelStatus('DISCONNECTED');
  }, [setIsRealtimeConnected, setChannelStatus]);

  const setupChannel = useCallback(() => {
    teardownChannel();
    if (!enabled || !isVaultConfigured() || (typeof navigator !== 'undefined' && !navigator.onLine)) return;

    setChannelStatus('SUBSCRIBING');
    subscriptionRef.current = subscribeRealtimeChanges({
      onPayload: (payload) => {
        if (payload.schema !== schema || !tablesRef.current.has(payload.table)) return;
        setLastEvent({ ...payload, receivedAt: new Date().toISOString() });
        callbacksRef.current.onPayload?.(payload);
        const row = payload.eventType === 'DELETE' ? payload.old : payload.new;
        if (!row) return;
        if (payload.eventType === 'INSERT') callbacksRef.current.onInsert?.(row, payload);
        if (payload.eventType === 'UPDATE') callbacksRef.current.onUpdate?.(row, payload);
        if (payload.eventType === 'DELETE') callbacksRef.current.onDelete?.(row, payload);
      },
      onStatus: (status, subscriptionError) => {
        setChannelStatus(status);
        if (status === 'SUBSCRIBED') {
          connectedRef.current = true;
          setIsRealtimeConnected(true);
          setError(null);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          connectedRef.current = false;
          setIsRealtimeConnected(false);
          setError(subscriptionError || new Error(`Channel status: ${status}`));
        } else if (status === 'CLOSED') {
          connectedRef.current = false;
          setIsRealtimeConnected(false);
        }
      }
    });
  }, [
    enabled,
    schema,
    teardownChannel,
    setChannelStatus,
    setLastEvent,
    setIsRealtimeConnected,
    setError
  ]);

  const handleResync = useCallback(() => {
    callbacksRef.current.onSync?.();
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setupChannel();
      handleResync();
    };
    const handleOffline = () => {
      setIsOnline(false);
      teardownChannel();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        if (!subscriptionRef.current || !connectedRef.current) setupChannel();
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
    const setupTimer = window.setTimeout(setupChannel, 0);

    return () => {
      window.clearTimeout(setupTimer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('grace_vault_credentials_changed', handleVaultChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      teardownChannel();
    };
  }, [setupChannel, teardownChannel, handleResync]);

  const resync = useCallback(() => {
    setupChannel();
    handleResync();
  }, [setupChannel, handleResync]);

  return {
    isRealtimeConnected,
    channelStatus,
    isOnline,
    isOffline: !isOnline,
    lastEvent,
    error,
    resync
  };
}
