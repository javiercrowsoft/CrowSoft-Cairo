(function() {
  "use strict";

  Cairo.module("Banco.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Entities.Dialogs;

      // cBanco
      // 31-01-01

      var C_MODULE = "cBanco";

      var K_NOMBRE = 1;
      var K_CODIGO = 2;
      var K_CONTACTO = 3;
      var K_TELEFONO = 4;
      var K_DIRECCION = 5;
      var K_WEB = 6;
      var K_MAIL = 7;
      var K_ACTIVO = 8;
      var m_id = 0;
      var m_nombre = "";
      var m_codigo = "";
      var m_activo;
      var m_contacto = "";
      var m_telefono = "";
      var m_direccion = "";
      var m_web = "";
      var m_mail = "";

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

          doc.setClientTable(Cairo.General.Constants.BANCO);
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

            Cairo.Documentation.show("", "", csGeneralPrestacion.cSPREGNEWBANCO);
            _rtn = Dialogs.Message.MSG_DOC_INFO_HANDLED;
            break;

          default:
            _rtn = true;
            break;
        }

        return Cairo.Promises.resolvedPromise(_rtn);
      };

      self.copy = function() {

        self.terminate();
        m_isNew = true;

        var property = m_dialog.getProperties().item(Cairo.General.Constants.BCOCODIGO);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.BCOCODIGO));
        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.BCONOMBRE));

        m_copy = true;
      };

      self.discardChanges = function() {
        return Cairo.Promises.resolvedPromise(loadCollection());
      };

      self.editNew = function() {

        self.terminate();
        m_isNew = true;

        return self.edit(Cairo.Constants.NO_ID);
      };

      self.propertyChange = function(key) {

      };

      self.save = function() {

        var register = new Cairo.Database.Register();
        var fields = register.getFields();

        register.setFieldId(Cairo.General.Constants.BCOID);
        register.setTable(Cairo.General.Constants.BANCO);

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
              fields.add(Cairo.General.Constants.BCONOMBRE, property.getValue(), Cairo.Constants.Types.TEXT);
              break;

            case K_CODIGO:
              fields.add(Cairo.General.Constants.BCOCODIGO, property.getValue(), Cairo.Constants.Types.TEXT);
              break;

            case K_ACTIVO:
              fields.add(Cairo.Constants.ACTIVE, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.BOOLEAN);
              break;

            case K_CONTACTO:
              fields.add(Cairo.General.Constants.BCOCONTACTO, property.getValue(), Cairo.Constants.Types.TEXT);
              break;

            case K_TELEFONO:
              fields.add(Cairo.General.Constants.BCOTELEFONO, property.getValue(), Cairo.Constants.Types.TEXT);
              break;

            case K_DIRECCION:
              fields.add(Cairo.General.Constants.BCODIRECCION, property.getValue(), Cairo.Constants.Types.TEXT);
              break;

            case K_WEB:
              fields.add(Cairo.General.Constants.BCOWEB, property.getValue(), Cairo.Constants.Types.TEXT);
              break;

            case K_MAIL:
              fields.add(Cairo.General.Constants.BCOMAIL, property.getValue(), Cairo.Constants.Types.TEXT);
              break;
          }
        }

        fields.setHaveLastUpdate(true);
        fields.setHaveWhoModify(true);

        return Cairo.Database.saveEx(
            register,
            false,
            Cairo.General.Constants.BCOCODIGO,
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            Cairo.Language.getText(1039, "")).then(

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
        return Cairo.Language.getText(1040, "");
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
        return Cairo.Security.hasPermissionTo(csGeneralPrestacion.cSPREGLISTBANCO);
      };

      self.setDialog = function(rhs) {
        m_dialog = rhs;
      };

      self.isEditing = function() {
        return m_editing;
      };

      self.delete = function(id) {
        if(!Cairo.Security.hasPermissionTo(csGeneralPrestacion.cSPREGDELETEBANCO)) {
          return Cairo.Promises.resolvedPromise(false);
        }

        return Cairo.Database.execute(Cairo.Constants.DELETE_FUNCTION, C_MODULE);
      };

      self.edit = function(id,  inModalWindow) {
        var p = Cairo.Promises.resolvedPromise(false);
        try {

          if(id == Cairo.Constants.NO_ID) {
            m_isNew = true;
            if(!Cairo.Security.hasPermissionTo(csGeneralPrestacion.cSPREGNEWBANCO)) { return p; }
          }
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(csGeneralPrestacion.cSPREGEDITBANCO)) { return p; }
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

        var elem = properties.add(null, Cairo.General.Constants.BCONOMBRE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(100);
        elem.setWidth(4500);
        elem.setKey(K_NOMBRE);
        elem.setValue(m_nombre);

        var elem = properties.add(null, Cairo.General.Constants.BCOCODIGO);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setSize(15);
        elem.setValue(m_codigo);
        elem.setKey(K_CODIGO);

        var elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setLeftNotChange(true);
        elem.setLeft(7100);
        elem.setWidth(500);
        elem.setLeftLabel(-800);
        elem.setTopFromProperty(Cairo.General.Constants.BCONOMBRE);
        elem.setTopNotChange(true);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVO);
        elem.setValue(m_activo === true ? 1 : 0);

        var elem = properties.add(null, Cairo.General.Constants.BCOMAIL);
        elem.setType(Dialogs.PropertyType.text);
        //' mail
        elem.setName(Cairo.Language.getText(1034, ""));
        elem.setSize(255);
        elem.setKey(K_MAIL);
        elem.setValue(m_mail);
        elem.setTopFromProperty(Cairo.General.Constants.BCOCODIGO);
        elem.setLeftNotChange(true);
        elem.setTopNotChange(true);
        elem.setLeftLabel(-500);
        elem.setLeft(4500);
        elem.setWidth(3550);

        var elem = properties.add(null, Cairo.General.Constants.BCOCONTACTO);
        elem.setType(Dialogs.PropertyType.text);
        //' contacto
        elem.setName(Cairo.Language.getText(1035, ""));
        elem.setHeight(660);
        elem.setWidth(6500);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setSize(500);
        elem.setKey(K_CONTACTO);
        elem.setValue(m_contacto);

        var elem = properties.add(null, Cairo.General.Constants.BCOTELEFONO);
        elem.setType(Dialogs.PropertyType.text);
        //' telefono
        elem.setName(Cairo.Language.getText(1036, ""));
        elem.setSize(255);
        elem.setKey(K_TELEFONO);
        elem.setWidth(6500);
        elem.setValue(m_telefono);

        var elem = properties.add(null, Cairo.General.Constants.BCODIRECCION);
        elem.setType(Dialogs.PropertyType.text);
        //' Dirección
        elem.setName(Cairo.Language.getText(1037, ""));
        elem.setSize(255);
        elem.setKey(K_DIRECCION);
        elem.setWidth(6500);
        elem.setValue(m_direccion);

        var elem = properties.add(null, Cairo.General.Constants.BCOWEB);
        elem.setType(Dialogs.PropertyType.text);
        //' Web
        elem.setName(Cairo.Language.getText(1038, ""));
        elem.setSize(255);
        elem.setKey(K_WEB);
        elem.setWidth(6500);
        elem.setValue(m_web);

        if(!m_dialog.show(this)) { return false; }

        return true;
      };

      var load = function(id) {

        return Cairo.Database.getData("load[cBanco]", id).then(
          function(response) {

            if(response.success === false) { return false; }

            if(response.data.length === 0) {
              m_activo = true;
              m_nombre = "";
              m_codigo = "";
              m_id = Cairo.Constants.NO_ID;
              m_contacto = "";
              m_telefono = "";
              m_direccion = "";
              m_web = "";
              m_mail = "";
            }
            else {
              m_activo = Cairo.Database.valField(response.data, Cairo.Constants.ACTIVE);
              m_nombre = Cairo.Database.valField(response.data, Cairo.General.Constants.BCONOMBRE);
              m_codigo = Cairo.Database.valField(response.data, Cairo.General.Constants.BCOCODIGO);
              m_id = Cairo.Database.valField(response.data, Cairo.General.Constants.BCOID);
              m_contacto = Cairo.Database.valField(response.data, Cairo.General.Constants.BCOCONTACTO);
              m_telefono = Cairo.Database.valField(response.data, Cairo.General.Constants.BCOTELEFONO);
              m_direccion = Cairo.Database.valField(response.data, Cairo.General.Constants.BCODIRECCION);
              m_web = Cairo.Database.valField(response.data, Cairo.General.Constants.BCOWEB);
              m_mail = Cairo.Database.valField(response.data, Cairo.General.Constants.BCOMAIL);
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

  Cairo.module("Banco.List", function(List, Cairo, Backbone, Marionette, $, _) {
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
            entitiesTitle: "Bancos",
            entityName: "banco",
            entitiesName: "bancos"
          });

          self.showBranch = function(branchId) {
            Cairo.log("Loading nodeId: " + branchId);
            Cairo.Tree.List.Controller.listBranch(branchId, Cairo.Tree.List.Controller.showItems, self);
          };

          // progress message
          //
          Cairo.LoadingMessage.show("Bancos", "Loading banco from Crowsoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ bancoTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.BANCO,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.bancoTreeRegion,
            self);

        };

        // create the tab
        //
        Cairo.mainTab.showTab("Bancos", "bancoTreeRegion", "#general/bancos", createTreeDialog);

      }
    };
  });


}());

