import React, { useState, useEffect } from 'react';

const FeedbackItem = ({ feedback, onApplySuggestion }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    // Auto-expand error items
    if (feedback.type === 'error') {
      setIsExpanded(true);
    }
  }, [feedback.type]);
  
  const typeIcon = {
    error: '❌',
    warning: '⚠️',
    suggestion: '💡',
    info: 'ℹ️'
  };
  
  // Check if this feedback item has an applicable code suggestion
  const hasApplicableSuggestion = 
    feedback.suggestion && 
    feedback.code && 
    feedback.suggestion !== feedback.code &&
    !feedback.suggestion.startsWith('//');

  return (
    <div className={`feedback-item ${feedback.type}`}>
      <div 
        className="feedback-item-header" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="feedback-type-icon">{typeIcon[feedback.type] || 'ℹ️'}</span>
        <div className="feedback-info">
          <div className="feedback-message">{feedback.message}</div>
          {feedback.line > 0 && (
            <div className="feedback-location">Line {feedback.line}</div>
          )}
        </div>
        <div className="feedback-expand-icon">
          {isExpanded ? '▼' : '▶'}
        </div>
      </div>
      
      {isExpanded && (
        <div className="feedback-details">
          {feedback.code && (
            <div className="feedback-code">
              <div className="code-header">Original Code:</div>
              <pre><code>{feedback.code}</code></pre>
            </div>
          )}
          
          {feedback.suggestion && !feedback.suggestion.startsWith('//') && (
            <div className="feedback-suggestion">
              <div className="suggestion-header">Suggested Fix:</div>
              <pre><code>{feedback.suggestion}</code></pre>
            </div>
          )}
          
          {hasApplicableSuggestion && (
            <button 
              className={`apply-suggestion-button ${feedback.type === 'error' ? 'error-fix' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onApplySuggestion();
              }}
            >
              {feedback.type === 'error' ? 'Fix Error' : 'Apply Fix'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackItem;