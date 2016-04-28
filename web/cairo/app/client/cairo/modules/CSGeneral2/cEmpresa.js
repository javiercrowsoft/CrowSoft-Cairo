(function() {
  "use strict";

  Cairo.module("Empresa.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;

      var C_MODULE = "cEmpresa";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_DESCRIP = 3;
      var K_RAZONSOCIAL = 4;
      var K_CUIT = 5;
      var K_INGRESOSBRUTOS = 6;
      var K_CATFISCAL = 7;
      var K_CHEQUEORDEN = 8;
      var K_CODPOSTAL = 9;
      var K_LOCALIDAD = 10;
      var K_CALLE = 11;
      var K_CALLENUMERO = 12;
      var K_PISO = 13;
      var K_DEPTO = 14;
      var K_TEL = 15;
      var K_FAX = 16;
      var K_EMAIL = 17;
      var K_WEB = 18;
      var K_ACTIVE = 19;
      var K_CODIGO_BARRA = 20;
      var K_ES_SUCURSAL = 21;

      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_codigoBarra = "";
      var m_descrip = "";
      var m_razonsocial = "";
      var m_cuit = "";
      var m_ingresosbrutos = "";
      var m_catFiscal = 0;
      var m_chequeorden = "";
      var m_esSucursal;
      var m_codpostal = "";
      var m_localidad = "";
      var m_calle = "";
      var m_callenumero = "";
      var m_piso = "";
      var m_depto = "";
      var m_tel = "";
      var m_fax = "";
      var m_email = "";
      var m_web = "";
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

      self.setId = function(value) {
        m_id = value;
      };

      self.getName = function() {
        return m_name;
      };

      self.setNombre = function(value) {
        m_name = value;
      };

      self.getCode = function() {
        return m_code;
      };

      self.setCodigo = function(value) {
        m_code = value;
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

      self.messageEx = function(messageId, info) {
        var _rtn = null;
        switch (messageId) {

          case Dialogs.Message.MSG_DOC_INFO:

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_EMPRESA);
            _rtn = Dialogs.Message.MSG_DOC_INFO_HANDLED;
            break;

          default:
            _rtn = true;
            break;
        }

        return Cairo.Promises.resolvedPromise(_rtn);
      };

      self.showDocDigital = function() {
        var _rtn = null;
        try {

          if(m_id === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(Cairo.Constants.EMPRESA);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showDocDigital", C_MODULE, "");
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

      self.discardChanges = function() {
        return Cairo.Promises.resolvedPromise(refreshCollection());
      };

      self.copy = function() {

        updateList();

        m_isNew = true;

        if(m_listController !== null) {
          m_listController.updateEditorKey(self, NO_ID);
        }

        var property = m_dialog.getProperties().item(C.EMP_CODE);
        property.setValue("C-"+ property.getValue());

        var property = m_dialog.getProperties().item(C.EMP_NAME);
        property.setValue("Copia de "+ property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(C.EMP_CODE));

        m_copy = true;
      };

      self.propertyChange = function(key) {
        return Cairo.Promises.resolvedPromise(false);
      };

      self.save = function() {
        var _rtn = null;

        var register = new Cairo.Database.Register();
        var fields = register.getFields();

        register.setFieldId(C.EMP_ID);
        register.setTable(Cairo.Constants.EMPRESA);

        register.setPath(m_apiPath + "general/empresa");

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
              fields.add(C.EMP_NAME, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODE:
              fields.add(C.EMP_CODE, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODIGO_BARRA:
              fields.add(C.EMP_CODIGO_BARRA, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_ES_SUCURSAL:
              fields.add(C.EMP_ES_SUCURSAL, property.getValue(), Cairo.Constants.Types.boolean);
              break;

            case K_DESCRIP:
              fields.add(C.EMP_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_RAZONSOCIAL:
              fields.add(C.EMP_RAZONSOCIAL, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CUIT:
              fields.add(C.EMP_CUIT, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_INGRESOSBRUTOS:
              fields.add(C.EMP_INGRESOSBRUTOS, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CATFISCAL:
              fields.add(C.EMP_CATFISCAL, property.getListItemData(), Cairo.Constants.Types.integer);
              break;

            case K_CHEQUEORDEN:
              fields.add(C.EMP_CHEQUEORDEN, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODPOSTAL:
              fields.add(C.EMP_CODPOSTAL, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_LOCALIDAD:
              fields.add(C.EMP_LOCALIDAD, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CALLE:
              fields.add(C.EMP_CALLE, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CALLENUMERO:
              fields.add(C.EMP_CALLENUMERO, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_PISO:
              fields.add(C.EMP_PISO, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_DEPTO:
              fields.add(C.EMP_DEPTO, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_TEL:
              fields.add(C.EMP_TEL, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_FAX:
              fields.add(C.EMP_FAX, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_EMAIL:
              fields.add(C.EMP_EMAIL, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_WEB:
              fields.add(C.EMP_WEB, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, property.getValue(), Cairo.Constants.Types.boolean);
              break;
          }
        }

        return Cairo.Database.saveEx(
          register,
          false,
          C.EMP_CODE,
          Cairo.Constants.CLIENT_SAVE_FUNCTION,
          C_MODULE,
          getText(1170, "")).then(

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
                  };
                  m_isNew = false;
                  return success;
                }
              );
            }
            else {
              return false;
            }
          }
        );
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
        return "#general/empresa/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "empresa" + id;
      };

      self.getTitle = function() {
        // Empresas
        return getText(1171, "");
      };

      self.validate = function() {

        var property = null;

        var _count = m_dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NAME:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.text)) {
                // Debe indicar un nombre
                Cairo.Modal.showInfo(getText(1007, ""));
              }
              break;

            case K_CODE:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.text)) {
                // Debe indicar un c�digo
                Cairo.Modal.showInfo(getText(1008, ""));
              }
              break;

            case K_RAZONSOCIAL:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.text)) {
                // Debe indicar una raz�n social
                Cairo.Modal.showInfo(getText(1172, ""));
              }
              break;

            case K_CUIT:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.text)) {
                // Debe indicar un CUIT
                Cairo.Modal.showInfo(getText(1173, ""));
              }
              break;

            case K_CATFISCAL:
              if(Cairo.Util.valEmpty(property.getListItemData(), Cairo.Constants.Types.integer)) {
                // Debe indicar un categor�a fiscal
                Cairo.Modal.showInfo(getText(1174, ""));
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      self.setTreeId = function(value) {
        m_treeId = value;
      };

      self.getTreeId = function() {
        return m_treeId;
      };

      self.list = function() {
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_EMPRESA);
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
        try {

          if(id === NO_ID) {
            m_isNew = true;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_EMPRESA)) { return false; }
          }
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_EMPRESA)) { return false; }
          }

          m_dialog.setInModalWindow(inModalWindow);

          if(!load(id)) { return false; }

          if(!loadCollection()) { return false; }

          m_editing = true;
          m_copy = false;

          m_dialog.setInModalWindow(inModalWindow);

          return null;
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "cIEditGeneric_Edit", "cEmpresa", "");
        }
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

        var w_tabs = m_dialog.getTabs();

        w_tabs.clear();

        var tab = w_tabs.add(null);
        tab.setName(Cairo.Constants.TAB_GENERAL);

        var tab = w_tabs.add(null);
        tab.setIndex(1);
        // Direcci�n
        tab.setName(getText(1037, ""));

        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, C.EMP_NAME);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(255);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        var elem = properties.add(null, C.EMP_CODE);
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

        var elem = properties.add(null, C.EMP_CODIGO_BARRA);
        elem.setType(Dialogs.PropertyType.text);
        // C�digo de Barras
        elem.setName(getText(1177, ""));
        elem.setSize(15);
        elem.setKey(K_CODIGO_BARRA);
        elem.setValue(m_codigoBarra);

        var elem = properties.add(null, C.EMP_RAZONSOCIAL);
        elem.setType(Dialogs.PropertyType.text);
        // Raz�n Social
        elem.setName(getText(1178, ""));
        elem.setSize(255);
        elem.setKey(K_RAZONSOCIAL);
        elem.setValue(m_razonsocial);

        var elem = properties.add(null, C.EMP_CUIT);
        elem.setType(Dialogs.PropertyType.text);
        // Cuit
        elem.setName(getText(1179, ""));
        elem.setSize(50);
        elem.setKey(K_CUIT);
        elem.setValue(m_cuit);

        var elem = properties.add(null, C.EMP_INGRESOSBRUTOS);
        elem.setType(Dialogs.PropertyType.text);
        // Ingresos brutos
        elem.setName(getText(1180, ""));
        elem.setSize(20);
        elem.setKey(K_INGRESOSBRUTOS);
        elem.setValue(m_ingresosbrutos);

        var elem = properties.add(null, C.EMP_CATFISCAL);
        elem.setType(Dialogs.PropertyType.list);
        // Categoria Fiscal
        elem.setName(getText(1181, ""));
        elem.setKey(K_CATFISCAL);
        elem.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
        elem.setListItemData(m_catFiscal);

        var list = elem.getList();

        var elem = list.add(null, C.CategoriaFiscal.consumidorFinal);
        elem.setId(C.CategoriaFiscal.consumidorFinal);
        elem.setValue(getText(1182, "")); // Consumidor final

        var elem = list.add(null, C.CategoriaFiscal.noInscripto);
        elem.setId(C.CategoriaFiscal.noInscripto);
        elem.setValue(getText(1183, "")); // No Inscripto

        var elem = list.add(null, C.CategoriaFiscal.inscripto);
        elem.setId(C.CategoriaFiscal.inscripto);
        elem.setValue(getText(1184, "")); // Inscripto

        var elem = list.add(null, C.CategoriaFiscal.extranjero);
        elem.setId(C.CategoriaFiscal.extranjero);
        elem.setValue(getText(1185, "")); // Extranjero

        var elem = list.add(null, C.CategoriaFiscal.exento);
        elem.setId(C.CategoriaFiscal.exento);
        elem.setValue(getText(1186, "")); // Exento

        var elem = list.add(null, C.CategoriaFiscal.monotributo);
        elem.setId(C.CategoriaFiscal.monotributo);
        elem.setValue(getText(1187, "")); // Monotributo

        var elem = list.add(null, C.CategoriaFiscal.extranjeroIva);
        elem.setId(C.CategoriaFiscal.extranjeroIva);
        elem.setValue(getText(1188, "")); // Extranjero con Iva

        var elem = list.add(null, C.CategoriaFiscal.noCategorizado);
        elem.setId(C.CategoriaFiscal.noCategorizado);
        elem.setValue(getText(1189, "")); // No categorizado

        var elem = list.add(null, C.CategoriaFiscal.noResponsable);
        elem.setId(C.CategoriaFiscal.noResponsable);
        elem.setValue(getText(1190, "")); // No responsable

        var elem = list.add(null, C.CategoriaFiscal.noResponsableExento);
        elem.setId(C.CategoriaFiscal.noResponsableExento);
        elem.setValue(getText(1191, "")); // No responsable exento

        var elem = list.add(null, C.CategoriaFiscal.inscriptoM);
        elem.setId(C.CategoriaFiscal.inscriptoM);
        elem.setValue(getText(1192, "")); // Inscripto M

        var elem = properties.add(null, C.EMP_ES_SUCURSAL);
        elem.setType(Dialogs.PropertyType.check);
        // Es Sucursal
        elem.setName(getText(4654, ""));
        elem.setKey(K_ES_SUCURSAL);
        elem.setValue(Cairo.Util.boolToInt(m_esSucursal));

        var elem = properties.add(null, C.EMP_CHEQUEORDEN);
        elem.setType(Dialogs.PropertyType.text);
        // Cheque Orden
        elem.setName(getText(1193, ""));
        elem.setSize(100);
        elem.setKey(K_CHEQUEORDEN);
        elem.setValue(m_chequeorden);

        var elem = properties.add(null, C.EMP_CALLE);
        elem.setType(Dialogs.PropertyType.text);
        // Calle
        elem.setName(getText(1194, ""));
        elem.setSize(100);
        elem.setKey(K_CALLE);
        elem.setTabIndex(1);
        elem.setValue(m_calle);

        var elem = properties.add(null, C.EMP_CALLENUMERO);
        elem.setType(Dialogs.PropertyType.text);
        // Calle N�mero
        elem.setName(getText(1195, ""));
        elem.setSize(100);
        elem.setKey(K_CALLENUMERO);
        elem.setTabIndex(1);
        elem.setValue(m_callenumero);

        var elem = properties.add(null, C.EMP_PISO);
        elem.setType(Dialogs.PropertyType.text);
        // Piso
        elem.setName(getText(1196, ""));
        elem.setSize(100);
        elem.setKey(K_PISO);
        elem.setTabIndex(1);
        elem.setValue(m_piso);

        var elem = properties.add(null, C.EMP_DEPTO);
        elem.setType(Dialogs.PropertyType.text);
        // Depto
        elem.setName(getText(1197, ""));
        elem.setSize(100);
        elem.setKey(K_DEPTO);
        elem.setValue(m_depto);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.EMP_LOCALIDAD);
        elem.setType(Dialogs.PropertyType.text);
        // Localidad
        elem.setName(getText(1198, ""));
        elem.setSize(100);
        elem.setKey(K_LOCALIDAD);
        elem.setValue(m_localidad);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.EMP_CODPOSTAL);
        elem.setType(Dialogs.PropertyType.text);
        // C�digo Postal
        elem.setName(getText(1199, ""));
        elem.setSize(50);
        elem.setKey(K_CODPOSTAL);
        elem.setValue(m_codpostal);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.EMP_TEL);
        elem.setType(Dialogs.PropertyType.text);
        // Telefono
        elem.setName(getText(1036, ""));
        elem.setSize(100);
        elem.setKey(K_TEL);
        elem.setValue(m_tel);

        var elem = properties.add(null, C.EMP_FAX);
        elem.setType(Dialogs.PropertyType.text);
        // Fax
        elem.setName(getText(1200, ""));
        elem.setSize(100);
        elem.setKey(K_FAX);
        elem.setValue(m_fax);

        var elem = properties.add(null, C.EMP_EMAIL);
        elem.setType(Dialogs.PropertyType.text);
        // E-Mail
        elem.setName(getText(1034, ""));
        elem.setSize(100);
        elem.setKey(K_EMAIL);
        elem.setValue(m_email);

        var elem = properties.add(null, C.EMP_WEB);
        elem.setType(Dialogs.PropertyType.text);
        // Web
        elem.setName(getText(1038, ""));
        elem.setSize(100);
        elem.setKey(K_WEB);
        elem.setValue(m_web);

        var elem = properties.add(null, C.EMP_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setSize(255);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);

        if(!m_dialog.show(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(C.EMP_NAME);
        elem.setValue(m_name);

        var elem = properties.item(C.EMP_CODE);
        elem.setValue(m_code);

        var elem = properties.item(Cairo.Constants.ACTIVE);
        elem.setValue(Cairo.Util.boolToInt(m_active));

        var elem = properties.item(C.EMP_CODIGO_BARRA);
        elem.setValue(m_codigoBarra);

        var elem = properties.item(C.EMP_RAZONSOCIAL);
        elem.setValue(m_razonsocial);

        var elem = properties.item(C.EMP_CUIT);
        elem.setValue(m_cuit);

        var elem = properties.item(C.EMP_INGRESOSBRUTOS);
        elem.setValue(m_ingresosbrutos);

        var elem = properties.item(C.EMP_CATFISCAL);

        var elem = properties.item(C.EMP_ES_SUCURSAL);
        elem.setValue(Cairo.Util.boolToInt(m_esSucursal));

        var elem = properties.item(C.EMP_CHEQUEORDEN);
        elem.setValue(m_chequeorden);

        var elem = properties.item(C.EMP_CALLE);
        elem.setValue(m_calle);

        var elem = properties.item(C.EMP_CALLENUMERO);
        elem.setValue(m_callenumero);

        var elem = properties.item(C.EMP_PISO);
        elem.setValue(m_piso);

        var elem = properties.item(C.EMP_DEPTO);
        elem.setValue(m_depto);

        var elem = properties.item(C.EMP_LOCALIDAD);
        elem.setValue(m_localidad);

        var elem = properties.item(C.EMP_CODPOSTAL);
        elem.setValue(m_codpostal);

        var elem = properties.item(C.EMP_TEL);
        elem.setValue(m_tel);

        var elem = properties.item(C.EMP_FAX);
        elem.setValue(m_fax);

        var elem = properties.item(C.EMP_EMAIL);
        elem.setValue(m_email);

        var elem = properties.item(C.EMP_WEB);
        elem.setValue(m_web);

        var elem = properties.item(C.EMP_DESCRIP);
        elem.setValue(m_descrip);

        return m_dialog.showValues(properties);
      };

      var load = function(id) {

        return DB.getData("load[" + m_apiPath + "general/empresa]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== NO_ID) {

              m_id = Cairo.Database.valField(response.data, C.EMP_ID);
              m_name = Cairo.Database.valField(response.data, C.EMP_NAME);
              m_code = Cairo.Database.valField(response.data, C.EMP_CODE);
              m_codigoBarra = Cairo.Database.valField(response.data, C.EMP_CODIGO_BARRA);
              m_descrip = Cairo.Database.valField(response.data, C.EMP_DESCRIP);
              m_razonsocial = Cairo.Database.valField(response.data, C.EMP_RAZONSOCIAL);
              m_cuit = Cairo.Database.valField(response.data, C.EMP_CUIT);
              m_ingresosbrutos = Cairo.Database.valField(response.data, C.EMP_INGRESOSBRUTOS);
              m_catFiscal = Cairo.Database.valField(response.data, C.EMP_CATFISCAL);
              m_chequeorden = Cairo.Database.valField(response.data, C.EMP_CHEQUEORDEN);
              m_codpostal = Cairo.Database.valField(response.data, C.EMP_CODPOSTAL);
              m_localidad = Cairo.Database.valField(response.data, C.EMP_LOCALIDAD);
              m_calle = Cairo.Database.valField(response.data, C.EMP_CALLE);
              m_callenumero = Cairo.Database.valField(response.data, C.EMP_CALLENUMERO);
              m_piso = Cairo.Database.valField(response.data, C.EMP_PISO);
              m_depto = Cairo.Database.valField(response.data, C.EMP_DEPTO);
              m_tel = Cairo.Database.valField(response.data, C.EMP_TEL);
              m_fax = Cairo.Database.valField(response.data, C.EMP_FAX);
              m_email = Cairo.Database.valField(response.data, C.EMP_EMAIL);
              m_web = Cairo.Database.valField(response.data, C.EMP_WEB);
              m_esSucursal = Cairo.Database.valField(response.data, C.EMP_ES_SUCURSAL);
              m_active = Cairo.Database.valField(response.data, Cairo.Constants.ACTIVE);

            }
            else {
              m_id = NO_ID;
              m_name = "";
              m_code = "";
              m_codigoBarra = "";
              m_descrip = "";
              m_razonsocial = "";
              m_cuit = "";
              m_ingresosbrutos = "";
              m_catFiscal = 0;
              m_chequeorden = "";
              m_codpostal = "";
              m_localidad = "";
              m_calle = "";
              m_callenumero = "";
              m_piso = "";
              m_depto = "";
              m_tel = "";
              m_fax = "";
              m_email = "";
              m_web = "";
              m_esSucursal = false;
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
      var editor = Cairo.Empresa.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit(id);
    };

  });

  Cairo.module("Empresa.List", function(List, Cairo, Backbone, Marionette, $, _) {

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

          var editors = Cairo.Editors.empresaEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.empresaEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Empresas",
            entityName: "empresa",
            entitiesName: "empresas"
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
              var editor = Cairo.Empresa.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_EMPRESA)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            return Cairo.Database.destroy(m_apiPath + "general/empresa", id, Cairo.Constants.DELETE_FUNCTION, "Empresa").whenSuccess(
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
          Cairo.LoadingMessage.show("Empresas", "Loading Empresas from CrowSoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ empresaTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.EMPRESA,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.empresaTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("Empresas", "empresaTreeRegion", "#general/empresas", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());