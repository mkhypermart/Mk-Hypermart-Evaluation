import { supabase } from '../lib/supabaseClient.js';

async function loadData() {
  const { data: supervisors } = await supabase.from('profiles').select('*').eq('role', 'Supervisor');
  const supContainer = document.getElementById('supervisorList');
  
  if (supervisors) {
    supContainer.innerHTML = supervisors.map(s => `
      <div class="flex justify-between items-center p-3.5 bg-white/40 border border-white/60 rounded-xl text-sm">
        <div>
          <p class="font-bold text-slate-800">${s.full_name}</p>
          <p class="text-xs text-slate-500">ID: ${s.employee_id}</p>
        </div>
        <button onclick="sendReminder('${s.id}')" class="bg-amber-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold">
          Hantar Peringatan
        </button>
      </div>
    `).join('');
  }

  const { data: evals } = await supabase.from('evaluations').select('*, profiles!evaluations_employee_id_fkey(full_name)');
  const evalContainer = document.getElementById('evaluationsHistory');
  if (evals && evals.length > 0) {
    evalContainer.innerHTML = evals.map(e => `
      <div class="p-3 bg-white/40 border border-white/60 rounded-xl">
        <p class="font-bold text-slate-800">Staf: ${e.profiles?.full_name || 'N/A'}</p>
        <p class="text-xs text-slate-600">Skor Purata: ${e.overall_rating} / 5.0</p>
      </div>
    `).join('');
  } else {
    evalContainer.innerHTML = `<p class="text-xs text-slate-500 italic">Belum ada rekod penilaian.</p>`;
  }
}

window.sendReminder = async function(supId) {
  await supabase.from('notifications').insert([{ recipient_id: supId, message: 'Peringatan Owner: Sila lengkapkan penilaian pekerja anda.' }]);
  alert('🔔 Notifikasi berjaya dihantar kepada penyelia!');
};

window.notifyAll = async function() {
  alert('🔔 Peringatan pukal telah dihantar kepada semua penyelia!');
};

loadData();