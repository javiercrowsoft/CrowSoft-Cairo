import java.util.Date;

(function() {
  "use strict";

  Cairo.module("EmpresaDelete.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      // cEmpresaDelete
      // 23-07-04

      var C_MODULE = "cEmpresaDelete";

      var C_FDESDE = "Desde";
      var C_FHASTA = "Hasta";
      var C_TODO = "Todo";
      var C_SOLODOC = "SoloDoc";

      var K_TODO = 1;
      var K_FECHA_DESDE = 2;
      var K_FECHA_HASTA = 3;
      var K_SOLO_DOC = 4;

      var m_empresa = "";
      var m_fechaDesde = null;
      var m_fechaHasta = null;
      var m_todo;
      var m_solodoc;

      var m_dialog;

      // Properties publicas
      // Properties privadas
      self.setEmpresa = function(rhs) {
        m_empresa = rhs;
      };
      self.getFechaDesde = function() {
        return m_fechaDesde;
      };
      self.getFechaHasta = function() {
        return m_fechaHasta;
      };
      self.getTodo = function() {
        return m_todo;
      };
      self.getSoloDoc = function() {
        return m_solodoc;
      };

      self.getApplication = function() {
        return Cairo.appName;
      };

      self.editDocumentsEnabled = function() {
        return false;
      };

      self.copyEnabled = function() {
        return false;
      };

      self.addEnabled = function() {
        return false;
      };

      self.messageEx = function(messageID,  info) {
        return true;
      };

      self.showDocDigital = function() {

      };

      self.editNew = function() {
        m_listController.updateEditorKey(self, Cairo.Constants.NO_ID);

        return load(Cairo.Constants.NO_ID).then(
          function(ignored) {
            return refreshCollection();
          }
        );
      };

      self.discardChanges = function() {
        return Cairo.Promises.resolvedPromise(refreshCollection());
      };

      self.copy = function() {

      };

      self.propertyChange = function(key) {

        return Cairo.Promises.resolvedPromise(false);
      };

      self.save = function() {

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          var property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_TODO:
              m_todo = Cairo.Util.val(property.getValue());
              break;

            case K_FECHA_DESDE:
              m_fechaDesde = property.getValue();
              break;

            case K_FECHA_HASTA:
              m_fechaHasta = property.getValue();
              break;

            case K_SOLO_DOC:
              m_solodoc = Cairo.Util.val(property.getValue());
              break;
          }
        }

        return true;
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
        return "#general/empresadelete/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "empresadelete" + id;
      };

      self.getTitle = function() {
        //Empresas
        return Cairo.Language.getText(1171, "");
      };

      self.validate = function() {
        return Cairo.Promises.resolvedPromise(true);
      };

      self.setTreeId = function(rhs) {

      };

      self.getTreeId = function() {

      };

      self.list = function() {

      };

      self.getDialog = function() {
        return m_dialog;
      };

      self.setDialog = function(rhs) {
        m_dialog = rhs;
      };

      self.isEditing = function() {

      };

      self.edit = function(id,  inModalWindow) {
        var p = Cairo.Promises.resolvedPromise(false);
        try {

          if(!Cairo.Security.hasPermissionTo(csGeneralPrestacion.Cairo.Security.Actions.General.DELETE_EMPRESA)) { return p; }

          m_dialog.setInModalWindow(true);
          var abmObj = null;
          abmObj = m_dialog;
          abmObj.setOkCancelDialog(true);

          if(!loadCollection()) { return false; }

          p = abmObj.getOkCancelDialogRslt();

        }
        return success;
    });
  }
  catch (ex) {
    Cairo.manageErrorEx(ex.message, "cIEditGeneric_Edit", "cEmpresaDelete", "");
}

  return p;
};

  self.setTree = function(rhs) {

  };

  self.setBranchId = function(rhs) {

  };

  self.getBranchId = function() {

  };

  var loadCollection = function() {

    m_dialog.setTitle(m_empresa);

    var properties = m_dialog.getProperties();

    properties.clear();

    var elem = properties.add(null, C_TODO);
    elem.setType(Dialogs.PropertyType.check);
    //'Todo
    elem.setName(Cairo.Language.getText(1202, ""));
    elem.setKey(K_TODO);
    elem.setValue(Cairo.Util.boolToInt(m_todo));

    var elem = properties.add(null, C_FDESDE);
    elem.setType(Dialogs.PropertyType.date);
    //'Fecha desde
    elem.setName(Cairo.Language.getText(1203, ""));
    elem.setKey(K_FECHA_DESDE);
    elem.setValue(m_fechaDesde);

    var elem = properties.add(null, C_FHASTA);
    elem.setType(Dialogs.PropertyType.date);
    //'Fecha hasta
    elem.setName(Cairo.Language.getText(1204, ""));
    elem.setKey(K_FECHA_HASTA);
    elem.setValue(m_fechaHasta);

    var elem = properties.add(null, C_SOLODOC);
    elem.setType(Dialogs.PropertyType.check);
    //'Solo Documentos
    elem.setName(Cairo.Language.getText(1205, ""));
    elem.setKey(K_SOLO_DOC);
    elem.setValue(Cairo.Util.boolToInt(m_solodoc));

    if(!m_dialog.show(self)) { return false; }

    return true;
  };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

    var elem = properties.item(C_TODO);
    elem.setValue(Cairo.Util.boolToInt(m_todo));

    var elem = properties.item(C_FDESDE);
    elem.setValue(m_fechaDesde);

    var elem = properties.item(C_FHASTA);
    elem.setValue(m_fechaHasta);

    var elem = properties.item(C_SOLODOC);
    elem.setValue(Cairo.Util.boolToInt(m_solodoc));

        return m_dialog.showValues(properties);
      };

  self.initialize = function() {
    m_solodoc = true;
  };

  self.destroy = function() {
    m_dialog = null;
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

  Cairo.module("EmpresaDelete.List", function(List, Cairo, Backbone, Marionette, $, _) {
    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.empresadeleteEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.empresadeleteEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "EmpresaDeletes",
            entityName: "empresadelete",
            entitiesName: "empresadeletes"
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
              var editor = Cairo.EmpresaDelete.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_EMPRESADELETE)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            var apiPath = Cairo.Database.getAPIVersion();
            return Cairo.Database.destroy(apiPath + "general/empresadelete", id, Cairo.Constants.DELETE_FUNCTION, "EmpresaDelete").success(
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
          Cairo.LoadingMessage.show("EmpresaDeletes", "Loading empresadelete from Crowsoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ empresadeleteTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.EMPRESADELETE,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.empresadeleteTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("EmpresaDeletes", "empresadeleteTreeRegion", "#general/empresadeletes", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());