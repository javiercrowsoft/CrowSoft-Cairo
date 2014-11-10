(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.Password = Controls.Control.extend({
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

    Controls.createPassword = function() {

      var self = {
        objectType: "cairo.controls.password"
      };

      var that = Controls.Password();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;

    };

  });

}());