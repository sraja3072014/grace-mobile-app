export const SUPPORTED_LANGUAGES = ['en', 'ta'];
export const LANGUAGE_STORAGE_KEY = 'grace_language';

export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(Number(amount) || 0);
}

export const translations = {
  en: {
    nav: {
      home: 'Home', people: 'People', church: 'Church', connect: 'Connect',
      members: 'Members Directory', visitors: 'Visitors Registry', ministries: 'Ministries & Teams',
      finance: 'Finance & 80G', events: 'Events Calendar', servicePlans: 'Service Plans',
      livestream: 'Live Stream Desk', broadcast: 'Broadcast Hub', prayer: 'Prayer Wall', bible: 'Holy Bible',
      checkIn: 'Check-In', donation: 'Donation / Offering', addPerson: 'Add Person', serviceFlow: 'Service Flow',
      profile: 'View Profile', reports: 'Reports & Audits', settings: 'Settings & Theme', help: 'Help & Support', signOut: 'Sign Out',
      peopleTitle: 'People & Shepherding', churchTitle: 'Church Operations', connectTitle: 'Connect & Fellowship', subMenu: 'Sub Menu', admin: 'Admin'
    },
    common: {
      allMovements: 'All Movements', income: 'Income', expense: 'Expense', tithe: 'Tithe', prayers: 'Prayers',
      fullName: 'Full Name', phone: 'Phone Number', email: 'Email', gender: 'Gender', dateOfBirth: 'Date of Birth',
      age: 'Age', bloodGroup: 'Blood Group', relationship: 'Relationship Category (Household Role)', campus: 'Campus',
      area: 'Area / Suburb', address: 'Residential Address', weddingAnniversary: 'Wedding Anniversary Date',
      dateOfBaptism: 'Date of Baptism', waterBaptism: 'Water Baptism', holySpiritAnointing: 'Holy Spirit Anointing',
      demographics: 'Demographics & Relationship Structure', contactLocation: 'Contact & Location',
      spiritualMilestones: 'Spiritual Milestones & Sacraments', ministryTalents: 'Ministry & Service Talents',
      saveProfile: 'Save Believer Profile to Vault', saving: 'Saving to Vault...', close: 'Close',
      required: '*', male: 'Male', female: 'Female', member: 'Member', household: 'Household', families: 'Families',
      activeSouls: 'Active Souls', addMember: 'Add Member', syncing: 'Syncing...', supabaseLive: 'Supabase Live',
      vaultSynced: 'Vault Synced', search: 'Search', editFamilyHead: 'Edit Family Head', smartId: 'Smart PVC ID Card',
      deleteHousehold: 'Delete Household', expandHousehold: 'Expand Household Tree', deleteMember: 'Delete Member',
      householdMembers: 'Household Members', addSubMember: 'Add Sub-Member', noAdditionalMembers: 'No additional family members registered.',
      baptized: 'Baptized', holySpiritAnointed: 'Holy Spirit Anointed', live: 'Live', updatedLive: 'Updated live'
    },
    overview: { attend: 'Attend', tithe: 'Tithe', sanctuaryEvents: 'Sanctuary Events', view: 'View', noticeBoard: 'Notice Board',
      sundayService: 'Sunday Service', midweekStudy: 'Midweek Study', directory: 'Directory', themePolish: 'Theme Polish' },
    finance: { title: 'Church Treasury & 80G Ledger', audited: 'Audited Financial Accounts • October 2026', reserves: 'Net Sanctuary Reserves',
      taxExempt: '80G TAX EXEMPT', inflow: 'Total Inflow', outflow: 'Total Outflow', recordTithe: 'Record Tithe / Giving', recordExpense: 'Record Expense' },
    dialogs: { requiredMemberFields: 'Please enter a name and phone number.', householdDelete: 'Delete the {name} household and all its members?',
      memberDelete: 'Delete {name} from the household?', deleted: '{name} was deleted.', deleteFailed: 'Unable to delete {name}: {error}',
      saved: '{name} was saved successfully.', added: '{name} was added successfully.', syncFailed: 'Supabase sync failed: {error}. The device vault copy was retained.' }
  },
  ta: {
    nav: {
      home: 'முகப்பு', people: 'மக்கள்', church: 'சபை', connect: 'இணைப்பு', members: 'உறுப்பினர் பட்டியல்', visitors: 'விருந்தினர் பதிவு', ministries: 'ஊழியங்கள் & குழுக்கள்',
      finance: 'நிதி & 80G', events: 'நிகழ்வுகள் காலண்டர்', servicePlans: 'ஆராதனைத் திட்டங்கள்', livestream: 'நேரலை மேடை', broadcast: 'அறிவிப்பு மையம்', prayer: 'ஜெபச் சுவர்', bible: 'பரிசுத்த வேதாகமம்',
      checkIn: 'வருகைப் பதிவு', donation: 'நன்கொடை / காணிக்கை', addPerson: 'நபரைச் சேர்', serviceFlow: 'ஆராதனை ஓட்டம்', profile: 'சுயவிவரத்தைக் காண்க', reports: 'அறிக்கைகள் & தணிக்கைகள்', settings: 'அமைப்புகள் & தோற்றம்', help: 'உதவி & ஆதரவு', signOut: 'வெளியேறு',
      peopleTitle: 'மக்கள் & மேய்ப்புப்பணி', churchTitle: 'சபை செயல்பாடுகள்', connectTitle: 'இணைப்பு & ஐக்கியம்', subMenu: 'துணை மெனு', admin: 'நிர்வாகி'
    },
    common: {
      allMovements: 'அனைத்து பரிவர்த்தனைகள்', income: 'வரவு', expense: 'செலவு', tithe: 'காணிக்கை', prayers: 'ஜெபங்கள்', fullName: 'முழுப் பெயர்', phone: 'தொலைபேசி எண்', email: 'மின்னஞ்சல்', gender: 'பாலினம்', dateOfBirth: 'பிறந்த தேதி', age: 'வயது', bloodGroup: 'இரத்த வகை', relationship: 'உறவு வகை (குடும்பப் பங்கு)', campus: 'வளாகம்', area: 'பகுதி / புறநகர்', address: 'வீட்டு முகவரி', weddingAnniversary: 'திருமண ஆண்டு தேதி', dateOfBaptism: 'ஞானஸ்நான தேதி', waterBaptism: 'ஞானஸ்நானம்', holySpiritAnointing: 'பரிசுத்த ஆவி அபிஷேகம்', demographics: 'தனிப்பட்ட & உறவு விவரங்கள்', contactLocation: 'தொடர்பு & இருப்பிடம்', spiritualMilestones: 'ஆவிக்குரிய மைல்கற்கள் & சடங்குகள்', ministryTalents: 'ஊழியம் & சேவை திறன்கள்', saveProfile: 'விசுவாசி சுயவிவரத்தை Vault-ல் சேமி', saving: 'Vault-ல் சேமிக்கிறது...', close: 'மூடு', required: '*', male: 'ஆண்', female: 'பெண்', member: 'உறுப்பினர்', household: 'குடும்பம்', families: 'குடும்பங்கள்', activeSouls: 'செயலில் உள்ளவர்கள்', addMember: 'உறுப்பினரைச் சேர்', syncing: 'ஒத்திசைக்கிறது...', supabaseLive: 'Supabase நேரலை', vaultSynced: 'Vault ஒத்திசைக்கப்பட்டது', search: 'தேடு', editFamilyHead: 'குடும்பத் தலைவரைத் திருத்து', smartId: 'ஸ்மார்ட் PVC அடையாள அட்டை', deleteHousehold: 'குடும்பத்தை நீக்கு', expandHousehold: 'குடும்ப மரத்தை விரி', deleteMember: 'உறுப்பினரை நீக்கு', householdMembers: 'குடும்ப உறுப்பினர்கள்', addSubMember: 'துணை உறுப்பினரைச் சேர்', noAdditionalMembers: 'கூடுதல் குடும்ப உறுப்பினர்கள் பதிவு செய்யப்படவில்லை.', baptized: 'ஞானஸ்நானம் பெற்றவர்', holySpiritAnointed: 'பரிசுத்த ஆவி அபிஷேகம்', live: 'நேரலை', updatedLive: 'நேரலையில் புதுப்பிக்கப்பட்டது'
    },
    overview: { attend: 'வருகை', tithe: 'காணிக்கை', sanctuaryEvents: 'சபை நிகழ்வுகள்', view: 'காண்க', noticeBoard: 'அறிவிப்புப் பலகை', sundayService: 'ஞாயிறு ஆராதனை', midweekStudy: 'நடுவாரப் படிப்பு', directory: 'பட்டியல்', themePolish: 'தோற்ற அலங்காரம்' },
    finance: { title: 'சபை கருவூலம் & 80G பேரேடு', audited: 'தணிக்கை செய்யப்பட்ட நிதிக் கணக்குகள் • அக்டோபர் 2026', reserves: 'நிகர சபை சேமிப்பு', taxExempt: '80G வரிவிலக்கு', inflow: 'மொத்த வரவு', outflow: 'மொத்த செலவு', recordTithe: 'காணிக்கை / நன்கொடை பதிவு', recordExpense: 'செலவு பதிவு' },
    dialogs: { requiredMemberFields: 'பெயர் மற்றும் தொலைபேசி எண்ணை உள்ளிடவும்.', householdDelete: '{name} குடும்பத்தையும் அதன் அனைத்து உறுப்பினர்களையும் நீக்கவா?', memberDelete: '{name} உறுப்பினரை குடும்பத்திலிருந்து நீக்கவா?', deleted: '{name} நீக்கப்பட்டது.', deleteFailed: '{name}-ஐ நீக்க முடியவில்லை: {error}', saved: '{name} வெற்றிகரமாக சேமிக்கப்பட்டது.', added: '{name} வெற்றிகரமாக சேர்க்கப்பட்டது.', syncFailed: 'Supabase ஒத்திசைவு தோல்வியடைந்தது: {error}. சாதன Vault நகல் தக்கவைக்கப்பட்டது.' }
  }
};

export function getTranslation(language, key, variables = {}) {
  const keys = key.split('.');
  const value = keys.reduce((result, part) => result?.[part], translations[language])
    ?? keys.reduce((result, part) => result?.[part], translations.en)
    ?? key;
  return String(value).replace(/\{(\w+)\}/g, (_, variable) => variables[variable] ?? `{${variable}}`);
}