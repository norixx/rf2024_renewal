/**
 * グローバル変数、グローバル設定
 */
window.RF_GLOBALS = {}
window.RF_GLOBALS.RF_CONFIG = {
  window_state: 'PC',
  breakpoint: 768,
}

const rf_set_globals = settings => {
  window.RF_GLOBALS.RF_CONFIG = {
    ...window.RF_GLOBALS.RF_CONFIG,
    ...settings,
  }
}

const rf_get_globals = key => {
  return RF_GLOBALS['RF_CONFIG'][key]
}

export { rf_set_globals, rf_get_globals, init_rf_globals }