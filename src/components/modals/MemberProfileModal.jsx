// src/components/modals/MemberProfileModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  X, Save, User, Phone, Mail, MapPin, Calendar, 
  Heart, Droplets, Sparkles, Check, Users
} from 'lucide-react';

const TALENT_PRESETS = [
  'Worship Team & Vocals',
  "Men's Fellowship",
  "Women's Fellowship",
  'Youth Fellowship',
  'Prayer Team',
  'Sunday School Teacher',
  'Media & Sound Tech',
  'Ushering & Hospitality',
  'Outreach & Evanglism'
];

const RELATIONSHIP_ROLES = [
  'Head of Family',
  'Spouse / Wife',
  'Son',
  'Daughter',
  'Father / Mother',
  'Brother / Sister',
  'Grandfather / Grandmother',
  'Relative / Other'
];

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
    area: 'Tirupur',
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
        household_role: initialData.household_role || 'Spouse / Wife',
        gender: initialData.gender || 'Male',
        name: initialData.name || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        area: initialData.area || 'Tirupur',
        campus: initialData.campus || 'Headquarters',
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
        campus: 'Headquarters',
        area: 'Tirupur',
        address: '',
        gps_coordinates: '',
        is_baptized: false,
        baptism_date: '',
        is_anointed: false,
        holy_spirit_baptism_date: '',
        ministry_talents: ['Prayer Team']
      });
    }
  }, [initialData, isOpen]);

  // பிறந்த தேதியில் இருந்து வயது கணக்கீடு
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

  // தாலந்துகள் தேர்வு / நீக்குதல்
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
    delete payloadObject.emergency_contact;
    delete payloadObject.emergencyContact;

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
    delete finalRecord.emergency_contact;
    delete finalRecord.emergencyContact;

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

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 px-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose} 
      />

      <div 
        className="relative z-10 w-full max-w-lg rounded-[32px] p-5 shadow-2xl max-h-[92vh] overflow-y-auto animate-in slide-in-from-top-6 fade-in duration-300"
        style={{ 
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(255, 255, 255, 0.20)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
          color: theme?.textMain || '#ffffff'
        }}
      >
        {/* தலைப்புப் பட்டை */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-xs shadow-md border border-white/20 shrink-0"
              style={{ background: theme?.accent || '#f59e0b' }}
            >
              <User size={18} />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight leading-tight">
                {formData.household_role === 'Head of Family' ? 'Family Head Profile' : `${formData.household_role} Profile`}
              </h2>
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
          
          {/* 🌟 1. பெயர், உறவுமுறை & பாலினம் (Pill Buttons) */}
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5">
            <span className="text-[10px] font-mono tracking-wider opacity-60 uppercase block flex items-center gap-1.5">
              <User size={12} className="text-amber-400" />
              1. Demographics & Relationship
            </span>

            {/* பெயர் */}
            <div>
              <label className="text-[10px] font-bold block mb-1 opacity-80">Full Name (முழுப் பெயர்) *</label>
              <input 
                type="text" 
                required
                placeholder="பெயரை உள்ளிடவும்"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-2.5 py-2 rounded-xl border border-white/15 bg-white/5 font-bold text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* குடும்ப உறவுமுறை வகை (Relationship Category) */}
            <div>
              <label className="text-[10px] font-bold block mb-1 opacity-80 flex items-center gap-1">
                <Users size={11} className="text-cyan-400" />
                Relationship Category (குடும்ப உறவுமுறை) *
              </label>
              <select 
                value={formData.household_role}
                onChange={(e) => setFormData({ ...formData, household_role: e.target.value })}
                className="w-full px-2.5 py-2 rounded-xl border border-white/15 bg-black/60 text-xs font-semibold focus:outline-none text-white"
              >
                {RELATIONSHIP_ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* பாலினம் (Male / Female Pill Buttons) */}
            <div>
              <label className="text-[10px] font-bold block mb-1 opacity-80">Gender (பாலினம்) *</label>
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
                  <span>👨 Male (ஆண்)</span>
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
                  <span>👩 Female (பெண்)</span>
                  {formData.gender === 'Female' && <Check size={12} strokeWidth={3} />}
                </button>
              </div>
            </div>

            {/* பிறந்த தேதி, வயது, ரத்த வகை */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-bold block mb-1 opacity-80">Date of Birth</label>
                <input 
                  type="date" 
                  value={formData.date_of_birth}
                  onChange={handleDobChange}
                  className="w-full px-2 py-1.5 rounded-xl border border-white/15 bg-white/5 text-[11px] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold block mb-1 opacity-80">Age (வயது)</label>
                <input 
                  type="number" 
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-xl border border-white/15 bg-white/5 text-[11px] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold block mb-1 opacity-80">Blood Group</label>
                <select 
                  value={formData.blood_group}
                  onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-xl border border-white/15 bg-black/60 text-[11px] font-mono focus:outline-none"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            {/* திருமண நாள் */}
            <div>
              <label className="text-[10px] font-bold block mb-1 opacity-80 flex items-center gap-1">
                <Heart size={11} className="text-rose-400" />
                Wedding Anniversary (திருமண நாள்)
              </label>
              <input 
                type="date" 
                value={formData.wedding_anniversary || ''}
                onChange={(e) => setFormData({ ...formData, wedding_anniversary: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* 🌟 2. தொடர்பு விவரங்கள் (Mobile, Email, Location) */}
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5">
            <span className="text-[10px] font-mono tracking-wider opacity-60 uppercase block flex items-center gap-1.5">
              <Phone size={12} className="text-emerald-400" />
              2. Contact & Location
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold block mb-1 opacity-80">Mobile Number *</label>
                <input 
                  type="tel" 
                  required
                  placeholder="949614621"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold block mb-1 opacity-80">Email ID</label>
                <input 
                  type="email" 
                  placeholder="name@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold block mb-1 opacity-80">Area / Town</label>
                <input 
                  type="text" 
                  placeholder="Tirupur"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold block mb-1 opacity-80">Campus</label>
                <input 
                  type="text" 
                  placeholder="Headquarters"
                  value={formData.campus}
                  onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 🌟 3. ஆன்மீக நிலைகள் (டிக் செய்தால் மட்டுமே விரியும் தேதிகள்) */}
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5">
            <span className="text-[10px] font-mono tracking-wider opacity-60 uppercase block flex items-center gap-1.5">
              <Droplets size={12} className="text-sky-400" />
              3. Spiritual Milestones
            </span>

            {/* நீர் ஞானஸ்நானம் செக்பாக்ஸ் */}
            <div className="p-2.5 rounded-xl bg-black/20 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-[11px] block">Water Baptized (ஞானஸ்நானம்)</span>
                  <span className="text-[9px] opacity-60">டிக் செய்தால் ஞானஸ்நான தேதி உள்ளிடலாம்</span>
                </div>
                <input 
                  type="checkbox"
                  checked={formData.is_baptized}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    is_baptized: e.target.checked,
                    baptism_date: e.target.checked ? formData.baptism_date : ''
                  })}
                  className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                />
              </div>

              {/* டிக் பண்ணா மட்டும் ஓபன் ஆகும் Baptism Date */}
              {formData.is_baptized && (
                <div className="pt-2 border-t border-white/10 animate-in fade-in duration-200">
                  <label className="text-[10px] font-mono font-bold text-emerald-400 block mb-1">
                    Baptism Date (ஞானஸ்நானம் பெற்ற நாள்) *
                  </label>
                  <input 
                    type="date"
                    required={formData.is_baptized}
                    value={formData.baptism_date || ''}
                    onChange={(e) => setFormData({ ...formData, baptism_date: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-emerald-500/30 bg-white/5 text-xs font-mono focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* பரிசுத்த ஆவியின் அபிஷேகம் செக்பாக்ஸ் */}
            <div className="p-2.5 rounded-xl bg-black/20 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-[11px] block">Holy Spirit Anointed (ஆவியின் அபிஷேகம்)</span>
                  <span className="text-[9px] opacity-60">டிக் செய்தால் அபிஷேக தேதி உள்ளிடலாம்</span>
                </div>
                <input 
                  type="checkbox"
                  checked={formData.is_anointed}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    is_anointed: e.target.checked,
                    holy_spirit_baptism_date: e.target.checked ? formData.holy_spirit_baptism_date : ''
                  })}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {/* டிக் பண்ணா மட்டும் ஓபன் ஆகும் Anointing Date */}
              {formData.is_anointed && (
                <div className="pt-2 border-t border-white/10 animate-in fade-in duration-200">
                  <label className="text-[10px] font-mono font-bold text-amber-400 block mb-1">
                    Anointing Date (அபிஷேகம் பெற்ற நாள்) *
                  </label>
                  <input 
                    type="date"
                    required={formData.is_anointed}
                    value={formData.holy_spirit_baptism_date || ''}
                    onChange={(e) => setFormData({ ...formData, holy_spirit_baptism_date: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-amber-500/30 bg-white/5 text-xs font-mono focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 🌟 4. சபை ஊழியங்கள் & தாலந்துகள் (Pill Tag Buttons) */}
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-wider opacity-60 uppercase flex items-center gap-1.5">
                <Sparkles size={12} className="text-pink-400" />
                4. Ministry Talents (ஊழியங்கள்)
              </span>
              <span className="text-[10px] font-bold text-cyan-400">
                {formData.ministry_talents.length} Selected
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {TALENT_PRESETS.map((talent) => {
                const isSelected = formData.ministry_talents.includes(talent);
                return (
                  <button
                    type="button"
                    key={talent}
                    onClick={() => handleToggleTalent(talent)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected 
                        ? 'border-emerald-400 bg-emerald-500/25 text-emerald-300 shadow-sm' 
                        : 'border-white/10 bg-white/5 opacity-70 hover:opacity-100 hover:border-white/20'
                    }`}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                    <span>{talent}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* சேமிக்கும் பட்டன் */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 rounded-2xl font-black text-xs text-white shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-wait"
            style={{ background: theme?.accent || '#f59e0b' }}
          >
            <Save size={15} />
            <span>{isSaving ? 'Saving...' : 'Save Member to Supabase'}</span>
          </button>
        </form>

      </div>
    </div>
  );
}