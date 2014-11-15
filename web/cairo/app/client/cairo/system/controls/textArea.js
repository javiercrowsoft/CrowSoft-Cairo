(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.TextArea = Controls.Control.extend({
      urlRoot: "",

      defaults: {},

      htmlTag: "<textarea/>",

      text: "",
      maxLength: 0,
      inputDisabled: false,

      setElement: function(element) {
        Controls.Input.__super__.setElement(element);
        element.val(this.text);
        element.addClass("dialog-control dialog-input-control dialog-textarea-control");
      },

      setText: function(text) {
        this.text = text;
      },
      getText: function() {
        return this.text;
      },

      setMaxLength: function(length) { this.maxLength = length; },
      setInputDisabled: function(value) { this.inputDisabled = value; }

    });

    Controls.createTextArea = function() {

      var self = {
        objectType: "cairo.controls.textArea"
      };

      var that = new Controls.TextArea();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;

    };

  });

}());