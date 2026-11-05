import { HeartHandshake } from 'lucide-react';
import GlassCard from '../common/GlassCard';

export default function MemberGivingPortal() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <HeartHandshake size={18} className="text-emerald-400" />
        <h2 className="text-base font-extrabold">Personal Giving</h2>
      </div>
      <GlassCard className="space-y-2 p-5 text-white">
        <h3 className="text-sm font-bold">Your Giving Portal</h3>
        <p className="text-xs leading-relaxed text-white/70">
          View your personal giving records here. Church-wide income, expenses, and payroll are restricted to authorized staff.
        </p>
        <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/60">
          No personal giving records are available yet.
        </p>
      </GlassCard>
    </div>
  );
}
