import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { THEME, useAppState } from '../../lib/store';
const C = THEME;

interface Props { visible: boolean; onClose: () => void; }

export default function SnippetsPanel({ visible, onClose }: Props) {
  const snippets = useAppState((s) => s.snippets);
  const [query, setQuery] = useState('');
  const filtered = query.trim() ? snippets.filter((s) => s.label.toLowerCase().includes(query.toLowerCase())) : snippets;
  if (!visible) return null;

  return (
    <View style={styles.overlay}><TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.box}>
        <TextInput style={styles.input} placeholder="Search snippets..." placeholderTextColor={C.textFaint} value={query} onChangeText={setQuery} autoFocus keyboardAppearance="dark" />
        <FlatList data={filtered} keyExtractor={(s) => s.id} style={styles.list} keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => onClose()}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.preview} numberOfLines={1}>{item.body.substring(0, 60)}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.empty}>{query ? 'No matches' : 'No snippets'}</Text>} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, justifyContent: 'center', alignItems: 'center' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(4,6,14,0.8)' },
  box: { width: '90%', maxWidth: 400, backgroundColor: C.surface, borderRadius: 10, borderWidth: 1, borderColor: C.border, overflow: 'hidden', maxHeight: '60%' },
  input: { padding: 14, fontSize: 14, color: C.text, backgroundColor: C.overlay, borderBottomWidth: 1, borderBottomColor: C.border, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  list: { maxHeight: 340 },
  item: { paddingHorizontal: 16, paddingVertical: 9, borderLeftWidth: 3, borderLeftColor: 'transparent', borderBottomWidth: 1, borderBottomColor: 'rgba(35,41,70,0.2)' },
  label: { fontSize: 12, color: C.text, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  preview: { fontSize: 9, color: C.textFaint, backgroundColor: C.deep, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 2, marginTop: 2, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  empty: { padding: 20, textAlign: 'center', color: C.textFaint, fontSize: 11 },
});
