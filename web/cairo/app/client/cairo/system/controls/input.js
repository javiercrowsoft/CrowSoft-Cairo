(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.ButtonStyle = {
      single: 1,
      none: 2
    };

    Controls.InputType = {
      text: 1,
      money: 2,
      integer: 3,
      double: 4,
      percentage: 5,
      mask: 6,
      taxId: 7,
      memo: 8,
      file: 9,
      folder: 10
    };

    Controls.Input = Controls.Control.extend({
      urlRoot: "",

      defaults: {},

      text: "",
      enabledNoChangeBkColor: false,
      maxLength: 0,
      fileFilter: "",
      inputDisabled: false,
      type: Controls.InputType.text,

      setText: function(text) {
        this.text = text;
      },
      getText: function() {
        return this.text;
      },

      getMask: function() { /* TODO: implement this. */ },
      setMask: function(mask) { /* TODO: implement this. */ },
      setButtonStyle: function(style) { /* TODO: implement this. */ },
      setPasswordChar: function(char) { /* TODO: implement this. */ },
      setEnabledNoChangeBkColor: function(value) { this.enabledNoChangeBkColor = value; },
      setMaxLength: function(length) { this.maxLength = length; },
      setInputDisabled: function(value) { this.inputDisabled = value; },
      setFileFilter: function(filter) { this.fileFilter = filter; },

      getType: function() {
        return this.type;
      },
      setType: function(type) {
        this.type = type;
      }

    });

    Controls.createInput = function() {

      var self = {
        objectType: "cairo.controls.input"
      };

      var that = new Controls.Input();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;

    };

  });

}());