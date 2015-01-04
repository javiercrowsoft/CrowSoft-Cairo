(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var createProgressBar = function(){
      var self = {
        value: false
      };

      var that = Controls.createControl();

      that.htmlTag = "<progress/>";

      that.setValue = function(value) {
        self.value = value;
      };

      that.getValue = function() {
        return self.value;
      };

      return that;
    };

    Controls.createProgressBar = function() {

      var self = {
        objectType: "cairo.controls.progressBar"
      };

      var that = createProgressBar();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;
    };

  });

}());