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
        <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-sm">

          ${formatBallLabel(ball)}

        </div>
      `).join('')}

    </div>
  `;
}

function formatBallLabel(ball) {

  if (ball.extraType === 'WIDE') {
    return 'WD';
  }

  if (ball.extraType === 'NO_BALL') {
    return 'NB';
  }

  if (ball.extraType === 'BYE') {
    return `B${ball.runs}`;
  }

  if (ball.extraType === 'LEG_BYE') {
    return `LB${ball.runs}`;
  }

  return ball.runs;
}