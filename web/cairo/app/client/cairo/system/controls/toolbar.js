(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var createToolbar = function() {
      var self = {};

      var that = Controls.createControl();

      that.htmlTag = "<div><div/>";

      return that;
    };

    Controls.createButton = function() {

      var self = {
        objectType: "cairo.controls.toolbar"
      };

      var that = createToolbar();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;
    };

  });

}());