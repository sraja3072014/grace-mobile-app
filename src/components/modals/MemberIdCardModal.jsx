// src/components/modals/MemberIdCardModal.jsx
import React from 'react';
import { X, QrCode, ShieldCheck, Church, Phone, Printer } from 'lucide-react';
import CenterModal from '../common/CenterModal';

export default function MemberIdCardModal({
  isOpen,
  onClose,
  member,
  family,
  theme
}) {
  if (!isOpen || !member) return null;

  const churchName = "Grace Cathedral Church";
  const campus = member.campus || "Headquarters";

  // QR Code Payload Format[cite: 6]
  const qrPayload = JSON.stringify({
    id: member.memberId || member.uniqueId || 'MBR-101',
    name: member.name,
    fam: family?.familyId || 'FAM-101',
    ph: member.phone || ''
  });

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrPayload)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <CenterModal
      isOpen={isOpen}
      onClose={onClose}
      title="Smart PVC Member Badge"
      icon={QrCode}
      theme={theme}
      maxWidth="max-w-xs"
    >
      <div className="space-y-4">
        {/* PVC Card Canvas[cite: 6] */}
        <div 
          className="rounded-3xl p-4 border flex flex-col justify-between shadow-2xl relative overflow-hidden select-none"
          style={{
            background: 'linear-gradient(135deg, #090d16 0%, #111827 50%, #1e1b4b 100%)',
            borderColor: 'rgba(245, 158, 11, 0.4)',
            color: '#f8fafc'
          }}
        >
          {/* Ambient Glow */}
          <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-amber-500/15 rounded-full blur-xl pointer-events-none" />

          {/* Card Header[cite: 6] */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <Church size={13} />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-wider text-amber-400 leading-tight">
                  {churchName}
                </h4>
                <span className="text-[7.5px] text-slate-400 font-mono block">
                  {campus}
                </span>
              </div>
            </div>
            <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              VERIFIED
            </span>
          </div>

          {/* Card Body: Member Info + Dynamic QR[cite: 6] */}
          <div className="flex items-center justify-between gap-2 py-3">
            <div className="space-y-1 overflow-hidden">
              <div>
                <span className="text-[7px] uppercase font-bold text-slate-400 block">Believer Name</span>
                <h5 className="text-[13px] font-black text-white truncate leading-tight">
                  {member.name}
                </h5>
              </div>

              <div className="flex items-center gap-1.5 text-[8px] font-mono pt-0.5">
                <span className="text-cyan-300 font-bold">{member.memberId || 'GCC-MBR-1001'}</span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-300 font-bold">{family?.familyId || 'FAM-101'}</span>
              </div>

              <div className="text-[8px] text-slate-300 flex items-center gap-1 truncate pt-0.5">
                <Phone size={9} className="text-emerald-400 shrink-0" />
                <span>{member.phone || 'No direct phone'}</span>
              </div>
            </div>

            {/* Fast Scan QR Box[cite: 6] */}
            <div className="bg-white p-1 rounded-xl shadow-md shrink-0 flex flex-col items-center">
              <img 
                src={qrUrl} 
                alt="Check-in QR"
                className="w-13 h-13 object-contain"
              />
              <span className="text-[6.5px] text-slate-900 font-black tracking-widest mt-0.5 uppercase">
                FAST SCAN
              </span>
            </div>
          </div>

          {/* Card Footer[cite: 6] */}
          <div className="flex items-center justify-between border-t border-white/10 pt-1.5 text-[7px] text-slate-400 font-mono">
            <span>GraceOS Digital Pass</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck size={9} /> {member.bloodGroup ? `Blood: ${member.bloodGroup}` : 'Active Soul'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handlePrint}
          className="w-full py-2.5 rounded-2xl text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer"
          style={{ background: theme.accent }}
        >
          <Printer size={14} />
          <span>Print / Save Badge</span>
        </button>
      </div>
    </CenterModal>
  );
}