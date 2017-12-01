(function() {
  "use strict";

  Cairo.module("FacturaVentaAplic.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var TITLE = getText(1649, ""); // Aplicación Factura de Venta
      var SAVE_ERROR_MESSAGE = getText(2220, ""); // Error al grabar la factura de venta

      var Dialogs = Cairo.Dialogs;

      var C_MODULE = "cFacturaVentaAplic";

      var P = Cairo.Promises;
      var C = Cairo.General.Constants;
      var CV = Cairo.Ventas.Constants;
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
      var val = Cairo.Util.val;

      var K_PENDIENTE_COBRANZA = 10;
      var K_TOTAL_COBRANZA = 11;
      var K_VENCIMIENTOS = 12;
      var K_APLIC_COBRANZA = 13;
      var C_VENCIMIENTOS = "Vencimientos";
      var C_APLIC_COBRANZA = "AplicCobr";
      var C_PENDIENTE_COBRANZA = "PendienteCob";
      var C_TOTAL_COBRANZA = "TotalCob";

      var KIV_FVD_ID = 1;
      var KIV_FVP_ID = 2;
      var KIV_FECHA = 3;
      var KIV_APLICADO = 4;
      var KIV_APLICADO2 = 5;
      var KIV_PENDIENTE = 6;

      var KIC_FVCOBZ_ID = 1;
      var KIC_FVD_ID = 2;
      var KIC_FVP_ID = 3;
      var KIC_FV_ID = 4;
      var KIC_DOC = 5;
      var KIC_FECHA = 6;
      var KIC_COTIZACION = 7;
      var KIC_PENDIENTE = 8;
      var KIC_APLICADO = 11;
      var KIC_APLICADO2 = 12;
      var KIC_COBZ_ID = 14;
      var KIC_NRODOC = 15;
      var KIC_IDX1 = 16;
      var KIC_IDX2 = 17;
      var KIC_FVNC_ID = 18;

      var K_ITEMS = 20;
      var K_APLIC_PEDIDO_REMITO = 21;
      var C_ITEMS = "Items";
      var C_APLIC_PEDIDO_REMITO = "AplicPedidoRemito";

      var K_DESAPLIC_ITEMS = 22;

      var KII_FVI_ID = 1;
      var KII_PR_ID = 2;
      var KII_APLICADO = 4;
      var KII_APLICADO2 = 5;
      var KII_PENDIENTE = 6;

      var KIPR_PVFV_ID = 1;
      var KIPR_RVFV_ID = 2;
      var KIPR_PVI_ID = 3;
      var KIPR_RVI_ID = 4;
      var KIPR_PV_ID = 5;
      var KIPR_RV_ID = 6;
      var KIPR_DOC = 7;
      var KIPR_FECHA = 8;
      var KIPR_PENDIENTE = 9;
      var KIPR_APLICADO = 11;
      var KIPR_APLICADO2 = 12;
      var KIPR_NRODOC = 15;
      var KIPR_IDX1 = 16;
      var KIPR_IDX2 = 17;

      var m_editing;
      var m_dialog;
      var m_generalConfig;
      var m_fvId = 0;
      var m_isNotaCredito;
      var m_fvNumero = "";
      var m_cliente = "";
      var m_cliId = 0;
      var m_docId = 0;
      var m_sucId = 0;
      var m_total = 0;
      var m_ctaCteCueId = 0;
      var m_monIdXCuenta = 0;

      var m_defaultCurrency = D.getDefaultCurrency();

      var m_lastRowVto = -1;
      var m_lastRowItem = -1;

      var m_client = null;
      var m_empId = 0;
      var m_empName = "";

      var m_vCobzNC;
      var m_fvdId = 0;
      var m_fvpId = 0;

      var m_vPedidoRemito;
      var m_fviId = 0;

      var m_apiPath = DB.getAPIVersion();

      var emptyData = {
        vencimientos: [],
        items: [],
        cobrosAplicados: [],
        cobrosParaAplicar: [],
        itemsAplicados: [],
        itemsParaAplicar: []
      };

      var m_data = emptyData;

      self.setClient = function(rhs) {
        m_client = rhs;
      };

      self.getId = function() {
        return m_fvId;
      };

      self.show = function(fvId, total, fvNumero, cliId, cliente, sucId, docId, isNotaCredito, empId, empName) {

        if(m_dialog === null) {
          m_dialog = Cairo.Dialogs.Views.Controller.newDialog();
        }

        if(m_fvId !== fvId) {
          m_isNotaCredito = isNotaCredito;
          m_fvId = fvId;
          m_fvNumero = fvNumero;
          m_cliente = cliente;
          m_cliId = cliId;
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
                  cobranzaRefreshVto(cobranzaUpdateteGrids());
                }

                // show amounts applied for this installment
                //
                m_lastRowVto = info.getSelectedRow();
                var row = info.getGrid().getRows().item(m_lastRowVto);
                if(row !== null) {
                  cobranzaSetAplicVtos(
                    cobranzaGetItemsCobranzaProperty(), 
                    getCell(row, KIV_FVD_ID).getId(), 
                    getCell(row, KIV_FVP_ID).getId());
                  m_dialog.showValue(cobranzaGetItemsCobranzaProperty(), true);
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
                    m_dialog.getProperties().item(C_APLIC_PEDIDO_REMITO),
                    getCell(row, KII_FVI_ID).getId(),
                    getCell(row, KII_PR_ID).getId());
                  m_dialog.showValue(m_dialog.getProperties().item(C_APLIC_PEDIDO_REMITO), true);
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
        return Cairo.Promises.resolvedPromise(refreshCollection());
      };

      self.propertyChange = function(key) {
        switch (key) {
          case K_DESAPLIC_ITEMS:
            return unApplyItems();

          default:
            return Cairo.Promises.resolvedPromise(false);
        }
      };

      var unApplyItems = function() {
        for(var i = 0, count = m_vPedidoRemito.length; i < count; i+=1) {
          m_vPedidoRemito[i].aplicado = 0;
          m_vPedidoRemito[i].pendiente = m_vPedidoRemito[i].pendienteActual + m_vPedidoRemito[i].aplicadoActual;
          for(var j = 0, count_j = m_vPedidoRemito[i].vAplicaciones.length; j < count_j; j+=1) {
            m_vPedidoRemito[i].vAplicaciones(j).aplicado = 0;
          }
        }

        setUnApplyToGrid(m_vPedidoRemito, m_dialog.getProperties().item(C_ITEMS));

        if(m_lastRowItem > 0) {
          var row = m_dialog.getProperties().item(C_ITEMS).getGrid().getRows().item(m_lastRowItem);
          itemSetAplicItems(
            m_dialog.getProperties().item(C_APLIC_PEDIDO_REMITO),
            row.item(KII_FVI_ID).getId(),
            row.item(KII_PR_ID).getId());
        }

        m_dialog.showValue(m_dialog.getProperties().item(C_ITEMS), true);
        m_dialog.showValue(m_dialog.getProperties().item(C_APLIC_PEDIDO_REMITO), true);

        return Cairo.Promises.resolvedPromise(false);
      };

      var setUnApplyToGrid = function(vAplic, property) {
        var rows = property.getGrid().getRows();
        for(var _i = 0, _count = rows.size(); _i < _count; _i += 1) {
          var row = rows.item(_i);
          getCell(row, KII_PENDIENTE).setValue(
              val(getCell(row, KII_PENDIENTE).getValue()) + val(getCell(row, KII_APLICADO).getValue()));
          getCell(row, KII_APLICADO).setValue(0);
        }

        for(var i = 0, count = vAplic.length; i < count; i += 1) {
          for(var j = 0, count_j = vAplic.vAplicaciones.length; j < count_j; j += 1) {
            vAplic.aplicado = itemAddToAplic(vAplic.vAplicaciones, 0, j);
            vAplic.pendiente = vAplic.pendienteActual - (vAplic.aplicado - vAplic.aplicadoActual);
          }
        }
      };

      self.save = function() {

        if(m_empId !== Cairo.Company.getId()) {
          return D.msgApplyDisabled(m_empName);
        }

        cobranzaUpdateteGrids();
        itemUpdateGrids();

        var register = new DB.Register();

        register.setFieldId(CV.FV_ID);
        register.setTable(CV.FACTURA_VENTA);
        register.setPath(m_apiPath + "ventas/facturaventa/aplic");
        register.setId(m_fvId);
        
        saveDocVta(register);
        itemSavePedidoRemito(register);

        cobranzaSaveNotaCredito(register);
        cobranzaSaveCobranza(register);

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
        data.cobrosAplicados = DB.getResultSetFromData(data.get('cobrosAplicados'));
        data.cobrosParaAplicar = DB.getResultSetFromData(data.get('cobrosParaAplicar'));
        data.itemsAplicados = DB.getResultSetFromData(data.get('itemsAplicados'));
        data.itemsParaAplicar = DB.getResultSetFromData(data.get('itemsParaAplicar'));

        return data;
      };

      var load = function() {
        return DB.getData("load[" + m_apiPath + "ventas/facturaventa/aplic]", m_fvId).then(
          function(response) {
            if(response.success !== true) { return false; }

            if(response.data.id === m_fcId) {

              m_data = loadDataFromResponse(response);

              var data = response.data;

              m_ctaCteCueId = valField(data, CT.CTACTE_CUE_ID);
              m_monIdXCuenta = valField(data, CT.MON_ID_X_CUENTA);

              cobranzaLoadAplicVtos();
              itemLoadAplicItems();

              return true;
            }
          });
      };

      var destroy = function() {
        try {
          m_dialog = null;
          m_vCobzNC = [];
          m_vPedidoRemito = [];
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
        return "#general/facturaventaaplic/" + m_fvId.toString();
      };

      self.getEditorName = function() {
        return "facturaventaaplic" + m_fvId;
      };

      self.getTitle = function() {
        return TITLE + " " + m_fvNumero + " - " + m_cliente;
      };

      self.getTabTitle = function() {
        return "FVA-" + m_fvNumero;
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
            case K_APLIC_COBRANZA:
              cobranzaColAUpdateCobranza(cobranzaGetItemsCobranzaProperty(), lRow, lCol);
              break;

            case K_APLIC_PEDIDO_REMITO:
              itemColAUpdatePedidoRemito(getItemsPedidoRemitoProperty(), lRow, lCol);
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

            case K_APLIC_COBRANZA:
              rtn = cobranzaColBEditCobranza(cobranzaGetItemsCobranzaProperty(), lRow, lCol);
              break;

            case K_APLIC_PEDIDO_REMITO:
              rtn = itemColBEditPedidoRemito(getItemsPedidoRemitoProperty(), lRow, lCol);
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

            case K_APLIC_COBRANZA:

              var rows = cobranzaGetItemsCobranza().getRows();
              if(getCell(rows.item(lRow), KIC_COBZ_ID).getId() === NO_ID) {
                p = D.showDocAux(getCell(rows.item(lRow), KIC_FV_ID).getId(), "FacturaVenta");
              }
              else {
                p = D.showDocAux(getCell(rows.item(lRow), KIC_COBZ_ID).getId(), "Cobranza");
              }
              break;

            case K_APLIC_PEDIDO_REMITO:

              var rows = getItemsPedidoRemito().getRows();
              var objEditName = "";

              var id = getCell(rows.item(lRow), KIPR_PV_ID).getId();
              if(id !== NO_ID) {
                objEditName = "PedidoVenta";
              }
              else {
                id = getCell(rows.item(lRow), KIPR_RV_ID).getId();
                if(id !== NO_ID) {
                  objEditName = "RemitoVenta";
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

        elem = properties.add(null);
        elem.setType(Dialogs.PropertyType.button);
        elem.setName(getText(2523, "")); // Desaplicar todos
        elem.setKey(K_DESAPLIC_ITEMS);

        elem = properties.add(null, C_APLIC_PEDIDO_REMITO);
        elem.setType(Dialogs.PropertyType.grid);
        elem.hideLabel();        
        setGridAplicPedidoRemito(elem);
        elem.setKey(K_APLIC_PEDIDO_REMITO);
        elem.setName("PedidoRemito");
        elem.setGridEditEnabled(true);
        elem.setGridAddEnabled(false);
        elem.setGridRemoveEnabled(false);
        elem.setRowSelect(true);
        elem.setDontSelectInGotFocus(true);

        elem = properties.add(null, C_TOTAL_COBRANZA);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1909, "")); // Importe facturado
        elem.setEnabled(false);
        elem.setFormat(Cairo.Settings.getCurrencyRateDecimalsFormat());
        elem.setValue(m_total);
        elem.setKey(K_TOTAL_COBRANZA);
        elem.setTabIndex(1);

        elem = properties.add(null, C_PENDIENTE_COBRANZA);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName("Pendiente");
        elem.setEnabled(false);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(K_PENDIENTE_COBRANZA);
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

        elem = properties.add(null, C_APLIC_COBRANZA);
        elem.setType(Dialogs.PropertyType.grid);
        elem.hideLabel();
        setGridAplicCobranza(elem);
        elem.setKey(K_APLIC_COBRANZA);
        elem.setName("Cobranza");
        elem.hideLabel();
        elem.setGridEditEnabled(true);
        elem.setGridAddEnabled(false);
        elem.setGridRemoveEnabled(false);
        elem.setRowSelect(true);
        elem.setDontSelectInGotFocus(true);
        elem.setTabIndex(1);

        if(!m_dialog.show(self)) { return false; }

        showPendienteCobranza();

        return true;
      };

      var refreshCollection = function() {
        var properties = m_dialog.getProperties();

        var property = properties.item(C_ITEMS);
        loadItems(property);

        property = properties.item(C_APLIC_PEDIDO_REMITO);
        property.getGrid().getRows().clear();

        property = properties.item(C_TOTAL_COBRANZA); // OrdenPago
        property.setValue(m_total);

        property = properties.item(C_VENCIMIENTOS);
        loadVencimientos(property);

        property = properties.item(C_APLIC_COBRANZA);
        property.getGrid().getRows().clear();

        m_dialog.showValues(m_dialog.getProperties());

        showPendienteCobranza();
      };

      var saveDocVta = function(register) {
        var fields = register.getFields();
        fields.add(CV.FV_ID, m_fvId, Types.id);
        fields.add(C.DOC_ID, m_docId, Types.id);
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
        elem.setKey(KII_FVI_ID);

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
          elem.setId(valField(m_data.items[_i], CV.FVI_ID));
          elem.setKey(KII_FVI_ID);

          elem = row.add(null);
          elem.setId(valField(m_data.items[_i], C.PR_ID));
          elem.setValue(valField(m_data.items[_i], C.PR_NAME_VENTA));
          elem.setKey(KII_PR_ID);

          elem = row.add(null);
          elem.setValue(valField(m_data.items[_i], CV.FVI_PENDIENTE));
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

      var setGridAplicPedidoRemito = function(property) {
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
        elem.setKey(KIPR_RVFV_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIPR_PVFV_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIPR_RVI_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIPR_PVI_ID);

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

        m_vPedidoRemito = [];

        for(var _i = 0, count = m_data.itemsAplicados.length; _i < count; _i += 1) {

          var indexInfo = itemAddToCreditos(
            valField(m_data.items[_i], CV.RVI_ID), 
            valField(m_data.items[_i], CV.PVI_ID)
          );

          var item = m_vPedidoRemito[indexInfo.indexOrdenRemito];
          
          // document
          //
          item.docNombre = valField(m_data.itemsAplicados[_i], CV.DOC_NAME);
          item.nroDoc = valField(m_data.itemsAplicados[_i], C.NRO_DOC);
          item.fecha = valField(m_data.itemsAplicados[_i], C.FECHA);

          // pending
          //
          item.pendiente = valField(m_data.itemsAplicados[_i], C.PENDIENTE);
          item.pendienteActual = item.pendiente;

          // buying order / delivery notice
          //
          item.rvi_id = valField(m_data.itemsAplicados[_i], CV.RVI_ID);
          item.rv_id = valField(m_data.itemsAplicados[_i], CV.RV_ID);
          item.pvi_id = valField(m_data.itemsAplicados[_i], CV.PVI_ID);
          item.pv_id = valField(m_data.itemsAplicados[_i], CV.PV_ID);
          item.pr_id = valField(m_data.itemsAplicados[_i], CV.PR_ID);

          // applied
          //
          var aplicaciones = item.vAplicaciones[indexInfo.indexAplic];
          aplicaciones.rvfv_id = valField(m_data.itemsAplicados[_i], CV.RV_FV_ID);
          aplicaciones.pvfv_id = valField(m_data.itemsAplicados[_i], CV.PV_FV_ID);
          aplicaciones.fvi_id = valField(m_data.itemsAplicados[_i], CV.FVI_ID);
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
          m_vPedidoRemito.push({
            pr_id: valField(m_data.itemsParaAplicar[_i], C.PR_ID),
            rvi_id: valField(m_data.itemsParaAplicar[_i], CV.RVI_ID),
            rv_id: valField(m_data.itemsParaAplicar[_i], CV.RV_ID),
            pvi_id: valField(m_data.itemsParaAplicar[_i], CV.PVI_ID),
            pv_id: valField(m_data.itemsParaAplicar[_i], CV.PV_ID),
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

      var createPedidoRemitoItem = function() {
        return {
          pr_id: NO_ID,
          rvi_id: NO_ID,
          rv_id: NO_ID,
          pvi_id: NO_ID,
          pv_id: NO_ID,
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

      var itemAddToCreditos = function(rviId, pviId) {
        var index = -1;

        for(var i = 0, count = m_vPedidoRemito.length; i < count; i += 1) {
          if(   (m_vPedidoRemito[i].rvi_id === rviId && rviId !== NO_ID)
            || (m_vPedidoRemito[i].pvi_id === pviId && pviId !== NO_ID)) {

            index = i;
            break;
          }
        }

        if (index === -1){
          m_vPedidoRemito.push(createPedidoRemitoItem());
          index = m_vPedidoRemito.length -1;
        }

        m_vPedidoRemito[index].vAplicaciones.push(createPedidoRemitoItem());

        return {
          indexOrdenRemito: index,
          indexAplic: m_vPedidoRemito[index].vAplicaciones.length -1
        };
      };

      var createPedidoRemitoAplic = function() {
        return {
          rvfv_id: null,
          pvfv_id: null,
          fvi_id: null,
          aplicado: 0
        };
      };

      var itemUpdateGrids = function() {
        var aplicadoTotal = 0;

        if(m_lastRowItem !== -1) {
          var properties = m_dialog.getProperties();
          var row = properties.item(C_ITEMS).getGrid().getRows().item(m_lastRowItem);
          aplicadoTotal = itemUpdateAplicItems(
            properties.item(C_APLIC_PEDIDO_REMITO).getGrid(),
            getCell(row, KII_FVI_ID).getId()
          );
        }

        return aplicadoTotal;
      };

      var itemSetAplicItems = function(property, fviId, prId) {

        property.getGrid().getRows().clear();

        m_fviId = fviId;

        for(var i = 0, count = m_vPedidoRemito.length; i < count; i += 1) {

          if(m_vPedidoRemito[i].pr_id === prId) {

            if(m_vPedidoRemito[i].vAplicaciones.length > 0) {
              itemSetAplicItemsAux1(i, property, fviId);
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
        for(var i = 0, count = m_vPedidoRemito.length; i < count; i++) {

          var bAplic = false;

          if(m_vPedidoRemito[i].pr_id === prId) {

            var rows = property.getGrid().getRows();

            for(var _j = 0, _count = rows.size(); _j < _count; _j++) {
              var row = property.getGrid().getRows().item(_j);
              var id = getCell(row, KIPR_RVI_ID).getId();
              if(id === m_vPedidoRemito[i].rvi_id && id !== NO_ID) {
                bAplic = true;
                break;
              }

              id = getCell(row, KIPR_PVI_ID).getId();
              if(id === m_vPedidoRemito[i].pvi_id && id !== NO_ID) {
                bAplic = true;
                break;
              }

              id = m_fviId;
              for(var j = 0, count_j = m_vPedidoRemito[i].vAplicaciones.length; j < count_j; j += 1) {
                if(id === m_vPedidoRemito[i].vAplicaciones[j].fvi_id && id !== NO_ID) {
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

            m_vPedidoRemito[i].aplicado = itemAddToAplic(m_vPedidoRemito[i].vAplicaciones, aplicado, j);
            m_vPedidoRemito[i].pendiente = m_vPedidoRemito[i].pendienteActual
              - (m_vPedidoRemito[i].aplicado - m_vPedidoRemito[i].aplicadoActual);
          }
        }

        return aplicadoTotal;
      };

      var itemSetAplicItemsAux1 = function(idx, property, fviId) {
        var elem;
        var rows = property.getGrid().getRows();

        for(var i = 0, count = m_vPedidoRemito[idx].vAplicaciones.length; i < count; i += 1) {

          if(m_vPedidoRemito[idx].vAplicaciones[i].fvi_id === fviId && fviId !== NO_ID) {

            var row = rows.add(null);

            elem = row.add(null);
            elem.setId(idx);
            elem.setKey(KIPR_IDX1);

            elem = row.add(null);
            elem.setId(i);
            elem.setKey(KIPR_IDX2);

            elem = row.add(null);
            elem.setId(m_vPedidoRemito[idx].vAplicaciones[i].rvfv_id);
            elem.setKey(KIPR_RVFV_ID);

            elem = row.add(null);
            elem.setId(m_vPedidoRemito[idx].vAplicaciones[i].pvfv_id);
            elem.setKey(KIPR_PVFV_ID);

            elem = row.add(null);
            elem.setId(m_vPedidoRemito[idx].rvi_id);
            elem.setKey(KIPR_RVI_ID);

            elem = row.add(null);
            elem.setId(m_vPedidoRemito[idx].rv_id);
            elem.setKey(KIPR_RV_ID);

            elem = row.add(null);
            elem.setId(m_vPedidoRemito[idx].pvi_id);
            elem.setKey(KIPR_PVI_ID);

            elem = row.add(null);
            elem.setId(m_vOrdenRemito[idx].pv_id);
            elem.setKey(KIPR_PV_ID);

            elem = row.add(null);
            elem.setValue(m_vPedidoRemito[idx].docNombre);
            elem.setKey(KIPR_DOC);

            elem = row.add(null);
            elem.setValue(m_vPedidoRemito[idx].nroDoc);
            elem.setKey(KIPR_NRODOC);

            elem = row.add(null);
            if(m_vPedidoRemito[idx].fecha === Cairo.Constants.NO_DATE) {
              elem.setValue("");
            }
            else {
              elem.setValue(m_vPedidoRemito[idx].fecha);
            }
            elem.setKey(KIPR_FECHA);

            elem = row.add(null);
            elem.setValue(m_vPedidoRemito[idx].pendiente);
            elem.setKey(KIPR_PENDIENTE);

            elem = row.add(null);
            elem.setValue(m_vPedidoRemito[idx].vAplicaciones[i].aplicado);
            elem.setKey(KIPR_APLICADO);

            elem = row.add(null);
            elem.setValue(m_vPedidoRemito[idx].vAplicaciones[i].aplicado);
            elem.setKey(KIPR_APLICADO2);

            row.setBackColor("#HFFCC99");
          }
        }
      };

      var itemSetAplicItemsAux2 = function(i, property) {

        if(m_vPedidoRemito[i].pendiente <= 0) { return; }

        var elem;
        var row = property.getGrid().getRows().add(null);

        elem = row.add(null);
        elem.setId(i);
        elem.setKey(KIPR_IDX1);

        elem = row.add(null);
        elem.setId(0);
        elem.setKey(KIPR_IDX2);

        elem = row.add(null);
        elem.setId(NO_ID);
        elem.setKey(KIPR_RVFV_ID);

        elem = row.add(null);
        elem.setId(NO_ID);
        elem.setKey(KIPR_PVFV_ID);

        elem = row.add(null);
        elem.setId(m_vPedidoRemito[i].rvi_id);
        elem.setKey(KIPR_RVI_ID);

        elem = row.add(null);
        elem.setId(m_vPedidoRemito[i].pvi_id);
        elem.setKey(KIPR_PVI_ID);

        elem = row.add(null);
        elem.setValue(m_vPedidoRemito[i].docNombre);
        elem.setKey(KIPR_DOC);

        elem = row.add(null);
        elem.setValue(m_vPedidoRemito[i].nroDoc);
        elem.setKey(KIPR_NRODOC);

        elem = row.add(null);
        if(m_vPedidoRemito[i].fecha === Cairo.Constants.NO_DATE) {
          elem.setValue("");
        }
        else {
          elem.setValue(m_vPedidoRemito[i].fecha);
        }
        elem.setKey(KIPR_FECHA);

        elem = row.add(null);
        elem.setValue(m_vPedidoRemito[i].pendiente);
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
          G.redimPreserve(vAplicaciones, vAplicaciones.length + 1);
          idx = vAplicaciones.length;
          vAplicaciones.fvi_id = m_fviId;
        }

        vAplicaciones(idx).aplicado = importe;

        for(var i = 0, count = vAplicaciones.length; i < count; i += 1) {
          totalAplicado += vAplicaciones(i).aplicado;
        }

        return totalAplicado;
      };

      var getItemsPedidoRemitoProperty = function() {
        return m_dialog.getProperties().item(C_APLIC_PEDIDO_REMITO);
      };

      var getItemsPedidoRemito = function() {
        return m_dialog.getProperties().item(C_APLIC_PEDIDO_REMITO).getGrid();
      };

      var itemColBEditPedidoRemito = function(property, lRow, lCol) {
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

      var itemColAUpdatePedidoRemito = function(property, lRow, lCol) {
        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).getKey()) {
          case KIPR_APLICADO:
            var row = w_grid.getRows(lRow);

            var cell = getCell(row, KIPR_APLICADO);

            var pendiente = val(itemGetItemPendiente().getValue()) + cellFloat(row, KIPR_APLICADO2);
            var maxVal = cellFloat(row, KIPR_PENDIENTE) + cellFloat(row, KIPR_APLICADO2);

            if(maxVal > pendiente) {
              maxVal = pendiente;
            }

            if(val(cell.getValue()) > maxVal) {
              cell.setValue(maxVal);
            }
            else if(val(cell.getValue()) < 0) {
              cell.setValue(0);
            }

            var aplicado = itemGetAplicado();
            itemRefreshItem(aplicado);
            itemGetItemAplicado().setValue(aplicado);

            // update pending credit
            //
            cell = getCell(row, KIPR_PENDIENTE);
            cell.setValue(val(cell.getValue()) + cellFloat(row, KIPR_APLICADO2) - cellFloat(row, KIPR_APLICADO));
            getCell(row, KIPR_APLICADO2).setValue(getCell(row, KIPR_APLICADO).getValue());
            break;
        }
      };

      var itemGetAplicado = function() {
        var aplicado = 0;
        var rows = m_dialog.getProperties().item(C_APLIC_PEDIDO_REMITO).getGrid().getRows();
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

      var itemSavePedidoRemito = function(mainRegister) {
        itemSavePedido(mainRegister);
        itemSaveRemito(mainRegister);
      };

      var itemSavePedido = function(mainRegister) {
        var transaction = DB.createTransaction();

        transaction.setTable(CV.PEDIDO_FACTURA_VENTA_TMP);

        for(var i = 0, count = m_vPedidoRemito.length; i < count; i += 1) {

          if(m_vPedidoRemito[i].pvi_id !== NO_ID) {

            for(var j = 0, count_j = m_vPedidoRemito[i].vAplicaciones.length; j < count_j; j += 1) {            

              if(m_vPedidoRemito[i].vAplicaciones(j).fvi_id !== NO_ID) {

                if(m_vPedidoRemito[i].vAplicaciones[j].aplicado > 0) {

                  var register = new DB.Register();
                  register.setFieldId(CV.PV_FV_TMP_ID);
                  register.setId(Cairo.Constants.NEW_ID);

                  var fields = register.getFields();

                  fields.add(CV.PVI_ID, m_vPedidoRemito[i].pvi_id, Types.id);
                  fields.add(CV.FVI_ID, m_vPedidoRemito[i].vAplicaciones[j].fvi_id, Types.id);
                  fields.add(CV.PV_FV_CANTIDAD, m_vPedidoRemito[i].vAplicaciones[j].aplicado, Types.double);
                  fields.add(CV.PV_FV_ID, m_vPedidoRemito[i].vAplicaciones[j].pvfv_id, Types.long);

                  transaction.addRegister(register);
                }
              }
            }
          }
        }

        mainRegister.addTransaction(transaction);
      };

      var itemSaveRemito = function(mainRegister) {
        var transaction = DB.createTransaction();

        transaction.setTable(CV.REMITO_FACTURA_VENTA_TMP);

        for(var i = 0, count = m_vPedidoRemito.length; i < count; i += 1) {

          if(m_vPedidoRemito[i].rvi_id !== NO_ID) {

            for(var j = 0, count_j = m_vPedidoRemito[i].vAplicaciones.length; j < count_j; j += 1) {

              if(m_vPedidoRemito[i].vAplicaciones[j].fvi_id !== NO_ID) {

                if(m_vPedidoRemito[i].vAplicaciones[j].aplicado > 0) {

                  var register = new DB.Register();
                  register.setFieldId(CV.RV_FV_TMP_ID);
                  register.setId(Cairo.Constants.NEW_ID);

                  var fields = register.getFields();

                  fields.add(CV.RVI_ID, m_vPedidoRemito[i].rvi_id, Types.id);
                  fields.add(CV.FVI_ID, m_vPedidoRemito[i].vAplicaciones[j].fvi_id, Types.id);
                  fields.add(CV.RV_FV_CANTIDAD, m_vPedidoRemito[i].vAplicaciones[j].aplicado, Types.double);
                  fields.add(CV.RV_FV_ID, m_vPedidoRemito[i].vAplicaciones[j].rvfv_id, Types.long);

                  transaction.addRegister(register);
                }
              }
            }
          }
        }

        mainRegister.addTransaction(transaction);
      };

      var cobranzaLoadAplicVtos = function() {
        cobranzaLoadAplicAplicados();
        cobranzaLoadAplicCreditos();
      };

      var cobranzaLoadAplicAplicados = function() {

        m_vCobzNC = [];

        for(var _i = 0, count = m_data.pagosAplicados.length; _i < count; _i += 1) {

          var indexInfo = cobranzaAddToCreditos(
            valField(m_data.cobrosAplicados[_i], CT.COBZ_ID),
            valField(m_data.cobrosAplicados[_i], CT.FVD_ID),
            valField(m_data.cobrosAplicados[_i], CT.FVP_ID)
          );

          var item = m_vCobzNC[indexInfo.indexPago];

          // document
          //
          item.docName = valField(m_data.cobrosAplicados[_i], C.DOC_NAME);
          item.nroDoc = valField(m_data.cobrosAplicados[_i], C.NRO_DOC);

          // pending
          //
          item.pendiente = valField(m_data.cobrosAplicados[_i], C.PENDIENTE);
          item.pendienteActual = item.pendiente;

          // invoice or credit note
          //
          item.fv_id = valField(m_data.cobrosAplicados[_i], CV.FV_ID);
          item.fvp_id = valField(m_data.cobrosAplicados[_i], CT.FVP_ID2);
          item.fvd_id = valField(m_data.cobrosAplicados[_i], CT.FVD_ID2);

          // payments
          //
          item.cobz_id = valField(m_data.cobrosAplicados[_i], CT.COBZ_ID);
          item.fecha = valField(m_data.cobrosAplicados[_i], CT.COBZ_FECHA);
          item.cotizacion = valField(m_data.cobrosAplicados[_i], CT.FV_COBZ_COTIZACION);

          // payments
          //
          var aplicaciones = item.vAplicaciones[indexInfo.indexAplic];
          aplicaciones.fvcobz_id = valField(m_data.cobrosAplicados[_i], CT.FV_COBZ_ID);
          aplicaciones.fvnc_id = valField(m_data.cobrosAplicados[_i], CT.FV_NC_ID);
          aplicaciones.fvp_id = valField(m_data.cobrosAplicados[_i], CT.FVP_ID);
          aplicaciones.fvd_id = valField(m_data.cobrosAplicados[_i], CT.FVD_ID);
          aplicaciones.aplicado = valField(m_data.cobrosAplicados[_i], C.APLICADO);

          // total applied to this credit
          //
          item.aplicado = item.aplicado + item.vAplicaciones[indexInfo.indexAplic].aplicado;
          item.aplicadoActual = item.aplicado;
        }
      };

      var loadVencimientos = function(property) { // TODO: Use of ByRef founded Private Function loadVencimientos(ByRef property As cIABMProperty) As Boolean
        var sqlstmt = null;
        var rs = null;
        var grid = null;
        var row = null;
        var value = null;

        sqlstmt = "sp_DocFacturaVentaGetAplic "+ Cairo.Company.getId().toString()+ ","+ m_fvId+ ",1";
        if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadAplic", C_MODULE)) { return false; }

        property.getGrid().getColumns().clear();
        property.getGrid().getRows().clear();

        grid = property.getGrid();

        var w_columns = grid.getColumns();
        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIV_FVD_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIV_FVP_ID);

        elem = columns.add(null);
        // Fecha
        elem.setName(getText(1569, ""));
        elem.setType(Dialogs.PropertyType.date);
                elem.setKey(KIV_FECHA);

        elem = columns.add(null);
        // Pendiente
        elem.setName(getText(1609, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
                elem.setKey(KIV_PENDIENTE);

        elem = columns.add(null);
        // Aplicado
        elem.setName(getText(1608, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
                elem.setKey(KIV_APLICADO);

        elem = columns.add(null);
        elem.setType(Dialogs.PropertyType.text);
        elem.setVisible(false);
        elem.setKey(KIV_APLICADO2);

        var f = null;
        var fv = null;

        while (!rs.isEOF()) {

          elem = row.add(null);D.Status.pendientenull);

          elem = row.add(null);
          elem.setId(valField(m_data.items[_i], CT.FVD_ID));
          elem.setKey(KIV_FVD_ID);

          elem = row.add(null);
          elem.setId(valField(m_data.items[_i], CT.FVP_ID));
          elem.setKey(KIV_FVP_ID);

          elem = row.add(null);
          elem.setValue(valField(m_data.items[_i], CSCFECHA));
          elem.setKey(KIV_FECHA);

          elem = row.add(null);
          elem.setValue(valField(m_data.items[_i], CSCPENDIENTE));
          elem.setKey(KIV_PENDIENTE);

          value = valField(m_data.items[_i], CSCIMPORTE);
          elem = row.add(null);
          elem.setValue(value);
          elem.setKey(KIV_APLICADO);

          if(value !== 0) {
            row = f;
            row.setBackColor(&HFFCC99);
          }

          elem = row.add(null);
          elem.setValue(valField(m_data.items[_i], CSCIMPORTE));
          elem.setKey(KIV_APLICADO2);

          rs.MoveNext;
        }

        return true;
      };

      var cobranzaLoadAplicCreditos = function() {
        var sqlstmt = null;
        var rs = null;
        var i = null;

        sqlstmt = "sp_DocFacturaVentaGetAplic "+ Cairo.Company.getId().toString()+ ","+ m_fvId+ ",3";
        if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadAplicCreditos", C_MODULE)) { return false; }

        if(!rs.isEOF()) {

          rs.MoveLast;
          rs.MoveFirst;

          i = m_vCobzNC.length;
          G.redimPreserve(m_vCobzNC, i + rs.RecordCount);

          while (!rs.isEOF()) {

            i = i + 1;
            m_vCobzNC[i].cobz_id = valField(m_data.items[_i], CT.COBZ_ID);
            m_vCobzNC[i].fv_id = valField(m_data.items[_i], CV.FV_ID);
            m_vCobzNC[i].fvd_id = valField(m_data.items[_i], CT.FVD_ID);

            m_vCobzNC[i].docNombre = valField(m_data.items[_i], CV.DOC_NAME);
            m_vCobzNC[i].nroDoc = valField(m_data.items[_i], CSCNRO_DOC);

            m_vCobzNC[i].fecha = valField(m_data.items[_i], CSCFECHA);
            m_vCobzNC[i].pendiente = valField(m_data.items[_i], CSCPENDIENTE);
            m_vCobzNC[i].pendienteActual = m_vCobzNC[i].pendiente;

            G.redim(m_vCobzNC[i].vAplicaciones, 0);

            rs.MoveNext;
          }
        }

        return true;
      };

      var setGridAplicCobranza = function(property) { // TODO: Use of ByRef founded Private Function setGridAplicCobranza(ByRef property As cIABMProperty) As Boolean
        var grid = null;

        property.getGrid().getColumns().clear();
        property.getGrid().getRows().clear();

        grid = property.getGrid();

        var w_columns = grid.getColumns();
        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_IDX1);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_IDX2);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_FVCOBZ_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_FVNC_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_COBZ_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_FV_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_FVD_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_FVP_ID);

        elem = columns.add(null);
        // Documento
        elem.setName(getText(1567, ""));
        elem.setType(Dialogs.PropertyType.text);
                elem.setKey(KIC_DOC);

        elem = columns.add(null);
        // Comprobante
        elem.setName(getText(1610, ""));
        elem.setType(Dialogs.PropertyType.text);
                elem.setKey(KIC_NRODOC);

        elem = columns.add(null);
        // Fecha"
        elem.setName(getText(1569, ""));
        elem.setType(Dialogs.PropertyType.date);
                elem.setKey(KIC_FECHA);

        elem = columns.add(null);
        // Pendiente
        elem.setName(getText(1609, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
                elem.setKey(KIC_PENDIENTE);

        elem = columns.add(null);
        // Aplicado
        elem.setName(getText(1608, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
                elem.setKey(KIC_APLICADO);

        elem = columns.add(null);
        // Cotiz.
        elem.setName(getText(1650, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(m_generalConfig.getFormatDecCotizacion());
                elem.setKey(KIC_COTIZACION);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_APLICADO2);

        return true;
      };

      var pCobAddToCreditos = function(cobzId, fvdId, fvpId, idx) { // TODO: Use of ByRef founded Private Function pCobAddToCreditos(ByVal CobzId As Long, ByVal FvdId As Long, ByVal FvpId As Long, ByRef Idx As Long) As Long
        var _rtn = 0;
        var i = null;

        for(i = 1; i <= m_vCobzNC.length; i++) {
          if((m_vCobzNC[i].cobz_id === cobzId && cobzId !== NO_ID) || (m_vCobzNC[i].fvd_id === fvdId && fvdId !== NO_ID) || (m_vCobzNC[i].fvp_id === fvpId && fvpId !== NO_ID)) {

            G.redimPreserve(m_vCobzNC[i].vAplicaciones, m_vCobzNC[i].vAplicaciones.length + 1);

            idx = m_vCobzNC[i].vAplicaciones.length;
            _rtn = i;
            return _rtn;
          }
        }

        G.redimPreserve(m_vCobzNC, m_vCobzNC.length + 1);
        G.redimPreserve(m_vCobzNC.length, .vAplicaciones);
        _rtn = m_vCobzNC.length;
        idx = 1;

        return _rtn;
      };

      var cobranzaSetAplicVtos = function(iProp, fvd_id, fvp_id) { // TODO: Use of ByRef founded Private Function cobranzaSetAplicVtos(ByRef iProp As cIABMProperty, ByVal fvd_id As Long, ByVal fvp_id As Long) As Boolean
        var cotizacion = null;
        var i = null;
        var j = null;

        iProp.getGrid().getRows().clear();

        m_fvdId = fvd_id;
        m_fvpId = fvp_id;

        for(i = 1; i <= m_vCobzNC.length; i++) {

          if(m_vCobzNC[i].vAplicaciones.length > 0) {
            cobranzaSetAplicVtosAux1(i, iProp, fvd_id, fvp_id);
          }
          else {
            cobranzaSetAplicVtosAux2(i, iProp);
          }

        }

        // Ahora los creditos que tienen aplicaciones
        // pero no estan con este vencimiento y tienen pendiente
        var id = null;
        var bAplic = null;
        var row = null;

        for(i = 1; i <= m_vCobzNC.length; i++) {

          bAplic = false;

          var _count = iProp.getGrid().getRows().size();
          for(var _j = 0; _j < _count; _j++) {
            row = iProp.getGrid().getRows().item(_j);
            id = getCell(row, KIC_COBZ_ID).getId();
            if(id === m_vCobzNC[i].cobz_id && id !== NO_ID) {
              bAplic = true;
              break;
            }

            id = getCell(row, KIC_FVD_ID).getId();
            if(id === m_vCobzNC[i].fvd_id && id !== NO_ID) {
              bAplic = true;
              break;
            }

            id = getCell(row, KIC_FVP_ID).getId();
            if(id === m_vCobzNC[i].fvp_id && id !== NO_ID) {
              bAplic = true;
              break;
            }

            for(j = 1; j <= m_vCobzNC[i].vAplicaciones.length; j++) {

              id = getCell(row, KIC_FVD_ID).getId();
              if(id === m_vCobzNC[i].vAplicaciones(j).fvd_id && id !== NO_ID) {
                bAplic = true;
                break;
              }

              id = getCell(row, KIC_FVP_ID).getId();
              if(id === m_vCobzNC[i].vAplicaciones(j).fvp_id && id !== NO_ID) {
                bAplic = true;
                break;
              }
            }

            if(bAplic) { break; }
          }

          if(!bAplic) { cobranzaSetAplicVtosAux2(i, iProp); }

        }

        return true;
      };

      var cobranzaSetAplicVtosAux1 = function(idx, iProp, fvd_id, fvp_id) { // TODO: Use of ByRef founded Private Sub cobranzaSetAplicVtosAux1(ByVal Idx As Long, ByRef iProp As cIABMProperty, ByVal fvd_id As Long, ByVal fvp_id As Long)

        var f = null;
        var fv = null;
        var i = null;
        var iPropVto = null;
        var row = null;

        for(i = 1; i <= m_vCobzNC[idx].vAplicaciones.length; i++) {

          if((m_vCobzNC[idx].vAplicaciones[i].fvd_id === fvd_id && fvd_id !== NO_ID) || (m_vCobzNC[idx].vAplicaciones[i].fvp_id === fvp_id && fvp_id !== NO_ID)) {

            f = iProp.getGrid().getRows().add(null);

            elem = row.add(null);
            elem.setId(idx);
            elem.setKey(KIC_IDX1);

            elem = row.add(null);
            elem.setId(i);
            elem.setKey(KIC_IDX2);

            elem = row.add(null);
            elem.setId(m_vCobzNC[idx].vAplicaciones[i].fvcobz_id);
            elem.setKey(KIC_FVCOBZ_ID);

            elem = row.add(null);
            elem.setId(m_vCobzNC[idx].vAplicaciones[i].fvnc_id);
            elem.setKey(KIC_FVNC_ID);

            elem = row.add(null);
            elem.setId(m_vCobzNC[idx].cobz_id);
            elem.setKey(KIC_COBZ_ID);

            elem = row.add(null);
            elem.setId(m_vCobzNC[idx].fv_id);
            elem.setKey(KIC_FV_ID);

            elem = row.add(null);
            elem.setId(m_vCobzNC[idx].vAplicaciones[i].fvd_id);
            elem.setKey(KIC_FVD_ID);

            elem = row.add(null);
            elem.setId(m_vCobzNC[idx].vAplicaciones[i].fvp_id);
            elem.setKey(KIC_FVP_ID);

            elem = row.add(null);
            elem.setValue(m_vCobzNC[idx].docNombre);
            elem.setKey(KIC_DOC);

            elem = row.add(null);
            elem.setValue(m_vCobzNC[idx].nroDoc);
            elem.setKey(KIC_NRODOC);

            elem = row.add(null);
            if(m_vCobzNC[idx].fecha === Cairo.Constants.NO_DATE) {
              elem.setValue("");
            }
            else {
              elem.setValue(m_vCobzNC[idx].fecha);
            }
            elem.setKey(KIC_FECHA);

            elem = row.add(null);
            elem.setValue(m_vCobzNC[idx].pendiente);
            elem.setKey(KIC_PENDIENTE);

            elem = row.add(null);
            elem.setValue(m_vCobzNC[idx].vAplicaciones[i].aplicado);
            elem.setKey(KIC_APLICADO);

            elem = row.add(null);
            if(m_vCobzNC[idx].cotizacion !== 0) {
              elem.setValue(m_vCobzNC[idx].cotizacion);
            }
            elem.setKey(KIC_COTIZACION);

            elem = row.add(null);
            elem.setValue(m_vCobzNC[idx].vAplicaciones[i].aplicado);
            elem.setKey(KIC_APLICADO2);

            row = f;
            row.setBackColor(&HFFCC99);
          }
        }
      };

      var cobranzaSetAplicVtosAux2 = function(i, iProp) { // TODO: Use of ByRef founded Private Sub cobranzaSetAplicVtosAux2(ByVal i As Long, ByRef iProp As cIABMProperty)
        var f = null;
        var fv = null;

        if(m_vCobzNC[i].pendiente <= 0) { return; }

        f = iProp.getGrid().getRows().add(null);

        elem = row.add(null);
        elem.setId(i);
        elem.setKey(KIC_IDX1);

        elem = row.add(null);
        elem.setId(0);
        elem.setKey(KIC_IDX2);

        elem = row.add(null);
        elem.setId(NO_ID);
        elem.setKey(KIC_FVCOBZ_ID);

        elem = row.add(null);
        elem.setId(NO_ID);
        elem.setKey(KIC_FVNC_ID);

        elem = row.add(null);
        elem.setId(m_vCobzNC[i].cobz_id);
        elem.setKey(KIC_COBZ_ID);

        elem = row.add(null);
        elem.setId(m_vCobzNC[i].fv_id);
        elem.setKey(KIC_FV_ID);

        elem = row.add(null);
        elem.setId(m_vCobzNC[i].fvd_id);
        elem.setKey(KIC_FVD_ID);

        elem = row.add(null);
        elem.setId(NO_ID);
        elem.setKey(KIC_FVP_ID);

        elem = row.add(null);
        elem.setValue(m_vCobzNC[i].docNombre);
        elem.setKey(KIC_DOC);

        elem = row.add(null);
        elem.setValue(m_vCobzNC[i].nroDoc);
        elem.setKey(KIC_NRODOC);

        elem = row.add(null);
        if(m_vCobzNC[i].fecha === Cairo.Constants.NO_DATE) {
          elem.setValue("");
        }
        else {
          elem.setValue(m_vCobzNC[i].fecha);
        }
        elem.setKey(KIC_FECHA);

        elem = row.add(null);
        elem.setValue(m_vCobzNC[i].pendiente);
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

      var cobranzaUpdateteAplicVtos = function(property, fvd_id, fvp_id) { // TODO: Use of ByRef founded Private Function cobranzaUpdateteAplicVtos(ByRef property As cIABMProperty, ByVal fvd_id As Long, ByVal fvp_id As Long) As Double
        var cotizacion = null;
        var i = null;
        var j = null;
        var row = null;
        var aplicado = null;
        var aplicadoTotal = null;

        var _count = cobranzaGetItemsCobranza().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = cobranzaGetItemsCobranza().getRows().item(_i);

          if(val(getCell(row, KIC_APLICADO).getValue()) > 0 || getCell(row, KIC_IDX2).getId() !== 0) {

            i = getCell(row, KIC_IDX1).getId();
            j = getCell(row, KIC_IDX2).getId();

            aplicado = val(getCell(row, KIC_APLICADO).getValue());
            aplicadoTotal = aplicadoTotal + aplicado;

            m_vCobzNC[i].aplicado = pCobAddToAplic(m_vCobzNC[i].vAplicaciones, aplicado, j);
            m_vCobzNC[i].pendiente = m_vCobzNC[i].pendienteActual - (m_vCobzNC[i].aplicado - m_vCobzNC[i].aplicadoActual);
          }
        }

        return aplicadoTotal;
      };

      var pCobAddToAplic = function(vAplicaciones, importe, idx) { // TODO: Use of ByRef founded Private Function pCobAddToAplic(ByRef vAplicaciones() As T_CobAplic, ByVal Importe As Double, ByVal Idx As Long) As Double
        var i = null;
        var rtn = null;

        if(idx === 0) {
          G.redimPreserve(vAplicaciones, vAplicaciones.length + 1);
          idx = vAplicaciones.length;
          vAplicaciones.fvd_id = m_fvdId;
          vAplicaciones.fvp_id = m_fvpId;
        }

        vAplicaciones(idx).aplicado = importe;

        for(i = 1; i <= vAplicaciones.length; i++) {
          rtn = rtn + vAplicaciones(i).aplicado;
        }

        return rtn;
      };

      var cobranzaGetVtoPendiente = function() {
        var iProp = null;
        iProp = m_dialog.getProperties().item(C_VENCIMIENTOS);
        return getCell(iProp.getGrid().getRows().item(iProp.getSelectedIndex()), KIV_PENDIENTE);
      };

      var cobranzaGetVtoAplicado = function() {
        var iProp = null;
        iProp = m_dialog.getProperties().item(C_VENCIMIENTOS);
        return getCell(iProp.getGrid().getRows().item(iProp.getSelectedIndex()), KIV_APLICADO2);
      };

      var cobranzaColAUpdateCobranza = function(property, lRow, lCol) { // TODO: Use of ByRef founded Private Function cobranzaColAUpdateCobranza(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long)
        var row = null;
        var maxVal = null;
        var bVisible = null;
        var pendiente = null;

        var w_grid = property.getGrid();
        switch (w_grid.getColumns(lCol).Key) {
          case KIC_APLICADO:
            row = w_grid.getRows(lRow);

            var cell = getCell(row, KIC_APLICADO);

            pendiente = val(cobranzaGetVtoPendiente().getValue()) + val(getCell(row, KIC_APLICADO2).getValue());
            maxVal = val(getCell(row, KIC_PENDIENTE).getValue()) + val(getCell(row, KIC_APLICADO2).getValue());

            if(maxVal > pendiente) {
              maxVal = pendiente;
            }

            if(val(cell.getValue()) > maxVal) {
              cell.setValue(maxVal);
            }
            else if(val(cell.getValue()) < 0) {
              cell.setValue(0);
            }

            var aplicado = null;
            aplicado = cobranzaGetAplicado();
            cobranzaRefreshVto(aplicado);
            cobranzaGetVtoAplicado().setValue(aplicado);

            // Actulizo el pendiente
            var cell = getCell(row, KIC_PENDIENTE);
            cell.setValue(val(cell.getValue()) + val(getCell(row, KIC_APLICADO2).getValue()) - val(getCell(row, KIC_APLICADO).getValue()));
            getCell(row, KIC_APLICADO2).getValue() === getCell(row, KIC_APLICADO).getValue();

            showPendienteCobranza();
            break;
        }

        return true;
      };

      var cobranzaGetAplicado = function() {
        var row = null;
        var rtn = null;

        var _count = cobranzaGetItemsCobranzaProperty().getGrid().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = cobranzaGetItemsCobranzaProperty().getGrid().getRows().item(_i);
          rtn = rtn + val(getCell(row, KIC_APLICADO).getValue());
        }
        return rtn;
      };

      var cobranzaRefreshVto = function(aplicado) {
        var iProp = null;
        var abmObj = null;
        var row = null;
        var aplicadoActual = null;

        abmObj = m_dialog;
        iProp = m_dialog.getProperties().item(C_VENCIMIENTOS);
        row = iProp.getGrid().getRows().item(m_lastRowVto);

        getCell(row, KIV_APLICADO).getValue() === aplicado;
        aplicadoActual = val(getCell(row, KIV_APLICADO2).getValue());

        var cell = getCell(row, KIV_PENDIENTE);
        cell.setValue(cell.getValue() - (aplicado - aplicadoActual));

        getCell(row, KIV_APLICADO2).getValue() === aplicado;

        abmObj.ShowCellValue(iProp, m_lastRowVto, D.getCol(iProp.getGrid().getColumns(), KIV_PENDIENTE));
        abmObj.ShowCellValue(iProp, m_lastRowVto, D.getCol(iProp.getGrid().getColumns(), KIV_APLICADO));
      };

      var cobranzaGetItemsCobranzaProperty = function() {
        return m_dialog.getProperties().item(C_APLIC_COBRANZA);
      };

      var cobranzaGetItemsCobranza = function() {
        return m_dialog.getProperties().item(C_APLIC_COBRANZA).getGrid();
      };

      var cobranzaGetItemsVtosProperty = function() {
        return m_dialog.getProperties().item(C_VENCIMIENTOS);
      };

      var cobranzaColBEditCobranza = function(property, lRow, lCol, iKeyAscii) { // TODO: Use of ByRef founded Private Function cobranzaColBEditCobranza(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long, ByVal iKeyAscii As Integer)
        switch (cABMUtil.pGetKeyFromCol(property.getGrid().getColumns(), lCol)) {
          // Facturas
          case KIC_APLICADO:
            break;

          case KIC_COTIZACION:
            if(getCell(property.getGrid().getRows(lRow), KIC_COTIZACION).getValue() === "") {
              return null;
            }
            break;

          default:
            return null;
            break;
        }

        return true;
      };

      var showPendienteCobranza = function() {
        var row = null;
        var total = null;

        var _count = cobranzaGetItemsVtosProperty().getGrid().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = cobranzaGetItemsVtosProperty().getGrid().getRows().item(_i);
          total = total + val(getCell(row, KIV_PENDIENTE).getValue());
        }

        cobranzaGetPendienteCobranza().setValue(total);

        m_dialog.showValue(cobranzaGetPendienteCobranza());
      };

      var cobranzaGetPendienteCobranza = function() {
        return m_dialog.getProperties().item(C_PENDIENTE_COBRANZA);
      };

      var cobranzaUpdateteGrids = function() {
        var _rtn = 0;
        var iProp = null;
        var row = null;

        iProp = m_dialog.getProperties().item(C_VENCIMIENTOS);

        if(m_lastRowVto !== 0) {

          row = iProp.getGrid().getRows().item(m_lastRowVto);
          _rtn = cobranzaUpdateteAplicVtos(cobranzaGetItemsCobranzaProperty(), getCell(row, KIV_FVD_ID).getId(), getCell(row, KIV_FVP_ID).getId());
        }

        return _rtn;
      };

      //////////////////////////////////////////////////////////////////////////////////////
      // Nota de credito
      //////////////////////////////////////////////////////////////////////////////////////

      // Proposito: Vincular una/s nota de credito con una/s factura
      //
      var cobranzaSaveNotaCredito = function(fvTMPId) {
        var register = null;
        var row = null;
        var cell = null;
        var i = null;
        var j = null;

        for(i = 1; i <= m_vCobzNC.length; i++) {

          if(m_vCobzNC[i].fv_id !== NO_ID) {

            for(j = 1; j <= m_vCobzNC[i].vAplicaciones.length; j++) {

              if(m_vCobzNC[i].vAplicaciones[j].aplicado > 0 || m_vCobzNC[i].vAplicaciones[j].fvnc_id) {

                var register = new DB.Register();
                register.setFieldId(CSCFV_NC_TMPID);
                register.setTable(CSTFACTURAVENTANOTACREDITOTMP);
                register.setId(Cairo.Constants.NEW_ID);

                fields.add(CV.FV_TMPID, fvTMPId, Types.id);

                if(m_isNotaCredito) {
                  fields.add(CSCFV_ID_NOTA_CREDITO, m_fvId, Types.id);
                  fields.add(CSCFV_ID_FACTURA, m_vCobzNC[i].fv_id, Types.id);

                  fields.add(CT.FVD_ID_NOTA_CREDITO, m_vCobzNC[i].vAplicaciones[j].fvd_id, Types.id);
                  fields.add(CT.FVD_ID_FACTURA, m_vCobzNC[i].fvd_id, Types.id);

                  fields.add(CT.FVP_ID_NOTA_CREDITO, m_vCobzNC[i].vAplicaciones[j].fvp_id, Types.id);
                  fields.add(CT.FVP_ID_FACTURA, m_vCobzNC[i].fvp_id, Types.id);
                }
                else {
                  fields.add(CSCFV_ID_NOTA_CREDITO, m_vCobzNC[i].fv_id, Types.id);
                  fields.add(CSCFV_ID_FACTURA, m_fvId, Types.id);

                  fields.add(CT.FVD_ID_NOTA_CREDITO, m_vCobzNC[i].fvd_id, Types.id);
                  fields.add(CT.FVD_ID_FACTURA, m_vCobzNC[i].vAplicaciones[j].fvd_id, Types.id);

                  fields.add(CT.FVP_ID_NOTA_CREDITO, m_vCobzNC[i].fvp_id, Types.id);
                  fields.add(CT.FVP_ID_FACTURA, m_vCobzNC[i].vAplicaciones[j].fvp_id, Types.id);
                }

                fields.add(CSCFV_NC_IMPORTE, m_vCobzNC[i].vAplicaciones[j].aplicado, Types.double);
                fields.add(CSCFV_NC_ID, 0, Types.long);

                register.getFields().setHaveLastUpdate(false);
                register.getFields().setHaveWhoModify(false);

                if(!Cairo.Database.save(register, , "pSaveFVNCAux", C_MODULE, c_ErrorSave)) { return false; }
              }
            }
          }
        }

        return true;
      };

      //////////////////////////////////////////////////////////////////////////////////////
      // Cobranza
      //////////////////////////////////////////////////////////////////////////////////////

      // Guardo cada una de las cobranzas modificadas
      // por la edicion de esta aplicacion
      var cobranzaSaveCobranza = function(fvTMPId) {
        var vCobranzas() = null;
        var i = null;

        pGetCobranzas(vCobranzas[]);

        for(i = 1; i <= vCobranzas.length; i++) {
          if(!cobranzaSaveCobranzaAux(vCobranzas[i].cobz_id, fvTMPId, vCobranzas[i].newAplic)) { return false; }
        }

        return true;
      };

      var pGetCobranzas = function(vCobranzas) { // TODO: Use of ByRef founded Private Sub pGetCobranzas(ByRef vCobranzas() As T_Cobranza)
        var row = null;
        var i = null;
        var k = null;

        G.redim(vCobranzas, 0);

        for(i = 1; i <= m_vCobzNC.length; i++) {
          if(m_vCobzNC[i].cobz_id !== NO_ID) {

            if(m_vCobzNC[i].aplicado > 0 || m_vCobzNC[i].aplicadoActual !== 0) {

              k = pgetIdxCobranzas(vCobranzas, m_vCobzNC[i].cobz_id);
              vCobranzas.cobz_id = m_vCobzNC[i].cobz_id;
              vCobranzas.NewAplic = m_vCobzNC[i].aplicado;
              vCobranzas.CurrAplic = m_vCobzNC[i].aplicadoActual;
            }
          }
        }
      };

      var pgetIdxCobranzas = function(vCobranzas, cobzId) { // TODO: Use of ByRef founded Private Function pgetIdxCobranzas(ByRef vCobranzas() As T_Cobranza, ByVal CobzId As Long) As Long
        var _rtn = 0;
        var bFound = null;
        var i = null;

        for(i = 1; i <= vCobranzas.length; i++) {
          if(vCobranzas(i).cobz_id === cobzId) {
            _rtn = i;
            return _rtn;
          }
        }

        if(!bFound) {
          G.redimPreserve(vCobranzas, vCobranzas.length + 1);
        }

        _rtn = vCobranzas.length;

        return _rtn;
      };

      var cobranzaSaveCobranzaAux = function(cobzId, fvTMPId, aplic) {
        var register = null;

        var register = new DB.Register();
        register.setFieldId(CT.COBZ_TMP_ID);
        register.setTable(CT.COBRANZA_TMP);

        register.setId(Cairo.Constants.NEW_ID);

        fields.add(CV.FV_TMPID, fvTMPId, Types.id);
        fields.add(CT.COBZ_NUMERO, 0, Types.long);
        fields.add(CV.CLI_ID, NO_ID, Types.long);
        fields.add(CV.SUC_ID, NO_ID, Types.long);
        fields.add(CV.DOC_ID, NO_ID, Types.long);
        fields.add(C.EST_ID, NO_ID, Types.long);
        fields.add(CT.COBZ_ID, cobzId, Types.id);

        register.getFields().setHaveLastUpdate(true);
        register.getFields().setHaveWhoModify(true);

        if(!register.beginTrans(Cairo.Database)) { return false; }

        if(!Cairo.Database.save(register, , "pSave", C_MODULE, c_ErrorSave)) { return false; }

        if(!pSaveItems(register.getId(), cobzId)) { return false; }
        if(!pSaveCtaCte(register.getId(), cobzId, aplic)) { return false; }

        if(!register.commitTrans()) { return false; }

        return true;
      };

      var pSaveItems = function(id, cobzId) {
        var transaction = new Cairo.Database.Transaction();
        var i = null;
        var j = null;

        for(i = 1; i <= m_vCobzNC.length; i++) {

          if(m_vCobzNC[i].cobz_id === cobzId) {

            for(j = 1; j <= m_vCobzNC[i].vAplicaciones.length; j++) {

              if(m_vCobzNC[i].vAplicaciones[j].aplicado > 0 || m_vCobzNC[i].vAplicaciones[j].fvcobz_id) {

                var register = new Cairo.Database.Register();
                register.setFieldId(CT.FV_COBZ_TMP_ID);
                register.setTable(FACTURA_VENTA_COBRANZA_TMP);
                register.setId(Cairo.Constants.NEW_ID);

                fields.add(CT.COBZ_ID, m_vCobzNC[i].cobz_id, Types.long);
                fields.add(CT.COBZ_TMP_ID, id, Types.id);

                fields.add(CV.FV_ID, m_fvId, Types.id);
                fields.add(CT.FVD_ID, m_vCobzNC[i].vAplicaciones[j].fvd_id, Types.id);
                fields.add(CT.FVP_ID, m_vCobzNC[i].vAplicaciones[j].fvp_id, Types.id);
                fields.add(CT.FV_COBZ_ID, m_vCobzNC[i].vAplicaciones[j].fvcobz_id, Types.long);

                fields.add(CT.FV_COBZ_COTIZACION, m_vCobzNC[i].cotizacion, Types.double);
                fields.add(CT.FV_COBZ_IMPORTE, m_vCobzNC[i].vAplicaciones[j].aplicado, Types.double);
                fields.add(CT.FV_COBZ_IMPORTE_ORIGEN, DivideByCero(m_vCobzNC[i].vAplicaciones[j].aplicado, m_vCobzNC[i].cotizacion), Types.double);

                register.getFields().setHaveLastUpdate(false);
                register.getFields().setHaveWhoModify(false);

                transaction.addRegister(register);
              }
            }
          }
        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      var pSaveCtaCte = function(id, cobzId, aplic) {
        var register = null;
        var ctaCte = null;

        // Obtengo las cuentas del tercero
        if(!pGetCuentasDeudor(cobzId, ctaCte, aplic)) { return false; }

        var register = new DB.Register();
        register.setFieldId(CSCCOBZI_TMPID);
        register.setTable(CSTCOBRANZAITEMTMP);
        register.setId(Cairo.Constants.NEW_ID);

        fields.add(CV.CUE_ID, ctaCte.cue_id, Types.id);
        fields.add(CSCCOBZI_IMPORTE_ORIGEN, ctaCte.importeOrigen, Types.currency);
        fields.add(CSCCOBZI_IMPORTE, ctaCte.importe, Types.currency);

        fields.add(CSCCOBZI_ORDEN, 1, Types.integer);
        fields.add(CSCCOBZI_TIPO, csECobranzaItemTipo.csECobziTCtaCte, Types.integer);
        fields.add(CT.COBZ_TMP_ID, id, Types.id);
        fields.add(CSCCOBZI_ID, id, Types.long);
        fields.add(CSCCOBZI_OTRO_TIPO, csECobranzaItemOtroTipo.csEOtroHaber, Types.integer);

        register.getFields().setHaveLastUpdate(false);
        register.getFields().setHaveWhoModify(false);

        if(!Cairo.Database.save(register, , "pSaveCtaCte", C_MODULE, c_ErrorSave)) { return false; }

        return true;
      };

      var pGetCuentasDeudor = function(cobzId, ctaCte, aplic) { // TODO: Use of ByRef founded Private Function pGetCuentasDeudor(ByVal CobzId As Long, ByRef CtaCte As T_CtaCte, ByVal Aplic As Double) As Boolean
        var cueIdFactura = null;
        var cotizacion = null;

        if(!pGetCueIdFactura(cueIdFactura)) { return false; }

        ctaCte.cue_id = cueIdFactura;
        ctaCte.importe = aplic;

        if(pGetMonIdForCueId(cueIdFactura) !== m_monDefault) {
          if(!pGetCotizacionCobranza(cobzId, cotizacion)) { return false; }
          ctaCte.importeOrigen = aplic * cotizacion;
        }

        return true;
      };

      var pGetMonIdForCueId = function(cueId) {
        var _rtn = 0;
        try {

          var sqlstmt = null;
          var rs = null;

          sqlstmt = "select mon_id from Cuenta where cue_id = "+ cueId.toString();

          if(!Cairo.Database.openRs(sqlstmt, rs)) { return _rtn; }

          if(rs.isEOF()) { return _rtn; }

          _rtn = valField(m_data.items[_i], CV.MON_ID);

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "pGetMonIdForCueId", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var pGetCotizacionCobranza = function(cobzId, cotizacion) { // TODO: Use of ByRef founded Private Function pGetCotizacionCobranza(ByVal CobzId As Long, ByRef Cotizacion As Double) As Boolean
        var _rtn = null;
        try {

          var sqlstmt = null;
          var rs = null;

          sqlstmt = "select cobz_cotizacion from Cobranza where cobz_id = "+ cobzId.toString();

          if(!Cairo.Database.openRs(sqlstmt, rs)) { return _rtn; }

          if(rs.isEOF()) { return _rtn; }

          cotizacion = valField(m_data.items[_i], CT.COBZ_COTIZACION);

          _rtn = true;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "pGetCotizacionCobranza", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var pGetCueIdFactura = function(cueIdFactura) { // TODO: Use of ByRef founded Private Function pGetCueIdFactura(ByRef CueIdFactura As Long) As Boolean
        var _rtn = null;
        try {

          var sqlstmt = null;
          var rs = null;

          sqlstmt = "sp_DocFacturaVentaGetCueDeudor "+ m_fvId;

          if(!Cairo.Database.openRs(sqlstmt, rs)) { return _rtn; }

          if(rs.isEOF()) { return _rtn; }

          cueIdFactura = valField(m_data.items[_i], CV.CUE_ID);

          _rtn = true;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "pGetCueIdFactura", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      //////////////////////////////////////////////////////////////////////////////////////
      //
      //   construccion - destruccion
      //
      //////////////////////////////////////////////////////////////////////////////////////
      self.initialize = function() {
        try {

          // Error al grabar la Factura de Venta
          c_ErrorSave = getText(2220, "");

          m_generalConfig = new cGeneralConfig();
          m_generalConfig.Load;

          G.redim(m_vCobzNC, 0);
          G.redimPreserve(0, .vAplicaciones);

          m_monDefault = GetMonedaDefault();

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "Class_Initialize", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };


      ////////////////////////////////
      //  Codigo estandar de errores
      //  On Error GoTo ControlError
      //
      //  GoTo ExitProc
      //ControlError:
      //  MngError err,"", C_Module, ""
      //  If Err.Number Then Resume ExitProc
      //ExitProc:
      //  On Error Resume Next

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("FacturaVentaAplic.List", function(List, Cairo, Backbone, Marionette, $, _) {
    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.facturaventaaplicEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.facturaventaaplicEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "FacturaVentaAplics",
            entityName: "facturaventaaplic",
            entitiesName: "facturaventaaplics"
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
              var editor = Cairo.FacturaVentaAplic.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_FACTURAVENTAAPLIC)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            var apiPath = Cairo.Database.getAPIVersion();
            return Cairo.Database.destroy(apiPath + "general/facturaventaaplic", id, Cairo.Constants.DELETE_FUNCTION, "FacturaVentaAplic").success(
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
          Cairo.LoadingMessage.show("FacturaVentaAplics", "Loading facturaventaaplic from Crowsoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ facturaventaaplicTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.FACTURAVENTAAPLIC,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.facturaventaaplicTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("FacturaVentaAplics", "facturaventaaplicTreeRegion", "#general/facturaventaaplics", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());
