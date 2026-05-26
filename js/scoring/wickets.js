import { state } from "../core/state.js";
import { generateId } from "../core/utils.js";
import { updateOverProgress, updateBowlerOvers } from "./overs.js";
import { recordEvent } from "./undo.js";
import { checkOverLimit, endInnings } from "./innings.js";

export function addWicket(options = {}) {
  recordEvent({
    action: "WICKET",
    options,
  });

  const striker = getDismissedPlayer(options.dismissedPlayerId);
  const bowler = state.innings.currentBowler;

  striker.isOut = true;
  striker.balls += 1;
  state.innings.wickets += 1;
  bowler.wickets += 1;

  createWicketEvent(striker, options.dismissalType);
  updateOverProgress();
  assignNextBatter(striker, options.newBatterId);
  updateBowlerOvers();
  checkInningsCompletion();
  checkOverLimit();
}

function getDismissedPlayer(playerId) {
  const batters = [state.innings.striker, state.innings.nonStriker].filter(Boolean);

  return batters.find((player) => player.id === playerId) || state.innings.striker;
}

function assignNextBatter(dismissedPlayer, newBatterId) {
  const players = state.innings.battingTeam.players;

  const selected = players.find((player) => player.id === newBatterId && !player.isOut);
  const nextIndex = state.innings.nextBatterIndex;
  const nextBatter = selected || players[nextIndex];

  if (!nextBatter) {
    return;
  }

  if (dismissedPlayer.id === state.innings.nonStriker?.id) {
    state.innings.nonStriker = nextBatter;
  } else {
    state.innings.striker = nextBatter;
  }

  state.innings.nextBatterIndex = Math.max(
    state.innings.nextBatterIndex + 1,
    players.findIndex((player) => player.id === nextBatter.id) + 1,
  );
}

function createWicketEvent(player, dismissalType) {
  const event = {
    id: generateId("ball"),

    over: state.innings.overs,
    ball: state.innings.balls,

    type: "WICKET",

    runs: 0,

    strikerId: player.id,
    dismissalType: dismissalType || "Wicket",

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
