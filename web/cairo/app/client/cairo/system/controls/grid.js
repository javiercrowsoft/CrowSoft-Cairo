(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Entities.Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.Grid = Controls.Control.extend({
      urlRoot: "",

      defaults: {
      },

      selectRow: function(row) { /* TODO: implement this. */}

    });

  });

}());