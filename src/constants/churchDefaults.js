// src/constants/churchDefaults.js

export const DEFAULT_CAMPUSES = [
  { 
    id: 'hq', 
    name: 'Grace Central Cathedral',
    code: 'GCC-MAIN', 
    city: 'Koduvai',
    isHQ: true 
  },
  { 
    id: 'b1', 
    name: 'North Campus Sanctuary', 
    code: 'GCC-NC', 
    city: 'North Campus', 
    isHQ: false 
  },
  { 
    id: 'b2', 
    name: 'Grace Fellowship Center', 
    code: 'GCC-GF', 
    city: 'Koduvai', 
    isHQ: false 
  }
];

export const INITIAL_USER_PROFILE = {
  name: 'Raja S',
  role: 'Lead Pastor',
  adminRole: 'Administrator',
  email: 'raja@gracechurch.org',
  phone: '+91 84280 44555',
  birthDate: '',
  conversionDate: '',
  memberSince: '2026-10-24',
  baptismDate: '',
  familyMembers: [],
  city: 'Koduvai',
  address: 'Main Road, Koduvai',
  gender: 'Male',
  attendingSince: '10/24/2026',
  baptized: 'Yes',
  ministries: ['Worship', 'Intercession'],
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
};