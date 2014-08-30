(function() {
  "use strict";

  /*
      this module define a tab and a collection of tabs ...
  */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Entities.Dialogs", function(Dialogs, Cairo, Backbone, Marionette, $, _) {

    Dialogs.Tab = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
        index:   0,
        name:    '',
        father:  -1
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

    Dialogs.Tabs = Backbone.Collection.extend({
      url: "",

      model: Dialogs.Tab,
      comparator: "index"
    });

  });

}());