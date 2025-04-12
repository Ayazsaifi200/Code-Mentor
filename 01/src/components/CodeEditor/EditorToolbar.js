import React from 'react';
import { FaSun, FaMoon, FaPlay } from 'react-icons/fa';

const EditorToolbar = ({ 
  language, 
  onLanguageChange, 
  isAnalyzing,
  onFormatCode,
  onRunCode,
  onThemeToggle,
  isDarkTheme,
  onCodeClear
}) => {
  return (
    <div className="editor-toolbar">
      <div className="toolbar-left">
        <select 
          id="language-select"
          value={language} 
          onChange={(e) => onLanguageChange(e.target.value)}
          className="language-selector"
          title="Select language"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
        
        <button 
          className={`theme-toggle-btn ${isDarkTheme ? 'dark' : 'light'}`}
          onClick={onThemeToggle}
          title={isDarkTheme ? "Switch to light theme" : "Switch to dark theme"}
        >
          {isDarkTheme ? <FaSun size={16} /> : <FaMoon size={16} />}
        </button>
      </div>
      
      <div className="toolbar-right">
        <button 
          className="run-btn"
          onClick={onRunCode}
          title="Run code"
        >
          <FaPlay size={12} /> Run
        </button>
        <button
          className="toolbar-button clear-button"
          onClick={() => {
            // Set code to empty to completely clear the editor
            onCodeClear?.();
          }}
          title="Clear editor"
        >
          <i className="fas fa-trash"></i> Clear
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;