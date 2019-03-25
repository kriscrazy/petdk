/**
 * Shop Switch Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Shop Switch module.
 *
   * @namespace product
 */

 theme.ShopSwitch = (function() {

   function ShopSwitch(container) {
     var $container = this.$container = $(container);
     var sectionId = $container.attr('data-section-id');
     this.cookieName = $container.data('cookie-name');

     if (!$container.length) {
       return;
     }

     this.data = {
       countries: JSON.parse($container.data('countries')),
       secondsBeforeShow: $container.data('delay-seconds'),
       daysBeforeReappear: $container.data('delay-days'),
       cookie: $.cookie(this.cookieName),
       testMode: $container.data('test-mode'),
       mode: $container.data('mode'),
       switcherEnable: $container.data('switcher-enable'),
       switcherTemplate: $container.data('switcher-template'),
       socialReferrer: (document.referrer.includes('facebook.com/') || document.referrer.includes('instagram.com/') || document.referrer.includes('snapppt.com/')),
       isBot: /bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i.test(navigator.userAgent),
       apiUrl: "https://api.ipstack.com/check?access_key=0dec671d7bad90a5eba9fd097e199d13"
     };

     this.data.currentCountry = _.find(this.data.countries, function(o) { return o.current }) || {};

     this.modal = new theme.Modals('ShopSwitch-' + sectionId, 'shopswitch');

     window.openshopswitch = (function() {
        this.openPopup();
      }).bind(this);

     setTimeout((function () {
       $('.openshopswitch').click((function(evt) {

         window.closeMobileMenu();

         this.openPopup();

       }).bind(this));
     }).bind(this), 500);

     if (window.top.location.search.indexOf('switch') !== -1) {
       this.setCookie();
       this.data.cookie = this.data.currentCountry.country_code;
     }

     console.info('[Shop Switch] Cookie: ' + this.data.cookie);

     if (!this.data.isBot) {

        if (this.data.cookie != this.data.currentCountry.country_code || this.data.socialReferrer || this.data.testMode) {

          $.getJSON( this.data.apiUrl, (function( json ) {
            this.handleLocation( json.country_code );
          }).bind(this))
          .fail(function(jqXHR, textStatus, errorThrown) {
            console.log('ipstack request failed: ' + textStatus);
          });

        }
     }

     $('body').on('modalClose.' + $container.attr('id'), this.closePopup.bind(this));

     // Check if the switcher is enabled
     if (this.data.switcherEnable) {
       // Build dropdown
       var context = {
         currentTitle: this.data.currentCountry.title,
         currentImg: this.data.currentCountry.img,
         currentCurrency: this.data.currentCountry.currency,
         countries: _.sortBy(this.data.countries, [function(o) { return !o.current; }])
       };

       var template = Mustache.render(this.data.switcherTemplate, context);

       // Add final dropdown html to wrappers
       $('.shop-switch__dropdown').each(function() {
         $(this).html(template);
       })

     }

     window.ShopSwitch = this;

   }

   ShopSwitch.prototype = $.extend({}, ShopSwitch.prototype, {

     handleLocation : function(locationData) {

       if (_.isUndefined(locationData)) {
         console.error('Could not get location based on IP.');
         return;
       }

       var ipCountryCode = locationData;

       // Check if the desired country is available by index
       var ip_index = _.findIndex(this.data.countries, function(o) { return o.country_code == ipCountryCode; });
       var default_index = _.findIndex(this.data.countries, function(o) { return o.default; });
       var current_index = _.findIndex(this.data.countries, function(o) { return o.current; });

       // Is country from IP in our list AND is that the current shop?
       if (ip_index >= 0 && current_index == ip_index) {
         // Do nothing

       }
       // Is country from IP NOT in our list AND are we on the default shop?
       else if (ip_index < 0 && current_index == default_index) {
         // Do nothing

       } else {
         // Is country from IP in our list?
         if (ip_index >= 0) {
           var new_index = ip_index;
         }
         // Go to default
         else {
           var new_index = default_index;
         }

         console.info('[Shop Switch] Designated shop:\n' + this.data.countries[new_index].url);

         // Show the modal content for the designated country
         $('#' + this.data.countries[new_index].id).show();

         // Open the modal
         if (this.data.mode == 'enabled' || this.data.testMode) {
           this.initPopupDelay();
         } else if(this.data.mode == 'redirect') {
           console.log('[Shop Switch] Redirecting...');
           if (window.location.search.indexOf('design_theme_id') !== -1) {
             console.warn('[Shop Switch] Cannot redirect from Theme Editor.\nWould have redirected to: ' + this.data.countries[new_index].url);
           } else {
             this.redirect(this.data.countries[new_index].url);
           }
         }
       }

     },

     initPopupDelay: function() {

       setTimeout(function() {
         this.modal.open();
       }.bind(this), this.data.secondsBeforeShow * 1000);

     },

     redirect: function(url) {
       window.top.location.replace(url);
     },

     openPopup: function() {
       this.modal.open();
     },

     closePopup: function() {
       // Remove a cookie in case it was set in test mode

       if (this.data.testMode) {
         $.removeCookie(this.cookieName, { path: '/' });
         return;
       }

       this.setCookie();
     },

     setCookie: function() {
       $.cookie(this.cookieName, this.data.currentCountry.country_code, { path: '/', expires: this.data.daysBeforeReappear });
     },

     onLoad: function() {
       this.modal.open();
       console.log('load');
     },

     onSelect: function() {
       this.modal.open();
       console.log('select');
     },

     onDeselect: function() {
       this.modal.close();
     },

     onBlockSelect: function(event) {

     },

     onBlockDeselect: function(event) {

     },

     onUnload: function() {}
   });

   return ShopSwitch;
 })();
