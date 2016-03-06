(function() {
  "use strict";

  Cairo.module("RubroTabla.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;
      var P = Cairo.Promises;
      var getValue = DB.getValue;
      var M = Cairo.Modal;
      var valEmpty = Cairo.Util.valEmpty;
      var Types = Cairo.Constants.Types;
      var val = Cairo.Util.val;

      var C_MODULE = "cRubroTabla";
      var C_ITEMS = "Items";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_DESCRIP = 3;
      var K_ACTIVE = 4;

      var K_ITEMS = 5;

      var K_RUBTI_ID_FILTER = 17;
      var K_CMD_FILTER = 18;

      var KI_RUBTI_ID = 1;
      var KI_NOMBRE = 3;
      var KI_CODIGO = 4;
      var KI_DESCRIP = 5;

      var c_ErrorSave = "";

      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_descrip = "";
      var m_active;

      var m_editing;

      var m_dialog;
      var m_listController = null;

      var m_isNew;

      var m_branchId = 0;
      var m_treeId = 0;
      var m_copy;

      var m_apiPath = DB.getAPIVersion();

      var m_wasChanged;

      var m_itemsDeletedItems = "";

      var emptyData = {
        items: []
      };

      var m_data = emptyData;

      self.getId = function() {
        return m_id;
      };

      self.getName = function() {
        return m_name;
      };

      self.getCode = function() {
        return m_code;
      };


      self.copy = function() {

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, NO_ID);

        var property = m_dialog.getProperties().item(C.RUBT_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(C.RUBT_CODE));
        m_dialog.showValue(m_dialog.getProperties().item(C.RUBT_NAME));

        m_copy = true;
      };

      self.editNew = function() {

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, NO_ID);

        return load(NO_ID).then(
          function() {
            Cairo.navigate(self.getPath());
            return refreshCollection();
          }
        );
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

          doc.setClientTable(C.RUBRO_TABLA);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, Cairo.Constants.SHOW_DOCUMENTS_FUNCTION, C_MODULE, "");
        }

        return _rtn;
      };


      self.messageEx = function(messageId, info) {
        var _rtn = null;
        var p = null;

        switch (messageId) {

          case Dialogs.Message.MSG_DOC_INFO:

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_RUBRO_TABLA);
            _rtn = Dialogs.Message.MSG_DOC_INFO_HANDLED;
            break;

          case Dialogs.Message.MSG_GRID_VIRTUAL_ROW:

            p = P.resolvedPromise(info);
            break;

          default:
            _rtn = true;
            break;
        }

        return p || P.resolvedPromise(_rtn);
      };

      self.discardChanges = function() {
        return P.resolvedPromise(refreshCollection());
      };

      self.propertyChange = function(key) {
        var p = null;
        switch (key) {
          case K_CMD_FILTER:
            p = showItems();
            break;
        }
        return p || P.resolvedPromise(false);
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.RUBT_ID);
        register.setTable(C.RUBRO_TABLA);

        var m_apiPath = DB.getAPIVersion();
        register.setPath(m_apiPath + "general/rubrotabla");

        if(m_copy) {
          register.setId(Cairo.Constants.NEW_ID);
        }
        else {
          register.setId(m_id);
        }

        var _count = m_dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {
          var property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NAME:
              fields.add(C.RUBT_NAME, property.getValue(), Types.text);
              break;

            case K_CODE:
              fields.add(C.RUBT_CODE, property.getValue(), Types.text);
              break;

            case K_DESCRIP:
              fields.add(C.RUBT_DESCRIP, property.getValue(), Types.text);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, property.getValue(), Types.boolean);

              break;
          }
        }

        saveItems(register);

        return Cairo.Database.saveEx(
            register,
            false,
            C.PRO_CODE,
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            getText(1457, "")).then(

          function(result) {
            if(result.success) {
              m_copy = false;
              return load(result.data.getId()).then(
                function (success) {
                  if(success) {
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
            else {
              return false;
            }
          });
      };

      var updateList = function() {
        if(m_id === NO_ID) { return; }
        if(m_listController === null) { return; }

        if(m_isNew) {
          m_listController.addLeave(m_id, m_branchId);
        }
        else {
          m_listController.refreshBranch(m_id, m_branchId);
        }
      };

      self.getPath = function() {
        return "#general/rubrotabla/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "rubrotabla" + id;
      };

      self.getTitle = function() {
        return Cairo.Language.getText(1454, ""); // Tabla de Rubros
      };

      self.validate = function() {
        var property = null;

        var _count = m_dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NAME:
              if(Cairo.Util.valEmpty(property.getValue(), Types.text)) {
                return Cairo.Modal.showInfoWithFalse(Cairo.Constants.MUST_SET_A_NAME);
              }
              break;

            case K_CODE:
              if(Cairo.Util.valEmpty(property.getValue(), Types.text)) {
                property.setValue(Cairo.Constants.GET_CODE_FROM_ID);
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      self.setTreeId = function(rhs) {
        m_treeId = rhs;
      };

      self.getTreeId = function() {
        return m_treeId;
      };

      self.list = function() {
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_RUBRO_TABLA);
      };

      self.getDialog = function() {
        return m_dialog;
      };

      self.setDialog = function(rhs) {
        m_dialog = rhs;
      };

      self.isEditing = function() {
        return m_editing;
      };

      self.edit = function(id, inModalWindow) {
        var p = P.resolvedPromise(false);
        try {

          if(id === NO_ID) {
            m_isNew = true;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_RUBRO_TABLA)) { return p; }
          }
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_RUBRO_TABLA)) { return p; }
          }

          m_dialog.setInModalWindow(inModalWindow);

          p = load(id).then(
            function(success) {
              if(success) {

                if(!loadCollection()) { return false; }

                m_editing = true;
                m_copy = false;

                if(inModalWindow) {
                  success = m_id !== NO_ID;
                }
                else {
                  success = true;
                }

              }
              return success;
            });
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, Cairo.Constants.EDIT_FUNCTION, C_MODULE, "");
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

      var loadCollection = function() {

        var w_tabs = m_dialog.getTabs();

        w_tabs.clear();

        var tab = w_tabs.add(null);
        tab.setName(Cairo.Constants.TAB_GENERAL);

        var tab = w_tabs.add(null);
        tab.setIndex(1);
        tab.setName(C_ITEMS);

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();
        properties.clear();

        var elem = properties.add(null, C.RUBT_NAME);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(50);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        var elem = properties.add(null, C.RUBT_CODE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setSize(10);
        elem.setKey(K_CODE);
        elem.setValue(m_code);

        var elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        var elem = properties.add(null, C.RUBT_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setSize(255);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);

        var elem = properties.add(null, C.RUBTI_ID);
        elem.setName(Cairo.Language.getText(3089, "")); // Codigos
        elem.setType(Dialogs.PropertyType.text);
        elem.setTabIndex(1);
        elem.setIsEditProperty(false);
        elem.setKey(K_RUBTI_ID_FILTER);

        var elem = properties.add(null, "cmdFilter");
        elem.setType(Dialogs.PropertyType.button);
        elem.setName("Filtrar");
        elem.setTabIndex(1);
        elem.setKey(K_CMD_FILTER);

        elem = properties.add(null, C_ITEMS);
        elem.setType(Dialogs.PropertyType.grid);
        elem.hideLabel();
        setGridItems(elem);
        loadItems(elem);
        elem.setName(C_ITEMS);
        elem.setKey(K_ITEMS);
        elem.setTabIndex(1);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_itemsDeletedItems = "";

        if(!m_dialog.show(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(C.RUBT_NAME);
        elem.setValue(m_name);

        var elem = properties.item(C.RUBT_CODE);
        elem.setValue(m_code);

        var elem = properties.item(Cairo.Constants.ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        var elem = properties.item(C.RUBT_DESCRIP);
        elem.setValue(m_descrip);

        return m_dialog.showValues(properties);
      };

      var loadDataFromResponse = function(response) {
        var data = response.data;

        data.items = data.get('items');

        return data;
      };

      var load = function(id) {

        m_data = emptyData;

        return DB.getData("load[" + m_apiPath + "general/rubrotabla]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id === NO_ID) {
              m_id = NO_ID;
              m_name = "";
              m_code = "";
              m_descrip = "";
              m_active = true;
            }
            else {

              m_data = loadDataFromResponse(response);

              m_id = DB.valField(response.data, C.RUBT_ID);
              m_name = DB.valField(response.data, C.RUBT_NAME);
              m_code = DB.valField(response.data, C.RUBT_CODE);
              m_descrip = DB.valField(response.data, C.RUBT_DESCRIP);
              m_active = DB.valField(response.data, Cairo.Constants.ACTIVE);
            }

            return true;
          });
      };

      //
      // grid
      //

      self.columnAfterEdit = function(key, lRow, lCol, newValue, newValueId) {
        return P.resolvedPromise(true);
      };

      self.columnBeforeEdit = function(key, lRow, lCol, iKeyAscii) {
        return P.resolvedPromise(true);
      };

      self.columnButtonClick = function(key, lRow, lCol, iKeyAscii) {

      };

      self.deleteRow = function(key, row, lRow) {

        var id = Cairo.Util.val(Dialogs.cell(row, KI_RUBTI_ID).getValue());

        if(id !== NO_ID) { m_itemsDeletedItems = m_itemsDeletedItems + id.toString()+ ","; }

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
              p = validateRowItems(row, rowIndex);
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.VALIDATE_ROW_FUNCTION, C_MODULE, "");
        }

        return p || P.resolvedPromise(false);
      };

      self.columnAfterUpdate = function(key, lRow, lCol) {
        switch (key) {
          case K_ITEMS:
            m_wasChanged = true;
            break;
        }
        return P.resolvedPromise(true);
      };

      self.columnClick = function(key, lRow, lCol) {

      };

      self.gridDblClick = function(key, lRow, lCol) {
        return P.resolvedPromise(false);
      };

      self.isEmptyRow = function(key, row, rowIndex) {
        var isEmpty = true;

        try {

          switch (key) {
            case K_ITEMS:
              isEmpty = isEmptyRowItems(row, rowIndex);
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.IS_EMPTY_ROW_FUNCTION, C_MODULE, "");
        }

        return P.resolvedPromise(isEmpty);
      };

      var saveItems = function(mainTransaction) {
        var transaction = new DB.createTransaction();
        transaction.setTable(C.RUBRO_TABLA_ITEM);

        var property = m_dialog.getProperties().item(C_ITEMS);

        var rows = property.getGrid().getRows();
        var _count = rows.size();
        for(var _i = 0; _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();

          var fields = register.getFields();
          register.setFieldId(C.RUBTI_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var _countj = row.size();
          for(var _j = 0; _j < _countj; _j++) {

            var cell = row.item(_j);

            switch (cell.getKey()) {

              case KI_RUBTI_ID:
                if(m_copy) {
                  fields.add(C.RUBTI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(C.RUBTI_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KI_NOMBRE:
                fields.add(C.RUBTI_NAME, cell.getValue(), Types.text);
                break;

              case KI_CODIGO:
                fields.add(C.RUBTI_CODE, cell.getValue(), Types.text);
                break;

              case KI_DESCRIP:
                fields.add(C.RUBTI_DESCRIP, cell.getValue(), Types.text);
                break;
            }
          }

          fields.add(C.RUBT_ID, m_id, Types.id);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedItems !== "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedItems);
        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      var loadItemFromTheServer = function() {
        var properties = m_dialog.getProperties();
        var filter = properties.item(C.RUBTI_ID).getValue();

        m_data = emptyData;

        return DB.getData("load[" + m_apiPath + "general/rubrotabla/items]", filter).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== NO_ID) {
              m_data = loadDataFromResponse(response);
            }

            return true;
          });
      };

      var setGridItems = function(property) {

        m_wasChanged = false;

        var elem;
        var grid = property.getGrid();

        var columns = grid.getColumns();
        columns.clear();

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_RUBTI_ID);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KI_NOMBRE);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KI_CODIGO);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KI_DESCRIP);

        grid.getRows().clear();
      };

      var loadItems = function(property) {

        var grid = property.getGrid();
        var rows = grid.getRows();

        for(var _i = 0; _i < m_data.items.length; _i += 1) {

          var row = rows.add(null, getValue(m_data.items[_i], C.RUBTI_ID));

          var elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], C.RUBTI_ID));
          elem.setKey(KI_RUBTI_ID);

          var elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], C.RUBTI_NAME));
          elem.setKey(KI_NOMBRE);

          var elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], C.RUBTI_CODE));
          elem.setKey(KI_CODIGO);

          var elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], C.RUBTI_DESCRIP));
          elem.setKey(KI_DESCRIP);

        }
      };

      var validateRowItems = function(row, rowIndex) {
        var cell = null;
        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_NOMBRE:
              if(valEmpty(cell.getValue(), Types.text)) {
                return M.showInfoWithFalse(Cairo.Constants.MUST_SET_A_NAME + strRow);
              }
              break;

            case KI_CODIGO:
              if(valEmpty(cell.getValue(), Types.text)) {
                return M.showInfoWithFalse(Cairo.Constants.MUST_SET_A_CODE + strRow);
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var isEmptyRowItems = function(row, rowIndex) {

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {
            case KI_NOMBRE:
              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;

            case KI_CODIGO:
              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;

            case KI_DESCRIP:
              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var showItems = function() {
        var p = null;
        
        if(m_wasChanged) {
          
          // Ud. ha modificado la lista de artículos, si continúa perderá estos cambios.;; & _
          // 'NO' y luego el boton 'Guardar'.;; & _
          // Para(conservarlos presione el boton);
          // ¿Descarta(los cambios?.);
          //
          p = M.confirmViewNoDefault(
              "",
              getText(3560, "")
            ).then(
            function(answer) {
              if(answer === "yes") {
                var prop = m_dialog.getProperties().item(C_ITEMS);
                loadItemFromTheServer().whenSuccessWithResult(function() {
                  loadItems(prop);
                  m_dialog.showValue(prop);
                  return false;
                });                
              }
            }
          );
        }

        return p || P.resolvedPromise(false);
      };

      //
      // initialization and termination
      //

      var destroy = function() {
        m_dialog = null;
        m_listController = null;
      };

      self.terminate = function() {

        m_editing = false;

        try {
          if(m_listController !== null) {
            updateList();
            m_listController.removeEditor(self);
          }
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "terminate", C_MODULE, "");
        }

        try {
          destroy();
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "terminate", C_MODULE, "");
        }
      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

    Edit.Controller.edit = function(id) {
      var editor = Cairo.RubroTabla.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit(id);
    };

  });

  Cairo.module("RubroTabla.List", function(List, Cairo, Backbone, Marionette, $, _) {

    var NO_ID = Cairo.Constants.NO_ID;

    List.Controller = {
      list: function() {

        var self = this;
        var m_apiPath = Cairo.Database.getAPIVersion();

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.rubroTablaEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.rubroTablaEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Tablas de Rubro",
            entityName: "tabla de rubro",
            entitiesName: "tablas de rubro"
          });

          self.showBranch = function(branchId) {
            Cairo.log("Loading nodeId: " + branchId);
            Cairo.Tree.List.Controller.listBranch(branchId, Cairo.Tree.List.Controller.showItems, self);
          };

          self.addLeave = function(id, branchId) {
            try {
              Cairo.Tree.List.Controller.addLeave(branchId, id, self);
            }
            catch(ignore) {
              Cairo.log("Error when adding this item to the branch\n\n" + ignore.message);
            }
          };

          self.refreshBranch = function(id, branchId) {
            try {
              Cairo.Tree.List.Controller.refreshBranchIfActive(branchId, id, self);
            }
            catch(ignore) {
              Cairo.log("Error when refreshing a branch\n\n" + ignore.message);
            }
          };

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

          self.edit = function(id, treeId, branchId) {
            var key = getKey(id);
            if(editors.contains(key)) {
              editors.item(key).dialog.showDialog();
            }
            else {
              var editor = Cairo.RubroTabla.Edit.Controller.getEditor();
              var dialog = Cairo.Dialogs.Views.Controller.newDialog();

              editor.setTree(self);
              editor.setDialog(dialog);
              editor.setTreeId(treeId);
              editor.setBranchId(branchId);
              editor.edit(id);

              editors.add({editor: editor, dialog: dialog}, key);
            }
          };

          self.destroy = function(id, treeId, branchId) {
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_RUBRO_TABLA)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            return Cairo.Database.destroy(m_apiPath + "general/rubrotabla", id, Cairo.Constants.DELETE_FUNCTION, "Rubro").whenSuccess(
              function() {
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
              }
            );
          };

          // progress message
          //
          Cairo.LoadingMessage.show("Tablas de Rubro", "Loading Tablas de Rubro from CrowSoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ rubroTablaTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.TABLAS_DE_RUBROS,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.rubroTablaTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("Tablas de Rubro", "rubroTablaTreeRegion", "#general/rubrotablas", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());