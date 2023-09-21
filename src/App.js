import './App.css';
import React, { useState } from 'react';
import GitHubPullRequests from './GitHubPullRequests';
import data from './data.json';
import GitHubPullRequestsMergedToday from './GitHubPullRequestsMergedToday';

function App() {
  const [activeTab, setActiveTab] = useState('all'); // Default active tab

  const handleTabChange = (event) => {
    setActiveTab(event.target.value);
  };

  return (
    <div>
      <p>Supported repos: {data.repoNames.join(', ')}</p>
      <div className="tab-switcher">
        <select value={activeTab} onChange={handleTabChange}>
          <option value="all">All Open PRs</option>
          <option value="today">All Merged Pr's Today</option>
        </select>
      </div>
      {activeTab === 'all' ? (
        <GitHubPullRequests
          repoNames={data.repoNames}
          organization={data.organization}
          selectedUsernames={data.selectedUsernames}
        />
      ) : (
        <GitHubPullRequestsMergedToday
          repoNames={data.repoNames}
          organization={data.organization}
          selectedUsernames={data.selectedUsernames}
        />
      )}
    </div>
  );
}

export default App;
