import React from 'react';
import '../../styles/ErrorList.css';

const ErrorList = ({ errors, onFixError }) => {
  if (!errors || errors.length === 0) {
    return (
      <div className="no-errors">
        <p>No errors found in your code.</p>
      </div>
    );
  }

  // Group errors by type
  const errorsByType = {
    error: errors.filter(err => err.type === 'error'),
    warning: errors.filter(err => err.type === 'warning'),
    suggestion: errors.filter(err => err.type === 'suggestion'),
    info: errors.filter(err => err.type === 'info')
  };
  
  return (
    <div className="error-container">
      <div className="error-summary">
        <h3>Analysis Results</h3>
        <div className="error-counts">
          <span className="error-count">{errorsByType.error.length} Errors</span>
          <span className="warning-count">{errorsByType.warning.length} Warnings</span>
          <span className="suggestion-count">{errorsByType.suggestion.length} Suggestions</span>
          <span className="info-count">{errorsByType.info.length} Info</span>
        </div>
      </div>

      <div className="error-list">
        {errors.map((error, index) => (
          <div 
            key={error.id || `error-${index}`}
            className={`error-item error-type-${error.type}`}
          >
            <div className="error-header">
              <span className="error-badge">{error.type.toUpperCase()}</span>
              <span className="error-line">Line {error.line}</span>
            </div>
            
            <div className="error-message">{error.message}</div>
            
            <pre className="error-code">{error.code}</pre>
            
            {error.suggestion && (
              <button 
                className="fix-error-btn"
                onClick={() => onFixError(error)}
              >
                Fix Error
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ErrorList;