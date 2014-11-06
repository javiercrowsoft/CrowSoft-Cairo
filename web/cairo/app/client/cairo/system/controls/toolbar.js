(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.Toolbar = Controls.Control.extend({
      urlRoot: "",

      defaults: {}

    });

    Controls.createButton = function() {

      var self = {
        objectType: "cairo.controls.toolbar"
      };

      var that = new Controls.Toolbar();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;

    };

  });

}());