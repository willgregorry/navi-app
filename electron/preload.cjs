const { contextBridge, ipcRenderer } = require('electron');
const { IPC_CHANNELS } = require('./constants.cjs');

contextBridge.exposeInMainWorld('naviElectron', {
  setKiosk: (enable) => ipcRenderer.invoke(IPC_CHANNELS.SET_KIOSK, enable),
  refocus: () => ipcRenderer.invoke(IPC_CHANNELS.REFOCUS),
  onBlur: (callback) => {
    const handler = () => callback();
    ipcRenderer.on(IPC_CHANNELS.ON_BLUR, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.ON_BLUR, handler);
  },
  onFocus: (callback) => {
    const handler = () => callback();
    ipcRenderer.on(IPC_CHANNELS.ON_FOCUS, handler);
    return () => ipcRenderer.removeListener(IPC_CHANNELS.ON_FOCUS, handler);
  },
  runPython: (payload) => ipcRenderer.invoke(IPC_CHANNELS.RUN_PYTHON, payload),
});
