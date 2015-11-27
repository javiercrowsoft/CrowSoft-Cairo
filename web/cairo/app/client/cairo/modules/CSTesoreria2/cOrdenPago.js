(function() {
  "use strict";

  Cairo.module("Xxxx.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {
    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      // cOrdenPago
      // 27-01-2004

      var C_MODULE = "cOrdenPago";

      var C_CHEQUES = "Cheques";
      var C_CHEQUEST = "Cheque de Tercero";
      var C_EFECTIVO = "Efectivo";
      var C_OTROS = "Otros";
      var C_CTACTE = "Cuenta Corriente";

      var C_CHEQUERA = "Chequera";
      var C_CHEQUET = "chqt";

      var K_NUMERO = 1;
      var K_NRODOC = 2;
      var K_DESCRIP = 3;
      var K_FECHA = 4;
      var K_NETO = 6;
      var K_TOTAL = 9;
      var K_PROV_ID = 10;
      var K_DOC_ID = 11;
      var K_DOCT_ID = 12;
      var K_CHEQUES = 15;
      var K_CHEQUEST = 16;
      var K_EST_ID = 17;
      var K_CCOS_ID = 18;
      var K_SUC_ID = 19;
      var K_OTROS = 24;
      var K_COTIZACION = 25;
      var K_LGJ_ID = 27;
      var K_EFECTIVO = 28;
      var K_CTACTE = 30;

      var KI_IMPORTE = 1;
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

      var KIO_OPGI_ID = 1;
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
      var KIO_FC_ID_RET = 12;

      var KICH_OPGI_ID = 1;
      var KICH_CUE_ID = 2;
      var KICH_IMPORTE = 3;
      var KICH_IMPORTEORIGEN = 4;
      var KICH_CHEQUERA = 5;
      var KICH_CHEQUE = 6;
      var KICH_CHEQ_ID = 7;
      var KICH_MON_ID = 8;
      var KICH_FECHACOBRO = 10;
      var KICH_FECHAVTO = 11;
      var KICH_CLE_ID = 12;
      var KICH_DESCRIP = 13;

      var KIE_OPGI_ID = 1;
      var KIE_CUE_ID = 2;
      var KIE_MON_ID = 3;
      var KIE_IMPORTE = 4;
      var KIE_IMPORTEORIGEN = 5;
      var KIE_DESCRIP = 6;

      var KICC_OPGI_ID = 1;
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
      var m_lgj_id = 0;
      var m_legajo = "";

      var m_cotizacion = 0;
      var m_ccos_id = 0;
      var m_centroCosto = "";
      var m_suc_id = 0;
      var m_sucursal = "";
      var m_prov_id = 0;
      var m_proveedor = "";
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
      var m_tChequesDeleted = "";
      var m_efectivoDeleted = "";
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

      var m_fcIds = 0;

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

      self.showOrdenPago = function(provId,  vFcIds) { // TODO: Use of ByRef founded Public Sub ShowOrdenPago(ByVal ProvId As Long, ByRef vFcIds() As Long)
        try {

          m_prov_id = provId;
          Cairo.Database.getData(mTesoreriaConstantes.PROVEEDOR, mTesoreriaConstantes.PROV_ID, provId, mTesoreriaConstantes.PROV_NAME, m_proveedor);

          var i = null;
          G.redim(m_fcIds, vFcIds.Length + 1);
          for (i = 1; i <= vFcIds.Length + 1; i++) {
            m_fcIds[i] = vFcIds(i - 1);
          }

          if(!pInitMembers()) {
            return;
          }

          pShowStartWizard();

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "ShowOrdenPago", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var pInitMembers = function() {
        self.setDialog(new cABMGeneric());
        setCIEditGenericDoc_Footer(new cABMGeneric());
        setCIEditGenericDoc_Items(new cABMGeneric());

        if(!DoCairo.Security.anAccess(csTesoreriaPrestacion.cSPRETSRNEWORDENPAGO, Cairo.Constants.NO_ID, csE_DocTypePrestacion.cSEDOCTPRENEW)) {
          return null;
        }
        return true;
      };

      self.copy = function() {

        if(!DoCairo.Security.anAccessEx(csTesoreriaPrestacion.cSPRETSRNEWORDENPAGO, m_doc_id, csE_DocTypePrestacion.cSEDOCTPRENEW, true)) { return false; }

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, Cairo.Constants.NO_ID);
        m_copy = true;
        m_docEditable = true;
        m_docEditMsg = "";

        // Obtengo el numero para este comprobante
        //
        GetDocNumber(m_lastDoc, m_dialog, m_taPropuesto, mTesoreriaConstantes.OPG_NRODOC);
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
        GetDocNumber(m_lastDoc, m_dialog, m_taPropuesto, mTesoreriaConstantes.OPG_NRODOC);
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

          doc.setClientTable(mTesoreriaConstantes.ORDENPAGO);
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
              case K_CHEQUEST:
              case K_EFECTIVO:
                pShowPagoNeto();
                break;

              case K_OTROS:
                pShowPagoOtro();
                break;
            }
            pShowPagoTotal();

            break;

          case Dialogs.Message.MSG_DOC_EDIT_STATE:
            //'Orden de pago
            ShowEditState(m_docEditMsg, Cairo.Language.getText(1922, ""));

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
            DocAnular(m_id, m_est_id, m_estado, csTesoreriaPrestacion.cSPRETSRANULARORDENPAGO, csTesoreriaPrestacion.cSPRETSRDESANULARORDENPAGO, m_dialog, m_docEditable, m_docEditMsg, "sp_DocOrdenPagoAnular", "sp_DocOrdenPagoEditableGet");
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
            cPublicDoc.documentSearch(csEDocumentoTipo.cSEDT_ORDENPAGO, self, !CBool(info));

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

                if(DocCanSave(m_dialog, mTesoreriaConstantes.OPG_FECHA)) {

                  var editDoc = null;
                  editDoc = new cEditDocEx();

                  editDoc.setObjectClient(self);
                  editDoc.edit(m_id, m_doct_id, mTesoreriaConstantes.ORDENPAGO, mTesoreriaConstantes.OPG_ID, mTesoreriaConstantes.ORDENPAGOITEM, mTesoreriaConstantes.OPGI_ID, csTesoreriaPrestacion.cSPRETSRNEWORDENPAGO, csTesoreriaPrestacion.cSPRETSREDITORDENPAGO, Cairo.Constants.NO_ID, m_prov_id, true);
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

              ShowHistory(csETablesTesoreria.cSORDENPAGO, m_id, m_documento+ " "+ m_nrodoc);
            }
            else {

              //'El documento aun no ha sido guardado
              MsgInfo(Cairo.Language.getText(1552, ""));
            }

            break;

          case Dialogs.Message.MSG_EXPORT_GET_EMAIL:

            _rtn = GetEmailFromProveedor(pGetProveedor());

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
              GetDocNumber(m_lastDoc, m_dialog, m_taPropuesto, mTesoreriaConstantes.OPG_NRODOC);

            }

            // Defino el estado de edicion del comprobante
            //
            pSetEnabled();

            break;

          case K_PROV_ID:

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
        if(!DocCanSave(m_dialog, mTesoreriaConstantes.OPG_FECHA)) {
          _rtn = false;
          return _rtn;
        }

        // OJO -tsr
        if(pGetCheques().getRows().count() === 0 && pGetTCheques().getRows().count() === 0 && pGetEfectivo().getRows().count() === 0 && pGetOtros().getRows().count() === 0) {

          //'El documento debe contener al menos un item
          MsgWarning(Cairo.Language.getText(3903, ""));
          _rtn = false;
          return _rtn;
        }

        var mouse = null;
        mouse = new cMouseWait();

        DoEvents:(DoEvents: DoEvents: DoEvents);

        var register = new Cairo.Database.Register();
        register.setFieldId(mTesoreriaConstantes.OPG_TMPID);
        register.setTable(mTesoreriaConstantes.ORDENPAGOTMP);

        register.setId(Cairo.Constants.NEW_ID);

        var apiPath = Cairo.Database.getAPIVersion();
        register.setPath(apiPath + "general/ordenpago");

        if(m_copy) {
          register.getFields().add2(mTesoreriaConstantes.OPG_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);
        }
        else {
          register.getFields().add2(mTesoreriaConstantes.OPG_ID, m_id, Cairo.Constants.Types.long);
        }

        if(register.getID() === Cairo.Constants.NEW_ID) {
          m_est_id = CSGeneralEx2.csEEstado.cSEEST_PENDIENTE;
        }

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          var property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NUMERO:
              register.getFields().add2(mTesoreriaConstantes.OPG_NUMERO, property.getValue(), Cairo.Constants.Types.long);
              break;

            case K_NRODOC:
              register.getFields().add2(mTesoreriaConstantes.OPG_NRODOC, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_DESCRIP:
              register.getFields().add2(mTesoreriaConstantes.OPG_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_FECHA:
              register.getFields().add2(mTesoreriaConstantes.OPG_FECHA, property.getValue(), Cairo.Constants.Types.date);
              break;

            case K_PROV_ID:
              register.getFields().add2(mTesoreriaConstantes.PROV_ID, property.getSelectId(), Cairo.Constants.Types.id);
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
              register.getFields().add2(mTesoreriaConstantes.OPG_COTIZACION, property.getValue(), Cairo.Constants.Types.double);
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
              register.getFields().add2(mTesoreriaConstantes.OPG_NETO, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.currency);
              break;

            case K_OTROS:
              register.getFields().add2(mTesoreriaConstantes.OPG_OTROS, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.currency);
              break;

            case K_TOTAL:
              register.getFields().add2(mTesoreriaConstantes.OPG_TOTAL, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.currency);
              break;
          }
        }

        register.getFields().add2(mTesoreriaConstantes.OPG_GRABAR_ASIENTO, 1, Cairo.Constants.Types.boolean);
        register.getFields().add2(Cairo.Constants.EST_ID, m_est_id, Cairo.Constants.Types.id);

        register.getFields().setHaveLastUpdate(true);
        register.getFields().setHaveWhoModify(true);

        register.prepareTransaction();
        if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return _rtn; }

        m_iOrden = 0;

        if(!pSaveCheques(register.getID())) { return _rtn; }
        if(!pSaveTCheques(register.getID())) { return _rtn; }
        if(!pSaveEfectivo(register.getID())) { return _rtn; }
        if(!pSaveOtros(register.getID())) { return _rtn; }
        if(!pSaveCtaCte(register.getID())) { return _rtn; }

        var sqlstmt = null;
        var rs = null;
        sqlstmt = "sp_DocOrdenPagoSave "+ register.getID().toString();

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
        return "#general/ordenpago/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "ordenpago" + id;
      };

      self.getTitle = function() {
        //'Orden de pago
        return Cairo.Language.getText(1922, "");
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

            case K_PROV_ID:
              if(ValEmpty(property.getSelectId(), Cairo.Constants.Types.id)) {
                //'Debe indicar un Proveedor
                MsgInfo(Cairo.Language.getText(1860, ""));
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

            case K_CHEQUEST:
              _rtn = pIsEmptyRowTCheques(row, rowIndex);
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

          sqlstmt = "select doct_id, doc_id from OrdenPago where opg_id = "+ id.toString();
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
        return Cairo.Security.hasPermissionTo(csTesoreriaPrestacion.cSPRETSRLISTORDENPAGO);
      };

      self.setDialog = function(rhs) {

        #If PREPROC_SFS Then;
        var abmGen = null;
                #Else;
        var abmGen = null;
                #End If;

        m_dialog = rhs;
        m_dialog.setIsDocument(true);

                #If !PREPROC_SFS Then;
        abmGen = m_dialog;
        abmGen.FactoryObject = "CSABMInterface2.cFactory";
        abmGen.ObjForm = "CSABMInterface2.fOrdenPago";
                #End If;
      };

      self.isEditing = function() {
        return m_editing;
      };

      self.edit = function(id,  inModalWindow) {
        var p = Cairo.Promises.resolvedPromise(false);
        try {

          if(!DoCairo.Security.anAccess(csTesoreriaPrestacion.cSPRETSRLISTORDENPAGO, GetdocIdFromObjAbm(m_dialog), csE_DocTypePrestacion.cSEDOCTPRELIST)) { return p; }

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
                  pShowStartWizard();

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
              _rtn = pColAUpdateCheque(pGetChequesProperty(), lRow, lCol);
              break;

            case K_CHEQUEST:
              _rtn = pColAUpdateTCheque(pGetTChequesProperty(), lRow, lCol);
              break;

            case K_OTROS:
              _rtn = pColAUpdateOtro(pGetOtrosProperty(), lRow, lCol);
              break;

            case K_EFECTIVO:
              _rtn = pColAUpdateEfectivo(pGetEfectivoProperty(), lRow, lCol);
              break;

            case K_CTACTE:
              _rtn = pColAUpdateCtaCte(pGetCtaCteProperty(), lRow, lCol);
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
        return true;
      };

      var columnBeforeEdit = function(key,  lRow,  lCol,  iKeyAscii) {
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
            id = Cairo.Util.val(Dialogs.cell(row, KICH_OPGI_ID).getValue());
            if(id !== Cairo.Constants.NO_ID) { m_chequesDeleted = m_chequesDeleted+ id.toString()+ ","; }
            break;

          case K_CHEQUEST:
            id = Cairo.Util.val(Dialogs.cell(row, KICH_OPGI_ID).getValue());
            if(id !== Cairo.Constants.NO_ID) { m_tChequesDeleted = m_tChequesDeleted+ id.toString()+ ","; }
            break;

          case K_EFECTIVO:
            id = Cairo.Util.val(Dialogs.cell(row, KIE_OPGI_ID).getValue());
            if(id !== Cairo.Constants.NO_ID) { m_efectivoDeleted = m_efectivoDeleted+ id.toString()+ ","; }
            break;

          case K_OTROS:
            id = Cairo.Util.val(Dialogs.cell(row, KIO_OPGI_ID).getValue());
            if(id !== Cairo.Constants.NO_ID) { m_otrosDeleted = m_otrosDeleted+ id.toString()+ ","; }
            break;

          case K_CTACTE:
            id = Cairo.Util.val(Dialogs.cell(row, KIO_OPGI_ID).getValue());
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

            case K_CHEQUEST:
              _rtn = pValidateRowTCheques(row, rowIndex);
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

        var w_tabs = m_dialog.getTabs();

        w_tabs.clear();

        var tab = w_tabs.add(null);
        tab.setName(Cairo.Constants.c_strGeneral);

        var tab = w_tabs.add(null);
        tab.setIndex(1);
        //'Adicionales
        tab.setName(Cairo.Language.getText(1566, ""));

        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, mTesoreriaConstantes.DOC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSDocumento2.CSDocumento);
        //'Documento
        elem.setName(Cairo.Language.getText(1567, ""));
        elem.setKey(K_DOC_ID);
        elem.setSelectId(m_doc_id);
        elem.setValue(m_documento);
        elem.setSelectFilter("'doct_id = "+ csEDocumentoTipo.cSEDT_ORDENPAGO.toString()+ "'");

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

        var elem = properties.add(null, mTesoreriaConstantes.OPG_FECHA);
        elem.setType(Dialogs.PropertyType.date);
        //'Fecha
        elem.setName(Cairo.Language.getText(1569, ""));
        elem.setLeftLabel(-580);
        elem.setLeft(800);
        elem.setKey(K_FECHA);
        elem.setValue(m_fecha);

        var elem = properties.add(null, mTesoreriaConstantes.PROV_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROVEEDOR);
        elem.setTopFromProperty(mTesoreriaConstantes.OPG_FECHA);
        elem.setLeft(3100);
        elem.setLeftLabel(-780);
        //'Proveedor
        elem.setName(Cairo.Language.getText(1151, ""));
        elem.setKey(K_PROV_ID);
        elem.setSelectId(m_prov_id);
        elem.setValue(m_proveedor);

        var elem = properties.add(null, mTesoreriaConstantes.OPG_NRODOC);
        elem.setType(Dialogs.PropertyType.text);
        //'Número
        elem.setName(Cairo.Language.getText(1065, ""));
        elem.setSize(50);
        elem.setKey(K_NRODOC);
        elem.setValue(m_nrodoc);
        elem.setTextMask(m_taMascara);
        elem.setTextAlign(vbRightJustify);

        var elem = properties.add(null, mTesoreriaConstantes.LGJ_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSLEGAJO);
        //'Legajo
        elem.setName(Cairo.Language.getText(1575, ""));
        elem.setKey(K_LGJ_ID);
        elem.setSelectId(m_lgj_id);
        elem.setValue(m_legajo);
        elem.setTabIndex(1);

        var elem = properties.add(null, mTesoreriaConstantes.OPG_COTIZACION);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setTopFromProperty(mTesoreriaConstantes.OPG_NRODOC);
        elem.setLeft(6300);
        elem.setLeftLabel(-800);
        //'Cotización
        elem.setName(Cairo.Language.getText(1635, ""));
        elem.setFormat(m_generalConfig.getFormatDecCotizacion());
        elem.setKey(K_COTIZACION);
        elem.setValue(m_cotizacion);
        elem.setWidth(1000);

        var elem = properties.add(null, mTesoreriaConstantes.CCOS_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTROCOSTO);
        elem.setLeft(9500);
        elem.setTopFromProperty(mTesoreriaConstantes.PROV_ID);
        //'Centro de Costo
        elem.setName(Cairo.Language.getText(1057, ""));
        elem.setKey(K_CCOS_ID);
        elem.setSelectId(m_ccos_id);
        elem.setValue(m_centroCosto);

        var elem = properties.add(null, mTesoreriaConstantes.SUC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.SUCURSAL);
        //'Sucursal
        elem.setName(Cairo.Language.getText(1281, ""));
        elem.setKey(K_SUC_ID);
        elem.setSelectId(m_suc_id);
        elem.setValue(m_sucursal);

        var elem = properties.add(null, mTesoreriaConstantes.OPG_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        //'Observ.
        elem.setName(Cairo.Language.getText(1211, ""));
        elem.setLeftLabel(-600);
        elem.setSize(5000);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);
        elem.setLeftFromProperty(mTesoreriaConstantes.OPG_FECHA);
        elem.setTopFromProperty(mTesoreriaConstantes.OPG_NRODOC);
        elem.setWidth(10970);
        elem.setHeight(800);
        elem.setTopToPrevious(440);

        if(!m_dialog.show(self)) { return false; }

        /////////////////////////////////////////////////////////////////////
        // ITEMS
        /////////////////////////////////////////////////////////////////////

        var c_TabCheque = 0;
        var c_TabEfectivo = 1;
        var c_TabChequeT = 2;
        var c_TabOtros = 3;
        var c_TabCtaCte = 4;

        var w_tabs = m_items.getTabs();

        w_tabs.clear();

        var tab = w_tabs.add(null);
        tab.setIndex(c_TabCheque);
        //'Cheques
        tab.setName(Cairo.Language.getText(2099, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(c_TabEfectivo);
        //'Efectivo
        tab.setName(Cairo.Language.getText(2100, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(c_TabChequeT);
        //'Cheque de Tercero
        tab.setName(Cairo.Language.getText(2195, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(c_TabOtros);
        //'Otros
        tab.setName(Cairo.Language.getText(1070, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(c_TabCtaCte);
        //'Cta Corriente
        tab.setName(Cairo.Language.getText(2102, ""));

        abmGen = m_items;
        abmGen.ResetLayoutMembers;

        var properties = m_items.getProperties();

        properties.clear();

        ///////////////////////////////////////////////////////////////////
        // CHEQUES
        c = properties.add(null, C_CHEQUES);
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
        c = properties.add(null, C_EFECTIVO);
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
        // CHEQUES DE TERCERO
        c = properties.add(null, C_CHEQUEST);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        setGridTCheques(c);
        if(!pLoadTCheques(c)) { return false; }
        c.setName(C_CHEQUEST);
        c.setKey(K_CHEQUEST);
        c.setTabIndex(c_TabChequeT);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);
        m_tChequesDeleted = "";

        ///////////////////////////////////////////////////////////////////
        // OTROS
        c = properties.add(null, C_OTROS);
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
        c = properties.add(null, C_CTACTE);
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

        var properties = m_footer.getProperties();

        properties.clear();

        var elem = properties.add(null, mTesoreriaConstantes.OPG_NETO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        //'Neto
        elem.setName(Cairo.Language.getText(1581, ""));
        elem.setKey(K_NETO);
        elem.setValue(m_neto);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setEnabled(false);

        var elem = properties.add(null, mTesoreriaConstantes.OPG_OTROS);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        //'Otros
        elem.setName(Cairo.Language.getText(1070, ""));
        elem.setKey(K_OTROS);
        elem.setValue(m_otros);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setEnabled(false);

        var elem = properties.add(null, mTesoreriaConstantes.OPG_TOTAL);
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

        // Se hace al final para evitar que se muestre el
        // form antes de tiempo
        //
        pSetFilterColFactura();

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(mTesoreriaConstantes.DOC_ID);
        elem.setSelectId(m_doc_id);
        elem.setValue(m_documento);

        var elem = properties.item(cDeclarations.getCsDocNumberID());
        elem.setValue(m_numero);

        var elem = properties.item(cDeclarations.getCsDocEstateID());
        elem.setValue(m_estado);

        var elem = properties.item(mTesoreriaConstantes.OPG_FECHA);
        elem.setValue(m_fecha);

        var elem = properties.item(mTesoreriaConstantes.PROV_ID);
        elem.setSelectId(m_prov_id);
        elem.setValue(m_proveedor);

        var elem = properties.item(mTesoreriaConstantes.OPG_NRODOC);
        elem.setValue(m_nrodoc);

        var elem = properties.item(mTesoreriaConstantes.LGJ_ID);
        elem.setSelectId(m_lgj_id);
        elem.setValue(m_legajo);

        var elem = properties.item(mTesoreriaConstantes.OPG_COTIZACION);
        elem.setValue(m_cotizacion);

        var elem = properties.item(mTesoreriaConstantes.CCOS_ID);
        elem.setSelectId(m_ccos_id);
        elem.setValue(m_centroCosto);

        var elem = properties.item(mTesoreriaConstantes.SUC_ID);
        elem.setSelectId(m_suc_id);
        elem.setValue(m_sucursal);

        var elem = properties.item(mTesoreriaConstantes.OPG_DESCRIP);
        elem.setValue(m_descrip);

        var elem = properties.item(mTesoreriaConstantes.OPG_NETO);
        elem.setValue(m_neto);

        var elem = properties.item(mTesoreriaConstantes.OPG_OTROS);
        elem.setValue(m_otros);

        var elem = properties.item(mTesoreriaConstantes.OPG_TOTAL);
        elem.setValue(m_total);

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
        elem.setKey(KIO_OPGI_ID);

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

        var elem = w_columns.add(null, mTesoreriaConstantes.FC_ID_RET);
        //' Factura
        elem.setName(Cairo.Language.getText(1866, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(csFacturaCompra);
        elem.setWidth(1200);
        elem.setKey(KIO_FC_ID_RET);

        var f = null;
        var fv = null;

        for(var _i = 0; _i < m_data.otros.length; _i += 1) {

          f = property.getGrid().getRows().add(null, rs(mTesoreriaConstantes.OPGI_ID).Value);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.OPGI_ID));
          fv.setKey(KIO_OPGI_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.CUE_NAME));
          fv.setID(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.CUE_ID));
          fv.setKey(KIO_CUE_ID);

          fv = f.add(null);
          if(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.OPGI_OTRO_TIPO) === csEItemOtroTipo.cSEOTROHABER) {
            fv.setValue(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.OPGI_IMPORTE));
          }
          else {
            fv.setValue(0);
          }
          fv.setKey(KIO_DEBE);

          fv = f.add(null);
          if(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.OPGI_OTRO_TIPO) === csEItemOtroTipo.cSEOTRODEBE) {
            fv.setValue(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.OPGI_IMPORTE));
          }
          else {
            fv.setValue(0);
          }
          fv.setKey(KIO_HABER);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.OPGI_IMPORTE_ORIGEN));
          fv.setKey(KIO_IMPORTEORIGEN);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.OPGI_DESCRIP));
          fv.setKey(KIO_DESCRIP);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.RET_NAME));
          fv.setID(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.RET_ID));
          fv.setKey(KIO_RET_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.OPGI_NRO_RETENCION));
          fv.setKey(KIO_NRORETENCION);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.OPGI_PORC_RETENCION));
          fv.setKey(KIO_PORCRETENCION);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.OPGI_FECHA_RETENCION));
          fv.setKey(KIO_FECHARETENCION);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.CCOS_NAME));
          fv.setID(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.CCOS_ID));
          fv.setKey(KIO_CCOS_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.FC_NRODOC));
          fv.setID(Cairo.Database.valField(m_data.otros[_i], mTesoreriaConstantes.FC_ID_RET));
          fv.setKey(KIO_FC_ID_RET);

        }

        return true;
      };

      var setGridTCheques = function(property) {
        var grid = null;

        property.getGrid().getColumns().clear();
        property.getGrid().getRows().clear();

        grid = property.getGrid();

        var w_columns = grid.getColumns();
        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(mPublic.kICHT_OPGI_ID);

        var elem = w_columns.add(null);
        //'Cuenta
        elem.setName(Cairo.Language.getText(1267, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);

        //.HelpFilter = cscCuecId & "=" & csECuecDocEnCartera
        elem.setSelectFilter(mPublic.self.getHelpFilterChequesT());

        elem.setWidth(2200);
        elem.setKey(mPublic.kICHT_CUE_ID);

        var elem = w_columns.add(null, C_CHEQUET);
        //'Nr. Cheque
        elem.setName(Cairo.Language.getText(2059, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(csETablesTesoreria.cSCHEQUE);
        elem.setSelectFilter("1 = 2");
        elem.setSubType(Dialogs.PropertySubType.Integer);
        elem.setWidth(1000);
        elem.setKey(mPublic.kICHT_CHEQUE);

        var elem = w_columns.add(null);
        //'Cliente
        elem.setName(Cairo.Language.getText(1150, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(2000);
        elem.setKey(mPublic.kICHT_CLI_ID);

        var elem = w_columns.add(null);
        //'Banco
        elem.setName(Cairo.Language.getText(1122, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(2000);
        elem.setKey(mPublic.kICHT_BCO_ID);

        var elem = w_columns.add(null);
        //'Mon
        elem.setName(Cairo.Language.getText(2063, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setWidth(520);
        elem.setKey(mPublic.kICHT_MON_ID);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        //'Origen
        elem.setName(Cairo.Language.getText(1901, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(mPublic.kICHT_IMPORTEORIGEN);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        //'Importe
        elem.setName(Cairo.Language.getText(1228, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(mPublic.kICHT_IMPORTE);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        //'Depositar el
        elem.setName(Cairo.Language.getText(2065, ""));
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(970);
        elem.setKey(mPublic.kICHT_FECHACOBRO);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        //'Vto."
        elem.setName(Cairo.Language.getText(1901, ""));
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(970);
        elem.setKey(mPublic.kICHT_FECHAVTO);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        //'Clering
        elem.setName(Cairo.Language.getText(1083, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CLEARING);
        elem.setWidth(800);
        elem.setKey(mPublic.kICHT_CLE_ID);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setWidth(1600);
        elem.setKey(mPublic.kICHT_DESCRIP);

        var f = null;
        var fv = null;

        for(var _i = 0; _i < m_data.tCheques.length; _i += 1) {

          f = property.getGrid().getRows().add(null, rs(mTesoreriaConstantes.OPGI_ID).Value);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], mTesoreriaConstantes.OPGI_ID));
          fv.setKey(mPublic.kICHT_OPGI_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], mTesoreriaConstantes.CUE_NAME));
          fv.setID(Cairo.Database.valField(m_data.tCheques[_i], mTesoreriaConstantes.CUE_ID));
          fv.setKey(mPublic.kICHT_CUE_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], mTesoreriaConstantes.CHEQ_NUMERO_DOC));
          fv.setID(Cairo.Database.valField(m_data.tCheques[_i], mTesoreriaConstantes.CHEQ_ID));
          fv.setKey(mPublic.kICHT_CHEQUE);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], mTesoreriaConstantes.CLI_NAME));
          fv.setKey(mPublic.kICHT_CLI_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], mTesoreriaConstantes.BCO_NAME));
          fv.setKey(mPublic.kICHT_BCO_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], mTesoreriaConstantes.MON_NAME));
          fv.setID(Cairo.Database.valField(m_data.tCheques[_i], mTesoreriaConstantes.MON_ID));
          fv.setKey(mPublic.kICHT_MON_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], mTesoreriaConstantes.OPGI_IMPORTE_ORIGEN));
          fv.setKey(mPublic.kICHT_IMPORTEORIGEN);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], mTesoreriaConstantes.OPGI_IMPORTE));
          fv.setKey(mPublic.kICHT_IMPORTE);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], mTesoreriaConstantes.CHEQ_FECHA_COBRO));
          fv.setKey(KICH_FECHACOBRO);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], mTesoreriaConstantes.CHEQ_FECHA_VTO));
          fv.setKey(KICH_FECHAVTO);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], mTesoreriaConstantes.CLE_NAME));
          fv.setKey(KICH_CLE_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], mTesoreriaConstantes.OPGI_DESCRIP));
          fv.setKey(KICH_DESCRIP);

        }

        return true;
      };

      var setGridCheques = function(property) {
        var grid = null;

        property.getGrid().getColumns().clear();
        property.getGrid().getRows().clear();

        grid = property.getGrid();

        var w_columns = grid.getColumns();
        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KICH_OPGI_ID);

        var elem = w_columns.add(null);
        //'Cuenta
        elem.setName(Cairo.Language.getText(1267, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);

        //.HelpFilter = cscCuecId & "=" & csECuecBancos
        elem.setSelectFilter(mPublic.self.getHelpFilterChequesP());

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

        var elem = w_columns.add(null, C_CHEQUERA);
        //'Chequera
        elem.setName(Cairo.Language.getText(2064, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CHEQUERA);
        elem.setWidth(1000);
        elem.setKey(KICH_CHEQUERA);

        var elem = w_columns.add(null);
        //'Nr. Cheque
        elem.setName(Cairo.Language.getText(2059, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(KICH_CHEQUE);

        var elem = w_columns.add(null);
        //'Cheque
        elem.setName(Cairo.Language.getText(2058, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setEnabled(false);
        elem.setKey(KICH_CHEQ_ID);

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
        elem.getDefaultValue().setValue(DateAdd("y", 1, Date));
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

        var f = null;
        var fv = null;

        for(var _i = 0; _i < m_data.cheques.length; _i += 1) {

          f = property.getGrid().getRows().add(null, rs(mTesoreriaConstantes.OPGI_ID).Value);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.OPGI_ID));
          fv.setKey(KICH_OPGI_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.CUE_NAME));
          fv.setID(Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.CUE_ID));
          fv.setKey(KICH_CUE_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.MON_NAME));
          fv.setID(Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.MON_ID));
          fv.setKey(KICH_MON_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.OPGI_IMPORTE_ORIGEN));
          fv.setKey(KICH_IMPORTEORIGEN);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.OPGI_IMPORTE));
          fv.setKey(KICH_IMPORTE);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.CHQ_CODE));
          fv.setID(Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.CHQ_ID));
          fv.setKey(KICH_CHEQUERA);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.CHEQ_NUMERO_DOC));
          fv.setKey(KICH_CHEQUE);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.CHEQ_NUMERO));
          fv.setID(Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.CHEQ_ID));
          fv.setKey(KICH_CHEQ_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.CHEQ_FECHA_COBRO));
          fv.setKey(KICH_FECHACOBRO);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.CHEQ_FECHA_VTO));
          fv.setKey(KICH_FECHAVTO);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.CLE_NAME));
          fv.setID(Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.CLE_ID));
          fv.setKey(KICH_CLE_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.cheques[_i], mTesoreriaConstantes.OPGI_DESCRIP));
          fv.setKey(KICH_DESCRIP);

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
        elem.setKey(KIE_OPGI_ID);

        var elem = w_columns.add(null);
        //'Cuenta
        elem.setName(Cairo.Language.getText(1267, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);

        //.HelpFilter = cscCuecId & "=" & csECuecCaja
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

          f = property.getGrid().getRows().add(null, rs(mTesoreriaConstantes.OPGI_ID).Value);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.efectivo[_i], mTesoreriaConstantes.OPGI_ID));
          fv.setKey(KIE_OPGI_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.efectivo[_i], mTesoreriaConstantes.CUE_NAME));
          fv.setID(Cairo.Database.valField(m_data.efectivo[_i], mTesoreriaConstantes.CUE_ID));
          fv.setKey(KIE_CUE_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.efectivo[_i], mTesoreriaConstantes.MON_NAME));
          fv.setID(Cairo.Database.valField(m_data.efectivo[_i], mTesoreriaConstantes.MON_ID));
          fv.setKey(KIE_MON_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.efectivo[_i], mTesoreriaConstantes.OPGI_IMPORTE_ORIGEN));
          fv.setKey(KIE_IMPORTEORIGEN);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.efectivo[_i], mTesoreriaConstantes.OPGI_IMPORTE));
          fv.setKey(KIE_IMPORTE);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.efectivo[_i], mTesoreriaConstantes.OPGI_DESCRIP));
          fv.setKey(KIE_DESCRIP);

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
        elem.setKey(KICC_OPGI_ID);

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

          f = property.getGrid().getRows().add(null, rs(mTesoreriaConstantes.OPGI_ID).Value);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.ctaCte[_i], mTesoreriaConstantes.OPGI_ID));
          fv.setKey(KICC_OPGI_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.ctaCte[_i], mTesoreriaConstantes.CUE_NAME));
          fv.setID(Cairo.Database.valField(m_data.ctaCte[_i], mTesoreriaConstantes.CUE_ID));
          fv.setKey(KICC_CUE_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.ctaCte[_i], mTesoreriaConstantes.OPGI_IMPORTE_ORIGEN));
          fv.setKey(KICC_IMPORTEORIGEN);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.ctaCte[_i], mTesoreriaConstantes.OPGI_IMPORTE));
          fv.setKey(KICC_IMPORTE);

        }

        return true;
      };

      var load = function(id) {

        var apiPath = Cairo.Database.getAPIVersion();
        return Cairo.Database.getData("load[" + apiPath + "general/ordenpago]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== Cairo.Constants.NO_ID) {

              m_isNew = false;

              m_id = Cairo.Database.valField(response.data, mTesoreriaConstantes.OPG_ID);
              m_numero = Cairo.Database.valField(response.data, mTesoreriaConstantes.OPG_NUMERO);
              m_nrodoc = Cairo.Database.valField(response.data, mTesoreriaConstantes.OPG_NRODOC);
              m_descrip = Cairo.Database.valField(response.data, mTesoreriaConstantes.OPG_DESCRIP);
              m_fecha = Cairo.Database.valField(response.data, mTesoreriaConstantes.OPG_FECHA);
              m_neto = Cairo.Database.valField(response.data, mTesoreriaConstantes.OPG_NETO);
              m_total = Cairo.Database.valField(response.data, mTesoreriaConstantes.OPG_TOTAL);
              m_otros = Cairo.Database.valField(response.data, mTesoreriaConstantes.OPG_OTROS);
              m_cotizacion = Cairo.Database.valField(response.data, mTesoreriaConstantes.OPG_COTIZACION);
              m_prov_id = Cairo.Database.valField(response.data, mTesoreriaConstantes.PROV_ID);
              m_proveedor = Cairo.Database.valField(response.data, mTesoreriaConstantes.PROV_NAME);
              m_ccos_id = Cairo.Database.valField(response.data, mTesoreriaConstantes.CCOS_ID);
              m_centroCosto = Cairo.Database.valField(response.data, mTesoreriaConstantes.CCOS_NAME);
              m_suc_id = Cairo.Database.valField(response.data, mTesoreriaConstantes.SUC_ID);
              m_sucursal = Cairo.Database.valField(response.data, mTesoreriaConstantes.SUC_NAME);
              m_doc_id = Cairo.Database.valField(response.data, mTesoreriaConstantes.DOC_ID);
              m_documento = Cairo.Database.valField(response.data, mTesoreriaConstantes.DOC_NAME);
              m_doct_id = Cairo.Database.valField(response.data, mTesoreriaConstantes.DOCT_ID);
              m_lgj_id = Cairo.Database.valField(response.data, mTesoreriaConstantes.LGJ_ID);
              m_legajo = Cairo.Database.valField(response.data, mTesoreriaConstantes.LGJ_CODE);
              m_creado = Cairo.Database.valField(response.data, Cairo.Constants.CREADO);
              m_modificado = Cairo.Database.valField(response.data, Cairo.Constants.MODIFICADO);
              m_modifico = Cairo.Database.valField(response.data, Cairo.Constants.MODIFICO);
              m_est_id = Cairo.Database.valField(response.data, Cairo.Constants.EST_ID);
              m_estado = Cairo.Database.valField(response.data, Cairo.Constants.EST_NAME);
              m_firmado = Cairo.Database.valField(response.data, mTesoreriaConstantes.OPG_FIRMADO);
              m_docEditable = Cairo.Database.valField(response.data, Cairo.Constants.DOC_EDITABLE);
              m_docEditMsg = Cairo.Database.valField(response.data, Cairo.Constants.DOCEDIT_MSG);

              // Para ver documentos auxiliares
              //
              m_as_id = Cairo.Database.valField(response.data, mTesoreriaConstantes.AS_ID);

              m_taPropuesto = Cairo.Database.valField(response.data, Cairo.Constants.TA__PROPUESTO);
              m_taMascara = Cairo.Database.valField(response.data, Cairo.Constants.TA__MASCARA);

              m_lastDoc = m_doc_id;
              m_lastCli = m_prov_id;
              m_lastDocName = m_documento;
              m_lastCliName = m_proveedor;

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
              m_prov_id = Cairo.Constants.NO_ID;
              m_proveedor = "";
              m_ccos_id = Cairo.Constants.NO_ID;
              m_centroCosto = "";
              m_doc_id = Cairo.Constants.NO_ID;
              m_documento = "";
              m_doct_id = Cairo.Constants.NO_ID;
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
              m_prov_id = m_lastCli;
              m_proveedor = m_lastCliName;
              m_documento = m_lastDocName;

              DocEditableGet(m_doc_id, m_docEditable, m_docEditMsg, csTesoreriaPrestacion.cSPRETSRNEWORDENPAGO);
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

      var pGetCueIdProveedor = function(cue_id) { // TODO: Use of ByRef founded Private Function pGetCueIdProveedor(ByRef cue_id As Long) As Boolean
        var sqlstmt = null;
        var rs = null;

        // Cuenta contable del Proveedor
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

        sqlstmt = "sp_DocOrdenPagoFirmar "+ m_id+ ","+ us_id.toString();
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

        m_est_id = Cairo.Database.valField(rs.getFields(), Cairo.Constants.EST_ID);
        m_estado = Cairo.Database.valField(rs.getFields(), Cairo.Constants.EST_NAME);

        var iProp = null;
        iProp = m_dialog.getProperties().item(cDeclarations.getCsDocEstateID());

        iProp.setSelectId(m_est_id);
        iProp.setValue(m_estado);

        Cairo.Database.getData(mTesoreriaConstantes.ORDENPAGO, mTesoreriaConstantes.OPG_ID, m_id, mTesoreriaConstantes.OPG_FIRMADO, m_firmado);

        m_dialog.showValue(iProp);

        return true;
      };

      var pMove = function(moveTo) {
        var sqlstmt = null;
        var rs = null;
        var doc_id = null;

        doc_id = m_dialog.getProperties().item(mTesoreriaConstantes.DOC_ID).getSelectId();

        if(doc_id === Cairo.Constants.NO_ID) { MsgInfo(Cairo.Language.getText(1595, "")); }
        //Debe seleccionar un documento

        sqlstmt = "sp_DocOrdenPagoMover "+ moveTo+ ","+ m_numero+ ","+ doc_id.toString();

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
              GetDocNumber(m_lastDoc, m_dialog, m_taPropuesto, mTesoreriaConstantes.OPG_NRODOC);

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

        c = properties.item(mTesoreriaConstantes.OPG_FECHA);
        c.setValue(m_fecha);

        c = properties.item(mTesoreriaConstantes.PROV_ID);
        c.setSelectId(m_prov_id);
        c.setValue(m_proveedor);

        c = properties.item(cDeclarations.getCsDocNumberID());
        c.setValue(m_numero);

        c = properties.item(cDeclarations.getCsDocEstateID());
        c.setValue(m_estado);

        c = properties.item(mTesoreriaConstantes.OPG_NRODOC);
        c.setValue(m_nrodoc);
        c.setTextMask(m_taMascara);
        c.setTextAlign(vbRightJustify);

        c = properties.item(mTesoreriaConstantes.OPG_COTIZACION);
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

        c = properties.item(mTesoreriaConstantes.OPG_DESCRIP);
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

        c = pGetTChequesProperty();
        if(!pLoadTCheques(c)) { return; }

        m_tChequesDeleted = "";

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

        c = properties.item(mTesoreriaConstantes.OPG_OTROS);
        c.setValue(m_otros);

        c = properties.item(mTesoreriaConstantes.OPG_NETO);
        c.setValue(m_neto);

        c = properties.item(mTesoreriaConstantes.OPG_TOTAL);
        c.setValue(m_total);

        abmGen = m_footer;
        abmGen.ShowValues(m_footer.getProperties());

        pSetEnabled();
      };

      var pShowStartWizard = function() {
        try {

          var oWizard = null;
          oWizard = new cOrdenPagoWizard();

          if(!oWizard.self.load()) { return; }

          oWizard.self.setProv_id(m_prov_id);
          oWizard.self.setProveedor() = m_proveedor;
          oWizard.self.setFcIds() = m_fcIds;
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

          iObjWizard.show("CSTesoreria2.cOrdenPagoWizard");

          oObjWizard.getObjAbm().getObjForm().ZOrder;

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

          //'Error al grabar la orden de pago
          c_ErrorSave = Cairo.Language.getText(1910, "");

          m_generalConfig = new cGeneralConfig();
          m_generalConfig.Load;
          G.redim(m_fcIds, 0);
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
          G.redim(m_fcIds, 0);

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "Class_Terminate", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      //////////////////////////////////////////////////////////////
      var pSaveTCheques = function(id) {
        var register = null;
        var row = null;
        var cell = null;

        var _count = pGetTCheques().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetTCheques().getRows().item(_i);

          register = new cRegister();
          register.setFieldId(mTesoreriaConstantes.OPGI_TMPID);
          register.setTable(mTesoreriaConstantes.ORDENPAGOITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KICH_OPGI_ID:
                if(m_copy) {
                  register.getFields().add2(mTesoreriaConstantes.OPGI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.integer);
                }
                else {
                  register.getFields().add2(mTesoreriaConstantes.OPGI_ID, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.integer);
                }
                break;

              case mPublic.kICHT_DESCRIP:
                register.getFields().add2(mTesoreriaConstantes.OPGI_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);

                break;

              case mPublic.kICHT_CHEQUE:
                register.getFields().add2(mTesoreriaConstantes.CHEQ_ID, cell.getId(), Cairo.Constants.Types.id);

                break;

              case mPublic.kICHT_CLE_ID:
                register.getFields().add2(mTesoreriaConstantes.CLE_ID, cell.getId(), Cairo.Constants.Types.id);

                break;

              case mPublic.kICHT_MON_ID:
                register.getFields().add2(mTesoreriaConstantes.MON_ID, cell.getId(), Cairo.Constants.Types.id);

                break;

              case mPublic.kICHT_FECHACOBRO:
                register.getFields().add2(mTesoreriaConstantes.OPGI_TMPFECHA_COBRO, cell.getValue(), Cairo.Constants.Types.date);

                break;

              case mPublic.kICHT_FECHAVTO:
                register.getFields().add2(mTesoreriaConstantes.OPGI_TMPFECHA_VTO, cell.getValue(), Cairo.Constants.Types.date);

                break;

              case mPublic.kICHT_CUE_ID:
                register.getFields().add2(mTesoreriaConstantes.CUE_ID, cell.getId(), Cairo.Constants.Types.id);

                break;

              case mPublic.kICHT_IMPORTEORIGEN:
                register.getFields().add2(mTesoreriaConstantes.OPGI_IMPORTE_ORIGEN, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);

                break;

              case mPublic.kICHT_IMPORTE:
                register.getFields().add2(mTesoreriaConstantes.OPGI_IMPORTE, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                break;
            }
          }

          m_iOrden = m_iOrden + 1;
          register.getFields().add2(mTesoreriaConstantes.OPGI_ORDEN, m_iOrden, Cairo.Constants.Types.integer);
          register.getFields().add2(mTesoreriaConstantes.OPGI_TIPO, csEOrdenPagoItemTipo.cSEOPGITCHEQUEST, Cairo.Constants.Types.integer);
          register.getFields().add2(mTesoreriaConstantes.OPG_TMPID, id, Cairo.Constants.Types.id);
          register.getFields().add2(mTesoreriaConstantes.OPGI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);
          register.getFields().add2(mTesoreriaConstantes.OPGI_OTRO_TIPO, csEItemOtroTipo.cSEOTROHABER, Cairo.Constants.Types.integer);

          register.getFields().setHaveLastUpdate(false);
          register.getFields().setHaveWhoModify(false);

          if(!Cairo.Database.save(register, , "pSaveTCheques", C_MODULE, c_ErrorSave)) { return false; }
        }

        var sqlstmt = null;

        if(LenB(m_tChequesDeleted) && m_id !== Cairo.Constants.NO_ID && !m_copy) {

          var vDeletes = null;
          var i = null;

          m_tChequesDeleted = RemoveLastColon(m_tChequesDeleted);
          vDeletes = Split(m_tChequesDeleted, ",");

          for (i = 0; i <= vDeletes.Length; i++) {

            register = new cRegister();
            register.setFieldId(mTesoreriaConstantes.OPGIB_TMPID);
            register.setTable(mTesoreriaConstantes.ORDENPAGOITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            register.getFields().add2(mTesoreriaConstantes.OPGI_ID, Cairo.Util.val(vDeletes(i)), Cairo.Constants.Types.integer);
            register.getFields().add2(mTesoreriaConstantes.OPG_ID, m_id, Cairo.Constants.Types.id);
            register.getFields().add2(mTesoreriaConstantes.OPG_TMPID, id, Cairo.Constants.Types.id);

            register.getFields().setHaveLastUpdate(false);
            register.getFields().setHaveWhoModify(false);

            if(!Cairo.Database.save(register, , "pSaveTCheques", C_MODULE, c_ErrorSave)) { return false; }
          }

        }

        return true;
      };

      var pSaveCheques = function(id) {
        var register = null;

        var row = null;
        var cell = null;

        var _count = pGetCheques().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetCheques().getRows().item(_i);

          register = new cRegister();
          register.setFieldId(mTesoreriaConstantes.OPGI_TMPID);
          register.setTable(mTesoreriaConstantes.ORDENPAGOITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KICH_OPGI_ID:
                if(m_copy) {
                  register.getFields().add2(mTesoreriaConstantes.OPGI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.integer);
                }
                else {
                  register.getFields().add2(mTesoreriaConstantes.OPGI_ID, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.integer);
                }
                break;

              case KICH_DESCRIP:
                register.getFields().add2(mTesoreriaConstantes.OPGI_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);

                break;

              case KICH_CHEQUERA:
                register.getFields().add2(mTesoreriaConstantes.CHQ_ID, cell.getId(), Cairo.Constants.Types.id);

                break;

              case KICH_CHEQUE:
                register.getFields().add2(mTesoreriaConstantes.OPGI_TMPCHEQUE, cell.getValue(), Cairo.Constants.Types.text);

                break;

              case KICH_CHEQ_ID:
                register.getFields().add2(mTesoreriaConstantes.CHEQ_ID, cell.getId(), Cairo.Constants.Types.id);

                break;

              case KICH_CLE_ID:
                register.getFields().add2(mTesoreriaConstantes.CLE_ID, cell.getId(), Cairo.Constants.Types.id);

                break;

              case KICH_MON_ID:
                register.getFields().add2(mTesoreriaConstantes.MON_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KICH_FECHACOBRO:
                register.getFields().add2(mTesoreriaConstantes.OPGI_TMPFECHA_COBRO, cell.getValue(), Cairo.Constants.Types.date);
                break;

              case KICH_FECHAVTO:
                register.getFields().add2(mTesoreriaConstantes.OPGI_TMPFECHA_VTO, cell.getValue(), Cairo.Constants.Types.date);

                break;

              case KICH_CUE_ID:
                register.getFields().add2(mTesoreriaConstantes.CUE_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KICH_IMPORTEORIGEN:
                register.getFields().add2(mTesoreriaConstantes.OPGI_IMPORTE_ORIGEN, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                break;

              case KICH_IMPORTE:
                register.getFields().add2(mTesoreriaConstantes.OPGI_IMPORTE, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                break;
            }
          }

          m_iOrden = m_iOrden + 1;
          register.getFields().add2(mTesoreriaConstantes.OPGI_ORDEN, m_iOrden, Cairo.Constants.Types.integer);
          register.getFields().add2(mTesoreriaConstantes.OPGI_TIPO, csEOrdenPagoItemTipo.cSEOPGITCHEQUES, Cairo.Constants.Types.integer);
          register.getFields().add2(mTesoreriaConstantes.OPG_TMPID, id, Cairo.Constants.Types.id);
          register.getFields().add2(mTesoreriaConstantes.OPGI_OTRO_TIPO, csEItemOtroTipo.cSEOTROHABER, Cairo.Constants.Types.integer);

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
            register.setFieldId(mTesoreriaConstantes.OPGIB_TMPID);
            register.setTable(mTesoreriaConstantes.ORDENPAGOITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            register.getFields().add2(mTesoreriaConstantes.OPGI_ID, Cairo.Util.val(vDeletes(i)), Cairo.Constants.Types.integer);
            register.getFields().add2(mTesoreriaConstantes.OPG_ID, m_id, Cairo.Constants.Types.id);
            register.getFields().add2(mTesoreriaConstantes.OPG_TMPID, id, Cairo.Constants.Types.id);

            register.getFields().setHaveLastUpdate(false);
            register.getFields().setHaveWhoModify(false);

            if(!Cairo.Database.save(register, , "pSaveCheques", C_MODULE, c_ErrorSave)) { return false; }
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
          register.setFieldId(mTesoreriaConstantes.OPGI_TMPID);
          register.setTable(mTesoreriaConstantes.ORDENPAGOITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KICH_OPGI_ID:
                if(m_copy) {
                  register.getFields().add2(mTesoreriaConstantes.OPGI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.integer);
                }
                else {
                  register.getFields().add2(mTesoreriaConstantes.OPGI_ID, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.integer);
                }
                break;

              case KIO_DESCRIP:
                register.getFields().add2(mTesoreriaConstantes.OPGI_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);
                break;

              case KIO_RET_ID:
                register.getFields().add2(mTesoreriaConstantes.RET_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KIO_NRORETENCION:
                register.getFields().add2(mTesoreriaConstantes.OPGI_NRO_RETENCION, cell.getValue(), Cairo.Constants.Types.text);
                break;

              case KIO_PORCRETENCION:
                register.getFields().add2(mTesoreriaConstantes.OPGI_PORC_RETENCION, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double);
                break;

              case KIO_CCOS_ID:
                register.getFields().add2(mTesoreriaConstantes.CCOS_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KIO_FC_ID_RET:
                register.getFields().add2(mTesoreriaConstantes.FC_ID_RET, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KIO_CUE_ID:
                register.getFields().add2(mTesoreriaConstantes.CUE_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KIO_FECHARETENCION:
                register.getFields().add2(mTesoreriaConstantes.OPGI_FECHA_RETENCION, cell.getValue(), Cairo.Constants.Types.date);
                break;

              case KIO_IMPORTEORIGEN:
                register.getFields().add2(mTesoreriaConstantes.OPGI_IMPORTE_ORIGEN, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                break;

              case KIO_DEBE:
                if(Cairo.Util.val(cell.getValue()) !== 0) {
                  register.getFields().add2(mTesoreriaConstantes.OPGI_IMPORTE, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                  register.getFields().add2(mTesoreriaConstantes.OPGI_OTRO_TIPO, csEItemOtroTipo.cSEOTROHABER, Cairo.Constants.Types.integer);
                }
                break;

              case KIO_HABER:
                if(Cairo.Util.val(cell.getValue()) !== 0) {
                  register.getFields().add2(mTesoreriaConstantes.OPGI_IMPORTE, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                  register.getFields().add2(mTesoreriaConstantes.OPGI_OTRO_TIPO, csEItemOtroTipo.cSEOTRODEBE, Cairo.Constants.Types.integer);
                }
                break;
            }
          }

          m_iOrden = m_iOrden + 1;
          register.getFields().add2(mTesoreriaConstantes.OPGI_ORDEN, m_iOrden, Cairo.Constants.Types.integer);
          register.getFields().add2(mTesoreriaConstantes.OPGI_TIPO, csEOrdenPagoItemTipo.cSEOPGITOTROS, Cairo.Constants.Types.integer);
          register.getFields().add2(mTesoreriaConstantes.OPG_TMPID, id, Cairo.Constants.Types.id);

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
            register.setFieldId(mTesoreriaConstantes.OPGIB_TMPID);
            register.setTable(mTesoreriaConstantes.ORDENPAGOITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            register.getFields().add2(mTesoreriaConstantes.OPGI_ID, Cairo.Util.val(vDeletes(i)), Cairo.Constants.Types.integer);
            register.getFields().add2(mTesoreriaConstantes.OPG_ID, m_id, Cairo.Constants.Types.id);
            register.getFields().add2(mTesoreriaConstantes.OPG_TMPID, id, Cairo.Constants.Types.id);

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
          register.setFieldId(mTesoreriaConstantes.OPGI_TMPID);
          register.setTable(mTesoreriaConstantes.ORDENPAGOITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KICH_OPGI_ID:
                if(m_copy) {
                  register.getFields().add2(mTesoreriaConstantes.OPGI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.integer);
                }
                else {
                  register.getFields().add2(mTesoreriaConstantes.OPGI_ID, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.integer);
                }
                break;

              case KIE_DESCRIP:
                register.getFields().add2(mTesoreriaConstantes.OPGI_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);
                break;

              case KIE_CUE_ID:
                register.getFields().add2(mTesoreriaConstantes.CUE_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KIE_IMPORTEORIGEN:
                register.getFields().add2(mTesoreriaConstantes.OPGI_IMPORTE_ORIGEN, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                break;

              case KIE_IMPORTE:
                register.getFields().add2(mTesoreriaConstantes.OPGI_IMPORTE, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                break;
            }
          }

          m_iOrden = m_iOrden + 1;
          register.getFields().add2(mTesoreriaConstantes.OPGI_ORDEN, m_iOrden, Cairo.Constants.Types.integer);
          register.getFields().add2(mTesoreriaConstantes.OPGI_TIPO, csEOrdenPagoItemTipo.cSEOPGITEFECTIVO, Cairo.Constants.Types.integer);
          register.getFields().add2(mTesoreriaConstantes.OPG_TMPID, id, Cairo.Constants.Types.id);
          register.getFields().add2(mTesoreriaConstantes.OPGI_OTRO_TIPO, csEItemOtroTipo.cSEOTROHABER, Cairo.Constants.Types.integer);

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
            register.setFieldId(mTesoreriaConstantes.OPGIB_TMPID);
            register.setTable(mTesoreriaConstantes.ORDENPAGOITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            register.getFields().add2(mTesoreriaConstantes.OPGI_ID, Cairo.Util.val(vDeletes(i)), Cairo.Constants.Types.integer);
            register.getFields().add2(mTesoreriaConstantes.OPG_ID, m_id, Cairo.Constants.Types.id);
            register.getFields().add2(mTesoreriaConstantes.OPG_TMPID, id, Cairo.Constants.Types.id);

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
          register.setFieldId(mTesoreriaConstantes.OPGI_TMPID);
          register.setTable(mTesoreriaConstantes.ORDENPAGOITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KICH_OPGI_ID:
                if(m_copy) {
                  register.getFields().add2(mTesoreriaConstantes.OPGI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.integer);
                }
                else {
                  register.getFields().add2(mTesoreriaConstantes.OPGI_ID, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.integer);
                }
                break;

              case KICC_CUE_ID:
                register.getFields().add2(mTesoreriaConstantes.CUE_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KICC_IMPORTEORIGEN:
                register.getFields().add2(mTesoreriaConstantes.OPGI_IMPORTE_ORIGEN, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                break;

              case KICC_IMPORTE:
                register.getFields().add2(mTesoreriaConstantes.OPGI_IMPORTE, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                break;
            }
          }

          m_iOrden = m_iOrden + 1;
          register.getFields().add2(mTesoreriaConstantes.OPGI_ORDEN, m_iOrden, Cairo.Constants.Types.integer);
          register.getFields().add2(mTesoreriaConstantes.OPGI_TIPO, csEOrdenPagoItemTipo.cSEOPGITCTACTE, Cairo.Constants.Types.integer);
          register.getFields().add2(mTesoreriaConstantes.OPG_TMPID, id, Cairo.Constants.Types.id);
          register.getFields().add2(mTesoreriaConstantes.OPGI_OTRO_TIPO, csEItemOtroTipo.cSEOTRODEBE, Cairo.Constants.Types.integer);

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
            register.setFieldId(mTesoreriaConstantes.OPGIB_TMPID);
            register.setTable(mTesoreriaConstantes.ORDENPAGOITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            register.getFields().add2(mTesoreriaConstantes.OPGI_ID, Cairo.Util.val(vDeletes(i)), Cairo.Constants.Types.integer);
            register.getFields().add2(mTesoreriaConstantes.OPG_ID, m_id, Cairo.Constants.Types.id);
            register.getFields().add2(mTesoreriaConstantes.OPG_TMPID, id, Cairo.Constants.Types.id);

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
          m_objApply = new cOrdenPagoAplic();

          // Edit Apply
          //
        }
        else {
          if(m_objApply.Id !== m_id) {
            m_objApply.self.setObjectClient(null);
            m_objApply = new cOrdenPagoAplic();
          }
        }

        // Edit Apply
        //
        m_objApply.self.setObjectClient(self);

        if(!m_objApply.self.show(m_id, m_total, m_nrodoc, m_proveedor)) {
          m_objApply = null;
        }
      };

      ////////////////////////////////////////////////////////////////////////////////
      var pGetTCheques = function() {
        return pGetTChequesProperty().getGrid();
      };

      var pGetCheques = function() {
        return pGetChequesProperty().getGrid();
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

      var pGetTChequesProperty = function() {
        return m_items.getProperties().item(C_CHEQUEST);
      };

      var pGetChequesProperty = function() {
        return m_items.getProperties().item(C_CHEQUES);
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

      var pColAUpdateTCheque = function(property,  lRow,  lCol) { // TODO: Use of ByRef founded Private Function pColAUpdateTCheque(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long) As Boolean
        var _rtn = null;
        var row = null;
        var value = null;

        var w_grid = property.getGrid();

        switch (w_grid.getColumns(lCol).Key) {

          case mPublic.kICHT_IMPORTEORIGEN:
            row = w_grid.getRows(lRow);
            var w_pCell = Dialogs.cell(row, mPublic.kICHT_MON_ID);
            if(w_pCell.getID() !== m_monDefault || w_pCell.getID() === 0) {
              Dialogs.cell(row, mPublic.kICHT_IMPORTE).getValue() === Cairo.Util.val(Dialogs.cell(row, mPublic.kICHT_IMPORTEORIGEN).getValue()) * Cairo.Util.val(pGetCotizacion().getValue());
            }
            else {
              Dialogs.cell(row, mPublic.kICHT_IMPORTEORIGEN).getValue() === 0;
            }

            break;

          case mPublic.kICHT_CUE_ID:
            var monId = null;
            var cueId = null;
            var moneda = null;

            row = w_grid.getRows(lRow);

            cueId = Dialogs.cell(row, mPublic.kICHT_CUE_ID).getID();
            GetMonedaFromCuenta(monId, moneda, cueId);

            var w_pCell = Dialogs.cell(row, mPublic.kICHT_MON_ID);
            w_pCell.setValue(moneda);
            w_pCell.setID(monId);

            if(monId === m_monDefault || monId === 0) {
              Dialogs.cell(row, mPublic.kICHT_IMPORTEORIGEN).getValue() === 0;
            }

            cABMUtil.pCol(property.getGrid().getColumns(), mPublic.kICHT_CHEQUE).getHelpFilter() === mPublic.self.getChequeFileter(cueId);

                    #If PREPROC_SFS Then;
            var abmObj = null;
                    #Else;
            var abmObj = null;
                    #End If;
            abmObj = m_items;
            abmObj.RefreshColumnProperties(property, C_CHEQUET);

            _rtn = true;
            return _rtn;

            break;

          case mPublic.kICHT_CHEQUE:
            row = w_grid.getRows(lRow);
            mPublic.self.setChequeData(row, Dialogs.cell(row, mPublic.kICHT_CHEQUE).getID());

            pShowPagoNeto();
            pShowPagoTotal();

            _rtn = true;
            return _rtn;

            break;

          default:
            _rtn = true;
            return _rtn;
            break;
        }

        _rtn = true;

        return _rtn;
      };

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
            var cueId = null;
            var moneda = null;

            row = w_grid.getRows(lRow);

            cueId = Dialogs.cell(row, KICH_CUE_ID).getID();
            GetMonedaFromCuenta(monId, moneda, cueId);

            var w_pCell = Dialogs.cell(row, KICH_MON_ID);
            w_pCell.setValue(moneda);
            w_pCell.setID(monId);

            if(monId === m_monDefault || monId === 0) {
              Dialogs.cell(row, KICH_IMPORTEORIGEN).getValue() === 0;
            }

            cABMUtil.pCol(property.getGrid().getColumns(), KICH_CHEQUERA).getHelpFilter() === mTesoreriaConstantes.CUE_ID+ "="+ cueId.toString();

                    #If PREPROC_SFS Then;
            var abmObj = null;
                    #Else;
            var abmObj = null;
                    #End If;
            abmObj = m_items;
            abmObj.RefreshColumnProperties(property, C_CHEQUERA);

            _rtn = true;
            return _rtn;

            break;

          case KICH_CHEQUERA:

            row = w_grid.getRows(lRow);
            var w_pCell = Dialogs.cell(row, KICH_CHEQUERA);
            if(w_pCell.getID() !== Cairo.Constants.NO_ID) {
              Dialogs.cell(row, KICH_CHEQUE).getValue() === GetChequeNumber(w_pCell.getID());
            }

            break;

          default:
            _rtn = true;
            return _rtn;
            break;
        }

        pShowPagoNeto();
        pShowPagoTotal();
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

        pShowPagoNeto();
        pShowPagoTotal();
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

        pShowPagoOtro();
        pShowPagoTotal();
        _rtn = true;

        return _rtn;
      };

      var pGetCotizacion = function() {
        return m_dialog.getProperties().item(mTesoreriaConstantes.OPG_COTIZACION);
      };

      var pShowPagoNeto = function() {
        var row = null;
        var total = null;
        var totalOrigen = null;

        var _count = pGetCheques().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetCheques().getRows().item(_i);
          total = total + Cairo.Util.val(Dialogs.cell(row, KICH_IMPORTE).getValue());
        }

        var _count = pGetTCheques().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetTCheques().getRows().item(_i);
          total = total + Cairo.Util.val(Dialogs.cell(row, KICH_IMPORTE).getValue());
        }

        var _count = pGetEfectivo().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetEfectivo().getRows().item(_i);
          total = total + Cairo.Util.val(Dialogs.cell(row, KIE_IMPORTE).getValue());
        }

        pGetPagoNeto().setValue(total);
        m_footer.showValue(pGetPagoNeto());
      };

      var pShowPagoOtro = function() {
        var row = null;
        var total = null;

        var _count = pGetOtros().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetOtros().getRows().item(_i);
          total = total + Cairo.Util.val(Dialogs.cell(row, KIO_DEBE).getValue()) - Cairo.Util.val(Dialogs.cell(row, KIO_HABER).getValue());
        }

        pGetPagoOtros().setValue(total);
        m_footer.showValue(pGetPagoOtros());
      };

      var pShowPagoTotal = function() {
        pGetPagoTotal().setValue(Cairo.Util.val(pGetPagoNeto().getValue()) + Cairo.Util.val(pGetPagoOtros().getValue()));
        m_footer.showValue(pGetPagoTotal());
      };

      var pGetPagoNeto = function() {
        return m_footer.getProperties().item(mTesoreriaConstantes.OPG_NETO);
      };

      var pGetPagoOtros = function() {
        return m_footer.getProperties().item(mTesoreriaConstantes.OPG_OTROS);
      };

      var pGetPagoTotal = function() {
        return m_footer.getProperties().item(mTesoreriaConstantes.OPG_TOTAL);
      };

      var pIsEmptyRowTCheques = function(row,  rowIndex) {
        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case mPublic.kICHT_CUE_ID:
            case mPublic.kICHT_MON_ID:
            case mPublic.kICHT_CLE_ID:
              if(!ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                bRowIsEmpty = false;
                break;
              }

              break;

            case mPublic.kICHT_IMPORTE:
            case mPublic.kICHT_IMPORTEORIGEN:
              if(!ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double)) {
                var bRowIsEmpty = true;
                break;
              }

              break;

            case mPublic.kICHT_DESCRIP:
            case mPublic.kICHT_CHEQUE:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                var bRowIsEmpty = true;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

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
            case KICH_CHEQUERA:
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

      var pValidateRowTCheques = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function pValidateRowTCheques(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var bOrigen = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case mPublic.kICHT_CUE_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                //'Debe indicar una cuenta contable (1)
                MsgInfo(Cairo.Language.getText(2113, "", strRow));
              }

              break;

            case mPublic.kICHT_CHEQUE:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                //'Debe indicar un Cheque (1)
                MsgInfo(Cairo.Language.getText(2197, "", strRow));
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
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
                //'Debe indicar una cuenta contable (1)
                MsgInfo(Cairo.Language.getText(2113, "", strRow));
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
                //'Debe indicar un importe (1)
                MsgInfo(Cairo.Language.getText(1897, "", strRow));
              }

              break;

            case KICH_CHEQUERA:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                //'Debe indicar una chequera (1)
                MsgInfo(Cairo.Language.getText(2193, "", strRow));
              }

              break;

            case KICH_CHEQUE:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                //'Debe indicar una número de cheque (1)
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
          //'Debe indicar un importe para la moneda extranjera (1)
          MsgInfo(Cairo.Language.getText(2118, "", strRow));
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
                //'Debe indicar un importe (1)
                MsgInfo(Cairo.Language.getText(1897, "", strRow));
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
                //'Debe indicar una cuenta contable (1)
                MsgInfo(Cairo.Language.getText(2113, "", strRow));
              }

              if(!Cairo.Database.getData(mTesoreriaConstantes.CUENTA, mTesoreriaConstantes.CUE_ID, cell.getId(), mTesoreriaConstantes.MON_ID, monId)) { return false; }

              break;

            case KIE_IMPORTEORIGEN:
              bOrigen = !ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double);

              break;

            case KIE_IMPORTE:
              if(ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double)) {
                //'Debe indicar un importe (1)
                MsgInfo(Cairo.Language.getText(1897, "", strRow));
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
        var _count = pGetTCheques().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetTCheques().getRows().item(_i);
          Dialogs.cell(row, mPublic.kICHT_CHEQUE).getID() === Cairo.Constants.NO_ID;
        }
        var abmObj = null;
        abmObj = m_items;
        abmObj.ShowValue(pGetChequesProperty(), true);
        abmObj.ShowValue(pGetTChequesProperty(), true);
      };

      var pSetFilterColFactura = function() {

        var abmObj = null;
        abmObj = m_items;

        cABMUtil.pCol(pGetOtros().getColumns(), KIO_FC_ID_RET).getHelpFilter() === "prov.prov_id = "+ pGetProveedor().toString();
        abmObj.RefreshColumnProperties(pGetOtrosProperty(), mTesoreriaConstantes.FC_ID_RET);

      };

      var pGetProveedor = function() {
        return m_dialog.getProperties().item(mTesoreriaConstantes.PROV_ID).getSelectId();
      };

      var pGetFileNamePostFix = function() {
        var rtn = null;

        rtn = m_dialog.getProperties().item(mTesoreriaConstantes.PROV_ID).getValue().Substring(0, 50)+ "-"+ m_dialog.getProperties().item(mTesoreriaConstantes.OPG_NRODOC).getValue();

        return rtn;
      };


      return self;
    };

    Edit.Controller = { getEditor: createObject };

    Edit.Controller.edit = function(id) {

      Cairo.LoadingMessage.show("Ordenes de Pago", "Loading Orden de Pago from Crowsoft Cairo server.");
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

      var C_MODULE = "cOrdenPagoListDoc";

      var C_FECHAINI = "FechaIni";
      var C_FECHAFIN = "FechaFin";

      var C_IMG_TASK = 1;


      var K_FECHAINI = 1;
      var K_FECHAFIN = 2;
      var K_PROV_ID = 4;
      var K_EST_ID = 5;
      var K_CCOS_ID = 6;
      var K_SUC_ID = 7;
      var K_VEN_ID = 8;
      var K_DOC_ID = 9;

      var K_EMP_ID = 100;
      var m_fechaIni = null;
      var m_fechaFin = null;
      var m_provId = "";
      var m_proveedor = "";
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
      var m_menuShowInfoProv = 0;
      var m_menuAddNote = 0;
      var m_menuShowAplic = 0;
      var m_menuShowAsiento = 0;
      var m_menuFirmar = 0;

      var m_objApply;

      var m_apiPath = DB.getAPIVersion();
      var SAVE_ERROR = getText(2245, ""); // Error al grabar los párametros de navegación de Xxxx

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

            case m_menuShowInfoProv:
              D.showInfo(Cairo.Tables.PROVEEDOR, getProvId());

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

        c = m_properties.add(null, C.PROV_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.PROVEEDOR);
        c.setName(getText(1151, "")); // Proveedor
        c.setKey(K_PROV_ID);
        c.setValue(m_proveedor);
        c.setSelectId(val(m_provId));
        c.setSelectIntValue(m_provId);

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

        c = m_dialog.getProperties().add(null, mTesoreriaConstantes.PROV_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.PROVEEDOR);
        // Proveedor
        c.setName(getText(1151, ""));
        c.setKey(K_PROV_ID);
        value = m_proveedor;
        if(m_provId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.PROVEEDOR, Cairo.Util.val(m_provId.Substring(2)), bExists);
          if(!bExists) { m_provId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_provId));
        c.setSelectIntValue(m_provId);

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
        c.setKey(K_VEN_ID);
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
        c.setSelectFilter("'{emp_id=0}doct_id = "+ csEDocumentoTipo.cSEDT_ORDENPAGO.toString()+ "'");


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

        return DB.getData("load[" + m_apiPath + "general/ordenpagolistdoc]", id).then(
          function(response) {


            m_empId = Cairo.Company.getId();
            m_empresa = Cairo.Company.getName();

            if(response.success !== true) { return false; }

            if(response.data.id === NO_ID) {

              m_fechaIniV = "";
              m_fechaIni = Cairo.Dates.today();
              m_fechaFinV = "";
              m_fechaFin = Cairo.Dates.DateNames.getDateByName('h-60');

              m_provId = NO_ID;
              m_proveedor = "";
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

              m_provId = valField(response.data, C.PROV_ID);
              m_estId = valField(response.data, C.EST_ID);
              m_ccosId = valField(response.data, C.CCOS_ID);
              m_sucId = valField(response.data, C.SUC_ID);
              m_docId = valField(response.data, C.DOC_ID);
              m_empId = valField(response.data, C.EMP_ID);

              m_proveedor = valField(response.data, C.PROV_NAME);
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

          case K_PROV_ID:
            var property = m_dialog.getProperties().item(mTesoreriaConstantes.PROV_ID);
            m_proveedor = property.getValue();
            m_provId = property.getSelectIntValue();

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

          case K_VEN_ID:
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
          provId: m_provId,
          estId: m_estId,
          ccosId: m_ccosId,
          sucId: m_sucId,
          docId: m_docId,
          empId: m_empId
        };

        return DB.getData("load[" + m_apiPath + "tesoreria/ordenespago]", null, params);
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.LDP_ID);
        register.setTable(C.LISTA_DOCUMENTO_PARAMETRO);

        var apiPath = DB.getAPIVersion();
        register.setPath(apiPath + "tesoreria/ordenespago");

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

        strError = getText(2245, "");
        //Error al grabar los párametros de navegación de Orden de Pago

        var register = null;
        register = new cRegister();

        var sqlstmt = null;

        sqlstmt = "delete ListaDocumentoParametro  where pre_id = "+ csTesoreriaPrestacion.cSPRETSRLISTORDENPAGO.toString()+ " and us_id = "+ m_us_id+ " and (emp_id is null or emp_id = "+ cUtil.getEmpId().toString()+ ")";

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

            case K_PROV_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 40, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_PROV_ID, Cairo.Constants.Types.integer);
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

            case K_VEN_ID:
              register.getFields().add2(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Cairo.Constants.Types.text);
              register.getFields().add2(Cairo.Constants.LDP_ORDEN, 80, Cairo.Constants.Types.integer);
              register.getFields().add2(Cairo.Constants.LDP_ID, K_VEN_ID, Cairo.Constants.Types.integer);
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
          register.getFields().add2(C.PRE_ID, csTesoreriaPrestacion.cSPRETSRLISTORDENPAGO, Cairo.Constants.Types.id);

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

          // Orden de Pago
          m_title = getText(1922, "");

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
        // Agregar Nota
        m_menuAddNote = m_objList.addMenu(getText(1615, ""));
        // Ver Notas
        m_menuShowMensajes = m_objList.addMenu(getText(1616, ""));
        m_objList.addMenu("-");
        // Ver Asiento Contable
        m_menuShowAsiento = m_objList.addMenu(getText(1692, ""));
      };

      var getProvId = function() {


        var opgId = null;
        var provId = null;

        opgId = m_dialog.getId();
        DB.getData(mTesoreriaConstantes.ORDENPAGO, mTesoreriaConstantes.OPG_ID, opgId, mTesoreriaConstantes.PROV_ID, provId);

        return provId;
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

        var opgId = null;
        opgId = m_dialog.getId();

        if(opgId === NO_ID) { return; }

        var total = null;
        var cotiz = null;
        var nroDoc = null;
        var proveedor = null;

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "select opg_total, opg_nrodoc, opg.prov_id, prov_nombre,opg.suc_id, opg.doc_id, opg.doct_id from OrdenPago opg inner join proveedor prov  on opg.prov_id = prov.prov_id where opg_id = "+ opgId.toString();

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(rs.isEOF()) { return; }

        total = Cairo.Database.valField(rs.getFields(), mTesoreriaConstantes.OPG_TOTAL);
        nroDoc = Cairo.Database.valField(rs.getFields(), mTesoreriaConstantes.OPG_NRODOC);
        proveedor = Cairo.Database.valField(rs.getFields(), mTesoreriaConstantes.PROV_NAME);

        if(!DoCairo.Security.anAccess(csTesoreriaPrestacion.cSPRETSRMODIFYAPLIC, m_docId, csE_DocTypePrestacion.cSEDOCTPREAPLICAR)) { return; }

        if(m_objApply === null) {
          m_objApply = new cOrdenPagoAplic();

          // Edit Apply
          //
        }
        else {
          if(m_objApply.self.getId() !== opgId) {
            m_objApply = new cOrdenPagoAplic();
          }
        }

        if(!m_objApply.self.show(opgId, total, nroDoc, proveedor)) {
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