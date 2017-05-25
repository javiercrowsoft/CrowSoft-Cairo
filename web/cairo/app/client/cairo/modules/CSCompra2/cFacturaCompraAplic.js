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
      var D = Cairo.Documents;
      var M = Cairo.Modal;
      var DB = Cairo.Database;
      var NO_ID = Cairo.Constants.NO_ID;
      var cellFloat = Dialogs.cellFloat;
      var getCell = Dialogs.cell;
      var Types = Cairo.Constants.Types;
      var valField = DB.valField;

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
      var m_generalConfig;
      var m_fcId = 0;
      var m_isNotaCredito;
      var m_fcNumero = "";
      var m_proveedor = "";
      var m_provId = 0;
      var m_docId = 0;
      var m_sucId = 0;
      var m_total = 0;
      var m_ctaCteCueId = 0;
      var m_monIdXCuenta = 0;

      var m_monDefault = 0;

      var m_lastRowVto = 0;
      var m_lastRowItem = 0;

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
        items: [],
        otros: [],
        percepciones: [],
        legajos: [],
        serialNumbers: []
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
          m_dialog.focus(); // TODO: this function must be added to dialog. Should activate the tab of this dialog.
          return P.resolvedPromise(false);
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
                if(m_lastRowVto !== 0) {
                  ordenPagoRefreshVto(ordenPagoUpdateGrids());
                }

                // show amounts applied for this installment
                //
                m_lastRowVto = info.getSelectedIndex();
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
                if(m_lastRowItem !== 0) {
                  itemUpdateGrids();
                }

                // show amounts applied for this item
                //
                m_lastRowItem = info.getSelectedIndex();
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
        register.setId(Cairo.Constants.NEW_ID);

        saveDocCpra(register);
        itemSaveOrdenRemito(register);

        // the applied amount is not editable if the payment condition is automatic
        //
        var p = D.docFacturaCompraIsAutomatic(m_fcdId)
          .then(function(result) {
            if(result.success) {
              if(result.isAutomatic) {
                return M.showWarning(getText(3582, ""));
                                       // El tipo de condición de pago de esta factura ha generado automticamente
                                       // la orden de pago y su aplicacion no puede modificarse manualmente.
                                       // Solo se guardara la aplicación de la factura entre remitos y ordenes
                                       // de compra.
              }
              else {
                return true;
              }
            }
            else {
              return M.showWarningWithFalse(getText(3583, ""));
                                     // No se pudo determinar si esta factura genera automaticamente una orden de
                                     // pago. Vuelva a intentar gurdar la aplicación.
            }
          })
          .whenSuccess(function() {
            ordenPagoSaveNotaCredito(register);
            ordenPagoSaveOrdenPago(register);
          });

        return p.then(function() {
          DB.saveTransaction(
            register,
            false,
            "",
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            SAVE_ERROR_MESSAGE
          )
        }).then(

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
                        updateList();
                        m_client.refresh(self, m_fcId);
                      }
                    };
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

        data.vencimientos = data.get('vencimientos');
        data.items = data.get('items');
        data.pagosAplicados = data.get('pagosAplicados');
        data.pagosAplicados = data.get('pagosAplicados');
        data.pagosParaAplicar = data.get('pagosParaAplicar');
        data.itemsAplicados = data.get('itemsAplicados');
        data.itemsParaAplicar = data.get('itemsParaAplicar');

        return data;
      };

      var load = function() {
        return DB.getData("load[" + m_apiPath + "compras/facturacompra/aplic]", m_fcId).then(
          function(response) {
            if(response.success !== true) { return false; }

            if(response.data.id === m_fcdId) {

              m_data = loadDataFromResponse(response);

              var data = response.data;

              m_ctaCteCueId = valField(data, CT.CTACTE_CUE_ID);
              m_monIdXCuenta = valField(data, CT.MON_ID_X_CUENTA);

              ordenPagoLoadAplicVtos();
              itemLoadAplicItems();
            }
          });
      };

      self.terminate = function() {

        m_editing = false;

        try {
          if(m_client !== null) {
            // check what we should do here
            //
            debugger;
          }
        }
        catch (ignored) {
          Cairo.logError('Error in terminate', ignored);
        }
      };

      self.getPath = function() {
        return "#general/facturacompraaplic/" + m_id.toString();
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

      var columnAfterUpdate = function(key, lRow, lCol) {
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

      var columnBeforeEdit = function(key, lRow, lCol, iKeyAscii) {
        var rtn = false;
        
        try {
        
          switch (key) {
        
            case K_APLIC_ORDENPAGO:
              rtn = ordenPagoColBEditOrdenPago(ordenPagoGetItemsOrdenPagoProperty(), lRow, lCol, iKeyAscii);
              break;

            case K_APLIC_ORDEN_REMITO:
              rtn = itemColBEditOrdenRemito(itemGetItemsOrdenRemitoProperty(), lRow, lCol, iKeyAscii);
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
        });
      };

      var loadCollection = function() {

        m_lastRowVto = 0;
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
        elem.hideLabel();;
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
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setKey(K_PENDIENTE_ORDENPAGO);
        elem.setTabIndex(1);

        elem = properties.add(null, C_VENCIMIENTOS);
        elem.setType(Dialogs.PropertyType.grid);
        elem.hideLabel();
        setGridVencimientos(elem);
        loadVencimientos(elem);
        elem.setKey(K_VENCIMIENTOS);
        elem.setName(getText(1644, "")); // Vencimientos
        elem.hideLabel();;
        elem.setGridEditEnabled(false);
        elem.setGridAddEnabled(false);
        elem.setGridRemoveEnabled(false);
        elem.setTabIndex(1);
        elem.setRowSelect(true);
        elem.setDontSelectInGotFocus(true);

        elem = properties.add(null, C_APLICORDENPAGO);
        elem.setType(Dialogs.PropertyType.grid);
        elem.hideLabel();;
        setGridAplicOrdenPago(elem);
        elem.setKey(K_APLIC_ORDENPAGO);
        elem.setName("OrdenPago");
        elem.hideLabel();;
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

      //////////////////////////////////////////////////////////////////////////////////////
      //
      //   ORDENES / REMITOS
      //
      //////////////////////////////////////////////////////////////////////////////////////

      var itemLoadAplicItems = function() {
        itemLoadAplicAplicados();
        itemLoadAplicCreditos();
      };

      var loadItems = function(propiedad) {

        sqlstmt = "sp_DocFacturaCompraGetAplic "+ Cairo.Company.getId().toString()+ ","+ m_fcId+ ",4";
        if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pItLoadItems", C_MODULE)) { return false; }

        propiedad.getGrid().getColumns().clear();
        propiedad.getGrid().getRows().clear();

        grid = propiedad.getGrid();

        var w_columns = grid.getColumns();
        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_FCI_ID);

        var elem = w_columns.add(null);
        elem.setName(getText(1619, "")); // Producto
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KII_PR_ID);

        var elem = w_columns.add(null);
        elem.setName(getText(1609, "")); // Pendiente
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KII_PENDIENTE);

        var elem = w_columns.add(null);
        elem.setName(getText(1608, "")); // Aplicado
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KII_APLICADO);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_APLICADO2);

        var f = null;
        var fv = null;

        while (!rs.isEOF()) {

          f = propiedad.getGrid().getRows().add(null);

          fv = f.add(null);
          fv.setID(Cairo.Database.valField(rs.getFields(), CC.FCI_ID));
          fv.setKey(KII_FCI_ID);

          fv = f.add(null);
          fv.setID(Cairo.Database.valField(rs.getFields(), CC.PR_ID));
          fv.setValue(Cairo.Database.valField(rs.getFields(), CC.PR_NOMBRECOMPRA));
          fv.setKey(KII_PR_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(rs.getFields(), CC.FCI_PENDIENTE));
          fv.setKey(KII_PENDIENTE);

          value = Cairo.Database.valField(rs.getFields(), C.APLICADO);
          fv = f.add(null);
          fv.setValue(value);
          fv.setKey(KII_APLICADO);

          if(value !== 0) {
            row = f;
            row.setBackColor(&HFFCC99);
          }

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(rs.getFields(), C.APLICADO));
          fv.setKey(KII_APLICADO2);

          rs.MoveNext;
        }

        return true;
      };

      var setGridAplicOrdenRemito = function(propiedad) { // TODO: Use of ByRef founded Private Function itemSetGridAplicOrdenRemito(ByRef Propiedad As cIABMProperty) As Boolean
        var grid = null;

        propiedad.getGrid().getColumns().clear();
        propiedad.getGrid().getRows().clear();

        grid = propiedad.getGrid();

        var w_columns = grid.getColumns();
        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIPR_IDX1);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIPR_IDX2);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIPR_RCFC_ID);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIPR_OCFC_ID);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIPR_RCI_ID);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIPR_RC_ID);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIPR_OCI_ID);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIPR_OC_ID);

        var elem = w_columns.add(null);
        elem.setName(getText(1567, "")); // Documento
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIPR_DOC);

        var elem = w_columns.add(null);
        elem.setName(getText(1610, "")); // Comprobante
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIPR_NRODOC);

        var elem = w_columns.add(null);
        elem.setName(getText(1569, "")); // Fecha
        elem.setType(Dialogs.PropertyType.date);
        elem.setKey(KIPR_FECHA);

        var elem = w_columns.add(null);
        elem.setName(getText(1609, "")); // Pendiente
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIPR_PENDIENTE);

        var elem = w_columns.add(null);
        elem.setName(getText(1608, "")); // Aplicado
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIPR_APLICADO);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIPR_APLICADO2);

        return true;
      };

      var itemLoadAplicAplicados = function() {
        var sqlstmt = null;
        var rs = null;
        var i = null;
        var idx = null;

        sqlstmt = "sp_DocFacturaCompraGetAplic "+ Cairo.Company.getId().toString()+ ","+ m_fcId+ ",5";
        if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadAplicAplicados", C_MODULE)) { return false; }

        G.redim(m_vOrdenRemito, 0);
        G.redimPreserve(0, .vAplicaciones);

        if(!rs.isEOF()) {

          rs.MoveLast;
          rs.MoveFirst;

          while (!rs.isEOF()) {

            i = itemAddToCreditos(Cairo.Database.valField(rs.getFields(), CC.RCI_ID), Cairo.Database.valField(rs.getFields(), CC.OCI_ID), idx);

            // Documento
            //
            m_vOrdenRemito[i].docNombre = Cairo.Database.valField(rs.getFields(), CC.DOC_NAME);
            m_vOrdenRemito[i].nroDoc = Cairo.Database.valField(rs.getFields(), C.NRO_DOC);
            m_vOrdenRemito[i].fecha = Cairo.Database.valField(rs.getFields(), C.FECHA);

            // Pendiente
            //
            m_vOrdenRemito[i].pendiente = Cairo.Database.valField(rs.getFields(), CSCPENDIENTE);
            m_vOrdenRemito[i].pendienteActual = m_vOrdenRemito[i].pendiente;

            // Orden / Remito
            //
            m_vOrdenRemito[i].rci_id = Cairo.Database.valField(rs.getFields(), CC.RCI_ID);
            m_vOrdenRemito[i].rc_id = Cairo.Database.valField(rs.getFields(), CC.RC_ID);
            m_vOrdenRemito[i].oci_id = Cairo.Database.valField(rs.getFields(), CC.OCI_ID);
            m_vOrdenRemito[i].oc_id = Cairo.Database.valField(rs.getFields(), CC.OC_ID);
            m_vOrdenRemito[i].pR_ID = Cairo.Database.valField(rs.getFields(), CC.PR_ID);

            // Aplicaciones

            vAplicaciones.rcfc_id = Cairo.Database.valField(rs.getFields(), CC.RC_FC_ID);
            vAplicaciones.ocfc_id = Cairo.Database.valField(rs.getFields(), CC.OC_FC_ID);

            vAplicaciones.fci_id = Cairo.Database.valField(rs.getFields(), CC.FCI_ID);

            vAplicaciones.Aplicado = Cairo.Database.valField(rs.getFields(), C.APLICADO);

            // Aplicacion total sobre este credito
            m_vOrdenRemito[i].aplicado = m_vOrdenRemito[i].aplicado + m_vOrdenRemito[i].vAplicaciones(idx).Aplicado;
            m_vOrdenRemito[i].aplicadoActual = m_vOrdenRemito[i].aplicado;

            rs.MoveNext;
          }
        }

        return true;
      };

      var itemLoadAplicCreditos = function() {
        var sqlstmt = null;
        var rs = null;
        var i = null;

        sqlstmt = "sp_DocFacturaCompraGetAplic "+ Cairo.Company.getId().toString()+ ","+ m_fcId+ ",6";
        if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadAplicCreditos", C_MODULE)) { return false; }

        if(!rs.isEOF()) {

          rs.MoveLast;
          rs.MoveFirst;

          i = m_vOrdenRemito.Length;
          G.redimPreserve(m_vOrdenRemito, i + rs.RecordCount);

          while (!rs.isEOF()) {

            i = i + 1;
            m_vOrdenRemito[i].pR_ID = Cairo.Database.valField(rs.getFields(), CC.PR_ID);
            m_vOrdenRemito[i].rci_id = Cairo.Database.valField(rs.getFields(), CC.RCI_ID);
            m_vOrdenRemito[i].rc_id = Cairo.Database.valField(rs.getFields(), CC.RC_ID);
            m_vOrdenRemito[i].oci_id = Cairo.Database.valField(rs.getFields(), CC.OCI_ID);
            m_vOrdenRemito[i].oc_id = Cairo.Database.valField(rs.getFields(), CC.OC_ID);

            m_vOrdenRemito[i].docNombre = Cairo.Database.valField(rs.getFields(), CC.DOC_NAME);
            m_vOrdenRemito[i].nroDoc = Cairo.Database.valField(rs.getFields(), C.NRO_DOC);
            m_vOrdenRemito[i].fecha = Cairo.Database.valField(rs.getFields(), C.FECHA);

            m_vOrdenRemito[i].pendiente = Cairo.Database.valField(rs.getFields(), CSCPENDIENTE);
            m_vOrdenRemito[i].pendienteActual = m_vOrdenRemito[i].pendiente;

            G.redim(m_vOrdenRemito[i].vAplicaciones, 0);

            rs.MoveNext;
          }
        }

        return true;
      };

      var itemAddToCreditos = function(rciId, ociId, idx) { // TODO: Use of ByRef founded Private Function itemAddToCreditos(ByVal RciId As Long, ByVal OciId As Long, ByRef Idx As Long) As Long
        var _rtn = 0;
        var i = null;

        for(i = 1; i <= m_vOrdenRemito.Length; i++) {
          if((m_vOrdenRemito[i].rci_id === rciId && rciId !== NO_ID) || (m_vOrdenRemito[i].oci_id === ociId && ociId !== NO_ID)) {

            G.redimPreserve(m_vOrdenRemito[i].vAplicaciones, m_vOrdenRemito[i].vAplicaciones.Length + 1);

            idx = m_vOrdenRemito[i].vAplicaciones.Length;
            _rtn = i;
            return _rtn;
          }
        }

        G.redimPreserve(m_vOrdenRemito, m_vOrdenRemito.Length + 1);
        G.redimPreserve(m_vOrdenRemito.Length, .vAplicaciones);
        _rtn = m_vOrdenRemito.Length;
        idx = 1;

        return _rtn;
      };

      var itemUpdateGrids = function() {
        var _rtn = 0;
        var iProp = null;
        var row = null;

        iProp = m_dialog.getProperties().item(C_ITEMS);

        if(m_lastRowItem !== 0) {

          row = iProp.getGrid().getRows().item(m_lastRowItem);
          _rtn = itemUpdateAplicItems(m_dialog.getProperties().item(C_APLIC_ORDEN_REMITO), getCell(row, KII_FCI_ID).getId());
        }

        return _rtn;
      };

      var itemSetAplicItems = function(iProp, fci_id, pR_ID) { // TODO: Use of ByRef founded Private Function itemSetAplicItems(ByRef iProp As cIABMProperty, ByVal fci_id As Long, ByVal PR_ID As Long) As Boolean
        var cotizacion = null;
        var i = null;
        var j = null;

        iProp.getGrid().getRows().clear();

        m_fciId = fci_id;

        for(i = 1; i <= m_vOrdenRemito.Length; i++) {

          if(m_vOrdenRemito[i].pR_ID === pR_ID) {

            if(m_vOrdenRemito[i].vAplicaciones.Length > 0) {
              itemSetAplicItemsAux1(i, iProp, fci_id);
            }
            else {
              itemSetAplicItemsAux2(i, iProp);
            }
          }

        }

        // Ahora los creditos que tienen aplicaciones
        // pero no estan con este vencimiento y tienen pendiente
        var id = null;
        var bAplic = null;
        var row = null;

        for(i = 1; i <= m_vOrdenRemito.Length; i++) {

          bAplic = false;

          if(m_vOrdenRemito[i].pR_ID === pR_ID) {

            var _count = iProp.getGrid().getRows().size();
            for(var _j = 0; _j < _count; _j++) {
              row = iProp.getGrid().getRows().item(_j);
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
              for(j = 1; j <= m_vOrdenRemito[i].vAplicaciones.Length; j++) {
                if(id === m_vOrdenRemito[i].vAplicaciones(j).fci_id && id !== NO_ID) {
                  bAplic = true;
                  break;
                }
              }

              if(bAplic) { break; }
            }

            if(!bAplic) { itemSetAplicItemsAux2(i, iProp); }
          }
        }

        return true;
      };

      var itemUpdateAplicItems = function(propiedad, fci_id) { // TODO: Use of ByRef founded Private Function itemUpdateAplicItems(ByRef Propiedad As cIABMProperty, ByVal fci_id As Long) As Double
        var cotizacion = null;
        var i = null;
        var j = null;
        var row = null;
        var aplicado = null;
        var aplicadoTotal = null;

        var _count = itemGetItemsOrdenRemito().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = itemGetItemsOrdenRemito().getRows().item(_i);

          if(cellFloat(row, KIPR_APLICADO) > 0 || getCell(row, KIPR_IDX2).getId() !== 0) {

            i = getCell(row, KIPR_IDX1).getId();
            j = getCell(row, KIPR_IDX2).getId();

            aplicado = cellFloat(row, KIPR_APLICADO);
            aplicadoTotal = aplicadoTotal + aplicado;

            m_vOrdenRemito[i].aplicado = itemAddToAplic(m_vOrdenRemito[i].vAplicaciones, aplicado, j);
            m_vOrdenRemito[i].pendiente = m_vOrdenRemito[i].pendienteActual - (m_vOrdenRemito[i].aplicado - m_vOrdenRemito[i].aplicadoActual);
          }
        }

        return aplicadoTotal;
      };

      var itemSetAplicItemsAux1 = function(idx, iProp, fci_id) { // TODO: Use of ByRef founded Private Sub itemSetAplicItemsAux1(ByVal Idx As Long, ByRef iProp As cIABMProperty, ByVal fci_id As Long)
        var f = null;
        var fv = null;
        var i = null;
        var iPropItem = null;
        var row = null;

        for(i = 1; i <= m_vOrdenRemito[idx].vAplicaciones.Length; i++) {

          if(m_vOrdenRemito[idx].vAplicaciones[i].fci_id === fci_id && fci_id !== NO_ID) {

            f = iProp.getGrid().getRows().add(null);

            fv = f.add(null);
            fv.setID(idx);
            fv.setKey(KIPR_IDX1);

            fv = f.add(null);
            fv.setID(i);
            fv.setKey(KIPR_IDX2);

            fv = f.add(null);
            fv.setID(m_vOrdenRemito[idx].vAplicaciones[i].rcfc_id);
            fv.setKey(KIPR_RCFC_ID);

            fv = f.add(null);
            fv.setID(m_vOrdenRemito[idx].vAplicaciones[i].ocfc_id);
            fv.setKey(KIPR_OCFC_ID);

            fv = f.add(null);
            fv.setID(m_vOrdenRemito[idx].rci_id);
            fv.setKey(KIPR_RCI_ID);

            fv = f.add(null);
            fv.setID(m_vOrdenRemito[idx].rc_id);
            fv.setKey(KIPR_RC_ID);

            fv = f.add(null);
            fv.setID(m_vOrdenRemito[idx].oci_id);
            fv.setKey(KIPR_OCI_ID);

            fv = f.add(null);
            fv.setID(m_vOrdenRemito[idx].oc_id);
            fv.setKey(KIPR_OC_ID);

            fv = f.add(null);
            fv.setValue(m_vOrdenRemito[idx].docNombre);
            fv.setKey(KIPR_DOC);

            fv = f.add(null);
            fv.setValue(m_vOrdenRemito[idx].nroDoc);
            fv.setKey(KIPR_NRODOC);

            fv = f.add(null);
            if(m_vOrdenRemito[idx].fecha === Cairo.Constants.cSNODATE) {
              fv.setValue("");
            }
            else {
              fv.setValue(m_vOrdenRemito[idx].fecha);
            }
            fv.setKey(KIPR_FECHA);

            fv = f.add(null);
            fv.setValue(m_vOrdenRemito[idx].pendiente);
            fv.setKey(KIPR_PENDIENTE);

            fv = f.add(null);
            fv.setValue(m_vOrdenRemito[idx].vAplicaciones[i].Aplicado);
            fv.setKey(KIPR_APLICADO);

            fv = f.add(null);
            fv.setValue(m_vOrdenRemito[idx].vAplicaciones[i].Aplicado);
            fv.setKey(KIPR_APLICADO2);

            row = f;
            row.setBackColor(&HFFCC99);
          }
        }
      };

      var itemSetAplicItemsAux2 = function(i, iProp) { // TODO: Use of ByRef founded Private Sub itemSetAplicItemsAux2(ByVal i As Long, ByRef iProp As cIABMProperty)
        var f = null;
        var fv = null;

        if(m_vOrdenRemito[i].pendiente <= 0) { return; }

        f = iProp.getGrid().getRows().add(null);

        fv = f.add(null);
        fv.setID(i);
        fv.setKey(KIPR_IDX1);

        fv = f.add(null);
        fv.setID(0);
        fv.setKey(KIPR_IDX2);

        fv = f.add(null);
        fv.setID(NO_ID);
        fv.setKey(KIPR_RCFC_ID);

        fv = f.add(null);
        fv.setID(NO_ID);
        fv.setKey(KIPR_OCFC_ID);

        fv = f.add(null);
        fv.setID(m_vOrdenRemito[i].rci_id);
        fv.setKey(KIPR_RCI_ID);

        fv = f.add(null);
        fv.setID(m_vOrdenRemito[i].rc_id);
        fv.setKey(KIPR_RC_ID);

        fv = f.add(null);
        fv.setID(m_vOrdenRemito[i].oci_id);
        fv.setKey(KIPR_OCI_ID);

        fv = f.add(null);
        fv.setID(m_vOrdenRemito[i].oci_id);
        fv.setKey(KIPR_OC_ID);

        fv = f.add(null);
        fv.setValue(m_vOrdenRemito[i].docNombre);
        fv.setKey(KIPR_DOC);

        fv = f.add(null);
        fv.setValue(m_vOrdenRemito[i].nroDoc);
        fv.setKey(KIPR_NRODOC);

        fv = f.add(null);
        if(m_vOrdenRemito[i].fecha === Cairo.Constants.cSNODATE) {
          fv.setValue("");
        }
        else {
          fv.setValue(m_vOrdenRemito[i].fecha);
        }
        fv.setKey(KIPR_FECHA);

        fv = f.add(null);
        fv.setValue(m_vOrdenRemito[i].pendiente);
        fv.setKey(KIPR_PENDIENTE);

        fv = f.add(null);
        fv.setValue(0);
        fv.setKey(KIPR_APLICADO);

        fv = f.add(null);
        fv.setValue(0);
        fv.setKey(KIPR_APLICADO2);
      };

      var itemAddToAplic = function(vAplicaciones, importe, idx) { // TODO: Use of ByRef founded Private Function itemAddToAplic(ByRef vAplicaciones() As T_ItAplic, ByVal Importe As Double, ByVal Idx As Long) As Double
        var i = null;
        var rtn = null;

        if(idx === 0) {
          G.redimPreserve(vAplicaciones, vAplicaciones.Length + 1);
          idx = vAplicaciones.Length;
          vAplicaciones.fci_id = m_fciId;
        }

        vAplicaciones(idx).Aplicado = importe;

        for(i = 1; i <= vAplicaciones.Length; i++) {
          rtn = rtn + vAplicaciones(i).Aplicado;
        }

        return rtn;
      };

      var itemGetItemsItemsProperty = function() {
        return m_dialog.getProperties().item(C_ITEMS);
      };

      var itemGetItemsOrdenRemitoProperty = function() {
        return m_dialog.getProperties().item(C_APLIC_ORDEN_REMITO);
      };

      var itemGetItemsOrdenRemito = function() {
        return m_dialog.getProperties().item(C_APLIC_ORDEN_REMITO).getGrid();
      };

      var itemColBEditOrdenRemito = function(property, lRow, lCol, iKeyAscii) { // TODO: Use of ByRef founded Private Function itemColBEditOrdenRemito(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long, ByVal iKeyAscii As Integer)
        switch (cABMUtil.pGetKeyFromCol(property.getGrid().getColumns(), lCol)) {
          case KIPR_APLICADO:
            break;

          default:
            return null;
            break;
        }

        return true;
      };

      var itemGetItemPendiente = function() {
        var iProp = null;
        iProp = m_dialog.getProperties().item(C_ITEMS);
        return getCell(iProp.getGrid().getRows().item(iProp.getSelectedIndex()), KII_PENDIENTE);
      };

      var itemGetItemAplicado = function() {
        var iProp = null;
        iProp = m_dialog.getProperties().item(C_ITEMS);
        return getCell(iProp.getGrid().getRows().item(iProp.getSelectedIndex()), KII_APLICADO2);
      };

      var itemColAUpdateOrdenRemito = function(property, lRow, lCol) { // TODO: Use of ByRef founded Private Function itemColAUpdateOrdenRemito(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long)
        var row = null;
        var maxVal = null;
        var bVisible = null;
        var pendiente = null;

        var w_grid = property.getGrid();
        switch (w_grid.getColumns(lCol).Key) {
          case KIPR_APLICADO:
            row = w_grid.getRows().item(lRow);

            var w_pCell = getCell(row, KIPR_APLICADO);

            pendiente = Cairo.Util.val(itemGetItemPendiente().getValue()) + cellFloat(row, KIPR_APLICADO2);
            maxVal = cellFloat(row, KIPR_PENDIENTE) + cellFloat(row, KIPR_APLICADO2);

            if(maxVal > pendiente) {
              maxVal = pendiente;
            }

            if(Cairo.Util.val(w_pCell.getValue()) > maxVal) {
              w_pCell.setValue(maxVal);
            }
            else if(Cairo.Util.val(w_pCell.getValue()) < 0) {
              w_pCell.setValue(0);
            }

            var aplicado = null;
            aplicado = itemGetAplicado();
            itemRefreshItem(aplicado);
            itemGetItemAplicado().setValue(aplicado);

            // Actulizo el pendiente
            var w_pCell = getCell(row, KIPR_PENDIENTE);
            w_pCell.setValue(Cairo.Util.val(w_pCell.getValue()) + cellFloat(row, KIPR_APLICADO2) - cellFloat(row, KIPR_APLICADO));
            getCell(row, KIPR_APLICADO2).setValue(getCell(row, KIPR_APLICADO).getValue());
            break;
        }

        return true;
      };

      var itemGetAplicado = function() {
        var row = null;
        var rtn = null;

        var _count = m_dialog.getProperties().item(C_APLIC_ORDEN_REMITO).getGrid().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = m_dialog.getProperties().item(C_APLIC_ORDEN_REMITO).getGrid().getRows().item(_i);
          rtn = rtn + cellFloat(row, KIPR_APLICADO);
        }
        return rtn;
      };

      var itemRefreshItem = function(aplicado) {
        var iProp = null;
        var row = null;
        var aplicadoActual = null;

        iProp = m_dialog.getProperties().item(C_ITEMS);
        row = iProp.getGrid().getRows().item(m_lastRowItem);

        getCell(row, KII_APLICADO).setValue(aplicado);
        aplicadoActual = cellFloat(row, KII_APLICADO2);

        var w_pCell = getCell(row, KII_PENDIENTE);
        w_pCell.setValue(w_pCell.getValue() - (aplicado - aplicadoActual));

        getCell(row, KII_APLICADO2).setValue(aplicado);

        m_dialog.ShowCellValue(iProp, m_lastRowItem, cABMUtil.pGetColFromKey(iProp.getGrid().getColumns(), KII_PENDIENTE));
        m_dialog.ShowCellValue(iProp, m_lastRowItem, cABMUtil.pGetColFromKey(iProp.getGrid().getColumns(), KII_APLICADO));
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

                if(m_vOrdenRemito[i].vAplicaciones[j].Aplicado > 0) {

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

      //////////////////////////////////////////////////////////////////////////////////////
      //
      //   COBRANZAS / NOTAS DE CREDITO
      //
      //////////////////////////////////////////////////////////////////////////////////////

      var ordenPagoLoadAplicVtos = function() {

        if(!ordenPagoLoadAplicAplicados()) { return false; }
        if(!ordenPagoLoadAplicCreditos()) { return false; }

        return true;
      };

      var ordenPagoLoadAplicAplicados = function() {
        var sqlstmt = null;
        var rs = null;
        var cotizacion = null;
        var i = null;
        var idx = null;

        sqlstmt = "sp_DocFacturaCompraGetAplic "+ Cairo.Company.getId().toString()+ ","+ m_fcId+ ",2";
        if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadAplicAplicados", C_MODULE)) { return false; }

        G.redim(m_vOpgNC, 0);
        G.redimPreserve(0, .vAplicaciones);

        if(!rs.isEOF()) {

          rs.MoveLast;
          rs.MoveFirst;

          while (!rs.isEOF()) {

            i = ordenPagoAddToCreditos(Cairo.Database.valField(rs.getFields(), CT.OPG_ID), Cairo.Database.valField(rs.getFields(), CT.FCD_ID), Cairo.Database.valField(rs.getFields(), CT.FCP_ID), idx);

            // Documento
            //
            m_vOpgNC[i].docNombre = Cairo.Database.valField(rs.getFields(), CC.DOC_NAME);
            m_vOpgNC[i].nroDoc = Cairo.Database.valField(rs.getFields(), "nrodoc");

            // Pendiente
            //
            m_vOpgNC[i].pendiente = Cairo.Database.valField(rs.getFields(), "Pendiente");
            m_vOpgNC[i].pendienteActual = m_vOpgNC[i].pendiente;

            // Factura o Nota de credito
            //
            m_vOpgNC[i].fc_id = Cairo.Database.valField(rs.getFields(), CC.FC_ID);

            m_vOpgNC[i].fcp_id = Cairo.Database.valField(rs.getFields(), "fcp_id2");
            m_vOpgNC[i].fcd_id = Cairo.Database.valField(rs.getFields(), "fcd_id2");

            // OrdenPago
            //
            m_vOpgNC[i].opg_id = Cairo.Database.valField(rs.getFields(), CT.OPG_ID);
            m_vOpgNC[i].fecha = Cairo.Database.valField(rs.getFields(), CT.OPG_FECHA);
            m_vOpgNC[i].cotizacion = Cairo.Database.valField(rs.getFields(), CT.FC_OPG_COTIZACION);

            // Aplicaciones

            vAplicaciones.fcopg_id = Cairo.Database.valField(rs.getFields(), CT.FC_OPG_ID);
            vAplicaciones.fcnc_id = Cairo.Database.valField(rs.getFields(), CT.FC_NC_ID);

            vAplicaciones.fcp_id = Cairo.Database.valField(rs.getFields(), CT.FCP_ID);
            vAplicaciones.fcd_id = Cairo.Database.valField(rs.getFields(), CT.FCD_ID);

            vAplicaciones.Aplicado = Cairo.Database.valField(rs.getFields(), "Aplicado");

            // Aplicacion total sobre este credito
            m_vOpgNC[i].aplicado = m_vOpgNC[i].aplicado + m_vOpgNC[i].vAplicaciones(idx).Aplicado;
            m_vOpgNC[i].aplicadoActual = m_vOpgNC[i].aplicado;

            rs.MoveNext;
          }
        }

        return true;
      };

      var loadVencimientos = function(propiedad) { // TODO: Use of ByRef founded Private Function ordenPagoLoadVencimientos(ByRef Propiedad As cIABMProperty) As Boolean
        var sqlstmt = null;
        var rs = null;
        var grid = null;
        var cotizacion = null;

        sqlstmt = "sp_DocFacturaCompraGetAplic "+ Cairo.Company.getId().toString()+ ","+ m_fcId+ ",1";
        if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadAplic", C_MODULE)) { return false; }

        propiedad.getGrid().getColumns().clear();
        propiedad.getGrid().getRows().clear();

        grid = propiedad.getGrid();

        var w_columns = grid.getColumns();
        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIV_FCD_ID);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIV_FCP_ID);

        var elem = w_columns.add(null);
        elem.setName(getText(1569, "")); // Fecha
        elem.setType(Dialogs.PropertyType.date);
        elem.setKey(KIV_FECHA);

        var elem = w_columns.add(null);
        elem.setName(getText(1609, "")); // Pendiente
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIV_PENDIENTE);

        var elem = w_columns.add(null);
        elem.setName(getText(1608, "")); // Aplicado
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIV_APLICADO);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIV_APLICADO2);

        var f = null;
        var fv = null;

        while (!rs.isEOF()) {

          f = propiedad.getGrid().getRows().add(null);

          fv = f.add(null);
          fv.setID(Cairo.Database.valField(rs.getFields(), CT.FCD_ID));
          fv.setKey(KIV_FCD_ID);

          fv = f.add(null);
          fv.setID(Cairo.Database.valField(rs.getFields(), CT.FCP_ID));
          fv.setKey(KIV_FCP_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(rs.getFields(), "Fecha"));
          fv.setKey(KIV_FECHA);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(rs.getFields(), "Pendiente"));
          fv.setKey(KIV_PENDIENTE);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(rs.getFields(), "Importe"));
          fv.setKey(KIV_APLICADO);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(rs.getFields(), "Importe"));
          fv.setKey(KIV_APLICADO2);

          rs.MoveNext;
        }

        return true;
      };

      var ordenPagoLoadAplicCreditos = function() {
        var sqlstmt = null;
        var rs = null;
        var cotizacion = null;
        var i = null;

        sqlstmt = "sp_DocFacturaCompraGetAplic "+ Cairo.Company.getId().toString()+ ","+ m_fcId+ ",3";
        if(!Cairo.Database.openRs(sqlstmt, rs, csTypeCursor.cSRSSTATIC, csTypeLock.cSLOCKREADONLY, csCommandType.cSCMDTEXT, "pLoadAplicCreditos", C_MODULE)) { return false; }

        if(!rs.isEOF()) {

          rs.MoveLast;
          rs.MoveFirst;

          i = m_vOpgNC.Length;
          G.redimPreserve(m_vOpgNC, i + rs.RecordCount);

          while (!rs.isEOF()) {

            i = i + 1;
            m_vOpgNC[i].opg_id = Cairo.Database.valField(rs.getFields(), CT.OPG_ID);
            m_vOpgNC[i].fc_id = Cairo.Database.valField(rs.getFields(), CC.FC_ID);
            m_vOpgNC[i].fcd_id = Cairo.Database.valField(rs.getFields(), CT.FCD_ID);

            m_vOpgNC[i].docNombre = Cairo.Database.valField(rs.getFields(), CC.DOC_NAME);
            m_vOpgNC[i].nroDoc = Cairo.Database.valField(rs.getFields(), "nroDoc");

            m_vOpgNC[i].fecha = Cairo.Database.valField(rs.getFields(), "fecha");
            m_vOpgNC[i].pendiente = Cairo.Database.valField(rs.getFields(), "pendiente");
            m_vOpgNC[i].pendienteActual = m_vOpgNC[i].pendiente;

            m_vOpgNC[i].cotizacion = Cairo.Database.valField(rs.getFields(), CT.FC_OPG_COTIZACION);

            G.redim(m_vOpgNC[i].vAplicaciones, 0);

            rs.MoveNext;
          }
        }

        return true;
      };

      var setGridAplicOrdenPago = function(propiedad) { // TODO: Use of ByRef founded Private Function ordenPagoSetGridAplicOrdenPago(ByRef Propiedad As cIABMProperty) As Boolean
        var grid = null;

        propiedad.getGrid().getColumns().clear();
        propiedad.getGrid().getRows().clear();

        grid = propiedad.getGrid();

        var w_columns = grid.getColumns();
        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_IDX1);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_IDX2);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_FCOPG_ID);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_FCNC_ID);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_OPG_ID);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_FC_ID);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_FCD_ID);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_FCP_ID);

        var elem = w_columns.add(null);
        elem.setName(getText(1567, "")); // Documento
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIC_DOC);

        var elem = w_columns.add(null);
        elem.setName(getText(1610, "")); // Comprobante
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIC_NRODOC);

        var elem = w_columns.add(null);
        elem.setName(getText(1569, "")); // Fecha
        elem.setType(Dialogs.PropertyType.date);
        elem.setKey(KIC_FECHA);

        var elem = w_columns.add(null);
        elem.setName(getText(1609, "")); // Pendiente
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIC_PENDIENTE);

        var elem = w_columns.add(null);
        elem.setName(getText(1608, "")); // Aplicado
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIC_APLICADO);

        var elem = w_columns.add(null);
        elem.setName(getText(1650, "")); // Cotiz.
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(m_generalConfig.getFormatDecCotizacion());
        elem.setKey(KIC_COTIZACION);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_APLICADO2);

        return true;
      };

      var ordenPagoAddToCreditos = function(opgId, fcdId, fcpId, idx) { // TODO: Use of ByRef founded Private Function ordenPagoAddToCreditos(ByVal OpgId As Long, ByVal FcdId As Long, ByVal FcpId As Long, ByRef Idx As Long) As Long
        var _rtn = 0;
        var i = null;

        for(i = 1; i <= m_vOpgNC.Length; i++) {
          if((m_vOpgNC[i].opg_id === opgId && opgId !== NO_ID) || (m_vOpgNC[i].fcd_id === fcdId && fcdId !== NO_ID) || (m_vOpgNC[i].fcp_id === fcpId && fcpId !== NO_ID)) {

            G.redimPreserve(m_vOpgNC[i].vAplicaciones, m_vOpgNC[i].vAplicaciones.Length + 1);

            idx = m_vOpgNC[i].vAplicaciones.Length;
            _rtn = i;
            return _rtn;
          }
        }

        G.redimPreserve(m_vOpgNC, m_vOpgNC.Length + 1);
        G.redimPreserve(m_vOpgNC.Length, .vAplicaciones);
        _rtn = m_vOpgNC.Length;
        idx = 1;

        return _rtn;
      };

      var ordenPagoSetAplicVtos = function(iProp, fcd_id, fcp_id) { // TODO: Use of ByRef founded Private Function ordenPagoSetAplicVtos(ByRef iProp As cIABMProperty, ByVal fcd_id As Long, ByVal fcp_id As Long) As Boolean
        var cotizacion = null;
        var i = null;
        var j = null;

        iProp.getGrid().getRows().clear();

        m_fcdId = fcd_id;
        m_fcpId = fcp_id;

        for(i = 1; i <= m_vOpgNC.Length; i++) {

          if(m_vOpgNC[i].vAplicaciones.Length > 0) {
            ordenPagoSetAplicVtosAux1(i, iProp, fcd_id, fcp_id);
          }
          else {
            ordenPagoSetAplicVtosAux2(i, iProp);
          }

        }

        // Ahora los creditos que tienen aplicaciones
        // pero no estan con este vencimiento y tienen pendiente
        var id = null;
        var bAplic = null;
        var row = null;

        for(i = 1; i <= m_vOpgNC.Length; i++) {

          bAplic = false;

          var _count = iProp.getGrid().getRows().size();
          for(var _j = 0; _j < _count; _j++) {
            row = iProp.getGrid().getRows().item(_j);
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

            for(j = 1; j <= m_vOpgNC[i].vAplicaciones.Length; j++) {

              id = getCell(row, KIC_FCD_ID).getId();
              if(id === m_vOpgNC[i].vAplicaciones(j).fcd_id && id !== NO_ID) {
                bAplic = true;
                break;
              }

              id = getCell(row, KIC_FCP_ID).getId();
              if(id === m_vOpgNC[i].vAplicaciones(j).fcp_id && id !== NO_ID) {
                bAplic = true;
                break;
              }
            }

            if(bAplic) { break; }
          }

          if(!bAplic) { ordenPagoSetAplicVtosAux2(i, iProp); }

        }

        return true;
      };

      var ordenPagoSetAplicVtosAux1 = function(idx, iProp, fcd_id, fcp_id) { // TODO: Use of ByRef founded Private Sub ordenPagoSetAplicVtosAux1(ByVal Idx As Long, ByRef iProp As cIABMProperty, ByVal fcd_id As Long, ByVal fcp_id As Long)

        var f = null;
        var fv = null;
        var i = null;
        var iPropVto = null;

        for(i = 1; i <= m_vOpgNC[idx].vAplicaciones.Length; i++) {

          if((m_vOpgNC[idx].vAplicaciones[i].fcd_id === fcd_id && fcd_id !== NO_ID) || (m_vOpgNC[idx].vAplicaciones[i].fcp_id === fcp_id && fcp_id !== NO_ID)) {

            f = iProp.getGrid().getRows().add(null);

            fv = f.add(null);
            fv.setID(idx);
            fv.setKey(KIC_IDX1);

            fv = f.add(null);
            fv.setID(i);
            fv.setKey(KIC_IDX2);

            fv = f.add(null);
            fv.setID(m_vOpgNC[idx].vAplicaciones[i].fcopg_id);
            fv.setKey(KIC_FCOPG_ID);

            fv = f.add(null);
            fv.setID(m_vOpgNC[idx].vAplicaciones[i].fcnc_id);
            fv.setKey(KIC_FCNC_ID);

            fv = f.add(null);
            fv.setID(m_vOpgNC[idx].opg_id);
            fv.setKey(KIC_OPG_ID);

            fv = f.add(null);
            fv.setID(m_vOpgNC[idx].fc_id);
            fv.setKey(KIC_FC_ID);

            fv = f.add(null);
            fv.setID(m_vOpgNC[idx].vAplicaciones[i].fcd_id);
            fv.setKey(KIC_FCD_ID);

            fv = f.add(null);
            fv.setID(m_vOpgNC[idx].vAplicaciones[i].fcp_id);
            fv.setKey(KIC_FCP_ID);

            fv = f.add(null);
            fv.setValue(m_vOpgNC[idx].docNombre);
            fv.setKey(KIC_DOC);

            fv = f.add(null);
            fv.setValue(m_vOpgNC[idx].nroDoc);
            fv.setKey(KIC_NRODOC);

            fv = f.add(null);
            if(m_vOpgNC[idx].fecha === Cairo.Constants.cSNODATE) {
              fv.setValue("");
            }
            else {
              fv.setValue(m_vOpgNC[idx].fecha);
            }
            fv.setKey(KIC_FECHA);

            fv = f.add(null);
            fv.setValue(m_vOpgNC[idx].pendiente);
            fv.setKey(KIC_PENDIENTE);

            fv = f.add(null);
            fv.setValue(m_vOpgNC[idx].vAplicaciones[i].Aplicado);
            fv.setKey(KIC_APLICADO);

            fv = f.add(null);
            if(m_vOpgNC[idx].cotizacion !== 0) {
              fv.setValue(m_vOpgNC[idx].cotizacion);
            }
            fv.setKey(KIC_COTIZACION);

            fv = f.add(null);
            fv.setValue(m_vOpgNC[idx].vAplicaciones[i].Aplicado);
            fv.setKey(KIC_APLICADO2);
          }
        }
      };

      var ordenPagoSetAplicVtosAux2 = function(i, iProp) { // TODO: Use of ByRef founded Private Sub ordenPagoSetAplicVtosAux2(ByVal i As Long, ByRef iProp As cIABMProperty)
        var f = null;
        var fv = null;

        if(m_vOpgNC[i].pendiente <= 0) { return; }

        f = iProp.getGrid().getRows().add(null);

        fv = f.add(null);
        fv.setID(i);
        fv.setKey(KIC_IDX1);

        fv = f.add(null);
        fv.setID(0);
        fv.setKey(KIC_IDX2);

        fv = f.add(null);
        fv.setID(NO_ID);
        fv.setKey(KIC_FCOPG_ID);

        fv = f.add(null);
        fv.setID(NO_ID);
        fv.setKey(KIC_FCNC_ID);

        fv = f.add(null);
        fv.setID(m_vOpgNC[i].opg_id);
        fv.setKey(KIC_OPG_ID);

        fv = f.add(null);
        fv.setID(m_vOpgNC[i].fc_id);
        fv.setKey(KIC_FC_ID);

        fv = f.add(null);
        fv.setID(m_vOpgNC[i].fcd_id);
        fv.setKey(KIC_FCD_ID);

        fv = f.add(null);
        fv.setID(NO_ID);
        fv.setKey(KIC_FCP_ID);

        fv = f.add(null);
        fv.setValue(m_vOpgNC[i].docNombre);
        fv.setKey(KIC_DOC);

        fv = f.add(null);
        fv.setValue(m_vOpgNC[i].nroDoc);
        fv.setKey(KIC_NRODOC);

        fv = f.add(null);
        if(m_vOpgNC[i].fecha === Cairo.Constants.cSNODATE) {
          fv.setValue("");
        }
        else {
          fv.setValue(m_vOpgNC[i].fecha);
        }
        fv.setKey(KIC_FECHA);

        fv = f.add(null);
        fv.setValue(m_vOpgNC[i].pendiente);
        fv.setKey(KIC_PENDIENTE);

        fv = f.add(null);
        fv.setValue(0);
        fv.setKey(KIC_APLICADO);

        fv = f.add(null);
        fv.setKey(KIC_COTIZACION);

        fv = f.add(null);
        fv.setValue(0);
        fv.setKey(KIC_APLICADO2);
      };

      var ordenPagoUpdateAplicVtos = function(propiedad, fcd_id, fcp_id) { // TODO: Use of ByRef founded Private Function ordenPagoUpdateAplicVtos(ByRef Propiedad As cIABMProperty, ByVal fcd_id As Long, ByVal fcp_id As Long) As Double
        var cotizacion = null;
        var i = null;
        var j = null;
        var row = null;
        var aplicado = null;
        var aplicadoTotal = null;

        var _count = ordenPagoGetItemsOrdenPago().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = ordenPagoGetItemsOrdenPago().getRows().item(_i);

          if(cellFloat(row, KIC_APLICADO) > 0 || getCell(row, KIC_IDX2).getId() !== 0) {

            i = getCell(row, KIC_IDX1).getId();
            j = getCell(row, KIC_IDX2).getId();

            aplicado = cellFloat(row, KIC_APLICADO);
            aplicadoTotal = aplicadoTotal + aplicado;

            m_vOpgNC[i].aplicado = ordenPagoAddToAplic(m_vOpgNC[i].vAplicaciones, aplicado, j);
            m_vOpgNC[i].pendiente = m_vOpgNC[i].pendienteActual - (m_vOpgNC[i].aplicado - m_vOpgNC[i].aplicadoActual);
          }
        }

        return aplicadoTotal;
      };

      var ordenPagoAddToAplic = function(vAplicaciones, importe, idx) { // TODO: Use of ByRef founded Private Function ordenPagoAddToAplic(ByRef vAplicaciones() As T_Aplic, ByVal Importe As Double, ByVal Idx As Long) As Double
        var i = null;
        var rtn = null;

        if(idx === 0) {
          G.redimPreserve(vAplicaciones, vAplicaciones.Length + 1);
          idx = vAplicaciones.Length;
          vAplicaciones.fcd_id = m_fcdId;
          vAplicaciones.fcp_id = m_fcpId;
        }

        vAplicaciones(idx).Aplicado = importe;

        for(i = 1; i <= vAplicaciones.Length; i++) {
          rtn = rtn + vAplicaciones(i).Aplicado;
        }

        return rtn;
      };

      var ordenPagoGetVtoPendiente = function() {
        var iProp = null;
        iProp = m_dialog.getProperties().item(C_VENCIMIENTOS);
        return getCell(iProp.getGrid().getRows().item(iProp.getSelectedIndex()), KIV_PENDIENTE);
      };

      var ordenPagoGetVtoAplicado = function() {
        var iProp = null;
        iProp = m_dialog.getProperties().item(C_VENCIMIENTOS);
        return getCell(iProp.getGrid().getRows().item(iProp.getSelectedIndex()), KIV_APLICADO2);
      };

      var ordenPagoColAUpdateOrdenPago = function(property, lRow, lCol) { // TODO: Use of ByRef founded Private Function ordenPagoColAUpdateOrdenPago(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long)
        var row = null;
        var maxVal = null;
        var bVisible = null;
        var pendiente = null;

        var w_grid = property.getGrid();
        switch (w_grid.getColumns(lCol).Key) {
          case KIC_APLICADO:
            row = w_grid.getRows().item(lRow);

            var w_pCell = getCell(row, KIC_APLICADO);

            pendiente = Cairo.Util.val(ordenPagoGetVtoPendiente().getValue()) + cellFloat(row, KIC_APLICADO2);
            maxVal = cellFloat(row, KIC_PENDIENTE) + cellFloat(row, KIC_APLICADO2);

            if(maxVal > pendiente) {
              maxVal = pendiente;
            }

            if(Cairo.Util.val(w_pCell.getValue()) > maxVal) {
              w_pCell.setValue(maxVal);
            }
            else if(Cairo.Util.val(w_pCell.getValue()) < 0) {
              w_pCell.setValue(0);
            }

            var aplicado = null;
            aplicado = ordenPagoGetAplicado();
            ordenPagoRefreshVto(aplicado);
            ordenPagoGetVtoAplicado().setValue(aplicado);

            // Actulizo el pendiente
            var w_pCell = getCell(row, KIC_PENDIENTE);
            w_pCell.setValue(Cairo.Util.val(w_pCell.getValue()) + cellFloat(row, KIC_APLICADO2) - cellFloat(row, KIC_APLICADO));
            getCell(row, KIC_APLICADO2).setValue(getCell(row, KIC_APLICADO).getValue());

            ordenPagoShowPendienteOrdenPago();
            break;
        }

        return true;
      };

      var ordenPagoGetAplicado = function() {
        var row = null;
        var rtn = null;

        var _count = m_dialog.getProperties().item(C_APLICORDENPAGO).getGrid().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = m_dialog.getProperties().item(C_APLICORDENPAGO).getGrid().getRows().item(_i);
          rtn = rtn + cellFloat(row, KIC_APLICADO);
        }
        return rtn;
      };

      var ordenPagoRefreshVto = function(aplicado) {
        var iProp = null;
        var row = null;
        var aplicadoActual = null;

        iProp = m_dialog.getProperties().item(C_VENCIMIENTOS);
        row = iProp.getGrid().getRows().item(m_lastRowVto);

        getCell(row, KIV_APLICADO).setValue(aplicado);
        aplicadoActual = cellFloat(row, KIV_APLICADO2);

        var w_pCell = getCell(row, KIV_PENDIENTE);
        w_pCell.setValue(w_pCell.getValue() - (aplicado - aplicadoActual));

        getCell(row, KIV_APLICADO2).setValue(aplicado);

        m_dialog.ShowCellValue(iProp, m_lastRowVto, cABMUtil.pGetColFromKey(iProp.getGrid().getColumns(), KIV_PENDIENTE));
        m_dialog.ShowCellValue(iProp, m_lastRowVto, cABMUtil.pGetColFromKey(iProp.getGrid().getColumns(), KIV_APLICADO));
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

      var ordenPagoColBEditOrdenPago = function(property, lRow, lCol, iKeyAscii) { // TODO: Use of ByRef founded Private Function ordenPagoColBEditOrdenPago(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long, ByVal iKeyAscii As Integer)
        switch (cABMUtil.pGetKeyFromCol(property.getGrid().getColumns(), lCol)) {
          // Facturas
          case KIC_APLICADO:
            break;

          case KIC_COTIZACION:
            if(cellVal(property.getGrid().getRows().item(lRow), KIC_COTIZACION) === "") {
              return null;
            }
            break;

          default:
            return null;
            break;
        }

        return true;
      };

      var ordenPagoShowPendienteOrdenPago = function() {
        var row = null;
        var total = null;

        var _count = ordenPagoGetItemsVtosProperty().getGrid().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = ordenPagoGetItemsVtosProperty().getGrid().getRows().item(_i);
          total = total + cellFloat(row, KIV_PENDIENTE);
        }

        ordenPagoGetPendienteOrdenPago().setValue(total);

        m_dialog.showValue(ordenPagoGetPendienteOrdenPago());
      };

      var ordenPagoGetPendienteOrdenPago = function() {
        return m_dialog.getProperties().item(C_PENDIENTE_ORDEN_PAGO);
      };

      var ordenPagoUpdateGrids = function() {
        var _rtn = 0;
        var iProp = null;
        var row = null;

        iProp = m_dialog.getProperties().item(C_VENCIMIENTOS);

        if(m_lastRowVto !== 0) {

          row = iProp.getGrid().getRows().item(m_lastRowVto);
          _rtn = ordenPagoUpdateAplicVtos(m_dialog.getProperties().item(C_APLICORDENPAGO), getCell(row, KIV_FCD_ID).getId(), getCell(row, KIV_FCP_ID).getId());
        }

        return _rtn;
      };

      var ordenPagoSaveNotaCredito = function(mainRegister) {
        var transaction = DB.createTransaction();

        transaction.setTable(CC.ORDEN_FACTURA_COMPRA_TMP);

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

        transaction.setTable(CC.ORDEN_PAGO_TMP);

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

        for(var i = 1, count = m_vOpgNC.length; i < count; i += 1) {

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

        fields.add(CC.CUE_ID, m_ctaCteCueId, Types.id);
        fields.add(CT.OPGI_IMPORTE_ORIGEN, aplic.importeOrigen, Types.currency);
        fields.add(CT.OPGI_IMPORTE, aplic.importe, Types.currency);

        fields.add(CT.OPGI_ORDEN, 1, Types.integer);
        fields.add(CT.OPGI_TIPO, CT.OrdenPagoItemTipo.ITEM_CTA_CTE, Types.integer);
        fields.add(CT.OPGI_ID, id, Types.long);
        fields.add(CT.OPGI_OTRO_TIPO, csEOrdenPagoItemOtroTipo.csEOtroHaber, Types.integer);

        register.getFields().setHaveLastUpdate(false);
        register.getFields().setHaveWhoModify(false);

        if(!Cairo.Database.save(register, , "pSaveCtaCte", C_MODULE, SAVE_ERROR_MESSAGE)) { return false; }

        return true;
      };

      var ordenPagoGetAplic = function(aplic, cotizacion) {
        var importes = {
          importe: aplic,
          importeOrigen: 0
        };

        if(m_monIdXCuenta !== m_monDefault) {
          importes.importeOrigen = aplic * cotizacion;
        }

        return importes;
      };

      var ordenPagoGetMonIdForCueId = function(cueId) {
        var _rtn = 0;
        try {

          var sqlstmt = null;
          var rs = null;

          sqlstmt = "select mon_id from Cuenta where cue_id = "+ cueId.toString();

          if(!Cairo.Database.openRs(sqlstmt, rs)) { return _rtn; }

          if(rs.isEOF()) { return _rtn; }

          _rtn = Cairo.Database.valField(rs.getFields(), CC.MON_ID);

          
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "pGetMonIdForCueId", C_MODULE, "");
          
        }
        

        return _rtn;
      };

      // TODO: obtener este dato en el sp que obtiene los creditos
      //
      var ordenPagoGetCotizacionPago = function(opgId, cotizacion) { // TODO: Use of ByRef founded Private Function ordenPagoGetCotizacionPago(ByVal OpgId As Long, ByRef Cotizacion As Double) As Boolean
        var _rtn = null;
        try {

          var sqlstmt = null;
          var rs = null;

          sqlstmt = "select opg_cotizacion from OrdenPago where opg_id = "+ opgId.toString();

          if(!Cairo.Database.openRs(sqlstmt, rs)) { return _rtn; }

          if(rs.isEOF()) { return _rtn; }

          cotizacion = Cairo.Database.valField(rs.getFields(), CT.OPG_COTIZACION);

          _rtn = true;

          
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "pGetCotizacionPago", C_MODULE, "");
          
        }
        

        return _rtn;
      };

      var ordenPagoGetCueIdFactura = function(cueIdFactura) { // TODO: Use of ByRef founded Private Function ordenPagoGetCueIdFactura(ByRef CueIdFactura As Long) As Boolean
        var _rtn = null;
        try {

          var sqlstmt = null;
          var rs = null;

          sqlstmt = "sp_DocFacturaCompraGetCueDeudor "+ m_fcId;

          if(!Cairo.Database.openRs(sqlstmt, rs)) { return _rtn; }

          if(rs.isEOF()) { return _rtn; }

          cueIdFactura = Cairo.Database.valField(rs.getFields(), CC.CUE_ID);

          _rtn = true;

          
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "pOPGetCueIdFactura", C_MODULE, "");
          
        }
        

        return _rtn;
      };

      //////////////////////////////////////////////////////////////////////////////////////
      //
      //   construccion - destruccion
      //
      //////////////////////////////////////////////////////////////////////////////////////
      self.initialize = function() {
        try {

            SAVE_ERROR_MESSAGE = getText(1907, ""); // Error al grabar la factura de Compra

          m_generalConfig = new cGeneralConfig();
          m_generalConfig.Load;

          G.redim(m_vOpgNC, 0);
          G.redimPreserve(0, .vAplicaciones);

          m_monDefault = GetMonedaDefault();

          
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "Class_Initialize", C_MODULE, "");
          
        }
        
      };

      self.destroy = function() {
        try {

          m_dialog = null;
          m_generalConfig = null;

          G.redim(m_vOpgNC, 0);
          G.redim(m_vOrdenRemito, 0);

          
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "Class_Terminate", C_MODULE, "");
          
        }
        
      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

}());