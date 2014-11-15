(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.CheckBox = Controls.Control.extend({
      urlRoot: "",

      defaults: {},

      htmlTag: "<input/>",

      text: "",
      value: false,

      setElement: function(element) {
        Controls.Input.__super__.setElement(element);
        element.attr('type', 'checkbox');
        element.prop('checked', this.value);
      },

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