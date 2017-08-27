(function() {
  "use strict";

  Cairo.module("FacturaCompraAplic.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var TITLE = getText(1908, ""); // Aplicación Factura de Compra
      var SAVE_ERROR_MESSAGE = getText(1907, ""); // Error al grabar la factura de compra
      
      var Dialogs = Cairo.Dialogs;

      var C_MODULE = "cFacturaCompraAplic";

      var P = Cairo.Promises;
      var C = Cairo.General.Constants;
      var CC = Cairo.Compras.Constants;
      var CT = Cairo.Tesoreria.Constants;
      var getCell = Dialogs.cell;
      var cellVal = Dialogs.cellVal;
      var D = Cairo.Documents;
      var M = Cairo.Modal;
      var DB = Cairo.Database;
      var NO_ID = Cairo.Constants.NO_ID;
      var cellFloat = Dialogs.cellFloat;
      var Types = Cairo.Constants.Types;
      var valField = DB.valField;
      var valFieldDateValue = DB.valFieldDateValue;

      var K_PENDIENTE_ORDENPAGO = 10;
      var K_TOTAL_ORDENPAGO = 11;
      var K_VENCIMIENTOS = 12;
      var K_APLIC_ORDENPAGO = 13;
      var C_VENCIMIENTOS = "Vencimientos";
      var C_APLICORDENPAGO = "AplicCobr";
      var C_PENDIENTE_ORDEN_PAGO = "PendienteCob";
      var C_TOTAL_ORDEN_PAGO = "TotalCob";

      var KIV_FCD_ID = 1;
      var KIV_FCP_ID = 2;
      var KIV_FECHA = 3;
      var KIV_APLICADO = 4;
      var KIV_APLICADO2 = 5;
      var KIV_PENDIENTE = 6;

      var KIC_FCOPG_ID = 1;
      var KIC_FCD_ID = 2;
      var KIC_FCP_ID = 3;
      var KIC_FC_ID = 4;
      var KIC_DOC = 5;
      var KIC_FECHA = 6;
      var KIC_COTIZACION = 7;
      var KIC_PENDIENTE = 8;
      var KIC_APLICADO = 11;
      var KIC_APLICADO2 = 12;
      var KIC_OPG_ID = 14;
      var KIC_NRODOC = 15;
      var KIC_IDX1 = 16;
      var KIC_IDX2 = 17;
      var KIC_FCNC_ID = 18;

      var K_ITEMS = 20;
      var K_APLIC_ORDEN_REMITO = 21;
      var C_ITEMS = "Items";
      var C_APLIC_ORDEN_REMITO = "AplicOrdenRemito";

      var KII_FCI_ID = 1;
      var KII_PR_ID = 2;
      var KII_APLICADO = 4;
      var KII_APLICADO2 = 5;
      var KII_PENDIENTE = 6;

      var KIPR_OCFC_ID = 1;
      var KIPR_RCFC_ID = 2;
      var KIPR_OCI_ID = 3;
      var KIPR_RCI_ID = 4;
      var KIPR_OC_ID = 5;
      var KIPR_RC_ID = 6;
      var KIPR_DOC = 7;
      var KIPR_FECHA = 8;
      var KIPR_PENDIENTE = 9;
      var KIPR_APLICADO = 11;
      var KIPR_APLICADO2 = 12;
      var KIPR_NRODOC = 15;
      var KIPR_IDX1 = 16;
      var KIPR_IDX2 = 17;

      var m_editing;
      var m_dialog = null;
      var m_fcId = 0;
      var m_isNotaCredito;
      var m_isAutoPayment;
      var m_fcNumero = "";
      var m_proveedor = "";
      var m_provId = 0;
      var m_docId = 0;
      var m_sucId = 0;
      var m_total = 0;
      var m_ctaCteCueId = 0;
      var m_monIdXCuenta = 0;

      var m_defaultCurrency = D.getDefaultCurrency();

      var m_lastRowVto = -1;
      var m_lastRowItem = -1;

      var m_client;
      var m_empId = 0;
      var m_empName = "";

      var m_vOpgNC;
      var m_fcdId = 0;
      var m_fcpId = 0;

      var m_vOrdenRemito;
      var m_fciId = 0;

      var m_apiPath = DB.getAPIVersion();

      var emptyData = {
        vencimientos: [],
        items: [],
        pagosAplicados: [],
        pagosParaAplicar: [],
        itemsAplicados: [],
        itemsParaAplicar: []
      };

      var m_data = emptyData;

      self.setClient = function(rhs) {
        m_client = rhs;
      };

      self.getId = function() {
        return m_fcId;
      };

      self.show = function(fcId, total, fcNumero, provId, proveedor, sucId, docId, isNotaCredito, empId, empName) {

        if(m_dialog === null) {
          m_dialog = Cairo.Dialogs.Views.Controller.newDialog();
        }

        if(m_fcId !== fcId) {
          m_isNotaCredito = isNotaCredito;
          m_fcId = fcId;
          m_fcNumero = fcNumero;
          m_proveedor = proveedor;
          m_provId = provId;
          m_docId = docId;
          m_sucId = sucId;
          m_total = total;
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

          case Dialogs.Message.MSG_GRID_ROW_CHANGE:
            if(info === null) break;

            switch (info.getKey()) {

              case K_VENCIMIENTOS:

                // save the amount for the installment we were editing
                //
                if(m_lastRowVto !== -1) {
                  ordenPagoRefreshVto(ordenPagoUpdateGrids());
                }

                // show amounts applied for this installment
                //
                m_lastRowVto = info.getSelectedRow();
                var row = info.getGrid().getRows().item(m_lastRowVto);
                if(row !== null) {
                  ordenPagoSetAplicVtos(
                    m_dialog.getProperties().item(C_APLICORDENPAGO), 
                    getCell(row, KIV_FCD_ID).getId(), 
                    getCell(row, KIV_FCP_ID).getId());
                  m_dialog.showValue(m_dialog.getProperties().item(C_APLICORDENPAGO), true);
                }
                break;

              case K_ITEMS:

                // save the amount for the item we were editing
                //
                if(m_lastRowItem !== -1) {
                  itemUpdateGrids();
                }

                // show amounts applied for this item
                //
                m_lastRowItem = info.getSelectedRow();
                row = info.getGrid().getRows().item(m_lastRowItem);
                if(row !== null) {
                  itemSetAplicItems(
                    m_dialog.getProperties().item(C_APLIC_ORDEN_REMITO),
                    getCell(row, KII_FCI_ID).getId(), getCell(row, KII_PR_ID).getId());
                  m_dialog.showValue(m_dialog.getProperties().item(C_APLIC_ORDEN_REMITO), true);
                }
                break;
            }
            break;

          case Dialogs.Message.MSG_GRID_VIRTUAL_ROW:

            p = P.resolvedPromise(info);
            break;
        }

        return p || P.resolvedPromise();
      };

      self.discardChanges = function() {
        return P.resolvedPromise(refreshCollection());
      };

      self.propertyChange = function(key) {
        return Cairo.Promises.resolvedPromise(false);
      };

      self.save = function() {

        if(m_empId !== Cairo.Company.getId()) {
          return D.msgApplyDisabled(m_empName);
        }

        ordenPagoUpdateGrids();
        itemUpdateGrids();

        var register = new DB.Register();

        register.setFieldId(CC.FC_ID);
        register.setTable(CC.FACTURA_COMPRA);
        register.setPath(m_apiPath + "compras/facturacompra/aplic");
        register.setId(m_fcId);

        saveDocCpra(register);
        itemSaveOrdenRemito(register);

        // the applied amount is not editable if the payment condition is automatic
        //
        if(m_isAutoPayment) {
                return M.showWarning(getText(3582, ""));
                                       // El tipo de condición de pago de esta factura ha generado automticamente
                                       // la orden de pago y su aplicacion no puede modificarse manualmente.
                                       // Solo se guardara la aplicación de la factura entre remitos y ordenes
                                       // de compra.
        }
        else {
          ordenPagoSaveNotaCredito(register);
          ordenPagoSaveOrdenPago(register);
        }

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
                        m_client.refresh(self, m_fcId);
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
      };

      var loadDataFromResponse = function(response) {
        var data = response.data;

        data.vencimientos = DB.getResultSetFromData(data.get('vencimientos'));
        data.items = DB.getResultSetFromData(data.get('items'));
        data.pagosAplicados = DB.getResultSetFromData(data.get('pagosAplicados'));
        data.pagosParaAplicar = DB.getResultSetFromData(data.get('pagosParaAplicar'));
        data.itemsAplicados = DB.getResultSetFromData(data.get('itemsAplicados'));
        data.itemsParaAplicar = DB.getResultSetFromData(data.get('itemsParaAplicar'));

        return data;
      };

      var load = function() {
        return DB.getData("load[" + m_apiPath + "compras/facturacompra/aplic]", m_fcId).then(
          function(response) {
            if(response.success !== true) { return false; }

            if(response.data.id === m_fcId) {

              m_data = loadDataFromResponse(response);

              var data = response.data;

              m_ctaCteCueId = valField(data, CT.CTACTE_CUE_ID);
              m_monIdXCuenta = valField(data, CT.MON_ID_X_CUENTA);
              m_isAutoPayment = valField(data, CC.FC_PAGO_AUTOMATICO);

              ordenPagoLoadAplicVtos();
              itemLoadAplicItems();

              return true;
            }
          });
      };

      var destroy = function() {
        try {
          m_dialog = null;
          m_vOpgNC = [];
          m_vOrdenRemito = [];
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
        return "#general/facturacompraaplic/" + m_fcId.toString();
      };

      self.getEditorName = function() {
        return "facturacompraaplic" + m_fcId;
      };

      self.getTitle = function() {
        return TITLE + " " + m_fcNumero + " - " + m_proveedor;
      };

      self.validate = function() {
        return P.resolvedPromise(true);
      };

      self.isEmptyRow = function(key, row, rowIndex) {
        return P.resolvedPromise(false);
      };

      self.columnAfterUpdate = function(key, lRow, lCol) {
        try {
          
          switch (key) {
          
            case K_APLIC_ORDENPAGO:
              ordenPagoColAUpdateOrdenPago(ordenPagoGetItemsOrdenPagoProperty(), lRow, lCol);
              break;

            case K_APLIC_ORDEN_REMITO:
              itemColAUpdateOrdenRemito(itemGetItemsOrdenRemitoProperty(), lRow, lCol);
              break;
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
        
          switch (key) {
        
            case K_APLIC_ORDENPAGO:
              rtn = ordenPagoColBEditOrdenPago(ordenPagoGetItemsOrdenPagoProperty(), lRow, lCol);
              break;

            case K_APLIC_ORDEN_REMITO:
              rtn = itemColBEditOrdenRemito(itemGetItemsOrdenRemitoProperty(), lRow, lCol);
              break;
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

          switch (key) {

            case K_APLIC_ORDENPAGO:

              var rows = ordenPagoGetItemsOrdenPago().getRows();
              if(getCell(rows.item(lRow), KIC_OPG_ID).getId() === NO_ID) {
                p = D.showDocAux(getCell(rows.item(lRow), KIC_FC_ID).getId(), "FacturaCompra");
              }
              else {
                p = D.showDocAux(getCell(rows.item(lRow), KIC_OPG_ID).getId(), "OrdenPago");
              }
              break;

            case K_APLIC_ORDEN_REMITO:

              var rows = itemGetItemsOrdenRemito().getRows();
              var objEditName = "";

              var id = getCell(rows.item(lRow), KIPR_OC_ID).getId();
              if(id !== NO_ID) {
                objEditName = "OrdenCompra";
              }
              else {
                id = getCell(rows.item(lRow), KIPR_RC_ID).getId();
                if(id !== NO_ID) {
                  objEditName = "RemitoCompra";
                }
              }

              if(id !== NO_ID) {
                p = D.showDocAux(id, objEditName);
              }
              break;
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

        m_lastRowVto = -1;
        m_dialog.getProperties().clear();

        var tabs = m_dialog.getTabs();

        tabs.clear();

        tabs.add(null).setIndex(0).setName(getText(1371, "")); // Items
        tabs.add(null).setIndex(1).setName(getText(1644, "")); // Vencimientos

        var properties = m_dialog.getProperties();
        var elem;
        
        elem = properties.add(null, C_ITEMS);
        elem.setType(Dialogs.PropertyType.grid);
        elem.hideLabel();
        setGridItems(elem);
        loadItems(elem);
        elem.setKey(K_ITEMS);
        elem.setName("Items");
        elem.setGridEditEnabled(false);
        elem.setGridAddEnabled(false);
        elem.setGridRemoveEnabled(false);
        elem.setRowSelect(true);
        elem.setDontSelectInGotFocus(true);

        elem = properties.add(null, C_APLIC_ORDEN_REMITO);
        elem.setType(Dialogs.PropertyType.grid);
        elem.hideLabel();
        setGridAplicOrdenRemito(elem);
        elem.setKey(K_APLIC_ORDEN_REMITO);
        elem.setName("OrdenRemito");
        elem.setGridEditEnabled(true);
        elem.setGridAddEnabled(false);
        elem.setGridRemoveEnabled(false);
        elem.setRowSelect(true);
        elem.setDontSelectInGotFocus(true);

        elem = properties.add(null, C_TOTAL_ORDEN_PAGO); // OrdenPago
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1909, "")); // Importe facturado
        elem.setEnabled(false);
        elem.setFormat(Cairo.Settings.getCurrencyRateDecimalsFormat());
        elem.setValue(m_total);
        elem.setKey(K_TOTAL_ORDENPAGO);
        elem.setTabIndex(1);

        elem = properties.add(null, C_PENDIENTE_ORDEN_PAGO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1609, "")); // Pendiente
        elem.setEnabled(false);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(K_PENDIENTE_ORDENPAGO);
        elem.setTabIndex(1);

        elem = properties.add(null, C_VENCIMIENTOS);
        elem.setType(Dialogs.PropertyType.grid);
        elem.hideLabel();
        setGridVencimientos(elem);
        loadVencimientos(elem);
        elem.setKey(K_VENCIMIENTOS);
        elem.setName(getText(1644, "")); // Vencimientos
        elem.hideLabel();
        elem.setGridEditEnabled(false);
        elem.setGridAddEnabled(false);
        elem.setGridRemoveEnabled(false);
        elem.setTabIndex(1);
        elem.setRowSelect(true);
        elem.setDontSelectInGotFocus(true);

        elem = properties.add(null, C_APLICORDENPAGO);
        elem.setType(Dialogs.PropertyType.grid);
        elem.hideLabel();
        setGridAplicOrdenPago(elem);
        elem.setKey(K_APLIC_ORDENPAGO);
        elem.setName("OrdenPago");
        elem.hideLabel();
        elem.setGridEditEnabled(true);
        elem.setGridAddEnabled(false);
        elem.setGridRemoveEnabled(false);
        elem.setRowSelect(true);
        elem.setDontSelectInGotFocus(true);
        elem.setTabIndex(1);

        if(!m_dialog.show(self)) { return false; }

        ordenPagoShowPendienteOrdenPago();

        return true;
      };

      var refreshCollection = function() {
        var properties = m_dialog.getProperties();

        var property = properties.add(null, C_ITEMS);
        loadItems(property);

        property = properties.add(null, C_APLIC_ORDEN_REMITO);
        property.getGrid().getRows().clear();

        property = properties.add(null, C_TOTAL_ORDEN_PAGO); // OrdenPago
        property.setValue(m_total);

        property = properties.add(null, C_VENCIMIENTOS);
        loadVencimientos(property);

        property = properties.add(null, C_APLICORDENPAGO);
        property.getGrid().getRows().clear();

        m_dialog.showValues(m_dialog.getProperties());

        ordenPagoShowPendienteOrdenPago();
      };

      var saveDocCpra = function(register) {

        var fields = register.getFields();

        fields.add(CC.FC_ID, m_fcId, Types.id);
        fields.add(CC.FC_NUMERO, 0, Types.long);
        fields.add(CC.FC_NRODOC, "", Types.text);
        fields.add(C.PROV_ID, 0, Types.long);
        fields.add(C.SUC_ID, 0, Types.long);
        fields.add(C.DOC_ID, m_docId, Types.id);
        fields.add(C.CPG_ID, C.CondicionPagoTipo.fechaDocumento, Types.id);
        fields.add(CC.FC_GRABAR_ASIENTO, 0, Types.boolean);
        fields.add(C.EST_ID, D.Status.pendiente, Types.id);
      };

     var itemLoadAplicItems = function() {
        itemLoadAplicAplicados();
        itemLoadAplicCreditos();
     };

      var setGridItems = function(property) {

        var elem;
        var grid = property.getGrid();
        var columns = grid.getColumns();
        columns.clear();

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_FCI_ID);

        elem = columns.add(null);
        elem.setName(getText(1619, "")); // Producto
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KII_PR_ID);

        elem = columns.add(null);
        elem.setName(getText(1609, "")); // Pendiente
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KII_PENDIENTE);

        elem = columns.add(null);
        elem.setName(getText(1608, "")); // Aplicado
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KII_APLICADO);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_APLICADO2);

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
          elem.setId(valField(m_data.items[_i], CC.FCI_ID));
          elem.setKey(KII_FCI_ID);

          elem = row.add(null);
          elem.setId(valField(m_data.items[_i], C.PR_ID));
          elem.setValue(valField(m_data.items[_i], C.PR_NAME_COMPRA));
          elem.setKey(KII_PR_ID);

          elem = row.add(null);
          elem.setValue(valField(m_data.items[_i], CC.FCI_PENDIENTE));
          elem.setKey(KII_PENDIENTE);

          var value = valField(m_data.items[_i], C.APLICADO);
          elem = row.add(null);
          elem.setValue(value);
          elem.setKey(KII_APLICADO);

          if(value !== 0) {
            row.setBackColor("#FFCC99");
          }

          elem = row.add(null);
          elem.setValue(valField(m_data.items[_i], C.APLICADO));
          elem.setKey(KII_APLICADO2);
        }
      };

      var setGridAplicOrdenRemito = function(property) {
        var elem;
        var grid = property.getGrid();

        var columns = grid.getColumns();
        columns.clear();
        
        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIPR_IDX1);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIPR_IDX2);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIPR_RCFC_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIPR_OCFC_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIPR_RCI_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIPR_RC_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIPR_OCI_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIPR_OC_ID);

        elem = columns.add(null);
        elem.setName(getText(1567, "")); // Documento
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIPR_DOC);

        elem = columns.add(null);
        elem.setName(getText(1610, "")); // Comprobante
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIPR_NRODOC);

        elem = columns.add(null);
        elem.setName(getText(1569, "")); // Fecha
        elem.setType(Dialogs.PropertyType.date);
        elem.setKey(KIPR_FECHA);

        elem = columns.add(null);
        elem.setName(getText(1609, "")); // Pendiente
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIPR_PENDIENTE);

        elem = columns.add(null);
        elem.setName(getText(1608, "")); // Aplicado
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIPR_APLICADO);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIPR_APLICADO2);

        grid.getRows().clear();
      };

      var itemLoadAplicAplicados = function() {

        m_vOrdenRemito = [];

        for(var _i = 0, count = m_data.itemsAplicados.length; _i < count; _i += 1) {

          var indexInfo = itemAddToCreditos(
            valField(m_data.itemsAplicados[_i], CC.RCI_ID),
            valField(m_data.itemsAplicados[_i], CC.OCI_ID)
          );

          var item = m_vOrdenRemito[indexInfo.indexOrdenRemito];

          // document
          //
          item.docName = valField(m_data.itemsAplicados[_i], C.DOC_NAME);
          item.nroDoc = valField(m_data.itemsAplicados[_i], C.NRO_DOC);
          item.fecha = valFieldDateValue(m_data.itemsAplicados[_i], C.FECHA);

          // pending
          //
          item.pendiente = valField(m_data.itemsAplicados[_i], C.PENDIENTE);
          item.pendienteActual = item.pendiente;

          // buying order / delivery notice
          //
          item.rci_id = valField(m_data.itemsAplicados[_i], CC.RCI_ID);
          item.rc_id = valField(m_data.itemsAplicados[_i], CC.RC_ID);
          item.oci_id = valField(m_data.itemsAplicados[_i], CC.OCI_ID);
          item.oc_id = valField(m_data.itemsAplicados[_i], CC.OC_ID);
          item.pr_id = valField(m_data.itemsAplicados[_i], C.PR_ID);

          // applied
          //
          var aplicaciones = item.vAplicaciones[indexInfo.indexAplic];
          aplicaciones.rcfc_id = valField(m_data.itemsAplicados[_i], CC.RC_FC_ID);
          aplicaciones.ocfc_id = valField(m_data.itemsAplicados[_i], CC.OC_FC_ID);
          aplicaciones.fci_id = valField(m_data.itemsAplicados[_i], CC.FCI_ID);
          aplicaciones.aplicado = valField(m_data.itemsAplicados[_i], C.APLICADO);

          // total applied to this credit
          //
          item.aplicado = item.aplicado + item.vAplicaciones[indexInfo.indexAplic].aplicado;
          item.aplicadoActual = item.aplicado;
        }
      };

      var itemLoadAplicCreditos = function() {
        for(var _i = 0, count = m_data.itemsParaAplicar.length; _i < count; _i += 1) {
          var pendiente = valField(m_data.itemsParaAplicar[_i], C.PENDIENTE);
          m_vOrdenRemito.push({
            pr_id: valField(m_data.itemsParaAplicar[_i], C.PR_ID),
            rci_id: valField(m_data.itemsParaAplicar[_i], CC.RCI_ID),
            rc_id: valField(m_data.itemsParaAplicar[_i], CC.RC_ID),
            oci_id: valField(m_data.itemsParaAplicar[_i], CC.OCI_ID),
            oc_id: valField(m_data.itemsParaAplicar[_i], CC.OC_ID),
            docName: valField(m_data.itemsParaAplicar[_i], C.DOC_NAME),
            nroDoc: valField(m_data.itemsParaAplicar[_i], C.NRO_DOC),
            fecha: valFieldDateValue(m_data.itemsParaAplicar[_i], C.FECHA),
            pendiente: pendiente,
            pendienteActual: pendiente,
            vAplicaciones: [],
            aplicado: 0,
            aplicadoActual: 0
          });
        }
      };

      var createOrdenRemitoItem = function() {
        return {
          pr_id: NO_ID,
          rci_id: NO_ID,
          rc_id: NO_ID,
          oci_id: NO_ID,
          oc_id: NO_ID,
          docName: "",
          nroDoc: "",
          fecha: Cairo.Constants.NO_DATE,
          pendiente: 0,
          pendienteActual: 0,
          vAplicaciones: [],
          aplicado: 0,
          aplicadoActual: 0
        };
      };

      var itemAddToCreditos = function(rciId, ociId) {
        var index = -1;

        for(var i = 0, count = m_vOrdenRemito.length; i < count; i += 1) {
          if(   (m_vOrdenRemito[i].rci_id === rciId && rciId !== NO_ID)
             || (m_vOrdenRemito[i].oci_id === ociId && ociId !== NO_ID)) {

            index = i;
            break;
          }
        }

        if (index === -1){
          m_vOrdenRemito.push(createOrdenRemitoItem());
          index = m_vOrdenRemito.length -1;
        }

        m_vOrdenRemito[index].vAplicaciones.push(createOrdenRemitoAplic());

        return {
          indexOrdenRemito: index,
          indexAplic: m_vOrdenRemito[index].vAplicaciones.length -1
        };
      };

      var createOrdenRemitoAplic = function() {
        return {
          rcfc_id: null,
          ocfc_id: null,
          fci_id: null,
          aplicado: 0
        };
      };

      var itemUpdateGrids = function() {
        var aplicadoTotal = 0;

        if(m_lastRowItem !== -1) {
          var properties = m_dialog.getProperties();
          var row = properties.item(C_ITEMS).getGrid().getRows().item(m_lastRowItem);
          aplicadoTotal = itemUpdateAplicItems(
            properties.item(C_APLIC_ORDEN_REMITO).getGrid(),
            getCell(row, KII_FCI_ID).getId()
          );
        }

        return aplicadoTotal;
      };

      var itemSetAplicItems = function(property, fciId, prId) {

        property.getGrid().getRows().clear();

        m_fciId = fciId;

        for(var i = 0, count = m_vOrdenRemito.length; i < count; i += 1) {

          if(m_vOrdenRemito[i].pr_id === prId) {

            if(m_vOrdenRemito[i].vAplicaciones.length > 0) {
              itemSetAplicItemsAux1(i, property, fciId);
            }
            else {
              itemSetAplicItemsAux2(i, property);
            }
          }
        }

        // now iterate through applied credits
        // but aren't associated with this installment
        // and have pending amount
        //
        for(var i = 0, count = m_vOrdenRemito.length; i < count; i++) {

          var bAplic = false;

          if(m_vOrdenRemito[i].pr_id === prId) {

            var rows = property.getGrid().getRows();

            for(var _j = 0, _count = rows.size(); _j < _count; _j++) {
              var row = rows.item(_j);
              var id;

              id = getCell(row, KIPR_RCI_ID).getId();
              if(id === m_vOrdenRemito[i].rci_id && id !== NO_ID) {
                bAplic = true;
                break;
              }

              id = getCell(row, KIPR_OCI_ID).getId();
              if(id === m_vOrdenRemito[i].oci_id && id !== NO_ID) {
                bAplic = true;
                break;
              }

              id = m_fciId;
              for(var j = 0, count_j = m_vOrdenRemito[i].vAplicaciones.length; j < count_j; j += 1) {
                if(id === m_vOrdenRemito[i].vAplicaciones[j].fci_id && id !== NO_ID) {
                  bAplic = true;
                  break;
                }
              }

              if(bAplic) { break; }
            }

            if(!bAplic) { itemSetAplicItemsAux2(i, property); }
          }
        }
      };

      var itemUpdateAplicItems = function(grid) {
        var aplicado = 0;
        var aplicadoTotal = 0;
        var rows = grid.getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i += 1) {
          var row = rows.item(_i);

          if(cellFloat(row, KIPR_APLICADO) > 0 || getCell(row, KIPR_IDX2).getId() !== -1) {

            var i = getCell(row, KIPR_IDX1).getId();
            var j = getCell(row, KIPR_IDX2).getId();

            aplicado = cellFloat(row, KIPR_APLICADO);
            aplicadoTotal = aplicadoTotal + aplicado;

            m_vOrdenRemito[i].aplicado = itemAddToAplic(m_vOrdenRemito[i].vAplicaciones, aplicado, j);
            m_vOrdenRemito[i].pendiente = m_vOrdenRemito[i].pendienteActual
              - (m_vOrdenRemito[i].aplicado - m_vOrdenRemito[i].aplicadoActual);
          }
        }

        return aplicadoTotal;
      };

      var itemSetAplicItemsAux1 = function(idx, property, fciId) {
        var elem;
        var rows = property.getGrid().getRows();

        for(var i = 0, count = m_vOrdenRemito[idx].vAplicaciones.length; i < count; i += 1) {

          if(m_vOrdenRemito[idx].vAplicaciones[i].fci_id === fciId && fciId !== NO_ID) {

            var row = rows.add(null);

            elem = row.add(null);
            elem.setId(idx);
            elem.setKey(KIPR_IDX1);

            elem = row.add(null);
            elem.setId(i);
            elem.setKey(KIPR_IDX2);

            elem = row.add(null);
            elem.setId(m_vOrdenRemito[idx].vAplicaciones[i].rcfc_id);
            elem.setKey(KIPR_RCFC_ID);

            elem = row.add(null);
            elem.setId(m_vOrdenRemito[idx].vAplicaciones[i].ocfc_id);
            elem.setKey(KIPR_OCFC_ID);

            elem = row.add(null);
            elem.setId(m_vOrdenRemito[idx].rci_id);
            elem.setKey(KIPR_RCI_ID);

            elem = row.add(null);
            elem.setId(m_vOrdenRemito[idx].rc_id);
            elem.setKey(KIPR_RC_ID);

            elem = row.add(null);
            elem.setId(m_vOrdenRemito[idx].oci_id);
            elem.setKey(KIPR_OCI_ID);

            elem = row.add(null);
            elem.setId(m_vOrdenRemito[idx].oc_id);
            elem.setKey(KIPR_OC_ID);

            elem = row.add(null);
            elem.setValue(m_vOrdenRemito[idx].docName);
            elem.setKey(KIPR_DOC);

            elem = row.add(null);
            elem.setValue(m_vOrdenRemito[idx].nroDoc);
            elem.setKey(KIPR_NRODOC);

            elem = row.add(null);
            if(m_vOrdenRemito[idx].fecha === Cairo.Constants.NO_DATE) {
              elem.setValue("");
            }
            else {
              elem.setValue(m_vOrdenRemito[idx].fecha);
            }
            elem.setKey(KIPR_FECHA);

            elem = row.add(null);
            elem.setValue(m_vOrdenRemito[idx].pendiente);
            elem.setKey(KIPR_PENDIENTE);

            elem = row.add(null);
            elem.setValue(m_vOrdenRemito[idx].vAplicaciones[i].aplicado);
            elem.setKey(KIPR_APLICADO);

            elem = row.add(null);
            elem.setValue(m_vOrdenRemito[idx].vAplicaciones[i].aplicado);
            elem.setKey(KIPR_APLICADO2);

            row.setBackColor("#HFFCC99");
          }
        }
      };

      var itemSetAplicItemsAux2 = function(i, property) {

        if(m_vOrdenRemito[i].pendiente <= 0) { return; }

        var elem;
        var row = property.getGrid().getRows().add(null);

        elem = row.add(null);
        elem.setId(i);
        elem.setKey(KIPR_IDX1);

        elem = row.add(null);
        elem.setId(-1);
        elem.setKey(KIPR_IDX2);

        elem = row.add(null);
        elem.setId(NO_ID);
        elem.setKey(KIPR_RCFC_ID);

        elem = row.add(null);
        elem.setId(NO_ID);
        elem.setKey(KIPR_OCFC_ID);

        elem = row.add(null);
        elem.setId(m_vOrdenRemito[i].rci_id);
        elem.setKey(KIPR_RCI_ID);

        elem = row.add(null);
        elem.setId(m_vOrdenRemito[i].rc_id);
        elem.setKey(KIPR_RC_ID);

        elem = row.add(null);
        elem.setId(m_vOrdenRemito[i].oci_id);
        elem.setKey(KIPR_OCI_ID);

        elem = row.add(null);
        elem.setId(m_vOrdenRemito[i].oci_id);
        elem.setKey(KIPR_OC_ID);

        elem = row.add(null);
        elem.setValue(m_vOrdenRemito[i].docName);
        elem.setKey(KIPR_DOC);

        elem = row.add(null);
        elem.setValue(m_vOrdenRemito[i].nroDoc);
        elem.setKey(KIPR_NRODOC);

        elem = row.add(null);
        if(m_vOrdenRemito[i].fecha === Cairo.Constants.NO_DATE) {
          elem.setValue("");
        }
        else {
          elem.setValue(m_vOrdenRemito[i].fecha);
        }
        elem.setKey(KIPR_FECHA);

        elem = row.add(null);
        elem.setValue(m_vOrdenRemito[i].pendiente);
        elem.setKey(KIPR_PENDIENTE);

        elem = row.add(null);
        elem.setValue(0);
        elem.setKey(KIPR_APLICADO);

        elem = row.add(null);
        elem.setValue(0);
        elem.setKey(KIPR_APLICADO2);
      };

      var itemAddToAplic = function(vAplicaciones, importe, idx) {
        var totalAplicado = 0;

        if(idx === -1) {
          vAplicaciones.push(createOrdenRemitoAplic());
          idx = vAplicaciones.length -1;
          vAplicaciones[idx].fci_id = m_fciId;
        }

        vAplicaciones[idx].aplicado = importe;

        for(var i = 0, count = vAplicaciones.length; i < count; i += 1) {
          totalAplicado += vAplicaciones[i].aplicado;
        }

        return totalAplicado;
      };

      var itemGetItemsOrdenRemitoProperty = function() {
        return m_dialog.getProperties().item(C_APLIC_ORDEN_REMITO);
      };

      var itemGetItemsOrdenRemito = function() {
        return m_dialog.getProperties().item(C_APLIC_ORDEN_REMITO).getGrid();
      };

      var itemColBEditOrdenRemito = function(property, lRow, lCol) {
        switch (property.getGrid().getColumns().item(lCol).getKey()) {
          case KIPR_APLICADO:
            break;

          default:
            return false;
        }
        return true;
      };

      var itemGetItemPendiente = function() {
        var property = m_dialog.getProperties().item(C_ITEMS);
        return getCell(property.getGrid().getRows().item(property.getSelectedRow()), KII_PENDIENTE);
      };

      var itemGetItemAplicado = function() {
        var property = m_dialog.getProperties().item(C_ITEMS);
        return getCell(property.getGrid().getRows().item(property.getSelectedRow()), KII_APLICADO2);
      };

      var itemColAUpdateOrdenRemito = function(property, lRow, lCol) {
        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).getKey()) {
          case KIPR_APLICADO:
            var row = grid.getRows().item(lRow);

            var cell = getCell(row, KIPR_APLICADO);

            var pendiente = Cairo.Util.val(itemGetItemPendiente().getValue()) + cellFloat(row, KIPR_APLICADO2);
            var maxVal = cellFloat(row, KIPR_PENDIENTE) + cellFloat(row, KIPR_APLICADO2);

            if(maxVal > pendiente) {
              maxVal = pendiente;
            }

            if(Cairo.Util.val(cell.getValue()) > maxVal) {
              cell.setValue(maxVal);
            }
            else if(Cairo.Util.val(cell.getValue()) < 0) {
              cell.setValue(0);
            }

            var aplicado = itemGetAplicado();
            itemRefreshItem(aplicado);
            itemGetItemAplicado().setValue(aplicado);

            // update pending credit
            //
            cell = getCell(row, KIPR_PENDIENTE);
            cell.setValue(Cairo.Util.val(cell.getValue()) + cellFloat(row, KIPR_APLICADO2) - cellFloat(row, KIPR_APLICADO));
            getCell(row, KIPR_APLICADO2).setValue(getCell(row, KIPR_APLICADO).getValue());
            break;
        }
      };

      var itemGetAplicado = function() {
        var aplicado = 0;
        var rows = m_dialog.getProperties().item(C_APLIC_ORDEN_REMITO).getGrid().getRows();
        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {
          var row = rows.item(_i);
          aplicado = aplicado + cellFloat(row, KIPR_APLICADO);
        }
        return aplicado;
      };

      var itemRefreshItem = function(aplicado) {
        var property = m_dialog.getProperties().item(C_ITEMS);
        var row = property.getGrid().getRows().item(m_lastRowItem);

        getCell(row, KII_APLICADO).setValue(aplicado);
        var aplicadoActual = cellFloat(row, KII_APLICADO2);

        var cell = getCell(row, KII_PENDIENTE);
        cell.setValue(cell.getValue() - (aplicado - aplicadoActual));

        getCell(row, KII_APLICADO2).setValue(aplicado);

        var cols = property.getGrid().getColumns();
        m_dialog.showCellValue(property, m_lastRowItem, D.getCol(cols, KII_PENDIENTE).getIndex());
        m_dialog.showCellValue(property, m_lastRowItem, D.getCol(cols, KII_APLICADO).getIndex());
      };

      var itemSaveOrdenRemito = function(mainRegister) {
        itemSaveOrdenCompra(mainRegister);
        itemSaveRemito(mainRegister);
      };

      var itemSaveOrdenCompra = function(mainRegister) {
        var transaction = DB.createTransaction();

        transaction.setTable(CC.ORDEN_FACTURA_COMPRA_TMP);

        for(var i = 0, count = m_vOrdenRemito.length; i < count; i += 1) {

          if(m_vOrdenRemito[i].oci_id !== NO_ID) {

            for(var j = 0, count_j = m_vOrdenRemito[i].vAplicaciones.length; j < count_j; j += 1) {

              if(m_vOrdenRemito[i].vAplicaciones[j].fci_id !== NO_ID) {

                if(m_vOrdenRemito[i].vAplicaciones[j].aplicado > 0) {

                  var register = new DB.Register();
                  register.setFieldId(CC.OC_FC_TMP_ID);
                  register.setId(Cairo.Constants.NEW_ID);

                  var fields = register.getFields();

                  fields.add(CC.OCI_ID, m_vOrdenRemito[i].oci_id, Types.id);
                  fields.add(CC.FCI_ID, m_vOrdenRemito[i].vAplicaciones[j].fci_id, Types.id);
                  fields.add(CC.OC_FC_CANTIDAD, m_vOrdenRemito[i].vAplicaciones[j].aplicado, Types.double);
                  fields.add(CC.OC_FC_ID, m_vOrdenRemito[i].vAplicaciones[j].ocfc_id, Types.long);

                  transaction.addRegister(register);
                }
              }
            }
          }
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var itemSaveRemito = function(mainRegister) {
        var transaction = DB.createTransaction();

        transaction.setTable(CC.REMITO_FACTURA_COMPRA_TMP);

        for(var i = 0, count = m_vOrdenRemito.length; i < count; i += 1) {

          if(m_vOrdenRemito[i].rci_id !== NO_ID) {

            for(var j = 0, count_j = m_vOrdenRemito[i].vAplicaciones.length; j < count_j; j += 1) {

              if(m_vOrdenRemito[i].vAplicaciones[j].fci_id !== NO_ID) {

                if(m_vOrdenRemito[i].vAplicaciones[j].aplicado > 0) {

                  var register = new DB.Register();
                  register.setFieldId(CC.RC_FC_TMP_ID);
                  register.setId(Cairo.Constants.NEW_ID);

                  var fields = register.getFields();

                  fields.add(CC.RCI_ID, m_vOrdenRemito[i].rci_id, Types.id);
                  fields.add(CC.FCI_ID, m_vOrdenRemito[i].vAplicaciones[j].fci_id, Types.id);
                  fields.add(CC.RC_FC_CANTIDAD, m_vOrdenRemito[i].vAplicaciones[j].aplicado, Types.double);
                  fields.add(CC.RC_FC_ID, m_vOrdenRemito[i].vAplicaciones[j].rcfc_id, Types.long);

                  transaction.addRegister(register);
                }
              }
            }
          }
        }

        mainRegister.addTransaction(transaction);
        
        return true;
      };

      var ordenPagoLoadAplicVtos = function() {
        ordenPagoLoadAplicAplicados();
        ordenPagoLoadAplicCreditos();
      };

      var ordenPagoLoadAplicAplicados = function() {

        m_vOpgNC = [];

        for(var _i = 0, count = m_data.pagosAplicados.length; _i < count; _i += 1) {

          var indexInfo = ordenPagoAddToCreditos(
            valField(m_data.pagosAplicados[_i], CT.OPG_ID), 
            valField(m_data.pagosAplicados[_i], CT.FCD_ID),
            valField(m_data.pagosAplicados[_i], CT.FCP_ID)
          );

          var item = m_vOpgNC[indexInfo.indexPago];
          
          // document
          //
          item.docName = valField(m_data.pagosAplicados[_i], C.DOC_NAME);
          item.nroDoc = valField(m_data.pagosAplicados[_i], C.NRO_DOC);

          // pending
          //
          item.pendiente = valField(m_data.pagosAplicados[_i], C.PENDIENTE);
          item.pendienteActual = item.pendiente;

          // invoice or credit note
          //
          item.fc_id = valField(m_data.pagosAplicados[_i], CC.FC_ID);

          item.fcp_id = valField(m_data.pagosAplicados[_i], CT.FCP_ID2);
          item.fcd_id = valField(m_data.pagosAplicados[_i], CT.FCD_ID2);

          // payments
          //
          item.opg_id = valField(m_data.pagosAplicados[_i], CT.OPG_ID);
          item.fecha = valFieldDateValue(m_data.pagosAplicados[_i], CT.OPG_FECHA);
          item.cotizacion = valField(m_data.pagosAplicados[_i], CT.FC_OPG_COTIZACION);

          // applied
          //
          var aplicaciones = item.vAplicaciones[indexInfo.indexAplic];
          aplicaciones.fcopg_id = valField(m_data.pagosAplicados[_i], CT.FC_OPG_ID);
          aplicaciones.fcnc_id = valField(m_data.pagosAplicados[_i], CT.FC_NC_ID);
          aplicaciones.fcp_id = valField(m_data.pagosAplicados[_i], CT.FCP_ID);
          aplicaciones.fcd_id = valField(m_data.pagosAplicados[_i], CT.FCD_ID);
          aplicaciones.aplicado = valField(m_data.pagosAplicados[_i], C.APLICADO);

          // total applied to this credit
          //
          item.aplicado = item.aplicado + item.vAplicaciones[indexInfo.indexAplic].aplicado;
          item.aplicadoActual = item.aplicado;
        }
      };

      var setGridVencimientos = function(property) {

        var elem;

        var grid = property.getGrid();

        var columns = grid.getColumns();
        columns.clear();

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIV_FCD_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIV_FCP_ID);

        elem = columns.add(null);
        elem.setName(getText(1569, "")); // Fecha
        elem.setType(Dialogs.PropertyType.date);
        elem.setKey(KIV_FECHA);

        elem = columns.add(null);
        elem.setName(getText(1609, "")); // Pendiente
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIV_PENDIENTE);

        elem = columns.add(null);
        elem.setName(getText(1608, "")); // Aplicado
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIV_APLICADO);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIV_APLICADO2);

        grid.getRows().clear();
      };
      
      var loadVencimientos = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();

        for(var _i = 0, count = m_data.vencimientos.length; _i < count; _i += 1) {

          var row = rows.add(null);

          elem = row.add(null);
          elem.setId(valField(m_data.vencimientos[_i], CT.FCD_ID));
          elem.setKey(KIV_FCD_ID);

          elem = row.add(null);
          elem.setId(valField(m_data.vencimientos[_i], CT.FCP_ID));
          elem.setKey(KIV_FCP_ID);

          elem = row.add(null);
          elem.setValue(valField(m_data.vencimientos[_i], C.FECHA));
          elem.setKey(KIV_FECHA);

          elem = row.add(null);
          elem.setValue(valField(m_data.vencimientos[_i], C.PENDIENTE));
          elem.setKey(KIV_PENDIENTE);

          elem = row.add(null);
          elem.setValue(valField(m_data.vencimientos[_i], C.IMPORTE));
          elem.setKey(KIV_APLICADO);

          elem = row.add(null);
          elem.setValue(valField(m_data.vencimientos[_i], C.IMPORTE));
          elem.setKey(KIV_APLICADO2);
        }
      };

      var ordenPagoLoadAplicCreditos = function() {
        for(var _i = 0, count = m_data.pagosParaAplicar.length; _i < count; _i += 1) {
          var pendiente = valField(m_data.pagosParaAplicar[_i], C.PENDIENTE);
          m_vOpgNC.push({
            opg_id: valField(m_data.pagosParaAplicar[_i], CT.OPG_ID),
            fc_id: valField(m_data.pagosParaAplicar[_i], CC.FC_ID),
            fcd_id: valField(m_data.pagosParaAplicar[_i], CT.FCD_ID),
            fcp_id: NO_ID,
            docName: valField(m_data.pagosParaAplicar[_i], C.DOC_NAME),
            nroDoc: valField(m_data.pagosParaAplicar[_i], C.NRO_DOC),
            fecha: valFieldDateValue(m_data.pagosParaAplicar[_i], C.FECHA),
            pendiente: pendiente,
            pendienteActual: pendiente,
            cotizacion: valField(m_data.pagosParaAplicar[_i], CT.FC_OPG_COTIZACION),
            vAplicaciones: [],
            aplicado: 0,
            aplicadoActual: 0
          });
        }
      };

      var setGridAplicOrdenPago = function(property) {
        var elem;
        var grid = property.getGrid();

        var columns = grid.getColumns();
        columns.clear();
        
        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_IDX1);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_IDX2);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_FCOPG_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_FCNC_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_OPG_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_FC_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_FCD_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_FCP_ID);

        elem = columns.add(null);
        elem.setName(getText(1567, "")); // Documento
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIC_DOC);

        elem = columns.add(null);
        elem.setName(getText(1610, "")); // Comprobante
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIC_NRODOC);

        elem = columns.add(null);
        elem.setName(getText(1569, "")); // Fecha
        elem.setType(Dialogs.PropertyType.date);
        elem.setKey(KIC_FECHA);

        elem = columns.add(null);
        elem.setName(getText(1609, "")); // Pendiente
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIC_PENDIENTE);

        elem = columns.add(null);
        elem.setName(getText(1608, "")); // Aplicado
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIC_APLICADO);

        elem = columns.add(null);
        elem.setName(getText(1650, "")); // Cotiz.
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(Cairo.Settings.getCurrencyRateDecimalsFormat());
        elem.setKey(KIC_COTIZACION);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_APLICADO2);

        grid.getRows().clear();
      };

      var createOrdenPagoItem = function() {
        return {
          opg_id: NO_ID,
          fc_id: NO_ID,
          fcd_id: NO_ID,
          fcp_id: NO_ID,
          docName: "",
          nroDoc: "",
          fecha: Cairo.Constants.NO_DATE,
          pendiente: 0,
          pendienteActual: 0,
          cotizacion: 1,
          vAplicaciones: [],
          aplicado: 0,
          aplicadoActual: 0
        };
      };

      var ordenPagoAddToCreditos = function(opgId, fcdId, fcpId) {
        var index = -1;

        for(var i = 0, count = m_vOpgNC.length; i < count ; i += 1) {
          if(   (m_vOpgNC[i].opg_id === opgId && opgId !== NO_ID)
             || (m_vOpgNC[i].fcd_id === fcdId && fcdId !== NO_ID)
             || (m_vOpgNC[i].fcp_id === fcpId && fcpId !== NO_ID)) {

            index = i;
            break;
          }
        }

        if (index === -1) {
          m_vOpgNC.push(createOrdenPagoItem());
          index = m_vOpgNC.length -1;
        }

        m_vOpgNC[index].vAplicaciones.push(createOrdenPagoAplic());

        return {
          indexPago: index,
          indexAplic: m_vOpgNC[index].vAplicaciones.length -1
        };
      };

      var createOrdenPagoAplic = function() {
        return {
          fcopg_id: NO_ID,
          fcnc_id: NO_ID,
          fcp_id: NO_ID,
          fcd_id: NO_ID,
          aplicado: 0
        };
      };

      var ordenPagoSetAplicVtos = function(property, fcdId, fcpId) {
        var rows = property.getGrid().getRows();
        rows.clear();

        m_fcdId = fcdId;
        m_fcpId = fcpId;

        for(var i = 0, count = m_vOpgNC.length; i < count; i++) {

          if(m_vOpgNC[i].vAplicaciones.length > 0) {
            ordenPagoSetAplicVtosAux1(i, property, fcdId, fcpId);
          }
          else {
            ordenPagoSetAplicVtosAux2(i, property);
          }
        }

        // now applied credits to other installment and have a pending amount
        //
        for(var i = 0, count = m_vOpgNC.length; i < count; i++) {

          var bAplic = false;
          var id;

          for(var _j = 0, _countj = rows.size(); _j < _countj; _j++) {
            var row = rows.item(_j);
            id = getCell(row, KIC_OPG_ID).getId();
            if(id === m_vOpgNC[i].opg_id && id !== NO_ID) {
              bAplic = true;
              break;
            }

            id = getCell(row, KIC_FCD_ID).getId();
            if(id === m_vOpgNC[i].fcd_id && id !== NO_ID) {
              bAplic = true;
              break;
            }

            id = getCell(row, KIC_FCP_ID).getId();
            if(id === m_vOpgNC[i].fcp_id && id !== NO_ID) {
              bAplic = true;
              break;
            }

            for(var j = 0, countj = m_vOpgNC[i].vAplicaciones.length; j < countj; j++) {

              id = getCell(row, KIC_FCD_ID).getId();
              if(id === m_vOpgNC[i].vAplicaciones[j].fcd_id && id !== NO_ID) {
                bAplic = true;
                break;
              }

              id = getCell(row, KIC_FCP_ID).getId();
              if(id === m_vOpgNC[i].vAplicaciones[j].fcp_id && id !== NO_ID) {
                bAplic = true;
                break;
              }
            }

            if(bAplic) { break; }
          }

          if(!bAplic) {
            ordenPagoSetAplicVtosAux2(i, property);
          }
        }
      };

      var ordenPagoSetAplicVtosAux1 = function(idx, property, fcdId, fcpId) {

        var elem;
        var rows = property.getGrid().getRows();

        for(var i = 0, count = m_vOpgNC[idx].vAplicaciones.length; i < count; i++) {

          if(
               (m_vOpgNC[idx].vAplicaciones[i].fcd_id === fcdId && fcdId !== NO_ID)
            || (m_vOpgNC[idx].vAplicaciones[i].fcp_id === fcpId && fcpId !== NO_ID)
            ) {

            var row = rows.add(null);

            elem = row.add(null);
            elem.setId(idx);
            elem.setKey(KIC_IDX1);

            elem = row.add(null);
            elem.setId(i);
            elem.setKey(KIC_IDX2);

            elem = row.add(null);
            elem.setId(m_vOpgNC[idx].vAplicaciones[i].fcopg_id);
            elem.setKey(KIC_FCOPG_ID);

            elem = row.add(null);
            elem.setId(m_vOpgNC[idx].vAplicaciones[i].fcnc_id);
            elem.setKey(KIC_FCNC_ID);

            elem = row.add(null);
            elem.setId(m_vOpgNC[idx].opg_id);
            elem.setKey(KIC_OPG_ID);

            elem = row.add(null);
            elem.setId(m_vOpgNC[idx].fc_id);
            elem.setKey(KIC_FC_ID);

            elem = row.add(null);
            elem.setId(m_vOpgNC[idx].vAplicaciones[i].fcd_id);
            elem.setKey(KIC_FCD_ID);

            elem = row.add(null);
            elem.setId(m_vOpgNC[idx].vAplicaciones[i].fcp_id);
            elem.setKey(KIC_FCP_ID);

            elem = row.add(null);
            elem.setValue(m_vOpgNC[idx].docName);
            elem.setKey(KIC_DOC);

            elem = row.add(null);
            elem.setValue(m_vOpgNC[idx].nroDoc);
            elem.setKey(KIC_NRODOC);

            elem = row.add(null);
            if(m_vOpgNC[idx].fecha === Cairo.Constants.NO_DATE) {
              elem.setValue("");
            }
            else {
              elem.setValue(m_vOpgNC[idx].fecha);
            }
            elem.setKey(KIC_FECHA);

            elem = row.add(null);
            elem.setValue(m_vOpgNC[idx].pendiente);
            elem.setKey(KIC_PENDIENTE);

            elem = row.add(null);
            elem.setValue(m_vOpgNC[idx].vAplicaciones[i].aplicado);
            elem.setKey(KIC_APLICADO);

            elem = row.add(null);
            if(m_vOpgNC[idx].cotizacion !== 0) {
              elem.setValue(m_vOpgNC[idx].cotizacion);
            }
            elem.setKey(KIC_COTIZACION);

            elem = row.add(null);
            elem.setValue(m_vOpgNC[idx].vAplicaciones[i].aplicado);
            elem.setKey(KIC_APLICADO2);
          }
        }
      };

      var ordenPagoSetAplicVtosAux2 = function(i, property) {

        if(m_vOpgNC[i].pendiente <= 0) { return; }

        var elem;
        var row  = property.getGrid().getRows().add(null);

        elem = row.add(null);
        elem.setId(i);
        elem.setKey(KIC_IDX1);

        elem = row.add(null);
        elem.setId(-1);
        elem.setKey(KIC_IDX2);

        elem = row.add(null);
        elem.setId(NO_ID);
        elem.setKey(KIC_FCOPG_ID);

        elem = row.add(null);
        elem.setId(NO_ID);
        elem.setKey(KIC_FCNC_ID);

        elem = row.add(null);
        elem.setId(m_vOpgNC[i].opg_id);
        elem.setKey(KIC_OPG_ID);

        elem = row.add(null);
        elem.setId(m_vOpgNC[i].fc_id);
        elem.setKey(KIC_FC_ID);

        elem = row.add(null);
        elem.setId(m_vOpgNC[i].fcd_id);
        elem.setKey(KIC_FCD_ID);

        elem = row.add(null);
        elem.setId(NO_ID);
        elem.setKey(KIC_FCP_ID);

        elem = row.add(null);
        elem.setValue(m_vOpgNC[i].docName);
        elem.setKey(KIC_DOC);

        elem = row.add(null);
        elem.setValue(m_vOpgNC[i].nroDoc);
        elem.setKey(KIC_NRODOC);

        elem = row.add(null);
        if(m_vOpgNC[i].fecha === Cairo.Constants.NO_DATE) {
          elem.setValue("");
        }
        else {
          elem.setValue(m_vOpgNC[i].fecha);
        }
        elem.setKey(KIC_FECHA);

        elem = row.add(null);
        elem.setValue(m_vOpgNC[i].pendiente);
        elem.setKey(KIC_PENDIENTE);

        elem = row.add(null);
        elem.setValue(0);
        elem.setKey(KIC_APLICADO);

        elem = row.add(null);
        elem.setKey(KIC_COTIZACION);

        elem = row.add(null);
        elem.setValue(0);
        elem.setKey(KIC_APLICADO2);
      };

      var ordenPagoUpdateAplicVtos = function() {
        var aplicadoTotal = 0;
        var rows = ordenPagoGetItemsOrdenPago().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {
          var row = rows.item(_i);

          if(cellFloat(row, KIC_APLICADO) > 0 || getCell(row, KIC_IDX2).getId() !== -1) {

            var i = getCell(row, KIC_IDX1).getId();
            var j = getCell(row, KIC_IDX2).getId();

            var aplicado = cellFloat(row, KIC_APLICADO);
            aplicadoTotal += aplicado;

            m_vOpgNC[i].aplicado = ordenPagoAddToAplic(m_vOpgNC[i].vAplicaciones, aplicado, j);
            m_vOpgNC[i].pendiente = m_vOpgNC[i].pendienteActual - (m_vOpgNC[i].aplicado - m_vOpgNC[i].aplicadoActual);
          }
        }

        return aplicadoTotal;
      };

      var ordenPagoAddToAplic = function(vAplicaciones, importe, idx) {
        var aplicado = 0;

        if(idx === -1) {
          vAplicaciones.push(createOrdenPagoAplic());
          idx = vAplicaciones.length -1;
          vAplicaciones[idx].fcd_id = m_fcdId;
          vAplicaciones[idx].fcp_id = m_fcpId;
        }

        vAplicaciones[idx].aplicado = importe;

        for(var i = 0, count = vAplicaciones.length; i < count; i++) {
          aplicado += vAplicaciones[i].aplicado;
        }

        return aplicado;
      };

      var ordenPagoGetVtoPendiente = function() {
        var property = m_dialog.getProperties().item(C_VENCIMIENTOS);
        return getCell(property.getGrid().getRows().item(property.getSelectedRow()), KIV_PENDIENTE);
      };

      var ordenPagoGetVtoAplicado = function() {
        var property = m_dialog.getProperties().item(C_VENCIMIENTOS);
        return getCell(property.getGrid().getRows().item(property.getSelectedRow()), KIV_APLICADO2);
      };

      var ordenPagoColAUpdateOrdenPago = function(property, lRow, lCol) {
        var grid = property.getGrid();
        
        switch (grid.getColumns().item(lCol).getKey()) {
          case KIC_APLICADO:
            var row = grid.getRows().item(lRow);

            var cell = getCell(row, KIC_APLICADO);

            var pendiente = Cairo.Util.val(ordenPagoGetVtoPendiente().getValue()) + cellFloat(row, KIC_APLICADO2);
            var maxVal = cellFloat(row, KIC_PENDIENTE) + cellFloat(row, KIC_APLICADO2);

            if(maxVal > pendiente) {
              maxVal = pendiente;
            }

            if(Cairo.Util.val(cell.getValue()) > maxVal) {
              cell.setValue(maxVal);
            }
            else if(Cairo.Util.val(cell.getValue()) < 0) {
              cell.setValue(0);
            }

            var aplicado = ordenPagoGetAplicado();
            ordenPagoRefreshVto(aplicado);
            ordenPagoGetVtoAplicado().setValue(aplicado);

            // update pending credit
            //
            cell = getCell(row, KIC_PENDIENTE);
            cell.setValue(Cairo.Util.val(cell.getValue()) + cellFloat(row, KIC_APLICADO2) - cellFloat(row, KIC_APLICADO));
            getCell(row, KIC_APLICADO2).setValue(getCell(row, KIC_APLICADO).getValue());

            ordenPagoShowPendienteOrdenPago();
            break;
        }
      };

      var ordenPagoGetAplicado = function() {
        var aplicado = 0;

        var _count = m_dialog.getProperties().item(C_APLICORDENPAGO).getGrid().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          var row = m_dialog.getProperties().item(C_APLICORDENPAGO).getGrid().getRows().item(_i);
          aplicado += cellFloat(row, KIC_APLICADO);
        }
        return aplicado;
      };

      var ordenPagoRefreshVto = function(aplicado) {
        var property = m_dialog.getProperties().item(C_VENCIMIENTOS);
        var row = property.getGrid().getRows().item(m_lastRowVto);

        getCell(row, KIV_APLICADO).setValue(aplicado);
        var aplicadoActual = cellFloat(row, KIV_APLICADO2);

        var w_pCell = getCell(row, KIV_PENDIENTE);
        w_pCell.setValue(w_pCell.getValue() - (aplicado - aplicadoActual));

        getCell(row, KIV_APLICADO2).setValue(aplicado);

        var cols = property.getGrid().getColumns();
        m_dialog.showCellValue(property, m_lastRowVto,  D.getCol(cols, KIV_PENDIENTE).getIndex());
        m_dialog.showCellValue(property, m_lastRowVto, D.getCol(cols, KIV_APLICADO).getIndex());
      };

      var ordenPagoGetItemsOrdenPagoProperty = function() {
        return m_dialog.getProperties().item(C_APLICORDENPAGO);
      };

      var ordenPagoGetItemsOrdenPago = function() {
        return m_dialog.getProperties().item(C_APLICORDENPAGO).getGrid();
      };

      var ordenPagoGetItemsVtosProperty = function() {
        return m_dialog.getProperties().item(C_VENCIMIENTOS);
      };

      var ordenPagoColBEditOrdenPago = function(property, lRow, lCol) {
        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).getKey()) {

          case KIC_APLICADO:
            return true;

          case KIC_COTIZACION:
            if(cellVal(grid.getRows().item(lRow), KIC_COTIZACION) !== "") {
              return true;
            }
            break;
        }
        return false;
      };

      var ordenPagoShowPendienteOrdenPago = function() {
        var total = 0;
        var rows = ordenPagoGetItemsVtosProperty().getGrid().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {
          var row = rows.item(_i);
          total = total + cellFloat(row, KIV_PENDIENTE);
        }

        ordenPagoGetPendienteOrdenPago().setValue(total);

        m_dialog.showValue(ordenPagoGetPendienteOrdenPago());
      };

      var ordenPagoGetPendienteOrdenPago = function() {
        return m_dialog.getProperties().item(C_PENDIENTE_ORDEN_PAGO);
      };

      var ordenPagoUpdateGrids = function() {
        var aplicado = 0;

        if(m_lastRowVto !== -1) {
          aplicado = ordenPagoUpdateAplicVtos();
        }

        return aplicado;
      };

      var ordenPagoSaveNotaCredito = function(mainRegister) {
        var transaction = DB.createTransaction();

        transaction.setTable(CT.FACTURA_COMPRA_NOTA_CREDITO_TMP);

        for(var i = 0, count = m_vOpgNC.length; i < count; i += 1) {

          if(m_vOpgNC[i].fc_id !== NO_ID) {

            for(var j = 1, count_j = m_vOpgNC[i].vAplicaciones.length; j < count_j; j += 1) {

              if(m_vOpgNC[i].vAplicaciones[j].aplicado > 0 || m_vOpgNC[i].vAplicaciones[j].fcnc_id) {

                var register = new DB.Register();
                register.setFieldId(CT.FC_NC_TMP_ID);
                register.setId(Cairo.Constants.NEW_ID);

                var fields = register.getFields();

                if(m_isNotaCredito) {
                  fields.add(CT.FC_ID_NOTA_CREDITO, m_fcId, Types.id);
                  fields.add(CT.FC_ID_FACTURA, m_vOpgNC[i].fc_id, Types.id);

                  fields.add(CT.FCD_ID_NOTA_CREDITO, m_vOpgNC[i].vAplicaciones[j].fcd_id, Types.id);
                  fields.add(CT.FCD_ID_FACTURA, m_vOpgNC[i].fcd_id, Types.id);

                  fields.add(CT.FCP_ID_NOTA_CREDITO, m_vOpgNC[i].vAplicaciones[j].fcp_id, Types.id);
                  fields.add(CT.FCP_ID_FACTURA, m_vOpgNC[i].fcp_id, Types.id);
                }
                else {
                  fields.add(CT.FC_ID_NOTA_CREDITO, m_vOpgNC[i].fc_id, Types.id);
                  fields.add(CT.FC_ID_FACTURA, m_fcId, Types.id);

                  fields.add(CT.FCD_ID_NOTA_CREDITO, m_vOpgNC[i].fcd_id, Types.id);
                  fields.add(CT.FCD_ID_FACTURA, m_vOpgNC[i].vAplicaciones[j].fcd_id, Types.id);

                  fields.add(CT.FCP_ID_NOTA_CREDITO, m_vOpgNC[i].fcp_id, Types.id);
                  fields.add(CT.FCP_ID_FACTURA, m_vOpgNC[i].vAplicaciones[j].fcp_id, Types.id);
                }

                fields.add(CT.FC_NC_IMPORTE, m_vOpgNC[i].vAplicaciones[j].aplicado, Types.double);
                fields.add(CT.FC_NC_ID, 0, Types.long);

                transaction.addRegister(register);
              }
            }
          }
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var ordenPagoSaveOrdenPago = function(mainRegister) {
        var transaction = DB.createTransaction();

        transaction.setTable(CT.ORDEN_PAGO_TMP);

        var ordenPagos = ordenPagoGetOrdenPagos();
        for(var i = 0, count = ordenPagos.length; i < count; i += 1) {
          ordenPagoSaveOrdenPagoAux(transaction, ordenPagos[i].opg_id, ordenPagos[i].newAplic, m_vOpgNC[i].cotizacion);
        }

        mainRegister.addTransaction(transaction);
      };

      var ordenPagoGetOrdenPagos = function() {
        var ordenPagos = [];
        for(var i = 0, count = m_vOpgNC.length; i < count; i += 1) {
          if(m_vOpgNC[i].opg_id !== NO_ID) {
            if(m_vOpgNC[i].aplicado > 0 || m_vOpgNC[i].aplicadoActual !== 0) {
              var k = ordenPagoGetIdxOrdenPagos(ordenPagos, m_vOpgNC[i].opg_id);
              ordenPagos[k] = {
                opg_id: m_vOpgNC[i].opg_id,
                newAplic: m_vOpgNC[i].aplicado,
                currAplic: m_vOpgNC[i].aplicadoActual
              };
            }
          }
        }
        return ordenPagos;
      };

      var ordenPagoGetIdxOrdenPagos = function(ordenPagos, opgId) {
        for(var i = 0, count = ordenPagos.length; i < count ; i += 1) {
          if(ordenPagos[i].opg_id === opgId) {
            return i;
          }
        }
        return ordenPagos.length;
      };

      var ordenPagoSaveOrdenPagoAux = function(transaction, opgId, aplic, opgCotizacion) {

        var register = new DB.Register();
        register.setFieldId(CT.OPG_TMP_ID);
        register.setId(Cairo.Constants.NEW_ID);

        var fields = register.getFields();

        fields.add(CT.OPG_NUMERO, 0, Types.long);
        fields.add(C.PROV_ID, NO_ID, Types.long);
        fields.add(C.SUC_ID, NO_ID, Types.long);
        fields.add(C.DOC_ID, NO_ID, Types.long);
        fields.add(C.EST_ID, NO_ID, Types.long);
        fields.add(CT.OPG_ID, opgId, Types.id);

        ordenPagoSaveItems(register, opgId);
        ordenPagoSaveCtaCte(register, opgId, aplic, opgCotizacion);

        transaction.addRegister(register);

        return true;
      };

      var ordenPagoSaveItems = function(mainRegister, opgId) {
        var transaction = DB.createTransaction();

        transaction.setTable(CT.FACTURA_COMPRA_ORDEN_PAGO_TMP);

        for(var i = 0, count = m_vOpgNC.length; i < count; i += 1) {

          if(m_vOpgNC[i].opg_id === opgId) {

            for(var j = 1, count_j = m_vOpgNC[i].vAplicaciones.length; j < count_j; j += 1) {

              if(m_vOpgNC[i].vAplicaciones[j].aplicado > 0 || m_vOpgNC[i].vAplicaciones[j].fcopg_id) {

                var register = new DB.Register();
                register.setFieldId(CT.FC_OPG_TMP_ID);
                register.setId(Cairo.Constants.NEW_ID);

                var fields = register.getFields();

                fields.add(CT.OPG_ID, m_vOpgNC[i].opg_id, Types.long);
                fields.add(CC.FC_ID, m_fcId, Types.id);
                fields.add(CT.FCD_ID, m_vOpgNC[i].vAplicaciones[j].fcd_id, Types.id);
                fields.add(CT.FCP_ID, m_vOpgNC[i].vAplicaciones[j].fcp_id, Types.id);
                fields.add(CT.FC_OPG_ID, m_vOpgNC[i].vAplicaciones[j].fcopg_id, Types.long);

                fields.add(CT.FC_OPG_COTIZACION, m_vOpgNC[i].cotizacion, Types.double);
                fields.add(CT.FC_OPG_IMPORTE, m_vOpgNC[i].vAplicaciones[j].aplicado, Types.double);
                fields.add(CT.FC_OPG_IMPORTE_ORIGEN, Cairo.Util.zeroDiv(m_vOpgNC[i].vAplicaciones[j].aplicado, m_vOpgNC[i].cotizacion), Types.double);

                transaction.addRegister(register);
              }
            }
          }
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var ordenPagoSaveCtaCte = function(mainRegister, opgId, aplic, opgCotizacion) {
        var transaction = DB.createTransaction();

        transaction.setTable(CT.ORDEN_PAGO_ITEM_CUENTA_CORRIENTE_TMP);

        aplic = ordenPagoGetAplic(aplic, opgCotizacion);

        var register = new DB.Register();
        register.setFieldId(CT.OPGI_TMP_ID);
        register.setId(Cairo.Constants.NEW_ID);

        var fields = register.getFields();

        fields.add(C.CUE_ID, m_ctaCteCueId, Types.id);
        fields.add(CT.OPGI_IMPORTE_ORIGEN, aplic.importeOrigen, Types.currency);
        fields.add(CT.OPGI_IMPORTE, aplic.importe, Types.currency);

        fields.add(CT.OPGI_ORDEN, 1, Types.integer);
        fields.add(CT.OPGI_TIPO, CT.OrdenPagoItemTipo.ITEM_CTA_CTE, Types.integer);
        fields.add(CT.OPGI_OTRO_TIPO, CT.OtroTipo.OTRO_HABER, Types.integer);

        mainRegister.addTransaction(transaction);

        return true;
      };

      var ordenPagoGetAplic = function(aplic, cotizacion) {
        var importes = {
          importe: aplic,
          importeOrigen: 0
        };

        if(m_monIdXCuenta !== m_defaultCurrency) {
          importes.importeOrigen = aplic * cotizacion;
        }

        return importes;
      };

      var initialize = function() {
        try {

          m_vOpgNC = [];
          m_vOrdenRemito = [];

        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "initialize", C_MODULE, "");
        }
      };

      initialize();

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

}());