import { MATCH_STATUS, INNINGS_STATUS } from "./constants.js";

export const state = {
  match: {
    id: "",
    status: MATCH_STATUS.NOT_STARTED,

    teamA: {
      id: "",
      name: "",
      players: [],
    },

    teamB: {
      id: "",
      name: "",
      players: [],
    },

    tossWinner: null,
    tossDecision: null,
    battingFirst: null,

    currentInnings: 1,
    maxOvers: 5,
    playerCount: 6,

    winner: null,
    resultText: "",
    superOverReady: false,
    inningsRecords: [],
  },

  innings: {
    number: 1,

    status: INNINGS_STATUS.NOT_STARTED,

    battingTeam: null,
    bowlingTeam: null,

    totalRuns: 0,
    wickets: 0,

    overs: 0,
    balls: 0,

    striker: null,
    nonStriker: null,
    currentBowler: null,

    nextBatterIndex: 2,

    target: null,
    pendingBowlerSelection: false,

    eventHistory: [],
    isReplaying: false,

    ballHistory: [],
  },
};

export function resetInningsState() {
  state.innings = {
    number: 1,

    status: INNINGS_STATUS.NOT_STARTED,

    battingTeam: null,
    bowlingTeam: null,

    totalRuns: 0,
    wickets: 0,

    overs: 0,
    balls: 0,

    striker: null,
    nonStriker: null,
    currentBowler: null,

    nextBatterIndex: 2,

    target: null,
    pendingBowlerSelection: false,

    eventHistory: [],
    isReplaying: false,

    ballHistory: [],
  };
}
