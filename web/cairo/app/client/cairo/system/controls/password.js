(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.Password = Controls.Control.extend({
      urlRoot: "",

      defaults: {}

    });

    Controls.createPassword = function() {

      var self = {
        objectType: "cairo.controls.password"
      };

      var that = Controls.Password();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;

    };

  });

}());