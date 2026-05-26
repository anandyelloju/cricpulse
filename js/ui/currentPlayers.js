import { state } from "../core/state.js";
import { economyRate, strikeRate } from "../core/utils.js";

export function renderCurrentPlayers() {
  const root = document.getElementById("players-root");

  if (!root) return;

  root.innerHTML = `
    <div class="mb-3 flex items-center justify-between gap-3">
      <h2 class="section-title">Current players</h2>
      <span class="chip bg-blue-50 text-blue-700">Innings ${state.match.currentInnings}</span>
    </div>

    <div class="space-y-3">
      <div>
        <div class="grid grid-cols-[minmax(0,1fr)_3rem_3rem_4rem] gap-2 px-2 text-xs font-semibold uppercase text-slate-500">
          <span>Batter</span><span class="text-right">R</span><span class="text-right">B</span><span class="text-right">SR</span>
        </div>
        <div class="mt-2 space-y-2">
          ${renderBatter(state.innings.striker, "Striker")}
          ${renderBatter(state.innings.nonStriker, "Non-striker")}
        </div>
      </div>

      <div class="border-t border-slate-100 pt-3">
        <div class="grid grid-cols-[minmax(0,1fr)_3rem_3rem_3rem] gap-2 px-2 text-xs font-semibold uppercase text-slate-500">
          <span>Bowler</span><span class="text-right">O</span><span class="text-right">R</span><span class="text-right">W</span>
        </div>
        <div class="mt-2">
          ${renderBowler(state.innings.currentBowler)}
        </div>
      </div>
    </div>
  `;
}

function renderBatter(player, label) {
  return `
    <article class="grid min-h-14 grid-cols-[minmax(0,1fr)_3rem_3rem_4rem] items-center gap-2 rounded-lg ${label === "Striker" ? "bg-blue-50 ring-1 ring-blue-100" : "bg-slate-50"} px-3 py-2">
      <div class="min-w-0">
        <p class="truncate font-semibold text-slate-950">${player?.name || "-"}</p>
        <p class="text-xs text-slate-500">${label}</p>
      </div>
      <p class="text-right font-bold text-slate-950">${player?.runs || 0}</p>
      <p class="text-right text-sm font-semibold text-slate-700">${player?.balls || 0}</p>
      <p class="text-right text-sm font-semibold text-slate-700">${strikeRate(player?.runs, player?.balls)}</p>
    </article>
  `;
}

function renderBowler(player) {
  return `
    <article class="grid min-h-14 grid-cols-[minmax(0,1fr)_3rem_3rem_3rem] items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 ring-1 ring-emerald-100">
      <div class="min-w-0">
        <p class="truncate font-semibold text-slate-950">${player?.name || "-"}</p>
        <p class="text-xs text-slate-500">Eco ${economyRate(player?.runsConceded, player?.overs)}</p>
      </div>
      <p class="text-right font-semibold text-slate-700">${player?.overs || "0.0"}</p>
      <p class="text-right font-semibold text-slate-700">${player?.runsConceded || 0}</p>
      <p class="text-right font-bold text-slate-950">${player?.wickets || 0}</p>
    </article>
  `;
}
