const prettier = require('prettier');
const { sanitizeCode } = require('../../utils/securityUtils');

/**
 * Format JavaScript code using Prettier
 * @param {string} code - The code to format
 * @returns {Promise<string>} - Formatted code
 */
exports.format = async (code) => {
  try {
    // Sanitize the code for security
    const sanitizedCode = sanitizeCode(code, 'javascript');
    
    // Format using Prettier
    const formattedCode = await prettier.format(sanitizedCode, {
      parser: 'babel',
      singleQuote: true,
      trailingComma: 'es5',
      bracketSpacing: true,
      arrowParens: 'avoid',
      printWidth: 80,
      tabWidth: 2,
      semi: true,
    });
    
    return formattedCode;
  } catch (error) {
    console.error('JavaScript formatting error:', error);
    // If formatting fails, return the original code
    return code;
  }
};

/**
 * Format code according to a specific style guide
 * @param {string} code - The code to format
 * @param {string} style - The style guide to follow ('default', 'airbnb', 'google', 'standard')
 * @returns {Promise<string>} - Formatted code
 */
exports.formatWithStyle = async (code, style) => {
  try {
    // Sanitize the code for security
    const sanitizedCode = sanitizeCode(code, 'javascript');
    
    // Configure Prettier based on style guide
    const options = {
      parser: 'babel',
      printWidth: 80,
      tabWidth: 2,
      semi: true,
      singleQuote: true,
    };
    
    // Adjust options based on selected style guide
    switch (style) {
      case 'airbnb':
        options.trailingComma = 'all';
        options.arrowParens = 'always';
        break;
      case 'google':
        options.tabWidth = 2;
        options.singleQuote = true;
        options.trailingComma = 'es5';
        break;
      case 'standard':
        options.semi = false;
        options.singleQuote = true;
        break;
      // Default is already set
    }
    
    // Format using Prettier with style-specific options
    const formattedCode = await prettier.format(sanitizedCode, options);
    
    return formattedCode;
  } catch (error) {
    console.error('JavaScript style formatting error:', error);
    // If formatting fails, return the original code
    return code;
  }
};