(function() {
  "use strict";

  Cairo.module("ProductoSerie.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var m_idDialog = 0;

    var createObject = function() {

      m_idDialog += 1;

      var self = {};

      var Dialogs = Cairo.Dialogs;
      var P = Cairo.Promises;
      var cellId = Dialogs.cellId;
      var M = Cairo.Modal;
      var Types = Cairo.Constants.Types;
      var valEmpty = Cairo.Util.valEmpty;
      var CS = Cairo.Security.Actions.General;
      var val = Cairo.Util.val;
      var getCell = Dialogs.cell;
      var U = Cairo.Util;
      var NO_ID = Cairo.Constants.NO_ID;
      var call = P.call;
      var C = Cairo.General.Constants;
      var DB = Cairo.Database;
      var valField = DB.valField;

      var C_MODULE = "cProductoSerie";

      var C_ITEMS = "Items";
      var C_NRO_SERIE = "NroS";
      var C_LOAD_EX = "LoadEx";
      var C_PASTE_XLS = "PasteXls";
      var C_NO_FILTER_DEPL = "NoFilterDepl";

      var K_ITEMS = 1;
      var K_CMD_EDIT_EX = 2;
      var K_PASTE_FROM_XLS = 3;
      var K_NO_FILTER_DEPL = 4;

      var KI_PRNS_ID = 1;
      var KI_NUMERO = 2;
      var KI_NUMERO2 = 10;
      var KI_NUMERO3 = 11;
      var KI_DESCRIP = 3;
      var KI_FECHA_VTO = 4;
      var KI_KIT_ITEM = 5;
      var KI_DELETE = 6;

      var m_serialNumbers = Cairo.Collections.createCollection(Cairo.ProductoSerieType.createObject);

      var m_dialog;
      var m_isInput;
      var m_prId = 0;
      var m_deplId = 0;
      var m_depfId = 0;
      var m_ctrlStock;
      var m_isEditKit;
      var m_isParteProdKit;
      var m_provId = 0;
      var m_cliId = 0;
      var m_isDelete;
      var m_deleteCount = 0;

      var m_apiPath = DB.getAPIVersion();

      self.getSerialNumbers = function() {
        return m_serialNumbers;
      };

      self.setSerialNumbers = function(rhs) {
        m_serialNumbers = rhs;
      };

      self.setIsInput = function(rhs) {
        m_isInput = rhs;
      };

      self.setPrId = function(rhs) {
        m_prId = rhs;
      };

      self.setDeplId = function(rhs) {
        m_deplId = rhs;
      };

      self.setIsEditKit = function(rhs) {
        m_isEditKit = rhs;
      };

      self.setIsParteProdKit = function(rhs) {
        m_isParteProdKit = rhs;
      };

      self.setProvId = function(rhs) {
        m_provId = rhs;
      };

      self.setCliId = function(rhs) {
        m_cliId = rhs;
      };

      self.setDelete = function(rhs) {
        m_isDelete = rhs;
      };

      self.setDeleteCount = function(rhs) {
        m_deleteCount = rhs;
      };

      self.addProductoSerie = function(pt) {
        try {

          var pt2 = Cairo.ProductoSerieType.createObject();

          pt2.setCode(pt.getCode());
          pt2.setCode2(pt.getCode2());
          pt2.setCode3(pt.getCode3());
          pt2.setDescrip(pt.getDescrip());
          pt2.setFechaVto(pt.getFechaVto());
          pt2.setPrnsId(pt.getPrnsId());
          pt2.setPrIdItem(pt.getPrIdItem());
          pt2.setPrIdKit(pt.getPrIdKit());
          pt2.setKitItem(pt.getKitItem());

          m_serialNumbers.add(pt2);

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "addProductoSerie", C_MODULE, "");
        }
      };

      self.edit = function() {
        var p = null;
        
        try {

          m_dialog = Cairo.Dialogs.Views.Controller.newDialog();
          m_dialog.setOkCancelDialog(true);
          m_dialog.setNoAskForSave(true);
          m_dialog.setInModalWindow(true);

          p = getDepfId()
            .then(call(loadCollection))
            .then(function () {
              return m_dialog.getOkCancelDialogResult();
            });
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "Edit", C_MODULE, "");
        }
        
        return p || P.resolvedPromise(false);
      };

      self.copy = function() {

      };

      self.editNew = function() {

      };

      self.getApplication = function() {
        return Cairo.Application.getName();
      };

      self.editDocumentsEnabled = function() {
        return false;
      };

      self.copyEnabled = function() {
        return false;
      };

      self.addEnabled = function() {
        return false;
      };

      self.showDocDigital = function() {

      };

      self.messageEx = function(messageId, info) {
        var p = null;

        switch (messageId) {

          case Dialogs.Message.MSG_GRID_VIRTUAL_ROW:

            p = P.resolvedPromise(info);
            break;
        }

        return p || P.resolvedPromise();
      };

      self.discardChanges = function() {
        return Cairo.Promises.resolvedPromise(refreshCollection());
      };

      self.propertyChange = function(key) {
        var p = null;          
        switch (key) {
          case K_CMD_EDIT_EX:
            p = editByRange();
            break;

          case K_PASTE_FROM_XLS:
            p = pasteFromXLS();
            break;
        }
        return p || P.resolvedPromise();
      };

      self.save = function() {
        return saveItems();
      };

      self.terminate = function() {

      };

      self.getPath = function() {
        return "#general/productoserie/" + m_idDialog.toString();
      };

      self.getEditorName = function() {
        var id = m_idDialog ? m_idDialog.toString() : "N" + (new Date).getTime().toString();
        return "productoserie" + id;
      };

      self.getTitle = function() {
        return Cairo.Language.getText(2890, ""); // Números de serie
      };

      self.validate = function() {
        var deleteCount = 0;

        var prop = getItems();
        var rows = prop.getGrid().getRows();

        var _count = rows.size();

        for (var _i = 0; _i < _count; _i++) {
          var row = rows.item(_i);

          if(cellId(row, KI_DELETE)) {
            deleteCount += 1;
          }
        }

        if(m_deleteCount != deleteCount) {

          if(m_deleteCount > 1) {
            M.showInfo(Cairo.Language.getText(2891, "", m_deleteCount));
            // Ud. ha marcado más números de serie que los requeridos.
            // (solo se eliminarán los primeros {{m_deleteCount}} marcados empezando a contar desde la fila 1.);
          }
          else {
            M.showInfo(Cairo.Language.getText(2892, ""));
            // Ud. ha maracado más números de serie que los requeridos.
            // (solo se eliminará el primer número marcado empezando a contar desde la fila 1.);
          }

          deleteCount = 0;
          for (var _i = 0; _i < _count; _i++) {
            row = rows.item(_i);

            if(deleteCount >= m_deleteCount) {
              getCell(row, KI_DELETE).setId(0);
            }
            else {
              if(getCell(row, KI_DELETE).getId()) {
                deleteCount += 1;
              }
            }
          }

          m_dialog.showValue(prop);

        }
        else if(m_deleteCount > deleteCount) {

          M.showInfo(Cairo.Language.getText(2893, "")); // Debe marcar los números a eliminar.

        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var getItems = function() {
        return m_dialog.getProperties().item(C_ITEMS);
      };

      self.columnAfterEdit = function(key, lRow, lCol, newValue, newValueId) {
        // it is isn't a purchase invoice/delivery notice the serial number
        // must come from the database ( table ProductoNumeroSerie )
        // and becuase the first column is used to track prns_id we need
        // to update it
        //
        if(!m_isInput) {
          switch (key) {
            case K_ITEMS:
              var grid = getItems().getGrid();
              if(grid.getColumns().item(lCol).getKey() === KI_NUMERO) {
                var row = grid.getRows().item(lRow);
                getCell(row, KI_PRNS_ID).setValue(newValueId);
              }
              break;
          }
        }
        return P.resolvedPromise(true);
      };

      self.columnBeforeEdit = function(key, lRow, lCol, iKeyAscii) {
        //
        // by default all columns can be edited
        //
        var rtn = true;
        
        try {

          var property = getItems();
          var column = property.getGrid().getColumns().item(lCol);

          // the KI_KIT_ITEM column __CAN_NOT__ be edited
          //
          if(column.getKey() === KI_KIT_ITEM) {
            rtn = false;
          }
          //
          // before editing the serial numbers we need to update the filter
          //
          else if(column.getKey() === KI_NUMERO) {
            var row = property.getGrid().getRows().item(lRow);
            column.setSelectFilter(Cairo.Database.sqlString(getFilter(row, lRow)));
            m_dialog.refreshColumnProperties(property, C_NRO_SERIE);
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnBeforeEdit ", C_MODULE, "");
        }

        return P.resolvedPromise(rtn);
      };

      self.columnButtonClick = function(key, lRow, lCol, iKeyAscii) {

      };

      self.columnAfterUpdate = function(key, lRow, lCol) {
        return P.resolvedPromise(true);
      };

      self.columnClick = function(key, lRow, lCol) {

      };

      self.gridDblClick = function(key, lRow, lCol) {
        return P.resolvedPromise(false);
      };

      self.deleteRow = function(key, row, lRow) {
        return P.resolvedPromise(false);
      };

      self.newRow = function(key, rows) {
        return P.resolvedPromise(false);
      };

      self.validateRow = function(key, row, rowIndex) {
        var p = null;

        try {

          switch (key) {

            case K_ITEMS:
              p = validateRow(row, rowIndex);
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, C_ValidateRow, C_MODULE, "");
        }

        return p || P.resolvedPromise(false);
      };

      self.isEmptyRow = function(key, row, rowIndex) {
        //
        // no row can be empty. the user must input all serial numbers
        //
        return P.resolvedPromise(false);
      };

      var validateRow = function(row, rowIndex) {
        var strRow = " (Row: " + rowIndex.toString() + ")";
        for (var _i = 0, _count = row.size(); _i < _count; _i++) {
          var cell = row.item(_i);
          
          switch (cell.getKey()) {
            
            case KI_NUMERO:
              if(m_isInput) {
                if(valEmpty(cell.getValue(), Types.text)) {
                  return M.showInfoWithFalse(Cairo.Language.getText(1630, "", strRow)); // Debe indicar un número de serie (1)
                }
              }
              else {
                if(valEmpty(cell.getId(), Types.id) || cell.getId() < 0) {
                  return M.showInfoWithFalse(Cairo.Language.getText(2894, "", strRow)); // Debe indicar un Número de Serie existente (1)
                }
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var loadCollection = function() {

        var properties = m_dialog.getProperties();
        properties.clear();

        var elem = properties.add(null, C_ITEMS);
        elem.setType(Dialogs.PropertyType.grid)
          .hideLabel()
          .setName(C_ITEMS)
          .setKey(K_ITEMS)
          .setGridEditEnabled(true);

        setGridItems(elem);
        loadItems(elem);

        if(! m_isDelete) {
          properties.add(null, C_LOAD_EX)
            .setType(Dialogs.PropertyType.button)
            .setName(Cairo.Language.getText(2895, "")) // Cargar números por rango
            .hideLabel()
            .setKey(K_CMD_EDIT_EX);

          properties.add(null, C_PASTE_XLS)
            .setType(Dialogs.PropertyType.button)
            .setName(Cairo.Language.getText(1982, "")) // Pegar desde Excel
            .hideLabel()
            .setKey(K_PASTE_FROM_XLS);

          properties.add(null, C_NO_FILTER_DEPL)
            .setType(Dialogs.PropertyType.check)
            .setName(Cairo.Language.getText(2896, "")) // No Filtrar por Depósitos
            .setKey(K_NO_FILTER_DEPL)
            .setVisible(Cairo.Security.silentHasPermissionTo(CS.SELECT_SERIE_EX));
        }

        if(m_isDelete) {
          if(m_deleteCount > 1) {
            m_dialog.setTitle(Cairo.Language.getText(2897, "", m_deleteCount)); // Indique los {{m_DeleteCount}} números de serie a eliminar
          }
          else {
            m_dialog.setTitle(Cairo.Language.getText(2898, "")); // Indique el número a eliminar
          }
        }

        return m_dialog.showModal(self);
      };

      var refreshCollection = function() {
        var properties = m_dialog.getProperties();

        var property = properties.item(C_ITEMS);
        loadItems(property);

        return m_dialog.showValues(properties);
      };

      var setGridItems = function(property) {

        var columns = property.getGrid().getColumns();

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PRNS_ID);

        elem = columns.add(null);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Language.getText(2899, "")); // Item
        elem.setVisible(m_isEditKit);
        elem.setKey(KI_KIT_ITEM);

        elem = columns.add(null, C_NRO_SERIE);
        elem.setName(Cairo.Language.getText(1065, "")); // Numero
        if (m_isInput) {
          elem.setType(Dialogs.PropertyType.text);
        }
        else {
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.NUMEROS_DE_SERIE);
        }
        elem.setEnabled(! m_isDelete);
        elem.setKey(KI_NUMERO);

        elem = columns.add(null);
        elem.setName(Cairo.Language.getText(1983, "")); // Borrar
        elem.setType(Dialogs.PropertyType.check);
        elem.setKey(KI_DELETE);
        elem.setVisible(m_isDelete);

        elem = columns.add(null);
        elem.setName(Cairo.Language.getText(2900, "")); // Número 2
        elem.setType(Dialogs.PropertyType.text);
        elem.setVisible(! m_isDelete);
        elem.setKey(KI_NUMERO2);

        elem = columns.add(null);
        elem.setName(Cairo.Language.getText(2901, "")); // Número 3
        elem.setType(Dialogs.PropertyType.text);
        elem.setVisible(! m_isDelete);
        elem.setKey(KI_NUMERO3);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setVisible(! m_isDelete);
        elem.setKey(KI_DESCRIP);

        elem = columns.add(null);
        elem.setName(Cairo.Language.getText(2902, "")); // Fecha Vto.
        elem.setType(Dialogs.PropertyType.date);
        elem.setVisible(! m_isDelete);
        elem.setKey(KI_FECHA_VTO);

        property.getGrid().getRows().clear();
      };

      var loadItems = function(property) {

        var rows = property.getGrid().getRows();

        rows.clear();

        for (var _i = 0, _count = m_serialNumbers.size(); _i < _count; _i++) {
          var pt = m_serialNumbers.item(_i);

          var row = rows.add(null, pt.getPrnsId());

          var elem = row.add(null);
          elem.setValue(pt.getPrnsId());
          elem.setKey(KI_PRNS_ID);

          elem = row.add(null);
          elem.setValue(pt.getKitItem());
          elem.setId(pt.getPrIdItem());
          elem.setKey(KI_KIT_ITEM);

          elem = row.add(null);
          elem.setValue(pt.getCode());
          elem.setId(pt.getPrnsId());
          elem.setKey(KI_NUMERO);

          elem = row.add(null);
          elem.setId(pt.getDeleted());
          elem.setKey(KI_DELETE);

          elem = row.add(null);
          elem.setValue(pt.getCode2());
          elem.setKey(KI_NUMERO2);

          elem = row.add(null);
          elem.setValue(pt.getCode3());
          elem.setKey(KI_NUMERO3);

          elem = row.add(null);
          elem.setValue(pt.getDescrip());
          elem.setKey(KI_DESCRIP);

          elem = row.add(null);
          elem.setValue(pt.getFechaVto());
          elem.setKey(KI_FECHA_VTO);
        }

        return true;
      };

      var saveItems = function() {

        var rows = getItems().getGrid().getRows();

        for (var _i = 0, _count = rows.size(); _i < _count; _i++) {
          var row = rows.item(_i);
          var pt = m_serialNumbers.item(_i);

          for (var _j = 0, _countj = row.size(); _j < _countj; _j++) {
            var cell = row.item(_j);

            switch (cell.getKey()) {

              case KI_DESCRIP:
                pt.setDescrip(cell.getValue());
                break;

              case KI_NUMERO:
                pt.setCode(cell.getValue());
                break;

              case KI_NUMERO2:
                pt.setCode2(cell.getValue());
                break;

              case KI_NUMERO3:
                pt.setCode3(cell.getValue());
                break;

              case KI_FECHA_VTO:
                pt.setFechaVto(cell.getValue());
                break;

              case KI_PRNS_ID:
                pt.setPrnsId(val(cell.getValue()));
                break;

              case KI_DELETE:
                pt.setDeleted(cell.getId());
                break;
            }
          }
        }

        return validateUnique();
      };

      var validateUnique = function() {

        var collAux = Cairo.Collections.createCollection(Cairo.ProductoSerieType.createObject);
        var q = 0;
        var series = "";
        var notUnique = false;

        for (var _i = 0, _count = m_serialNumbers.size(); _i < _count; _i++) {
          var pt = m_serialNumbers.item(_i);

          if(! collAux.addIfNotExists(pt, "k" + pt.getPrnsId().toString())) {
            series += pt.getCode() + ", ";
            q += 1;
            notUnique = true;
          }
        }

        if(notUnique) {
          series = Cairo.Util.removeLastColon(Cairo.String.rtrim(series));
          if(q > 1) {
            M.showWarning(Cairo.Language.getText(2903, "", series)); // Los números de serie {{ series }} están indicados más de una vez
          }
          else {
            M.showWarning(Cairo.Language.getText(2904, "", series)); // El número de serie {{ series }}  está indicado más de una vez
          }
          return false;
        }

        return true;
      };

      var pasteFromXLS = function() {

        return M.getPasteData().whenSuccess(function(pasteData) {

          var data = pasteData.split("\n");

          if(data.length < 1) { return; }
          var items = getItems();

          var firstRow = items.getSelectedRow();
          if(firstRow < 0) { firstRow = 0; }

          var p = P.resolvedPromise(true);

          for(var i = firstRow, count = m_serialNumbers.size(), q = 0; i <= count; i++, q++) {

            if(q >= data.length) { break; }

            var row = items.getGrid().getRows(i);

            getCell(row, KI_NUMERO).setValue(data[q]);

            if(! m_isInput) {
              p = p.whenSuccess(setPrnsId(row));
            }
          }

          p.whenSuccess(m_dialog.showValue(items, true));
        });
      };

      var editByRange = function() {

        var prnsRange = Cairo.ProductoSerieRange.createObject();

        return prnsRange.edit().whenSuccess(function() {

          var items = getItems();

          var bByChar = prnsRange.getByChar();
          var first = prnsRange.getFirst();
          var last = prnsRange.getLast();

          //-----------------
          // TODO: not implemented yet
          if(bByChar) {
            return M.showInfoWithFalse(Cairo.Language.getText(1986, "")); // Esta opción aún no esta implementada
          }

          var rows = items.getGrid().getRows();

          var current = U.isNumeric(first) ? getFirstSerie(first) : first;
          var valueAux = getFirstSerie(first);

          var firstRow = items.getSelectedRow();
          if(firstRow < 0) { firstRow = 0; }

          var p = P.resolvedPromise(true);

          for(var i = firstRow; i < m_serialNumbers.size(); i++) {
            var inc = increment(current, bByChar, valueAux);
            valueAux = inc.valueAux;
            current = inc.current;

            var row = rows.item(i);

            if(finished(current, last)) { break; }

            getCell(row, KI_NUMERO).setValue(current);

            if(! m_isInput) {
              p = p.whenSuccess(setPrnsId(row));
            }
          }

          p.whenSuccess(m_dialog.showValue(items, true));
        });
      };

      var finished = function(current, last) {
        var rtn = false;

        if(U.isNumeric(last) && U.isNumeric(current)) {
          rtn = val(last) < val(current);
        }
        else {
          rtn = last < current;
        }

        return rtn;
      };

      var getFirstSerie = function(first) {
        var rtn = "";

        if(U.isNumeric(first)) {

          var strZeroLeft = "";

          if(val(first).toString().length < first.length) {
            strZeroLeft = first.substr(0, first.length - val(first).toString().length);
          }

          rtn = strZeroLeft + (Math.abs(val(first) - 1)).toString();
        }
        else {
          var aux = "";
          var n = 0;
          do {
            n = n + 1;
            aux = first.substr(first.length - n);
          } while (!U.isNumeric(aux));
          aux = aux.substr(1);
          if(U.isNumeric(aux)) {
            rtn = val(aux) - 1;
          }
          else {
            rtn = 0;
          }
        }
        return rtn.toString();
      };

      var increment = function(value, bByChar, valueAux) {

        if(! bByChar) {
          var strZeroLeft = "";

          if(U.isNumeric(value)) {

            if(val(value).toString().length < value.length) {
              strZeroLeft = value.substr(0, value.length - (val(value) + 1).toString().length);
            }

            value = strZeroLeft + (U.val(value) + 1).toString();
          }
          else {
            valueAux += 1;
            var strNumber = valueAux.toString();
            var length = value.length - strNumber.length;

            if(length < 0) { length = 0; }

            value = value.substr(0, length);
            value = value + strNumber;
          }
        }

        return {valueAux: valueAux, current: value };
      };

      var getDepfId = function() {
        var p = null;

        m_depfId = NO_ID;

        if(m_deplId === NO_ID) {
          m_ctrlStock = Cairo.Stocks.Constants.ControlStock.NoControlaStock;
        }
        else {

          p = DB.getData("load[" + m_apiPath + "general/depositologico/" + m_deplId.toString() + "/info]");

          p = p.then(function(response) {
            if(response.success === true) {
              m_depfId = valField(response.data, C.DEPF_ID);
              m_ctrlStock = Cairo.getStockConfig().getControlStock();
            }
            return response.success;
          });
        }
        return p || P.resolvedPromise(true);
      };

      self.initialize = function() {

      };

      self.destroy = function() {
        m_serialNumbers = null;
        m_dialog = null;
      };

      var setPrnsId = function(row) {
        var prnsCodigo = getCell(row, KI_NUMERO).getValue();
        var p = DB.getData("load[" + m_apiPath + "general/productonumeroserie/by_code/]", prnsCodigo);

        return p.then(function(response) {
          var prnsId = NO_ID;
          if(response.success === true) {
            prnsId = valField(response.data, C.PRNS_ID);
            getCell(row, KI_NUMERO).setId(prnsId);
            getCell(row, KI_PRNS_ID).setValue(prnsId);
          }
          return response.success;
        });
      };

      var getFilter = function(row, lRow) {
        var pt = m_serialNumbers.get(lRow);
        return "serial_number|" +
          "editKit:" + U.boolToInt(m_isEditKit) +
          ",parteProdKit:" + U.boolToInt(m_isParteProdKit) +
          ",prIdKit:" + pt.getPrIdKit() +
          ",prnsId:" + pt.getPrnsId() +
          ",noFilterDepl:" + U.boolToInt(getNoFilterDepl()) +
          ",deplId:" + m_deplId +
          ",depfId:" + m_depfId +
          ",cliId:" + m_cliId +
          ",provId:" + m_provId +
          ",rowPrId:" + getCell(row, KI_KIT_ITEM).getId() +
          ",prId:" + m_prId +
          ",ctrlStock:" + m_ctrlStock;
      };

      /*
      var getFilter2 = function(row, lRow) {
        var filter = "";
        var pt = m_serialNumbers.get(lRow);

        if(m_bEditKit && !m_bParteProdKit) {
          // Tiene que ser un numero de serie asociado a un kit de este tipo de pr_id
          //
          filter = C.PR_ID + " = "+ getCell(row, KI_KIT_ITEM).getId().toString() + " and pr_id_kit = " + m_prId;

        }
        else if(m_bParteProdKit) {
          // Tiene que ser un numero de serie que no este asociado a ningun kit o
          // asociado a un kit que componga al kit que estamos editando
          //
          filter = Cairo.General.Constants.PR_ID+ " = "+ getCell(row, KI_KIT_ITEM).getId();
          if(pt.getPrIdKit() != 0) {
            filter = filter+ " and pr_id_kit = "+ pt.getPrIdKit().toString();
          }
          else {
            filter = filter+ " and pr_id_kit is null";
          }

        }
        else {
          // Tiene que ser un numero de serie que no este asociado a ningun kit
          //
          filter = C.PR_ID+ " = "+ m_prId+ " and pr_id_kit is null";
        }

        var bNoFilterDepl = getNoFilterDepl();

        if(!bNoFilterDepl) {

          // Los contra-documentos (devoluciones y notas de credito) envian
          // el deposito del tercero y el cliente o proveedor segun corresponda
          //
          if(m_deplId === csE_DepositosInternos.cSEDEPLIDTERCERO) {

            filter = filter+ " and depl_id = "+ csE_DepositosInternos.cSEDEPLIDTERCERO.toString();

            if(m_cliId != NO_ID) {
              filter = filter+ " and cli_id = "+ m_cliId;

            }
            else if(m_provId != NO_ID) {

              filter = filter+ " and (prov_id = "+ m_provId+ " or prov_id is null)";
            }

          }
          else {
            // No puede estar en depositos internos del sistema
            //
            filter = filter+ " and depl_id not in (-2,-3)";
          }

          if(m_deplId != NO_ID) {
            // Este 'OR' es momentaneo hasta
            // que el control de stock este estable
            //
            if(m_ctrlStock === csEStockFisico || m_ctrlStock === csENoControlaStock) {
              // Si me indico un deposito y el stock es por deposito fisico
              // exijo que el numero de serie este en algun deposito logico
              // del deposito fisico al que pertenece el deposito logico
              // que me pasaron.
              //
              filter = filter+ " and "+ Cairo.General.Constants.DEPL_ID+ " in (select depl_id from depositoLogico where depf_id = "+ m_depfId+ ")";

              // Sino es por deposito fisico exijo que este
              // en el deposito logico que me pasaron
              //
            }
            else if(m_ctrlStock === csEStockLogico) {
              filter = filter+ " and "+ Cairo.General.Constants.DEPL_ID+ " = "+ m_deplId;
            }

          }
          else {
            filter = filter+ " and (1=2)";
          }

        }

        if(pt.getPrnsId()) {
          filter = "("+ filter+ ") or (prns_id = "+ pt.getPrnsId().toString()+ ")";
        }

        return filter;
      };
      */
      var getNoFilterDepl = function() {
        return Cairo.Util.val(m_dialog.getProperties().item(C_NO_FILTER_DEPL).getValue());
      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });
/*
  Cairo.module("ProductoSerie.List", function(List, Cairo, Backbone, Marionette, $, _) {
    List.Controller = {
      list: function() {

        var self = this;

        / *
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         * /
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.productoserieEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.productoserieEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "ProductoSeries",
            entityName: "productoserie",
            entitiesName: "productoseries"
          });

          self.showBranch = function(branchId) {
            Cairo.log("Loading nodeId: " + branchId);
            Cairo.Tree.List.Controller.listBranch(branchId, Cairo.Tree.List.Controller.showItems, self);
          };

          self.addLeave = function(id, branchId) {
            try {
              Cairo.Tree.List.Controller.addLeave(branchId, id, self);
            }
            catch(ignore) {
              Cairo.log("Error when adding this item to the branch\n\n" + ignore.message);
            }
          };

          self.refreshBranch = function(id, branchId) {
            try {
              Cairo.Tree.List.Controller.refreshBranchIfActive(branchId, id, self);
            }
            catch(ignore) {
              Cairo.log("Error when refreshing a branch\n\n" + ignore.message);
            }
          };

          var getIndexFromEditor = function(editor) {
            var count = editors.count();
            for(var i = 0; i < count; i += 1) {
              if(editors.item(i).editor === editor) {
                return i;
              }
            }
            return -1;
          };

          self.removeEditor = function(editor) {
            var index = getIndexFromEditor(editor);
            if(index >= 0) {
              editors.remove(index);
            }
          };

          var getKey = function(id) {
            if(id === NO_ID) {
              return "new-id:" + (new Date).getTime().toString()
            }
            else {
              return "k:" + id.toString();
            }
          };

          self.updateEditorKey = function(editor, newId) {
            var index = getIndexFromEditor(editor);
            if(index >= 0) {
              var editor = editors.item(index);
              editors.remove(index);
              var key = getKey(newId);
              editors.add(editor, key);
            }
          };

          self.edit = function(id, treeId, branchId) {
            var key = getKey(id);
            if(editors.contains(key)) {
              editors.item(key).dialog.showDialog();
            }
            else {
              var editor = Cairo.ProductoSerie.Edit.Controller.getEditor();
              var dialog = Cairo.Dialogs.Views.Controller.newDialog();

              editor.setTree(self);
              editor.setDialog(dialog);
              editor.setTreeId(treeId);
              editor.setBranchId(branchId);
              editor.edit(id);

              editors.add({editor: editor, dialog: dialog}, key);
            }
          };

          self.destroy = function(id, treeId, branchId) {
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_PRODUCTOSERIE)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            var apiPath = Cairo.Database.getAPIVersion();
            return Cairo.Database.destroy(apiPath + "general/productoserie", id, Cairo.Constants.DELETE_FUNCTION, "ProductoSerie").success(
              function() {
                try {
                  var key = getKey(id);
                  if(editors.contains(key)) {
                    editors.item(key).dialog.closeDialog();
                  }
                }
                catch(ignore) {
                  Cairo.log('Error closing dialog after delete');
                }
                return true;
              }
            );
          };

          // progress message
          //
          Cairo.LoadingMessage.show("ProductoSeries", "Loading productoserie from Crowsoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ productoserieTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.PRODUCTOSERIE,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.productoserieTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("ProductoSeries", "productoserieTreeRegion", "#general/productoseries", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });
*/

}());
