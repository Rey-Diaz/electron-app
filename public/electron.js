const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let fastapiProcess; // Variable to hold the FastAPI backend process

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    import('electron-is-dev')
        .then((isDev) => {
            mainWindow.loadURL(
                isDev.default
                    ? 'http://localhost:3000/' // Load from React dev server
                    : `file://${path.join(__dirname, '../build/index.html')}` // Load built React app
            );
        })
        .catch((error) => {
            console.error('Error loading electron-is-dev:', error);
        });

    // Determine the path to main.py dynamically
    const backendPath = path.join(__dirname, '../Backend/main.py');

    // Start the FastAPI backend as a child process
    fastapiProcess = spawn('python', [backendPath]);

    fastapiProcess.stdout.on('data', (data) => {
        console.log(`FastAPI stdout: ${data}`);
    });

    fastapiProcess.stderr.on('data', (data) => {
        console.error(`FastAPI stderr: ${data}`);
    });

    fastapiProcess.on('close', (code) => {
        console.log(`FastAPI process exited with code ${code}`);
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // Stop the FastAPI backend process when all windows are closed
        if (fastapiProcess) {
            fastapiProcess.kill();
        }
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
