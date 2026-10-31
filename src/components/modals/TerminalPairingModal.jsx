import { useEffect, useRef, useState } from 'react';
import { Camera, CheckCircle2, FileImage, LockKeyhole, WifiOff, X } from 'lucide-react';
import { configureSupabaseSession, isVaultConfigured, parsePairingPayload } from '../../utils/supabaseClient';

export default function TerminalPairingModal({ isOpen, onClose, theme = {}, onPaired }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [mode, setMode] = useState('welcome');
  const [status, setStatus] = useState('');

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  };

  const handlePayload = (rawPayload) => {
    try {
      const payload = parsePairingPayload(rawPayload);
      configureSupabaseSession(payload.supabaseUrl, payload.supabaseAnonKey);
      setMode('paired');
      setStatus(`Paired to ${payload.campus || 'GraceOS campus'} cloud vault.`);
      stopCamera();
      onPaired?.(payload);
    } catch (error) {
      setStatus(error.message);
    }
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    setMode(isVaultConfigured() ? 'paired' : 'welcome');
    setStatus('');
    return () => stopCamera();
  }, [isOpen]);

  useEffect(() => {
    if (mode !== 'scanner' || !videoRef.current || !navigator.mediaDevices?.getUserMedia) return undefined;
    let cancelled = false;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        if (cancelled) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        return videoRef.current.play();
      })
      .catch(() => setStatus('Camera access was unavailable. Use the QR image option below.'));

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [mode]);

  useEffect(() => {
    if (mode !== 'scanner' || typeof window.BarcodeDetector === 'undefined') return undefined;
    const timer = window.setInterval(async () => {
      if (!videoRef.current || videoRef.current.readyState < 2) return;
      try {
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
        const codes = await detector.detect(videoRef.current);
        if (codes[0]?.rawValue) handlePayload(codes[0].rawValue);
      } catch {
        // Browser QR detection is optional; the image upload fallback remains available.
      }
    }, 700);
    return () => window.clearInterval(timer);
  }, [mode]);

  const handleImageScan = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (typeof window.BarcodeDetector === 'undefined') {
      setStatus('This browser cannot decode QR images. Open the pairing page in a modern mobile browser or use the camera scanner.');
      return;
    }
    try {
      const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
      const codes = await detector.detect(await createImageBitmap(file));
      if (!codes[0]?.rawValue) throw new Error('No QR code was found in that image.');
      handlePayload(codes[0].rawValue);
    } catch (error) {
      setStatus(error.message || 'Unable to scan that QR image.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-[32px] border border-white/15 bg-slate-950/90 p-5 text-white shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-300"><LockKeyhole size={16} /><span className="text-[10px] font-mono uppercase tracking-[0.2em]">GraceOS Secure Pairing</span></div>
            <h2 className="mt-2 text-xl font-black">{mode === 'paired' ? 'Mobile terminal paired' : 'Pair this terminal'}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"><X size={18} /></button>
        </div>

        {mode === 'welcome' && (
          <div className="mt-5 space-y-3">
            <p className="text-sm leading-relaxed text-white/70">Connect to the desktop portal without typing a Supabase URL or API key. Your member directory remains available offline.</p>
            <button type="button" onClick={() => setMode('scanner')} className="flex w-full items-center gap-3 rounded-2xl border border-cyan-400/40 bg-cyan-400/15 p-4 text-left hover:bg-cyan-400/25" style={{ color: theme.accent || '#67e8f9' }}>
              <Camera size={20} /><span><strong className="block">Scan QR from Desktop Portal</strong><small className="text-white/60">Use camera or upload a QR screenshot</small></span>
            </button>
            <button type="button" onClick={() => { setMode('offline'); onPaired?.({ offline: true }); }} className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:bg-white/10">
              <WifiOff size={20} className="text-amber-300" /><span><strong className="block">Continue Offline / Demo Mode</strong><small className="text-white/60">Open the local Indexed Vault immediately</small></span>
            </button>
          </div>
        )}

        {mode === 'scanner' && (
          <div className="mt-5 space-y-3">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-cyan-300/30 bg-black">
              <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-8 rounded-2xl border-2 border-cyan-300/80 shadow-[0_0_30px_rgba(34,211,238,0.4)]" />
            </div>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm font-bold hover:bg-white/10"><FileImage size={16} /> Upload QR screenshot<input type="file" accept="image/*" onChange={handleImageScan} className="hidden" /></label>
            <button type="button" onClick={() => { stopCamera(); setMode('welcome'); }} className="w-full rounded-xl p-2 text-xs text-white/60">Back to pairing options</button>
          </div>
        )}

        {(mode === 'paired' || mode === 'offline') && (
          <div className="mt-5 space-y-4 text-center">
            <CheckCircle2 size={48} className="mx-auto text-emerald-400" />
            <p className="text-sm text-white/70">{status || 'Local directory is ready. You can continue working without a network connection.'}</p>
            <button type="button" onClick={onClose} className="w-full rounded-2xl bg-emerald-500/80 p-3 font-bold text-white hover:bg-emerald-500">Open Members Directory</button>
          </div>
        )}

        {status && mode === 'scanner' && <p className="mt-3 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs text-amber-200">{status}</p>}
      </div>
    </div>
  );
}