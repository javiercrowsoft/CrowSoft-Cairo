(function() {
  "use strict";

  Cairo.module("VentaConfig.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;
      var T = Dialogs.PropertyType;

      var C_MODULE = "cVentaConfigEdit";

      var K_CUE_ID_DESCUENTO = 1;
      var K_GRABAR_ASIENTO = 2;
      var K_WEB_MAIL_LEYENDA = 3;
      var K_APLIC_CLIENTE_FAMILIA = 4;
      var K_DECIMALES_EN_PRECIOS = 5;
      var K_RESTO_ENTERO = 6;
      var K_REDONDEO_EN_PRECIOS = 7;
      var K_USAR_LISTA_PRECIO_PRECIO = 8;
      var K_RAZON_SOCIAL = 9;
      var K_CAT_FISCAL = 10;
      var K_CPG_ID = 11;
      var K_LP_ID = 12;
      var K_PRO_ID = 13;
      var K_ZON_ID = 14;
      var K_PERC_ID = 15;
      var K_EXIGIR_CAJA = 16;
      var K_EXIGIR_CENTRO_COSTO = 17;

      var K_DOC_ID_SOBRANTE = 18;
      var K_DOC_ID_FALTANTE = 19;
      var K_DOC_ID_TICKETS = 20;

      var K_CUE_ID_SOBRANTES = 21;
      var K_CUE_ID_TICKETS = 22;
      var K_PR_ID_FALTANTES = 23;

      var K_COBRANZA_POR_CAJERO = 24;
      var K_VENTAS_POR_HOJADERUTA = 25;

      var KI_PERC_ID = 16;

      var C_GRUPO_GENERAL = "Ventas-General";
      var C_CUE_ID_DESC_GLOBAL = "Cuenta Descuento Global";
      var C_GRABAR_ASIENTO = "Grabar Asiento";
      var C_WEB_USER_MAIL_LEYENDA = "Leyenda para Usuarios de la Intranet";
      var C_APLIC_CLIENTE_FAMILIA = "Aplicaciones entre Grupos de Clientes";
      var C_REDONDEO_EN_PRECIOS = "Redondear Decimales en Precios";
      var C_DECIMALES_EN_PRECIOS = "Decimales en Precios";
      var C_RESTO_ENTERO = "Restar a precios enteros";
      var C_USAR_LISTA_PRECIO_PRECIO = "Utilizar Cache de Precios";
      var C_EXIGIR_CAJA = "Exigir que la Caja Este Abierta para Facturar";
      var C_EXIGIR_CENTRO_COSTO = "Exigir Centro Costo";
      var C_COBRANZA_POR_CAJERO = "Concentrar Cobranzas en Cajero";
      var C_VENTAS_POR_HOJA_DE_RUTA = "Ventas por Hoja de Ruta";

      var C_DOC_FACTURA_FALTANTE = "Factura x Faltante en Hoja Ruta";
      var C_DOC_MOVIMIENTO_SOBRANTE = "Mov. Fondo Sobrante en Hoja Ruta";
      var C_DOC_MOVIMIENTO_TICKET = "Mov. Fondo Tickets en Hoja Ruta";
      var C_CUE_ID_TICKETS = "Cuenta Comision sobre Tickets";
      var C_CUE_ID_SOBRANTE = "Cuenta para Sobrante en Rendicion";
      var C_PR_ID_FALTANTE = "Articulo para Faltantes en Rendicion";

      var C_PERCEPCION = "Percepcion";
      var C_CLIENTES_PV = "ClientesPV";

      var C_PV_CLI_RAZON_SOCIAL = C_CLIENTES_PV + C.CLI_RAZONSOCIAL;
      var C_PV_CLI_CAT_FISCAL = C_CLIENTES_PV + C.CLI_CAT_FISCAL;
      var C_PV_CPG_ID = C_CLIENTES_PV + C.CPG_ID;
      var C_PV_LP_ID = C_CLIENTES_PV + C.LP_ID;
      var C_PV_PRO_ID = C_CLIENTES_PV + C.PRO_ID;
      var C_PV_ZON_ID = C_CLIENTES_PV + C.ZON_ID;

      var m_cueIdDescGlobal = 0;
      var m_cuentaDescGlobal = "";

      var m_cueIdSobrantes = 0;
      var m_cuentaSobrantes = "";

      var m_cueIdTickets = 0;
      var m_cuentaTickets = "";

      var m_prIdFaltantes = 0;
      var m_productoFaltantes = "";

      var m_grabarAsiento;
      var m_aplicClienteFamilia;
      var m_redondoEnPrecios;
      var m_usarListaPrecioPrecio;
      var m_decimalesEnPrecio = 0;
      var m_restoEntero = 0;
      var m_webUserMailLeyenda = "";
      var m_exigirCaja;
      var m_exigirCentroCosto;
      var m_cobranzaPorCajero;
      var m_ventasPorHojaDeRuta;

      var m_razonSocial = "";
      var m_catFiscal = 0;
      var m_condicionPago = "";
      var m_cpgId = 0;
      var m_lpId = 0;
      var m_listaPrecio = "";

      var m_provincia = "";
      var m_proId = 0;
      var m_zonId = 0;
      var m_zona = "";

      var m_docIdFaltante = 0;
      var m_docFaltante = "";
      var m_docIdSobrante = 0;
      var m_docSobrante = "";
      var m_docIdTickets = 0;
      var m_docTickets = "";

      var m_settings = [];

      var m_editing;

      var m_dialog;
      var m_listController = null;

      var m_apiPath = DB.getAPIVersion();

      var getValue = DB.getValue;
      var val = Cairo.Util.val;
      var bool = Cairo.Util.bool;
      var sq = DB.sqlString;

      var CFG_GRUPO = C.CFG_GRUPO;
      var EMP_ID = C.EMP_ID;
      var TEXT = Cairo.Constants.Types.text;
      var ID = Cairo.Constants.Types.id;

      //
      // property getters
      //

      self.getCueIdDescGlobal = function() {
        return m_cueIdDescGlobal;
      };
      self.getCuentaDescGlobal = function() {
        return m_cuentaDescGlobal;
      };

      self.getCueIdSobrantes = function() {
        return m_cueIdSobrantes;
      };
      self.getCuentaSobrantes = function() {
        return m_cuentaSobrantes;
      };

      self.getCueIdTickets = function() {
        return m_cueIdTickets;
      };
      self.getCuentaTickets = function() {
        return m_cuentaTickets;
      };

      self.getPrIdFaltantes = function() {
        return m_prIdFaltantes;
      };
      self.getProductoFaltantes = function() {
        return m_productoFaltantes;
      };

      self.getGrabarAsiento = function() {
        return m_grabarAsiento;
      };
      self.getAplicClienteFamilia = function() {
        return m_aplicClienteFamilia;
      };
      self.getRedondoEnPrecios = function() {
        return m_redondoEnPrecios;
      };
      self.getUsarListaPrecioPrecio = function() {
        return m_usarListaPrecioPrecio;
      };
      self.getDecimalesEnPrecio = function() {
        return m_decimalesEnPrecio;
      };
      self.getRestoEntero = function() {
        return m_restoEntero;
      };
      self.getWebUserMaiLeyenda = function() {
        return m_webUserMailLeyenda;
      };
      self.getExigirCaja = function() {
        return m_exigirCaja;
      };
      self.getExigirCentroCosto = function() {
        return m_exigirCentroCosto;
      };
      self.getCobranzaPorCajero = function() {
        return m_cobranzaPorCajero;
      };
      self.getVentasPorHojaDeRuta = function() {
        return m_ventasPorHojaDeRuta;
      };

      self.getRazonSocial = function() {
        return m_razonSocial;
      };
      self.getCatFiscal = function() {
        return m_catFiscal;
      };
      self.getCondicionPago = function() {
        return m_condicionPago;
      };
      self.getCpgId = function() {
        return m_cpgId;
      };
      self.getLpId = function() {
        return m_lpId;
      };
      self.getListaPrecio = function() {
        return m_listaPrecio;
      };

      self.getProvincia = function() {
        return m_provincia;
      };
      self.getProId = function() {
        return m_proId;
      };
      self.getZonId = function() {
        return m_zonId;
      };
      self.getZona = function() {
        return m_zona;
      };

      self.getDocIdFaltante = function() {
        return m_docIdFaltante;
      };
      self.getDocFaltante = function() {
        return m_docFaltante;
      };
      self.getDocIdSobrante = function() {
        return m_docIdSobrante;
      };
      self.getDocSobrante = function() {
        return m_docSobrante;
      };
      self.getDocIdTickets = function() {
        return m_docIdTickets;
      };
      self.getDocTickets = function() {
        return m_docTickets;
      };

      //
      // editor code
      //

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

        transaction.setTable(C.CONFIGURACION);

        for(var _i = 0, _count = m_dialog.getProperties().size(); _i < _count; _i++) {

          var property = m_dialog.getProperties().item(_i);

          switch (property.getKey()) {

            case K_CUE_ID_DESCUENTO:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_CUE_ID_DESC_GLOBAL), TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_CUE_ID_DESC_GLOBAL, TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);

              transaction.addRegister(register);
              break;

            case K_GRABAR_ASIENTO:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_GRABAR_ASIENTO), TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_GRABAR_ASIENTO, TEXT);
              fields.add(C.CONFIG_VALUE, Cairo.Util.val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_WEB_MAIL_LEYENDA:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_WEB_USER_MAIL_LEYENDA), TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_WEB_USER_MAIL_LEYENDA, TEXT);
              fields.add(C.CONFIG_VALUE, property.getValue(), TEXT);

              transaction.addRegister(register);
              break;

            case K_EXIGIR_CAJA:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_EXIGIR_CAJA), TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_EXIGIR_CAJA, TEXT);
              fields.add(C.CONFIG_VALUE, property.getValue(), TEXT);

              transaction.addRegister(register);
              break;

            case K_EXIGIR_CENTRO_COSTO:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_EXIGIR_CENTRO_COSTO), TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_EXIGIR_CENTRO_COSTO, TEXT);
              fields.add(C.CONFIG_VALUE, property.getValue(), TEXT);

              transaction.addRegister(register);
              break;

            case K_APLIC_CLIENTE_FAMILIA:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_APLIC_CLIENTE_FAMILIA), TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_APLIC_CLIENTE_FAMILIA, TEXT);
              fields.add(C.CONFIG_VALUE, Cairo.Util.val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_REDONDEO_EN_PRECIOS:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_REDONDEO_EN_PRECIOS), TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_REDONDEO_EN_PRECIOS, TEXT);
              fields.add(C.CONFIG_VALUE, Cairo.Util.val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_USAR_LISTA_PRECIO_PRECIO:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_USAR_LISTA_PRECIO_PRECIO), TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_USAR_LISTA_PRECIO_PRECIO, TEXT);
              fields.add(C.CONFIG_VALUE, Cairo.Util.val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_DECIMALES_EN_PRECIOS:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_DECIMALES_EN_PRECIOS), TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_DECIMALES_EN_PRECIOS, TEXT);
              fields.add(C.CONFIG_VALUE, Cairo.Util.val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_RESTO_ENTERO:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_RESTO_ENTERO), TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_RESTO_ENTERO, TEXT);
              fields.add(C.CONFIG_VALUE, Cairo.Util.val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_RAZON_SOCIAL:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_PV_CLI_RAZON_SOCIAL), TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_PV_CLI_RAZON_SOCIAL, TEXT);
              fields.add(C.CONFIG_VALUE, property.getValue(), TEXT);

              transaction.addRegister(register);
              break;

            case K_CAT_FISCAL:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_PV_CLI_CAT_FISCAL), TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_PV_CLI_CAT_FISCAL, TEXT);
              fields.add(C.CONFIG_VALUE, property.getListItemData(), TEXT);

              transaction.addRegister(register);
              break;

            case K_CPG_ID:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_PV_CPG_ID), TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_PV_CPG_ID, TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);

              transaction.addRegister(register);
              break;

            case K_LP_ID:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_PV_LP_ID), TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_PV_LP_ID, TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);

              transaction.addRegister(register);
              break;

            case K_PRO_ID:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_PV_PRO_ID), TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_PV_PRO_ID, TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);

              transaction.addRegister(register);
              break;

            case K_ZON_ID:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_PV_ZON_ID), TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_PV_ZON_ID, TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_FALTANTE:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_DOC_FACTURA_FALTANTE) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_DOC_FACTURA_FALTANTE, TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, companyId, ID);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_SOBRANTE:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_DOC_MOVIMIENTO_SOBRANTE) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_DOC_MOVIMIENTO_SOBRANTE, TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, companyId, ID);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_TICKETS:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_DOC_MOVIMIENTO_TICKET) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_DOC_MOVIMIENTO_TICKET, TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, companyId, ID);

              transaction.addRegister(register);
              break;

            case K_PR_ID_FALTANTES:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_PR_ID_FALTANTE) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_PR_ID_FALTANTE, TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, companyId, ID);

              transaction.addRegister(register);
              break;

            case K_CUE_ID_SOBRANTES:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_CUE_ID_SOBRANTE) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_CUE_ID_SOBRANTE, TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, companyId, ID);

              transaction.addRegister(register);
              break;

            case K_CUE_ID_TICKETS:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_CUE_ID_TICKETS) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_CUE_ID_TICKETS, TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, companyId, ID);

              transaction.addRegister(register);
              break;

            case K_COBRANZA_POR_CAJERO:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_COBRANZA_POR_CAJERO), TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_COBRANZA_POR_CAJERO, TEXT);
              fields.add(C.CONFIG_VALUE, property.getValue(), TEXT);

              transaction.addRegister(register);
              break;

            case K_COBRANZA_POR_CAJERO:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_COBRANZA_POR_CAJERO), TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_COBRANZA_POR_CAJERO, TEXT);
              fields.add(C.CONFIG_VALUE, property.getValue(), TEXT);

              transaction.addRegister(register);
              break;

            case K_VENTAS_POR_HOJADERUTA:
              register = new DB.Register();

              var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_VENTAS_POR_HOJA_DE_RUTA), TEXT);
              fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CONFIG_KEY, C_VENTAS_POR_HOJA_DE_RUTA, TEXT);
              fields.add(C.CONFIG_VALUE, property.getValue(), TEXT);

              transaction.addRegister(register);
              break;

          }
        }
        
        savePercepcion(transaction, companyId);

        mainRegister.addTransaction(transaction);

        return DB.saveTransaction(
            register,
            false,
            "",
            C.CLIENT_SAVE_FUNCTION,
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

      var savePercepcion = function(transaction, companyId) {

        var rows = getPercepcion().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);
          var register = new DB.Register();

          var fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_PERCEPCION), TEXT);
          fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
          fields.add(C.CONFIG_KEY, C_PERCEPCION, TEXT);
          fields.add(C.CONFIG_VALUE, Dialogs.cell(row, KI_PERC_ID).getId(), TEXT);
          fields.add(EMP_ID, companyId, ID);

          transaction.addRegister(register);
        }
      };

      var getPercepcion = function() {
        return m_dialog.getProperties().item(C_PERCEPCION).getGrid();
      };

      self.getPath = function() {
        return "#ventas/ventaconfig";
      };

      self.getEditorName = function() {
        return "ventaconfig";
      };

      self.getTitle = function() {
        return Cairo.Language.getText(2862, ""); // Configuración General
      };

      self.validate = function() {

        for(var _i = 0, _count = m_dialog.getProperties().size(); _i < _count; _i++) {
          var property = m_dialog.getProperties().item(_i);

          switch (property.getKey()) {
            case K_CUE_ID_DESCUENTO:
              if(property.getSelectId() === NO_ID) {
                return Cairo.Modal.showWarningWithFalse(Cairo.Language.getText(3204, ""));
                // Debe indicar una cuenta para que Cairo pueda
                // grabar(cCobranzaInfo.getFacturas() con descuentos globales.;; Los parámetros se guardarán de todas formas.);
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var load = function() {

        return DB.getData("load[" + m_apiPath + "general/ventaconfig]", NO_ID).then(
          function(response) {

            if(response.success === true) {
              m_cueIdDescGlobal = NO_ID;
              m_cuentaDescGlobal = "";
              m_grabarAsiento = false;
              m_aplicClienteFamilia = false;
              m_redondoEnPrecios = false;
              m_usarListaPrecioPrecio = false;
              m_decimalesEnPrecio = 0;
              m_restoEntero = 0;
              m_exigirCaja = true;
              m_exigirCentroCosto = false;
              m_cobranzaPorCajero = false;
              m_ventasPorHojaDeRuta = false;

              m_docIdFaltante = NO_ID;
              m_docIdSobrante = NO_ID;
              m_docIdTickets = NO_ID;

              m_docTickets = "";
              m_docSobrante = "";
              m_docFaltante = "";

              m_prIdFaltantes = NO_ID;
              m_cueIdSobrantes = NO_ID;
              m_cueIdTickets = NO_ID;

              m_cuentaTickets = "";
              m_cuentaSobrantes = "";
              m_productoFaltantes = "";

              m_webUserMailLeyenda = Cairo.Language.getText(3205, "");
              // Le notificamos que hemos creado una cuenta de usuario
              // para(que Ud. acceda a nuestra extranet. Usuario: @@usuario Contraseña: @@clave);

              var settings = response.data.get('settings')

              m_settings = settings;

              for(var _i = 0; _i < settings.length; _i += 1) {

                switch (getValue(settings[_i], C.CONFIG_KEY)) {

                  case C_CUE_ID_DESC_GLOBAL:
                    var value = getValue(settings[_i], C.CONFIG_VALUE);
                    m_cueIdDescGlobal = value.id;
                    m_cuentaDescGlobal = value.name;
                    break;

                  case C_GRABAR_ASIENTO:
                    m_grabarAsiento = bool(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case C_WEB_USER_MAIL_LEYENDA:
                    m_webUserMailLeyenda = getValue(settings[_i], C.CONFIG_VALUE);
                    break;

                  case C_EXIGIR_CAJA:
                    m_exigirCaja = bool(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case C_COBRANZA_POR_CAJERO:
                    m_cobranzaPorCajero = bool(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case C_VENTAS_POR_HOJA_DE_RUTA:
                    m_ventasPorHojaDeRuta = bool(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case C_EXIGIR_CENTRO_COSTO:
                    m_exigirCentroCosto = bool(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case C_APLIC_CLIENTE_FAMILIA:
                    m_aplicClienteFamilia = bool(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case C_REDONDEO_EN_PRECIOS:
                    m_redondoEnPrecios = bool(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case C_USAR_LISTA_PRECIO_PRECIO:
                    m_usarListaPrecioPrecio = bool(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case C_DECIMALES_EN_PRECIOS:
                    m_decimalesEnPrecio = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case C_RESTO_ENTERO:
                    m_restoEntero = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case C_PV_CLI_RAZON_SOCIAL:
                    m_razonSocial = getValue(settings[_i], C.CONFIG_VALUE);
                    break;

                  case C_PV_CLI_CAT_FISCAL:
                    m_catFiscal = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case C_PV_CPG_ID:
                    var value = getValue(settings[_i], C.CONFIG_VALUE);
                    m_cpgId = value.id;
                    m_condicionPago = value.name;
                    break;

                  case C_PV_LP_ID:
                    var value = getValue(settings[_i], C.CONFIG_VALUE);
                    m_lpId = value.id;
                    m_listaPrecio = value.name;
                    break;

                  case C_PV_PRO_ID:
                    var value = getValue(settings[_i], C.CONFIG_VALUE);
                    m_proId = value.id;
                    m_provincia = value.name;
                    break;

                  case C_PV_ZON_ID:
                    var value = getValue(settings[_i], C.CONFIG_VALUE);
                    m_zonId = value.id;
                    m_zona = value.name;
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

          if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.MODIFY_CONFIG_VENTAS)) { return p; }

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
          Cairo.manageErrorEx(ex.message, ex, C.EDIT_FUNCTION, C_MODULE, "");
        }

        return p;
      };

      self.setTree = function(value) {
        m_listController = value;
      };

      var loadCollection = function() {

        var tab_general = 0;
        var tab_percepcion = 1;
        var tab_clientesPV = 2;
        var tab_hojaRuta = 3;

        var w_tabs = m_dialog.getTabs();

        w_tabs.clear();

        var tab = w_tabs.add(null);
        tab.setIndex(tab_general);
        tab.setName(Cairo.Constants.TAB_GENERAL);

        var tab = w_tabs.add(null);
        tab.setIndex(tab_percepcion);
        tab.setName(Cairo.Language.getText(1248, "")); // Percepciones

        var tab = w_tabs.add(null);
        tab.setIndex(tab_clientesPV);
        tab.setName(Cairo.Language.getText(4501, "")); // Clientes Punto de Venta

        var tab = w_tabs.add(null);
        tab.setIndex(tab_hojaRuta);
        tab.setName(Cairo.Language.getText(4940, "")); // Hojas de Ruta
        
        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, C_CUE_ID_DESC_GLOBAL);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setName(Cairo.Language.getText(3094, "")); // Cuenta de descuento global
        elem.setKey(K_CUE_ID_DESCUENTO);
        elem.setSelectId(m_cueIdDescGlobal);
        elem.setValue(m_cuentaDescGlobal);

        var elem = properties.add(null, C_GRABAR_ASIENTO);
        elem.setType(T.check);
        elem.setName(Cairo.Language.getText(3095, "")); // Grabar asiento al grabar la factura
        elem.setKey(K_GRABAR_ASIENTO);
        elem.setValue(Cairo.Util.boolToInt(m_grabarAsiento));

        var elem = properties.add(null, C_APLIC_CLIENTE_FAMILIA);
        elem.setType(T.check);
        elem.setName(Cairo.Language.getText(3477, "")); // Aplicaciones entre Clientes de un Grupo
        elem.setKey(K_APLIC_CLIENTE_FAMILIA);
        elem.setValue(Cairo.Util.boolToInt(m_aplicClienteFamilia));

        var elem = properties.add(null, C_USAR_LISTA_PRECIO_PRECIO);
        elem.setType(T.check);
        elem.setName(Cairo.Language.getText(3597, "")); // Usar Cache de Precios
        elem.setKey(K_USAR_LISTA_PRECIO_PRECIO);
        elem.setValue(Cairo.Util.boolToInt(m_usarListaPrecioPrecio));

        var elem = properties.add(null, C_REDONDEO_EN_PRECIOS);
        elem.setType(T.check);
        elem.setName(Cairo.Language.getText(3577, "")); // Redondear Decimales en Precios
        elem.setKey(K_REDONDEO_EN_PRECIOS);
        elem.setValue(Cairo.Util.boolToInt(m_redondoEnPrecios));

        var elem = properties.add(null, C_DECIMALES_EN_PRECIOS);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.integer);
        elem.setName(Cairo.Language.getText(3578, "")); // Decimales en precio
        elem.setKey(K_DECIMALES_EN_PRECIOS);
        elem.setValue(m_decimalesEnPrecio);
        elem.setEnabled(m_redondoEnPrecios);

        var elem = properties.add(null, C_RESTO_ENTERO);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setName(Cairo.Language.getText(3579, "")); // Restar a precios enteros
        elem.setKey(K_RESTO_ENTERO);
        elem.setValue(m_restoEntero);
        elem.setEnabled(m_redondoEnPrecios);

        var elem = properties.add(null, C_WEB_USER_MAIL_LEYENDA);
        elem.setType(T.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setName(Cairo.Language.getText(3206, "")); // Leyenda para Usuarios de la Intranet
        elem.setKey(K_WEB_MAIL_LEYENDA);
        elem.setValue(m_webUserMailLeyenda);

        var elem = properties.add(null, C_EXIGIR_CAJA);
        elem.setType(T.check);
        elem.setName(C_EXIGIR_CAJA);
        elem.setValue(Cairo.Util.boolToInt(m_exigirCaja));
        elem.setKey(K_EXIGIR_CAJA);

        var elem = properties.add(null, C_COBRANZA_POR_CAJERO);
        elem.setType(T.check);
        elem.setName(C_COBRANZA_POR_CAJERO);
        elem.setValue(Cairo.Util.boolToInt(m_cobranzaPorCajero));
        elem.setKey(K_COBRANZA_POR_CAJERO);

        var elem = properties.add(null, C_VENTAS_POR_HOJA_DE_RUTA);
        elem.setType(T.check);
        elem.setName(C_VENTAS_POR_HOJA_DE_RUTA);
        elem.setValue(Cairo.Util.boolToInt(m_ventasPorHojaDeRuta));
        elem.setKey(K_VENTAS_POR_HOJADERUTA);

        var elem = properties.add(null, C_EXIGIR_CENTRO_COSTO);
        elem.setType(T.check);
        elem.setName(C_EXIGIR_CENTRO_COSTO);
        elem.setValue(Cairo.Util.boolToInt(m_exigirCentroCosto));
        elem.setKey(K_EXIGIR_CENTRO_COSTO);

        elem = properties.add(null, C_PERCEPCION);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridPercepcion(elem);
        loadPercepcion(elem);
        elem.setName(C_PERCEPCION);
        elem.setKey(K_PERC_ID);
        elem.setTabIndex(tab_percepcion);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        var elem = properties.add(null, C.CLI_RAZONSOCIAL);
        elem.setType(T.text);
        elem.setName(Cairo.Language.getText(1178, "")); // Razon Social
        elem.setSize(255);
        elem.setKey(K_RAZON_SOCIAL);
        elem.setValue(m_razonSocial);
        elem.setTabIndex(tab_clientesPV);

        var elem = properties.add(null, C.CLI_CAT_FISCAL);
        elem.setType(T.list);
        elem.setName(getText(1181, "")); // Categoria Fiscal
        elem.setKey(K_CAT_FISCAL);
        elem.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
        elem.setListItemData(m_catFiscal);
        elem.setTabIndex(tab_clientesPV);

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

        var elem = properties.add(null, C.CPG_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CONDICIONES_DE_PAGO);
        elem.setName(Cairo.Language.getText(1395, "")); // Condición de pago
        elem.setKey(K_CPG_ID);
        elem.setValue(m_condicionPago);
        elem.setSelectId(m_cpgId);
        elem.setTabIndex(tab_clientesPV);

        var elem = properties.add(null, C.LP_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LISTAS_DE_PRECIOS);

        var filter = "lp_tipo = 1";

        elem.setSelectFilter(filter);
        elem.setName(Cairo.Language.getText(1397, "")); // Lista de precios
        elem.setKey(K_LP_ID);
        elem.setValue(m_listaPrecio);
        elem.setSelectId(m_lpId);
        elem.setTabIndex(tab_clientesPV);

        var elem = properties.add(null, C.PRO_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PROVINCIA);
        elem.setName(Cairo.Language.getText(1080, "")); // Provincia
        elem.setKey(K_PRO_ID);
        elem.setValue(m_provincia);
        elem.setSelectId(m_proId);
        elem.setTabIndex(tab_clientesPV);

        var elem = properties.add(null, C.ZON_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.ZONA);
        elem.setName(Cairo.Language.getText(1402, "")); // Zona
        elem.setKey(K_ZON_ID);
        elem.setValue(m_zona);
        elem.setSelectId(m_zonId);
        elem.setTabIndex(tab_clientesPV);

        var elem = properties.add(null, C_DOC_FACTURA_FALTANTE);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setSelectFilter("generic_filter|doct_id:=:1");
        elem.setName(Cairo.Language.getText(4937, "")); // Documento de Factura por Faltante
        elem.setKey(K_DOC_ID_FALTANTE);
        elem.setValue(m_docFaltante);
        elem.setSelectId(m_docIdFaltante);
        elem.setTabIndex(tab_hojaRuta);

        var elem = properties.add(null, C_DOC_MOVIMIENTO_SOBRANTE);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setSelectFilter("generic_filter|doct_id:=:26");
        elem.setName(Cairo.Language.getText(4938, "")); // Documento de Movimiento de Fondos Sobrantes
        elem.setKey(K_DOC_ID_SOBRANTE);
        elem.setValue(m_docSobrante);
        elem.setSelectId(m_docIdSobrante);
        elem.setTabIndex(tab_hojaRuta);

        var elem = properties.add(null, C_DOC_MOVIMIENTO_TICKET);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setSelectFilter("generic_filter|doct_id:=:26");
        elem.setName(Cairo.Language.getText(4939, "")); // Documento de Movimiento de Fondos Tickets
        elem.setKey(K_DOC_ID_TICKETS);
        elem.setValue(m_docTickets);
        elem.setSelectId(m_docIdTickets);
        elem.setTabIndex(tab_hojaRuta);

        var elem = properties.add(null, C_PR_ID_FALTANTE);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PRODUCTOS_DE_VENTA);
        elem.setName(Cairo.Language.getText(4942, "")); // Articulo para Faltantes en Rendiciones
        elem.setKey(K_PR_ID_FALTANTES);
        elem.setValue(m_productoFaltantes);
        elem.setSelectId(m_prIdFaltantes);
        elem.setTabIndex(tab_hojaRuta);

        var elem = properties.add(null, C_CUE_ID_SOBRANTE);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setName(Cairo.Language.getText(4943, "")); // Cuenta para Sobrantes en Rendiciones
        elem.setKey(K_CUE_ID_SOBRANTES);
        elem.setValue(m_cuentaSobrantes);
        elem.setSelectId(m_cueIdSobrantes);
        elem.setTabIndex(tab_hojaRuta);

        var elem = properties.add(null, C_CUE_ID_TICKETS);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setName(Cairo.Language.getText(4944, "")); // Cuenta para Tickets en Rendiciones
        elem.setKey(K_CUE_ID_TICKETS);
        elem.setValue(m_cuentaTickets);
        elem.setSelectId(m_cueIdTickets);
        elem.setTabIndex(tab_hojaRuta);

        return m_dialog.show(self);
      };

      var setGridPercepcion = function(property) {
        var grid = property.getGrid();
        var columns = grid.getColumns();
        columns.clear();

        var elem = columns.add(null);
        elem.setVisible(false);

        elem = columns.add(null);
        elem.setName(Cairo.Language.getText(1252, "")); // Percepcion
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PERCEPCION);
        elem.setKey(KI_PERC_ID);

        grid.getRows().clear();
      }

      var loadPercepcion = function(property) {
        var rows = property.getGrid().getRows();
        rows.clear();

        for(var _i = 0; _i < m_settings.length; _i += 1) {

          switch (getValue(m_settings[_i], C.CONFIG_KEY)) {

            case C_PERCEPCION:

              var row = rows.add(null);
              row.add(null);

              var value = getValue(m_settings[_i], C.CONFIG_VALUE);
              var elem = row.add(null);
              elem.setValue(value.name);
              elem.setId(value.id);
              elem.setKey(KI_PERC_ID);

              break;
          }
        }
        return true;
      };

      var refreshCollection = function() {

        var properties = m_dialog.getProperties();

        var elem = properties.item(C_CUE_ID_DESC_GLOBAL);
        elem.setSelectId(m_cueIdDescGlobal);
        elem.setValue(m_cuentaDescGlobal);

        var elem = properties.item(C_GRABAR_ASIENTO);
        elem.setValue(Cairo.Util.boolToInt(m_grabarAsiento));

        var elem = properties.item(C_APLIC_CLIENTE_FAMILIA);
        elem.setValue(Cairo.Util.boolToInt(m_aplicClienteFamilia));

        var elem = properties.item(C_USAR_LISTA_PRECIO_PRECIO);
        elem.setValue(Cairo.Util.boolToInt(m_usarListaPrecioPrecio));

        var elem = properties.item(C_REDONDEO_EN_PRECIOS);
        elem.setValue(Cairo.Util.boolToInt(m_redondoEnPrecios));

        var elem = properties.item(C_DECIMALES_EN_PRECIOS);
        elem.setValue(m_decimalesEnPrecio);

        var elem = properties.item(C_RESTO_ENTERO);
        elem.setValue(m_restoEntero);

        var elem = properties.item(C_WEB_USER_MAIL_LEYENDA);
        elem.setValue(m_webUserMailLeyenda);

        var elem = properties.item(C_EXIGIR_CAJA);
        elem.setValue(Cairo.Util.boolToInt(m_exigirCaja));

        var elem = properties.item(C_COBRANZA_POR_CAJERO);
        elem.setValue(Cairo.Util.boolToInt(m_cobranzaPorCajero));

        var elem = properties.item(C_VENTAS_POR_HOJA_DE_RUTA);
        elem.setValue(Cairo.Util.boolToInt(m_ventasPorHojaDeRuta));

        var elem = properties.item(C_EXIGIR_CENTRO_COSTO);
        elem.setValue(Cairo.Util.boolToInt(m_exigirCentroCosto));

        var elem = properties.item(C.CLI_RAZONSOCIAL);
        elem.setValue(m_razonSocial);

        var elem = properties.item(C.CLI_CAT_FISCAL);
        elem.setListItemData(m_catFiscal);

        var elem = properties.item(C.CPG_ID);
        elem.setValue(m_condicionPago);
        elem.setSelectId(m_cpgId);

        var elem = properties.item(C.LP_ID);
        elem.setValue(m_listaPrecio);
        elem.setSelectId(m_lpId);

        var elem = properties.item(C.PRO_ID);
        elem.setValue(m_provincia);
        elem.setSelectId(m_proId);

        var elem = properties.item(C.ZON_ID);
        elem.setValue(m_zona);
        elem.setSelectId(m_zonId);

        var elem = properties.item(C_DOC_FACTURA_FALTANTE);
        elem.setValue(m_docFaltante);
        elem.setSelectId(m_docIdFaltante);

        var elem = properties.item(C_DOC_MOVIMIENTO_SOBRANTE);
        elem.setValue(m_docSobrante);
        elem.setSelectId(m_docIdSobrante);

        var elem = properties.item(C_DOC_MOVIMIENTO_TICKET);
        elem.setValue(m_docTickets);
        elem.setSelectId(m_docIdTickets);

        var elem = properties.item(C_PR_ID_FALTANTE);
        elem.setValue(m_productoFaltantes);
        elem.setSelectId(m_prIdFaltantes);

        var elem = properties.item(C_CUE_ID_SOBRANTE);
        elem.setValue(m_cuentaSobrantes);
        elem.setSelectId(m_cueIdSobrantes);

        var elem = properties.item(C_CUE_ID_TICKETS);
        elem.setValue(m_cuentaTickets);
        elem.setSelectId(m_cueIdTickets);

        loadPercepcion(getPercepcion());

        return m_dialog.showValues(properties);
      };

      // TODO: implement grid for percepciones

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
      var editor = Cairo.VentaConfig.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit();
    };

    Edit.Controller = { getEditor: createObject, edit: showEditor };

  });

}());