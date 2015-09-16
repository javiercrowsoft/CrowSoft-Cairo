(function() {
  "use strict";

  Cairo.module("Feriado.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;

      var C_MODULE = "cFeriado";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_DESCRIP = 3;
      var K_DIA = 4;
      var K_MES = 5;
      var K_ANIO = 6;
      var K_BANCO = 7;
      var K_LABORAL = 8;
      var K_LOCAL = 9;
      var K_PA_ID = 10;
      var K_PRO_ID = 11;
      var K_RECURRENTE = 12;

      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_descrip = "";
      var m_dia = 0;
      var m_mes = 0;
      var m_anio = 0;
      var m_banco;
      var m_laboral;
      var m_local;
      var m_pa_Id = 0;
      var m_pais = "";
      var m_pro_id = 0;
      var m_provincia = "";
      var m_recurrente;

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
        return Cairo.appName;
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
        var _rtn = null;
        try {

          if(m_id === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(C.FERIADO);
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

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_FERIADO);
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

        var properties = m_dialog.getProperties();

        switch (key) {
          case K_LOCAL:

            properties.item(C.PRO_ID).setEnabled(Cairo.Util.val(properties.item(C.FE_LOCAL).getValue()));
            properties.item(C.PA_ID).setEnabled(Cairo.Util.val(properties.item(C.FE_LOCAL).getValue()));

            break;
        }

        return true;
      };

      self.copy = function() {

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, NO_ID);

        var property = m_dialog.getProperties().item(C.FE_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(C.FE_CODE));
        m_dialog.showValue(m_dialog.getProperties().item(C.FE_NAME));

        m_copy = true;
      };

      self.editNew = function() {

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, NO_ID);

        return load(NO_ID).then(
          function() {
            return refreshCollection();
          }
        );
      };

      self.save = function() {
        var sqlstmt = null;

        var register = new Cairo.Database.Register();
        var fields = register.getFields();

        register.setFieldId(C.FE_ID);
        register.setTable(C.FERIADO);

        register.setPath(m_apiPath + "general/feriado");

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
              fields.add(C.FE_NAME, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODE:
              fields.add(C.FE_CODE, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_DESCRIP:
              fields.add(C.FE_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_DIA:
              fields.add(C.FE_DIA, property.getValue(), Cairo.Constants.Types.integer);
              break;

            case K_MES:
              fields.add(C.FE_MES, property.getValue(), Cairo.Constants.Types.integer);
              break;

            case K_ANIO:
              fields.add(C.FE_ANIO, property.getValue(), Cairo.Constants.Types.integer);
              break;

            case K_BANCO:
              fields.add(C.FE_BANCO, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_LABORAL:
              fields.add(C.FE_LABORAL, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_LOCAL:
              fields.add(C.FE_LOCAL, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_PA_ID:
              fields.add(C.PA_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_PRO_ID:
              fields.add(C.PRO_ID, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RECURRENTE:
              fields.add(C.FE_RECURRENTE, property.getValue(), Cairo.Constants.Types.boolean);
              break;
          }
        }

        register.beginTrans(Cairo.Database);
        return Cairo.Database.saveEx(
            register,
            false,
            C.FE_CODE,
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            getText(1543, "")).then(

          function(result) {
            if(result.success) {
                sqlstmt = "sp_FeriadoSave "+ register.getId().toString();
                if(!Cairo.Database.execute(sqlstmt)) { return false; }

                register.commitTrans();

                m_copy = false;
              return load(result.data.getId()).then(
                function (success) {
                  if(success) {
                    if(m_listController !== null) {
                      updateList();
                      m_listController.updateEditorKey(self, m_id);
                    }
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
        return "#general/feriado/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "feriado" + id;
      };

      self.getTitle = function() {
        // Feriados
        return getText(1544, "");
      };

      self.validate = function() {
        var dia = null;
        var mes = null;
        var anio = null;
        var property = null;

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NAME:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.text)) {
                return Cairo.Modal.showInfoWithFalse(getText(1007, ""));
                // Debe indicar un Nombre
              }
              break;

            case K_CODE:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.text)) {
                return Cairo.Modal.showInfoWithFalse(getText(1008, ""));
                // Debe indicar un C�digo"
              }
              break;

            case K_DIA:
              dia = Cairo.Util.val(property.getValue());
              if(dia < 1 || dia > 31) {
                return Cairo.Modal.showInfoWithFalse(getText(1545, ""));
                // Debe indicar un d�a entre 1 y 31
              }
              break;

            case K_MES:
              mes = Cairo.Util.val(property.getValue());
              if(mes < 1 || mes > 12) {
                return Cairo.Modal.showInfoWithFalse(getText(1546, ""));
                // Debe indicar un mes entre 1 y 12
              } 
              else {
                switch (mes) {
                  case 4:
                  case 6:
                  case 9:
                  case 11:
                    if(dia > 30) {
                      return Cairo.Modal.showInfoWithFalse(getText(1547, ""));
                      // Debe indicar un d�a entre 1 y 30
                    }
                    break;

                  case 2:
                    if(dia > 29) {
                      return Cairo.Modal.showInfoWithFalse(getText(1548, ""));
                      // Debe indicar un d�a entre 1 y 29
                    }
                    break;
                }
              }
              break;

            case K_ANIO:
              anio = Cairo.Util.val(property.getValue());
              if(anio !== 0) {
                if(mes === 2 && dia > 28) {
                  if(isDate(Format$(dia, "00")+ "-"+ Format$(mes, "00")+ "-"+ Format$(anio, "0000"))) {
                    return Cairo.Modal.showInfoWithFalse(getText(1549, ""));
                    //La fecha no es v�lida
                  }
                }
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
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_FERIADO);
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_FERIADO)) { return p; }
          } 
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_FERIADO)) { return p; }
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

        var elem = properties.add(null, C.FE_NAME);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(100);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        var elem = properties.add(null, C.FE_CODE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setSize(15);
        elem.setKey(K_CODE);
        elem.setValue(m_code);

        var elem = properties.add(null, C.FE_DIA);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.Integer);
        // D�a
        elem.setName(getText(1214, ""));
        elem.setKey(K_DIA);
        elem.setValue(m_dia);

        var elem = properties.add(null, C.FE_MES);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.Integer);
        // Mes
        elem.setName(getText(1215, ""));
        elem.setKey(K_MES);
        elem.setValue(m_mes);

        var elem = properties.add(null, C.FE_ANIO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.Integer);
        // A�o
        elem.setName(getText(1216, ""));
        elem.setKey(K_ANIO);
        elem.setValue(m_anio);

        var elem = properties.add(null, C.FE_RECURRENTE);
        elem.setType(Dialogs.PropertyType.check);
        // Recurrente
        elem.setName(getText(1217, ""));
        elem.setKey(K_RECURRENTE);
        elem.setValue(Cairo.Util.boolToInt(m_recurrente));

        var elem = properties.add(null, C.FE_BANCO);
        elem.setType(Dialogs.PropertyType.check);
        // Feriado Bancario
        elem.setName(getText(1218, ""));
        elem.setKey(K_BANCO);
        elem.setValue(Cairo.Util.boolToInt(m_banco));

        var elem = properties.add(null, C.FE_LABORAL);
        elem.setType(Dialogs.PropertyType.check);
        // Feriado Laboral
        elem.setName(getText(1219, ""));
        elem.setKey(K_LABORAL);
        elem.setValue(Cairo.Util.boolToInt(m_laboral));

        var elem = properties.add(null, C.FE_LOCAL);
        elem.setType(Dialogs.PropertyType.check);
        // Feriado Local
        elem.setName(getText(1213, ""));
        elem.setKey(K_LOCAL);
        elem.setValue(Cairo.Util.boolToInt(m_local));

        var elem = properties.add(null, C.PA_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PAIS);
        // Pa�s
        elem.setName(getText(1212, ""));
        elem.setKey(K_PA_ID);
        elem.setValue(m_pais);
        elem.setSelectId(m_pa_Id);
        elem.setEnabled(Cairo.Util.boolToInt(m_local));

        var elem = properties.add(null, C.PRO_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROVINCIA);
        // Provincia
        elem.setName(getText(1080, ""));
        elem.setKey(K_PRO_ID);
        elem.setValue(m_provincia);
        elem.setSelectId(m_pro_id);
        elem.setEnabled(Cairo.Util.boolToInt(m_local));

        var elem = properties.add(null, C.FE_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        // Observ.
        elem.setName(getText(1211, ""));
        elem.setSize(255);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);
        elem.setSubType(Dialogs.PropertySubType.memo);

        if(!m_dialog.show(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(C.FE_NAME);
        elem.setValue(m_name);

        var elem = properties.item(C.FE_CODE);
        elem.setValue(m_code);

        var elem = properties.item(C.FE_DIA);
        elem.setValue(m_dia);

        var elem = properties.item(C.FE_MES);
        elem.setValue(m_mes);

        var elem = properties.item(C.FE_ANIO);
        elem.setValue(m_anio);

        var elem = properties.item(C.FE_RECURRENTE);
        elem.setValue(Cairo.Util.boolToInt(m_recurrente));

        var elem = properties.item(C.FE_BANCO);
        elem.setValue(Cairo.Util.boolToInt(m_banco));

        var elem = properties.item(C.FE_LABORAL);
        elem.setValue(Cairo.Util.boolToInt(m_laboral));

        var elem = properties.item(C.FE_LOCAL);
        elem.setValue(Cairo.Util.boolToInt(m_local));

        var elem = properties.item(C.PA_ID);
        elem.setValue(m_pais);
        elem.setSelectId(m_pa_Id);

        var elem = properties.item(C.PRO_ID);
        elem.setValue(m_provincia);
        elem.setSelectId(m_pro_id);

        var elem = properties.item(C.FE_DESCRIP);
        elem.setValue(m_descrip);

        return m_dialog.showValues(properties);
      };

      var load = function(id) {

        return DB.getData("load[" + m_apiPath + "general/feriado]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== NO_ID) {

              m_id = Cairo.Database.valField(response.data, C.FE_ID);
              m_name = Cairo.Database.valField(response.data, C.FE_NAME);
              m_code = Cairo.Database.valField(response.data, C.FE_CODE);
              m_descrip = Cairo.Database.valField(response.data, C.FE_DESCRIP);
              m_dia = Cairo.Database.valField(response.data, C.FE_DIA);
              m_mes = Cairo.Database.valField(response.data, C.FE_MES);
              m_anio = Cairo.Database.valField(response.data, C.FE_ANIO);
              m_banco = Cairo.Database.valField(response.data, C.FE_BANCO);
              m_laboral = Cairo.Database.valField(response.data, C.FE_LABORAL);
              m_local = Cairo.Database.valField(response.data, C.FE_LOCAL);
              m_pa_Id = Cairo.Database.valField(response.data, C.PA_ID);
              m_pais = Cairo.Database.valField(response.data, C.PA_NAME);
              m_pro_id = Cairo.Database.valField(response.data, C.PRO_ID);
              m_provincia = Cairo.Database.valField(response.data, C.PRO_NAME);
              m_recurrente = Cairo.Database.valField(response.data, C.FE_RECURRENTE);

            } 
            else {

              m_id = NO_ID;
              m_name = "";
              m_code = "";
              m_descrip = "";
              m_dia = 1;
              m_mes = 1;
              m_anio = Year(Date);
              m_banco = true;
              m_laboral = true;
              m_local = false;
              m_pa_Id = NO_ID;
              m_pais = "";
              m_pro_id = NO_ID;
              m_provincia = "";
              m_recurrente = true;

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

    Edit.Controller.edit = function(id) {
      var editor = Cairo.Feriado.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit(id);
    };

  });

  Cairo.module("Feriado.List", function(List, Cairo, Backbone, Marionette, $, _) {

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

          var editors = Cairo.Editors.feriadoEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.feriadoEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Feriados",
            entityName: "feriado",
            entitiesName: "feriados"
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
              var editor = Cairo.Feriado.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_FERIADO)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            return Cairo.Database.destroy(m_apiPath + "general/feriado", id, Cairo.Constants.DELETE_FUNCTION, "Feriado").success(
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
          Cairo.LoadingMessage.show("Feriados", "Loading Feriados from CrowSoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ feriadoTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.FERIADO,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.feriadoTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("Feriados", "feriadoTreeRegion", "#general/feriados", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());