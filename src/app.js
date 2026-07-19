import { db } from './core/db.js';
import { store } from './core/store.js';
import { initSupabase, fullSync, isConfigured } from './core/sync.js';
import { initCategories } from './features/categories.js';
import { processRecurringTransactions } from './features/recurring.js';
import { renderDashboard } from './ui/dashboard.js';
import { toast } from './ui/notifications.js';
import { renderTransactions, initTransactionEvents } from './main.js';

export async function initApp(userId, email) {
  store.set('user', { id: userId, email });
  await db.init();
  await store.loadAll();
  await initCategories(userId);
  await processRecurringTransactions();

  initSupabase();
  if (isConfigured() && navigator.onLine) {
    fullSync().then(() => toast('Sincronizado com a nuvem'));
  }

  showAppScreen();
  renderDashboard();
  renderTransactions();
  initTransactionEvents(userId);
  initNavigation();
  initTheme();
  toast('Bem-vindo à Caderneta v2!');
}

function showAppScreen() {
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');
}

function initNavigation() {
  document.querySelectorAll('.tabbar-inner button[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.tabbar-inner button[data-tab]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById(`tab-${tab}`).classList.add('active');
      if (tab === 'inicio') renderDashboard();
      if (tab === 'extrato') renderTransactions();
    });
  });

  document.querySelectorAll('.subtab-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      const subtab = btn.dataset.subtab;
      document.querySelectorAll('.subtab-toggle button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.subtab-content').forEach(c => c.classList.remove('active'));
      document.getElementById(`substat-${subtab}`).classList.add('active');
    });
  });
}

function initTheme() {
  const theme = store.get('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    store.set('theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}
