(function() {
  "use strict";

  Cairo.module("Rol.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var P = Cairo.Promises;
      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;
      var valField = DB.valField;
      var getValue = DB.getValue;
      var M = Cairo.Modal;
      var valEmpty = Cairo.Util.valEmpty;
      var Types = Cairo.Constants.Types;
      var bToI = Cairo.Util.boolToInt;

      var C_MODULE = "cUsuario";

      var C_USUARIOS = "Usuarios";

      var K_NAME = 1;
      var K_ACTIVE = 3;
      var K_DESCRIP = 7;
      var K_USUARIOS = 14;

      var KI_US_ID = 2;

      var m_id = 0;
      var m_name = "";
      var m_descrip = "";
      var m_active;

      var m_editing;

      var m_dialog;
      var m_listController = null;

      var m_branchId = 0;
      var m_treeId = 0;

      var m_copy;
      var m_isNew;

      var m_itemsDeletedUsuarios = "";

      var m_apiPath = DB.getAPIVersion();

      var emptyData = {
        usuarios: []
      };

      var m_data = emptyData;

      self.getId = function() {
        return m_id;
      };

      self.getName = function() {
        return m_name;
      };

      self.getCode = function() {
        return m_name;
      };

      self.copy = function() {

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, NO_ID);

        var property = m_dialog.getProperties().item(C.ROL_NAME);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(C.ROL_NAME));

        m_copy = true;
      };

      self.editNew = function() {

        updateList();

        m_isNew = true;

        if(m_listController !== null) {
          m_listController.updateEditorKey(self, NO_ID);
        }

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
        var _rtn = false;
        try {

          if(m_id === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(C.USUARIO);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.SHOW_DOCUMENTS_FUNCTION, C_MODULE, "");
        }

        return _rtn;
      };


      self.messageEx = function(messageId, info) {
        var _rtn = null;
        var p = null;

        switch (messageId) {

          case Dialogs.Message.MSG_DOC_INFO:

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_USUARIO);
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
        return Cairo.Promises.resolvedPromise(refreshCollection());
      };

      self.propertyChange = function(key) {
        return Cairo.Promises.resolvedPromise(false);
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.ROL_ID);
        register.setTable(C.ROL);

        register.setPath(m_apiPath + "general/rol");

        if(m_copy) {
          register.setId(Cairo.Constants.NEW_ID);
        }
        else {
          register.setId(m_id);
        }

        var properties = m_dialog.getProperties();
        var _count = properties.size();
        for(var _i = 0; _i < _count; _i++) {
          var property = properties.item(_i);
          switch (property.getKey()) {
            case K_NAME:
              fields.add(C.ROL_NAME, property.getValue(), Types.text);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, Cairo.Util.val(property.getValue()), Types.boolean);
              break;

            case K_DESCRIP:
              fields.add(C.ROL_DESCRIP, property.getValue(), Types.text);
              break;
          }
        }

        saveItemsUsuarios(register);

        return savePermisos(register)

          .whenSuccess(function() {

              return DB.saveEx(
                register,
                false,
                "",
                Cairo.Constants.CLIENT_SAVE_FUNCTION,
                C_MODULE,
                getText(2813, "")).then(

                function(result) {
                  if(result.success) {
                    m_copy = false;
                    return load(result.data.getId()).then(
                      function (success) {
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
                  else {
                    return false;
                  }
                });
            }
          );
      };

      var updateList = function() {
        if(m_id == NO_ID) { return; }
        if(m_listController == null) { return; }

        if(m_isNew) {
          m_listController.addLeave(m_id, m_branchId);
        }
        else {
          m_listController.refreshBranch(m_id, m_branchId);
        }
      };

      self.getPath = function() {
        return "#sistema/rol/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "rol" + id;
      };

      self.getTitle = function() {
        return getText(2613, ""); // Roles
      };

      self.validate = function() {
        var property = null;
        var password = "";

        var properties = m_dialog.getProperties();
        var _count = properties.size();
        for(var _i = 0; _i < _count; _i++) {
          property = properties.item(_i);
          switch (property.getKey()) {
            case K_NAME:
              if(Cairo.Util.valEmpty(property.getValue(), Types.text)) {
                return Cairo.Modal.showInfoWithFalse(Cairo.Constants.MUST_SET_A_NAME);
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

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
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_USUARIO);
      };

      self.setDialog = function(rhs) {
        m_dialog = rhs;
      };

      self.isEditing = function() {
        return m_editing;
      };

      self.edit = function(id, inModalWindow) {
        var p = Cairo.Promises.resolvedPromise(false);
        try {

          if(id == NO_ID) {
            m_isNew = true;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_USUARIO)) { return p; }
          }
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_UNIDAD)) { return p; }
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
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.EDIT_FUNCTION, C_MODULE, "");
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

        var c_tab_usuarios = 1;

        var properties = m_dialog.getProperties();
        properties.clear();
        m_dialog.getTabs().clear();

        var tab = m_dialog.getTabs().add(null);
        tab.setIndex(0);
        tab.setName(Cairo.Constants.GENERAL);

        tab = m_dialog.getTabs().add(null);
        tab.setIndex(c_tab_usuarios);
        tab.setName(getText(1130, "")); // Usuarios

        var elem = properties.add(null, C.ROL_NAME);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVE);
        elem.setValue(bToI(m_active));

        elem = properties.add(null, C.ROL_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);

        elem = properties.add(null, C_USUARIOS);
        elem.setType(Dialogs.PropertyType.grid);
        setGridUsuarios(elem);
        loadUsuarios(elem);
        elem.setName("Roles");
        elem.setKey(K_USUARIOS);
        elem.setTabIndex(c_tab_usuarios);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_itemsDeletedUsuarios = "";

        return m_dialog.show(self);
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var property = properties.item(C.ROL_NAME);
        property.setValue(m_name);

        property = properties.item(Cairo.Constants.ACTIVE);
        property.setValue(bToI(m_active));

        property = properties.item(C.ROL_DESCRIP);
        property.setValue(m_descrip);

        property = properties.item(C_USUARIOS);
        loadUsuarios(property);

        return m_dialog.showValues(properties);
      };

      var loadDataFromResponse = function(response) {
        var data = response.data;

        data.usuarios = data.get('usuarios');

        return data;
      };

      var load = function(id) {

        m_data = emptyData;

        return DB.getData("load[" + m_apiPath + "general/rol]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            //
            // companies are always present so we need to load items even when id == NO_ID
            //
            m_data = loadDataFromResponse(response);

            if(response.data.id !== NO_ID) {

              m_active = valField(response.data, Cairo.Constants.ACTIVE);
              m_name = valField(response.data, C.ROL_NAME);
              m_id = valField(response.data, C.ROL_ID);
              m_descrip = valField(response.data, C.ROL_DESCRIP);
            }
            else {
              m_active = true;
              m_name = "";
              m_id = NO_ID;
              m_descrip = "";
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
        var id = null;
        var canDelete = true;

        switch (key) {

          case K_USUARIOS:
            id = Dialogs.cell(row, KI_US_ID).getId();
            if(id != NO_ID) { m_itemsDeletedUsuarios = m_itemsDeletedUsuarios+ id.toString()+ ","; }
            break;
        }

        return P.resolvedPromise(canDelete);
      };

      self.newRow = function(key, rows) {
        return P.resolvedPromise(true);
      };

      self.validateRow = function(key, row, rowIndex) {
        var p = null;

        try {

          switch (key) {
            case K_USUARIOS:
              p = validateRowUsuarios(row, rowIndex);
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "validateRow", C_MODULE, "");
        }

        return p || P.resolvedPromise(false);
      };

      self.columnAfterUpdate = function(key, lRow, lCol) {
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
            case K_USUARIOS:
              isEmpty = isEmptyRowUsuarios(row, rowIndex);
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "validateRow", C_MODULE, "");
        }
        return P.resolvedPromise(isEmpty);
      };

      var validateRowUsuarios = function(row, rowIndex) {
        var cell = null;
        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_US_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse("Debe indicar un rol " + strRow); // TODO: language
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var saveItemsUsuarios = function(mainRegister) {
        var transaction = new DB.createTransaction();
        transaction.setTable(C.USUARIO_ROL);

        var rows = m_dialog.getProperties().item(C_USUARIOS).getGrid().getRows();
        var _count = rows.size();
        for(var _i = 0; _i < _count; _i++) {

          var row = rows.item(_i);
          var register = new DB.Register();
          var fields = register.getFields();

          fields.add(C.US_ID, Dialogs.cell(row, KI_US_ID).getId(), Types.id);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedUsuarios !== "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedUsuarios);
        }

        mainRegister.addTransaction(transaction);
      };

      var isEmptyRowUsuarios = function(row, rowIndex) {

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {
            case KI_US_ID:
              if(! valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var setGridUsuarios = function(property) {
        var grid = property.getGrid();
        var columns = grid.getColumns();
        columns.clear();

        // aux column
        var elem = columns.add(null);
        elem.setVisible(false);

        elem = columns.add(null);
        elem.setName(getText(1137, "")); // Usuario
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.USUARIO);
        elem.setKey(KI_US_ID);

        grid.getRows().clear();
      }

      var loadUsuarios = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();

        for(var _i = 0, count = m_data.usuarios.length; _i < count; _i += 1) {

          var row = rows.add(null, getValue(m_data.usuarios[_i], C.US_ID));

          row.add(null); // aux column

          elem = row.add(null);
          elem.setValue(getValue(m_data.usuarios[_i], C.US_NAME));
          elem.setId(getValue(m_data.usuarios[_i], C.US_ID));
          elem.setKey(KI_US_ID);

        }

        return true;
      };

      var savePermisos = function(register) {
        var p = null;

        if(m_copy) {
          p = M.confirmViewYesDefault("", getText(3480, "", m_name)).whenSuccess(function() {
            register.getFields().add(C.ROL_COPY_PERMISSIONS, 1, Types.boolean);
            return true;
          });
        }

        return p || P.resolvedPromise(true);
      };

      var initialize = function() {
        try {

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "Class_Initialize", C_MODULE, "");
        }
      };

      var destroy = function() {
        m_dialog = null;
        m_listController = null;
      };

      self.terminate = function() {

        m_editing = false;

        try {
          if(m_listController != null) {
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

      initialize();

      return self;
    };

    Edit.Controller = { getEditor: createObject };

    Edit.Controller.edit = function(id) {
      var editor = Cairo.Rol.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit(id);
    };

  });

  Cairo.module("Rol.List", function(List, Cairo, Backbone, Marionette, $, _) {

    var NO_ID = Cairo.Constants.NO_ID;
    var getText = Cairo.Language.getText;

    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.rolEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.rolEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: getText(2613, ""),
            entityName: getText(2619, ""),  // TODO: fix language this is in uppercase we need to add a lower case for rol
            entitiesName: getText(2613, "") // TODO: fix language this is in uppercase we need to add a lower case for roles
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
              var editor = Cairo.Rol.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_ROL)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            var apiPath = Cairo.Database.getAPIVersion();
            return Cairo.Database.destroy(apiPath + "general/rol", id, Cairo.Constants.DELETE_FUNCTION, "Rol").success(
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
          Cairo.LoadingMessage.show("Roles", "Loading Roles from CrowSoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ rolTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.ROL,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.rolTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("Roles", "rolTreeRegion", "#sistema/roles", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());