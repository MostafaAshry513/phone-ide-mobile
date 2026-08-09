/**
 * ─── Command Palette ───
 *
 * Fuzzy-searchable command picker (Ctrl+Shift+P).
 * Lists all registered commands and keyboard shortcuts.
 * Keyboard navigable — type to filter, arrows to select, enter to execute.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
  Keyboard,
} from 'react-native';
import { THEME, getAppState, useAppState } from '../../lib/store';
import { formatShortcut } from '../../lib/keyboard';
import type { Command } from '../../lib/store';

const C = THEME.dark;

interface CommandPaletteProps {
  visible: boolean;
  onClose: () => void;
}

export default function CommandPalette({ visible, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<TextInput>(null);
  const commands = useAppState((s) => s.commands);

  const filtered = query.trim()
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.category?.toLowerCase().includes(query.toLowerCase()) ||
          c.id.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  useEffect(() => {
    if (visible) {
      setQuery('');
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [visible]);

  const execute = useCallback(
    (cmd: Command) => {
      cmd.run();
      onClose();
    },
    [onClose]
  );

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.box} onStartShouldSetResponder={() => true}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Type a command..."
            placeholderTextColor={C.textFaint}
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              setSelectedIdx(0);
            }}
            autoFocus
            autoCorrect={false}
            autoCapitalize="none"
            autoComplete="off"
            keyboardAppearance="dark"
          />
          <FlatList
            data={filtered.slice(0, 50)}
            keyExtractor={(item) => item.id}
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.item,
                  index === selectedIdx && styles.itemSelected,
                ]}
                onPress={() => execute(item)}
              >
                <Text style={styles.itemLabel}>{item.label}</Text>
                {item.shortcut && (
                  <Text style={styles.itemShortcut}>
                    {formatShortcut(item.shortcut)}
                  </Text>
                )}
                {item.category && (
                  <Text style={styles.itemCategory}>{item.category}</Text>
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>
                  {query.trim() ? 'No matching commands' : 'No commands registered'}
                </Text>
              </View>
            }
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 6, 14, 0.8)',
    alignItems: 'center',
    paddingTop: '15%',
  },
  box: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: C.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    maxHeight: '60%',
  },
  input: {
    padding: 14,
    fontSize: 14,
    color: C.text,
    backgroundColor: C.overlay,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  list: {
    maxHeight: 300,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
    gap: 10,
  },
  itemSelected: {
    backgroundColor: C.overlay,
    borderLeftColor: C.accent,
  },
  itemLabel: {
    fontSize: 12,
    color: C.text,
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  itemShortcut: {
    fontSize: 9,
    color: C.textFaint,
    backgroundColor: C.deep,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  itemCategory: {
    fontSize: 9,
    color: C.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  empty: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 11,
    color: C.textFaint,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
