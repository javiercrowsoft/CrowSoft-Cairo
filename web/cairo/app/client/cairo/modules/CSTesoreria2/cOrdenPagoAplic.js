(function() {
  "use strict";

  Cairo.module("OrdenPagoAplic.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var TITLE = getText(2198, ""); // Aplicación Orden de Pago
      var SAVE_ERROR_MESSAGE = getText(2200, ""); // Error al grabar la orden de pago

      var Dialogs = Cairo.Dialogs;

      var C_MODULE = "cOrdenPagoAplic";

      var P = Cairo.Promises;
      var C = Cairo.General.Constants;
      var CT = Cairo.Tesoreria.Constants;
      var CC = Cairo.Compras.Constants;
      var getCell = Dialogs.cell;
      var cellFloat = Dialogs.cellFloat;
      var val = Cairo.Util.val;
      var D = Cairo.Documents;
      var M = Cairo.Modal;
      var DB = Cairo.Database;
      var NO_ID = Cairo.Constants.NO_ID;
      var Types = Cairo.Constants.Types;
      var valField = DB.valField;

      var K_APLICACIONES = 1;
      var K_PENDIENTE = 2;
      var K_TOTAL = 3;

      var C_APLICACIONES = "Aplic";
      var C_PENDIENTE = "Pendiente";
      var C_TOTAL = "Total";

      var KI_FCOPG_ID = 1;
      var KI_FCD_ID = 2;
      var KI_FCP_ID = 3;
      var KI_FC_ID = 4;
      var KI_DOC = 5;
      var KI_FECHA = 6;
      var KI_COTIZACION = 7;
      var KI_PENDIENTE = 8;
      var KI_PENDIENTE2 = 9;
      var KI_APLICADO = 10;
      var KI_APLICADO2 = 11;
      var KI_APLICADO3 = 12;

      var m_editing;
      var m_dialog = null;
      var m_total = 0;
      var m_opgId = 0;
      var m_opgNumero = "";
      var m_proveedor = "";
      var m_isAutomatic = false;

      var m_client = null;
      var m_empId = 0;
      var m_empName = "";

      var m_apiPath = DB.getAPIVersion();

      var emptyData = {
        items: []
      };

      var m_data = emptyData;

      self.setClient = function(rhs) {
        m_client = rhs;
      };

      self.getId = function() {
        return m_opgId;
      };

      self.show = function(opgId, total, opgNumero, proveedor, empId, empName, isAutomatic) {

        if(m_dialog === null) {
          m_dialog = Cairo.Dialogs.Views.Controller.newDialog();
        }

        if(m_opgId !== opgId) {
          m_opgId = opgId;
          m_opgNumero = opgNumero;
          m_proveedor = proveedor;
          m_total = total;
          m_isAutomatic = isAutomatic;
          m_empId = empId;
          m_empName = empName;

          return edit();
        }
        else {
          m_dialog.focus();
          return P.resolvedPromise(true);
        }
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
        return false;
      };

      self.messageEx = function(messageID, info) {
        var p = null;

        switch (messageID) {

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
        return Cairo.Promises.resolvedPromise(false);
      };

      self.save = function() {

        // automatic applications
        //
        if(m_isAutomatic) {
          return M.showWarning(getText(3580, ""));
          // Esta orden de pago fue generada automáticamente por una factura no se puede modificar su aplicación.
        }

        if(m_empId !== Cairo.Company.getId()) {
          return D.msgApplyDisabled(m_empName);
        }
        
        var register = new DB.Register();

        register.setFieldId(CT.OPG_ID);
        register.setTable(CT.ORDEN_PAGO);
        register.setPath(m_apiPath + "tesoreria/ordenpago/aplic");
        register.setId(m_opgId);

        var fields = register.getFields();

        fields.add(CT.OPG_NUMERO, 0, Types.long);
        fields.add(C.PROV_ID, NO_ID, Types.long);
        fields.add(C.SUC_ID, NO_ID, Types.long);
        fields.add(C.DOC_ID, NO_ID, Types.long);
        fields.add(C.EST_ID, NO_ID, Types.long);
        fields.add(CT.OPG_ID, m_opgId, Types.id);

        saveItems(register);
        var p = saveCtaCte(register);

        return p.whenSuccess(function() {
          return DB.saveTransaction(
            register,
            false,
            "",
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            SAVE_ERROR_MESSAGE
          ).then(

            function(result) {
              if(result.success) {

                if(result.errors) {
                  return M.showWarningWithFalse(result.errors.getMessage());
                }
                else {

                  return load().then(
                    function(success) {

                      if(success) {

                        if(m_client !== null) {
                          m_client.refresh(self, m_opgId);
                        }
                      }
                      return success;
                    }
                  );
                }
              }
              else {
                return false;
              }
            }
          );
        });
      };

      var loadDataFromResponse = function(response) {
        var data = response.data;

        data.items = DB.getResultSetFromData(data.get('items'));

        return data;
      };

      var load = function() {
        return DB.getData("load[" + m_apiPath + "tesoreria/ordenpago/aplic]", m_opgId).then(
          function(response) {
            if(response.success !== true) { return false; }

            if(response.data.id === m_opgId) {

              m_data = loadDataFromResponse(response);

              return true;
            }
          });
      };

      var destroy = function() {
        try {
          m_dialog = null;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");
        }
      };

      self.terminate = function() {

        m_editing = false;

        try {
          if(m_client !== null) {
            // check what we should do here
            //
            m_client.destroyAplicDialog();
          }
        }
        catch (ignored) {
          Cairo.logError('Error in terminate', ignored);
        }

        destroy();
      };

      self.getPath = function() {
        return "#tesoreria/ordenpagoaplic/" + m_opgId.toString();
      };

      self.getEditorName = function() {
        return "ordenpagoaplic" + m_opgId;
      };

      self.getTitle = function() {
        return TITLE + " " + m_opgNumero + " - " + m_proveedor;
      };

      self.getTabTitle = function() {
        return "OPG-" + m_opgNumero;
      };

      self.validate = function() {
        return P.resolvedPromise(true);
      };

      self.isEmptyRow = function(key, row, rowIndex) {
        return P.resolvedPromise(false);
      };

      self.columnAfterUpdate = function(key, lRow, lCol) {
        try {
          if(key == K_APLICACIONES) {
            updateApply(getItemsProperty(), lRow, lCol);
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnAfterUpdate", C_MODULE, "");
        }
        return P.resolvedPromise(true);
      };

      self.columnAfterEdit = function(key, lRow, lCol, newValue, newValueID) {
        return P.resolvedPromise(true);
      };

      self.columnBeforeEdit = function(key, lRow, lCol, iKeyAscii) {
        var rtn = false;

        try {
          if(key == K_APLICACIONES) {
            rtn = applyBeforeEdit(getItemsProperty(), lRow, lCol);
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnBeforeEdit", C_MODULE, "");
        }
        return P.resolvedPromise(rtn);
      };

      self.columnButtonClick = function(key, lRow, lCol, iKeyAscii) {
        return  P.resolvedPromise(false);
      };

      self.columnClick = function(key, lRow, lCol) {

      };

      self.gridDblClick = function(key, lRow, lCol) {
        var p = null;

        try {
          if(key == K_APLICACIONES) {
              var rows = getItemsProperty().getRows();
              p = D.showDocAux(getCell(rows.item(lRow), KI_FC_ID).getId(), "FacturaCompra");
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "dblClick", C_MODULE, "");
        }

        return p || P.resolvedPromise(false);
      };

      self.deleteRow = function(key, row, lRow) {
        return P.resolvedPromise(false);
      };

      self.newRow = function(key, rows) {
        return P.resolvedPromise(false);
      };

      self.validateRow = function(key, row, rowIndex) {
        return P.resolvedPromise(true);
      };

      var edit = function() {
        return load().whenSuccess(function() {
          loadCollection();
          m_editing = true;
          return true;
        });
      };

      var loadCollection = function() {

        m_dialog.getProperties().clear();
        
        var properties = m_dialog.getProperties();
        var elem;

        elem = properties.add(null, C_TOTAL);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);        
        elem.setName(getText(2199, "")); // Importe a Pagar
        elem.setEnabled(false);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setValue(m_total);
        elem.setKey(K_TOTAL);

        elem = properties.add(null, C_PENDIENTE);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);        
        elem.setName(getText(1609, "")); // Pendiente
        elem.setEnabled(false);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(K_PENDIENTE);

        elem = properties.add(null, C_APLICACIONES);
        elem.setType(Dialogs.PropertyType.grid);
        elem.hideLabel();
        setGridAplic(elem);
        loadItems(elem);
        elem.setKey(K_APLICACIONES);
        elem.setGridEditEnabled(true);
        elem.setGridAddEnabled(false);
        elem.setGridRemoveEnabled(false);

        if(!m_dialog.show(self)) { return false; }

        showPendiente();

        return true;
      };

      var refreshCollection = function() {
        var properties = m_dialog.getProperties();

        var property = properties.item(C_APLICACIONES);
        loadItems(property);

        return m_dialog.showValues(properties);
      };

      var setGridAplic = function(property) {
        var grid = property.getGrid();
        var columns = grid.getColumns();
        columns.clear();

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_FCOPG_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_FCD_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_FCP_ID);

        elem = columns.add(null);
        elem.setName(getText(1567, "")); // Documento
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KI_DOC);

        elem = columns.add(null);
        elem.setName(getText(1610, "")); // Comprobante
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KI_FC_ID);

        elem = columns.add(null);
        elem.setName(getText(1569, "")); // Fecha
        elem.setType(Dialogs.PropertyType.date);
        elem.setKey(KI_FECHA);

        elem = columns.add(null);
        elem.setName(getText(1609, "")); // Pendiente
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_PENDIENTE);

        elem = columns.add(null);
        elem.setName(getText(1608, "")); // Aplicado
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_APLICADO);

        elem = columns.add(null);
        elem.setName(getText(1650, "")); // Cotiz.
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(Cairo.Settings.getCurrencyRateDecimalsFormat());
        elem.setKey(KI_COTIZACION);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PENDIENTE2);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_APLICADO2);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_APLICADO3);

        grid.getRows().clear();
      };

      var loadItems = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();

        for(var _i = 0, count = m_data.items.length; _i < count; _i += 1) {

          var row = rows.add(null);

          elem = row.add(null);
          elem.setValue(valField(m_data.items[_i], CT.FC_OPG_ID));
          elem.setKey(KI_FCOPG_ID);

          elem = row.add(null);
          elem.setValue(valField(m_data.items[_i], CT.FCD_ID));
          elem.setKey(KI_FCD_ID);

          elem = row.add(null);
          elem.setValue(valField(m_data.items[_i], CT.FCP_ID));
          elem.setKey(KI_FCP_ID);

          elem = row.add(null);
          elem.setValue(valField(m_data.items[_i], C.DOC_NAME));
          elem.setKey(KI_DOC);

          elem = row.add(null);
          elem.setValue(valField(m_data.items[_i], CC.FC_NRODOC));
          elem.setId(valField(m_data.items[_i], CC.FC_ID));
          elem.setKey(KI_FC_ID);

          elem = row.add(null);
          if(valField(m_data.items[_i], CT.FCD_FECHA) !== null) {
            elem.setValue(valField(m_data.items[_i], CT.FCD_FECHA));
          }
          else if(valField(m_data.items[_i], CT.FCP_FECHA) !== null) {
            elem.setValue(valField(m_data.items[_i], CT.FCP_FECHA));
          }
          else {
            elem.setValue("");
          }
          elem.setKey(KI_FECHA);

          elem = row.add(null);
          elem.setValue(valField(m_data.items[_i], CT.FCD_PENDIENTE));
          elem.setKey(KI_PENDIENTE);

          elem = row.add(null);
          elem.setValue(valField(m_data.items[_i], CT.FC_OPG_IMPORTE));
          elem.setKey(KI_APLICADO);

          elem = row.add(null);
          var cotizacion = valField(m_data.items[_i], CT.FC_OPG_COTIZACION);
          if(cotizacion !== 0) {
            elem.setValue(cotizacion);
          }
          elem.setKey(KI_COTIZACION);

          elem = row.add(null);
          elem.setValue(valField(m_data.items[_i], CT.FCD_PENDIENTE));
          elem.setKey(KI_PENDIENTE2);

          elem = row.add(null);
          elem.setValue(valField(m_data.items[_i], CT.FC_OPG_IMPORTE));
          elem.setKey(KI_APLICADO2);

          elem = row.add(null);
          elem.setValue(valField(m_data.items[_i], CT.FC_OPG_IMPORTE));
          elem.setKey(KI_APLICADO3);
        }
      };

      var updateApply = function(property, lRow, lCol) {
        var grid = property.getGrid();
        
        if(grid.getColumns().item(lCol).getKey() == KI_APLICADO) {
            var row = grid.getRows().item(lRow);

            var cell = getCell(row, KI_APLICADO);

            var pendiente = val(getPendiente().getValue()) + cellFloat(row, KI_APLICADO3);
            var maxVal = cellFloat(row, KI_PENDIENTE2) + cellFloat(row, KI_APLICADO2);

            if(maxVal > pendiente) {
              maxVal = pendiente;
            }

            if(val(cell.getValue()) > maxVal) {
              cell.setValue(maxVal);
            }
            else if(val(cell.getValue()) < 0) {
              cell.setValue(0);
            }

            getCell(row, KI_APLICADO3).setValue(cell.getValue());

            cell = getCell(row, KI_PENDIENTE);
            cell.setValue(
              cellFloat(row, KI_PENDIENTE2)
              + (
                  cellFloat(row, KI_APLICADO2) - cellFloat(row, KI_APLICADO)
                )
            );

            showPendiente();
        }
        return true;
      };

      var getItemsProperty = function() {
        return m_dialog.getProperties().item(C_APLICACIONES);
      };

      var getItems = function() {
        return m_dialog.getProperties().item(C_APLICACIONES).getGrid();
      };

      var applyBeforeEdit = function(property, lRow, lCol, iKeyAscii) {
        switch (property.getGrid().getColumns().item(lCol).getKey()) {
          // Facturas
          case KI_APLICADO:
            break;

          case KI_COTIZACION:
            if(getCell(property.getGrid().getRows().item(lRow), KI_COTIZACION).getValue() === "") {
              return false;
            }
            break;

          default:
            return false;
        }
        return true;
      };

      var showPendiente = function() {
        var row = null;
        var total = null;

        var _count = getItems().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getItems().getRows().item(_i);
          total = total + val(getCell(row, KI_APLICADO).getValue());
        }

        getPendiente().setValue(m_total - total);

        m_dialog.showValue(getPendiente());
      };

      var getPendiente = function() {
        return m_dialog.getProperties().item(C_PENDIENTE);
      };

      var saveItems = function(mainRegister) {
        var transaction = DB.createTransaction();

        transaction.setTable(CT.FACTURA_COMPRA_ORDEN_PAGO_TMP);

        var _count = getItems().getRows().size();
        for(var _i = 0; _i < _count; _i++) {

          var row = getItems().getRows().item(_i);

          var cotizacion = 0;
          var importe = 0;

          var register = new DB.Register();
          register.setFieldId(CT.FC_OPG_TMP_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var fields = register.getFields();

          var bSave = false;

          if(val(getCell(row, KI_APLICADO).getValue())) {

            bSave = true;

            var _count = row.size();
            for(var _j = 0; _j < _count; _j++) {

              var cell = row.item(_j);

              switch (cell.getKey()) {
                case KI_FC_ID:
                  fields.add(CC.FC_ID, cell.getId(), Types.id);
                  break;

                case KI_FCD_ID:
                  fields.add(CT.FCD_ID, val(cell.getValue()), Types.id);
                  break;

                case KI_FCP_ID:
                  fields.add(CT.FCP_ID, val(cell.getValue()), Types.id);
                  break;

                case KI_APLICADO:
                  importe = val(cell.getValue());
                  fields.add(CT.FC_OPG_IMPORTE, importe, Types.double);
                  break;

                case KI_COTIZACION:
                  cotizacion = val(cell.getValue());
                  fields.add(CT.FC_OPG_COTIZACION, cotizacion, Types.double);
                  break;
              }
            }
          }

          if(bSave) {
            fields.add(CT.FC_OPG_IMPORTE_ORIGEN, Cairo.Util.zeroDiv(importe, cotizacion), Types.double);
            transaction.addRegister(register);
          }
        }

        mainRegister.addTransaction(transaction);
      };

      var saveCtaCte = function(mainRegister) {
        var transaction = DB.createTransaction();

        transaction.setTable(CT.ORDEN_PAGO_ITEM_CUENTA_CORRIENTE_TMP);

        return D.Tesoreria.getCuentasAcreedor(
          getItems(), KI_FC_ID, KI_APLICADO, KI_COTIZACION,0, 0, 0, 0)
          .whenSuccessWithResult(function(response) {

            var cuentas = response.cuentas;

            for(var _i = 0, _count = cuentas.length; _i < _count; _i++) {

              var register = new DB.Register();
              register.setFieldId(CT.OPGI_TMP_ID);
              register.setId(Cairo.Constants.NEW_ID);

              var fields = register.getFields();

              fields.add(C.CUE_ID, cuentas[_i].cueId, Types.id);
              fields.add(CT.OPGI_IMPORTE_ORIGEN, cuentas[_i].importeOrigen, Types.currency);
              fields.add(CT.OPGI_IMPORTE, cuentas[_i].importe, Types.currency);

              fields.add(CT.OPGI_ORDEN, _i, Types.integer);
              fields.add(CT.OPGI_TIPO, CT.OrdenPagoItemTipo.ITEM_CTA_CTE, Types.integer);
              fields.add(CT.OPGI_OTRO_TIPO, CT.OtroTipo.OTRO_HABER, Types.integer);

              transaction.addRegister(register);
            }

            mainRegister.addTransaction(transaction);
            return true;
          });
      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

}());

