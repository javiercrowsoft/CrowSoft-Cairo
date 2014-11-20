(function() {
  "use strict";

  Cairo.Promises = {};

  Cairo.Promises.Promise = function() {
    this.successCallbacks = [];
    this.errorCallbacks = [];
  };

  Cairo.Promises.Promise.prototype = {
    successCallbacks: null,
    errorCallbacks: null,
    status: 'pending',
    error: null,

    then: function(successCallback, errorCallback) {
      var defer = new Cairo.Promises.Defer();

      // Add callbacks to the arrays with the defer binded to these callbacks
      this.successCallbacks.push({
        func: successCallback,
        defer: defer
      });

      if(errorCallback) {
        this.errorCallbacks.push({
          func: errorCallback,
          defer: defer
        });
      }

      // Check if the promise is not pending. If not call the callback
      if(this.status === 'resolved') {
        this.executeCallback({
            func: successCallback,
            defer: defer
          }, 
          this.data);
      }
      else if(this.status === 'rejected') {
        if(errorCallback) {
          this.executeCallback({
              func: errorCallback,
              defer: defer
            },
            this.error);
        }
      }

      return defer.promise;
    },

    success: function(successCallback, falseReturnValue, errorCallback) {
      return this.then(function(success) {
        if(success) {
          successCallback();
        }
        else {
          return Cairo.isFunction(falseReturnValue) ? falseReturnValue() : falseReturnValue || false;
        }
      }, errorCallback);
    },

    successful: function() {
      return this.then(function(){ return true; });
    },

    executeCallback: function(callbackData, result) {
      window.setTimeout(function() {
        var res = callbackData.func(result);
        if(res instanceof Cairo.Promises.Promise) {
          callbackData.defer.bind(res);
        }
        else {
          callbackData.defer.resolve(res);
        }
      }, 0);
    }
  };

  Cairo.Promises.Defer = function() {
    this.promise = new Cairo.Promises.Promise();
  };

  Cairo.Promises.Defer.prototype = {
    promise: null,
    resolve: function(data) {
      var promise = this.promise;
      promise.data = data;
      promise.status = 'resolved';
      promise.successCallbacks.forEach(function(callbackData) {
        promise.executeCallback(callbackData, data);
      });
    },

    reject: function(error) {
      var promise = this.promise;
      promise.error = error;
      promise.status = 'rejected';
      promise.errorCallbacks.forEach(function(callbackData) {
        promise.executeCallback(callbackData, error);
      });
    },

    // Make this promise behave like another promise:
    // When the other promise is resolved/rejected this is also resolved/rejected
    // with the same data
    bind: function(promise) {
      var that = this;
      promise.then(
        function(res) { that.resolve(res); }, 
        function(err) { that.reject(err); }
      );
    }
  };

  Cairo.Promises.resolvedPromise = function(result) {
    var defer = new Cairo.Promises.Defer();
    defer.resolve(result);
    return defer.promise;
  };

}());