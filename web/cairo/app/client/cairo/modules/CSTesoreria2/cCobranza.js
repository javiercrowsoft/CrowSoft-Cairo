(function() {
  "use strict";

  Cairo.module("Xxxx.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {
    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      // cCobranza
      // 27-01-2004

      var C_MODULE = "cCobranza";

      var C_CHEQUES = "Cheques";
      var C_EFECTIVO = "Efectivo";
      var C_TARJETA = "Tarjetas";
      var C_OTROS = "Otros";
      var C_CTACTE = "Cuenta Corriente";
      var C_CUOTAS = "Cuotas";

      var K_NUMERO = 1;
      var K_NRODOC = 2;
      var K_DESCRIP = 3;
      var K_FECHA = 4;
      var K_NETO = 6;
      var K_TOTAL = 9;
      var K_CLI_ID = 10;
      var K_DOC_ID = 11;
      var K_DOCT_ID = 12;
      var K_CHEQUES = 15;
      var K_EST_ID = 17;
      var K_CCOS_ID = 18;
      var K_SUC_ID = 19;
      var K_OTROS = 24;
      var K_COTIZACION = 25;
      var K_COB_ID = 26;
      var K_LGJ_ID = 27;
      var K_EFECTIVO = 28;
      var K_TARJETA = 29;
      var K_CTACTE = 30;

      var KI_IMPORTE = 1;
      var KI_FV_ID = 2;
      var KI_FECHA = 4;
      var KI_DESCRIP = 6;
      var KI_DOC = 7;
      var KI_PENDIENTE = 8;
      var KI_VTO = 9;
      var KI_TOTAL = 10;
      var KI_COTIZACION = 11;
      var KI_NRODOC = 12;
      var KI_IMPORTEORIGEN = 13;
      var KI_MONEDA = 14;
      var KI_COTIZACION2 = 15;
      var KI_FVD_ID = 16;

      var KIO_COBZI_ID = 1;
      var KIO_CUE_ID = 2;
      var KIO_DEBE = 3;
      var KIO_HABER = 4;
      var KIO_IMPORTEORIGEN = 5;
      var KIO_DESCRIP = 6;
      var KIO_RET_ID = 7;
      var KIO_NRORETENCION = 8;
      var KIO_PORCRETENCION = 9;
      var KIO_FECHARETENCION = 10;
      var KIO_CCOS_ID = 11;
      var KIO_FV_ID_RET = 12;

      var KICH_COBZI_ID = 1;
      var KICH_CUE_ID = 2;
      var KICH_IMPORTE = 3;
      var KICH_IMPORTEORIGEN = 4;
      var KICH_BCO_ID = 5;
      var KICH_CHEQUE = 6;
      var KICH_CHEQ_ID = 7;
      var KICH_MON_ID = 8;
      var KICH_FECHACOBRO = 9;
      var KICH_FECHAVTO = 10;
      var KICH_CLE_ID = 11;
      var KICH_DESCRIP = 12;
      var KICH_PROPIO = 13;

      var KIE_COBZI_ID = 1;
      var KIE_CUE_ID = 2;
      var KIE_MON_ID = 3;
      var KIE_IMPORTE = 4;
      var KIE_IMPORTEORIGEN = 5;
      var KIE_DESCRIP = 6;

      var KIT_COBZI_ID = 1;
      var KIT_CUPON = 2;
      var KIT_TJC_ID = 3;
      var KIT_IMPORTE = 4;
      var KIT_IMPORTEORIGEN = 5;
      var KIT_FECHAVTO = 7;
      var KIT_NROTARJETA = 8;
      var KIT_NROAUTORIZACION = 9;
      var KIT_TITULAR = 10;
      var KIT_MON_ID = 11;
      var KIT_DESCRIP = 12;
      var KIT_TARJETA_TIPO = 13;
      var KIT_TJCC_ID = 14;
      var KIT_TJCCU_ID = 15;

      var KICC_COBZI_ID = 1;
      var KICC_CUE_ID = 2;
      var KICC_IMPORTE = 3;
      var KICC_IMPORTEORIGEN = 4;

      var CSLEGAJO = 15001;

      // pseudo-constantes
      var c_ErrorSave = "";

      var m_id = 0;
      var m_numero = 0;
      var m_estado = "";
      var m_est_id = 0;
      var m_nrodoc = "";
      var m_descrip = "";
      var m_fecha = null;
      var m_neto = 0;
      var m_otros = 0;
      var m_total = 0;
      var m_cob_id = 0;
      var m_cobrador = "";
      var m_lgj_id = 0;
      var m_legajo = "";

      var m_cotizacion = 0;
      var m_ccos_id = 0;
      var m_centroCosto = "";
      var m_suc_id = 0;
      var m_sucursal = "";
      var m_cli_id = 0;
      var m_cliente = "";
      var m_doc_id = 0;
      var m_documento = "";
      var m_doct_id = 0;
      var m_creado = null;
      var m_modificado = null;
      var m_modifico = 0;
      var m_firmado;

      // Para ver documentos auxiliares
      //
      var m_as_id = 0;

      var m_editing;

      var m_footer;
      var m_items;
      var m_dialog;
      var m_listController = null;

      var m_lastDoc = 0;
      var m_lastCli = 0;
      var m_lastDocName = "";
      var m_lastCliName = "";

      var m_isNew;

      var m_branchId = 0;
      var m_treeId = 0;

      var m_monDefault = 0;

      var m_chequesDeleted = "";
      var m_efectivoDeleted = "";
      var m_tarjetasDeleted = "";
      var m_otrosDeleted = "";
      var m_ctaCteDeleted = "";

      var m_copy;

      var m_generalConfig;

      var m_docEditable;
      var m_docEditMsg = "";

      var m_taPropuesto;
      var m_taMascara = "";

      var m_iOrden = 0;

      var m_objApply;

      var m_lColCuotas = 0;

      var m_fvIds = 0;

      var m_cliIds = 0;
      var m_fvIdsxCliId = 0;
      var m_cobranzaInfo;

      // Wizard Automatico
      //
      var m_bPushVirtualNext;
      var m_bCloseWizardAfterSave;
      var m_bWizardCompleteSuccess;

      self.setPushVirtualNext = function(rhs) {
        m_bPushVirtualNext = rhs;
      };

      self.setCloseWizardAfterSave = function(rhs) {
        m_bCloseWizardAfterSave = rhs;
      };

      self.getWizardCompleteSuccess = function() {
        return m_bWizardCompleteSuccess;
      };

      self.setWizardCompleteSuccess = function(rhs) {
        m_bWizardCompleteSuccess = rhs;
      };

      // Edit Apply
      //
      self.refresh = function() {
        load(m_id);
        pRefreshProperties();
      };

      self.terminateWizard = function(id) {
        //  On Error Resume Next
        //  If Id <> csNO_ID Then
        //    cIEditGeneric_Edit Id
        //  End If
        m_id = id;
        self.terminate();
      };

      self.showCobranza = function(cliId,  vFvIds) { // TODO: Use of ByRef founded Public Sub ShowCobranza(ByVal CliId As Long, ByRef vFvIds() As Long)
        try {

          m_cli_id = cliId;
          Cairo.Database.getData(mTesoreriaConstantes.CLIENTE, mTesoreriaConstantes.CLI_ID, cliId, mTesoreriaConstantes.CLI_NAME, m_cliente);

          var i = null;
          G.redim(m_fvIds, vFvIds.Length + 1);
          for (i = 1; i <= vFvIds.Length + 1; i++) {
            m_fvIds[i] = vFvIds(i - 1);
          }

          if(!pInitMembers()) {
            return;
          }

          pShowStartWizard(false);

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "ShowCobranza", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      self.showCobranzaEx = function(vCliIds,  vFvIdsxCliId) { // TODO: Use of ByRef founded Public Sub ShowCobranzaEx(ByRef vCliIds() As Long, ByRef vFvIdsxCliId() As Long)
        try {

          var i = null;
          var j = null;

          G.redim(m_cliIds, vCliIds.Length);
          for (i = 1; i <= vCliIds.Length; i++) {
            m_cliIds[i] = vCliIds(i);
          }

          G.redim(m_fvIdsxCliId, (vFvIdsxCliId, 1).Length, (vFvIdsxCliId, 1vFvIdsxCliId, 2).Length);
          for (i = 1; i <= (vFvIdsxCliId, 1).Length; i++) {
            for (j = 1; j <= (vFvIdsxCliId, 2).Length; j++) {
              m_fvIdsxCliId[i, j] === vFvIdsxCliId(i, j);
            }
          }

          if(!pInitMembers()) {
            return;
          }

          pShowStartWizard(false);

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "ShowCobranzaEx", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      // Solo para Hojas de Ruta
      //
      self.showCobranzaEx2 = function(vCliIds,  cobranzaInfo) { // TODO: Use of ByRef founded Public Sub ShowCobranzaEx2(ByRef vCliIds() As Long, ByRef CobranzaInfo As cCobranzaInfo)
        try {

          var i = null;

          G.redim(m_cliIds, vCliIds.Length);
          for (i = 1; i <= vCliIds.Length; i++) {
            m_cliIds[i] = vCliIds(i);
          }

          m_cobranzaInfo = cobranzaInfo;

          if(!pInitMembers()) {
            return;
          }

          pShowStartWizard(true);

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "ShowCobranzaEx2", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var pInitMembers = function() {
        self.setDialog(new cABMGeneric());
        setCIEditGenericDoc_Footer(new cABMGeneric());
        setCIEditGenericDoc_Items(new cABMGeneric());

        if(!DoCairo.Security.anAccess(csTesoreriaPrestacion.cSPRETSRNEWCOBRANZA, Cairo.Constants.NO_ID, csE_DocTypePrestacion.cSEDOCTPRENEW)) {
          return null;
        }
        return true;
      };

      self.copy = function() {

        if(!DoCairo.Security.anAccessEx(csTesoreriaPrestacion.cSPRETSRNEWCOBRANZA, m_doc_id, csE_DocTypePrestacion.cSEDOCTPRENEW, true)) { return false; }

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, Cairo.Constants.NO_ID);
        m_copy = true;
        m_docEditable = true;
        m_docEditMsg = "";

        // Obtengo el numero para este comprobante
        //
        GetDocNumber(m_lastDoc, m_dialog, m_taPropuesto, mTesoreriaConstantes.COBZ_NRODOC);
        pSetEnabled();

        // Limpio los ids de cheques ya que no puedo reutilizar
        // ni cheques propios ni de tercero
        pClearCheqId();

      };

      self.editNew = function() {
        var mouse = null;
        mouse = new cMouseWait();
        m_listController.updateEditorKey(self, Cairo.Constants.NO_ID);

        return load(Cairo.Constants.NO_ID).then(
          function(ignored) {
            return refreshCollection();
          }
        );

        if(!m_docEditable) {
          if(LenB(m_docEditMsg)) {
            MsgWarning(m_docEditMsg);
          }
        }

        if(m_dialog.getProperties().item(mTesoreriaConstantes.DOC_ID).getSelectId() === Cairo.Constants.NO_ID) {
          //'Debe indicar un documento
          MsgInfo(Cairo.Language.getText(1562, ""));
        }

        // Obtengo el numero para este comprobante
        //
        GetDocNumber(m_lastDoc, m_dialog, m_taPropuesto, mTesoreriaConstantes.COBZ_NRODOC);
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

          doc.setClientTable(mTesoreriaConstantes.COBRANZA);
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
            switch (info) {
              case K_CHEQUES:
              case K_EFECTIVO:
              case K_TARJETA:
                pShowCobroNeto();
                break;

              case K_OTROS:
                pShowCobroOtro();
                break;
            }
            pShowCobroTotal();

            break;

          case Dialogs.Message.MSG_DOC_EDIT_STATE:
            //'Cobranza
            ShowEditState(m_docEditMsg, Cairo.Language.getText(2060, ""));

            break;

          case Dialogs.Message.MSG_DOC_APPLY:
            pShowApply();

            break;

          case Dialogs.Message.MSG_DOC_DELETE:
            if(self.delete(m_id)) {
              _rtn = true;
              pMove(Dialogs.Message.MSG_DOC_NEXT);
            }

            break;

          case Dialogs.Message.MSG_DOC_ANULAR:
            DocAnular(m_id, m_est_id, m_estado, csTesoreriaPrestacion.cSPRETSRANULARCOBRANZA, csTesoreriaPrestacion.cSPRETSRDESANULARCOBRANZA, m_dialog, m_docEditable, m_docEditMsg, "sp_DocCobranzaAnular", "sp_DocCobranzaEditableGet");
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
            cPublicDoc.documentSearch(csEDocumentoTipo.cSEDT_COBRANZA, self, !CBool(info));

            break;

          case Dialogs.Message.MSG_DOC_DOC_AUX:

            if(m_id) {

              ShowDocAux(m_as_id, "CSContabilidad2.cAsiento", "CSABMInterface2.cABMGeneric");
            }
            else {
              MsgInfo(Cairo.Language.getText(1620, ""));
              //Debe editar un comprobante guardado para poder ver los documentos auxiliares
            }

            break;

          case Dialogs.Message.MSG_DOC_DOC_EDIT:

            if(m_id) {

              if(m_docEditable) {

                //'Este documento puede editarse normalmente
                MsgInfo(Cairo.Language.getText(1555, ""));
              }
              else {

                if(DocCanSave(m_dialog, mTesoreriaConstantes.COBZ_FECHA)) {

                  var editDoc = null;
                  editDoc = new cEditDocEx();

                  editDoc.setObjectClient(self);
                  editDoc.edit(m_id, m_doct_id, mTesoreriaConstantes.COBRANZA, mTesoreriaConstantes.COBZ_ID, mTesoreriaConstantes.COBRANZAITEM, mTesoreriaConstantes.COBZI_ID, csTesoreriaPrestacion.cSPRETSRNEWCOBRANZA, csTesoreriaPrestacion.cSPRETSREDITCOBRANZA, m_cli_id, Cairo.Constants.NO_ID, true);
                }

              }

            }
            else {
              MsgInfo(Cairo.Language.getText(1556, ""));
              //Esta opción solo sirve para modificar documentos guardados y aplicados
            }

            break;

          case Dialogs.Message.MSG_DOC_HISTORY:

            if(m_id !== Cairo.Constants.NO_ID) {

              ShowHistory(csETablesTesoreria.cSCOBRANZA, m_id, m_documento+ " "+ m_nrodoc);
            }
            else {

              //'El documento aun no ha sido guardado
              MsgInfo(Cairo.Language.getText(1552, ""));
            }

            break;

          case Dialogs.Message.MSG_EXPORT_GET_EMAIL:

            _rtn = cIABMProperty.getEmailFromCliente(pGetCliente());

            break;

          case Dialogs.Message.MSG_EXPORT_GET_FILE_NAME_POSTFIX:

            _rtn = pGetFileNamePostFix();

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

              // Si cambie de documento y estaba en un comprobante ya guardado
              // tengo que mostrar el formulario sin datos, para evitar
              // que presione guardar y le cambie el doc_id al comprobante por error
              //
              if(m_id !== Cairo.Constants.NO_ID && m_doc_id !== m_lastDoc) { self.edit(csDocChanged); }

              // Obtengo el numero para este comprobante
              //
              GetDocNumber(m_lastDoc, m_dialog, m_taPropuesto, mTesoreriaConstantes.COBZ_NRODOC);

            }

            // Defino el estado de edicion del comprobante
            //
            pSetEnabled();

            break;

          case K_CLI_ID:

            pSetFilterColFactura();

            break;
        }
      };

      self.save = function() {
        var _rtn = null;

        // Save and State
        //
        if(!DocCanEdit(m_docEditable, m_docEditMsg)) {
          _rtn = true;
          return _rtn;
        }
        if(!DocCanSave(m_dialog, mTesoreriaConstantes.COBZ_FECHA)) {
          _rtn = false;
          return _rtn;
        }

        // OJO -tsr
        if(pGetCheques().getRows().count() === 0 && pGetTarjetas().getRows().count() === 0 && pGetOtros().getRows().count() === 0 && pGetEfectivo().getRows().count() === 0) {

          //'El documento debe contener al menos un item
          MsgWarning(Cairo.Language.getText(3903, ""));
          _rtn = false;
          return _rtn;
        }

        var mouse = null;
        mouse = new cMouseWait();

        DoEvents:(DoEvents: DoEvents: DoEvents);

        var register = new Cairo.Database.Register();
        register.setFieldId(mTesoreriaConstantes.COBZ_TMPID);
        register.setTable(mTesoreriaConstantes.COBRANZATMP);

        register.setId(Cairo.Constants.NEW_ID);

        var apiPath = Cairo.Database.getAPIVersion();
        register.setPath(apiPath + "general/cobranza");

        if(m_copy) {
          register.getFields().add2(mTesoreriaConstantes.COBZ_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);
        }
        else {
          register.getFields().add2(mTesoreriaConstantes.COBZ_ID, m_id, Cairo.Constants.Types.long);
        }

        if(register.getID() === Cairo.Constants.NEW_ID) {
          m_est_id = CSGeneralEx2.csEEstado.cSEEST_PENDIENTE;
        }

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          var property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NUMERO:
              register.getFields().add2(mTesoreriaConstantes.COBZ_NUMERO, property.getValue(), Cairo.Constants.Types.long);
              break;

            case K_NRODOC:
              register.getFields().add2(mTesoreriaConstantes.COBZ_NRODOC, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_DESCRIP:
              register.getFields().add2(mTesoreriaConstantes.COBZ_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_FECHA:
              register.getFields().add2(mTesoreriaConstantes.COBZ_FECHA, property.getValue(), Cairo.Constants.Types.date);
              break;

            case K_CLI_ID:
              register.getFields().add2(mTesoreriaConstantes.CLI_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_CCOS_ID:
              register.getFields().add2(mTesoreriaConstantes.CCOS_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_SUC_ID:
              register.getFields().add2(mTesoreriaConstantes.SUC_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_DOC_ID:
              register.getFields().add2(mTesoreriaConstantes.DOC_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_COTIZACION:
              register.getFields().add2(mTesoreriaConstantes.COBZ_COTIZACION, property.getValue(), Cairo.Constants.Types.double);
              break;

            case K_COB_ID:
              register.getFields().add2(mTesoreriaConstantes.COB_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_LGJ_ID:
              register.getFields().add2(mTesoreriaConstantes.LGJ_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;
          }
        }

        var _count = m_footer.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          property = m_footer.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NETO:
              register.getFields().add2(mTesoreriaConstantes.COBZ_NETO, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.currency);
              break;

            case K_OTROS:
              register.getFields().add2(mTesoreriaConstantes.COBZ_OTROS, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.currency);
              break;

            case K_TOTAL:
              register.getFields().add2(mTesoreriaConstantes.COBZ_TOTAL, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.currency);
              break;
          }
        }

        register.getFields().add2(mTesoreriaConstantes.COBZ_GRABAR_ASIENTO, 1, Cairo.Constants.Types.boolean);
        register.getFields().add2(Cairo.Constants.EST_ID, m_est_id, Cairo.Constants.Types.id);

        register.getFields().setHaveLastUpdate(true);
        register.getFields().setHaveWhoModify(true);

        register.prepareTransaction();
        if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return _rtn; }

        m_iOrden = 0;
        if(!pSaveCheques(register.getID())) { return _rtn; }
        if(!pSaveEfectivo(register.getID())) { return _rtn; }
        if(!pSaveOtros(register.getID())) { return _rtn; }
        if(!pSaveTarjetas(register.getID())) { return _rtn; }
        if(!pSaveCtaCte(register.getID())) { return _rtn; }

        var sqlstmt = null;
        var rs = null;
        sqlstmt = "sp_DocCobranzaSave "+ register.getID().toString();

        if(!Cairo.Database.openRs(sqlstmt, rs, , , , "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return _rtn; }

        if(rs.isEOF()) { return _rtn; }

        var id = null;
        if(!GetDocIDFromRecordset(rs, id)) { return _rtn; }

        m_copy = false;

        _rtn = load(id);

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
        return "#general/cobranza/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "cobranza" + id;
      };

      self.getTitle = function() {
        //'Cobranza
        return Cairo.Language.getText(2060, "");
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

            case K_SUC_ID:
              if(ValEmpty(property.getSelectId(), Cairo.Constants.Types.id)) {
                //'Debe indicar una sucursal
                MsgInfo(Cairo.Language.getText(1560, ""));
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
            case K_CHEQUES:
              _rtn = pIsEmptyRowCheques(row, rowIndex);
              break;

            case K_TARJETA:
              _rtn = pIsEmptyRowTarjetas(row, rowIndex);
              break;

            case K_OTROS:
              _rtn = pIsEmptyRowOtros(row, rowIndex);
              break;

            case K_EFECTIVO:
              _rtn = pIsEmptyRowEfectivo(row, rowIndex);
              break;

            case K_CTACTE:
              _rtn = pIsEmptyRowCtaCte(row, rowIndex);
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

          sqlstmt = "select doct_id, doc_id from Cobranza where cobz_id = "+ id.toString();
          if(!Cairo.Database.openRs(sqlstmt, rs)) { return _rtn; }

          m_id = id;
          m_doc_id = Cairo.Database.valField(rs.getFields(), mTesoreriaConstantes.DOC_ID);
          m_doct_id = Cairo.Database.valField(rs.getFields(), mTesoreriaConstantes.DOCT_ID);

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
        return Cairo.Security.hasPermissionTo(csTesoreriaPrestacion.cSPRETSRLISTCOBRANZA);
      };

      self.setDialog = function(rhs) {
        m_dialog = rhs;
        m_dialog.setIsDocument(true);

                #If !PREPROC_SFS Then;
        var abmGen = null;

        abmGen = m_dialog;
        abmGen.FactoryObject = "CSABMInterface2.cFactory";
        abmGen.ObjForm = "CSABMInterface2.fCobranza";
                #End If;
      };

      self.isEditing = function() {
        return m_editing;
      };

      self.edit = function(id,  inModalWindow) {
        var p = Cairo.Promises.resolvedPromise(false);
        try {

          if(!DoCairo.Security.anAccess(csTesoreriaPrestacion.cSPRETSRLISTCOBRANZA, GetdocIdFromObjAbm(m_dialog), csE_DocTypePrestacion.cSEDOCTPRELIST)) { return p; }

          // Id = csDocChanged esto significa que se cambio
          //                   el documento estando en un
          //                   comprobante ya guardado
          //
          m_isNew = id === Cairo.Constants.NO_ID || id === csDocChanged;

          p = load(id).then(
            function(success) {
              if(success) {

                // Solo muestro asistentes si el nuevo no se esta dando por
                // un cambio de documento
                //
                if(id !== csDocChanged && m_isNew) {

                  if(!DoCairo.Security.anAccess(csTesoreriaPrestacion.cSPRETSRNEWCOBRANZA, GetdocIdFromObjAbm(m_dialog), csE_DocTypePrestacion.cSEDOCTPRENEW)) { return p; }

                  pShowStartWizard(false);

                }
                else {

                  if(m_dialog !== null) {

                    if(m_dialog.getProperties().count() === 0) {
                      if(!loadCollection()) { return false; }
                    }
                    else {
                      pRefreshProperties();
                    }
                  }

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
            case K_CHEQUES:
              _rtn = pColAUpdateCheque(m_items.getProperties().item(C_CHEQUES), lRow, lCol);
              break;

            case K_TARJETA:
              _rtn = pColAUpdateTarjeta(m_items.getProperties().item(C_TARJETA), lRow, lCol);
              break;

            case K_OTROS:
              _rtn = pColAUpdateOtro(m_items.getProperties().item(C_OTROS), lRow, lCol);
              break;

            case K_EFECTIVO:
              _rtn = pColAUpdateEfectivo(m_items.getProperties().item(C_EFECTIVO), lRow, lCol);
              break;

            case K_CTACTE:
              _rtn = pColAUpdateCtaCte(m_items.getProperties().item(C_CTACTE), lRow, lCol);
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

      var columnAfterEdit = function(key,  lRow,  lCol,  newValue,  newValueID) {
        var _rtn = null;
        try {

          switch (key) {
            case K_CHEQUES:
            case K_EFECTIVO:
            case K_TARJETA:
            case K_OTROS:
            case K_CTACTE:
              _rtn = true;
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
            case K_CHEQUES:
              _rtn = true;
              break;

            case K_TARJETA:
              _rtn = pColBeforeEditTarjeta(key, lRow, lCol, iKeyAscii);
              break;

            case K_OTROS:
              _rtn = true;
              break;

            case K_EFECTIVO:
              _rtn = true;
              break;

            case K_CTACTE:
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

      var pColBeforeEditTarjeta = function(key,  lRow,  lCol,  iKeyAscii) {
        var row = null;
        var property = null;
        property = m_items.getProperties().item(C_TARJETA);
        var w_grid = property.getGrid();
        switch (w_grid.getColumns(lCol).Key) {
          case KIT_TJCCU_ID:
            row = w_grid.getRows(lRow);
            mPublic.self.setFilterCuotas(row, property, m_items, KIT_TJC_ID);
            break;
        }
        return true;
      };

      var pColumnBeforeEdit = function(property,  lRow,  lCol,  iKeyAscii) { // TODO: Use of ByRef founded Private Function pColumnBeforeEdit(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long, ByVal iKeyAscii As Integer)
        return true;
      };

      var columnButtonClick = function(key,  lRow,  lCol,  iKeyAscii) {

      };

      var columnClick = function(key,  lRow,  lCol) {

      };

      var dblClick = function(key,  lRow,  lCol) {

      };

      var deleteRow = function(key,  row,  lRow) {
        var id = null;

        switch (key) {
          case K_CHEQUES:
            id = Cairo.Util.val(Dialogs.cell(row, KICH_COBZI_ID).getValue());
            if(id !== Cairo.Constants.NO_ID) { m_chequesDeleted = m_chequesDeleted+ id.toString()+ ","; }
            break;

          case K_TARJETA:
            id = Cairo.Util.val(Dialogs.cell(row, KIT_COBZI_ID).getValue());
            if(id !== Cairo.Constants.NO_ID) { m_tarjetasDeleted = m_tarjetasDeleted+ id.toString()+ ","; }
            break;

          case K_EFECTIVO:
            id = Cairo.Util.val(Dialogs.cell(row, KIE_COBZI_ID).getValue());
            if(id !== Cairo.Constants.NO_ID) { m_efectivoDeleted = m_efectivoDeleted+ id.toString()+ ","; }
            break;

          case K_OTROS:
            id = Cairo.Util.val(Dialogs.cell(row, KIO_COBZI_ID).getValue());
            if(id !== Cairo.Constants.NO_ID) { m_otrosDeleted = m_otrosDeleted+ id.toString()+ ","; }
            break;

          case K_CTACTE:
            id = Cairo.Util.val(Dialogs.cell(row, KIO_COBZI_ID).getValue());
            if(id !== Cairo.Constants.NO_ID) { m_ctaCteDeleted = m_ctaCteDeleted+ id.toString()+ ","; }
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
            case K_CHEQUES:
              _rtn = pValidateRowCheques(row, rowIndex);
              break;

            case K_TARJETA:
              _rtn = pValidateRowTarjetas(row, rowIndex);
              break;

            case K_OTROS:
              _rtn = pValidateRowOtros(row, rowIndex);
              break;

            case K_EFECTIVO:
              _rtn = pValidateRowEfectivo(row, rowIndex);
              break;

            case K_CTACTE:
              _rtn = pValidateRowCtaCte(row, rowIndex);
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

      // funciones privadas
      var loadCollection = function() {
        var filter = null;
        var iTab = null;
        var c = null;
                #If PREPROC_SFS Then;
        var abmGen = null;
                #Else;
        var abmGen = null;
                #End If;

        abmGen = m_dialog;
        abmGen.ResetLayoutMembers;

        abmGen.setNoButtons2(csButtons.bUTTON_DOC_ACTION);
        abmGen.InitButtons;

        m_dialog.getProperties().clear();

        m_dialog.getTabs().clear();

        iTab = m_dialog.getTabs().add(null);
        iTab.setIndex(0);
        iTab.setName(Cairo.Constants.c_strGeneral);

        iTab = m_dialog.getTabs().add(null);
        iTab.setIndex(1);
        //'Adicionales
        iTab.setName(Cairo.Language.getText(1566, ""));

        c = m_dialog.getProperties().add(null, mTesoreriaConstantes.DOC_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(CSDocumento2.CSDocumento);
        //'Documento
        c.setName(Cairo.Language.getText(1567, ""));
        c.setKey(K_DOC_ID);
        c.setSelectId(m_doc_id);
        c.setValue(m_documento);
        c.setSelectFilter("'doct_id = "+ csEDocumentoTipo.cSEDT_COBRANZA.toString()+ "'");

        c = m_dialog.getProperties().add(null, cDeclarations.getCsDocNumberID());
        c.setType(Dialogs.PropertyType.numeric);
        c.setSubType(Dialogs.PropertySubType.Integer);
        //'Número
        c.setName(Cairo.Language.getText(1065, ""));
        c.setKey(K_NUMERO);
        c.setValue(m_numero);
        c.setEnabled(false);

        c = m_dialog.getProperties().add(null, cDeclarations.getCsDocEstateID());
        c.setType(Dialogs.PropertyType.text);
        //'Estado
        c.setName(Cairo.Language.getText(1568, ""));
        c.setKey(K_EST_ID);
        c.setValue(m_estado);
        c.setEnabled(false);

        c = m_dialog.getProperties().add(null, mTesoreriaConstantes.COBZ_FECHA);
        c.setType(Dialogs.PropertyType.date);
        //'Fecha
        c.setName(Cairo.Language.getText(1569, ""));
        c.setLeftLabel(-580);
        c.setLeft(700);
        c.setKey(K_FECHA);
        c.setValue(m_fecha);

        c = m_dialog.getProperties().add(null, mTesoreriaConstantes.CLI_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(Cairo.Tables.CLIENTE);
        c.setTopFromProperty(mTesoreriaConstantes.COBZ_FECHA);
        c.setLeft(2700);
        c.setLeftLabel(-580);
        //'Cliente
        c.setName(Cairo.Language.getText(1150, ""));
        c.setKey(K_CLI_ID);
        c.setSelectId(m_cli_id);
        c.setValue(m_cliente);

        c = m_dialog.getProperties().add(null, mTesoreriaConstantes.COBZ_NRODOC);
        c.setType(Dialogs.PropertyType.text);
        //'Número
        c.setName(Cairo.Language.getText(1065, ""));
        c.setSize(50);
        c.setKey(K_NRODOC);
        c.setValue(m_nrodoc);
        c.setTextMask(m_taMascara);
        c.setTextAlign(vbRightJustify);

        c = m_dialog.getProperties().add(null, mTesoreriaConstantes.COB_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(Cairo.Tables.COBRADOR);
        c.setTopFromProperty(mTesoreriaConstantes.CLI_ID);
        c.setLeft(5900);
        c.setLeftLabel(-800);
        //'Cobrador
        c.setName(Cairo.Language.getText(1088, ""));
        c.setKey(K_COB_ID);
        c.setSelectId(m_cob_id);
        c.setValue(m_cobrador);

        c = m_dialog.getProperties().add(null, mTesoreriaConstantes.LGJ_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(CSLEGAJO);
        //'Legajo
        c.setName(Cairo.Language.getText(1575, ""));
        c.setKey(K_LGJ_ID);
        c.setSelectId(m_lgj_id);
        c.setValue(m_legajo);
        c.setTabIndex(1);

        c = m_dialog.getProperties().add(null, mTesoreriaConstantes.COBZ_COTIZACION);
        c.setType(Dialogs.PropertyType.numeric);
        c.setSubType(Dialogs.PropertySubType.money);
        c.setLeftLabel(-800);
        //'Cotización
        c.setName(Cairo.Language.getText(1635, ""));
        c.setFormat(m_generalConfig.getFormatDecCotizacion());
        c.setKey(K_COTIZACION);
        c.setValue(m_cotizacion);
        c.setWidth(1000);

        c = m_dialog.getProperties().add(null, mTesoreriaConstantes.CCOS_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(Cairo.Tables.CENTROCOSTO);
        c.setLeft(9500);
        c.setTopFromProperty(mTesoreriaConstantes.CLI_ID);
        //'Centro de Costo
        c.setName(Cairo.Language.getText(1057, ""));
        c.setKey(K_CCOS_ID);
        c.setSelectId(m_ccos_id);
        c.setValue(m_centroCosto);

        c = m_dialog.getProperties().add(null, mTesoreriaConstantes.SUC_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(Cairo.Tables.SUCURSAL);
        //'Sucursal
        c.setName(Cairo.Language.getText(1281, ""));
        c.setKey(K_SUC_ID);
        c.setSelectId(m_suc_id);
        c.setValue(m_sucursal);

        c = m_dialog.getProperties().add(null, mTesoreriaConstantes.COBZ_DESCRIP);
        c.setType(Dialogs.PropertyType.text);
        c.setSubType(Dialogs.PropertySubType.memo);
        //'Observ.
        c.setName(Cairo.Language.getText(1211, ""));
        c.setLeftLabel(-600);
        c.setSize(5000);
        c.setKey(K_DESCRIP);
        c.setValue(m_descrip);
        c.setLeftFromProperty(mTesoreriaConstantes.COBZ_FECHA);
        c.setTopFromProperty(mTesoreriaConstantes.COBZ_NRODOC);
        c.setWidth(11070);
        c.setHeight(800);
        c.setTopToPrevious(440);

        if(!m_dialog.show(self)) { return false; }

        /////////////////////////////////////////////////////////////////////
        // ITEMS
        /////////////////////////////////////////////////////////////////////

        m_items.getTabs().clear();

        var c_TabCheque = 0;
        var c_TabEfectivo = 1;
        var c_TabTarjeta = 2;
        var c_TabOtros = 3;
        var c_TabCtaCte = 4;

        iTab = m_items.getTabs().add(null);
        iTab.setIndex(c_TabCheque);
        //'Cheques
        iTab.setName(Cairo.Language.getText(2099, ""));

        iTab = m_items.getTabs().add(null);
        iTab.setIndex(c_TabEfectivo);
        //'Efectivo
        iTab.setName(Cairo.Language.getText(2100, ""));

        iTab = m_items.getTabs().add(null);
        iTab.setIndex(c_TabTarjeta);
        //'Tarjetas
        iTab.setName(Cairo.Language.getText(2101, ""));

        iTab = m_items.getTabs().add(null);
        iTab.setIndex(c_TabOtros);
        //'Otros
        iTab.setName(Cairo.Language.getText(1070, ""));

        iTab = m_items.getTabs().add(null);
        iTab.setIndex(c_TabCtaCte);
        //'Cta Corriente
        iTab.setName(Cairo.Language.getText(2102, ""));

        abmGen = m_items;
        abmGen.ResetLayoutMembers;
        m_items.getProperties().clear();

        ///////////////////////////////////////////////////////////////////
        // CHEQUES
        c = m_items.getProperties().add(null, C_CHEQUES);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);

        setGridCheques(c);
        if(!pLoadCheques(c)) { return false; }
        c.setName(C_CHEQUES);
        c.setKey(K_CHEQUES);
        c.setTabIndex(c_TabCheque);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        m_chequesDeleted = "";

        ///////////////////////////////////////////////////////////////////
        // EFECTIVO
        c = m_items.getProperties().add(null, C_EFECTIVO);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);

        setGridEfectivo(c);
        if(!pLoadEfectivo(c)) { return false; }
        c.setName(C_EFECTIVO);
        c.setKey(K_EFECTIVO);
        c.setTabIndex(c_TabEfectivo);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        m_efectivoDeleted = "";

        ///////////////////////////////////////////////////////////////////
        // TARJETAS
        c = m_items.getProperties().add(null, C_TARJETA);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);

        setGridTarjetas(c);
        if(!pLoadTarjetas(c)) { return false; }
        c.setName(C_TARJETA);
        c.setKey(K_TARJETA);
        c.setTabIndex(c_TabTarjeta);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        m_tarjetasDeleted = "";

        ///////////////////////////////////////////////////////////////////
        // OTROS
        c = m_items.getProperties().add(null, C_OTROS);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);

        setGridOtros(c);
        if(!pLoadOtros(c)) { return false; }
        c.setName(C_OTROS);
        c.setKey(K_OTROS);
        c.setTabIndex(c_TabOtros);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        m_otrosDeleted = "";

        ///////////////////////////////////////////////////////////////////
        // CTA CTE
        c = m_items.getProperties().add(null, C_CTACTE);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);

        setGridCtaCte(c);
        if(!pLoadCtaCte(c)) { return false; }
        c.setName(C_CTACTE);
        c.setKey(K_CTACTE);
        c.setTabIndex(c_TabCtaCte);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        m_ctaCteDeleted = "";

        if(!m_items.show(self)) { return false; }

        /////////////////////////////////////////////////////////////////////
        // FOOTER
        /////////////////////////////////////////////////////////////////////

        abmGen = m_footer;
        abmGen.ResetLayoutMembers;
        m_footer.getProperties().clear();

        c = m_footer.getProperties().add(null, mTesoreriaConstantes.COBZ_NETO);
        c.setType(Dialogs.PropertyType.numeric);
        c.setSubType(Dialogs.PropertySubType.money);
        //'Neto
        c.setName(Cairo.Language.getText(1581, ""));
        c.setKey(K_NETO);
        c.setValue(m_neto);
        c.setFormat(m_generalConfig.getFormatDecImporte());
        c.setEnabled(false);

        c = m_footer.getProperties().add(null, mTesoreriaConstantes.COBZ_OTROS);
        c.setType(Dialogs.PropertyType.numeric);
        c.setSubType(Dialogs.PropertySubType.money);
        //'Otros
        c.setName(Cairo.Language.getText(1070, ""));
        c.setKey(K_OTROS);
        c.setValue(m_otros);
        c.setFormat(m_generalConfig.getFormatDecImporte());
        c.setEnabled(false);

        c = m_footer.getProperties().add(null, mTesoreriaConstantes.COBZ_TOTAL);
        c.setType(Dialogs.PropertyType.numeric);
        c.setFormat(m_generalConfig.getFormatDecImporte());
        //'Total
        c.setName(Cairo.Language.getText(1584, ""));
        c.setSubType(Dialogs.PropertySubType.money);
        c.setKey(K_TOTAL);
        c.setValue(m_total);
        c.setEnabled(false);

        pSetEnabled();

        if(!m_footer.show(self)) { return false; }

        // Se hace al final para evitar que se muestre el
        // form antes de tiempo
        //
        pSetFilterColFactura();

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        return m_dialog.showValues(properties);
      };

      var setGridOtros = function(property) {
        var grid = null;

        property.getGrid().getColumns().clear();
        property.getGrid().getRows().clear();

        grid = property.getGrid();

        var w_columns = grid.getColumns();
        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIO_COBZI_ID);

        var elem = w_columns.add(null);
        //'Cuenta
        elem.setName(Cairo.Language.getText(1267, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setWidth(2200);
        elem.setKey(KIO_CUE_ID);
        elem.setSelectFilter("(emp_id = "+ cUtil.getEmpId().toString()+ " or emp_id is null)");

        var elem = w_columns.add(null);
        //'Debe
        elem.setName(Cairo.Language.getText(1904, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KIO_DEBE);

        var elem = w_columns.add(null);
        //'Haber
        elem.setName(Cairo.Language.getText(1905, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KIO_HABER);

        var elem = w_columns.add(null);
        //'Origen
        elem.setName(Cairo.Language.getText(1901, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KIO_IMPORTEORIGEN);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setWidth(1000);
        elem.setKey(KIO_DESCRIP);

        var elem = w_columns.add(null);
        //'Retención
        elem.setName(Cairo.Language.getText(1403, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.RETENCION);
        elem.setWidth(1500);
        elem.setKey(KIO_RET_ID);

        var elem = w_columns.add(null);
        //'C. Retención
        elem.setName(Cairo.Language.getText(2103, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1200);
        elem.setKey(KIO_NRORETENCION);

        var elem = w_columns.add(null);
        //'% Retención
        elem.setName(Cairo.Language.getText(2104, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
        elem.setWidth(1200);
        elem.setKey(KIO_PORCRETENCION);

        var elem = w_columns.add(null);
        //'Vto.
        elem.setName(Cairo.Language.getText(1634, ""));
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(920);
        elem.setKey(KIO_FECHARETENCION);

        var elem = w_columns.add(null);
        //'Centro de Costo
        elem.setName(Cairo.Language.getText(1057, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTROCOSTO);
        elem.setWidth(1800);
        elem.setKey(KIO_CCOS_ID);

        var elem = w_columns.add(null, mTesoreriaConstantes.FV_ID_RET);
        //' Factura
        elem.setName(Cairo.Language.getText(1866, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(csFacturaVenta);
        elem.setWidth(1200);
        elem.setKey(KIO_FV_ID_RET);

        var f = null;
        var fv = null;

        for(var _i = 0; _i < m_data.otros.length; _i += 1) {

          f = property.getGrid().getRows().add(null, rs(mTesoreriaConstantes.COBZI_ID).Value);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.COBZI_ID));
          fv.setKey(KIO_COBZI_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.CUE_NAME));
          fv.setID(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.CUE_ID));
          fv.setKey(KIO_CUE_ID);

          fv = f.add(null);
          if(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.COBZI_OTRO_TIPO) === csEItemOtroTipo.cSEOTRODEBE) {
            fv.setValue(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.COBZI_IMPORTE));
          }
          else {
            fv.setValue(0);
          }
          fv.setKey(KIO_DEBE);

          fv = f.add(null);
          if(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.COBZI_OTRO_TIPO) === csEItemOtroTipo.cSEOTROHABER) {
            fv.setValue(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.COBZI_IMPORTE));
          }
          else {
            fv.setValue(0);
          }
          fv.setKey(KIO_HABER);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.COBZI_IMPORTE_ORIGEN));
          fv.setKey(KIO_IMPORTEORIGEN);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.COBZI_DESCRIP));
          fv.setKey(KIO_DESCRIP);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.RET_NAME));
          fv.setID(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.RET_ID));
          fv.setKey(KIO_RET_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.COBZI_NRO_RETENCION));
          fv.setKey(KIO_NRORETENCION);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.COBZI_PORC_RETENCION));
          fv.setKey(KIO_PORCRETENCION);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.COBZI_FECHA_RETENCION));
          fv.setKey(KIO_FECHARETENCION);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.CCOS_NAME));
          fv.setID(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.CCOS_ID));
          fv.setKey(KIO_CCOS_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.FV_NRODOC));
          fv.setID(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.FV_ID_RET));
          fv.setKey(KIO_FV_ID_RET);

        }

        return true;
      };

      var setGridCheques = function(property) {

        var w_grid = property.getGrid();

        w_grid.getColumns().clear();
        w_grid.getRows().clear();

        var w_columns = w_grid.getColumns();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KICH_COBZI_ID);

        var elem = w_columns.add(null);
        //'Cuenta
        elem.setName(Cairo.Language.getText(1267, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);

        //.HelpFilter = "(" & cscCuecId & "=" & csECuecBancos & " or " & _
        mTesoreriaConstantes.CUEC_ID(+ "="+ csECuentaCategoria.cSECUECDOCENCARTERA.toString()+ ")");
        elem.setSelectFilter(mPublic.self.getHelpFilterCheques());

        elem.setWidth(2200);
        elem.setKey(KICH_CUE_ID);

        var elem = w_columns.add(null);
        //'Mon
        elem.setName(Cairo.Language.getText(2063, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setWidth(520);
        elem.setKey(KICH_MON_ID);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        //'Origen
        elem.setName(Cairo.Language.getText(1901, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KICH_IMPORTEORIGEN);

        var elem = w_columns.add(null);
        //'Importe
        elem.setName(Cairo.Language.getText(1228, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KICH_IMPORTE);

        var elem = w_columns.add(null);
        //'Banco
        elem.setName(Cairo.Language.getText(1122, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.BANCO);
        elem.setWidth(1620);
        elem.setKey(KICH_BCO_ID);

        var elem = w_columns.add(null);
        //'Nro. Cheque
        elem.setName(Cairo.Language.getText(2059, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(KICH_CHEQUE);

        var elem = w_columns.add(null);
        //'Cheque
        elem.setName(Cairo.Language.getText(2058, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(KICH_CHEQ_ID);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        //'Propio
        elem.setName(Cairo.Language.getText(3719, ""));
        elem.setType(Dialogs.PropertyType.check);
        elem.setWidth(800);
        elem.setKey(KICH_PROPIO);

        var elem = w_columns.add(null);
        //'Depositar el
        elem.setName(Cairo.Language.getText(2065, ""));
        elem.setType(Dialogs.PropertyType.date);
        elem.setDefaultValue(new cABMGridRowValue());
        elem.getDefaultValue().setValue(Date);
        elem.setWidth(970);
        elem.setKey(KICH_FECHACOBRO);

        var elem = w_columns.add(null);
        //'Vto.
        elem.setName(Cairo.Language.getText(1634, ""));
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(970);
        elem.setDefaultValue(new cABMGridRowValue());
        elem.getDefaultValue().setValue(DateAdd("m", 1, Date));
        elem.setKey(KICH_FECHAVTO);

        var elem = w_columns.add(null);
        //'Clering
        elem.setName(Cairo.Language.getText(1083, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CLEARING);
        elem.setWidth(800);
        elem.setKey(KICH_CLE_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setWidth(1600);
        elem.setKey(KICH_DESCRIP);

        var w_rows = w_grid.getRows();

        for(var _i = 0; _i < m_data.cheques.length; _i += 1) {

          var elem = w_rows.add(null, rs(mTesoreriaConstantes.COBZI_ID).Value);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.COBZI_ID);
          elem.setKey(KICH_COBZI_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.CUE_NAME);
          elem.Id = Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.CUE_ID);
          elem.setKey(KICH_CUE_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.MON_NAME);
          elem.Id = Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.MON_ID);
          elem.setKey(KICH_MON_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.COBZI_IMPORTE_ORIGEN);
          elem.setKey(KICH_IMPORTEORIGEN);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.COBZI_IMPORTE);
          elem.setKey(KICH_IMPORTE);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.BCO_NAME);
          elem.Id = Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.BCO_ID);
          elem.setKey(KICH_BCO_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.CHEQ_NUMERO_DOC);
          elem.setKey(KICH_CHEQUE);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.CHEQ_NUMERO);
          elem.Id = Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.CHEQ_ID);
          elem.setKey(KICH_CHEQ_ID);

          var elem = elem.add(null);
          elem.Id = Cairo.Database.valField(m_data.cheques[_i], "cheq_propio");
          elem.setKey(KICH_PROPIO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.CHEQ_FECHA_COBRO);
          elem.setKey(KICH_FECHACOBRO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.CHEQ_FECHA_VTO);
          elem.setKey(KICH_FECHAVTO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.CLE_NAME);
          elem.Id = Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.CLE_ID);
          elem.setKey(KICH_CLE_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.COBZI_DESCRIP);
          elem.setKey(KICH_DESCRIP);

        }

        return true;
      };

      var setGridEfectivo = function(property) {
        var grid = null;

        property.getGrid().getColumns().clear();
        property.getGrid().getRows().clear();

        grid = property.getGrid();

        var w_columns = grid.getColumns();
        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIE_COBZI_ID);

        var elem = w_columns.add(null);
        //'Cuenta
        elem.setName(Cairo.Language.getText(1267, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);

        //.HelpFilter = cscCuecId & "=" & csECuecCaja & " or " & cscCuecId & "=" & csECuecBancos
        elem.setSelectFilter(mPublic.self.getHelpFilterEfectivo());

        elem.setWidth(3000);
        elem.setKey(KIE_CUE_ID);

        var elem = w_columns.add(null);
        //'Mon
        elem.setName(Cairo.Language.getText(2063, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setWidth(520);
        elem.setKey(KIE_MON_ID);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        //'Origen
        elem.setName(Cairo.Language.getText(1901, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KIE_IMPORTEORIGEN);

        var elem = w_columns.add(null);
        //'Importe
        elem.setName(Cairo.Language.getText(1228, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KIE_IMPORTE);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setWidth(2500);
        elem.setKey(KIE_DESCRIP);

        var f = null;
        var fv = null;

        for(var _i = 0; _i < m_data.efectivo.length; _i += 1) {

          f = property.getGrid().getRows().add(null, rs(mTesoreriaConstantes.COBZI_ID).Value);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.efectivo[_i], mTesoreriaConstantes.COBZI_ID));
          fv.setKey(KIE_COBZI_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.efectivo[_i], mTesoreriaConstantes.CUE_NAME));
          fv.setID(Cairo.Database.valField(m_data.efectivo[_i], mTesoreriaConstantes.CUE_ID));
          fv.setKey(KIE_CUE_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.efectivo[_i], mTesoreriaConstantes.MON_NAME));
          fv.setID(Cairo.Database.valField(m_data.efectivo[_i], mTesoreriaConstantes.MON_ID));
          fv.setKey(KIE_MON_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.efectivo[_i], mTesoreriaConstantes.COBZI_IMPORTE_ORIGEN));
          fv.setKey(KIE_IMPORTEORIGEN);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.efectivo[_i], mTesoreriaConstantes.COBZI_IMPORTE));
          fv.setKey(KIE_IMPORTE);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.efectivo[_i], mTesoreriaConstantes.COBZI_DESCRIP));
          fv.setKey(KIE_DESCRIP);

        }

        return true;
      };

      var setGridTarjetas = function(property) {
        var grid = null;

        property.getGrid().getColumns().clear();
        property.getGrid().getRows().clear();

        grid = property.getGrid();

        var w_columns = grid.getColumns();
        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIT_COBZI_ID);

        var elem = w_columns.add(null);
        //'Número
        elem.setName(Cairo.Language.getText(1065, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(900);
        elem.setKey(KIT_TJCC_ID);

        var elem = w_columns.add(null);
        //'Cupon
        elem.setName(Cairo.Language.getText(2105, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1500);
        elem.setKey(KIT_CUPON);

        var elem = w_columns.add(null);
        //'Tarjeta
        elem.setName(Cairo.Language.getText(2106, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TARJETACREDITO);
        elem.setWidth(1800);
        elem.setKey(KIT_TJC_ID);

        var elem = w_columns.add(null, C_CUOTAS);
        //'Cuotas
        elem.setName(Cairo.Language.getText(1473, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TARJETACREDITOCUOTA);
        elem.setWidth(1800);
        elem.setKey(KIT_TJCCU_ID);
        m_lColCuotas = w_columns.count();

        var elem = w_columns.add(null);
        //'Mon
        elem.setName(Cairo.Language.getText(2063, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setWidth(520);
        elem.setKey(KIT_MON_ID);

        var elem = w_columns.add(null);
        //'Origen
        elem.setName(Cairo.Language.getText(1901, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KIT_IMPORTEORIGEN);

        var elem = w_columns.add(null);
        //'Importe
        elem.setName(Cairo.Language.getText(1228, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KIT_IMPORTE);

        var elem = w_columns.add(null);
        //'Vto.
        elem.setName(Cairo.Language.getText(1634, ""));
        elem.setType(Dialogs.PropertyType.date);
        elem.setDefaultValue(new cABMGridRowValue());
        elem.getDefaultValue().setValue(DateAdd("d", 1, Date));
        elem.setWidth(970);
        elem.setKey(KIT_FECHAVTO);

        var elem = w_columns.add(null);
        //'Nro. Tarjeta
        elem.setName(Cairo.Language.getText(2107, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1300);
        elem.setKey(KIT_NROTARJETA);

        var elem = w_columns.add(null);
        //'Cod. Autoriz.
        elem.setName(Cairo.Language.getText(2123, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(KIT_NROAUTORIZACION);

        var elem = w_columns.add(null);
        //'Operacion
        elem.setName(Cairo.Language.getText(2108, ""));
        elem.setType(Dialogs.PropertyType.list);
        var elem = elem.add(null);
        elem.Id = csECuponTipo.cSECUPONPOSNET;
        //'Posnet
        elem.Value = Cairo.Language.getText(2110, "");
        var elem = elem.add(null);
        elem.Id = csECuponTipo.cSECUPONMANUAL;
        //'Manual
        elem.Value = Cairo.Language.getText(2111, "");
        elem.setDefaultValue(new cABMGridRowValue());
        elem.getDefaultValue().setID(csECuponTipo.cSECUPONPOSNET);
        elem.setWidth(1000);
        elem.setKey(KIT_TARJETA_TIPO);

        var elem = w_columns.add(null);
        //'Titular
        elem.setName(Cairo.Language.getText(2109, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(KIT_TITULAR);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setWidth(1300);
        elem.setKey(KIT_DESCRIP);

        var f = null;
        var fv = null;

        for(var _i = 0; _i < m_data.tarjetas.length; _i += 1) {

          f = property.getGrid().getRows().add(null, rs(mTesoreriaConstantes.COBZI_ID).Value);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tarjetas[_i], mTesoreriaConstantes.COBZI_ID));
          fv.setKey(KIT_COBZI_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tarjetas[_i], mTesoreriaConstantes.TJCC_NUMERO));
          fv.setID(Cairo.Database.valField(m_data.tarjetas[_i], mTesoreriaConstantes.TJCC_ID));
          fv.setKey(KIT_TJCC_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tarjetas[_i], mTesoreriaConstantes.TJCC_NUMERO_DOC));
          fv.setKey(KIT_CUPON);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tarjetas[_i], mTesoreriaConstantes.TJC_NAME));
          fv.setID(Cairo.Database.valField(m_data.tarjetas[_i], mTesoreriaConstantes.TJC_ID));
          fv.setKey(KIT_TJC_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tarjetas[_i], mTesoreriaConstantes.TJCCU_CANTIDAD));
          fv.setID(Cairo.Database.valField(m_data.tarjetas[_i], mTesoreriaConstantes.TJCCU_ID));
          fv.setKey(KIT_TJCCU_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tarjetas[_i], mTesoreriaConstantes.MON_NAME));
          fv.setID(Cairo.Database.valField(m_data.tarjetas[_i], mTesoreriaConstantes.MON_ID));
          fv.setKey(KIT_MON_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tarjetas[_i], mTesoreriaConstantes.COBZI_IMPORTE_ORIGEN));
          fv.setKey(KIT_IMPORTEORIGEN);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tarjetas[_i], mTesoreriaConstantes.COBZI_IMPORTE));
          fv.setKey(KIT_IMPORTE);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tarjetas[_i], mTesoreriaConstantes.TJCC_FECHAVTO));
          fv.setKey(KIT_FECHAVTO);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tarjetas[_i], mTesoreriaConstantes.TJCC_NRO_TARJETA));
          fv.setKey(KIT_NROTARJETA);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tarjetas[_i], mTesoreriaConstantes.TJCC_NRO_AUTORIZACION));
          fv.setKey(KIT_NROAUTORIZACION);

          fv = f.add(null);
          fv.setID(Cairo.Database.valField(m_data.tarjetas[_i], mTesoreriaConstantes.COBZI_TARJETA_TIPO));
          fv.setKey(KIT_TARJETA_TIPO);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tarjetas[_i], mTesoreriaConstantes.TJCC_TITULAR));
          fv.setKey(KIT_TITULAR);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tarjetas[_i], mTesoreriaConstantes.COBZI_DESCRIP));
          fv.setKey(KIT_DESCRIP);

        }

        return true;
      };

      var setGridCtaCte = function(property) {
        var grid = null;

        property.getGrid().getColumns().clear();
        property.getGrid().getRows().clear();

        grid = property.getGrid();

        var w_columns = grid.getColumns();
        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KICC_COBZI_ID);

        var elem = w_columns.add(null);
        //'Cuenta
        elem.setName(Cairo.Language.getText(1267, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setWidth(3000);
        elem.setKey(KICC_CUE_ID);

        var elem = w_columns.add(null);
        //'Origen
        elem.setName(Cairo.Language.getText(1901, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KICC_IMPORTEORIGEN);

        var elem = w_columns.add(null);
        //'Importe
        elem.setName(Cairo.Language.getText(1228, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KICC_IMPORTE);

        var f = null;
        var fv = null;

        for(var _i = 0; _i < m_data.ctaCte.length; _i += 1) {

          f = property.getGrid().getRows().add(null, rs(mTesoreriaConstantes.COBZI_ID).Value);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.ctaCte[_i], mTesoreriaConstantes.COBZI_ID));
          fv.setKey(KICC_COBZI_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.ctaCte[_i], mTesoreriaConstantes.CUE_NAME));
          fv.setID(Cairo.Database.valField(m_data.ctaCte[_i], mTesoreriaConstantes.CUE_ID));
          fv.setKey(KICC_CUE_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.ctaCte[_i], mTesoreriaConstantes.COBZI_IMPORTE_ORIGEN));
          fv.setKey(KICC_IMPORTEORIGEN);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.ctaCte[_i], mTesoreriaConstantes.COBZI_IMPORTE));
          fv.setKey(KICC_IMPORTE);

        }

        return true;
      };

      var load = function(id) {

        var apiPath = Cairo.Database.getAPIVersion();
        return Cairo.Database.getData("load[" + apiPath + "general/cobranza]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== Cairo.Constants.NO_ID) {

              m_isNew = false;

              m_id = Cairo.Database.valField(response.data, mTesoreriaConstantes.COBZ_ID);
              m_numero = Cairo.Database.valField(response.data, mTesoreriaConstantes.COBZ_NUMERO);
              m_nrodoc = Cairo.Database.valField(response.data, mTesoreriaConstantes.COBZ_NRODOC);
              m_descrip = Cairo.Database.valField(response.data, mTesoreriaConstantes.COBZ_DESCRIP);
              m_fecha = Cairo.Database.valField(response.data, mTesoreriaConstantes.COBZ_FECHA);
              m_neto = Cairo.Database.valField(response.data, mTesoreriaConstantes.COBZ_NETO);
              m_total = Cairo.Database.valField(response.data, mTesoreriaConstantes.COBZ_TOTAL);
              m_otros = Cairo.Database.valField(response.data, mTesoreriaConstantes.COBZ_OTROS);
              m_cotizacion = Cairo.Database.valField(response.data, mTesoreriaConstantes.COBZ_COTIZACION);
              m_cli_id = Cairo.Database.valField(response.data, mTesoreriaConstantes.CLI_ID);
              m_cliente = Cairo.Database.valField(response.data, mTesoreriaConstantes.CLI_NAME);
              m_ccos_id = Cairo.Database.valField(response.data, mTesoreriaConstantes.CCOS_ID);
              m_centroCosto = Cairo.Database.valField(response.data, mTesoreriaConstantes.CCOS_NAME);
              m_suc_id = Cairo.Database.valField(response.data, mTesoreriaConstantes.SUC_ID);
              m_sucursal = Cairo.Database.valField(response.data, mTesoreriaConstantes.SUC_NAME);
              m_doc_id = Cairo.Database.valField(response.data, mTesoreriaConstantes.DOC_ID);
              m_documento = Cairo.Database.valField(response.data, mTesoreriaConstantes.DOC_NAME);
              m_doct_id = Cairo.Database.valField(response.data, mTesoreriaConstantes.DOCT_ID);
              m_cob_id = Cairo.Database.valField(response.data, mTesoreriaConstantes.COB_ID);
              m_cobrador = Cairo.Database.valField(response.data, mTesoreriaConstantes.COB_NAME);
              m_lgj_id = Cairo.Database.valField(response.data, mTesoreriaConstantes.LGJ_ID);
              m_legajo = Cairo.Database.valField(response.data, mTesoreriaConstantes.LGJ_CODE);
              m_creado = Cairo.Database.valField(response.data, Cairo.Constants.CREADO);
              m_modificado = Cairo.Database.valField(response.data, Cairo.Constants.MODIFICADO);
              m_modifico = Cairo.Database.valField(response.data, Cairo.Constants.MODIFICO);
              m_est_id = Cairo.Database.valField(response.data, Cairo.Constants.EST_ID);
              m_estado = Cairo.Database.valField(response.data, Cairo.Constants.EST_NAME);
              m_firmado = Cairo.Database.valField(response.data, mTesoreriaConstantes.COBZ_FIRMADO);
              m_docEditable = Cairo.Database.valField(response.data, Cairo.Constants.DOC_EDITABLE);
              m_docEditMsg = Cairo.Database.valField(response.data, Cairo.Constants.DOCEDIT_MSG);

              // Para ver documentos auxiliares
              //
              m_as_id = Cairo.Database.valField(response.data, mTesoreriaConstantes.AS_ID);

              m_taPropuesto = Cairo.Database.valField(response.data, Cairo.Constants.TA__PROPUESTO);
              m_taMascara = Cairo.Database.valField(response.data, Cairo.Constants.TA__MASCARA);

              m_lastDoc = m_doc_id;
              m_lastCli = m_cli_id;
              m_lastDocName = m_documento;
              m_lastCliName = m_cliente;

            }
            else {
              m_id = Cairo.Constants.NO_ID;
              m_numero = 0;
              m_nrodoc = "";
              m_descrip = "";
              m_fecha = VDGetDateById(csDateEnum.cSTODAY);
              m_neto = 0;
              m_total = 0;
              m_otros = 0;
              m_cli_id = Cairo.Constants.NO_ID;
              m_cliente = "";
              m_ccos_id = Cairo.Constants.NO_ID;
              m_centroCosto = "";
              m_doc_id = Cairo.Constants.NO_ID;
              m_documento = "";
              m_doct_id = Cairo.Constants.NO_ID;
              m_cob_id = Cairo.Constants.NO_ID;
              m_cobrador = "";
              m_lgj_id = Cairo.Constants.NO_ID;
              m_legajo = "";
              m_cotizacion = 0;
              m_creado = Cairo.Constants.cSNODATE;
              m_modificado = Cairo.Constants.cSNODATE;
              m_modifico = 0;
              m_est_id = Cairo.Constants.NO_ID;
              m_estado = "";
              m_suc_id = cUtil.getUser().getSuc_id();
              m_sucursal = cUtil.getUser().getSucursal();
              m_firmado = false;

              // Para ver documentos auxiliares
              //
              m_as_id = Cairo.Constants.NO_ID;

              m_taPropuesto = false;
              m_taMascara = "";

              m_doc_id = m_lastDoc;
              m_cli_id = m_lastCli;
              m_cliente = m_lastCliName;
              m_documento = m_lastDocName;

              DocEditableGet(m_doc_id, m_docEditable, m_docEditMsg, csTesoreriaPrestacion.cSPRETSRNEWCOBRANZA);
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

      var pSetEnabled = function() {
        var bState = null;
        var prop = null;

        if(m_docEditable && ((Not m_isNew) || m_copy)) {
          bState = m_dialog.getProperties().item(mTesoreriaConstantes.DOC_ID).getSelectId() !== Cairo.Constants.NO_ID;
        }
        else {
          bState = false;
        }

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          prop = m_dialog.getProperties().item(_i);
          if(prop.getKey() !== K_DOC_ID && prop.getKey() !== K_NUMERO && prop.getKey() !== K_EST_ID) {

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

      var pGetCueIdCliente = function(cue_id) { // TODO: Use of ByRef founded Private Function pGetCueIdCliente(ByRef cue_id As Long) As Boolean
        var sqlstmt = null;
        var rs = null;

        // Cuenta contable del cliente
        sqlstmt = "sp_DocGetCueId "+ m_lastCli+ ","+ m_lastDoc;
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

        if(rs.isEOF()) { return false; }

        cue_id = Cairo.Database.valField(rs.getFields(), mTesoreriaConstantes.CUE_ID);

        return true;
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
            //El documento ya ha sido firmado desea borrar la firma, Firmar
            return null;
          }
        }

        if(!doc.Firmar(m_doc_id, us_id)) { return false; }

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_DocCobranzaFirmar "+ m_id+ ","+ us_id.toString();
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

        m_est_id = Cairo.Database.valField(rs.getFields(), Cairo.Constants.EST_ID);
        m_estado = Cairo.Database.valField(rs.getFields(), Cairo.Constants.EST_NAME);

        var iProp = null;
        iProp = m_dialog.getProperties().item(cDeclarations.getCsDocEstateID());

        iProp.setSelectId(m_est_id);
        iProp.setValue(m_estado);

        Cairo.Database.getData(mTesoreriaConstantes.COBRANZA, mTesoreriaConstantes.COBZ_ID, m_id, mTesoreriaConstantes.COBZ_FIRMADO, m_firmado);

        m_dialog.showValue(iProp);

        return true;
      };

      var pMove = function(moveTo) {
        var sqlstmt = null;
        var rs = null;
        var doc_id = null;

        doc_id = m_dialog.getProperties().item(mTesoreriaConstantes.DOC_ID).getSelectId();

        //'Debe seleccionar un documento
        if(doc_id === Cairo.Constants.NO_ID) { MsgInfo(Cairo.Language.getText(1595, "")); }

        sqlstmt = "sp_DocCobranzaMover "+ moveTo+ ","+ m_numero+ ","+ doc_id.toString();

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

              // Cargo un registro vacio
              //
              load(Cairo.Constants.NO_ID);

              // Refresco el formulario
              //
              pRefreshProperties();

              // Obtengo un nuevo numero de comprobante
              //
              GetDocNumber(m_lastDoc, m_dialog, m_taPropuesto, mTesoreriaConstantes.COBZ_NRODOC);

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

        c = properties.item(mTesoreriaConstantes.DOC_ID);
        c.setSelectId(m_doc_id);
        c.setValue(m_documento);

        c = properties.item(mTesoreriaConstantes.COBZ_FECHA);
        c.setValue(m_fecha);

        c = properties.item(mTesoreriaConstantes.CLI_ID);
        c.setSelectId(m_cli_id);
        c.setValue(m_cliente);

        c = properties.item(cDeclarations.getCsDocNumberID());
        c.setValue(m_numero);

        c = properties.item(cDeclarations.getCsDocEstateID());
        c.setValue(m_estado);

        c = properties.item(mTesoreriaConstantes.COBZ_NRODOC);
        c.setValue(m_nrodoc);
        c.setTextMask(m_taMascara);
        c.setTextAlign(vbRightJustify);

        c = properties.item(mTesoreriaConstantes.COB_ID);
        c.setSelectId(m_cob_id);
        c.setValue(m_cobrador);

        c = properties.item(mTesoreriaConstantes.COBZ_COTIZACION);
        c.setValue(m_cotizacion);

        c = properties.item(mTesoreriaConstantes.CCOS_ID);
        c.setSelectId(m_ccos_id);
        c.setValue(m_centroCosto);

        c = properties.item(mTesoreriaConstantes.SUC_ID);
        c.setSelectId(m_suc_id);
        c.setValue(m_sucursal);

        c = properties.item(mTesoreriaConstantes.LGJ_ID);
        c.setSelectId(m_lgj_id);
        c.setValue(m_legajo);

        c = properties.item(mTesoreriaConstantes.COBZ_DESCRIP);
        c.setValue(m_descrip);

        abmGen = m_dialog;
        abmGen.ShowValues(m_dialog.getProperties());

        abmGen.ResetChanged;

        c = pGetChequesProperty();
        if(!pLoadCheques(c)) { return; }

        m_chequesDeleted = "";

        c = pGetEfectivoProperty();
        if(!pLoadEfectivo(c)) { return; }

        m_efectivoDeleted = "";

        c = pGetTarjetasProperty();
        if(!pLoadTarjetas(c)) { return; }

        m_tarjetasDeleted = "";

        c = pGetOtrosProperty();
        if(!pLoadOtros(c)) { return; }

        m_otrosDeleted = "";

        c = pGetCtaCteProperty();
        if(!pLoadCtaCte(c)) { return; }

        m_ctaCteDeleted = "";

        abmGen = m_items;
        abmGen.ShowValues(m_items.getProperties());

        pSetFilterColFactura();

        var properties = m_footer.getProperties();

        c = properties.item(mTesoreriaConstantes.COBZ_OTROS);
        c.setValue(m_otros);

        c = properties.item(mTesoreriaConstantes.COBZ_NETO);
        c.setValue(m_neto);

        c = properties.item(mTesoreriaConstantes.COBZ_TOTAL);
        c.setValue(m_total);

        abmGen = m_footer;
        abmGen.ShowValues(m_footer.getProperties());

        pSetEnabled();
      };

      var pShowStartWizard = function(isHojaRuta) {
        try {

          var oWizard = null;
          oWizard = new cCobranzaWizard();

          if(!oWizard.self.load()) { return; }

          oWizard.self.setCli_id(m_cli_id);
          oWizard.self.setCliente() = m_cliente;
          oWizard.self.setFvIds() = m_fvIds;
          oWizard.self.setCliIds() = m_cliIds;
          oWizard.self.setFvIdsxCliId() = m_fvIdsxCliId;
          oWizard.self.setIsHojaRuta() = isHojaRuta;

          oWizard.self.setCobranzaInfo() = m_cobranzaInfo;
          oWizard.self.setObjClient(self);

          //Dim iEditGeneric As cIEditGeneric
          //Set iEditGeneric = oWizard
          //Set iEditGeneric.ObjTree = m_ObjTree

          var iObjWizard = null;
                  #If PREPROC_SFS Then;
          var oObjWizard = null;
          iObjWizard = CSKernelClient2.CreateObject("CSABMInterface2.cWizardGeneric");
                  #Else;
          var oObjWizard = null;
          iObjWizard = CSKernelClient2.CreateObject("CSABMInterface2.cWizardGenericDocEx");
                  #End If;

          oObjWizard = iObjWizard;
          oObjWizard.setObjClient(oWizard);
          oObjWizard.setPushVirtualNext(m_bPushVirtualNext);
          oObjWizard.setCloseWizardAfterSave(m_bCloseWizardAfterSave);

          iObjWizard.show("CSTesoreria2.cCobranzaWizard");

          if(!oObjWizard.getWizardClosed()) {

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

          //'Error al grabar la Cobranza
          c_ErrorSave = Cairo.Language.getText(2098, "");

          m_generalConfig = new cGeneralConfig();
          m_generalConfig.Load;
          G.redim(m_fvIds, 0);
          G.redim(m_cliIds, 0);
          G.redim(m_fvIdsxCliId, 0, 0);
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
          m_listController = null;
          m_footer = null;
          m_items = null;
          m_generalConfig = null;
          m_host = null;
          G.redim(m_fvIds, 0);
          G.redim(m_cliIds, 0);
          G.redim(m_fvIdsxCliId, 0, 0);
          m_cobranzaInfo = null;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "Class_Terminate", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      //////////////////////////////////////////////////////////////
      var pSaveCheques = function(id) {
        var register = null;
        var row = null;
        var cell = null;

        var _count = pGetCheques().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetCheques().getRows().item(_i);

          register = new cRegister();
          register.setFieldId(mTesoreriaConstantes.COBZI_TMPID);
          register.setTable(mTesoreriaConstantes.COBRANZAITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KICH_COBZI_ID:
                if(m_copy) {
                  register.getFields().add2(mTesoreriaConstantes.COBZI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.integer);
                }
                else {
                  register.getFields().add2(mTesoreriaConstantes.COBZI_ID, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.integer);
                }

                break;

              case KICH_DESCRIP:
                register.getFields().add2(mTesoreriaConstantes.COBZI_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);

                break;

              case KICH_CHEQ_ID:
                register.getFields().add2(mTesoreriaConstantes.CHEQ_ID, cell.getId(), Cairo.Constants.Types.id);

                break;

              case KICH_CHEQUE:
                register.getFields().add2(mTesoreriaConstantes.COBZI_TMPCHEQUE, cell.getValue(), Cairo.Constants.Types.text);

                break;

              case KICH_CLE_ID:
                register.getFields().add2(mTesoreriaConstantes.CLE_ID, cell.getId(), Cairo.Constants.Types.id);

                break;

              case KICH_BCO_ID:
                register.getFields().add2(mTesoreriaConstantes.BCO_ID, cell.getId(), Cairo.Constants.Types.id);

                break;

              case KICH_MON_ID:
                register.getFields().add2(mTesoreriaConstantes.MON_ID, cell.getId(), Cairo.Constants.Types.id);

                break;

              case KICH_PROPIO:
                register.getFields().add2(mTesoreriaConstantes.COBZI_TMPPROPIO, cell.getId(), Cairo.Constants.Types.boolean);

                break;

              case KICH_FECHACOBRO:
                register.getFields().add2(mTesoreriaConstantes.COBZI_TMPFECHA_COBRO, cell.getValue(), Cairo.Constants.Types.date);

                break;

              case KICH_FECHAVTO:
                register.getFields().add2(mTesoreriaConstantes.COBZI_TMPFECHA_VTO, cell.getValue(), Cairo.Constants.Types.date);

                break;

              case KICH_CUE_ID:
                register.getFields().add2(mTesoreriaConstantes.CUE_ID, cell.getId(), Cairo.Constants.Types.id);

                break;

              case KICH_IMPORTEORIGEN:
                register.getFields().add2(mTesoreriaConstantes.COBZI_IMPORTE_ORIGEN, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);

                break;

              case KICH_IMPORTE:
                register.getFields().add2(mTesoreriaConstantes.COBZI_IMPORTE, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                break;
            }
          }

          m_iOrden = m_iOrden + 1;
          register.getFields().add2(mTesoreriaConstantes.COBZI_ORDEN, m_iOrden, Cairo.Constants.Types.integer);
          register.getFields().add2(mTesoreriaConstantes.COBZI_TIPO, csECobranzaItemTipo.cSECOBZITCHEQUES, Cairo.Constants.Types.integer);
          register.getFields().add2(mTesoreriaConstantes.COBZ_TMPID, id, Cairo.Constants.Types.id);
          register.getFields().add2(mTesoreriaConstantes.COBZI_OTRO_TIPO, csEItemOtroTipo.cSEOTRODEBE, Cairo.Constants.Types.integer);

          register.getFields().setHaveLastUpdate(false);
          register.getFields().setHaveWhoModify(false);

          if(!Cairo.Database.save(register, , "pSaveCheques", C_MODULE, c_ErrorSave)) { return false; }
        }

        var sqlstmt = null;

        if(m_chequesDeleted !== "" && m_id !== Cairo.Constants.NO_ID && !m_copy) {

          var vDeletes = null;
          var i = null;

          m_chequesDeleted = RemoveLastColon(m_chequesDeleted);
          vDeletes = Split(m_chequesDeleted, ",");

          for (i = 0; i <= vDeletes.Length; i++) {

            register = new cRegister();
            register.setFieldId(mTesoreriaConstantes.COBZIB_TMPID);
            register.setTable(mTesoreriaConstantes.COBRANZAITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            register.getFields().add2(mTesoreriaConstantes.COBZI_ID, Cairo.Util.val(vDeletes(i)), Cairo.Constants.Types.integer);
            register.getFields().add2(mTesoreriaConstantes.COBZ_ID, m_id, Cairo.Constants.Types.id);
            register.getFields().add2(mTesoreriaConstantes.COBZ_TMPID, id, Cairo.Constants.Types.id);

            register.getFields().setHaveLastUpdate(false);
            register.getFields().setHaveWhoModify(false);

            if(!Cairo.Database.save(register, , "pSaveTarjetas", C_MODULE, c_ErrorSave)) { return false; }
          }

        }

        return true;
      };

      var pSaveTarjetas = function(id) {
        var register = null;
        var row = null;
        var cell = null;

        var _count = pGetTarjetas().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetTarjetas().getRows().item(_i);

          register = new cRegister();
          register.setFieldId(mTesoreriaConstantes.COBZI_TMPID);
          register.setTable(mTesoreriaConstantes.COBRANZAITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KIT_COBZI_ID:
                if(m_copy) {
                  register.getFields().add2(mTesoreriaConstantes.COBZI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.integer);
                }
                else {
                  register.getFields().add2(mTesoreriaConstantes.COBZI_ID, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.integer);
                }
                break;

              case KIT_DESCRIP:
                register.getFields().add2(mTesoreriaConstantes.COBZI_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);
                break;

              case KIT_TJCC_ID:
                register.getFields().add2(mTesoreriaConstantes.TJCC_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KIT_CUPON:
                register.getFields().add2(mTesoreriaConstantes.COBZI_TMPCUPON, cell.getValue(), Cairo.Constants.Types.text);
                break;

              case KIT_TJC_ID:
                register.getFields().add2(mTesoreriaConstantes.TJC_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KIT_TJCCU_ID:
                register.getFields().add2(mTesoreriaConstantes.TJCCU_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KIT_MON_ID:
                register.getFields().add2(mTesoreriaConstantes.MON_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KIT_FECHAVTO:
                register.getFields().add2(mTesoreriaConstantes.COBZI_TMPFECHA_VTO, cell.getValue(), Cairo.Constants.Types.date);
                break;

              case KIT_TITULAR:
                register.getFields().add2(mTesoreriaConstantes.COBZI_TMPTITULAR, cell.getValue(), Cairo.Constants.Types.text);
                break;

              case KIT_NROTARJETA:
                register.getFields().add2(mTesoreriaConstantes.COBZI_TMPNRO_TARJETA, cell.getValue(), Cairo.Constants.Types.text);
                break;

              case KIT_NROAUTORIZACION:
                register.getFields().add2(mTesoreriaConstantes.COBZI_TMPAUTORIZACION, cell.getValue(), Cairo.Constants.Types.text);
                break;

              case KIT_TARJETA_TIPO:
                register.getFields().add2(mTesoreriaConstantes.COBZI_TARJETA_TIPO, cell.getId(), Cairo.Constants.Types.long);
                break;

              case KIT_IMPORTEORIGEN:
                register.getFields().add2(mTesoreriaConstantes.COBZI_IMPORTE_ORIGEN, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                break;

              case KIT_IMPORTE:
                register.getFields().add2(mTesoreriaConstantes.COBZI_IMPORTE, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                break;
            }
          }

          m_iOrden = m_iOrden + 1;
          register.getFields().add2(mTesoreriaConstantes.COBZI_ORDEN, m_iOrden, Cairo.Constants.Types.integer);
          register.getFields().add2(mTesoreriaConstantes.COBZI_TIPO, csECobranzaItemTipo.cSECOBZITTARJETA, Cairo.Constants.Types.integer);
          register.getFields().add2(mTesoreriaConstantes.COBZ_TMPID, id, Cairo.Constants.Types.id);
          register.getFields().add2(mTesoreriaConstantes.COBZI_OTRO_TIPO, csEItemOtroTipo.cSEOTRODEBE, Cairo.Constants.Types.integer);

          register.getFields().setHaveLastUpdate(false);
          register.getFields().setHaveWhoModify(false);

          if(!Cairo.Database.save(register, , "pSaveTarjetas", C_MODULE, c_ErrorSave)) { return false; }
        }

        var sqlstmt = null;

        if(m_tarjetasDeleted !== "" && m_id !== Cairo.Constants.NO_ID && !m_copy) {

          var vDeletes = null;
          var i = null;

          m_tarjetasDeleted = RemoveLastColon(m_tarjetasDeleted);
          vDeletes = Split(m_tarjetasDeleted, ",");

          for (i = 0; i <= vDeletes.Length; i++) {

            register = new cRegister();
            register.setFieldId(mTesoreriaConstantes.COBZIB_TMPID);
            register.setTable(mTesoreriaConstantes.COBRANZAITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            register.getFields().add2(mTesoreriaConstantes.COBZI_ID, Cairo.Util.val(vDeletes(i)), Cairo.Constants.Types.integer);
            register.getFields().add2(mTesoreriaConstantes.COBZ_ID, m_id, Cairo.Constants.Types.id);
            register.getFields().add2(mTesoreriaConstantes.COBZ_TMPID, id, Cairo.Constants.Types.id);

            register.getFields().setHaveLastUpdate(false);
            register.getFields().setHaveWhoModify(false);

            if(!Cairo.Database.save(register, , "pSaveTarjetas", C_MODULE, c_ErrorSave)) { return false; }
          }

        }

        return true;
      };

      var pSaveOtros = function(id) {
        var register = null;
        var row = null;
        var cell = null;

        var _count = pGetOtros().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetOtros().getRows().item(_i);

          register = new cRegister();
          register.setFieldId(mTesoreriaConstantes.COBZI_TMPID);
          register.setTable(mTesoreriaConstantes.COBRANZAITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KIO_COBZI_ID:
                if(m_copy) {
                  register.getFields().add2(mTesoreriaConstantes.COBZI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.integer);
                }
                else {
                  register.getFields().add2(mTesoreriaConstantes.COBZI_ID, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.integer);
                }
                break;

              case KIO_DESCRIP:
                register.getFields().add2(mTesoreriaConstantes.COBZI_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);
                break;

              case KIO_RET_ID:
                register.getFields().add2(mTesoreriaConstantes.RET_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KIO_NRORETENCION:
                register.getFields().add2(mTesoreriaConstantes.COBZI_NRO_RETENCION, cell.getValue(), Cairo.Constants.Types.text);
                break;

              case KIO_PORCRETENCION:
                register.getFields().add2(mTesoreriaConstantes.COBZI_PORC_RETENCION, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double);
                break;

              case KIO_CCOS_ID:
                register.getFields().add2(mTesoreriaConstantes.CCOS_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KIO_FV_ID_RET:
                register.getFields().add2(mTesoreriaConstantes.FV_ID_RET, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KIO_CUE_ID:
                register.getFields().add2(mTesoreriaConstantes.CUE_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KIO_FECHARETENCION:
                register.getFields().add2(mTesoreriaConstantes.COBZI_FECHA_RETENCION, cell.getValue(), Cairo.Constants.Types.date);
                break;

              case KIO_IMPORTEORIGEN:
                register.getFields().add2(mTesoreriaConstantes.COBZI_IMPORTE_ORIGEN, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                break;

              case KIO_DEBE:
                if(Cairo.Util.val(cell.getValue()) !== 0) {
                  register.getFields().add2(mTesoreriaConstantes.COBZI_IMPORTE, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                  register.getFields().add2(mTesoreriaConstantes.COBZI_OTRO_TIPO, csEItemOtroTipo.cSEOTRODEBE, Cairo.Constants.Types.integer);
                }
                break;

              case KIO_HABER:
                if(Cairo.Util.val(cell.getValue()) !== 0) {
                  register.getFields().add2(mTesoreriaConstantes.COBZI_IMPORTE, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                  register.getFields().add2(mTesoreriaConstantes.COBZI_OTRO_TIPO, csEItemOtroTipo.cSEOTROHABER, Cairo.Constants.Types.integer);
                }
                break;
            }
          }

          m_iOrden = m_iOrden + 1;
          register.getFields().add2(mTesoreriaConstantes.COBZI_ORDEN, m_iOrden, Cairo.Constants.Types.integer);
          register.getFields().add2(mTesoreriaConstantes.COBZI_TIPO, csECobranzaItemTipo.cSECOBZITOTROS, Cairo.Constants.Types.integer);
          register.getFields().add2(mTesoreriaConstantes.COBZ_TMPID, id, Cairo.Constants.Types.id);

          register.getFields().setHaveLastUpdate(false);
          register.getFields().setHaveWhoModify(false);

          if(!Cairo.Database.save(register, , "pSaveOtros", C_MODULE, c_ErrorSave)) { return false; }
        }

        var sqlstmt = null;

        if(m_otrosDeleted !== "" && m_id !== Cairo.Constants.NO_ID && !m_copy) {

          var vDeletes = null;
          var i = null;

          m_otrosDeleted = RemoveLastColon(m_otrosDeleted);
          vDeletes = Split(m_otrosDeleted, ",");

          for (i = 0; i <= vDeletes.Length; i++) {

            register = new cRegister();
            register.setFieldId(mTesoreriaConstantes.COBZIB_TMPID);
            register.setTable(mTesoreriaConstantes.COBRANZAITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            register.getFields().add2(mTesoreriaConstantes.COBZI_ID, Cairo.Util.val(vDeletes(i)), Cairo.Constants.Types.integer);
            register.getFields().add2(mTesoreriaConstantes.COBZ_ID, m_id, Cairo.Constants.Types.id);
            register.getFields().add2(mTesoreriaConstantes.COBZ_TMPID, id, Cairo.Constants.Types.id);

            register.getFields().setHaveLastUpdate(false);
            register.getFields().setHaveWhoModify(false);

            if(!Cairo.Database.save(register, , "pSaveOtros", C_MODULE, c_ErrorSave)) { return false; }
          }

        }

        return true;
      };

      var pSaveEfectivo = function(id) {
        var register = null;
        var row = null;
        var cell = null;

        var _count = pGetEfectivo().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetEfectivo().getRows().item(_i);

          register = new cRegister();
          register.setFieldId(mTesoreriaConstantes.COBZI_TMPID);
          register.setTable(mTesoreriaConstantes.COBRANZAITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KIE_COBZI_ID:
                if(m_copy) {
                  register.getFields().add2(mTesoreriaConstantes.COBZI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.integer);
                }
                else {
                  register.getFields().add2(mTesoreriaConstantes.COBZI_ID, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.integer);
                }
                break;

              case KIE_DESCRIP:
                register.getFields().add2(mTesoreriaConstantes.COBZI_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);
                break;

              case KIE_CUE_ID:
                register.getFields().add2(mTesoreriaConstantes.CUE_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KIE_IMPORTEORIGEN:
                register.getFields().add2(mTesoreriaConstantes.COBZI_IMPORTE_ORIGEN, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                break;

              case KIE_IMPORTE:
                register.getFields().add2(mTesoreriaConstantes.COBZI_IMPORTE, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                break;
            }
          }

          m_iOrden = m_iOrden + 1;
          register.getFields().add2(mTesoreriaConstantes.COBZI_ORDEN, m_iOrden, Cairo.Constants.Types.integer);
          register.getFields().add2(mTesoreriaConstantes.COBZI_TIPO, csECobranzaItemTipo.cSECOBZITEFECTIVO, Cairo.Constants.Types.integer);
          register.getFields().add2(mTesoreriaConstantes.COBZ_TMPID, id, Cairo.Constants.Types.id);
          register.getFields().add2(mTesoreriaConstantes.COBZI_OTRO_TIPO, csEItemOtroTipo.cSEOTRODEBE, Cairo.Constants.Types.integer);

          register.getFields().setHaveLastUpdate(false);
          register.getFields().setHaveWhoModify(false);

          if(!Cairo.Database.save(register, , "pSaveEfectivo", C_MODULE, c_ErrorSave)) { return false; }
        }

        var sqlstmt = null;

        if(m_efectivoDeleted !== "" && m_id !== Cairo.Constants.NO_ID && !m_copy) {

          var vDeletes = null;
          var i = null;

          m_efectivoDeleted = RemoveLastColon(m_efectivoDeleted);
          vDeletes = Split(m_efectivoDeleted, ",");

          for (i = 0; i <= vDeletes.Length; i++) {

            register = new cRegister();
            register.setFieldId(mTesoreriaConstantes.COBZIB_TMPID);
            register.setTable(mTesoreriaConstantes.COBRANZAITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            register.getFields().add2(mTesoreriaConstantes.COBZI_ID, Cairo.Util.val(vDeletes(i)), Cairo.Constants.Types.integer);
            register.getFields().add2(mTesoreriaConstantes.COBZ_ID, m_id, Cairo.Constants.Types.id);
            register.getFields().add2(mTesoreriaConstantes.COBZ_TMPID, id, Cairo.Constants.Types.id);

            register.getFields().setHaveLastUpdate(false);
            register.getFields().setHaveWhoModify(false);

            if(!Cairo.Database.save(register, , "pSaveEfectivo", C_MODULE, c_ErrorSave)) { return false; }
          }

        }

        return true;
      };

      var pSaveCtaCte = function(id) {
        var register = null;
        var row = null;
        var cell = null;

        var _count = pGetCtaCte().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetCtaCte().getRows().item(_i);

          register = new cRegister();
          register.setFieldId(mTesoreriaConstantes.COBZI_TMPID);
          register.setTable(mTesoreriaConstantes.COBRANZAITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KICC_COBZI_ID:
                if(m_copy) {
                  register.getFields().add2(mTesoreriaConstantes.COBZI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.integer);
                }
                else {
                  register.getFields().add2(mTesoreriaConstantes.COBZI_ID, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.integer);
                }
                break;

              case KICC_CUE_ID:
                register.getFields().add2(mTesoreriaConstantes.CUE_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KICC_IMPORTEORIGEN:
                register.getFields().add2(mTesoreriaConstantes.COBZI_IMPORTE_ORIGEN, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                break;

              case KICC_IMPORTE:
                register.getFields().add2(mTesoreriaConstantes.COBZI_IMPORTE, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                break;
            }
          }

          m_iOrden = m_iOrden + 1;
          register.getFields().add2(mTesoreriaConstantes.COBZI_ORDEN, m_iOrden, Cairo.Constants.Types.integer);
          register.getFields().add2(mTesoreriaConstantes.COBZI_TIPO, csECobranzaItemTipo.cSECOBZITCTACTE, Cairo.Constants.Types.integer);
          register.getFields().add2(mTesoreriaConstantes.COBZ_TMPID, id, Cairo.Constants.Types.id);
          register.getFields().add2(mTesoreriaConstantes.COBZI_OTRO_TIPO, csEItemOtroTipo.cSEOTROHABER, Cairo.Constants.Types.integer);

          register.getFields().setHaveLastUpdate(false);
          register.getFields().setHaveWhoModify(false);

          if(!Cairo.Database.save(register, , "pSaveCtaCte", C_MODULE, c_ErrorSave)) { return false; }
        }

        var sqlstmt = null;

        if(m_ctaCteDeleted !== "" && m_id !== Cairo.Constants.NO_ID && !m_copy) {

          var vDeletes = null;
          var i = null;

          m_ctaCteDeleted = RemoveLastColon(m_ctaCteDeleted);
          vDeletes = Split(m_ctaCteDeleted, ",");

          for (i = 0; i <= vDeletes.Length; i++) {

            register = new cRegister();
            register.setFieldId(mTesoreriaConstantes.COBZIB_TMPID);
            register.setTable(mTesoreriaConstantes.COBRANZAITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            register.getFields().add2(mTesoreriaConstantes.COBZI_ID, Cairo.Util.val(vDeletes(i)), Cairo.Constants.Types.integer);
            register.getFields().add2(mTesoreriaConstantes.COBZ_ID, m_id, Cairo.Constants.Types.id);
            register.getFields().add2(mTesoreriaConstantes.COBZ_TMPID, id, Cairo.Constants.Types.id);

            register.getFields().setHaveLastUpdate(false);
            register.getFields().setHaveWhoModify(false);

            if(!Cairo.Database.save(register, , "pSaveCtaCte", C_MODULE, c_ErrorSave)) { return false; }
          }

        }

        return true;
      };

      var pShowApply = function() {

        if(!DoCairo.Security.anAccess(csTesoreriaPrestacion.cSPRETSRMODIFYAPLIC, m_doc_id, csE_DocTypePrestacion.cSEDOCTPREAPLICAR)) { return; }

        if(m_objApply === null) {
          m_objApply = new cCobranzaAplic();

          // Edit Apply
          //
        }
        else {
          if(m_objApply.Id !== m_id) {
            m_objApply.self.setObjectClient(null);
            m_objApply = new cCobranzaAplic();
          }
        }

        // Edit Apply
        //
        m_objApply.self.setObjectClient(self);

        if(!m_objApply.self.show(m_id, m_total, m_nrodoc, m_cliente)) {
          m_objApply = null;
        }
      };

      ////////////////////////////////////////////////////////////////////////////////
      var pGetCheques = function() {
        return pGetChequesProperty().getGrid();
      };

      var pGetTarjetas = function() {
        return pGetTarjetasProperty().getGrid();
      };

      var pGetEfectivo = function() {
        return pGetEfectivoProperty().getGrid();
      };

      var pGetOtros = function() {
        return pGetOtrosProperty().getGrid();
      };

      var pGetCtaCte = function() {
        return pGetCtaCteProperty().getGrid();
      };

      var pGetChequesProperty = function() {
        return m_items.getProperties().item(C_CHEQUES);
      };

      var pGetTarjetasProperty = function() {
        return m_items.getProperties().item(C_TARJETA);
      };

      var pGetEfectivoProperty = function() {
        return m_items.getProperties().item(C_EFECTIVO);
      };

      var pGetOtrosProperty = function() {
        return m_items.getProperties().item(C_OTROS);
      };

      var pGetCtaCteProperty = function() {
        return m_items.getProperties().item(C_CTACTE);
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
      var pColAUpdateCheque = function(property,  lRow,  lCol) { // TODO: Use of ByRef founded Private Function pColAUpdateCheque(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long) As Boolean
        var _rtn = null;
        var row = null;
        var value = null;

        var w_grid = property.getGrid();
        switch (w_grid.getColumns(lCol).Key) {
          case KICH_IMPORTEORIGEN:
            row = w_grid.getRows(lRow);
            var w_pCell = Dialogs.cell(row, KICH_MON_ID);
            if(w_pCell.getID() !== m_monDefault || w_pCell.getID() === 0) {
              Dialogs.cell(row, KICH_IMPORTE).getValue() === Cairo.Util.val(Dialogs.cell(row, KICH_IMPORTEORIGEN).getValue()) * Cairo.Util.val(pGetCotizacion().getValue());
            }
            else {
              Dialogs.cell(row, KICH_IMPORTEORIGEN).getValue() === 0;
            }
            break;

          case KICH_IMPORTE:

            break;

          case KICH_CUE_ID:
            var monId = null;
            var moneda = null;
            row = w_grid.getRows(lRow);
            GetMonedaFromCuenta(monId, moneda, Dialogs.cell(row, KICH_CUE_ID).getID());
            var w_pCell = Dialogs.cell(row, KICH_MON_ID);
            w_pCell.setValue(moneda);
            w_pCell.setID(monId);

            if(monId === m_monDefault || monId === 0) {
              Dialogs.cell(row, KICH_IMPORTEORIGEN).getValue() === 0;
            }
            _rtn = true;
            return _rtn;
            break;

          default:
            _rtn = true;
            return _rtn;
            break;
        }

        pShowCobroNeto();
        pShowCobroTotal();
        _rtn = true;

        return _rtn;
      };

      var pColAUpdateTarjeta = function(property,  lRow,  lCol) { // TODO: Use of ByRef founded Private Function pColAUpdateTarjeta(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long) As Boolean
        var _rtn = null;
        var row = null;
        var value = null;

        var w_grid = property.getGrid();
        switch (w_grid.getColumns(lCol).Key) {
          case KIT_IMPORTEORIGEN:
            row = w_grid.getRows(lRow);
            Dialogs.cell(row, KIT_IMPORTE).getValue() === Cairo.Util.val(Dialogs.cell(row, KIT_IMPORTEORIGEN).getValue()) * Cairo.Util.val(pGetCotizacion().getValue());
            break;

          case KIT_IMPORTE:

            break;

          case KIT_TJC_ID:
            var tjcId = null;
            var abmObj = null;

            abmObj = m_dialog;
            row = w_grid.getRows(lRow);

            tjcId = Dialogs.cell(row, KIT_TJC_ID).getID();
            mPublic.self.setFilterCuotas(row, property, m_dialog, KIT_TJC_ID);

            var w_pCell = Dialogs.cell(row, KIT_TJCCU_ID);
            if(!mPublic.self.validateCuota(tjcId, w_pCell.getID())) {
              w_pCell.setID(Cairo.Constants.NO_ID);
              w_pCell.setValue("");
              abmObj.ShowCellValue(property, lRow, m_lColCuotas);
            }

            _rtn = true;
            return _rtn;

            break;

          default:
            _rtn = true;
            return _rtn;
            break;
        }

        pShowCobroNeto();
        pShowCobroTotal();
        _rtn = true;

        return _rtn;
      };

      var pColAUpdateCtaCte = function(property,  lRow,  lCol) { // TODO: Use of ByRef founded Private Function pColAUpdateCtaCte(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long) As Boolean
        return true;
      };

      var pColAUpdateEfectivo = function(property,  lRow,  lCol) { // TODO: Use of ByRef founded Private Function pColAUpdateEfectivo(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long) As Boolean
        var _rtn = null;
        var row = null;
        var value = null;

        var w_grid = property.getGrid();
        switch (w_grid.getColumns(lCol).Key) {
          case KIE_IMPORTEORIGEN:
            row = w_grid.getRows(lRow);
            var w_pCell = Dialogs.cell(row, KIE_MON_ID);
            if(w_pCell.getID() !== m_monDefault || w_pCell.getID() === 0) {
              Dialogs.cell(row, KIE_IMPORTE).getValue() === Cairo.Util.val(Dialogs.cell(row, KIE_IMPORTEORIGEN).getValue()) * Cairo.Util.val(pGetCotizacion().getValue());
            }
            else {
              Dialogs.cell(row, KIE_IMPORTEORIGEN).getValue() === 0;
            }
            break;

          case KIE_IMPORTE:

            break;

          case KIE_CUE_ID:
            var monId = null;
            var moneda = null;
            row = w_grid.getRows(lRow);
            GetMonedaFromCuenta(monId, moneda, Dialogs.cell(row, KIE_CUE_ID).getID());
            var w_pCell = Dialogs.cell(row, KIE_MON_ID);
            w_pCell.setValue(moneda);
            w_pCell.setID(monId);

            if(monId === m_monDefault || monId === 0) {
              Dialogs.cell(row, KIE_IMPORTEORIGEN).getValue() === 0;
            }
            _rtn = true;
            return _rtn;
            break;

          default:
            _rtn = true;
            return _rtn;
            break;
        }

        pShowCobroNeto();
        pShowCobroTotal();
        _rtn = true;

        return _rtn;
      };

      var pColAUpdateOtro = function(property,  lRow,  lCol) { // TODO: Use of ByRef founded Private Function pColAUpdateOtro(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long) As Boolean
        var _rtn = null;
        var row = null;
        var value = null;

        var w_grid = property.getGrid();
        switch (w_grid.getColumns(lCol).Key) {
          case KIO_DEBE:
            row = w_grid.getRows(lRow);
            Dialogs.cell(row, KIO_IMPORTEORIGEN).getValue() === Cairo.Util.val(Dialogs.cell(row, KIO_DEBE).getValue());
            Dialogs.cell(row, KIO_HABER).getValue() === 0;
            break;

          case KIO_HABER:
            row = w_grid.getRows(lRow);
            Dialogs.cell(row, KIO_IMPORTEORIGEN).getValue() === Cairo.Util.val(Dialogs.cell(row, KIO_HABER).getValue());
            Dialogs.cell(row, KIO_DEBE).getValue() === 0;
            break;

          default:
            _rtn = true;
            return _rtn;
            break;
        }

        pShowCobroOtro();
        pShowCobroTotal();
        _rtn = true;

        return _rtn;
      };

      var pGetCotizacion = function() {
        return m_dialog.getProperties().item(mTesoreriaConstantes.COBZ_COTIZACION);
      };

      var pShowCobroNeto = function() {
        var row = null;
        var total = null;
        var totalOrigen = null;

        var _count = pGetCheques().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetCheques().getRows().item(_i);
          total = total + Cairo.Util.val(Dialogs.cell(row, KICH_IMPORTE).getValue());
        }

        var _count = pGetEfectivo().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetEfectivo().getRows().item(_i);
          total = total + Cairo.Util.val(Dialogs.cell(row, KIE_IMPORTE).getValue());
        }

        var _count = pGetTarjetas().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetTarjetas().getRows().item(_i);
          total = total + Cairo.Util.val(Dialogs.cell(row, KIE_IMPORTE).getValue());
        }

        pGetCobroNeto().setValue(total);
        m_footer.showValue(pGetCobroNeto());
      };

      var pShowCobroTotal = function() {
        pGetCobroTotal().setValue(Cairo.Util.val(pGetCobroNeto().getValue()) + Cairo.Util.val(pGetCobroOtros().getValue()));
        m_footer.showValue(pGetCobroTotal());
      };

      var pShowCobroOtro = function() {
        var row = null;
        var total = null;

        var _count = pGetOtros().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetOtros().getRows().item(_i);
          total = total + Cairo.Util.val(Dialogs.cell(row, KIO_DEBE).getValue()) - Cairo.Util.val(Dialogs.cell(row, KIO_HABER).getValue());
        }

        pGetCobroOtros().setValue(total);
        m_footer.showValue(pGetCobroOtros());
      };

      var pGetCobroNeto = function() {
        return m_footer.getProperties().item(mTesoreriaConstantes.COBZ_NETO);
      };

      var pGetCobroOtros = function() {
        return m_footer.getProperties().item(mTesoreriaConstantes.COBZ_OTROS);
      };

      var pGetCobroTotal = function() {
        return m_footer.getProperties().item(mTesoreriaConstantes.COBZ_TOTAL);
      };

      /////////////////////////////////////////////////////////////////////
      // Validaciones de Filas de Instrumentos de cobro
      var pIsEmptyRowCheques = function(row,  rowIndex) {
        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KICH_CUE_ID:
            case KICH_BCO_ID:
            case KICH_MON_ID:
            case KICH_CLE_ID:
              if(!ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                bRowIsEmpty = false;
                break;
              }

              break;

            case KICH_IMPORTE:
            case KICH_IMPORTEORIGEN:
              if(!ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double)) {
                var bRowIsEmpty = true;
                break;
              }

              break;

            case KICH_DESCRIP:
            case KICH_CHEQUE:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                var bRowIsEmpty = true;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pValidateRowCheques = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function pValidateRowCheques(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var bOrigen = null;
        var monId = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case KICH_CUE_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                //'Debe indicar una Cuenta Contable (1)
                MsgInfo(Cairo.Language.getText(2113, "", strRow));
              }

              break;

            case KICH_BCO_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                //'Debe indicar un banco (1)
                MsgInfo(Cairo.Language.getText(2094, "", strRow));
              }

              break;

            case KICH_MON_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                //'Debe indicar una moneda (1)
                MsgInfo(Cairo.Language.getText(2114, "", strRow));
              }
              monId = cell.getId();

              break;

            case KICH_CLE_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                //'Debe indicar un clearing (1)
                MsgInfo(Cairo.Language.getText(2115, "", strRow));
              }

              break;

            case KICH_IMPORTEORIGEN:
              bOrigen = !ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double);

              break;

            case KICH_IMPORTE:
              if(ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double)) {
                //'Debe indicar un número de Cheque (1)
                MsgInfo(Cairo.Language.getText(2116, "", strRow));
              }

              break;

            case KICH_CHEQUE:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                //'Debe indicar un número de cheque (1)
                MsgInfo(Cairo.Language.getText(2116, "", strRow));
              }

              break;

            case KICH_FECHACOBRO:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.date)) {
                //'Debe indicar una fecha para depositar (1)
                MsgInfo(Cairo.Language.getText(2117, "", strRow));
              }

              break;

            case KICH_FECHAVTO:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.date)) {
                //'Debe indicar una fecha de vencimiento (1)
                MsgInfo(Cairo.Language.getText(1384, "", strRow));
              }
              break;
          }
        }

        if(!bOrigen && monId !== m_monDefault) {
          MsgInfo(Cairo.Language.getText(2118, "", strRow));
          //Debe indicar un importe para la moneda extranjera (1)
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var pIsEmptyRowTarjetas = function(row,  rowIndex) {
        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIT_TJC_ID:
            case KIT_MON_ID:
            case KIT_TJCCU_ID:
              if(!ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                bRowIsEmpty = false;
                break;
              }

              break;

            case KIT_IMPORTE:
            case KIT_IMPORTEORIGEN:
              if(!ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double)) {
                var bRowIsEmpty = true;
                break;
              }

              break;

            case KIT_NROTARJETA:
            case KIT_NROAUTORIZACION:
            case KIT_TITULAR:
            case KIT_DESCRIP:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                var bRowIsEmpty = true;
                break;
              }

              break;

            case KIT_FECHAVTO:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.date)) {
                var bRowIsEmpty = true;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pValidateRowTarjetas = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function pValidateRowTarjetas(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var bOrigen = null;
        var monId = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case KIT_TJC_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                //'Debe indicar una Tarjeta de Crédito (1)
                MsgInfo(Cairo.Language.getText(2119, "", strRow));
              }

              break;

            case KIT_MON_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                //'Debe indicar una moneda (1)
                MsgInfo(Cairo.Language.getText(2114, "", strRow));
              }
              monId = cell.getId();

              break;

            case KIT_IMPORTEORIGEN:
              bOrigen = !ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double);

              break;

            case KIT_IMPORTE:
              if(ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double)) {
                //'Debe indicar un importe (1)
                MsgInfo(Cairo.Language.getText(1897, "", strRow));
              }

              break;

            case KIT_NROTARJETA:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                //'Debe indicar un número tarjeta (1)
                MsgInfo(Cairo.Language.getText(2120, "", strRow));
              }

              break;

            case KIT_NROAUTORIZACION:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                //'Debe indicar un número autorización (1)
                MsgInfo(Cairo.Language.getText(2121, "", strRow));
              }

              break;

            case KIT_FECHAVTO:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.date)) {
                //'Debe indicar una fecha de vencimiento (1)
                MsgInfo(Cairo.Language.getText(1384, "", strRow));
              }

              break;

            case KIT_TITULAR:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                //'Debe indicar un Titular (1)
                MsgInfo(Cairo.Language.getText(2122, "", strRow));
              }
              break;
          }
        }

        if(!bOrigen && monId !== m_monDefault) {
          MsgInfo(Cairo.Language.getText(2118, "", strRow));
          //Debe indicar un importe para la moneda extranjera (1)
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var pIsEmptyRowOtros = function(row,  rowIndex) {
        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIO_CUE_ID:
            case KIO_CCOS_ID:
            case KIO_RET_ID:
              if(!ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                bRowIsEmpty = false;
                break;
              }

              break;

            case KIO_DEBE:
            case KIO_HABER:
            case KIO_IMPORTEORIGEN:
            case KIO_PORCRETENCION:
              if(!ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double)) {
                var bRowIsEmpty = true;
                break;
              }

              break;

            case KIO_NRORETENCION:
            case KIO_DESCRIP:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                var bRowIsEmpty = true;
                break;
              }

              break;

            case KIO_FECHARETENCION:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.date)) {
                var bRowIsEmpty = true;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pValidateRowOtros = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function pValidateRowOtros(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var bOrigen = null;
        var bDebe = null;
        var bHaber = null;
        var monId = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case KIO_CUE_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                //'Debe indicar una cuenta contable (1)
                MsgInfo(Cairo.Language.getText(2113, "", strRow));
              }

              if(!Cairo.Database.getData(mTesoreriaConstantes.CUENTA, mTesoreriaConstantes.CUE_ID, cell.getId(), mTesoreriaConstantes.MON_ID, monId)) { return false; }

              break;

            case KIO_DEBE:
              bDebe = !ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double);

              break;

            case KIO_HABER:
              bHaber = !ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double);

              break;

            case KIO_IMPORTEORIGEN:
              bOrigen = !ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double);

              break;
          }
        }

        if(!bDebe && !bHaber) {
          MsgInfo(Cairo.Language.getText(1898, "", strRow));
          //Debe indicar un importe en el debe o en el haber (1)
        }

        if(!bOrigen && monId !== m_monDefault) {
          MsgInfo(Cairo.Language.getText(2118, "", strRow));
          //Debe indicar un importe para la moneda extranjera (1)
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var pIsEmptyRowCtaCte = function(row,  rowIndex) {
        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KICC_CUE_ID:
              if(!ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                bRowIsEmpty = false;
                break;
              }

              break;

            case KICC_IMPORTE:
            case KICC_IMPORTEORIGEN:
              if(!ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double)) {
                var bRowIsEmpty = true;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pValidateRowCtaCte = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function pValidateRowCtaCte(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var bOrigen = null;
        var monId = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case KICC_CUE_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                //'Debe indicar una cuenta contable (1)
                MsgInfo(Cairo.Language.getText(2113, "", strRow));
              }

              if(!Cairo.Database.getData(mTesoreriaConstantes.CUENTA, mTesoreriaConstantes.CUE_ID, cell.getId(), mTesoreriaConstantes.MON_ID, monId)) { return false; }

              break;

            case KICC_IMPORTEORIGEN:
              bOrigen = !ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double);

              break;

            case KICC_IMPORTE:
              if(ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double)) {
                MsgInfo(Cairo.Language.getText(2116, "", strRow));
                //Debe indicar una número de cheque (1)
              }
              break;
          }
        }

        if(!bOrigen && monId !== m_monDefault) {
          MsgInfo(Cairo.Language.getText(2118, "", strRow));
          //Debe indicar un importe para la moneda extranjera (1)
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var pIsEmptyRowEfectivo = function(row,  rowIndex) {
        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIE_CUE_ID:
              if(!ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                bRowIsEmpty = false;
                break;
              }

              break;

            case KIE_IMPORTE:
            case KIE_IMPORTEORIGEN:
              if(!ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double)) {
                var bRowIsEmpty = true;
                break;
              }

              break;

            case KIE_DESCRIP:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                var bRowIsEmpty = true;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pValidateRowEfectivo = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function pValidateRowEfectivo(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var bOrigen = null;
        var monId = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case KIE_CUE_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                MsgInfo(Cairo.Language.getText(2113, "", strRow));
                //Debe indicar una cuenta contable (1)
              }

              if(!Cairo.Database.getData(mTesoreriaConstantes.CUENTA, mTesoreriaConstantes.CUE_ID, cell.getId(), mTesoreriaConstantes.MON_ID, monId)) { return false; }

              break;

            case KIE_IMPORTEORIGEN:
              bOrigen = !ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double);

              break;

            case KIE_IMPORTE:
              if(ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double)) {
                MsgInfo(Cairo.Language.getText(1897, "", strRow));
                //Debe indicar un importe (1)
              }
              break;
          }
        }

        if(!bOrigen && monId !== m_monDefault) {
          MsgInfo(Cairo.Language.getText(2118, "", strRow));
          //Debe indicar un importe para la moneda extranjera (1)
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var pClearCheqId = function() {
        var row = null;
        var _count = pGetCheques().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetCheques().getRows().item(_i);
          Dialogs.cell(row, KICH_CHEQ_ID).getID() === Cairo.Constants.NO_ID;
        }
        var _count = pGetTarjetas().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetTarjetas().getRows().item(_i);
          Dialogs.cell(row, KIT_TJCC_ID).getID() === Cairo.Constants.NO_ID;
        }
        var abmObj = null;
        abmObj = m_items;
        abmObj.ShowValue(pGetChequesProperty(), true);
        abmObj.ShowValue(pGetTarjetasProperty(), true);
      };

      var pSetFilterColFactura = function() {

        var abmObj = null;
        abmObj = m_items;

        cABMUtil.pCol(pGetOtros().getColumns(), KIO_FV_ID_RET).getHelpFilter() === "cli.cli_id = "+ pGetCliente().toString();
        abmObj.RefreshColumnProperties(pGetOtrosProperty(), mTesoreriaConstantes.FV_ID_RET);

      };

      var pGetCliente = function() {
        return m_dialog.getProperties().item(mTesoreriaConstantes.CLI_ID).getSelectId();
      };

      var pGetFileNamePostFix = function() {
        var rtn = null;

        rtn = m_dialog.getProperties().item(mTesoreriaConstantes.CLI_ID).getValue().Substring(0, 50)+ "-"+ m_dialog.getProperties().item(mTesoreriaConstantes.COBZ_NRODOC).getValue();

        return rtn;
      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

    Edit.Controller.edit = function(id) {

      Cairo.LoadingMessage.show("Cobranzas", "Loading Cobranza from Crowsoft Cairo server.");
      var editor = Cairo.FacturaVenta.Edit.Controller.getEditor();

      var dialog = Cairo.Dialogs.Views.Controller.newDialog();
      var dialogItems = Cairo.Dialogs.Views.Controller.newDialog();
      var dialogFooter = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.setItems(dialogItems);
      editor.setFooter(dialogFooter);
      editor.edit(id).then(Cairo.LoadingMessage.close);

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

      var C_MODULE = "cCobranzaListDoc";

      var C_FECHAINI = "FechaIni";
      var C_FECHAFIN = "FechaFin";

      var C_IMG_TASK = 1;


      var K_FECHAINI = 1;
      var K_FECHAFIN = 2;
      var K_CLI_ID = 4;
      var K_EST_ID = 5;
      var K_CCOS_ID = 6;
      var K_SUC_ID = 7;
      var K_COB_ID = 8;
      var K_DOC_ID = 9;

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
      var m_cob_id = "";
      var m_cobrador = "";
      var m_docId = "";
      var m_documento = "";

      var m_empId = "";
      var m_empresa = "";
      var m_fechaIniV = "";
      var m_fechaFinV = "";


      var m_dialog;
      var m_properties;

      var m_listController;

      var m_menuLoaded;

      var m_title = "";

      var m_menuShowMensajes = 0;
      var m_menuShowInfoCli = 0;
      var m_menuAddNote = 0;
      var m_menuShowAplic = 0;
      var m_menuShowAsiento = 0;
      var m_menuFirmar = 0;

      var m_objApply;

      var m_apiPath = DB.getAPIVersion();
      var SAVE_ERROR = getText(2282, ""); // Error al grabar los párametros de navegación de Xxxx

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
        var _rtn = null;

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

      self.processMenu = function(index) {
        try {

          switch (index) {

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
              showApply();

              break;

            case m_menuShowAsiento:
              showAsiento();

              break;

            case m_menuFirmar:
              signDocument();
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

        m_dialog.getProperties().clear();

        c = m_dialog.getProperties().add(null, C_FECHAINI);
        c.setType(Dialogs.PropertyType.date);
        // Fecha desde
        c.setName(getText(1203, ""));
        c.setKey(K_FECHAINI);
        if(LenB(m_fechaIniV)) {
          c.setValue(m_fechaIniV);
        }
        else {
          c.setValue(m_fechaIni);
        }

        c = m_dialog.getProperties().add(null, C_FECHAFIN);
        c.setType(Dialogs.PropertyType.date);
        // Fecha hasta
        c.setName(getText(1204, ""));
        c.setKey(K_FECHAFIN);
        if(LenB(m_fechaFinV)) {
          c.setValue(m_fechaFinV);
        }
        else {
          c.setValue(m_fechaFin);
        }

        c = m_dialog.getProperties().add(null, mTesoreriaConstantes.CLI_ID);
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

        c = m_dialog.getProperties().add(null, C.EST_ID);
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

        c = m_dialog.getProperties().add(null, mTesoreriaConstantes.CCOS_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CENTROCOSTO);
        // Centro de Costos
        c.setName(getText(1057, ""));
        c.setKey(K_CCOS_ID);
        value = m_centroCosto;
        if(m_ccosId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.CENTROCOSTO, Cairo.Util.val(m_ccosId.Substring(2)), bExists);
          if(!bExists) { m_ccosId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_ccosId));
        c.setSelectIntValue(m_ccosId);

        c = m_dialog.getProperties().add(null, mTesoreriaConstantes.SUC_ID);
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

        c = m_dialog.getProperties().add(null, mTesoreriaConstantes.COB_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.COBRADOR);
        // Cobrador
        c.setName(getText(1088, ""));
        c.setKey(K_COB_ID);
        value = m_cobrador;
        if(m_cob_id.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.VENDEDORES, Cairo.Util.val(m_cob_id.Substring(2)), bExists);
          if(!bExists) { m_cob_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_cob_id));
        c.setSelectIntValue(m_cob_id);

        c = m_dialog.getProperties().add(null, mTesoreriaConstantes.DOC_ID);
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
        c.setSelectFilter("'{emp_id=0}doct_id = "+ csEDocumentoTipo.cSEDT_COBRANZA.toString()+ "'");


        c = m_dialog.getProperties().add(null, C.EMP_ID);
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

        return DB.getData("load[" + m_apiPath + "general/cobranzalistdoc]", id).then(
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
              m_cob_id = NO_ID;
              m_cobrador = "";
              m_docId = NO_ID;
              m_documento = "";

            }
            else {

              m_fechaIniV = valField(response.data, C.FROM);
              m_fechaIni = valField(response.data, C.FROM);
              m_fechaIni = isDate(m_fechaIni) ? getDateValue(m_fechaIni) : today();

              m_fechaFinV = valField(response.data, C.TO);
              m_fechaFin = valField(response.data, C.TO);
              m_fechaFin = isDate(m_fechaFin) ? getDateValue(m_fechaFin) : today();

              m_cliId = valField(response.data, C.PROV_ID);
              m_estId = valField(response.data, C.EST_ID);
              m_ccosId = valField(response.data, C.CCOS_ID);
              m_sucId = valField(response.data, C.SUC_ID);
              m_docId = valField(response.data, C.DOC_ID);
              m_empId = valField(response.data, C.EMP_ID);

              m_cliente = valField(response.data, C.PROV_NAME);
              m_estado = valField(response.data, C.EST_NAME);
              m_centroCosto = valField(response.data, C.CCOS_NAME);
              m_sucursal = valField(response.data, C.SUC_NAME);
              m_documento = valField(response.data, C.DOC_NAME);
              m_empresa = valField(response.data, C.EMP_NAME);
            }

            return true;
          });
      };

      self.getAplication = function() {
        return Cairo.Application.getName();
      };

      self.getProperties = function() {
        return m_properties;
      };

      self.propertyChange = function(key) {
        var iProp = null;

        switch (key) {

          case K_FECHAINI:

            iProp = m_dialog.getProperties().item(C_FECHAINI);

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

          case K_FECHAFIN:

            iProp = m_dialog.getProperties().item(C_FECHAFIN);

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
            var property = m_dialog.getProperties().item(C.EST_ID);
            m_estado = property.getValue();
            m_estId = property.getSelectIntValue();

            break;

          case K_CLI_ID:
            var property = m_dialog.getProperties().item(mTesoreriaConstantes.CLI_ID);
            m_cliente = property.getValue();
            m_cliId = property.getSelectIntValue();

            break;

          case K_CCOS_ID:
            var property = m_dialog.getProperties().item(mTesoreriaConstantes.CCOS_ID);
            m_centroCosto = property.getValue();
            m_ccosId = property.getSelectIntValue();

            break;

          case K_SUC_ID:
            var property = m_dialog.getProperties().item(mTesoreriaConstantes.SUC_ID);
            m_sucursal = property.getValue();
            m_sucId = property.getSelectIntValue();

            break;

          case K_COB_ID:
            var property = m_dialog.getProperties().item(mTesoreriaConstantes.COB_ID);
            m_cobrador = property.getValue();
            m_cob_id = property.getSelectIntValue();

            break;

          case K_DOC_ID:
            var property = m_dialog.getProperties().item(mTesoreriaConstantes.DOC_ID);
            m_documento = property.getValue();
            m_docId = property.getSelectIntValue();


            break;

          case K_EMP_ID:
            var property = m_dialog.getProperties().item(C.EMP_ID);
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
          provId: m_cliId,
          estId: m_estId,
          ccosId: m_ccosId,
          sucId: m_sucId,
          docId: m_docId,
          empId: m_empId
        };

        return DB.getData("load[" + m_apiPath + "tesoreria/cobranzas]", null, params);
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.LDP_ID);
        register.setTable(C.LISTA_DOCUMENTO_PARAMETRO);

        var apiPath = DB.getAPIVersion();
        register.setPath(apiPath + "tesoreria/cobranzas");

        register.setId(Cairo.Constants.NEW_ID);

        var _count = m_dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {

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

      var cIABMListDocClient_Save = function() {

        var strError = null;

        // Error al grabar los párametros de navegación de Cobranzas
        strError = getText(2282, "");

        var register = null;
        register = new cRegister();

        var sqlstmt = null;

        sqlstmt = "delete ListaDocumentoParametro  where pre_id = "+ csTesoreriaPrestacion.cSPRETSRLISTCOBRANZA.toString()+ " and us_id = "+ m_us_id+ " and (emp_id is null or emp_id = "+ cUtil.getEmpId().toString()+ ")";

        if(!Cairo.Database.execute(sqlstmt, "cIABMClient_Save", C_MODULE, strError)) { return false; }

        register.setTable(Cairo.Constants.LISTADOCUMENTOPARAMETRO);
        register.setUtilizaIdentity(true);

        var property = null;
        var _count = m_dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);

          register.getFields().clear();

          switch (property.getKey()) {

            case K_FECHAINI:
              if(property.getSelectIntValue() !== "") {
                register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              }
              else {
                register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              }

              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 10, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_FECHAINI, Cairo.Constants.Types.integer);

              break;

            case K_FECHAFIN:

              if(property.getSelectIntValue() !== "") {
                register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              }
              else {
                register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getValue(), Cairo.Constants.Types.text);
              }

              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 20, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_FECHAFIN, Cairo.Constants.Types.integer);

              break;

            case K_CLI_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 40, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_CLI_ID, Cairo.Constants.Types.integer);
              break;

            case K_EST_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 50, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_EST_ID, Cairo.Constants.Types.integer);
              break;

            case K_CCOS_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 60, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_CCOS_ID, Cairo.Constants.Types.integer);
              break;

            case K_SUC_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 70, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_SUC_ID, Cairo.Constants.Types.integer);
              break;

            case K_COB_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 80, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_COB_ID, Cairo.Constants.Types.integer);
              break;

            case K_DOC_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 90, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_DOC_ID, Cairo.Constants.Types.integer);


              break;

            case K_EMP_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 100, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_EMP_ID, Cairo.Constants.Types.integer);

              break;
          }


          register.getFields().add2(C.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

          register.getFields().add2(Cairo.Constants.US_ID, m_us_id, Cairo.Constants.Types.id);
          register.getFields().add2(C.PRE_ID, csTesoreriaPrestacion.cSPRETSRLISTCOBRANZA, Cairo.Constants.Types.id);

          register.getFields().setHaveLastUpdate(false);
          register.getFields().setHaveWhoModify(false);
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

          //  Cobranzas
          m_title = getText(2128, "");

          m_properties = new cABMDocProperties();
          //Set .ImageList = fResource.iList
          m_properties.setHaveDetail(true);
          m_properties.setStartRowText(4);

          var elem = m_properties.add(null, "TypeTask");
          elem.setName("TypeTask");
          elem.setCaption(" ");
          var elem = elem.add(null);
          elem.FormulaType = csConditionType.cSCONDTNONE;
          elem.IconIndex = C_IMG_TASK;
          elem.setWidth(500);
          elem.setSortType(csSortType.cSSRTTICON);

          var elem = m_properties.add(null, "Descripción");
          elem.setName("Descripción");
          elem.setFontName("Tahoma");
          elem.setFontSize(8);
          elem.setForeColor(vbBlue);


        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "Class_Terminate", C_MODULE, "");

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
          Cairo.manageErrorEx(ex.message, ex, "Class_Terminate", C_MODULE, "");

        }

      };

      var createMenu = function() {


        if(m_menuLoaded) { return; }

        m_menuLoaded = true;

        m_objList.ObjClientMenu = self;
        m_objList.ClearMenu;
        // Firmar
        m_menuFirmar = m_objList.addMenu(getText(1594, ""));
        m_objList.addMenu("-");
        // Ver Info del Cliente
        m_menuShowInfoCli = m_objList.addMenu(getText(1594, ""));
        // Agregar Nota
        m_menuAddNote = m_objList.addMenu(getText(1615, ""));
        // Ver Notas
        m_menuShowMensajes = m_objList.addMenu(getText(1616, ""));
        m_objList.addMenu("-");
        // Ver Aplicaciones
        m_menuShowAplic = m_objList.addMenu(getText(1617, ""));
      };

      var getCliId = function() {


        var cobzId = null;
        var cliId = null;

        cobzId = m_dialog.getId();
        DB.getData(mTesoreriaConstantes.COBRANZA, mTesoreriaConstantes.COBZ_ID, cobzId, mTesoreriaConstantes.CLI_ID, cliId);

        return cliId;
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

      var showApply = function() {

        var cobzId = null;
        cobzId = m_dialog.getId();

        if(cobzId === NO_ID) { return; }

        var total = null;
        var cotiz = null;
        var nroDoc = null;
        var cliente = null;

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "select cobz_total, cobz_nrodoc, cobz.cli_id, cli_nombre,cobz.suc_id, cobz.doc_id, cobz.doct_id from Cobranza cobz inner join cliente cli  on cobz.cli_id = cli.cli_id where cobz_id = "+ cobzId.toString();

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(rs.isEOF()) { return; }

        total = Cairo.Database.valField(rs.getFields(), mTesoreriaConstantes.COBZ_TOTAL);
        nroDoc = Cairo.Database.valField(rs.getFields(), mTesoreriaConstantes.COBZ_NRODOC);
        cliente = Cairo.Database.valField(rs.getFields(), mTesoreriaConstantes.CLI_NAME);

        if(!DoCairo.Security.anAccess(csTesoreriaPrestacion.cSPRETSRMODIFYAPLIC, m_docId, csE_DocTypePrestacion.cSEDOCTPREAPLICAR)) { return; }

        if(m_objApply === null) {
          m_objApply = new cCobranzaAplic();

          // Edit Apply
          //
        }
        else {
          if(m_objApply.self.getId() !== cobzId) {
            m_objApply = new cCobranzaAplic();
          }
        }

        if(!m_objApply.self.show(cobzId, total, nroDoc, cliente)) {
          m_objApply = null;
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

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createListDialog = function(tabId) {

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
              Cairo.LoadingMessage.show("Xxxx", "Loading Xxxxs from Crowsoft Cairo server.");

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
          Cairo.LoadingMessage.show("Xxxx", "Loading Xxxxs from Crowsoft Cairo server.");

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