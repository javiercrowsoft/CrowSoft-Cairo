(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var createImage = function() {

      var self = {
        image: ""
      };

      var that = Controls.createControl();

      that.htmlTag = "<img/>";

      that.setImage = function(image) {
        self.image = image;
        var element = that.getElement();
        if(element) {
          element.attr("src", image);
        }
      };

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