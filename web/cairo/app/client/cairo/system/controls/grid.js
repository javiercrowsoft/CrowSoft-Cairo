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
        visible: true,
        type: null,

        enabled: false,
        isEditable: false,

        selectId: 0,
        selectFilter: '',
        selectFieldIntValue: '',
        selectIntValue: '',
        selectNoUseActive: false,
        selectType: Cairo.Entities.Select.SelectType.normal,
        selectTable: 0,        

        defaultValue: null /* is a Grids.Cell object */
      };

      var that = {

        getText: function() {
          return self.text;
        },
        setText: function(text) {
          self.text = text;
        },

        getVisible: function() {
          return self.visible;
        },
        setVisible: function(visible) {
          self.visible = visible;
        },

        getType: function() {
          return self.type;
        },
        setType: function(type) {
          self.type = type;
        },

        getEnabled: function() {
          return self.enabled;
        },
        setEnabled: function(enabled) {
          self.enabled = enabled;
        },

        isEditable: function() {
          return self.isEditable;
        },
        setIsEditable: function(isEditable) {
          self.isEditable = isEditable;
        },

        // select
        //
        getSelectTable: function() {
          return self.selectTable;
        },
        setSelectTable: function(table) {
          self.selectTable = table;
        },

        getSelectId: function() {
          return self.selectId;
        },
        setSelectId: function(id) {
          self.selectId = id;
        },

        getSelectIntValue: function() {
          return self.selectIntValue;
        },
        setSelectIntValue: function(value) {
          self.selectIntValue = value;
        },

        getSelectFieldIntValue: function() {
          return self.selectFieldIntValue;
        },
        setSelectFieldIntValue: function(value) {
          self.selectFieldIntValue = value;
        },

        getSelectFilter: function() {
          return self.selectFilter;
        },
        setSelectFilter: function(filter) {
          self.selectFilter = filter;
        },

        getSelectType: function() {
          return self.selectType;
        },
        setSelectType: function(type) {
          self.selectType = type;
        },

        getSelectNoUseActive: function() {
          return self.selectNoUseActive;
        },
        setSelectNoUseActive: function(value) {
          self.selectNoUseActive = value;
        },

        //

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

      var T = Cairo.Dialogs.PropertyType;
      var S = Cairo.Dialogs.PropertySubType;
      var val = Cairo.Util.val;
      var NO_DATE = Cairo.Constants.NO_DATE;

      var self = {
        columns: Cairo.Collections.createCollection(createColumn),
        rows: Cairo.Collections.createCollection(createRow),

        addEnabled: false,
        editEnabled: false,
        deleteEnabled: false,

        redraw: false,

        listeners: {
          onColumnBeforeEdit: null,
          onColumnAfterEdit: null,
          onColumnCancelEdit: null,
          onColumnButtonClick: null,
          onColumnClick: null,
          onValidateRow: null,
          onNewRow: null,
          onDeleteRow: null,
          onAfterDeleteRow: null,
          onDblClick: null,
          onSelectionChange: null,
          onSelectionRowChange: null
        }
      };

      //
      // events
      //

      //
      // events
      //
      var addListener = function(eventName, functionHandler) {
        switch(eventName) {
          case "onColumnBeforeEdit":
          case "onColumnAfterEdit":
          case "onColumnCancelEdit":
          case "onColumnButtonClick":
          case "onColumnClick":
          case "onValidateRow":
          case "onNewRow":
          case "onDeleteRow":
          case "onAfterDeleteRow":
          case "onDblClick":
          case "onSelectionChange":
          case "onSelectionRowChange":
            self.listeners[eventName] = functionHandler;
            break;
          default:
            Cairo.logError(
              'Invalid event listener registration. EventName: '
              + eventName + ' - Handler: ' + functionHandler.toString());
        }
      };

      var setListeners = function(view) {
        addListener('onColumnBeforeEdit', view.onGridColumnBeforeEdit(that));
        addListener('onColumnAfterEdit', view.onGridColumnAfterEdit(that));
        addListener('onColumnButtonClick', view.onGridColumnButtonClick(that));
        addListener('onValidateRow', view.onGridValidateRow(that));
        addListener('onNewRow', view.onGridNewRow(that));
        addListener('onDeleteRow', view.onGridDeleteRow(that));
        addListener('onAfterDeleteRow', view.onGridAfterDeleteRow(that));
        addListener('onDblClick', view.onGridDblClick(that));
        addListener('onSelectionChange', view.onGridSelectionChange(that));
        addListener('onSelectionRowChange', view.onGridSelectionRowChange(that));
      };

      //
      // editing
      //

      var getCheckboxIcon = function(value) {
        var icon = (val(value) === 0) ? "check" : "unchecked";
        return "<i class='glyphicon glyphicon-" + icon + "'></i>";
      };

      var raiseEvent = function(event, eventArg) {
        if(self.listeners[event] !== null) {
          self.listeners[event](eventArg);
        }
      };

      var raiseEventAndThen = function(event, eventArg, thenCall) {
        if(self.listeners[event] !== null) {
          self.listeners[event](eventArg).then(
            thenCall
          );
        }
      };

      //
      // event handlers for edition
      //

      var eventHandler = { };

      eventHandler.onMaskEditChange = function(control) {
        return function() {

        };
      };

      eventHandler.onTextChange = function(control) {
        return function() {

        };
      };

      eventHandler.onTextAreaChange = function(control) {
        return function() {

        };
      };

      eventHandler.onSelectChange = function(control) {
        return function() {

        };
      };
      //
      // end event handlers for edition
      //


      var createHtmlElement = function(control) {
        var element = $(control.htmlTag);
        control.setElement(element, eventHandler);
      };

      var inputCtrl = null;
      var getInputCtrl = function() {
        if(inputCtrl === null) {
          inputCtrl = Cairo.Controls.createInput();
          createHtmlElement(inputCtrl);
        }
        return inputCtrl;
      };

      var selectCtrl = null;
      var getSelectCtrl = function() {
        if(selectCtrl === null) {
          selectCtrl = Cairo.Controls.createSelect();
          createHtmlElement(selectCtrl);
        }
        return selectCtrl;
      };

      var getControl = function(col) {
        var ctrl = null;
        switch(col.getType()) {
          case T.select:
            ctrl = getSelectCtrl();
            break;

          case T.text:
            ctrl = getInputCtrl();
            break;
        }
        return ctrl;
      };

      var endEdit = function() {

      };

      var setValue = function(ctrl, col, key, currentValue) {
        var newValue = currentValue;
        var chars = "abcdefghijklmnopqrstuvwxyz�+-0123456789";
        if(chars.indexOf(key) >= 0) {
          newValue = key;
        }
        switch(col.getType()) {
          case T.select:
            ctrl.setValue(newValue.text);
            ctrl.setId(newValue.id);
            ctrl.setIntValue(col.getSelectIntValue());
            ctrl.setFieldIntValue(col.getSelectFieldIntValue());
            ctrl.setFilter(col.getSelectFilter());
            ctrl.setTable(col.getSelectTable());
            ctrl.setSelectNoUseActive(col.getSelectNoUseActive());
            ctrl.updateDefinition();
            break;

          case T.text:
            ctrl.setText(newValue);
            break;
        }
      };

      var getCurrentValue = function(type, row, col) {
        var cell = self.rows.get(row).get(col);
        var value = "";
        switch(type) {
          case T.select:
          case T.list:
            value = {
              text: cell.getText(),
              id: cell.getItemData()
            };
            break;

          case T.percentage:
            value = val(cell.getText()) * 100;
            break;

          default:
            value = cell.getText();
        }
        return value;
      };

      var validateCol = function(col) {
        return !(
          col === null
          || !col.getEnabled()
          || !col.isEditable()
          || col.getType() === 0
          || col.getType() === T.grid
        );
      };

      var updateCell = function(info, td) {
        var col = self.columns.getOrElse(info.col, null);

        if(!validateCol(col)) {
          endEdit();
          return false;
        }
        else {
          var cell = self.rows.get(col);
          switch(col.getType()) {
            case T.check:
              cell.setText(info.newValue);
              $(td).html = getCheckboxIcon(info.newValue);
              break;

            case T.select:
              cell.setText(info.newValue.text);
              cell.setItemData(info.newValue.id)
              $(td).html(info.newValue);
              break;

            case T.text:
              cell.setText(info.newValue);
              $(td).html(info.newValue);
              break;
          }
          var args = {
            row: info.row,
            col: info.col,
            newValue: info.newValue
          };
          raiseEvent(
            'ColumnAfterUpdate',
            args
          );
        }

      };

      var edit = function(info, td) {
        var col = self.columns.getOrElse(info.col, null);

        if(!validateCol(col)) {
          endEdit();
          return false;
        }
        else {
          var type = col.getType();
          if(type === T.check) {
            var curValue = val(getCurrentValue(type, info.row, info.col));
            var newValue = curValue !== 0 ? 0 : Cairo.boolToInt(true);
            var args = {
              row: info.row,
              col: info.col,
              newValue: newValue
            };
            raiseEventAndThen(
              'onColumnAfterEdit',
              args,
              thenIfSuccessCall(updateCell, args, td)
            );
          }
          else {
            var ctrl = getControl(col);
            setValue(ctrl, col, info.key, getCurrentValue(col.getType(), info.row, info.col));
            $(td).html(ctrl.getElement());
          }
        }
      };

      var thenIfSuccessCall = function(f) {
        var args = arguments;
        return function(success) {
          if(success === true) {
            f.apply(null, Array.prototype.slice.call(args, 1));
          }
        };
      };

      var tdClickListener = function(e) {
        var td = e.target;
        var args = {
          row: td.parentNode.rowIndex-1, /* first row contains headers */
          col: td.cellIndex,
          key: 0
        };
        raiseEventAndThen(
          'onColumnBeforeEdit',
          args,
          thenIfSuccessCall(edit, args, td)
        );
      };

      //
      // drawing
      //

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

        //
        // columns and cells
        //
        var getColumnTitle = function(cell) {
          return cell.getText();
        };

        var getDateFormatted = function(date) {
          return (new Date(date)).getTime() === NO_DATE.getTime() ? "" :  $.datepicker.formatDate("dd/mm/yy", date);
        };

        var getValue = function(cell, col) {
          switch(col.getType()) {
            case T.check:
              return getCheckboxIcon(cell.getText());
            case T.date:
              return getDateFormatted(cell.getText());
            default:
              return cell.getText();
          }
        };

        var hiddenStatus = [];
        var visibleToArray = function(col, i) {
          hiddenStatus[i] = col.getVisible() === true ? "" : " hidden";
        };
        self.columns.each(visibleToArray);

        var createTD = function(item, i, getValue) {
          var col = self.columns.get(i);
          var hidden = hiddenStatus[i];
          var td = $('<td class="dialog-td' + hidden + '"></td>');
          td.html(getValue(item, col));
          return td;
        };

        //
        // rows
        //

        var createTR = function(elements, clazz, getValue) {
          var tr = $('<tr class="' + clazz + '"></tr>');
          tr.append(elements.map(createTD, getValue));
          return tr;
        };

        var addRow = function(row) {
          return createTR(row.getCells(), 'dialog-tr', getValue);
        };

        //
        // add columns
        //
        body.append(createTR(self.columns, 'dialog-th', getColumnTitle));
        //
        // add rows
        //
        body.append(self.rows.map(addRow));

        //
        // for grids with addEnabled === true we add an empty row at the bottom
        //
        if(self.editEnabled && self.addEnabled) {

          var addToEmptyRow = function(col, index, cells) {
            var cell = cells.add();
          };

          var emptyRow = createRow();
          self.columns.each(addToEmptyRow, emptyRow.getCells());
          emptyRow.getCells().get(0).setText("<i class='glyphicon glyphicon-asterisk glyphicon-new'></i>");
          body.append(createTR(emptyRow.getCells(), 'dialog-tr', getValue));
        }

        $("tr td", body).on("click", tdClickListener);
      };

      //
      // control
      //

      var that = Cairo.Controls.createControl();
      
      that.htmlTag = "<table/>";

      var superSetElement = that.setElement;

      that.setElement = function(element, view) {
        superSetElement(element);
        element.text(self.text);
        element.addClass('dialog-grid table table-bordered');
        setListeners(view);
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