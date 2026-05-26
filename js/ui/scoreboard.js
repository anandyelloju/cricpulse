import { state } from "../core/state.js";
import {
  calculateRequiredRate,
  calculateRunRate,
  formatOvers,
} from "../core/utils.js";

export function renderScoreboard() {
  const scoreboardRoot = document.getElementById("scoreboard-root");

  if (!scoreboardRoot) return;

  const runRate = calculateRunRate(
    state.innings.totalRuns,
    state.innings.overs,
    state.innings.balls,
  );
  const requiredRate = calculateRequiredRate(
    state.innings.target,
    state.innings.totalRuns,
    state.match.maxOvers,
    state.innings.overs,
    state.innings.balls,
  );

  scoreboardRoot.innerHTML = `
    <div class="app-card mx-auto max-w-5xl p-3 sm:p-4">
      <div class="grid grid-cols-[minmax(0,1.05fr)_minmax(9.5rem,0.95fr)] gap-3">
        <div class="min-w-0 self-center">
          <div class="mb-1 flex items-center gap-2">
            <p class="truncate text-sm font-semibold text-blue-700">${state.innings.battingTeam?.name || "Team"}</p>
            <span class="chip ${state.match.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"} min-h-0 px-2 py-1 text-[0.65rem]">
              ${state.match.status === "COMPLETED" ? "FINAL" : "LIVE"}
            </span>
          </div>
          <p class="text-6xl font-black leading-none text-slate-950 sm:text-6xl">
            ${state.innings.totalRuns}/${state.innings.wickets}
          </p>
          <p class="mt-1 text-lg font-semibold text-slate-500">
            ${formatOvers(state.innings.overs, state.innings.balls)} overs
          </p>
        </div>

        <div class="grid grid-cols-2 gap-2 text-center">
          ${stat("CRR", runRate)}
          ${stat("RRR", requiredRate)}
          ${stat("Overs", `${state.match.maxOvers}`)}
          ${stat("Target", state.innings.target || "-")}
        </div>
      </div>

      ${
        state.match.status === "COMPLETED"
          ? `<div class="mt-3 rounded-lg bg-emerald-50 p-3 text-sm font-bold text-emerald-800">${state.match.resultText || `Winner: ${state.match.winner}`}</div>`
          : ""
      }
    </div>
  `;
}

function stat(label, value) {
  return `
    <div class="stat-chip px-2 py-2">
      <p class="text-[0.65rem] font-semibold uppercase text-slate-500">${label}</p>
      <p class="font-bold text-slate-950">${value}</p>
    </div>
  `;
}
