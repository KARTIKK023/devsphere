import { create } from "zustand";

type AppearanceState = {
  compactSidebar: boolean;
  reduceMotion: boolean;
  setCompactSidebar: (value: boolean) => void;
  setReduceMotion: (value: boolean) => void;
};

const STORAGE_KEY = "devsphere_appearance";

type PersistedAppearance = {
  compactSidebar?: boolean;
  reduceMotion?: boolean;
};

function readPersisted(): PersistedAppearance {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      return JSON.parse(raw) as PersistedAppearance;
    }
  } catch {
    /* ignore malformed storage */
  }

  return {};
}

function writePersisted(state: PersistedAppearance) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const persisted = readPersisted();

export const useAppearanceStore = create<AppearanceState>(
  (set, get) => ({
    compactSidebar:
      persisted.compactSidebar ?? false,
    reduceMotion: persisted.reduceMotion ?? false,

    setCompactSidebar: (value) => {
      set({ compactSidebar: value });
      writePersisted({
        ...get(),
        compactSidebar: value,
      });
    },

    setReduceMotion: (value) => {
      set({ reduceMotion: value });
      writePersisted({
        ...get(),
        reduceMotion: value,
      });
    },
  })
);