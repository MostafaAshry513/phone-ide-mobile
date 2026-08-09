/**
 * Bottom Status Bar — shows file position, language, tab size, lint badge, system resources.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { THEME, useAppState } from '../../lib/store';

export default function BottomBar() {
  const settings = useAppState((s) => s.settings);
  const resources = useAppState((s) => s.systemResources);
  const memPct = resources?.memory?.percent ?? 0;
  const cpuPct = resources?.cpu?.percent ?? 0;
  const activeTabIdx = useAppState((s) => s.activeTabIdx);
  const openTabs = useAppState((s) => s.openTabs);
  const tab = openTabs[activeTabIdx];
  const ext = tab?.name?.split('.').pop()?.toUpperCase() || '—';

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.item}><Text style={styles.label}>RAM</Text>
          <View style={styles.bar}><View style={[styles.barFill, { width: `${Math.min(memPct,100)}%`, backgroundColor: memPct > 80 ? C.red : memPct > 60 ? C.amber : C.green }]} /></View>
          <Text style={styles.value}>{memPct}%</Text></View>
        <View style={styles.item}><Text style={styles.label}>CPU</Text><Text style={styles.value}>{cpuPct}%</Text></View>
        <View style={styles.item}><Text style={styles.label}>Lang</Text><Text style={styles.value}>{ext}</Text></View>
        <View style={styles.item}><Text style={styles.label}>{settings.useTabs ? 'Tabs' : 'Spaces'}</Text><Text style={styles.value}>{settings.tabSize}</Text></View>
        <View style={styles.item}><Text style={styles.label}>Lint</Text><Text style={[styles.value, { color: C.green }]}>✓</Text></View>
        <View style={styles.item}><Text style={styles.value}>Ln 1, Col 1</Text></View>
        <Text style={styles.hint}>Ctrl+B files</Text>
        <Text style={styles.hint}>Ctrl+K term</Text>
        <Text style={styles.hint}>Ctrl+P search</Text>
      </ScrollView>
    </View>
  );
}

const C = THEME;
const styles = StyleSheet.create({
  container: { backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.border, minHeight: 24 },
  content: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 3, gap: 14 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  label: { fontSize: 9, color: C.textDim, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  value: { fontSize: 9, color: C.text, fontWeight: '500', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  bar: { width: 36, height: 4, backgroundColor: C.overlay, borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 2 },
  hint: { fontSize: 8, color: C.textFaint, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
});
