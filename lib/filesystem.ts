/**
 * ─── File System Operations ───
 *
 * Uses expo-file-system for all local file operations.
 * All paths are absolute on-device paths.
 * No network required — fully offline.
 */

// Placeholder until expo-file-system is installed at runtime
// In the real app, this import will be:
// import * as FS from 'expo-file-system';

export interface FileEntry {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  modified?: number;
}

export interface SearchResult {
  file: string;
  line: number;
  text: string;
}

/**
 * Read a file's content as UTF-8 string.
 */
export async function readFile(filePath: string): Promise<string> {
  // In production: return await FS.readAsStringAsync(filePath);
  throw new Error('Filesystem not available (expo-file-system not loaded)');
}

/**
 * Write content to a file. Creates parent directories if needed.
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
  // const parent = filePath.substring(0, filePath.lastIndexOf('/'));
  // await FS.makeDirectoryAsync(parent, { intermediates: true });
  // await FS.writeAsStringAsync(filePath, content);
  throw new Error('Filesystem not available');
}

/**
 * List directory contents.
 */
export async function listDirectory(dirPath: string): Promise<FileEntry[]> {
  // const items = await FS.readDirectoryAsync(dirPath);
  // return items.map(...)
  throw new Error('Filesystem not available');
}

/**
 * Get file/directory info.
 */
export async function getInfo(filePath: string): Promise<FileEntry | null> {
  // const info = await FS.getInfoAsync(filePath);
  throw new Error('Filesystem not available');
}

/**
 * Create a new file or directory.
 */
export async function createEntry(
  parentDir: string,
  name: string,
  type: 'file' | 'dir'
): Promise<string> {
  throw new Error('Filesystem not available');
}

/**
 * Rename a file or directory.
 */
export async function renameEntry(oldPath: string, newName: string): Promise<string> {
  throw new Error('Filesystem not available');
}

/**
 * Delete a file or directory.
 */
export async function deleteEntry(filePath: string): Promise<void> {
  throw new Error('Filesystem not available');
}

/**
 * Duplicate a file.
 */
export async function duplicateFile(filePath: string): Promise<string> {
  throw new Error('Filesystem not available');
}

/**
 * Search for text across files in a directory.
 */
export async function searchFiles(
  dirPath: string,
  query: string
): Promise<SearchResult[]> {
  throw new Error('Filesystem not available');
}

/**
 * Get the device's document/storage directory.
 */
export function getDocumentDir(): string {
  // In production: return FS.documentDirectory;
  return '/storage/emulated/0';
}

/**
 * Format file size for display.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
