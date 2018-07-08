(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var C_MODULE = "Controls.menuItem";

    var createMenuItem = function() {
      var self = {
        text: ""
      };

      var that = Controls.createControl();

      that.htmlTag = "<a><a/>";

      that.setText = function(text) {
        Cairo.validateAssignmentIsNotNull(text, C_MODULE, "createMenuItem.setText");
        self.text = text;
      };

      that.getText = function() {
        return self.text;
      };

      return that;
    };

    Controls.createMenuItem = function() {

      var self = {
        objectType: "cairo.controls.menuItem"
      };

      var that = createMenuItem();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;
    };

  });

}());