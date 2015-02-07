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

    confirmViewYesDefault: function(title, message) {
      var defer = new Cairo.Promises.Defer();

      var view = Cairo.confirmViewYesDefault(
        title,
        message,
        function(answer) { defer.resolve(answer); }
      );
      Cairo.dialogRegion.show(view);

      return defer.promise;
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
    },

    showInfo: function(message, title) {
      var defer = new Cairo.Promises.Defer();

      title = title || "Info"; // TODO: use Language.getText

      var view = Cairo.infoView(
        title,
        message,
        function(ignore) { defer.resolve(true); }
      );
      Cairo.dialogRegion.show(view);

      return defer.promise;
    },

    showInfoWithFalse: function(message, title) {
      return this.showInfo(message, title).then(function() { return false; });
    },

    showWarning: this.showInfo,

    showWarningWithFail: function(message, title) {
      return this.showWarning(message, title).then(Cairo.Promises.fail);
    },

    showWarningWithFalse: function(message, title) {
      return this.showWarning(message, title).then(function() { return false; });
    }

  };

}());