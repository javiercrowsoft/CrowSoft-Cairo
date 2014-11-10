(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.Label = Controls.Control.extend({
      urlRoot: "",

      defaults: {},

      text: "",

      setText: function(text) {
        this.text = text;
      },
      getText: function() {
        return this.text;
      }

    });

    Controls.createLabel = function() {

      var self = {
        objectType: "cairo.controls.label"
      };

      var that = new Controls.Label();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;

    };

  });

}());