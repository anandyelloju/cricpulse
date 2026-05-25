import { addRuns } from './runs.js';

import {
  addWide,
  addNoBall,
  addBye,
  addLegBye
} from './extras.js';

export function handleScore(runs) {
  addRuns(runs);
}

export function handleWide() {
  addWide();
}

export function handleNoBall() {
  addNoBall();
}

export function handleBye(runs) {
  addBye(runs);
}

export function handleLegBye(runs) {
  addLegBye(runs);
}