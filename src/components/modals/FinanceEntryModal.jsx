// src/components/modals/FinanceEntryModal.jsx
import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import CenterModal from '../common/CenterModal';

export default function FinanceEntryModal({
  isOpen,
  onClose,
  initialType = 'income',
  onAddTransaction,
  theme
}) {
  const [entryType, setEntryType] = useState(initialType);
  const [entryTitle, setEntryTitle] = useState('');
  const [entryAmount, setEntryAmount] = useState('');
  const [fundCategory, setFundCategory] = useState('Tithes');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!entryTitle || !entryAmount) return;

    onAddTransaction?.({
      id: Date.now(),
      title: entryTitle,
      amount: `₹${parseFloat(entryAmount).toLocaleString()}`,
      type: entryType,
      fund: fundCategory,
      date: 'Just Now'
    });

    setEntryTitle('');
    setEntryAmount('');
    onClose();
  };

  return (
    <CenterModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Record 80G ${entryType === 'income' ? 'Income' : 'Expense'}`}
      icon={DollarSign}
      theme={theme}
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        
        {/* Toggle Income / Expense */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/20">
          <button
            type="button"
            onClick={() => setEntryType('income')}
            className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              entryType === 'income' ? 'bg-emerald-500 text-white shadow-xs' : 'opacity-60'
            }`}
          >
            Income (வரவு)
          </button>
          <button
            type="button"
            onClick={() => setEntryType('expense')}
            className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              entryType === 'expense' ? 'bg-rose-500 text-white shadow-xs' : 'opacity-60'
            }`}
          >
            Expense (செலவு)
          </button>
        </div>

        <div>
          <label className="text-[10px] font-bold block mb-1">Title / Description *</label>
          <input 
            type="text" 
            placeholder="e.g. Sunday Morning Tithe"
            value={entryTitle}
            onChange={(e) => setEntryTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-xs focus:outline-none"
            required 
          />
        </div>

        <div>
          <label className="text-[10px] font-bold block mb-1">Fund Category</label>
          <select
            value={fundCategory}
            onChange={(e) => setFundCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-xs focus:outline-none cursor-pointer"
          >
            <option value="Tithes">Tithes (தசமபாகம்)</option>
            <option value="Offerings">General Offering (காணிக்கை)</option>
            <option value="Building">Building Fund (கட்டிட நிதி)</option>
            <option value="Missions">Missions & Outreach</option>
            <option value="Utility">Utility / Maintenance</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold block mb-1">Amount (₹) *</label>
          <input 
            type="number" 
            placeholder="0.00"
            value={entryAmount}
            onChange={(e) => setEntryAmount(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-xs focus:outline-none font-mono font-bold"
            required 
          />
        </div>

        <button 
          type="submit" 
          className={`w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-md cursor-pointer transition active:scale-95 ${
            entryType === 'income' ? 'bg-emerald-500' : 'bg-rose-500'
          }`}
        >
          Confirm 80G {entryType}
        </button>
      </form>
    </CenterModal>
  );
}