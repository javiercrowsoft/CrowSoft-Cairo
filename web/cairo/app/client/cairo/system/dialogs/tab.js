(function() {
  "use strict";

  /*
      this module define a tab and a collection of tabs ...
  */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Dialogs", function(Dialogs, Cairo, Backbone, Marionette, $, _) {

    Dialogs.createTab = function() {

      var self = {
        key: 0,
        name: ''
      };

      var that = {};

      that.getName = function() {
        return self.name;
      };
      that.setName = function(name) {
        self.name = name;
      };

      return that;

    };

  });

}());