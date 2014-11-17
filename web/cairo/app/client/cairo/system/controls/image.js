(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var createImage = function() {

      var self = {
      };

      var that = Controls.createControl();

      that.htmlTag = "<img/>";

      that.setImage = function(image) { /* TODO: implement this. */ };

      return that;

    };

    Controls.createImage = function() {

      var self = {
        objectType: "cairo.controls.image"
      };

      var that = createImage();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;

    };

  });

}());