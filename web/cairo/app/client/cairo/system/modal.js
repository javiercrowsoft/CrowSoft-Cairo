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
      var defer = new Cairo.Promises.Defer();

      var view = Cairo.confirmViewWithCancelNoDanger(
        title,
        message,
        function(answer) { defer.resolve(answer); }
      );
      Cairo.dialogRegion.show(view);

      return defer.promise;
    },

    confirmCancelViewYesDanger: function(title, message) {
      var defer = new Cairo.Promises.Defer();

      var view = Cairo.confirmViewWithCancelYesDanger(
        title,
        message,
        function(answer) { defer.resolve(answer); }
      );
      Cairo.dialogRegion.show(view);

      return defer.promise;
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

    confirmViewNoDefault: function(title, message) {
      var defer = new Cairo.Promises.Defer();

      var view = Cairo.confirmViewNoDefault(
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
          defer.resolve(text);
        }
      );

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
      //
      // close the loading message is it is open
      //
      Cairo.LoadingMessage.close();
      //
      // finally show the message
      //
      Cairo.dialogRegion.show(view);

      return defer.promise;
    },

    showInfoWithFalse: function(message, title) {
      return this.showInfo(message, title).then(function() { return false; });
    },

    showWarning: function(message, title) {
      return this.showInfo(message, title);
    },

    showWarningWithFail: function(message, title) {
      return this.showWarning(message, title).then(Cairo.Promises.fail);
    },

    showWarningWithFalse: function(message, title) {
      return this.showWarning(message, title).then(function() { return false; });
    },

    getPasteData: function() {
      // TODO: show a message and request the user to press {ctrl|cmd}+v
      //       below is the code to get the pasted data from the paste event
      //       this function should return pastedData variable
      /*
      var clipboardData, pastedData;

      // Stop data actually being pasted into div
      e.stopPropagation();
      e.preventDefault();

      // Get pasted data via clipboard API
      clipboardData = e.clipboardData || window.clipboardData;
      pastedData = clipboardData.getData('Text');
      */
      return "dummy value";
    }

  };

}());