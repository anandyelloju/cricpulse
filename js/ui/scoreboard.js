import { state } from '../core/state.js';
import { formatOvers } from '../core/utils.js';

export function renderScoreboard() {
  const scoreboardRoot = document.getElementById('scoreboard-root');

  if (!scoreboardRoot) return;

  scoreboardRoot.innerHTML = `
    <div class="space-y-3">

      <div>
        <h3 class="text-xl font-bold">
          ${state.innings.battingTeam?.name || 'Team'}
        </h3>
      </div>

      <div class="text-4xl font-bold">
        ${state.innings.totalRuns}/${state.innings.wickets}
      </div>

      <div class="text-gray-600">
        Overs:
        ${formatOvers(state.innings.overs, state.innings.balls)}
      </div>

    </div>
  `;
}