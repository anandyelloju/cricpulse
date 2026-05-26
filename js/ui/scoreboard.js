import { state } from "../core/state.js";
import { formatOvers } from "../core/utils.js";

export function renderScoreboard() {
  const scoreboardRoot = document.getElementById("scoreboard-root");

  if (!scoreboardRoot) return;

  scoreboardRoot.innerHTML = `
  <div class="space-y-4">

    <div>
      <h3 class="text-2xl font-bold">
        ${state.innings.battingTeam?.name || "Team"}
      </h3>
    </div>

    <div class="flex items-end gap-3">

      <div class="text-5xl font-bold">
        ${state.innings.totalRuns}/${state.innings.wickets}
      </div>

      <div class="text-gray-500 pb-1">
        ${formatOvers(state.innings.overs, state.innings.balls)}
      </div>

    </div>

    <div class="grid grid-cols-2 gap-3 text-sm">

      <div class="bg-gray-100 rounded-lg p-3">
        <div class="text-gray-500">
          Innings
        </div>

        <div class="font-semibold">
          ${state.match.currentInnings}
        </div>
      </div>

      ${
        state.innings.target
          ? `
          <div class="bg-green-100 rounded-lg p-3">
            <div class="text-green-700">
              Target
            </div>

            <div class="font-semibold text-green-800">
              ${state.innings.target}
            </div>
          </div>
        `
          : ""
      }

    </div>

    ${
      state.match.status === "COMPLETED"
        ? `
        <div class="bg-green-100 text-green-800 p-4 rounded-xl font-bold text-center">
          Winner:
          ${state.match.winner}
        </div>
      `
        : ""
    }

  </div>
`;
}
