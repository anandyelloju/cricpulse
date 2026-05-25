import { state } from "../core/state.js";
import { generateId } from "../core/utils.js";
import { updateOverProgress, updateBowlerOvers } from "./overs.js";
import { recordEvent } from "./undo.js";
import { endInnings } from "./innings.js";

export function addWicket() {
  recordEvent({
    action: "WICKET",
  });

  const striker = state.innings.striker;
  const bowler = state.innings.currentBowler;

  striker.isOut = true;
  striker.balls += 1;
  state.innings.wickets += 1;
  bowler.wickets += 1;

  createWicketEvent();
  updateOverProgress();
  assignNextBatter();
  updateBowlerOvers();
  checkInningsCompletion();
}

function assignNextBatter() {
  const players = state.innings.battingTeam.players;

  const nextIndex = state.innings.nextBatterIndex;

  if (nextIndex >= players.length) {
    return;
  }

  state.innings.striker = players[nextIndex];

  state.innings.nextBatterIndex += 1;
}

function createWicketEvent() {
  const event = {
    id: generateId("ball"),

    over: state.innings.overs,
    ball: state.innings.balls,

    type: "WICKET",

    runs: 0,

    strikerId: state.innings.striker.id,

    timestamp: Date.now(),
  };

  state.innings.ballHistory.push(event);
}

function checkInningsCompletion() {
  const totalPlayers = state.innings.battingTeam.players.length;

  if (state.innings.wickets >= totalPlayers - 1) {
    endInnings();
  }
}
