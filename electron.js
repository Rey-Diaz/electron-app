const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs-extra'); // Import the fs-extra module

let fastAPIProcess; // Store a reference to the FastAPI child process.

function startFastAPIBackend() {
    console.log("Starting FastAPI backend...");

    // Specify the source and destination paths for the backend directory
    const sourceBackendDir = path.join(__dirname, 'Backend'); // Replace with your actual path
    const destinationBackendDir = path.join(__dirname, 'dist', 'Backend');

    // Copy the backend directory to the distribution directory
    fs.copySync(sourceBackendDir, destinationBackendDir);

    fastAPIProcess = spawn('python', [path.join(destinationBackendDir, 'main.py')]); // Updated path

    // Optionally, you can handle FastAPI process events and errors.
    fastAPIProcess.stdout.on('data', (data) => {
        console.log(`FastAPI stdout: ${data}`);
    });

    fastAPIProcess.stderr.on('data', (data) => {
        console.error(`FastAPI stderr: ${data}`);
    });

    fastAPIProcess.on('close', (code) => {
        console.log(`FastAPI process exited with code ${code}`);
    });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false, // Disable nodeIntegration for security
            contextIsolation: true, // Enable contextIsolation for security
        },
    });

    console.log("Creating Electron window...");

    import('electron-is-dev')
        .then((isDev) => {
            win.loadURL(
                isDev.default
                    ? 'http://localhost:3000/' // Load from React dev server
                    : `file://${path.join(__dirname, '../build/index.html')}` // Load built React app
            );

            console.log("Electron window loaded.");
        })
        .catch((error) => {
            console.error('Error loading electron-is-dev:', error);
        });
}

app.whenReady().then(() => {
    console.log("Electron app is ready.");
    startFastAPIBackend(); // Start the FastAPI backend when Electron app is ready
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        console.log("All windows are closed. Quitting Electron app.");
        // Kill the FastAPI process when all windows are closed.
        if (fastAPIProcess) {
            console.log("Killing FastAPI process.");
            fastAPIProcess.kill();
        }
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        console.log("Activating a new window.");
        createWindow();
    }
});
