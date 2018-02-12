(function() {
  "use strict";

  Cairo.module("Cliente.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var P = Cairo.Promises;
      var call = P.call;
      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;
      var Types = Cairo.Constants.Types;
      var valField = DB.valField;
      var getValue = DB.getValue;
      var M = Cairo.Modal;
      var T = Dialogs.PropertyType;
      var val = Cairo.Util.val;
      var valEmpty = Cairo.Util.valEmpty;
      var D = Cairo.Documents;

      var C_MODULE = "cCliente";

      var C_PERCEPCION = "Percepcion";
      var C_EMPRESAS = "Empresas";
      var C_CUENTAGRUPO = "CuentaGrupo";
      var C_SUCURSALES = "Sucursales";
      var C_CONTACTO = "Contacto";
      var C_DPTO = "Departamentos";
      var C_INFORMES = "Informes";
      var C_WEB_MAIL = "webmail";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_CONTACTO = 3;
      var K_DESCRIP = 4;
      var K_RAZONSOCIAL = 5;
      var K_CUIT = 6;
      var K_INGRESOSBRUTOS = 7;
      var K_CATFISCAL = 8;
      var K_CHEQUEORDEN = 9;
      var K_CODPOSTAL = 10;
      var K_LOCALIDAD = 11;
      var K_CALLE = 12;
      var K_CALLENUMERO = 13;
      var K_PISO = 14;
      var K_DEPTO = 15;
      var K_TEL = 16;
      var K_FAX = 17;
      var K_EMAIL = 18;
      var K_WEB = 19;
      var K_PRO_ID = 20;
      var K_ZON_ID = 21;
      var K_CPG_ID = 22;
      var K_ACTIVE = 23;
      var K_LP_ID = 24;
      var K_LD_ID = 25;
      var K_SUCURSALES = 26;
      var K_YAHOO = 27;
      var K_MESSANGER = 28;
      var K_CONTACTOS = 29;
      var K_VEN_ID = 30;
      var K_CREDITO_CTA_CTE = 31;
      var K_CREDITO_TOTAL = 32;
      var K_CREDITO_ACTIVO = 33;
      var K_CUENTA_GRUPO = 34;
      var K_PERCEPCION = 35;
      var K_EMPRESAS = 36;
      var K_DEPARTAMENTOS = 37;
      var K_TRANS_ID = 38;
      var K_EXIGETRANS = 39;
      var K_CLI_ID_PADRE = 40;
      var K_PCIATRANSPORTE = 41;
      var K_EXIGEPROVINCIA = 42;

      var K_US_NOMBRE = 43;
      var K_INFORMES = 44;
      var K_US_WEB = 45;
      var K_WEB_MAIL = 46;

      var K_ESPROSPECTO = 47;
      var K_TIPO_CONTACTO = 48;
      var K_REFERIDO = 49;
      var K_PROY_ID = 50;
      var K_CPA_ID = 51;

      var K_HORARIO_M_DESDE = 52;
      var K_HORARIO_M_HASTA = 53;
      var K_HORARIO_T_DESDE = 54;
      var K_HORARIO_T_HASTA = 55;

      var K_FP_ID = 56;

      var KI_S_CLIS_ID = 1;
      var KI_S_NOMBRE = 2;
      var KI_S_CODIGO = 3;
      var KI_S_DESCRIP = 5;
      var KI_S_LOCALIDAD = 6;
      var KI_S_CALLE = 7;
      var KI_S_CALLENUMERO = 8;
      var KI_S_PISO = 9;
      var KI_S_DEPTO = 10;
      var KI_S_TEL = 11;
      var KI_S_FAX = 12;
      var KI_S_EMAIL = 13;
      var KI_S_ZON_ID = 14;
      var KI_S_CP = 16;
      var KI_S_PRO_ID = 15;
      var KI_S_PA_ID = 17;
      var KI_S_CONTACTO = 18;

      var KI_CONT_ID = 1;
      var KI_NOMBRE = 2;
      var KI_CODIGO = 3;
      var KI_DESCRIP = 4;
      var KI_TEL = 5;
      var KI_CELULAR = 6;
      var KI_EMAIL = 7;
      var KI_CARGO = 8;
      var KI_DIRECCION = 9;
      var KI_ACTIVO = 12;

      var KI_CUEG_ID = 2;
      var KI_CLICUEG_ID = 3;
      var KI_CUE_ID = 4;

      var KI_CLIPERC_ID = 1;
      var KI_PERCT_ID = 2;
      var KI_PERC_ID = 3;
      var KI_PERC_DESDE = 4;
      var KI_PERC_HASTA = 5;

      var KI_EMPCLI_ID = 1;
      var KI_EMP_ID = 2;

      var KI_DPTOCLI_ID = 1;
      var KI_DPTO_ID = 2;

      var KI_PER_ID = 1;
      var KI_INF_ID = 2;
      var KI_INF_CODIGO = 3;
      var KI_PRE_ID = 4;

      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_contacto = "";
      var m_descrip = "";
      var m_razonsocial = "";
      var m_cuit = "";
      var m_ingresosbrutos = "";
      var m_catFiscal = 0;
      var m_chequeorden = "";
      var m_codpostal = "";
      var m_cpaNombre = "";
      var m_horario_m_desde = null;
      var m_horario_m_hasta = null;
      var m_horario_t_desde = null;
      var m_horario_t_hasta = null;
      var m_cpa_id = 0;
      var m_localidad = "";
      var m_calle = "";
      var m_callenumero = "";
      var m_piso = "";
      var m_depto = "";
      var m_tel = "";
      var m_fax = "";
      var m_email = "";
      var m_yahoo = "";
      var m_messanger = "";
      var m_web = "";
      var m_pro_id = 0;
      var m_zon_id = 0;
      var m_provincia = "";
      var m_zona = "";
      var m_active;
      var m_esProspecto;
      var m_cpg_id = 0;
      var m_condicionPago = "";
      var m_lp_id = 0;
      var m_listaPrecio = "";
      var m_ld_id = 0;
      var m_listaDescuento = "";
      var m_ven_id = 0;
      var m_vendedor = "";
      var m_trans_id = 0;
      var m_transporte = "";
      var m_exigeTrans;
      var m_exigeProvincia;
      var m_pciaTransporte;
      var m_creditoctacte = 0;
      var m_creditototal = 0;
      var m_creditoactivo;
      var m_clientePadre = "";
      var m_cliId_padre = 0;
      var m_clict_id = 0;
      var m_contactoTipo = "";

      var m_cliId_referido = 0;
      var m_referido = "";
      var m_proy_id = 0;
      var m_proyecto = "";

      var m_formapago = "";
      var m_fp_id = 0;

      var m_us_id = 0;
      var m_us_activo;
      var m_us_nombre = "";

      var m_editing;

      var m_dialog;
      var m_listController = null;

      var m_isNew;

      var m_branchId = 0;
      var m_treeId = 0;

      var m_copy;

      var m_itemsDeletedSucursales = "";
      var m_itemsDeletedContacto = "";
      var m_itemsDeletedCuentaGrupo = "";
      var m_itemsDeletedPercepciones = "";
      var m_itemsDeletedDptos = "";
      var m_itemsDeletedInf = "";

      var m_genericEdit;

      var m_apiPath = DB.getAPIVersion();

      var emptyData = {
        informes: [],
        empresas: [],
        cuentasGrupo: [],
        percepciones: [],
        dptos: [],
        contactos: [],
        sucursales: [],
        additionalFields: {
          fields: [],
          values: []
        }
      };

      var m_data = emptyData;

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

        if(m_listController !== null) {
          m_listController.updateEditorKey(self, NO_ID);
        }

        var property = m_dialog.getProperties().item(C.CLI_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(C.CLI_CODE));

        m_copy = true;
      };

      self.editNew = function() {

        updateList();

        m_isNew = true;

        if(!validateAccessNewEdit(NO_ID)) { return false; }

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

          doc.setClientTable(C.CLIENTE);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, Cairo.Constants.SHOW_DOCUMENTS_FUNCTION, C_MODULE, "");
        }

        return _rtn;
      };

      self.messageEx = function(messageId, info) {
        var _rtn = null;
        var p = null;

        switch (messageId) {

          case Dialogs.Message.MSG_DOC_INFO:

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_CLIENTE);
            _rtn = Dialogs.Message.MSG_DOC_INFO_HANDLED;
            break;

          case Dialogs.Message.MSG_GRID_VIRTUAL_ROW:

            p = P.resolvedPromise(info);
            break;

          default:

            _rtn = true;
            break;
        }

        return p || P.resolvedPromise(_rtn);
      };

      self.discardChanges = function() {
        return P.resolvedPromise(refreshCollection());
      };

      self.propertyChange = function(key) {
        switch (key) {

          case K_US_WEB:

            var properties = m_dialog.getProperties();
            var bWeb = val(properties.item(C.CLI_INF_ACTIVE).getValue());
            properties.item(C.CLI_INF_US_ID).setEnabled(bWeb);
            if(properties.item(C.CLI_INF_US_ID).getValue() === "") {
              properties.item(C.CLI_INF_US_ID).setValue(properties.item(C.CLI_CODE).getValue());
            }

            m_dialog.showValue(properties.item(C.CLI_INF_US_ID));

            properties.item(C_INFORMES).setEnabled(bWeb);
            m_dialog.showValue(properties.item(C_INFORMES), true);
            break;

          case K_WEB_MAIL:

            sendMailToClient(true, false);
            break;
        }
        return P.resolvedPromise(false);
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.CLI_ID);
        register.setTable(C.CLIENTE);

        register.setPath(m_apiPath + "general/cliente");

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
              fields.add(C.CLI_NAME, property.getValue(), Types.text);
              break;

            case K_CODE:
              fields.add(C.CLI_CODE, property.getValue(), Types.text);
              break;

            case K_CONTACTO:
              fields.add(C.CLI_CONTACTO, property.getValue(), Types.text);
              break;

            case K_TIPO_CONTACTO:
              fields.add(C.CLICT_ID, property.getSelectId(), Types.id);
              break;

            case K_RAZONSOCIAL:
              fields.add(C.CLI_RAZONSOCIAL, property.getValue(), Types.text);
              break;

            case K_CUIT:
              fields.add(C.CLI_CUIT, property.getValue(), Types.text);
              break;

            case K_INGRESOSBRUTOS:
              fields.add(C.CLI_INGRESOSBRUTOS, property.getValue(), Types.text);
              break;

            case K_CATFISCAL:
              fields.add(C.CLI_CAT_FISCAL, property.getListItemData(), Types.integer);
              break;

            case K_CHEQUEORDEN:
              fields.add(C.CLI_CHEQUEORDEN, property.getValue(), Types.text);
              break;

            case K_CODPOSTAL:
              fields.add(C.CLI_CODPOSTAL, property.getValue(), Types.text);
              break;

            case K_LOCALIDAD:
              fields.add(C.CLI_LOCALIDAD, property.getValue(), Types.text);
              break;

            case K_CALLE:
              fields.add(C.CLI_CALLE, property.getValue(), Types.text);
              break;

            case K_CALLENUMERO:
              fields.add(C.CLI_CALLENUMERO, property.getValue(), Types.text);
              break;

            case K_PISO:
              fields.add(C.CLI_PISO, property.getValue(), Types.text);
              break;

            case K_DEPTO:
              fields.add(C.CLI_DEPTO, property.getValue(), Types.text);
              break;

            case K_TEL:
              fields.add(C.CLI_TEL, property.getValue(), Types.text);
              break;

            case K_FAX:
              fields.add(C.CLI_FAX, property.getValue(), Types.text);
              break;

            case K_EMAIL:
              fields.add(C.CLI_EMAIL, property.getValue(), Types.text);
              break;

            case K_YAHOO:
              fields.add(C.CLI_YAHOO, property.getValue(), Types.text);
              break;

            case K_MESSANGER:
              fields.add(C.CLI_MESSENGER, property.getValue(), Types.text);
              break;

            case K_WEB:
              fields.add(C.CLI_WEB, property.getValue(), Types.text);
              break;

            case K_PRO_ID:
              fields.add(C.PRO_ID, property.getSelectId(), Types.id);
              break;

            case K_ZON_ID:
              fields.add(C.ZON_ID, property.getSelectId(), Types.id);
              break;

            case K_VEN_ID:
              fields.add(C.VEN_ID, property.getSelectId(), Types.id);
              break;

            case K_TRANS_ID:
              fields.add(C.TRANS_ID, property.getSelectId(), Types.id);
              break;

            case K_CLI_ID_PADRE:
              fields.add(C.CLI_ID_PADRE, property.getSelectId(), Types.id);
              break;

            case K_EXIGETRANS:
              fields.add(C.CLI_EXIGE_TRANSPORTE, property.getValue(), Types.boolean);
              break;

            case K_EXIGEPROVINCIA:
              fields.add(C.CLI_EXIGE_PROVINCIA, property.getValue(), Types.boolean);
              break;

            case K_PCIATRANSPORTE:
              fields.add(C.CLI_PCIA_TRANSPORTE, property.getValue(), Types.boolean);
              break;

            case K_CPG_ID:
              fields.add(C.CPG_ID, property.getSelectId(), Types.id);
              break;

            case K_DESCRIP:
              fields.add(C.CLI_DESCRIP, property.getValue(), Types.text);
              break;

            case K_LP_ID:
              fields.add(C.LP_ID, property.getSelectId(), Types.id);
              break;

            case K_LD_ID:
              fields.add(C.LD_ID, property.getSelectId(), Types.id);
              break;

            case K_CREDITO_CTA_CTE:
              fields.add(C.CLI_CREDITOCTA_CTE, property.getValue(), Types.currency);
              break;

            case K_CREDITO_TOTAL:
              fields.add(C.CLI_CREDITOTOTAL, property.getValue(), Types.currency);
              break;

            case K_CREDITO_ACTIVO:
              fields.add(C.CLI_CREDITOACTIVO, property.getValue(), Types.boolean);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, property.getValue(), Types.boolean);
              break;

            case K_ESPROSPECTO:
              fields.add(C.CLI_ES_PROSPECTO, property.getValue(), Types.boolean);
              break;

            case K_REFERIDO:
              fields.add(C.CLI_ID_REFERIDO, property.getSelectId(), Types.id);
              break;

            case K_PROY_ID:
              fields.add(C.PROY_ID, property.getSelectId(), Types.id);
              break;

            case K_CPA_ID:
              fields.add(C.CPA_ID, property.getSelectId(), Types.id);
              break;

            case K_FP_ID:
              fields.add(C.FP_ID, property.getSelectId(), Types.id);
              break;

            case K_HORARIO_M_DESDE:
              fields.add(C.CLI_HORARIO_MDESDE, property.getValue(), Types.date);
              break;

            case K_HORARIO_M_HASTA:
              fields.add(C.CLI_HORARIO_MHASTA, property.getValue(), Types.date);
              break;

            case K_HORARIO_T_DESDE:
              fields.add(C.CLI_HORARIO_TDESDE, property.getValue(), Types.date);
              break;

            case K_HORARIO_T_HASTA:
              fields.add(C.CLI_HORARIO_THASTA, property.getValue(), Types.date);
              break;

            case K_US_WEB:
              fields.add(C.CLI_INF_ACTIVE, property.getValue(), Types.boolean);
              break;

            case K_US_NOMBRE:
              fields.add(C.CLI_INF_US_ID, property.getValue(), Types.text);
              break;
          }
        }

        m_genericEdit.save(m_dialog, register);

        // save items

        saveItemsSucursales(register);
        saveItemsContacto(register);
        saveItemsCuentaGrupo(register);
        saveItemsPercepcion(register);
        saveItemsEmpresa(register);
        saveItemsDpto(register);
        saveItemsInformes(register);

        return DB.saveTransaction(
            register,
            false,
            C.CLI_CODE,
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            getText(1537, "") // Error al grabar el cliente

          ).then(

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
        return "#general/cliente/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "cliente" + id;
      };

      self.getTitle = function() {
        return getText(1303, ""); // Clientes
      };

      self.validate = function() {

        var p = null;
        var property = null;
        var creditoCC = null;
        var creditoTotal = null;
        var nombre = null;

        var _count = m_dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NAME:
              if(valEmpty(property.getValue(), Types.text)) {
                return M.showInfoWithFalse(Cairo.Constants.MUST_SET_A_NAME);
              }
              else {
                nombre = property.getValue();
              }
              break;

            case K_CODE:
              if(valEmpty(property.getValue(), Types.text)) {
                property.setValue(Cairo.Constants.GET_CODE_FROM_ID);
              }
              break;

            case K_RAZONSOCIAL:
              if(valEmpty(property.getValue(), Types.text)) {
                property.setValue(nombre);
              }
              break;

            case K_CATFISCAL:
              if(valEmpty(property.getListItemData(), Types.integer)) {
                return M.showInfoWithFalse(getText(1174, "")); // Debe indicar un categoria fiscal
              }
              break;

            case K_CREDITO_CTA_CTE:
              creditoCC = val(property.getValue());
              break;

            case K_CREDITO_TOTAL:
              creditoTotal = val(property.getValue());
              break;
          }
        }

        if(creditoCC > creditoTotal) {
          return M.showInfoWithFalse(getText(1380, ""));
          // El crédito en cuenta corriente no puede ser mayor que el crédito total
        }

        var cuit = m_dialog.getProperties().item(C.CLI_CUIT).getValue().trim();

        p = p || P.resolvedPromise(true);

        return p
          .whenSuccess(call(validateCuitCliente, cuit))
          .whenSuccess(call(m_genericEdit.validate, m_dialog));
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
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_CLIENTE);
      };

      self.setDialog = function(rhs) {
        m_dialog = rhs;
      };

      self.isEditing = function() {
        return m_editing;
      };

      self.edit = function(id, inModalWindow) {
        var p = P.resolvedPromise(false);
        try {

          if(!validateAccessNewEdit(id)) { return p; }

          m_dialog.setInModalWindow(inModalWindow);

          p = load(id).then(
            function(success) {
              if(success) {

                if(!m_genericEdit.init(m_data.additionalFields.fields)) { return p; }

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

      var validateAccessNewEdit = function(id) {
        if(id === NO_ID) {
          m_isNew = true;
          if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_CLIENTE)) { return false; }
        }
        else {
          m_isNew = false;
          if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_CLIENTE)) { return false; }
        }
        return true;
      };

      var loadCollection = function() {

        var tab_direccion = 1;
        var tab_sucursales = 2;
        var tab_contactos = 3;
        var tab_credito = 4;
        var tab_cuentagrupo = 5;
        var tab_percepcion = 6;
        var tab_empresas = 7;
        var tab_web = 8;
        var tab_crm = 9;

        var w_tabs = m_dialog.getTabs();

        w_tabs.clear();

        var tab = w_tabs.add(null);
        tab.setName(Cairo.Constants.TAB_GENERAL);

        var tab = w_tabs.add(null);
        tab.setName(getText(4791, "")); // Dir.
        tab.setIndex(tab_direccion);

        var tab = w_tabs.add(null);
        tab.setName(getText(4789, "")); // Suc.
        tab.setIndex(tab_sucursales);

        var tab = w_tabs.add(null);
        tab.setName(getText(1035, "")); // Contacto
        tab.setIndex(tab_contactos);

        var tab = w_tabs.add(null);
        tab.setName(getText(1392, "")); // Crédito
        tab.setIndex(tab_credito);

        var tab = w_tabs.add(null);
        tab.setName(getText(1507, "")); // Ctas.
        tab.setIndex(tab_cuentagrupo);

        var tab = w_tabs.add(null);
        tab.setName(getText(4790, "")); // Percep.
        tab.setIndex(tab_percepcion);

        var tab = w_tabs.add(null);
        tab.setName(getText(1171, "")); // Empresas
        tab.setIndex(tab_empresas);

        var tab = w_tabs.add(null);
        tab.setName(getText(1038, "")); // Web
        tab.setIndex(tab_web);

        var tab = w_tabs.add(null);
        tab.setName(getText(4660, "")); // CRM
        tab.setIndex(tab_crm);

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, C.CLI_NAME);
        elem.setType(T.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(255);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        var elem = properties.add(null, C.CLI_RAZONSOCIAL);
        elem.setType(T.text);
        elem.setName(getText(1178, "")); // Razon Social
        elem.setSize(255);
        elem.setKey(K_RAZONSOCIAL);
        elem.setValue(m_razonsocial);

        var elem = properties.add(null, C.CLI_CODE);
        elem.setType(T.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setSize(255);
        elem.setKey(K_CODE);
        elem.setValue(m_code);

        var elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(T.check);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVE);
        elem.setValue(Cairo.Util.boolToInt(m_active));

        var elem = properties.add(null, C.CLI_ES_PROSPECTO);
        elem.setType(T.check);
        elem.setName(getText(3952, "")); // Es un prospecto
        elem.setKey(K_ESPROSPECTO);
        elem.setValue(val(m_esProspecto));

        var elem = properties.add(null, C.CLI_CAT_FISCAL);
        elem.setType(T.list);
        elem.setName(getText(1181, "")); // Categoria Fiscal
        elem.setKey(K_CATFISCAL);
        elem.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
        elem.setListItemData(m_catFiscal);

        var list = elem.getList();

        var elem = list.add(null, C.CategoriaFiscal.consumidorFinal);
        elem.setId(C.CategoriaFiscal.consumidorFinal);
        elem.setValue(getText(1182, "")); // Consumidor final

        var elem = list.add(null, C.CategoriaFiscal.inscripto);
        elem.setId(C.CategoriaFiscal.inscripto);
        elem.setValue(getText(1184, "")); // Inscripto

        var elem = list.add(null, C.CategoriaFiscal.noInscripto);
        elem.setId(C.CategoriaFiscal.noInscripto);
        elem.setValue(getText(1183, "")); // No Inscripto

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

        var elem = properties.add(null, C.CLI_CUIT);
        elem.setType(T.text);
        elem.setName(getText(1179, "")); // Cuit
        elem.setSize(13);
        elem.setKey(K_CUIT);
        elem.setValue(m_cuit);

        var elem = properties.add(null, C.CLI_INGRESOSBRUTOS);
        elem.setType(T.text);
        elem.setName(getText(1180, "")); // Ingresos Brutos
        elem.setSize(20);
        elem.setKey(K_INGRESOSBRUTOS);
        elem.setValue(m_ingresosbrutos);

        var elem = properties.add(null, C.CLI_ID_PADRE);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CLIENTE); // Cliente Padre
        elem.setName(getText(1509, ""));
        elem.setKey(K_CLI_ID_PADRE);
        elem.setValue(m_clientePadre);
        elem.setSelectId(m_cliId_padre);
        elem.setSelectFilter(D.getCustomerFatherFilter(m_id));

        var elem = properties.add(null, C.CLI_CONTACTO);
        elem.setType(T.text);
        elem.setName(getText(1035, "")); // Contacto
        elem.setSize(100);
        elem.setKey(K_CONTACTO);
        elem.setValue(m_contacto);

        var elem = properties.add(null, C.CLI_CHEQUEORDEN);
        elem.setType(T.text);
        elem.setName(getText(1396, "")); // Cheque a la orden
        elem.setSize(100);
        elem.setKey(K_CHEQUEORDEN);
        elem.setValue(m_chequeorden);

        var elem = properties.add(null, C.CPG_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CONDICIONES_DE_PAGO);
        elem.setName(getText(1395, "")); // Condición de pago
        elem.setKey(K_CPG_ID);
        elem.setValue(m_condicionPago);
        elem.setSelectId(m_cpg_id);

        var elem = properties.add(null, C.FP_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.FORMA_DE_PAGO);
        elem.setName(getText(3773, "")); // Forma de pago
        elem.setKey(K_FP_ID);
        elem.setValue(m_formapago);
        elem.setSelectId(m_fp_id);

        var elem = properties.add(null, C.LP_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LISTAS_DE_PRECIOS);
        elem.setSelectFilter(D.getListaPrecioForCliente(NO_ID, m_id));
        elem.setName(getText(1397, "")); // Lista de precios
        elem.setKey(K_LP_ID);
        elem.setValue(m_listaPrecio);
        elem.setSelectId(m_lp_id);

        var elem = properties.add(null, C.LD_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LISTAS_DE_DESCUENTOS);
        elem.setSelectFilter(D.getListaDescuentoForCliente(NO_ID, m_id));
        elem.setName(getText(1398, "")); // Lista de descuentos
        elem.setKey(K_LD_ID);
        elem.setValue(m_listaDescuento);
        elem.setSelectId(m_ld_id);

        var elem = properties.add(null, C.VEN_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.VENDEDOR);
        elem.setName(getText(1510, "")); // Vendedor
        elem.setKey(K_VEN_ID);
        elem.setValue(m_vendedor);
        elem.setSelectId(m_ven_id);

        var elem = properties.add(null, C.TRANS_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.TRANSPORTE);
        elem.setName(getText(1050, "")); // Transporte
        elem.setKey(K_TRANS_ID);
        elem.setValue(m_transporte);
        elem.setSelectId(m_trans_id);

        var elem = properties.add(null, C.CLI_EXIGE_TRANSPORTE);
        elem.setType(T.check);
        elem.setName(getText(1511, "")); // Exige Transporte
        elem.setKey(K_EXIGETRANS);
        elem.setValue(val(m_exigeTrans));

        var elem = properties.add(null, C.CLI_EXIGE_PROVINCIA);
        elem.setType(T.check);
        elem.setName(getText(1512, "")); // Exige Provincia
        elem.setKey(K_EXIGEPROVINCIA);
        elem.setValue(val(m_exigeProvincia));

        var elem = properties.add(null, C.CLI_PCIA_TRANSPORTE);
        elem.setType(T.check);
        elem.setName(getText(1513, "")); // Tomar Pcia. desde Transporte
        elem.setKey(K_PCIATRANSPORTE);
        elem.setValue(val(m_pciaTransporte));

        var elem = properties.add(null, C.CLI_CREDITOCTA_CTE);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1399, "")); // Crédito en cta.cte.
        elem.setTabIndex(tab_credito);
        elem.setKey(K_CREDITO_CTA_CTE);
        elem.setValue(m_creditoctacte);

        var elem = properties.add(null, C.CLI_CREDITOTOTAL);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1400, "")); // Crédito Total
        elem.setTabIndex(tab_credito);
        elem.setKey(K_CREDITO_TOTAL);
        elem.setValue(m_creditototal);

        var elem = properties.add(null, C.CLI_CREDITOACTIVO);
        elem.setType(T.check);
        elem.setName(getText(1401, "")); // Crédito Activo
        elem.setTabIndex(tab_credito);
        elem.setKey(K_CREDITO_ACTIVO);
        elem.setValue(val(m_creditoactivo));

        var elem = properties.add(null, C.CLI_DESCRIP);
        elem.setType(T.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setSize(255);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);

        var elem = properties.add(null, C.CLI_CALLE);
        elem.setType(T.text);
        elem.setName(getText(1194, "")); // Calle
        elem.setTabIndex(tab_direccion);
        elem.setKey(K_CALLE);
        elem.setValue(m_calle);

        var elem = properties.add(null, C.CLI_CALLENUMERO);
        elem.setType(T.text);
        elem.setName(getText(1065, "")); // Numero
        elem.setTabIndex(tab_direccion);
        elem.setSize(10);
        elem.setKey(K_CALLENUMERO);
        elem.setValue(m_callenumero);

        var elem = properties.add(null, C.CLI_PISO);
        elem.setType(T.text);
        elem.setName(getText(1196, "")); // Piso
        elem.setTabIndex(tab_direccion);
        elem.setSize(4);
        elem.setKey(K_PISO);
        elem.setValue(m_piso);

        var elem = properties.add(null, C.CLI_DEPTO);
        elem.setType(T.text);
        elem.setName(getText(1278, "")); // Departamento
        elem.setTabIndex(tab_direccion);
        elem.setSize(4);
        elem.setKey(K_DEPTO);
        elem.setValue(m_depto);

        var elem = properties.add(null, C.CLI_CODPOSTAL);
        elem.setType(T.text);
        elem.setName(getText(1199, "")); // Codigo Postal
        elem.setTabIndex(tab_direccion);
        elem.setSize(20);
        elem.setKey(K_CODPOSTAL);
        elem.setValue(m_codpostal);

        var elem = properties.add(null, C.CPA_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CODIGOS_POSTALES);
        elem.setName(getText(4964, "")); // CPA
        elem.setTabIndex(tab_direccion);
        elem.setKey(K_CPA_ID);
        elem.setValue(m_cpaNombre);
        elem.setSelectId(m_cpa_id);

        var elem = properties.add(null, C.CLI_HORARIO_MDESDE);
        elem.setType(T.time);
        elem.setName(getText(4965, "")); // Horario desde
        elem.setTabIndex(tab_direccion);
        elem.setValue(m_horario_m_desde);
        elem.setKey(K_HORARIO_M_DESDE);

        var elem = properties.add(null, C.CLI_HORARIO_MHASTA);
        elem.setType(T.time);
        elem.setName(getText(4966, "")); // Hasta
        elem.setTabIndex(tab_direccion);
        elem.setValue(m_horario_m_hasta);
        elem.setKey(K_HORARIO_M_HASTA);

        var elem = properties.add(null, C.CLI_HORARIO_TDESDE);
        elem.setType(T.time);
        elem.setName(getText(4967, "")); // Desde
        elem.setTabIndex(tab_direccion);
        elem.setValue(m_horario_t_desde);
        elem.setKey(K_HORARIO_T_DESDE);

        var elem = properties.add(null, C.CLI_HORARIO_THASTA);
        elem.setType(T.time);
        elem.setName(getText(4966, "")); // Hasta
        elem.setTabIndex(tab_direccion);
        elem.setValue(m_horario_t_hasta);
        elem.setKey(K_HORARIO_T_HASTA);

        var elem = properties.add(null, C.CLI_LOCALIDAD);
        elem.setType(T.text);
        elem.setName(getText(1198, "")); // Localidad
        elem.setTabIndex(tab_direccion);
        elem.setSize(100);
        elem.setKey(K_LOCALIDAD);
        elem.setValue(m_localidad);

        var elem = properties.add(null, C.PRO_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PROVINCIA);
        elem.setName(getText(1080, "")); // Provincia
        elem.setTabIndex(tab_direccion);
        elem.setKey(K_PRO_ID);
        elem.setValue(m_provincia);
        elem.setSelectId(m_pro_id);

        var elem = properties.add(null, C.ZON_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.ZONA);
        elem.setName(getText(1402, "")); // Zona
        elem.setTabIndex(tab_direccion);
        elem.setKey(K_ZON_ID);
        elem.setValue(m_zona);
        elem.setSelectId(m_zon_id);

        var elem = properties.add(null, C.CLI_TEL);
        elem.setType(T.text);
        elem.setName(getText(1036, "")); // Teléfono
        elem.setTabIndex(tab_direccion);
        elem.setSize(100);
        elem.setKey(K_TEL);
        elem.setValue(m_tel);

        var elem = properties.add(null, C.CLI_FAX);
        elem.setType(T.text);
        elem.setName(getText(1200, "")); // Fax
        elem.setTabIndex(tab_direccion);
        elem.setSize(50);
        elem.setKey(K_FAX);
        elem.setValue(m_fax);

        var elem = properties.add(null, C.CLI_EMAIL);
        elem.setType(T.text);
        elem.setName(getText(1034, "")); // E-Mail
        elem.setTabIndex(tab_direccion);
        elem.setSize(100);
        elem.setKey(K_EMAIL);
        elem.setValue(m_email);

        var elem = properties.add(null, C.CLI_WEB);
        elem.setType(T.text);
        elem.setName(getText(1038, "")); // Web
        elem.setTabIndex(tab_direccion);
        elem.setSize(100);
        elem.setKey(K_WEB);
        elem.setValue(m_web);

        var elem = properties.add(null, C.CLI_MESSENGER);
        elem.setType(T.text);
        elem.setName(getText(1515, "")); // Contactos Messanger
        elem.setTabIndex(tab_direccion);
        elem.setSize(100);
        elem.setKey(K_MESSANGER);
        elem.setValue(m_messanger);

        var elem = properties.add(null, C.CLI_YAHOO);
        elem.setType(T.text);
        elem.setName(getText(1514, "")); // Contacto Yahoo
        elem.setTabIndex(tab_direccion);
        elem.setSize(100);
        elem.setKey(K_YAHOO);
        elem.setValue(m_yahoo);

        var elem = properties.add(null, C_SUCURSALES);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridSucursales(elem);
        loadSucursales(elem);
        elem.setName(C_SUCURSALES);
        elem.setKey(K_SUCURSALES);
        elem.setTabIndex(tab_sucursales);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_itemsDeletedSucursales = "";

        elem = properties.add(null, C_CONTACTO);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridContactos(elem);
        loadContactos(elem);
        elem.setName(C_CONTACTO);
        elem.setKey(K_CONTACTOS);
        elem.setTabIndex(tab_contactos);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_itemsDeletedContacto = "";

        elem = properties.add(null, C_CUENTAGRUPO);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridCuentaGrupo(elem);
        loadCuentaGrupo(elem);
        elem.setName(C_CUENTAGRUPO);
        elem.setKey(K_CUENTA_GRUPO);
        elem.setTabIndex(tab_cuentagrupo);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_itemsDeletedCuentaGrupo = "";

        elem = properties.add(null, C_PERCEPCION);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridPercepcion(elem);
        loadPercepcion(elem);
        elem.setName(C_PERCEPCION);
        elem.setKey(K_PERCEPCION);
        elem.setTabIndex(tab_percepcion);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_itemsDeletedPercepciones = "";

        elem = properties.add(null, C_EMPRESAS);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridEmpresas(elem);
        loadEmpresas(elem);
        elem.setName(C_EMPRESAS);
        elem.setKey(K_EMPRESAS);
        elem.setTabIndex(tab_empresas);
        elem.setGridAddEnabled(false);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(false);

        elem = properties.add(null, C_DPTO);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridDpto(elem);
        loadDpto(elem);
        elem.setName(C_DPTO);
        elem.setKey(K_DEPARTAMENTOS);
        elem.setTabIndex(tab_empresas);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);
        m_itemsDeletedDptos = "";

        var elem = properties.add(null, C.CLI_INF_ACTIVE);
        elem.setType(T.check);
        elem.setName(getText(1517, "")); // Habilitar el acceso via extranet
        elem.setKey(K_US_WEB);
        elem.setValue(m_us_id !== NO_ID && m_us_activo);
        elem.setTabIndex(tab_web);

        var elem = properties.add(null, C_WEB_MAIL);
        elem.setType(T.button);
        elem.setName(getText(1519, "")); // Enviar Email
        elem.setKey(K_WEB_MAIL);
        elem.setVisible(m_us_id !== NO_ID && m_us_activo);
        elem.setEnabled(m_us_id !== NO_ID && m_us_activo);
        elem.setTabIndex(tab_web);

        var elem = properties.add(null, C.CLI_INF_US_ID);
        elem.setType(T.text);
        elem.setName(getText(1518, "")); // Usuario Web
        elem.setSize(50);
        elem.setKey(K_US_NOMBRE);
        elem.setValue(m_us_nombre);
        elem.setTabIndex(tab_web);
        elem.setEnabled(m_us_id !== NO_ID && m_us_activo);

        elem = properties.add(null, C_INFORMES);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridInformes(elem);
        loadInformes(elem);
        elem.setName(C_INFORMES);
        elem.setKey(K_INFORMES);
        elem.setTabIndex(tab_web);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);
        elem.setEnabled(m_us_id !== NO_ID && m_us_activo);
        m_itemsDeletedInf = "";

        // CRM

        var elem = properties.add(null, C.CLICT_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.TIPOS_DE_CONTACTO);
        elem.setName(getText(4661, "")); // Tipo de Contacto
        elem.setKey(K_TIPO_CONTACTO);
        elem.setValue(m_contactoTipo);
        elem.setSelectId(m_clict_id);
        elem.setTabIndex(tab_crm);

        var elem = properties.add(null, C.CLI_ID_REFERIDO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CLIENTE);
        elem.setName(getText(4662, "")); // Referido por
        elem.setKey(K_REFERIDO);
        elem.setValue(m_referido);
        elem.setSelectId(m_cliId_referido);
        elem.setSelectFilter(D.getCustomerReferrerFilter(m_id));
        elem.setTabIndex(tab_crm);

        var elem = properties.add(null, C.PROY_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PROYECTO);
        elem.setName(getText(4663, "")); // Campaña de Marketing
        elem.setKey(K_PROY_ID);
        elem.setValue(m_proyecto);
        elem.setSelectId(m_proy_id);
        elem.setTabIndex(tab_crm);

        m_genericEdit.loadCollection(m_dialog);

        if(!m_dialog.show(self)) { return false; }

        return true;
      };

      //
      // grid
      //

      self.columnAfterEdit = function(key, lRow, lCol, newValue, newValueId) {
        var p = null;

        switch (key) {

          case K_INFORMES:
            var property = m_dialog.getProperties().item(C_INFORMES).getGrid().getRows();

            var preId = 0;
            var code = "";

            p = DB.getData(
              "load[" + m_apiPath + "general/informe/" + newValueId.toString() + "/info]");

            p = p.whenSuccessWithResult(function(response) {
              preId = valField(response.data, 'pre_id');
              code = valField(response.data, 'code');
              return true;
            }).then(function() {
              Dialogs.cell(property.Item(lRow), KI_PRE_ID).setId(preId);
              Dialogs.cell(property.Item(lRow), KI_INF_CODIGO).setValue(code);
              return true;
            });
            break;
        }
        return p || P.resolvedPromise(true);
      };

      self.columnBeforeEdit = function(key, lRow, lCol, iKeyAscii) {
        var rtn = false;

        switch (key) {
          case K_CUENTA_GRUPO:
            return D.colUpdateCuentaFilterForCuentaGrupo(getCtaGrupo(), lRow, lCol, m_dialog, KI_CUEG_ID, KI_CUE_ID);
            break;

          default:
            rtn = true;
            break;
        }

        return P.resolvedPromise(rtn);
      };

      self.columnButtonClick = function(key, lRow, lCol, iKeyAscii) {

      };

      self.deleteRow = function(key, row, lRow) {

        switch (key) {
          case K_SUCURSALES:
            
            var id = val(Dialogs.cell(row, KI_S_CLIS_ID).getValue());
            if(id !== NO_ID) { m_itemsDeletedSucursales = m_itemsDeletedSucursales + id.toString() + ","; }
            break;

          case K_CONTACTOS:
            
            var id = val(Dialogs.cell(row, KI_CONT_ID).getValue());
            if(id !== NO_ID) { m_itemsDeletedContacto = m_itemsDeletedContacto + id.toString() + ","; }
            break;

          case K_CUENTA_GRUPO:
            
            var id = val(Dialogs.cell(row, KI_CLICUEG_ID).getValue());
            if(id !== NO_ID) { m_itemsDeletedCuentaGrupo = m_itemsDeletedCuentaGrupo + id.toString() + ","; }
            break;

          case K_EMPRESAS:
            
            return P.resolvedPromise(false);
            break;

          case K_DEPARTAMENTOS:

            var id = val(Dialogs.cell(row, KI_DPTOCLI_ID).getValue());
            if(id !== NO_ID) { m_itemsDeletedDptos = m_itemsDeletedDptos + id.toString() + ","; }
            break;

          case K_INFORMES:

            var id = val(Dialogs.cell(row, KI_PER_ID).getValue());
            if(id !== NO_ID) { m_itemsDeletedInf = m_itemsDeletedInf + id.toString() + ","; }
            break;

          case K_PERCEPCION:

            var id = val(Dialogs.cell(row, KI_CLIPERC_ID).getValue());
            if(id !== NO_ID) { m_itemsDeletedPercepciones = m_itemsDeletedPercepciones + id.toString() + ","; }
            break;
        }

        return P.resolvedPromise(true);
      };

      self.newRow = function(key, rows) {
        return P.resolvedPromise(true);
      };

      self.validateRow = function(key, row, rowIndex) {
        var p = null;

        try {

          switch (key) {
            case K_SUCURSALES:
              p = validateRowSucursales(row, rowIndex);
              break;

            case K_CONTACTOS:
              p = validateRowContacto(row, rowIndex);
              break;

            case K_CUENTA_GRUPO:
              p = validateRowCuentaGrupo(row, rowIndex);
              break;

            case K_EMPRESAS:
              p = P.resolvedPromise(true);
              break;

            case K_DEPARTAMENTOS:
              p = validateRowDpto(row, rowIndex);
              break;

            case K_PERCEPCION:
              p = validateRowPercepcion(row, rowIndex);
              break;

            case K_INFORMES:
              p = validateRowInformes(row, rowIndex);
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.VALIDATE_ROW_FUNCTION, C_MODULE, "");
        }

        return p || P.resolvedPromise(false);
      };

      self.columnAfterUpdate = function(key, lRow, lCol) {
        return P.resolvedPromise(true);
      };

      self.columnClick = function(key, lRow, lCol) {

      };

      self.gridDblClick = function(key, lRow, lCol) {
        return P.resolvedPromise(false);
      };

      self.isEmptyRow = function(key, row, rowIndex) {
        var isEmpty = true;

        try {

          switch (key) {
            case K_SUCURSALES:
              isEmpty = isEmptyRowSuc(row, rowIndex);
              break;

            case K_CONTACTOS:
              isEmpty = isEmptyRowCont(row, rowIndex);
              break;

            case K_CUENTA_GRUPO:
              isEmpty = isEmptyRowCuentaGrupo(row, rowIndex);
              break;

            case K_EMPRESAS:
              isEmpty = false;
              break;

            case K_DEPARTAMENTOS:
              isEmpty = isEmptyRowDpto(row, rowIndex);
              break;

            case K_PERCEPCION:
              isEmpty = isEmptyRowPercepcion(row, rowIndex);
              break;

            case K_INFORMES:
              isEmpty = isEmptyRowInforme(row, rowIndex);
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, Cairo.Constants.IS_EMPTY_ROW_FUNCTION, C_MODULE, "");
        }

        return P.resolvedPromise(isEmpty);
      };

      var validateRowContacto = function(row, rowIndex) {
        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          var cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_NOMBRE:
              if(valEmpty(cell.getValue(), Types.text)) {
                return M.showInfoWithFalse(Cairo.Constants.MUST_SET_A_NAME + strRow);
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var validateRowDpto = function(row, rowIndex) {
        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          var cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_DPTO_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(1385, "", strRow));
                // Debe indicar un departamento (1)
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var validateRowPercepcion = function(row, rowIndex) {
        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          var cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_PERC_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(1535, "", strRow));
                // Debe indicar una percepción (1)
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var validateRowInformes = function(row, rowIndex) {
        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          var cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_PRE_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(1532, "", strRow));
                // Este informe no posee una prestación y por tanto no puede asociarse al cliente (1)
              }
              break;

            case KI_INF_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(1533, "", strRow));
                // Debe indicar un informe (1)
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var validateRowCuentaGrupo = function(row, rowIndex) {
        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          var cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_CUEG_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(1534, "", strRow));
                // Debe indicar un grupo de cuentas (1)
              }
              break;

            case KI_CUE_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(1261, "", strRow));
                // Debe indicar una cuenta (1)
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var loadDataFromResponse = function(response) {
        var data = response.data;

        data.informes = data.get('informes');
        data.empresas = data.get('empresas');
        data.cuentasGrupo = data.get('cuentasGrupo');
        data.percepciones = data.get('percepciones');
        data.dptos = data.get('dptos');
        data.contactos = data.get('contactos');
        data.sucursales = data.get('sucursales');
        data.additionalFields = data.get('additionalFields');

        return data;
      };
      
      var load = function(id) {

        return DB.getData("load[" + m_apiPath + "general/cliente]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            m_data = loadDataFromResponse(response);
            
            if(response.data.id !== NO_ID) {

              m_id = valField(response.data, C.CLI_ID);
              m_name = valField(response.data, C.CLI_NAME);
              m_code = valField(response.data, C.CLI_CODE);
              m_contacto = valField(response.data, C.CLI_CONTACTO);
              m_razonsocial = valField(response.data, C.CLI_RAZONSOCIAL);
              m_cuit = valField(response.data, C.CLI_CUIT);
              m_ingresosbrutos = valField(response.data, C.CLI_INGRESOSBRUTOS);
              m_catFiscal = valField(response.data, C.CLI_CAT_FISCAL);
              m_chequeorden = valField(response.data, C.CLI_CHEQUEORDEN);
              m_codpostal = valField(response.data, C.CLI_CODPOSTAL);
              m_localidad = valField(response.data, C.CLI_LOCALIDAD);
              m_calle = valField(response.data, C.CLI_CALLE);
              m_callenumero = valField(response.data, C.CLI_CALLENUMERO);
              m_piso = valField(response.data, C.CLI_PISO);
              m_depto = valField(response.data, C.CLI_DEPTO);
              m_tel = valField(response.data, C.CLI_TEL);
              m_fax = valField(response.data, C.CLI_FAX);
              m_email = valField(response.data, C.CLI_EMAIL);
              m_yahoo = valField(response.data, C.CLI_YAHOO);
              m_messanger = valField(response.data, C.CLI_MESSENGER);
              m_web = valField(response.data, C.CLI_WEB);
              m_creditoctacte = valField(response.data, C.CLI_CREDITOCTA_CTE);
              m_creditototal = valField(response.data, C.CLI_CREDITOTOTAL);
              m_creditoactivo = valField(response.data, C.CLI_CREDITOACTIVO);
              m_pro_id = valField(response.data, C.PRO_ID);
              m_zon_id = valField(response.data, C.ZON_ID);
              m_ven_id = valField(response.data, C.VEN_ID);
              m_vendedor = valField(response.data, C.VEN_NAME);
              m_trans_id = valField(response.data, C.TRANS_ID);
              m_transporte = valField(response.data, C.TRANS_NAME);
              m_exigeTrans = valField(response.data, C.CLI_EXIGE_TRANSPORTE);
              m_exigeProvincia = valField(response.data, C.CLI_EXIGE_PROVINCIA);
              m_pciaTransporte = valField(response.data, C.CLI_PCIA_TRANSPORTE);
              m_cliId_padre = valField(response.data, C.CLI_ID_PADRE);
              m_clientePadre = valField(response.data, C.CLI_NOMBRE_PADRE);
              m_provincia = valField(response.data, C.PRO_NAME);
              m_zona = valField(response.data, C.ZON_NAME);
              m_cpg_id = valField(response.data, C.CPG_ID);
              m_condicionPago = valField(response.data, C.CPG_NAME);
              m_descrip = valField(response.data, C.CLI_DESCRIP);
              m_lp_id = valField(response.data, C.LP_ID);
              m_listaPrecio = valField(response.data, C.LP_NAME);
              m_ld_id = valField(response.data, C.LD_ID);
              m_listaDescuento = valField(response.data, C.LD_NAME);

              m_clict_id = valField(response.data, C.CLICT_ID);
              m_contactoTipo = valField(response.data, C.CLICT_NAME);

              m_cliId_referido = valField(response.data, C.CLI_ID_REFERIDO);
              m_referido = valField(response.data, C.REFERIDO);
              m_proy_id = valField(response.data, C.PROY_ID);
              m_proyecto = valField(response.data, C.PROY_NAME);

              m_us_id = valField(response.data, C.CLI_INF_US_ID);
              m_us_nombre = valField(response.data, C.US_NAME);
              m_us_activo = valField(response.data, C.CLI_INF_ACTIVE);

              m_active = valField(response.data, Cairo.Constants.ACTIVE);
              m_esProspecto = valField(response.data, C.CLI_ES_PROSPECTO);

              m_cpaNombre = valField(response.data, C.CPA_CODE);
              m_cpa_id = valField(response.data, C.CPA_ID);

              m_horario_m_desde = valField(response.data, C.CLI_HORARIO_MDESDE);
              m_horario_m_hasta = valField(response.data, C.CLI_HORARIO_MHASTA);
              m_horario_t_desde = valField(response.data, C.CLI_HORARIO_TDESDE);
              m_horario_t_hasta = valField(response.data, C.CLI_HORARIO_THASTA);

              m_formapago = valField(response.data, C.FP_NAME);
              m_fp_id = valField(response.data, C.FP_ID);

            }
            else {

              m_id = NO_ID;
              m_name = "";
              m_code = "";
              m_contacto = "";
              m_razonsocial = "";
              m_cuit = "";
              m_descrip = "";
              m_ingresosbrutos = "";
              m_catFiscal = C.CategoriaFiscal.inscripto;
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
              m_yahoo = "";
              m_messanger = "";
              m_web = "";
              m_creditoctacte = 0;
              m_creditototal = 0;
              m_creditoactivo = true;
              m_pro_id = NO_ID;
              m_provincia = "";
              m_zon_id = NO_ID;
              m_zona = "";
              m_ven_id = NO_ID;
              m_vendedor = "";
              m_trans_id = NO_ID;
              m_transporte = "";
              m_cliId_padre = NO_ID;
              m_clientePadre = "";
              m_exigeTrans = false;
              m_exigeProvincia = false;
              m_pciaTransporte = false;
              m_lp_id = NO_ID;
              m_listaPrecio = "";
              m_ld_id = NO_ID;
              m_listaDescuento = "";
              m_cpg_id = NO_ID;
              m_condicionPago = "";

              m_clict_id = NO_ID;
              m_contactoTipo = "";

              m_cliId_referido = NO_ID;
              m_referido = "";
              m_proy_id = NO_ID;
              m_proyecto = "";

              m_cpaNombre = "";
              m_cpa_id = NO_ID;

              m_us_id = NO_ID;
              m_us_activo = false;
              m_us_nombre = "";

              m_horario_m_desde = Cairo.Constants.NO_DATE;
              m_horario_m_hasta = Cairo.Constants.NO_DATE;
              m_horario_t_desde = Cairo.Constants.NO_DATE;
              m_horario_t_hasta = Cairo.Constants.NO_DATE;

              m_formapago = "";
              m_fp_id = NO_ID;

              m_active = true;
              m_esProspecto = false;

            }

            if(!m_genericEdit.load(m_id)) { return false; }

            return true;
          });

      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var property = properties.item(C.CLI_NAME);
        property.setValue(m_name);

        var property = properties.item(C.CLI_RAZONSOCIAL);
        property.setValue(m_razonsocial);

        var property = properties.item(C.CLI_CODE);
        property.setValue(m_code);

        var property = properties.item(Cairo.Constants.ACTIVE);
        property.setValue(Cairo.Util.boolToInt(m_active));

        var property = properties.item(C.CLI_ES_PROSPECTO);
        property.setValue(val(m_esProspecto));

        var property = properties.item(C.CLI_CAT_FISCAL);
        property.setListItemData(m_catFiscal);

        var property = properties.item(C.CLI_CUIT);
        property.setValue(m_cuit);

        var property = properties.item(C.CLI_INGRESOSBRUTOS);
        property.setValue(m_ingresosbrutos);

        var property = properties.item(C.CLI_ID_PADRE);
        property.setValue(m_clientePadre);
        property.setSelectId(m_cliId_padre);
        property.setSelectFilter(D.getCustomerFatherFilter(m_id));

        var property = properties.item(C.CLI_CONTACTO);
        property.setValue(m_contacto);

        var property = properties.item(C.CLI_CHEQUEORDEN);
        property.setValue(m_chequeorden);

        var property = properties.item(C.CPG_ID);
        property.setValue(m_condicionPago);
        property.setSelectId(m_cpg_id);

        var property = properties.item(C.CLICT_ID);
        property.setValue(m_contactoTipo);
        property.setSelectId(m_clict_id);

        var property = properties.item(C.PROY_ID);
        property.setValue(m_proyecto);
        property.setSelectId(m_proy_id);

        var property = properties.item(C.CLI_ID_REFERIDO);
        property.setValue(m_referido);
        property.setSelectId(m_cliId_referido);

        var property = properties.item(C.LP_ID);
        property.setSelectFilter(D.getListaPrecioForCliente(NO_ID, m_id));
        property.setValue(m_listaPrecio);
        property.setSelectId(m_lp_id);

        var property = properties.item(C.LD_ID);
        property.setSelectFilter(D.getListaDescuentoForCliente(NO_ID, m_id));
        property.setValue(m_listaDescuento);
        property.setSelectId(m_ld_id);

        var property = properties.item(C.VEN_ID);
        property.setValue(m_vendedor);
        property.setSelectId(m_ven_id);

        var property = properties.item(C.TRANS_ID);
        property.setValue(m_transporte);
        property.setSelectId(m_trans_id);

        var property = properties.item(C.CLI_EXIGE_TRANSPORTE);
        property.setValue(val(m_exigeTrans));

        var property = properties.item(C.CLI_EXIGE_PROVINCIA);
        property.setValue(val(m_exigeProvincia));

        var property = properties.item(C.CLI_PCIA_TRANSPORTE);
        property.setValue(val(m_pciaTransporte));

        var property = properties.item(C.CLI_CREDITOCTA_CTE);
        property.setValue(m_creditoctacte);

        var property = properties.item(C.CLI_CREDITOTOTAL);
        property.setValue(m_creditototal);

        var property = properties.item(C.CLI_CREDITOACTIVO);
        property.setValue(val(m_creditoactivo));

        var property = properties.item(C.CLI_DESCRIP);
        property.setValue(m_descrip);

        var property = properties.item(C.CLI_CALLE);
        property.setValue(m_calle);

        var property = properties.item(C.CLI_CALLENUMERO);
        property.setValue(m_callenumero);

        var property = properties.item(C.CLI_PISO);
        property.setValue(m_piso);

        var property = properties.item(C.CLI_DEPTO);
        property.setValue(m_depto);

        var property = properties.item(C.CLI_TEL);
        property.setValue(m_tel);

        var property = properties.item(C.CLI_FAX);
        property.setValue(m_fax);

        var property = properties.item(C.CLI_EMAIL);
        property.setValue(m_email);

        var property = properties.item(C.CLI_YAHOO);
        property.setValue(m_yahoo);

        var property = properties.item(C.CLI_MESSENGER);
        property.setValue(m_messanger);

        var property = properties.item(C.CLI_WEB);
        property.setValue(m_web);

        var property = properties.item(C_WEB_MAIL);
        property.setVisible(m_us_id !== NO_ID && m_us_activo);
        property.setEnabled(m_us_id !== NO_ID && m_us_activo);

        var property = properties.item(C.CLI_CODPOSTAL);
        property.setValue(m_codpostal);

        var property = properties.item(C.CPA_ID);
        property.setValue(m_cpaNombre);
        property.setSelectId(m_cpa_id);

        var property = properties.item(C.CLI_HORARIO_MDESDE);
        property.setValue(m_horario_m_desde);

        var property = properties.item(C.CLI_HORARIO_MHASTA);
        property.setValue(m_horario_m_hasta);

        var property = properties.item(C.CLI_HORARIO_TDESDE);
        property.setValue(m_horario_t_desde);

        var property = properties.item(C.CLI_HORARIO_THASTA);
        property.setValue(m_horario_t_hasta);

        var property = properties.item(C.CLI_LOCALIDAD);
        property.setValue(m_localidad);

        var property = properties.item(C.PRO_ID);
        property.setValue(m_provincia);
        property.setSelectId(m_pro_id);

        var property = properties.item(C.ZON_ID);
        property.setValue(m_zona);
        property.setSelectId(m_zon_id);

        var property = properties.item(C_SUCURSALES);
        loadSucursales(property);
        m_itemsDeletedSucursales = "";

        var property = properties.item(C_CONTACTO);
        loadContactos(property);
        m_itemsDeletedContacto = "";

        var property = properties.item(C_CUENTAGRUPO);
        loadCuentaGrupo(property);
        m_itemsDeletedCuentaGrupo = "";

        var property = properties.item(C_PERCEPCION);
        loadPercepcion(property);
        m_itemsDeletedPercepciones = "";

        var property = properties.item(C_EMPRESAS);
        loadEmpresas(property);

        var property = properties.item(C_DPTO);
        loadDpto(property);
        m_itemsDeletedDptos = "";

        var property = properties.item(C.CLI_INF_ACTIVE);
        property.setValue(m_us_id !== NO_ID && m_us_activo);

        var property = properties.item(C.CLI_INF_US_ID);
        property.setValue(m_us_nombre);
        property.setEnabled(m_us_id !== NO_ID && m_us_activo);

        property = properties.item(C_INFORMES);
        loadInformes(property);
        m_itemsDeletedInf = "";

        m_genericEdit.refreshProperties(m_dialog);

        m_dialog.showValues(m_dialog.getProperties());

      };

      var setGridPercepcion = function(property) {

        var elem;
        var grid = property.getGrid();
        
        var columns = grid.getColumns();
        columns.clear();

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_CLIPERC_ID);

        elem = columns.add(null);
        elem.setName(getText(1223, "")); // Tipo
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PERCEPCIONTIPO);
        elem.setKey(KI_PERCT_ID);

        elem = columns.add(null);
        elem.setName(getText(1252, "")); // Percepción
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PERCEPCION);
        elem.setKey(KI_PERC_ID);

        elem = columns.add(null);
        elem.setName(getText(2532, "")); // Desde
        elem.setType(T.date);
        elem.setKey(KI_PERC_DESDE);

        elem = columns.add(null);
        elem.setName(getText(2533, "")); // Hasta
        elem.setType(T.date);
        elem.setKey(KI_PERC_HASTA);

        grid.getRows().clear();
      };

      var loadPercepcion = function(property) {
        
        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();
        
        for(var _i = 0, count = m_data.percepciones.length; _i < count; _i += 1) {

          var row = rows.add(null, getValue(m_data.percepciones[_i], C.CLI_PERC_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.percepciones[_i], C.CLI_PERC_ID));
          elem.setKey(KI_CLIPERC_ID);

          elem = row.add(null);
          elem.setValue(valField(m_data.percepciones[_i], C.PERCT_NAME));
          elem.setId(valField(m_data.percepciones[_i], C.PERCT_ID));
          elem.setKey(KI_PERCT_ID);

          elem = row.add(null);
          elem.setValue(valField(m_data.percepciones[_i], C.PERC_NAME));
          elem.setId(valField(m_data.percepciones[_i], C.PERC_ID));
          elem.setKey(KI_PERC_ID);

          elem = row.add(null);
          elem.setValue(valField(m_data.percepciones[_i], C.CLI_PERC_DESDE));
          elem.setKey(KI_PERC_DESDE);

          elem = row.add(null);
          elem.setValue(valField(m_data.percepciones[_i], C.CLI_PERC_HASTA));
          elem.setKey(KI_PERC_HASTA);

        }
      };

      var setGridDpto = function(property) {

        var elem;
        var grid = property.getGrid();

        var columns = grid.getColumns();
        columns.clear();

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_DPTOCLI_ID);
        elem = columns.add(null);
        elem.setName(getText(1278, "")); // Departamento
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.DEPARTAMENTO);
        elem.setKey(KI_DPTO_ID);

        grid.getRows().clear();
      };

      var loadDpto = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();
        
        for(var _i = 0, count = m_data.dptos.length; _i < count; _i += 1) {

          var row = rows.add(null, getValue(m_data.dptos[_i], C.DPTO_CLI_ID));

          elem = row.add(null);
          elem.setValue(valField(m_data.dptos[_i], C.DPTO_CLI_ID));
          elem.setKey(KI_DPTOCLI_ID);

          elem = row.add(null);
          elem.setValue(valField(m_data.dptos[_i], C.DPTO_NAME));
          elem.setId(getValue(m_data.dptos[_i], C.DPTO_ID));
          elem.setKey(KI_DPTO_ID);

        }
      };

      var setGridInformes = function(property) {

        var elem;
        var grid = property.getGrid();

        var columns = grid.getColumns();
        columns.clear();

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PER_ID);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setType(T.text);
        elem.setEnabled(false);
        elem.setKey(KI_INF_CODIGO);

        elem = columns.add(null);
        elem.setName(getText(1521, "")); // Informe
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.INFORMES);
        elem.setSelectFilter(Cairo.User.getId());
        elem.setKey(KI_INF_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PRE_ID);

        grid.getRows().clear();
      };

      var loadInformes = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();
        
        for(var _i = 0, count = m_data.informes.length; _i < count; _i += 1) {

          var row = rows.add(null, getValue(m_data.informes[_i], C.PER_ID));

          elem = row.add(null);
          elem.setValue(valField(m_data.informes[_i], C.PER_ID));
          elem.setKey(KI_PER_ID);

          elem = row.add(null);
          elem.setValue(valField(m_data.informes[_i], C.INF_CODE));
          elem.setKey(KI_INF_CODIGO);

          elem = row.add(null);
          elem.setValue(valField(m_data.informes[_i], C.INF_NAME));
          elem.setId(getValue(m_data.informes[_i], C.INF_ID));
          elem.setKey(KI_INF_ID);

          elem = row.add(null);
          elem.setId(valField(m_data.informes[_i], C.PRE_ID));
          elem.setKey(KI_PRE_ID);

        }
      };

      var setGridEmpresas = function(property) {

        var elem;
        var grid = property.getGrid();

        var columns = grid.getColumns();
        columns.clear();

        elem = columns.add(null);
        elem.setVisible(false);

        elem = columns.add(null);
        elem.setName(getText(1114, "")); // Empresa
        elem.setType(T.text);
        elem.setKey(KI_EMP_ID);

        elem = columns.add(null);
        elem.setType(T.check);
        elem.setKey(KI_EMPCLI_ID);

        grid.getRows().clear();
      };

      var loadEmpresas = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();
        var bSelect = m_data.empresas.length === 1;

        rows.clear();

        for(var _i = 0, count = m_data.empresas.length; _i < count; _i += 1) {

          var row = rows.add(null);

          elem = row.add(null);
          elem.setValue(getValue(m_data.empresas[_i], C.EMP_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.empresas[_i], C.EMP_NAME));
          elem.setId(getValue(m_data.empresas[_i], C.EMP_ID));
          elem.setKey(KI_EMP_ID);

          elem = row.add(null);
          if(bSelect) {
            elem.setId(1);
          }
          else {
            elem.setId(getValue(m_data.empresas[_i], C.EMP_CLI_ID));
          }
          elem.setValue(elem.getId());
          elem.setKey(KI_EMPCLI_ID);
        }
      };

      var setGridCuentaGrupo = function(property) {

        var elem;
        var grid = property.getGrid();

        var columns = grid.getColumns();
        columns.clear();

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_CLICUEG_ID);

        elem = columns.add(null);
        elem.setName(getText(1404, "")); // Grupo
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.GRUPO_DE_CUENTA);
        elem.setKey(KI_CUEG_ID);
        elem.setSelectFilter("cueg_tipo in (1,4)");
        elem.setSelectFilter(D.getCuentaGrupoFilterForCliente());

        elem = columns.add(null, C.CUE_ID);
        elem.setName(getText(1267, "")); // Cuenta
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setSelectFilter(D.getCuentaFilterForCliente());
        elem.setKey(KI_CUE_ID);

        grid.getRows().clear();
      };

      var loadCuentaGrupo = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();

        for(var _i = 0, count = m_data.cuentasGrupo.length; _i < count; _i += 1) {

          var row = rows.add(null, getValue(m_data.cuentasGrupo[_i], C.CLI_CUEG_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.cuentasGrupo[_i], C.CLI_CUEG_ID));
          elem.setKey(KI_CLICUEG_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cuentasGrupo[_i], C.CUEG_NAME));
          elem.setId(getValue(m_data.cuentasGrupo[_i], C.CUEG_ID));
          elem.setKey(KI_CUEG_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cuentasGrupo[_i], C.CUE_NAME));
          elem.setId(getValue(m_data.cuentasGrupo[_i], C.CUE_ID));
          elem.setKey(KI_CUE_ID);

        }
      };

      var setGridContactos = function(property) {

        var elem;
        var grid = property.getGrid();

        var columns = grid.getColumns();
        columns.clear();

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_CONT_ID);

        elem = columns.add(null, C.CONT_NAME);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setType(T.text);
        elem.setKey(KI_NOMBRE);

        elem = columns.add(null, C.CONT_CODE);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setType(T.text);
        elem.setKey(KI_CODIGO);

        elem = columns.add(null, C.CONT_DESCRIP);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(T.text);
        elem.setKey(KI_DESCRIP);

        elem = columns.add(null, C.CONT_TEL);
        elem.setName(getText(1036, "")); // Telefono
        elem.setType(T.text);
        elem.setKey(KI_TEL);

        elem = columns.add(null, C.CONT_CELULAR);
        elem.setName(getText(1276, "")); // Celular
        elem.setType(T.text);
        elem.setKey(KI_CELULAR);

        elem = columns.add(null, C.CONT_EMAIL);
        elem.setName(getText(1034, "")); // Email
        elem.setType(T.text);
        elem.setKey(KI_EMAIL);

        elem = columns.add(null, C.CONT_CARGO);
        elem.setName(getText(1279, "")); // Cargo
        elem.setType(T.text);
        elem.setKey(KI_CARGO);

        elem = columns.add(null, C.CONT_DIRECCION);
        elem.setName(getText(1037, "")); // Dirección
        elem.setType(T.text);
        elem.setKey(KI_DIRECCION);

        grid.getRows().clear();
      };

      var loadContactos = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();
        
        for(var _i = 0, count = m_data.contactos.length; _i < count; _i += 1) {

          var row = rows.add(null, getValue(m_data.contactos[_i], C.CONT_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.contactos[_i], C.CONT_ID));
          elem.setKey(KI_CONT_ID);

          elem = row.add(null);
          elem.setValue(valField(m_data.contactos[_i], C.CONT_NAME));
          elem.setKey(KI_NOMBRE);

          elem = row.add(null);
          elem.setValue(valField(m_data.contactos[_i], C.CONT_CODE));
          elem.setKey(KI_CODIGO);

          elem = row.add(null);
          elem.setValue(valField(m_data.contactos[_i], C.CONT_DESCRIP));
          elem.setKey(KI_DESCRIP);

          elem = row.add(null);
          elem.setValue(valField(m_data.contactos[_i], C.CONT_TEL));
          elem.setKey(KI_TEL);

          elem = row.add(null);
          elem.setValue(valField(m_data.contactos[_i], C.CONT_CELULAR));
          elem.setKey(KI_CELULAR);

          elem = row.add(null);
          elem.setValue(valField(m_data.contactos[_i], C.CONT_EMAIL));
          elem.setKey(KI_EMAIL);

          elem = row.add(null);
          elem.setValue(valField(m_data.contactos[_i], C.CONT_CARGO));
          elem.setKey(KI_CARGO);

          elem = row.add(null);
          elem.setValue(valField(m_data.contactos[_i], C.CONT_DIRECCION));
          elem.setKey(KI_DIRECCION);

        }
      };

      var setGridSucursales = function(property) {

        var elem;
        var grid = property.getGrid();

        var columns = grid.getColumns();
        columns.clear();

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_S_CLIS_ID);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setType(T.text);
        elem.setKey(KI_S_NOMBRE);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setType(T.text);
        elem.setKey(KI_S_CODIGO);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(T.text);
        elem.setKey(KI_S_DESCRIP);

        elem = columns.add(null);
        elem.setName(getText(1194, "")); // Calle
        elem.setType(T.text);
        elem.setKey(KI_S_CALLE);

        elem = columns.add(null);
        elem.setName(getText(1065, "")); // Numero
        elem.setType(T.text);
        elem.setKey(KI_S_CALLENUMERO);

        elem = columns.add(null);
        elem.setName(getText(1196, "")); // Piso
        elem.setType(T.text);
        elem.setKey(KI_S_PISO);

        elem = columns.add(null);
        elem.setName(getText(1522, "")); // Dpto.
        elem.setType(T.text);
        elem.setKey(KI_S_DEPTO);

        elem = columns.add(null);
        elem.setName(getText(1198, "")); // Localidad
        elem.setType(T.text);
        elem.setKey(KI_S_LOCALIDAD);

        elem = columns.add(null);
        elem.setName(getText(1523, "")); // Cod. Postal
        elem.setType(T.text);
        elem.setKey(KI_S_CP);

        elem = columns.add(null);
        elem.setName(getText(1080, "")); // Provincia
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PROVINCIA);
        elem.setKey(KI_S_PRO_ID);

        elem = columns.add(null);
        elem.setName(getText(1212, "")); // Pais
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PAIS);
        elem.setKey(KI_S_PA_ID);

        elem = columns.add(null);
        elem.setName(getText(1036, "")); // Telefono
        elem.setType(T.text);
        elem.setKey(KI_S_TEL);

        elem = columns.add(null);
        elem.setName(getText(1200, "")); // Fax
        elem.setType(T.text);
        elem.setKey(KI_S_FAX);

        elem = columns.add(null);
        elem.setName(getText(1034, "")); // E-Mail
        elem.setType(T.text);
        elem.setKey(KI_S_EMAIL);

        elem = columns.add(null);
        elem.setName(getText(1035, "")); // Contacto
        elem.setType(T.text);
        elem.setKey(KI_S_CONTACTO);

        elem = columns.add(null);
        elem.setName(getText(1402, "")); // Zona
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.ZONA);
        elem.setKey(KI_S_ZON_ID);

        grid.getRows().clear();
      };

      var loadSucursales = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();
        
        for(var _i = 0, count = m_data.sucursales.length; _i < count; _i += 1) {

          var row = rows.add(null, getValue(m_data.sucursales[_i], C.CLIS_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.sucursales[_i], C.CLIS_ID));
          elem.setKey(KI_S_CLIS_ID);

          elem = row.add(null);
          elem.setValue(valField(m_data.sucursales[_i], C.CLIS_NAME));
          elem.setKey(KI_S_NOMBRE);

          elem = row.add(null);
          elem.setValue(valField(m_data.sucursales[_i], C.CLIS_CODE));
          elem.setKey(KI_S_CODIGO);

          elem = row.add(null);
          elem.setValue(valField(m_data.sucursales[_i], C.CLIS_DESCRIP));
          elem.setKey(KI_S_DESCRIP);

          elem = row.add(null);
          elem.setValue(valField(m_data.sucursales[_i], C.CLIS_CALLE));
          elem.setKey(KI_S_CALLE);

          elem = row.add(null);
          elem.setValue(valField(m_data.sucursales[_i], C.CLIS_CALLENUMERO));
          elem.setKey(KI_S_CALLENUMERO);

          elem = row.add(null);
          elem.setValue(valField(m_data.sucursales[_i], C.CLIS_PISO));
          elem.setKey(KI_S_PISO);

          elem = row.add(null);
          elem.setValue(valField(m_data.sucursales[_i], C.CLIS_DEPTO));
          elem.setKey(KI_S_DEPTO);

          elem = row.add(null);
          elem.setValue(valField(m_data.sucursales[_i], C.CLIS_LOCALIDAD));
          elem.setKey(KI_S_LOCALIDAD);

          elem = row.add(null);
          elem.setValue(valField(m_data.sucursales[_i], C.CLIS_COD_POSTAL));
          elem.setKey(KI_S_CP);

          elem = row.add(null);
          elem.setValue(valField(m_data.sucursales[_i], C.PRO_NAME));
          elem.setId(valField(m_data.sucursales[_i], C.PRO_ID));
          elem.setKey(KI_S_PRO_ID);

          elem = row.add(null);
          elem.setValue(valField(m_data.sucursales[_i], C.PA_NAME));
          elem.setId(valField(m_data.sucursales[_i], C.PA_ID));
          elem.setKey(KI_S_PA_ID);

          elem = row.add(null);
          elem.setValue(valField(m_data.sucursales[_i], C.CLIS_TEL));
          elem.setKey(KI_S_TEL);

          elem = row.add(null);
          elem.setValue(valField(m_data.sucursales[_i], C.CLIS_FAX));
          elem.setKey(KI_S_FAX);

          elem = row.add(null);
          elem.setValue(valField(m_data.sucursales[_i], C.CLIS_EMAIL));
          elem.setKey(KI_S_EMAIL);

          elem = row.add(null);
          elem.setValue(valField(m_data.sucursales[_i], C.CLIS_CONTACTO));
          elem.setKey(KI_S_CONTACTO);

          elem = row.add(null);
          elem.setValue(valField(m_data.sucursales[_i], C.ZON_NAME));
          elem.setId(valField(m_data.sucursales[_i], C.ZON_ID));
          elem.setKey(KI_S_ZON_ID);

        }
      };

      var isEmptyRowSuc = function(row, rowIndex) {

        for(var _i = 0, _count = row.size(); _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KI_S_NOMBRE:
              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;

            case KI_S_CODIGO:
              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;

            case KI_S_CALLE:
              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var isEmptyRowCont = function(row, rowIndex) {

        for(var _i = 0, _count = row.size(); _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KI_NOMBRE:
              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;

            case KI_CODIGO:
              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var isEmptyRowDpto = function(row, rowIndex) {

        for(var _i = 0, _count = row.size(); _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KI_DPTO_ID:
              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var isEmptyRowPercepcion = function(row, rowIndex) {

        for(var _i = 0, _count = row.size(); _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KI_PERC_ID:
              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var isEmptyRowInforme = function(row, rowIndex) {

        for(var _i = 0, _count = row.size(); _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KI_INF_ID:
              if(!valEmpty(cell.getId(), Types.id)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var isEmptyRowCuentaGrupo = function(row, rowIndex) {

        for(var _i = 0, _count = row.size(); _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KI_CUE_ID:
              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;

            case KI_CUEG_ID:
              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var saveItemsSucursales = function(mainRegister) {
        var transaction = DB.createTransaction();
        transaction.setTable(C.CLIENTE_SUCURSAL);

        var property = m_dialog.getProperties().item(C_SUCURSALES);
        var rows = property.getGrid().getRows();

        var _count = property.getGrid().getRows().size();
        for(var _i = 0; _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();

          var fields = register.getFields();
          register.setFieldId(C.CLIS_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var _countj = row.size();
          for(var _j = 0; _j < _countj; _j++) {

            var cell = row.item(_j);
            switch (cell.getKey()) {

              case KI_S_CLIS_ID:
                if(m_copy) {
                  fields.add(C.CLIS_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(C.CLIS_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KI_S_NOMBRE:
                fields.add(C.CLIS_NAME, cell.getValue(), Types.text);
                break;

              case KI_S_CODIGO:
                fields.add(C.CLIS_CODE, (cell.getValue() !== "" ? cell.getValue() : Cairo.Constants.GET_CODE_FROM_ID), Types.text);
                break;

              case KI_S_DESCRIP:
                fields.add(C.CLIS_DESCRIP, cell.getValue(), Types.text);
                break;

              case KI_S_LOCALIDAD:
                fields.add(C.CLIS_LOCALIDAD, cell.getValue(), Types.text);
                break;

              case KI_S_CALLE:
                fields.add(C.CLIS_CALLE, cell.getValue(), Types.text);
                break;

              case KI_S_CALLENUMERO:
                fields.add(C.CLIS_CALLENUMERO, cell.getValue(), Types.text);
                break;

              case KI_S_PISO:
                fields.add(C.CLIS_PISO, cell.getValue(), Types.text);
                break;

              case KI_S_DEPTO:
                fields.add(C.CLIS_DEPTO, cell.getValue(), Types.text);
                break;

              case KI_S_TEL:
                fields.add(C.CLIS_TEL, cell.getValue(), Types.text);
                break;

              case KI_S_FAX:
                fields.add(C.CLIS_FAX, cell.getValue(), Types.text);
                break;

              case KI_S_EMAIL:
                fields.add(C.CLIS_EMAIL, cell.getValue(), Types.text);
                break;

              case KI_S_ZON_ID:
                fields.add(C.ZON_ID, cell.getId(), Types.id);
                break;

              case KI_S_PRO_ID:
                fields.add(C.PRO_ID, cell.getId(), Types.id);
                break;

              case KI_S_PA_ID:
                fields.add(C.PA_ID, cell.getId(), Types.id);
                break;

              case KI_S_CP:
                fields.add(C.CLIS_COD_POSTAL, cell.getValue(), Types.text);
                break;

              case KI_S_CONTACTO:
                fields.add(C.CLIS_CONTACTO, cell.getValue(), Types.text);
                break;
            }
          }

          fields.add(C.CLI_ID, m_id, Types.id);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedSucursales !== "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedSucursales);
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveItemsPercepcion = function(mainRegister) {
        var transaction = DB.createTransaction();
        transaction.setTable(C.CLIENTE_PERCEPCION);

        var property = m_dialog.getProperties().item(C_PERCEPCION);
        var rows = property.getGrid().getRows();

        var _count = rows.size();
        for(var _i = 0; _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();

          var fields = register.getFields();
          register.setFieldId(C.CLI_PERC_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var _countj = row.size();
          for(var _j = 0; _j < _countj; _j++) {

            var cell = row.item(_j);

            switch (cell.getKey()) {

              case KI_CLIPERC_ID:
                if(m_copy) {
                  fields.add(C.CLI_PERC_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(C.CLI_PERC_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KI_PERC_ID:
                fields.add(C.PERC_ID, cell.getId(), Types.id);
                break;

              case KI_PERC_DESDE:
                fields.add(C.CLI_PERC_DESDE, cell.getValue(), Types.date);
                break;

              case KI_PERC_HASTA:
                fields.add(C.CLI_PERC_HASTA, cell.getValue(), Types.date);
                break;
            }
          }

          fields.add(C.CLI_ID, m_id, Types.id);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedPercepciones !== "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedPercepciones);
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveItemsDpto = function(mainRegister) {
        var transaction = DB.createTransaction();
        transaction.setTable(C.DEPARTAMENTO_CLIENTE);

        var property = m_dialog.getProperties().item(C_DPTO);
        var rows = property.getGrid().getRows();

        var _count = rows.size();
        for(var _i = 0; _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();

          var fields = register.getFields();
          register.setFieldId(C.DPTO_CLI_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var _countj = row.size();
          for(var _j = 0; _j < _countj; _j++) {

            var cell = row.item(_j);
            switch (cell.getKey()) {

              case KI_DPTOCLI_ID:
                if(m_copy) {
                  fields.add(C.DPTO_CLI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(C.DPTO_CLI_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KI_DPTO_ID:
                fields.add(C.DPTO_ID, cell.getId(), Types.id);
                break;
            }
          }

          fields.add(C.CLI_ID, m_id, Types.id);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedDptos !== "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedDptos);
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveItemsInformes = function(mainRegister) {
        //
        // this is a list of reports associated to the web user
        //
        var transaction = DB.createTransaction();
        transaction.setTable(C.CLIENTE_INFORME_ITEM);

        var property = m_dialog.getProperties().item(C_INFORMES);

        var rows = property.getGrid().getRows();
        var _count = rows.size();
        for(var _i = 0; _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();

          var fields = register.getFields();
          register.setFieldId(C.CLI_INFI_ID);
          register.setId(Cairo.Constants.NEW_ID);

          fields.add(C.PRE_ID, Dialogs.cell(row, KI_PRE_ID).getId().toString(), Types.id);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedInf !== "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedInf);
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveItemsEmpresa = function(mainRegister) {
        var transaction = DB.createTransaction();
        transaction.setTable(C.EMPRESA_CLIENTE);

        var property = m_dialog.getProperties().item(C_EMPRESAS);

        var rows = property.getGrid().getRows();
        var _count = rows.size();
        for(var _i = 0; _i < _count; _i++) {

          var row = rows.item(_i);

          if(val(Dialogs.cell(row, KI_EMPCLI_ID).getId()) !== 0 ) {

            var register = new DB.Register();

            var fields = register.getFields();
            register.setFieldId(C.EMP_CLI_ID);
            register.setId(Cairo.Constants.NEW_ID);

            fields.add(C.EMP_ID, val(Dialogs.cell(row, KI_EMP_ID).getId()), Types.id);

            transaction.addRegister(register);
          }
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveItemsCuentaGrupo = function(mainRegister) {
        var transaction = DB.createTransaction();
        transaction.setTable(C.CLIENTE_CUENTA_GRUPO);

        var property = m_dialog.getProperties().item(C_CUENTAGRUPO);

        var rows = property.getGrid().getRows();
        var _count = rows.size();
        for(var _i = 0; _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();

          var fields = register.getFields();
          register.setFieldId(C.CLI_CUEG_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var _countj = row.size();
          for(var _j = 0; _j < _countj; _j++) {

            var cell = row.item(_j);

            switch (cell.getKey()) {

              case KI_CLICUEG_ID:
                if(m_copy) {
                  fields.add(C.CLI_CUEG_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(C.CLI_CUEG_ID, val(cell.getValue()), Types.integer);
                }
                break;
                break;

              case KI_CUEG_ID:
                fields.add(C.CUEG_ID, cell.getId(), Types.id);
                break;

              case KI_CUE_ID:
                fields.add(C.CUE_ID, cell.getId(), Types.id);
                break;
            }
          }

          fields.add(C.CLI_ID, m_id, Types.id);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedCuentaGrupo !== "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedCuentaGrupo);
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveItemsContacto = function(mainRegister) {
        var transaction = DB.createTransaction();
        transaction.setTable(C.CONTACTO);

        var property = m_dialog.getProperties().item(C_CONTACTO);

        var rows = property.getGrid().getRows();
        var _count = rows.size();
        for(var _i = 0; _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();

          var fields = register.getFields();
          register.setFieldId(C.CONT_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var _countj = row.size();
          for(var _j = 0; _j < _countj; _j++) {

            var cell = row.item(_j);

            switch (cell.getKey()) {

              case KI_CONT_ID:
                if(m_copy) {
                  fields.add(C.CONT_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(C.CONT_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KI_NOMBRE:
                fields.add(C.CONT_NAME, cell.getValue(), Types.text);
                break;

              case KI_CODIGO:
                fields.add(C.CONT_CODE, (cell.getValue() !== "" ? cell.getValue() : Cairo.Constants.GET_CODE_FROM_ID), Types.text);
                break;

              case KI_DESCRIP:
                fields.add(C.CONT_DESCRIP, cell.getValue(), Types.text);
                break;

              case KI_TEL:
                fields.add(C.CONT_TEL, cell.getValue(), Types.text);
                break;

              case KI_CELULAR:
                fields.add(C.CONT_CELULAR, cell.getValue(), Types.text);
                break;

              case KI_EMAIL:
                fields.add(C.CONT_EMAIL, cell.getValue(), Types.text);
                break;

              case KI_CARGO:
                fields.add(C.CONT_CARGO, cell.getValue(), Types.text);
                break;

              case KI_DIRECCION:
                fields.add(C.CONT_DIRECCION, cell.getValue(), Types.text);
                break;

              case KI_ACTIVO:
                fields.add(Cairo.Constants.ACTIVE, cell.getId(), Types.boolean);
                break;
            }
          }

          fields.add(C.CLI_ID, m_id, Types.id);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedContacto !== "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedContacto);
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var validateRowSucursales = function(row, rowIndex) {
        var cell = null;

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_S_NOMBRE:
              if(valEmpty(cell.getValue(), Types.text)) {
                cell.setValue(getText(1281, "")+ " "+ rowIndex.toString());
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var validateCuitCliente = function(cuit) {
        if(cuit.trim() !== "") {
          return D.validateNroCuit(cuit, false)
            .whenSuccess(call(D.checkCuitClienteIsNotAlreadyUsed, cuit, m_id));
        }
        else {
          var ask = false;
          var msg = "";

          switch (m_dialog.getProperties().item(C.CLI_CAT_FISCAL).getListItemData()) {
            case C.CategoriaFiscal.consumidorFinal:
              ask = false;
              break;

            case C.CategoriaFiscal.inscripto:
            case C.CategoriaFiscal.exento:
            case C.CategoriaFiscal.extranjero:
            case C.CategoriaFiscal.monotributo:
            case C.CategoriaFiscal.extranjeroIva:
            case C.CategoriaFiscal.noResponsable:
            case C.CategoriaFiscal.noResponsableExento:
            case C.CategoriaFiscal.noCategorizado:
            case C.CategoriaFiscal.inscriptoM:
              ask = true;
              break;

            default:
              ask = true;
              break;
          }

          if(ask) {
            // Para poder guardar un cliente con esta categoría fiscal "
            // deben indicar un número de CUIT. Si guarda sin el CUIT el cliente quedará inactivo.
            //
            msg = getText(1528, "") + "\\r\\n\\r\\n" + getText(1529, ""); // ¿Desea guardar los cambios de todas formas?

            return M.confirmViewYesDanger("", msg).whenSuccess(function() {
              var properties = m_dialog.getProperties();
              properties.item(Cairo.Constants.ACTIVE).setValue(0);
              m_dialog.showValue(properties.item(Cairo.Constants.ACTIVE));
              return true;
            });
          }
          else {
            return P.resolvedPromise(true);
          }
        }
      };

      var sendMailToClient = function(newUser, ask) {

        if(newUser && m_us_id !== NO_ID && m_us_activo) {

          if(m_email !== "") {

            var p = null;

            if(ask) {

              // Desea enviar un e-mail al cliente notificandole el alta de su usuario en la extranet?
              //
              p = M.confirmViewYesDefault("", getText(1530, ""));

            }
            else {
              p = P.resolvedPromise(true);
            }

            p.whenSuccess(function() {

              D.customerSendUserCredentials(m_id).then(function(resutl) {
                if(result.success) {
                  return M.showInfoWithFalse(getText(1531, "")); // El mail se envio con éxito
                }
                else {
                  return M.showInfoWithFalse(getText(1542, "")); // El mail falló
                }
              });
            });
          }
        }
      };

      var getCtaGrupo = function() {
        return m_dialog.getProperties().item(C_CUENTAGRUPO);
      };

      var initialize = function() {
        try {
          m_genericEdit = Cairo.GenericEdit.Edit.Controller.getEditor();
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "initialize", C_MODULE, "");
        }
      };

      var destroy = function() {
        m_genericEdit.destroy();
        m_genericEdit = null;
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

      initialize();

      return self;
    };

    Edit.Controller = { getEditor: createObject };

    Edit.Controller.edit = function(id) {
      var editor = Cairo.Cliente.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit(id);
    };

  });

  Cairo.module("Cliente.List", function(List, Cairo, Backbone, Marionette, $, _) {
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

          var editors = Cairo.Editors.clienteEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.clienteEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Clientes",
            entityName: "cliente",
            entitiesName: "clientes"
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
              var editor = Cairo.Cliente.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_CLIENTE)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            return Cairo.Database.destroy(m_apiPath + "general/cliente", id, Cairo.Constants.DELETE_FUNCTION, "Cliente").whenSuccess(
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
          Cairo.LoadingMessage.show("Clientes", "Loading Clientes from CrowSoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ clienteTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.CLIENTE,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.clienteTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("Clientes", "clienteTreeRegion", "#general/clientes", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });

}());