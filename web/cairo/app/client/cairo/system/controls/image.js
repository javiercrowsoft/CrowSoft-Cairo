(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.Image = Controls.Control.extend({
      urlRoot: "",

      defaults: {
      },

      htmlTag: "<img/>",

      setImage: function(image) { /* TODO: implement this. */ }

    });

  });

}());