(function() {
  "use strict";

  Cairo.module("Provincia.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      // cProvincia
      // 31-07-00

      var C_MODULE = "cPronvincia";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_ACTIVE = 3;
      var K_DESCIP = 4;
      var K_PA_ID = 5;

      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_descrip = "";
      var m_pa_Id = 0;
      var m_pais = "";
      var m_activo;

      var m_editing;

      var m_dialog;
      var m_listController = null;

      var m_isNew;

      var m_branchId = 0;
      var m_treeId = 0;

      var m_copy;

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

        self.terminate();
        m_isNew = true;

        var property = m_dialog.getProperties().item(Cairo.General.Constants.PRO_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.PRO_CODE));
        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.PRO_NAME));

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

          var doc = new Cairo.DocDigital();

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

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_PROVINCIA);
            _rtn = Dialogs.Message.MSG_DOC_INFO_HANDLED;
            break;

          default:
            _rtn = true;
            break;
        }

        return Cairo.Promises.resolvedPromise(_rtn);
      };

      self.discardChanges = function() {
        return Cairo.Promises.resolvedPromise(loadCollection());
      };

      self.propertyChange = function(key) {

      };

      self.save = function() {

        var register = new Cairo.Database.Register();
        var fields = register.getFields();

        register.setFieldId(Cairo.General.Constants.PRO_ID);
        register.setTable(Cairo.General.Constants.PROVINCIA);

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
              fields.add(Cairo.General.Constants.PRO_NAME, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODE:
              fields.add(Cairo.General.Constants.PRO_CODE, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_DESCIP:
              fields.add(Cairo.General.Constants.PRO_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_PA_ID:
              fields.add(Cairo.General.Constants.PA_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.boolean);
              break;
          }
        }

        // Error saving Provincias
        return Cairo.Database.saveEx(
            register,
            false,
            Cairo.General.Constants.PRO_CODE,
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            Cairo.Language.getText(1409, "")).then(

          function(result) {
            if(result.success) {
              m_copy = false;
              return load(result.id);

            }
            else {
              return false;
            }
          });
      };

      self.terminate = function() {

        m_editing = false;

        try {
          if(m_id == Cairo.Constants.NO_ID) { return; }
          if(m_listController == null) { return; }

          if(m_isNew) {
            m_listController.addLeave(m_id, m_branchId, m_treeId);
          }
          else {
            m_listController.addEditedId(m_id);
            m_listController.refreshActiveBranch();
          }
        }
        catch (ex) {
        }
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
            case K_NAME:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.text)) {
                return Cairo.Modal.showInfo(Cairo.Constants.MUST_SET_A_NAME).then(function() {return false;});
              }
              break;

            case K_CODE:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.text)) {
                property.setValue(Cairo.Constants.GET_CODE_FROM_ID);
              }
              break;

            case K_PA_ID:
              if(Cairo.Util.valEmpty(property.getSelectId(), Cairo.Constants.Types.id)) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1411, "")).then(function() {return false;});
                //Debe indicar un País
              }
              break;

            case K_ACTIVE:
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
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_PROVINCIA);
      };

      self.setDialog = function(rhs) {
        m_dialog = rhs;
      };

      self.isEditing = function() {
        return m_editing;
      };

      self.delete = function(id) {
        if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_PROVINCIA)) {
          return Cairo.Promises.resolvedPromise(false);
        }

        return Cairo.Database.execute(Cairo.Constants.DELETE_FUNCTION, "cProvincia");
      };

      self.edit = function(id,  inModalWindow) {
        var p = Cairo.Promises.resolvedPromise(false);
        try {

          if(id == Cairo.Constants.NO_ID) {
            m_isNew = true;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_PROVINCIA)) { return p; }
          }
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_PROVINCIA)) { return p; }
          }

          m_dialog.setInModalWindow(inModalWindow);

          p = load(id).then(
            function(success) {
              if(success) {

                if(!loadCollection()) { return false; }

                m_editing = true;
                m_copy = false;

                if(inModalWindow) {
                  success = m_id != Cairo.Constants.NO_ID;
                }
                else {
                  success = true;
                }

              }
              return success;
            });
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, Cairo.Constants.EDIT_FUNCTION, "cProvincia", "");
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

        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, Cairo.General.Constants.PRO_NAME);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(100);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        var elem = properties.add(null, Cairo.General.Constants.PRO_CODE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setSize(15);
        elem.setValue(m_code);
        elem.setKey(K_CODE);

        var elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVE);
        elem.setValue(m_activo === true ? 1 : 0);

        var elem = properties.add(null, Cairo.General.Constants.PA_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.PAIS);
        //'País
        elem.setName(Cairo.Language.getText(1212, ""));
        elem.setKey(K_PA_ID);
        elem.setValue(m_pais);
        elem.setSelectId(m_pa_Id);

        var elem = properties.add(null, Cairo.General.Constants.PRO_DESCRIP);
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

        var apiPath = Cairo.Database.getAPIVersion();
        return Cairo.Database.getData("load[" + apiPath + "general/provincia]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id === 0) {
              m_activo = true;
              m_name = "";
              m_code = "";
              m_descrip = "";
              m_id = Cairo.Constants.NO_ID;
              m_pa_Id = Cairo.Constants.NO_ID;
              m_pais = "";
            }
            else {
              m_activo = Cairo.Database.valField(response.data, Cairo.Constants.ACTIVE);
              m_name = Cairo.Database.valField(response.data, Cairo.General.Constants.PRO_NAME);
              m_code = Cairo.Database.valField(response.data, Cairo.General.Constants.PRO_CODE);
              m_descrip = Cairo.Database.valField(response.data, Cairo.General.Constants.PRO_DESCRIP);
              m_id = Cairo.Database.valField(response.data, Cairo.General.Constants.PRO_ID);
              m_pa_Id = Cairo.Database.valField(response.data, Cairo.General.Constants.PA_ID);
              m_pais = Cairo.Database.valField(response.data, Cairo.General.Constants.PA_NAME);
            }

            return true;
          });
      };

      self.destroy = function() {
        m_dialog = null;
        m_listController = null;
      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("Provincia.List", function(List, Cairo, Backbone, Marionette, $, _) {
    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Provincias",
            entityName: "provincia",
            entitiesName: "provincias"
          });

          self.showBranch = function(branchId) {
            Cairo.log("Loading nodeId: " + branchId);
            Cairo.Tree.List.Controller.listBranch(branchId, Cairo.Tree.List.Controller.showItems, self);
          };

          self.addLeave = function(id, branchId, treeId) { /* TODO: implement this. */ };
          self.addEditedId = function(id) { /* TODO: implement this. */ };
          self.refreshActiveBranch = function() { /* TODO: implement this. */ };

          self.edit = function(id) {
            var editor = Cairo.Provincia.Edit.Controller.getEditor();
            editor.setDialog(Cairo.Dialogs.View.Controller.newDialog());
            editor.edit(id);
          };

          // progress message
          //
          Cairo.LoadingMessage.show("Provincias", "Loading provincia from Crowsoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ provinciaTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.PROVINCIA,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.provinciaTreeRegion,
            self);

        };

        // create the tab
        //
        Cairo.mainTab.showTab("Provincias", "provinciaTreeRegion", "#general/provincias", createTreeDialog);

      }
    };
  });


}());

