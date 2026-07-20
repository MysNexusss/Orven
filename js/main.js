// main.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('%cStakeMaster carregado com sucesso! ⚽', 'color: #22c55e; font-weight: bold');

  // Simulação de dados
  const totalProfit = 12480.50;
  const totalStake = 45800;
  const roi = ((totalProfit / totalStake) * 100).toFixed(1);

  // Atualiza cards (exemplo)
  const profitEl = document.getElementById('total-profit');
  if (profitEl) profitEl.textContent = `R$ ${totalProfit.toLocaleString('pt-BR')}`;
});

// Função para mudar de página (simples navegação)
function showPage(page) {
  const content = document.getElementById('content');
  if (!content) return;

  if (page === 'dashboard') {
    content.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-zinc-900 p-6 rounded-2xl card">
          <h3 class="text-zinc-400 text-sm">Lucro Total</h3>
          <p id="total-profit" class="text-4xl font-bold text-green-500 mt-2">R$ 12.480,50</p>
        </div>
        <!-- Adicione mais cards aqui -->
      </div>
    `;
  }
}

// Carregar dashboard por padrão
setTimeout(() => showPage('dashboard'), 300);
