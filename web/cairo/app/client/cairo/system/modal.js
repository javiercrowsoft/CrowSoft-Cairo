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
    }
  };

}());