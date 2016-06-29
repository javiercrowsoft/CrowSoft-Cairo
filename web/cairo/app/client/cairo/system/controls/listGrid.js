(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var createListGrid = function() {
      var self = {
        container: null,
        columns: [],
        rows: [],
        listeners: {
          onDeleteRow: null,
          onEditRow: null
        },
        showEditButtons: true
      };

      var that = Controls.createControl();

      that.htmlTag = "<table/>";

      var superSetElement = that.setElement;

      that.setElement = function(element) {
        superSetElement(element);
        element.text(self.text);
        element.addClass('table table-hover');
      };

      var getDateFormatted = Cairo.Util.getDateFormatted;

      var addListener = function(eventName, functionHandler) {
        switch(eventName) {
          case "onEditRow":
          case "onDeleteRow":
            self.listeners[eventName] = functionHandler;
            break;
          default:
            Cairo.logError(
              'Invalid event listener registration. EventName: '
                + eventName + ' - Handler: ' + functionHandler.toString());
        }
      };

      var setListeners = function(view) {
        addListener('onEditRow', view.onListGridEditRow(that));
        addListener('onDeleteRow', view.onListGridDeleteRow(that));
      };

      /* TODO: FIX ME duplicated functions in grid.js */

      var raiseEvent = function(event, eventArg) {
        if(self.listeners[event] !== null) {
          self.listeners[event](eventArg);
        }
      };

      var raiseEventAndThen = function(event, eventArg, thenCall) {
        if(self.listeners[event] !== null) {
          return self.listeners[event](eventArg).then(
            thenCall
          );
        }
        else {
          return Cairo.Promises.resolvedPromise(false);
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

      var getTableSection = function(parent, section, tag) {
        var element = $('.' + section, parent);
        if(element.length === 0) {
          element = $('<' + tag + ' class="' + section + '"></' + tag + '>');
          parent.append(element);
        }
        return element;
      };

      var getCheckboxIcon = function(value) {
        var icon = (val(value) !== 0) ? "check" : "unchecked";
        return "<i class='glyphicon glyphicon-" + icon + "'></i>";
      };

      var removeChildren = function(element) {
        $(element).empty();
      };
      /* end duplicated functions in grid.js */

      var gridManager = {
        head: null,
        body: null,
        hiddenStatus: [],
        dataTable: null
      };

      //
      // columns and cells
      //

      gridManager.getColumnTitle = function(cell) {
        return cell.name.replace(/_/g, ' ');
      };

      gridManager.getValue = function(cellValue, col) {
        switch(col.columnType) {
          case 'boolean':
            return getCheckboxIcon(cellValue);
          case 'timestamp':
          case 'timestamptz':
          case 'time':
          case 'date':
            return getDateFormatted(cellValue);
          case 'decimal':
          case 'numeric':
          case 'real':
          case 'double':
            return Cairo.accounting.formatNumber(cellValue, 2);
          case 'integer':
          case 'int2':
          case 'int4':
          case 'smallint':
          case 'biginteger':
          case 'serial':
          case 'bigserial':
            return Cairo.accounting.formatNumber(cellValue);
          default:
            return cellValue;
        }
      };

      gridManager.getClassForColumn = function(col) {
        return "";
      };

      gridManager.getClassForCell = function(col) {
        switch(col.columnType) {
          case 'decimal':
          case 'numeric':
          case 'real':
          case 'double':
          case 'integer':
          case 'int2':
          case 'int4':
          case 'smallint':
          case 'biginteger':
          case 'serial':
          case 'bigserial':
            return "cell-number-value";
          default:
            return "";
        }
      };

      gridManager.createTD = function(getValue, tdOrTh, getClass) {
        return function(item, i) {
          var col = self.columns[i];
          var hidden = gridManager.hiddenStatus[i];
          var td = $('<' + tdOrTh + ' nowrap class="' + getClass(col) + " " + hidden + '"></' + tdOrTh + '>');
          td.html(getValue(item, col));
          return td;
        };
      };

      gridManager.createColumnTD = gridManager.createTD(gridManager.getColumnTitle, 'th', gridManager.getClassForColumn);
      gridManager.createCellTD = gridManager.createTD(gridManager.getValue, 'td', gridManager.getClassForCell);

      gridManager.getEditColumnTitle = function() {
        return "<th><i class='glyphicon glyphicon-pencil'></i></td>";
      };

      gridManager.getEditRowButton = function(cells) {
        var td = $('<td nowrap ></td>');
        if(self.showEditButtons) {
          var id = cells[0];
          var editButton = $("<button class='btn btn-sm btn-info js-edit' type='button' data-row-id='" + id + "'>")
          editButton.html("<i class='glyphicon glyphicon-pencil'></i>");
          var deleteButton = $("<button class='btn btn-sm btn-danger js-delete' style='margin-left: 4px;' type='button' data-row-id='" + id + "'>")
          deleteButton.html("<i class='glyphicon glyphicon-remove'></i>");
          td.append(editButton);
          td.append(deleteButton);
        }
        return td;
      };

      //
      // rows
      //
      gridManager.createTR = function(cellsOrColumns, clazz, createTD, getEditColumn) {
        //
        // create a $TR element
        //
        var tr = $('<tr class="' + clazz + '"></tr>');

        tr.append(getEditColumn(cellsOrColumns));

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
          row.values,
          '',
          gridManager.createCellTD,
          gridManager.getEditRowButton
        );
      };

      gridManager.setFormatInRow = function(tr) {
        // TODO: implement this.
      };

      var format = function(data) {
        data = data.split('\n');
        for(var i = 0, count = data.length; i < count; i += 1) {
          if(/^[Rr]espuesta/g.exec(data[i])) {
            data[i] = "<span style='color: green;'>" + data[i] + "</span>";
          }
          else if(/^[Mm]ercado[Ll]ibre/g.exec(data[i])) {
            var v = data[i].split('-');
            if(v.length>1) {
              v[0] = "<span style='color: mediumblue;'>" + v[0] + "</span>";
              v[1] = "<span style='color: orangered;'>" + v[1] + "</span>";
            }
            data[i] = v.join("-");
          }
        }
        data = data.join('<br>');
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; margin-left: 100px; margin-bottom: 10px; max-width: 800px;">'+
          '<tr>'+
          '<td>Observaciones:</td>'+
          '</tr><tr>'+
          '<td>'+ data +'</td>'+
          '</tr>'+
          '</table>';
      };

      gridManager.showRowDetails = function(tr) {
        var text = tr.childNodes[tr.childNodes.length-1].innerHTML;
        if(text !== "") {
        var row = gridManager.dataTable.row(tr);
          row.child( format(text) ).show();
        }
      };

      gridManager.showDetails = function() {
        if(self.rows.length > 0 &&
           self.columns[self.columns.length-1].name.toLowerCase() === "observaciones") {

          var rows = $('tr', gridManager.body);
          for(var i = 0, count = rows.length; i < count; i += 1) {
            gridManager.showRowDetails(rows[i]);
          }
        }
      };

      gridManager.createDataTable = function() {
        var buttons = [];
        var scrollX = false;
        var scrollY = 0;
        var rowSelect = "multi";

        if(!Cairo.isMobile()) {
          buttons = [ "select_all", "select_none"];
          scrollX = true;
          scrollY = $(window).height() - 330;
          rowSelect = "os";
        }

        var dom = 'T<"clear">lrtip';
        var order = [[ 1, "asc" ]];
        var dataTableSettings = {
          scrollY: scrollY,
          paging: false,
          scrollX: scrollX,
          "language": {
            "search": "Search in this folder: "
          },
          dom: dom,
          tableTools: {
            "sRowSelect": rowSelect,
            "aButtons": buttons
          },/*
           fnDrawCallback: function( oSettings ) {
           $(listController.Tree.dataTableId$ + " tbody tr").contextMenu(menu, {theme:'osx'});
           },*/
          order: order,
          destroy: true
        };

        gridManager.dataTable = $(that.getElement()).DataTable(dataTableSettings);

        gridManager.showDetails();
      };

      //
      // end grid manager
      //

      var createListGrid = function() {
        if(gridManager.dataTable) {
          gridManager.dataTable.destroy(true);
        }
        var oldGrid = that.getElement();
        if(oldGrid) {
          oldGrid.remove();
        }
        var newGrid = $("<table class='document-list-grid'></table>");
        that.setElement(newGrid);
        self.container.append(newGrid);
      }

      that.load = function(data) {

        createListGrid();

        self.columns = data.get('columns');
        self.rows = data.get('rows');

        gridManager.head = getTableSection(that.getElement(), 'list-dialog-grid-head', 'thead');
        gridManager.body = getTableSection(that.getElement(), 'list-dialog-grid-body', 'tbody');

        //
        // remove all rows and columns
        //
        removeChildren(gridManager.head);
        removeChildren(gridManager.body);

        //
        // columns and cells
        //
        var isHidden = function(col) {
          var name = col.name.toLowerCase();
          return name.indexOf('_id') > -1 || name === 'typetask' || name === 'observaciones';

        }
        var visibleToArray = function(col, i) {
          gridManager.hiddenStatus[i] = isHidden(col) ? " hidden" : "";
        };
        self.columns.forEach(visibleToArray);

        //
        // add columns
        //
        gridManager.head.append(
          gridManager.createTR(
            self.columns,
            '',
            gridManager.createColumnTD,
            gridManager.getEditColumnTitle
          ));

        //
        // add rows
        //
        gridManager.body.append(self.rows.map(gridManager.addRow));

        //
        // Datatables.net
        //
        gridManager.createDataTable();

        $('.js-edit', gridManager.body).click(onEdit);
        $('.js-delete', gridManager.body).click(onDelete);
      };

      var onDelete = function(event) {
        var button = $(event.currentTarget);
        var args = {
          id: button.data('row-id')
        };
        var row = gridManager.dataTable.row(button.closest('tr')[0])
        raiseEventAndThen(
          'onDeleteRow',
          args,
          thenIfSuccessCall(deleteRow, row)
        );
      };

      var deleteRow = function(row) {
        try {
          row.remove().draw();
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "deleteRow", "listGrid", "");
        }
      };

      var onEdit = function(event) {
        var button = $(event.currentTarget);
        var args = {
          id: button.data('row-id')
        };
        var row = gridManager.dataTable.row(button.closest('tr')[0])
        raiseEvent(
          'onEditRow',
          args
        );
      };

      that.setShowEditButtons = function(show) {
        self.showEditButtons = show;
      }

      that.setContainer = function(container, view) {
        self.container = container;
        setListeners(view);
      }

      that.clear = function() { /* TODO: implement this. */ };

      return that;
    };

    Controls.createListGrid = function() {

      var self = {
        objectType: "cairo.controls.listGrid"
      };

      var that = createListGrid();

      that.getObjectType = function() {
        return self.objectType;
      };

      return that;
    };

  });

}());