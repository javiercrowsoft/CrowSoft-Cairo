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

      var setGridCell = function(cell, gridCell, column) {
        gridCell.setText(cell.getValue());
        gridCell.setItemData(cell.getId());
      };

      var setColumnProperties = function(ctrlColumn, propertyColumn) {
        ctrlColumn.setText(propertyColumn.getName());
        ctrlColumn.setVisible(propertyColumn.getVisible());
        ctrlColumn.setType(propertyColumn.getType());
        ctrlColumn.setSubType(propertyColumn.getSubType());
        ctrlColumn.setEditable(propertyColumn.isEditable());
        ctrlColumn.setEnabled(propertyColumn.getEnabled());

        ctrlColumn.setSelectIntValue(propertyColumn.getSelectIntValue());
        ctrlColumn.setSelectFieldIntValue(propertyColumn.getSelectFieldIntValue());
        ctrlColumn.setSelectFilter(propertyColumn.getSelectFilter());
        ctrlColumn.setSelectTable(propertyColumn.getSelectTable());
        ctrlColumn.setSelectNoUseActive(propertyColumn.getSelectNoUseActive());

        ctrlColumn.setDefault(propertyColumn.getDefaultValue());
      };

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
          setColumnProperties(c, col)
        };

        if(!noChangeColumns || columns.count() !== grid.getColumns().count()) {
          columns.clear();
          grid.getColumns().each(createColumn);
        }

        var createCell = function(cell, index, row) {
          var gridCell = row.getCells().add();
          setGridCell(cell, gridCell, columns.get(index));
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

      that.loadFromRow = function(gridControl, row, rowIndex, columns) {

        //
        // during this function the grid's DOM shouldn't be modified
        //
        gridControl.setRedraw(false);

        var columns = gridControl.getColumns();

        var updateCell = function(cell, index, row) {
          var gridCell = row.getCells().get(index);
          setGridCell(cell, gridCell, columns.get(index));
        };

        var r = gridControl.getRow(rowIndex);
        row.getCells().each(updateCell, r);

        gridControl.setRedraw(true);
        gridControl.draw(rowIndex);
      };

      that.refreshColumnProperties = function(gridControl, column, colGrid) {
        setColumnProperties(colGrid, column);
        gridControl.refreshColumn(colGrid);
      };

      that.setColumnProperties = function(gridControl, column, colGrid) {
        setColumnProperties(colGrid, column);
      };

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

      that.showCellValue = function(gridControl, grid, lrow, lcol) {
        var cell = grid.getRows().item(lrow).getCells().item(lcol);
        var gridCell = gridControl.cell(lrow, lcol);
        var col = grid.getColumns().item(lcol);

        gridControl.setRedraw(false);

        gridCell.setItemData(cell.getId());

        if(col.getType() === Dialogs.PropertyType.date) {
          gridCell.setText(Cairo.Util.getDateValueForGrid(cell.getValue()));
        }
        else if(col.getSubType() === Dialogs.PropertySubType.percentage) {
          gridCell.setText(Cairo.Util.val(cell.getValue()) / 100);
        }
        else {
          gridCell.setText(cell.getValue());
        }
        gridControl.setRedraw(true);
        gridControl.draw(lrow);
      };

      return that;
    };
    
    Grids.Manager = createManager();

    Grids.VirtualRowType = "Cairo.Dialogs.Grids.virtualRow";

    Grids.createVirtualRow = function() {
      
      var self = {
        success: false,
        info: null,
        rowsToAdd: 0,
        colAmountKey: -1,
        newId: [],
        newValue: [],
        newAmount: []
      };

      var that = {};

      that.getSuccess = function() {
        return self.success;
      };
      that.setSuccess = function(value) {
        self.success = value;
      };

      that.getRowsToAdd = function() {
        return self.rowsToAdd;
      };
      that.setRowsToAdd = function(rows) {
        self.rowsToAdd = rows;
      };

      that.getAddRows = function() {
        return self.rowsToAdd > 0;
      };

      that.getColAmountKey = function() {
        return self.colAmountKey;
      };
      that.setColAmountKey = function(value) {
        self.colAmountKey = value;
      };

      that.getNewValue = function(rowIndex) {
        if(rowIndex !== undefined) {
          return self.newValue[rowIndex];
        }
        else {
          return self.newValue;
        }
      };
      that.getNewId = function(rowIndex) {
        if(rowIndex !== undefined) {
          return self.newId[rowIndex];
        }
        else {
          return self.newId;
        }
      };
      that.getNewAmount = function(rowIndex) {
        if(rowIndex !== undefined) {
          return self.newAmount[rowIndex];
        }
        else {
          return self.newAmount;
        }
      };

      that.getInfo = function() {
        return self.colAmountKey;
      };
      that.setInfo = function(value) {
        self.info = value;
      };

      that.getObjectType = function() {
        return Grids.VirtualRowType;
      };

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
        value: "",
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
        return that;
      };

      that.getKey = function() {
        return self.key;
      };
      that.setKey = function(key) {
        self.key = key;
        return that;
      };

      that.getValue = function() {
        return self.value;
      };
      that.setValue = function(value) {
        if(value === undefined) {
          Cairo.raiseError("setValue", "undefined can not be used when calling setValue");
        }
        self.value = value;
        return that;
      };

      that.getId = function() {
        return self.id;
      };
      that.setId = function(id) {
        self.id = id;
        return that;
      };

      that.getSelectIntValue = function() {
        return self.selectIntValue;
      };
      that.setSelectIntValue = function(value) {
        self.selectIntValue = value;
        return that;
      };

      that.getFormat = function() {
        return self.format;
      };
      that.setFormat = function(format) {
        self.format = format;
        return that;
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
        selectType: Cairo.Select.SelectType.normal,
        selectTable: 0,

        enabled: true,

        list: null, /* is a Dialogs.ListItem */

        format: "",
        size: 0,

        foreColor: -1,
        backColor: -1,

        index: -1,

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
        return self.isEditable && self.enabled;
      };
      that.setEditable = function(isEditable) {
        self.isEditable = isEditable;
      };
      
      that.setDefaultValue = function(value) {
        self.defaultValue = value;
      };

      that.getDefaultValue = function() {
        return self.defaultValue;
      };

      that.getForeColor = function() {
        return self.foreColor;
      };
      that.setForeColor = function(color) {
        self.foreColor = color;
      };

      that.setBackColor = function(color) {
        self.backColor = color;
      };
      that.getBackColor = function() {
        return self.backColor;
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

        index: -1,

        foreColor: -1,
        backColor: -1

      };

      var addItemCell = function() {
        if(index !== undefined) {
          var cell = self.cells.add(null, Dialogs.Constants.keyRowItem);
          cell.setValue(index);
        }
      };

      addItemCell();

      var clearCells = function(clear) {
        return function() {
          clear();
          addItemCell();
        };
      };

      self.cells.inspect = function() {
        var printToLog = function(cell, i) {
          try {
            Cairo.log("cell " + i.toString() + ": " + cell.getValue().toString() + " | id: " + cell.getId().toString() + " | key: " + cell.getKey().toString());
          }
          catch(ignore) {}
          return true;
        };
        self.cells.each(printToLog);
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

      that.item = that.get;

      that.add = self.cells.add;

      that.getCells = function() {
        return self.cells;
      };

      that.count = function() {
        return self.cells.count();
      };

      that.size = that.count;

      that.getIndex = function() {
        return self.index;
      };
      that.setIndex = function(index) {
        self.index = index;
      };

      that.getForeColor = function() {
        return self.foreColor;
      };
      that.setForeColor = function(color) {
        self.foreColor = color;
      };

      that.setBackColor = function(color) {
        self.backColor = color;
      };
      that.getBackColor = function() {
        return self.backColor;
      };

      that.inspect = function() {
        self.cells.inspect();
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
        multiSelect: false,
        haveKey: false
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
      that.getNoSelectInGotFocus = function() { /* TODO = implement this. */ };

      that.getMultiSelect = function() {
        return self.multiSelect;
      };
      that.setMultiSelect = function(value) {
        self.multiSelect = value;
      };

      that.getHaveKey = function() {
        return self.haveKey;
      };
      that.setHaveKey = function(haveKey) {
        self.haveKey = haveKey;
      };

      return that;
    };

  });

}());