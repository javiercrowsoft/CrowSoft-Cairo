(function() {
  "use strict";

  Cairo.module("FacturaVenta.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var TITLE = getText(1624, ""); // Facturas de Venta
      var SAVE_ERROR_MESSAGE = getText(2220, ""); // Error al grabar la Factura de Venta

      var P = Cairo.Promises;
      var NO_ID = Cairo.Constants.NO_ID;
      var DB = Cairo.Database;
      var Dialogs = Cairo.Dialogs;
      var Grids = Cairo.Dialogs.Grids;
      var C = Cairo.General.Constants;
      var CV = Cairo.Modulexxxx.Constants;
      var CS = Cairo.Security.Actions.Modulexxxx;
      var Types = Cairo.Constants.Types;
      var valField = DB.valField;
      var getValue = DB.getValue;
      var valEmpty = Cairo.Util.valEmpty;
      var Percepciones = Cairo.Modulexxxx.Percepciones;
      var call = P.call;
      var D = Cairo.Documents;
      var getProperty = D.getProperty;
      var getGrid = D.getGrid;
      var getCell = Dialogs.cell;
      var cellVal = Dialogs.cellVal;
      var cellId = Dialogs.cellId;
      var cellFloat = Dialogs.cellFloat;
      var val = Cairo.Util.val;
      var M = Cairo.Modal;
      var T = Dialogs.PropertyType;

      var C_MODULE = "cFacturaVenta";

      var C_ITEMS = "ITEMS";
      var C_PERCEPCIONES = "PERCEPCIONES";
      var C_CAJAMSG = "CajaMsg";
      var C_CAJAMSGBOX = "CajaMsgBox";

      var C_HIDECOLSFV = "HideColsFv";

      var K_NUMERO = 1;
      var K_NRODOC = 2;
      var K_DESCRIP = 3;
      var K_FECHA = 4;
      var K_FECHAENTREGA = 5;
      var K_FECHAIVA = 501;
      var K_FECHAVTO = 500;
      var K_NETO = 6;
      var K_IVARI = 7;
      var K_IVARNI = 8;
      var K_INTERNOS = 101;
      var K_TOTAL = 9;
      var K_CLI_ID = 10;
      var K_DOC_ID = 11;
      var K_LP_ID = 13;
      var K_LD_ID = 14;
      var K_ITEMS = 15;
      var K_CPG_ID = 16;
      var K_EST_ID = 17;
      var K_CCOS_ID = 18;
      var K_SUC_ID = 19;
      var K_DESCUENTO1 = 20;
      var K_DESCUENTO2 = 21;
      var K_IMPORTEDESC1 = 22;
      var K_IMPORTEDESC2 = 23;
      var K_SUBTOTAL = 24;
      var K_COTIZACION = 25;
      var K_VEN_ID = 26;
      var K_LGJ_ID = 27;
      var K_CAI = 28;

      var K_PRO_ID_ORIGEN = 29;
      var K_PRO_ID_DESTINO = 30;
      var K_TRANS_ID = 31;
      var K_DEPL_ID = 32;
      var K_CLIS_ID = 33;

      var K_RV_NRODOC = 34;

      var K_PERCEPCIONES = 35;
      var K_TOTAPERCEPCIONES = 36;

      var K_ORDENCOMPRA = 40;

      var K_HIDECOLS = 41;

      var KI_FVI_ID = 2;
      var KI_CANTIDAD = 4;
      var KI_DESCRIP = 6;
      var KI_PRECIO = 7;
      var KI_IMPORTE = 8;
      var KI_NETO = 9;
      var KI_IVARI = 10;
      var KI_IVARNI = 11;
      var KI_INTERNOS = 101;
      var KI_INTERNOS_PORC = 103;
      var KI_PR_ID = 13;
      var KI_IVARIPERCENT = 16;
      var KI_IVARNIPERCENT = 17;
      var KI_INTERNOSPERCENT = 102;
      var KI_DESCUENTO = 18;
      var KI_UNIDAD = 19;
      var KI_PRECIO_LP = 20;
      var KI_PRECIO_USR = 21;
      var KI_CUE_ID = 23;
      var KI_CUE_ID_IVARI = 24;
      var KI_CUE_ID_IVARNI = 25;

      var KI_PR_LLEVANROSERIE = 26;
      var KI_ES_KIT = 27;
      var KI_NROSERIE = 28;
      var KI_GRUPO = 29;

      var KI_STL_ID = 30;
      var KI_PR_LLEVALOTE = 31;

      var KI_PR_LOTEFIFO = 32;

      var KI_NOSTOCK = 33;

      var KI_TO_ID = 400;

      var CSLEGAJO = 15001;

      var m_id = 0;
      var m_numero = 0;
      var m_estado = "";
      var m_estId = 0;
      var m_nrodoc = "";
      var m_descrip = "";
      var m_fecha = null;
      var m_fechaentrega = null;
      var m_fechaVto = null;
      var m_fechaIva = null;
      var m_neto = 0;
      var m_ivari = 0;
      var m_ivarni = 0;
      var m_internos = 0;
      var m_total = 0;
      var m_totalPercepciones = 0;
      var m_subTotal = 0;
      var m_descuento1 = 0;
      var m_descuento2 = 0;
      var m_importeDesc1 = 0;
      var m_importeDesc2 = 0;
      var m_cpgId = 0;
      var m_condicionPago = "";
      var m_venId = 0;
      var m_vendedor = "";
      var m_lgjId = 0;
      var m_legajo = "";

      var m_clisId = 0;
      var m_clienteSucursal = "";

      var m_proIdOrigen = 0;
      var m_proOrigen = "";
      var m_proIdDestino = 0;
      var m_proDestino = "";

      var m_transId = "";
      var m_transporte = "";

      var m_ordenCompra = "";

      var m_cai = "";

      var m_deplId = 0;
      var m_deposito = "";

      var m_depfId = 0;

      var m_cotizacion = 0;
      var m_ccosId = 0;
      var m_centroCosto = "";
      var m_sucId = 0;
      var m_sucursal = "";
      var m_cliId = 0;
      var m_cliente = "";
      var m_docId = 0;
      var m_documento = "";
      var m_doctId = 0;
      var m_lpId = 0;
      var m_listaPrecio = "";
      var m_ldId = 0;
      var m_listaDescuento = "";
      var m_monId = 0;
      var m_lastMonIdCotizacion = 0;
      var m_creado = null;
      var m_modificado = null;
      var m_modifico = 0;
      var m_firmado;

      var m_lastFecha = null;

      var m_asId = 0;
      var m_stId = 0;

      var m_showStockData;

      var m_editing;

      var m_footer;
      var m_footerProps;
      var m_items;
      var m_itemsProps;
      var m_dialog;
      var m_properties;
      var m_listController = null;

      var m_lastDocId = 0;
      var m_lastMonId = 0;
      var m_lastDoctId = 0;
      var m_lastCliId = 0;
      var m_lastDocName = "";
      var m_lastCliName = "";

      var m_lastCpgId = 0;

      var m_bIva;
      var m_bIvaRni;
      var m_catFiscal = 0;
      var m_bCatFiscalChanged;

      var m_isNew;

      var m_branchId = 0;
      var m_treeId = 0;

      var m_itemsDeleted = "";
      var m_percepcionesDeleted = "";

      var m_copy;

      var m_generalConfig;
      var m_stockConfig;

      var m_docEditable;
      var m_docEditMsg = "";

      var m_pvIds = 0;
      var m_pviIds = 0;
      var m_pviCantidades = 0;
      var m_rvIds = 0;
      var m_pklstIds = 0;
      var m_horaIds = 0;

      var m_taPropuesto;
      var m_taMascara = "";
      var m_rvTaPropuesto;

      var m_objApply;

      var m_nrosSerie;
      var m_collKitInfo;

      var m_bPushVirtualNext;
      var m_bCloseWizardAfterSave;
      var m_bWizardCompleteSuccess;
      var m_bAutoSelectEasy;
      var m_bAutoPago;
      var m_cueIdAutoPago = 0;
      var m_modoVentaCtaCte;

      var m_ventasCfg;

      var m_docSinPerc;
      var m_vPercepciones;

      var m_cjId = 0;
      var m_cajaMsg = "";
      var m_bCajaError;

      var m_fv_id_nc_based = 0;

      var m_hojaRuta;

      var m_searchZona;

      var m_apiPath = DB.getAPIVersion();

      var emptyData = {
        items: [],
        otros: [],
        percepciones: [],
        legajos: [],
        serialNumbers: []
      };

      var m_data = emptyData;

      self.getEditorType = function() {
        return "document"
      };

      self.refresh = function() {
        load(m_id);
        refreshProperties();
      };

      self.setHojaRuta = function(rhs) { // TODO: Use of ByRef founded Public Property Set HojaRuta(ByRef rhs As cHojaRuta)
        m_hojaRuta = rhs;
      };

      self.setPushVirtualNext = function(rhs) {
        m_bPushVirtualNext = rhs;
      };

      self.setAutoSelectEasy = function(rhs) {
        m_bAutoSelectEasy = rhs;
      };

      self.setAutoPago = function(rhs) {
        m_bAutoPago = rhs;
      };

      self.setCue_id_autoPago = function(rhs) {
        m_cueIdAutoPago = rhs;
      };

      self.setModoVentaCtaCte = function(rhs) {
        m_modoVentaCtaCte = rhs;
      };

      self.setCloseWizardAfterSave = function(rhs) {
        m_bCloseWizardAfterSave = rhs;
      };

      self.getWizardCompleteSuccess = function() {
        return m_bWizardCompleteSuccess;
      };

      self.setDoc_id = function(rhs) {
        m_lastDocId = rhs;
      };

      self.setDoc_name = function(rhs) {
        m_lastDocName = rhs;
      };

      self.printDoc = function(fv_id,  doc_id,  cli_id,  nroDoc,  cliente) {

        var abmGen = null;
        abmGen = m_dialog;

        // Se usa para el titulo de la ventana de impresion
        //
        m_nrodoc = nroDoc;
        m_cliente = cliente;
        m_cliId = cli_id;

        return abmGen.PrintDocWithResult(self, fv_id, doc_id);

      };

      // Edit Apply
      //
      self.refresh = function() {
        load(m_id);
        pRefreshProperties();
      };

      self.terminateWizard = function(id) {
        // **TODO:** on error resume next found !!!

        if(id !== Cairo.Constants.NO_ID) {
          self.edit(id);
        }
      };

      self.setWizardCompleteSuccess = function(rhs) {
        m_bWizardCompleteSuccess = rhs;
      };

      self.showFacturaProyecto = function(cliId,  vHoraIds) { // TODO: Use of ByRef founded Public Sub ShowFacturaProyecto(ByVal CliId As Long, ByRef vHoraIds() As Long)
        try {

          m_cliId = cliId;
          Cairo.Database.getData(mVentaConstantes.CLIENTE, mVentaConstantes.CLI_ID, cliId, mVentaConstantes.CLI_NAME, m_cliente);

          var i = null;
          G.redim(m_horaIds, vHoraIds.Length + 1);
          for (i = 1; i <= vHoraIds.Length + 1; i++) {
            m_horaIds[i] = vHoraIds(i - 1);
          }

          if(!pInitMembers()) {
            return;
          }

          pShowStartWizardProyecto();

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "ShowFacturaProyecto", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      self.showFacturaRemito = function(cliId,  vRvIds) { // TODO: Use of ByRef founded Public Sub ShowFacturaRemito(ByVal CliId As Long, ByRef vRvIds() As Long)
        try {

          m_cliId = cliId;
          Cairo.Database.getData(mVentaConstantes.CLIENTE, mVentaConstantes.CLI_ID, cliId, mVentaConstantes.CLI_NAME, m_cliente);

          var i = null;
          G.redim(m_rvIds, vRvIds.Length + 1);
          for (i = 1; i <= vRvIds.Length + 1; i++) {
            m_rvIds[i] = vRvIds(i - 1);
          }

          if(!pInitMembers()) {
            return;
          }

          pShowStartWizardRemito();

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "ShowFacturaRemito", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      self.showFacturaPedido = function(cliId,  vPvIds) { // TODO: Use of ByRef founded Public Sub ShowFacturaPedido(ByVal CliId As Long, ByRef vPvIds() As Long)
        try {

          m_cliId = cliId;
          Cairo.Database.getData(mVentaConstantes.CLIENTE, mVentaConstantes.CLI_ID, cliId, mVentaConstantes.CLI_NAME, m_cliente);

          var i = null;
          G.redim(m_pvIds, vPvIds.Length + 1);
          for (i = 1; i <= vPvIds.Length + 1; i++) {
            m_pvIds[i] = vPvIds(i - 1);
          }

          if(!pInitMembers()) {
            return;
          }

          pShowStartWizard();

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "ShowFacturaPedido", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      self.showFacturaPedidoAuto = function(cliId,  vPvIds,  vPviIds,  vPviCantidades) { // TODO: Use of ByRef founded Public Sub ShowFacturaPedidoAuto(ByVal CliId As Long, ByRef vPvIds() As Long, ByRef vPviIds() As Long, ByRef vPviCantidades() As Double)
        try {

          m_cliId = cliId;
          Cairo.Database.getData(mVentaConstantes.CLIENTE, mVentaConstantes.CLI_ID, cliId, mVentaConstantes.CLI_NAME, m_cliente);

          var i = null;
          G.redim(m_pvIds, vPvIds.Length + 1);
          for (i = 1; i <= vPvIds.Length + 1; i++) {
            m_pvIds[i] = vPvIds(i - 1);
          }

          G.redim(m_pviIds, vPviIds.Length + 1);
          for (i = 1; i <= vPviIds.Length + 1; i++) {
            m_pviIds[i] = vPviIds(i - 1);
          }

          G.redim(m_pviCantidades, vPviCantidades.Length + 1);
          for (i = 1; i <= vPviCantidades.Length + 1; i++) {
            m_pviCantidades[i] = vPviCantidades(i - 1);
          }

          if(!pInitMembers()) {
            return;
          }

          pShowStartWizard();

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "ShowFacturaPedido", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      self.showFacturaPacking = function(cliId,  vPklstIds) { // TODO: Use of ByRef founded Public Sub ShowFacturaPacking(ByVal CliId As Long, ByRef vPklstIds() As Long)
        try {

          m_cliId = cliId;
          Cairo.Database.getData(mVentaConstantes.CLIENTE, mVentaConstantes.CLI_ID, cliId, mVentaConstantes.CLI_NAME, m_cliente);

          var i = null;
          G.redim(m_pklstIds, vPklstIds.Length + 1);
          for (i = 1; i <= vPklstIds.Length + 1; i++) {
            m_pklstIds[i] = vPklstIds(i - 1);
          }

          if(!pInitMembers()) {
            return;
          }

          pShowStartWizardPacking();

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "ShowFacturaPacking", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var pInitMembers = function() {
        self.setDialog(new cABMGeneric());
        setCIEditGenericDoc_Footer(new cABMGeneric());
        setCIEditGenericDoc_Items(new cABMGeneric());

        if(!DoCairo.Security.anAccess(csVentasPrestacion.cSPREVTANEWFACTURA, Cairo.Constants.NO_ID, csE_DocTypePrestacion.cSEDOCTPRENEW)) {
          return null;
        }
        return true;
      };

      self.copy = function() {

        if(!Cairo.Security.docHasPermissionTo(
          CS.NEW_XXXX,
          m_docId,
          Cairo.Security.ActionTypes.create,
          true)) {
          return false;
        }

        updateList();

        m_isNew = true;

        if(m_listController !== null) {
          m_listController.updateEditorKey(self, NO_ID);
        }

        m_copy = true;
        m_docEditable = true;
        m_docEditMsg = "";

        D.setDocNumberForCliente(m_lastCliId, m_lastDocId, m_dialog).then(
          function(enabled) {
            m_taPropuesto = enabled;
            setEnabled();
          }
        );
      };

      self.editNew = function() {

        var p;

        updateList();

        m_isNew = true;

        if(m_listController !== null) {
          m_listController.updateEditorKey(self, NO_ID);
        }

        p = self.edit(NO_ID).then(function() {

          var p = null;

          m_lastCliId = NO_ID; can be lasCLiId or nothing

          if(!m_docEditable) {
            if(m_docEditMsg !== "") {
              p = M.showWarning(m_docEditMsg);
            }
          }

          return p || P.resolvedPromise();

        }).then(function() {

            var p = null;

            var docId = m_properties.item(C.DOC_ID).getSelectId();

            if(docId === NO_ID) {
              p = M.showInfo(getText(1562, ""));
            }

            return p || P.resolvedPromise();

          }).then(function() {

            setDatosProveedor();  can be setDatosCliente or nothing
            *
            can be setDocNumberForCliente or setDocNumber
            *
            return D.setDocNumberForProveedor(m_lastCliId, m_lastDocId, m_dialog)

          }).then(function(enabled) {

            m_taPropuesto = enabled;
            setColorBackground();
            return true;

          });

        return p;
      };

      self.getApplication = function() {
        return Cairo.appName;
      };

      self.editDocumentsEnabled = function() {
        return m_id !== Cairo.Constants.NO_ID;
      };

      self.copyEnabled = function() {
        return true;
      };

      self.addEnabled = function() {
        return true;
      };

      self.showDocDigital = function() {
        var _rtn = null;
        try {

          if(m_id == Cairo.Constants.NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(mVentaConstantes.FACTURAVENTA);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "cIABMClient_ShowDocDigital", C_MODULE, "");
        }

        return _rtn;
      };

      self.messageEx = function(messageID,  info) {
        var _rtn = null;

        switch (messageID) {
          case Dialogs.Message.MSG_DOC_FIRST:
          case Dialogs.Message.MSG_DOC_PREVIOUS:
          case Dialogs.Message.MSG_DOC_NEXT:
          case Dialogs.Message.MSG_DOC_LAST:
            _rtn = pMove(messageID);

            break;

          case Dialogs.Message.MSG_DOC_SIGNATURE:
            if(pFirmar()) {
              _rtn = true;
              load(m_id);
              pRefreshProperties();
            }
            else {
              _rtn = false;
            }

            break;

          case Dialogs.Message.MSG_GRID_ROW_DELETED:
            _rtn = true;
            if(info !== K_PERCEPCIONES) {
              calcularPercepciones();
            }
            updateTotals();

            break;

          case Dialogs.Message.MSG_DOC_APPLY:
            pShowApply();

            break;

          case Dialogs.Message.MSG_DOC_EDIT_STATE:
            //'Factura de Venta
            ShowEditState(m_docEditMsg, Cairo.Language.getText(1648, ""));

            break;

          case Dialogs.Message.MSG_DOC_DELETE:
            if(self.delete(m_id)) {
              _rtn = true;
              pMove(Dialogs.Message.MSG_DOC_NEXT);
            }

            break;

          case Dialogs.Message.MSG_DOC_ANULAR:
            DocAnular(m_id, m_estId, m_estado, csVentasPrestacion.cSPREVTAANULARFACTURA, csVentasPrestacion.cSPREVTADESANULARFACTURA, m_dialog, m_docEditable, m_docEditMsg, "sp_DocFacturaVentaAnular", "sp_DocFacturaVentaEditableGet");
            pSetEnabled();

            break;

          case Dialogs.Message.MSG_DOC_REFRESH:
            load(m_id);
            pRefreshProperties();

            break;

          case Dialogs.Message.MSG_DOC_NEW_WITH_WIZARD:
            _rtn = true;

            break;

          case Dialogs.Message.MSG_DOC_EX_GET_ITEMS:
            _rtn = m_items;

            break;

          case Dialogs.Message.MSG_DOC_EX_GET_FOOTERS:
            _rtn = m_footer;

            //' En info cABMInteface nos
            break;

          case Dialogs.Message.MSG_DOC_SEARCH                    :
            // indica si hay cambios sin
            // guardar
            cPublicDoc.documentSearch(csEDocumentoTipo.cSEDT_FACTURAVENTA, self, !CBool(info));

            break;

          case Dialogs.Message.MSG_DOC_DOC_AUX:

            if(m_id) {

              if(m_showStockData) {
                var abmObj = null;
                abmObj = m_dialog;

                //AbmObj.ShowPopMenu "&Ver Asiento~1|Ver Transferencia de Stock~2
                abmObj.ShowPopMenu(Cairo.Language.getText(1645, "")+ "~1|"+ Cairo.Language.getText(1646, "")+ "~2");
              }
              else {
                ShowDocAux(m_asId, "CSContabilidad2.cAsiento", "CSABMInterface2.cABMGeneric");
              }
            }
            else {
              MsgInfo(Cairo.Language.getText(1620, ""));
              //MsgInfo "Debe editar un comprobante guardado para poder ver los documentos auxiliares"
            }

            break;

          case Dialogs.Message.MSG_DOC_DOC_EDIT:

            if(m_id) {

              if(m_docEditable) {
                MsgInfo(Cairo.Language.getText(1555, ""));
                //MsgInfo "Este documento puede editarse normalmente
              }
              else {

                if(DocCanSave(m_dialog, mVentaConstantes.FV_FECHA)) {

                  var editDoc = null;
                  editDoc = new cEditDocEx();

                  editDoc.setObjectClient(self);
                  editDoc.edit(m_id, m_doctId, mVentaConstantes.FACTURAVENTA, mVentaConstantes.FV_ID, mVentaConstantes.FACTURAVENTAITEM, mVentaConstantes.FVI_ID, csVentasPrestacion.cSPREVTANEWFACTURA, csVentasPrestacion.cSPREVTAEDITFACTURA, m_cliId, Cairo.Constants.NO_ID, true);
                }

              }

            }
            else {
              MsgInfo(Cairo.Language.getText(1556, ""));
              //Esta opción solo sirve para modificar documentos guardados y aplicados
            }

            break;

          case Dialogs.Message.MSG_DOC_DOC_ACTION:

            if(m_id) {

              if(m_doctId !== 7) {

                pShowMenuDocAction();

              }
              else {

                MsgInfo(Cairo.Language.getText(4896, ""));
                //Esta opción solo sirve para facturas y notas de debito

              }

            }
            else {
              MsgInfo(Cairo.Language.getText(3955, ""));
              //Esta opción solo sirve para modificar documentos guardados y aplicados
            }

            break;

          case Dialogs.Message.MSG_MENU_AUX:

            switch (Cairo.Util.val(info)) {
              //' Asiento
              case 1:
                ShowDocAux(m_asId, "CSContabilidad2.cAsiento", "CSABMInterface2.cABMGeneric");

                //' Transferencia de stock
                break;

              case 2:
                ShowDocAux(m_stId, "CSStock2.cStock", "CSABMInterface2.cABMGeneric");

                break;

              case 3:
                pActionCobrar();

                break;

              case 4:
                pShowNotaCredito();

                break;

              case 5:
                pGetCAE();

                break;
            }

            break;

          case Dialogs.Message.MSG_DOC_HISTORY:

            if(m_id !== Cairo.Constants.NO_ID) {

              ShowHistory(csETablesVentas.cSFACTURAVENTA, m_id, m_documento+ " "+ m_nrodoc);
            }
            else {

              //' "El documento aun no ha sido guardado
              MsgInfo(Cairo.Language.getText(1552, ""));
            }

            break;

          case Dialogs.Message.MSG_EXPORT_GET_EMAIL:

            _rtn = cIABMProperty.getEmailFromCliente(m_cliId);

            break;

          case Dialogs.Message.MSG_GRID_VIRTUAL_ROW:

            _rtn = pProcessMultiRow(info);

            break;

          case Dialogs.Message.MSG_SAVE_AS:

            _rtn = pSaveAsPresupuesto();

            break;

          case Dialogs.Message.MSG_EXPORT_GET_FILE_NAME_POSTFIX:

            _rtn = pGetFileNamePostFix();

            break;

          case Dialogs.Message.MSG_PRINT_GET_TITLE:

            _rtn = m_nrodoc+ " - "+ m_cliente;

            break;

          case Dialogs.Message.MSG_ABM_KEY_F3:

            var iProp = null;
            iProp = info;
            if(iProp.getKey() == K_CLI_ID) {
              pShowNewCliente(iProp);
            }

            break;

          case Dialogs.Message.MSG_TOOLBAR_BUTTON_CLICK:
            if(info == "GRID") {
              pShowSearchZona();
            }

            break;
        }

        return p || P.resolvedPromise();
      };

      var pShowSearchZona = function() {
        var abmObj = null;

        if(m_searchZona == null) {

          m_searchZona = new cSearchZona();

        }

        if(!m_searchZona.getBShowed()) {

          abmObj = m_dialog;

          m_searchZona.edit(abmObj.getFrm());

        }

      };

      self.discardChanges = function() {
        return Cairo.Promises.resolvedPromise(refreshCollection());
      };

      self.propertyChange = function(key) {

        var p = null;
        
        switch (key) {

          case K_DOC_ID:

            // if the document has changed
            // 
            var changeInfo = D.docHasChanged(m_dialog, m_lastDocId);
            if(changeInfo.changed) {

              m_lastDocId = changeInfo.docId;
              m_lastDocName = changeInfo.docName;

              p = DB.getData("load[" + m_apiPath + "documento/" + m_lastDocId.toString() + "/info]");

              p = p.then(function(response) {

                if(response.success === true) {
                  m_lastMonId = valField(response.data, C.MON_ID);
                  m_lastDoctId = valField(response.data, C.DOCT_ID);
                  m_showStockData = valField(response.data, C.DOC_MUEVE_STOCK);
                  m_docSinPerc = valField(response.data, C.DOC_SIN_PERC);
                }
                return response.success;

              })
                .success(function() {

                  var p = null;

                  // when the document property is changed and the dialog was
                  // editing a saved invoice we need to move to a new invoice
                  // 
                  if(m_id !== NO_ID && m_docId !== m_lastDocId) {

                    if(m_copy) {

                      // don't make questions if we are creating a credit note from an invoice
                      //
                      if(m_fv_id_nc_based) {

                        // Nothing to do

                      }
                      else {

                        // TODO: we need to check:
                        //          - currency hasn't change
                        //          - the user has permission to create new documents
                        //          - the date must be in the range defined by control dates
                        //
                        p = M.confirmViewYesDefault(
                          getText(1621, ""), // Ud. ha cambiado el documento.;;¿Desea utilizar los datos ya cargados en el formulario para el nuevo comprobante?
                          getText(1622, "")  // CrowSoft
                        ).success(function() {
                            return self.edit(D.Constants.DOC_CHANGED);
                        });
                      }

                    }
                    else {
                      p = self.edit(D.Constants.DOC_CHANGED);
                    }
                  }

                  return p || P.resolvedPromise(true);

                })
                .success(function() {

                  return D.setDocNumberForCliente(m_lastCliId, m_lastDocId, m_dialog)
                    .then(function(info) {

                      m_taPropuesto = info.taEnabled;
                      m_rvTaPropuesto = info.taRemitoEnabled;
                      return showCotizacion();

                    })
                    .then(function() {

                      showHideCols(true);
                      setColorBackground();

                    });
                });
            }

            p = p || P.resolvedPromise();

            p.then(function() {
              setEnabled();
            });

            break;

          case K_CLI_ID:

            setDatosCliente().success(function() {
              
              calcularPercepciones();
              updateTotals();
              
              D.setDocNumberForCliente(m_lastCliId, m_lastDocId, m_dialog)
                .then(function(info) {

                  m_taPropuesto = info.taEnabled;
                  m_rvTaPropuesto = info.taRemitoEnabled;

                }).then(function() {
                  D.showDataAddCliente(Cairo.UserConfig.getShowDataAddInVentas(), m_dialog);
                });
            });
            break;

          case K_DESCUENTO1:
          case K_DESCUENTO2:

            updateTotals();
            break;

          case K_FECHA:

            if(m_lastFecha !== getFecha()) {
              m_lastFecha = getFecha();
              m_lastMonIdCotizacion = NO_ID;

              p = showCotizacion().then(function() {
                var properties = m_properties;
                properties.item(CV.FV_FECHA_IVA).setValue(properties.item(CV.FV_FECHA).getValue());
                m_dialog.showValue(properties.item(CV.FV_FECHA_IVA));

                loadPercepcionesForCliente(m_lastCliId, m_vPercepciones[], m_dialog.getProperties().item(CV.FV_FECHA).getValue());

                calcularPercepciones();
                updateTotals();

              });
            }
            break;

          case K_DEPL_ID:

            pSetStock();

            break;

          case K_CPG_ID:

            pShowFechaVto();

            // HIDECOLS
            //
            break;

          case K_HIDECOLS:

            pShowHideCols(false);

            break;
        }
      };

      self.save = function() {
        var _rtn = null;
        var cotizacion = null;
        var totalOrigen = null;
        var bMonedaLegal = null;
        var neto = null;
        var totalPercep = null;
        var ivaRi = null;
        var ivaRni = null;
        //' Internos
        var internos = null;
        var docId = null;
        var bIsNew = null;

        // Caja
        //
        if(!pValidateCajaState()) {
          _rtn = false;
          return _rtn;
        }

        // Save and State
        //
        if(!DocCanEdit(m_docEditable, m_docEditMsg)) {
          _rtn = true;
          return _rtn;
        }
        if(!DocCanSave(m_dialog, mVentaConstantes.FV_FECHA)) {
          _rtn = false;
          return _rtn;
        }

        if(pGetItems().getGrid().getRows().count() == 0) {
          //'El documento debe contener al menos un item
          MsgWarning(Cairo.Language.getText(3903, ""));
          _rtn = false;
          return _rtn;
        }

        var mouse = null;
        mouse = new cMouseWait();

        DoEvents:(DoEvents: DoEvents: DoEvents);

        var register = new Cairo.Database.Register();
        register.setFieldId(mVentaConstantes.FV_TMPID);
        register.setTable(mVentaConstantes.FACTURAVENTATMP);

        register.setId(Cairo.Constants.NEW_ID);

        var apiPath = Cairo.Database.getAPIVersion();
        register.setPath(apiPath + "general/facturaventa");

        if(m_copy) {
          register.getFields().add2(mVentaConstantes.FV_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);
          bIsNew = true;
        }
        else {
          register.getFields().add2(mVentaConstantes.FV_ID, m_id, Cairo.Constants.Types.long);
          bIsNew = m_id == Cairo.Constants.NO_ID;
        }

        if(m_estId == Cairo.Constants.NO_ID || bIsNew) {
          m_estId = CSGeneralEx2.csEEstado.cSEEST_PENDIENTE;
        }

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          var property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NUMERO:
              register.getFields().add2(mVentaConstantes.FV_NUMERO, property.getValue(), Cairo.Constants.Types.long);
              break;

            case K_NRODOC:
              register.getFields().add2(mVentaConstantes.FV_NRODOC, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_RV_NRODOC:
              register.getFields().add2(mVentaConstantes.RV_NRODOC, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_DESCRIP:
              register.getFields().add2(mVentaConstantes.FV_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_FECHA:
              register.getFields().add2(mVentaConstantes.FV_FECHA, property.getValue(), Cairo.Constants.Types.date);
              break;

            case K_FECHAENTREGA:
              register.getFields().add2(mVentaConstantes.FV_FECHAENTREGA, property.getValue(), Cairo.Constants.Types.date);
              break;

            case K_FECHAIVA:
              register.getFields().add2(mVentaConstantes.FV_FECHA_IVA, property.getValue(), Cairo.Constants.Types.date);
              break;

            case K_FECHAVTO:
              register.getFields().add2(mVentaConstantes.FV_FECHA_VTO, property.getValue(), Cairo.Constants.Types.date);
              break;

            case K_CLI_ID:
              register.getFields().add2(mVentaConstantes.CLI_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_CCOS_ID:
              register.getFields().add2(mVentaConstantes.CCOS_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_SUC_ID:
              register.getFields().add2(mVentaConstantes.SUC_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_DESCUENTO1:
              register.getFields().add2(mVentaConstantes.FV_DESCUENTO1, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_DESCUENTO2:
              register.getFields().add2(mVentaConstantes.FV_DESCUENTO2, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_DOC_ID:
              docId = property.getSelectId();
              register.getFields().add2(mVentaConstantes.DOC_ID, docId, Cairo.Constants.Types.id);
              break;

            case K_LP_ID:
              register.getFields().add2(mVentaConstantes.LP_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_LD_ID:
              register.getFields().add2(mVentaConstantes.LD_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_CPG_ID:
              register.getFields().add2(mVentaConstantes.CPG_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_COTIZACION:
              cotizacion = property.getValue();
              register.getFields().add2(mVentaConstantes.FV_COTIZACION, property.getValue(), Cairo.Constants.Types.double);
              break;

            case K_VEN_ID:
              register.getFields().add2(mVentaConstantes.VEN_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_CAI:
              register.getFields().add2(mVentaConstantes.FV_CAI, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_LGJ_ID:
              register.getFields().add2(mVentaConstantes.LGJ_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_PRO_ID_ORIGEN:
              register.getFields().add2(mVentaConstantes.PRO_ID_ORIGEN, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_PRO_ID_DESTINO:
              register.getFields().add2(mVentaConstantes.PRO_ID_DESTINO, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_TRANS_ID:
              register.getFields().add2(mVentaConstantes.TRANS_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_CLIS_ID:
              register.getFields().add2(mVentaConstantes.CLIS_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_DEPL_ID:
              register.getFields().add2(mVentaConstantes.DEPL_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_ORDENCOMPRA:
              register.getFields().add2(mVentaConstantes.FV_ORDEN_COMPRA, property.getValue(), Cairo.Constants.Types.text);
              break;
          }
        }

        // Manejo de la moneda y la cotizacion
        //
        bMonedaLegal = GetMonedaDefault == GetMonIdFromDoc(docId);
        if(bMonedaLegal) {
          cotizacion = 1;
        }
        else {
          if(cotizacion == 0) { cotizacion = 1; }
        }

        var _count = m_footer.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          property = m_footer.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NETO:
              neto = Cairo.Util.val(property.getValue());
              register.getFields().add2(mVentaConstantes.FV_NETO, neto * cotizacion, Cairo.Constants.Types.currency);
              break;

            case K_IVARI:
              ivaRi = Cairo.Util.val(property.getValue());
              register.getFields().add2(mVentaConstantes.FV_IVARI, ivaRi * cotizacion, Cairo.Constants.Types.currency);
              break;

            case K_IVARNI:
              ivaRni = Cairo.Util.val(property.getValue());
              register.getFields().add2(mVentaConstantes.FV_IVARNI, ivaRni * cotizacion, Cairo.Constants.Types.currency);

              // Internos
              break;

            case K_INTERNOS:
              internos = Cairo.Util.val(property.getValue());
              register.getFields().add2(mVentaConstantes.FV_IVARNI, internos * cotizacion, Cairo.Constants.Types.currency);

              break;

            case K_SUBTOTAL:
              register.getFields().add2(mVentaConstantes.FV_SUBTOTAL, Cairo.Util.val(property.getValue()) * cotizacion, Cairo.Constants.Types.currency);
              break;

            case K_IMPORTEDESC1:
              register.getFields().add2(mVentaConstantes.FV_IMPORTEDESC1, Cairo.Util.val(property.getValue()) * cotizacion, Cairo.Constants.Types.currency);
              break;

            case K_IMPORTEDESC2:
              register.getFields().add2(mVentaConstantes.FV_IMPORTEDESC2, Cairo.Util.val(property.getValue()) * cotizacion, Cairo.Constants.Types.currency);
              break;

            case K_TOTAPERCEPCIONES:
              totalPercep = Cairo.Util.val(property.getValue());
              register.getFields().add2(mVentaConstantes.FV_TOTAL_PERCEPCIONES, totalPercep * cotizacion, Cairo.Constants.Types.currency);
              break;
          }
        }

        // Internos
        totalOrigen = neto + totalPercep + internos;

        if(m_bIva) {
          totalOrigen = totalOrigen + ivaRi;
        }
        if(m_bIvaRni) {
          totalOrigen = totalOrigen + ivaRni;
        }

        register.getFields().add2(mVentaConstantes.FV_TOTAL, totalOrigen * cotizacion, Cairo.Constants.Types.currency);
        register.getFields().add2(mVentaConstantes.FV_GRABAR_ASIENTO, 1, Cairo.Constants.Types.boolean);
        register.getFields().add2(Cairo.Constants.EST_ID, m_estId, Cairo.Constants.Types.id);

        if(bMonedaLegal) {
          register.getFields().add2(mVentaConstantes.FV_TOTAL_ORIGEN, 0, Cairo.Constants.Types.currency);
        }
        else {
          register.getFields().add2(mVentaConstantes.FV_TOTAL_ORIGEN, totalOrigen, Cairo.Constants.Types.currency);
        }

        register.getFields().add2(mVentaConstantes.CJ_ID, m_cjId, Cairo.Constants.Types.id);

        register.getFields().setHaveLastUpdate(true);
        register.getFields().setHaveWhoModify(true);

        register.prepareTransaction();
        if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return _rtn; }

        if(!pSaveItems(register.getID(register), cotizacion, bMonedaLegal)) { return _rtn; }
        if(!mPercepciones.self.savePercepciones(cIABMGridCellValue.getItems(m_items, C_PERCEPCIONES), register.getID(), cotizacion, bMonedaLegal, m_copy, m_percepcionesDeleted, m_copy ? Cairo.Constants.NO_ID : m_id), C_MODULE)) { return _rtn; }

        var sqlstmt = null;
        var rs = null;
        sqlstmt = "sp_DocFacturaVentaSave "+ register.getID().toString();

        if(!Cairo.Database.saveSp(sqlstmt, rs, DocGetTimeOut(m_nrosSerie), "cIABMClient_Save", C_MODULE, c_ErrorSave)) {

          // Si el error es por clave duplicada
          if(CSKernelClient2.cError.getLastErrorNumber() == -2147217900) {
            if(CSKernelClient2.cError.getLastErrorDescription().indexOf("IX_FacturaVentaNroDocEmpresa", 1)) {
              pShowFacturaDuplicada();
            }
          }
          return _rtn;
        }

        if(rs.isEOF()) { return _rtn; }

        var id = null;
        if(!GetDocIDFromRecordset(rs, id)) { return _rtn; }

        m_copy = false;

        ////////////////////////////////////////////////////////////////////////
        //
        // Esto va aca si o si por que Load pone en csNo_Id a m_fv_id_nc_based
        //
        // Si la nota de credito se genero desde una factura
        //
        if(m_fv_id_nc_based) {

          sqlstmt = "sp_DocNCFacturaVentaSaveAplic "+ Cairo.Database.getUserId().toString()+ ","+ m_fv_id_nc_based+ ","+ id.toString();

          Cairo.Database.execute(sqlstmt);

        }
        //
        ////////////////////////////////////////////////////////////////////////

        if(load(id)) {

          var abmGen = null;
          abmGen = m_dialog;

          if(bIsNew) {

            if(m_userCfg.getPrintInNewFv()) {
              abmGen.PrintDocumento;
            }

            if(mPublic.self.isCobranzaPorCajero(m_id)) {

              var ctaCte = null;

              if(mPublic.self.ventasPorHojadeRuta()) {
                ctaCte = Ask(Cairo.Language.getText(5112, ""), vbNo);
              }
              else {
                ctaCte = false;
              }

              mPublic.self.saveFacturaVentaCajero(m_id, m_cjId, ctaCte);

            }
            else if(mPublic.self.isCobranzaContado(m_id)) {

              mPublic.self.showCobranzaContado(m_cliId, m_id, m_fecha, m_total * cotizacion, m_sucId, m_ccosId, m_lgjId, m_cjId);
            }
          }

          if(bIsNew) {

            abmGen.setSendNewDoc(m_userCfg.getNuevoAlGrabar());

          }
          else {

            abmGen.setSendNewDoc(false);

          }

          _rtn = true;

          pNotifyHojaRuta();

        }
        else {

          _rtn = false;

        }

        return _rtn;
      };

      var pNotifyHojaRuta = function() {
        try {

          if(m_hojaRuta !== null) {

            m_hojaRuta.self.addFvId(m_id);

          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "pNotifyHojaRuta", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var pShowFacturaDuplicada = function() {
        var nroDoc = null;
        var sqlstmt = null;
        var rs = null;
        var msg = null;

        nroDoc = m_dialog.getProperties().item(mVentaConstantes.FV_NRODOC).getValue();
        sqlstmt = "sp_DocFacturaVentaGetForNroDoc "+ Cairo.Database.sqlString(nroDoc)+ ","+ cUtil.getEmpId().toString();

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(!rs.isEOF()) {
          var w_fields = rs.getFields();
          msg = Cairo.Language.getText(1647, "", w_fields.Item(mVentaConstantes.FV_NRODOC).cIABMListItem.getValue(), w_fields.Item(mVentaConstantes.CLI_NAME).cIABMListItem.getValue(), w_fields.Item(mVentaConstantes.DOC_NAME).cIABMListItem.getValue(), w_fields.Item(mVentaConstantes.FV_FECHA).cIABMListItem.getValue());
          //La factura " & .Item(cscFvNrodoc).Value & " pertenece al cliente " & .Item(cscCliNombre).Value & " en el documento " & .Item(cscDocNombre).Value & " generada el " & .Item(cscFvFecha).Value

          MsgWarning(msg);
        }
      };

      var updateList = function() {
        if(m_id == Cairo.Constants.NO_ID) { return; }
        if(m_listController == null) { return; }

        if(m_isNew) {
          m_listController.addLeave(m_id, m_branchId);
        }
        else {
          m_listController.refreshBranch(m_id, m_branchId);
        }
      };

      self.terminate = function() {

        m_editing = false;

        try {
          if(m_listController !== null) {
            updateList();
            m_listController.removeEditor(self);
          }
        }
        catch (ignored) {
          Cairo.logError('Error in terminate', ignored);
        }
      };

      self.getPath = function() {
        return "#general/facturaventa/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "facturaventa" + id;
      };

      self.getTitle = function() {
        //'Facturas de Venta
        return Cairo.Language.getText(1624, "");
      };

      self.validate = function() {
        var property = null;

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_FECHA:
              if(ValEmpty(property.getValue(), Cairo.Constants.Types.date)) {
                //'Debe indicar una fecha
                MsgInfo(Cairo.Language.getText(1558, ""));
              }
              break;

            case K_FECHAENTREGA:
              if(ValEmpty(property.getValue(), Cairo.Constants.Types.date)) {
                //'Debe indicar una fecha de entrega
                MsgInfo(Cairo.Language.getText(1564, ""));
              }
              break;

            case K_FECHAVTO:
              if(ValEmpty(property.getValue(), Cairo.Constants.Types.date) && property.getVisible()) {
                //'Debe indicar una fecha de vencimiento
                MsgInfo(Cairo.Language.getText(1625, ""));
              }
              break;

            case K_CLI_ID:
              if(ValEmpty(property.getSelectId(), Cairo.Constants.Types.id)) {
                //'Debe indicar un cliente
                MsgInfo(Cairo.Language.getText(1563, ""));
              }
              break;

            case K_DOC_ID:
              if(ValEmpty(property.getSelectId(), Cairo.Constants.Types.id)) {
                //'Debe indicar un documento
                MsgInfo(Cairo.Language.getText(1562, ""));
              }
              break;

            case K_CPG_ID:
              if(ValEmpty(property.getSelectId(), Cairo.Constants.Types.id)) {
                //'Debe indicar una condición de pago
                MsgInfo(Cairo.Language.getText(1561, ""));
              }
              break;

            case K_SUC_ID:
              if(ValEmpty(property.getSelectId(), Cairo.Constants.Types.id)) {
                //'Debe indicar una sucursal
                MsgInfo(Cairo.Language.getText(1560, ""));
              }
              break;

            case K_COTIZACION:
              if(ValEmpty(property.getValue(), Cairo.Constants.Types.double) && property.getVisible()) {
                //'Debe indicar una cotización
                MsgInfo(Cairo.Language.getText(1626, ""));
              }
              break;

            case K_DEPL_ID:
              if(ValEmpty(property.getSelectId(), Cairo.Constants.Types.id) && m_showStockData) {
                //'Debe indicar un deposito
                MsgInfo(Cairo.Language.getText(1559, ""));
              }
              break;
          }
        }

        if(!pValidateCuentaMoneda()) { return false; }

        var abmObj = null;
        abmObj = m_dialog;

        if(!abmObj.getBSavingAs()) {

          if(!pValidateCuit(m_dialog.getProperties().item(mVentaConstantes.CLI_ID).getSelectId())) { return false; }

        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var pValidateCuit = function(cliId) {
        var _rtn = null;
        try {

          var sqlstmt = null;
          var rs = null;
          var cuit = null;

          if(cliId !== Cairo.Constants.NO_ID) {

            sqlstmt = "select cli_catfiscal, cli_cuit from cliente where cli_id="+ cliId.toString();

            if(!Cairo.Database.openRs(sqlstmt, rs)) { return _rtn; }

            if(!rs.isEOF()) {

              cuit = Cairo.Database.valField(rs.getFields(), mVentaConstantes.CLI_CUIT);

              switch (Cairo.Database.valField(rs.getFields(), mVentaConstantes.CLI_CATFISCAL)) {
                case csCatFiscal.cSCATFCONSUMIDORFINAL:
                case csCatFiscal.cSCATFEXENTO:
                case csCatFiscal.cSCATFEXTRANJERO:
                case csCatFiscal.cSCATFNOCATEGORIZADO:
                  //'csCatFExtranjeroIva,csCatFMonoTributo, csCatFInscripto,
                  break;

                default:
                  //csCatFNoInscripto, csCatFNoResponsableExento, csCatFInscriptoM
                  if(cuit.$.trim() == "") {
                    MsgWarning(Cairo.Language.getText(1627, ""));
                    //Para poder crear la factura debe dar de alta el CUIT del cliente
                    return _rtn;
                  }
                  else {
                    if(!Object.validateNroCuit(cuit, true)) { return _rtn; }
                  }
                  break;
              }
            }
            else {
              MsgWarning(Cairo.Language.getText(1627, ""));
              //No se pudo obtener el Cuit del Cliente
            }
          }

          _rtn = true;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "pValidateCuit", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var pValidateCuentaMoneda = function() {
        var monIdCliente = null;
        var monIdDocumento = null;

        if(!pGetCueIdCliente(monIdCliente, 0)) { return false; }
        if(!Cairo.Database.getData(mVentaConstantes.DOCUMENTO, mVentaConstantes.DOC_ID, m_lastDocId, mVentaConstantes.MON_ID, monIdDocumento)) { return false; }

        if(monIdCliente !== monIdDocumento) {
          MsgInfo(Cairo.Language.getText(1629, ""));
          //La cuenta asociada al Cliente y la cuenta del Documento tienen diferentes monedas
          return null;
        }
        return true;
      };

      var isEmptyRow = function(key,  row,  rowIndex) {
        var _rtn = null;
        try {

          switch (key) {
            case K_ITEMS:
              _rtn = pIsEmptyRow(row, rowIndex);

              break;

            case K_PERCEPCIONES:
              _rtn = mPercepciones.self.isEmptyRowPercepciones(row, rowIndex);

              break;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "isEmptyRow", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      //-------------------------------------------------------------------------------------
      // Documento
      var getCIDocumento_DocId = function() {
        return m_docId;
      };

      var getCIDocumento_DocTId = function() {
        return m_doctId;
      };

      var getCIDocumento_Id = function() {
        return m_id;
      };

      var cIDocumento_LoadForPrint = function(id) {
        var _rtn = null;
        try {

          var sqlstmt = null;
          var rs = null;

          sqlstmt = "select fv.doct_id, fv.doc_id, fv_nrodoc, cli_nombre, fv.cli_id from FacturaVenta fv inner join Cliente cli on fv.cli_id = cli.cli_id where fv.fv_id = "+ id.toString();
          if(!Cairo.Database.openRs(sqlstmt, rs)) { return _rtn; }

          m_id = id;
          m_docId = Cairo.Database.valField(rs.getFields(), mVentaConstantes.DOC_ID);
          m_doctId = Cairo.Database.valField(rs.getFields(), mVentaConstantes.DOCT_ID);
          m_cliId = Cairo.Database.valField(rs.getFields(), mVentaConstantes.CLI_ID);
          m_cliente = Cairo.Database.valField(rs.getFields(), mVentaConstantes.CLI_NAME);
          m_nrodoc = Cairo.Database.valField(rs.getFields(), mVentaConstantes.FV_NRODOC);

          _rtn = true;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "cIDocumento_LoadForPrint", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      //-------------------------------------------------------------------------------------
      self.getDialog = function() {
        return m_dialog;
      };

      self.setTreeId = function(rhs) {
        m_treeId = rhs;
      };

      self.getTreeId = function() {
        return m_treeId;
      };

      self.list = function() {
        return Cairo.Security.hasPermissionTo(csVentasPrestacion.cSPREVTALISTFACTURA);
      };

      self.setDialog = function(rhs) {
        m_dialog = rhs;
        m_dialog.setIsDocument(true);

                #If !PREPROC_SFS Then;

        var abmGen = null;

        abmGen = m_dialog;
        abmGen.FactoryObject = "CSABMInterface2.cFactory";
        abmGen.ObjForm = "CSABMInterface2.fFacturaVenta";

                #End If;

      };

      self.isEditing = function() {
        return m_editing;
      };

      self.edit = function(id,  inModalWindow) {
        var p = Cairo.Promises.resolvedPromise(false);
        try {

          if(!DoCairo.Security.anAccess(csVentasPrestacion.cSPREVTALISTFACTURA, GetdocIdFromObjAbm(m_dialog), csE_DocTypePrestacion.cSEDOCTPRELIST)) { return p; }

          // Id = csDocChanged esto significa que se cambio
          //                   el documento estando en un
          //                   comprobante ya guardado
          //
          m_isNew = id == Cairo.Constants.NO_ID || id == csDocChanged;

          p = load(id).then(
            function(success) {
              if(success) {

                if(m_dialog.getProperties().count() == 0) {
                  if(!loadCollection()) { return false; }
                }
                else {
                  pRefreshProperties();
                }

                var abmGen = null;
                abmGen = m_dialog;
                abmGen.NewKeyPropFocus = "";

                // Solo muestro asistentes si el nuevo no se esta dando por
                // un cambio de documento
                //
                if(id !== csDocChanged && m_isNew && pDocDesdePedido()) {

                  pShowStartWizard();

                }
                else if(id !== csDocChanged && m_isNew && pDocDesdeRemito()) {

                  pShowStartWizardRemito();

                }
                else if(id !== csDocChanged && m_isNew && pDocDesdePacking()) {

                  pShowStartWizardPacking();

                }
                else if(id !== csDocChanged && m_isNew && pDocDesdeProyecto()) {

                  pShowStartWizardProyecto();

                }
                else {
                  abmGen.NewKeyPropFocus = mVentaConstantes.CLI_ID;
                }

                m_editing = true;
                m_copy = false;

                success = true;
              }
              return success;
            });
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "cIEditGeneric_Edit", C_MODULE, "");
        }

        return p;
      };

      self.setTree = function(rhs) {
        m_listController = rhs;
      };

      self.setBranchId = function(rhs) {
        m_branchId = rhs;
      };

      self.getBranchId = function() {
        return m_branchId;
      };

      var columnAfterUpdate = function(key,  lRow,  lCol) {
        var _rtn = null;
        try {

          switch (key) {
            case K_ITEMS:
              var w_pGetItems = pGetItems();

              var row = null;
              row = w_pGetItems.getGrid().getRows(lRow);

              pShowImporteAndIva(row);
              calcularPercepciones();
              updateTotals();
              _rtn = true;

              break;

            case K_PERCEPCIONES:
              updateTotals();
              _rtn = true;
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

      var pProcessMultiRow = function(info) {
        var _rtn = null;

        info.bAddRows = false;

        switch (info.Key) {
          case K_ITEMS:
            var w_pGetItems = pGetItems();

            var row = null;
            row = w_pGetItems.getGrid().getRows(info.lRow);

            if(row.item(info.lCol).getKey() == KI_PR_ID) {

              var oCell = null;

              oCell = Dialogs.cell(row, KI_PR_ID);

              if(LenB(oCell.getSelectIntValue())) {
                if(oCell.getSelectIntValue().indexOf(",", 1)) {
                  AddMultiRowsVentas(oCell.getSelectIntValue(), info, KI_CANTIDAD);
                  _rtn = true;
                }
              }
            }
            break;
        }


        return _rtn;
      };

      var columnAfterEdit = function(key,  lRow,  lCol,  newValue,  newValueID) {
        var _rtn = null;
        try {

          switch (key) {
            case K_ITEMS:
              _rtn = pColumnAfterEdit( pGetItems(), lRow, lCol, newValue, newValueID);

              break;

            case K_PERCEPCIONES:
              _rtn = mPercepciones.self.columnAfterEditPercepciones( m_items.getProperties().item(C_PERCEPCIONES), lRow, lCol, newValue, newValueID);
              break;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "columnAfterEdit", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var columnBeforeEdit = function(key,  lRow,  lCol,  iKeyAscii) {
        var _rtn = null;
        try {

          switch (key) {
            case K_ITEMS:
              _rtn = pColumnBeforeEdit( pGetItems(), lRow, lCol, iKeyAscii);
              break;

            case K_PERCEPCIONES:
              _rtn = true;
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

      var pColumnBeforeEdit = function(property,  lRow,  lCol,  iKeyAscii) { // TODO: Use of ByRef founded Private Function pColumnBeforeEdit(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long, ByVal iKeyAscii As Integer) As Boolean
        var _rtn = null;
        var row = null;

        switch (property.getGrid().getColumns(lCol).Key) {
          case KI_NROSERIE:
            row = property.getGrid().getRows(lRow);
            if(row !== null) {
              _rtn = Dialogs.cell(row, KI_PR_LLEVANROSERIE).getID();
            }

            // Lote
            //
            break;

          case KI_STL_ID:
            row = property.getGrid().getRows(lRow);

            if(row !== null) {

              if(Dialogs.cell(row, KI_PR_LLEVALOTE).getID() && Dialogs.cell(row, KI_PR_LLEVANROSERIE).getID() == 0) {

                var pr_id_kit = null;
                if(Dialogs.cell(row, KI_ES_KIT).getID()) {
                  pr_id_kit = Dialogs.cell(row, KI_PR_ID).getID();
                }

                var property = property.getGrid().getColumns().item(mVentaConstantes.STL_ID);
                property.setSelectFilter("'pr_id = "+ Dialogs.cell(row, KI_PR_ID).getID().toString()+ " and "+ GetStockLoteFilterEx(pGetDeplId(), m_stockConfig.getStockXFisico(), pr_id_kit, m_depfId, pGetCliId(), Cairo.Constants.NO_ID)+ "'");

                var abmObj = null;
                abmObj = m_dialog;

                abmObj.RefreshColumnProperties(property, mVentaConstantes.STL_ID);

                _rtn = true;

              }
            }

            break;

          default:
            _rtn = true;
            break;
        }

        return _rtn;
      };

      var pGetPrecioFromRow = function(row) {
        var precio = null;

        var w_pCell = Dialogs.cell(row, KI_PRECIO_USR);
        if(G.isNumeric(w_pCell.getValue())) {
          precio = Double.parseDouble(w_pCell.getValue());
        }
        else {
          precio = 0;
        }

        return precio;
      };

      var pColumnAfterEdit = function(property,  lRow,  lCol,  newValue,  newValueID) { // TODO: Use of ByRef founded Private Function pColumnAfterEdit(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long, ByVal NewValue As Variant, ByVal NewValueID As Long) As Boolean
        var row = null;

        switch (property.getGrid().getColumns(lCol).Key) {
          case KI_PR_ID:
            row = property.getGrid().getRows(lRow);
            pSetDataProducto(row, newValueID);
            SetPrecio(row, newValueID, m_dialog.getProperties().item(mVentaConstantes.LP_ID), KI_PRECIO_LP, KI_PRECIO_USR);
            cIABMGridCellValue.setDescuento(row, newValueID, pGetPrecioFromRow(row), m_dialog.getProperties().item(mVentaConstantes.LD_ID), KI_PRECIO, KI_DESCUENTO);
            pSetTasasImpositivas(row, newValueID, newValue);

            break;

          case KI_PRECIO_USR:
            row = property.getGrid().getRows(lRow);
            cIABMGridCellValue.setDescuento(row, Dialogs.cell(row, KI_PR_ID).getID(), newValue, m_dialog.getProperties().item(mVentaConstantes.LD_ID), KI_PRECIO, KI_DESCUENTO);

            break;
        }

        return true;
      };

      var columnButtonClick = function(key,  lRow,  lCol,  iKeyAscii) {
        var _rtn = null;
        var row = null;

        switch (key) {
          case K_ITEMS:
            var w_pGetItems = pGetItems().getGrid();
            switch (w_pGetItems.Columns(lCol).key) {
              case KI_NROSERIE:
                row = w_pGetItems.Rows(lRow);
                if(Dialogs.cell(row, KI_PR_LLEVANROSERIE).getID()) {

                  var prId = null;

                  prId = Dialogs.cell(row, KI_PR_ID).getID();

                  // nrs devolucion
                  _rtn = EditNroSerie(Dialogs.cell(row, KI_GRUPO).getID(), Cairo.Util.val(Dialogs.cell(row, KI_CANTIDAD).getValue()), row, m_nrosSerie, KI_GRUPO, KI_NROSERIE, lRow, prId, pGetDeplId(), false, Dialogs.cell(row, KI_ES_KIT).getID(), GetKitInfo(prId, m_collKitInfo), Cairo.Constants.NO_ID, pGetCliId());
                }
                break;
            }
            break;
        }

        return _rtn;
      };

      var columnClick = function(key,  lRow,  lCol) {

      };

      var dblClick = function(key,  lRow,  lCol) {

      };

      var deleteRow = function(key,  row,  lRow) {
        var id = null;

        switch (key) {
          case K_ITEMS:
            id = Cairo.Util.val(Dialogs.cell(row, KI_FVI_ID).getValue());
            if(id !== Cairo.Constants.NO_ID) { m_itemsDeleted = m_itemsDeleted+ id.toString()+ ","; }

            break;

          case K_PERCEPCIONES:
            id = Cairo.Util.val(Dialogs.cell(row, mPercepciones.kIP_FVPERC_ID).getValue());
            if(id !== Cairo.Constants.NO_ID) { m_percepcionesDeleted = m_percepcionesDeleted+ id.toString()+ ","; }
            break;
        }

        return true;
      };

      var listAdHock = function(key,  row,  colIndex,  list) {

      };

      var newRow = function(key,  rows) {

      };

      var validateRow = function(key,  row,  rowIndex) {
        var _rtn = null;
        try {

          switch (key) {
            case K_ITEMS:
              _rtn = pValidateRow(row, rowIndex);
              break;

            case K_PERCEPCIONES:
              _rtn = mPercepciones.self.validateRowPercepciones(row, rowIndex);
              break;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "validateRow", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var pIsEmptyRow = function(row,  rowIndex) {
        var cell = null;

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_CANTIDAD:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.currency)) {
                if(Cairo.Util.val(cell.getValue()) !== 1) {
                  bRowIsEmpty = false;
                  break;
                }
              }
              break;

            case KI_PRECIO:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.currency)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KI_PR_ID:
              if(!ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                bRowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pValidateRow = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function pValidateRow(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var bLlevaNroSerie = null;
        var cantidad = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case KI_CANTIDAD:
              cantidad = Cairo.Util.val(cell.getValue());
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.currency)) {
                MsgInfo(Cairo.Language.getText(1365, "", strRow));
                //Debe indicar una cantidad (1)
              }

              break;

            case KI_PRECIO:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.currency)) {

                if(!Ask(Cairo.Language.getText(2538, "", strRow), vbYes)) {
                  //Confirma el precio cero para el item (1)
                  MsgInfo(Cairo.Language.getText(1667, "", strRow));
                  //Debe indicar un precio (1)
                }
              }

              break;

            case KI_PR_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                MsgInfo(Cairo.Language.getText(1565, "", strRow));
                //Debe indicar un producto de venta (1)
              }

              break;

            case KI_NROSERIE:
              bLlevaNroSerie = Dialogs.cell(row, KI_PR_LLEVANROSERIE).getID();
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.text) && bLlevaNroSerie && m_showStockData) {
                MsgInfo(Cairo.Language.getText(1630, "", strRow));
                //Debe indicar un numero de serie (1)
              }

              // Lote
              //
              // Lote Fifo
              //
              break;

            case KI_STL_ID:
              if(m_showStockData) {
                if(ValEmpty(cell.getId(), Cairo.Constants.Types.id) && Dialogs.cell(row, KI_PR_LLEVALOTE).getID() && Dialogs.cell(row, KI_PR_LLEVANROSERIE).getID() == 0 && Dialogs.cell(row, KI_PR_LOTEFIFO).getID() == 0) {

                  MsgInfo(Cairo.Language.getText(1632, "", strRow));
                  //Debe indicar un lote (1)
                }
              }

              // TO
              break;

            case KI_TO_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                MsgInfo(Cairo.Language.getText(1633, "", strRow));
                //Debe indicar un Tipo de Operación (1)
              }
              break;
          }
        }

        // Si lleva numero de serie valido que
        // la cantidad indicada sea la misma
        // que en la coleccion de numeros de serie
        //
        if(bLlevaNroSerie && m_showStockData) {

          var prId = null;

          prId = Dialogs.cell(row, KI_PR_ID).getID();

          if(!NroSerieValidateCount(row, KI_GRUPO, rowIndex, m_nrosSerie, cantidad, strRow, KI_PR_ID, KI_CANTIDAD, KI_NROSERIE, prId, pGetDeplId(), false)) {
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      // funciones privadas
      var loadCollection = function() {
        var filter = null;
        var c = null;
                #If PREPROC_SFS Then;
        var abmGen = null;
                #Else;
        var abmGen = null;
                #End If;
        var cotizacion = null;

        // Preferencias del usuario
        //
        var bValidateDocDefault = null;

        abmGen = m_dialog;

        if(m_userCfg.getShowSaveAs()) {

          abmGen.setButtonsEx2(csButtons.bUTTON_SAVE_AS);
          abmGen.setButtonsEx3(csButtons.bUTTON_GRID);
          abmGen.InitButtons;

        }

        abmGen.ResetLayoutMembers;
        abmGen.setSendNewDoc(m_userCfg.getNuevoAlGrabar());

        // DATADD
        if(m_userCfg.getShowDataAddInVentas()) {
          abmGen.SetHeightToDocWithDescrip;
        }

        m_dialog.getProperties().clear();

        var w_tabs = m_dialog.getTabs();

        w_tabs.clear();

        var tab = w_tabs.add(null);
        tab.setName(Cairo.Constants.c_strGeneral);

        var tab = w_tabs.add(null);
        tab.setIndex(1);
        //'Adicionales
        tab.setName(Cairo.Language.getText(1566, ""));

        var properties = m_dialog.getProperties();

        var elem = properties.add(null, mVentaConstantes.DOC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSDocumento2.CSDocumento);
        //'Documento
        elem.setName(Cairo.Language.getText(1567, ""));
        elem.setKey(K_DOC_ID);

        if(m_docId !== Cairo.Constants.NO_ID) {
          elem.setSelectId(m_docId);
          elem.setValue(m_documento);
        }
        else {
          // Preferencias del usuario
          //
          elem.setSelectId(m_userCfg.getDocFvId());
          elem.setValue(m_userCfg.getDocFvNombre());

          bValidateDocDefault = elem.getSelectId() !== Cairo.Constants.NO_ID;
        }

        elem.setSelectFilter(pGetDocFilter());

        var elem = properties.add(null, cDeclarations.getCsDocNumberID());
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.Integer);
        //'Número
        elem.setName(Cairo.Language.getText(1065, ""));
        elem.setKey(K_NUMERO);
        elem.setValue(m_numero);
        elem.setEnabled(false);

        var elem = properties.add(null, cDeclarations.getCsDocEstateID());
        elem.setType(Dialogs.PropertyType.text);
        //'Estado
        elem.setName(Cairo.Language.getText(1568, ""));
        elem.setKey(K_EST_ID);
        elem.setValue(m_estado);
        elem.setEnabled(false);

        var elem = properties.add(null, mVentaConstantes.FV_FECHA);
        elem.setType(Dialogs.PropertyType.date);
        //'Fecha
        elem.setName(Cairo.Language.getText(1569, ""));
        elem.setLeftLabel(-580);
        elem.setLeft(700);
        elem.setKey(K_FECHA);
        elem.setValue(m_fecha);

        var elem = properties.add(null, mVentaConstantes.FV_FECHAENTREGA);
        elem.setType(Dialogs.PropertyType.date);
        //'Entrega
        elem.setName(Cairo.Language.getText(1570, ""));
        elem.setKey(K_FECHAENTREGA);
        elem.setValue(m_fechaentrega);
        elem.setTopToPrevious(360);

        var elem = properties.add(null, mVentaConstantes.CLI_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CLIENTE);
        elem.setTopFromProperty(mVentaConstantes.FV_FECHA);
        elem.setLeft(2700);
        elem.setLeftLabel(-580);
        //'Cliente
        elem.setName(Cairo.Language.getText(1150, ""));
        elem.setKey(K_CLI_ID);
        elem.setSelectId(m_cliId);
        elem.setValue(m_cliente);
        abmGen.NewKeyPropFocus = mVentaConstantes.CLI_ID;

        // CLI-WIDTH
        elem.setWidth(5450);

        var elem = properties.add(null, mVentaConstantes.FV_NRODOC);
        elem.setType(Dialogs.PropertyType.text);
        //'Número
        elem.setName(Cairo.Language.getText(1065, ""));
        elem.setSize(50);
        elem.setKey(K_NRODOC);
        elem.setValue(m_nrodoc);
        elem.setTextMask(m_taMascara);
        elem.setTextAlign(vbRightJustify);
        elem.setTopToPrevious(360);

        var elem = properties.add(null, mVentaConstantes.CPG_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CONDICIONPAGO);
        //'Cond. pago
        elem.setName(Cairo.Language.getText(1571, ""));
        elem.setKey(K_CPG_ID);
        elem.setSelectId(m_cpgId);
        elem.setValue(m_condicionPago);

        // CLI-WIDTH
        elem.setTopFromProperty(mVentaConstantes.FV_FECHA);
        elem.setLeft(9400);
        elem.setLeftLabel(-1200);

        var elem = properties.add(null, mVentaConstantes.FV_FECHA_VTO);
        elem.setType(Dialogs.PropertyType.date);
        //'Vto.
        elem.setName(Cairo.Language.getText(1634, ""));
        elem.setKey(K_FECHAVTO);
        elem.setValue(m_fechaVto);

        // CLI-WIDTH
        elem.setTopFromProperty(mVentaConstantes.FV_FECHA);
        elem.setTopToPrevious(360);
        elem.setLeft(5900);
        elem.setLeftLabel(-350);

        var elem = properties.add(null, mVentaConstantes.FV_COTIZACION);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setLeftLabel(-800);
        //'Cotización
        elem.setName(Cairo.Language.getText(1635, ""));
        elem.setFormat(m_generalConfig.getFormatDecCotizacion());
        elem.setKey(K_COTIZACION);
        elem.setValue(m_cotizacion);
        elem.setWidth(1000);
        elem.setTopToPrevious(360);

        if(m_cotizacion !== 0) {
          cotizacion = m_cotizacion;
        }
        else {
          cotizacion = 1;
        }

        var elem = properties.add(null, mVentaConstantes.FV_DESCUENTO1);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
        elem.setLeftLabel(-600);
        //'Desc. 1
        elem.setName(Cairo.Language.getText(1573, ""));
        elem.setKey(K_DESCUENTO1);
        elem.setValue(m_descuento1);
        elem.setWidth(1000);
        elem.setTopToPrevious(360);

        var elem = properties.add(null, mVentaConstantes.FV_DESCUENTO2);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
        elem.setTopFromProperty(mVentaConstantes.FV_DESCUENTO1);
        elem.setLeft(7150);
        elem.setLeftLabel(-150);
        elem.setName("2");
        elem.setKey(K_DESCUENTO2);
        elem.setValue(m_descuento2);
        elem.setWidth(1000);

        var elem = properties.add(null, mVentaConstantes.LP_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.LISTAPRECIO);
        //'Lista de Precios
        elem.setName(Cairo.Language.getText(1397, ""));
        elem.setSelectFilter(GetListaPrecioGetXCliente(m_docId, m_cliId));
        elem.setKey(K_LP_ID);
        elem.setSelectId(m_lpId);
        elem.setValue(m_listaPrecio);

        // CLI-WIDTH
        elem.setTopFromProperty(mVentaConstantes.CPG_ID);
        elem.setTopToPrevious(360);
        elem.setLeftFromProperty(mVentaConstantes.CPG_ID);
        elem.setLeftLabel(-1200);

        var elem = properties.add(null, mVentaConstantes.LD_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.LISTADESCUENTO);
        //'Lista de Descuentos
        elem.setName(Cairo.Language.getText(4984, ""));
        elem.setSelectFilter(GetListaDescGetXCliente(m_docId, m_cliId));
        elem.setKey(K_LD_ID);
        elem.setSelectId(m_ldId);
        elem.setValue(m_listaDescuento);
        elem.setTopToPrevious(360);

        var elem = properties.add(null, mVentaConstantes.VEN_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.VENDEDORES);
        //'Vendedor
        elem.setName(Cairo.Language.getText(1510, ""));
        elem.setKey(K_VEN_ID);
        elem.setSelectId(m_venId);
        elem.setValue(m_vendedor);
        elem.setTopToPrevious(360);

        var elem = properties.add(null, mVentaConstantes.SUC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.SUCURSAL);
        //'Sucursal
        elem.setName(Cairo.Language.getText(1281, ""));
        elem.setKey(K_SUC_ID);
        elem.setSelectId(m_sucId);
        elem.setValue(m_sucursal);
        elem.setTopToPrevious(360);
        elem.setLeftFromProperty(mVentaConstantes.CPG_ID);

        var elem = properties.add(null, mVentaConstantes.FV_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        //'Observ.
        elem.setName(Cairo.Language.getText(1211, ""));
        elem.setLeftLabel(-600);
        elem.setSize(5000);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);
        elem.setLeftFromProperty(mVentaConstantes.FV_FECHA);
        elem.setTopFromProperty(mVentaConstantes.FV_NRODOC);
        elem.setWidth(4300);
        elem.setHeight(1000);
        elem.setTopToPrevious(360);

        var elem = properties.add(null, mVentaConstantes.LGJ_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSLEGAJO);
        elem.setLeft(1500);
        //'Legajo
        elem.setName(Cairo.Language.getText(1575, ""));
        elem.setKey(K_LGJ_ID);
        elem.setSelectId(m_lgjId);
        elem.setValue(m_legajo);
        elem.setTabIndex(1);

        var elem = properties.add(null, mVentaConstantes.CLIS_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.SUCURSALCLIENTE);
        //'Sucursal del Cliente
        elem.setName(Cairo.Language.getText(1576, ""));
        elem.setKey(K_CLIS_ID);
        elem.setValue(m_clienteSucursal);
        elem.setSelectId(m_clisId);
        elem.setSelectFilter(GetHelpFilterCliSuc(m_cliId));
        elem.setTabIndex(1);

        var elem = properties.add(null, mVentaConstantes.TRANS_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TRANSPORTE);
        //'Transporte
        elem.setName(Cairo.Language.getText(1050, ""));
        elem.setKey(K_TRANS_ID);
        elem.setValue(m_transporte);
        elem.setSelectId(m_transId);
        elem.setTabIndex(1);

        var elem = properties.add(null, mVentaConstantes.FV_ORDEN_COMPRA);
        elem.setType(Dialogs.PropertyType.text);
        //'Orden de Compra
        elem.setName(Cairo.Language.getText(1924, ""));
        elem.setKey(K_ORDENCOMPRA);
        elem.setValue(m_ordenCompra);
        elem.setTabIndex(1);

        var elem = properties.add(null, mVentaConstantes.PRO_ID_ORIGEN);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROVINCIA);
        //'Pcia. Origen
        elem.setName(Cairo.Language.getText(1577, ""));
        elem.setKey(K_PRO_ID_ORIGEN);
        elem.setSelectId(m_proIdOrigen);
        elem.setValue(m_proOrigen);
        elem.setTabIndex(1);

        var elem = properties.add(null, mVentaConstantes.PRO_ID_DESTINO);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROVINCIA);
        //'Pcia. Destino
        elem.setName(Cairo.Language.getText(1578, ""));
        elem.setKey(K_PRO_ID_DESTINO);
        elem.setSelectId(m_proIdDestino);
        elem.setValue(m_proDestino);
        elem.setTabIndex(1);

        var elem = properties.add(null, mVentaConstantes.FV_CAI);
        elem.setType(Dialogs.PropertyType.text);
        //'Cai
        elem.setName(Cairo.Language.getText(1636, ""));
        elem.setKey(K_CAI);
        elem.setValue(m_cai);
        elem.setTabIndex(1);

        var elem = properties.add(null, mVentaConstantes.DEPL_ID_ORIGEN);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DEPOSITOLOGICO);
        //'Deposito
        elem.setName(Cairo.Language.getText(1574, ""));
        elem.setKey(K_DEPL_ID);

        if(m_deplId !== Cairo.Constants.NO_ID || !m_showStockData) {
          elem.setSelectId(m_deplId);
          elem.setValue(m_deposito);
        }
        else {
          // Preferencias del usuario
          //
          elem.setSelectId(m_userCfg.getDeplId());
          elem.setValue(m_userCfg.getDeplNombre());
        }
        elem.setEnabled(m_showStockData);
        elem.setTabIndex(1);

        var elem = properties.add(null, mVentaConstantes.CCOS_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTROCOSTO);
        //'Centro de Costo
        elem.setName(Cairo.Language.getText(1057, ""));
        elem.setKey(K_CCOS_ID);
        elem.setSelectId(m_ccosId);
        elem.setValue(m_centroCosto);
        elem.setTabIndex(1);

        var elem = properties.add(null, mVentaConstantes.RV_NRODOC);
        elem.setType(Dialogs.PropertyType.text);
        //'Remito
        elem.setName(Cairo.Language.getText(1637, ""));
        elem.setSize(50);
        elem.setKey(K_RV_NRODOC);
        elem.setTextMask("");
        elem.setTextAlign(vbRightJustify);
        elem.setTabIndex(1);

        var elem = properties.add(null, mVentaConstantes.FV_FECHA_IVA);
        elem.setType(Dialogs.PropertyType.date);
        //'Fecha IVA
        elem.setName(Cairo.Language.getText(1638, ""));
        elem.setKey(K_FECHAIVA);
        elem.setValue(m_fechaIva);
        elem.setTabIndex(1);

        // DATADD
        if(m_userCfg.getShowDataAddInVentas()) {

          var elem = properties.add(null, c_ClienteDataAdd);
          elem.setType(Dialogs.PropertyType.text);
          elem.setSubType(Dialogs.PropertySubType.memo);
          elem.setWidth(10970);
          elem.setTopFromProperty(mVentaConstantes.FV_DESCRIP);
          elem.setTopToPrevious(1040);
          elem.setLeftFromProperty(mVentaConstantes.FV_DESCRIP);
          elem.setHeight(600);

        }

        // HIDECOLS
        //
        var elem = properties.add(null);
        elem.setType(Dialogs.PropertyType.label);
        elem.setBackColor(vbButtonShadow);
        elem.setWidth(2540);
        elem.setTopNotChange(true);
        elem.setLeftNotChange(true);

        // DATADD
        // Aca van las preferencias del usuario
        //
        if(m_userCfg.getShowDataAddInVentas()) {
          elem.setTop(4000);
        }
        else {
          elem.setTop(3460);
        }

        elem.setLeft(9210);
        elem.setHeight(330);

        var elem = properties.add(null);
        elem.setType(Dialogs.PropertyType.label);
        elem.setBackColor(vbWindowBackground);
        elem.setWidth(2500);
        elem.setTopNotChange(true);
        elem.setLeftNotChange(true);

        // DATADD
        // Aca van las preferencias del usuario
        //
        if(m_userCfg.getShowDataAddInVentas()) {
          elem.setTop(4020);
        }
        else {
          elem.setTop(3480);
        }

        elem.setLeft(9220);
        elem.setHeight(300);

        var iProp = null;
        var oProp = null;
        iProp = properties.add(null, c_HideCols);
        oProp = iProp;
        iProp.setType(Dialogs.PropertyType.check);
        //'Ocultar Columnas
        iProp.setName(Cairo.Language.getText(3901, ""));
        iProp.setKey(K_HIDECOLS);
        iProp.setValue(Cairo.Util.boolToInt(CSKernelClient2.GetRegistry(csSeccionSetting.cSINTERFACE, C_HIDECOLSFV, 1)));
        iProp.setTopNotChange(true);
        iProp.setLeftNotChange(true);

        // DATADD
        // Aca van las preferencias del usuario
        //
        if(m_userCfg.getShowDataAddInVentas()) {
          iProp.setTop(4040);
        }
        else {
          iProp.setTop(3500);
        }

        iProp.setLeft(11120);
        iProp.setLeftLabel(-1500);
        oProp.setIsEditProperty(false);
        //
        // HIDECOLS - fin

        //-----------------------------------
        // Caja y Cajero
        //
        if(LenB(m_cajaMsg)) {

          var elem = properties.add(null, C_CAJAMSGBOX);
          elem.setType(Dialogs.PropertyType.label);
          elem.setBackColor(vbButtonShadow);
          elem.setWidth(6030);
          elem.setTopNotChange(true);
          elem.setLeftNotChange(true);

          // DATADD
          // Aca van las preferencias del usuario
          //
          if(m_userCfg.getShowDataAddInVentas()) {
            if(m_bCajaError) {
              elem.setTop(3970);
            }
            else {
              elem.setTop(4000);
            }
          }
          else {
            if(m_bCajaError) {
              elem.setTop(3390);
            }
            else {
              elem.setTop(3460);
            }
          }

          elem.setLeft(2700);
          if(m_bCajaError) {
            if(m_userCfg.getShowDataAddInVentas()) {
              elem.setHeight(390);
            }
            else {
              elem.setHeight(440);
            }
          }
          else {
            elem.setHeight(330);
          }

          var elem = properties.add(null, C_CAJAMSG);
          elem.setType(Dialogs.PropertyType.label);
          elem.setBackColor(vbWindowBackground);
          elem.setWidth(6000);
          elem.setTopNotChange(true);
          elem.setLeftNotChange(true);
          elem.setValue(m_cajaMsg);
          elem.setTextAlign(vbCenter);

          if(m_bCajaError) {
            elem.setForeColor(vbRed);
          }

          // DATADD
          // Aca van las preferencias del usuario
          //
          if(m_userCfg.getShowDataAddInVentas()) {

            if(m_bCajaError) {
              elem.setTop(3990);
            }
            else {
              elem.setTop(4020);
            }

          }
          else {

            if(m_bCajaError) {
              elem.setTop(3390);
            }
            else {
              elem.setTop(3480);
            }
          }

          elem.setLeft(2720);
          if(m_bCajaError) {
            if(m_userCfg.getShowDataAddInVentas()) {
              elem.setHeight(380);
            }
            else {
              elem.setHeight(430);
            }
          }
          else {
            elem.setHeight(300);
          }

        }
        //
        // Caja y Cajero - fin
        //-----------------------------------

        if(!m_dialog.show(self)) { return false; }

        pSetShowStockData(true);

        var w_tabs = m_items.getTabs();

        w_tabs.clear();

        var tab = w_tabs.add(null);
        tab.setIndex(0);
        //'Items
        tab.setName(Cairo.Language.getText(1371, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(1);
        //'Percepciones
        tab.setName(Cairo.Language.getText(1248, ""));

        abmGen = m_items;
        abmGen.ResetLayoutMembers;

        // DATADD
        if(m_userCfg.getShowDataAddInVentas()) {
          abmGen.SetHeightToDocWithDescrip;
        }

        var properties = m_items.getProperties();

        properties.clear();

        c = properties.add(null, C_ITEMS);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        setGridItems(c);
        if(!pLoadItems(c, cotizacion)) { return false; }
        c.setName(C_ITEMS);
        c.setKey(K_ITEMS);
        c.setTabIndex(0);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        m_itemsDeleted = "";

        c = properties.add(null, C_PERCEPCIONES);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        setGridPercepciones(c);
        if(!pLoadPercepciones(c, cotizacion)) { return false; }
        c.setName(C_PERCEPCIONES);
        c.setKey(K_PERCEPCIONES);
        c.setTabIndex(1);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        m_percepcionesDeleted = "";

        if(!m_items.show(self)) { return false; }

        abmGen = m_footer;
        abmGen.ResetLayoutMembers;

        var properties = m_footer.getProperties();

        properties.clear();

        var elem = properties.add(null, mVentaConstantes.FV_SUBTOTAL);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        //'Sub Total
        elem.setName(Cairo.Language.getText(1579, ""));
        elem.setKey(K_SUBTOTAL);
        elem.setValue(m_subTotal);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setEnabled(false);

        var elem = properties.add(null, mVentaConstantes.FV_IMPORTEDESC1);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        //'Desc. 1
        elem.setName(Cairo.Language.getText(1573, ""));
        elem.setKey(K_IMPORTEDESC1);
        elem.setValue(m_importeDesc1);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setEnabled(false);

        var elem = properties.add(null, mVentaConstantes.FV_IMPORTEDESC2);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        //'Desc. 2
        elem.setName(Cairo.Language.getText(1580, ""));
        elem.setKey(K_IMPORTEDESC2);
        elem.setValue(m_importeDesc2);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setEnabled(false);

        var elem = properties.add(null, mVentaConstantes.FV_NETO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        //'Neto
        elem.setName(Cairo.Language.getText(1581, ""));
        elem.setKey(K_NETO);
        elem.setValue(m_neto);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setEnabled(false);

        var elem = properties.add(null, mVentaConstantes.FV_IVARI);
        elem.setType(Dialogs.PropertyType.numeric);
        //'IVA RI
        elem.setName(Cairo.Language.getText(1582, ""));
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_IVARI);
        elem.setValue(m_ivari);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setEnabled(false);

        // Internos
        var elem = properties.add(null, mVentaConstantes.FV_INTERNOS);
        elem.setType(Dialogs.PropertyType.numeric);
        //'Internos
        elem.setName(Cairo.Language.getText(4914, ""));
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_INTERNOS);
        elem.setValue(m_internos);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setEnabled(false);
        //.LeftFromProperty = cscFcIvarni

        var elem = properties.add(null, mVentaConstantes.FV_IVARNI);
        elem.setType(Dialogs.PropertyType.numeric);
        //'IVA RNI
        elem.setName(Cairo.Language.getText(1583, ""));
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_IVARNI);
        elem.setValue(m_ivarni);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setEnabled(false);

        var elem = properties.add(null, mVentaConstantes.FV_TOTAL_PERCEPCIONES);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        //'Percepciones
        elem.setName(Cairo.Language.getText(1248, ""));
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_TOTAPERCEPCIONES);
        elem.setValue(m_totalPercepciones);
        elem.setEnabled(false);

        var elem = properties.add(null, mVentaConstantes.FV_TOTAL);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        //'Total
        elem.setName(Cairo.Language.getText(1584, ""));
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_TOTAL);
        elem.setValue(m_total);
        elem.setEnabled(false);

        pSetEnabled();

        if(!m_footer.show(self)) { return false; }

        // Preferencias del Usuario
        //
        if(bValidateDocDefault) {
          self.propertyChange(K_DOC_ID);
        }

        showCotizacion();
        pShowFechaVto();

        // DATADD
        mPublicVentas.self.showDataAddCliente(m_userCfg.getShowDataAddInVentas(), m_dialog);

        abmGen.SetIconFormDoc(1);

        pSetColorBackground();

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(mVentaConstantes.DOC_ID);
        elem.setSelectId(m_docId);
        elem.setValue(m_documento);
        elem.setSelectId(m_userCfg.getDocFvId());
        elem.setValue(m_userCfg.getDocFvNombre());

        var elem = properties.item(cDeclarations.getCsDocNumberID());
        elem.setValue(m_numero);

        var elem = properties.item(cDeclarations.getCsDocEstateID());
        elem.setValue(m_estado);

        var elem = properties.item(mVentaConstantes.FV_FECHA);
        elem.setValue(m_fecha);

        var elem = properties.item(mVentaConstantes.FV_FECHAENTREGA);
        elem.setValue(m_fechaentrega);

        var elem = properties.item(mVentaConstantes.CLI_ID);
        elem.setSelectId(m_cliId);
        elem.setValue(m_cliente);

        var elem = properties.item(mVentaConstantes.FV_NRODOC);
        elem.setValue(m_nrodoc);

        var elem = properties.item(mVentaConstantes.CPG_ID);
        elem.setSelectId(m_cpgId);
        elem.setValue(m_condicionPago);

        var elem = properties.item(mVentaConstantes.FV_FECHA_VTO);
        elem.setValue(m_fechaVto);

        var elem = properties.item(mVentaConstantes.FV_COTIZACION);
        elem.setValue(m_cotizacion);

        var elem = properties.item(mVentaConstantes.FV_DESCUENTO1);
        elem.setValue(m_descuento1);

        var elem = properties.item(mVentaConstantes.FV_DESCUENTO2);
        elem.setValue(m_descuento2);

        var elem = properties.item(mVentaConstantes.LP_ID);
        elem.setSelectId(m_lpId);
        elem.setValue(m_listaPrecio);

        var elem = properties.item(mVentaConstantes.LD_ID);
        elem.setSelectId(m_ldId);
        elem.setValue(m_listaDescuento);

        var elem = properties.item(mVentaConstantes.VEN_ID);
        elem.setSelectId(m_venId);
        elem.setValue(m_vendedor);

        var elem = properties.item(mVentaConstantes.SUC_ID);
        elem.setSelectId(m_sucId);
        elem.setValue(m_sucursal);

        var elem = properties.item(mVentaConstantes.FV_DESCRIP);
        elem.setValue(m_descrip);

        var elem = properties.item(mVentaConstantes.LGJ_ID);
        elem.setSelectId(m_lgjId);
        elem.setValue(m_legajo);

        var elem = properties.item(mVentaConstantes.CLIS_ID);
        elem.setValue(m_clienteSucursal);
        elem.setSelectId(m_clisId);

        var elem = properties.item(mVentaConstantes.TRANS_ID);
        elem.setValue(m_transporte);
        elem.setSelectId(m_transId);

        var elem = properties.item(mVentaConstantes.FV_ORDEN_COMPRA);
        elem.setValue(m_ordenCompra);

        var elem = properties.item(mVentaConstantes.PRO_ID_ORIGEN);
        elem.setSelectId(m_proIdOrigen);
        elem.setValue(m_proOrigen);

        var elem = properties.item(mVentaConstantes.PRO_ID_DESTINO);
        elem.setSelectId(m_proIdDestino);
        elem.setValue(m_proDestino);

        var elem = properties.item(mVentaConstantes.FV_CAI);
        elem.setValue(m_cai);

        var elem = properties.item(mVentaConstantes.DEPL_ID_ORIGEN);
        elem.setSelectId(m_deplId);
        elem.setValue(m_deposito);
        elem.setSelectId(m_userCfg.getDeplId());
        elem.setValue(m_userCfg.getDeplNombre());

        var elem = properties.item(mVentaConstantes.CCOS_ID);
        elem.setSelectId(m_ccosId);
        elem.setValue(m_centroCosto);

        var elem = properties.item(mVentaConstantes.RV_NRODOC);

        var elem = properties.item(mVentaConstantes.FV_FECHA_IVA);
        elem.setValue(m_fechaIva);

        var elem = properties.item(c_ClienteDataAdd);

        var elem = properties.add(null);

        var elem = properties.add(null);

        var elem = properties.item(C_CAJAMSGBOX);

        var elem = properties.item(C_CAJAMSG);
        elem.setValue(m_cajaMsg);

        var elem = properties.item(mVentaConstantes.FV_SUBTOTAL);
        elem.setValue(m_subTotal);

        var elem = properties.item(mVentaConstantes.FV_IMPORTEDESC1);
        elem.setValue(m_importeDesc1);

        var elem = properties.item(mVentaConstantes.FV_IMPORTEDESC2);
        elem.setValue(m_importeDesc2);

        var elem = properties.item(mVentaConstantes.FV_NETO);
        elem.setValue(m_neto);

        var elem = properties.item(mVentaConstantes.FV_IVARI);
        elem.setValue(m_ivari);

        var elem = properties.item(mVentaConstantes.FV_INTERNOS);
        elem.setValue(m_internos);

        var elem = properties.item(mVentaConstantes.FV_IVARNI);
        elem.setValue(m_ivarni);

        var elem = properties.item(mVentaConstantes.FV_TOTAL_PERCEPCIONES);
        elem.setValue(m_totalPercepciones);

        var elem = properties.item(mVentaConstantes.FV_TOTAL);
        elem.setValue(m_total);

        return m_dialog.showValues(properties);
      };

      // Cotizacion
      var showCotizacion = function() {
        var monId = null;
        var dDate = null;
        var iProp = null;

        if(m_id == Cairo.Constants.NO_ID) {
          if(m_lastDocId == Cairo.Constants.NO_ID) { return; }
          if(!Cairo.Database.getData(mVentaConstantes.DOCUMENTO, mVentaConstantes.DOC_ID, m_lastDocId, mVentaConstantes.MON_ID, monId)) { return; }
        }
        else {
          monId = m_monId;
        }

        iProp = m_dialog.getProperties().item(mVentaConstantes.FV_COTIZACION);
        iProp.setVisible(monId !== GetMonedaDefault);

        if(m_lastMonIdCotizacion !== monId || iProp.getValue() == 0) {
          dDate = getFecha();
          if(!IsDate(dDate)) { dDate = Date; }
          iProp.setValue(cMoneda.getCotizacion(monId, dDate));
          m_lastFecha = dDate;
          m_lastMonIdCotizacion = monId;
        }

        m_dialog.showValue(iProp);
      };

      var pShowFechaVto = function() {
        var iProp = null;
        var bEsLibre = null;

        if(pGetCondicionPago().getSelectId() !== m_lastCpgId) {
          m_lastCpgId = pGetCondicionPago().getSelectId();
          if(!Cairo.Database.getData(mVentaConstantes.CONDICIONPAGO, mVentaConstantes.CPG_ID, m_lastCpgId, mVentaConstantes.CPG_ES_LIBRE, bEsLibre)) { return; }

          iProp = m_dialog.getProperties().item(mVentaConstantes.FV_FECHA_VTO);
          iProp.setVisible(bEsLibre);
          m_dialog.showValue(iProp);
        }
      };

      var pGetCondicionPago = function() {
        return m_dialog.getProperties().item(mVentaConstantes.CPG_ID);
      };

      var setGridItems = function(property) {
        var prId = null;
        var oCol = null;
        var iCol = null;

        // HIDECOLS
        //
        var bColVisible = null;
        bColVisible = Cairo.Util.val(m_dialog.getProperties().item(c_HideCols).getValue()) == 0;

        var w_grid = property.getGrid();

        w_grid.getColumns().clear();
        w_grid.getRows().clear();

        var w_columns = w_grid.getColumns();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_FVI_ID);

        iCol = w_columns.add(null);
        oCol = iCol;
        //'Articulo
        iCol.setName(Cairo.Language.getText(1367, ""));
        iCol.setType(Dialogs.PropertyType.select);
        iCol.setTable(Cairo.Tables.PRODUCTOVENTA);
        iCol.setWidth(1800);
        iCol.setKey(KI_PR_ID);
        if(m_userCfg.getMultiSelect()) {
          oCol.setHelpType(csHelpType.cSMULTISELECT);
        }
        iCol = null;
        oCol = null;

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_CUE_ID);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_CUE_ID_IVARI);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_CUE_ID_IVARNI);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setWidth(1200);
        elem.setKey(KI_DESCRIP);

        var elem = w_columns.add(null);
        //'Cantidad
        elem.setName(Cairo.Language.getText(1374, ""));
        elem.setFormat(m_generalConfig.getFormatDecCantidad());
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setWidth(1200);
        elem.setKey(KI_CANTIDAD);

        elem.setDefaultValue(new cABMGridRowValue());
        elem.getDefaultValue().setValue(1);

        var elem = w_columns.add(null);
        //'Nro. Serie
        elem.setName(Cairo.Language.getText(1639, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButton);
        elem.setWidth(3000);
        elem.setKey(KI_NROSERIE);
        //' HIDECOLS
        elem.setVisible(m_showStockData);

        // Lote
        //
        var elem = w_columns.add(null, mVentaConstantes.STL_ID);
        //'Lote
        elem.setName(Cairo.Language.getText(1640, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.STOCKLOTE);
        elem.setWidth(2000);
        elem.setKey(KI_STL_ID);
        //' HIDECOLS
        elem.setVisible(m_showStockData);

        var elem = w_columns.add(null);
        //'Descuento
        elem.setName(Cairo.Language.getText(1585, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(1200);
        elem.setKey(KI_DESCUENTO);
        elem.setEnabled(false);
        //' HIDECOLS
        elem.setVisible(bColVisible);

        var elem = w_columns.add(null);
        //'Unidad
        elem.setName(Cairo.Language.getText(1165, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1200);
        elem.setKey(KI_UNIDAD);
        elem.setEnabled(false);
        //' HIDECOLS
        elem.setVisible(bColVisible);

        var elem = w_columns.add(null);
        //'Precio (LP)
        elem.setName(Cairo.Language.getText(1587, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setWidth(1200);
        elem.setKey(KI_PRECIO_LP);
        elem.setEnabled(false);
        //' HIDECOLS
        elem.setVisible(bColVisible);

        var elem = w_columns.add(null);
        //'Precio
        elem.setName(Cairo.Language.getText(1586, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(1200);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setKey(KI_PRECIO_USR);
        elem.setEnabled(SecurityCanAccessSilent(csVentasPrestacion.cSPREVTAEDITPRICEFAC));

        var elem = w_columns.add(null);
        //'Precio c/desc.
        elem.setName(Cairo.Language.getText(1588, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(1200);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setKey(KI_PRECIO);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        //'Neto
        elem.setName(Cairo.Language.getText(1581, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setWidth(1200);
        elem.setKey(KI_NETO);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        //'IVA RI
        elem.setName(Cairo.Language.getText(1582, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setWidth(1200);
        elem.setKey(KI_IVARI);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        //'IVA RNI
        elem.setName(Cairo.Language.getText(1583, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(1200);
        elem.setKey(KI_IVARNI);
        elem.setEnabled(false);
        //' HIDECOLS
        elem.setVisible(bColVisible);

        // Internos
        var elem = w_columns.add(null);
        //'Internos
        elem.setName(Cairo.Language.getText(4914, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(1200);
        elem.setKey(KI_INTERNOS);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        //'Importe
        elem.setName(Cairo.Language.getText(1228, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(1200);
        elem.setKey(KI_IMPORTE);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_IVARIPERCENT);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_IVARNIPERCENT);

        // Internos
        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_INTERNOSPERCENT);

        // Internos
        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_INTERNOS_PORC);

        var elem = w_columns.add(null);
        //'Centro de Costo
        elem.setName(Cairo.Language.getText(1057, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTROCOSTO);
        elem.setWidth(1800);
        elem.setKey(mPercepciones.kI_CCOS_ID);

        // TO
        var elem = w_columns.add(null);
        //'Tipo Operación
        elem.setName(Cairo.Language.getText(1492, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TIPOOPERACION);
        elem.setWidth(1800);
        elem.setDefaultValue(new cABMGridRowValue());
        var w_defaultValue = elem.getDefaultValue();
        w_defaultValue.setID(Cairo.Constants.c_TO_COMERCIALID);
        w_defaultValue.setValue(Cairo.Constants.c_TO_Comercial);
        elem.setKey(KI_TO_ID);
        //' HIDECOLS
        elem.setVisible(bColVisible);

        // Lote
        //
        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PR_LLEVALOTE);

        // Lote Fifo
        //
        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PR_LOTEFIFO);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PR_LLEVANROSERIE);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_ES_KIT);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_GRUPO);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_NOSTOCK);

        var w_rows = w_grid.getRows();

        for(var _i = 0; _i < m_data.items.length; _i += 1) {

          var elem = w_rows.add(null, rs(mVentaConstantes.FVI_ID).Value);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.FVI_ID);
          elem.setKey(KI_FVI_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.PR_NOMBRE_VENTA);
          elem.id = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.PR_ID);
          elem.setKey(KI_PR_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.CUE_ID);
          elem.setKey(KI_CUE_ID);

          var elem = elem.add(null);
          if(m_bIva) {
            elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.CUE_ID_IVA_RI);
          }
          else {
            elem.Value = Cairo.Constants.NO_ID;
          }
          elem.setKey(KI_CUE_ID_IVARI);

          var elem = elem.add(null);
          if(m_bIvaRni) {
            elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.CUE_ID_IVA_RNI);
          }
          else {
            elem.Value = Cairo.Constants.NO_ID;
          }
          elem.setKey(KI_CUE_ID_IVARNI);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.FVI_DESCRIP);
          elem.setKey(KI_DESCRIP);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.FVI_CANTIDAD);
          elem.setKey(KI_CANTIDAD);

          var elem = elem.add(null);
          elem.Value = "";
          elem.setKey(KI_NROSERIE);

          // Lote
          //
          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.STL_CODE);
          elem.id = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.STL_ID);
          elem.setKey(KI_STL_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.FVI_DESCUENTO);
          elem.setKey(KI_DESCUENTO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.UN_NAME);
          elem.setKey(KI_UNIDAD);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.FVI_PRECIO_LISTA) / cotizacion;
          elem.setKey(KI_PRECIO_LP);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.FVI_PRECIO_USR) / cotizacion;
          elem.setKey(KI_PRECIO_USR);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.FVI_PRECIO) / cotizacion;
          elem.setKey(KI_PRECIO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.FVI_NETO) / cotizacion;
          elem.setKey(KI_NETO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.FVI_IVARI) / cotizacion;
          elem.setKey(KI_IVARI);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.FVI_IVARNI) / cotizacion;
          elem.setKey(KI_IVARNI);

          // Internos
          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.FVI_INTERNOS) / cotizacion;
          elem.setKey(KI_INTERNOS);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.FVI_IMPORTE) / cotizacion;
          elem.setKey(KI_IMPORTE);

          var elem = elem.add(null);
          if(m_bIva) {
            elem.Value = Cairo.Database.valField(m_data.items[_i], "iva_ri_porcentaje");
          }
          else {
            elem.Value = 0;
          }
          elem.setKey(KI_IVARIPERCENT);

          var elem = elem.add(null);
          if(m_bIvaRni) {
            elem.Value = Cairo.Database.valField(m_data.items[_i], "iva_rni_porcentaje");
          }
          else {
            elem.Value = 0;
          }
          elem.setKey(KI_IVARNIPERCENT);

          // Internos
          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], "internos_porcentaje");
          elem.setKey(KI_INTERNOSPERCENT);

          // Internos
          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.PR_PORC_INTERNO_V);
          elem.setKey(KI_INTERNOS_PORC);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.CCOS_NAME);
          elem.id = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.CCOS_ID);
          elem.setKey(mPercepciones.kI_CCOS_ID);

          // TO
          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.TO_NAME);
          elem.id = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.TO_ID);
          elem.setKey(KI_TO_ID);

          // Lote
          //
          var elem = elem.add(null);
          elem.id = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.PR_LLEVA_NRO_LOTE);
          elem.setKey(KI_PR_LLEVALOTE);

          // Lote Fifo
          //
          var elem = elem.add(null);
          elem.id = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.PR_LOTE_FIFO);
          elem.setKey(KI_PR_LOTEFIFO);

          var elem = elem.add(null);
          elem.id = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.PR_LLEVA_NRO_SERIE);
          elem.setKey(KI_PR_LLEVANROSERIE);

          var elem = elem.add(null);
          elem.id = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.PR_ESKIT);
          elem.setKey(KI_ES_KIT);

          var elem = elem.add(null);
          elem.id = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.FVI_ID);
          elem.setKey(KI_GRUPO);

          var elem = elem.add(null);
          elem.id = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.FVI_NO_STOCK);
          elem.setKey(KI_NOSTOCK);

        }

        ////////////////////////////////////////////////////
        // Numeros de Serie
        ////////////////////////////////////////////////////

        var nroSerie = null;
        var curGroup = null;
        var coll = null;
        var nrosSerie = null;

        mCollection.collClear(m_nrosSerie);

        rs = rs.NextRecordset;

        for(var _i = 0; _i < m_data.items.length; _i += 1) {

          // Si cambie de grupo
          if(curGroup !== Cairo.Database.valField(m_data.items[_i], mVentaConstantes.FVI_ID)) {

            pSetNrosSerieInRow(curGroup, nrosSerie);
            nrosSerie = "";

            curGroup = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.FVI_ID);
            coll = new Collection();
            m_nrosSerie.Add(coll, GetKey(curGroup));
          }

          // Guardo el numero de serie
          nroSerie = new cProductoSerieType();
          nroSerie.setCodigo(Cairo.Database.valField(m_data.items[_i], mVentaConstantes.PRNS_CODE));
          nroSerie.setDescrip(Cairo.Database.valField(m_data.items[_i], mVentaConstantes.PRNS_DESCRIP));
          nroSerie.setFechaVto(Cairo.Database.valField(m_data.items[_i], mVentaConstantes.PRNS_FECHAVTO));
          nroSerie.setPrns_id(Cairo.Database.valField(m_data.items[_i], mVentaConstantes.PRNS_ID));
          nroSerie.setPr_id_item(Cairo.Database.valField(m_data.items[_i], mVentaConstantes.PR_ID));
          nroSerie.setKitItem(Cairo.Database.valField(m_data.items[_i], mVentaConstantes.PR_NOMBRE_COMPRA));

          nrosSerie = nrosSerie+ nroSerie.getCodigo()+ ",";

          // Lo agrego a la bolsa
          coll.Add(nroSerie, GetKey(nroSerie.getPrns_id()));

        }

        pSetNrosSerieInRow(curGroup, nrosSerie);
        nrosSerie = "";

        ////////////////////////////////////////////////////
        // Kit
        ////////////////////////////////////////////////////
        mCollection.collClear(m_collKitInfo);

        rs = rs.NextRecordset;

        for(var _i = 0; _i < m_data.items.length; _i += 1) {

          prId = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.PR_ID);
          coll = Object.getCollKitInfoXPrId(prId, m_collKitInfo);

          prId = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.PR_ID_ITEM);

          //*TODO:** can't found type for with block
          //*With GetKitInfoItem(coll, prId)
          var w___TYPE_NOT_FOUND = GetKitInfoItem(coll, prId);
          w___TYPE_NOT_FOUND.pr_id = prId;
          w___TYPE_NOT_FOUND.nombre = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.PR_NOMBRE_COMPRA);
          w___TYPE_NOT_FOUND.Cantidad = Cairo.Database.valField(m_data.items[_i], "cantidad");
          w___TYPE_NOT_FOUND.LlevaNroSerie = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.PR_LLEVA_NRO_SERIE);
        }

        return true;
      };

      var load = function(id) {
        var cotizacion = null;

        var apiPath = Cairo.Database.getAPIVersion();
        return Cairo.Database.getData("load[" + apiPath + "general/facturaventa]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== Cairo.Constants.NO_ID) {

              m_cotizacion = Cairo.Database.valField(response.data, mVentaConstantes.FV_COTIZACION);
              cotizacion = (m_cotizacion !== 0) ? m_cotizacion : 1);

              m_id = Cairo.Database.valField(response.data, mVentaConstantes.FV_ID);
              m_numero = Cairo.Database.valField(response.data, mVentaConstantes.FV_NUMERO);
              m_nrodoc = Cairo.Database.valField(response.data, mVentaConstantes.FV_NRODOC);
              m_descrip = Cairo.Database.valField(response.data, mVentaConstantes.FV_DESCRIP);
              m_fecha = Cairo.Database.valField(response.data, mVentaConstantes.FV_FECHA);
              m_fechaentrega = Cairo.Database.valField(response.data, mVentaConstantes.FV_FECHAENTREGA);
              m_fechaVto = Cairo.Database.valField(response.data, mVentaConstantes.FV_FECHA_VTO);
              m_fechaIva = Cairo.Database.valField(response.data, mVentaConstantes.FV_FECHA_IVA);
              m_neto = Cairo.Database.valField(response.data, mVentaConstantes.FV_NETO) / cotizacion;
              m_ivari = Cairo.Database.valField(response.data, mVentaConstantes.FV_IVARI) / cotizacion;
              m_ivarni = Cairo.Database.valField(response.data, mVentaConstantes.FV_IVARNI) / cotizacion;

              // Internos
              m_internos = Cairo.Database.valField(response.data, mVentaConstantes.FV_INTERNOS) / cotizacion;

              m_total = Cairo.Database.valField(response.data, mVentaConstantes.FV_TOTAL) / cotizacion;
              m_totalPercepciones = Cairo.Database.valField(response.data, mVentaConstantes.FV_TOTAL_PERCEPCIONES) / cotizacion;
              m_subTotal = Cairo.Database.valField(response.data, mVentaConstantes.FV_SUBTOTAL) / cotizacion;
              m_descuento1 = Cairo.Database.valField(response.data, mVentaConstantes.FV_DESCUENTO1);
              m_descuento2 = Cairo.Database.valField(response.data, mVentaConstantes.FV_DESCUENTO2);
              m_importeDesc1 = Cairo.Database.valField(response.data, mVentaConstantes.FV_IMPORTEDESC1) / cotizacion;
              m_importeDesc2 = Cairo.Database.valField(response.data, mVentaConstantes.FV_IMPORTEDESC2) / cotizacion;
              m_cliId = Cairo.Database.valField(response.data, mVentaConstantes.CLI_ID);
              m_cliente = Cairo.Database.valField(response.data, mVentaConstantes.CLI_NAME);
              m_ccosId = Cairo.Database.valField(response.data, mVentaConstantes.CCOS_ID);
              m_centroCosto = Cairo.Database.valField(response.data, mVentaConstantes.CCOS_NAME);
              m_sucId = Cairo.Database.valField(response.data, mVentaConstantes.SUC_ID);
              m_sucursal = Cairo.Database.valField(response.data, mVentaConstantes.SUC_NAME);
              m_docId = Cairo.Database.valField(response.data, mVentaConstantes.DOC_ID);
              m_documento = Cairo.Database.valField(response.data, mVentaConstantes.DOC_NAME);
              m_doctId = Cairo.Database.valField(response.data, mVentaConstantes.DOCT_ID);
              m_lpId = Cairo.Database.valField(response.data, mVentaConstantes.LP_ID);
              m_listaPrecio = Cairo.Database.valField(response.data, mVentaConstantes.LP_NAME);
              m_cpgId = Cairo.Database.valField(response.data, mVentaConstantes.CPG_ID);
              m_condicionPago = Cairo.Database.valField(response.data, mVentaConstantes.CPG_NAME);
              m_ldId = Cairo.Database.valField(response.data, mVentaConstantes.LD_ID);
              m_listaDescuento = Cairo.Database.valField(response.data, mVentaConstantes.LD_NAME);
              m_venId = Cairo.Database.valField(response.data, mVentaConstantes.VEN_ID);
              m_vendedor = Cairo.Database.valField(response.data, mVentaConstantes.VEN_NAME);
              m_lgjId = Cairo.Database.valField(response.data, mVentaConstantes.LGJ_ID);
              m_legajo = Cairo.Database.valField(response.data, mVentaConstantes.LGJ_CODE);
              m_cai = Cairo.Database.valField(response.data, mVentaConstantes.FV_CAI);
              m_ordenCompra = Cairo.Database.valField(response.data, mVentaConstantes.FV_ORDEN_COMPRA);
              m_proIdOrigen = Cairo.Database.valField(response.data, mVentaConstantes.PRO_ID_ORIGEN);
              m_proOrigen = Cairo.Database.valField(response.data, "ProOrigen");
              m_proIdDestino = Cairo.Database.valField(response.data, mVentaConstantes.PRO_ID_DESTINO);
              m_proDestino = Cairo.Database.valField(response.data, "ProDestino");
              m_transId = Cairo.Database.valField(response.data, mVentaConstantes.TRANS_ID);
              m_transporte = Cairo.Database.valField(response.data, mVentaConstantes.TRANS_NAME);
              m_creado = Cairo.Database.valField(response.data, Cairo.Constants.CREADO);
              m_modificado = Cairo.Database.valField(response.data, Cairo.Constants.MODIFICADO);
              m_modifico = Cairo.Database.valField(response.data, Cairo.Constants.MODIFICO);
              m_estId = Cairo.Database.valField(response.data, Cairo.Constants.EST_ID);
              m_estado = Cairo.Database.valField(response.data, Cairo.Constants.EST_NAME);
              m_firmado = Cairo.Database.valField(response.data, mVentaConstantes.FV_FIRMADO);
              m_monId = Cairo.Database.valField(response.data, mVentaConstantes.MON_ID);

              m_clisId = Cairo.Database.valField(response.data, mVentaConstantes.CLIS_ID);
              m_clienteSucursal = Cairo.Database.valField(response.data, mVentaConstantes.CLIS_NAME);

              m_docSinPerc = Cairo.Database.valField(response.data, mVentaConstantes.DOC_FV_SIN_PERCEPCION);

              m_docEditable = Cairo.Database.valField(response.data, Cairo.Constants.DOC_EDITABLE);
              m_docEditMsg = Cairo.Database.valField(response.data, Cairo.Constants.DOCEDIT_MSG);

              // Lote
              //
              m_depfId = Cairo.Database.valField(response.data, mVentaConstantes.DEPF_ID);
              m_deplId = Cairo.Database.valField(response.data, mVentaConstantes.DEPL_ID);
              m_deposito = Cairo.Database.valField(response.data, mVentaConstantes.DEPL_NAME);

              // Para ver documentos auxiliares
              //
              m_asId = Cairo.Database.valField(response.data, mVentaConstantes.AS_ID);
              m_stId = Cairo.Database.valField(response.data, mVentaConstantes.ST_ID);

              m_bIva = Cairo.Database.valField(response.data, mVentaConstantes.BIVA_RI);
              m_bIvaRni = Cairo.Database.valField(response.data, mVentaConstantes.BIVA_RNI);

              m_taPropuesto = Cairo.Database.valField(response.data, Cairo.Constants.TA__PROPUESTO);
              m_taMascara = Cairo.Database.valField(response.data, Cairo.Constants.TA__MASCARA);

              m_lastDocId = m_docId;
              //' nrs devolucion
              m_lastDoctId = m_doctId;
              m_lastCliId = m_cliId;
              m_lastDocName = m_documento;
              m_lastCliName = m_cliente;

              m_lastMonIdCotizacion = m_monId;
              m_lastFecha = m_fecha;

              // Percepciones
              mPercepciones.self.loadPercepcionesForCliente(m_lastCliId, m_vPercepciones[], m_fecha);

            }
            else {
              m_id = Cairo.Constants.NO_ID;
              m_numero = 0;
              m_nrodoc = "";
              m_descrip = "";
              m_fecha = VDGetDateById(csDateEnum.cSTODAY);
              m_fechaentrega = VDGetDateById(csDateEnum.cSTOMORROW);
              m_fechaVto = Cairo.Constants.cSNODATE;
              m_fechaIva = m_fecha;
              m_neto = 0;
              m_ivari = 0;
              m_ivarni = 0;

              // Internos
              m_internos = 0;

              m_total = 0;
              m_totalPercepciones = 0;
              m_subTotal = 0;
              m_descuento1 = 0;
              m_descuento2 = 0;
              m_importeDesc1 = 0;
              m_importeDesc2 = 0;
              m_cliId = Cairo.Constants.NO_ID;
              m_cliente = "";
              m_ccosId = Cairo.Constants.NO_ID;
              m_centroCosto = "";
              m_docId = Cairo.Constants.NO_ID;
              m_documento = "";
              m_doctId = Cairo.Constants.NO_ID;
              m_lpId = Cairo.Constants.NO_ID;
              m_ldId = Cairo.Constants.NO_ID;
              m_cpgId = Cairo.Constants.NO_ID;
              m_venId = Cairo.Constants.NO_ID;
              m_vendedor = "";
              m_cai = "";
              m_ordenCompra = "";
              m_lgjId = Cairo.Constants.NO_ID;
              m_legajo = "";
              m_proIdOrigen = Cairo.Constants.NO_ID;
              m_proOrigen = "";
              m_proIdDestino = Cairo.Constants.NO_ID;
              m_proDestino = "";
              m_transId = Cairo.Constants.NO_ID;
              m_transporte = "";
              m_condicionPago = "";
              m_listaPrecio = "";
              m_listaDescuento = "";
              m_cotizacion = 0;
              m_monId = Cairo.Constants.NO_ID;
              m_creado = Cairo.Constants.cSNODATE;
              m_modificado = Cairo.Constants.cSNODATE;
              m_modifico = 0;
              m_estId = Cairo.Constants.NO_ID;
              m_estado = "";
              m_sucId = cUtil.getUser().getSuc_id();
              m_sucursal = cUtil.getUser().getSucursal();
              m_firmado = false;

              m_clisId = Cairo.Constants.NO_ID;
              m_clienteSucursal = "";

              m_docSinPerc = false;

              // Lote
              //
              m_depfId = Cairo.Constants.NO_ID;
              m_deplId = Cairo.Constants.NO_ID;
              m_deposito = "";

              // Para ver documentos auxiliares
              //
              m_asId = Cairo.Constants.NO_ID;
              m_stId = Cairo.Constants.NO_ID;

              m_docId = m_lastDocId;
              //' nrs devolucion
              m_doctId = m_lastDoctId;
              m_cliId = m_lastCliId;
              m_cliente = m_lastCliName;
              m_documento = m_lastDocName;

              m_taPropuesto = false;
              m_taMascara = "";

              m_bIvaRni = false;
              m_bIva = false;

              m_lastMonIdCotizacion = Cairo.Constants.NO_ID;
              m_lastFecha = Cairo.Constants.cSNODATE;

              // Cotizacion
              if(m_docId !== Cairo.Constants.NO_ID) {
                m_cotizacion = DocGetCotizacion(m_docId, m_fecha);
              }

              DocEditableGet(m_docId, m_docEditable, m_docEditMsg, csVentasPrestacion.cSPREVTANEWFACTURA);

            }

            m_rvTaPropuesto = false;

            // Si cargue un documento esta variable
            // tiene que estar siempre vacia
            //
            m_fv_id_nc_based = Cairo.Constants.NO_ID;

            return true;
          });
      };

      var setCIEditGenericDoc_Footer = function(rhs) {
        m_footer = rhs;

        if(rhs == null) { Exit Property; }

        m_footer.setIsDocument(true);
        m_footer.setIsFooter(true);
        m_footer.setObjForm(m_dialog.getObjForm());
      };

      var setCIEditGenericDoc_Items = function(rhs) {
        m_items = rhs;

        if(rhs == null) { Exit Property; }

        m_items.setIsDocument(true);
        m_items.setIsItems(true);
        m_items.setObjForm(m_dialog.getObjForm());
      };

      var pSaveItems = function(id,  cotizacion,  bMonedaLegal) {
        var transaction = new Cairo.Database.Transaction();
        var iOrden = null;
        var origen = null;
        var neto = null;
        var ivaRi = null;
        var ivaRni = null;
        //' Internos
        var internos = null;

        // Para numeros de serie
        //
        var iOrden2 = null;
        var grupo = null;
        var prId = null;

        var row = null;
        var cell = null;

        var _count = m_items.getProperties().item(C_ITEMS).getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = m_items.getProperties().item(C_ITEMS).getGrid().getRows().item(_i);

          var register = new Cairo.Database.Register();
          register.setFieldId(mVentaConstantes.FVI_TMPID);
          register.setTable(mVentaConstantes.FACTURAVENTAITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KI_FVI_ID:
                var apiPath = Cairo.Database.getAPIVersion();
                register.setPath(apiPath + "general/facturaventa");

                if(m_copy) {
                  register.getFields().add2(mVentaConstantes.FVI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.integer);
                }
                else {
                  register.getFields().add2(mVentaConstantes.FVI_ID, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.integer);
                }
                break;

              case KI_CANTIDAD:
                register.getFields().add2(mVentaConstantes.FVI_CANTIDAD, cell.getValue(), Cairo.Constants.Types.double);
                break;

              case KI_DESCRIP:
                register.getFields().add2(mVentaConstantes.FVI_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);
                break;

              case KI_PRECIO:
                register.getFields().add2(mVentaConstantes.FVI_PRECIO, Cairo.Util.val(cell.getValue()) * cotizacion, Cairo.Constants.Types.currency);
                break;

              case KI_PRECIO_LP:
                register.getFields().add2(mVentaConstantes.FVI_PRECIO_LISTA, Cairo.Util.val(cell.getValue()) * cotizacion, Cairo.Constants.Types.currency);
                break;

              case KI_PRECIO_USR:
                register.getFields().add2(mVentaConstantes.FVI_PRECIO_USR, Cairo.Util.val(cell.getValue()) * cotizacion, Cairo.Constants.Types.currency);
                break;

              case KI_NETO:
                neto = Cairo.Util.val(cell.getValue());
                register.getFields().add2(mVentaConstantes.FVI_NETO, neto * cotizacion, Cairo.Constants.Types.currency);
                break;

              case KI_IVARI:
                // Por seguridad
                if(m_bIva) {
                  ivaRi = Cairo.Util.val(cell.getValue());
                  register.getFields().add2(mVentaConstantes.FVI_IVARI, ivaRi * cotizacion, Cairo.Constants.Types.currency);
                }
                break;

              case KI_IVARNI:
                // Por seguridad
                if(m_bIvaRni) {
                  ivaRni = Cairo.Util.val(cell.getValue());
                  register.getFields().add2(mVentaConstantes.FVI_IVARNI, ivaRni * cotizacion, Cairo.Constants.Types.currency);
                }

                // Internos
                break;

              case KI_INTERNOS:
                internos = Cairo.Util.val(cell.getValue());
                register.getFields().add2(mVentaConstantes.FVI_INTERNOS, internos * cotizacion, Cairo.Constants.Types.currency);

                break;

              case KI_IVARIPERCENT:
                register.getFields().add2(mVentaConstantes.FVI_IVARIPORC, cell.getValue(), Cairo.Constants.Types.double);
                break;

              case KI_IVARNIPERCENT:
                register.getFields().add2(mVentaConstantes.FVI_IVARNIPORC, cell.getValue(), Cairo.Constants.Types.double);

                // Internos
                break;

              case KI_INTERNOSPERCENT:
                register.getFields().add2(mVentaConstantes.FVI_INTERNOS_PORC, cell.getValue(), Cairo.Constants.Types.double);

                break;

              case KI_PR_ID:
                prId = cell.getId();
                register.getFields().add2(mVentaConstantes.PR_ID, prId, Cairo.Constants.Types.id);
                break;

              case mPercepciones.kI_CCOS_ID:
                register.getFields().add2(mVentaConstantes.CCOS_ID, cell.getId(), Cairo.Constants.Types.id);
                // TO
                break;

              case KI_TO_ID:
                register.getFields().add2(mVentaConstantes.TO_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KI_CUE_ID:
                register.getFields().add2(mVentaConstantes.CUE_ID, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.id);
                break;

              case KI_CUE_ID_IVARI:
                register.getFields().add2(mVentaConstantes.CUE_ID_IVA_RI, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.id);
                break;

              case KI_CUE_ID_IVARNI:
                register.getFields().add2(mVentaConstantes.CUE_ID_IVA_RNI, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.id);
                break;

              case KI_GRUPO:
                grupo = cell.getId();

                break;

              case KI_NOSTOCK:
                register.getFields().add2(mVentaConstantes.FVI_NO_STOCK, cell.getId(), Cairo.Constants.Types.boolean);

                // Lote
                //
                break;

              case KI_STL_ID:
                register.getFields().add2(mVentaConstantes.STL_ID, cell.getId(), Cairo.Constants.Types.id);
                break;
            }
          }

          // Por seguridad
          origen = neto;
          if(m_bIva) {
            origen = origen + ivaRi;
          }
          if(m_bIvaRni) {
            origen = origen + ivaRni;
          }

          // Internos
          origen = origen + internos;

          register.getFields().add2(mVentaConstantes.FVI_IMPORTE, origen * cotizacion, Cairo.Constants.Types.currency);
          if(bMonedaLegal) {
            register.getFields().add2(mVentaConstantes.FVI_IMPORTE_ORIGEN, 0, Cairo.Constants.Types.currency);
          }
          else {
            register.getFields().add2(mVentaConstantes.FVI_IMPORTE_ORIGEN, origen, Cairo.Constants.Types.currency);
          }

          iOrden = iOrden + 1;
          register.getFields().add2(mVentaConstantes.FVI_ORDEN, iOrden, Cairo.Constants.Types.integer);
          register.getFields().add2(mVentaConstantes.FV_TMPID, id, Cairo.Constants.Types.id);

          register.getFields().setHaveLastUpdate(false);
          register.getFields().setHaveWhoModify(false);

          transaction.addRegister(register);

          // Si es nuevo se usa el orden
          if(grupo == 0) { grupo = iOrden * -1; }
          if(!pSaveItemNroSerie(row, iOrden2, prId, id, register.getID(), grupo)) { return false; }
        }

        if(m_itemsDeleted !== "" && m_id !== Cairo.Constants.NO_ID && !m_copy) {

          var vDeletes = null;
          var i = null;

          m_itemsDeleted = RemoveLastColon(m_itemsDeleted);
          vDeletes = Split(m_itemsDeleted, ",");

          for (i = 0; i <= vDeletes.Length; i++) {

            var register = new Cairo.Database.Register();
            register.setFieldId(mVentaConstantes.FVIB_TMPID);
            register.setTable(mVentaConstantes.FACTURAVENTAITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            register.getFields().add2(mVentaConstantes.FVI_ID, Cairo.Util.val(vDeletes(i)), Cairo.Constants.Types.integer);
            register.getFields().add2(mVentaConstantes.FV_ID, m_id, Cairo.Constants.Types.id);
            register.getFields().add2(mVentaConstantes.FV_TMPID, id, Cairo.Constants.Types.id);

            register.getFields().setHaveLastUpdate(false);
            register.getFields().setHaveWhoModify(false);

            transaction.addRegister(register);
          }

        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      // Reglas del Objeto de Negocios
      var pDocAsistTipo = function() {
        var doc = null;
        var rtn = null;
        var docId = null;

        // Si todavia no se cargo el form no se que
        // documento es, asi que no puede ser sobre pedido
        if(m_dialog.getProperties().item(mVentaConstantes.DOC_ID) == null) { return; }

        docId = m_dialog.getProperties().item(mVentaConstantes.DOC_ID).getSelectId();

        // Si no hay un documento activo no se hace nada
        if(docId == Cairo.Constants.NO_ID) { return; }

        doc = new cDocumento();

        return doc.GetData(docId, mVentaConstantes.DOC_TIPO_FACTURA, Cairo.Constants.Types.integer);
      };

      var pDocDesdePedido = function() {
        return pDocAsistTipo() == csETFacPedido;
      };

      var pDocDesdePacking = function() {
        return pDocAsistTipo() == csETFacPackingList;
      };

      var pDocDesdeRemito = function() {
        return pDocAsistTipo() == csETFacRemito;
      };

      var pDocDesdeProyecto = function() {
        return pDocAsistTipo() == csETFacProyecto;
      };

      var pShowImporteAndIva = function(row) { // TODO: Use of ByRef founded Private Sub pShowImporteAndIva(ByRef Row As CSInterfacesABM.cIABMGridRow)
        var importe = null;
        var neto = null;
        var ivaRi = null;
        var ivaRni = null;
        //' Internos
        var internos = null;

        neto = Cairo.Util.val(Dialogs.cell(row, KI_CANTIDAD).getValue()) * Cairo.Util.val(Dialogs.cell(row, KI_PRECIO).getValue());
        if(m_bIva) {
          ivaRi = (neto * Cairo.Util.val(Dialogs.cell(row, KI_IVARIPERCENT).getValue())) / 100;
        }
        if(m_bIvaRni) {
          ivaRni = (neto * Cairo.Util.val(Dialogs.cell(row, KI_IVARNIPERCENT).getValue())) / 100;
        }

        // Internos
        internos = (neto * (Cairo.Util.val(Dialogs.cell(row, KI_INTERNOS_PORC).getValue()) / 100) * Cairo.Util.val(Dialogs.cell(row, KI_INTERNOSPERCENT).getValue())) / 100;

        // Internos
        importe = neto + ivaRi + ivaRni + internos;

        Dialogs.cell(row, KI_NETO).getValue() == neto;
        Dialogs.cell(row, KI_IVARI).getValue() == ivaRi;
        Dialogs.cell(row, KI_IVARNI).getValue() == ivaRni;

        // Internos
        Dialogs.cell(row, KI_INTERNOS).getValue() == internos;
        Dialogs.cell(row, KI_IMPORTE).getValue() == importe;
      };

      var updateTotals = function() {
        var rows = null;
        var rowsPercep = null;

        var neto = null;
        var ivaRi = null;
        var ivaRni = null;
        var desc1 = null;
        var desc2 = null;
        var percep = null;
        //' Internos
        var internos = null;
        var row = null;

        rows = cIABMGridCellValue.getItems(m_items, C_ITEMS).Grid.rows;
        rowsPercep = m_items.getProperties().item(C_PERCEPCIONES).getGrid().getRows();

        var _count = rows.size();
        for (var _i = 0; _i < _count; _i++) {
          row = rows.item(_i);
          neto = neto + Cairo.Util.val(Dialogs.cell(row, KI_NETO).getValue());
          ivaRi = ivaRi + Cairo.Util.val(Dialogs.cell(row, KI_IVARI).getValue());
          ivaRni = ivaRni + Cairo.Util.val(Dialogs.cell(row, KI_IVARNI).getValue());

          // Internos
          internos = internos + Cairo.Util.val(Dialogs.cell(row, KI_INTERNOS).getValue());
        }

        var _count = rowsPercep.size();
        for (var _i = 0; _i < _count; _i++) {
          row = rowsPercep.item(_i);
          percep = percep + Cairo.Util.val(Dialogs.cell(row, mPercepciones.kIP_IMPORTE).getValue());
        }

        var properties = m_footer.getProperties();
        properties.item(mVentaConstantes.FV_SUBTOTAL).setValue(neto);

        desc1 = m_dialog.getProperties().item(mVentaConstantes.FV_DESCUENTO1).getValue();
        desc2 = m_dialog.getProperties().item(mVentaConstantes.FV_DESCUENTO2).getValue();

        ivaRi = ivaRi - (ivaRi * desc1 / 100);
        ivaRni = ivaRni - (ivaRni * desc1 / 100);
        internos = internos - (internos * desc1 / 100);

        ivaRi = ivaRi - (ivaRi * desc2 / 100);
        ivaRni = ivaRni - (ivaRni * desc2 / 100);
        internos = internos - (internos * desc2 / 100);

        desc1 = neto * desc1 / 100;
        properties.item(mVentaConstantes.FV_IMPORTEDESC1).setValue(desc1);

        neto = neto - desc1;

        desc2 = neto * desc2 / 100;
        properties.item(mVentaConstantes.FV_IMPORTEDESC2).setValue(desc2);

        neto = neto - desc2;

        properties.item(mVentaConstantes.FV_NETO).setValue(neto);
        properties.item(mVentaConstantes.FV_IVARI).setValue(ivaRi);
        properties.item(mVentaConstantes.FV_IVARNI).setValue(ivaRni);

        // Internos
        properties.item(mVentaConstantes.FV_INTERNOS).setValue(internos);
        properties.item(mVentaConstantes.FV_TOTAL_PERCEPCIONES).setValue(percep);

        // Internos
        properties.item(mVentaConstantes.FV_TOTAL).setValue(neto + ivaRni + ivaRi + percep + internos);

        m_footer.refreshControls();
      };

      var pSetTasasImpositivas = function(row,  pr_id,  pr_nombre) { // TODO: Use of ByRef founded Private Sub pSetTasasImpositivas(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal pr_id As Long, ByVal pr_nombre As String)
        var ti_ri = null;
        var ti_rni = null;
        //' Internos
        var ti_internos = null;
        var porc_internos = null;

        if(pr_id == 0) { return; }

        // Internos
        if(!GetTasaFromProductoEx(pr_id, ti_ri, ti_rni, ti_internos, porc_internos, false)) { return; }

        if(ti_ri == 0) {
          MsgWarning(Cairo.Language.getText(1597, "", pr_nombre));
          //El producto [" & pr_nombre & "] no tiene definida su tasa impositiva de ventas para el iva responsable inscripto"
          return;
        }

        if(ti_rni == 0) {
          MsgWarning(Cairo.Language.getText(1598, "", pr_nombre));
          //El producto [" & pr_nombre & "] no tiene definida su tasa impositiva de ventas para el iva responsable no inscripto
          return;
        }

        var sqlstmt = null;
        var rs = null;

        if(m_bIva) {
          sqlstmt = "select ti_porcentaje,cue_id from tasaimpositiva where ti_id = "+ ti_ri.toString();
          if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

          if(!rs.isEOF()) {
            Dialogs.cell(row, KI_IVARIPERCENT).getValue() == Cairo.Database.valField(rs.getFields(), mVentaConstantes.TI_PORCENTAJE);
            Dialogs.cell(row, KI_CUE_ID_IVARI).getValue() == Cairo.Database.valField(rs.getFields(), mVentaConstantes.CUE_ID);
          }
        }
        else {
          Dialogs.cell(row, KI_IVARIPERCENT).getValue() == 0;
          Dialogs.cell(row, KI_CUE_ID_IVARI).getValue() == Cairo.Constants.NO_ID;
        }

        if(m_bIvaRni) {
          sqlstmt = "select ti_porcentaje,cue_id from tasaimpositiva where ti_id = "+ ti_rni.toString();
          if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

          if(!rs.isEOF()) {
            Dialogs.cell(row, KI_IVARNIPERCENT).getValue() == Cairo.Database.valField(rs.getFields(), mVentaConstantes.TI_PORCENTAJE);
            Dialogs.cell(row, KI_CUE_ID_IVARNI).getValue() == Cairo.Database.valField(rs.getFields(), mVentaConstantes.CUE_ID);
          }
        }
        else {
          Dialogs.cell(row, KI_IVARNIPERCENT).getValue() == 0;
          Dialogs.cell(row, KI_CUE_ID_IVARNI).getValue() == Cairo.Constants.NO_ID;
        }

        // Internos
        sqlstmt = "select ti_porcentaje from tasaimpositiva where ti_id = "+ ti_internos.toString();
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(!rs.isEOF()) {
          // Internos
          Dialogs.cell(row, KI_INTERNOSPERCENT).getValue() == Cairo.Database.valField(rs.getFields(), mVentaConstantes.TI_PORCENTAJE);
          Dialogs.cell(row, KI_INTERNOS_PORC).getValue() == porc_internos;
        }

      };

      // Reglas del Objeto de Negocios
      var pSetDataProducto = function(row,  pr_id) { // TODO: Use of ByRef founded Private Sub pSetDataProducto(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal pr_id As Long)
        var sqlstmt = null;
        var rs = null;
        var bEsKit = null;

        var bChanged = null;

        bChanged = pr_id !== Dialogs.cell(row, KI_PR_ID).getID();

        sqlstmt = "sp_StockProductoGetData "+ pr_id.toString()+ ","+ pGetCliId().toString()+ ",Null";

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(!rs.isEOF()) {
          bEsKit = Cairo.Database.valField(rs.getFields(), mVentaConstantes.PR_ESKIT);

          Dialogs.cell(row, KI_UNIDAD).getValue() == Cairo.Database.valField(rs.getFields(), "unidadVenta");

          var w_pCell = Dialogs.cell(row, mPercepciones.kI_CCOS_ID);
          w_pCell.setValue(Cairo.Database.valField(rs.getFields(), "centro_costo_venta"));
          w_pCell.setID(Cairo.Database.valField(rs.getFields(), mVentaConstantes.CCOS_ID_VENTA));

          // Si el documento no mueve stock no se exigen los numeros de serie
          //
          if(m_showStockData) {
            Dialogs.cell(row, KI_PR_LLEVANROSERIE).getID() == Cairo.Database.valField(rs.getFields(), mVentaConstantes.PR_LLEVA_NRO_SERIE);

            // Lote
            //
            Dialogs.cell(row, KI_PR_LLEVALOTE).getID() == Cairo.Database.valField(rs.getFields(), mVentaConstantes.PR_LLEVA_NRO_LOTE);

            // Lote Fifo
            //
            Dialogs.cell(row, KI_PR_LOTEFIFO).getID() == Cairo.Database.valField(rs.getFields(), mVentaConstantes.PR_LOTE_FIFO);

          }
          else {
            Dialogs.cell(row, KI_PR_LLEVANROSERIE).getID() == false;

            // Lote
            //
            Dialogs.cell(row, KI_PR_LLEVALOTE).getID() == false;

            // Lote Fifo
            //
            Dialogs.cell(row, KI_PR_LOTEFIFO).getID() == false;
          }

          Dialogs.cell(row, KI_ES_KIT).getID() == bEsKit;
          Dialogs.cell(row, KI_CUE_ID).getValue() == Cairo.Database.valField(rs.getFields(), mVentaConstantes.CUEIDVENTA);

          if(bEsKit) {

            var coll = null;

            sqlstmt = "sp_StockProductoGetKitInfo "+ pr_id.toString();
            if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

            coll = Object.getCollKitInfoXPrId(pr_id, m_collKitInfo);

            while (!rs.isEOF()) {
              pr_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.PR_ID);
              //*TODO:** can't found type for with block
              //*With GetKitInfoItem(coll, pr_id)
              var w___TYPE_NOT_FOUND = GetKitInfoItem(coll, pr_id);
              w___TYPE_NOT_FOUND.pr_id = pr_id;
              w___TYPE_NOT_FOUND.nombre = Cairo.Database.valField(rs.getFields(), mVentaConstantes.PR_NOMBRE_COMPRA);
              w___TYPE_NOT_FOUND.Cantidad = Cairo.Database.valField(rs.getFields(), "cantidad");
              w___TYPE_NOT_FOUND.LlevaNroSerie = Cairo.Database.valField(rs.getFields(), mVentaConstantes.PR_LLEVA_NRO_SERIE);
              rs.MoveNext;
            }
          }
        }

        // Si cambio el producto borro los numeros de serie
        //
        if(bChanged || Dialogs.cell(row, KI_PR_LLEVANROSERIE).getID() == 0) {

          Dialogs.cell(row, KI_NROSERIE).getValue() == "";
          if(ExistsObjectInColl(m_nrosSerie, GetKey(Dialogs.cell(row, KI_GRUPO).getID()))) {

            m_nrosSerie.remove(GetKey(Dialogs.cell(row, KI_GRUPO).getID()));
          }
        }
      };

      var pSetEnabled = function() {
        var bState = null;

        // Si se genera desde un pedido y es nuevo
        // no puede editar, tiene que hacer click en
        // nuevo y llamar al asistente
        if(pDocDesdePedido() && m_id == Cairo.Constants.NO_ID) {
          bState = false;
        }
        else if(pDocDesdeRemito() && m_id == Cairo.Constants.NO_ID) {
          bState = false;
        }
        else if(pDocDesdePacking() && m_id == Cairo.Constants.NO_ID) {
          bState = false;
        }
        else if(m_docEditable) {
          bState = m_dialog.getProperties().item(mVentaConstantes.DOC_ID).getSelectId() !== Cairo.Constants.NO_ID;
        }
        else {
          bState = false;
        }

        pSetEnabledAux(bState);
      };

      var pSetEnabledAux = function(bState) {
        var prop = null;

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          prop = m_dialog.getProperties().item(_i);
          // HIDECOLS
          if(prop.getKey() !== K_DOC_ID && prop.getKey() !== K_NUMERO && prop.getKey() !== K_EST_ID && prop.getKey() !== K_HIDECOLS) {

            if(bState) {
              if(prop.getKey() == K_NRODOC) {
                prop.setEnabled(m_taPropuesto);
              }
              else if(prop.getKey() == K_RV_NRODOC) {
                prop.setEnabled(m_rvTaPropuesto);
              }
              else {
                prop.setEnabled(bState);
              }
            }
            else {
              prop.setEnabled(false);
            }
          }
        }

        if(bState) {
          var properties = m_dialog.getProperties();
          properties.item(mVentaConstantes.DEPL_ID_ORIGEN).setEnabled(m_showStockData);
        }

        var _count = m_items.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          prop = m_items.getProperties().item(_i);
          prop.setEnabled(bState);
        }

                #If PREPROC_SFS Then;
        var abmGen = null;
                #Else;
        var abmGen = null;
                #End If;

        abmGen = m_items;
        abmGen.RefreshEnabledState(m_items.getProperties());

        abmGen = m_dialog;
        abmGen.RefreshEnabledState(m_dialog.getProperties());
      };

      var setDatosCliente = function() {
        var _rtn = null;
        var lp_id = null;
        var ld_id = null;

        var cpg_id = null;
        var cpg_nombre = null;

        var trans_id = null;
        var pro_id = null;
        var ven_id = null;

        var trans_nombre = null;
        var pro_nombre = null;
        var ven_nombre = null;

        var lP = null;
        var lD = null;
        var iProp = null;
        var filter = null;
        var bClientChange = null;

        var property = m_dialog.getProperties().item(mVentaConstantes.CLI_ID);
        if(m_lastCliId == property.getSelectId()) {
          return _rtn;
        }
        bClientChange = true;
        m_lastCliId = property.getSelectId();

        // Esto va aca
        _rtn = bClientChange;

        if(!GetClienteDataEx2(m_lastCliId, lp_id, ld_id, cpg_id, trans_id, pro_id, ven_id, trans_nombre, pro_nombre, ven_nombre, m_lastDocId)) { return _rtn; }

        // Condicion de pago
        if(cpg_id !== Cairo.Constants.NO_ID) {

          if(!Cairo.Database.getData(mVentaConstantes.CONDICIONPAGO, mVentaConstantes.CPG_ID, cpg_id, mVentaConstantes.CPG_NAME, cpg_nombre)) { return _rtn; }

          iProp = m_dialog.getProperties().item(mVentaConstantes.CPG_ID);
          iProp.setValue(cpg_nombre);
          iProp.setSelectId(cpg_id);
          m_dialog.showValue(iProp);
        }

        // Lista de precios
        iProp = m_dialog.getProperties().item(mVentaConstantes.LP_ID);
        iProp.setSelectFilter(GetListaPrecioGetXCliente(m_lastDocId, m_lastCliId));

        if(lp_id !== Cairo.Constants.NO_ID) {
          lP = new cListaPrecio();
          iProp.setValue(lP.GetData(lp_id, mVentaConstantes.LP_NAME, Cairo.Constants.Types.text));
          iProp.setSelectId(lp_id);
        }

        m_dialog.showValue(iProp);

        // Lista de descuentos
        iProp = m_dialog.getProperties().item(mVentaConstantes.LD_ID);
        iProp.setSelectFilter(GetListaDescGetXCliente(m_lastDocId, m_lastCliId));

        if(ld_id !== Cairo.Constants.NO_ID) {
          lD = new cListaDescuento();
          iProp.setValue(lD.GetData(ld_id, mVentaConstantes.LD_NAME, Cairo.Constants.Types.text));
          iProp.setSelectId(ld_id);
        }

        m_dialog.showValue(iProp);

        //////////////////////////////////////////////////////////////
        if(ven_id !== Cairo.Constants.NO_ID) {
          iProp = m_dialog.getProperties().item(mVentaConstantes.VEN_ID);
          iProp.setValue(ven_nombre);
          iProp.setSelectId(ven_id);
          m_dialog.showValue(iProp);
        }
        if(trans_id !== Cairo.Constants.NO_ID) {
          iProp = m_dialog.getProperties().item(mVentaConstantes.TRANS_ID);
          iProp.setValue(trans_nombre);
          iProp.setSelectId(trans_id);
          m_dialog.showValue(iProp);
        }
        if(pro_id !== Cairo.Constants.NO_ID) {
          iProp = m_dialog.getProperties().item(mVentaConstantes.PRO_ID_DESTINO);
          iProp.setValue(pro_nombre);
          iProp.setSelectId(pro_id);
          m_dialog.showValue(iProp);
        }

        iProp = m_dialog.getProperties().item(mVentaConstantes.CLIS_ID);
        iProp.setSelectFilter(GetHelpFilterCliSuc(m_lastCliId));

        m_dialog.showValue(iProp);

        //////////////////////////////////////////////////////////////

        // Talonario y Categoria fiscal
        pGetIvaFromCliente(m_lastCliId);

        pShowFechaVto();

        //////////////////////////////////////////////////////////////

        // Percepciones
        mPercepciones.self.loadPercepcionesForCliente(m_lastCliId, m_vPercepciones[], m_dialog.getProperties().item(mVentaConstantes.FV_FECHA).getValue());


        return _rtn;
      };

      var pGetIvaFromCliente = function(cli_id) {
        var sqlstmt = null;
        var rs = null;
        var bIvaChanged = null;
        var bLastIva = null;
        var lastCatFiscal = null;

        sqlstmt = "sp_clienteGetIva "+ cli_id.toString();
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(rs.isEOF()) { return; }

        lastCatFiscal = m_catFiscal;
        m_catFiscal = Cairo.Database.valField(rs.getFields(), mVentaConstantes.CLI_CATFISCAL);
        m_bCatFiscalChanged = lastCatFiscal !== m_catFiscal;

        bLastIva = m_bIva;
        m_bIva = Cairo.Database.valField(rs.getFields(), "bIva");
        if(bLastIva !== m_bIva) { bIvaChanged = true; }

        bLastIva = m_bIvaRni;
        m_bIvaRni = Cairo.Database.valField(rs.getFields(), "bIvaRni");
        if(bLastIva !== m_bIvaRni) { bIvaChanged = true; }

        if(bIvaChanged) {
          pUpdateIva();
          updateTotals();
        }
      };

      var pGetCueIdCliente = function(mon_id,  cue_id) { // TODO: Use of ByRef founded Private Function pGetCueIdCliente(ByRef mon_id As Long, ByRef Cue_id As Long) As Boolean
        var sqlstmt = null;
        var rs = null;

        // Cuenta contable del cliente
        sqlstmt = "sp_DocGetCueId "+ m_lastCliId+ ","+ m_lastDocId;
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

        if(rs.isEOF()) { return false; }

        cue_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.CUE_ID);
        mon_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.MON_ID);

        return true;
      };

      var pFirmar = function() {
        var doc = null;
        var us_id = null;

        doc = new cDocumento();

        if(m_id == Cairo.Constants.NO_ID) {
          MsgWarning(Cairo.Language.getText(1592, ""));
          //Antes de poder firmar el documento debe guardarlo
          return null;
        }

        if(m_firmado) {
          //If Not Ask("El documento ya ha sido firmado desea borrar la firma", vbYes, "Firmar") Then
          if(!Ask(Cairo.Language.getText(1593, ""), vbYes, Cairo.Language.getText(1594, ""))) {
            return null;
          }
        }

        if(!doc.Firmar(m_docId, us_id)) { return false; }

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_DocFacturaVentaFirmar "+ m_id+ ","+ us_id.toString();
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

        m_estId = Cairo.Database.valField(rs.getFields(), Cairo.Constants.EST_ID);
        m_estado = Cairo.Database.valField(rs.getFields(), Cairo.Constants.EST_NAME);

        var iProp = null;
        iProp = m_dialog.getProperties().item(cDeclarations.getCsDocEstateID());

        iProp.setSelectId(m_estId);
        iProp.setValue(m_estado);

        Cairo.Database.getData(mVentaConstantes.FACTURAVENTA, mVentaConstantes.FV_ID, m_id, mVentaConstantes.FV_FIRMADO, m_firmado);

        m_dialog.showValue(iProp);

        return true;
      };

      var pMove = function(moveTo) {
        var sqlstmt = null;
        var rs = null;
        var doc_id = null;

        doc_id = m_dialog.getProperties().item(mVentaConstantes.DOC_ID).getSelectId();

        if(doc_id == Cairo.Constants.NO_ID) { MsgInfo(Cairo.Language.getText(1595, "")); }
        //Debe seleccionar un documento

        sqlstmt = "sp_DocFacturaVentaMover "+ moveTo+ ","+ m_numero+ ","+ doc_id.toString();

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

        // Si no obtuve ningun id al moverme
        //
        if(rs.isEOF()) {

          switch (moveTo) {

            // Si era siguiente ahora busco el ultimo
            //
            case Dialogs.Message.MSG_DOC_NEXT:
              //' Llamada recursiva
              pMove(Dialogs.Message.MSG_DOC_LAST);

              // Si era anterior ahora busco el primero
              //
              break;

            case Dialogs.Message.MSG_DOC_PREVIOUS:
              //' Llamada recursiva
              pMove(Dialogs.Message.MSG_DOC_FIRST);

              // Si no encontre ni ultimo ni primero
              // es por que no hay ningun comprobante para
              // este documento
              //
              break;

            case Dialogs.Message.MSG_DOC_FIRST:
            case Dialogs.Message.MSG_DOC_LAST:

              // Limpio incluso el ultimo cliente
              //
              m_lastCliId = Cairo.Constants.NO_ID;
              m_lastCliName = "";

              // Cargo un registro vacio
              //
              load(Cairo.Constants.NO_ID);

              // Obtengo un nuevo numero de comprobante
              //
              GetDocNumberForCliente(m_lastCliId, m_lastDocId, m_dialog, m_taPropuesto);

              // Refresco el formulario
              //
              pRefreshProperties();
              break;
          }

        }
        else {
          if(!load(Cairo.Database.valField(rs.getFields(), 0))) { return false; }

          pRefreshProperties();
        }

        return true;
      };

      var pRefreshProperties = function() {
        var c = null;
                #If PREPROC_SFS Then;
        var abmGen = null;
                #Else;
        var abmGen = null;
                #End If;
        var filter = null;
        var cotizacion = null;

        var properties = m_dialog.getProperties();

        c = properties.item(mVentaConstantes.DOC_ID);
        c.setSelectId(m_docId);
        c.setValue(m_documento);

        c = properties.item(mVentaConstantes.FV_FECHA);
        c.setValue(m_fecha);

        c = properties.item(mVentaConstantes.FV_FECHAENTREGA);
        c.setValue(m_fechaentrega);

        c = properties.item(mVentaConstantes.CLI_ID);
        c.setSelectId(m_cliId);
        c.setValue(m_cliente);

        c = properties.item(cDeclarations.getCsDocNumberID());
        c.setValue(m_numero);

        c = properties.item(cDeclarations.getCsDocEstateID());
        c.setValue(m_estado);

        c = properties.item(mVentaConstantes.FV_NRODOC);
        c.setValue(m_nrodoc);
        c.setTextMask(m_taMascara);
        c.setTextAlign(vbRightJustify);

        c = properties.item(mVentaConstantes.FV_DESCUENTO1);
        c.setValue(m_descuento1);

        c = properties.item(mVentaConstantes.FV_DESCUENTO2);
        c.setValue(m_descuento2);

        c = properties.item(mVentaConstantes.CPG_ID);
        c.setSelectId(m_cpgId);
        c.setValue(m_condicionPago);

        c = properties.item(mVentaConstantes.FV_FECHA_VTO);
        c.setValue(m_fechaVto);

        c = properties.item(mVentaConstantes.VEN_ID);
        c.setSelectId(m_venId);
        c.setValue(m_vendedor);

        c = properties.item(mVentaConstantes.FV_COTIZACION);
        c.setValue(m_cotizacion);

        c = properties.item(mVentaConstantes.LP_ID);
        c.setSelectFilter(GetListaPrecioGetXCliente(m_docId, m_cliId));
        c.setSelectId(m_lpId);
        c.setValue(m_listaPrecio);

        c = properties.item(mVentaConstantes.LD_ID);
        c.setSelectFilter(GetListaDescGetXCliente(m_docId, m_cliId));
        c.setSelectId(m_ldId);
        c.setValue(m_listaDescuento);

        c = properties.item(mVentaConstantes.CCOS_ID);
        c.setSelectId(m_ccosId);
        c.setValue(m_centroCosto);

        c = properties.item(mVentaConstantes.SUC_ID);
        c.setSelectId(m_sucId);
        c.setValue(m_sucursal);

        c = properties.item(mVentaConstantes.FV_DESCRIP);
        c.setValue(m_descrip);

        c = properties.item(mVentaConstantes.LGJ_ID);
        c.setSelectId(m_lgjId);
        c.setValue(m_legajo);

        c = properties.item(mVentaConstantes.PRO_ID_ORIGEN);
        c.setSelectId(m_proIdOrigen);
        c.setValue(m_proOrigen);

        c = properties.item(mVentaConstantes.PRO_ID_DESTINO);
        c.setSelectId(m_proIdDestino);
        c.setValue(m_proDestino);

        c = properties.item(mVentaConstantes.TRANS_ID);
        c.setSelectId(m_transId);
        c.setValue(m_transporte);

        c = properties.item(mVentaConstantes.CLIS_ID);
        c.setSelectId(m_clisId);
        c.setValue(m_clienteSucursal);

        c = properties.item(mVentaConstantes.FV_CAI);
        c.setValue(m_cai);

        c = properties.item(mVentaConstantes.FV_ORDEN_COMPRA);
        c.setValue(m_ordenCompra);

        c = properties.item(mVentaConstantes.DEPL_ID_ORIGEN);
        if(m_deplId !== Cairo.Constants.NO_ID || !m_showStockData) {
          c.setSelectId(m_deplId);
          c.setValue(m_deposito);
        }
        else {
          // Preferencias del usuario
          //
          c.setSelectId(m_userCfg.getDeplId());
          c.setValue(m_userCfg.getDeplNombre());
          pSetStock();
        }

        c = properties.item(mVentaConstantes.RV_NRODOC);
        c.setValue("");
        c.setTextMask("");
        c.setTextAlign(vbRightJustify);

        c = properties.item(mVentaConstantes.FV_FECHA_IVA);
        c.setValue(m_fechaIva);

        abmGen = m_dialog;
        abmGen.ShowValues(m_dialog.getProperties());

        abmGen.ResetChanged;

        if(m_cotizacion !== 0) {
          cotizacion = m_cotizacion;
        }
        else {
          cotizacion = 1;
        }

        c = pGetItems();
        if(!pLoadItems(c, cotizacion)) { return; }

        m_itemsDeleted = "";

        c = m_items.getProperties().item(C_PERCEPCIONES);
        if(!pLoadPercepciones(c, cotizacion)) { return; }

        m_percepcionesDeleted = "";

        abmGen = m_items;
        abmGen.ShowValues(m_items.getProperties());

        var properties = m_footer.getProperties();

        c = properties.item(mVentaConstantes.FV_SUBTOTAL);
        c.setValue(m_subTotal);

        c = properties.item(mVentaConstantes.FV_IMPORTEDESC1);
        c.setValue(m_importeDesc1);

        c = properties.item(mVentaConstantes.FV_IMPORTEDESC2);
        c.setValue(m_importeDesc2);

        c = properties.item(mVentaConstantes.FV_NETO);
        c.setValue(m_neto);

        c = properties.item(mVentaConstantes.FV_IVARI);
        c.setValue(m_ivari);

        c = properties.item(mVentaConstantes.FV_IVARNI);
        c.setValue(m_ivarni);

        // Internos
        c = properties.item(mVentaConstantes.FV_INTERNOS);
        c.setValue(m_internos);

        c = properties.item(mVentaConstantes.FV_TOTAL_PERCEPCIONES);
        c.setValue(m_totalPercepciones);

        c = properties.item(mVentaConstantes.FV_TOTAL);
        c.setValue(m_total);

        abmGen = m_footer;
        abmGen.ShowValues(m_footer.getProperties());

        pSetEnabled();

        showCotizacion();
        pShowFechaVto();

        // DATADD
        mPublicVentas.self.showDataAddCliente(m_userCfg.getShowDataAddInVentas(), m_dialog);

      };

      var pGetDocFilter = function() {
        return "'doct_id = "+ csEDocumentoTipo.cSEDT_FACTURAVENTA.toString()+ " or doct_id = "+ csEDocumentoTipo.cSEDT_NOTACREDITOVENTA.toString()+ " or doct_id = "+ csEDocumentoTipo.cSEDT_NOTADEBITOVENTA.toString()+ "'";
      };

      var pShowApply = function() {

        if(!DoCairo.Security.anAccess(csVentasPrestacion.cSPREVTAMODIFYAPLIC, m_docId, csE_DocTypePrestacion.cSEDOCTPREAPLICAR)) { return; }

        if(m_objApply == null) {
          m_objApply = new cFacturaVentaAplic();

          // Edit Apply
          //
        }
        else {
          if(m_objApply.self.getId() !== m_id) {
            m_objApply.self.setObjectClient(null);
            m_objApply = new cFacturaVentaAplic();
          }
        }

        // Edit Apply
        //
        m_objApply.self.setObjectClient(self);

        if(!m_objApply.self.show(m_id, m_total * (m_cotizacion !== 0) ? m_cotizacion : 1), m_nrodoc, m_cliId, m_cliente, m_sucId, m_docId, m_doctId == csEDocumentoTipo.cSEDT_NOTACREDITOVENTA)) {
          m_objApply = null;
        }

      };

      var pShowStartWizardProyecto = function() {
        try {

          var oWizard = null;
          oWizard = new cFacturaVentaHoraWiz();

          var mouse = null;
          mouse = new cMouseWait();

          if(!oWizard.self.load()) { return; }

          oWizard.self.setCli_id(m_cliId);
          oWizard.self.setCliente() = m_cliente;
          oWizard.self.setHoraIds() = m_horaIds;
          //.AutoPago = m_bAutoPago
          //.cue_id_autoPago = m_cueIdAutoPago
          //.ModoVentaCtaCte = m_ModoVentaCtaCte
          oWizard.self.setDoc_id(m_lastDocId);
          oWizard.self.setDocumento() = m_lastDocName;
          oWizard.self.setObjClient(self);

          //Dim iEditGeneric As cIEditGeneric
          //Set iEditGeneric = oWizard
          //Set iEditGeneric.ObjTree = m_ObjTree

          var iObjWizard = null;
          var oObjWizard = null;

          iObjWizard = CSKernelClient2.CreateObject("CSABMInterface2.cWizardGeneric");
          oObjWizard = iObjWizard;
          oObjWizard.setObjClient(oWizard);
          oObjWizard.setPushVirtualNext(m_bPushVirtualNext);
          oObjWizard.setCloseWizardAfterSave(m_bCloseWizardAfterSave);

          iObjWizard.show("CSVenta2.cFacturaVentaHoraWiz");

          oObjWizard.getObjAbm().getObjForm().ZOrder;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "pShowStartWizardProyecto", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var pShowStartWizardPacking = function() {
        try {

          var oWizard = null;
          oWizard = new cFacturaVentaPackingWiz();

          var mouse = null;
          mouse = new cMouseWait();

          if(!oWizard.self.load()) { return; }

          oWizard.self.setCli_id(m_cliId);
          oWizard.self.setCliente() = m_cliente;
          oWizard.self.setPklstIds() = m_pklstIds;
          //.AutoPago = m_bAutoPago
          //.cue_id_autoPago = m_cueIdAutoPago
          //.ModoVentaCtaCte = m_ModoVentaCtaCte
          oWizard.self.setDoc_id(m_lastDocId);
          oWizard.self.setDocumento() = m_lastDocName;
          oWizard.self.setObjClient(self);

          //Dim iEditGeneric As cIEditGeneric
          //Set iEditGeneric = oWizard
          //Set iEditGeneric.ObjTree = m_ObjTree

          var iObjWizard = null;
          var oObjWizard = null;

          iObjWizard = CSKernelClient2.CreateObject("CSABMInterface2.cWizardGeneric");
          oObjWizard = iObjWizard;
          oObjWizard.setObjClient(oWizard);
          oObjWizard.setPushVirtualNext(m_bPushVirtualNext);
          oObjWizard.setCloseWizardAfterSave(m_bCloseWizardAfterSave);

          iObjWizard.show("CSVenta2.cFacturaVentaPackingWiz");

          oObjWizard.getObjAbm().getObjForm().ZOrder;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "pShowStartWizardPacking", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var pShowStartWizardRemito = function() {
        try {

          var oWizard = null;
          oWizard = new cFacturaVentaRemitoWiz();

          var mouse = null;
          mouse = new cMouseWait();

          if(!oWizard.self.load()) { return; }

          oWizard.self.setCli_id(m_cliId);
          oWizard.self.setCliente() = m_cliente;
          oWizard.self.setCj_id() = m_cjId;
          oWizard.self.setRvIds() = m_rvIds;
          oWizard.self.setAutoPago(m_bAutoPago);
          oWizard.self.setCue_id_autoPago(m_cueIdAutoPago);
          oWizard.self.setModoVentaCtaCte(m_modoVentaCtaCte);
          oWizard.self.setDoc_id(m_lastDocId);
          oWizard.self.setDocumento() = m_lastDocName;
          oWizard.self.setObjClient(self);

          //Dim iEditGeneric As cIEditGeneric
          //Set iEditGeneric = oWizard
          //Set iEditGeneric.ObjTree = m_ObjTree

          var iObjWizard = null;
          var oObjWizard = null;

          iObjWizard = CSKernelClient2.CreateObject("CSABMInterface2.cWizardGeneric");
          oObjWizard = iObjWizard;
          oObjWizard.setObjClient(oWizard);
          oObjWizard.setPushVirtualNext(m_bPushVirtualNext);
          oObjWizard.setCloseWizardAfterSave(m_bCloseWizardAfterSave);

          iObjWizard.show("CSVenta2.cFacturaVentaRemitoWiz");

          if(!oObjWizard.getObjAbm() == null) {
            oObjWizard.getObjAbm().getObjForm().ZOrder;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "pShowStartWizardRemito", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var pShowStartWizard = function() {
        try {

          var oWizard = null;
          oWizard = new cFacturaVentaWizard();

          var mouse = null;
          mouse = new cMouseWait();

          if(!oWizard.self.load()) { return; }

          oWizard.self.setCli_id(m_cliId);
          oWizard.self.setCliente() = m_cliente;
          oWizard.self.setCj_id() = m_cjId;
          oWizard.self.setPvIds() = m_pvIds;
          oWizard.self.setPviIds() = m_pviIds;
          oWizard.self.setPviCantidades() = m_pviCantidades;
          oWizard.self.setAutoSelectEasy(m_bAutoSelectEasy);
          oWizard.self.setAutoPago(m_bAutoPago);
          oWizard.self.setCue_id_autoPago(m_cueIdAutoPago);
          oWizard.self.setModoVentaCtaCte(m_modoVentaCtaCte);
          oWizard.self.setDoc_id(m_lastDocId);
          oWizard.self.setDocumento() = m_lastDocName;
          oWizard.self.setObjClient(self);

          //Dim iEditGeneric As cIEditGeneric
          //Set iEditGeneric = oWizard
          //Set iEditGeneric.ObjTree = m_ObjTree

          var iObjWizard = null;
          var oObjWizard = null;

          iObjWizard = CSKernelClient2.CreateObject("CSABMInterface2.cWizardGeneric");
          oObjWizard = iObjWizard;
          oObjWizard.setObjClient(oWizard);
          oObjWizard.setPushVirtualNext(m_bPushVirtualNext);
          oObjWizard.setCloseWizardAfterSave(m_bCloseWizardAfterSave);

          iObjWizard.show("CSVenta2.cFacturaVentaWizard");

          if(!m_bPushVirtualNext) {

            oObjWizard.getObjAbm().getObjForm().ZOrder;

          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "pShowStartWizard", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      // Construccion - Destruccion
      self.initialize = function() {
        try {

          // Si estoy inicializando no hago nada de todo esto
          // ya que la llamada es solo para crear el menu
          //
          if(cUtil.getStarting()) { return; }

          //'Error al grabar la Factura de Venta
          c_ErrorSave = Cairo.Language.getText(2220, "");

          m_nrosSerie = new Collection();
          m_generalConfig = new cGeneralConfig();
          m_generalConfig.Load;

          // Lote
          //
          m_stockConfig = new cStockConfig();
          m_stockConfig.load();

          // Caja
          //
          m_ventasCfg = new cVentaConfig();
          m_ventasCfg.load();

          // Preferencias del Usuario
          //
          m_userCfg = new cUsuarioConfig();
          m_userCfg.Load;
          m_userCfg.ValidateFV;

          pLoadCajaForUsuario(false);

          G.redim(m_pvIds, 0);
          G.redim(m_pviIds, 0);
          G.redim(m_pviCantidades, 0);
          G.redim(m_rvIds, 0);
          G.redim(m_horaIds, 0);
          G.redim(m_pklstIds, 0);

          G.redim(m_vPercepciones, 0);

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
          m_listController = null;
          m_footer = null;
          m_items = null;
          m_generalConfig = null;
          m_hojaRuta = null;
          m_searchZona = null;

          // Lote
          //
          m_stockConfig = null;

          // Preferencias del Usuario
          //
          m_userCfg = null;

          m_host = null;
          G.redim(m_pvIds, 0);
          G.redim(m_pviIds, 0);
          G.redim(m_pviCantidades, 0);
          G.redim(m_rvIds, 0);
          G.redim(m_horaIds, 0);
          G.redim(m_pklstIds, 0);
          mCollection.collClear(m_nrosSerie);
          m_nrosSerie = null;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "Class_Terminate", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var pSetShowStockData = function(bInLoadCollection) {
        var docId = null;
        var docIdRto = null;
        var doc = null;

        doc = new cDocumento();

        m_showStockData = false;

        docId = m_dialog.getProperties().item(mVentaConstantes.DOC_ID).getSelectId();

        // Si la factura mueve stock
        //
        if(CBool(doc.GetData(docId, mVentaConstantes.DOC_MUEVE_STOCK, Cairo.Constants.Types.boolean))) {
          m_showStockData = true;

          // Verifico si genera remito que mueve stock
          //
        }
        else {
          // Si genera remito
          //
          if(CBool(doc.GetData(docId, mVentaConstantes.DOC_GENERA_REMITO, Cairo.Constants.Types.boolean))) {
            // Obtengo el docid del remito
            //
            docIdRto = doc.GetData(docId, mVentaConstantes.DOC_ID_REMITO, Cairo.Constants.Types.long);

            // Si el remito mueve stock
            //
            m_showStockData = CBool(doc.GetData(docIdRto, mVentaConstantes.DOC_MUEVE_STOCK, Cairo.Constants.Types.boolean));
          }
        }

        // HIDECOLS
        //
        if(!bInLoadCollection) { pShowHideCols(true); }

      };

      var pSetNrosSerieInRow = function(currGroup,  nroSerie) {
        var row = null;

        if(currGroup == 0) { return; }

        var _count = m_items.getProperties().item(C_ITEMS).getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = m_items.getProperties().item(C_ITEMS).getGrid().getRows().item(_i);
          if(Dialogs.cell(row, KI_GRUPO).getID() == currGroup) {
            Dialogs.cell(row, KI_NROSERIE).getValue() == RemoveLastColon(nroSerie);
            return;
          }
        }
      };

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////
      var pSaveItemNroSerie = function(row,  iOrden,  prId,  fvTMPId,  fviTMPId,  grupo) { // TODO: Use of ByRef founded Private Function pSaveItemNroSerie(ByRef Row As CSInterfacesABM.cIABMGridRow, ByRef iOrden As Long, ByVal PrId As Long, ByVal FvTMPId As Long, ByVal FviTMPId As Long, ByVal Grupo As Long) As Boolean

        var pt = null;
        var register = null;

        // Si lleva numero de serie
        //
        if(Dialogs.cell(row, KI_PR_LLEVANROSERIE).getID() && m_showStockData) {

          // Obtengo los numeros de serie y guardo un Item por cada uno
          //
          var _count = m_nrosSerie.get(GetKey(grupo)).size();
          for (var _i = 0; _i < _count; _i++) {
            pt = m_nrosSerie.get(GetKey(grupo)).item(_i);

            register = new cRegister();
            register.setFieldId(mVentaConstantes.FVIS_TMPID);
            register.setTable(mVentaConstantes.FACTURAVENTAITEMSERIETMP);
            register.setId(Cairo.Constants.NEW_ID);

            register.getFields().add2(mVentaConstantes.PR_ID, prId, Cairo.Constants.Types.id);

            if(m_copy) {
              register.getFields().add2(mVentaConstantes.PRNS_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.integer);
            }
            else {
              register.getFields().add2(mVentaConstantes.PRNS_ID, pt.getPrns_id(), Cairo.Constants.Types.id);
            }

            register.getFields().add2(mVentaConstantes.PRNS_CODE, pt.getCodigo(), Cairo.Constants.Types.text);
            register.getFields().add2(mVentaConstantes.PRNS_DESCRIP, pt.getDescrip(), Cairo.Constants.Types.text);
            register.getFields().add2(mVentaConstantes.PRNS_FECHAVTO, pt.getFechaVto(), Cairo.Constants.Types.date);
            register.getFields().add2(mVentaConstantes.PR_ID_ITEM, pt.getPr_id_item(), Cairo.Constants.Types.id);

            register.getFields().add2(mVentaConstantes.FV_TMPID, fvTMPId, Cairo.Constants.Types.id);
            register.getFields().add2(mVentaConstantes.FVI_TMPID, fviTMPId, Cairo.Constants.Types.id);

            iOrden = iOrden + 1;
            register.getFields().add2(mVentaConstantes.FVIS_ORDEN, iOrden, Cairo.Constants.Types.integer);

            register.getFields().setHaveLastUpdate(false);
            register.getFields().setHaveWhoModify(false);

            if(!Cairo.Database.save(register, , "pSaveItemNroSerie", C_MODULE, c_ErrorSave)) { return false; }
          }
        }

        return true;
      };

      //////////////////////////////////////////////////////////////////////////////////////////////////
      // nrs devolucion
      var pGetDeplId = function() {
        var _rtn = 0;
        if(m_lastDoctId == csEDocumentoTipo.cSEDT_NOTACREDITOVENTA) {
          _rtn = csE_DepositosInternos.cSEDEPLIDTERCERO;
        }
        else {
          _rtn = m_dialog.getProperties().item(mVentaConstantes.DEPL_ID_ORIGEN).getSelectId();
        }

        return _rtn;
      };

      var pGetCliId = function() {
        return m_dialog.getProperties().item(mVentaConstantes.CLI_ID).getSelectId();
      };

      var getFecha = function() {
        return m_dialog.getProperties().item(mVentaConstantes.FV_FECHA).getValue();
      };

      var pSetStock = function() {

        if(m_stockConfig.getStockXFisico() || m_stockConfig.getNoControlaStock()) {

          m_depfId = Cairo.Constants.NO_ID;

          if(!Cairo.Database.getData(mVentaConstantes.DEPOSITOLOGICO, mVentaConstantes.DEPL_ID, pGetDeplId(), mVentaConstantes.DEPF_ID, m_depfId)) {
          }
        }

      };

      ////////////////////////////////////////////////////////////////////////////////
      //
      // Percepciones
      //
      var setGridPercepciones = function(property) {

        var o = null;

        var w_grid = property.getGrid();
        w_grid.getColumns().clear();
        w_grid.getRows().clear();

        mPercepciones.self.loadPercepciones(property.getGrid(), m_generalConfig);

        var w_rows = w_grid.getRows();

        for(var _i = 0; _i < m_data.percepciones.length; _i += 1) {

          var elem = w_rows.add(null, rs(mVentaConstantes.FV_PERC_ID).Value);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.percepciones[_i], mVentaConstantes.FV_PERC_ID);
          elem.Key = mPercepciones.kIP_FVPERC_ID;

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.percepciones[_i], mVentaConstantes.PERC_NAME);
          elem.id = Cairo.Database.valField(m_data.percepciones[_i], mVentaConstantes.PERC_ID);
          elem.Key = mPercepciones.kIP_PERC_ID;

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.percepciones[_i], mVentaConstantes.FV_PERC_BASE) / cotizacion;
          elem.Key = mPercepciones.kIP_BASE;

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.percepciones[_i], mVentaConstantes.FV_PERC_PORCENTAJE);
          elem.Key = mPercepciones.kIP_PORCENTAJE;

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.percepciones[_i], mVentaConstantes.FV_PERC_IMPORTE) / cotizacion;
          elem.Key = mPercepciones.kIP_IMPORTE;

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.percepciones[_i], mVentaConstantes.FV_PERC_DESCRIP);
          elem.Key = mPercepciones.kIP_DESCRIP;

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.percepciones[_i], mVentaConstantes.CCOS_NAME);
          elem.id = Cairo.Database.valField(m_data.percepciones[_i], mVentaConstantes.CCOS_ID);
          elem.Key = mPercepciones.kI_CCOS_ID;

        }

        return true;
      };

      var calcularPercepciones = function() {

        var row = null;
        var i = null;
        var perc_id = null;

        if(m_docSinPerc) { return; }

        var _count = pGetPercepcion().getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetPercepcion().getGrid().getRows().item(_i);
          perc_id = Cairo.Util.val(Dialogs.cell(row, mPercepciones.kIP_FVPERC_ID).getValue());
          if(perc_id) {
            m_percepcionesDeleted = m_percepcionesDeleted+ perc_id.toString()+ ",";
          }
        }

        for (i = 1; i <= m_vPercepciones.Length; i++) {

          m_vPercepciones[i].base = 0;

          var _count = pGetItems().getGrid().getRows().size();
          for (var _j = 0; _j < _count; _j++) {
            row = pGetItems().getGrid().getRows().item(_j);
            switch (m_vPercepciones[i].tipo_base) {
              case csE_PercepcionBase.cSEPB_NETO:
                m_vPercepciones[i].base = m_vPercepciones[i].base + Cairo.Util.val(Dialogs.cell(row, KI_NETO).getValue());
                break;

              case csE_PercepcionBase.cSEPB_NETOGRAVADO:
                if(Cairo.Util.val(Dialogs.cell(row, KI_IVARI).getValue())) {
                  m_vPercepciones[i].base = m_vPercepciones[i].base + Cairo.Util.val(Dialogs.cell(row, KI_NETO).getValue());
                }
                break;

              case csE_PercepcionBase.cSEPB_TOTAL:
                m_vPercepciones[i].base = m_vPercepciones[i].base + Cairo.Util.val(Dialogs.cell(row, KI_IMPORTE).getValue());
                break;
            }
          }

          if(m_vPercepciones[i].base > m_vPercepciones[i].minimo) {

            if(m_vPercepciones[i].base >= m_vPercepciones[i].desde && m_vPercepciones[i].base <= m_vPercepciones[i].hasta) {

              m_vPercepciones[i].percepcion = m_vPercepciones[i].base * m_vPercepciones[i].porc / 100 + m_vPercepciones[i].fijo;
            }
          }

        }

        var rows = null;
        var cell = null;

        rows = pGetPercepcion().getGrid().getRows();

        rows.clear();

        for (i = 1; i <= m_vPercepciones.Length; i++) {

          if(m_vPercepciones[i].percepcion) {

            row = rows.add(null);

            cell = row.add(null);
            cell.setValue(0);
            cell.setKey(mPercepciones.kIP_FVPERC_ID);

            cell = row.add(null);
            cell.setValue(m_vPercepciones[i].nombre);
            cell.setID(m_vPercepciones[i].perc_id);
            cell.setKey(mPercepciones.kIP_PERC_ID);

            cell = row.add(null);
            cell.setValue(m_vPercepciones[i].base);
            cell.setKey(mPercepciones.kIP_BASE);

            cell = row.add(null);
            cell.setValue(m_vPercepciones[i].porc);
            cell.setKey(mPercepciones.kIP_PORCENTAJE);

            cell = row.add(null);
            cell.setValue(m_vPercepciones[i].percepcion);
            cell.setKey(mPercepciones.kIP_IMPORTE);

            cell = row.add(null);
            cell.setValue("");
            cell.setKey(mPercepciones.kIP_DESCRIP);

            cell = row.add(null);
            cell.setValue("");
            cell.setID(Cairo.Constants.NO_ID);
            cell.setKey(mPercepciones.kI_CCOS_ID);

          }
        }

        var abmObj = null;
        abmObj = m_dialog;

        abmObj.ShowValue(pGetPercepcion(), true);

      };

      var pGetItems = function() {
        return m_items.getProperties().item(C_ITEMS);
      };

      var pGetPercepcion = function() {
        return m_items.getProperties().item(C_PERCEPCIONES);
      };

      var pShowCobranza = function() {
        try {

          var o = null;

          o = CSKernelClient2.CreateObject("CSTesoreria2.cCobranza");

          o.ShowCobranza(pGetCliId(), pGetFvIds());

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "pShowCobranza", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var pGetFvIds = function() {
        var rtn() = null;
        G.redim(rtn, 1);
        rtn[1] = m_id;
        return rtn;
      };

      // HIDECOLS
      //
      var pShowHideCols = function(bOnlyStock) {
        var columns = null;
        var bVisible = null;
        var abmObj = null;
        abmObj = m_dialog;

        if(abmObj.getInSave()) { return; }

        bVisible = Cairo.Util.val(m_dialog.getProperties().item(c_HideCols).getValue()) == 0;

        var iProp = null;
        iProp = pGetItems();

        abmObj.DrawGrid(iProp, false);

        var i = null;

        columns = iProp.getGrid().getColumns();
        for (i = 1; i <= columns.count(); i++) {
          switch (columns(i).Key) {

            case KI_DESCUENTO:
            case KI_UNIDAD:
            case KI_PRECIO_LP:
            case KI_IVARNI:
            case KI_TO_ID:

              // Solo si la llamada fue para todas las columnas
              // y no unicamente para las columnas de stock
              //
              if(!bOnlyStock) {
                columns(i).Visible = bVisible;
                abmObj.RefreshColumnPropertiesByIndex(iProp, i);
              }

              break;

            case KI_NROSERIE:
            case KI_STL_ID:

              // Si mueve stock se ven siempre
              //
              columns(i).Visible = m_showStockData;
              abmObj.RefreshColumnPropertiesByIndex(iProp, i);

              break;
          }
        }

        abmObj.DrawGrid(iProp, true);
      };

      var pUpdateIva = function() {
        var row = null;
        var cell = null;

        var _count = pGetItems().getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetItems().getGrid().getRows().item(_i);
          cell = Dialogs.cell(row, KI_PR_ID);
          pSetTasasImpositivas(row, cell.getId(), cell.getValue());
          pShowImporteAndIva(row);
        }

        var abmObj = null;
        abmObj = m_dialog;
        abmObj.ShowValue(pGetItems(), true);
      };
      //
      // HIDECOLS - fin

      var pSaveAsPresupuesto = function() {
        var _rtn = null;
        var register = null;

        var docId = null;

        docId = m_userCfg.getDocPrevId();

        if(docId == Cairo.Constants.NO_ID) {
          m_userCfg.Load;
        }

        docId = m_userCfg.getDocPrevId();

        if(docId == Cairo.Constants.NO_ID) {
          //' Debe seleccionar un documento para persupuestos en sus preferencias. Use la opcion de menu [Configuración -> General -> Preferencias]
          MsgWarning(Cairo.Language.getText(3950, ""));
          return _rtn;
        }

        // Save and State
        //
        if(!DocCanSave(m_dialog, mVentaConstantes.FV_FECHA)) {
          _rtn = false;
          return _rtn;
        }

        if(pGetItems().getGrid().getRows().count() == 0) {
          //'El documento debe contener al menos un item
          MsgWarning(Cairo.Language.getText(3903, ""));
          _rtn = false;
          return _rtn;
        }

        var mouse = null;
        mouse = new cMouseWait();

        DoEvents:(DoEvents: DoEvents: DoEvents);

        register = new cRegister();
        register.setFieldId(mVentaConstantes.PRV_TMPID);
        register.setTable(mVentaConstantes.PRESUPUESTOVENTATMP);

        register.setId(Cairo.Constants.NEW_ID);
        register.getFields().add2(mVentaConstantes.PRV_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);

        var property = null;
        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NUMERO:
              register.getFields().add2(mVentaConstantes.PRV_NUMERO, property.getValue(), Cairo.Constants.Types.long);
              break;

            case K_NRODOC:
              register.getFields().add2(mVentaConstantes.PRV_NRODOC, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_DESCRIP:
              register.getFields().add2(mVentaConstantes.PRV_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_FECHA:
              register.getFields().add2(mVentaConstantes.PRV_FECHA, property.getValue(), Cairo.Constants.Types.date);
              break;

            case K_FECHAENTREGA:
              register.getFields().add2(mVentaConstantes.PRV_FECHAENTREGA, property.getValue(), Cairo.Constants.Types.date);
              break;

            case K_CLI_ID:
              register.getFields().add2(mVentaConstantes.CLI_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_CCOS_ID:
              register.getFields().add2(mVentaConstantes.CCOS_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_SUC_ID:
              register.getFields().add2(mVentaConstantes.SUC_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_DESCUENTO1:
              register.getFields().add2(mVentaConstantes.PRV_DESCUENTO1, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_DESCUENTO2:
              register.getFields().add2(mVentaConstantes.PRV_DESCUENTO2, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_DOC_ID:
              register.getFields().add2(mVentaConstantes.DOC_ID, docId, Cairo.Constants.Types.id);
              break;

            case K_LP_ID:
              register.getFields().add2(mVentaConstantes.LP_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_LD_ID:
              register.getFields().add2(mVentaConstantes.LD_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_CPG_ID:
              register.getFields().add2(mVentaConstantes.CPG_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_VEN_ID:
              register.getFields().add2(mVentaConstantes.VEN_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_LGJ_ID:
              register.getFields().add2(mVentaConstantes.LGJ_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_PRO_ID_ORIGEN:
              register.getFields().add2(mVentaConstantes.PRO_ID_ORIGEN, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_PRO_ID_DESTINO:
              register.getFields().add2(mVentaConstantes.PRO_ID_DESTINO, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_TRANS_ID:
              register.getFields().add2(mVentaConstantes.TRANS_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_CLIS_ID:
              register.getFields().add2(mVentaConstantes.CLIS_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;
          }
        }

        var _count = m_footer.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          property = m_footer.getProperties().item(_i);
          switch (property.getKey()) {
            case K_TOTAL:
              register.getFields().add2(mVentaConstantes.PRV_TOTAL, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_NETO:
              register.getFields().add2(mVentaConstantes.PRV_NETO, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_IVARI:
              register.getFields().add2(mVentaConstantes.PRV_IVARI, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_IVARNI:
              register.getFields().add2(mVentaConstantes.PRV_IVARNI, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_SUBTOTAL:
              register.getFields().add2(mVentaConstantes.PRV_SUB_TOTAL, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_IMPORTEDESC1:
              register.getFields().add2(mVentaConstantes.PRV_IMPORTE_DESC1, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_IMPORTEDESC2:
              register.getFields().add2(mVentaConstantes.PRV_IMPORTE_DESC2, property.getValue(), Cairo.Constants.Types.currency);
              break;
          }
        }

        register.getFields().add2(Cairo.Constants.EST_ID, CSGeneralEx2.csEEstado.cSEEST_PENDIENTE, Cairo.Constants.Types.id);

        register.getFields().setHaveLastUpdate(true);
        register.getFields().setHaveWhoModify(true);

        if(!register.beginTrans(Cairo.Database)) { return _rtn; }

        if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return _rtn; }

        if(!pSaveItemsPresupuesto(register.getID())) { return _rtn; }
        if(!register.commitTrans()) { return _rtn; }

        var sqlstmt = null;
        var rs = null;
        sqlstmt = "sp_DocPresupuestoVentaSave "+ register.getID().toString();

        if(!Cairo.Database.openRs(sqlstmt, rs, , , , "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return _rtn; }

        if(rs.isEOF()) { return _rtn; }

        var id = null;
        if(!GetDocIDFromRecordset(rs, id)) { return _rtn; }

        self.editNew();

        var abmObj = null;
        abmObj = m_dialog;
        abmObj.SetFocusInGridItems;

        pShowSaveAsPresupuesto(id);

        _rtn = false;

        return _rtn;
      };

      var pSaveItemsPresupuesto = function(id) {
        var transaction = new Cairo.Database.Transaction();
        var iOrden = null;

        var row = null;
        var cell = null;

        var _count = m_items.getProperties().item(C_ITEMS).getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = m_items.getProperties().item(C_ITEMS).getGrid().getRows().item(_i);

          var register = new Cairo.Database.Register();
          register.setFieldId(mVentaConstantes.PRVI_TMPID);
          register.setTable(mVentaConstantes.PRESUPUESTOVENTAITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KI_FVI_ID:
                register.getFields().add2(mVentaConstantes.PRVI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.integer);
                break;

              case KI_CANTIDAD:
                register.getFields().add2(mVentaConstantes.PRVI_CANTIDAD, cell.getValue(), Cairo.Constants.Types.double);
                break;

              case KI_DESCRIP:
                register.getFields().add2(mVentaConstantes.PRVI_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);
                break;

              case KI_PRECIO:
                register.getFields().add2(mVentaConstantes.PRVI_PRECIO, cell.getValue(), Cairo.Constants.Types.currency);
                break;

              case KI_PRECIO_LP:
                register.getFields().add2(mVentaConstantes.PRVI_PRECIO_LISTA, cell.getValue(), Cairo.Constants.Types.currency);
                break;

              case KI_PRECIO_USR:
                register.getFields().add2(mVentaConstantes.PRVI_PRECIO_USR, cell.getValue(), Cairo.Constants.Types.currency);
                break;

              case KI_DESCUENTO:
                register.getFields().add2(mVentaConstantes.PRVI_DESCUENTO, cell.getValue(), Cairo.Constants.Types.text);
                break;

              case KI_IMPORTE:
                register.getFields().add2(mVentaConstantes.PRVI_IMPORTE, cell.getValue(), Cairo.Constants.Types.currency);
                break;

              case KI_NETO:
                register.getFields().add2(mVentaConstantes.PRVI_NETO, cell.getValue(), Cairo.Constants.Types.currency);
                break;

              case KI_IVARI:
                if(m_bIva) {
                  register.getFields().add2(mVentaConstantes.PRVI_IVARI, cell.getValue(), Cairo.Constants.Types.currency);
                }
                break;

              case KI_IVARNI:
                if(m_bIvaRni) {
                  register.getFields().add2(mVentaConstantes.PRVI_IVARNI, cell.getValue(), Cairo.Constants.Types.currency);
                }
                break;

              case KI_IVARIPERCENT:
                if(m_bIva) {
                  register.getFields().add2(mVentaConstantes.PRVI_IVARI_PORC, cell.getValue(), Cairo.Constants.Types.double);
                }
                break;

              case KI_IVARNIPERCENT:
                if(m_bIvaRni) {
                  register.getFields().add2(mVentaConstantes.PRVI_IVARNI_PORC, cell.getValue(), Cairo.Constants.Types.double);
                }
                break;

              case KI_PR_ID:
                register.getFields().add2(mVentaConstantes.PR_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case mPercepciones.kI_CCOS_ID:
                register.getFields().add2(mVentaConstantes.CCOS_ID, cell.getId(), Cairo.Constants.Types.id);
                break;
            }
          }

          iOrden = iOrden + 1;
          register.getFields().add2(mVentaConstantes.PRVI_ORDEN, iOrden, Cairo.Constants.Types.integer);
          register.getFields().add2(mVentaConstantes.PRV_TMPID, id, Cairo.Constants.Types.id);

          register.getFields().setHaveLastUpdate(false);
          register.getFields().setHaveWhoModify(false);

          transaction.addRegister(register);
        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      var pShowSaveAsPresupuesto = function(prvId) {
        ShowDocAux(prvId, "CSVenta2.cPresupuestoVenta", "CSABMInterface2.cABMGeneric");
      };

      var pGetFileNamePostFix = function() {
        return m_cliente.Substring(0, 50)+ "-"+ m_nrodoc;
      };

      var setGridCajaForUsuario = function(property) {
        var msg = null;

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }
        if(response.success !== true) { return false; }

        if(response.data.id === Cairo.Constants.NO_ID) {

          m_cajaMsg = Cairo.Database.valField(m_data.cajaForUsuario[_i], "info");
          m_bCajaError = false;

          msg = Cairo.Database.valField(m_data.cajaForUsuario[_i], "warning");
          if(LenB(msg)) {
            m_cajaMsg = msg;
            m_bCajaError = true;

            if(!bSilent) {
              MsgWarning(msg);
            }
          }

          m_cjId = Cairo.Database.valField(m_data.cajaForUsuario[_i], mVentaConstantes.CJ_ID);

          return true;

        };

        var pShowNewCliente = function(iProp) { // TODO: Use of ByRef founded Private Function pShowNewCliente(ByRef iProp As cIABMProperty) As Boolean
          var _rtn = null;
          try {

            var objEdit = null;
            var iEdit = null;
            var editor = null;

            objEdit = CSKernelClient2.CreateObject("CSGeneralEx2.cClientePV");
            iEdit = objEdit;
            iEdit.setObjABM(CSKernelClient2.CreateObject("CSABMInterface2.cABMGeneric"));

            if(iEdit.edit(Cairo.Constants.NO_ID, true)) {

              iProp.setValue(objEdit.nombre);
              iProp.setSelectId(objEdit.id);

              m_dialog.showValue(iProp);

              self.propertyChange(K_CLI_ID);

            }

            _rtn = true;

            // **TODO:** goto found: GoTo ExitProc;
          }
          catch (ex) {
            Cairo.manageErrorEx(ex.message, "pShowNewCliente", C_MODULE, "");
            // **TODO:** label found: ExitProc:;
          }
          // **TODO:** on error resume next found !!!

          return _rtn;
        };

        var pSetCajaMsgPosition = function() {

          var property = m_dialog.getProperties().item(C_CAJAMSGBOX);
          if(m_userCfg.getShowDataAddInVentas()) {
            if(m_bCajaError) {
              property.setTop(3970);
            }
            else {
              property.setTop(4000);
            }
          }
          else {
            if(m_bCajaError) {
              property.setTop(3390);
            }
            else {
              property.setTop(3460);
            }
          }

          if(m_bCajaError) {
            if(m_userCfg.getShowDataAddInVentas()) {
              property.setHeight(390);
            }
            else {
              property.setHeight(440);
            }
          }
          else {
            property.setHeight(330);
          }

          var property = m_dialog.getProperties().item(C_CAJAMSG);

          if(m_userCfg.getShowDataAddInVentas()) {

            if(m_bCajaError) {
              property.setTop(3990);
            }
            else {
              property.setTop(4020);
            }

          }
          else {

            if(m_bCajaError) {
              property.setTop(3390);
            }
            else {
              property.setTop(3480);
            }
          }

          if(m_bCajaError) {
            if(m_userCfg.getShowDataAddInVentas()) {
              property.setHeight(380);
            }
            else {
              property.setHeight(430);
            }
          }
          else {
            property.setHeight(300);
          }

        };

        var pValidateCajaState = function() {
          var iProp = null;
          var abmObj = null;
          abmObj = m_dialog;

          if(m_ventasCfg.getExigirCaja() && (m_cjId !== Cairo.Constants.NO_ID || m_bCajaError)) {

            pLoadCajaForUsuario(true);

            iProp = m_dialog.getProperties().item(C_CAJAMSG);
            iProp.setValue(m_cajaMsg);

            if(m_bCajaError) {

              iProp.setForeColor(vbRed);

              MsgWarning(Cairo.Language.getText(4825, ""));
              // Antes de poder generar facturas debe abrir la caja.
            }
            else {

              iProp.setForeColor(vbWindowText);

            }

            pSetCajaMsgPosition();
            abmObj.ShowValue(iProp);
            abmObj.RefreshFont(iProp);
            abmObj.RefreshPosition(iProp);
            iProp = m_dialog.getProperties().item(C_CAJAMSGBOX);
            abmObj.RefreshPosition(iProp);

          }

          return m_bCajaError == false;

        };

        var pGetPendiente = function(fv_id) {
          var pendiente = null;
          if(!Cairo.Database.getData(mVentaConstantes.FACTURAVENTA, mVentaConstantes.FV_ID, fv_id, mVentaConstantes.FV_PENDIENTE, pendiente)) { return 0; }
          return pendiente;
        };

        var pShowMenuDocAction = function() {
          var abmObj = null;
          abmObj = m_dialog;

          var menu = null;

          menu = Cairo.Language.getText(4895, "")+ "~3|"+ Cairo.Language.getText(4894, "")+ "~4|"+ Cairo.Language.getText(5125, "")+ "~5";
          // Cobrar el Documento|Generar una Nota de Credito|Obtener CAE

          abmObj.ShowPopMenu(menu);
        };

        var pActionCobrar = function() {

          //If IsCobranzaContado(m_Id) Then

          //  Dim DocId As Long
          //  Dim bMonedaLegal As Boolean
          //  Dim Cotizacion As Double

          //  DocId = m_ObjAbm.Properties(cscDocId).HelpId
          //  bMonedaLegal = GetMonedaDefault = GetMonIdFromDoc(DocId)
          //  If bMonedaLegal Then
          //    Cotizacion = 1
          //  Else
          //    If Cotizacion = 0 Then Cotizacion = 1
          //  End If

          //  ShowCobranzaContado m_cliId, m_Id, m_Fecha, _
          pGetPendiente(m_id) * cEditDocEx.setCotizacion(), m_sucId, m_ccosId, m_lgjId, m_cjId;

          //  Refresh

          //Else

          pShowCobranza();

          //End If

        };

        var pShowNotaCredito = function() {
          var hl = null;
          var hr = null;

          hl = new cHelp();

          hr = hl.show(null, CSDocumento, Cairo.Constants.NO_ID, "", Cairo.Constants.NO_ID, csHelpType.cSNORMAL, "doct_id = 7 and mon_id = "+ m_monId);

          if(hr.getCancel()) { return; }

          var iProp = null;
          iProp = m_dialog.getProperties().item(mVentaConstantes.DOC_ID);

          iProp.setSelectId(hr.getId());
          iProp.setValue(hr.getValue());

          m_dialog.showValue(iProp);

          // Me guardo la factura que genero esta NC
          //
          m_fv_id_nc_based = m_id;

          self.copy();

        };

        var pGetCAE = function() {
          mPublicVentas.self.facturaVentaGetCAE(m_id);
          load(m_id);
          pRefreshProperties();
        };

        var pDocIsNotActive = function(doc_id) {
          var activo = null;
          if(!Cairo.Database.getData(mVentaConstantes.DOCUMENTO, mVentaConstantes.DOC_ID, doc_id, Cairo.Constants.ACTIVE, activo)) { return false; }
          return activo == false;
        };

        var pGetDocId = function() {
          return m_dialog.getProperties().item(mVentaConstantes.DOC_ID);
        };

        var pSetColorBackground = function() {
          var doct_id = null;
          var doc_id = null;
          var abmGen = null;

          abmGen = m_dialog;

          doc_id = pGetDocId().getSelectId();
          if(!Cairo.Database.getData(mVentaConstantes.DOCUMENTO, mVentaConstantes.DOC_ID, doc_id, mVentaConstantes.DOCT_ID, doct_id)) { return; }

          //c1c1f6
          if(m_userCfg.getUsarColoresEnDocumentos()) {
            if(doct_id == csEDocumentoTipo.cSEDT_NOTACREDITOVENTA) {
              abmGen.SetBakcColorTagMain(RGB(&HF0, &H7F, &H7F));
            }
            else {
              abmGen.SetBakcColorTagMain(RGB(&HC1, &HC1, &HF6));
            }
          }

        };


        return self;
      };

      Edit.Controller = { getEditor: createObject };

      Edit.Controller.edit = function(id) {

        Cairo.LoadingMessage.show("Factura de Compras", "Loading ZZZZ_ZZZZ from Crowsoft Cairo server.");
        var editor = Cairo.Xxxx.Edit.Controller.getEditor();

        this needs some atention. not every object has wizards.

          //
          // wizards
          //
          if(id === 'sobreremito') {
          return editor.showWizardX-X-X-X-X-X-X();
        }
        else if(id === 'sobreorden') {
          return editor.showWizardX-X-X-X-X-X-X();
        }
        else {

          var dialog = Cairo.Dialogs.Views.Controller.newDialog();
          var dialogItems = Cairo.Dialogs.Views.Controller.newDialog();
          var dialogFooter = Cairo.Dialogs.Views.Controller.newDialog();

          editor.setDialog(dialog);
          editor.setItems(dialogItems);
          editor.setFooter(dialogFooter);
          editor.edit(id).then(Cairo.LoadingMessage.close);
        }
      };

  });

  Cairo.module("FacturaVentaListDoc.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;
      var P = Cairo.Promises;
      var NO_ID = Cairo.Constants.NO_ID;
      var DB = Cairo.Database;
      var D = Cairo.Documents;
      var M = Cairo.Modal;
      var C = Cairo.General.Constants;
      var CV = Cairo.Ventas.Constants;
      var Types = Cairo.Constants.Types;
      var Dialogs = Cairo.Dialogs;
      var T = Dialogs.PropertyType;
      var val = Cairo.Util.val;
      var isDate = Cairo.Util.isDate;
      var getDateValue = Cairo.Util.getDateValue;
      var today = Cairo.Dates.today;
      var valField = DB.valField;
      var CS = Cairo.Security.Actions.Ventas;
      var call = P.call;

      var C_MODULE = "cFacturaVtaListDoc";

      var C_FECHAINI = "FechaIni";
      var C_FECHAFIN = "FechaFin";

      var K_FECHAINI = 1;
      var K_FECHAFIN = 2;
      var K_CLI_ID = 4;
      var K_EST_ID = 5;
      var K_CCOS_ID = 6;
      var K_SUC_ID = 7;
      var K_VEN_ID = 8;
      var K_DOC_ID = 9;
      var K_CPG_ID = 10;
      var K_EMP_ID = 100;

      var m_fechaIni = null;
      var m_fechaFin = null;
      var m_cliId = "";
      var m_cliente = "";
      var m_estId = "";
      var m_estado = "";
      var m_ccosId = "";
      var m_centroCosto = "";
      var m_sucId = "";
      var m_sucursal = "";
      var m_venId = "";
      var m_vendedor = "";
      var m_docId = "";
      var m_documento = "";
      var m_cpgId = "";
      var m_condicionPago = "";
      var m_empId = "";
      var m_empresa = "";
      var m_fechaIniV = "";
      var m_fechaFinV = "";

      var m_dialog;
      var m_properties;

      var m_listController;

      var m_title = "";

      var m_menuLoaded;

      var m_menuShowCobranza = 0;
      var m_menuShowMensajes = 0;
      var m_menuShowInfoCli = 0;
      var m_menuAddNote = 0;
      var m_menuShowAplic = 0;
      var m_menuShowAsiento = 0;
      var m_menuShowDocAux = 0;
      var m_menuFirmar = 0;
      var m_menuEditCliente = 0;

      var m_menuGetCae = 0;
      var m_menuUpdateTalonarios = 0;
      var m_sendCAEByEmail = 0;

      var m_objApply;

      var m_apiPath = DB.getAPIVersion();
      var SAVE_ERROR = getText(2226, ""); // Error al grabar los párametros de navegación de Factura de Ventas

      self.list = function() {
        initialize();
        return load()
          .success(loadCollection);
      };

      self.edit = function(fvId) {
        m_listController.edit(fvId);
      };

      self.deleteItem = function(fvId) {
        return m_listController.destroy(fvId);
      };

      self.showDocDigital = function() {
        var _rtn = null;

        try {

          var fvId = m_dialog.getId();
          if(fvId === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(CV.FACTURA_VENTA);
          doc.setClientTableID(fvId);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showDocDigital", C_MODULE, "");
        }

        return _rtn;
      };

      self.getEnabledSearchParam = function() {
        return true;
      };

      self.getSearchParamTable = function() {
        return Cairo.Tables.CLIENTE;
      };

      self.getBackgroundColor = function() {
        return "#fff";
      };

      self.setSearchParam = function(id,  name) {

        var property = m_dialog.getProperties().item(C.CLI_ID);
        property.setValue(name);
        property.setSelectId(id);
        property.setSelectIntValue(id);
        m_dialog.showValue(m_dialog.getProperties().item(C.CLI_ID));
      };

      self.processMenu = function(index) {
        try {

          switch (index) {
            case m_menuShowCobranza:
              showCobranza();
              break;

            case m_menuShowInfoCli:
              D.showInfo(Cairo.Tables.CLIENTE, getCliId());
              break;

            case m_menuShowMensajes:
              showNotes();
              break;

            case m_menuAddNote:
              addNote();
              break;

            case m_menuShowAplic:
              showApplycation();
              break;

            case m_menuShowAsiento:
              showAsiento();
              break;

            case m_menuShowDocAux:
              showDocAux();
              break;

            case m_menuFirmar:
              signDocument();
              break;

            case m_menuEditCliente:
              editCliente();
              break;

            case m_menuGetCae:
              getCAE();
              break;

            case m_menuUpdateTalonarios:
              D.updateTalonariosAFIP();
              break;

            case m_sendCAEByEmail:
              sendCAEByEmail();
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "ProcessMenu", C_MODULE, "");
        }
      };

      var loadCollection = function() {
        var c;

        m_properties.clear();

        c = m_properties.add(null, C_FECHAINI);
        c.setType(T.date);
        c.setName(getText(1203, "")); // Fecha desde
        c.setKey(K_FECHAINI);
        c.setValue((m_fechaIniV !== "") ? m_fechaIniV : m_fechaIni);

        c = m_properties.add(null, C_FECHAFIN);
        c.setType(T.date);
        c.setName(getText(1204, "")); // Fecha hasta
        c.setKey(K_FECHAFIN);
        c.setValue((m_fechaFinV !== "") ? m_fechaFinV : m_fechaFin);

        c = m_properties.add(null, C.CLI_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.CLIENTE);
        c.setName(getText(1150, "")); // Proveedor
        c.setKey(K_CLI_ID);
        c.setValue(m_cliente);
        c.setSelectId(val(m_cliId));
        c.setSelectIntValue(m_cliId);

        c = m_properties.add(null, C.EST_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.ESTADOS);
        c.setName(getText(1568, "")); // Estado
        c.setKey(K_EST_ID);
        c.setValue(m_estado);
        c.setSelectId(val(m_estId));
        c.setSelectIntValue(m_estId);

        c = m_properties.add(null, C.CCOS_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.CENTROS_DE_COSTO);
        c.setName(getText(1057, "")); // Centro de Costos
        c.setKey(K_CCOS_ID);
        c.setValue(m_centroCosto);
        c.setSelectId(val(m_ccosId));
        c.setSelectIntValue(m_ccosId);

        c = m_properties.add(null, C.SUC_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.SUCURSAL);
        c.setName(getText(1281, "")); // Sucursal
        c.setKey(K_SUC_ID);
        c.setValue(m_sucursal);
        c.setSelectId(val(m_sucId));
        c.setSelectIntValue(m_sucId);

        c = m_properties.add(null, C.VEN_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.VENDEDOR);
        c.setName(getText(1510, "")); // Vendedor
        c.setKey(K_VEN_ID);
        c.setValue(m_vendedor);
        c.setSelectId(val(m_venId));
        c.setSelectIntValue(m_venId);

        c = m_properties.add(null, C.DOC_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.DOCUMENTO);
        c.setName(getText(1567, "")); // Documentos
        c.setKey(K_DOC_ID);
        c.setValue(m_documento);
        c.setSelectId(val(m_docId));
        c.setSelectIntValue(m_docId);
        c.setSelectFilter(D.FACTURA_VENTAS_LIST_DOC_FILTER);

        c = m_properties.add(null, C.CPG_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.CONDICION_PAGO);
        c.setName(getText(1395, "")); // Condicion de pago
        c.setKey(K_CPG_ID);
        c.setValue(m_condicionPago);
        c.setSelectId(val(m_cpgId));
        c.setSelectIntValue(m_cpgId);

        c = m_properties.add(null, C.EMP_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.EMPRESA);
        c.setName(getText(1114, "")); // Empresa
        c.setKey(K_EMP_ID);
        c.setValue(m_empresa);
        c.setSelectId(val(m_empId));
        c.setSelectIntValue(m_empId);

        createMenu();
        if(!m_dialog.showDocumentList(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {
        return m_dialog.showValues(m_properties);
      };

      var load = function() {

        return DB.getData("load[" + m_apiPath + "ventas/facturaventas/parameters]").then(
          function(response) {


            m_empId = Cairo.Company.getId();
            m_empresa = Cairo.Company.getName();

            if(response.success !== true) { return false; }

            if(response.data.id === NO_ID) {

              m_fechaIniV = "";
              m_fechaIni = Cairo.Dates.today();
              m_fechaFinV = "";
              m_fechaFin = Cairo.Dates.DateNames.getDateByName('h-60');

              m_cliId = NO_ID;
              m_cliente = "";
              m_estId = NO_ID;
              m_estado = "";
              m_ccosId = NO_ID;
              m_centroCosto = "";
              m_sucId = NO_ID;
              m_sucursal = "";
              m_venId = NO_ID;
              m_vendedor = "";
              m_docId = NO_ID;
              m_documento = "";
              m_cpgId = NO_ID;
              m_condicionPago = "";

            }
            else {

              m_fechaIniV = valField(response.data, C.FROM);
              m_fechaIni = valField(response.data, C.FROM);
              m_fechaIni = isDate(m_fechaIni) ? getDateValue(m_fechaIni) : today();

              m_fechaFinV = valField(response.data, C.TO);
              m_fechaFin = valField(response.data, C.TO);
              m_fechaFin = isDate(m_fechaFin) ? getDateValue(m_fechaFin) : today();

              m_cliId = valField(response.data, C.CLI_ID);
              m_estId = valField(response.data, C.EST_ID);
              m_ccosId = valField(response.data, C.CCOS_ID);
              m_sucId = valField(response.data, C.SUC_ID);
              m_venId = valField(response.data, C.VEN_ID);
              m_docId = valField(response.data, C.DOC_ID);
              m_cpgId = valField(response.data, C.CPG_ID);
              m_empId = valField(response.data, C.EMP_ID);

              m_cliente = valField(response.data, C.CLI_NAME);
              m_estado = valField(response.data, C.EST_NAME);
              m_centroCosto = valField(response.data, C.CCOS_NAME);
              m_sucursal = valField(response.data, C.SUC_NAME);
              m_vendedor = valField(response.data, C.VEN_NAME);
              m_documento = valField(response.data, C.DOC_NAME);
              m_condicionPago = valField(response.data, C.CPG_NAME);
              m_empresa = valField(response.data, C.EMP_NAME);

            }
            return true;
          }
        );
      };

      self.getProperties = function() {
        return m_properties;
      };

      self.propertyChange = function(key) {

        var property;
        var properties = m_properties;

        switch (key) {

          case K_FECHAINI:

            property = properties.item(C_FECHAINI);

            if(property.getSelectIntValue() !== "") {
              m_fechaIniV = property.getSelectIntValue();
              m_fechaIni = Cairo.Dates.DateNames.getDateByName(m_fechaIniV);
            }
            else if(isDate(property.getValue())) {
              m_fechaIniV = "";
              m_fechaIni = property.getValue();
            }
            else {
              m_fechaIniV = "";
              property.setValue(m_fechaIni);
            }
            break;

          case K_FECHAFIN:

            property = properties.item(C_FECHAFIN);

            if(property.getSelectIntValue() !== "") {
              m_fechaFinV = property.getSelectIntValue();
              m_fechaFin = Cairo.Dates.DateNames.getDateByName(m_fechaFinV);
            }
            else if(isDate(property.getValue())) {
              m_fechaFinV = "";
              m_fechaFin = property.getValue();
            }
            else {
              m_fechaFinV = "";
              property.setValue(m_fechaFin);
            }
            break;

          case K_EST_ID:
            var property = properties.item(C.EST_ID);
            m_estado = property.getValue();
            m_estId = property.getSelectIntValue();
            break;

          case K_CLI_ID:
            var property = properties.item(C.CLI_ID);
            m_cliente = property.getValue();
            m_cliId = property.getSelectIntValue();
            break;

          case K_CCOS_ID:
            var property = properties.item(C.CCOS_ID);
            m_centroCosto = property.getValue();
            m_ccosId = property.getSelectIntValue();
            break;

          case K_SUC_ID:
            var property = properties.item(C.SUC_ID);
            m_sucursal = property.getValue();
            m_sucId = property.getSelectIntValue();
            break;

          case K_VEN_ID:
            var property = properties.item(C.VEN_ID);
            m_vendedor = property.getValue();
            m_venId = property.getSelectIntValue();
            break;

          case K_DOC_ID:
            var property = properties.item(C.DOC_ID);
            m_documento = property.getValue();
            m_docId = property.getSelectIntValue();
            break;

          case K_CPG_ID:
            var property = properties.item(C.CPG_ID);
            m_condicionPago = property.getValue();
            m_cpgId = property.getSelectIntValue();
            break;

          case K_EMP_ID:
            var property = properties.item(C.EMP_ID);
            m_empresa = property.getValue();
            m_empId = property.getSelectIntValue();
            break;
        }

        return true;
      };

      self.refresh = function() {

        var startDate;
        if(Cairo.Dates.DateNames.getDateNames().contains(m_fechaIniV)) {
          startDate = Cairo.Dates.DateNames.getDateByName(m_fechaIniV);
        }
        else {
          startDate = m_fechaIni
        }

        var endDate;
        if(Cairo.Dates.DateNames.getDateNames().contains(m_fechaFinV)) {
          endDate = Cairo.Dates.DateNames.getDateByName(m_fechaFinV);
        }
        else {
          endDate = m_fechaFin
        }

        endDate = Cairo.Dates.DateNames.addToDate("d", 1, endDate);

        startDate = DB.sqlDate(startDate);
        endDate = DB.sqlDate(endDate);

        var params = {
          from: startDate,
          to: endDate,
          cliId: m_cliId,
          estId: m_estId,
          ccosId: m_ccosId,
          sucId: m_sucId,
          venId: m_venId,
          docId: m_docId,
          cpgId: m_cpgId,
          empId: m_empId
        };

        return DB.getData("load[" + m_apiPath + "ventas/facturaventas]", null, params);
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.LDP_ID);
        register.setTable(C.LISTA_DOCUMENTO_PARAMETRO);

        var apiPath = DB.getAPIVersion();
        register.setPath(apiPath + "ventas/facturaventas");

        register.setId(Cairo.Constants.NEW_ID);

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {

          var property = m_dialog.getProperties().item(_i);

          switch (property.getKey()) {

            case K_FECHAINI:
              var value = property.getSelectIntValue();
              if(value === "") { value = property.getValue(); }
              fields.add(C.FROM, value, Types.text);
              break;

            case K_FECHAFIN:
              var value = property.getSelectIntValue();
              if(value === "") { value = property.getValue(); }
              fields.add(C.TO, value, Types.text);
              break;

            case K_CLI_ID:
              fields.add(C.CLI_ID, property.getSelectIntValue(), Types.text);
              break;

            case K_EST_ID:
              fields.add(C.EST_ID, property.getSelectIntValue(), Types.text);
              break;

            case K_CCOS_ID:
              fields.add(C.CCOS_ID, property.getSelectIntValue(), Types.text);
              break;

            case K_SUC_ID:
              fields.add(C.SUC_ID, property.getSelectIntValue(), Types.text);
              break;

            case K_VEN_ID:
              fields.add(C.VEN_ID, property.getSelectIntValue(), Types.text);
              break;

            case K_DOC_ID:
              fields.add(C.DOC_ID, property.getSelectIntValue(), Types.text);
              break;

            case K_CPG_ID:
              fields.add(C.CPG_ID, property.getSelectIntValue(), Types.text);
              break;

            case K_EMP_ID:
              fields.add(C.EMP_ID, property.getSelectIntValue(), Types.text);
              break;

          }
        }

        return DB.saveEx(
            register,
            false,
            "",
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            SAVE_ERROR).then(

          function(result) {
            if(result.success) {
              return load(result.data.getId()).then(
                function (success) {
                  if(success) {
                    refreshCollection();
                  };
                  return success;
                }
              );
            }
            else {
              return false;
            }
          }
        );
      };

      self.getPath = function() {
        return "#venta/facturasdeventa";
      };

      self.getEditorName = function() {
        return "facturaventas";
      };

      self.getTitle = function() {
        return m_title;
      };

      self.validate = function() {
        return P.resolvedPromise(true);
      };

      self.setDialog = function(dialog) {
        m_dialog = dialog;
        m_properties = dialog.getProperties();
      };

      self.setListController = function(controller) {
        m_listController = controller;
      };
      
      var createMenu = function() {

        if(m_menuLoaded) { return; }

        m_menuLoaded = true;

        m_dialog.clearMenu();

        m_menuEditCliente = m_dialog.addMenu(getText(5038, "")); // Editar Cliente
        m_dialog.addMenu("-");

        m_menuShowCobranza = m_dialog.addMenu(getText(1690, "")); // Cobrar
        m_dialog.addMenu("-");

        m_menuFirmar = m_dialog.addMenu(getText(1594, "")); // Firmar
        m_dialog.addMenu("-");

        m_menuShowInfoCli = m_dialog.addMenu(getText(1614, "")); // Ver Info del Cliente

        m_menuAddNote = m_dialog.addMenu(getText(1615, "")); // Agregar Nota

        m_menuShowMensajes = m_dialog.addMenu(getText(1616, "")); // Ver Notas
        m_dialog.addMenu("-");

        m_menuShowAplic = m_dialog.addMenu(getText(1617, "")); // Ver Aplicaciones

        m_menuShowAsiento = m_dialog.addMenu(getText(1692, "")); // Ver Asiento Contable

        m_menuShowDocAux = m_dialog.addMenu(getText(1691, "")); // Ver Documento Asociado
        m_dialog.addMenu("-");

        m_menuGetCae = m_dialog.addMenu(getText(5125, "")); // Obtener CAE

        m_menuUpdateTalonarios = m_dialog.addMenu(getText(5130, "")); // Actualizar Talonarios AFIP

        m_sendCAEByEmail = m_dialog.addMenu(getText(5131, "")); // Enviar Factura Electronica por e-mail
      };

      var showNotes = function() {
        var fcId = m_dialog.getId();
        return DB.getData("load[" + m_apiPath + "ventas/facturaventa/notes]", fcId)
          .successWithResult(D.showNotes);
      };

      var addNote = function() {
        var fvId = m_dialog.getId();
        return D.addNote(D.Types.FACTURA_VENTA, fvId, false);
      };

      var editCliente = function() {
        var cliId = getCliId();
        if(cliId === NO_ID) { return; }
        Cairo.Cliente.Edit.Controller.edit(cliId);
      };

      var signDocument = function() {

        var fvId = m_dialog.getId();

        if(fvId === NO_ID) {
          return P.resolvedPromise();
        }

        var refreshRow = function(response) {
          m_dialog.refreshRow(response.data);
        };

        var getAction = function(response) {
          var p = null;

          if(response.signed) {
            p = M.confirmViewYesDefault(
              getText(1593, ""), // El documento ya ha sido firmado desea borrar la firma
              getText(1594, "")  // Firmar
            );
          }
          return p || P.resolvedPromise(true);
        };

        var p = D.getDocumentSignStatus(D.Types.FACTURA_VENTA, fvId)
            .successWithResult(getAction)
            .success(D.signDocument(D.Types.FACTURA_VENTA, fvId))
            .successWithResult(refreshRow)
          ;

        return p;
      };

      var getCAE = function() {

        var p = P.resolvedPromise(true);
        var ids = m_dialog.getIds();

        for (var i = 0, count = ids.length; i < count; i++) {

          var fvId = ids[i];
          if(fvId !== NO_ID) {
            p = p.then(call(D.getCAE, fvId));
          }
        }

        return p;
      };

      var sendCAEByEmail = function() {

        var p = P.resolvedPromise(true);
        var ids = m_dialog.getIds();

        for (var i = 0, count = ids.length; i < count; i++) {

          var fvId = ids[i];
          if(fvId !== NO_ID) {
            p = p.then(call(D.sendCAEByEmail, fvId));
          }
        }

        return p.then(call(M.showInfo, getText(5133, ""))); // La solicitud de envio de e-mail se genero con éxito
      };

      var showAsiento = function() {
        var fvId = m_dialog.getId();
        if(fvId !== NO_ID) {

          D.getAsientoId(D.Types.FACTURA_VENTA, fvId).successWithResult(function(response) {
            D.showDocAux(response.as_id, "Asiento");
          });
        }
      };

      var showDocAux = function() {
        var fvId = m_dialog.getId();
        if(fvId !== NO_ID) {

          D.getStockId(D.Types.FACTURA_VENTA, fvId).successWithResult(function(response) {
            D.showDocAux(response.st_id, "Stock");
          });
        }
      };

      var showApplycation = function() {

        var showEditor = function(info) {
          if(!Cairo.Security.docHasPermissionTo(
            CS.MODIFY_APLIC,
            m_docId,
            Cairo.Security.ActionTypes.apply)) {
            return false;
          }

          var applyEditor = Cairo.FacturaVentaAplic.createObject();

          applyEditor.setClient(self);

          applyEditor.show(
            info.id,
            info.total * ((info.cotizacion !== 0) ? info.cotizacion : 1),
            info.nrodoc,
            info.cli_id,
            info.cliente,
            info.suc_id,
            info.doc_id,
            info.doct_id === D.Types.NOTA_CREDITO_VENTA);
        };

        var fvId = m_dialog.getId();
        if(fvId !== NO_ID) {
          D.getDocumentInfo(D.Types.FACTURA_VENTA, fvId).successWithResult(showEditor);
        }
      };

      var showCobranza = function() {
        try {
          var cobranza = Cairo.Cobranza.createObject();
          cobranza.showCobranza(NO_ID, getFvIds());
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showCobranza", C_MODULE, "");
        }
      };

      // TODO: complete
      //
      var getCliId = function() {

      };

      var getFvIds = function() {
        return m_dialog.getIds();
      };

      var initialize = function() {
        try {
          m_title = getText(1624, ""); // Facturas de Venta
          m_dialog.setHaveDetail(true);
          m_dialog.setStartRowText(4);
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "initialize", C_MODULE, "");
        }
      };

      self.destroy = function() {
        try {
          m_dialog = null;
          m_properties = null;
          m_listController = null;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "destroy", C_MODULE, "");
        }
      };

      self.validate = function() {
        return P.resolvedPromise(true);
      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("FacturaVenta.List", function(List, Cairo, Backbone, Marionette, $, _) {

    var NO_ID = Cairo.Constants.NO_ID;
    var CS = Cairo.Security.Actions.Ventas;
    var DB = Cairo.Database;
    var C_MODULE = "cFacturaVenta";
    var P = Cairo.Promises;

    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createListDialog = function(tabId) {

          var editors = Cairo.Editors.facturaVentaEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.facturaVentaEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "FacturaVenta",
            entityName: "facturaventa",
            entitiesName: "facturaventas"
          });

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

          self.edit = function(id) {
            var key = getKey(id);
            if(editors.contains(key)) {
              editors.item(key).dialog.showDialog();
            }
            else {
              Cairo.LoadingMessage.show("FacturaVenta", "Loading Factura de Ventas from Crowsoft Cairo server.");

              var editor = Cairo.FacturaVenta.Edit.Controller.getEditor();
              var dialog = Cairo.Dialogs.Views.Controller.newDialog();
              var dialogItems = Cairo.Dialogs.Views.Controller.newDialog();
              var dialogFooter = Cairo.Dialogs.Views.Controller.newDialog();

              editor.setListController(self);
              editor.setDialog(dialog);
              editor.setItems(dialogItems);
              editor.setFooter(dialogFooter);
              editor.edit(id).then(Cairo.LoadingMessage.close);

              editors.add({editor: editor, dialog: dialog}, key);
            }
          };

          self.destroy = function(id) {
            if(!Cairo.Security.hasPermissionTo(CS.DELETE_FACTURA)) {
              return P.resolvedPromise(false);
            }

            var closeDialog = function() {
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
            };

            return DB.destroy(
              DB.getAPIVersion() + "ventas/facturaventa", id,
              Cairo.Constants.DELETE_FUNCTION, C_MODULE).success(closeDialog, false);
          };

          // progress message
          //
          Cairo.LoadingMessage.show("FacturaVenta", "Loading Factura de Ventas from Crowsoft Cairo server.");

          self.documentList = Cairo.FacturaVentaListDoc.Edit.Controller.getEditor();
          var dialog = Cairo.Dialogs.Views.ListController.newDialogList();

          self.documentList.setListController(self);
          self.documentList.setDialog(dialog);
          self.documentList.list().then(Cairo.LoadingMessage.close);

        };

        createListDialog();
      }
    };
  });

}());