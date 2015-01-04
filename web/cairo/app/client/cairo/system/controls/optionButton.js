(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var createOptionButton = function() {
      var self = {
        text: "",
        value: false
      };  

      var that = Controls.createControl();
      
      that.htmlTag = "<input/>";


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

    Controls.createOptionButton = function() {

      var self = {
        objectType: "cairo.controls.optionButton"
      };

      var that = createOptionButton();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;
    };

  });

}());