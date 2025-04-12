import React from 'react';
import RepoAnalysis from './RepoAnalysis';

const RepoList = () => {
  // Mock data - in a real app, this would come from the GitHub API
  const repositories = [
    { id: 1, name: 'my-project', language: 'JavaScript', stars: 5, issues: 2, analyzed: true },
    { id: 2, name: 'python-utils', language: 'Python', stars: 12, issues: 0, analyzed: false },
    { id: 3, name: 'java-algorithms', language: 'Java', stars: 8, issues: 3, analyzed: false }
  ];

  const [selectedRepo, setSelectedRepo] = React.useState(null);

  return (
    <div className="github-integration">
      <div className="repo-list-container">
        <div className="repo-list-header">
          <h2>Your Repositories</h2>
          <button className="github-button">Refresh</button>
        </div>
        
        <div className="repo-list">
          {repositories.map(repo => (
            <div 
              key={repo.id} 
              className={`repo-item ${selectedRepo === repo.id ? 'selected' : ''}`}
              onClick={() => setSelectedRepo(repo.id)}
            >
              <div className="repo-item-name">{repo.name}</div>
              <div className="repo-item-details">
                <span className="repo-language">{repo.language}</span>
                <span className="repo-stars">⭐ {repo.stars}</span>
                <span className="repo-issues">🔴 {repo.issues}</span>
              </div>
              <button className="analyze-button">
                {repo.analyzed ? 'View Analysis' : 'Analyze'}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {selectedRepo && <RepoAnalysis repoId={selectedRepo} />}
    </div>
  );
};

export default RepoList;