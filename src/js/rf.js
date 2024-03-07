// import rf_globals from './partials/_globals';
import rf_responsive_check from "./partials/_responsive";
import rf_gnav from "./partials/_gnav";
import rf_toggles from "./partials/_toggles";

// =======================================================
// Inits

// Viewport checker (SP or PC)
rf_responsive_check()

// Global Navigation
if (document.querySelector('[data-js-gnav]')) {
  rf_gnav()
}

// Toggles
if (document.querySelector('[data-js-toggle]')) {
  rf_toggles()
}
