(function() {
  "use strict";

  Cairo.module("Controls", function(Controls, Cairo, Backbone, Marionette, $, _) {

    var createListGrid = function() {
      var self = {
        container: null,
        columns: [],
        rows: []
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

      /* TODO: FIX ME duplicated functions in grid.js */
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

      gridManager.getValue = function(cell, col) {
        switch(col.columnType) {
          case 'boolean':
            return getCheckboxIcon(cell);
          case 'timestamp':
          case 'timestamptz':
          case 'time':
          case 'date':
            return getDateFormatted(cell);
          case 'decimal':
          case 'numeric':
          case 'real':
          case 'double':
            return Cairo.accounting.formatNumber(cell, 2);
          case 'integer':
          case 'int2':
          case 'int4':
          case 'smallint':
          case 'biginteger':
          case 'serial':
          case 'bigserial':
            return Cairo.accounting.formatNumber(cell);
          default:
            return cell;
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
      }

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
          row.values,
          '',
          gridManager.createTD(gridManager.getValue, 'td', gridManager.getClassForCell));
      };

      gridManager.setFormatInRow = function(tr) {
        // TODO: implement this.
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
            gridManager.createTD(gridManager.getColumnTitle, 'th', gridManager.getClassForColumn)));

        //
        // add rows
        //
        gridManager.body.append(self.rows.map(gridManager.addRow));

        //
        // Datatables.net
        //
        gridManager.createDataTable();
      };

      that.setContainer = function(container) {
        self.container = container;
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