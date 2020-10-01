(function() {
  "use strict";

  Cairo.module("Tasks", function(Tasks, Cairo, Backbone, Marionette, $, _) {

    Tasks.createTasks = function() {

      var that = {};

      that.init = function() {
        return Cairo.Promises.resolvedPromise(true);
      };

      return that;
    };

  });


}());