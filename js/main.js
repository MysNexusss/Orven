// js/main.js - StakeMaster

let bets = []; // Armazenamento de apostas (simulado)

document.addEventListener('DOMContentLoaded', () => {
  console.log('%c✅ StakeMaster iniciado com sucesso!', 'color: #22c55e; font-size: 16px; font-weight: bold');
  
  // Carregar Sidebar
  loadSidebar();
  
  // Carregar Dashboard inicial
  setTimeout(() => {
    showDashboard();
  }, 100);
});

// Carregar Sidebar
function loadSidebar() {
  fetch('components/sidebar.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('sidebar').innerHTML = html;
    })
    .catch(err => console.error('Erro ao carregar sidebar:', err));
}

// Mostrar Dashboard
function showDashboard() {
  const content = document.getElementById('main-content');
  content.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- Card 1 -->
      <div class="bg-zinc-900 rounded-3xl p-6 card-hover">
        <div class="flex justify-between">
          <div>
            <p class="text-zinc-400 text-sm">Lucro Total</p>
            <p class="text-4xl font-bold text-green-500 mt-2">R$ 12.480,50</p>
          </div>
          <i class="fas fa-dollar-sign text-5xl text-green-500/20"></i>
        </div>
        <p class="text-green-600 text-sm mt-4">+18.4% este mês</p>
      </div>

      <!-- Card 2 -->
      <div class="bg-zinc-900 rounded-3xl p-6 card-hover">
        <div class="flex justify-between">
          <div>
            <p class="text-zinc-400 text-sm">Stake Acumulada</p>
            <p class="text-4xl font-bold mt-2">R$ 45.800</p>
          </div>
          <i class="fas fa-coins text-5xl text-amber-500/20"></i>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="bg-zinc-900 rounded-3xl p-6 card-hover">
        <div class="flex justify-between">
          <div>
            <p class="text-zinc-400 text-sm">ROI</p>
            <p class="text-4xl font-bold text-green-500 mt-2">+27.2%</p>
          </div>
          <i class="fas fa-chart-line text-5xl text-blue-500/20"></i>
        </div>
      </div>

      <!-- Card 4 -->
      <div class="bg-zinc-900 rounded-3xl p-6 card-hover">
        <div class="flex justify-between">
          <div>
            <p class="text-zinc-400 text-sm">Taxa de Acerto</p>
            <p class="text-4xl font-bold mt-2">68.4%</p>
          </div>
          <i class="fas fa-trophy text-5xl text-yellow-500/20"></i>
        </div>
      </div>
    </div>

    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-4">Evolução Mensal</h2>
      <div class="bg-zinc-900 rounded-3xl p-6 h-80 flex items-center justify-center border border-zinc-700">
        <p class="text-zinc-500">📊 Gráfico interativo virá aqui (Recharts ou Chart.js)</p>
      </div>
    </div>
  `;
}

// Nova Aposta (Modal simples)
function novaAposta() {
  alert("📝 Formulário de Nova Aposta\n\nFuncionalidade em desenvolvimento!\n\nData, Competição, Equipe, Odds, Stake, etc.");
  // Aqui futuramente abrirá um modal bonito
}

// Funções de navegação
function showPage(page) {
  const content = document.getElementById('main-content');
  
  if (page === 'monthly') {
    content.innerHTML = `<h2 class="text-2xl font-bold">Gestão Mensal</h2><p class="text-zinc-400 mt-4">Registro de apostas por mês...</p>`;
  } else if (page === 'competitions') {
    content.innerHTML = `<h2 class="text-2xl font-bold">Competições</h2>`;
  } else if (page === 'teams') {
    content.innerHTML = `<h2 class="text-2xl font-bold">Equipes</h2>`;
  } else if (page === 'methods') {
    content.innerHTML = `<h2 class="text-2xl font-bold">Métodos de Aposta</h2>`;
  } else if (page === 'reports') {
    content.innerHTML = `<h2 class="text-2xl font-bold">Relatórios</h2>`;
  } else {
    showDashboard();
  }
}
