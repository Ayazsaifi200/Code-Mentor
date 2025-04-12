/**
 * Complete set of Java keywords
 * Including all versions from Java 1.0 through Java 17
 */
const javaKeywords = new Set([
  // Java language keywords
  'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 
  'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum',
  'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements',
  'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'package',
  'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp',
  'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient',
  'try', 'void', 'volatile', 'while', 'true', 'false', 'null',
  // Java 9+
  'module', 'requires', 'exports', 'opens', 'uses', 'provides', 'with', 'to',
  // Java 10+
  'var',
  // Java 14+
  'record', 'sealed', 'permits',
  // Java 17+
  'yield'
]);

module.exports = javaKeywords;