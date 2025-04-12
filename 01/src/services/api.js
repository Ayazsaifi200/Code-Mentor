// Base API service for making requests to our backend

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Rest of the API methods...

/**
 * Test backend connection
 * @returns {Promise<Object>} - Connection status
 */
export const testBackendConnection = async () => {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      credentials: 'include',
    });
    return await response.json();
  } catch (error) {
    console.error('Backend connection error:', error);
    throw error;
  }
};

/**
 * Format code according to language-specific style
 * @param {string} code - The code to format
 * @param {string} language - Programming language
 * @returns {Promise<Object>} - Formatted code
 */
export const formatCode = async (code, language) => {
  try {
    const response = await fetch(`${API_URL}/format`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ code, language }),
    });

    if (!response.ok) {
      throw new Error('Failed to format code');
    }

    return await response.json();
  } catch (error) {
    console.error('Error formatting code:', error);
    throw error;
  }
};

/**
 * Run code execution
 * @param {string} code - The code to run
 * @param {string} language - Programming language
 * @param {string} input - Optional input for the code
 * @returns {Promise<Object>} - Execution result
 */
export const runCode = async (code, language, input = '') => {
  try {
    // Log the EXACT code we're sending
    console.log(`Sending EXACT code to backend:`, code);
    
    const response = await fetch(`${API_URL}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        code,  // Send exactly what the user typed 
        language, 
        input 
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error executing code:', error);
    throw error;
  }
};

// Clean the output to show only results, not syntax
function cleanOutput(output, language) {
  // Remove any debug or syntax information that might be in the output
  // Depends on how your backend returns results
  
  // For Java, remove any class/package declaration outputs
  if (language === 'java') {
    output = output.replace(/^(public class|class|package).*$/gm, '');
  }
  
  // Remove any compilation messages
  output = output.replace(/^(Compiling|Executing).*$/gm, '');
  
  return output.trim();
}

/**
 * Send code for analysis
 * @param {string} code - The code to analyze
 * @param {string} language - Programming language
 * @returns {Promise<Object>} - Analysis results
 */
export const analyzeCode = async (code, language) => {
  try {
    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ code, language }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze code');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing code:', error);
    throw error;
  }
};

/**
 * Get learning path data
 * @param {string} userId - Optional user ID
 * @returns {Promise<Array>} - Learning path data
 */
export const getLearningPath = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/learning-path${userId ? `?userId=${userId}` : ''}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch learning path');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching learning path:', error);
    return [];
  }
};

/**
 * Update progress for a learning exercise
 * @param {string} exerciseId - Exercise ID
 * @param {boolean} completed - Completion status
 * @returns {Promise<Object>} - Updated progress
 */
export const updateProgress = async (exerciseId, completed) => {
  try {
    const response = await fetch(`${API_URL}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ exerciseId, completed }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update progress');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
};