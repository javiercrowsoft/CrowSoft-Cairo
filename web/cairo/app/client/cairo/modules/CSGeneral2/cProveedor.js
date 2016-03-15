(function() {
  "use strict";

  Cairo.module("Proveedor.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

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

      var C_MODULE = "cProveedor";

      var C_RETENCION = "retencion";
      var C_CUENTAGRUPO = "CuentaGrupo";
      var C_CAIS = "CAIS";
      var C_EMPRESAS = "Empresas";
      var C_DPTO = "Departamentos";
      var C_CCOS = "Centros de Costo";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_DESCRIP = 3;
      var K_CONTACTO = 4;
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
      var K_IMPRIMETICKET = 24;
      var K_CAIS = 26;
      var K_LP_ID = 27;
      var K_LD_ID = 28;
      var K_CUENTA_GRUPO = 34;
      var K_RETENCION = 35;
      var K_EMPRESAS = 36;
      var K_DEPARTAMENTOS = 37;
      var K_CENTROS_DE_COSTO = 56;

      var K_CREDITO_CTA_CTE = 38;
      var K_CREDITO_TOTAL = 39;
      var K_CREDITO_ACTIVO = 40;

      var K_BANCO = 41;
      var K_NROCTA = 42;
      var K_CBU = 43;
      var K_NROCLIENTE = 44;

      var K_HORARIO_M_DESDE = 52;
      var K_HORARIO_M_HASTA = 53;
      var K_HORARIO_T_DESDE = 54;
      var K_HORARIO_T_HASTA = 55;

      var KI_PROVC_ID = 1;
      var KI_NUMERO = 2;
      var KI_DESCRIP = 3;
      var KI_FECHAVTO = 4;
      var KI_ACTIVO = 6;
      var KI_SUCURSAL = 7;

      var KI_CUEG_ID = 2;
      var KI_PROVCUEG_ID = 3;
      var KI_CUE_ID = 4;

      var KI_PROVRET_ID = 1;
      var KI_RETT_ID = 2;
      var KI_RET_ID = 3;
      var KI_RET_DESDE = 4;
      var KI_RET_HASTA = 5;

      var KI_EMPPROV_ID = 1;
      var KI_EMP_ID = 2;

      var KI_DPTOPROV_ID = 1;
      var KI_DPTO_ID = 2;

      var KI_PROVCCOS_ID = 1;
      var KI_CCOS_ID = 2;
      var KI_PR_ID = 3;

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
      var m_localidad = "";
      var m_calle = "";
      var m_callenumero = "";
      var m_piso = "";
      var m_depto = "";
      var m_tel = "";
      var m_fax = "";
      var m_email = "";
      var m_web = "";
      var m_pro_id = 0;
      var m_zon_id = 0;
      var m_cpg_id = 0;
      var m_condicionPago = "";
      var m_provincia = "";
      var m_zona = "";
      var m_active;
      var m_imprimeTicket;
      var m_lp_id = 0;
      var m_listaPrecio = "";
      var m_ld_id = 0;
      var m_listaDescuento = "";

      var m_nroctabanco = "";
      var m_banco = "";
      var m_cbu = "";
      var m_nrocliente = "";

      var m_horario_m_desde = null;
      var m_horario_m_hasta = null;
      var m_horario_t_desde = null;
      var m_horario_t_hasta = null;

      var m_creditoctacte = 0;
      var m_creditototal = 0;
      var m_creditoactivo;

      var m_editing;

      var m_dialog;
      var m_listController = null;

      var m_isNew;

      var m_branchId = 0;
      var m_treeId = 0;

      var m_copy;

      var m_itemsDeletedCAIS = "";
      var m_itemsDeletedCuentaGrupo = "";
      var m_itemsDeletedRetenciones = "";
      var m_itemsDeletedDptos = "";
      var m_itemsDeletedCcos = "";

      var m_genericEdit;

      var m_apiPath = DB.getAPIVersion();

      var emptyData = {
        cais: [],
        empresas: [],
        cuentasGrupo: [],
        retenciones: [],
        dptos: [],
        centrosCosto: [],
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

        var property = m_dialog.getProperties().item(C.PROV_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(C.PROV_CODE));

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
        var _rtn = null;
        try {

          if(m_id === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(C.PROVEEDOR);
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

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_PROVEEDOR);
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
        return P.resolvedPromise(false);
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.PROV_ID);
        register.setTable(C.PROVEEDOR);

        register.setPath(m_apiPath + "general/proveedor");

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
              fields.add(C.PROV_NAME, property.getValue(), Types.text);
              break;

            case K_CODE:
              fields.add(C.PROV_CODE, property.getValue(), Types.text);
              break;

            case K_DESCRIP:
              fields.add(C.PROV_DESCRIP, property.getValue(), Types.text);
              break;

            case K_CPG_ID:
              fields.add(C.CPG_ID, property.getSelectId(), Types.id);
              break;

            case K_CONTACTO:
              fields.add(C.PROV_CONTACTO, property.getValue(), Types.text);
              break;

            case K_RAZONSOCIAL:
              fields.add(C.PROV_RAZONSOCIAL, property.getValue(), Types.text);
              break;

            case K_CUIT:
              fields.add(C.PROV_CUIT, property.getValue(), Types.text);
              break;

            case K_INGRESOSBRUTOS:
              fields.add(C.PROV_INGRESOSBRUTOS, property.getValue(), Types.text);
              break;

            case K_CATFISCAL:
              fields.add(C.PROV_CAT_FISCAL, property.getListItemData(), Types.integer);
              break;

            case K_CHEQUEORDEN:
              fields.add(C.PROV_CHEQUEORDEN, property.getValue(), Types.text);
              break;

            case K_CODPOSTAL:
              fields.add(C.PROV_CODPOSTAL, property.getValue(), Types.text);
              break;

            case K_LOCALIDAD:
              fields.add(C.PROV_LOCALIDAD, property.getValue(), Types.text);
              break;

            case K_CALLE:
              fields.add(C.PROV_CALLE, property.getValue(), Types.text);
              break;

            case K_CALLENUMERO:
              fields.add(C.PROV_CALLENUMERO, property.getValue(), Types.text);
              break;

            case K_PISO:
              fields.add(C.PROV_PISO, property.getValue(), Types.text);
              break;

            case K_DEPTO:
              fields.add(C.PROV_DEPTO, property.getValue(), Types.text);
              break;

            case K_TEL:
              fields.add(C.PROV_TEL, property.getValue(), Types.text);
              break;

            case K_FAX:
              fields.add(C.PROV_FAX, property.getValue(), Types.text);
              break;

            case K_EMAIL:
              fields.add(C.PROV_EMAIL, property.getValue(), Types.text);
              break;

            case K_WEB:
              fields.add(C.PROV_WEB, property.getValue(), Types.text);
              break;

            case K_PRO_ID:
              fields.add(C.PRO_ID, property.getSelectId(), Types.id);
              break;

            case K_ZON_ID:
              fields.add(C.ZON_ID, property.getSelectId(), Types.id);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, property.getValue(), Types.boolean);
              break;

            case K_IMPRIMETICKET:
              fields.add(C.PROV_IMPRIME_TICKET, property.getValue(), Types.boolean);
              break;

            case K_LP_ID:
              fields.add(C.LP_ID, property.getSelectId(), Types.id);
              break;

            case K_LD_ID:
              fields.add(C.LD_ID, property.getSelectId(), Types.id);
              break;

            case K_CREDITO_CTA_CTE:
              fields.add(C.PROV_CREDITOCTA_CTE, property.getValue(), Types.currency);
              break;

            case K_CREDITO_TOTAL:
              fields.add(C.PROV_CREDITOTOTAL, property.getValue(), Types.currency);
              break;

            case K_CREDITO_ACTIVO:
              fields.add(C.PROV_CREDITOACTIVO, property.getValue(), Types.boolean);
              break;

            case K_BANCO:
              fields.add(C.PROV_BANCO, property.getValue(), Types.text);
              break;

            case K_NROCTA:
              fields.add(C.PROV_NRO_CTA_BANCO, property.getValue(), Types.text);
              break;

            case K_CBU:
              fields.add(C.PROV_CBU, property.getValue(), Types.text);
              break;

            case K_NROCLIENTE:
              fields.add(C.PROV_NRO_CLIENTE, property.getValue(), Types.text);
              break;

            case K_HORARIO_M_DESDE:
              fields.add(C.PROV_HORARIO_MDESDE, property.getValue(), Types.date);
              break;

            case K_HORARIO_M_HASTA:
              fields.add(C.PROV_HORARIO_MHASTA, property.getValue(), Types.date);
              break;

            case K_HORARIO_T_DESDE:
              fields.add(C.PROV_HORARIO_TDESDE, property.getValue(), Types.date);
              break;

            case K_HORARIO_T_HASTA:
              fields.add(C.PROV_HORARIO_THASTA, property.getValue(), Types.date);
              break;
          }
        }

        m_genericEdit.save(m_dialog, register);

        // save items

        saveItemsCAIS(register);
        saveItemsCuentaGrupo(register);
        saveItemsRetencion(register);
        saveItemsEmpresa(register);
        saveItemsDpto(register);
        saveItemsCentrosCosto(register);

        return DB.saveTransaction(
            register,
            false,
            C.PROV_CODE,
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            getText(1377, "") // Error al grabar el proveedor

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
        return "#general/proveedor/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "proveedor" + id;
      };

      self.getTitle = function() {
        return getText(1302, ""); // Proveedores
      };

      self.validate = function() {

        var p = null;
        var property;
        var propertyCBU;
        var creditoCC = 0;
        var creditoTotal = 0;
        var name = "";

        var _count = m_dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {
          
          property = m_dialog.getProperties().item(_i);
          
          switch (property.getKey()) {
            case K_NAME:
              if(valEmpty(property.getValue(), Types.text)) {
                return M.showInfoWithFalse(Cairo.Constants.MUST_SET_A_NAME);
              }
              else {
                name = property.getValue();
              }
              break;

            case K_CODE:
              if(valEmpty(property.getValue(), Types.text)) {
                property.setValue(Cairo.Constants.GET_CODE_FROM_ID);
              }
              break;

            case K_RAZONSOCIAL:
              if(valEmpty(property.getValue(), Types.text)) {
                property.setValue(name);
              }
              break;

            case K_CATFISCAL:
              if(valEmpty(property.getListItemData(), Types.integer)) {
                return M.showInfoWithFalse(getText(1174, "")); // Debe indicar una categoría fiscal
              }
              break;

            case K_CREDITO_CTA_CTE:
              creditoCC = val(property.getValue());
              break;

            case K_CREDITO_TOTAL:
              creditoTotal = val(property.getValue());
              break;

            case K_CBU:
              propertyCBU = property;
              break;
          }
        }

        if(creditoCC > creditoTotal) {
          return M.showInfoWithFalse(getText(1380, ""));
          // El crédito en cuenta corriente no puede ser mayor que el crédito total
        }

        if(propertyCBU.getValue() !== "") {
          if(!validateCBU(propertyCBU.getValue())) {
            p = M.confirmViewYesDanger("", getText(4714, ""));
          }
        }

        var cuit = m_dialog.getProperties().item(C.PROV_CUIT).getValue().trim();

        p = p || P.resolvedPromise(true);

        return p
          .whenSuccess(call(validateCuitProveedor, cuit))
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
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_PROVEEDOR);
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

      var validateAccessNewEdit = function(id) {
        if(id === NO_ID) {
          m_isNew = true;
          if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_PROVEEDOR)) { return false; }
        }
        else {
          m_isNew = false;
          if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_PROVEEDOR)) { return false; }
        }
        return true;
      };

      var loadCollection = function() {

        var tab_general = 0;
        var tab_direccion = 1;
        var tab_cais = 2;
        var tab_cuentagrupo = 3;
        var tab_credito = 4;
        var tab_retencion = 5;
        var tab_empresas = 6;
        var tab_dpto = 7;
        var tab_ccos = 8;

        var w_tabs = m_dialog.getTabs();

        w_tabs.clear();

        var tab = w_tabs.add(null);
        tab.setName(Cairo.Constants.TAB_GENERAL);

        var tab = w_tabs.add(null);
        tab.setName(getText(1037, "")); // Dirección
        tab.setIndex(tab_direccion);

        var tab = w_tabs.add(null);
        tab.setName(getText(1390, "")); // CAIS
        tab.setIndex(tab_cais);

        var tab = w_tabs.add(null);
        tab.setName(getText(1391, "")); // Grupos de Ctas.
        tab.setIndex(tab_cuentagrupo);

        var tab = w_tabs.add(null);
        tab.setName(getText(1392, "")); // Crédito
        tab.setIndex(tab_credito);

        var tab = w_tabs.add(null);
        tab.setName(getText(1393, "")); // Retenciones
        tab.setIndex(tab_retencion);

        var tab = w_tabs.add(null);
        tab.setName(getText(1171, "")); // Empresas
        tab.setIndex(tab_empresas);

        var tab = w_tabs.add(null);
        tab.setName(getText(1508, "")); // Deptos.
        tab.setIndex(tab_dpto);

        var tab = w_tabs.add(null);
        tab.setName(getText(4602, "")); // Centros de Costo
        tab.setIndex(tab_ccos);

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, C.PROV_NAME);
        elem.setType(T.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(255);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        var elem = properties.add(null, C.PROV_RAZONSOCIAL);
        elem.setName(getText(1178, "")); // Razon Social
        elem.setType(T.text);
        elem.setSize(255);
        elem.setKey(K_RAZONSOCIAL);
        elem.setValue(m_razonsocial);

        var elem = properties.add(null, C.PROV_CODE);
        elem.setType(T.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setSize(20);
        elem.setKey(K_CODE);
        elem.setValue(m_code);

        var elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(T.check);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVE);
        elem.setValue(Cairo.Util.boolToInt(m_active));

        var elem = properties.add(null, C.PROV_IMPRIME_TICKET);
        elem.setType(T.check);
        elem.setName(getText(1394, "")); // Imprime Ticket
        elem.setKey(K_IMPRIMETICKET);
        elem.setValue(val(m_imprimeTicket));

        var elem = properties.add(null, C.PROV_CONTACTO);
        elem.setType(T.text);
        elem.setName(getText(1035, "")); // Contacto
        elem.setSize(30);
        elem.setKey(K_CONTACTO);
        elem.setValue(m_contacto);

        var elem = properties.add(null, C.LP_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LISTAS_DE_PRECIOS);
        elem.setSelectFilter(D.getListaPrecioForProveedor(NO_ID, m_id));
        elem.setName(getText(1397, "")); // Lista de precios
        elem.setKey(K_LP_ID);
        elem.setValue(m_listaPrecio);
        elem.setSelectId(m_lp_id);

        var elem = properties.add(null, C.PROV_CAT_FISCAL);
        elem.setType(T.list);
        elem.setName(getText(1181, "")); // Categoria Fiscal
        elem.setKey(K_CATFISCAL);
        elem.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
        elem.setListItemData(m_catFiscal);

        var list = elem.getList();

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

        var elem = properties.add(null, C.PROV_CUIT);
        elem.setType(T.text);
        elem.setName(getText(1179, "")); // Cuit
        elem.setSize(13);
        elem.setKey(K_CUIT);
        elem.setValue(m_cuit);

        var elem = properties.add(null, C.PROV_INGRESOSBRUTOS);
        elem.setType(T.text);
        elem.setName(getText(1180, "")); // Ingresos Brutos
        elem.setSize(20);
        elem.setKey(K_INGRESOSBRUTOS);
        elem.setValue(m_ingresosbrutos);

        var elem = properties.add(null, C.LD_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LISTAS_DE_DESCUENTOS);
        elem.setName(getText(1398, "")); // Lista de descuentos
        elem.setKey(K_LD_ID);
        elem.setSelectFilter(D.getListaDescuentoForProveedor(NO_ID, m_id));
        elem.setValue(m_listaDescuento);
        elem.setSelectId(m_ld_id);

        var elem = properties.add(null, C.CPG_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CONDICIONES_DE_PAGO);
        elem.setName(getText(1395, "")); // Condición de pago
        elem.setKey(K_CPG_ID);
        elem.setValue(m_condicionPago);
        elem.setSelectId(m_cpg_id);

        var elem = properties.add(null, C.PROV_CHEQUEORDEN);
        elem.setType(T.text);
        elem.setName(getText(1396, "")); // Cheque a la orden
        elem.setSize(100);
        elem.setKey(K_CHEQUEORDEN);
        elem.setValue(m_chequeorden);

        var elem = properties.add(null, C.PROV_BANCO);
        elem.setType(T.text);
        elem.setName(getText(1122, "")); // Banco
        elem.setSize(100);
        elem.setKey(K_BANCO);
        elem.setValue(m_banco);

        var elem = properties.add(null, C.PROV_NRO_CTA_BANCO);
        elem.setType(T.text);
        elem.setName(getText(4710, "")); // Cuenta Bancaria
        elem.setSize(255);
        elem.setKey(K_NROCTA);
        elem.setValue(m_nroctabanco);

        var elem = properties.add(null, C.PROV_CBU);
        elem.setType(T.text);
        elem.setName(getText(4711, "")); // CBU
        elem.setSize(100);
        elem.setKey(K_CBU);
        elem.setValue(m_cbu);

        var elem = properties.add(null, C.PROV_NRO_CLIENTE);
        elem.setType(T.text);
        elem.setName(getText(4715, "")); // Nro. de Cliente
        elem.setSize(100);
        elem.setKey(K_NROCLIENTE);
        elem.setValue(m_nrocliente);

        var elem = properties.add(null, C.PROV_CREDITOCTA_CTE);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1399, "")); // Crédito en Cta.Cte.
        elem.setTabIndex(tab_credito);
        elem.setKey(K_CREDITO_CTA_CTE);
        elem.setValue(m_creditoctacte);

        var elem = properties.add(null, C.PROV_CREDITOTOTAL);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1400, "")); // Crédito Total
        elem.setTabIndex(tab_credito);
        elem.setKey(K_CREDITO_TOTAL);
        elem.setValue(m_creditototal);

        var elem = properties.add(null, C.PROV_CREDITOACTIVO);
        elem.setType(T.check);
        elem.setName(getText(1401, "")); // Crédito Activo
        elem.setTabIndex(tab_credito);
        elem.setKey(K_CREDITO_ACTIVO);
        elem.setValue(val(m_creditoactivo));

        var elem = properties.add(null, C.PROV_DESCRIP);
        elem.setType(T.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setSize(255);

        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);

        var elem = properties.add(null, C.PROV_CALLE);
        elem.setType(T.text);
        elem.setName(getText(1194, "")); // Calle
        elem.setTabIndex(tab_direccion);
        elem.setKey(K_CALLE);
        elem.setValue(m_calle);

        var elem = properties.add(null, C.PROV_CALLENUMERO);
        elem.setType(T.text);
        elem.setName(getText(1065, "")); // Número
        elem.setTabIndex(tab_direccion);
        elem.setSize(10);
        elem.setKey(K_CALLENUMERO);
        elem.setValue(m_callenumero);

        var elem = properties.add(null, C.PROV_PISO);
        elem.setType(T.text);
        elem.setName(getText(1196, "")); // Piso
        elem.setTabIndex(tab_direccion);
        elem.setSize(4);
        elem.setKey(K_PISO);
        elem.setValue(m_piso);

        var elem = properties.add(null, C.PROV_DEPTO);
        elem.setType(T.text);
        elem.setName(getText(1278, "")); // Departamento
        elem.setTabIndex(tab_direccion);
        elem.setSize(4);
        elem.setKey(K_DEPTO);
        elem.setValue(m_depto);

        var elem = properties.add(null, C.PROV_CODPOSTAL);
        elem.setType(T.text);
        elem.setName(getText(1199, "")); // Codigo Postal
        elem.setTabIndex(tab_direccion);
        elem.setSize(20);
        elem.setKey(K_CODPOSTAL);
        elem.setValue(m_codpostal);

        var elem = properties.add(null, C.PROV_LOCALIDAD);
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

        var elem = properties.add(null, C.PROV_HORARIO_MDESDE);
        elem.setType(T.time);
        elem.setName(getText(4965, "")); // Horario desde
        elem.setTabIndex(tab_direccion);
        elem.setValue(m_horario_m_desde);
        elem.setKey(K_HORARIO_M_DESDE);

        var elem = properties.add(null, C.PROV_HORARIO_MHASTA);
        elem.setType(T.time);
        elem.setName(getText(4966, "")); // Hasta
        elem.setTabIndex(tab_direccion);
        elem.setValue(m_horario_m_hasta);
        elem.setKey(K_HORARIO_M_HASTA);

        var elem = properties.add(null, C.PROV_HORARIO_TDESDE);
        elem.setType(T.time);
        elem.setName(getText(4967, "")); // Desde
        elem.setTabIndex(tab_direccion);
        elem.setValue(m_horario_t_desde);
        elem.setKey(K_HORARIO_T_DESDE);

        var elem = properties.add(null, C.PROV_HORARIO_THASTA);
        elem.setType(T.time);
        elem.setName(getText(4966, "")); // Hasta
        elem.setTabIndex(tab_direccion);
        elem.setValue(m_horario_t_hasta);
        elem.setKey(K_HORARIO_T_HASTA);

        var elem = properties.add(null, C.PROV_TEL);
        elem.setType(T.text);
        elem.setName(getText(1036, "")); // Teléfono
        elem.setTabIndex(tab_direccion);
        elem.setSize(100);
        elem.setKey(K_TEL);
        elem.setValue(m_tel);

        var elem = properties.add(null, C.PROV_FAX);
        elem.setType(T.text);
        elem.setName(getText(1200, "")); // Fax
        elem.setTabIndex(tab_direccion);
        elem.setSize(50);
        elem.setKey(K_FAX);
        elem.setValue(m_fax);

        var elem = properties.add(null, C.PROV_EMAIL);
        elem.setType(T.text);
        elem.setName(getText(1034, "")); // E-Mail
        elem.setTabIndex(tab_direccion);
        elem.setSize(100);
        elem.setKey(K_EMAIL);
        elem.setValue(m_email);

        var elem = properties.add(null, C.PROV_WEB);
        elem.setType(T.text);
        elem.setName(getText(1038, "")); // Web
        elem.setTabIndex(tab_direccion);
        elem.setSize(100);
        elem.setKey(K_WEB);
        elem.setValue(m_web);

        var elem = properties.add(null, C_CAIS);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridCAIs(elem);
        loadCAI(elem);
        elem.setName(C_CAIS);
        elem.setKey(K_CAIS);
        elem.setTabIndex(tab_cais);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_itemsDeletedCAIS = "";

        elem = properties.add(null, C_CUENTAGRUPO);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridCuentasGrupo(elem);
        loadCuentasGrupo(elem);
        elem.setName(C_CUENTAGRUPO);
        elem.setKey(K_CUENTA_GRUPO);
        elem.setTabIndex(tab_cuentagrupo);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_itemsDeletedCuentaGrupo = "";

        elem = properties.add(null, C_RETENCION);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridRetenciones(elem);
        loadRetenciones(elem);
        elem.setName(C_RETENCION);
        elem.setKey(K_RETENCION);
        elem.setTabIndex(tab_retencion);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_itemsDeletedRetenciones = "";

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
        setGridDepartamentos(elem);
        loadDepartamentos(elem);
        elem.setName(C_DPTO);
        elem.setKey(K_DEPARTAMENTOS);
        elem.setTabIndex(tab_dpto);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_itemsDeletedDptos = "";

        elem = properties.add(null, C_CCOS);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridCentrosCosto(elem);
        loadCentrosCosto(elem);
        elem.setName(C_CCOS);
        elem.setKey(K_CENTROS_DE_COSTO);
        elem.setTabIndex(tab_ccos);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_itemsDeletedCcos = "";

        m_genericEdit.loadCollection(m_dialog);

        if(!m_dialog.show(self)) { return false; }

        return true;
      };
      
      //
      // grid
      //

      self.columnAfterEdit = function(key, lRow, lCol, newValue, newValueId) {
        return P.resolvedPromise(true);
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
          case K_CAIS:

            var id = val(Dialogs.cell(row, KI_PROVC_ID).getValue());
            if(id !== NO_ID) { m_itemsDeletedCAIS = m_itemsDeletedCAIS + id.toString() + ","; }
            break;

          case K_CUENTA_GRUPO:

            var id = val(Dialogs.cell(row, KI_PROVCUEG_ID).getValue());
            if(id !== NO_ID) { m_itemsDeletedCuentaGrupo = m_itemsDeletedCuentaGrupo + id.toString() + ","; }
            break;

          case K_EMPRESAS:

            return P.resolvedPromise(false);
            break;

          case K_DEPARTAMENTOS:

            var id = val(Dialogs.cell(row, KI_DPTOPROV_ID).getValue());
            if(id !== NO_ID) { m_itemsDeletedDptos = m_itemsDeletedDptos+ id.toString() + ","; }
            break;

          case K_CENTROS_DE_COSTO:

            var id = val(Dialogs.cell(row, KI_PROVCCOS_ID).getValue());
            if(id !== NO_ID) { m_itemsDeletedCcos = m_itemsDeletedCcos+ id.toString() + ","; }
            break;

          case K_RETENCION:

            var id = val(Dialogs.cell(row, KI_PROVRET_ID).getValue());
            if(id !== NO_ID) { m_itemsDeletedRetenciones = m_itemsDeletedRetenciones + id.toString() + ","; }
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
            case K_CAIS:
              p = validateRowCAIs(row, rowIndex);
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

            case K_CENTROS_DE_COSTO:
              p = validateRowCcos(row, rowIndex);
              break;

            case K_RETENCION:
              p = validateRowRetencion(row, rowIndex);
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
            case K_CAIS:
              isEmpty = isEmptyRowCai(row, rowIndex);
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

            case K_CENTROS_DE_COSTO:
              isEmpty = isEmptyRowCcos(row, rowIndex);
              break;

            case K_RETENCION:
              isEmpty = isEmptyRowRetencion(row, rowIndex);
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, Cairo.Constants.IS_EMPTY_ROW_FUNCTION, C_MODULE, "");
        }

        return P.resolvedPromise(isEmpty);
      };

      var validateRowDpto = function(row, rowIndex) {
        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          var cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_DPTO_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(1385, "", strRow)); // Debe indicar un departamento
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var validateRowCcos = function(row, rowIndex) {
        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          var cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_CCOS_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(4603, "", strRow)); // Debe indicar un centro de costo
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var validateRowRetencion = function(row, rowIndex) {
        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          var cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_RET_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(1386, "", strRow)); // Debe indicar una retención (1)
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
                return M.showInfoWithFalse(getText(1387, "", strRow)); // Debe indicar un Grupo de Cuenta (1)
              }
              break;

            case KI_CUE_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(1388, "", strRow)); // Debe indicar una Cuenta (1)
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var validateRowCAIs = function(row, rowIndex) {
        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          var cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_NUMERO:
              if(valEmpty(cell.getValue(), Types.text)) {
                return M.showInfoWithFalse(getText(1383, "", strRow)); // Debe indicar un número de CAI (1)
              }
              break;

            case KI_FECHAVTO:
              if(valEmpty(cell.getValue(), Types.date) || cell.getValue() === "") {
                return M.showInfoWithFalse(getText(1384, "", strRow)); // Debe indicar una fecha de vencimiento (1)
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var loadDataFromResponse = function(response) {
        var data = response.data;

        data.cais = data.get('cais');
        data.empresas = data.get('empresas');
        data.cuentasGrupo = data.get('cuentasGrupo');
        data.retenciones = data.get('retenciones');
        data.dptos = data.get('dptos');
        data.centrosCosto = data.get('centrosCosto');
        data.additionalFields = data.get('additionalFields');

        return data;
      };

      var load = function(id) {

        return DB.getData("load[" + m_apiPath + "general/proveedor]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            m_data = loadDataFromResponse(response);

            if(response.data.id !== NO_ID) {

              m_id = valField(response.data, C.PROV_ID);
              m_name = valField(response.data, C.PROV_NAME);
              m_code = valField(response.data, C.PROV_CODE);
              m_active = valField(response.data, Cairo.Constants.ACTIVE);
              m_contacto = valField(response.data, C.PROV_CONTACTO);
              m_descrip = valField(response.data, C.PROV_DESCRIP);
              m_cpg_id = valField(response.data, C.CPG_ID);
              m_condicionPago = valField(response.data, C.CPG_NAME);
              m_razonsocial = valField(response.data, C.PROV_RAZONSOCIAL);
              m_cuit = valField(response.data, C.PROV_CUIT);
              m_ingresosbrutos = valField(response.data, C.PROV_INGRESOSBRUTOS);
              m_catFiscal = valField(response.data, C.PROV_CAT_FISCAL);
              m_chequeorden = valField(response.data, C.PROV_CHEQUEORDEN);
              m_codpostal = valField(response.data, C.PROV_CODPOSTAL);
              m_localidad = valField(response.data, C.PROV_LOCALIDAD);
              m_calle = valField(response.data, C.PROV_CALLE);
              m_callenumero = valField(response.data, C.PROV_CALLENUMERO);
              m_piso = valField(response.data, C.PROV_PISO);
              m_depto = valField(response.data, C.PROV_DEPTO);
              m_tel = valField(response.data, C.PROV_TEL);
              m_fax = valField(response.data, C.PROV_FAX);
              m_email = valField(response.data, C.PROV_EMAIL);
              m_web = valField(response.data, C.PROV_WEB);
              m_pro_id = valField(response.data, C.PRO_ID);
              m_zon_id = valField(response.data, C.ZON_ID);
              m_provincia = valField(response.data, C.PRO_NAME);
              m_zona = valField(response.data, C.ZON_NAME);
              m_creditoctacte = valField(response.data, C.PROV_CREDITOCTA_CTE);
              m_creditototal = valField(response.data, C.PROV_CREDITOTOTAL);
              m_creditoactivo = valField(response.data, C.PROV_CREDITOACTIVO);
              m_imprimeTicket = valField(response.data, C.PROV_IMPRIME_TICKET);
              m_lp_id = valField(response.data, C.LP_ID);
              m_listaPrecio = valField(response.data, C.LP_NAME);
              m_ld_id = valField(response.data, C.LD_ID);
              m_listaDescuento = valField(response.data, C.LD_NAME);

              m_nroctabanco = valField(response.data, C.PROV_NRO_CTA_BANCO);
              m_banco = valField(response.data, C.PROV_BANCO);
              m_cbu = valField(response.data, C.PROV_CBU);
              m_nrocliente = valField(response.data, C.PROV_NRO_CLIENTE);

              m_horario_m_desde = valField(response.data, C.PROV_HORARIO_MDESDE);
              m_horario_m_hasta = valField(response.data, C.PROV_HORARIO_MHASTA);
              m_horario_t_desde = valField(response.data, C.PROV_HORARIO_TDESDE);
              m_horario_t_hasta = valField(response.data, C.PROV_HORARIO_THASTA);

            }
            else {

              m_id = NO_ID;
              m_name = "";
              m_code = "";
              m_contacto = "";
              m_razonsocial = "";
              m_cuit = "";
              m_ingresosbrutos = "";
              m_catFiscal = C.CategoriaFiscal.inscripto;
              m_chequeorden = "";
              m_codpostal = "";
              m_descrip = "";
              m_localidad = "";
              m_calle = "";
              m_callenumero = "";
              m_piso = "";
              m_depto = "";
              m_tel = "";
              m_fax = "";
              m_email = "";
              m_web = "";
              m_cpg_id = NO_ID;
              m_condicionPago = "";
              m_pro_id = NO_ID;
              m_zon_id = NO_ID;
              m_lp_id = NO_ID;
              m_listaPrecio = "";
              m_ld_id = NO_ID;
              m_listaDescuento = "";
              m_provincia = "";
              m_zona = "";
              m_creditoctacte = 0;
              m_creditototal = 0;
              m_creditoactivo = true;
              m_active = true;
              m_imprimeTicket = false;

              m_horario_m_desde = Cairo.Constants.NO_DATE;
              m_horario_m_hasta = Cairo.Constants.NO_DATE;
              m_horario_t_desde = Cairo.Constants.NO_DATE;
              m_horario_t_hasta = Cairo.Constants.NO_DATE;

              m_nroctabanco = "";
              m_banco = "";
              m_cbu = "";
              m_nrocliente = "";

            }

            if(!m_genericEdit.load(m_id)) { return false; }

            return true;
          });
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var property = properties.item(C.PROV_NAME);
        property.setValue(m_name);

        var property = properties.item(C.PROV_RAZONSOCIAL);
        property.setValue(m_razonsocial);

        var property = properties.item(C.PROV_CODE);
        property.setValue(m_code);

        var property = properties.item(Cairo.Constants.ACTIVE);
        property.setValue(Cairo.Util.boolToInt(m_active));

        var property = properties.item(C.PROV_IMPRIME_TICKET);
        property.setValue(val(m_imprimeTicket));

        var property = properties.item(C.PROV_CONTACTO);
        property.setValue(m_contacto);

        var property = properties.item(C.PROV_CAT_FISCAL);
        property.setListItemData(m_catFiscal);

        var property = properties.item(C.PROV_CUIT);
        property.setValue(m_cuit);

        var property = properties.item(C.PROV_INGRESOSBRUTOS);
        property.setValue(m_ingresosbrutos);

        var property = properties.item(C.CPG_ID);
        property.setValue(m_condicionPago);
        property.setSelectId(m_cpg_id);

        var property = properties.item(C.PROV_CHEQUEORDEN);
        property.setValue(m_chequeorden);

        var property = properties.item(C.LP_ID);
        property.setSelectFilter(D.getListaPrecioForProveedor(NO_ID, m_id));
        property.setValue(m_listaPrecio);
        property.setSelectId(m_lp_id);

        var property = properties.item(C.LD_ID);
        property.setSelectFilter(D.getListaDescuentoForProveedor(NO_ID, m_id));
        property.setValue(m_listaDescuento);
        property.setSelectId(m_ld_id);

        var property = properties.item(C.PROV_CREDITOCTA_CTE);
        property.setValue(m_creditoctacte);

        var property = properties.item(C.PROV_CREDITOTOTAL);
        property.setValue(m_creditototal);

        var property = properties.item(C.PROV_CREDITOACTIVO);
        property.setValue(val(m_creditoactivo));

        var property = properties.item(C.PROV_DESCRIP);
        property.setValue(m_descrip);

        var property = properties.item(C.PROV_CALLE);
        property.setValue(m_calle);

        var property = properties.item(C.PROV_CALLENUMERO);
        property.setValue(m_callenumero);

        var property = properties.item(C.PROV_PISO);
        property.setValue(m_piso);

        var property = properties.item(C.PROV_DEPTO);
        property.setValue(m_depto);

        var property = properties.item(C.PROV_TEL);
        property.setValue(m_tel);

        var property = properties.item(C.PROV_FAX);
        property.setValue(m_fax);

        var property = properties.item(C.PROV_EMAIL);
        property.setValue(m_email);

        var property = properties.item(C.PROV_WEB);
        property.setValue(m_web);

        var property = properties.item(C.PROV_CODPOSTAL);
        property.setValue(m_codpostal);

        var property = properties.item(C.PROV_HORARIO_MDESDE);
        property.setValue(m_horario_m_desde);

        var property = properties.item(C.PROV_HORARIO_MHASTA);
        property.setValue(m_horario_m_hasta);

        var property = properties.item(C.PROV_HORARIO_TDESDE);
        property.setValue(m_horario_t_desde);

        var property = properties.item(C.PROV_HORARIO_THASTA);
        property.setValue(m_horario_t_hasta);

        var property = properties.item(C.PROV_LOCALIDAD);
        property.setValue(m_localidad);

        var property = properties.item(C.PRO_ID);
        property.setValue(m_provincia);
        property.setSelectId(m_pro_id);

        var property = properties.item(C.ZON_ID);
        property.setValue(m_zona);
        property.setSelectId(m_zon_id);

        var property = properties.item(C_CAIS);
        loadCAI(property);
        m_itemsDeletedCAIS = "";

        property = properties.item(C_CUENTAGRUPO);
        loadCuentasGrupo(property);
        m_itemsDeletedCuentaGrupo = "";

        property = properties.item(C_RETENCION);
        loadRetenciones(property)
        m_itemsDeletedRetenciones = "";

        property = properties.item(C_EMPRESAS);
        loadEmpresas(property);

        property = properties.item(C_DPTO);
        loadDepartamentos(property);
        m_itemsDeletedDptos = "";

        property = properties.item(C_CCOS);
        loadCentrosCosto(property);
        m_itemsDeletedCcos = "";

        m_genericEdit.refreshProperties(m_dialog);

        m_dialog.showValues(m_dialog.getProperties());

      };

      var setGridDepartamentos = function(property) {

        var elem ;
        var grid = property.getGrid();

        var columns = grid.getColumns();
        columns.clear();

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_DPTOPROV_ID);

        elem = columns.add(null);
        elem.setName(getText(1278, "")); // Departamento
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.DEPARTAMENTO);
        elem.setKey(KI_DPTO_ID);

        grid.getRows().clear();
      };

      var loadDepartamentos = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();

        for(var _i = 0; _i < m_data.dptos.length; _i += 1) {

          var row = rows.add(null, getValue(m_data.dptos[_i], C.DPTO_PROV_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.dptos[_i], C.DPTO_PROV_ID));
          elem.setKey(KI_DPTOPROV_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.dptos[_i], C.DPTO_NAME));
          elem.setId(getValue(m_data.dptos[_i], C.DPTO_ID));
          elem.setKey(KI_DPTO_ID);

        }
      };

      var setGridCentrosCosto = function(property) {

        var elem;
        var grid = property.getGrid();

        var columns = grid.getColumns();
        columns.clear();

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PROVCCOS_ID);

        elem = columns.add(null);
        elem.setName(getText(1057, "")); // Centro de Costo
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CENTROS_DE_COSTO);
        elem.setKey(KI_CCOS_ID);

        elem = columns.add(null);
        elem.setName(getText(1367, "")); // Articulo
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PRODUCTOS_DE_COMPRA);
        elem.setKey(KI_PR_ID);

        grid.getRows().clear();
      };

      var loadCentrosCosto = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();
        
        for(var _i = 0; _i < m_data.centrosCosto.length; _i += 1) {

          var row = rows.add(null, getValue(m_data.centrosCosto[_i], C.PROV_CCOS_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.centrosCosto[_i], C.PROV_CCOS_ID));
          elem.setKey(KI_PROVCCOS_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.centrosCosto[_i], C.CCOS_NAME));
          elem.setId(getValue(m_data.centrosCosto[_i], C.CCOS_ID));
          elem.setKey(KI_CCOS_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.centrosCosto[_i], C.PR_NAME_COMPRA));
          elem.setId(getValue(m_data.centrosCosto[_i], C.PR_ID));
          elem.setKey(KI_PR_ID);

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
        elem.setKey(KI_EMPPROV_ID);

        grid.getRows().clear();
      };

      var loadEmpresas = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();
        var bSelect = m_data.empresas.length === 1;

        rows.clear();
        
        for(var _i = 0; _i < m_data.empresas.length; _i += 1) {

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
            elem.setId(getValue(m_data.empresas[_i], C.EMP_PROV_ID));
          }
          elem.setValue(elem.getId());
          elem.setKey(KI_EMPPROV_ID);
        }
      };

      var setGridRetenciones = function(property) {

        var elem;
        var grid = property.getGrid();

        var columns = grid.getColumns();
        columns.clear();

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PROVRET_ID);

        elem = columns.add(null);
        elem.setName(getText(1223, "")); // Tipo
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.TIPOS_DE_RETENCION);
        elem.setKey(KI_RETT_ID);

        elem = columns.add(null);
        elem.setName(getText(1403, "")); // Retención
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.retenciones);
        elem.setKey(KI_RET_ID);

        elem = columns.add(null);
        elem.setName(getText(2532, "")); // Desde
        elem.setType(T.date);
        elem.setKey(KI_RET_DESDE);

        elem = columns.add(null);
        elem.setName(getText(2533, "")); // Hasta
        elem.setType(T.date);
        elem.setKey(KI_RET_HASTA);

        grid.getRows().clear();
      };

      var loadRetenciones = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();
        
        for(var _i = 0; _i < m_data.retenciones.length; _i += 1) {

          var row = rows.add(null, getValue(m_data.retenciones[_i], C.PROV_RET_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.retenciones[_i], C.PROV_RET_ID));
          elem.setKey(KI_PROVRET_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.retenciones[_i], C.RETT_NAME));
          elem.setId(getValue(m_data.retenciones[_i], C.RETT_ID));
          elem.setKey(KI_RETT_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.retenciones[_i], C.RET_NAME));
          elem.setId(getValue(m_data.retenciones[_i], C.RET_ID));
          elem.setKey(KI_RET_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.retenciones[_i], C.PROV_RET_DESDE));
          elem.setKey(KI_RET_DESDE);

          elem = row.add(null);
          elem.setValue(getValue(m_data.retenciones[_i], C.PROV_RET_HASTA));
          elem.setKey(KI_RET_HASTA);

        }
      };

      var setGridCuentasGrupo = function(property) {

        var elem;
        var grid = property.getGrid();

        var columns = grid.getColumns();
        columns.clear();

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PROVCUEG_ID);

        elem = columns.add(null);
        elem.setName(getText(1404, "")); // Grupo
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.GRUPO_DE_CUENTA);
        elem.setKey(KI_CUEG_ID);
        elem.setSelectFilter(D.getCuentaGrupoFilterForProveedor());

        elem = columns.add(null, C.CUE_ID);
        elem.setName(getText(1267, "")); // Cuenta
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setSelectFilter(D.getCuentaFilterForProveedor());

        elem.setKey(KI_CUE_ID);

        grid.getRows().clear();
      };

      var loadCuentasGrupo = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();
        
        for(var _i = 0; _i < m_data.cuentasGrupo.length; _i += 1) {

          var row = rows.add(null, getValue(m_data.cuentasGrupo[_i], C.PROV_CUEG_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.cuentasGrupo[_i], C.PROV_CUEG_ID));
          elem.setKey(KI_PROVCUEG_ID);

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

      var setGridCAIs = function(property) {

        var elem;
        var grid = property.getGrid();

        var columns = grid.getColumns();
        columns.clear();

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PROVC_ID);

        elem = columns.add(null);
        elem.setName(getText(1406, "")); // N° CAI
        elem.setType(T.text);
        elem.setKey(KI_NUMERO);

        elem = columns.add(null);
        elem.setName(getText(1281, "")); // sucursal
        elem.setType(T.text);
        elem.setKey(KI_SUCURSAL);

        elem = columns.add(null);
        elem.setName(getText(1405, "")); // Vencimiento
        elem.setType(T.date);
        elem.setKey(KI_FECHAVTO);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(T.text);
        elem.setKey(KI_DESCRIP);

        grid.getRows().clear();
      };

      var loadCAI = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();

        for(var _i = 0; _i < m_data.cais.length; _i += 1) {

          var row = rows.add(null, getValue(m_data.cais[_i], C.PROVC_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.cais[_i], C.PROVC_ID));
          elem.setKey(KI_PROVC_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cais[_i], C.PROVC_NUMERO));
          elem.setKey(KI_NUMERO);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cais[_i], C.PROVC_SUCURSAL));
          elem.setKey(KI_SUCURSAL);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cais[_i], C.PROVC_FECHA_VTO));
          elem.setKey(KI_FECHAVTO);

          elem = row.add(null);
          elem.setValue(getValue(m_data.cais[_i], C.PROVC_DESCRIP));
          elem.setKey(KI_DESCRIP);

        }
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

      var isEmptyRowCcos = function(row, rowIndex) {

        for(var _i = 0, _count = row.size(); _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KI_PR_ID:
              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;

            case KI_CCOS_ID:
              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var isEmptyRowRetencion = function(row, rowIndex) {

        for(var _i = 0, _count = row.size(); _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {
            case KI_RET_ID:
              if(!valEmpty(cell.getValue(), Types.text)) {
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

      var isEmptyRowCai = function(row, rowIndex) {

        for(var _i = 0, _count = row.size(); _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KI_NUMERO:
              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;

            case KI_FECHAVTO:
              if(!valEmpty(cell.getValue(), Types.date)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var saveItemsCAIS = function(mainRegister) {
        var transaction = DB.createTransaction();
        transaction.setTable(C.PROVEEDOR_CAI);

        var property = m_dialog.getProperties().item(C_CAIS);
        var rows = property.getGrid().getRows();

        var _count = rows.size();
        for(var _i = 0; _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();

          var fields = register.getFields();
          register.setFieldId(C.PROVC_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var _countj = row.size();
          for(var _j = 0; _j < _countj; _j++) {

            var cell = row.item(_j);
            switch (cell.getKey()) {

              case KI_PROVC_ID:
                if(m_copy) {
                  fields.add(C.PROVC_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(C.PROVC_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KI_NUMERO:
                fields.add(C.PROVC_NUMERO, cell.getValue(), Types.text);
                break;

              case KI_DESCRIP:
                fields.add(C.PROVC_DESCRIP, cell.getValue(), Types.text);
                break;

              case KI_FECHAVTO:
                fields.add(C.PROVC_FECHA_VTO, cell.getValue(), Types.date);
                break;

              case KI_ACTIVO:
                fields.add(Cairo.Constants.ACTIVE, cell.getId(), Types.boolean);
                break;

              case KI_SUCURSAL:
                fields.add(C.PROVC_SUCURSAL, cell.getValue(), Types.text);
                break;
            }
          }

          fields.add(C.PROV_ID, m_id, Types.id);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedCAIS !== "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedCAIS);
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveItemsRetencion = function(mainRegister) {
        var transaction = DB.createTransaction();
        transaction.setTable(C.PROVEEDOR_RETENCION);

        var property = m_dialog.getProperties().item(C_RETENCION);

        var rows = property.getGrid().getRows();
        var _count = rows.size();
        for(var _i = 0; _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();

          var fields = register.getFields();
          register.setFieldId(C.PROV_RET_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var _countj = row.size();
          for(var _j = 0; _j < _countj; _j++) {

            var cell = row.item(_j);

            switch (cell.getKey()) {

              case KI_PROVRET_ID:
                if(m_copy) {
                  fields.add(C.PROV_RET_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(C.PROV_RET_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KI_RET_ID:
                fields.add(C.RET_ID, cell.getId(), Types.id);

                break;

              case KI_RET_DESDE:
                fields.add(C.PROV_RET_DESDE, cell.getValue(), Types.date);

                break;

              case KI_RET_HASTA:
                fields.add(C.PROV_RET_HASTA, cell.getValue(), Types.date);
                break;
            }
          }

          fields.add(C.PROV_ID, m_id, Types.id);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedRetenciones !== "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedRetenciones);
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveItemsDpto = function(mainRegister) {
        var transaction = DB.createTransaction();
        transaction.setTable(C.DEPARTAMENTO_PROVEEDOR);

        var property = m_dialog.getProperties().item(C_DPTO);

        var rows = property.getGrid().getRows();
        var _count = rows.size();
        for(var _i = 0; _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();

          var fields = register.getFields();
          register.setFieldId(C.DPTO_PROV_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var _countj = row.size();
          for(var _j = 0; _j < _countj; _j++) {

            var cell = row.item(_j);

            switch (cell.getKey()) {

              case KI_DPTOPROV_ID:
                if(m_copy) {
                  fields.add(C.DPTO_PROV_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(C.DPTO_PROV_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KI_DPTO_ID:
                fields.add(C.DPTO_ID, cell.getId(), Types.id);
                break;
            }
          }

          fields.add(C.PROV_ID, m_id, Types.id);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedDptos !== "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedDptos);
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveItemsCentrosCosto = function(mainRegister) {
        var transaction = DB.createTransaction();
        transaction.setTable(C.PROVEEDOR_CENTRO_COSTO);

        var property = m_dialog.getProperties().item(C_CCOS);

        var rows = property.getGrid().getRows();
        var _count = rows.size();
        for(var _i = 0; _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();

          var fields = register.getFields();
          register.setFieldId(C.PROV_CCOS_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var _countj = row.size();
          for(var _j = 0; _j < _countj; _j++) {

            var cell = row.item(_j);

            switch (cell.getKey()) {

              case KI_PROVCCOS_ID:
                if(m_copy) {
                  fields.add(C.PROV_CCOS_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(C.PROV_CCOS_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KI_CCOS_ID:
                fields.add(C.CCOS_ID, cell.getId(), Types.id);
                break;

              case KI_PR_ID:
                fields.add(C.PR_ID, cell.getId(), Types.id);
                break;
            }
          }

          fields.add(C.PROV_ID, m_id, Types.id);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedCcos !== "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedCcos);
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveItemsEmpresa = function(mainRegister) {
        var transaction = DB.createTransaction();
        transaction.setTable(C.EMPRESA_PROVEEDOR);

        var property = m_dialog.getProperties().item(C_EMPRESAS);

        var rows = property.getGrid().getRows();
        var _count = rows.size();
        for(var _i = 0; _i < _count; _i++) {

          var row = rows.item(_i);

          if(val(Dialogs.cell(row, KI_EMPPROV_ID).getId()) !== 0 ) {

            var register = new DB.Register();

            var fields = register.getFields();
            register.setFieldId(C.EMP_PROV_ID);
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
        transaction.setTable(C.PROVEEDOR_CUENTA_GRUPO);

        var property = m_dialog.getProperties().item(C_CUENTAGRUPO);

        var rows = property.getGrid().getRows();
        var _count = rows.size();
        for(var _i = 0; _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();

          var fields = register.getFields();
          register.setFieldId(C.PROV_CUEG_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var _countj = row.size();
          for(var _j = 0; _j < _countj; _j++) {

            var cell = row.item(_j);

            switch (cell.getKey()) {

              case KI_PROVCUEG_ID:
                if(m_copy) {
                  fields.add(C.PROV_CUEG_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(C.PROV_CUEG_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KI_CUEG_ID:
                fields.add(C.CUEG_ID, cell.getId(), Types.id);
                break;

              case KI_CUE_ID:
                fields.add(C.CUE_ID, cell.getId(), Types.id);
                break;
            }
          }

          fields.add(C.PROV_ID, m_id, Types.id);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedCuentaGrupo !== "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedCuentaGrupo);
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var validateCuitProveedor = function(cuit) {
        if(cuit.trim() !== "") {
          return D.validateNroCuit(cuit, false)
            .whenSuccess(call(D.checkCuitProveedorIsNotAlreadyUsed, cuit, m_id));
        }
        else {
          return M.showWarningWithFalse(getText(1173)); // Debe indicar un CUIT
        }
      };

      var getCtaGrupo = function() {
        return m_dialog.getProperties().item(C_CUENTAGRUPO);
      };

      var chrTran = function(source, toSearch, value) {
        var rtn = "";

        for(var i = 0; i < source.length; i++) {
          var c = source.substr(i, 1);
          if(toSearch.indexOf(c, 1)) {
            c = value;
          }
          rtn = rtn + c;
        }

        return rtn;
      };

      var validateCBU = function(cbu) {

        cbu = chrTran(cbu, chrTran(cbu, "1234567890", ""), "");

        if(cbu.length === 22) {

          var block1 = cbu.substr(0, 8);
          var block2 = cbu.substr(8, 14);

          if(!(validateDigit(block1) && validateDigit(block2))) {
            return M.showWarningWithFalse(getText(4712, "")); // El CBU ingresado no es valido
          }
        }
        else {
          return M.showWarningWithFalse(getText(4713, "")); // Largo de CBU incorrecto
        }

        return true;
      };

      var validateDigit = function(code) {

        var pond = "9713";

        var sum = 0;
        var size = code.length;
        var digit = code.substr(size, 1);
        var number = code.substr(1, size - 1);
        for(var i = 0; i < size - 1; i++) {
          sum = sum + val(number.substr(size - i, 1)) * val(pond.substr(4 - i % 4 + 1, 1));
        }

        return (digit === Cairo.Util.right((10 - sum % 10).toString(), 1));
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
      var editor = Cairo.Proveedor.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit(id);
    };

  });

  Cairo.module("Proveedor.List", function(List, Cairo, Backbone, Marionette, $, _) {
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

          var editors = Cairo.Editors.proveedorEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.proveedorEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Proveedores",
            entityName: "proveedor",
            entitiesName: "proveedores"
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
              var editor = Cairo.Proveedor.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_PROVEEDOR)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            return Cairo.Database.destroy(m_apiPath + "general/proveedor", id, Cairo.Constants.DELETE_FUNCTION, "Proveedor").whenSuccess(
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
          Cairo.LoadingMessage.show("Proveedores", "Loading Proveedores from CrowSoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ proveedorTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.PROVEEDOR,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.proveedorTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("Proveedores", "proveedorTreeRegion", "#general/proveedores", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };    
  });

}());  