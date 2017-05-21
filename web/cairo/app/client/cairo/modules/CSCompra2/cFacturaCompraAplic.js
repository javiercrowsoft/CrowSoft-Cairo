(function() {
  "use strict";

  Cairo.module("FacturaCompraAplic.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

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

      var K_PENDIENTE_ORDENPAGO = 10;
      var K_TOTAL_ORDENPAGO = 11;
      var K_VENCIMIENTOS = 12;
      var K_APLIC_ORDENPAGO = 13;
      var C_VENCIMIENTOS = "Vencimientos";
      var C_APLICORDENPAGO = "AplicCobr";
      var C_PENDIENTEORDENPAGO = "PendienteCob";
      var C_TOTALORDENPAGO = "TotalCob";

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
      var C_APLICORDENREMITO = "AplicOrdenRemito";

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
                    m_dialog.getProperties().item(C_APLICORDENREMITO),
                    getCell(row, KII_FCI_ID).getId(), getCell(row, KII_PR_ID).getId());
                  m_dialog.showValue(m_dialog.getProperties().item(C_APLICORDENREMITO), true);
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

        saveDocCpra(register);
        itemSaveOrdenRemito(register);

        // the applied amount is not editable if the payment condition is automatic
        //
        var p = isAutomatic()
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

                return load(result.data.getId()).then(
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
              ordenPagoLoadAplicVtos();
              itemLoadAplicItems();
            }
          });
        if(ordenPagoLoadAplicVtos()) { return _rtn; }
        if(itemLoadAplicItems()) { return _rtn; }
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
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "facturacompraaplic" + id;
      };

      self.getTitle = function() {
        var _rtn = "";
        // **TODO:** on error resume next found !!!
        //'Aplicación Factura de Compra
        _rtn = getText(1908, "");
        m_dialog.setTitle(m_fcNumero+ " - "+ m_proveedor);

        return _rtn;
      };

      self.validate = function() {
        return P.resolvedPromise(true);
      };

      //////////////////////////////////////////////////////////////////////////////////////
      //
      //   cIABMClientGrid_
      //
      //////////////////////////////////////////////////////////////////////////////////////

      var isEmptyRow = function(key, row, rowIndex) {
        return false;
      };

      var columnAfterUpdate = function(key, lRow, lCol) {
        var _rtn = null;
        try {
          switch (key) {
            case K_APLIC_ORDENPAGO:
              _rtn = ordenPagoColAUpdateOrdenPago(ordenPagoGetItemsOrdenPagoProperty(), lRow, lCol);
              break;

            case K_APLIC_ORDEN_REMITO:
              _rtn = itemColAUpdateOrdenRemito(itemGetItemsOrdenRemitoProperty(), lRow, lCol);
              break;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "columnAfterUpdate", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var columnAfterEdit = function(key, lRow, lCol, newValue, newValueID) {
        return true;
      };

      var columnBeforeEdit = function(key, lRow, lCol, iKeyAscii) {
        var _rtn = null;
        try {
          switch (key) {
            case K_APLIC_ORDENPAGO:
              _rtn = ordenPagoColBEditOrdenPago(ordenPagoGetItemsOrdenPagoProperty(), lRow, lCol, iKeyAscii);
              break;

            case K_APLIC_ORDEN_REMITO:
              _rtn = itemColBEditOrdenRemito(itemGetItemsOrdenRemitoProperty(), lRow, lCol, iKeyAscii);
              break;
          }
          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "columnBeforeEdit", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var columnButtonClick = function(key, lRow, lCol, iKeyAscii) {

      };

      var columnClick = function(key, lRow, lCol) {

      };

      var dblClick = function(key, lRow, lCol) {
        try {

          switch (key) {

            case K_APLIC_ORDENPAGO:

              var w_pOPGetItemsOrdenPago = ordenPagoGetItemsOrdenPago().getRows();
              if(getCell(w_pOPGetItemsOrdenPago.Item(lRow), KIC_OPG_ID).getId() === Cairo.Constants.NO_ID) {
                ShowDocAux(getCell(w_pOPGetItemsOrdenPago.Item(lRow), KIC_FC_ID).getId(), "CSCompra2.cFacturaCompra", "CSABMInterface2.cABMGeneric");
              }
              else {
                ShowDocAux(getCell(w_pOPGetItemsOrdenPago.Item(lRow), KIC_OPG_ID).getId(), "CSTesoreria2.cOrdenPago", "CSABMInterface2.cABMGeneric");
              }

              break;

            case K_APLIC_ORDEN_REMITO:

              var w_pItGetItemsOrdenRemito = itemGetItemsOrdenRemito().getRows();

              var id = null;
              var objEditName = null;

              id = getCell(w_pItGetItemsOrdenRemito.Item(lRow), KIPR_OCI_ID).getId();

              if(id !== Cairo.Constants.NO_ID) {
                if(!Cairo.Database.getData("OrdenCompraItem", "oci_id", id, "oc_id", id)) { return; }
                objEditName = "CSCompra2.cOrdenCompra";
              }
              else {
                id = getCell(w_pItGetItemsOrdenRemito.Item(lRow), KIPR_RCI_ID).getId();
                if(id !== Cairo.Constants.NO_ID) {
                  if(!Cairo.Database.getData("RemitoCompraItem", "rci_id", id, "rc_id", id)) { return; }
                  objEditName = "CSCompra2.cRemitoCompra";
                }
              }

              if(id !== Cairo.Constants.NO_ID) {

                ShowDocAux(id, objEditName, "CSABMInterface2.cABMGeneric");
              }

              break;
          }

          return;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "dblClick", C_MODULE, "");
        }
      };

      var deleteRow = function(key, row, lRow) {

      };

      var listAdHock = function(key, row, colIndex, list) {

      };

      var newRow = function(key, rows) {

      };

      var validateRow = function(key, row, rowIndex) {
        return true;
      };

      var edit = function() {
        return load().whenSuccess(function() {
          loadCollection();
          m_editing = true;
        });
      };

      var loadCollection = function() {
        var c = null;
        var oGrd = null;
        var objAbm = null;

        objAbm = m_dialog;

        objAbm.MinHeight = 7430;

        m_lastRowVto = 0;
        m_dialog.getProperties().clear();

        var w_tabs = m_dialog.getTabs();

        w_tabs.clear();

        var tab = w_tabs.add(null);
        //'Items
        tab.setName(getText(1371, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(1);
        //'Vencimientos
        tab.setName(getText(1644, ""));

        var properties = m_dialog.getProperties();
        c = properties.add(null, C_ITEMS);
        c.setType(Dialogs.PropertyType.grid);
        c.hideLabel();;
        if(!itemLoadItems(c)) { return false; }
        c.setKey(K_ITEMS);
        c.setName("Items");
        c.setWidth(9400);
        c.setLeft(250);
        c.setHeight(2600);
        c.setGridEditEnabled(false);
        c.setGridAddEnabled(false);
        c.setGridRemoveEnabled(false);
        oGrd = c.getGrid();
        oGrd.setRowSelect(true);
        oGrd.setDontSelectInGotFocus(true);

        c = properties.add(null, C_APLICORDENREMITO);
        c.setType(Dialogs.PropertyType.grid);
        c.hideLabel();;
        if(!itemSetGridAplicOrdenRemito(c)) { return false; }
        c.setKey(K_APLIC_ORDEN_REMITO);
        c.setName("OrdenRemito");
        c.setWidth(9400);
        c.setLeft(250);
        c.setTop(4200);
        c.setHeight(2000);
        c.setGridEditEnabled(true);
        c.setGridAddEnabled(false);
        c.setGridRemoveEnabled(false);
        oGrd = c.getGrid();
        oGrd.setRowSelect(true);
        oGrd.setDontSelectInGotFocus(true);

        // OrdenPago
        c = properties.add(null, C_TOTALORDENPAGO);
        c.setType(Dialogs.PropertyType.numeric);
        c.setSubType(Dialogs.PropertySubType.money);
        //'Importe facturado
        c.setName(getText(1909, ""));
        c.setEnabled(false);
        c.setLeft(2000);
        c.setLeftLabel(-1500);
        c.setFormat(m_generalConfig.getFormatDecImporte());
        c.setValue(m_total);
        c.setKey(K_TOTAL_ORDENPAGO);
        c.setWidth(1400);
        c.setTabIndex(1);

        c = properties.add(null, C_PENDIENTEORDENPAGO);
        c.setType(Dialogs.PropertyType.numeric);
        c.setSubType(Dialogs.PropertySubType.money);
        //'Pendiente
        c.setName(getText(1609, ""));
        c.setEnabled(false);
        c.setFormat(m_generalConfig.getFormatDecImporte());
        c.setKey(K_PENDIENTE_ORDENPAGO);
        c.setTopFromProperty(C_TOTALORDENPAGO);
        c.setLeft(6200);
        c.setWidth(1400);
        c.setLeftLabel(-1100);
        c.setTabIndex(1);

        c = properties.add(null, C_VENCIMIENTOS);
        c.setType(Dialogs.PropertyType.grid);
        c.hideLabel();;
        if(!ordenPagoLoadVencimientos(c)) { return false; }
        c.setKey(K_VENCIMIENTOS);
        //'Vencimientos
        c.setName(getText(1644, ""));
        c.hideLabel();;
        c.setWidth(9400);
        c.setLeft(250);
        c.setTopToPrevious(440);
        c.setHeight(1600);
        c.setGridEditEnabled(false);
        c.setGridAddEnabled(false);
        c.setGridRemoveEnabled(false);
        c.setTabIndex(1);
        oGrd = c.getGrid();
        oGrd.setRowSelect(true);
        oGrd.setDontSelectInGotFocus(true);

        c = properties.add(null, C_APLICORDENPAGO);
        c.setType(Dialogs.PropertyType.grid);
        c.hideLabel();;
        if(!ordenPagoSetGridAplicOrdenPago(c)) { return false; }
        c.setKey(K_APLIC_ORDENPAGO);
        c.setName("OrdenPago");
        c.hideLabel();;
        c.setWidth(9400);
        c.setLeft(250);
        c.setTop(3200);
        c.setHeight(3000);
        c.setGridEditEnabled(true);
        c.setGridAddEnabled(false);
        c.setGridRemoveEnabled(false);
        oGrd = c.getGrid();
        oGrd.setRowSelect(true);
        oGrd.setDontSelectInGotFocus(true);
        c.setTabIndex(1);

        m_dialog.MinHeight = 7800;

        // Edit Apply
        //
        m_dialog.MinWidth = 10050;

        if(!m_dialog.show(self)) { return false; }

        ordenPagoShowPendienteOrdenPago();

        return true;
      };

      var isAutomatic = function(bSuccess) { // TODO: Use of ByRef founded Private Function pIsAutomatic(ByRef bSuccess As Boolean) As Boolean
        var opg_id = null;

        if(!Cairo.Database.getData(mComprasConstantes.FACTURACOMPRA, mComprasConstantes.FC_ID, m_fcId, CT.OPG_ID, opg_id)) {
          return null;
        }

        bSuccess = true;

        return opg_id !== Cairo.Constants.NO_ID;
      };

      // Edit Apply
      //
      var pRefreshClient = function() {
        // **TODO:** on error resume next found !!!
        if(m_client === null) { return; }
        m_client.self.refresh();
      };

      //////////////////////////////////////////////////////////////////////////////////////
      // FacturaCompraTemporal
      //////////////////////////////////////////////////////////////////////////////////////
      var saveDocCpra = function(docId, fcTMPId) { // TODO: Use of ByRef founded Private Function pSaveDocCpra(ByVal DocId As Long, ByRef FcTMPId As Long) As Boolean
        var register = null;

        register = new cRegister();
        register.setFieldId(mComprasConstantes.FC_TMPID);
        register.setTable(mComprasConstantes.FACTURACOMPRATMP);

        register.setId(Cairo.Constants.NEW_ID);
        register.getFields().add2(mComprasConstantes.FC_ID, m_fcId, Cairo.Constants.Types.id);

        register.getFields().add2(mComprasConstantes.FC_NUMERO, 0, Cairo.Constants.Types.long);
        register.getFields().add2(mComprasConstantes.FC_NRODOC, "", Cairo.Constants.Types.text);

        register.getFields().add2(mComprasConstantes.PROV_ID, 0, Cairo.Constants.Types.long);
        register.getFields().add2(mComprasConstantes.SUC_ID, 0, Cairo.Constants.Types.long);
        register.getFields().add2(mComprasConstantes.DOC_ID, docId, Cairo.Constants.Types.id);
        register.getFields().add2(mComprasConstantes.CPG_ID, csECpgTipo.cSECPGT_FECHADOCUMENTO, Cairo.Constants.Types.id);

        register.getFields().add2(mComprasConstantes.FC_GRABAR_ASIENTO, 0, Cairo.Constants.Types.boolean);
        register.getFields().add2(Cairo.Constants.EST_ID, CSGeneralEx2.csEEstado.cSEEST_PENDIENTE, Cairo.Constants.Types.id);

        register.getFields().setHaveLastUpdate(true);
        register.getFields().setHaveWhoModify(true);

        if(!register.beginTrans(Cairo.Database)) { return false; }

        if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, SAVE_ERROR_MESSAGE)) { return false; }

        if(!register.commitTrans()) { return false; }

        fcTMPId = register.getId();
        return true;
      };

      //////////////////////////////////////////////////////////////////////////////////////
      //
      //   ORDENES / REMITOS
      //
      //////////////////////////////////////////////////////////////////////////////////////

      var itemLoadAplicItems = function() {

        if(!itemLoadAplicAplicados()) { return false; }
        if(!itemLoadAplicCreditos()) { return false; }

        return true;
      };

      var itemLoadItems = function(propiedad) { // TODO: Use of ByRef founded Private Function itemLoadItems(ByRef Propiedad As cIABMProperty) As Boolean
        var sqlstmt = null;
        var rs = null;
        var grid = null;
        var row = null;
        var value = null;

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
        //'Producto
        elem.setName(getText(1619, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(2500);
        elem.setKey(KII_PR_ID);

        var elem = w_columns.add(null);
        //'Pendiente
        elem.setName(getText(1609, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(1245);
        elem.setKey(KII_PENDIENTE);

        var elem = w_columns.add(null);
        //'Aplicado
        elem.setName(getText(1608, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(1245);
        elem.setKey(KII_APLICADO);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_APLICADO2);

        var f = null;
        var fv = null;

        while (!rs.isEOF()) {

          f = propiedad.getGrid().getRows().add(null);

          fv = f.add(null);
          fv.setID(Cairo.Database.valField(rs.getFields(), mComprasConstantes.FCI_ID));
          fv.setKey(KII_FCI_ID);

          fv = f.add(null);
          fv.setID(Cairo.Database.valField(rs.getFields(), mComprasConstantes.PR_ID));
          fv.setValue(Cairo.Database.valField(rs.getFields(), mComprasConstantes.PR_NOMBRECOMPRA));
          fv.setKey(KII_PR_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(rs.getFields(), mComprasConstantes.FCI_PENDIENTE));
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

      var itemSetGridAplicOrdenRemito = function(propiedad) { // TODO: Use of ByRef founded Private Function itemSetGridAplicOrdenRemito(ByRef Propiedad As cIABMProperty) As Boolean
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
        elem.setKey(KIPR_OCI_ID);

        var elem = w_columns.add(null);
        //'Documento
        elem.setName(getText(1567, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(2925);
        elem.setKey(KIPR_DOC);

        var elem = w_columns.add(null);
        //'Comprobante
        elem.setName(getText(1610, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1575);
        elem.setKey(KIPR_NRODOC);

        var elem = w_columns.add(null);
        //'Fecha
        elem.setName(getText(1569, ""));
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(1395);
        elem.setKey(KIPR_FECHA);

        var elem = w_columns.add(null);
        //'Pendiente
        elem.setName(getText(1609, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(1245);
        elem.setKey(KIPR_PENDIENTE);

        var elem = w_columns.add(null);
        //'Aplicado
        elem.setName(getText(1608, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(1245);
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

            i = itemAddToCreditos(Cairo.Database.valField(rs.getFields(), mComprasConstantes.RCI_ID), Cairo.Database.valField(rs.getFields(), mComprasConstantes.OCI_ID), idx);

            // Documento
            //
            m_vOrdenRemito[i].docNombre = Cairo.Database.valField(rs.getFields(), mComprasConstantes.DOC_NAME);
            m_vOrdenRemito[i].nroDoc = Cairo.Database.valField(rs.getFields(), C.NRO_DOC);
            m_vOrdenRemito[i].fecha = Cairo.Database.valField(rs.getFields(), C.FECHA);

            // Pendiente
            //
            m_vOrdenRemito[i].pendiente = Cairo.Database.valField(rs.getFields(), CSCPENDIENTE);
            m_vOrdenRemito[i].pendienteActual = m_vOrdenRemito[i].pendiente;

            // Orden / Remito
            //
            m_vOrdenRemito[i].rci_id = Cairo.Database.valField(rs.getFields(), mComprasConstantes.RCI_ID);
            m_vOrdenRemito[i].oci_id = Cairo.Database.valField(rs.getFields(), mComprasConstantes.OCI_ID);
            m_vOrdenRemito[i].pR_ID = Cairo.Database.valField(rs.getFields(), mComprasConstantes.PR_ID);

            // Aplicaciones

            vAplicaciones.rcfc_id = Cairo.Database.valField(rs.getFields(), mComprasConstantes.RC_FC_ID);
            vAplicaciones.ocfc_id = Cairo.Database.valField(rs.getFields(), mComprasConstantes.OC_FC_ID);

            vAplicaciones.fci_id = Cairo.Database.valField(rs.getFields(), mComprasConstantes.FCI_ID);

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
            m_vOrdenRemito[i].pR_ID = Cairo.Database.valField(rs.getFields(), mComprasConstantes.PR_ID);
            m_vOrdenRemito[i].rci_id = Cairo.Database.valField(rs.getFields(), mComprasConstantes.RCI_ID);
            m_vOrdenRemito[i].oci_id = Cairo.Database.valField(rs.getFields(), mComprasConstantes.OCI_ID);

            m_vOrdenRemito[i].docNombre = Cairo.Database.valField(rs.getFields(), mComprasConstantes.DOC_NAME);
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

        for (i = 1; i <= m_vOrdenRemito.Length; i++) {
          if((m_vOrdenRemito[i].rci_id === rciId && rciId !== Cairo.Constants.NO_ID) || (m_vOrdenRemito[i].oci_id === ociId && ociId !== Cairo.Constants.NO_ID)) {

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
          _rtn = itemUpdateAplicItems(m_dialog.getProperties().item(C_APLICORDENREMITO), getCell(row, KII_FCI_ID).getId());
        }

        return _rtn;
      };

      var itemSetAplicItems = function(iProp, fci_id, pR_ID) { // TODO: Use of ByRef founded Private Function itemSetAplicItems(ByRef iProp As cIABMProperty, ByVal fci_id As Long, ByVal PR_ID As Long) As Boolean
        var cotizacion = null;
        var i = null;
        var j = null;

        iProp.getGrid().getRows().clear();

        m_fciId = fci_id;

        for (i = 1; i <= m_vOrdenRemito.Length; i++) {

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

        for (i = 1; i <= m_vOrdenRemito.Length; i++) {

          bAplic = false;

          if(m_vOrdenRemito[i].pR_ID === pR_ID) {

            var _count = iProp.getGrid().getRows().size();
            for (var _j = 0; _j < _count; _j++) {
              row = iProp.getGrid().getRows().item(_j);
              id = getCell(row, KIPR_RCI_ID).getId();
              if(id === m_vOrdenRemito[i].rci_id && id !== Cairo.Constants.NO_ID) {
                bAplic = true;
                break;
              }

              id = getCell(row, KIPR_OCI_ID).getId();
              if(id === m_vOrdenRemito[i].oci_id && id !== Cairo.Constants.NO_ID) {
                bAplic = true;
                break;
              }

              id = m_fciId;
              for (j = 1; j <= m_vOrdenRemito[i].vAplicaciones.Length; j++) {
                if(id === m_vOrdenRemito[i].vAplicaciones(j).fci_id && id !== Cairo.Constants.NO_ID) {
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
        for (var _i = 0; _i < _count; _i++) {
          row = itemGetItemsOrdenRemito().getRows().item(_i);

          if(Cairo.Util.val(getCell(row, KIPR_APLICADO).getValue()) > 0 || getCell(row, KIPR_IDX2).getId() !== 0) {

            i = getCell(row, KIPR_IDX1).getId();
            j = getCell(row, KIPR_IDX2).getId();

            aplicado = Cairo.Util.val(getCell(row, KIPR_APLICADO).getValue());
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

        for (i = 1; i <= m_vOrdenRemito[idx].vAplicaciones.Length; i++) {

          if(m_vOrdenRemito[idx].vAplicaciones[i].fci_id === fci_id && fci_id !== Cairo.Constants.NO_ID) {

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
            fv.setID(m_vOrdenRemito[idx].oci_id);
            fv.setKey(KIPR_OCI_ID);

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
        fv.setID(Cairo.Constants.NO_ID);
        fv.setKey(KIPR_RCFC_ID);

        fv = f.add(null);
        fv.setID(Cairo.Constants.NO_ID);
        fv.setKey(KIPR_OCFC_ID);

        fv = f.add(null);
        fv.setID(m_vOrdenRemito[i].rci_id);
        fv.setKey(KIPR_RCI_ID);

        fv = f.add(null);
        fv.setID(m_vOrdenRemito[i].oci_id);
        fv.setKey(KIPR_OCI_ID);

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

        for (i = 1; i <= vAplicaciones.Length; i++) {
          rtn = rtn + vAplicaciones(i).Aplicado;
        }

        return rtn;
      };

      var itemGetItemsItemsProperty = function() {
        return m_dialog.getProperties().item(C_ITEMS);
      };

      var itemGetItemsOrdenRemitoProperty = function() {
        return m_dialog.getProperties().item(C_APLICORDENREMITO);
      };

      var itemGetItemsOrdenRemito = function() {
        return m_dialog.getProperties().item(C_APLICORDENREMITO).getGrid();
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

            pendiente = Cairo.Util.val(itemGetItemPendiente().getValue()) + Cairo.Util.val(getCell(row, KIPR_APLICADO2).getValue());
            maxVal = Cairo.Util.val(getCell(row, KIPR_PENDIENTE).getValue()) + Cairo.Util.val(getCell(row, KIPR_APLICADO2).getValue());

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
            w_pCell.setValue(Cairo.Util.val(w_pCell.getValue()) + Cairo.Util.val(getCell(row, KIPR_APLICADO2).getValue()) - Cairo.Util.val(getCell(row, KIPR_APLICADO).getValue()));
            getCell(row, KIPR_APLICADO2).getValue() === getCell(row, KIPR_APLICADO).getValue();
            break;
        }

        return true;
      };

      var itemGetAplicado = function() {
        var row = null;
        var rtn = null;

        var _count = m_dialog.getProperties().item(C_APLICORDENREMITO).getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = m_dialog.getProperties().item(C_APLICORDENREMITO).getGrid().getRows().item(_i);
          rtn = rtn + Cairo.Util.val(getCell(row, KIPR_APLICADO).getValue());
        }
        return rtn;
      };

      var itemRefreshItem = function(aplicado) {
        var iProp = null;
        var row = null;
        var aplicadoActual = null;

        iProp = m_dialog.getProperties().item(C_ITEMS);
        row = iProp.getGrid().getRows().item(m_lastRowItem);

        getCell(row, KII_APLICADO).getValue() === aplicado;
        aplicadoActual = Cairo.Util.val(getCell(row, KII_APLICADO2).getValue());

        var w_pCell = getCell(row, KII_PENDIENTE);
        w_pCell.setValue(w_pCell.getValue() - (aplicado - aplicadoActual));

        getCell(row, KII_APLICADO2).getValue() === aplicado;

        m_dialog.ShowCellValue(iProp, m_lastRowItem, cABMUtil.pGetColFromKey(iProp.getGrid().getColumns(), KII_PENDIENTE));
        m_dialog.ShowCellValue(iProp, m_lastRowItem, cABMUtil.pGetColFromKey(iProp.getGrid().getColumns(), KII_APLICADO));
      };

      var itemSaveOrdenRemito = function(fcTMPId) {
        if(!itemSaveOrdenCompra(fcTMPId)) { return false; }
        if(!itemSaveRemito(fcTMPId)) { return false; }
        return true;
      };

      var itemSaveOrdenCompra = function(fcTMPId) {
        var register = null;
        var i = null;
        var j = null;

        for (i = 1; i <= m_vOrdenRemito.Length; i++) {

          if(m_vOrdenRemito[i].oci_id !== Cairo.Constants.NO_ID) {

            for (j = 1; j <= m_vOrdenRemito[i].vAplicaciones.Length; j++) {

              if(m_vOrdenRemito[i].vAplicaciones(j).fci_id !== Cairo.Constants.NO_ID) {

                if(m_vOrdenRemito[i].vAplicaciones[j].Aplicado > 0) {

                  register = new cRegister();
                  register.setFieldId(mComprasConstantes.OC_FC_TMPID);
                  register.setTable(mComprasConstantes.ORDENFACTURACOMPRATMP);
                  register.setId(Cairo.Constants.NEW_ID);

                  register.getFields().add2(mComprasConstantes.FC_TMPID, fcTMPId, Cairo.Constants.Types.id);
                  register.getFields().add2(mComprasConstantes.OCI_ID, m_vOrdenRemito[i].oci_id, Cairo.Constants.Types.id);
                  register.getFields().add2(mComprasConstantes.FCI_ID, m_vOrdenRemito[i].vAplicaciones[j].fci_id, Cairo.Constants.Types.id);
                  register.getFields().add2(mComprasConstantes.OC_FC_CANTIDAD, m_vOrdenRemito[i].vAplicaciones[j].Aplicado, Cairo.Constants.Types.double);

                  register.getFields().add2(mComprasConstantes.OC_FC_ID, m_vOrdenRemito[i].vAplicaciones[j].ocfc_id, Cairo.Constants.Types.long);

                  register.getFields().setHaveLastUpdate(false);
                  register.getFields().setHaveWhoModify(false);

                  if(!Cairo.Database.save(register, , "pItSaveOrdenCompra", C_MODULE, SAVE_ERROR_MESSAGE)) { return false; }
                }
              }
            }
          }
        }

        return true;
      };

      var itemSaveRemito = function(fcTMPId) {
        var register = null;
        var i = null;
        var j = null;

        for (i = 1; i <= m_vOrdenRemito.Length; i++) {

          if(m_vOrdenRemito[i].rci_id !== Cairo.Constants.NO_ID) {

            for (j = 1; j <= m_vOrdenRemito[i].vAplicaciones.Length; j++) {

              if(m_vOrdenRemito[i].vAplicaciones(j).fci_id !== Cairo.Constants.NO_ID) {

                if(m_vOrdenRemito[i].vAplicaciones[j].Aplicado > 0) {

                  register = new cRegister();
                  register.setFieldId(mComprasConstantes.RC_FC_TMPID);
                  register.setTable(mComprasConstantes.REMITOFACTURACOMPRATMP);
                  register.setId(Cairo.Constants.NEW_ID);

                  register.getFields().add2(mComprasConstantes.FC_TMPID, fcTMPId, Cairo.Constants.Types.id);
                  register.getFields().add2(mComprasConstantes.RCI_ID, m_vOrdenRemito[i].rci_id, Cairo.Constants.Types.id);
                  register.getFields().add2(mComprasConstantes.FCI_ID, m_vOrdenRemito[i].vAplicaciones[j].fci_id, Cairo.Constants.Types.id);
                  register.getFields().add2(mComprasConstantes.RC_FC_CANTIDAD, m_vOrdenRemito[i].vAplicaciones[j].Aplicado, Cairo.Constants.Types.double);

                  register.getFields().add2(mComprasConstantes.RC_FC_ID, m_vOrdenRemito[i].vAplicaciones[j].rcfc_id, Cairo.Constants.Types.long);

                  register.getFields().setHaveLastUpdate(false);
                  register.getFields().setHaveWhoModify(false);

                  if(!Cairo.Database.save(register, , "pItSaveRemito", C_MODULE, SAVE_ERROR_MESSAGE)) { return false; }
                }
              }
            }
          }
        }

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
            m_vOpgNC[i].docNombre = Cairo.Database.valField(rs.getFields(), mComprasConstantes.DOC_NAME);
            m_vOpgNC[i].nroDoc = Cairo.Database.valField(rs.getFields(), "nrodoc");

            // Pendiente
            //
            m_vOpgNC[i].pendiente = Cairo.Database.valField(rs.getFields(), "Pendiente");
            m_vOpgNC[i].pendienteActual = m_vOpgNC[i].pendiente;

            // Factura o Nota de credito
            //
            m_vOpgNC[i].fc_id = Cairo.Database.valField(rs.getFields(), mComprasConstantes.FC_ID);

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

      var ordenPagoLoadVencimientos = function(propiedad) { // TODO: Use of ByRef founded Private Function ordenPagoLoadVencimientos(ByRef Propiedad As cIABMProperty) As Boolean
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
        //'Fecha
        elem.setName(getText(1569, ""));
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(1395);
        elem.setKey(KIV_FECHA);

        var elem = w_columns.add(null);
        //'Pendiente
        elem.setName(getText(1609, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(1245);
        elem.setKey(KIV_PENDIENTE);

        var elem = w_columns.add(null);
        //'Aplicado
        elem.setName(getText(1608, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(1245);
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
            m_vOpgNC[i].fc_id = Cairo.Database.valField(rs.getFields(), mComprasConstantes.FC_ID);
            m_vOpgNC[i].fcd_id = Cairo.Database.valField(rs.getFields(), CT.FCD_ID);

            m_vOpgNC[i].docNombre = Cairo.Database.valField(rs.getFields(), mComprasConstantes.DOC_NAME);
            m_vOpgNC[i].nroDoc = Cairo.Database.valField(rs.getFields(), "nroDoc");

            m_vOpgNC[i].fecha = Cairo.Database.valField(rs.getFields(), "fecha");
            m_vOpgNC[i].pendiente = Cairo.Database.valField(rs.getFields(), "pendiente");
            m_vOpgNC[i].pendienteActual = m_vOpgNC[i].pendiente;

            G.redim(m_vOpgNC[i].vAplicaciones, 0);

            rs.MoveNext;
          }
        }

        return true;
      };

      var ordenPagoSetGridAplicOrdenPago = function(propiedad) { // TODO: Use of ByRef founded Private Function ordenPagoSetGridAplicOrdenPago(ByRef Propiedad As cIABMProperty) As Boolean
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
        //'Documento
        elem.setName(getText(1567, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(2925);
        elem.setKey(KIC_DOC);

        var elem = w_columns.add(null);
        //'Comprobante
        elem.setName(getText(1610, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1575);
        elem.setKey(KIC_NRODOC);

        var elem = w_columns.add(null);
        //'Fecha
        elem.setName(getText(1569, ""));
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(1395);
        elem.setKey(KIC_FECHA);

        var elem = w_columns.add(null);
        //'Pendiente
        elem.setName(getText(1609, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(1245);
        elem.setKey(KIC_PENDIENTE);

        var elem = w_columns.add(null);
        //'Aplicado
        elem.setName(getText(1608, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(1245);
        elem.setKey(KIC_APLICADO);

        var elem = w_columns.add(null);
        //'Cotiz.
        elem.setName(getText(1650, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(m_generalConfig.getFormatDecCotizacion());
        elem.setWidth(920);
        elem.setKey(KIC_COTIZACION);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIC_APLICADO2);

        return true;
      };

      var ordenPagoAddToCreditos = function(opgId, fcdId, fcpId, idx) { // TODO: Use of ByRef founded Private Function ordenPagoAddToCreditos(ByVal OpgId As Long, ByVal FcdId As Long, ByVal FcpId As Long, ByRef Idx As Long) As Long
        var _rtn = 0;
        var i = null;

        for (i = 1; i <= m_vOpgNC.Length; i++) {
          if((m_vOpgNC[i].opg_id === opgId && opgId !== Cairo.Constants.NO_ID) || (m_vOpgNC[i].fcd_id === fcdId && fcdId !== Cairo.Constants.NO_ID) || (m_vOpgNC[i].fcp_id === fcpId && fcpId !== Cairo.Constants.NO_ID)) {

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

        for (i = 1; i <= m_vOpgNC.Length; i++) {

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

        for (i = 1; i <= m_vOpgNC.Length; i++) {

          bAplic = false;

          var _count = iProp.getGrid().getRows().size();
          for (var _j = 0; _j < _count; _j++) {
            row = iProp.getGrid().getRows().item(_j);
            id = getCell(row, KIC_OPG_ID).getId();
            if(id === m_vOpgNC[i].opg_id && id !== Cairo.Constants.NO_ID) {
              bAplic = true;
              break;
            }

            id = getCell(row, KIC_FCD_ID).getId();
            if(id === m_vOpgNC[i].fcd_id && id !== Cairo.Constants.NO_ID) {
              bAplic = true;
              break;
            }

            id = getCell(row, KIC_FCP_ID).getId();
            if(id === m_vOpgNC[i].fcp_id && id !== Cairo.Constants.NO_ID) {
              bAplic = true;
              break;
            }

            for (j = 1; j <= m_vOpgNC[i].vAplicaciones.Length; j++) {

              id = getCell(row, KIC_FCD_ID).getId();
              if(id === m_vOpgNC[i].vAplicaciones(j).fcd_id && id !== Cairo.Constants.NO_ID) {
                bAplic = true;
                break;
              }

              id = getCell(row, KIC_FCP_ID).getId();
              if(id === m_vOpgNC[i].vAplicaciones(j).fcp_id && id !== Cairo.Constants.NO_ID) {
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

        for (i = 1; i <= m_vOpgNC[idx].vAplicaciones.Length; i++) {

          if((m_vOpgNC[idx].vAplicaciones[i].fcd_id === fcd_id && fcd_id !== Cairo.Constants.NO_ID) || (m_vOpgNC[idx].vAplicaciones[i].fcp_id === fcp_id && fcp_id !== Cairo.Constants.NO_ID)) {

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
        fv.setID(Cairo.Constants.NO_ID);
        fv.setKey(KIC_FCOPG_ID);

        fv = f.add(null);
        fv.setID(Cairo.Constants.NO_ID);
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
        fv.setID(Cairo.Constants.NO_ID);
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
        for (var _i = 0; _i < _count; _i++) {
          row = ordenPagoGetItemsOrdenPago().getRows().item(_i);

          if(Cairo.Util.val(getCell(row, KIC_APLICADO).getValue()) > 0 || getCell(row, KIC_IDX2).getId() !== 0) {

            i = getCell(row, KIC_IDX1).getId();
            j = getCell(row, KIC_IDX2).getId();

            aplicado = Cairo.Util.val(getCell(row, KIC_APLICADO).getValue());
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

        for (i = 1; i <= vAplicaciones.Length; i++) {
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

            pendiente = Cairo.Util.val(ordenPagoGetVtoPendiente().getValue()) + Cairo.Util.val(getCell(row, KIC_APLICADO2).getValue());
            maxVal = Cairo.Util.val(getCell(row, KIC_PENDIENTE).getValue()) + Cairo.Util.val(getCell(row, KIC_APLICADO2).getValue());

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
            w_pCell.setValue(Cairo.Util.val(w_pCell.getValue()) + Cairo.Util.val(getCell(row, KIC_APLICADO2).getValue()) - Cairo.Util.val(getCell(row, KIC_APLICADO).getValue()));
            getCell(row, KIC_APLICADO2).getValue() === getCell(row, KIC_APLICADO).getValue();

            ordenPagoShowPendienteOrdenPago();
            break;
        }

        return true;
      };

      var ordenPagoGetAplicado = function() {
        var row = null;
        var rtn = null;

        var _count = m_dialog.getProperties().item(C_APLICORDENPAGO).getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = m_dialog.getProperties().item(C_APLICORDENPAGO).getGrid().getRows().item(_i);
          rtn = rtn + Cairo.Util.val(getCell(row, KIC_APLICADO).getValue());
        }
        return rtn;
      };

      var ordenPagoRefreshVto = function(aplicado) {
        var iProp = null;
        var row = null;
        var aplicadoActual = null;

        iProp = m_dialog.getProperties().item(C_VENCIMIENTOS);
        row = iProp.getGrid().getRows().item(m_lastRowVto);

        getCell(row, KIV_APLICADO).getValue() === aplicado;
        aplicadoActual = Cairo.Util.val(getCell(row, KIV_APLICADO2).getValue());

        var w_pCell = getCell(row, KIV_PENDIENTE);
        w_pCell.setValue(w_pCell.getValue() - (aplicado - aplicadoActual));

        getCell(row, KIV_APLICADO2).getValue() === aplicado;

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
            if(getCell(property.getGrid().getRows().item(lRow), KIC_COTIZACION).getValue() === "") {
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
        for (var _i = 0; _i < _count; _i++) {
          row = ordenPagoGetItemsVtosProperty().getGrid().getRows().item(_i);
          total = total + Cairo.Util.val(getCell(row, KIV_PENDIENTE).getValue());
        }

        ordenPagoGetPendienteOrdenPago().setValue(total);

        m_dialog.showValue(ordenPagoGetPendienteOrdenPago());
      };

      var ordenPagoGetPendienteOrdenPago = function() {
        return m_dialog.getProperties().item(C_PENDIENTEORDENPAGO);
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

      //////////////////////////////////////////////////////////////////////////////////////
      // Nota de credito
      //////////////////////////////////////////////////////////////////////////////////////

      // Proposito: Vincular una/s nota de credito con una/s factura
      //
      var ordenPagoSaveNotaCredito = function(fcTMPId) {
        var register = null;
        var row = null;
        var cell = null;
        var i = null;
        var j = null;

        for (i = 1; i <= m_vOpgNC.Length; i++) {

          if(m_vOpgNC[i].fc_id !== Cairo.Constants.NO_ID) {

            for (j = 1; j <= m_vOpgNC[i].vAplicaciones.Length; j++) {

              if(m_vOpgNC[i].vAplicaciones[j].Aplicado > 0 || m_vOpgNC[i].vAplicaciones[j].fcnc_id) {

                register = new cRegister();
                register.setFieldId(CT.FC_NC_TMP_ID);
                register.setTable(CT.FACTURA_COMPRA_NOTA_CREDITO_TMP);
                register.setId(Cairo.Constants.NEW_ID);

                register.getFields().add2(mComprasConstantes.FC_TMPID, fcTMPId, Cairo.Constants.Types.id);

                if(m_isNotaCredito) {
                  register.getFields().add2(CT.FC_ID_NOTA_CREDITO, m_fcId, Cairo.Constants.Types.id);
                  register.getFields().add2(CT.FC_ID_FACTURA, m_vOpgNC[i].fc_id, Cairo.Constants.Types.id);

                  register.getFields().add2(CT.FCD_ID_NOTA_CREDITO, m_vOpgNC[i].vAplicaciones[j].fcd_id, Cairo.Constants.Types.id);
                  register.getFields().add2(CT.FCD_ID_FACTURA, m_vOpgNC[i].fcd_id, Cairo.Constants.Types.id);

                  register.getFields().add2(CT.FCP_ID_NOTA_CREDITO, m_vOpgNC[i].vAplicaciones[j].fcp_id, Cairo.Constants.Types.id);
                  register.getFields().add2(CT.FCP_ID_FACTURA, m_vOpgNC[i].fcp_id, Cairo.Constants.Types.id);
                }
                else {
                  register.getFields().add2(CT.FC_ID_NOTA_CREDITO, m_vOpgNC[i].fc_id, Cairo.Constants.Types.id);
                  register.getFields().add2(CT.FC_ID_FACTURA, m_fcId, Cairo.Constants.Types.id);

                  register.getFields().add2(CT.FCD_ID_NOTA_CREDITO, m_vOpgNC[i].fcd_id, Cairo.Constants.Types.id);
                  register.getFields().add2(CT.FCD_ID_FACTURA, m_vOpgNC[i].vAplicaciones[j].fcd_id, Cairo.Constants.Types.id);

                  register.getFields().add2(CT.FCP_ID_NOTA_CREDITO, m_vOpgNC[i].fcp_id, Cairo.Constants.Types.id);
                  register.getFields().add2(CT.FCP_ID_FACTURA, m_vOpgNC[i].vAplicaciones[j].fcp_id, Cairo.Constants.Types.id);
                }

                register.getFields().add2(CT.FC_NC_IMPORTE, m_vOpgNC[i].vAplicaciones[j].Aplicado, Cairo.Constants.Types.double);
                register.getFields().add2(CT.FC_NC_ID, 0, Cairo.Constants.Types.long);

                register.getFields().setHaveLastUpdate(false);
                register.getFields().setHaveWhoModify(false);

                if(!Cairo.Database.save(register, , "ordenPagoSaveNotaCredito", C_MODULE, SAVE_ERROR_MESSAGE)) { return false; }
              }
            }
          }
        }

        return true;
      };

      //////////////////////////////////////////////////////////////////////////////////////
      // OrdenPago
      //////////////////////////////////////////////////////////////////////////////////////

      // Guardo cada una de las OrdenPagos modificadas
      // por la edicion de esta aplicacion
      var ordenPagoSaveOrdenPago = function(fcTMPId) {
        var vOrdenPagos() = null;
        var i = null;

        ordenPagoGetOrdenPagos(vOrdenPagos[]);

        for (i = 1; i <= vOrdenPagos.Length; i++) {
          if(!ordenPagoSaveOrdenPagoAux(vOrdenPagos[i].opg_id, fcTMPId, vOrdenPagos[i].newAplic)) { return false; }
        }

        return true;
      };

      var ordenPagoGetOrdenPagos = function(vOrdenPagos) { // TODO: Use of ByRef founded Private Sub ordenPagoGetOrdenPagos(ByRef vOrdenPagos() As T_OrdenPago)
        var row = null;
        var i = null;
        var k = null;

        G.redim(vOrdenPagos, 0);

        for (i = 1; i <= m_vOpgNC.Length; i++) {
          if(m_vOpgNC[i].opg_id !== Cairo.Constants.NO_ID) {

            if(m_vOpgNC[i].aplicado > 0 || m_vOpgNC[i].aplicadoActual !== 0) {

              k = ordenPagoGetIdxOrdenPagos(vOrdenPagos, m_vOpgNC[i].opg_id);
              vOrdenPagos.opg_id = m_vOpgNC[i].opg_id;
              vOrdenPagos.NewAplic = m_vOpgNC[i].aplicado;
              vOrdenPagos.CurrAplic = m_vOpgNC[i].aplicadoActual;
            }
          }
        }
      };

      var ordenPagoGetIdxOrdenPagos = function(vOrdenPagos, opgId) { // TODO: Use of ByRef founded Private Function ordenPagoGetIdxOrdenPagos(ByRef vOrdenPagos() As T_OrdenPago, ByVal OpgId As Long) As Long
        var _rtn = 0;
        var bFound = null;
        var i = null;

        for (i = 1; i <= vOrdenPagos.Length; i++) {
          if(vOrdenPagos(i).opg_id === opgId) {
            _rtn = i;
            return _rtn;
          }
        }

        if(!bFound) {
          G.redimPreserve(vOrdenPagos, vOrdenPagos.Length + 1);
        }

        _rtn = vOrdenPagos.Length;

        return _rtn;
      };

      var ordenPagoSaveOrdenPagoAux = function(opgId, fcTMPId, aplic) {
        var register = null;

        var mouse = null;
        mouse = new cMouseWait();

        DoEvents:(DoEvents: DoEvents: DoEvents);

        register = new cRegister();
        register.setFieldId(CT.OPG_TMPID);
        register.setTable(CT.ORDEN_PAGO_TMP);

        register.setId(Cairo.Constants.NEW_ID);

        register.getFields().add2(mComprasConstantes.FC_TMPID, fcTMPId, Cairo.Constants.Types.id);
        register.getFields().add2(CT.OPG_NUMERO, 0, Cairo.Constants.Types.long);
        register.getFields().add2(mComprasConstantes.PROV_ID, Cairo.Constants.NO_ID, Cairo.Constants.Types.long);
        register.getFields().add2(mComprasConstantes.SUC_ID, Cairo.Constants.NO_ID, Cairo.Constants.Types.long);
        register.getFields().add2(mComprasConstantes.DOC_ID, Cairo.Constants.NO_ID, Cairo.Constants.Types.long);
        register.getFields().add2(Cairo.Constants.EST_ID, Cairo.Constants.NO_ID, Cairo.Constants.Types.long);
        register.getFields().add2(CT.OPG_ID, opgId, Cairo.Constants.Types.id);

        register.getFields().setHaveLastUpdate(true);
        register.getFields().setHaveWhoModify(true);

        if(!register.beginTrans(Cairo.Database)) { return false; }

        if(!Cairo.Database.save(register, , "pSave", C_MODULE, SAVE_ERROR_MESSAGE)) { return false; }

        if(!ordenPagoSaveItems(register.getId(), opgId)) { return false; }
        if(!ordenPagoSaveCtaCte(register.getId(), opgId, aplic)) { return false; }

        if(!register.commitTrans()) { return false; }

        return true;
      };

      var ordenPagoSaveItems = function(id, opgId) {
        var register = null;
        var i = null;
        var j = null;

        for (i = 1; i <= m_vOpgNC.Length; i++) {

          if(m_vOpgNC[i].opg_id === opgId) {

            for (j = 1; j <= m_vOpgNC[i].vAplicaciones.Length; j++) {

              if(m_vOpgNC[i].vAplicaciones[j].Aplicado > 0 || m_vOpgNC[i].vAplicaciones[j].fcopg_id) {

                register = new cRegister();
                register.setFieldId(CT.FC_OPG_TMPID);
                register.setTable(CT.FACTURA_COMPRA_ORDEN_PAGO_TMP);
                register.setId(Cairo.Constants.NEW_ID);

                register.getFields().add2(CT.OPG_ID, m_vOpgNC[i].opg_id, Cairo.Constants.Types.long);
                register.getFields().add2(CT.OPG_TMPID, id, Cairo.Constants.Types.id);

                register.getFields().add2(mComprasConstantes.FC_ID, m_fcId, Cairo.Constants.Types.id);
                register.getFields().add2(CT.FCD_ID, m_vOpgNC[i].vAplicaciones[j].fcd_id, Cairo.Constants.Types.id);
                register.getFields().add2(CT.FCP_ID, m_vOpgNC[i].vAplicaciones[j].fcp_id, Cairo.Constants.Types.id);
                register.getFields().add2(CT.FC_OPG_ID, m_vOpgNC[i].vAplicaciones[j].fcopg_id, Cairo.Constants.Types.long);

                register.getFields().add2(CT.FC_OPG_COTIZACION, m_vOpgNC[i].cotizacion, Cairo.Constants.Types.double);
                register.getFields().add2(CT.FC_OPG_IMPORTE, m_vOpgNC[i].vAplicaciones[j].Aplicado, Cairo.Constants.Types.double);
                register.getFields().add2(CT.FC_OPG_IMPORTE_ORIGEN, DivideByCero(m_vOpgNC[i].vAplicaciones[j].Aplicado, m_vOpgNC[i].cotizacion), Cairo.Constants.Types.double);

                register.getFields().setHaveLastUpdate(false);
                register.getFields().setHaveWhoModify(false);

                if(!Cairo.Database.save(register, , "pSaveItems", C_MODULE, SAVE_ERROR_MESSAGE)) { return false; }
              }
            }
          }
        }

        return true;
      };

      var ordenPagoSaveCtaCte = function(id, opgId, aplic) {
        var register = null;
        var ctaCte = null;

        // Obtengo las cuentas del tercero
        if(!ordenPagoGetCuentasAcreedor(opgId, ctaCte, aplic)) { return false; }

        register = new cRegister();
        register.setFieldId(CT.OPGI_TMPID);
        register.setTable(CT.ORDEN_PAGO_ITEM_TMP);
        register.setId(Cairo.Constants.NEW_ID);

        register.getFields().add2(mComprasConstantes.CUE_ID, ctaCte.cue_id, Cairo.Constants.Types.id);
        register.getFields().add2(CT.OPGI_IMPORTE_ORIGEN, ctaCte.importeOrigen, Cairo.Constants.Types.currency);
        register.getFields().add2(CT.OPGI_IMPORTE, ctaCte.importe, Cairo.Constants.Types.currency);

        register.getFields().add2(CT.OPGI_ORDEN, 1, Cairo.Constants.Types.integer);
        register.getFields().add2(CT.OPGI_TIPO, csEOrdenPagoItemTipo.csEOpgiTCtaCte, Cairo.Constants.Types.integer);
        register.getFields().add2(CT.OPG_TMPID, id, Cairo.Constants.Types.id);
        register.getFields().add2(CT.OPGI_ID, id, Cairo.Constants.Types.long);
        register.getFields().add2(CT.OPGI_OTRO_TIPO, csEOrdenPagoItemOtroTipo.csEOtroHaber, Cairo.Constants.Types.integer);

        register.getFields().setHaveLastUpdate(false);
        register.getFields().setHaveWhoModify(false);

        if(!Cairo.Database.save(register, , "pSaveCtaCte", C_MODULE, SAVE_ERROR_MESSAGE)) { return false; }

        return true;
      };

      var ordenPagoGetCuentasAcreedor = function(opgId, ctaCte, aplic) { // TODO: Use of ByRef founded Private Function ordenPagoGetCuentasAcreedor(ByVal OpgId As Long, ByRef CtaCte As T_CtaCte, ByVal Aplic As Double) As Boolean
        var cueIdFactura = null;
        var cotizacion = null;

        if(!ordenPagoGetCueIdFactura(cueIdFactura)) { return false; }

        ctaCte.cue_id = cueIdFactura;
        ctaCte.importe = aplic;

        if(ordenPagoGetMonIdForCueId(cueIdFactura) !== m_monDefault) {
          if(!ordenPagoGetCotizacionPago(opgId, cotizacion)) { return false; }
          ctaCte.importeOrigen = aplic * cotizacion;
        }

        return true;
      };

      var ordenPagoGetMonIdForCueId = function(cueId) {
        var _rtn = 0;
        try {

          var sqlstmt = null;
          var rs = null;

          sqlstmt = "select mon_id from Cuenta where cue_id = "+ cueId.toString();

          if(!Cairo.Database.openRs(sqlstmt, rs)) { return _rtn; }

          if(rs.isEOF()) { return _rtn; }

          _rtn = Cairo.Database.valField(rs.getFields(), mComprasConstantes.MON_ID);

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "pGetMonIdForCueId", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

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

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "pGetCotizacionPago", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

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

          cueIdFactura = Cairo.Database.valField(rs.getFields(), mComprasConstantes.CUE_ID);

          _rtn = true;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "pOPGetCueIdFactura", C_MODULE, "");
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

          //'Error al grabar la factura de Compra
          SAVE_ERROR_MESSAGE = getText(1907, "");

          m_generalConfig = new cGeneralConfig();
          m_generalConfig.Load;

          G.redim(m_vOpgNC, 0);
          G.redimPreserve(0, .vAplicaciones);

          m_monDefault = GetMonedaDefault();

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "Class_Initialize", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      self.destroy = function() {
        try {

          m_dialog = null;
          m_generalConfig = null;

          G.redim(m_vOpgNC, 0);
          G.redim(m_vOrdenRemito, 0);

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "Class_Terminate", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

}());