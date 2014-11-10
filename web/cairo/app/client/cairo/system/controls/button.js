(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.Button = Controls.Control.extend({
      urlRoot: "",

      defaults: {},

      text: "",

      setText: function(text) {
        this.text = text;
      },
      getText: function() {
        return this.text;
      }

    });

    Controls.createButton = function() {

      var self = {
        objectType: "cairo.controls.button"
      };

      var that = new Controls.Button();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;

    };

  });

}());