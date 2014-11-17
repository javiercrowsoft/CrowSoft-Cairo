(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var createCheckBox = function() {
      var self = {
        urlRoot: "",
  
        defaults: {},

        text: "",
        value: false
      }
      
      var that = Controls.createControl();

      that.htmlTag = "<input/>";

      var superSetElement = that.setElement;

      that.setElement = function(element) {
        superSetElement(element);
        element.attr('type', 'checkbox');
        element.prop('checked', self.value);
      };

      that.setText = function(text) {
        self.text = text;
      };

      that.getText = function() {
        return self.text;
      };

      that.setValue = function(value) {
        self.value = value;
      };
      that.getValue = function() {
        return self.value;
      };

      return that;

    };

    Controls.createCheckBox = function() {

      var self = {
        objectType: "cairo.controls.checkBox"
      };

      var that = createCheckBox();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;

    };

  });

}());