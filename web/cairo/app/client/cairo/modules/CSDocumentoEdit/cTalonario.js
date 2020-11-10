(function() {
  "use strict";

  Cairo.module("Talonario.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;
      var Types = Cairo.Constants.Types;
      var T = Dialogs.PropertyType;

      var C_MODULE = "cTalonario";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_DESCRIP = 3;
      var K_ULTIMONRO = 4;
      var K_TIPO = 5;
      var K_MASCARA = 6;
      var K_CAI = 7;
      var K_ACTIVE = 8;
      var K_EMP_ID = 9;
      var K_PTO_VTA = 10;
      var K_TIPO_AFIP = 11;

      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_descrip = "";
      var m_ultimonro = 0;
      var m_tipo = 0;
      var m_mascara = "";
      var m_tipoAFIP = 0;
      var m_ptoVta = 0;
      var m_active;
      var m_cai = "";
      var m_empId = 0;
      var m_empresa = "";

      var m_editing;

      var m_dialog;
      var m_listController = null;

      var m_isNew;

      var m_branchId = 0;
      var m_treeId = 0;

      var m_copy;

      var m_apiPath = DB.getAPIVersion();

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

        var property = m_dialog.getProperties().item(C.TA_CODE);
        property.setValue("C-"+ property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(C.TA_CODE));
        m_dialog.showValue(m_dialog.getProperties().item(C.TA_NAME));

        m_copy = true;
      };

      self.editNew = function() {

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, NO_ID);

        return load(NO_ID).then(
          function(ignored) {
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

          doc.setClientTable(C.TALONARIO);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "cIABMClient_ShowDocDigital", C_MODULE, "");
        }

        return _rtn;
      };

      self.messageEx = function(messageID, info) {
        return true;
      };

      self.discardChanges = function() {
        return Cairo.Promises.resolvedPromise(refreshCollection());
      };

      self.propertyChange = function(key) {

        return Cairo.Promises.resolvedPromise(false);
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();
        
        register.setFieldId(C.TA_ID);
        register.setTable(C.TALONARIO);

        register.setPath(m_apiPath + "general/talonario");

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
              fields.add(C.TA_NAME, property.getValue(), Types.text);
              break;

            case K_CODE:
              fields.add(C.TA_CODE, property.getValue(), Types.text);
              break;

            case K_DESCRIP:
              fields.add(C.TA_DESCRIP, property.getValue(), Types.text);
              break;

            case K_ULTIMONRO:
              fields.add(C.TA_ULTIMO_NRO, property.getValue(), Types.long);
              break;

            case K_TIPO:
              fields.add(C.TA_TIPO, property.getListItemData(), Types.integer);
              break;

            case K_MASCARA:
              fields.add(C.TA_MASCARA, property.getValue(), Types.text);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, property.getValue(), Types.boolean);
              break;

            case K_CAI:
              fields.add(C.TA_CAI, property.getValue(), Types.text);
              break;

            case K_EMP_ID:
              fields.add(C.EMP_ID, property.getSelectId(), Types.id);
              break;

            case K_PTO_VTA:
              fields.add(C.TA_PTO_VTA, property.getValue(), Types.integer);
              break;

            case K_TIPO_AFIP:
              fields.add(C.TA_TIPO_AFIP, property.getValue(), Types.integer);
              break;
          }
        }

        return DB.saveEx(
          register,
          false,
          C.UN_CODE,
          Cairo.Constants.CLIENT_SAVE_FUNCTION,
          C_MODULE,
          getText(1498, "")).then(

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
        return "#documento/talonario/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "talonario" + id;
      };

      self.getTitle = function() {
        return getText(2624, ""); // Talonarios
      };

      self.validate = function() {
        var property = null;

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
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

            case K_TIPO:
              if(Cairo.Util.valEmpty(property.getListItemData(), Types.integer)) {
                return Cairo.Modal.showInfoWithFalse(getText(1222, "")); // Debe indicar un tipo
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
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.TALONARIOS);
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_TALONARIO)) { return p; }
          }
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_TALONARIO)) { return p; }
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
        catch (ex) {
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

        var elem = properties.add(null, C.TA_NAME);
        elem.setType(T.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(100);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        elem = properties.add(null, C.TA_CODE);
        elem.setType(T.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setSize(15);
        elem.setValue(m_code);
        elem.setKey(K_CODE);

        elem = properties.add(null, C.TA_TIPO);
        elem.setType(T.list);
        elem.setName(getText(1223, ""));
        elem.setKey(K_TIPO);
        elem.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
        elem.setListItemData(m_tipo);

        var list = elem.getList();

        elem = list.add(null, C.TipoTalonario.impresionFiscal);
        elem.setId(C.TipoTalonario.impresionFiscal);
        elem.setValue(getText(2626, "")); // Impresión Fiscal

        elem = list.add(null, C.TipoTalonario.propuesto);
        elem.setId(C.TipoTalonario.propuesto);
        elem.setValue(getText(2627, "")); // Propuesto

        elem = list.add(null, C.TipoTalonario.autoImpresor);
        elem.setId(C.TipoTalonario.autoImpresor);
        elem.setValue(getText(2628, "")); // Auto Impresor

        elem = properties.add(null, C.TA_ULTIMO_NRO);
        elem.setType(T.numeric);        
        elem.setName(getText(2629, "")); // Ultimo número usado
        elem.setSubType(Dialogs.PropertySubType.integer);
        elem.setKey(K_ULTIMONRO);
        elem.setValue(m_ultimonro);

        elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(T.check);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVE);
        elem.setValue(Cairo.Util.boolToInt(m_active));

        elem = properties.add(null, C.TA_MASCARA);
        elem.setType(T.text);        
        elem.setName(getText(2630, "")); // Mascara
        elem.setSize(20);
        elem.setKey(K_MASCARA);
        elem.setValue(m_mascara);

        elem = properties.add(null, C.TA_CAI);
        elem.setType(T.text);        
        elem.setName(getText(1636, "")); // CAI
        elem.setSize(20);
        elem.setKey(K_CAI);
        elem.setValue(m_cai);

        elem = properties.add(null, C.EMP_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.EMPRESA);
        elem.setName(getText(1114, "")); // Empresa
        elem.setSize(20);
        elem.setKey(K_EMP_ID);
        elem.setValue(m_empresa);
        elem.setSelectId(m_empId);

        elem = properties.add(null, C.TA_PTO_VTA);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.integer);
        elem.setName(getText(5128, "")); // Punto de Venta
        elem.setSize(20);
        elem.setKey(K_PTO_VTA);
        elem.setValue(m_ptoVta);

        elem = properties.add(null, C.TA_TIPO_AFIP);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.integer);
        elem.setName(getText(5129, "")); // Tipo AFIP
        elem.setSize(20);
        elem.setKey(K_TIPO_AFIP);
        elem.setValue(m_tipoAFIP);

        elem = properties.add(null, C.TA_DESCRIP);
        elem.setType(T.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);

        return m_dialog.show(self);
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(C.TA_NAME);
        elem.setValue(m_name);

        elem = properties.item(C.TA_CODE);
        elem.setValue(m_code);

        elem = properties.item(C.TA_TIPO);
        elem.setListItemData(m_tipo);

        elem = properties.item(C.TA_ULTIMO_NRO);
        elem.setValue(m_ultimonro);

        elem = properties.item(Cairo.Constants.ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        elem = properties.item(C.TA_MASCARA);
        elem.setValue(m_mascara);

        elem = properties.item(C.TA_CAI);
        elem.setValue(m_cai);

        elem = properties.item(C.EMP_ID);
        elem.setValue(m_empresa);
        elem.setSelectId(m_empId);

        elem = properties.item(C.TA_PTO_VTA);
        elem.setValue(m_ptoVta);

        elem = properties.item(C.TA_TIPO_AFIP);
        elem.setValue(m_tipoAFIP);

        elem = properties.item(C.TA_DESCRIP);
        elem.setValue(m_descrip);

        return m_dialog.showValues(properties);
      };

      var load = function(id) {

        return DB.getData("load[" + m_apiPath + "general/talonario]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== NO_ID) {

              m_id = DB.valField(response.data, C.TA_ID);
              m_name = DB.valField(response.data, C.TA_NAME);
              m_code = DB.valField(response.data, C.TA_CODE);
              m_descrip = DB.valField(response.data, C.TA_DESCRIP);
              m_ultimonro = DB.valField(response.data, C.TA_ULTIMO_NRO);
              m_tipo = DB.valField(response.data, C.TA_TIPO);
              m_mascara = DB.valField(response.data, C.TA_MASCARA);
              m_cai = DB.valField(response.data, C.TA_CAI);
              m_active = DB.valField(response.data, Cairo.Constants.ACTIVE);
              m_empId = DB.valField(response.data, C.EMP_ID);
              m_empresa = DB.valField(response.data, C.EMP_NAME);
              m_tipoAFIP = DB.valField(response.data, C.TA_TIPO_AFIP);
              m_ptoVta = DB.valField(response.data, C.TA_PTO_VTA);
            }
            else {
              m_id = NO_ID;
              m_name = "";
              m_code = "";
              m_descrip = "";
              m_ultimonro = 0;
              m_tipo = 0;
              m_mascara = "";
              m_cai = "";
              m_empId = NO_ID;
              m_empresa = "";
              m_active = true;
              m_tipoAFIP = 0;
              m_ptoVta = 0;
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
      var editor = Cairo.Unidad.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit(id);
    };

  });

  Cairo.module("Talonario.List", function(List, Cairo, Backbone, Marionette, $, _) {

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

          var editors = Cairo.Editors.talonarioEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.talonarioEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Talonarios",
            entityName: "talonario",
            entitiesName: "talonarios"
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
              var editor = Cairo.Talonario.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_TALONARIO)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            return DB.destroy(m_apiPath + "general/talonario", id, Cairo.Constants.DELETE_FUNCTION, "Talonario").whenSuccess(
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
          Cairo.LoadingMessage.show("Talonarios", "Loading Talonarios from CrowSoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ talonarioTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.TALONARIOS,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.talonarioTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("Talonarios", "talonarioTreeRegion", "#documento/talonarios", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });

}());