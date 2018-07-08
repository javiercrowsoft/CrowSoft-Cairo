(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var C_MODULE = "Controls.button";

    var createButton = function() {
      var self = {
        text: "",
        isCancel: false
      };

      var that = Controls.createControl();

      that.htmlTag = "<button/>";

      var superSetElement = that.setElement;

      that.setElement = function(element, view) {
        superSetElement(element);
        if(view !== undefined) {
          element.text(self.text);
          element.addClass("btn btn-info dialog-button");
          var onClick = view.onButtonClick(that);
          element.click(function() {
            onClick();
          });
        }
      };

      that.setText = function(text) {
        Cairo.validateAssignmentIsNotNull(text, C_MODULE, "createButton.setText");
        self.text = text;
        var element = that.getElement();
        if(element) {
          element.text(self.text);
        }
      };

      that.getText = function() {
        return self.text;
      };

      that.setIsCancel = function(isCancel) {
        self.isCancel = isCancel;
      };

      return that;
    };

    Controls.createButton = function() {

      var self = {
        objectType: "cairo.controls.button"
      };

      var that = new createButton();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;
    };

  });

}());