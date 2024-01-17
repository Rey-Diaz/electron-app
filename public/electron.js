const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;

function createWindow() {
    console.log('__dirname:', __dirname);  // Logs the directory name to the console

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // Correct the path to point to the 'build' directory
    // Ensure that this path is correct according to your actual directory structure
    const indexPath = path.join(__dirname, 'index.html');
    console.log('Loading index.html from:', indexPath);  // Logs the path from which index.html will be loaded

    mainWindow.loadFile(indexPath)
        .then(() => {
            console.log('Index.html loaded successfully'); // Logs on successful loading
        })
        .catch(err => {
            console.error('Error loading index.html:', err); // Logs if there's an error
        });

    // Uncomment the following line if you need to open the Developer Tools:
    // mainWindow.webContents.openDevTools();
}


function startFastAPIBackend() {
    // Define the path to the Python executable
    let backendExecutablePath = path.join(__dirname, '..', 'dist', 'backend', 'main.exe');

    // If the app is packaged, the __dirname will be inside the 'app.asar' archive
    // Adjust the path to point to the executable outside the archive
    if (__dirname.includes('app.asar')) {
        backendExecutablePath = path.join(process.resourcesPath, 'dist', 'backend', 'main.exe');
    }

    // Spawn the backend process using the path to the executable
    const backend = spawn(backendExecutablePath, []);

    backend.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    backend.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    backend.on('close', (code) => {
        console.log(`FastAPI backend exited with code ${code}`);
    });

    // Handle errors when the backend process cannot be spawned
    backend.on('error', (err) => {
        console.error('Failed to start FastAPI backend:', err);
    });

    backend.on('error', (error) => {
        console.error('Failed to start FastAPI backend:', error);
        console.error(`Error spawning the backend at ${path.join(__dirname, 'backend', 'main.exe')}`);
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
