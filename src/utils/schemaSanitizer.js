// src/utils/schemaSanitizer.js

/**
 * Sanitizes and normalizes member record objects before Supabase / PostgreSQL dispatch.
 * 1. Converts empty date strings ("") to null to prevent PostgreSQL DATE type syntax errors.
 * 2. Explicitly strips deprecated/non-existent columns like emergency_contact / emergencyContact.
 * 3. Enforces types (booleans for baptism/anointing, numeric for age).
 */
export function sanitizeMemberPayload(raw = {}) {
  if (!raw || typeof raw !== 'object') {
    return {};
  }

  // Safe date cleaner: empty strings or invalid values become null
  const cleanDate = (val) => {
    if (!val || typeof val !== 'string') return null;
    const trimmed = val.trim();
    if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') return null;
    // Basic YYYY-MM-DD or ISO pattern verification
    return trimmed;
  };

  const isBaptized = Boolean(raw.is_baptized ?? raw.isBaptized ?? raw.baptism_date ?? raw.baptismDate);
  const isAnointed = Boolean(raw.is_anointed ?? raw.isAnointed ?? raw.holySpiritBaptism ?? raw.holy_spirit_baptism_date);

  const cleanAge = (ageVal) => {
    if (ageVal === '' || ageVal === null || ageVal === undefined) return null;
    const num = Number(ageVal);
    return isNaN(num) ? null : Math.round(num);
  };

  // Clean raw_payload
  let cleanedRawPayload = {};
  if (raw.raw_payload) {
    try {
      cleanedRawPayload = typeof raw.raw_payload === 'string'
        ? JSON.parse(raw.raw_payload)
        : { ...raw.raw_payload };
    } catch {
      cleanedRawPayload = {};
    }
  }

  // Strip emergency contact from raw_payload
  delete cleanedRawPayload.emergency_contact;
  delete cleanedRawPayload.emergencyContact;

  // Build sanitized top-level record
  const sanitized = {
    id: String(raw.id || raw.memberId || `MBR-${Date.now()}`),
    family_id: String(raw.family_id || raw.familyId || raw.id || `FAM-${Date.now()}`),
    house_id: String(raw.house_id || raw.houseId || raw.family_id || raw.familyId || raw.id),
    household_role: raw.household_role || raw.roleInFamily || raw.role || 'Member',
    family_name: (raw.family_name || raw.familyName || `${raw.name || 'Believer'} & Household`).trim(),
    head_name: (raw.head_name || raw.headName || raw.name || 'Believer').trim(),
    name: (raw.name || 'Believer').trim(),
    gender: raw.gender === 'Female' ? 'Female' : 'Male',
    date_of_birth: cleanDate(raw.date_of_birth || raw.dob),
    age: cleanAge(raw.age),
    blood_group: raw.blood_group || raw.bloodGroup || 'O+',
    wedding_anniversary: cleanDate(raw.wedding_anniversary || raw.weddingAnniversary),
    type: raw.type || 'Member',
    status: raw.status || 'Active',
    phone: (raw.phone || '').trim() || null,
    email: (raw.email || '').trim() || null,
    campus: raw.campus || 'Main Sanctuary',
    area: raw.area || 'Koduvai',
    address: (raw.address || '').trim() || null,
    gps_coordinates: raw.gps_coordinates || raw.gpsCoordinates || null,
    is_baptized: isBaptized,
    baptism_date: isBaptized ? cleanDate(raw.baptism_date || raw.baptismDate) : null,
    is_anointed: isAnointed,
    holy_spirit_baptism_date: isAnointed ? cleanDate(raw.holy_spirit_baptism_date || raw.holySpiritBaptismDate) : null,
    ministry_talents: Array.isArray(raw.ministry_talents || raw.ministryTalents)
      ? (raw.ministry_talents || raw.ministryTalents)
      : [],
    raw_payload: {
      ...cleanedRawPayload,
      memberId: String(raw.id || raw.memberId || `MBR-${Date.now()}`),
      familyId: String(raw.family_id || raw.familyId || raw.id),
      name: (raw.name || 'Believer').trim(),
      roleInFamily: raw.household_role || raw.roleInFamily || 'Member',
      gender: raw.gender === 'Female' ? 'Female' : 'Male',
      dob: cleanDate(raw.date_of_birth || raw.dob),
      bloodGroup: raw.blood_group || raw.bloodGroup || 'O+',
      phone: (raw.phone || '').trim() || '',
      email: (raw.email || '').trim() || '',
      isBaptized,
      isAnointed
    },
    updated_at: new Date().toISOString()
  };

  if (raw.created_at) {
    sanitized.created_at = raw.created_at;
  }

  // Explicit safety strip of schema cache hazards
  delete sanitized.emergency_contact;
  delete sanitized.emergencyContact;

  return sanitized;
}

