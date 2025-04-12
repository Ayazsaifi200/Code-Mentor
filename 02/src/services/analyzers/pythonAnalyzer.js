const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { SpellingUtils } = require('../utils/spellingUtils');

/**
 * Analyzes Python code for issues and provides feedback
 */
exports.analyze = async (code) => {
  try {
    // Use pylint for code analysis
    const issues = await runPylint(code);
    
    // Format results
    const formattedIssues = issues.map(issue => ({
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: determineIssueType(issue.type),
      message: issue.message,
      line: issue.line,
      suggestion: getSuggestionForIssue(issue)
    }));
    
    // Add custom analysis
    const customIssues = analyzeCustomPatterns(code);
    
    return {
      issues: [...formattedIssues, ...customIssues],
      summary: generateSummary(formattedIssues, customIssues)
    };
  } catch (error) {
    console.error('Python analysis error:', error);
    return {
      issues: [
        {
          id: Date.now(),
          type: 'error',
          message: 'Failed to analyze Python code',
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
    // Run additional static analyzers
    const mypy = await runMyPy(code);
    const bandit = await runBandit(code);
    
    // Format additional results
    const mypyIssues = mypy.map(issue => ({
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: 'warning',
      message: `Type error: ${issue.message}`,
      line: issue.line,
      suggestion: 'Add proper type annotations to improve code safety'
    }));
    
    const banditIssues = bandit.map(issue => ({
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: 'security',
      message: `Security issue: ${issue.message}`,
      line: issue.line,
      suggestion: issue.suggestion
    }));
    
    // Calculate code complexity
    const complexity = calculatePythonComplexity(code);
    
    // Generate advanced suggestions
    const suggestions = generateAdvancedSuggestions(code);
    
    return {
      ...basicAnalysis,
      issues: [...basicAnalysis.issues, ...mypyIssues, ...banditIssues],
      codeComplexity: complexity,
      suggestions: suggestions
    };
  } catch (error) {
    console.error('Detailed Python analysis error:', error);
    return basicAnalysis;
  }
};

/**
 * Run pylint on Python code and return issues
 * @param {string} code - The Python code to analyze
 * @returns {Promise<Array>} - Array of issues found
 */
async function runPylint(code) {
  return new Promise((resolve) => {
    try {
      // Create temporary file
      const tempFile = path.join(os.tmpdir(), `pylint_${Date.now()}.py`);
      fs.writeFileSync(tempFile, code, 'utf8');
      
      // Run pylint 
      const pylint = spawn('pylint', [
        '--output-format=json',
        '--disable=all',
        '--enable=E,W,F,R,C',  // Enable error, warning, fatal, refactor, convention messages
        tempFile
      ]);
      
      let stdout = '';
      let stderr = '';
      
      pylint.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      pylint.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      pylint.on('close', (code) => {
        try {
          // Clean up temporary file
          fs.unlinkSync(tempFile);
        } catch (error) {
          console.error('Error removing temporary file:', error);
        }
        
        // Parse pylint output
        const issues = [];
        if (stdout) {
          try {
            const pylintIssues = JSON.parse(stdout);
            pylintIssues.forEach(issue => {
              issues.push({
                type: issue.type,
                message: issue.message,
                line: issue.line,
                column: issue.column,
                symbol: issue.symbol
              });
            });
          } catch (error) {
            console.error('Error parsing pylint output:', error);
          }
        }
        
        resolve(issues);
      });
    } catch (error) {
      console.error('Error running pylint:', error);
      resolve([]);
    }
  });
}

/**
 * Run mypy for type checking
 * @param {string} code - Python code
 * @returns {Promise<Array>} - Array of type issues found
 */
async function runMyPy(code) {
  // Implementation would be similar to pylint but using mypy
  // For demonstration purposes, return sample issues
  return [];
}

/**
 * Run bandit for security analysis
 * @param {string} code - Python code
 * @returns {Promise<Array>} - Array of security issues found
 */
async function runBandit(code) {
  // Implementation would be similar to pylint but using bandit
  // For demonstration purposes, return sample issues
  return [];
}

/**
 * Analyze custom patterns in Python code
 * @param {string} code - Python code
 * @returns {Array} - Array of issues found
 */
function analyzeCustomPatterns(code) {
  const issues = [];
  
  // Check for bare excepts
  if (code.includes('except:') || code.includes('except :')) {
    issues.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: 'warning',
      message: 'Bare except clause used',
      line: getLineNumberForPattern(code, 'except:'),
      suggestion: 'Specify the exceptions you want to catch instead of using a bare except clause.'
    });
  }
  
  // Check for mutable default arguments
  if (code.match(/def\s+\w+\s*\([^)]*=\s*\[\s*\][^)]*\)/)) {
    issues.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: 'warning',
      message: 'Mutable default argument used',
      line: getLineNumberForPattern(code, '=[]'),
      suggestion: 'Use None as default and initialize the list inside the function to avoid unexpected behavior.'
    });
  }
  
  // Check for global variables
  if (code.match(/\bglobal\s+\w+/)) {
    issues.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: 'suggestion',
      message: 'Global variables used',
      line: getLineNumberForPattern(code, 'global '),
      suggestion: 'Consider using class attributes or passing values as parameters instead of global variables.'
    });
  }
  
  // Check for excessive line length
  const lines = code.split('\n');
  lines.forEach((line, index) => {
    if (line.length > 100) {
      issues.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        type: 'suggestion',
        message: 'Line too long',
        line: index + 1,
        suggestion: 'Break long lines into multiple lines to improve readability. PEP 8 recommends a maximum of 79 characters.'
      });
    }
  });
  
  return issues;
}

/**
 * Determine issue type based on pylint categories
 * @param {string} pylintType - The type from pylint
 * @returns {string} - Standardized issue type
 */
function determineIssueType(pylintType) {
  switch (pylintType) {
    case 'error':
    case 'fatal':
      return 'error';
    case 'warning':
      return 'warning';
    case 'convention':
    case 'refactor':
      return 'suggestion';
    default:
      return 'suggestion';
  }
}

/**
 * Get suggestion based on issue type
 * @param {Object} issue - The issue from pylint
 * @returns {string} - Helpful suggestion for the issue
 */
function getSuggestionForIssue(issue) {
  const suggestions = {
    'trailing-whitespace': 'Remove trailing whitespace.',
    'missing-docstring': 'Add a docstring to explain what this code does.',
    'line-too-long': 'Break this line into multiple lines to improve readability.',
    'too-many-arguments': 'Consider refactoring this function to take fewer arguments.',
    'unused-variable': 'Remove this unused variable or use it somewhere.',
    'undefined-variable': 'This variable is not defined. Check for typos or define it before use.',
    'redefined-outer-name': 'This variable shadows an outer scope variable. Rename it to avoid confusion.'
  };
  
  return suggestions[issue.symbol] || 'Consider fixing this issue to improve your code quality.';
}

/**
 * Generate a summary of the analysis
 * @param {Array} issues - Issues found by pylint
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
 * Calculate Python code complexity metrics
 * @param {string} code - Python source code
 * @returns {Object} - Complexity metrics
 */
function calculatePythonComplexity(code) {
  // This would typically use a tool like radon to calculate complexity
  // For demo purposes, estimate complexity based on code patterns
  
  const lines = code.split('\n');
  const functionCount = (code.match(/def\s+\w+\s*\(/g) || []).length;
  const classCount = (code.match(/class\s+\w+/g) || []).length;
  
  // Count control structures
  const ifCount = (code.match(/if\s+/g) || []).length;
  const forCount = (code.match(/for\s+/g) || []).length;
  const whileCount = (code.match(/while\s+/g) || []).length;
  
  // Simple cyclomatic complexity estimate
  const cyclomaticComplexity = 1 + ifCount + forCount + whileCount;
  
  // Determine complexity rating
  let rating;
  if (cyclomaticComplexity <= 5) rating = 'low';
  else if (cyclomaticComplexity <= 10) rating = 'moderate';
  else if (cyclomaticComplexity <= 20) rating = 'high';
  else rating = 'very high';
  
  return {
    linesOfCode: lines.length,
    cyclomaticComplexity,
    functionCount,
    classCount,
    rating
  };
}

/**
 * Generate advanced suggestions for Python code
 * @param {string} code - Python source code
 * @returns {Array} - Array of suggestions
 */
function generateAdvancedSuggestions(code) {
  const suggestions = [];
  
  // Check for type hints
  if (!code.includes(': ') && !code.includes('-> ')) {
    suggestions.push('Consider adding type hints to improve code readability and enable better tooling support.');
  }
  
  // Check for f-strings (Python 3.6+)
  if (code.includes('%s') || code.includes('{').includes('.format(')) {
    suggestions.push('Consider using f-strings (Python 3.6+) for string formatting instead of % or .format().');
  }
  
  // Check for context managers
  if (code.includes('open(') && !code.includes('with open(')) {
    suggestions.push('Use "with" statement when working with files to ensure they are properly closed.');
  }
  
  // Check for list comprehension opportunities
  if (code.match(/\bfor\s+\w+\s+in.+\n\s*\w+\.append\(/)) {
    suggestions.push('Consider using list comprehensions for more concise and readable code.');
  }
  
  return suggestions;
}

/**
 * Get line number for a pattern in the code
 * @param {string} code - Source code
 * @param {string} pattern - Pattern to find
 * @returns {number} - Line number
 */
function getLineNumberForPattern(code, pattern) {
  const lines = code.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(pattern)) {
      return i + 1;
    }
  }
  
  return 1; // Default to first line if pattern not found
}

/**
 * Analyzes Python code for errors, warnings, and suggestions
 * @param {string} code - The Python code to analyze
 * @returns {Array} - Array of feedback items with errors, warnings, and suggestions
 */
function analyzePython(code) {
  if (!code || !code.trim()) return [];
  
  const feedback = [];
  const lines = code.split('\n');
  
  // Python specific dictionaries
  const pythonKeywords = new Set([
    'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue',
    'def', 'del', 'elif', 'else', 'except', 'False', 'finally', 'for',
    'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'None',
    'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'True',
    'try', 'while', 'with', 'yield'
  ]);
  
  const pythonBuiltIns = new Set([
    'abs', 'all', 'any', 'ascii', 'bin', 'bool', 'bytearray', 'bytes',
    'callable', 'chr', 'classmethod', 'compile', 'complex', 'delattr', 'dict', 'dir',
    'divmod', 'enumerate', 'eval', 'exec', 'filter', 'float', 'format', 'frozenset',
    'getattr', 'globals', 'hasattr', 'hash', 'help', 'hex', 'id', 'input', 'int',
    'isinstance', 'issubclass', 'iter', 'len', 'list', 'locals', 'map', 'max',
    'min', 'next', 'object', 'oct', 'open', 'ord', 'pow', 'print',
    'property', 'range', 'repr', 'reversed', 'round', 'set', 'setattr', 'slice',
    'sorted', 'staticmethod', 'str', 'sum', 'super', 'tuple', 'type', 'vars', 'zip'
  ]);
  
  const commonPyLibraries = new Set([
    'numpy', 'pandas', 'matplotlib', 'scipy', 'sklearn', 'tensorflow',
    'pytorch', 'django', 'flask', 'requests', 'beautifulsoup', 'selenium',
    'os', 'sys', 're', 'math', 'random', 'datetime', 'time', 'json',
    'csv', 'collections', 'itertools', 'functools', 'pathlib'
  ]);
  
  // Common Python variable names to ignore
  const commonPyVars = new Set(['i', 'j', 'k', 'n', 'x', 'y', 'z', 'f', 'df', 'db', 'fn', 'obj', 'val', 'cls', 'self']);
  
  // Indent tracking
  let previousIndent = 0;
  let currentIndent = 0;
  
  // Process each line
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmedLine = line.trim();
    
    // Skip empty lines and pure comments
    if (!trimmedLine || trimmedLine.startsWith('#')) return;
    
    // Calculate indentation
    const indentMatch = line.match(/^(\s*)/);
    currentIndent = indentMatch ? indentMatch[1].length : 0;
    
    // Check for inconsistent indentation
    if (trimmedLine && previousIndent < currentIndent && currentIndent % 4 !== 0) {
      feedback.push({
        id: `inconsistent-indent-${lineNum}`,
        type: 'error',
        message: 'Inconsistent indentation. Use 4 spaces per indentation level',
        line: lineNum,
        code: line,
        suggestion: line.replace(/^\s*/, ' '.repeat(Math.round(currentIndent / 4) * 4))
      });
    }
    
    // Check for statements ending with semicolons (not Pythonic)
    if (trimmedLine.endsWith(';')) {
      feedback.push({
        id: `unnecessary-semicolon-${lineNum}`,
        type: 'warning',
        message: 'Unnecessary semicolon at end of line',
        line: lineNum,
        code: line,
        suggestion: line.replace(/;$/, '')
      });
    }
    
    // Check for camelCase variable names (not PEP 8 compliant)
    const camelCaseMatch = trimmedLine.match(/\b([a-z]+[A-Z][a-zA-Z0-9]*)\s*=/);
    if (camelCaseMatch && !camelCaseMatch[1].startsWith('__')) {
      const camelCaseName = camelCaseMatch[1];
      const snakeCaseName = camelCaseName.replace(/([A-Z])/g, '_$1').toLowerCase();
      
      feedback.push({
        id: `non-snake-case-${lineNum}`,
        type: 'warning',
        message: 'Variable name uses camelCase instead of snake_case',
        line: lineNum,
        code: line,
        suggestion: line.replace(camelCaseName, snakeCaseName)
      });
    }
    
    // Check for common Python errors
    
    // Missing colon in control structures or function definitions
    if ((trimmedLine.startsWith('if ') || 
         trimmedLine.startsWith('else ') || 
         trimmedLine.startsWith('elif ') || 
         trimmedLine.startsWith('for ') || 
         trimmedLine.startsWith('while ') || 
         trimmedLine.startsWith('def ') || 
         trimmedLine.startsWith('class ')) && 
        !trimmedLine.endsWith(':')) {
      feedback.push({
        id: `missing-colon-${lineNum}`,
        type: 'error',
        message: 'Missing colon at the end of the statement',
        line: lineNum,
        code: line,
        suggestion: `${line}:`
      });
    }
    
    // Find all potential Python identifiers
    const potentialIdentifiers = trimmedLine.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g) || [];
    
    for (const word of potentialIdentifiers) {
      // Skip common variable names and Python keywords
      if (commonPyVars.has(word) || pythonKeywords.has(word) || pythonBuiltIns.has(word)) continue;
      
      // Check import statements for library names
      if (trimmedLine.startsWith('import ') || trimmedLine.includes(' import ')) {
        const importWords = trimmedLine.match(/\b(?:import|from)\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
        if (importWords && importWords[1]) {
          const libraryName = importWords[1];
          
          // Check against known libraries
          if (!commonPyLibraries.has(libraryName)) {
            // Find closest match among known libraries
            let bestMatch = null;
            let bestScore = 0;
            
            for (const knownLib of commonPyLibraries) {
              const score = SpellingUtils.calculateSimilarity(libraryName, knownLib);
              if (score > 0.7 && score > bestScore) {
                bestScore = score;
                bestMatch = knownLib;
              }
            }
            
            if (bestMatch) {
              feedback.push({
                id: `py-library-spelling-${libraryName}-${lineNum}`,
                type: 'warning',
                message: `Library '${libraryName}' might be misspelled. Did you mean '${bestMatch}'?`,
                line: lineNum,
                code: line,
                suggestion: line.replace(new RegExp(`\\b${libraryName}\\b`, 'g'), bestMatch)
              });
            }
          }
        }
      }
      
      // Check for function and class definitions
      const defMatch = trimmedLine.match(/\b(?:def|class)\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
      if (defMatch && defMatch[1]) {
        const definedName = defMatch[1];
        
        // Python naming conventions
        if (trimmedLine.startsWith('class') && !/^[A-Z][a-zA-Z0-9_]*$/.test(definedName)) {
          feedback.push({
            id: `py-class-naming-${lineNum}`,
            type: 'error',
            message: `Class name '${definedName}' should use CamelCase (start with uppercase)`,
            line: lineNum,
            code: line,
            suggestion: line.replace(definedName, definedName.charAt(0).toUpperCase() + definedName.slice(1))
          });
        } else if (trimmedLine.startsWith('def') && !/^[a-z_][a-z0-9_]*$/.test(definedName)) {
          feedback.push({
            id: `py-function-naming-${lineNum}`,
            type: 'error',
            message: `Function name '${definedName}' should use snake_case (all lowercase)`,
            line: lineNum,
            code: line,
            suggestion: line.replace(definedName, definedName.toLowerCase())
          });
        }
      }
    }
    
    // Update previous indent
    if (trimmedLine) {
      previousIndent = currentIndent;
    }
  });
  
  return feedback;
}

module.exports = {
  analyzePython
};