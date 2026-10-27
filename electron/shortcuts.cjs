/**
 * Configures keyboard security rules on the BrowserWindow to prevent
 * accidental exits, refresh, or developer inspection during exam mode.
 */
function setupKeyboardSecurity(win) {
  win.webContents.on('before-input-event', (event, input) => {
    const key = (input.key || '').toLowerCase();

    // 1. Always prevent DevTools & Inspect shortcuts anywhere in the application
    const isDevToolsShortcut =
      key === 'f12' ||
      (input.control && input.shift && (key === 'i' || key === 'j' || key === 'c')) ||
      (input.control && key === 'u'); // View Source block

    if (isDevToolsShortcut) {
      event.preventDefault();
      return;
    }

    // 2. Kiosk-specific restrictions (only when exam kiosk mode is active)
    if (win.isKiosk()) {
      const blockedCombos = [
        key === 'f11',
        key === 'f5',
        input.control && key === 'r',
        input.control && key === 'w',
        input.alt && key === 'f4',
      ];

      if (blockedCombos.some(Boolean)) {
        event.preventDefault();
      }
    }
  });
}

module.exports = {
  setupKeyboardSecurity,
};
