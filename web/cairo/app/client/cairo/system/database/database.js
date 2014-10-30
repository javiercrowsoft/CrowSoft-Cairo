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
        return p > 0 ? query.substring(0, p-1) : "";
      };

      var getPath = function() {
        var p1 = query.indexOf("[");
        var p2 = query.indexOf("]");
        return p1 > 0 && p2 > 1 ? query.substring(p1+1, p2) : "";
      };

      var rp = Cairo.Promises.resolvedPromise;
      var action = getAction();

      if(action === "load") {
        var path = getPath();
        if(path === "") {
          rp({success: false, message: "Invalid query: Path not defined."});
        }
        else {
          var q = new Cairo.Entities.DatabaseQuery({id: id});
          q.urlRoot = path;
          var defer = new Cairo.Promises.Defer();
          q.fetch({
            success: function(data) {
              defer.resolve(data);
            }
          });
          return defer.promise;
        }
      }
      else if(action === "") {
        rp({success: false, message: "Invalid query: Action not defined."});
      }
      else {
        rp({success: false, message: "Invalid query: Action [" + action + "] not supported."});
      }
    },

    valField: function(fields, fieldName) {},

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