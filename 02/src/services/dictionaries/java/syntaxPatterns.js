/**
 * Java syntax patterns for common errors and patterns
 */
const syntaxPatterns = {
  // Semicolon errors
  semicolons: [
    { pattern: /if\s*\(.*\)\s*;/, message: 'Semicolon after if statement creates an empty block' },
    { pattern: /for\s*\(.*\)\s*;/, message: 'Semicolon after for statement creates an empty loop' },
    { pattern: /while\s*\(.*\)\s*;/, message: 'Semicolon after while statement creates an empty loop' }
  ],
  
  // Common function call mistakes
  functionCalls: [
    { pattern: /([a-zA-Z0-9_]+)\s+\(/, message: 'Space between function name and opening parenthesis' }
  ],
  
  // Array declaration issues
  arrays: [
    { pattern: /(\w+)\[\s+\]/, message: 'Space between square brackets in array declaration' },
    { pattern: /(\w+)\s+\[\]/, message: 'Space between type and brackets in array declaration' }
  ],
  
  // Statement termination
  statementTermination: [
    { pattern: /;\s*;/, message: 'Multiple semicolons in a row' },
    { pattern: /}\s*;/, message: 'Semicolon after closing brace (typically unnecessary)' }
  ],
  
  // Main method declaration
  mainMethod: [
    { pattern: /public\s+static\s+void\s+main\s*\(\s*String\s+args\s*\)/, 
      message: 'Main method parameter should be String[] args' },
    { pattern: /public\s+void\s+static\s+main/, 
      message: 'Incorrect order of modifiers: should be "public static void main"' },
    { pattern: /public\s+static\s+main\s+void/, 
      message: 'Incorrect order: should be "public static void main"' }
  ],
  
  // Common System.out errors
  systemOut: [
    { pattern: /System\.out\.(println|print);/, message: 'Missing parentheses in println/print call' },
    { pattern: /System\.(Out)\./, message: 'Incorrect capitalization: should be "System.out"' },
    { pattern: /system\.out\./, message: 'Incorrect capitalization: should be "System.out"' }
  ],
  
  // Common initialization mistakes
  initialization: [
    { pattern: /new\s+(\w+)\[\]\s*=/, message: 'Invalid array initialization with new Type[] =' },
    { pattern: /new\s+(\w+)\s*\(\s*\)\s*\{/, message: 'Anonymous class creation needs class or interface type' }
  ],
  
  // Bracket and parentheses balancing
  brackets: [
    { pattern: /\{\s*\{/, message: 'Multiple opening braces without closing previous ones' },
    { pattern: /\}\s*\}/, message: 'Multiple closing braces without proper opening ones' }
  ],
  
  // Type conversion issues
  typeCasting: [
    { pattern: /\((\w+)\)\s*\(/, message: 'Double parentheses in type casting' },
    { pattern: /\(int\)\s+(\w+)/, message: 'Extra space after cast' }
  ],
  
  // Comparison and equality
  comparisons: [
    { pattern: /if\s*\(\s*(\w+)\s*=\s*(\w+)\s*\)/, message: 'Using assignment (=) instead of equality comparison (==) in condition' },
    { pattern: /(\w+)\.equals\(null\)/, message: 'Object.equals(null) will throw NullPointerException if object is null' }
  ],
  
  // Common exception handling errors
  exceptions: [
    { pattern: /catch\s*\(\s*Exception\s+\w+\s*\)\s*\{\s*\}/, message: 'Empty catch block suppresses exceptions' },
    { pattern: /throw\s+new\s+\w+Exception\s*\(\s*\)/, message: 'Exception thrown without a message' }
  ],
  
  // Other common syntax issues
  other: [
    { pattern: /\breturn\s+;/, message: 'Empty return statement in non-void method' },
    { pattern: /\bthis\s*=/, message: 'Cannot assign to "this"' },
    { pattern: /\bswitch\s*\(.*\)\s*\{\s*\}/, message: 'Empty switch statement' }
  ]
};

module.exports = syntaxPatterns;