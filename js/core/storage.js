import { state } from "./state.js";
import { STORAGE_KEYS } from "./constants.js";

export function saveMatchState() {
  localStorage.setItem(STORAGE_KEYS.MATCH_STATE, JSON.stringify(state));
}

export function loadMatchState() {
  const savedState = localStorage.getItem(STORAGE_KEYS.MATCH_STATE);

  if (!savedState) {
    return null;
  }

  return JSON.parse(savedState);
}

export function restoreMatchState(savedState) {
  if (!savedState) {
    return;
  }

  Object.assign(state.match, savedState.match);

  Object.assign(state.innings, savedState.innings);
}

export function clearMatchState() {
  localStorage.removeItem(STORAGE_KEYS.MATCH_STATE);
}
