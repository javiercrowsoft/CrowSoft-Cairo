(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.CheckBox = Controls.Control.extend({
      urlRoot: "",

      defaults: {}

    });

    Controls.createCheckBox = function() {

      var self = {
        objectType: "cairo.controls.checkBox"
      };

      var that = new Controls.CheckBox();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;

    };

  });

}());