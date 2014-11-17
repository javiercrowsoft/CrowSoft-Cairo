(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var createPassword = function() {
      var self = {
        text: ""
      };

      var that = Controls.createControl();

      that.htmlTag = "<input/>";

      that.setText = function(text) {
        self.text = text;
      };

      that.getText = function() {
        return self.text;
      };

      return that;

    };

    Controls.createPassword = function() {

      var self = {
        objectType: "cairo.controls.password"
      };

      var that = createPassword();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;

    };

  });

}());