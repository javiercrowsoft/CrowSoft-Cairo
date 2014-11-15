(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.ProgressBar = Controls.Control.extend({
      urlRoot: "",

      defaults: {},

      htmlTag: "<progress/>",

      value: false,

      setValue: function(value) {
        this.value = value;
      },
      getValue: function() {
        return this.value;
      }

    });

    Controls.createProgressBar = function() {

      var self = {
        objectType: "cairo.controls.progressBar"
      };

      var that = new Controls.ProgressBar();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;

    };

  });

}());