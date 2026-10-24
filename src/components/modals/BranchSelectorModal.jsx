// src/components/modals/BranchSelectorModal.jsx
import React from 'react';
import { Building2, Check, MapPin } from 'lucide-react';
import CenterModal from '../common/CenterModal';

export default function BranchSelectorModal({
  isOpen,
  onClose,
  branches = [],
  selectedBranch,
  onSelectBranch,
  theme
}) {
  return (
    <CenterModal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Church Campus"
      icon={Building2}
      theme={theme}
    >
      <div className="space-y-2">
        {branches.map((b) => {
          const isSelected = selectedBranch?.id === b.id;
          return (
            <div
              key={b.id}
              onClick={() => {
                onSelectBranch(b);
                onClose();
              }}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer active:scale-95 transition ${
                isSelected 
                  ? 'bg-orange-500/15 border-orange-500' 
                  : 'bg-white/40 dark:bg-white/5 border-black/5 dark:border-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-xs" 
                  style={{ background: theme.accent }}
                >
                  {b.code ? b.code.substring(0, 2) : 'GC'}
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-tight">{b.name}</h4>
                  <span className="text-[10px] opacity-70 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} /> {b.city} • {b.isHQ ? 'Primary HQ' : 'Branch Campus'}
                  </span>
                </div>
              </div>
              {isSelected && <Check size={16} style={{ color: theme.accent }} />}
            </div>
          );
        })}
      </div>
    </CenterModal>
  );
}