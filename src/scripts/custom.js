window.slate = window.slate || {};
window.theme = window.theme || {};

/*================ Slate ================*/
// =require slate/a11y.js
// =require slate/cart.js
// =require slate/utils.js
// =require slate/rte.js
// =require slate/sections.js
// =require slate/currency.js
// =require slate/images.js
// =require slate/variants.js

/*================ Utilities ================*/
// =require utils/responsive.js
// =require utils/carousels.js
// =require utils/modals.js

/*================ Sections ================*/
// =require sections/module-shop-switch.js

/*================ Templates ================*/
// =require templates/cart.js

$(document).ready(function() {

  // General scripts
    var sections = new slate.Sections();
    sections.register('shop-switch', theme.ShopSwitch);

});
