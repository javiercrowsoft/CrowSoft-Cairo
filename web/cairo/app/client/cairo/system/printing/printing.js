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
      },

      setPath: function(path) { /* TODO: implement this. */ },
      setCommandTimeout: function(timeout) { /* TODO: implement this. */ },
      setConnectionTimeout: function(timeout) { /* TODO: implement this. */ },
      showPrint: function(id, tblId, docId) { /* TODO: implement this. */ }

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