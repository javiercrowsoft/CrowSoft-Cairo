(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var C_MODULE = "Controls.menu";

    var createMenu = function() {
      var self = {
        text: ""
      };

      var that = Controls.createControl();
      
      that.htmlTag = "<div><div/>";
      
      that.setText = function(text) {
        Cairo.validateAssignmentIsNotNull(text, C_MODULE, "createMenu.setText");
        self.text = text;
      };
      
      that.getText = function() {
        return self.text;
      };

      that.showPopupMenu = function() { /* TODO: implement this. */ };
      that.clear = function() { /* TODO: implement this. */ };
      that.addListener = function(callback) { /* TODO: implement this. */ };
      that.add = function(id, text) { /* TODO: implement this. */ };
      that.getItemData = function(id) { /* TODO: implement this. */ };

      return that;
    };

    Controls.createMenu = function() {

      var self = {
        objectType: "cairo.controls.menu"
      };

      var that = createMenu();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;
    };

  });

}());