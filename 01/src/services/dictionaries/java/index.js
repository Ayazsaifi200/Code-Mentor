/**
 * Exports all Java dictionaries for comprehensive error detection
 */

// Java keywords
export const javaKeywords = new Set([
  'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 
  'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum',
  'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements',
  'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'package',
  'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp',
  'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient',
  'try', 'void', 'volatile', 'while', 'true', 'false', 'null'
]);

// Standard Java classes
export const standardClasses = [
  'String', 'Integer', 'Long', 'Double', 'Float', 'Boolean', 'Character',
  'Byte', 'Short', 'Math', 'System', 'Object', 'Class', 'Exception',
  'RuntimeException', 'Throwable', 'Error', 'Thread', 'Runnable',
  'StringBuilder', 'StringBuffer', 'ArrayList', 'LinkedList', 'HashMap',
  'HashSet', 'TreeMap', 'TreeSet', 'Collections', 'Arrays', 'List',
  'Set', 'Map', 'Queue', 'Stack', 'Vector', 'Enumeration', 'Iterator',
  'Scanner', 'File', 'InputStream', 'OutputStream', 'Reader', 'Writer'
];

// Common keyword misspellings
export const keywordMisspellings = {
  'public': ['pubic', 'publik', 'publc', 'pulic', 'pulbic', 'pbulic', 'pblic'],
  'private': ['privat', 'privte', 'privet', 'prvate', 'priviate', 'privatte'],
  'protected': ['protcted', 'protectd', 'proteced', 'proteted', 'proected'],
  'static': ['statc', 'staic', 'sttic', 'statik', 'stattic', 'staatic'],
  'void': ['vid', 'vod', 'viod', 'voyd', 'voud', 'vioid', 'vold'],
  'class': ['clas', 'clss', 'klass', 'classs', 'calss', 'claas', 'claess'],
  'extends': ['exteds', 'extens', 'xtends', 'extnds', 'extands'],
  'implements': ['implments', 'implemets', 'implemnts', 'implemens'],
  'interface': ['intrface', 'interace', 'inteface', 'interfce'],
  'return': ['retun', 'reutrn', 'retrun', 'retrn', 'rteurn', 'rturn'],
  'int': ['In', 'Int', 'inte', 'itn', 'INT', 'INt', 'iint'],
  'double': ['doble', 'doubl', 'doubel', 'duble', 'doublee', 'doublle'],
  'boolean': ['booleen', 'boolea', 'boolan', 'bolean', 'booliean'],
  // Add other misspellings as needed
};

// Common method misspellings
export const commonMethods = {
  'println': ['print', 'printline', 'pintln', 'printn', 'pringln', 'printLn'],
  'length': ['lenght', 'lengt', 'lenth', 'lenghth', 'lngth', 'legnth'],
  'charAt': ['charat', 'charAT', 'chatat', 'chartat', 'cahrAt'],
  'equals': ['equal', 'equalss', 'equls', 'eqals', 'equalz'],
  'substring': ['subString', 'substr', 'substing', 'subsring'],
  'toString': ['tostring', 'toStr', 'tooString', 'to_string'],
  'indexOf': ['indexof', 'idexOf', 'indxOf', 'indexff'],
  'parseInt': ['parseint', 'parselnt', 'parseINt', 'parsInt'],
  'toLowerCase': ['tolowercase', 'tolowecase', 'tolowrcase']
};

// Common identifier misspellings
export const commonIdentifiers = {
  'System': ['Sistem', 'Sytem', 'system', 'Systemm', 'Systemout'],
  'out': ['ot', 'output', 'Out', 'outt', 'oout'],
  'println': ['print', 'printline', 'pintln', 'printn', 'pringln'],
  'print': ['prin', 'primt', 'prit', 'pnt', 'prnt'],
  'main': ['man', 'mian', 'maine', 'mainn', 'mein']
};

// Common Java syntax patterns for detection
export const syntaxPatterns = [
  // Semicolon in control structures
  { pattern: /if\s*\(.*\)\s*;/, message: 'Semicolon after if statement creates an empty block' },
  { pattern: /for\s*\(.*\)\s*;/, message: 'Semicolon after for statement creates an empty loop' },
  { pattern: /while\s*\(.*\)\s*;/, message: 'Semicolon after while statement creates an empty loop' },
  
  // Function call mistakes
  { pattern: /([a-zA-Z0-9_]+)\s+\(/, message: 'Space between function name and opening parenthesis' },
  
  // System.out errors
  { pattern: /System\.out\.(println|print);/, message: 'Missing parentheses in println/print call' },
  { pattern: /System\.(Out)\./, message: 'Incorrect capitalization: should be "System.out"' },
  { pattern: /system\.out\./, message: 'Incorrect capitalization: should be "System.out"' }
];

// Export combined dictionaries for comprehensive spell checking
export const javaDictionaries = {
  keywords: Array.from(javaKeywords),
  standardClasses,
  methods: Object.keys(commonMethods),
  identifiers: Object.keys(commonIdentifiers)
};

export default {
  javaKeywords,
  keywordMisspellings,
  standardClasses,
  commonMethods,
  commonIdentifiers,
  syntaxPatterns,
  javaDictionaries
};