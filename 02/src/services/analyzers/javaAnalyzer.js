/**
 * Java code analyzer
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
// Fix duplicate imports - use a single consistent name for each dependency
const javaDict = require('../dictionaries/java');
const spellingUtils = require('../utils/spellingUtils');
const { SpellingUtils } = spellingUtils; // Extract SpellingUtils if needed as a named export

/**
 * Analyzes Java code for issues and provides feedback
 */
exports.analyze = async (code) => {
  try {
    // First check for syntax errors
    const syntaxErrors = checkJavaSyntaxErrors(code);
    
    // If there are syntax errors, return those immediately
    if (syntaxErrors.length > 0) {
      return {
        issues: syntaxErrors,
        summary: `Analysis found ${syntaxErrors.length} syntax errors. Fix these errors before proceeding.`
      };
    }
    
    // If no syntax errors, continue with style checks
    const issues = await runCheckStyle(code);
    
    // Format results
    const formattedIssues = issues.map(issue => ({
      id: Date.now() + Math.floor(Math.random() * 1000),
      type: determineIssueType(issue.severity),
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
    console.error('Java analysis error:', error);
    return {
      issues: [
        {
          id: Date.now(),
          type: 'error',
          message: 'Failed to analyze Java code',
          line: 1,
          suggestion: 'Check for syntax errors in your code'
        }
      ],
      summary: 'Analysis failed due to syntax or other errors'
    };
  }
};

/**
 * Main Java analyzer function - SINGLE IMPLEMENTATION
 * @param {string} code - Java source code to analyze
 * @returns {Array} Analysis results with errors, warnings, and suggestions
 */
exports.analyzeJava = (code) => {
  if (!code || !code.trim()) return [];
  
  const feedback = [];
  const lines = code.split('\n');
  
  // Track detected issues by line to avoid duplicates
  const detectedIssues = new Map();
  
  // State tracking variables
  let inString = false;
  let inChar = false;
  let inLineComment = false;
  let inBlockComment = false;
  let escapeNext = false;
  
  // Balance tracking
  const bracketStack = { curly: [], square: [], paren: [] };
  
  // Helper function to add an error only if it hasn't been detected before
  const addUniqueError = (category, lineNum, errorObj) => {
    const key = `${category}-${lineNum}`;
    
    if (!detectedIssues.has(key)) {
      feedback.push(errorObj);
      detectedIssues.set(key, true);
      return true;
    }
    return false;
  };
  
  /**
   * Check if string follows Java class naming convention
   * @param {string} word - The word to check
   * @returns {boolean} True if follows PascalCase convention
   */
  const isJavaClassName = (word) => {
    return /^[A-Z][a-zA-Z0-9_]*$/.test(word);
  };
  
  /**
   * Check if string follows Java variable naming convention
   * @param {string} word - The word to check
   * @returns {boolean} True if follows camelCase convention
   */
  const isJavaVariableName = (word) => {
    return /^[a-z][a-zA-Z0-9_]*$/.test(word);
  };
  
  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    const trimmedLine = line.trim();
    
    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*')) {
      continue;
    }
    
    // Extract potential identifiers and tokens
    const tokens = trimmedLine.match(/[a-zA-Z_$][a-zA-Z0-9_$]*|[{}()\[\];.,=+\-*/<>!&|^%]/g) || [];
    
    // Track state during line processing
    inLineComment = false;
    
    // Process tokens
    for (let j = 0; j < tokens.length; j++) {
      const token = tokens[j];
      
      // Skip if it's a keyword
      if (javaDict.javaKeywords && javaDict.javaKeywords.has && javaDict.javaKeywords.has(token)) continue;
      
      // Check for misspelled keywords
      if (javaDict.keywordMisspellings) {
        for (const [correctKeyword, misspellings] of Object.entries(javaDict.keywordMisspellings)) {
          if (misspellings.includes(token)) {
            addUniqueError('keyword', lineNum, {
              id: `misspelled-keyword-${token}-${lineNum}`,
              type: 'error',
              message: `'${token}' appears to be a misspelling of keyword '${correctKeyword}'`,
              line: lineNum,
              code: line,
              suggestion: line.replace(new RegExp(`\\b${token}\\b`, 'g'), correctKeyword)
            });
            break;
          }
        }
      }
      
      // Check for Java class naming conventions
      if (line.includes('class') && j > 0 && tokens[j-1] === 'class') {
        if (!isJavaClassName(token)) {
          addUniqueError('naming', lineNum, {
            id: `class-naming-${lineNum}`,
            type: 'warning',
            message: `Class name '${token}' should follow PascalCase convention`,
            line: lineNum,
            code: line,
            suggestion: line.replace(new RegExp(`\\b${token}\\b`, 'g'), token.charAt(0).toUpperCase() + token.slice(1))
          });
        }
      }
    }
    
    // Check for potential identifier misspellings
    const potentialIdentifiers = line.match(/\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g) || [];
    
    for (const word of potentialIdentifiers) {
      // Skip common variable names and keywords
      if ((javaDict.keywords && javaDict.keywords.includes && javaDict.keywords.includes(word)) || 
          ['i', 'j', 'k', 'x', 'y', 'z'].includes(word)) {
        continue;
      }
      
      // Skip if the word is likely a class name (PascalCase)
      if (isJavaClassName(word) && javaDict.standardClasses && 
          javaDict.standardClasses.includes && !javaDict.standardClasses.includes(word)) {
        continue;
      }
      
      // Check for possible misspellings if SpellingUtils is available
      if (javaDict.allJavaTerms && SpellingUtils && SpellingUtils.detectSpellingErrors) {
        try {
          const possibleCorrection = SpellingUtils.detectSpellingErrors(word, javaDict.allJavaTerms);
          
          if (possibleCorrection && possibleCorrection.score > 0.8) {
            addUniqueError('spelling-general', lineNum, {
              id: `spell-${word}-${lineNum}`,
              type: 'warning',
              message: `'${word}' might be a misspelling of '${possibleCorrection.word}'`,
              line: lineNum,
              code: line,
              suggestion: line.replace(new RegExp(`\\b${word}\\b`, 'g'), possibleCorrection.word)
            });
          }
        } catch (error) {
          console.error('Error in spell checking:', error);
        }
      }
    }
  }
  
  // Deduplication logic for error reporting (one error per line)
  const uniqueErrors = new Map();
  for (const error of feedback) {
    if (error.type === 'error') {
      const key = `line-${error.line}`;
      if (!uniqueErrors.has(key)) {
        uniqueErrors.set(key, error);
      }
    } else {
      // Keep all warnings and suggestions
      uniqueErrors.set(`other-${Math.random()}`, error);
    }
  }
  
  return Array.from(uniqueErrors.values());
};

// Additional required functions (checkJavaSyntaxErrors, runCheckStyle, etc.)
// Keep these from your original file, but make sure they're only defined once

/**
 * Run checkstyle on Java code and return issues
 * @param {string} code - The Java code to analyze
 * @returns {Promise<Array>} - Array of issues found
 */
async function runCheckStyle(code) {
  return new Promise((resolve) => {
    try {
      // Simple analysis placeholder
      const issues = [];
      const lines = code.split('\n');
      
      // Check basic Java style issues
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNumber = i + 1;
        
        // Check for very long lines
        if (line.length > 100) {
          issues.push({
            severity: 'info',
            message: 'Line is longer than 100 characters',
            line: lineNumber,
            type: 'LineLengthCheck'
          });
        }
      }
      
      resolve(issues);
    } catch (error) {
      console.error('Error running Java analysis:', error);
      resolve([]);
    }
  });
}

/**
 * Check for Java syntax errors
 * @param {string} code - Java source code
 * @returns {Array} - Array of syntax errors found
 */
function checkJavaSyntaxErrors(code) {
  // Placeholder implementation
  return [];
}

/**
 * Analyze custom patterns in Java code
 * @param {string} code - Java code
 * @returns {Array} - Array of issues found
 */
function analyzeCustomPatterns(code) {
  // Placeholder implementation
  return [];
}

/**
 * Determine issue type based on severity
 * @param {string} severity - The severity from checkstyle
 * @returns {string} - Standardized issue type
 */
function determineIssueType(severity) {
  switch (severity.toLowerCase()) {
    case 'error': return 'error';
    case 'warning': return 'warning';
    case 'info': return 'suggestion';
    default: return 'suggestion';
  }
}

/**
 * Get suggestion based on issue type
 * @param {Object} issue - The issue from checkstyle
 * @returns {string} - Helpful suggestion for the issue
 */
function getSuggestionForIssue(issue) {
  const suggestions = {
    'LineLengthCheck': 'Consider breaking this line into multiple lines for better readability.'
  };
  return suggestions[issue.type] || 'Consider fixing this issue to improve your code quality.';
}

/**
 * Generate a summary of the analysis
 * @param {Array} issues - Issues found by checkstyle
 * @param {Array} customIssues - Issues found by custom analysis
 * @returns {string} - Summary text
 */
function generateSummary(issues, customIssues) {
  const allIssues = [...issues, ...customIssues];
  const errorCount = allIssues.filter(issue => issue.type === 'error').length;
  const warningCount = allIssues.filter(issue => issue.type === 'warning').length;
  const suggestionCount = allIssues.filter(issue => issue.type === 'suggestion').length;
  
  let quality = 'good';
  if (errorCount > 0) quality = 'poor';
  else if (warningCount > 5) quality = 'needs improvement';
  else if (warningCount > 0) quality = 'fair';
  
  return `Analysis found ${errorCount} errors, ${warningCount} warnings, and ${suggestionCount} suggestions. Overall code quality: ${quality}.`;
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
    if (lines[i].includes(pattern)) return i + 1;
  }
  return 1; // Default
}

const analyzeJava = (code) => {
  if (!code || typeof code !== 'string') {
    return { issues: [] };
  }

  const issues = [];
  const lines = code.split('\n');

  // Track issues that have been detected to avoid duplicates
  const detectedIssues = new Map();

  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    const trimmedLine = line.trim();

    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('//') || trimmedLine.startsWith('/*')) {
      continue;
    }

    // Check for typical Java errors
    
    // Check for missing semicolons
    if (!trimmedLine.endsWith(';') && 
        !trimmedLine.endsWith('{') && 
        !trimmedLine.endsWith('}') && 
        !trimmedLine.startsWith('import') &&
        !trimmedLine.startsWith('package') &&
        !trimmedLine.startsWith('public class') &&
        !trimmedLine.startsWith('class') &&
        !trimmedLine.includes(' class ') &&
        !trimmedLine.includes(' if ') &&
        !trimmedLine.includes(' else ') &&
        !trimmedLine.includes(' for ') &&
        !trimmedLine.includes(' while ')) {
      
      // This looks like a statement that should end with semicolon
      issues.push({
        id: `missing-semicolon-${lineNum}`,
        type: 'error',
        message: 'Missing semicolon at the end of the statement',
        line: lineNum,
        code: line,
        suggestion: `${line};`
      });
    }
    
    // Check for common typos
    if (line.includes("Strng") && !line.includes("String")) {
      issues.push({
        id: `string-typo-${lineNum}`,
        type: 'error',
        message: 'Misspelled type: "Strng" should be "String"',
        line: lineNum,
        code: line,
        suggestion: line.replace(/\bStrng\b/g, 'String')
      });
    }
    
    // Check for "statisc" typo (common error in Java)
    if (line.includes("statisc") && !line.includes("static")) {
      issues.push({
        id: `static-typo-${lineNum}`,
        type: 'error',
        message: 'Misspelled keyword: "statisc" should be "static"',
        line: lineNum, 
        code: line,
        suggestion: line.replace(/\bstatisc\b/g, 'static')
      });
    }
    
    // Check for "vaoid" typo (should be "void")
    if (line.includes("vaoid") && !line.includes("void")) {
      issues.push({
        id: `void-typo-${lineNum}`,
        type: 'error',
        message: 'Misspelled keyword: "vaoid" should be "void"',
        line: lineNum,
        code: line,
        suggestion: line.replace(/\bvaoid\b/g, 'void')
      });
    }
    
    // Check for System.osut typo (common error)
    if (line.includes("System.osut") && !line.includes("System.out")) {
      issues.push({
        id: `system-out-typo-${lineNum}`,
        type: 'error',
        message: 'Misspelled object: "System.osut" should be "System.out"',
        line: lineNum,
        code: line,
        suggestion: line.replace(/System\.osut/g, 'System.out')
      });
    }
    
    // Check for prSintln typo (should be println)
    if (line.includes("prSintln") && !line.includes("println")) {
      issues.push({
        id: `println-typo-${lineNum}`,
        type: 'error',
        message: 'Misspelled method: "prSintln" should be "println"',
        line: lineNum,
        code: line,
        suggestion: line.replace(/prSintln/g, 'println')
      });
    }
  }

  return { issues };
};

// Add detailed analysis function for authenticated users
analyzeJava.detailedAnalysis = async (code) => {
  // First get basic issues
  const { issues } = analyzeJava(code);
  
  // Then add more advanced analysis for authenticated users
  // Add additional insights...
  
  return {
    issues,
    metrics: {
      complexity: calculateComplexity(code),
      lines: code.split('\n').length,
      methods: countMethods(code)
    },
    suggestions: generateSuggestions(code, issues)
  };
};

// Helper functions
function calculateComplexity(code) {
  // Simple complexity calculation
  return Math.min(10, Math.max(1, Math.floor(code.length / 100)));
}

function countMethods(code) {
  // Count method declarations
  const methodMatches = code.match(/\b(public|private|protected)?\s*\w+\s+\w+\s*\([^)]*\)\s*\{/g) || [];
  return methodMatches.length;
}

function generateSuggestions(code, issues) {
  // Generate additional improvement suggestions
  const suggestions = [];
  
  // Add basic suggestions
  if (issues.length > 0) {
    suggestions.push("Fix the identified errors before proceeding");
  }
  
  // Check for overly complex methods
  if (code.length > 500) {
    suggestions.push("Consider breaking down large methods into smaller ones");
  }
  
  return suggestions;
}

module.exports = {
  analyzeJava: exports.analyzeJava,
  analyze: exports.analyze
};