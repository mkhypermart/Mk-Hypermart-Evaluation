import { supabase } from '../lib/supabaseClient.js';

async function loadQuestions() {
  const { data } = await supabase.from('evaluation_criteria').select('*').order('created_at', { ascending: true });
  const container = document.getElementById('questionsList');
  if (data) {
    container.innerHTML = data.map((q, idx) => `
      <div class="flex justify-between items-center p-3.5 bg-white/40 border border-white/60 rounded-xl text-sm">
        <span class="font-medium text-slate-800">${idx + 1}. ${q.question}</span>
        <button onclick="toggleQuestion('${q.id}', ${!q.is_active})" class="text-xs px-3 py-1.5 rounded-lg font-bold ${q.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}">
          ${q.is_active ? 'Aktif' : 'Nyahaktif'}
        </button>
      </div>
    `).join('');
  }
}

document.getElementById('addQuestionForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('newQuestion');
  await supabase.from('evaluation_criteria').insert([{ question: input.value.trim(), is_active: true }]);
  input.value = '';
  loadQuestions();
});

window.toggleQuestion = async function(id, status) {
  await supabase.from('evaluation_criteria').update({ is_active: status }).eq('id', id);
  loadQuestions();
};

loadQuestions();