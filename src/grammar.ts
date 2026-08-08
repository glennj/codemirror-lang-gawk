import { StringStream } from '@codemirror/language';
import {
  GAWK_PATTERNS,
  GAWK_KEYWORDS,
  GAWK_DIRECTIVES,
  GAWK_BUILTIN_VARS,
  GAWK_BUILTIN_FUNCTIONS
} from './tokens';

export interface GawkState {
  inString: boolean;
  stringQuote: string;
  inRegex: boolean;
  expectRegex: boolean;
  inComment: boolean;
  inDirective: boolean;
  lastToken: string;
}

export const gawkStreamParser = {
  name: 'gawk',

  startState(): GawkState {
    return {
      inString: false,
      stringQuote: '"',
      inRegex: false,
      expectRegex: true,
      inComment: false,
      inDirective: false,
      lastToken: ''
    };
  },

  token(stream: StringStream, state: GawkState): string | null {
    // 1. Handle spaces
    if (stream.eatSpace()) {
      return null;
    }

    // 2. Handle line comments
    if (stream.peek() === '#') {
      stream.skipToEnd();
      state.expectRegex = true;
      return 'comment';
    }

    // 3. Handle string literals
    if (state.inString) {
      while (!stream.eol()) {
        const ch = stream.next();
        if (ch === '\\') {
          stream.next(); // Skip escaped character
        } else if (ch === state.stringQuote) {
          state.inString = false;
          state.expectRegex = false;
          return 'string';
        }
      }
      return 'string';
    }

    // 4. Handle regex literals
    if (state.inRegex) {
      while (!stream.eol()) {
        const ch = stream.next();
        if (ch === '\\') {
          stream.next(); // Skip escape
        } else if (ch === '/') {
          state.inRegex = false;
          state.expectRegex = false;
          return 'regexp';
        }
      }
      return 'regexp';
    }

    // 5. Handle GNU AWK Directives starting with @
    if (stream.peek() === '@') {
      stream.eat('@');
      stream.eatWhile(/[\w_]/);
      const word = stream.current();
      state.expectRegex = true;
      if (GAWK_DIRECTIVES.has(word)) {
        state.lastToken = word;
        return 'processingInstruction'; // Directives like @include, @namespace, @load
      }
      return 'keyword';
    }

    // 6. Handle string opening quote
    if (stream.peek() === '"') {
      stream.next();
      state.inString = true;
      state.stringQuote = '"';
      return 'string';
    }

    // 7. Handle Regex start vs Division operator
    if (stream.peek() === '/') {
      if (state.expectRegex) {
        stream.next();
        state.inRegex = true;
        return 'regexp';
      } else {
        stream.next();
        // Check for compound assignment /=
        if (stream.peek() === '=') {
          stream.next();
          state.lastToken = '/=';
        } else {
          state.lastToken = '/';
        }
        state.expectRegex = true;
        return 'operator';
      }
    }

    // 8. Handle Field Accessor $
    if (stream.peek() === '$') {
      stream.next();
      // If followed by digits or NF/variable or parenthesis
      if (stream.match(/^\d+/)) {
        state.expectRegex = false;
        return 'special(variableName)'; // $0, $1, $2
      }
      if (stream.match(/^[A-Za-z_][A-Za-z0-9_]*/)) {
        state.expectRegex = false;
        return 'special(variableName)'; // $NF
      }
      state.expectRegex = true;
      return 'operator'; // $(expr)
    }

    // 9. Handle Numbers (Hex, Octal, Floating, Integer)
    if (stream.match(/^0[xX][0-9a-fA-F]+/) || stream.match(/^\d+(\.\d+)?([eE][+-]?\d+)?/)) {
      state.expectRegex = false;
      return 'number';
    }

    // 10. Handle Multi-char Operators
    if (stream.match(/^(~|!~|\+\+|--|&&|\|\||\|&|==|!=|<=|>=|\+=|-=|\*=|\/=|%=|\^=|\*\*=|<<|>>|\*\*)/)) {
      state.expectRegex = true;
      return 'operator';
    }

    // 11. Handle Single-char Operators & Punctuation
    const ch = stream.next()!;
    if ('+-*%^=<>!~|&'.includes(ch)) {
      state.expectRegex = true;
      return 'operator';
    }

    if ('{}()[];,'.includes(ch)) {
      if (ch === ')' || ch === '}') {
        state.expectRegex = false;
      } else {
        state.expectRegex = true;
      }
      return 'punctuation';
    }

    // 12. Handle Identifiers, Keywords, Patterns, Functions, Variables
    if (/[A-Za-z_]/.test(ch)) {
      stream.eatWhile(/[\w_]/);
      const word = stream.current();

      // Check Pattern blocks: BEGIN, END, BEGINFILE, ENDFILE
      if (GAWK_PATTERNS.has(word)) {
        state.expectRegex = true;
        state.lastToken = word;
        return 'special(keyword)';
      }

      // Check Keywords
      if (GAWK_KEYWORDS.has(word)) {
        state.expectRegex = true;
        state.lastToken = word;
        return 'keyword';
      }

      // Check Built-in Variables
      if (GAWK_BUILTIN_VARS.has(word)) {
        state.expectRegex = false;
        state.lastToken = word;
        return 'standard(variableName)';
      }

      // Check Built-in Functions
      if (GAWK_BUILTIN_FUNCTIONS[word]) {
        state.expectRegex = true; // Function call usually precedes (
        state.lastToken = word;
        return 'standard(name)';
      }

      // Check user function declaration / call context
      if (state.lastToken === 'function' || state.lastToken === 'func') {
        state.expectRegex = false;
        return 'function(definition)';
      }

      // Peek if followed by (
      if (stream.peek() === '(') {
        state.expectRegex = true;
        return 'function(call)';
      }

      state.expectRegex = false;
      state.lastToken = word;
      return 'variableName';
    }

    return null;
  },

  indent(state: GawkState, textAfter: string): number {
    // Basic indentation logic
    if (textAfter.startsWith('}')) {
      return 0;
    }
    return 2;
  }
};
