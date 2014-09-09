(function() {
  "use strict";

  Cairo.Promise = function () {
    this.okCallbacks = [];
    this.koCallbacks = [];
  };

  Cairo.Promise.prototype = {
    okCallbacks: null,
    koCallbacks: null,
    status: 'pending',
    error: null,

    then: function (okCallback, koCallback) {
      var defer = new Cairo.Defer();

      // Add callbacks to the arrays with the defer binded to these callbacks
      this.okCallbacks.push({
        func: okCallback,
        defer: defer
      });

      if (koCallback) {
        this.koCallbacks.push({
          func: koCallback,
          defer: defer
        });
      }

      // Check if the promise is not pending. If not call the callback
      if (this.status === 'resolved') {
        this.executeCallback({
            func: okCallback,
            defer: defer
          }, 
          this.data);
      }
      else if(this.status === 'rejected') {
        this.executeCallback({
            func: koCallback,
            defer: defer
          }, 
          this.error);
      }

      return defer.promise;
    },

    executeCallback: function (callbackData, result) {
      window.setTimeout(function () {
        var res = callbackData.func(result);
        if (res instanceof Cairo.Promise) {
          callbackData.defer.bind(res);
        }
        else {
          callbackData.defer.resolve(res);
        }
      }, 0);
    }
  };

  Cairo.Defer = function () {
    this.promise = new Cairo.Promise();
  };

  Cairo.Defer.prototype = {
    promise: null,
    resolve: function (data) {
      var promise = this.promise;
      promise.data = data;
      promise.status = 'resolved';
      promise.okCallbacks.forEach(function(callbackData) {
        promise.executeCallback(callbackData, data);
      });
    },

    reject: function (error) {
      var promise = this.promise;
      promise.error = error;
      promise.status = 'rejected';
      promise.koCallbacks.forEach(function(callbackData) {
        promise.executeCallback(callbackData, error);
      });
    },

    // Make this promise behave like another promise:
    // When the other promise is resolved/rejected this is also resolved/rejected
    // with the same data
    bind: function (promise) {
      var that = this;
      promise.then(
        function (res) { that.resolve(res); }, 
        function (err) { that.reject(err); }
      );
    }
  };

}());