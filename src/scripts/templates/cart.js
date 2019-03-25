/**
 * CART
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart.
 *
 * @namespace cart
 */

theme.cart = function() {

  /*************** Variables ***************/

  var config = {
    'agreementCheckbox': '#cartAgreementCheckbox'
  };

  console.log(config.agreementCheckbox);

  // Check that the agreement checkbox is clicked
  $('body').on('click', '[name=checkout]', function(ev) {

    if ($(config.agreementCheckbox).is(':checked')) {
      $(this).submit();
    }
    else {
      alert(window.languages.cartAgreeAlert);
      return false;
    }
  });

};
