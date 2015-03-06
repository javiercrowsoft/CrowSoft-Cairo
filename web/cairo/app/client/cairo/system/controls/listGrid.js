(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var createListGrid = function() {
      var self = {

      };

      var that = Controls.createControl();

      that.htmlTag = "<table/>";

      var superSetElement = that.setElement;

      that.setElement = function(element) {
        superSetElement(element);
        element.text(self.text);
        element.addClass('dialog-list-grid');
      };

      that.load = function(data) {

      };

      that.clear = function() { /* TODO: implement this. */ };

      return that;
    };

    Controls.createListGrid = function() {

      var self = {
        objectType: "cairo.controls.listGrid"
      };

      var that = createListGrid();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;
    };

  });

}());