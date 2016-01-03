(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.DatePickerType = {
      date: 1,
      time: 2
    };

    var createDatePicker = function() {

      var NO_DATE = Cairo.Constants.NO_DATE;

      var self = {
        value: Cairo.Constants.NO_DATE,
        type: Controls.DatePickerType.date,
        dateName: ''
      };

      var that = Controls.createControl();

      that.htmlTag = '<input class="datepicker">';

      var superSetElement = that.setElement;

      that.setElement = function(element, view) {
        superSetElement(element);
        element.val(self.value);
        element.addClass("dialog-control dialog-input-control");
        $(element).datepicker({
          constrainInput: false,
          showButtonPanel: true
        });
        var onChange = view.onDateChange(that);
          element.change(function() {
          setValue(element.val());
          onChange();
        });
      };

      var getDateFormatted = Cairo.Util.getDateFormatted;
      var getDateValue = Cairo.Util.getDateValue;

      var setValue = function(value) {
        if(typeof value === "string") {
          if(value.length > 1) {
            value = getDateValue(value);
          }
        }
        value = getDateFormatted(value);
        self.value = value;
        var element = that.getElement();
        if(element) {
          element.val(value);
        }
      };

      that.getValue = function() {
        var element = that.getElement();
        if(element) {
          if(self.value !== element.val()) {
            setValue(element.val());
          }
        }
        return self.value;
      };

      that.setValue = setValue;

      that.getType = function() {
        return self.type;
      };
      that.setType = function(type) {
        self.type = type;
      };

      that.getDateName = function() {
        return self.dateName;
      };

      that.setButtonStyle = function(style) { /* TODO: implement this. */ };

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