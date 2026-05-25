import { renderScoreboard } from './scoreboard.js';
import { renderBattingCard } from './battingCard.js';
import { renderBowlingCard } from './bowlingCard.js';

export function renderUI() {
  renderScoreboard();
  renderBattingCard();
  renderBowlingCard();
}