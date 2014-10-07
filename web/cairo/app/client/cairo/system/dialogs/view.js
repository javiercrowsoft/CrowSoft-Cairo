(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Entities.Dialogs.Views", function(Views, Cairo, Backbone, Marionette, $, _) {

    Views.View = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
      },

      getSaveButton: function() { /* TODO: implement this. */ },
      getCancelButton: function() { /* TODO: implement this. */ },
      getCloseButton: function() { /* TODO: implement this. */ },

      getTab: function() { /* TODO: implement this. */ },
      getTabFooter: function() { /* TODO: implement this. */ },
      getTabItems: function() { /* TODO: implement this. */ },



      getMaskEdits: function() { /* TODO: implement this. */ },
      getDatePickers: function() { /* TODO: implement this. */ },
      getSelects: function() { /* TODO: implement this. */ },
      getOptionButtons: function() { /* TODO: implement this. */ },
      getCheckBoxes: function() { /* TODO: implement this. */ },
      getButtons: function() { /* TODO: implement this. */ },
      getCombos: function() { /* TODO: implement this. */ },
      getTextInputs: function() { /* TODO: implement this. */ },
      getTextAreas: function() { /* TODO: implement this. */ },
      getPasswordInputs: function() { /* TODO: implement this. */ },
      getLabels: function() { /* TODO: implement this. */ },
      getCtlLabels: function() { /* TODO: implement this. */ },
      getProgressBars: function() { /* TODO: implement this. */ },
      getDescription: function() { /* TODO: implement this. */ },
      getTitleLabel2: function() { /* TODO: implement this. */ },
      getImages: function() { /* TODO: implement this. */ },
      unLoadToolbar: function() { /* TODO: implement this. */ }

    });

  });

}());