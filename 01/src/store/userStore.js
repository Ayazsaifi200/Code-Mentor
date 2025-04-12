import { create } from 'zustand';
import { analyzeCode } from '../services/api';

const useCodeStore = create((set, get) => ({
  code: '// Write your code here',
  language: 'javascript',
  feedback: [],
  isAnalyzing: false,
  error: null,

  setCode: (newCode) => set({ code: newCode }),
  
  setLanguage: (newLanguage) => set({ language: newLanguage }),
  
  analyzeCode: async () => {
    const { code, language } = get();
    
    if (!code.trim()) {
      set({ feedback: [], isAnalyzing: false });
      return;
    }
    
    set({ isAnalyzing: true, error: null });
    
    try {
      // In a real implementation, this would call the backend API
      // const result = await analyzeCode(code, language);
      
      // Mock analysis for demonstration
      const mockAnalysis = [];
      
      if (code.includes('var ')) {
        mockAnalysis.push({
          id: Date.now() + 1,
          type: 'warning',
          message: 'Consider using const or let instead of var',
          line: code.split('\n').findIndex(line => line.includes('var ')) + 1,
          suggestion: 'Replace "var" with "const" if the variable is not reassigned, or "let" if it is.'
        });
      }
      
      if (code.includes('function') && !code.includes('=>')) {
        mockAnalysis.push({
          id: Date.now() + 2,
          type: 'suggestion',
          message: 'Consider using arrow functions for cleaner syntax',
          line: code.split('\n').findIndex(line => line.includes('function')) + 1,
          suggestion: 'Change "function name(params) {}" to "const name = (params) => {}"'
        });
      }
      
      if (code.includes('console.log')) {
        mockAnalysis.push({
          id: Date.now() + 3,
          type: 'info',
          message: 'Console statements should be removed in production code',
          line: code.split('\n').findIndex(line => line.includes('console.log')) + 1,
          suggestion: 'Consider using a logging library or removing this before deployment.'
        });
      }
      
      // Simulate API delay
      setTimeout(() => {
        set({ feedback: mockAnalysis, isAnalyzing: false });
      }, 800);
      
    } catch (error) {
      set({ error: error.message, isAnalyzing: false });
    }
  },
  
  clearFeedback: () => set({ feedback: [] }),
}));

export default useCodeStore;