(function() {
  "use strict";

///////////////
  // Entities
  ///////////////

  Cairo.module("Entities", function(Entities, Cairo, Backbone, Marionette, $, _) {

    Entities.DatabaseQuery = Backbone.Model.extend({ });

  });

  Cairo.Database = {

    getAPIVersion: function() {
      return "/api/v1/";
    },

    saveEx: function() { /* TODO: implement this. */ },
    execute: function() { /* TODO: implement this. */ },

    getData: function(query, id) {
      var getAction = function() {
        var p = query.indexOf("[");
        return p > 0 ? query.substring(0, p) : "";
      };

      var getPath = function() {
        var p1 = query.indexOf("[");
        var p2 = query.indexOf("]");
        return p1 > 0 && p2 > 1 ? query.substring(p1+1, p2) : "";
      };

      var p = null;
      var rp = Cairo.Promises.resolvedPromise;
      var action = getAction();

      if(action === "load") {
        var path = getPath();
        if(path === "") {
          p = rp({success: false, message: "Invalid query: Path not defined."});
        }
        else {
          var q = new Cairo.Entities.DatabaseQuery({id: id});
          q.urlRoot = path;
          var defer = new Cairo.Promises.Defer();
          q.fetch({
            success: function(data) {
              defer.resolve({success: true, data: data});
            },
            error: function(data, response) {
              if(response.status === 401) {
                Cairo.infoViewShow("Unauthorized", "The server has denied access to this action.")
              }
              else if(response.status === 500) {
                Cairo.manageError(
                  "Server Request [Get Data]",
                  "Can't get data for query:[ " + query + " id: " + id.toString() + " ]. An error has occurred in the server.",
                  response.responseText);
              }
              defer.resolve({success: false, data: data, response: response});
            }
          });
          p = defer.promise;
        }
      }
      else if(action === "") {
        p = rp({success: false, message: "Invalid query: Action not defined."});
      }
      else {
        p = rp({success: false, message: "Invalid query: Action [" + action + "] not supported."});
      }
      return p;
    },

    valField: function(fields, fieldName) {
      return fields.get(fieldName);
    },

    Register: function() {
      var fieldId, table, id;
      var fields = [];

      this.getFields = {
        add: function(name, value, type) {
          fields.push({name: name, value: value, type: type});
        }
      };

      this.setFieldId = function(fieldId) { this.fieldId = fieldId; }
      this.setTable = function(table) { this.table = table; }
      this.setId = function(id) { this.id = id; }
    }

  };

}());