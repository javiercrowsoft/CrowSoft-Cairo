(function() {
  "use strict";

  /*
      this module define a wizard step and a collection of wizard steps ...
  */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Dialogs", function(Dialogs, Cairo, Backbone, Marionette, $, _) {

    Dialogs.createStep = function() {

    };

    Dialogs.createSteps = function() {
      return Cairo.Collections.createCollection(Dialogs.createStep);
    };

  });

}());