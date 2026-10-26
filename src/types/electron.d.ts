export interface NaviElectronAPI {
  setKiosk: (enable: boolean) => Promise<{ success: boolean; isKiosk?: boolean }>;
  refocus: () => Promise<boolean>;
  onBlur: (callback: () => void) => () => void;
  onFocus: (callback: () => void) => () => void;
}

declare global {
  interface Window {
    naviElectron?: NaviElectronAPI;
  }
}
