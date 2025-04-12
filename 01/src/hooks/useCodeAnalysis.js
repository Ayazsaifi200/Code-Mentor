import { useState, useEffect } from 'react';
import { analyzeJava, analyzeJavaScript, analyzePython } from '../services/codeAnalysisService';
import useDebounce from './useDebounce';

const useCodeAnalysis = (code, language) => {
  const [errors, setErrors] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  
  // Debounce code changes to avoid too many analyses
  const debouncedCode = useDebounce(code, 500);
  
  useEffect(() => {
    const analyze = async () => {
      if (!debouncedCode) {
        setErrors([]);
        return;
      }
      
      setAnalyzing(true);
      let results = [];
      
      try {
        switch (language) {
          case 'java':
            results = analyzeJava(debouncedCode);
            break;
          case 'javascript':
            results = analyzeJavaScript(debouncedCode);
            break;
          case 'python':
            results = analyzePython(debouncedCode);
            break;
          default:
            results = [];
        }
        
        setErrors(results);
      } catch (error) {
        console.error('Error analyzing code:', error);
      } finally {
        setAnalyzing(false);
      }
    };
    
    analyze();
  }, [debouncedCode, language]);
  
  return { errors, analyzing };
};

export default useCodeAnalysis;