/**
 * ─── CodeMirror Editor Languages ───
 *
 * Maps file extensions to language identifiers for the CodeMirror WebView editor.
 * Language support is provided via the WebView's loaded CodeMirror bundle.
 */

export interface LanguageInfo {
  id: string;
  name: string;
  extensions: string[];
  icon: string; // emoji
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { id: 'javascript', name: 'JavaScript', extensions: ['js', 'jsx', 'mjs', 'cjs'], icon: '🟡' },
  { id: 'typescript', name: 'TypeScript', extensions: ['ts', 'tsx', 'mts', 'cts'], icon: '🔵' },
  { id: 'python', name: 'Python', extensions: ['py', 'pyw', 'pyi'], icon: '🐍' },
  { id: 'html', name: 'HTML', extensions: ['html', 'htm', 'xhtml'], icon: '🌐' },
  { id: 'css', name: 'CSS', extensions: ['css', 'scss', 'less'], icon: '🎨' },
  { id: 'json', name: 'JSON', extensions: ['json', 'jsonc', 'json5'], icon: '📋' },
  { id: 'markdown', name: 'Markdown', extensions: ['md', 'mdx', 'markdown'], icon: '📝' },
  { id: 'cpp', name: 'C/C++', extensions: ['c', 'cpp', 'cc', 'cxx', 'h', 'hpp', 'hxx'], icon: '⚙️' },
  { id: 'go', name: 'Go', extensions: ['go'], icon: '🔷' },
  { id: 'rust', name: 'Rust', extensions: ['rs'], icon: '🦀' },
  { id: 'php', name: 'PHP', extensions: ['php', 'phtml'], icon: '🐘' },
  { id: 'sql', name: 'SQL', extensions: ['sql', 'psql'], icon: '🗄️' },
  { id: 'yaml', name: 'YAML', extensions: ['yml', 'yaml'], icon: '📄' },
  { id: 'shell', name: 'Shell', extensions: ['sh', 'bash', 'zsh', 'fish'], icon: '💻' },
  { id: 'java', name: 'Java', extensions: ['java'], icon: '☕' },
  { id: 'kotlin', name: 'Kotlin', extensions: ['kt', 'kts'], icon: '🟣' },
  { id: 'swift', name: 'Swift', extensions: ['swift'], icon: '🕊️' },
  { id: 'ruby', name: 'Ruby', extensions: ['rb'], icon: '💎' },
  { id: 'lua', name: 'Lua', extensions: ['lua'], icon: '🌙' },
  { id: 'r', name: 'R', extensions: ['r', 'R'], icon: '📊' },
  { id: 'dockerfile', name: 'Dockerfile', extensions: ['dockerfile'], icon: '🐳' },
  { id: 'toml', name: 'TOML', extensions: ['toml'], icon: '⚙️' },
];

/**
 * Detect language from file extension.
 */
export function detectLanguage(fileName: string): LanguageInfo | null {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (!ext) return null;
  return SUPPORTED_LANGUAGES.find((l) => l.extensions.includes(ext)) || null;
}

/**
 * Get icon for a file based on its extension.
 */
export function fileExtensionIcon(fileName: string): string {
  const lang = detectLanguage(fileName);
  return lang?.icon || '📄';
}

/**
 * Get icon for a directory.
 */
export const DIR_ICON = '📁';
export const DIR_OPEN_ICON = '📂';
