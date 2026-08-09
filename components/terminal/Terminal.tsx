/**
 * ─── Terminal Component ───
 *
 * Embedded terminal emulator.
 * On Android, this connects to a local shell via PTY.
 * Implementation TBD — options include:
 * - Custom native module wrapping libvterm
 * - Expo-dev-client with a native terminal package
 * - Fallback: WebView-based xterm.js (like the web prototype)
 *
 * Keyboard: Ctrl+K to toggle, Alt+1-9 to switch tabs.
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { THEME } from '../../lib/store';

const C = THEME.dark;

interface TerminalProps {
  visible: boolean;
  onClose: () => void;
}

export default function Terminal({ visible, onClose }: TerminalProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState([{ id: 0, name: 'bash' }]);
  const [output, setOutput] = useState<string[]>(['Phone IDE Terminal', 'Type commands here...', '']);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Terminal tabs */}
      <ScrollView
        horizontal
        style={styles.tabBar}
        showsHorizontalScrollIndicator={false}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, tab.id === activeTab && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                tab.id === activeTab && styles.tabTextActive,
              ]}
            >
              {tab.name}
            </Text>
            <TouchableOpacity
              onPress={() => {
                // Close tab
              }}
            >
              <Text style={styles.tabClose}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.tab, styles.tabNew]}
          onPress={() => {
            const id = tabs.length;
            setTabs([...tabs, { id, name: `bash ${id}` }]);
            setActiveTab(id);
          }}
        >
          <Text style={styles.tabNewText}>+</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Terminal output area */}
      <View style={styles.terminalArea}>
        <ScrollView style={styles.outputScroll} ref={(ref) => { /* scroll to bottom */ }}>
          {output.map((line, i) => (
            <Text key={i} style={styles.outputLine}>
              {line || ' '}
            </Text>
          ))}
          {/* Cursor line */}
          <View style={styles.cursorLine}>
            <Text style={styles.prompt}>$ </Text>
            <View style={styles.cursor} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.deep,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    paddingHorizontal: 4,
    paddingTop: 4,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    flexGrow: 0,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: C.deep,
    borderWidth: 1,
    borderColor: C.border,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginRight: 2,
    gap: 6,
  },
  tabActive: {
    backgroundColor: C.base,
    borderColor: C.accent,
  },
  tabText: {
    fontSize: 10,
    color: C.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  tabTextActive: {
    color: C.accent,
    fontWeight: '500',
  },
  tabClose: {
    fontSize: 10,
    color: C.textFaint,
  },
  tabNew: {
    borderStyle: 'dashed',
  },
  tabNewText: {
    fontSize: 16,
    color: C.green,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  terminalArea: {
    flex: 1,
    padding: 8,
  },
  outputScroll: {
    flex: 1,
  },
  outputLine: {
    fontSize: 12,
    color: C.text,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 18,
  },
  cursorLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prompt: {
    fontSize: 12,
    color: C.green,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  cursor: {
    width: 8,
    height: 14,
    backgroundColor: C.accent,
    marginLeft: 2,
  },
});
