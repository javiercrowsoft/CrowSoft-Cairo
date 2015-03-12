(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var createCombo = function() {
      var self = {
        text: ""
      };

      var that = Controls.createControl();

      that.htmlTag = "<select></select>";

      that.setText = function(text) {
        self.text = text;
      };

      that.getText = function() {
        return self.text;
      };

      that.clear = function() { /* TODO: implement this. */ };
      that.add = function() { /* TODO: implement this. */ };
      that.setItemData = function() { /* TODO: implement this. */ };
      that.getNewIndex = function() { /* TODO: implement this. */ };
      that.getListIndex = function() { /* TODO: implement this. */ };
      that.setListIndex = function() { /* TODO: implement this. */ };

      return that;
    };

    Controls.createCombo = function() {

      var self = {
        objectType: "cairo.controls.combo"
      };

      var that = createCombo();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;
    };

  });

}());