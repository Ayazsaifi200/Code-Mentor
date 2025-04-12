import React from 'react';
import '../../styles/feedback.css';

const FeedbackPanel = ({ feedback, onApplySuggestion, onApplyAllFixes }) => {
  // Convert single error object to array if needed
  const feedbackItems = Array.isArray(feedback) ? feedback : feedback ? [feedback] : [];
  
  // Group errors by type for summary counts
  const errorCount = feedbackItems.filter(item => item.type === 'error').length;
  const warningCount = feedbackItems.filter(item => item.type === 'warning').length;
  const suggestionCount = feedbackItems.filter(item => item.type === 'suggestion').length;
  const infoCount = feedbackItems.filter(item => item.type === 'info').length;

  return (
    <div className="feedback-panel">
      <div className="feedback-header">
        <h3>Analysis Results</h3>
        <div className="feedback-counts">
          <span className="error-count">{errorCount} Errors</span>
          <span className="warning-count">{warningCount} Warnings</span>
          <span className="suggestion-count">{suggestionCount} Suggestions</span>
          <span className="info-count">{infoCount} Info</span>
        </div>
      </div>
      
      {feedbackItems.length === 0 ? (
        <div className="feedback-empty">
          <p>No issues detected in your code.</p>
        </div>
      ) : (
        <div className="feedback-items">
          {feedbackItems.map((item, index) => (
            <div 
              key={item.id || `feedback-${index}`} 
              className={`feedback-item feedback-${item.type}`}
            >
              <div className="feedback-item-header">
                <span className={`feedback-type ${item.type}`}>
                  {item.type.toUpperCase()}
                </span>
                <span className="feedback-line">
                  Line {item.line}
                </span>
              </div>
              
              <div className="feedback-message">{item.message}</div>
              
              {item.code && (
                <pre className="feedback-code">{item.code}</pre>
              )}
              
              {item.suggestion && onApplySuggestion && (
                <button 
                  className="apply-suggestion-btn"
                  onClick={() => onApplySuggestion(item)}
                >
                  Fix Error
                </button>
              )}
            </div>
          ))}
          
          {feedbackItems.length > 1 && onApplyAllFixes && (
            <button 
              className="apply-all-suggestions-btn"
              onClick={onApplyAllFixes}
            >
              Fix All
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackPanel;