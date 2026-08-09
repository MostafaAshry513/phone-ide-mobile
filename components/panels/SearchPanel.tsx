import React from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { THEME } from '../../lib/store';
const C = THEME.dark;

interface SearchPanelProps { visible: boolean; onClose: () => void; }
export default function SearchPanel({ visible, onClose }: SearchPanelProps) {
  // TODO: Implement cross-file search with expo-file-system
  if (!visible) return null;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput style={styles.input} placeholder="Find in files..." placeholderTextColor={C.textFaint} />
        <TouchableOpacity onPress={onClose}><Text style={styles.close}>✕</Text></TouchableOpacity>
      </View>
      <FlatList data={[]} keyExtractor={(_, i) => String(i)} renderItem={() => null} style={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Type to search files</Text>} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { position:'absolute', bottom:0, left:0, right:0, backgroundColor:C.surface, borderTopWidth:2, borderTopColor:C.accent, borderTopLeftRadius:12, borderTopRightRadius:12, maxHeight:'55%', zIndex:20 },
  header: { flexDirection:'row', alignItems:'center', padding:12, gap:8, backgroundColor:C.overlay, borderBottomWidth:1, borderBottomColor:C.border },
  input: { flex:1, backgroundColor:C.deep, borderWidth:1, borderColor:C.border, color:C.text, padding:10, fontSize:13, borderRadius:6, fontFamily: Platform.OS==='ios'?'Menlo':'monospace' },
  close: { fontSize:16, color:C.textFaint, padding:4 },
  list: { flex:1 },
  empty: { padding:20, textAlign:'center', color:C.textFaint, fontSize:11 },
});
