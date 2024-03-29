(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var C_MODULE = "Controls.label";

    var createLabel = function() {
      var self = {
        text: "",
        labelFor: "",
        fixHeight: false
      };

      var that = Controls.createControl();

      that.htmlTag = "<label/>";

      var superSetElement = that.setElement;

      that.setElement = function(element) {
        superSetElement(element);
        element.text(self.text);
        element.addClass('dialog-label');
        applyVisible();
      };

      that.setText = function(text) {
        Cairo.validateAssignmentIsNotNull(text, C_MODULE, "createLabel.setText");
        self.text = text;
        var element = that.getElement();
        if(element) {
          element.text(self.text);
        }
      };

      that.getText = function() {
        return self.text;
      };

      that.setLabelFor = function(labelFor) {
        self.labelFor = labelFor;
      };
      that.getLabelFor = function() {
        return self.labelFor;
      };

      that.setFixHeight = function(value) {
        self.fixHeight = value;
      };
      that.getFixHeight = function() {
        return self.fixHeight;
      };

      var superSetVisible = that.setVisible;

      that.setVisible = function(visible) {
        superSetVisible(visible);
        applyVisible();
      };

      var applyVisible = function() {
        if(that.getElement()) {
          if(that.getVisible()) {
            that.getElement().css('display', 'block');
          }
          else if(that.getFixHeight()) { // hack to get the div respect the height
            that.getElement().css('display', 'block');
            that.getElement().text(".");
            that.getElement().css('color', 'white');
          }
        }
      };

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