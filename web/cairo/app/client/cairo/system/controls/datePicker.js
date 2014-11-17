(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.DatePickerType = {
      date: 1,
      time: 2
    };

    var createDatePicker = function() {
      var self = {
        urlRoot: "",
  
        defaults: {},
  
        value: new Date(1990, 1, 1, 0, 0, 0, 0),
        type: Controls.DatePickerType
      };

      var that = Controls.createControl();

      that.htmlTag = "<input/>";

      that.setValue = function(value) {
        self.value = value;
      };
      that.getValue = function() {
        return self.value;
      };

      that.getType = function() {
        return self.type;
      };
      that.setType = function(type) {
        self.type = type;
      }

      return that;
      
    };

    Controls.createDatePicker = function() {

      var self = {
        objectType: "cairo.controls.datePicker"
      };

      var that = createDatePicker();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;

    };

  });

}());