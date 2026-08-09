/**
 * Phone IDE — Main App
 *
 * Keyboard-first code editor for phones.
 * Cross-platform (Android + iOS) via React Native + Expo.
 */

import React, { useEffect, useCallback, useRef } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { THEME, getAppState } from '../lib/store';
import { DEFAULT_SHORTCUTS, keyEventToShortcut, type KeyBinding } from '../lib/keyboard';

// ─── Colors (dark theme default) ───
const C = THEME.dark;

export default function App() {
  const mountedRef = useRef(false);

  // ─── Keyboard shortcut handler ───
  // In React Native, physical keyboard events come through keyDown/keyUp
  // on the root view. On Android with a physical keyboard, this works natively.

  const handleKeyDown = useCallback(
    (e: any) => {
      // Extract key info from React Native key event
      const shortcut = keyEventToShortcut({
        key: e.nativeEvent?.key || e.key,
        ctrlKey: e.nativeEvent?.ctrlKey || e.ctrlKey || false,
        altKey: e.nativeEvent?.altKey || e.altKey || false,
        shiftKey: e.nativeEvent?.shiftKey || e.shiftKey || false,
        metaKey: e.nativeEvent?.metaKey || e.metaKey || false,
      });

      // Handle some shortcuts at the app level
      const app = getAppState();
      switch (shortcut) {
        case 'mod+b':
          app.toggleExplorer();
          break;
        case 'mod+k':
          app.setActivePanel(app.activePanel === 'terminal' ? 'editor' : 'terminal');
          break;
        case 'mod+shift+p':
          app.toggleCommandPalette();
          break;
        case 'mod+p':
          app.toggleSearchPanel();
          break;
        // More shortcuts will be handled by focused components
      }
    },
    []
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ─── Render ───
  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={C.deep} />
      <View style={styles.container}>
        {/* Placeholder — components will be built in next iterations */}
        <View style={styles.placeholder}>
          <Text style={styles.title}>Phone IDE</Text>
          <Text style={styles.subtitle}>Keyboard-first code editor</Text>
          <Text style={styles.status}>
            React Native scaffold ready.{'\n'}
            Components coming next.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.deep,
  },
  container: {
    flex: 1,
    backgroundColor: C.deep,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: C.accent,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  subtitle: {
    fontSize: 14,
    color: C.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  status: {
    fontSize: 11,
    color: C.textFaint,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
