import { supabase } from '../lib/supabaseClient.js';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const btn = document.getElementById('submitBtn');
  const errorBox = document.getElementById('errorMsg');

  errorBox.classList.add('hidden');
  btn.disabled = true;
  btn.innerText = 'Sedang mengesahkan...';

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) throw authError;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) throw new Error('Profil pengguna tidak ditemui.');

    const role = profile.role.toLowerCase();
    window.location.href = `../${role}/index.html`;

  } catch (err) {
    errorBox.innerText = `⚠️ Ralat: ${err.message}`;
    errorBox.classList.remove('hidden');
    btn.disabled = false;
    btn.innerText = 'Log Masuk';
  }
});