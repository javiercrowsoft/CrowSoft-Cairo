(function() {
  "use strict";

  Cairo.module("UsuarioPermiso.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var P = Cairo.Promises;
      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var valField = DB.valField;
      var boolToInt = Cairo.Util.boolToInt;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;
      var T = Dialogs.PropertyType;
      var getCell = Dialogs.cell;
      var Types = Cairo.Constants.Types;

      var C_MODULE = "cUsuarioPermiso";

      var C_PERMISO = "PERMISOS";
      var C_ROLES = "ROLES";
      var C_SHOW_ONLY_GRANTED = "onlyGranted";
      var C_SHOW_ONLY_DIRECT = "onlyDirect";
      var C_SHOW_ONLY_INHERITED = "onlyInherited";
      var C_FILTER = "filter";
      var C_FILTER_CMD = "filterCmd";
      var C_SELECT_ALL = "selectAll";
      var C_UNSELECT_ALL = "unSelectAll";

      var K_PERMISO = 1;
      var K_ROLES = 2;
      var K_US_ID = 3;
      var K_FILTER_CMD = 4;
      var K_SELECT_ALL = 5;
      var K_UN_SELECT_ALL = 6;

      var KIK_PER_ID = 1;
      var KIK_GRUPO = 3;
      var KIK_GRUPO1 = 4;
      var KIK_GRUPO2 = 5;
      var KIK_GRUPO3 = 6;
      var KIK_GRUPO4 = 7;
      var KIK_GRUPO5 = 8;
      var KIK_PRE_NAME = 9;
      var KIK_GRANTED = 10
      var KIK_ROLES = 11;

      var KI_ROL_ID = 2;
      var KI_GRANTED = 3;

      var m_userId = NO_ID;
      var m_userName = "";

      var m_hasChanged = false;

      var m_editing;

      var m_dialog;
      var m_listController = null;

      var m_apiPath = DB.getAPIVersion();

      var emptyData = {
        permissions: [],
        roles: []
      };

      var m_data = emptyData;

      //
      // editor code
      //

      self.copy = function() {

      };

      self.editNew = function() {

      };

      self.getApplication = function() {
        return Cairo.Application.getName();
      };

      self.editDocumentsEnabled = function() {
        return false;
      };

      self.copyEnabled = function() {
        return false;
      };

      self.addEnabled = function() {
        return false;
      };

      self.showDocDigital = function() {
        return false;
      };

      self.messageEx = function(messageId, info) {
        return P.resolvedPromise(messageId === Dialogs.Message.MSG_GRID_VIRTUAL_ROW ? info : true);
      };

      self.discardChanges = function() {
        return Cairo.Promises.resolvedPromise(refreshCollection());
      };

      var getUserId = function() {
        return m_dialog.getProperties().item(C.US_ID).getSelectId();
      };

      self.propertyChange = function(key) {
        switch (key) {
          case K_FILTER_CMD:
            var filter = function() {
              return load(getUserId()).then(
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

          case K_SELECT_ALL:
            return selectAll(true);
          case K_UN_SELECT_ALL:
            return selectAll(false);
        }
        return P.resolvedPromise(false);
      };

      self.save = function() {

        var register = new DB.Register();

        register.setFieldId(C.US_ID);
        register.setTable(C.PERMISO);

        register.setPath(m_apiPath + "general/usuario/permissions");
        register.setTable(C.PERMISO);

        register.setId(m_userId);

        saveItemsPermisos(register);
        saveItemsRoles(register);

        return DB.saveEx(
          register,
          false,
          "",
          Cairo.Constants.CLIENT_SAVE_FUNCTION,
          C_MODULE,
          getText(2762, "") // Error al grabar los Permisos
        ).then(

          function(result) {
            if(result.success) {
              return load(m_userId).then(
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

      var saveItemsPermisos = function(mainRegister) {
        var transaction = new DB.createTransaction();
        transaction.setTable(C.PERMISO);

        var rows = m_dialog.getProperties().item(C_PERMISO).getGrid().getRows();
        var _count = rows.size();
        for(var _i = 0; _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();

          if(
            ( // is adding a permission
              Dialogs.cell(row, KIK_PER_ID).getId() === NO_ID &&
              Cairo.Util.bool(Dialogs.cell(row, KIK_GRANTED).getId())
            )
            ||
            ( // is removing a permission
              Dialogs.cell(row, KIK_PER_ID).getId() !== NO_ID &&
              ! Cairo.Util.bool(Dialogs.cell(row, KIK_GRANTED).getId())
            )
          ) {
            var fields = register.getFields();
            fields.add(C.PRE_ID, Dialogs.cell(row, KIK_PRE_NAME).getId(), Types.id);
            fields.add(C.PER_ID, Dialogs.cell(row, KIK_PER_ID).getId(), Types.id);
            fields.add(C.GRANTED, Dialogs.cell(row, KIK_GRANTED).getId(), Types.boolean);

            transaction.addRegister(register);
          }
        }

        mainRegister.addTransaction(transaction);
      };

      var saveItemsRoles = function(mainRegister) {
        var transaction = new DB.createTransaction();
        transaction.setTable(C.USUARIO_ROL);

        var rows = m_dialog.getProperties().item(C_ROLES).getGrid().getRows();
        var _count = rows.size();
        for(var _i = 0; _i < _count; _i++) {

          var row = rows.item(_i);
          var rolId = Dialogs.cell(row, KI_ROL_ID).getId();
          var granted = Dialogs.cell(row, KI_GRANTED).getId() !== 0;

          if((rolId > 0 && ! granted) || (rolId < 0 && granted)) {
            var register = new DB.Register();
            var fields = register.getFields();

            fields.add(C.ROL_ID, Math.abs(rolId), Types.id);
            fields.add(C.GRANTED, granted, Types.boolean);

            transaction.addRegister(register);
          }
        }

        mainRegister.addTransaction(transaction);
      };

      self.getPath = function() {
        return "#sistema/usuarios/permisos";
      };

      self.getEditorName = function() {
        return "usuariopermiso" + m_userId.toString();
      };

      self.getTitle = function() {
        return getText(2620, ""); // Permisos
      };

      self.validate = function() {
        return Cairo.Promises.resolvedPromise(true);
      };

      var loadDataFromResponse = function(response) {
        var data = response.data;

        data.permissions = data.get('permissions');
        data.roles = data.get('roles');

        return data;
      };

      var getOnlyGranted = function() {
        return m_dialog.getProperties().item(C_SHOW_ONLY_GRANTED).getValue() === true;
      };

      var getOnlyDirect = function() {
        return m_dialog.getProperties().item(C_SHOW_ONLY_DIRECT).getValue() === true;
      };

      var getOnlyInherited = function() {
        return m_dialog.getProperties().item(C_SHOW_ONLY_INHERITED).getValue() === true;
      };

      var getFilter = function() {
        return m_dialog.getProperties().item(C_FILTER).getValue();
      };

      var getFilters = function() {
        var onlyGranted = true;
        var onlyDirect = false;
        var onlyInherited = false;
        var filter = "";

        if(m_dialog.getProperties().count() > 0) {
          onlyGranted = getOnlyGranted();
          onlyDirect = getOnlyDirect();
          onlyInherited = getOnlyInherited();
          filter = getFilter();
        }
        return "onlyGranted=" + onlyGranted + "&onlyDirect=" + onlyDirect + "&onlyInherited=" + onlyInherited + "&filter=" + encodeURIComponent(filter);
      };

      var load = function(id) {

        m_data = emptyData;
        m_hasChanged = false;

        return DB.getData("load[" + m_apiPath + "general/usuario/" + id + "/permissions?" + getFilters() + "]").then(
          function (response) {

            if(response.success === true) {

              m_userId = valField(response.data, C.US_ID);
              m_userName = valField(response.data, C.US_NAME);
              m_data = loadDataFromResponse(response);

              return true;
            }
            else {
              return false;
            }
          }
        );
      };

      self.setDialog = function(value) {
        m_dialog = value;
      };

      self.edit = function(id, inModalWindow) {
        var p = Cairo.Promises.resolvedPromise(false);
        try {

          if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_PERMISO)) { return p; }

          m_dialog.setInModalWindow(inModalWindow);

          // the standard way of calling dialogs like settings which doesn't have a listing view
          // is to send id of current user and show data associated to she or he. In the case of
          // permissions it is faster to show an empty view and let the user to explicitly chose
          // the user whose permissions wants to edit, instead of showing current users permissions
          // because 99% of cases it will be administrator who wants to set permissions for other
          // people
          //
          p = load(NO_ID).then(
            function(success) {
              if(success) {

                if(!loadCollection()) { return false; }

                m_editing = true;
              }
              return true;
            });
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.EDIT_FUNCTION, "cUsuarioPermiso", "");
        }

        return p;
      };

      self.setTree = function(value) {
        m_listController = value;
      };

      var loadCollection = function() {

        var TAB_PERMISOS = 0;
        var TAB_ROLES = 1;

        var tabs = m_dialog.getTabs();
        tabs.clear();

        var tab = tabs.add(null);
        tab.setIndex(TAB_PERMISOS);
        tab.setName(getText(2620, "")); // Permisos

        tab = tabs.add(null);
        tab.setIndex(TAB_ROLES);
        tab.setName(getText(2613, "")); // Roles

        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, C.US_ID);
        elem.setName(getText(1137)); // Usuario
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.USUARIO);
        elem.setSelectId(m_userId);
        elem.setValue(m_userName)
        elem.setKey(K_US_ID);

        elem = properties.add(null, C_SHOW_ONLY_GRANTED);
        elem.setName("Only show granted permissions"); // TODO: move to language
        elem.setType(T.check);

        elem = properties.add(null, C_SHOW_ONLY_DIRECT);
        elem.setName("Only show direct permissions"); // TODO: move to language
        elem.setType(T.check);

        elem = properties.add(null, C_SHOW_ONLY_INHERITED);
        elem.setName("Only show inherited by roles permissions"); // TODO: move to language
        elem.setType(T.check);

        elem = properties.add(null, C_FILTER);
        elem.setName("Filter"); // TODO: move to language
        elem.setType(T.text);

        elem = properties.add(null, C_FILTER_CMD);
        elem.setName(getText(2057)); // Cargar
        elem.setType(T.button);
        elem.setKey(K_FILTER_CMD);
        elem.hideLabel();

        elem = properties.add(null, C_SELECT_ALL);
        elem.setName(getText(4870)); // Marcar todas
        elem.setType(T.button);
        elem.setKey(K_SELECT_ALL);
        elem.hideLabel();

        elem = properties.add(null, C_UNSELECT_ALL);
        elem.setName(getText(4886)); // Desmarcar todas
        elem.setType(T.button);
        elem.setKey(K_UN_SELECT_ALL);
        elem.hideLabel();

        elem = properties.add(null, C_PERMISO);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridPermisos(elem);
        loadGridPermisos(elem);
        elem.setName(C_PERMISO);
        elem.setKey(K_PERMISO);
        elem.setTabIndex(TAB_PERMISOS);
        elem.setGridAddEnabled(false);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(false);

        elem = properties.add(null, C_ROLES);
        elem.setType(Dialogs.PropertyType.grid);
        setGridRoles(elem);
        loadGridRoles(elem);
        elem.setName("Roles");
        elem.setKey(K_ROLES);
        elem.setTabIndex(TAB_ROLES);
        elem.setGridAddEnabled(false);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(false);

        return m_dialog.show(self);
      };

      var setGridPermisos = function(property) {
        var grid = property.getGrid();
        var columns = grid.getColumns();
        columns.clear();

        var elem = columns.add(null);
        elem.setKey(KIK_PER_ID);
        elem.setVisible(false);

        elem = columns.add(null);
        elem.setName(getText(1404, "")); // Grupo
        elem.setType(T.text);
        elem.setKey(KIK_GRUPO);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1404, "")); // Grupo
        elem.setType(T.text);
        elem.setKey(KIK_GRUPO1);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1404, "")); // Grupo
        elem.setType(T.text);
        elem.setKey(KIK_GRUPO2);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1404, "")); // Grupo
        elem.setType(T.text);
        elem.setKey(KIK_GRUPO3);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1404, "")); // Grupo
        elem.setType(T.text);
        elem.setKey(KIK_GRUPO4);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1404, "")); // Grupo
        elem.setType(T.text);
        elem.setKey(KIK_GRUPO5);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(4735, "")); // Accion
        elem.setType(T.text);
        elem.setKey(KIK_PRE_NAME);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName("");
        elem.setType(T.check);
        elem.setKey(KIK_GRANTED);

        elem = columns.add(null);
        elem.setName(getText(2613, "")); // Roles
        elem.setType(T.text);
        elem.setKey(KIK_ROLES);
        elem.setEnabled(false);

        grid.getRows().clear();
      };

      var loadGrid = function(loader) {
        var defer = new Cairo.Promises.Defer();
        var items = DB.getResultSetFromData(m_data.permissions);
        if(items.length > 200) {
          Cairo.LoadingMessage.showNow("Grid", "Loading rows.");
          setTimeout(function() {
            loader();
            Cairo.LoadingMessage.close();
            defer.resolve();
          }, 10);
        }
        else {
          loader();
          defer.resolve();
        }
        return defer.promise;
      };

      var loadGridPermisos = function(property) {
        return loadGrid(P.call(loadGridPermisos_, property));
      }

      var loadGridPermisos_ = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();

        var items = DB.getResultSetFromData(m_data.permissions);

        for(var _i = 0, count = items.length; _i < count; _i += 1) {

          var row = rows.add(null);

          elem = row.add(null);
          elem.setId(valField(items[_i], C.PER_ID));
          elem.setKey(KIK_PER_ID);

          elem = row.add(null);
          elem.setValue(valField(items[_i], C.PRE_GRUPO));
          elem.setKey(KIK_GRUPO);

          elem = row.add(null);
          elem.setValue(valField(items[_i], C.PRE_GRUPO1));
          elem.setKey(KIK_GRUPO1);

          elem = row.add(null);
          elem.setValue(valField(items[_i], C.PRE_GRUPO2));
          elem.setKey(KIK_GRUPO2);

          elem = row.add(null);
          elem.setValue(valField(items[_i], C.PRE_GRUPO3));
          elem.setKey(KIK_GRUPO3);

          elem = row.add(null);
          elem.setValue(valField(items[_i], C.PRE_GRUPO4));
          elem.setKey(KIK_GRUPO4);

          elem = row.add(null);
          elem.setValue(valField(items[_i], C.PRE_GRUPO5));
          elem.setKey(KIK_GRUPO5);

          elem = row.add(null);
          elem.setValue(valField(items[_i], C.PRE_NAME));
          elem.setId(valField(items[_i], C.PRE_ID));
          elem.setKey(KIK_PRE_NAME);

          elem = row.add(null);
          elem.setId(boolToInt(valField(items[_i], C.PER_ID)));
          elem.setKey(KIK_GRANTED);

          elem = row.add(null);
          elem.setValue(valField(items[_i], C.PER_ROL));
          elem.setKey(KIK_ROLES);
        }
      };

      var setGridRoles = function(property) {
        var grid = property.getGrid();
        var columns = grid.getColumns();
        columns.clear();

        // aux column
        var elem = columns.add(null);
        elem.setVisible(false);

        elem = columns.add(null);
        elem.setName(getText(2619, "")); // Rol
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.ROL);
        elem.setKey(KI_ROL_ID);

        elem = columns.add(null);
        elem.setName("");
        elem.setType(T.check);
        elem.setKey(KI_GRANTED);

        grid.getRows().clear();
      }

      var loadGridRoles = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();

        var items = DB.getResultSetFromData(m_data.roles);

        for(var _i = 0, count = items.length; _i < count; _i += 1) {

          var row = rows.add(null);

          var granted = valField(items[_i], C.GRANTED)

          elem = row.add(null);
          elem.setId(valField(items[_i], C.ROL_ID));

          elem = row.add(null);
          elem.setValue(valField(items[_i], C.ROL_NAME));
          elem.setId(valField(items[_i], C.ROL_ID) * (granted ? 1 : -1));
          elem.setKey(KI_ROL_ID);

          elem = row.add(null);
          elem.setId(boolToInt(granted));
          elem.setKey(KI_GRANTED);
        }

        return true;
      };

      var refreshCollection = function() {
        var properties = m_dialog.getProperties();
        var property = properties.item(C_ROLES);
        loadGridRoles(property);
        property = properties.item(C_PERMISO);
        return loadGridPermisos(property).then(function() {
          return m_dialog.showValues(properties);
        });
      };

      var selectAll = function(select) {
        var properties = m_dialog.getProperties();
        var property = properties.item(C_PERMISO);
        if(property.getGrid().getRows()) {
          m_hasChanged = true;
        }
        return loadGrid(P.call(selectAll_, select));
      };

      var selectAll_ = function(select) {
        var properties = m_dialog.getProperties();
        var property = properties.item(C_PERMISO);

        var rows = property.getGrid().getRows();
        for(var _i = 0, count = rows.count(); _i < count; _i += 1) {
          var row = rows.item(_i);
          var cell = getCell(row, KIK_GRANTED);
          cell.setId(boolToInt(select));
        }

        return m_dialog.showValue(property, true).then(function() {
          return false; // to avoid refresh controls by property change, so grid don't load twice
        });
      };

      self.columnAfterEdit = function(key, lRow, lCol, newValue, newValueId) {
        return P.resolvedPromise(true);
      };

      self.columnBeforeEdit = function(key, lRow, lCol, iKeyAscii) {
        return P.resolvedPromise(true);
      };

      self.columnButtonClick = function(key, lRow, lCol, iKeyAscii) {

      };

      self.deleteRow = function(key, row, lRow) {
        return P.resolvedPromise(false);
      };

      self.newRow = function(key, rows) {
        return P.resolvedPromise(false);
      };

      self.validateRow = function(key, row, rowIndex) {
        return P.resolvedPromise(true);
      };

      self.columnAfterUpdate = function(key, lRow, lCol) {
        try {
          switch (key) {
            case K_PERMISO:
              m_hasChanged = true;
              break;
          }
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnAfterUpdate", C_MODULE, "");
        }

        return P.resolvedPromise(true);
      };

      self.columnClick = function(key, lRow, lCol) {

      };

      self.gridDblClick = function(key, lRow, lCol) {
        return P.resolvedPromise(false);
      };

      self.isEmptyRow = function(key, row, rowIndex) {
        return P.resolvedPromise(false);
      };

      var destroy = function() {
        m_dialog = null;
        m_listController = null;
      };

      self.terminate = function() {
        m_editing = false;

        try {
          if(m_listController !== null) {
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

    var showEditor = function() {
      var editor = Cairo.UsuarioPermiso.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit(Cairo.User.getId());
    };

    Edit.Controller = { getEditor: createObject, edit: showEditor };

  });

}());