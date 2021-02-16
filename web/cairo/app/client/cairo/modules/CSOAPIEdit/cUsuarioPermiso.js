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

      var C_MODULE = "cUsuarioPermiso";

      var C_PERMISO = "PERMISOS";
      var C_SHOW_ONLY_GRANTED = "onlyGranted"
      var C_SHOW_ONLY_DIRECT = "onlyDirect"
      var C_SHOW_ONLY_INHERITED = "onlyInherited"
      var C_FILTER = "filter"
      var C_FILTER_CMD = "filterCmd"

      var K_PERMISO = 1;
      var K_US_ID = 2;
      var K_FILTER_CMD = 3;

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

      var m_userId = NO_ID;
      var m_userName = "";

      var m_editing;

      var m_dialog;
      var m_listController = null;

      var m_apiPath = Cairo.Database.getAPIVersion();

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
        return true;
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
            load(getUserId()).then(
              function (success) {
                if(success) {
                  refreshCollection();
                }
                return success;
              }
            );
            break;
        }
        return P.resolvedPromise(false);
        return Cairo.Promises.resolvedPromise(false);
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = null;

        var mainRegister = new Cairo.Database.Register();
        var transaction = Cairo.Database.createTransaction();

        var companyId = Cairo.Company.getId().toString();

        transaction.setTable(C.PERMISO)

        mainRegister.addTransaction(transaction);

        return Cairo.Database.saveTransaction(
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

        elem = columns.add(null);
        elem.setName(getText(1404, "")); // Grupo
        elem.setType(T.text);
        elem.setKey(KIK_GRUPO1);

        elem = columns.add(null);
        elem.setName(getText(1404, "")); // Grupo
        elem.setType(T.text);
        elem.setKey(KIK_GRUPO2);

        elem = columns.add(null);
        elem.setName(getText(1404, "")); // Grupo
        elem.setType(T.text);
        elem.setKey(KIK_GRUPO3);

        elem = columns.add(null);
        elem.setName(getText(1404, "")); // Grupo
        elem.setType(T.text);
        elem.setKey(KIK_GRUPO4);

        elem = columns.add(null);
        elem.setName(getText(1404, "")); // Grupo
        elem.setType(T.text);
        elem.setKey(KIK_GRUPO5);

        elem = columns.add(null);
        elem.setName(getText(4735, "")); // Accion
        elem.setType(T.text);
        elem.setKey(KIK_PRE_NAME);

        elem = columns.add(null);
        elem.setName("");
        elem.setType(T.check);
        elem.setKey(KIK_GRANTED);

        elem = columns.add(null);
        elem.setName(getText(2613, "")); // Roles
        elem.setType(T.text);
        elem.setKey(KIK_ROLES);

        grid.getRows().clear();
      };

      var loadGridPermisos = function(property) {

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

      var refreshCollection = function() {

        var properties = m_dialog.getProperties();

        var property = properties.item(C_PERMISO);
        loadGridPermisos(property)

        return m_dialog.showValues(properties);
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