(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.Combo = Controls.Control.extend({
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

    Controls.createCombo = function() {

      var self = {
        objectType: "cairo.controls.combo"
      };

      var that = new Controls.Combo();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;

    };

  });

}());