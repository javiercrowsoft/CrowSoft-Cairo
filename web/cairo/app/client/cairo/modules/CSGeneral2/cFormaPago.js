(function() {
  "use strict";

  Cairo.module("FormaPago.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;

      var C_MODULE = "cFormaPago";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_DESCRIP = 3;
      var K_ACTIVE = 4;

      var K_LUNES = 5;
      var K_MARTES = 6;
      var K_MIERCOLES = 7;
      var K_JUEVES = 8;
      var K_VIERNES = 9;
      var K_SABADO = 10;
      var K_DOMINGO = 11;

      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_descrip = "";
      var m_active;

      var m_lunes;
      var m_martes;
      var m_miercoles;
      var m_jueves;
      var m_viernes;
      var m_sabado;
      var m_domingo;

      var m_editing;

      var m_dialog;
      var m_listController = null;

      var m_isNew;

      var m_branchId = 0;
      var m_treeId = 0;

      var m_copy;

      var m_apiPath = Cairo.Database.getAPIVersion();

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

        m_listController.updateEditorKey(self, NO_ID);

        var property = m_dialog.getProperties().item(C.FP_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(C.FP_CODE));
        m_dialog.showValue(m_dialog.getProperties().item(C.FP_NAME));

        m_copy = true;
      };

      self.editNew = function() {

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, NO_ID);

        return load(NO_ID).then(
          function() {
            return refreshCollection();
          }
        );
      };

      self.getApplication = function() {
        return Cairo.appName;
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

          doc.setClientTable(C.FORMAPAGO);
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
        switch (messageId) {

          case Dialogs.Message.MSG_DOC_INFO:

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_FORMAPAGO);
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

        register.setFieldId(C.FP_ID);
        register.setTable(C.FORMAPAGO);

        register.setPath(m_apiPath + "general/formapago");

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
              fields.add(C.FP_NAME, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODE:
              fields.add(C.FP_CODE, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_DESCRIP:
              fields.add(C.FP_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_LUNES:
              fields.add(C.FP_LUNES, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_MARTES:
              fields.add(C.FP_MARTES, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_MIERCOLES:
              fields.add(C.FP_MIERCOLES, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_JUEVES:
              fields.add(C.FP_JUEVES, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_VIERNES:
              fields.add(C.FP_VIERNES, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_SABADO:
              fields.add(C.FP_SABADO, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_DOMINGO:
              fields.add(C.FP_DOMINGO, property.getValue(), Cairo.Constants.Types.boolean);
              break;
          }
        }

        return Cairo.Database.saveEx(
            register,
            false,
            C.FP_CODE,
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            getText(5060, "")).then(

          function(result) {
            if(result.success) {
                m_copy = false;
              return load(result.data.getId()).then(
                function (success) {
                  if(success) {
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
        return "#general/formapago/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "formapago" + id;
      };

      self.getTitle = function() {
        return getText(5059, "");
      };

      self.validate = function() {

        var property = null;

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NAME:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.text)) {
                return Cairo.Modal.showInfoWithFalse(Cairo.Constants.MUST_SET_A_NAME);
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
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_FORMAPAGO);
      };

      self.setDialog = function(value) {
        m_dialog = value;
      };

      self.isEditing = function() {
        return m_editing;
      };

      self.edit = function(id, inModalWindow) {
        var p = Cairo.Promises.resolvedPromise(false);
        try {

          if(id === NO_ID) {
            m_isNew = true;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_FORMAPAGO)) { return p; }
          } 
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_FORMAPAGO)) { return p; }
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

        var elem = properties.add(null, C.FP_NAME);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(50);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        var elem = properties.add(null, C.FP_CODE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setSize(10);
        elem.setKey(K_CODE);
        elem.setValue(m_code);

        var elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        var elem = properties.add(null, C.FP_LUNES);
        elem.setType(Dialogs.PropertyType.check);
        elem.setValue(Cairo.Util.boolToInt(m_lunes));
        elem.setName(getText(5063, ""));
        elem.setKey(K_LUNES);

        var elem = properties.add(null, C.FP_MARTES);
        elem.setType(Dialogs.PropertyType.check);
        elem.setValue(Cairo.Util.boolToInt(m_martes));
        elem.setName(getText(5064, ""));
        elem.setKey(K_MARTES);

        var elem = properties.add(null, C.FP_MIERCOLES);
        elem.setType(Dialogs.PropertyType.check);
        elem.setValue(Cairo.Util.boolToInt(m_miercoles));
        elem.setName(getText(5065, ""));
        elem.setKey(K_MIERCOLES);

        var elem = properties.add(null, C.FP_JUEVES);
        elem.setType(Dialogs.PropertyType.check);
        elem.setValue(Cairo.Util.boolToInt(m_jueves));
        elem.setName(getText(5066, ""));
        elem.setKey(K_JUEVES);

        var elem = properties.add(null, C.FP_VIERNES);
        elem.setType(Dialogs.PropertyType.check);
        elem.setValue(Cairo.Util.boolToInt(m_viernes));
        elem.setName(getText(5067, ""));
        elem.setKey(K_VIERNES);

        var elem = properties.add(null, C.FP_SABADO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setValue(Cairo.Util.boolToInt(m_sabado));
        elem.setName(getText(5068, ""));
        elem.setKey(K_SABADO);

        var elem = properties.add(null, C.FP_DOMINGO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setValue(Cairo.Util.boolToInt(m_domingo));
        elem.setName(getText(5069, ""));
        elem.setKey(K_DOMINGO);

        var elem = properties.add(null, C.FP_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setSize(255);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);

        if(!m_dialog.show(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(C.FP_NAME);
        elem.setValue(m_name);

        var elem = properties.item(C.FP_CODE);
        elem.setValue(m_code);

        var elem = properties.item(Cairo.Constants.ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        var elem = properties.item(C.FP_LUNES);
        elem.setValue(Cairo.Util.boolToInt(m_lunes));

        var elem = properties.item(C.FP_MARTES);
        elem.setValue(Cairo.Util.boolToInt(m_martes));

        var elem = properties.item(C.FP_MIERCOLES);
        elem.setValue(Cairo.Util.boolToInt(m_miercoles));

        var elem = properties.item(C.FP_JUEVES);
        elem.setValue(Cairo.Util.boolToInt(m_jueves));

        var elem = properties.item(C.FP_VIERNES);
        elem.setValue(Cairo.Util.boolToInt(m_viernes));

        var elem = properties.item(C.FP_SABADO);
        elem.setValue(Cairo.Util.boolToInt(m_sabado));

        var elem = properties.item(C.FP_DOMINGO);
        elem.setValue(Cairo.Util.boolToInt(m_domingo));

        var elem = properties.item(C.FP_DESCRIP);
        elem.setValue(m_descrip);

        return m_dialog.showValues(properties);
      };

      var load = function(id) {

        return DB.getData("load[" + m_apiPath + "general/formapago]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== NO_ID) {

              m_id = Cairo.Database.valField(response.data, C.FP_ID);
              m_name = Cairo.Database.valField(response.data, C.FP_NAME);
              m_code = Cairo.Database.valField(response.data, C.FP_CODE);
              m_descrip = Cairo.Database.valField(response.data, C.FP_DESCRIP);
              m_active = Cairo.Database.valField(response.data, Cairo.Constants.ACTIVE);

              m_lunes = Cairo.Database.valField(response.data, C.FP_LUNES);
              m_martes = Cairo.Database.valField(response.data, C.FP_MARTES);
              m_miercoles = Cairo.Database.valField(response.data, C.FP_MIERCOLES);
              m_jueves = Cairo.Database.valField(response.data, C.FP_JUEVES);
              m_viernes = Cairo.Database.valField(response.data, C.FP_VIERNES);
              m_sabado = Cairo.Database.valField(response.data, C.FP_SABADO);
              m_domingo = Cairo.Database.valField(response.data, C.FP_DOMINGO);

            } 
            else {

              m_id = NO_ID;
              m_name = "";
              m_code = "";
              m_descrip = "";
              m_active = true;

              m_lunes = false;
              m_martes = false;
              m_miercoles = false;
              m_jueves = false;
              m_viernes = false;
              m_sabado = false;
              m_domingo = false;

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

    Edit.Controller.edit = function(id) {
      var editor = Cairo.FormaPago.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit(id);
    };

  });

  Cairo.module("FormaPago.List", function(List, Cairo, Backbone, Marionette, $, _) {

    var NO_ID = Cairo.Constants.NO_ID;

    List.Controller = {
      list: function() {

        var self = this;
        var m_apiPath = Cairo.Database.getAPIVersion();

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.formaPagoEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.formaPagoEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Formas de Pago",
            entityName: "forma de pago",
            entitiesName: "formas de pago"
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
              var editor = Cairo.FormaPago.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_FORMAPAGO)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            return Cairo.Database.destroy(m_apiPath + "general/formapago", id, Cairo.Constants.DELETE_FUNCTION, "FormaPago").whenSuccess(
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
          Cairo.LoadingMessage.show("Formas de Pago", "Loading Formas de Pago from CrowSoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ formaPagoTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.FORMAPAGO,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.formaPagoTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("Formas de Pago", "formaPagoTreeRegion", "#general/formasdepago", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());