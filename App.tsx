/**
 * Phone IDE — Main App Shell
 * Full integration of all components with keyboard-first UX.
 */
import { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { THEME, useAppState, useStore } from './lib/store';
import * as FS from './lib/filesystem';
import { DEFAULT_SHORTCUTS } from './lib/keyboard';
import type { Command } from './lib/store';

import Editor from './components/editor/Editor';
import FileExplorer from './components/explorer/FileExplorer';
import FileTabs from './components/ui/FileTabs';
import TopBar from './components/ui/TopBar';
import BottomBar from './components/ui/BottomBar';
import KeyboardBar from './components/ui/KeyboardBar';
import CommandPalette from './components/panels/CommandPalette';
import SearchPanel from './components/panels/SearchPanel';
import GitPanel from './components/panels/GitPanel';
import ProblemsPanel from './components/panels/ProblemsPanel';
import SnippetsPanel from './components/panels/SnippetsPanel';
import SymbolPanel from './components/panels/SymbolPanel';
import Terminal from './components/terminal/Terminal';

export default function App() {
  // ─── State selectors ───
  const activePanel = useAppState((s) => s.activePanel);
  const openTabs = useAppState((s) => s.openTabs);
  const activeTabIdx = useAppState((s) => s.activeTabIdx);
  const settings = useAppState((s) => s.settings);
  const commandPaletteOpen = useAppState((s) => s.commandPaletteOpen);
  const searchPanelOpen = useAppState((s) => s.searchPanelOpen);
  const gitPanelOpen = useAppState((s) => s.gitPanelOpen);
  const problemsPanelOpen = useAppState((s) => s.problemsPanelOpen);
  const terminalVisible = useAppState((s) => s.terminalVisible);

  // ─── Actions (stable references from zustand) ───
  const toggleExplorer = useStore((s) => s.toggleExplorer);
  const toggleCommandPalette = useStore((s) => s.toggleCommandPalette);
  const toggleSearchPanel = useStore((s) => s.toggleSearchPanel);
  const toggleGitPanel = useStore((s) => s.toggleGitPanel);
  const toggleProblemsPanel = useStore((s) => s.toggleProblemsPanel);
  const toggleTerminal = useStore((s) => s.toggleTerminal);
  const closeTab = useStore((s) => s.closeTab);
  const switchTab = useStore((s) => s.switchTab);
  const reopenClosedTab = useStore((s) => s.reopenClosedTab);
  const registerCommand = useStore((s) => s.registerCommand);
  const updateSettings = useStore((s) => s.updateSettings);

  const [editorContent, setEditorContent] = useState('');
  const [editorFileName, setEditorFileName] = useState('untitled.js');

  // ─── Register default keyboard shortcut commands ───
  useEffect(() => {
    const actionMap: Record<string, () => void> = {
      'toggle-explorer': toggleExplorer,
      'toggle-terminal': toggleTerminal,
      'command-palette': toggleCommandPalette,
      'search-files': toggleSearchPanel,
      'git-panel': toggleGitPanel,
      'problems-panel': toggleProblemsPanel,
      'close-tab': () => closeTab(activeTabIdx),
      'next-tab': () => switchTab((activeTabIdx + 1) % Math.max(1, openTabs.length)),
      'prev-tab': () => switchTab((activeTabIdx - 1 + openTabs.length) % Math.max(1, openTabs.length)),
      'reopen-tab': reopenClosedTab,
      'zoom-in': () => updateSettings({ fontSize: Math.min(settings.fontSize + 1, 24) }),
      'zoom-out': () => updateSettings({ fontSize: Math.max(settings.fontSize - 1, 6) }),
      'zoom-reset': () => updateSettings({ fontSize: 12 }),
    };
    DEFAULT_SHORTCUTS.forEach((s) => {
      const run = actionMap[s.id] || (() => {});
      registerCommand({ id: s.id, label: s.description, shortcut: s.keys, category: s.category, run });
    });
  }, []); // register once on mount

  // ─── Load file content when tab changes ───
  useEffect(() => {
    const tab = openTabs[activeTabIdx];
    if (tab?.path) {
      setEditorFileName(tab.name);
      FS.readFile(tab.path).then(setEditorContent).catch(() => setEditorContent(''));
    } else {
      setEditorFileName('untitled');
      setEditorContent('');
    }
  }, [activeTabIdx, openTabs]);

  // ─── Content change from editor ───
  const handleContentChange = useCallback((content: string) => {
    setEditorContent(content);
  }, []);

  // ─── Save handler ───
  const handleSave = useCallback(async (content: string) => {
    const tab = openTabs[activeTabIdx];
    if (tab?.path) {
      try { await FS.writeFile(tab.path, content); } catch {}
    }
  }, [activeTabIdx, openTabs]);

  const showEditor = activePanel === 'editor' || !terminalVisible;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={THEME.deep} />
        <View style={styles.root}>
          <TopBar />
          <FileTabs />

          <View style={styles.main}>
            <FileExplorer />
            <View style={styles.content}>
              <View style={[styles.editorWrap, showEditor && styles.visible]}>
                <Editor
                  content={editorContent}
                  fileName={editorFileName}
                  fontSize={settings.fontSize}
                  onContentChange={handleContentChange}
                  onSave={handleSave}
                />
              </View>
              <View style={[styles.terminalWrap, terminalVisible && styles.visible]}>
                <Terminal visible={terminalVisible} onClose={toggleTerminal} />
              </View>

              {/* Overlay panels */}
              <SearchPanel visible={searchPanelOpen} onClose={toggleSearchPanel} />
              <GitPanel visible={gitPanelOpen} onClose={toggleGitPanel} projectRoot="" />
              <ProblemsPanel visible={problemsPanelOpen} onClose={toggleProblemsPanel} />
            </View>
          </View>

          <BottomBar />
          <KeyboardBar visible />

          {/* Modal panels */}
          <CommandPalette visible={commandPaletteOpen} onClose={toggleCommandPalette} />
          <SnippetsPanel visible={false} onClose={() => {}} />
          <SymbolPanel visible={false} onClose={() => {}} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: THEME.deep },
  root: { flex: 1, backgroundColor: THEME.deep },
  main: { flex: 1, flexDirection: 'row', overflow: 'hidden' },
  content: { flex: 1, position: 'relative', minWidth: 0 },
  editorWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'none' },
  terminalWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'none' },
  visible: { display: 'flex' },
});
