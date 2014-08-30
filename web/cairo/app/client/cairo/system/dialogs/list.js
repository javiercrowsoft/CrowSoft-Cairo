(function() {
  "use strict";

  /*
      this module manages a list view ...
  */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Entities.Dialogs", function(Dialogs, Cairo, Backbone, Marionette, $, _) {

    Dialogs.List = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
        dialog: new Dialogs.Manager(),
        name:   ''
      },

      validate: function(attrs, options) {
        var errors = {};
        if(! attrs.name) {
          errors.name = "can't be blank";
        }
        if( ! _.isEmpty(errors)) {
          return errors;
        }
      }
    });

  });

}());