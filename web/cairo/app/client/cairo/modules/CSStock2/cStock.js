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
      var m_estado = "";
      var m_estId = 0;
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
      var m_creado = null;
      var m_modificado = null;
      var m_modifico = 0;

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

      var m_nrosSerie;
      var m_collKitInfo;

      var m_depfId = 0;

      var m_apiPath = DB.getAPIVersion();

      var emptyData = {
        items: [],
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

            D.search(D.Types.TRASFERENCIA_STOCK, self, Cairo.bool(info));
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

              p = DB.getData("load[" + m_apiPath + "general/depositologico/" + getDeplId().toString() + "/info]");

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
                    getDeplId(),
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

      var pColumnAfterEdit = function(property, lRow, lCol, newValue, newValueID) { // TODO: Use of ByRef founded Private Function pColumnAfterEdit(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long, ByVal NewValue As Variant, ByVal NewValueID As Long)
        var row = null;

        switch (property.getGrid().getColumns(lCol).Key) {
          case KI_PR_ID:
            row = property.getGrid().getRows(lRow);
            pSetDataProducto(row, newValueID);

            break;
        }

        return true;
      };

      var columnButtonClick = function(key, lRow, lCol, iKeyAscii) {
        var _rtn = null;
        var row = null;

        switch (key) {
          case K_ITEMS:
            var property = m_items.getProperties().item(C_ITEMS).getGrid();
            switch (property.Columns(lCol).key) {
              case KI_NRO_SERIE:
                row = property.Rows(lRow);
                if(Dialogs.cell(row, KI_PR_LLEVA_NRO_SERIE).getID()) {

                  var prId = null;

                  prId = Dialogs.cell(row, KI_PR_ID).getID();

                  _rtn = EditNroSerie(Dialogs.cell(row, KI_GRUPO).getID(), Cairo.Util.val(Dialogs.cell(row, KI_CANTIDAD).getValue()), row, m_nrosSerie, KI_GRUPO, KI_NRO_SERIE, lRow, prId, m_dialog.getProperties().item(mStockConstantes.DEPL_ID_ORIGEN).getSelectId(), false, Dialogs.cell(row, KI_ES_KIT).getID(), GetKitInfo(prId, m_collKitInfo), NO_ID, NO_ID);
                }
                break;
            }
            break;
        }

        return _rtn;
      };

      var columnClick = function(key, lRow, lCol) {

      };

      var dblClick = function(key, lRow, lCol) {

      };

      var deleteRow = function(key, row, lRow) {
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

      var pIsEmptyRow = function(row, rowIndex) {
        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_CANTIDAD:
              if(!valEmpty(cell.getValue(), Types.currency)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KI_PR_ID:
              if(!valEmpty(cell.getId(), Types.id)) {
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
        var bLlevaNroSerie = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_CANTIDAD:
              if(valEmpty(cell.getValue(), Types.currency)) {
                // Debe indicar una cantidad (1)
                return M.showInfoWithFalse(getText(1365, "", strRow));
              }
              break;

            case KI_PR_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                // Debe indicar un producto de stock (1)
                return M.showInfoWithFalse(getText(1996, "", strRow));
              }
              break;

            case KI_NRO_SERIE:
              bLlevaNroSerie = Dialogs.cell(row, KI_PR_LLEVA_NRO_SERIE).getID();
              if(valEmpty(cell.getValue(), Types.text) && bLlevaNroSerie) {
                // Debe indicar un numero de serie (1)
                return M.showInfoWithFalse(getText(1630, "", strRow));
              }

              // Lote
              //
              break;

            case KI_STL_ID:
              if(valEmpty(cell.getId(), Types.id) && Dialogs.cell(row, KI_PR_LLEVA_LOTE).getID() && Dialogs.cell(row, KI_PR_LLEVA_NRO_SERIE).getID() === 0) {
                // Debe indicar un lote (1)
                return M.showInfoWithFalse(getText(1632, "", strRow));
              }

              break;
          }
        }

        return P.resolvedPromise(true);
      };

      // funciones privadas
      var loadCollection = function() {
        var filter = null;
        var c = null;
        var abmGen = null;

        // Preferencias del usuario
        //
        var bValidateDocDefault = null;

        abmGen = m_dialog;

        abmGen.ResetLayoutMembers;

        abmGen.setNoButtons1(csButtons.bUTTON_ANULAR + csButtons.bUTTON_DOC_APLIC);
        abmGen.setNoButtons2(csButtons.bUTTON_DOC_ACTION);
        abmGen.setButtonsEx2(csButtons.bUTTON_DOC_MERGE);
        abmGen.InitButtons;

        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, mStockConstantes.DOC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSDocumento2.CSDocumento);
        // Documento
        elem.setName(getText(1567, ""));
        elem.setKey(K_DOC_ID);

        if(m_docId !== NO_ID) {
          elem.setSelectId(m_docId);
          elem.setValue(m_documento);
        }
        else {
          // Preferencias del usuario
          //
          elem.setSelectId(m_userCfg.getDocStId());
          elem.setValue(m_userCfg.getDocStNombre());

          bValidateDocDefault = elem.getSelectId() !== NO_ID;
        }

        elem.setSelectFilter("'doct_id = "+ csEDocumentoTipo.cSEDT_TRASFERENCIASTOCK.toString()+ "'");

        var elem = properties.add(null, cDeclarations.getCsDocNumberID());
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.Integer);
        // Número
        elem.setName(getText(1065, ""));
        elem.setKey(K_NUMERO);
        elem.setValue(m_numero);
        elem.setEnabled(false);

        var elem = properties.add(null, mStockConstantes.ST_FECHA);
        elem.setType(Dialogs.PropertyType.date);
        // Fecha
        elem.setName(getText(1569, ""));
        elem.setLeftLabel(-580);
        elem.setLeft(1250);
        elem.setKey(K_FECHA);
        elem.setValue(m_fecha);

        var elem = properties.add(null, mStockConstantes.ST_NRODOC);
        elem.setType(Dialogs.PropertyType.text);
        // Número
        elem.setName(getText(1065, ""));
        elem.setSize(50);
        elem.setKey(K_NRODOC);
        elem.setValue(m_nrodoc);
        elem.setTextMask(m_taMascara);
        elem.setTextAlign(vbRightJustify);

        var elem = properties.add(null, mStockConstantes.DEPL_ID_ORIGEN);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DEPOSITOLOGICO);
        elem.setTopFromProperty(mStockConstantes.ST_FECHA);
        elem.setLeft(4800);
        // Depósito Origen
        elem.setName(getText(2014, ""));
        elem.setKey(K_DEPL_ID_ORIGEN);
        elem.setSelectId(m_deplIdOrigen);
        elem.setValue(m_depositoOrigen);

        var elem = properties.add(null, mStockConstantes.DEPL_ID_DESTINO);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DEPOSITOLOGICO);
        // Depósito Destino
        elem.setName(getText(2015, ""));
        elem.setKey(K_DEPL_ID_DESTINO);
        elem.setSelectId(m_deplIdDestino);
        elem.setValue(m_depositoDestino);

        var elem = properties.add(null, mStockConstantes.SUC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.SUCURSAL);
        elem.setTopFromProperty(mStockConstantes.DEPL_ID_ORIGEN);
        elem.setLeft(8100);
        elem.setLeftLabel(-800);
        // Sucursal
        elem.setName(getText(1281, ""));
        elem.setKey(K_SUC_ID);
        elem.setSelectId(m_sucId);
        elem.setValue(m_sucursal);

        var elem = properties.add(null, mStockConstantes.LGJ_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(mStockConstantes.cSLEGAJO);
        // Legajo
        elem.setName(getText(1575, ""));
        elem.setKey(K_LGJ_ID);
        elem.setSelectId(m_lgjId);
        elem.setValue(m_legajo);

        var elem = properties.add(null, mStockConstantes.ST_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        // Observ.
        elem.setName(getText(1211, ""));
        elem.setLeftLabel(-600);
        elem.setSize(5000);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);
        elem.setLeftFromProperty(mStockConstantes.ST_FECHA);
        elem.setTopFromProperty(mStockConstantes.ST_NRODOC);
        elem.setWidth(9100);
        elem.setHeight(460);
        elem.setTopToPrevious(440);

        var elem = properties.add(null, mStockConstantes.ST_DOC_CLIENTE);
        elem.setType(Dialogs.PropertyType.text);
        // Generado Por
        elem.setName(getText(1960, ""));
        elem.setLeftFromProperty(mStockConstantes.ST_FECHA);
        elem.setTopFromProperty(mStockConstantes.ST_DESCRIP);
        elem.setLeftLabel(-1050);
        elem.setTopToPrevious(580);
        elem.setWidth(9100);
        elem.setKey(K_ID_CLIENTE);
        elem.setValue(m_docCliente);
        elem.setEnabled(false);

        if(!m_dialog.show(self)) { return false; }

        var w_tabs = m_items.getTabs();

        w_tabs.clear();

        var tab = w_tabs.add(null);
        // Items
        tab.setName(getText(1371, ""));

        abmGen = m_items;
        abmGen.ResetLayoutMembers;

        var properties = m_items.getProperties();

        properties.clear();

        c = m_items.getProperties().add(null, C_ITEMS);
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

        if(!m_items.show(self)) { return false; }

        m_footer.getProperties().clear();

        setEnabled();

        if(!m_footer.show(self)) { return false; }

        // Preferencias del Usuario
        //
        if(bValidateDocDefault) {
          self.propertyChange(K_DOC_ID);
        }

        setDeplDestinoForConsumo();

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(mStockConstantes.DOC_ID);
        elem.setSelectId(m_docId);
        elem.setValue(m_documento);
        elem.setSelectId(m_userCfg.getDocStId());
        elem.setValue(m_userCfg.getDocStNombre());

        var elem = properties.item(cDeclarations.getCsDocNumberID());
        elem.setValue(m_numero);

        var elem = properties.item(mStockConstantes.ST_FECHA);
        elem.setValue(m_fecha);

        var elem = properties.item(mStockConstantes.ST_NRODOC);
        elem.setValue(m_nrodoc);

        var elem = properties.item(mStockConstantes.DEPL_ID_ORIGEN);
        elem.setSelectId(m_deplIdOrigen);
        elem.setValue(m_depositoOrigen);

        var elem = properties.item(mStockConstantes.DEPL_ID_DESTINO);
        elem.setSelectId(m_deplIdDestino);
        elem.setValue(m_depositoDestino);

        var elem = properties.item(mStockConstantes.SUC_ID);
        elem.setSelectId(m_sucId);
        elem.setValue(m_sucursal);

        var elem = properties.item(mStockConstantes.LGJ_ID);
        elem.setSelectId(m_lgjId);
        elem.setValue(m_legajo);

        var elem = properties.item(mStockConstantes.ST_DESCRIP);
        elem.setValue(m_descrip);

        var elem = properties.item(mStockConstantes.ST_DOC_CLIENTE);
        elem.setValue(m_docCliente);

        return m_dialog.showValues(properties);
      };

      var setGridItems = function(property) {
        var coll = null;
        var prId = null;

        var w_grid = property.getGrid();

        var w_columns = w_grid.getColumns();

        w_columns.clear();

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_STI_ID);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_DEPL_ID);

        var elem = w_columns.add(null);
        // Articulo
        elem.setName(getText(1367, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PRODUCTOSTOCK);
        elem.setWidth(2500);
        elem.setKey(KI_PR_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setWidth(3000);
        elem.setKey(KI_DESCRIP);

        var elem = w_columns.add(null);
        // Cantidad
        elem.setName(getText(1374, ""));
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setWidth(1200);
        elem.setKey(KI_CANTIDAD);

        var elem = w_columns.add(null);
        // Unidad
        elem.setName(getText(1165, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1200);
        elem.setKey(KI_UNIDAD);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        // Nro. Serie
        elem.setName(getText(1639, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButton);
        elem.setWidth(3000);
        elem.setKey(KI_NRO_SERIE);

        // Lote
        //
        var elem = w_columns.add(null, mStockConstantes.STL_ID);
        // Lote
        elem.setName(getText(1640, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.STOCKLOTE);
        elem.setWidth(2000);
        elem.setKey(KI_STL_ID);

        // Lote
        //
        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PR_LLEVA_LOTE);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PR_LLEVA_NRO_SERIE);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_ES_KIT);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_GRUPO);

        var w_rows = w_grid.getRows();

        w_rows.clear();
        return true;
      };

      var pLoadItems = function() {


        for(var _i = 0; _i < m_data.items.length; _i += 1) {

          var elem = w_rows.add(null, rs(mStockConstantes.STI_ID).Value);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mStockConstantes.STI_ID);
          elem.setKey(KI_STI_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mStockConstantes.DEPL_ID);
          elem.setKey(KI_DEPL_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mStockConstantes.PR_NAME_COMPRA);
          elem.Id = Cairo.Database.valField(m_data.items[_i], mStockConstantes.PR_ID);
          elem.setKey(KI_PR_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mStockConstantes.STI_DESCRIP);
          elem.setKey(KI_DESCRIP);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mStockConstantes.STI_SALIDA);
          elem.setKey(KI_CANTIDAD);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mStockConstantes.UN_NAME);
          elem.setKey(KI_UNIDAD);

          var elem = elem.add(null);
          elem.Value = "";
          elem.setKey(KI_NRO_SERIE);

          // Lote
          //
          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], mStockConstantes.STL_CODE);
          elem.Id = Cairo.Database.valField(m_data.items[_i], mStockConstantes.STL_ID);
          elem.setKey(KI_STL_ID);

          // Lote
          //
          var elem = elem.add(null);
          elem.Id = Cairo.Database.valField(m_data.items[_i], mStockConstantes.PR_LLEVA_NRO_LOTE);
          elem.setKey(KI_PR_LLEVA_LOTE);

          var elem = elem.add(null);
          elem.Id = Cairo.Database.valField(m_data.items[_i], mStockConstantes.PR_LLEVA_NRO_SERIE);
          elem.setKey(KI_PR_LLEVA_NRO_SERIE);

          var elem = elem.add(null);
          elem.Id = Cairo.Database.valField(m_data.items[_i], mStockConstantes.PR_ESKIT);
          elem.setKey(KI_ES_KIT);

          var elem = elem.add(null);
          elem.Id = Cairo.Database.valField(m_data.items[_i], mStockConstantes.STI_GRUPO);
          elem.setKey(KI_GRUPO);

        }

        ////////////////////////////////////////////////////
        // Numeros de Serie
        ////////////////////////////////////////////////////

        var nroSerie = null;
        var curGroup = null;
        var nrosSerie = null;

        mCollection.collClear(m_nrosSerie);

        rs = rs.NextRecordset;

        for(var _i = 0; _i < m_data.items.length; _i += 1) {

          // Si cambie de grupo
          if(curGroup !== Cairo.Database.valField(m_data.items[_i], mStockConstantes.STI_GRUPO)) {

            pSetNrosSerieInRow(curGroup, nrosSerie);
            nrosSerie = "";

            curGroup = Cairo.Database.valField(m_data.items[_i], mStockConstantes.STI_GRUPO);
            coll = new Collection();
            m_nrosSerie.Add(coll, GetKey(curGroup));
          }

          // Guardo el numero de serie
          nroSerie = new cProductoSerieType();
          nroSerie.setCodigo(Cairo.Database.valField(m_data.items[_i], mStockConstantes.PRNS_CODE));
          nroSerie.setDescrip(Cairo.Database.valField(m_data.items[_i], mStockConstantes.PRNS_DESCRIP));
          nroSerie.setFechaVto(Cairo.Database.valField(m_data.items[_i], mStockConstantes.PRNS_FECHAVTO));
          nroSerie.setPrns_id(Cairo.Database.valField(m_data.items[_i], mStockConstantes.PRNS_ID));
          nroSerie.setPr_id_item(Cairo.Database.valField(m_data.items[_i], mStockConstantes.PR_ID));
          nroSerie.setKitItem(Cairo.Database.valField(m_data.items[_i], mStockConstantes.PR_NAME_COMPRA));

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

          prId = Cairo.Database.valField(m_data.items[_i], mStockConstantes.PR_ID);
          coll = Object.getCollKitInfoXPrId(prId, m_collKitInfo);

          prId = Cairo.Database.valField(m_data.items[_i], mStockConstantes.PR_ID_ITEM);

          //*TODO:** can't found type for with block
          //*With GetKitInfoItem(coll, prId)
          var w___TYPE_NOT_FOUND = GetKitInfoItem(coll, prId);
          w___TYPE_NOT_FOUND.pr_id = prId;
          w___TYPE_NOT_FOUND.Nombre = Cairo.Database.valField(m_data.items[_i], mStockConstantes.PR_NAME_COMPRA);
          w___TYPE_NOT_FOUND.Cantidad = Cairo.Database.valField(m_data.items[_i], "cantidad");
          w___TYPE_NOT_FOUND.LlevaNroSerie = Cairo.Database.valField(m_data.items[_i], mStockConstantes.PR_LLEVA_NRO_SERIE);
        }

        return true;
      };

      var load = function(id) {

        var apiPath = Cairo.Database.getAPIVersion();
        return Cairo.Database.getData("load[" + apiPath + "general/stock]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== NO_ID) {

              m_id = Cairo.Database.valField(response.data, mStockConstantes.ST_ID);
              m_numero = Cairo.Database.valField(response.data, mStockConstantes.ST_NUMERO);
              m_nrodoc = Cairo.Database.valField(response.data, mStockConstantes.ST_NRODOC);
              m_descrip = Cairo.Database.valField(response.data, mStockConstantes.ST_DESCRIP);
              m_fecha = Cairo.Database.valField(response.data, mStockConstantes.ST_FECHA);
              m_lgjId = Cairo.Database.valField(response.data, mStockConstantes.LGJ_ID);
              m_legajo = Cairo.Database.valField(response.data, mStockConstantes.LGJ_CODE);

              m_deplIdOrigen = Cairo.Database.valField(response.data, mStockConstantes.DEPL_ID_ORIGEN);
              m_depositoOrigen = Cairo.Database.valField(response.data, "Origen");
              m_deplIdDestino = Cairo.Database.valField(response.data, mStockConstantes.DEPL_ID_DESTINO);
              m_depositoDestino = Cairo.Database.valField(response.data, "Destino");

              // Lote
              //
              m_depfId = Cairo.Database.valField(response.data, mStockConstantes.DEPF_ID);

              m_sucId = Cairo.Database.valField(response.data, mStockConstantes.SUC_ID);
              m_sucursal = Cairo.Database.valField(response.data, mStockConstantes.SUC_NAME);
              m_docId = Cairo.Database.valField(response.data, mStockConstantes.DOC_ID);
              m_documento = Cairo.Database.valField(response.data, mStockConstantes.DOC_NAME);
              m_doctId = Cairo.Database.valField(response.data, mStockConstantes.DOCT_ID);
              m_creado = Cairo.Database.valField(response.data, Cairo.Constants.CREADO);
              m_modificado = Cairo.Database.valField(response.data, Cairo.Constants.MODIFICADO);
              m_modifico = Cairo.Database.valField(response.data, Cairo.Constants.MODIFICO);

              m_docEditable = Cairo.Database.valField(response.data, Cairo.Constants.DOC_EDITABLE);
              m_docEditMsg = Cairo.Database.valField(response.data, Cairo.Constants.DOCEDIT_MSG);

              // Para ver documentos auxiliares
              //
              m_idCliente = Cairo.Database.valField(response.data, mStockConstantes.ID_CLIENTE);
              m_doctIdCliente = Cairo.Database.valField(response.data, mStockConstantes.DOCT_ID_CLIENTE);

              m_docCliente = Cairo.Database.valField(response.data, "doc_cliente");

              m_taPropuesto = Cairo.Database.valField(response.data, Cairo.Constants.TA__PROPUESTO);
              m_taMascara = Cairo.Database.valField(response.data, Cairo.Constants.TA__MASCARA);

              m_lastDocId = m_docId;
              m_lastDocName = m_documento;

            }
            else {
              m_id = NO_ID;
              m_numero = 0;
              m_nrodoc = "";
              m_descrip = "";
              m_fecha = VDGetDateById(csDateEnum.cSTODAY);
              m_lgjId = NO_ID;
              m_legajo = "";

              m_deplIdOrigen = NO_ID;
              m_depositoOrigen = "";
              m_deplIdDestino = NO_ID;
              m_depositoDestino = "";

              // Lote
              //
              m_depfId = NO_ID;

              m_docId = NO_ID;
              m_documento = "";
              m_doctId = NO_ID;
              m_creado = Cairo.Constants.cSNODATE;
              m_modificado = Cairo.Constants.cSNODATE;
              m_modifico = 0;
              m_sucId = cUtil.getUser().getSuc_id();
              m_sucursal = cUtil.getUser().getSucursal();

              // Para ver documentos auxiliares
              //
              m_idCliente = NO_ID;
              m_doctIdCliente = NO_ID;

              m_docCliente = "";

              m_taPropuesto = false;
              m_taMascara = "";

              m_docId = m_lastDocId;
              m_documento = m_lastDocName;

              DocEditableGet(m_docId, m_docEditable, m_docEditMsg, csStockPrestacion.cSPRESTNEWSTOCK);
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

      var saveItems = function(id) {
        var row = null;
        var kitS = null;
        var i = null;
        var prIdKit = null;
        var nGrupoSerie = null;
        //  Utilizado para iterar por los items
        var iOrden = null;
        // Importante: Todos los items deben tener
        // un iOrden distinto y consecutivo

        //  Utilizado para identificar los kits
        var iKitOrden = null;
        // Por cada iKitOrden se genera un StockItemKit

        var _count = m_items.getProperties().item(C_ITEMS).getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = m_items.getProperties().item(C_ITEMS).getGrid().getRows().item(_i);

          // Si es un Kit tengo que agregar un stockitem por cada
          // componente que tenga el kit. y la cantidad es igual
          // a la cantidad de kits multiplicada por la cantidad
          // indicada en el componente
          //
          if(Dialogs.cell(row, KI_ES_KIT).getID()) {

            prIdKit = Dialogs.cell(row, KI_PR_ID).getID();
            iKitOrden = iKitOrden + 1;

            var _count = Object.getCollKitInfoXPrId(prIdKit, m_collKitInfo).size();
            for (var _j = 0; _j < _count; _j++) {
              kitS = Object.getCollKitInfoXPrId(prIdKit, m_collKitInfo).item(_j);

              // Cambio el pr_id para que grabe el componente
              //
              Dialogs.cell(row, KI_PR_ID).getID() === kitS.getPr_id();

              // Tengo que mover los numeros de serie que corresponda
              //
              if(!pSaveItemAux(id, iOrden, row, prIdKit, kitS.getCantidad() * Cairo.Util.val(Dialogs.cell(row, KI_CANTIDAD).getValue()), kitS.getLlevaNroSerie(), iKitOrden)) { return false; }
            }

            Dialogs.cell(row, KI_PR_ID).getID() === prIdKit;

          }
          else {

            // Item comun
            if(!pSaveItemAux(id, iOrden, row, NO_ID, 0, Dialogs.cell(row, KI_PR_LLEVA_NRO_SERIE).getID(), 0)) { return false; }
          }

        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      var pSaveItemAux = function(id, iOrden, row, prIdKit, cantidadKit, bLlevaNroSerie, iKitOrden) { // TODO: Use of ByRef founded Private Function pSaveItemAux(ByVal Id As Long, ByRef iOrden As Long, ByRef Row As cIABMGridRow, ByVal PrIdKit As Long, ByVal CantidadKit As Long, ByVal bLlevaNroSerie As Boolean, ByVal iKitOrden As Long) As Boolean
        var i = null;
        var register = null;
        var oRow = null;
        var cell = null;
        var cantidad = null;

        // Para las filas nuevas tengo que convertirla en dos
        // una salida y otra destino
        for (i = 1; i <= 2; i++) {

          oRow = row;

          register = new cRegister();
          register.setFieldId(mStockConstantes.STI_TMPID);
          register.setTable(mStockConstantes.STOCKITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KI_STI_ID:
                if(m_copy) {
                  fields.add(mStockConstantes.STI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(mStockConstantes.STI_ID, Cairo.Util.val(cell.getValue()), Types.integer);
                }
                break;

              case KI_DESCRIP:
                fields.add(mStockConstantes.STI_DESCRIP, cell.getValue(), Types.text);
                break;

              case KI_PR_ID:
                fields.add(mStockConstantes.PR_ID, cell.getId(), Types.id);

                // Lote
                //
                break;

              case KI_STL_ID:
                fields.add(mStockConstantes.STL_ID, cell.getId(), Types.id);

                break;
            }
          }

          // Kits
          if(prIdKit !== NO_ID) {
            fields.add(mStockConstantes.PR_ID_KIT, prIdKit, Types.id);
            fields.add(mStockConstantes.STIK_ORDEN, iKitOrden, Types.integer);
            fields.add(mStockConstantes.STIK_CANTIDAD, Cairo.Util.val(Dialogs.cell(row, KI_CANTIDAD).getValue()), Types.double);
          }

          fields.add(mStockConstantes.ST_TMPID, id, Types.id);

          // Si es el primero de esta dupla va Origen
          //
          if(i === 1) {

            // Si es un kit tengo que enviar tantos numeros de serie
            // como indica CantidadKit
            //
            if(prIdKit !== NO_ID) {
              cantidad = cantidadKit;
            }
            else {
              cantidad = Cairo.Util.val(Dialogs.cell(row, KI_CANTIDAD).getValue());
            }

            fields.add(mStockConstantes.DEPL_ID, m_dialog.getProperties().item(mStockConstantes.DEPL_ID_ORIGEN).getSelectId(), Types.id);

            // Salida
            //
            if(!pSaveItemNroSerie(cantidad, row, register, iOrden, csEItOrigen, bLlevaNroSerie)) { return false; }

            // Solo me queda que sea el segundo, osea el destino
            //
          }
          else {
            fields.add(mStockConstantes.DEPL_ID, m_dialog.getProperties().item(mStockConstantes.DEPL_ID_DESTINO).getSelectId(), Types.id);

            // Ingreso
            //
            if(!pSaveItemNroSerie(cantidad, row, register, iOrden, csEItDestino, bLlevaNroSerie)) { return false; }
          }
        }

        return true;
      };

      // Reglas del Objeto de Negocios
      var pSetDataProducto = function(row, pr_id) { // TODO: Use of ByRef founded Private Sub pSetDataProducto(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal pr_id As Long)
        var sqlstmt = null;
        var rs = null;
        var bEsKit = null;

        var bChanged = null;

        bChanged = pr_id !== Dialogs.cell(row, KI_PR_ID).getID();

        sqlstmt = "sp_StockProductoGetData "+ pr_id.toString();

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(!rs.isEOF()) {
          bEsKit = Cairo.Database.valField(rs.getFields(), mStockConstantes.PR_ESKIT);

          Dialogs.cell(row, KI_UNIDAD).getValue() === Cairo.Database.valField(rs.getFields(), mStockConstantes.UN_NAME);
          Dialogs.cell(row, KI_PR_LLEVA_NRO_SERIE).getID() === Cairo.Database.valField(rs.getFields(), mStockConstantes.PR_LLEVA_NRO_SERIE);
          Dialogs.cell(row, KI_ES_KIT).getID() === bEsKit;

          // Lote
          //
          Dialogs.cell(row, KI_PR_LLEVA_LOTE).getID() === Cairo.Database.valField(rs.getFields(), mStockConstantes.PR_LLEVA_NRO_LOTE);

          if(bEsKit) {

            var coll = null;

            sqlstmt = "sp_StockProductoGetKitInfo "+ pr_id.toString();
            if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

            coll = Object.getCollKitInfoXPrId(pr_id, m_collKitInfo);

            while (!rs.isEOF()) {
              pr_id = Cairo.Database.valField(rs.getFields(), mStockConstantes.PR_ID);
              //*TODO:** can't found type for with block
              //*With GetKitInfoItem(coll, pr_id)
              var w___TYPE_NOT_FOUND = GetKitInfoItem(coll, pr_id);
              w___TYPE_NOT_FOUND.pr_id = pr_id;
              w___TYPE_NOT_FOUND.Nombre = Cairo.Database.valField(rs.getFields(), mStockConstantes.PR_NAME_COMPRA);
              w___TYPE_NOT_FOUND.Cantidad = Cairo.Database.valField(rs.getFields(), "cantidad");
              w___TYPE_NOT_FOUND.LlevaNroSerie = Cairo.Database.valField(rs.getFields(), mStockConstantes.PR_LLEVA_NRO_SERIE);
              rs.MoveNext;
            }
          }
        }

        // Si cambio el producto borro los numeros de serie
        //
        if(bChanged || Dialogs.cell(row, KI_PR_LLEVA_NRO_SERIE).getID() === 0) {

          Dialogs.cell(row, KI_NRO_SERIE).getValue() === "";
          if(ExistsObjectInColl(m_nrosSerie, GetKey(Dialogs.cell(row, KI_GRUPO).getID()))) {

            m_nrosSerie.remove(GetKey(Dialogs.cell(row, KI_GRUPO).getID()));
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
        for (var _i = 0; _i < _count; _i++) {
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
        for (var _i = 0; _i < _count; _i++) {
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

        doc_id = m_dialog.getProperties().item(mStockConstantes.DOC_ID).getSelectId();

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
              GetDocNumber(m_lastDocId, m_dialog, m_taPropuesto, mStockConstantes.ST_NRODOC);
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

        c = properties.item(mStockConstantes.DOC_ID);
        c.setSelectId(m_docId);
        c.setValue(m_documento);

        c = properties.item(mStockConstantes.ST_FECHA);
        c.setValue(m_fecha);

        c = properties.item(cDeclarations.getCsDocNumberID());
        c.setValue(m_numero);

        c = properties.item(mStockConstantes.ST_NRODOC);
        c.setValue(m_nrodoc);
        c.setTextMask(m_taMascara);
        c.setTextAlign(vbRightJustify);

        c = properties.item(mStockConstantes.DEPL_ID_ORIGEN);
        c.setSelectId(m_deplIdOrigen);
        c.setValue(m_depositoOrigen);

        c = properties.item(mStockConstantes.DEPL_ID_DESTINO);
        c.setSelectId(m_deplIdDestino);
        c.setValue(m_depositoDestino);

        c = properties.item(mStockConstantes.SUC_ID);
        c.setSelectId(m_sucId);
        c.setValue(m_sucursal);

        c = properties.item(mStockConstantes.ST_DOC_CLIENTE);
        c.setValue(m_docCliente);

        c = properties.item(mStockConstantes.LGJ_ID);
        c.setSelectId(m_lgjId);
        c.setValue(m_legajo);

        c = properties.item(mStockConstantes.ST_DESCRIP);
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

          m_nrosSerie = new Collection();
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
          mCollection.collClear(m_nrosSerie);
          m_nrosSerie = null;

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
      var pSaveItemNroSerie = function(cantidad, row, register, iOrden, iType, bLlevaNroSerie) { // TODO: Use of ByRef founded Private Function pSaveItemNroSerie(ByVal Cantidad As Long, ByRef Row As CSInterfacesABM.cIABMGridRow, ByRef register As cRegister, ByRef iOrden As Long, ByVal iType As csEStiItemType, ByVal bLlevaNroSerie As Boolean) As Boolean
        var grupo = null;
        var pt = null;
        var registerSerie = null;
        var fld = null;
        var prIdItem = null;
        var n = null;

        // Si lleva numero de serie
        //
        if(bLlevaNroSerie) {

          grupo = Dialogs.cell(row, KI_GRUPO).getID();

          if(Dialogs.cell(row, KI_ES_KIT).getID()) {
            prIdItem = Dialogs.cell(row, KI_PR_ID).getID();
          }

          // Obtengo los numeros de serie y guardo un Item por cada uno
          //
          var _count = m_nrosSerie.get(GetKey(grupo)).size();
          for (var _i = 0; _i < _count; _i++) {
            pt = m_nrosSerie.get(GetKey(grupo)).item(_i);

            // Solo los numeros de serie de este item si es que
            // estamos en un kit, sino todos los numeros de serie
            //                                                       ' Por ultimo solo envio
            //                                                       ' la cantidad indicada
            if((prIdItem === pt.getPr_id_item() || prIdItem === NO_ID) && n < cantidad) {

              n = n + 1;

              registerSerie = new cRegister();

              // Copio la cabecera
              //
              registerSerie.setFieldId(register.getFieldId());
              registerSerie.setTable(register.getTable());
              registerSerie.setId(register.getID());

              var w_fields = registerSerie.getFields();
              var _count = register.getFields().size();
              for (var _j = 0; _j < _count; _j++) {
                fld = register.getFields().item(_j);
                w_fields.add(fld);
              }

              // Si es nuevo lo pongo en positivo
              if(grupo < 0) {
                w_fields.add2(mStockConstantes.STI_GRUPO, grupo * -1, Types.integer);
              }
              else {
                w_fields.add2(mStockConstantes.STI_GRUPO, grupo, Types.integer);
              }

              w_fields.add2(mStockConstantes.PRNS_ID, pt.getPrns_id(), Types.id);
              w_fields.add2(mStockConstantes.PRNS_DESCRIP, pt.getDescrip(), Types.text);
              w_fields.add2(mStockConstantes.PRNS_FECHAVTO, pt.getFechaVto(), Types.date);

              switch (iType) {
                case csEItOrigen:
                  w_fields.add2(mStockConstantes.STI_SALIDA, 1, Types.double);
                  break;

                case csEItDestino:
                  w_fields.add2(mStockConstantes.STI_INGRESO, 1, Types.double);
                  break;
              }

              iOrden = iOrden + 1;
              w_fields.add2(mStockConstantes.STI_ORDEN, iOrden, Types.integer);

              w_fields.setHaveLastUpdate(false);
              w_fields.setHaveWhoModify(false);

              if(!Cairo.Database.save(registerSerie, , "pSaveItemNroSerie", C_MODULE, c_ErrorSave)) { return false; }
            }
          }

        }
        else {

          // Si antes el articulo llevaba numero de serie
          // tengo que borrar los items asociados a dichos numeros de serie
          //
          if(Dialogs.cell(row, KI_GRUPO).getID()) {
            // TODO: Borrar items de numeros de serie
          }

          switch (iType) {
            case csEItOrigen:
              fields.add(mStockConstantes.STI_SALIDA, cantidad, Types.double);
              break;

            case csEItDestino:
              fields.add(mStockConstantes.STI_INGRESO, cantidad, Types.double);
              break;
          }

          iOrden = iOrden + 1;
          fields.add(mStockConstantes.STI_ORDEN, iOrden, Types.integer);

          register.getFields().setHaveLastUpdate(false);
          register.getFields().setHaveWhoModify(false);

          if(!Cairo.Database.save(register, , "pSaveItemNroSerie", C_MODULE, c_ErrorSave)) { return false; }

        }

        return true;
      };

      var pSetNrosSerieInRow = function(currGroup, nroSerie) {
        var row = null;

        if(currGroup === 0) { return; }

        var _count = m_items.getProperties().item(C_ITEMS).getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = m_items.getProperties().item(C_ITEMS).getGrid().getRows().item(_i);
          if(Dialogs.cell(row, KI_GRUPO).getID() === currGroup) {
            Dialogs.cell(row, KI_NRO_SERIE).getValue() === RemoveLastColon(nroSerie);
            return;
          }
        }
      };

      var getDeplId = function() {
        return m_dialog.getProperties().item(mStockConstantes.DEPL_ID_ORIGEN).getSelectId();
      };

      var pGetDeplIdDestino = function() {
        return m_dialog.getProperties().item(mStockConstantes.DEPL_ID_DESTINO).getSelectId();
      };

      var pGetDeplDestino = function() {
        return m_dialog.getProperties().item(mStockConstantes.DEPL_ID_DESTINO);
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

          var elem = w_rows.add(null);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.STI_ID);
          elem.Key = KI_STI_ID;

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.DEPL_ID);
          elem.Key = KI_DEPL_ID;

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.PR_NAME_COMPRA);
          elem.Id = Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.PR_ID);
          elem.Key = KI_PR_ID;

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.STI_DESCRIP);
          elem.Key = KI_DESCRIP;

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.STI_SALIDA);
          elem.Key = KI_CANTIDAD;

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.UN_NAME);
          elem.Key = KI_UNIDAD;

          var elem = elem.add(null);
          elem.Value = "";
          elem.Key = KI_NRO_SERIE;

          // Lote
          //
          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.STL_CODE);
          elem.Id = Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.STL_ID);
          elem.Key = KI_STL_ID;

          // Lote
          //
          var elem = elem.add(null);
          elem.Id = Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.PR_LLEVA_NRO_LOTE);
          elem.Key = KI_PR_LLEVA_LOTE;

          var elem = elem.add(null);
          elem.Id = Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.PR_LLEVA_NRO_SERIE);
          elem.Key = KI_PR_LLEVA_NRO_SERIE;

          var elem = elem.add(null);
          elem.Id = Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.PR_ESKIT);
          elem.Key = KI_ES_KIT;

          var elem = elem.add(null);
          elem.Id = Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.STI_GRUPO);
          elem.Key = KI_GRUPO;

        }

        ////////////////////////////////////////////////////
        // Numeros de Serie
        ////////////////////////////////////////////////////

        var nroSerie = null;
        var curGroup = null;
        var nrosSerie = null;

        mCollection.collClear(m_nrosSerie);

        rs = rs.NextRecordset;

        for(var _i = 0; _i < m_data.compensar.length; _i += 1) {

          // Si cambie de grupo
          if(curGroup !== Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.STI_GRUPO)) {

            pSetNrosSerieInRow(curGroup, nrosSerie);
            nrosSerie = "";

            curGroup = Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.STI_GRUPO);
            coll = new Collection();
            m_nrosSerie.Add(coll, GetKey(curGroup));
          }

          // Guardo el numero de serie
          nroSerie = new cProductoSerieType();
          nroSerie.setCodigo(Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.PRNS_CODE));
          nroSerie.setDescrip(Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.PRNS_DESCRIP));
          nroSerie.setFechaVto(Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.PRNS_FECHAVTO));
          nroSerie.setPrns_id(Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.PRNS_ID));
          nroSerie.setPr_id_item(Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.PR_ID));
          nroSerie.setKitItem(Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.PR_NAME_COMPRA));

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

        for(var _i = 0; _i < m_data.compensar.length; _i += 1) {

          prId = Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.PR_ID);
          coll = Object.getCollKitInfoXPrId(prId, m_collKitInfo);

          prId = Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.PR_ID_ITEM);

          //*TODO:** can't found type for with block
          //*With GetKitInfoItem(coll, prId)
          var w___TYPE_NOT_FOUND = GetKitInfoItem(coll, prId);
          w___TYPE_NOT_FOUND.pr_id = prId;
          w___TYPE_NOT_FOUND.Nombre = Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.PR_NAME_COMPRA);
          w___TYPE_NOT_FOUND.Cantidad = Cairo.Database.valField(m_data.compensar[_i], "cantidad");
          w___TYPE_NOT_FOUND.LlevaNroSerie = Cairo.Database.valField(m_data.compensar[_i], mStockConstantes.PR_LLEVA_NRO_SERIE);
        }

        var abmGen = null;
        abmGen = m_items;
        abmGen.ShowValues(m_items.getProperties());

        return true;
      };

      var setStock = function() {

        if(Cairo.getStockConfig().getStockXFisico() || Cairo.getStockConfig().getNoControlaStock()) {

          m_depfId = NO_ID;

          if(!Cairo.Database.getData(mStockConstantes.DEPOSITOLOGICO, mStockConstantes.DEPL_ID, getDeplId(), mStockConstantes.DEPF_ID, m_depfId)) {
          }
        }

      };

      var pGetDepositoInternoName = function() {
        var deplNombre = null;
        if(!Cairo.Database.getData(mStockConstantes.DEPOSITOLOGICO, mStockConstantes.DEPL_ID, -2, mStockConstantes.DEPL_NAME, deplNombre)) { return ""; }
        return deplNombre;
      };

      var pGetDocIsConsumo = function() {
        var isConsumo = null;
        var docId = null;

        docId = pGetDocId();
        if(docId === NO_ID) { return false; }

        if(!Cairo.Database.getData(mStockConstantes.DOCUMENTO, mStockConstantes.DOC_ID, docId, mStockConstantes.DOC_ST_CONSUMO, isConsumo)) { return false; }
        return isConsumo;
      };

      var pIsDocAux = function() {
        if(m_id === NO_ID) { return false; }

        var idCliente = null;
        if(!Cairo.Database.getData(mStockConstantes.STOCK, mStockConstantes.ST_ID, m_id, mStockConstantes.ID_CLIENTE, idCliente)) { return false; }
        return idCliente !== NO_ID;
      };

      var pGetDocId = function() {
        return m_dialog.getProperties().item(mStockConstantes.DOC_ID).getSelectId();
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

        c = m_dialog.getProperties().add(null, mStockConstantes.DOC_ID);
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
        c.setSelectFilter("'{emp_id=0}doct_id = "+ csEDocumentoTipo.cSEDT_TRASFERENCIASTOCK.toString()+ "'");

        c = m_dialog.getProperties().add(null, mStockConstantes.SUC_ID);
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

        c = m_dialog.getProperties().add(null, mStockConstantes.LGJ_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(mStockConstantes.cSLEGAJO);
        // Legajo
        c.setName(getText(1575, ""));
        c.setKey(K_LGJ_ID);
        value = m_legajo;
        if(m_lgjId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(mStockConstantes.cSLEGAJO, Cairo.Util.val(m_lgjId.Substring(2)), bExists);
          if(!bExists) { m_lgjId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_lgjId));
        c.setSelectIntValue(m_lgjId);


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
            var property = m_dialog.getProperties().item(mStockConstantes.DOC_ID);
            m_documento = property.getValue();
            m_docId = property.getSelectIntValue();

            break;

          case K_SUC_ID:
            var property = m_dialog.getProperties().item(mStockConstantes.SUC_ID);
            m_sucursal = property.getValue();
            m_sucId = property.getSelectIntValue();

            break;

          case K_LGJ_ID:
            var property = m_dialog.getProperties().item(mStockConstantes.LGJ_ID);
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