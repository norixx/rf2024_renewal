// import rf_globals from './partials/_globals';
import rf_responsive_check from "./partials/_responsive";
import rf_toggles from "./partials/_toggles";

// =======================================================
// Inits

// Viewport checker (SP or PC)
rf_responsive_check()

// Toggles
if (document.querySelector('[data-js-toggle]')) {
  rf_toggles()
}
