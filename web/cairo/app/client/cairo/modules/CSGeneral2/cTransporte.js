(function() {
  "use strict";

  Cairo.module("Transporte.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      // cTransporte
      // 23-03-02

      var C_MODULE = "cTransporte";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_DESCRIP = 3;
      var K_TELEFONO = 4;
      var K_DIRECCION = 5;
      var K_MAIL = 6;
      var K_WEB = 7;
      var K_ACTIVE = 8;
      var K_PROV_ID = 9;
      var K_PRO_ID = 10;

      var K_HORARIO_M_DESDE = 52;
      var K_HORARIO_M_HASTA = 53;
      var K_HORARIO_T_DESDE = 54;
      var K_HORARIO_T_HASTA = 55;

      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_descrip = "";
      var m_telefono = "";
      var m_direccion = "";
      var m_mail = "";
      var m_web = "";
      var m_active;

      var m_pro_id = 0;
      var m_provincia = "";

      var m_provId = 0;
      var m_proveedor = "";

      var m_horario_m_desde = null;
      var m_horario_m_hasta = null;
      var m_horario_t_desde = null;
      var m_horario_t_hasta = null;

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

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, Cairo.Constants.NO_ID);

        var property = m_dialog.getProperties().item(Cairo.General.Constants.TRANS_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.TRANS_CODE));
        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.TRANS_NAME));

        m_copy = true;
      };

      self.editNew = function() {

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, Cairo.Constants.NO_ID);

        return load(Cairo.Constants.NO_ID).then(
          function() {
            return refreshCollection();
          }
        );
      };

      self.getApplication = function() {
        return Cairo.appName;
      };

      self.editDocumentsEnabled = function() {
        return m_id !== Cairo.Constants.NO_ID;
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

          if(m_id === Cairo.Constants.NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(Cairo.General.Constants.TRANSPORTE);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.SHOW_DOCUMENTS_FUNCTION, C_MODULE, "");
        }
              
        return _rtn;
      };

      self.messageEx = function(messageId,  info) {
        var _rtn = null;
        switch (messageId) {

          case Dialogs.Message.MSG_DOC_INFO:

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_TRANSPORTE);
            _rtn = Dialogs.Message.MSG_DOC_INFO_HANDLED;
            break;

          default:
            _rtn = true;
            break;
        }
      
        return Cairo.Promises.resolvedPromise(_rtn);
      };

      self.discardChanges = function() {
        return Cairo.Promises.resolvedPromise(refreshCollection());
      };

      self.propertyChange = function(key) {

        return Cairo.Promises.resolvedPromise(false);
      };

      self.save = function() {

        var register = new Cairo.Database.Register();
        var fields = register.getFields();

        register.setFieldId(Cairo.General.Constants.TRANS_ID);
        register.setTable(Cairo.General.Constants.TRANSPORTE);

        var apiPath = Cairo.Database.getAPIVersion();
        register.setPath(apiPath + "general/transporte");

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
              fields.add(Cairo.General.Constants.TRANS_NAME, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODE:
              fields.add(Cairo.General.Constants.TRANS_CODE, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_TELEFONO:
              fields.add(Cairo.General.Constants.TRANS_TELEFONO, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_DIRECCION:
              fields.add(Cairo.General.Constants.TRANS_DIRECCION, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_MAIL:
              fields.add(Cairo.General.Constants.TRANS_MAIL, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_WEB:
              fields.add(Cairo.General.Constants.TRANS_WEB, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_DESCRIP:
              fields.add(Cairo.General.Constants.TRANS_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_PROV_ID:
              fields.add(Cairo.General.Constants.PROV_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_PRO_ID:
              fields.add(Cairo.General.Constants.PRO_ID, property.getSelectId(), Cairo.Constants.Types.id);

              break;

            case K_HORARIO_M_DESDE:
              fields.add(Cairo.General.Constants.TRANS_HORARIO_MDESDE, property.getValue(), Cairo.Constants.Types.date);
              break;

            case K_HORARIO_M_HASTA:
              fields.add(Cairo.General.Constants.TRANS_HORARIO_MHASTA, property.getValue(), Cairo.Constants.Types.date);
              break;

            case K_HORARIO_T_DESDE:
              fields.add(Cairo.General.Constants.TRANS_HORARIO_TDESDE, property.getValue(), Cairo.Constants.Types.date);
              break;

            case K_HORARIO_T_HASTA:
              fields.add(Cairo.General.Constants.TRANS_HORARIO_THASTA, property.getValue(), Cairo.Constants.Types.date);

              break;
          }
        }

        return Cairo.Database.saveEx(
            register,
            false,
            Cairo.General.Constants.TRANS_CODE, 
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            Cairo.Language.getText(1495, "")).then(

          function(result) {
            if(result.success) {
                m_copy = false;
              return load(result.data.getId()).then(
                function (success) {
                  if(success) {
                    updateList();
                    m_listController.updateEditorKey(self, m_id);
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
        if(m_id === Cairo.Constants.NO_ID) { return; }
        if(m_listController === null) { return; }

        if(m_isNew) {
          m_listController.addLeave(m_id, m_branchId);
        }
        else {
          m_listController.refreshBranch(m_id, m_branchId);
        }
      };

      self.getPath = function() {
        return "#general/transporte/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "transporte" + id;
      };

      self.getTitle = function() {
        // Transportes
        return Cairo.Language.getText(1496, "");
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
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      self.getDialog = function() {
        return m_dialog;
      };

      self.setTreeId = function(value) {
        m_treeId = value;
      };

      self.getTreeId = function() {
        return m_treeId;
      };

      self.list = function() {
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_TRANSPORTE);
      };

      self.setDialog = function(value) {
        m_dialog = value;
      };

      self.isEditing = function() {
        return m_editing;
      };

      self.edit = function(id,  inModalWindow) {
        var p = Cairo.Promises.resolvedPromise(false);
        try {

          if(id === Cairo.Constants.NO_ID) {
            m_isNew = true;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_TRANSPORTE)) { return p; }
          } 
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_TRANSPORTE)) { return p; }
          }

          m_dialog.setInModalWindow(inModalWindow);

          p = load(id).then(
           function(success) {
              if(success) {

                if(!loadCollection()) { return false; }

                m_editing = true;
                m_copy = false;

                if(inModalWindow) {
                  success = m_id !== Cairo.Constants.NO_ID;
                } 
                else {
                  success = true;
                }

              }
              return success;
          });
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.EDIT_FUNCTION, C_MODULE, "");
      }
      
        return p;
      };

      self.setTree = function(value) {
        m_listController = value;
      };

      self.setBranchId = function(value) {
        m_branchId = value;
      };

      self.getBranchId = function() {
        return m_branchId;
      };

      var loadCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();
        properties.clear();

        var elem = properties.add(null, Cairo.General.Constants.TRANS_NAME);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(100);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        var elem = properties.add(null, Cairo.General.Constants.TRANS_CODE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setSize(15);
        elem.setValue(m_code);
        elem.setKey(K_CODE);

        var elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        var elem = properties.add(null, Cairo.General.Constants.TRANS_DIRECCION);
        elem.setType(Dialogs.PropertyType.text);
        // Direcci�n
        elem.setName(Cairo.Language.getText(1037, ""));
        elem.setSize(50);
        elem.setKey(K_DIRECCION);
        elem.setValue(m_direccion);

        var elem = properties.add(null, Cairo.General.Constants.TRANS_TELEFONO);
        elem.setType(Dialogs.PropertyType.text);
        // Tel�fono
        elem.setName(Cairo.Language.getText(1036, ""));
        elem.setSize(50);
        elem.setKey(K_TELEFONO);
        elem.setValue(m_telefono);

        var elem = properties.add(null, Cairo.General.Constants.PRO_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROVINCIA);
        // Provincia
        elem.setName(Cairo.Language.getText(1080, ""));
        elem.setKey(K_PRO_ID);
        elem.setValue(m_provincia);
        elem.setSelectId(m_pro_id);

        var elem = properties.add(null, Cairo.General.Constants.TRANS_MAIL);
        elem.setType(Dialogs.PropertyType.text);
        // Mail
        elem.setName(Cairo.Language.getText(1034, ""));
        elem.setSize(255);
        elem.setKey(K_MAIL);
        elem.setValue(m_mail);

        var elem = properties.add(null, Cairo.General.Constants.TRANS_WEB);
        elem.setType(Dialogs.PropertyType.text);
        // P�gina Web
        elem.setName(Cairo.Language.getText(1038, ""));
        elem.setSize(255);
        elem.setKey(K_WEB);
        elem.setValue(m_web);

        var elem = properties.add(null, Cairo.General.Constants.PROV_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROVEEDOR);
        // Proveedor
        elem.setName(Cairo.Language.getText(1151, ""));
        elem.setKey(K_PROV_ID);
        elem.setValue(m_proveedor);
        elem.setSelectId(m_provId);

        var elem = properties.add(null, Cairo.General.Constants.TRANS_HORARIO_MDESDE);
        elem.setType(Dialogs.PropertyType.time);
        // Horario desde
        elem.setName(Cairo.Language.getText(4965, ""));
        elem.setValue(m_horario_m_desde);
        elem.setKey(K_HORARIO_M_DESDE);

        var elem = properties.add(null, Cairo.General.Constants.TRANS_HORARIO_MHASTA);
        elem.setType(Dialogs.PropertyType.time);
        // Hasta
        elem.setName(Cairo.Language.getText(4966, ""));
        elem.setValue(m_horario_m_hasta);
        elem.setKey(K_HORARIO_M_HASTA);

        var elem = properties.add(null, Cairo.General.Constants.TRANS_HORARIO_TDESDE);
        elem.setType(Dialogs.PropertyType.time);
        // Desde
        elem.setName(Cairo.Language.getText(4967, ""));
        elem.setValue(m_horario_t_desde);
        elem.setKey(K_HORARIO_T_DESDE);

        var elem = properties.add(null, Cairo.General.Constants.TRANS_HORARIO_THASTA);
        elem.setType(Dialogs.PropertyType.time);
        // Hasta
        elem.setName(Cairo.Language.getText(4966, ""));
        elem.setValue(m_horario_t_hasta);
        elem.setKey(K_HORARIO_T_HASTA);

        var elem = properties.add(null, Cairo.General.Constants.TRANS_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setSize(255);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);

        if(!m_dialog.show(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(Cairo.General.Constants.TRANS_NAME);
        elem.setValue(m_name);

        var elem = properties.item(Cairo.General.Constants.TRANS_CODE);
        elem.setValue(m_code);

        var elem = properties.item(Cairo.Constants.ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        var elem = properties.item(Cairo.General.Constants.TRANS_DIRECCION);
        elem.setValue(m_direccion);

        var elem = properties.item(Cairo.General.Constants.TRANS_TELEFONO);
        elem.setValue(m_telefono);

        var elem = properties.item(Cairo.General.Constants.PRO_ID);
        elem.setValue(m_provincia);
        elem.setSelectId(m_pro_id);

        var elem = properties.item(Cairo.General.Constants.TRANS_MAIL);
        elem.setValue(m_mail);

        var elem = properties.item(Cairo.General.Constants.TRANS_WEB);
        elem.setValue(m_web);

        var elem = properties.item(Cairo.General.Constants.PROV_ID);
        elem.setValue(m_proveedor);
        elem.setSelectId(m_provId);

        var elem = properties.item(Cairo.General.Constants.TRANS_HORARIO_MDESDE);
        elem.setValue(m_horario_m_desde);

        var elem = properties.item(Cairo.General.Constants.TRANS_HORARIO_MHASTA);
        elem.setValue(m_horario_m_hasta);

        var elem = properties.item(Cairo.General.Constants.TRANS_HORARIO_TDESDE);
        elem.setValue(m_horario_t_desde);

        var elem = properties.item(Cairo.General.Constants.TRANS_HORARIO_THASTA);
        elem.setValue(m_horario_t_hasta);

        var elem = properties.item(Cairo.General.Constants.TRANS_DESCRIP);
        elem.setValue(m_descrip);

        return m_dialog.showValues(properties);
      };

      var load = function(id) {

        var apiPath = Cairo.Database.getAPIVersion();
        return Cairo.Database.getData("load[" + apiPath + "general/transporte]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== Cairo.Constants.NO_ID) {

              m_id = Cairo.Database.valField(response.data, Cairo.General.Constants.TRANS_ID);
              m_name = Cairo.Database.valField(response.data, Cairo.General.Constants.TRANS_NAME);
              m_code = Cairo.Database.valField(response.data, Cairo.General.Constants.TRANS_CODE);
              m_telefono = Cairo.Database.valField(response.data, Cairo.General.Constants.TRANS_TELEFONO);
              m_direccion = Cairo.Database.valField(response.data, Cairo.General.Constants.TRANS_DIRECCION);
              m_mail = Cairo.Database.valField(response.data, Cairo.General.Constants.TRANS_MAIL);
              m_web = Cairo.Database.valField(response.data, Cairo.General.Constants.TRANS_WEB);
              m_descrip = Cairo.Database.valField(response.data, Cairo.General.Constants.TRANS_DESCRIP);
              m_active = Cairo.Database.valField(response.data, Cairo.Constants.ACTIVE);
              m_provId = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_ID);
              m_proveedor = Cairo.Database.valField(response.data, Cairo.General.Constants.PROV_NAME);

              m_pro_id = Cairo.Database.valField(response.data, Cairo.General.Constants.PRO_ID);
              m_provincia = Cairo.Database.valField(response.data, Cairo.General.Constants.PRO_NAME);

              m_horario_m_desde = Cairo.Database.valField(response.data, Cairo.General.Constants.TRANS_HORARIO_MDESDE);
              m_horario_m_hasta = Cairo.Database.valField(response.data, Cairo.General.Constants.TRANS_HORARIO_MHASTA);
              m_horario_t_desde = Cairo.Database.valField(response.data, Cairo.General.Constants.TRANS_HORARIO_TDESDE);
              m_horario_t_hasta = Cairo.Database.valField(response.data, Cairo.General.Constants.TRANS_HORARIO_THASTA);

            } 
            else {
              m_id = Cairo.Constants.NO_ID;
              m_name = "";
              m_code = "";
              m_telefono = "";
              m_direccion = "";
              m_mail = "";
              m_web = "";
              m_descrip = "";
              m_active = true;
              m_provId = Cairo.Constants.NO_ID;
              m_proveedor = "";

              m_horario_m_desde = Cairo.Constants.NO_DATE;
              m_horario_m_hasta = Cairo.Constants.NO_DATE;
              m_horario_t_desde = Cairo.Constants.NO_DATE;
              m_horario_t_hasta = Cairo.Constants.NO_DATE;

              m_pro_id = Cairo.Constants.NO_ID;
              m_provincia = "";
            }

          return true;
        });
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
          Cairo.manageErrorEx(ex.message, "terminate", C_MODULE, "");
        }

        try {
          destroy();
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, "terminate", C_MODULE, "");
        }
      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("Transporte.List", function(List, Cairo, Backbone, Marionette, $, _) {
    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.transporteEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.transporteEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Transportes",
            entityName: "transporte",
            entitiesName: "transportes"
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
            if(id === Cairo.Constants.NO_ID) {
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
              var editor = Cairo.Transporte.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_TRANSPORTE)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            var apiPath = Cairo.Database.getAPIVersion();
            return Cairo.Database.destroy(apiPath + "general/transporte", id, Cairo.Constants.DELETE_FUNCTION, "Transporte").success(
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
          Cairo.LoadingMessage.show("Transportes", "Loading Transportes from CrowSoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ transporteTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.TRANSPORTE,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.transporteTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("Transportes", "transporteTreeRegion", "#general/transportes", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());