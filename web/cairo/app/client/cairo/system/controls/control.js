(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Entities.Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.Control = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
      },

      setVisible: function(visible) { /* TODO: implement this. */ },
      setIsCancel: function(isCancel) { /* TODO: implement this. */ },
      setText: function(text) { /* TODO: implement this. */ },
      setWidth: function(text) { /* TODO: implement this. */ },
      getWidth: function() { /* TODO: implement this. */ }

    });

  });

}());