Cairo.module("Select", function(Select, Cairo, Backbone, Marionette, $, _) {

  /*
      implements an auto complete control which shows a table grid
  */
  var createAutoCompleteControl = function() {
    $.widget('custom.cautocomplete', $.ui.autocomplete, {
        _renderMenu: function(ul, items) {
            var self = this;
            var thead;

            if (this.options.showHeader) {
                table = $('<div class="ui-widget-header" style="width:100%"></div>');
                $.each(items.columns, function(index, item) {
                    table.append('<span style="padding:0 4px;float:left;width:' + item.width + ';">' +
                      item.name + '</span>');
                });
                table.append('<div style="clear: both;"></div>');
                ul.append(table);
            }
            $.each(items.rows, function(index, item) {
                self._renderItem(ul, item);
            });
        },
        _renderItem: function(ul, item) {
            var t = '',
                result = '';

            $.each(this.options.columns, function(index, column) {
                t += '<span style="padding:0 4px;float:left;width:' + column.width + ';">' +
                      item[column.valueField ? column.valueField : index] + '</span>';
            });

            result = $('<li></li>').data('item.autocomplete', item).append(
                          '<a class="mcacAnchor">' + t + '<div style="clear: both;"></div></a>').appendTo(ul);
            return result;
        }
    });
  };

  createAutoCompleteControl();

  var createSelect = function() {

    var getSource = function(tableId, active, useSearch, internalFilter) {
      return "/system/select" +
             "/" + tableId +
             "/{{filter}}" +
             "/" + active +
             "/" + useSearch +
             "/" + internalFilter
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
    var createSelect = function(selector, source) {

      var listData = {};
      var listKeys = [];

      var throttledRequest = _.debounce(function(request, responseCallBack) {
        var url = source.replace("{{filter}}", encodeURIComponent(request.term));
        $.ajax({
          url: url
          ,cache: false
          ,success: function(data) {
            // reset these containers every time the user searches
            // because we're potentially getting entirely different results from the api
            listData = {};
            listKeys = [];

            _.each(data, function(item, ix, list) {
              listKeys.push(item.id);
              listData[item.id] = item;
            });

            //send the array of results to bootstrap for display
            responseCallBack(listKeys);
          }
        });
      }, 300);

      $(selector).cautocomplete({
          showHeader: true,
          source: function (request, responseCallBack) {
              return throttledRequest(request, responseCallBack);
          },
          select: function(event, ui) {
              this.value = (ui.item ? ui.item[0] : '');
              return false;
          }
      });


    };

    /*
        @selector:        selector to an html input
        @tableId:         tbl_id
        @active:          if the list must be filter using the active column
        @internalFilter:  allows to define flags for especial cases
    */
    var createSelectControl = function(selector, tableId, active, internalFilter) {
      createSelect(selector, getSelectSource(tableId, active, internalFilter));
    };

    return { createSelectControl: createSelectControl	};

  };

  Select.Controller = createSelect();
});