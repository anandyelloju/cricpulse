import { state } from "../core/state.js";
import { strikeRate } from "../core/utils.js";

export function renderBattingCard() {
  const battingRoot = document.getElementById("batting-root");

  if (!battingRoot) return;

  const players = state.innings.battingTeam?.players || [];

  battingRoot.innerHTML = `
    <div class="space-y-2">
      ${players
        .map(
          (player) => `
            <article class="rounded-lg border ${player.id === state.innings.striker?.id ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white"} p-3">
              <div class="flex items-center justify-between gap-3">
                <div class="min-w-0">
                  <h3 class="truncate font-extrabold text-slate-950">${player.name}</h3>
                  <p class="text-xs font-semibold ${player.isOut ? "text-red-600" : "text-slate-500"}">${player.isOut ? "Out" : player.id === state.innings.striker?.id ? "On strike" : "Available"}</p>
                </div>
                <p class="text-2xl font-black">${player.runs || 0}</p>
              </div>
              <div class="mt-3 grid grid-cols-4 gap-2 text-center text-sm">
                ${stat("B", player.balls || 0)}
                ${stat("4s", player.fours || 0)}
                ${stat("6s", player.sixes || 0)}
                ${stat("SR", strikeRate(player.runs, player.balls))}
              </div>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function stat(label, value) {
  return `
    <div class="rounded-md bg-slate-50 px-2 py-2">
      <p class="text-[0.68rem] font-bold text-slate-500">${label}</p>
      <p class="font-black text-slate-950">${value}</p>
    </div>
  `;
}
