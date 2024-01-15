const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false, // Disable nodeIntegration for security
            contextIsolation: true, // Enable contextIsolation for security
            preload: path.join(__dirname, '../build/preload.js') // Path to your preload script
        },
    });

    import('electron-is-dev')
        .then((isDev) => {
            win.loadURL(
                isDev.default
                    ? 'http://localhost:3000/' // Load from React dev server
                    : `file://${path.join(__dirname, '../build/index.html')}` // Load built React app
            );
        })
        .catch((error) => {
            console.error('Error loading electron-is-dev:', error);
        });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
