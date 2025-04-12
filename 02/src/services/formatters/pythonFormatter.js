const { spawn } = require('child_process');
const { sanitizeCode } = require('../../utils/securityUtils');
const fs = require('fs');
const os = require('os');
const path = require('path');

/**
 * Format Python code using Black or YAPF
 * @param {string} code - The code to format
 * @returns {Promise<string>} - Formatted code
 */
exports.format = async (code) => {
  try {
    // Sanitize the code for security
    const sanitizedCode = sanitizeCode(code, 'python');
    
    // Write code to a temporary file
    const tempFilePath = path.join(os.tmpdir(), `py_format_${Date.now()}.py`);
    fs.writeFileSync(tempFilePath, sanitizedCode);
    
    // Try to use Black formatter first (most popular Python formatter)
    try {
      const formattedCode = await formatWithBlack(tempFilePath);
      
      // Clean up the temporary file
      fs.unlinkSync(tempFilePath);
      
      return formattedCode;
    } catch (blackError) {
      console.error('Black formatting failed, trying YAPF:', blackError);
      
      // If Black fails, try YAPF
      try {
        const formattedCode = await formatWithYapf(tempFilePath);
        
        // Clean up the temporary file
        fs.unlinkSync(tempFilePath);
        
        return formattedCode;
      } catch (yapfError) {
        console.error('YAPF formatting failed:', yapfError);
        
        // If both formatters fail, use a basic formatter
        const formattedCode = await basicPythonFormat(sanitizedCode);
        
        // Clean up the temporary file
        fs.unlinkSync(tempFilePath);
        
        return formattedCode;
      }
    }
  } catch (error) {
    console.error('Python formatting error:', error);
    // If formatting fails, return the original code
    return code;
  }
};

// Helper functions

async function formatWithBlack(filePath) {
  return new Promise((resolve, reject) => {
    const black = spawn('black', ['-q', filePath]);
    
    let stderr = '';
    
    black.stderr.on('data', data => {
      stderr += data.toString();
    });
    
    black.on('close', code => {
      if (code !== 0) {
        reject(new Error(`Black formatter failed: ${stderr}`));
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

async function formatWithYapf(filePath) {
  return new Promise((resolve, reject) => {
    const yapf = spawn('yapf', [filePath, '--in-place']);
    
    let stderr = '';
    
    yapf.stderr.on('data', data => {
      stderr += data.toString();
    });
    
    yapf.on('close', code => {
      if (code !== 0) {
        reject(new Error(`YAPF formatter failed: ${stderr}`));
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

// Basic Python formatter in case external tools are not available
async function basicPythonFormat(code) {
  // Split the code into lines
  const lines = code.split('\n');
  
  // Format the code (basic indentation and whitespace correction)
  const formattedLines = lines.map(line => {
    // Remove trailing whitespace
    let formatted = line.trimRight();
    
    // Ensure single space after commas in lists and function calls
    formatted = formatted.replace(/,\s*/g, ', ');
    
    // Add space around operators
    formatted = formatted.replace(/([+\-*/%=<>!&|^]+)/g, ' $1 ')
                         .replace(/\s+/g, ' ')
                         .trim();
    
    // Fix spacing in function definitions and calls
    formatted = formatted.replace(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, 'def $1(');
    
    return formatted;
  });
  
  return formattedLines.join('\n');
}