/**
 * ─── Editor Component ───
 *
 * Wraps CodeMirror 6 in a React Native WebView.
 * This is the ONLY WebView in the app — everything else is native UI.
 *
 * The WebView loads a self-contained HTML page with CodeMirror bundled inline.
 * Communication happens via postMessage/onMessage bridge.
 */

import React, { useRef, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';

// WebView will be imported at runtime:
// import { WebView } from 'react-native-webview';

interface EditorProps {
  content: string;
  fileName?: string;
  readOnly?: boolean;
  onContentChange?: (content: string) => void;
  onCursorChange?: (line: number, column: number) => void;
  fontSize?: number;
}

export default function Editor(props: EditorProps) {
  const {
    content = '',
    fileName,
    readOnly = false,
    onContentChange,
    onCursorChange,
    fontSize = 12,
  } = props;

  // TODO: Implement WebView-based CodeMirror editor
  // The WebView will load a bundled HTML page containing:
  // - CodeMirror 6 core
  // - Language modes for 13+ languages
  // - One Dark theme
  // - Keyboard shortcut handling
  // - postMessage bridge for content sync

  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        {/* Placeholder — WebView editor coming soon */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1020',
  },
  placeholder: {
    flex: 1,
    margin: 4,
    borderRadius: 6,
    backgroundColor: '#131729',
    borderWidth: 1,
    borderColor: '#232946',
  },
});
