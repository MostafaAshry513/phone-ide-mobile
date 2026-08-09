/**
 * ─── File Tabs ───
 *
 * Horizontal scrollable tab bar showing open files.
 * Keyboard: Ctrl+Tab (next), Ctrl+Shift+Tab (prev), Ctrl+W (close).
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { THEME, useAppState, getAppState } from '../../lib/store';

const C = THEME.dark;

export default function FileTabs() {
  const openTabs = useAppState((s) => s.openTabs);
  const activeTabIdx = useAppState((s) => s.activeTabIdx);

  if (openTabs.length === 0) return null;

  return (
    <ScrollView
      horizontal
      style={styles.container}
      showsHorizontalScrollIndicator={false}
    >
      {openTabs.map((tab, idx) => (
        <TouchableOpacity
          key={tab.path || `untitled-${idx}`}
          style={[styles.tab, idx === activeTabIdx && styles.tabActive]}
          onPress={() => getAppState().switchTab(idx)}
        >
          <Text style={styles.dirtyIndicator}>
            {tab.dirty ? '● ' : ''}
          </Text>
          <Text
            style={[
              styles.tabName,
              idx === activeTabIdx && styles.tabNameActive,
            ]}
            numberOfLines={1}
          >
            {tab.name}
          </Text>
          <TouchableOpacity
            onPress={() => getAppState().closeTab(idx)}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <Text style={styles.closeBtn}>✕</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: C.deep,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    maxHeight: 28,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRightWidth: 1,
    borderRightColor: C.border,
    gap: 4,
  },
  tabActive: {
    backgroundColor: C.surface,
  },
  dirtyIndicator: {
    fontSize: 8,
    color: C.textDim,
  },
  tabName: {
    fontSize: 10,
    color: C.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  tabNameActive: {
    color: C.text,
    fontWeight: '500',
  },
  closeBtn: {
    fontSize: 10,
    color: C.textFaint,
  },
});
