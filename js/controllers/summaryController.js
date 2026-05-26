import { state } from "../core/state.js";
import { clearMatchState } from "../core/storage.js";
import { STORAGE_KEYS } from "../core/constants.js";
import { calculateRunRate, economyRate, strikeRate } from "../core/utils.js";
import { prepareReplayMatch } from "../scoring/innings.js";

export function initializeSummaryPage() {
  renderSummary();
  document.addEventListener("click", handleSummaryActions);
}

function renderSummary() {
  const root = document.getElementById("summary-root");

  if (!root) return;

  const records = state.match.inningsRecords || [];
  const allBatters = records.flatMap((record) => record.battingTeam.players);
  const allBowlers = records.flatMap((record) => record.bowlingTeam.players);
  const highestScorer = [...allBatters].sort((a, b) => (b.runs || 0) - (a.runs || 0))[0];
  const bestStrikeRate = [...allBatters]
    .filter((player) => (player.balls || 0) > 0)
    .sort((a, b) => Number(strikeRate(b.runs, b.balls)) - Number(strikeRate(a.runs, a.balls)))[0];
  const bestBowler = [...allBowlers].sort((a, b) => (b.wickets || 0) - (a.wickets || 0) || (a.runsConceded || 0) - (b.runsConceded || 0))[0];
  const economyLeader = [...allBowlers]
    .filter((player) => Number(player.ballsBowled || 0) > 0)
    .sort((a, b) => Number(economyRate(a.runsConceded, a.overs)) - Number(economyRate(b.runsConceded, b.overs)))[0];
  const playerOfMatch = getPlayerOfMatch(highestScorer, bestBowler);

  root.innerHTML = `
    <section class="app-card bg-slate-950 text-white">
      <p class="text-sm font-semibold uppercase text-blue-200">Result</p>
      <h2 class="mt-2 text-3xl font-black leading-tight">${escapeHtml(state.match.winner || "Match in progress")}</h2>
      <p class="mt-2 text-base text-slate-200">${escapeHtml(state.match.resultText || "Final result will appear when the match is complete.")}</p>
      <div class="mt-5 grid gap-3 sm:grid-cols-3">
        ${heroStat("Final score", renderFinalScores(records))}
        ${heroStat("Victory margin", state.match.resultText || "-")}
        ${heroStat("Player of match", playerOfMatch)}
      </div>
    </section>

    <section class="grid gap-4 lg:grid-cols-2">
      <div class="app-card">
        <h2 class="section-title mb-3">Batting highlights</h2>
        ${renderHighlight("Highest scorer", highestScorer ? `${highestScorer.name} - ${highestScorer.runs || 0} (${highestScorer.balls || 0})` : "-")}
        ${renderHighlight("Best strike rate", bestStrikeRate ? `${bestStrikeRate.name} - ${strikeRate(bestStrikeRate.runs, bestStrikeRate.balls)}` : "-")}
        ${renderHighlight("Boundaries", `${allBatters.reduce((sum, player) => sum + (player.fours || 0) + (player.sixes || 0), 0)} total`)}
      </div>

      <div class="app-card">
        <h2 class="section-title mb-3">Bowling highlights</h2>
        ${renderHighlight("Best bowler", bestBowler ? `${bestBowler.name} - ${bestBowler.wickets || 0}/${bestBowler.runsConceded || 0}` : "-")}
        ${renderHighlight("Economy leader", economyLeader ? `${economyLeader.name} - ${economyRate(economyLeader.runsConceded, economyLeader.overs)}` : "-")}
        ${renderHighlight("Wickets", `${allBowlers.reduce((sum, player) => sum + (player.wickets || 0), 0)} recorded`)}
      </div>
    </section>

    <section class="app-card">
      <h2 class="section-title mb-3">Match timeline</h2>
      <div class="space-y-2">
        ${records.length ? records.map(renderTimelineRecord).join("") : `<p class="text-sm text-slate-500">Complete a match to see the innings timeline.</p>`}
      </div>
    </section>

    <section class="app-card">
      <h2 class="section-title mb-3">Key moments</h2>
      <div class="space-y-2">
        ${renderKeyMoments(records)}
      </div>
    </section>

    <section class="grid gap-3 sm:grid-cols-4">
      <button data-action="new-match" class="btn btn-primary sm:col-span-2">Start New Match</button>
      <button data-action="share-match" class="btn btn-secondary">Share</button>
      <button data-action="download-scorecard" class="btn btn-secondary">Download Scorecard</button>
    </section>

    ${renderSummaryFooter()}
  `;
}

function heroStat(label, value) {
  return `
    <div class="rounded-lg bg-white/10 p-3">
      <p class="text-xs font-semibold text-slate-300">${label}</p>
      <p class="mt-1 text-lg font-bold text-white">${escapeHtml(value)}</p>
    </div>
  `;
}

function renderHighlight(label, value) {
  return `
    <div class="stat-chip mb-2">
      <p class="text-xs font-semibold uppercase text-slate-500">${label}</p>
      <p class="mt-1 font-bold text-slate-950">${escapeHtml(value)}</p>
    </div>
  `;
}

function renderTimelineRecord(record) {
  const wickets = record.ballHistory.filter((ball) => ball.type === "WICKET").length;
  const boundaries = record.ballHistory.filter((ball) => ball.runs === 4 || ball.runs === 6).length;

  return `
    <div class="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p class="font-semibold text-slate-950">${escapeHtml(record.battingTeam.name)} innings</p>
      <p class="mt-1 text-sm text-slate-600">${record.totalRuns}/${record.wickets} in ${record.overs}.${record.balls} overs, ${wickets} wickets, ${boundaries} boundaries.</p>
    </div>
  `;
}

function renderKeyMoments(records) {
  const moments = records.flatMap((record) =>
    record.ballHistory
      .filter((ball) => ball.type === "WICKET" || ball.runs === 4 || ball.runs === 6)
      .slice(-4)
      .map((ball) => ({
        innings: record.battingTeam.name,
        text: ball.type === "WICKET" ? `${ball.dismissalType || "Wicket"} in over ${ball.over + 1}` : `${ball.runs} runs in over ${ball.over + 1}`,
      })),
  );

  if (!moments.length) {
    return `<p class="text-sm text-slate-500">Boundaries and wickets will appear here.</p>`;
  }

  return moments
    .slice(-6)
    .map(
      (moment) => `
        <div class="rounded-lg bg-slate-50 p-3">
          <p class="text-sm font-semibold text-slate-900">${escapeHtml(moment.text)}</p>
          <p class="text-xs text-slate-500">${escapeHtml(moment.innings)}</p>
        </div>
      `,
    )
    .join("");
}

function handleSummaryActions(event) {
  const action = event.target.closest("[data-action]")?.dataset.action;

  if (!action) return;

  if (action === "new-match") {
    localStorage.removeItem(STORAGE_KEYS.REPLAY_SETUP);
    clearMatchState();
    window.location.href = "./index.html";
  }

  if (action === "replay-match") {
    prepareReplayMatch();
    clearMatchState();
    window.location.href = "./index.html";
  }

  if (action === "download-scorecard") {
    openPrintableScorecard();
  }

  if (action === "share-match") {
    shareMatchSummary().catch(() => {});
  }

  if (action === "share-feedback" || action === "report-issue" || action === "suggest-feature") {
    const subject = {
      "share-feedback": "CricPulse feedback",
      "report-issue": "CricPulse issue report",
      "suggest-feature": "CricPulse feature suggestion",
    }[action];
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}`;
  }
}

async function shareMatchSummary() {
  const text = `${state.match.winner || "CricPulse Match"} - ${state.match.resultText || renderFinalScores(state.match.inningsRecords || [])}`;

  if (navigator.share) {
    await navigator.share({
      title: "CricPulse Match Summary",
      text,
    });
    return;
  }

  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    alert("Match summary copied to clipboard.");
  }
}

function openPrintableScorecard() {
  const printWindow = window.open("", "_blank");

  if (!printWindow) return;

  const records = state.match.inningsRecords || [];
  const generatedAt = new Date().toLocaleString();

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>CricPulse Scorecard</title>
        <style>
          * { box-sizing: border-box; }
          body { color: #0f172a; font-family: Arial, sans-serif; font-size: 12px; line-height: 1.45; margin: 28px; }
          h1, h2, h3 { margin: 0; }
          h1 { font-size: 26px; }
          h2 { font-size: 18px; margin-bottom: 10px; }
          h3 { font-size: 14px; margin: 14px 0 6px; }
          .brand { align-items: center; border-bottom: 2px solid #e2e8f0; display: flex; justify-content: space-between; margin-bottom: 18px; padding-bottom: 12px; }
          .muted { color: #64748b; }
          .result { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; margin: 14px 0; padding: 12px; }
          .grid { display: grid; gap: 10px; grid-template-columns: repeat(3, 1fr); }
          .box { border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; }
          section { break-inside: avoid; border-top: 1px solid #e2e8f0; margin-top: 18px; padding-top: 14px; }
          table { border-collapse: collapse; margin-top: 8px; page-break-inside: auto; width: 100%; }
          tr { page-break-inside: avoid; }
          th, td { border-bottom: 1px solid #e2e8f0; padding: 7px; text-align: left; }
          th { background: #f8fafc; font-size: 12px; text-transform: uppercase; }
          footer { border-top: 1px solid #e2e8f0; color: #64748b; margin-top: 24px; padding-top: 12px; }
          @page { margin: 18mm; }
        </style>
      </head>
      <body>
        <div class="brand">
          <div>
            <h1>CricPulse Scorecard</h1>
            <p class="muted">Fast cricket scoring made simple</p>
          </div>
          <div class="muted">Generated ${escapeHtml(generatedAt)}<br>Version 1.0</div>
        </div>

        <div class="grid">
          <div class="box"><strong>Match type</strong><br>${state.match.maxOvers} overs</div>
          <div class="box"><strong>Teams</strong><br>${escapeHtml(state.match.teamA?.name || "-")} vs ${escapeHtml(state.match.teamB?.name || "-")}</div>
          <div class="box"><strong>Toss</strong><br>${escapeHtml(state.match.tossWinner || "-")} chose ${escapeHtml(state.match.tossDecision || "-")}</div>
        </div>

        <div class="result">
          <h2>${escapeHtml(state.match.winner || "Result pending")}</h2>
          <p>${escapeHtml(state.match.resultText || "")}</p>
          <p><strong>Final score:</strong> ${escapeHtml(renderFinalScores(records))}</p>
        </div>

        <section>
          <h2>Match Highlights</h2>
          ${renderPrintableHighlights()}
        </section>

        ${records.map(renderPrintableInnings).join("")}

        <footer>
          Generated by CricPulse. Build 1.0. ${escapeHtml(generatedAt)}
        </footer>
        <script>window.print();</script>
      </body>
    </html>
  `);

  printWindow.document.close();
}

function renderPrintableInnings(record) {
  return `
    <section>
      <h2>${escapeHtml(record.battingTeam.name)} ${record.totalRuns}/${record.wickets} (${record.overs}.${record.balls})</h2>
      <div class="grid">
        <div class="box"><strong>Total</strong><br>${record.totalRuns}/${record.wickets}</div>
        <div class="box"><strong>Overs</strong><br>${record.overs}.${record.balls}</div>
        <div class="box"><strong>Run rate</strong><br>${calculateRunRate(record.totalRuns, record.overs, record.balls)}</div>
      </div>
      <h3>Batting</h3>
      <table>
        <thead><tr><th>Player</th><th>Dismissal</th><th>R</th><th>B</th><th>4s</th><th>6s</th><th>SR</th></tr></thead>
        <tbody>
          ${record.battingTeam.players
            .map((player) => `<tr><td>${escapeHtml(player.name)}</td><td>${escapeHtml(getDismissalText(record, player))}</td><td>${player.runs || 0}</td><td>${player.balls || 0}</td><td>${player.fours || 0}</td><td>${player.sixes || 0}</td><td>${strikeRate(player.runs, player.balls)}</td></tr>`)
            .join("")}
        </tbody>
      </table>
      <h3>Bowling</h3>
      <table>
        <thead><tr><th>Player</th><th>O</th><th>R</th><th>W</th><th>Eco</th></tr></thead>
        <tbody>
          ${record.bowlingTeam.players
            .map((player) => `<tr><td>${escapeHtml(player.name)}</td><td>${player.overs || "0.0"}</td><td>${player.runsConceded || 0}</td><td>${player.wickets || 0}</td><td>${economyRate(player.runsConceded, player.overs)}</td></tr>`)
            .join("")}
        </tbody>
      </table>
      <h3>Over History</h3>
      ${renderPrintableOverHistory(record)}
    </section>
  `;
}

function renderPrintableHighlights() {
  const records = state.match.inningsRecords || [];
  const allBatters = records.flatMap((record) => record.battingTeam.players);
  const allBowlers = records.flatMap((record) => record.bowlingTeam.players);
  const highestScorer = [...allBatters].sort((a, b) => (b.runs || 0) - (a.runs || 0))[0];
  const topPair = [...allBatters].sort((a, b) => (b.runs || 0) - (a.runs || 0)).slice(0, 2);
  const bestBowler = [...allBowlers].sort((a, b) => (b.wickets || 0) - (a.wickets || 0) || (a.runsConceded || 0) - (b.runsConceded || 0))[0];
  const turningPoint = records
    .flatMap((record) => record.ballHistory.map((ball) => ({ ...ball, team: record.battingTeam.name })))
    .find((ball) => ball.type === "WICKET" || ball.runs === 6);

  return `
    <div class="grid">
      <div class="box"><strong>Highest scorer</strong><br>${escapeHtml(highestScorer ? `${highestScorer.name} ${highestScorer.runs}` : "-")}</div>
      <div class="box"><strong>Best bowler</strong><br>${escapeHtml(bestBowler ? `${bestBowler.name} ${bestBowler.wickets}/${bestBowler.runsConceded}` : "-")}</div>
      <div class="box"><strong>Key partnership</strong><br>${escapeHtml(topPair.length === 2 ? `${topPair[0].name} & ${topPair[1].name}` : "-")}</div>
      <div class="box"><strong>Turning point</strong><br>${escapeHtml(turningPoint ? `${turningPoint.type === "WICKET" ? "Wicket" : `${turningPoint.runs} runs`} for ${turningPoint.team}` : "-")}</div>
    </div>
  `;
}

function renderPrintableOverHistory(record) {
  const groups = new Map();

  record.ballHistory.forEach((ball) => {
    if (!groups.has(ball.over)) {
      groups.set(ball.over, []);
    }

    groups.get(ball.over).push(ball);
  });

  if (!groups.size) {
    return `<p class="muted">No over history recorded.</p>`;
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a - b)
    .map(([over, balls]) => `<p><strong>Over ${Number(over) + 1}</strong> - ${balls.map(formatBallLabel).join(" ")}</p>`)
    .join("");
}

function getDismissalText(record, player) {
  const wicket = record.ballHistory.find((ball) => ball.type === "WICKET" && ball.strikerId === player.id);

  if (wicket) {
    return wicket.dismissalType || "Out";
  }

  return player.isOut ? "Out" : "Not out";
}

function formatBallLabel(ball) {
  if (ball.extraType === "WIDE") return ball.runs > 1 ? `WD+${ball.runs}` : "WD";
  if (ball.extraType === "NO_BALL") return ball.runs > 1 ? `NB+${ball.runs}` : "NB";
  if (ball.extraType === "BYE") return `B${ball.runs}`;
  if (ball.extraType === "LEG_BYE") return `LB${ball.runs}`;
  if (ball.type === "WICKET") return "W";
  return String(ball.runs);
}

function renderSummaryFooter() {
  return `
    <footer class="app-card space-y-5">
      <div class="grid gap-4 sm:grid-cols-3">
        <div>
          <h2 class="section-title mb-3">Feedback</h2>
          <div class="grid gap-2">
            <button data-action="share-feedback" class="btn btn-secondary min-h-11 justify-start">Share Feedback</button>
            <button data-action="report-issue" class="btn btn-secondary min-h-11 justify-start">Report Issue</button>
            <button data-action="suggest-feature" class="btn btn-secondary min-h-11 justify-start">Suggest Feature</button>
          </div>
        </div>

        <div>
          <h2 class="section-title mb-3">Match actions</h2>
          <div class="grid gap-2">
            <button data-action="download-scorecard" class="btn btn-secondary min-h-11 justify-start">Download PDF</button>
            <button data-action="replay-match" class="btn btn-secondary min-h-11 justify-start">Replay Match</button>
            <button data-action="new-match" class="btn btn-secondary min-h-11 justify-start">Start New Match</button>
          </div>
        </div>

        <div>
          <div class="brand-lockup">
            <span class="brand-mark">CP</span>
            <div>
              <p class="font-bold text-slate-950">CricPulse</p>
              <p class="text-sm text-slate-500">Fast cricket scoring made simple</p>
            </div>
          </div>
          <div class="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-500">
            <p>© CricPulse 2026. Crafted with ❤️ by <a href="https://github.com/anandyelloju" class="text-blue-500 hover:underline font-medium">Anand Yelloju</a>.</p>
            <p class="mt-1">Version 1.0</p>
          </div>
        </div>
      </div>
    </footer>
  `;
}

function renderFinalScores(records) {
  return records.map((record) => `${record.battingTeam.name} ${record.totalRuns}/${record.wickets}`).join(" | ") || "-";
}

function getPlayerOfMatch(highestScorer, bestBowler) {
  if (!highestScorer && !bestBowler) return "To be decided";
  if ((bestBowler?.wickets || 0) >= 3 && (highestScorer?.runs || 0) < 50) return bestBowler.name;
  return highestScorer?.name || bestBowler?.name || "To be decided";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
