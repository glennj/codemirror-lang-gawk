import { EditorView, ViewUpdate } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { Compartment } from '@codemirror/state';
import { gawk, gawkDarkTheme, gawkLightTheme, gawkStreamParser } from '../src/index';

// Presets
const SAMPLES = {
  logParser: `@include "log_utils.awk"
@namespace "analytics"

# GNU AWK Web Log Parser & Metric Aggregator
BEGIN {
    FS = " "
    OFS = "\t"
    print "=== GNU AWK Log Analysis Started ==="
    print "Processing environment:", ENVIRON["USER"]
}

BEGINFILE {
    print "Starting file #" ARGIND ":", FILENAME
}

# Match GET/POST HTTP lines using regex pattern match
$6 ~ /"GET|"POST/ {
    # Extract IP address and HTTP status code
    ip = $1
    status = $9
    bytes = $10

    # GNU AWK gensub: replace slash endpoints with clean string
    clean_url = gensub(/"(GET|POST)\s+([^ ]+)\s+HTTP.*/, "\\2", "g", $0)

    # Use patsplit to extract URL query tokens
    patsplit(clean_url, tokens, /[a-zA-Z0-9_]+/)

    requests[ip]++
    total_bytes[ip] += bytes
    endpoints[clean_url]++
}

END {
    print "\n--- Summary Report ---"
    for (ip in requests) {
        printf "IP: %-15s | Requests: %4d | Total Bytes: %d\n", ip, requests[ip], total_bytes[ip]
    }
    
    print "\nTop Endpoints:"
    for (url in endpoints) {
        print "  ->", url, "(hits:", endpoints[url] ")"
    }
}
`,
  namespaces: `@namespace "parser"
@include "json_helpers.awk"
@load "file_funcs"

# Convert CSV to JSON Records
function escape_json(str) {
    gsub(/"/, "\\\\\"", str)
    gsub(/\n/, "\\n", str)
    return str
}

BEGIN {
    FS = ","
    OFS = ""
    print "["
}

NR == 1 {
    # Header line: store field names
    for (i = 1; i <= NF; i++) {
        headers[i] = $i
    }
    next
}

{
    if (NR > 2) print ","
    printf "  {\n"
    for (i = 1; i <= NF; i++) {
        val = escape_json($i)
        printf "    \"%s\": \"%s\"%s\n", headers[i], val, (i < NF ? "," : "")
    }
    printf "  }"
}

END {
    print "\n]"
    print "Total Records Processed:", NR - 1
}
`,
  timeBitwise: `# GNU AWK Time & Bitwise Demonstration
BEGIN {
    now = systime()
    print "Current Epoch Timestamp:", now
    print "Formatted UTC Date:     ", strftime("%Y-%m-%d %H:%M:%S", now, 1)

    # Parse specific date string into epoch
    parsed = mktime("2026 08 08 14 30 00")
    print "Parsed Date Epoch:      ", parsed

    print "\n--- Bitwise Operations ---"
    a = 0x0F  # 15
    b = 0x33  # 51

    print "a AND b: ", and(a, b)
    print "a OR b:  ", or(a, b)
    print "a XOR b: ", xor(a, b)
    print "LSHIFT 2:", lshift(a, 2)
    print "RSHIFT 1:", rshift(b, 1)
    print "COMPL a: ", compl(a)

    print "\n--- Dynamic Type Check ---"
    arr[1] = "gawk"
    print "typeof(now):", typeof(now)
    print "typeof(arr):", typeof(arr)
    print "isarray(arr):", isarray(arr)
}
`,
  diagnostics: `# Linter Syntax Error Diagnostics Demo
@include "unclosed_quotes.awk
@invalid_directive "test"

function broken_func {
    print "Missing parenthesis in function definition"
}

BEGIN {
    msg = "This string is unterminated
    bad_regex = /unclosed_regex

    if (x > 10 {
        print "Missing closing paren in if condition"
    }

    # Unmatched closing brace
    print "Done"
} }
`
};

// Theme compartment
const themeCompartment = new Compartment();
let isDarkTheme = true;

// Initialize Editor
const editorContainer = document.getElementById('editor-container')!;

const view = new EditorView({
  doc: SAMPLES.logParser,
  extensions: [
    basicSetup,
    gawk({ lint: true, autocomplete: true }),
    themeCompartment.of(gawkDarkTheme),
    EditorView.updateListener.of((update: ViewUpdate) => {
      if (update.docChanged) {
        updateTokenInspector();
      }
    })
  ],
  parent: editorContainer
});

// Update Token Inspector
function updateTokenInspector() {
  const container = document.getElementById('tokens-container');
  const countBadge = document.getElementById('token-count');
  if (!container || !countBadge) return;

  const code = view.state.doc.toString();
  const tokens: { text: string; type: string }[] = [];

  // Stream tokenize lines
  const lines = code.split('\n');
  const state = gawkStreamParser.startState();

  for (const line of lines) {
    const stream = {
      string: line,
      pos: 0,
      eol() {
        return this.pos >= this.string.length;
      },
      peek() {
        return this.string[this.pos] || null;
      },
      next() {
        return this.string[this.pos++] || null;
      },
      eat(match: string | RegExp) {
        const ch = this.peek();
        if (ch && (typeof match === 'string' ? ch === match : match.test(ch))) {
          this.pos++;
          return ch;
        }
        return null;
      },
      eatWhile(match: string | RegExp) {
        let res = false;
        while (this.eat(match)) res = true;
        return res;
      },
      eatSpace() {
        let res = false;
        while (/\s/.test(this.peek() || '')) {
          this.pos++;
          res = true;
        }
        return res;
      },
      skipToEnd() {
        this.pos = this.string.length;
      },
      match(pattern: RegExp | string) {
        const substr = this.string.slice(this.pos);
        if (typeof pattern === 'string') {
          if (substr.startsWith(pattern)) {
            this.pos += pattern.length;
            return true;
          }
          return false;
        }
        const m = substr.match(pattern);
        if (m && m.index === 0) {
          this.pos += m[0].length;
          return m;
        }
        return false;
      },
      current() {
        return this.string.slice(startPos, this.pos);
      }
    };

    let startPos = 0;
    while (!stream.eol()) {
      startPos = stream.pos;
      const type = gawkStreamParser.token(stream as any, state);
      const text = stream.current();
      if (type && text.trim()) {
        tokens.push({ text: text.trim(), type });
      }
    }
  }

  countBadge.textContent = `${tokens.length} tokens`;
  container.innerHTML = tokens
    .slice(0, 50)
    .map(
      (tok) => `
    <div class="token-card">
      <span class="token-text">${escapeHtml(tok.text)}</span>
      <span class="token-type">${escapeHtml(tok.type)}</span>
    </div>
  `
    )
    .join('');
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Preset Selector
const sampleSelect = document.getElementById('sample-select') as HTMLSelectElement;
sampleSelect.addEventListener('change', () => {
  const key = sampleSelect.value as keyof typeof SAMPLES;
  if (SAMPLES[key]) {
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: SAMPLES[key] }
    });
  }
});

// Theme Toggle
const themeBtn = document.getElementById('theme-toggle')!;
themeBtn.addEventListener('click', () => {
  isDarkTheme = !isDarkTheme;
  document.body.className = isDarkTheme ? 'dark-theme' : 'light-theme';
  themeBtn.innerHTML = isDarkTheme ? '<span class="theme-icon">☀️</span> Light Mode' : '<span class="theme-icon">🌙</span> Dark Mode';
  view.dispatch({
    effects: themeCompartment.reconfigure(isDarkTheme ? gawkDarkTheme : gawkLightTheme)
  });
});

// Tab Switcher
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const tabId = btn.getAttribute('data-tab');
    tabBtns.forEach((b) => b.classList.remove('active'));
    tabContents.forEach((c) => c.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(tabId!)?.classList.add('active');
  });
});

// Quick Snippet Chips
document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    const snippetText = chip.getAttribute('data-snippet');
    if (snippetText) {
      const cursor = view.state.selection.main.head;
      view.dispatch({
        changes: { from: cursor, insert: snippetText },
        selection: { anchor: cursor + snippetText.length }
      });
      view.focus();
    }
  });
});

// Simulator Execution
const runSimBtn = document.getElementById('run-sim-btn')!;
const simOutput = document.getElementById('sim-output')!;

runSimBtn.addEventListener('click', () => {
  const sampleKey = sampleSelect.value;
  simOutput.className = 'console-code output-success';

  if (sampleKey === 'logParser') {
    simOutput.textContent = `=== GNU AWK Log Analysis Started ===
Processing environment: gawk_user
Starting file #1: access.log

--- Summary Report ---
IP: 192.168.1.10     | Requests:    2 | Total Bytes: 4753
IP: 10.0.0.45        | Requests:    1 | Total Bytes: 128

Top Endpoints:
  -> /api/v1/data (hits: 1)
  -> /api/v1/login (hits: 1)
  -> /favicon.ico (hits: 1)`;
  } else if (sampleKey === 'namespaces') {
    simOutput.textContent = `[
  {
    "id": "101",
    "user": "alice",
    "role": "admin"
  },
  {
    "id": "102",
    "user": "bob",
    "role": "editor"
  }
]
Total Records Processed: 2`;
  } else if (sampleKey === 'timeBitwise') {
    simOutput.textContent = `Current Epoch Timestamp: 1786199400
Formatted UTC Date:      2026-08-08 14:30:00
Parsed Date Epoch:       1786199400

--- Bitwise Operations ---
a AND b:  3
a OR b:   63
a XOR b:  60
LSHIFT 2: 60
RSHIFT 1: 25
COMPL a:  -16

--- Dynamic Type Check ---
typeof(now): number
typeof(arr): array
isarray(arr): 1`;
  } else {
    simOutput.className = 'console-code';
    simOutput.style.color = '#ef4444';
    simOutput.textContent = `awk: diagnostics.awk:2: @include "unclosed_quotes.awk
awk: diagnostics.awk:2:           ^ unterminated string
awk: diagnostics.awk:3: error: unknown directive '@invalid_directive'
awk: diagnostics.awk:5: error: missing '(' in function definition 'broken_func'
awk: diagnostics.awk:19: error: unmatched closing brace '}'`;
  }
});

// Initial Token Render
updateTokenInspector();
