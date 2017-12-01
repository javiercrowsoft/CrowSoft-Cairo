(function() {
  "use strict";

  Cairo.module("Usuario.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

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

      var CSPERSONA = 1019;
      var CSSUCURSAL = 1007;
      var C_EMPRESAS = "Empresas";
      var C_CLIPROV = "CliProv";
      var C_ROLES = "Roles";

      var K_NAME = 1;
      var K_PASSWORD = 2;
      var K_ACTIVE = 3;
      var K_CONFIRME = 4;
      var K_EXTERNO = 5;
      var K_CLIPROV_X_DPTO = 6;
      var K_DESCRIP = 7;
      var K_CLIPROV = 8;
      var K_PRS_ID = 9;
      var K_SUC_ID = 10;
      var K_EMPRESAS = 11;
      var K_EMPRESAEX = 12;
      var K_USDEPOSITO = 13;
      var K_ROLES = 14;

      var KI_USEMP_ID = 1;
      var KI_PROV_ID = 2;
      var KI_CLI_ID = 3;

      var KI_ROL_ID = 2;

      var KI_EMPUS_ID = 1;
      var KI_EMP_ID = 2;

      var m_vRowCliProvUpdated = 0;

      var m_id = 0;
      var m_name = "";
      var m_password = "";
      var m_descrip = "";
      var m_active;
      var m_usDeposito;
      var m_externo;
      var m_empXDpto;
      var m_empresaEx;
      var m_prs_id = 0;
      var m_persona = "";
      var m_suc_id = 0;
      var m_sucursal = "";

      var m_editing;

      var m_dialog;
      var m_listController = null;

      var m_branchId = 0;
      var m_treeId = 0;

      var m_copy;
      var m_isNew;

      var m_itemsDeletedCliProv = "";
      var m_itemsDeletedRoles = "";

      var m_apiPath = DB.getAPIVersion();

      var emptyData = {
        cliProv: [],
        empresas: [],
        roles: []
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

        var property = m_dialog.getProperties().item(C.US_NAME);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(C.US_NAME));

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
        return m_id != NO_ID;
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
        switch (key) {

          case K_CLIPROV_X_DPTO:

            var properties = m_dialog.getProperties();
            if(Cairo.Util.val(properties.item(C.US_EMP_X_DPTO).getValue())) {
              properties.item(C.US_EMPRESA_EX).setValue(false);
              m_dialog.showValue(properties.item(C.US_EMPRESA_EX));
            }
            break;

          case K_EMPRESAEX:

            var properties = m_dialog.getProperties();
            if(Cairo.Util.val(properties.item(C.US_EMPRESA_EX).getValue())) {
              properties.item(C.US_EMP_X_DPTO).setValue(false);
              m_dialog.showValue(properties.item(C.US_EMP_X_DPTO));
            }
            break;
        }
        return Cairo.Promises.resolvedPromise(false);
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.US_ID);
        register.setTable(C.USUARIO);

        register.setPath(m_apiPath + "general/usuario");

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
              fields.add(C.US_NAME, property.getValue(), Types.text);
              break;

            case K_PASSWORD:
              fields.add(C.US_CLAVE, property.getValue(), Types.text);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, Cairo.Util.val(property.getValue()), Types.boolean);
              break;

            case K_USDEPOSITO:
              fields.add(C.US_DEPOSITO, Cairo.Util.val(property.getValue()), Types.boolean);
              break;

            case K_DESCRIP:
              fields.add(C.US_DESCRIP, property.getValue(), Types.text);
              break;

            case K_EXTERNO:
              fields.add(C.US_EXTERNO, Cairo.Util.val(property.getValue()), Types.boolean);
              break;

            case K_CLIPROV_X_DPTO:
              fields.add(C.US_EMP_X_DPTO, Cairo.Util.val(property.getValue()), Types.boolean);
              break;

            case K_EMPRESAEX:
              fields.add(C.US_EMPRESA_EX, Cairo.Util.val(property.getValue()), Types.boolean);
              break;

            case K_PRS_ID:
              fields.add(C.PRS_ID, property.getSelectId(), Types.id);
              break;

            case K_SUC_ID:
              fields.add(C.SUC_ID, property.getSelectId(), Types.id);
              break;
          }
        }

        saveItemsCliProv(register);
        saveItemsRoles(register);
        saveItemsEmpresa(register);

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
        return "#sistema/usuario/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "usuario" + id;
      };

      self.getTitle = function() {
        return getText(1137, ""); // Usuarios
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

            case K_PASSWORD:
              password = property.getValue();
              break;

            case K_CONFIRME:
              if(password !== property.getValue()) {
                return Cairo.Modal.showInfoWithFalse(getText(2804, "")); // La clave y su confirmación no coinciden
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
                  success = m_id != NO_ID;
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

        var c_tab_empresas = 2;
        var c_tab_roles = 3;

        m_vRowCliProvUpdated = [];

        var properties = m_dialog.getProperties();
        properties.clear();
        m_dialog.getTabs().clear();

        var tab = m_dialog.getTabs().add(null);
        tab.setIndex(0);
        tab.setName(Cairo.Constants.GENERAL);

        tab = m_dialog.getTabs().add(null);
        tab.setIndex(1);
        tab.setName(getText(2806, "")); // Cliente/Proveedor

        tab = m_dialog.getTabs().add(null);
        tab.setIndex(c_tab_empresas);
        tab.setName(getText(1171, "")); // Empresas

        tab = m_dialog.getTabs().add(null);
        tab.setIndex(c_tab_roles);
        tab.setName(getText(2613, "")); // Roles

        var elem = properties.add(null, C.US_NAME);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        elem = properties.add(null, C.US_CLAVE);
        elem.setType(Dialogs.PropertyType.password);
        elem.setName(getText(2807, "")); // Clave
        elem.setValue(m_password);
        elem.setKey(K_PASSWORD);

        elem = properties.add(null, "CONFIRMACION");
        elem.setType(Dialogs.PropertyType.password);
        elem.setName("Confirmar");
        elem.setValue(m_password);
        elem.setKey(K_CONFIRME);

        elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVE);
        elem.setValue(bToI(m_active));

        elem = properties.add(null, C.US_DEPOSITO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2808, "")); // Este usuario NO especifica Depósitos de trabajo
        elem.setKey(K_USDEPOSITO);
        elem.setValue(bToI(m_usDeposito));

        elem = properties.add(null, C.US_EXTERNO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2810, "")); // Externo
        elem.setKey(K_EXTERNO);
        elem.setValue(bToI(m_externo));

        elem = properties.add(null, C.US_EMP_X_DPTO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2809, "")); // Clientes/Proveedores por departamento
        elem.setKey(K_CLIPROV_X_DPTO);
        elem.setValue(bToI(m_empXDpto));

        elem = properties.add(null, C.US_EMPRESA_EX);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2811, "")); // Clientes/Proveedores por Usuario
        elem.setKey(K_EMPRESAEX);
        elem.setValue(bToI(m_empresaEx));

        elem = properties.add(null, C.PRS_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(CSPERSONA);
        elem.setName(getText(2812, "")); // Persona
        elem.setKey(K_PRS_ID);
        elem.setSelectId(m_prs_id);
        elem.setValue(m_persona);

        elem = properties.add(null, C.SUC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(CSSUCURSAL);
        elem.setName(getText(1281, "")); // Sucursal
        elem.setKey(K_SUC_ID);
        elem.setSelectId(m_suc_id);
        elem.setValue(m_sucursal);

        elem = properties.add(null, C.US_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);

        elem = properties.add(null, C_CLIPROV);
        elem.setType(Dialogs.PropertyType.grid);
        setGridCliProv(elem);
        loadCliProv(elem);
        elem.setName("CliProv");
        elem.setKey(K_CLIPROV);
        elem.setTabIndex(1);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_itemsDeletedCliProv = "";

        elem = properties.add(null, C_EMPRESAS);
        elem.setType(Dialogs.PropertyType.grid);
        setGridEmpresas(elem);
        loadEmpresas(elem);
        elem.setName(C_EMPRESAS);
        elem.setKey(K_EMPRESAS);
        elem.setTabIndex(c_tab_empresas);
        elem.setGridAddEnabled(false);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(false);

        elem = properties.add(null, C_ROLES);
        elem.setType(Dialogs.PropertyType.grid);
        setGridRoles(elem);
        loadRoles(elem);
        elem.setName("Roles");
        elem.setKey(K_ROLES);
        elem.setTabIndex(c_tab_roles);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_itemsDeletedRoles = "";

        if(!m_dialog.show(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var property = properties.item(C.US_NAME);
        property.setValue(m_name);

        property = properties.item(C.US_CLAVE);
        property.setValue(m_password);

        property = properties.item("CONFIRMACION");
        property.setValue(m_password);

        property = properties.item(Cairo.Constants.ACTIVE);
        property.setValue(bToI(m_active));

        property = properties.item(C.US_DEPOSITO);
        property.setValue(bToI(m_usDeposito));

        property = properties.item(C.US_EXTERNO);
        property.setValue(bToI(m_externo));

        property = properties.item(C.US_EMP_X_DPTO);
        property.setValue(bToI(m_empXDpto));

        property = properties.item(C.US_EMPRESA_EX);
        property.setValue(bToI(m_empresaEx));

        property = properties.item(C.PRS_ID);
        property.setSelectId(m_prs_id);
        property.setValue(m_persona);

        property = properties.item(C.SUC_ID);
        property.setValue(m_sucursal);

        property = properties.item(C.US_DESCRIP);
        property.setValue(m_descrip);

        property = properties.item(C_CLIPROV);
        loadCliProv(property);

        m_itemsDeletedCliProv = "";

        property = properties.item(C_EMPRESAS);
        loadEmpresas(property);

        property = properties.item(C_ROLES);
        loadRoles(property);

        return m_dialog.showValues(properties);
      };

      var loadDataFromResponse = function(response) {
        var data = response.data;

        data.cliProv = data.get('cliProv');
        data.empresas = data.get('empresas');
        data.roles = data.get('roles');

        return data;
      };

      var load = function(id) {

        m_data = emptyData;

        return DB.getData("load[" + m_apiPath + "general/usuario]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            //
            // companies are always present so we need to load items even when id == NO_ID
            //
            m_data = loadDataFromResponse(response);

            if(response.data.id !== NO_ID) {

              m_active = valField(response.data, Cairo.Constants.ACTIVE);
              m_usDeposito = valField(response.data, C.US_DEPOSITO);
              m_name = valField(response.data, C.US_NAME);
              m_id = valField(response.data, C.US_ID);
              m_password = "";
              m_descrip = valField(response.data, C.US_DESCRIP);
              m_externo = valField(response.data, C.US_EXTERNO);
              m_prs_id = valField(response.data, C.PRS_ID);
              m_persona = valField(response.data, C.PRS_NAME);
              m_suc_id = valField(response.data, C.SUC_ID);
              m_sucursal = valField(response.data, C.SUC_NAME);
              m_empXDpto = valField(response.data, C.US_EMP_X_DPTO);
              m_empresaEx = valField(response.data, C.US_EMPRESA_EX);
            }
            else {
              m_active = true;
              m_usDeposito = false;
              m_name = "";
              m_id = NO_ID;
              m_password = "";
              m_descrip = "";
              m_externo = false;
              m_empXDpto = false;
              m_empresaEx = false;
              m_prs_id = NO_ID;
              m_persona = "";
              m_suc_id = NO_ID;
              m_sucursal = "";
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

          case K_CLIPROV:
            id = Cairo.Util.val(Dialogs.cell(row, KI_USEMP_ID).getValue());
            if(id != NO_ID) { m_itemsDeletedCliProv = m_itemsDeletedCliProv+ id.toString()+ ","; }
            break;

          case K_ROLES:
            id = Dialogs.cell(row, KI_ROL_ID).getId();
            if(id != NO_ID) { m_itemsDeletedRoles = m_itemsDeletedRoles+ id.toString()+ ","; }
            break;

          case K_EMPRESAS:
            canDelete = false;
            break;
        }

        return P.resolvedPromise(canDelete);
      };

      self.newRow = function(key, rows) {
        switch (key) {
          case K_CLIPROV:
            addRowToUpdated(rows-1);
            break;
        }
        return P.resolvedPromise(true);
      };

      self.validateRow = function(key, row, rowIndex) {
        var p = null;
        
        try {

          switch (key) {
            case K_CLIPROV:
              p = validateRowCliProv(row, rowIndex);
              break;

            case K_ROLES:
              p = validateRowRoles(row, rowIndex);
              break;

            case K_EMPRESAS:
              p = P.resolvedPromise(true);
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "validateRow", C_MODULE, "");
        }

        return p || P.resolvedPromise(false);
      };

      self.columnAfterUpdate = function(key, lRow, lCol) {
        switch (key) {
          case K_CLIPROV:
            addRowToUpdated(lRow);
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
            case K_CLIPROV:
              isEmpty = isEmptyRowCliProv(row, rowIndex);
              break;

            case K_ROLES:
              isEmpty = isEmptyRowRoles(row, rowIndex);
              break;

            case K_EMPRESAS:
              isEmpty = false;
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "validateRow", C_MODULE, "");
        }
        return P.resolvedPromise(isEmpty);
      };

      var validateRowCliProv = function(row, rowIndex) {
        var cell = null;
        var strRow = " (Row: " + rowIndex.toString() + ")";
        var isEmpty = true;

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_PROV_ID:
              if(! valEmpty(cell.getId(), Types.id)) {
                isEmpty = false;
              }
              break;

            case KI_CLI_ID:
              if(! valEmpty(cell.getId(), Types.id)) {
                isEmpty = false;
              }
              break;
          }
        }

        if(isEmpty) {
          return M.showInfoWithFalse("Debe indicar un proveedor o un cliente"+ strRow); // TODO: language
        }
        else {
          return Cairo.Promises.resolvedPromise(true);
        }
      };

      var validateRowRoles = function(row, rowIndex) {
        var cell = null;
        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_ROL_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse("Debe indicar un rol " + strRow); // TODO: language
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var saveItemsEmpresa = function(mainRegister) {
        var transaction = new DB.createTransaction();
        transaction.setTable(C.EMPRESA_USUARIO);

        var property = m_dialog.getProperties().item(C_EMPRESAS);

        var rows = property.getGrid().getRows();
        var _count = rows.size();
        for(var _i = 0; _i < _count; _i++) {

          var row = rows.item(_i);

          if(Dialogs.cell(row, KI_EMPUS_ID).getId()) {

            var register = new DB.Register();

            var fields = register.getFields();
            register.setFieldId(C.EMP_US_ID);
            register.setId(Cairo.Constants.NEW_ID);

            fields.add(C.EMP_ID, Dialogs.cell(row, KI_EMP_ID).getId(), Types.id);
            fields.add(C.US_ID, m_id, Types.id);

            transaction.addRegister(register);
          }
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveItemsCliProv = function(mainRegister) {
        var transaction = DB.createTransaction();
        transaction.setTable(C.USUARIO_EMPRESA);

        var property = m_dialog.getProperties().item(C_CLIPROV);

        var rows = property.getGrid().getRows();
        var _count = rows.size();
        for(var _i = 0; _i < _count; _i++) {

          if(rowWasUpdated(_i)) {

            var row = rows.item(_i);

            var register = new DB.Register();
            register.setFieldId(C.US_EMP_ID);
            register.setId(Cairo.Constants.NEW_ID);

            var fields = register.getFields();

            var _countj = row.size();
            for(var _j = 0; _j < _countj; _j++) {

              var cell = row.item(_j);

              switch (cell.getKey()) {

                case KI_USEMP_ID:
                  if(m_copy) {
                    fields.add(C.US_EMP_ID, Cairo.Constants.NEW_ID, Types.integer);
                  }
                  else {
                    fields.add(C.US_EMP_ID, Cairo.Util.val(cell.getValue()), Types.integer);
                  }
                  break;

                case KI_CLI_ID:
                  fields.add(C.CLI_ID, cell.getId(), Types.id);
                  break;

                case KI_PROV_ID:
                  fields.add(C.PROV_ID, cell.getId(), Types.id);
                  break;
              }
            }

            fields.add(C.US_ID, m_id, Types.id);

            transaction.addRegister(register);
          }
        }

        if(m_itemsDeletedCliProv !== "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedCliProv);
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveItemsRoles = function(mainRegister) {
        var transaction = new DB.createTransaction();
        transaction.setTable(C.USUARIO_ROL);

        var rows = m_dialog.getProperties().item(C_ROLES).getGrid().getRows();
        var _count = rows.size();
        for(var _i = 0; _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();

          var fields = register.getFields();
          fields.add(C.ROL_ID, Dialogs.cell(row, KI_ROL_ID).getId(), Types.id);
          fields.add(C.US_ID, m_id, Types.id);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedRoles !== "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedRoles);
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var isEmptyRowCliProv = function(row, rowIndex) {

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {
            case KI_CLI_ID:
              if(! valEmpty(cell.getId(), Types.id)) {
                return false;
              }
              break;

            case KI_PROV_ID:
              if(! valEmpty(cell.getId(), Types.id)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var isEmptyRowRoles = function(row, rowIndex) {

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {
            case KI_ROL_ID:
              if(! valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var setGridCliProv = function(property) {

        var elem;
        var grid = property.getGrid();

        m_vRowCliProvUpdated = [];

        var columns = grid.getColumns();
        columns.clear();

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_USEMP_ID);

        elem = columns.add(null);
        elem.setName(getText(1150, "")); // Cliente
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CLIENTE);
        elem.setKey(KI_CLI_ID);

        elem = columns.add(null);
        elem.setName(getText(1151, "")); // Proveedor
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROVEEDOR);
        elem.setKey(KI_PROV_ID);

        grid.getRows().clear();
      };

      var loadCliProv = function(property) {

        var elem;

        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();

        for(var _i = 0, count = m_data.cliProv.length; _i < count; _i += 1) {

          var row = rows.add(null, getValue(m_data.cliProv[_i], C.US_EMP_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.cliProv[_i], C.US_EMP_ID));
          elem.setKey(KI_USEMP_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cliProv[_i], C.CLI_NAME));
          elem.setId(getValue(m_data.cliProv[_i], C.CLI_ID));
          elem.setKey(KI_CLI_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cliProv[_i], C.PROV_NAME));
          elem.setId(getValue(m_data.cliProv[_i], C.PROV_ID));
          elem.setKey(KI_PROV_ID);

        }
      };

      var setGridRoles = function(property) {

        var elem;
        var grid = property.getGrid();

        var columns = grid.getColumns();
        columns.clear();

        // aux column
        elem = columns.add(null);
        elem.setVisible(false);

        elem = columns.add(null);
        elem.setName(getText(2619, "")); // Rol
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.ROL);
        elem.setKey(KI_ROL_ID);

        grid.getRows().clear();
      }

      var loadRoles = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();

        for(var _i = 0, count = m_data.roles.length; _i < count; _i += 1) {

          var row = rows.add(null, getValue(m_data.roles[_i], C.ROL_ID));

          row.add(null); // aux column

          elem = row.add(null);
          elem.setValue(getValue(m_data.roles[_i], C.ROL_NAME));
          elem.setId(getValue(m_data.roles[_i], C.ROL_ID));
          elem.setKey(KI_ROL_ID);

        }

        return true;
      };

      var setGridEmpresas = function(property) {

        var elem;
        var grid = property.getGrid();

        var columns = grid.getColumns();
        columns.clear();

        elem = columns.add(null);
        elem.setVisible(false);

        elem = columns.add(null);
        elem.setName(getText(1114, "")); // Empresa
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KI_EMP_ID);

        elem = columns.add(null);
        elem.setName("");
        elem.setType(Dialogs.PropertyType.check);
        elem.setKey(KI_EMPUS_ID);

        grid.getRows().clear();
      };

      var loadEmpresas = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();

        for(var _i = 0, count = m_data.empresas.length; _i < count; _i += 1) {

          var row = rows.add(null, getValue(m_data.empresas[_i], C.EMP_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.empresas[_i], C.EMP_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.empresas[_i], C.EMP_NAME));
          elem.setId(getValue(m_data.empresas[_i], C.EMP_ID));
          elem.setKey(KI_EMP_ID);

          elem = row.add(null);
          elem.setId(getValue(m_data.empresas[_i], C.EMP_US_ID));
          elem.setValue(elem.getId());
          elem.setKey(KI_EMPUS_ID);

        }

        return true;
      };

      var savePermisos = function(register) {
        var p = null;

        if(m_copy) {
          p = M.confirmViewYesDefault("", getText(3480, "", m_name)).whenSuccess(function() {
            register.getFields().add(C.US_COPY_PERMISSIONS, 1, Types.boolean);
            return true;
          });
        }

        return p || P.resolvedPromise(true);
      };

      var addRowToUpdated = function(lRow) {
        if(! rowWasUpdated(lRow)) {
          m_vRowCliProvUpdated.push(lRow);
        }
      };

      var rowWasUpdated = function(lRow) {
        return m_vRowCliProvUpdated.indexOf(lRow) !== -1;
      };

      var initialize = function() {
        try {
          m_vRowCliProvUpdated = [];
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "Class_Initialize", C_MODULE, "");
        }
      };

      var destroy = function() {
        m_dialog = null;
        m_listController = null;
        m_vRowCliProvUpdated = null;
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
      var editor = Cairo.Usuario.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit(id);
    };

  });

  Cairo.module("Usuario.List", function(List, Cairo, Backbone, Marionette, $, _) {

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

          var editors = Cairo.Editors.usuarioEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.usuarioEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: getText(1130, ""),
            entityName: getText(1137, ""),  // TODO: fix language this is in uppercase we need to add a lower case for usuario
            entitiesName: getText(1130, "") // TODO: fix language this is in uppercase we need to add a lower case for usuarios
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
              var editor = Cairo.Usuario.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_USUARIO)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            var apiPath = Cairo.Database.getAPIVersion();
            return Cairo.Database.destroy(apiPath + "general/usuario", id, Cairo.Constants.DELETE_FUNCTION, "Usuario").success(
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
          Cairo.LoadingMessage.show("Usuarios", "Loading Usuarios from Crowsoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ usuarioTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.USUARIO,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.usuarioTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("Usuarios", "usuarioTreeRegion", "#sistema/usuarios", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());