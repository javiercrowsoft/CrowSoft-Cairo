(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var C_MODULE = "Controls.list";

    var createList = function() {
      var self = {
        text: ""
      };

      var that = Controls.createControl();

      that.htmlTag = "<select/>";

      var superSetElement = that.setElement;

      that.setElement = function(element) {
        superSetElement(element);
        element.text(self.text);
        element.addClass('dialog-list');
      };

      that.setText = function(text) {
        Cairo.validateAssignmentIsNotNull(text, C_MODULE, "createList.setText");
        self.text = text;
        var element = that.getElement();
        if(element) {
          element.text(self.text);
        }
      };

      that.getNewIndex = function() { /* TODO: implement this. */ };
      that.setItemData = function(data) { /* TODO: implement this. */ };

      that.getText = function() {
        return self.text;
      };

      that.clear = function() { /* TODO: implement this. */ };

      return that;
    };

    Controls.createList = function() {

      var self = {
        objectType: "cairo.controls.list"
      };

      var that = createList();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;
    };

  });

}());