(function() {
  "use strict";

  Cairo.module("Ciudad.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      // cCiudad
      // 00-06-03

      var C_MODULE = "cCiudad";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_DESCRIP = 3;
      var K_PRO_ID = 4;
      var K_ACTIVE = 6;

      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_descrip = "";
      var m_pro_id = 0;
      var m_provincia = "";
      var m_active;

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

      self.setActivo = function(rhs) {
        m_active = rhs;
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

          doc.setClientTable(Cairo.General.Constants.CIUDAD);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.SHOW_DOCUMENTS_FUNCTION, C_MODULE, "");
        }
              
        return _rtn;
      };

      self.messageEx = function(messageID,  info) {
        var _rtn = null;
        switch (messageID) {

          case Dialogs.Message.MSG_DOC_INFO:

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_CIUDAD);
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

      self.copy = function() {

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, Cairo.Constants.NO_ID);

        var property = m_dialog.getProperties().item(Cairo.General.Constants.CIU_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.CIU_CODE));
        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.CIU_NAME));

        m_copy = true;
      };

      self.editNew = function() {

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, Cairo.Constants.NO_ID);

        return load(Cairo.Constants.NO_ID).then(
          function(ignored) {
            return refreshCollection();
          }
        );
      };

      self.save = function() {

        var register = new Cairo.Database.Register();
        var fields = register.getFields();

        register.setFieldId(Cairo.General.Constants.CIU_ID);
        register.setTable(Cairo.General.Constants.CIUDAD);

        var apiPath = Cairo.Database.getAPIVersion();
        register.setPath(apiPath + "general/ciudad");

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
              fields.add(Cairo.General.Constants.CIU_NAME, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODE:
              fields.add(Cairo.General.Constants.CIU_CODE, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_DESCRIP:
              fields.add(Cairo.General.Constants.CIU_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_PRO_ID:
              fields.add(Cairo.General.Constants.PRO_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, property.getValue(), Cairo.Constants.Types.boolean);
              break;
          }
        }

        return Cairo.Database.saveEx(
            register,
            false,
            Cairo.General.Constants.CIU_CODE, 
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            Cairo.Language.getText(1075, "")).then(

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
        return "#general/ciudad/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "ciudad" + id;
      };

      self.getTitle = function() {
        // Ciudades
        return Cairo.Language.getText(1076, "");
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

            case K_PRO_ID:
              if(Cairo.Util.valEmpty(property.getSelectId(), Cairo.Constants.Types.id)) {
                // Debe indicar una provincia
                cWindow.msgInfo(Cairo.Language.getText(1077, ""));
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
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_CIUDAD);
      };

      self.setDialog = function(rhs) {
        m_dialog = rhs;
      };

      self.isEditing = function() {
        return m_editing;
      };

      self.edit = function(id,  inModalWindow) {
        var p = Cairo.Promises.resolvedPromise(false);
        try {

          if(id === Cairo.Constants.NO_ID) {
            m_isNew = true;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_CIUDAD)) { return p; }
          } 
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_CIUDAD)) { return p; }
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

        var elem = properties.add(null, Cairo.General.Constants.CIU_NAME);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setWidth(6200);
        elem.setSize(100);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        var elem = properties.add(null, Cairo.General.Constants.CIU_CODE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setSize(15);
        elem.setKey(K_CODE);
        elem.setValue(m_code);

        var elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        var elem = properties.add(null, Cairo.General.Constants.PRO_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROVINCIA);
        // Provincia
        elem.setName(Cairo.Language.getText(1080, ""));
        elem.setKey(K_PRO_ID);
        elem.setValue(m_provincia);
        elem.setSelectId(m_pro_id);
        elem.setTopFromProperty(Cairo.General.Constants.CIU_CODE);
        elem.setLeft(5480);

        var elem = properties.add(null, Cairo.General.Constants.CIU_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setLeftFromProperty(Cairo.Constants.ACTIVE);
        elem.setTopFromProperty(Cairo.Constants.ACTIVE);
        elem.setTopToPrevious(440);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setSize(255);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setWidth(6200);
        elem.setHeight(880);

        if(!m_dialog.show(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(Cairo.General.Constants.CIU_NAME);
        elem.setValue(m_name);

        var elem = properties.item(Cairo.General.Constants.CIU_CODE);
        elem.setValue(m_code);

        var elem = properties.item(Cairo.Constants.ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        var elem = properties.item(Cairo.General.Constants.PRO_ID);
        elem.setValue(m_provincia);
        elem.setSelectId(m_pro_id);

        var elem = properties.item(Cairo.General.Constants.CIU_DESCRIP);
        elem.setValue(m_descrip);

        return m_dialog.showValues(properties);
      };

      var load = function(id) {

        var apiPath = Cairo.Database.getAPIVersion();
        return Cairo.Database.getData("load[" + apiPath + "general/ciudad]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== Cairo.Constants.NO_ID) {

              m_id = Cairo.Database.valField(response.data, Cairo.General.Constants.CIU_ID);
              m_name = Cairo.Database.valField(response.data, Cairo.General.Constants.CIU_NAME);
              m_code = Cairo.Database.valField(response.data, Cairo.General.Constants.CIU_CODE);
              m_descrip = Cairo.Database.valField(response.data, Cairo.General.Constants.CIU_DESCRIP);
              m_pro_id = Cairo.Database.valField(response.data, Cairo.General.Constants.PRO_ID);
              m_provincia = Cairo.Database.valField(response.data, Cairo.General.Constants.PRO_NAME);
              m_active = Cairo.Database.valField(response.data, Cairo.Constants.ACTIVE);

            } 
            else {
              m_id = Cairo.Constants.NO_ID;
              m_name = "";
              m_code = "";
              m_descrip = "";
              m_pro_id = Cairo.Constants.NO_ID;
              m_provincia = "";
              m_active = true;

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

  Cairo.module("Ciudad.List", function(List, Cairo, Backbone, Marionette, $, _) {
    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.ciudadEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.ciudadEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Ciudades",
            entityName: "ciudad",
            entitiesName: "ciudades"
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
              var editor = Cairo.Ciudad.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_CIUDAD)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            var apiPath = Cairo.Database.getAPIVersion();
            return Cairo.Database.destroy(apiPath + "general/ciudad", id, Cairo.Constants.DELETE_FUNCTION, "Ciudad").success(
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
          Cairo.LoadingMessage.show("Ciudades", "Loading Ciudades from CrowSoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ ciudadTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.CIUDAD,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.ciudadTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("Ciudades", "ciudadTreeRegion", "#general/ciudades", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());