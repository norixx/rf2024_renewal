let rf_globals = {
  window_state: 'SP', // or PC
  breakpoint: 768,
}

const rf_set_globals = settings => {

  rf_globals = {
    ...rf_globals,
    ...settings,
  }
}

const rf_get_globals = key => {
  return rf_globals[key]
}

export { rf_set_globals, rf_get_globals }