import { state } from "../core/state.js";
import { MATCH_STATUS, INNINGS_STATUS, STORAGE_KEYS } from "../core/constants.js";
import { saveMatchState, clearMatchState } from "../core/storage.js";
import { generateId } from "../core/utils.js";

const replayDraft = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPLAY_SETUP) || "null");

const setupDraft = {
  teamA: replayDraft?.teamA?.name || "",
  teamB: replayDraft?.teamB?.name || "",
  preset: replayDraft?.maxOvers ? String(replayDraft.maxOvers) : "5",
  customOvers: replayDraft?.maxOvers || 5,
  playerCount: replayDraft?.playerCount || 6,
  tossWinner: "",
  decision: "",
  tossDone: false,
  isTossing: false,
  openingStrikerIndex: 0,
  openingNonStrikerIndex: 1,
  openingBowlerIndex: 0,
  players: {
    teamA: createPlayerDrafts("teamA", replayDraft?.teamA?.players),
    teamB: createPlayerDrafts("teamB", replayDraft?.teamB?.players),
  },
};

export function initializeSetupPage() {
  clearMatchState();
  renderSetup();
  document.addEventListener("input", handleSetupInput);
  document.addEventListener("change", handleSetupInput);
  document.addEventListener("click", handleSetupClick);
}

function renderSetup() {
  const root = document.getElementById("setup-root");

  if (!root) return;

  root.innerHTML = `
    ${renderBasics()}
    ${renderTeams()}
    ${renderToss()}
    ${renderOpeningPlayers()}

    <div class="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur">
      <div class="mx-auto max-w-2xl">
        <button data-action="start-match" class="btn btn-primary w-full">Start Match</button>
      </div>
    </div>
  `;
}

function renderBasics() {
  return `
    <section class="app-card space-y-4">
      <div>
        <p class="text-xs font-semibold uppercase text-blue-600">Step 1</p>
        <h2 class="section-title mt-1">Match basics</h2>
        <p class="mt-1 text-sm leading-6 text-slate-500">Team names are optional. CricPulse will use Team A and Team B when left blank.</p>
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        <label>
          <span class="form-label">Team A name</span>
          <input data-field="teamA" class="form-input" value="${escapeHtml(setupDraft.teamA)}" placeholder="Team A" />
        </label>

        <label>
          <span class="form-label">Team B name</span>
          <input data-field="teamB" class="form-input" value="${escapeHtml(setupDraft.teamB)}" placeholder="Team B" />
        </label>
      </div>

      <div>
        <span class="form-label">Match type</span>
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
          ${[
            ["5", "5 Overs"],
            ["10", "10 Overs"],
            ["20", "T20"],
            ["custom", "Custom"],
          ]
            .map(
              ([value, label]) => `
                <button data-preset="${value}" class="btn ${setupDraft.preset === value ? "btn-primary" : "btn-secondary"} min-h-[3.25rem]">
                  ${label}
                </button>
              `,
            )
            .join("")}
        </div>
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        ${
          setupDraft.preset === "custom"
            ? `
              <label>
                <span class="form-label">Overs count</span>
                <input data-field="customOvers" class="form-input" type="number" min="1" max="50" value="${setupDraft.customOvers}" />
              </label>
            `
            : `<div class="stat-chip"><p class="text-xs font-semibold text-slate-500">Overs count</p><p class="mt-1 text-lg font-bold text-slate-950">${getSelectedOvers()}</p></div>`
        }

        <label>
          <span class="form-label">Player count</span>
          <select data-field="playerCount" class="form-input">
            ${[2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
              .map((count) => `<option value="${count}" ${Number(setupDraft.playerCount) === count ? "selected" : ""}>${count} players</option>`)
              .join("")}
          </select>
        </label>
      </div>
    </section>
  `;
}

function renderTeams() {
  return `
    <section class="app-card space-y-4">
      <div>
        <p class="text-xs font-semibold uppercase text-blue-600">Step 2</p>
        <h2 class="section-title mt-1">Team setup</h2>
        <p class="mt-1 text-sm leading-6 text-slate-500">Default player names follow the team label and update until you edit that player.</p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        ${renderTeamPlayerList("teamA")}
        ${renderTeamPlayerList("teamB")}
      </div>
    </section>
  `;
}

function renderTeamPlayerList(teamKey) {
  const teamName = getTeamName(teamKey);
  const label = teamKey === "teamA" ? "A" : "B";

  return `
    <div>
      <div class="mb-2 flex items-center justify-between">
        <h3 class="font-semibold text-slate-900">${escapeHtml(teamName)}</h3>
        <span class="chip bg-slate-50 text-slate-600">${setupDraft.playerCount} players</span>
      </div>
      <div class="space-y-2">
        ${getPlayerDrafts(teamKey)
          .map(
            (player, index) => `
              <input
                data-player-team="${teamKey}"
                data-player-index="${index}"
                class="form-input min-h-12"
                value="${escapeHtml(player.name)}"
                placeholder="${label} Player ${index + 1}"
              />
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderToss() {
  const tossWinnerName = setupDraft.tossWinner ? getTeamName(setupDraft.tossWinner) : "Tap toss to decide";
  const canChoose = setupDraft.tossDone && !setupDraft.isTossing;

  return `
    <section class="app-card space-y-4">
      <div>
        <p class="text-xs font-semibold uppercase text-blue-600">Step 3</p>
        <h2 class="section-title mt-1">Toss</h2>
        <p class="mt-1 text-sm leading-6 text-slate-500">Run the toss any time before starting. The winner chooses whether to bat or bowl first.</p>
      </div>

      <div class="flex items-center gap-4 rounded-lg border border-orange-100 bg-orange-50 p-3">
        <div class="coin ${setupDraft.isTossing ? "is-spinning" : ""}">${setupDraft.tossWinner === "teamB" ? "B" : "A"}</div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-slate-600">Toss winner</p>
          <p class="truncate text-xl font-bold text-slate-950">${escapeHtml(tossWinnerName)}</p>
        </div>
        <button data-action="toss-coin" class="btn btn-secondary min-h-12 shrink-0 px-4">${setupDraft.tossDone ? "Toss Again" : "Toss"}</button>
      </div>

      <div class="${canChoose ? "" : "pointer-events-none opacity-50"}">
        <span class="form-label">Decision</span>
        <div class="grid grid-cols-2 gap-2">
          <button data-decision="bat" class="btn ${setupDraft.decision === "bat" ? "btn-primary" : "btn-secondary"}">Bat First</button>
          <button data-decision="bowl" class="btn ${setupDraft.decision === "bowl" ? "btn-primary" : "btn-secondary"}">Bowl First</button>
        </div>
      </div>
    </section>
  `;
}

function renderOpeningPlayers() {
  const plan = getStartingPlan();
  const isReady = setupDraft.tossDone && setupDraft.decision && !setupDraft.isTossing;

  return `
    <section class="app-card space-y-4 ${isReady ? "" : "opacity-60"}">
      <div>
        <p class="text-xs font-semibold uppercase text-blue-600">Step 4</p>
        <h2 class="section-title mt-1">Starting players</h2>
        <p class="mt-1 text-sm leading-6 text-slate-500">${isReady ? `${escapeHtml(getTeamName(plan.battingKey))} batting, ${escapeHtml(getTeamName(plan.bowlingKey))} bowling.` : "Complete toss and choose Bat or Bowl to select opening players."}</p>
      </div>

      <div class="grid gap-3 sm:grid-cols-3 ${isReady ? "" : "pointer-events-none"}">
        <label>
          <span class="form-label">Striker</span>
          <select data-field="openingStrikerIndex" class="form-input">
            ${renderPlayerOptions(plan.battingKey, Number(setupDraft.openingStrikerIndex))}
          </select>
        </label>

        <label>
          <span class="form-label">Non-striker</span>
          <select data-field="openingNonStrikerIndex" class="form-input">
            ${renderPlayerOptions(plan.battingKey, Number(setupDraft.openingNonStrikerIndex))}
          </select>
        </label>

        <label>
          <span class="form-label">Opening bowler</span>
          <select data-field="openingBowlerIndex" class="form-input">
            ${renderPlayerOptions(plan.bowlingKey, Number(setupDraft.openingBowlerIndex))}
          </select>
        </label>
      </div>
    </section>
  `;
}

function renderPlayerOptions(teamKey, selectedIndex) {
  return getPlayerDrafts(teamKey)
    .map((player, index) => `<option value="${index}" ${selectedIndex === index ? "selected" : ""}>${escapeHtml(player.name || getDefaultPlayerName(teamKey, index))}</option>`)
    .join("");
}

function handleSetupInput(event) {
  const playerTeam = event.target.dataset.playerTeam;

  if (playerTeam) {
    const player = setupDraft.players[playerTeam][Number(event.target.dataset.playerIndex)];
    player.name = event.target.value;
    player.touched = true;
    return;
  }

  const field = event.target.dataset.field;

  if (!field) return;

  setupDraft[field] = event.target.value;

  if (field === "teamA" || field === "teamB") {
    syncDefaultPlayerNames(field);
  }

  if (field === "playerCount") {
    resizePlayerDrafts();
    normalizeOpeningIndexes();
  }

  if (field.startsWith("opening")) {
    normalizeOpeningIndexes();
  }

  const cursor = event.target.selectionStart;
  renderSetup();
  const restored = document.querySelector(`[data-field="${field}"]`);
  restored?.focus();
  try {
    restored?.setSelectionRange?.(cursor, cursor);
  } catch {
    // Number inputs and selects do not support text selection in every browser.
  }
}

function handleSetupClick(event) {
  const presetButton = event.target.closest("[data-preset]");

  if (presetButton) {
    setupDraft.preset = presetButton.dataset.preset;
    setupDraft.customOvers = getSelectedOvers();
    renderSetup();
    return;
  }

  const tossButton = event.target.closest('[data-action="toss-coin"]');

  if (tossButton) {
    runToss();
    return;
  }

  const decisionButton = event.target.closest("[data-decision]");

  if (decisionButton) {
    setupDraft.decision = decisionButton.dataset.decision;
    normalizeOpeningIndexes();
    renderSetup();
    return;
  }

  const startButton = event.target.closest('[data-action="start-match"]');

  if (startButton) {
    startMatch();
  }
}

function runToss() {
  setupDraft.isTossing = true;
  setupDraft.tossDone = false;
  renderSetup();

  window.setTimeout(() => {
    setupDraft.tossWinner = Math.random() > 0.5 ? "teamA" : "teamB";
    setupDraft.decision = "";
    setupDraft.tossDone = true;
    setupDraft.isTossing = false;
    renderSetup();
  }, 680);
}

function startMatch() {
  if (!setupDraft.tossDone || !setupDraft.decision) {
    alert("Complete the toss and choose Bat or Bowl before starting.");
    return;
  }

  const teamA = createTeam("teamA", getTeamName("teamA"));
  const teamB = createTeam("teamB", getTeamName("teamB"));
  const tossWinner = setupDraft.tossWinner === "teamA" ? teamA : teamB;
  const battingTeam = setupDraft.decision === "bat" ? tossWinner : tossWinner.id === teamA.id ? teamB : teamA;
  const bowlingTeam = battingTeam.id === teamA.id ? teamB : teamA;
  const strikerIndex = Number(setupDraft.openingStrikerIndex) || 0;
  let nonStrikerIndex = Number(setupDraft.openingNonStrikerIndex) || 1;

  if (nonStrikerIndex === strikerIndex) {
    nonStrikerIndex = strikerIndex === 0 ? 1 : 0;
  }

  state.match.id = generateId("match");
  state.match.status = MATCH_STATUS.LIVE;
  state.match.teamA = teamA;
  state.match.teamB = teamB;
  state.match.tossWinner = tossWinner.name;
  state.match.tossDecision = setupDraft.decision;
  state.match.battingFirst = battingTeam.name;
  state.match.currentInnings = 1;
  state.match.maxOvers = getSelectedOvers();
  state.match.playerCount = Number(setupDraft.playerCount);
  state.match.winner = null;
  state.match.resultText = "";
  state.match.superOverReady = false;
  state.match.inningsRecords = [];

  state.innings.number = 1;
  state.innings.status = INNINGS_STATUS.LIVE;
  state.innings.battingTeam = battingTeam;
  state.innings.bowlingTeam = bowlingTeam;
  state.innings.totalRuns = 0;
  state.innings.wickets = 0;
  state.innings.overs = 0;
  state.innings.balls = 0;
  state.innings.striker = battingTeam.players[strikerIndex] || battingTeam.players[0];
  state.innings.nonStriker = battingTeam.players[nonStrikerIndex] || battingTeam.players.find((player) => player.id !== state.innings.striker?.id);
  state.innings.currentBowler = bowlingTeam.players[Number(setupDraft.openingBowlerIndex) || 0] || bowlingTeam.players[0];
  state.innings.nextBatterIndex = 2;
  state.innings.target = null;
  state.innings.pendingBowlerSelection = false;
  state.innings.eventHistory = [];
  state.innings.ballHistory = [];

  localStorage.removeItem(STORAGE_KEYS.REPLAY_SETUP);
  saveMatchState();
  window.location.href = "./pages/live.html";
}

function createTeam(teamKey, name) {
  return {
    id: generateId("team"),
    name,
    players: getPlayerDrafts(teamKey).map((player, index) => ({
      id: generateId("player"),
      name: player.name.trim() || getDefaultPlayerName(teamKey, index),
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      isOut: false,
      overs: 0,
      ballsBowled: 0,
      runsConceded: 0,
      wickets: 0,
    })),
  };
}

function createPlayerDrafts(teamKey, players = []) {
  const count = replayDraft?.playerCount || 6;
  return Array.from({ length: count }, (_, index) => ({
    name: players[index]?.name || getDefaultPlayerName(teamKey, index),
    touched: Boolean(players[index]?.name),
  }));
}

function resizePlayerDrafts() {
  ["teamA", "teamB"].forEach((teamKey) => {
    const count = Number(setupDraft.playerCount);
    const players = setupDraft.players[teamKey];

    while (players.length < count) {
      players.push({ name: getDefaultPlayerName(teamKey, players.length), touched: false });
    }

    setupDraft.players[teamKey] = players.slice(0, count);
    syncDefaultPlayerNames(teamKey);
  });
}

function normalizeOpeningIndexes() {
  const count = Number(setupDraft.playerCount);

  setupDraft.openingStrikerIndex = Math.min(Number(setupDraft.openingStrikerIndex) || 0, count - 1);
  setupDraft.openingNonStrikerIndex = Math.min(Number(setupDraft.openingNonStrikerIndex) || 1, count - 1);
  setupDraft.openingBowlerIndex = Math.min(Number(setupDraft.openingBowlerIndex) || 0, count - 1);

  if (setupDraft.openingStrikerIndex === setupDraft.openingNonStrikerIndex && count > 1) {
    setupDraft.openingNonStrikerIndex = setupDraft.openingStrikerIndex === 0 ? 1 : 0;
  }
}

function syncDefaultPlayerNames(teamKey) {
  setupDraft.players[teamKey].forEach((player, index) => {
    if (!player.touched) {
      player.name = getDefaultPlayerName(teamKey, index);
    }
  });
}

function getPlayerDrafts(teamKey) {
  resizeMissingDrafts(teamKey);
  return setupDraft.players[teamKey].slice(0, Number(setupDraft.playerCount));
}

function resizeMissingDrafts(teamKey) {
  while (setupDraft.players[teamKey].length < Number(setupDraft.playerCount)) {
    setupDraft.players[teamKey].push({
      name: getDefaultPlayerName(teamKey, setupDraft.players[teamKey].length),
      touched: false,
    });
  }
}

function getDefaultPlayerName(teamKey, index) {
  const prefix = teamKey === "teamA" ? "A" : "B";
  return `${prefix} Player ${index + 1}`;
}

function getTeamName(teamKey) {
  const value = setupDraft[teamKey]?.trim();
  return value || (teamKey === "teamA" ? "Team A" : "Team B");
}

function getStartingPlan() {
  if (!setupDraft.tossWinner || !setupDraft.decision) {
    return {
      battingKey: "teamA",
      bowlingKey: "teamB",
    };
  }

  const battingKey =
    setupDraft.decision === "bat"
      ? setupDraft.tossWinner
      : setupDraft.tossWinner === "teamA"
        ? "teamB"
        : "teamA";

  return {
    battingKey,
    bowlingKey: battingKey === "teamA" ? "teamB" : "teamA",
  };
}

function getSelectedOvers() {
  if (setupDraft.preset === "custom") {
    return Math.max(1, Number(setupDraft.customOvers) || 1);
  }

  return Number(setupDraft.preset);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
