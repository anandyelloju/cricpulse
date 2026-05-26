import { state } from '../core/state.js';
import { economyRate } from '../core/utils.js';

export function renderBowlingCard() {
  const bowlingRoot = document.getElementById('bowling-root');

  if (!bowlingRoot) return;

  const bowlers =
    state.innings.bowlingTeam?.players || [];

  bowlingRoot.innerHTML = `
    <div class="space-y-2">
      ${bowlers.map(player => `
        <article class="rounded-lg border ${player.id === state.innings.currentBowler?.id ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"} p-3">
          <div class="flex items-center justify-between gap-3">
            <h3 class="truncate font-extrabold text-slate-950">${player.name}</h3>
            <p class="text-2xl font-black">${player.wickets || 0}/${player.runsConceded || 0}</p>
          </div>
          <div class="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
            ${stat("Overs", player.overs || "0.0")}
            ${stat("Runs", player.runsConceded || 0)}
            ${stat("Eco", economyRate(player.runsConceded, player.overs))}
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

function stat(label, value) {
  return `
    <div class="rounded-md bg-white px-2 py-2">
      <p class="text-[0.68rem] font-bold text-slate-500">${label}</p>
      <p class="font-black text-slate-950">${value}</p>
    </div>
  `;
}
