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
      var m_dialog = null;
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
                        m_client.refresh(self, m_fvId);
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

            if(response.data.id === m_fvId) {

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

        property = properties.item(C_TOTAL_COBRANZA); // cobranza
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
        var grid = property.getGrid();
        var columns = grid.getColumns();
        columns.clear();

        var elem = columns.add(null);
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
        var grid = property.getGrid();
        var columns = grid.getColumns();
        columns.clear();

        var elem = columns.add(null);
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
        elem.setKey(KIPR_RV_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIPR_PVI_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIPR_PV_ID);

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
          item.docName = valField(m_data.itemsAplicados[_i], C.DOC_NAME);
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
          item.pr_id = valField(m_data.itemsAplicados[_i], C.PR_ID);

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

        m_vPedidoRemito[index].vAplicaciones.push(createPedidoRemitoAplic());

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
            elem.setId(m_vPedidoRemito[idx].pv_id);
            elem.setKey(KIPR_PV_ID);

            elem = row.add(null);
            elem.setValue(m_vPedidoRemito[idx].docName);
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
        elem.setId(m_vPedidoRemito[i].rv_id);
        elem.setKey(KIPR_RV_ID);

        elem = row.add(null);
        elem.setId(m_vPedidoRemito[i].pvi_id);
        elem.setKey(KIPR_PVI_ID);

        elem = row.add(null);
        elem.setId(m_vPedidoRemito[i].pv_id);
        elem.setKey(KIPR_PV_ID);

        elem = row.add(null);
        elem.setValue(m_vPedidoRemito[i].docName);
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
            var row = grid.getRows(lRow);

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

        for(var _i = 0, count = m_data.cobrosAplicados.length; _i < count; _i += 1) {

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

      var setGridVencimientos = function(property) {
        var grid = property.getGrid();
        var columns = grid.getColumns();
        columns.clear();

        var elem = columns.add(null);
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
          elem.setId(valField(m_data.vencimientos[_i], CT.FVD_ID));
          elem.setKey(KIV_FVD_ID);

          elem = row.add(null);
          elem.setId(valField(m_data.vencimientos[_i], CT.FVP_ID));
          elem.setKey(KIV_FVP_ID);

          elem = row.add(null);
          elem.setValue(valField(m_data.vencimientos[_i], C.FECHA));
          elem.setKey(KIV_FECHA);

          elem = row.add(null);
          elem.setValue(valField(m_data.vencimientos[_i], C.PENDIENTE));
          elem.setKey(KIV_PENDIENTE);

          var value = valField(m_data.vencimientos[_i], C.IMPORTE);
          elem = row.add(null);
          elem.setValue(value);
          elem.setKey(KIV_APLICADO);

          if(value !== 0) {
            row.setBackColor("#HFFCC99");
          }

          elem = row.add(null);
          elem.setValue(valField(m_data.vencimientos[_i], C.IMPORTE));
          elem.setKey(KIV_APLICADO2);
        }
      };

      var cobranzaLoadAplicCreditos = function() {
        for(var _i = 0, count = m_data.cobrosParaAplicar.length; _i < count; _i += 1) {
          var pendiente = valField(m_data.cobrosParaAplicar[_i], C.PENDIENTE);
          m_vCobzNC.push({
            cobz_id: valField(m_data.cobrosParaAplicar[_i], CT.COBZ_ID),
            fv_id: valField(m_data.cobrosParaAplicar[_i], CV.FV_ID),
            fvd_id: valField(m_data.cobrosParaAplicar[_i], CT.FVD_ID),
            fvp_id: NO_ID,
            docName: valField(m_data.cobrosParaAplicar[_i], C.DOC_NAME),
            nroDoc: valField(m_data.cobrosParaAplicar[_i], C.NRO_DOC),
            fecha: valFieldDateValue(m_data.cobrosParaAplicar[_i], C.FECHA),
            pendiente: pendiente,
            pendienteActual: pendiente,
            cotizacion: valField(m_data.cobrosParaAplicar[_i], CT.FV_COBZ_COTIZACION),
            vAplicaciones: [],
            aplicado: 0,
            aplicadoActual: 0
          });
        }
      };

      var setGridAplicCobranza = function(property) {
        var grid = property.getGrid();
        var columns = grid.getColumns();
        columns.clear();

        var elem = columns.add(null);
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

      var createCobranzaItem = function() {
        return {
          cobz_id: NO_ID,
          fv_id: NO_ID,
          fvd_id: NO_ID,
          fvp_id: NO_ID,
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
      
      var cobranzaAddToCreditos = function(cobzId, fvdId, fvpId) {
        var index = -1;

        for(var i = 0, count = m_vCobzNC.length; i < count ; i += 1) {
          if(   (m_vCobzNC[i].cobz_id === cobzId && cobzId !== NO_ID)
            || (m_vCobzNC[i].fvd_id === fvdId && fvdId !== NO_ID)
            || (m_vCobzNC[i].fvp_id === fvpId && fvpId !== NO_ID)) {

            index = i;
            break;
          }
        }

        if (index === -1) {
          m_vCobzNC.push(createCobranzaItem());
          index = m_vCobzNC.length -1;
        }

        m_vCobzNC[index].vAplicaciones.push(createCobranzaAplic());

        return {
          indexPago: index,
          indexAplic: m_vCobzNC[index].vAplicaciones.length -1
        };
      };

      var createCobranzaAplic = function() {
        return {
          fvcobz_id: NO_ID,
          fvnc_id: NO_ID,
          fvp_id: NO_ID,
          fvd_id: NO_ID,
          aplicado: 0
        };
      };
      
      var cobranzaSetAplicVtos = function(property, fvdId, fvpId) {
        var rows = property.getGrid().getRows();
        rows.clear();

        m_fvdId = fvdId;
        m_fvpId = fvpId;

        for(var i = 0, count = m_vCobzNC.length; i < count; i++) {

          if(m_vCobzNC[i].vAplicaciones.length > 0) {
            cobranzaSetAplicVtosAux1(i, property, fvdId, fvpId);
          }
          else {
            cobranzaSetAplicVtosAux2(i, property);
          }
        }

        // now applied credits to other installment and have a pending amount
        //
        for(var i = 0, count = m_vCobzNC.length; i < count; i++) {

          var bAplic = false;
          var id;

          for(var _j = 0, _countj = rows.size(); _j < _countj; _j++) {
            var row = rows.item(_j);
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

            for(var j = 0, countj = m_vCobzNC[i].vAplicaciones.length; j < countj; j++) {

              id = getCell(row, KIC_FVD_ID).getId();
              if(id === m_vCobzNC[i].vAplicaciones[j].fvd_id && id !== NO_ID) {
                bAplic = true;
                break;
              }

              id = getCell(row, KIC_FVP_ID).getId();
              if(id === m_vCobzNC[i].vAplicaciones[j].fvp_id && id !== NO_ID) {
                bAplic = true;
                break;
              }
            }

            if(bAplic) { break; }
          }

          if(!bAplic) {
            cobranzaSetAplicVtosAux2(i, property);
          }
        }
      };

      var cobranzaSetAplicVtosAux1 = function(idx, property, fvdId, fvpId) {

        var elem;
        var rows = property.getGrid().getRows();

        for(var i = 0, count = m_vCobzNC[idx].vAplicaciones.length; i < count; i++) {

          if(
            (m_vCobzNC[idx].vAplicaciones[i].fvd_id === fvdId && fvdId !== NO_ID)
            || (m_vCobzNC[idx].vAplicaciones[i].fvp_id === fvpId && fvpId !== NO_ID)
            ) {

            var row = rows.add(null);

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
            elem.setValue(m_vCobzNC[idx].docName);
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

            row.setBackColor("#FFCC99");
          }
        }
      };

      var cobranzaSetAplicVtosAux2 = function(i, property) {

        if(m_vCobzNC[i].pendiente <= 0) { return; }

        var elem;
        var row  = property.getGrid().getRows().add(null);

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
        elem.setValue(m_vCobzNC[i].docName);
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

      var cobranzaUpdateAplicVtos = function() {
        var aplicadoTotal = 0;
        var rows = cobranzaGetItemsCobranza().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {
          var row = rows.item(_i);

          if(cellFloat(row, KIC_APLICADO) > 0 || getCell(row, KIC_IDX2).getId() !== -1) {

            var i = getCell(row, KIC_IDX1).getId();
            var j = getCell(row, KIC_IDX2).getId();

            var aplicado = cellFloat(row, KIC_APLICADO);
            aplicadoTotal += aplicado;

            m_vCobzNC[i].aplicado = cobranzaAddToAplic(m_vCobzNC[i].vAplicaciones, aplicado, j);
            m_vCobzNC[i].pendiente = m_vCobzNC[i].pendienteActual - (m_vCobzNC[i].aplicado - m_vCobzNC[i].aplicadoActual);
          }
        }

        return aplicadoTotal;
      };

      var cobranzaAddToAplic = function(vAplicaciones, importe, idx) {
        var aplicado = 0;

        if(idx === 0) {
          vAplicaciones.push(createCobranzaAplic());
          idx = vAplicaciones.length -1;
          vAplicaciones[idx].fvd_id = m_fvdId;
          vAplicaciones[idx].fvp_id = m_fvpId;
        }

        vAplicaciones[idx].aplicado = importe;

        for(var i = 0, count = vAplicaciones.length; i < count; i++) {
          aplicado += vAplicaciones[i].aplicado;
        }

        return aplicado;
      };

      var cobranzaGetVtoPendiente = function() {
        var property = m_dialog.getProperties().item(C_VENCIMIENTOS);
        return getCell(property.getGrid().getRows().item(property.getSelectedRow()), KIV_PENDIENTE);
      };

      var cobranzaGetVtoAplicado = function() {
        var property = m_dialog.getProperties().item(C_VENCIMIENTOS);
        return getCell(property.getGrid().getRows().item(property.getSelectedRow()), KIV_APLICADO2);
      };

      var cobranzaColAUpdateCobranza = function(property, lRow, lCol) {
        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).Key) {
          case KIC_APLICADO:
            var row = grid.getRows(lRow);

            var cell = getCell(row, KIC_APLICADO);

            var pendiente = val(cobranzaGetVtoPendiente().getValue()) + cellFloat(row, KIC_APLICADO2);
            var maxVal = cellFloat(row, KIC_PENDIENTE) + cellFloat(row, KIC_APLICADO2);

            if(maxVal > pendiente) {
              maxVal = pendiente;
            }

            if(val(cell.getValue()) > maxVal) {
              cell.setValue(maxVal);
            }
            else if(val(cell.getValue()) < 0) {
              cell.setValue(0);
            }

            var aplicado = cobranzaGetAplicado();
            cobranzaRefreshVto(aplicado);
            cobranzaGetVtoAplicado().setValue(aplicado);

            // update pending credit
            //
            cell = getCell(row, KIC_PENDIENTE);
            cell.setValue(val(cell.getValue()) + cellFloat(row, KIC_APLICADO2) - cellFloat(row, KIC_APLICADO));
            getCell(row, KIC_APLICADO2).setValue(getCell(row, KIC_APLICADO).getValue());

            showPendienteCobranza();
            break;
        }
      };

      var cobranzaGetAplicado = function() {
        var aplicado = 0;

        var _count = cobranzaGetItemsCobranzaProperty().getGrid().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          var row = cobranzaGetItemsCobranzaProperty().getGrid().getRows().item(_i);
          aplicado += cellFloat(row, KIC_APLICADO);
        }
        return aplicado;
      };

      var cobranzaRefreshVto = function(aplicado) {
        var property = m_dialog.getProperties().item(C_VENCIMIENTOS);
        var row = property.getGrid().getRows().item(m_lastRowVto);

        getCell(row, KIV_APLICADO).setValue(aplicado);
        var aplicadoActual = cellFloat(row, KIV_APLICADO2);

        var cell = getCell(row, KIV_PENDIENTE);
        cell.setValue(cell.getValue() - (aplicado - aplicadoActual));

        getCell(row, KIV_APLICADO2).setValue(aplicado);

        var cols = property.getGrid().getColumns();
        m_dialog.showCellValue(property, m_lastRowVto,  D.getCol(cols, KIV_PENDIENTE).getIndex());
        m_dialog.showCellValue(property, m_lastRowVto, D.getCol(cols, KIV_APLICADO).getIndex());
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

      var cobranzaColBEditCobranza = function(property, lRow, lCol) {
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

      var showPendienteCobranza = function() {
        var total = null;
        var rows = cobranzaGetItemsVtosProperty().getGrid().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {
          var row = rows.item(_i);
          total = total + cellFloat(row, KIV_PENDIENTE);
        }

        cobranzaGetPendienteCobranza().setValue(total);

        m_dialog.showValue(cobranzaGetPendienteCobranza());
      };

      var cobranzaGetPendienteCobranza = function() {
        return m_dialog.getProperties().item(C_PENDIENTE_COBRANZA);
      };

      var cobranzaUpdateteGrids = function() {
        var aplicado = 0;

        if(m_lastRowVto !== -1) {
          aplicado = cobranzaUpdateAplicVtos();
        }

        return aplicado;
      };

      var cobranzaSaveNotaCredito = function(mainRegister) {
        var transaction = DB.createTransaction();

        transaction.setTable(CT.FACTURA_VENTA_NOTA_CREDITO_TMP);

        for(var i = 0, count = m_vCobzNC.length; i < count; i += 1) {

          if(m_vCobzNC[i].fv_id !== NO_ID) {

            for(var j = 0, count_j = m_vCobzNC[i].vAplicaciones.length; j < count_j; j += 1) {

              if(m_vCobzNC[i].vAplicaciones[j].aplicado > 0 || m_vCobzNC[i].vAplicaciones[j].fvnc_id) {

                var register = new DB.Register();
                register.setFieldId(CT.FV_NC_TMP_ID);
                register.setId(Cairo.Constants.NEW_ID);

                var fields = register.getFields();

                if(m_isNotaCredito) {
                  fields.add(CT.FV_ID_NOTA_CREDITO, m_fvId, Types.id);
                  fields.add(CT.FV_ID_FACTURA, m_vCobzNC[i].fv_id, Types.id);

                  fields.add(CT.FVD_ID_NOTA_CREDITO, m_vCobzNC[i].vAplicaciones[j].fvd_id, Types.id);
                  fields.add(CT.FVD_ID_FACTURA, m_vCobzNC[i].fvd_id, Types.id);

                  fields.add(CT.FVP_ID_NOTA_CREDITO, m_vCobzNC[i].vAplicaciones[j].fvp_id, Types.id);
                  fields.add(CT.FVP_ID_FACTURA, m_vCobzNC[i].fvp_id, Types.id);
                }
                else {
                  fields.add(CT.FV_ID_NOTA_CREDITO, m_vCobzNC[i].fv_id, Types.id);
                  fields.add(CT.FV_ID_FACTURA, m_fvId, Types.id);

                  fields.add(CT.FVD_ID_NOTA_CREDITO, m_vCobzNC[i].fvd_id, Types.id);
                  fields.add(CT.FVD_ID_FACTURA, m_vCobzNC[i].vAplicaciones[j].fvd_id, Types.id);

                  fields.add(CT.FVP_ID_NOTA_CREDITO, m_vCobzNC[i].fvp_id, Types.id);
                  fields.add(CT.FVP_ID_FACTURA, m_vCobzNC[i].vAplicaciones[j].fvp_id, Types.id);
                }

                fields.add(CT.FV_NC_IMPORTE, m_vCobzNC[i].vAplicaciones[j].aplicado, Types.double);
                fields.add(CT.FV_NC_ID, 0, Types.long);

                transaction.addRegister(register);
              }
            }
          }
        }

        mainRegister.addTransaction(transaction);
      };

      var cobranzaSaveCobranza = function(mainRegister) {
        var transaction = DB.createTransaction();

        transaction.setTable(CT.COBRANZA_TMP);

        var cobranzas = cobranzaGetCobranzas();
        for(var i = 0, count = cobranzas.length; i < count; i += 1) {
          cobranzaSaveCobranzaAux(transaction, cobranzas[i].cobz_id, cobranzas[i].newAplic, m_vCobzNC[i].cotizacion);
        }

        mainRegister.addTransaction(transaction);
      };

      var cobranzaGetCobranzas = function() {
        var cobranzas = [];
        for(var i = 0, count = m_vCobzNC.length; i < count; i += 1) {
          if(m_vCobzNC[i].cobz_id !== NO_ID) {
            if(m_vCobzNC[i].aplicado > 0 || m_vOpgNC[i].aplicadoActual !== 0) {
              var k = cobranzaGetIdxCobranzas(cobranzas, m_vCobzNC[i].cobz_id);
              cobranzas[k] = {
                cobz_id: m_vCobzNC[i].cobz_id,
                newAplic: m_vCobzNC[i].aplicado,
                currAplic: m_vCobzNC[i].aplicadoActual
              };
            }
          }
        }
        return cobranzas;
      };

      var cobranzaGetIdxCobranzas = function(cobranzas, cobzId) {
        for(var i = 0, count = cobranzas.length; i < count ; i += 1) {
          if(cobranzas[i].cobz_id === cobzId) {
            return i;
          }
        }
        return cobranzas.length;
      };

      var cobranzaSaveCobranzaAux = function(transaction, cobzId, aplic, cobzCotizacion) {

        var register = new DB.Register();
        register.setFieldId(CT.COBZ_TMP_ID);
        register.setId(Cairo.Constants.NEW_ID);

        var fields = register.getFields();

        fields.add(CT.COBZ_ID, cobzId, Types.id);

        cobranzaSaveItems(register, cobzId);
        cobranzaSaveCtaCte(register, cobzId, aplic, cobzCotizacion);

        transaction.addRegister(register);

        return true;
      };

      var cobranzaSaveItems = function(mainRegister, cobzId) {
        var transaction = new Cairo.Database.Transaction();

        transaction.setTable(CT.FACTURA_VENTA_COBRANZA_TMP);

        for(var i = 0, count = m_vCobzNC.length; i < count; i += 1) {

          if(m_vCobzNC[i].cobz_id === cobzId) {

            for(var j = 0, count_j = m_vCobzNC[i].vAplicaciones.length; j < count_j; j += 1) {

              if(m_vCobzNC[i].vAplicaciones[j].aplicado > 0 || m_vCobzNC[i].vAplicaciones[j].fvcobz_id) {

                var register = new DB.Register();
                register.setFieldId(CT.FV_COBZ_TMP_ID);
                register.setId(Cairo.Constants.NEW_ID);

                var fields = register.getFields();

                fields.add(CT.COBZ_ID, m_vCobzNC[i].cobz_id, Types.long);
                fields.add(CV.FV_ID, m_fvId, Types.id);
                fields.add(CT.FVD_ID, m_vCobzNC[i].vAplicaciones[j].fvd_id, Types.id);
                fields.add(CT.FVP_ID, m_vCobzNC[i].vAplicaciones[j].fvp_id, Types.id);
                fields.add(CT.FV_COBZ_ID, m_vCobzNC[i].vAplicaciones[j].fvcobz_id, Types.long);

                fields.add(CT.FV_COBZ_COTIZACION, m_vCobzNC[i].cotizacion, Types.double);
                fields.add(CT.FV_COBZ_IMPORTE, m_vCobzNC[i].vAplicaciones[j].aplicado, Types.double);
                fields.add(CT.FV_COBZ_IMPORTE_ORIGEN, Cairo.Util.zeroDiv(m_vCobzNC[i].vAplicaciones[j].aplicado, m_vCobzNC[i].cotizacion), Types.double);

                transaction.addRegister(register);
              }
            }
          }
        }

        mainRegister.addTransaction(transaction);
      };

      var cobranzaSaveCtaCte = function(mainRegister, cobzId, aplic, cobzCotizacion) {
        var transaction = DB.createTransaction();

        transaction.setTable(CT.COBRANZA_ITEM_CUENTA_CORRIENTE_TMP);

        aplic = cobranzaGetAplic(aplic, cobzCotizacion);

        var register = new DB.Register();
        register.setFieldId(CT.COBZI_TMP_ID);
        register.setId(Cairo.Constants.NEW_ID);

        var fields = register.getFields();

        fields.add(C.CUE_ID, m_ctaCteCueId, Types.id);
        fields.add(CT.COBZI_IMPORTE_ORIGEN, aplic.importeOrigen, Types.currency);
        fields.add(CT.COBZI_IMPORTE, aplic.importe, Types.currency);

        fields.add(CT.COBZI_ORDEN, 1, Types.integer);
        fields.add(CT.COBZI_TIPO, CT.CobranzaItemTipo.ITEM_CTA_CTE, Types.integer);
        fields.add(CT.COBZI_OTRO_TIPO, CT.OtroTipo.OTRO_HABER, Types.integer);

        transaction.addRegister(register);

        mainRegister.addTransaction(transaction);
      };

      var cobranzaGetAplic = function(aplic, cotizacion) {
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

          m_vCobzNC = [];
          m_vPedidoRemito = [];

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "initialize", C_MODULE, "");
        }
      };

      initialize();

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

}());
