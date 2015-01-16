(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var createButton = function() {
      var self = {
        urlRoot: "",

        defaults: {},

        text: "",
        isCancel: false
      };

      var that = Controls.createControl();

      that.htmlTag = "<button/>";

      that.setText = function(text) {
        self.text = text;
      };

      that.getText = function() {
        return self.text;
      };

      that.setIsCancel = function(isCancel) {
        self.isCancel = isCancel;
      };

      return that;
    };

    Controls.createButton = function() {

      var self = {
        objectType: "cairo.controls.button"
      };

      var that = new createButton();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;
    };

  });

}());