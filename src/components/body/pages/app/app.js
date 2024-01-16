import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [issues, setIssues] = useState([]);
  const [events, setEvents] = useState([]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleBaseUrlChange = (event) => {
    setBaseUrl(event.target.value);
  };

  const handleFetchData = () => {
    // Fetch issues data from the backend
    axios.get('/proxy/issues', {
      params: {
        username: username,
        password: password,
        base_url: baseUrl,
      },
    })
    .then((response) => {
      // Add unique IDs based on row number
      const issuesWithIds = response.data.map((issue, index) => ({
        ...issue,
        id: index + 1,
      }));
      setIssues(issuesWithIds);
    })
    .catch((error) => {
      console.error('Error fetching issues:', error);
    });

    // Fetch events data from the backend
    axios.get('/proxy/events', {
      params: {
        username: username,
        password: password,
        base_url: baseUrl,
      },
    })
    .then((response) => {
      // Add unique IDs based on row number
      const eventsWithIds = response.data.map((event, index) => ({
        ...event,
        id: index + 1,
      }));
      setEvents(eventsWithIds);
    })
    .catch((error) => {
      console.error('Error fetching events:', error);
    });
  };

  // Define columns for the DataGrid
  const issueColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'issueId', headerName: 'Issue ID', width: 150 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'deviceId', headerName: 'Device ID', width: 150 },
    { field: 'lastOccurrenceTime', headerName: 'Last Occurrence Time', width: 200 },
    { field: 'status', headerName: 'Status', width: 120 },
  ];

  const eventColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'eventName', headerName: 'Event Name', width: 200 },
    { field: 'eventType', headerName: 'Event Type', width: 150 },
    { field: 'eventDescription', headerName: 'Event Description', width: 300 },
    { field: 'eventTime', headerName: 'Event Time', width: 200 },
  ];

  return (
    <div>
      <h2>Data Fetcher</h2>
      <TextField
        label="Username"
        variant="outlined"
        value={username}
        onChange={handleUsernameChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        variant="outlined"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Base URL"
        variant="outlined"
        value={baseUrl}
        onChange={handleBaseUrlChange}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={handleFetchData} color="primary">
        Fetch Data
      </Button>

      <h2>Issues</h2>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={issues}
          columns={issueColumns}
          pageSize={10}
          checkboxSelection
        />
      </div>

      <h2>Events</h2>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={events}
          columns={eventColumns}
          pageSize={10}
          checkboxSelection
        />
      </div>
    </div>
  );
}

export default App;
