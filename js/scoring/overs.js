import { state } from '../core/state.js';

export function updateOverProgress() {
  state.innings.balls += 1;

  if (state.innings.balls === 6) {
    state.innings.overs += 1;
    state.innings.balls = 0;

    rotateStrike();
  }
}

export function rotateStrike() {
  const currentStriker = state.innings.striker;

  state.innings.striker =
    state.innings.nonStriker;

  state.innings.nonStriker =
    currentStriker;
}