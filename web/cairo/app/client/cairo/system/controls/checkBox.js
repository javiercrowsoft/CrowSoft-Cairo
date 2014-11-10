(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.CheckBox = Controls.Control.extend({
      urlRoot: "",

      defaults: {},

      text: "",
      value: false,

      setText: function(text) {
        this.text = text;
      },
      getText: function() {
        return this.text;
      },

      setValue: function(value) {
        this.value = value;
      },
      getValue: function() {
        return this.value;
      }

    });

    Controls.createCheckBox = function() {

      var self = {
        objectType: "cairo.controls.checkBox"
      };

      var that = new Controls.CheckBox();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;

    };

  });

}());