(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Entities.Dialogs.Views", function(Views, Cairo, Backbone, Marionette, $, _) {

    Views.DialogClient = {

      messageEx: function(messageKey, info) { /* TODO: implement this. */ },
      editDocumentsEnabled: function() { /* TODO: implement this. */ },
      addEnabled: function() { /* TODO: implement this. */ },
      copyEnabled: function() { /* TODO: implement this. */ },
      showDocDigital: function() { /* TODO: implement this. */ },
      editNew: function() { /* TODO: implement this. */ },
      propertyChange: function() { /* TODO: implement this. */ },
      deleteRow: function(propertyKey, row, rowIndex) { /* TODO: implement this. */ },
      newRow: function(propertyKey, rowIndex) { /* TODO: implement this. */ },
      columnAfterUpdate: function(propertyKey, indexRow, indexCol) { /* TODO: implement this. */ }

    };

  });

}());