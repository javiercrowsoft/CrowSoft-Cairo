(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.OptionButton = Controls.Control.extend({
      urlRoot: "",

      defaults: {},

      htmlTag: "<input/>",

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

    Controls.createOptionButton = function() {

      var self = {
        objectType: "cairo.controls.optionButton"
      };

      var that = new Controls.OptionButton();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;

    };

  });

}());