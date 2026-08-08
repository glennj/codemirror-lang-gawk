import { StreamLanguage, LanguageSupport, syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { autocompletion } from '@codemirror/autocomplete';
import { Extension } from '@codemirror/state';
import { gawkStreamParser } from './grammar';
import { gawkHighlightStyle } from './highlight';
import { gawkCompletionSource } from './completion';
import { gawkLinter } from './linter';
import { gawkDarkTheme, gawkLightTheme } from './theme';

export * from './tokens';
export * from './grammar';
export * from './highlight';
export * from './completion';
export * from './linter';
export * from './theme';

/**
 * Highlighting Style extension for GNU AWK
 */
export const gawkHighlighting = syntaxHighlighting(HighlightStyle.define(gawkHighlightStyle));

/**
 * CodeMirror 6 StreamLanguage definition for GNU AWK
 */
export const gawkLanguage = StreamLanguage.define(gawkStreamParser);

export interface GawkLanguageOptions {
  /**
   * Enable diagnostic linting for syntax errors. Default: true.
   */
  lint?: boolean;
  /**
   * Enable autocompletion source. Default: true.
   */
  autocomplete?: boolean;
}

/**
 * Main CodeMirror 6 plugin extension function for GNU AWK (gawk).
 *
 * @param options Configuration options for linting and autocompletion
 * @returns LanguageSupport instance for CodeMirror 6
 *
 * @example
 * ```ts
 * import { EditorView } from '@codemirror/view';
 * import { basicSetup } from 'codemirror';
 * import { gawk } from 'codemirror-lang-gawk';
 *
 * new EditorView({
 *   doc: 'BEGIN { print "Hello, GNU AWK!" }',
 *   extensions: [basicSetup, gawk()]
 * });
 * ```
 */
export function gawk(options: GawkLanguageOptions = {}): LanguageSupport {
  const extensions: Extension[] = [gawkHighlighting];

  if (options.autocomplete !== false) {
    extensions.push(
      autocompletion({
        override: [gawkCompletionSource]
      })
    );
  }

  if (options.lint !== false) {
    extensions.push(gawkLinter());
  }

  return new LanguageSupport(gawkLanguage, extensions);
}
