/**
 * ─── Mobile Keyboard Bar ───
 *
 * On-screen key bar for touch-only users (fallback when no physical keyboard).
 * Mirrors the web prototype's keyboard bar.
 * Auto-hides when a physical keyboard is detected.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { THEME } from '../../lib/store';

const C = THEME.dark;

interface KeyDef {
  label: string;
  key: string;
  wide?: boolean;
  arrow?: boolean;
  sep?: boolean;
}

const KEYS: KeyDef[] = [
  { label: 'Tab', key: 'Tab', wide: true },
  { label: 'Esc', key: 'Escape', wide: true },
  { label: '', key: '', sep: true },
  { label: 'Ctrl', key: 'Control' },
  { label: 'Alt', key: 'Alt' },
  { label: '', key: '', sep: true },
  { label: '▲', key: 'ArrowUp', arrow: true },
  { label: '', key: '', sep: true },
  { label: '◀', key: 'ArrowLeft', arrow: true },
  { label: '▼', key: 'ArrowDown', arrow: true },
  { label: '▶', key: 'ArrowRight', arrow: true },
  { label: '', key: '', sep: true },
  { label: 'Home', key: 'Home' },
  { label: 'End', key: 'End' },
  { label: 'PgUp', key: 'PageUp' },
  { label: 'PgDn', key: 'PageDown' },
  { label: '', key: '', sep: true },
  { label: '/', key: '/' },
  { label: '⌫', key: 'Backspace' },
  { label: 'Del', key: 'Delete' },
  { label: '', key: '', sep: true },
  { label: '↵', key: 'Enter', wide: true },
];

interface KeyboardBarProps {
  visible?: boolean;
  onKeyPress?: (key: string) => void;
}

export default function KeyboardBar({ visible = true, onKeyPress }: KeyboardBarProps) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.keysRow}
      >
        {KEYS.map((k, i) => {
          if (k.sep) {
            return <View key={`sep-${i}`} style={styles.sep} />;
          }
          return (
            <TouchableOpacity
              key={`${k.key}-${i}`}
              style={[styles.key, k.wide && styles.keyWide, k.arrow && styles.keyArrow]}
              onPress={() => onKeyPress?.(k.key)}
            >
              <Text style={styles.keyText}>{k.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: C.surface,
    borderTopWidth: 1,
    borderTopColor: C.border,
    minHeight: 30,
  },
  keysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 3,
    gap: 2,
  },
  key: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
    backgroundColor: C.overlay,
    borderWidth: 1,
    borderColor: C.border,
    minWidth: 20,
    alignItems: 'center',
  },
  keyWide: {
    minWidth: 30,
  },
  keyArrow: {
    minWidth: 18,
    paddingHorizontal: 4,
  },
  keyText: {
    fontSize: 9,
    color: C.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  sep: {
    width: 1,
    height: 14,
    backgroundColor: C.border,
    marginHorizontal: 2,
  },
});
