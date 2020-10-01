(function() {
  "use strict";

  Cairo.module("DepositoBanco.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var TITLE = getText(2164, ""); // Deposito Bancarios
      var SAVE_ERROR_MESSAGE = getText(2236, ""); // Error al grabar el deposito bancario

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
      var getCell = Dialogs.cell;
      var cellFloat = Dialogs.cellFloat;
      var val = Cairo.Util.val;
      var M = Cairo.Modal;
      var T = Dialogs.PropertyType;

      var C_MODULE = "cDepositoBanco";

      var C_EFECTIVO = "Efectivo";
      var C_CHEQUES = "Cheques";
      var C_CHEQUEST = "Cheques En Cartera";

      var C_CHEQUERA = "Chequera";
      var C_COLCHEQUE = "cheque";

      var K_NUMERO = 1;
      var K_NRO_DOC = 2;
      var K_DESCRIP = 3;
      var K_FECHA = 4;
      var K_TOTAL = 9;
      var K_BCO_ID = 10;
      var K_DOC_ID = 11;

      var K_EFECTIVO = 105;
      var K_CHEQUES = 106;
      var K_CHEQUEST = 107;

      var K_EST_ID = 17;
      var K_SUC_ID = 19;
      var K_LGJ_ID = 27;
      var K_COTIZACION = 28;
      var K_CUE_ID = 29;

      var KI_DBCOI_ID = 2;
      var KI_DESCRIP = 6;
      var KI_IMPORTE = 8;
      var KI_IMPORTE_ORIGEN = 9;
      var KI_CUE_ID = 22;
      var KI_CHEQ_ID = 23;
      var KI_BCO_ID = 24;
      var KI_CHEQ_ID_SAVED = 25;

      var KI_CUE_ID_HABER = 301;

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

      var m_id = 0;
      var m_numero = 0;
      var m_estado = "";
      var m_estId = 0;
      var m_nroDoc = "";
      var m_descrip = "";
      var m_fecha = null;
      var m_total = 0;
      var m_lgjId = 0;
      var m_legajo = "";

      var m_cotizacion = 0;
      var m_sucId = 0;
      var m_sucursal = "";
      var m_bcoId = 0;
      var m_banco = "";
      var m_cueId = 0;
      var m_cuenta = "";
      var m_docId = 0;
      var m_documento = "";
      var m_doctId = 0;
      var m_monId = 0;
      var m_lastMonIdCotizacion = 0;
      var m_firmado;

      var m_lastFecha = Cairo.Constants.NO_DATE;

      var m_asId = 0;

      var m_editing;

      var m_footer;
      var m_footerProps;
      var m_items;
      var m_itemsProps;
      var m_dialog;
      var m_properties;
      var m_listController = null;

      var m_lastDocId = 0;
      var m_lastDocName = "";
      var m_lastMonId = 0;

      var m_lastDoctId = 0;

      var m_lastBcoId = 0;
      var m_lastBcoName = "";

      var m_lastCueId = 0;
      var m_lastCueName = "";

      var m_isNew;

      var m_defaultCurrency = D.getDefaultCurrency();

      var m_copy;

      var m_docEditable;
      var m_docEditMsg = "";

      var m_taPropuesto;
      var m_taMascara = "";

      var m_efectivoDeleted = "";
      var m_chequesDeleted = "";
      var m_chequesTDeleted = "";

      var m_orden = 0;

      var m_apiPath = DB.getAPIVersion();

      var emptyData = {
        cheques: [],
        chequesT: [],
        efectivo: []
      };

      var m_data = emptyData;

      self.getEditorType = function() {
        return "document"
      };

      self.refresh = function() {
        load(m_id);
        refreshProperties();
      };

      self.copy = function() {

        if(!Cairo.Security.docHasPermissionTo(
          CS.NEW_DEPOSITO_BANCO,
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

        return D.setDocNumber(m_lastDocId, m_dialog, CT.DBCO_NRODOC).then(
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

          if(!m_docEditable && getDocId() !== NO_ID) {
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

            return D.setDocNumber(m_lastDocId, m_dialog, CT.DBCO_NRODOC)

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

          doc.setClientTable(CT.DEPOSITO_BANCO);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "showDocDigital", C_MODULE, "");
        }

        return _rtn;
      };

      self.messageEx = function(messageID, info) {
        var p = null;

        switch (messageID) {
          case Dialogs.Message.MSG_DOC_FIRST:
          case Dialogs.Message.MSG_DOC_PREVIOUS:
          case Dialogs.Message.MSG_DOC_NEXT:
          case Dialogs.Message.MSG_DOC_LAST:

            p = move(messageID);
            break;

          case Dialogs.Message.MSG_DOC_SIGNATURE:

            p = signDocument();
            break;

          case Dialogs.Message.MSG_GRID_VIRTUAL_ROW:

            p = P.resolvedPromise(info);
            break;

          case Dialogs.Message.MSG_GRID_ROW_DELETED:

            p = true;
            showTotals();
            break;

          case Dialogs.Message.MSG_DOC_EDIT_STATE:

            D.showEditStatus(m_docEditMsg, TITLE);
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

          case Dialogs.Message.MSG_DOC_EX_GET_ITEMS:

            p = P.resolvedPromise(m_items);
            break;

          case Dialogs.Message.MSG_DOC_EX_GET_FOOTERS:

            p = P.resolvedPromise(m_footer);
            break;

          case Dialogs.Message.MSG_DOC_SEARCH:

            D.search(D.Types.DEPOSITO_BANCO, self, Cairo.bool(info));
            break;

          case Dialogs.Message.MSG_DOC_DOC_AUX:

            if(m_id) {
              D.showDocAux(m_asId, "Asiento");
            }
            else {
              return M.showInfoWithFalse(getText(1620, "")); // Debe editar un comprobante guardado para poder ver los documentos auxiliares
            }
            break;

            if(m_id) {
              D.showDocAux(m_asId, "Asiento");
            }
            else {
              return M.showInfoWithFalse(getText(1620, "")); // Debe editar un comprobante guardado para poder ver los documentos auxiliares
            }
            break;

          case Dialogs.Message.MSG_DOC_HISTORY:

            if(m_id !== NO_ID) {
              p = Cairo.History.show(Cairo.Tables.ORDENES_DE_PAGO, m_id, m_documento + " " + m_nroDoc);
            }
            else {
              p = M.showInfo(getText(1552, "")); // El documento aun no ha sido guardado
            }
            break;
        }

        return p || P.resolvedPromise(true);
      };

      self.discardChanges = function() {
        Cairo.raiseError("DepositoBanco", "DiscardChanges was called");
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

                  return D.setDocNumber(m_lastDocId, m_dialog, CT.DBCO_NRODOC)
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

          case K_BCO_ID:

            var prop = getCuenta();
            prop.setSelectFilter(Cairo.Documents.getCuentaFilterForBanco(getBanco().getSelectId()));
            m_dialog.showValue(prop);
            m_dialog.validateProp(prop, C.CUE_ID)
            break;

          case K_CUE_ID:

            p = showBanco().then(function() {
              showCotizacion();
            });
            break;

          case K_FECHA:

            if(m_lastFecha !== getFecha()) {
              m_lastFecha = getFecha();
              m_lastMonIdCotizacion = NO_ID;
              p = showCotizacion();
              break;
            }
        }

        return p || P.resolvedPromise(true);
      };

      self.save = function() {

        var p;

        var cotizacion = 0;
        var totalOrigen = 0;
        var isDefaultCurrency = false;
        var total = 0;

        p = D.docCanBeEdited(m_docEditable, m_docEditMsg)
          .whenSuccess(function() {
            return D.docCanBeSaved(m_dialog, CT.DBCO_FECHA);
          })
          .whenSuccess(function() {
            if(getCheques().getRows().count() === 0
              && getTCheques().getRows().count() === 0
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

            register.setFieldId(CT.DBCO_ID);
            register.setTable(CT.DEPOSITO_BANCO);

            register.setId(Cairo.Constants.NEW_ID);

            register.setPath(m_apiPath + "tesoreria/depositobanco");

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
                  fields.add(CT.DBCO_NUMERO, property.getValue(), Types.long);
                  break;

                case K_NRO_DOC:
                  fields.add(CT.DBCO_NRODOC, property.getValue(), Types.text);
                  break;

                case K_DESCRIP:
                  fields.add(CT.DBCO_DESCRIP, property.getValue(), Types.text);
                  break;

                case K_FECHA:
                  fields.add(CT.DBCO_FECHA, property.getValue(), Types.date);
                  break;

                case K_BCO_ID:
                  fields.add(C.BCO_ID, property.getSelectId(), Types.id);
                  break;

                case K_SUC_ID:
                  fields.add(C.SUC_ID, property.getSelectId(), Types.id);
                  break;

                case K_DOC_ID:
                  fields.add(C.DOC_ID, property.getSelectId(), Types.id);
                  break;

                case K_CUE_ID:
                  fields.add(C.CUE_ID, property.getSelectId(), Types.id);
                  break;

                case K_COTIZACION:
                  cotizacion = property.getValue();
                  fields.add(CT.DBCO_COTIZACION, property.getValue(), Types.double);
                  break;

                case K_LGJ_ID:
                  fields.add(C.LGJ_ID, property.getSelectId(), Types.id);
                  break;
              }
            }

            if(cotizacion === 0) {
              cotizacion = 1;
              isDefaultCurrency = true;
            }

            var _count = m_footerProps.size();
            for(var _i = 0; _i < _count; _i++) {

              property = m_footerProps.item(_i);

              switch (property.getKey()) {

                case K_TOTAL:
                  total = property.getValue();
                  break;
              }
            }

            totalOrigen = total;
            fields.add(CT.DBCO_TOTAL, totalOrigen * cotizacion, Types.currency);
            fields.add(CT.DBCO_GRABARASIENTO, 1, Types.boolean);
            fields.add(C.EST_ID, m_estId, Types.id);

            if(isDefaultCurrency) {
              fields.add(CT.DBCO_TOTALORIGEN, 0, Types.currency);
            }
            else {
              fields.add(CT.DBCO_TOTALORIGEN, totalOrigen, Types.currency);
            }

            m_orden = 0;

            saveEfectivo(register, cotizacion, isDefaultCurrency);
            saveCheques(register);
            saveTCheques(register, cotizacion, isDefaultCurrency);

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
        return "#tesoreria/depositobanco/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "depositobanco" + id;
      };

      self.getTitle = function() {
        return TITLE + (m_id !== NO_ID ? " " + m_nroDoc : "");
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

            case K_DOC_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                return M.showInfoWithFalse(getText(1562, "")); // Debe indicar un documento
              }
              break;

            case K_CUE_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                return M.showInfoWithFalse(getText(1261, "")); // Debe indicar una cuenta
              }
              break;

            case K_SUC_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                return M.showInfoWithFalse(getText(1560, "")); // Debe indicar una sucursal
              }
              break;

            case K_COTIZACION:
              if(valEmpty(property.getValue(), Types.double) && property.getVisible()) {
                return M.showInfoWithFalse(getText(1626, "")); // Debe indicar una cotización
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
            case K_EFECTIVO:
              isEmpty = isEmptyRow(row, rowIndex);
              break;

            case K_CHEQUES:
              isEmpty = isEmptyRowCheques(row, rowIndex);
              break;

            case K_CHEQUEST:
              isEmpty = isEmptyRowTCheques(row, rowIndex);
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

        return DB.getData("load[" + m_apiPath + "tesoreria/depositobanco/info]", id)
          .whenSuccessWithResult(loadData, false);
      };

      self.getDialog = function() {
        return m_dialog;
      };

      self.list = function() {
        return Cairo.Security.hasPermissionTo(CS.LIST_DEPOSITO_BANCO);
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
            CS.LIST_DEPOSITO_BANCO,
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
              loadChequesT(getTChequesProperty(), m_cotizacion);
              loadEfectivo(getEfectivoProperty());
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
            case K_EFECTIVO:
              showTotals();
              break;

            case K_CHEQUES:
              p = columnAfterUpdateCheque(getChequesProperty(), lRow, lCol);
              break;

            // TODO: validates we don't need to update
            //       cheque filter like we do in MF
            //
            case K_CHEQUEST:
              showTotals();
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

            case K_CHEQUEST:
              p = columnAfterEdit(m_itemsProps.item(C_CHEQUEST), lRow, lCol, newValue, newValueId);
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnAfterEdit", C_MODULE, "");
        }

        return p || P.resolvedPromise(true);
      };

      self.columnBeforeEdit = function(key, lRow, lCol, iKeyAscii) {
        return P.resolvedPromise(true);
      };

      var updateColCuenta = function(property, row, cueId, info) {
        var cell = getCell(row, KICH_MON_ID);
        cell.setValue(info.monName);
        cell.setId(info.monId);
        if(info.monId === m_defaultCurrency.id || info.monId === 0) {
          getCell(row, KICH_IMPORTEORIGEN).setValue(0);
        }

        return D.updateChequeraFilter(
          property,
          KICH_CHEQUERA,
          cueId,
          m_items
        );
      };

      var columnAfterUpdateCheque = function(property, lRow, lCol) {

        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).getKey()) {

          case KICH_IMPORTEORIGEN:

            var row = grid.getRows().item(lRow);
            var cell = getCell(row, KICH_MON_ID);
            
            if(cell.getId() !== m_defaultCurrency.id || cell.getId() === 0) {
              getCell(row, KICH_IMPORTE).setValue(
                  cellFloat(row, KICH_IMPORTEORIGEN) * val(getCotizacion().getValue()));
            }
            else {
              getCell(row, KICH_IMPORTEORIGEN).setValue(0);
            }
            showTotals();
            break;

          case KICH_IMPORTE:

            showTotals();
            break;

          case KI_CUE_ID_HABER:

            var row = grid.getRows().item(lRow);
            var cueId = getCell(row, KI_CUE_ID_HABER).getId();

            return D.getCurrencyFromAccount(cueId)
              .whenSuccessWithResult(call(updateColCuenta, property, row, cueId));
            break;

          case KICH_CHEQUERA:

            var row = grid.getRows().item(lRow);

            return D.getChequeNumber(getCell(row, KICH_CHEQUERA).getId()).whenSuccessWithResult(function(response) {
              getCell(row, KICH_CHEQUE).setValue(valField(response.data, CT.CHEQ_NUMERO_DOC));
              return true;
            });
            break;
            
        }

        return P.resolvedPromise(true);
      };

      var columnAfterEdit = function(property, lRow, lCol, newValue, newValueId) {
        var row = null;

        switch (property.getGrid().getColumns().item(lCol).getKey()) {
          case KI_CHEQ_ID:
            row = property.getGrid().getRows(lRow);

            var cheqId = newValueId;

            if(cheqId !== getCell(row, KI_CHEQ_ID_SAVED).getId()) {

              return D.getChequeData(getCell(row, KI_CHEQ_ID).getId())
                  .then(function(response) {
                    if(response.success === true) {

                      Dialogs.cell(row, KI_BCO_ID).setValue(valField(response.data, C.BCO_NAME));
                      Dialogs.cell(row, KI_CUE_ID)
                          .setId(valField(response.data, C.CUE_ID))
                          .setValue(valField(response.data, C.CUE_NAME));
                      Dialogs.cell(row, KI_IMPORTE).setValue(valField(response.data, CT.CHEQ_IMPORTE));
                      Dialogs.cell(row, KI_IMPORTE_ORIGEN).setValue(valField(response.data, CT.CHEQ_IMPORTE_ORIGEN));
                    }
                    else {

                      Dialogs.cell(row, KI_BCO_ID).setValue("");
                      Dialogs.cell(row, KI_CUE_ID)
                          .setId(NO_ID)
                          .setValue("");
                      Dialogs.cell(row, KI_IMPORTE).setValue(0);
                      Dialogs.cell(row, KI_IMPORTE_ORIGEN).setValue(0);

                    }
                    return true;
                  });
            }
            break;
        }

        return P.resolvedPromise(true);
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

            var id = val(getCell(row, KI_DBCOI_ID).getValue());
            if(id !== NO_ID) { m_chequesDeleted = m_chequesDeleted+ id.toString()+ ","; }
            break;

          case K_CHEQUEST:

            var id = val(getCell(row, KI_DBCOI_ID).getValue());
            if(id !== NO_ID) { m_chequesTDeleted = m_chequesTDeleted+ id.toString()+ ","; }
            break;

          case K_EFECTIVO:

            var id = val(getCell(row, KI_DBCOI_ID).getValue());
            if(id !== NO_ID) { m_efectivoDeleted = m_efectivoDeleted+ id.toString()+ ","; }
            break;
        }

        return P.resolvedPromise(true);
      };

      self.newRow = function(key, rows) {
        return P.resolvedPromise(true);
      };

      self.validateRow = function(key, row, rowIndex) {

        var p = null;

        try {

          switch (key) {

            case K_EFECTIVO:
              p = validateRowEfectivo(row, rowIndex);
              break;

            case K_CHEQUES:
              p = validateRowCheques(row, rowIndex);
              break;

            case K_CHEQUEST:
              p = validateRowTCheques(row, rowIndex);
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "validateRow", C_MODULE, "");
        }

        return p || P.resolvedPromise(false);
      };

      var isEmptyRow = function(row, rowIndex) {

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KI_IMPORTE:
              if(!valEmpty(cell.getValue(), Types.currency)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var isEmptyRowCheques = function(row, rowIndex) {

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KI_CUE_ID_HABER:
            case KICH_CHEQUERA:
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

      var isEmptyRowTCheques = function(row, rowIndex) {

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KI_IMPORTE:
              if(!valEmpty(cell.getValue(), Types.currency)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var validateRowTCheques = function(row, rowIndex) {

        var bCueIdOrCheque = false;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KI_IMPORTE:
              if(valEmpty(cell.getValue(), Types.currency)) {
                return M.showInfoWithFalse(getText(1897, "", strRow)); // Debe indicar un importe (1)
              }
              break;

            case KI_CHEQ_ID:
              if(!valEmpty(cell.getId(), Types.id)) {
                bCueIdOrCheque = true;
              }
              break;

            case KI_CUE_ID:
              if(!valEmpty(cell.getId(), Types.id)) {
                bCueIdOrCheque = true;
              }
              break;
          }
        }

        if(!bCueIdOrCheque) {
          return M.showInfoWithFalse(getText(2161, "")); // Debe indicar una Cuenta ó un Cheque (1)
        }

        return P.resolvedPromise(true);
      };

      var validateRowEfectivo = function(row, rowIndex) {

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {
            case KI_IMPORTE:
              if(valEmpty(cell.getValue(), Types.currency)) {
                return M.showInfoWithFalse(getText(1897, "", strRow)); // Debe indicar un importe (1)
              }
              break;

            case KI_CUE_ID_HABER:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2186, "", strRow)); // Debe indicar una cuenta origen (1)
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var validateRowCheques = function(row, rowIndex) {

        var bOrigen = null;
        var monId = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KI_CUE_ID_HABER:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2186, "", strRow)); // Debe indicar una cuenta origen (1)
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
                return M.showInfoWithFalse(getText(1897, "", strRow)); // Debe indicar un importe (1)
              }
              break;

            case KICH_CHEQUERA:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2193, "", strRow)); // Debe indicar una Chequera (1)
              }
              break;

            case KICH_CHEQUE:
              if(valEmpty(cell.getValue(), Types.text)) {
                return M.showInfoWithFalse(getText(2116, "", strRow)); // Debe indicar una número de cheque (1)
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

      var loadCollection = function() {

        var cotizacion = 0;
        var validateDocDefault = false;
        var elem;

        var properties = m_properties;
        m_properties.clear();

        var tabs = m_dialog.getTabs();
        tabs.clear();

        m_dialog.setNoButtons1(Dialogs.Buttons.BUTTON_DOC_APLIC);
        m_dialog.setNoButtons2(Dialogs.Buttons.BUTTON_DOC_ACTION);
        m_dialog.initButtons();

        elem = properties.add(null, C.DOC_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(getText(1567, "")); // Documento
        elem.setKey(K_DOC_ID);

        if(m_docId !== NO_ID) {
          elem.setSelectId(m_docId);
          elem.setValue(m_documento);
        }
        else {
          // user preferences
          //
          elem.setSelectId(Cairo.UserConfig.getDocDbcoId());
          elem.setValue(Cairo.UserConfig.getDocDbcoName());

          validateDocDefault = elem.getSelectId() !== NO_ID;
        }

        elem.setSelectFilter(D.DEPOSITO_BANCO_DOC_FILTER);

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

        elem = properties.add(null, CT.DBCO_FECHA);
        elem.setType(T.date);
        elem.setName(getText(1569, "")); // Fecha
        elem.setKey(K_FECHA);
        elem.setValue(m_fecha);

        elem = properties.add(null, CT.DBCO_NRODOC);
        elem.setType(T.text);
        elem.setName(getText(1065, "")); // Número
        elem.setSize(50);
        elem.setKey(K_NRO_DOC);
        elem.setValue(m_nroDoc);
        elem.setTextMask(m_taMascara);
        elem.setTextAlign(Dialogs.TextAlign.right);

        elem = properties.add(null, C.BCO_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.BANCO);
        elem.setName(getText(1122, "")); // Banco
        elem.setKey(K_BCO_ID);
        elem.setSelectId(m_bcoId);
        elem.setValue(m_banco);
        m_dialog.NewKeyPropFocus = C.BCO_ID;

        elem = properties.add(null, C.CUE_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setSelectFilter(Cairo.Documents.getCuentaFilterForBanco(m_bcoId));
        elem.setName(getText(1267, "")); // Cuenta
        elem.setKey(K_CUE_ID);
        elem.setSelectId(m_cueId);
        elem.setValue(m_cuenta);

        elem = properties.add(null, C.LGJ_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LEGAJOS);
        elem.setName(getText(1575, "")); // Legajo
        elem.setKey(K_LGJ_ID);
        elem.setSelectId(m_lgjId);
        elem.setValue(m_legajo);

        elem = properties.add(null, CT.DBCO_COTIZACION);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1635, "")); // Cotización
        elem.setFormat(Cairo.Settings.getCurrencyRateDecimalsFormat());
        elem.setKey(K_COTIZACION);
        elem.setValue(m_cotizacion);
        elem.setVisible(m_monId !== m_defaultCurrency.id);

        if(m_cotizacion !== 0) {
          cotizacion = m_cotizacion;
        }
        else {
          cotizacion = 1;
        }

        elem = properties.add(null, C.SUC_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.SUCURSAL);
        elem.setName(getText(1281, "")); // Sucursal
        elem.setKey(K_SUC_ID);
        elem.setSelectId(m_sucId);
        elem.setValue(m_sucursal);

        elem = properties.add(null, CT.DBCO_DESCRIP);
        elem.setType(T.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setName(getText(1211, "")); // Observ.
        elem.setSize(5000);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);

        if(!m_dialog.show(self)) { return false; }

        var c_TabEfectivo = 0;
        var c_TabCheque = 1;
        var c_TabChequeT = 2;

        tabs = m_items.getTabs();
        tabs.clear();

        tabs.add(null).setIndex(c_TabEfectivo).setName(getText(2100, "")); // Efectivo
        tabs.add(null).setIndex(c_TabCheque).setName(getText(2099, "")); // Cheques
        tabs.add(null).setIndex(c_TabChequeT).setName(getText(2188, "")); // Cheques en Cartera

        properties = m_itemsProps;
        properties.clear();

        elem = properties.add(null, C_EFECTIVO);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridEfectivo(elem);
        loadEfectivo(elem, cotizacion);
        elem.setName(C_EFECTIVO);
        elem.setKey(K_EFECTIVO);
        elem.setTabIndex(c_TabEfectivo);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_efectivoDeleted = "";

        elem = properties.add(null, C_CHEQUES);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridCheques(elem);
        loadCheques(elem);
        elem.setName(C_CHEQUES);
        elem.setKey(K_CHEQUES);
        elem.setTabIndex(c_TabCheque);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_chequesDeleted = "";

        elem = properties.add(null, C_CHEQUEST);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridChequesT(elem);
        loadChequesT(elem);
        elem.setName(C_CHEQUEST);
        elem.setKey(K_CHEQUEST);
        elem.setTabIndex(c_TabChequeT);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_chequesTDeleted = "";

        if(!m_items.show(self)) { return false; }

        var properties = m_footerProps;
        properties.clear();

        elem = properties.add(null, CT.DBCO_TOTAL);
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setName(getText(1584, "")); // Total
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_TOTAL);
        elem.setValue(m_total);
        elem.setEnabled(false);

        setEnabled();

        if(!m_footer.show(self)) { return false; }

        if(validateDocDefault) {
          self.propertyChange(K_DOC_ID);
        }

        showCotizacion();

        return true;
      };

      var showCotizacion = function() {
        var p = null;
        var cueChange = false;
        var cuenta = getCuenta();

        if(m_lastCueId !== cuenta.getSelectId() || m_copy) {
          m_lastCueId = cuenta.getSelectId();
          m_lastCueName = cuenta.getValue();
          cueChange = true;
        }

        if(cueChange) {

          var property = m_properties.item(CT.DBCO_COTIZACION);

          p = D.getCurrencyFromAccount(m_lastCueId)
            .whenSuccessWithResult(function(info) {

              property.setVisible(info.monId !== m_defaultCurrency.id && info.monId !== NO_ID);

              if(info.monId === m_defaultCurrency.id) {
                property.setValue(0);
                m_lastMonIdCotizacion = info.monId;
              }
              else {
                if(m_lastMonIdCotizacion !== info.monId || property.getValue() === 0) {

                  var date = getFecha();
                  if(! Cairo.Util.isDate(date)) {
                    date = new Date();
                  }
                  return D.getCurrencyRate(info.monId, date).then(function(rate) {
                    property.setValue(rate);
                    m_lastFecha = date;
                    m_lastMonIdCotizacion = info.monId;
                  });
                }
              }
            })
            .then(function() {
              m_dialog.showValue(property);
            });
        }

        return p || P.resolvedPromise(true);
      };

      var setGridEfectivo = function(property) {
        var grid = property.getGrid();
        var columns = grid.getColumns();
        columns.clear();

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_DBCOI_ID);

        elem = columns.add(null);
        elem.setName(getText(2190, "")); // Cuenta Origen
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setKey(KI_CUE_ID_HABER);
        elem.setSelectFilter(D.selectFilterForCuenta);

        elem = columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_IMPORTE);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(T.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setKey(KI_DESCRIP);

        grid.getRows().clear();
      };

      var loadEfectivo = function(property, cotizacion) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();

        for(var _i = 0, count = m_data.efectivo.length; _i < count; _i += 1) {

          var row = rows.add(null, getValue(m_data.efectivo[_i], CT.DBCOI_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.efectivo[_i], CT.DBCOI_ID));
          elem.setKey(KI_DBCOI_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.efectivo[_i], C.CUE_NAME));
          elem.setId(getValue(m_data.efectivo[_i], C.CUE_ID));
          elem.setKey(KI_CUE_ID_HABER);

          elem = row.add(null);
          elem.setValue(getValue(m_data.efectivo[_i], CT.DBCOI_IMPORTE) / cotizacion);
          elem.setKey(KI_IMPORTE);

          elem = row.add(null);
          elem.setValue(getValue(m_data.efectivo[_i], CT.DBCOI_DESCRIP));
          elem.setKey(KI_DESCRIP);

        }

        return true;
      };

      var setGridCheques = function(property) {
        var grid = property.getGrid();
        var columns = grid.getColumns();
        columns.clear();

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_DBCOI_ID);

        elem = columns.add(null);
        elem.setName(getText(2190, "")); // Cuenta Origen
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setSelectFilter(D.selectFilterForCuentaChequesP);
        elem.setKey(KI_CUE_ID_HABER);

        elem = columns.add(null, C_CHEQUERA);
        elem.setName(getText(2064, "")); // Chequera
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CHEQUERA);
        elem.setKey(KICH_CHEQUERA);

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
        elem.setName(getText(2059, "")); // Nr. Cheque
        elem.setType(T.text);
        elem.setKey(KICH_CHEQUE);

        elem = columns.add(null);
        elem.setName(getText(2058, "")); // Cheque
        elem.setType(T.text);
        elem.setEnabled(false);
        elem.setKey(KICH_CHEQ_ID);

        elem = columns.add(null);
        elem.setName(getText(2065, "")); // Depositar el
        elem.setType(T.date);
        elem.setDefaultValue(Grids.createCell());
        elem.getDefaultValue().setValue(Cairo.Dates.today());
        elem.setKey(KICH_FECHACOBRO);

        elem = columns.add(null);
        elem.setName(getText(1634, "")); // Vto.
        elem.setType(T.date);
        elem.setDefaultValue(Grids.createCell());
        elem.getDefaultValue().setValue(Cairo.Dates.DateNames.addToDate("y", 1, Cairo.Dates.today()));
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

          var row = rows.add(null, getValue(m_data.cheques[_i], CT.DBCOI_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.cheques[_i], CT.DBCOI_ID));
          elem.setKey(KI_DBCOI_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cheques[_i], C.CUE_NAME));
          elem.setId(getValue(m_data.cheques[_i], C.CUE_ID));
          elem.setKey(KI_CUE_ID_HABER);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cheques[_i], CT.CHQ_CODE));
          elem.setId(getValue(m_data.cheques[_i], CT.CHQ_ID));
          elem.setKey(KICH_CHEQUERA);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cheques[_i], C.MON_NAME));
          elem.setId(getValue(m_data.cheques[_i], C.MON_ID));
          elem.setKey(KICH_MON_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cheques[_i], CT.DBCOI_IMPORTEORIGEN));
          elem.setKey(KICH_IMPORTEORIGEN);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cheques[_i], CT.DBCOI_IMPORTE));
          elem.setKey(KICH_IMPORTE);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cheques[_i], CT.CHEQ_NUMERO_DOC));
          elem.setKey(KICH_CHEQUE);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cheques[_i], CT.CHEQ_NUMERO));
          elem.setId(getValue(m_data.cheques[_i], CT.CHEQ_ID));
          elem.setKey(KICH_CHEQ_ID);

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
          elem.setValue(getValue(m_data.cheques[_i], CT.DBCOI_DESCRIP));
          elem.setKey(KICH_DESCRIP);

        }

        return true;
      };

      var setGridChequesT = function(property) {
        var grid = property.getGrid();
        var columns = grid.getColumns();
        columns.clear();

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_DBCOI_ID);

        elem = columns.add(null);
        elem.setName(getText(1122, "")); // Banco
        elem.setType(T.text);
        elem.setKey(KI_BCO_ID);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_CHEQ_ID_SAVED);

        elem = columns.add(null, C_COLCHEQUE);
        elem.setName(getText(2058, "")); // Cheque
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CHEQUE);
        elem.setKey(KI_CHEQ_ID);

        elem = columns.add(null);
        elem.setName(getText(1267, "")); // Cuenta
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setSelectFilter(Cairo.Documents.selectFilterForCuentaCaja);
        elem.setEnabled(false);
        elem.setKey(KI_CUE_ID);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(T.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setKey(KI_DESCRIP);

        elem = columns.add(null);
        elem.setName(getText(2162, "")); // Importe Origen
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setEnabled(false);
        elem.setKey(KI_IMPORTE_ORIGEN);

        elem = columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_IMPORTE);

        grid.getRows().clear();
      };

      var loadChequesT = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();
        var colCheqFilter = "";

        rows.clear();

        for(var _i = 0, count = m_data.chequesT.length; _i < count; _i += 1) {

          var row = rows.add(null, getValue(m_data.chequesT[_i], CT.DBCOI_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.chequesT[_i], CT.DBCOI_ID));
          elem.setKey(KI_DBCOI_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.chequesT[_i], C.BCO_NAME));
          elem.setKey(KI_BCO_ID);

          elem = row.add(null);
          elem.setId(getValue(m_data.chequesT[_i], CT.CHEQ_ID));
          elem.setKey(KI_CHEQ_ID_SAVED);

          elem = row.add(null);
          elem.setValue(getValue(m_data.chequesT[_i], CT.CHEQ_NUMERO_DOC));
          elem.setId(getValue(m_data.chequesT[_i], CT.CHEQ_ID));
          elem.setKey(KI_CHEQ_ID);

          colCheqFilter += elem.getId().toString() + ",";

          elem = row.add(null);
          elem.setValue(getValue(m_data.chequesT[_i], C.CUE_NAME));
          elem.setId(getValue(m_data.chequesT[_i], C.CUE_ID));
          elem.setKey(KI_CUE_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.chequesT[_i], CT.DBCOI_DESCRIP));
          elem.setKey(KI_DESCRIP);

          elem = row.add(null);
          elem.setValue(getValue(m_data.chequesT[_i], CT.DBCOI_IMPORTEORIGEN));
          elem.setKey(KI_IMPORTE_ORIGEN);

          elem = row.add(null);
          elem.setValue(getValue(m_data.chequesT[_i], CT.DBCOI_IMPORTE));
          elem.setKey(KI_IMPORTE);

        }

        var colCheque = grid.getColumns().item(C_COLCHEQUE);
        colCheque.setSelectFilter(Cairo.Documents.getSelectChequeFilterEnCartera(colCheqFilter));

        return true;
      };

      var loadDataFromResponse = function(response) {
        var data = response.data;

        data.cheques = data.get('cheques');
        data.chequesT = data.get('chequesT');
        data.efectivo = data.get('efectivo');

        return data;
      };

      var load = function(id) {
        m_data = emptyData;

        return Cairo.Database.getData("load[" + m_apiPath + "tesoreria/depositobanco]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            var p = null;

            if(response.data.id !== NO_ID) {

              m_data = loadDataFromResponse(response);

              var data = response.data;

              m_cotizacion = valField(data, CT.DBCO_COTIZACION);
              var cotizacion = (m_cotizacion !== 0) ? m_cotizacion : 1;

              m_id = valField(data, CT.DBCO_ID);
              m_numero = valField(data, CT.DBCO_NUMERO);
              m_nroDoc = valField(data, CT.DBCO_NRODOC);
              m_descrip = valField(data, CT.DBCO_DESCRIP);
              m_fecha = valField(data, CT.DBCO_FECHA);
              m_total = valField(data, CT.DBCO_TOTAL) / cotizacion;
              m_bcoId = valField(data, C.BCO_ID);
              m_banco = valField(data, C.BCO_NAME);
              m_cueId = valField(data, C.CUE_ID);
              m_cuenta = valField(data, C.CUE_NAME);
              m_sucId = valField(data, C.SUC_ID);
              m_sucursal = valField(data, C.SUC_NAME);
              m_docId = valField(data, C.DOC_ID);
              m_documento = valField(data, C.DOC_NAME);
              m_doctId = valField(data, C.DOCT_ID);
              m_lgjId = valField(data, C.LGJ_ID);
              m_legajo = valField(data, C.LGJ_CODE);
              m_estId = valField(data, C.EST_ID);
              m_estado = valField(data, C.EST_NAME);
              m_firmado = valField(data, CT.DBCO_FIRMADO);
              m_monId = valField(data, C.MON_ID);
              m_docEditable = valField(data, C.DOC_EDITABLE);
              m_docEditMsg = valField(data, C.DOC_EDIT_MSG);

              m_asId = valField(data, C.AS_ID);

              m_taPropuesto = valField(data, C.TA_PROPUESTO);
              m_taMascara = valField(data, C.TA_MASCARA);

              m_lastDocId = m_docId;
              m_lastBcoId = m_bcoId;
              m_lastCueId = m_cueId;
              m_lastMonId = m_monId;
              m_lastDocName = m_documento;
              m_lastBcoName = m_banco;
              m_lastCueName = m_cuenta;

              m_lastMonIdCotizacion = m_monId;
              m_lastFecha = m_fecha;

            }
            else {
              m_id = NO_ID;
              m_numero = 0;
              m_nroDoc = "";
              m_descrip = "";
              m_fecha = Cairo.Dates.today();
              m_total = 0;
              m_doctId = NO_ID;
              m_lgjId = NO_ID;
              m_legajo = "";
              m_cotizacion = 0;
              m_estId = NO_ID;
              m_estado = "";
              m_sucId = Cairo.User.getSucId();
              m_sucursal = Cairo.User.getSucName();
              m_firmado = false;

              m_docId = m_lastDocId;
              m_bcoId = m_lastBcoId;
              m_cueId = m_lastCueId;
              m_monId = m_lastMonId;
              m_banco = m_lastBcoName;
              m_documento = m_lastDocName;
              m_cuenta = m_lastCueName;

              m_asId = NO_ID;

              m_taPropuesto = false;
              m_taMascara = "";

              m_lastMonIdCotizacion = NO_ID;

              if(m_lastMonIdCotizacion !== m_lastMonId) {
                m_lastMonIdCotizacion = NO_ID;
              }

              m_lastFecha = Cairo.Constants.NO_DATE;

              if(m_lastMonId === m_defaultCurrency.id) {
                m_cotizacion = 0;
                m_lastMonIdCotizacion = m_lastMonId;
              }
              else {
                if(m_docId !== NO_ID && m_lastMonIdCotizacion === NO_ID) {
                  p = D.getCurrencyRate(m_lastMonId, m_fecha).then(function(rate) {
                    m_cotizacion = rate;
                  });
                }
              }

              m_data = emptyData;

              p = p || P.resolvedPromise(true);

              p = p
                .then(P.call(D.editableStatus, m_docId, CS.NEW_DEPOSITO_BANCO))
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

      var saveCheques = function(mainRegister) {

        var transaction = DB.createTransaction();

        transaction.setTable(CT.DEPOSITO_BANCO_ITEM_CHEQUE_TMP);

        var rows = getCheques().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();
          register.setFieldId(CT.DBCOI_TMP_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var fields = register.getFields();

          var _countj = row.size();
          for(var _j = 0; _j < _countj; _j++) {

            var cell = row.item(_j);
            switch (cell.getKey()) {

              case KI_DBCOI_ID:
                if(m_copy) {
                  fields.add(CT.DBCOI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(CT.DBCOI_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KICH_DESCRIP:
                fields.add(CT.DBCOI_DESCRIP, cell.getValue(), Types.text);
                break;

              case KICH_CHEQUERA:
                fields.add(CT.CHQ_ID, cell.getId(), Types.id);
                break;

              case KICH_CHEQUE:
                fields.add(CT.DBCOI_TMP_CHEQUE, cell.getValue(), Types.text);
                break;

              case KICH_CHEQ_ID:
                fields.add(CT.CHEQ_ID, cell.getId(), Types.id);
                break;

              case KICH_CLE_ID:
                fields.add(C.CLE_ID, cell.getId(), Types.id);
                break;

              case KICH_FECHACOBRO:
                fields.add(CT.DBCOI_TMP_FECHA_COBRO, cell.getValue(), Types.date);
                break;

              case KICH_FECHAVTO:
                fields.add(CT.DBCOI_TMP_FECHA_VTO, cell.getValue(), Types.date);
                break;

              case KI_CUE_ID_HABER:
                fields.add(C.CUE_ID, cell.getId(), Types.id);
                break;

              case KICH_IMPORTEORIGEN:
                fields.add(CT.DBCOI_IMPORTEORIGEN, val(cell.getValue()), Types.currency);
                break;

              case KICH_IMPORTE:
                fields.add(CT.DBCOI_IMPORTE, val(cell.getValue()), Types.currency);
                break;
            }
          }

          m_orden = m_orden + 1;
          fields.add(CT.DBCOI_ORDEN, m_orden, Types.integer);
          fields.add(CT.DBCOI_TIPO, CT.DepositoBancoItemTipo.ITEM_CHEQUES, Types.integer);

          transaction.addRegister(register);
        }

        if(m_chequesDeleted !== "" && m_id !== NO_ID && !m_copy) {

          transaction.setDeletedList(m_chequesDeleted);
        }

        mainRegister.addTransaction(transaction);
      };

      var saveTCheques = function(mainRegister, cotizacion, isDefaultCurrency) {

        var transaction = DB.createTransaction();

        transaction.setTable(CT.DEPOSITO_BANCO_ITEM_CHEQUET_TMP);

        var rows = getTCheques().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();
          register.setFieldId(CT.DBCOI_TMP_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var fields = register.getFields();

          var origen = 0;

          var _countj = row.size();
          for(var _j = 0; _j < _countj; _j++) {

            var cell = row.item(_j);
            switch (cell.getKey()) {

              case KI_DBCOI_ID:
                if(m_copy) {
                  fields.add(CT.DBCOI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(CT.DBCOI_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KI_DESCRIP:
                fields.add(CT.DBCOI_DESCRIP, cell.getValue(), Types.text);
                break;

              case KI_CUE_ID:
                fields.add(C.CUE_ID, cell.getId(), Types.id);
                break;

              case KI_CHEQ_ID:
                fields.add(CT.CHEQ_ID, cell.getId(), Types.id);
                break;

              case KI_IMPORTE:
                origen = cell.getValue();
                break;
            }
          }

          fields.add(CT.DBCOI_IMPORTE, origen * cotizacion, Types.currency);

          if(isDefaultCurrency) {
            fields.add(CT.DBCOI_IMPORTEORIGEN, 0, Types.currency);
          }
          else {
            fields.add(CT.DBCOI_IMPORTEORIGEN, origen, Types.currency);
          }

          m_orden = m_orden + 1;
          fields.add(CT.DBCOI_ORDEN, m_orden, Types.integer);
          fields.add(CT.DBCOI_TIPO, CT.DepositoBancoItemTipo.ITEM_CHEQUEST, Types.integer);

          transaction.addRegister(register);
        }

        if(m_chequesTDeleted !== "" && m_id !== NO_ID && !m_copy) {

          transaction.setDeletedList(m_chequesTDeleted);
        }

        mainRegister.addTransaction(transaction);
      };

      var saveEfectivo = function(mainRegister, cotizacion, isDefaultCurrency) {

        var transaction = DB.createTransaction();

        transaction.setTable(CT.DEPOSITO_BANCO_ITEM_EFECTIVO_TMP);

        var rows = getEfectivo().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();
          register.setFieldId(CT.DBCOI_TMP_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var fields = register.getFields();

          var origen = 0;

          var _countj = row.size();
          for(var _j = 0; _j < _countj; _j++) {

            var cell = row.item(_j);
            switch (cell.getKey()) {

              case KI_DBCOI_ID:
                if(m_copy) {
                  fields.add(CT.DBCOI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(CT.DBCOI_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KI_DESCRIP:
                fields.add(CT.DBCOI_DESCRIP, cell.getValue(), Types.text);
                break;

              case KI_CUE_ID_HABER:
                fields.add(C.CUE_ID, cell.getId(), Types.id);
                break;

              case KI_IMPORTE:
                origen = cell.getValue();
                break;
            }
          }

          fields.add(CT.DBCOI_IMPORTE, origen * cotizacion, Types.currency);

          if(isDefaultCurrency) {
            fields.add(CT.DBCOI_IMPORTEORIGEN, 0, Types.currency);
          }
          else {
            fields.add(CT.DBCOI_IMPORTEORIGEN, origen, Types.currency);
          }

          m_orden = m_orden + 1;
          fields.add(CT.DBCOI_ORDEN, m_orden, Types.integer);
          fields.add(CT.DBCOI_TIPO, CT.DepositoBancoItemTipo.ITEM_EFECTIVO, Types.integer);

          transaction.addRegister(register);
        }

        if(m_efectivoDeleted !== "" && m_id !== NO_ID && !m_copy) {

          transaction.setDeletedList(m_efectivoDeleted);
        }

        mainRegister.addTransaction(transaction);
      };

      var showTotals = function() {
        var total = 0;
        var row;

        var _count = getCheques().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getCheques().getRows().item(_i);
          total = total + cellFloat(row, KICH_IMPORTE);
        }

        var _count = getTCheques().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getTCheques().getRows().item(_i);
          total = total + cellFloat(row, KI_IMPORTE);
        }

        var _count = getEfectivo().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getEfectivo().getRows().item(_i);
          total = total + cellFloat(row, KI_IMPORTE);
        }

        m_footerProps.item(CT.DBCO_TOTAL).setValue(total);

        m_footer.showValue(m_footerProps.item(CT.DBCO_TOTAL));
      };

      var setEnabled = function() {
        var bState = false;

        if(m_docEditable) {
          bState = m_properties.item(C.DOC_ID).getSelectId() !== NO_ID;
        }

        setEnabledAux(bState);
      };

      var setEnabledAux = function(bState) {
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

        var _count = m_items.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {
          m_items.getProperties().item(_i).setEnabled(bState);
        }

        m_dialog.refreshEnabledState(m_itemsProps);
        m_dialog.refreshEnabledState(m_properties);
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

            return load(NO_ID)
                .whenSuccess(call(D.setDocNumber, m_docId, m_dialog, CT.DBCO_NRODOC))
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

        m_properties.item(C.DOC_ID)
        .setSelectId(m_docId)
        .setValue(m_documento);

        m_properties.item(CT.DBCO_FECHA)
        .setValue(m_fecha);

        m_properties.item(C.BCO_ID)
        .setSelectId(m_bcoId)
        .setValue(m_banco);

        m_properties.item(C.CUE_ID)
        .setSelectId(m_cueId)
        .setValue(m_cuenta)
        .setSelectFilter(Cairo.Documents.getCuentaFilterForBanco(m_bcoId));

        m_properties.item(Cairo.Constants.NUMBER_ID)
        .setValue(m_numero);

        m_properties.item(Cairo.Constants.STATUS_ID)
        .setValue(m_estado);

        m_properties.item(CT.DBCO_NRODOC)
        .setValue(m_nroDoc)
        .setTextMask(m_taMascara)
        .setTextAlign(Dialogs.TextAlign.right);

        m_properties.item(CT.DBCO_COTIZACION)
        .setValue(m_cotizacion);

        m_properties.item(C.SUC_ID)
        .setSelectId(m_sucId)
        .setValue(m_sucursal);

        m_properties.item(C.LGJ_ID)
        .setSelectId(m_lgjId)
        .setValue(m_legajo);

        m_properties.item(CT.DBCO_DESCRIP)
        .setValue(m_descrip);

        m_dialog.showValues(m_dialog.getProperties());
        m_dialog.resetChanged();

        var cotizacion = (m_cotizacion !== 0) ? m_cotizacion : 1;

        m_efectivoDeleted = "";
        m_chequesDeleted = "";
        m_chequesTDeleted = "";

        loadEfectivo(getProperty(m_items, C_EFECTIVO), cotizacion);
        loadCheques(getProperty(m_items, C_CHEQUES));
        loadChequesT(getProperty(m_items, C_CHEQUEST));

        m_items.refreshColumnProperties(getProperty(m_items, C_CHEQUEST), C_COLCHEQUE);

        m_items.showValues(m_items.getProperties());

        m_footerProps.item(CT.DBCO_TOTAL)
        .setValue(m_total);

        m_footer.showValues(m_footerProps);

        setEnabled();
      };

      var getCotizacion = function() {
        return m_properties.item(CT.DBCO_COTIZACION);
      };

      var getTCheques = function() {
        return getTChequesProperty().getGrid();
      };

      var getCheques = function() {
        return getChequesProperty().getGrid();
      };

      var getEfectivo = function() {
        return getEfectivoProperty().getGrid();
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

      var getCuenta = function() {
        return m_properties.item(C.CUE_ID);
      };

      var getBanco = function() {
        return m_properties.item(C.BCO_ID);
      };

      var getFecha = function() {
        return m_properties.item(CT.DBCO_FECHA).getValue();
      };

      var showBanco = function() {
        var p;
        var cueId = getCuenta().getSelectId();

        if(cueId) {

          p = DB.getData(
              "load[" + m_apiPath + "tesoreria/cuenta/" + cueId.toString() + "/banco]");

          var bcoName = "";
          var bcoId = NO_ID;

          p = p.whenSuccessWithResult(function(response) {

            bcoName = response.bco_name;
            bcoId = response.bco_id;

          }).then(function() {

            var prop = getBanco()
                .setValue(bcoName)
                .setSelectId(bcoId);

            m_dialog.showValue(prop);
            m_dialog.validateProp(prop);

            m_lastBcoId = bcoId;
            m_lastBcoName = bcoName;
          });
        }

        return p || P.resolvedPromise(true);
      };

      var getDocId = function() {
        return m_properties.item(C.DOC_ID).getSelectId();
      };

      self.getObjectType = function() {
        return "cairo.modules.tesoreria.depositobanco";
      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

    Edit.Controller.edit = function(id) {

      Cairo.LoadingMessage.show("Deposito Bancario", "Loading Deposito Bancario from CrowSoft Cairo server.");
      var editor = Cairo.DepositoBanco.Edit.Controller.getEditor();

      var dialog = Cairo.Dialogs.Views.Controller.newDialog();
      var dialogItems = Cairo.Dialogs.Views.Controller.newDialog();
      var dialogFooter = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.setItems(dialogItems);
      editor.setFooter(dialogFooter);
      editor.edit(id).then(Cairo.LoadingMessage.close);
    };

  });

  Cairo.module("DepositoBancoListDoc.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;
      var P = Cairo.Promises;
      var NO_ID = Cairo.Constants.NO_ID;
      var DB = Cairo.Database;
      var D = Cairo.Documents;
      var M = Cairo.Modal;
      var C = Cairo.General.Constants;
      var CT = Cairo.Tesoreria.Constants;
      var Types = Cairo.Constants.Types;
      var Dialogs = Cairo.Dialogs;
      var T = Dialogs.PropertyType;
      var val = Cairo.Util.val;
      var isDate = Cairo.Util.isDate;
      var getDateValue = Cairo.Util.getDateValue;
      var today = Cairo.Dates.today;
      var valField = DB.valField;

      var C_MODULE = "cDepositoBancoListDoc";

      var C_FECHA_INI = "FechaIni";
      var C_FECHA_FIN = "FechaFin";

      var K_FECHA_INI = 1;
      var K_FECHA_FIN = 2;
      var K_BCO_ID = 4;
      var K_CUE_ID = 5;
      var K_EST_ID = 6;
      var K_SUC_ID = 7;
      var K_DOC_ID = 9;
      var K_EMP_ID = 100;

      var m_fechaIni = null;
      var m_fechaFin = null;
      var m_bcoId = "";
      var m_banco = "";
      var m_cueId = "";
      var m_cuenta = "";
      var m_estId = "";
      var m_estado = "";
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
      var m_menuAddNote = 0;
      var m_menuShowAsiento = 0;
      var m_menuSign = 0;

      var m_apiPath = DB.getAPIVersion();
      var SAVE_ERROR = getText(2238, ""); // Error al grabar los párametros de navegación de Xxxx

      self.list = function() {
        initialize();
        return load()
          .whenSuccess(loadCollection);
      };

      self.edit = function(dbcoId) {
        m_listController.edit(dbcoId);
      };

      self.deleteItem = function(dbcoId) {
        return m_listController.destroy(dbcoId);
      };

      self.showDocDigital = function() {
        var _rtn = false;

        try {

          var dbcoId = m_dialog.getId();
          if(dbcoId === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(CT.DEPOSITO_BANCO);
          doc.setClientTableID(dbcoId);

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

            case m_menuShowNotes:
              showNotes();
              break;

            case m_menuAddNote:
              addNote();
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

        c = m_properties.add(null, C.BCO_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.BANCO);
        c.setName(getText(1122, "")); // Banco
        c.setKey(K_BCO_ID);
        c.setValue(m_banco);
        c.setSelectId(val(m_bcoId));
        c.setSelectIntValue(m_bcoId);

        c = m_properties.add(null, C.CUE_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.CUENTA);
        c.setName(getText(1267, "")); // Cuenta
        c.setKey(K_CUE_ID);
        c.setValue(m_cuenta);
        c.setSelectId(val(m_cueId));
        c.setSelectIntValue(m_cueId);

        c = m_properties.add(null, C.EST_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.ESTADOS);
        c.setName(getText(1568, "")); // Estado
        c.setKey(K_EST_ID);
        c.setValue(m_estado);
        c.setSelectId(val(m_estId));
        c.setSelectIntValue(m_estId);

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
        c.setSelectFilter(D.MOVIMIENTO_FONDO_LIST_DOC_FILTER);

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

        return DB.getData("load[" + m_apiPath + "tesoreria/depositosbanco/parameters]").then(
          function(response) {


            m_empId = Cairo.Company.getId();
            m_empresa = Cairo.Company.getName();

            if(response.success !== true) { return false; }

            if(response.data.id === NO_ID) {

              m_fechaIniV = "";
              m_fechaIni = Cairo.Dates.today();
              m_fechaFinV = "";
              m_fechaFin = Cairo.Dates.DateNames.getDateByName('h-60');

              m_bcoId = NO_ID;
              m_banco = "";
              m_cueId = NO_ID;
              m_cuenta = "";
              m_estId = NO_ID;
              m_estado = "";
              m_sucId = NO_ID;
              m_sucursal = "";
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

              m_bcoId = valField(response.data, C.PROV_ID);
              m_estId = valField(response.data, C.EST_ID);
              m_cueId = valField(response.data, C.CCOS_ID);
              m_sucId = valField(response.data, C.SUC_ID);
              m_docId = valField(response.data, C.DOC_ID);
              m_empId = valField(response.data, C.EMP_ID);

              m_banco = valField(response.data, C.BCO_NAME);
              m_estado = valField(response.data, C.EST_NAME);
              m_cuenta = valField(response.data, C.CUE_NAME);
              m_sucursal = valField(response.data, C.SUC_NAME);
              m_documento = valField(response.data, C.DOC_NAME);
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

          case K_BCO_ID:

            var property = m_properties.item(C.BCO_ID);
            m_banco = property.getValue();
            m_bcoId = property.getSelectIntValue();
            break;

          case K_CUE_ID:

            var property = m_properties.item(C.CUE_ID);
            m_cuenta = property.getValue();
            m_cueId = property.getSelectIntValue();
            break;

          case K_SUC_ID:

            var property = m_properties.item(C.SUC_ID);
            m_sucursal = property.getValue();
            m_sucId = property.getSelectIntValue();
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
          bcoId: m_bcoId,
          estId: m_estId,
          cueId: m_cueId,
          sucId: m_sucId,
          docId: m_docId,
          empId: m_empId
        };

        return DB.getData("load[" + m_apiPath + "tesoreria/depositosbanco]", null, params);
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.LDP_ID);
        register.setTable(C.LISTA_DOCUMENTO_PARAMETRO);

        register.setPath(m_apiPath + "tesoreria/depositosbanco");

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

            case K_BCO_ID:
              fields.add(C.BCO_ID, property.getSelectIntValue(), Types.text);
              break;

            case K_CUE_ID:
              fields.add(C.CUE_ID, property.getSelectIntValue(), Types.text);
              break;

            case K_EST_ID:
              fields.add(C.EST_ID, property.getSelectIntValue(), Types.text);
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
        return "#tesoreria/depositobancos";
      };

      self.getEditorName = function() {
        return "depositobancos";
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

        m_menuAddNote = m_dialog.addMenu(getText(1615, "")); // Agregar Nota

        m_menuShowNotes = m_dialog.addMenu(getText(1616, "")); // Ver Notas
        m_dialog.addMenu("-");

        m_menuShowAsiento = m_dialog.addMenu(getText(1692, ""));
      };

      var showNotes = function() {
        var dbcoId = m_dialog.getId();
        return DB.getData("load[" + m_apiPath + "tesoreria/depositobanco/notes]", dbcoId)
            .whenSuccessWithResult(D.showNotes);
      };

      var addNote = function() {
        var dbcoId = m_dialog.getId();
        return D.addNote(D.Types.DEPOSITO_BANCO, dbcoId, false);
      };

      var signDocument = function() {
        var dbcoId = m_dialog.getId();

        if(dbcoId === NO_ID) {
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

        return D.getDocumentSignStatus(D.Types.MOVIMIENTO_FONDO, dbcoId)
                .whenSuccessWithResult(getAction)
                .whenSuccess(D.signDocument(D.Types.MOVIMIENTO_FONDO, dbcoId))
                .whenSuccessWithResult(refreshRow)
            ;
      };

      var showAsiento = function() {
        var dbcoId = m_dialog.getId();
        if(dbcoId !== NO_ID) {

          D.getAsientoId(D.Types.MOVIMIENTO_FONDO, dbcoId).whenSuccessWithResult(function(response) {
            D.showDocAux(response.as_id, "Asiento");
          });
        }
      };

      var initialize = function() {
        try {
          m_title = getText(2130, ""); // Depósitos Bancarios
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

  Cairo.module("DepositoBanco.List", function(List, Cairo, Backbone, Marionette, $, _) {

    var NO_ID = Cairo.Constants.NO_ID;
    var DB = Cairo.Database;
    var C_MODULE = "cDepositoBanco";
    var P = Cairo.Promises;

    List.Controller = {
      list: function() {

        var self = this;

        var createListDialog = function() {

          var editors = Cairo.Editors.depositoBancoEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.depositoBancoEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "DepositoBanco",
            entityName: "depositobanco",
            entitiesName: "depositobancos"
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
              Cairo.LoadingMessage.show("DepositoBanco", "Loading Depositos Bancarios from CrowSoft Cairo server.");

              var editor = Cairo.DepositoBanco.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.Tesoreria.DELETE_DEPOSITO_BANCO)) {
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
              DB.getAPIVersion() + "tesoreria/depositobanco", id,
              Cairo.Constants.DELETE_FUNCTION, C_MODULE).whenSuccess(closeDialog, false);
          };

          // progress message
          //
          Cairo.LoadingMessage.show("DepositoBanco", "Loading Depositos Bancarios from CrowSoft Cairo server.");

          self.documentList = Cairo.DepositoBancoListDoc.Edit.Controller.getEditor();
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