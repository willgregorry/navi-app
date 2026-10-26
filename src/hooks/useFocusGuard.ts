import { useEffect, useState, useCallback, useRef } from 'react';
import { sirenSynth } from '../services/audio/sirenSynth';

interface FocusGuardOptions {
  enabled: boolean;
  onViolation?: (count: number) => void;
}

export function useFocusGuard({ enabled, onViolation }: FocusGuardOptions) {
  const [violationCount, setViolationCount] = useState<number>(0);
  const [isDistracted, setIsDistracted] = useState<boolean>(false);
  const onViolationRef = useRef(onViolation);
  onViolationRef.current = onViolation;

  const handleBlur = useCallback(() => {
    if (!enabled) return;

    setIsDistracted(true);
    sirenSynth.start();

    setViolationCount((prev) => {
      const next = prev + 1;
      onViolationRef.current?.(next);
      return next;
    });

    // Request window refocus if Electron is available
    window.naviElectron?.refocus();
  }, [enabled]);

  const handleFocus = useCallback(() => {
    if (!enabled) return;

    setIsDistracted(false);
    sirenSynth.stop();
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      sirenSynth.stop();
      setIsDistracted(false);
      return;
    }

    // Try Electron IPC first, fallback to standard window blur/focus
    let unsubscribeBlur: (() => void) | undefined;
    let unsubscribeFocus: (() => void) | undefined;

    if (window.naviElectron) {
      unsubscribeBlur = window.naviElectron.onBlur(handleBlur);
      unsubscribeFocus = window.naviElectron.onFocus(handleFocus);
    } else {
      window.addEventListener('blur', handleBlur);
      window.addEventListener('focus', handleFocus);
    }

    return () => {
      sirenSynth.stop();
      if (unsubscribeBlur) unsubscribeBlur();
      if (unsubscribeFocus) unsubscribeFocus();
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [enabled, handleBlur, handleFocus]);

  return {
    violationCount,
    isDistracted,
    dismissWarning: handleFocus,
  };
}
