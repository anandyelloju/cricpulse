import { state } from "../core/state.js";
import { generateId } from "../core/utils.js";
import { EXTRA_TYPES } from "../core/constants.js";
import {
  rotateStrike,
  updateBowlerOvers,
  updateOverProgress,
} from "./overs.js";
import { recordEvent } from "./undo.js";
import { checkMatchWinner, checkOverLimit } from "./innings.js";

export function addWide(runs = 1) {
  const total = normalizeExtraRuns(runs, 1);
  state.innings.totalRuns += total;
  const bowler = state.innings.currentBowler;

  bowler.runsConceded += total;

  recordEvent({
    action: "WIDE",
    runs: total,
  });

  createExtraEvent({
    extraType: EXTRA_TYPES.WIDE,
    runs: total,
  });

  if (getCompletedRunsFromIllegalDelivery(total) % 2 !== 0) {
    rotateStrike();
  }

  checkMatchWinner();
}

export function addNoBall(runs = 0) {
  const total = normalizeExtraRuns(runs, 0);
  state.innings.totalRuns += total;
  const bowler = state.innings.currentBowler;

  bowler.runsConceded += total;

  recordEvent({
    action: "NO_BALL",
    runs: total,
  });

  createExtraEvent({
    extraType: EXTRA_TYPES.NO_BALL,
    runs: total,
  });

  if (getCompletedRunsFromIllegalDelivery(total) % 2 !== 0) {
    rotateStrike();
  }

  checkMatchWinner();
}

export function addBye(runs) {
  const total = normalizeExtraRuns(runs, 0);
  state.innings.totalRuns += total;

  const striker = state.innings.striker;

  striker.balls += 1;

  recordEvent({
    action: "BYE",
    runs: total,
  });

  createExtraEvent({
    extraType: EXTRA_TYPES.BYE,
    runs: total,
  });

  updateOverProgress();
  updateBowlerOvers();

  if (total % 2 !== 0) {
    rotateStrike();
  }

  checkMatchWinner();
  checkOverLimit();
}

export function addLegBye(runs) {
  const total = normalizeExtraRuns(runs, 0);
  state.innings.totalRuns += total;

  const striker = state.innings.striker;

  striker.balls += 1;

  recordEvent({
    action: "LEG_BYE",
    runs: total,
  });

  createExtraEvent({
    extraType: EXTRA_TYPES.LEG_BYE,
    runs: total,
  });

  updateOverProgress();
  updateBowlerOvers();

  if (total % 2 !== 0) {
    rotateStrike();
  }

  checkMatchWinner();
  checkOverLimit();
}

function normalizeExtraRuns(value, fallback) {
  const runs = Number(value);

  if (!Number.isFinite(runs) || runs < 0) {
    return fallback;
  }

  return runs;
}

function getCompletedRunsFromIllegalDelivery(total) {
  return Math.max(total - 1, 0);
}

function createExtraEvent({ extraType, runs }) {
  const event = {
    id: generateId("ball"),

    over: state.innings.overs,
    ball: state.innings.balls,

    type: "EXTRA",

    extraType,

    runs,

    strikerId: state.innings.striker.id,

    timestamp: Date.now(),
  };

  state.innings.ballHistory.push(event);
}
