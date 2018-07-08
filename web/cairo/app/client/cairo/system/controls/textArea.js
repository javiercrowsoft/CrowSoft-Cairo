(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var C_MODULE = "Controls.textArea";

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
          self.text = element.val();
          onChange();
        });
      };

      that.setText = function(text) {
        Cairo.validateAssignmentIsNotNull(text, C_MODULE, "createTextArea.setText");
        self.text = text;
        var element = that.getElement();
        if(element) {
          element.val(self.text);
        }
      };
      that.getText = function() {
        return self.text;
      };

      that.setMaxLength = function(length) { self.maxLength = length; };
      that.setInputDisabled = function(value) { self.inputDisabled = value; };

      that.onKeyUp = function(e) {};

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