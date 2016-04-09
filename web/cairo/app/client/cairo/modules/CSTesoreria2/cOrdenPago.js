(function() {
  "use strict";

  Cairo.module("OrdenPago.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {
    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var TITLE = getText(2202, ""); // Odenes de Pago
      var SAVE_ERROR_MESSAGE = getText(1910, ""); // Error al grabar la Orden de Pago

      var P = Cairo.Promises;
      var NO_ID = Cairo.Constants.NO_ID;
      var DB = Cairo.Database;
      var Dialogs = Cairo.Dialogs;
      var Grids = Cairo.Dialogs.Grids;
      var C = Cairo.General.Constants;
      var CT = Cairo.Tesoreria.Constants;
      var CS = Cairo.Security.Actions.Tesoreria;
      var Types = Cairo.Constants.Types;
      var valField = DB.valField;
      var getValue = DB.getValue;
      var valEmpty = Cairo.Util.valEmpty;
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

      var C_MODULE = "cOrdenPago";

      var C_CHEQUES = "Cheques";
      var C_CHEQUEST = "Cheque de Tercero";
      var C_EFECTIVO = "Efectivo";
      var C_OTROS = "Otros";
      var C_CTA_CTE = "Cuenta Corriente";

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
      var K_CHEQUES = 15;
      var K_CHEQUEST = 16;
      var K_EST_ID = 17;
      var K_CCOS_ID = 18;
      var K_SUC_ID = 19;
      var K_OTROS = 24;
      var K_COTIZACION = 25;
      var K_LGJ_ID = 27;
      var K_EFECTIVO = 28;
      var K_CTA_CTE = 30;

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
      var KI_FCD_ID = 16;

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

      var m_id = 0;
      var m_numero = 0;
      var m_estado = "";
      var m_estId = 0;
      var m_nrodoc = "";
      var m_descrip = "";
      var m_fecha = null;
      var m_neto = 0;
      var m_otros = 0;
      var m_total = 0;
      var m_lgjId = 0;
      var m_legajo = "";

      var m_cotizacion = 0;
      var m_ccosId = 0;
      var m_centroCosto = "";
      var m_sucId = 0;
      var m_sucursal = "";
      var m_provId = 0;
      var m_proveedor = "";
      var m_docId = 0;
      var m_documento = "";
      var m_doctId = 0;
      var m_creado = null;
      var m_modificado = null;
      var m_modifico = 0;
      var m_firmado;

      // Para ver documentos auxiliares
      //
      var m_as_id = 0;

      var m_editing;

      var m_footer;
      var m_footerProps;
      var m_items;
      var m_itemsProps;
      var m_dialog;
      var m_properties;
      var m_listController = null;

      var m_lastProvId = 0;
      var m_lastProvName = "";

      var m_lastDocId = 0;
      var m_lastDocName = "";

      var m_lastDoctId = 0;

      var m_isNew;

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

      self.refresh = function() {
        load(m_id);
        refreshProperties();
      };

      self.terminateWizard = function(id) {
        m_id = id;
        self.terminate();
      };

      self.showOrdenPago = function(provId,  vFcIds) { // TODO: Use of ByRef founded Public Sub ShowOrdenPago(ByVal ProvId As Long, ByRef vFcIds() As Long)
        try {

          m_provId = provId;
          Cairo.Database.getData(CT.PROVEEDOR, C.PROV_ID, provId, C.PROV_NAME, m_proveedor);

          var i = null;
          G.redim(m_fcIds, vFcIds.Length + 1);
          for(i = 1; i <= vFcIds.Length + 1; i++) {
            m_fcIds[i] = vFcIds(i - 1);
          }

          if(!initMembers()) {
            return;
          }

          showStartWizard();

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "ShowOrdenPago", C_MODULE, "");
        }
      };

      var initMembers = function() {
        self.setDialog(new cABMGeneric());
        setCIEditGenericDoc_Footer(new cABMGeneric());
        setCIEditGenericDoc_Items(new cABMGeneric());

        if(!DoCairo.Security.anAccess(csTesoreriaPrestacion.cSPRETSRNEWORDENPAGO, NO_ID, csE_DocTypePrestacion.cSEDOCTPRENEW)) {
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

        USE FOR PROVEEDOR OR CLIENTE OR setDocNumber

        D.setDocNumberForProveedor(m_lastProvId, m_lastDocId, m_dialog).then(
          function(enabled) {
            m_taPropuesto = enabled;
            setEnabled();
          }
        );
      };

      self.copy = function() {

        if(!DoCairo.Security.anAccessEx(csTesoreriaPrestacion.cSPRETSRNEWORDENPAGO, m_docId, csE_DocTypePrestacion.cSEDOCTPRENEW, true)) { return false; }

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, NO_ID);
        m_copy = true;
        m_docEditable = true;
        m_docEditMsg = "";

        // Obtengo el numero para este comprobante
        //
        GetDocNumber(m_lastDocId, m_dialog, m_taPropuesto, CT.OPG_NRODOC);
        setEnabled();

        // Limpio los ids de cheques ya que no puedo reutilizar
        // ni cheques propios ni de tercero
        pClearCheqId();

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

          m_lastProvId = NO_ID; can be lasCLiId or nothing

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
            return D.setDocNumberForProveedor(m_lastProvId, m_lastDocId, m_dialog)

          }).then(function(enabled) {

            m_taPropuesto = enabled;
            setColorBackground();
            return true;

          });

        return p;
      };

      self.editNew = function() {
        var mouse = null;
        mouse = new cMouseWait();
        m_listController.updateEditorKey(self, NO_ID);

        return load(NO_ID).then(
          function(ignored) {
            return refreshCollection();
          }
        );

        if(!m_docEditable) {
          if(LenB(m_docEditMsg)) {
            MsgWarning(m_docEditMsg);
          }
        }

        if(m_properties.item(CT.DOC_ID).getSelectId() === NO_ID) {
            return M.showInfoWithFalse(Cairo.Language.getText(1562, "")); // Debe indicar un documento
        }

        // Obtengo el numero para este comprobante
        //
        GetDocNumber(m_lastDocId, m_dialog, m_taPropuesto, CT.OPG_NRODOC);
      };

      self.getApplication = function() {
        return Cairo.Application.getName();
      };

      self.editDocumentsEnabled = function() {
        return m_id !== NO_ID;
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

          if(m_id === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(CT.ORDENPAGO);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "cIABMClient_ShowDocDigital", C_MODULE, "");
        }

        return _rtn;
      };

      self.messageEx = function(messageId,  info) {
        var p = null;

        switch (messageId) {
          case Dialogs.Message.MSG_DOC_FIRST:
          case Dialogs.Message.MSG_DOC_PREVIOUS:
          case Dialogs.Message.MSG_DOC_NEXT:
          case Dialogs.Message.MSG_DOC_LAST:
            p = move(messageId);

            break;

          case Dialogs.Message.MSG_DOC_SIGNATURE:
            p = pFirmar();

            break;

          case Dialogs.Message.MSG_GRID_ROW_DELETED:
            p = true;
            switch (info) {
              case K_CHEQUES:
              case K_CHEQUEST:
              case K_EFECTIVO:
                showPagoNeto();
                break;

              case K_OTROS:
                showPagoOtro();
                break;
            }
            showPagoTotal();

            break;

          case Dialogs.Message.MSG_DOC_EDIT_STATE:

            D.showEditStatus(m_docEditMsg, TITLE);
            break;

          case Dialogs.Message.MSG_DOC_APPLY:
            showApply();

            break;

          case Dialogs.Message.MSG_DOC_DELETE:

            p = self.deleteDocument(m_id).success(function() {
              return move(Dialogs.Message.MSG_DOC_NEXT);
            });
            break;

          case Dialogs.Message.MSG_DOC_INVALIDATE:
            DocAnular(m_id, m_estId, m_estado, csTesoreriaPrestacion.cSPRETSRANULARORDENPAGO, csTesoreriaPrestacion.cSPRETSRDESANULARORDENPAGO, m_dialog, m_docEditable, m_docEditMsg, "sp_DocOrdenPagoAnular", "sp_DocOrdenPagoEditableGet");
            setEnabled();

            break;

          case Dialogs.Message.MSG_DOC_INVALIDATE:

            p = D.docInvalidate(m_doctId, m_id, m_dialog).then(function(result) {
              if(result.success === true) {
                m_estId = result.estId;
                m_estado = result.estado;
                m_docEditable = result.editable;
                m_docEditMsg = result.message;
                setEnabled();
              }
            });
            break;

          case Dialogs.Message.MSG_DOC_REFRESH:

            p = load(m_id).then(function(success) {
              if(success === true) {
                refreshProperties();
              }
            });
            break;

          case Dialogs.Message.MSG_DOC_NEW_WITH_WIZARD:
            p = true;

            break;

          case Dialogs.Message.MSG_DOC_EX_GET_ITEMS:

            p = P.resolvedPromise(m_items);
            break;

          case Dialogs.Message.MSG_DOC_EX_GET_FOOTERS:

            p = P.resolvedPromise(m_footer);
            break;

          case Dialogs.Message.MSG_DOC_SEARCH                    :

            D.search(D.Types.ORDEN_PAGO, self, Cairo.bool(info));
            break;

          case Dialogs.Message.MSG_DOC_DOC_AUX:

            if(m_id) {

              ShowDocAux(m_as_id, "CSContabilidad2.cAsiento", "CSABMInterface2.cABMGeneric");
            }
            else {
              return M.showInfoWithFalse(Cairo.Language.getText(1620, ""));
              //Debe editar un comprobante guardado para poder ver los documentos auxiliares
            }

            break;

          case Dialogs.Message.MSG_DOC_DOC_EDIT:

            if(m_id) {

              if(m_docEditable) {

                        return M.showInfoWithFalse(Cairo.Language.getText(1555, "")); // Este documento puede editarse normalmente
              }
              else {

                if(DocCanSave(m_dialog, CT.OPG_FECHA)) {

                  var editDoc = null;
                  editDoc = new cEditDocEx();

                  editDoc.setObjectClient(self);
                  editDoc.edit(m_id, m_doctId, CT.ORDENPAGO, CT.OPG_ID, CT.ORDENPAGOITEM, CT.OPGI_ID, csTesoreriaPrestacion.cSPRETSRNEWORDENPAGO, csTesoreriaPrestacion.cSPRETSREDITORDENPAGO, NO_ID, m_provId, true);
                }

              }

            }
            else {
              return M.showInfoWithFalse(Cairo.Language.getText(1556, ""));
              //Esta opción solo sirve para modificar documentos guardados y aplicados
            }

            break;

          case Dialogs.Message.MSG_DOC_HISTORY:

            if(m_id !== NO_ID) {
              p = Cairo.History.show(Cairo.Tables.ORDENES_DE_PAGO, m_id, m_documento + " " + m_nrodoc);
            }
            else {
              p = M.showInfo(getText(1552, "")); // El documento aun no ha sido guardado
            }
            break;

          case Dialogs.Message.MSG_EXPORT_GET_EMAIL:

            p = GetEmailFromProveedor(getProveedor());

            break;

          case Dialogs.Message.MSG_EXPORT_GET_FILE_NAME_POSTFIX:

            p = getFileNamePostFix();

            break;
        }

        return p || P.resolvedPromise();
      };

      self.discardChanges = function() {
        Cairo.raiseError("OrdenPago", "DiscardChanges was called");
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
                  m_lastDoctId = valField(response.data, C.DOCT_ID);
                }
                return response.success;

              })
                .whenSuccess(function() {

                  var p = null;

                  // when the document property is changed and the dialog was
                  // editing a saved invoice we need to move to a new invoice
                  //
                  if(m_id !== NO_ID && m_docId !== m_lastDocId) {
                    p = self.edit(D.Constants.DOC_CHANGED);
                  }

                  return p || P.resolvedPromise(true);

                })
                .whenSuccess(function() {

                  return D.setDocNumber(m_lastDocId, m_dialog, CT.OPG_NRODOC)
                    .then(function(enabled) {

                      m_taPropuesto = enabled;
                    });
                });
            }

            p = p || P.resolvedPromise();

            p.then(function() {
              setEnabled();
            });

            break;

          case K_PROV_ID:

            setFilterColFactura();

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
        if(!DocCanSave(m_dialog, CT.OPG_FECHA)) {
          _rtn = false;
          return _rtn;
        }

        // OJO -tsr
        if(getCheques().getRows().count() === 0 && getTCheques().getRows().count() === 0 && getEfectivo().getRows().count() === 0 && getOtros().getRows().count() === 0) {

            MsgWarning(Cairo.Language.getText(3903, "")); // El documento debe contener al menos un item
          _rtn = false;
          return _rtn;
        }

        var mouse = null;
        mouse = new cMouseWait();

        DoEvents:(DoEvents: DoEvents: DoEvents);

        var register = new Cairo.Database.Register();
        register.setFieldId(CT.OPG_TMPID);
        register.setTable(CT.ORDENPAGOTMP);

        register.setId(Cairo.Constants.NEW_ID);

        register.setPath(m_apiPath + "general/ordenpago");

        if(m_copy) {
          register.getFields().add2(CT.OPG_ID, Cairo.Constants.NEW_ID, Types.long);
        }
        else {
          register.getFields().add2(CT.OPG_ID, m_id, Types.long);
        }

        if(register.getId() === Cairo.Constants.NEW_ID) {
          m_estId = CSGeneralEx2.csEEstado.cSEEST_PENDIENTE;
        }

        var _count = m_properties.size();
        for(var _i = 0; _i < _count; _i++) {
          var property = m_properties.item(_i);
          switch (property.getKey()) {
            case K_NUMERO:
              register.getFields().add2(CT.OPG_NUMERO, property.getValue(), Types.long);
              break;

            case K_NRODOC:
              register.getFields().add2(CT.OPG_NRODOC, property.getValue(), Types.text);
              break;

            case K_DESCRIP:
              register.getFields().add2(CT.OPG_DESCRIP, property.getValue(), Types.text);
              break;

            case K_FECHA:
              register.getFields().add2(CT.OPG_FECHA, property.getValue(), Types.date);
              break;

            case K_PROV_ID:
              register.getFields().add2(C.PROV_ID, property.getSelectId(), Types.id);
              break;

            case K_CCOS_ID:
              register.getFields().add2(C.CCOS_ID, property.getSelectId(), Types.id);
              break;

            case K_SUC_ID:
              register.getFields().add2(CT.SUC_ID, property.getSelectId(), Types.id);
              break;

            case K_DOC_ID:
              register.getFields().add2(CT.DOC_ID, property.getSelectId(), Types.id);
              break;

            case K_COTIZACION:
              register.getFields().add2(CT.OPG_COTIZACION, property.getValue(), Types.double);
              break;

            case K_LGJ_ID:
              register.getFields().add2(CT.LGJ_ID, property.getSelectId(), Types.id);
              break;
          }
        }

        var _count = m_footer.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {
          property = m_footer.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NETO:
              register.getFields().add2(CT.OPG_NETO, Cairo.Util.val(property.getValue()), Types.currency);
              break;

            case K_OTROS:
              register.getFields().add2(CT.OPG_OTROS, Cairo.Util.val(property.getValue()), Types.currency);
              break;

            case K_TOTAL:
              register.getFields().add2(CT.OPG_TOTAL, Cairo.Util.val(property.getValue()), Types.currency);
              break;
          }
        }

        register.getFields().add2(CT.OPG_GRABAR_ASIENTO, 1, Types.boolean);
        register.getFields().add2(Cairo.Constants.EST_ID, m_estId, Types.id);

        register.getFields().setHaveLastUpdate(true);
        register.getFields().setHaveWhoModify(true);

        register.prepareTransaction();
        if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return _rtn; }

        m_iOrden = 0;

        if(!saveCheques(register.getId())) { return _rtn; }
        if(!saveTCheques(register.getId())) { return _rtn; }
        if(!saveEfectivo(register.getId())) { return _rtn; }
        if(!saveOtros(register.getId())) { return _rtn; }
        if(!saveCtaCte(register.getId())) { return _rtn; }

        var sqlstmt = null;
        var rs = null;
        sqlstmt = "sp_DocOrdenPagoSave "+ register.getId().toString();

        if(!Cairo.Database.openRs(sqlstmt, rs, , , , "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return _rtn; }

        if(rs.isEOF()) { return _rtn; }

        var id = null;
        if(!GetDocIDFromRecordset(rs, id)) { return _rtn; }

        m_copy = false;

        _rtn = load(id);

        return _rtn;
      };

      var updateList = function() {
        try {
          if(m_id === NO_ID) { return; }
          if(m_listController === null) { return; }

          if(m_isNew) {
            m_listController.addItem(m_id);
          }
          else {
            m_listController.refreshItem(m_id);
          }
        }
        catch(ignore) {
          Cairo.logError("Can't update list", ignore);
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
        return Cairo.Language.getText(1922, ""); // Orden de pago
      };

      self.validate = function() {

        for(var _i = 0, _count = m_properties.size(); _i < _count; _i++) {

          var property = m_properties.item(_i);

          switch (property.getKey()) {
            case K_FECHA:
              if(valEmpty(property.getValue(), Types.date)) {
                return M.showInfoWithFalse(Cairo.Language.getText(1558, "")); // Debe indicar una fecha
              }
              break;

            case K_PROV_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                return M.showInfoWithFalse(Cairo.Language.getText(1860, "")); // Debe indicar un Proveedor
              }
              break;

            case K_DOC_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                return M.showInfoWithFalse(Cairo.Language.getText(1562, "")); // Debe indicar un documento
              }
              break;

            case K_SUC_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                return M.showInfoWithFalse(Cairo.Language.getText(1560, "")); // Debe indicar una sucursal
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      self.isEmptyRow = function(key,  row,  rowIndex) {
        var isEmpty = true;
        
        try {

          switch (key) {
            case K_CHEQUES:
              isEmpty = isEmptyRowCheques(row, rowIndex);
              break;

            case K_CHEQUEST:
              isEmpty = isEmptyRowTCheques(row, rowIndex);
              break;

            case K_OTROS:
              isEmpty = isEmptyRowOtros(row, rowIndex);
              break;

            case K_EFECTIVO:
              isEmpty = isEmptyRowEfectivo(row, rowIndex);
              break;

            case K_CTA_CTE:
              isEmpty = isEmptyRowCtaCte(row, rowIndex);
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "isEmptyRow", C_MODULE, "");
        }

        return P.resolvedPromise(isEmpty);
      };

      //-------------------------------------------------------------------------------------
      // Documento
      self.docId = function() {
        return m_docId;
      };

      self.doctId = function() {
        return m_doctId;
      };

      self.id = function() {
        return m_id;
      };

      self.loadForPrint = function(id) {
        var loadData = function(response) {
          try {

            m_id = id;
            m_docId = valField(response.data, C.DOC_ID);
            m_doctId = valField(response.data, C.DOCT_ID);

            return true;

          }
          catch(ex) {
            Cairo.manageErrorEx(ex.message, ex, "loadForPrint", C_MODULE, "");
          }

          return false;
        };

        var p = DB.getData("load[" + m_apiPath + "tesoreria/ordenpago/info]", id)
          .whenSuccessWithResult(loadData, false);

        return p;
      };

      //-------------------------------------------------------------------------------------
      self.getDialog = function() {
        return m_dialog;
      };

      self.list = function() {
        return Cairo.Security.hasPermissionTo(csTesoreriaPrestacion.cSPRETSRLISTORDENPAGO);
      };

      self.setDialog = function(dialog) {
        m_dialog = dialog;
        m_properties = m_dialog.getProperties();
        m_dialog.setIsDocument(true);
      };

      self.isEditing = function() {
        return m_editing;
      };

      self.edit = function(id, inModalWindow) {

        var p = null;

        try {

          if(!Cairo.Security.docHasPermissionTo(
            CS.LIST_ORDEN_PAGO,
            D.getDocIdFromDialog(m_dialog),
            Cairo.Security.ActionTypes.list)) {
            return P.resolvedPromise(false);
          }

          // Id = DOC_CHANGED when the document is changed
          //                  when editing a document
          //
          m_isNew = (id === NO_ID || id === D.Constants.DOC_CHANGED);


          var loadAllItems = function() {
            if(m_itemsProps.count() > 0) {
              loadItems(getItems());
            }
            return P.resolvedPromise(true);
          };

          var afterLoad = function() {
            if(m_properties.count() === 0) {
              if(!loadCollection()) { return false; }
            }
            else {
              refreshProperties();
            }

            m_dialog.setNewPropertyKeyFocus("");

            // only show the wizard if the new action is not
            // originated by a change on document
            //
            if(id !== D.Constants.DOC_CHANGED && m_isNew) {

              showStartWizard(false);
            }
            else {

              m_dialog.setNewPropertyKeyFocus(C.CLI_ID);
            }

            m_editing = true;
            m_copy = false;

            Cairo.navigate(self.getPath());

            return true;
          };

          p = load(id).whenSuccess(loadAllItems, false).whenSuccess(afterLoad, false);
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "edit", C_MODULE, "");
        }

        return p || P.resolvedPromise(false);
      };

      self.setListController = function(controller) {
        m_listController = controller;
      };

      self.columnAfterUpdate = function(key,  lRow,  lCol) {
        try {

          switch (key) {
            case K_CHEQUES:
              colAUpdateCheque(getChequesProperty(), lRow, lCol);
              break;

            case K_CHEQUEST:
              colAUpdateTCheque(getTChequesProperty(), lRow, lCol);
              break;

            case K_OTROS:
              colAUpdateOtro(getOtrosProperty(), lRow, lCol);
              break;

            case K_EFECTIVO:
              colAUpdateEfectivo(getEfectivoProperty(), lRow, lCol);
              break;

            case K_CTA_CTE:
              colAUpdateCtaCte(getCtaCteProperty(), lRow, lCol);
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnAfterUpdate", C_MODULE, "");
        }

        return P.resolvedPromise(true);
      };

      self.columnAfterEdit = function(key,  lRow,  lCol,  newValue,  newValueID) {
        return P.resolvedPromise(true);
      };

      self.columnBeforeEdit = function(key,  lRow,  lCol,  iKeyAscii) {
        return P.resolvedPromise(true);
      };

      self.columnButtonClick = function(key,  lRow,  lCol,  iKeyAscii) {
        return P.resolvedPromise(false);
      };

      self.columnClick = function(key,  lRow,  lCol) {

      };

      self.gridDblClick = function(key, lRow, lCol) {
        return Cairo.Promises.resolvedPromise(false);
      };

      self.deleteRow = function(key,  row,  lRow) {
        var id = null;

        switch (key) {
          case K_CHEQUES:
            id = Cairo.Util.val(Dialogs.cell(row, KICH_OPGI_ID).getValue());
            if(id !== NO_ID) { m_chequesDeleted = m_chequesDeleted+ id.toString()+ ","; }
            break;

          case K_CHEQUEST:
            id = Cairo.Util.val(Dialogs.cell(row, KICH_OPGI_ID).getValue());
            if(id !== NO_ID) { m_tChequesDeleted = m_tChequesDeleted+ id.toString()+ ","; }
            break;

          case K_EFECTIVO:
            id = Cairo.Util.val(Dialogs.cell(row, KIE_OPGI_ID).getValue());
            if(id !== NO_ID) { m_efectivoDeleted = m_efectivoDeleted+ id.toString()+ ","; }
            break;

          case K_OTROS:
            id = Cairo.Util.val(Dialogs.cell(row, KIO_OPGI_ID).getValue());
            if(id !== NO_ID) { m_otrosDeleted = m_otrosDeleted+ id.toString()+ ","; }
            break;

          case K_CTA_CTE:
            id = Cairo.Util.val(Dialogs.cell(row, KIO_OPGI_ID).getValue());
            if(id !== NO_ID) { m_ctaCteDeleted = m_ctaCteDeleted+ id.toString()+ ","; }
            break;
        }

        return true;
      };

      self.newRow = function(key, rows) {
        return P.resolvedPromise(true);
      };

      var validateRow = function(key,  row,  rowIndex) {
        var p = null;

        try {

          switch (key) {

            case K_CHEQUES:
              p = validateRowCheques(row, rowIndex);
              break;

            case K_CHEQUEST:
              p = validateRowTCheques(row, rowIndex);
              break;

            case K_OTROS:
              p = validateRowOtros(row, rowIndex);
              break;

            case K_EFECTIVO:
              p = validateRowEfectivo(row, rowIndex);
              break;

            case K_CTA_CTE:
              p = validateRowCtaCte(row, rowIndex);
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "validateRow", C_MODULE, "");
        }

        return p || P.resolvedPromise(false);
      };

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
        tab.setName(Cairo.Language.getText(1566, "")); // Adicionales

        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, CT.DOC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSDocumento2.CSDocumento);
        elem.setName(Cairo.Language.getText(1567, "")); // Documento
        elem.setKey(K_DOC_ID);
        elem.setSelectId(m_docId);
        elem.setValue(m_documento);
        elem.setSelectFilter("'doct_id = "+ csEDocumentoTipo.cSEDT_ORDENPAGO.toString()+ "'");

        var elem = properties.add(null, Cairo.Constants.NUMBER_ID);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.integer);
        elem.setName(Cairo.Language.getText(1065, "")); // Número
        elem.setKey(K_NUMERO);
        elem.setValue(m_numero);
        elem.setEnabled(false);

        var elem = properties.add(null, Cairo.Constants.STATUS_ID);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Language.getText(1568, "")); // Estado
        elem.setKey(K_EST_ID);
        elem.setValue(m_estado);
        elem.setEnabled(false);

        var elem = properties.add(null, CT.OPG_FECHA);
        elem.setType(Dialogs.PropertyType.date);
        elem.setName(Cairo.Language.getText(1569, "")); // Fecha
        elem.setKey(K_FECHA);
        elem.setValue(m_fecha);

        var elem = properties.add(null, C.PROV_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROVEEDOR);
        elem.setName(Cairo.Language.getText(1151, "")); // Proveedor
        elem.setKey(K_PROV_ID);
        elem.setSelectId(m_provId);
        elem.setValue(m_proveedor);

        var elem = properties.add(null, CT.OPG_NRODOC);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Language.getText(1065, "")); // Número
        elem.setSize(50);
        elem.setKey(K_NRODOC);
        elem.setValue(m_nrodoc);
        elem.setTextMask(m_taMascara);
        elem.setTextAlign(Dialogs.TextAlign.right);

        var elem = properties.add(null, CT.LGJ_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.LEGAJOS);
        elem.setName(Cairo.Language.getText(1575, "")); // Legajo
        elem.setKey(K_LGJ_ID);
        elem.setSelectId(m_lgjId);
        elem.setValue(m_legajo);
        elem.setTabIndex(1);

        var elem = properties.add(null, CT.OPG_COTIZACION);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(Cairo.Language.getText(1635, "")); // Cotización
        elem.setFormat(Cairo.Settings.getCurrencyRateDecimalsFormat());
        elem.setKey(K_COTIZACION);
        elem.setValue(m_cotizacion);

        var elem = properties.add(null, C.CCOS_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTROS_DE_COSTO);
        elem.setName(Cairo.Language.getText(1057, "")); // Centro de Costo
        elem.setKey(K_CCOS_ID);
        elem.setSelectId(m_ccosId);
        elem.setValue(m_centroCosto);

        var elem = properties.add(null, CT.SUC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.SUCURSAL);
        elem.setName(Cairo.Language.getText(1281, "")); // Sucursal
        elem.setKey(K_SUC_ID);
        elem.setSelectId(m_sucId);
        elem.setValue(m_sucursal);

        var elem = properties.add(null, CT.OPG_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setName(Cairo.Language.getText(1211, "")); // Observ.
        elem.setSize(5000);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);

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
        tab.setName(Cairo.Language.getText(2099, "")); // Cheques

        var tab = w_tabs.add(null);
        tab.setIndex(c_TabEfectivo);
        tab.setName(Cairo.Language.getText(2100, "")); // Efectivo

        var tab = w_tabs.add(null);
        tab.setIndex(c_TabChequeT);
        tab.setName(Cairo.Language.getText(2195, "")); // Cheque de Tercero

        var tab = w_tabs.add(null);
        tab.setIndex(c_TabOtros);
        tab.setName(Cairo.Language.getText(1070, "")); // Otros

        var tab = w_tabs.add(null);
        tab.setIndex(c_TabCtaCte);
        tab.setName(Cairo.Language.getText(2102, "")); // Cta Corriente

        abmGen = m_items;
        abmGen.ResetLayoutMembers;

        var properties = m_items.getProperties();

        properties.clear();

        ///////////////////////////////////////////////////////////////////
        // CHEQUES
        c = properties.add(null, C_CHEQUES);
        c.setType(Dialogs.PropertyType.grid);
        c.hideLabel();
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
        c.hideLabel();
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
        c.hideLabel();
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
        c.hideLabel();
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
        c = properties.add(null, C_CTA_CTE);
        c.setType(Dialogs.PropertyType.grid);
        c.hideLabel();
        setGridCtaCte(c);
        if(!pLoadCtaCte(c)) { return false; }
        c.setName(C_CTA_CTE);
        c.setKey(K_CTA_CTE);
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

        var elem = properties.add(null, CT.OPG_NETO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(Cairo.Language.getText(1581, "")); // Neto
        elem.setKey(K_NETO);
        elem.setValue(m_neto);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        var elem = properties.add(null, CT.OPG_OTROS);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(Cairo.Language.getText(1070, "")); // Otros
        elem.setKey(K_OTROS);
        elem.setValue(m_otros);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        var elem = properties.add(null, CT.OPG_TOTAL);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setName(Cairo.Language.getText(1584, "")); // Total
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_TOTAL);
        elem.setValue(m_total);
        elem.setEnabled(false);

        setEnabled();

        if(!m_footer.show(self)) { return false; }

        // Se hace al final para evitar que se muestre el
        // form antes de tiempo
        //
        setFilterColFactura();

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(CT.DOC_ID);
        elem.setSelectId(m_docId);
        elem.setValue(m_documento);

        var elem = properties.item(Cairo.Constants.NUMBER_ID);
        elem.setValue(m_numero);

        var elem = properties.item(Cairo.Constants.STATUS_ID);
        elem.setValue(m_estado);

        var elem = properties.item(CT.OPG_FECHA);
        elem.setValue(m_fecha);

        var elem = properties.item(C.PROV_ID);
        elem.setSelectId(m_provId);
        elem.setValue(m_proveedor);

        var elem = properties.item(CT.OPG_NRODOC);
        elem.setValue(m_nrodoc);

        var elem = properties.item(CT.LGJ_ID);
        elem.setSelectId(m_lgjId);
        elem.setValue(m_legajo);

        var elem = properties.item(CT.OPG_COTIZACION);
        elem.setValue(m_cotizacion);

        var elem = properties.item(C.CCOS_ID);
        elem.setSelectId(m_ccosId);
        elem.setValue(m_centroCosto);

        var elem = properties.item(CT.SUC_ID);
        elem.setSelectId(m_sucId);
        elem.setValue(m_sucursal);

        var elem = properties.item(CT.OPG_DESCRIP);
        elem.setValue(m_descrip);

        var elem = properties.item(CT.OPG_NETO);
        elem.setValue(m_neto);

        var elem = properties.item(CT.OPG_OTROS);
        elem.setValue(m_otros);

        var elem = properties.item(CT.OPG_TOTAL);
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
        elem.setName(Cairo.Language.getText(1267, "")); // Cuenta
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setKey(KIO_CUE_ID);
        elem.setSelectFilter("(emp_id = "+ cUtil.getEmpId().toString()+ " or emp_id is null)");

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1904, "")); // Debe
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIO_DEBE);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1905, "")); // Haber
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIO_HABER);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1901, "")); // Origen
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIO_IMPORTEORIGEN);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setKey(KIO_DESCRIP);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1403, "")); // Retención
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.RETENCION);
        elem.setKey(KIO_RET_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(2103, "")); // C. Retención
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIO_NRORETENCION);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(2104, "")); // % Retención
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
        elem.setKey(KIO_PORCRETENCION);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1634, "")); // Vto.
        elem.setType(Dialogs.PropertyType.date);
        elem.setKey(KIO_FECHARETENCION);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1057, "")); // Centro de Costo
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTROS_DE_COSTO);
        elem.setKey(KIO_CCOS_ID);

        var elem = w_columns.add(null, CT.FC_ID_RET);
        elem.setName(Cairo.Language.getText(1866, "")); //  Factura
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(csFacturaCompra);
        elem.setKey(KIO_FC_ID_RET);

        var f = null;
        var fv = null;

        for(var _i = 0, count = m_data.otros.length; _i < count; _i += 1) {

          f = property.getGrid().getRows().add(null, rs(CT.OPGI_ID).Value);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], CT.OPGI_ID));
          fv.setKey(KIO_OPGI_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], C.CUE_NAME));
          fv.setId(Cairo.Database.valField(m_data.otros[_i], C.CUE_ID));
          fv.setKey(KIO_CUE_ID);

          fv = f.add(null);
          if(Cairo.Database.valField(m_data.otros[_i], CT.OPGI_OTRO_TIPO) === CT.OtroTipo.OTRO_HABER) {
            fv.setValue(Cairo.Database.valField(m_data.otros[_i], CT.OPGI_IMPORTE));
          }
          else {
            fv.setValue(0);
          }
          fv.setKey(KIO_DEBE);

          fv = f.add(null);
          if(Cairo.Database.valField(m_data.otros[_i], CT.OPGI_OTRO_TIPO) === CT.OtroTipo.OTRO_DEBE) {
            fv.setValue(Cairo.Database.valField(m_data.otros[_i], CT.OPGI_IMPORTE));
          }
          else {
            fv.setValue(0);
          }
          fv.setKey(KIO_HABER);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], CT.OPGI_IMPORTE_ORIGEN));
          fv.setKey(KIO_IMPORTEORIGEN);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], CT.OPGI_DESCRIP));
          fv.setKey(KIO_DESCRIP);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], CT.RET_NAME));
          fv.setId(Cairo.Database.valField(m_data.otros[_i], CT.RET_ID));
          fv.setKey(KIO_RET_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], CT.OPGI_NRO_RETENCION));
          fv.setKey(KIO_NRORETENCION);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], CT.OPGI_PORC_RETENCION));
          fv.setKey(KIO_PORCRETENCION);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], CT.OPGI_FECHA_RETENCION));
          fv.setKey(KIO_FECHARETENCION);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], C.CCOS_NAME));
          fv.setId(Cairo.Database.valField(m_data.otros[_i], C.CCOS_ID));
          fv.setKey(KIO_CCOS_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.otros[_i], CT.FC_NRODOC));
          fv.setId(Cairo.Database.valField(m_data.otros[_i], CT.FC_ID_RET));
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
        elem.setName(Cairo.Language.getText(1267, "")); // Cuenta
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);

        //.HelpFilter = cscCuecId & "=" & csECuecDocEnCartera
        elem.setSelectFilter(mPublic.self.getHelpFilterChequesT());

        elem.setKey(mPublic.kICHT_CUE_ID);

        var elem = w_columns.add(null, C_CHEQUET);
        elem.setName(Cairo.Language.getText(2059, "")); // Nr. Cheque
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(csETablesTesoreria.cSCHEQUE);
        elem.setSelectFilter("1 = 2");
        elem.setSubType(Dialogs.PropertySubType.integer);
        elem.setKey(mPublic.kICHT_CHEQUE);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1150, "")); // Cliente
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(mPublic.kICHT_CLI_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1122, "")); // Banco
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(mPublic.kICHT_BCO_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(2063, "")); // Mon
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setKey(mPublic.kICHT_MON_ID);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1901, "")); // Origen
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(mPublic.kICHT_IMPORTEORIGEN);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1228, "")); // Importe
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(mPublic.kICHT_IMPORTE);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(2065, "")); // Depositar el
        elem.setType(Dialogs.PropertyType.date);
        elem.setKey(mPublic.kICHT_FECHACOBRO);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1901, "")); // Vto."
        elem.setType(Dialogs.PropertyType.date);
        elem.setKey(mPublic.kICHT_FECHAVTO);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1083, "")); // Clering
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CLEARING);
        elem.setKey(mPublic.kICHT_CLE_ID);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setKey(mPublic.kICHT_DESCRIP);

        var f = null;
        var fv = null;

        for(var _i = 0, count = m_data.tCheques.length; _i < count; _i += 1) {

          f = property.getGrid().getRows().add(null, rs(CT.OPGI_ID).Value);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], CT.OPGI_ID));
          fv.setKey(mPublic.kICHT_OPGI_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], C.CUE_NAME));
          fv.setId(Cairo.Database.valField(m_data.tCheques[_i], C.CUE_ID));
          fv.setKey(mPublic.kICHT_CUE_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], CT.CHEQ_NUMERO_DOC));
          fv.setId(Cairo.Database.valField(m_data.tCheques[_i], CT.CHEQ_ID));
          fv.setKey(mPublic.kICHT_CHEQUE);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], CT.CLI_NAME));
          fv.setKey(mPublic.kICHT_CLI_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], CT.BCO_NAME));
          fv.setKey(mPublic.kICHT_BCO_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], CT.MON_NAME));
          fv.setId(Cairo.Database.valField(m_data.tCheques[_i], CT.MON_ID));
          fv.setKey(mPublic.kICHT_MON_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], CT.OPGI_IMPORTE_ORIGEN));
          fv.setKey(mPublic.kICHT_IMPORTEORIGEN);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], CT.OPGI_IMPORTE));
          fv.setKey(mPublic.kICHT_IMPORTE);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], CT.CHEQ_FECHA_COBRO));
          fv.setKey(KICH_FECHACOBRO);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], CT.CHEQ_FECHA_VTO));
          fv.setKey(KICH_FECHAVTO);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], CT.CLE_NAME));
          fv.setKey(KICH_CLE_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], CT.OPGI_DESCRIP));
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
        elem.setName(Cairo.Language.getText(1267, "")); // Cuenta
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);

        //.HelpFilter = cscCuecId & "=" & csECuecBancos
        elem.setSelectFilter(mPublic.self.getHelpFilterChequesP());

        elem.setKey(KICH_CUE_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(2063, "")); // Mon
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setKey(KICH_MON_ID);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1901, "")); // Origen
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KICH_IMPORTEORIGEN);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1228, "")); // Importe
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KICH_IMPORTE);

        var elem = w_columns.add(null, C_CHEQUERA);
        elem.setName(Cairo.Language.getText(2064, "")); // Chequera
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CHEQUERA);
        elem.setKey(KICH_CHEQUERA);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(2059, "")); // Nr. Cheque
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KICH_CHEQUE);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(2058, "")); // Cheque
        elem.setType(Dialogs.PropertyType.text);
        elem.setEnabled(false);
        elem.setKey(KICH_CHEQ_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(2065, "")); // Depositar el
        elem.setType(Dialogs.PropertyType.date);
        elem.setDefaultValue(new cABMGridRowValue());
        elem.getDefaultValue().setValue(Cairo.Dates.today());
        elem.setKey(KICH_FECHACOBRO);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1634, "")); // Vto.
        elem.setType(Dialogs.PropertyType.date);
        elem.setDefaultValue(new cABMGridRowValue());
        elem.getDefaultValue().setValue(DateAdd("y", 1, Cairo.Dates.today()));
        elem.setKey(KICH_FECHAVTO);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1083, "")); // Clering
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CLEARING);
        elem.setKey(KICH_CLE_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setKey(KICH_DESCRIP);

        var f = null;
        var fv = null;

        for(var _i = 0, count = m_data.cheques.length; _i < count; _i += 1) {

          f = property.getGrid().getRows().add(null, rs(CT.OPGI_ID).Value);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.cheques[_i], CT.OPGI_ID));
          fv.setKey(KICH_OPGI_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.cheques[_i], C.CUE_NAME));
          fv.setId(Cairo.Database.valField(m_data.cheques[_i], C.CUE_ID));
          fv.setKey(KICH_CUE_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.cheques[_i], CT.MON_NAME));
          fv.setId(Cairo.Database.valField(m_data.cheques[_i], CT.MON_ID));
          fv.setKey(KICH_MON_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.cheques[_i], CT.OPGI_IMPORTE_ORIGEN));
          fv.setKey(KICH_IMPORTEORIGEN);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.cheques[_i], CT.OPGI_IMPORTE));
          fv.setKey(KICH_IMPORTE);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.cheques[_i], CT.CHQ_CODE));
          fv.setId(Cairo.Database.valField(m_data.cheques[_i], CT.CHQ_ID));
          fv.setKey(KICH_CHEQUERA);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.cheques[_i], CT.CHEQ_NUMERO_DOC));
          fv.setKey(KICH_CHEQUE);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.cheques[_i], CT.CHEQ_NUMERO));
          fv.setId(Cairo.Database.valField(m_data.cheques[_i], CT.CHEQ_ID));
          fv.setKey(KICH_CHEQ_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.cheques[_i], CT.CHEQ_FECHA_COBRO));
          fv.setKey(KICH_FECHACOBRO);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.cheques[_i], CT.CHEQ_FECHA_VTO));
          fv.setKey(KICH_FECHAVTO);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.cheques[_i], CT.CLE_NAME));
          fv.setId(Cairo.Database.valField(m_data.cheques[_i], CT.CLE_ID));
          fv.setKey(KICH_CLE_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.cheques[_i], CT.OPGI_DESCRIP));
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
        elem.setName(Cairo.Language.getText(1267, "")); // Cuenta
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setSelectFilter(D.selectFilterForCuentaEfectivo);

        elem.setKey(KIE_CUE_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(2063, "")); // Mon
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setKey(KIE_MON_ID);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1901, "")); // Origen
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIE_IMPORTEORIGEN);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1228, "")); // Importe
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIE_IMPORTE);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setKey(KIE_DESCRIP);

        var f = null;
        var fv = null;

        for(var _i = 0, count = m_data.efectivo.length; _i < count; _i += 1) {

          f = property.getGrid().getRows().add(null, rs(CT.OPGI_ID).Value);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.efectivo[_i], CT.OPGI_ID));
          fv.setKey(KIE_OPGI_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.efectivo[_i], C.CUE_NAME));
          fv.setId(Cairo.Database.valField(m_data.efectivo[_i], C.CUE_ID));
          fv.setKey(KIE_CUE_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.efectivo[_i], CT.MON_NAME));
          fv.setId(Cairo.Database.valField(m_data.efectivo[_i], CT.MON_ID));
          fv.setKey(KIE_MON_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.efectivo[_i], CT.OPGI_IMPORTE_ORIGEN));
          fv.setKey(KIE_IMPORTEORIGEN);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.efectivo[_i], CT.OPGI_IMPORTE));
          fv.setKey(KIE_IMPORTE);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.efectivo[_i], CT.OPGI_DESCRIP));
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
        elem.setName(Cairo.Language.getText(1267, "")); // Cuenta
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setKey(KICC_CUE_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1901, "")); // Origen
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KICC_IMPORTEORIGEN);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Language.getText(1228, "")); // Importe
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KICC_IMPORTE);

        var f = null;
        var fv = null;

        for(var _i = 0, count = m_data.ctaCte.length; _i < count; _i += 1) {

          f = property.getGrid().getRows().add(null, rs(CT.OPGI_ID).Value);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.ctaCte[_i], CT.OPGI_ID));
          fv.setKey(KICC_OPGI_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.ctaCte[_i], C.CUE_NAME));
          fv.setId(Cairo.Database.valField(m_data.ctaCte[_i], C.CUE_ID));
          fv.setKey(KICC_CUE_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.ctaCte[_i], CT.OPGI_IMPORTE_ORIGEN));
          fv.setKey(KICC_IMPORTEORIGEN);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.ctaCte[_i], CT.OPGI_IMPORTE));
          fv.setKey(KICC_IMPORTE);

        }

        return true;
      };

      var load = function(id) {

        var apiPath = Cairo.Database.getAPIVersion();
        return Cairo.Database.getData("load[" + apiPath + "general/ordenpago]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== NO_ID) {

              m_isNew = false;

              m_id = Cairo.Database.valField(response.data, CT.OPG_ID);
              m_numero = Cairo.Database.valField(response.data, CT.OPG_NUMERO);
              m_nrodoc = Cairo.Database.valField(response.data, CT.OPG_NRODOC);
              m_descrip = Cairo.Database.valField(response.data, CT.OPG_DESCRIP);
              m_fecha = Cairo.Database.valField(response.data, CT.OPG_FECHA);
              m_neto = Cairo.Database.valField(response.data, CT.OPG_NETO);
              m_total = Cairo.Database.valField(response.data, CT.OPG_TOTAL);
              m_otros = Cairo.Database.valField(response.data, CT.OPG_OTROS);
              m_cotizacion = Cairo.Database.valField(response.data, CT.OPG_COTIZACION);
              m_provId = Cairo.Database.valField(response.data, C.PROV_ID);
              m_proveedor = Cairo.Database.valField(response.data, C.PROV_NAME);
              m_ccosId = Cairo.Database.valField(response.data, C.CCOS_ID);
              m_centroCosto = Cairo.Database.valField(response.data, C.CCOS_NAME);
              m_sucId = Cairo.Database.valField(response.data, CT.SUC_ID);
              m_sucursal = Cairo.Database.valField(response.data, CT.SUC_NAME);
              m_docId = Cairo.Database.valField(response.data, CT.DOC_ID);
              m_documento = Cairo.Database.valField(response.data, CT.DOC_NAME);
              m_doctId = Cairo.Database.valField(response.data, CT.DOCT_ID);
              m_lgjId = Cairo.Database.valField(response.data, CT.LGJ_ID);
              m_legajo = Cairo.Database.valField(response.data, CT.LGJ_CODE);
              m_creado = Cairo.Database.valField(response.data, Cairo.Constants.CREADO);
              m_modificado = Cairo.Database.valField(response.data, Cairo.Constants.MODIFICADO);
              m_modifico = Cairo.Database.valField(response.data, Cairo.Constants.MODIFICO);
              m_estId = Cairo.Database.valField(response.data, Cairo.Constants.EST_ID);
              m_estado = Cairo.Database.valField(response.data, Cairo.Constants.EST_NAME);
              m_firmado = Cairo.Database.valField(response.data, CT.OPG_FIRMADO);
              m_docEditable = Cairo.Database.valField(response.data, Cairo.Constants.DOC_EDITABLE);
              m_docEditMsg = Cairo.Database.valField(response.data, Cairo.Constants.DOCEDIT_MSG);

              // Para ver documentos auxiliares
              //
              m_as_id = Cairo.Database.valField(response.data, CT.AS_ID);

              m_taPropuesto = Cairo.Database.valField(response.data, Cairo.Constants.TA__PROPUESTO);
              m_taMascara = Cairo.Database.valField(response.data, Cairo.Constants.TA__MASCARA);

              m_lastDocId = m_docId;
              m_lastProvId = m_provId;
              m_lastDocName = m_documento;
              m_lastProvName = m_proveedor;

            }
            else {
              m_id = NO_ID;
              m_numero = 0;
              m_nrodoc = "";
              m_descrip = "";
              m_fecha = Cairo.Dates.today();
              m_neto = 0;
              m_total = 0;
              m_otros = 0;
              m_provId = NO_ID;
              m_proveedor = "";
              m_ccosId = NO_ID;
              m_centroCosto = "";
              m_docId = NO_ID;
              m_documento = "";
              m_doctId = NO_ID;
              m_lgjId = NO_ID;
              m_legajo = "";
              m_cotizacion = 0;
              m_creado = Cairo.Constants.cSNODATE;
              m_modificado = Cairo.Constants.cSNODATE;
              m_modifico = 0;
              m_estId = NO_ID;
              m_estado = "";
              m_sucId = Cairo.User.getSucId();
              m_sucursal = Cairo.User.getSucName();
              m_firmado = false;

              // Para ver documentos auxiliares
              //
              m_as_id = NO_ID;

              m_taPropuesto = false;
              m_taMascara = "";

              m_docId = m_lastDocId;
              m_provId = m_lastProvId;
              m_proveedor = m_lastProvName;
              m_documento = m_lastDocName;

              DocEditableGet(m_docId, m_docEditable, m_docEditMsg, csTesoreriaPrestacion.cSPRETSRNEWORDENPAGO);
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

      var setEnabled = function() {
        var bState = null;
        var prop = null;

        if(m_docEditable && ((Not m_isNew) || m_copy)) {
          bState = m_properties.item(CT.DOC_ID).getSelectId() !== NO_ID;
        }
        else {
          bState = false;
        }

        var _count = m_properties.size();
        for(var _i = 0; _i < _count; _i++) {
          prop = m_properties.item(_i);
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
        for(var _i = 0; _i < _count; _i++) {
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

      var getCueIdProveedor = function(cue_id) { // TODO: Use of ByRef founded Private Function getCueIdProveedor(ByRef cue_id As Long) As Boolean
        var sqlstmt = null;
        var rs = null;

        // Cuenta contable del Proveedor
        sqlstmt = "sp_DocGetCueId "+ m_lastProvId+ ","+ m_lastDocId;
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

        if(rs.isEOF()) { return false; }

        cue_id = Cairo.Database.valField(rs.getFields(), C.CUE_ID);

        return true;
      };

      var pFirmar = function() {
        var doc = null;
        var us_id = null;

        doc = new cDocumento();

        if(m_id === NO_ID) {
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

        if(!doc.Firmar(m_docId, us_id)) { return false; }

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_DocOrdenPagoFirmar "+ m_id+ ","+ us_id.toString();
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

        m_estId = Cairo.Database.valField(rs.getFields(), Cairo.Constants.EST_ID);
        m_estado = Cairo.Database.valField(rs.getFields(), Cairo.Constants.EST_NAME);

        var iProp = null;
        iProp = m_properties.item(Cairo.Constants.STATUS_ID);

        iProp.setSelectId(m_estId);
        iProp.setValue(m_estado);

        Cairo.Database.getData(CT.ORDENPAGO, CT.OPG_ID, m_id, CT.OPG_FIRMADO, m_firmado);

        m_dialog.showValue(iProp);

        return true;
      };

      var move = function(moveTo) {
        var sqlstmt = null;
        var rs = null;
        var doc_id = null;

        doc_id = m_properties.item(CT.DOC_ID).getSelectId();

        if(doc_id === NO_ID) { return M.showInfoWithFalse(Cairo.Language.getText(1595, "")); }
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
              move(Dialogs.Message.MSG_DOC_LAST);

              // Si era anterior ahora busco el primero
              //
              break;

            case Dialogs.Message.MSG_DOC_PREVIOUS:
              move(Dialogs.Message.MSG_DOC_FIRST);

              // Si no encontre ni ultimo ni primero
              // es por que no hay ningun comprobante para
              // este documento
              //
              break;

            case Dialogs.Message.MSG_DOC_FIRST:
            case Dialogs.Message.MSG_DOC_LAST:

              // Cargo un registro vacio
              //
              load(NO_ID);

              // Refresco el formulario
              //
              refreshProperties();

              // Obtengo un nuevo numero de comprobante
              //
              GetDocNumber(m_lastDocId, m_dialog, m_taPropuesto, CT.OPG_NRODOC);

              break;
          }

        }
        else {
          if(!load(Cairo.Database.valField(rs.getFields(), 0))) { return false; }

          refreshProperties();
        }

        return true;
      };

      var refreshProperties = function() {
        var c = null;
                #If PREPROC_SFS Then;
        var abmGen = null;
                #Else;
        var abmGen = null;
                #End If;

        var filter = null;

        var properties = m_dialog.getProperties();

        c = properties.item(CT.DOC_ID);
        c.setSelectId(m_docId);
        c.setValue(m_documento);

        c = properties.item(CT.OPG_FECHA);
        c.setValue(m_fecha);

        c = properties.item(C.PROV_ID);
        c.setSelectId(m_provId);
        c.setValue(m_proveedor);

        c = properties.item(Cairo.Constants.NUMBER_ID);
        c.setValue(m_numero);

        c = properties.item(Cairo.Constants.STATUS_ID);
        c.setValue(m_estado);

        c = properties.item(CT.OPG_NRODOC);
        c.setValue(m_nrodoc);
        c.setTextMask(m_taMascara);
        c.setTextAlign(Dialogs.TextAlign.right);

        c = properties.item(CT.OPG_COTIZACION);
        c.setValue(m_cotizacion);

        c = properties.item(C.CCOS_ID);
        c.setSelectId(m_ccosId);
        c.setValue(m_centroCosto);

        c = properties.item(CT.SUC_ID);
        c.setSelectId(m_sucId);
        c.setValue(m_sucursal);

        c = properties.item(CT.LGJ_ID);
        c.setSelectId(m_lgjId);
        c.setValue(m_legajo);

        c = properties.item(CT.OPG_DESCRIP);
        c.setValue(m_descrip);

        abmGen = m_dialog;
        abmGen.ShowValues(m_dialog.getProperties());

        abmGen.ResetChanged;

        c = getChequesProperty();
        if(!pLoadCheques(c)) { return; }

        m_chequesDeleted = "";

        c = getEfectivoProperty();
        if(!pLoadEfectivo(c)) { return; }

        m_efectivoDeleted = "";

        c = getTChequesProperty();
        if(!pLoadTCheques(c)) { return; }

        m_tChequesDeleted = "";

        c = getOtrosProperty();
        if(!pLoadOtros(c)) { return; }

        m_otrosDeleted = "";

        c = getCtaCteProperty();
        if(!pLoadCtaCte(c)) { return; }

        m_ctaCteDeleted = "";

        abmGen = m_items;
        abmGen.ShowValues(m_items.getProperties());

        setFilterColFactura();

        var properties = m_footer.getProperties();

        c = properties.item(CT.OPG_OTROS);
        c.setValue(m_otros);

        c = properties.item(CT.OPG_NETO);
        c.setValue(m_neto);

        c = properties.item(CT.OPG_TOTAL);
        c.setValue(m_total);

        abmGen = m_footer;
        abmGen.ShowValues(m_footer.getProperties());

        setEnabled();
      };

      var showStartWizard = function() {
        try {

          var oWizard = null;
          oWizard = new cOrdenPagoWizard();

          if(!oWizard.self.load()) { return; }

          oWizard.self.setProv_id(m_provId);
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

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "showStartWizard", C_MODULE, "");
        }
      };

      // Construccion - Destruccion
      self.initialize = function() {
        try {

            c_ErrorSave = Cairo.Language.getText(1910, ""); // Error al grabar la orden de pago

          m_generalConfig = new cGeneralConfig();
          m_generalConfig.Load;
          G.redim(m_fcIds, 0);
          m_monDefault = GetMonedaDefault();

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "Class_Initialize", C_MODULE, "");
        }
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

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "Class_Terminate", C_MODULE, "");
        }
      };

      //////////////////////////////////////////////////////////////
      var saveTCheques = function(id) {
        var register = null;
        var row = null;
        var cell = null;

        var _count = getTCheques().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getTCheques().getRows().item(_i);

          var register = new DB.Register();
          register.setFieldId(CT.OPGI_TMPID);
          register.setTable(CT.ORDENPAGOITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for(var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KICH_OPGI_ID:
                if(m_copy) {
                  register.getFields().add2(CT.OPGI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  register.getFields().add2(CT.OPGI_ID, Cairo.Util.val(cell.getValue()), Types.integer);
                }
                break;

              case mPublic.kICHT_DESCRIP:
                register.getFields().add2(CT.OPGI_DESCRIP, cell.getValue(), Types.text);

                break;

              case mPublic.kICHT_CHEQUE:
                register.getFields().add2(CT.CHEQ_ID, cell.getId(), Types.id);

                break;

              case mPublic.kICHT_CLE_ID:
                register.getFields().add2(CT.CLE_ID, cell.getId(), Types.id);

                break;

              case mPublic.kICHT_MON_ID:
                register.getFields().add2(CT.MON_ID, cell.getId(), Types.id);

                break;

              case mPublic.kICHT_FECHACOBRO:
                register.getFields().add2(CT.OPGI_TMPFECHA_COBRO, cell.getValue(), Types.date);

                break;

              case mPublic.kICHT_FECHAVTO:
                register.getFields().add2(CT.OPGI_TMPFECHA_VTO, cell.getValue(), Types.date);

                break;

              case mPublic.kICHT_CUE_ID:
                register.getFields().add2(C.CUE_ID, cell.getId(), Types.id);

                break;

              case mPublic.kICHT_IMPORTEORIGEN:
                register.getFields().add2(CT.OPGI_IMPORTE_ORIGEN, Cairo.Util.val(cell.getValue()), Types.currency);

                break;

              case mPublic.kICHT_IMPORTE:
                register.getFields().add2(CT.OPGI_IMPORTE, Cairo.Util.val(cell.getValue()), Types.currency);
                break;
            }
          }

          m_iOrden = m_iOrden + 1;
          register.getFields().add2(CT.OPGI_ORDEN, m_iOrden, Types.integer);
          register.getFields().add2(CT.OPGI_TIPO, csEOrdenPagoItemTipo.cSEOPGITCHEQUEST, Types.integer);
          register.getFields().add2(CT.OPG_TMPID, id, Types.id);
          register.getFields().add2(CT.OPGI_ID, Cairo.Constants.NEW_ID, Types.long);
          register.getFields().add2(CT.OPGI_OTRO_TIPO, CT.OtroTipo.OTRO_HABER, Types.integer);




          if(!Cairo.Database.save(register, , "saveTCheques", C_MODULE, c_ErrorSave)) { return false; }
        }

        var sqlstmt = null;

        if(LenB(m_tChequesDeleted) && m_id !== NO_ID && !m_copy) {

          var vDeletes = null;
          var i = null;

          m_tChequesDeleted = RemoveLastColon(m_tChequesDeleted);
          vDeletes = Split(m_tChequesDeleted, ",");

          for(i = 0; i <= vDeletes.Length; i++) {

            var register = new DB.Register();
            register.setFieldId(CT.OPGIB_TMPID);
            register.setTable(CT.ORDENPAGOITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            register.getFields().add2(CT.OPGI_ID, Cairo.Util.val(vDeletes(i)), Types.integer);
            register.getFields().add2(CT.OPG_ID, m_id, Types.id);
            register.getFields().add2(CT.OPG_TMPID, id, Types.id);




            if(!Cairo.Database.save(register, , "saveTCheques", C_MODULE, c_ErrorSave)) { return false; }
          }

        }

        return true;
      };

      var saveCheques = function(id) {
        var register = null;

        var row = null;
        var cell = null;

        var _count = getCheques().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getCheques().getRows().item(_i);

          var register = new DB.Register();
          register.setFieldId(CT.OPGI_TMPID);
          register.setTable(CT.ORDENPAGOITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for(var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KICH_OPGI_ID:
                if(m_copy) {
                  register.getFields().add2(CT.OPGI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  register.getFields().add2(CT.OPGI_ID, Cairo.Util.val(cell.getValue()), Types.integer);
                }
                break;

              case KICH_DESCRIP:
                register.getFields().add2(CT.OPGI_DESCRIP, cell.getValue(), Types.text);

                break;

              case KICH_CHEQUERA:
                register.getFields().add2(CT.CHQ_ID, cell.getId(), Types.id);

                break;

              case KICH_CHEQUE:
                register.getFields().add2(CT.OPGI_TMPCHEQUE, cell.getValue(), Types.text);

                break;

              case KICH_CHEQ_ID:
                register.getFields().add2(CT.CHEQ_ID, cell.getId(), Types.id);

                break;

              case KICH_CLE_ID:
                register.getFields().add2(CT.CLE_ID, cell.getId(), Types.id);

                break;

              case KICH_MON_ID:
                register.getFields().add2(CT.MON_ID, cell.getId(), Types.id);
                break;

              case KICH_FECHACOBRO:
                register.getFields().add2(CT.OPGI_TMPFECHA_COBRO, cell.getValue(), Types.date);
                break;

              case KICH_FECHAVTO:
                register.getFields().add2(CT.OPGI_TMPFECHA_VTO, cell.getValue(), Types.date);

                break;

              case KICH_CUE_ID:
                register.getFields().add2(C.CUE_ID, cell.getId(), Types.id);
                break;

              case KICH_IMPORTEORIGEN:
                register.getFields().add2(CT.OPGI_IMPORTE_ORIGEN, Cairo.Util.val(cell.getValue()), Types.currency);
                break;

              case KICH_IMPORTE:
                register.getFields().add2(CT.OPGI_IMPORTE, Cairo.Util.val(cell.getValue()), Types.currency);
                break;
            }
          }

          m_iOrden = m_iOrden + 1;
          register.getFields().add2(CT.OPGI_ORDEN, m_iOrden, Types.integer);
          register.getFields().add2(CT.OPGI_TIPO, csEOrdenPagoItemTipo.cSEOPGITCHEQUES, Types.integer);
          register.getFields().add2(CT.OPG_TMPID, id, Types.id);
          register.getFields().add2(CT.OPGI_OTRO_TIPO, CT.OtroTipo.OTRO_HABER, Types.integer);




          if(!Cairo.Database.save(register, , "saveCheques", C_MODULE, c_ErrorSave)) { return false; }
        }

        var sqlstmt = null;

        if(m_chequesDeleted !== "" && m_id !== NO_ID && !m_copy) {

          var vDeletes = null;
          var i = null;

          m_chequesDeleted = RemoveLastColon(m_chequesDeleted);
          vDeletes = Split(m_chequesDeleted, ",");

          for(i = 0; i <= vDeletes.Length; i++) {

            var register = new DB.Register();
            register.setFieldId(CT.OPGIB_TMPID);
            register.setTable(CT.ORDENPAGOITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            register.getFields().add2(CT.OPGI_ID, Cairo.Util.val(vDeletes(i)), Types.integer);
            register.getFields().add2(CT.OPG_ID, m_id, Types.id);
            register.getFields().add2(CT.OPG_TMPID, id, Types.id);




            if(!Cairo.Database.save(register, , "saveCheques", C_MODULE, c_ErrorSave)) { return false; }
          }

        }

        return true;
      };

      var saveOtros = function(id) {
        var register = null;

        var row = null;
        var cell = null;

        var _count = getOtros().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getOtros().getRows().item(_i);

          var register = new DB.Register();
          register.setFieldId(CT.OPGI_TMPID);
          register.setTable(CT.ORDENPAGOITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for(var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KICH_OPGI_ID:
                if(m_copy) {
                  register.getFields().add2(CT.OPGI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  register.getFields().add2(CT.OPGI_ID, Cairo.Util.val(cell.getValue()), Types.integer);
                }
                break;

              case KIO_DESCRIP:
                register.getFields().add2(CT.OPGI_DESCRIP, cell.getValue(), Types.text);
                break;

              case KIO_RET_ID:
                register.getFields().add2(CT.RET_ID, cell.getId(), Types.id);
                break;

              case KIO_NRORETENCION:
                register.getFields().add2(CT.OPGI_NRO_RETENCION, cell.getValue(), Types.text);
                break;

              case KIO_PORCRETENCION:
                register.getFields().add2(CT.OPGI_PORC_RETENCION, Cairo.Util.val(cell.getValue()), Types.double);
                break;

              case KIO_CCOS_ID:
                register.getFields().add2(C.CCOS_ID, cell.getId(), Types.id);
                break;

              case KIO_FC_ID_RET:
                register.getFields().add2(CT.FC_ID_RET, cell.getId(), Types.id);
                break;

              case KIO_CUE_ID:
                register.getFields().add2(C.CUE_ID, cell.getId(), Types.id);
                break;

              case KIO_FECHARETENCION:
                register.getFields().add2(CT.OPGI_FECHA_RETENCION, cell.getValue(), Types.date);
                break;

              case KIO_IMPORTEORIGEN:
                register.getFields().add2(CT.OPGI_IMPORTE_ORIGEN, Cairo.Util.val(cell.getValue()), Types.currency);
                break;

              case KIO_DEBE:
                if(Cairo.Util.val(cell.getValue()) !== 0) {
                  register.getFields().add2(CT.OPGI_IMPORTE, Cairo.Util.val(cell.getValue()), Types.currency);
                  register.getFields().add2(CT.OPGI_OTRO_TIPO, CT.OtroTipo.OTRO_HABER, Types.integer);
                }
                break;

              case KIO_HABER:
                if(Cairo.Util.val(cell.getValue()) !== 0) {
                  register.getFields().add2(CT.OPGI_IMPORTE, Cairo.Util.val(cell.getValue()), Types.currency);
                  register.getFields().add2(CT.OPGI_OTRO_TIPO, CT.OtroTipo.OTRO_DEBE, Types.integer);
                }
                break;
            }
          }

          m_iOrden = m_iOrden + 1;
          register.getFields().add2(CT.OPGI_ORDEN, m_iOrden, Types.integer);
          register.getFields().add2(CT.OPGI_TIPO, csEOrdenPagoItemTipo.cSEOPGITOTROS, Types.integer);
          register.getFields().add2(CT.OPG_TMPID, id, Types.id);




          if(!Cairo.Database.save(register, , "saveOtros", C_MODULE, c_ErrorSave)) { return false; }
        }

        var sqlstmt = null;

        if(m_otrosDeleted !== "" && m_id !== NO_ID && !m_copy) {

          var vDeletes = null;
          var i = null;

          m_otrosDeleted = RemoveLastColon(m_otrosDeleted);
          vDeletes = Split(m_otrosDeleted, ",");

          for(i = 0; i <= vDeletes.Length; i++) {

            var register = new DB.Register();
            register.setFieldId(CT.OPGIB_TMPID);
            register.setTable(CT.ORDENPAGOITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            register.getFields().add2(CT.OPGI_ID, Cairo.Util.val(vDeletes(i)), Types.integer);
            register.getFields().add2(CT.OPG_ID, m_id, Types.id);
            register.getFields().add2(CT.OPG_TMPID, id, Types.id);




            if(!Cairo.Database.save(register, , "saveOtros", C_MODULE, c_ErrorSave)) { return false; }
          }

        }

        return true;
      };

      var saveEfectivo = function(id) {
        var register = null;

        var row = null;
        var cell = null;

        var _count = getEfectivo().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getEfectivo().getRows().item(_i);

          var register = new DB.Register();
          register.setFieldId(CT.OPGI_TMPID);
          register.setTable(CT.ORDENPAGOITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for(var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KICH_OPGI_ID:
                if(m_copy) {
                  register.getFields().add2(CT.OPGI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  register.getFields().add2(CT.OPGI_ID, Cairo.Util.val(cell.getValue()), Types.integer);
                }
                break;

              case KIE_DESCRIP:
                register.getFields().add2(CT.OPGI_DESCRIP, cell.getValue(), Types.text);
                break;

              case KIE_CUE_ID:
                register.getFields().add2(C.CUE_ID, cell.getId(), Types.id);
                break;

              case KIE_IMPORTEORIGEN:
                register.getFields().add2(CT.OPGI_IMPORTE_ORIGEN, Cairo.Util.val(cell.getValue()), Types.currency);
                break;

              case KIE_IMPORTE:
                register.getFields().add2(CT.OPGI_IMPORTE, Cairo.Util.val(cell.getValue()), Types.currency);
                break;
            }
          }

          m_iOrden = m_iOrden + 1;
          register.getFields().add2(CT.OPGI_ORDEN, m_iOrden, Types.integer);
          register.getFields().add2(CT.OPGI_TIPO, csEOrdenPagoItemTipo.cSEOPGITEFECTIVO, Types.integer);
          register.getFields().add2(CT.OPG_TMPID, id, Types.id);
          register.getFields().add2(CT.OPGI_OTRO_TIPO, CT.OtroTipo.OTRO_HABER, Types.integer);




          if(!Cairo.Database.save(register, , "saveEfectivo", C_MODULE, c_ErrorSave)) { return false; }
        }

        var sqlstmt = null;

        if(m_efectivoDeleted !== "" && m_id !== NO_ID && !m_copy) {

          var vDeletes = null;
          var i = null;

          m_efectivoDeleted = RemoveLastColon(m_efectivoDeleted);
          vDeletes = Split(m_efectivoDeleted, ",");

          for(i = 0; i <= vDeletes.Length; i++) {

            var register = new DB.Register();
            register.setFieldId(CT.OPGIB_TMPID);
            register.setTable(CT.ORDENPAGOITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            register.getFields().add2(CT.OPGI_ID, Cairo.Util.val(vDeletes(i)), Types.integer);
            register.getFields().add2(CT.OPG_ID, m_id, Types.id);
            register.getFields().add2(CT.OPG_TMPID, id, Types.id);




            if(!Cairo.Database.save(register, , "saveEfectivo", C_MODULE, c_ErrorSave)) { return false; }
          }

        }

        return true;
      };

      var saveCtaCte = function(id) {
        var register = null;

        var row = null;
        var cell = null;

        var _count = getCtaCte().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getCtaCte().getRows().item(_i);

          var register = new DB.Register();
          register.setFieldId(CT.OPGI_TMPID);
          register.setTable(CT.ORDENPAGOITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for(var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KICH_OPGI_ID:
                if(m_copy) {
                  register.getFields().add2(CT.OPGI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  register.getFields().add2(CT.OPGI_ID, Cairo.Util.val(cell.getValue()), Types.integer);
                }
                break;

              case KICC_CUE_ID:
                register.getFields().add2(C.CUE_ID, cell.getId(), Types.id);
                break;

              case KICC_IMPORTEORIGEN:
                register.getFields().add2(CT.OPGI_IMPORTE_ORIGEN, Cairo.Util.val(cell.getValue()), Types.currency);
                break;

              case KICC_IMPORTE:
                register.getFields().add2(CT.OPGI_IMPORTE, Cairo.Util.val(cell.getValue()), Types.currency);
                break;
            }
          }

          m_iOrden = m_iOrden + 1;
          register.getFields().add2(CT.OPGI_ORDEN, m_iOrden, Types.integer);
          register.getFields().add2(CT.OPGI_TIPO, csEOrdenPagoItemTipo.cSEOPGITCTA_CTE, Types.integer);
          register.getFields().add2(CT.OPG_TMPID, id, Types.id);
          register.getFields().add2(CT.OPGI_OTRO_TIPO, CT.OtroTipo.OTRO_DEBE, Types.integer);




          if(!Cairo.Database.save(register, , "saveCtaCte", C_MODULE, c_ErrorSave)) { return false; }
        }

        var sqlstmt = null;

        if(m_ctaCteDeleted !== "" && m_id !== NO_ID && !m_copy) {

          var vDeletes = null;
          var i = null;

          m_ctaCteDeleted = RemoveLastColon(m_ctaCteDeleted);
          vDeletes = Split(m_ctaCteDeleted, ",");

          for(i = 0; i <= vDeletes.Length; i++) {

            var register = new DB.Register();
            register.setFieldId(CT.OPGIB_TMPID);
            register.setTable(CT.ORDENPAGOITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            register.getFields().add2(CT.OPGI_ID, Cairo.Util.val(vDeletes(i)), Types.integer);
            register.getFields().add2(CT.OPG_ID, m_id, Types.id);
            register.getFields().add2(CT.OPG_TMPID, id, Types.id);




            if(!Cairo.Database.save(register, , "saveCtaCte", C_MODULE, c_ErrorSave)) { return false; }
          }

        }

        return true;
      };

      var showApply = function() {

        if(!DoCairo.Security.anAccess(csTesoreriaPrestacion.cSPRETSRMODIFYAPLIC, m_docId, csE_DocTypePrestacion.cSEDOCTPREAPLICAR)) { return; }

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
      var getTCheques = function() {
        return getTChequesProperty().getGrid();
      };

      var getCheques = function() {
        return getChequesProperty().getGrid();
      };

      var getEfectivo = function() {
        return getEfectivoProperty().getGrid();
      };

      var getOtros = function() {
        return getOtrosProperty().getGrid();
      };

      var getCtaCte = function() {
        return getCtaCteProperty().getGrid();
      };

      var getTChequesProperty = function() {
        return m_items.getProperties().item(C_CHEQUEST);
      };

      var getChequesProperty = function() {
        return m_items.getProperties().item(C_CHEQUES);
      };

      var getEfectivoProperty = function() {
        return m_items.getProperties().item(C_EFECTIVO);
      };

      var getOtrosProperty = function() {
        return m_items.getProperties().item(C_OTROS);
      };

      var getCtaCteProperty = function() {
        return m_items.getProperties().item(C_CTA_CTE);
      };

      var colAUpdateTCheque = function(property,  lRow,  lCol) { // TODO: Use of ByRef founded Private Function colAUpdateTCheque(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long) As Boolean
        var _rtn = null;
        var row = null;
        var value = null;

        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).getKey()) {

          case mPublic.kICHT_IMPORTEORIGEN:
            row = grid.getRows().item(lRow);
            var w_pCell = Dialogs.cell(row, mPublic.kICHT_MON_ID);
            if(w_pCell.getId() !== m_monDefault || w_pCell.getId() === 0) {
              Dialogs.cell(row, mPublic.kICHT_IMPORTE).setValue(Cairo.Util.val(Dialogs.cell(row, mPublic.kICHT_IMPORTEORIGEN).getValue()) * Cairo.Util.val(getCotizacion().getValue()));
            }
            else {
              Dialogs.cell(row, mPublic.kICHT_IMPORTEORIGEN).setValue(0);
            }

            break;

          case mPublic.kICHT_CUE_ID:
            var monId = null;
            var cueId = null;
            var moneda = null;

            row = grid.getRows().item(lRow);

            cueId = Dialogs.cell(row, mPublic.kICHT_CUE_ID).getId();
            D.getCurrencyFromAccount(monId, moneda, cueId);

            var w_pCell = Dialogs.cell(row, mPublic.kICHT_MON_ID);
            w_pCell.setValue(moneda);
            w_pCell.setId(monId);

            if(monId === m_monDefault || monId === 0) {
              Dialogs.cell(row, mPublic.kICHT_IMPORTEORIGEN).setValue(0);
            }

            cABMUtil.col(property.getGrid().getColumns(), mPublic.kICHT_CHEQUE).setSelectFilter(D.getSelectChequeFilter(cueId));

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
            row = grid.getRows().item(lRow);
            mPublic.self.setChequeData(row, Dialogs.cell(row, mPublic.kICHT_CHEQUE).getId());

            showPagoNeto();
            showPagoTotal();

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

      var colAUpdateCheque = function(property,  lRow,  lCol) { // TODO: Use of ByRef founded Private Function colAUpdateCheque(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long) As Boolean
        var _rtn = null;
        var row = null;
        var value = null;

        var grid = property.getGrid();
        switch (grid.getColumns().item(lCol).getKey()) {
          case KICH_IMPORTEORIGEN:
            row = grid.getRows().item(lRow);
            var w_pCell = Dialogs.cell(row, KICH_MON_ID);
            if(w_pCell.getId() !== m_monDefault || w_pCell.getId() === 0) {
              Dialogs.cell(row, KICH_IMPORTE).setValue(Cairo.Util.val(Dialogs.cell(row, KICH_IMPORTEORIGEN).getValue()) * Cairo.Util.val(getCotizacion().getValue()));
            }
            else {
              Dialogs.cell(row, KICH_IMPORTEORIGEN).setValue(0);
            }
            break;

          case KICH_IMPORTE:

            break;

          case KICH_CUE_ID:
            var monId = null;
            var cueId = null;
            var moneda = null;

            row = grid.getRows().item(lRow);

            cueId = Dialogs.cell(row, KICH_CUE_ID).getId();
            D.getCurrencyFromAccount(monId, moneda, cueId);

            var w_pCell = Dialogs.cell(row, KICH_MON_ID);
            w_pCell.setValue(moneda);
            w_pCell.setId(monId);

            if(monId === m_monDefault || monId === 0) {
              Dialogs.cell(row, KICH_IMPORTEORIGEN).setValue(0);
            }

            cABMUtil.col(property.getGrid().getColumns(), KICH_CHEQUERA).getHelpFilter() === C.CUE_ID+ "="+ cueId.toString();

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

            row = grid.getRows().item(lRow);
            var w_pCell = Dialogs.cell(row, KICH_CHEQUERA);
            if(w_pCell.getId() !== NO_ID) {
              Dialogs.cell(row, KICH_CHEQUE).setValue(GetChequeNumber(w_pCell.getId()));
            }

            break;

          default:
            _rtn = true;
            return _rtn;
            break;
        }

        showPagoNeto();
        showPagoTotal();
        _rtn = true;

        return _rtn;
      };

      var colAUpdateCtaCte = function(property,  lRow,  lCol) { // TODO: Use of ByRef founded Private Function colAUpdateCtaCte(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long) As Boolean
        return true;
      };

      var colAUpdateEfectivo = function(property,  lRow,  lCol) { // TODO: Use of ByRef founded Private Function colAUpdateEfectivo(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long) As Boolean
        var _rtn = null;
        var row = null;
        var value = null;

        var grid = property.getGrid();
        switch (grid.getColumns().item(lCol).getKey()) {
          case KIE_IMPORTEORIGEN:
            row = grid.getRows().item(lRow);
            var w_pCell = Dialogs.cell(row, KIE_MON_ID);
            if(w_pCell.getId() !== m_monDefault || w_pCell.getId() === 0) {
              Dialogs.cell(row, KIE_IMPORTE).setValue(Cairo.Util.val(Dialogs.cell(row, KIE_IMPORTEORIGEN).getValue()) * Cairo.Util.val(getCotizacion().getValue()));
            }
            else {
              Dialogs.cell(row, KIE_IMPORTEORIGEN).setValue(0);
            }
            break;

          case KIE_IMPORTE:

            break;

          case KIE_CUE_ID:
            var monId = null;
            var moneda = null;
            row = grid.getRows().item(lRow);
            D.getCurrencyFromAccount(monId, moneda, Dialogs.cell(row, KIE_CUE_ID).getId());
            var cell = Dialogs.cell(row, KIE_MON_ID);
            cell.setValue(moneda);
            cell.setId(monId);

            if(monId === m_monDefault || monId === 0) {
              Dialogs.cell(row, KIE_IMPORTEORIGEN).setValue(0);
            }

            _rtn = true;
            return _rtn;
            break;

          default:
            _rtn = true;
            return _rtn;
            break;
        }

        showPagoNeto();
        showPagoTotal();
        _rtn = true;

        return _rtn;
      };

      var colAUpdateOtro = function(property,  lRow,  lCol) { // TODO: Use of ByRef founded Private Function colAUpdateOtro(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long) As Boolean
        var _rtn = null;
        var row = null;
        var value = null;

        var grid = property.getGrid();
        switch (grid.getColumns().item(lCol).getKey()) {
          case KIO_DEBE:
            row = grid.getRows().item(lRow);
            Dialogs.cell(row, KIO_IMPORTEORIGEN).setValue(Cairo.Util.val(Dialogs.cell(row, KIO_DEBE).getValue()));
            Dialogs.cell(row, KIO_HABER).setValue(0);
            break;

          case KIO_HABER:
            row = grid.getRows().item(lRow);
            Dialogs.cell(row, KIO_IMPORTEORIGEN).setValue(Cairo.Util.val(Dialogs.cell(row, KIO_HABER).getValue()));
            Dialogs.cell(row, KIO_DEBE).setValue(0);
            break;

          default:
            _rtn = true;
            return _rtn;
            break;
        }

        showPagoOtro();
        showPagoTotal();
        _rtn = true;

        return _rtn;
      };

      var getCotizacion = function() {
        return m_properties.item(CT.OPG_COTIZACION);
      };

      var showPagoNeto = function() {
        var row = null;
        var total = null;
        var totalOrigen = null;

        var _count = getCheques().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getCheques().getRows().item(_i);
          total = total + Cairo.Util.val(Dialogs.cell(row, KICH_IMPORTE).getValue());
        }

        var _count = getTCheques().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getTCheques().getRows().item(_i);
          total = total + Cairo.Util.val(Dialogs.cell(row, KICH_IMPORTE).getValue());
        }

        var _count = getEfectivo().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getEfectivo().getRows().item(_i);
          total = total + Cairo.Util.val(Dialogs.cell(row, KIE_IMPORTE).getValue());
        }

        getPagoNeto().setValue(total);
        m_footer.showValue(getPagoNeto());
      };

      var showPagoOtro = function() {
        var row = null;
        var total = null;

        var _count = getOtros().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getOtros().getRows().item(_i);
          total = total + Cairo.Util.val(Dialogs.cell(row, KIO_DEBE).getValue()) - Cairo.Util.val(Dialogs.cell(row, KIO_HABER).getValue());
        }

        getPagoOtros().setValue(total);
        m_footer.showValue(getPagoOtros());
      };

      var showPagoTotal = function() {
        getPagoTotal().setValue(Cairo.Util.val(getPagoNeto().getValue()) + Cairo.Util.val(getPagoOtros().getValue()));
        m_footer.showValue(getPagoTotal());
      };

      var getPagoNeto = function() {
        return m_footer.getProperties().item(CT.OPG_NETO);
      };

      var getPagoOtros = function() {
        return m_footer.getProperties().item(CT.OPG_OTROS);
      };

      var getPagoTotal = function() {
        return m_footer.getProperties().item(CT.OPG_TOTAL);
      };

      var isEmptyRowTCheques = function(row,  rowIndex) {

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {
            case mPublic.kICHT_CUE_ID:
            case mPublic.kICHT_MON_ID:
            case mPublic.kICHT_CLE_ID:
              if(!valEmpty(cell.getId(), Types.id)) {
                return false;
              }
              break;

            case mPublic.kICHT_IMPORTE:
            case mPublic.kICHT_IMPORTEORIGEN:
              if(!valEmpty(Cairo.Util.val(cell.getValue()), Types.double)) {
                return false;
              }
              break;

            case mPublic.kICHT_DESCRIP:
            case mPublic.kICHT_CHEQUE:
              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var isEmptyRowCheques = function(row,  rowIndex) {

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {
            case KICH_CUE_ID:
            case KICH_CHEQUERA:
            case KICH_MON_ID:
            case KICH_CLE_ID:
              if(!valEmpty(cell.getId(), Types.id)) {
                return false;
              }
              break;

            case KICH_IMPORTE:
            case KICH_IMPORTEORIGEN:
              if(!valEmpty(Cairo.Util.val(cell.getValue()), Types.double)) {
                return false;
              }
              break;

            case KICH_DESCRIP:
            case KICH_CHEQUE:
              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var validateRowTCheques = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function validateRowTCheques(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var bOrigen = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case mPublic.kICHT_CUE_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                        return M.showInfoWithFalse(Cairo.Language.getText(2113, "", strRow)); // Debe indicar una cuenta contable (1)
              }

              break;

            case mPublic.kICHT_CHEQUE:
              if(valEmpty(cell.getId(), Types.id)) {
                        return M.showInfoWithFalse(Cairo.Language.getText(2197, "", strRow)); // Debe indicar un Cheque (1)
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var validateRowCheques = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function validateRowCheques(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var bOrigen = null;
        var monId = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case KICH_CUE_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                        return M.showInfoWithFalse(Cairo.Language.getText(2113, "", strRow)); // Debe indicar una cuenta contable (1)
              }

              break;

            case KICH_MON_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                        return M.showInfoWithFalse(Cairo.Language.getText(2114, "", strRow)); // Debe indicar una moneda (1)
              }
              monId = cell.getId();

              break;

            case KICH_CLE_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                        return M.showInfoWithFalse(Cairo.Language.getText(2115, "", strRow)); // Debe indicar un clearing (1)
              }

              break;

            case KICH_IMPORTEORIGEN:
              bOrigen = !valEmpty(Cairo.Util.val(cell.getValue()), Types.double);

              break;

            case KICH_IMPORTE:
              if(valEmpty(Cairo.Util.val(cell.getValue()), Types.double)) {
                        return M.showInfoWithFalse(Cairo.Language.getText(1897, "", strRow)); // Debe indicar un importe (1)
              }

              break;

            case KICH_CHEQUERA:
              if(valEmpty(cell.getId(), Types.id)) {
                        return M.showInfoWithFalse(Cairo.Language.getText(2193, "", strRow)); // Debe indicar una chequera (1)
              }

              break;

            case KICH_CHEQUE:
              if(valEmpty(cell.getValue(), Types.text)) {
                        return M.showInfoWithFalse(Cairo.Language.getText(2116, "", strRow)); // Debe indicar una número de cheque (1)
              }

              break;

            case KICH_FECHACOBRO:
              if(valEmpty(cell.getValue(), Types.date)) {
                        return M.showInfoWithFalse(Cairo.Language.getText(2117, "", strRow)); // Debe indicar una fecha para depositar (1)
              }

              break;

            case KICH_FECHAVTO:
              if(valEmpty(cell.getValue(), Types.date)) {
                        return M.showInfoWithFalse(Cairo.Language.getText(1384, "", strRow)); // Debe indicar una fecha de vencimiento (1)
              }
              break;
          }
        }

        if(!bOrigen && monId !== m_monDefault) {
            return M.showInfoWithFalse(Cairo.Language.getText(2118, "", strRow)); // Debe indicar un importe para la moneda extranjera (1)
        }

        return P.resolvedPromise(true);
      };

      var isEmptyRowOtros = function(row,  rowIndex) {

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {
            case KIO_CUE_ID:
            case KIO_CCOS_ID:
            case KIO_RET_ID:
              if(!valEmpty(cell.getId(), Types.id)) {
                return false;
              }
              break;

            case KIO_DEBE:
            case KIO_HABER:
            case KIO_IMPORTEORIGEN:
            case KIO_PORCRETENCION:
              if(!valEmpty(Cairo.Util.val(cell.getValue()), Types.double)) {
                return false;
              }
              break;

            case KIO_NRORETENCION:
            case KIO_DESCRIP:
              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;

            case KIO_FECHARETENCION:
              if(!valEmpty(cell.getValue(), Types.date)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var validateRowOtros = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function validateRowOtros(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var bOrigen = null;
        var bDebe = null;
        var bHaber = null;
        var monId = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case KIO_CUE_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                        return M.showInfoWithFalse(Cairo.Language.getText(2113, "", strRow)); // Debe indicar una cuenta contable (1)
              }

              if(!Cairo.Database.getData(CT.CUENTA, C.CUE_ID, cell.getId(), CT.MON_ID, monId)) { return false; }

              break;

            case KIO_DEBE:
              bDebe = !valEmpty(Cairo.Util.val(cell.getValue()), Types.double);

              break;

            case KIO_HABER:
              bHaber = !valEmpty(Cairo.Util.val(cell.getValue()), Types.double);

              break;

            case KIO_IMPORTEORIGEN:
              bOrigen = !valEmpty(Cairo.Util.val(cell.getValue()), Types.double);

              break;
          }
        }

        if(!bDebe && !bHaber) {
          return M.showInfoWithFalse(Cairo.Language.getText(1898, "", strRow));
          //Debe indicar un importe en el debe o en el haber (1)
        }

        if(!bOrigen && monId !== m_monDefault) {
          return M.showInfoWithFalse(Cairo.Language.getText(2118, "", strRow));
          //Debe indicar un importe para la moneda extranjera (1)
        }

        return P.resolvedPromise(true);
      };

      var isEmptyRowCtaCte = function(row,  rowIndex) {

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {
            case KICC_CUE_ID:
              if(!valEmpty(cell.getId(), Types.id)) {
                return false;
              }
              break;

            case KICC_IMPORTE:
            case KICC_IMPORTEORIGEN:
              if(!valEmpty(Cairo.Util.val(cell.getValue()), Types.double)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var validateRowCtaCte = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function validateRowCtaCte(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var bOrigen = null;
        var monId = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case KICC_CUE_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                        return M.showInfoWithFalse(Cairo.Language.getText(2113, "", strRow)); // Debe indicar una cuenta contable (1)
              }

              if(!Cairo.Database.getData(CT.CUENTA, C.CUE_ID, cell.getId(), CT.MON_ID, monId)) { return false; }

              break;

            case KICC_IMPORTEORIGEN:
              bOrigen = !valEmpty(Cairo.Util.val(cell.getValue()), Types.double);

              break;

            case KICC_IMPORTE:
              if(valEmpty(Cairo.Util.val(cell.getValue()), Types.double)) {
                        return M.showInfoWithFalse(Cairo.Language.getText(1897, "", strRow)); // Debe indicar un importe (1)
              }
              break;
          }
        }

        if(!bOrigen && monId !== m_monDefault) {
          return M.showInfoWithFalse(Cairo.Language.getText(2118, "", strRow));
          //Debe indicar un importe para la moneda extranjera (1)
        }

        return P.resolvedPromise(true);
      };

      var isEmptyRowEfectivo = function(row,  rowIndex) {

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);
          switch (cell.getKey()) {
            case KIE_CUE_ID:
              if(!valEmpty(cell.getId(), Types.id)) {
                return false;
              }
              break;

            case KIE_IMPORTE:
            case KIE_IMPORTEORIGEN:
              if(!valEmpty(Cairo.Util.val(cell.getValue()), Types.double)) {
                return false;
              }
              break;

            case KIE_DESCRIP:
              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var validateRowEfectivo = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function validateRowEfectivo(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var bOrigen = null;
        var monId = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case KIE_CUE_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                        return M.showInfoWithFalse(Cairo.Language.getText(2113, "", strRow)); // Debe indicar una cuenta contable (1)
              }

              if(!Cairo.Database.getData(CT.CUENTA, C.CUE_ID, cell.getId(), CT.MON_ID, monId)) { return false; }

              break;

            case KIE_IMPORTEORIGEN:
              bOrigen = !valEmpty(Cairo.Util.val(cell.getValue()), Types.double);

              break;

            case KIE_IMPORTE:
              if(valEmpty(Cairo.Util.val(cell.getValue()), Types.double)) {
                        return M.showInfoWithFalse(Cairo.Language.getText(1897, "", strRow)); // Debe indicar un importe (1)
              }
              break;
          }
        }

        if(!bOrigen && monId !== m_monDefault) {
          return M.showInfoWithFalse(Cairo.Language.getText(2118, "", strRow));
          //Debe indicar un importe para la moneda extranjera (1)
        }

        return P.resolvedPromise(true);
      };

      var pClearCheqId = function() {
        var row = null;
        var _count = getCheques().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getCheques().getRows().item(_i);
          Dialogs.cell(row, KICH_CHEQ_ID).getId() === NO_ID;
        }
        var _count = getTCheques().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getTCheques().getRows().item(_i);
          Dialogs.cell(row, mPublic.kICHT_CHEQUE).getId() === NO_ID;
        }
        var abmObj = null;
        abmObj = m_items;
        abmObj.ShowValue(getChequesProperty(), true);
        abmObj.ShowValue(getTChequesProperty(), true);
      };

      var setFilterColFactura = function() {

        var abmObj = null;
        abmObj = m_items;

        cABMUtil.col(getOtros().getColumns(), KIO_FC_ID_RET).getHelpFilter() === "prov.prov_id = "+ getProveedor().toString();
        abmObj.RefreshColumnProperties(getOtrosProperty(), CT.FC_ID_RET);

      };

      var getProveedor = function() {
        return m_properties.item(C.PROV_ID).getSelectId();
      };

      var getFileNamePostFix = function() {
        var rtn = null;

        rtn = m_properties.item(C.PROV_ID).getValue().Substring(0, 50)+ "-"+ m_properties.item(CT.OPG_NRODOC).getValue();

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

  Cairo.module("OrdenPagoListDoc.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

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
      var CT = Cairo.Security.Actions.Tesoreria;

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

      var m_menuShowNotes = 0;
      var m_menuShowInfoProv = 0;
      var m_menuAddNote = 0;
      var m_menuShowAplic = 0;
      var m_menuShowAsiento = 0;
      var m_menuSign = 0;

      var m_objApply;

      var m_apiPath = DB.getAPIVersion();
      var SAVE_ERROR = getText(2245, ""); // Error al grabar los párametros de navegación de OrdenPago

      self.list = function() {
        initialize();
        return load()
          .whenSuccess(loadCollection);
      };

      self.edit = function(opgId) {
        m_listController.edit(opgId);
      };

      self.deleteItem = function(opgId) {
        return m_listController.destroy(opgId);
      };

      self.showDocDigital = function() {
        var _rtn = null;

        try {

          var opgId = m_dialog.getId();
          if(opgId === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(CX.TABLE_NAME_XXXX);
          doc.setClientTableID(opgId);

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

            case m_menuShowNotes:
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

            case m_menuSign:
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
        c.setSelectFilter(D.ORDEN_PAGO_LIST_DOC_FILTER);

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

            iProp = m_properties.item(C_FECHAINI);

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

            iProp = m_properties.item(C_FECHAFIN);

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
            var property = m_properties.item(C.EST_ID);
            m_estado = property.getValue();
            m_estId = property.getSelectIntValue();

            break;

          case K_PROV_ID:
            var property = m_properties.item(C.PROV_ID);
            m_proveedor = property.getValue();
            m_provId = property.getSelectIntValue();

            break;

          case K_CCOS_ID:
            var property = m_properties.item(C.CCOS_ID);
            m_centroCosto = property.getValue();
            m_ccosId = property.getSelectIntValue();

            break;

          case K_SUC_ID:
            var property = m_properties.item(CT.SUC_ID);
            m_sucursal = property.getValue();
            m_sucId = property.getSelectIntValue();

            break;

          case K_DOC_ID:
            var property = m_properties.item(CT.DOC_ID);
            m_documento = property.getValue();
            m_docId = property.getSelectIntValue();


            break;

          case K_EMP_ID:
            var property = m_properties.item(C.EMP_ID);
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

        register.setPath(m_apiPath + "tesoreria/ordenespago");

        register.setId(Cairo.Constants.NEW_ID);

        var _count = m_properties.size();
        for(var _i = 0; _i < _count; _i++) {

          var property = m_properties.item(_i);

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
          m_title = getText(1922, ""); // Orden de Pago
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
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");
        }
      };

      var createMenu = function() {

        if(m_menuLoaded) { return; }

        m_menuLoaded = true;

        m_dialog.clearMenu();

        m_menuSign = m_dialog.addMenu(getText(1594, "")); // Firmar
        m_dialog.addMenu("-");

        m_menuAddNote = m_dialog.addMenu(getText(1615, "")); // Agregar Nota

        m_menuShowNotes = m_dialog.addMenu(getText(1616, "")); // Ver Notas
        m_dialog.addMenu("-");

        m_menuShowAsiento = m_dialog.addMenu(getText(1692, "")); // Ver Asiento Contable
      };

      var getProvId = function() {


        var opgId = null;
        var provId = null;

        opgId = m_dialog.getId();
        DB.getData(CT.ORDENPAGO, CT.OPG_ID, opgId, C.PROV_ID, provId);

        return provId;
      };

      var showNotes = function() {
        var opgId = m_dialog.getId();
        return DB.getData("load[" + m_apiPath + "tesoreria/ordenpago/notes]", opgId)
          .whenSuccessWithResult(D.showNotes);
      };

      var addNote = function() {
        var opgId = m_dialog.getId();
        return D.addNote(D.Types.ORDEN_PAGO, opgId, false);
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

        total = Cairo.Database.valField(rs.getFields(), CT.OPG_TOTAL);
        nroDoc = Cairo.Database.valField(rs.getFields(), CT.OPG_NRODOC);
        proveedor = Cairo.Database.valField(rs.getFields(), C.PROV_NAME);

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

  Cairo.module("OrdenPago.List", function(List, Cairo, Backbone, Marionette, $, _) {

    var NO_ID = Cairo.Constants.NO_ID;
    var DB = Cairo.Database;
    var C_MODULE = "cOrdenPago";
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

          var editors = Cairo.Editors.ordenPagoEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.ordenPagoEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "OrdenPago",
            entityName: "ordenpago",
            entitiesName: "ordenpagos"
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
              Cairo.LoadingMessage.show("OrdenPago", "Loading Ordenes de Pago from Crowsoft Cairo server.");

              var editor = Cairo.OrdenPago.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.Tesoreria.DELETE_ORDEN_PAGO)) {
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
              DB.getAPIVersion() + "tesoreria/ordenpago", id,
              Cairo.Constants.DELETE_FUNCTION, C_MODULE).whenSuccess(closeDialog, false);
          };

          // progress message
          //
          Cairo.LoadingMessage.show("OrdenPago", "Loading Ordenes de Pago from Crowsoft Cairo server.");

          self.documentList = Cairo.OrdenPagoListDoc.Edit.Controller.getEditor();
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