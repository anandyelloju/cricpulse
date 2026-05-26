import { addRuns } from "./runs.js";
import { addWide, addNoBall, addBye, addLegBye } from "./extras.js";
import { addWicket } from "./wickets.js";
import { undoLastEvent } from "./undo.js";
import { endInnings } from "./innings.js";
import { state } from "../core/state.js";
import { MATCH_STATUS } from "../core/constants.js";

export function handleScore(runs) {
  if (isMatchLocked()) return;
  addRuns(runs);
}

export function handleWide(additionalRuns = 0) {
  if (isMatchLocked()) return;
  addWide(additionalRuns);
}

export function handleNoBall(additionalRuns = 0) {
  if (isMatchLocked()) return;
  addNoBall(additionalRuns);
}

export function handleBye(runs) {
  if (isMatchLocked()) return;
  addBye(runs);
}

export function handleLegBye(runs) {
  if (isMatchLocked()) return;
  addLegBye(runs);
}

export function handleWicket(options = {}) {
  if (isMatchLocked()) return;
  addWicket(options);
}

export function handleUndo() {
  if (isMatchLocked()) return;
  undoLastEvent();
}

export function handleEndInnings() {
  if (isMatchLocked()) return;
  endInnings();
}

function isMatchLocked() {
  return state.match.status === MATCH_STATUS.COMPLETED;
}
