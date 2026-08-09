# Phone IDE Mobile

Native cross-platform code editor for phones. Keyboard-first, fully offline, APK/AAB/iOS ready.

> **Status:** Early development — rebuilding from the [web prototype](https://github.com/MostafaAshry513/phone-ide)

## Philosophy

- **Keyboard-first, zero-touch UX** — every feature has a keyboard shortcut; touch is a fallback only
- **APK-first** — this is a real native app, not a WebView wrapper
- **Fully offline** — no cloud services, no CDN, nothing that needs internet
- **Cross-platform** — Android (.apk/.aab) and iOS (TestFlight/App Store)

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React Native + Expo (managed workflow) |
| Editor | CodeMirror 6 (in isolated WebView) |
| Terminal | node-pty or native PTY (TBD) |
| File Ops | expo-file-system |
| Git | isomorphic-git |
| State | Zustand / React Context |
| Storage | AsyncStorage / MMKV |
| Linting | In-app workers (JS/Python/node --check) |

## Features (from web prototype spec)

- [ ] Code editor — CodeMirror 6, 13+ languages, syntax highlighting
- [ ] File explorer — tree view, create/rename/delete/duplicate
- [ ] File tabs — multiple open files, dirty indicators, re-open closed
- [ ] Command palette — type to find commands (Ctrl+Shift+P)
- [ ] Find/replace — in-file (Ctrl+F) and cross-file (Ctrl+P)
- [ ] Terminal — embedded PTY shell
- [ ] Git panel — status, diff, commit
- [ ] Problems panel — lint output
- [ ] Snippets — code snippet library
- [ ] Symbol outline — function/class navigation
- [ ] Settings — font size, tab size, theme, keybindings
- [ ] Keyboard bar — on-screen key bar for touch fallback
- [ ] Full keyboard navigation — everything works without touching the screen

## Development

```bash
# Install
npm install

# Start dev server
npx expo start

# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios

# Build APK
eas build --platform android --profile production
```

## Project Structure

```
phone-ide-mobile/
├── app/              # Expo Router screens
│   ├── (tabs)/       # Tab layout (editor, terminal, files)
│   └── _layout.tsx   # Root layout
├── components/       # Reusable UI components
│   ├── editor/       # CodeMirror WebView wrapper
│   ├── explorer/     # File tree
│   ├── panels/       # Search, git, problems, snippets
│   ├── terminal/     # Terminal emulator
│   └── ui/           # Shared UI primitives
├── lib/              # Core logic (no JSX)
│   ├── filesystem.ts # File operations
│   ├── git.ts        # Git operations via isomorphic-git
│   ├── lint.ts       # In-app linting
│   ├── search.ts     # File search
│   ├── storage.ts    # Settings persistence
│   └── keyboard.ts   # Shortcut registry
├── assets/           # Fonts, icons, images
├── app.json          # Expo config
├── eas.json          # EAS Build config
└── package.json
```

## License

MIT
