(function() {
  "use strict";

  Cairo.module("Modules", function(Modules, Cairo, Backbone, Marionette, $, _) {

    Modules.createModules = function() {

      var that = {};

      that.init = function() {
        return Cairo.Promises.resolvedPromise();
      };

      return that;
    };

  });


}());