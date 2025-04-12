const { spawn } = require('child_process');
const { sanitizeCode } = require('../../utils/securityUtils');
const fs = require('fs');
const os = require('os');
const path = require('path');

/**
 * Format Java code using Google Java Format
 * @param {string} code - The code to format
 * @returns {Promise<string>} - Formatted code
 */
exports.format = async (code) => {
  try {
    // Sanitize the code for security
    const sanitizedCode = sanitizeCode(code, 'java');
    
    // Try to extract class name for file naming
    let className = 'TemporaryClass';
    const classMatch = sanitizedCode.match(/class\s+(\w+)/);
    if (classMatch && classMatch[1]) {
      className = classMatch[1];
    }
    
    // Write code to temporary file for formatting
    const tempFilePath = path.join(os.tmpdir(), `${className}.java`);
    fs.writeFileSync(tempFilePath, sanitizedCode);
    
    try {
      // Try to use Google Java Format if available
      const formattedCode = await formatWithGoogleJavaFormat(tempFilePath);
      
      // Clean up the temporary file
      fs.unlinkSync(tempFilePath);
      
      return formattedCode;
    } catch (googleFormatError) {
      console.error('Google Java Format failed:', googleFormatError);
      
      // If Google Java Format fails, use basic formatter
      const formattedCode = basicJavaFormat(sanitizedCode);
      
      // Clean up the temporary file
      fs.unlinkSync(tempFilePath);
      
      return formattedCode;
    }
  } catch (error) {
    console.error('Java formatting error:', error);
    // If formatting fails, return the original code
    return code;
  }
};

// Helper functions

async function formatWithGoogleJavaFormat(filePath) {
  return new Promise((resolve, reject) => {
    // Command to run Google Java Format (assumes it's installed)
    const googleJavaFormat = spawn('google-java-format', ['-i', filePath]);
    
    let stderr = '';
    
    googleJavaFormat.stderr.on('data', data => {
      stderr += data.toString();
    });
    
    googleJavaFormat.on('close', code => {
      if (code !== 0) {
        reject(new Error(`Google Java Format failed: ${stderr}`));
        return;
      }
      
      // Read the formatted file
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
  });
}

// Basic Java formatter in case external tools are not available
function basicJavaFormat(code) {
  // Split code into lines
  const lines = code.split('\n');
  
  let indentLevel = 0;
  const formattedLines = [];
  
  for (let line of lines) {
    // Remove leading/trailing whitespace
    line = line.trim();
    
    // Adjust indentation for closing braces
    if (line.startsWith('}')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    // Add proper indentation
    if (line.length > 0) {
      formattedLines.push(' '.repeat(indentLevel * 4) + line);
    } else {
      formattedLines.push('');
    }
    
    // Adjust indentation for opening braces
    if (line.endsWith('{')) {
      indentLevel++;
    }
  }
  
  return formattedLines.join('\n');
}