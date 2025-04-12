const { ESLint } = require('eslint');
const acorn = require('acorn');
const walk = require('acorn-walk');

/**
 * Analyzes JavaScript code for issues and provides feedback
 */
exports.analyze = async (code) => {
  try {
    // Use ESLint to analyze code
    const eslint = new ESLint({
      useEslintrc: false,
      overrideConfig: {
        env: {
          browser: true,
          es2021: true,
          node: true
        },
        parserOptions: {
          ecmaVersion: 'latest',
          sourceType: 'module'
        },
        rules: {
          'no-unused-vars': 'warn',
          'no-var': 'warn',
          'prefer-const': 'warn',
          'no-console': 'warn',
          'eqeqeq': 'warn'
        }
      }
    });
    
    // Run ESLint
    const results = await eslint.lintText(code);
    
    // Format results
    const issues = results[0]?.messages.map(msg => ({
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: msg.severity === 2 ? 'error' : msg.severity === 1 ? 'warning' : 'suggestion',
      message: msg.message,
      line: msg.line,
      suggestion: getSuggestionForRule(msg.ruleId, code, msg)
    })) || [];
    
    // Add our custom analysis (beyond what ESLint catches)
    const customIssues = analyzeCustomPatterns(code);
    
    return {
      issues: [...issues, ...customIssues],
      summary: generateSummary(issues, customIssues)
    };
  } catch (error) {
    console.error('JavaScript analysis error:', error);
    return {
      issues: [
        {
          id: Date.now(),
          type: 'error',
          message: 'Failed to analyze JavaScript code',
          line: 1,
          suggestion: 'Check for syntax errors in your code'
        }
      ],
      summary: 'Analysis failed due to syntax or other errors'
    };
  }
};

/**
 * Performs more detailed analysis (for premium users)
 */
exports.detailedAnalysis = async (code) => {
  // Basic analysis
  const basicAnalysis = await exports.analyze(code);
  
  try {
    // Parse code to AST for more sophisticated analysis
    const ast = acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
    
    // Perform additional analysis using the AST
    const additionalIssues = analyzeAst(ast, code);
    
    // Add performance considerations
    const performanceIssues = analyzePerformance(code, ast);
    
    // Add best practice recommendations
    const bestPracticeIssues = analyzeBestPractices(code);
    
    return {
      ...basicAnalysis,
      issues: [...basicAnalysis.issues, ...additionalIssues, ...performanceIssues, ...bestPracticeIssues],
      codeComplexity: calculateComplexity(ast),
      suggestions: generateSuggestions(code, ast)
    };
  } catch (error) {
    console.error('Detailed JavaScript analysis error:', error);
    return basicAnalysis;
  }
};

/**
 * JavaScript code analyzer with comprehensive error detection
 */
const { SpellingUtils } = require('../utils/spellingUtils');

/**
 * Analyzes JavaScript code for errors, warnings, and suggestions
 * @param {string} code - The JavaScript code to analyze
 * @returns {Array} - Array of feedback items with errors, warnings, and suggestions
 */
function analyzeJavaScript(code) {
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
  
  // JavaScript keywords and common functions
  const jsKeywords = new Set([
    'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
    'default', 'delete', 'do', 'else', 'export', 'extends', 'false',
    'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof',
    'new', 'null', 'return', 'super', 'switch', 'this', 'throw',
    'true', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield',
    'let', 'static', 'enum', 'await', 'async'
  ]);
  
  const commonJsFunctions = [
    'forEach', 'map', 'filter', 'reduce', 'find', 'some', 'every',
    'includes', 'indexOf', 'lastIndexOf', 'slice', 'splice', 'concat',
    'join', 'split', 'replace', 'toUpperCase', 'toLowerCase',
    'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'toString',
    'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
    'addEventListener', 'removeEventListener', 'querySelector',
    'querySelectorAll', 'createElement', 'appendChild', 'fetch'
  ];
  
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
    
    // Check for console.log statements
    if (trimmedLine.includes('console.log')) {
      feedback.push({
        id: `console-log-${lineNum}`,
        type: 'info',
        message: 'Console statement in production code',
        line: lineNum,
        code: line,
        suggestion: '// ' + line
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
    
    // Check for equality vs. strict equality
    if (trimmedLine.includes(' == ') || trimmedLine.includes('==')) {
      feedback.push({
        id: `equality-${lineNum}`,
        type: 'warning',
        message: 'Use === for strict equality instead of ==',
        line: lineNum,
        code: line,
        suggestion: line.replace(/==/g, '===')
      });
    }
    
    // Arrow function suggestion
    if (trimmedLine.includes('function') && !trimmedLine.includes('=>')) {
      feedback.push({
        id: `arrow-fn-${lineNum}`,
        type: 'suggestion',
        message: 'Consider using arrow function syntax',
        line: lineNum,
        code: line,
        suggestion: '// Convert to arrow function syntax'
      });
    }
    
    // Check for potential Promise errors
    if (trimmedLine.includes('.then(') && !trimmedLine.includes('.catch')) {
      feedback.push({
        id: `unhandled-promise-${lineNum}`,
        type: 'error',
        message: 'Unhandled Promise rejection',
        line: lineNum,
        code: line,
        suggestion: `${line.trim()}.catch(error => console.error(error));`
      });
    }
    
    // Enhanced spelling check
    const potentialIdentifiers = line.match(/\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g) || [];
    
    for (const word of potentialIdentifiers) {
      // Skip common variable names and keywords
      if (commonIdNames.has(word) || jsKeywords.has(word)) continue;
      
      // Skip well-known built-ins
      if (commonJsFunctions.includes(word)) continue;
      
      // Check for common spelling mistakes
      if (word === 'lenght') {
        feedback.push({
          id: `js-spelling-error-${word}-${lineNum}`,
          type: 'error',
          message: `Spelling error: 'lenght' should be 'length'`,
          line: lineNum,
          code: line,
          suggestion: line.replace(/\blenght\b/g, 'length')
        });
      }
    }
  });
  
  // Check for unbalanced brackets after processing all lines
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
  
  if (bracketBalance !== 0) {
    feedback.push({
      id: 'unbalanced-bracket',
      type: 'error',
      message: `Unbalanced square brackets: ${bracketBalance > 0 ? 'Missing ' + bracketBalance + ' closing' : 'Extra ' + Math.abs(bracketBalance) + ' closing'}`,
      line: lines.length,
      code: "// Check your code",
      suggestion: "// Ensure all square brackets [] are properly matched"
    });
  }
  
  if (parenBalance !== 0) {
    feedback.push({
      id: 'unbalanced-paren',
      type: 'error',
      message: `Unbalanced parentheses: ${parenBalance > 0 ? 'Missing ' + parenBalance + ' closing' : 'Extra ' + Math.abs(parenBalance) + ' closing'}`,
      line: lines.length,
      code: "// Check your code",
      suggestion: "// Ensure all parentheses () are properly matched"
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
}

module.exports = {
  analyzeJavaScript
};

// Helper functions

function getSuggestionForRule(ruleId, code, message) {
  // Map common ESLint rules to helpful suggestions
  const suggestions = {
    'no-unused-vars': 'Remove this unused variable or use it somewhere in your code.',
    'no-var': 'Consider using "const" or "let" instead of "var" for better scoping.',
    'prefer-const': 'If this variable is not reassigned, use "const" instead of "let".',
    'no-console': 'Remove console statements before deploying to production.',
    'eqeqeq': 'Use "===" instead of "==" for strict equality comparison.'
  };
  
  return suggestions[ruleId] || 'Consider fixing this issue to improve your code quality.';
}

/**
 * Analyze custom patterns that ESLint might not catch
 * @param {string} code - Source code to analyze
 * @returns {Array} - Array of issues found
 */
function analyzeCustomPatterns(code) {
  const issues = [];
  
  // Check for potential memory leaks in event listeners
  if ((code.includes('addEventListener') || code.includes('on')) && !code.includes('removeEventListener')) {
    issues.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: 'warning',
      message: 'Potential memory leak: Event listener added without removal',
      line: getLineNumberForPattern(code, 'addEventListener'),
      suggestion: 'Remember to remove event listeners when they are no longer needed to prevent memory leaks.'
    });
  }
  
  // Check for nested callbacks (callback hell)
  const depthLevel = getCallbackNestingLevel(code);
  if (depthLevel > 3) {
    issues.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: 'suggestion',
      message: `Callback nesting level (${depthLevel}) is high`,
      line: getLineNumberForPattern(code, '})', 3),
      suggestion: 'Consider refactoring nested callbacks using Promises, async/await, or named functions to improve readability.'
    });
  }
  
  // Check for large functions
  const functionSizes = getFunctionSizes(code);
  functionSizes.forEach(func => {
    if (func.lines > 30) {
      issues.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        type: 'suggestion',
        message: `Function '${func.name}' is ${func.lines} lines long`,
        line: func.lineNumber,
        suggestion: 'Consider breaking down large functions into smaller, more focused functions for better maintainability.'
      });
    }
  });
  
  // Check for magic numbers
  const magicNumbers = findMagicNumbers(code);
  magicNumbers.forEach(num => {
    issues.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: 'suggestion',
      message: `Magic number: ${num.value}`,
      line: num.lineNumber,
      suggestion: 'Consider replacing magic numbers with named constants to improve code readability and maintainability.'
    });
  });
  
  return issues;
}

/**
 * Generate a summary of the code analysis
 * @param {Array} issues - Issues found by ESLint
 * @param {Array} customIssues - Issues found by custom analysis
 * @returns {string} - Summary text
 */
function generateSummary(issues, customIssues) {
  const allIssues = [...issues, ...customIssues];
  
  const errorCount = allIssues.filter(issue => issue.type === 'error').length;
  const warningCount = allIssues.filter(issue => issue.type === 'warning').length;
  const suggestionCount = allIssues.filter(issue => issue.type === 'suggestion').length;
  
  let quality = 'good';
  if (errorCount > 0) {
    quality = 'poor';
  } else if (warningCount > 5) {
    quality = 'needs improvement';
  } else if (warningCount > 0) {
    quality = 'fair';
  }
  
  return `Analysis found ${errorCount} errors, ${warningCount} warnings, and ${suggestionCount} suggestions. Overall code quality: ${quality}.`;
}

/**
 * Analyze the abstract syntax tree (AST) for additional issues
 * @param {Object} ast - Abstract Syntax Tree from Acorn
 * @param {string} code - Original source code
 * @returns {Array} - Array of issues found
 */
function analyzeAst(ast, code) {
  const issues = [];
  
  // Check for function complexity
  const functions = [];
  walk.simple(ast, {
    FunctionDeclaration(node) {
      functions.push({
        name: node.id?.name || 'anonymous',
        complexity: countBranches(node),
        loc: node.loc
      });
    },
    FunctionExpression(node) {
      functions.push({
        name: node.id?.name || 'anonymous function',
        complexity: countBranches(node),
        loc: node.loc
      });
    },
    ArrowFunctionExpression(node) {
      functions.push({
        name: 'arrow function',
        complexity: countBranches(node),
        loc: node.loc
      });
    }
  });
  
  // Add issues for complex functions
  functions.forEach(func => {
    if (func.complexity > 10) {
      issues.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        type: 'warning',
        message: `Function '${func.name}' has high cyclomatic complexity (${func.complexity})`,
        line: func.loc?.start?.line || 1,
        suggestion: 'Consider refactoring this function to reduce complexity. Break it down into smaller functions or simplify conditionals.'
      });
    }
  });
  
  // Check for long chain methods
  const chainedCalls = findChainedMethodCalls(ast);
  chainedCalls.forEach(chain => {
    if (chain.length > 4) {
      issues.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        type: 'suggestion',
        message: `Long method chain (${chain.length} methods)`,
        line: chain.line,
        suggestion: 'Consider breaking down long method chains into intermediate variables for better readability and debugging.'
      });
    }
  });
  
  return issues;
}

/**
 * Analyze code for performance issues
 * @param {string} code - Source code
 * @param {Object} ast - Abstract Syntax Tree
 * @returns {Array} - Array of performance issues
 */
function analyzePerformance(code, ast) {
  const issues = [];
  
  // Check for inefficient loops
  if (code.includes('forEach') && (code.includes('filter') || code.includes('map'))) {
    issues.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: 'suggestion',
      message: 'Potentially inefficient array operations',
      line: getLineNumberForPattern(code, 'forEach'),
      suggestion: 'Consider combining multiple array operations into a single pass using reduce() or a simple for loop for better performance.'
    });
  }
  
  // Check for DOM operations in loops
  if ((code.includes('document.querySelector') || code.includes('getElementById')) && 
      (code.includes('for (') || code.includes('while ('))) {
    issues.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: 'warning',
      message: 'DOM operations inside loops',
      line: getLineNumberForPattern(code, 'document.'),
      suggestion: 'Move DOM queries outside of loops where possible to reduce reflows and improve performance.'
    });
  }
  
  // Check for potentially slow regular expressions
  const potentiallySlowRegex = /\.\*\+/g;
  if (potentiallySlowRegex.test(code)) {
    issues.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: 'warning',
      message: 'Potentially inefficient regular expression',
      line: getLineNumberForPattern(code, '.*+'),
      suggestion: 'Avoid patterns with nested quantifiers like .*+ that can cause catastrophic backtracking.'
    });
  }
  
  return issues;
}

/**
 * Analyze code for best practices
 * @param {string} code - Source code
 * @returns {Array} - Array of best practice issues
 */
function analyzeBestPractices(code) {
  const issues = [];
  
  // Check for parseInt without radix
  const parseIntRegex = /parseInt\s*\(\s*[^,)]*\s*\)/g;
  if (parseIntRegex.test(code)) {
    issues.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: 'suggestion',
      message: 'parseInt() used without a radix parameter',
      line: getLineNumberForPattern(code, 'parseInt'),
      suggestion: 'Always specify a radix (base) when using parseInt() to ensure consistent behavior across browsers, e.g., parseInt(value, 10).'
    });
  }
  
  // Check for console.log
  if (code.includes('console.log')) {
    issues.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: 'info',
      message: 'console.log statements found',
      line: getLineNumberForPattern(code, 'console.log'),
      suggestion: 'Remove or replace console.log statements before moving to production. Consider using a proper logging library.'
    });
  }
  
  // Check for commented-out code
  const commentedCodeRegex = /\/\/.*[;{}]|\/\*[\s\S]*?\*\//g;
  if (commentedCodeRegex.test(code)) {
    issues.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: 'suggestion',
      message: 'Commented-out code found',
      line: getLineNumberForPattern(code, '//'),
      suggestion: 'Either remove commented-out code or add clear explanations for why it\'s retained. Commented code adds noise and can become outdated.'
    });
  }
  
  // Check for proper error handling
  if (code.includes('try') && !code.includes('catch (')) {
    issues.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: 'warning',
      message: 'try statement without proper catch',
      line: getLineNumberForPattern(code, 'try'),
      suggestion: 'Always include proper error handling with specific catch blocks rather than catching all errors or ignoring them.'
    });
  }
  
  return issues;
}

/**
 * Calculate code complexity based on AST
 * @param {Object} ast - Abstract Syntax Tree
 * @returns {Object} - Complexity metrics
 */
function calculateComplexity(ast) {
  let cyclomaticComplexity = 1; // Base complexity of 1
  let depth = 0;
  let maxDepth = 0;
  let numberOfFunctions = 0;
  
  // Walk the AST to calculate complexity
  walk.simple(ast, {
    IfStatement() { cyclomaticComplexity++; depth++; maxDepth = Math.max(maxDepth, depth); },
    ForStatement() { cyclomaticComplexity++; depth++; maxDepth = Math.max(maxDepth, depth); },
    ForInStatement() { cyclomaticComplexity++; depth++; maxDepth = Math.max(maxDepth, depth); },
    ForOfStatement() { cyclomaticComplexity++; depth++; maxDepth = Math.max(maxDepth, depth); },
    WhileStatement() { cyclomaticComplexity++; depth++; maxDepth = Math.max(maxDepth, depth); },
    DoWhileStatement() { cyclomaticComplexity++; depth++; maxDepth = Math.max(maxDepth, depth); },
    ConditionalExpression() { cyclomaticComplexity++; },
    LogicalExpression(node) { if (node.operator === '&&' || node.operator === '||') cyclomaticComplexity++; },
    SwitchCase() { cyclomaticComplexity++; },
    FunctionDeclaration() { numberOfFunctions++; },
    FunctionExpression() { numberOfFunctions++; },
    ArrowFunctionExpression() { numberOfFunctions++; }
  });
  
  // Determine complexity rating
  let rating;
  if (cyclomaticComplexity <= 5) rating = 'low';
  else if (cyclomaticComplexity <= 10) rating = 'moderate';
  else if (cyclomaticComplexity <= 20) rating = 'high';
  else rating = 'very high';
  
  return {
    cyclomaticComplexity,
    maxDepth,
    numberOfFunctions,
    rating
  };
}

/**
 * Generate advanced code suggestions
 * @param {string} code - Source code
 * @param {Object} ast - Abstract Syntax Tree
 * @returns {Array} - Array of suggestions
 */
function generateSuggestions(code, ast) {
  const suggestions = [];
  
  // Check for ES6+ features usage
  if (!code.includes('=>') && !code.includes('class ') && !code.includes('const ') && !code.includes('let ')) {
    suggestions.push('Consider using modern JavaScript features like arrow functions, classes, and block-scoped variables (const/let) for cleaner code.');
  }
  
  // Check for potential Promise usage
  if (code.includes('callback') && !code.includes('Promise')) {
    suggestions.push('Consider using Promises or async/await for asynchronous operations instead of callbacks for more readable and maintainable code.');
  }
  
  // Check for import/require statements
  if (code.includes('require(') && !code.includes('import ')) {
    suggestions.push('Consider using ES modules (import/export) instead of CommonJS (require) for better tree-shaking and compatibility with modern tools.');
  }
  
  // Check for potential unit test opportunities
  let hasFunctions = false;
  walk.simple(ast, {
    FunctionDeclaration() { hasFunctions = true; },
    FunctionExpression() { hasFunctions = true; },
    ArrowFunctionExpression() { hasFunctions = true; }
  });
  
  if (hasFunctions && !code.includes('test(') && !code.includes('expect(')) {
    suggestions.push('Consider adding unit tests for your functions to ensure they work as expected and prevent regressions.');
  }
  
  // Check for documentation
  let hasJSDoc = /\/\*\*[\s\S]*?\*\//.test(code);
  if (hasFunctions && !hasJSDoc) {
    suggestions.push('Add JSDoc comments to document your functions, including parameter types and return values.');
  }
  
  return suggestions;
}

/**
 * Count branches in a function node to estimate cyclomatic complexity
 * @param {Object} node - AST node
 * @returns {number} - Number of branches
 */
function countBranches(node) {
  let complexity = 1; // Base complexity is 1
  
  function traverse(node) {
    if (!node) return;
    
    // Increment complexity for control flow statements
    if (
      node.type === 'IfStatement' || 
      node.type === 'ForStatement' || 
      node.type === 'ForInStatement' || 
      node.type === 'ForOfStatement' || 
      node.type === 'WhileStatement' || 
      node.type === 'DoWhileStatement'
    ) {
      complexity++;
    }
    
    // Increment for each case in switch statement
    if (node.type === 'SwitchStatement' && node.cases) {
      complexity += node.cases.length;
    }
    
    // Increment for logical expressions
    if (node.type === 'LogicalExpression' && (node.operator === '&&' || node.operator === '||')) {
      complexity++;
    }
    
    // Recursive traverse child nodes
    for (const key in node) {
      if (typeof node[key] === 'object' && node[key] !== null) {
        if (Array.isArray(node[key])) {
          node[key].forEach(child => traverse(child));
        } else {
          traverse(node[key]);
        }
      }
    }
  }
  
  traverse(node);
  return complexity;
}

/**
 * Find chained method calls in the code
 * @param {Object} ast - Abstract Syntax Tree
 * @returns {Array} - Array of chain info objects
 */
function findChainedMethodCalls(ast) {
  const chains = [];
  
  walk.simple(ast, {
    MemberExpression(node) {
      if (node.object && node.object.type === 'CallExpression') {
        let current = node;
        let length = 1;
        let line = node.loc?.start?.line || 1;
        
        // Count the chain length
        while (current.object && current.object.type === 'CallExpression') {
          length++;
          current = current.object.callee;
        }
        
        if (length >= 3) {
          chains.push({ length, line });
        }
      }
    }
  });
  
  return chains;
}

/**
 * Get the line number for a pattern in the code
 * @param {string} code - Source code
 * @param {string} pattern - Pattern to find
 * @param {number} occurrence - Which occurrence to find (default: first)
 * @returns {number} - Line number
 */
function getLineNumberForPattern(code, pattern, occurrence = 1) {
  const lines = code.split('\n');
  let count = 0;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(pattern)) {
      count++;
      if (count === occurrence) {
        return i + 1;
      }
    }
  }
  
  return 1; // Default to first line if pattern not found
}

/**
 * Get the callback nesting level in the code
 * @param {string} code - Source code
 * @returns {number} - Maximum nesting level
 */
function getCallbackNestingLevel(code) {
  const lines = code.split('\n');
  let maxDepth = 0;
  let currentDepth = 0;
  
  for (const line of lines) {
    // Increase depth for function/callback declarations
    const openBrackets = (line.match(/\(\s*function|\(\s*\(|\(\s*=>/g) || []).length;
    currentDepth += openBrackets;
    
    // Decrease depth for closing brackets that likely end functions
    const closeBrackets = (line.match(/\}\s*\)/g) || []).length;
    currentDepth -= closeBrackets;
    
    // Update max depth
    maxDepth = Math.max(maxDepth, currentDepth);
  }
  
  return maxDepth;
}

/**
 * Get approximate sizes of functions in the code
 * @param {string} code - Source code
 * @returns {Array} - Array of function info objects
 */
function getFunctionSizes(code) {
  const functionInfo = [];
  const lines = code.split('\n');
  let inFunction = false;
  let functionName = '';
  let startLine = 0;
  let bracketCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for function declarations
    if (!inFunction) {
      const functionMatch = line.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);
      const arrowFunctionMatch = line.match(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:function|\([^)]*\)\s*=>)/);
      
      if (functionMatch) {
        inFunction = true;
        functionName = functionMatch[1];
        startLine = i + 1;
        bracketCount += countCharOccurrences(line, '{');
        bracketCount -= countCharOccurrences(line, '}');
      } else if (arrowFunctionMatch) {
        inFunction = true;
        functionName = arrowFunctionMatch[1];
        startLine = i + 1;
        bracketCount += countCharOccurrences(line, '{');
        bracketCount -= countCharOccurrences(line, '}');
      }
    } else {
      bracketCount += countCharOccurrences(line, '{');
      bracketCount -= countCharOccurrences(line, '}');
      
      // End of function
      if (bracketCount === 0) {
        functionInfo.push({
          name: functionName,
          lineNumber: startLine,
          lines: i - startLine + 1
        });
        
        inFunction = false;
        functionName = '';
      }
    }
  }
  
  return functionInfo;
}

/**
 * Find magic numbers in the code
 * @param {string} code - Source code
 * @returns {Array} - Array of magic number info objects
 */
function findMagicNumbers(code) {
  const magicNumbers = [];
  const lines = code.split('\n');
  
  // Skip common non-magic numbers
  const commonNumbers = [0, 1, -1, 2, 10, 100, 1000];
  const numberRegex = /(?<!\w)(-?\d+(?:\.\d+)?)(?!\w*[:(])/g;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip comments and variable declarations
    if (line.trim().startsWith('//') || line.trim().startsWith('const') || line.trim().startsWith('let') || line.trim().startsWith('var')) {
      continue;
    }
    
    let match;
    while ((match = numberRegex.exec(line)) !== null) {
      const value = parseFloat(match[1]);
      
      // Skip common numbers and small array indices
      if (!commonNumbers.includes(value) && Math.abs(value) > 2) {
        magicNumbers.push({
          value,
          lineNumber: i + 1
        });
      }
    }
  }
  
  return magicNumbers;
}

/**
 * Count occurrences of a character in a string
 * @param {string} str - The string to search in
 * @param {string} char - The character to count
 * @returns {number} - Number of occurrences
 */
function countCharOccurrences(str, char) {
  return (str.match(new RegExp(char, 'g')) || []).length;
}