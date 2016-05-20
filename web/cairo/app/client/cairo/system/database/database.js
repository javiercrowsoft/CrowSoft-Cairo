(function() {
  "use strict";

///////////////
  // Entities
  ///////////////

  Cairo.module("Entities", function(Entities, Cairo, Backbone, Marionette, $, _) {

    Entities.DatabaseQuery = Backbone.Model.extend({ });

  });

  var T = Cairo.Constants.Types;
  var val = Cairo.Util.val;
  var NO_ID = Cairo.Constants.NO_ID;

  var getErrorsObject = function(errors) {
    if(errors !== undefined) {
      errors.getMessage = function() {
        var trimMessage = function(message) {
          if(message.slice(-2) === "..") {
            message = message.substring(0, message.length -1);
          }
          return message.trim();
        };
        return errors.message ? trimMessage(errors.message) : "";
      }
    }
    return errors;
  };
  
  Cairo.Database = {

    getAPIVersion: function() {
      return "/api/v1/";
    },

    saveEx: function(register, isNew, codeField, functionName, module, title) {
      var p = null;
      if(register.getPath() === "") {
        p = Cairo.Promises.resolvedPromise({success: false, message: "Invalid query: Path not defined."});
      }
      else {
        var id = register.getId();
        var options = id !== NO_ID ? {id: register.getId()} : {};
        var q = new Cairo.Entities.DatabaseQuery(options);
        var fields = register.getFields().asObject();
        q.urlRoot = register.getPath();
        var defer = new Cairo.Promises.Defer();
        q.save(fields, {
          wait: true,
          success: function(data) {
            Cairo.log("Successfully saved!");
            register.setId(data.get("id"));
            register.setData(data);
            defer.resolve({success: true, data: register, errors: getErrorsObject(data.get("errors"))});
          },
          error: function(data, response) {
            Cairo.log("Failed in saveEx: " + module + "." + functionName + ".");
            Cairo.log(response.responseText);
            Cairo.manageError(
              "Saving",
              "Can't save this record. An error has occurred in the server.",
              response.responseText).then(function() {
                defer.resolve({success: false, data: data, response: response});
              });
          }
        });
        p = defer.promise;
      }
      return p;
    },

    save: function(register, isNew, functionName, module, title) {
      return this.saveEx(register, isNew, "", functionName, module, title);
    },

    saveTransaction: function(register, isNew, codeField, functionName, module, title) {
      return this.saveEx(register, isNew, codeField, functionName, module, title);
    },

    execute: function() { /* TODO: implement this. */ },

    destroy: function(path, id, module, functionName) {
      var p = null;
      if(path === "" || path === undefined) {
        p = Cairo.Promises.resolvedPromise({success: false, message: "Invalid query: Path not defined."});
      }
      else {
        if(id === NO_ID || id === undefined) {
          p = Cairo.Promises.resolvedPromise({success: false, message: "Invalid query: Id not undefined."});
        }
        else {
          var q = new Cairo.Entities.DatabaseQuery({id: id});
          q.urlRoot = path;
          var defer = new Cairo.Promises.Defer();
          q.destroy({
            wait: true,
            success: function(data) {
              Cairo.log("Successfully deleted!");
              defer.resolve({success: true});
            },
            error: function(data, response) {
              Cairo.log("Failed in destroy: " + module + "." + functionName + ".");
              Cairo.log(response.responseText);
              Cairo.manageError(
                "Deleting",
                "Can't delete this record. An error has occurred in the server.",
                response.responseText).then(function() {
                  defer.resolve({success: false, data: data, response: response});
                });
            }
          });
          p = defer.promise;
        }
      }
      return p;
    },

    getData: function(query, id, params) {
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
          var q;
          if(id !== undefined && id !== null) {
            q = new Cairo.Entities.DatabaseQuery({id: id});
            q.urlRoot = path;
          }
          else {
            q = new Cairo.Entities.DatabaseQuery({});
            q.url = path;
          }

          var urlToRequest = "";
          if(Cairo.isFunction(q.url)) {
            urlToRequest = q.url();
          }
          else {
            urlToRequest = q.url;
          }
          Cairo.log('requesting: ' + urlToRequest);

          var defer = new Cairo.Promises.Defer();
          q.fetch({
            success: function(data) {
              defer.resolve({success: true, data: data});
            },
            error: function(data, response) {
              var p;
              if(response.status === 400) {
                p = Cairo.Modal.showWarning("Bad Request.<br>" + urlToRequest, "The server has rejected the request because it is bad formed");
              }
              else if(response.status === 401) {
                p = Cairo.Modal.showWarning("Unauthorized", "The server has denied access to this action.");
              }
              else if(response.status === 500) {
                p = Cairo.manageError(
                  "Server Request [Get Data]",
                  "Can't get data for query:[ " + query + (id ? " id: " + id.toString() : "") + " ]. An error has occurred in the server.",
                  response.responseText);
              }
              else if(response.status === 404) {
                p = Cairo.manageError(
                  "Server Request [Get Data]",
                  "Can't get data for query:[ " + query + (id ? " id: " + id.toString() : "") + " ]. The server response the requested API doesn't exists.",
                  response.responseText);
              }
              else {
                p = Cairo.Promises.resolvedPromise(false);
              }
              p.then(function() {
                defer.resolve({success: false, data: data, response: response});
              });
            },
            data: (params !== undefined ? $.param(params) : undefined)
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

      /*
       *
       * DEBUG - REMOVE WHEN IN PRODUCTION
       *
       *
       *     p = p.then(Cairo.Promises.throttle);
       *
       *
       * */

      return p;
    },

    valField: function(fields, fieldName) {
      if(fieldName === undefined) {
        Cairo.raiseError("Missing fieldName", "the fieldName can't be undefined when calling to valField");
      }
      var value = typeof(fieldName) !== "number" ? fields.get(fieldName) : fields.values[fieldName];
      if(value === undefined) {
        // Cairo.raiseError("Missing field", "the field " + fieldName + " isn't present in this dataset");
        //
        // in development
        //
        Cairo.log("Missing field: the field " + fieldName + " isn't present in this dataset", true);

        //
        // if the field doesn't exists
        //
        value = "";
      }
      return value;
    },

    getValue: function(object, attribute) {
      if(attribute === undefined) {
        Cairo.raiseError("Missing attribute", "the attribute can't be undefined when calling to getValue");
      }
      var value = object[attribute];
      if(value === undefined) {
        //Cairo.raiseError("Missing field", "the field " + attribute + " isn't present in this dataset");
        //
        // in development
        //
        Cairo.log("Missing field: the field " + attribute + " isn't present in this dataset", true);
      }
      return value;
    },

    getDateValue: function(object, attribute) {
      if(attribute === undefined) {
        Cairo.raiseError("Missing attribute", "the attribute can't be undefined when calling to getDateValue");
      }
      var value = object[attribute];
      if(value === undefined) {
        //Cairo.raiseError("Missing field", "the field " + attribute + " isn't present in this dataset");
        //
        // in development
        //
        Cairo.log("Missing field: the field " + attribute + " isn't present in this dataset", true);
      }
      return new Date(value);
    },

    Register: function() {
      var self = {
        fieldId: "", 
        table: "", 
        id: 0,
        fields: [],
        data: null,
        path: "",
        transactions: []
      };
      
      var fields = {
        add: function(name, value, type) {
          if(name === undefined || value === undefined || type === undefined) {

            var what = "";
            if(name === undefined)
              what = "fieldName";
            else if(value === undefined)
              what = "value";
            else
              what = "type";

            Cairo.raiseError("Missing " + what, "the " + what + " can't be undefined when calling to fields.add");
          }
          self.fields.push({name: name, value: value, type: type});
        },
        asObject: function() {
          var getValue = function(value, type) {
            switch(type) {
              case T.boolean:
                value = value ? true : false;
                break;
              case T.text:
                value = value.toString();
                break;
              case T.dateOrNull:
                if(value !== null) {
                  value = Cairo.Database.sqlDate(value);
                }
                break;
              case T.date:
                value = Cairo.Database.sqlDate(value);
                break;
              case T.integer:
              case T.long:
              case T.single:
              case T.double:
              case T.currency:
                value = val(value);
                break;
            }
            return value;
          };
          var obj = {};
          for(var i = 0, count = self.fields.length; i < count; i += 1) {
            obj[self.fields[i].name] = getValue(self.fields[i].value, self.fields[i].type);
          }
          for(var i = 0, count = self.transactions.length; i < count; i += 1) {
            var items = [];
            var transaction = self.transactions[i];
            for(var j = 0, countj = transaction.getRegistersCount(); j < countj; j += 1) {
              var register = transaction.getRegister(j);
              items.push(register.getFields().asObject());
            }
            var tran = obj[transaction.getTable()] = {};
            tran.items = items;
            tran.deletedList = transaction.getDeletedList();
          }
          return obj;
        }
      };

      var that = {};

      that.getFields = function() {
        return fields;
      };

      that.setFieldId = function(fieldId) {
        self.fieldId = fieldId;
      };

      that.setTable = function(table) {
        self.table = table;
      };

      that.setId = function(id) {
        self.id = id;
      };
      that.getId = function() {
        return self.id;
      };

      that.setPath = function(path) {
        self.path = path;
      };
      that.getPath = function() {
        return self.path;
      };

      that.setData = function(data) {
        self.data = data;
      };
      that.getData = function() {
        return self.data;
      };

      //
      // transactions
      //

      var transactions = {
        add: function(transaction) {
          self.transactions.push(transaction);
        }
      }

      that.addTransaction = function(transaction) {
        transactions.add(transaction);
      };

      return that;
    },

    createTransaction: function createTransaction() {
      var self = {
        table: "",
        deletedList: "",
        registers: []
      };

      var that = {};

      that.addRegister = function(register) {
        self.registers.push(register);
      };

      that.setTable = function(table) {
        self.table = table;
      };
      that.getTable = function() {
        return self.table;
      };

      that.setDeletedList = function(deletedList) {
        self.deletedList = deletedList;
      };
      that.getDeletedList = function() {
        return self.deletedList;
      };

      that.getRegistersCount = function() {
        return self.registers.length;
      };

      that.getRegister = function(index) {
        return self.registers[index];
      };

      return that;
    },

    sqlString: function(string) {
      return "'" + string.toString().replace("'", "''") + "'";
    },

    sqlDate: function(date) {
      // "yyyy-mm-dd'T'HH:mm:ss'Z'";
      return Cairo.Util.getDateValue(date).toISOString();
    },

    sqlNumber: function(number) {
      return val(number);
    },

    getResultSetFromData: function(data) {
      var columns = data.get ? data.get('columns') : data['columns'];
      if(columns === undefined) {
        // Cairo.raiseError("Can't return a result set from this data because it doesn't contain columns");
        //
        // in development
        //
        Cairo.log("Can't return a result set from this data because it doesn't contain columns");
      }
      var rows = data.get ? data.get('rows') : data['rows'];
      if(rows === undefined) {
        // Cairo.raiseError("Can't return a result set from this data because it doesn't contain rows");
        //
        // in development
        //
        Cairo.log("Can't return a result set from this data because it doesn't contain rows");
      }
      var createColumns = function(columns) {
        var cols = {};
        for(var i = 0, count = columns.length; i < count; i += 1) {
          cols[columns[i].name] = i;
        }
        return cols;
      };

      var createRow = function(row, columns) {
        return function(fieldName) {
          return row[columns[fieldName]];
        };
      };

      var createResultSet = function(columns, rows) {
        var cols = createColumns(columns);
        for(var i = 0, count = rows.length; i < count; i += 1) {
          rows[i].get = createRow(rows[i].values, cols);
        }
        return rows;
      };

      return createResultSet(columns, rows);
    }

  };

}());