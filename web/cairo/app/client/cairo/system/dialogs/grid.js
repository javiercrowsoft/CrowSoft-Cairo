(function() {
  "use strict";

  /*
      this module manages a grid control ...
  */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Dialogs.Grids", function(Grids, Cairo, Backbone, Marionette, $, _) {

    Grids.Manager = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
      },

      loadFromRows: function(gridControl, grid, noChangeColumns, name) { /* TODO: implement this. */ },
      loadFromRow: function(gridControl, row, rowIndex, columns) { /* TODO: implement this. */ },
      setColumnProperties: function(grid, column, colGrid) { /* TODO: implement this. */ },
      saveColumnWidth: function(grid, name) { /* TODO: implement this. */ },
      saveColumnOrder: function(grid, name) { /* TODO: implement this. */ },
      setProperties: function(grid) { /* TODO: implement this. */ }

    });

    Grids.VirtualRow = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
        result: false,
        info: null,
        rowsToAdd: 0
      },

      getRowsToAdd: function() { return this.rowsToAdd; },
      getColAmount: function() { /* TODO: implement this. */ },
      getNewValue: function(rowIndex) { /* TODO: implement this. */ },
      getNewId: function(rowIndex) { /* TODO: implement this. */ },
      getNewAmount: function(rowIndex) { /* TODO: implement this. */ },
      loadFromRow: function(gridControl, row, rowIndex, columns) { /* TODO: implement this. */ },
      setColumnProperties: function(grid, column, colGrid) { /* TODO: implement this. */ },
      getNoSelectInGotFocus: function(grid, column, colGrid) { /* TODO: implement this. */ }

    });

    Grids.CellFormat = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
      },

      getType: function() { /* TODO: implement this. */ },
      getSubType: function() { /* TODO: implement this. */ },
      getSelectTable: function() { /* TODO: implement this. */ },
      getEnabled: function() { /* TODO: implement this. */ },
      getSelectFilter: function() { /* TODO: implement this. */ },
      getSize: function() { /* TODO: implement this. */ },
      getFormat: function() { /* TODO: implement this. */ },

      setType: function() { /* TODO: implement this. */ },
      setSubType: function() { /* TODO: implement this. */ },
      setSelectTable: function() { /* TODO: implement this. */ },
      setEnabled: function() { /* TODO: implement this. */ },
      setSelectFilter: function() { /* TODO: implement this. */ },
      setSize: function() { /* TODO: implement this. */ },
      setFormat: function() { /* TODO: implement this. */ },

      getColor: function() { /* TODO: implement this. */ },
      getBackColor: function() { /* TODO: implement this. */ },
      getTextAlign: function() { /* TODO: implement this. */ },
      getFontName: function() { /* TODO: implement this. */ },
      getBold: function() { /* TODO: implement this. */ },
      getFontSize: function() { /* TODO: implement this. */ },
      getStrike: function() { /* TODO: implement this. */ },
      getUnderline: function() { /* TODO: implement this. */ },
      getItalic: function() { /* TODO: implement this. */ }

    });

    Grids.Cell = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
        format: null /* is a Grids.CellFormat object */
      },

      getKey: function() { /* TODO: implement this. */ }

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
      getDefaultValue: function() { /* TODO: implement this. */ },

      getType: function() { /* TODO: implement this. */ },
      getSubType: function() { /* TODO: implement this. */ },
      getSelectTable: function() { /* TODO: implement this. */ },
      getEnabled: function() { /* TODO: implement this. */ },
      getSelectFilter: function() { /* TODO: implement this. */ },
      getSize: function() { /* TODO: implement this. */ },
      getFormat: function() { /* TODO: implement this. */ },

      setType: function() { /* TODO: implement this. */ },
      setSubType: function() { /* TODO: implement this. */ },
      setSelectTable: function() { /* TODO: implement this. */ },
      setEnabled: function() { /* TODO: implement this. */ },
      setSelectFilter: function() { /* TODO: implement this. */ },
      setSize: function() { /* TODO: implement this. */ },
      setFormat: function() { /* TODO: implement this. */ }

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

      get: function(col) { /* TODO: implement this. */ },

      getHaveKey: function() { /* TODO: implement this. */ },
      setHaveKey: function(haveKey) { /* TODO: implement this. */ }

    });

    Grids.Rows = Backbone.Collection.extend({
      url: "",

      model: Grids.Row,
      comparator: "index"
    });

    Grids.Grid = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
        columns: new Grids.Columns(),
        rows:    new Grids.Rows()
      },

      getColumns: function() { /* TODO: implement this. */ },
      getRows: function() { /* TODO: implement this. */ },
      setRows: function(rows) { /* TODO: implement this. */ },
      getRowMode: function() { /* TODO: implement this. */ },
      getNoResize: function() { /* TODO: implement this. */ },
      setNoResizeHeight: function() { /* TODO: implement this. */ }

    });


  });

}());