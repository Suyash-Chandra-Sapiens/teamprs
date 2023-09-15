import './App.css';
import GitHubPullRequests from './GitHubPullRequests';
import data from './data.json';

function App() {
  return (
    <div>
      <p>Supported repos: {data.repoNames.join(', ')}</p>
      <GitHubPullRequests repoNames={data.repoNames} organization={data.organization} selectedUsernames={data.selectedUsernames}/>
    </div>
  );
}

export default App;
