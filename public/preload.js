const { contextBridge } = require('electron');
const path = require('path');

contextBridge.exposeInMainWorld('electronAPI', {
    getPath: (relativePath) => path.join(__dirname, relativePath)
});
