import { state } from "../core/state.js";

let activeModal = null;
let modalData = {};

export function openModal(type, data = {}) {
  activeModal = type;
  modalData = data;
  renderModal();
}

export function closeModal() {
  activeModal = null;
  modalData = {};
  renderModal();
}

export function renderModal() {
  const root = document.getElementById("modal-root");

  if (!root) return;

  if (state.innings.pendingBowlerSelection) {
    activeModal = "bowler";
  }

  if (!activeModal) {
    root.innerHTML = "";
    return;
  }

  const content = {
    wicket: renderWicketModal,
    extra: renderExtraModal,
    bowler: renderBowlerModal,
    danger: renderDangerModal,
    confirm: renderConfirmModal,
  }[activeModal]?.();

  root.innerHTML = `
    <div class="modal-backdrop" role="dialog" aria-modal="true">
      <div class="modal-panel">
        ${content}
      </div>
    </div>
  `;
}

function renderWicketModal() {
  const batters = [state.innings.striker, state.innings.nonStriker].filter(
    Boolean,
  );
  const available = state.innings.battingTeam.players.filter(
    (player) =>
      !player.isOut &&
      player.id !== state.innings.striker?.id &&
      player.id !== state.innings.nonStriker?.id,
  );

  return `
    <h2 class="section-title mb-1">Wicket</h2>
    <p class="mb-4 text-sm text-slate-500">Confirm the dismissal and bring in the next batter.</p>
    <label class="mb-3 block">
      <span class="form-label">Dismissed player</span>
      <select data-modal-field="dismissedPlayerId" class="form-input">
        ${batters.map((player) => `<option value="${player.id}">${player.name}</option>`).join("")}
      </select>
    </label>
    <label class="mb-3 block">
      <span class="form-label">Dismissal type</span>
      <select data-modal-field="dismissalType" class="form-input">
        <option>Bowled</option>
        <option>Caught</option>
        <option>Run out</option>
        <option>LBW</option>
        <option>Stumped</option>
        <option>Hit wicket</option>
      </select>
    </label>
    <label class="mb-4 block">
      <span class="form-label">New batsman</span>
      <select data-modal-field="newBatterId" class="form-input">
        ${available.map((player) => `<option value="${player.id}">${player.name}</option>`).join("")}
      </select>
    </label>
    <div class="grid grid-cols-2 gap-3">
      <button data-action="close-modal" class="btn btn-secondary">Cancel</button>
      <button data-action="confirm-wicket" class="btn btn-danger">Confirm</button>
    </div>
  `;
}

function renderExtraModal() {
  const labels = {
    wide: "Wide",
    noball: "No Ball",
    bye: "Bye",
    legbye: "Leg Bye",
  };
  const label = labels[modalData.type] || "Extra";
  const isLegalDelivery =
    modalData.type === "bye" || modalData.type === "legbye";
  const options = isLegalDelivery ? [0, 1, 2, 3, 4] : [1, 2, 3, 4, 5];
  const helper = isLegalDelivery
    ? "Legal delivery. Runs go to team total only."
    : "Illegal delivery. Ball count stays the same.";
  const prefix = {
    wide: "WD",
    noball: "NB",
    bye: "B",
    legbye: "LB",
  }[modalData.type];

  return `
    <h2 class="section-title mb-1">${label}</h2>
    <p class="mb-4 text-sm text-slate-500">${helper}</p>

    <div class="mb-4 grid grid-cols-4 gap-2">
      ${options
        .map(
          (run) => `
            <button
              data-action="confirm-extra"
              data-extra-type="${modalData.type}"
              data-extra-runs="${run}"
              class="btn btn-secondary min-h-12 px-2"
            >
              ${formatExtraOption(prefix, run)}
            </button>
          `,
        )
        .join("")}
    </div>

    <label class="mb-4 block">
      <span class="form-label">Custom runs</span>
      <input data-modal-field="extraRuns" class="form-input" type="number" min="${isLegalDelivery ? 1 : 1}" max="12" value="${isLegalDelivery ? 1 : 1}" />
    </label>

    <div class="grid grid-cols-2 gap-3">
      <button data-action="close-modal" class="btn btn-secondary">Cancel</button>
      <button data-action="confirm-extra" data-extra-type="${modalData.type}" class="btn btn-primary">Add</button>
    </div>
  `;
}

function formatExtraOption(prefix, runs) {
  if (prefix === "WD" || prefix === "NB") {
    return runs === 1 ? prefix : `${prefix}+${runs - 1}`;
  }

  return `${prefix}${runs}`;
}

function renderBowlerModal() {
  const bowlers = state.innings.bowlingTeam.players;
  const previousBowlerId = state.innings.currentBowler?.id;
  const selectableBowlers = bowlers.filter(
    (player) => player.id !== previousBowlerId,
  );
  const selectedBowlerId = selectableBowlers[0]?.id || previousBowlerId;

  return `
    <h2 class="section-title mb-1">Over complete</h2>
    <p class="mb-4 text-sm text-slate-500">Select the bowler for the next over. The previous bowler is disabled.</p>
    <label class="mb-4 block">
      <span class="form-label">Next bowler</span>
      <select data-modal-field="bowlerId" class="form-input">
        ${bowlers
          .map(
            (player) =>
              `<option value="${player.id}" ${player.id === selectedBowlerId ? "selected" : ""} ${player.id === previousBowlerId && selectableBowlers.length ? "disabled" : ""}>${player.name}${player.id === previousBowlerId ? " (previous over)" : ""}</option>`,
          )
          .join("")}
      </select>
    </label>
    <button data-action="confirm-bowler" class="btn btn-primary w-full">Start next over</button>
  `;
}

function renderDangerModal() {
  return `
    <h2 class="section-title mb-4">Match actions</h2>
    <div class="grid gap-3">
      <button data-action="request-end-innings" class="btn btn-warning">End Innings</button>
      <button data-action="request-reset-match" class="btn btn-danger">Reset Match</button>
      <button data-action="close-modal" class="btn btn-secondary">Close</button>
    </div>
  `;
}

function renderConfirmModal() {
  return `
    <h2 class="section-title mb-1">${modalData.title}</h2>
    <p class="mb-4 text-sm text-slate-500">${modalData.message}</p>
    <div class="grid grid-cols-2 gap-3">
      <button data-action="close-modal" class="btn btn-secondary">Cancel</button>
      <button data-action="${modalData.confirmAction}" class="btn btn-danger">Confirm</button>
    </div>
  `;
}
