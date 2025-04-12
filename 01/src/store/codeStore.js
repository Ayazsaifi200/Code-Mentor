import { create } from 'zustand';
import * as api from '../services/api';
import codeAnalysisService from '../services/codeAnalysisService';

// Replace the languageTemplates with minimal versions:
const languageTemplates = {
  javascript: `// JavaScript Program
// Write your JavaScript code here
console.log("Hello, world!");
`,
  python: `# Python Program
# Write your Python code here
print("Hello, world!")
`,
  java: `// Java Program
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}`
};

// Default template for fallback
const defaultTemplate = '// Write your code here\nconsole.log("Hello world!");';

// Helper function to get language-specific analyzer
const getAnalyzer = (language) => {
  switch(language) {
    case 'javascript': return codeAnalysisService.analyzeJavaScript;
    case 'python': return codeAnalysisService.analyzePython;
    case 'java': return codeAnalysisService.analyzeJava;
    default: return codeAnalysisService.analyzeJavaScript;
  }
};

// Update this to prevent template resets
const useCodeStore = create((set, get) => ({
  code: languageTemplates.javascript, // Initial template
  language: 'javascript',
  output: null,
  feedback: [],
  isAnalyzing: false,
  
  // The proper way to set code - NEVER reset to template
  setCode: (newCode) => {
    // IMPORTANT: Don't overwrite user code with templates
    console.log("Setting code to:", newCode);
    
    // Only use template if specifically requested or if empty
    if (newCode !== null && newCode !== undefined) {
      set({ code: newCode });
    }
  },
  
  // When language changes, only set template if empty
  setLanguage: (language) => {
    const { code } = get();
    
    // Only use template if code is completely empty
    const newCode = !code || code.trim() === '' ? 
      languageTemplates[language] : 
      code; // Keep user's code
      
    set({ language, code: newCode });
  },
  
  // Code analysis
  analyzeCode: async () => {
    const { code, language } = get();
    set({ isAnalyzing: true, feedback: [] });
    
    try {
      // Try fast local analysis first
      const quickResults = getAnalyzer(language)(code);
      
      // Then get full analysis from backend
      const response = await api.analyzeCode(code, language);
      
      // Combine results or use backend results
      set({ 
        feedback: response.feedback || quickResults, 
        isAnalyzing: false 
      });
      
      return response;
    } catch (error) {
      console.error('Error analyzing code:', error);
      // Fall back to local analysis if backend fails
      set({ 
        feedback: getAnalyzer(language)(code),
        isAnalyzing: false 
      });
      throw error;
    }
  },
  
  // Format code
  formatCode: async () => {
    const { code, language } = get();
    
    try {
      const response = await api.formatCode(code, language);
      if (response.formattedCode) {
        set({ code: response.formattedCode });
      }
      return response;
    } catch (error) {
      console.error('Error formatting code:', error);
      // Fallback to basic formatting if API fails
      const formattedCode = code
        .replace(/var /g, 'const ')
        .replace(/;+/g, ';');
      set({ code: formattedCode });
      throw error;
    }
  },
  
  // Modify the runCode function to send ONLY the user's code
  runCode: async (input = '') => {
    const { code, language } = get();
    
    // Log the exact code we're running
    console.log(`Running exact code in ${language}:`, code);
    
    try {
      // IMPORTANT: Save the current code value before making API call
      const currentCode = code; 
      
      const result = await api.runCode(currentCode, language, input);
      
      // Ensure the code in the store hasn't been changed
      if (get().code !== currentCode) {
        // If something changed the code during API call, restore it
        set({ code: currentCode });
      }
      
      return {
        success: result.success,
        output: result.output,
        executionTime: result.executionTime || "0.00s"
      };
    } catch (error) {
      console.error('Error running code:', error);
      return {
        success: false,
        output: `Error: ${error.message}`,
        executionTime: "0.00s"
      };
    }
  },
  
  // Apply a single suggestion
  applySuggestion: (suggestionId) => {
    const { feedback, code } = get();
    const suggestion = feedback.find(item => item.id === suggestionId);
    
    if (!suggestion || !suggestion.fix || suggestion.fix.replacement === undefined) {
      return;
    }
    
    const { start, end, replacement } = suggestion.fix;
    const newCode = code.substring(0, start) + replacement + code.substring(end);
    set({ code: newCode });
  },
  
  // Apply all suggestions at once
  applyAllSuggestions: () => {
    const { feedback, code } = get();
    
    // Sort fixes by position in reverse order to avoid offset issues
    const fixes = feedback
      .filter(item => item.fix && item.fix.replacement !== undefined)
      .map(item => item.fix)
      .sort((a, b) => b.start - a.start);
    
    let newCode = code;
    fixes.forEach(({ start, end, replacement }) => {
      newCode = newCode.substring(0, start) + replacement + newCode.substring(end);
    });
    
    set({ code: newCode });
  }
}));

export default useCodeStore;