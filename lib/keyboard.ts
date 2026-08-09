/**
 * ─── Keyboard Shortcut Registry ───
 *
 * Every feature in Phone IDE is accessible via keyboard shortcut.
 * This is the central registry — touch is a fallback, not primary.
 *
 * Shortcuts use a modifier-key format:
 *   mod = Ctrl on Android/Linux/Windows, Cmd on iOS/macOS
 */

export interface KeyBinding {
  id: string;
  keys: string; // e.g. "mod+s", "mod+shift+p"
  description: string;
  category: string;
  action: () => void;
}

// Convert a shortcut string like "mod+s" to display-friendly text
export function formatShortcut(keys: string): string {
  return keys
    .replace(/mod/g, 'Ctrl')
    .replace(/shift/g, '⇧')
    .replace(/alt/g, 'Alt')
    .replace(/\+/g, '+')
    .replace(/enter/i, '↵')
    .replace(/escape/i, 'Esc')
    .replace(/arrowup/i, '↑')
    .replace(/arrowdown/i, '↓')
    .replace(/arrowleft/i, '←')
    .replace(/arrowright/i, '→')
    .replace(/tab/i, 'Tab')
    .replace(/backspace/i, '⌫')
    .replace(/delete/i, 'Del')
    .replace(/home/i, 'Home')
    .replace(/end/i, 'End');
}

// Parse a key event to a shortcut string
export function keyEventToShortcut(e: {
  key: string;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
}): string {
  const parts: string[] = [];
  if (e.ctrlKey || e.metaKey) parts.push('mod');
  if (e.altKey) parts.push('alt');
  if (e.shiftKey) parts.push('shift');
  let key = e.key;
  if (key.length === 1) key = key.toLowerCase();
  parts.push(key);
  return parts.join('+');
}

// Default keyboard shortcuts — all the bindings from the web prototype
export const DEFAULT_SHORTCUTS: Omit<KeyBinding, 'action'>[] = [
  // Editing
  { id: 'save', keys: 'mod+s', description: 'Save file', category: 'Editing' },
  { id: 'undo', keys: 'mod+z', description: 'Undo', category: 'Editing' },
  { id: 'redo', keys: 'mod+y', description: 'Redo', category: 'Editing' },
  { id: 'toggle-comment', keys: 'mod+/', description: 'Toggle comment', category: 'Editing' },
  { id: 'duplicate-line', keys: 'mod+d', description: 'Duplicate line', category: 'Editing' },
  { id: 'move-line-up', keys: 'alt+arrowup', description: 'Move line up', category: 'Editing' },
  { id: 'move-line-down', keys: 'alt+arrowdown', description: 'Move line down', category: 'Editing' },
  { id: 'delete-line', keys: 'mod+shift+k', description: 'Delete line', category: 'Editing' },
  { id: 'insert-line-below', keys: 'mod+enter', description: 'Insert line below', category: 'Editing' },
  { id: 'insert-line-above', keys: 'mod+shift+enter', description: 'Insert line above', category: 'Editing' },
  { id: 'indent', keys: 'mod+]', description: 'Indent', category: 'Editing' },
  { id: 'outdent', keys: 'mod+[', description: 'Outdent', category: 'Editing' },
  { id: 'select-all', keys: 'mod+a', description: 'Select all', category: 'Editing' },

  // Navigation
  { id: 'quick-open', keys: 'mod+o', description: 'Quick open file', category: 'Navigation' },
  { id: 'toggle-explorer', keys: 'mod+b', description: 'Toggle explorer', category: 'Navigation' },
  { id: 'toggle-terminal', keys: 'mod+k', description: 'Toggle terminal', category: 'Navigation' },
  { id: 'search-files', keys: 'mod+p', description: 'Search files', category: 'Navigation' },
  { id: 'find', keys: 'mod+f', description: 'Find in file', category: 'Navigation' },
  { id: 'toggle-replace', keys: 'mod+h', description: 'Toggle replace', category: 'Navigation' },
  { id: 'go-to-line', keys: 'mod+g', description: 'Go to line', category: 'Navigation' },
  { id: 'command-palette', keys: 'mod+shift+p', description: 'Command palette', category: 'Navigation' },

  // Tabs
  { id: 'new-file', keys: 'mod+n', description: 'New file', category: 'Tabs' },
  { id: 'close-tab', keys: 'mod+w', description: 'Close tab', category: 'Tabs' },
  { id: 'next-tab', keys: 'mod+tab', description: 'Next tab', category: 'Tabs' },
  { id: 'prev-tab', keys: 'mod+shift+tab', description: 'Previous tab', category: 'Tabs' },
  { id: 'reopen-tab', keys: 'mod+shift+t', description: 'Reopen closed tab', category: 'Tabs' },

  // View
  { id: 'zoom-in', keys: 'mod+=', description: 'Zoom in', category: 'View' },
  { id: 'zoom-out', keys: 'mod+-', description: 'Zoom out', category: 'View' },
  { id: 'zoom-reset', keys: 'mod+0', description: 'Reset zoom', category: 'View' },
  { id: 'shortcut-help', keys: 'f1', description: 'Shortcut help', category: 'View' },

  // Panels
  { id: 'git-panel', keys: 'mod+shift+g', description: 'Git panel', category: 'Panels' },
  { id: 'problems-panel', keys: 'mod+shift+m', description: 'Problems panel', category: 'Panels' },
  { id: 'snippets', keys: 'mod+shift+i', description: 'Insert snippet', category: 'Coding' },
  { id: 'go-to-symbol', keys: 'mod+shift+o', description: 'Go to symbol', category: 'Coding' },

  // Misc
  { id: 'run', keys: 'f5', description: 'Run current file', category: 'Run' },
  { id: 'escape', keys: 'escape', description: 'Close active panel', category: 'Navigation' },
];

// Keyboard categories for display in settings
export const KEYBOARD_CATEGORIES = [
  'Editing',
  'Navigation',
  'Tabs',
  'View',
  'Panels',
  'Coding',
  'Run',
] as const;
