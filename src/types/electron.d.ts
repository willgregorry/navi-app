export interface NaviElectronAPI {
  setKiosk: (enable: boolean) => Promise<{ success: boolean; isKiosk?: boolean }>;
  refocus: () => Promise<boolean>;
  onBlur: (callback: () => void) => () => void;
  onFocus: (callback: () => void) => () => void;
  runPython: (payload: { code: string; problemId?: string }) => Promise<{
    stdout: string;
    stderr: string;
    exitCode: number;
    isSuccess: boolean;
    hints: any[];
  }>;
}

declare global {
  interface Window {
    naviElectron?: NaviElectronAPI;
  }
}
