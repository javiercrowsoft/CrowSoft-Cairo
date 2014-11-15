(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.Label = Controls.Control.extend({
      urlRoot: "",

      defaults: {},

      htmlTag: "<label/>",

      text: "",

      setElement: function(element) {
        Controls.Input.__super__.setElement(element);
        element.text(this.text);
        element.addClass('dialog-label');
      },

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