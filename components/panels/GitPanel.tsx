/**
 * Git Panel — shows git status, diff, and commit UI.
 * Keyboard: Ctrl+Shift+G to toggle.
 */
import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { THEME } from '../../lib/store';
const C = THEME;

interface Props { visible: boolean; onClose: () => void; projectRoot: string; }

export default function GitPanel({ visible, onClose, projectRoot }: Props) {
  const [status, setStatus] = useState({ branch: 'main', staged: 0, unstaged: 0, ahead: 0, behind: 0, files: 0 });
  const [commitMsg, setCommitMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const refreshStatus = useCallback(async () => {
    setLoading(true);
    try { /* TODO: isomorphic-git integration */ } catch {}
    setLoading(false);
  }, []);

  const handleCommit = useCallback(async () => {
    if (!commitMsg.trim()) return;
    try { /* TODO: isomorphic-git commit */ setCommitMsg(''); }
    catch {}
  }, [commitMsg]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.branch}>branch: {status.branch}</Text>
        <TouchableOpacity onPress={onClose}><Text style={styles.closeBtn}>✕</Text></TouchableOpacity>
      </View>
      {status.files > 0 && (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>{status.staged > 0 ? `+${status.staged} staged ` : ''}{status.unstaged > 0 ? `~${status.unstaged} changed ` : ''}{status.files} files</Text>
        </View>
      )}
      {status.files === 0 && <Text style={styles.cleanText}>Working tree clean</Text>}
      <View style={styles.diffArea}>
        <Text style={styles.diffPlaceholder}>{loading ? 'Loading...' : 'Diff will appear here'}</Text>
      </View>
      <View style={styles.commitRow}>
        <TextInput style={styles.commitInput} placeholder="Commit message" placeholderTextColor={C.textFaint} value={commitMsg} onChangeText={setCommitMsg} keyboardAppearance="dark" />
        <TouchableOpacity style={[styles.commitBtn, !commitMsg.trim() && styles.commitBtnDisabled]} onPress={handleCommit} disabled={!commitMsg.trim()}>
          <Text style={styles.commitBtnText}>Commit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const C2 = THEME;
const styles = StyleSheet.create({
  container: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: C2.surface, borderTopWidth: 2, borderTopColor: C2.blue, borderTopLeftRadius: 12, borderTopRightRadius: 12, maxHeight: '60%', zIndex: 19 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: C2.border },
  branch: { fontSize: 10, color: C2.blue, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  closeBtn: { fontSize: 14, color: C2.textFaint },
  summary: { paddingHorizontal: 10, paddingVertical: 4 },
  summaryText: { fontSize: 10, color: C2.textDim, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  cleanText: { fontSize: 10, color: C2.green, padding: 10, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  diffArea: { flex: 1, padding: 8, minHeight: 80 },
  diffPlaceholder: { fontSize: 10, color: C2.textFaint, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  commitRow: { flexDirection: 'row', padding: 8, gap: 6, borderTopWidth: 1, borderTopColor: C2.border },
  commitInput: { flex: 1, backgroundColor: C2.deep, borderWidth: 1, borderColor: C2.border, color: C2.text, paddingHorizontal: 8, paddingVertical: 6, fontSize: 10, borderRadius: 4, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  commitBtn: { backgroundColor: C2.accent, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 4, justifyContent: 'center' },
  commitBtnDisabled: { opacity: 0.4 },
  commitBtnText: { fontSize: 10, color: '#fff', fontWeight: '600', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
});
