(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Entities.Dialogs.Views", function(Views, Cairo, Backbone, Marionette, $, _) {

    Views.DocumentView = Views.View.extend({
      urlRoot: "",

      defaults: {
      },

      setHeightToDocWithDescription: function() { /* TODO: implement this. */ }

    });

  });

}());