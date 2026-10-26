const { ipcMain } = require('electron');
const { IPC_CHANNELS } = require('./constants.cjs');
const { getMainWindow } = require('./window.cjs');

function registerIpcHandlers() {
  ipcMain.handle(IPC_CHANNELS.SET_KIOSK, (event, enable) => {
    const win = getMainWindow();
    if (!win) return { success: false };

    win.setKiosk(enable);
    win.setAlwaysOnTop(enable, 'screen-saver');

    return {
      success: true,
      isKiosk: win.isKiosk(),
    };
  });

  ipcMain.handle(IPC_CHANNELS.REFOCUS, () => {
    const win = getMainWindow();
    if (win && !win.isDestroyed()) {
      win.focus();
      return true;
    }
    return false;
  });

  ipcMain.handle(IPC_CHANNELS.RUN_PYTHON, async (event, { code, problemId }) => {
    const { runPythonCode } = require('./pythonRunner.cjs');
    return await runPythonCode(code, problemId);
  });
}

module.exports = {
  registerIpcHandlers,
};
