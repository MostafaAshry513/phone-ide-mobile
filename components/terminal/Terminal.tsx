/**
 * Terminal — multi-tab terminal emulator.
 * Keyboard: Ctrl+K to toggle, Alt+1-9 to switch tabs.
 */
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, TextInput } from 'react-native';
import { THEME } from '../../lib/store';

const C = THEME;

interface Props { visible: boolean; onClose: () => void; }

export default function Terminal({ visible, onClose }: Props) {
  const [tabs, setTabs] = useState([{ id: 0, name: 'bash' }]);
  const [activeTab, setActiveTab] = useState(0);
  const [output, setOutput] = useState<string[]>(['Phone IDE Terminal', '~ $ ', '']);
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const execCommand = (cmd: string) => {
    if (!cmd.trim()) { setOutput((o) => [...o, '~ $ ', '']); return; }
    const newLines = [...output, `~ $ ${cmd}`];
    // Simple built-in commands
    if (cmd === 'clear') { setOutput(['Phone IDE Terminal', '~ $ ', '']); setInput(''); return; }
    if (cmd === 'help') { newLines.push('Available: clear, help, echo, date, ls, pwd, whoami'); }
    else if (cmd.startsWith('echo ')) { newLines.push(cmd.slice(5)); }
    else if (cmd === 'date') { newLines.push(new Date().toString()); }
    else if (cmd === 'pwd') { newLines.push('/'); }
    else if (cmd === 'whoami') { newLines.push('phoneide'); }
    else if (cmd === 'ls') { newLines.push('(no native access — use file explorer)'); }
    else { newLines.push(`command not found: ${cmd.split(' ')[0]}`); }
    newLines.push('~ $ ', '');
    setOutput(newLines); setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.tabBar} showsHorizontalScrollIndicator={false}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.id} style={[styles.tab, tab.id === activeTab && styles.tabActive]} onPress={() => setActiveTab(tab.id)}>
            <Text style={[styles.tabText, tab.id === activeTab && styles.tabTextActive]}>{tab.name}</Text>
            <Text style={styles.tabClose}>✕</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={[styles.tab, styles.tabNew]} onPress={() => { const id = tabs.length; setTabs([...tabs, { id, name: `bash ${id}` }]); setActiveTab(id); }}>
          <Text style={styles.tabNewText}>+</Text>
        </TouchableOpacity>
      </ScrollView>
      <ScrollView ref={scrollRef} style={styles.output} onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}>
        {output.map((line, i) => (
          <Text key={i} style={styles.outputLine}>{line || ' '}</Text>
        ))}
      </ScrollView>
      <View style={styles.inputRow}>
        <Text style={styles.prompt}>$</Text>
        <TextInput style={styles.cmdInput} value={input} onChangeText={setInput} onSubmitEditing={() => execCommand(input)}
          placeholder="" placeholderTextColor={C.textFaint} autoFocus keyboardAppearance="dark" autoCorrect={false}
          autoCapitalize="none" returnKeyType="send" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.deep },
  tabBar: { flexDirection: 'row', backgroundColor: C.surface, paddingHorizontal: 4, paddingTop: 4, borderBottomWidth: 1, borderBottomColor: C.border, maxHeight: 28 },
  tab: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 3, backgroundColor: C.deep, borderWidth: 1, borderColor: C.border, borderBottomWidth: 0, borderTopLeftRadius: 4, borderTopRightRadius: 4, marginRight: 2, gap: 6 },
  tabActive: { backgroundColor: C.base, borderColor: C.accent },
  tabText: { fontSize: 10, color: C.textDim, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  tabTextActive: { color: C.accent, fontWeight: '500' },
  tabClose: { fontSize: 10, color: C.textFaint },
  tabNew: { borderStyle: 'dashed' },
  tabNewText: { fontSize: 16, color: C.green, fontWeight: '600' },
  output: { flex: 1, padding: 8 },
  outputLine: { fontSize: 12, color: C.text, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', lineHeight: 18 },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.border },
  prompt: { fontSize: 12, color: C.green, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', marginRight: 6 },
  cmdInput: { flex: 1, fontSize: 12, color: C.text, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', padding: 0 },
});
