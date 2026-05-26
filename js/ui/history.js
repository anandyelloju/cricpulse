import { state } from "../core/state.js";

export function renderHistory() {
  renderCurrentOver();
  renderOverHistory();
}

function renderCurrentOver() {
  const historyRoot = document.getElementById("history-root");

  if (!historyRoot) return;

  const currentOver = state.innings.ballHistory.filter(
    (ball) => ball.over === state.innings.overs,
  );

  historyRoot.innerHTML = `
    ${
      currentOver.length
        ? `<div data-ball-scroll class="flex gap-2 overflow-x-auto pb-1">${currentOver.map(renderBall).join("")}</div>`
        : `<div class="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">Current over deliveries will appear here.</div>`
    }
  `;
  scrollBallRowsToEnd(historyRoot);
}

function renderOverHistory() {
  const root = document.getElementById("over-history-root");

  if (!root) return;

  const completedOvers = groupCompletedOvers();

  root.innerHTML = `
    <div class="max-h-72 space-y-2 overflow-y-auto pr-1">
      ${
        completedOvers.length
          ? completedOvers.map(renderOverRow).join("")
          : `<p class="text-sm text-slate-500">Completed overs will be saved here.</p>`
      }
    </div>
  `;
  scrollBallRowsToEnd(root);
}

function groupCompletedOvers() {
  const groups = new Map();

  state.innings.ballHistory
    .filter((ball) => ball.over < state.innings.overs)
    .forEach((ball) => {
      if (!groups.has(ball.over)) {
        groups.set(ball.over, []);
      }

      groups.get(ball.over).push(ball);
    });

  return [...groups.entries()].sort(([a], [b]) => a - b);
}

function renderOverRow([overIndex, balls]) {
  return `
    <div class="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div class="mb-2 flex items-center justify-between">
        <p class="text-sm font-semibold text-slate-700">Over ${Number(overIndex) + 1}</p>
        <p class="text-xs font-semibold text-slate-500">${balls.reduce((sum, ball) => sum + Number(ball.runs || 0), 0)} runs</p>
      </div>
      <div data-ball-scroll class="flex gap-2 overflow-x-auto pb-1">${balls.map(renderBall).join("")}</div>
    </div>
  `;
}

function scrollBallRowsToEnd(root) {
  requestAnimationFrame(() => {
    root.querySelectorAll("[data-ball-scroll]").forEach((row) => {
      row.scrollLeft = row.scrollWidth;
    });
  });
}

function renderBall(ball) {
  return `
    <div class="flex min-h-10 min-w-11 items-center justify-center rounded-lg px-3 text-sm font-bold ${getBallClass(ball)}">
      ${formatBallLabel(ball)}
    </div>
  `;
}

function formatBallLabel(ball) {
  if (ball.extraType === "WIDE") {
    return ball.runs > 1 ? `WD+${ball.runs}` : "WD";
  }

  if (ball.extraType === "NO_BALL") {
    return ball.runs > 1 ? `NB+${ball.runs}` : "NB";
  }

  if (ball.extraType === "BYE") {
    return `B${ball.runs}`;
  }

  if (ball.extraType === "LEG_BYE") {
    return `LB${ball.runs}`;
  }

  if (ball.type === "WICKET") {
    return "W";
  }

  return ball.runs;
}

function getBallClass(ball) {
  if (ball.type === "WICKET") {
    return "bg-red-50 text-red-700 ring-1 ring-red-100";
  }

  if (ball.extraType) {
    return "bg-orange-50 text-orange-700 ring-1 ring-orange-100";
  }

  if (ball.runs === 4) {
    return "bg-blue-50 text-blue-700 ring-1 ring-blue-100";
  }

  if (ball.runs === 6) {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
  }

  return "bg-slate-100 text-slate-700";
}
