(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var createCombo = function() {
      var self = {
        urlRoot: "",

        defaults: {},

        text: ""
      };

      var that = Controls.createControl();

      that.htmlTag = "<select></select>";

      that.setText = function(text) {
        self.text = text;
      };

      that.getText = function() {
        return self.text;
      };

      return that;
    };

    Controls.createCombo = function() {

      var self = {
        objectType: "cairo.controls.combo"
      };

      var that = createCombo();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;
    };

  });

}());