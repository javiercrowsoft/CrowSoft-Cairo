(function() {
  "use strict";

  /*
      this module manages a grid control ...
  */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Entities.Dialogs.Grids", function(Grid, Cairo, Backbone, Marionette, $, _) {

    Grids.Manager = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
      }

    });

    Grids.CellFormat = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
      }

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
        default: null /* is a Grids.Cell object */
      }

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
      }

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
      }

    });


  });

}());