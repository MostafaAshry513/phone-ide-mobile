/**
 * File System Operations — expo-file-system SDK 57 (class-based API)
 * All paths are absolute file:// URIs. Fully offline.
 */
import { File, Directory, Paths } from 'expo-file-system';

// ─── Types ───

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

// ─── Helpers ───

/** Get the file's text content */
async function readText(file: File): Promise<string> {
  return file.text();
}

/** Write text to a file, creating parent directories if needed */
async function writeText(file: File, content: string): Promise<void> {
  const dir = file.parentDirectory;
  dir.create();
  const stream = file.writableStream();
  const writer = stream.getWriter();
  const enc = new TextEncoder();
  await writer.write(enc.encode(content));
  await writer.close();
}

/** Check path info */
function pathInfo(uri: string): { exists: boolean; isDirectory: boolean } {
  try {
    const info = Paths.info(uri);
    return { exists: info.exists, isDirectory: info.isDirectory === true };
  } catch { return { exists: false, isDirectory: false }; }
}

/** Convert a Directory or File to a FileEntry */
function toEntry(item: Directory | File): FileEntry {
  if (item instanceof File) {
    return {
      name: item.name,
      path: item.uri,
      type: 'file',
    };
  }
  return {
    name: item.name,
    path: item.uri,
    type: 'dir',
  };
}

// ─── Public API ───

export async function readFile(filePath: string): Promise<string> {
  const file = new File(filePath);
  return readText(file);
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  const file = new File(filePath);
  await writeText(file, content);
}

export async function listDirectory(dirPath: string): Promise<FileEntry[]> {
  const dir = new Directory(dirPath);
  const items = dir.list();
  const entries = items.map(toEntry);
  // Sort: directories first, then alphabetical
  entries.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });
  return entries;
}

export async function getInfo(filePath: string): Promise<FileEntry | null> {
  const info = pathInfo(filePath);
  if (!info.exists) return null;
  const name = filePath.split('/').pop() || '';
  return {
    name,
    path: filePath,
    type: info.isDirectory ? 'dir' : 'file',
  };
}

export async function createEntry(parentDir: string, name: string, type: 'file' | 'dir'): Promise<string> {
  const dir = new Directory(parentDir);
  dir.create(); // ensure parent exists
  if (type === 'dir') {
    const subdir = new Directory(dir, name);
    subdir.create();
    return subdir.uri;
  } else {
    const file = new File(dir, name);
    file.create();
    return file.uri;
  }
}

export async function renameEntry(oldPath: string, newName: string): Promise<string> {
  const oldFile = new File(oldPath);
  const parent = oldFile.parentDirectory;
  // expo-file-system doesn't have a direct rename, use copy + delete
  const text = await readText(oldFile);
  const newFile = new File(parent, newName);
  await writeText(newFile, text);
  oldFile.delete();
  return newFile.uri;
}

export async function deleteEntry(filePath: string): Promise<void> {
  const info = pathInfo(filePath);
  if (!info.exists) throw new Error('File not found');
  if (info.isDirectory) {
    const dir = new Directory(filePath);
    dir.delete();
  } else {
    const file = new File(filePath);
    file.delete();
  }
}

export async function duplicateFile(filePath: string): Promise<string> {
  const src = new File(filePath);
  const text = await readText(src);
  const parent = src.parentDirectory;
  const ext = src.extension || '';
  const base = src.name.replace(new RegExp(`${ext.replace('.', '\\.')}$`), '');
  // Find unique name
  let n = 1;
  let dst: File;
  do {
    const name = `${base} copy${n > 1 ? ` ${n}` : ''}${ext}`;
    dst = new File(parent, name);
    n++;
  } while (dst.exists);
  await writeText(dst, text);
  return dst.uri;
}

/** Recursively search for text in files under a directory */
export async function searchFiles(dirPath: string, query: string): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  const binaryExts = new Set([
    '.png','.jpg','.jpeg','.gif','.ico','.svg','.webp','.zip','.gz',
    '.tar','.bz2','.xz','.exe','.so','.dll','.wasm','.woff','.woff2',
    '.ttf','.eot','.mp3','.mp4','.webm','.avi','.mov','.pdf','.class',
    '.pyc','.o','.a','.db','.sqlite',
  ]);

  async function searchDir(dir: Directory, depth: number) {
    if (depth > 8 || results.length >= 100) return;
    try {
      const items = dir.list();
      for (const item of items) {
        if (results.length >= 100) break;
        if (item.name.startsWith('.') || item.name.startsWith('__')) continue;
        if (item instanceof Directory) {
          await searchDir(item, depth + 1);
        } else {
          const ext = item.extension?.toLowerCase() || '';
          if (binaryExts.has(ext)) continue;
          try {
            const text = await readText(item);
            const lines = text.split('\n');
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].toLowerCase().includes(query.toLowerCase())) {
                results.push({ file: item.uri, line: i + 1, text: lines[i].substring(0, 200) });
                if (results.length >= 100) break;
              }
            }
          } catch { /* skip unreadable */ }
        }
      }
    } catch { /* skip unreadable dirs */ }
  }

  await searchDir(new Directory(dirPath), 0);
  return results;
}

/** Get the document directory for the app */
export function getDocumentDir(): string {
  return Paths.document.uri;
}

/** Format file size */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}
