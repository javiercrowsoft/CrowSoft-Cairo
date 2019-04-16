(function() {
  "use strict";

  Cairo.module("CuentaGrupo.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;

      var C_MODULE = "cCuentaGrupo";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_DESCRIP = 3;
      var K_CUE_ID = 4;
      var K_ACTIVE = 5;
      var K_TIPO = 6;
      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_descrip = "";
      var m_cue_id = 0;
      var m_cuenta = "";
      var m_tipo;
      var m_active;

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

          doc.setClientTable(C.CUENTAGRUPO);
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

      self.messageEx = function(messageId, info) {
        var _rtn = null;
        switch (messageId) {

          case Dialogs.Message.MSG_DOC_INFO:

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_CUENTAGRUPO);
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

      self.copy = function() {

        updateList();

        m_isNew = true;

        if(m_listController !== null) {
          m_listController.updateEditorKey(self, NO_ID);
        }

        var property = m_dialog.getProperties().item(C.CUEG_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(C.CUEG_CODE));

        m_copy = true;
      };

      self.propertyChange = function(key) {
        switch (key) {
          case K_TIPO:

            var properties = m_dialog.getProperties();
            properties.item(C.CUE_ID).setSelectFilter(
              D.getCuentaGrupoFilter(
                properties.item(C.CUEG_TIPO).getListItemData()));
            m_dialog.showValue(properties.item(C.CUE_ID));
            break;
        }
      };

      self.save = function() {

        var register = new Cairo.Database.Register();
        var fields = register.getFields();

        register.setFieldId(C.CUEG_ID);
        register.setTable(C.CUENTAGRUPO);

        register.setPath(m_apiPath + "general/cuentagrupo");

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
              fields.add(C.CUEG_NAME, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODE:
              fields.add(C.CUEG_CODE, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_DESCRIP:
              fields.add(C.CUEG_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CUE_ID:
              fields.add(C.CUE_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_TIPO:
              fields.add(C.CUEG_TIPO, property.getListItemData(), Cairo.Constants.Types.integer);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, property.getValue(), Cairo.Constants.Types.boolean);
              break;
          }
        }

        return Cairo.Database.saveEx(
          register,
          false,
          C.CUEG_CODE,
          Cairo.Constants.CLIENT_SAVE_FUNCTION,
          C_MODULE,
          getText(1123, "")).then(

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
        return "#general/cuentagrupo/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "cuentaGrupo" + id;
      };

      self.getTitle = function() {
        //Grupos de cuentas
        return getText(1124, "");
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

        if(!validateTipo()) { return false; }

        return Cairo.Promises.resolvedPromise(true);
      };

      var validateTipo = function() {
        var tipo = null;
        var cuec_id = null;
        var cue_id = null;

        var properties = m_dialog.getProperties();
        cue_id = properties.item(C.CUE_ID).getSelectId();
        tipo = properties.item(C.CUEG_TIPO).getListItemData();

        cuec_id = mPublic.self.getCuecIdFromCueId(cue_id);

        switch (tipo) {
          case C.CuentaGrupoTipo.acreedor:
            if(cuec_id !== csECuentaCategoria.cSECUECACREEDORES && cuec_id !== csECuentaCategoria.cSECUECBANCOS) {
              // La cuenta debe ser de tipo acreedor por compras o banco.
              Cairo.Modal.showInfo(getText(3529, ""));
              return null;
            }

            break;

          case C.CuentaGrupoTipo.deudor:
            if(cuec_id !== csECuentaCategoria.cSECUECDEUDPORVENTAS) {
              // La cuenta debe ser de tipo deudor por ventas.
              Cairo.Modal.showInfo(getText(3530, ""));
              return null;
            }

            break;

          case C.CuentaGrupoTipo.productoVenta:
            if(cuec_id !== csECuentaCategoria.cSECUECINGRESOS && cuec_id !== csECuentaCategoria.cSECUECEGRESOS) {
              if(pCuentaForProducto(cue_id) === false) {
                // La cuenta debe ser de tipo ingresos, o egresos o estar marcada como elegible para productos.
                Cairo.Modal.showInfo(getText(3531, ""));
                return null;
              }
            }

            break;

          case C.CuentaGrupoTipo.productoCompra:
            if(cuec_id !== csECuentaCategoria.cSECUECBIENESDEUSO && cuec_id !== csECuentaCategoria.cSECUECBIENESDECAMBIO && cuec_id !== csECuentaCategoria.cSECUECINGRESOS && cuec_id !== csECuentaCategoria.cSECUECEGRESOS) {

              if(pCuentaForProducto(cue_id) === false) {

                // La cuenta debe ser de tipo bienes de cambio, o bienes de uso, o estar marcada como elegible para productos.
                Cairo.Modal.showInfo(getText(3532, ""));
                return null;
              }
            }

            break;

          case C.CuentaGrupoTipo.debitoAutomatico:
            if(cuec_id !== csECuentaCategoria.cSECUECBANCOS) {
              // La cuenta debe ser de tipo banco
              Cairo.Modal.showInfo(getText(3571, ""));
              return null;
            }

            break;

          case C.CuentaGrupoTipo.fondoFijo:
            if(cuec_id !== csECuentaCategoria.cSECUECCAJA) {
              // La cuenta debe ser de tipo caja
              Cairo.Modal.showInfo(getText(3572, ""));
              return null;
            }

            break;

          default:
            // Debe seleccionar un tipo de grupo de cuenta.
            Cairo.Modal.showInfo(getText(3533, ""));
            return null;
            break;
        }
        return true;
      };

      var pCuentaForProducto = function(cue_id) {
        var _rtn = null;
        if(cue_id !== NO_ID) {
          var bProducto = null;
          if(!DB.getData(C.CUENTA, C.CUE_ID, cue_id, C.CUE_PRODUCTO, bProducto)) { return _rtn; }
          _rtn = bProducto;
        }
        else {
          _rtn = false;
        }

        return _rtn;
      };

      self.setTreeId = function(value) {
        m_treeId = value;
      };

      self.getTreeId = function() {
        return m_treeId;
      };

      self.list = function() {
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_CUENTAGRUPO);
      };

      self.getDialog = function() {
        return m_dialog;
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_CUENTAGRUPO)) { return p; }
          }
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_CUENTAGRUPO)) { return p; }
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

        var elem = properties.add(null, C.CUEG_NAME);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(100);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        var elem = properties.add(null, C.CUEG_CODE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setSize(15);
        elem.setKey(K_CODE);
        elem.setValue(m_code);

        var elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVE);
        elem.setValue(Cairo.Util.boolToInt(m_active));

        var elem = properties.add(null, C.CUEG_TIPO);
        elem.setType(Dialogs.PropertyType.list);
        // Tipo
        elem.setName(getText(1223, ""));
        elem.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
        elem.setListItemData(m_tipo);
        var w_list = elem.getList();
        var elem = w_list.add(null);
        elem.Id = C.CuentaGrupoTipo.acreedor;
        // Acreedor
        elem.setValue(getText(3534, ""));
        var elem = w_list.add(null);
        elem.Id = C.CuentaGrupoTipo.deudor;
        // Deudor
        elem.setValue(getText(3535, ""));
        var elem = w_list.add(null);
        elem.Id = C.CuentaGrupoTipo.productoCompra;
        // Articulos de Compra
        elem.setValue(getText(3536, ""));
        var elem = w_list.add(null);
        elem.Id = C.CuentaGrupoTipo.productoVenta;
        // Articulos de Venta
        elem.setValue(getText(3537, ""));
        var elem = w_list.add(null);
        elem.Id = C.CuentaGrupoTipo.debitoAutomatico;
        // Debito Automatico
        elem.setValue(getText(3569, ""));
        var elem = w_list.add(null);
        elem.Id = C.CuentaGrupoTipo.fondoFijo;
        // Fondo Fijo
        elem.setValue(getText(3570, ""));
        elem.setKey(K_TIPO);

        var elem = properties.add(null, C.CUE_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        // Cuenta por defecto
        elem.setName(getText(1126, ""));
        elem.setKey(K_CUE_ID);
        elem.setValue(m_cuenta);
        elem.setSelectId(m_cue_id);
        elem.setSelectFilter(mPublic.self.getCuentaGrupoFilter(m_tipo));

        var elem = properties.add(null, C.CUEG_DESCRIP);
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

        var elem = properties.item(C.CUEG_NAME);
        elem.setValue(m_name);

        var elem = properties.item(C.CUEG_CODE);
        elem.setValue(m_code);

        var elem = properties.item(Cairo.Constants.ACTIVE);
        elem.setValue(Cairo.Util.boolToInt(m_active));

        var elem = properties.item(C.CUEG_TIPO);

        var elem = properties.item(C.CUE_ID);
        elem.setValue(m_cuenta);
        elem.setSelectId(m_cue_id);

        var elem = properties.item(C.CUEG_DESCRIP);
        elem.setValue(m_descrip);

        return m_dialog.showValues(properties);
      };

      var load = function(id) {

        return DB.getData("load[" + m_apiPath + "general/cuentagrupo]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== NO_ID) {

              m_id = Cairo.Database.valField(response.data, C.CUEG_ID);
              m_name = Cairo.Database.valField(response.data, C.CUEG_NAME);
              m_code = Cairo.Database.valField(response.data, C.CUEG_CODE);
              m_descrip = Cairo.Database.valField(response.data, C.CUEG_DESCRIP);
              m_cue_id = Cairo.Database.valField(response.data, C.CUE_ID);
              m_cuenta = Cairo.Database.valField(response.data, C.CUE_NAME);
              m_tipo = Cairo.Database.valField(response.data, C.CUEG_TIPO);
              m_active = Cairo.Database.valField(response.data, Cairo.Constants.ACTIVE);

            }
            else {

              m_id = NO_ID;
              m_name = "";
              m_code = "";
              m_descrip = "";
              m_cue_id = NO_ID;
              m_cuenta = "";
              m_tipo = C.CuentaGrupoTipo.acreedor;
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
      var editor = Cairo.CuentaGrupo.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit(id);
    };

  });

  Cairo.module("CuentaGrupo.List", function(List, Cairo, Backbone, Marionette, $, _) {

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

          var editors = Cairo.Editors.cuentaGrupoEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.cuentaGrupoEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Grupos de Cuenta",
            entityName: "grupo de cuentas",
            entitiesName: "grupos de cuentas"
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
              var editor = Cairo.CuentaGrupo.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_CUENTAGRUPO)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            return Cairo.Database.destroy(m_apiPath + "general/cuentagrupo", id, Cairo.Constants.DELETE_FUNCTION, "CuentaGrupo").whenSuccess(
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
          Cairo.LoadingMessage.show("Grupos de Cuentas", "Loading Grupos de Cuentas from CrowSoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ cuentaGrupoTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.GRUPO_DE_CUENTA,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.cuentaGrupoTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("Grupos de Cuentas", "cuentaGrupoTreeRegion", "#general/cuentagrupos", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());