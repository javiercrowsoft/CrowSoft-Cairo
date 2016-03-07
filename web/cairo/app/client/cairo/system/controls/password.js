(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var createPassword = function() {

      var that = Controls.createInput();

      that.setType(Controls.InputType.password);

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