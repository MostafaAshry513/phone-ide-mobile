/**
 * Command Palette — fuzzy-searchable command picker (Ctrl+Shift+P).
 * Type to filter, arrows to select, Enter to execute, Escape to close.
 */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import { THEME, useAppState } from '../../lib/store';
import { formatShortcut } from '../../lib/keyboard';
import type { Command } from '../../lib/store';

const C = THEME;

interface Props { visible: boolean; onClose: () => void; }

export default function CommandPalette({ visible, onClose }: Props) {
  const commands = useAppState((s) => s.commands);
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<TextInput>(null);

  const filtered = query.trim()
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()) || c.id.toLowerCase().includes(query.toLowerCase()) || (c.category || '').toLowerCase().includes(query.toLowerCase()))
    : commands;

  useEffect(() => { if (visible) { setQuery(''); setSelectedIdx(0); setTimeout(() => inputRef.current?.focus(), 100); } }, [visible]);

  const execute = useCallback((cmd: Command) => { cmd.run(); onClose(); }, [onClose]);

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.box} onStartShouldSetResponder={() => true}>
          <TextInput ref={inputRef} style={styles.input} placeholder="Type a command..." placeholderTextColor={C.textFaint}
            value={query} onChangeText={(t) => { setQuery(t); setSelectedIdx(0); }} autoFocus autoCorrect={false}
            autoCapitalize="none" keyboardAppearance="dark" />
          <FlatList data={filtered.slice(0, 50)} keyExtractor={(item) => item.id} style={styles.list} keyboardShouldPersistTaps="handled"
            renderItem={({ item, index }) => (
              <TouchableOpacity style={[styles.item, index === selectedIdx && styles.itemSel]} onPress={() => execute(item)}>
                <Text style={styles.itemLabel}>{item.label}</Text>
                {item.shortcut && <Text style={styles.itemKey}>{formatShortcut(item.shortcut)}</Text>}
                {item.category && <Text style={styles.itemCat}>{item.category}</Text>}
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.empty}>{query ? 'No matches' : 'No commands'}</Text>}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(4,6,14,0.8)', alignItems: 'center', paddingTop: '15%' },
  box: { width: '90%', maxWidth: 400, backgroundColor: C.surface, borderRadius: 10, borderWidth: 1, borderColor: C.border, overflow: 'hidden', maxHeight: '60%' },
  input: { padding: 14, fontSize: 14, color: C.text, backgroundColor: C.overlay, borderBottomWidth: 1, borderBottomColor: C.border, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  list: { maxHeight: 300 },
  item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 9, borderLeftWidth: 3, borderLeftColor: 'transparent', gap: 10 },
  itemSel: { backgroundColor: C.overlay, borderLeftColor: C.accent },
  itemLabel: { fontSize: 12, color: C.text, flex: 1, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  itemKey: { fontSize: 9, color: C.textFaint, backgroundColor: C.deep, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  itemCat: { fontSize: 9, color: C.textDim, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  empty: { padding: 20, textAlign: 'center', color: C.textFaint, fontSize: 11, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
});
