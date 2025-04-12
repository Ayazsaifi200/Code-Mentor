/**
 * Comprehensive code analysis service for multiple languages
 */
// Import only what's needed
import { analyzeCode as apiAnalyzeCode, getLearningPath } from './api';

// JavaScript-specific terms
const jsTerms = {
  keywords: [
    'abstract', 'arguments', 'await', 'boolean', 'break', 'byte', 'case', 'catch', 
    'char', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do',
    'double', 'else', 'enum', 'eval', 'export', 'extends', 'false', 'final',
    'finally', 'float', 'for', 'function', 'goto', 'if', 'implements', 'import',
    'in', 'instanceof', 'int', 'interface', 'let', 'long', 'native', 'new', 'null',
    'package', 'private', 'protected', 'public', 'return', 'short', 'static',
    'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient',
    'true', 'try', 'typeof', 'var', 'void', 'volatile', 'while', 'with', 'yield'
  ],
  
  builtIns: [
    'Array', 'Boolean', 'Date', 'Error', 'Function', 'JSON', 'Math', 'Number',
    'Object', 'Promise', 'Proxy', 'RegExp', 'Set', 'String', 'Symbol', 'Map',
    'WeakMap', 'WeakSet'
  ],
  
  methods: [
    'forEach', 'map', 'filter', 'reduce', 'some', 'every', 'find', 'findIndex',
    'indexOf', 'includes', 'join', 'slice', 'splice', 'push', 'pop', 'shift'
  ],
  
  webAPIs: [
    'document', 'window', 'navigator', 'console', 'localStorage', 'fetch'
  ]
};

// Python-specific terms
const pythonTerms = {
  keywords: [
    'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue',
    'def', 'del', 'elif', 'else', 'except', 'False', 'finally', 'for',
    'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'None',
    'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'True',
    'try', 'while', 'with', 'yield'
  ],
  
  builtIns: [
    'abs', 'all', 'any', 'bool', 'dict', 'dir', 'float', 'int', 'len',
    'list', 'map', 'max', 'min', 'open', 'print', 'range', 'set', 'str', 'sum'
  ],
  
  methods: [
    'append', 'extend', 'insert', 'remove', 'pop', 'clear', 'sort', 'reverse',
    'copy', 'get', 'items', 'keys', 'values', 'update', 'read', 'write'
  ],
  
  libraries: [
    'numpy', 'pandas', 'matplotlib', 'scipy', 'sklearn', 'tensorflow',
    'django', 'flask', 'requests', 'os', 'sys', 're', 'math', 'datetime'
  ]
};

// Java-specific terms
const javaTerms = {
  keywords: [
    'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
    'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum',
    'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements',
    'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new',
    'package', 'private', 'protected', 'public', 'return', 'short', 'static',
    'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws',
    'transient', 'try', 'void', 'volatile', 'while'
  ],
  
  standardClasses: [
    'String', 'Integer', 'Boolean', 'System', 'Math', 'Object', 'Exception',
    'ArrayList', 'HashMap', 'Scanner'
  ],
  
  commonMethods: [
    'println', 'print', 'charAt', 'equals', 'substring', 'toString',
    'length', 'valueOf', 'compareTo', 'contains', 'indexOf'
  ]
};

// Define Java keywords, methods, and identifiers
const javaKeywords = new Set(javaTerms.keywords);
const commonMethods = {
  'println': ['print', 'printline', 'pintln', 'printn', 'pringln', 'printLn'],
  'length': ['lenght', 'lengt', 'lenth', 'lenghth', 'lngth', 'legnth'],
  'charAt': ['charat', 'charAT', 'chatat', 'chartat', 'cahrAt'],
  'equals': ['equal', 'equalss', 'equls', 'eqals', 'equalz'],
  'substring': ['subString', 'substr', 'substing', 'subsring'],
  'toString': ['tostring', 'toStr', 'tooString', 'to_string'] 
};

const commonIdentifiers = {
  'System': ['Sistem', 'Sytem', 'system', 'Systemm', 'Systemout'],
  'out': ['ot', 'output', 'Out', 'outt', 'oout'],
  'println': ['print', 'printline', 'pintln', 'printn', 'pringln'],
  'print': ['prin', 'primt', 'prit', 'pnt', 'prnt'],
  'main': ['man', 'mian', 'maine', 'mainn', 'mein']
};

// Create dictionaries for comprehensive spell checking
const jsDictionaries = {
  'keyword': jsTerms.keywords,
  'built-in': jsTerms.builtIns,
  'method': jsTerms.methods,
  'webAPI': jsTerms.webAPIs
};

const pyDictionaries = {
  'keyword': pythonTerms.keywords,
  'built-in': pythonTerms.builtIns,
  'method': pythonTerms.methods,
  'library': pythonTerms.libraries
};

const javaDictionaries = {
  'keyword': javaTerms.keywords,
  'class': javaTerms.standardClasses,
  'method': javaTerms.commonMethods
};

// JavaScript analyzer
export const analyzeJavaScript = (code) => {
  if (!code || !code.trim()) return [];
  
  const feedback = [];
  const lines = code.split('\n');
  
  // Track line numbers (1-based)
  let lineNum = 0;
  
  // Track variables for scoping
  const declaredVars = new Set();
  const usedVars = new Set();
  
  // Track bracket balance
  let bracketBalance = 0;
  let curlyBalance = 0;
  let parenBalance = 0;
  
  // Add these dictionary objects
  const jsKeywords = new Set(jsTerms.keywords);
  
  const commonJsFunctions = jsTerms.methods;
  
  // Safe identifiers to ignore
  const commonIdNames = new Set(['i', 'j', 'k', 'n', 'x', 'y', 'z', 'e', 'ev', 'err', 'cb', 'fn', 'el', 'obj', 'val', 'idx']);
  
  // Analyze each line
  lines.forEach((line, index) => {
    lineNum = index + 1;
    const trimmedLine = line.trim();
    
    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('//')) return;
    
    // Check for missing semicolons
    if (trimmedLine && !trimmedLine.endsWith(';') && 
        !trimmedLine.endsWith('{') && 
        !trimmedLine.endsWith('}') && 
        !trimmedLine.endsWith('(') &&
        !trimmedLine.endsWith(')') &&
        !trimmedLine.startsWith('import') &&
        !trimmedLine.startsWith('export') &&
        !trimmedLine.startsWith('//') &&
        !trimmedLine.includes(' if ') &&
        !trimmedLine.includes(' else ') &&
        !trimmedLine.includes(' for ') &&
        !trimmedLine.includes(' while ')) {
      feedback.push({
        id: `semicolon-${lineNum}`,
        type: 'warning',
        message: 'Missing semicolon',
        line: lineNum,
        code: line,
        suggestion: `${line};`
      });
    }
    
    // Other checks continue...
    // Check var vs let/const
    if (trimmedLine.match(/\bvar\s+/)) {
      feedback.push({
        id: `var-to-const-${lineNum}`,
        type: 'suggestion',
        message: 'Consider using const or let instead of var',
        line: lineNum,
        code: line,
        suggestion: line.replace(/\bvar\b/, 'const')
      });
    }
    
    // Track variable declarations
    const varDeclaration = trimmedLine.match(/\b(var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
    if (varDeclaration) {
      declaredVars.add(varDeclaration[2]);
    }
    
    // Track variable usage
    const words = trimmedLine.match(/\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g) || [];
    words.forEach(word => {
      if (declaredVars.has(word)) {
        usedVars.add(word);
      }
    });
    
    // Track bracket balance
    [...trimmedLine].forEach(char => {
      if (char === '{') curlyBalance++;
      if (char === '}') curlyBalance--;
      if (char === '[') bracketBalance++;
      if (char === ']') bracketBalance--;
      if (char === '(') parenBalance++;
      if (char === ')') parenBalance--;
    });
  });
  
  // Check for unbalanced brackets
  if (curlyBalance !== 0) {
    feedback.push({
      id: 'unbalanced-curly',
      type: 'error',
      message: `Unbalanced curly braces: ${curlyBalance > 0 ? 'Missing ' + curlyBalance + ' closing' : 'Extra ' + Math.abs(curlyBalance) + ' closing'}`,
      line: lines.length,
      code: "// Check your code",
      suggestion: "// Ensure all curly braces {} are properly matched"
    });
  }
  
  // Check for unused variables
  declaredVars.forEach(variable => {
    if (!usedVars.has(variable)) {
      // Find the line where this variable was declared
      let declarationLine = 1;
      lines.forEach((line, idx) => {
        if (line.match(new RegExp(`\\b(var|let|const)\\s+${variable}\\b`))) {
          declarationLine = idx + 1;
        }
      });
      
      feedback.push({
        id: `unused-var-${variable}`,
        type: 'warning',
        message: `Unused variable: ${variable}`,
        line: declarationLine,
        code: lines[declarationLine - 1],
        suggestion: `// Remove unused variable: ${variable}`
      });
    }
  });
  
  return feedback;
};

// Python analyzer
export const analyzePython = (code) => {
  if (!code || !code.trim()) return [];
  
  const feedback = [];
  const lines = code.split('\n');
  
  // Common Python variable names to ignore
  const commonPyVars = new Set(['i', 'j', 'k', 'n', 'x', 'y', 'z', 'f', 'df', 'db', 'fn', 'obj', 'val', 'cls', 'self']);
  
  // Process each line
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmedLine = line.trim();
    
    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('#')) return;
    
    // Check for potential Python errors
    // ...
    
    // Look for PEP 8 style violations
    if (trimmedLine.length > 79) {
      feedback.push({
        id: `line-too-long-${lineNum}`,
        type: 'warning',
        message: 'Line too long (>79 characters)',
        line: lineNum,
        code: line,
        suggestion: '# Consider breaking this line into multiple lines'
      });
    }
    
    // Check for inconsistent indentation
    const indentMatch = line.match(/^(\s*)/);
    if (indentMatch && indentMatch[1].length % 4 !== 0 && trimmedLine.length > 0) {
      feedback.push({
        id: `indent-${lineNum}`,
        type: 'warning',
        message: 'Inconsistent indentation. Use 4 spaces per level.',
        line: lineNum,
        code: line,
        suggestion: ' '.repeat(Math.round(indentMatch[1].length / 4) * 4) + trimmedLine
      });
    }
  });
  
  return feedback;
};

// Java analyzer
export const analyzeJava = (code) => {
  // Simple, quick checks for common errors
  // ...just 10-20 common patterns
};

/**
 * Frontend service for code analysis that calls the backend API
 * @param {string} code - The code to analyze
 * @param {string} language - The programming language of the code
 * @returns {Promise<Array>} - Array of feedback items
 */
export const analyzeCode = async (code, language) => {
  if (!code || !code.trim()) return [];
  
  console.log(`Analyzing ${language} code...`);
  
  // 1. Use client-side analysis first
  let quickResults = [];
  switch(language) {
    case 'javascript':
      quickResults = analyzeJavaScript(code);
      break;
    case 'python':
      quickResults = analyzePython(code);
      break;
    case 'java':
      quickResults = analyzeJava(code);
      break;
    default:
      quickResults = [];
  }
  
  // 2. Then get backend analysis
  try {
    const backendResponse = await apiAnalyzeCode(code, language);
    const backendResults = backendResponse.issues || [];
    
    // 3. Combine results (avoiding duplicates)
    const allResults = [...quickResults, ...backendResults];
    
    // Sort results by line number
    allResults.sort((a, b) => a.line - b.line);
    
    return allResults;
    
  } catch (error) {
    console.error('Error analyzing code:', error);
    
    // Fallback to client-side only if backend fails
    return quickResults;
  }
};

/**
 * Get list of supported languages from the backend
 * @returns {Promise<Array>} - Array of supported languages
 */
export const getSupportedLanguages = async () => {
  try {
    return await getLearningPath();
  } catch (error) {
    console.error('Error fetching supported languages:', error);
    return [];
  }
};

// Named export object
const codeAnalysisService = {
  analyzeCode,
  getSupportedLanguages,
  analyzeJava,
  analyzeJavaScript,
  analyzePython
};

export default codeAnalysisService;

