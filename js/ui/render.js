import { renderScoreboard } from './scoreboard.js';
import { renderBattingCard } from './battingCard.js';
import { renderBowlingCard } from './bowlingCard.js';
import { renderControls } from './controls.js';
import { renderHistory } from './history.js';

export function renderUI() {
  renderScoreboard();

  renderBattingCard();

  renderBowlingCard();

  renderControls();

  renderHistory();
}