(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.DatePicker = Controls.Control.extend({
      urlRoot: "",

      defaults: {},

      value: false,

      setValue: function(value) {
        this.value = value;
      },
      getValue: function() {
        return this.value;
      }

    });

    Controls.createDatePicker = function() {

      var self = {
        objectType: "cairo.controls.datePicker"
      };

      var that = new Controls.DatePicker();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;

    };

  });

}());