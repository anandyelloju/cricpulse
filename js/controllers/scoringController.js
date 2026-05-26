import {
  handleScore,
  handleWide,
  handleNoBall,
  handleBye,
  handleLegBye,
  handleWicket,
  handleUndo,
  handleEndInnings,
} from "../scoring/scoring.js";
import { renderUI } from "../ui/render.js";
import { openModal, closeModal } from "../ui/modal.js";
import { saveMatchState } from "../core/storage.js";
import { resetMatch } from "./matchController.js";
import { state } from "../core/state.js";
import { MATCH_STATUS, STORAGE_KEYS } from "../core/constants.js";
import { prepareReplayMatch } from "../scoring/innings.js";

export function initializeScoringControls() {
  document.addEventListener("click", handleControls);
}

function handleControls(event) {
  const action = event.target.closest("[data-action]")?.dataset.action;

  if (state.match.status === MATCH_STATUS.COMPLETED) {
    handleCompletedMatchActions(action);
    return;
  }

  const runButton = event.target.closest("[data-run]");

  if (runButton) {
    const runs = Number(runButton.dataset.run);

    handleScore(runs);

    renderUI();
    saveMatchState();
    navigateIfComplete();

    return;
  }

  const extraButton = event.target.closest("[data-extra]");

  if (extraButton) {
    const type = extraButton.dataset.extra;

    openModal("extra", { type });
    return;
  }

  const wicketButton = event.target.closest('[data-action="wicket"]');

  if (wicketButton) {
    openModal("wicket");

    return;
  }

  const undoButton = event.target.closest('[data-action="undo"]');

  if (undoButton) {
    handleUndo();

    renderUI();
    saveMatchState();
  }

  const endInningsButton = event.target.closest('[data-action="end-innings"]');

  if (endInningsButton) {
    openModal("confirm", {
      title: "End innings?",
      message: "This will move the match to the next innings or finish the match.",
      confirmAction: "confirm-end-innings",
    });

    return;
  }

  const resetButton = event.target.closest('[data-action="reset-match"]');

  if (resetButton) {
    openModal("confirm", {
      title: "Reset match?",
      message: "This clears the current match and returns to setup.",
      confirmAction: "confirm-reset-match",
    });

    return;
  }

  handleModalActions(event, action);
}

function handleModalActions(event, action) {
  if (!action) return;

  if (action === "open-danger-menu") {
    openModal("danger");
  }

  if (action === "close-modal") {
    closeModal();
  }

  if (action === "request-end-innings") {
    openModal("confirm", {
      title: "End innings?",
      message: "This will move the match to the next innings or finish the match.",
      confirmAction: "confirm-end-innings",
    });
  }

  if (action === "request-reset-match") {
    openModal("confirm", {
      title: "Reset match?",
      message: "This clears the current match and returns to setup.",
      confirmAction: "confirm-reset-match",
    });
  }

  if (action === "confirm-extra") {
    const type = event.target.dataset.extraType;
    const runs = Number(event.target.dataset.extraRuns || document.querySelector('[data-modal-field="extraRuns"]')?.value || 0);

    if (type === "wide") {
      handleWide(runs);
    }

    if (type === "noball") {
      handleNoBall(runs);
    }

    if (type === "bye") {
      handleBye(runs);
    }

    if (type === "legbye") {
      handleLegBye(runs);
    }

    closeModal();
    renderUI();
    saveMatchState();
    navigateIfComplete();
  }

  if (action === "confirm-wicket") {
    const dismissedPlayerId = document.querySelector('[data-modal-field="dismissedPlayerId"]')?.value;
    const newBatterId = document.querySelector('[data-modal-field="newBatterId"]')?.value;
    const dismissalType = document.querySelector('[data-modal-field="dismissalType"]')?.value;

    handleWicket({ dismissedPlayerId, newBatterId, dismissalType });
    closeModal();
    renderUI();
    saveMatchState();
    navigateIfComplete();
  }

  if (action === "confirm-bowler") {
    const bowlerId = document.querySelector('[data-modal-field="bowlerId"]')?.value;
    const bowler =
      state.innings.bowlingTeam.players.find((player) => player.id === bowlerId && player.id !== state.innings.currentBowler?.id) ||
      state.innings.bowlingTeam.players.find((player) => player.id !== state.innings.currentBowler?.id);

    if (bowler) {
      state.innings.currentBowler = bowler;
    }

    state.innings.pendingBowlerSelection = false;
    closeModal();
    renderUI();
    saveMatchState();
    navigateIfComplete();
  }

  if (action === "confirm-end-innings") {
    handleEndInnings();
    closeModal();
    renderUI();
    saveMatchState();
    navigateIfComplete();
  }

  if (action === "confirm-reset-match") {
    closeModal();
    resetMatch();
  }
}

function handleCompletedMatchActions(action) {
  if (action === "view-summary") {
    window.location.href = "./summary.html";
  }

  if (action === "new-match") {
    localStorage.removeItem(STORAGE_KEYS.REPLAY_SETUP);
    resetMatch();
  }

  if (action === "replay-match") {
    prepareReplayMatch();
    resetMatch();
  }
}

function navigateIfComplete() {
  if (state.match.status === "COMPLETED") {
    renderUI();
  }
}
