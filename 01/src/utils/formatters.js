// Add these functions to api.js

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

export const runCode = async (code, language, input = '') => {
  try {
    const response = await fetch(`${API_URL}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ code, language, input }),
    });

    if (!response.ok) {
      throw new Error('Failed to run code');
    }

    return await response.json();
  } catch (error) {
    console.error('Error running code:', error);
    throw error;
  }
};