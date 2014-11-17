(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var createMenu = function() {
      var self = {
        text: ""
      }

      var that = Controls.createControl();
      
      that.htmlTag = "<div><div/>";
      
      that.setText = function(text) {
        self.text = text;
      };
      
      that.getText = function() {
        return self.text;
      };

      that.showPopupMenu = function() { /* TODO: implement self. */ };
      that.clear = function() { /* TODO: implement self. */ };
      that.addListener = function(callback) { /* TODO: implement self. */ };
      that.add = function(id, text) { /* TODO: implement self. */ };
      that.getItemData = function(id) { /* TODO: implement self. */ };

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