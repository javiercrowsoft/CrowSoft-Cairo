(function() {
  "use strict";

  /*
      this module manages a wizard view ...
  */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Dialogs", function(Dialogs, Cairo, Backbone, Marionette, $, _) {

    Dialogs.Wizard = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
        steps: new Dialogs.WizardSteps()
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