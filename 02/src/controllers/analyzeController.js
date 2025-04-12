const config = require('../config');

// Import language-specific analyzers
const { analyzeJava, analyzeJavaScript, analyzePython } = require('../services/analyzers');

/**
 * Controller for code analysis API endpoints
 */

/**
 * Analyze code in the specified language
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.analyzeCode = (req, res) => {
  const { code, language } = req.body;
  
  if (!code) {
    return res.status(400).json({ 
      error: 'No code provided',
      issues: [] 
    });
  }
  
  let results = [];
  
  try {
    switch (language.toLowerCase()) {
      case 'java':
        results = analyzeJava(code).issues || [];
        break;
      case 'javascript':
        results = analyzeJavaScript(code).issues || [];
        break;
      case 'python':
        results = analyzePython(code).issues || [];
        break;
      default:
        return res.status(400).json({ 
          error: 'Unsupported language',
          issues: [] 
        });
    }
    
    // Ensure we always have a valid array of issues
    if (!Array.isArray(results)) {
      results = [];
    }
    
    console.log(`Analyzed ${language} code, found ${results.length} issues`);
    
    return res.json({ issues: results });
  } catch (error) {
    console.error('Error analyzing code:', error);
    return res.status(500).json({ 
      error: 'An error occurred while analyzing the code',
      details: error.message,
      issues: [] // Always include an issues array even on error
    });
  }
};

/**
 * Provide detailed code analysis (available for authenticated users)
 */
exports.detailedAnalysis = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    
    // Validate input
    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }
    
    if (!config.codeExecution.allowedLanguages.includes(language)) {
      return res.status(400).json({ error: 'Unsupported language' });
    }
    
    let result = {};
    
    // Call language-specific analysis with detailed flag
    switch (language.toLowerCase()) {
      case 'java':
        result = await analyzeJava.detailedAnalysis(code);
        break;
      case 'javascript':
        result = await analyzeJavaScript.detailedAnalysis(code);
        break;
      case 'python':
        result = await analyzePython.detailedAnalysis(code);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported language' });
    }
    
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get supported languages for analysis
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
exports.getSupportedLanguages = (req, res) => {
  return res.json({
    languages: [
      {
        id: 'java',
        name: 'Java',
        version: '17',
        features: ['Syntax checking', 'Spelling detection', 'Method suggestions']
      },
      {
        id: 'javascript',
        name: 'JavaScript',
        version: 'ES6+',
        features: ['Syntax checking', 'Best practices', 'Modern syntax suggestions']
      },
      {
        id: 'python',
        name: 'Python',
        version: '3.x',
        features: ['PEP 8 compliance', 'Syntax checking', 'Library suggestions']
      }
    ]
  });
};