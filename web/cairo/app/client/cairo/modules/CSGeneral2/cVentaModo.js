(function() {
  "use strict";

  Cairo.module("VentaModo.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;

      var C_MODULE = "cVentaModo";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_ACTIVE = 3;
      var K_DESCRIP = 4;
      var K_CTA_CTE = 5;
      var K_CUE_ID = 6;
      var K_OS = 7;
      var K_PV = 8;
      var K_CMVXI = 9;
      var K_COBZ = 10;

      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_active;
      var m_descrip = "";
      var m_cue_id = 0;
      var m_cuenta = "";
      var m_ctacte;
      var m_pv;
      var m_os;
      var m_cmvxi;
      var m_cobz;

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

        var property = m_dialog.getProperties().item(C.VM_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(C.VM_CODE));

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

          doc.setClientTable(C.VENTAMODO);
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

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_VENTAMODO);
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

        register.setFieldId(C.VM_ID);
        register.setTable(C.VENTAMODO);

        register.setPath(m_apiPath + "general/ventamodo");

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
              fields.add(C.VM_NAME, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODE:
              fields.add(C.VM_CODE, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.boolean);
              break;

            case K_DESCRIP:
              fields.add(C.VM_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CTA_CTE:
              fields.add(C.VM_CTA_CTE, property.getListItemData(), Cairo.Constants.Types.integer);
              break;

            case K_CUE_ID:
              fields.add(C.CUE_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_OS:
              fields.add(C.VM_OS, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.boolean);
              break;

            case K_PV:
              fields.add(C.VM_PV, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.boolean);
              break;

            case K_COBZ:
              fields.add(C.VM_COBZ, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.boolean);
              break;

            case K_CMVXI:
              fields.add(C.VM_CMVXI, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.boolean);
              break;
          }
        }

        return Cairo.Database.saveEx(
          register,
          false,
          C.VM_CODE,
          Cairo.Constants.CLIENT_SAVE_FUNCTION,
          C_MODULE,
          getText(5075, "")).then(

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
        return "#general/ventamodo/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "ventaModo" + id;
      };

      self.getTitle = function() {
        // Modos de Venta
        return getText(5078, "");
      };

      self.validate = function() {
        var property = null;

        var _count = m_dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {
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
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_VENTAMODO);
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_VENTAMODO)) { return p; }
          } 
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_VENTAMODO)) { return p; }
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

        var elem = properties.add(null, C.VM_NAME);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(100);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        var elem = properties.add(null, C.VM_CODE);
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

        var elem = properties.add(null, C.VM_CTA_CTE);
        elem.setType(Dialogs.PropertyType.list);
        // Tipo de Cobranza
        elem.setName(getText(5104, ""));
        elem.setSize(15);
        elem.setListItemData(m_ctacte);
        elem.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
        var w_list = elem.getList();
        var elem = w_list.add(null);
        elem.Id = C.VentaModoCtaCte.hojaRuta;
        // Hoja de Ruta
        elem.setValue(getText(5106, ""));
        var elem = w_list.add(null);
        elem.Id = C.VentaModoCtaCte.mostrador;
        // Cobranza por Mostrador
        elem.setValue(getText(5107, ""));
        var elem = w_list.add(null);
        elem.Id = C.VentaModoCtaCte.ctacteMostradorFactura;
        // Cobranza por Facturador
        elem.setValue(getText(5108, ""));
        elem.setKey(K_CTA_CTE);

        var elem = properties.add(null);
        elem.setType(Dialogs.PropertyType.label);
        elem.setBackColor("CECECE");

        var elem = properties.add(null);
        elem.setType(Dialogs.PropertyType.label);
        // Se utiliza en:
        elem.setValue(getText(5081, ""));
        elem.setFontBold(true);

        var elem = properties.add(null, C.VM_PV);
        elem.setType(Dialogs.PropertyType.check);
        // Pedidos de Venta
        elem.setName(getText(5082, ""));
        elem.setSize(15);
        elem.setValue(Cairo.Util.boolToInt(m_pv));
        elem.setKey(K_PV);

        var elem = properties.add(null, C.VM_OS);
        elem.setType(Dialogs.PropertyType.check);
        // Ordenes de Servicio
        elem.setName(getText(5083, ""));
        elem.setSize(15);
        elem.setValue(Cairo.Util.boolToInt(m_os));
        elem.setKey(K_OS);

        var elem = properties.add(null, C.VM_COBZ);
        elem.setType(Dialogs.PropertyType.check);
        // Cobranzas
        elem.setName(getText(2128, ""));
        elem.setSize(15);
        elem.setValue(Cairo.Util.boolToInt(m_cobz));
        elem.setKey(K_COBZ);

        var elem = properties.add(null, C.VM_CMVXI);
        elem.setType(Dialogs.PropertyType.check);
        // Cobro por Internet
        elem.setName(getText(5105, ""));
        elem.setSize(15);
        elem.setValue(Cairo.Util.boolToInt(m_cmvxi));
        elem.setKey(K_CMVXI);

        var elem = properties.add(null);
        elem.setType(Dialogs.PropertyType.label);
        elem.setBackColor("CECECE");

        var elem = properties.add(null, C.CUE_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setSelectFilter("cuec_id = "+ csECuentaCategoria.cSECUECCAJA.toString());
        // Cuenta
        elem.setName(getText(1267, ""));
        elem.setSize(15);
        elem.setValue(m_cuenta);
        elem.setSelectId(m_cue_id);
        elem.setKey(K_CUE_ID);

        var elem = properties.add(null, C.VM_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setSize(255);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setValue(m_descrip);
        elem.setKey(K_DESCRIP);

        return m_dialog.show(self);
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(C.VM_NAME);
        elem.setValue(m_name);

        var elem = properties.item(C.VM_CODE);
        elem.setValue(m_code);

        var elem = properties.item(Cairo.Constants.ACTIVE);
        elem.setValue(Cairo.Util.boolToInt(m_active));

        var elem = properties.item(C.VM_CTA_CTE);

        var elem = properties.add(null);

        var elem = properties.add(null);

        var elem = properties.item(C.VM_PV);
        elem.setValue(Cairo.Util.boolToInt(m_pv));

        var elem = properties.item(C.VM_OS);
        elem.setValue(Cairo.Util.boolToInt(m_os));

        var elem = properties.item(C.VM_COBZ);
        elem.setValue(Cairo.Util.boolToInt(m_cobz));

        var elem = properties.item(C.VM_CMVXI);
        elem.setValue(Cairo.Util.boolToInt(m_cmvxi));

        var elem = properties.add(null);

        var elem = properties.item(C.CUE_ID);
        elem.setValue(m_cuenta);
        elem.setSelectId(m_cue_id);

        var elem = properties.item(C.VM_DESCRIP);
        elem.setValue(m_descrip);

        return m_dialog.showValues(properties);
      };

      var load = function(id) {

        return DB.getData("load[" + m_apiPath + "general/ventamodo]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id === NO_ID) {
              m_active = true;
              m_name = "";
              m_code = "";
              m_descrip = "";
              m_id = NO_ID;
              m_cue_id = NO_ID;
              m_cuenta = "";
              m_ctacte = C.VentaModoCtaCte.ctacteMostradorFactura;
              m_pv = 0;
              m_os = 0;
              m_cmvxi = 0;
              m_cobz = 0;
            } 
            else {
              m_active = Cairo.Database.valField(response.data, Cairo.Constants.ACTIVE);
              m_name = Cairo.Database.valField(response.data, C.VM_NAME);
              m_code = Cairo.Database.valField(response.data, C.VM_CODE);
              m_descrip = Cairo.Database.valField(response.data, C.VM_DESCRIP);
              m_id = Cairo.Database.valField(response.data, C.VM_ID);
              m_ctacte = Cairo.Database.valField(response.data, C.VM_CTA_CTE);
              m_pv = Cairo.Database.valField(response.data, C.VM_PV);
              m_os = Cairo.Database.valField(response.data, C.VM_OS);
              m_cmvxi = Cairo.Database.valField(response.data, C.VM_CMVXI);
              m_cobz = Cairo.Database.valField(response.data, C.VM_COBZ);
              m_cuenta = Cairo.Database.valField(response.data, C.CUE_NAME);
              m_cue_id = Cairo.Database.valField(response.data, C.CUE_ID);
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
      var editor = Cairo.VentaModo.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit(id);
    };

  });

  Cairo.module("VentaModo.List", function(List, Cairo, Backbone, Marionette, $, _) {

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

          var editors = Cairo.Editors.ventamodoEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.ventamodoEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Modos de Venta",
            entityName: "modo de venta",
            entitiesName: "modos de venta"
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
              var editor = Cairo.VentaModo.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_VENTAMODO)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            return Cairo.Database.destroy(m_apiPath + "general/ventamodo", id, Cairo.Constants.DELETE_FUNCTION, "VentaModo").whenSuccess(
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
          Cairo.LoadingMessage.show("Modos de Venta", "Loading Modos de Venta from CrowSoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ ventamodoTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.VENTAMODO,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.ventamodoTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("VentaModos", "ventamodoTreeRegion", "#general/ventamodos", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());