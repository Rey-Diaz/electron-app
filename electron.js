// electron.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'), // Load the preload script
        },
    });

    mainWindow.loadFile('public/index.html'); // Load your HTML file

    mainWindow.webContents.openDevTools(); // Open DevTools if needed

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// Example: Receive a request from the renderer process
ipcMain.on('fetch-issues', async (event, requestData) => {
    try {
        // Make a request to your FastAPI backend using the 'electron' object
        const response = await window.electron.makeHttpRequest(
            'http://localhost:8000/issues',
            'GET',
            requestData
        );
        event.reply('fetch-issues-response', response); // Send the response back to the renderer process
    } catch (error) {
        event.reply('fetch-issues-response', { error: error.message });
    }
});
