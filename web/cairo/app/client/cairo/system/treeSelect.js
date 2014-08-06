Cairo.module("TreeSelect", function(TreeSelect, Cairo, Backbone, Marionette, $, _) {

  var createSelect = function() {

    var createSelectControl = function(selector, tableId, active, internalFilter) {
      Cairo.Select.Controller.createSelectControl(selector, tableId, active, internalFilter);
    };

    return { createSelectControl: createSelectControl	};
  };


  TreeSelect.Controller = createSelect();
});