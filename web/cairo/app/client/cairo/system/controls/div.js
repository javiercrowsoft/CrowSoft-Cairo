(function() {
    "use strict";
  
    Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {
  
      var C_MODULE = "Controls.div";
  
      var createDiv = function() {
  
        var that = Controls.createControl();
  
        that.htmlTag = "<div/>";
  
        var superSetElement = that.setElement;
  
        that.setElement = function(element) {
          superSetElement(element);
        };
  
        return that;
      };
  
      Controls.createDiv = function() {
  
        var self = {
          objectType: "cairo.controls.div"
        };
  
        var that = createDiv();
  
        that.getObjectType = function() {
          return self.objectType;
        };
  
        return that;
      };
  
    });
  
  }());