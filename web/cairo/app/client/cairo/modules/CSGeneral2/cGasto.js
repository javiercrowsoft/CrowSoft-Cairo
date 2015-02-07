(function() {
  "use strict";

  Cairo.module("Gasto.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      // cGasto
      // 02-02-04

      var C_MODULE = "cGasto";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_DESCRIP = 3;
      var K_TIPO = 4;
      var K_FIJO = 5;
      var K_MINIMO = 6;
      var K_PORCENTAJE = 7;
      var K_IMPORTE = 8;
      var K_MON_ID = 9;
      var K_TI_ID = 10;
      var K_ACTIVE = 11;

      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_descrip = "";
      var m_tipo;
      var m_fijo = 0;
      var m_minimo = 0;
      var m_porcentaje = 0;
      var m_importe = 0;
      var m_mon_id = 0;
      var m_moneda = "";
      var m_ti_id = 0;
      var m_tasaImpositiva = "";
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

          doc.setClientTable(Cairo.General.Constants.GASTO);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.SHOW_DOCUMENTS_FUNCTION, C_MODULE, "");
        }
              
        return _rtn;
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

      self.messageEx = function(messageId,  info) {
        return true;
      };

      self.discardChanges = function() {
        return Cairo.Promises.resolvedPromise(refreshCollection());
      };

      self.copy = function() {

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, Cairo.Constants.NO_ID);

        var property = m_dialog.getProperties().item(Cairo.General.Constants.GTO_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.GTO_CODE));
        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.GTO_NAME));

        m_copy = true;
      };

      self.propertyChange = function(key) {

        return Cairo.Promises.resolvedPromise(false);
      };

      self.save = function() {

        var register = new Cairo.Database.Register();
        var fields = register.getFields();

        register.setFieldId(Cairo.General.Constants.GTO_ID);
        register.setTable(Cairo.General.Constants.GASTO);

        var apiPath = Cairo.Database.getAPIVersion();
        register.setPath(apiPath + "general/gasto");

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
              fields.add(Cairo.General.Constants.GTO_NAME, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODE:
              fields.add(Cairo.General.Constants.GTO_CODE, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_DESCRIP:
              fields.add(Cairo.General.Constants.GTO_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_TIPO:
              fields.add(Cairo.General.Constants.GTO_TIPO, property.getListItemData(), Cairo.Constants.Types.integer);
              break;

            case K_FIJO:
              fields.add(Cairo.General.Constants.GTO_FIJO, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_MINIMO:
              fields.add(Cairo.General.Constants.GTO_MINIMO, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_PORCENTAJE:
              fields.add(Cairo.General.Constants.GTO_PORCENTAJE, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_IMPORTE:
              fields.add(Cairo.General.Constants.GTO_IMPORTE, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_MON_ID:
              fields.add(Cairo.General.Constants.MON_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_TI_ID:
              fields.add(Cairo.General.Constants.TI_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, property.getValue(), Cairo.Constants.Types.boolean);

              break;
          }
        }

        return Cairo.Database.saveEx(
            register,
            false,
            Cairo.General.Constants.GTO_CODE, 
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            Cairo.Language.getText(1220, "")).then(

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
        return "#general/gasto/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "gasto" + id;
      };

      self.getTitle = function() {
        //Gastos
        return Cairo.Language.getText(1221, "");
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

            case K_TIPO:
              if(Cairo.Util.valEmpty(property.getListItemData(), Cairo.Constants.Types.integer)) {
                // Debe indicar un tipo
                Cairo.Modal.showInfo(Cairo.Language.getText(1222, ""));
              }
              break;

            case K_MON_ID:
              if(Cairo.Util.valEmpty(property.getSelectId(), Cairo.Constants.Types.id)) {
                // Debe indicar un moneda
                Cairo.Modal.showInfo(Cairo.Language.getText(1108, ""));
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      self.setTreeId = function(rhs) {
        m_treeId = rhs;
      };

      self.getTreeId = function() {
        return m_treeId;
      };

      self.list = function() {
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_GASTO);
      };

      self.getDialog = function() {
        return m_dialog;
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_GASTO)) { return p; }
          } 
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_GASTO)) { return p; }
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

        var elem = properties.add(null, Cairo.General.Constants.GTO_NAME);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(100);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        var elem = properties.add(null, Cairo.General.Constants.GTO_CODE);
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

        var elem = properties.add(null, Cairo.General.Constants.GTO_TIPO);
        elem.setType(Dialogs.PropertyType.list);
        // Tipo
        elem.setName(Cairo.Language.getText(1223, ""));
        elem.setKey(K_TIPO);
        elem.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
        elem.setListItemData(m_tipo);

        // TODO: fix this: it uses a list. var elem is wrong. It must be var item = elem.getList().add( ...
        var elem = elem.add(null);
        elem.Id = csE_GastoTipo.cSEGTOTAEREO;
        // A�reo
        elem.setValue(Cairo.Language.getText(1224, ""));
        var elem = elem.add(null);
        elem.Id = csE_GastoTipo.cSEGTOTGENERAL;
        elem.setValue(Cairo.Constants.TAB_GENERAL);
        var elem = elem.add(null);
        elem.Id = csE_GastoTipo.cSEGTOTMARITIMO;
        // Mar�timo
        elem.setValue(Cairo.Language.getText(1225, ""));

        var elem = properties.add(null, Cairo.General.Constants.GTO_FIJO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        // Fijo
        elem.setName(Cairo.Language.getText(1226, ""));
        elem.setKey(K_FIJO);
        elem.setValue(m_fijo);

        var elem = properties.add(null, Cairo.General.Constants.GTO_MINIMO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        // M�nimo
        elem.setName(Cairo.Language.getText(1227, ""));
        elem.setKey(K_MINIMO);
        elem.setValue(m_minimo);
        elem.setTopFromProperty(Cairo.General.Constants.GTO_NAME);
        elem.setLeft(5800);

        var elem = properties.add(null, Cairo.General.Constants.GTO_PORCENTAJE);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
        // Porcentaje
        elem.setName(Cairo.Language.getText(1105, ""));
        elem.setKey(K_PORCENTAJE);
        elem.setValue(m_porcentaje);

        var elem = properties.add(null, Cairo.General.Constants.GTO_IMPORTE);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        // Importe
        elem.setName(Cairo.Language.getText(1228, ""));
        elem.setKey(K_IMPORTE);
        elem.setValue(m_importe);

        var elem = properties.add(null, Cairo.General.Constants.MON_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        // Moneda
        elem.setName(Cairo.Language.getText(1113, ""));
        elem.setKey(K_MON_ID);
        elem.setValue(m_moneda);
        elem.setSelectId(m_mon_id);

        var elem = properties.add(null, Cairo.General.Constants.TI_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TASA_IMPOSITIVA);
        // Tasa Impositiva
        elem.setName(Cairo.Language.getText(1229, ""));
        elem.setKey(K_TI_ID);
        elem.setValue(m_tasaImpositiva);
        elem.setSelectId(m_ti_id);

        var elem = properties.add(null, Cairo.General.Constants.GTO_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setLeftFromProperty(Cairo.General.Constants.GTO_NAME);
        elem.setTopFromProperty(Cairo.General.Constants.GTO_FIJO);
        elem.setTopToPrevious(440);
        elem.setHeight(660);
        elem.setWidth(6500);
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

        var elem = properties.item(Cairo.General.Constants.GTO_NAME);
        elem.setValue(m_name);

        var elem = properties.item(Cairo.General.Constants.GTO_CODE);
        elem.setValue(m_code);

        var elem = properties.item(Cairo.Constants.ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        var elem = properties.item(Cairo.General.Constants.GTO_TIPO);
        elem.setValue(Cairo.Constants.TAB_GENERAL);

        var elem = properties.item(Cairo.General.Constants.GTO_FIJO);
        elem.setValue(m_fijo);

        var elem = properties.item(Cairo.General.Constants.GTO_MINIMO);
        elem.setValue(m_minimo);

        var elem = properties.item(Cairo.General.Constants.GTO_PORCENTAJE);
        elem.setValue(m_porcentaje);

        var elem = properties.item(Cairo.General.Constants.GTO_IMPORTE);
        elem.setValue(m_importe);

        var elem = properties.item(Cairo.General.Constants.MON_ID);
        elem.setValue(m_moneda);
        elem.setSelectId(m_mon_id);

        var elem = properties.item(Cairo.General.Constants.TI_ID);
        elem.setValue(m_tasaImpositiva);
        elem.setSelectId(m_ti_id);

        var elem = properties.item(Cairo.General.Constants.GTO_DESCRIP);
        elem.setValue(m_descrip);

        return m_dialog.showValues(properties);
      };

      var load = function(id) {

        var apiPath = Cairo.Database.getAPIVersion();
        return Cairo.Database.getData("load[" + apiPath + "general/gasto]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== Cairo.Constants.NO_ID) {

              m_id = Cairo.Database.valField(response.data, Cairo.General.Constants.GTO_ID);
              m_name = Cairo.Database.valField(response.data, Cairo.General.Constants.GTO_NAME);
              m_code = Cairo.Database.valField(response.data, Cairo.General.Constants.GTO_CODE);
              m_descrip = Cairo.Database.valField(response.data, Cairo.General.Constants.GTO_DESCRIP);
              m_tipo = Cairo.Database.valField(response.data, Cairo.General.Constants.GTO_TIPO);
              m_fijo = Cairo.Database.valField(response.data, Cairo.General.Constants.GTO_FIJO);
              m_minimo = Cairo.Database.valField(response.data, Cairo.General.Constants.GTO_MINIMO);
              m_porcentaje = Cairo.Database.valField(response.data, Cairo.General.Constants.GTO_PORCENTAJE);
              m_importe = Cairo.Database.valField(response.data, Cairo.General.Constants.GTO_IMPORTE);

              m_mon_id = Cairo.Database.valField(response.data, Cairo.General.Constants.MON_ID);
              m_moneda = Cairo.Database.valField(response.data, Cairo.General.Constants.MON_NAME);

              m_ti_id = Cairo.Database.valField(response.data, Cairo.General.Constants.TI_ID);
              m_tasaImpositiva = Cairo.Database.valField(response.data, Cairo.General.Constants.TI_NAME);
              m_active = Cairo.Database.valField(response.data, Cairo.Constants.ACTIVE);

            } 
            else {
              m_id = Cairo.Constants.NO_ID;
              m_name = "";
              m_code = "";
              m_descrip = "";
              m_tipo = csE_GastoTipo.cSEGTOTGENERAL;
              m_fijo = 0;
              m_minimo = 0;
              m_porcentaje = 0;
              m_mon_id = Cairo.Constants.NO_ID;
              m_moneda = "";
              m_ti_id = Cairo.Constants.NO_ID;
              m_tasaImpositiva = "";
              m_importe = 0;
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

  Cairo.module("Gasto.List", function(List, Cairo, Backbone, Marionette, $, _) {
    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.gastoEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.gastoEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Gastos",
            entityName: "gasto",
            entitiesName: "gastos"
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
              var editor = Cairo.Gasto.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_GASTO)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            var apiPath = Cairo.Database.getAPIVersion();
            return Cairo.Database.destroy(apiPath + "general/gasto", id, Cairo.Constants.DELETE_FUNCTION, "Gasto").success(
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
          Cairo.LoadingMessage.show("Gastos", "Loading Gastos from CrowSoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ gastoTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.GASTO,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.gastoTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("Gastos", "gastoTreeRegion", "#general/gastos", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());