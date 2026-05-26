import { state } from "../core/state.js";

export function updateOverProgress() {
  state.innings.balls += 1;

  if (state.innings.balls === 6) {
    state.innings.overs += 1;
    state.innings.balls = 0;

    rotateStrike();
    state.innings.pendingBowlerSelection = true;
  }
}

export function rotateStrike() {
  const currentStriker = state.innings.striker;

  state.innings.striker = state.innings.nonStriker;

  state.innings.nonStriker = currentStriker;
}

export function updateBowlerOvers() {
  const bowler = state.innings.currentBowler;
  const ballsBowled = (bowler.ballsBowled || 0) + 1;
  const overs = Math.floor(ballsBowled / 6);
  const balls = ballsBowled % 6;

  bowler.ballsBowled = ballsBowled;
  bowler.overs = `${overs}.${balls}`;
}
