import { state } from './core/state.js';
import { mockMatch } from '../data/mockData.js';

function initializeApp() {
  state.match.id = mockMatch.id;

  state.match.teamA = mockMatch.teamA;
  state.match.teamB = mockMatch.teamB;

  console.log('APPLICATION STATE');
  console.log(state);
}

initializeApp();