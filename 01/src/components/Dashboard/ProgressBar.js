import React from 'react';

const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-container">
      <div className="progress-info">
        <span className="progress-text">Progress: {progress.current}/{progress.total} completed</span>
        <span className="progress-percentage">{progress.percentage}%</span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progress.percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;