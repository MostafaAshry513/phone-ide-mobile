/**
 * ─── Top Bar ───
 *
 * Shows filename, mode (EDITOR/TERMINAL), file path,
 * and action buttons (Project, Git, Settings, Run).
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { THEME, useAppState, getAppState } from '../../lib/store';

const C = THEME.dark;

export default function TopBar() {
  const currentFile = useAppState((s) => s.currentFile);
  const activePanel = useAppState((s) => s.activePanel);

  const fileName = currentFile
    ? currentFile.split('/').pop() || 'untitled'
    : 'untitled';
  const displayPath = currentFile || '~';

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.fileName} numberOfLines={1}>
          {fileName}
        </Text>
        <View style={styles.modeBadge}>
          <Text style={styles.modeText}>
            {activePanel === 'terminal' ? 'TERM' : 'EDITOR'}
          </Text>
        </View>
        <Text style={styles.path} numberOfLines={1}>
          {displayPath}
        </Text>
      </View>
      <View style={styles.right}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            // TODO: Open project picker
          }}
        >
          <Text style={styles.btnText}>Project</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            getAppState().toggleGitPanel();
          }}
        >
          <Text style={styles.btnText}>Git</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            // TODO: Open settings
          }}
        >
          <Text style={styles.btnText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.runBtn}>
          <Text style={styles.runBtnText}>Run</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: C.surface,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    minHeight: 32,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
    minWidth: 0,
  },
  fileName: {
    fontSize: 12,
    fontWeight: '600',
    color: C.text,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  modeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    backgroundColor: C.green,
  },
  modeText: {
    fontSize: 7,
    fontWeight: '700',
    color: '#0a1a10',
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  path: {
    fontSize: 9,
    color: C.textDim,
    flex: 1,
    minWidth: 0,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: C.overlay,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 4,
  },
  btnText: {
    fontSize: 9,
    color: C.text,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  runBtn: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: C.green,
    borderRadius: 4,
  },
  runBtnText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#0a1a10',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
