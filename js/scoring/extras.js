import { state } from "../core/state.js";
import { generateId } from "../core/utils.js";
import { EXTRA_TYPES } from "../core/constants.js";
import { rotateStrike, updateOverProgress } from "./overs.js";
import { recordEvent } from "./undo.js";

export function addWide() {
  state.innings.totalRuns += 1;

  recordEvent({
    action: "WIDE",
  });

  createExtraEvent({
    extraType: EXTRA_TYPES.WIDE,
    runs: 1,
  });
}

export function addNoBall() {
  state.innings.totalRuns += 1;

  recordEvent({
    action: "NO_BALL",
  });

  createExtraEvent({
    extraType: EXTRA_TYPES.NO_BALL,
    runs: 1,
  });
}

export function addBye(runs) {
  state.innings.totalRuns += runs;

  const striker = state.innings.striker;

  striker.balls += 1;

  recordEvent({
    action: "BYE",
    runs,
  });

  createExtraEvent({
    extraType: EXTRA_TYPES.BYE,
    runs,
  });

  updateOverProgress();

  if (runs % 2 !== 0) {
    rotateStrike();
  }
}

export function addLegBye(runs) {
  state.innings.totalRuns += runs;

  const striker = state.innings.striker;

  striker.balls += 1;

  recordEvent({
    action: "LEG_BYE",
    runs,
  });

  createExtraEvent({
    extraType: EXTRA_TYPES.LEG_BYE,
    runs,
  });

  updateOverProgress();

  if (runs % 2 !== 0) {
    rotateStrike();
  }
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
