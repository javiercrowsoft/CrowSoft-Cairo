(function() {
  "use strict";

  Cairo.module("Cobranza.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var TITLE = getText(2060, ""); // Cobranzas
      var SAVE_ERROR_MESSAGE = getText(2098, ""); // Error al grabar la Cobranza

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
      var getCell = Dialogs.cell;
      var val = Cairo.Util.val;
      var M = Cairo.Modal;
      var T = Dialogs.PropertyType;

      var C_MODULE = "cCobranza";

      var C_CHEQUES = "Cheques";
      var C_EFECTIVO = "Efectivo";
      var C_TARJETA = "Tarjetas";
      var C_OTROS = "Otros";
      var C_CTA_CTE = "Cuenta Corriente";
      var C_CUOTAS = "Cuotas";

      var K_NUMERO = 1;
      var K_NRO_DOC = 2;
      var K_DESCRIP = 3;
      var K_FECHA = 4;
      var K_NETO = 6;
      var K_TOTAL = 9;
      var K_CLI_ID = 10;
      var K_DOC_ID = 11;
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
      var K_CTA_CTE = 30;

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

      var m_id = 0;
      var m_numero = 0;
      var m_estado = "";
      var m_estId = 0;
      var m_nroDoc = "";
      var m_descrip = "";
      var m_fecha = null;
      var m_neto = 0;
      var m_otros = 0;
      var m_total = 0;
      var m_cobId = 0;
      var m_cobrador = "";
      var m_lgjId = 0;
      var m_legajo = "";

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
      var m_firmado;

      var m_asId = 0;

      var m_editing;

      var m_footer;
      var m_footerProps;
      var m_items;
      var m_itemsProps;
      var m_dialog;
      var m_properties;
      var m_listController = null;

      var m_lastCliId = 0;
      var m_lastCliName = "";
      
      var m_lastDocId = 0;
      var m_lastDocName = "";

      var m_lastDoctId = 0;

      var m_isNew;

      var m_chequesDeleted = "";
      var m_efectivoDeleted = "";
      var m_tarjetasDeleted = "";
      var m_otrosDeleted = "";
      var m_ctaCteDeleted = "";

      var m_copy;

      var m_docEditable;
      var m_docEditMsg = "";

      var m_taPropuesto;
      var m_taMascara = "";

      var m_orden = 0;

      var m_applyEditor = null;

      var m_lColCuotas = 0;

      var m_fvIds = [];

      var m_cliIds = [];
      var m_fvIdsxCliId = [];
      var m_cobranzaInfo;

      // automatic wizard
      //
      var m_bPushVirtualNext;
      var m_bCloseWizardAfterSave;
      var m_bWizardCompleteSuccess;

      var m_defaultCurrency = D.getDefaultCurrency();

      var m_apiPath = DB.getAPIVersion();

      var emptyData = {
        cheques: [],
        otros: [],
        efectivo: [],
        tarjetas: [],
        ctaCte: []
      };

      var m_data = emptyData;

      self.getEditorType = function() {
        return "document"
      };

      self.refresh = function() {
        load(m_id);
        refreshProperties();
      };

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

      self.terminateWizard = function(id) {
        m_id = id;
        self.terminate();
      };

      var showStartWizardWithCliente = function(cliId, f) {
        try {
          m_cliId = cliId;
          D.getClienteName(cliId).then(function(response) {
            try {
              if(response.success === true) {
                m_cliente = valField(response.data, C.CLI_NAME);
                f();
              }
            }
            catch(ex) {
              Cairo.manageErrorEx(ex.message, ex, "showStartWizardWithCliente", C_MODULE, "");
            }
          });
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "showStartWizardWithCliente", C_MODULE, "");
        }
      };

      self.showWizardCobranza = function() {
        try {
          if(initMembers()) {
            showStartWizard(false);
          }
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showWizardCobranza", C_MODULE, "");
        }
      };

      self.showCobranza = function(cliId, fvIds) {
        showStartWizardWithCliente(cliId, function() {
          m_fvIds = fvIds.slice();
          if(initMembers()) {
            showStartWizard(false);
          }
        });
      };

      self.showCobranzaEx = function(cliIds, fvIdsxCliId) {
        try {

          m_cliIds = cliIds.slice();
          m_fvIdsxCliId = fvIdsxCliId.slice();

          if(initMembers()) {
            showStartWizard(false);
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "ShowCobranzaEx", C_MODULE, "");
        }
      };

      // only for waybill
      //
      self.showCobranzaEx2 = function(cliIds, cobranzaInfo) {
        try {

          m_cliIds = cliIds.slice();
          m_cobranzaInfo = cobranzaInfo ? cobranzaInfo : null;

          if(initMembers()) {
            showStartWizard(true);
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "ShowCobranzaEx2", C_MODULE, "");
        }
      };

      var initMembers = function() {

        if(!Cairo.Security.docHasPermissionTo(
          CS.NEW_COBRANZA,
          NO_ID,
          Cairo.Security.ActionTypes.create)) {
          return false;
        }

        self.setDialog(Cairo.Dialogs.Views.Controller.newDialog());
        self.setFooter(Cairo.Dialogs.Views.Controller.newDialog());
        self.setItems(Cairo.Dialogs.Views.Controller.newDialog());

        return true;
      };

      self.copy = function() {

        if(!Cairo.Security.docHasPermissionTo(
          CS.NEW_COBRANZA,
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

        // remove all ids in grid cheques
        //
        clearCheqId();

        return D.setDocNumber(m_lastDocId, m_dialog, CT.COBZ_NRODOC).then(
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

          m_lastCliId = NO_ID;

          if(!m_docEditable) {
            if(m_docEditMsg !== "") {
              p = M.showWarning(m_docEditMsg);
            }
          }

          return p || P.resolvedPromise(true);

        }).then(function() {

            var p = null;

            var docId = getDocId();

            if(docId === NO_ID) {
              p = M.showInfo(getText(1562, ""));
            }

            return p || P.resolvedPromise(true);

          }).then(function() {

            return D.setDocNumber(m_lastDocId, m_dialog, CT.COBZ_NRODOC)

          }).then(function(enabled) {

            m_taPropuesto = enabled;
            return true;

          });

        return p;
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
        var _rtn = false;

        try {

          if(m_id === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(CT.COBRANZA);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "showDocDigital", C_MODULE, "");
        }

        return _rtn;
      };

      self.messageEx = function(messageId, info) {
        var p = null;

        switch (messageId) {
          case Dialogs.Message.MSG_DOC_FIRST:
          case Dialogs.Message.MSG_DOC_PREVIOUS:
          case Dialogs.Message.MSG_DOC_NEXT:
          case Dialogs.Message.MSG_DOC_LAST:

            p = move(messageId);
            break;

          case Dialogs.Message.MSG_DOC_SIGNATURE:

            p = signDocument();
            break;

          case Dialogs.Message.MSG_GRID_VIRTUAL_ROW:

            p = P.resolvedPromise(info);
            break;

          case Dialogs.Message.MSG_GRID_ROW_DELETED:

            switch (info) {
              case K_CHEQUES:
              case K_EFECTIVO:
              case K_TARJETA:
                showCobroNeto();
                break;

              case K_OTROS:
                showCobroOtro();
                break;
            }
            showCobroTotal();
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

            p = P.resolvedPromise(true);
            break;

          case Dialogs.Message.MSG_DOC_EX_GET_ITEMS:

            p = P.resolvedPromise(m_items);
            break;

          case Dialogs.Message.MSG_DOC_EX_GET_FOOTERS:

            p = P.resolvedPromise(m_footer);
            break;

          case Dialogs.Message.MSG_DOC_SEARCH:

            D.search(D.Types.COBRANZA, self, Cairo.bool(info));
            break;

          case Dialogs.Message.MSG_DOC_DOC_AUX:

            if(m_id) {
              D.showDocAux(m_asId, "Asiento");
            }
            else {
              p = M.showInfo(getText(1620, "")); // Debe editar un comprobante guardado para poder ver los documentos auxiliares
            }
            break;

          case Dialogs.Message.MSG_DOC_DOC_EDIT:

            if(m_id) {

              if(m_docEditable) {
                p = M.showInfo(getText(1555, "")); // Este documento puede editarse normalmente
              }
              else {

                p = D.docCanBeSaved(m_dialog, CT.COBZ_FECHA).then(function(canBeSaved) {
                  if(canBeSaved) {

                    var editDoc = new Cairo.EditDocumento.Edit.Controller.getEditor();
                    editDoc.setClient(self);
                    editDoc.edit(m_id, m_doctId, true);
                  }
                });
              }
            }
            else {
              p = M.showInfo(getText(1556, "")); // Esta opción solo sirve para modificar documentos guardados y aplicados
            }
            break;

          case Dialogs.Message.MSG_DOC_HISTORY:

            if(m_id !== NO_ID) {
              p = Cairo.History.show(Cairo.Tables.COBRANZAS, m_id, m_documento + " " + m_nroDoc);
            }
            else {
              p = M.showInfo(getText(1552, "")); // El documento aun no ha sido guardado
            }
            break;

          case Dialogs.Message.MSG_EXPORT_GET_EMAIL:

            p = D.getEmailFromCliente(getCliente().getSelectId());
            break;

          case Dialogs.Message.MSG_EXPORT_GET_FILE_NAME_POSTFIX:

            p = getFileNamePostFix();
            break;
        }

        return p || P.resolvedPromise(true);
      };

      self.discardChanges = function() {
        Cairo.raiseError("Cobranza", "DiscardChanges was called");
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

                  return D.setDocNumber(m_lastDocId, m_dialog, CT.COBZ_NRODOC)
                    .then(function(enabled) {

                      m_taPropuesto = enabled;
                    });
                });
            }

            p = p || P.resolvedPromise(true);

            p = p.then(function() {
              setEnabled();
            });

            break;

          case K_CLI_ID:

            setFilterColFactura();
            break;
        }

        return p || P.resolvedPromise(true);
      };

      self.save = function() {

        var p;

        p = D.docCanBeEdited(m_docEditable, m_docEditMsg)
          .whenSuccess(
            call(D.docCanBeSaved, m_dialog, CT.COBZ_FECHA)
          )
          .whenSuccess(function() {
            if(getCheques().getRows().count() === 0
              && getTarjetas().getRows().count() === 0
              && getOtros().getRows().count() === 0
              && getEfectivo().getRows().count() === 0
              ) {
              M.showWarning(getText(3903, "")); // El documento debe contener al menos un item
              return false;
            }
            else {
              return true;
            }
          })
          .whenSuccess(function() {
            
            var register = new DB.Register();
            var fields = register.getFields();

            register.setFieldId(CT.COBZ_ID);
            register.setTable(CT.COBRANZA);

            register.setPath(m_apiPath + "tesoreria/cobranza");

            if(m_copy) {
              register.setId(Cairo.Constants.NEW_ID);
            }
            else {
              register.setId(m_id);
            }

            if(register.getId() === Cairo.Constants.NEW_ID) {
              m_estId = D.Status.pendiente;
            }

            var _count = m_properties.size();
            for(var _i = 0; _i < _count; _i++) {

              var property = m_properties.item(_i);

              switch (property.getKey()) {
                case K_NUMERO:
                  fields.add(CT.COBZ_NUMERO, property.getValue(), Types.long);
                  break;

                case K_NRO_DOC:
                  fields.add(CT.COBZ_NRODOC, property.getValue(), Types.text);
                  break;

                case K_DESCRIP:
                  fields.add(CT.COBZ_DESCRIP, property.getValue(), Types.text);
                  break;

                case K_FECHA:
                  fields.add(CT.COBZ_FECHA, property.getValue(), Types.date);
                  break;

                case K_CLI_ID:
                  fields.add(C.CLI_ID, property.getSelectId(), Types.id);
                  break;

                case K_CCOS_ID:
                  fields.add(C.CCOS_ID, property.getSelectId(), Types.id);
                  break;

                case K_SUC_ID:
                  fields.add(C.SUC_ID, property.getSelectId(), Types.id);
                  break;

                case K_DOC_ID:
                  fields.add(C.DOC_ID, property.getSelectId(), Types.id);
                  break;

                case K_COTIZACION:
                  fields.add(CT.COBZ_COTIZACION, property.getValue(), Types.double);
                  break;

                case K_COB_ID:
                  fields.add(C.COB_ID, property.getSelectId(), Types.id);
                  break;

                case K_LGJ_ID:
                  fields.add(C.LGJ_ID, property.getSelectId(), Types.id);
                  break;
              }
            }

            var _count = m_footer.getProperties().size();
            for(var _i = 0; _i < _count; _i++) {

              property = m_footer.getProperties().item(_i);

              switch (property.getKey()) {
                case K_NETO:
                  fields.add(CT.COBZ_NETO, val(property.getValue()), Types.currency);
                  break;

                case K_OTROS:
                  fields.add(CT.COBZ_OTROS, val(property.getValue()), Types.currency);
                  break;

                case K_TOTAL:
                  fields.add(CT.COBZ_TOTAL, val(property.getValue()), Types.currency);
                  break;
              }
            }

            fields.add(CT.COBZ_GRABAR_ASIENTO, 1, Types.boolean);
            fields.add(C.EST_ID, m_estId, Types.id);

            m_orden = 0;

            saveCheques(register);
            saveEfectivo(register);
            saveOtros(register);
            saveTarjetas(register);
            saveCtaCte(register);

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

                    m_copy = false;
                    Cairo.navigate(NO_ID);

                    return load(result.data.getId()).then(
                      function(success) {

                        if(success) {

                          Cairo.navigate(self.getPath());
                          if(m_listController !== null) {
                            updateList();
                            m_listController.updateEditorKey(self, m_id);
                          }
                        }
                        m_isNew = false;
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
          });

        return p;
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

      var destroy = function() {
        try {

          m_dialog = null;
          m_properties = null;
          m_listController = null;
          m_footer = null;
          m_footerProps = null;
          m_items = null;
          m_itemsProps = null;
          m_fvIds = [];
          m_cliIds = [];
          m_fvIdsxCliId = [];
          m_cobranzaInfo = null;

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");
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

        destroy();
      };

      self.getPath = function() {
        return "#tesoreria/cobranza/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "cobranza" + id;
      };

      self.getTitle = function() {
        return TITLE + (m_id !== NO_ID ? " " + m_nroDoc + " - " + m_cliente : "");
      };

      self.getTabTitle = function() {
        return "COB-" + m_nroDoc;
      };

      self.validate = function() {

        for(var _i = 0, _count = m_properties.size(); _i < _count; _i++) {

          var property = m_properties.item(_i);

          switch (property.getKey()) {
            case K_FECHA:
              if(valEmpty(property.getValue(), Types.date)) {
                return M.showInfoWithFalse(getText(1558, "")); // Debe indicar una fecha
              }
              break;

            case K_CLI_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                return M.showInfoWithFalse(getText(1563, "")); // Debe indicar un cliente
              }
              break;

            case K_DOC_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                return M.showInfoWithFalse(getText(1562, "")); // Debe indicar un documento
              }
              break;

            case K_SUC_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                return M.showInfoWithFalse(getText(1560, "")); // Debe indicar una sucursal
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      self.isEmptyRow = function(key, row, rowIndex) {
        var isEmpty = true;
        
        try {

          switch (key) {
            case K_CHEQUES:
              isEmpty = isEmptyRowCheques(row, rowIndex);
              break;

            case K_TARJETA:
              isEmpty = isEmptyRowTarjetas(row, rowIndex);
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

      self.docId = function() {
        return m_docId;
      };

      self.nroDoc = function() {
        return m_nroDoc;
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

        return DB.getData("load[" + m_apiPath + "tesoreria/cobranza/info]", id)
          .whenSuccessWithResult(loadData, false);
      };

      self.getDialog = function() {
        return m_dialog;
      };

      self.list = function() {
        return Cairo.Security.hasPermissionTo(CS.LIST_COBRANZA);
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
            CS.LIST_COBRANZA,
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
              loadCheques(getChequesProperty());
              loadEfectivo(getEfectivoProperty());
              loadTarjetas(getTarjetasProperty());
              loadOtros(getOtrosProperty());
              loadCtaCte(getCtaCteProperty());
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

      self.columnAfterUpdate = function(key, lRow, lCol) {
        var p = null;
        try {

          switch (key) {
            case K_CHEQUES:
              p = columnAfterUpdateCheque(m_items.getProperties().item(C_CHEQUES), lRow, lCol);
              break;

            case K_TARJETA:
              p = columnAfterUpdateTarjeta(m_items.getProperties().item(C_TARJETA), lRow, lCol);
              break;

            case K_OTROS:
              p = columnAfterUpdateOtro(m_items.getProperties().item(C_OTROS), lRow, lCol);
              break;

            case K_EFECTIVO:
              p = columnAfterUpdateEfectivo(m_items.getProperties().item(C_EFECTIVO), lRow, lCol);
              break;

            case K_CTA_CTE:
              p = columnAfterUpdateCtaCte(m_items.getProperties().item(C_CTA_CTE), lRow, lCol);
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnAfterUpdate", C_MODULE, "");
        }

        return p || P.resolvedPromise(true);
      };

      self.columnAfterEdit = function(key, lRow, lCol, newValue, newValueId) {
        var p = null;

        try {

          switch (key) {
            case K_CHEQUES:
            case K_EFECTIVO:
            case K_TARJETA:
            case K_OTROS:
            case K_CTA_CTE:
              p = P.resolvedPromise(true);;
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnAfterEdit", C_MODULE, "");
        }

        return p || P.resolvedPromise(false);
      };

      self.columnBeforeEdit = function(key, lRow, lCol, iKeyAscii) {
        var rtn = false;

        try {

          switch (key) {

            case K_CHEQUES:
            case K_OTROS:
            case K_EFECTIVO:
            case K_CTA_CTE:
              rtn = true;
              break;

            case K_TARJETA:
              rtn = columnBeforeEditTarjeta(key, lRow, lCol, iKeyAscii);
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnBeforeEdit", C_MODULE, "");
        }

        return P.resolvedPromise(rtn);
      };

      var columnBeforeEditTarjeta = function(key, lRow, lCol, iKeyAscii) {

        var property = m_items.getProperties().item(C_TARJETA);
        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).getKey()) {

          case KIT_TJCCU_ID:

            var row = grid.getRows().item(lRow);
            D.setSelectFilterCuotas(row, property, m_items, KIT_TJC_ID);
            break;
        }
        return true;
      };

      self.columnButtonClick = function(key, lRow, lCol, iKeyAscii) {
        return P.resolvedPromise(false);
      };

      self.columnClick = function(key, lRow, lCol) {

      };

      self.gridDblClick = function(key, lRow, lCol) {
        return P.resolvedPromise(false);
      };

      self.deleteRow = function(key, row, lRow) {

        switch (key) {
          case K_CHEQUES:

            var id = val(getCell(row, KICH_COBZI_ID).getValue());
            if(id !== NO_ID) { m_chequesDeleted = m_chequesDeleted+ id.toString()+ ","; }
            break;

          case K_TARJETA:

            var id = val(getCell(row, KIT_COBZI_ID).getValue());
            if(id !== NO_ID) { m_tarjetasDeleted = m_tarjetasDeleted+ id.toString()+ ","; }
            break;

          case K_EFECTIVO:

            var id = val(getCell(row, KIE_COBZI_ID).getValue());
            if(id !== NO_ID) { m_efectivoDeleted = m_efectivoDeleted+ id.toString()+ ","; }
            break;

          case K_OTROS:

            var id = val(getCell(row, KIO_COBZI_ID).getValue());
            if(id !== NO_ID) { m_otrosDeleted = m_otrosDeleted+ id.toString()+ ","; }
            break;

          case K_CTA_CTE:

            var id = val(getCell(row, KIO_COBZI_ID).getValue());
            if(id !== NO_ID) { m_ctaCteDeleted = m_ctaCteDeleted+ id.toString()+ ","; }
            break;
        }

        return P.resolvedPromise(true);
      };

      self.newRow = function(key, rows) {
        return P.resolvedPromise(true);
      };

      var validateRow = function(key, row, rowIndex) {
        var p = null;

        try {

          switch (key) {

            case K_CHEQUES:
              p = validateRowCheques(row, rowIndex);
              break;

            case K_TARJETA:
              p = validateRowTarjetas(row, rowIndex);
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
        var elem;

        m_properties.clear();

        var tabs = m_dialog.getTabs();
        tabs.clear();

        tabs.add(null).setIndex(0).setName(Cairo.Constants.TAB_GENERAL);
        tabs.add(null).setIndex(1).setName(getText(1566, "")); // Adicionales
        tabs.add(null).setIndex(2).setName(getText(1861, "")); // Observaciones

        var properties = m_properties;

        elem = properties.add(null, C.DOC_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(getText(1567, "")); // Documento
        elem.setKey(K_DOC_ID);
        elem.setSelectId(m_docId);
        elem.setValue(m_documento);
        elem.setSelectFilter(D.COBRANZA_DOC_FILTER);

        elem = properties.add(null, Cairo.Constants.NUMBER_ID);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.integer);
        elem.setName(getText(1065, "")); // Número
        elem.setKey(K_NUMERO);
        elem.setValue(m_numero);
        elem.setEnabled(false);

        elem = properties.add(null, Cairo.Constants.STATUS_ID);
        elem.setType(T.text);
        elem.setName(getText(1568, "")); // Estado
        elem.setKey(K_EST_ID);
        elem.setValue(m_estado);
        elem.setEnabled(false);

        elem = properties.add(null, CT.COBZ_FECHA);
        elem.setType(T.date);
        elem.setName(getText(1569, "")); // Fecha
        elem.setKey(K_FECHA);
        elem.setValue(m_fecha);

        elem = properties.add(null, C.CLI_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CLIENTE);
        elem.setName(getText(1150, "")); // Cliente
        elem.setKey(K_CLI_ID);
        elem.setSelectId(m_cliId);
        elem.setValue(m_cliente);

        elem = properties.add(null, CT.COBZ_NRODOC);
        elem.setType(T.text);
        elem.setName(getText(1065, "")); // Número
        elem.setSize(50);
        elem.setKey(K_NRO_DOC);
        elem.setValue(m_nroDoc);
        elem.setTextMask(m_taMascara);
        elem.setTextAlign(Dialogs.TextAlign.right);

        elem = properties.add(null, C.COB_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.COBRADOR);
        elem.setName(getText(1088, "")); // Cobrador
        elem.setKey(K_COB_ID);
        elem.setSelectId(m_cobId);
        elem.setValue(m_cobrador);

        elem = properties.add(null, C.LGJ_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LEGAJOS);
        elem.setName(getText(1575, "")); // Legajo
        elem.setKey(K_LGJ_ID);
        elem.setSelectId(m_lgjId);
        elem.setValue(m_legajo);
        elem.setTabIndex(1);

        elem = properties.add(null, CT.COBZ_COTIZACION);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1635, "")); // Cotización
        elem.setFormat(Cairo.Settings.getCurrencyRateDecimalsFormat());
        elem.setKey(K_COTIZACION);
        elem.setValue(m_cotizacion);

        elem = properties.add(null, C.CCOS_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CENTROS_DE_COSTO);
        elem.setName(getText(1057, "")); // Centro de Costo
        elem.setKey(K_CCOS_ID);
        elem.setSelectId(m_ccosId);
        elem.setValue(m_centroCosto);

        elem = properties.add(null, C.SUC_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.SUCURSAL);
        elem.setName(getText(1281, "")); // Sucursal
        elem.setKey(K_SUC_ID);
        elem.setSelectId(m_sucId);
        elem.setValue(m_sucursal);

        elem = properties.add(null, CT.COBZ_DESCRIP);
        elem.setType(T.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setName(getText(1211, "")); // Observ.
        elem.setSize(5000);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);
        elem.setTabIndex(2);

        if(!m_dialog.show(self)) { return false; }

        /////////////////////////////////////////////////////////////////////
        // ITEMS
        /////////////////////////////////////////////////////////////////////

        var c_TabCheque = 0;
        var c_TabEfectivo = 1;
        var c_TabTarjeta = 2;
        var c_TabOtros = 3;
        var c_TabCtaCte = 4;

        tabs = m_items.getTabs();
        tabs.clear();

        tabs.add(null)
          .setIndex(c_TabCheque)
          .setName(getText(2099, "")); // Cheques

        tabs.add(null)
          .setIndex(c_TabEfectivo)
          .setName(getText(2100, "")); // Efectivo

        tabs.add(null)
          .setIndex(c_TabTarjeta)
          .setName(getText(2101, "")); // Tarjetas

        tabs.add(null)
          .setIndex(c_TabOtros)
          .setName(getText(1070, "")); // Otros

        tabs.add(null)
          .setIndex(c_TabCtaCte)
          .setName(getText(2102, "")); // Cta Corriente

        properties = m_itemsProps;
        properties.clear();

        elem = properties.add(null, C_CHEQUES);
        elem.setType(T.grid);
        setGridCheques(elem);
        loadCheques(elem);
        elem.setName(C_CHEQUES);
        elem.setKey(K_CHEQUES);
        elem.setTabIndex(c_TabCheque);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_chequesDeleted = "";

        elem = properties.add(null, C_EFECTIVO);
        elem.setType(T.grid);
        setGridEfectivo(elem);
        loadEfectivo(elem);
        elem.setName(C_EFECTIVO);
        elem.setKey(K_EFECTIVO);
        elem.setTabIndex(c_TabEfectivo);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_efectivoDeleted = "";

        elem = properties.add(null, C_TARJETA);
        elem.setType(T.grid);
        setGridTarjetas(elem);
        loadTarjetas(elem);
        elem.setName(C_TARJETA);
        elem.setKey(K_TARJETA);
        elem.setTabIndex(c_TabTarjeta);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_tarjetasDeleted = "";

        elem = properties.add(null, C_OTROS);
        elem.setType(T.grid);
        setGridOtros(elem);
        loadOtros(elem);
        elem.setName(C_OTROS);
        elem.setKey(K_OTROS);
        elem.setTabIndex(c_TabOtros);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_otrosDeleted = "";

        elem = properties.add(null, C_CTA_CTE);
        elem.setType(T.grid);
        setGridCtaCte(elem);
        loadCtaCte(elem);
        elem.setName(C_CTA_CTE);
        elem.setKey(K_CTA_CTE);
        elem.setTabIndex(c_TabCtaCte);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_ctaCteDeleted = "";

        if(!m_items.show(self)) { return false; }

        /////////////////////////////////////////////////////////////////////
        // FOOTER
        /////////////////////////////////////////////////////////////////////

        properties = m_footerProps;
        properties.clear();

        elem = properties.add(null, CT.COBZ_NETO);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1581, "")); // Neto
        elem.setKey(K_NETO);
        elem.setValue(m_neto);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CT.COBZ_OTROS);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1070, "")); // Otros
        elem.setKey(K_OTROS);
        elem.setValue(m_otros);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CT.COBZ_TOTAL);
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setName(getText(1584, "")); // Total
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_TOTAL);
        elem.setValue(m_total);
        elem.setEnabled(false);

        setEnabled();

        if(!m_footer.show(self)) { return false; }

        // we do this at the end to avoid showing the form before it is ready
        //
        setFilterColFactura();

        return true;
      };

      var getDocId = function() {
        return m_properties.item(C.DOC_ID).getSelectId();
      };

      var setGridOtros = function(property) {
        var grid = property.getGrid();
        var columns = grid.getColumns();
        columns.clear();
        
        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIO_COBZI_ID);

        elem = columns.add(null);
        elem.setName(getText(1267, "")); // Cuenta
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setKey(KIO_CUE_ID);
        elem.setSelectFilter(D.selectFilterForCuenta);

        elem = columns.add(null);
        elem.setName(getText(1904, "")); // Debe
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIO_DEBE);

        elem = columns.add(null);
        elem.setName(getText(1905, "")); // Haber
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIO_HABER);

        elem = columns.add(null);
        elem.setName(getText(1901, "")); // Origen
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIO_IMPORTEORIGEN);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(T.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setKey(KIO_DESCRIP);

        elem = columns.add(null);
        elem.setName(getText(1403, "")); // Retención
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.RETENCION);
        elem.setKey(KIO_RET_ID);

        elem = columns.add(null);
        elem.setName(getText(2103, "")); // C. Retención
        elem.setType(T.text);
        elem.setKey(KIO_NRORETENCION);

        elem = columns.add(null);
        elem.setName(getText(2104, "")); // % Retención
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
        elem.setKey(KIO_PORCRETENCION);

        elem = columns.add(null);
        elem.setName(getText(1634, "")); // Vto.
        elem.setType(T.date);
        elem.setKey(KIO_FECHARETENCION);

        elem = columns.add(null);
        elem.setName(getText(1057, "")); // Centro de Costo
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CENTROS_DE_COSTO);
        elem.setKey(KIO_CCOS_ID);

        elem = columns.add(null, CT.FV_ID_RET);
        elem.setName(getText(1866, "")); //  Factura
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.FACTURAS_DE_VENTA);
        elem.setKey(KIO_FV_ID_RET);

        grid.getRows().clear();
      };
      
      var loadOtros = function(property) {
        
        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear()

        for(var _i = 0, count = m_data.otros.length; _i < count; _i += 1) {

          var row = rows.add(null, getValue(m_data.otros[_i], CT.COBZI_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.otros[_i], CT.COBZI_ID));
          elem.setKey(KIO_COBZI_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.otros[_i], C.CUE_NAME));
          elem.setId(getValue(m_data.otros[_i], C.CUE_ID));
          elem.setKey(KIO_CUE_ID);

          elem = row.add(null);
          if(getValue(m_data.otros[_i], CT.COBZI_OTRO_TIPO) === CT.OtroTipo.OTRO_DEBE) {
            elem.setValue(getValue(m_data.otros[_i], CT.COBZI_IMPORTE));
          }
          else {
            elem.setValue(0);
          }
          elem.setKey(KIO_DEBE);

          elem = row.add(null);
          if(getValue(m_data.otros[_i], CT.COBZI_OTRO_TIPO) === CT.OtroTipo.OTRO_HABER) {
            elem.setValue(getValue(m_data.otros[_i], CT.COBZI_IMPORTE));
          }
          else {
            elem.setValue(0);
          }
          elem.setKey(KIO_HABER);

          elem = row.add(null);
          elem.setValue(getValue(m_data.otros[_i], CT.COBZI_IMPORTE_ORIGEN));
          elem.setKey(KIO_IMPORTEORIGEN);

          elem = row.add(null);
          elem.setValue(getValue(m_data.otros[_i], CT.COBZI_DESCRIP));
          elem.setKey(KIO_DESCRIP);

          elem = row.add(null);
          elem.setValue(getValue(m_data.otros[_i], C.RET_NAME));
          elem.setId(getValue(m_data.otros[_i], C.RET_ID));
          elem.setKey(KIO_RET_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.otros[_i], CT.COBZI_NRO_RETENCION));
          elem.setKey(KIO_NRORETENCION);

          elem = row.add(null);
          elem.setValue(getValue(m_data.otros[_i], CT.COBZI_PORC_RETENCION));
          elem.setKey(KIO_PORCRETENCION);

          elem = row.add(null);
          elem.setValue(getValue(m_data.otros[_i], CT.COBZI_FECHA_RETENCION));
          elem.setKey(KIO_FECHARETENCION);

          elem = row.add(null);
          elem.setValue(getValue(m_data.otros[_i], C.CCOS_NAME));
          elem.setId(getValue(m_data.otros[_i], C.CCOS_ID));
          elem.setKey(KIO_CCOS_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.otros[_i], Cairo.Ventas.Constants.FV_NRODOC));
          elem.setId(getValue(m_data.otros[_i], CT.FV_ID_RET));
          elem.setKey(KIO_FV_ID_RET);
        }

        return true;
      };

      var setGridCheques = function(property) {
        var grid = property.getGrid();
        var columns = grid.getColumns();
        columns.clear();
        
        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KICH_COBZI_ID);

        elem = columns.add(null);
        elem.setName(getText(1267, "")); // Cuenta
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setSelectFilter(D.selectFilterForCuentaCheques);
        elem.setKey(KICH_CUE_ID);

        elem = columns.add(null);
        elem.setName(getText(2063, "")); // Mon
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setKey(KICH_MON_ID);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1901, "")); // Origen
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KICH_IMPORTEORIGEN);

        elem = columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KICH_IMPORTE);

        elem = columns.add(null);
        elem.setName(getText(1122, "")); // Banco
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.BANCO);
        elem.setKey(KICH_BCO_ID);

        elem = columns.add(null);
        elem.setName(getText(2059, "")); // Nro. Cheque
        elem.setType(T.text);
        elem.setKey(KICH_CHEQUE);

        elem = columns.add(null);
        elem.setName(getText(2058, "")); // Cheque
        elem.setType(T.text);
        elem.setKey(KICH_CHEQ_ID);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(3719, "")); // Propio
        elem.setType(T.check);
        elem.setKey(KICH_PROPIO);

        elem = columns.add(null);
        elem.setName(getText(2065, "")); // Depositar el
        elem.setType(T.date);
        elem.setDefaultValue(Grids.createCell());
        var defaultValue = elem.getDefaultValue();
        defaultValue.setValue(Cairo.Dates.today());
        elem.setKey(KICH_FECHACOBRO);

        elem = columns.add(null);
        elem.setName(getText(1634, "")); // Vto.
        elem.setType(T.date);
        elem.setDefaultValue(Grids.createCell());
        var defaultValue = elem.getDefaultValue();
        defaultValue.setValue(Cairo.Dates.DateNames.addToDate("m", 1, Cairo.Dates.today()));
        elem.setKey(KICH_FECHAVTO);

        elem = columns.add(null);
        elem.setName(getText(1083, "")); // Clering
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CLEARING);
        elem.setKey(KICH_CLE_ID);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(T.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setKey(KICH_DESCRIP);

        grid.getRows().clear();
      };
      
      var loadCheques = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();

        for(var _i = 0, count = m_data.cheques.length; _i < count; _i += 1) {

          var row = rows.add(null, getValue(m_data.cheques[_i], CT.COBZI_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.cheques[_i], CT.COBZI_ID));
          elem.setKey(KICH_COBZI_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cheques[_i], C.CUE_NAME));
          elem.setId(getValue(m_data.cheques[_i], C.CUE_ID));
          elem.setKey(KICH_CUE_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cheques[_i], C.MON_NAME));
          elem.setId(getValue(m_data.cheques[_i], C.MON_ID));
          elem.setKey(KICH_MON_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cheques[_i], CT.COBZI_IMPORTE_ORIGEN));
          elem.setKey(KICH_IMPORTEORIGEN);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cheques[_i], CT.COBZI_IMPORTE));
          elem.setKey(KICH_IMPORTE);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cheques[_i], C.BCO_NAME));
          elem.setId(getValue(m_data.cheques[_i], C.BCO_ID));
          elem.setKey(KICH_BCO_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cheques[_i], CT.CHEQ_NUMERO_DOC));
          elem.setKey(KICH_CHEQUE);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cheques[_i], CT.CHEQ_NUMERO));
          elem.setId(getValue(m_data.cheques[_i], CT.CHEQ_ID));
          elem.setKey(KICH_CHEQ_ID);

          elem = row.add(null);
          elem.setId(getValue(m_data.cheques[_i], CT.CHEQ_PROPIO));
          elem.setKey(KICH_PROPIO);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cheques[_i], CT.CHEQ_FECHA_COBRO));
          elem.setKey(KICH_FECHACOBRO);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cheques[_i], CT.CHEQ_FECHA_VTO));
          elem.setKey(KICH_FECHAVTO);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cheques[_i], C.CLE_NAME));
          elem.setId(getValue(m_data.cheques[_i], C.CLE_ID));
          elem.setKey(KICH_CLE_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cheques[_i], CT.COBZI_DESCRIP));
          elem.setKey(KICH_DESCRIP);
        }

        return true;
      };

      var setGridEfectivo = function(property) {
        var grid = property.getGrid();
        var columns = grid.getColumns();
        columns.clear();

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIE_COBZI_ID);

        elem = columns.add(null);
        elem.setName(getText(1267, "")); // Cuenta
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setSelectFilter(D.selectFilterForCuentaEfectivo);
        elem.setKey(KIE_CUE_ID);

        elem = columns.add(null);
        elem.setName(getText(2063, "")); // Mon
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setKey(KIE_MON_ID);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1901, "")); // Origen
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIE_IMPORTEORIGEN);

        elem = columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIE_IMPORTE);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(T.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setKey(KIE_DESCRIP);

        grid.getRows().clear();
      };

      var loadEfectivo = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();

        for(var _i = 0, count = m_data.efectivo.length; _i < count; _i += 1) {

          var row = rows.add(null, getValue(m_data.efectivo[_i], CT.COBZI_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.efectivo[_i], CT.COBZI_ID));
          elem.setKey(KIE_COBZI_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.efectivo[_i], C.CUE_NAME));
          elem.setId(getValue(m_data.efectivo[_i], C.CUE_ID));
          elem.setKey(KIE_CUE_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.efectivo[_i], C.MON_NAME));
          elem.setId(getValue(m_data.efectivo[_i], C.MON_ID));
          elem.setKey(KIE_MON_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.efectivo[_i], CT.COBZI_IMPORTE_ORIGEN));
          elem.setKey(KIE_IMPORTEORIGEN);

          elem = row.add(null);
          elem.setValue(getValue(m_data.efectivo[_i], CT.COBZI_IMPORTE));
          elem.setKey(KIE_IMPORTE);

          elem = row.add(null);
          elem.setValue(getValue(m_data.efectivo[_i], CT.COBZI_DESCRIP));
          elem.setKey(KIE_DESCRIP);
        }

        return true;
      };

      var setGridTarjetas = function(property) {
        var grid = property.getGrid();
        var columns = grid.getColumns();
        columns.clear();

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIT_COBZI_ID);

        elem = columns.add(null);
        elem.setName(getText(1065, "")); // Número
        elem.setType(T.text);
        elem.setKey(KIT_TJCC_ID);

        elem = columns.add(null);
        elem.setName(getText(2105, "")); // Cupon
        elem.setType(T.text);
        elem.setKey(KIT_CUPON);

        elem = columns.add(null);
        elem.setName(getText(2106, "")); // Tarjeta
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.TARJETA_DE_CREDITO);
        elem.setKey(KIT_TJC_ID);

        elem = columns.add(null, C_CUOTAS);
        elem.setName(getText(1473, "")); // Cuotas
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUOTAS_DE_TARJETA_DE_CREDITO);
        elem.setKey(KIT_TJCCU_ID);
        m_lColCuotas = columns.count();

        elem = columns.add(null);
        elem.setName(getText(2063, "")); // Mon
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setKey(KIT_MON_ID);

        elem = columns.add(null);
        elem.setName(getText(1901, "")); // Origen
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIT_IMPORTEORIGEN);

        elem = columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIT_IMPORTE);

        elem = columns.add(null);
        elem.setName(getText(1634, "")); // Vto.
        elem.setType(T.date);
        elem.setDefaultValue(Grids.createCell());
        var defaultValue = elem.getDefaultValue();
        defaultValue.setValue(Cairo.Dates.DateNames.addToDate("d", 1, Cairo.Dates.today()));
        elem.setKey(KIT_FECHAVTO);

        elem = columns.add(null);
        elem.setName(getText(2107, "")); // Nro. Tarjeta
        elem.setType(T.text);
        elem.setKey(KIT_NROTARJETA);

        elem = columns.add(null);
        elem.setName(getText(2123, "")); // Cod. Autoriz.
        elem.setType(T.text);
        elem.setKey(KIT_NROAUTORIZACION);

        elem = columns.add(null);
        elem.setName(getText(2108, "")); // Operacion
        elem.setType(T.list);
        elem.setDefaultValue(Grids.createCell());
        var defaultValue = elem.getDefaultValue();
        defaultValue.setId(CT.CuponTipo.CUPON_POSNET);
        elem.setKey(KIT_TARJETA_TIPO);

        var list = elem.getList();
        list.add(null)
          .setId(CT.CuponTipo.CUPON_POSNET)
          .setValue(getText(2110, "")); // Posnet
        list.add(null)
          .setId(CT.CuponTipo.CUPON_MANUAL)
          .setValue(getText(2111, "")); // Manual

        elem = columns.add(null);
        elem.setName(getText(2109, "")); // Titular
        elem.setType(T.text);
        elem.setKey(KIT_TITULAR);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(T.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setKey(KIT_DESCRIP);

        grid.getRows().clear();
      }
      
      var loadTarjetas = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        for(var _i = 0, count = m_data.tarjetas.length; _i < count; _i += 1) {

          var row = rows.add(null, getValue(m_data.tarjetas[_i], CT.COBZI_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.tarjetas[_i], CT.COBZI_ID));
          elem.setKey(KIT_COBZI_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.tarjetas[_i], CT.TJCC_NUMERO));
          elem.setId(getValue(m_data.tarjetas[_i], CT.TJCC_ID));
          elem.setKey(KIT_TJCC_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.tarjetas[_i], CT.TJCC_NUMERO_DOC));
          elem.setKey(KIT_CUPON);

          elem = row.add(null);
          elem.setValue(getValue(m_data.tarjetas[_i], C.TJC_NAME));
          elem.setId(getValue(m_data.tarjetas[_i], C.TJC_ID));
          elem.setKey(KIT_TJC_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.tarjetas[_i], C.TJCCU_CANTIDAD));
          elem.setId(getValue(m_data.tarjetas[_i], C.TJCCU_ID));
          elem.setKey(KIT_TJCCU_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.tarjetas[_i], C.MON_NAME));
          elem.setId(getValue(m_data.tarjetas[_i], C.MON_ID));
          elem.setKey(KIT_MON_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.tarjetas[_i], CT.COBZI_IMPORTE_ORIGEN));
          elem.setKey(KIT_IMPORTEORIGEN);

          elem = row.add(null);
          elem.setValue(getValue(m_data.tarjetas[_i], CT.COBZI_IMPORTE));
          elem.setKey(KIT_IMPORTE);

          elem = row.add(null);
          elem.setValue(getValue(m_data.tarjetas[_i], CT.TJCC_FECHA_VTO));
          elem.setKey(KIT_FECHAVTO);

          elem = row.add(null);
          elem.setValue(getValue(m_data.tarjetas[_i], CT.TJCC_NRO_TARJETA));
          elem.setKey(KIT_NROTARJETA);

          elem = row.add(null);
          elem.setValue(getValue(m_data.tarjetas[_i], CT.TJCC_NRO_AUTORIZACION));
          elem.setKey(KIT_NROAUTORIZACION);

          elem = row.add(null);
          elem.setId(getValue(m_data.tarjetas[_i], CT.COBZI_TARJETA_TIPO));
          elem.setKey(KIT_TARJETA_TIPO);

          elem = row.add(null);
          elem.setValue(getValue(m_data.tarjetas[_i], CT.TJCC_TITULAR));
          elem.setKey(KIT_TITULAR);

          elem = row.add(null);
          elem.setValue(getValue(m_data.tarjetas[_i], CT.COBZI_DESCRIP));
          elem.setKey(KIT_DESCRIP);
        }

        return true;
      };

      var setGridCtaCte = function(property) {
        var grid = property.getGrid();
        var columns = grid.getColumns();
        columns.clear();                        

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KICC_COBZI_ID);

        elem = columns.add(null);
        elem.setName(getText(1267, "")); // Cuenta
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setKey(KICC_CUE_ID);

        elem = columns.add(null);
        elem.setName(getText(1901, "")); // Origen
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KICC_IMPORTEORIGEN);

        elem = columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KICC_IMPORTE);

        grid.getRows().clear();
      }
      
      var loadCtaCte = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();

        for(var _i = 0, count = m_data.ctaCte.length; _i < count; _i += 1) {

          var row = rows.add(null, getValue(m_data.ctaCte[_i], CT.COBZI_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.ctaCte[_i], CT.COBZI_ID));
          elem.setKey(KICC_COBZI_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.ctaCte[_i], C.CUE_NAME));
          elem.setId(getValue(m_data.ctaCte[_i], C.CUE_ID));
          elem.setKey(KICC_CUE_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.ctaCte[_i], CT.COBZI_IMPORTE_ORIGEN));
          elem.setKey(KICC_IMPORTEORIGEN);

          elem = row.add(null);
          elem.setValue(getValue(m_data.ctaCte[_i], CT.COBZI_IMPORTE));
          elem.setKey(KICC_IMPORTE);
        }

        return true;
      };

      var loadDataFromResponse = function(response) {
        var data = response.data;

        data.cheques = data.get('cheques');
        data.otros = data.get('otros');
        data.efectivo = data.get('efectivo');
        data.tarjetas = data.get('tarjetas');
        data.ctaCte = data.get('cuenta_corriente');

        return data;
      };

      var load = function(id) {
        m_data = emptyData;
       
        return Cairo.Database.getData("load[" + m_apiPath + "tesoreria/cobranza]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            var p = null;

            if(response.data.id !== NO_ID) {

              m_data = loadDataFromResponse(response);

              var data = response.data;

              m_id = valField(data, CT.COBZ_ID);
              m_numero = valField(data, CT.COBZ_NUMERO);
              m_nroDoc = valField(data, CT.COBZ_NRODOC);
              m_descrip = valField(data, CT.COBZ_DESCRIP);
              m_fecha = valField(data, CT.COBZ_FECHA);
              m_neto = valField(data, CT.COBZ_NETO);
              m_total = valField(data, CT.COBZ_TOTAL);
              m_otros = valField(data, CT.COBZ_OTROS);
              m_cotizacion = valField(data, CT.COBZ_COTIZACION);
              m_cliId = valField(data, C.CLI_ID);
              m_cliente = valField(data, C.CLI_NAME);
              m_ccosId = valField(data, C.CCOS_ID);
              m_centroCosto = valField(data, C.CCOS_NAME);
              m_sucId = valField(data, C.SUC_ID);
              m_sucursal = valField(data, C.SUC_NAME);
              m_docId = valField(data, C.DOC_ID);
              m_documento = valField(data, C.DOC_NAME);
              m_doctId = valField(data, C.DOCT_ID);
              m_cobId = valField(data, C.COB_ID);
              m_cobrador = valField(data, C.COB_NAME);
              m_lgjId = valField(data, C.LGJ_ID);
              m_legajo = valField(data, C.LGJ_CODE);
              m_estId = valField(data, C.EST_ID);
              m_estado = valField(data, C.EST_NAME);
              m_firmado = valField(data, CT.COBZ_FIRMADO);
              m_docEditable = valField(data, C.DOC_EDITABLE);
              m_docEditMsg = valField(data, C.DOC_EDIT_MSG);

              m_asId = valField(data, C.AS_ID);

              m_taPropuesto = valField(data, C.TA_PROPUESTO);
              m_taMascara = valField(data, C.TA_MASCARA);

              m_lastDocId = m_docId;
              m_lastDoctId = m_doctId;
              m_lastCliId = m_cliId;
              m_lastDocName = m_documento;
              m_lastCliName = m_cliente;

            }
            else {
              m_id = NO_ID;
              m_numero = 0;
              m_nroDoc = "";
              m_descrip = "";
              m_fecha = Cairo.Dates.today();
              m_neto = 0;
              m_total = 0;
              m_otros = 0;
              m_ccosId = NO_ID;
              m_centroCosto = "";
              m_doctId = NO_ID;
              m_cobId = NO_ID;
              m_cobrador = "";
              m_lgjId = NO_ID;
              m_legajo = "";
              m_cotizacion = 0;
              m_estId = NO_ID;
              m_estado = "";
              m_sucId = Cairo.User.getSucId();
              m_sucursal = Cairo.User.getSucName();
              m_firmado = false;

              m_asId = NO_ID;

              m_taPropuesto = false;
              m_taMascara = "";

              m_docId = m_lastDocId;
              m_cliId = m_lastCliId;
              m_cliente = m_lastCliName;
              m_documento = m_lastDocName;

              m_data = emptyData;

              p = p || P.resolvedPromise(true);

              p = p
                .then(P.call(D.editableStatus, m_docId, CS.NEW_COBRANZA))
                .then(function(status) {
                  m_docEditable = status.editableStatus;
                  m_docEditMsg = status.message;
                  return true;
                });
            }

            return p || P.resolvedPromise(true);
          });
      };

      self.setFooter = function(footer) {
        m_footer = footer;
        m_footerProps = footer.getProperties();

        if(footer !== null) {
          m_footer.setIsDocument(true);
          m_footer.setIsFooter(true);
          m_footer.setView(m_dialog.getView());
        }
      };

      self.setItems = function(items) {
        m_items = items;
        m_itemsProps = m_items.getProperties();

        if(items !== null) {
          m_items.setIsDocument(true);
          m_items.setIsItems(true);
          m_items.setView(m_dialog.getView());
        }
      };

      var setEnabled = function() {
        var bState = false;

        if(m_docEditable && (!m_isNew || m_copy)) {
          bState = getDocId() !== NO_ID;
        }

        var _count = m_properties.size();
        for(var _i = 0; _i < _count; _i++) {
          var prop = m_properties.item(_i);
          if(prop.getKey() !== K_DOC_ID
            && prop.getKey() !== K_NUMERO
            && prop.getKey() !== K_EST_ID) {

            if(bState) {
              if(prop.getKey() !== K_NRO_DOC) {
                prop.setEnabled(true);
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

        var _count = m_itemsProps.size();
        for(var _i = 0; _i < _count; _i++) {
          m_items.getProperties().item(_i).setEnabled(bState);
        }

        m_items.refreshEnabledState(m_itemsProps);
        m_dialog.refreshEnabledState(m_properties);
      };

      var getCueIdCliente = function() {

        var getCueId = function(response) {

          try {

            var cueId = valField(response.data, C.CUE_ID);
            var monId = valField(response.data, C.MON_ID);

            return { success: true, monId: monId, cueId: cueId };
          }
          catch(ex) {
            Cairo.manageErrorEx(ex.message, ex, "getCueIdCliente", C_MODULE, "");
          }

          return { success: false };
        };

        var p = DB.getData(
            "load[" + m_apiPath + "documento/" + m_lastDocId.toString() + "/customer/" + m_lastCliId.toString() + "/account]")
          .whenSuccessWithResult(getCueId, false);

        return p;
      };

      // TODO: dry this method it is copied in all documents
      //
      var signDocument = function() {

        if(m_id === NO_ID) {
          return M.showWarningWithFalse(getText(1592, ""));
          // Antes de poder firmar el documento debe guardarlo.
        }

        var refreshState = function(response) {

          m_estId = response.est_id;
          m_estado = response.estado;
          m_firmado = response.firmado;

          var prop = m_properties.item(Cairo.Constants.STATUS_ID);

          prop.setSelectId(m_estId);
          prop.setValue(m_estado);

          m_dialog.showValue(prop);
        };

        var p = null;

        if(m_firmado) {
          p = M.confirmViewYesDefault(
            getText(1594, ""), // Firmar
            getText(1593, "")  // El documento ya ha sido firmado desea borrar la firma
          );
        }

        p = p || P.resolvedPromise(true);

        p = p
          .whenSuccess(D.signDocument(m_doctId, m_id))
          .whenSuccessWithResult(refreshState);

        return p;
      };

      var move = function(moveTo) {
        var docId = getDocId();

        if(docId === NO_ID) {
          return M.showInfoWithFalse(
            getText(1595, "") // Debe seleccionar un documento
          );
        }

        var completeMove = function(response) {
          // id === NO_ID means this document doesn't have any transaction
          //
          if(response.id === NO_ID) {

            m_lastCliId = NO_ID;
            m_lastCliName = "";

            return load(NO_ID)
              .whenSuccess(call(D.setDocNumber, m_docId, m_dialog, CT.COBZ_NRODOC))
              .then(function(enabled) { m_taPropuesto = enabled; })
              .then(refreshProperties);
          }
          else {
            return load(response.id)
              .whenSuccess(refreshProperties);
          }
        };
        return D.move(m_docId, moveTo)
          .whenSuccessWithResult(completeMove);
      };

      var refreshProperties = function() {

        var properties = m_dialog.getProperties();

        properties.item(C.DOC_ID)
          .setSelectId(m_docId)
          .setValue(m_documento);

        properties.item(CT.COBZ_FECHA)
          .setValue(m_fecha);

        properties.item(C.CLI_ID)
          .setSelectId(m_cliId)
          .setValue(m_cliente);

        properties.item(Cairo.Constants.NUMBER_ID)
          .setValue(m_numero);

        properties.item(Cairo.Constants.STATUS_ID)
          .setValue(m_estado);

        properties.item(CT.COBZ_NRODOC)
          .setValue(m_nroDoc)
          .setTextMask(m_taMascara)
          .setTextAlign(Dialogs.TextAlign.right);

        properties.item(C.COB_ID)
          .setSelectId(m_cobId)
          .setValue(m_cobrador);

        properties.item(CT.COBZ_COTIZACION)
          .setValue(m_cotizacion);

        properties.item(C.CCOS_ID)
          .setSelectId(m_ccosId)
          .setValue(m_centroCosto);

        properties.item(C.SUC_ID)
          .setSelectId(m_sucId)
          .setValue(m_sucursal);

        properties.item(C.LGJ_ID)
          .setSelectId(m_lgjId)
          .setValue(m_legajo);

        properties.item(CT.COBZ_DESCRIP)
          .setValue(m_descrip);

        m_dialog.showValues(m_dialog.getProperties());
        m_dialog.resetChanged();

        m_chequesDeleted = "";
        m_efectivoDeleted = "";
        m_tarjetasDeleted = "";
        m_otrosDeleted = "";
        m_ctaCteDeleted = "";

        loadCheques(getChequesProperty());
        loadEfectivo(getEfectivoProperty());
        loadTarjetas(getTarjetasProperty());
        loadOtros(getOtrosProperty());
        loadCtaCte(getCtaCteProperty());

        m_items.showValues(m_itemsProps);

        setFilterColFactura();

        m_footerProps.item(CT.COBZ_OTROS)
          .setValue(m_otros);

        m_footerProps.item(CT.COBZ_NETO)
          .setValue(m_neto);

        m_footerProps.item(CT.COBZ_TOTAL)
          .setValue(m_total);

        m_footer.showValues(m_footerProps);

        setEnabled();
      };

      var startWizard = function(wizard, wizardConstructor, isHojaRuta) {
        wizard.setCliId(m_cliId);
        wizard.setCliente(m_cliente);
        wizard.setFvIds(m_fvIds);
        wizard.setCliIds(m_cliIds);
        wizard.setFvIdsxCliId(m_fvIdsxCliId);
        wizard.setIsHojaRuta(isHojaRuta);
        wizard.setCobranzaInfo(m_cobranzaInfo);
        wizard.setObjClient(self);

        var wizardDialog = Cairo.Dialogs.WizardViews.Controller.newWizard();
        wizardDialog.setClient(wizard);
        wizardDialog.setPushVirtualNext(m_bPushVirtualNext);
        wizardDialog.setCloseWizardAfterSave(m_bCloseWizardAfterSave);
        wizardDialog.show(wizardConstructor);
      };

      var showStartWizard = function(isHojaRuta) {
        try {
          var wizConstructor = Cairo.CobranzaWizard.Edit.Controller.getEditor;
          var wizard = wizConstructor();
          wizard.loadWizard().whenSuccess(call(startWizard, wizard, wizConstructor, isHojaRuta));
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "showStartWizard", C_MODULE, "");
        }
      };

      var initialize = function() {
        try {

          m_fvIds = [];
          m_cliIds = [];
          m_fvIdsxCliId = [];

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "initialize", C_MODULE, "");
        }
      };

      var saveCheques = function(mainRegister) {
        
        var transaction = DB.createTransaction();

        transaction.setTable(CT.COBRANZA_ITEM_CHEQUE_TMP);

        var rows = getCheques().getRows();
        
        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {
          
          var row = rows.item(_i);

          var register = new DB.Register();
          register.setFieldId(CT.COBZI_TMP_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var fields = register.getFields();

          var _countj = row.size();
          for(var _j = 0; _j < _countj; _j++) {

            var cell = row.item(_j);
            switch (cell.getKey()) {

              case KICH_COBZI_ID:
                if(m_copy) {
                  fields.add(CT.COBZI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(CT.COBZI_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KICH_DESCRIP:
                fields.add(CT.COBZI_DESCRIP, cell.getValue(), Types.text);
                break;

              case KICH_CHEQ_ID:
                fields.add(C.CHEQ_ID, cell.getId(), Types.id);
                break;

              case KICH_CHEQUE:
                fields.add(CT.COBZI_TMP_CHEQUE, cell.getValue(), Types.text);
                break;

              case KICH_CLE_ID:
                fields.add(C.CLE_ID, cell.getId(), Types.id);
                break;

              case KICH_BCO_ID:
                fields.add(C.BCO_ID, cell.getId(), Types.id);
                break;

              case KICH_MON_ID:
                fields.add(C.MON_ID, cell.getId(), Types.id);
                break;

              case KICH_PROPIO:
                fields.add(CT.COBZI_TMP_PROPIO, cell.getId(), Types.boolean);
                break;

              case KICH_FECHACOBRO:
                fields.add(CT.COBZI_TMP_FECHA_COBRO, cell.getValue(), Types.date);
                break;

              case KICH_FECHAVTO:
                fields.add(CT.COBZI_TMP_FECHA_VTO, cell.getValue(), Types.date);
                break;

              case KICH_CUE_ID:
                fields.add(C.CUE_ID, cell.getId(), Types.id);
                break;

              case KICH_IMPORTEORIGEN:
                fields.add(CT.COBZI_IMPORTE_ORIGEN, val(cell.getValue()), Types.currency);
                break;

              case KICH_IMPORTE:
                fields.add(CT.COBZI_IMPORTE, val(cell.getValue()), Types.currency);
                break;
            }
          }

          m_orden = m_orden + 1;
          fields.add(CT.COBZI_ORDEN, m_orden, Types.integer);
          fields.add(CT.COBZI_TIPO, CT.CobranzaItemTipo.ITEM_CHEQUES, Types.integer);
          fields.add(CT.COBZI_OTRO_TIPO, CT.OtroTipo.OTRO_DEBE, Types.integer);

          transaction.addRegister(register);
        }

        if(m_chequesDeleted !== "" && m_id !== NO_ID && !m_copy) {

          transaction.setDeletedList(m_chequesDeleted);
        }

        mainRegister.addTransaction(transaction);
      };

      var saveTarjetas = function(mainRegister) {

        var transaction = DB.createTransaction();

        transaction.setTable(CT.COBRANZA_ITEM_TARJETA_TMP);

        var rows = getTarjetas().getRows();
          
        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();
          register.setFieldId(CT.COBZI_TMP_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var fields = register.getFields();

          var _countj = row.size();
          for(var _j = 0; _j < _countj; _j++) {

            var cell = row.item(_j);
            switch (cell.getKey()) {

              case KIT_COBZI_ID:
                if(m_copy) {
                  fields.add(CT.COBZI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(CT.COBZI_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KIT_DESCRIP:
                fields.add(CT.COBZI_DESCRIP, cell.getValue(), Types.text);
                break;

              case KIT_TJCC_ID:
                fields.add(CT.TJCC_ID, cell.getId(), Types.id);
                break;

              case KIT_CUPON:
                fields.add(CT.COBZI_TMP_CUPON, cell.getValue(), Types.text);
                break;

              case KIT_TJC_ID:
                fields.add(C.TJC_ID, cell.getId(), Types.id);
                break;

              case KIT_TJCCU_ID:
                fields.add(C.TJCCU_ID, cell.getId(), Types.id);
                break;

              case KIT_MON_ID:
                fields.add(C.MON_ID, cell.getId(), Types.id);
                break;

              case KIT_FECHAVTO:
                fields.add(CT.COBZI_TMP_FECHA_VTO, cell.getValue(), Types.date);
                break;

              case KIT_TITULAR:
                fields.add(CT.COBZI_TMP_TITULAR, cell.getValue(), Types.text);
                break;

              case KIT_NROTARJETA:
                fields.add(CT.COBZI_TMP_NRO_TARJETA, cell.getValue(), Types.text);
                break;

              case KIT_NROAUTORIZACION:
                fields.add(CT.COBZI_TMP_AUTORIZACION, cell.getValue(), Types.text);
                break;

              case KIT_TARJETA_TIPO:
                fields.add(CT.COBZI_TARJETA_TIPO, cell.getId(), Types.long);
                break;

              case KIT_IMPORTEORIGEN:
                fields.add(CT.COBZI_IMPORTE_ORIGEN, val(cell.getValue()), Types.currency);
                break;

              case KIT_IMPORTE:
                fields.add(CT.COBZI_IMPORTE, val(cell.getValue()), Types.currency);
                break;
            }
          }

          m_orden = m_orden + 1;
          fields.add(CT.COBZI_ORDEN, m_orden, Types.integer);
          fields.add(CT.COBZI_TIPO, CT.CobranzaItemTipo.ITEM_TARJETA, Types.integer);
          fields.add(CT.COBZI_OTRO_TIPO, CT.OtroTipo.OTRO_DEBE, Types.integer);

          transaction.addRegister(register);
        }

        if(m_tarjetasDeleted !== "" && m_id !== NO_ID && !m_copy) {

          transaction.setDeletedList(m_tarjetasDeleted);
        }

        mainRegister.addTransaction(transaction);
      };

      var saveOtros = function(mainRegister) {

        var transaction = DB.createTransaction();

        transaction.setTable(CT.COBRANZA_ITEM_OTRO_TMP);

        var rows = getOtros().getRows();
          
        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {
          
          var row = rows.item(_i);

          var register = new DB.Register();
          register.setFieldId(CT.COBZI_TMP_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var fields = register.getFields();

          var _countj = row.size();
          for(var _j = 0; _j < _countj; _j++) {

            var cell = row.item(_j);
            switch (cell.getKey()) {

              case KIO_COBZI_ID:
                if(m_copy) {
                  fields.add(CT.COBZI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(CT.COBZI_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KIO_DESCRIP:
                fields.add(CT.COBZI_DESCRIP, cell.getValue(), Types.text);
                break;

              case KIO_RET_ID:
                fields.add(C.RET_ID, cell.getId(), Types.id);
                break;

              case KIO_NRORETENCION:
                fields.add(CT.COBZI_NRO_RETENCION, cell.getValue(), Types.text);
                break;

              case KIO_PORCRETENCION:
                fields.add(CT.COBZI_PORC_RETENCION, val(cell.getValue()), Types.double);
                break;

              case KIO_CCOS_ID:
                fields.add(C.CCOS_ID, cell.getId(), Types.id);
                break;

              case KIO_FV_ID_RET:
                fields.add(CT.FV_ID_RET, cell.getId(), Types.id);
                break;

              case KIO_CUE_ID:
                fields.add(C.CUE_ID, cell.getId(), Types.id);
                break;

              case KIO_FECHARETENCION:
                fields.add(CT.COBZI_FECHA_RETENCION, cell.getValue(), Types.date);
                break;

              case KIO_IMPORTEORIGEN:
                fields.add(CT.COBZI_IMPORTE_ORIGEN, val(cell.getValue()), Types.currency);
                break;

              case KIO_DEBE:
                if(val(cell.getValue()) !== 0) {
                  fields.add(CT.COBZI_IMPORTE, val(cell.getValue()), Types.currency);
                  fields.add(CT.COBZI_OTRO_TIPO, CT.OtroTipo.OTRO_DEBE, Types.integer);
                }
                break;

              case KIO_HABER:
                if(val(cell.getValue()) !== 0) {
                  fields.add(CT.COBZI_IMPORTE, val(cell.getValue()), Types.currency);
                  fields.add(CT.COBZI_OTRO_TIPO, CT.OtroTipo.OTRO_HABER, Types.integer);
                }
                break;
            }
          }

          m_orden = m_orden + 1;
          fields.add(CT.COBZI_ORDEN, m_orden, Types.integer);
          fields.add(CT.COBZI_TIPO, CT.CobranzaItemTipo.ITEM_OTROS, Types.integer);

          transaction.addRegister(register);
        }

        if(m_otrosDeleted !== "" && m_id !== NO_ID && !m_copy) {

          transaction.setDeletedList(m_otrosDeleted);
        }

        mainRegister.addTransaction(transaction);
      };

      var saveEfectivo = function(mainRegister) {

        var transaction = DB.createTransaction();

        transaction.setTable(CT.COBRANZA_ITEM_EFECTIVO_TMP);

        var rows = getEfectivo().getRows();
          
        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {
          
          var row = rows.item(_i);

          var register = new DB.Register();
          register.setFieldId(CT.COBZI_TMP_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var fields = register.getFields();

          var _countj = row.size();
          for(var _j = 0; _j < _countj; _j++) {

            var cell = row.item(_j);
            switch (cell.getKey()) {

              case KIE_COBZI_ID:
                if(m_copy) {
                  fields.add(CT.COBZI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(CT.COBZI_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KIE_DESCRIP:
                fields.add(CT.COBZI_DESCRIP, cell.getValue(), Types.text);
                break;

              case KIE_CUE_ID:
                fields.add(C.CUE_ID, cell.getId(), Types.id);
                break;

              case KIE_IMPORTEORIGEN:
                fields.add(CT.COBZI_IMPORTE_ORIGEN, val(cell.getValue()), Types.currency);
                break;

              case KIE_IMPORTE:
                fields.add(CT.COBZI_IMPORTE, val(cell.getValue()), Types.currency);
                break;
            }
          }

          m_orden = m_orden + 1;
          fields.add(CT.COBZI_ORDEN, m_orden, Types.integer);
          fields.add(CT.COBZI_TIPO, CT.CobranzaItemTipo.ITEM_EFECTIVO, Types.integer);
          fields.add(CT.COBZI_OTRO_TIPO, CT.OtroTipo.OTRO_DEBE, Types.integer);

          transaction.addRegister(register);
        }

        if(m_efectivoDeleted !== "" && m_id !== NO_ID && !m_copy) {

          transaction.setDeletedList(m_efectivoDeleted);
        }

        mainRegister.addTransaction(transaction);
      };

      var saveCtaCte = function(mainRegister) {

        var transaction = DB.createTransaction();

        transaction.setTable(CT.COBRANZA_ITEM_CUENTA_CORRIENTE_TMP);

        var rows = getCtaCte().getRows();
          
        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {
          
          var row = rows.item(_i);

          var register = new DB.Register();
          register.setFieldId(CT.COBZI_TMP_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var fields = register.getFields();

          var _countj = row.size();
          for(var _j = 0; _j < _countj; _j++) {

            var cell = row.item(_j);
            switch (cell.getKey()) {

              case KICC_COBZI_ID:
                if(m_copy) {
                  fields.add(CT.COBZI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(CT.COBZI_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KICC_CUE_ID:
                fields.add(C.CUE_ID, cell.getId(), Types.id);
                break;

              case KICC_IMPORTEORIGEN:
                fields.add(CT.COBZI_IMPORTE_ORIGEN, val(cell.getValue()), Types.currency);
                break;

              case KICC_IMPORTE:
                fields.add(CT.COBZI_IMPORTE, val(cell.getValue()), Types.currency);
                break;
            }
          }

          m_orden = m_orden + 1;
          fields.add(CT.COBZI_ORDEN, m_orden, Types.integer);
          fields.add(CT.COBZI_TIPO, CT.CobranzaItemTipo.ITEM_CTA_CTE, Types.integer);
          fields.add(CT.COBZI_OTRO_TIPO, CT.OtroTipo.OTRO_HABER, Types.integer);

          transaction.addRegister(register);
        }

        if(m_ctaCteDeleted !== "" && m_id !== NO_ID && !m_copy) {

          transaction.setDeletedList(m_ctaCteDeleted);
        }

        mainRegister.addTransaction(transaction);
      };

      var showApply = function() {

        if(!Cairo.Security.docHasPermissionTo(
          CS.MODIFY_APLIC,
          m_docId,
          Cairo.Security.ActionTypes.apply)) {
          return false;
        }
        
        if(m_applyEditor === null) {
          m_applyEditor = Cairo.CobranzaAplic.createObject();
        }
        else {
          if(m_applyEditor.getId() !== m_id) {
            m_applyEditor.setClient(null);
            m_applyEditor = Cairo.CobranzaAplic.createObject();
          }
        }

        m_applyEditor.setClient(self);

        if(!m_applyEditor.show(m_id, m_total, m_nroDoc, m_cliente)) {
          m_applyEditor = null;
        }
        m_applyEditor.show(
          m_id,
          m_total,
          m_nroDoc,
          m_cliId,
          m_cliente).then(function(result) {
          if(result !== true) {
            m_applyEditor = null;
          }
        });
      };

      var getCheques = function() {
        return getChequesProperty().getGrid();
      };

      var getTarjetas = function() {
        return getTarjetasProperty().getGrid();
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

      var getChequesProperty = function() {
        return m_items.getProperties().item(C_CHEQUES);
      };

      var getTarjetasProperty = function() {
        return m_items.getProperties().item(C_TARJETA);
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

      var columnAfterUpdateCheque = function(property, lRow, lCol) {
        var p = null;
        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).getKey()) {

          case KICH_IMPORTEORIGEN:

            var row = grid.getRows().item(lRow);
            var cell = getCell(row, KICH_MON_ID);

            if(cell.getId() !== m_defaultCurrency.id || cell.getId() === 0) {
              getCell(row, KICH_IMPORTE)
                .setValue(val(getCell(row, KICH_IMPORTEORIGEN).getValue()) * val(getCotizacion().getValue()));
            }
            else {
              getCell(row, KICH_IMPORTEORIGEN).setValue(0);
            }
            showCobroNeto();
            showCobroTotal();
            break;

          case KICH_IMPORTE:

            showCobroNeto();
            showCobroTotal();
            break;

          case KICH_CUE_ID:

            var row = grid.getRows().item(lRow);

            p = D.getCurrencyFromAccount(getCell(row, KICH_CUE_ID).getId())
              .whenSuccessWithResult(function(info) {
                var cell = getCell(row, KICH_MON_ID);
                cell.setValue(info.monName);
                cell.setId(info.monId);
                if(info.monId === m_defaultCurrency.id || info.monId === 0) {
                  getCell(row, KICH_IMPORTEORIGEN).setValue(0);
                }
                return true;
              });
            break;
        }

        return p || P.resolvedPromise(true);
      };

      var columnAfterUpdateTarjeta = function(property, lRow, lCol) {
        var p = null;
        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).getKey()) {

          case KIT_IMPORTEORIGEN:

            var row = grid.getRows().item(lRow);
            getCell(row, KIT_IMPORTE)
              .setValue(val(getCell(row, KIT_IMPORTEORIGEN).getValue()) * val(getCotizacion().getValue()));
            showCobroNeto();
            showCobroTotal();
            break;

          case KIT_IMPORTE:

            showCobroNeto();
            showCobroTotal();
            break;

          case KIT_TJC_ID:

            var row = grid.getRows().item(lRow);
            var tjcId = getCell(row, KIT_TJC_ID).getId();
            D.setSelectFilterCuotas(row, property, m_dialog, KIT_TJC_ID);

            var cell = getCell(row, KIT_TJCCU_ID);
            p = D.validateCuota(tjcId, cell.getId()).whenSuccessWithResult(function(response) {
              if(!response.is_valid) {
                cell.setId(NO_ID);
                cell.setValue("");
                m_items.showCellValue(property, lRow, m_lColCuotas);
              }
            });
            break;
        }

        return p || P.resolvedPromise(true);
      };

      var columnAfterUpdateCtaCte = function(property, lRow, lCol) {
        return P.resolvedPromise(true);
      };

      var columnAfterUpdateEfectivo = function(property, lRow, lCol) {

        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).getKey()) {

          case KIE_IMPORTEORIGEN:

            var row = grid.getRows().item(lRow);
            var cell = getCell(row, KIE_MON_ID);
            if(cell.getId() !== m_defaultCurrency.id || cell.getId() === 0) {
              getCell(row, KIE_IMPORTE)
                .setValue(val(getCell(row, KIE_IMPORTEORIGEN).getValue()) * val(getCotizacion().getValue()));
            }
            else {
              getCell(row, KIE_IMPORTEORIGEN).setValue(0);
            }
            showCobroNeto();
            showCobroTotal();
            break;

          case KIE_IMPORTE:

            showCobroNeto();
            showCobroTotal();
            break;

          case KIE_CUE_ID:

            var row = grid.getRows().item(lRow);

            D.getCurrencyFromAccount(getCell(row, KICH_CUE_ID).getId())
              .whenSuccessWithResult(function(info) {
                var cell = getCell(row, KICH_MON_ID);
                cell.setValue(info.monName);
                cell.setId(info.monId);
                if(info.monId === m_defaultCurrency.id || info.monId === 0) {
                  getCell(row, KICH_IMPORTEORIGEN).setValue(0);
                }
              });
            break;
        }

        return P.resolvedPromise(true);
      };

      var columnAfterUpdateOtro = function(property, lRow, lCol) {

        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).getKey()) {

          case KIO_DEBE:
            var row = grid.getRows().item(lRow);
            getCell(row, KIO_IMPORTEORIGEN).setValue(val(getCell(row, KIO_DEBE).getValue()));
            getCell(row, KIO_HABER).setValue(0);
            showCobroOtro();
            showCobroTotal();
            break;

          case KIO_HABER:
            var row = grid.getRows().item(lRow);
            getCell(row, KIO_IMPORTEORIGEN).setValue(val(getCell(row, KIO_HABER).getValue()));
            getCell(row, KIO_DEBE).setValue(0);
            showCobroOtro();
            showCobroTotal();
            break;
        }

        return P.resolvedPromise(true);
      };

      var getCotizacion = function() {
        return m_properties.item(CT.COBZ_COTIZACION);
      };

      var showCobroNeto = function() {
        var total = 0;

        var _count = getCheques().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          var row = getCheques().getRows().item(_i);
          total = total + val(getCell(row, KICH_IMPORTE).getValue());
        }

        var _count = getEfectivo().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          var row = getEfectivo().getRows().item(_i);
          total = total + val(getCell(row, KIE_IMPORTE).getValue());
        }

        var _count = getTarjetas().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          var row = getTarjetas().getRows().item(_i);
          total = total + val(getCell(row, KIE_IMPORTE).getValue());
        }

        getCobroNeto().setValue(total);
        m_footer.showValue(getCobroNeto());
      };

      var showCobroTotal = function() {
        getCobroTotal().setValue(val(getCobroNeto().getValue()) + val(getCobroOtros().getValue()));
        m_footer.showValue(getCobroTotal());
      };

      var showCobroOtro = function() {
        var total = 0;

        var _count = getOtros().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          var row = getOtros().getRows().item(_i);
          total = total + val(getCell(row, KIO_DEBE).getValue()) - val(getCell(row, KIO_HABER).getValue());
        }

        getCobroOtros().setValue(total);
        m_footer.showValue(getCobroOtros());
      };

      var getCobroNeto = function() {
        return m_footer.getProperties().item(CT.COBZ_NETO);
      };

      var getCobroOtros = function() {
        return m_footer.getProperties().item(CT.COBZ_OTROS);
      };

      var getCobroTotal = function() {
        return m_footer.getProperties().item(CT.COBZ_TOTAL);
      };

      var isEmptyRowCheques = function(row, rowIndex) {

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KICH_CUE_ID:
            case KICH_BCO_ID:
            case KICH_MON_ID:
            case KICH_CLE_ID:

              if(!valEmpty(cell.getId(), Types.id)) {
                return false;
              }
              break;

            case KICH_IMPORTE:
            case KICH_IMPORTEORIGEN:

              if(!valEmpty(val(cell.getValue()), Types.double)) {
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

      var validateRowCheques = function(row, rowIndex) {

        var bOrigen = false;
        var monId = NO_ID;
        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KICH_CUE_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2113, "", strRow)); // Debe indicar una Cuenta Contable (1)
              }
              break;

            case KICH_BCO_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2094, "", strRow)); // Debe indicar un banco (1)
              }
              break;

            case KICH_MON_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2114, "", strRow)); // Debe indicar una moneda (1)
              }
              monId = cell.getId();
              break;

            case KICH_CLE_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2115, "", strRow)); // Debe indicar un clearing (1)
              }
              break;

            case KICH_IMPORTEORIGEN:
              bOrigen = !valEmpty(val(cell.getValue()), Types.double);
              break;

            case KICH_IMPORTE:
              if(valEmpty(val(cell.getValue()), Types.double)) {
                return M.showInfoWithFalse(getText(2116, "", strRow)); // Debe indicar un número de Cheque (1)
              }
              break;

            case KICH_CHEQUE:
              if(valEmpty(cell.getValue(), Types.text)) {
                return M.showInfoWithFalse(getText(2116, "", strRow)); // Debe indicar un número de cheque (1)
              }
              break;

            case KICH_FECHACOBRO:
              if(valEmpty(cell.getValue(), Types.date)) {
                return M.showInfoWithFalse(getText(2117, "", strRow)); // Debe indicar una fecha para depositar (1)
              }
              break;

            case KICH_FECHAVTO:
              if(valEmpty(cell.getValue(), Types.date)) {
                return M.showInfoWithFalse(getText(1384, "", strRow)); // Debe indicar una fecha de vencimiento (1)
              }
              break;
          }
        }

        if(!bOrigen && monId !== m_defaultCurrency.id) {
          return M.showInfoWithFalse(getText(2118, "", strRow)); // Debe indicar un importe para la moneda extranjera (1)
        }

        return P.resolvedPromise(true);
      };

      var isEmptyRowTarjetas = function(row, rowIndex) {

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {
            case KIT_TJC_ID:
            case KIT_MON_ID:
            case KIT_TJCCU_ID:

              if(!valEmpty(cell.getId(), Types.id)) {
                return false;
              }
              break;

            case KIT_IMPORTE:
            case KIT_IMPORTEORIGEN:

              if(!valEmpty(val(cell.getValue()), Types.double)) {
                return false;
              }
              break;

            case KIT_NROTARJETA:
            case KIT_NROAUTORIZACION:
            case KIT_TITULAR:
            case KIT_DESCRIP:

              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;

            case KIT_FECHAVTO:
              if(!valEmpty(cell.getValue(), Types.date)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var validateRowTarjetas = function(row, rowIndex) {
        var bOrigen = false;
        var monId = NO_ID;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KIT_TJC_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2119, "", strRow)); // Debe indicar una Tarjeta de Crédito (1)
              }
              break;

            case KIT_MON_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2114, "", strRow)); // Debe indicar una moneda (1)
              }
              monId = cell.getId();
              break;

            case KIT_IMPORTEORIGEN:
              bOrigen = !valEmpty(val(cell.getValue()), Types.double);
              break;

            case KIT_IMPORTE:
              if(valEmpty(val(cell.getValue()), Types.double)) {
                return M.showInfoWithFalse(getText(1897, "", strRow)); // Debe indicar un importe (1)
              }
              break;

            case KIT_NROTARJETA:
              if(valEmpty(cell.getValue(), Types.text)) {
                return M.showInfoWithFalse(getText(2120, "", strRow)); // Debe indicar un número tarjeta (1)
              }
              break;

            case KIT_NROAUTORIZACION:
              if(valEmpty(cell.getValue(), Types.text)) {
                return M.showInfoWithFalse(getText(2121, "", strRow)); // Debe indicar un número autorización (1)
              }
              break;

            case KIT_FECHAVTO:
              if(valEmpty(cell.getValue(), Types.date)) {
                return M.showInfoWithFalse(getText(1384, "", strRow)); // Debe indicar una fecha de vencimiento (1)
              }
              break;

            case KIT_TITULAR:
              if(valEmpty(cell.getValue(), Types.text)) {
                return M.showInfoWithFalse(getText(2122, "", strRow)); // Debe indicar un Titular (1)
              }
              break;
          }
        }

        if(!bOrigen && monId !== m_defaultCurrency.id) {
          return M.showInfoWithFalse(getText(2118, "", strRow)); // Debe indicar un importe para la moneda extranjera (1)
        }

        return P.resolvedPromise(true);
      };

      var isEmptyRowOtros = function(row, rowIndex) {

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

              if(!valEmpty(val(cell.getValue()), Types.double)) {
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

      var validateRowOtros = function(row, rowIndex) {

        var p = null;
        var bOrigen = false;
        var bDebe = false;
        var bHaber = false;
        var cueId = NO_ID;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KIO_CUE_ID:
              cueId = cell.getId();
              if(valEmpty(cueId, Types.id)) {
                return M.showInfoWithFalse(getText(2113, "", strRow)); // Debe indicar una cuenta contable (1)
              }
              break;

            case KIO_DEBE:
              bDebe = !valEmpty(val(cell.getValue()), Types.double);
              break;

            case KIO_HABER:
              bHaber = !valEmpty(val(cell.getValue()), Types.double);
              break;

            case KIO_IMPORTEORIGEN:
              bOrigen = !valEmpty(val(cell.getValue()), Types.double);
              break;
          }
        }

        if(!bDebe && !bHaber) {
          return M.showInfoWithFalse(getText(1898, "", strRow)); // Debe indicar un importe en el debe o en el haber (1)
        }

        if(!bOrigen) {

          p = D.getCurrencyFromAccount(cueId).whenSuccessWithResult(function(info) {
            if(info.monId !== m_defaultCurrency.id) {
              return M.showInfoWithFalse(getText(2118, "", strRow)); // Debe indicar un importe para la moneda extranjera (1)
            }
            else {
              return true;
            }
          });
        }

        return p || P.resolvedPromise(true);
      };

      var isEmptyRowCtaCte = function(row, rowIndex) {

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
              if(!valEmpty(val(cell.getValue()), Types.double)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var validateRowCtaCte = function(row, rowIndex) {

        var p = null;
        var bOrigen = false;
        var cueId = NO_ID;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KICC_CUE_ID:
              cueId = cell.getId();
              if(valEmpty(cueId, Types.id)) {
                return M.showInfoWithFalse(getText(2113, "", strRow)); // Debe indicar una cuenta contable (1)
              }
              break;

            case KICC_IMPORTEORIGEN:
              bOrigen = !valEmpty(val(cell.getValue()), Types.double);
              break;

            case KICC_IMPORTE:
              if(valEmpty(val(cell.getValue()), Types.double)) {
                return M.showInfoWithFalse(getText(2116, "", strRow)); // Debe indicar una número de cheque (1)
              }
              break;
          }
        }

        if(!bOrigen) {

          p = D.getCurrencyFromAccount(cueId).whenSuccessWithResult(function(info) {
            if(info.monId !== m_defaultCurrency.id) {
              return M.showInfoWithFalse(getText(2118, "", strRow)); // Debe indicar un importe para la moneda extranjera (1)
            }
            else {
              return true;
            }
          });
        }

        return p || P.resolvedPromise(true);
      };

      var isEmptyRowEfectivo = function(row, rowIndex) {

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

              if(!valEmpty(val(cell.getValue()), Types.double)) {
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

      var validateRowEfectivo = function(row, rowIndex) {
        var p = null;
        var bOrigen = false;
        var cueId = NO_ID;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KIE_CUE_ID:
              cueId = cell.getId();
              if(valEmpty(cueId, Types.id)) {
                return M.showInfoWithFalse(getText(2113, "", strRow)); // Debe indicar una cuenta contable (1)
              }
              break;

            case KIE_IMPORTEORIGEN:

              bOrigen = !valEmpty(val(cell.getValue()), Types.double);
              break;

            case KIE_IMPORTE:
              if(valEmpty(val(cell.getValue()), Types.double)) {
                return M.showInfoWithFalse(getText(1897, "", strRow)); // Debe indicar un importe (1)
              }
              break;
          }
        }

        if(!bOrigen) {

          p = D.getCurrencyFromAccount(cueId).whenSuccessWithResult(function(info) {
            if(info.monId !== m_defaultCurrency.id) {
              return M.showInfoWithFalse(getText(2118, "", strRow)); // Debe indicar un importe para la moneda extranjera (1)
            }
            else {
              return true;
            }
          });
        }

        return p || P.resolvedPromise(true);
      };

      var clearCheqId = function() {
        for(var _i = 0, _count = getCheques().getRows().size(); _i < _count; _i++) {
          var row = getCheques().getRows().item(_i);
          getCell(row, KICH_CHEQ_ID).setId(NO_ID);
        }
        for(var _i = 0, _count = getTarjetas().getRows().size(); _i < _count; _i++) {
          var row = getTarjetas().getRows().item(_i);
          getCell(row, KIT_TJCC_ID).setId(NO_ID);
        }
        m_items.showValue(getChequesProperty(), true);
        m_items.showValue(getTarjetasProperty(), true);
      };

      var setFilterColFactura = function() {

        var filter = D.getFacturaVentaFilter(getCliente());
        D.getCol(getOtros().getColumns(), KIO_FV_ID_RET).setSelectFilter(filter);
        m_dialog.refreshColumnProperties(getOtrosProperty(), CT.FV_ID_RET);

      };

      var getCliente = function() {
        return m_properties.item(C.CLI_ID).getSelectId();
      };

      var getFileNamePostFix = function() {
        return m_properties.item(C.CLI_ID).getValue().substr(0, 50) + "-" + m_properties.item(CT.COBZ_NRODOC).getValue();
      };

      self.getObjectType = function() {
        return "cairo.modules.tesoreria.cobranza";
      };

      initialize();

      return self;
    };

    Edit.Controller = { getEditor: createObject };

    Edit.Controller.edit = function(id) {

      Cairo.LoadingMessage.show("Cobranzas", "Loading Cobranza from CrowSoft Cairo server.");
      var editor = Cairo.Cobranza.Edit.Controller.getEditor();

      //
      // wizards
      //
      if(id === 'sobrefactura') {
        return editor.showWizardCobranza();
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

  Cairo.module("CobranzaListDoc.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

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

      var C_MODULE = "cCobranzaListDoc";

      var C_FECHA_INI = "FechaIni";
      var C_FECHA_FIN = "FechaFin";

      var K_FECHA_INI = 1;
      var K_FECHA_FIN = 2;
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
      var m_cobId = "";
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

      var m_menuShowNotes = 0;
      var m_menuShowInfoCli = 0;
      var m_menuAddNote = 0;
      var m_menuShowApply = 0;
      var m_menuShowAsiento = 0;
      var m_menuSign = 0;

      var m_apiPath = DB.getAPIVersion();
      var SAVE_ERROR = getText(2282, ""); // Error al grabar los párametros de navegación de Cobranza

      self.list = function() {
        initialize();
        return load()
          .whenSuccess(loadCollection);
      };

      self.edit = function(cobzId) {
        m_listController.edit(cobzId);
      };

      self.deleteItem = function(cobzId) {
        D.confirmDeleteDocument()
          .then(function(answer) {
            if(answer === "yes") {
              return m_listController.destroy(cobzId);
            }
          });
      };

      self.showDocDigital = function() {
        var _rtn = false;

        try {

          var cobzId = m_dialog.getId();
          if(cobzId === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(CT.COBRANZA);
          doc.setClientTableID(cobzId);

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

            case m_menuShowNotes:
              showNotes();
              break;

            case m_menuAddNote:
              addNote();
              break;

            case m_menuShowApply:
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
          Cairo.manageErrorEx(ex.message, ex, "processMenu", C_MODULE, "");
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
        c.setName(getText(1150, "")); // Cliente
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
        c.setSelectFilter(D.COBRANZA_LIST_DOC_FILTER);

        c = m_properties.add(null, C.COB_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.COBRADOR);
        c.setName(getText(1395, "")); // Cobrador
        c.setKey(K_COB_ID);
        c.setValue(m_cobrador);
        c.setSelectId(val(m_cobId));
        c.setSelectIntValue(m_cobId);

        c = m_properties.add(null, C.EMP_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.EMPRESA);
        c.setName(getText(1114, "")); // Empresa
        c.setKey(K_EMP_ID);
        c.setValue(m_empresa);
        c.setSelectId(val(m_empId));
        c.setSelectIntValue(m_empId);

        createMenu();

        return m_dialog.showDocumentList(self);
      };

      var refreshCollection = function() {
        return m_dialog.showValues(m_properties);
      };

      var load = function() {

        return DB.getData("load[" + m_apiPath + "tesoreria/cobranzas/parameters]").then(
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
              m_cobId = NO_ID;
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

              m_cliId = valField(response.data, C.CLI_ID);
              m_estId = valField(response.data, C.EST_ID);
              m_ccosId = valField(response.data, C.CCOS_ID);
              m_sucId = valField(response.data, C.SUC_ID);
              m_cobId = valField(response.data, C.COB_ID);
              m_docId = valField(response.data, C.DOC_ID);
              m_empId = valField(response.data, C.EMP_ID);

              m_cliente = valField(response.data, C.CLI_NAME);
              m_estado = valField(response.data, C.EST_NAME);
              m_centroCosto = valField(response.data, C.CCOS_NAME);
              m_sucursal = valField(response.data, C.SUC_NAME);
              m_cobrador = valField(response.data, C.COB_NAME);
              m_documento = valField(response.data, C.DOC_NAME);
              m_empresa = valField(response.data, C.EMP_NAME);

            }
            return true;
          }
        );
      };

      self.getApplication = function() {
        return Cairo.Application.getName();
      };

      self.getProperties = function() {
        return m_properties;
      };

      self.propertyChange = function(key) {
        var iProp = null;

        switch (key) {

          case K_FECHA_INI:

            iProp = m_properties.item(C_FECHA_INI);

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

            iProp = m_properties.item(C_FECHA_FIN);

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

          case K_CLI_ID:
            var property = m_properties.item(C.CLI_ID);
            m_cliente = property.getValue();
            m_cliId = property.getSelectIntValue();
            console.log("Cobranza propertyChange " + m_cliente + " " + m_cliId);
            break;

          case K_CCOS_ID:
            var property = m_properties.item(C.CCOS_ID);
            m_centroCosto = property.getValue();
            m_ccosId = property.getSelectIntValue();
            break;

          case K_SUC_ID:
            var property = m_properties.item(C.SUC_ID);
            m_sucursal = property.getValue();
            m_sucId = property.getSelectIntValue();
            break;

          case K_COB_ID:
            var property = m_properties.item(C.COB_ID);
            m_cobrador = property.getValue();
            m_cobId = property.getSelectIntValue();
            break;

          case K_DOC_ID:
            var property = m_properties.item(C.DOC_ID);
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
          cliId: m_cliId,
          estId: m_estId,
          ccosId: m_ccosId,
          sucId: m_sucId,
          cobId: m_cobId,
          docId: m_docId,
          empId: m_empId
        };

        console.log("refresh params:");
        console.log(params);

        return DB.getData("load[" + m_apiPath + "tesoreria/cobranzas]", null, params);
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.LDP_ID);
        register.setTable(C.LISTA_DOCUMENTO_PARAMETRO);

        register.setPath(m_apiPath + "tesoreria/cobranzas");

        register.setId(Cairo.Constants.NEW_ID);

        var _count = m_properties.size();
        for(var _i = 0; _i < _count; _i++) {

          var property = m_properties.item(_i);

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

            case K_COB_ID:
              fields.add(C.COB_ID, property.getSelectIntValue(), Types.text);
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

      self.getPath = function() {
        return "#tesoreria/cobranzas";
      };

      self.getEditorName = function() {
        return "cobranzas";
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

        m_menuSign = m_dialog.addMenu(getText(1594, "")); // Firmar
        m_dialog.addMenu("-");

        m_menuShowInfoCli = m_dialog.addMenu(getText(1594, "")); // Ver Info del Cliente

        m_menuAddNote = m_dialog.addMenu(getText(1615, "")); // Agregar Nota

        m_menuShowNotes = m_dialog.addMenu(getText(1616, "")); // Ver Notas
        m_dialog.addMenu("-");

        m_menuShowApply = m_dialog.addMenu(getText(1617, "")); // Ver Aplicaciones
        m_dialog.addMenu("-");

        m_menuShowAsiento = m_dialog.addMenu(getText(1692, "")); // Ver Asiento Contable
      };

      // TODO: complete
      //
      var getCliId = function() {

      };

      var showNotes = function() {
        var cobzId = m_dialog.getId();
        return DB.getData("load[" + m_apiPath + "tesoreria/cobranza/notes]", cobzId)
          .whenSuccessWithResult(D.showNotes);
      };

      var addNote = function() {
        var cobzId = m_dialog.getId();
        return D.addNote(D.Types.COBRANZA, cobzId, false);
      };

      var signDocument = function() {
        var cobzId = m_dialog.getId();

        if(cobzId === NO_ID) {
          return P.resolvedPromise(true);
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

        return D.getDocumentSignStatus(D.Types.COBRANZA, cobzId)
            .whenSuccessWithResult(getAction)
            .whenSuccess(D.signDocument(D.Types.COBRANZA, cobzId))
            .whenSuccessWithResult(refreshRow)
          ;
      };

      var showAsiento = function() {
        var cobzId = m_dialog.getId();
        if(cobzId !== NO_ID) {

          D.getAsientoId(D.Types.COBRANZA, cobzId).whenSuccessWithResult(function(response) {
            D.showDocAux(response.as_id, "Asiento");
          });
        }
      };

      var showApply = function() {

        var showEditor = function(info) {
          if(!Cairo.Security.docHasPermissionTo(
            CS.MODIFY_APLIC,
            m_docId,
            Cairo.Security.ActionTypes.apply)) {
            return false;
          }

          var applyEditor = Cairo.CobranzaAplic.createObject();

          applyEditor.setClient(self);

          applyEditor.show(
            info.id,
            info.total,
            info.nrodoc,
            info.cli_id,
            info.cliente,
            info.emp_id,
            info.empresa);
        };

        var cobzId = m_dialog.getId();
        if(cobzId !== NO_ID) {
          D.getDocumentInfo(D.Types.COBRANZA, cobzId).whenSuccessWithResult(showEditor);
        }
      };

      var initialize = function() {
        try {
          m_title = getText(2128, ""); // Cobranzas
          m_dialog.setHaveDetail(true);
          m_dialog.setStartRowText(4);
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "initialize", C_MODULE, "");
        }
      };

      self.terminate = function() {
        try {
          m_dialog = null;
          m_properties = null;
          m_listController = null;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");
        }
      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("Cobranza.List", function(List, Cairo, Backbone, Marionette, $, _) {

    var NO_ID = Cairo.Constants.NO_ID;
    var DB = Cairo.Database;
    var C_MODULE = "cCobranza";
    var P = Cairo.Promises;

    List.Controller = {
      list: function() {

        var self = this;

        var createListDialog = function() {

          var editors = Cairo.Editors.cobranzaEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.cobranzaEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Cobranza",
            entityName: "cobranza",
            entitiesName: "cobranzas"
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
              Cairo.LoadingMessage.show("Cobranza", "Loading Cobranzas from CrowSoft Cairo server.");

              var editor = Cairo.Cobranza.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.Tesoreria.DELETE_COBRANZA)) {
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
              DB.getAPIVersion() + "tesoreria/cobranza", id,
              Cairo.Constants.DELETE_FUNCTION, C_MODULE).whenSuccess(closeDialog, false);
          };

          // progress message
          //
          Cairo.LoadingMessage.show("Cobranza", "Loading Cobranzas from CrowSoft Cairo server.");

          self.documentList = Cairo.CobranzaListDoc.Edit.Controller.getEditor();
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