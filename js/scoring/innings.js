import { state, resetInningsState } from "../core/state.js";

import { MATCH_STATUS } from "../core/constants.js";

export function endInnings() {
  if (state.match.currentInnings === 1) {
    startSecondInnings();

    return;
  }

  completeMatch();
}

function startSecondInnings() {
  const firstInningsScore = state.innings.totalRuns;

  const teamA = state.match.teamA;

  const teamB = state.match.teamB;

  const battingTeam = state.innings.bowlingTeam;

  const bowlingTeam = state.innings.battingTeam;

  resetInningsState();

  state.match.currentInnings = 2;

  state.match.status = MATCH_STATUS.INNINGS_BREAK;

  state.innings.number = 2;

  state.innings.battingTeam = battingTeam;

  state.innings.bowlingTeam = bowlingTeam;

  state.innings.target = firstInningsScore + 1;

  state.innings.striker = battingTeam.players[0];

  state.innings.nonStriker = battingTeam.players[1];

  state.innings.currentBowler = bowlingTeam.players[0];

  state.innings.nextBatterIndex = 2;

  resetPlayerStats(teamA);

  resetPlayerStats(teamB);

  state.match.status = MATCH_STATUS.LIVE;
}

function completeMatch() {
  state.match.status = MATCH_STATUS.COMPLETED;

  const battingScore = state.innings.totalRuns;

  const target = state.innings.target;

  if (state.match.currentInnings === 1) {
    return;
  }

  if (battingScore >= target) {
    state.match.winner = state.innings.battingTeam.name;

    return;
  }

  if (battingScore < target) {
    state.match.winner = state.innings.bowlingTeam.name;
  }
}

function resetPlayerStats(team) {
  team.players.forEach((player) => {
    player.runs = 0;
    player.balls = 0;
    player.fours = 0;
    player.sixes = 0;
    player.isOut = false;

    player.overs = 0;
    player.runsConceded = 0;
    player.wickets = 0;
  });
}

export function checkMatchWinner() {
  if (state.match.currentInnings !== 2) {
    return;
  }

  if (!state.innings.target) {
    return;
  }

  if (state.innings.totalRuns >= state.innings.target) {
    completeMatch();
  }
}
