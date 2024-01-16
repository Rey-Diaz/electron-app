import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const AppPage = () => {
    const [apiCredentials, setApiCredentials] = useState({
        username: '',
        password: '',
        apiUrl: '',
    });
    const [selectedDataset, setSelectedDataset] = useState('events');
    const [filteredData, setFilteredData] = useState([]);

    const columnsEvents = [
        // Define columns for events, example:
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'eventName', headerName: 'Event Name', width: 150 },
        { field: 'eventType', headerName: 'Event Type', width: 150 },
        { field: 'eventDescription', headerName: 'Description', width: 200 },
        { field: 'eventTime', headerName: 'Event Time', width: 200 },
        // Add more columns as per your data structure
    ];

    const columnsIssues = [
        // Define columns for issues, example:
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'issueId', headerName: 'Issue ID', width: 200 },
        { field: 'name', headerName: 'Name', width: 300 },
        { field: 'deviceId', headerName: 'Device ID', width: 200 },
        { field: 'lastOccurenceTime', headerName: 'Last Occurrence Time', width: 220 },
        { field: 'status', headerName: 'Status', width: 120 },
        // Add more columns as per your data structure
    ];

    const handleFetchData = async () => {
        try {
            // Constructing the API call URL
            const url = `${apiCredentials.apiUrl}/${selectedDataset}`;
            
            // Preparing the Authorization header
            const authHeader = `Basic ${btoa(`${apiCredentials.username}:${apiCredentials.password}`)}`;
    
            // Fetch request to the backend
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': authHeader,
                },
            });
    
            // Check if the response is successful
            if (response.ok) {
                // Parsing the JSON response
                const data = await response.json();
    
                // Updating the state with the fetched data
                setFilteredData(data);
            } else {
                // Handle non-successful responses
                console.error('Failed to fetch data');
            }
        } catch (error) {
            // Catching and logging any errors that occur during the fetch
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
                        variant={selectedDataset === 'events' ? 'contained' : 'outlined'}
                        color="primary"
                        onClick={() => setSelectedDataset('events')}
                        style={{ marginRight: '10px' }}
                    >
                        Events
                    </Button>
                    <Button
                        variant={selectedDataset === 'issues' ? 'contained' : 'outlined'}
                        color="primary"
                        onClick={() => setSelectedDataset('issues')}
                    >
                        Issues
                    </Button>
                </div>
        
                {/* DataGrid to display data */}
                <div style={{ height: '400px', width: '100%' }}>
                    <DataGrid
                        rows={filteredData}
                        columns={selectedDataset === 'events' ? columnsEvents : columnsIssues}
                        pageSize={5}
                        autoHeight
                    />
                </div>
            </div>
        );
    };

    export default AppPage;