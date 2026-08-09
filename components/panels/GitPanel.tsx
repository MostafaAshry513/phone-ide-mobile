/**
 * ─── Git Panel ───
 *
 * Shows git status, diff, and commit UI.
 * Uses isomorphic-git for all git operations — no native git binary needed.
 * Keyboard: Ctrl+Shift+G to toggle.
 */

import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { THEME } from '../../lib/store';
import type { GitStatus, GitDiff } from '../../types';

const C = THEME.dark;

interface GitPanelProps {
  visible: boolean;
  onClose: () => void;
  projectRoot: string;
}

export default function GitPanel({ visible, onClose, projectRoot }: GitPanelProps) {
  const [status, setStatus] = useState<GitStatus | null>(null);
  const [diff, setDiff] = useState<GitDiff | null>(null);
  const [commitMsg, setCommitMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const refreshStatus = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Use isomorphic-git to get status
      // const s = await git.statusMatrix({ fs, dir: projectRoot });
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }, [projectRoot]);

  const handleCommit = useCallback(async () => {
    if (!commitMsg.trim()) return;
    // TODO: Use isomorphic-git to commit
    setCommitMsg('');
    await refreshStatus();
  }, [commitMsg, refreshStatus]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.branchLabel}>
          {status ? `branch: ${status.branch}` : 'git: loading...'}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
      </View>

      {status && (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {status.staged > 0 && `+${status.staged} staged `}
            {status.unstaged > 0 && `~${status.unstaged} changed `}
            {status.files > 0 && `${status.files} files`}
            {status.files === 0 && 'Clean'}
          </Text>
        </View>
      )}

      <View style={styles.diffArea}>
        <Text style={styles.diffPlaceholder}>
          {loading ? 'Loading...' : 'Git diff will appear here'}
        </Text>
      </View>

      <View style={styles.commitRow}>
        <TextInput
          style={styles.commitInput}
          placeholder="Commit message"
          placeholderTextColor={C.textFaint}
          value={commitMsg}
          onChangeText={setCommitMsg}
          keyboardAppearance="dark"
        />
        <TouchableOpacity
          style={[styles.commitBtn, !commitMsg.trim() && styles.commitBtnDisabled]}
          onPress={handleCommit}
          disabled={!commitMsg.trim()}
        >
          <Text style={styles.commitBtnText}>Commit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.surface,
    borderTopWidth: 2,
    borderTopColor: C.blue,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '60%',
    zIndex: 19,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  branchLabel: {
    fontSize: 10,
    color: C.blue,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  closeBtn: {
    fontSize: 14,
    color: C.textFaint,
  },
  summary: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  summaryText: {
    fontSize: 10,
    color: C.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  diffArea: {
    flex: 1,
    padding: 8,
    minHeight: 80,
  },
  diffPlaceholder: {
    fontSize: 10,
    color: C.textFaint,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  commitRow: {
    flexDirection: 'row',
    padding: 8,
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  commitInput: {
    flex: 1,
    backgroundColor: C.deep,
    borderWidth: 1,
    borderColor: C.border,
    color: C.text,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 10,
    borderRadius: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  commitBtn: {
    backgroundColor: C.accent,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 4,
    justifyContent: 'center',
  },
  commitBtnDisabled: {
    opacity: 0.4,
  },
  commitBtnText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
