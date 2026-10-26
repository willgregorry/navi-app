const { app, BrowserWindow } = require('electron');
const { createMainWindow } = require('./window.cjs');
const { registerIpcHandlers } = require('./ipc.cjs');

app.whenReady().then(() => {
  registerIpcHandlers();
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
