(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var C_MODULE = "Controls.optionButton";

    var createOptionButton = function() {
      var self = {
        text: "",
        value: false,
        group: 0
      };  

      var that = Controls.createControl();
      
      that.htmlTag = "<input/>";

      that.setText = function(text) {
        Cairo.validateAssignmentIsNotNull(text, C_MODULE, "createOptionButton.setText");
        self.text = text;
      };
      that.getText = function() {
        return self.text;
      };

      that.setValue = function(value) {
        if(value === undefined) {
          Cairo.raiseError("setValue", "undefined can not be used when calling setValue");
        }
        self.value = value;
      };
      that.getValue = function() {
        return self.value;
      };

      that.setOptionGroup = function(group) {
        self.group = group;
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