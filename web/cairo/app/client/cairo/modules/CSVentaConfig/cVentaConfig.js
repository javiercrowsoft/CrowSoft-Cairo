(function() {
  "use strict";

  Cairo.module("VentaConfig.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      var getText = Cairo.Language.getText;

      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;
      var T = Dialogs.PropertyType;

      var C_MODULE = "cVentaConfigEdit";

      var K_CUE_ID_DESCUENTO = 1;
      var K_GRABAR_ASIENTO = 2;
      var K_WEBMAIL_LEYENDA = 3;
      var K_APLIC_CLIENTE_FAMILIA = 4;
      var K_DECIMALES_EN_PRECIOS = 5;
      var K_RESTO_ENTERO = 6;
      var K_REDONDEO_EN_PRECIOS = 7;
      var K_USAR_LISTAPRECIOPRECIO = 8;
      var K_RAZONSOCIAL = 9;
      var K_CATFISCAL = 10;
      var K_CPG_ID = 11;
      var K_LP_ID = 12;
      var K_PRO_ID = 13;
      var K_ZON_ID = 14;
      var K_PERC_ID = 15;
      var K_EXIGIR_CAJA = 16;
      var K_EXIGIR_CENTROCOSTO = 17;

      var K_DOC_ID_SOBRANTE = 18;
      var K_DOC_ID_FALTANTE = 19;
      var K_DOC_ID_TICKETS = 20;

      var K_CUE_ID_SOBRANTES = 21;
      var K_CUE_ID_TICKETS = 22;
      var K_PR_ID_FALTANTES = 23;

      var K_COBRANZA_POR_CAJERO = 24;
      var K_VENTAS_POR_HOJADERUTA = 25;

      var KI_PERC_ID = 16;

      var C_GRUPOGENERAL = "Ventas-General";
      var C_CUEIDDESCGLOBAL = "Cuenta Descuento Global";
      var C_GRABARASIENTO = "Grabar Asiento";
      var C_WEBUSERMAILLEYENDA = "Leyenda para Usuarios de la Intranet";
      var C_APLICCLIENTEFAMILIA = "Aplicaciones entre Grupos de Clientes";
      var C_REDONDEOENPRECIOS = "Redondear Decimales en Precios";
      var C_DECIMALESENPRECIOS = "Decimales en Precios";
      var C_RESTOENTERO = "Restar a precios enteros";
      var C_USARLISTAPRECIOPRECIO = "Utilizar Cache de Precios";
      var C_EXIGIRCAJA = "Exigir que la Caja Este Abierta para Facturar";
      var C_EXIGIRCENTROCOSTO = "Exigir Centro Costo";
      var C_COBRANZAPORCAJERO = "Concentrar Cobranzas en Cajero";
      var C_VENTASPORHOJADERUTA = "Ventas por Hoja de Ruta";

      var C_DOCFACTURAFALTANTE = "Factura x Faltante en Hoja Ruta";
      var C_DOCMOVIMIENTOSOBRANTE = "Mov. Fondo Sobrante en Hoja Ruta";
      var C_DOCMOVIMIENTOTICKET = "Mov. Fondo Tickets en Hoja Ruta";
      var C_CUEIDTICKETS = "Cuenta Comision sobre Tickets";
      var C_CUEIDSOBRANTE = "Cuenta para Sobrante en Rendicion";
      var C_PRIDFALTANTE = "Articulo para Faltantes en Rendicion";

      var C_PERCEPCION = "Percepcion";
      var C_CLIENTESPV = "ClientesPV";

      var C_PV_CLI_RAZONSOCIAL = C_CLIENTESPV + C.CLI_RAZONSOCIAL;
      var C_PV_CLI_CAT_FISCAL = C_CLIENTESPV + C.CLI_CAT_FISCAL;
      var C_PV_CPG_ID = C_CLIENTESPV + C.CPG_ID;
      var C_PV_LP_ID = C_CLIENTESPV + C.LP_ID;
      var C_PV_PRO_ID = C_CLIENTESPV + C.PRO_ID;
      var C_PV_ZON_ID = C_CLIENTESPV + C.ZON_ID;

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
      var m_ventasPorHojadeRuta;

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

      var CONFIG_KEY = "cfg_aspecto";
      var CONFIG_VALUE = "cfg_valor";

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
      self.getVentasPorHojadeRuta = function() {
        return m_ventasPorHojadeRuta;
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

      var createRegister = function() {
        var register = new DB.Register();
        register.setTable(C.CONFIGURACION);
        return register;
      };
      
      self.save = function() {
        var register = null;

        var mainRegister = new DB.Register();
        var transaction = DB.createTransaction();

        var companyId = Cairo.Company.getId().toString();

        transaction.setTable(C.CONFIGURACION)

        for(var _i = 0, _count = m_dialog.getProperties().size(); _i < _count; _i++) {

          var property = m_dialog.getProperties().item(_i);

          switch (property.getKey()) {

            case K_CUE_ID_DESCUENTO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_CUEIDDESCGLOBAL));

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_CUEIDDESCGLOBAL, TEXT);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), TEXT);

              transaction.addRegister(register);
              break;

            case K_GRABAR_ASIENTO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_GRABARASIENTO));

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_GRABARASIENTO, TEXT);
              w_fields.add(CONFIG_VALUE, Cairo.Util.val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_WEBMAIL_LEYENDA:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_WEBUSERMAILLEYENDA));

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_WEBUSERMAILLEYENDA, TEXT);
              w_fields.add(CONFIG_VALUE, property.getValue(), TEXT);

              transaction.addRegister(register);
              break;

            case K_EXIGIR_CAJA:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_EXIGIRCAJA));

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_EXIGIRCAJA, TEXT);
              w_fields.add(CONFIG_VALUE, property.getValue(), TEXT);

              transaction.addRegister(register);
              break;

            case K_EXIGIR_CENTROCOSTO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_EXIGIRCENTROCOSTO));

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_EXIGIRCENTROCOSTO, TEXT);
              w_fields.add(CONFIG_VALUE, property.getValue(), TEXT);

              transaction.addRegister(register);
              break;

            case K_APLIC_CLIENTE_FAMILIA:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_APLICCLIENTEFAMILIA));

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_APLICCLIENTEFAMILIA, TEXT);
              w_fields.add(CONFIG_VALUE, Cairo.Util.val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_REDONDEO_EN_PRECIOS:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_REDONDEOENPRECIOS));

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_REDONDEOENPRECIOS, TEXT);
              w_fields.add(CONFIG_VALUE, Cairo.Util.val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_USAR_LISTAPRECIOPRECIO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_USARLISTAPRECIOPRECIO));

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_USARLISTAPRECIOPRECIO, TEXT);
              w_fields.add(CONFIG_VALUE, Cairo.Util.val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_DECIMALES_EN_PRECIOS:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_DECIMALESENPRECIOS));

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_DECIMALESENPRECIOS, TEXT);
              w_fields.add(CONFIG_VALUE, Cairo.Util.val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_RESTO_ENTERO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_RESTOENTERO));

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_RESTOENTERO, TEXT);
              w_fields.add(CONFIG_VALUE, Cairo.Util.val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_RAZONSOCIAL:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_PV_CLI_RAZONSOCIAL));

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_PV_CLI_RAZONSOCIAL, TEXT);
              w_fields.add(CONFIG_VALUE, property.getValue(), TEXT);

              transaction.addRegister(register);
              break;

            case K_CATFISCAL:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_PV_CLI_CAT_FISCAL));

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_PV_CLI_CAT_FISCAL, TEXT);
              w_fields.add(CONFIG_VALUE, property.getListItemData(), TEXT);

              transaction.addRegister(register);
              break;

            case K_CPG_ID:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_PV_CPG_ID));

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_PV_CPG_ID, TEXT);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), TEXT);

              transaction.addRegister(register);
              break;

            case K_LP_ID:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_PV_LP_ID));

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_PV_LP_ID, TEXT);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), TEXT);

              transaction.addRegister(register);
              break;

            case K_PRO_ID:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_PV_PRO_ID));

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_PV_PRO_ID, TEXT);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), TEXT);

              transaction.addRegister(register);
              break;

            case K_ZON_ID:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_PV_ZON_ID));

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_PV_ZON_ID, TEXT);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), TEXT);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_FALTANTE:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_DOCFACTURAFALTANTE) + ", emp_id:" + companyId);

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_DOCFACTURAFALTANTE, TEXT);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), TEXT);
              w_fields.add(EMP_ID, companyId, ID);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_SOBRANTE:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_DOCMOVIMIENTOSOBRANTE) + ", emp_id:" + companyId);

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_DOCMOVIMIENTOSOBRANTE, TEXT);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), TEXT);
              w_fields.add(EMP_ID, companyId, ID);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_TICKETS:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_DOCMOVIMIENTOTICKET) + ", emp_id:" + companyId);

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_DOCMOVIMIENTOTICKET, TEXT);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), TEXT);
              w_fields.add(EMP_ID, companyId, ID);

              transaction.addRegister(register);
              break;

            case K_PR_ID_FALTANTES:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_PRIDFALTANTE) + ", emp_id:" + companyId);

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_PRIDFALTANTE, TEXT);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), TEXT);
              w_fields.add(EMP_ID, companyId, ID);

              transaction.addRegister(register);
              break;

            case K_CUE_ID_SOBRANTES:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_CUEIDSOBRANTE) + ", emp_id:" + companyId);

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_CUEIDSOBRANTE, TEXT);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), TEXT);
              w_fields.add(EMP_ID, companyId, ID);

              transaction.addRegister(register);
              break;

            case K_CUE_ID_TICKETS:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_CUEIDTICKETS) + ", emp_id:" + companyId);

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_CUEIDTICKETS, TEXT);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), TEXT);
              w_fields.add(EMP_ID, companyId, ID);

              transaction.addRegister(register);
              break;

            case K_COBRANZA_POR_CAJERO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_COBRANZAPORCAJERO));

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_COBRANZAPORCAJERO, TEXT);
              w_fields.add(CONFIG_VALUE, property.getValue(), TEXT);

              transaction.addRegister(register);
              break;

            case K_COBRANZA_POR_CAJERO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_COBRANZAPORCAJERO));

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_COBRANZAPORCAJERO, TEXT);
              w_fields.add(CONFIG_VALUE, property.getValue(), TEXT);

              transaction.addRegister(register);
              break;

            case K_VENTAS_POR_HOJADERUTA:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_VENTASPORHOJADERUTA));

              var w_fields = register.getFields();
              w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              w_fields.add(CONFIG_KEY, C_VENTASPORHOJADERUTA, TEXT);
              w_fields.add(CONFIG_VALUE, property.getValue(), TEXT);

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

      var savePercepcion = function(transaction, companyId) {

        var rows = getPercepcion().getRows();

        for (var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);
          var register = createRegister();

          register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_VENTASPORHOJADERUTA));

          var w_fields = register.getFields();
          w_fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
          w_fields.add(CONFIG_KEY, C_PERCEPCION, TEXT);
          w_fields.add(CONFIG_VALUE, Dialogs.cell(row, KI_PERC_ID).getId(), TEXT);
          w_fields.add(EMP_ID, companyId, ID);

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
              if(property.getSelectId() == Cairo.Constants.NO_ID) {
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
              m_cueIdDescGlobal = Cairo.Constants.NO_ID;
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
              m_ventasPorHojadeRuta = false;

              m_docIdFaltante = Cairo.Constants.NO_ID;
              m_docIdSobrante = Cairo.Constants.NO_ID;
              m_docIdTickets = Cairo.Constants.NO_ID;

              m_docTickets = "";
              m_docSobrante = "";
              m_docFaltante = "";

              m_prIdFaltantes = Cairo.Constants.NO_ID;
              m_cueIdSobrantes = Cairo.Constants.NO_ID;
              m_cueIdTickets = Cairo.Constants.NO_ID;

              m_cuentaTickets = "";
              m_cuentaSobrantes = "";
              m_productoFaltantes = "";

              m_webUserMailLeyenda = Cairo.Language.getText(3205, "");
              // Le notificamos que hemos creado una cuenta de usuario
              // para(que Ud. acceda a nuestra extranet. Usuario: @@usuario Contraseña: @@clave);

              var settings = response.data.get('settings')

              m_settings = settings;

              for(var _i = 0; _i < settings.length; _i += 1) {

                switch (getValue(settings[_i], CONFIG_KEY)) {

                  case C_CUEIDDESCGLOBAL:
                    var value = getValue(settings[_i], CONFIG_VALUE);
                    m_cueIdDescGlobal = value.id;
                    m_cuentaDescGlobal = value.name;
                    break;

                  case C_GRABARASIENTO:
                    m_grabarAsiento = bool(getValue(settings[_i], CONFIG_VALUE));
                    break;

                  case C_WEBUSERMAILLEYENDA:
                    m_webUserMailLeyenda = getValue(settings[_i], CONFIG_VALUE);
                    break;

                  case C_EXIGIRCAJA:
                    m_exigirCaja = bool(getValue(settings[_i], CONFIG_VALUE));
                    break;

                  case C_COBRANZAPORCAJERO:
                    m_cobranzaPorCajero = bool(getValue(settings[_i], CONFIG_VALUE));
                    break;

                  case C_VENTASPORHOJADERUTA:
                    m_ventasPorHojadeRuta = bool(getValue(settings[_i], CONFIG_VALUE));
                    break;

                  case C_EXIGIRCENTROCOSTO:
                    m_exigirCentroCosto = bool(getValue(settings[_i], CONFIG_VALUE));
                    break;

                  case C_APLICCLIENTEFAMILIA:
                    m_aplicClienteFamilia = bool(getValue(settings[_i], CONFIG_VALUE));
                    break;

                  case C_REDONDEOENPRECIOS:
                    m_redondoEnPrecios = bool(getValue(settings[_i], CONFIG_VALUE));
                    break;

                  case C_USARLISTAPRECIOPRECIO:
                    m_usarListaPrecioPrecio = bool(getValue(settings[_i], CONFIG_VALUE));
                    break;

                  case C_DECIMALESENPRECIOS:
                    m_decimalesEnPrecio = val(getValue(settings[_i], CONFIG_VALUE));
                    break;

                  case C_RESTOENTERO:
                    m_restoEntero = val(getValue(settings[_i], CONFIG_VALUE));
                    break;

                  case C_PV_CLI_RAZONSOCIAL:
                    m_razonSocial = getValue(settings[_i], CONFIG_VALUE);
                    break;

                  case C_PV_CLI_CAT_FISCAL:
                    m_catFiscal = val(getValue(settings[_i], CONFIG_VALUE));
                    break;

                  case C_PV_CPG_ID:
                    var value = getValue(settings[_i], CONFIG_VALUE);
                    m_cpgId = value.id;
                    m_condicionPago = value.name;
                    break;

                  case C_PV_LP_ID:
                    var value = getValue(settings[_i], CONFIG_VALUE);
                    m_lpId = value.id;
                    m_listaPrecio = value.name;
                    break;

                  case C_PV_PRO_ID:
                    var value = getValue(settings[_i], CONFIG_VALUE);
                    m_proId = value.id;
                    m_provincia = value.name;
                    break;

                  case C_PV_ZON_ID:
                    var value = getValue(settings[_i], CONFIG_VALUE);
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
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.EDIT_FUNCTION, "cVentaConfig", "");
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

        var elem = properties.add(null, C_CUEIDDESCGLOBAL);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setName(Cairo.Language.getText(3094, "")); // Cuenta de descuento global
        elem.setKey(K_CUE_ID_DESCUENTO);
        elem.setSelectId(m_cueIdDescGlobal);
        elem.setValue(m_cuentaDescGlobal);

        var elem = properties.add(null, C_GRABARASIENTO);
        elem.setType(T.check);
        elem.setName(Cairo.Language.getText(3095, "")); // Grabar asiento al grabar la factura
        elem.setKey(K_GRABAR_ASIENTO);
        elem.setValue(Cairo.Util.boolToInt(m_grabarAsiento));

        var elem = properties.add(null, C_APLICCLIENTEFAMILIA);
        elem.setType(T.check);
        elem.setName(Cairo.Language.getText(3477, "")); // Aplicaciones entre Clientes de un Grupo
        elem.setKey(K_APLIC_CLIENTE_FAMILIA);
        elem.setValue(Cairo.Util.boolToInt(m_aplicClienteFamilia));

        var elem = properties.add(null, C_USARLISTAPRECIOPRECIO);
        elem.setType(T.check);
        elem.setName(Cairo.Language.getText(3597, "")); // Usar Cache de Precios
        elem.setKey(K_USAR_LISTAPRECIOPRECIO);
        elem.setValue(Cairo.Util.boolToInt(m_usarListaPrecioPrecio));

        var elem = properties.add(null, C_REDONDEOENPRECIOS);
        elem.setType(T.check);
        elem.setName(Cairo.Language.getText(3577, "")); // Redondear Decimales en Precios
        elem.setKey(K_REDONDEO_EN_PRECIOS);
        elem.setValue(Cairo.Util.boolToInt(m_redondoEnPrecios));

        var elem = properties.add(null, C_DECIMALESENPRECIOS);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.integer);
        elem.setName(Cairo.Language.getText(3578, "")); // Decimales en precio
        elem.setKey(K_DECIMALES_EN_PRECIOS);
        elem.setValue(m_decimalesEnPrecio);
        elem.setEnabled(m_redondoEnPrecios);

        var elem = properties.add(null, C_RESTOENTERO);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setName(Cairo.Language.getText(3579, "")); // Restar a precios enteros
        elem.setKey(K_RESTO_ENTERO);
        elem.setValue(m_restoEntero);
        elem.setEnabled(m_redondoEnPrecios);

        var elem = properties.add(null, C_WEBUSERMAILLEYENDA);
        elem.setType(T.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setName(Cairo.Language.getText(3206, "")); // Leyenda para Usuarios de la Intranet
        elem.setKey(K_WEBMAIL_LEYENDA);
        elem.setValue(m_webUserMailLeyenda);

        var elem = properties.add(null, C_EXIGIRCAJA);
        elem.setType(T.check);
        elem.setName(C_EXIGIRCAJA);
        elem.setValue(Cairo.Util.boolToInt(m_exigirCaja));
        elem.setKey(K_EXIGIR_CAJA);

        var elem = properties.add(null, C_COBRANZAPORCAJERO);
        elem.setType(T.check);
        elem.setName(C_COBRANZAPORCAJERO);
        elem.setValue(Cairo.Util.boolToInt(m_cobranzaPorCajero));
        elem.setKey(K_COBRANZA_POR_CAJERO);

        var elem = properties.add(null, C_VENTASPORHOJADERUTA);
        elem.setType(T.check);
        elem.setName(C_VENTASPORHOJADERUTA);
        elem.setValue(Cairo.Util.boolToInt(m_ventasPorHojadeRuta));
        elem.setKey(K_VENTAS_POR_HOJADERUTA);

        var elem = properties.add(null, C_EXIGIRCENTROCOSTO);
        elem.setType(T.check);
        elem.setName(C_EXIGIRCENTROCOSTO);
        elem.setValue(Cairo.Util.boolToInt(m_exigirCentroCosto));
        elem.setKey(K_EXIGIR_CENTROCOSTO);

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
        elem.setKey(K_RAZONSOCIAL);
        elem.setValue(m_razonSocial);
        elem.setTabIndex(tab_clientesPV);

        var elem = properties.add(null, C.CLI_CAT_FISCAL);
        elem.setType(T.list);
        elem.setName(getText(1181, "")); // Categoria Fiscal
        elem.setKey(K_CATFISCAL);
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

        var filter = null;

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

        filter = "lp_tipo = 1";

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

        var elem = properties.add(null, C_DOCFACTURAFALTANTE);
        elem.setType(T.select);
        elem.setTable(Cairo.Tables.DOCUMENTO);
        elem.setSelectFilter("doct_id = 1");
        elem.setName(Cairo.Language.getText(4937, "")); // Documento de Factura por Faltante
        elem.setKey(K_DOC_ID_FALTANTE);
        elem.setValue(m_docFaltante);
        elem.setSelectId(m_docIdFaltante);
        elem.setTabIndex(tab_hojaRuta);

        var elem = properties.add(null, C_DOCMOVIMIENTOSOBRANTE);
        elem.setType(T.select);
        elem.setTable(Cairo.Tables.DOCUMENTO);
        elem.setSelectFilter("doct_id = 26");
        elem.setName(Cairo.Language.getText(4938, "")); // Documento de Movimiento de Fondos Sobrantes
        elem.setKey(K_DOC_ID_SOBRANTE);
        elem.setValue(m_docSobrante);
        elem.setSelectId(m_docIdSobrante);
        elem.setTabIndex(tab_hojaRuta);

        var elem = properties.add(null, C_DOCMOVIMIENTOTICKET);
        elem.setType(T.select);
        elem.setTable(Cairo.Tables.DOCUMENTO);
        elem.setSelectFilter("doct_id = 26");
        elem.setName(Cairo.Language.getText(4939, "")); // Documento de Movimiento de Fondos Tickets
        elem.setKey(K_DOC_ID_TICKETS);
        elem.setValue(m_docTickets);
        elem.setSelectId(m_docIdTickets);
        elem.setTabIndex(tab_hojaRuta);

        var elem = properties.add(null, C_PRIDFALTANTE);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PRODUCTOS_DE_VENTA);
        elem.setName(Cairo.Language.getText(4942, "")); // Articulo para Faltantes en Rendiciones
        elem.setKey(K_PR_ID_FALTANTES);
        elem.setValue(m_productoFaltantes);
        elem.setSelectId(m_prIdFaltantes);
        elem.setTabIndex(tab_hojaRuta);

        var elem = properties.add(null, C_CUEIDSOBRANTE);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setName(Cairo.Language.getText(4943, "")); // Cuenta para Sobrantes en Rendiciones
        elem.setKey(K_CUE_ID_SOBRANTES);
        elem.setValue(m_cuentaSobrantes);
        elem.setSelectId(m_cueIdSobrantes);
        elem.setTabIndex(tab_hojaRuta);

        var elem = properties.add(null, C_CUEIDTICKETS);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setName(Cairo.Language.getText(4944, "")); // Cuenta para Tickets en Rendiciones
        elem.setKey(K_CUE_ID_TICKETS);
        elem.setValue(m_cuentaTickets);
        elem.setSelectId(m_cueIdTickets);
        elem.setTabIndex(tab_hojaRuta);

        if(!m_dialog.show(self)) { return false; }

        return true;
      };

      var setGridPercepcion = function(property) {
        var grid = property.getGrid();

        grid.getColumns().clear();
        grid.getRows().clear();

        var columns = grid.getColumns();

        var elem = columns.add(null);
        elem.setVisible(false);

        var elem = columns.add(null);
        elem.setName(Cairo.Language.getText(1252, "")); // Percepcion
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PERCEPCION);
        elem.setKey(KI_PERC_ID);
      }

      var loadPercepcion = function(grid) {
        var rows = grid.getRows();
        rows.clear();

        for(var _i = 0; _i < m_settings.length; _i += 1) {

          switch (getValue(m_settings[_i], CONFIG_KEY)) {

            case C_PERCEPCION:

              var row = rows.add(null);
              row.add(null);

              var value = getValue(m_settings[_i], CONFIG_VALUE);
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

        var elem = properties.item(C_CUEIDDESCGLOBAL);
        elem.setSelectId(m_cueIdDescGlobal);
        elem.setValue(m_cuentaDescGlobal);

        var elem = properties.item(C_GRABARASIENTO);
        elem.setValue(Cairo.Util.boolToInt(m_grabarAsiento));

        var elem = properties.item(C_APLICCLIENTEFAMILIA);
        elem.setValue(Cairo.Util.boolToInt(m_aplicClienteFamilia));

        var elem = properties.item(C_USARLISTAPRECIOPRECIO);
        elem.setValue(Cairo.Util.boolToInt(m_usarListaPrecioPrecio));

        var elem = properties.item(C_REDONDEOENPRECIOS);
        elem.setValue(Cairo.Util.boolToInt(m_redondoEnPrecios));

        var elem = properties.item(C_DECIMALESENPRECIOS);
        elem.setValue(m_decimalesEnPrecio);

        var elem = properties.item(C_RESTOENTERO);
        elem.setValue(m_restoEntero);

        var elem = properties.item(C_WEBUSERMAILLEYENDA);
        elem.setValue(m_webUserMailLeyenda);

        var elem = properties.item(C_EXIGIRCAJA);
        elem.setValue(Cairo.Util.boolToInt(m_exigirCaja));

        var elem = properties.item(C_COBRANZAPORCAJERO);
        elem.setValue(Cairo.Util.boolToInt(m_cobranzaPorCajero));

        var elem = properties.item(C_VENTASPORHOJADERUTA);
        elem.setValue(Cairo.Util.boolToInt(m_ventasPorHojadeRuta));

        var elem = properties.item(C_EXIGIRCENTROCOSTO);
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

        var elem = properties.item(C_DOCFACTURAFALTANTE);
        elem.setValue(m_docFaltante);
        elem.setSelectId(m_docIdFaltante);

        var elem = properties.item(C_DOCMOVIMIENTOSOBRANTE);
        elem.setValue(m_docSobrante);
        elem.setSelectId(m_docIdSobrante);

        var elem = properties.item(C_DOCMOVIMIENTOTICKET);
        elem.setValue(m_docTickets);
        elem.setSelectId(m_docIdTickets);

        var elem = properties.item(C_PRIDFALTANTE);
        elem.setValue(m_productoFaltantes);
        elem.setSelectId(m_prIdFaltantes);

        var elem = properties.item(C_CUEIDSOBRANTE);
        elem.setValue(m_cuentaSobrantes);
        elem.setSelectId(m_cueIdSobrantes);

        var elem = properties.item(C_CUEIDTICKETS);
        elem.setValue(m_cuentaTickets);
        elem.setSelectId(m_cueIdTickets);

        loadPercepcion(getPercepcion());

        return m_dialog.showValues(properties);
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

    var showEditor = function() {
      var editor = Cairo.VentaConfig.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit();
    };

    Edit.Controller = { getEditor: createObject, edit: showEditor };

  });

}());