const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Correct this path if necessary
      nodeIntegration: true,
      contextIsolation: false // Remember to check security settings
    }
  });

  // Point to the correct path of the index.html in the build directory
  mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
}

function startBackend() {
  // The path should be relative to the electron.js file which is located in build directory
  const pathToBackend = path.join(__dirname, '../Backend/dist/main.exe');

  console.log('Attempting to start backend from:', pathToBackend);

  if (fs.existsSync(pathToBackend)) {
    backendProcess = spawn(pathToBackend, {
      stdio: 'inherit'
    });

    backendProcess.on('error', (err) => {
      console.error('Failed to start backend process:', err);
    });

    backendProcess.on('close', (code, signal) => {
      console.log(`Backend process exited with code ${code} and signal ${signal}`);
    });
  } else {
    console.error('Backend executable not found at:', pathToBackend);
  }
}

app.whenReady().then(() => {
  createWindow();
  startBackend();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  // Kill the backend process when the app is about to close
  if (backendProcess) {
    backendProcess.kill();
  }
});
