import {
  handleScore,
  handleWide,
  handleNoBall,
  handleBye,
  handleLegBye,
  handleWicket,
  handleUndo,
} from "../scoring/scoring.js";

import { renderUI } from "../ui/render.js";

export function initializeScoringControls() {
  document.addEventListener("click", handleControls);
}

function handleControls(event) {
  const runButton = event.target.closest("[data-run]");

  if (runButton) {
    const runs = Number(runButton.dataset.run);

    handleScore(runs);

    renderUI();

    return;
  }

  const extraButton = event.target.closest("[data-extra]");

  if (extraButton) {
    const type = extraButton.dataset.extra;

    const runs = Number(extraButton.dataset.runs || 1);

    if (type === "wide") {
      handleWide();
    }

    if (type === "noball") {
      handleNoBall();
    }

    if (type === "bye") {
      handleBye(runs);
    }

    if (type === "legbye") {
      handleLegBye(runs);
    }

    renderUI();

    return;
  }

  const wicketButton = event.target.closest('[data-action="wicket"]');

  if (wicketButton) {
    handleWicket();

    renderUI();
  }

  const undoButton = event.target.closest('[data-action="undo"]');

  if (undoButton) {
    handleUndo();

    renderUI();
  }
}
