(function() {
  "use strict";

  Cairo.module("Select", function(Select, Cairo, Backbone, Marionette, $, _) {
    "use strict";

    ///////////////
    // Entities
    ///////////////

    Cairo.module("Entities", function(Entities, Cairo, Backbone, Marionette, $, _) {

        Entities.Select = {};

        Entities.Select.SelectType = {
          normal: 0,
          tree: 1
        };

    });

    /*
        implements an auto complete control which shows a table grid
    */
    var createAutoCompleteControl = function() {
      $.widget('custom.cautocomplete', $.ui.autocomplete, {
          _renderMenu: function(ul, items) {
              var self = this;

              /*
                  jQuery UI requires that "items" has to be an array of objects {label, value}
                  and that is not what we want.

                  we create items as an array of only one element with have an object with four
                  properties {label, value, columns, rows}. the label and value properties aren't
                  used.

              */

              // it is used in _renderItem
              self.options.columns = items[0].columns;

              if(items[0].rows.length === 0) {
                ul.append($('<div class="select-empty-result-message" style="width:100%">There isn&apos;t any rows using this filter: ' + this.element.val() + '</div>'));
              }
              else {
                if(self.options.showHeader) {
                    var table = $('<div class="ui-widget-header select-header" style="width:100%"></div>');
                    // TODO: create a better method to define the size of columns because numeric data should
                    //       get less space than string data
                    //
                    // the first time the ul hasn't set the width property so we use the width of the input
                    //
                    var width = ul.width() === 0 ? self.element.width() : ul.width();
                    width = (width-50) / self.options.columns.length;
                    $.each(items[0].columns, function(index, item) {
                        table.append('<span class="capitalize" style="padding:0 4px;float:left;width:' + width + 'px;">' +
                          item.name + '</span>');
                    });
                    table.append('<div style="clear: both;"></div>');
                    ul.append(table);
                }
                $.each(items[0].rows, function(index, item) {
                    self._renderItem(ul, item);
                });
              }
          },
          _renderItem: function(ul, item) {
              var t = '';
              var result = '';
              // TODO: create a better method to define the size of columns because numeric data should
              //       get less space than string data
              //
              // the first time the ul hasn't set the width property so we use the width of the input
              //
              var width = ul.width() === 0 ? this.element.width() : ul.width();
              width = (width-50) / this.options.columns.length;
              $.each(this.options.columns, function(index, column) {
                  t += '<span style="padding:0 4px;float:left;width:' + width + 'px;">' +
                        item.values[column.valueField ? column.valueField : index] + '</span>';
              });

              result = $('<li></li>').data('ui-autocomplete-item', { value: item.values[0], data: item }).append(
                            '<a class="mcacAnchor">' + t + '<div style="clear: both;"></div></a>').appendTo(ul);
              return result;
          }
      });
    };

    // add the new widget to jQuery
    //
    createAutoCompleteControl();

    var createSelect = function() {

      var getSource = function(tableId, active, useSearch, internalFilter) {
        return "/system/select/rows" +
               "/" + tableId +
               "/{{filter}}" +
               "/" + active +
               "/" + useSearch +
               "/" + internalFilter +
               "/2"; // like: 1 filter% | 2 %filter% | 3 filter.replaceAll(*,%) | 4 %filter
      };

      var getValidateSource = function(tableId, active, internalFilter) {
        return "/system/select/validate" +
               "/" + tableId +
               "/{{text}}" +
               "/{{textId}}" +
               "/" + active +
               "/" + internalFilter;
      };

      var getSearchSource = function(tableId, active, internalFilter) {
        return getSource(tableId, active, true, internalFilter);
      };

      var getSelectSource = function(tableId, active, internalFilter) {
        return getSource(tableId, active, false, internalFilter);
      };

      /*
          @selector:  selector to an html input
          @source:    url to request the list
      */
      var createControl = function(selector, source, validateSource) {

        var selectController = {
          listeners: {
           onUpdate: [],
           onSelect: [],
           onValidate: []
          },
          data: null,
          control: null
        };

        /*
            SELECT

            make an ajax request to get a RowSet using the input text
            in this control (selector) as a query filter

            @request            the input text used as a filter
            @responseCallBack   the function to call when the RowSet arrives

        */
        var throttledRequest = _.debounce(function(request, responseCallBack) {
          var url = source.replace("{{filter}}", encodeURIComponent(request.term));
          Cairo.log("Selecting: " + url);
          $.ajax({
            url: url
            ,cache: false
            ,success: function(data) {
              /*
                  jQuery UI requires that "items" has to be an array of objects {label, value}
                  and that is not what we want.

                  we create items as an array of only one element with have an object with four
                  properties {label, value, columns, rows}. the label and value properties aren't
                  used.

              */
              var items = [{
                label: "-",
                value: "-",
                columns: data.columns,
                rows: data.rows
              }];
              responseCallBack(items);
            }
            ,error: function(request, status, error) {
              Cairo.log("Failed to request a select.");
              Cairo.log(request.responseText);
              Cairo.manageError(
                "Request a Select",
                "Can't request a select for this input. An error has occurred in the server.",
                request.responseText);
            }
          });
        }, 300);

        /*
            VALIDATION

            we validate the input in lost focus

            rules:

            - only validates if there are changes
            - validates even when the input comes from the list

            the last rule needs to be explained:

              there are some cases when the id shown in the list is
              a temporary id and the real id is returned by validate
              look at sp_codigopostalhelp in the check section
        */

        var raiseEvent = function(e) {
          return function(eventListener) {
            if(!e.data) {
              e.data = {
                id: 0,
                values: ['','']
              }
            }
            eventListener(e);
          };
        };

        var hasChanged = function(data) {
          if(selectController.data !== data) {
            if(selectController.data === null
              || data === null
              || selectController.data.id !== data.id
              || selectController.data.values[0] !== data.values[0]
              || selectController.data.values[1] !== data.values[1]) {
              return true;
            }
          }
          return false;
        }

        var refreshNodeSelection = function(data) {
          if(data && data.id && data.id.toString().substring(0, 1) === 'N') {
            selectController.control.addClass("tree-select-control-node");
            selectController.control.parent().find("span").removeClass("hidden");
          }
          else {
            selectController.control.removeClass("tree-select-control-node");
            selectController.control.parent().find("span").addClass("hidden");
          }
        };

        var updateData = function(e) {
          if(hasChanged(e.data)) {
            selectController.data = e.data;
            refreshNodeSelection(e.data);
            _.each(selectController.listeners.onUpdate, raiseEvent(e));
          }
        };

        var raiseOnSelect = function(e) {
          _.each(selectController.listeners.onSelect, raiseEvent(e));
        };

        var raiseOnValidate = function(e) {
          _.each(selectController.listeners.onValidate, raiseEvent(e));
        };

        $(selector).blur(function() {
          var self = this;

          var invalidateData = function(highlight) {
            if(highlight) {
              $(self).addClass("select-invalid-input");
            }
            else {
              $(self).removeClass("select-invalid-input");
            }
            $(self).data("selected-data", null);
            $(self).data("validated-data", null);
          };

          if(self.value.trim() === "" && $(self).data("validated-data")) {
            invalidateData(false);
            raiseOnValidate( { data: $(self).data("validated-data") } );
            updateData( { data: $(self).data("validated-data") } );
          }
          else {

            // we have two data attributes set to track the state of this control:
            //
            // select-data contains a selection from the list
            // validated-data contains the data return by validate
            //
            // only the validated-data is trusted
            //
            // validate is called when:
            //
            //  self.value is not empty and

            //  validated-data is empty
            //  or self.value !== validated-data
            //  or validated-data !== selected-data

            var data = $(self).data("selected-data");
            var validatedData = $(self).data("validated-data");

            var text = data ? data.values[0] : "";
            var textId = data ? data.id : "0";

            var validatedText = validatedData ? validatedData.values[0] : "";
            var validatedTextId = validatedData ? validatedData.id : "0";

            // the same input is validates one time only
            //
            if(self.value !== validatedText || validatedText !== text || validatedTextId !== textId) {

              // this flag prevents a call to select when validating
              //
              $(self).data("validating-data", true);

              // when self.value !== text (which comes from selected-data) the textId value
              // is invalid because it was originated from selected-data
              //
              if(self.value !== text) { textId = "0"; }

              var url = validateSource.replace(
                          "{{text}}",
                          encodeURIComponent(self.value)
                        ).replace(
                          "{{textId}}",
                          encodeURIComponent(textId)
                        );
              Cairo.log("validating: " + url);

              $.ajax({
                url: url
                ,cache: false
                ,success: function(data) {
                  if(data.rows.length > 0) {
                    self.value = data.rows[0].values[0]; // TODO: implement a more powerful mechanism to allow the text
                                                         //       to be set as a combination of columns
                                                         //       which is good for persons ( last name, first name )
                                                         //       or zip codes ( zip code - city, state )
                                                         //       or even general masters like products ( [code] name )
                                                         //
                    $(self).removeClass("select-invalid-input");
                    $(self).data("selected-data", data.rows[0]);
                    $(self).data("validated-data", data.rows[0]);
                  }
                  else {
                    invalidateData(true);
                  }
                  $(self).data("validating-data", null);
                  raiseOnValidate( { data: $(self).data("validated-data") } );
                  updateData( { data: $(self).data("validated-data") } );
                }
                ,error: function(request, status, error) {
                  invalidateData(true);
                  Cairo.log("Failed to validate a select.");
                  Cairo.log(request.responseText);
                  Cairo.manageError(
                    "Select Validate",
                    "Can't validate this input. An error has occurred in the server.",
                    request.responseText);
                  $(self).data("validating-data", null);
                  raiseOnValidate( { data: $(self).data("validated-data") } );
                  updateData( { data: $(self).data("validated-data") } );
                }
              });
            }
          }
        });

        // create the select control
        //
        selectController.control = $(selector)
        selectController.control.cautocomplete({
          showHeader: true,
          source: function(request, responseCallBack) {
            // only call select if validating hasn't been called
            //
            if(this.element.data("validating-data") !== true) {
              throttledRequest(request, responseCallBack);
            }
          },
          select: function(event, ui) {
            $(this).removeClass("select-invalid-input");
            if(ui.item) {
              this.value = ui.item.value;
              $(this).data("selected-data", ui.item.data);
              raiseOnSelect( { data: ui.item.data } );
              updateData( { data: ui.item.data } );
            }
            else {
              this.value = "";
              $(this).data("selected-data", null);
              updateData( { data: null } );
            }
            return false;
          }
        });

        var addListener = function(eventName, functionHandler) {
          switch(eventName) {
            case "onUpdate":
            case "onSelect":
            case "onValidate":
              selectController.listeners[eventName].push(functionHandler);
              break;
            default:
              Cairo.logError(
                'Invalid event listener registration. EventName: '
                  + eventName + ' - Handler: ' + functionHandler.toString());
          }
        };

        var setData = function(id, text, code) {
          var data = id ? { id: id, values: [text || "", code || ""] } : null;

          selectController.control.data("selected-data", data);
          selectController.control.data("validated-data", data);
          selectController.control.val(data.values[0]);

          updateData({ data: data });
        };

        var setId = function(id) { /* TODO: implement this. */ };
        var setValue = function(value) { /* TODO: implement this. */ };
        var setIntValue = function(value) { /* TODO: implement this. */ };
        var setFieldIntValue = function(field) { /* TODO: implement this. */ };
        var setFilter = function(filter) { /* TODO: implement this. */ };
        var setTable = function(table) { /* TODO: implement this. */ };
        var setEnabled = function(enable) { /* TODO: implement this. */ };

        return {
          addListener: addListener,
          setData: setData,
          setId: setId,
          setValue: setValue,
          setIntValue: setIntValue,
          setFieldIntValue: setFieldIntValue,
          setFilter: setFilter,
          setTable: setTable,
          setEnabled: setEnabled
        };

      };

      /*
          @selector:        selector to an html input
          @tableId:         tbl_id
          @active:          if the list must be filter using the active column
          @internalFilter:  allows to define flags for especial cases
      */
      var createSelectControl = function(selector, tableId, active, internalFilter) {
        return createControl(
          selector,
          getSelectSource(tableId, active, internalFilter),
          getValidateSource(tableId, active, internalFilter)
        );
      };

      var createSearchControl = function(selector, tableId, active, internalFilter) {
        return createControl(
          selector,
          getSearchSource(tableId, active, internalFilter),
          getValidateSource(tableId, active, internalFilter)
        );
      };

      return {
        createSelectControl: createSelectControl,
        createSearchControl: createSearchControl
      };

    };

    Select.Controller = createSelect();
  });

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.Select = Controls.Control.extend({
      urlRoot: "",

      defaults: {},

      htmlTag: '<div class="tree-select-control cf"></div>',

      name: "",
      value: "",
      id: Cairo.Database.NO_ID,
      intValue: "",
      fieldIntValue: "",
      filter: "-",
      table: Cairo.Database.NO_ID,
      enabled: true,
      type: Cairo.Entities.Select.SelectType.normal,
      noUseActive: false,

      setElement: function(element) {
        var select = null;

        Controls.Input.__super__.setElement(element);
        element.val(this.value);

        if(this.type === Cairo.Entities.Select.SelectType.tree) {
          element.append('<span class="tree-select-control-folder-icon hidden"><i class="glyphicon glyphicon-folder-open"></i></span>');
        }
        var input = $('<input type="text" class="dialog-control dialog-input-control" autocomplete="off"/>');
        element.append(input);

        if(this.type === Cairo.Entities.Select.SelectType.normal) {
          element.append('<button>+</button>');
          select = Cairo.Select.Controller.createSelectControl(
            input,
            this.table,
            this.noUseActive === false,
            this.filter);
        }
        else if (this.type === Cairo.Entities.Select.SelectType.tree) {
          element.append('<button>...</button>');
          select = Cairo.TreeSelect.Controller.createSelectControl(
            input,
            this.table,
            this.noUseActive === false,
            this.filter,
            this.name,
            "Select a " + this.name);
        }
        select.setData(this.id, this.value);
      },

      setValue: function(value) {
        this.value = value;
      },
      getValue: function() {
        return this.value;
      },

      setName: function(name) {
        this.name = name;
      },
      getName: function() {
        return this.name;
      },

      getId: function() {
        return this.id;
      },
      setId: function(id) {
        this.id = id;
      },

      getIntValue: function() {
        return this.intValue;
      },
      setIntValue: function(value) {
        this.intValue = value;
      },

      setFieldIntValue: function(field) {
        this.fieldIntValue = field;
      },
      setFilter: function(filter) {
        this.filter = filter !== "" ? filter : "-";
      },
      setTable: function(table) {
        this.table = table;
      },
      setEnabled: function(enabled) {
        this.enabled = enabled;
      },

      getSelectType: function() {
        return this.type;
      },
      setSelectType: function(type) {
        this.type = type;
      },

      setSelectNoUseActive: function(noUseActive) {
        this.noUseActive = noUseActive;
      },

      reset: function() { /* TODO: implement this. */ }

    });

    Controls.createSelect = function() {

      var self = {
        objectType: "cairo.controls.select"
      };

      var that = new Controls.Select();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;

    };

  });

}());