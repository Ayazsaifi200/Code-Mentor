const crypto = require('crypto');

/**
 * Generate a secure random token
 */
exports.generateToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Sanitize code to prevent security issues
 * @param {string} code - Code to sanitize
 * @param {string} language - Programming language
 * @returns {string} - Sanitized code
 */
exports.sanitizeCode = (code, language) => {
  // Basic sanitization
  if (!code) return '';
  
  // Limit code length
  const maxLength = 10000;
  if (code.length > maxLength) {
    code = code.substring(0, maxLength);
  }
  
  // Language-specific sanitization
  switch (language) {
    case 'javascript':
      // Prevent file system access and other dangerous operations
      code = code.replace(/require\s*\(\s*['"](fs|child_process|http|net|os|path|process|crypto)['"]/, 
                         '/* Blocked */ require("blocked"');
      break;
    case 'python':
      // Prevent file system operations and other dangerous imports
      code = code.replace(/import\s+(os|sys|subprocess|shutil|importlib|pathlib|requests|urllib)/g, 
                         '# Blocked: import');
      code = code.replace(/from\s+(os|sys|subprocess|shutil|importlib|pathlib|requests|urllib)/g, 
                         '# Blocked: from');
      break;
    case 'java':
      // Prevent file system and process operations
      code = code.replace(/import\s+java\.(io|nio|net|lang\.Runtime)/g, 
                         '// Blocked: import');
      break;
  }
  
  return code;
};

/**
 * Validate and sanitize user input
 */
exports.sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  // Remove potentially harmful characters
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
};