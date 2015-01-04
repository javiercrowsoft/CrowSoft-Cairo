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
      var self = {
        text: "",
        itemData: 0,
        tag: "",
        foreColor: 0,
        backColor: 0,
        textAlign: Cairo.Dialogs.TextAlign.right,
        font: null
      };

      var that = {

        getText: function() {
          return self.text;
        },
        setText: function(text) {
          self.text = text;
        },

        getItemData: function() {
          return self.itemData;
        },
        setItemData: function(value) {
          self.itemData = value;
        },

        getTag: function() {
          return self.tag;
        },
        setTag: function(tag) {
          self.tag = tag;
        },

        setForeColor: function(color) {
          self.foreColor = color;
        },
        setBackColor: function(color) {
          self.backColor = color;
        },
        setTextAlign: function(align) {
          self.textAlign = align;
        },
        setFont: function(font) {
          self.font = font;
        }
      };

      return that;
    };

    var createColumn = function() {
      var self = {
        text:    '',

        defaultValue: null /* is a Grids.Cell object */
      };

      var that = {

        getText: function() {
          return self.text;
        },
        setText: function(text) {
          self.text = text;
        },

        getDefault: function() {
          return self.defaultValue;
        },
        setDefault: function(value) {
          self.defaultValue = value;
        }
      };

      return that;
    };

    var createRow = function() {
      var self = {
        cells: Cairo.Collections.createCollection(createCell),

        isGroup: false
      };

      var that = {

        getIsGroup: function() {
          return self.isGroup;
        },
        setIsGroup: function(isGroup) {
          self.isGroup = isGroup;
        },

        get: function(col) {
          return self.cells.get(col);
        },

        getCells: function() {
          return self.cells;
        }
      };

      return that;
    };

    var createGrid = function() {
      var self = {
        columns: Cairo.Collections.createCollection(createColumn),
        rows: Cairo.Collections.createCollection(createRow),

        addEnabled: false,
        editEnabled: false,
        deleteEnabled: false,

        redraw: false
      };

      var getTableSection = function(element, section, tag) {
        var child = $('.' + section, element);
        if(child.length > 0) {
          while (child.firstChild) {
            child.removeChild(child.firstChild);
          }
        }
        else {
          child = $('<' + tag + ' class="' + section + '"></' + tag + '>');
          element.append(child);
        }
        return child;
      };

      var draw = function(element) {
        if(self.redraw !== true || element === null) return;

        var body = getTableSection(element, 'dialog-grid-body', 'tbody');

        var createTD = function(item) {
          var td = $('<td class="dialog-td"></td>');
          td.html(item.getText());
          return td;
        };

        var addRow = function(row) {
          return createTR(row.getCells());
        };

        var createTR = function(elements) {
          var tr = $('<tr class="dialog-tr"></tr>');
          tr.append(elements.map(createTD));
          return tr;
        };

        body.append(createTR(self.columns));
        body.append(self.rows.map(addRow));

        if(self.editEnabled && self.addEnabled) {

          var addToEmptyRow = function(col, cells) {
            var cell = cells.add();
            //cell.setText(".");
          };

          var emptyRow = createRow();
          self.columns.each(addToEmptyRow, emptyRow.getCells());
          body.append(createTR(emptyRow.getCells()));
        }
      };

      var that = Cairo.Controls.createControl();
      
      that.htmlTag = "<table/>";

      var superSetElement = that.setElement;

      that.setElement = function(element) {
        superSetElement(element);
        element.text(self.text);
        element.addClass('dialog-grid table table-striped table-bordered');
        draw(element);
      };

      that.getColumns = function() {
        return self.columns;
      };

      that.getRows = function() {
        return self.rows;
      };

      that.selectRow = function(row) { /* TODO = implement this. */ };
      that.autoWidthColumns = function() { /* TODO = implement this. */ };

      that.clearGroups = function() { /* TODO = implement this. */ };
      that.refreshGroupsAndFormulasEx = function() { /* TODO = implement this. */ };
      that.clearEx = function() { /* TODO = implement this. */ };
      that.addGroup = function() { /* TODO = implement this. */ };

      that.getRedraw = function() {
        return self.redraw;
      };
      that.setRedraw = function(redraw) {
        self.redraw = redraw;
      };

      that.draw = function() {
        draw(that.getElement());
      };

      that.rowIsGroup = function(row) { /* TODO = implement this. */ };
      that.setSelectedCol = function(col) { /* TODO = implement this. */ };
      that.setSelectedRow = function(row) { /* TODO = implement this. */ };
      that.setRowMode = function(rowMode) { /* TODO = implement this. */ };

      that.cellText = function(row, col) {
        return self.rows.get(row).get(col).getText();
      };
      that.cell = function(row, col) {
        return self.rows.get(row).get(col);
      };

      that.setColumnWidth = function(col, width) { /* TODO = implement this. */ };

      that.setRowBackColor = function(rowIndex, backColor) { /* TODO = implement this. */ };
      that.setRowForeColor = function(rowIndex, foreColor) { /* TODO = implement this. */ };
      that.setMultiSelect = function(multiSelect) { /* TODO = implement this. */ };
      that.setGridLines = function(gridLines) { /* TODO = implement this. */ };

      that.setAddEnabled = function(enabled) {
        self.addEnabled = enabled;
      };

      that.setEditEnabled = function(enabled) {
        self.editEnabled = enabled;
      };

      that.setDeleteEnabled = function(enabled) {
        self.deleteEnabled = enabled;
      };

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