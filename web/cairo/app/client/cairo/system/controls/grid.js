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
        subType: null,

        enabled: false,
        isEditable: false,

        size: 0,
        format: null, /* is a Grids.CellFormat object */

        selectId: 0,
        selectFilter: '',
        selectFieldIntValue: '',
        selectIntValue: '',
        selectNoUseActive: false,
        selectType: Cairo.Select.SelectType.normal,
        selectTable: 0,

        defaultValue: null, /* is a Dialogs.Grids.Cell object */

        index: -1
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

        getSubType: function() {
          return self.subType;
        },
        setSubType: function(subType) {
          self.subType = subType;
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
        setEditable: function(isEditable) {
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
        },

        setList: function(list) { /* TODO: implement this. */},

        getIndex: function() {
          return self.index;
        },
        setIndex: function(index) {
          self.index = index;
        },

        getSize: function() {
          return self.size;
        },
        setSize: function(size) {
          self.size = size;
        },

        getFormat: function() {
          return self.format;
        },
        setFormat: function(format) {
          self.format = format;
          return that;
        }

      };

      return that;
    };

    var createRow = function() {
      var self = {
        cells: Cairo.Collections.createCollection(createCell),

        isGroup: false
      };

      self.cells.inspect = function() {
        var printToLog = function(cell, i) {
          try {
            Cairo.log("cell " + i.toString() + ": " + cell.getText().toString() + " | item data: " + cell.getItemData().toString() + " | tag: " + cell.getTag().toString());
          }
          catch(ignore) {}
          return true;
        };
        self.cells.each(printToLog);
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
        },

        inspect: function() {
          self.cells.inspect();
        }
      };

      return that;
    };

    var createGrid = function() {

      var D = Cairo.Dialogs;
      var T = D.PropertyType;
      var S = D.PropertySubType;
      var CT = Cairo.Controls.InputType;
      var val = Cairo.Util.val;
      var NO_DATE = Cairo.Constants.NO_DATE;
      var P = Cairo.Promises;
      var call = P.call;

      var self = {
        table: null,
        columns: Cairo.Collections.createCollection(createColumn),
        rows: Cairo.Collections.createCollection(createRow),

        addEnabled: false,
        editEnabled: false,
        deleteEnabled: false,

        redraw: false,

        listeners: {
          onColumnBeforeEdit: null,
          onColumnAfterEdit: null,
          onColumnAfterUpdate: null,
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
        },

        editInfo: null,
        newRow: null
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
          case "onColumnAfterUpdate":
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
        addListener('onColumnAfterUpdate', view.onGridColumnAfterUpdate(that));
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
        var icon = (val(value) !== 0) ? "check" : "unchecked";
        return "<i class='glyphicon glyphicon-" + icon + "'></i>";
      };

      var raiseEvent = function(event, eventArg) {
        var p = null;
        if(self.listeners[event] !== null) {
          p = self.listeners[event](eventArg);
        }
        return p || P.resolvedPromise(false);
      };

      var raiseEventAndThen = function(event, eventArg, thenCall) {
        if(self.listeners[event] !== null) {
          return self.listeners[event](eventArg).then(
            thenCall
          );
        }
        else {
          return P.resolvedPromise(false);
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

      eventHandler.onDateChange = function(control) {
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
           endEdit();
        };
      };

      //
      // end event handlers for edition
      //

      var createHtmlElement = function(control) {
        var element = $(control.htmlTag);
        control.setElement(element, eventHandler);
      };

      var selectRow = function(td) {
        $(td.parentNode).addClass('highlight').siblings().removeClass('highlight');
        var tr = td.parentNode;
        var args = {
          row: tr.rowIndex - 1, /* first row contains headers */
          col: td.cellIndex
        };
        raiseEvent('onSelectionChange', args).then(
          call(raiseEvent, 'onSelectionRowChange', args)
        );
      };

      var inputOnButtonClick = function() {
        if(self.editInfo !== null) {
          raiseEvent("onColumnButtonClick", self.editInfo);
        }
      };
      var inputCtrl = null;
      var getInputCtrl = function() {
        if(inputCtrl === null) {
          inputCtrl = Cairo.Controls.createInput();
          inputCtrl.setClass('grid-input-control');
          inputCtrl.addListener("onButtonClick", inputOnButtonClick);
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

      var dateCtrl = null;
      var getDateCtrl = function() {
        if(dateCtrl === null) {
          dateCtrl = Cairo.Controls.createDatePicker();
          createHtmlElement(dateCtrl);
        }
        return dateCtrl;
      };

      var getButtonStyle = function(col) {
        return (
          col.getSubType() === S.textButtonEx
            || col.getSubType() === S.textButton) ?
          Cairo.Controls.ButtonStyle.single :
          Cairo.Controls.ButtonStyle.none;
      };

      var getControl = function(col, info) {
        var ctrl = null;
        try {
          switch (col.getType()) {
            case T.select:
              ctrl = getSelectCtrl();
              break;

            case T.numeric:
              ctrl = getInputCtrl();
              ctrl.setType(D.getCtrlType(col.getSubType()));
              break;

            case T.text:
              ctrl = getInputCtrl();
              ctrl.setType(CT.text);
              ctrl.setButtonStyle(getButtonStyle(col));
              break;

            case T.date:
            case T.time:
              ctrl = getDateCtrl();
              break;
          }
        }
        catch(ignore) {
          Cairo.logError("Error when getting control for col\n\n" + ignore.message, ignore);
        }
        return ctrl;
      };

      var getRow = function(row) {
        if(self.rows.count() > row) {
          return self.rows.get(row);
        }
        else {
          return self.newRow;
        }
      };

      //
      // this function is called when the user clicks in any cell of the table
      // if there was an edition in progress it completes the work
      //
      var endEdit = function() {
        var p = null;
        var info = self.editInfo;
        if(info !== null) {
          try {

            var col = self.columns.getOrElse(info.col, null);
            if (col !== null) {

              var ctrl = getControl(col);
              var td = info.td;
              var newValue = "";
              var newValueId = "";

              switch (col.getType()) {
                case T.select:
                  p = ctrl.validate().then(
                    function() {
                      newValue = ctrl.getValue();
                      newValueId = ctrl.getId();
                    }
                  );
                  break;

                case T.list:
                  newValue = ctrl.getValue();
                  newValueId = ctrl.getId();
                  break;

                case T.numeric:
                  newValue = ctrl.getValue();
                  break;

                case T.text:
                  newValue = ctrl.getText();
                  break;

                case T.date:
                case T.time:
                  newValue = ctrl.getValue();
                  break;
              }
              p = p || P.resolvedPromise();
              p = p.then(
                function() {
                  var args = {
                    row: info.row,
                    col: info.col,
                    newValue: newValue,
                    newValueId: newValueId
                  };
                  return raiseEventAndThen(
                    'onColumnAfterEdit',
                    args,
                    thenCall(call(updateCell, args, td), call(hideControlOnError, args, td))
                  );
                }
              );
            }
          }
          catch(ex) {
            Cairo.manageErrorEx(ex.message, ex, "endEdit", "Cairo.Controls.Grid", "");
          }
          self.editInfo = null;
        }
        return p || P.resolvedPromise(true);
      };

      var hideControlOnError = function(info, td) {
        var col = self.columns.getOrElse(info.col, null);
        hideControlForCol(col, td);
        return false;
      };

      var setValue = function(ctrl, col, key, currentValue) {
        var newValue = currentValue;
        var chars = "abcdefghijklmnopqrstuvwxyz[]{}()!@#$%^&*`~:;\"'\\|/?.>,<�=+-0123456789";
        if(key !== "" && chars.indexOf(key.toLowerCase()) >= 0) {
          newValue = key;
        }
        switch(col.getType()) {
          case T.select:
            if(newValue.text !== undefined) {
              ctrl.setValue(newValue.text);
              ctrl.setId(newValue.id);
            }
            else {
              ctrl.setValue(newValue);
            }
            ctrl.setIntValue(col.getSelectIntValue());
            ctrl.setFieldIntValue(col.getSelectFieldIntValue());
            ctrl.setFilter(col.getSelectFilter());
            ctrl.setTable(col.getSelectTable());
            ctrl.setSelectNoUseActive(col.getSelectNoUseActive());
            ctrl.updateDefinition();
            break;

          case T.list:
            if(newValue.text !== undefined) {
              ctrl.setValue(newValue.text);
              ctrl.setId(newValue.id);
            }
            else {
              ctrl.setValue(newValue);
            }

          case T.numeric:
            ctrl.setValue(newValue);
            break;

          case T.text:
            ctrl.setText(newValue);
            break;

          case T.date:
          case T.time:
            ctrl.setValue(newValue);
            break;
        }
      };

      var setEmptyValue = function(row, col) {
        var cell = getRow(row).get(col);
        cell.setText("");
        cell.setItemData(0);
        cell.setTag("");
        return cell;
      };

      var getCurrentValue = function(type, row, col) {
        var cell = getRow(row).get(col);
        var column = self.columns.get(col);
        var value = "";
        switch(type) {
          case T.select:
          case T.list:
            value = {
              text: cell.getText(),
              id: cell.getItemData()
            };
            break;

          case T.numeric:
            if(column.getSubType() === S.percentage) {
              value = Cairo.accounting.formatNumber(val(cell.getText()) * 100,2);
            }
            else {
              value = cell.getText();
            }
            break;

          case T.check:
            value = cell.getItemData();
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

      var hideControlForCol = function(col, td) {
        var ctrl = getControl(col);
        if(ctrl !== null) {
          $(ctrl.getElement()).detach();
        }
        $(td).removeClass('grid-td-editing grid-td-editing-number grid-td-editing-text grid-td-editing-date');
      };

      var updateCell = function(info, td) {

        if(that.getEnabled() === false) {
          return P.resolvedPromise(false);
        }

        var p = null;

        try {
          var col = self.columns.getOrElse(info.col, null);

          //
          // if the column is not valid we do nothing but hide the edit control
          //
          if (!validateCol(col)) {
            hideControlForCol(col, td);
            return false;
          }
          //
          // if the column is valid we update the cell and the TD
          //
          else {
            //
            // first hide the control
            // then set td value
            // and finally raise event ColumnAfterEdit
            //
            hideControlForCol(col, td);

            var cell = getRow(info.row).get(info.col);
            switch (col.getType()) {
              case T.check:
                cell.setItemData(info.newValue);
                $(td).html(getCheckboxIcon(info.newValue));
                break;

              case T.select:
              case T.list:
                cell.setText(info.newValue);
                cell.setItemData(info.newValueId)
                $(td).text(info.newValue);
                break;

              case T.text:
              case T.date:
              case T.time:
                cell.setText(info.newValue);
                $(td).text(info.newValue);
                break;

              case T.numeric:
                var value = val(info.newValue);
                if(col.getSubType() === S.integer) {
                  cell.setText(value);
                  $(td).text(Cairo.accounting.formatNumber(value, 0));
                }
                if(col.getSubType() === S.percentage) {
                  cell.setText(value / 100);
                  $(td).text((Cairo.accounting.formatNumber(value, 2)) + "%");
                }
                else {
                  cell.setText(value);
                  $(td).text(Cairo.accounting.formatNumber(value, 2));
                }
                break;
            }

            var args = {
              row: info.row,
              col: info.col,
              newValue: info.newValue,
              newValueId: info.newValueId
            };
            p = raiseEvent(
              'onColumnAfterUpdate',
              args
            );
          }
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "updateCell", "Cairo.Controls.Grid", "");
        }

        return p || P.resolvedPromise(false);
      };

      var edit = function(info, td) {
        if(that.getEnabled() === false) {
          return;
        }

        var col = self.columns.getOrElse(info.col, null);

        //
        // if the column is not valid we do nothing but hide the edit control
        //
        if (!validateCol(col)) {
          hideControlForCol(col, td);
          return false;
        }
        //
        // if the column is valid we have to cases:
        // - boolean values are edited by the clic turning on/off the value of the cell
        // - all other inputs are managed by an edit control (select, input text, input number, list, dates, etc)
        //
        else {
          var type = col.getType();
          //
          // boolean cell
          //
          if(type === T.check && self.editEnabled) {
            var curValue = val(getCurrentValue(type, info.row, info.col));
            var newValue = curValue !== 0 ? 0 : Cairo.Util.boolToInt(true);
            var args = {
              row: info.row,
              col: info.col,
              newValue: newValue,
              newValueId: newValue
            };
            //
            // first we raise ColumnAfterEdit then we update the cell
            //
            raiseEventAndThen(
              'onColumnAfterEdit',
              args,
              thenIfSuccessCall(updateCell, args, td)
            );
          }
          //
          // all other columns
          //
          else {
            //
            // get the edit control and start the edition
            //
            var ctrl = getControl(col, info);
            if(ctrl !== null) {
              setValue(ctrl, col, info.key, getCurrentValue(col.getType(), info.row, info.col));
              var td$ = $(td);
              td$.addClass('grid-td-editing');
              td$.addClass(getClassForColType(type));
              td$.html(ctrl.getElement());
              ctrl.focus();
              if(info.key === "") {
                ctrl.select();
              }
              if(info.doSearch && col.getType() === T.select) {
                ctrl.search();
              }
              self.editInfo = {
                td: td,
                row: info.row,
                col: info.col
              }
            }
          }
        }
      };

      var getClassForColType = function(type) {
        switch(type) {
          case T.numeric:
            return 'grid-td-editing-number';
          case T.text:
            return 'grid-td-editing-text';
          case T.date:
            return 'grid-td-editing-date';
        }
      };

      var thenCall = function(onSuccess, onError) {
        return function(success) {
          if(success === true) {
            return onSuccess();
          }
          else {
            return onError();
          }
        };
      };

      var thenIfSuccessCall = function(f) {
        var args = arguments;
        return function(success) {
          if(success === true) {
            return f.apply(null, Array.prototype.slice.call(args, 1));
          }
          else {
            return false;
          }
        };
      };

      var clickInSameCell = function(info) {
        return self.editInfo !== null && info.col === self.editInfo.col && info.row === self.editInfo.row;
      };

      var tdClickListener = function(e) {
        //
        // only clicks in TD elements
        //
        var tagName = e.target.tagName;
        if(tagName === "TD" || tagName === "I") {
          var td = tagName === "TD" ? e.target : e.target.parentNode;
          if(td.parentNode.rowIndex > 0) { /* first row contains headers */
            var args = {
              row: td.parentNode.rowIndex - 1, /* first row contains headers */
              col: td.cellIndex,
              key: ""
            };
            if (!clickInSameCell(args)) {
              //
              // first end any pending edition
              //
              endEdit().then(
                function() {
                  selectRow(td);
                  if(td.cellIndex !== 0) {
                    //
                    // next prepare to start editing this cell
                    //
                    raiseEventAndThen(
                      'onColumnBeforeEdit',
                      args,
                      thenIfSuccessCall(edit, args, td)
                    );
                  }
                }
              ).then(
                call(raiseEvent, 'onSelectionChange', args)
              );
            }
          }
        }
      };

      var nextVisibleTD = function(tds, currCol, moveTo) {
        if(moveTo > 0) {
          return nextRightVisibleTD(tds, currCol + moveTo);
        }
        else {
          return nextLeftVisibleTD(tds, currCol + moveTo);
        }
      };

      var nextRightVisibleTD = function(tds, moveTo) {
        for(var i = moveTo; i < tds.length; i += 1) {
          if(self.columns.get(i).getVisible()) {
            return tds.item(i);
          }
        }
      };

      var nextLeftVisibleTD = function(tds, moveTo) {
        for(var i = moveTo; i > -1; i -= 1) {
          if(self.columns.get(i).getVisible()) {
            return tds.item(i);
          }
        }
      };

      var nextEditableTD = function(tds, moveTo) {
        for(var i = moveTo; i < tds.length; i += 1) {
          var col = self.columns.get(i);
          if(col.getVisible() && col.isEditable()) {
            return tds.item(i);
          }
        }
        return null;
      };

      var colIsVisibleAndEditable = function(column) {
        return column.getVisible() && column.isEditable() && column.getEnabled() && column.getType() !== T.grid;
      };

      var getIndexFirstCol = function() {
        var column = self.columns.selectFirst(colIsVisibleAndEditable);
        if(column !== null) {
          return column.getIndex();
        }
        else {
          return -1;
        }
      };

      var newRow = function(tr, td) {
        var index = getIndexFirstCol();
        index = index < 0 ? td.cellIndex : index;
        td = tr.childNodes.item(index);
        td.focus();
        selectRow(td);
      };

      var addRow = function(td) {
        //
        // add the last row to self.rows because it has passed the validations
        //
        self.rows.add(self.newRow);

        //
        // create a new row
        //
        var tr = gridManager.addNewRow();
        gridManager.bindEvents("td", tr);

        //
        // request a new row to the client
        //
        var args = {
          row: tr.rowIndex - 1 /* first row contains headers */
        };
        raiseEventAndThen(
          'onNewRow',
          args,
          thenIfSuccessCall(newRow, tr, td)
        );
      };

      var deleteRow = function(info, td) {
        if(that.getEnabled() === false) {
          return;
        }

        var body = gridManager.body[0];
        var trs = body.childNodes;
        if(self.rows.count() > info.row) {
          self.rows.remove(info.row);
          body.parentNode.deleteRow(info.row + 1)
        }
        else {
          self.newRow = gridManager.createEmptyRow();
        }
        for(var i = info.row, count = self.rows.count(); i < count; i += 1) {
          var row = getRow(i);
          var index = i + 1;
          row.get(0).setText(index);
          td = trs.item(index).childNodes.item(0);
          $(td).text(index);
        }
        //
        // if the grid support add rows
        // the new row has index === count
        //
        if(self.editEnabled && self.addEnabled) {
          gridManager.updateRow(count);
        }
        td = trs.item(info.row + 1).childNodes.item(info.col);
        td.focus();
        selectRow(td);
      };

      var tdKeyPressListener = function(e) {
        Cairo.log("keypress: " + that.getKeyCode(e).toString());
        Cairo.log("keypress: " + String.fromCharCode(that.getKeyCode(e)));

        var td = e.target;

        var noKeyCodes = [13];

        //
        // only clicks in TD elements
        //
        if(td.tagName === "TD" && noKeyCodes.indexOf(e.keyCode) === -1) {

          var args = {
            row: td.parentNode.rowIndex - 1, /* first row contains headers */
            col: td.cellIndex,
            key: String.fromCharCode(that.getKeyCode(e))
          };

          //
          // first end any pending edition
          //
          endEdit().then(
            function() {
              //
              // next prepare to start editing this cell
              //
              raiseEventAndThen(
                'onColumnBeforeEdit',
                args,
                thenIfSuccessCall(edit, args, td)
              );
            }
          ).then(
            call(raiseEvent, 'onSelectionChange', args)
          );
        }
      };

      var tdKeyDownListener = function(e) {
        Cairo.log("keydown: " + that.getKeyCode(e).toString());
        Cairo.log("keydown ctrl-key: " + e.ctrlKey.toString());

        var arrowKeyCodes = [37,38,39,40];
        var deleteKeyCodes = [8, 46];

        //
        // the TD can contain other controls like inputs, selects, dates, checkboxes, etc.
        //

        var td = e.target;
        if(td.tagName !== "TD") {
          // checkbox are i into a td
          if(td.parentNode.tagName === "TD") {
            td = td.parentNode;
          }
          // selects are inputs into a div into a td
          else if(td.parentNode.parentNode.tagName === "TD") {
            td = td.parentNode.parentNode;
          }
        }

        //
        // arrow keys
        //
        if(td.tagName === "TD" && arrowKeyCodes.indexOf(e.keyCode) !== -1) {

          //
          // only stop propagation and prevent default if the target is a TD
          //
          if(e.target.tagName === "TD") {
            e.stopPropagation();
            e.preventDefault();
          }

          var moveToCol = 0;
          var moveToRow = 0;

          switch(e.keyCode) {
            case 37:
              moveToCol = -1;
              break;
            case 39:
              moveToCol = 1;
              break;

            case 38:
              moveToRow = -1;
              break;
            case 40:
              moveToRow = 1;
              break;
          }

          if(moveToCol !== 0) {
            var index = td.cellIndex + moveToCol;
            if(index > -1 && index < td.parentNode.childNodes.length) {
              var selStart = -1;
              var selEnd = -1;
              var textLength = 0;
              if(e.target.selectionStart) {
                selStart = e.target.selectionStart;
                selEnd = e.target.selectionEnd;
                textLength = e.target.value.length;
              }

              if(selStart === -1
                || (moveToCol < 0 && selStart === 0 && selEnd === 0)
                || (moveToCol > 0 && selStart === textLength && selEnd === selStart)) {

                var tr = td.parentNode;
                var args = {
                  row: tr.rowIndex - 1, /* first row contains headers */
                  col: td.cellIndex
                };
                endEdit().then(function() {
                  var nextTD = nextVisibleTD(td.parentNode.childNodes, td.cellIndex, moveToCol);
                  nextTD.focus();
                }).then(
                  call(raiseEvent, 'onSelectionChange', args)
                );
              }
            }
          }
          else if(moveToRow !== 0) {
            var tr = td.parentNode;
            var index = tr.rowIndex + moveToRow;
            if(index > 0) {
              var col = self.columns.get(td.cellIndex);
              if(e.target.tagName === "TD"
                || col.getType() !== T.select
                || !getControl(col).listIsOpen()) {
                endEdit().then(
                  function() {
                    if(index < tr.parentNode.childNodes.length) {
                      td = tr.parentNode.childNodes.item(index).childNodes.item(td.cellIndex);
                      td.focus();
                      selectRow(td);
                    }
                    else {
                      // request a new row
                      //
                      // next prepare to start editing this cell
                      //
                      var args = {
                        row: tr.rowIndex - 1, /* first row contains headers */
                        col: td.cellIndex
                      };
                      raiseEventAndThen(
                        'onValidateRow',
                        args,
                        thenIfSuccessCall(addRow, td)
                      );
                    }
                  }
                );
              }
            }
          }
        }

        //
        // enter key
        //
        else if(e.keyCode === 13) {
          endEdit().then(function() {
            var index = td.cellIndex + 1;
            if(index > -1 && index < td.parentNode.childNodes.length) {
              var nextTD = nextEditableTD(td.parentNode.childNodes, td.cellIndex+1);
              if(nextTD !== null) {
                nextTD.focus();
                selectRow(nextTD);
              }
            }
            else if(index === td.parentNode.childNodes.length) {
              var tr = td.parentNode;
              var index = tr.rowIndex + 1;
              if(index > 0 && index < tr.parentNode.childNodes.length) {
                var nextTD = nextEditableTD(tr.parentNode.childNodes.item(index).childNodes, 1);
                if(nextTD !== null) {
                  nextTD.focus();
                  selectRow(nextTD);
                }
              }
              else if(index > 0) {
                // request a new row
                //
                // next prepare to start editing this cell
                //
                var args = {
                  row: tr.rowIndex - 1, /* first row contains headers */
                  col: 0
                };
                raiseEventAndThen(
                  'onValidateRow',
                  args,
                  thenIfSuccessCall(addRow, td)
                );
              }
            }
          });
        }

        //
        // delete key
        //
        else if(deleteKeyCodes.indexOf(e.keyCode) !== -1) {
          //
          // only if we aren't editing
          //
          if(self.editInfo === null) {
            if(e.ctrlKey) {
              //
              // only stop propagation and prevent default if the target is a TD
              //
              if(e.target.tagName === "TD") {
                e.stopPropagation();
                e.preventDefault();
              }

              var tr = td.parentNode;
              var args = {
                row: tr.rowIndex - 1, /* first row contains headers */
                col: td.cellIndex
              };
              raiseEventAndThen(
                'onDeleteRow',
                args,
                thenIfSuccessCall(deleteRow, args, td)
              );
            }
            else {
              if(td.cellIndex > 0 && colIsVisibleAndEditable(self.columns.get(td.cellIndex))) {
                //
                // only stop propagation and prevent default if the target is a TD
                //
                if(e.target.tagName === "TD") {
                  e.stopPropagation();
                  e.preventDefault();
                }
                var cell = setEmptyValue(td.parentNode.rowIndex -1, td.cellIndex);
                gridManager.updateTD(cell, td.cellIndex, td.parentNode, gridManager.getValue);
              }
            }
          }
        }

        //
        // space key
        //
        else if(e.target.tagName === "TD" && e.keyCode === 32) {
          //
          // only stop propagation and prevent default if the target is a TD
          //
          if(e.target.tagName === "TD") {
            e.stopPropagation();
            e.preventDefault();
          }

          var args = {
            row: td.parentNode.rowIndex - 1, /* first row contains headers */
            col: td.cellIndex,
            key: " "
          };

          //
          // first end any pending edition
          //
          endEdit().then(
            function() {
              //
              // next prepare to start editing this cell
              //
              raiseEventAndThen(
                'onColumnBeforeEdit',
                args,
                thenIfSuccessCall(edit, args, td)
              );
            }
          );
        }

        //
        // function key F2 start edit like click
        // function key F4 do a search when the column type is a select
        //
        else if(e.target.tagName === "TD" && (e.keyCode === 113 || e.keyCode === 115)) {
          var args = {
            row: td.parentNode.rowIndex - 1, /* first row contains headers */
            col: td.cellIndex,
            key: "",
            doSearch: e.keyCode === 115
          };

          //
          // first end any pending edition
          //
          endEdit().then(
            function() {
              //
              // next prepare to start editing this cell
              //
              raiseEventAndThen(
                'onColumnBeforeEdit',
                args,
                thenIfSuccessCall(edit, args, td)
              );
            }
          );
        }

        //
        // ctrl/cmd + delete = remove row, delete = clear cell
        //
        else if(false) {}
      };

      //
      // drawing
      //
      var removeChildren = function(element) {
        $(element).empty();
      };

      var getTableSection = function(parent, section, tag) {
        var element = $('.' + section, parent);
        if(element.length === 0) {
          element = $('<' + tag + ' class="' + section + '"></' + tag + '>');
          parent.append(element);
        }
        return element;
      };

      //
      // grid manager
      //

        var getDateFormatted = Cairo.Util.getDateFormatted;

        var gridManager = {
          body: null,
          hiddenStatus: []
        };

        //
        // columns and cells
        //

        gridManager.getColumnTitle = function(cell) {
          return cell.getText();
        };

        gridManager.getValue = function(cell, col) {
          switch(col.getType()) {
            case T.check:
              return getCheckboxIcon(cell.getItemData());
            case T.date:
              return getDateFormatted(cell.getText());
            case T.numeric:
              if(col.getSubType() === S.integer) {
                return Cairo.accounting.formatNumber(cell.getText(), 0);
              }
              if(col.getSubType() === S.percentage) {
                return (Cairo.accounting.formatNumber(val(cell.getText()) * 100, 2)) + "%";
              }
              else {
                return Cairo.accounting.formatNumber(cell.getText(), 2);
              }
            default:
              return cell.getText();
          }
        };

        gridManager.getClassForColumn = function(col) {
          var clazz = "";
          if(col.getIndex() === 0) {
            clazz = "grid-column-item";
          }
          else {
            switch(col.getType()) {
              case T.numeric:
                clazz = 'grid-column-number';
                break;
              case T.text:
                clazz = 'grid-column-text';
                break;
              case T.date:
                clazz = 'grid-column-date';
                break;
              case T.select:
                clazz = 'grid-column-select';
                break;
            }
          }
          return clazz;
        };

        gridManager.getClassForCell = function(col) {
          switch(col.getType()) {
            case T.numeric:
              return "cell-number-value";
            case T.text:
            case T.select:
              return "cell-text-value";
            default:
              return "";
          }
        };

        gridManager.createTD = function(getValue, getClass) {
          return function(item, i) {
            var col = self.columns.get(i);
            var hidden = gridManager.hiddenStatus[i];
            var td = $('<td nowrap class="' + getClass(col) + " " + hidden + '" tabindex="0"></td>');
            td.html(getValue(item, col));
            return td;
          }
        };

        gridManager.createColumnTD = gridManager.createTD(gridManager.getColumnTitle, gridManager.getClassForColumn);
        gridManager.createCellTD = gridManager.createTD(gridManager.getValue, gridManager.getClassForCell);

        gridManager.updateTD = function(cell, i, tr, getValue) {
          var col = self.columns.get(i);
          var td = tr.childNodes.item(i);
          $(td).html(getValue(cell, col));
        };

        //
        // rows
        //

        gridManager.createTR = function(cellsOrColumns, clazz, createTD) {
          //
          // create a $TR element
          //
          var tr = $('<tr class="' + clazz + '"></tr>');
          //
          // add all TDs from a collection of cells or columns
          //
          tr.append(cellsOrColumns.map(createTD));
          //
          // apply format to every TD
          //
          gridManager.setFormatInRow(tr);
          //
          // finally we return the new $tr element
          //
          return tr;
        };

        gridManager.addRow = function(row) {
          return gridManager.createTR(
            row.getCells(),
            'dialog-tr',
            gridManager.createCellTD);
        };

        gridManager.addToEmptyRow = function(col, index, cells) {
          var cell = cells.add();
          var dcell = col.getDefault();
          if(dcell !== null) {
            cell.setText(dcell.getValue());
            cell.setItemData(dcell.getId());
          }
        };

        gridManager.createEmptyRow = function() {
          //
          // create an empty row
          //
          var emptyRow = createRow();

          //
          // for every column create a cell
          //
          self.columns.each(gridManager.addToEmptyRow, emptyRow.getCells());

          //
          // show an asterisk to inform the user this is a new row
          //
          emptyRow.getCells().get(0).setText("<i class='glyphicon glyphicon-asterisk glyphicon-new'></i>");

          return emptyRow;
        };

        gridManager.addNewRow = function() {
          //
          // create an empty row
          //
          var emptyRow = gridManager.createEmptyRow();
          //
          // create the $TR element with TDs from the new row
          //
          var tr = gridManager.createTR(
            emptyRow.getCells(),
            'dialog-tr',
            gridManager.createCellTD);
          //
          // add the new row to the table
          //
          gridManager.body.append(tr);
          //
          // update the reference to the new row (this row is not in self.rows yet)
          //
          self.newRow = emptyRow;
          //
          // apply format to every TD
          //
          gridManager.setFormatInRow(tr);
          //
          //
          // finally we return the new tr element
          //
          return tr[0];
        }

        gridManager.updateRow = function(rowIndex) {
          var tr = gridManager.body[0].childNodes.item(rowIndex + 1 /* first row is for headers */);
          getRow(rowIndex).getCells().each(gridManager.updateTD, tr, gridManager.getValue);
        };

        gridManager.bindEvents = function(parent, selector) {
          $(selector, parent).on("click", tdClickListener);
          $(selector, parent).on("keydown", tdKeyDownListener);
          $(selector, parent).on("keypress", tdKeyPressListener);
        };

        gridManager.setFormatInRow = function(tr) {
          // TODO: implement this.
        };

      //
      // end grid manager
      //

      var draw = function(element, rowIndex) {
        if(self.redraw !== true || element === null) return;

        rowIndex = rowIndex === undefined ? -1 : rowIndex;

        //
        // if rowIndex === -1 we need to remove all rows and columns and then draw the entire grid
        //
        if(rowIndex === -1) {

          //
          // get the body of this table
          //
          gridManager.body = getTableSection(element, 'dialog-grid-body', 'tbody');

          //
          // remove all rows and columns
          //
          removeChildren(gridManager.body);

          //
          // columns and cells
          //
          var visibleToArray = function(col, i) {
            gridManager.hiddenStatus[i] = col.getVisible() === true ? "" : " hidden";
          };
          self.columns.each(visibleToArray);

          //
          // rows
          //

          //
          // add columns
          //
          gridManager.body.append(
            gridManager.createTR(
              self.columns,
              'dialog-th',
              gridManager.createColumnTD));

          //
          // add rows
          //
          gridManager.body.append(self.rows.map(gridManager.addRow));

          //
          // for grids with addEnabled === true we add an empty row at the bottom
          //
          if(self.editEnabled && self.addEnabled) {
            gridManager.addNewRow();
          }

          //
          // bind events to every row
          //
          gridManager.bindEvents(gridManager.body, "tr td");
        }
        else {
          //
          // just update the row
          //
          gridManager.updateRow(rowIndex);
        }
      };

      var refreshColumn = function(col) {
        //
        // for now only visible state
        //
        var colIndex = col.getIndex();
        var colVisible = col.getVisible();
        var rows = $("tr", gridManager.body);
        for(var i = 0, count = rows.length; i < count; i += 1) {
          var td = $(rows[i].children[colIndex]);
          if(colVisible) {
            td.removeClass("hidden");
          }
          else {
            td.addClass("hidden");
          }
        }
        gridManager.hiddenStatus[colIndex] = colVisible;
      };

      //
      // control
      //

      var that = Cairo.Controls.createControl();
      
      that.htmlTag = "<div/>";

      var superSetElement = that.setElement;

      that.setElement = function(element, view) {
        element.addClass('grid-container');
        self.table = $('<table></table>');
        element.append(self.table);
        superSetElement(element);
        self.table.addClass('dialog-grid table table-bordered');
        setListeners(view);
        draw(self.table);
      };

      that.getTable = function() {
        return self.table;
      };

      that.getColumns = function() {
        return self.columns;
      };

      that.getRows = function() {
        return self.rows;
      };

      that.getRowCount = function() {
        if(self.newRow !== null) {
          return self.rows.count() + 1;
        }
        else {
          return self.rows.count();
        }
      }

      that.getRow = getRow;

      that.selectRow = function(row) { /* TODO = implement this. */ };
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

      that.draw = function(rowIndex) {
        draw(that.getTable(), rowIndex);
      };

      that.refreshColumn = function(col) {
        refreshColumn(col);
      };

      that.rowIsGroup = function(row) { /* TODO = implement this. */ };
      that.setSelectedCol = function(col) { /* TODO = implement this. */ };
      that.setSelectedRow = function(row) { /* TODO = implement this. */ };
      that.setRowMode = function(rowMode) { /* TODO = implement this. */ };

      that.cellText = function(row, col) {
        return getRow(row).get(col).getText();
      };
      that.cell = function(row, col) {
        return getRow(row).get(col);
      };

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
      that.setNoSelectInGotFocus = function(value) { /* TODO = implement this. */ };

      //
      // overloaded methods - the default implementation in controls doesn't apply to grids
      //
      that.setSelectOnFocus = function(select) {};
      that.onKeyUp = function(e) {};

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