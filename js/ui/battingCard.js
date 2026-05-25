import { state } from "../core/state.js";

export function renderBattingCard() {
  const battingRoot = document.getElementById("batting-root");

  if (!battingRoot) return;

  const players = state.innings.battingTeam?.players || [];

  battingRoot.innerHTML = `
    <div class="overflow-x-auto">

      <table class="w-full border-collapse">

        <thead>
          <tr class="border-b">

            <th class="text-left py-2">Batter</th>
            <th>R</th>
            <th>B</th>
            <th>4s</th>
            <th>6s</th>

          </tr>
        </thead>

        <tbody>

          ${players
            .map(
              (player) => `
            <tr class="border-b">

              <td class="py-2">
                ${player.name}

                ${player.isOut ? '<span class="text-red-600 text-sm">(out)</span>' : ""}
            </td>

              <td class="text-center">
                ${player.runs || 0}
              </td>

              <td class="text-center">
                ${player.balls || 0}
              </td>

              <td class="text-center">
                ${player.fours || 0}
              </td>

              <td class="text-center">
                ${player.sixes || 0}
              </td>

            </tr>
          `,
            )
            .join("")}

        </tbody>

      </table>

    </div>
  `;
}
