// lib/supabaseClient.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://cbbpvwdytdcspkbywbed.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'sb_publishable_FIcuS1GlYJ10hpjMj3xHQA_B6n8zF_C';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);