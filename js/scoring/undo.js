import { state, resetInningsState } from "../core/state.js";
import { addRuns } from "./runs.js";
import { addWide, addNoBall, addBye, addLegBye } from "./extras.js";
import { addWicket } from "./wickets.js";

export function recordEvent(event) {
  if (state.innings.isReplaying) {
    return;
  }

  state.innings.eventHistory.push(event);
}

export function undoLastEvent() {
  if (state.innings.eventHistory.length === 0) {
    return;
  }

  state.innings.eventHistory.pop();

  replayInnings();
}

function replayInnings() {
  const history = [...state.innings.eventHistory];

  const battingTeam = state.innings.battingTeam;

  const bowlingTeam = state.innings.bowlingTeam;

  resetInningsState();

  state.innings.battingTeam = battingTeam;

  state.innings.bowlingTeam = bowlingTeam;

  state.innings.striker = battingTeam.players[0];

  state.innings.nonStriker = battingTeam.players[1];

  state.innings.currentBowler = bowlingTeam.players[0];

  state.innings.nextBatterIndex = 2;

  state.innings.eventHistory = [];

  state.innings.isReplaying = true;

  battingTeam.players.forEach((player) => {
    player.runs = 0;
    player.balls = 0;
    player.fours = 0;
    player.sixes = 0;
    player.isOut = false;
  });

  bowlingTeam.players.forEach((player) => {
    player.overs = 0;
    player.runsConceded = 0;
    player.wickets = 0;
  });

  history.forEach((event) => {
    replayEvent(event);
  });

  state.innings.eventHistory = history;

  state.innings.isReplaying = false;
}

function replayEvent(event) {
  switch (event.action) {
    case "RUN":
      addRuns(event.runs);
      break;

    case "WIDE":
      addWide();
      break;

    case "NO_BALL":
      addNoBall();
      break;

    case "BYE":
      addBye(event.runs);
      break;

    case "LEG_BYE":
      addLegBye(event.runs);
      break;

    case "WICKET":
      addWicket();
      break;
  }
}
