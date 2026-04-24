import type { SaveSlot } from './types';

const SAVE_KEY_PREFIX = 'otome-save-';
const MAX_SLOTS = 30;

function slotKey(slotId: number) {
  return `${SAVE_KEY_PREFIX}${slotId}`;
}

// Compress AI history by trimming to last N messages to stay within 5MB budget
function compressHistory(
  history: SaveSlot['aiHistory'],
  maxMessages = 20
): SaveSlot['aiHistory'] {
  const system = history.filter((m) => m.role === 'system');
  const rest = history.filter((m) => m.role !== 'system').slice(-maxMessages);
  return [...system, ...rest];
}

export function saveGame(
  slotId: number,
  data: Omit<SaveSlot, 'slotId' | 'timestamp'>,
  thumbnail?: string
): void {
  const slot: SaveSlot = {
    slotId,
    timestamp: new Date().toISOString(),
    ...data,
    aiHistory: compressHistory(data.aiHistory),
    thumbnail,
  };
  try {
    localStorage.setItem(slotKey(slotId), JSON.stringify(slot));
  } catch (e) {
    // Storage quota exceeded — try trimming history further
    slot.aiHistory = compressHistory(data.aiHistory, 6);
    localStorage.setItem(slotKey(slotId), JSON.stringify(slot));
  }
}

export function loadGame(slotId: number): SaveSlot | null {
  const raw = localStorage.getItem(slotKey(slotId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SaveSlot;
  } catch {
    return null;
  }
}

export function listSaves(): SaveSlot[] {
  const saves: SaveSlot[] = [];
  for (let i = 0; i < MAX_SLOTS; i++) {
    const raw = localStorage.getItem(slotKey(i));
    if (raw) {
      try {
        saves.push(JSON.parse(raw));
      } catch {}
    }
  }
  return saves.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export function deleteSave(slotId: number): void {
  localStorage.removeItem(slotKey(slotId));
}

export function autoSave(data: Omit<SaveSlot, 'slotId' | 'timestamp'>): void {
  // Slot 0 is always auto-save
  saveGame(0, data);
}
