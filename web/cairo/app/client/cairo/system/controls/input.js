(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.ButtonStyle = {
      single: 1,
      none: 2
    };

    Controls.Input = Controls.Control.extend({
      urlRoot: "",

      defaults: {
        enabledNoChangeBkColor: false,
        maxLength: 0,
        fileFilter: "",
        inputDisabled: false
      },

      getMask: function() { /* TODO: implement this. */ },
      setMask: function(mask) { /* TODO: implement this. */ },
      setButtonStyle: function(style) { /* TODO: implement this. */ },
      setPasswordChar: function(char) { /* TODO: implement this. */ },
      setEnabledNoChangeBkColor: function(value) { this.enabledNoChangeBkColor = value; },
      setMaxLength: function(length) { this.maxLength = length; },
      setInputDisabled: function(value) { this.inputDisabled = value; },
      setFileFilter: function(filter) { this.fileFilter = filter; }

    });

  });

}());