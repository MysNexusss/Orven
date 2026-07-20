// js/main.js - Atualizado

let bets = [
  { date: "2026-07-18", comp: "Brasileirão", team: "Flamengo", market: "Over 1.5", odds: 1.85, stake: 450, result: "Green", profit: 332.50 },
  { date: "2026-07-17", comp: "Premier League", team: "Liverpool", market: "Vitória", odds: 2.10, stake: 800, result: "Red", profit: -800 },
  { date: "2026-07-16", comp: "Champions", team: "Real Madrid", market: "Ambas Marcam", odds: 1.95, stake: 600, result: "Green", profit: 570 }
];

document.addEventListener('DOMContentLoaded', () => {
  loadSidebar();
  showDashboard();
});

function loadSidebar() {
  fetch('components/sidebar.html')
    .then(res => res.text())
    .then(html => document.getElementById('sidebar').innerHTML = html);
}

function showDashboard() {
  const content = document.getElementById('main-content');
  content.innerHTML = `... (mesmo dashboard anterior) ...`; // Você pode manter o anterior aqui
}

function showPage(page) {
  const content = document.getElementById('main-content');
  
  if (page === 'monthly') {
    content.innerHTML = document.getElementById('monthly-template') ? document.getElementById('monthly-template').innerHTML : `
      <div id="monthly-content"></div>
    `;
    loadMonthlyPage();
  } else {
    showDashboard();
  }
}

function loadMonthlyPage() {
  const tbody = document.getElementById('bets-table');
  if (!tbody) return;

  tbody.innerHTML = bets.map(bet => `
    <tr class="hover:bg-zinc-800/50">
      <td class="p-5">${bet.date}</td>
      <td class="p-5">${bet.comp}</td>
      <td class="p-5">${bet.team} - ${bet.market}</td>
      <td class="p-5 text-right font-medium">${bet.odds}</td>
      <td class="p-5 text-right font-medium">R$ ${bet.stake}</td>
      <td class="p-5 text-center">
        <span class="px-4 py-1 rounded-full text-xs font-bold ${bet.result === 'Green' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}">
          ${bet.result}
        </span>
      </td>
      <td class="p-5 text-right font-bold ${bet.profit > 0 ? 'text-green-500' : 'text-red-500'}">
        R$ ${bet.profit}
      </td>
    </tr>
  `).join('');
}

function novaAposta() {
  const date = prompt("Data (AAAA-MM-DD):", "2026-07-20");
  const comp = prompt("Competição:");
  const team = prompt("Equipe / Mercado:");
  const odds = parseFloat(prompt("Odds:"));
  const stake = parseFloat(prompt("Stake (R$):"));
  const result = prompt("Resultado (Green / Red / Void):");

  if (date && comp && team && odds && stake && result) {
    const profit = result === "Green" ? Math.round(stake * (odds - 1)) : result === "Void" ? 0 : -stake;
    
    bets.unshift({ date, comp, team, market: "Mercado", odds, stake, result, profit });
    alert("✅ Aposta registrada com sucesso!");
    
    if (document.getElementById('bets-table')) loadMonthlyPage();
  }
}
