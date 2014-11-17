(function() {
  "use strict";

  Cairo.module("Controls.Grids", function(Grids, Cairo, Backbone, Marionette, $, _) {

    var createGridGroup = function() {
      var self = {};

      var that = {
        setName: function(name) { /* TODO: implement this. */ },
        setIndex: function(index) { /* TODO: implement this. */ },
        setKey: function(key) { /* TODO: implement this. */ },
        setSortType: function(type) { /* TODO: implement this. */ },
        setIsSortCol: function(isSortCol) { /* TODO: implement this. */ },
        expandAllGroups: function() { /* TODO: implement this. */ }
      };

      return that;
    };

    var createCell = function() {
      var self = {};

      var that = {
        setItemData: function(data) { /* TODO: implement this. */ },
        getId: function() { /* TODO: implement this. */ },
        getKey: function() { /* TODO: implement this. */ },
        setForeColor: function(color) { /* TODO: implement this. */ },
        setBackColor: function(color) { /* TODO: implement this. */ },
        setTextAlign: function(align) { /* TODO: implement this. */ },
        setFont: function(font) { /* TODO: implement this. */ }
      };

      return that;

    };

    var createColumn = function() {
      var self = {
        key:     0,
        name:    '',

        type:    null,
        subType: null,

        default: null /* is a Grids.Cell object */
      };

      var that = {
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
      }

      return that;

    };

    var createRow = function() {
      var self = {
        cells: Cairo.Collections.createCollection(createCell, null)
      };

      var that = {
        getIsGroup: function() { /* TODO: implement this. */ },
        setIsGroup: function(isGroup) { /* TODO: implement this. */ },
        get: function(col) { /* TODO: implement this. */ }
      };

      return that;

    };

    Cairo.Controls.Grids.createRow = createRow;

    var createGrid = function() {
      var self = {};

      var that = Cairo.Controls.createControl();
      
      that.htmlTag = "<table></table>";

      that.selectRow = function(row) { /* TODO = implement this. */ };
      that.autoWidthColumns = function() { /* TODO = implement this. */ };
      that.getColumns = function() { /* TODO = implement this. */ };
      that.getRows = function() { /* TODO = implement this. */ };
      that.clearGroups = function() { /* TODO = implement this. */ };
      that.refreshGroupsAndFormulasEx = function() { /* TODO = implement this. */ };
      that.clearEx = function() { /* TODO = implement this. */ };
      that.addGroup = function() { /* TODO = implement this. */ };
      that.getRedraw = function() { /* TODO = implement this. */ };
      that.setRedraw = function(redraw) { /* TODO = implement this. */ };
      that.rowIsGroup = function(row) { /* TODO = implement this. */ };
      that.setSelectedCol = function(col) { /* TODO = implement this. */ };
      that.setSelectedRow = function(row) { /* TODO = implement this. */ };
      that.setRowMode = function(rowMode) { /* TODO = implement this. */ };
      that.cellText = function(row, col) { /* TODO = implement this. */ };
      that.setColumnWidth = function(col, width) { /* TODO = implement this. */ };
      that.cell = function(row, col) { /* TODO = implement this. */ };
      that.setRowBackColor = function(rowIndex, backColor) { /* TODO = implement this. */ };
      that.setRowForeColor = function(rowIndex, foreColor) { /* TODO = implement this. */ };
      that.setMultiSelect = function(multiSelect) { /* TODO = implement this. */ };
      that.setGridLines = function(gridLines) { /* TODO = implement this. */ };
      that.setAddEnabled = function(enabled) { /* TODO = implement this. */ };
      that.setEditEnabled = function(enabled) { /* TODO = implement this. */ };
      that.setDeleteEnabled = function(enabled) { /* TODO = implement this. */ };
      that.unSelectRow = function(row) { /* TODO = implement this. */ };
      that.setNoSelectInGotFocus = function(value) { /* TODO = implement this. */ }

      return that;

    };

    Cairo.Controls.createGrid = function() {

      var self = {
        objectType: "cairo.controls.grid"
      };

      var that = createGrid();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;

    };

  });

}());