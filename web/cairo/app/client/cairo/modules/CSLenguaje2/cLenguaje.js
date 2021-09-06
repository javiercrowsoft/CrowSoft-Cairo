(function() {
  "use strict";

  Cairo.module("Lenguaje.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {
 
    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var P = Cairo.Promises;
      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;
      var Types = Cairo.Constants.Types;
      var U = Cairo.Util;
      var b2i = U.boolToInt;
      var valField = DB.valField;
      var getValue = DB.getValue;
      var M = Cairo.Modal;
      var T = Dialogs.PropertyType;
      var val = U.val;
      var valEmpty = U.valEmpty;

      var C_MODULE = "cLenguaje";

      var C_ITEMS = "Items";
      var C_FILTER = "filter";
      var C_FILTER_CMD = "filterCmd";
      var C_TOP = "top";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_DESCRIP = 3;
      var K_ID_PADRE = 4;
      var K_ACTIVE = 5;
      var K_ITEMS = 6;
      var K_CMD_FILTER = 7;
      var K_FILTER = 8;
      var K_FILTER_CMD = 9;
      var K_TOP = 10;

      var KI_LENGI_ID = 1;
      var KI_CODIGO = 2;
      var KI_TEXTO = 4;

      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_descrip = "";
      var m_padre = "";
      var m_id_padre = "";
      var m_active = "";

      var m_hasChanged = false;

      var m_editing;

      var m_dialog;
      var m_listController = null;

      var m_isNew;

      var m_branchId = 0;
      var m_treeId = 0;
      var m_copy;

      var m_itemsDeleted = "";

      var m_apiPath = DB.getAPIVersion();

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

        if(m_listController !== null) {
          m_listController.updateEditorKey(self, NO_ID);
        }

        var property = m_dialog.getProperties().item(C.LENG_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(C.LENG_CODE));

        m_copy = true;
      };

      self.editNew = function() {

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, NO_ID);

        return load(NO_ID).then(
          function(ignored) {
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

          doc.setClientTable(C.LENGUAJE);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.SHOW_DOCUMENTS_FUNCTION, C_MODULE, "");
        }

        return _rtn;
      };

      self.messageEx = function(messageID, info) {
        var _rtn = null;
        switch (messageID) {

          case Dialogs.Message.MSG_DOC_INFO:

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_LENGUAJE);
            _rtn = Dialogs.Message.MSG_DOC_INFO_HANDLED;
            break;

          default:
            _rtn = true;
            break;
        }

        return P.resolvedPromise(_rtn);
      };

      self.discardChanges = function() {
        return P.resolvedPromise(refreshCollection());
      };

      self.propertyChange = function(key) {
        switch (key) {
          case K_CMD_FILTER, K_TOP:
            var filter = function() {
              return load(getRolId()).then(
                function (success) {
                  if (success) {
                    refreshCollection();
                  }
                  return false; // to avoid refresh controls by property change, so grid don't load twice
                }
              );
            }
            var p;
            if(m_hasChanged) {
              p = Cairo.Modal.confirmCancelViewNoDanger(
                "Loading permissions",
                "You have changes which aren't save yet. Press yes if you want to save the changes or press No to continue without saving. You can also cancel this action."
              ).then(
                function(answer) {
                  /*
                    if the user wants to save changes
                    it returns a promise with the result
                    of calling saveDialog()
                    save is asynchronous (ajax call to server)
                  */
                  if(answer === "yes") {
                    return m_dialog.save();
                  } else {
                    return answer === "no";
                  }
                });
            } else {
              p = P.resolvedPromise(true);
            }
            return p.whenSuccess(filter);
        }

        return P.resolvedPromise(false);
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.LENG_ID);
        register.setTable(C.LENGUAJE);

        register.setPath(m_apiPath + "general/lenguaje");

        if(m_copy) {
          register.setId(Cairo.Constants.NEW_ID);
        }
        else {
          register.setId(m_id);
        }

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          var property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NAME:
              fields.add(C.LENG_NAME, property.getValue(), Types.text);
              break;

            case K_CODE:
              fields.add(C.LENG_CODE, property.getValue(), Types.text);
              break;

            case K_ID_PADRE:
              fields.add(C.LENG_ID_PADRE, property.getId(), Types.id);
              break;

            case K_DESCRIP:
              fields.add(C.LENG_DESCRIP, property.getValue(), Types.text);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, property.getValue(), Types.boolean);
              break;
          }
        }

        saveItems(register);

        return DB.saveTransaction(
          register,
          false,
          C.LENG_CODE,
          Cairo.Constants.CLIENT_SAVE_FUNCTION,
          C_MODULE,
          getText(3433, "") // Error al grabar lenguaje

        ).then(

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
        return "#general/lenguaje/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "lenguaje" + id;
      };

      self.getTitle = function() {
        return getText(1006, ""); // Lenguajes
      };

      self.validate = function() {
        var property = null;

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NAME:
              if(valEmpty(property.getValue(), Types.text)) {
                return M.showInfoWithFalse(Cairo.Constants.MUST_SET_A_NAME);
              }
              break;

            case K_CODE:
              if(valEmpty(property.getValue(), Types.text)) {
                property.setValue(Cairo.Constants.GET_CODE_FROM_ID);
              }
              break;
          }
        }

        return P.resolvedPromise(true);
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

        switch (key) {
          case K_ITEMS:
            id = val(Dialogs.cell(row, KI_RETI_ID).getValue());
            if(id !== NO_ID) { m_itemsDeleted = m_itemsDeleted + id.toString() + ","; }
            break;
        }

        return P.resolvedPromise(true);
      };

      self.newRow = function(key, rows) {
        return P.resolvedPromise(true);
      };

      self.columnAfterUpdate = function(key, lRow, lCol) {
        m_hasChanged = true;
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

        return isEmpty;
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

      self.setTreeId = function(value) {
        m_treeId = value;
      };

      self.getTreeId = function() {
        return m_treeId;
      };

      self.list = function() {
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_LENGUAJE);
      };

      self.getDialog = function() {
        return m_dialog;
      };

      self.setDialog = function(value) {
        m_dialog = value;
      };

      self.isEditing = function() {
        return m_editing;
      };

      self.edit = function(id, inModalWindow) {
        var p = P.resolvedPromise(false);

        try {

          if(id === NO_ID) {
            m_isNew = true;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_LENGUAJE)) { return p; }
          }
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_LENGUAJE)) { return p; }
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

        m_dialog.setTitle(m_name);

        var tabs = m_dialog.getTabs();

        tabs.clear();

        var tab = tabs.add(null);
        tab.setName(Cairo.Constants.TAB_GENERAL);

        tab = tabs.add(null);
        tab.setIndex(1);
        tab.setName(C_ITEMS);

        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, C.LENG_NAME);
        elem.setType(T.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(100);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        elem = properties.add(null, C.LENG_CODE);
        elem.setType(T.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setSize(15);
        elem.setKey(K_CODE);
        elem.setValue(m_code);

        elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(T.check);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVE);
        elem.setValue(b2i(m_active));

        elem = properties.add(null, C.LENG_ID_PADRE);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LENGUAJE);
        elem.setName(getText(1002, "")); // Lenguaje Padre
        elem.setKey(K_ID_PADRE);
        elem.setValue(m_padre);
        elem.setSelectId(m_id_padre);

        elem = properties.add(null, C.LENG_DESCRIP);
        elem.setType(T.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setSize(255);
        elem.setWidth(6250);
        elem.setHeight(600);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);

        elem = properties.add(null, C_FILTER);
        elem.setName(getText(2826)); // Filtro
        elem.setType(T.text);
        elem.setKey(K_FILTER);

        elem = properties.add(null, C_TOP);
        elem.setName(getText(3479)); // Top
        elem.setType(T.number());
        elem.setKey(K_FILTER);

        elem = properties.add(null, C_FILTER_CMD);
        elem.setName(getText(3432)); // Filtrar
        elem.setType(T.button);
        elem.setKey(K_FILTER_CMD);
        elem.hideLabel();

        elem = properties.add(null, C_ITEMS);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridItems(elem);
        loadItems(elem);
        elem.setName(C_ITEMS);
        elem.setKey(K_ITEMS);
        elem.setTabIndex(1);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_itemsDeleted = "";

        return m_dialog.show(self);
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(C.LENG_NAME);
        elem.setValue(m_name);

        elem = properties.item(C.LENG_CODE);
        elem.setValue(m_code);

        elem = properties.item(Cairo.Constants.ACTIVE);
        elem.setValue(b2i(m_active));

        elem = properties.item(C.LENG_ID_PADRE);
        elem.setValue(m_padre);
        elem.setSelectId(m_id_padre);

        elem = properties.item(C.LENG_DESCRIP);
        elem.setValue(m_descrip);

        elem = properties.item(C_ITEMS);
        loadItems(elem);
        m_itemsDeleted = "";

        return m_dialog.showValues(properties);
      };

      var loadDataFromResponse = function(response) {
        var data = response.data;

        data.items = data.get('items');

        return data;
      };

      var load = function(id) {
        m_data = emptyData;

        return Cairo.Database.getData("load[" + m_apiPath + "general/lenguaje]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== NO_ID) {

              m_data = loadDataFromResponse(response);

              var data = response.data;

              m_id = valField(data, C.LENG_ID);
              m_id_padre = valField(data, C.LENG_ID_PADRE);
              m_padre = valField(data, C.LENG_NAME_PADRE);
              m_name = valField(data, C.LENG_NAME);
              m_code = valField(data, C.LENG_CODE);
              m_active = valField(data, Cairo.Constants.ACTIVE);
              m_descrip = valField(data, C.LENG_DESCRIP);

            }
            else {
              m_id = NO_ID;
              m_id_padre = NO_ID;
              m_padre = "";
              m_name = "";
              m_code = "";
              m_active = true;
              m_descrip = "";
            }

            return true;
          });
      };

      var saveItems = function(mainRegister) {

        var transaction = DB.createTransaction();

        transaction.setTable(C.LENGUAJE_ITEM);

        var property = m_dialog.getProperties().item(C_ITEMS);

        var rows = property.getGrid().getRows();
        for (var i = 0, count = rows.size(); i < count; i++) {

          var row = rows.item(i);

          var register = new Cairo.Database.Register();

          var fields = register.getFields();
          register.setFieldId(C.LENGI_ID);
          register.setId(Cairo.Constants.NEW_ID);

          for (var j = 0, countj = row.size(); j < countj; j++) {

            var cell = row.item(j);
            switch (cell.getKey()) {

              case KI_LENGI_ID:
                if(m_copy) {
                  fields.add(C.LENGI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(C.LENGI_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KI_CODIGO:
                fields.add(C.LENGI_CODIGO, cell.getValue(), Types.text);
                break;

              case KI_TEXTO:
                fields.add(C.LENGI_TEXTO, cell.getValue(), Types.text);
                break;
            }
          }

          transaction.addRegister(register);
        }

        if(m_itemsDeleted !== "" && m_id !== NO_ID && !m_copy) {

          transaction.setDeletedList(m_itemsDeleted);
        }

        mainRegister.addTransaction(transaction);
      };

      var setGridItems = function(property) {
        var grid = property.getGrid();
        var columns = grid.getColumns();
        columns.clear();

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_LENGI_ID);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setType(T.text);
        elem.setKey(KI_CODIGO);

        elem = columns.add(null);
        elem.setName(getText(1005, "")); // Texto
        elem.setType(T.text);
        elem.setKey(KI_TEXTO);

        grid.getRows().clear();
      };

      var loadItems = function(property) {
        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        for(var i = 0, count = m_data.items.length; i < count; i += 1) {

          var row = rows.add(null, getValue(m_data.items[i], C.LENGI_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[i], C.LENGI_ID));
          elem.setKey(KI_LENGI_ID);

          elem = row.add(null);
          elem.setValue(valField(m_data.items[i], C.LENGI_CODIGO));
          elem.setKey(KI_CODIGO);

          elem = row.add(null);
          elem.setValue(valField(m_data.items[i], C.LENGI_TEXTO));
          elem.setKey(KI_TEXTO);

        }
      };

      var isEmptyRowItems = function(row, rowIndex) {
        var bRowIsEmpty = true;
        for (var i = 0, count = row.size(); i < count; i++) {
          var cell = row.item(i);
          switch (cell.getKey()) {
            case KI_CODIGO:
              if(!valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
              }
              break;

            case KI_TEXTO:
              if(!valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var validateCode = function(cell, strRow) {
        return M.confirmViewYesDefault(getText(1003, "", strRow)) // No ha indicado un código & strRow & ;; Desea que el sistema le sugiera el próximo numero a usar?
          .whenSuccess(function() {
            return getItemCode().whenSuccessWithResult(function(code) {
              cell.setValue(code);
            });
          });
      }

      var validateRowItems = function(row, rowIndex) {
        var strRow = " (Row: " + rowIndex.toString() + ")";
        for (var i = 0, count = row.size(); i < count; i++) {
          var cell = row.item(i);
          switch (cell.getKey()) {
            case KI_CODIGO:
              if(valEmpty(cell.getValue(), Types.text)) {
                return validateCode(cell, strRow);
              }
              break;
            case KI_TEXTO:
              if(valEmpty(cell.getValue(), Types.text)) {
                return M.showInfoWithFalse(getText(1004, "", strRow)); // Debe indicar un texto #1#
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var getItemCode = function() {
        return Cairo.Database.getData("load[" + m_apiPath + "general/lenguaje/get_item_code]")
      };

      var initialize = function() {

      };

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

      initialize();

      return self;
    };

    Edit.Controller = { getEditor: createObject };

    Edit.Controller.edit = function(id) {
      var editor = Cairo.Producto.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit(id);
    };

  });

  Cairo.module("Lenguaje.List", function(List, Cairo, Backbone, Marionette, $, _) {

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

          var editors = Cairo.Editors.lenguajeEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.lenguajeEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: getText(1006, ""), // Lenguajes
            entityName: "Lenguaje", // TODO: add to language
            entitiesName: getText(1006, "")
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
              var editor = Cairo.Lenguaje.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_LENGUAJE)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            var apiPath = Cairo.Database.getAPIVersion();
            return Cairo.Database.destroy(apiPath + "general/lenguaje", id, Cairo.Constants.DELETE_FUNCTION, "Lenguaje").success(
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
          Cairo.LoadingMessage.show("Lenguajes", "Loading Lenguajes from CrowSoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ lenguajeTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.LENGUAJE,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.lenguajeTreeRegion,
            self);
        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("Lenguajes", "lenguajeTreeRegion", "#general/lenguaje", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });

}());