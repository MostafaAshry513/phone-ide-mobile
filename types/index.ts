/**
 * ─── Shared Types ───
 */

export type Theme = typeof import('../lib/store').THEME;

export type PlatformOS = 'android' | 'ios' | 'web';

export interface EditorPosition {
  line: number;
  column: number;
}

export interface EditorSelection {
  start: EditorPosition;
  end: EditorPosition;
}

export interface GitStatus {
  branch: string;
  staged: number;
  unstaged: number;
  ahead: number;
  behind: number;
  files: number;
}

export interface GitDiff {
  staged: string;
  unstaged: string;
  log: string[];
}

export interface LintError {
  line: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface SystemResources {
  cpu: {
    percent: number;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    percent: number;
  };
}

export type { FileEntry, SearchResult } from '../lib/filesystem';
export type { LanguageInfo } from '../lib/languages';
export type { KeyBinding } from '../lib/keyboard';
export type {
  FileTab,
  Settings,
  PanelId,
  Command,
  Snippet,
} from '../lib/store';
