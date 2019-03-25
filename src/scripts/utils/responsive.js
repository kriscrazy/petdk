/**
* Responsive Script
* ------------------------------------------------------------------------------
* A file that contains scripts highly couple code to the Responsive utility.
*
* @namespace Responsive
*/

theme.Responsive = (function() {
  function Responsive() {

    _classCallCheck(this, Responsive);

    this.currentBreakpoint = Responsive.getCurrentBreakpoint();

    window.addEventListener('resize', function () {
      var newBreakpoint = Responsive.getCurrentBreakpoint();

      if (this.currentBreakpoint === newBreakpoint) {
        return;
      }

      document.dispatchEvent(new CustomEvent('breakpoint:changed', { detail: {
        previousBreakpoint: this.currentBreakpoint,
        currentBreakpoint: newBreakpoint
      } }));

      this.currentBreakpoint = newBreakpoint;
    });
  };

  Responsive.prototype.matchesBreakpoint = function(breakpoint) {
    switch (breakpoint) {
      case 'small':
      return window.matchMedia('screen and (max-width: 640px)').matches;

      case 'medium':
      return window.matchMedia('screen and (min-width: 641px) and (max-width: 1007px)').matches;

      case 'medium-up':
      return window.matchMedia('screen and (min-width: 641px)').matches;

      case 'medium-down':
      return window.matchMedia('screen and (max-width: 1007px)').matches;

      case 'large':
      return window.matchMedia('screen and (min-width: 1008px) and (max-width: 1279px)').matches;

      case 'large-up':
      return window.matchMedia('screen and (min-width: 1008px)').matches;

      case 'desktop':
      return window.matchMedia('screen and (min-width: 1280px)').matches;

      case 'widescreen':
      return window.matchMedia('screen and (min-width: 1600px)').matches;
    }
  };

  Responsive.prototype.getCurrentBreakpoint = function() {
    if (window.matchMedia('screen and (max-width: 640px)').matches) {
      return 'small';
    }

    if (window.matchMedia('screen and (min-width: 641px) and (max-width: 1007px)').matches) {
      return 'medium';
    }

    if (window.matchMedia('screen and (min-width: 1008px) and (max-width: 1279px)').matches) {
      return 'large';
    }

    if (window.matchMedia('screen and (min-width: 1280px)').matches) {
      return 'desktop';
    }
  };

  return Responsive;
})();
