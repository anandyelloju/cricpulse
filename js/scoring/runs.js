import { state } from '../core/state.js';

import { generateId } from '../core/utils.js';

import { rotateStrike } from './overs.js';
import { updateOverProgress } from './overs.js';

export function addRuns(runs) {
  const striker = state.innings.striker;

  state.innings.totalRuns += runs;

  striker.runs += runs;
  striker.balls += 1;

  if (runs === 4) {
    striker.fours += 1;
  }

  if (runs === 6) {
    striker.sixes += 1;
  }

  createBallEvent(runs);

  updateOverProgress();

  if (runs % 2 !== 0) {
    rotateStrike();
  }
}

function createBallEvent(runs) {
  const event = {
    id: generateId('ball'),

    over: state.innings.overs,
    ball: state.innings.balls,

    type: 'RUN',

    runs,

    strikerId: state.innings.striker.id,

    timestamp: Date.now()
  };

  state.innings.ballHistory.push(event);
}