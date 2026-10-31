// src/pages/2_People/MembersPage.jsx
import React, { useEffect, useState } from 'react';
import { 
  Search, Phone, UserPlus, Layers, QrCode, 
  MapPin, Users, Cloud, CloudOff, Plus, X, 
  Calendar, Mail, Droplets, Flame, Building2, Trash2, Pencil,
  Crown, ShieldCheck
} from 'lucide-react';
import GlassCard from '../../components/common/GlassCard';
import MemberIdCardModal from '../../components/modals/MemberIdCardModal';
import { useVaultStorage } from '../../hooks/useVaultStorage';
import { deleteMemberById, upsertMember } from '../../services/memberService';

// 🌟 Clergy & Pastoral Precedence Keywords
export const PASTORAL_KEYWORDS = ['pastor', 'rev', 'reverend', 'r.v', 'r.e.v', 'bishop', 'dr', 'doctor of divinity', 'd.d'];

export function isClergyMember(member) {
  if (!member) return false;
  const text = `${member.name || ''} ${member.roleInFamily || ''} ${member.role || ''} ${member.household_role || ''}`.toLowerCase();
  return PASTORAL_KEYWORDS.some(kw => text.includes(kw));
}

export function isLeaderMember(member) {
  if (!member || isClergyMember(member)) return false;
  const text = `${member.name || ''} ${member.roleInFamily || ''} ${member.role || ''}`.toLowerCase();
  const talents = member.ministryTalents || member.ministry_talents || [];
  return talents.length > 0 || /leader|elder|deacon|committee|coordinator|director|in-charge/i.test(text);
}

export function autoSuggestGender(role, currentGender) {
  if (!role) return currentGender || 'Male';
  const lower = role.toLowerCase();
  if (lower.includes('wife') || lower.includes('mother') || lower.includes('daughter') || lower.includes('sister') || lower.includes('grandmother')) {
    return 'Female';
  }
  if (lower.includes('husband') || lower.includes('father') || lower.includes('son') || lower.includes('brother') || lower.includes('grandfather')) {
    return 'Male';
  }
  return currentGender || 'Male';
}

const BACKUP_MEMBERS_DATA = [
  {
    familyId: "FAM-101",
    familyName: "Pastor Johnraja & Household",
    address: "Main Church Street",
    area: "Koduvai",
    campus: "Main Sanctuary",
    headMember: {
      name: "Pastor Johnraja",
      gender: "Male",
      dob: "1980-05-14",
      phone: "8428044555",
      email: "johnraja23@gmail.com",
      area: "Koduvai",
      campus: "Main Sanctuary",
      bloodGroup: "AB+",
      weddingAnniversary: "2008-09-12",
      baptismDate: "1998-04-10",
      holySpiritBaptism: true,
      emergencyContact: "Paulraj (+91 98401 23456)",
      ministryTalents: ["Worship Team & Vocals", "Sunday School & Kids Ministry"],
      memberId: "GCC-MBR-1101",
      roleInFamily: "Lead Pastor / Head of Family",
      status: "Active"
    },
    members: [
      { name: "Esther", roleInFamily: "Spouse / Wife", phone: "8428044555", gender: "Female", bloodGroup: "A+", memberId: "GCC-MBR-10101", status: "Active" },
      { name: "Monika", roleInFamily: "Son / Daughter", phone: "", gender: "Female", bloodGroup: "A+", memberId: "GCC-MBR-10102", status: "Active" }
    ]
  },
  {
    familyId: "FAM-102",
    familyName: "Suresh & Household",
    address: "Koduvai Center",
    area: "Koduvai",
    campus: "Main Sanctuary",
    headMember: {
      name: "Suresh",
      gender: "Male",
      dob: "1988-11-20",
      phone: "7845121215",
      email: "ssser@gmail.com",
      area: "Koduvai",
      campus: "Main Sanctuary",
      bloodGroup: "O+",
      weddingAnniversary: "2015-06-18",
      baptismDate: "2010-08-15",
      holySpiritBaptism: true,
      emergencyContact: "7845121215",
      ministryTalents: ["Media, Sound & Live Broadcast"],
      memberId: "GCC-MBR-1102",
      roleInFamily: "Head of Family",
      status: "Active"
    },
    members: []
  },
  {
    familyId: "FAM-793010",
    familyName: "Kumar & Household",
    address: "West Street",
    area: "Koduvai",
    campus: "Main Sanctuary",
    headMember: {
      name: "Kumar",
      gender: "Male",
      dob: "",
      phone: "7010328507",
      email: "",
      area: "Koduvai",
      campus: "Main Sanctuary",
      bloodGroup: "O+",
      weddingAnniversary: "",
      baptismDate: "",
      holySpiritBaptism: false,
      emergencyContact: "",
      ministryTalents: ["Worship Team & Vocals"],
      memberId: "GCC-MBR-3010",
      roleInFamily: "Head of Family",
      status: "Active"
    },
    members: []
  }
];

export default function MembersPage({
  theme,
  onAddNewMember,
  onEditMember,
  refreshTrigger = 0
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedFamilyId, setExpandedFamilyId] = useState('FAM-101');
  const [selectedCardMember, setSelectedCardMember] = useState(null);
  const [selectedFamily, setSelectedFamily] = useState(null);

  // Modals
  const [isHeadModalOpen, setIsHeadModalOpen] = useState(false);
  const [isSubMemberModalOpen, setIsSubMemberModalOpen] = useState(false);
  const [targetFamilyForSub, setTargetFamilyForSub] = useState(null);
  const [editingFamilyId, setEditingFamilyId] = useState(null);
  const [editingSubMemberId, setEditingSubMemberId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // குடும்பத் தலைவர் படிவம்
  const [headForm, setHeadForm] = useState({
    name: '',
    gender: 'Male',
    dob: '',
    phone: '',
    email: '',
    area: 'Koduvai',
    address: '',
    campus: 'Main Sanctuary',
    bloodGroup: 'O+',
    weddingAnniversary: '',
    baptismDate: '',
    holySpiritBaptism: false,
    emergencyContact: '',
    ministryTalents: 'Worship Team & Vocals'
  });

  // குடும்பத் தலைவர் படிவத்திலேயே உறுப்பினர் சேர்க்கை (Bundle Members)
  const [initialMembers, setInitialMembers] = useState([]);

  // சப்-மெம்பர் சேர்க்கும் தனி படிவம்
  const [subForm, setSubForm] = useState({
    name: '',
    roleInFamily: 'Spouse / Wife',
    gender: 'Female',
    dob: '',
    phone: '',
    bloodGroup: 'A+'
  });

  // Vault Hook
  const { 
    data: rawFamilies, 
    saveData: syncFamilies,
    deleteData: removeFamily,
    isCloudSynced, 
    refreshData,
    isLoading
  } = useVaultStorage('members', BACKUP_MEMBERS_DATA);

  useEffect(() => {
    if (refreshTrigger > 0) {
      refreshData();
    }
  }, [refreshTrigger, refreshData]);

  // 🌟 Normalizer (raw_payload-ஐ பிரித்து எடுத்தல்)
  const normalizedFamilies = React.useMemo(() => {
    const list = Array.isArray(rawFamilies) ? rawFamilies : [];
    const seenMap = new Map();
    const individualGroups = new Map();

    list.forEach((row, idx) => {
      // raw_payload இருந்தால் அதை முதன்மையாக எடுத்தல்
      const fam = row.raw_payload
        ? {
            ...row,
            ...(typeof row.raw_payload === 'string' ? JSON.parse(row.raw_payload) : row.raw_payload)
          }
        : row;
      const hasHouseholdPayload = Boolean(
        fam.headMember ||
        Array.isArray(fam.members) ||
        typeof fam.members === 'string'
      );

      if (!hasHouseholdPayload && (fam.name || fam.memberId || row.id)) {
        const familyId = String(fam.family_id || fam.familyId || row.family_id || row.id || `FAM-${idx + 101}`);
        const role = fam.household_role || fam.roleInFamily || fam.role || '';
        const memberId = String(row.id || fam.id || fam.memberId || `MBR-${idx + 101}`);
        const member = {
          sourceData: fam,
          memberId,
          name: fam.name || fam.head_name || 'Unnamed Believer',
          gender: fam.gender || 'Other',
          dob: fam.date_of_birth || fam.dob || '',
          age: fam.age ?? '',
          phone: fam.phone || '',
          email: fam.email || '',
          bloodGroup: fam.blood_group || fam.bloodGroup || 'N/A',
          weddingAnniversary: fam.wedding_anniversary || fam.weddingAnniversary || '',
          baptismDate: fam.baptism_date || fam.baptismDate || '',
          isBaptized: Boolean(fam.is_baptized ?? fam.isBaptized ?? fam.baptism_date ?? fam.baptismDate),
          holySpiritBaptism: Boolean(fam.is_anointed ?? fam.holySpiritBaptism),
          emergencyContact: fam.emergency_contact || fam.emergencyContact || '',
          roleInFamily: role || (memberId === familyId ? 'Head of Family' : 'Member'),
          ministryTalents: fam.ministry_talents || fam.ministryTalents || [],
          status: fam.status || 'Active'
        };
        const isHead = member.roleInFamily === 'Head of Family' ||
          /head of family/i.test(member.roleInFamily) ||
          /lead pastor/i.test(member.roleInFamily) ||
          (!role && memberId === familyId);

        if (!individualGroups.has(familyId)) {
          individualGroups.set(familyId, {
            familyId,
            familyName: fam.family_name || fam.familyName || `${member.name} & Household`,
            area: fam.area || 'Koduvai',
            address: fam.address || '',
            campus: fam.campus || 'Main Sanctuary',
            headMember: null,
            members: []
          });
        }

        const group = individualGroups.get(familyId);
        if (isHead && !group.headMember) {
          group.headMember = member;
          group.familyName = fam.family_name || fam.familyName || `${member.name} & Household`;
        } else {
          group.members.push(member);
        }
        group.area = fam.area || group.area;
        group.address = fam.address || group.address;
        group.campus = fam.campus || group.campus;
        return;
      }

      const head = fam.headMember || {};

      const headName = head.name || fam.name || fam.head_name || 'Unnamed Believer';
      const headPhone = head.phone || fam.phone || fam.mobile || '';
      const headMemberId = head.memberId || head.id || fam.memberId || fam.id || `MBR-${idx + 101}`;
      const headBlood = head.bloodGroup || head.blood_group || fam.bloodGroup || 'N/A';
      const headRole = head.roleInFamily || head.role || (headName.includes('Pastor') ? 'Lead Pastor' : 'Head of Family');
      const headTalents = head.ministryTalents || fam.ministryTalents || [];

      let membersList = [];
      try {
        if (Array.isArray(fam.members)) {
          membersList = fam.members;
        } else if (typeof fam.members === 'string') {
          membersList = JSON.parse(fam.members);
        }
      } catch {
        membersList = [];
      }

      const familyId = fam.familyId || row.id || fam.id || `FAM-${idx + 101}`;
      const familyName = fam.familyName || fam.family_name || `${headName} & Household`;
      const area = fam.area || head.area || 'Koduvai';
      const address = fam.address || head.address || '';
      const campus = fam.campus || head.campus || 'Main Sanctuary';

      const uniqueKey = String(familyId);

      if (!seenMap.has(uniqueKey)) {
        seenMap.set(uniqueKey, {
          familyId,
          familyName,
          area,
          address,
          campus,
          headMember: {
            sourceData: head,
            memberId: headMemberId,
            name: headName,
            gender: head.gender || 'Male',
            dob: head.dob || '',
            phone: headPhone || 'No phone',
            email: head.email || '',
            bloodGroup: headBlood,
            weddingAnniversary: head.weddingAnniversary || '',
            baptismDate: head.baptismDate || '',
            isBaptized: Boolean(head.isBaptized ?? head.is_baptized ?? head.baptismDate),
            holySpiritBaptism: Boolean(head.holySpiritBaptism),
            emergencyContact: head.emergencyContact || '',
            roleInFamily: headRole,
            ministryTalents: headTalents
          },
          members: membersList.map((m, mIdx) => ({
            sourceData: m,
            name: m.name || `Member ${mIdx + 1}`,
            roleInFamily: m.roleInFamily || m.role || 'Member',
            memberId: m.memberId || m.id || `${headMemberId}-${mIdx + 1}`,
            bloodGroup: m.bloodGroup || m.blood_group || 'N/A',
            phone: m.phone || '',
            dob: m.dob || '',
            gender: m.gender || 'Female',
            status: m.status || 'Active',
            isBaptized: Boolean(m.isBaptized ?? m.is_baptized ?? m.baptismDate ?? m.baptism_date)
          }))
        });
      }
    });

    individualGroups.forEach((family, familyId) => {
      if (!family.headMember) {
        family.headMember = family.members.shift() || {
          memberId: familyId,
          name: 'Unnamed Believer',
          roleInFamily: 'Head of Family',
          phone: 'No phone',
          bloodGroup: 'N/A',
          ministryTalents: [],
          status: 'Active'
        };
      }

      const existingFamily = seenMap.get(familyId);
      if (existingFamily) {
        existingFamily.members = [...existingFamily.members, ...family.members];
      } else {
        seenMap.set(familyId, family);
      }
    });

    return Array.from(seenMap.values());
  }, [rawFamilies]);

  const isIndividualMemberData = (Array.isArray(rawFamilies) ? rawFamilies : []).some((row) => (
    row.household_role && !row.headMember && !Array.isArray(row.members)
  ));

  const persistFamilies = async (updatedFamilies) => {
    if (!isIndividualMemberData) {
      await syncFamilies(updatedFamilies);
      return;
    }

    const nextRecords = updatedFamilies.flatMap((family) => {
      const familyMembers = [
        { ...family.headMember, roleInFamily: family.headMember.roleInFamily || 'Head of Family' },
        ...family.members
      ];

      return familyMembers.map((member) => {
        const source = rawFamilies.find(row => String(row.id) === String(member.memberId)) || {};
        const sourcePayload = typeof source.raw_payload === 'string'
          ? JSON.parse(source.raw_payload)
          : source.raw_payload || {};
        const record = {
          id: member.memberId,
          family_id: family.familyId,
          house_id: source.house_id || family.familyId,
          household_role: member.roleInFamily,
          family_name: family.familyName,
          head_name: family.headMember.name,
          name: member.name,
          gender: member.gender || source.gender || 'Other',
          date_of_birth: member.dob || source.date_of_birth || null,
          age: member.age ?? source.age ?? null,
          blood_group: member.bloodGroup || source.blood_group || null,
          wedding_anniversary: member.weddingAnniversary || source.wedding_anniversary || null,
          type: member.type || source.type || 'Member',
          status: member.status || source.status || 'Active',
          phone: member.phone || null,
          email: member.email || null,
          campus: family.campus || source.campus || null,
          area: family.area || source.area || null,
          address: family.address || source.address || null,
          gps_coordinates: source.gps_coordinates || null,
          is_baptized: Boolean(member.isBaptized ?? source.is_baptized),
          baptism_date: member.baptismDate || source.baptism_date || null,
          is_anointed: Boolean(member.holySpiritBaptism ?? source.is_anointed),
          holy_spirit_baptism_date: source.holy_spirit_baptism_date || null,
          ministry_talents: member.ministryTalents || source.ministry_talents || [],
          created_at: source.created_at,
          raw_payload: {
            ...sourcePayload,
            memberId: member.memberId,
            familyId: family.familyId,
            name: member.name,
            roleInFamily: member.roleInFamily,
            gender: member.gender,
            dob: member.dob || '',
            age: member.age ?? '',
            bloodGroup: member.bloodGroup || '',
            phone: member.phone || '',
            email: member.email || '',
            weddingAnniversary: member.weddingAnniversary || '',
            baptismDate: member.baptismDate || '',
            isBaptized: Boolean(member.isBaptized),
            isAnointed: Boolean(member.holySpiritBaptism),
            holySpiritBaptismDate: source.holy_spirit_baptism_date || '',
            emergencyContact: member.emergencyContact || '',
            status: member.status || 'Active',
            ministryTalents: member.ministryTalents || []
          }
        };

        return record;
      });
    });

    const nextIds = new Set(nextRecords.map(record => String(record.id)));
    const removedIds = rawFamilies
      .filter(row => row.family_id && !nextIds.has(String(row.id)))
      .map(row => row.id);

    for (const record of nextRecords) {
      await upsertMember(record);
    }
    for (const memberId of removedIds) {
      await deleteMemberById(memberId);
    }
    await refreshData();
  };

  // புதிய குடும்பத்தைப் பதிவு செய்தல்
  const handleSaveHead = async (e) => {
    e.preventDefault();
    if (!headForm.name.trim() || !headForm.phone.trim()) {
      alert("தயவுசெய்து பெயர் மற்றும் தொலைபேசி எண்ணை உள்ளிடவும்!");
      return;
    }

    setIsSaving(true);
    const nextId = Date.now().toString().slice(-4);
    const talentList = [headForm.ministryTalents].filter(Boolean);

    if (editingFamilyId) {
      const updated = normalizedFamilies.map((family) => {
        if (family.familyId !== editingFamilyId) return family;
        const existingHead = family.headMember;
        const name = headForm.name.trim();

        return {
          ...family,
          familyName: `${name} & Household`,
          address: headForm.address,
          area: headForm.area.trim() || 'Koduvai',
          campus: headForm.campus,
          headMember: {
            ...existingHead,
            ...headForm,
            name,
            phone: headForm.phone.trim(),
            memberId: existingHead.memberId,
            ministryTalents: existingHead.ministryTalents || talentList,
            roleInFamily: existingHead.roleInFamily
          }
        };
      });

      try {
        await persistFamilies(updated);
        alert(`வெற்றி! ${headForm.name.trim()} குடும்ப விவரங்கள் புதுப்பிக்கப்பட்டன.`);
        setIsHeadModalOpen(false);
        setEditingFamilyId(null);
      } catch (error) {
        alert(`Supabase ஒத்திசைவு தோல்வியடைந்தது: ${error.message}. சாதனத்தில் உள்ள vault நகல் தக்கவைக்கப்பட்டது.`);
      } finally {
        setIsSaving(false);
      }
      return;
    }

    const newFamily = {
      familyId: `FAM-${nextId}`,
      familyName: `${headForm.name.trim()} & Household`,
      address: headForm.address,
      area: headForm.area.trim() || 'Koduvai',
      campus: headForm.campus,
      headMember: {
        ...headForm,
        memberId: `GCC-MBR-${nextId}`,
        ministryTalents: talentList,
        roleInFamily: headForm.name.includes('Pastor') ? 'Lead Pastor' : 'Head of Family',
        status: 'Active'
      },
      members: initialMembers.map((m, mIdx) => ({
        ...m,
        memberId: `GCC-MBR-${nextId}0${mIdx + 1}`,
        status: 'Active'
      }))
    };

    const updated = [newFamily, ...normalizedFamilies];
    try {
      await persistFamilies(updated);
      alert(`வெற்றி! ${newFamily.headMember.name} குடும்பம் சேர்க்கப்பட்டது.`);
      setIsHeadModalOpen(false);
      setInitialMembers([]);
    } catch (error) {
      alert(`Supabase ஒத்திசைவு தோல்வியடைந்தது: ${error.message}. சாதனத்தில் உள்ள vault நகல் தக்கவைக்கப்பட்டது.`);
    } finally {
      setIsSaving(false);
    }
  };

  // துணை உறுப்பினரைச் சேர்த்தல்
  const handleSaveSubMember = async (e) => {
    e.preventDefault();
    if (!subForm.name.trim() || !targetFamilyForSub) return;

    setIsSaving(true);
    const newSub = editingSubMemberId
      ? {
          ...subForm,
          memberId: editingSubMemberId,
          status: targetFamilyForSub.members.find(member => member.memberId === editingSubMemberId)?.status || 'Active'
        }
      : {
          ...subForm,
          memberId: `GCC-MBR-${Math.floor(10000 + Math.random() * 90000)}`,
          status: 'Active'
        };

    const updated = normalizedFamilies.map(f => {
      if (f.familyId === targetFamilyForSub.familyId) {
        return {
          ...f,
          members: editingSubMemberId
            ? (f.members || []).map((member) => (
                member.memberId === editingSubMemberId ? newSub : member
              ))
            : [...(f.members || []), newSub]
        };
      }
      return f;
    });

    try {
      await persistFamilies(updated);
      setExpandedFamilyId(targetFamilyForSub.familyId);
      setIsSubMemberModalOpen(false);
      setEditingSubMemberId(null);
      alert(editingSubMemberId
        ? `${newSub.name} விவரங்கள் புதுப்பிக்கப்பட்டன.`
        : `வெற்றி! ${newSub.name} ${targetFamilyForSub.familyName}-ல் சேர்க்கப்பட்டார்.`);
    } catch (error) {
      alert(`Supabase ஒத்திசைவு தோல்வியடைந்தது: ${error.message}. சாதனத்தில் உள்ள vault நகல் தக்கவைக்கப்பட்டது.`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteHousehold = async (family) => {
    if (!window.confirm(`${family.familyName} குடும்பத்தையும் அதன் உறுப்பினர்களையும் நீக்கவா?`)) return;

    setIsSaving(true);
    try {
      await removeFamily(family.familyId);
      alert(`${family.familyName} குடும்பம் நீக்கப்பட்டது.`);
    } catch (error) {
      alert(`குடும்பத்தை நீக்க முடியவில்லை: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSubMember = async (family, member) => {
    if (!window.confirm(`${member.name} உறுப்பினரை நீக்கவா?`)) return;

    setIsSaving(true);
    try {
      const updated = normalizedFamilies.map((item) => item.familyId === family.familyId
        ? { ...item, members: item.members.filter(person => person.memberId !== member.memberId) }
        : item);
      await persistFamilies(updated);
      alert(`${member.name} நீக்கப்பட்டார்.`);
    } catch (error) {
      alert(`உறுப்பினரை நீக்க முடியவில்லை: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const openHeadEditor = (family) => {
    const head = family.headMember;
    setEditingFamilyId(family.familyId);
    setHeadForm({
      name: head.name === 'Unnamed Believer' ? '' : head.name,
      gender: head.gender || 'Male',
      dob: head.dob || '',
      phone: head.phone === 'No phone' ? '' : head.phone,
      email: head.email || '',
      area: family.area || 'Koduvai',
      address: family.address || '',
      campus: family.campus || 'Main Sanctuary',
      bloodGroup: head.bloodGroup || 'O+',
      weddingAnniversary: head.weddingAnniversary || '',
      baptismDate: head.baptismDate || '',
      holySpiritBaptism: Boolean(head.holySpiritBaptism),
      emergencyContact: head.emergencyContact || '',
      ministryTalents: head.ministryTalents?.[0] || 'Worship Team & Vocals'
    });
    setInitialMembers([]);
    setIsHeadModalOpen(true);
  };

  const getMemberProfileData = (family, member) => ({
    id: member.memberId,
    family_id: family.familyId,
    house_id: member.sourceData?.house_id || member.memberId,
    household_role: member.roleInFamily || 'Member',
    family_name: family.familyName,
    head_name: family.headMember.name,
    name: member.name,
    gender: member.gender || 'Other',
    date_of_birth: member.dob || '',
    age: member.age ?? '',
    blood_group: member.bloodGroup || 'N/A',
    wedding_anniversary: member.weddingAnniversary || '',
    type: member.type || 'Member',
    status: member.status || 'Active',
    phone: member.phone || '',
    email: member.email || '',
    campus: family.campus || '',
    area: family.area || '',
    address: family.address || '',
    gps_coordinates: member.sourceData?.gps_coordinates || '',
    emergency_contact: member.emergencyContact || member.sourceData?.emergency_contact || member.sourceData?.emergencyContact || '',
    is_baptized: Boolean(member.isBaptized),
    baptism_date: member.baptismDate || '',
    is_anointed: Boolean(member.holySpiritBaptism),
    holy_spirit_baptism_date: member.sourceData?.holy_spirit_baptism_date || member.sourceData?.holySpiritBaptismDate || '',
    ministry_talents: member.ministryTalents || [],
    raw_payload: member.sourceData?.raw_payload || {},
    created_at: member.sourceData?.created_at
  });

  const openSubMemberEditor = (family, member) => {
    setTargetFamilyForSub(family);
    setEditingSubMemberId(member.memberId);
    setSubForm({
      name: member.name || '',
      roleInFamily: member.roleInFamily || 'Member',
      gender: member.gender || 'Female',
      dob: member.dob || '',
      phone: member.phone || '',
      bloodGroup: member.bloodGroup || 'A+'
    });
    setIsSubMemberModalOpen(true);
  };

  const filterOptions = ['All', 'Clergy', 'Leaders', 'Families', 'To be baptized'];

  const filteredFamilies = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matched = normalizedFamilies.filter((fam) => {
      const head = fam.headMember;
      const searchValues = [
        fam.familyId, fam.familyName, fam.address, fam.area, fam.campus,
        head.name, head.memberId, head.phone, head.email, head.bloodGroup, head.roleInFamily,
        ...(head.ministryTalents || []),
        ...fam.members.flatMap((member) => [
          member.name, member.memberId, member.phone, member.roleInFamily, member.bloodGroup,
          ...(member.ministryTalents || [])
        ])
      ];
      const matchesSearch = !q || searchValues.some(value => String(value || '').toLowerCase().includes(q));

      if (!matchesSearch) return false;
      if (activeFilter === 'Families') return fam.members.length > 0;
      if (activeFilter === 'Clergy') return isClergyMember(head) || fam.members.some(isClergyMember);
      if (activeFilter === 'Leaders') {
        return (isLeaderMember(head) || fam.members.some(isLeaderMember)) && !isClergyMember(head);
      }
      if (activeFilter === 'To be baptized') {
        return !head.isBaptized || fam.members.some(member => !member.isBaptized);
      }
      return true;
    });

    // 🌟 Sort & Precedence Ranking:
    // Pastoral Clergy records are ranked at the top, followed by Leaders, followed by Members
    return matched.sort((a, b) => {
      const aIsClergy = isClergyMember(a.headMember) || a.members.some(isClergyMember);
      const bIsClergy = isClergyMember(b.headMember) || b.members.some(isClergyMember);

      if (aIsClergy && !bIsClergy) return -1;
      if (!aIsClergy && bIsClergy) return 1;

      const aIsLeader = isLeaderMember(a.headMember) || a.members.some(isLeaderMember);
      const bIsLeader = isLeaderMember(b.headMember) || b.members.some(isLeaderMember);

      if (aIsLeader && !bIsLeader) return -1;
      if (!aIsLeader && bIsLeader) return 1;

      return 0;
    });
  }, [normalizedFamilies, searchQuery, activeFilter]);

  const totalSouls = normalizedFamilies.reduce((acc, f) => acc + 1 + f.members.length, 0);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between px-1">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold tracking-tight">Believers & Families</h2>
            <button
              type="button" 
              onClick={refreshData}
              className={`flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full border cursor-pointer ${
                isCloudSynced 
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              }`}
            >
              {isCloudSynced ? <Cloud size={10} /> : <CloudOff size={10} />}
              <span>{isLoading ? 'Syncing...' : isCloudSynced ? 'Supabase Live' : 'Vault Synced'}</span>
            </button>
          </div>
          <span className="text-[11px] opacity-60 font-semibold">
            {normalizedFamilies.length} Families • {totalSouls} Active Souls
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            if (onAddNewMember) {
              onAddNewMember();
              return;
            }
            setEditingFamilyId(null);
            setHeadForm({
              name: '',
              gender: 'Male',
              dob: '',
              phone: '',
              email: '',
              area: 'Koduvai',
              address: '',
              campus: 'Main Sanctuary',
              bloodGroup: 'O+',
              weddingAnniversary: '',
              baptismDate: '',
              holySpiritBaptism: false,
              emergencyContact: '',
              ministryTalents: 'Worship Team & Vocals'
            });
            setInitialMembers([]);
            setIsHeadModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-white text-xs font-bold shadow-md active:scale-95 transition cursor-pointer"
          style={{ background: theme.accent }}
        >
          <UserPlus size={14} />
          <span>+ Register Family</span>
        </button>
      </div>

      {/* 2. Search Field */}
      <div 
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border backdrop-blur-xl shadow-xs"
        style={{ background: theme.glassBg, borderColor: theme.glassBorder }}
      >
        <Search size={16} className="opacity-50 shrink-0" />
        <input 
          type="text" 
          placeholder="Search pastor, member, phone, campus or area..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none outline-none text-xs w-full font-medium"
        />
        {searchQuery && (
          <button type="button" onClick={() => setSearchQuery('')} className="text-xs opacity-50 hover:opacity-100 cursor-pointer">
            ✕
          </button>
        )}
      </div>

      {/* 3. Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filterOptions.map((filter) => {
          const isSelected = activeFilter === filter;
          return (
            <button
              key={`filter-${filter}`}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all active:scale-95 cursor-pointer ${
                isSelected ? 'shadow-md' : 'opacity-70'
              }`}
              style={{
                background: isSelected ? theme.accent : theme.glassBg,
                color: isSelected ? '#ffffff' : theme.textMain,
                borderColor: theme.glassBorder
              }}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* 4. Family Directory Cards */}
      <div className="space-y-3">
        {filteredFamilies.map((fam) => {
          const head = fam.headMember;
          const isExpanded = expandedFamilyId === fam.familyId;

          return (
            <GlassCard key={fam.familyId} theme={theme} className="p-4 space-y-3">
              
              {/* Family Head Row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-black text-sm text-white shadow-xs shrink-0"
                    style={{ background: theme.accent, borderColor: theme.glassBorder }}
                  >
                    {head.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-xs font-extrabold">{head.name}</h3>
                      {isClergyMember(head) ? (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.25)] flex items-center gap-1">
                          <Crown size={10} className="text-amber-400" />
                          {head.roleInFamily.toUpperCase()}
                        </span>
                      ) : isLeaderMember(head) ? (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center gap-1">
                          <ShieldCheck size={10} className="text-sky-400" />
                          {head.roleInFamily.toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-white/10 text-slate-300 border border-white/10">
                          {head.roleInFamily.toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] opacity-70 font-mono mt-0.5">
                      ID: <span className="font-bold">{head.memberId}</span> • Blood: <span className="text-rose-500 font-bold">{head.bloodGroup}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] opacity-70 mt-0.5">
                      <span className="flex items-center gap-0.5 font-mono"><Phone size={10} /> {head.phone}</span>
                      <span>• <Building2 size={10} className="inline text-cyan-400" /> {fam.campus}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onEditMember
                      ? onEditMember(getMemberProfileData(fam, fam.headMember))
                      : openHeadEditor(fam)}
                    disabled={isSaving}
                    className="p-2 rounded-xl border flex items-center justify-center transition active:scale-95 cursor-pointer disabled:opacity-50"
                    style={{ background: theme.glassBg, borderColor: theme.glassBorder, color: theme.textMain }}
                    title="Edit Family Head"
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFamily(fam);
                      setSelectedCardMember(head);
                    }}
                    className="p-2 rounded-xl border flex items-center justify-center transition active:scale-95 cursor-pointer shadow-xs"
                    style={{ background: theme.glassBg, borderColor: theme.glassBorder, color: theme.accent }}
                    title="Smart PVC ID Card"
                  >
                    <QrCode size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteHousehold(fam)}
                    disabled={isSaving}
                    className="p-2 rounded-xl border flex items-center justify-center transition active:scale-95 cursor-pointer disabled:opacity-50"
                    style={{ background: theme.glassBg, borderColor: theme.glassBorder, color: '#f87171' }}
                    title="Delete Household"
                  >
                    <Trash2 size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpandedFamilyId(isExpanded ? null : fam.familyId)}
                    className="p-2 rounded-xl border flex items-center justify-center transition active:scale-95 cursor-pointer"
                    style={{ 
                      background: isExpanded ? theme.accent : theme.glassBg, 
                      borderColor: theme.glassBorder,
                      color: isExpanded ? '#ffffff' : theme.textMain
                    }}
                    title="Expand Household Tree"
                  >
                    <Layers size={15} className={isExpanded ? 'rotate-90 transition-transform' : ''} />
                  </button>
                </div>
              </div>

              {/* Extended Details Badge */}
              <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] opacity-75">
                {fam.address && (
                  <span className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 border border-white/10 flex items-center gap-1">
                    <MapPin size={10} className="text-rose-400" /> {fam.address} ({fam.area})
                  </span>
                )}
                {head.email && (
                  <span className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 border border-white/10 flex items-center gap-1 font-mono">
                    <Mail size={10} /> {head.email}
                  </span>
                )}
                {head.dob && (
                  <span className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 border border-white/10 flex items-center gap-1 font-mono">
                    <Calendar size={10} /> DOB: {head.dob}
                  </span>
                )}
                {head.weddingAnniversary && (
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1 font-mono">
                    ❤️ Anniv: {head.weddingAnniversary}
                  </span>
                )}
                {head.baptismDate && (
                  <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1 font-mono">
                    <Droplets size={10} /> Baptized: {head.baptismDate}
                  </span>
                )}
                {head.holySpiritBaptism && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <Flame size={10} /> Holy Spirit Anointed
                  </span>
                )}
              </div>

              {/* Sub-members Expansion & + Add Sub-Member Button */}
              {isExpanded && (
                <div className="pt-2 border-t border-black/5 dark:border-white/10 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-[10px] font-bold opacity-75">
                    <span className="flex items-center gap-1 text-cyan-400 font-extrabold">
                      <Users size={12} /> Household Members ({fam.members.length})
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        if (onAddNewMember) {
                          onAddNewMember({
                            family_id: fam.familyId,
                            household_role: 'Spouse / Wife',
                            family_name: fam.familyName,
                            head_name: fam.headMember.name,
                            campus: fam.campus,
                            area: fam.area,
                            address: fam.address
                          });
                          return;
                        }
                        setTargetFamilyForSub(fam);
                        setEditingSubMemberId(null);
                        setSubForm({
                          name: '',
                          roleInFamily: 'Spouse / Wife',
                          gender: 'Female',
                          dob: '',
                          phone: '',
                          bloodGroup: 'A+'
                        });
                        setIsSubMemberModalOpen(true);
                      }}
                      className="px-2 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <Plus size={11} />
                      <span>Add Sub-Member</span>
                    </button>
                  </div>

                  {fam.members.length === 0 ? (
                    <p className="text-[11px] opacity-50 italic py-1">
                      No additional family members registered. Click "+ Add Sub-Member" to add spouse or children.
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {fam.members.map((m, mIdx) => (
                        <div 
                          key={m.memberId || mIdx}
                          className="p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/20 flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h5 className="text-xs font-bold">{m.name}</h5>
                              {isClergyMember(m) ? (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-0.5">
                                  <Crown size={9} /> {m.roleInFamily}
                                </span>
                              ) : isLeaderMember(m) ? (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center gap-0.5">
                                  <ShieldCheck size={9} /> {m.roleInFamily}
                                </span>
                              ) : (
                                <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-md bg-white/20">
                                  {m.roleInFamily}
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] opacity-60 font-mono">
                              ID: {m.memberId} • Blood: <strong className="text-rose-400">{m.bloodGroup}</strong>
                              {m.phone && ` • Ph: ${m.phone}`}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFamily(fam);
                              setSelectedCardMember(m);
                            }}
                            className="p-1.5 rounded-lg border text-xs flex items-center gap-1 transition active:scale-95 cursor-pointer"
                            style={{ borderColor: theme.glassBorder, color: theme.accent }}
                          >
                            <QrCode size={12} />
                            <span className="text-[9px] font-bold">ID</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditMember
                              ? onEditMember(getMemberProfileData(fam, m))
                              : openSubMemberEditor(fam, m)}
                            disabled={isSaving}
                            className="p-1.5 rounded-lg border flex items-center justify-center transition active:scale-95 cursor-pointer disabled:opacity-50"
                            style={{ borderColor: theme.glassBorder, color: theme.textMain }}
                            title="Edit Member"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSubMember(fam, m)}
                            disabled={isSaving}
                            className="p-1.5 rounded-lg border flex items-center justify-center transition active:scale-95 cursor-pointer disabled:opacity-50"
                            style={{ borderColor: theme.glassBorder, color: '#f87171' }}
                            title="Delete Member"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          );
        })}
        {filteredFamilies.length === 0 && (
          <div className="py-8 text-center text-xs opacity-60">
            No households match your search or filter.
          </div>
        )}
      </div>

      {/* 5. MODAL 1: REGISTER NEW FAMILY HEAD + HOUSEHOLD BUNDLE */}
      {isHeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md" onClick={() => setIsHeadModalOpen(false)} />
          <div 
            className="relative z-10 w-full max-w-md rounded-[32px] p-5 border shadow-2xl space-y-3.5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
            style={{ background: theme.isDark ? '#1a1426' : '#ffffff', borderColor: theme.glassBorder }}
          >
            <div className="flex justify-between items-center pb-2 border-b border-black/10 dark:border-white/10">
              <h3 className="text-xs font-extrabold flex items-center gap-1.5">
                <UserPlus size={16} style={{ color: theme.accent }} />
                <span>{editingFamilyId ? 'Edit Family Head' : 'Register Believer Household'}</span>
              </h3>
              <button type="button" onClick={() => setIsHeadModalOpen(false)} className="cursor-pointer opacity-60 hover:opacity-100">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveHead} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold block mb-1">Head of Family Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Pastor Johnraja / Suresh"
                    value={headForm.name}
                    onChange={(e) => setHeadForm({ ...headForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 font-bold focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-bold block mb-1">Gender (Mandatory) *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setHeadForm({ ...headForm, gender: 'Male' })}
                      className={`py-1.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        headForm.gender === 'Male'
                          ? 'border-sky-400 bg-sky-500/20 text-sky-300 font-black'
                          : 'border-white/10 bg-white/5 opacity-70'
                      }`}
                    >
                      👨 Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeadForm({ ...headForm, gender: 'Female' })}
                      className={`py-1.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        headForm.gender === 'Female'
                          ? 'border-pink-400 bg-pink-500/20 text-pink-300 font-black'
                          : 'border-white/10 bg-white/5 opacity-70'
                      }`}
                    >
                      👩 Female
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold block mb-1">Mobile Phone *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="10-digit phone"
                    value={headForm.phone}
                    onChange={(e) => setHeadForm({ ...headForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="member@gmail.com"
                    value={headForm.email}
                    onChange={(e) => setHeadForm({ ...headForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold block mb-1">Campus / Branch</label>
                  <select
                    value={headForm.campus}
                    onChange={(e) => setHeadForm({ ...headForm, campus: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 focus:outline-none cursor-pointer"
                  >
                    <option value="Main Sanctuary">Main Sanctuary</option>
                    <option value="Koduvai Branch">Koduvai Branch</option>
                    <option value="City Campus">City Campus</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold block mb-1">Area / Suburb</label>
                  <input 
                    type="text" 
                    value={headForm.area}
                    onChange={(e) => setHeadForm({ ...headForm, area: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-bold block mb-1">Residence Street Address</label>
                  <input 
                    type="text" 
                    placeholder="Door no, Street name, Landmark"
                    value={headForm.address}
                    onChange={(e) => setHeadForm({ ...headForm, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold block mb-1">Blood Group</label>
                  <select
                    value={headForm.bloodGroup}
                    onChange={(e) => setHeadForm({ ...headForm, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 focus:outline-none cursor-pointer"
                  >
                    {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold block mb-1">Date of Birth</label>
                  <input 
                    type="date" 
                    value={headForm.dob}
                    onChange={(e) => setHeadForm({ ...headForm, dob: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold block mb-1">Wedding Anniversary</label>
                  <input 
                    type="date" 
                    value={headForm.weddingAnniversary}
                    onChange={(e) => setHeadForm({ ...headForm, weddingAnniversary: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold block mb-1">Baptism Date</label>
                  <input 
                    type="date" 
                    value={headForm.baptismDate}
                    onChange={(e) => setHeadForm({ ...headForm, baptismDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* 🌟 குடும்ப உறுப்பினர்களை இங்கேயே சேர்க்கும் வசதி (Household Bundle) */}
              {!editingFamilyId && (
              <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/10 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-cyan-400">Household Members Bundle ({initialMembers.length})</span>
                  <button
                    type="button"
                    onClick={() => setInitialMembers([...initialMembers, { name: '', roleInFamily: 'Spouse / Wife', phone: '', bloodGroup: 'A+' }])}
                    className="px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={10} /> Add Member
                  </button>
                </div>

                {initialMembers.map((m, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-black/10 dark:bg-white/5 border border-white/10 grid grid-cols-3 gap-1.5">
                    <input 
                      type="text" 
                      placeholder="Name" 
                      value={m.name} 
                      onChange={(e) => {
                        const copy = [...initialMembers];
                        copy[idx].name = e.target.value;
                        setInitialMembers(copy);
                      }}
                      className="px-2 py-1 rounded-lg bg-transparent border border-white/10 text-xs focus:outline-none"
                    />
                    <select 
                      value={m.roleInFamily} 
                      onChange={(e) => {
                        const copy = [...initialMembers];
                        const role = e.target.value;
                        copy[idx].roleInFamily = role;
                        copy[idx].gender = autoSuggestGender(role, copy[idx].gender);
                        setInitialMembers(copy);
                      }}
                      className="px-1 py-1 rounded-lg bg-slate-900 border border-white/10 text-[10px] focus:outline-none text-white"
                    >
                      <option value="Spouse / Wife">Spouse / Wife</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Son / Daughter">Son / Daughter</option>
                      <option value="Father / Mother">Father / Mother</option>
                      <option value="Brother / Sister">Brother / Sister</option>
                    </select>
                    <button 
                      type="button" 
                      onClick={() => setInitialMembers(initialMembers.filter((_, i) => i !== idx))}
                      className="text-rose-400 text-right pr-1 cursor-pointer flex items-center justify-end"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-2.5 rounded-2xl text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer mt-1"
                style={{ background: theme.accent }}
              >
                {isSaving ? 'Saving...' : editingFamilyId ? 'Save Family Changes' : 'Save Believer Household'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL 2: ADD SUB-MEMBER */}
      {isSubMemberModalOpen && targetFamilyForSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md" onClick={() => setIsSubMemberModalOpen(false)} />
          <div 
            className="relative z-10 w-full max-w-sm rounded-[32px] p-5 border shadow-2xl space-y-3.5 animate-in zoom-in-95"
            style={{ background: theme.isDark ? '#1a1426' : '#ffffff', borderColor: theme.glassBorder }}
          >
            <div className="flex justify-between items-center pb-2 border-b border-black/10 dark:border-white/10">
              <div>
                <h3 className="text-xs font-extrabold flex items-center gap-1.5">
                  <Users size={16} style={{ color: theme.accent }} />
                  <span>{editingSubMemberId ? 'Edit Family Member' : 'Add Family Member'}</span>
                </h3>
                <span className="text-[10px] opacity-60">To: {targetFamilyForSub.familyName}</span>
              </div>
              <button type="button" onClick={() => setIsSubMemberModalOpen(false)} className="cursor-pointer opacity-60 hover:opacity-100">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveSubMember} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold block mb-1">Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Esther / Monika"
                  value={subForm.name}
                  onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold block mb-1">Relationship</label>
                  <select
                    value={subForm.roleInFamily}
                    onChange={(e) => {
                      const role = e.target.value;
                      const gender = autoSuggestGender(role, subForm.gender);
                      setSubForm({ ...subForm, roleInFamily: role, gender });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 focus:outline-none cursor-pointer"
                  >
                    <option value="Spouse / Wife">Spouse / Wife</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Son / Daughter">Son / Daughter</option>
                    <option value="Father / Mother">Father / Mother</option>
                    <option value="Brother / Sister">Brother / Sister</option>
                    <option value="Member">Other / Member</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold block mb-1">Blood Group</label>
                  <select
                    value={subForm.bloodGroup}
                    onChange={(e) => setSubForm({ ...subForm, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 focus:outline-none cursor-pointer"
                  >
                    {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gender Selector for Sub-Member */}
              <div>
                <label className="text-[10px] font-bold block mb-1">Gender *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSubForm({ ...subForm, gender: 'Male' })}
                    className={`py-1.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                      subForm.gender === 'Male'
                        ? 'border-sky-400 bg-sky-500/25 text-sky-300'
                        : 'border-white/10 bg-white/5 opacity-70'
                    }`}
                  >
                    👨 Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubForm({ ...subForm, gender: 'Female' })}
                    className={`py-1.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                      subForm.gender === 'Female'
                        ? 'border-pink-400 bg-pink-500/25 text-pink-300'
                        : 'border-white/10 bg-white/5 opacity-70'
                    }`}
                  >
                    👩 Female
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold block mb-1">Mobile Phone (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Direct Phone Number"
                  value={subForm.phone}
                  onChange={(e) => setSubForm({ ...subForm, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 font-mono focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-2.5 rounded-2xl text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer mt-1"
                style={{ background: theme.accent }}
              >
                {isSaving ? 'Saving...' : editingSubMemberId ? 'Save Member Changes' : 'Add to Household'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PVC Smart Card Modal */}
      <MemberIdCardModal 
        isOpen={Boolean(selectedCardMember)}
        onClose={() => {
          setSelectedCardMember(null);
          setSelectedFamily(null);
        }}
        member={selectedCardMember}
        family={selectedFamily}
        theme={theme}
      />

    </div>
  );
}