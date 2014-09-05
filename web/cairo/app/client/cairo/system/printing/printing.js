(function() {
  "use strict";

  /*
      this module brings printing services ...
  */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Entities.Printing", function(Printing, Cairo, Backbone, Marionette, $, _) {

    Printing.Manager = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
      }

    });

  });

  ///////////////
  // Handler
  ///////////////

  Cairo.module("Printing", function(Printing, Cairo, Backbone, Marionette, $, _) {

  });

  ///////////////
  // Views
  ///////////////

  Cairo.module("Printing.View", function(View, Cairo, Backbone, Marionette, $, _) {

  });

  ///////////////
  // Controller
  ///////////////

  Cairo.module("Printing.Actions", function(Actions, Cairo, Backbone, Marionette, $, _) {

  });

  Cairo.module("Printing.View", function(View, Cairo, Backbone, Marionette, $, _) {

    View.Controller = {

    };

  });

}());