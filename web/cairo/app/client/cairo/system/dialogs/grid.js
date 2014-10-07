(function() {
  "use strict";

  /*
      this module manages a grid control ...
  */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Entities.Dialogs.Grids", function(Grids, Cairo, Backbone, Marionette, $, _) {

    Grids.Manager = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
      },

      loadFromRows: function(gridControl, grid, noChangeColumns, name) { /* TODO: implement this. */ },
      setColumnProperties: function(grid, column, colGrid) { /* TODO: implement this. */ }

    });

    Grids.CellFormat = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
      },

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
      }

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

      setValue: function(value) { /* TODO: implement this. */ }

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
      setRows: function(rows) { /* TODO: implement this. */ }

    });


  });

}());