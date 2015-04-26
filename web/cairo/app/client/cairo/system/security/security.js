(function() {
  "use strict";

  Cairo.Security = {

    ActionTypes: {
      create: 1,
      edti: 2,
      destroy: 3,
      list: 4,
      invalidate: 5,
      validate: 6,
      apply: 7,
      print: 8
    },

    Actions: {},

    hasPermissionTo: function(action) {
      /* TODO: implement this. */
      return true;
    },

    silentHasPermissionTo: function(action) {
      /* TODO: implement this. */
      return true;
    },

    docHasPermissionTo: function(action, docId, actionType, isForCopy) {
      isForCopy = isForCopy === undefined ? false : isForCopy;
      /* TODO: implement this. */
      return true;
    }

  };

}());