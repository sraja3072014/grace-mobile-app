// src/pages/3_ChurchLife/FinancePage.jsx
import React, { useState } from 'react';
import { 
  DollarSign, ArrowDownLeft, ArrowUpRight, 
  Receipt, Landmark, Filter, Download 
} from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import { formatCurrency } from '../../i18n/translations';
import { useTranslation } from '../../hooks/useTranslation';

export default function FinancePage({ 
  theme, 
  onRecordTransaction 
}) {
  const [filterType, setFilterType] = useState('all');
  const { t } = useTranslation();

  const [transactions, setTransactions] = useState([
    { id: 1, title: 'Sunday Morning 1st Service Tithes', rawAmount: 145000, type: 'income', fund: 'SBI - General Tithe', date: 'Oct 24, 2026', receiptNo: 'GCC-REC-8801' },
    { id: 2, title: 'Main Sanctuary Central AC Maintenance', rawAmount: 18500, type: 'expense', fund: 'Utility & Maintenance', date: 'Oct 22, 2026', receiptNo: 'GCC-EXP-1042' },
    { id: 3, title: 'Youth Retreat Special Sponsorship', rawAmount: 25000, type: 'income', fund: 'ICICI - Missions', date: 'Oct 20, 2026', receiptNo: 'GCC-REC-8795' },
    { id: 4, title: 'Campus Diesel Generator Refuel', rawAmount: 6200, type: 'expense', fund: 'Utility', date: 'Oct 19, 2026', receiptNo: 'GCC-EXP-1041' },
    { id: 5, title: 'Building Expansion Fund Direct Deposit', rawAmount: 50000, type: 'income', fund: 'HDFC - Building', date: 'Oct 18, 2026', receiptNo: 'GCC-REC-8790' }
  ]);

  const totalIn = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.rawAmount, 0);
  const totalOut = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.rawAmount, 0);
  const netBalance = totalIn - totalOut;

  const filtered = filterType === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filterType);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-extrabold tracking-tight flex items-center gap-1.5">
            <DollarSign size={18} className="text-emerald-500" />
            <span>{t('finance.title')}</span>
          </h2>
          <span className="text-[11px] opacity-60 font-semibold">{t('finance.audited')}</span>
        </div>
      </div>

      {/* Overview Balance Card */}
      <GlassCard theme={theme} className="p-4 space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/10">
          <div>
            <span className="text-[10px] uppercase font-bold opacity-60 block">{t('finance.reserves')}</span>
            <h3 className="text-xl font-black text-emerald-500">{formatCurrency(netBalance, 'INR')}</h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
            {t('finance.taxExempt')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
              <ArrowDownLeft size={12} /> {t('finance.inflow')}
            </div>
            <span className="text-sm font-black text-emerald-500 block mt-0.5">{formatCurrency(totalIn, 'INR')}</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <div className="flex items-center gap-1 text-[10px] font-bold text-rose-400">
              <ArrowUpRight size={12} /> {t('finance.outflow')}
            </div>
            <span className="text-sm font-black text-rose-500 block mt-0.5">{formatCurrency(totalOut, 'INR')}</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onRecordTransaction?.('income')}
            className="py-2.5 rounded-2xl text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer bg-emerald-500"
          >
            <ArrowDownLeft size={16} /> {t('finance.recordTithe')}
          </button>
          <button
            type="button"
            onClick={() => onRecordTransaction?.('expense')}
            className="py-2.5 rounded-2xl text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer bg-rose-500"
          >
            <ArrowUpRight size={16} /> {t('finance.recordExpense')}
          </button>
        </div>
      </GlassCard>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'income', 'expense'].map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setFilterType(filter)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold capitalize border transition cursor-pointer active:scale-95 ${
              filterType === filter ? 'shadow-md' : 'opacity-70'
            }`}
            style={{
              background: filterType === filter ? theme.accent : theme.glassBg,
              color: filterType === filter ? '#ffffff' : theme.textMain,
              borderColor: theme.glassBorder
            }}
          >
            {filter === 'all' ? t('common.allMovements') : filter === 'income' ? t('common.income') : t('common.expense')}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {filtered.map((tx) => (
          <GlassCard key={tx.id} theme={theme} className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl text-white shadow-xs ${tx.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                {tx.type === 'income' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-extrabold truncate leading-tight">{tx.title}</h4>
                <div className="flex items-center gap-2 text-[10px] opacity-60 mt-0.5">
                  <span>{tx.fund}</span>
                  <span>•</span>
                  <span>{tx.date}</span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0 ml-2">
              <span className={`text-xs font-black block font-mono ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.rawAmount, 'INR')}
              </span>
              <span className="text-[9px] font-mono opacity-50 block mt-0.5">{tx.receiptNo}</span>
            </div>
          </GlassCard>
        ))}
      </div>

    </div>
  );
}