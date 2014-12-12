(function() {
  "use strict";

  Cairo.module("ProductoHelpConfig.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      // cProductoHelpConfig
      // 25-01-01

      var C_MODULE = "cProductoHelpConfig";

      var K_TECLA = 1;
      var K_ATRIBUTO_INDICE = 2;
      var K_VALOR_CODIGO = 3;
      var K_ACTIVE = 4;
      var K_DESCRIP = 5;
      var K_NAME = 6;
      var K_DEFAULT = 7;
      var K_DEFAULT_SRV = 8;
      var K_DEFAULT_PRP = 9;
      var K_DEFAULT_PRNS = 10;

      var m_id = 0;
      var m_name = "";
      var m_tecla = "";
      var m_atributo_indice = 0;
      var m_valor_codigo = "";
      var m_active = 0;
      var m_descrip = "";
      var m_default = 0;
      var m_defaultSrv = 0;
      var m_defaultPrp = 0;
      var m_defaultPrns = 0;

      var m_editing;

      var m_dialog;
      var m_listController = null;

      var m_isNew;

      var m_branchId = 0;
      var m_treeId = 0;

      var m_copy;

      self.copy = function() {

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, Cairo.Constants.NO_ID);

        var property = m_dialog.getProperties().item(Cairo.General.Constants.PRHC_TECLA);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(Cairo.General.Constants.PRHC_TECLA));

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

          doc.setClientTable(Cairo.General.Constants.PRODUCTOHELPCONFIG);
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

            Cairo.Documentation.show("", "", csGeneralPrestacion.Cairo.Security.Actions.General.NEW_PRODUCTOHELPCONFIG);
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
        //
      };

      self.save = function() {

        var register = new Cairo.Database.Register();
        var fields = register.getFields();

        register.setFieldId(Cairo.General.Constants.PRHC_ID);
        register.setTable(Cairo.General.Constants.PRODUCTOHELPCONFIG);

        var apiPath = Cairo.Database.getAPIVersion();
        register.setPath(apiPath + "general/productohelpconfig");

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
              fields.add(Cairo.General.Constants.PRHC_NAME, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_TECLA:
              fields.add(Cairo.General.Constants.PRHC_TECLA, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_ATRIBUTO_INDICE:
              fields.add(Cairo.General.Constants.PRHC_ATRIBUTO_INDICE, property.getValue(), Cairo.Constants.Types.integer);
              break;

            case K_VALOR_CODIGO:
              fields.add(Cairo.General.Constants.PRHC_VALOR_CODE, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.boolean);
              break;

            case K_DESCRIP:
              fields.add(Cairo.General.Constants.PRHC_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_DEFAULT:
              fields.add(Cairo.General.Constants.PRHC_DEFAULT, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.boolean);
              break;

            case K_DEFAULT_SRV:
              fields.add(Cairo.General.Constants.PRHC_DEFAULT_SRV, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.boolean);
              break;

            case K_DEFAULT_PRP:
              fields.add(Cairo.General.Constants.PRHC_DEFAULT_PRP, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.boolean);
              break;

            case K_DEFAULT_PRNS:
              fields.add(Cairo.General.Constants.PRHC_DEFAULT_PRNS, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.boolean);
              break;
          }
        }

        if(!Cairo.Database.save(register, , C_ABMClientSave, C_MODULE, Cairo.Language.getText(3911, ""))) { return false; }

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
        return "#general/productohelpconfig/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "productohelpconfig" + id;
      };

  self.getTitle = function() {
    //'Configuraci�n del Help de Articulos
    return Cairo.Language.getText(3912, "");
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

        case K_TECLA:
          if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.text)) {
            //' Debe indicar una tecla
            cWindow.msgInfo(Cairo.Language.getText(3905, ""));
          }
          break;

        case K_VALOR_CODIGO:
          if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.text)) {
            //' Debe indicar un valor para el c�digo
            cWindow.msgInfo(Cairo.Language.getText(3906, ""));
          }
          break;

        case K_ATRIBUTO_INDICE:
          if(Cairo.Util.val(property.getValue()) <= 0 || Cairo.Util.val(property.getValue()) > 10) {
            //' Debe indicar el indice del atributo
            cWindow.msgInfo(Cairo.Language.getText(3907, ""));
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
    return Cairo.Security.hasPermissionTo(csGeneralPrestacion.Cairo.Security.Actions.General.LIST_PRODUCTOHELPCONFIG);
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
        if(!Cairo.Security.hasPermissionTo(csGeneralPrestacion.Cairo.Security.Actions.General.NEW_PRODUCTOHELPCONFIG)) { return p; }
      } 
      else {
        m_isNew = false;
        if(!Cairo.Security.hasPermissionTo(csGeneralPrestacion.Cairo.Security.Actions.General.EDIT_PRODUCTOHELPCONFIG)) { return p; }
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

    var abmObj = null;
    abmObj = m_dialog;
    abmObj.setMinHeight(6400);

    var properties = m_dialog.getProperties();
    properties.clear();

    var elem = properties.add(null, Cairo.General.Constants.PRHC_NAME);
    elem.setType(Dialogs.PropertyType.text);
    elem.setName(Cairo.Constants.NAME_LABEL);
    elem.setKey(K_NAME);
    elem.setValue(m_name);
    elem.setWidth(7000);

    var elem = properties.add(null, Cairo.General.Constants.PRHC_TECLA);
    elem.setType(Dialogs.PropertyType.text);
    //' Tecla
    elem.setName(Cairo.Language.getText(3904, ""));
    elem.setKey(K_TECLA);
    elem.setValue(m_tecla);

    var elem = properties.add(null, Cairo.General.Constants.PRHC_VALOR_CODE);
    elem.setType(Dialogs.PropertyType.text);
    //' Valor C�digo
    elem.setName(Cairo.Language.getText(3909, ""));
    elem.setKey(K_VALOR_CODIGO);
    elem.setValue(m_valor_codigo);

    var elem = properties.add(null, Cairo.General.Constants.PRHC_ATRIBUTO_INDICE);
    elem.setType(Dialogs.PropertyType.numeric);
    elem.setSubType(Dialogs.PropertySubType.Integer);
    //' Indice del Atributo
    elem.setName(Cairo.Language.getText(3908, ""));
    elem.setValue(m_atributo_indice);
    elem.setKey(K_ATRIBUTO_INDICE);
    elem.setWidth(800);

    var elem = properties.add(null, Cairo.Constants.ACTIVE);
    elem.setType(Dialogs.PropertyType.check);
    elem.setName(Cairo.Constants.ACTIVE_LABEL);
    elem.setKey(K_ACTIVE);
    elem.setValue(m_active);

    var elem = properties.add(null, Cairo.General.Constants.PRHC_DEFAULT);
    elem.setType(Dialogs.PropertyType.check);
    //' Default Ventas
    elem.setName(Cairo.Language.getText(3919, ""));
    elem.setKey(K_DEFAULT);
    elem.setValue(m_default);
    elem.setLeftNotChange(true);
    elem.setLeft(2150);
    elem.setLeftLabel(-1800);

    var elem = properties.add(null, Cairo.General.Constants.PRHC_DEFAULT_SRV);
    elem.setType(Dialogs.PropertyType.check);
    //' Default Servicios
    elem.setName(Cairo.Language.getText(3920, ""));
    elem.setKey(K_DEFAULT_SRV);
    elem.setValue(m_defaultSrv);
    elem.setLeftNotChange(true);
    elem.setLeft(4700);
    elem.setLeftLabel(-1880);
    elem.setTopFromProperty(Cairo.General.Constants.PRHC_DEFAULT);

    var elem = properties.add(null, Cairo.General.Constants.PRHC_DEFAULT_PRP);
    elem.setType(Dialogs.PropertyType.check);
    //' Default Parte de Reparaci�n
    elem.setName(Cairo.Language.getText(3964, ""));
    elem.setKey(K_DEFAULT_PRP);
    elem.setValue(m_defaultPrp);
    elem.setLeftNotChange(true);
    elem.setLeft(8000);
    elem.setLeftLabel(-2180);
    elem.setTopFromProperty(Cairo.General.Constants.PRHC_DEFAULT);

    var elem = properties.add(null, Cairo.General.Constants.PRHC_DEFAULT_PRNS);
    elem.setType(Dialogs.PropertyType.check);
    //' Default en Equipos
    elem.setName(Cairo.Language.getText(3965, ""));
    elem.setKey(K_DEFAULT_PRNS);
    elem.setValue(m_defaultPrns);
    elem.setLeftNotChange(true);
    elem.setLeft(2150);
    elem.setLeftLabel(-1800);

    var elem = properties.add(null, Cairo.General.Constants.PRHC_DESCRIP);
    elem.setType(Dialogs.PropertyType.text);
    elem.setSubType(Dialogs.PropertySubType.memo);
    elem.setWidth(7000);
    elem.setHeight(880);
    elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
    elem.setKey(K_DESCRIP);
    elem.setValue(m_descrip);

    if(!m_dialog.show(self)) { return false; }

    return true;
  };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

    var elem = properties.item(Cairo.General.Constants.PRHC_NAME);
    elem.setValue(m_name);

    var elem = properties.item(Cairo.General.Constants.PRHC_TECLA);
    elem.setValue(m_tecla);

    var elem = properties.item(Cairo.General.Constants.PRHC_VALOR_CODE);
    elem.setValue(m_valor_codigo);

    var elem = properties.item(Cairo.General.Constants.PRHC_ATRIBUTO_INDICE);
    elem.setValue(m_atributo_indice);

    var elem = properties.item(Cairo.Constants.ACTIVE);
    elem.setValue(m_active);

    var elem = properties.item(Cairo.General.Constants.PRHC_DEFAULT);
    elem.setValue(m_default);

    var elem = properties.item(Cairo.General.Constants.PRHC_DEFAULT_SRV);
    elem.setValue(m_defaultSrv);

    var elem = properties.item(Cairo.General.Constants.PRHC_DEFAULT_PRP);
    elem.setValue(m_defaultPrp);

    var elem = properties.item(Cairo.General.Constants.PRHC_DEFAULT_PRNS);
    elem.setValue(m_defaultPrns);

    var elem = properties.item(Cairo.General.Constants.PRHC_DESCRIP);
    elem.setValue(m_descrip);

        return m_dialog.showValues(properties);
      };

  var load = function(id) {

    var apiPath = Cairo.Database.getAPIVersion();
    return Cairo.Database.getData("load[" + apiPath + "general/productohelpconfig]", id).then(
      function(response) {

        if(response.success !== true) { return false; }

        if(response.data.id === Cairo.Constants.NO_ID) {
          m_name = "";
          m_tecla = "";
          m_atributo_indice = 0;
          m_valor_codigo = "";
          m_id = Cairo.Constants.NO_ID;
          m_active = true;
          m_default = false;
          m_defaultSrv = false;
          m_defaultPrp = false;
          m_defaultPrns = false;
          m_descrip = "";
        } 
        else {
          m_tecla = Cairo.Database.valField(response.data, Cairo.General.Constants.PRHC_TECLA);
          m_name = Cairo.Database.valField(response.data, Cairo.General.Constants.PRHC_NAME);
          m_atributo_indice = Cairo.Database.valField(response.data, Cairo.General.Constants.PRHC_ATRIBUTO_INDICE);
          m_valor_codigo = Cairo.Database.valField(response.data, Cairo.General.Constants.PRHC_VALOR_CODE);
          m_id = Cairo.Database.valField(response.data, Cairo.General.Constants.PRHC_ID);
          m_active = Cairo.Database.valField(response.data, Cairo.Constants.ACTIVE);
          m_default = Cairo.Database.valField(response.data, Cairo.General.Constants.PRHC_DEFAULT);
          m_defaultSrv = Cairo.Database.valField(response.data, Cairo.General.Constants.PRHC_DEFAULT_SRV);
          m_defaultPrp = Cairo.Database.valField(response.data, Cairo.General.Constants.PRHC_DEFAULT_PRP);
          m_defaultPrns = Cairo.Database.valField(response.data, Cairo.General.Constants.PRHC_DEFAULT_PRNS);
          m_descrip = Cairo.Database.valField(response.data, Cairo.General.Constants.PRHC_DESCRIP);
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

  Cairo.module("ProductoHelpConfig.List", function(List, Cairo, Backbone, Marionette, $, _) {
    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.productohelpconfigEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.productohelpconfigEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "ProductoHelpConfigs",
            entityName: "productohelpconfig",
            entitiesName: "productohelpconfigs"
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
              var editor = Cairo.ProductoHelpConfig.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_PRODUCTOHELPCONFIG)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            var apiPath = Cairo.Database.getAPIVersion();
            return Cairo.Database.destroy(apiPath + "general/productohelpconfig", id, Cairo.Constants.DELETE_FUNCTION, "ProductoHelpConfig").success(
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
          Cairo.LoadingMessage.show("ProductoHelpConfigs", "Loading productohelpconfig from Crowsoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ productohelpconfigTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.PRODUCTOHELPCONFIG,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.productohelpconfigTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("ProductoHelpConfigs", "productohelpconfigTreeRegion", "#general/productohelpconfigs", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());