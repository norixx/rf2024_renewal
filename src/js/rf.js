import rf_globals from './partials/_globals';
import rf_responsive_check from "./partials/_responsive";
import rf_toggles from "./partials/_toggles";

// =======================================================
// Inits
rf_responsive_check()

if (document.querySelector('[data-toggle]')) {
  rf_toggles()
}
