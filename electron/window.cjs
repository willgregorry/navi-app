const { BrowserWindow, Menu, app } = require('electron');
const path = require('path');
const { IPC_CHANNELS, WINDOW_DEFAULTS } = require('./constants.cjs');
const { setupKeyboardSecurity } = require('./shortcuts.cjs');

let mainWindow = null;

function createMainWindow() {
  Menu.setApplicationMenu(null);

  mainWindow = new BrowserWindow({
    width: WINDOW_DEFAULTS.WIDTH,
    height: WINDOW_DEFAULTS.HEIGHT,
    minWidth: WINDOW_DEFAULTS.MIN_WIDTH,
    minHeight: WINDOW_DEFAULTS.MIN_HEIGHT,
    backgroundColor: WINDOW_DEFAULTS.BG_COLOR,
    frame: true,
    show: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, '../public/navi-favicon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      devTools: false,
    },
  });

  mainWindow.removeMenu();
  mainWindow.setMenuBarVisibility(false);

  // Prevent right-click context menu (Inspect Element)
  mainWindow.webContents.on('context-menu', (e) => {
    e.preventDefault();
  });

  // Automatically close DevTools if triggered by any mechanism
  mainWindow.webContents.on('devtools-opened', () => {
    mainWindow.webContents.closeDevTools();
  });

  setupKeyboardSecurity(mainWindow);
  bindWindowEvents(mainWindow);
  loadWindowContent(mainWindow);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  return mainWindow;
}

function bindWindowEvents(win) {
  win.on('blur', () => {
    if (!win.isDestroyed()) {
      win.webContents.send(IPC_CHANNELS.ON_BLUR);
    }
  });

  win.on('focus', () => {
    if (!win.isDestroyed()) {
      win.webContents.send(IPC_CHANNELS.ON_FOCUS);
    }
  });
}

function loadWindowContent(win) {
  const isDev = !app.isPackaged && (process.env.NODE_ENV === 'development' || !process.env.APP_IS_PACKAGED);

  if (isDev) {
    const devUrl = process.env.ELECTRON_DEV_URL || 'http://localhost:5173';
    win.loadURL(devUrl);
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

function getMainWindow() {
  return mainWindow;
}

module.exports = {
  createMainWindow,
  getMainWindow,
};
