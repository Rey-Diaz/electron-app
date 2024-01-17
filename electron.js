const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // Replace with the path to your built frontend index.html
    mainWindow.loadFile(path.join(__dirname, 'public', 'index.html'));

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
}

function startFastAPIBackend() {
    // Replace with the correct path to your FastAPI main.py
    const backend = spawn('python', [path.join(__dirname, 'Backend', 'main.py')]);

    backend.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    backend.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    backend.on('close', (code) => {
        console.log(`FastAPI backend exited with code ${code}`);
    });
}

app.whenReady().then(() => {
    createWindow();
    startFastAPIBackend();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
