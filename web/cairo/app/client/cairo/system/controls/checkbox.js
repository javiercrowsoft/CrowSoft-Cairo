(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var C_MODULE = "Controls.checkbox";

    var createCheckbox = function() {
      var self = {
        text: "",
        value: false
      };
      
      var that = Controls.createControl();

      that.htmlTag = "<input/>";

      var superSetElement = that.setElement;

      that.setElement = function(element, view) {
        superSetElement(element);
        element.attr('type', 'checkbox');
        element.prop('checked', self.value);
        element.addClass('dialog-checkbox');
        var onClick = view.onCheckboxClick(that);
        element.click(function() {
          that.setValue(element.is(':checked'));
          onClick();
        });
      };

      that.setText = function(text) {
        Cairo.validateAssignmentIsNotNull(text, C_MODULE, "createCheckbox.setText");
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
        var element = that.getElement();
        if(element) {
          element.prop('checked', self.value);
        }
      };
      that.getValue = function() {
        return self.value;
      };

      return that;
    };

    Controls.createCheckbox = function() {

      var self = {
        objectType: "cairo.controls.checkbox"
      };

      var that = createCheckbox();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;
    };

  });

}());