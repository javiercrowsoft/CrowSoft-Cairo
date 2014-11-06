(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.TextArea = Controls.Control.extend({
      urlRoot: "",

      defaults: {}

    });

    Controls.createTextArea = function() {

      var self = {
        objectType: "cairo.controls.textArea"
      };

      var that = new Controls.TextArea();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;

    };

  });

}());