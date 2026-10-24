// src/pages/4_Connect/BroadcastPage.jsx
import React, { useState } from 'react';
import { Megaphone, MessageSquare, Send, CheckCircle2, Users, Shield } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';

export default function BroadcastPage({ theme }) {
  const [targetAudience, setTargetAudience] = useState('All Congregation');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [channel, setChannel] = useState('whatsapp');

  const handleSend = (e) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    alert(`Broadcast queued for ${targetAudience} via ${channel.toUpperCase()}!`);
    setBroadcastMessage('');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="px-1">
        <h2 className="text-base font-extrabold tracking-tight flex items-center gap-1.5">
          <Megaphone size={18} style={{ color: theme.accent }} />
          <span>Broadcast & Alert Hub</span>
        </h2>
        <span className="text-[11px] opacity-60 font-semibold">Send Multi-Channel SMS & WhatsApp Bulletins</span>
      </div>

      {/* Composer Card */}
      <GlassCard className="p-4 space-y-3.5" theme={theme}>
        <form onSubmit={handleSend} className="space-y-3">
          
          {/* Target Group */}
          <div>
            <label className="text-[10px] font-bold block mb-1 opacity-70">Target Audience</label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="All Congregation">All Congregation (1,245 Believers)</option>
              <option value="Family Heads Only">Family Heads (384 Households)</option>
              <option value="Worship Choir">Worship & Music Team</option>
              <option value="Youth Fellowship">Youth Members</option>
              <option value="Sunday School Parents">Sunday School Parents</option>
            </select>
          </div>

          {/* Delivery Channel */}
          <div>
            <label className="text-[10px] font-bold block mb-1 opacity-70">Delivery Channel</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setChannel('whatsapp')}
                className={`py-2 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  channel === 'whatsapp' ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs' : 'border-black/10 dark:border-white/10'
                }`}
              >
                <MessageSquare size="{14}"/> WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setChannel('sms')}
                className={`py-2 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  channel === 'sms' ? 'bg-sky-500 text-white border-sky-500 shadow-xs' : 'border-black/10 dark:border-white/10'
                }`}
              >
                <Send size="{14}"/> Priority SMS
              </button>
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <label className="text-[10px] font-bold block mb-1 opacity-70">Bulletin Message</label>
            <textarea
              rows="3"
              placeholder="எ.கா. Sunday Service begins at 08:30 AM. Fasting prayer on Friday at 10 AM."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-xs focus:outline-none resize-none font-medium"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-2xl text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer"
            style={{ background: theme.accent }}
          >
            <Send size="{14}"/> Send Broadcast Bulletin
          </button>
        </form>
      </GlassCard>

    </div>
  );
}