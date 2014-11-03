(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Controls.Grids", function(Grids, Cairo, Backbone, Marionette, $, _) {

    Grids.GridGroup = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
      },

      setName: function(name) { /* TODO: implement this. */ },
      setIndex: function(index) { /* TODO: implement this. */ },
      setKey: function(key) { /* TODO: implement this. */ },
      setSortType: function(type) { /* TODO: implement this. */ },
      setIsSortCol: function(isSortCol) { /* TODO: implement this. */ },
      expandAllGroups: function() { /* TODO: implement this. */ }

    });

    Grids.Cell = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
      },

      setItemData: function(data) { /* TODO: implement this. */ },
      getId: function() { /* TODO: implement this. */ },
      getKey: function() { /* TODO: implement this. */ },
      setForeColor: function(color) { /* TODO: implement this. */ },
      setBackColor: function(color) { /* TODO: implement this. */ },
      setTextAlign: function(align) { /* TODO: implement this. */ },
      setFont: function(font) { /* TODO: implement this. */ }

    });

    Grids.Cells = Backbone.Collection.extend({
      url: "",

      model: Grids.Cell,
      comparator: "index"
    });

    Grids.Column = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
        key:     0,
        name:    '',

        type:    null,
        subType: null,

        default: null /* is a Grids.Cell object */
      },

      setValue: function(value) { /* TODO: implement this. */ },

      getType: function() { /* TODO: implement this. */ },
      getSubType: function() { /* TODO: implement this. */ },
      getSelectTable: function() { /* TODO: implement this. */ },
      getSelectFilter: function() { /* TODO: implement this. */ },
      getSize: function() { /* TODO: implement this. */ },
      getFormat: function() { /* TODO: implement this. */ },

      setType: function() { /* TODO: implement this. */ },
      setSubType: function() { /* TODO: implement this. */ },
      setSelectTable: function() { /* TODO: implement this. */ },

      // TODO: check if Enabled and EditEnabled aren't redundant
      getEnabled: function() { /* TODO: implement this. */ },
      setEnabled: function() { /* TODO: implement this. */ },
      getEditEnabled: function() { /* TODO: implement this. */ },
      setEditEnabled: function(enabled) { /* TODO: implement this. */ },

      setSelectFilter: function() { /* TODO: implement this. */ },
      setSize: function() { /* TODO: implement this. */ },
      setFormat: function() { /* TODO: implement this. */ },
      setList: function(list) { /* TODO: implement this. */ }

    });

    Grids.Columns = Backbone.Collection.extend({
      url: "",

      model: Grids.Column,
      comparator: "index"
    });

    Grids.Row = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
        cells: new Grids.Cells()
      },

      getIsGroup: function() { /* TODO: implement this. */ },
      setIsGroup: function(isGroup) { /* TODO: implement this. */ },
      get: function(col) { /* TODO: implement this. */ }

    });

    Grids.Rows = Backbone.Collection.extend({
      url: "",

      model: Grids.Row,
      comparator: "index",

      setCount: function(count) { /* TODO: implement this. */ },
      count: function(count) { /* TODO: implement this. */ }

    });

    Grids.Grid = Cairo.Controls.Control.extend({
      urlRoot: "",

      defaults: {
      },

      selectRow: function(row) { /* TODO: implement this. */ },
      autoWidthColumns: function() { /* TODO: implement this. */ },
      getColumns: function() { /* TODO: implement this. */ },
      getRows: function() { /* TODO: implement this. */ },
      clearGroups: function() { /* TODO: implement this. */ },
      refreshGroupsAndFormulasEx: function() { /* TODO: implement this. */ },
      clearEx: function() { /* TODO: implement this. */ },
      addGroup: function() { /* TODO: implement this. */ },
      getRedraw: function() { /* TODO: implement this. */ },
      setRedraw: function(redraw) { /* TODO: implement this. */ },
      rowIsGroup: function(row) { /* TODO: implement this. */ },
      setSelectedCol: function(col) { /* TODO: implement this. */ },
      setSelectedRow: function(row) { /* TODO: implement this. */ },
      setRowMode: function(rowMode) { /* TODO: implement this. */ },
      cellText: function(row, col) { /* TODO: implement this. */ },
      setColumnWidth: function(col, width) { /* TODO: implement this. */ },
      cell: function(row, col) { /* TODO: implement this. */ },
      setRowBackColor: function(rowIndex, backColor) { /* TODO: implement this. */ },
      setRowForeColor: function(rowIndex, foreColor) { /* TODO: implement this. */ },
      setMultiSelect: function(multiSelect) { /* TODO: implement this. */ },
      setGridLines: function(gridLines) { /* TODO: implement this. */ },
      setAddEnabled: function(enabled) { /* TODO: implement this. */ },
      setEditEnabled: function(enabled) { /* TODO: implement this. */ },
      setDeleteEnabled: function(enabled) { /* TODO: implement this. */ },
      unSelectRow: function(row) { /* TODO: implement this. */ },
      setNoSelectInGotFocus: function(value) { /* TODO: implement this. */ }

    });

  });

}());