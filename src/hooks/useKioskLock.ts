import { useState, useCallback } from 'react';

export function useKioskLock() {
  const [isKioskActive, setIsKioskActive] = useState<boolean>(false);

  const setKioskState = useCallback(async (enable: boolean) => {
    if (window.naviElectron) {
      const res = await window.naviElectron.setKiosk(enable);
      setIsKioskActive(Boolean(res?.isKiosk));
      return Boolean(res?.isKiosk);
    }
    // Web simulation mode
    setIsKioskActive(enable);
    return enable;
  }, []);

  const toggleKiosk = useCallback(async () => {
    return setKioskState(!isKioskActive);
  }, [isKioskActive, setKioskState]);

  return {
    isKioskActive,
    enterKiosk: () => setKioskState(true),
    exitKiosk: () => setKioskState(false),
    toggleKiosk,
  };
}
