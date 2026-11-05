import { getSupabase } from './supabaseClient';
import { ROLES } from './accessControl';

export const AUTH_SESSION_KEY = 'graceos_mobile_auth_session';

const VALID_ROLES = new Set(Object.values(ROLES));

function normalizeRole(role) {
  return VALID_ROLES.has(role) ? role : ROLES.MEMBER;
}

function toSafeUser(user) {
  if (!user || typeof user !== 'object') return null;
  const metadata = user.user_metadata || {};
  const appMetadata = user.app_metadata || {};
  const phone = user.mobileNumber || user.phone || metadata.phone || '';
  const organizationName = user.organizationName || metadata.organization_name || '';
  const optionalFields = ['gender', 'birthDate', 'conversionDate', 'memberSince', 'title', 'baptismDate', 'avatar'];

  const safeUser = {
    id: user.id || '',
    email: user.email || '',
    name: metadata.full_name || metadata.name || user.name || user.email || 'GraceOS User',
    role: normalizeRole(VALID_ROLES.has(user.role) ? user.role : appMetadata.role),
    ...(phone ? { mobileNumber: phone } : {}),
    ...(organizationName ? { organizationName } : {}),
    ...(user.isDemoMode === true ? { isDemoMode: true } : {})
  };
  optionalFields.forEach(field => {
    if (typeof user[field] === 'string') safeUser[field] = user[field];
  });
  if (typeof user.baptized === 'boolean') safeUser.baptized = user.baptized;
  if (Array.isArray(user.ministries)) safeUser.ministries = user.ministries.filter(item => typeof item === 'string');
  if (Array.isArray(user.familyMembers)) safeUser.familyMembers = user.familyMembers.filter(item => item && typeof item === 'object');
  return safeUser;
}

export function getActiveSession() {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.id) return null;
    return {
      id: String(parsed.id),
      email: typeof parsed.email === 'string' ? parsed.email : '',
      name: typeof parsed.name === 'string' ? parsed.name : 'GraceOS User',
      role: normalizeRole(parsed.role),
      ...(typeof parsed.mobileNumber === 'string' ? { mobileNumber: parsed.mobileNumber } : {}),
      ...(typeof parsed.organizationName === 'string' ? { organizationName: parsed.organizationName } : {}),
      ...(['gender', 'birthDate', 'conversionDate', 'memberSince', 'title', 'baptismDate', 'avatar']
        .reduce((fields, field) => typeof parsed[field] === 'string' ? { ...fields, [field]: parsed[field] } : fields, {})),
      ...(typeof parsed.baptized === 'boolean' ? { baptized: parsed.baptized } : {}),
      ...(Array.isArray(parsed.ministries) ? { ministries: parsed.ministries.filter(item => typeof item === 'string') } : {}),
      ...(Array.isArray(parsed.familyMembers) ? { familyMembers: parsed.familyMembers.filter(item => item && typeof item === 'object') } : {}),
      ...(parsed.isDemoMode === true ? { isDemoMode: true } : {})
    };
  } catch (error) {
    console.warn('[authSession] Unable to read the saved user session:', error);
    return null;
  }
}

export function saveSession(user) {
  const safeUser = toSafeUser(user);
  if (!safeUser?.id) {
    throw new Error('Cannot save a session without an authenticated user ID.');
  }
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(safeUser));
  return safeUser;
}

export function clearSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

export function isAuthenticated() {
  return Boolean(getActiveSession()?.id);
}

export function getUserRole() {
  return getActiveSession()?.role || null;
}

export async function signOut() {
  const activeSession = getActiveSession();
  if (activeSession?.isDemoMode || activeSession?.id.startsWith('MASTER-') || activeSession?.id.startsWith('DEMO-')) {
    clearSession();
    return;
  }

  const client = getSupabase();
  if (!client) {
    clearSession();
    return;
  }

  const { error } = await client.auth.signOut();
  if (error) throw error;
  clearSession();
}
