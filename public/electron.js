const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let mainWindow;
let logWindow; // Additional window for server logs
let fastapiProcess;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  // Load the main content of your app
  mainWindow.loadURL('http://localhost:3000/'); // Adjust as needed
}

function createLogWindow() {
  logWindow = new BrowserWindow({
    width: 600,
    height: 400,
    title: "Server Logs",
    webPreferences: {
      nodeIntegration: true
    }
  });
  // Load the HTML file for displaying logs
  logWindow.loadFile(path.join(__dirname, 'log.html')); // Ensure this file exists
}

function startFastAPIProcess() {
  const backendPath = path.join(__dirname, '../Backend/main.py');
  fastapiProcess = spawn('python', [backendPath]);

  fastapiProcess.stdout.on('data', (data) => {
    console.log(`FastAPI stdout: ${data}`);
    if (logWindow) {
      logWindow.webContents.send('log-message', data.toString());
    }
  });

  fastapiProcess.stderr.on('data', (data) => {
    console.error(`FastAPI stderr: ${data}`);
  });

  fastapiProcess.on('close', (code) => {
    console.log(`FastAPI process exited with code ${code}`);
  });
}

app.whenReady().then(() => {
  createMainWindow();
  createLogWindow();
  startFastAPIProcess();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (fastapiProcess) {
      fastapiProcess.kill();
    }
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
    createLogWindow();
  }
});
