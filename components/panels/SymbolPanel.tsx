import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { THEME } from '../../lib/store';
const C = THEME;

interface Props { visible: boolean; onClose: () => void; }

export default function SymbolPanel({ visible, onClose }: Props) {
  if (!visible) return null;
  return (
    <View style={styles.overlay}><TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.box}>
        <Text style={styles.title}>Symbols in file</Text>
        <FlatList data={[]} keyExtractor={(_, i) => String(i)} renderItem={() => null}
          ListEmptyComponent={<Text style={styles.empty}>No symbols found</Text>} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, justifyContent: 'center', alignItems: 'center' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(4,6,14,0.8)' },
  box: { width: '90%', maxWidth: 380, backgroundColor: C.surface, borderRadius: 10, borderWidth: 1, borderColor: C.border, overflow: 'hidden', maxHeight: '60%' },
  title: { padding: 14, fontSize: 12, color: C.text, fontWeight: '600', borderBottomWidth: 1, borderBottomColor: C.border, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  empty: { padding: 20, textAlign: 'center', color: C.textFaint, fontSize: 11 },
});
