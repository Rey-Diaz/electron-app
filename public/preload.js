// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose certain Electron APIs to the renderer process
contextBridge.exposeInMainWorld('electron', {
    makeHttpRequest: async (url, method, data) => {
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            return response.json();
        } catch (error) {
            throw error;
        }
    },
    fetchIssues: async (requestData) => {
        try {
            // Send a request to the main process to fetch issues
            const response = await ipcRenderer.invoke('fetch-issues', requestData);
            return response;
        } catch (error) {
            throw error;
        }
    },
    fetchEvents: async (requestData) => {
        try {
            // Send a request to the main process to fetch events
            const response = await ipcRenderer.invoke('fetch-events', requestData);
            return response;
        } catch (error) {
            throw error;
        }
    },
});