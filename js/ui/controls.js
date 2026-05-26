import { MATCH_STATUS } from "../core/constants.js";
import { state } from "../core/state.js";

export function renderControls() {
  const controlsRoot = document.getElementById("controls-root");

  if (!controlsRoot) return;

  if (state.match.status === MATCH_STATUS.COMPLETED) {
    controlsRoot.innerHTML = `
      <div class="mx-auto max-w-5xl space-y-3">
        <div class="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
          <p class="text-sm font-bold text-emerald-800">${state.match.resultText || "Match completed"}</p>
          <p class="mt-1 text-xs font-semibold text-emerald-700">Scoring is locked.</p>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <button data-action="view-summary" class="btn btn-primary score-button">Summary</button>
          <button data-action="replay-match" class="btn btn-secondary score-button">Replay</button>
          <button data-action="new-match" class="btn btn-secondary score-button">New Match</button>
        </div>
      </div>
    `;
    return;
  }

  controlsRoot.innerHTML = `
    <div class="mx-auto max-w-5xl space-y-2">
      <div class="flex items-center justify-between">
        <h2 class="section-title">Score ball</h2>
        <button data-action="open-danger-menu" class="rounded-lg px-3 py-2 text-sm font-bold text-slate-600">More</button>
      </div>

      <div class="grid grid-cols-4 gap-2">
        ${button("undo", "Undo", "bg-slate-700 text-white")}
        ${extraButton("legbye", "LB", "bg-cyan-50 text-cyan-800 ring-1 ring-cyan-100")}
        ${extraButton("bye", "BYE", "bg-teal-50 text-teal-800 ring-1 ring-teal-100")}
        ${button("wicket", "Wicket", "bg-red-500 text-white")}
        ${extraButton("noball", "No_Ball", "bg-orange-50 text-orange-800 ring-1 ring-orange-100")}
        ${extraButton("wide", "Wide", "bg-orange-50 text-orange-800 ring-1 ring-orange-100")}
        ${runButton(4, "bg-blue-500 text-white")}
        ${runButton(6, "bg-emerald-500 text-white")}
        ${runButton(0, "bg-slate-100 text-slate-900 ring-1 ring-slate-200", "Dot")}
        ${runButton(1, "bg-blue-50 text-blue-900 ring-1 ring-blue-100")}
        ${runButton(2, "bg-blue-50 text-blue-900 ring-1 ring-blue-100")}
        ${runButton(3, "bg-blue-50 text-blue-900 ring-1 ring-blue-100")}
      </div>
    </div>
  `;
}

function runButton(run, className, label = run) {
  return `<button data-run="${run}" class="btn score-button ${className} text-lg">${label}</button>`;
}

function extraButton(type, label, className) {
  return `<button data-extra="${type}" class="btn score-button ${className}">${label}</button>`;
}

function button(action, label, className) {
  return `<button data-action="${action}" class="btn score-button ${className}">${label}</button>`;
}
