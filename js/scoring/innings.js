import { state, resetInningsState } from "../core/state.js";

import { INNINGS_STATUS, MATCH_STATUS, STORAGE_KEYS } from "../core/constants.js";

export function endInnings() {
  saveCurrentInningsRecord();

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
  state.innings.status = INNINGS_STATUS.COMPLETED;
  state.innings.pendingBowlerSelection = false;

  const battingScore = state.innings.totalRuns;

  const target = state.innings.target;

  if (state.match.currentInnings === 1) {
    return;
  }

  if (battingScore >= target) {
    state.match.winner = state.innings.battingTeam.name;
    const wicketsLeft = state.innings.battingTeam.players.length - 1 - state.innings.wickets;
    const ballsRemaining = getBallsRemaining();
    const ballText = ballsRemaining === 1 ? "ball" : "balls";
    state.match.resultText = `${state.match.winner} won by ${wicketsLeft} wickets with ${ballsRemaining} ${ballText} remaining`;

    return;
  }

  if (battingScore < target) {
    if (battingScore === target - 1) {
      state.match.winner = "Match tied";
      state.match.resultText = "Match tied";
      state.match.superOverReady = true;
      return;
    }

    state.match.winner = state.innings.bowlingTeam.name;
    const margin = target - battingScore - 1;
    state.match.resultText = `${state.match.winner} won by ${margin} runs`;
  }

}

export function prepareReplayMatch() {
  localStorage.setItem(
    STORAGE_KEYS.REPLAY_SETUP,
    JSON.stringify({
      teamA: state.match.teamA,
      teamB: state.match.teamB,
      maxOvers: state.match.maxOvers,
      playerCount: state.match.playerCount,
    }),
  );
}

function resetPlayerStats(team) {
  team.players.forEach((player) => {
    player.runs = 0;
    player.balls = 0;
    player.fours = 0;
    player.sixes = 0;
    player.isOut = false;

    player.overs = 0;
    player.ballsBowled = 0;
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
    saveCurrentInningsRecord();
    completeMatch();
  }
}

export function checkOverLimit() {
  if (state.match.status === MATCH_STATUS.COMPLETED) {
    return;
  }

  if (state.innings.overs >= state.match.maxOvers && state.innings.balls === 0) {
    endInnings();
  }
}

function saveCurrentInningsRecord() {
  const record = {
    number: state.match.currentInnings,
    battingTeam: structuredClone(state.innings.battingTeam),
    bowlingTeam: structuredClone(state.innings.bowlingTeam),
    totalRuns: state.innings.totalRuns,
    wickets: state.innings.wickets,
    overs: state.innings.overs,
    balls: state.innings.balls,
    target: state.innings.target,
    ballHistory: structuredClone(state.innings.ballHistory),
  };
  const existingIndex = state.match.inningsRecords.findIndex((item) => item.number === state.match.currentInnings);

  if (existingIndex >= 0) {
    state.match.inningsRecords[existingIndex] = record;
    return;
  }

  state.match.inningsRecords.push(record);
}

function getBallsRemaining() {
  return Math.max(state.match.maxOvers * 6 - (state.innings.overs * 6 + state.innings.balls), 0);
}
