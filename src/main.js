import { store } from './core/store.js';
import { createTransaction, deleteTransaction, getTransactions, exportToCSV } from './features/transactions.js';
import { createAccount, getAccounts } from './features/accounts.js';
import { createCard, getCards } from './features/cards.js';
import { createGoal } from './features/goals.js';
import { createDebt, payDebt } from './features/debts.js';
import { createRecurring } from './features/recurring.js';
import { getBudgetStatus } from './features/budgets.js';
import { getCategories, guessCategory, getCategoryById } from './features/categories.js';
import { getReportData, getHealthScore } from './features/reports.js';
import { createDonutChart, createBarChart } from './ui/charts.js';
import { toast } from './ui/notifications.js';
import { fmtMoney, fmtDate, todayStr, monthKey, debounce } from './utils/format.js';

let currentFilter = { month: monthKey(), category: '', account: '', search: '' };
let editingTxId = null;

export function renderTransactions() {
  const container = document.getElementById('ledger');
  if (!container) return;
  const txs = getTransactions({ ...currentFilter, month: currentFilter.month });
  if (!txs.length) { container.innerHTML = '<div class="empty-state">Nenhum lançamento.</div>'; return; }

  const groups = {};
  txs.forEach(t => { if (!groups[t.date]) groups[t.date] = []; groups[t.date].push(t); });
  const sortedDates = Object.keys(groups).sort((a, b) => new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00'));

  container.innerHTML = sortedDates.map(date => `
    <div class="ledger-group">
      <div class="ledger-date">${fmtDate(date)}</div>
      ${groups[date].map(t => {
        const cat = getCategoryById(t.category_id);
        const acc = getAccounts().find(a => a.id === t.account_id);
        return `
          <div class="ledger-item" data-id="${t.id}">
            <div class="cat-icon" style="background:${cat?.color || '#888'}20;color:${cat?.color || '#888'}">${cat?.icon || '🏷️'}</div>
            <div class="info">
              <div class="desc">${t.description}</div>
              <div class="meta">${cat?.name || ''} · ${acc?.name || ''} · ${t.payment || '—'} ${t.installments > 1 ? `· ${t.current_installment}/${t.installments}` : ''}</div>
            </div>
            <div class="amount ${t.type}">${t.type === 'receita' ? '+' : '-'}${fmtMoney(t.amount)}</div>
            <div class="actions">
              <button class="edit-btn" data-id="${t.id}">✎</button>
              <button class="del-btn" data-id="${t.id}">✕</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `).join('');

  container.querySelectorAll('.del-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (confirm('Excluir?')) { await deleteTransaction(btn.dataset.id); renderTransactions(); renderDashboard(); }
    });
  });
}

export function initTransactionEvents(userId) {
  document.getElementById('nav-add-btn')?.addEventListener('click', () => openTxModal());
  document.getElementById('add-inline-btn')?.addEventListener('click', () => openTxModal());
  document.getElementById('tx-modal-close')?.addEventListener('click', closeTxModal);
  document.getElementById('tx-modal-overlay')?.addEventListener('click', closeTxModal);
  document.getElementById('cancel-edit-btn')?.addEventListener('click', () => { editingTxId = null; document.getElementById('tx-form')?.reset(); });

  document.getElementById('tx-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.querySelector('#tx-form .type-toggle button.active')?.dataset.value || 'despesa';
    const data = {
      description: document.getElementById('tx-desc').value.trim(),
      amount: parseFloat(document.getElementById('tx-amount').value),
      type,
      category_id: document.getElementById('tx-category').value,
      account_id: document.getElementById('tx-account').value || null,
      card_id: document.getElementById('tx-card').value || null,
      date: document.getElementById('tx-date').value,
      payment: document.getElementById('tx-payment').value,
      installments: parseInt(document.getElementById('tx-installments').value) || 1,
      tags: document.getElementById('tx-tags').value.split(',').map(t => t.trim()).filter(Boolean),
    };
    if (!data.description || !data.amount || !data.date) { toast('Preencha todos os campos'); return; }
    if (editingTxId) { /* update */ }
    else { await createTransaction(data); }
    closeTxModal();
    renderTransactions();
    renderDashboard();
    toast(editingTxId ? 'Atualizado!' : 'Lançado!');
  });

  document.getElementById('tx-desc')?.addEventListener('input', (e) => {
    const guessed = guessCategory(e.target.value);
    if (guessed && !document.getElementById('tx-category').value) document.getElementById('tx-category').value = guessed;
  });

  document.getElementById('export-csv-btn')?.addEventListener('click', () => {
    const csv = exportToCSV(currentFilter);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `caderneta_${currentFilter.month}.csv`; a.click(); URL.revokeObjectURL(url);
    toast('CSV exportado!');
  });

  document.getElementById('filter-month')?.addEventListener('change', (e) => { currentFilter.month = e.target.value; renderTransactions(); });
  document.getElementById('filter-category')?.addEventListener('change', (e) => { currentFilter.category = e.target.value; renderTransactions(); });
  document.getElementById('search-tx')?.addEventListener('input', debounce((e) => { currentFilter.search = e.target.value; renderTransactions(); }, 300));

  populateSelects();
}

function populateSelects() {
  const catSel = document.getElementById('tx-category');
  if (catSel) catSel.innerHTML = getCategories().map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('');
  const accSel = document.getElementById('tx-account');
  if (accSel) accSel.innerHTML = '<option value="">Sem conta</option>' + getAccounts().map(a => `<option value="${a.id}">${a.icon} ${a.name}</option>`).join('');
  const cardSel = document.getElementById('tx-card');
  if (cardSel) cardSel.innerHTML = '<option value="">Sem cartão</option>' + getCards().map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('');
  const filterCat = document.getElementById('filter-category');
  if (filterCat) filterCat.innerHTML = '<option value="">Todas</option>' + getCategories().map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('');
  const monthSel = document.getElementById('filter-month');
  if (monthSel) {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 24; i++) { const d = new Date(now.getFullYear(), now.getMonth() - i, 1); months.push({ value: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`, label: d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) }); }
    monthSel.innerHTML = months.map(m => `<option value="${m.value}" ${m.value === currentFilter.month ? 'selected' : ''}>${m.label}</option>`).join('');
  }
}

function openTxModal() {
  editingTxId = null;
  document.getElementById('tx-form-title').textContent = 'Novo lançamento';
  document.getElementById('cancel-edit-btn').classList.add('hidden');
  document.getElementById('tx-form')?.reset();
  document.getElementById('tx-date').value = todayStr();
  populateSelects();
  document.getElementById('tx-modal-overlay').classList.remove('hidden');
  document.getElementById('tx-modal').classList.remove('hidden');
  setTimeout(() => { document.getElementById('tx-modal-overlay').classList.add('show'); document.getElementById('tx-modal').classList.add('show'); }, 10);
}

function closeTxModal() {
  document.getElementById('tx-modal-overlay').classList.remove('show');
  document.getElementById('tx-modal').classList.remove('show');
  setTimeout(() => { document.getElementById('tx-modal-overlay').classList.add('hidden'); document.getElementById('tx-modal').classList.add('hidden'); }, 300);
}
