(function() {
  "use strict";

  Cairo.module("ContConfig.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      var getText = Cairo.Language.getText;

      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;

      var C_MODULE = "cContabilidadConfigEdit";

      var K_CLAVE_FISCAL = 1;
      var K_FACTURA_ELECTRONICA = 2;
      var K_FE_PUNTO_VENTA = 3;
      var K_TA_ID_PREFACTURA = 4;

      var C_GRUPOGENERAL = "Contabilidad-General";
      var C_CLAVEFISCAL = "Clave Fiscal";
      var C_FACTURAELECTRONICA = "Factura Electronica Asincronica";
      var C_PUNTOVENTAFE = "Punto Venta FE";
      var C_TAIDPREFACTURA = "Talonario Pre-Factura - Factura Electronica";

      var m_claveFiscal = 0;
      var m_facturaElectronica;
      var m_puntoVentaFe = 0;
      var m_talonario = "";
      var m_ta_id = 0;

      var m_editing;

      var m_dialog;
      var m_listController = null;

      var m_apiPath = Cairo.Database.getAPIVersion();

      var getValue = Cairo.Database.getValue;
      var val = Cairo.Util.val;
      var sq = Cairo.Database.sqlString;

      var CFG_GRUPO = C.CFG_GRUPO;
      var EMP_ID = C.EMP_ID;
      var TEXT = Cairo.Constants.Types.text;
      var ID = Cairo.Constants.Types.id;

      var CONFIG_KEY = "cfg_aspecto";
      var CONFIG_VALUE = "cfg_valor";

      self.copy = function() {

      };

      self.editNew = function() {

      };

      self.getApplication = function() {
        return Cairo.Application.getName();
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

      self.showDocDigital = function() {
        return false;
      };

      self.messageEx = function(messageId, info) {
        return true;
      };

      self.discardChanges = function() {
        return Cairo.Promises.resolvedPromise(refreshCollection());
      };

      self.propertyChange = function(key) {
        return Cairo.Promises.resolvedPromise(false);
      };

      self.save = function() {
        var register = null;

        var mainRegister = new Cairo.Database.Register();
        var transaction = Cairo.Database.createTransaction();

        var companyId = Cairo.Company.getId().toString();

        transaction.setTable(C.CONFIGURACION)

        var createRegister = function() {
          var register = new Cairo.Database.Register();
          register.setTable(C.CONFIGURACION);
          return register;
        };

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {

          var property = m_dialog.getProperties().item(_i);

          switch (property.getKey()) {

            case K_CLAVE_FISCAL:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_CLAVEFISCAL));

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_CLAVEFISCAL, TEXT);
              w_fields.add(CONFIG_VALUE, property.getListItemData(), TEXT);

              transaction.addRegister(register);
              break;

            case K_FACTURA_ELECTRONICA:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_FACTURAELECTRONICA));

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_FACTURAELECTRONICA, TEXT);
              w_fields.add(CONFIG_VALUE, property.getValue(), TEXT);

              transaction.addRegister(register);

              break;

            case K_FE_PUNTO_VENTA:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_PUNTOVENTAFE) + ", emp_id:" + companyId);

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_PUNTOVENTAFE, TEXT);
              w_fields.add(CONFIG_VALUE, property.getValue(), TEXT);
              w_fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);

              break;

            case K_TA_ID_PREFACTURA:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_TAIDPREFACTURA) + ", emp_id:" + companyId);

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_TAIDPREFACTURA, TEXT);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), TEXT);
              w_fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);

              break;
          }
        }
        mainRegister.addTransaction(transaction);

        return Cairo.Database.saveTransaction(
            register,
            false,
            "",
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            getText(2301, "") // Error al grabar la Configuración General

          ).then(

          function(result) {
            if(result.success) {
              return load();
            }
            else {
              return false;
            }
          }
        );
      };

      self.getPath = function() {
        return "#general/contconfig";
      };

      self.getEditorName = function() {
        return "contconfig";
      };

      self.getTitle = function() {
        return Cairo.Language.getText(2682, ""); // Configuración General
      };

      self.validate = function() {

        for (var _i = 0, _count = m_dialog.getProperties().size(); _i < _count; _i++) {
          var property = m_dialog.getProperties().item(_i);

          switch (property.getKey()) {
            case K_CLAVE_FISCAL:
              if(property.getListItemData() == Cairo.Constants.NO_ID) {
                return Cairo.Modal.showWarningWithFalse(Cairo.Language.getText(3096, "")); // Debe indicar con que tipo de clave fiscal trabaja Cairo.
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var load = function() {

        return Cairo.Database.getData("load[" + m_apiPath + "general/contconfig]").then(
          function(response) {

            if(response.success === true) {
              m_puntoVentaFe = 0;

              var settings = response.data.get('settings')

              for(var _i = 0; _i < settings.length; _i += 1) {

                switch (getValue(settings[_i], CONFIG_KEY)) {

                  case C_CLAVEFISCAL:
                    m_claveFiscal = val(getValue(settings[_i], CONFIG_VALUE));
                    break;

                  case C_FACTURAELECTRONICA:
                    m_facturaElectronica = val(getValue(settings[_i], CONFIG_VALUE));
                    break;

                  case C_PUNTOVENTAFE:
                    m_puntoVentaFe = val(getValue(settings[_i], CONFIG_VALUE));
                    break;

                  case C_TAIDPREFACTURA:
                    var value = val(getValue(settings[_i], CONFIG_VALUE));
                    m_ta_id = value.id;
                    m_talonario = value.name;
                    break;
                }
              }
              return true;
            }
            else {
              return false;
            }
          }
        );
      };

      self.load = load;
      
      self.setDialog = function(value) {
        m_dialog = value;
      };

      self.edit = function(id, inModalWindow) {
        var p = Cairo.Promises.resolvedPromise(false);
        try {

          if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.MODIFY_CONFIG_CONTABILIDAD)) { return p; }

          m_dialog.setInModalWindow(inModalWindow);

          p = load(id).then(
            function(success) {
              if(success) {

                if(!loadCollection()) { return false; }

                m_editing = true;
              }
              return true;
            });
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.EDIT_FUNCTION, "cContConfig", "");
        }

        return p;
      };

      self.setTree = function(value) {
        m_listController = value;
      };

      var loadCollection = function() {

        m_dialog.getProperties().clear();

        var properties = m_dialog.getProperties();

        properties.clear();
        
        var elem = properties.add(null, C_CLAVEFISCAL);
        elem.setType(Dialogs.PropertyType.list);
        elem.setName(Cairo.Language.getText(3097, "")); // Tipo de Clave Fiscal
        elem.setKey(K_CLAVE_FISCAL);
        var list = elem.getList();
        var elem = list.add(null);
        elem.setId(C.ClaveFiscalType.cuit); 
        elem.setValue(Cairo.Language.getText(3098, "")); // C.U.I.T.
        var elem = list.add(null);
        elem.setId(C.ClaveFiscalType.rut);
        elem.setValue(Cairo.Language.getText(3099, "")); // R.U.T.
        elem.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
        elem.setListItemData(m_claveFiscal);

        var elem = properties.add(null, C_PUNTOVENTAFE);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.integer);
        elem.setName(Cairo.Language.getText(5126, "")); // Punto de Venta Factura Electronica
        elem.setKey(K_FE_PUNTO_VENTA);
        elem.setValue(m_puntoVentaFe);
        var o = null;
        o = elem;
        o.setNoShowButton(true);

        var elem = properties.add(null, C_TAIDPREFACTURA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIOS);
        elem.setName(Cairo.Language.getText(5127, "")); // Talonario pre-facturas Factura Electronica
        elem.setKey(K_TA_ID_PREFACTURA);
        elem.setValue(m_talonario);
        elem.setSelectId(m_ta_id);

        var elem = properties.add(null, C_FACTURAELECTRONICA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Language.getText(5124, "")); // Infomar al servicio web AFIP de factura electronica asincronicamente
        elem.setKey(K_FACTURA_ELECTRONICA);
        elem.setValue(Cairo.Util.boolToInt(m_facturaElectronica));

        if(!m_dialog.show(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        var properties = m_dialog.getProperties();

        var elem = properties.item(C_CLAVEFISCAL);
        elem.setListItemData(m_claveFiscal);

        var elem = properties.item(C_TAIDPREFACTURA);
        elem.setValue(m_talonario);
        elem.setSelectId(m_ta_id);

        var elem = properties.item(C_FACTURAELECTRONICA);
        elem.setValue(Cairo.Util.boolToInt(m_facturaElectronica));

        return m_dialog.showValues(properties);
      };

      var initialize = function() {

      };

      var destroy = function() {
        m_dialog = null;
        m_listController = null;
      };

      self.terminate = function() {
        m_editing = false;

        try {
          if(m_listController != null) {
            m_listController.removeEditor(self);
          }
        }
        catch (ex) {
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

  });

  Cairo.module("ContConfig.List", function(List, Cairo, Backbone, Marionette, $, _) {
    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.contConfigEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.contConfigEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Configuracion de Contabilidad",
            entityName: "configuracion de contabilidad",
            entitiesName: "configuracion de contabilidad"
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
              var editor = Cairo.ContConfig.Edit.Controller.getEditor();
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
            
          };

          // progress message
          //
          Cairo.LoadingMessage.show("ContConfigs", "Loading Configuracion de Contabilidad from Crowsoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ contConfigTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.CONFIGURACION,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.contConfigTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("ContConfigs", "contConfigTreeRegion", "#general/contconfigs", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());