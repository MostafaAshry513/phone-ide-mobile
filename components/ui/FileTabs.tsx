/**
 * File Tabs — horizontal scrollable tab bar for open files.
 * Keyboard: Ctrl+Tab (next), Ctrl+Shift+Tab (prev), Ctrl+W (close).
 */
import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { THEME, useAppState, useStore } from '../../lib/store';

export default function FileTabs() {
  const openTabs = useAppState((s) => s.openTabs);
  const activeTabIdx = useAppState((s) => s.activeTabIdx);
  const closeTab = useStore((s) => s.closeTab);
  const switchTab = useStore((s) => s.switchTab);
  const scrollRef = useRef<ScrollView>(null);

  // Scroll to active tab
  useEffect(() => {
    if (scrollRef.current && activeTabIdx >= 0) {
      scrollRef.current.scrollTo({ x: activeTabIdx * 100, animated: true });
    }
  }, [activeTabIdx]);

  if (openTabs.length === 0) return null;

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      style={styles.container}
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {openTabs.map((tab, idx) => {
        const isActive = idx === activeTabIdx;
        return (
          <TouchableOpacity
            key={tab.path || `untitled-${idx}`}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => switchTab(idx)}
          >
            {tab.dirty && <Text style={styles.dirtyDot}>●</Text>}
            <Text style={[styles.tabName, isActive && styles.tabNameActive]} numberOfLines={1}>
              {tab.name}
            </Text>
            <TouchableOpacity
              onPress={(e) => { e.stopPropagation(); closeTab(idx); }}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            >
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const C = THEME;
const styles = StyleSheet.create({
  container: { flexDirection: 'row', backgroundColor: C.deep, borderBottomWidth: 1, borderBottomColor: C.border, maxHeight: 28, flexGrow: 0 },
  tab: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRightWidth: 1, borderRightColor: C.border, gap: 4 },
  tabActive: { backgroundColor: C.surface },
  dirtyDot: { fontSize: 8, color: C.amber },
  tabName: { fontSize: 10, color: C.textDim, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  tabNameActive: { color: C.text, fontWeight: '500' },
  closeBtn: { fontSize: 10, color: C.textFaint },
});
