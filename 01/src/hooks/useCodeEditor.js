import { useState, useCallback } from 'react';

/**
 * Hook to manage code editor state and operations
 * @param {string} initialCode - Initial code content 
 * @param {string} initialLanguage - Initial language
 * @returns {Object} Editor state and functions
 */
const useCodeEditor = (initialCode = '', initialLanguage = 'javascript') => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLanguage);
  
  // Handle code changes
  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode);
  }, []);
  
  // Handle language changes
  const handleLanguageChange = useCallback((newLanguage) => {
    setLanguage(newLanguage);
  }, []);
  
  // Format code (placeholder)
  const formatCode = useCallback(() => {
    // In a real app, this would call a formatter service
    let formatted = code;
    
    // Simple formatting examples
    if (language === 'javascript') {
      // Replace multiple semicolons with single ones
      formatted = code.replace(/;+/g, ';');
      // Replace var with const where appropriate
      formatted = formatted.replace(/var\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g, 'const $1 =');
    }
    
    setCode(formatted);
    return formatted;
  }, [code, language]);
  
  return {
    code,
    language,
    setCode: handleCodeChange,
    setLanguage: handleLanguageChange,
    formatCode
  };
};

export default useCodeEditor;