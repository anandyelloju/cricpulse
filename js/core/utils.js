export function generateId(prefix = 'id') {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function formatOvers(overs, balls) {
  return `${overs}.${balls}`;
}

export function calculateRunRate(runs, overs, balls) {
  const legalBalls = overs * 6 + balls;

  if (!legalBalls) {
    return "0.00";
  }

  return ((runs * 6) / legalBalls).toFixed(2);
}

export function calculateRequiredRate(target, runs, maxOvers, overs, balls) {
  if (!target) {
    return "-";
  }

  const remainingRuns = Math.max(target - runs, 0);
  const remainingBalls = Math.max(maxOvers * 6 - (overs * 6 + balls), 0);

  if (!remainingBalls) {
    return remainingRuns === 0 ? "0.00" : "INF";
  }

  return ((remainingRuns * 6) / remainingBalls).toFixed(2);
}

export function strikeRate(runs = 0, balls = 0) {
  if (!balls) {
    return "0.00";
  }

  return ((runs / balls) * 100).toFixed(2);
}

export function economyRate(runs = 0, oversValue = 0) {
  const [overs = 0, balls = 0] = String(oversValue).split(".").map(Number);
  const legalBalls = overs * 6 + balls;

  if (!legalBalls) {
    return "0.00";
  }

  return ((runs * 6) / legalBalls).toFixed(2);
}
