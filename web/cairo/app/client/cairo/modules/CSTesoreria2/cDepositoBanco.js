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
      var CC = Cairo.Compras.Constants;
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

      var C_MODULE = "cDepositoBanco";

      var C_EFECTIVO = "Efectivo";
      var C_CHEQUES = "Cheques";
      var C_CHEQUEST = "Cheques En Cartera";

      var C_CHEQUERA = "Chequera";
      var C_COLCHEQUE = "cheque";

      var C_ITEMS = "ITEMS";

      var K_NUMERO = 1;
      var K_NRODOC = 2;
      var K_DESCRIP = 3;
      var K_FECHA = 4;
      var K_TOTAL = 9;
      var K_BCO_ID = 10;
      var K_DOC_ID = 11;
      var K_DOCT_ID = 12;

      var K_EFECTIVO = 105;
      var K_CHEQUES = 106;
      var K_CHEQUEST = 107;

      var K_EST_ID = 17;
      var K_SUC_ID = 19;
      var K_LGJ_ID = 27;
      var K_COTIZACION = 28;
      var K_CUE_ID = 29;

      var KI_DBCOI_ID = 2;
      var KI_ORDEN = 3;
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
      var m_nrodoc = "";
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
      var m_creado = null;
      var m_modificado = null;
      var m_modifico = 0;
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

      var m_lastDocId = 0;
      var m_lastDocName = "";

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

      var m_monDefault = 0;

      var m_efectivoDeleted = "";
      var m_chequesDeleted = "";
      var m_chequesTDeleted = "";

      var m_orden = 0;

      var m_apiPath = DB.getAPIVersion();

      var emptyData = {
        cheques: [],
        chequesT: [],
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

      var initMembers = function() {

        if(!Cairo.Security.docHasPermissionTo(
          CS.NEW_DEPOSITO_BANCO,
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

        D.setDocNumber(m_lastDocId, m_dialog, CT.DBCO_NRODOC).then(
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

          if(!m_docEditable && getDocId().getSelectId() !== NO_ID) {
            if(m_docEditMsg !== "") {
              p = M.showWarning(m_docEditMsg);
            }
          }

          return p || P.resolvedPromise();

        }).then(function() {

            var p = null;

            var docId = getDocId().getSelectId();

            if(docId === NO_ID) {
              p = M.showInfo(getText(1562, ""));
            }

            return p || P.resolvedPromise();

          }).then(function() {

            return D.setDocNumber(m_lastDocId, m_dialog, CC.AS_NRODOC)

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
        var _rtn = null;
        try {

          if(m_id === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(CC.DEPOSITO_BANCO);
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

          case Dialogs.Message.MSG_GRID_ROW_DELETED:

            p = true;
            showTotales();
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

          case Dialogs.Message.MSG_DOC_SEARCH                    :

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
              p = Cairo.History.show(Cairo.Tables.ORDENES_DE_PAGO, m_id, m_documento + " " + m_nrodoc);
            }
            else {
              p = M.showInfo(getText(1552, "")); // El documento aun no ha sido guardado
            }
            break;
        }

        return p || P.resolvedPromise();
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

                  cument // when the document property is changed and the dialog was
                  //
                  if(m_id !== NO_ID && m_docId !== m_lastDocId) {
                    p = self.edit(D.Constants.DOC_CHANGED);
                  }

                  return p || P.resolvedPromise(true);

                })
                .whenSuccess(function() {

                  return D.setDocNumber(m_lastDocId, m_dialog, CC.DBCO_NRODOC)
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

          case K_BCO_ID:

            getFilterCuenta(getBanco().getSelectId())
              .whenSuccessWithResult(function(result) {

                var prop = getCuenta();
                prop.setSelectFilter(result.filter);
                m_dialog.showValue(prop);
                m_dialog.validateProp(prop, C.CUE_ID)
              });
            break;

          case K_CUE_ID:

            showBanco();
            showCotizacion();
            break;

          case K_FECHA:

            m_lastMonIdCotizacion = NO_ID;
            showCotizacion();
            break;
        }
      };

      self.save = function() {

        var p;

        var cotizacion = 0;
        var totalOrigen = 0;
        var isDefaultCurrency = false;
        var total = 0;

        p = D.docCanBeEdited(m_docEditable, m_docEditMsg)
          .whenSuccess(function() {
            return D.docCanBeSaved(m_dialog, CC.DBCO_FECHA);
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
            for (var _i = 0; _i < _count; _i++) {

              var property = m_properties.item(_i);

              switch (property.getKey()) {
                case K_NUMERO:
                  fields.add(CT.DBCO_NUMERO, property.getValue(), Types.long);
                  break;

                case K_NRODOC:
                  fields.add(CT.DBCO_NRODOC, property.getValue(), Types.text);
                  break;

                case K_DESCRIP:
                  fields.add(CT.DBCO_DESCRIP, property.getValue(), Types.text);
                  break;

                case K_FECHA:
                  fields.add(CT.DBCO_FECHA, property.getValue(), Types.date);
                  break;

                case K_BCO_ID:
                  fields.add(CT.BCO_ID, property.getSelectId(), Types.id);
                  break;

                case K_SUC_ID:
                  fields.add(CT.SUC_ID, property.getSelectId(), Types.id);
                  break;

                case K_DOC_ID:
                  fields.add(C.DOC_ID, property.getSelectId(), Types.id);
                  break;

                case K_CUE_ID:
                  fields.add(CT.CUE_ID, property.getSelectId(), Types.id);
                  break;

                case K_COTIZACION:
                  cotizacion = property.getValue();
                  fields.add(CT.DBCO_COTIZACION, property.getValue(), Types.double);
                  break;

                case K_LGJ_ID:
                  fields.add(CT.LGJ_ID, property.getSelectId(), Types.id);
                  break;
              }
            }

            if(cotizacion === 0) {
              cotizacion = 1;
              isDefaultCurrency = true;
            }

            var _count = m_footerProps.size();
            for (var _i = 0; _i < _count; _i++) {

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
                        };
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
        return TITLE + (m_id !== NO_ID ? " " + m_nrodoc : "");
      };

      self.validate = function() {

        for (var _i = 0, _count = m_properties.size(); _i < _count; _i++) {

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

        var p = DB.getData("load[" + m_apiPath + "tesoreria/depositobanco/info]", id)
          .whenSuccessWithResult(loadData, false);

        return p;
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
              loadChequesT(getTChequesProperty());
              loadEfectivo(getEfectivoProperty());
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
        try {

          switch (key) {
            case K_EFECTIVO:
              showTotales();
              break;

            case K_CHEQUES:
              columnAfterUpdateCheque(m_items.getProperties().item(C_CHEQUES), lRow, lCol);
              break;

            case K_CHEQUEST:
              showTotales();
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnAfterUpdate", C_MODULE, "");
        }

        return P.resolvedPromise(true);
      };

      self.columnAfterEdit = function(key, lRow, lCol, newValue, newValueID) {
        var p = null;

        try {

          switch (key) {

            case K_CHEQUEST:
              p = columnAfterEdit(m_itemsProps.item(C_CHEQUEST), lRow, lCol, newValue, newValueID);
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

      var updateColCuenta = function(row, cueId, info) {
        var cell = getCell(row, KICH_MON_ID);
        cell.setValue(info.monName);
        cell.setId(info.monId);
        if(info.monId === m_defaultCurrency.id || info.monId === 0) {
          getCell(row, KICH_IMPORTEORIGEN).setValue(0);
        }

        D.updateChequeraFilter(
          property,
          KICH_CHEQUERA,
          cueId,
          m_items
        )
      };

      var columnAfterUpdateCheque = function(property, lRow, lCol) {

        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).getKey()) {

          case KICH_IMPORTEORIGEN:

            var row = grid.getRows(lRow);
            var cell = getCell(row, KICH_MON_ID);
            
            if(cell.getId() !== m_monDefault || cell.getId() === 0) {
              getCell(row, KICH_IMPORTE).setValue(val(getCell(row, KICH_IMPORTEORIGEN).getValue()) * val(getCotizacion().getValue()));
            }
            else {
              getCell(row, KICH_IMPORTEORIGEN).setValue(0);
            }
            showTotales();
            break;

          case KICH_IMPORTE:

            showTotales();
            break;

          case KI_CUE_ID_HABER:

            var cueId = getCell(row, KI_CUE_ID_HABER).getId();
            D.getCurrencyFromAccount(cueId)
              .whenSuccessWithResult(call(updateColCuenta, row, cueId));
            break;

          case KICH_CHEQUERA:

            var row = grid.getRows().item(lRow);

            D.getChequeNumber(getCell(row, KICH_CHEQUERA).getId()).whenSuccessWithResult(function(response) {
              getCell(row, KICH_CHEQUE).setValue(valField(response.data, C.CHEQ_NUMERO_DOC));
            });
            break;
            
        }

        return P.resolvedPromise(true);
      };

      var columnAfterEdit = function(property, lRow, lCol, newValue, newValueID) {
        var row = null;

        switch (property.getGrid().getColumns().item(lCol).getKey()) {
          case KI_CHEQ_ID:
            row = property.getGrid().getRows(lRow);
            setChequeData(row, newValueID);
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

      var validateRow = function(key, row, rowIndex) {

        var p = null;

        try {

          switch (key) {

            case K_EFECTIVO:
              p = validateRow(row, rowIndex);
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
        for (var _i = 0; _i < _count; _i++) {

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
        for (var _i = 0; _i < _count; _i++) {

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
        for (var _i = 0; _i < _count; _i++) {

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
        for (var _i = 0; _i < _count; _i++) {

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

      var validateRow = function(row, rowIndex) {

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {

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
        for (var _i = 0; _i < _count; _i++) {

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

        if(!bOrigen && monId !== m_monDefault) {
          return M.showInfoWithFalse(getText(2118, "", strRow)); // Debe indicar un importe para la moneda extranjera (1)
        }

        return P.resolvedPromise(true);
      };

      // funciones privadas
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
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.DOCUMENTO);
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
          elem.setValue(Cairo.UserConfig.getDocDbcoNombre());

          validateDocDefault = elem.getSelectId() !== NO_ID;
        }

        elem.setSelectFilter(D.DEPOSITOS_BANCARIOS_DOC_FILTER);

        elem = properties.add(null, Cairo.Constants.NUMBER_ID);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.integer);
        elem.setName(getText(1065, "")); // Número
        elem.setKey(K_NUMERO);
        elem.setValue(m_numero);
        elem.setEnabled(false);

        elem = properties.add(null, Cairo.Constants.STATUS_ID);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(getText(1568, "")); // Estado
        elem.setKey(K_EST_ID);
        elem.setValue(m_estado);
        elem.setEnabled(false);

        elem = properties.add(null, CT.DBCO_FECHA);
        elem.setType(Dialogs.PropertyType.date);
        elem.setName(getText(1569, "")); // Fecha
        elem.setKey(K_FECHA);
        elem.setValue(m_fecha);

        elem = properties.add(null, CT.DBCO_NRODOC);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(getText(1065, "")); // Número
        elem.setSize(50);
        elem.setKey(K_NRODOC);
        elem.setValue(m_nrodoc);
        elem.setTextMask(m_taMascara);
        elem.setTextAlign(Dialogs.TextAlign.right);

        elem = properties.add(null, CT.BCO_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.BANCO);
        elem.setName(getText(1122, "")); // Banco
        elem.setKey(K_BCO_ID);
        elem.setSelectId(m_bcoId);
        elem.setValue(m_banco);
        m_dialog.NewKeyPropFocus = CT.BCO_ID;

        elem = properties.add(null, CT.CUE_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setSelectFilter(getFilterCuenta(m_bcoId));
        elem.setName(getText(1267, "")); // Cuenta
        elem.setKey(K_CUE_ID);
        elem.setSelectId(m_cueId);
        elem.setValue(m_cuenta);

        elem = properties.add(null, CT.LGJ_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.LEGAJOS);
        elem.setName(getText(1575, "")); // Legajo
        elem.setKey(K_LGJ_ID);
        elem.setSelectId(m_lgjId);
        elem.setValue(m_legajo);

        elem = properties.add(null, CT.DBCO_COTIZACION);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1635, "")); // Cotización
        elem.setFormat(Cairo.Settings.getCurrencyRateDecimalsFormat());
        elem.setKey(K_COTIZACION);
        elem.setValue(m_cotizacion);
        elem.setVisible(m_monId !== m_monDefault);

        if(m_cotizacion !== 0) {
          cotizacion = m_cotizacion;
        }
        else {
          cotizacion = 1;
        }

        elem = properties.add(null, CT.SUC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.SUCURSAL);
        elem.setName(getText(1281, "")); // Sucursal
        elem.setKey(K_SUC_ID);
        elem.setSelectId(m_sucId);
        elem.setValue(m_sucursal);

        elem = properties.add(null, CT.DBCO_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
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
        loadEfectivo(elem);
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
        setGridTCheques(elem);
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

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(C.DOC_ID);
        elem.setSelectId(m_docId);
        elem.setValue(m_documento);
        elem.setSelectId(Cairo.UserConfig.getDocDbcoId());
        elem.setValue(Cairo.UserConfig.getDocDbcoNombre());

        var elem = properties.item(Cairo.Constants.NUMBER_ID);
        elem.setValue(m_numero);

        var elem = properties.item(Cairo.Constants.STATUS_ID);
        elem.setValue(m_estado);

        var elem = properties.item(CT.DBCO_FECHA);
        elem.setValue(m_fecha);

        var elem = properties.item(CT.DBCO_NRODOC);
        elem.setValue(m_nrodoc);

        var elem = properties.item(CT.BCO_ID);
        elem.setSelectId(m_bcoId);
        elem.setValue(m_banco);

        var elem = properties.item(CT.CUE_ID);
        elem.setSelectId(m_cueId);
        elem.setValue(m_cuenta);

        var elem = properties.item(CT.LGJ_ID);
        elem.setSelectId(m_lgjId);
        elem.setValue(m_legajo);

        var elem = properties.item(CT.DBCO_COTIZACION);
        elem.setValue(m_cotizacion);

        var elem = properties.item(CT.SUC_ID);
        elem.setSelectId(m_sucId);
        elem.setValue(m_sucursal);

        var elem = properties.item(CT.DBCO_DESCRIP);
        elem.setValue(m_descrip);

        return m_dialog.showValues(properties);
      };

      // Cotizacion
      var showCotizacion = function() {
        var monId = null;
        var dDate = null;
        var iProp = null;
        var bCueChanged = null;

        var w_getCuenta = getCuenta();

        if(!(m_lastCueId === w_getCuenta.getSelectId() && !m_copy)) {
          m_lastCueId = w_getCuenta.getSelectId();
          m_lastCueName = w_getCuenta.getValue();
          bCueChanged = true;
        }

        if(!Cairo.Database.getData(CT.CUENTA, CT.CUE_ID, m_lastCueId, CT.MON_ID, monId)) { return; }

        iProp = m_properties.item(CT.DBCO_COTIZACION);
        iProp.setVisible(monId !== m_monDefault && monId !== NO_ID);

        if(bCueChanged) {

          if(m_lastMonIdCotizacion !== monId || iProp.getValue() === 0) {
            dDate = m_properties.item(CT.DBCO_FECHA).getValue();
            if(!IsDate(dDate)) { dDate = Date; }
            iProp.setValue(cMoneda.getCotizacion(monId, dDate));
            m_lastMonIdCotizacion = monId;
          }
        }

        m_dialog.showValue(iProp);
      };

      //Private Function getMonedaDefault() As Long
      //  Dim sqlstmt As String
      //  Dim rs      As Recordset
      //
      //  sqlstmt = "select mon_id from Moneda where mon_legal <> 0"
      //  If Not gDB.OpenRs(sqlstmt, rs) Then Exit Function
      //
      //  If rs.EOF Then
      //    MsgWarning getText(2150, vbNullString)  'Debe definir cual es la moneda legal con la que opera el sistema
      //    Exit Function
      //  End If
      //
      //  getMonedaDefault = gDB.ValField(rs.Fields, cscMonId)
      //End Function

      var setGridEfectivo = function(property) {

        var o = null;

        var w_grid = property.getGrid();

        w_grid.getColumns().clear();
        w_grid.getRows().clear();

        var w_columns = w_grid.getColumns();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_DBCOI_ID);

        var elem = w_columns.add(null);
        elem.setName(getText(2190, "")); // Cuenta Origen
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setKey(KI_CUE_ID_HABER);
        elem.setSelectFilter(GetHelpFilterCuenta());

        var elem = w_columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_IMPORTE);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setKey(KI_DESCRIP);

        var w_rows = w_grid.getRows();
        for(var _i = 0; _i < m_data.efectivo.length; _i += 1) {

          var elem = w_rows.add(null, rs(CT.DBCOI_ID).Value);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.efectivo[_i], CT.DBCOI_ID);
          elem.setKey(KI_DBCOI_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.efectivo[_i], CT.CUE_NAME);
          elem.Id = Cairo.Database.valField(m_data.efectivo[_i], CT.CUE_ID);
          elem.setKey(KI_CUE_ID_HABER);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.efectivo[_i], CT.DBCOI_IMPORTE) / cotizacion;
          elem.setKey(KI_IMPORTE);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.efectivo[_i], CT.DBCOI_DESCRIP);
          elem.setKey(KI_DESCRIP);

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
        elem.setKey(KI_DBCOI_ID);

        var elem = w_columns.add(null);
        elem.setName(getText(2190, "")); // Cuenta Origen
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);

        //.HelpFilter = cscCuecId & "=" & csECuecBancos
        elem.setSelectFilter(mPublic.self.getHelpFilterChequesP());

        elem.setKey(KI_CUE_ID_HABER);

        var elem = w_columns.add(null, C_CHEQUERA);
        elem.setName(getText(2064, "")); // Chequera
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CHEQUERA);
        elem.setKey(KICH_CHEQUERA);

        var elem = w_columns.add(null);
        elem.setName(getText(2063, "")); // Mon
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setKey(KICH_MON_ID);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        elem.setName(getText(1901, "")); // Origen
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KICH_IMPORTEORIGEN);

        var elem = w_columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KICH_IMPORTE);

        var elem = w_columns.add(null);
        elem.setName(getText(2059, "")); // Nr. Cheque
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KICH_CHEQUE);

        var elem = w_columns.add(null);
        elem.setName(getText(2058, "")); // Cheque
        elem.setType(Dialogs.PropertyType.text);
        elem.setEnabled(false);
        elem.setKey(KICH_CHEQ_ID);

        var elem = w_columns.add(null);
        elem.setName(getText(2065, "")); // Depositar el
        elem.setType(Dialogs.PropertyType.date);
        elem.setDefaultValue(new cABMGridRowValue());
        elem.getDefaultValue().setValue(Date);
        elem.setKey(KICH_FECHACOBRO);

        var elem = w_columns.add(null);
        elem.setName(getText(1634, "")); // Vto.
        elem.setType(Dialogs.PropertyType.date);
        elem.setDefaultValue(new cABMGridRowValue());
        elem.getDefaultValue().setValue(DateAdd("m", 1, Date));
        elem.setKey(KICH_FECHAVTO);

        var elem = w_columns.add(null);
        elem.setName(getText(1083, "")); // Clering
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CLEARING);
        elem.setKey(KICH_CLE_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setKey(KICH_DESCRIP);

        var w_rows = w_grid.getRows();

        for(var _i = 0; _i < m_data.cheques.length; _i += 1) {

          var elem = w_rows.add(null, rs(CT.DBCOI_ID).Value);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], CT.DBCOI_ID);
          elem.setKey(KI_DBCOI_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], CT.CUE_NAME);
          elem.Id = Cairo.Database.valField(m_data.cheques[_i], CT.CUE_ID);
          elem.setKey(KI_CUE_ID_HABER);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], CT.CHQ_CODE);
          elem.Id = Cairo.Database.valField(m_data.cheques[_i], CT.CHQ_ID);
          elem.setKey(KICH_CHEQUERA);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], CT.MON_NAME);
          elem.Id = Cairo.Database.valField(m_data.cheques[_i], CT.MON_ID);
          elem.setKey(KICH_MON_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], CT.DBCOI_IMPORTEORIGEN);
          elem.setKey(KICH_IMPORTEORIGEN);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], CT.DBCOI_IMPORTE);
          elem.setKey(KICH_IMPORTE);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], CT.CHEQ_NUMERO_DOC);
          elem.setKey(KICH_CHEQUE);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], CT.CHEQ_NUMERO);
          elem.Id = Cairo.Database.valField(m_data.cheques[_i], CT.CHEQ_ID);
          elem.setKey(KICH_CHEQ_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], CT.CHEQ_FECHA_COBRO);
          elem.setKey(KICH_FECHACOBRO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], CT.CHEQ_FECHA_VTO);
          elem.setKey(KICH_FECHAVTO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], CT.CLE_NAME);
          elem.Id = Cairo.Database.valField(m_data.cheques[_i], CT.CLE_ID);
          elem.setKey(KICH_CLE_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], CT.DBCOI_DESCRIP);
          elem.setKey(KICH_DESCRIP);

        }

        return true;
      };

      var setGridTCheques = function(property) {

        var o = null;
        var colCheque = null;
        var colCheqFilter = null;

        var w_columns = property.getGrid().getColumns();
        w_columns.clear();
        property.getGrid().getRows().clear();

        o = w_columns.add(null);
        o.setVisible(false);
        o.setKey(KI_DBCOI_ID);

        o = w_columns.add(null);
        o.setName(getText(1122, "")); // Banco
        o.setType(Dialogs.PropertyType.text);
        o.setWidth(1800);
        o.setKey(KI_BCO_ID);
        o.setEnabled(false);

        o = w_columns.add(null);
        o.setVisible(false);
        o.setKey(KI_CHEQ_ID_SAVED);

        o = w_columns.add(null, C_COLCHEQUE);
        o.setName(getText(2058, "")); // Cheque
        o.setType(Dialogs.PropertyType.select);
        o.setTable(csETablesTesoreria.cSCHEQUE);
        o.setWidth(1400);
        o.setKey(KI_CHEQ_ID);
        colCheque = o;

        o = w_columns.add(null);
        o.setName(getText(1267, "")); // Cuenta
        o.setType(Dialogs.PropertyType.select);
        o.setTable(Cairo.Tables.CUENTA);
        o.setSelectFilter(getFilterCuentaItem());
        o.setWidth(2200);
        o.setEnabled(false);
        o.setKey(KI_CUE_ID);

        o = w_columns.add(null);
        o.setName(Cairo.Constants.DESCRIPTION_LABEL);
        o.setType(Dialogs.PropertyType.text);
        o.setSubType(Dialogs.PropertySubType.textButtonEx);
        o.setWidth(3000);
        o.setKey(KI_DESCRIP);

        o = w_columns.add(null);
        o.setName(getText(2162, "")); // Importe Origen
        o.setType(Dialogs.PropertyType.numeric);
        o.setFormat(m_generalConfig.getFormatDecImporte());
        o.setSubType(Dialogs.PropertySubType.money);
        o.setWidth(1400);
        o.setEnabled(false);
        o.setKey(KI_IMPORTE_ORIGEN);

        o = w_columns.add(null);
        o.setName(getText(1228, "")); // Importe
        o.setType(Dialogs.PropertyType.numeric);
        o.setFormat(m_generalConfig.getFormatDecImporte());
        o.setSubType(Dialogs.PropertySubType.money);
        o.setWidth(1200);
        o.setKey(KI_IMPORTE);

        var f = null;
        var fv = null;

        for(var _i = 0; _i < m_data.tCheques.length; _i += 1) {

          f = property.getGrid().getRows().add(null, rs(CT.DBCOI_ID).Value);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], CT.DBCOI_ID));
          fv.setKey(KI_DBCOI_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], CT.BCO_NAME));
          fv.setKey(KI_BCO_ID);

          fv = f.add(null);
          fv.setId(Cairo.Database.valField(m_data.tCheques[_i], CT.CHEQ_ID));
          fv.setKey(KI_CHEQ_ID_SAVED);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], CT.CHEQ_NUMERO_DOC));
          fv.setId(Cairo.Database.valField(m_data.tCheques[_i], CT.CHEQ_ID));
          fv.setKey(KI_CHEQ_ID);

          colCheqFilter = colCheqFilter+ fv.getId().toString()+ C_StrColon;

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], CT.CUE_NAME));
          fv.setId(Cairo.Database.valField(m_data.tCheques[_i], CT.CUE_ID));
          fv.setKey(KI_CUE_ID);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], CT.DBCOI_DESCRIP));
          fv.setKey(KI_DESCRIP);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], CT.DBCOI_IMPORTEORIGEN));
          fv.setKey(KI_IMPORTE_ORIGEN);

          fv = f.add(null);
          fv.setValue(Cairo.Database.valField(m_data.tCheques[_i], CT.DBCOI_IMPORTE));
          fv.setKey(KI_IMPORTE);

        }

        colCheque.setSelectFilter(getFilterCheque(RemoveLastColon(colCheqFilter)));

        return true;
      };

      var load = function(id) {
        var cotizacion = null;

        var apiPath = Cairo.Database.getAPIVersion();
        return Cairo.Database.getData("load[" + apiPath + "general/depositobanco]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== NO_ID) {

              m_cotizacion = Cairo.Database.valField(response.data, CT.DBCO_COTIZACION);
              cotizacion = (m_cotizacion !== 0) ? m_cotizacion : 1);

              m_id = Cairo.Database.valField(response.data, CT.DBCO_ID);
              m_numero = Cairo.Database.valField(response.data, CT.DBCO_NUMERO);
              m_nrodoc = Cairo.Database.valField(response.data, CT.DBCO_NRODOC);
              m_descrip = Cairo.Database.valField(response.data, CT.DBCO_DESCRIP);
              m_fecha = Cairo.Database.valField(response.data, CT.DBCO_FECHA);
              m_total = Cairo.Database.valField(response.data, CT.DBCO_TOTAL) / cotizacion;
              m_bcoId = Cairo.Database.valField(response.data, CT.BCO_ID);
              m_banco = Cairo.Database.valField(response.data, CT.BCO_NAME);
              m_cueId = Cairo.Database.valField(response.data, CT.CUE_ID);
              m_cuenta = Cairo.Database.valField(response.data, CT.CUE_NAME);
              m_sucId = Cairo.Database.valField(response.data, CT.SUC_ID);
              m_sucursal = Cairo.Database.valField(response.data, CT.SUC_NAME);
              m_docId = Cairo.Database.valField(response.data, C.DOC_ID);
              m_documento = Cairo.Database.valField(response.data, CT.DOC_NAME);
              m_doctId = Cairo.Database.valField(response.data, CT.DOCT_ID);
              m_lgjId = Cairo.Database.valField(response.data, CT.LGJ_ID);
              m_legajo = Cairo.Database.valField(response.data, CT.LGJ_CODE);
              m_creado = Cairo.Database.valField(response.data, Cairo.Constants.CREADO);
              m_modificado = Cairo.Database.valField(response.data, Cairo.Constants.MODIFICADO);
              m_modifico = Cairo.Database.valField(response.data, Cairo.Constants.MODIFICO);
              m_estId = Cairo.Database.valField(response.data, Cairo.Constants.EST_ID);
              m_estado = Cairo.Database.valField(response.data, Cairo.Constants.EST_NAME);
              m_firmado = Cairo.Database.valField(response.data, CT.DBCO_FIRMADO);
              m_monId = Cairo.Database.valField(response.data, CT.MON_ID);
              m_docEditable = Cairo.Database.valField(response.data, Cairo.Constants.DOC_EDITABLE);
              m_docEditMsg = Cairo.Database.valField(response.data, Cairo.Constants.DOCEDIT_MSG);

              // Para ver documentos auxiliares
              //
              m_asId = Cairo.Database.valField(response.data, CT.AS_ID);

              m_taPropuesto = Cairo.Database.valField(response.data, Cairo.Constants.TA__PROPUESTO);
              m_taMascara = Cairo.Database.valField(response.data, Cairo.Constants.TA__MASCARA);

              m_lastDocId = m_docId;
              m_lastBcoId = m_bcoId;
              m_lastCueId = m_cueId;
              m_lastDocName = m_documento;
              m_lastBcoName = m_banco;
              m_lastCueName = m_cuenta;

              m_lastMonIdCotizacion = m_monId;

            }
            else {
              m_id = NO_ID;
              m_numero = 0;
              m_nrodoc = "";
              m_descrip = "";
              m_fecha = VDGetDateById(csDateEnum.cSTODAY);
              m_total = 0;
              m_bcoId = NO_ID;
              m_banco = "";
              m_cueId = NO_ID;
              m_cuenta = "";
              m_docId = NO_ID;
              m_documento = "";
              m_doctId = NO_ID;
              m_lgjId = NO_ID;
              m_legajo = "";
              m_cotizacion = 0;
              m_monId = NO_ID;
              m_creado = Cairo.Constants.cSNODATE;
              m_modificado = Cairo.Constants.cSNODATE;
              m_modifico = 0;
              m_estId = NO_ID;
              m_estado = "";
              m_sucId = cUtil.getUser().getSuc_id();
              m_sucursal = cUtil.getUser().getSucursal();
              m_firmado = false;

              m_docId = m_lastDocId;
              m_bcoId = m_lastBcoId;
              m_cueId = m_lastCueId;
              m_banco = m_lastBcoName;
              m_documento = m_lastDocName;
              m_cuenta = m_lastCueName;

              // Para ver documentos auxiliares
              //
              m_asId = NO_ID;

              m_taPropuesto = false;
              m_taMascara = "";

              m_lastMonIdCotizacion = NO_ID;

              cId !== NO_ID) { // Cotizacion
                m_cotizacion = DocGetCotizacion(m_docId, m_fecha);
              }

              DocEditableGet(m_docId, m_docEditable, m_docEditMsg, CS.cSPRETSRNEWDEPOSITOBANCO);
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

      var saveEfectivo = function(id, cotizacion, bMonedaLegal) {
        var register = null;
        var origen = null;

        var row = null;
        var cell = null;

        var _count = m_items.getProperties().item(C_EFECTIVO).getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = m_items.getProperties().item(C_EFECTIVO).getGrid().getRows().item(_i);

          register = new cRegister();
          register.setFieldId(CT.DBCOI_TMPID);
          register.setTable(CT.DEPOSITOBANCOITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
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
                fields.add(CT.CUE_ID, cell.getId(), Types.id);
                break;

              case KI_IMPORTE:
                origen = cell.getValue();
                break;
            }
          }

          fields.add(CT.DBCOI_IMPORTE, origen * cotizacion, Types.currency);
          if(bMonedaLegal) {
            fields.add(CT.DBCOI_IMPORTEORIGEN, 0, Types.currency);
          }
          else {
            fields.add(CT.DBCOI_IMPORTEORIGEN, origen, Types.currency);
          }

          m_orden = m_orden + 1;
          fields.add(CT.DBCOI_ORDEN, m_orden, Types.integer);
          fields.add(CT.DBCOI_TIPO, csEDepositoBancoItemTipo.cSDBCOITEFECTIVO, Types.integer);
          fields.add(CT.DBCO_TMPID, id, Types.id);

          register.getFields().setHaveLastUpdate(false);
          register.getFields().setHaveWhoModify(false);

          if(!Cairo.Database.save(register, , "saveEfectivo", C_MODULE, c_ErrorSave)) { return false; }
        }

        var sqlstmt = null;

        if(m_efectivoDeleted !== "" && m_id !== NO_ID && !m_copy) {

          var vDeletes = null;
          var i = null;

          m_efectivoDeleted = RemoveLastColon(m_efectivoDeleted);
          vDeletes = Split(m_efectivoDeleted, ",");

          for (i = 0; i <= vDeletes.Length; i++) {

            register = new cRegister();
            register.setFieldId(CT.DBCOIB_TMPID);
            register.setTable(CT.DEPOSITOBANCOITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            fields.add(CT.DBCOI_ID, val(vDeletes(i)), Types.integer);
            fields.add(CT.DBCO_ID, m_id, Types.id);
            fields.add(CT.DBCO_TMPID, id, Types.id);

            register.getFields().setHaveLastUpdate(false);
            register.getFields().setHaveWhoModify(false);

            if(!Cairo.Database.save(register, , "saveEfectivo", C_MODULE, c_ErrorSave)) { return false; }
          }

        }

        return true;
      };

      var saveCheques = function(id) {
        var register = null;
        var property = null;

        var row = null;
        var cell = null;

        var _count = getCheques().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = getCheques().getRows().item(_i);

          register = new cRegister();
          register.setFieldId(CT.DBCOI_TMPID);
          register.setTable(CT.DEPOSITOBANCOITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
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
                fields.add(CT.DBCOI_TMPCHEQUE, cell.getValue(), Types.text);

                break;

              case KICH_CHEQ_ID:
                fields.add(CT.CHEQ_ID, cell.getId(), Types.id);

                break;

              case KICH_CLE_ID:
                fields.add(CT.CLE_ID, cell.getId(), Types.id);

                break;

              case KICH_FECHACOBRO:
                fields.add(CT.DBCOI_TMPFECHA_COBRO, cell.getValue(), Types.date);

                break;

              case KICH_FECHAVTO:
                fields.add(CT.DBCOI_TMPFECHA_VTO, cell.getValue(), Types.date);

                break;

              case KI_CUE_ID_HABER:
                fields.add(CT.CUE_ID, cell.getId(), Types.id);

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
          fields.add(CT.DBCOI_TIPO, csEDepositoBancoItemTipo.cSDBCOITCHEQUES, Types.integer);
          fields.add(CT.DBCO_TMPID, id, Types.id);

          register.getFields().setHaveLastUpdate(false);
          register.getFields().setHaveWhoModify(false);

          if(!Cairo.Database.save(register, , "saveCheques", C_MODULE, c_ErrorSave)) { return false; }
        }

        var sqlstmt = null;

        if(m_chequesDeleted !== "" && m_id !== NO_ID && !m_copy) {

          var vDeletes = null;
          var i = null;

          m_chequesDeleted = RemoveLastColon(m_chequesDeleted);
          vDeletes = Split(m_chequesDeleted, ",");

          for (i = 0; i <= vDeletes.Length; i++) {

            register = new cRegister();
            register.setFieldId(CT.DBCOIB_TMPID);
            register.setTable(CT.DEPOSITOBANCOITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            fields.add(CT.DBCOI_ID, val(vDeletes(i)), Types.integer);
            fields.add(CT.DBCO_ID, m_id, Types.id);
            fields.add(CT.DBCO_TMPID, id, Types.id);

            register.getFields().setHaveLastUpdate(false);
            register.getFields().setHaveWhoModify(false);

            if(!Cairo.Database.save(register, , "saveCheques", C_MODULE, c_ErrorSave)) { return false; }
          }

        }

        return true;
      };

      var saveTCheques = function(id, cotizacion, bMonedaLegal) {
        var register = null;
        var origen = null;

        var row = null;
        var cell = null;

        var _count = m_items.getProperties().item(C_CHEQUEST).getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = m_items.getProperties().item(C_CHEQUEST).getGrid().getRows().item(_i);

          register = new cRegister();
          register.setFieldId(CT.DBCOI_TMPID);
          register.setTable(CT.DEPOSITOBANCOITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
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
                fields.add(CT.CUE_ID, cell.getId(), Types.id);
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
          if(bMonedaLegal) {
            fields.add(CT.DBCOI_IMPORTEORIGEN, 0, Types.currency);
          }
          else {
            fields.add(CT.DBCOI_IMPORTEORIGEN, origen, Types.currency);
          }

          m_orden = m_orden + 1;
          fields.add(CT.DBCOI_ORDEN, m_orden, Types.integer);
          fields.add(CT.DBCOI_TIPO, csEDepositoBancoItemTipo.cSDBCOITCHEQUEST, Types.integer);
          fields.add(CT.DBCO_TMPID, id, Types.id);

          register.getFields().setHaveLastUpdate(false);
          register.getFields().setHaveWhoModify(false);

          if(!Cairo.Database.save(register, , "saveChequesT", C_MODULE, c_ErrorSave)) { return false; }
        }

        var sqlstmt = null;

        if(m_chequesTDeleted.Length && m_id !== NO_ID && !m_copy) {

          var vDeletes = null;
          var i = null;

          m_chequesTDeleted = RemoveLastColon(m_chequesTDeleted);
          vDeletes = Split(m_chequesTDeleted, ",");

          for (i = 0; i <= vDeletes.Length; i++) {

            register = new cRegister();
            register.setFieldId(CT.DBCOIB_TMPID);
            register.setTable(CT.DEPOSITOBANCOITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            fields.add(CT.DBCOI_ID, val(vDeletes(i)), Types.integer);
            fields.add(CT.DBCO_ID, m_id, Types.id);
            fields.add(CT.DBCO_TMPID, id, Types.id);

            register.getFields().setHaveLastUpdate(false);
            register.getFields().setHaveWhoModify(false);

            if(!Cairo.Database.save(register, , "saveChequesT", C_MODULE, c_ErrorSave)) { return false; }
          }

        }

        return true;
      };

      // Reglas del Objeto de Negocios
      var showTotales = function() {
        var total = null;
        var row = null;

        var _count = getCheques().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = getCheques().getRows().item(_i);
          total = total + val(getCell(row, KICH_IMPORTE).getValue());
        }

        var _count = getTCheques().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = getTCheques().getRows().item(_i);
          total = total + val(getCell(row, KI_IMPORTE).getValue());
        }

        var _count = getEfectivo().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = getEfectivo().getRows().item(_i);
          total = total + val(getCell(row, KI_IMPORTE).getValue());
        }

        m_footerProps.item(CT.DBCO_TOTAL).setValue(total);

        m_footer.showValue(m_footerProps.item(CT.DBCO_TOTAL));
      };

      var setEnabled = function() {
        var bState = null;

        if(m_docEditable) {
          bState = m_properties.item(C.DOC_ID).getSelectId() !== NO_ID;
        }
        else {
          bState = false;
        }

        setEnabledAux(bState);
      };

      var setEnabledAux = function(bState) {
        var prop = null;

        var _count = m_properties.size();
        for (var _i = 0; _i < _count; _i++) {
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
        for (var _i = 0; _i < _count; _i++) {
          prop = m_items.getProperties().item(_i);
          prop.setEnabled(bState);
        }

        var m_dialog = null;

        m_dialog = m_items;
        m_dialog.RefreshEnabledState(m_items.getProperties());

        m_dialog = m_dialog;
        m_dialog.RefreshEnabledState(m_dialog.getProperties());
      };

      var signDocument = function() {
        var doc = null;
        var us_id = null;

        doc = new cDocumento();

        if(m_id === NO_ID) {
          MsgWarning(getText(1592, "")); // Antes de poder firmar el documento debe guardarlo.
          return null;
        }

        if(m_firmado) {
          if(!Ask(getText(1593, ""), vbYes, getText(1594, ""))) {
            //El documento ya ha sido firmado desea borrar la firma, Firmar
            return null;
          }
        }

        if(!doc.Firmar(m_docId, us_id)) { return false; }

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_DocDepositoBancoFirmar "+ m_id+ ","+ us_id.toString();
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

        m_estId = Cairo.Database.valField(rs.getFields(), Cairo.Constants.EST_ID);
        m_estado = Cairo.Database.valField(rs.getFields(), Cairo.Constants.EST_NAME);

        var iProp = null;
        iProp = m_properties.item(Cairo.Constants.STATUS_ID);

        iProp.setSelectId(m_estId);
        iProp.setValue(m_estado);

        Cairo.Database.getData(CT.DEPOSITOBANCO, CT.DBCO_ID, m_id, CT.DBCO_FIRMADO, m_firmado);

        m_dialog.showValue(iProp);

        return true;
      };

      var move = function(moveTo) {
        var sqlstmt = null;
        var rs = null;
        var doc_id = null;

        doc_id = m_properties.item(C.DOC_ID).getSelectId();

        if(doc_id === NO_ID) { return M.showInfoWithFalse(getText(1595, "")); } // Debe seleccionar un documento

        sqlstmt = "sp_DocDepositoBancoMover "+ moveTo+ ","+ m_numero+ ","+ doc_id.toString();

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

              comprobante para // Si no encontre ni ultimo ni primero
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
              pRefreshProperties();

              // Obtengo un nuevo numero de comprobante
              //
              GetDocNumber(m_lastDocId, m_dialog, m_taPropuesto, CT.DBCO_NRODOC);

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
        var m_dialog = null;
        var filter = null;
        var cotizacion = null;

        var properties = m_dialog.getProperties();

        c = properties.item(C.DOC_ID);
        c.setSelectId(m_docId);
        c.setValue(m_documento);

        c = properties.item(CT.DBCO_FECHA);
        c.setValue(m_fecha);

        c = properties.item(CT.BCO_ID);
        c.setSelectId(m_bcoId);
        c.setValue(m_banco);

        c = properties.item(CT.CUE_ID);
        c.setSelectId(m_cueId);
        c.setValue(m_cuenta);
        c.setSelectFilter(getFilterCuenta(m_properties.item(CT.BCO_ID).getSelectId()));

        c = properties.item(Cairo.Constants.NUMBER_ID);
        c.setValue(m_numero);

        c = properties.item(Cairo.Constants.STATUS_ID);
        c.setValue(m_estado);

        c = properties.item(CT.DBCO_NRODOC);
        c.setValue(m_nrodoc);
        c.setTextMask(m_taMascara);
        c.setTextAlign(Dialogs.TextAlign.right);

        c = properties.item(CT.DBCO_COTIZACION);
        c.setValue(m_cotizacion);

        c = properties.item(CT.SUC_ID);
        c.setSelectId(m_sucId);
        c.setValue(m_sucursal);

        c = properties.item(CT.LGJ_ID);
        c.setSelectId(m_lgjId);
        c.setValue(m_legajo);

        c = properties.item(CT.DBCO_DESCRIP);
        c.setValue(m_descrip);

        m_dialog = m_dialog;
        m_dialog.ShowValues(m_dialog.getProperties());

        m_dialog.ResetChanged;

        if(m_cotizacion !== 0) {
          cotizacion = m_cotizacion;
        }
        else {
          cotizacion = 1;
        }

        c = m_items.getProperties().item(C_EFECTIVO);
        if(!loadEfectivo(c, cotizacion)) { return; }

        m_efectivoDeleted = "";

        c = m_items.getProperties().item(C_CHEQUES);
        if(!loadCheques(c)) { return; }

        m_chequesDeleted = "";

        c = m_items.getProperties().item(C_CHEQUEST);
        if(!loadTCheques(c, cotizacion)) { return; }

        m_chequesTDeleted = "";

        m_dialog = m_items;
        m_dialog.ShowValues(m_items.getProperties());

        m_dialog.RefreshColumnProperties(c, C_COLCHEQUE);

        c = m_footerProps.item(CT.DBCO_TOTAL);
        c.setValue(m_total);

        m_dialog = m_footer;
        m_dialog.ShowValues(m_footer.getProperties());

        setEnabled();
      };

      var getFilterCuenta = function(bco_id) {
        var filter = null;

        filter = CT.CUEC_ID+ " = "+ csECuentaCategoria.cSECUECBANCOS.toString()+ " and cuenta.emp_id = "+ cUtil.getEmpId().toString();

        if(bco_id) {
          filter = filter+ " and bco_id = "+ bco_id.toString();
        }

        return filter;
      };

      var getFilterCuentaItem = function() {
        return CT.CUEC_ID+ " = "+ csECuentaCategoria.cSECUECCAJA.toString();
      };

      var getFilterCheque = function(cheqIds) {
        var rtn = null;

        rtn = CT.CUEC_ID+ " = "+ csECuentaCategoria.cSECUECDOCENCARTERA.toString()+ " and cuenta.emp_id = "+ cUtil.getEmpId().toString();
        if(cheqIds !== "") {
          rtn = "("+ rtn+ ") Or (cheq_id in ("+ cheqIds+ "))";
        }

        return rtn;
      };

      var setChequeData = function(row, cheq_id) { // TODO: Use of ByRef founded Private Sub setChequeData(ByRef Row As cIABMGridRow, ByVal cheq_id As Long)
        var sqlstmt = null;
        var rs = null;

        if(cheq_id === getCell(row, KI_CHEQ_ID_SAVED).getId()) { return; }

        sqlstmt = "sp_chequeGetData "+ cheq_id.toString();

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(!rs.isEOF()) {

          var cell = getCell(row, KI_CUE_ID);
          cell.setId(Cairo.Database.valField(rs.getFields(), CT.CUE_ID));
          cell.setValue(Cairo.Database.valField(rs.getFields(), CT.CUE_NAME));

          var cell = getCell(row, KI_BCO_ID);
          cell.setValue(Cairo.Database.valField(rs.getFields(), CT.BCO_NAME));

          getCell(row, KI_IMPORTE).setValue(Cairo.Database.valField(rs.getFields(), CT.CHEQ_IMPORTE));
          getCell(row, KI_IMPORTE_ORIGEN).setValue(Cairo.Database.valField(rs.getFields(), CT.CHEQ_IMPORTE_ORIGEN));

        }
        else {

          var cell = getCell(row, KI_CUE_ID);
          cell.setId(NO_ID);
          cell.setValue("");

          var cell = getCell(row, KI_BCO_ID);
          cell.setValue("");

          getCell(row, KI_IMPORTE).setValue(0);
          getCell(row, KI_IMPORTE_ORIGEN).setValue(0);
        }
      };

      var getCotizacion = function() {
        return m_properties.item(CT.DBCO_COTIZACION);
      };

      var getTCheques = function() {
        return m_items.getProperties().item(C_CHEQUEST).getGrid();
      };

      var getCheques = function() {
        return m_items.getProperties().item(C_CHEQUES).getGrid();
      };

      var getEfectivo = function() {
        return m_items.getProperties().item(C_EFECTIVO).getGrid();
      };

      // Construccion - Destruccion
      self.initialize = function() {
        try {

          c_ErrorSave = getText(2236, ""); // Error al grabar el deposito bancario

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "Class_Initialize", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var getCuenta = function() {
        return m_properties.item(CT.CUE_ID);
      };

      var getBanco = function() {
        return m_properties.item(CT.BCO_ID);
      };

      var showBanco = function() {
        var bco_id = null;
        var bco_nombre = null;
        var cue_id = null;

        cue_id = getCuenta().getSelectId();

        if(cue_id) {

          Cairo.Database.getData(CT.CUENTA, CT.CUE_ID, cue_id, CT.BCO_ID, bco_id);
          Cairo.Database.getData(CT.BANCO, CT.BCO_ID, bco_id, CT.BCO_NAME, bco_nombre);

        }

        var iProp = null;
        iProp = getBanco();
        iProp.setValue(bco_nombre);
        iProp.setSelectId(bco_id);
        m_dialog.showValue(iProp);

        var objAbm = null;
        objAbm = m_dialog;
        objAbm.ValidateProp(iProp, CT.BCO_ID);

        m_lastBcoId = bco_id;
        m_lastBcoName = bco_nombre;
      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };
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

      var C_MODULE = "cDepositoBancoListDoc";

      var C_FECHAINI = "FechaIni";
      var C_FECHAFIN = "FechaFin";

      var C_IMG_TASK = 1;


      var K_FECHAINI = 1;
      var K_FECHAFIN = 2;
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

        m_properties.clear();

        c = m_properties.add(null, C_FECHAINI);
        c.setType(Dialogs.PropertyType.date);
        c.setName(getText(1203, "")); // Fecha desde
        c.setKey(K_FECHAINI);
        if(LenB(m_fechaIniV)) {
          c.setValue(m_fechaIniV);
        }
        else {
          c.setValue(m_fechaIni);
        }

        c = m_properties.add(null, C_FECHAFIN);
        c.setType(Dialogs.PropertyType.date);
        c.setName(getText(1204, "")); // Fecha hasta
        c.setKey(K_FECHAFIN);
        if(LenB(m_fechaFinV)) {
          c.setValue(m_fechaFinV);
        }
        else {
          c.setValue(m_fechaFin);
        }

        c = m_properties.add(null, CT.BCO_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.BANCO);
        c.setName(getText(1122, "")); // Banco
        c.setKey(K_BCO_ID);
        value = m_banco;
        if(m_bcoId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.BANCO, val(m_bcoId.Substring(2)), bExists);
          if(!bExists) { m_bcoId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(val(m_bcoId));
        c.setSelectIntValue(m_bcoId);

        c = m_properties.add(null, CT.CUE_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CUENTA);
        c.setName(getText(1267, "")); // Cuenta
        c.setKey(K_CUE_ID);
        value = m_cuenta;
        if(m_cueId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.CUENTA, val(m_cueId.Substring(2)), bExists);
          if(!bExists) { m_cueId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(val(m_cueId));
        c.setSelectIntValue(m_cueId);

        c = m_properties.add(null, C.EST_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csEstado);
        c.setName(getText(1568, "")); // Estado
        c.setKey(K_EST_ID);
        value = m_estado;
        if(m_estId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csEstado, val(m_estId.Substring(2)), bExists);
          if(!bExists) { m_estId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(val(m_estId));
        c.setSelectIntValue(m_estId);

        c = m_properties.add(null, CT.SUC_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.SUCURSAL);
        c.setName(getText(1281, "")); // Sucursal
        c.setKey(K_SUC_ID);
        value = m_sucursal;
        if(m_sucId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.SUCURSAL, val(m_sucId.Substring(2)), bExists);
          if(!bExists) { m_sucId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(val(m_sucId));
        c.setSelectIntValue(m_sucId);

        c = m_properties.add(null, C.DOC_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csETablasDocumento.CSDocumento);
        c.setName(getText(1567, "")); // Documentos
        c.setKey(K_DOC_ID);
        value = m_documento;
        if(m_docId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csETablasDocumento.CSDocumento, val(m_docId.Substring(2)), bExists);
          if(!bExists) { m_docId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(val(m_docId));
        c.setSelectIntValue(m_docId);
        c.setSelectFilter("'{emp_id=0}doct_id = "+ csEDocumentoTipo.cSEDT_DEPOSITOBANCO.toString()+ "'");


        c = m_properties.add(null, C.EMP_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.EMPRESA);
        c.setName(getText(1114, "")); // Empresa
        c.setKey(K_EMP_ID);
        value = m_empresa;
        if(m_empId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.EMPRESA, val(m_empId.Substring(2)), bExists);
          if(!bExists) { m_empId = "0"; }
        }
        c.setValue(value);
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

        return DB.getData("load[" + m_apiPath + "general/depositobancolistdoc]", id).then(
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

          case K_BCO_ID:
            var property = m_properties.item(CT.BCO_ID);
            m_banco = property.getValue();
            m_bcoId = property.getSelectIntValue();

            break;

          case K_CUE_ID:
            var property = m_properties.item(CT.CUE_ID);
            m_cuenta = property.getValue();
            m_cueId = property.getSelectIntValue();

            break;

          case K_SUC_ID:
            var property = m_properties.item(CT.SUC_ID);
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

        sqlstmt = "sp_lsdoc_DepositoBancos ";

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

        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_bcoId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_cueId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_estId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_sucId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_docId)+ ",";
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

        strError = getText(2238, "");
        //Error al grabar los párametros de navegación del Depósito Bancario

        var register = null;
        var register = new DB.Register();

        var sqlstmt = null;

        sqlstmt = "delete ListaDocumentoParametro  where pre_id = "+ CS.LIST_DEPOSITOBANCO.toString()+ " and us_id = "+ m_us_id+ " and (emp_id is null or emp_id = "+ cUtil.getEmpId().toString()+ ")";

        if(!Cairo.Database.execute(sqlstmt, "cIABMClient_Save", C_MODULE, strError)) { return false; }

        register.setTable(Cairo.Constants.LISTADOCUMENTOPARAMETRO);
        register.setUtilizaIdentity(true);

        var property = null;
        var _count = m_properties.size();
        for(var _i = 0; _i < _count; _i++) {
          property = m_properties.item(_i);

          register.getFields().clear();

          switch (property.getKey()) {

            case K_FECHAINI:
              if(property.getSelectIntValue() !== "") {
                fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              }
              else {
                fields.add(Cairo.Constants.LDP_VALOR, property.getValue(), Types.text);
              }

              fields.add(Cairo.Constants.LDP_ORDEN, 10, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_FECHAINI, Types.integer);

              break;

            case K_FECHAFIN:

              if(property.getSelectIntValue() !== "") {
                fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              }
              else {
                fields.add(Cairo.Constants.LDP_VALOR, property.getValue(), Types.text);
              }

              fields.add(Cairo.Constants.LDP_ORDEN, 20, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_FECHAFIN, Types.integer);

              break;

            case K_BCO_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 40, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_BCO_ID, Types.integer);
              break;

            case K_CUE_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 40, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_CUE_ID, Types.integer);
              break;

            case K_EST_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 50, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_EST_ID, Types.integer);
              break;

            case K_SUC_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 70, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_SUC_ID, Types.integer);
              break;

            case K_DOC_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 90, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_DOC_ID, Types.integer);


              break;

            case K_EMP_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 100, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_EMP_ID, Types.integer);

              break;
          }


          fields.add(C.EMP_ID, cUtil.getEmpId(), Types.id);

          fields.add(Cairo.Constants.US_ID, m_us_id, Types.id);
          fields.add(C.PRE_ID, CS.LIST_DEPOSITOBANCO, Types.id);



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


      var setCIEditGenericListDoc_ObjAbm = function(rhs) {
        m_dialog = rhs;
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

          // Depósitos Bancarios
          m_title = getText(2130, "");

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
          elem.setSortType(csSortType.cSSRTTICON);

          var elem = m_properties.add(null, "Descripción");
          elem.setName("Descripción");
          elem.setFontName("Tahoma");
          elem.setFontSize(8);
          elem.setForeColor(vbBlue);


        }
        catch (ex) {
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

      var createMenu = function() {


        if(m_menuLoaded) { return; }

        m_menuLoaded = true;

        m_objList.ObjClientMenu = self;
        m_objList.ClearMenu;
        // Firmar
        m_menuSign = m_objList.addMenu(getText(1594, ""));
        m_objList.addMenu("-");
        // Agregar Nota
        m_menuAddNote = m_objList.addMenu(getText(1615, ""));
        // Ver Notas
        m_menuShowNotes = m_objList.addMenu(getText(1616, ""));
        m_objList.addMenu("-");
        // Ver Asiento Contable
        m_menuShowAsiento = m_objList.addMenu(getText(1692, ""));
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