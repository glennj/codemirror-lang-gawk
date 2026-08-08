export interface FunctionDoc {
  name: string;
  signature: string;
  detail: string;
  doc: string;
  type: 'math' | 'string' | 'time' | 'bitwise' | 'io' | 'gawk';
}

/**
 * Standard AWK and GNU AWK Pattern Blocks
 */
export const GAWK_PATTERNS = new Set(['BEGIN', 'END', 'BEGINFILE', 'ENDFILE']);

/**
 * AWK and GNU AWK Control Flow Keywords
 */
export const GAWK_KEYWORDS = new Set([
  'if',
  'else',
  'while',
  'do',
  'for',
  'in',
  'break',
  'continue',
  'next',
  'nextfile',
  'exit',
  'return',
  'delete',
  'function',
  'func'
]);

/**
 * GNU AWK Specific Directives
 */
export const GAWK_DIRECTIVES = new Set(['@include', '@load', '@namespace']);

/**
 * Standard AWK & GNU AWK Built-in Special Variables
 */
export const GAWK_BUILTIN_VARS = new Set([
  // Standard AWK
  'ARGC',
  'ARGV',
  'CONVFMT',
  'ENVIRON',
  'FILENAME',
  'FNR',
  'FS',
  'NF',
  'NR',
  'OFMT',
  'OFS',
  'ORS',
  'RLENGTH',
  'RS',
  'RSTART',
  'SUBSEP',
  // GNU AWK Extensions
  'ARGIND',
  'BINMODE',
  'ERRNO',
  'FIELDWIDTHS',
  'FPAT',
  'FUNCTAB',
  'LINT',
  'PREC',
  'ROUNDMODE',
  'RT',
  'STRTAB',
  'SYMTAB',
  'TEXTDOMAIN'
]);

/**
 * Built-in Functions dictionary with rich completion documentation
 */
export const GAWK_BUILTIN_FUNCTIONS: Record<string, FunctionDoc> = {
  // Math Functions
  atan2: {
    name: 'atan2',
    signature: 'atan2(y, x)',
    detail: 'Math function',
    doc: 'Returns the arctangent of y/x in radians.',
    type: 'math'
  },
  cos: {
    name: 'cos',
    signature: 'cos(x)',
    detail: 'Math function',
    doc: 'Returns the cosine of x (x in radians).',
    type: 'math'
  },
  exp: {
    name: 'exp',
    signature: 'exp(x)',
    detail: 'Math function',
    doc: 'Returns the exponential function of x (e^x).',
    type: 'math'
  },
  int: {
    name: 'int',
    signature: 'int(x)',
    detail: 'Math function',
    doc: 'Truncates x to an integer value towards zero.',
    type: 'math'
  },
  log: {
    name: 'log',
    signature: 'log(x)',
    detail: 'Math function',
    doc: 'Returns the natural logarithm of x.',
    type: 'math'
  },
  rand: {
    name: 'rand',
    signature: 'rand()',
    detail: 'Math function',
    doc: 'Returns a random floating point number r such that 0 <= r < 1.',
    type: 'math'
  },
  sin: {
    name: 'sin',
    signature: 'sin(x)',
    detail: 'Math function',
    doc: 'Returns the sine of x (x in radians).',
    type: 'math'
  },
  sqrt: {
    name: 'sqrt',
    signature: 'sqrt(x)',
    detail: 'Math function',
    doc: 'Returns the square root of x.',
    type: 'math'
  },
  srand: {
    name: 'srand',
    signature: 'srand([x])',
    detail: 'Math function',
    doc: 'Sets the seed for rand() to x and returns the previous seed. If x omitted, uses current time.',
    type: 'math'
  },

  // String Functions
  asort: {
    name: 'asort',
    signature: 'asort(source [, dest [, how]])',
    detail: 'gawk String / Array function',
    doc: 'Sorts array source by values. If dest given, source is duplicated into dest before sorting.',
    type: 'string'
  },
  asorti: {
    name: 'asorti',
    signature: 'asorti(source [, dest [, how]])',
    detail: 'gawk String / Array function',
    doc: 'Sorts array source by indices instead of values into dest array.',
    type: 'string'
  },
  gensub: {
    name: 'gensub',
    signature: 'gensub(regex, replacement, how [, target])',
    detail: 'gawk String function',
    doc: 'Substitutes replacement for regex in target (or $0). how can be "g", "G", or a number N for Nth match.',
    type: 'string'
  },
  gsub: {
    name: 'gsub',
    signature: 'gsub(regex, replacement [, target])',
    detail: 'String function',
    doc: 'Globally substitutes replacement for regex in target (or $0). Returns number of substitutions made.',
    type: 'string'
  },
  index: {
    name: 'index',
    signature: 'index(str, target)',
    detail: 'String function',
    doc: 'Returns the 1-based position of target substring in str, or 0 if not found.',
    type: 'string'
  },
  length: {
    name: 'length',
    signature: 'length([str_or_arr])',
    detail: 'String / Array function',
    doc: 'Returns the length of string str or number of elements in array. Defaults to length($0).',
    type: 'string'
  },
  match: {
    name: 'match',
    signature: 'match(str, regex [, array])',
    detail: 'String function',
    doc: 'Searches str for regex match. Sets RSTART, RLENGTH, and populates submatch array in gawk.',
    type: 'string'
  },
  patsplit: {
    name: 'patsplit',
    signature: 'patsplit(str, arr [, regex [, seps]])',
    detail: 'gawk String function',
    doc: 'Splits str into arr matching regex pattern instead of field separators.',
    type: 'string'
  },
  split: {
    name: 'split',
    signature: 'split(str, arr [, regex [, seps]])',
    detail: 'String function',
    doc: 'Splits str into arr elements indexed from 1 using field separator regex (or FS).',
    type: 'string'
  },
  sprintf: {
    name: 'sprintf',
    signature: 'sprintf(fmt, expr1, ...)',
    detail: 'String function',
    doc: 'Formats expressions according to printf format specifier fmt and returns string.',
    type: 'string'
  },
  strtonum: {
    name: 'strtonum',
    signature: 'strtonum(str)',
    detail: 'gawk String function',
    doc: 'Examines str and returns numeric value. Supports decimal, octal (leading 0), and hex (leading 0x/0X).',
    type: 'string'
  },
  sub: {
    name: 'sub',
    signature: 'sub(regex, replacement [, target])',
    detail: 'String function',
    doc: 'Substitutes first match of regex with replacement in target (or $0). Returns 1 if matched, else 0.',
    type: 'string'
  },
  substr: {
    name: 'substr',
    signature: 'substr(str, start [, length])',
    detail: 'String function',
    doc: 'Returns substring of str starting at 1-based start index up to length characters.',
    type: 'string'
  },
  tolower: {
    name: 'tolower',
    signature: 'tolower(str)',
    detail: 'String function',
    doc: 'Returns copy of str converted to lowercase.',
    type: 'string'
  },
  toupper: {
    name: 'toupper',
    signature: 'toupper(str)',
    detail: 'String function',
    doc: 'Returns copy of str converted to uppercase.',
    type: 'string'
  },

  // Time Functions (GNU AWK)
  mktime: {
    name: 'mktime',
    signature: 'mktime(datespec [, utc])',
    detail: 'gawk Time function',
    doc: 'Converts "YYYY MM DD HH MM SS [DST]" datespec into epoch timestamp in seconds.',
    type: 'time'
  },
  strftime: {
    name: 'strftime',
    signature: 'strftime([fmt [, timestamp [, utc]]])',
    detail: 'gawk Time function',
    doc: 'Formats timestamp (or current time) using strftime format specifier fmt.',
    type: 'time'
  },
  systime: {
    name: 'systime',
    signature: 'systime()',
    detail: 'gawk Time function',
    doc: 'Returns current time as number of seconds since POSIX epoch.',
    type: 'time'
  },

  // Bitwise Functions (GNU AWK)
  and: {
    name: 'and',
    signature: 'and(v1, v2, ...)',
    detail: 'gawk Bitwise function',
    doc: 'Returns bitwise AND of arguments.',
    type: 'bitwise'
  },
  compl: {
    name: 'compl',
    signature: 'compl(val)',
    detail: 'gawk Bitwise function',
    doc: 'Returns bitwise complement (NOT) of val.',
    type: 'bitwise'
  },
  lshift: {
    name: 'lshift',
    signature: 'lshift(val, count)',
    detail: 'gawk Bitwise function',
    doc: 'Returns val shifted left by count bits.',
    type: 'bitwise'
  },
  rshift: {
    name: 'rshift',
    signature: 'rshift(val, count)',
    detail: 'gawk Bitwise function',
    doc: 'Returns val shifted right by count bits.',
    type: 'bitwise'
  },
  or: {
    name: 'or',
    signature: 'or(v1, v2, ...)',
    detail: 'gawk Bitwise function',
    doc: 'Returns bitwise OR of arguments.',
    type: 'bitwise'
  },
  xor: {
    name: 'xor',
    signature: 'xor(v1, v2, ...)',
    detail: 'gawk Bitwise function',
    doc: 'Returns bitwise exclusive OR (XOR) of arguments.',
    type: 'bitwise'
  },

  // Type & I/O Functions
  isarray: {
    name: 'isarray',
    signature: 'isarray(x)',
    detail: 'gawk Type function',
    doc: 'Returns 1 if x is an array, else 0.',
    type: 'gawk'
  },
  typeof: {
    name: 'typeof',
    signature: 'typeof(x)',
    detail: 'gawk Type function',
    doc: 'Returns string indicating type of x ("array", "number", "string", "regexp", "unassigned", "untyped").',
    type: 'gawk'
  },
  close: {
    name: 'close',
    signature: 'close(filename_or_cmd [, how])',
    detail: 'I/O function',
    doc: 'Closes an open file or pipe connection.',
    type: 'io'
  },
  fflush: {
    name: 'fflush',
    signature: 'fflush([filename_or_cmd])',
    detail: 'I/O function',
    doc: 'Flushes pending output buffers for file/pipe or stdout if omitted.',
    type: 'io'
  },
  system: {
    name: 'system',
    signature: 'system(command)',
    detail: 'I/O function',
    doc: 'Executes operating system shell command and returns its exit status.',
    type: 'io'
  },

  // Internationalization (GNU AWK)
  bindtextdomain: {
    name: 'bindtextdomain',
    signature: 'bindtextdomain(dir [, domain])',
    detail: 'gawk i18n function',
    doc: 'Specifies directory for searching text domain MO files.',
    type: 'gawk'
  },
  dcgettext: {
    name: 'dcgettext',
    signature: 'dcgettext(string [, domain [, category]])',
    detail: 'gawk i18n function',
    doc: 'Returns localized translation of string for domain and category.',
    type: 'gawk'
  },
  dcngettext: {
    name: 'dcngettext',
    signature: 'dcngettext(string1, string2, number [, domain [, category]])',
    detail: 'gawk i18n function',
    doc: 'Returns plural-aware localized translation of string for number.',
    type: 'gawk'
  }
};
