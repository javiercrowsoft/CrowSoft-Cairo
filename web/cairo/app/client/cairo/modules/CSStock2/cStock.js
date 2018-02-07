(function() {
  "use strict";

  var showDocAux = function(stId) {
    var D = Cairo.Documents;
    var M = Cairo.Modal;
    var NO_ID = Cairo.Constants.NO_ID;
    var getText = Cairo.Language.getText;

    if(stId !== NO_ID) {

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

          case 3:
          case 24:
            objEditName = "RemitoVenta";
            break;

          case 4:
          case 25:
            objEditName = "RemitoCompra";
            break;

          case 28:
            objEditName = "RecuentoStock";
            break;

          case 29:
            objEditName = "ImportacionTemporal";
            break;

          case 30:
          case 34:
            objEditName = "ParteProdKit";
            break;

          case 0:
            return;
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

  Cairo.module("Stock.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var TITLE = getText(1298, ""); // Stock
      var SAVE_ERROR_MESSAGE = getText(2017, ""); // Error al grabar la transferencia de stock

      var P = Cairo.Promises;
      var NO_ID = Cairo.Constants.NO_ID;
      var DB = Cairo.Database;
      var Dialogs = Cairo.Dialogs;
      var C = Cairo.General.Constants;
      var CST = Cairo.Stock.Constants;
      var CS = Cairo.Security.Actions.Stock;
      var Types = Cairo.Constants.Types;
      var valField = DB.valField;
      var getValue = DB.getValue;
      var valEmpty = Cairo.Util.valEmpty;
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

      var C_MODULE = "cStock";

      var C_ITEMS = "ITEMS";

      var K_NUMERO = 1;
      var K_NRODOC = 2;
      var K_DESCRIP = 3;
      var K_FECHA = 4;
      var K_DOC_ID = 5;
      var K_ITEMS = 15;
      var K_LGJ_ID = 18;
      var K_SUC_ID = 19;
      var K_DEPL_ID_ORIGEN = 20;
      var K_DEPL_ID_DESTINO = 21;

      var K_ID_CLIENTE = 22;

      var KI_STI_ID = 2;
      var KI_CANTIDAD = 4;
      var KI_UNIDAD = 5;
      var KI_DESCRIP = 6;
      var KI_DEPL_ID = 7;
      var KI_PR_ID = 13;

      var KI_PR_LLEVA_NRO_SERIE = 14;
      var KI_ES_KIT = 15;
      var KI_NRO_SERIE = 16;
      var KI_GRUPO = 17;

      var KI_STL_ID = 26;
      var KI_PR_LLEVA_LOTE = 27;

      var m_id = 0;
      var m_numero = 0;
      var m_nrodoc = "";
      var m_descrip = "";
      var m_fecha = null;
      var m_lgjId = 0;
      var m_legajo = "";

      var m_deplIdOrigen = 0;
      var m_depositoOrigen = "";

      var m_deplIdDestino = 0;
      var m_depositoDestino = "";

      var m_sucId = 0;
      var m_sucursal = "";
      var m_docId = 0;
      var m_documento = "";
      var m_doctId = 0;

      var m_taPropuesto;
      var m_taMascara = "";

      var m_idCliente = 0;
      var m_doctIdCliente = 0;

      var m_docCliente = "";

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

      var m_copy;

      var m_docEditable;
      var m_docEditMsg = "";

      var m_serialNumbers;
      var m_kitDefinitions;

      var m_depfId = 0;

      var m_serialNumbers;
      var m_kitDefinitions;

      var m_apiPath = DB.getAPIVersion();

      var emptyData = {
        items: [],
        serialNumbers: [],
        kitDefinitions: []
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
          CS.NEW_STOCK,
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

        return D.setDocNumber(m_lastDocId, m_dialog, CST.ST_NRODOC).then(
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

          return D.setDocNumber(m_lastDocId, m_dialog, CST.ST_NRODOC)

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

          doc.setClientTable(CST.STOCK);
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
          case Dialogs.Message.MSG_GRID_ROW_DELETED:

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

          case Dialogs.Message.MSG_DOC_MERGE:

            loadCompensar(pGetItems());
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

            D.search(D.Types.TRANSFERENCIA_STOCK, self, Cairo.bool(info));
            break;

          case Dialogs.Message.MSG_DOC_DOC_AUX:

            showDocAux(m_id);
            break;

          case Dialogs.Message.MSG_DOC_HISTORY:

            if(m_id !== NO_ID) {
              p = Cairo.History.show(Cairo.Tables.TRANSFERENCIAS_DE_STOCK, m_id, m_documento + " " + m_nrodoc);
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
        Cairo.raiseError("Stock", "DiscardChanges was called");
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
                  // editing a saved invoice we need to move to a new document
                  //
                  if(m_id !== NO_ID && m_docId !== m_lastDocId) {
                    p = self.edit(D.Constants.DOC_CHANGED);
                  }

                  return p || P.resolvedPromise(true);

                })
                .whenSuccess(function() {

                  return D.setDocNumber(m_lastDocId, m_dialog, CST.ST_NRODOC)
                    .then(function(enabled) {

                      m_taPropuesto = enabled;
                    });
                });
            }

            p = p || P.resolvedPromise();

            p = p.then(function() {
              setEnabled();
              setDeplDestinoForConsumo();
            });

            break;

          case K_DEPL_ID_ORIGEN:

            if(Cairo.getStockConfig().getStockXFisico() || Cairo.getStockConfig().getNoControlaStock()) {

              m_depfId = NO_ID;

              p = DB.getData("load[" + m_apiPath + "general/depositologico/" + getDeplIdOrigen().toString() + "/info]");

              p = p.then(function(response) {
                if(response.success === true) {
                  m_depfId = valField(response.data, C.DEPF_ID);
                }
                return response.success;
              });
            }
            break;
        }

        return p || P.resolvedPromise();
      };

      self.save = function() {
        var p;

        p = D.docCanBeEdited(m_docEditable, m_docEditMsg)
          .whenSuccess(function() {
            return D.docCanBeSaved(m_dialog, CST.ST_FECHA);
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

            register.setFieldId(CST.ST_ID);
            register.setTable(CST.STOCK);

            register.setPath(m_apiPath + "stock/stock");

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
                  fields.add(CST.ST_NUMERO, property.getValue(), Types.long);
                  break;

                case K_NRODOC:
                  fields.add(CST.ST_NRODOC, property.getValue(), Types.text);
                  break;

                case K_DESCRIP:
                  fields.add(CST.ST_DESCRIP, property.getValue(), Types.text);
                  break;

                case K_FECHA:
                  fields.add(CST.ST_FECHA, property.getValue(), Types.date);
                  break;

                case K_LGJ_ID:
                  fields.add(C.LGJ_ID, property.getSelectId(), Types.id);
                  break;

                case K_SUC_ID:
                  fields.add(C.SUC_ID, property.getSelectId(), Types.id);
                  break;

                case K_DOC_ID:
                  fields.add(C.DOC_ID, property.getSelectId(), Types.id);
                  break;

                case K_DEPL_ID_ORIGEN:
                  fields.add(C.DEPL_ID_ORIGEN, property.getSelectId(), Types.id);
                  break;

                case K_DEPL_ID_DESTINO:
                  fields.add(C.DEPL_ID_DESTINO, property.getSelectId(), Types.id);
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
          m_serialNumbers = null;
          m_kitDefinitions = null;
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
        return "#stock/stock/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "stock" + id;
      };

      self.getTitle = function() {
        return TITLE + (m_id !== NO_ID ? " " + m_nrodoc : "");
      };

      self.getTabTitle = function() {
        return "ST-" + m_nrodoc;
      };

      self.validate = function() {
        var dplIdOrigen = NO_ID;
        var dplIdDestino = NO_ID;

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

            case K_DEPL_ID_ORIGEN:
              if(valEmpty(property.getSelectId(), Types.id)) {
                return M.showInfoWithFalse(getText(2011, "")); // Debe indicar un origen
              }
              dplIdOrigen = property.getSelectId();
              break;

            case K_DEPL_ID_DESTINO:
              if(valEmpty(property.getSelectId(), Types.id)) {
                return M.showInfoWithFalse(getText(2012, "")); // Debe indicar un destino
              }
              dplIdDestino = property.getSelectId();
              break;

            case K_SUC_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                return M.showInfoWithFalse(getText(1560, "")); // Debe indicar una sucursal
              }
              break;
          }
        }

        if(dplIdDestino === dplIdOrigen) {
          return M.showInfoWithFalse(getText(2013, "")); // El depósito origen y el destino no pueden ser iguales
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

        return DB.getData("load[" + m_apiPath + "stock/stock/info]", id)
          .whenSuccessWithResult(loadData, false);
      };

      self.getDialog = function() {
        return m_dialog;
      };

      self.list = function() {
        return Cairo.Security.hasPermissionTo(CS.LIST_STOCK);
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
            CS.LIST_STOCK,
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
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "edit", C_MODULE, "");
        }

        return p || P.resolvedPromise(false);
      };

      self.setListController = function(controller) {
        m_listController = controller;
      };

      self.setBranchId = function(rhs) {
        m_branchId = rhs;
      };

      self.getBranchId = function() {
        return m_branchId;
      };

      self.columnAfterUpdate = function(key, lRow, lCol) {
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
        var p = null;

        try {

          switch (key) {

            case K_ITEMS:
              var property = getProperty(m_items, C_ITEMS);
              p = columnBeforeEdit(property, lRow, lCol, iKeyAscii);
              break;
          }

        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnBeforeEdit", C_MODULE, "");
        }

        return p || P.resolvedPromise(true);
      };

      var columnBeforeEdit = function(property, lRow, lCol, iKeyAscii) {

        var rtn = false;
        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).getKey()) {

          case KI_NRO_SERIE:

            var row = grid.getRows().item(lRow);
            if(row !== null) {
              rtn = cellId(row, KI_PR_LLEVA_NRO_SERIE) !== 0;
            }
            break;

          case KI_STL_ID:

            row = property.getGrid().getRows().item(lRow);

            if(row !== null) {

              if(cellId(row, KI_PR_LLEVA_LOTE) !== 0
                && cellId(row, KI_PR_LLEVA_NRO_SERIE) === 0) {

                var prIdKit = null;
                if(cellId(row, KI_ES_KIT)) {
                  prIdKit = cellId(row, KI_PR_ID);
                }

                var column = grid.getColumns().item(C.STL_ID);
                column.setSelectFilter("'pr_id = " + cellId(row, KI_PR_ID).toString()
                  + " and "
                  + D.getStockLoteFilter(
                    getDeplIdOrigen(),
                    Cairo.getStockConfig().getStockFisico(),
                    prIdKit,
                    m_depfId
                  )
                  + "'");

                m_dialog.refreshColumnProperties(property, C.STL_ID);

                rtn = true;
              }
            }
            break;

          default:

            rtn = true;
            break;
        }

        return rtn;
      };

      var columnAfterEdit = function(property, lRow, lCol, newValue, newValueId) {

        var p = null;
        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).getKey()) {

          case KI_PR_ID:

            Cairo.LoadingMessage.show("Movimiento de Stock", "Loading data for product.");

            var row = grid.getRows().item(lRow);
            p = setDataProducto(row, newValueId);
            break;

        }

        return p || P.resolvedPromise(true);
      };

      self.columnButtonClick = function(key, lRow, lCol, iKeyAscii) {

        var p = null;

        switch (key) {

          case K_ITEMS:

            var grid = getProperty(m_items, C_ITEMS).getGrid();

            switch (grid.getColumns().item(lCol).getKey()) {

              case KI_NRO_SERIE:

                var row = grid.getRows().item(lRow);

                if(cellId(row, KI_PR_LLEVA_NRO_SERIE) !== 0) {

                  var prId = cellId(row, KI_PR_ID);

                  p = Cairo.SerialNumber.edit(
                    cellId(row, KI_GRUPO), cellFloat(row, KI_CANTIDAD),
                    row, m_serialNumbers, KI_GRUPO, KI_NRO_SERIE, lRow, prId, getDeplIdOrigen(),
                    false, cellId(row, KI_ES_KIT) != 0, false, D.getKitInfo(prId, m_kitDefinitions), NO_ID, NO_ID);
                }
                break;
            }
            break;
        }

        return p || P.resolvedPromise(false);
      };

      self.columnClick = function(key, lRow, lCol) {

      };

      self.gridDblClick = function(key, lRow, lCol) {
        return P.resolvedPromise(false);
      };

      self.deleteRow = function(key, row, lRow) {
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

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KI_CANTIDAD:
              if(!valEmpty(cell.getValue(), Types.currency)) {
                if(val(cell.getValue()) !== 1) {
                  return false;
                }
              }
              break;

            case KI_PR_ID:
              if(!valEmpty(cell.getId(), Types.id)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var validateRow = function(row, rowIndex) {

        var p = null;
        var llevaNroSerie = false;
        var cantidad = 0;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KI_CANTIDAD:
              cantidad = val(cell.getValue());
              if(valEmpty(cell.getValue(), Types.currency)) {
                return M.showInfoWithFalse(getText(1365, "", strRow)); // Debe indicar una cantidad (1)
              }
              break;

            case KI_PR_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(1996, "", strRow)); // Debe indicar un producto de stock (1)
              }
              break;

            case KI_NRO_SERIE:
              llevaNroSerie = cellId(row, KI_PR_LLEVA_NRO_SERIE) !== 0;
              if(valEmpty(cell.getValue(), Types.text) && llevaNroSerie) {
                return M.showInfoWithFalse(getText(1630, "", strRow)); // Debe indicar un numero de serie (1)
              }
              break;

            case KI_STL_ID:

              if(valEmpty(cell.getId(), Types.id)
                && cellId(row, KI_PR_LLEVA_LOTE)
                && cellId(row, KI_PR_LLEVA_LOTE) === 0
                && cellId(row, KI_PR_LOTEFIFO) === 0) {
                return M.showInfoWithFalse(getText(1632, "", strRow)); // Debe indicar un lote (1)
              }
              break;
          }
        }

        // if the product has a serial number
        // we need validate quantity match the
        // count of serial numbers collection
        //
        if(llevaNroSerie) {

          var prId = cellId(row, KI_PR_ID);

          p = Cairo.SerialNumber.quantityChange(
            row, KI_GRUPO, rowIndex, m_serialNumbers, cantidad, strRow,
            KI_PR_ID, KI_CANTIDAD, KI_NRO_SERIE, prId, getDeplIdOrigen(), false);
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
        m_dialog.setButtonsEx2(Dialogs.Buttons.BUTTON_DOC_MERGE);
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
          elem.setSelectId(Cairo.UserConfig.getDocStId());
          elem.setValue(Cairo.UserConfig.getDocStName());

          validateDocDefault = elem.getSelectId() !== NO_ID;

        }

        elem.setSelectFilter(D.TRANSFERENCIA_STOCK_DOC_FILTER);

        elem = properties.add(null, Cairo.Constants.NUMBER_ID);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.integer);
        elem.setName(getText(1065, "")); // Número
        elem.setKey(K_NUMERO);
        elem.setValue(m_numero);
        elem.setEnabled(false);

        elem = properties.add(null, CST.ST_FECHA);
        elem.setType(T.date);
        elem.setName(getText(1569, "")); // Fecha
        elem.setKey(K_FECHA);
        elem.setValue(m_fecha);

        elem = properties.add(null, CST.ST_NRODOC);
        elem.setType(T.text);
        elem.setName(getText(1065, "")); // Número
        elem.setSize(50);
        elem.setKey(K_NRODOC);
        elem.setValue(m_nrodoc);
        elem.setTextMask(m_taMascara);
        elem.setTextAlign(Dialogs.TextAlign.right);

        elem = properties.add(null, C.DEPL_ID_ORIGEN);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DEPOSITO_LOGICO);
        elem.setName(getText(2014, "")); // Depósito Origen
        elem.setKey(K_DEPL_ID_ORIGEN);
        elem.setSelectId(m_deplIdOrigen);
        elem.setValue(m_depositoOrigen);

        elem = properties.add(null, C.DEPL_ID_DESTINO);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DEPOSITO_LOGICO);
        elem.setName(getText(2015, "")); // Depósito Destino
        elem.setKey(K_DEPL_ID_DESTINO);
        elem.setSelectId(m_deplIdDestino);
        elem.setValue(m_depositoDestino);

        elem = properties.add(null, C.SUC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.SUCURSAL);
        elem.setName(getText(1281, "")); // Sucursal
        elem.setKey(K_SUC_ID);
        elem.setSelectId(m_sucId);
        elem.setValue(m_sucursal);

        elem = properties.add(null, C.LGJ_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.LEGAJOS);
        elem.setName(getText(1575, "")); // Legajo
        elem.setKey(K_LGJ_ID);
        elem.setSelectId(m_lgjId);
        elem.setValue(m_legajo);

        elem = properties.add(null, CST.ST_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setName(getText(1211, "")); // Observ.
        elem.setSize(5000);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);

        elem = properties.add(null, CST.ST_DOC_CLIENTE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(getText(1960, "")); // Generado Por
        elem.setKey(K_ID_CLIENTE);
        elem.setValue(m_docCliente);
        elem.setEnabled(false);

        if(!m_dialog.show(self)) { return false; }

        /////////////////////////////////////////////////////////////////////
        // ITEMS
        /////////////////////////////////////////////////////////////////////

        tabs = m_items.getTabs();
        tabs.clear();

        tabs.add(null).setIndex(0).setName(getText(1371, "")); // Items

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

        if(!m_items.show(self)) { return false; }

        /////////////////////////////////////////////////////////////////////
        // FOOTER
        /////////////////////////////////////////////////////////////////////

        properties = m_footerProps;
        properties.clear();

        setEnabled();

        if(!m_footer.show(self)) { return false; }

        if(validateDocDefault) {
          self.propertyChange(K_DOC_ID);
        }

        setDeplDestinoForConsumo();

        return true;
      };

      var setGridItems = function(property) {

        var elem;
        var grid = property.getGrid();

        var columns = grid.getColumns();
        columns.clear();

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_STI_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_DEPL_ID);

        elem = columns.add(null);
        elem.setName(getText(1367, "")); // Articulo
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PRODUCTOS_DE_STOCK);
        elem.setKey(KI_PR_ID);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setKey(KI_DESCRIP);

        elem = columns.add(null);
        elem.setName(getText(1374, "")); // Cantidad
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setKey(KI_CANTIDAD);

        elem = columns.add(null);
        elem.setName(getText(1165, "")); // Unidad
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KI_UNIDAD);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1639, "")); // Nro. Serie
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButton);
        elem.setKey(KI_NRO_SERIE);

        // Lote
        //
        elem = columns.add(null, CST.STL_ID);
        elem.setName(getText(1640, "")); // Lote
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.LOTES_DE_STOCK);
        elem.setKey(KI_STL_ID);

        // Lote
        //
        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PR_LLEVA_LOTE);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PR_LLEVA_NRO_SERIE);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_ES_KIT);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_GRUPO);

        grid.getRows().clear();
      };

      var loadItems = function() {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();

        for(var _i = 0, count = m_data.items.length; _i < count; _i += 1) {

          var row = rows.add(null, getValue(m_data.items[_i], CST.STI_ID));

          elem = row.add(null);
          elem.Value = getValue(m_data.items[_i], CST.STI_ID);
          elem.setKey(KI_STI_ID);

          elem = row.add(null);
          elem.Value = getValue(m_data.items[_i], C.DEPL_ID);
          elem.setKey(KI_DEPL_ID);

          elem = row.add(null);
          elem.Value = getValue(m_data.items[_i], C.PR_NAME_COMPRA);
          elem.Id = getValue(m_data.items[_i], C.PR_ID);
          elem.setKey(KI_PR_ID);

          elem = row.add(null);
          elem.Value = getValue(m_data.items[_i], CST.STI_DESCRIP);
          elem.setKey(KI_DESCRIP);

          elem = row.add(null);
          elem.Value = getValue(m_data.items[_i], CST.STI_SALIDA);
          elem.setKey(KI_CANTIDAD);

          elem = row.add(null);
          elem.Value = getValue(m_data.items[_i], C.UN_NAME);
          elem.setKey(KI_UNIDAD);

          elem = row.add(null);
          elem.Value = "";
          elem.setKey(KI_NRO_SERIE);

          elem = row.add(null);
          elem.Value = getValue(m_data.items[_i], C.STL_CODE);
          elem.Id = getValue(m_data.items[_i], C.STL_ID);
          elem.setKey(KI_STL_ID);

          elem = row.add(null);
          elem.Id = getValue(m_data.items[_i], C.PR_LLEVA_NRO_LOTE);
          elem.setKey(KI_PR_LLEVA_LOTE);

          elem = row.add(null);
          elem.Id = getValue(m_data.items[_i], C.PR_LLEVA_NRO_SERIE);
          elem.setKey(KI_PR_LLEVA_NRO_SERIE);

          elem = row.add(null);
          elem.Id = getValue(m_data.items[_i], C.PR_ES_KIT);
          elem.setKey(KI_ES_KIT);

          elem = row.add(null);
          elem.Id = getValue(m_data.items[_i], CST.STI_GRUPO);
          elem.setKey(KI_GRUPO);

        }

        var serialNumber = null;
        var curGroup = 0;
        var coll = null;
        var serialNumbers = "";

        m_serialNumbers.clear();

        for(var _i = 0, count = m_data.serialNumbers.length; _i < count; _i += 1) {

          // check if the group has changed
          //
          if(curGroup !== getValue(m_data.serialNumbers[_i], CST.STI_GRUPO)) {

            setSerialNumberInRow(curGroup, serialNumbers);
            serialNumbers = "";

            curGroup = getValue(m_data.items[_i], CST.STI_GRUPO);
            coll = Cairo.Collections.createCollection(Cairo.SerialNumber.create);
            m_serialNumbers.add(coll, Cairo.Collections.getKey(curGroup));
          }

          var prnsId = getValue(m_data.items[_i], C.PRNS_ID);

          serialNumber = coll.add(null, Cairo.Collections.getKey(prnsId));
          serialNumber.setPrnsId(prnsId);
          serialNumber.setCodigo(getValue(m_data.items[_i], C.PRNS_CODE));
          serialNumber.setDescrip(getValue(m_data.items[_i], C.PRNS_DESCRIP));
          serialNumber.setFechaVto(getValue(m_data.items[_i], C.PRNS_FECHA_VTO));
          serialNumber.setPrIdItem(getValue(m_data.items[_i], C.PR_ID));
          serialNumber.setKitItem(getValue(m_data.items[_i], C.PR_NAME_COMPRA));

          serialNumbers = serialNumbers + serialNumber.getCode() + ",";
        }

        setSerialNumberInRow(curGroup, serialNumbers);

        m_kitDefinitions.clear();

        for(var _i = 0, count = m_data.kitDefinitions.length; _i < count; _i += 1) {

          var prId = getValue(m_data.kitDefinitions[_i], C.PR_ID);
          var kitDefinition = Cairo.Kit.getKitDefinitionForPrId(prId, m_kitDefinitions);

          prId = getValue(m_data.kitDefinitions[_i], C.PR_ID_ITEM);

          var kitInfo = Cairo.Kit.getKitInfoForPrId(prId, kitDefinition);

          kitInfo.setPrId(prId);
          kitInfo.setName(getValue(m_data.kitDefinitions[_i], C.PR_NAME_COMPRA));
          kitInfo.setAmount(getValue(m_data.kitDefinitions[_i], C.PRK_CANTIDAD));
          kitInfo.setHasSerial(getValue(m_data.kitDefinitions[_i], C.PR_LLEVA_NRO_SERIE));
        }

        return true;
      };

      var loadDataFromResponse = function(response) {
        var data = response.data;

        data.items = data.get('items');
        data.serialNumbers = data.get('serialNumbers');
        data.kitDefinitions = data.get('kitDefinitions');

        return data;
      };

      var load = function(id) {
        m_data = emptyData;

        return Cairo.Database.getData("load[" + m_apiPath + "stock/stock]", id).then(
          function(response) {

            var p = null;

            if(response.success !== true) { return false; }

            if(response.data.id !== NO_ID) {

              m_data = loadDataFromResponse(response);

              var data = response.data;

              m_id = valField(data, CST.ST_ID);
              m_numero = valField(data, CST.ST_NUMERO);
              m_nrodoc = valField(data, CST.ST_NRODOC);
              m_descrip = valField(data, CST.ST_DESCRIP);
              m_fecha = valField(data, CST.ST_FECHA);
              m_lgjId = valField(data, C.LGJ_ID);
              m_legajo = valField(data, C.LGJ_CODE);
              m_deplIdOrigen = valField(data, C.DEPL_ID_ORIGEN);
              m_depositoOrigen = valField(data, C.DEPL_NAME_ORIGEN);
              m_deplIdDestino = valField(data, C.DEPL_ID_DESTINO);
              m_depositoDestino = valField(data, C.DEPL_NAME_DESTINO);
              m_depfId = valField(data, C.DEPF_ID);
              m_sucId = valField(data, C.SUC_ID);
              m_sucursal = valField(data, C.SUC_NAME);
              m_docId = valField(data, C.DOC_ID);
              m_documento = valField(data, C.DOC_NAME);
              m_doctId = valField(data, C.DOCT_ID);

              m_docEditable = valField(data, C.DOC_EDITABLE);
              m_docEditMsg = valField(data, C.DOC_EDIT_MSG);

              m_idCliente = valField(data, C.ID_CLIENTE);
              m_doctIdCliente = valField(data, C.DOCT_ID_CLIENTE);

              m_docCliente = valField(data, C.DOC_CLIENTE);

              m_taMascara = valField(data, C.TA_MASCARA);
              m_taPropuesto = valField(data, C.TA_PROPUESTO);

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

              m_lgjId = NO_ID;
              m_legajo = "";

              m_deplIdOrigen = NO_ID;
              m_depositoOrigen = "";
              m_deplIdDestino = NO_ID;
              m_depositoDestino = "";

              m_depfId = NO_ID;

              m_sucId = Cairo.User.getSucId();
              m_sucursal = Cairo.User.getSucName();

              m_idCliente = NO_ID;
              m_doctIdCliente = NO_ID;

              m_docCliente = "";

              m_taPropuesto = false;
              m_taMascara = "";

              p = P.resolvedPromise()
                .then(P.call(D.editableStatus, m_docId, CS.NEW_STOCK))
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

        transaction.setTable(CST.STOCK_ITEM_TMP);

        var kitOrder = 0;
        var order = { n: 0 };

        var rows = getGrid(m_items, C_ITEMS).getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          // for each kit one StockItemKit is created
          //
          // if the item is a kit we create one StockItem for each
          // component in the kit. the amount is component amount
          // defined in kit formula by item amount
          //
          if(cellId(row, KI_ES_KIT)) {

            var prIdKit = cellId(row, KI_PR_ID);
            kitOrder += 1;

            var kitDefinition = Cairo.Kit.getKitDefinitionForPrId(prIdKit, m_kitDefinitions);

            for(var _j = 0, _count = kitDefinition.size(); _j < _count; _j++) {
              var kitSerial = kitDefinition.item(_j);

              // dirty trick to save the component id
              //
              Dialogs.cell(row, KI_PR_ID).setId(kitSerial.getPrId());

              saveItemAux(
                transaction, order, row, prIdKit,
                kitSerial.getAmount() * cellFloat(row, KI_CANTIDAD),
                kitSerial.getHasSerialNumber(), kitOrder);
            }

            Dialogs.cell(row, KI_PR_ID).setId(prIdKit);

          }
          else {

            saveItemAux(
              transaction, order, row, NO_ID,
              0,
              cellId(row, KI_PR_LLEVA_NRO_SERIE), 0);
          }

        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveItemAux = function(transaction, order, row, prIdKit, kitAmount, hasSerialNumber, kitOrder) {

        // every item is saved twice, one is the input the other is output
        //
        // the stock works as an in/out balance sheet
        //     +---------+-----------+------------+-------+
        //     | depl_id | amount_in | amount_out | pr_id |
        //     +---------+-----------+------------+-------+
        //     | 456     | 0         | 1          | 123456|
        //     +---------+-----------+------------+-------+
        //     | 123     | 1         | 0          | 123456|
        //     +---------+-----------+------------+-------+
        //
        // in the above example we are moving pr_id 123456 between
        // deposits 123 and 456. the product is moving from 456 to 123.
        //
        for(var i = 0; i < 2; i++) {

          var register = new DB.Register();
          register.setFieldId(CST.STI_TMP_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var fields = register.getFields();

          for(var _j = 0, _count = row.size(); _j < _count; _j++) {
            var cell = row.item(_j);

            switch (cell.getKey()) {

              case KI_STI_ID:
                if(m_copy) {
                  fields.add(CST.STI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(CST.STI_ID, Cairo.Util.val(cell.getValue()), Types.integer);
                }
                break;

              case KI_DESCRIP:
                fields.add(CST.STI_DESCRIP, cell.getValue(), Types.text);
                break;

              case KI_PR_ID:
                fields.add(C.PR_ID, cell.getId(), Types.id);
                break;

              case KI_STL_ID:
                fields.add(C.STL_ID, cell.getId(), Types.id);
                break;
            }
          }

          // Kits
          //
          if(prIdKit !== NO_ID) {
            fields.add(C.PR_ID_KIT, prIdKit, Types.id);
            fields.add(C.STIK_ORDEN, kitOrder, Types.integer);
            fields.add(C.STIK_CANTIDAD, cellFloat(row, KI_CANTIDAD), Types.double);
          }

          // if the item is a kit we must move as many serial numbers
          // as indicated by kitAmount parameter
          //
          var amount = prIdKit !== NO_ID ? kitAmount : cellFloat(row, KI_CANTIDAD);

          // the first row is for the output deposit
          //
          if(i === 0) {
            fields.add(C.DEPL_ID, getDeplIdOrigen(), Types.id);

            saveItemAndSerialNumbers(
              transaction, amount, row, register, order,
              CST.StockItemTipo.ORIGEN, hasSerialNumber);

          }
          // the second row is for the input deposit
          //
          else {
            fields.add(C.DEPL_ID, getDeplIdDestino(), Types.id);

            saveItemAndSerialNumbers(
              transaction, amount, row, register, order,
              CST.StockItemTipo.DESTINO, hasSerialNumber);
          }
        }
      };

      var saveItemAndSerialNumbers = function(
        transaction, amount, row, register, order, type, hasSerialNumber) {

        if(hasSerialNumber) {

          var group = cellId(row, KI_GRUPO);
          var prIdItem = NO_ID;
          var n = 0;

          if(cellId(row, KI_ES_KIT)) {
            prIdItem = cellId(row, KI_PR_ID);
          }

          // for each serial number we create a row in StockItem
          //
          var serials = m_serialNumbers.get(Cairo.Collections.getKey(group));
          var _count = serials.size();

          for(var _i = 0; _i < _count; _i++) {

            var pt = serials.item(_i);

            // if it is a kit we take only the serial numbers
            // for this kit, if not we take all serial numbers
            //
            if((prIdItem === pt.getPrIdItem() || prIdItem === NO_ID)
              //
              // we check that only the amount received as a parameter
              // is moved
              //
              && n < amount) {

              n += 1;

              var registerSerial = new DB.Register();

              // copy base fields
              //
              registerSerial.setFieldId(register.getFieldId());
              registerSerial.setTable(register.getTable());
              registerSerial.setId(register.getId());

              var fields = registerSerial.getFields();
              var baseFields = register.getFields();

              for(var _j = 0, _countj = baseFields.size(); _j < _countj; _j++) {
                var fld = register.getFields().item(_j);
                fields.add(fld);
              }

              // if it is a new group, we use negative numbers for them,
              // so we need to get the absolute value
              //
              fields.add(CST.STI_GRUPO, Math.abs(group), Types.integer);
              //
              // sti_grupo is a field used to associate related documents
              // to a row in StockItem. for example rows in FacturaVentaItem
              // are associated with rows in StockItem in one to many relationship
              // given FacturaVenta with five items ( five rows in FacturaVentaItem )
              // each serial number associated in one of these rows will have its own
              // row in StockItem.
              //
              //  +--------+-------+--------------+
              //  | fvi_id | pr_id | fvi_cantidad |
              //  +--------+-------+--------------+
              //  |   123  | 33    | 3            |
              //  +--------+-------+--------------+
              //
              //  +--------+-------+-------------+------------+---------+---------+-----------+
              //  | sti_id | pr_id | sti_ingreso | sti_salida | prns_id | depl_id | STI_GRUPO |
              //  +--------+-------+-------------+------------+---------+---------+-----------+
              //  |   456  | 33    | 1           | 0          | 111111  | 44      | 123       |
              //  +--------+-------+-------------+------------+---------+---------+-----------+
              //  |   457  | 33    | 0           | 1          | 111111  | 88      | 123       |
              //  +--------+-------+-------------+------------+---------+---------+-----------+
              //  |   458  | 33    | 1           | 0          | 222222  | 44      | 123       |
              //  +--------+-------+-------------+------------+---------+---------+-----------+
              //  |   459  | 33    | 0           | 1          | 222222  | 88      | 123       |
              //  +--------+-------+-------------+------------+---------+---------+-----------+
              //  |   460  | 33    | 1           | 0          | 333333  | 44      | 123       |
              //  +--------+-------+-------------+------------+---------+---------+-----------+
              //  |   461  | 33    | 0           | 1          | 333333  | 88      | 123       |
              //  +--------+-------+-------------+------------+---------+---------+-----------+
              //
              // this way to associate StockItem with another document is used with many other
              // tables like RemitoVentaItem/Compra, OrdenServicioItem and any other document
              // that move stock
              //
              // maybe you are wondering what happens with StockItem where it is not
              // created from another document. In these cases sti_grupo is the row index.
              // and don't worry about the negative numbers they won't collide because new rows
              // are always bigger than existing rows so when they are converted to they
              // absolute value none of the existing groups use the same value.
              //
              // finally sti_grupo is only used when the product has a serial number

              fields.add(C.PRNS_ID, pt.getPrnsId(), Types.id);
              fields.add(C.PRNS_DESCRIP, pt.getDescrip(), Types.text);
              fields.add(C.PRNS_FECHA_VTO, pt.getFechaVto(), Types.date);

              switch (type) {
                case CST.StockItemTipo.ORIGEN:
                  fields.add(CST.STI_SALIDA, 1, Types.double);
                  break;

                case CST.StockItemTipo.DESTINO:
                  fields.add(CST.STI_INGRESO, 1, Types.double);
                  break;
              }

              order.n += 1;
              fields.add(CST.STI_ORDEN, order, Types.integer);

              transaction.addRegister(registerSerial);
            }
          }
        }
        else {

          var fields = register.getFields();

          switch (type) {
            case CST.StockItemTipo.ORIGEN:
              fields.add(CST.STI_SALIDA, amount, Types.double);
              break;

            case CST.StockItemTipo.DESTINO:
              fields.add(CST.STI_INGRESO, amount, Types.double);
              break;
          }

          order.n += 1;
          fields.add(CST.STI_ORDEN, order, Types.integer);

          transaction.addRegister(register);
        }
      };

      var setDataProducto = function(row, pr_id) {

        var bChanged = pr_id !== cellId(row, KI_PR_ID);

        var p = DB.getData(
            "load[" + m_apiPath + "general/producto/" + prId.toString() + "/stock]");

        return p.whenSuccessWithResult(function(response) {
          var isKit = valField(response.data, C.PR_ES_KIT);

          getCell(row, KI_UNIDAD).setValue(valField(response.data, C.UN_NAME));
          getCell(row, KI_PR_LLEVA_NRO_SERIE).setId(valField(response.data, C.PR_LLEVA_NRO_SERIE));
          getCell(row, KI_ES_KIT).setId(isKit);
          getCell(row, KI_PR_LLEVA_LOTE).setId(valField(response.data, C.PR_LLEVA_NRO_LOTE));

          if(isKit) {

            var coll = null;

            sqlstmt = "sp_StockProductoGetKitInfo "+ pr_id.toString();
            if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

            coll = Object.getCollKitInfoXPrId(pr_id, m_kitDefinitions);

            while (!rs.isEOF()) {
              pr_id = Cairo.Database.valField(rs.getFields(), C.PR_ID);
              //*TODO:** can't found type for with block
              //*With GetKitInfoItem(coll, pr_id)
              var w___TYPE_NOT_FOUND = GetKitInfoItem(coll, pr_id);
              w___TYPE_NOT_FOUND.pr_id = pr_id;
              w___TYPE_NOT_FOUND.Nombre = Cairo.Database.valField(rs.getFields(), C.PR_NAME_COMPRA);
              w___TYPE_NOT_FOUND.Cantidad = Cairo.Database.valField(rs.getFields(), "cantidad");
              w___TYPE_NOT_FOUND.LlevaNroSerie = Cairo.Database.valField(rs.getFields(), C.PR_LLEVA_NRO_SERIE);
              rs.MoveNext;
            }
          }
        }

        // Si cambio el producto borro los numeros de serie
        //
        if(bChanged || Dialogs.cell(row, KI_PR_LLEVA_NRO_SERIE).getID() === 0) {

          Dialogs.cell(row, KI_NRO_SERIE).getValue() === "";
          if(ExistsObjectInColl(m_serialNumbers, GetKey(Dialogs.cell(row, KI_GRUPO).getID()))) {

            m_serialNumbers.remove(GetKey(Dialogs.cell(row, KI_GRUPO).getID()));
          }
        }
      };

      var setEnabled = function() {
        var bState = null;
        var prop = null;

        if(m_docEditable) {
          bState = pGetDocId() !== NO_ID;
        }
        else {
          bState = false;
        }

        var _count = m_dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {
          prop = m_dialog.getProperties().item(_i);
          if(prop.getKey() !== K_DOC_ID && prop.getKey() !== K_NUMERO && prop.getKey() !== K_ID_CLIENTE) {

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

        var abmGen = null;

        abmGen = m_items;
        abmGen.RefreshEnabledState(m_items.getProperties());

        abmGen = m_dialog;
        abmGen.RefreshEnabledState(m_dialog.getProperties());

      };

      var move = function(moveTo) {
        var sqlstmt = null;
        var rs = null;
        var doc_id = null;

        doc_id = m_dialog.getProperties().item(C.DOC_ID).getSelectId();

        // Debe seleccionar un documento
        if(doc_id === NO_ID) { return M.showInfoWithFalse(getText(1595, "")); }

        sqlstmt = "sp_DocStockMover "+ moveTo+ ","+ m_numero+ ","+ doc_id.toString();

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
              GetDocNumber(m_lastDocId, m_dialog, m_taPropuesto, CST.ST_NRODOC);
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
        var abmGen = null;
        var filter = null;

        var properties = m_dialog.getProperties();

        c = properties.item(C.DOC_ID);
        c.setSelectId(m_docId);
        c.setValue(m_documento);

        c = properties.item(CST.ST_FECHA);
        c.setValue(m_fecha);

        c = properties.item(cDeclarations.getCsDocNumberID());
        c.setValue(m_numero);

        c = properties.item(CST.ST_NRODOC);
        c.setValue(m_nrodoc);
        c.setTextMask(m_taMascara);
        c.setTextAlign(vbRightJustify);

        c = properties.item(C.DEPL_ID_ORIGEN);
        c.setSelectId(m_deplIdOrigen);
        c.setValue(m_depositoOrigen);

        c = properties.item(C.DEPL_ID_DESTINO);
        c.setSelectId(m_deplIdDestino);
        c.setValue(m_depositoDestino);

        c = properties.item(C.SUC_ID);
        c.setSelectId(m_sucId);
        c.setValue(m_sucursal);

        c = properties.item(CST.ST_DOC_CLIENTE);
        c.setValue(m_docCliente);

        c = properties.item(C.LGJ_ID);
        c.setSelectId(m_lgjId);
        c.setValue(m_legajo);

        c = properties.item(CST.ST_DESCRIP);
        c.setValue(m_descrip);

        abmGen = m_dialog;
        abmGen.ShowValues(m_dialog.getProperties());

        abmGen.ResetChanged;

        c = m_items.getProperties().item(C_ITEMS);
        if(!pLoadItems(c)) { return; }

        abmGen = m_items;
        abmGen.ShowValues(m_items.getProperties());

        setEnabled();
        setDeplDestinoForConsumo();
      };

      // Construccion - Destruccion
      self.initialize = function() {
        try {

          // Error al grabar la transferencia de stock
          c_ErrorSave = getText(2017, "");

          m_serialNumbers = new Collection();
          m_generalConfig = new cGeneralConfig();
          m_generalConfig.Load;

          // Lote
          //
          Cairo.getStockConfig() = new cStockConfig();
          Cairo.getStockConfig().load();

          // Preferencias del Usuario
          //
          m_userCfg = new cUsuarioConfig();
          m_userCfg.Load;
          m_userCfg.ValidateST;

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
          m_items = null;
          m_footer = null;
          mCollection.collClear(m_serialNumbers);
          m_serialNumbers = null;

          // Lote
          //
          Cairo.getStockConfig() = null;

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

      ///////////////////////////////////////////////////////////////////////////////////////////////////

      var setSerialNumberInRow = function(currGroup, nroSerie) {
        var row = null;

        if(currGroup === 0) { return; }

        var _count = m_items.getProperties().item(C_ITEMS).getGrid().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = m_items.getProperties().item(C_ITEMS).getGrid().getRows().item(_i);
          if(Dialogs.cell(row, KI_GRUPO).getID() === currGroup) {
            Dialogs.cell(row, KI_NRO_SERIE).getValue() === RemoveLastColon(nroSerie);
            return;
          }
        }
      };

      var getDeplIdOrigen = function() {
        return m_dialog.getProperties().item(C.DEPL_ID_ORIGEN).getSelectId();
      };

      var getDeplIdDestino = function() {
        return m_dialog.getProperties().item(C.DEPL_ID_DESTINO).getSelectId();
      };

      var pGetDeplDestino = function() {
        return m_dialog.getProperties().item(C.DEPL_ID_DESTINO);
      };

      var pGetItems = function() {
        return m_items.getProperties().item(C_ITEMS);
      };

      var setGridCompensar = function(property) {
        var coll = null;
        var prId = null;

        if(!Ask(getText(3484, ""), vbNo)) {
          return null;
        }

        var pr_codigos = null;

        if(!GetInput(pr_codigos, getText(3491, ""))) { return false; }
        //Ingrese los codigos de producto separados por coma.
        //Si desea compensar todos los productos solo precione aceptar.

        var w_grid = property.getGrid();

        var w_rows = w_grid.getRows();

        w_rows.clear();
        return true;
      };

      var loadCompensar = function() {


        for(var _i = 0; _i < m_data.compensar.length; _i += 1) {

          elem = w_rows.add(null);

          elem = row.add(null);
          elem.Value = Cairo.Database.valField(m_data.compensar[_i], CST.STI_ID);
          elem.Key = KI_STI_ID;

          elem = row.add(null);
          elem.Value = Cairo.Database.valField(m_data.compensar[_i], C.DEPL_ID);
          elem.Key = KI_DEPL_ID;

          elem = row.add(null);
          elem.Value = Cairo.Database.valField(m_data.compensar[_i], C.PR_NAME_COMPRA);
          elem.Id = Cairo.Database.valField(m_data.compensar[_i], C.PR_ID);
          elem.Key = KI_PR_ID;

          elem = row.add(null);
          elem.Value = Cairo.Database.valField(m_data.compensar[_i], CST.STI_DESCRIP);
          elem.Key = KI_DESCRIP;

          elem = row.add(null);
          elem.Value = Cairo.Database.valField(m_data.compensar[_i], CST.STI_SALIDA);
          elem.Key = KI_CANTIDAD;

          elem = row.add(null);
          elem.Value = Cairo.Database.valField(m_data.compensar[_i], C.UN_NAME);
          elem.Key = KI_UNIDAD;

          elem = row.add(null);
          elem.Value = "";
          elem.Key = KI_NRO_SERIE;

          // Lote
          //
          elem = row.add(null);
          elem.Value = Cairo.Database.valField(m_data.compensar[_i], C.STL_CODE);
          elem.Id = Cairo.Database.valField(m_data.compensar[_i], C.STL_ID);
          elem.Key = KI_STL_ID;

          // Lote
          //
          elem = row.add(null);
          elem.Id = Cairo.Database.valField(m_data.compensar[_i], C.PR_LLEVA_NRO_LOTE);
          elem.Key = KI_PR_LLEVA_LOTE;

          elem = row.add(null);
          elem.Id = Cairo.Database.valField(m_data.compensar[_i], C.PR_LLEVA_NRO_SERIE);
          elem.Key = KI_PR_LLEVA_NRO_SERIE;

          elem = row.add(null);
          elem.Id = Cairo.Database.valField(m_data.compensar[_i], C.PR_ESKIT);
          elem.Key = KI_ES_KIT;

          elem = row.add(null);
          elem.Id = Cairo.Database.valField(m_data.compensar[_i], CST.STI_GRUPO);
          elem.Key = KI_GRUPO;

        }

        ////////////////////////////////////////////////////
        // Numeros de Serie
        ////////////////////////////////////////////////////

        var nroSerie = null;
        var curGroup = null;
        var nrosSerie = null;

        mCollection.collClear(m_serialNumbers);

        rs = rs.NextRecordset;

        for(var _i = 0; _i < m_data.compensar.length; _i += 1) {

          // Si cambie de grupo
          if(curGroup !== Cairo.Database.valField(m_data.compensar[_i], CST.STI_GRUPO)) {

            setSerialNumberInRow(curGroup, nrosSerie);
            nrosSerie = "";

            curGroup = Cairo.Database.valField(m_data.compensar[_i], CST.STI_GRUPO);
            coll = new Collection();
            m_serialNumbers.Add(coll, GetKey(curGroup));
          }

          // Guardo el numero de serie
          nroSerie = new cProductoSerieType();
          nroSerie.setCodigo(Cairo.Database.valField(m_data.compensar[_i], C.PRNS_CODE));
          nroSerie.setDescrip(Cairo.Database.valField(m_data.compensar[_i], C.PRNS_DESCRIP));
          nroSerie.setFechaVto(Cairo.Database.valField(m_data.compensar[_i], C.PRNS_FECHAVTO));
          nroSerie.setPrns_id(Cairo.Database.valField(m_data.compensar[_i], C.PRNS_ID));
          nroSerie.setPr_id_item(Cairo.Database.valField(m_data.compensar[_i], C.PR_ID));
          nroSerie.setKitItem(Cairo.Database.valField(m_data.compensar[_i], C.PR_NAME_COMPRA));

          nrosSerie = nrosSerie+ nroSerie.getCodigo()+ ",";

          // Lo agrego a la bolsa
          coll.Add(nroSerie, GetKey(nroSerie.getPrnsId()));

        }

        setSerialNumberInRow(curGroup, nrosSerie);
        nrosSerie = "";

        ////////////////////////////////////////////////////
        // Kit
        ////////////////////////////////////////////////////
        mCollection.collClear(m_kitDefinitions);

        rs = rs.NextRecordset;

        for(var _i = 0; _i < m_data.compensar.length; _i += 1) {

          prId = Cairo.Database.valField(m_data.compensar[_i], C.PR_ID);
          coll = Object.getCollKitInfoXPrId(prId, m_kitDefinitions);

          prId = Cairo.Database.valField(m_data.compensar[_i], C.PR_ID_ITEM);

          //*TODO:** can't found type for with block
          //*With GetKitInfoItem(coll, prId)
          var w___TYPE_NOT_FOUND = GetKitInfoItem(coll, prId);
          w___TYPE_NOT_FOUND.pr_id = prId;
          w___TYPE_NOT_FOUND.Nombre = Cairo.Database.valField(m_data.compensar[_i], C.PR_NAME_COMPRA);
          w___TYPE_NOT_FOUND.Cantidad = Cairo.Database.valField(m_data.compensar[_i], "cantidad");
          w___TYPE_NOT_FOUND.LlevaNroSerie = Cairo.Database.valField(m_data.compensar[_i], C.PR_LLEVA_NRO_SERIE);
        }

        var abmGen = null;
        abmGen = m_items;
        abmGen.ShowValues(m_items.getProperties());

        return true;
      };

      var setStock = function() {

        if(Cairo.getStockConfig().getStockXFisico() || Cairo.getStockConfig().getNoControlaStock()) {

          m_depfId = NO_ID;

          if(!Cairo.Database.getData(C.DEPOSITOLOGICO, C.DEPL_ID, getDeplIdOrigen(), C.DEPF_ID, m_depfId)) {
          }
        }

      };

      var pGetDepositoInternoName = function() {
        var deplNombre = null;
        if(!Cairo.Database.getData(C.DEPOSITOLOGICO, C.DEPL_ID, -2, C.DEPL_NAME, deplNombre)) { return ""; }
        return deplNombre;
      };

      var pGetDocIsConsumo = function() {
        var isConsumo = null;
        var docId = null;

        docId = pGetDocId();
        if(docId === NO_ID) { return false; }

        if(!Cairo.Database.getData(C.DOCUMENTO, C.DOC_ID, docId, C.DOC_ST_CONSUMO, isConsumo)) { return false; }
        return isConsumo;
      };

      var pIsDocAux = function() {
        if(m_id === NO_ID) { return false; }

        var idCliente = null;
        if(!Cairo.Database.getData(C.STOCK, CST.ST_ID, m_id, C.ID_CLIENTE, idCliente)) { return false; }
        return idCliente !== NO_ID;
      };

      var pGetDocId = function() {
        return m_dialog.getProperties().item(C.DOC_ID).getSelectId();
      };

      var setDeplDestinoForConsumo = function() {
        var bIsConsumo = null;

        bIsConsumo = pGetDocIsConsumo();

        if(bIsConsumo) {
          var w_pGetDeplDestino = pGetDeplDestino();
          w_pGetDeplDestino.setSelectId(-2);
          w_pGetDeplDestino.setValue(pGetDepositoInternoName());
          w_pGetDeplDestino.setEnabled(false);
        }
        else {

          // Si el documento fue generado por otro documento
          // permito que el destino sea interno
          //
          if(!pIsDocAux()) {
            var w_pGetDeplDestino = pGetDeplDestino();
            if(w_pGetDeplDestino.getSelectId() === -2) {
              w_pGetDeplDestino.setValue("");
              w_pGetDeplDestino.setSelectId(0);
            }
          }
        }

        var abmGen = null;
        abmGen = m_dialog;
        abmGen.ShowValue(pGetDeplDestino());
      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("StockListDoc.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

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

      var C_MODULE = "cStockListDoc";

      var C_FECHAINI = "FechaIni";
      var C_FECHAFIN = "FechaFin";

      var C_IMG_TASK = 1;


      var K_FECHAINI = 1;
      var K_FECHAFIN = 2;
      var K_LGJ_ID = 7;
      var K_SUC_ID = 8;
      var K_DOC_ID = 9;

      var K_EMP_ID = 100;
      var m_fechaIni = null;
      var m_fechaFin = null;
      var m_docId = "";
      var m_documento = "";
      var m_sucId = "";
      var m_sucursal = "";
      var m_lgjId = "";
      var m_legajo = "";

      var m_empId = "";
      var m_empresa = "";
      var m_fechaIniV = "";
      var m_fechaFinV = "";


      var m_dialog;
      var m_properties;

      var m_listController;

      var m_title = "";

      var m_menuLoaded;

      var m_menuShowNotes = 0;
      var m_menuAddNote = 0;
      var m_menuShowDocAux = 0;

      var m_apiPath = DB.getAPIVersion();
      var SAVE_ERROR = getText(2268, ""); // Error al grabar los párametros de navegación de Stock

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

            case m_menuShowDocAux:
              showDocAux(m_dialog.getId());
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
        c.setName(getText(1203, "")); // Fecha desde
        c.setKey(K_FECHAINI);
        if(LenB(m_fechaIniV)) {
          c.setValue(m_fechaIniV);
        }
        else {
          c.setValue(m_fechaIni);
        }

        c = m_dialog.getProperties().add(null, C_FECHAFIN);
        c.setType(Dialogs.PropertyType.date);
        c.setName(getText(1204, "")); // Fecha hasta
        c.setKey(K_FECHAFIN);
        if(LenB(m_fechaFinV)) {
          c.setValue(m_fechaFinV);
        }
        else {
          c.setValue(m_fechaFin);
        }

        c = m_dialog.getProperties().add(null, C.DOC_ID);
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
        c.setSelectFilter("'{emp_id=0}doct_id = "+ csEDocumentoTipo.cSEDT_TRASFERENCIASTOCK.toString()+ "'");

        c = m_dialog.getProperties().add(null, C.SUC_ID);
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

        c = m_dialog.getProperties().add(null, C.LGJ_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(C.cSLEGAJO);
        c.setName(getText(1575, "")); // Legajo
        c.setKey(K_LGJ_ID);
        value = m_legajo;
        if(m_lgjId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(C.cSLEGAJO, Cairo.Util.val(m_lgjId.Substring(2)), bExists);
          if(!bExists) { m_lgjId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_lgjId));
        c.setSelectIntValue(m_lgjId);


        c = m_dialog.getProperties().add(null, C.EMP_ID);
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

        return DB.getData("load[" + m_apiPath + "general/stocklistdoc]", id).then(
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
              m_sucursal = "";
              m_legajo = "";

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

          case K_DOC_ID:
            var property = m_dialog.getProperties().item(C.DOC_ID);
            m_documento = property.getValue();
            m_docId = property.getSelectIntValue();

            break;

          case K_SUC_ID:
            var property = m_dialog.getProperties().item(C.SUC_ID);
            m_sucursal = property.getValue();
            m_sucId = property.getSelectIntValue();

            break;

          case K_LGJ_ID:
            var property = m_dialog.getProperties().item(C.LGJ_ID);
            m_legajo = property.getValue();
            m_lgjId = property.getSelectIntValue();


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
          cpgId: m_cpgId,
          empId: m_empId
        };

        return DB.getData("load[" + m_apiPath + "compras/facturacompras]", null, params);
      };
      var cIABMListDocClient_Refresh = function() {
        var sqlstmt = null;

        sqlstmt = "sp_lsdoc_Stocks ";

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

        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_docId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_sucId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_lgjId)+ ",";
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

        // Error al grabar los párametros de navegación de Transferencias de Stock
        strError = getText(2268, "");

        var register = null;
        var register = new DB.Register();

        var sqlstmt = null;

        sqlstmt = "delete ListaDocumentoParametro  where pre_id = "+ csStockPrestacion.cSPRESTLISTSTOCK.toString()+ " and us_id = "+ m_us_id+ " and (emp_id is null or emp_id = "+ cUtil.getEmpId().toString()+ ")";

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

            case K_DOC_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 30, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_DOC_ID, Types.integer);

              break;

            case K_SUC_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 40, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_SUC_ID, Types.integer);

              break;

            case K_LGJ_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 50, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_LGJ_ID, Types.integer);


              break;

            case K_EMP_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 100, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_EMP_ID, Types.integer);

              break;
          }


          fields.add(C.EMP_ID, cUtil.getEmpId(), Types.id);

          fields.add(C.US_ID, m_us_id, Types.id);
          fields.add(C.PRE_ID, csStockPrestacion.cSPRESTLISTSTOCK, Types.id);



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

          // Transferencias de Stock
          m_title = getText(2270, "");

          m_properties = new cABMDocProperties();
          //Set .ImageList = fIcons.iList
          m_properties.setHaveDetail(true);
          m_properties.setStartRowText(4);

          elem = m_properties.add(null, "TypeTask");
          elem.setName("TypeTask");
          elem.setCaption(" ");
          elem = row.add(null);
          elem.FormulaType = csConditionType.cSCONDTNONE;
          elem.IconIndex = C_IMG_TASK;
          elem.setSortType(csSortType.cSSRTTICON);

          elem = m_properties.add(null, "Observaciones");
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

      var createMenu = function() {


        if(m_menuLoaded) { return; }

        m_menuLoaded = true;

        m_objList.ObjClientMenu = self;
        m_objList.ClearMenu;
        // Agregar Nota
        m_menuAddNote = m_objList.addMenu(getText(1615, ""));
        // Ver Notas
        m_menuShowNotes = m_objList.addMenu(getText(1616, ""));
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



      var showDocAux = function() {
        var fcId = m_dialog.getId();
        if(fcId !== NO_ID) {

          D.getStockId(D.Types.TYPE_XXXX, xxId).whenSuccessWithResult(function(response) {
            D.showDocAux(response.st_id, "Stock");
          });
        }
      };


      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("Stock.List", function(List, Cairo, Backbone, Marionette, $, _) {

    var NO_ID = Cairo.Constants.NO_ID;
    var DB = Cairo.Database;
    var C_MODULE = "cStock";
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
            entitiesTitle: "Stock",
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
              Cairo.LoadingMessage.show("Stock", "Loading Stocks from Crowsoft Cairo server.");

              var editor = Cairo.Stock.Edit.Controller.getEditor();
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
          Cairo.LoadingMessage.show("Stock", "Loading Stocks from Crowsoft Cairo server.");

          self.documentList = Cairo.StockListDoc.Edit.Controller.getEditor();
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