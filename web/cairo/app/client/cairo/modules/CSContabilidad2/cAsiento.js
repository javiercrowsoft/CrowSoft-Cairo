(function() {
  "use strict";

  Cairo.module("Asiento.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var showDocAux = function(asId) {
      var D = Cairo.Documents;
      var M = Cairo.Modal;
      var NO_ID = Cairo.Constants.NO_ID;

      if(asId !== NO_ID) {

        D.getDocCliente(D.Types.ASIENTO_CONTABLE, asId).whenSuccessWithResult(function(response) {

          if(response.id === NO_ID) {
            M.showInfo(getText(1693, "")); // Este comprobante no tiene un documento de stock asociado.
          }

          var objEditName = "";

          switch (response.doctId) {
            case 1:
            case 7:
            case 9:
              objEditName = "FacturaVenta";
              break;

            case 2:
            case 8:
            case 9:
              objEditName = "FacturaCompra";
              break;

            case 13:
              objEditName = "Cobranza";
              break;

            case 16:
              objEditName = "OrdenPago";
              break;

            case 26:
              objEditName = "MovimientoFondo";
              break;

            case 32:
              objEditName = "DepositoCupon";
              break;

            case 17:
              objEditName = "DepositoBanco";
              break;

            case 33:
              objEditName = "ResolucionCupon";
              break;
          }

          if(objEditName === "") {
            // No hay un documento asociado al doct_id #{ response.doctId }
            // ;;Comuniquese con soporte de CrowSoft para obtener asistencia técnica.
            M.showWarning(getText(1956, "", response.doctId));
            return;
          }
          else {
            D.showDocAux(response.id, objEditName);
          }
        });
      }
    };

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var TITLE = getText(1955, ""); // Asientos Contables
      var SAVE_ERROR_MESSAGE = getText(1907, ""); // Error al grabar el Asiento Contable

      var P = Cairo.Promises;
      var NO_ID = Cairo.Constants.NO_ID;
      var DB = Cairo.Database;
      var Dialogs = Cairo.Dialogs;
      var C = Cairo.General.Constants;
      var CC = Cairo.Contabilidad.Constants;
      var CS = Cairo.Security.Actions.Contabilidad;
      var Types = Cairo.Constants.Types;
      var valField = DB.valField;
      var getValue = DB.getValue;
      var valEmpty = Cairo.Util.valEmpty;
      var call = P.call;
      var D = Cairo.Documents;
      var getProperty = D.getProperty;
      var getGrid = D.getGrid;
      var getCell = Dialogs.cell;
      var cellFloat = Dialogs.cellFloat;
      var val = Cairo.Util.val;
      var M = Cairo.Modal;
      var T = Dialogs.PropertyType;

      var C_MODULE = "cAsiento";

      var C_ITEMS = "ITEMS";
      var C_ORIGEN = "ORIGEN";

      var C_ASTOTALDEBE = "as_totaldebe";
      var C_ASTOTALHABER = "as_totalhaber";

      var K_NUMERO = 1;
      var K_NRODOC = 2;
      var K_DESCRIP = 3;
      var K_FECHA = 4;
      var K_DOC_ID = 11;
      var K_ITEMS = 15;
      var K_TOTAL_DEBE = 20;
      var K_TOTAL_HABER = 21;

      var K_ID_CLIENTE = 22;

      var KI_ASI_ID = 2;
      var KI_DESCRIP = 6;
      var KI_HABER = 20;
      var KI_DEBE = 21;
      var KI_CCOS_ID = 22;
      var KI_CUE_ID = 23;
      var KI_ORIGEN = 24;

      var m_id = 0;
      var m_numero = 0;
      var m_nrodoc = "";
      var m_descrip = "";
      var m_fecha = null;
      var m_docId = 0;
      var m_documento = "";
      var m_doctId = 0;
      var m_totalDebe = 0;
      var m_totalHaber = 0;

      var m_idCliente = 0;
      var m_doctIdCliente = 0;

      var m_doc_cliente = "";

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

      var m_isNew;

      var m_itemsDeleted = "";

      var m_copy;

      var m_taPropuesto;
      var m_taMascara = "";

      var m_docEditable;
      var m_docEditMsg = "";

      var m_apiPath = DB.getAPIVersion();

      var m_defaultCurrency = D.getDefaultCurrency();

      var emptyData = {
        items: []
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
          CS.NEW_ASIENTO,
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

        D.setDocNumber(m_lastDocId, m_dialog, CC.AS_NRODOC).then(
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

          doc.setClientTable(CC.ASIENTO);
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

            p = false;
            break;

          case Dialogs.Message.MSG_GRID_ROW_DELETED:

            updateTotals();
            break;

          case Dialogs.Message.MSG_DOC_EDIT_STATE:

            D.showEditStatus(m_docEditMsg, TITLE);
            break;

          case Dialogs.Message.MSG_DOC_DELETE:

            p = self.deleteDocument(m_id).whenSuccess(function() {
              return move(Dialogs.Message.MSG_DOC_NEXT);
            });
            break;

          case Dialogs.Message.MSG_DOC_INVALIDATE:

            p = false;
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

            D.search(D.Types.ASIENTO_CONTABLE, self, Cairo.bool(info));
            break;

          case Dialogs.Message.MSG_DOC_DOC_AUX:

            showDocAux(m_id);
            break;

          case Dialogs.Message.MSG_DOC_HISTORY:

            if(m_id !== NO_ID) {
              p = Cairo.History.show(Cairo.Tables.ASIENTOS_CONTABLES, m_id, m_documento + " " + m_nrodoc);
            }
            else {
              p = M.showInfo(getText(1552, "")); // El documento aun no ha sido guardado
            }
            break;

          case Dialogs.Message.MSG_GRID_VIRTUAL_ROW:

            p = P.resolvedPromise(info);
            break;
        }

        return p || P.resolvedPromise();
      };

      self.discardChanges = function() {
        Cairo.raiseError("Asiento", "DiscardChanges was called");
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

                  return D.setDocNumber(m_lastDocId, m_dialog, CC.AS_NRODOC)
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
        }

        return p || P.resolvedPromise();
      };

      self.save = function() {
        var p;

        p = D.docCanBeEdited(m_docEditable, m_docEditMsg)
          .whenSuccess(function() {
            return D.docCanBeSaved(m_dialog, CC.AS_FECHA);
          })
          .whenSuccess(function() {
            if(getItems().getGrid().getRows().count() < 2) {
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

            register.setFieldId(CC.AS_ID);
            register.setTable(CC.ASIENTO);

            register.setPath(m_apiPath + "contabilidad/asiento");

            if(m_copy) {
              register.setId(Cairo.Constants.NEW_ID);
            }
            else {
              register.setId(m_id);
            }

            var _count = m_properties.size();
            for(var _i = 0; _i < _count; _i++) {

              var property = m_properties.item(_i);

              switch (property.getKey()) {

                case K_NUMERO:
                  fields.add(CC.AS_NUMERO, property.getValue(), Types.long);
                  break;

                case K_NRODOC:
                  fields.add(CC.AS_NRODOC, property.getValue(), Types.text);
                  break;

                case K_DESCRIP:
                  fields.add(CC.AS_DESCRIP, property.getValue(), Types.text);
                  break;

                case K_FECHA:
                  fields.add(CC.AS_FECHA, property.getValue(), Types.date);
                  break;

                case K_DOC_ID:
                  fields.add(C.DOC_ID, property.getSelectId(), Types.id);
                  break;

                case K_NUMERO:
                  fields.add(CC.AS_NUMERO, property.getValue(), Types.long);
                  break;
              }
            }
            
            saveItems(register);
            
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
        return "#contabilidad/asiento/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "asiento" + id;
      };

      self.getTitle = function() {
        return TITLE + (m_id !== NO_ID ? " " + m_nrodoc : "");
      };

      self.getTabTitle = function() {
        return "AS-" + m_numero;
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
          }
        }

        if(m_totalDebe !== m_totalHaber) {
          return M.showInfoWithFalse(getText(1957, "")); // El debe y el haber deben coincidir para que el asiento balancee
        }

        return P.resolvedPromise(true);
      };

      self.isEmptyRow = function(key, row, rowIndex) {
        var isEmpty = true;

        try {

          switch (key) {
            case K_ITEMS:
              isEmpty = isEmptyRow(row, rowIndex);
              break;
          }

        }
        catch(ex) {
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

        var p = DB.getData("load[" + m_apiPath + "contabilidad/asiento/info]", id)
          .whenSuccessWithResult(loadData, false);

        return p;
      };

      self.getDialog = function() {
        return m_dialog;
      };

      self.list = function() {
        return Cairo.Security.hasPermissionTo(CS.LIST_ASIENTO);
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
            CS.LIST_ASIENTO,
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
          
          var cellDebe, cellHaber, row;

          switch (key) {
            
            case K_ITEMS:

              var property = m_itemsProps.item(C_ITEMS);
              var grid = property.getGrid();

              switch (grid.getColumns().item(lCol).getKey()) {
                
                case KI_DEBE:
                  row = grid.getRows().get(lRow);
                  cellDebe = getCell(row, KI_DEBE);
                  cellHaber = getCell(row, KI_HABER);
                  if(Cairo.Util.val(cellDebe.getValue()) < 0) { cellDebe.setValue(0); }
                  if(Cairo.Util.val(cellDebe.getValue()) > 0) { cellHaber.setValue(0); }
                  break;

                case KI_HABER:
                  row = grid.getRows().get(lRow);
                  cellDebe = getCell(row, KI_DEBE);
                  cellHaber = getCell(row, KI_HABER);
                  if(Cairo.Util.val(cellHaber.getValue()) < 0) { cellHaber.setValue(0); }
                  if(Cairo.Util.val(cellHaber.getValue()) > 0) { cellDebe.setValue(0); }
                  break;
              }

              updateTotals();
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnAfterUpdate", C_MODULE, "");
        }

        return P.resolvedPromise(true);
      };

      self.columnClick = function(key, lRow, lCol) {

      };

      self.gridDblClick = function(key, lRow, lCol) {
        return P.resolvedPromise(false);
      };

      self.columnAfterEdit = function(key, lRow, lCol, newValue, newValueId) {
        var p = null;

        try {

          switch (key) {

            case K_ITEMS:
              var property = getProperty(m_items, C_ITEMS);
              p = columnAfterEdit(property, lRow, lCol, newValue, newValueId);
              break;
          }

        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnAfterEdit", C_MODULE, "");
        }

        return p || P.resolvedPromise(true);
      };

      self.columnBeforeEdit = function(key, lRow, lCol, iKeyAscii) {
        var rtn = false;

        try {

          switch (key) {

            case K_ITEMS:
              rtn = true;
              break;
          }

        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnBeforeEdit", C_MODULE, "");
        }

        return P.resolvedPromise(rtn);
      };

      var columnAfterEdit = function(property, lRow, lCol, newValue, newValueId) {

        var p = null;
        var grid = property.getGrid();
        var columnKey = grid.getColumns().item(lCol).getKey();

        switch (columnKey) {

          case KI_CUE_ID:
            var cueId = newValueId;

            if(cueId !== NO_ID) {

              p = isMonDefault(cueId).then(function(isDefault) {
                if(!isDefault) {
                  grid.getColumns().item(C_ORIGEN).setVisible(true);
                  m_dialog.refreshColumnProperties(property, C_ORIGEN);
                }
                return true;
              });
            }
            break;
        }

        return p || P.resolvedPromise(true);
      };

      self.columnButtonClick = function(key, lRow, lCol, iKeyAscii) {
        return P.resolvedPromise(false);
      };

      self.deleteRow = function(key, row, lRow) {

        switch (key) {

          case K_ITEMS:

            var id = cellFloat(row, KI_ASI_ID);
            if(id !== NO_ID) { m_itemsDeleted = m_itemsDeleted+ id.toString()+ ","; }
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

            case K_ITEMS:
              p = validateRow(row, rowIndex);
              break;
          }

        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "validateRow", C_MODULE, "");
        }

        return p || P.resolvedPromise(false);
      };

      var isEmptyRow = function(row, rowIndex) {

        var rowIsEmpty = true;

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KI_CUE_ID:
              if(!valEmpty(cell.getId(), Types.id)) {
                rowIsEmpty = false;
                break;
              }
              break;

            case KI_DEBE:
            case KI_HABER:
            case KI_ORIGEN:
              if(!valEmpty(cell.getValue(), Types.currency)) {
                rowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return rowIsEmpty;
      };

      var validateRow = function(row, rowIndex) {
        var p = null;
        var bDebe = false;
        var bHaber = false;
        var cue_id = 0;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KI_DEBE:
              if(!valEmpty(cell.getValue(), Types.currency)) {
                bDebe = true;
              }
              break;

            case KI_HABER:
              if(!valEmpty(cell.getValue(), Types.currency)) {
                bHaber = true;
              }
              break;

            case KI_CUE_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(1388, "", strRow)); // Debe indicar una cuenta (1)
              }
              cue_id = cell.getId();
              break;

            case KI_ORIGEN:
              if(m_itemsProps.item(C_ITEMS).getGrid().getColumns().item(C_ORIGEN).getVisible()) {

                if(!isMonDefault(cue_id)) {

                  if(valEmpty(cell.getValue(), Types.currency)) {
                    return M.showInfoWithFalse(getText(1958, "", strRow)); // Debe indicar el importe en la moneda de la cuenta (1)
                  }
                }
              }
              break;
          }
        }

        if(bDebe && bHaber) {
          return M.showInfoWithFalse(getText(1959, "", strRow)); // Debe indicar un importe en el Debe o en el Haber, no en ambas columnas (1)
        }

        return p || P.resolvedPromise(true);
      };

      var loadCollection = function() {

        var validateDocDefault = false;
        var elem;

        var properties = m_properties;
        m_properties.clear();

        var tabs = m_dialog.getTabs();
        tabs.clear();

        m_dialog.setNoButtons1(Dialogs.Buttons.BUTTON_INVALIDATE + Dialogs.Buttons.BUTTON_DOC_APLIC);
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
          elem.setSelectId(Cairo.UserConfig.getDocAsId());
          elem.setValue(Cairo.UserConfig.getDocAsNombre());

          validateDocDefault = elem.getSelectId() !== NO_ID;
        }

        elem.setSelectFilter(D.ASIENTOS_DOC_FILTER);

        elem = properties.add(null, Cairo.Constants.NUMBER_ID);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.integer);
        elem.setName(getText(1065, "")); // Número
        elem.setKey(K_NUMERO);
        elem.setValue(m_numero);
        elem.setEnabled(false);

        elem = properties.add(null, CC.AS_FECHA);
        elem.setType(T.date);
        elem.setName(getText(1569, "")); // Fecha
        elem.setKey(K_FECHA);
        elem.setValue(m_fecha);

        elem = properties.add(null, CC.AS_NRODOC);
        elem.setType(T.text);
        elem.setName(getText(1065, "")); // Número
        elem.setSize(50);
        elem.setKey(K_NRODOC);
        elem.setValue(m_nrodoc);
        elem.setTextMask(m_taMascara);
        elem.setTextAlign(Dialogs.TextAlign.right);

        elem = properties.add(null, CC.AS_DOC_CLIENTE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(getText(1960, "")); // Generado Por
        elem.setKey(K_ID_CLIENTE);
        elem.setValue(m_doc_cliente);
        elem.setEnabled(false);

        elem = properties.add(null, CC.AS_DESCRIP);
        elem.setType(T.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setName(getText(1211, "")); // Observ.
        elem.setSize(5000);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);

        if(!m_dialog.show(self)) { return false; }

        /////////////////////////////////////////////////////////////////////
        // ITEMS
        /////////////////////////////////////////////////////////////////////

        var tabs = m_items.getTabs();
        tabs.clear();

        var tab = tabs.add(null);
        tab.setIndex(0);
        tab.setName(getText(1371, "")); // Items

        properties = m_itemsProps;
        properties.clear();

        elem = properties.add(null, C_ITEMS);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridItems(elem);
        loadItems(elem);
        elem.setName(C_ITEMS);
        elem.setKey(K_ITEMS);
        elem.setTabIndex(0);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_itemsDeleted = "";

        if(!m_items.show(self)) { return false; }

        /////////////////////////////////////////////////////////////////////
        // FOOTER
        /////////////////////////////////////////////////////////////////////

        properties = m_footerProps;
        properties.clear();

        var elem = properties.add(null, C_ASTOTALDEBE);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1961, "")); // Total Debe
        elem.setKey(K_TOTAL_DEBE);
        elem.setValue(m_totalDebe);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        var elem = properties.add(null, C_ASTOTALHABER);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1962, "")); // Total Haber
        elem.setKey(K_TOTAL_HABER);
        elem.setValue(m_totalHaber);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        setEnabled();

        if(!m_footer.show(self)) { return false; }

        if(validateDocDefault) {
          self.propertyChange(K_DOC_ID);
        }

        return true;
      };

      var setGridItems = function(property) {
        
        var elem;
        var grid = property.getGrid();

        var columns = grid.getColumns();
        columns.clear();

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_ASI_ID);

        elem = columns.add(null);
        elem.setName(getText(1267, "")); // Cuenta
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setKey(KI_CUE_ID);
        elem.setSelectFilter(D.selectFilterForCuenta);

        elem = columns.add(null);
        elem.setName(getText(1904, "")); // Debe
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_DEBE);

        elem = columns.add(null);
        elem.setName(getText(1905, "")); // Haber
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_HABER);

        elem = columns.add(null, C_ORIGEN);
        elem.setName(getText(1963, "")); // Moneda Origen
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setVisible(false);
        elem.setKey(KI_ORIGEN);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setKey(KI_DESCRIP);

        elem = columns.add(null);
        elem.setName(getText(1057, "")); // Centro de Costo
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTROS_DE_COSTO);
        elem.setKey(KI_CCOS_ID);

        grid.getRows().clear();
      };

      var loadItems = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();

        for(var _i = 0; _i < m_data.items.length; _i += 1) {

          var row = rows.add(null, getValue(m_data.items[_i], CC.ASI_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CC.ASI_ID));
          elem.setKey(KI_ASI_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], C.CUE_NAME));
          elem.setId(getValue(m_data.items[_i], C.CUE_ID));
          elem.setKey(KI_CUE_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CC.ASI_DEBE));
          elem.setKey(KI_DEBE);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CC.ASI_HABER));
          elem.setKey(KI_HABER);

          var origen = getValue(m_data.items[_i], CC.ASI_ORIGEN);
          elem = row.add(null);
          elem.setValue(origen);
          elem.setKey(KI_ORIGEN);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CC.ASI_DESCRIP));
          elem.setKey(KI_DESCRIP);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], C.CCOS_NAME));
          elem.setId(getValue(m_data.items[_i], C.CCOS_ID));
          elem.setKey(KI_CCOS_ID);

          m_totalDebe = m_totalDebe + getValue(m_data.items[_i], CC.ASI_DEBE);
          m_totalHaber = m_totalHaber + getValue(m_data.items[_i], CC.ASI_HABER);

          if(origen !== 0) { 
            grid.getColumns().get(C_ORIGEN).setVisible(true); 
          }
        }
      };

      var loadDataFromResponse = function(response) {
        var data = response.data;

        data.items = data.get('items');

        return data;
      };

      var load = function(id) {

        return DB.getData("load[" + m_apiPath + "contabilidad/asiento]", id).then(
          function(response) {

            var p = null;

            if(response.success !== true) { return false; }

            if(response.data.id !== NO_ID) {

              m_data = loadDataFromResponse(response);

              var data = response.data;

              m_id = valField(data, CC.AS_ID);
              m_numero = valField(data, CC.AS_NUMERO);
              m_nrodoc = valField(data, CC.AS_NRODOC);
              m_descrip = valField(data, CC.AS_DESCRIP);
              m_fecha = valField(data, CC.AS_FECHA);
              m_docId = valField(data, C.DOC_ID);
              m_documento = valField(data, C.DOC_NAME);
              m_doctId = valField(data, C.DOCT_ID);

              m_idCliente = valField(data, C.ID_CLIENTE);
              m_doctIdCliente = valField(data, C.DOCT_ID_CLIENTE);

              m_doc_cliente = valField(data, C.DOC_CLIENTE);

              m_taMascara = valField(data, C.TA_MASCARA);
              m_taPropuesto = valField(data, C.TA_PROPUESTO);

              m_docEditable = valField(data, C.DOC_EDITABLE);
              m_docEditMsg = valField(data, C.DOC_EDIT_MSG);

              m_lastDocId = m_docId;
              m_lastDocName = m_documento;

            }
            else {
              m_id = NO_ID;
              m_numero = 0;
              m_nrodoc = "";
              m_descrip = "";
              m_fecha = Cairo.Dates.today();
              m_doctId = NO_ID;

              m_docId = m_lastDocId;
              m_documento = m_lastDocName;

              m_idCliente = NO_ID;
              m_doctIdCliente = NO_ID;

              m_doc_cliente = "";

              m_taPropuesto = false;
              m_taMascara = "";

              m_data = emptyData;

              p = p || P.resolvedPromise();

              p = p
                .then(P.call(D.editableStatus, m_docId, CS.NEW_ASIENTO))
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

      var saveItems = function(mainRegister) {

        var transaction = DB.createTransaction();
        var orden = 0;

        transaction.setTable(CC.ASIENTO_ITEM_TMP);

        var rows = getGrid(m_items, C_ITEMS).getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();
          register.setFieldId(CC.ASI_TMP_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var fields = register.getFields();

          var _countj = row.size();
          for(var _j = 0; _j < _countj; _j++) {

            var cell = row.item(_j);
            switch (cell.getKey()) {

              case KI_ASI_ID:
                if(m_copy) {
                  fields.add(CC.ASI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(CC.ASI_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KI_DESCRIP:
                fields.add(CC.ASI_DESCRIP, cell.getValue(), Types.text);
                break;

              case KI_DEBE:
                fields.add(CC.ASI_DEBE, val(cell.getValue()), Types.currency);
                break;

              case KI_HABER:
                fields.add(CC.ASI_HABER, val(cell.getValue()), Types.currency);
                break;

              case KI_ORIGEN:
                fields.add(CC.ASI_ORIGEN, val(cell.getValue()), Types.currency);
                break;

              case KI_CCOS_ID:
                fields.add(C.CCOS_ID, cell.getId(), Types.id);
                break;

              case KI_CUE_ID:
                fields.add(C.CUE_ID, cell.getId(), Types.id);
                break;
            }
          }

          orden = orden + 1;
          fields.add(CC.ASI_ORDEN, orden, Types.integer);

          transaction.addRegister(register);
        }

        if(m_itemsDeleted !== "" && m_id !== NO_ID && !m_copy) {

          transaction.setDeletedList(m_itemsDeleted);
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var updateTotals = function() {
        var debe = 0;
        var haber = 0;
        var rows = getGrid(m_items, C_ITEMS).getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {
          var row = rows.item(_i);
          debe = debe + Cairo.Util.val(getCell(row, KI_DEBE).getValue());
          haber = haber + Cairo.Util.val(getCell(row, KI_HABER).getValue());
        }

        m_footer.getProperties().item(C_ASTOTALDEBE).setValue(debe);
        m_footer.getProperties().item(C_ASTOTALHABER).setValue(haber);

        m_footer.refreshControls();
      };

      var setEnabled = function() {
        var bState = false;
        var prop = null;

        if(m_docEditable) {
          bState = getDocId().getSelectId() !== NO_ID;
        }
        else {
          bState = false;
        }

        var _count = m_properties.size();
        for(var _i = 0; _i < _count; _i++) {
          prop = m_properties.item(_i);
          if(prop.getKey() !== K_DOC_ID
            && prop.getKey() !== K_NUMERO
            && prop.getKey() !== K_ID_CLIENTE) {

            if(bState) {
              if(prop.getKey() !== K_NRODOC) {
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
          prop = m_itemsProps.item(_i);
          prop.setEnabled(bState);
        }

        m_items.refreshEnabledState(m_itemsProps);
        m_dialog.refreshEnabledState(m_properties);

      };

      var getDocId = function() {
        return m_properties.item(C.DOC_ID);
      };

      var move = function(moveTo) {
        var docId = getDocId().getSelectId();

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
              .whenSuccess(call(D.setDocNumber, m_docId, m_dialog, CC.AS_NRODOC))
              .then(function(enabled) { m_taPropuesto = enabled; })
              .then(refreshProperties);
          }
          else {
            return load(response.id)
              .whenSuccess(refreshProperties);
          }
        }
        return D.move(m_docId, moveTo)
          .whenSuccessWithResult(completeMove);
      };
      
      var refreshProperties = function() {

        m_properties.item(C.DOC_ID)
        .setSelectId(m_docId)
        .setValue(m_documento);

        m_properties.item(CC.AS_FECHA)
        .setValue(m_fecha);

        m_properties.item(Cairo.Constants.NUMBER_ID)
        .setValue(m_numero);

        m_properties.item(CC.AS_NRODOC)
        .setValue(m_nrodoc)
        .setTextMask(m_taMascara)
        .setTextAlign(Dialogs.TextAlign.right);

        m_properties.item(CC.AS_DOC_CLIENTE)
        .setValue(m_doc_cliente);

        m_properties.item(CC.AS_DESCRIP)
        .setValue(m_descrip);

        m_dialog.showValues(m_dialog.getProperties());
        m_dialog.resetChanged();

        m_dialog.refreshColumnProperties(m_itemsProps.item(C_ITEMS), C_ORIGEN);

        m_itemsDeleted = "";

        m_items.showValues(m_itemsProps);

        var properties = m_footerProps;

        properties.item(C_ASTOTALDEBE)
        .setValue(m_totalDebe);

        properties.item(C_ASTOTALHABER)
        .setValue(m_totalHaber);

        m_footer.showValues(m_footerProps);

        setEnabled();
      };

      var isMonDefault = function(cueId) {
        return D.getCuentaInfo(cueId).then(function(info) {
          if(info.success) {
            return info.monId === m_defaultCurrency.id;
          }
          else {
            return false;
          }
        });
      };

      self.destroy = function() {
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

      var getItems = function() {
        return m_itemsProps.item(C_ITEMS);
      };

      self.getObjectType = function() {
        return "cairo.modules.contabilidad.asiento";
      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

    Edit.Controller.edit = function(id) {

      Cairo.LoadingMessage.show("Factura de Compras", "Loading Asientos from Crowsoft Cairo server.");
      var editor = Cairo.Asiento.Edit.Controller.getEditor();

      var dialog = Cairo.Dialogs.Views.Controller.newDialog();
      var dialogItems = Cairo.Dialogs.Views.Controller.newDialog();
      var dialogFooter = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.setItems(dialogItems);
      editor.setFooter(dialogFooter);
      editor.edit(id).then(Cairo.LoadingMessage.close);
    };

  });

  Cairo.module("AsientoListDoc.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;
      var P = Cairo.Promises;
      var NO_ID = Cairo.Constants.NO_ID;
      var DB = Cairo.Database;
      var D = Cairo.Documents;
      var C = Cairo.General.Constants;
      var CC = Cairo.Contabilidad.Constants;
      var Types = Cairo.Constants.Types;
      var Dialogs = Cairo.Dialogs;
      var T = Dialogs.PropertyType;
      var val = Cairo.Util.val;
      var isDate = Cairo.Util.isDate;
      var getDateValue = Cairo.Util.getDateValue;
      var today = Cairo.Dates.today;
      var valField = DB.valField;

      var C_MODULE = "cAsientoListDoc";

      var C_FECHAINI = "FechaIni";
      var C_FECHAFIN = "FechaFin";

      var K_FECHAINI = 1;
      var K_FECHAFIN = 2;
      var K_DOC_ID = 9;
      var K_EMP_ID = 100;

      var m_fechaIni = null;
      var m_fechaFin = null;
      var m_docId = "";
      var m_documento = "";

      var m_empId = "";
      var m_empresa = "";
      var m_fechaIniV = "";
      var m_fechaFinV = "";

      var m_dialog;
      var m_properties;

      var m_listController;

      var m_title = "";

      var m_menuLoaded;

      var m_menuShowMensajes = 0;
      var m_menuAddNote = 0;
      var m_menuShowDocAux = 0;
      var m_menuFirmar = 0;

      var m_apiPath = DB.getAPIVersion();
      var SAVE_ERROR = getText(2295, ""); // Error al grabar los parámetros de navegación de Asientos Contables

      self.list = function() {
        initialize();
        return load()
          .whenSuccess(loadCollection);
      };

      self.edit = function(asId) {
        m_listController.edit(asId);
      };

      self.deleteItem = function(asId) {
        return m_listController.destroy(asId);
      };

      self.showDocDigital = function() {
        var _rtn = null;

        try {

          var asId = m_dialog.getId();
          if(asId === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(CC.ASIENTO_CONTABLE);
          doc.setClientTableID(asId);

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

        c = m_properties.add(null, C.DOC_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.DOCUMENTO);
        c.setName(getText(1567, "")); // Documentos
        c.setKey(K_DOC_ID);
        c.setValue(m_documento);
        c.setSelectId(val(m_docId));
        c.setSelectIntValue(m_docId);
        c.setSelectFilter(D.ASIENTOS_LIST_DOC_FILTER);

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

        return DB.getData("load[" + m_apiPath + "contabilidad/asientos/parameters]").then(
          function(response) {

            m_empId = Cairo.Company.getId();
            m_empresa = Cairo.Company.getName();

            if(response.success !== true) { return false; }

            if(response.data.id === NO_ID) {

              m_fechaIniV = "";
              m_fechaIni = Cairo.Dates.today();
              m_fechaFinV = "";
              m_fechaFin = Cairo.Dates.DateNames.getDateByName('h-60');
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

              m_docId = valField(response.data, C.DOC_ID);
              m_empId = valField(response.data, C.EMP_ID);

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

          case K_DOC_ID:
            property = properties.item(C.DOC_ID);
            m_documento = property.getValue();
            m_docId = property.getSelectIntValue();
            break;

          case K_EMP_ID:
            property = properties.item(C.EMP_ID);
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
          docId: m_docId,
          empId: m_empId
        };

        return DB.getData("load[" + m_apiPath + "contabilidad/asientos]", null, params);
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.LDP_ID);
        register.setTable(C.LISTA_DOCUMENTO_PARAMETRO);

        var m_apiPath = DB.getAPIVersion();
        register.setPath(m_apiPath + "contabilidad/asientos");

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

      self.getPath = function() {
        return "#contabilidad/asientos";
      };

      self.getEditorName = function() {
        return "asientos";
      };

      self.getTitle = function() {
        return m_title;
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

        m_menuFirmar = m_dialog.addMenu(getText(1594, "")); // Firmar
        m_dialog.addMenu("-");

        m_menuAddNote = m_dialog.addMenu(getText(1615, "")); // Agregar Nota
        m_menuShowMensajes = m_dialog.addMenu(getText(1616, "")); // Ver Notas
        m_dialog.addMenu("-");

        m_menuShowDocAux = m_dialog.addMenu(getText(1691, "")); // Ver Documento Asociado
      };

      var showNotes = function() {
        var asId = m_dialog.getId();
        return DB.getData("load[" + m_apiPath + "contabilidad/asiento/notes]", asId)
          .whenSuccessWithResult(D.showNotes);
      };

      var addNote = function() {
        var asId = m_dialog.getId();
        return D.addNote(D.Types.ASIENTO, asId, false);
      };

      var initialize = function() {
        try {
          m_title = getText(2296, ""); // Asientos Contables
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

      self.validate = function() {
        return P.resolvedPromise(true);
      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("Asiento.List", function(List, Cairo, Backbone, Marionette, $, _) {

    var NO_ID = Cairo.Constants.NO_ID;
    var CS = Cairo.Security.Actions.Contabilidad;
    var DB = Cairo.Database;
    var C_MODULE = "cAsiento";
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

          var editors = Cairo.Editors.asientoEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.asientoEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Asiento",
            entityName: "asiento",
            entitiesName: "asientos"
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
              Cairo.LoadingMessage.show("Asiento", "Loading Asientos from Crowsoft Cairo server.");

              var editor = Cairo.Asiento.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(CS.DELETE_ASIENTO)) {
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
              DB.getAPIVersion() + "contabilidad/asiento", id,
              Cairo.Constants.DELETE_FUNCTION, C_MODULE).whenSuccess(closeDialog, false);
          };

          // progress message
          //
          Cairo.LoadingMessage.show("Asiento", "Loading Asientos from Crowsoft Cairo server.");

          self.documentList = Cairo.AsientoListDoc.Edit.Controller.getEditor();
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