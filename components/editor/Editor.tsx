/**
 * Editor — CodeMirror 6 in React Native WebView.
 * The ONLY WebView in the app. Everything else is native UI.
 *
 * Communication via postMessage bridge:
 *   RN → WebView: setContent, setLanguage, setFontSize, insertSnippet, undo, redo, save
 *   WebView → RN: contentChanged, cursorChanged, saveRequested, editorReady, selectionChanged
 */
import React, { useRef, useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { THEME, useAppState, useStore } from '../../lib/store';

const C = THEME;

// ─── The CodeMirror HTML (loaded from bundled asset in production) ───
// In dev, we embed a CDN-backed editor. In production, this loads from local file.
const EDITOR_HTML = `
<!DOCTYPE html><html><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;overflow:hidden;background:#0d1020}
.cm-editor{height:100%;font-size:12px}
.cm-editor .cm-scroller{overflow:auto;font-family:"JetBrains Mono","Droid Sans Mono",monospace;line-height:1.55}
.cm-editor .cm-content{font-family:"JetBrains Mono","Droid Sans Mono",monospace;padding:8px 0}
.cm-editor .cm-gutters{background:#0d1020;border-right:1px solid #232946;color:#434b6b}
.cm-activeLine{background:rgba(124,92,252,0.06)!important}
.cm-matchingBracket{background:rgba(124,92,252,0.25)!important;outline:1px solid rgba(124,92,252,0.6)}
.cm-cursor{border-left-color:#7c5cfc!important}
.cm-selectionBackground{background:rgba(124,92,252,0.3)!important}
</style>
</head><body><div id="editor"></div>
<script type="module">
import {EditorView,basicSetup}from"https://esm.sh/codemirror@6.0.2";
import {EditorState}from"https://esm.sh/@codemirror/state@6.5.2";
import {oneDark}from"https://esm.sh/@codemirror/theme-one-dark@6.1.3";
import {javascript}from"https://esm.sh/@codemirror/lang-javascript@6.2.5";
import {python}from"https://esm.sh/@codemirror/lang-python@6.2.1";
import {html}from"https://esm.sh/@codemirror/lang-html@6.4.12";
import {css}from"https://esm.sh/@codemirror/lang-css@6.3.1";
import {json}from"https://esm.sh/@codemirror/lang-json@6.0.2";
import {markdown}from"https://esm.sh/@codemirror/lang-markdown@6.5.2";
import {cpp}from"https://esm.sh/@codemirror/lang-cpp@6.0.3";
import {rust}from"https://esm.sh/@codemirror/lang-rust@6.0.2";
import {php}from"https://esm.sh/@codemirror/lang-php@6.0.2";
import {sql}from"https://esm.sh/@codemirror/lang-sql@6.10.0";
import {yaml}from"https://esm.sh/@codemirror/lang-yaml@6.1.3";
import {autocompletion}from"https://esm.sh/@codemirror/autocomplete@6.19.1";
import {search,searchKeymap}from"https://esm.sh/@codemirror/search@6.7.1";
import {indentUnit}from"https://esm.sh/@codemirror/language@6.11.3";
import {indentWithTab}from"https://esm.sh/@codemirror/commands@6.10.4";

const langMap={js:javascript,jsx:javascript,ts:javascript,tsx:javascript,py:python,python:python,html:html,htm:html,css:css,scss:css,less:css,json:json,jsonc:json,md:markdown,markdown:markdown,c:cpp,cpp:cpp,h:cpp,rs:rust,php:php,sql:sql,yml:yaml,yaml:yaml};
function getLang(fn){var e=(fn||'js').split('.').pop().toLowerCase();return (langMap[e]||javascript)();}

var view=new EditorView({
  state:EditorState.create({
    doc:['// Phone IDE — keyboard-first code editor','// Ctrl+S save  Ctrl+F find  Ctrl+Z undo','// Ctrl+/ toggle comment  Ctrl+D duplicate line','// Alt+Up/Down move line  Ctrl+Enter insert below',''].join('\\n'),
    extensions:[basicSetup,oneDark,getLang('untitled.js'),autocompletion(),search(),indentUnit.of('  '),keymap.of([indentWithTab]),EditorView.lineWrapping,
      EditorView.updateListener.of(function(u){if(u.docChanged){var c=u.state.doc.toString();v._dirty=true;post('contentChanged',{content:c,dirty:true});}
        var sel=u.state.selection.main;var ln=u.state.doc.lineAt(sel.head);post('cursorChanged',{line:ln.number,column:sel.head-ln.from+1});}),
      keymap.of([{key:'Mod-s',run:function(){post('saveRequested',{content:view.state.doc.toString()});return true;}}]),
    ]
  }),
  parent:document.getElementById('editor')
});
view._dirty=false;

function post(t,d){try{window.ReactNativeWebView.postMessage(JSON.stringify({type:t,...d}));}catch(e){}}

function handle(m){try{var d=JSON.parse(m);switch(d.type){
  case'setContent':view.dispatch({changes:{from:0,to:view.state.doc.length,insert:d.content||''}});setTimeout(function(){view.scrollDOM.scrollTop=0;},50);break;
  case'setLanguage':view.dispatch({effects:view.state.reconfigure([basicSetup,oneDark,getLang(d.language||'untitled.js'),autocompletion(),search(),indentUnit.of('  '),keymap.of([indentWithTab]),EditorView.lineWrapping])});break;
  case'setFontSize':view.dom.style.fontSize=(d.fontSize||12)+'px';break;
  case'insertSnippet':var s=view.state.selection.main;view.dispatch({changes:{from:s.head,insert:d.text||''}});break;
  case'undo':{var a=undo(view.state);if(a)view.dispatch(a);break;}
  case'redo':{var b=redo(view.state);if(b)view.dispatch(b);break;}
  case'save':post('saveRequested',{content:view.state.doc.toString()});view._dirty=false;break;
  case'getContent':post('contentChanged',{content:view.state.doc.toString(),dirty:view._dirty});break;
}}catch(e){}}

document.addEventListener('message',function(e){handle(e.data);});
window.addEventListener('message',function(e){handle(e.data);});
post('editorReady',{});
</script></body></html>`;

interface Props {
  content?: string;
  fileName?: string;
  readOnly?: boolean;
  fontSize?: number;
  onContentChange?: (content: string, dirty: boolean) => void;
  onSave?: (content: string) => void;
  onCursorChange?: (line: number, column: number) => void;
}

export default function Editor({
  content = '',
  fileName,
  readOnly = false,
  fontSize = 12,
  onContentChange,
  onSave,
  onCursorChange,
}: Props) {
  const webViewRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  const postMessage = useCallback((msg: object) => {
    webViewRef.current?.injectJavaScript(
      `(function(){try{var m=JSON.parse(${JSON.stringify(JSON.stringify(msg))});var t=m.type;var d=m;delete d.type;
      if(t==='setContent'){var v=document.querySelector('.cm-editor').cmView.view;
      v.dispatch({changes:{from:0,to:v.state.doc.length,insert:d.content||''}});}
      else if(t==='setLanguage'){/* reconfigure */}
      else if(t==='setFontSize'){document.querySelector('.cm-editor').style.fontSize=(d.fontSize||12)+'px';}
      else if(t==='insertSnippet'){var v=document.querySelector('.cm-editor').cmView.view;var s=v.state.selection.main;v.dispatch({changes:{from:s.head,insert:d.text||''}});}
      else if(t==='undo'){var a=undo(v.state);if(a)v.dispatch(a);}
      }catch(e){console.log(e)}})();true;`
    );
  }, []);

  useEffect(() => {
    if (ready && content) {
      postMessage({ type: 'setContent', content });
    }
  }, [ready, content]);

  useEffect(() => {
    if (ready) {
      postMessage({ type: 'setFontSize', fontSize });
    }
  }, [ready, fontSize]);

  const handleMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      switch (data.type) {
        case 'editorReady': setReady(true); break;
        case 'contentChanged': onContentChange?.(data.content, data.dirty); break;
        case 'saveRequested': onSave?.(data.content); break;
        case 'cursorChanged': onCursorChange?.(data.line, data.column); break;
      }
    } catch {}
  }, [onContentChange, onSave, onCursorChange]);

  return (
    <View style={styles.container}>
      {!ready && <ActivityIndicator style={styles.loader} color={C.accent} size="small" />}
      <WebView
        ref={webViewRef}
        style={styles.webview}
        source={{ html: EDITOR_HTML }}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleMessage}
        scrollEnabled={false}
        keyboardDisplayRequiresUserAction={false}
        hideKeyboardAccessoryView={true}
        allowsInlineMediaPlayback={true}
        textInteractionEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.base, position: 'relative' },
  webview: { flex: 1, backgroundColor: 'transparent' },
  loader: { position: 'absolute', top: 12, right: 12, zIndex: 10 },
});
