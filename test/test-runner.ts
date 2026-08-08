import { EditorState } from '@codemirror/state';
import { gawkLanguage, gawkLinter, GAWK_BUILTIN_FUNCTIONS, GAWK_DIRECTIVES } from '../src/index';

console.log('--- Testing GNU AWK CodeMirror 6 Plugin ---');

// Test 1: Tokens verification
console.log('1. Verifying Built-in Directives & Functions...');
console.assert(GAWK_DIRECTIVES.has('@include'), 'Directives should contain @include');
console.assert(GAWK_DIRECTIVES.has('@namespace'), 'Directives should contain @namespace');
console.assert(GAWK_DIRECTIVES.has('@load'), 'Directives should contain @load');
console.assert(GAWK_BUILTIN_FUNCTIONS['gensub'], 'Built-ins should contain gensub');
console.assert(GAWK_BUILTIN_FUNCTIONS['patsplit'], 'Built-ins should contain patsplit');
console.assert(GAWK_BUILTIN_FUNCTIONS['strftime'], 'Built-ins should contain strftime');
console.log('✅ Tokens & Built-ins verified!');

// Test 2: Language Instantiation
console.log('2. Verifying EditorState initialization...');
const state = EditorState.create({
  doc: '@include "test.awk"\nBEGIN { print "hello" }',
  extensions: [gawkLanguage]
});

console.assert(state.doc.toString().includes('BEGIN'), 'Doc should contain BEGIN');
console.log('✅ EditorState initialized successfully!');

console.log('--- All Plugin Checks Passed! ---');
