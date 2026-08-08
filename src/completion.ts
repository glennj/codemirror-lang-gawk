import { Completion, CompletionContext, CompletionResult, snippet } from '@codemirror/autocomplete';
import {
  GAWK_PATTERNS,
  GAWK_KEYWORDS,
  GAWK_DIRECTIVES,
  GAWK_BUILTIN_VARS,
  GAWK_BUILTIN_FUNCTIONS
} from './tokens';

/**
 * Built-in completions list
 */
const directiveCompletions: Completion[] = Array.from(GAWK_DIRECTIVES).map((dir) => ({
  label: dir,
  type: 'keyword',
  detail: 'GNU AWK Directive',
  boost: 10
}));

const patternCompletions: Completion[] = Array.from(GAWK_PATTERNS).map((pat) => ({
  label: pat,
  type: 'type',
  detail: 'Pattern Block',
  boost: 8
}));

const keywordCompletions: Completion[] = Array.from(GAWK_KEYWORDS).map((kw) => ({
  label: kw,
  type: 'keyword',
  detail: 'Control Keyword'
}));

const varCompletions: Completion[] = Array.from(GAWK_BUILTIN_VARS).map((v) => ({
  label: v,
  type: 'variable',
  detail: 'GNU AWK Built-in Variable',
  boost: 2
}));

const funcCompletions: Completion[] = Object.values(GAWK_BUILTIN_FUNCTIONS).map((fn) => ({
  label: fn.name,
  type: 'function',
  detail: fn.signature,
  info: `${fn.detail}\n\n${fn.doc}`,
  boost: 3
}));

const snippetCompletions: Completion[] = [
  {
    label: 'BEGIN',
    type: 'snippet',
    detail: 'BEGIN pattern block',
    apply: snippet('BEGIN {\n\t${1}\n}'),
    boost: 9
  },
  {
    label: 'END',
    type: 'snippet',
    detail: 'END pattern block',
    apply: snippet('END {\n\t${1}\n}'),
    boost: 9
  },
  {
    label: 'function',
    type: 'snippet',
    detail: 'User-defined function definition',
    apply: snippet('function ${1:name}(${2:args}) {\n\t${3}\n}'),
    boost: 9
  },
  {
    label: 'for (in)',
    type: 'snippet',
    detail: 'Array iteration loop',
    apply: snippet('for (${1:key} in ${2:array}) {\n\t${3}\n}'),
    boost: 8
  },
  {
    label: 'for (i=1..n)',
    type: 'snippet',
    detail: 'Numeric count loop',
    apply: snippet('for (${1:i} = 1; ${1:i} <= ${2:n}; ${1:i}++) {\n\t${3}\n}'),
    boost: 8
  },
  {
    label: 'if',
    type: 'snippet',
    detail: 'Conditional statement',
    apply: snippet('if (${1:condition}) {\n\t${2}\n}'),
    boost: 8
  },
  {
    label: 'if-else',
    type: 'snippet',
    detail: 'If-else statement',
    apply: snippet('if (${1:condition}) {\n\t${2}\n} else {\n\t${3}\n}'),
    boost: 8
  },
  {
    label: '@include',
    type: 'snippet',
    detail: 'Include AWK source file',
    apply: snippet('@include "${1:filename.awk}"'),
    boost: 10
  },
  {
    label: '@namespace',
    type: 'snippet',
    detail: 'GNU AWK Namespace definition',
    apply: snippet('@namespace "${1:name}"'),
    boost: 10
  },
  {
    label: '@load',
    type: 'snippet',
    detail: 'Load shared extension library',
    apply: snippet('@load "${1:extension}"'),
    boost: 10
  }
];

/**
 * Scans the current document for user-defined function names and variable identifiers
 */
function getDocumentSymbols(docText: string): Completion[] {
  const symbolMap = new Map<string, Completion>();

  // Find user function declarations
  const funcRegex = /\b(?:function|func)\s+([A-Za-z_][A-Za-z0-9_]*)/g;
  let match;
  while ((match = funcRegex.exec(docText)) !== null) {
    const fnName = match[1];
    if (!GAWK_BUILTIN_FUNCTIONS[fnName]) {
      symbolMap.set(fnName, {
        label: fnName,
        type: 'function',
        detail: 'User Function',
        boost: 5
      });
    }
  }

  // Find user identifiers
  const varRegex = /\b([A-Za-z_][A-Za-z0-9_]*)\b/g;
  while ((match = varRegex.exec(docText)) !== null) {
    const varName = match[1];
    if (
      !GAWK_KEYWORDS.has(varName) &&
      !GAWK_PATTERNS.has(varName) &&
      !GAWK_BUILTIN_VARS.has(varName) &&
      !GAWK_BUILTIN_FUNCTIONS[varName] &&
      !symbolMap.has(varName)
    ) {
      symbolMap.set(varName, {
        label: varName,
        type: 'variable',
        detail: 'Document Variable'
      });
    }
  }

  return Array.from(symbolMap.values());
}

/**
 * CodeMirror 6 Completion Source for GNU AWK
 */
export function gawkCompletionSource(context: CompletionContext): CompletionResult | null {
  // Check if completion is triggered right after @
  const word = context.matchBefore(/@[\w_]*|[A-Za-z_][A-Za-z0-9_]*/);

  if (!word || (word.from === word.to && !context.explicit)) {
    return null;
  }

  const isDirectiveTrigger = word.text.startsWith('@');

  if (isDirectiveTrigger) {
    return {
      from: word.from,
      options: [...directiveCompletions, ...snippetCompletions.filter((s) => s.label.startsWith('@'))],
      validFor: /^@[\w_]*$/
    };
  }

  const docText = context.state.doc.toString();
  const documentSymbols = getDocumentSymbols(docText);

  return {
    from: word.from,
    options: [
      ...snippetCompletions,
      ...patternCompletions,
      ...directiveCompletions,
      ...keywordCompletions,
      ...funcCompletions,
      ...varCompletions,
      ...documentSymbols
    ],
    validFor: /^[A-Za-z_][A-Za-z0-9_]*$/
  };
}
