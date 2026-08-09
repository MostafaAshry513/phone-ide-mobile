import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { THEME } from '../../lib/store';
import * as FS from '../../lib/filesystem';
const C = THEME;

interface Props { visible: boolean; onClose: () => void; }

export default function SearchPanel({ visible, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FS.SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    try { const r = await FS.searchFiles('/storage/emulated/0', q); setResults(r); setSelectedIdx(0); }
    catch { setResults([]); } setLoading(false);
  }, []);

  const handleQuery = useCallback((q: string) => { setQuery(q); doSearch(q); }, [doSearch]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput style={styles.input} placeholder="Find in files..." placeholderTextColor={C.textFaint} value={query} onChangeText={handleQuery} autoFocus keyboardAppearance="dark" />
        <TouchableOpacity onPress={onClose}><Text style={styles.close}>✕</Text></TouchableOpacity>
      </View>
      <FlatList data={results} keyExtractor={(_, i) => String(i)} style={styles.list} keyboardShouldPersistTaps="handled"
        renderItem={({ item, index }) => (
          <TouchableOpacity style={[styles.item, index === selectedIdx && styles.itemSel]}>
            <Text style={styles.file} numberOfLines={1}>{item.file.split('/').pop()}</Text>
            <Text style={styles.lineNum}>{item.line}</Text>
            <Text style={styles.text} numberOfLines={1}>{item.text}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>{loading ? 'Searching...' : query.length < 2 ? 'Type to search' : 'No results'}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: C.surface, borderTopWidth: 2, borderTopColor: C.accent, borderTopLeftRadius: 12, borderTopRightRadius: 12, maxHeight: '55%', zIndex: 20 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8, backgroundColor: C.overlay, borderBottomWidth: 1, borderBottomColor: C.border },
  input: { flex: 1, backgroundColor: C.deep, borderWidth: 1, borderColor: C.border, color: C.text, padding: 10, fontSize: 13, borderRadius: 6, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  close: { fontSize: 16, color: C.textFaint, padding: 4 },
  list: { flex: 1 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(35,41,70,0.3)', borderLeftWidth: 3, borderLeftColor: 'transparent', gap: 4 },
  itemSel: { backgroundColor: C.overlay, borderLeftColor: C.accent },
  file: { fontSize: 9, color: C.blue, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  lineNum: { fontSize: 9, color: C.textFaint, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  text: { fontSize: 10, color: C.textDim, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  empty: { padding: 20, textAlign: 'center', color: C.textFaint, fontSize: 11, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
});
