(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var createTextArea = function() {
      var self = {
        text: "",
        maxLength: 0,
        inputDisabled: false
      };

      var that = Controls.createControl();
      
      that.htmlTag = "<textarea/>";

      var superSetElement = that.setElement;
      
      that.setElement = function(element, view) {
        superSetElement(element);
        element.val(self.text);
        element.addClass("dialog-control dialog-input-control dialog-textarea-control");
        var onChange = view.onTextAreaChange(that);
        element.change(function() {
          that.setText(element.val());
          onChange();
        });
      };

      that.setText = function(text) {
        self.text = text;
      };
      that.getText = function() {
        return self.text;
      };

      that.setMaxLength = function(length) { self.maxLength = length; };
      that.setInputDisabled = function(value) { self.inputDisabled = value; };

      return that;

    };

    Controls.createTextArea = function() {

      var self = {
        objectType: "cairo.controls.textArea"
      };

      var that = createTextArea();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;

    };

  });

}());