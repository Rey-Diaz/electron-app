import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';

const AppPage = () => {
    const [apiCredentials, setApiCredentials] = useState({
        username: '',
        password: '',
        apiUrl: '',
    });
    const [selectedDataset, setSelectedDataset] = useState('issues');
    const [issues, setIssues] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Fetch data when the selected dataset or credentials change
        handleFetchData();
    }, [selectedDataset, apiCredentials]);

    const columnsIssues = [
        // Define columns for issues
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'issueId', headerName: 'Issue ID', width: 200 },
        { field: 'name', headerName: 'Name', width: 300 },
        { field: 'deviceId', headerName: 'Device ID', width: 200 },
        { field: 'lastOccurrenceTime', headerName: 'Last Occurrence Time', width: 220 },
        { field: 'status', headerName: 'Status', width: 120 },
    ];

    const columnsEvents = [
        // Define columns for events
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'eventName', headerName: 'Event Name', width: 150 },
        { field: 'eventType', headerName: 'Event Type', width: 150 },
        { field: 'eventDescription', headerName: 'Description', width: 200 },
        { field: 'eventTime', headerName: 'Event Time', width: 200 },
    ];

    const handleFetchData = async () => {
        try {
            const apiUrl = encodeURIComponent(apiCredentials.apiUrl);
            const username = encodeURIComponent(apiCredentials.username);
            const password = encodeURIComponent(apiCredentials.password);

            // Constructing the API call URL for the proxy
            const url = `${process.env.REACT_APP_PROXY_URL}/${selectedDataset}?username=${username}&password=${password}&apiUrl=${apiUrl}`;

            // Preparing the Authorization header
            const authHeader = `Basic ${btoa(`${apiCredentials.username}:${apiCredentials.password}`)}`;

            // Using Axios to make the GET request
            const response = await axios.get(url, {
                headers: {
                    'Authorization': authHeader,
                },
            });

            // Check if the response is successful
            if (response.status === 200) {
                if (selectedDataset === 'issues') {
                    setIssues(response.data);
                } else if (selectedDataset === 'events') {
                    setEvents(response.data);
                }
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
            {/* Input fields for API credentials */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <TextField
                    label="Username"
                    variant="outlined"
                    value={apiCredentials.username}
                    onChange={(e) => setApiCredentials({ ...apiCredentials, username: e.target.value })}
                    style={{ marginRight: '10px' }}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={apiCredentials.password}
                    onChange={(e) => setApiCredentials({ ...apiCredentials, password: e.target.value })}
                    style={{ marginRight: '10px' }}
                />
                <TextField
                    label="API URL"
                    variant="outlined"
                    value={apiCredentials.apiUrl}
                    onChange={(e) => setApiCredentials({ ...apiCredentials, apiUrl: e.target.value })}
                    style={{ marginRight: '10px' }}
                />
                <Button variant="contained" color="primary" onClick={handleFetchData}>
                    Fetch Data
                </Button>
            </div>

            {/* Buttons to select dataset */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <Button
                    variant={selectedDataset === 'issues' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => setSelectedDataset('issues')}
                    style={{ marginRight: '10px' }}
                >
                    Issues
                </Button>
                <Button
                    variant={selectedDataset === 'events' ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => setSelectedDataset('events')}
                >
                    Events
                </Button>
            </div>

            {/* DataGrid to display data */}
            <div style={{ height: '400px', width: '100%' }}>
                <DataGrid
                    rows={selectedDataset === 'issues' && Array.isArray(issues) ? issues.map((issue, index) => ({ ...issue, id: `issue-${index}` })) : []}
                    columns={selectedDataset === 'issues' ? columnsIssues : columnsEvents}
                    pageSize={5}
                    autoHeight
                    getRowId={(row) => row.id} // Specify the custom id field
                />
            </div>
        </div>
    );
};

export default AppPage;
