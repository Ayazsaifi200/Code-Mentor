const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const { sanitizeCode } = require('../../utils/securityUtils');
const config = require('../../config');
const crypto = require('crypto');

/**
 * Execute Python code and return the result
 * @param {string} code - The Python code to execute
 * @param {string} input - Optional input for the code
 * @returns {Promise<Object>} - Result of execution
 */
exports.execute = async (code, input = '') => {
  try {
    // Sanitize the code for security
    const sanitizedCode = sanitizeCode(code, 'python');
    
    // Add input handling to the code
    const codeWithInputHandling = addInputHandling(sanitizedCode, input);
    
    // Write code to a temporary file
    const tempFile = path.join(os.tmpdir(), `py_exec_${Date.now()}.py`);
    fs.writeFileSync(tempFile, codeWithInputHandling, 'utf8');
    
    // Execute the Python code with timeout
    const result = await executePythonWithTimeout(tempFile, config.codeExecution.timeoutMs);
    
    // Clean up temporary file
    try {
      fs.unlinkSync(tempFile);
    } catch (error) {
      console.error('Error removing temporary Python file:', error);
    }
    
    return result;
  } catch (error) {
    console.error('Python execution error:', error);
    return {
      success: false,
      output: '',
      errors: error.toString(),
      executionTime: 0
    };
  }
};

/**
 * Add input handling to Python code
 * @param {string} code - Python code
 * @param {string} input - User input
 * @returns {string} - Modified code with input handling
 */
function addInputHandling(code, input) {
  // Prepare input lines
  const inputLines = input.split('\n');
  const inputHandlingCode = `
# Set up input handling
_input_lines = ${JSON.stringify(inputLines)}
_input_index = 0

# Override input function
def input(prompt=""):
    global _input_index, _input_lines
    if prompt:
        print(prompt, end="")
    if _input_index < len(_input_lines):
        result = _input_lines[_input_index]
        _input_index += 1
        print(result)  # Echo the input
        return result
    return ""

# Set up output redirection
import sys
class CaptureOutput:
    def __init__(self):
        self.stdout_lines = []
        self.stderr_lines = []
        self.original_stdout = sys.stdout
        self.original_stderr = sys.stderr
    
    def stdout_write(self, text):
        self.stdout_lines.append(text)
        self.original_stdout.write(text)
    
    def stderr_write(self, text):
        self.stderr_lines.append(text)
        self.original_stderr.write(text)

_output_capture = CaptureOutput()

class StdoutRedirector:
    def write(self, text):
        _output_capture.stdout_write(text)
    
    def flush(self):
        self.original_stdout.flush()

class StderrRedirector:
    def write(self, text):
        _output_capture.stderr_write(text)
    
    def flush(self):
        self.original_stderr.flush()

sys.stdout = StdoutRedirector()
sys.stderr = StderrRedirector()

try:
${code.split('\n').map(line => '    ' + line).join('\n')}
except Exception as e:
    sys.stderr.write(str(e))

# Print a special marker to separate stdout and stderr in the output
print("\\n__PYTHON_EXECUTION_COMPLETED__")
if _output_capture.stderr_lines:
    print("\\n__ERROR_OUTPUT_FOLLOWS__")
    for line in _output_capture.stderr_lines:
        print(line, end="")
`;

  return inputHandlingCode;
}

/**
 * Execute Python code with a timeout
 * @param {string} filePath - Path to Python file
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Object>} - Result of execution
 */
async function executePythonWithTimeout(filePath, timeout) {
  return new Promise((resolve) => {
    // Track execution time
    const startTime = process.hrtime();
    
    // Spawn Python process
    const pythonProcess = spawn('python', [filePath]);
    
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    
    // Handle process output
    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    // Handle timeout
    const timeoutId = setTimeout(() => {
      timedOut = true;
      pythonProcess.kill();
      
      // Calculate execution time before timeout
      const executionTime = calculateExecutionTime(startTime);
      
      resolve({
        success: false,
        output: stdout,
        errors: 'Execution timed out after ' + (timeout / 1000) + ' seconds',
        executionTime
      });
    }, timeout);
    
    // Handle process completion
    pythonProcess.on('close', (code) => {
      if (timedOut) return;
      
      // Clear the timeout
      clearTimeout(timeoutId);
      
      // Calculate execution time
      const executionTime = calculateExecutionTime(startTime);
      
      // Parse output to separate stdout and stderr
      let output = stdout;
      let errors = stderr;
      
      const markerIndex = stdout.indexOf('\n__PYTHON_EXECUTION_COMPLETED__');
      if (markerIndex !== -1) {
        output = stdout.substring(0, markerIndex);
        
        const errorMarkerIndex = stdout.indexOf('\n__ERROR_OUTPUT_FOLLOWS__');
        if (errorMarkerIndex !== -1 && errorMarkerIndex > markerIndex) {
          errors = stdout.substring(errorMarkerIndex + '\n__ERROR_OUTPUT_FOLLOWS__'.length);
        }
      }
      
      resolve({
        success: code === 0 && !errors,
        output: output.trim(),
        errors: errors.trim(),
        executionTime
      });
    });
  });
}

/**
 * Calculate execution time in milliseconds from a high-resolution time tuple
 * @param {[number, number]} startTime - The start time from process.hrtime()
 * @returns {number} - Execution time in milliseconds
 */
function calculateExecutionTime(startTime) {
  const [seconds, nanoseconds] = process.hrtime(startTime);
  return seconds * 1000 + nanoseconds / 1000000;
}

/**
 * Run Python code and return the result
 * @param {string} code - The Python code to execute
 * @param {string} input - Optional input for the code
 * @returns {Promise<Object>} - Result of execution
 */
exports.run = async (code, input = '') => {
  const startTime = process.hrtime();
  const scriptId = crypto.randomBytes(8).toString('hex');
  const tempDir = path.join(__dirname, '../../../temp');
  const scriptPath = path.join(tempDir, `python_${scriptId}.py`);
  
  try {
    // Log exactly what code we're executing
    console.log("Backend executing Python:", code);
    
    // Ensure temp directory exists
    await fs.mkdir(tempDir, { recursive: true });
    
    // Write exact code to file
    await fs.writeFile(scriptPath, code);
    
    // Execute Python process
    const pythonProcess = spawn('python', [scriptPath]);
    
    let stdout = '';
    let stderr = '';
    
    // Handle input if needed
    if (input) {
      pythonProcess.stdin.write(input);
      pythonProcess.stdin.end();
    }
    
    // Collect stdout
    pythonProcess.stdout.on('data', (data) => {
      const chunk = data.toString();
      console.log(`Python stdout: ${chunk}`);
      stdout += chunk;
    });
    
    // Collect stderr
    pythonProcess.stderr.on('data', (data) => {
      const chunk = data.toString();
      console.log(`Python stderr: ${chunk}`);
      stderr += chunk;
    });
    
    // Wait for process to complete
    const exitCode = await new Promise((resolve) => {
      pythonProcess.on('close', resolve);
    });
    
    // Clean up temporary file
    try {
      await fs.unlink(scriptPath);
    } catch (err) {
      console.error(`Error deleting Python file: ${err.message}`);
    }
    
    const endTime = process.hrtime(startTime);
    const executionTime = (endTime[0] + endTime[1] / 1e9).toFixed(2);
    
    console.log("Final Python output:", stdout);
    
    return {
      success: exitCode === 0,
      output: exitCode === 0 ? stdout : stderr,
      executionTime: `${executionTime}s`
    };
  } catch (error) {
    console.error(`Python execution error: ${error.message}`);
    
    // Clean up on error
    try {
      await fs.unlink(scriptPath);
    } catch {}
    
    return {
      success: false,
      output: `Error: ${error.message}`,
      executionTime: '0.00s'
    };
  }
};