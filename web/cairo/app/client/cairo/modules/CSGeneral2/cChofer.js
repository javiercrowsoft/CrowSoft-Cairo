(function() {
  "use strict";

  Cairo.module("Chofer.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      var C_MODULE = "cChofer";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_DESCRIP = 3;
      var K_TIPODNI = 4;
      var K_DNI = 5;
      var K_FECHADENACIMIENTO = 6;
      var K_DIRECCION = 7;
      var K_TELEFONO = 8;
      var K_TRANS_ID = 9;
      var K_ACTIVE = 10;
      var K_CAM_ID = 11;

      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_descrip = "";
      var m_tipodni;
      var m_dni = 0;
      var m_fechaNacimiento = null;
      var m_direccion = "";
      var m_telefono = "";
      var m_active;
      var m_trans_id = 0;
      var m_transporte = "";
      var m_cam_id = 0;
      var m_camion = "";
      //OJO HASTA ACA

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

        var property = m_dialog.getProperties().item(Cairo.General.Constants.CHOF_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.CHOF_CODE));
        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.CHOF_NAME));

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

          doc.setClientTable(Cairo.General.Constants.CHOFER);
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

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_CHOFER);
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

        register.setFieldId(Cairo.General.Constants.CHOF_ID);
        register.setTable(Cairo.General.Constants.CHOFER);

        var apiPath = Cairo.Database.getAPIVersion();
        register.setPath(apiPath + "general/chofer");

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
              fields.add(Cairo.General.Constants.CHOF_NAME, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODE:
              fields.add(Cairo.General.Constants.CHOF_CODE, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_DESCRIP:
              fields.add(Cairo.General.Constants.CHOF_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_TIPODNI:
              fields.add(Cairo.General.Constants.CHOF_TIPODNI, property.getListItemData(), Cairo.Constants.Types.text);
              break;

            case K_DNI:
              fields.add(Cairo.General.Constants.CHOF_DNI, property.getValue(), Cairo.Constants.Types.long);
              break;

            case K_FECHADENACIMIENTO:
              fields.add(Cairo.General.Constants.CHOF_FECHA_NACIMIENTO, property.getValue(), Cairo.Constants.Types.date);
              break;

            case K_DIRECCION:
              fields.add(Cairo.General.Constants.CHOF_DIRECCION, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_TELEFONO:
              fields.add(Cairo.General.Constants.CHOF_TELEFONO, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_TRANS_ID:
              fields.add(Cairo.General.Constants.TRANS_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_CAM_ID:
              fields.add(Cairo.General.Constants.CAM_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;
          }
        }

        return Cairo.Database.saveEx(
            register,
            false,
            Cairo.General.Constants.CHOF_CODE,
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            Cairo.Language.getText(1060, "")).then(

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
        return "#general/chofer/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "chofer" + id;
      };

      self.getTitle = function() {
        // Choferes
        return Cairo.Language.getText(1061, "");
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
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_CHOFER);
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_CHOFER)) { return p; }
          }
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_CHOFER)) { return p; }
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
        var c = null;

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, Cairo.General.Constants.CHOF_NAME);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(50);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        var elem = properties.add(null, Cairo.General.Constants.CHOF_CODE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setSize(50);
        elem.setKey(K_CODE);
        elem.setValue(m_code);

        var elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        var elem = properties.add(null, Cairo.General.Constants.TRANS_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TRANSPORTE);
        // Transporte
        elem.setName(Cairo.Language.getText(1050, ""));
        elem.setKey(K_TRANS_ID);
        elem.setValue(m_transporte);
        elem.setSelectId(m_trans_id);

        var elem = properties.add(null, Cairo.General.Constants.CAM_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CAMION);
        // Camion
        elem.setName(Cairo.Language.getText(3489, ""));
        elem.setKey(K_CAM_ID);
        elem.setValue(m_camion);
        elem.setSelectId(m_cam_id);

        var elem = properties.add(null, Cairo.General.Constants.CHOF_DIRECCION);
        elem.setType(Dialogs.PropertyType.text);
        // Direcci�n
        elem.setName(Cairo.Language.getText(1037, ""));
        elem.setSize(255);
        elem.setKey(K_DIRECCION);
        elem.setValue(m_direccion);

        c = properties.add(null, Cairo.General.Constants.CHOF_TIPODNI);
        c.setType(Dialogs.PropertyType.list);
        // Tipo Doc.
        c.setName(Cairo.Language.getText(1063, ""));
        c.setSize(10);
        c.setKey(K_TIPODNI);
        pLoadTipoDoc(c);
        c.setListItemData(m_tipodni);
        c.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);

        var elem = properties.add(null, Cairo.General.Constants.CHOF_DNI);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.Integer);
        // Numero
        elem.setName(Cairo.Language.getText(1065, ""));
        elem.setKey(K_DNI);
        elem.setValue(m_dni);

        var elem = properties.add(null, Cairo.General.Constants.CHOF_FECHA_NACIMIENTO);
        elem.setType(Dialogs.PropertyType.date);
        // Fecha de Nacimiento
        elem.setName(Cairo.Language.getText(1064, ""));
        elem.setKey(K_FECHADENACIMIENTO);
        elem.setValue(m_fechaNacimiento);

        var elem = properties.add(null, Cairo.General.Constants.CHOF_TELEFONO);
        elem.setType(Dialogs.PropertyType.text);
        // Tel�fono
        elem.setName(Cairo.Language.getText(1036, ""));
        elem.setSize(50);
        elem.setKey(K_TELEFONO);
        elem.setValue(m_telefono);

        var elem = properties.add(null, Cairo.General.Constants.CHOF_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setSize(255);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);

        if(!m_dialog.show(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(Cairo.General.Constants.CHOF_NAME);
        elem.setValue(m_name);

        var elem = properties.item(Cairo.General.Constants.CHOF_CODE);
        elem.setValue(m_code);

        var elem = properties.item(Cairo.Constants.ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        var elem = properties.item(Cairo.General.Constants.TRANS_ID);
        elem.setValue(m_transporte);
        elem.setSelectId(m_trans_id);

        var elem = properties.item(Cairo.General.Constants.CAM_ID);
        elem.setValue(m_camion);
        elem.setSelectId(m_cam_id);

        var elem = properties.item(Cairo.General.Constants.CHOF_DIRECCION);
        elem.setValue(m_direccion);

        var elem = properties.item(Cairo.General.Constants.CHOF_DNI);
        elem.setValue(m_dni);

        var elem = properties.item(Cairo.General.Constants.CHOF_FECHA_NACIMIENTO);
        elem.setValue(m_fechaNacimiento);

        var elem = properties.item(Cairo.General.Constants.CHOF_TELEFONO);
        elem.setValue(m_telefono);

        var elem = properties.item(Cairo.General.Constants.CHOF_DESCRIP);
        elem.setValue(m_descrip);

        return m_dialog.showValues(properties);
      };

      var setGridTipoDoc = function(property) {
        var elem = c.getList().add(null);
        elem.setID(csChofTipoDoc.cSCHOFTDCI);
        // C.I.
        elem.setValue(Cairo.Language.getText(1066, ""));
        var elem = c.getList().add(null);
        elem.setID(csChofTipoDoc.cSCHOFTDDNI);
        // D.N.I.
        elem.setValue(Cairo.Language.getText(1067, ""));
        var elem = c.getList().add(null);
        elem.setID(csChofTipoDoc.cSCHOFTDLC);
        // L.C.
        elem.setValue(Cairo.Language.getText(1068, ""));
        var elem = c.getList().add(null);
        elem.setID(csChofTipoDoc.cSCHOFTDLE);
        // L.E.
        elem.setValue(Cairo.Language.getText(1069, ""));
        var elem = c.getList().add(null);
        elem.setID(csChofTipoDoc.cSCHOFTDOTRO);
        // Otros
        elem.setValue(Cairo.Language.getText(1070, ""));
        var elem = c.getList().add(null);
        elem.setID(csChofTipoDoc.cSCHOFTDPASS);
        // Pasaporte
        elem.setValue(Cairo.Language.getText(1071, ""));
      };

      var load = function(id) {

        var apiPath = Cairo.Database.getAPIVersion();
        return Cairo.Database.getData("load[" + apiPath + "general/chofer]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== Cairo.Constants.NO_ID) {

              m_id = Cairo.Database.valField(response.data, Cairo.General.Constants.CHOF_ID);
              m_name = Cairo.Database.valField(response.data, Cairo.General.Constants.CHOF_NAME);
              m_code = Cairo.Database.valField(response.data, Cairo.General.Constants.CHOF_CODE);
              m_descrip = Cairo.Database.valField(response.data, Cairo.General.Constants.CHOF_DESCRIP);
              m_tipodni = Cairo.Database.valField(response.data, Cairo.General.Constants.CHOF_TIPODNI);
              m_dni = Cairo.Database.valField(response.data, Cairo.General.Constants.CHOF_DNI);
              m_fechaNacimiento = Cairo.Database.getDateValue(response.data, Cairo.General.Constants.CHOF_FECHA_NACIMIENTO);
              m_direccion = Cairo.Database.valField(response.data, Cairo.General.Constants.CHOF_DIRECCION);
              m_telefono = Cairo.Database.valField(response.data, Cairo.General.Constants.CHOF_TELEFONO);
              m_active = Cairo.Database.valField(response.data, Cairo.Constants.ACTIVE);
              m_trans_id = Cairo.Database.valField(response.data, Cairo.General.Constants.TRANS_ID);
              m_transporte = Cairo.Database.valField(response.data, Cairo.General.Constants.TRANS_NAME);
              m_cam_id = Cairo.Database.valField(response.data, Cairo.General.Constants.CAM_ID);
              m_camion = Cairo.Database.valField(response.data, Cairo.General.Constants.CAM_PATENTE);

            }
            else {
              m_id = Cairo.Constants.NO_ID;
              m_name = "";
              m_code = "";
              m_descrip = "";
              m_tipodni = csChofTipoDoc.cSCHOFTDDNI;
              m_dni = 0;
              m_fechaNacimiento = Cairo.Constants.NO_DATE;
              m_direccion = "";
              m_telefono = "";
              m_active = true;
              m_trans_id = Cairo.Constants.NO_ID;
              m_transporte = "";
              m_cam_id = Cairo.Constants.NO_ID;
              m_camion = "";
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

  Cairo.module("Chofer.List", function(List, Cairo, Backbone, Marionette, $, _) {
    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.choferEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.choferEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Choferes",
            entityName: "chofer",
            entitiesName: "choferes"
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
              var editor = Cairo.Chofer.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_CHOFER)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            var apiPath = Cairo.Database.getAPIVersion();
            return Cairo.Database.destroy(apiPath + "general/chofer", id, Cairo.Constants.DELETE_FUNCTION, "Chofer").success(
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
          Cairo.LoadingMessage.show("Choferes", "Loading Choferes from CrowSoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ choferTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.CHOFER,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.choferTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("Choferes", "choferTreeRegion", "#general/choferes", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());