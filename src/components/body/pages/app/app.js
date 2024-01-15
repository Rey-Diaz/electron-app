import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import Badge from '@mui/material/Badge';
import Select from '@mui/material/Select'; // Import Select component
import MenuItem from '@mui/material/MenuItem'; // Import MenuItem component
import TextField from '@mui/material/TextField'; // Import TextField component
import Button from '@mui/material/Button'; // Import Button component from Material-UI



// Sample event data
const eventData = [
    {
        id: 0,
        event_id: "event1",
        name: "Artifact 1",
        description: "This is the first artifact",
        type: "Type A",
        category: "Category X",
        tags: ["tag1", "tag2"],
        created_at: "2023-01-15T10:00:00Z"
    },
    {
        id: 1,
        event_id: "event2",
        name: "Artifact 2",
        description: "This is the second artifact",
        type: "Type B",
        category: "Category Y",
        tags: ["tag2", "tag3"],
        created_at: "2023-01-16T11:30:00Z"
    },
    {
        id: 2,
        event_id: "event3",
        name: "Artifact 3",
        description: "This is the third artifact",
        type: "Type A",
        category: "Category Z",
        tags: ["tag1", "tag3"],
        created_at: "2023-01-17T14:45:00Z"
    }
];

// Sample issue data
const issueData = [
    {
        id: 0,
        issueId: '8b4f75e8-86a1-483e-bd2f-9dca640da992',
        name: 'Excessive time lag between Cisco DNA Center and device "sw4"',
        deviceId: '826bc2f3-bf3f-465b-ad2e-e5701ff7a46c',
        lastOccurenceTime: '2024-01-14 12:41:50',
        status: 'active',
    },
    {
        id: 1,
        issueId: 'ea5ccc91-2cfc-4a6d-8d5e-4f4ffe142041',
        name: 'Excessive time lag between Cisco DNA Center and device "sw3"',
        deviceId: '5f03d9a9-33df-450e-b0c3-6bcb5f721688',
        lastOccurenceTime: '2024-01-14 12:41:51',
        status: 'active',
    },
    {
        id: 2,
        issueId: '54d2c5c4-5a12-4c43-ab92-5b8ee0087ca7',
        name: 'Excessive time lag between Cisco DNA Center and device "sw1"',
        deviceId: '32446e0a-032b-4724-93e9-acbbab47371b',
        lastOccurenceTime: '2024-01-14 12:41:50',
        status: 'active',
    },
    {
        id: 3,
        issueId: 'bbd6a972-36d9-4737-a855-b35e3b2361ce',
        name: 'Excessive time lag between Cisco DNA Center and device "sw2"',
        deviceId: 'c069bc2c-bfa3-47ef-a37e-35e2f8ed3f01',
        lastOccurenceTime: '2024-01-14 12:41:50',
        status: 'active',
    },
];

const AppPage = () => {
    const [selectedDataset, setSelectedDataset] = useState('events');
    const [selectedColumn, setSelectedColumn] = useState('name');
    const [excludeText, setExcludeText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
   

    const columnsEvents = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 300 },
        { field: 'description', headerName: 'Description', width: 300 },
        { field: 'type', headerName: 'Type', width: 150 },
        { field: 'category', headerName: 'Category', width: 150 },
        { field: 'tags', headerName: 'Tags', width: 200 },
        { field: 'created_at', headerName: 'Created At', width: 220 },
    ];

    const columnsIssues = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'issueId', headerName: 'Issue ID', width: 200 },
        { field: 'name', headerName: 'Name', width: 300 },
        { field: 'deviceId', headerName: 'Device ID', width: 200 },
        { field: 'lastOccurenceTime', headerName: 'Last Occurrence Time', width: 220 },
        { field: 'status', headerName: 'Status', width: 120 },
    ];

    const handleSelectDataset = (dataset) => {
        setSelectedDataset(dataset);
    };

    const isEventsSelected = selectedDataset === 'events';
    const selectedData = isEventsSelected ? eventData : issueData;
    const newEntriesCount = 5; // Moved this outside of the condition

    const columnsToDisplay = isEventsSelected ? columnsEvents : columnsIssues;

    const tableHeight = '400px';

    const handleExcludeItem = () => {
        const textToExclude = excludeText.trim();

        if (textToExclude) {
            // Filter the selected data based on the selected column and excluded text
            const filteredResult = selectedData.filter((item) => {
                const columnValue = item[selectedColumn].toString().toLowerCase();
                return !columnValue.includes(textToExclude.toLowerCase());
            });
            setFilteredData(filteredResult);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
            {/* Badges always show */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <Badge badgeContent={newEntriesCount} color="secondary">
                    <Chip
                        label="Events"
                        variant={isEventsSelected ? 'filled' : 'outlined'}
                        color="primary"
                        onClick={() => handleSelectDataset('events')}
                        style={{ marginRight: '10px' }}
                    />
                </Badge>
                <Badge badgeContent={newEntriesCount} color="secondary">
                    <Chip
                        label="Issues"
                        variant={!isEventsSelected ? 'filled' : 'outlined'}
                        color="primary"
                        onClick={() => handleSelectDataset('issues')}
                    />
                </Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                {/* Dropdown to select column */}
                <Select
                    value={selectedColumn}
                    onChange={(e) => setSelectedColumn(e.target.value)}
                    style={{ marginRight: '10px' }}
                >
                    {columnsToDisplay.map((column) => (
                        <MenuItem key={column.field} value={column.field}>
                            {column.headerName}
                        </MenuItem>
                    ))}
                </Select>
                {/* Textbox to enter text to exclude */}
                <TextField
                    label="Exclude Text"
                    variant="outlined"
                    value={excludeText}
                    onChange={(e) => setExcludeText(e.target.value)}
                    style={{ marginRight: '10px' }}
                />
                {/* Button to trigger exclusion */}
                <Button variant="contained" color="primary" onClick={handleExcludeItem}>Exclude</Button>
            </div>
            <div style={{ marginLeft: '10px', height: tableHeight, width: '100%' }}>
                <DataGrid rows={filteredData.length > 0 ? filteredData : selectedData} columns={columnsToDisplay} pageSize={5} autoHeight />
            </div>
        </div>
    );
};

export default AppPage;