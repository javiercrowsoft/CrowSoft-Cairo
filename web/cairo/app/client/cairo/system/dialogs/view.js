(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Entities.Dialogs.View", function(Views, Cairo, Backbone, Marionette, $, _) {

    Views.View = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
      },

      getSaveButton: function() { /* TODO: implement this. */ },
      getCancelButton: function() { /* TODO: implement this. */ },
      getCloseButton: function() { /* TODO: implement this. */ }

    });

  });

}());