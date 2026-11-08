import { supabase } from '../lib/supabaseClient.js';

let selectedProfile = null;

window.searchEmployee = async function() {
  const empId = document.getElementById('employeeId').value.trim().toUpperCase();
  const { data: profile } = await supabase.from('profiles').select('*').eq('employee_id', empId).single();

  if (!profile) {
    alert('❌ Pekerja dengan ID tersebut tidak dijumpai.');
    return;
  }

  selectedProfile = profile;
  document.getElementById('targetEmployee').innerText = `Menilai: ${profile.full_name} (${profile.employee_id})`;

  const { data: questions } = await supabase.from('evaluation_criteria').select('*').eq('is_active', true);
  const container = document.getElementById('criteriaContainer');

  container.innerHTML = questions.map((q, idx) => `
    <div class="p-3.5 bg-white/40 border border-white/60 rounded-xl">
      <p class="text-xs font-bold text-slate-800 mb-2">${idx + 1}. ${q.question}</p>
      <div class="flex space-x-6 text-sm">
        ${[1, 2, 3, 4, 5].map(score => `
          <label class="flex items-center space-x-1 cursor-pointer">
            <input type="radio" name="q_${q.id}" value="${score}" required class="text-emerald-600">
            <span class="text-xs font-semibold">${score}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');

  document.getElementById('evaluationCard').classList.remove('hidden');
};

document.getElementById('evaluationForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const comments = document.getElementById('comments').value;
  const user = (await supabase.auth.getUser()).data.user;

  await supabase.from('evaluations').insert([{
    employee_id: selectedProfile.id,
    evaluator_id: user.id,
    overall_rating: 4.8,
    comments
  }]);

  alert('✅ Penilaian berjaya disimpan ke dalam pangkalan data!');
  document.getElementById('evaluationCard').classList.add('hidden');
  document.getElementById('employeeId').value = '';
});