(function() {
  "use strict";

  Cairo.module("MovimientoFondo.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var TITLE = getText(2185, ""); // Movimiento de Fondos
      var SAVE_ERROR_MESSAGE = getText(2242, ""); // Error al grabar el movimiento de fondo

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

      var C_MODULE = "cMovimientoFondo";

      var C_EFECTIVO = "Efectivo";
      var C_CHEQUES = "Cheques";
      var C_CHEQUEST = "Cheques En Cartera";
      var C_CHEQUESI = "Ingreso de Cheques";

      var C_CHEQUERA = "Chequera";
      var C_CHEQUET = "chqt";

      var C_ORIGENDEBE = "OrigenDebe";
      var C_ORIGENHABER = "OrigenHaber";

      var K_NUMERO = 1;
      var K_NRODOC = 2;
      var K_DESCRIP = 3;
      var K_FECHA = 4;
      var K_TOTAL = 9;
      var K_CLI_ID = 10;
      var K_DOC_ID = 11;
      var K_DOCT_ID = 12;
      var K_EFECTIVO = 15;
      var K_CHEQUES = 16;
      var K_CHEQUEST = 17;
      var K_CHEQUESI = 29;
      var K_EST_ID = 18;
      var K_CCOS_ID = 19;
      var K_SUC_ID = 20;
      var K_US_ID = 26;
      var K_LGJ_ID = 27;
      var K_COTIZACION = 28;

      var KI_MFI_ID = 2;
      var KI_ORDEN = 3;
      var KI_DESCRIP = 6;
      var KI_IMPORTE = 8;
      var KI_ORIGEN_DEBE = 9;
      var KI_ORIGEN_HABER = 10;
      var KI_CCOS_ID = 22;

      var KICH_MFI_ID = 1;
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

      var KI_CUE_ID_DEBE = 300;
      var KI_CUE_ID_HABER = 301;

      var m_id = 0;
      var m_numero = 0;
      var m_estado = "";
      var m_estId = 0;
      var m_nrodoc = "";
      var m_descrip = "";
      var m_fecha = null;
      var m_total = 0;
      var m_usId = 0;
      var m_usuario = "";
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

      var m_lastCliId = 0;
      var m_lastCliName = "";

      var m_isNew;

      var m_defaultCurrency = D.getDefaultCurrency();

      var m_efectivoDeleted = "";

      var m_copy;

      var m_docEditable;
      var m_docEditMsg = "";

      var m_taPropuesto;
      var m_taMascara = "";

      var m_orden = 0;

      var m_chequesDeleted = "";
      var m_tChequesDeleted = "";
      var m_iChequesDeleted = "";

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
          CS.NEW_MOVIMIENTO_FONDO,
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
          CS.NEW_MOVIMIENTO_FONDO,
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

        D.setDocNumber(m_lastDocId, m_dialog, CT.MF_NRODOC).then(
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

          doc.setClientTable(CC.MOVIMIENTO_FONDO);
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

            switch (info) {
              case K_CHEQUES:
              case K_CHEQUEST:
              case K_EFECTIVO:
              case K_CHEQUESI:
                pShowTotales();
                break;
            }
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

            D.search(D.Types.MOVIMIENTO_FONDO, self, Cairo.bool(info));
            break;

          case Dialogs.Message.MSG_DOC_DOC_AUX:

            if(m_id) {
              D.showDocAux(m_asId, "Asiento");
            }
            else {
              return M.showInfoWithFalse(getText(1620, "")); // Debe editar un comprobante guardado para poder ver los documentos auxiliares
            }
            break;

          case Dialogs.Message.MSG_DOC_DOC_EDIT:

            if(m_id) {

              if(m_docEditable) {
                p = M.showInfo(getText(1555, "")); // Este documento puede editarse normalmente
              }
              else {

                p = D.docCanBeSaved(m_dialog, CT.MF_FECHA).then(function(canBeSaved) {
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
              p = Cairo.History.show(Cairo.Tables.MOVIMIENTOS_DE_FONDO, m_id, m_documento + " " + m_nrodoc);
            }
            else {
              p = M.showInfo(getText(1552, "")); // El documento aun no ha sido guardado
            }
            break;
        }

        return p || P.resolvedPromise();
      };

      self.discardChanges = function() {
        Cairo.raiseError("MovimientoFondo", "DiscardChanges was called");
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

                  return D.setDocNumber(m_lastDocId, m_dialog, CC.MF_NRODOC)
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
            return D.docCanBeSaved(m_dialog, CC.MF_FECHA);
          })
          .whenSuccess(function() {
            if(getCheques().getRows().count() === 0
              && getTCheques().getRows().count() === 0
              && getICheques().getRows().count() === 0
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

            register.setFieldId(CT.MF_ID);
            register.setTable(CT.MOVIMIENTO_FONDO);

            register.setPath(m_apiPath + "tesoreria/movimientofondo");

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
                  fields.add(CT.MF_NUMERO, property.getValue(), Types.long);
                  break;

                case K_NRODOC:
                  fields.add(CT.MF_NRODOC, property.getValue(), Types.text);
                  break;

                case K_DESCRIP:
                  fields.add(CT.MF_DESCRIP, property.getValue(), Types.text);
                  break;

                case K_FECHA:
                  fields.add(CT.MF_FECHA, property.getValue(), Types.date);
                  break;

                case K_CLI_ID:
                  fields.add(CT.CLI_ID, property.getSelectId(), Types.id);
                  break;

                case K_CCOS_ID:
                  fields.add(CT.CCOS_ID, property.getSelectId(), Types.id);
                  break;

                case K_SUC_ID:
                  fields.add(CT.SUC_ID, property.getSelectId(), Types.id);
                  break;

                case K_DOC_ID:
                  fields.add(CT.DOC_ID, property.getSelectId(), Types.id);
                  break;

                case K_COTIZACION:
                  cotizacion = property.getValue();
                  fields.add(CT.MF_COTIZACION, property.getValue(), Types.double);
                  break;

                case K_US_ID:
                  fields.add(Cairo.Constants.US_ID, property.getSelectId(), Types.id);
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
            fields.add(CT.MF_TOTAL, totalOrigen * cotizacion, Types.currency);
            fields.add(CT.MF_GRABARASIENTO, 1, Types.boolean);
            fields.add(C.EST_ID, m_estId, Types.id);

            if(isDefaultCurrency) {
              fields.add(CT.MF_TOTALORIGEN, 0, Types.currency);
            }
            else {
              fields.add(CT.MF_TOTALORIGEN, totalOrigen, Types.currency);
            }

            m_orden = 0;

            saveEfectivo(register, cotizacion, isDefaultCurrency);
            saveCheques(register);
            saveTCheques(register);
            saveICheques(register);

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
        return "#tesoreria/movimientofondo/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "movimientofondo" + id;
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

            case K_CHEQUESI:
              isEmpty = isEmptyRowICheques(row, rowIndex);
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

        var p = DB.getData("load[" + m_apiPath + "tesoreria/movimientofondo/info]", id)
          .whenSuccessWithResult(loadData, false);

        return p;
      };

      self.getDialog = function() {
        return m_dialog;
      };

      self.list = function() {
        return Cairo.Security.hasPermissionTo(CS.LIST_MOVIMIENTO_FONDO);
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
            CS.LIST_MOVIMIENTO_FONDO,
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
              pShowTotales();
              break;

            case K_CHEQUES:
              columnAfterUpdateCheque(m_items.getProperties().item(C_CHEQUES), lRow, lCol);
              break;

            case K_CHEQUEST:
              columnAfterUpdateTCheque(m_items.getProperties().item(C_CHEQUEST), lRow, lCol);
              break;

            case K_CHEQUESI:
              columnAfterUpdateICheque(m_items.getProperties().item(C_CHEQUESI), lRow, lCol);
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
            case K_EFECTIVO:
              p = columnAfterEdit(m_itemsProps.item(C_EFECTIVO), lRow, lCol, newValue, newValueID);
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

      self.columnButtonClick = function(key, lRow, lCol, iKeyAscii) {
        return P.resolvedPromise(false);
      };

      self.columnClick = function(key, lRow, lCol) {

      };

      self.gridDblClick = function(key, lRow, lCol) {
        return P.resolvedPromise(false);
      };

      self.deleteRow = function(key, row, lRow) {
        var id = null;

        switch (key) {
          case K_CHEQUES:
            id = Cairo.Util.val(Dialogs.cell(row, KICH_MFI_ID).getValue());
            if(id !== NO_ID) { m_chequesDeleted = m_chequesDeleted+ id.toString()+ ","; }
            break;

          case K_CHEQUEST:
            id = Cairo.Util.val(Dialogs.cell(row, KICH_MFI_ID).getValue());
            if(id !== NO_ID) { m_tChequesDeleted = m_tChequesDeleted+ id.toString()+ ","; }
            break;

          case K_CHEQUESI:
            id = Cairo.Util.val(Dialogs.cell(row, KICH_MFI_ID).getValue());
            if(id !== NO_ID) { m_iChequesDeleted = m_iChequesDeleted+ id.toString()+ ","; }
            break;

          case K_EFECTIVO:
            id = Cairo.Util.val(Dialogs.cell(row, KI_MFI_ID).getValue());
            if(id !== NO_ID) { m_efectivoDeleted = m_efectivoDeleted+ id.toString()+ ","; }
            break;
        }

        return true;
      };

      var listAdHock = function(key, row, colIndex, list) {

      };

      var newRow = function(key, rows) {

      };

      var validateRow = function(key, row, rowIndex) {
        var _rtn = null;
        try {

          switch (key) {
            case K_EFECTIVO:
              _rtn = pValidateRow(row, rowIndex);
              break;

            case K_CHEQUES:
              _rtn = pValidateRowCheques(row, rowIndex);
              break;

            case K_CHEQUEST:
              _rtn = pValidateRowTCheques(row, rowIndex);
              break;

            case K_CHEQUESI:
              _rtn = pValidateRowICheques(row, rowIndex);
              break;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "validateRow", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var isEmptyRow = function(row, rowIndex) {
        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_IMPORTE:
              if(!valEmpty(cell.getValue(), Types.currency)) {
                bRowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pValidateRow = function(row, rowIndex) { // TODO: Use of ByRef founded Private Function pValidateRow(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var cue_id_debe = null;
        var cue_id_haber = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case KI_IMPORTE:
              if(valEmpty(cell.getValue(), Types.currency)) {
                return M.showInfoWithFalse(getText(1897, "", strRow)); // Debe indicar un importe (1)
              }

              break;

            case KI_CUE_ID_DEBE:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2187, "", strRow)); // Debe indicar una cuenta destino (1)
              }
              cue_id_debe = cell.getId();

              break;

            case KI_CUE_ID_HABER:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2186, "", strRow)); // Debe indicar una cuenta origen (1)
              }
              cue_id_haber = cell.getId();

              break;

            case KI_ORIGEN_DEBE:
              if(m_items.getProperties().item(C_EFECTIVO).getGrid().getColumns(C_ORIGENDEBE).Visible) {

                if(!pIsMonDefault(cue_id_debe)) {

                  if(valEmpty(cell.getValue(), Types.currency)) {

                    if(m_userCfg.getDebeHaberMf()) {
                      return M.showInfoWithFalse(getText(4812, "", strRow));
                      //Debe indicar el importe en la moneda de la cuenta debe (1)
                    }
                    else {
                      return M.showInfoWithFalse(getText(4811, "", strRow));
                      //Debe indicar el importe en la moneda de la cuenta destino (1)
                    }
                  }
                }
              }

              break;

            case KI_ORIGEN_HABER:
              if(m_items.getProperties().item(C_EFECTIVO).getGrid().getColumns(C_ORIGENHABER).Visible) {

                if(!pIsMonDefault(cue_id_haber)) {

                  if(valEmpty(cell.getValue(), Types.currency)) {
                    if(m_userCfg.getDebeHaberMf()) {
                      return M.showInfoWithFalse(getText(4813, "", strRow));
                      //Debe indicar el importe en la moneda de la cuenta haber (1)
                    }
                    else {
                      return M.showInfoWithFalse(getText(4810, "", strRow));
                      //Debe indicar el importe en la moneda de la cuenta origen (1)
                    }
                  }
                }
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var columnAfterEdit = function(property, lRow, lCol, newValue, newValueID) { // TODO: Use of ByRef founded Private Function columnAfterEdit(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long, ByVal NewValue As Variant, ByVal NewValueID As Long)
        var column = null;

        column = property.getGrid().getColumns().item(lCol);

        switch (column.getKey()) {

          case KI_CUE_ID_DEBE:
          case KI_CUE_ID_HABER:

            var colKey = null;

            if(column.getKey() === KI_CUE_ID_DEBE) {
              colKey = C_ORIGENDEBE;
            }
            else {
              colKey = C_ORIGENHABER;
            }

            if(!pIsMonDefault(newValueID) && newValueID !== NO_ID) {

              property.getGrid().getColumns().item(colKey).setVisible(true);
                      #If PREPROC_SFS Then;
              var abmObj = null;
                      #Else;
              var abmObj = null;
                      #End If;
              abmObj = m_dialog;
              abmObj.RefreshColumnProperties(property, colKey);
            }

            break;
        }
        return true;
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
        abmGen.ResetLayoutMembers;

        abmGen.setNoButtons1(csButtons.bUTTON_DOC_APLIC);
        abmGen.setNoButtons2(csButtons.bUTTON_DOC_ACTION);
        abmGen.InitButtons;

        var w_tabs = m_dialog.getTabs();
        w_tabs.clear();

        var tab = w_tabs.add(null);
        tab.setName(Cairo.Constants.c_strGeneral);

        var tab = w_tabs.add(null);
        tab.setIndex(1);
        tab.setName(getText(1566, "")); // Adicionales

        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, CT.DOC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSDocumento2.CSDocumento);
        elem.setName(getText(1567, "")); // Documento
        elem.setKey(K_DOC_ID);

        if(m_docId !== NO_ID) {
          elem.setSelectId(m_docId);
          elem.setValue(m_documento);
        }
        else {
          // Preferencias del usuario
          //
          elem.setSelectId(m_userCfg.getDocMfId());
          elem.setValue(m_userCfg.getDocMfNombre());

          bValidateDocDefault = elem.getSelectId() !== NO_ID;
        }

        elem.setSelectFilter("'doct_id = "+ csEDocumentoTipo.cSEDT_MOVIMIENTOFONDO.toString()+ "'");

        var elem = properties.add(null, cDeclarations.getCsDocNumberID());
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.Integer);
        elem.setName(getText(1065, "")); // Número
        elem.setKey(K_NUMERO);
        elem.setValue(m_numero);
        elem.setEnabled(false);

        var elem = properties.add(null, cDeclarations.getCsDocEstateID());
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(getText(1568, "")); // Estado
        elem.setKey(K_EST_ID);
        elem.setValue(m_estado);
        elem.setEnabled(false);

        var elem = properties.add(null, CT.MF_FECHA);
        elem.setType(Dialogs.PropertyType.date);
        elem.setName(getText(1569, "")); // Fecha
        elem.setLeftLabel(-580);
        elem.setLeft(700);
        elem.setKey(K_FECHA);
        elem.setValue(m_fecha);

        var elem = properties.add(null, CT.CLI_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CLIENTE);
        elem.setTopFromProperty(CT.MF_FECHA);
        elem.setLeft(3500);
        elem.setLeftLabel(-1100);
        elem.setName(getText(1150, "")); // Cliente
        elem.setKey(K_CLI_ID);
        elem.setSelectId(m_cliId);
        elem.setValue(m_cliente);
        abmGen.NewKeyPropFocus = CT.CLI_ID;

        var elem = properties.add(null, CT.MF_NRODOC);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(getText(1065, "")); // Número
        elem.setTopToPrevious(400);
        elem.setSize(50);
        elem.setKey(K_NRODOC);
        elem.setValue(m_nrodoc);
        elem.setTextMask(m_taMascara);
        elem.setTextAlign(vbRightJustify);

        var elem = properties.add(null, Cairo.Constants.US_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(csUsuario);
        elem.setName(getText(1822, "")); // Responsable
        elem.setTopToPrevious(400);
        elem.setKey(K_US_ID);
        elem.setSelectId(m_usId);
        elem.setValue(m_usuario);

        var elem = properties.add(null, CT.LGJ_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSLEGAJO);
        elem.setName(getText(1575, "")); // Legajo
        elem.setKey(K_LGJ_ID);
        elem.setSelectId(m_lgjId);
        elem.setValue(m_legajo);
        elem.setTabIndex(1);

        var elem = properties.add(null, CT.MF_COTIZACION);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setTopFromProperty(CT.CLI_ID);
        elem.setLeft(7100);
        elem.setLeftLabel(-1200);
        elem.setName(getText(1635, "")); // Cotización
        elem.setFormat(m_generalConfig.getFormatDecCotizacion());
        elem.setKey(K_COTIZACION);
        elem.setValue(m_cotizacion);
        elem.setWidth(1000);

        if(m_cotizacion !== 0) {
          cotizacion = m_cotizacion;
        }
        else {
          cotizacion = 1;
        }

        var elem = properties.add(null, CT.CCOS_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTROCOSTO);
        elem.setName(getText(1057, "")); // Centro de Costo
        elem.setTopToPrevious(400);
        elem.setKey(K_CCOS_ID);
        elem.setSelectId(m_ccosId);
        elem.setValue(m_centroCosto);

        var elem = properties.add(null, CT.SUC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.SUCURSAL);
        elem.setName(getText(1281, "")); // Sucursal
        elem.setTopToPrevious(400);
        elem.setKey(K_SUC_ID);
        elem.setSelectId(m_sucId);
        elem.setValue(m_sucursal);

        var elem = properties.add(null, CT.MF_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setName(getText(1211, "")); // Observ.
        elem.setLeftLabel(-600);
        elem.setSize(5000);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);
        elem.setLeftFromProperty(CT.MF_FECHA);
        elem.setTopFromProperty(CT.MF_NRODOC);
        elem.setWidth(8660);
        elem.setHeight(520);
        elem.setTopToPrevious(800);

        if(!m_dialog.show(self)) { return false; }

        var c_TabEfectivo = 0;
        var c_TabCheque = 1;
        var c_TabChequeT = 2;
        var c_TabChequeI = 3;

        var w_tabs = m_items.getTabs();

        w_tabs.clear();

        var tab = w_tabs.add(null);
        tab.setIndex(c_TabEfectivo);
        tab.setName(getText(2100, "")); // Efectivo

        var tab = w_tabs.add(null);
        tab.setIndex(c_TabCheque);
        tab.setName(getText(2099, "")); // Cheques

        var tab = w_tabs.add(null);
        tab.setIndex(c_TabChequeT);
        tab.setName(getText(2188, "")); // Cheques en Cartera

        var tab = w_tabs.add(null);
        tab.setIndex(c_TabChequeI);
        tab.setName(getText(2189, "")); // Ingreso de Cheques

        abmGen = m_items;
        abmGen.ResetLayoutMembers;

        var properties = m_items.getProperties();

        properties.clear();

        ///////////////////////////////////////////////////////////////////
        cTIVO); // EFECTIVO
        c.setType(Dialogs.PropertyType.grid);
        c.hideLabel();;
        setGridEfectivo(c);
        if(!loadEfectivo(c, cotizacion)) { return false; }
        c.setName(C_EFECTIVO);
        c.setKey(K_EFECTIVO);
        c.setTabIndex(0);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);
        m_efectivoDeleted = "";

        ///////////////////////////////////////////////////////////////////
        cHEQUES); // CHEQUES
        c.setType(Dialogs.PropertyType.grid);
        c.hideLabel();;
        setGridCheques(c);
        if(!loadCheques(c)) { return false; }
        c.setName(C_CHEQUES);
        c.setKey(K_CHEQUES);
        c.setTabIndex(c_TabCheque);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        m_chequesDeleted = "";

        ///////////////////////////////////////////////////////////////////
        cHEQUEST); // CHEQUES DE TERCERO
        c.setType(Dialogs.PropertyType.grid);
        c.hideLabel();;
        setGridTCheques(c);
        if(!loadTCheques(c)) { return false; }
        c.setName(C_CHEQUEST);
        c.setKey(K_CHEQUEST);
        c.setTabIndex(c_TabChequeT);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        m_tChequesDeleted = "";

        ///////////////////////////////////////////////////////////////////
        cHEQUESI); // INGRESO DE CHEQUES DE TERCERO
        c.setType(Dialogs.PropertyType.grid);
        c.hideLabel();;
        setGridICheques(c);
        if(!loadICheques(c)) { return false; }
        c.setName(C_CHEQUESI);
        c.setKey(K_CHEQUESI);
        c.setTabIndex(c_TabChequeI);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        m_iChequesDeleted = "";

        if(!m_items.show(self)) { return false; }

        abmGen = m_footer;
        abmGen.ResetLayoutMembers;

        var properties = m_footer.getProperties();

        properties.clear();

        c = properties.add(null, CT.MF_TOTAL);
        c.setType(Dialogs.PropertyType.numeric);
        c.setFormat(m_generalConfig.getFormatDecImporte());
        c.setName(getText(1584, "")); // Total
        c.setSubType(Dialogs.PropertySubType.money);
        c.setKey(K_TOTAL);
        c.setValue(m_total);
        c.setEnabled(false);

        setEnabled();

        if(!m_footer.show(self)) { return false; }

        // Preferencias del Usuario
        //
        if(bValidateDocDefault) {
          self.propertyChange(K_DOC_ID);
        }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(CT.DOC_ID);
        elem.setSelectId(m_docId);
        elem.setValue(m_documento);
        elem.setSelectId(m_userCfg.getDocMfId());
        elem.setValue(m_userCfg.getDocMfNombre());

        var elem = properties.item(cDeclarations.getCsDocNumberID());
        elem.setValue(m_numero);

        var elem = properties.item(cDeclarations.getCsDocEstateID());
        elem.setValue(m_estado);

        var elem = properties.item(CT.MF_FECHA);
        elem.setValue(m_fecha);

        var elem = properties.item(CT.CLI_ID);
        elem.setSelectId(m_cliId);
        elem.setValue(m_cliente);

        var elem = properties.item(CT.MF_NRODOC);
        elem.setValue(m_nrodoc);

        var elem = properties.item(Cairo.Constants.US_ID);
        elem.setSelectId(m_usId);
        elem.setValue(m_usuario);

        var elem = properties.item(CT.LGJ_ID);
        elem.setSelectId(m_lgjId);
        elem.setValue(m_legajo);

        var elem = properties.item(CT.MF_COTIZACION);
        elem.setValue(m_cotizacion);

        var elem = properties.item(CT.CCOS_ID);
        elem.setSelectId(m_ccosId);
        elem.setValue(m_centroCosto);

        var elem = properties.item(CT.SUC_ID);
        elem.setSelectId(m_sucId);
        elem.setValue(m_sucursal);

        var elem = properties.item(CT.MF_DESCRIP);
        elem.setValue(m_descrip);

        return m_dialog.showValues(properties);
      };

      // Cotizacion
      var showCotizacion = function() {
        var monId = null;
        var dDate = null;
        var iProp = null;

        if(m_id === NO_ID) {
          if(m_lastDocId === NO_ID) { return; }
          if(!Cairo.Database.getData(CT.DOCUMENTO, CT.DOC_ID, m_lastDocId, CT.MON_ID, monId)) { return; }
        }
        else {
          monId = m_monId;
        }

        iProp = m_properties.item(CT.MF_COTIZACION);
        iProp.setVisible(monId !== GetMonedaDefault);

        if(m_lastMonIdCotizacion !== monId || iProp.getValue() === 0) {
          dDate = m_properties.item(CT.MF_FECHA).getValue();
          if(!IsDate(dDate)) { dDate = Date; }
          iProp.setValue(cMoneda.getCotizacion(monId, dDate));
          m_lastMonIdCotizacion = monId;
        }

        m_dialog.showValue(iProp);
      };

      var getMonedaDefault = function() {
        var sqlstmt = null;
        var rs = null;

        sqlstmt = "select mon_id from Moneda where mon_legal <> 0";
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return 0; }

        if(rs.isEOF()) {
          MsgWarning(getText(2150, ""));
          //Debe definir cual es la moneda legal con la que opera Cairo
          return null;
        }

        return Cairo.Database.valField(rs.getFields(), CT.MON_ID);
      };

      var setGridEfectivo = function(property) {

        var o = null;
        var iColDebe = null;
        var iColHaber = null;
        var origenDebe = null;
        var origenHaber = null;

        var w_grid = property.getGrid();

        w_grid.getColumns().clear();
        w_grid.getRows().clear();

        var w_columns = w_grid.getColumns();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_MFI_ID);

        if(m_userCfg.getDebeHaberMf()) {

          var elem = w_columns.add(null);
          elem.setName(getText(4814, "")); // Cuenta Debe
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.CUENTA);
          elem.setWidth(1800);
          elem.setKey(KI_CUE_ID_DEBE);
          elem.setSelectFilter(GetHelpFilterCuenta());

          var elem = w_columns.add(null);
          elem.setName(getText(4815, "")); // Cuenta Haber
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.CUENTA);
          elem.setWidth(1800);
          elem.setKey(KI_CUE_ID_HABER);
          elem.setSelectFilter(GetHelpFilterCuenta());

        }
        else {
          var elem = w_columns.add(null);
          elem.setName(getText(2190, "")); // Cuenta Origen
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.CUENTA);
          elem.setWidth(1800);
          elem.setKey(KI_CUE_ID_HABER);
          elem.setSelectFilter(GetHelpFilterCuenta());

          var elem = w_columns.add(null);
          elem.setName(getText(2191, "")); // Cuenta Destino
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.CUENTA);
          elem.setWidth(1800);
          elem.setKey(KI_CUE_ID_DEBE);
          elem.setSelectFilter(GetHelpFilterCuenta());
        }

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setWidth(4000);
        elem.setKey(KI_DESCRIP);

        var elem = w_columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(1200);
        elem.setKey(KI_IMPORTE);

        if(m_userCfg.getDebeHaberMf()) {

          iColDebe = w_columns.add(null, C_ORIGENDEBE);
          iColDebe.setName(getText(4816, "")); // Origen Debe
          iColDebe.setFormat(m_generalConfig.getFormatDecImporte());
          iColDebe.setType(Dialogs.PropertyType.numeric);
          iColDebe.setSubType(Dialogs.PropertySubType.money);
          iColDebe.setWidth(1500);
          iColDebe.setVisible(false);
          iColDebe.setKey(KI_ORIGEN_DEBE);

          iColHaber = w_columns.add(null, C_ORIGENHABER);
          iColHaber.setName(getText(4817, "")); // Origen Haber
          iColHaber.setFormat(m_generalConfig.getFormatDecImporte());
          iColHaber.setType(Dialogs.PropertyType.numeric);
          iColHaber.setSubType(Dialogs.PropertySubType.money);
          iColHaber.setWidth(1500);
          iColHaber.setVisible(false);
          iColHaber.setKey(KI_ORIGEN_HABER);

        }
        else {

          iColHaber = w_columns.add(null, C_ORIGENHABER);
          iColHaber.setName(getText(4818, "")); // Importe Origen Origen
          iColHaber.setFormat(m_generalConfig.getFormatDecImporte());
          iColHaber.setType(Dialogs.PropertyType.numeric);
          iColHaber.setSubType(Dialogs.PropertySubType.money);
          iColHaber.setWidth(1500);
          iColHaber.setVisible(false);
          iColHaber.setKey(KI_ORIGEN_HABER);

          iColDebe = w_columns.add(null, C_ORIGENDEBE);
          iColDebe.setName(getText(4819, "")); // Importe Origen Destino
          iColDebe.setFormat(m_generalConfig.getFormatDecImporte());
          iColDebe.setType(Dialogs.PropertyType.numeric);
          iColDebe.setSubType(Dialogs.PropertySubType.money);
          iColDebe.setWidth(1500);
          iColDebe.setVisible(false);
          iColDebe.setKey(KI_ORIGEN_DEBE);

        }

        var elem = w_columns.add(null);
        elem.setName(getText(1057, "")); // Centro de Costo
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTROCOSTO);
        elem.setWidth(1800);
        elem.setKey(KI_CCOS_ID);

        var w_rows = w_grid.getRows();
        for(var _i = 0; _i < m_data.efectivo.length; _i += 1) {

          var elem = w_rows.add(null, rs(CT.MFI_ID).Value);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.efectivo[_i], CT.MFI_ID);
          elem.setKey(KI_MFI_ID);

          if(m_userCfg.getDebeHaberMf()) {

            var elem = elem.add(null);
            elem.Value = Cairo.Database.valField(m_data.efectivo[_i], "Debe");
            elem.Id = Cairo.Database.valField(m_data.efectivo[_i], CT.CUE_ID_DEBE);
            elem.setKey(KI_CUE_ID_DEBE);

            var elem = elem.add(null);
            elem.Value = Cairo.Database.valField(m_data.efectivo[_i], "Haber");
            elem.Id = Cairo.Database.valField(m_data.efectivo[_i], CT.CUE_ID_HABER);
            elem.setKey(KI_CUE_ID_HABER);

          }
          else {

            var elem = elem.add(null);
            elem.Value = Cairo.Database.valField(m_data.efectivo[_i], "Haber");
            elem.Id = Cairo.Database.valField(m_data.efectivo[_i], CT.CUE_ID_HABER);
            elem.setKey(KI_CUE_ID_HABER);

            var elem = elem.add(null);
            elem.Value = Cairo.Database.valField(m_data.efectivo[_i], "Debe");
            elem.Id = Cairo.Database.valField(m_data.efectivo[_i], CT.CUE_ID_DEBE);
            elem.setKey(KI_CUE_ID_DEBE);
          }

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.efectivo[_i], CT.MFI_DESCRIP);
          elem.setKey(KI_DESCRIP);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.efectivo[_i], CT.MFI_IMPORTE) / cotizacion;
          elem.setKey(KI_IMPORTE);

          if(m_userCfg.getDebeHaberMf()) {

            var elem = elem.add(null);
            elem.Value = Cairo.Database.valField(m_data.efectivo[_i], CT.MFI_IMPORTE_ORIGEN) / cotizacion;
            origenDebe = elem.Value;
            elem.setKey(KI_ORIGEN_DEBE);
            var elem = elem.add(null);
            elem.Value = Cairo.Database.valField(m_data.efectivo[_i], CT.MFI_IMPORTE_ORIGEN_HABER) / cotizacion;
            origenHaber = elem.Value;
            elem.setKey(KI_ORIGEN_HABER);

          }
          else {

            var elem = elem.add(null);
            elem.Value = Cairo.Database.valField(m_data.efectivo[_i], CT.MFI_IMPORTE_ORIGEN_HABER) / cotizacion;
            origenHaber = elem.Value;
            elem.setKey(KI_ORIGEN_HABER);
            var elem = elem.add(null);
            elem.Value = Cairo.Database.valField(m_data.efectivo[_i], CT.MFI_IMPORTE_ORIGEN) / cotizacion;
            origenDebe = elem.Value;
            elem.setKey(KI_ORIGEN_DEBE);

          }

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.efectivo[_i], CT.CCOS_NAME);
          elem.Id = Cairo.Database.valField(m_data.efectivo[_i], CT.CCOS_ID);
          elem.setKey(KI_CCOS_ID);

          if(origenDebe !== 0) { iColDebe.setVisible(true); }
          if(origenHaber !== 0) { iColHaber.setVisible(true); }

        }

        return true;
      };

      var load = function(id) {
        var cotizacion = null;

        var apiPath = Cairo.Database.getAPIVersion();
        return Cairo.Database.getData("load[" + apiPath + "general/movimientofondo]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== NO_ID) {

              m_isNew = false;

              m_cotizacion = Cairo.Database.valField(response.data, CT.MF_COTIZACION);
              cotizacion = (m_cotizacion !== 0) ? m_cotizacion : 1);

              m_id = Cairo.Database.valField(response.data, CT.MF_ID);
              m_numero = Cairo.Database.valField(response.data, CT.MF_NUMERO);
              m_nrodoc = Cairo.Database.valField(response.data, CT.MF_NRODOC);
              m_descrip = Cairo.Database.valField(response.data, CT.MF_DESCRIP);
              m_fecha = Cairo.Database.valField(response.data, CT.MF_FECHA);
              m_total = Cairo.Database.valField(response.data, CT.MF_TOTAL) / cotizacion;
              m_cliId = Cairo.Database.valField(response.data, CT.CLI_ID);
              m_cliente = Cairo.Database.valField(response.data, CT.CLI_NAME);
              m_ccosId = Cairo.Database.valField(response.data, CT.CCOS_ID);
              m_centroCosto = Cairo.Database.valField(response.data, CT.CCOS_NAME);
              m_sucId = Cairo.Database.valField(response.data, CT.SUC_ID);
              m_sucursal = Cairo.Database.valField(response.data, CT.SUC_NAME);
              m_docId = Cairo.Database.valField(response.data, CT.DOC_ID);
              m_documento = Cairo.Database.valField(response.data, CT.DOC_NAME);
              m_doctId = Cairo.Database.valField(response.data, CT.DOCT_ID);
              m_usId = Cairo.Database.valField(response.data, Cairo.Constants.US_ID);
              m_usuario = Cairo.Database.valField(response.data, Cairo.Constants.US_NAME);
              m_lgjId = Cairo.Database.valField(response.data, CT.LGJ_ID);
              m_legajo = Cairo.Database.valField(response.data, CT.LGJ_CODE);
              m_creado = Cairo.Database.valField(response.data, Cairo.Constants.CREADO);
              m_modificado = Cairo.Database.valField(response.data, Cairo.Constants.MODIFICADO);
              m_modifico = Cairo.Database.valField(response.data, Cairo.Constants.MODIFICO);
              m_estId = Cairo.Database.valField(response.data, Cairo.Constants.EST_ID);
              m_estado = Cairo.Database.valField(response.data, Cairo.Constants.EST_NAME);
              m_firmado = Cairo.Database.valField(response.data, CT.MF_FIRMADO);
              m_monId = Cairo.Database.valField(response.data, CT.MON_ID);
              m_docEditable = Cairo.Database.valField(response.data, Cairo.Constants.DOC_EDITABLE);
              m_docEditMsg = Cairo.Database.valField(response.data, Cairo.Constants.DOCEDIT_MSG);

              // Para ver documentos auxiliares
              //
              m_asId = Cairo.Database.valField(response.data, CT.AS_ID);

              m_taPropuesto = Cairo.Database.valField(response.data, Cairo.Constants.TA__PROPUESTO);
              m_taMascara = Cairo.Database.valField(response.data, Cairo.Constants.TA__MASCARA);

              m_lastDocId = m_docId;
              m_lastCliId = m_cliId;
              m_lastDocName = m_documento;
              m_lastCliName = m_cliente;

              m_lastMonIdCotizacion = m_monId;

            }
            else {
              m_id = NO_ID;
              m_numero = 0;
              m_nrodoc = "";
              m_descrip = "";
              m_fecha = VDGetDateById(csDateEnum.cSTODAY);
              m_total = 0;
              m_cliId = NO_ID;
              m_cliente = "";
              m_ccosId = NO_ID;
              m_centroCosto = "";
              m_docId = NO_ID;
              m_documento = "";
              m_doctId = NO_ID;
              m_usId = NO_ID;
              m_usuario = "";
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
              m_cliId = m_lastCliId;
              m_cliente = m_lastCliName;
              m_documento = m_lastDocName;

              // Para ver documentos auxiliares
              //
              m_asId = NO_ID;

              m_taPropuesto = false;
              m_taMascara = "";

              m_lastMonIdCotizacion = NO_ID;

              cId !== NO_ID) { // Cotizacion
                m_cotizacion = DocGetCotizacion(m_docId, m_fecha);
              }

              DocEditableGet(m_docId, m_docEditable, m_docEditMsg, CS.cSPRETSRNEWMOVIMIENTOFONDO);
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
          register.setFieldId(CT.MFI_TMPID);
          register.setTable(CT.MOVIMIENTOFONDOITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KI_MFI_ID:
                if(m_copy) {
                  fields.add(CT.MFI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(CT.MFI_ID, Cairo.Util.val(cell.getValue()), Types.integer);
                }
                break;

              case KI_DESCRIP:
                fields.add(CT.MFI_DESCRIP, cell.getValue(), Types.text);
                break;

              case KI_CCOS_ID:
                fields.add(CT.CCOS_ID, cell.getId(), Types.id);
                break;

              case KI_CUE_ID_DEBE:
                fields.add(CT.CUE_ID_DEBE, cell.getId(), Types.id);
                break;

              case KI_CUE_ID_HABER:
                fields.add(CT.CUE_ID_HABER, cell.getId(), Types.id);
                break;

              case KI_IMPORTE:
                origen = cell.getValue();
                break;

              case KI_ORIGEN_DEBE:
                fields.add(CT.MFI_IMPORTE_ORIGEN, cell.getValue(), Types.currency);
                break;

              case KI_ORIGEN_HABER:
                fields.add(CT.MFI_IMPORTE_ORIGEN_HABER, cell.getValue(), Types.currency);
                break;
            }
          }

          fields.add(CT.MFI_IMPORTE, origen * cotizacion, Types.currency);
          if(bMonedaLegal) {
            if(m_items.getProperties().item(C_EFECTIVO).getGrid().getColumns(C_ORIGENDEBE).Visible === false) {
              fields.add(CT.MFI_IMPORTE_ORIGEN, 0, Types.currency);
            }
          }
          else {
            fields.add(CT.MFI_IMPORTE_ORIGEN, origen, Types.currency);
          }

          m_orden = m_orden + 1;
          fields.add(CT.MFI_ORDEN, m_orden, Types.integer);
          fields.add(CT.MFI_TIPO, csEMovimientoFondoItemTipo.cSEMFITEFECTIVO, Types.integer);
          fields.add(CT.MF_TMPID, id, Types.id);

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
            register.setFieldId(CT.MFIB_TMPID);
            register.setTable(CT.MOVIMIENTOFONDOITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            fields.add(CT.MFI_ID, Cairo.Util.val(vDeletes(i)), Types.integer);
            fields.add(CT.MF_ID, m_id, Types.id);
            fields.add(CT.MF_TMPID, id, Types.id);

            register.getFields().setHaveLastUpdate(false);
            register.getFields().setHaveWhoModify(false);

            if(!Cairo.Database.save(register, , "saveEfectivo", C_MODULE, c_ErrorSave)) { return false; }
          }

        }

        return true;
      };

      // Reglas del Objeto de Negocios
      var pShowTotales = function() {
        var total = null;
        var row = null;

        var _count = getCheques().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = getCheques().getRows().item(_i);
          total = total + Cairo.Util.val(Dialogs.cell(row, KICH_IMPORTE).getValue());
        }

        var _count = getTCheques().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = getTCheques().getRows().item(_i);
          total = total + Cairo.Util.val(Dialogs.cell(row, KICH_IMPORTE).getValue());
        }

        var _count = getICheques().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = getICheques().getRows().item(_i);
          total = total + Cairo.Util.val(Dialogs.cell(row, KICH_IMPORTE).getValue());
        }

        var _count = getEfectivo().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = getEfectivo().getRows().item(_i);
          total = total + Cairo.Util.val(Dialogs.cell(row, KI_IMPORTE).getValue());
        }

        m_footerProps.item(CT.MF_TOTAL).setValue(total);

        m_footer.refreshControls();
      };

      var setEnabled = function() {
        var bState = null;

        if(m_docEditable) {
          bState = m_properties.item(CT.DOC_ID).getSelectId() !== NO_ID;
        }
        else {
          bState = false;
        }

        pSetEnabledAux(bState);
      };

      var pSetEnabledAux = function(bState) {
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

      var getCueIdCliente = function(mon_id, cue_id) { // TODO: Use of ByRef founded Private Function getCueIdCliente(ByRef Mon_id As Long, ByRef Cue_id As Long) As Boolean
        var sqlstmt = null;
        var rs = null;

        cId; // Cuenta contable del cliente
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

        if(rs.isEOF()) { return false; }

        cue_id = Cairo.Database.valField(rs.getFields(), CT.CUE_ID);
        mon_id = Cairo.Database.valField(rs.getFields(), CT.MON_ID);

        return true;
      };

      var signDocument = function() {
        var doc = null;
        var us_id = null;

        doc = new cDocumento();

        if(m_id === NO_ID) {
          MsgWarning(getText(1592, ""));
          //Antes de poder firmar el documento debe guardarlo.
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

        sqlstmt = "sp_DocMovimientoFondoFirmar "+ m_id+ ","+ us_id.toString();
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

        m_estId = Cairo.Database.valField(rs.getFields(), Cairo.Constants.EST_ID);
        m_estado = Cairo.Database.valField(rs.getFields(), Cairo.Constants.EST_NAME);

        var iProp = null;
        iProp = m_properties.item(cDeclarations.getCsDocEstateID());

        iProp.setSelectId(m_estId);
        iProp.setValue(m_estado);

        Cairo.Database.getData(CT.MOVIMIENTOFONDO, CT.MF_ID, m_id, CT.MF_FIRMADO, m_firmado);

        m_dialog.showValue(iProp);

        return true;
      };

      var move = function(moveTo) {
        var sqlstmt = null;
        var rs = null;
        var doc_id = null;

        doc_id = m_properties.item(CT.DOC_ID).getSelectId();

        if(doc_id === NO_ID) { return M.showInfoWithFalse(getText(1595, "")); }
        //Debe seleccionar un documento

        sqlstmt = "sp_DocMovimientoFondoMover "+ moveTo+ ","+ m_numero+ ","+ doc_id.toString();

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
              refreshProperties();

              // Obtengo un nuevo numero de comprobante
              //
              GetDocNumber(m_lastDocId, m_dialog, m_taPropuesto, CT.MF_NRODOC);

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
        var cotizacion = null;

        var properties = m_dialog.getProperties();

        c = properties.item(CT.DOC_ID);
        c.setSelectId(m_docId);
        c.setValue(m_documento);

        c = properties.item(CT.MF_FECHA);
        c.setValue(m_fecha);

        c = properties.item(CT.CLI_ID);
        c.setSelectId(m_cliId);
        c.setValue(m_cliente);

        c = properties.item(cDeclarations.getCsDocNumberID());
        c.setValue(m_numero);

        c = properties.item(cDeclarations.getCsDocEstateID());
        c.setValue(m_estado);

        c = properties.item(CT.MF_NRODOC);
        c.setValue(m_nrodoc);
        c.setTextMask(m_taMascara);
        c.setTextAlign(vbRightJustify);

        c = properties.item(Cairo.Constants.US_ID);
        c.setSelectId(m_usId);
        c.setValue(m_usuario);

        c = properties.item(CT.MF_COTIZACION);
        c.setValue(m_cotizacion);

        c = properties.item(CT.CCOS_ID);
        c.setSelectId(m_ccosId);
        c.setValue(m_centroCosto);

        c = properties.item(CT.SUC_ID);
        c.setSelectId(m_sucId);
        c.setValue(m_sucursal);

        c = properties.item(CT.LGJ_ID);
        c.setSelectId(m_lgjId);
        c.setValue(m_legajo);

        c = properties.item(CT.MF_DESCRIP);
        c.setValue(m_descrip);

        abmGen = m_dialog;
        abmGen.ShowValues(m_dialog.getProperties());

        abmGen.ResetChanged;

        if(m_cotizacion !== 0) {
          cotizacion = m_cotizacion;
        }
        else {
          cotizacion = 1;
        }

        c = m_items.getProperties().item(C_EFECTIVO);
        if(!loadEfectivo(c, cotizacion)) { return; }

                #If PREPROC_SFS Then;
        var abmObj = null;
                #Else;
        var abmObj = null;
                #End If;

        abmObj = m_dialog;
        abmObj.RefreshColumnProperties(c, C_ORIGENDEBE);
        abmObj.RefreshColumnProperties(c, C_ORIGENHABER);

        m_efectivoDeleted = "";

        c = m_items.getProperties().item(C_CHEQUES);
        if(!loadCheques(c)) { return; }

        m_chequesDeleted = "";

        c = m_items.getProperties().item(C_CHEQUEST);
        if(!loadTCheques(c)) { return; }

        m_tChequesDeleted = "";

        c = m_items.getProperties().item(C_CHEQUESI);
        if(!loadICheques(c)) { return; }

        m_iChequesDeleted = "";

        abmGen = m_items;
        abmGen.ShowValues(m_items.getProperties());

        c = m_footerProps.item(CT.MF_TOTAL);
        c.setValue(m_total);

        abmGen = m_footer;
        abmGen.ShowValues(m_footer.getProperties());

        setEnabled();
      };

      // Construccion - Destruccion
      self.initialize = function() {
        try {

          c_ErrorSave = getText(2242, ""); // Error al grabar el Movimiento de Fondo

          m_generalConfig = new cGeneralConfig();
          m_generalConfig.Load;
          m_defaultCurrency = GetMonedaDefault();

          // Preferencias del Usuario
          //
          m_userCfg = new cUsuarioConfig();
          m_userCfg.Load;
          m_userCfg.ValidateMF;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "Class_Initialize", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };



      //------------------------------------------------------------------------------------------------
      var saveICheques = function(id) {
        var register = null;
        var row = null;
        var cell = null;

        var _count = getICheques().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = getICheques().getRows().item(_i);

          register = new cRegister();
          register.setFieldId(CT.MFI_TMPID);
          register.setTable(CT.MOVIMIENTOFONDOITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KICH_MFI_ID:
                if(m_copy) {
                  fields.add(CT.MFI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(CT.MFI_ID, Cairo.Util.val(cell.getValue()), Types.integer);
                }

                break;

              case mPublic.kICHT_DESCRIP:
                fields.add(CT.MFI_DESCRIP, cell.getValue(), Types.text);

                break;

              case mPublic.kICHT_CHEQUE:
                fields.add(CT.MFI_TMPCHEQUE, cell.getValue(), Types.text);

                break;

              case mPublic.kICHT_CHEQ_ID:
                fields.add(CT.CHEQ_ID, cell.getId(), Types.id);

                break;

              case mPublic.kICHT_CLE_ID:
                fields.add(CT.CLE_ID, cell.getId(), Types.id);

                break;

              case mPublic.kICHT_BCO_ID:
                fields.add(CT.BCO_ID, cell.getId(), Types.id);

                break;

              case mPublic.kICHT_MON_ID:
                fields.add(CT.MON_ID, cell.getId(), Types.id);

                break;

              case mPublic.kICHT_FECHACOBRO:
                fields.add(CT.MFI_TMPFECHA_COBRO, cell.getValue(), Types.date);

                break;

              case mPublic.kICHT_FECHAVTO:
                fields.add(CT.MFI_TMPFECHA_VTO, cell.getValue(), Types.date);

                break;

              case KI_CUE_ID_DEBE:
                fields.add(CT.CUE_ID_DEBE, cell.getId(), Types.id);

                break;

              case KI_CUE_ID_HABER:
                fields.add(CT.CUE_ID_HABER, cell.getId(), Types.id);

                break;

              case mPublic.kICHT_IMPORTEORIGEN:
                fields.add(CT.MFI_IMPORTE_ORIGEN, Cairo.Util.val(cell.getValue()), Types.currency);

                break;

              case mPublic.kICHT_IMPORTE:
                fields.add(CT.MFI_IMPORTE, Cairo.Util.val(cell.getValue()), Types.currency);

                break;

              case KI_CCOS_ID:
                fields.add(CT.CCOS_ID, cell.getId(), Types.id);
                break;
            }
          }

          m_orden = m_orden + 1;
          fields.add(CT.MFI_ORDEN, m_orden, Types.integer);
          fields.add(CT.MFI_TIPO, csEMovimientoFondoItemTipo.cSEMFITCHEQUESI, Types.integer);
          fields.add(CT.MF_TMPID, id, Types.id);
          fields.add(CT.MFI_ID, Cairo.Constants.NEW_ID, Types.long);

          register.getFields().setHaveLastUpdate(false);
          register.getFields().setHaveWhoModify(false);

          if(!Cairo.Database.save(register, , "saveICheques", C_MODULE, c_ErrorSave)) { return false; }
        }

        var sqlstmt = null;

        if(m_iChequesDeleted !== "" && m_id !== NO_ID && !m_copy) {

          var vDeletes = null;
          var i = null;

          m_iChequesDeleted = RemoveLastColon(m_iChequesDeleted);
          vDeletes = Split(m_iChequesDeleted, ",");

          for (i = 0; i <= vDeletes.Length; i++) {

            register = new cRegister();
            register.setFieldId(CT.MFIB_TMPID);
            register.setTable(CT.MOVIMIENTOFONDOITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            fields.add(CT.MFI_ID, Cairo.Util.val(vDeletes(i)), Types.integer);
            fields.add(CT.MF_ID, m_id, Types.id);
            fields.add(CT.MF_TMPID, id, Types.id);

            register.getFields().setHaveLastUpdate(false);
            register.getFields().setHaveWhoModify(false);

            if(!Cairo.Database.save(register, , "saveICheques", C_MODULE, c_ErrorSave)) { return false; }
          }

        }

        return true;
      };

      var saveTCheques = function(id) {
        var register = null;
        var row = null;
        var cell = null;

        var _count = getTCheques().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = getTCheques().getRows().item(_i);

          register = new cRegister();
          register.setFieldId(CT.MFI_TMPID);
          register.setTable(CT.MOVIMIENTOFONDOITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KICH_MFI_ID:
                if(m_copy) {
                  fields.add(CT.MFI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(CT.MFI_ID, Cairo.Util.val(cell.getValue()), Types.integer);
                }
                break;

              case mPublic.kICHT_DESCRIP:
                fields.add(CT.MFI_DESCRIP, cell.getValue(), Types.text);

                break;

              case mPublic.kICHT_CHEQUE:
                fields.add(CT.CHEQ_ID, cell.getId(), Types.id);

                break;

              case mPublic.kICHT_CLE_ID:
                fields.add(CT.CLE_ID, cell.getId(), Types.id);

                break;

              case mPublic.kICHT_MON_ID:
                fields.add(CT.MON_ID, cell.getId(), Types.id);

                break;

              case mPublic.kICHT_FECHACOBRO:
                fields.add(CT.MFI_TMPFECHA_COBRO, cell.getValue(), Types.date);

                break;

              case mPublic.kICHT_FECHAVTO:
                fields.add(CT.MFI_TMPFECHA_VTO, cell.getValue(), Types.date);

                break;

              case KI_CUE_ID_DEBE:
                fields.add(CT.CUE_ID_DEBE, cell.getId(), Types.id);
                break;

              case KI_CUE_ID_HABER:
                fields.add(CT.CUE_ID_HABER, cell.getId(), Types.id);

                break;

              case mPublic.kICHT_IMPORTEORIGEN:
                fields.add(CT.MFI_IMPORTE_ORIGEN, Cairo.Util.val(cell.getValue()), Types.currency);

                break;

              case mPublic.kICHT_IMPORTE:
                fields.add(CT.MFI_IMPORTE, Cairo.Util.val(cell.getValue()), Types.currency);

                break;

              case KI_CCOS_ID:
                fields.add(CT.CCOS_ID, cell.getId(), Types.id);
                break;
            }
          }

          m_orden = m_orden + 1;
          fields.add(CT.MFI_ORDEN, m_orden, Types.integer);
          fields.add(CT.MFI_TIPO, csEMovimientoFondoItemTipo.cSEMFITCHEQUEST, Types.integer);
          fields.add(CT.MF_TMPID, id, Types.id);
          fields.add(CT.MFI_ID, Cairo.Constants.NEW_ID, Types.long);

          register.getFields().setHaveLastUpdate(false);
          register.getFields().setHaveWhoModify(false);

          if(!Cairo.Database.save(register, , "saveTCheques", C_MODULE, c_ErrorSave)) { return false; }
        }

        var sqlstmt = null;

        if(m_tChequesDeleted !== "" && m_id !== NO_ID && !m_copy) {

          var vDeletes = null;
          var i = null;

          m_tChequesDeleted = RemoveLastColon(m_tChequesDeleted);
          vDeletes = Split(m_tChequesDeleted, ",");

          for (i = 0; i <= vDeletes.Length; i++) {

            register = new cRegister();
            register.setFieldId(CT.MFIB_TMPID);
            register.setTable(CT.MOVIMIENTOFONDOITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            fields.add(CT.MFI_ID, Cairo.Util.val(vDeletes(i)), Types.integer);
            fields.add(CT.MF_ID, m_id, Types.id);
            fields.add(CT.MF_TMPID, id, Types.id);

            register.getFields().setHaveLastUpdate(false);
            register.getFields().setHaveWhoModify(false);

            if(!Cairo.Database.save(register, , "saveTCheques", C_MODULE, c_ErrorSave)) { return false; }
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
          register.setFieldId(CT.MFI_TMPID);
          register.setTable(CT.MOVIMIENTOFONDOITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KICH_MFI_ID:
                if(m_copy) {
                  fields.add(CT.MFI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(CT.MFI_ID, Cairo.Util.val(cell.getValue()), Types.integer);
                }
                break;

              case KICH_DESCRIP:
                fields.add(CT.MFI_DESCRIP, cell.getValue(), Types.text);

                break;

              case KICH_CHEQUERA:
                fields.add(CT.CHQ_ID, cell.getId(), Types.id);

                break;

              case KICH_CHEQUE:
                fields.add(CT.MFI_TMPCHEQUE, cell.getValue(), Types.text);

                break;

              case KICH_CHEQ_ID:

                if(m_copy) {
                  fields.add(CT.CHEQ_ID, NO_ID, Types.id);
                }
                else {
                  fields.add(CT.CHEQ_ID, cell.getId(), Types.id);
                }

                break;

              case KICH_CLE_ID:
                fields.add(CT.CLE_ID, cell.getId(), Types.id);

                break;

              case KICH_MON_ID:
                fields.add(CT.MON_ID, cell.getId(), Types.id);
                break;

              case KICH_FECHACOBRO:
                fields.add(CT.MFI_TMPFECHA_COBRO, cell.getValue(), Types.date);
                break;

              case KICH_FECHAVTO:
                fields.add(CT.MFI_TMPFECHA_VTO, cell.getValue(), Types.date);

                break;

              case KI_CUE_ID_DEBE:
                fields.add(CT.CUE_ID_DEBE, cell.getId(), Types.id);
                break;

              case KI_CUE_ID_HABER:
                fields.add(CT.CUE_ID_HABER, cell.getId(), Types.id);

                break;

              case KICH_IMPORTEORIGEN:
                fields.add(CT.MFI_IMPORTE_ORIGEN, Cairo.Util.val(cell.getValue()), Types.currency);
                break;

              case KICH_IMPORTE:
                fields.add(CT.MFI_IMPORTE, Cairo.Util.val(cell.getValue()), Types.currency);

                break;

              case KI_CCOS_ID:
                fields.add(CT.CCOS_ID, cell.getId(), Types.id);
                break;
            }
          }

          m_orden = m_orden + 1;
          fields.add(CT.MFI_ORDEN, m_orden, Types.integer);
          fields.add(CT.MFI_TIPO, csEMovimientoFondoItemTipo.cSEMFITCHEQUES, Types.integer);
          fields.add(CT.MF_TMPID, id, Types.id);

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
            register.setFieldId(CT.MFIB_TMPID);
            register.setTable(CT.MOVIMIENTOFONDOITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            fields.add(CT.MFI_ID, Cairo.Util.val(vDeletes(i)), Types.integer);
            fields.add(CT.MF_ID, m_id, Types.id);
            fields.add(CT.MF_TMPID, id, Types.id);

            register.getFields().setHaveLastUpdate(false);
            register.getFields().setHaveWhoModify(false);

            if(!Cairo.Database.save(register, , "saveCheques", C_MODULE, c_ErrorSave)) { return false; }
          }

        }

        return true;
      };

      var getICheques = function() {
        return m_items.getProperties().item(C_CHEQUESI).getGrid();
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

      var setGridICheques = function(property) {

        var w_grid = property.getGrid();

        w_grid.getColumns().clear();
        w_grid.getRows().clear();

        var w_columns = w_grid.getColumns();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(mPublic.kICHT_MFI_ID);

        var elem = w_columns.add(null);
        elem.setName(getText(2190, "")); // Cuenta Origen
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);

        //.HelpFilter = cscCuecId & "=" & csECuecDocEnCartera
        elem.setSelectFilter(GetHelpFilterCuenta());

        elem.setWidth(2200);
        elem.setKey(KI_CUE_ID_HABER);

        var elem = w_columns.add(null);
        elem.setName(getText(2191, "")); // Cuenta Destino
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);

        elem.setSelectFilter(mPublic.self.getHelpFilterCheques());

        elem.setWidth(1800);
        elem.setKey(KI_CUE_ID_DEBE);

        var elem = w_columns.add(null);
        elem.setName(getText(2063, "")); // Mon
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setWidth(520);
        elem.setKey(mPublic.kICHT_MON_ID);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        elem.setName(getText(1901, "")); // Origen
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(mPublic.kICHT_IMPORTEORIGEN);

        var elem = w_columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(mPublic.kICHT_IMPORTE);

        var elem = w_columns.add(null);
        elem.setName(getText(1122, "")); // Banco
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.BANCO);
        elem.setWidth(2000);
        elem.setKey(mPublic.kICHT_BCO_ID);

        var elem = w_columns.add(null, C_CHEQUET);
        elem.setName(getText(2059, "")); // Nr. Cheque
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(mPublic.kICHT_CHEQUE);

        var elem = w_columns.add(null);
        elem.setName(getText(2058, "")); // Cheque
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(mPublic.kICHT_CHEQ_ID);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        elem.setName(getText(2065, "")); // Depositar el
        elem.setType(Dialogs.PropertyType.date);
        elem.setDefaultValue(new cABMGridRowValue());
        elem.getDefaultValue().setValue(Date);
        elem.setWidth(970);
        elem.setKey(mPublic.kICHT_FECHACOBRO);

        var elem = w_columns.add(null);
        elem.setName(getText(1634, "")); // Vto.
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(970);
        elem.setDefaultValue(new cABMGridRowValue());
        elem.getDefaultValue().setValue(DateAdd("m", 1, Date));
        elem.setKey(mPublic.kICHT_FECHAVTO);

        var elem = w_columns.add(null);
        elem.setName(getText(1083, "")); // Clering
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CLEARING);
        elem.setWidth(800);
        elem.setKey(mPublic.kICHT_CLE_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setWidth(1600);
        elem.setKey(mPublic.kICHT_DESCRIP);

        var elem = w_columns.add(null);
        elem.setName(getText(1057, "")); // Centro de Costo
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTROCOSTO);
        elem.setWidth(1800);
        elem.setKey(KI_CCOS_ID);

        var w_rows = w_grid.getRows();

        for(var _i = 0; _i < m_data.iCheques.length; _i += 1) {

          var elem = w_rows.add(null, rs(CT.MFI_ID).Value);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.iCheques[_i], CT.MFI_ID);
          elem.setKey(mPublic.kICHT_MFI_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.iCheques[_i], "Haber");
          elem.Id = Cairo.Database.valField(m_data.iCheques[_i], CT.CUE_ID_HABER);
          elem.setKey(KI_CUE_ID_HABER);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.iCheques[_i], "Debe");
          elem.Id = Cairo.Database.valField(m_data.iCheques[_i], CT.CUE_ID_DEBE);
          elem.setKey(KI_CUE_ID_DEBE);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.iCheques[_i], CT.MON_NAME);
          elem.Id = Cairo.Database.valField(m_data.iCheques[_i], CT.MON_ID);
          elem.setKey(mPublic.kICHT_MON_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.iCheques[_i], CT.MFI_IMPORTE_ORIGEN);
          elem.setKey(mPublic.kICHT_IMPORTEORIGEN);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.iCheques[_i], CT.MFI_IMPORTE);
          elem.setKey(mPublic.kICHT_IMPORTE);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.iCheques[_i], CT.BCO_NAME);
          elem.Id = Cairo.Database.valField(m_data.iCheques[_i], CT.BCO_ID);
          elem.setKey(mPublic.kICHT_BCO_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.iCheques[_i], CT.CHEQ_NUMERO_DOC);
          elem.setKey(mPublic.kICHT_CHEQUE);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.iCheques[_i], CT.CHEQ_NUMERO);
          elem.Id = Cairo.Database.valField(m_data.iCheques[_i], CT.CHEQ_ID);
          elem.setKey(mPublic.kICHT_CHEQ_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.iCheques[_i], CT.CHEQ_FECHA_COBRO);
          elem.setKey(KICH_FECHACOBRO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.iCheques[_i], CT.CHEQ_FECHA_VTO);
          elem.setKey(KICH_FECHAVTO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.iCheques[_i], CT.CLE_NAME);
          elem.Id = Cairo.Database.valField(m_data.iCheques[_i], CT.CLE_ID);
          elem.setKey(KICH_CLE_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.iCheques[_i], CT.MFI_DESCRIP);
          elem.setKey(KICH_DESCRIP);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.iCheques[_i], CT.CCOS_NAME);
          elem.Id = Cairo.Database.valField(m_data.iCheques[_i], CT.CCOS_ID);
          elem.setKey(KI_CCOS_ID);

        }

        return true;
      };

      var setGridTCheques = function(property) {

        var w_grid = property.getGrid();

        w_grid.getColumns().clear();
        w_grid.getRows().clear();

        var w_columns = w_grid.getColumns();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(mPublic.kICHT_MFI_ID);

        var elem = w_columns.add(null);
        elem.setName(getText(2190, "")); // Cuenta Origen
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);

        //.HelpFilter = cscCuecId & "=" & csECuecDocEnCartera
        elem.setSelectFilter(mPublic.self.getHelpFilterChequesT());

        elem.setWidth(2200);
        elem.setKey(KI_CUE_ID_HABER);

        var elem = w_columns.add(null);
        elem.setName(getText(2191, "")); // Cuenta Destino
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setWidth(1800);
        elem.setKey(KI_CUE_ID_DEBE);

        var elem = w_columns.add(null, C_CHEQUET);
        elem.setName(getText(2059, "")); // Nr. Cheque
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(csETablesTesoreria.cSCHEQUE);
        elem.setSelectFilter("1 = 2");
        elem.setSubType(Dialogs.PropertySubType.Integer);
        elem.setWidth(1000);
        elem.setKey(mPublic.kICHT_CHEQUE);

        var elem = w_columns.add(null);
        elem.setName(getText(1150, "")); // Cliente
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(2000);
        elem.setKey(mPublic.kICHT_CLI_ID);

        var elem = w_columns.add(null);
        elem.setName(getText(1122, "")); // Banco
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(2000);
        elem.setKey(mPublic.kICHT_BCO_ID);

        var elem = w_columns.add(null);
        elem.setName(getText(2063, "")); // Mon
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setWidth(520);
        elem.setKey(mPublic.kICHT_MON_ID);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        elem.setName(getText(1901, "")); // Origen
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(mPublic.kICHT_IMPORTEORIGEN);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(mPublic.kICHT_IMPORTE);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        elem.setName(getText(2065, "")); // Depositar el
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(970);
        elem.setKey(mPublic.kICHT_FECHACOBRO);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        elem.setName(getText(1634, "")); // Vto.
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(970);
        elem.setKey(mPublic.kICHT_FECHAVTO);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        elem.setName(getText(1083, "")); // Clering
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

        var elem = w_columns.add(null);
        elem.setName(getText(1057, "")); // Centro de Costo
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTROCOSTO);
        elem.setWidth(1800);
        elem.setKey(KI_CCOS_ID);

        var w_rows = w_grid.getRows();

        for(var _i = 0; _i < m_data.tCheques.length; _i += 1) {

          var elem = w_rows.add(null, rs(CT.MFI_ID).Value);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.tCheques[_i], CT.MFI_ID);
          elem.setKey(mPublic.kICHT_MFI_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.tCheques[_i], "Haber");
          elem.Id = Cairo.Database.valField(m_data.tCheques[_i], CT.CUE_ID_HABER);
          elem.setKey(KI_CUE_ID_HABER);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.tCheques[_i], "Debe");
          elem.Id = Cairo.Database.valField(m_data.tCheques[_i], CT.CUE_ID_DEBE);
          elem.setKey(KI_CUE_ID_DEBE);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.tCheques[_i], CT.CHEQ_NUMERO_DOC);
          elem.Id = Cairo.Database.valField(m_data.tCheques[_i], CT.CHEQ_ID);
          elem.setKey(mPublic.kICHT_CHEQUE);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.tCheques[_i], CT.CLI_NAME);
          elem.setKey(mPublic.kICHT_CLI_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.tCheques[_i], CT.BCO_NAME);
          elem.setKey(mPublic.kICHT_BCO_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.tCheques[_i], CT.MON_NAME);
          elem.Id = Cairo.Database.valField(m_data.tCheques[_i], CT.MON_ID);
          elem.setKey(mPublic.kICHT_MON_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.tCheques[_i], CT.MFI_IMPORTE_ORIGEN);
          elem.setKey(mPublic.kICHT_IMPORTEORIGEN);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.tCheques[_i], CT.MFI_IMPORTE);
          elem.setKey(mPublic.kICHT_IMPORTE);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.tCheques[_i], CT.CHEQ_FECHA_COBRO);
          elem.setKey(KICH_FECHACOBRO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.tCheques[_i], CT.CHEQ_FECHA_VTO);
          elem.setKey(KICH_FECHAVTO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.tCheques[_i], CT.CLE_NAME);
          elem.setKey(KICH_CLE_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.tCheques[_i], CT.MFI_DESCRIP);
          elem.setKey(KICH_DESCRIP);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.tCheques[_i], CT.CCOS_NAME);
          elem.Id = Cairo.Database.valField(m_data.tCheques[_i], CT.CCOS_ID);
          elem.setKey(KI_CCOS_ID);

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
        elem.setKey(KICH_MFI_ID);

        var elem = w_columns.add(null);
        elem.setName(getText(2190, "")); // Cuenta Origen
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);

        //.HelpFilter = cscCuecId & "=" & csECuecBancos
        elem.setSelectFilter(mPublic.self.getHelpFilterChequesP());

        elem.setWidth(2200);
        elem.setKey(KI_CUE_ID_HABER);

        var elem = w_columns.add(null);
        elem.setName(getText(2191, "")); // Cuenta Destino
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setWidth(1800);
        elem.setKey(KI_CUE_ID_DEBE);

        var elem = w_columns.add(null);
        elem.setName(getText(2063, "")); // Mon
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setWidth(520);
        elem.setKey(KICH_MON_ID);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        elem.setName(getText(1901, "")); // Origen
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KICH_IMPORTEORIGEN);

        var elem = w_columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KICH_IMPORTE);

        var elem = w_columns.add(null, C_CHEQUERA);
        elem.setName(getText(2064, "")); // Chequera
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CHEQUERA);
        elem.setWidth(1000);
        elem.setKey(KICH_CHEQUERA);

        var elem = w_columns.add(null);
        elem.setName(getText(2059, "")); // Nr. Cheque
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(KICH_CHEQUE);

        var elem = w_columns.add(null);
        elem.setName(getText(2058, "")); // Cheque
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setEnabled(false);
        elem.setKey(KICH_CHEQ_ID);

        var elem = w_columns.add(null);
        elem.setName(getText(2065, "")); // Depositar el
        elem.setType(Dialogs.PropertyType.date);
        elem.setDefaultValue(new cABMGridRowValue());
        elem.getDefaultValue().setValue(Date);
        elem.setWidth(970);
        elem.setKey(KICH_FECHACOBRO);

        var elem = w_columns.add(null);
        elem.setName(getText(1634, "")); // Vto.
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(970);
        elem.setDefaultValue(new cABMGridRowValue());
        elem.getDefaultValue().setValue(DateAdd("m", 1, Date));
        elem.setKey(KICH_FECHAVTO);

        var elem = w_columns.add(null);
        elem.setName(getText(1083, "")); // Clering
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

        var elem = w_columns.add(null);
        elem.setName(getText(1057, "")); // Centro de Costo
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTROCOSTO);
        elem.setWidth(1800);
        elem.setKey(KI_CCOS_ID);

        var w_rows = w_grid.getRows();

        for(var _i = 0; _i < m_data.cheques.length; _i += 1) {

          var elem = w_rows.add(null, rs(CT.MFI_ID).Value);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], CT.MFI_ID);
          elem.setKey(KICH_MFI_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], "Haber");
          elem.Id = Cairo.Database.valField(m_data.cheques[_i], CT.CUE_ID_HABER);
          elem.setKey(KI_CUE_ID_HABER);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], "Debe");
          elem.Id = Cairo.Database.valField(m_data.cheques[_i], CT.CUE_ID_DEBE);
          elem.setKey(KI_CUE_ID_DEBE);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], CT.MON_NAME);
          elem.Id = Cairo.Database.valField(m_data.cheques[_i], CT.MON_ID);
          elem.setKey(KICH_MON_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], CT.MFI_IMPORTE_ORIGEN);
          elem.setKey(KICH_IMPORTEORIGEN);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], CT.MFI_IMPORTE);
          elem.setKey(KICH_IMPORTE);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], CT.CHQ_CODE);
          elem.Id = Cairo.Database.valField(m_data.cheques[_i], CT.CHQ_ID);
          elem.setKey(KICH_CHEQUERA);

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
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], CT.MFI_DESCRIP);
          elem.setKey(KICH_DESCRIP);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.cheques[_i], CT.CCOS_NAME);
          elem.Id = Cairo.Database.valField(m_data.cheques[_i], CT.CCOS_ID);
          elem.setKey(KI_CCOS_ID);

        }

        return true;
      };

      var columnAfterUpdateICheque = function(property, lRow, lCol) { // TODO: Use of ByRef founded Private Function columnAfterUpdateICheque(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long) As Boolean
        var _rtn = null;
        var row = null;
        var value = null;

        var w_grid = property.getGrid();

        switch (w_grid.getColumns(lCol).Key) {

          case mPublic.kICHT_IMPORTEORIGEN:
            row = w_grid.getRows(lRow);
            var w_pCell = Dialogs.cell(row, mPublic.kICHT_MON_ID);
            if(w_pCell.getID() !== m_defaultCurrency || w_pCell.getID() === 0) {
              Dialogs.cell(row, mPublic.kICHT_IMPORTE).getValue() === Cairo.Util.val(Dialogs.cell(row, mPublic.kICHT_IMPORTEORIGEN).getValue()) * Cairo.Util.val(getCotizacion().getValue());
            }
            else {
              Dialogs.cell(row, mPublic.kICHT_IMPORTEORIGEN).getValue() === 0;
            }

            break;

          case KI_CUE_ID_DEBE:
            var monId = null;
            var cueId = null;
            var moneda = null;

            row = w_grid.getRows(lRow);

            cueId = Dialogs.cell(row, KI_CUE_ID_DEBE).getID();
            GetMonedaFromCuenta(monId, moneda, cueId);

            var w_pCell = Dialogs.cell(row, mPublic.kICHT_MON_ID);
            w_pCell.setValue(moneda);
            w_pCell.setID(monId);

            if(monId === m_defaultCurrency || monId === 0) {
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

          case mPublic.kICHT_IMPORTE:

            pShowTotales();

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

      var columnAfterUpdateTCheque = function(property, lRow, lCol) { // TODO: Use of ByRef founded Private Function columnAfterUpdateTCheque(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long) As Boolean
        var _rtn = null;
        var row = null;
        var value = null;

        var w_grid = property.getGrid();

        switch (w_grid.getColumns(lCol).Key) {

          case mPublic.kICHT_IMPORTEORIGEN:
            row = w_grid.getRows(lRow);
            var w_pCell = Dialogs.cell(row, mPublic.kICHT_MON_ID);
            if(w_pCell.getID() !== m_defaultCurrency || w_pCell.getID() === 0) {
              Dialogs.cell(row, mPublic.kICHT_IMPORTE).getValue() === Cairo.Util.val(Dialogs.cell(row, mPublic.kICHT_IMPORTEORIGEN).getValue()) * Cairo.Util.val(getCotizacion().getValue());
            }
            else {
              Dialogs.cell(row, mPublic.kICHT_IMPORTEORIGEN).getValue() === 0;
            }

            break;

          case KI_CUE_ID_HABER:
            var monId = null;
            var cueId = null;
            var moneda = null;

            row = w_grid.getRows(lRow);

            cueId = Dialogs.cell(row, KI_CUE_ID_HABER).getID();
            GetMonedaFromCuenta(monId, moneda, cueId);

            var w_pCell = Dialogs.cell(row, mPublic.kICHT_MON_ID);
            w_pCell.setValue(moneda);
            w_pCell.setID(monId);

            if(monId === m_defaultCurrency || monId === 0) {
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

            pShowTotales();

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

      var columnAfterUpdateCheque = function(property, lRow, lCol) { // TODO: Use of ByRef founded Private Function columnAfterUpdateCheque(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long) As Boolean
        var _rtn = null;
        var row = null;
        var value = null;

        var w_grid = property.getGrid();
        switch (w_grid.getColumns(lCol).Key) {
          case KICH_IMPORTEORIGEN:
            row = w_grid.getRows(lRow);
            var w_pCell = Dialogs.cell(row, KICH_MON_ID);
            if(w_pCell.getID() !== m_defaultCurrency || w_pCell.getID() === 0) {
              Dialogs.cell(row, KICH_IMPORTE).getValue() === Cairo.Util.val(Dialogs.cell(row, KICH_IMPORTEORIGEN).getValue()) * Cairo.Util.val(getCotizacion().getValue());
            }
            else {
              Dialogs.cell(row, KICH_IMPORTEORIGEN).getValue() === 0;
            }
            break;

          case KICH_IMPORTE:

            break;

          case KI_CUE_ID_HABER:
            var monId = null;
            var cueId = null;
            var moneda = null;

            row = w_grid.getRows(lRow);

            cueId = Dialogs.cell(row, KI_CUE_ID_HABER).getID();
            GetMonedaFromCuenta(monId, moneda, cueId);

            var w_pCell = Dialogs.cell(row, KICH_MON_ID);
            w_pCell.setValue(moneda);
            w_pCell.setID(monId);

            if(monId === m_defaultCurrency || monId === 0) {
              Dialogs.cell(row, KICH_IMPORTEORIGEN).getValue() === 0;
            }

            cABMUtil.pCol(property.getGrid().getColumns(), KICH_CHEQUERA).getHelpFilter() === CT.CUE_ID+ "="+ cueId.toString();

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
            if(w_pCell.getID() !== NO_ID) {
              Dialogs.cell(row, KICH_CHEQUE).getValue() === GetChequeNumber(w_pCell.getID());
            }

            break;

          default:
            _rtn = true;
            return _rtn;
            break;
        }

        pShowTotales();
        _rtn = true;

        return _rtn;
      };

      var pValidateRowICheques = function(row, rowIndex) { // TODO: Use of ByRef founded Private Function pValidateRowICheques(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean

        var cell = null;
        var bOrigen = null;
        var monId = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case KI_CUE_ID_HABER:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2186, "", strRow)); // Debe indicar una cuenta origen (1)
              }

              break;

            case KI_CUE_ID_DEBE:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2187, "", strRow)); // Debe indicar una cuenta destino (1)
              }

              break;

            case mPublic.kICHT_BCO_ID:
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
              bOrigen = !valEmpty(Cairo.Util.val(cell.getValue()), Types.double);

              break;

            case KICH_IMPORTE:
              if(valEmpty(Cairo.Util.val(cell.getValue()), Types.double)) {
                return M.showInfoWithFalse(getText(1897, "", strRow)); // Debe indicar un importe (1)
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

        return P.resolvedPromise(true);
      };

      var pValidateRowTCheques = function(row, rowIndex) { // TODO: Use of ByRef founded Private Function pValidateRowTCheques(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean

        var cell = null;
        var bOrigen = null;
        var monId = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case KI_CUE_ID_HABER:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2186, "", strRow)); // Debe indicar una cuenta origen (1)
              }

              break;

            case KI_CUE_ID_DEBE:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2187, "", strRow)); // Debe indicar una cuenta destino (1)
              }

              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var pValidateRowCheques = function(row, rowIndex) { // TODO: Use of ByRef founded Private Function pValidateRowCheques(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean

        var cell = null;
        var bOrigen = null;
        var monId = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case KI_CUE_ID_HABER:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2186, "", strRow)); // Debe indicar una cuenta origen (1)
              }
              break;

            case KI_CUE_ID_DEBE:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2187, "", strRow)); // Debe indicar una cuenta destino (1)
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
              bOrigen = !valEmpty(Cairo.Util.val(cell.getValue()), Types.double);

              break;

            case KICH_IMPORTE:
              if(valEmpty(Cairo.Util.val(cell.getValue()), Types.double)) {
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

        if(!bOrigen && monId !== m_defaultCurrency) {
          return M.showInfoWithFalse(getText(2118, "", strRow)); // Debe indicar un importe para la moneda extranjera (1)
        }

        return P.resolvedPromise(true);
      };

      var isEmptyRowICheques = function(row, rowIndex) {

        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_CUE_ID_HABER:
            case mPublic.kICHT_MON_ID:
            case mPublic.kICHT_CLE_ID:
            case KI_CUE_ID_DEBE:
            case mPublic.kICHT_BCO_ID:
            case mPublic.kICHT_CLE_ID:

              if(!valEmpty(cell.getId(), Types.id)) {
                bRowIsEmpty = false;
                break;
              }

              break;

            case mPublic.kICHT_IMPORTE:
            case mPublic.kICHT_IMPORTEORIGEN:
              if(!valEmpty(Cairo.Util.val(cell.getValue()), Types.double)) {
                var bRowIsEmpty = true;
                break;
              }

              break;

            case mPublic.kICHT_DESCRIP:
            case mPublic.kICHT_CHEQUE:
              if(!valEmpty(cell.getValue(), Types.text)) {
                var bRowIsEmpty = true;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var isEmptyRowTCheques = function(row, rowIndex) {

        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_CUE_ID_HABER:
            case mPublic.kICHT_MON_ID:
            case mPublic.kICHT_CLE_ID:
              if(!valEmpty(cell.getId(), Types.id)) {
                bRowIsEmpty = false;
                break;
              }

              break;

            case mPublic.kICHT_IMPORTE:
            case mPublic.kICHT_IMPORTEORIGEN:
              if(!valEmpty(Cairo.Util.val(cell.getValue()), Types.double)) {
                var bRowIsEmpty = true;
                break;
              }

              break;

            case mPublic.kICHT_DESCRIP:
            case mPublic.kICHT_CHEQUE:
              if(!valEmpty(cell.getValue(), Types.text)) {
                var bRowIsEmpty = true;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var isEmptyRowCheques = function(row, rowIndex) {

        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_CUE_ID_HABER:
            case KICH_CHEQUERA:
            case KICH_MON_ID:
            case KICH_CLE_ID:
              if(!valEmpty(cell.getId(), Types.id)) {
                bRowIsEmpty = false;
                break;
              }

              break;

            case KICH_IMPORTE:
            case KICH_IMPORTEORIGEN:
              if(!valEmpty(Cairo.Util.val(cell.getValue()), Types.double)) {
                var bRowIsEmpty = true;
                break;
              }

              break;

            case KICH_DESCRIP:
            case KICH_CHEQUE:
              if(!valEmpty(cell.getValue(), Types.text)) {
                var bRowIsEmpty = true;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var getCotizacion = function() {
        return m_properties.item(CT.MF_COTIZACION);
      };

      var pIsMonDefault = function(cue_id) {
        var sqlstmt = null;
        var rs = null;

        sqlstmt = "select moneda.mon_id from cuenta, moneda where cuenta.mon_id = moneda.mon_id  and cue_id = "+ cue_id.toString()+ " and mon_legal <> 0";

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

        return !rs.isEOF();
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

      var C_MODULE = "cMovimientoFondoListDoc";

      var C_FECHAINI = "FechaIni";
      var C_FECHAFIN = "FechaFin";

      var C_IMG_TASK = 1;


      var K_FECHAINI = 1;
      var K_FECHAFIN = 2;
      var K_CLI_ID = 4;
      var K_EST_ID = 5;
      var K_CCOS_ID = 6;
      var K_SUC_ID = 7;
      var K_US_ID = 8;
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
      var m_usId_responsable = "";
      var m_usuario = "";
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
      var SAVE_ERROR = getText(2243, ""); // Error al grabar los párametros de navegación de Xxxx

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

        c = m_properties.add(null, CT.CLI_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CLIENTE);
        c.setName(getText(1150, "")); // Cliente
        c.setKey(K_CLI_ID);
        value = m_cliente;
        if(m_cliId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.CLIENTE, Cairo.Util.val(m_cliId.Substring(2)), bExists);
          if(!bExists) { m_cliId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_cliId));
        c.setSelectIntValue(m_cliId);

        c = m_properties.add(null, C.EST_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csEstado);
        c.setName(getText(1568, "")); // Estado
        c.setKey(K_EST_ID);
        value = m_estado;
        if(m_estId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csEstado, Cairo.Util.val(m_estId.Substring(2)), bExists);
          if(!bExists) { m_estId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_estId));
        c.setSelectIntValue(m_estId);

        c = m_properties.add(null, CT.CCOS_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CENTRO_COSTO);
        c.setName(getText(1057, "")); // Centro de Costos
        c.setKey(K_CCOS_ID);
        value = m_centroCosto;
        if(m_ccosId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.CENTRO_COSTO, Cairo.Util.val(m_ccosId.Substring(2)), bExists);
          if(!bExists) { m_ccosId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_ccosId));
        c.setSelectIntValue(m_ccosId);

        c = m_properties.add(null, CT.SUC_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.SUCURSAL);
        c.setName(getText(1281, "")); // Sucursal
        c.setKey(K_SUC_ID);
        value = m_sucursal;
        if(m_sucId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.SUCURSAL, Cairo.Util.val(m_sucId.Substring(2)), bExists);
          if(!bExists) { m_sucId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_sucId));
        c.setSelectIntValue(m_sucId);

        c = m_properties.add(null, Cairo.Constants.US_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csUsuario);
        c.setName(getText(1137, "")); // Usuario
        c.setKey(K_US_ID);
        value = m_usuario;
        if(m_usId_responsable.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csUsuario, Cairo.Util.val(m_usId_responsable.Substring(2)), bExists);
          if(!bExists) { m_usId_responsable = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_usId_responsable));
        c.setSelectIntValue(m_usId_responsable);

        c = m_properties.add(null, CT.DOC_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csETablasDocumento.CSDocumento);
        c.setName(getText(1611, "")); // Documentos
        c.setKey(K_DOC_ID);
        value = m_documento;
        if(m_docId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csETablasDocumento.CSDocumento, Cairo.Util.val(m_docId.Substring(2)), bExists);
          if(!bExists) { m_docId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_docId));
        c.setSelectIntValue(m_docId);
        c.setSelectFilter("'{emp_id=0}doct_id = "+ csEDocumentoTipo.cSEDT_MOVIMIENTOFONDO.toString()+ "'");


        c = m_properties.add(null, C.EMP_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.EMPRESA);
        c.setName(getText(1114, "")); // Empresa
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

        return DB.getData("load[" + m_apiPath + "general/movimientofondolistdoc]", id).then(
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
              m_usId_responsable = NO_ID;
              m_usuario = "";
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

          case K_CLI_ID:
            var property = m_properties.item(CT.CLI_ID);
            m_cliente = property.getValue();
            m_cliId = property.getSelectIntValue();

            break;

          case K_CCOS_ID:
            var property = m_properties.item(CT.CCOS_ID);
            m_centroCosto = property.getValue();
            m_ccosId = property.getSelectIntValue();

            break;

          case K_SUC_ID:
            var property = m_properties.item(CT.SUC_ID);
            m_sucursal = property.getValue();
            m_sucId = property.getSelectIntValue();

            break;

          case K_US_ID:
            var property = m_properties.item(Cairo.Constants.US_ID);
            m_usuario = property.getValue();
            m_usId_responsable = property.getSelectIntValue();

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
          cpgId: m_cpgId,
          empId: m_empId
        };

        return DB.getData("load[" + m_apiPath + "compras/facturacompras]", null, params);
      };
      var cIABMListDocClient_Refresh = function() {
        var sqlstmt = null;

        sqlstmt = "sp_lsdoc_MovimientoFondos ";

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
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_usId_responsable)+ ",";
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

        strError = getText(2243, "");
        //Error al grabar los párametros de navegación de Movimiento de Fondos

        var register = null;
        var register = new DB.Register();

        var sqlstmt = null;

        sqlstmt = "delete ListaDocumentoParametro  where pre_id = "+ CS.LIST_MOVIMIENTOFONDO.toString()+ " and us_id = "+ m_usId+ " and (emp_id is null or emp_id = "+ cUtil.getEmpId().toString()+ ")";

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

            case K_CLI_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 40, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_CLI_ID, Types.integer);
              break;

            case K_EST_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 50, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_EST_ID, Types.integer);
              break;

            case K_CCOS_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 60, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_CCOS_ID, Types.integer);
              break;

            case K_SUC_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 70, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_SUC_ID, Types.integer);
              break;

            case K_US_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 80, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_US_ID, Types.integer);
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

          fields.add(Cairo.Constants.US_ID, m_usId, Types.id);
          fields.add(C.PRE_ID, CS.LIST_MOVIMIENTOFONDO, Types.id);



          if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, strError)) { return false; }
        }

        if(!load(m_usId)) { return false; }

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


      var createMenu = function() {


        if(m_menuLoaded) { return; }

        m_menuLoaded = true;

        m_objList.ObjClientMenu = self;
        m_objList.addMenu("-");
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

      var getCliId = function() {


        var mfId = null;
        var cliId = null;

        mfId = m_dialog.getId();
        DB.getData(CT.MOVIMIENTOFONDO, CT.MF_ID, mfId, CT.CLI_ID, cliId);

        return cliId;
      };

      var getMfIds = function() {
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

          // Movimiento de Fondos
          m_title = getText(2185, "");

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