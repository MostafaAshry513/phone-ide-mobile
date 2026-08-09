/**
 * Phone IDE — Top Bar
 * Shows filename, mode badge, file path, and action buttons.
 * All buttons have keyboard shortcuts (not just touch targets).
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { THEME, useAppState, useStore } from '../../lib/store';

export default function TopBar() {
  const currentFile = useAppState((s) => s.currentFile);
  const activePanel = useAppState((s) => s.activePanel);
  const openTabs = useAppState((s) => s.openTabs);
  const activeTabIdx = useAppState((s) => s.activeTabIdx);
  const toggleExplorer = useStore((s) => s.toggleExplorer);
  const toggleGitPanel = useStore((s) => s.toggleGitPanel);
  const toggleCommandPalette = useStore((s) => s.toggleCommandPalette);
  const toggleTerminal = useStore((s) => s.toggleTerminal);

  const activeTab = openTabs[activeTabIdx];
  const fileName = activeTab?.name || 'untitled';
  const displayPath = currentFile || '~';
  const isTerminal = activePanel === 'terminal';

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.fileName} numberOfLines={1}>{fileName}</Text>
        <View style={[styles.modeBadge, isTerminal && styles.modeBadgeTerm]}>
          <Text style={styles.modeText}>{isTerminal ? 'TERM' : 'EDITOR'}</Text>
        </View>
        <Text style={styles.path} numberOfLines={1}>{displayPath}</Text>
      </View>
      <View style={styles.right}>
        <TouchableOpacity style={styles.btn} onPress={toggleExplorer}>
          <Text style={styles.btnText}>Files</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={toggleGitPanel}>
          <Text style={styles.btnText}>Git</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={toggleCommandPalette}>
          <Text style={styles.btnText}>Cmd</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={toggleTerminal}>
          <Text style={styles.btnText}>Term</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.runBtn}>
          <Text style={styles.runBtnText}>▶ Run</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const C = THEME;
const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 6, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border, minHeight: 32, zIndex: 20 },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8, minWidth: 0 },
  fileName: { fontSize: 12, fontWeight: '600', color: C.text, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  modeBadge: { paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8, backgroundColor: C.green },
  modeBadgeTerm: { backgroundColor: C.blue },
  modeText: { fontSize: 7, fontWeight: '700', color: '#0a1a10', letterSpacing: 0.8, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  path: { fontSize: 9, color: C.textDim, flex: 1, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  right: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  btn: { paddingHorizontal: 7, paddingVertical: 3, backgroundColor: C.overlay, borderWidth: 1, borderColor: C.border, borderRadius: 4 },
  btnText: { fontSize: 9, color: C.text, fontWeight: '500', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  runBtn: { paddingHorizontal: 10, paddingVertical: 3, backgroundColor: C.green, borderRadius: 4 },
  runBtnText: { fontSize: 9, fontWeight: '600', color: '#0a1a10', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
});
