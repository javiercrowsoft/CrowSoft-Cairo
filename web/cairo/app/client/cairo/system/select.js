Cairo.module("Select", function(Select, Cairo, Backbone, Marionette, $, _) {

  /*
      implements a type ahead control which shows a table grid
  */

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

			var throttledRequest = _.debounce(function(query, process) {
			  var url = source.replace("{{filter}}", encodeURIComponent(query));
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
						process(listKeys);
					}
				});
			}, 300);


			$(selector).typeahead({
				source: function (query, process) {
					throttledRequest(query, process);
				},

        highlighter: function(item) {
          var data = listData[item];
          var row = '<div>'
          _.each(data.values, function(item, ix, list) {
            row +=  item + '<br>';
          });
          row += '</div>';
          return row;
        },

				updater: function (key) {
					$(selector).attr("data-select-id", listData[key].id);
					return listData[key].text;
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