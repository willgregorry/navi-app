// Channel constants for IPC communication between Main and Renderer
const IPC_CHANNELS = {
  SET_KIOSK: 'app:set-kiosk',
  REFOCUS: 'app:refocus',
  ON_BLUR: 'app:blur',
  ON_FOCUS: 'app:focus',
  TRIGGER_ALARM: 'app:trigger-alarm',
  RUN_PYTHON: 'app:run-python',
};

const WINDOW_DEFAULTS = {
  WIDTH: 1366,
  HEIGHT: 768,
  MIN_WIDTH: 1024,
  MIN_HEIGHT: 600,
  BG_COLOR: '#090d16',
};

module.exports = {
  IPC_CHANNELS,
  WINDOW_DEFAULTS,
};
