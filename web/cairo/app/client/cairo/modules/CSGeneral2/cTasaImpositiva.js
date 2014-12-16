(function() {
  "use strict";

  Cairo.module("TasaImpositiva.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      // cTasaImpositiva
      // 31-07-00

      var C_MODULE = "cTasaImpositiva";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_ACTIVE = 3;
      var K_PORCENTAJE = 4;
      var K_CODIGODGI1 = 5;
      var K_CODIGODGI2 = 6;
      var K_CUE_ID = 7;
      var K_TIPO = 8;

//*TODO:** enum is translated as a new class at the end of the file Public Enum csE_TasaImpositivaTipo

      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_active;
      var m_porcentaje = 0;
      var m_codigoDGI1 = "";
      var m_codigoDGI2 = "";
      var m_cuenta = "";
      var m_cue_id = 0;
      var m_tipo = 0;

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
      self.setId = function(rhs) {
        m_id = rhs;
      };
      self.getName = function() {
        return m_name;
      };
      self.setNombre = function(rhs) {
        m_name = rhs;
      };
      self.getCode = function() {
        return m_code;
      };
      self.setCodigo = function(rhs) {
        m_code = rhs;
      };

      self.data = function(id,  field) {
        var rtn = null;

        if(!Cairo.Database.getData(Cairo.General.Constants.TASA_IMPOSITIVA, Cairo.General.Constants.TI_ID, id, field, rtn, "Data", C_MODULE)) { return null; }
        return rtn;
      };

      self.copy = function() {

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, Cairo.Constants.NO_ID);

        var property = m_dialog.getProperties().item(Cairo.General.Constants.TI_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.TI_CODE));
        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.TI_NAME));

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

          doc.setClientTable(Cairo.General.Constants.TASA_IMPOSITIVA);
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

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_TASA_IMPOSITIVA);
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

        register.setFieldId(Cairo.General.Constants.TI_ID);
        register.setTable(Cairo.General.Constants.TASA_IMPOSITIVA);

        var apiPath = Cairo.Database.getAPIVersion();
        register.setPath(apiPath + "general/tasaimpositiva");

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
              fields.add(Cairo.General.Constants.TI_NAME, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODE:
              fields.add(Cairo.General.Constants.TI_CODE, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.boolean);
              break;

            case K_PORCENTAJE:
              fields.add(Cairo.General.Constants.TI_PORCENTAJE, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_CODIGODGI1:
              fields.add(Cairo.General.Constants.TI_CODIGO_DGI1, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODIGODGI2:
              fields.add(Cairo.General.Constants.TI_CODIGO_DGI2, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CUE_ID:
              fields.add(Cairo.General.Constants.CUE_ID, property.getSelectId(), Cairo.Constants.Types.text);
              break;

            case K_TIPO:
              fields.add(Cairo.General.Constants.TI_TIPO, property.getListItemData(), Cairo.Constants.Types.integer);
              break;
          }
        }

        return Cairo.Database.saveEx(
            register,
            false,
            Cairo.General.Constants.TI_CODE, 
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            Cairo.Language.getText(1481, "")).then(

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
        return "#general/tasaimpositiva/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "tasaImpositiva" + id;
      };

      self.getTitle = function() {
        // Tasas Impositivas
        return Cairo.Language.getText(1482, "");
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

            case K_CUE_ID:
              if(Cairo.Util.valEmpty(property.getSelectId(), Cairo.Constants.Types.id)) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1261, "")).then(function() {return false;});
                // Debe indicar una cuenta
              }

              break;

            case K_PORCENTAJE:
              if(!IsNumeric(property.getValue())) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1484, "")).then(function() {return false;});
                //El porcentaje debe ser un número de -200.00 a 200.00
              }
              if(property.getValue() < -200 || property.getValue() > 200) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1483, "")).then(function() {return false;});
                //El porcentaje esta fuera del rango permitido (-200.00 a 200.00)
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
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_TASA_IMPOSITIVA);
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_TASA_IMPOSITIVA)) { return p; }
          } 
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_TASA_IMPOSITIVA)) { return p; }
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

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, Cairo.General.Constants.TI_NAME);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(100);
        elem.setWidth(4500);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        var elem = properties.add(null, Cairo.General.Constants.TI_CODE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setSize(15);
        elem.setValue(m_code);
        elem.setKey(K_CODE);

        var elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setTopFromProperty(Cairo.General.Constants.TI_CODE);
        elem.setTopNotChange(true);
        elem.setLeft(5200);
        elem.setLeftNotChange(true);
        elem.setLeftLabel(-700);
        elem.setKey(K_ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        var elem = properties.add(null, Cairo.General.Constants.TI_PORCENTAJE);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
        // Porcentaje
        elem.setName(Cairo.Language.getText(1105, ""));
        elem.setKey(K_PORCENTAJE);
        elem.setWidth(1000);
        elem.setValue(m_porcentaje);

        var elem = properties.add(null, Cairo.General.Constants.CUEC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        // Cuenta
        elem.setName(Cairo.Language.getText(1267, ""));
        elem.setKey(K_CUE_ID);
        elem.setValue(m_cuenta);
        elem.setSelectId(m_cue_id);

        var elem = properties.add(null, Cairo.General.Constants.TI_CODIGO_DGI1);
        elem.setType(Dialogs.PropertyType.text);
        // Código DGI 1
        elem.setName(Cairo.Language.getText(1486, ""));
        elem.setSize(5);
        elem.setWidth(1500);
        elem.setKey(K_CODIGODGI1);
        elem.setValue(m_codigoDGI1);

        var elem = properties.add(null, Cairo.General.Constants.TI_CODIGO_DGI2);
        elem.setType(Dialogs.PropertyType.text);
        // Código DGI 2
        elem.setName(Cairo.Language.getText(1487, ""));
        elem.setTopFromProperty(Cairo.General.Constants.TI_CODIGO_DGI1);
        elem.setTopNotChange(true);
        elem.setLeft(4500);
        elem.setLeftNotChange(true);
        elem.setSize(5);
        elem.setWidth(1500);
        elem.setKey(K_CODIGODGI2);
        elem.setValue(m_codigoDGI2);

        var elem = properties.add(null, Cairo.General.Constants.TI_TIPO);
        elem.setType(Dialogs.PropertyType.list);
        // Tipo
        elem.setName(Cairo.Language.getText(1223, ""));
        elem.setSize(5);
        elem.setKey(K_TIPO);
        elem.setListWhoSetItem(csListItemData);
        elem.setListItemData(m_tipo);

        var w_list = elem.getList();
        var elem = w_list.add(null, csE_TasaImpositivaTipo.cSTI_VENTAS);
        elem.Id = csE_TasaImpositivaTipo.cSTI_VENTAS;
        // Ventas
        elem.setValue(Cairo.Language.getText(1488, ""));

        var elem = w_list.add(null, csE_TasaImpositivaTipo.cSTI_COMPRAS);
        elem.Id = csE_TasaImpositivaTipo.cSTI_COMPRAS;
        // Compras
        elem.setValue(Cairo.Language.getText(1489, ""));

        if(!m_dialog.show(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(Cairo.General.Constants.TI_NAME);
        elem.setValue(m_name);

        var elem = properties.item(Cairo.General.Constants.TI_CODE);
        elem.setValue(m_code);

        var elem = properties.item(Cairo.Constants.ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        var elem = properties.item(Cairo.General.Constants.TI_PORCENTAJE);
        elem.setValue(m_porcentaje);

        var elem = properties.item(Cairo.General.Constants.CUEC_ID);
        elem.setValue(m_cuenta);
        elem.setSelectId(m_cue_id);

        var elem = properties.item(Cairo.General.Constants.TI_CODIGO_DGI1);
        elem.setValue(m_codigoDGI1);

        var elem = properties.item(Cairo.General.Constants.TI_CODIGO_DGI2);
        elem.setValue(m_codigoDGI2);

        var elem = properties.item(Cairo.General.Constants.TI_TIPO);

        return m_dialog.showValues(properties);
      };

      var load = function(id) {

        var apiPath = Cairo.Database.getAPIVersion();
        return Cairo.Database.getData("load[" + apiPath + "general/tasaimpositiva]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id === Cairo.Constants.NO_ID) {
              m_active = true;
              m_name = "";
              m_code = "";
              m_id = Cairo.Constants.NO_ID;
              m_porcentaje = 0;
              m_codigoDGI1 = "";
              m_codigoDGI2 = "";
              m_cue_id = 0;
              m_cuenta = "";
              m_tipo = csE_TasaImpositivaTipo.cSTI_VENTAS;
            } 
            else {
              m_active = Cairo.Database.valField(response.data, Cairo.Constants.ACTIVE);
              m_name = Cairo.Database.valField(response.data, Cairo.General.Constants.TI_NAME);
              m_code = Cairo.Database.valField(response.data, Cairo.General.Constants.TI_CODE);
              m_id = Cairo.Database.valField(response.data, Cairo.General.Constants.TI_ID);
              m_porcentaje = Cairo.Database.valField(response.data, Cairo.General.Constants.TI_PORCENTAJE);
              m_codigoDGI1 = Cairo.Database.valField(response.data, Cairo.General.Constants.TI_CODIGO_DGI1);
              m_codigoDGI2 = Cairo.Database.valField(response.data, Cairo.General.Constants.TI_CODIGO_DGI2);
              m_cue_id = Cairo.Database.valField(response.data, Cairo.General.Constants.CUE_ID);
              m_cuenta = Cairo.Database.valField(response.data, Cairo.General.Constants.CUE_NAME);
              m_tipo = Cairo.Database.valField(response.data, Cairo.General.Constants.TI_TIPO);
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

  Cairo.module("TasaImpositiva.List", function(List, Cairo, Backbone, Marionette, $, _) {
    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.tasaImpositivaEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.tasaImpositivaEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Tasas Impositivas",
            entityName: "tasa impositiva",
            entitiesName: "tasas impositivas"
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
              var editor = Cairo.TasaImpositiva.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_TASA_IMPOSITIVA)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            var apiPath = Cairo.Database.getAPIVersion();
            return Cairo.Database.destroy(apiPath + "general/tasaimpositiva", id, Cairo.Constants.DELETE_FUNCTION, "TasaImpositiva").success(
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
          Cairo.LoadingMessage.show("Tasa Impositivas", "Loading Tasas Impositivas from CrowSoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ tasaImpositivaTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.TASA_IMPOSITIVA,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.tasaImpositivaTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("Tasas Impositivas", "tasaImpositivaTreeRegion", "#general/tasasimpositivas", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());