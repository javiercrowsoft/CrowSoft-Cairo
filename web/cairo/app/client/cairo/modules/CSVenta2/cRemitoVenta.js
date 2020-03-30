(function() {
  "use strict";

  Cairo.module("RemitoVenta.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {
    {

      var self = {};

      var getText = Cairo.Language.getText;

      var TITLE = getText(1712, ""); // Remitos de Venta
      var SAVE_ERROR_MESSAGE = getText(2222, ""); // Error al grabar el Remito de Venta

      var P = Cairo.Promises;
      var NO_ID = Cairo.Constants.NO_ID;
      var DB = Cairo.Database;
      var Dialogs = Cairo.Dialogs;
      var Grids = Cairo.Dialogs.Grids;
      var C = Cairo.General.Constants;
      var CV = Cairo.Ventas.Constants;
      var CS = Cairo.Security.Actions.Ventas;
      var Types = Cairo.Constants.Types;
      var valField = DB.valField;
      var getValue = DB.getValue;
      var valEmpty = Cairo.Util.valEmpty;
      var Percepciones = Cairo.Ventas.Percepciones;
      var call = P.call;
      var D = Cairo.Documents;
      var getProperty = D.getProperty;
      var getGrid = D.getGrid;
      var getCell = Dialogs.cell;
      var cellId = Dialogs.cellId;
      var cellFloat = Dialogs.cellFloat;
      var val = Cairo.Util.val;
      var M = Cairo.Modal;
      var T = Dialogs.PropertyType;
      var ST = Dialogs.PropertySubType;

      var C_MODULE = "cRemitoVenta";

      var C_ITEMS = "ITEMS";
      var C_HIDECOLSRV = "HideColsRv";

      var K_NUMERO = 1;
      var K_NRODOC = 2;
      var K_DESCRIP = 3;
      var K_FECHA = 4;
      var K_FECHAENTREGA = 5;
      var K_NETO = 6;
      var K_IVARI = 7;
      var K_IVARNI = 8;
      var K_TOTAL = 9;
      var K_CLI_ID = 10;
      var K_DOC_ID = 11;
      var K_DOCT_ID = 12;
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

      var K_DEPL_ID = 25;
      var K_VEN_ID = 26;
      var K_LGJ_ID = 27;
      var K_PRO_ID_ORIGEN = 29;
      var K_PRO_ID_DESTINO = 30;
      var K_TRANS_ID = 31;
      var K_CLIS_ID = 33;

      var K_COTIZACION = 28;

      var K_RETIRO = 34;
      var K_GUIA = 35;

      var K_CHOF_ID = 36;
      var K_CAM_ID = 37;
      var K_CAM_ID_SEMI = 38;
      var K_DESTINATARIO = 39;

      var K_ORDENCOMPRA = 40;

      // HIDECOLS
      var K_HIDECOLS = 41;

      var KI_RV_ID = 1;
      var KI_RVI_ID = 2;
      var KI_ORDEN = 3;
      var KI_CANTIDAD = 4;
      var KI_DESCRIP = 6;
      var KI_PRECIO = 7;
      var KI_IMPORTE = 8;
      var KI_NETO = 9;
      var KI_IVARI = 10;
      var KI_IVARNI = 11;
      var KI_PR_ID = 13;
      var KI_LPI_ID = 14;
      var KI_LDI_ID = 15;
      var KI_IVARIPERCENT = 16;
      var KI_IVARNIPERCENT = 17;
      var KI_DESCUENTO = 18;
      var KI_UNIDAD = 19;
      var KI_PRECIO_LP = 20;
      var KI_PRECIO_USR = 21;
      var KI_CCOS_ID = 22;

      var KI_PR_LLEVANROSERIE = 23;
      var KI_ES_KIT = 24;
      var KI_NROSERIE = 25;
      var KI_GRUPO = 26;

      // Lote
      //
      var KI_STL_ID = 27;
      var KI_PR_LLEVALOTE = 28;

      // Lote Fifo
      //
      var KI_PR_LOTEFIFO = 32;

      // pseudo-constantes
      var c_ErrorSave = "";

      var m_id = 0;
      var m_numero = 0;
      var m_estado = "";
      var m_est_id = 0;
      var m_nrodoc = "";
      var m_descrip = "";
      var m_fecha = null;
      var m_fechaentrega = null;
      var m_neto = 0;
      var m_ivari = 0;
      var m_ivarni = 0;
      var m_total = 0;
      var m_subTotal = 0;
      var m_descuento1 = 0;
      var m_descuento2 = 0;
      var m_importeDesc1 = 0;
      var m_importeDesc2 = 0;
      var m_cpg_id = 0;
      var m_condicionPago = "";
      var m_ccos_id = 0;
      var m_centroCosto = "";
      var m_suc_id = 0;
      var m_sucursal = "";
      var m_cli_id = 0;
      var m_cliente = "";
      var m_doc_id = 0;
      var m_documento = "";
      var m_doct_id = 0;
      var m_lp_id = 0;
      var m_listaPrecio = "";
      var m_ld_id = 0;
      var m_listaDescuento = "";
      var m_creado = null;
      var m_modificado = null;
      var m_modifico = 0;
      var m_firmado;

      var m_ven_id = 0;
      var m_vendedor = "";
      var m_lgj_id = 0;
      var m_legajo = "";

      var m_clis_id = 0;
      var m_clienteSucursal = "";

      var m_chof_id = 0;
      var m_chofer = "";

      var m_cam_id = 0;
      var m_camion = "";

      var m_cam_id_semi = 0;
      var m_semi = "";

      var m_destinatario = "";

      var m_ordenCompra = "";

      var m_pro_id_origen = 0;
      var m_proOrigen = "";
      var m_pro_id_destino = 0;
      var m_proDestino = "";

      var m_trans_id = "";
      var m_transporte = "";

      var m_editing;

      var m_bShowStockData;
      var m_depl_id = 0;
      var m_deposito = "";

      var m_cotizacion = 0;
      var m_mon_id = 0;
      var m_lastFecha = null;
      var m_lastMonIdCotizacion = 0;

      var m_retiro = "";
      var m_guia = "";

      // Lote
      //
      var m_depf_id = 0;

      // Para ver documentos auxiliares
      //
      var m_st_id = 0;
      var m_st_id_consumo = 0;
      var m_st_id_consumoTemp = 0;
      var m_st_id_producido = 0;

      var m_footer;
      var m_items;
      var m_dialog;
      var m_listController = null;

      var m_lastDoc = 0;
      //' nrs devolucion
      var m_lastDoctId = 0;
      var m_lastCli = 0;
      var m_lastTrans = 0;
      var m_lastChof = 0;
      var m_lastDocName = "";
      var m_lastCliName = "";

      var m_isNew;

      var m_branchId = 0;
      var m_treeId = 0;

      var m_itemsDeleted = "";

      var m_copy;

      var m_generalConfig;
      var m_stockConfig;

      var m_docEditable;
      var m_docEditMsg = "";

      var m_pvIds = 0;
      var m_osIds = 0;

      var m_prnsIds = 0;

      var m_bIva;
      var m_bIvaRni;

      var m_taPropuesto;
      var m_taMascara = "";

      var m_objApply;

      var m_nrosSerie;
      var m_collKitInfo;

      var m_bPushVirtualNext;
      var m_bAutoFactura;
      var m_bAutoPago;
      var m_modoVentaCtaCte;
      var m_cue_id_autoPago = 0;

      // Preferencias del Usuario
      //
      var m_userCfg;

      self.setPushVirtualNext = function(rhs) {
        m_bPushVirtualNext = rhs;
      };

      self.setAutoPago = function(rhs) {
        m_bAutoPago = rhs;
      };

      self.setCue_id_autoPago = function(rhs) {
        m_cue_id_autoPago = rhs;
      };

      self.setModoVentaCtaCte = function(rhs) {
        m_modoVentaCtaCte = rhs;
      };

      self.setAutoFactura = function(rhs) {
        m_bAutoFactura = rhs;
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

      self.showRemito = function(cliId,  vPvIds) { // TODO: Use of ByRef founded Public Sub ShowRemito(ByVal CliId As Long, ByRef vPvIds() As Long)
        try {

          m_cli_id = cliId;
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
          Cairo.manageErrorEx(ex.message, "ShowRemito", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      self.showRemitoOrden = function(cliId,  vOsIds) { // TODO: Use of ByRef founded Public Sub ShowRemitoOrden(ByVal CliId As Long, ByRef vOsIds() As Long)
        try {

          m_cli_id = cliId;
          Cairo.Database.getData(mVentaConstantes.CLIENTE, mVentaConstantes.CLI_ID, cliId, mVentaConstantes.CLI_NAME, m_cliente);

          var i = null;
          G.redim(m_osIds, vOsIds.Length + 1);
          for (i = 1; i <= vOsIds.Length + 1; i++) {
            m_osIds[i] = vOsIds(i - 1);
          }

          if(!pInitMembers()) {
            return;
          }

          pShowStartWizardOrden();

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "ShowRemito", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      self.showRemitoOrdenAuto = function(cliId,  vOsIds,  vPrnsIds) { // TODO: Use of ByRef founded Public Sub ShowRemitoOrdenAuto(ByVal CliId As Long, ByRef vOsIds() As Long, ByRef vPrnsIds() As Long)
        try {

          m_cli_id = cliId;
          Cairo.Database.getData(mVentaConstantes.CLIENTE, mVentaConstantes.CLI_ID, cliId, mVentaConstantes.CLI_NAME, m_cliente);

          var i = null;
          G.redim(m_osIds, vOsIds.Length + 1);
          for (i = 1; i <= vOsIds.Length + 1; i++) {
            m_osIds[i] = vOsIds(i - 1);
          }

          G.redim(m_prnsIds, vPrnsIds.Length + 1);
          for (i = 1; i <= vPrnsIds.Length + 1; i++) {
            m_prnsIds[i] = vPrnsIds(i - 1);
          }

          if(!pInitMembers()) {
            return;
          }

          pShowStartWizardOrden();

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "ShowRemito", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var pInitMembers = function() {
        self.setDialog(new cABMGeneric());
        setCIEditGenericDoc_Footer(new cABMGeneric());
        setCIEditGenericDoc_Items(new cABMGeneric());

        if(!DoCairo.Security.anAccess(csPreVtaNewRemito, Cairo.Constants.NO_ID, csE_DocTypePrestacion.cSEDOCTPRENEW)) {
          return null;
        }
        return true;
      };

      self.copy = function() {

        if(!DoCairo.Security.anAccessEx(csPreVtaNewRemito, m_doc_id, csE_DocTypePrestacion.cSEDOCTPRENEW, true)) { return false; }

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, Cairo.Constants.NO_ID);
        m_copy = true;
        m_docEditable = true;
        m_docEditMsg = "";

        // Obtengo el numero para este comprobante
        //
        GetDocNumber(m_lastDoc, m_dialog, m_taPropuesto, mVentaConstantes.RV_NRODOC);
        pSetEnabled();
      };

      self.editNew = function() {

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, Cairo.Constants.NO_ID);

        return load(Cairo.Constants.NO_ID).then(
          function(ignored) {
            return refreshCollection();
          }
        );
        m_lastCli = Cairo.Constants.NO_ID;
        m_lastTrans = Cairo.Constants.NO_ID;
        m_lastChof = Cairo.Constants.NO_ID;

        if(!m_docEditable) {
          if(LenB(m_docEditMsg)) {
            MsgWarning(m_docEditMsg);
          }
        }

        if(m_dialog.getProperties().item(mVentaConstantes.DOC_ID).getSelectId() === Cairo.Constants.NO_ID) {
          //'Debe indicar un documento
          MsgInfo(Cairo.Language.getText(1562, ""));
        }

        var abmObj = null;
        abmObj = m_dialog;

        var iProp = null;
        iProp = m_dialog.getProperties().item(mVentaConstantes.CLI_ID);

        if(m_userCfg.getNuevoAlGrabar()) {
          iProp.setSelectId(Cairo.Constants.NO_ID);
          iProp.setValue("");
          m_dialog.showValue(iProp);
        }
        abmObj.setSetFocusFirstCtrlInNew(true);

        // Obtengo los datos por defecto del cliente
        //
        pSetDatosCliente();

        // Obtengo el numero para este comprobante
        //
        GetDocNumber(m_lastDoc, m_dialog, m_taPropuesto, mVentaConstantes.RV_NRODOC);
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

          if(m_id === Cairo.Constants.NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(mVentaConstantes.REMITOVENTA);
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
            _rtn = pFirmar();

            break;

          case Dialogs.Message.MSG_GRID_ROW_DELETED:
            _rtn = true;
            pShowTotales(m_items.getProperties().item(C_ITEMS).getGrid().getRows());

            break;

          case Dialogs.Message.MSG_DOC_EDIT_STATE:
            //'Remitos de ventas
            ShowEditState(m_docEditMsg, Cairo.Language.getText(1712, ""));

            break;

          case Dialogs.Message.MSG_DOC_DELETE:
            if(self.delete(m_id)) {
              _rtn = true;
              pMove(Dialogs.Message.MSG_DOC_NEXT);
            }

            break;

          case Dialogs.Message.MSG_DOC_APPLY:
            pShowApply();

            break;

          case Dialogs.Message.MSG_DOC_ANULAR:
            DocAnular(m_id, m_est_id, m_estado, csPreVtaAnularRemito, csPreVtaDesAnularRemito, m_dialog, m_docEditable, m_docEditMsg, "sp_DocRemitoVentaAnular", "sp_DocRemitoVentaEditableGet");
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
            cPublicDoc.documentSearch(csEDocumentoTipo.cSEDT_REMITOVENTA, self, !CBool(info));

            break;

          case Dialogs.Message.MSG_DOC_DOC_AUX:

            if(m_bShowStockData) {
              if(m_id) {

                var abmObj = null;
                abmObj = m_dialog;

                if(pDocDescargaBOM()) {

                  var menu = null;
                  //'Ver &Transferencia de Stock~1
                  menu = Cairo.Language.getText(1713, "")+ "~1";

                  if(m_st_id_consumo !== Cairo.Constants.NO_ID) {
                    menu = menu+ "|"+ Cairo.Language.getText(1714, "")+ "~2";
                    //& "|Ver &Consumo~2"
                  }

                  if(m_st_id_consumoTemp !== Cairo.Constants.NO_ID) {
                    menu = menu+ "|"+ Cairo.Language.getText(1715, "")+ "~3";
                    //& "|Ver Consumo de T&emporales~3"
                  }

                  if(m_st_id_producido !== Cairo.Constants.NO_ID) {
                    menu = menu+ "|"+ Cairo.Language.getText(1716, "")+ "~4";
                    //& "|Ver &Producción~4"
                  }

                  menu = menu+ "|"+ Cairo.Language.getText(1717, "")+ "~5";
                  //& "|Ver T&odos~5"

                  abmObj.ShowPopMenu(menu);
                }
                else {
                  self.messageEx(Dialogs.Message.MSG_MENU_AUX, 1);
                }

              }
              else {
                MsgInfo(Cairo.Language.getText(1620, ""));
                //Debe editar un comprobante guardado para poder ver los documentos auxiliares
              }
            }

            break;

          case Dialogs.Message.MSG_DOC_DOC_EDIT:

            if(m_id) {

              if(m_docEditable) {

                MsgInfo(Cairo.Language.getText(1555, ""));
                //Este documento puede editarse normalmente
              }
              else {

                if(DocCanSave(m_dialog, mVentaConstantes.RV_FECHA)) {

                  var editDoc = null;
                  editDoc = new cEditDocEx();

                  editDoc.setObjectClient(self);
                  editDoc.edit(m_id, m_doct_id, mVentaConstantes.REMITOVENTA, mVentaConstantes.RV_ID, mVentaConstantes.REMITOVENTAITEM, mVentaConstantes.RVI_ID, csPreVtaNewRemito, csPreVtaEditRemito, m_cli_id, Cairo.Constants.NO_ID, true);
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

              pShowMenuDocAction();

            }
            else {
              MsgInfo(Cairo.Language.getText(3955, ""));
              //Esta opción solo sirve para modificar documentos guardados y aplicados
            }

            break;

          case Dialogs.Message.MSG_MENU_AUX:

            switch (Cairo.Util.val(info)) {
              //' Transferencia de Stock
              case 1:
                ShowDocAux(m_st_id, "CSStock2.cStock", "CSABMInterface2.cABMGeneric");

                //' Consumo
                break;

              case 2:
                ShowDocAux(m_st_id_consumo, "CSStock2.cStock", "CSABMInterface2.cABMGeneric");

                //' Consumo Temporal
                break;

              case 3:
                ShowDocAux(m_st_id_consumoTemp, "CSStock2.cStock", "CSABMInterface2.cABMGeneric");

                //' Producido
                break;

              case 4:
                ShowDocAux(m_st_id_producido, "CSStock2.cStock", "CSABMInterface2.cABMGeneric");

                //' Ambos
                break;

              case 5:

                ShowDocAux(m_st_id, "CSStock2.cStock", "CSABMInterface2.cABMGeneric");

                if(m_st_id_consumo !== Cairo.Constants.NO_ID) {
                  ShowDocAux(m_st_id_consumo, "CSStock2.cStock", "CSABMInterface2.cABMGeneric");
                }

                if(m_st_id_consumoTemp !== Cairo.Constants.NO_ID) {
                  ShowDocAux(m_st_id_consumoTemp, "CSStock2.cStock", "CSABMInterface2.cABMGeneric");
                }

                if(m_st_id_producido !== Cairo.Constants.NO_ID) {
                  ShowDocAux(m_st_id_producido, "CSStock2.cStock", "CSABMInterface2.cABMGeneric");
                }

                break;

              case 6:
                pShowFactura(false);

                break;

              case 7:
                pShowFactura(true);

                break;

              case 8:
                pCancelarRemito();

                break;
            }

            break;

          case Dialogs.Message.MSG_DOC_HISTORY:

            if(m_id !== Cairo.Constants.NO_ID) {

              ShowHistory(csETablesVentas.cSREMITOVENTA, m_id, m_documento+ " "+ m_nrodoc);
            }
            else {

              //'El documento aun no ha sido guardado
              MsgInfo(Cairo.Language.getText(1552, ""));
            }

            break;

          case Dialogs.Message.MSG_EXPORT_GET_EMAIL:

            _rtn = cIABMProperty.getEmailFromCliente(m_cli_id);

            break;

          case Dialogs.Message.MSG_GRID_VIRTUAL_ROW:

            _rtn = pProcessMultiRow(info);

            break;

          case Dialogs.Message.MSG_EXPORT_GET_FILE_NAME_POSTFIX:

            _rtn = pGetFileNamePostFix();

            break;

          case Dialogs.Message.MSG_PRINT_GET_TITLE:

            _rtn = m_nrodoc+ " - "+ m_cliente;

            break;
        }


        return Cairo.Promises.resolvedPromise(_rtn);
      };

      self.discardChanges = function() {
        return Cairo.Promises.resolvedPromise(refreshCollection());
      };

      self.propertyChange = function(key) {

        switch (key) {

          case K_DOC_ID:

            // Si cambio de documento
            //
            if(cIABMProperty.docChange(m_dialog, m_lastDoc, m_lastDocName)) {

              // Obtengo el tipo de documento
              //' nrs devolucion
              if(!Cairo.Database.getData(mVentaConstantes.DOCUMENTO, mVentaConstantes.DOC_ID, m_lastDoc, mVentaConstantes.DOCT_ID, m_lastDoctId)) { return false; }

              // Si cambie de documento y estaba en un comprobante ya guardado
              // tengo que mostrar el formulario sin datos, para evitar
              // que presione guardar y le cambie el doc_id al comprobante por error
              //
              if(m_id !== Cairo.Constants.NO_ID && m_doc_id !== m_lastDoc) { self.edit(csDocChanged); }

              // Obtengo el numero para este comprobante
              //
              GetDocNumber(m_lastDoc, m_dialog, m_taPropuesto, mVentaConstantes.RV_NRODOC);

              // Si corresponde muestro la cotizacion de la moneda del documento
              //
              pShowCotizacion();

              // Si corresponde muestro el deposito
              //
              pSetShowStockData(false);
            }

            // Defino el estado de edicion del comprobante
            //
            pSetEnabled();

            break;

          case K_CLI_ID:

            // Obtengo los datos del cliente
            //
            pSetDatosCliente();

            // DATADD
            mPublicVentas.self.showDataAddCliente(m_userCfg.getShowDataAddInVentas(), m_dialog);

            break;

          case K_DESCUENTO1:
          case K_DESCUENTO2:
            pShowTotales(m_items.getProperties().item(C_ITEMS).getGrid().getRows());

            // Lote
            //
            break;

          case K_DEPL_ID:

            pSetStock();

            break;

          case K_FECHA:

            // Cotizacion
            if(m_lastFecha !== pGetFecha()) {
              m_lastFecha = pGetFecha();
              m_lastMonIdCotizacion = Cairo.Constants.NO_ID;
              pShowCotizacion();
            }

            break;

          case K_TRANS_ID:

            pSetDatosTransporte();

            break;

          case K_CHOF_ID:

            pSetDatosChofer();

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
        var bIsNew = null;

        // Save and State
        //
        if(!DocCanEdit(m_docEditable, m_docEditMsg)) {
          _rtn = true;
          return _rtn;
        }
        if(!DocCanSave(m_dialog, mVentaConstantes.RV_FECHA)) {
          _rtn = false;
          return _rtn;
        }

        if(pGetItems().getGrid().getRows().count() === 0) {
          //'El documento debe contener al menos un item
          MsgWarning(Cairo.Language.getText(3903, ""));
          _rtn = false;
          return _rtn;
        }

        var mouse = null;
        mouse = new cMouseWait();

        DoEvents:(DoEvents: DoEvents: DoEvents);

        var register = new Cairo.Database.Register();

        register.setFieldId(mVentaConstantes.RV_TMPID);
        register.setTable(mVentaConstantes.REMITOVENTATMP);

        register.setId(Cairo.Constants.NEW_ID);

        var fields = register.getFields();

        var w_var fields = register.getFields();

        var apiPath = Cairo.Database.getAPIVersion();
        register.setPath(apiPath + "general/remitoventa");

        if(m_copy) {
          w_fields.add(mVentaConstantes.RV_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);
          bIsNew = true;
        }
        else {
          w_fields.add(mVentaConstantes.RV_ID, m_id, Cairo.Constants.Types.long);
          bIsNew = m_id === Cairo.Constants.NO_ID;
        }

        if(m_est_id === Cairo.Constants.NO_ID || bIsNew) {
          m_est_id = CSGeneralEx2.csEEstado.cSEEST_PENDIENTE;
        }

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          var property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NUMERO:
              fields.add(mVentaConstantes.RV_NUMERO, property.getValue(), Cairo.Constants.Types.long);
              break;

            case K_NRODOC:
              fields.add(mVentaConstantes.RV_NRODOC, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_DESCRIP:
              fields.add(mVentaConstantes.RV_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_FECHA:
              fields.add(mVentaConstantes.RV_FECHA, property.getValue(), Cairo.Constants.Types.date);
              break;

            case K_FECHAENTREGA:
              fields.add(mVentaConstantes.RV_FECHAENTREGA, property.getValue(), Cairo.Constants.Types.date);
              break;

            case K_CLI_ID:
              fields.add(mVentaConstantes.CLI_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_COTIZACION:
              fields.add(mVentaConstantes.RV_COTIZACION, property.getValue(), Cairo.Constants.Types.double);
              break;

            case K_CCOS_ID:
              fields.add(mVentaConstantes.CCOS_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_SUC_ID:
              fields.add(mVentaConstantes.SUC_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_DESCUENTO1:
              fields.add(mVentaConstantes.RV_DESCUENTO1, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_DESCUENTO2:
              fields.add(mVentaConstantes.RV_DESCUENTO2, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_DOC_ID:
              fields.add(mVentaConstantes.DOC_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_LP_ID:
              fields.add(mVentaConstantes.LP_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_LD_ID:
              fields.add(mVentaConstantes.LD_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_CPG_ID:
              fields.add(mVentaConstantes.CPG_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_VEN_ID:
              fields.add(mVentaConstantes.VEN_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_LGJ_ID:
              fields.add(mVentaConstantes.LGJ_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_PRO_ID_ORIGEN:
              fields.add(mVentaConstantes.PRO_ID_ORIGEN, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_PRO_ID_DESTINO:
              fields.add(mVentaConstantes.PRO_ID_DESTINO, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_TRANS_ID:
              fields.add(mVentaConstantes.TRANS_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_CLIS_ID:
              fields.add(mVentaConstantes.CLIS_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_CHOF_ID:
              fields.add(mVentaConstantes.CHOF_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_CAM_ID:
              fields.add(mVentaConstantes.CAM_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_CAM_ID_SEMI:
              fields.add(mVentaConstantes.CAM_ID_SEMI, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_DESTINATARIO:
              fields.add(mVentaConstantes.RV_DESTINATARIO, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_ORDENCOMPRA:
              fields.add(mVentaConstantes.RV_ORDEN_COMPRA, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_DEPL_ID:
              fields.add(mVentaConstantes.DEPL_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RETIRO:
              fields.add(mVentaConstantes.RV_RETIRO, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_GUIA:
              fields.add(mVentaConstantes.RV_GUIA, property.getValue(), Cairo.Constants.Types.text);
              break;
          }
        }

        var _count = m_footer.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          property = m_footer.getProperties().item(_i);
          switch (property.getKey()) {
            case K_TOTAL:
              fields.add(mVentaConstantes.RV_TOTAL, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_NETO:
              fields.add(mVentaConstantes.RV_NETO, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_IVARI:
              fields.add(mVentaConstantes.RV_IVARI, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_IVARNI:
              fields.add(mVentaConstantes.RV_IVARNI, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_SUBTOTAL:
              fields.add(mVentaConstantes.RV_SUBTOTAL, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_IMPORTEDESC1:
              fields.add(mVentaConstantes.RV_IMPORTEDESC1, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_IMPORTEDESC2:
              fields.add(mVentaConstantes.RV_IMPORTEDESC2, property.getValue(), Cairo.Constants.Types.currency);
              break;
          }
        }

        w_fields.add(C.EST_ID, m_est_id, Cairo.Constants.Types.id);

        w_fields.setHaveLastUpdate(true);
        w_fields.setHaveWhoModify(true);

        register.prepareTransaction();
        if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return _rtn; }

        if(!pSaveItems(register.getID(register))) { return _rtn; }

        var sqlstmt = null;
        var rs = null;
        sqlstmt = "sp_DocRemitoVentaSave "+ register.getID().toString();

        if(!Cairo.Database.saveSp(sqlstmt, rs, DocGetTimeOut(m_nrosSerie), "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return _rtn; }

        if(rs.isEOF()) { return _rtn; }

        var id = null;
        if(!GetDocIDFromRecordset(rs, id)) { return _rtn; }

        m_copy = false;

        if(load(id)) {

          var abmGen = null;
          abmGen = m_dialog;

          if(bIsNew) {

            if(m_userCfg.getNuevoAlGrabar()) {
              abmGen.PrintDocumento;
            }

          }

          abmGen.setSendNewDoc(m_userCfg.getNuevoAlGrabar());

          _rtn = true;

        }
        else {

          _rtn = false;

        }

        return _rtn;
      };

      var updateList = function() {
        if(m_id === Cairo.Constants.NO_ID) { return; }
        if(m_listController === null) { return; }

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
        return "#general/remitoventa/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "remitoventa" + id;
      };

      self.getTitle = function() {
        //'Remito de venta
        return Cairo.Language.getText(1718, "");
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

            case K_CLI_ID:
              if(ValEmpty(property.getSelectId(), Cairo.Constants.Types.id)) {
                //'Debe indicar un Cliente
                MsgInfo(Cairo.Language.getText(1563, ""));
              }
              break;

            case K_DOC_ID:
              if(ValEmpty(property.getSelectId(), Cairo.Constants.Types.id)) {
                //'Debe indicar un documento
                MsgInfo(Cairo.Language.getText(1562, ""));
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
              if(ValEmpty(property.getSelectId(), Cairo.Constants.Types.id) && m_bShowStockData) {
                //'Debe indicar un deposito
                MsgInfo(Cairo.Language.getText(1559, ""));
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var isEmptyRow = function(key,  row,  rowIndex) {
        var _rtn = null;
        try {

          switch (key) {
            case K_ITEMS:
              _rtn = pIsEmptyRow(row, rowIndex);
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

      //-------------------------------------------------------------------------------------
      // Documento
      var getCIDocumento_DocId = function() {
        return m_doc_id;
      };

      var getCIDocumento_DocTId = function() {
        return m_doct_id;
      };

      var getCIDocumento_Id = function() {
        return m_id;
      };

      var cIDocumento_LoadForPrint = function(id) {
        var _rtn = null;
        try {

          var sqlstmt = null;
          var rs = null;

          sqlstmt = "select rv.doct_id, rv.doc_id, rv_nrodoc, cli_nombre, rv.cli_id from RemitoVenta rv inner join Cliente cli on rv.cli_id = cli.cli_id where rv.rv_id = "+ id.toString();
          if(!Cairo.Database.openRs(sqlstmt, rs)) { return _rtn; }

          if(!Cairo.Database.openRs(sqlstmt, rs)) { return _rtn; }

          m_id = id;
          m_doc_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.DOC_ID);
          m_doct_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.DOCT_ID);
          m_cli_id = Cairo.Database.valField(rs.getFields(), mVentaConstantes.CLI_ID);
          m_cliente = Cairo.Database.valField(rs.getFields(), mVentaConstantes.CLI_NAME);
          m_nrodoc = Cairo.Database.valField(rs.getFields(), mVentaConstantes.RV_NRODOC);

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
        return Cairo.Security.hasPermissionTo(csPreVtaListRemito);
      };

      self.setDialog = function(rhs) {
        m_dialog = rhs;
        m_dialog.setIsDocument(true);

      #If !PREPROC_SFS Then;
        var abmGen = null;

        abmGen = m_dialog;
        abmGen.FactoryObject = "CSABMInterface2.cFactory";
        abmGen.ObjForm = "CSABMInterface2.fRemitoVenta";
      #End If;
      };

      self.isEditing = function() {
        return m_editing;
      };

      self.edit = function(id,  inModalWindow) {
        var p = Cairo.Promises.resolvedPromise(false);
        try {

          if(!DoCairo.Security.anAccess(csPreVtaListRemito, GetdocIdFromObjAbm(m_dialog), csE_DocTypePrestacion.cSEDOCTPRELIST)) { return p; }

          // Id = csDocChanged esto significa que se cambio
          //                   el documento estando en un
          //                   comprobante ya guardado
          //
          m_isNew = id === Cairo.Constants.NO_ID || id === csDocChanged;

          p = load(id).then(
            function(success) {
              if(success) {

                if(m_dialog.getProperties().count() === 0) {
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

                  if(pDocDescargaBOM()) {

                    pShowStartWizardBOM();

                  }
                  else {

                    pShowStartWizard();
                  }

                }
                else if(id !== csDocChanged && m_isNew && pDocDesdeOrden()) {

                  pShowStartWizardOrden();

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
              var property = m_items.getProperties().item(C_ITEMS);
              pShowImporteAndIva(property.getGrid().getRows(lRow));
              pShowTotales(property.getGrid().getRows());
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

            if(row.item(info.lCol).getKey() === KI_PR_ID) {

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

      //Private Sub pAddMultiRows(ByVal Ids As String, _
      //                          ByRef Info As Variant)
      //  Dim sqlstmt As String
      //  Dim rs      As ADODB.Recordset
      //
      //  sqlstmt = "select pr_nombreventa, pr_id from Producto where pr_id in (" & Ids & ")"
      //  If Not gDB.OpenRs(sqlstmt, rs) Then Exit Sub
      //  If rs.EOF Then Exit Sub
      //
      //  Dim i As Long
      //  Dim j As Long
      //  Dim k As Long
      //  Dim pr_id As Long
      //  Dim vIds  As Variant
      //  Dim vIds2 As Variant
      //  Dim bFound As Boolean
      //
      //  vIds2 = Split(Ids, ",")
      //
      //  ReDim vIds(UBound(vIds2))
      //
      //  For i = 0 To UBound(vIds2)
      //    bFound = False
      //    For j = 0 To UBound(vIds)
      //
      //      If vIds2(i) = vIds(j) Then
      //        bFound = True
      //        Exit For
      //      End If
      //
      //    Next
      //    If Not bFound Then
      //      vIds(k) = vIds2(i)
      //      k = k + 1
      //    End If
      //  Next
      //
      //  ReDim Preserve vIds(k - 1)
      //
      //  ' Ahora respeto el orden de seleccion
      //  '
      //  For i = 0 To UBound(vIds)
      //
      //    rs.MoveFirst
      //
      //    Do While Not rs.EOF
      //
      //      pr_id = gDB.ValField(rs.fields, cscPrId)
      //
      //      If Val(vIds(i)) = pr_id Then
      //        Info.NewId.Add pr_id
      //        Info.NewValue.Add gDB.ValField(rs.fields, cscPrNombreVenta)
      //        Exit Do
      //      End If
      //
      //      rs.MoveNext
      //    Loop
      //
      //  Next
      //
      //  ' No lo toquen, es mas 1 :( o explota todooo :P
      //  ' ups al final no era jeje
      //  '
      //  Info.iAddRows = Info.NewId.count '+ 1
      //
      //  Info.bAddRows = Info.iAddRows
      //
      //End Sub

      var columnAfterEdit = function(key,  lRow,  lCol,  newValue,  newValueID) {
        var _rtn = null;
        try {

          switch (key) {
            case K_ITEMS:
              _rtn = pColumnAfterEdit(m_items.getProperties().item(C_ITEMS), lRow, lCol, newValue, newValueID);
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
              _rtn = pColumnBeforeEdit(m_items.getProperties().item(C_ITEMS), lRow, lCol, iKeyAscii);
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

              if(Dialogs.cell(row, KI_PR_LLEVALOTE).getID() && Dialogs.cell(row, KI_PR_LLEVANROSERIE).getID() === 0) {

                var pr_id_kit = null;
                if(Dialogs.cell(row, KI_ES_KIT).getID()) {
                  pr_id_kit = Dialogs.cell(row, KI_PR_ID).getID();
                }

                var property = property.getGrid().getColumns().item(mVentaConstantes.STL_ID);
                property.setSelectFilter("'pr_id = "+ Dialogs.cell(row, KI_PR_ID).getID().toString()+ " and "+ GetStockLoteFilterEx(pGetDeplId(), m_stockConfig.getStockXFisico(), pr_id_kit, m_depf_id, pGetCliId(), Cairo.Constants.NO_ID)+ "'");

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
            var property = m_items.getProperties().item(C_ITEMS).getGrid();
            switch (property.Columns(lCol).key) {
              case KI_NROSERIE:
                row = property.Rows(lRow);
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

        id = Cairo.Util.val(Dialogs.cell(row, KI_RVI_ID).getValue());

        if(id !== Cairo.Constants.NO_ID) { m_itemsDeleted = m_itemsDeleted+ id.toString()+ ","; }

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
                //'Debe indicar una cantidad (1)
                MsgInfo(Cairo.Language.getText(1365, "", strRow));
              }

              // Por ahora no lo exijo
              //
              //      Case KI_PRECIO
              //        If ValEmpty(Cell.Value, csCurrency) Then
              //          MsgInfo "Debe indicar un precio" & strRow
              //          Exit Function
              //        End If

              break;

            case KI_PR_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                //'Debe indicar un producto de venta (1)
                MsgInfo(Cairo.Language.getText(1565, "", strRow));
              }

              break;

            case KI_NROSERIE:
              bLlevaNroSerie = Dialogs.cell(row, KI_PR_LLEVANROSERIE).getID();
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.text) && bLlevaNroSerie && m_bShowStockData) {
                //'Debe indicar un numero de serie (1)
                MsgInfo(Cairo.Language.getText(1630, "", strRow));
              }

              // Lote
              //
              // Lote Fifo
              //
              break;

            case KI_STL_ID:
              if(m_bShowStockData) {
                if(ValEmpty(cell.getId(), Cairo.Constants.Types.id) && Dialogs.cell(row, KI_PR_LLEVALOTE).getID() && Dialogs.cell(row, KI_PR_LLEVANROSERIE).getID() === 0 && Dialogs.cell(row, KI_PR_LOTEFIFO).getID() === 0) {

                  //'Debe indicar un lote (1)
                  MsgInfo(Cairo.Language.getText(1632, "", strRow));
                }
              }
              break;
          }
        }

        // Si lleva numero de serie valido que
        // la cantidad indicada sea la misma
        // que en la coleccion de numeros de serie
        //
        if(bLlevaNroSerie && m_bShowStockData) {

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

        // Preferencias del usuario
        //
        var bValidateDocDefault = null;

        abmGen = m_dialog;
        abmGen.ResetLayoutMembers;

        // DATADD
        if(m_userCfg.getShowDataAddInVentas()) {
          abmGen.SetHeightToDocWithDescrip;
        }

        m_dialog.getProperties().clear();

        var w_tabs = m_dialog.getTabs();

        w_tabs.clear();

        var tab = w_tabs.add(null);
        tab.setName(Cairo.Constants.TAB_GENERAL);

        var tab = w_tabs.add(null);
        tab.setIndex(1);
        //'Adicionales
        tab.setName(Cairo.Language.getText(1566, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(2);
        //'Transporte
        tab.setName(Cairo.Language.getText(1050, ""));

        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, mVentaConstantes.DOC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSDocumento2.CSDocumento);
        //'Documento
        elem.setName(Cairo.Language.getText(1567, ""));
        elem.setKey(K_DOC_ID);

        if(m_doc_id !== Cairo.Constants.NO_ID) {
          elem.setSelectId(m_doc_id);
          elem.setValue(m_documento);
        }
        else {
          // Preferencias del usuario
          //
          elem.setSelectId(m_userCfg.getDocRvId());
          elem.setValue(m_userCfg.getDocRvNombre());

          bValidateDocDefault = elem.getSelectId() !== Cairo.Constants.NO_ID;
        }

        elem.setSelectFilter("'doct_id = "+ csEDocumentoTipo.cSEDT_REMITOVENTA.toString()+ " or doct_id = "+ csEDocumentoTipo.cSEDT_DEVOLUCIONREMITOVTA.toString()+ "'");

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

        var elem = properties.add(null, mVentaConstantes.RV_FECHA);
        elem.setType(Dialogs.PropertyType.date);
        //'Fecha
        elem.setName(Cairo.Language.getText(1569, ""));
        elem.setLeftLabel(-580);
        elem.setLeft(700);
        elem.setKey(K_FECHA);
        elem.setValue(m_fecha);

        var elem = properties.add(null, mVentaConstantes.RV_FECHAENTREGA);
        elem.setType(Dialogs.PropertyType.date);
        //'Entrega
        elem.setName(Cairo.Language.getText(1570, ""));
        elem.setKey(K_FECHAENTREGA);
        elem.setValue(m_fechaentrega);

        var elem = properties.add(null, mVentaConstantes.CLI_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CLIENTE);
        elem.setTopFromProperty(mVentaConstantes.RV_FECHA);
        elem.setLeft(2700);
        elem.setLeftLabel(-580);
        //'Cliente
        elem.setName(Cairo.Language.getText(1150, ""));
        elem.setKey(K_CLI_ID);
        elem.setSelectId(m_cli_id);
        elem.setValue(m_cliente);
        abmGen.NewKeyPropFocus = mVentaConstantes.CLI_ID;

        // CLI-WIDTH
        elem.setWidth(5450);

        var elem = properties.add(null, mVentaConstantes.RV_NRODOC);
        elem.setType(Dialogs.PropertyType.text);
        //'Número
        elem.setName(Cairo.Language.getText(1065, ""));
        elem.setSize(50);
        elem.setKey(K_NRODOC);
        elem.setValue(m_nrodoc);
        elem.setTextMask(m_taMascara);
        elem.setTextAlign(vbRightJustify);

        var elem = properties.add(null, mVentaConstantes.CPG_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CONDICIONPAGO);
        //'Cond. pago
        elem.setName(Cairo.Language.getText(1571, ""));
        elem.setKey(K_CPG_ID);
        elem.setSelectId(m_cpg_id);
        elem.setValue(m_condicionPago);

        // CLI-WIDTH
        elem.setTopFromProperty(mVentaConstantes.RV_FECHA);
        elem.setLeft(9400);
        elem.setLeftLabel(-1200);

        var elem = properties.add(null, mVentaConstantes.RV_COTIZACION);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        //'Cotiz.
        elem.setName(Cairo.Language.getText(1650, ""));
        elem.setFormat(m_generalConfig.getFormatDecCotizacion());
        elem.setKey(K_COTIZACION);
        elem.setValue(m_cotizacion);
        elem.setWidth(1000);

        // CLI-WIDTH
        elem.setTopFromProperty(mVentaConstantes.RV_FECHA);
        elem.setTopToPrevious(440);
        elem.setLeft(5900);
        elem.setLeftLabel(-600);

        var elem = properties.add(null, mVentaConstantes.RV_DESCUENTO1);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
        elem.setLeftLabel(-600);
        //'Desc. 1
        elem.setName(Cairo.Language.getText(1573, ""));
        elem.setKey(K_DESCUENTO1);
        elem.setValue(m_descuento1);
        elem.setWidth(1000);

        var elem = properties.add(null, mVentaConstantes.RV_DESCUENTO2);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
        elem.setTopFromProperty(mVentaConstantes.RV_DESCUENTO1);
        elem.setLeft(7150);
        elem.setLeftLabel(-150);
        elem.setName("2");
        elem.setKey(K_DESCUENTO2);
        elem.setValue(m_descuento2);
        elem.setWidth(1000);

        var elem = properties.add(null, mVentaConstantes.DEPL_ID_ORIGEN);
        elem.setType(Dialogs.PropertyType.select);
        elem.setLeft(5880);
        elem.setLeftLabel(-800);
        elem.setSelectTable(Cairo.Tables.DEPOSITOLOGICO);
        //'Deposito
        elem.setName(Cairo.Language.getText(1574, ""));
        elem.setKey(K_DEPL_ID);

        if(m_depl_id !== Cairo.Constants.NO_ID || !m_bShowStockData) {
          elem.setSelectId(m_depl_id);
          elem.setValue(m_deposito);
        }
        else {
          // Preferencias del usuario
          //
          elem.setSelectId(m_userCfg.getDeplId());
          elem.setValue(m_userCfg.getDeplNombre());
        }

        elem.setEnabled(m_bShowStockData);

        var elem = properties.add(null, mVentaConstantes.LP_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.LISTAPRECIO);
        //'Lista de Precios
        elem.setName(Cairo.Language.getText(1397, ""));
        elem.setSelectFilter(GetListaPrecioGetXCliente(m_doc_id, m_cli_id));
        elem.setKey(K_LP_ID);
        elem.setSelectId(m_lp_id);
        elem.setValue(m_listaPrecio);

        // CLI-WIDTH
        elem.setTopFromProperty(mVentaConstantes.CPG_ID);
        elem.setTopToPrevious(440);
        elem.setLeftFromProperty(mVentaConstantes.CPG_ID);
        elem.setLeftLabel(-1200);

        var elem = properties.add(null, mVentaConstantes.VEN_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.VENDEDORES);
        //'Vendedor
        elem.setName(Cairo.Language.getText(1510, ""));
        elem.setKey(K_VEN_ID);
        elem.setSelectId(m_ven_id);
        elem.setValue(m_vendedor);

        var elem = properties.add(null, mVentaConstantes.SUC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.SUCURSAL);
        //'Sucursal
        elem.setName(Cairo.Language.getText(1281, ""));
        elem.setKey(K_SUC_ID);
        elem.setSelectId(m_suc_id);
        elem.setValue(m_sucursal);

        var elem = properties.add(null, mVentaConstantes.RV_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        //'Observ.
        elem.setName(Cairo.Language.getText(1211, ""));
        elem.setLeftLabel(-600);
        elem.setSize(5000);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);
        elem.setLeftFromProperty(mVentaConstantes.RV_FECHA);
        elem.setTopFromProperty(mVentaConstantes.RV_NRODOC);
        elem.setWidth(4275);
        elem.setHeight(800);
        elem.setTopToPrevious(440);

        var elem = properties.add(null, mVentaConstantes.CLIS_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.SUCURSALCLIENTE);
        //'Sucursal del Cliente
        elem.setName(Cairo.Language.getText(1576, ""));
        elem.setKey(K_CLIS_ID);
        elem.setValue(m_clienteSucursal);
        elem.setSelectId(m_clis_id);
        elem.setSelectFilter(GetHelpFilterCliSuc(m_cli_id));
        elem.setTabIndex(1);
        elem.setLeft(1500);

        var elem = properties.add(null, mVentaConstantes.PRO_ID_ORIGEN);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROVINCIA);
        //'Pcia. Origen
        elem.setName(Cairo.Language.getText(1577, ""));
        elem.setKey(K_PRO_ID_ORIGEN);
        elem.setSelectId(m_pro_id_origen);
        elem.setValue(m_proOrigen);
        elem.setLeftLabel(-1300);
        elem.setTabIndex(1);

        var elem = properties.add(null, mVentaConstantes.PRO_ID_DESTINO);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROVINCIA);
        //'Pcia. Destino
        elem.setName(Cairo.Language.getText(1578, ""));
        elem.setKey(K_PRO_ID_DESTINO);
        elem.setSelectId(m_pro_id_destino);
        elem.setValue(m_proDestino);
        elem.setLeftLabel(-1300);
        elem.setTabIndex(1);

        var elem = properties.add(null, mVentaConstantes.CCOS_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTROCOSTO);
        //'Centro de Costo
        elem.setName(Cairo.Language.getText(1057, ""));
        elem.setKey(K_CCOS_ID);
        elem.setSelectId(m_ccos_id);
        elem.setValue(m_centroCosto);
        elem.setTabIndex(1);

        var elem = properties.add(null, mVentaConstantes.RV_ORDEN_COMPRA);
        elem.setType(Dialogs.PropertyType.text);
        //'Orden de Compra
        elem.setName(Cairo.Language.getText(1924, ""));
        elem.setKey(K_ORDENCOMPRA);
        elem.setValue(m_ordenCompra);
        elem.setTabIndex(1);

        var elem = properties.add(null, mVentaConstantes.LGJ_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(csLegajo);
        //'Legajo
        elem.setName(Cairo.Language.getText(1575, ""));
        elem.setKey(K_LGJ_ID);
        elem.setSelectId(m_lgj_id);
        elem.setValue(m_legajo);
        elem.setTabIndex(1);

        var elem = properties.add(null, mVentaConstantes.RV_RETIRO);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        //'Retirado Por
        elem.setName(Cairo.Language.getText(2883, ""));
        elem.setKey(K_RETIRO);
        elem.setValue(m_retiro);
        elem.setLeftLabel(-1300);
        elem.setTabIndex(1);

        var elem = properties.add(null, mVentaConstantes.RV_GUIA);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        //'Guia de Entrega
        elem.setName(Cairo.Language.getText(2884, ""));
        elem.setKey(K_GUIA);
        elem.setValue(m_guia);
        elem.setLeftLabel(-1300);
        elem.setTabIndex(1);

        var elem = properties.add(null, mVentaConstantes.LD_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.LISTADESCUENTO);
        //'Lista de Descuentos
        elem.setName(Cairo.Language.getText(1398, ""));
        elem.setSelectFilter(GetListaDescGetXCliente(m_doc_id, m_cli_id));
        elem.setKey(K_LD_ID);
        elem.setSelectId(m_ld_id);
        elem.setValue(m_listaDescuento);
        elem.setTabIndex(1);

        var elem = properties.add(null, mVentaConstantes.TRANS_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TRANSPORTE);
        //'Transporte
        elem.setName(Cairo.Language.getText(1050, ""));
        elem.setKey(K_TRANS_ID);
        elem.setValue(m_transporte);
        elem.setSelectId(m_trans_id);
        elem.setTabIndex(2);

        var elem = properties.add(null, mVentaConstantes.CHOF_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CHOFER);
        //'Chofer
        elem.setName(Cairo.Language.getText(1051, ""));
        elem.setKey(K_CHOF_ID);
        elem.setValue(m_chofer);
        elem.setSelectId(m_chof_id);
        elem.setSelectFilter(mPublicTransporte.self.getHelpTransporte(m_trans_id));
        elem.setTabIndex(2);

        var elem = properties.add(null, mVentaConstantes.CAM_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CAMION);
        //'Camion
        elem.setName(Cairo.Language.getText(3489, ""));
        elem.setKey(K_CAM_ID);
        elem.setValue(m_camion);
        elem.setSelectId(m_cam_id);
        elem.setSelectFilter(mPublicTransporte.self.getHelpTransporte(m_trans_id));
        elem.setTopFromProperty(mVentaConstantes.TRANS_ID);
        elem.setLeft(6000);
        elem.setTabIndex(2);

        var elem = properties.add(null, mVentaConstantes.CAM_ID_SEMI);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CAMIONSEMI);
        //'Semi
        elem.setName(Cairo.Language.getText(3493, ""));
        elem.setKey(K_CAM_ID_SEMI);
        elem.setValue(m_semi);
        elem.setSelectId(m_cam_id_semi);
        elem.setSelectFilter(mPublicTransporte.self.getHelpTransporte(m_trans_id));
        elem.setTabIndex(2);

        var elem = properties.add(null, mVentaConstantes.RV_DESTINATARIO);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        //'Destinatario
        elem.setName(Cairo.Language.getText(3494, ""));
        elem.setKey(K_DESTINATARIO);
        elem.setValue(m_destinatario);
        elem.setWidth(7000);
        elem.setLeftFromProperty(mVentaConstantes.TRANS_ID);
        elem.setTopFromProperty(mVentaConstantes.CHOF_ID);
        elem.setTopToPrevious(440);
        elem.setHeight(880);
        elem.setTabIndex(2);

        // DATADD
        if(m_userCfg.getShowDataAddInVentas()) {

          var elem = properties.add(null, c_ClienteDataAdd);
          elem.setType(Dialogs.PropertyType.text);
          elem.setSubType(Dialogs.PropertySubType.memo);
          elem.setWidth(10970);
          elem.setTopFromProperty(mVentaConstantes.RV_DESCRIP);
          elem.setTopToPrevious(860);
          elem.setLeftFromProperty(mVentaConstantes.RV_DESCRIP);
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
        iProp.setValue(Cairo.Util.boolToInt(CSKernelClient2.GetRegistry(csSeccionSetting.cSINTERFACE, C_HIDECOLSRV, 1)));
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

        if(!m_dialog.show(self)) { return false; }

        pSetShowStockData(true);

        var w_tabs = m_items.getTabs();

        w_tabs.clear();

        var tab = w_tabs.add(null);
        tab.setIndex(0);
        //'Items
        tab.setName(Cairo.Language.getText(1371, ""));

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
        c.hideLabel();;
        setGridItems(c);
        if(!pLoadItems(c)) { return false; }
        c.setName(C_ITEMS);
        c.setKey(K_ITEMS);
        c.setTabIndex(0);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        m_itemsDeleted = "";

        if(!m_items.show(self)) { return false; }

        abmGen = m_footer;
        abmGen.ResetLayoutMembers;

        var properties = m_footer.getProperties();

        properties.clear();

        var elem = properties.add(null, mVentaConstantes.RV_SUBTOTAL);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        //'Sub Total
        elem.setName(Cairo.Language.getText(1579, ""));
        elem.setKey(K_SUBTOTAL);
        elem.setValue(m_subTotal);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        var elem = properties.add(null, mVentaConstantes.RV_IMPORTEDESC1);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        //'Desc. 1
        elem.setName(Cairo.Language.getText(1573, ""));
        elem.setKey(K_IMPORTEDESC1);
        elem.setValue(m_importeDesc1);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        var elem = properties.add(null, mVentaConstantes.RV_IMPORTEDESC2);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        //'Desc. 2
        elem.setName(Cairo.Language.getText(1580, ""));
        elem.setKey(K_IMPORTEDESC2);
        elem.setValue(m_importeDesc2);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        var elem = properties.add(null, mVentaConstantes.RV_NETO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        //'Neto
        elem.setName(Cairo.Language.getText(1581, ""));
        elem.setKey(K_NETO);
        elem.setValue(m_neto);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        var elem = properties.add(null, mVentaConstantes.RV_IVARI);
        elem.setType(Dialogs.PropertyType.numeric);
        //'IVA RI
        elem.setName(Cairo.Language.getText(1582, ""));
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_IVARI);
        elem.setValue(m_ivari);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        var elem = properties.add(null, mVentaConstantes.RV_IVARNI);
        elem.setType(Dialogs.PropertyType.numeric);
        //'IVA RNI
        elem.setName(Cairo.Language.getText(1583, ""));
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_IVARNI);
        elem.setValue(m_ivarni);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        var elem = properties.add(null, mVentaConstantes.RV_TOTAL);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
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

        pShowCotizacion();

        // DATADD
        mPublicVentas.self.showDataAddCliente(m_userCfg.getShowDataAddInVentas(), m_dialog);

        abmGen.SetIconFormDoc(3);

        //c8f6c1
        if(m_userCfg.getUsarColoresEnDocumentos()) {
          abmGen.SetBakcColorTagMain(RGB(&HC8, &HF6, &HC1));
        }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(mVentaConstantes.DOC_ID);
        elem.setSelectId(m_doc_id);
        elem.setValue(m_documento);
        elem.setSelectId(m_userCfg.getDocRvId());
        elem.setValue(m_userCfg.getDocRvNombre());

        var elem = properties.item(cDeclarations.getCsDocNumberID());
        elem.setValue(m_numero);

        var elem = properties.item(cDeclarations.getCsDocEstateID());
        elem.setValue(m_estado);

        var elem = properties.item(mVentaConstantes.RV_FECHA);
        elem.setValue(m_fecha);

        var elem = properties.item(mVentaConstantes.RV_FECHAENTREGA);
        elem.setValue(m_fechaentrega);

        var elem = properties.item(mVentaConstantes.CLI_ID);
        elem.setSelectId(m_cli_id);
        elem.setValue(m_cliente);

        var elem = properties.item(mVentaConstantes.RV_NRODOC);
        elem.setValue(m_nrodoc);

        var elem = properties.item(mVentaConstantes.CPG_ID);
        elem.setSelectId(m_cpg_id);
        elem.setValue(m_condicionPago);

        var elem = properties.item(mVentaConstantes.RV_COTIZACION);
        elem.setValue(m_cotizacion);

        var elem = properties.item(mVentaConstantes.RV_DESCUENTO1);
        elem.setValue(m_descuento1);

        var elem = properties.item(mVentaConstantes.RV_DESCUENTO2);
        elem.setValue(m_descuento2);

        var elem = properties.item(mVentaConstantes.DEPL_ID_ORIGEN);
        elem.setSelectId(m_depl_id);
        elem.setValue(m_deposito);
        elem.setSelectId(m_userCfg.getDeplId());
        elem.setValue(m_userCfg.getDeplNombre());

        var elem = properties.item(mVentaConstantes.LP_ID);
        elem.setSelectId(m_lp_id);
        elem.setValue(m_listaPrecio);

        var elem = properties.item(mVentaConstantes.VEN_ID);
        elem.setSelectId(m_ven_id);
        elem.setValue(m_vendedor);

        var elem = properties.item(mVentaConstantes.SUC_ID);
        elem.setSelectId(m_suc_id);
        elem.setValue(m_sucursal);

        var elem = properties.item(mVentaConstantes.RV_DESCRIP);
        elem.setValue(m_descrip);

        var elem = properties.item(mVentaConstantes.CLIS_ID);
        elem.setValue(m_clienteSucursal);
        elem.setSelectId(m_clis_id);

        var elem = properties.item(mVentaConstantes.PRO_ID_ORIGEN);
        elem.setSelectId(m_pro_id_origen);
        elem.setValue(m_proOrigen);

        var elem = properties.item(mVentaConstantes.PRO_ID_DESTINO);
        elem.setSelectId(m_pro_id_destino);
        elem.setValue(m_proDestino);

        var elem = properties.item(mVentaConstantes.CCOS_ID);
        elem.setSelectId(m_ccos_id);
        elem.setValue(m_centroCosto);

        var elem = properties.item(mVentaConstantes.RV_ORDEN_COMPRA);
        elem.setValue(m_ordenCompra);

        var elem = properties.item(mVentaConstantes.LGJ_ID);
        elem.setSelectId(m_lgj_id);
        elem.setValue(m_legajo);

        var elem = properties.item(mVentaConstantes.RV_RETIRO);
        elem.setValue(m_retiro);

        var elem = properties.item(mVentaConstantes.RV_GUIA);
        elem.setValue(m_guia);

        var elem = properties.item(mVentaConstantes.LD_ID);
        elem.setSelectId(m_ld_id);
        elem.setValue(m_listaDescuento);

        var elem = properties.item(mVentaConstantes.TRANS_ID);
        elem.setValue(m_transporte);
        elem.setSelectId(m_trans_id);

        var elem = properties.item(mVentaConstantes.CHOF_ID);
        elem.setValue(m_chofer);
        elem.setSelectId(m_chof_id);

        var elem = properties.item(mVentaConstantes.CAM_ID);
        elem.setValue(m_camion);
        elem.setSelectId(m_cam_id);

        var elem = properties.item(mVentaConstantes.CAM_ID_SEMI);
        elem.setValue(m_semi);
        elem.setSelectId(m_cam_id_semi);

        var elem = properties.item(mVentaConstantes.RV_DESTINATARIO);
        elem.setValue(m_destinatario);

        var elem = properties.item(c_ClienteDataAdd);

        var elem = properties.add(null);

        var elem = properties.add(null);

        var elem = properties.item(mVentaConstantes.RV_SUBTOTAL);
        elem.setValue(m_subTotal);

        var elem = properties.item(mVentaConstantes.RV_IMPORTEDESC1);
        elem.setValue(m_importeDesc1);

        var elem = properties.item(mVentaConstantes.RV_IMPORTEDESC2);
        elem.setValue(m_importeDesc2);

        var elem = properties.item(mVentaConstantes.RV_NETO);
        elem.setValue(m_neto);

        var elem = properties.item(mVentaConstantes.RV_IVARI);
        elem.setValue(m_ivari);

        var elem = properties.item(mVentaConstantes.RV_IVARNI);
        elem.setValue(m_ivarni);

        var elem = properties.item(mVentaConstantes.RV_TOTAL);
        elem.setValue(m_total);

        return m_dialog.showValues(properties);
      };

      // Cotizacion
      var pGetCotizacion = function() {
        return m_dialog.getProperties().item(mVentaConstantes.RV_COTIZACION);
      };

      var pShowCotizacion = function() {
        var monId = null;
        var dDate = null;
        var iProp = null;

        if(m_id === Cairo.Constants.NO_ID) {
          if(m_lastDoc === Cairo.Constants.NO_ID) { return; }
          if(!Cairo.Database.getData(mVentaConstantes.DOCUMENTO, mVentaConstantes.DOC_ID, m_lastDoc, mVentaConstantes.MON_ID, monId)) { return; }
        }
        else {
          monId = m_mon_id;
        }

        iProp = pGetCotizacion();
        iProp.setVisible(monId !== GetMonedaDefault);

        if(m_lastMonIdCotizacion !== monId || iProp.getValue() === 0) {
          dDate = pGetFecha();
          if(!IsDate(dDate)) { dDate = Date; }
          iProp.setValue(cMoneda.getCotizacion(monId, dDate));
          m_lastFecha = dDate;
          m_lastMonIdCotizacion = monId;
        }

        m_dialog.showValue(iProp);
      };

      var setGridItems = function(property) {
        var prId = null;
        var oCol = null;
        var iCol = null;

        // HIDECOLS
        //
        var bColVisible = null;
        bColVisible = Cairo.Util.val(m_dialog.getProperties().item(c_HideCols).getValue()) === 0;

        var w_grid = property.getGrid();

        w_grid.getColumns().clear();
        w_grid.getRows().clear();

        var w_columns = w_grid.getColumns();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_RVI_ID);

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
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setWidth(1200);
        elem.setKey(KI_DESCRIP);

        var elem = w_columns.add(null);
        //'Cantidad
        elem.setName(Cairo.Language.getText(1374, ""));
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());
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
        elem.setVisible(m_bShowStockData);

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
        elem.setVisible(m_bShowStockData);

        var elem = w_columns.add(null);
        //'Descuento
        elem.setName(Cairo.Language.getText(1585, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
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
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
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
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KI_PRECIO_USR);
        elem.setEnabled(SecurityCanAccessSilent(csPreVtaEditPriceRem));

        var elem = w_columns.add(null);
        //'Precio c/desc.
        elem.setName(Cairo.Language.getText(1588, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(1200);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KI_PRECIO);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        //'Neto
        elem.setName(Cairo.Language.getText(1581, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setWidth(1200);
        elem.setKey(KI_NETO);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        //'IVA RI
        elem.setName(Cairo.Language.getText(1582, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setWidth(1200);
        elem.setKey(KI_IVARI);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        //'IVA RNI
        elem.setName(Cairo.Language.getText(1583, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(1200);
        elem.setKey(KI_IVARNI);
        elem.setEnabled(false);
        //' HIDECOLS
        elem.setVisible(bColVisible);

        var elem = w_columns.add(null);
        //'Importe
        elem.setName(Cairo.Language.getText(1228, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
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

        var elem = w_columns.add(null);
        //'Centro de Costo
        elem.setName(Cairo.Language.getText(1057, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTROCOSTO);
        elem.setWidth(1800);
        elem.setKey(KI_CCOS_ID);
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

        var w_rows = w_grid.getRows();

        for(var _i = 0; _i < m_data.items.length; _i += 1) {

          var elem = w_rows.add(null, rs(mVentaConstantes.RVI_ID).Value);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.RVI_ID);
          elem.setKey(KI_RVI_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.PR_NOMBRE_VENTA);
          elem.id = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.PR_ID);
          elem.setKey(KI_PR_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.RVI_DESCRIP);
          elem.setKey(KI_DESCRIP);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.RVI_CANTIDAD);
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
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.RVI_DESCUENTO);
          elem.setKey(KI_DESCUENTO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.UN_NAME);
          elem.setKey(KI_UNIDAD);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.RVI_PRECIO_LISTA);
          elem.setKey(KI_PRECIO_LP);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.RVI_PRECIO_USR);
          elem.setKey(KI_PRECIO_USR);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.RVI_PRECIO);
          elem.setKey(KI_PRECIO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.RVI_NETO);
          elem.setKey(KI_NETO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.RVI_IVARI);
          elem.setKey(KI_IVARI);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.RVI_IVARNI);
          elem.setKey(KI_IVARNI);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.RVI_IMPORTE);
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

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.CCOS_NAME);
          elem.id = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.CCOS_ID);
          elem.setKey(KI_CCOS_ID);

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
          elem.id = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.RVI_ID);
          elem.setKey(KI_GRUPO);

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
          if(curGroup !== Cairo.Database.valField(m_data.items[_i], mVentaConstantes.RVI_ID)) {

            pSetNrosSerieInRow(curGroup, nrosSerie);
            nrosSerie = "";

            curGroup = Cairo.Database.valField(m_data.items[_i], mVentaConstantes.RVI_ID);
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

        var apiPath = Cairo.Database.getAPIVersion();
        return Cairo.Database.getData("load[" + apiPath + "general/remitoventa]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== Cairo.Constants.NO_ID) {

              m_id = Cairo.Database.valField(response.data, mVentaConstantes.RV_ID);
              m_numero = Cairo.Database.valField(response.data, mVentaConstantes.RV_NUMERO);
              m_nrodoc = Cairo.Database.valField(response.data, mVentaConstantes.RV_NRODOC);
              m_descrip = Cairo.Database.valField(response.data, mVentaConstantes.RV_DESCRIP);
              m_fecha = Cairo.Database.valField(response.data, mVentaConstantes.RV_FECHA);
              m_fechaentrega = Cairo.Database.valField(response.data, mVentaConstantes.RV_FECHAENTREGA);
              m_neto = Cairo.Database.valField(response.data, mVentaConstantes.RV_NETO);
              m_ivari = Cairo.Database.valField(response.data, mVentaConstantes.RV_IVARI);
              m_ivarni = Cairo.Database.valField(response.data, mVentaConstantes.RV_IVARNI);
              m_total = Cairo.Database.valField(response.data, mVentaConstantes.RV_TOTAL);
              m_subTotal = Cairo.Database.valField(response.data, mVentaConstantes.RV_SUBTOTAL);
              m_descuento1 = Cairo.Database.valField(response.data, mVentaConstantes.RV_DESCUENTO1);
              m_descuento2 = Cairo.Database.valField(response.data, mVentaConstantes.RV_DESCUENTO2);
              m_importeDesc1 = Cairo.Database.valField(response.data, mVentaConstantes.RV_IMPORTEDESC1);
              m_importeDesc2 = Cairo.Database.valField(response.data, mVentaConstantes.RV_IMPORTEDESC2);
              m_cli_id = Cairo.Database.valField(response.data, mVentaConstantes.CLI_ID);
              m_cliente = Cairo.Database.valField(response.data, mVentaConstantes.CLI_NAME);
              m_ccos_id = Cairo.Database.valField(response.data, mVentaConstantes.CCOS_ID);
              m_centroCosto = Cairo.Database.valField(response.data, mVentaConstantes.CCOS_NAME);
              m_suc_id = Cairo.Database.valField(response.data, mVentaConstantes.SUC_ID);
              m_sucursal = Cairo.Database.valField(response.data, mVentaConstantes.SUC_NAME);
              m_doc_id = Cairo.Database.valField(response.data, mVentaConstantes.DOC_ID);
              m_documento = Cairo.Database.valField(response.data, mVentaConstantes.DOC_NAME);
              m_doct_id = Cairo.Database.valField(response.data, mVentaConstantes.DOCT_ID);
              m_lp_id = Cairo.Database.valField(response.data, mVentaConstantes.LP_ID);
              m_listaPrecio = Cairo.Database.valField(response.data, mVentaConstantes.LP_NAME);
              m_cpg_id = Cairo.Database.valField(response.data, mVentaConstantes.CPG_ID);
              m_condicionPago = Cairo.Database.valField(response.data, mVentaConstantes.CPG_NAME);
              m_ld_id = Cairo.Database.valField(response.data, mVentaConstantes.LD_ID);
              m_listaDescuento = Cairo.Database.valField(response.data, mVentaConstantes.LD_NAME);
              m_creado = Cairo.Database.valField(response.data, Cairo.Constants.CREADO);
              m_modificado = Cairo.Database.valField(response.data, Cairo.Constants.MODIFICADO);
              m_modifico = Cairo.Database.valField(response.data, Cairo.Constants.MODIFICO);
              m_est_id = Cairo.Database.valField(response.data, C.EST_ID);
              m_estado = Cairo.Database.valField(response.data, Cairo.Constants.EST_NAME);
              m_firmado = Cairo.Database.valField(response.data, mVentaConstantes.RV_FIRMADO);
              m_cotizacion = Cairo.Database.valField(response.data, mVentaConstantes.RV_COTIZACION);

              m_ven_id = Cairo.Database.valField(response.data, mVentaConstantes.VEN_ID);
              m_vendedor = Cairo.Database.valField(response.data, mVentaConstantes.VEN_NAME);
              m_lgj_id = Cairo.Database.valField(response.data, mVentaConstantes.LGJ_ID);
              m_legajo = Cairo.Database.valField(response.data, mVentaConstantes.LGJ_CODE);
              m_pro_id_origen = Cairo.Database.valField(response.data, mVentaConstantes.PRO_ID_ORIGEN);
              m_proOrigen = Cairo.Database.valField(response.data, "ProOrigen");
              m_pro_id_destino = Cairo.Database.valField(response.data, mVentaConstantes.PRO_ID_DESTINO);
              m_proDestino = Cairo.Database.valField(response.data, "ProDestino");
              m_trans_id = Cairo.Database.valField(response.data, mVentaConstantes.TRANS_ID);
              m_transporte = Cairo.Database.valField(response.data, mVentaConstantes.TRANS_NAME);

              m_clis_id = Cairo.Database.valField(response.data, mVentaConstantes.CLIS_ID);
              m_clienteSucursal = Cairo.Database.valField(response.data, mVentaConstantes.CLIS_NAME);

              m_chof_id = Cairo.Database.valField(response.data, mVentaConstantes.CHOF_ID);
              m_chofer = Cairo.Database.valField(response.data, mVentaConstantes.CHOF_NAME);

              m_cam_id = Cairo.Database.valField(response.data, mVentaConstantes.CAM_ID);
              m_camion = Cairo.Database.valField(response.data, mVentaConstantes.CAM_PATENTE);

              m_cam_id_semi = Cairo.Database.valField(response.data, mVentaConstantes.CAM_ID_SEMI);
              m_semi = Cairo.Database.valField(response.data, mVentaConstantes.CAM_PATENTESEMI);

              m_docEditable = Cairo.Database.valField(response.data, Cairo.Constants.DOC_EDITABLE);
              m_docEditMsg = Cairo.Database.valField(response.data, Cairo.Constants.DOCEDIT_MSG);

              m_retiro = Cairo.Database.valField(response.data, mVentaConstantes.RV_RETIRO);
              m_guia = Cairo.Database.valField(response.data, mVentaConstantes.RV_GUIA);
              m_destinatario = Cairo.Database.valField(response.data, mVentaConstantes.RV_DESTINATARIO);

              m_ordenCompra = Cairo.Database.valField(response.data, mVentaConstantes.RV_ORDEN_COMPRA);

              // Lote
              //
              m_depf_id = Cairo.Database.valField(response.data, mVentaConstantes.DEPF_ID);
              m_depl_id = Cairo.Database.valField(response.data, mVentaConstantes.DEPL_ID);
              m_deposito = Cairo.Database.valField(response.data, mVentaConstantes.DEPL_NAME);

              // Para ver documentos auxiliares
              //
              m_st_id = Cairo.Database.valField(response.data, mVentaConstantes.ST_ID);
              m_st_id_consumo = Cairo.Database.valField(response.data, mVentaConstantes.ST_ID_CONSUMO);
              m_st_id_consumoTemp = Cairo.Database.valField(response.data, mVentaConstantes.ST_ID_CONSUMO_TEMP);
              m_st_id_producido = Cairo.Database.valField(response.data, mVentaConstantes.ST_ID_PRODUCIDO);

              m_taPropuesto = Cairo.Database.valField(response.data, Cairo.Constants.TA__PROPUESTO);
              m_taMascara = Cairo.Database.valField(response.data, Cairo.Constants.TA__MASCARA);

              m_bIva = Cairo.Database.valField(response.data, mVentaConstantes.BIVA_RI);
              m_bIvaRni = Cairo.Database.valField(response.data, mVentaConstantes.BIVA_RNI);

              m_lastDoc = m_doc_id;
              //' nrs devolucion
              m_lastDoctId = m_doct_id;
              m_lastCli = m_cli_id;
              m_lastTrans = m_trans_id;
              m_lastChof = m_chof_id;
              m_lastDocName = m_documento;
              m_lastCliName = m_cliente;

              m_mon_id = Cairo.Database.valField(response.data, mVentaConstantes.MON_ID);
              m_lastMonIdCotizacion = m_mon_id;
              m_lastFecha = m_fecha;

            }
            else {
              m_id = Cairo.Constants.NO_ID;
              m_numero = 0;
              m_nrodoc = "";
              m_descrip = "";
              m_fecha = VDGetDateById(csDateEnum.cSTODAY);
              m_fechaentrega = VDGetDateById(csDateEnum.cSTOMORROW);
              m_neto = 0;
              m_ivari = 0;
              m_ivarni = 0;
              m_total = 0;
              m_subTotal = 0;
              m_descuento1 = 0;
              m_descuento2 = 0;
              m_importeDesc1 = 0;
              m_importeDesc2 = 0;
              m_cli_id = Cairo.Constants.NO_ID;
              m_cliente = "";
              m_ccos_id = Cairo.Constants.NO_ID;
              m_centroCosto = "";
              m_doc_id = Cairo.Constants.NO_ID;
              m_documento = "";
              m_doct_id = Cairo.Constants.NO_ID;
              m_lp_id = Cairo.Constants.NO_ID;
              m_ld_id = Cairo.Constants.NO_ID;
              m_cpg_id = Cairo.Constants.NO_ID;
              m_condicionPago = "";
              m_listaPrecio = "";
              m_listaDescuento = "";
              m_creado = Cairo.Constants.cSNODATE;
              m_modificado = Cairo.Constants.cSNODATE;
              m_modifico = 0;
              m_est_id = Cairo.Constants.NO_ID;
              m_estado = "";
              m_suc_id = cUtil.getUser().getSuc_id();
              m_sucursal = cUtil.getUser().getSucursal();
              m_firmado = false;
              m_cotizacion = 0;

              m_retiro = "";
              m_guia = "";
              m_destinatario = "";
              m_ordenCompra = "";

              m_clis_id = Cairo.Constants.NO_ID;
              m_clienteSucursal = "";

              m_chof_id = Cairo.Constants.NO_ID;
              m_chofer = "";

              m_cam_id = Cairo.Constants.NO_ID;
              m_camion = "";

              m_cam_id_semi = Cairo.Constants.NO_ID;
              m_semi = "";

              m_ven_id = Cairo.Constants.NO_ID;
              m_vendedor = "";
              m_lgj_id = Cairo.Constants.NO_ID;
              m_legajo = "";
              m_pro_id_origen = Cairo.Constants.NO_ID;
              m_proOrigen = "";
              m_pro_id_destino = Cairo.Constants.NO_ID;
              m_proDestino = "";
              m_trans_id = Cairo.Constants.NO_ID;
              m_transporte = "";

              // Lote
              //
              m_depf_id = Cairo.Constants.NO_ID;
              m_depl_id = Cairo.Constants.NO_ID;
              m_deposito = "";

              // Para ver documentos auxiliares
              //
              m_st_id = Cairo.Constants.NO_ID;
              m_st_id_consumo = Cairo.Constants.NO_ID;
              m_st_id_consumoTemp = Cairo.Constants.NO_ID;
              m_st_id_producido = Cairo.Constants.NO_ID;

              m_taPropuesto = false;
              m_taMascara = "";

              m_doc_id = m_lastDoc;
              //' nrs devolucion
              m_doct_id = m_lastDoctId;
              m_cli_id = m_lastCli;
              m_cliente = m_lastCliName;
              m_documento = m_lastDocName;

              m_lastTrans = Cairo.Constants.NO_ID;
              m_lastChof = Cairo.Constants.NO_ID;

              m_bIvaRni = false;
              m_bIva = false;

              m_mon_id = Cairo.Constants.NO_ID;
              m_lastMonIdCotizacion = Cairo.Constants.NO_ID;
              m_lastFecha = Cairo.Constants.cSNODATE;

              // Cotizacion
              if(m_doc_id !== Cairo.Constants.NO_ID) {
                m_cotizacion = DocGetCotizacion(m_doc_id, m_fecha);
              }

              DocEditableGet(m_doc_id, m_docEditable, m_docEditMsg, csPreVtaNewRemito);
            }

            return true;
          });
      };

      var setCIEditGenericDoc_Footer = function(rhs) {
        m_footer = rhs;

        if(rhs === null) { Exit Property; }

        m_footer.setIsDocument(true);
        m_footer.setIsFooter(true);
        m_footer.setObjForm(m_dialog.getObjForm());
      };

      var setCIEditGenericDoc_Items = function(rhs) {
        m_items = rhs;

        if(rhs === null) { Exit Property; }

        m_items.setIsDocument(true);
        m_items.setIsItems(true);
        m_items.setObjForm(m_dialog.getObjForm());
      };

      var pSaveItems = function(id) {

        // Generales
        //
        var transaction = new Cairo.Database.Transaction();
        var iOrden = null;
        var row = null;
        var cell = null;

        // Para numeros de serie
        //
        var iOrden2 = null;
        var grupo = null;
        var prId = null;

        var _count = m_items.getProperties().item(C_ITEMS).getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = m_items.getProperties().item(C_ITEMS).getGrid().getRows().item(_i);

          var register = new Cairo.Database.Register();
          register.setFieldId(mVentaConstantes.RVI_TMPID);
          register.setTable(mVentaConstantes.REMITOVENTAITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var w_var fields = register.getFields();

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KI_RVI_ID:
                var apiPath = Cairo.Database.getAPIVersion();
                register.setPath(apiPath + "general/remitoventa");

                if(m_copy) {
                  w_fields.add(mVentaConstantes.RVI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.integer);
                }
                else {
                  w_fields.add(mVentaConstantes.RVI_ID, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.integer);
                }
                break;

              case KI_CANTIDAD:
                w_fields.add(mVentaConstantes.RVI_CANTIDAD, cell.getValue(), Cairo.Constants.Types.double);
                break;

              case KI_DESCRIP:
                w_fields.add(mVentaConstantes.RVI_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);
                break;

              case KI_PRECIO:
                w_fields.add(mVentaConstantes.RVI_PRECIO, cell.getValue(), Cairo.Constants.Types.currency);
                break;

              case KI_PRECIO_LP:
                w_fields.add(mVentaConstantes.RVI_PRECIO_LISTA, cell.getValue(), Cairo.Constants.Types.currency);
                break;

              case KI_PRECIO_USR:
                w_fields.add(mVentaConstantes.RVI_PRECIO_USR, cell.getValue(), Cairo.Constants.Types.currency);
                break;

              case KI_DESCUENTO:
                w_fields.add(mVentaConstantes.RVI_DESCUENTO, cell.getValue(), Cairo.Constants.Types.text);
                break;

              case KI_IMPORTE:
                w_fields.add(mVentaConstantes.RVI_IMPORTE, cell.getValue(), Cairo.Constants.Types.currency);
                break;

              case KI_NETO:
                w_fields.add(mVentaConstantes.RVI_NETO, cell.getValue(), Cairo.Constants.Types.currency);
                break;

              case KI_IVARI:
                if(m_bIva) {
                  w_fields.add(mVentaConstantes.RVI_IVARI, cell.getValue(), Cairo.Constants.Types.currency);
                }
                break;

              case KI_IVARNI:
                if(m_bIvaRni) {
                  w_fields.add(mVentaConstantes.RVI_IVARNI, cell.getValue(), Cairo.Constants.Types.currency);
                }
                break;

              case KI_IVARIPERCENT:
                w_fields.add(mVentaConstantes.RVI_IVARIPORC, cell.getValue(), Cairo.Constants.Types.double);
                break;

              case KI_IVARNIPERCENT:
                w_fields.add(mVentaConstantes.RVI_IVARNIPORC, cell.getValue(), Cairo.Constants.Types.double);
                break;

              case KI_PR_ID:
                prId = cell.getId();
                w_fields.add(mVentaConstantes.PR_ID, prId, Cairo.Constants.Types.id);
                break;

              case KI_CCOS_ID:
                w_fields.add(mVentaConstantes.CCOS_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KI_GRUPO:
                grupo = cell.getId();

                // Lote
                //
                break;

              case KI_STL_ID:
                w_fields.add(mVentaConstantes.STL_ID, cell.getId(), Cairo.Constants.Types.id);
                break;
            }
          }

          iOrden = iOrden + 1;

          w_fields.add(mVentaConstantes.RVI_ORDEN, iOrden, Cairo.Constants.Types.integer);
          w_fields.add(mVentaConstantes.RV_TMPID, id, Cairo.Constants.Types.id);

          w_fields.setHaveLastUpdate(false);
          w_fields.setHaveWhoModify(false);

          transaction.addRegister(register);

          // Si es nuevo se usa el orden
          if(grupo === 0) { grupo = iOrden * -1; }
          if(!pSaveItemNroSerie(row, iOrden2, prId, id, register.getID(), grupo)) { return false; }
        }

        if(m_itemsDeleted !== "" && m_id !== Cairo.Constants.NO_ID && !m_copy) {

          var vDeletes = null;
          var i = null;

          m_itemsDeleted = RemoveLastColon(m_itemsDeleted);
          vDeletes = Split(m_itemsDeleted, ",");

          for (i = 0; i <= vDeletes.Length; i++) {

            var register = new Cairo.Database.Register();
            register.setFieldId(mVentaConstantes.RVIB_TMPID);
            register.setTable(mVentaConstantes.REMITOVENTAITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            var w_var fields = register.getFields();
            w_fields.add(mVentaConstantes.RVI_ID, Cairo.Util.val(vDeletes(i)), Cairo.Constants.Types.integer);
            w_fields.add(mVentaConstantes.RV_ID, m_id, Cairo.Constants.Types.id);
            w_fields.add(mVentaConstantes.RV_TMPID, id, Cairo.Constants.Types.id);

            w_fields.setHaveLastUpdate(false);
            w_fields.setHaveWhoModify(false);

            transaction.addRegister(register);
          }

        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      // Reglas del Objeto de Negocios
      var pDocDesdePedido = function() {
        var doc = null;
        var rtn = null;
        var docId = null;

        // Si todavia no se cargo el form no se que
        // documento es, asi que no puede ser sobre pedido
        if(m_dialog.getProperties().item(mVentaConstantes.DOC_ID) === null) { return false; }

        docId = m_dialog.getProperties().item(mVentaConstantes.DOC_ID).getSelectId();

        // Si no hay un documento activo no se hace nada
        if(docId === Cairo.Constants.NO_ID) { return false; }

        doc = new cDocumento();

        return doc.GetData(docId, mVentaConstantes.DOC_RV_DESDE_PV, Cairo.Constants.Types.boolean);
      };

      var pDocDescargaBOM = function() {
        var doc = null;
        var rtn = null;
        var docId = null;

        // Si todavia no se cargo el form no se que
        // documento es, asi que no puede ser sobre pedido
        if(m_dialog.getProperties().item(mVentaConstantes.DOC_ID) === null) { return false; }

        docId = m_dialog.getProperties().item(mVentaConstantes.DOC_ID).getSelectId();

        // Si no hay un documento activo no se hace nada
        if(docId === Cairo.Constants.NO_ID) { return false; }

        doc = new cDocumento();

        return doc.GetData(docId, mVentaConstantes.DOC_RV_BOM, Cairo.Constants.Types.boolean);
      };

      var pDocDesdeOrden = function() {
        var doc = null;
        var rtn = null;
        var docId = null;

        // Si todavia no se cargo el form no se que
        // documento es, asi que no puede ser sobre pedido
        if(m_dialog.getProperties().item(mVentaConstantes.DOC_ID) === null) { return false; }

        docId = m_dialog.getProperties().item(mVentaConstantes.DOC_ID).getSelectId();

        // Si no hay un documento activo no se hace nada
        if(docId === Cairo.Constants.NO_ID) { return false; }

        doc = new cDocumento();

        return doc.GetData(docId, mVentaConstantes.DOC_RV_DESDE_OS, Cairo.Constants.Types.boolean);
      };

      var pShowImporteAndIva = function(row) { // TODO: Use of ByRef founded Private Sub pShowImporteAndIva(ByRef Row As CSInterfacesABM.cIABMGridRow)
        var importe = null;
        var neto = null;
        var ivaRi = null;
        var ivaRni = null;

        neto = Cairo.Util.val(Dialogs.cell(row, KI_CANTIDAD).getValue()) * Cairo.Util.val(Dialogs.cell(row, KI_PRECIO).getValue());
        if(m_bIva) {
          ivaRi = (neto * Cairo.Util.val(Dialogs.cell(row, KI_IVARIPERCENT).getValue())) / 100;
        }
        if(m_bIvaRni) {
          ivaRni = (neto * Cairo.Util.val(Dialogs.cell(row, KI_IVARNIPERCENT).getValue())) / 100;
        }
        importe = neto + ivaRi + ivaRni;

        Dialogs.cell(row, KI_NETO).getValue() === neto;
        Dialogs.cell(row, KI_IVARI).getValue() === ivaRi;
        Dialogs.cell(row, KI_IVARNI).getValue() === ivaRni;
        Dialogs.cell(row, KI_IMPORTE).getValue() === importe;
      };

      var pShowTotales = function(rows) { // TODO: Use of ByRef founded Private Sub pShowTotales(ByRef Rows As CSInterfacesABM.cIABMGridRows)
        var neto = null;
        var ivaRi = null;
        var ivaRni = null;
        var desc1 = null;
        var desc2 = null;

        var row = null;

        var _count = rows.size();
        for (var _i = 0; _i < _count; _i++) {
          row = rows.item(_i);
          neto = neto + Cairo.Util.val(Dialogs.cell(row, KI_NETO).getValue());
          ivaRi = ivaRi + Cairo.Util.val(Dialogs.cell(row, KI_IVARI).getValue());
          ivaRni = ivaRni + Cairo.Util.val(Dialogs.cell(row, KI_IVARNI).getValue());
        }

        var properties = m_footer.getProperties();
        properties.item(mVentaConstantes.RV_SUBTOTAL).setValue(neto);

        desc1 = m_dialog.getProperties().item(mVentaConstantes.RV_DESCUENTO1).getValue();
        desc2 = m_dialog.getProperties().item(mVentaConstantes.RV_DESCUENTO2).getValue();

        ivaRi = ivaRi - (ivaRi * desc1 / 100);
        ivaRni = ivaRni - (ivaRni * desc1 / 100);

        ivaRi = ivaRi - (ivaRi * desc2 / 100);
        ivaRni = ivaRni - (ivaRni * desc2 / 100);

        desc1 = neto * desc1 / 100;
        properties.item(mVentaConstantes.RV_IMPORTEDESC1).setValue(desc1);

        neto = neto - desc1;

        desc2 = neto * desc2 / 100;
        properties.item(mVentaConstantes.RV_IMPORTEDESC2).setValue(desc2);

        neto = neto - desc2;

        properties.item(mVentaConstantes.RV_NETO).setValue(neto);
        properties.item(mVentaConstantes.RV_IVARI).setValue(ivaRi);
        properties.item(mVentaConstantes.RV_IVARNI).setValue(ivaRni);
        properties.item(mVentaConstantes.RV_TOTAL).setValue(neto + ivaRni + ivaRi);

        m_footer.refreshControls();
      };

      var pSetTasasImpositivas = function(row,  pr_id,  pr_nombre) { // TODO: Use of ByRef founded Private Sub pSetTasasImpositivas(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal pr_id As Long, ByVal pr_nombre As String)
        var ti_ri = null;
        var ti_rni = null;

        if(pr_id === 0) { return; }

        if(!GetTasaFromProducto(pr_id, ti_ri, ti_rni, false)) { return; }

        if(ti_ri === 0) {
          MsgWarning(Cairo.Language.getText(1597, "", pr_nombre));
          //El producto [" & pr_nombre & "] no tiene definida su tasa impositiva de ventas para el iva responsable inscripto
          return;
        }

        if(ti_rni === 0) {
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
            Dialogs.cell(row, KI_IVARIPERCENT).getValue() === Cairo.Database.valField(rs.getFields(), mVentaConstantes.TI_PORCENTAJE);
          }
        }
        else {
          Dialogs.cell(row, KI_IVARIPERCENT).getValue() === 0;
        }

        if(m_bIvaRni) {
          sqlstmt = "select ti_porcentaje,cue_id from tasaimpositiva where ti_id = "+ ti_rni.toString();
          if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

          if(!rs.isEOF()) {
            Dialogs.cell(row, KI_IVARNIPERCENT).getValue() === Cairo.Database.valField(rs.getFields(), mVentaConstantes.TI_PORCENTAJE);
          }
        }
        else {
          Dialogs.cell(row, KI_IVARNIPERCENT).getValue() === 0;
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

          Dialogs.cell(row, KI_UNIDAD).getValue() === Cairo.Database.valField(rs.getFields(), "unidadVenta");

          var w_pCell = Dialogs.cell(row, KI_CCOS_ID);
          w_pCell.setValue(Cairo.Database.valField(rs.getFields(), "centro_costo_venta"));
          w_pCell.setId(Cairo.Database.valField(rs.getFields(), mVentaConstantes.CCOS_ID_VENTA));

          // Si el documento no mueve stock no se exigen los numeros de serie
          //
          if(m_bShowStockData) {
            Dialogs.cell(row, KI_PR_LLEVANROSERIE).getID() === Cairo.Database.valField(rs.getFields(), mVentaConstantes.PR_LLEVA_NRO_SERIE);

            // Lote
            //
            Dialogs.cell(row, KI_PR_LLEVALOTE).getID() === Cairo.Database.valField(rs.getFields(), mVentaConstantes.PR_LLEVA_NRO_LOTE);

            // Lote Fifo
            //
            Dialogs.cell(row, KI_PR_LOTEFIFO).getID() === Cairo.Database.valField(rs.getFields(), mVentaConstantes.PR_LOTE_FIFO);

          }
          else {
            Dialogs.cell(row, KI_PR_LLEVANROSERIE).getID() === false;

            // Lote
            //
            Dialogs.cell(row, KI_PR_LLEVALOTE).getID() === false;

            // Lote Fifo
            //
            Dialogs.cell(row, KI_PR_LOTEFIFO).getID() === false;
          }

          Dialogs.cell(row, KI_ES_KIT).getID() === bEsKit;

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
        if(bChanged || Dialogs.cell(row, KI_PR_LLEVANROSERIE).getID() === 0) {

          Dialogs.cell(row, KI_NROSERIE).getValue() === "";
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
        if(pDocDesdePedido() && m_id === Cairo.Constants.NO_ID) {
          bState = false;
        }
        else if(pDocDesdeOrden() && m_id === Cairo.Constants.NO_ID) {
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
              if(prop.getKey() !== K_NRODOC) {
                prop.setEnabled(bState);
              }
              else {
                prop.setEnabled(m_taPropuesto);
              }
            }
            else {
              prop.setEnabled(false);
            }
          }
        }

        if(bState) {
          var properties = m_dialog.getProperties();
          properties.item(mVentaConstantes.DEPL_ID_ORIGEN).setEnabled(m_bShowStockData);
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

      var pSetDatosCliente = function() {
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

        var property = m_dialog.getProperties().item(mVentaConstantes.CLI_ID);
        if(m_lastCli === property.getSelectId()) {
          return;
        }
        m_lastCli = property.getSelectId();

        if(!GetClienteDataEx2(m_lastCli, lp_id, ld_id, cpg_id, trans_id, pro_id, ven_id, trans_nombre, pro_nombre, ven_nombre, m_lastDoc)) { return; }

        // Condicion de pago
        if(cpg_id !== Cairo.Constants.NO_ID) {

          if(!Cairo.Database.getData(mVentaConstantes.CONDICIONPAGO, mVentaConstantes.CPG_ID, cpg_id, mVentaConstantes.CPG_NAME, cpg_nombre)) { return; }

          iProp = m_dialog.getProperties().item(mVentaConstantes.CPG_ID);
          iProp.setValue(cpg_nombre);
          iProp.setSelectId(cpg_id);
          m_dialog.showValue(iProp);
        }

        // Lista de precios
        iProp = m_dialog.getProperties().item(mVentaConstantes.LP_ID);
        iProp.setSelectFilter(GetListaPrecioGetXCliente(m_lastDoc, m_lastCli));

        if(lp_id !== Cairo.Constants.NO_ID) {
          lP = new cListaPrecio();
          iProp.setValue(lP.GetData(lp_id, mVentaConstantes.LP_NAME, Cairo.Constants.Types.text));
          iProp.setSelectId(lp_id);
        }

        m_dialog.showValue(iProp);

        // Lista de descuentos
        iProp = m_dialog.getProperties().item(mVentaConstantes.LD_ID);
        iProp.setSelectFilter(GetListaDescGetXCliente(m_lastDoc, m_lastCli));

        if(ld_id !== Cairo.Constants.NO_ID) {
          lD = new cListaDescuento();
          iProp.setValue(lD.GetData(ld_id, mVentaConstantes.LD_NAME, Cairo.Constants.Types.text));
          iProp.setSelectId(ld_id);
        }

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
          pSetDatosTransporte();
        }
        if(pro_id !== Cairo.Constants.NO_ID) {
          iProp = m_dialog.getProperties().item(mVentaConstantes.PRO_ID_DESTINO);
          iProp.setValue(pro_nombre);
          iProp.setSelectId(pro_id);
          m_dialog.showValue(iProp);
        }

        iProp = m_dialog.getProperties().item(mVentaConstantes.CLIS_ID);
        iProp.setSelectFilter(GetHelpFilterCliSuc(m_lastCli));

        m_dialog.showValue(iProp);
        //////////////////////////////////////////////////////////////

        // Talonario y Categoria fiscal
        pGetIvaFromCliente(m_lastCli);

        m_dialog.showValue(iProp);
      };

      var pGetIvaFromCliente = function(cli_id) {
        var sqlstmt = null;
        var rs = null;
        var bIvaChanged = null;
        var bLastIva = null;

        sqlstmt = "sp_clienteGetIva "+ cli_id.toString();
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(rs.isEOF()) { return; }

        bLastIva = m_bIva;
        m_bIva = Cairo.Database.valField(rs.getFields(), "bIva");
        if(bLastIva !== m_bIva) { bIvaChanged = true; }

        bLastIva = m_bIvaRni;
        m_bIvaRni = Cairo.Database.valField(rs.getFields(), "bIvaRni");
        if(bLastIva !== m_bIvaRni) { bIvaChanged = true; }

        if(bIvaChanged) {
          pShowTotales(m_items.getProperties().item(C_ITEMS).getGrid().getRows());
        }
      };

      var pFirmar = function() {
        var doc = null;
        var us_id = null;

        doc = new cDocumento();

        if(m_id === Cairo.Constants.NO_ID) {
          MsgWarning(Cairo.Language.getText(1592, ""));
          //Antes de poder firmar el documento debe guardarlo.
          return null;
        }

        if(m_firmado) {
          if(!Ask(Cairo.Language.getText(1593, ""), vbYes, Cairo.Language.getText(1594, ""))) {
            //El documento ya ha sido firmado desea borrar la firma, vbYes, Firmar
            return null;
          }
        }

        if(!doc.Firmar(m_doc_id, us_id)) { return false; }

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_DocRemitoVentaFirmar "+ m_id+ ","+ us_id.toString();
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

        m_est_id = Cairo.Database.valField(rs.getFields(), C.EST_ID);
        m_estado = Cairo.Database.valField(rs.getFields(), Cairo.Constants.EST_NAME);

        var iProp = null;
        iProp = m_dialog.getProperties().item(cDeclarations.getCsDocEstateID());

        iProp.setSelectId(m_est_id);
        iProp.setValue(m_estado);

        Cairo.Database.getData(mVentaConstantes.REMITOVENTA, mVentaConstantes.RV_ID, m_id, mVentaConstantes.RV_FIRMADO, m_firmado);

        m_dialog.showValue(iProp);

        return true;
      };

      var pMove = function(moveTo) {
        var sqlstmt = null;
        var rs = null;
        var doc_id = null;

        doc_id = m_dialog.getProperties().item(mVentaConstantes.DOC_ID).getSelectId();

        if(doc_id === Cairo.Constants.NO_ID) { MsgInfo(Cairo.Language.getText(1595, "")); }
        //Debe seleccionar un documento

        sqlstmt = "sp_DocRemitoVentaMover "+ moveTo+ ","+ m_numero+ ","+ doc_id.toString();

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

        // Si no obtuve ningun id al moverme
        //
        if(rs.isEOF()) {

          switch (moveTo) {

            // Si era siguiente ahora busco el ultimo
            //
            case Dialogs.Message.MSG_DOC_NEXT:
              pMove(Dialogs.Message.MSG_DOC_LAST);

              // Si era anterior ahora busco el primero
              //
              break;

            case Dialogs.Message.MSG_DOC_PREVIOUS:
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
              m_lastCli = Cairo.Constants.NO_ID;
              m_lastCliName = "";
              m_lastTrans = Cairo.Constants.NO_ID;
              m_lastChof = Cairo.Constants.NO_ID;

              // Cargo un registro vacio
              //
              load(Cairo.Constants.NO_ID);

              // Refresco el formulario
              //
              pRefreshProperties();

              // Obtengo un nuevo numero de comprobante
              //
              GetDocNumber(m_lastDoc, m_dialog, m_taPropuesto, mVentaConstantes.RV_NRODOC);

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

        var properties = m_dialog.getProperties();

        c = properties.item(mVentaConstantes.DOC_ID);
        c.setSelectId(m_doc_id);
        c.setValue(m_documento);

        c = properties.item(mVentaConstantes.RV_FECHA);
        c.setValue(m_fecha);

        c = properties.item(mVentaConstantes.RV_FECHAENTREGA);
        c.setValue(m_fechaentrega);

        c = properties.item(mVentaConstantes.CLI_ID);
        c.setSelectId(m_cli_id);
        c.setValue(m_cliente);

        c = properties.item(cDeclarations.getCsDocNumberID());
        c.setValue(m_numero);

        c = properties.item(cDeclarations.getCsDocEstateID());
        c.setValue(m_estado);

        c = properties.item(mVentaConstantes.RV_NRODOC);
        c.setValue(m_nrodoc);
        c.setTextMask(m_taMascara);
        c.setTextAlign(vbRightJustify);

        c = properties.item(mVentaConstantes.RV_DESCUENTO1);
        c.setValue(m_descuento1);

        c = properties.item(mVentaConstantes.RV_DESCUENTO2);
        c.setValue(m_descuento2);

        c = properties.item(mVentaConstantes.DEPL_ID_ORIGEN);
        if(m_depl_id !== Cairo.Constants.NO_ID || !m_bShowStockData) {
          c.setSelectId(m_depl_id);
          c.setValue(m_deposito);
        }
        else {
          // Preferencias del usuario
          //
          c.setSelectId(m_userCfg.getDeplId());
          c.setValue(m_userCfg.getDeplNombre());
          pSetStock();
        }

        c = properties.item(mVentaConstantes.CPG_ID);
        c.setSelectId(m_cpg_id);
        c.setValue(m_condicionPago);

        c = properties.item(mVentaConstantes.RV_COTIZACION);
        c.setValue(m_cotizacion);

        c = properties.item(mVentaConstantes.LP_ID);
        c.setSelectFilter(GetListaPrecioGetXCliente(m_doc_id, m_cli_id));
        c.setSelectId(m_lp_id);
        c.setValue(m_listaPrecio);

        c = properties.item(mVentaConstantes.LD_ID);
        c.setSelectFilter(GetListaDescGetXCliente(m_doc_id, m_cli_id));
        c.setSelectId(m_ld_id);
        c.setValue(m_listaDescuento);

        c = properties.item(mVentaConstantes.CCOS_ID);
        c.setSelectId(m_ccos_id);
        c.setValue(m_centroCosto);

        c = properties.item(mVentaConstantes.SUC_ID);
        c.setSelectId(m_suc_id);
        c.setValue(m_sucursal);

        c = properties.item(mVentaConstantes.VEN_ID);
        c.setSelectId(m_ven_id);
        c.setValue(m_vendedor);

        c = properties.item(mVentaConstantes.RV_DESCRIP);
        c.setValue(m_descrip);

        c = properties.item(mVentaConstantes.LGJ_ID);
        c.setSelectId(m_lgj_id);
        c.setValue(m_legajo);

        c = properties.item(mVentaConstantes.PRO_ID_ORIGEN);
        c.setSelectId(m_pro_id_origen);
        c.setValue(m_proOrigen);

        c = properties.item(mVentaConstantes.PRO_ID_DESTINO);
        c.setSelectId(m_pro_id_destino);
        c.setValue(m_proDestino);

        c = properties.item(mVentaConstantes.TRANS_ID);
        c.setSelectId(m_trans_id);
        c.setValue(m_transporte);

        c = properties.item(mVentaConstantes.RV_RETIRO);
        c.setValue(m_retiro);

        c = properties.item(mVentaConstantes.RV_GUIA);
        c.setValue(m_guia);

        c = properties.item(mVentaConstantes.RV_DESTINATARIO);
        c.setValue(m_destinatario);

        c = properties.item(mVentaConstantes.RV_ORDEN_COMPRA);
        c.setValue(m_ordenCompra);

        c = properties.item(mVentaConstantes.CLIS_ID);
        c.setSelectId(m_clis_id);
        c.setValue(m_clienteSucursal);

        c = properties.item(mVentaConstantes.CHOF_ID);
        c.setSelectId(m_chof_id);
        c.setValue(m_chofer);
        c.setSelectFilter(mPublicTransporte.self.getHelpTransporte(m_trans_id));

        c = properties.item(mVentaConstantes.CAM_ID);
        c.setSelectId(m_cam_id);
        c.setValue(m_camion);
        c.setSelectFilter(mPublicTransporte.self.getHelpTransporte(m_trans_id));

        c = properties.item(mVentaConstantes.CAM_ID_SEMI);
        c.setSelectId(m_cam_id_semi);
        c.setValue(m_semi);
        c.setSelectFilter(mPublicTransporte.self.getHelpTransporte(m_trans_id));

        abmGen = m_dialog;
        abmGen.ShowValues(m_dialog.getProperties());

        abmGen.ResetChanged;

        c = m_items.getProperties().item(C_ITEMS);
        if(!pLoadItems(c)) { return; }

        m_itemsDeleted = "";

        abmGen = m_items;
        abmGen.ShowValues(m_items.getProperties());

        var properties = m_footer.getProperties();

        c = properties.item(mVentaConstantes.RV_SUBTOTAL);
        c.setValue(m_subTotal);

        c = properties.item(mVentaConstantes.RV_IMPORTEDESC1);
        c.setValue(m_importeDesc1);

        c = properties.item(mVentaConstantes.RV_IMPORTEDESC2);
        c.setValue(m_importeDesc2);

        c = properties.item(mVentaConstantes.RV_NETO);
        c.setValue(m_neto);

        c = properties.item(mVentaConstantes.RV_IVARI);
        c.setValue(m_ivari);

        c = properties.item(mVentaConstantes.RV_IVARNI);
        c.setValue(m_ivarni);

        c = properties.item(mVentaConstantes.RV_TOTAL);
        c.setValue(m_total);

        abmGen = m_footer;
        abmGen.ShowValues(m_footer.getProperties());

        pSetEnabled();

        pShowCotizacion();

        // DATADD
        mPublicVentas.self.showDataAddCliente(m_userCfg.getShowDataAddInVentas(), m_dialog);

      };

      var pShowApply = function() {

        if(!DoCairo.Security.anAccess(csPreVtaModifyAplic, m_doc_id, csE_DocTypePrestacion.cSEDOCTPREAPLICAR)) { return; }

        if(m_objApply === null) {
          m_objApply = new cRemitoVentaAplic();

          // Edit Apply
          //
        }
        else {
          if(m_objApply.id !== m_id) {
            m_objApply.self.setObjectClient(null);
            m_objApply = new cRemitoVentaAplic();
          }
        }

        // Edit Apply
        //
        m_objApply.self.setObjectClient(self);

        if(!m_objApply.self.show(m_id, m_total, m_nrodoc, m_cli_id, m_cliente, m_suc_id, m_doc_id, m_doct_id === csEDocumentoTipo.cSEDT_DEVOLUCIONREMITOVTA)) {
          m_objApply = null;
        }
      };

      var pShowStartWizard = function() {
        try {

          var oWizard = null;
          oWizard = new cRemitoVentaWizard();

          var mouse = null;
          mouse = new cMouseWait();

          if(!oWizard.self.load()) { return; }

          oWizard.self.setCli_id(m_cli_id);
          oWizard.self.setCliente() = m_cliente;
          oWizard.self.setPvIds() = m_pvIds;
          oWizard.self.setDoc_id() = m_lastDoc;
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

          iObjWizard.show("CSVenta2.cRemitoVentaWizard");

          oObjWizard.getObjAbm().getObjForm().ZOrder;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "pShowStartWizard", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var pShowStartWizardOrden = function() {
        try {

          var oWizard = null;
          oWizard = new cRemitoVentaOrdenWiz();

          var mouse = null;
          mouse = new cMouseWait();

          if(!oWizard.self.load()) { return; }

          oWizard.self.setCli_id(m_cli_id);
          oWizard.self.setCliente() = m_cliente;
          oWizard.self.setOsIds() = m_osIds;
          oWizard.self.setOsiIds() = m_prnsIds;
          oWizard.self.setDoc_id() = m_lastDoc;
          oWizard.self.setDocumento() = m_lastDocName;
          oWizard.self.setAutoFactura(m_bAutoFactura);
          oWizard.self.setAutoPago(m_bAutoPago);
          oWizard.self.setCue_id_autoPago(m_cue_id_autoPago);
          oWizard.self.setModoVentaCtaCte(m_modoVentaCtaCte);
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

          iObjWizard.show("CSVenta2.cRemitoVentaOrdenWiz");

          if(!oObjWizard.getObjAbm() === null) {
            oObjWizard.getObjAbm().getObjForm().ZOrder;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "pShowStartWizardOrden", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var pShowStartWizardBOM = function() {
        try {

          var oWizard = null;
          oWizard = new cRemitoVentaBOMWizard();

          var mouse = null;
          mouse = new cMouseWait();

          if(!oWizard.self.load()) { return; }

          oWizard.self.setCli_id(m_cli_id);
          oWizard.self.setCliente() = m_cliente;
          oWizard.self.setPvIds() = m_pvIds;
          oWizard.self.setDoc_id() = m_lastDoc;
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

          iObjWizard.show("CSVenta2.cRemitoVentaBOMWizard");

          oObjWizard.getObjAbm().getObjForm().ZOrder;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "pShowStartWizardBOM", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      // Construccion - Destruccion
      self.initialize = function() {
        try {

          //'Error al grabar el Remito de Venta
          c_ErrorSave = Cairo.Language.getText(2222, "");

          m_nrosSerie = new Collection();
          m_generalConfig = new cGeneralConfig();
          m_generalConfig.Load;

          // Lote
          //
          m_stockConfig = new cStockConfig();
          m_stockConfig.load();

          // Preferencias del Usuario
          //
          m_userCfg = new cUsuarioConfig();
          m_userCfg.Load;
          m_userCfg.ValidateRV;

          G.redim(m_pvIds, 0);
          G.redim(m_osIds, 0);
          G.redim(m_prnsIds, 0);

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
          G.redim(m_pvIds, 0);
          G.redim(m_osIds, 0);
          mCollection.collClear(m_nrosSerie);
          m_nrosSerie = null;
          m_generalConfig = null;

          // Lote
          //
          m_stockConfig = null;

          // Preferencias del Usuario
          //
          m_userCfg = null;

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

        m_bShowStockData = false;

        docId = m_dialog.getProperties().item(mVentaConstantes.DOC_ID).getSelectId();

        // Si el remito mueve stock
        //
        if(CBool(doc.GetData(docId, mVentaConstantes.DOC_MUEVE_STOCK, Cairo.Constants.Types.boolean))) {
          m_bShowStockData = true;
        }

        // HIDECOLS
        //
        if(!bInLoadCollection) { pShowHideCols(true); }

      };

      var pSetNrosSerieInRow = function(currGroup,  nroSerie) {
        var row = null;

        if(currGroup === 0) { return; }

        var _count = m_items.getProperties().item(C_ITEMS).getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = m_items.getProperties().item(C_ITEMS).getGrid().getRows().item(_i);
          if(Dialogs.cell(row, KI_GRUPO).getID() === currGroup) {
            Dialogs.cell(row, KI_NROSERIE).getValue() === RemoveLastColon(nroSerie);
            return;
          }
        }
      };

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////
      var pSaveItemNroSerie = function(row,  iOrden,  prId,  rvTMPId,  rviTMPId,  grupo) { // TODO: Use of ByRef founded Private Function pSaveItemNroSerie(ByRef Row As CSInterfacesABM.cIABMGridRow, ByRef iOrden As Long, ByVal PrId As Long, ByVal RvTMPId As Long, ByVal RviTMPId As Long, ByVal Grupo As Long) As Boolean

        var pt = null;
        var register = null;

        // Si lleva numero de serie
        //
        if(Dialogs.cell(row, KI_PR_LLEVANROSERIE).getID() && m_bShowStockData) {

          // Obtengo los numeros de serie y guardo un Item por cada uno
          //
          var _count = m_nrosSerie.get(GetKey(grupo)).size();
          for (var _i = 0; _i < _count; _i++) {
            pt = m_nrosSerie.get(GetKey(grupo)).item(_i);

            register = new cRegister();
            register.setFieldId(mVentaConstantes.RVIS_TMPID);
            register.setTable(mVentaConstantes.REMITOVENTAITEMSERIETMP);
            register.setId(Cairo.Constants.NEW_ID);

            var w_fields = register.getFields();
            w_fields.add2(mVentaConstantes.PR_ID, prId, Cairo.Constants.Types.id);

            if(m_copy) {
              w_fields.add2(mVentaConstantes.PRNS_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.integer);
            }
            else {
              w_fields.add2(mVentaConstantes.PRNS_ID, pt.getPrns_id(), Cairo.Constants.Types.id);
            }

            w_fields.add2(mVentaConstantes.PRNS_CODE, pt.getCodigo(), Cairo.Constants.Types.text);
            w_fields.add2(mVentaConstantes.PRNS_DESCRIP, pt.getDescrip(), Cairo.Constants.Types.text);
            w_fields.add2(mVentaConstantes.PRNS_FECHAVTO, pt.getFechaVto(), Cairo.Constants.Types.date);
            w_fields.add2(mVentaConstantes.PR_ID_ITEM, pt.getPr_id_item(), Cairo.Constants.Types.id);

            w_fields.add2(mVentaConstantes.RV_TMPID, rvTMPId, Cairo.Constants.Types.id);
            w_fields.add2(mVentaConstantes.RVI_TMPID, rviTMPId, Cairo.Constants.Types.id);

            iOrden = iOrden + 1;
            w_fields.add2(mVentaConstantes.RVIS_ORDEN, iOrden, Cairo.Constants.Types.integer);

            w_fields.setHaveLastUpdate(false);
            w_fields.setHaveWhoModify(false);

            if(!Cairo.Database.save(register, , "pSaveItemNroSerie", C_MODULE, c_ErrorSave)) { return false; }
          }
        }

        return true;
      };

      //////////////////////////////////////////////////////////////////////////////////////////////////
      // nrs devolucion
      var pGetDeplId = function() {
        var _rtn = 0;
        if(m_lastDoctId === csEDocumentoTipo.cSEDT_DEVOLUCIONREMITOVTA) {
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

      var pGetFecha = function() {
        return m_dialog.getProperties().item(mVentaConstantes.RV_FECHA).getValue();
      };

      var pSetStock = function() {

        if(m_stockConfig.getStockXFisico() || m_stockConfig.getNoControlaStock()) {

          m_depf_id = Cairo.Constants.NO_ID;

          if(!Cairo.Database.getData(mVentaConstantes.DEPOSITOLOGICO, mVentaConstantes.DEPL_ID, pGetDeplId(), mVentaConstantes.DEPF_ID, m_depf_id)) {
          }
        }

      };

      var pSetDatosTransporte = function() {
        var chof_id = null;
        var cam_id = null;
        var chofer = null;
        var camion = null;

        var iProp = null;
        var filter = null;

        var property = m_dialog.getProperties().item(mVentaConstantes.TRANS_ID);
        if(m_lastTrans === property.getSelectId()) {
          return;
        }
        m_lastTrans = property.getSelectId();

        filter = mPublicTransporte.self.getHelpTransporte(m_lastTrans);

        if(!mPublicTransporte.self.getTransporteData(m_lastTrans, chof_id, chofer, cam_id, camion)) { return; }

        // Chofer
        iProp = m_dialog.getProperties().item(mVentaConstantes.CHOF_ID);
        iProp.setSelectFilter(filter);

        if(cam_id !== Cairo.Constants.NO_ID) {

          iProp.setValue(chofer);
          iProp.setSelectId(chof_id);

        }

        m_dialog.showValue(iProp);

        // Camion
        iProp = m_dialog.getProperties().item(mVentaConstantes.CAM_ID);
        iProp.setSelectFilter(filter);

        if(cam_id !== Cairo.Constants.NO_ID) {

          iProp.setValue(camion);
          iProp.setSelectId(cam_id);

        }

        m_dialog.showValue(iProp);
      };

      var pSetDatosChofer = function() {
        var chof_id = null;
        var cam_id = null;
        var camion = null;
        var cam_id_semi = null;
        var semi = null;
        var iProp = null;

        var property = m_dialog.getProperties().item(mVentaConstantes.CHOF_ID);
        if(m_lastChof === property.getSelectId()) {
          return;
        }
        m_lastChof = property.getSelectId();

        if(!mPublicTransporte.self.getChoferData(m_lastChof, cam_id, camion, cam_id_semi, semi)) { return; }

        // Camion
        iProp = m_dialog.getProperties().item(mVentaConstantes.CAM_ID);

        if(cam_id !== Cairo.Constants.NO_ID) {

          iProp.setValue(camion);
          iProp.setSelectId(cam_id);

        }

        m_dialog.showValue(iProp);

        // Semi
        iProp = m_dialog.getProperties().item(mVentaConstantes.CAM_ID_SEMI);

        if(cam_id_semi !== Cairo.Constants.NO_ID) {

          iProp.setValue(semi);
          iProp.setSelectId(cam_id_semi);

        }

        m_dialog.showValue(iProp);
      };

      var pShowFactura = function(bPushVirtualNext) {
        try {

          var o = null;
          o = new CSVenta2.cFacturaVenta();
          o.PushVirtualNext = bPushVirtualNext;
          o.ShowFacturaRemito(m_cli_id, pGetRvIds());

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "pShowFactura", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var pGetRvIds = function() {
        var rtn() = null;
        G.redim(rtn, 1);
        rtn[1] = m_id;
        return rtn;
      };

      var pGetItems = function() {
        return m_items.getProperties().item(C_ITEMS);
      };

      // HIDECOLS
      //
      var pShowHideCols = function(bOnlyStock) {
        var columns = null;
        var bVisible = null;
        var abmObj = null;
        abmObj = m_dialog;

        if(abmObj.getInSave()) { return; }

        bVisible = Cairo.Util.val(m_dialog.getProperties().item(c_HideCols).getValue()) === 0;

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
            case KI_CCOS_ID:

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
              columns(i).Visible = m_bShowStockData;
              abmObj.RefreshColumnPropertiesByIndex(iProp, i);

              break;
          }
        }

        abmObj.DrawGrid(iProp, true);
      };
      //
      // HIDECOLS - fin

      var pGetFileNamePostFix = function() {
        return m_cliente.Substring(0, 50)+ "-"+ m_nrodoc;
      };

      var pShowMenuDocAction = function() {
        var abmObj = null;
        abmObj = m_dialog;

        var menu = null;

        menu = Cairo.Language.getText(4960, "")+ "~6|"+ Cairo.Language.getText(4961, "")+ "~7|"+ Cairo.Language.getText(4962, "")+ "~8";
        // Facturar el Documento|Facturar el Documento Automaticamente|Cancelar el Documento

        abmObj.ShowPopMenu(menu);
      };

      var pCancelarRemito = function() {
        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_DocRemitoVentaCancelar "+ cUtil.getUser().getId().toString()+ ","+ cUtil.getEmpId().toString()+ ","+ m_id;

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }
        if(rs.isEOF()) { return; }

        if(Cairo.Database.valField(rs.getFields(), 0) === 0) {
          MsgWarning(Cairo.Database.valField(rs.getFields(), 1));
        }
        else {
          //' La operación concluyo con éxito
          MsgInfo(Cairo.Language.getText(4963, ""));
        }

      };


      return self;
    };

    Edit.Controller = { getEditor: createObject };

    Edit.Controller.edit = function(id) {

      Cairo.LoadingMessage.show("Remito de Ventas", "Loading Remito de Venta from CrowSoft Cairo server.");
      var editor = Cairo.FacturaVenta.Edit.Controller.getEditor();
      //
      // wizards
      //
      if(id === 'sobreremito') {
        return editor.showWizardFacturaRemito();
      }
      else if(id === 'sobrepedido') {
        return editor.showWizardFacturaPedido();
      }
      else if(id === 'sobreproyecto') {
        return editor.showWizardFacturaProyecto();
      }
      else if(id === 'sobreppackinglist') {
        return editor.showWizardFacturaPackingList();
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

  Cairo.module("XxxxListDoc.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;
      var P = Cairo.Promises;
      var NO_ID = Cairo.Constants.NO_ID;
      var DB = Cairo.Database;
      var D = Cairo.Documents;
      var M = Cairo.Modal;
      var C = Cairo.General.Constants;
      var Types = Cairo.Constants.Types;
      var Dialogs = Cairo.Dialogs;
      var T = Dialogs.PropertyType;
      var val = Cairo.Util.val;
      var isDate = Cairo.Util.isDate;
      var getDateValue = Cairo.Util.getDateValue;
      var today = Cairo.Dates.today;
      var valField = DB.valField;
      var CS = Cairo.Security.Actions.Compras;

      var C_MODULE = "cRemitoVentaListDoc";

      var C_FECHA_INI = "FechaIni";
      var C_FECHA_FIN = "FechaFin";

      var C_IMG_TASK = 1;


      var K_FECHA_INI = 1;
      var K_FECHA_FIN = 2;
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

      var m_menuShowFactura = 0;
      var m_menuShowNotes = 0;
      var m_menuShowInfoCli = 0;
      var m_menuAddNote = 0;
      var m_menuShowApply = 0;
      var m_menuShowDocAux = 0;
      var m_menuSign = 0;
      var m_menuShowFacturaAuto = 0;
      var m_menuShowCancelar = 0;
      var m_menuEditCliente = 0;

      var m_objApply;

      var m_apiPath = DB.getAPIVersion();
      var SAVE_ERROR = getText(2227, ""); // Error al grabar los párametros de navegación de Xxxx

      self.list = function() {
        initialize();
        return load()
          .whenSuccess(loadCollection);
      };

      self.edit = function(xxId) {
        m_listController.edit(xxId);
      };

      self.deleteItem = function(xxId) {
        return m_listController.destroy(xxId);
      };

      self.showDocDigital = function() {
        var _rtn = false;

        try {

          var xxId = m_dialog.getId();
          if(xxId === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(CX.TABLE_NAME_XXXX);
          doc.setClientTableID(xxId);

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
        return RGB(&HC8, &HF6, &HC1);
      };

      self.setSearchParam = function(id, name) {

        var property = m_dialog.getProperties().item(C.CLI_ID);
        property.setValue(name);
        property.setSelectId(id);
        property.setSelectIntValue(id);
        m_dialog.showValue(m_dialog.getProperties().item(C.CLI_ID));
      };

      self.processMenu = function(index) {
        try {

          switch (index) {

            case m_menuShowFactura:
              showFactura(false);

              break;

            case m_menuShowFacturaAuto:
              showFactura(true);

              break;

            case m_menuShowCancelar:
              pCancelarRemito();

              break;

            case m_menuShowInfoCli:
              D.showInfo(Cairo.Tables.CLIENTE, getCliId());

              break;

            case m_menuShowNotes:
              showNotes();

              break;

            case m_menuAddNote:
              addNote();

              break;

            case m_menuShowApply:
              showApply();

              break;

            case m_menuShowDocAux:
              showDocAux();

              break;

            case m_menuSign:
              signDocument();

              break;

            case m_menuEditCliente:
              editCliente();

              break;
          }


        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "ProcessMenu", C_MODULE, "");

        }

      };


      var loadCollection = function() {
        var c;

        m_properties.clear();

        c = m_properties.add(null, C_FECHA_INI);
        c.setType(T.date);
        c.setName(getText(1203, "")); // Fecha desde
        c.setKey(K_FECHA_INI);
        c.setValue((m_fechaIniV !== "") ? m_fechaIniV : m_fechaIni);

        c = m_properties.add(null, C_FECHA_FIN);
        c.setType(T.date);
        c.setName(getText(1204, "")); // Fecha hasta
        c.setKey(K_FECHA_FIN);
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

        c = m_properties.add(null, C.DOC_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.DOCUMENTO);
        c.setName(getText(1567, "")); // Documentos
        c.setKey(K_DOC_ID);
        c.setValue(m_documento);
        c.setSelectId(val(m_docId));
        c.setSelectIntValue(m_docId);
        c.setSelectFilter(D.FACTURA_COMPRAS_LIST_DOC_FILTER);

        c = m_properties.add(null, C.CPG_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.CONDICIONES_DE_PAGO);
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
      var loadCollection = function() {
        var c = null;
        var o = null;
        var value = null;
        var bExists = null;

        var properties = m_dialog.getProperties();
        properties.clear();

        c = properties.add(null, C_FECHA_INI);
        c.setType(Dialogs.PropertyType.date);
        // Fecha desde
        c.setName(getText(1203, ""));
        c.setKey(K_FECHA_INI);

        if(LenB(m_fechaIniV)) {
          c.setValue(m_fechaIniV);
        }
        else {
          c.setValue(m_fechaIni);
        }

        c = properties.add(null, C_FECHA_FIN);
        c.setType(Dialogs.PropertyType.date);
        // Fecha hasta
        c.setName(getText(1204, ""));
        c.setKey(K_FECHA_FIN);

        if(LenB(m_fechaFinV)) {
          c.setValue(m_fechaFinV);
        }
        else {
          c.setValue(m_fechaFin);
        }

        c = properties.add(null, C.CLI_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CLIENTE);
        // Cliente
        c.setName(getText(1150, ""));
        c.setKey(K_CLI_ID);
        value = m_cliente;
        if(m_cliId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.CLIENTE, Cairo.Util.val(m_cliId.Substring(2)), bExists);
          if(!bExists) { m_cliId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_cliId));
        c.setSelectIntValue(m_cliId);

        c = properties.add(null, C.EST_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csEstado);
        // Estado
        c.setName(getText(1568, ""));
        c.setKey(K_EST_ID);
        value = m_estado;
        if(m_estId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csEstado, Cairo.Util.val(m_estId.Substring(2)), bExists);
          if(!bExists) { m_estId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_estId));
        c.setSelectIntValue(m_estId);

        c = properties.add(null, C.CCOS_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CENTRO_COSTO);
        // Centro de Costos
        c.setName(getText(1057, ""));
        c.setKey(K_CCOS_ID);
        value = m_centroCosto;
        if(m_ccosId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.CENTRO_COSTO, Cairo.Util.val(m_ccosId.Substring(2)), bExists);
          if(!bExists) { m_ccosId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_ccosId));
        c.setSelectIntValue(m_ccosId);

        c = properties.add(null, C.SUC_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.SUCURSAL);
        // Sucursal
        c.setName(getText(1281, ""));
        c.setKey(K_SUC_ID);
        value = m_sucursal;
        if(m_sucId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.SUCURSAL, Cairo.Util.val(m_sucId.Substring(2)), bExists);
          if(!bExists) { m_sucId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_sucId));
        c.setSelectIntValue(m_sucId);

        c = properties.add(null, C.VEN_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.VENDEDORES);
        // Vendedores
        c.setName(getText(1502, ""));
        c.setKey(K_VEN_ID);
        value = m_vendedor;
        if(m_venId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.VENDEDORES, Cairo.Util.val(m_venId.Substring(2)), bExists);
          if(!bExists) { m_venId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_venId));
        c.setSelectIntValue(m_venId);

        c = properties.add(null, C.DOC_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csETablasDocumento.CSDocumento);
        // Documentos
        c.setName(getText(1611, ""));
        c.setKey(K_DOC_ID);
        value = m_documento;
        if(m_docId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csETablasDocumento.CSDocumento, Cairo.Util.val(m_docId.Substring(2)), bExists);
          if(!bExists) { m_docId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_docId));
        c.setSelectIntValue(m_docId);
        c.setSelectFilter(getDocFilter());

        c = properties.add(null, C.CPG_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CONDICIONPAGO);
        // Condicion de pago
        c.setName(getText(1395, ""));
        c.setKey(K_CPG_ID);
        value = m_condicionPago;
        if(m_cpgId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.CONDICIONPAGO, Cairo.Util.val(m_cpgId.Substring(2)), bExists);
          if(!bExists) { m_cpgId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_cpgId));
        c.setSelectIntValue(m_cpgId);


        c = properties.add(null, C.EMP_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.EMPRESA);
        // Empresa
        c.setName(getText(1114, ""));
        c.setKey(K_EMP_ID);
        value = m_empresa;
        if(m_empId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.EMPRESA, Cairo.Util.val(m_empId.Substring(2)), bExists);
          if(!bExists) { m_empId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_empId));
        c.setSelectIntValue(m_empId);

        createMenu();
        if(!m_dialog.showDocumentList(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {
        return m_dialog.showValues(m_properties);
      };

      var load = function() {

        return DB.getData("load[" + m_apiPath + "general/remitoventalistdoc]", id).then(
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

              m_provId = valField(response.data, C.PROV_ID);
              m_estId = valField(response.data, C.EST_ID);
              m_ccosId = valField(response.data, C.CCOS_ID);
              m_sucId = valField(response.data, C.SUC_ID);
              m_docId = valField(response.data, C.DOC_ID);
              m_cpgId = valField(response.data, C.CPG_ID);
              m_empId = valField(response.data, C.EMP_ID);

              m_proveedor = valField(response.data, C.PROV_NAME);
              m_estado = valField(response.data, C.EST_NAME);
              m_centroCosto = valField(response.data, C.CCOS_NAME);
              m_sucursal = valField(response.data, C.SUC_NAME);
              m_documento = valField(response.data, C.DOC_NAME);
              m_condicionPago = valField(response.data, C.CPG_NAME);
              m_empresa = valField(response.data, C.EMP_NAME);
            }

            return true;
          });
      };

      self.getApplication = function() {
        return Cairo.Application.getName();
      };

      self.getProperties = function() {
        return m_properties;
      };

      self.propertyChange = function(key) {
        var iProp = null;

        var properties = m_dialog.getProperties();
        switch (key) {

          case K_FECHA_INI:

            iProp = properties.item(C_FECHA_INI);

            if(iProp.getSelectIntValue() !== "") {
              m_fechaIniV = iProp.getSelectIntValue();
              m_fechaIni = Cairo.Dates.DateNames.getDateByName(m_fechaIniV);
            }
            else if(isDate(iProp.getValue())) {
              m_fechaIniV = "";
              m_fechaIni = iProp.getValue();
            }
            else {
              m_fechaIniV = "";
              iProp.setValue(m_fechaIni);
            }

            break;

          case K_FECHA_FIN:

            iProp = properties.item(C_FECHA_FIN);

            if(iProp.getSelectIntValue() !== "") {
              m_fechaFinV = iProp.getSelectIntValue();
              m_fechaFin = Cairo.Dates.DateNames.getDateByName(m_fechaFinV);
            }
            else if(isDate(iProp.getValue())) {
              m_fechaFinV = "";
              m_fechaFin = iProp.getValue();
            }
            else {
              m_fechaFinV = "";
              iProp.setValue(m_fechaFin);
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
          provId: m_provId,
          estId: m_estId,
          ccosId: m_ccosId,
          sucId: m_sucId,
          docId: m_docId,
          cpgId: m_cpgId,
          empId: m_empId
        };

        return DB.getData("load[" + m_apiPath + "compras/facturacompras]", null, params);
      };
      var cIABMListDocClient_Refresh = function() {
        var sqlstmt = null;

        sqlstmt = "sp_lsdoc_RemitosVenta ";

        sqlstmt = sqlstmt+ Cairo.Database.getUserId().toString()+ ",";

        if(!cDate.getDateNames(m_fechaIniV) === null) {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(Cairo.Dates.DateNames.getDateByName(m_fechaIniV))+ ",";
        }
        else {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(m_fechaIni)+ ",";
        }

        if(!cDate.getDateNames(m_fechaFinV) === null) {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(Cairo.Dates.DateNames.getDateByName(m_fechaFinV))+ ",";
        }
        else {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(m_fechaFin)+ ",";
        }

        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_cliId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_estId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_ccosId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_sucId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_venId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_docId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_cpgId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_empId);

        return sqlstmt;
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.LDP_ID);
        register.setTable(C.LISTA_DOCUMENTO_PARAMETRO);

        register.setPath(m_apiPath + "compras/facturacompras");

        register.setId(Cairo.Constants.NEW_ID);

        var _count = m_dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {

          var property = m_dialog.getProperties().item(_i);

          switch (property.getKey()) {

            case K_FECHA_INI:
              var value = property.getSelectIntValue();
              if(value === "") { value = property.getValue(); }
              fields.add(C.FROM, value, Types.text);
              break;

            case K_FECHA_FIN:
              var value = property.getSelectIntValue();
              if(value === "") { value = property.getValue(); }
              fields.add(C.TO, value, Types.text);
              break;

            case K_PROV_ID:
              fields.add(C.PROV_ID, property.getSelectIntValue(), Types.text);
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
                  }
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

      var cIABMListDocClient_Save = function() {

        var strError = null;

        strError = getText(2227, "");
        //Error al grabar los párametros de navegación de Remitos de Venta

        var register = null;
        var register = new DB.Register();

        var sqlstmt = null;

        sqlstmt = "delete ListaDocumentoParametro where pre_id = "+ csPreVtaListRemito+ " and us_id = "+ m_us_id+ " and (emp_id is null or emp_id = "+ cUtil.getEmpId().toString()+ ")";

        if(!Cairo.Database.execute(sqlstmt, "cIABMClient_Save", C_MODULE, strError)) { return false; }

        register.setTable(Cairo.Constants.LISTADOCUMENTOPARAMETRO);
        register.setUtilizaIdentity(true);

        var property = null;
        var _count = m_dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);

          register.getFields().clear();

          switch (property.getKey()) {

            case K_FECHA_INI:
              if(property.getSelectIntValue() !== "") {
                fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              }
              else {
                fields.add(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              }

              fields.add(Cairo.Constants.LDP_ORDEN, 10, Cairo.Constants.Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_FECHA_INI, Cairo.Constants.Types.integer);

              break;

            case K_FECHA_FIN:

              if(property.getSelectIntValue() !== "") {
                fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              }
              else {
                fields.add(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              }

              fields.add(Cairo.Constants.LDP_ORDEN, 20, Cairo.Constants.Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_FECHA_FIN, Cairo.Constants.Types.integer);

              break;

            case K_CLI_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 40, Cairo.Constants.Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_CLI_ID, Cairo.Constants.Types.integer);
              break;

            case K_EST_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 50, Cairo.Constants.Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_EST_ID, Cairo.Constants.Types.integer);
              break;

            case K_CCOS_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 60, Cairo.Constants.Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_CCOS_ID, Cairo.Constants.Types.integer);
              break;

            case K_SUC_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 70, Cairo.Constants.Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_SUC_ID, Cairo.Constants.Types.integer);
              break;

            case K_VEN_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 80, Cairo.Constants.Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_VEN_ID, Cairo.Constants.Types.integer);
              break;

            case K_DOC_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 90, Cairo.Constants.Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_DOC_ID, Cairo.Constants.Types.integer);
              break;

            case K_CPG_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 100, Cairo.Constants.Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_CPG_ID, Cairo.Constants.Types.integer);


              break;

            case K_EMP_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 100, Cairo.Constants.Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_EMP_ID, Cairo.Constants.Types.integer);

              break;
          }


          fields.add(C.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

          fields.add(C.US_ID, m_us_id, Cairo.Constants.Types.id);
          fields.add(C.PRE_ID, csPreVtaListRemito, Cairo.Constants.Types.id);



          if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, strError)) { return false; }
        }

        if(!load(m_us_id)) { return false; }

        return true;
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


      var getDocFilter = function() {
        return "'{emp_id=0}doct_id = "+ csEDocumentoTipo.cSEDT_REMITO_VENTA.toString()+ " or doct_id = "+ csEDocumentoTipo.cSEDT_DEVOLUCION_REMITO_VTA.toString()+ "'";
      };

      var createMenu = function() {


        if(m_menuLoaded) { return; }

        m_menuLoaded = true;

        m_objList.ObjClientMenu = self;
        m_objList.ClearMenu;
        // Editar Cliente
        m_menuEditCliente = m_objList.addMenu(getText(5038, ""));
        m_objList.addMenu("-");
        // Facturar este remito
        m_menuShowFactura = m_objList.addMenu(getText(3954, ""));
        // Facturar Automático
        m_menuShowFacturaAuto = m_objList.addMenu(getText(3956, ""));
        // Cancelar el Documento
        m_menuShowCancelar = m_objList.addMenu(getText(4962, ""));
        m_objList.addMenu("-");
        // Firmar
        m_menuSign = m_objList.addMenu(getText(1594, ""));
        m_objList.addMenu("-");
        // Ver Info del Cliente
        m_menuShowInfoCli = m_objList.addMenu(getText(1614, ""));
        // Agregar Nota
        m_menuAddNote = m_objList.addMenu(getText(1615, ""));
        // Ver Notas
        m_menuShowNotes = m_objList.addMenu(getText(1616, ""));
        m_objList.addMenu("-");
        // Ver Aplicaciones
        m_menuShowApply = m_objList.addMenu(getText(1617, ""));
        // Ver Documento Asociado
        m_menuShowDocAux = m_objList.addMenu(getText(1691, ""));
      };

      var showNotes = function() {
        var fcId = m_dialog.getId();
        return DB.getData("load[" + m_apiPath + "modulexxxx/xxxx/notes]", fcId)
          .whenSuccessWithResult(D.showNotes);
      };

      var addNote = function() {
        var xxId = m_dialog.getId();
        return D.addNote(D.Types.TYPEXXXX, xxId, false);
      };

      var editCliente = function() {
        var cli_id = null;
        cli_id = getCliId();
        if(cli_id === NO_ID) { return; }
        var abmObj = null;
        var o = null;
        abmObj = new CSABMInterface2.cABMGeneric();
        o = CSKernelClient2.CreateObject("CSGeneral2.cCliente");
        o.setObjABM(abmObj);
        o.edit(cli_id, true);
      };

      var signDocument = function() {

        var fcId = m_dialog.getId();

        if(fcId === NO_ID) {
          return P.resolvedPromise();
        }

        var refreshRow = function(response) {
          m_dialog.refreshRow(response.data);
        };

        var getAction = function(response) {
          var p = null;

          if(response.signed) {
            p = M.confirmViewYesDefault(
              getText(1594, ""), // Firmar
              getText(1593, "")  // El documento ya ha sido firmado desea borrar la firma

            );
          }
          return p || P.resolvedPromise(true);
        };

        var p = D.getDocumentSignStatus(D.Types.FACTURA_COMPRA, fcId)
            .whenSuccessWithResult(getAction)
            .whenSuccess(D.signDocument(D.Types.FACTURA_COMPRA, fcId))
            .whenSuccessWithResult(refreshRow)
          ;

        return p;
      };

      var showAsiento = function() {
        var fcId = m_dialog.getId();
        if(fcId !== NO_ID) {

          D.getAsientoId(D.Types.FACTURA_COMPRA, fcId).whenSuccessWithResult(function(response) {
            D.showDocAux(response.as_id, "Asiento");
          });
        }
      };

      var showDocAux = function() {

        var rvId = null;
        rvId = m_dialog.getId();

        if(rvId) {

          var stId = null;
          if(!DB.getData(CV.REMITO_VENTA, CV.RV_ID, rvId, CV.ST_ID, stId)) { return; }

          if(stId === NO_ID) {

            MsgInfo(getText(1693, ""));
            //Este comprobante no tiene un documento de stock asociado.
          }
          else {

            ShowDocAux(stId, "CSStock2.cStock", "CSABMInterface2.cABMGeneric");
          }
        }

      };

      var showDocAux = function() {
        var fcId = m_dialog.getId();
        if(fcId !== NO_ID) {

          D.getStockId(D.Types.TYPE_XXXX, xxId).whenSuccessWithResult(function(response) {
            D.showDocAux(response.st_id, "Stock");
          });
        }
      };

      var showApply = function() {

        var rvId = null;
        rvId = m_dialog.getId();

        if(rvId === NO_ID) { return; }

        var total = null;
        var nroDoc = null;
        var cliId = null;
        var cliente = null;
        var sucId = null;
        var docId = null;
        var doctId = null;

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "select rv_total, rv_nrodoc, rv.cli_id, cli_nombre, rv.suc_id, rv.doc_id, rv.doct_id from RemitoVenta rv inner join Cliente cli  on rv.cli_id = cli.cli_id where rv_id = "+ rvId.toString();

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(rs.isEOF()) { return; }

        total = Cairo.Database.valField(rs.getFields(), CV.RV_TOTAL);
        nroDoc = Cairo.Database.valField(rs.getFields(), CV.RV_NRODOC);
        cliId = Cairo.Database.valField(rs.getFields(), C.CLI_ID);
        cliente = Cairo.Database.valField(rs.getFields(), C.CLI_NAME);
        sucId = Cairo.Database.valField(rs.getFields(), C.SUC_ID);
        docId = Cairo.Database.valField(rs.getFields(), C.DOC_ID);
        doctId = Cairo.Database.valField(rs.getFields(), C.DOCT_ID);

        if(!DoCairo.Security.anAccess(csPreVtaModifyAplic, m_docId, csE_DocTypePrestacion.cSEDOCTPREAPLICAR)) { return; }

        if(m_objApply === null) {
          m_objApply = new cRemitoVentaAplic();

          // Edit Apply
          //
        }
        else {
          if(m_objApply.id !== rvId) {
            m_objApply = new cRemitoVentaAplic();
          }
        }

        if(!m_objApply.self.show(rvId, total, nroDoc, cliId, cliente, sucId, docId, doctId === csEDocumentoTipo.cSEDT_DEVOLUCION_REMITO_VTA)) {
          m_objApply = null;
        }

      };

      var showFactura = function(bPushVirtualNext) {
        try {

          var o = null;
          o = new CSVenta2.cFacturaVenta();

          o.PushVirtualNext = bPushVirtualNext;
          o.ShowFacturaRemito(getCliId(), getRvIds());


        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "showFactura", C_MODULE, "");

        }

      };

      var pCancelarRemito = function() {
        var sqlstmt = null;
        var rs = null;

        var vRvIds() = null;

        vRvIds = getRvIds();

        var i = null;

        for(i = 0; i <= vRvIds.Length; i++) {

          sqlstmt = "sp_DocRemitoVentaCancelar "+ Cairo.User.getId().toString()+ ","+ cUtil.getEmpId().toString()+ ","+ vRvIds[i].toString();

          if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }
          if(rs.isEOF()) { return; }

          if(Cairo.Database.valField(rs.getFields(), 0) === 0) {
            MsgWarning(Cairo.Database.valField(rs.getFields(), 1));
          }

          if(Cairo.Database.valField(rs.getFields(), 0) === -1) {
            MsgWarning(Cairo.Database.valField(rs.getFields(), 1));
            return;
          }

        }

        //  La operación concluyo con éxito
        MsgInfo(getText(4963, ""));

      };

      var getCliId = function() {


        var rvId = null;
        var cliId = null;

        rvId = m_dialog.getId();
        DB.getData(CV.REMITO_VENTA, CV.RV_ID, rvId, C.CLI_ID, cliId);

        return cliId;
      };

      var getRvIds = function() {
        return m_dialog.getIds();
      };

      var initialize = function() {
        try {
          m_title = getText(1892, ""); // Facturas de Compras
          m_dialog.setHaveDetail(true);
          m_dialog.setStartRowText(4);
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "initialize", C_MODULE, "");
        }
      };

      var initialize = function() {
        try {

          // Remitos de ventas
          m_title = getText(1712, "");

          m_properties = new cABMDocProperties();
          //Set .ImageList = fResource.iList
          m_properties.setHaveDetail(true);
          m_properties.setStartRowText(4);

          var elem = m_properties.add(null, "TypeTask");
          elem.setName("TypeTask");
          elem.setCaption(" ");
          var elem = row.add(null);
          elem.FormulaType = csConditionType.cSCONDTNONE;
          elem.IconIndex = C_IMG_TASK;
          elem.setWidth(500);
          elem.setSortType(csSortType.cSSRTTICON);

          var elem = m_properties.add(null, "Observaciones");
          elem.setName("Observaciones");
          elem.setFontName("Tahoma");
          elem.setFontSize(8);
          elem.setForeColor(vbBlue);


        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");

        }

      };

      self.destroy = function() {
        try {
          m_dialog = null;
          m_properties = null;
          m_listController = null;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");
        }
      };

      self.destroy = function() {
        try {

          m_dialog = null;
          m_properties = null;


        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");

        }

      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("Xxxx.List", function(List, Cairo, Backbone, Marionette, $, _) {

    var NO_ID = Cairo.Constants.NO_ID;
    var DB = Cairo.Database;
    var C_MODULE = "cXxxx";
    var P = Cairo.Promises;

    List.Controller = {
      list: function() {

        var self = this;

        var createListDialog = function() {

          var editors = Cairo.Editors.xxxxEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.xxxxEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Xxxx",
            entityName: "xxxx",
            entitiesName: "xxxxs"
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
              Cairo.LoadingMessage.show("Xxxx", "Loading Xxxxs from CrowSoft Cairo server.");

              var editor = Cairo.Xxxx.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.Modulexxxx.DELETE_XXXX)) {
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
              DB.getAPIVersion() + "modulexxxx/xxxx", id,
              Cairo.Constants.DELETE_FUNCTION, C_MODULE).whenSuccess(closeDialog, false);
          };

          // progress message
          //
          Cairo.LoadingMessage.show("Xxxx", "Loading Xxxxs from CrowSoft Cairo server.");

          self.documentList = Cairo.XxxxListDoc.Edit.Controller.getEditor();
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