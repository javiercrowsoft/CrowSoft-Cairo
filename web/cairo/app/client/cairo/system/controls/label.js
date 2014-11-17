(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var createLabel = function() {
      var self = {
        text: ""
      };

      var that = Controls.createControl();

      that.htmlTag = "<label/>";

      var superSetElement = that.setElement;

      that.setElement = function(element) {
        superSetElement(element);
        element.text(self.text);
        element.addClass('dialog-label');
      };

      that.setText = function(text) {
        self.text = text;
        var element = that.getElement();
        if(element) {
          element.text(self.text);
        }
      };

      that.getText = function() {
        return self.text;
      }

      return that;

    };

    Controls.createLabel = function() {

      var self = {
        objectType: "cairo.controls.label"
      };

      var that = createLabel();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;

    };

  });

}());