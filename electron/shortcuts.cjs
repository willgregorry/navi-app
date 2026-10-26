/**
 * Configures keyboard security rules on the BrowserWindow to prevent
 * accidental exits, refresh, or developer inspection during exam mode.
 */
function setupKeyboardSecurity(win) {
  win.webContents.on('before-input-event', (event, input) => {
    // Only enforce restrictions when kiosk / exam mode is active
    if (!win.isKiosk()) return;

    const blockedCombos = [
      input.key === 'F11',
      input.key === 'F5',
      input.control && input.key.toLowerCase() === 'r',
      input.control && input.key.toLowerCase() === 'w',
      input.alt && input.key === 'F4',
      input.control && input.shift && input.key.toLowerCase() === 'i', // DevTools block
    ];

    if (blockedCombos.some(Boolean)) {
      event.preventDefault();
    }
  });
}

module.exports = {
  setupKeyboardSecurity,
};
