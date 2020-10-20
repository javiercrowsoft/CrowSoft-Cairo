(function() {
  "use strict";

  Cairo.module("Chequera.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var CT = Cairo.Tesoreria.Constants;
      var NO_ID = Cairo.Constants.NO_ID;
      var T = Dialogs.PropertyType;

      var C_MODULE = "cChequeraEdit";

      var K_CODE = 2;
      var K_ACTIVE = 3;
      var K_CUE_ID = 4;
      var K_DESCRIP = 6;
      var K_NUMERO_DESDE = 7;
      var K_NUMERO_HASTA = 8;
      var K_ULTIMO_NUMERO = 9;
      var K_DEFAULT = 10;

      var m_id = 0;
      var m_cue_id = 0;
      var m_cuenta = "";
      var m_code = "";
      var m_descrip = "";
      var m_numeroDesde = 0;
      var m_numeroHasta = 0;
      var m_ultimoNumero = 0;
      var m_default;
      var m_active;

      var m_editing;

      var m_dialog;
      var m_listController = null;

      var m_isNew;

      var m_branchId = 0;
      var m_treeId = 0;

      var m_copy;

      var m_apiPath = DB.getAPIVersion();

      self.getID = function() {
        return m_id;
      };

      self.getName = function() {
        return m_code;
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

        var property = m_dialog.getProperties().item(CT.CHQ_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(CT.CHQ_CODE));

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
        return Cairo.appName;
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

          doc.setClientTable(C.CHEQUERA);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, Cairo.Constants.SHOW_DOCUMENTS_FUNCTION, C_MODULE, "");
        }

        return _rtn;
      };

      self.messageEx = function(messageId, info) {
        var _rtn = null;
        switch (messageId) {

          case Dialogs.Message.MSG_DOC_INFO:

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_CHEQUERA);
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
        var cueId = NO_ID;
        var bDefault = false;

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(CT.CHQ_ID);
        register.setTable(C.CHEQUERA);

        register.setPath(m_apiPath + "general/chequera");

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
            case K_CUE_ID:
              cueId = property.getSelectId();
              fields.add(C.CUE_ID, cueId, Cairo.Constants.Types.id);
              break;

            case K_CODE:
              fields.add(CT.CHQ_CODE, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_DESCRIP:
              fields.add(CT.CHQ_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_NUMERO_DESDE:
              fields.add(CT.CHQ_NUMERO_DESDE, property.getValue(), Cairo.Constants.Types.long);
              break;

            case K_NUMERO_HASTA:
              fields.add(CT.CHQ_NUMERO_HASTA, property.getValue(), Cairo.Constants.Types.long);
              break;

            case K_ULTIMO_NUMERO:
              fields.add(CT.CHQ_ULTIMO_NUMERO, property.getValue(), Cairo.Constants.Types.long);
              break;

            case K_DEFAULT:
              bDefault = Cairo.Util.val(property.getValue());
              fields.add(CT.CHQ_DEFAULT, Cairo.Util.boolToInt(bDefault), Cairo.Constants.Types.boolean);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.boolean);
              break;
          }
        }

        return DB.saveEx(
          register,
          false,
          CT.CHQ_CODE,
          Cairo.Constants.CLIENT_SAVE_FUNCTION,
          C_MODULE,
          getText(3117, "")).then(

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
        return "#general/chequera/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "chequera" + id;
      };

      self.getTitle = function() {
        return Cairo.Language.getText(3110, ""); // Chequeras
      };

      self.validate = function() {
        var property = null;

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_CODE:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.text)) {
                return Cairo.Modal.showInfoWithFalse(Cairo.Constants.MUST_SET_A_CODE);
              }
              break;

            case K_NUMERO_DESDE:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.long)) {
                return Cairo.Modal.showInfoWithFalse(Cairo.Language.getText(3111, ""));
                // Debe indicar un número Desde
              }
              break;

            case K_NUMERO_HASTA:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.long)) {
                return Cairo.Modal.showInfoWithFalse(Cairo.Language.getText(3112, ""));
                // Debe indicar un número Hasta
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

      /* TODO: check this method is used. if not remove it */
      self.list = function() {
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_CHEQUERA);
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

          if(id === NO_ID) {
            m_isNew = true;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_CHEQUERA)) { return p; }
          }
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_CHEQUERA)) { return p; }
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
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.EDIT_FUNCTION, "cChequera", "");
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

        m_dialog.setTitle(m_code);

        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, CT.CHQ_CODE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setSize(100);
        elem.setKey(K_CODE);
        elem.setValue(m_code);

        elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVE);
        elem.setValue(Cairo.Util.boolToInt(m_active));

        elem = properties.add(null, C.CUE_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setName(Cairo.Language.getText(1267, "")); // Cuenta
        elem.setKey(K_CUE_ID);
        elem.setValue(m_cuenta);
        elem.setSelectId(m_cue_id);
        elem.setSelectFilter(Cairo.Documents.getCuentaGrupoFilter(C.CuentaGrupoTipo.banco));

        elem = properties.add(null, CT.CHQ_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setSize(255);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);

        elem = properties.add(null, CT.CHQ_NUMERO_DESDE);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setName(Cairo.Language.getText(3113, "")); // Número Desde
        elem.setKey(K_NUMERO_DESDE);
        elem.setValue(m_numeroDesde);
        elem.setSubType(Dialogs.PropertySubType.integer);

        elem = properties.add(null, CT.CHQ_NUMERO_HASTA);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setName(Cairo.Language.getText(3114, "")); // Número hasta
        elem.setKey(K_NUMERO_HASTA);
        elem.setValue(m_numeroHasta);
        elem.setSubType(Dialogs.PropertySubType.integer);

        elem = properties.add(null, CT.CHQ_ULTIMO_NUMERO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setName(Cairo.Language.getText(3115, "")); // Ultimo cheque emitido
        elem.setKey(K_ULTIMO_NUMERO);
        elem.setValue(m_ultimoNumero);
        elem.setSubType(Dialogs.PropertySubType.integer);

        elem = properties.add(null, CT.CHQ_DEFAULT);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Language.getText(3116, "")); // Chequera sugerida
        elem.setKey(K_DEFAULT);
        elem.setValue(m_default);

        return m_dialog.show(self);
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_code);

        var properties = m_dialog.getProperties();

        var elem = properties.item(CT.CHQ_CODE);
        elem.setValue(m_code);

        elem = properties.item(Cairo.Constants.ACTIVE);
        elem.setValue(Cairo.Util.boolToInt(m_active));

        elem = properties.item(C.CUE_ID);
        elem.setValue(m_cuenta);
        elem.setSelectId(m_cue_id);

        elem = properties.item(CT.CHQ_DESCRIP);
        elem.setValue(m_descrip);

        elem = properties.item(CT.CHQ_NUMERO_DESDE);
        elem.setValue(m_numeroDesde);

        elem = properties.item(CT.CHQ_NUMERO_HASTA);
        elem.setValue(m_numeroHasta);

        elem = properties.item(CT.CHQ_ULTIMO_NUMERO);
        elem.setValue(m_ultimoNumero);

        elem = properties.item(CT.CHQ_DEFAULT);
        elem.setValue(m_default);

        return m_dialog.showValues(properties);
      };

      var load = function(id) {

        return DB.getData("load[" + m_apiPath + "general/chequera]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== NO_ID) {
              m_id = DB.valField(response.data, CT.CHQ_ID);
              m_cue_id = DB.valField(response.data, C.CUE_ID);
              m_code = DB.valField(response.data, CT.CHQ_CODE);
              m_active = DB.valField(response.data, Cairo.Constants.ACTIVE);
              m_descrip = DB.valField(response.data, CT.CHQ_DESCRIP);
              m_numeroDesde = DB.valField(response.data, CT.CHQ_NUMERO_DESDE);
              m_numeroHasta = DB.valField(response.data, CT.CHQ_NUMERO_HASTA);
              m_ultimoNumero = DB.valField(response.data, CT.CHQ_ULTIMO_NUMERO);
              m_default = DB.valField(response.data, CT.CHQ_DEFAULT);
              m_cuenta = DB.valField(response.data, C.CUE_NAME);
            }
            else {
              m_id = NO_ID;
              m_cue_id = NO_ID;
              m_code = "";
              m_active = true;
              m_descrip = "";
              m_numeroDesde = 0;
              m_numeroHasta = 0;
              m_ultimoNumero = 0;
              m_default = 0;
              m_cuenta = "";
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
          if(m_listController != null) {
            updateList();
            m_listController.removeEditor(self);
          }
        }
        catch (ignored) {
          Cairo.manageErrorEx(ex.message, ex, "Error in terminate", ignored);
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
      var editor = Cairo.Chequera.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit(id);
    };

  });

  Cairo.module("Chequera.List", function(List, Cairo, Backbone, Marionette, $, _) {

    var DB = Cairo.Database;
    var NO_ID = Cairo.Constants.NO_ID;

    List.Controller = {
      list: function() {

        var self = this;
        var m_apiPath = DB.getAPIVersion();

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.chequeraEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.chequeraEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Chequeras",
            entityName: "chequera",
            entitiesName: "chequeras"
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
              var editor = Cairo.Chequera.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_CHEQUERA)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            return DB.destroy(m_apiPath + "general/chequera", id, Cairo.Constants.DELETE_FUNCTION, "Chequera").success(
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
          Cairo.LoadingMessage.show("Chequeras", "Loading chequera from Crowsoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ chequeraTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.CHEQUERA,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.chequeraTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("Chequeras", "chequeraTreeRegion", "#general/chequeras", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });

}());

