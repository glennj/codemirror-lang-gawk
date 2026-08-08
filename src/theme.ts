import { EditorView } from '@codemirror/view';
import { Extension } from '@codemirror/state';

/**
 * Built-in Modern Dark Visual Theme for GNU AWK Editor
 */
export const gawkDarkTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      fontFamily: "'Fira Code', 'JetBrains Mono', 'Source Code Pro', monospace",
      fontSize: '14px',
      borderRadius: '8px'
    },
    '.cm-content': {
      caretColor: '#38bdf8'
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: '#38bdf8'
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: '#1e293b'
    },
    '.cm-activeLine': {
      backgroundColor: 'rgba(51, 65, 85, 0.4)'
    },
    '.cm-gutters': {
      backgroundColor: '#0b1329',
      color: '#64748b',
      borderRight: '1px solid #1e293b'
    },
    '.cm-activeLineGutter': {
      backgroundColor: '#1e293b',
      color: '#38bdf8'
    },
    '.cm-foldPlaceholder': {
      backgroundColor: '#1e293b',
      color: '#94a3b8',
      border: 'none',
      borderRadius: '4px',
      padding: '0 4px'
    },
    // GNU AWK Syntax Highlighting Classes
    '.cm-gawk-directive': { color: '#c084fc', fontWeight: 'bold' }, // @include, @namespace
    '.cm-gawk-pattern': { color: '#f59e0b', fontWeight: 'bold' }, // BEGIN, END
    '.cm-gawk-keyword': { color: '#f43f5e', fontWeight: 'bold' }, // if, else, for, while
    '.cm-gawk-builtin-var': { color: '#38bdf8', fontWeight: '600' }, // FS, NF, NR, ARGIND
    '.cm-gawk-field': { color: '#4ade80', fontWeight: 'bold' }, // $0, $1, $NF
    '.cm-gawk-builtin-func': { color: '#60a5fa' }, // gensub, patsplit, strftime
    '.cm-gawk-func-def': { color: '#a78bfa', fontWeight: 'bold' },
    '.cm-gawk-func-call': { color: '#38bdf8' },
    '.cm-gawk-string': { color: '#a3e635' },
    '.cm-gawk-regex': { color: '#fb923c' },
    '.cm-gawk-number': { color: '#facc15' },
    '.cm-gawk-comment': { color: '#64748b', fontStyle: 'italic' },
    '.cm-gawk-operator': { color: '#cbd5e1' },
    '.cm-gawk-punctuation': { color: '#94a3b8' }
  },
  { dark: true }
);

/**
 * Built-in Modern Light Visual Theme for GNU AWK Editor
 */
export const gawkLightTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: '#ffffff',
      color: '#0f172a',
      fontFamily: "'Fira Code', 'JetBrains Mono', 'Source Code Pro', monospace",
      fontSize: '14px',
      borderRadius: '8px'
    },
    '.cm-content': {
      caretColor: '#0284c7'
    },
    '.cm-gutters': {
      backgroundColor: '#f8fafc',
      color: '#94a3b8',
      borderRight: '1px solid #e2e8f0'
    },
    '.cm-activeLine': {
      backgroundColor: '#f1f5f9'
    },
    '.cm-activeLineGutter': {
      backgroundColor: '#e2e8f0',
      color: '#0284c7'
    },

    // Light mode syntax highlighting
    '.cm-gawk-directive': { color: '#7e22ce', fontWeight: 'bold' },
    '.cm-gawk-pattern': { color: '#d97706', fontWeight: 'bold' },
    '.cm-gawk-keyword': { color: '#be123c', fontWeight: 'bold' },
    '.cm-gawk-builtin-var': { color: '#0369a1', fontWeight: '600' },
    '.cm-gawk-field': { color: '#15803d', fontWeight: 'bold' },
    '.cm-gawk-builtin-func': { color: '#1d4ed8' },
    '.cm-gawk-func-def': { color: '#6d28d9', fontWeight: 'bold' },
    '.cm-gawk-func-call': { color: '#0284c7' },
    '.cm-gawk-string': { color: '#4d7c0f' },
    '.cm-gawk-regex': { color: '#c2410c' },
    '.cm-gawk-number': { color: '#b45309' },
    '.cm-gawk-comment': { color: '#64748b', fontStyle: 'italic' },
    '.cm-gawk-operator': { color: '#334155' },
    '.cm-gawk-punctuation': { color: '#475569' }
  },
  { dark: false }
);
