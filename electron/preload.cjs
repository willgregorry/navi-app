const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('naviElectron', {
  setKiosk: (enable) => ipcRenderer.invoke('app:set-kiosk', enable),
  refocus: () => ipcRenderer.invoke('app:refocus'),
  onBlur: (callback) => {
    const subscription = () => callback();
    ipcRenderer.on('app:blur', subscription);
    return () => ipcRenderer.removeListener('app:blur', subscription);
  },
  onFocus: (callback) => {
    const subscription = () => callback();
    ipcRenderer.on('app:focus', subscription);
    return () => ipcRenderer.removeListener('app:focus', subscription);
  },
});
