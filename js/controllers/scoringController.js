import { handleScore } from '../scoring/scoring.js';

import { renderUI } from '../ui/render.js';

export function initializeScoringControls() {
  const runButtons =
    document.querySelectorAll('[data-run]');

  runButtons.forEach(button => {

    button.addEventListener('click', () => {
      const runs = Number(button.dataset.run);

      handleScore(runs);
      renderUI();
      initializeScoringControls();
      
    });

  });
}