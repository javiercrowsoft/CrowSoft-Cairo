(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Entities.Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    Controls.GridGroup = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
      },

      setName: function(name) { /* TODO: implement this. */ },
      setIndex: function(index) { /* TODO: implement this. */ },
      setKey: function(key) { /* TODO: implement this. */ },
      setSortType: function(type) { /* TODO: implement this. */ },
      setIsSortCol: function(isSortCol) { /* TODO: implement this. */ },
      expandAllGroups: function() { /* TODO: implement this. */ },
      setGridLines: function(gridLines) { /* TODO: implement this. */ }

    });

    Controls.Cell = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
      },

      setItemData: function(data) { /* TODO: implement this. */ },
      getId: function() { /* TODO: implement this. */ },
      setForeColor: function(color) { /* TODO: implement this. */ },
      setBackColor: function(color) { /* TODO: implement this. */ },
      setTextAlign: function(align) { /* TODO: implement this. */ },
      setFont: function(font) { /* TODO: implement this. */ }

    });

    Controls.Grid = Controls.Control.extend({
      urlRoot: "",

      defaults: {
      },

      selectRow: function(row) { /* TODO: implement this. */ },
      autoWidthColumns: function() { /* TODO: implement this. */ },
      getColumns: function() { /* TODO: implement this. */ },
      clearGroups: function() { /* TODO: implement this. */ },
      refreshGroupsAndFormulasEx: function() { /* TODO: implement this. */ },
      clearEx: function() { /* TODO: implement this. */ },
      addGroup: function() { /* TODO: implement this. */ },
      setRedraw: function(redraw) { /* TODO: implement this. */ },
      rowIsGroup: function(row) { /* TODO: implement this. */ },
      setSelectedCol: function(col) { /* TODO: implement this. */ },
      setSelectedRow: function(row) { /* TODO: implement this. */ },
      setRowMode: function(rowMode) { /* TODO: implement this. */ },
      cellText: function(row, col) { /* TODO: implement this. */ },
      setColumnWidth: function(col, width) { /* TODO: implement this. */ },
      cell: function(row, col) { /* TODO: implement this. */ },
      setRowBackColor: function(rowIndex, backColor) { /* TODO: implement this. */ },
      setRowForeColor: function(rowIndex, foreColor) { /* TODO: implement this. */ }

    });

  });

}());