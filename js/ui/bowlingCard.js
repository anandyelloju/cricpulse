import { state } from '../core/state.js';

export function renderBowlingCard() {
  const bowlingRoot = document.getElementById('bowling-root');

  if (!bowlingRoot) return;

  const bowlers =
    state.innings.bowlingTeam?.players || [];

  bowlingRoot.innerHTML = `
    <div class="overflow-x-auto">

      <table class="w-full border-collapse">

        <thead>
          <tr class="border-b">

            <th class="text-left py-2">Bowler</th>
            <th>O</th>
            <th>R</th>
            <th>W</th>

          </tr>
        </thead>

        <tbody>

          ${bowlers.map(player => `
            <tr class="border-b">

              <td class="py-2">
                ${player.name}
              </td>

              <td class="text-center">
                ${player.overs || 0}
              </td>

              <td class="text-center">
                ${player.runsConceded || 0}
              </td>

              <td class="text-center">
                ${player.wickets || 0}
              </td>

            </tr>
          `).join('')}

        </tbody>

      </table>

    </div>
  `;
}