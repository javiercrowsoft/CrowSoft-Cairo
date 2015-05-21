(function() {
  "use strict";

  Cairo.module("ListaPrecioMarcado.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      // cListaPrecioMarcado
      // 05-02-01

      var C_MODULE = "cListaPrecioMarcado";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_BASE = 3;
      var K_PORCENTAJE = 4;
      var K_SALTO = 5;
      var K_DECREMENTO = 6;
      var K_PORCMINIMO = 7;
      var K_PORCMAXIMO = 8;
      var K_MONTOMINIMO = 9;
      var K_ACTIVE = 10;
      var K_DESCRIP = 11;
      var K_MON_ID = 12;
      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_active;
      var m_descrip = "";

      var m_base = 0;
      var m_porcentaje = 0;
      var m_salto = 0;
      var m_decremento = 0;
      var m_porcminimo = 0;
      var m_porcmaximo = 0;
      var m_montominimo = 0;

      var m_mon_id = 0;
      var m_moneda = "";

      var m_editing;

      var m_dialog;
      var m_listController = null;

      var m_isNew;

      var m_branchId = 0;
      var m_treeId = 0;

      var m_copy;

      var m_ventaConfig;

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

        var property = m_dialog.getProperties().item(Cairo.General.Constants.LPM_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.LPM_CODE));
        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.LPM_NAME));

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

          doc.setClientTable(Cairo.General.Constants.LISTA_PRECIO_MARCADO);
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

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_LISTA_PRECIO_MARCADO);
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

        register.setFieldId(Cairo.General.Constants.LPM_ID);
        register.setTable(Cairo.General.Constants.LISTA_PRECIO_MARCADO);

        var apiPath = Cairo.Database.getAPIVersion();
        register.setPath(apiPath + "general/listapreciomarcado");

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
              fields.add(Cairo.General.Constants.LPM_NAME, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODE:
              fields.add(Cairo.General.Constants.LPM_CODE, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.boolean);
              break;

            case K_DESCRIP:
              fields.add(Cairo.General.Constants.LPM_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_BASE:
              fields.add(Cairo.General.Constants.LPM_BASE, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_PORCENTAJE:
              fields.add(Cairo.General.Constants.LPM_PORCENTAJE, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_SALTO:
              fields.add(Cairo.General.Constants.LPM_SALTO, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_DECREMENTO:
              fields.add(Cairo.General.Constants.LPM_DECREMENTO, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_PORCMINIMO:
              fields.add(Cairo.General.Constants.LPM_PORCMINIMO, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_PORCMAXIMO:
              fields.add(Cairo.General.Constants.LPM_PORCMAXIMO, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_MONTOMINIMO:
              fields.add(Cairo.General.Constants.LPM_MONTOMINIMO, property.getValue(), Cairo.Constants.Types.currency);
              break;

            case K_MON_ID:
              fields.add(Cairo.General.Constants.MON_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;
          }
        }

        // Error al grabar la tabla de marcado de precios
        return Cairo.Database.saveEx(
            register,
            false,
            Cairo.General.Constants.LPM_CODE, 
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            Cairo.Language.getText(3505, "")).then(

          function(result) {
            if(result.success) {
                pUpdateListaPrecioPrecio();

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
        return "#general/listapreciomarcado/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "listapreciomarcado" + id;
      };

      self.getTitle = function() {
        // Tabla de Marcado de Precios
        return Cairo.Language.getText(3506, "");
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

            case K_MON_ID:
              if(Cairo.Util.valEmpty(property.getSelectId(), Cairo.Constants.Types.id)) {
                // Debe indicar una moneda
                Cairo.Modal.showInfo(Cairo.Language.getText(1108, ""));
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
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_LISTA_PRECIO_MARCADO);
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_LISTA_PRECIO_MARCADO)) { return p; }
          } 
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_LISTA_PRECIO_MARCADO)) { return p; }
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

        var elem = properties.add(null, Cairo.General.Constants.LPM_NAME);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(100);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        var elem = properties.add(null, Cairo.General.Constants.LPM_CODE);
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

        var elem = properties.add(null, Cairo.General.Constants.LPM_BASE);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());
        // Base
        elem.setName(Cairo.Language.getText(2550, ""));
        elem.setKey(K_BASE);
        elem.setValue(m_base);

        var elem = properties.add(null, Cairo.General.Constants.LPM_PORCENTAJE);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
        // porcentaje
        elem.setName(Cairo.Language.getText(1105, ""));
        elem.setKey(K_PORCENTAJE);
        elem.setValue(m_porcentaje);

        var elem = properties.add(null, Cairo.General.Constants.LPM_SALTO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());
        // Salto
        elem.setName(Cairo.Language.getText(3509, ""));
        elem.setKey(K_SALTO);
        elem.setValue(m_salto);

        var elem = properties.add(null, Cairo.General.Constants.LPM_DECREMENTO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
        // Decremento
        elem.setName(Cairo.Language.getText(3510, ""));
        elem.setKey(K_DECREMENTO);
        elem.setValue(m_decremento);

        var elem = properties.add(null, Cairo.General.Constants.LPM_PORCMINIMO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
        // Porc. Minimo
        elem.setName(Cairo.Language.getText(3511, ""));
        elem.setKey(K_PORCMINIMO);
        elem.setValue(m_porcminimo);

        var elem = properties.add(null, Cairo.General.Constants.LPM_PORCMAXIMO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
        // Porc. Maximo
        elem.setName(Cairo.Language.getText(3512, ""));
        elem.setKey(K_PORCMAXIMO);
        elem.setValue(m_porcmaximo);

        var elem = properties.add(null, Cairo.General.Constants.LPM_MONTOMINIMO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());
        // Monto Minimo
        elem.setName(Cairo.Language.getText(3513, ""));
        elem.setKey(K_MONTOMINIMO);
        elem.setValue(m_montominimo);

        var elem = properties.add(null, Cairo.General.Constants.MON_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        // Moneda
        elem.setName(Cairo.Language.getText(1113, ""));
        elem.setKey(K_MON_ID);
        elem.setSelectId(m_mon_id);
        elem.setValue(m_moneda);

        var elem = properties.add(null, Cairo.General.Constants.LPM_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);

        if(!m_dialog.show(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(Cairo.General.Constants.LPM_NAME);
        elem.setValue(m_name);

        var elem = properties.item(Cairo.General.Constants.LPM_CODE);
        elem.setValue(m_code);

        var elem = properties.item(Cairo.Constants.ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        var elem = properties.item(Cairo.General.Constants.LPM_BASE);
        elem.setValue(m_base);

        var elem = properties.item(Cairo.General.Constants.LPM_PORCENTAJE);
        elem.setValue(m_porcentaje);

        var elem = properties.item(Cairo.General.Constants.LPM_SALTO);
        elem.setValue(m_salto);

        var elem = properties.item(Cairo.General.Constants.LPM_DECREMENTO);
        elem.setValue(m_decremento);

        var elem = properties.item(Cairo.General.Constants.LPM_PORCMINIMO);
        elem.setValue(m_porcminimo);

        var elem = properties.item(Cairo.General.Constants.LPM_PORCMAXIMO);
        elem.setValue(m_porcmaximo);

        var elem = properties.item(Cairo.General.Constants.LPM_MONTOMINIMO);
        elem.setValue(m_montominimo);

        var elem = properties.item(Cairo.General.Constants.MON_ID);
        elem.setSelectId(m_mon_id);
        elem.setValue(m_moneda);

        var elem = properties.item(Cairo.General.Constants.LPM_DESCRIP);
        elem.setValue(m_descrip);

        return m_dialog.showValues(properties);
      };

      var load = function(id) {

        var apiPath = Cairo.Database.getAPIVersion();
        return Cairo.Database.getData("load[" + apiPath + "general/listapreciomarcado]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id === Cairo.Constants.NO_ID) {
              m_active = true;
              m_name = "";
              m_code = "";
              m_id = Cairo.Constants.NO_ID;
              m_base = 0;
              m_porcentaje = 0;
              m_salto = 0;
              m_decremento = 0;
              m_porcminimo = 0;
              m_porcmaximo = 0;
              m_montominimo = 0;
              m_descrip = "";
              m_mon_id = Cairo.Constants.NO_ID;
              m_moneda = "";
            } 
            else {
              m_active = Cairo.Database.valField(response.data, Cairo.Constants.ACTIVE);
              m_name = Cairo.Database.valField(response.data, Cairo.General.Constants.LPM_NAME);
              m_code = Cairo.Database.valField(response.data, Cairo.General.Constants.LPM_CODE);
              m_id = Cairo.Database.valField(response.data, Cairo.General.Constants.LPM_ID);
              m_base = Cairo.Database.valField(response.data, Cairo.General.Constants.LPM_BASE);
              m_porcentaje = Cairo.Database.valField(response.data, Cairo.General.Constants.LPM_PORCENTAJE);
              m_salto = Cairo.Database.valField(response.data, Cairo.General.Constants.LPM_SALTO);
              m_decremento = Cairo.Database.valField(response.data, Cairo.General.Constants.LPM_DECREMENTO);
              m_porcminimo = Cairo.Database.valField(response.data, Cairo.General.Constants.LPM_PORCMINIMO);
              m_porcmaximo = Cairo.Database.valField(response.data, Cairo.General.Constants.LPM_PORCMAXIMO);
              m_montominimo = Cairo.Database.valField(response.data, Cairo.General.Constants.LPM_MONTOMINIMO);
              m_descrip = Cairo.Database.valField(response.data, Cairo.General.Constants.LPM_DESCRIP);
              m_mon_id = Cairo.Database.valField(response.data, Cairo.General.Constants.MON_ID);
              m_moneda = Cairo.Database.valField(response.data, Cairo.General.Constants.MON_NAME);
            }

          return true;
        });
      };

      var pUpdateListaPrecioPrecio = function() {

        if(!m_ventaConfig.getUsarListaPrecioPrecio()) { return; }

        if(cWindow.ask(Cairo.Language.getText(3600, ""), vbYes)) {

          var sqlstmt = null;
          var oldTimeOut = null;

          sqlstmt = "sp_listaPrecioMarcadoUpdateCache "+ m_id;
          oldTimeOut = Cairo.Database.getCommandTimeout();
          Cairo.Database.setCommandTimeout(1200);
          Cairo.Database.execute(sqlstmt);
          Cairo.Database.setCommandTimeout(oldTimeOut);
        }

      };

      var initialize = function() {
        m_ventaConfig = new cVentaConfig();
        m_ventaConfig.load();
      };

      var destroy = function() {
        m_dialog = null;
        m_listController = null;
        m_ventaConfig = null;
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

      initialize();

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("ListaPrecioMarcado.List", function(List, Cairo, Backbone, Marionette, $, _) {
    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.listaPrecioMarcadoEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.listaPrecioMarcadoEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Listas de Marcado de Precio",
            entityName: "lista de marcado",
            entitiesName: "listas de marcado de precios"
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
              var editor = Cairo.ListaPrecioMarcado.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_LISTA_PRECIO_MARCADO)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            var apiPath = Cairo.Database.getAPIVersion();
            return Cairo.Database.destroy(apiPath + "general/listapreciomarcado", id, Cairo.Constants.DELETE_FUNCTION, "ListaPrecioMarcado").success(
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
          Cairo.LoadingMessage.show("Listas de Marcado de Precios", "Loading Listas de Marcado de Precios from CrowSoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ listaPrecioMarcadoTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.LISTA_PRECIO_MARCADO,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.listaPrecioMarcadoTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("Listas de Marcado de Precios", "listaPrecioMarcadoTreeRegion", "#general/listaspreciomarcado", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());