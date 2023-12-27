import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
const GitHubPullRequestsMergedToday = (props) => {
  const [pullRequests, setPullRequests] = useState({});
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('githubAccessToken') || '');
  const [inputToken, setInputToken] = useState(accessToken || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // New state for selected date
  const [allRequestsComplete, setAllRequestsComplete] = useState(false);
  const [error, setError] = useState(null);
  const [inputDisplayToken, setInputDisplayToken] = useState(accessToken.replace(/./g, '*')); // New state for display token

  const organization = props.organization;
  const repoNames = props.repoNames;
  const selectedUsernames = props.selectedUsernames;

  const fetchData = async () => {
    try {
      const prData = {};
      
      for (const repoName of repoNames) {
        const response = await axios.get(`https://api.github.com/repos/${organization}/${repoName}/pulls`, {
          headers: {
            Authorization: `token ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
          params: {
            state: 'closed',
            sort: 'updated',
            direction: 'desc',
            per_page: 100,
          },
        });

        const filteredPRs = response.data.filter((pr) => 
          selectedUsernames.includes(pr.user.login) &&
          pr.merged_at && pr.merged_at.split('T')[0] === selectedDate
        );
        prData[repoName] = filteredPRs;
      }
      setPullRequests(prData);
      setLoading(false);
      setAllRequestsComplete(true);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setPullRequests({});
      setLoading(true);
      setAllRequestsComplete(true);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [accessToken, selectedDate]); // Adding selectedDate as a dependency

  const handleInputChange = (e) => {
    setInputToken(e.target.value);
    setInputDisplayToken(e.target.value.replace(/./g, '*'));
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSubmit = () => {
    setAccessToken(inputToken);
    localStorage.setItem('githubAccessToken', inputToken);
    fetchData();
  };

  const handleRefresh = () => {
    fetchData();
  };

  return (
    <Container>
      <Title>Portal Team - P&C Github Open Pull Requests Merged On Selected Date</Title>
      <InputContainer>
        <InputLabel>Enter GitHub Access Token:</InputLabel>
        <Input type="text" value={inputDisplayToken} onChange={handleInputChange} />
        <InputLabel>Select Date:</InputLabel>
        <Input type="date" value={selectedDate} onChange={handleDateChange} />
      </InputContainer>
      <div><SubmitButton onClick={handleSubmit}>Load/Save Token</SubmitButton>
        <RefreshButton onClick={handleRefresh}>Refresh</RefreshButton></div>
      {error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : loading && !allRequestsComplete ? (
        <LoadingMessage>Loading...</LoadingMessage>
      ) : (
        <>
          {Object.keys(pullRequests).map((repoName) => (
            <RepoSection key={repoName}>
              <h2>{repoName}</h2>
              <PullRequestList>
                {pullRequests[repoName].map((pr) => (
                  <PullRequestItem key={pr.id}>
                    <PullRequestLink href={pr.html_url} target="_blank" rel="noopener noreferrer">
                      PR #{pr.number} by {pr.user.login}: {pr.title}
                    </PullRequestLink>
                  </PullRequestItem>
                ))}
              </PullRequestList>
            </RepoSection>
          ))}
        </>
      )}
    </Container>
  );
};

export default GitHubPullRequestsMergedToday;

const ErrorMessage = styled.p`
  font-size: 16px;
  color: red; // Customize the error message color
`;
const RepoSection = styled.div`
  margin-top: 20px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
`;

const Container = styled.div`
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const RefreshButton = styled.button`
  padding: 8px 16px;
  background-color: #28a745; /* Change the background color to your preference */
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px; /* Adjust margin as needed */
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  gap: 10px;
  margin-bottom: 20px;
`;

const InputLabel = styled.label`
  font-size: 16px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const LoadingMessage = styled.p`
  font-size: 16px;
  font-weight: bold;
`;

const PullRequestList = styled.ul`
  list-style: none;
  padding: 0;
`;

const PullRequestItem = styled.li`
  margin-bottom: 10px;
`;

const PullRequestLink = styled.a`
  text-decoration: none;
  color: #333;
  font-weight: bold;
`;