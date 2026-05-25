import { state } from "../core/state.js";
import {
  loadMatchState,
  restoreMatchState,
  saveMatchState,
  clearMatchState,
} from "../core/storage.js";
import { renderUI } from "../ui/render.js";

export function initializeMatchState() {
  const savedState = loadMatchState();

  if (!savedState) {
    return false;
  }

  restoreMatchState(savedState);

  renderUI();
  saveMatchState();

  return true;
}

export function resetMatch() {
  clearMatchState();

  window.location.reload();
}

export function hasActiveMatch() {
  return Boolean(state.match?.id);
}
