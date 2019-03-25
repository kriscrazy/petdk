/**
* Carousels Script
* ------------------------------------------------------------------------------
* A file that contains scripts highly couple code to the Carousel utility.
*
* @namespace Carousels
*/

theme.Carousels = (function() {
  function Carousels(element) {

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Carousels);

    this.element = element;
    this.initialConfig = $(element).data('flickity-config');
    this.options = options;

    console.log(this.initialConfig);

    this._attachListeners();
    this._build();

  };

  Carousels.prototype.destroy = function() {
    this.flickityInstance.destroy();

    if (this.initialConfig['breakpoints'] !== undefined) {
      document.removeEventListener('breakpoint:changed', this._onBreakpointChangedListener);
    }
  };

  Carousels.prototype.selectCell = function(index) {
    var shouldPause = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var shouldAnimate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    if (shouldPause) {
      this.flickityInstance.pausePlayer();
    }

    this.flickityInstance.select(index, false, !shouldAnimate);
  };

  Carousels.prototype.pausePlayer = function() {
    this.flickityInstance.pausePlayer();
  };

  Carousels.prototype.unpausePlayer = function() {
    this.flickityInstance.unpausePlayer();
  };

  Carousels.prototype.resize = function() {
    this.flickityInstance.resize();
  };

  Carousels.prototype.getSelectedIndex = function() {
    return this.flickityInstance.selectedIndex;
  };

  Carousels.prototype.getSelectedCell = function() {
    return this.flickityInstance.selectedCell.element;
  };

  Carousels.prototype._attachListeners = function() {
    if (this.initialConfig['breakpoints'] !== undefined) {
      this._onBreakpointChangedListener = this._onBreakpointChanged.bind(this);
      document.addEventListener('breakpoint:changed', this._onBreakpointChangedListener);
    }
  };

  /**
  * Create the carousel instance
  */

  Carousels.prototype._build = function() {
    var _this = this;

    var config = this._processConfig();

    this.flickityInstance = new Flickity(this.element, config);
    this._validateDraggable();

    this.selectedIndex = this.flickityInstance.selectedIndex;

    this.flickityInstance.on('resize', this._validateDraggable.bind(this));

    if (this.options['onSelect']) {
      this.flickityInstance.on('select', function () {
        // Flickity will send the "select" event whenever the window resize (even on mobile...), as a consequence we need to check
        // first if the slide index have changed or not (cf: https://github.com/metafizzy/flickity/issues/529)

        if (_this.selectedIndex !== _this.flickityInstance.selectedIndex) {
          _this.options['onSelect'](_this.flickityInstance.selectedIndex, _this.flickityInstance.selectedCell.element);
          _this.selectedIndex = _this.flickityInstance.selectedIndex;
        }
      });
    }

    if (this.options['onClick']) {
      this.flickityInstance.on('staticClick', function (event, pointer, cell, index) {
        _this.options['onClick'](cell, index);
      });
    }
  };

  /**
  * By default, Flickity does not disable draggable automatically if there is nothing to slide. We therefore manually do the check here by checking
  * if the displayed elements equals to the amount of elements
  */

  Carousels.prototype._validateDraggable = function() {
    var isActive = this.flickityInstance.isActive || false;

    if (!isActive || !this.flickityInstance.options['draggable']) {
      return; // Not draggable, so nothing to do
    }

    if (undefined === this.flickityInstance.selectedElements || this.flickityInstance.selectedElements.length === this.flickityInstance.cells.length) {
      this.flickityInstance.unbindDrag();
    } else {
      this.flickityInstance.bindDrag();
    }
  };

  /**
  * Flickity is a CSS driven library and hence it is hard to setup some stuff in pure JS
  */

  Carousels.prototype._processConfig = function() {
    var config = Object.assign({}, this.initialConfig);

    delete config['breakpoints'];

    if (this.initialConfig['breakpoints'] === undefined) {
      return config; // No change, we simply return the config as it is
    }

    var breakpoints = this.initialConfig['breakpoints'];

    breakpoints.forEach(function (breakpoint) {
      if (theme.Responsive.matchesBreakpoint(breakpoint['matches'])) {
        config = Object.assign(config, breakpoint['settings']);
      }
    });

    return config;
  };

  /**
  * Verify if the breakpoint has changed, and optionally update the carousel
  */

  Carousels.prototype._onBreakpointChanged = function() {
    // The breakpoint may have changed, so we delete the carousel and rebuild it
    this.flickityInstance.destroy();
    this._build();
  };

return Carousels;

})();
