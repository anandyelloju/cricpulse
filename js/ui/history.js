import { state } from '../core/state.js';

export function renderHistory() {
  const historyRoot =
    document.getElementById('history-root');

  if (!historyRoot) return;

  const history =
    [...state.innings.ballHistory].reverse();

  historyRoot.innerHTML = `
    <div class="flex flex-wrap gap-2">

      ${history.map(ball => `
        <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
          ${ball.runs}
        </div>
      `).join('')}

    </div>
  `;
}