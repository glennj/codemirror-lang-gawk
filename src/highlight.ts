import { tags as t } from '@lezer/highlight';

/**
 * Custom Highlighting Tags mapping for GNU AWK StreamLanguage
 */
export const gawkHighlightStyle = [
  { tag: t.keyword, class: 'cm-gawk-keyword' },
  { tag: t.special(t.keyword), class: 'cm-gawk-pattern' },
  { tag: t.processingInstruction, class: 'cm-gawk-directive' },
  { tag: t.meta, class: 'cm-gawk-directive' },
  { tag: t.standard(t.variableName), class: 'cm-gawk-builtin-var' },
  { tag: t.special(t.variableName), class: 'cm-gawk-field' },
  { tag: t.standard(t.name), class: 'cm-gawk-builtin-func' },
  { tag: t.definition(t.function(t.variableName)), class: 'cm-gawk-func-def' },
  { tag: t.function(t.variableName), class: 'cm-gawk-func-call' },
  { tag: t.string, class: 'cm-gawk-string' },
  { tag: t.regexp, class: 'cm-gawk-regex' },
  { tag: t.number, class: 'cm-gawk-number' },
  { tag: t.comment, class: 'cm-gawk-comment' },
  { tag: t.operator, class: 'cm-gawk-operator' },
  { tag: t.punctuation, class: 'cm-gawk-punctuation' }
];
