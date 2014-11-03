(function() {
  "use strict";

  /*
      this module define a wizard step and a collection of wizard steps ...
  */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Dialogs", function(Dialogs, Cairo, Backbone, Marionette, $, _) {

    Dialogs.WizardStep = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
        index:   0,
        name:    ''
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

    Dialogs.WizardSteps = Backbone.Collection.extend({
      url: "",

      model: Dialogs.WizardStep,
      comparator: "index"
    });

  });

}());