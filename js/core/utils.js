export function generateId(prefix = 'id') {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function formatOvers(overs, balls) {
  return `${overs}.${balls}`;
}