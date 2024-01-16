import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

function AppPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [issues, setIssues] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentTable, setCurrentTable] = useState('issues'); // Default to 'issues'
  const [tableHeight, setTableHeight] = useState('400px'); // Default height

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
    // Fetch issues data from the backend if currentTable is 'issues'
    if (currentTable === 'issues') {
      axios
        .get('http://localhost:8000/issues', {
          params: {
            username: username,
            password: password,
            base_url: baseUrl,
          },
        })
        .then((response) => {
          setIssues(response.data);
          // Calculate the height based on the number of rows (adjust the multiplier as needed)
          const newHeight = `${response.data.length * 25}px`;
          setTableHeight(newHeight);
        })
        .catch((error) => {
          console.error('Error fetching issues:', error);
        });
    } else {
      // Fetch events data from the backend if currentTable is 'events'
      axios
        .get('http://localhost:8000/events', {
          params: {
            username: username,
            password: password,
            base_url: baseUrl,
          },
        })
        .then((response) => {
          setEvents(response.data);
          // Calculate the height based on the number of rows (adjust the multiplier as needed)
          const newHeight = `${response.data.length * 25}px`;
          setTableHeight(newHeight);
        })
        .catch((error) => {
          console.error('Error fetching events:', error);
        });
    }
  };

  const handleToggleTable = (table) => {
    setCurrentTable(table);
  };

  // Define columns for ag-Grid
  const issueColumns = [
    { headerName: 'ID', field: 'id', width: 70, filter: 'agNumberColumnFilter', enableCellTextSelection: true },
    { headerName: 'Issue ID', field: 'issueId', width: 150, filter: 'agTextColumnFilter', enableCellTextSelection: true },
    { headerName: 'Name', field: 'name', width: 200, filter: 'agTextColumnFilter', enableCellTextSelection: true },
    { headerName: 'Device ID', field: 'deviceId', width: 150, filter: 'agNumberColumnFilter', enableCellTextSelection: true },
    { headerName: 'Last Occurrence Time', field: 'lastOccurrenceTime', width: 200, filter: 'agDateColumnFilter', enableCellTextSelection: true },
    { headerName: 'Status', field: 'status', width: 120, filter: 'agTextColumnFilter', enableCellTextSelection: true },
  ];
  
  const eventColumns = [
    { headerName: 'ID', field: 'id', width: 70, filter: 'agNumberColumnFilter', enableCellTextSelection: true },
    { headerName: 'Event Name', field: 'eventName', width: 200, filter: 'agTextColumnFilter', enableCellTextSelection: true },
    { headerName: 'Event Type', field: 'eventType', width: 150, filter: 'agTextColumnFilter', enableCellTextSelection: true },
    { headerName: 'Event Description', field: 'eventDescription', width: 300, filter: 'agTextColumnFilter', enableCellTextSelection: true },
    { headerName: 'Event Time', field: 'eventTime', width: 200, filter: 'agDateColumnFilter', enableCellTextSelection: true },
  ];

  // Add the following style tag
  const gridStyles = `
    .ag-cell {
        user-select: text !important;
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
    }
  `;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      {/* Add style tag here */}
      <style>{gridStyles}</style>

      <Paper elevation={3} style={{ width: '80%' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Data Fetcher
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Username"
              variant="outlined"
              value={username}
              onChange={handleUsernameChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Base URL"
              variant="outlined"
              value={baseUrl}
              onChange={handleBaseUrlChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" onClick={handleFetchData} color="primary" style={{ marginBottom: '20px' }}>
              Fetch Data
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} style={{ width: '80%', padding: '20px', marginTop: '20px', height: '100%' }}>
        <Typography variant="h6" align="center" gutterBottom>
          {currentTable === 'issues' ? 'Issues' : 'Events'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" onClick={() => handleToggleTable('issues')} color="primary" fullWidth>
              Show Issues
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="contained" onClick={() => handleToggleTable('events')} color="primary" fullWidth>
              Show Events
            </Button>
          </Grid>
        </Grid>
        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%', marginTop: '20px' }}>
          <AgGridReact
            rowData={currentTable === 'issues' ? issues : events}
            columnDefs={currentTable === 'issues' ? issueColumns : eventColumns}
            domLayout='autoHeight'
            resizable={true}
            suppressMenu={false} // Hide filter menu
          />
        </div>
      </Paper>
    </div>
  );
}

export default AppPage;
