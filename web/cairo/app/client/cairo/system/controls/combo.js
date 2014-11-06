(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.Combo = Controls.Control.extend({
      urlRoot: "",

      defaults: {}

    });

    Controls.createCombo = function() {

      var self = {
        objectType: "cairo.controls.combo"
      };

      var that = new Controls.Combo();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;

    };

  });

}());