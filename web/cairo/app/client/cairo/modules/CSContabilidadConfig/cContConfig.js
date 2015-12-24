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
      var T = Dialogs.PropertyType;

      var C_MODULE = "cContabilidadConfigEdit";

      var K_CLAVE_FISCAL = 1;
      var K_FACTURA_ELECTRONICA = 2;
      var K_FE_PUNTO_VENTA = 3;
      var K_TA_ID_PREFACTURA = 4;

      var C_GRUPO_GENERAL = "Contabilidad-General";
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

      var m_apiPath = DB.getAPIVersion();

      var getValue = DB.getValue;
      var val = Cairo.Util.val;
      var sq = DB.sqlString;

      var CFG_GRUPO = C.CFG_GRUPO;
      var EMP_ID = C.EMP_ID;
      var TEXT = Cairo.Constants.Types.text;
      var ID = Cairo.Constants.Types.id;

      self.getClaveFiscal = function() {
        return m_claveFiscal;
      };

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

        var mainRegister = new DB.Register();
        var transaction = DB.createTransaction();

        var companyId = Cairo.Company.getId().toString();

        transaction.setTable(C.CONFIGURACION)

        var createRegister = function() {
          var register = new DB.Register();
          register.setTable(C.CONFIGURACION);
          return register;
        };

        for(var _i = 0, _count = m_dialog.getProperties().size(); _i < _count; _i++) {

          var property = m_dialog.getProperties().item(_i);

          switch (property.getKey()) {

            case K_CLAVE_FISCAL:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_CLAVEFISCAL));

              var fields = register.getFields();
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_CLAVEFISCAL, TEXT);
              fields.add(C.CONFIG_VALUE, property.getListItemData(), TEXT);

              transaction.addRegister(register);
              break;

            case K_FACTURA_ELECTRONICA:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_FACTURAELECTRONICA));

              var fields = register.getFields();
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_FACTURAELECTRONICA, TEXT);
              fields.add(C.CONFIG_VALUE, property.getValue(), TEXT);

              transaction.addRegister(register);
              break;

            case K_FE_PUNTO_VENTA:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_PUNTOVENTAFE) + ", emp_id:" + companyId);

              var fields = register.getFields();
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_PUNTOVENTAFE, TEXT);
              fields.add(C.CONFIG_VALUE, property.getValue(), TEXT);
              fields.add(EMP_ID, companyId, ID);

              transaction.addRegister(register);
              break;

            case K_TA_ID_PREFACTURA:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_TAIDPREFACTURA) + ", emp_id:" + companyId);

              var fields = register.getFields();
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_TAIDPREFACTURA, TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, companyId, ID);

              transaction.addRegister(register);
              break;
          }
        }
        mainRegister.addTransaction(transaction);

        return DB.saveTransaction(
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
        return "#contabilidad/contconfig";
      };

      self.getEditorName = function() {
        return "contconfig";
      };

      self.getTitle = function() {
        return Cairo.Language.getText(2862, ""); // Configuración General
      };

      self.validate = function() {

        for(var _i = 0, _count = m_dialog.getProperties().size(); _i < _count; _i++) {
          var property = m_dialog.getProperties().item(_i);

          switch (property.getKey()) {
            case K_CLAVE_FISCAL:
              if(property.getListItemData() === Cairo.Constants.NO_ID) {
                return Cairo.Modal.showWarningWithFalse(Cairo.Language.getText(3096, "")); // Debe indicar con que tipo de clave fiscal trabaja Cairo.
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var load = function() {

        return DB.getData("load[" + m_apiPath + "general/contconfig]", NO_ID).then(
          function(response) {

            if(response.success === true) {
              m_puntoVentaFe = 0;

              var settings = response.data.get('settings')

              for(var _i = 0; _i < settings.length; _i += 1) {

                switch (getValue(settings[_i], C.CONFIG_KEY)) {

                  case C_CLAVEFISCAL:
                    m_claveFiscal = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case C_FACTURAELECTRONICA:
                    m_facturaElectronica = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case C_PUNTOVENTAFE:
                    m_puntoVentaFe = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case C_TAIDPREFACTURA:
                    var value = getValue(settings[_i], C.CONFIG_VALUE);
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

          p = load().then(
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
        elem.setType(T.list);
        elem.setName(Cairo.Language.getText(3097, "")); // Tipo de Clave Fiscal
        elem.setKey(K_CLAVE_FISCAL);
        elem.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
        elem.setListItemData(m_claveFiscal);
        var list = elem.getList();
        var elem = list.add(null);
        elem.setId(C.ClaveFiscalType.cuit); 
        elem.setValue(Cairo.Language.getText(3098, "")); // C.U.I.T.
        var elem = list.add(null);
        elem.setId(C.ClaveFiscalType.rut);
        elem.setValue(Cairo.Language.getText(3099, "")); // R.U.T.

        var elem = properties.add(null, C_PUNTOVENTAFE);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.integer);
        elem.setName(Cairo.Language.getText(5126, "")); // Punto de Venta Factura Electronica
        elem.setKey(K_FE_PUNTO_VENTA);
        elem.setValue(m_puntoVentaFe);

        var elem = properties.add(null, C_TAIDPREFACTURA);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.TALONARIOS);
        elem.setName(Cairo.Language.getText(5127, "")); // Talonario pre-facturas Factura Electronica
        elem.setKey(K_TA_ID_PREFACTURA);
        elem.setValue(m_talonario);
        elem.setSelectId(m_ta_id);

        var elem = properties.add(null, C_FACTURAELECTRONICA);
        elem.setType(T.check);
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

      var destroy = function() {
        m_dialog = null;
        m_listController = null;
      };

      self.terminate = function() {
        m_editing = false;

        try {
          if(m_listController !== null) {
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

    var showEditor = function() {
      var editor = Cairo.ContConfig.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit();
    };

    Edit.Controller = { getEditor: createObject, edit: showEditor };

  });

}());