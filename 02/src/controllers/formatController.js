const config = require('../config');

// Import language-specific formatters
const javascriptFormatter = require('../services/formatters/javascriptFormatter');
const pythonFormatter = require('../services/formatters/pythonFormatter');
const javaFormatter = require('../services/formatters/javaFormatter');

/**
 * Format code according to language-specific style guidelines
 */
exports.formatCode = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    
    // Validate input
    if (!code) {
      return res.status(400).json({ message: 'Code is required' });
    }
    
    if (!config.codeExecution.allowedLanguages.includes(language)) {
      return res.status(400).json({ 
        message: `Unsupported language. Supported languages are: ${config.codeExecution.allowedLanguages.join(', ')}`
      });
    }
    
    // Select the appropriate formatter based on language
    let formattedCode;
    switch (language) {
      case 'javascript':
        formattedCode = await javascriptFormatter.format(code);
        break;
      case 'python':
        formattedCode = await pythonFormatter.format(code);
        break;
      case 'java':
        formattedCode = await javaFormatter.format(code);
        break;
      default:
        formattedCode = code;
    }
    
    res.status(200).json({ 
      formattedCode,
      language 
    });
  } catch (error) {
    next(error);
  }
};