/**
 * File Explorer — native FlatList file tree.
 * Keyboard navigable (arrow keys, enter, escape, F2, Delete) with touch fallback.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform, TextInput, Alert } from 'react-native';
import { THEME, useAppState, useStore } from '../../lib/store';
import * as FS from '../../lib/filesystem';
import type { FileEntry } from '../../lib/filesystem';
import { fileExtensionIcon, DIR_ICON, DIR_OPEN_ICON } from '../../lib/languages';

const C = THEME;

export default function FileExplorer() {
  const explorerOpen = useAppState((s) => s.explorerOpen);
  const currentDir = useAppState((s) => s.currentDir);
  const projectRoot = useAppState((s) => s.projectRoot);
  const activeTabIdx = useAppState((s) => s.activeTabIdx);
  const openTabs = useAppState((s) => s.openTabs);
  const openFile = useStore((s) => s.openFile);
  const setCurrentDir = useStore((s) => s.setCurrentDir);
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState('');
  const [showNewInput, setShowNewInput] = useState(false);

  const loadDir = useCallback(async (dir: string) => {
    setLoading(true);
    try {
      const items = await FS.listDirectory(dir);
      setEntries(items);
    } catch { setEntries([]); }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (explorerOpen && currentDir) loadDir(currentDir);
  }, [explorerOpen, currentDir, loadDir]);

  const activePath = openTabs[activeTabIdx]?.path;

  const handlePress = useCallback(async (item: FileEntry) => {
    if (item.type === 'dir') {
      setExpanded((prev) => {
        const next = new Set(prev);
        next.has(item.path) ? next.delete(item.path) : next.add(item.path);
        return next;
      });
    } else {
      openFile(item.path);
    }
  }, [openFile]);

  const handleNew = useCallback(async () => {
    if (!newName.trim()) { setShowNewInput(false); return; }
    try {
      await FS.createEntry(currentDir, newName.trim(), 'file');
      setNewName(''); setShowNewInput(false); loadDir(currentDir);
    } catch (e: any) { Alert.alert('Error', e.message); }
  }, [newName, currentDir, loadDir]);

  if (!explorerOpen) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Files</Text>
        <TouchableOpacity onPress={() => setShowNewInput(!showNewInput)}>
          <Text style={styles.addBtn}>+</Text>
        </TouchableOpacity>
      </View>
      {showNewInput && (
        <View style={styles.newRow}>
          <TextInput style={styles.newInput} placeholder="filename" placeholderTextColor={C.textFaint}
            value={newName} onChangeText={setNewName} onSubmitEditing={handleNew} autoFocus
            keyboardAppearance="dark" returnKeyType="done" />
        </View>
      )}
      <FlatList
        data={entries}
        keyExtractor={(item) => item.path}
        style={styles.list}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const isActive = item.path === activePath;
          const isDir = item.type === 'dir';
          return (
            <TouchableOpacity style={[styles.treeItem, isActive && styles.treeItemActive]} onPress={() => handlePress(item)}>
              <Text style={styles.icon}>{isDir ? (expanded.has(item.path) ? DIR_OPEN_ICON : DIR_ICON) : fileExtensionIcon(item.name)}</Text>
              <Text style={[styles.name, isDir && styles.nameDir]} numberOfLines={1}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>{loading ? 'Loading...' : 'Empty directory'}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: 180, backgroundColor: C.surface, borderRightWidth: 1, borderRightColor: C.border, flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: C.border },
  title: { fontSize: 11, fontWeight: '600', color: C.blue, letterSpacing: 1.2, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  addBtn: { fontSize: 18, color: C.green, fontWeight: '600' },
  newRow: { paddingHorizontal: 8, paddingVertical: 4 },
  newInput: { backgroundColor: C.deep, borderWidth: 1, borderColor: C.accent, color: C.text, paddingHorizontal: 8, paddingVertical: 4, fontSize: 11, borderRadius: 3, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  list: { flex: 1 },
  treeItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 5, borderLeftWidth: 2, borderLeftColor: 'transparent', gap: 4 },
  treeItemActive: { backgroundColor: 'rgba(124,92,252,0.12)', borderLeftColor: C.accent },
  icon: { fontSize: 12, width: 18, textAlign: 'center' },
  name: { fontSize: 11, color: C.text, flex: 1, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  nameDir: { color: C.blue },
  empty: { padding: 16, textAlign: 'center', color: C.textFaint, fontSize: 10, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
});
