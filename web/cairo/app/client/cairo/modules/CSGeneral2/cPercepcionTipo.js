(function() {
  "use strict";

  Cairo.module("PercepcionTipo.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      // cPercepcionTipo
      // 27-06-04

      var C_MODULE = "cPercepcionTipo";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_DESCRIP = 3;
      var K_GENERASICORE = 4;
      var K_CODIGOSICORE = 5;
      var K_CUE_ID = 6;
      var K_ACTIVE = 7;

      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_descrip = "";
      var m_generaSicore;
      var m_codigoSicore = "";
      var m_cue_id = 0;
      var m_cuenta = "";
      var m_active;

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

          doc.setClientTable(Cairo.General.Constants.PERCEPCIONTIPO);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, Cairo.Constants.SHOW_DOCUMENTS_FUNCTION, C_MODULE, "");
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

      self.messageEx = function(messageID,  info) {
        var _rtn = null;
        switch (messageID) {

          case Dialogs.Message.MSG_DOC_INFO:

            Cairo.Documentation.show("", "", csGeneralPrestacion.Cairo.Security.Actions.General.NEW_PERCEPCIONTIPO);
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

        m_listController.updateEditorKey(self, Cairo.Constants.NO_ID);

        var property = m_dialog.getProperties().item(Cairo.General.Constants.PERCT_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.PERCT_CODE));
        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.PERCT_NAME));

        m_copy = true;
      };

      self.propertyChange = function(key) {

        return Cairo.Promises.resolvedPromise(false);
      };

      self.save = function() {

        var register = new Cairo.Database.Register();
        var fields = register.getFields();

        register.setFieldId(Cairo.General.Constants.PERCT_ID);
        register.setTable(Cairo.General.Constants.PERCEPCIONTIPO);

        var apiPath = Cairo.Database.getAPIVersion();
        register.setPath(apiPath + "general/percepciontipo");

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
              fields.add(Cairo.General.Constants.PERCT_NAME, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODE:
              fields.add(Cairo.General.Constants.PERCT_CODE, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_DESCRIP:
              fields.add(Cairo.General.Constants.PERCT_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_GENERASICORE:
              fields.add(Cairo.General.Constants.PERCT_GENERA_SICORE, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_CODIGOSICORE:
              fields.add(Cairo.General.Constants.PERCT_CODIGO_SICORE, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CUE_ID:
              fields.add(Cairo.General.Constants.CUE_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, property.getValue(), Cairo.Constants.Types.boolean);
              break;
          }
        }

        return Cairo.Database.saveEx(
            register,
            false,
            Cairo.General.Constants.PERCT_CODE, 
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            Cairo.Language.getText(1268, "")).then(

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
        return "#general/percepciontipo/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "percepciontipo" + id;
      };

      self.getTitle = function() {
        //Tipos de Percepci�n
        return Cairo.Language.getText(1262, "");
      };

      self.validate = function() {

        var property = null;
        var bHaveSicore = null;
        var bCodigoSicore = null;

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

            case K_GENERASICORE:
              if(!Cairo.Util.valEmpty(Cairo.Util.val(property.getValue()), Cairo.Constants.Types.integer)) {
                bCodigoSicore = true;
              }
              break;

            case K_CODIGOSICORE:
              if(!Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.text)) {
                bHaveSicore = true;
              }
              break;

            case K_CUE_ID:
              if(Cairo.Util.valEmpty(property.getSelectId(), Cairo.Constants.Types.id)) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1261, "")).then(function() {return false;});
                //Debe indicar una cuenta
              }

              break;
          }
        }

        if(bCodigoSicore && !bHaveSicore) {
          return Cairo.Modal.showInfo(Cairo.Language.getText(1263, "")).then(function() {return false;});
          //Debe indicar un c�digo sicore
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
        return Cairo.Security.hasPermissionTo(csGeneralPrestacion.Cairo.Security.Actions.General.LIST_PERCEPCIONTIPO);
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
            if(!Cairo.Security.hasPermissionTo(csGeneralPrestacion.Cairo.Security.Actions.General.NEW_PERCEPCIONTIPO)) { return p; }
          } 
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(csGeneralPrestacion.Cairo.Security.Actions.General.EDIT_PERCEPCIONTIPO)) { return p; }
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

        var elem = properties.add(null, Cairo.General.Constants.PERCT_NAME);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(100);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        var elem = properties.add(null, Cairo.General.Constants.PERCT_CODE);
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

        var elem = properties.add(null, Cairo.General.Constants.PERCT_GENERA_SICORE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setTopFromProperty(Cairo.Constants.ACTIVE);
        elem.setLeft(3500);
        //'Genera Sicore
        elem.setName(Cairo.Language.getText(1266, ""));
        elem.setKey(K_GENERASICORE);
        elem.setValue(Cairo.Util.boolToInt(m_generaSicore));

        var elem = properties.add(null, Cairo.General.Constants.PERCT_CODIGO_SICORE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setTopFromProperty(Cairo.General.Constants.PERCT_NAME);
        elem.setLeft(5500);
        //'C�digo Sicore
        elem.setName(Cairo.Language.getText(1265, ""));
        elem.setSize(50);
        elem.setKey(K_CODIGOSICORE);
        elem.setValue(m_codigoSicore);

        var elem = properties.add(null, Cairo.General.Constants.CUE_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        //'Cuenta
        elem.setName(Cairo.Language.getText(1267, ""));
        elem.setKey(K_CUE_ID);
        elem.setValue(m_cuenta);
        elem.setSelectId(m_cue_id);

        var elem = properties.add(null, Cairo.General.Constants.PERCT_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setLeftFromProperty(Cairo.General.Constants.PERCT_CODE);
        elem.setTopFromProperty(Cairo.Constants.ACTIVE);
        elem.setTopToPrevious(440);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setSize(255);
        elem.setWidth(6250);
        elem.setHeight(880);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);

        if(!m_dialog.show(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(Cairo.General.Constants.PERCT_NAME);
        elem.setValue(m_name);

        var elem = properties.item(Cairo.General.Constants.PERCT_CODE);
        elem.setValue(m_code);

        var elem = properties.item(Cairo.Constants.ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        var elem = properties.item(Cairo.General.Constants.PERCT_GENERA_SICORE);
        elem.setValue(Cairo.Util.boolToInt(m_generaSicore));

        var elem = properties.item(Cairo.General.Constants.PERCT_CODIGO_SICORE);
        elem.setValue(m_codigoSicore);

        var elem = properties.item(Cairo.General.Constants.CUE_ID);
        elem.setValue(m_cuenta);
        elem.setSelectId(m_cue_id);

        var elem = properties.item(Cairo.General.Constants.PERCT_DESCRIP);
        elem.setValue(m_descrip);

        return m_dialog.showValues(properties);
      };

      var load = function(id) {

        var apiPath = Cairo.Database.getAPIVersion();
        return Cairo.Database.getData("load[" + apiPath + "general/percepciontipo]", id).then(
          function(response) {

            if(!rs.isEOF()) {

              m_id = Cairo.Database.valField(response.data, Cairo.General.Constants.PERCT_ID);
              m_name = Cairo.Database.valField(response.data, Cairo.General.Constants.PERCT_NAME);
              m_code = Cairo.Database.valField(response.data, Cairo.General.Constants.PERCT_CODE);
              m_descrip = Cairo.Database.valField(response.data, Cairo.General.Constants.PERCT_DESCRIP);
              m_generaSicore = Cairo.Database.valField(response.data, Cairo.General.Constants.PERCT_GENERA_SICORE);
              m_codigoSicore = Cairo.Database.valField(response.data, Cairo.General.Constants.PERCT_CODIGO_SICORE);
              m_cue_id = Cairo.Database.valField(response.data, Cairo.General.Constants.CUE_ID);
              m_cuenta = Cairo.Database.valField(response.data, Cairo.General.Constants.CUE_NAME);
              m_active = Cairo.Database.valField(response.data, Cairo.Constants.ACTIVE);

            } 
            else {
              m_id = Cairo.Constants.NO_ID;
              m_name = "";
              m_code = "";
              m_descrip = "";
              m_generaSicore = false;
              m_codigoSicore = "";
              m_cue_id = Cairo.Constants.NO_ID;
              m_cuenta = "";
              m_active = true;

            }

          return true;
        });
      };

      self.destroy = function() {
        m_dialog = null;
        m_listController = null;
      };

      ////////////////////////////////
      //  Codigo estandar de errores
      //  On Error GoTo ControlError
      //
      //  GoTo ExitProc
      //ControlError:
      //  MngError err,"", C_Module, ""
      //  If Err.Number Then Resume ExitProc
      //ExitProc:
      //  On Error Resume Next

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("PercepcionTipo.List", function(List, Cairo, Backbone, Marionette, $, _) {
    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.percepciontipoEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.percepciontipoEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "PercepcionTipos",
            entityName: "percepciontipo",
            entitiesName: "percepciontipos"
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
              var editor = Cairo.PercepcionTipo.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_PERCEPCIONTIPO)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            var apiPath = Cairo.Database.getAPIVersion();
            return Cairo.Database.destroy(apiPath + "general/percepciontipo", id, Cairo.Constants.DELETE_FUNCTION, "PercepcionTipo").success(
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
          Cairo.LoadingMessage.show("PercepcionTipos", "Loading percepciontipo from Crowsoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ percepciontipoTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.PERCEPCIONTIPO,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.percepciontipoTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("PercepcionTipos", "percepciontipoTreeRegion", "#general/percepciontipos", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());