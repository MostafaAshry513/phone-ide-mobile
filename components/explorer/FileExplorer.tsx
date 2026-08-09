/**
 * ─── File Explorer ───
 *
 * Native FlatList-based file tree with:
 * - Directory expansion/collapse (arrow keys)
 * - File type icons
 * - Context menu (F2 rename, Delete, Duplicate)
 * - New file/folder creation
 * - Type-to-jump navigation
 */

import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import type { FileEntry } from '../../lib/filesystem';
import { THEME } from '../../lib/store';
import { fileExtensionIcon, DIR_ICON, DIR_OPEN_ICON } from '../../lib/languages';

const C = THEME.dark;

interface FileExplorerProps {
  rootPath: string;
  onFileOpen?: (path: string) => void;
  onFileSelect?: (path: string) => void;
  width?: number;
  visible?: boolean;
}

export default function FileExplorer(props: FileExplorerProps) {
  const {
    rootPath = '/storage/emulated/0',
    onFileOpen,
    onFileSelect,
    visible = true,
  } = props;

  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // TODO: Load directory contents via expo-file-system
  // TODO: Implement tree navigation (arrow keys, enter, type-to-jump)
  // TODO: Implement context menu (F2 rename, Delete, Duplicate)
  // TODO: Implement new file/folder creation dialog

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Files</Text>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => {
            // TODO: Show new file dialog
          }}
        >
          <Text style={styles.newButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.path}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.treeItem}
            onPress={() => {
              if (item.type === 'file') {
                onFileOpen?.(item.path);
              } else {
                // Toggle expand
                setExpandedDirs((prev) => {
                  const next = new Set(prev);
                  if (next.has(item.path)) next.delete(item.path);
                  else next.add(item.path);
                  return next;
                });
              }
            }}
          >
            <Text style={styles.treeIcon}>
              {item.type === 'dir'
                ? expandedDirs.has(item.path)
                  ? DIR_OPEN_ICON
                  : DIR_ICON
                : fileExtensionIcon(item.name)}
            </Text>
            <Text
              style={[
                styles.treeName,
                item.type === 'dir' && styles.treeDirName,
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {loading ? 'Loading...' : 'No files'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 180,
    backgroundColor: C.surface,
    borderRightWidth: 1,
    borderRightColor: C.border,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerText: {
    fontSize: 11,
    fontWeight: '600',
    color: C.blue,
    letterSpacing: 1.2,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  newButton: {
    padding: 2,
  },
  newButtonText: {
    fontSize: 18,
    color: C.green,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  list: {
    flex: 1,
  },
  treeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderLeftWidth: 2,
    borderLeftColor: 'transparent',
    gap: 4,
  },
  treeIcon: {
    fontSize: 12,
    width: 18,
    textAlign: 'center',
  },
  treeName: {
    fontSize: 11,
    color: C.text,
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  treeDirName: {
    color: C.blue,
  },
  emptyState: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 10,
    color: C.textFaint,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
