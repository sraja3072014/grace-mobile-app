import { useState } from 'react';
import {
  Camera, ChevronLeft, Heart, LockKeyhole, Plus, Save, ShieldCheck, UserRound
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { getSupabase } from '../../utils/supabaseClient';
import { saveSession } from '../../utils/authSession';

const MINISTRIES = ['Music', 'Youth', 'Sunday School', 'Intercession', 'Outreach', 'Other'];

export default function UserProfilePage({
  userProfile = {},
  onBack,
  onProfileChange,
  onEditProfile,
  onChangePassword,
  onDeactivateSession
}) {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(() => ({
    ...userProfile,
    gender: userProfile.gender || '',
    ministries: Array.isArray(userProfile.ministries) ? userProfile.ministries : [],
    familyMembers: Array.isArray(userProfile.familyMembers) ? userProfile.familyMembers : []
  }));
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [otherMinistry, setOtherMinistry] = useState('');
  const isLocalAccount = profile.isDemoMode ||
    String(profile.id || '').startsWith('MASTER-') ||
    String(profile.id || '').startsWith('DEMO-');

  const updateField = event => {
    const { name, value } = event.target;
    setProfile(current => ({ ...current, [name]: value }));
  };

  const saveProfile = async changes => {
    setIsSaving(true);
    setStatus('');
    try {
      const updatedProfile = { ...profile, ...changes };
      const session = saveSession(updatedProfile);
      setProfile(updatedProfile);
      onProfileChange?.(session);

      const client = getSupabase();
      if (client && !isLocalAccount) {
        const { error } = await client.from('profiles').upsert({
          id: profile.id,
          full_name: updatedProfile.name || '',
          email: updatedProfile.email || '',
          phone: updatedProfile.mobileNumber || '',
          gender: updatedProfile.gender || null,
          birth_date: updatedProfile.birthDate || null,
          conversion_date: updatedProfile.conversionDate || null,
          member_since: updatedProfile.memberSince || null,
          title: updatedProfile.title || null,
          ministries: updatedProfile.ministries || [],
          baptized: Boolean(updatedProfile.baptized),
          baptism_date: updatedProfile.baptismDate || null,
          avatar: updatedProfile.avatar || null,
          family_members: updatedProfile.familyMembers || []
        }, { onConflict: 'id' });
        if (error) {
          setStatus(`Saved locally. Cloud profile sync note: ${error.message}`);
          return false;
        }
      } else {
        setStatus(t('profile_saved'));
        return true;
      }
      setStatus(t('profile_synced'));
      return true;
    } catch (error) {
      setStatus(t('save_profile_error', { error: error.message }));
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async event => {
    event.preventDefault();
    const ministries = profile.ministries.filter(item => item !== 'Other' && !item.startsWith('Other:'));
    if (profile.ministries.includes('Other')) {
      ministries.push('Other');
      if (otherMinistry.trim()) ministries.push(`Other: ${otherMinistry.trim()}`);
    }
    const saved = await saveProfile({
      ...profile,
      name: String(profile.name || '').trim(),
      email: String(profile.email || '').trim(),
      mobileNumber: String(profile.mobileNumber || '').trim(),
      ministries
    });
    if (saved) setIsEditing(false);
  };

  const handleAvatarChange = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setStatus(t('choose_image'));
      return;
    }
    if (file.size > 1024 * 1024) {
      setStatus(t('image_too_large'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => saveProfile({ avatar: String(reader.result || '') });
    reader.onerror = () => setStatus(t('image_read_error'));
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const toggleMinistry = ministry => {
    setProfile(current => ({
      ...current,
      ministries: current.ministries.includes(ministry)
        ? current.ministries.filter(item => item !== ministry)
        : [...current.ministries, ministry]
    }));
  };

  const handleAddFamilyMember = () => {
    const name = window.prompt(t('family_member_name'))?.trim();
    if (!name) return;
    setProfile(current => ({
      ...current,
      familyMembers: [...current.familyMembers, { id: `family-${Date.now()}`, name }]
    }));
  };

  const handleDeleteAccount = () => {
    if (!window.confirm(t('delete_account_confirm'))) return;
    setStatus(t('delete_account_notice'));
  };

  const roleTitle = profile.title || (profile.role === 'SUPER_ADMIN' ? t('pastor') : profile.role || t('member'));
  const accessLabel = profile.role === 'SUPER_ADMIN' ? t('administrator') : profile.role === 'LEADER' ? t('leader') : t('member');
  const inputClass = 'mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400';
  const detail = (label, value) => (
    <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <dt className="text-[10px] font-semibold text-white/45">{label}</dt>
      <dd className="mt-1 truncate text-sm font-medium">{value || '—'}</dd>
    </div>
  );
  const displayDate = value => value
    ? new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <section className="mx-auto max-w-lg space-y-4 pb-28 animate-in fade-in duration-200">
      <header className="flex items-center gap-3">
        <button type="button" onClick={onBack} aria-label={t('home')} className="rounded-full border border-white/10 bg-white/5 p-2 text-white/75 hover:bg-white/10"><ChevronLeft size={18} /></button>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-black">{t('profile')}</h1>
          <p className="truncate text-[11px] text-white/50">{profile.email}</p>
        </div>
        <span className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-bold text-emerald-200">{accessLabel}</span>
      </header>

      <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 text-center shadow-xl backdrop-blur-xl">
        <div className="relative mx-auto mb-3 h-24 w-24">
          <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-emerald-300/50 bg-emerald-400/10 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            {profile.avatar
              ? <img src={profile.avatar} alt={profile.name || t('profile')} className="h-full w-full object-cover" />
              : <div className="flex h-full w-full items-center justify-center text-3xl font-black text-emerald-200">{(profile.name || 'G').slice(0, 1).toUpperCase()}</div>}
          </div>
          <label title={t('upload_photo')} className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-slate-900 bg-emerald-500 text-white shadow-lg active:scale-90">
            <Camera size={14} />
            <input type="file" accept="image/*" capture="user" onChange={handleAvatarChange} className="hidden" />
          </label>
        </div>
        <h2 className="text-lg font-black">{profile.name || t('profile')}</h2>
        <p className="mt-1 text-xs text-white/55">{roleTitle}</p>
        <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-200"><ShieldCheck size={12} />{accessLabel}</span>
      </article>

      <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">{t('personal_details')}</h2>
          {!isEditing && <button type="button" onClick={() => setIsEditing(true)} className="text-[11px] font-bold text-emerald-200">{t('edit_profile')}</button>}
        </div>
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-3">
            <label className="block text-xs">{t('full_name')}<input name="name" value={profile.name || ''} onChange={updateField} required className={inputClass} /></label>
            <label className="block text-xs">{t('email')}<input name="email" type="email" value={profile.email || ''} onChange={updateField} required className={inputClass} /></label>
            <label className="block text-xs">{t('mobile_number')}<input name="mobileNumber" type="tel" value={profile.mobileNumber || ''} onChange={updateField} className={inputClass} /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs">{t('gender')}<select name="gender" value={profile.gender || ''} onChange={updateField} className={inputClass}><option value="">—</option><option value="Male">{t('male')}</option><option value="Female">{t('female')}</option></select></label>
              <label className="block text-xs">{t('title_role')}<select name="title" value={profile.title || ''} onChange={updateField} className={inputClass}><option value="">{t('other')}</option><option value="Pastor">{t('pastor')}</option><option value="Elder">{t('elder')}</option><option value="Member">{t('member')}</option></select></label>
              <label className="block text-xs">{t('birth_date')}<input type="date" name="birthDate" value={profile.birthDate || ''} onChange={updateField} className={inputClass} /></label>
              <label className="block text-xs">{t('conversion_date')}<input type="date" name="conversionDate" value={profile.conversionDate || ''} onChange={updateField} className={inputClass} /></label>
            </div>
            <fieldset>
              <legend className="mb-2 text-xs font-semibold">{t('ministries')}</legend>
              <div className="flex flex-wrap gap-2">
                {MINISTRIES.map(ministry => <label key={ministry} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[10px]"><input type="checkbox" checked={profile.ministries.includes(ministry)} onChange={() => toggleMinistry(ministry)} className="accent-emerald-400" />{ministry}</label>)}
              </div>
              {profile.ministries.includes('Other') && <input value={otherMinistry} onChange={event => setOtherMinistry(event.target.value)} placeholder={t('other')} className={inputClass} />}
            </fieldset>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <label htmlFor="water-baptism" className="text-xs font-semibold">{t('water_baptism')}</label>
              <input id="water-baptism" type="checkbox" checked={Boolean(profile.baptized)} onChange={event => setProfile(current => ({ ...current, baptized: event.target.checked }))} className="h-4 w-4 accent-emerald-400" />
            </div>
            {profile.baptized && <label className="block text-xs">{t('birth_date')}<input type="date" name="baptismDate" value={profile.baptismDate || ''} onChange={updateField} className={inputClass} /></label>}
            <div className="flex gap-2">
              <button type="button" onClick={() => setIsEditing(false)} className="flex-1 rounded-xl border border-white/10 p-2.5 text-xs font-bold text-white/70">{t('cancel')}</button>
              <button type="submit" disabled={isSaving} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500/80 p-2.5 text-xs font-bold text-white disabled:opacity-60"><Save size={13} />{isSaving ? t('saving') : t('save')}</button>
            </div>
          </form>
        ) : (
          <dl className="grid grid-cols-2 gap-2">
            {detail(t('gender'), profile.gender === 'Male' ? t('male') : profile.gender === 'Female' ? t('female') : profile.gender)}
            {detail(t('birth_date'), displayDate(profile.birthDate))}
            {detail(t('conversion_date'), displayDate(profile.conversionDate))}
            {detail(t('member_since'), displayDate(profile.memberSince))}
            {detail(t('title_role'), roleTitle)}
            {detail(t('baptism_date'), profile.baptized ? `${t('yes')}${profile.baptismDate ? ` · ${displayDate(profile.baptismDate)}` : ''}` : '—')}
            <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <dt className="text-[10px] font-semibold text-white/45">{t('ministries')}</dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">{profile.ministries.length ? profile.ministries.map(item => <span key={item} className="rounded-full bg-cyan-400/10 px-2 py-1 text-[10px] text-cyan-100">{item}</span>) : <span className="text-xs text-white/45">—</span>}</dd>
            </div>
          </dl>
        )}
      </article>

      <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-bold"><Heart size={15} className="text-rose-300" />{t('family_unit')}</h2>
          <button type="button" onClick={handleAddFamilyMember} aria-label={t('link_family_member')} className="rounded-full border border-emerald-300/30 bg-emerald-400/10 p-2 text-emerald-200 hover:bg-emerald-400/20"><Plus size={15} /></button>
        </div>
        <p className="mb-2 text-[10px] text-white/50">{profile.familyMembers.length ? t('linked_family_count', { count: profile.familyMembers.length }) : t('no_family_members')}</p>
        <div className="space-y-1.5">
          {profile.familyMembers.map((member, index) => <div key={member.id || `${member.name}-${index}`} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs">{member.name || member.full_name || 'Family member'}</div>)}
        </div>
      </article>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={onEditProfile} className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500/20 p-3 text-xs font-bold text-cyan-100 active:scale-95"><UserRound size={14} />{t('edit_profile')}</button>
        <button type="button" onClick={onChangePassword} className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] p-3 text-xs font-bold active:scale-95"><LockKeyhole size={14} />{t('change_password')}</button>
        <button type="button" onClick={handleDeleteAccount} className="rounded-xl border border-rose-400/20 bg-rose-500/10 p-3 text-xs font-bold text-rose-200 active:scale-95">{t('delete_account')}</button>
        <button type="button" onClick={onDeactivateSession} className="rounded-xl border border-amber-400/20 bg-amber-500/10 p-3 text-xs font-bold text-amber-100 active:scale-95">{t('deactivate_session')}</button>
      </div>

      {status && <p role="status" className="rounded-xl border border-white/10 bg-slate-900/80 p-3 text-xs text-white/70">{status}</p>}
    </section>
  );
}
