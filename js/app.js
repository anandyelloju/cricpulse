import { state } from './core/state.js';

import { renderUI } from './ui/render.js';

import { initializeScoringControls }
  from './controllers/scoringController.js';

import { mockMatch } from '../data/mockData.js';

function initializeMatch() {
  state.match.id = mockMatch.id;

  state.match.teamA = mockMatch.teamA;
  state.match.teamB = mockMatch.teamB;

  state.innings.battingTeam = mockMatch.teamA;
  state.innings.bowlingTeam = mockMatch.teamB;

  state.innings.striker =
    mockMatch.teamA.players[0];

  state.innings.nonStriker =
    mockMatch.teamA.players[1];

  state.innings.currentBowler =
    mockMatch.teamB.players[0];
}

function bootstrap() {
  initializeMatch();

  renderUI();

  initializeScoringControls();
}

bootstrap();