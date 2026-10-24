// src/pages/4_Connect/BiblePage.jsx
import React, { useState } from 'react';
import { BookOpen, Search, Bookmark, Share2 } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';

export default function BiblePage({ theme }) {
  const [version, setVersion] = useState('Tamil');

  const sampleVerses = [
    { num: 1, text: "தொடக்கத்திலே தேவன் வானத்தையும் பூமியையும் சிருஷ்டித்தார்.", eng: "In the beginning God created the heavens and the earth." },
    { num: 2, text: "பூமியானது ஒழுங்கின்மையும் வெறுமையுமாய் இருந்தது; ஆழத்தின்மேல் இருள் இருந்தது; தேவனுடைய ஆவியானவர் ஜலத்தின்மேல் அசைவாடிக்கொண்டிருந்தார்.", eng: "The earth was without form, and void; and darkness was on the face of the deep." },
    { num: 3, text: "தேவன் வெளிச்சம் உண்டாகக்கடவது என்றார், வெளிச்சம் உண்டாயிற்று.", eng: "Then God said, 'Let there be light'; and there was light." }
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-extrabold tracking-tight flex items-center gap-1.5">
            <BookOpen size={18} style={{ color: theme.accent }} />
            <span>Holy Bible Studio</span>
          </h2>
          <span className="text-[11px] opacity-60 font-semibold">Scripture Meditation & Audio Reader</span>
        </div>

        {/* Translation Toggle */}
        <div className="flex rounded-xl bg-black/5 dark:bg-white/5 border border-white/20 p-0.5 text-[10px] font-bold">
          <button 
            type="button"
            onClick={() => setVersion('Tamil')}
            className={`px-2 py-1 rounded-lg transition ${version === 'Tamil' ? 'bg-orange-500 text-white' : 'opacity-70'}`}
          >
            தமிழ்
          </button>
          <button 
            type="button"
            onClick={() => setVersion('KJV')}
            className={`px-2 py-1 rounded-lg transition ${version === 'KJV' ? 'bg-orange-500 text-white' : 'opacity-70'}`}
          >
            KJV
          </button>
        </div>
      </div>

      {/* Book & Chapter Header */}
      <GlassCard className="p-3.5 flex justify-between items-center" theme="{theme}">
        <div>
          <h3 className="text-sm font-black">ஆதியாகமம் / Genesis 1</h3>
          <span className="text-[10px] opacity-60">Creation of the Heavens & Earth</span>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/5 border border-white/20">
          Ch 1 : 1-31
        </span>
      </GlassCard>

      {/* Verses List */}
      <GlassCard className="p-4 space-y-3" theme="{theme}">
        {sampleVerses.map((v) => (
          <div key={v.num} className="space-y-1 pb-2 border-b border-black/5 dark:border-white/5 last:border-none">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-black font-mono" style={{ color: theme.accent }}>
                {v.num}
              </span>
              <p className="text-xs leading-relaxed font-medium">
                {version === 'Tamil' ? v.text : v.eng}
              </p>
            </div>
          </div>
        ))}
      </GlassCard>

    </div>
  );
}