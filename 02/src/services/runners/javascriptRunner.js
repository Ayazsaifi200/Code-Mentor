const vm = require('vm');
const { sanitizeCode } = require('../../utils/securityUtils');
const config = require('../../config');
const { VM } = require('vm2');

/**
 * Run JavaScript code in a sandboxed environment
 * @param {string} code - The code to execute
 * @param {string} input - Optional input for the code
 * @returns {Promise<Object>} - Result of execution
 */
exports.run = async (code, input = '') => {
  const startTime = process.hrtime();
  let output = '';
  let success = true;
  
  try {
    // Log exactly what code we're executing 
    console.log("Backend executing JavaScript:", code);
    
    // Create a secure VM with output capturing
    const vm = new VM({
      timeout: 5000,
      sandbox: {
        input,
        console: {
          log: (...args) => {
            const strArgs = args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' ');
            console.log("VM output:", strArgs); // Debug log
            output += strArgs + '\n';
          }
        }
      }
    });
    
    // Execute the exact code
    vm.run(code);
    
  } catch (error) {
    console.error("JavaScript execution error:", error.message);
    output = `Error: ${error.message}`;
    success = false;
  }
  
  const endTime = process.hrtime(startTime);
  const executionTime = (endTime[0] + endTime[1] / 1e9).toFixed(2);
  
  console.log("Final output:", output.trim());
  
  return {
    success,
    output: output.trim(),
    executionTime: `${executionTime}s`
  };
};