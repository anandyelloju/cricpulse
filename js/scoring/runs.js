import { state } from "../core/state.js";
import { generateId } from "../core/utils.js";
import { rotateStrike, updateBowlerOvers, updateOverProgress } from "./overs.js";
import { recordEvent } from "./undo.js";
import { checkMatchWinner, checkOverLimit } from "./innings.js";

export function addRuns(runs) {
  const striker = state.innings.striker;
  const bowler = state.innings.currentBowler;

  state.innings.totalRuns += runs;

  striker.runs += runs;
  striker.balls += 1;
  bowler.runsConceded += runs;

  if (runs === 4) {
    striker.fours += 1;
  }

  if (runs === 6) {
    striker.sixes += 1;
  }

  recordEvent({
    action: "RUN",
    runs,
  });

  createBallEvent(runs);
  updateOverProgress();

  if (runs % 2 !== 0) {
    rotateStrike();
  }

  updateBowlerOvers();
  checkMatchWinner();
  checkOverLimit();
}

function createBallEvent(runs) {
  const event = {
    id: generateId("ball"),

    over: state.innings.overs,
    ball: state.innings.balls,

    type: "RUN",
    extraType: null,

    runs,

    strikerId: state.innings.striker.id,

    timestamp: Date.now(),
  };

  state.innings.ballHistory.push(event);
}
