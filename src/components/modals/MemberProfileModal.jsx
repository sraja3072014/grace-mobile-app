// src/components/modals/MemberProfileModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  X, Save, User, Phone, Mail, MapPin, Calendar, 
  Heart, Droplets, Sparkles, Check, Users, Crown, ShieldCheck
} from 'lucide-react';

const TALENT_PRESETS = [
  'Worship Team & Vocals',
  'Media, Sound & Live Broadcast',
  'Sunday School & Kids Ministry',
  'Intercession & Prayer Wall',
  'Ushering & Hospitality',
  'Outreach & Evangelism',
  "Men's Fellowship",
  "Women's Fellowship",
  'Youth Fellowship'
];

const RELATIONSHIP_ROLES = [
  'Head of Family',
  'Lead Pastor / Head of Family',
  'Spouse / Wife',
  'Son',
  'Daughter',
  'Father / Mother',
  'Brother / Sister',
  'Grandfather / Grandmother',
  'Relative / Other'
];

const PASTORAL_KEYWORDS = ['pastor', 'rev', 'reverend', 'r.v', 'r.e.v', 'bishop', 'dr', 'doctor of divinity', 'd.d'];

function isClergy(name, role) {
  const combined = `${name || ''} ${role || ''}`.toLowerCase();
  return PASTORAL_KEYWORDS.some(kw => combined.includes(kw));
}

export default function MemberProfileModal({ 
  isOpen, 
  onClose, 
  onSaveMember, 
  theme = {}, 
  initialData = null 
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    family_id: '',
    house_id: '',
    household_role: 'Head of Family',
    family_name: '',
    head_name: '',
    name: '',
    gender: 'Male',
    date_of_birth: '',
    age: '',
    blood_group: 'O+',
    wedding_anniversary: '',
    type: 'Member',
    status: 'Active',
    phone: '',
    email: '',
    campus: 'Headquarters',
    area: 'Koduvai',
    address: '',
    gps_coordinates: '',
    is_baptized: false,
    baptism_date: '',
    is_anointed: false,
    holy_spirit_baptism_date: '',
    ministry_talents: []
  });

  useEffect(() => {
    if (initialData) {
      const rawTalents = initialData.ministry_talents || 
                         initialData.ministryTalents || 
                         initialData.raw_payload?.ministryTalents || 
                         [];

      const isBaptized = Boolean(initialData.is_baptized ?? initialData.raw_payload?.isBaptized);
      const isAnointed = Boolean(initialData.is_anointed ?? initialData.raw_payload?.isAnointed);

      const generatedId = initialData.id || `FAM-${Math.floor(100 + Math.random() * 900)}-${Math.floor(10 + Math.random() * 90)}`;
      const famId = initialData.family_id || initialData.familyId || `FAM-${Math.floor(100 + Math.random() * 900)}`;

      setFormData({
        ...initialData,
        id: generatedId,
        family_id: famId,
        house_id: initialData.house_id || generatedId,
        household_role: initialData.household_role || 'Head of Family',
        gender: initialData.gender || 'Male',
        name: initialData.name || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        area: initialData.area || 'Koduvai',
        campus: initialData.campus || 'Main Sanctuary',
        blood_group: initialData.blood_group || 'O+',
        date_of_birth: initialData.date_of_birth || '',
        age: initialData.age || '',
        wedding_anniversary: initialData.wedding_anniversary || initialData.raw_payload?.weddingAnniversary || '',
        is_baptized: isBaptized,
        baptism_date: initialData.baptism_date || initialData.raw_payload?.baptismDate || '',
        is_anointed: isAnointed,
        holy_spirit_baptism_date: initialData.holy_spirit_baptism_date || initialData.raw_payload?.holySpiritBaptismDate || '',
        ministry_talents: Array.isArray(rawTalents) ? rawTalents : []
      });
    } else {
      const randomFamId = `FAM-${Math.floor(100 + Math.random() * 900)}`;
      setFormData({
        id: `${randomFamId}-H`,
        family_id: randomFamId,
        house_id: `${randomFamId}-H`,
        household_role: 'Head of Family',
        family_name: '',
        head_name: '',
        name: '',
        gender: 'Male',
        date_of_birth: '1990-01-01',
        age: 36,
        blood_group: 'O+',
        wedding_anniversary: '',
        type: 'Member',
        status: 'Active',
        phone: '',
        email: '',
        campus: 'Main Sanctuary',
        area: 'Koduvai',
        address: '',
        gps_coordinates: '',
        is_baptized: false,
        baptism_date: '',
        is_anointed: false,
        holy_spirit_baptism_date: '',
        ministry_talents: ['Worship Team & Vocals']
      });
    }
  }, [initialData, isOpen]);

  // 🌟 Relationship Selection with Auto Gender Suggestion
  const handleRelationshipChange = (role) => {
    let suggestedGender = formData.gender;
    const lower = role.toLowerCase();
    
    // Auto-Suggestions: Wife, Mother, Daughter, Sister -> Female
    if (lower.includes('wife') || lower.includes('mother') || lower.includes('daughter') || lower.includes('sister') || lower.includes('grandmother')) {
      suggestedGender = 'Female';
    } 
    // Husband, Father, Son, Brother -> Male
    else if (lower.includes('husband') || lower.includes('father') || lower.includes('son') || lower.includes('brother') || lower.includes('grandfather')) {
      suggestedGender = 'Male';
    }

    setFormData((prev) => ({
      ...prev,
      household_role: role,
      gender: suggestedGender
    }));
  };

  const handleDobChange = (e) => {
    const dob = e.target.value;
    let calculatedAge = formData.age;
    if (dob) {
      const birthYear = new Date(dob).getFullYear();
      const currentYear = new Date().getFullYear();
      calculatedAge = currentYear - birthYear;
    }
    setFormData((prev) => ({ ...prev, date_of_birth: dob, age: calculatedAge }));
  };

  const handleToggleTalent = (talent) => {
    setFormData((prev) => {
      const exists = prev.ministry_talents.includes(talent);
      const updated = exists 
        ? prev.ministry_talents.filter((t) => t !== talent)
        : [...prev.ministry_talents, talent];
      return { ...prev, ministry_talents: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    // Mandatory Gender Selection Rule
    if (!formData.gender) {
      alert('Mandatory Gender selection required (Male or Female).');
      return;
    }

    const existingPayload = typeof formData.raw_payload === 'string'
      ? JSON.parse(formData.raw_payload)
      : formData.raw_payload || {};

    const payloadObject = {
      ...existingPayload,
      memberId: formData.id,
      familyId: formData.family_id,
      houseId: formData.house_id,
      name: formData.name,
      roleInFamily: formData.household_role,
      gender: formData.gender,
      dob: formData.date_of_birth,
      age: Number(formData.age) || null,
      bloodGroup: formData.blood_group,
      weddingAnniversary: formData.wedding_anniversary || null,
      status: formData.status || 'Active',
      phone: formData.phone,
      email: formData.email,
      campus: formData.campus,
      area: formData.area,
      address: formData.address,
      gpsCoordinates: formData.gps_coordinates,
      isBaptized: formData.is_baptized,
      baptismDate: formData.is_baptized ? (formData.baptism_date || null) : null,
      isAnointed: formData.is_anointed,
      holySpiritBaptismDate: formData.is_anointed ? (formData.holy_spirit_baptism_date || null) : null,
      ministryTalents: formData.ministry_talents
    };

    const finalRecord = {
      ...formData,
      wedding_anniversary: formData.wedding_anniversary || null,
      baptism_date: formData.is_baptized ? (formData.baptism_date || null) : null,
      holy_spirit_baptism_date: formData.is_anointed ? (formData.holy_spirit_baptism_date || null) : null,
      family_name: formData.family_name || `${formData.name} & Household`,
      head_name: formData.head_name || formData.name,
      raw_payload: payloadObject,
      updated_at: new Date().toISOString()
    };

    setIsSaving(true);
    try {
      const saved = await onSaveMember?.(finalRecord);
      if (saved !== false) {
        onClose();
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const clergyRecord = isClergy(formData.name, formData.household_role);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 px-4 select-none">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose} 
      />

      <div 
        className="relative z-10 w-full max-w-lg rounded-[32px] p-5 shadow-2xl max-h-[92vh] overflow-y-auto animate-in slide-in-from-top-6 fade-in duration-300"
        style={{ 
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
          color: theme?.textMain || '#ffffff'
        }}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-xs shadow-md border border-white/20 shrink-0"
              style={{ background: clergyRecord ? '#f59e0b' : (theme?.accent || '#06b6d4') }}
            >
              {clergyRecord ? <Crown size={18} /> : <User size={18} />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-black tracking-tight leading-tight">
                  {formData.household_role === 'Head of Family' ? 'Family Head Registration' : `${formData.household_role} Profile`}
                </h2>
                {clergyRecord && (
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.3)]">
                    CLERGY / PASTORAL
                  </span>
                )}
              </div>
              <span className="text-[10px] text-cyan-400 font-mono block mt-0.5">
                Family ID: {formData.family_id} • Member ID: {formData.id}
              </span>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pt-3.5 space-y-3.5 text-xs">
          
          {/* 🌟 1. Demographics, Relationship & Gender */}
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5">
            <span className="text-[10px] font-mono tracking-wider opacity-60 uppercase block flex items-center gap-1.5">
              <User size={12} className="text-amber-400" />
              1. Demographics & Relationship Structure
            </span>

            {/* Name */}
            <div>
              <label className="text-[10px] font-bold block mb-1 opacity-80">Full Name *</label>
              <input 
                type="text" 
                required
                placeholder="Enter full name (e.g. Pastor Johnraja / Suresh)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-2.5 py-2 rounded-xl border border-white/15 bg-white/5 font-bold text-xs focus:outline-none focus:border-cyan-400 text-white placeholder-slate-500"
              />
            </div>

            {/* Relationship Category with Auto-Suggestion */}
            <div>
              <label className="text-[10px] font-bold block mb-1 opacity-80 flex items-center gap-1">
                <Users size={11} className="text-cyan-400" />
                Relationship Category (Household Role) *
              </label>
              <select 
                value={formData.household_role}
                onChange={(e) => handleRelationshipChange(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border border-white/15 bg-slate-900 text-xs font-semibold focus:outline-none text-white cursor-pointer"
              >
                {RELATIONSHIP_ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Mandatory Gender Selection Buttons */}
            <div>
              <label className="text-[10px] font-bold block mb-1 opacity-80">
                Gender (Mandatory) *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: 'Male' })}
                  className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                    formData.gender === 'Male'
                      ? 'border-sky-400 bg-sky-500/25 text-sky-300 shadow-sm'
                      : 'border-white/10 bg-white/5 opacity-70 hover:opacity-100'
                  }`}
                >
                  <span>👨 Male</span>
                  {formData.gender === 'Male' && <Check size={12} strokeWidth={3} />}
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: 'Female' })}
                  className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                    formData.gender === 'Female'
                      ? 'border-pink-400 bg-pink-500/25 text-pink-300 shadow-sm'
                      : 'border-white/10 bg-white/5 opacity-70 hover:opacity-100'
                  }`}
                >
                  <span>👩 Female</span>
                  {formData.gender === 'Female' && <Check size={12} strokeWidth={3} />}
                </button>
              </div>
            </div>

            {/* Date of Birth, Age, Blood Group */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-bold block mb-1 opacity-80">Date of Birth</label>
                <input 
                  type="date" 
                  value={formData.date_of_birth}
                  onChange={handleDobChange}
                  className="w-full px-2 py-1.5 rounded-xl border border-white/15 bg-white/5 text-[11px] focus:outline-none font-mono text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold block mb-1 opacity-80">Age</label>
                <input 
                  type="number" 
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-xl border border-white/15 bg-white/5 text-[11px] focus:outline-none font-mono text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold block mb-1 opacity-80">Blood Group</label>
                <select 
                  value={formData.blood_group}
                  onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-xl border border-white/15 bg-slate-900 text-[11px] focus:outline-none text-white cursor-pointer"
                >
                  {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 🌟 2. Contact & Church Campus Location */}
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5">
            <span className="text-[10px] font-mono tracking-wider opacity-60 uppercase block flex items-center gap-1.5">
              <Phone size={12} className="text-cyan-400" />
              2. Contact & Location
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold block mb-1 opacity-80">Phone Number *</label>
                <input 
                  type="tel" 
                  required
                  placeholder="10-digit mobile"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs font-mono focus:outline-none focus:border-cyan-400 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold block mb-1 opacity-80">Email</label>
                <input 
                  type="email" 
                  placeholder="member@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs font-mono focus:outline-none focus:border-cyan-400 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold block mb-1 opacity-80">Campus</label>
                <select 
                  value={formData.campus}
                  onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-xl border border-white/15 bg-slate-900 text-xs focus:outline-none text-white cursor-pointer"
                >
                  <option value="Main Sanctuary">Main Sanctuary</option>
                  <option value="Koduvai Branch">Koduvai Branch</option>
                  <option value="City Campus">City Campus</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold block mb-1 opacity-80">Area / Suburb</label>
                <input 
                  type="text" 
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs focus:outline-none text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold block mb-1 opacity-80">Residential Address</label>
              <input 
                type="text" 
                placeholder="Door No, Street Name, City"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs focus:outline-none text-white"
              />
            </div>
          </div>

          {/* 🌟 3. Spiritual Milestone & Baptism */}
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5">
            <span className="text-[10px] font-mono tracking-wider opacity-60 uppercase block flex items-center gap-1.5">
              <Droplets size={12} className="text-sky-400" />
              3. Spiritual Milestones & Sacraments
            </span>

            {/* Water Baptism */}
            <div className="p-2.5 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Droplets size={13} className="text-sky-400" />
                  Water Baptism (ஞானஸ்நானம்)
                </span>
                <input 
                  type="checkbox"
                  checked={formData.is_baptized}
                  onChange={(e) => setFormData({ ...formData, is_baptized: e.target.checked })}
                  className="w-4 h-4 rounded accent-sky-400 cursor-pointer"
                />
              </div>
              {formData.is_baptized && (
                <div>
                  <label className="text-[9px] font-bold block mb-1 opacity-80">Date of Baptism</label>
                  <input 
                    type="date"
                    value={formData.baptism_date}
                    onChange={(e) => setFormData({ ...formData, baptism_date: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs font-mono text-white"
                  />
                </div>
              )}
            </div>

            {/* Holy Spirit Baptism */}
            <div className="p-2.5 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-400" />
                  Holy Spirit Anointing (அபிஷேகம்)
                </span>
                <input 
                  type="checkbox"
                  checked={formData.is_anointed}
                  onChange={(e) => setFormData({ ...formData, is_anointed: e.target.checked })}
                  className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Wedding Anniversary */}
            <div>
              <label className="text-[10px] font-bold block mb-1 opacity-80 flex items-center gap-1">
                <Heart size={11} className="text-rose-400" />
                Wedding Anniversary Date
              </label>
              <input 
                type="date"
                value={formData.wedding_anniversary}
                onChange={(e) => setFormData({ ...formData, wedding_anniversary: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs font-mono text-white"
              />
            </div>
          </div>

          {/* 🌟 4. Ministry Talents */}
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
            <span className="text-[10px] font-mono tracking-wider opacity-60 uppercase block flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber-400" />
              4. Ministry & Service Talents
            </span>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {TALENT_PRESETS.map((talent) => {
                const isSelected = formData.ministry_talents.includes(talent);
                return (
                  <button
                    key={talent}
                    type="button"
                    onClick={() => handleToggleTalent(talent)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition cursor-pointer active:scale-95 ${
                      isSelected 
                        ? 'border-cyan-400 bg-cyan-500/25 text-cyan-300' 
                        : 'border-white/10 bg-white/5 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {talent}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 rounded-2xl text-white font-extrabold text-xs shadow-xl active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
            style={{ background: clergyRecord ? '#f59e0b' : (theme?.accent || '#06b6d4') }}
          >
            <Save size={14} />
            <span>{isSaving ? 'Saving to Vault...' : 'Save Believer Profile to Vault'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
