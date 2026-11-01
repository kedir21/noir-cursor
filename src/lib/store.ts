import type { MediaType, PlayerProviderId } from "../api/tmdb";
import { DEFAULT_PLAYER } from "../api/tmdb";

export type SavedItem = {
  id: number;
  type: MediaType;
  title: string;
  poster: string | null;
  backdrop: string | null;
  year: string;
  rating: number;
  season?: number;
  episode?: number;
  progress?: number;
  addedAt: number;
};

const KEYS = {
  watchlist: "noirx.watchlist",
  continue: "noirx.continue",
  history: "noirx.history",
  theme: "noirx.theme",
  player: "noirx.player",
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getWatchlist(): SavedItem[] {
  return read(KEYS.watchlist, []);
}

export function toggleWatchlist(item: SavedItem) {
  const list = getWatchlist();
  const exists = list.some((i) => i.id === item.id && i.type === item.type);
  const next = exists
    ? list.filter((i) => !(i.id === item.id && i.type === item.type))
    : [item, ...list];
  write(KEYS.watchlist, next);
  return next;
}

export function inWatchlist(id: number, type: MediaType) {
  return getWatchlist().some((i) => i.id === id && i.type === type);
}

export function getContinue(): SavedItem[] {
  return read(KEYS.continue, []);
}

export function saveContinue(item: SavedItem) {
  const list = getContinue().filter((i) => !(i.id === item.id && i.type === item.type));
  write(KEYS.continue, [item, ...list].slice(0, 24));
}

export function getHistory(): SavedItem[] {
  return read(KEYS.history, []);
}

export function saveHistory(item: SavedItem) {
  const list = getHistory().filter((i) => !(i.id === item.id && i.type === item.type));
  write(KEYS.history, [item, ...list].slice(0, 80));
}

export function clearHistory() {
  write(KEYS.history, []);
  write(KEYS.continue, []);
}

export function getPlayerProvider(): PlayerProviderId {
  const value = read<string | null>(KEYS.player, null);
  return value === "vidzee" || value === "vidy" || value === "viduki" ? value : DEFAULT_PLAYER;
}

export function setPlayerProvider(provider: PlayerProviderId) {
  write(KEYS.player, provider);
}
