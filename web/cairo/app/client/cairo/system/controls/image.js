(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Entities.Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.Image = Controls.Control.extend({
      urlRoot: "",

      defaults: {
      },

      setImage: function(image) { /* TODO: implement this. */ }

    });

  });

}());