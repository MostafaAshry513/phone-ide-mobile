/**
 * Phone IDE — Zustand State Management
 *
 * Production-ready state store with AsyncStorage persistence.
 * Uses zustand v5 with persist middleware.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FileTab {
  path: string | null;
  name: string;
  dirty: boolean;
  content?: string; // in-memory file content cache (not persisted)
}

export interface Settings {
  fontSize: number;
  termFontSize: number;
  tabSize: number;
  useTabs: boolean;
  wordWrap: boolean;
  lineNumbers: boolean;
  theme: 'dark' | 'light';
}

/** Panel identifiers for navigation (kept for backward compat). */
export type PanelId =
  | 'editor'
  | 'files'
  | 'terminal'
  | 'search'
  | 'git'
  | 'problems'
  | 'snippets'
  | 'symbols';

export interface Command {
  id: string;
  label: string;
  shortcut?: string;
  category?: string;
  run: () => void;
}

export interface Snippet {
  id: string;
  label: string;
  body: string;
  language?: string;
  description?: string;
}

export interface SystemResources {
  cpu: { percent: number };
  memory: { percent: number; used: number; total: number; free: number };
}

export type ActivePanel = 'editor' | 'terminal';

// ─── Store State & Actions ────────────────────────────────────────────────────

interface AppState {
  // Editor tabs
  openTabs: FileTab[];
  activeTabIdx: number;
  currentFile: string | null;
  recentFiles: string[];

  // Explorer
  explorerOpen: boolean;
  currentDir: string;
  projectRoot: string;

  // Main panel
  activePanel: ActivePanel;

  // UI panels
  commandPaletteOpen: boolean;
  searchPanelOpen: boolean;
  gitPanelOpen: boolean;
  problemsPanelOpen: boolean;
  findBarOpen: boolean;

  // Settings
  settings: Settings;

  // Terminal
  terminalVisible: boolean;

  // Registries
  commands: Command[];
  snippets: Snippet[];

  // System
  systemResources: SystemResources;

  // ── Actions ──
  openFile: (path: string, content?: string) => void;
  closeTab: (idx: number) => void;
  switchTab: (idx: number) => void;
  reopenClosedTab: () => void;
  markTabDirty: (idx: number, dirty: boolean) => void;
  updateTabContent: (idx: number, content: string) => void;
  toggleExplorer: () => void;
  setCurrentDir: (dir: string) => void;
  setActivePanel: (panel: ActivePanel) => void;
  toggleCommandPalette: () => void;
  toggleSearchPanel: () => void;
  toggleGitPanel: () => void;
  toggleProblemsPanel: () => void;
  toggleFindBar: () => void;
  toggleTerminal: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
  registerCommand: (cmd: Command) => void;
  registerSnippet: (snip: Snippet) => void;
  addRecentFile: (path: string) => void;
  updateSystemResources: (resources: SystemResources) => void;
}

// ─── Default Settings ─────────────────────────────────────────────────────────

export const DEFAULT_SETTINGS: Settings = {
  fontSize: 12,
  termFontSize: 12,
  tabSize: 4,
  useTabs: false,
  wordWrap: true,
  lineNumbers: true,
  theme: 'dark',
};

// ─── Dark Theme Colors ────────────────────────────────────────────────────────

export const THEME = {
  deep: '#080b16',
  base: '#0d1020',
  surface: '#131729',
  overlay: '#1a1f35',
  border: '#232946',
  borderGlow: '#2e3560',
  text: '#c8d0e7',
  textDim: '#6b7298',
  textFaint: '#434b6b',
  accent: '#7c5cfc',
  accentGlow: '#9d7cfc',
  blue: '#5d9cf5',
  green: '#73d68b',
  amber: '#f0b656',
  red: '#f4737b',
  pink: '#d57bba',
  cyan: '#5cd6d0',
} as const;

export type ThemeColors = typeof THEME;

// ─── Initial State Factory ────────────────────────────────────────────────────

const initialState = {
  openTabs: [] as FileTab[],
  activeTabIdx: -1,
  currentFile: null as string | null,
  recentFiles: [] as string[],

  explorerOpen: false,
  currentDir: '/storage/emulated/0',
  projectRoot: '/storage/emulated/0',

  activePanel: 'editor' as ActivePanel,

  commandPaletteOpen: false,
  searchPanelOpen: false,
  gitPanelOpen: false,
  problemsPanelOpen: false,
  findBarOpen: false,

  settings: { ...DEFAULT_SETTINGS } as Settings,

  terminalVisible: false,

  commands: [] as Command[],
  snippets: [] as Snippet[],

  systemResources: {
    cpu: { percent: 0 },
    memory: { percent: 0, used: 0, total: 0, free: 0 },
  } as SystemResources,
};

// ─── Recent Files Limit ───────────────────────────────────────────────────────

const MAX_RECENT_FILES = 10;

// ─── Persistent Fields (selective persistence) ────────────────────────────────

/**
 * Only persist user data that survives app restarts.
 * Transient UI state (panel visibility, palette open, etc.) and
 * non-serializable data (commands with `run` functions, tab content cache)
 * are excluded.
 */
const persistFields = (state: AppState) => ({
  openTabs: state.openTabs.map(({ content, ...tab }) => tab), // strip content cache
  recentFiles: state.recentFiles,
  currentDir: state.currentDir,
  projectRoot: state.projectRoot,
  settings: state.settings,
  snippets: state.snippets,
});

// ─── Store ────────────────────────────────────────────────────────────────────

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ── Editor Actions ──────────────────────────────────────────────────

      openFile: (path: string, content?: string) => {
        const { openTabs } = get();
        const existingIdx = openTabs.findIndex((t) => t.path === path);

        if (existingIdx >= 0) {
          // File already open — switch to its tab and optionally update content
          set({
            activeTabIdx: existingIdx,
            currentFile: path,
            ...(content !== undefined
              ? {
                  openTabs: openTabs.map((t, i) =>
                    i === existingIdx ? { ...t, content } : t,
                  ),
                }
              : {}),
          });
          return;
        }

        // New tab
        const name = path.split('/').pop() || 'untitled';
        const newTab: FileTab = { path, name, dirty: false, content };
        set({
          openTabs: [...openTabs, newTab],
          activeTabIdx: openTabs.length,
          currentFile: path,
        });
      },

      closeTab: (idx: number) => {
        const { openTabs, activeTabIdx, recentFiles } = get();
        if (openTabs.length === 0 || idx < 0 || idx >= openTabs.length) return;

        const closed = openTabs[idx];
        const newTabs = openTabs.filter((_, i) => i !== idx);

        // Push closed file to front of recentFiles (deduplicated, capped)
        const newRecent =
          closed.path != null
            ? [closed.path, ...recentFiles.filter((f) => f !== closed.path)].slice(
                0,
                MAX_RECENT_FILES,
              )
            : recentFiles;

        // Adjust active tab index
        let newIdx = activeTabIdx;
        if (idx < activeTabIdx) {
          newIdx--;
        }
        if (newIdx >= newTabs.length) {
          newIdx = newTabs.length - 1;
        }

        set({
          openTabs: newTabs,
          activeTabIdx: newIdx,
          recentFiles: newRecent,
          currentFile: newTabs.length > 0 ? newTabs[Math.max(0, newIdx)].path : null,
        });
      },

      switchTab: (idx: number) => {
        const { openTabs } = get();
        if (idx >= 0 && idx < openTabs.length) {
          const tab = openTabs[idx];
          set({ activeTabIdx: idx, currentFile: tab.path });
        }
      },

      reopenClosedTab: () => {
        const { recentFiles } = get();
        if (recentFiles.length > 0) {
          get().openFile(recentFiles[0]);
        }
      },

      markTabDirty: (idx: number, dirty: boolean) => {
        const { openTabs } = get();
        if (idx < 0 || idx >= openTabs.length) return;
        set({
          openTabs: openTabs.map((t, i) => (i === idx ? { ...t, dirty } : t)),
        });
      },

      updateTabContent: (idx: number, content: string) => {
        const { openTabs } = get();
        if (idx < 0 || idx >= openTabs.length) return;
        set({
          openTabs: openTabs.map((t, i) => (i === idx ? { ...t, content } : t)),
        });
      },

      // ── Explorer Actions ────────────────────────────────────────────────

      toggleExplorer: () => set((s) => ({ explorerOpen: !s.explorerOpen })),

      setCurrentDir: (dir: string) => set({ currentDir: dir }),

      // ── Panel Actions ───────────────────────────────────────────────────

      setActivePanel: (panel: ActivePanel) => set({ activePanel: panel }),

      toggleCommandPalette: () =>
        set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),

      toggleSearchPanel: () =>
        set((s) => ({ searchPanelOpen: !s.searchPanelOpen })),

      toggleGitPanel: () => set((s) => ({ gitPanelOpen: !s.gitPanelOpen })),

      toggleProblemsPanel: () =>
        set((s) => ({ problemsPanelOpen: !s.problemsPanelOpen })),

      toggleFindBar: () => set((s) => ({ findBarOpen: !s.findBarOpen })),

      toggleTerminal: () =>
        set((s) => ({
          activePanel: s.activePanel === 'terminal' ? 'editor' : 'terminal',
          terminalVisible: !s.terminalVisible,
        })),

      // ── Settings Actions ────────────────────────────────────────────────

      updateSettings: (patch: Partial<Settings>) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),

      // ── Registry Actions ────────────────────────────────────────────────

      registerCommand: (cmd: Command) => {
        const { commands } = get();
        if (!commands.find((c) => c.id === cmd.id)) {
          set({ commands: [...commands, cmd] });
        }
      },

      registerSnippet: (snip: Snippet) => {
        const { snippets } = get();
        if (!snippets.find((s) => s.id === snip.id)) {
          set({ snippets: [...snippets, snip] });
        }
      },

      // ── File Actions ────────────────────────────────────────────────────

      addRecentFile: (path: string) => {
        const { recentFiles } = get();
        const deduped = recentFiles.filter((f) => f !== path);
        set({ recentFiles: [path, ...deduped].slice(0, MAX_RECENT_FILES) });
      },

      // ── System Actions ──────────────────────────────────────────────────

      updateSystemResources: (resources: SystemResources) =>
        set({ systemResources: resources }),
    }),
    {
      name: 'phone-ide-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: persistFields,
      // Hydration happens asynchronously; components should handle the initial
      // render gracefully before persisted state is restored.
    },
  ),
);

// ─── Typed Selector Hook ──────────────────────────────────────────────────────

/** Typed hook for selecting slices of AppState. */
export function useAppState<T>(selector: (state: AppState) => T): T {
  return useStore(selector);
}

// ─── Imperative Getter (for non-React contexts) ───────────────────────────────

/** Get the current store snapshot outside of React. */
export function getAppState(): AppState {
  return useStore.getState();
}

// ─── Re-exports for convenience ───────────────────────────────────────────────

export { useStore as appStore };
