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
          <option value="openPr">All Open PRs</option>
          <option value="closedPr">All Merged Pr's</option>
        </select>
      </div>
      {activeTab === 'openPr' ? (
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
