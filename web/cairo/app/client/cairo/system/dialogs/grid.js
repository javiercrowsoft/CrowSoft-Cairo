(function() {
  "use strict";

  /*
      this module manages a grid control ...
  */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Dialogs.Grids", function(Grids, Cairo, Backbone, Marionette, $, _) {

    var Dialogs = Cairo.Dialogs;

    var createManager = function() {
      
      var that = {};
      
      that.loadFromRows = function(gridControl, grid, noChangeColumns, name) {

        //
        // during this function the grid's DOM shouldn't be modified
        //
        gridControl.setRedraw(false);

        //
        // columns
        //

        var columns = gridControl.getColumns();

        var createColumn = function(col) {
          var c = columns.add();
          c.setText(col.getName());
          c.setVisible(col.getVisible());
          c.setType(col.getType());
          c.setIsEditable(col.isEditable());
          c.setEnabled(col.getEnabled());

          c.setSelectIntValue(col.getSelectIntValue());
          c.setSelectFieldIntValue(col.getSelectFieldIntValue());
          c.setSelectFilter(col.getSelectFilter());
          c.setSelectTable(col.getSelectTable());
          c.setSelectNoUseActive(col.getSelectNoUseActive());
        };

        if(!noChangeColumns || columns.count() !== grid.getColumns().count()) {
          columns.clear();
          grid.getColumns().each(createColumn);
        }

        var createCell = function(cell, index, row) {
          var c = row.getCells().add();
          c.setText(cell.getValue());
        };

        //
        // rows
        //

        var rows = gridControl.getRows();

        var createRow = function(row) {
          var r = rows.add();
          row.getCells().each(createCell, r);
        };

        rows.clear();
        grid.getRows().each(createRow);

        //
        // finally apply changes to the grid's DOM
        //

        gridControl.setRedraw(true);
        gridControl.draw();
      };

      that.loadFromRow = function(gridControl, row, rowIndex, columns) { /* TODO = implement this. */ };
      that.setColumnProperties = function(grid, column, colGrid) { /* TODO = implement this. */ };
      that.saveColumnWidth = function(grid, name) { /* TODO = implement this. */ };
      that.saveColumnOrder = function(grid, name) { /* TODO = implement this. */ };
      that.setProperties = function(grid) { /* TODO = implement this. */ };

      that.setAddEnabled = function(gridControl, enabled) {
        gridControl.setAddEnabled(enabled);
      };

      that.setEditEnabled = function(gridControl, enabled) {
        gridControl.setEditEnabled(enabled);
      };

      that.setDeleteEnabled = function(gridControl, enabled) {
        gridControl.setDeleteEnabled(enabled);
      };

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
        key: 0,
        value: 0,
        id: 0,
        format: null, /* is a Grids.CellFormat object */
        selectIntValue: '',
        _keyCol: ''
      };

      var that = {};

      that.getKeyCol = function() {
        return self._keyCol;
      };
      that.setKeyCol = function(key) {
        self._keyCol = key;
      };

      that.getKey = function() {
        return self.key;
      };
      that.setKey = function(key) {
        self.key = key;
      };

      that.getValue = function() {
        return self.value;
      };
      that.setValue = function(value) {
        self.value = value;
      };

      that.setId = function(id) {
        self.id = id;
      };
      that.getId = function() {
        return self.id;
      };

      that.getSelectIntValue = function() {
        return self.selectIntValue;
      };
      that.setSelectIntValue = function(value) {
        self.selectIntValue = value;
      };
      
      return that;
    };

    Grids.createCells = function() {
      return Cairo.Collections.createCollection(Grids.createCell);
    };

    Grids.createColumn = function() {

      var self = {
        key: 0,
        name: '',

        visible: true,

        type: null,
        subType: null,

        selectId: 0,
        selectFilter: '',
        selectFieldIntValue: '',
        selectIntValue: '',
        selectNoUseActive: false,
        selectType: Cairo.Entities.Select.SelectType.normal,
        selectTable: 0,

        enabled: true,

        list: null, /* is a Dialogs.ListItem */

        width: 0,

        format: "",
        size: 0,

        index: 0,
        isDetail: false,
        isEditable: true,

        defaultValue: null /* is a Grids.Cell object */
      };

      var that = {};

      that.getKey = function() {
        return self.key;
      };
      that.setKey = function(key) {
        self.key = key;
      };
      
      that.getName = function() {
        return self.name;
      };
      that.setName = function(name) {
        self.name = name;
      };

      that.getVisible = function() {
        return self.visible;
      };
      that.setVisible = function(visible) {
        self.visible = visible;
      };

      that.getType = function() {
        return self.type;
      };
      that.setType = function(type) {
        self.type = type;
      };

      that.getSubType = function() {
        return self.subType;
      };
      that.setSubType = function(subType) {
        self.subType = subType;
      };

      // select
      //
      that.getSelectTable = function() {
        return self.selectTable;
      };
      that.setSelectTable = function(table) {
        self.selectTable = table;
      };

      that.getSelectId = function() {
        return self.selectId;
      };
      that.setSelectId = function(id) {
        self.selectId = id;
      };

      that.getSelectIntValue = function() {
        return self.selectIntValue;
      };
      that.setSelectIntValue = function(value) {
        self.selectIntValue = value;
      };

      that.getSelectFieldIntValue = function() {
        return self.selectFieldIntValue;
      };
      that.setSelectFieldIntValue = function(value) {
        self.selectFieldIntValue = value;
      };

      that.getSelectFilter = function() {
        return self.selectFilter;
      };
      that.setSelectFilter = function(filter) {
        self.selectFilter = filter;
      };

      that.getSelectType = function() {
        return self.selectType;
      };
      that.setSelectType = function(type) {
        self.selectType = type;
      };

      that.getSelectNoUseActive = function() {
        return self.selectNoUseActive;
      };
      that.setSelectNoUseActive = function(value) {
        self.selectNoUseActive = value;
      };

      //

      that.getEnabled = function() {
        return self.enabled;
      };
      that.setEnabled = function(enabled) {
        self.enabled = enabled;
      };

      that.getList = function() {
        if(self.list === null) {
          self.list = Cairo.Collections.createCollection(Dialogs.ListItem.createListItem);
        }
        return self.list;
      };

      that.getWidth = function() {
        return self.width;
      };

      that.setWidth = function(width) {
        self.width = width;
      };

      that.getFormat = function() {
        return self.format;
      };
      that.setFormat = function(format) {
        self.format = format;
      };

      that.getSize = function() {
        return self.size;
      };
      that.setSize = function(size) {
        self.size = size;
      };

      that.getIndex = function() {
        return self.index;
      };
      that.setIndex = function(index) {
        self.index = index;
      };

      that.getIsDetail = function() {
        return self.isDetail;
      };
      that.setIsDetail = function(isDetail) {
        self.isDetail = isDetail;
      };

      that.isEditable = function() {
        return self.isEditable;
      };
      that.setIsEditable = function(isEditable) {
        self.isEditable = isEditable;
      };
      
      that.setDefaultValue = function(value) {
        self.defaultValue = value;
      };

      that.getDefaultValue = function() {
        return self.defaultValue;
      };
      
      return that;
    };

    Grids.createColumns = function() {
      return Cairo.Collections.createCollection(Grids.createColumn);
    };

    Grids.createRow = function(index) {

      var self = {
        cells: Grids.createCells(),
        isGroup: false,
        haveKey: false
      };

      var addItemCell = function() {
        var cell = self.cells.add();
        cell.setValue(index);
      };

      addItemCell();

      var clearCells = function(clear) {
        return function() {
          clear();
          addItemCell();
        };
      };

      //
      // the clear of this collection adds an item cell
      // after removing all cells
      //
      self.cells.clear = clearCells(self.cells.clear);

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

      that.add = self.cells.add;

      that.setHaveKey = function(haveKey) {
        self.haveKey = haveKey;
      };

      that.getCells = function() {
        return self.cells;
      };

      return that;
    };

    Grids.createRows = function() {
      return Cairo.Collections.createCollection(Grids.createRow);
    };

    Grids.createGrid = function() {

      var self = {
        columns: Grids.createColumns(),
        rows: Grids.createRows(),
        multiSelect: false
      };

      var addItemColumn = function() {
        var col = self.columns.add();
        col.setName("Item");
        col.setType(Dialogs.PropertyType.grid);
      };

      addItemColumn();

      var clearColumns = function(clear) {
        return function() {
          clear();
          addItemColumn();
        };
      };

      //
      // the clear of this collection adds an item column
      // after removing all columns
      //
      self.columns.clear = clearColumns(self.columns.clear);

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
      that.setNoResizeHeight = function() { /* TODO: implement this. */ };
      that.getNoSelectInGotFocus = function() { /* TODO = implement this. */ };

      that.getMultiSelect = function() {
        return self.multiSelect;
      };
      that.setMultiSelect = function(value) {
        self.multiSelect = value;
      };

      return that;
    };

  });

}());