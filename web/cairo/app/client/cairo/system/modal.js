(function() {
  "use strict";

  Cairo.Modal = {

    confirmViewYesDanger: function(title, message) {
      var defer = new Cairo.Promises.Defer();

      var view = Cairo.confirmViewYesDanger(
        title,
        message,
        function(answer) { defer.resolve(answer); }
      );
      Cairo.dialogRegion.show(view);

      return defer.promise;
    },

    confirmCancelViewNoDanger: function(title, message) {
      /* TODO: implement this. */
    },

    confirmCancelViewYesDanger: function(title, message) {
      /* TODO: implement this. */
    },

    inputFormView: function(title, message, defaultValue) {
      var defer = new Cairo.Promises.Defer();

      var view = Cairo.inputFormView(
        title,
        message,
        defaultValue,
        function(text) {
          Cairo.dialogSelectTreeRegion.handler = null;
          defer.resolve(text);
        }
      );

      Cairo.dialogSelectTreeRegion.handler = {
        closeDialog: function() {
          defer.reject();
        }
      };

      Cairo.dialogRegion.show(view);

      return defer.promise;
    }

  };

}());