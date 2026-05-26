import { renderScoreboard } from './scoreboard.js';
import { renderBattingCard } from './battingCard.js';
import { renderBowlingCard } from './bowlingCard.js';
import { renderControls } from './controls.js';
import { renderHistory } from './history.js';
import { renderCurrentPlayers } from './currentPlayers.js';
import { renderModal } from './modal.js';

export function renderUI() {
  renderScoreboard();

  renderCurrentPlayers();

  renderBattingCard();

  renderBowlingCard();

  renderControls();

  renderHistory();

  renderModal();
}
