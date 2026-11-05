import { useState } from 'react';
import { LockKeyhole, Save, X } from 'lucide-react';
import { getSupabase } from '../../utils/supabaseClient';
import { saveSession } from '../../utils/authSession';
import { useTranslation } from '../../context/LanguageContext';

const EMPTY_PROFILE = {
  name: '',
  mobileNumber: '',
  organizationName: '',
  email: ''
};

export default function UserProfileEditModal({
  isOpen,
  initialMode = 'profile',
  userProfile = {},
  onClose,
  onSave
}) {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(() => ({
    name: userProfile.name || EMPTY_PROFILE.name,
    mobileNumber: userProfile.mobileNumber || EMPTY_PROFILE.mobileNumber,
    organizationName: userProfile.organizationName || EMPTY_PROFILE.organizationName,
    email: userProfile.email || EMPTY_PROFILE.email
  }));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const updateField = event => {
    const { name, value } = event.target;
    setProfile(current => ({ ...current, [name]: value }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setMessage('');
    if (password && password !== confirmPassword) {
      setMessage('The new password and confirmation do not match.');
      return;
    }
    if (password && password.length < 8) {
      setMessage('The new password must be at least 8 characters.');
      return;
    }
    if (password && (!getSupabase() || userProfile.isDemoMode || String(userProfile.id || '').startsWith('MASTER-'))) {
      setMessage(t('password_requires_cloud'));
      return;
    }

    setIsSaving(true);
    try {
      const sessionUser = saveSession({
        ...userProfile,
        ...profile,
        name: profile.name.trim(),
        email: profile.email.trim()
      });
      onSave?.(sessionUser);

      const client = getSupabase();
      const isLocalAccount = userProfile.isDemoMode ||
        String(userProfile.id || '').startsWith('MASTER-') ||
        String(userProfile.id || '').startsWith('DEMO-');
      let cloudWarning = '';
      if (client && !isLocalAccount) {
        const authChanges = {
          data: {
            full_name: profile.name.trim(),
            phone: profile.mobileNumber.trim(),
            organization_name: profile.organizationName.trim()
          }
        };
        if (profile.email.trim() !== userProfile.email) authChanges.email = profile.email.trim();
        if (password) authChanges.password = password;

        const { error } = await client.auth.updateUser(authChanges);
        if (error) cloudWarning = error.message;

        const { error: profileError } = await client.from('profiles').upsert({
          id: userProfile.id,
          full_name: profile.name.trim(),
          email: profile.email.trim(),
          phone: profile.mobileNumber.trim(),
          organization_name: profile.organizationName.trim()
        }, { onConflict: 'id' });
        if (profileError) {
          cloudWarning = [cloudWarning, profileError.message].filter(Boolean).join(' ');
        }
      } else {
        cloudWarning = 'Profile saved on this device. Cloud profile sync requires a Supabase account.';
      }

      setMessage(cloudWarning
        ? `Saved locally. Cloud sync note: ${cloudWarning}`
        : 'Profile updated and synced with Supabase.');
      if (!cloudWarning) onClose?.();
    } catch (error) {
      setMessage(`Profile saved locally, but cloud sync failed: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = 'mt-1.5 w-full rounded-xl border border-white/15 bg-black/25 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-400';
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <button type="button" aria-label="Close profile editor" onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <section role="dialog" aria-modal="true" aria-labelledby="profile-editor-title" className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/15 bg-slate-950/95 p-5 text-white shadow-2xl backdrop-blur-2xl">
        <header className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h2 id="profile-editor-title" className="text-lg font-black">{initialMode === 'password' ? t('change_password') : t('user_profile')}</h2>
            <p className="text-xs text-white/55">Update your account and contact details.</p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="rounded-full p-2 text-white/60 hover:bg-white/10"><X size={17} /></button>
        </header>
        <form onSubmit={handleSubmit} className="space-y-3">
          {initialMode !== 'password' && (
            <>
              <label className="block text-xs font-semibold">{t('full_name')}<input name="name" value={profile.name} onChange={updateField} required className={inputClass} /></label>
              <label className="block text-xs font-semibold">{t('mobile_number')}<input name="mobileNumber" type="tel" value={profile.mobileNumber} onChange={updateField} className={inputClass} /></label>
              <label className="block text-xs font-semibold">{t('organization_name')}<input name="organizationName" value={profile.organizationName} onChange={updateField} className={inputClass} /></label>
              <label className="block text-xs font-semibold">{t('email')}<input name="email" type="email" value={profile.email} onChange={updateField} required className={inputClass} /></label>
            </>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-semibold">{t('change_password')}<input type="password" autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} minLength={8} required={initialMode === 'password'} className={inputClass} /></label>
            <label className="block text-xs font-semibold">{t('confirm_password')}<input type="password" autoComplete="new-password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} minLength={8} required={initialMode === 'password'} className={inputClass} /></label>
          </div>
          {message && <p role="status" className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-xs text-amber-100">{message}</p>}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-white/10 bg-white/5 p-3 text-sm font-bold text-white/75 hover:bg-white/10">Cancel</button>
            <button type="submit" disabled={isSaving} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500/80 p-3 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-60">
              {password ? <LockKeyhole size={15} /> : <Save size={15} />}{isSaving ? t('saving') : t('save')}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
