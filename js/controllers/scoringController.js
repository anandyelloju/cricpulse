import {
  handleScore,
  handleWide,
  handleNoBall,
  handleBye,
  handleLegBye
} from '../scoring/scoring.js';

import { renderUI } from '../ui/render.js';

export function initializeScoringControls() {

  initializeRunControls();

  initializeExtraControls();
}

function initializeRunControls() {
  const runButtons =
    document.querySelectorAll('[data-run]');

  runButtons.forEach(button => {

    button.addEventListener('click', () => {
      const runs =
        Number(button.dataset.run);

      handleScore(runs);

      renderUI();

      initializeScoringControls();
    });

  });
}

function initializeExtraControls() {
  const extraButtons =
    document.querySelectorAll('[data-extra]');

  extraButtons.forEach(button => {

    button.addEventListener('click', () => {

      const type =
        button.dataset.extra;

      const runs =
        Number(button.dataset.runs || 1);

      if (type === 'wide') {
        handleWide();
      }

      if (type === 'noball') {
        handleNoBall();
      }

      if (type === 'bye') {
        handleBye(runs);
      }

      if (type === 'legbye') {
        handleLegBye(runs);
      }

      renderUI();

      initializeScoringControls();
    });

  });
}