(function() {
  "use strict";

  /*
      this module manages a grid control ...
  */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Dialogs.Grids", function(Grids, Cairo, Backbone, Marionette, $, _) {

    var createManager = function() {
      
      var that = {};
      
      that.loadFromRows = function(gridControl, grid, noChangeColumns, name) { /* TODO = implement this. */ };
      that.loadFromRow = function(gridControl, row, rowIndex, columns) { /* TODO = implement this. */ };
      that.setColumnProperties = function(grid, column, colGrid) { /* TODO = implement this. */ };
      that.saveColumnWidth = function(grid, name) { /* TODO = implement this. */ };
      that.saveColumnOrder = function(grid, name) { /* TODO = implement this. */ };
      that.setProperties = function(grid) { /* TODO = implement this. */ };

      return that;
      
    };
    
    Grids.Manager = createManager();

    Grids.createVirtualRow = function() {
      
      var self = {
        result: false,
        info: null,
        rowsToAdd: 0
      };

      var that = {};

      that.getRowsToAdd = function() {
        return self.rowsToAdd;
      };

      that.getColAmount = function() { /* TODO = implement this. */ };
      that.getNewValue = function(rowIndex) { /* TODO = implement this. */ };
      that.getNewId = function(rowIndex) { /* TODO = implement this. */ };
      that.getNewAmount = function(rowIndex) { /* TODO = implement this. */ };
      that.loadFromRow = function(gridControl, row, rowIndex, columns) { /* TODO = implement this. */ };
      that.setColumnProperties = function(grid, column, colGrid) { /* TODO = implement this. */ };
      that.getNoSelectInGotFocus = function(grid, column, colGrid) { /* TODO = implement this. */ }

      return that;
    };

    Grids.createCellFormat = function() {

      var self = {
        
      };

      var that = {};

      that.getType =  function() { /* TODO =  implement this. */ };
      that.getSubType =  function() { /* TODO =  implement this. */ };
      that.getSelectTable =  function() { /* TODO =  implement this. */ };
      that.getEnabled =  function() { /* TODO =  implement this. */ };
      that.getSelectFilter =  function() { /* TODO =  implement this. */ };
      that.getSize =  function() { /* TODO =  implement this. */ };
      that.getFormat =  function() { /* TODO =  implement this. */ };

      that.setType =  function() { /* TODO =  implement this. */ };
      that.setSubType =  function() { /* TODO =  implement this. */ };
      that.setSelectTable =  function() { /* TODO =  implement this. */ };
      that.setEnabled =  function() { /* TODO =  implement this. */ };
      that.setSelectFilter =  function() { /* TODO =  implement this. */ };
      that.setSize =  function() { /* TODO =  implement this. */ };
      that.setFormat =  function() { /* TODO =  implement this. */ };

      that.getColor =  function() { /* TODO =  implement this. */ };
      that.getBackColor =  function() { /* TODO =  implement this. */ };
      that.getTextAlign =  function() { /* TODO =  implement this. */ };
      that.getFontName =  function() { /* TODO =  implement this. */ };
      that.getBold =  function() { /* TODO =  implement this. */ };
      that.getFontSize =  function() { /* TODO =  implement this. */ };
      that.getStrike =  function() { /* TODO =  implement this. */ };
      that.getUnderline =  function() { /* TODO =  implement this. */ };
      that.getItalic =  function() { /* TODO =  implement this. */ }

      return that;
    };

    Grids.createCell = function() {

      var self = {
        format: null /* is a Grids.CellFormat object */
      };

      var that = {};
      
      that.getKey = function() { /* TODO: implement this. */ };
      
      return that;
    };

    Grids.createCells = function() {
      return Cairo.Collections.createCollection(Grids.createCell);
    };

    Grids.createColumn = function() {

      var self = {
        key:     0,
        name:    '',

        type:    null,
        subType: null,

        defaultValue: null /* is a Grids.Cell object */
      };

      var that = {};

      that.setDefaultValue = function(value) {
        self.defaultValue = value;
      };

      that.getDefaultValue = function() {
        return self.defaultValue;
      };

      that.getType = function() {
        return self.type;
      };
      that.setType = function(type) {
        self.type = type;
      };
      
      that.getSelectTable = function() { /* TODO: implement this. */ };
      that.getEnabled = function() { /* TODO: implement this. */ };
      that.getSelectFilter = function() { /* TODO: implement this. */ };
      that.getSize = function() { /* TODO: implement this. */ };
      that.getFormat = function() { /* TODO: implement this. */ };

      that.getSubType = function() {
        return self.subType;
      };
      that.setSubType = function(subType) { 
        self.subType = subType;
      };
      
      that.setSelectTable = function() { /* TODO: implement this. */ };
      that.setEnabled = function() { /* TODO: implement this. */ };
      that.setSelectFilter = function() { /* TODO: implement this. */ };
      that.setSize = function() { /* TODO: implement this. */ };
      that.setFormat = function() { /* TODO: implement this. */ };

      return that;
    };

    Grids.createColumns = function() {
      return Cairo.Collections.createCollection(Grids.createColumn);
    };

    Grids.createRow = function() {

      var self = {
        cells: Grids.createCells(),
        isGroup: false,
        haveKey: false
      };

      var that = {};

      that.getIsGroup = function() {
        return self.isGroup;
      };

      that.setIsGroup = function(isGroup) {
        self.isGroup = isGroup;
      };

      that.get = function(col) {
        return self.cells.get(col);
      };

      that.getHaveKey = function() {
        return self.haveKey;
      };

      that.setHaveKey = function(haveKey) {
        self.haveKey = haveKey;
      };

      return that;
    };

    Grids.createRows = function() {
      return Cairo.Collections.createCollection(Grids.createRow);
    };

    Grids.createGrid = function() {

      var self = {
        columns: Grids.createColumns(),
        rows: Grids.createRows()
      };

      var that = {};

      that.getColumns = function() {
        return self.columns;
      };

      that.getRows = function() {
        return self.rows;
      };

      that.setRows = function(rows) {
        self.rows = rows;
      };

      that.getRowMode = function() { /* TODO: implement this. */ };
      that.getNoResize = function() { /* TODO: implement this. */ };
      that.setNoResizeHeight = function() { /* TODO: implement this. */ }

      return that;
    };

  });

}());