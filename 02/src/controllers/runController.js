const config = require('../config');
const javaRunner = require('../services/runners/javaRunner');
const javascriptRunner = require('../services/runners/javascriptRunner');
const pythonRunner = require('../services/runners/pythonRunner');
const { handleError } = require('../utils/errorHandler');

// Run code controller
exports.runCode = async (req, res) => {
  try {
    const { code, language, input = '' } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        success: false, 
        output: 'No code provided',
        executionTime: '0.00s' 
      });
    }
    
    // Log exactly what we received to execute
    console.log(`Received ${language} code for execution:`, code);
    
    let result;
    
    if (!config.codeExecution.allowedLanguages.includes(language)) {
      return res.status(400).json({ 
        message: `Unsupported language. Supported languages are: ${config.codeExecution.allowedLanguages.join(', ')}`
      });
    }
    
    switch (language) {
      case 'javascript':
        result = await javascriptRunner.run(code, input);
        break;
      case 'python':
        result = await pythonRunner.run(code, input);
        break;
      case 'java':
        result = await javaRunner.run(code, input);
        break;
      default:
        return res.status(400).json({ 
          success: false, 
          output: `Unsupported language: ${language}`,
          executionTime: '0.00s'
        });
    }
    
    // Return exactly what the runner produced
    return res.json({
      success: result.success,
      output: result.output || "", 
      executionTime: result.executionTime || '0.00s'
    });
  } catch (error) {
    console.error('Run controller error:', error);
    return res.status(500).json({
      success: false,
      output: `Server error: ${error.message}`,
      executionTime: '0.00s'
    });
  }
};