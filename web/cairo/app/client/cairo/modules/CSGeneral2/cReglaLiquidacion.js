(function() {
  "use strict";

  Cairo.module("ReglaLiquidacion.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;
      var Types = Cairo.Constants.Types;

      var C_MODULE = "cReglaLiquidacion";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_ACTIVE = 3;
      var K_DESCRIP = 4;
      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_active;
      var m_descripcion = "";

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

        if(m_listController !== null) {
          m_listController.updateEditorKey(self, NO_ID);
        }

        var property = m_dialog.getProperties().item(C.REL_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(C.REL_CODE));

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
        return m_id !== NO_ID;
      };

      self.copyEnabled = function() {
        return true;
      };

      self.addEnabled = function() {
        return true;
      };

      self.showDocDigital = function() {
        var _rtn = false;
        try {

          if(m_id === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(C.REGLALIQUIDACION);
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

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_REGLALIQUIDACION);
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

        register.setFieldId(C.REL_ID);
        register.setTable(C.REGLALIQUIDACION);

        register.setPath(m_apiPath + "general/reglaliquidacion");

        if(m_copy) {
          register.setId(Cairo.Constants.NEW_ID);
        } 
        else {
          register.setId(m_id);
        }

        var _count = m_dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {
          var property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NAME:
              fields.add(C.REL_NAME, property.getValue(), Types.text);
              break;

            case K_CODE:
              fields.add(C.REL_CODE, property.getValue(), Types.text);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, property.getValue(), Types.boolean);
              break;

            case K_DESCRIP:
              fields.add(C.REL_DESCRIP, property.getValue(), Types.text);
              break;
          }
        }

        return Cairo.Database.saveEx(
          register,
          false,
          C.REL_CODE,
          Cairo.Constants.CLIENT_SAVE_FUNCTION,
          C_MODULE,
          getText(1413, "")).then(

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
                  }
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
        return "#general/reglaliquidacion/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "reglaLiquidacion" + id;
      };

      self.getTitle = function() {
        // ReglaLiquidacion
        return getText(1414, "");
      };

      self.validate = function() {
        var property = null;

        var _count = m_dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NAME:
              if(Cairo.Util.valEmpty(property.getValue(), Types.text)) {
                return Cairo.Modal.showInfoWithFalse(Cairo.Constants.MUST_SET_A_NAME);
              }
              break;

            case K_CODE:
              if(Cairo.Util.valEmpty(property.getValue(), Types.text)) {
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
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_REGLALIQUIDACION);
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_REGLALIQUIDACION)) { return p; }
          } 
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_REGLALIQUIDACION)) { return p; }
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

        var elem = properties.add(null, C.REL_NAME);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(30);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        var elem = properties.add(null, C.REL_CODE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setSize(15);
        elem.setValue(m_code);
        elem.setKey(K_CODE);

        var elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVE);
        elem.setValue(Cairo.Util.boolToInt(m_active));

        var elem = properties.add(null, C.REL_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setSize(255);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descripcion);

        return m_dialog.show(self);
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(C.REL_NAME);
        elem.setValue(m_name);

        var elem = properties.item(C.REL_CODE);
        elem.setValue(m_code);

        var elem = properties.item(Cairo.Constants.ACTIVE);
        elem.setValue(Cairo.Util.boolToInt(m_active));

        var elem = properties.item(C.REL_DESCRIP);
        elem.setValue(m_descripcion);

        return m_dialog.showValues(properties);
      };

      var load = function(id) {

        return DB.getData("load[" + m_apiPath + "general/reglaliquidacion]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id === NO_ID) {
              m_active = true;
              m_name = "";
              m_code = "";
              m_id = NO_ID;
              m_descripcion = "";
            } 
            else {
              m_active = Cairo.Database.valField(response.data, Cairo.Constants.ACTIVE);
              m_name = Cairo.Database.valField(response.data, C.REL_NAME);
              m_code = Cairo.Database.valField(response.data, C.REL_CODE);
              m_id = Cairo.Database.valField(response.data, C.REL_ID);
              m_descripcion = Cairo.Database.valField(response.data, C.REL_DESCRIP);
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

    Edit.Controller = { getEditor: createObject };

    Edit.Controller.edit = function(id) {
      var editor = Cairo.ReglaLiquidacion.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit(id);
    };

  });

  Cairo.module("ReglaLiquidacion.List", function(List, Cairo, Backbone, Marionette, $, _) {

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

          var editors = Cairo.Editors.reglaLiquidacionEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.reglaLiquidacionEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Reglas de Liquidacion",
            entityName: "regla de liquidacion",
            entitiesName: "reglas de liquidacion"
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
              var editor = Cairo.ReglaLiquidacion.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_REGLALIQUIDACION)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            return Cairo.Database.destroy(m_apiPath + "general/reglaliquidacion", id, Cairo.Constants.DELETE_FUNCTION, "ReglaLiquidacion").whenSuccess(
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
          Cairo.LoadingMessage.show("Reglas de Liquidacion", "Loading Reglas de Liquidacion from CrowSoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ reglaLiquidacionTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.REGLALIQUIDACION,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.reglaLiquidacionTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("Reglas de Liquidacion", "reglaLiquidacionTreeRegion", "#general/reglasliquidacion", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());