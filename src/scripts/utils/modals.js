/**
 * Modals Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Modals utility.
 *
   * @namespace Modals
 */

 theme.Modals = (function() {
   function Modal(id, name, options) {
     var defaults = {
       close: '.js-modal-close',
       open: '.js-modal-open-' + name,
       openClass: 'modal--is-active',
       closingClass: 'modal--is-closing',
       bodyOpenClass: 'modal-open',
       bodyOpenSolidClass: 'modal-open--solid',
       bodyClosingClass: 'modal-closing',
       closeOffContentClick: true
     };

     this.id = id;
     this.$modal = $('#' + id);

     if (!this.$modal.length) {
       return false;
     }

     this.nodes = {
       $parent: $('html').add('body'),
       $modalContent: this.$modal.find('.modal__inner')
     };

     this.config = $.extend(defaults, options);
     this.modalIsOpen = false;
     this.$focusOnOpen = this.config.focusOnOpen ? $(this.config.focusOnOpen) : this.$modal;
     this.isSolid = this.config.solid;

     this.init();
   }

   Modal.prototype.init = function() {
     var $openBtn = $(this.config.open);

     // Add aria controls
     $openBtn.attr('aria-expanded', 'false');

     $(this.config.open).on('click', this.open.bind(this));
     this.$modal.find(this.config.close).on('click', this.close.bind(this));

     // Close modal if a drawer is opened
     $('body').on('drawerOpen', function() {
       this.close();
     }.bind(this));
   };

   Modal.prototype.open = function(evt) {
     // Keep track if modal was opened from a click, or called by another function
     var externalCall = false;

     // don't open an opened modal
     if (this.modalIsOpen) {
       return;
     }

     // Prevent following href if link is clicked
     if (evt) {
       evt.preventDefault();
     } else {
       externalCall = true;
     }

     // Without this, the modal opens, the click event bubbles up to $nodes.page
     // which closes the modal.
     if (evt && evt.stopPropagation) {
       evt.stopPropagation();
       // save the source of the click, we'll focus to this on close
       this.$activeSource = $(evt.currentTarget);
     }

     if (this.modalIsOpen && !externalCall) {
       this.close();
     }

     this.$modal
       .prepareTransition()
       .addClass(this.config.openClass);
     this.nodes.$parent.addClass(this.config.bodyOpenClass);

     if (this.isSolid) {
       this.nodes.$parent.addClass(this.config.bodyOpenSolidClass);
     }

     this.modalIsOpen = true;

     slate.a11y.trapFocus({
       $container: this.$modal,
       $elementToFocus: this.$focusOnOpen,
       namespace: 'modal_focus'
     });

     if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
       this.$activeSource.attr('aria-expanded', 'true');
     }

     $('body').trigger('modalOpen.' + this.id);

     this.bindEvents();
   };

   Modal.prototype.close = function() {
     // don't close a closed modal
     if (!this.modalIsOpen) {
       return;
     }

     // deselect any focused form elements
     $(document.activeElement).trigger('blur');

     this.$modal
       .prepareTransition()
       .removeClass(this.config.openClass)
       .addClass(this.config.closingClass);
     this.nodes.$parent.removeClass(this.config.bodyOpenClass);
     this.nodes.$parent.addClass(this.config.bodyClosingClass);
     var o = this;
     window.setTimeout(function() {
       o.nodes.$parent.removeClass(o.config.bodyClosingClass);
       o.$modal.removeClass(o.config.closingClass);
     }, 500); // modal close css transition

     if (this.isSolid) {
       this.nodes.$parent.removeClass(this.config.bodyOpenSolidClass);
     }

     this.modalIsOpen = false;

     slate.a11y.removeTrapFocus({
       $container: this.$modal,
       namespace: 'modal_focus'
     });

     if (this.$activeSource && this.$activeSource.attr('aria-expanded')) {
       this.$activeSource.attr('aria-expanded', 'false').focus();
     }

     $('body').trigger('modalClose.' + this.id);

     this.unbindEvents();
   };

   Modal.prototype.bindEvents = function() {
     // Pressing escape closes modal
     this.nodes.$parent.on('keyup.modal', function(evt) {
       if (evt.keyCode === 27) {
         this.close();
       }
     }.bind(this));

     if (this.config.closeOffContentClick) {
       // Clicking outside of the modal content also closes it
       this.$modal.on('click.modal', this.close.bind(this));

       // Exception to above: clicking anywhere on the modal content will NOT close it
       this.nodes.$modalContent.on('click.modal', function(evt) {
         evt.stopImmediatePropagation();
       });
     }
   };

   Modal.prototype.unbindEvents = function() {
     this.nodes.$parent.off('.modal');

     if (this.config.closeOffContentClick) {
       this.$modal.off('.modal');
       this.nodes.$modalContent.off('.modal');
     }
   };

   return Modal;
 })();
