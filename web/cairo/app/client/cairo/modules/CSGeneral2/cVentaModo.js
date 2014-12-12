(function() {
  "use strict";

  Cairo.module("VentaModo.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      // cVentaModo
      // 23-06-10

      var C_MODULE = "cVentaModo";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_ACTIVE = 3;
      var K_DESCRIP = 4;
      var K_CTACTE = 5;
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

        var property = m_dialog.getProperties().item(Cairo.General.Constants.VM_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.VM_CODE));
        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.VM_NAME));

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

          doc.setClientTable(Cairo.General.Constants.VENTAMODO);
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

            Cairo.Documentation.show("", "", csGeneralPrestacion.Cairo.Security.Actions.General.NEW_VENTAMODO);
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

        register.setFieldId(Cairo.General.Constants.VM_ID);
        register.setTable(Cairo.General.Constants.VENTAMODO);

        var apiPath = Cairo.Database.getAPIVersion();
        register.setPath(apiPath + "general/ventamodo");

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
              fields.add(Cairo.General.Constants.VM_NAME, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODE:
              fields.add(Cairo.General.Constants.VM_CODE, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.boolean);
              break;

            case K_DESCRIP:
              fields.add(Cairo.General.Constants.VM_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CTACTE:
              fields.add(Cairo.General.Constants.VM_CTA_CTE, property.getListItemData(), Cairo.Constants.Types.integer);
              break;

            case K_CUE_ID:
              fields.add(Cairo.General.Constants.CUE_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_OS:
              fields.add(Cairo.General.Constants.VM_OS, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.boolean);
              break;

            case K_PV:
              fields.add(Cairo.General.Constants.VM_PV, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.boolean);
              break;

            case K_COBZ:
              fields.add(Cairo.General.Constants.VM_COBZ, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.boolean);
              break;

            case K_CMVXI:
              fields.add(Cairo.General.Constants.VM_CMVXI, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.boolean);
              break;
          }
        }

        return Cairo.Database.saveEx(
            register,
            false,
            Cairo.General.Constants.VM_CODE, 
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            Cairo.Language.getText(5075, "")).then(

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

      self.terminate = function() {

        m_editing = false;

        try {
          if(m_listController !== null) {
            updateList();
            m_listController.removeEditor(self);
          }
        }
        catch (ignored) {
          Cairo.logError('Error in terminate', ignored);
        }
      };

      self.getPath = function() {
        return "#general/ventamodo/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "ventamodo" + id;
      };

      self.getTitle = function() {
        //'Modos de Venta
        return Cairo.Language.getText(5078, "");
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
        return Cairo.Security.hasPermissionTo(csGeneralPrestacion.Cairo.Security.Actions.General.LIST_VENTAMODO);
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
            if(!Cairo.Security.hasPermissionTo(csGeneralPrestacion.Cairo.Security.Actions.General.NEW_VENTAMODO)) { return p; }
          } 
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(csGeneralPrestacion.Cairo.Security.Actions.General.EDIT_VENTAMODO)) { return p; }
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
        catch (ex) {
          Cairo.manageErrorEx(ex.message, Cairo.Constants.EDIT_FUNCTION, C_MODULE, "");
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

        var abmGen = null;
        abmGen = m_dialog;

        m_dialog.setTitle(m_name);

        abmGen.setMinHeight(6800);

        var properties = m_dialog.getProperties();
        properties.clear();

        var elem = properties.add(null, Cairo.General.Constants.VM_NAME);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(100);
        elem.setKey(K_NAME);
        elem.setValue(m_name);
        elem.setWidth(6500);

        var elem = properties.add(null, Cairo.General.Constants.VM_CODE);
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

        var elem = properties.add(null, Cairo.General.Constants.VM_CTA_CTE);
        elem.setType(Dialogs.PropertyType.list);
        //'Tipo de Cobranza
        elem.setName(Cairo.Language.getText(5104, ""));
        elem.setSize(15);
        elem.setListItemData(m_ctacte);
        elem.setListWhoSetItem(csListItemData);
        var w_list = elem.getList();
        var elem = w_list.add(null);
        elem.Id = csE_VentaModoCtaCte.cSVM_CTACTEHOJARUTA;
        //'Hoja de Ruta
        elem.setValue(Cairo.Language.getText(5106, ""));
        var elem = w_list.add(null);
        elem.Id = csE_VentaModoCtaCte.cSVM_CTACTEMOSTRADOR;
        //'Cobranza por Mostrador
        elem.setValue(Cairo.Language.getText(5107, ""));
        var elem = w_list.add(null);
        elem.Id = csE_VentaModoCtaCte.cSVM_CTACTEMOSTRADOFACTURA;
        //'Cobranza por Facturador
        elem.setValue(Cairo.Language.getText(5108, ""));
        elem.setKey(K_CTACTE);
        elem.setWidth(3000);
        elem.setLeftNotChange(true);
        elem.setLeft(5000);
        elem.setLeftLabel(-1800);
        elem.setTopFromProperty(Cairo.Constants.ACTIVE);

        var elem = properties.add(null);
        elem.setType(Dialogs.PropertyType.label);
        elem.setHeight(20);
        elem.setBackColor(&HCECECE);
        elem.setLeft(200);
        elem.setWidth(8000);
        elem.setLeftNotChange(true);
        elem.setTopToPrevious(420);
        elem.setTopNotChange(true);

        var elem = properties.add(null);
        elem.setType(Dialogs.PropertyType.label);
        //'Se utiliza en:
        elem.setValue(Cairo.Language.getText(5081, ""));
        elem.setHeight(285);
        elem.setFontBold(true);
        elem.setLeft(360);
        elem.setLeftNotChange(true);
        elem.setTopToPrevious(160);

        var elem = properties.add(null, Cairo.General.Constants.VM_PV);
        elem.setType(Dialogs.PropertyType.check);
        //'Pedidos de Venta
        elem.setName(Cairo.Language.getText(5082, ""));
        elem.setSize(15);
        elem.setValue(Cairo.Util.boolToInt(m_pv));
        elem.setKey(K_PV);
        elem.setWidth(1000);
        elem.setLeftNotChange(true);
        elem.setLeft(3000);
        elem.setLeftLabel(-1800);
        elem.setTopFromProperty(Cairo.Constants.ACTIVE);
        elem.setTopToPrevious(880);

        var elem = properties.add(null, Cairo.General.Constants.VM_OS);
        elem.setType(Dialogs.PropertyType.check);
        //'Ordenes de Servicio
        elem.setName(Cairo.Language.getText(5083, ""));
        elem.setSize(15);
        elem.setValue(Cairo.Util.boolToInt(m_os));
        elem.setKey(K_OS);
        elem.setWidth(1000);
        elem.setLeftNotChange(true);
        elem.setLeft(7000);
        elem.setLeftLabel(-1800);
        elem.setTopFromProperty(Cairo.Constants.ACTIVE);
        elem.setTopToPrevious(880);

        var elem = properties.add(null, Cairo.General.Constants.VM_COBZ);
        elem.setType(Dialogs.PropertyType.check);
        //'Cobranzas
        elem.setName(Cairo.Language.getText(2128, ""));
        elem.setSize(15);
        elem.setValue(Cairo.Util.boolToInt(m_cobz));
        elem.setKey(K_COBZ);
        elem.setWidth(1000);
        elem.setLeftNotChange(true);
        elem.setLeft(3000);
        elem.setLeftLabel(-1800);
        elem.setTopFromProperty(Cairo.Constants.ACTIVE);
        elem.setTopToPrevious(1280);

        var elem = properties.add(null, Cairo.General.Constants.VM_CMVXI);
        elem.setType(Dialogs.PropertyType.check);
        //'Cobro por Internet
        elem.setName(Cairo.Language.getText(5105, ""));
        elem.setSize(15);
        elem.setValue(Cairo.Util.boolToInt(m_cmvxi));
        elem.setKey(K_CMVXI);
        elem.setWidth(1000);
        elem.setLeftNotChange(true);
        elem.setLeft(7000);
        elem.setLeftLabel(-1800);
        elem.setTopFromProperty(Cairo.Constants.ACTIVE);
        elem.setTopToPrevious(1280);

        var elem = properties.add(null);
        elem.setType(Dialogs.PropertyType.label);
        elem.setHeight(20);
        elem.setBackColor(&HCECECE);
        elem.setLeft(200);
        elem.setWidth(8000);
        elem.setLeftNotChange(true);
        elem.setTopToPrevious(590);
        elem.setTopNotChange(true);

        var elem = properties.add(null, Cairo.General.Constants.CUE_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setSelectFilter("cuec_id = "+ csECuentaCategoria.cSECUECCAJA.toString());
        //'Cuenta
        elem.setName(Cairo.Language.getText(1267, ""));
        elem.setSize(15);
        elem.setValue(m_cuenta);
        elem.setSelectId(m_cue_id);
        elem.setKey(K_CUE_ID);
        elem.setWidth(6500);
        elem.setTopToPrevious(520);

        var elem = properties.add(null, Cairo.General.Constants.VM_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setSize(255);
        elem.setHeight(660);
        elem.setWidth(6500);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setValue(m_descrip);
        elem.setKey(K_DESCRIP);

        if(!m_dialog.show(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(Cairo.General.Constants.VM_NAME);
        elem.setValue(m_name);

        var elem = properties.item(Cairo.General.Constants.VM_CODE);
        elem.setValue(m_code);

        var elem = properties.item(Cairo.Constants.ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        var elem = properties.item(Cairo.General.Constants.VM_CTA_CTE);

        var elem = properties.add(null);

        var elem = properties.add(null);

        var elem = properties.item(Cairo.General.Constants.VM_PV);
        elem.setValue(Cairo.Util.boolToInt(m_pv));

        var elem = properties.item(Cairo.General.Constants.VM_OS);
        elem.setValue(Cairo.Util.boolToInt(m_os));

        var elem = properties.item(Cairo.General.Constants.VM_COBZ);
        elem.setValue(Cairo.Util.boolToInt(m_cobz));

        var elem = properties.item(Cairo.General.Constants.VM_CMVXI);
        elem.setValue(Cairo.Util.boolToInt(m_cmvxi));

        var elem = properties.add(null);

        var elem = properties.item(Cairo.General.Constants.CUE_ID);
        elem.setValue(m_cuenta);
        elem.setSelectId(m_cue_id);

        var elem = properties.item(Cairo.General.Constants.VM_DESCRIP);
        elem.setValue(m_descrip);

        return m_dialog.showValues(properties);
      };

      var load = function(id) {

        var apiPath = Cairo.Database.getAPIVersion();
        return Cairo.Database.getData("load[" + apiPath + "general/ventamodo]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id === Cairo.Constants.NO_ID) {
              m_active = true;
              m_name = "";
              m_code = "";
              m_descrip = "";
              m_id = Cairo.Constants.NO_ID;
              m_cue_id = Cairo.Constants.NO_ID;
              m_cuenta = "";
              m_ctacte = csE_VentaModoCtaCte.cSVM_CTACTEMOSTRADOFACTURA;
              m_pv = 0;
              m_os = 0;
              m_cmvxi = 0;
              m_cobz = 0;
            } 
            else {
              m_active = Cairo.Database.valField(response.data, Cairo.Constants.ACTIVE);
              m_name = Cairo.Database.valField(response.data, Cairo.General.Constants.VM_NAME);
              m_code = Cairo.Database.valField(response.data, Cairo.General.Constants.VM_CODE);
              m_descrip = Cairo.Database.valField(response.data, Cairo.General.Constants.VM_DESCRIP);
              m_id = Cairo.Database.valField(response.data, Cairo.General.Constants.VM_ID);
              m_ctacte = Cairo.Database.valField(response.data, Cairo.General.Constants.VM_CTA_CTE);
              m_pv = Cairo.Database.valField(response.data, Cairo.General.Constants.VM_PV);
              m_os = Cairo.Database.valField(response.data, Cairo.General.Constants.VM_OS);
              m_cmvxi = Cairo.Database.valField(response.data, Cairo.General.Constants.VM_CMVXI);
              m_cobz = Cairo.Database.valField(response.data, Cairo.General.Constants.VM_COBZ);
              m_cuenta = Cairo.Database.valField(response.data, Cairo.General.Constants.CUE_NAME);
              m_cue_id = Cairo.Database.valField(response.data, Cairo.General.Constants.CUE_ID);
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

  Cairo.module("VentaModo.List", function(List, Cairo, Backbone, Marionette, $, _) {
    List.Controller = {
      list: function() {

        var self = this;

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
            entitiesTitle: "VentaModos",
            entityName: "ventamodo",
            entitiesName: "ventamodos"
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
            var apiPath = Cairo.Database.getAPIVersion();
            return Cairo.Database.destroy(apiPath + "general/ventamodo", id, Cairo.Constants.DELETE_FUNCTION, "VentaModo").success(
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
          Cairo.LoadingMessage.show("VentaModos", "Loading ventamodo from Crowsoft Cairo server.");

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