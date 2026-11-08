import { supabase } from '../lib/supabaseClient.js';

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fullName = document.getElementById('fullName').value.trim();
  const employeeId = document.getElementById('employeeId').value.trim().toUpperCase();
  const role = document.getElementById('role').value;
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  
  const btn = document.getElementById('submitBtn');
  const msgBox = document.getElementById('messageBox');

  msgBox.classList.add('hidden');
  btn.disabled = true;
  btn.innerText = 'Menyemak kelayakan...';

  try {
    if (role === 'Owner' || role === 'Admin') {
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', role);

      if (countError) throw countError;
      if (count > 0) throw new Error(`Akaun '${role}' telah wujud! Hanya 1 akaun dibenarkan.`);
    }

    btn.innerText = 'Sedang mendaftar...';
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) throw authError;

    const userId = authData.user?.id;
    const { error: profileError } = await supabase.from('profiles').insert([{ id: userId, employee_id: employeeId, full_name: fullName, role }]);
    if (profileError) throw profileError;

    msgBox.className = "mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl text-center";
    msgBox.innerText = `✅ Pendaftaran ${role} berjaya! Mengalihkan ke log masuk...`;
    msgBox.classList.remove('hidden');

    setTimeout(() => { window.location.href = '../login/index.html'; }, 2000);

  } catch (err) {
    msgBox.className = "mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl text-center";
    msgBox.innerText = `⚠️ Ralat: ${err.message}`;
    msgBox.classList.remove('hidden');
    btn.disabled = false;
    btn.innerText = 'Daftar Akaun';
  }
});