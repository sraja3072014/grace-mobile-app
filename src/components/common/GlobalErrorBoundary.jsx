// src/components/common/GlobalErrorBoundary.jsx
import React, { Component } from 'react';
import { AlertTriangle, RotateCcw, ShieldCheck, RefreshCw } from 'lucide-react';

export default class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[GraceOS Global Error Boundary Intercepted]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetCache = () => {
    try {
      // Clear vault cached states if corrupted
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('graceos_vault_')) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (e) {
      console.warn('Failed clearing cache:', e);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'An unexpected rendering exception occurred.';

      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-[#020617] text-white selection:bg-cyan-500/30 overflow-hidden font-sans">
          {/* Ambient Lighting Orbs */}
          <div 
            className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-40"
            style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
          />
          <div 
            className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-30"
            style={{ background: 'radial-gradient(circle, #f43f5e 0%, transparent 70%)' }}
          />

          {/* Fluent Acrylic Dialog Card */}
          <div 
            className="w-full max-w-md rounded-[32px] p-6 relative z-10 border shadow-2xl backdrop-blur-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(2, 6, 23, 0.95) 100%)',
              borderColor: 'rgba(255, 255, 255, 0.12)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.2)'
            }}
          >
            {/* Header Badge */}
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  GraceOS Vault Protected
                </h1>
                <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                  <ShieldCheck size={12} /> Local Storage & State Safeguarded
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              A runtime component exception occurred. To prevent data corruption in your offline church vault, execution was safely paused.
            </p>

            {/* Diagnostic Message */}
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 mb-5 font-mono text-[11px] text-rose-300/90 break-words max-h-32 overflow-y-auto">
              <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                Diagnostic Trace
              </div>
              {errorMessage}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-3 px-4 rounded-2xl font-bold text-xs text-white flex items-center justify-center gap-2 shadow-lg transition active:scale-98 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                  boxShadow: '0 10px 25px -5px rgba(6, 182, 212, 0.4)'
                }}
              >
                <RotateCcw size={15} />
                <span>Reload Vault Terminal</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetCache}
                className="w-full py-2.5 px-4 rounded-2xl font-semibold text-[11px] text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
              >
                <RefreshCw size={13} />
                <span>Reset Local Cache & Relaunch</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

