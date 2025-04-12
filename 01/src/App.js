import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import CodeEditor from './components/CodeEditor/CodeEditor';
import EditorToolbar from './components/CodeEditor/EditorToolbar';
import FeedbackPanel from './components/Feedback/FeedbackPanel';
import LearningPath from './components/Dashboard/LearningPath';
import RepoList from './components/GitHub/RepoList';
import AccountProfile from './components/Profile/AccountProfile';
import Footer from './components/Layout/Footer';
import { getCurrentUser } from './services/authService';
import useCodeStore from './store/codeStore';
import './styles/App.css';
import './styles/editor.css';
import './styles/feedback.css';
import './styles/navbar.css';
import './styles/profile.css';

function App() {
  const [activeTab, setActiveTab] = useState('editor');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { 
    code, language, feedback, isAnalyzing, 
    setCode, setLanguage, analyzeCode, formatCode, runCode,
    applySuggestion, applyAllSuggestions 
  } = useCodeStore();
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Test backend connection first
        try {
          const healthResponse = await fetch('/api/auth/health');
          const healthData = await healthResponse.json();
          console.log('Backend connection test:', healthData);
        } catch (err) {
          console.error('Backend connection test failed:', err);
        }
        
        // Continue with user fetch
        const user = await getCurrentUser();
        console.log("Retrieved user:", user);
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    // Listen for Google login success events
    const handleGoogleLoginSuccess = (event) => {
      console.log("App received Google login success:", event.detail);
      setCurrentUser(event.detail);
      setIsLoading(false);
    };
    
    document.addEventListener('google-login-success', handleGoogleLoginSuccess);
    
    return () => {
      document.removeEventListener('google-login-success', handleGoogleLoginSuccess);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && currentUser) {
      console.log("User authenticated:", currentUser);
    }
  }, [isLoading, currentUser]);

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/health');
        if (response.ok) {
          const data = await response.json();
          console.log('Backend connection successful:', data);
        } else {
          console.error('Backend connection failed:', response.statusText);
        }
      } catch (error) {
        console.error('Backend connection error:', error);
      }
    };

    checkBackendConnection();
  }, []);

  const handleLoginSuccess = (user) => {
    console.log("Login successful:", user);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Handler for code formatting
  const handleFormatCode = async () => {
    console.log("Format code requested");
    try {
      await formatCode();
    } catch (error) {
      console.error('Error formatting code:', error);
    }
  };

  // Handler for running code
  const handleRunCode = async () => {
    console.log("Run code requested");
    
    // IMPORTANT: Force save the editor content first
    if (typeof window !== 'undefined' && window.forceSaveEditor) {
      window.forceSaveEditor();
    }
    
    setIsRunning(true);
    setOutput(null);
    
    // Get the current code directly from the store
    // after forcing an editor content save
    const currentCode = code;
    console.log("EXECUTING EXACT CODE:", currentCode);
    
    try {
      // Execute the current code exactly as written
      const result = await runCode();
      
      if (!result) {
        throw new Error("No response from code execution service");
      }
      
      // Set the output state with the result
      setOutput({
        result: result.success ? "Code execution successful" : "Code execution failed",
        stdout: result.output || "",
        executionTime: result.executionTime || "0.00s"
      });
    } catch (error) {
      console.error('Error running code:', error);
      setOutput({
        result: "Code execution failed",
        stdout: `Error: ${error.message}`,
        executionTime: "0.00s"
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Handler for analyzing code
  const handleAnalyzeCode = async () => {
    if (!code.trim()) {
      alert('Please write some code before analyzing');
      return;
    }

    console.log(`Analyzing ${language} code...`);
    
    try {
      await analyzeCode();
    } catch (error) {
      console.error('Error analyzing code:', error);
    }
  };

  const handleThemeToggle = () => {
    setIsDarkTheme(prev => !prev);
  };

  // Add this handler
  const handleClearCode = () => {
    // Ask for confirmation before clearing
    if (window.confirm("Are you sure you want to clear all code?")) {
      setCode("");
    }
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return <div className="loading">Loading...</div>;
    }
    
    if (!currentUser) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };

  // Content component for editor page
  const EditorContent = () => (
    <div className="editor-container">
      <EditorToolbar 
        language={language} 
        onLanguageChange={setLanguage}
        isAnalyzing={isAnalyzing}
        onFormatCode={handleFormatCode}
        onRunCode={handleRunCode}
        onCodeClear={handleClearCode}  // Add this line
        onThemeToggle={handleThemeToggle} // Add theme toggle
        isDarkTheme={isDarkTheme} // Add theme state
      />
      <div className="editor-feedback-container">
        <div className="editor-section">
          <CodeEditor
            code={code}
            language={language}
            onChange={setCode}
            isDarkTheme={isDarkTheme} // Pass theme to CodeEditor
          />
          <button 
            className="analyze-button" 
            onClick={handleAnalyzeCode}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Code'}
          </button>
        </div>
        <FeedbackPanel 
          feedback={feedback} 
          onApplyAllFixes={applyAllSuggestions}
          onApplySuggestion={applySuggestion}
        />
      </div>
      {output && (
        <div className={`run-result ${isRunning ? 'running' : 'success'}`}>
          <h4>Output:</h4>
          <pre>{output.stdout}</pre>
          <div className="execution-time">Execution time: {output.executionTime}</div>
          <div className="result-spacer"></div> {/* Add extra space */}
        </div>
      )}
    </div>
  );

  // Function to update active tab based on location
  const TabHandler = () => {
    const location = useLocation();
    
    useEffect(() => {
      if (location.pathname === '/') {
        setActiveTab('editor');
      } else if (location.pathname === '/dashboard') {
        setActiveTab('dashboard');
      } else if (location.pathname === '/github') {
        setActiveTab('github');
      }
    }, [location]);
    
    return null;
  };

  useEffect(() => {
    // Auto scroll to results when they appear
    if (output && !isRunning) {
      const resultElement = document.querySelector('.run-result');
      if (resultElement) {
        // Use smooth scrolling to make the output visible
        resultElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest'
        });
        
        // Add some space to ensure footer doesn't overlap
        window.scrollBy(0, -100);
      }
    }
  }, [output, isRunning]);

  return (
    <Router>
      <div className="app">
        <TabHandler />
        <Navbar 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          user={currentUser}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
        />
        
        <main className="content">
          {isLoading ? (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <div className="loading-text">Loading...</div>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<EditorContent />} />
              <Route path="/dashboard" element={<LearningPath />} />
              <Route path="/github" element={<RepoList />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <AccountProfile user={currentUser} />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;