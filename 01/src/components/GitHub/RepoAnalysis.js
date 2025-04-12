import React from 'react';

const RepoAnalysis = ({ repoId }) => {
  // Mock analysis data - in a real app, this would come from your backend
  const analysisResults = {
    score: 82,
    issues: [
      { id: 1, type: 'security', severity: 'high', file: 'auth.js', message: 'Possible XSS vulnerability' },
      { id: 2, type: 'performance', severity: 'medium', file: 'app.js', message: 'Inefficient loop pattern' },
      { id: 3, type: 'code-quality', severity: 'low', file: 'utils.js', message: 'Unused variables' }
    ],
    recommendations: [
      'Sanitize user input before rendering',
      'Replace for loops with map/filter/reduce',
      'Use ESLint to identify unused variables'
    ]
  };

  return (
    <div className="repo-analysis">
      <div className="analysis-header">
        <h3>Repository Analysis</h3>
        <div className="analysis-score">
          <div className="score-circle" style={{ 
            background: `conic-gradient(#4CAF50 ${analysisResults.score}%, #f3f3f3 0)` 
          }}>
            <span className="score-text">{analysisResults.score}</span>
          </div>
        </div>
      </div>
      
      <div className="analysis-issues">
        <h4>Issues Found</h4>
        {analysisResults.issues.map(issue => (
          <div key={issue.id} className={`analysis-issue ${issue.severity}`}>
            <span className="issue-type">{issue.type}</span>
            <span className="issue-location">{issue.file}</span>
            <p className="issue-message">{issue.message}</p>
          </div>
        ))}
      </div>
      
      <div className="analysis-recommendations">
        <h4>Recommendations</h4>
        <ul className="recommendations-list">
          {analysisResults.recommendations.map((rec, index) => (
            <li key={index} className="recommendation-item">{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RepoAnalysis;