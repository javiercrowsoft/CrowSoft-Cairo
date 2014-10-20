(function() {
  "use strict";

  Cairo.module("Provincia.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {
    Edit.Controller = createObject();

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Entities.Dialogs;

      // cProvincia
      // 31-07-00

      var C_MODULE = "cPronvincia";

      var K_NOMBRE = 1;
      var K_CODIGO = 2;
      var K_ACTIVO = 3;
      var K_DESCIP = 4;
      var K_PA_ID = 5;
      var m_id = 0;
      var m_nombre = "";
      var m_codigo = "";
      var m_descrip = "";
      var m_pa_Id = 0;
      var m_pais = "";
      var m_activo;

      var m_editing;

      var m_dialog;
      var m_objTree = null;

      var m_isNew;

      var m_branchId = 0;
      var m_treeId = 0;

      var m_host;
      var m_copy;

      self.getId = function() {
        return m_id;
      };

      self.getName = function() {
        return m_nombre;
      };

      self.getCode = function() {
        return m_codigo;
      };

      self.copy = function() {

        self.terminate();
        m_isNew = true;

        var property = m_dialog.getProperties().item(Cairo.General.Constants.PROCODIGO);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.PROCODIGO));
        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.PRONOMBRE));

        m_copy = true;
      };

      self.editNew = function() {

        self.terminate();
        m_isNew = true;

        return self.edit(Cairo.Constants.NO_ID);
      };

      self.getApplication = function() {
        return Cairo.appName;
      };

      self.editDocumentsEnabled = function() {
        return m_id != Cairo.Constants.NO_ID;
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

          if(m_id == Cairo.Constants.NO_ID) { return _rtn; }

          var doc = null;
          doc = new cDocDigital();

          doc.setClientTable(Cairo.General.Constants.PROVINCIA);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, Cairo.Constants.SHOW_DOCUMENTS_FUNCTION, C_MODULE, "");
        }

        return _rtn;
      };

      self.messageEx = function(messageID,  info) {
        var _rtn = null;
        switch (messageID) {

          case Dialogs.Message.MSG_DOC_INFO:

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_Provincia);
            _rtn = Dialogs.Message.MSG_DOC_INFO_HANDLED;
            break;

          default:
            _rtn = true;
            break;
        }

        return Cairo.Promises.resolvedPromise(_rtn);
      };

      self.discardChanges = function() {
        loadCollection();
      };

      self.propertyChange = function(key) {

      };

      self.save = function() {

        var register = new Cairo.Database.Register();
        var fields = register.getFields();

        register.setFieldId(Cairo.General.Constants.PROID);
        register.setTable(Cairo.General.Constants.PROVINCIA);

        if(m_copy) {
          register.setID(csConstIds.cSNEW);
        }
        else {
          register.setID(m_id);
        }

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          var property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NOMBRE:
              fields.add(Cairo.General.Constants.PRONOMBRE, property.getValue(), Cairo.Constants.Types.TEXT);
              break;

            case K_CODIGO:
              fields.add(Cairo.General.Constants.PROCODIGO, property.getValue(), Cairo.Constants.Types.TEXT);
              break;

            case K_DESCIP:
              fields.add(Cairo.General.Constants.PRODESCRIP, property.getValue(), Cairo.Constants.Types.TEXT);
              break;

            case K_PA_ID:
              fields.add(Cairo.General.Constants.PAID, property.getSelectId(), Cairo.Constants.Types.ID);
              break;

            case K_ACTIVO:
              fields.add(Cairo.Constants.ACTIVE, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.BOOLEAN);
              break;
          }
        }

        fields.setHaveLastUpdate(true);
        fields.setHaveWhoModify(true);
        // Error saving Provincias
        return Cairo.Database.saveEx(
            register,
            false,
            Cairo.General.Constants.PROCODIGO,
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            Cairo.Language.getText(1409, "")).then(

          function(result) {
            if(result) {
              m_copy = false;
              return load(register.getID());

            }
            else {
              return false;
            }
          });
      };

      self.terminate = function() {
        var _rtn = null;
        m_editing = false;

        _rtn = true;
        try {
          if(m_id == Cairo.Constants.NO_ID) { return _rtn; }
          if(m_objTree == null) { return _rtn; }

          if(m_isNew) {
            m_objTree.addLeave(m_id, m_branchId, m_treeId);
          }
          else {
            m_objTree.addEditedId(m_id);
            m_objTree.refreshActiveBranch();
          }
        }
        catch (ex) {
        }

        return _rtn;
      };

      self.title = function() {
        //'Provincias
        return Cairo.Language.getText(1410, "");
      };

      self.validate = function() {
        var property = null;

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NOMBRE:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.TEXT)) {
                return Cairo.Modal.showInfo(Cairo.Constants.MUST_SET_A_NAME).then(function() {return false;});
              }
              break;

            case K_CODIGO:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.TEXT)) {
                property.setValue(Cairo.Constants.GET_CODE_FROM_ID);
              }
              break;

            case K_PA_ID:
              if(Cairo.Util.valEmpty(property.getSelectId(), Cairo.Constants.Types.ID)) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1411, "")).then(function() {return false;});
                //Debe indicar un País
              }
              break;

            case K_ACTIVO:
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
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_Provincia);
      };

      self.setDialog = function(rhs) {
        m_dialog = rhs;
      };

      self.isEditing = function() {
        return m_editing;
      };

      self.delete = function(id) {
        if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_Provincia)) {
          return Cairo.Promises.resolvedPromise(false);
        }

        return Cairo.Database.execute(Cairo.Constants.DELETE_FUNCTION, "cProvincia");
      };

      self.edit = function(id,  inModalWindow) {
        var _rtn = null;
        try {

          if(id == Cairo.Constants.NO_ID) {
            m_isNew = true;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_Provincia)) { return _rtn; }
          }
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_Provincia)) { return _rtn; }
          }

          m_dialog.setInModalWindow(inModalWindow);

          if(!load(id)) { return _rtn; }

          if(!loadCollection()) { return _rtn; }

          m_editing = true;
          m_copy = false;

          if(inModalWindow) {
            _rtn = m_id != Cairo.Constants.NO_ID;
          }
          else {
            _rtn = true;
          }

          return _rtn;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, C_EditGenericEdit, "cProvincia", "");
        }

        return _rtn;
      };

      self.setTree = function(rhs) {
        m_objTree = rhs;
      };

      self.setBranchId = function(rhs) {
        m_branchId = rhs;
      };

      self.getBranchId = function() {
        return m_branchId;
      };

      var loadCollection = function() {

        m_dialog.setTitle(m_nombre);

        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, Cairo.General.Constants.PRONOMBRE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(100);
        elem.setKey(K_NOMBRE);
        elem.setValue(m_nombre);

        var elem = properties.add(null, Cairo.General.Constants.PROCODIGO);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setSize(15);
        elem.setValue(m_codigo);
        elem.setKey(K_CODIGO);

        var elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVO);
        elem.setValue(m_activo === true ? 1 : 0);

        var elem = properties.add(null, Cairo.General.Constants.PAID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.PAIS);
        //'País
        elem.setName(Cairo.Language.getText(1212, ""));
        elem.setKey(K_PA_ID);
        elem.setValue(m_pais);
        elem.setSelectId(m_pa_Id);

        var elem = properties.add(null, Cairo.General.Constants.PRODESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setSize(255);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setWidth(5000);
        elem.setHeight(880);
        elem.setValue(m_descrip);
        elem.setKey(K_DESCIP);

        if(!m_dialog.show(this)) { return false; }

        return true;
      };

      var load = function(id) {

        return Cairo.Database.getData("load[cProvincia").then(
          function(response) {

            if(response.success === false || response.data.length === 0) {
              m_activo = true;
              m_nombre = "";
              m_codigo = "";
              m_descrip = "";
              m_id = Cairo.Constants.NO_ID;
              m_pa_Id = Cairo.Constants.NO_ID;
              m_pais = "";
            }
            else {
              m_activo = Cairo.Database.valField(response.data, Cairo.Constants.ACTIVE);
              m_nombre = Cairo.Database.valField(response.data, Cairo.General.Constants.PRONOMBRE);
              m_codigo = Cairo.Database.valField(response.data, Cairo.General.Constants.PROCODIGO);
              m_descrip = Cairo.Database.valField(response.data, Cairo.General.Constants.PRODESCRIP);
              m_id = Cairo.Database.valField(response.data, Cairo.General.Constants.PROID);
              m_pa_Id = Cairo.Database.valField(response.data, Cairo.General.Constants.PAID);
              m_pais = Cairo.Database.valField(response.data, Cairo.General.Constants.PANOMBRE);
            }

          });
      };

      self.destroy = function() {
        m_dialog = null;
        m_objTree = null;
      };

      return self;
    };

  })

}());

