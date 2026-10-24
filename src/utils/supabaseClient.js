// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// உங்கள் Supabase திட்டத்தின் URL மற்றும் Anon Key-ஐ இங்கு உள்ளிடவும்
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://odkxqlzmvnwcznpbrpls.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ka3hxbHptdm53Y3pucGJycGxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1ODI3OTQsImV4cCI6MjEwNTE1ODc5NH0.OhhaR9mtv_Su7F6sEOrzKHcMnsU0_CGeJVX5KB-MsZQ';

export const supabase = (supabaseUrl && !supabaseUrl.includes('YOUR_PROJECT_ID'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;