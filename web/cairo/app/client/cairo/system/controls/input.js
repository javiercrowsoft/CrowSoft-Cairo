(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Entities.Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.Input = Controls.Control.extend({
      urlRoot: "",

      defaults: {
        enabledNoChangeBkColor: false
      },

      getMask: function() { /* TODO: implement this. */ },
      setMask: function(mask) { /* TODO: implement this. */ },
      setEnabledNoChangeBkColor: function(value) { this.enabledNoChangeBkColor = value; }

    });

  });

}());