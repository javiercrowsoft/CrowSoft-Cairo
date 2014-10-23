(function() {
  "use strict";

  Cairo.module("Clearing.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Entities.Dialogs;

      // cClearing
      // 12-02-01

      var C_MODULE = "cClearing";

      var K_NOMBRE = 1;
      var K_CODIGO = 2;
      var K_ACTIVO = 3;
      var K_DESCRIPCION = 4;
      var K_DIAS = 5;
      var m_id = 0;
      var m_nombre = "";
      var m_codigo = "";
      var m_activo;
      var m_descripcion = "";
      var m_dias = 0;

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

        var property = m_dialog.getProperties().item(Cairo.General.Constants.CLECODIGO);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.CLECODIGO));
        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.CLENOMBRE));

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

          var doc = new cDocDigital();

          doc.setClientTable(Cairo.General.Constants.CLEARING);
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

            Cairo.Documentation.show("", "", csGeneralPrestacion.cSPREGNEWCLEARING);
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

        register.setFieldId(Cairo.General.Constants.CLEID);
        register.setTable(Cairo.General.Constants.CLEARING);

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
              fields.add(Cairo.General.Constants.CLENOMBRE, property.getValue(), Cairo.Constants.Types.TEXT);
              break;

            case K_CODIGO:
              fields.add(Cairo.General.Constants.CLECODIGO, property.getValue(), Cairo.Constants.Types.TEXT);
              break;

            case K_ACTIVO:
              fields.add(Cairo.Constants.ACTIVE, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.BOOLEAN);
              break;

            case K_DESCRIPCION:
              fields.add(Cairo.General.Constants.CLEDESCRIP, property.getValue(), Cairo.Constants.Types.TEXT);
              break;

            case K_DIAS:
              fields.add(Cairo.General.Constants.CLEDIAS, property.getValue(), Cairo.Constants.Types.INTEGER);
              break;
          }
        }

        fields.setHaveLastUpdate(true);
        fields.setHaveWhoModify(true);

        // Error saving Clearings
        return Cairo.Database.saveEx(
            register,
            false,
            Cairo.General.Constants.CLECODIGO,
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            Cairo.Language.getText(1081, "")).then(

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
        //'Clearings
        return Cairo.Language.getText(1084, "");
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
        return Cairo.Security.hasPermissionTo(csGeneralPrestacion.cSPREGLISTCLEARING);
      };

      self.setDialog = function(rhs) {
        m_dialog = rhs;
      };

      self.isEditing = function() {
        return m_editing;
      };

      self.delete = function(id) {
        if(!Cairo.Security.hasPermissionTo(csGeneralPrestacion.cSPREGDELETECLEARING)) {
          return Cairo.Promises.resolvedPromise(false);
        }

        return Cairo.Database.execute(Cairo.Constants.DELETE_FUNCTION, C_MODULE);
      };

      self.edit = function(id,  inModalWindow) {
        var p = Cairo.Promises.resolvedPromise(false);
        try {

          if(id == Cairo.Constants.NO_ID) {
            m_isNew = true;
            if(!Cairo.Security.hasPermissionTo(csGeneralPrestacion.cSPREGNEWCLEARING)) { return p; }
          }
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(csGeneralPrestacion.cSPREGEDITCLEARING)) { return p; }
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
          Cairo.manageErrorEx(ex.message, C_EditGenericEdit, C_MODULE, "");
        }

        return p;
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

        var elem = properties.add(null, Cairo.General.Constants.CLENOMBRE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(100);
        elem.setWidth(6500);
        elem.setKey(K_NOMBRE);
        elem.setValue(m_nombre);

        var elem = properties.add(null, Cairo.General.Constants.CLECODIGO);
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

        var elem = properties.add(null, Cairo.General.Constants.CLEDIAS);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.Integer);
        //'Días
        elem.setName(Cairo.Language.getText(1085, ""));
        elem.setKey(K_DIAS);
        elem.setValue(m_dias);
        elem.setWidth(800);

        var elem = properties.add(null, Cairo.General.Constants.CLEDESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setKey(K_DESCRIPCION);
        elem.setValue(m_descripcion);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setWidth(6500);
        elem.setHeight(780);

        if(!m_dialog.show(this)) { return false; }

        return true;
      };

      var load = function(id) {

        return Cairo.Database.getData("load[cClearing]", id).then(
          function(response) {

            if(response.success === false) { return false; }

            if(response.data.length === 0) {
              m_activo = true;
              m_nombre = "";
              m_codigo = "";
              m_id = Cairo.Constants.NO_ID;
              m_descripcion = "";
              m_dias = 0;
            }
            else {
              m_activo = Cairo.Database.valField(response.data, Cairo.Constants.ACTIVE);
              m_nombre = Cairo.Database.valField(response.data, Cairo.General.Constants.CLENOMBRE);
              m_codigo = Cairo.Database.valField(response.data, Cairo.General.Constants.CLECODIGO);
              m_id = Cairo.Database.valField(response.data, Cairo.General.Constants.CLEID);
              m_descripcion = Cairo.Database.valField(response.data, Cairo.General.Constants.CLEDESCRIP);
              m_dias = Cairo.Database.valField(response.data, Cairo.General.Constants.CLEDIAS);
            }

            return true;
          });

      };

      self.destroy = function() {
        m_dialog = null;
        m_objTree = null;
      };

      return self;
    };

    Edit.Controller = createObject();

  });

  Cairo.module("Clearing.List", function(List, Cairo, Backbone, Marionette, $, _) {
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
            entitiesTitle: "Clearings",
            entityName: "clearing",
            entitiesName: "clearings"
          });

          self.showBranch = function(branchId) {
            Cairo.log("Loading nodeId: " + branchId);
            Cairo.Tree.List.Controller.listBranch(branchId, Cairo.Tree.List.Controller.showItems, self);
          };

          // progress message
          //
          Cairo.LoadingMessage.show("Clearings", "Loading clearing from Crowsoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ clearingTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.CLEARING,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.clearingTreeRegion,
            self);

        };

        // create the tab
        //
        Cairo.mainTab.showTab("Clearings", "clearingTreeRegion", "#general/clearings", createTreeDialog);

      }
    };
  });


}());

