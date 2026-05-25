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
    battingFirst: null,

    currentInnings: 1,

    winner: null,
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

    target: null,

    eventHistory: [],
    isReplaying: false,

    ballHistory: [],
  };
}
