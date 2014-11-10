(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.DatePickerType = {
      date: 1,
      time: 2
    };

    Controls.DatePicker = Controls.Control.extend({
      urlRoot: "",

      defaults: {},

      value: new Date(1990, 1, 1, 0, 0, 0, 0),
      type: Controls.DatePickerType,

      setValue: function(value) {
        this.value = value;
      },
      getValue: function() {
        return this.value;
      },

      getType: function() {
        return this.type;
      },
      setType: function(type) {
        this.type = type;
      }

    });

    Controls.createDatePicker = function() {

      var self = {
        objectType: "cairo.controls.datePicker"
      };

      var that = new Controls.DatePicker();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;

    };

  });

}());