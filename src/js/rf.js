// import rf_globals from './partials/_globals';
import rf_responsive_check from "./partials/_responsive";
import rf_gnav from "./partials/_gnav";
import rf_toggles from "./partials/_toggles";
import { rf_room_list_link, rf_room_list_toggle } from "./partials/_room-list";
import { rf_buildroom_main_slide, rf_buildroom_related_slide } from "./partials/_buildroom";

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

// お部屋リストリンク
if (document.querySelector('[data-js-room-link]')) {
  rf_room_list_link()
  rf_room_list_toggle()
}

// 建物・部屋共通
if (document.querySelector('[data-js-buildroom-mv]')) {
  rf_buildroom_main_slide()
}
if (document.querySelector('[data-js-buildroom-mv-thumbs]')) {
  rf_buildroom_related_slide()
}