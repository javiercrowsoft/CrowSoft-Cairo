(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.Menu = Controls.Control.extend({
      urlRoot: "",

      defaults: {},

      text: "",

      setText: function(text) {
        this.text = text;
      },
      getText: function() {
        return this.text;
      },

      showPopupMenu: function() { /* TODO: implement this. */ },
      clear: function() { /* TODO: implement this. */ },
      addListener: function(callback) { /* TODO: implement this. */ },
      add: function(id, text) { /* TODO: implement this. */ },
      getItemData: function(id) { /* TODO: implement this. */ }

    });

  });

}());