(function() {
  "use strict";

  Cairo.module("TesoreriaConfig.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var CT = Cairo.Tesoreria.Constants;
      var NO_ID = C.NO_ID;
      var T = Dialogs.PropertyType;

      var C_MODULE = "cTesoreriaConfigEdit";

      var K_CUE_ID_DIFCAMBIO = 1;
      var K_DOC_ID_NC_DIFCAMBIO = 2;
      var K_DOC_ID_ND_DIFCAMBIO = 3;
      var K_DEFAULT_DIFCAMBIO = 4;
      var K_MODO_IVA_DIFCAMBIO = 5;
      var K_APLICACION_DIFCAMBIO = 101;
      var K_PR_ID_DIFCAMBIO = 6;

      var K_DOC_ID_COBRANZA = 7;
      var K_DOC_ID_ORDENPAGO = 8;

      var K_GRABAR_ASIENTO_COBRANZA = 9;
      var K_GRABAR_ASIENTO_ORDENPAGO = 10;
      var K_GRABAR_ASIENTO_MOVIMIENTOFONDO = 11;
      var K_GRABAR_ASIENTO_RENDICION = 12;
      var K_GRABAR_ASIENTO_DEPOSITOBANCO = 13;
      var K_GRABAR_ASIENTO_DEPOSITOCUPON = 14;
      var K_GRABAR_ASIENTO_RESOLUCIONCUPON = 15;

      var K_CALCULAR_RETENCIONES = 16;
      var K_RET_ID = 17;
      var KI_RET_ID = 1;

      var K_CUE_ID_ANT_COBZ = 18;
      var K_CUE_ID_ANT_OPG = 19;

      var K_GRABAR_ASIENTO_AGRUPADO = 20;

      var K_EXIGIR_CENTROCOSTO = 21;
      var K_COBRANZAS_XHOJARUTA = 22;

      var CSTBLDOCUMENTO = 4001;

      var C_GRUPOGENERAL = "Tesoreria-General";
      var C_CUEIDDIFCAMBIO = "Cuenta contable";
      var C_NCDIFCAMBIO = "Nota de credito";
      var C_NDDIFCAMBIO = "Nota de debito";
      var C_DEFAULTDIFCAMBIO = "Utilizar";
      var C_MODOIVADIFCAMBIO = "Tratamiento del Iva";
      var C_APLICACIONDIFCAMBIO = "Aplicación Dif. Cambio";
      var C_PRIDDIFCAMBIO = "Articulo";

      var C_GRABARASIENTOCOBRANZA = "Cobranza-Grabar Asiento";
      var C_GRABARASIENTOORDENPAGO = "OrdenPago-Grabar Asiento";
      var C_GRABARASIENTOMOVIMIENTOFONDO = "MovimientoFondo-Grabar Asiento";
      var C_GRABARASIENTORENDICION = "Rendicion-Grabar Asiento";
      var C_GRABARASIENTODEPOSITOBANCO = "DepositoBanco-Grabar Asiento";
      var C_GRABARASIENTODEPOSITOCUPON = "DepositoCupon-Grabar Asiento";
      var C_GRABARASIENTORESOLUCIONCUPON = "ResolucionCupon-Grabar Asiento";
      var C_GRABARASIENTOAGRUPADO = "Asiento Agrupado";

      var C_CALCULARRETENCIONES = "Calcular Retenciones";
      var C_RETENCION = "Retencion";

      var C_DOCIDCOBRANZA = "Cobranza";
      var C_DOCIDORDENPAGO = "Orden Pago";

      var C_CUENTAANTICIPOCOBRANZA = "Cuenta Anticipo Cobranzas";
      var C_CUENTAANTICIPOPAGOS = "Cuenta Anticipo Ordenes de Pago";

      var C_EXIGIRCENTROCOSTO = "Exigir Centro Costo";
      var C_COBRANZASXHOJARUTA = "Cobranzas por Hoja de Ruta";

      var m_cueIdDifCambio = 0;
      var m_cuentaDifCambio = "";

      var m_docIdNCdifCambio = 0;
      var m_docNCDifCambio = "";

      var m_docIdNDdifCambio = 0;
      var m_docNDDifCambio = "";

      var m_prIdDifCambio = 0;
      var m_productoDifCambio = "";

      var m_docIdCobranza = 0;
      var m_docCobranza = "";

      var m_docIdOrdenPago = 0;
      var m_docOrdenPago = "";

      var m_defaultDifCambio;
      var m_modoIvaDifCambio;
      var m_aplicacionDifCambio;

      var m_grabarAsientoCobranza;
      var m_grabarAsientoDepositoBanco;
      var m_grabarAsientoOrdenPago;
      var m_grabarAsientoMovimientoFondo;
      var m_grabarAsientoRendicion;
      var m_grabarAsientoDepositoCupon;
      var m_grabarAsientoResolucionCupon;
      var m_grabarAsientoAgrupado;

      var m_calcularRetenciones;

      var m_cueAnticipoCobz = "";
      var m_cueAnticipoOpg = "";

      var m_cueIdAntCobz = 0;
      var m_cueIdAntOpg = 0;

      var m_exigirCentroCosto;
      var m_cobranzasXHojaRuta;

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
      var TEXT = C.Types.text;
      var ID = C.Types.id;

      self.getCueIdDifCambio = function() {
        return m_cueIdDifCambio;
      };

      self.getCuentaDifCambio = function() {
        return m_cuentaDifCambio;
      };

      self.getCueAnticipoCobz = function() {
        return m_cueAnticipoCobz;
      };

      self.getCueIdAntCobz = function() {
        return m_cueIdAntCobz;
      };

      self.getCueAnticipoOpg = function() {
        return m_cueAnticipoOpg;
      };

      self.getCueIdAntOpg = function() {
        return m_cueIdAntOpg;
      };

      self.getDocIdNCDifCambio = function() {
        return m_docIdNCdifCambio;
      };

      self.getDocNCDifCambio = function() {
        return m_docNCDifCambio;
      };

      self.getDocIdNDDifCambio = function() {
        return m_docIdNDdifCambio;
      };

      self.getDocNDDifCambio = function() {
        return m_docNDDifCambio;
      };

      self.getPrIdDifCambio = function() {
        return m_prIdDifCambio;
      };

      self.getProductoDifCambio = function() {
        return m_productoDifCambio;
      };

      self.getDefaultDifCambio = function() {
        return m_defaultDifCambio;
      };

      self.getModoIvaDifCambio = function() {
        return m_modoIvaDifCambio;
      };

      self.getAplicacionDifCambio = function() {
        return m_aplicacionDifCambio;
      };

      self.getDocIdCobranza = function() {
        return m_docIdCobranza;
      };

      self.getDocCobranza = function() {
        return m_docCobranza;
      };

      self.getDocIdOrdenPago = function() {
        return m_docIdOrdenPago;
      };

      self.getDocOrdenPago = function() {
        return m_docOrdenPago;
      };

      self.getGrabarAsientoCobranza = function() {
        return m_grabarAsientoCobranza;
      };

      self.getGrabarAsientoDepositoBanco = function() {
        return m_grabarAsientoDepositoBanco;
      };

      self.getGrabarAsientoOrdenPago = function() {
        return m_grabarAsientoOrdenPago;
      };

      self.getGrabarAsientoMovimientoFondo = function() {
        return m_grabarAsientoMovimientoFondo;
      };

      self.getExigirCentroCosto = function() {
        return m_exigirCentroCosto;
      };

      self.getCobranzasXHojaRuta = function() {
        return m_cobranzasXHojaRuta;
      };

      self.getGrabarAsientoRendicion = function() {
      };

      self.getGrabarAsientoResolucionCupon = function() {
        return m_grabarAsientoResolucionCupon;
      };

      self.getGrabarAsientoDepositoCupon = function() {
        return m_grabarAsientoDepositoCupon;
      };

      self.getGrabarAsientoAgrupado = function() {
        return m_grabarAsientoAgrupado;
      };

      self.getCalcularRetenciones = function() {
        return m_calcularRetenciones;
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

      self.messageEx = function(messageId,  info) {
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
            
            case K_CUE_ID_DIFCAMBIO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_CUEIDDIFCAMBIO));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_CUEIDDIFCAMBIO, TEXT);
              fields.add(C.CFG_VALOR, property.getSelectId(), TEXT);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_COBRANZA:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_DOCIDCOBRANZA) + ", emp_id:" + companyId);

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_DOCIDCOBRANZA, TEXT);
              fields.add(C.CFG_VALOR, property.getSelectId(), TEXT);
              fields.add(C.EMP_ID, companyId, TEXT);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_ORDENPAGO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_DOCIDORDENPAGO) + ", emp_id:" + companyId);

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_DOCIDORDENPAGO, TEXT);
              fields.add(C.CFG_VALOR, property.getSelectId(), TEXT);
              fields.add(C.EMP_ID, companyId, TEXT);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_NC_DIFCAMBIO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_NCDIFCAMBIO) + ", emp_id:" + companyId);

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_NCDIFCAMBIO, TEXT);
              fields.add(C.CFG_VALOR, property.getSelectId(), TEXT);
              fields.add(C.EMP_ID, companyId, TEXT);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_ND_DIFCAMBIO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_NDDIFCAMBIO) + ", emp_id:" + companyId);

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_NDDIFCAMBIO, TEXT);
              fields.add(C.CFG_VALOR, property.getSelectId(), TEXT);
              fields.add(C.EMP_ID, companyId, TEXT);

              transaction.addRegister(register);
              break;

            case K_DEFAULT_DIFCAMBIO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_DEFAULTDIFCAMBIO));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_DEFAULTDIFCAMBIO, TEXT);
              fields.add(C.CFG_VALOR, property.getListItemData(), TEXT);

              transaction.addRegister(register);
              break;

            case K_MODO_IVA_DIFCAMBIO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_MODOIVADIFCAMBIO));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_MODOIVADIFCAMBIO, TEXT);
              fields.add(C.CFG_VALOR, property.getListItemData(), TEXT);

              transaction.addRegister(register);
              break;

            case K_APLICACION_DIFCAMBIO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_APLICACIONDIFCAMBIO));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_APLICACIONDIFCAMBIO, TEXT);
              fields.add(C.CFG_VALOR, property.getListItemData(), TEXT);

              transaction.addRegister(register);
              break;

            case K_PR_ID_DIFCAMBIO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_PRIDDIFCAMBIO));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_PRIDDIFCAMBIO, TEXT);
              fields.add(C.CFG_VALOR, property.getSelectId(), TEXT);

              transaction.addRegister(register);
              break;

            case K_GRABAR_ASIENTO_COBRANZA:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_GRABARASIENTOCOBRANZA));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_GRABARASIENTOCOBRANZA, TEXT);
              fields.add(C.CFG_VALOR, Cairo.Util.val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_GRABAR_ASIENTO_ORDENPAGO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_GRABARASIENTOORDENPAGO));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_GRABARASIENTOORDENPAGO, TEXT);
              fields.add(C.CFG_VALOR, Cairo.Util.val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_GRABAR_ASIENTO_MOVIMIENTOFONDO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_GRABARASIENTOMOVIMIENTOFONDO));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_GRABARASIENTOMOVIMIENTOFONDO, TEXT);
              fields.add(C.CFG_VALOR, Cairo.Util.val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_GRABAR_ASIENTO_RENDICION:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_GRABARASIENTORENDICION));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_GRABARASIENTORENDICION, TEXT);
              fields.add(C.CFG_VALOR, Cairo.Util.val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_GRABAR_ASIENTO_DEPOSITOBANCO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_GRABARASIENTODEPOSITOBANCO));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_GRABARASIENTODEPOSITOBANCO, TEXT);
              fields.add(C.CFG_VALOR, Cairo.Util.val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_GRABAR_ASIENTO_DEPOSITOCUPON:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_GRABARASIENTODEPOSITOCUPON));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_GRABARASIENTODEPOSITOCUPON, TEXT);
              fields.add(C.CFG_VALOR, Cairo.Util.val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_GRABAR_ASIENTO_AGRUPADO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_GRABARASIENTOAGRUPADO));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_GRABARASIENTOAGRUPADO, TEXT);
              fields.add(C.CFG_VALOR, Cairo.Util.val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_GRABAR_ASIENTO_RESOLUCIONCUPON:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_GRABARASIENTORESOLUCIONCUPON));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_GRABARASIENTORESOLUCIONCUPON, TEXT);
              fields.add(C.CFG_VALOR, Cairo.Util.val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_CALCULAR_RETENCIONES:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_CALCULARRETENCIONES) + ", emp_id:" + companyId);

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_CALCULARRETENCIONES, TEXT);
              fields.add(C.CFG_VALOR, Cairo.Util.val(property.getValue()), TEXT);
              fields.add(C.EMP_ID, companyId, TEXT);

              transaction.addRegister(register);
              break;

            case K_CUE_ID_ANT_COBZ:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_CUENTAANTICIPOCOBRANZA) + ", emp_id:" + companyId);

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_CUENTAANTICIPOCOBRANZA, TEXT);
              fields.add(C.CFG_VALOR, property.getSelectId(), TEXT);
              fields.add(C.EMP_ID, companyId, TEXT);

              transaction.addRegister(register);
              break;

            case K_CUE_ID_ANT_OPG:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_CUENTAANTICIPOPAGOS) + ", emp_id:" + companyId);

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_CUENTAANTICIPOPAGOS, TEXT);
              fields.add(C.CFG_VALOR, property.getSelectId(), TEXT);
              fields.add(C.EMP_ID, companyId, TEXT);

              transaction.addRegister(register);
              break;

            case K_EXIGIR_CENTROCOSTO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_EXIGIRCENTROCOSTO));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_EXIGIRCENTROCOSTO, TEXT);
              fields.add(C.CFG_VALOR, property.getValue(), TEXT);

              transaction.addRegister(register);
              break;

            case K_COBRANZAS_XHOJARUTA:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_COBRANZASXHOJARUTA));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPOGENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_COBRANZASXHOJARUTA, TEXT);
              fields.add(C.CFG_VALOR, property.getValue(), TEXT);

              transaction.addRegister(register);
              break;
          }
        }

        saveRetencion(transaction, companyId);

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

      var saveRetencion = function(transaction, companyId) {

        var rows = getRetencion().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);
          var register = createRegister();

          register.setFilter("cfg_grupo:" + sq(C_GRUPOGENERAL) + ", cfg_aspecto:" + sq(C_RETENCION));

          var fields = register.getFields();
          fields.add(CFG_GRUPO, C_GRUPOGENERAL, TEXT);
          fields.add(C.CONFIG_KEY, C_RETENCION, TEXT);
          fields.add(C.CONFIG_VALUE, Dialogs.cell(row, KI_RET_ID).getId(), TEXT);
          fields.add(EMP_ID, companyId, ID);

          transaction.addRegister(register);
        }
      };

      var getRetencion = function() {
        return m_dialog.getProperties().item(C_RETENCION).getGrid();
      };

      self.getPath = function() {
        return "#general/tesoreriaconfig";
      };

      self.getEditorName = function() {
        return "tesoreriaconfig";
      };

      self.getTitle = function() {
        return Cairo.Language.getText(2862, ""); // Configuración General
      };

      self.validate = function() {
        return Cairo.Promises.resolvedPromise(true);
      };

      var load = function() {

        return DB.getData("load[" + m_apiPath + "general/tesoreriaconfig]", NO_ID).then(
          function(response) {

            if(response.success === true) {

              m_cueIdDifCambio = C.NO_ID;
              m_cuentaDifCambio = "";

              m_docIdNCdifCambio = C.NO_ID;
              m_docNCDifCambio = "";

              m_docIdNDdifCambio = C.NO_ID;
              m_docNDDifCambio = "";

              m_prIdDifCambio = C.NO_ID;
              m_productoDifCambio = "";

              m_defaultDifCambio = CT.ModoDifCambio.DIF_CAMBIO_NC_ND;
              m_modoIvaDifCambio = CT.ModoIvaDifCambio.DIF_IVA_IMPONIBLE;
              m_aplicacionDifCambio = CT.AplicacionDifCambio.DIF_APLICACION_ND;

              m_grabarAsientoDepositoBanco = false;
              m_grabarAsientoCobranza = false;
              m_grabarAsientoOrdenPago = false;
              m_grabarAsientoMovimientoFondo = false;
              m_grabarAsientoRendicion = false;
              m_grabarAsientoDepositoCupon = false;
              m_grabarAsientoResolucionCupon = false;
              m_grabarAsientoAgrupado = false;
              m_cobranzasXHojaRuta = false;

              m_calcularRetenciones = false;

              m_cueIdAntCobz = C.NO_ID;
              m_cueAnticipoCobz = "";

              m_cueIdAntOpg = C.NO_ID;
              m_cueAnticipoOpg = "";

              m_exigirCentroCosto = false;

              var settings = response.data.get('settings')

              m_settings = settings;

              for(var _i = 0; _i < settings.length; _i += 1) {

                switch (getValue(settings[_i], C.CFG_ASPECTO)) {
                
                  case C_CUEIDDIFCAMBIO:
                    var value = getValue(settings[_i], C.CONFIG_VALUE);
                    m_cueIdDifCambio = value.id;
                    m_cuentaDifCambio = value.name;
                    break;
  
                  case C_PRIDDIFCAMBIO:
                    var value = getValue(settings[_i], C.CONFIG_VALUE);
                    m_prIdDifCambio = value.id;
                    m_productoDifCambio = value.name;
                    break;
  
                  case C_MODOIVADIFCAMBIO:
                    m_modoIvaDifCambio = getValue(settings[_i], C.CONFIG_VALUE);
                    break;
  
                  case C_APLICACIONDIFCAMBIO:
                    m_aplicacionDifCambio = getValue(settings[_i], C.CONFIG_VALUE);
                    break;
  
                  case C_DEFAULTDIFCAMBIO:
                    m_defaultDifCambio = getValue(settings[_i], C.CONFIG_VALUE);
                    break;
  
                  case C_GRABARASIENTOCOBRANZA:
                    m_grabarAsientoCobranza = getValue(settings[_i], C.CONFIG_VALUE);
                    break;
  
                  case C_GRABARASIENTODEPOSITOBANCO:
                    m_grabarAsientoDepositoBanco = getValue(settings[_i], C.CONFIG_VALUE);
                    break;
  
                  case C_GRABARASIENTOORDENPAGO:
                    m_grabarAsientoOrdenPago = getValue(settings[_i], C.CONFIG_VALUE);
                    break;
  
                  case C_GRABARASIENTOMOVIMIENTOFONDO:
                    m_grabarAsientoMovimientoFondo = getValue(settings[_i], C.CONFIG_VALUE);
                    break;
  
                  case C_GRABARASIENTORENDICION:
                    m_grabarAsientoRendicion = getValue(settings[_i], C.CONFIG_VALUE);
                    break;
  
                  case C_GRABARASIENTORESOLUCIONCUPON:
                    m_grabarAsientoResolucionCupon = getValue(settings[_i], C.CONFIG_VALUE);
                    break;
  
                  case C_GRABARASIENTOAGRUPADO:
                    m_grabarAsientoAgrupado = getValue(settings[_i], C.CONFIG_VALUE);
                    break;
  
                  case C_GRABARASIENTODEPOSITOCUPON:
                    m_grabarAsientoDepositoCupon = getValue(settings[_i], C.CONFIG_VALUE);
                    break;
  
                  case C_EXIGIRCENTROCOSTO:
                    m_exigirCentroCosto = getValue(settings[_i], C.CONFIG_VALUE);
                    break;
  
                  case C_COBRANZASXHOJARUTA:
                    m_cobranzasXHojaRuta = getValue(settings[_i], C.CONFIG_VALUE);
                    break;

                  case C_NCDIFCAMBIO:
                    var value = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdNCdifCambio = value.id;
                    m_docNCDifCambio = value.name;
                    break;

                  case C_NDDIFCAMBIO:
                    var value = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdNDdifCambio = value.id;
                    m_docNDDifCambio = value.name;
                    break;

                  case C_DOCIDCOBRANZA:
                    var value = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdCobranza = value.id;
                    m_docCobranza = value.name;
                    break;

                  case C_DOCIDORDENPAGO:
                    var value = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdOrdenPago = value.id;
                    m_docOrdenPago = value.name;
                    break;

                  case C_CALCULARRETENCIONES:
                    m_calcularRetenciones = getValue(settings[_i], C.CONFIG_VALUE);
                    break;

                  case C_CUENTAANTICIPOCOBRANZA:
                    var value = getValue(settings[_i], C.CONFIG_VALUE);
                    m_cueIdAntCobz = value.id;
                    m_cueAnticipoCobz = value.name;
                    break;

                  case C_CUENTAANTICIPOPAGOS:
                    var value = getValue(settings[_i], C.CONFIG_VALUE);
                    m_cueIdAntOpg = value.id;
                    m_cueAnticipoOpg = value.name;
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

          if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.MODIFY_CONFIG_TESORERIA)) { return p; }

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
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.EDIT_FUNCTION, C_MODULE, "");
        }

        return p;
      };

      self.setTree = function(value) {
        m_listController = value;
      };

      var loadCollection = function() {

        var c_tab_general = 0;
        var c_tab_contabilidad = 1;
        var c_tab_difCambio = 2;
        var c_tab_retencion = 3;

        var w_tabs = m_dialog.getTabs();

        w_tabs.clear();

        var tab = w_tabs.add(null);
        tab.setIndex(c_tab_general);
        tab.setName(C.c_strGeneral);

        var tab = w_tabs.add(null);
        tab.setIndex(c_tab_contabilidad);
        tab.setName(Cairo.Language.getText(3124, "")); // Contabilidad

        var tab = w_tabs.add(null);
        tab.setIndex(c_tab_difCambio);
        tab.setName(Cairo.Language.getText(3125, "")); // Diferencia cambio

        var tab = w_tabs.add(null);
        tab.setIndex(c_tab_retencion);
        tab.setName(Cairo.Language.getText(1393, "")); // Retenciones

        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, C_DEFAULTDIFCAMBIO);
        elem.setType(Dialogs.PropertyType.list);
        elem.setLeft(2000);
        elem.setWidth(3000);
        elem.setLeftLabel(-1500);
        elem.setName(C_DEFAULTDIFCAMBIO);
        elem.setKey(K_DEFAULT_DIFCAMBIO);
        elem.setListWhoSetItem(csListItemData);
        elem.setListItemData(m_defaultDifCambio);
        var elem = elem.add(null);
        elem.ID = CT.ModoDifCambio.cSEDIFCAMBIOCUENTA;
        //'Una cuenta contable
        elem.setValue(Cairo.Language.getText(2142, ""));
        var elem = elem.add(null);
        elem.ID = CT.ModoDifCambio.DIF_CAMBIO_NC_ND;
        //'Una nota de debito o credito
        elem.setValue(Cairo.Language.getText(2143, ""));
        elem.setTabIndex(c_tab_difCambio);

        var elem = properties.add(null, C_CUEIDDIFCAMBIO);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setLeft(2000);
        elem.setWidth(3000);
        elem.setLeftLabel(-1500);
        elem.setName(C_CUEIDDIFCAMBIO);
        elem.setKey(K_CUE_ID_DIFCAMBIO);
        elem.setSelectId(m_cueIdDifCambio);
        elem.setValue(m_cuentaDifCambio);
        elem.setTabIndex(c_tab_difCambio);

        var elem = properties.add(null, C_NCDIFCAMBIO);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSTBLDOCUMENTO);
        elem.setLeft(2000);
        elem.setWidth(3000);
        elem.setLeftLabel(-1500);
        elem.setName(C_NCDIFCAMBIO);
        elem.setKey(K_DOC_ID_NC_DIFCAMBIO);
        elem.setSelectId(m_docIdNCdifCambio);
        elem.setSelectFilter("'doct_id = 7'");
        elem.setValue(m_docNCDifCambio);
        elem.setTabIndex(c_tab_difCambio);

        var elem = properties.add(null, C_NDDIFCAMBIO);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSTBLDOCUMENTO);
        elem.setLeft(2000);
        elem.setWidth(3000);
        elem.setLeftLabel(-1500);
        elem.setName(C_NDDIFCAMBIO);
        elem.setKey(K_DOC_ID_ND_DIFCAMBIO);
        elem.setSelectId(m_docIdNDdifCambio);
        elem.setSelectFilter("'doct_id = 9'");
        elem.setValue(m_docNDDifCambio);
        elem.setTabIndex(c_tab_difCambio);

        var elem = properties.add(null, C_PRIDDIFCAMBIO);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PRODUCTOVENTA);
        elem.setLeft(2000);
        elem.setWidth(3000);
        elem.setLeftLabel(-1500);
        elem.setName(C_PRIDDIFCAMBIO);
        elem.setKey(K_PR_ID_DIFCAMBIO);
        elem.setSelectId(m_prIdDifCambio);
        elem.setValue(m_productoDifCambio);
        elem.setTabIndex(c_tab_difCambio);

        var elem = properties.add(null, C_MODOIVADIFCAMBIO);
        elem.setType(Dialogs.PropertyType.list);
        elem.setLeft(2000);
        elem.setWidth(5000);
        elem.setLeftLabel(-1500);
        elem.setName(C_MODOIVADIFCAMBIO);
        elem.setKey(K_MODO_IVA_DIFCAMBIO);
        elem.setListWhoSetItem(csListItemData);
        elem.setListItemData(m_modoIvaDifCambio);
        var elem = elem.add(null);
        elem.ID = CT.ModoIvaDifCambio.DIF_IVA_IMPONIBLE;
        //'Tomar la diferencia de cambio como base imponible para el IVA
        elem.setValue(Cairo.Language.getText(2144, ""));
        var elem = elem.add(null);
        elem.ID = CT.ModoIvaDifCambio.cSEDIFIVANOIMPONIBLE;
        //'IVA incluido en la diferencia de cambio
        elem.setValue(Cairo.Language.getText(2145, ""));
        elem.setTabIndex(c_tab_difCambio);

        var elem = properties.add(null, C_APLICACIONDIFCAMBIO);
        elem.setType(Dialogs.PropertyType.list);
        elem.setLeft(2000);
        elem.setWidth(5000);
        elem.setLeftLabel(-1500);
        elem.setName(C_APLICACIONDIFCAMBIO);
        elem.setKey(K_APLICACION_DIFCAMBIO);
        elem.setListWhoSetItem(csListItemData);
        elem.setListItemData(m_aplicacionDifCambio);
        var elem = elem.add(null);
        elem.ID = CT.AplicacionDifCambio.DIF_APLICACION_ND;
        //'Cobrar la Nota de Débito y aplicar el resto a las Facturas
        elem.setValue(Cairo.Language.getText(2480, ""));
        var elem = elem.add(null);
        elem.ID = CT.AplicacionDifCambio.cSEDIFAPLICACIONFV;
        //'Cobrar las Facturas y aplicar el resto a la Note de Débito
        elem.setValue(Cairo.Language.getText(2481, ""));
        elem.setTabIndex(c_tab_difCambio);

        var elem = properties.add(null, C_DOCIDCOBRANZA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSTBLDOCUMENTO);
        elem.setLeft(2000);
        elem.setWidth(3000);
        elem.setLeftLabel(-1500);
        elem.setName(C_DOCIDCOBRANZA);
        elem.setKey(K_DOC_ID_COBRANZA);
        elem.setSelectId(m_docIdCobranza);
        elem.setSelectFilter("'doct_id = 13'");
        elem.setValue(m_docCobranza);

        var elem = properties.add(null, C_DOCIDORDENPAGO);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSTBLDOCUMENTO);
        elem.setLeft(2000);
        elem.setWidth(3000);
        elem.setLeftLabel(-1500);
        elem.setName(C_DOCIDORDENPAGO);
        elem.setKey(K_DOC_ID_ORDENPAGO);
        elem.setSelectId(m_docIdOrdenPago);
        elem.setSelectFilter("'doct_id = 16'");
        elem.setValue(m_docOrdenPago);

        var elem = properties.add(null, C_CUENTAANTICIPOCOBRANZA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setLeft(2000);
        elem.setWidth(3000);
        elem.setLeftLabel(-1500);
        elem.setName(C_CUENTAANTICIPOCOBRANZA);
        elem.setKey(K_CUE_ID_ANT_COBZ);
        elem.setValue(m_cueAnticipoCobz);
        elem.setSelectId(m_cueIdAntCobz);
        elem.setSelectFilter("("+ mTesoreriaConstantes.CUEC_ID+ " = "+ csECuentaCategoria.cSECUECDEUDPORVENTAS.toString()+ " or "+ mTesoreriaConstantes.CUEC_ID+ " = "+ csECuentaCategoria.cSECUECDEPOSITOCUPONES.toString()+ ")and "+ GetHelpFilterCuenta());

        var elem = properties.add(null, C_CUENTAANTICIPOPAGOS);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setLeft(2000);
        elem.setWidth(3000);
        elem.setLeftLabel(-1500);
        elem.setName(C_CUENTAANTICIPOPAGOS);
        elem.setKey(K_CUE_ID_ANT_OPG);
        elem.setValue(m_cueAnticipoOpg);
        elem.setSelectId(m_cueIdAntOpg);
        elem.setSelectFilter(mTesoreriaConstantes.CUEC_ID+ " = "+ csECuentaCategoria.cSECUECACREEDORES.toString());

        var elem = properties.add(null, C_CALCULARRETENCIONES);
        elem.setType(Dialogs.PropertyType.check);
        elem.setLeft(3500);
        elem.setLeftLabel(-3000);
        elem.setWidth(3000);
        elem.setTopToPrevious(600);
        elem.setName(C_CALCULARRETENCIONES);
        elem.setKey(K_CALCULAR_RETENCIONES);
        elem.setValue(Cairo.Util.boolToInt(m_calcularRetenciones));

        var elem = properties.add(null, C_COBRANZASXHOJARUTA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setLeft(3500);
        elem.setLeftLabel(-3000);
        //'Cobranzas por Hoja de Ruta
        elem.setName(Cairo.Language.getText(5122, ""));
        elem.setKey(K_COBRANZAS_XHOJARUTA);
        elem.setValue(m_cobranzasXHojaRuta);

        var elem = properties.add(null, C_GRABARASIENTOCOBRANZA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setLeft(4500);
        elem.setLeftLabel(-4000);
        //'Grabar asiento al grabar la Cobranza
        elem.setName(Cairo.Language.getText(3126, ""));
        elem.setKey(K_GRABAR_ASIENTO_COBRANZA);
        elem.setValue(m_grabarAsientoCobranza);
        elem.setTabIndex(c_tab_contabilidad);

        var elem = properties.add(null, C_GRABARASIENTOORDENPAGO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setLeft(4500);
        elem.setLeftLabel(-4000);
        //'Grabar asiento al grabar la Orden de Pago
        elem.setName(Cairo.Language.getText(3127, ""));
        elem.setKey(K_GRABAR_ASIENTO_ORDENPAGO);
        elem.setValue(m_grabarAsientoOrdenPago);
        elem.setTabIndex(c_tab_contabilidad);

        var elem = properties.add(null, C_GRABARASIENTOMOVIMIENTOFONDO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setLeft(4500);
        elem.setLeftLabel(-4000);
        //'Grabar asiento al grabar el Movimiento de Fondos
        elem.setName(Cairo.Language.getText(3128, ""));
        elem.setKey(K_GRABAR_ASIENTO_MOVIMIENTOFONDO);
        elem.setValue(m_grabarAsientoMovimientoFondo);
        elem.setTabIndex(c_tab_contabilidad);

        var elem = properties.add(null, C_GRABARASIENTORENDICION);
        elem.setType(Dialogs.PropertyType.check);
        elem.setLeft(4500);
        elem.setLeftLabel(-4000);
        //'Grabar asiento al grabar la Rendición
        elem.setName(Cairo.Language.getText(3129, ""));
        elem.setKey(K_GRABAR_ASIENTO_RENDICION);
        elem.setValue(m_grabarAsientoRendicion);
        elem.setTabIndex(c_tab_contabilidad);

        var elem = properties.add(null, C_GRABARASIENTODEPOSITOBANCO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setLeft(4500);
        elem.setLeftLabel(-4000);
        //'Grabar asiento al grabar el Depósito Bancario
        elem.setName(Cairo.Language.getText(3130, ""));
        elem.setKey(K_GRABAR_ASIENTO_DEPOSITOBANCO);
        elem.setValue(m_grabarAsientoDepositoBanco);
        elem.setTabIndex(c_tab_contabilidad);

        var elem = properties.add(null, C_GRABARASIENTODEPOSITOCUPON);
        elem.setType(Dialogs.PropertyType.check);
        elem.setLeft(4500);
        elem.setLeftLabel(-4000);
        //'Grabar asiento al grabar la presentación de Cupones
        elem.setName(Cairo.Language.getText(3131, ""));
        elem.setKey(K_GRABAR_ASIENTO_DEPOSITOCUPON);
        elem.setValue(m_grabarAsientoDepositoCupon);
        elem.setTabIndex(c_tab_contabilidad);

        var elem = properties.add(null, C_GRABARASIENTORESOLUCIONCUPON);
        elem.setType(Dialogs.PropertyType.check);
        elem.setLeft(4500);
        elem.setLeftLabel(-4000);
        //'Grabar asiento al grabar la Resolución de Cupones
        elem.setName(Cairo.Language.getText(3132, ""));
        elem.setKey(K_GRABAR_ASIENTO_RESOLUCIONCUPON);
        elem.setValue(m_grabarAsientoResolucionCupon);
        elem.setTabIndex(c_tab_contabilidad);

        var elem = properties.add(null, C_GRABARASIENTOAGRUPADO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setLeft(4500);
        elem.setLeftLabel(-4000);
        //'Grabar el asiento agrupado por cuentas
        elem.setName(Cairo.Language.getText(4820, ""));
        elem.setKey(K_GRABAR_ASIENTO_AGRUPADO);
        elem.setValue(m_grabarAsientoAgrupado);
        elem.setTabIndex(c_tab_contabilidad);

        var elem = properties.add(null, C_EXIGIRCENTROCOSTO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setLeft(4500);
        elem.setLeftLabel(-4000);
        elem.setName(C_EXIGIRCENTROCOSTO);
        elem.setValue(Cairo.Util.boolToInt(m_exigirCentroCosto));
        elem.setKey(K_EXIGIR_CENTROCOSTO);
        elem.setTabIndex(c_tab_contabilidad);

        c = properties.add(null, C_RETENCION);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        setGridRetencion(c);
        if(!pLoadRetencion(c)) { return false; }
        c.setName(C_RETENCION);
        c.setKey(K_RET_ID);
        c.setTabIndex(c_tab_retencion);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        if(!m_dialog.show(self)) { return false; }

        return true;
      };

        var refreshCollection = function() {

          m_dialog.setTitle(m_name);

          var properties = m_dialog.getProperties();

          var elem = properties.item(C_DEFAULTDIFCAMBIO);

          var elem = properties.item(C_CUEIDDIFCAMBIO);
          elem.setSelectId(m_cueIdDifCambio);
          elem.setValue(m_cuentaDifCambio);

          var elem = properties.item(C_NCDIFCAMBIO);
          elem.setSelectId(m_docIdNCdifCambio);
          elem.setValue(m_docNCDifCambio);

          var elem = properties.item(C_NDDIFCAMBIO);
          elem.setSelectId(m_docIdNDdifCambio);
          elem.setValue(m_docNDDifCambio);

          var elem = properties.item(C_PRIDDIFCAMBIO);
          elem.setSelectId(m_prIdDifCambio);
          elem.setValue(m_productoDifCambio);

          var elem = properties.item(C_MODOIVADIFCAMBIO);

          var elem = properties.item(C_APLICACIONDIFCAMBIO);

          var elem = properties.item(C_DOCIDCOBRANZA);
          elem.setSelectId(m_docIdCobranza);
          elem.setValue(m_docCobranza);

          var elem = properties.item(C_DOCIDORDENPAGO);
          elem.setSelectId(m_docIdOrdenPago);
          elem.setValue(m_docOrdenPago);

          var elem = properties.item(C_CUENTAANTICIPOCOBRANZA);
          elem.setValue(m_cueAnticipoCobz);
          elem.setSelectId(m_cueIdAntCobz);

          var elem = properties.item(C_CUENTAANTICIPOPAGOS);
          elem.setValue(m_cueAnticipoOpg);
          elem.setSelectId(m_cueIdAntOpg);

          var elem = properties.item(C_CALCULARRETENCIONES);
          elem.setValue(Cairo.Util.boolToInt(m_calcularRetenciones));

          var elem = properties.item(C_COBRANZASXHOJARUTA);
          elem.setValue(m_cobranzasXHojaRuta);

          var elem = properties.item(C_GRABARASIENTOCOBRANZA);
          elem.setValue(m_grabarAsientoCobranza);

          var elem = properties.item(C_GRABARASIENTOORDENPAGO);
          elem.setValue(m_grabarAsientoOrdenPago);

          var elem = properties.item(C_GRABARASIENTOMOVIMIENTOFONDO);
          elem.setValue(m_grabarAsientoMovimientoFondo);

          var elem = properties.item(C_GRABARASIENTORENDICION);
          elem.setValue(m_grabarAsientoRendicion);

          var elem = properties.item(C_GRABARASIENTODEPOSITOBANCO);
          elem.setValue(m_grabarAsientoDepositoBanco);

          var elem = properties.item(C_GRABARASIENTODEPOSITOCUPON);
          elem.setValue(m_grabarAsientoDepositoCupon);

          var elem = properties.item(C_GRABARASIENTORESOLUCIONCUPON);
          elem.setValue(m_grabarAsientoResolucionCupon);

          var elem = properties.item(C_GRABARASIENTOAGRUPADO);
          elem.setValue(m_grabarAsientoAgrupado);

          var elem = properties.item(C_EXIGIRCENTROCOSTO);
          elem.setValue(Cairo.Util.boolToInt(m_exigirCentroCosto));

          return m_dialog.showValues(properties);
        };

        var setGridRetencion = function(property) {
          var retencion = null;
          var ret_id = null;

          var w_grid = property.getGrid();

          w_grid.getColumns().clear();
          w_grid.getRows().clear();

          var w_columns = w_grid.getColumns();

          var elem = w_columns.add(null);
          elem.setVisible(false);

          var elem = w_columns.add(null);
          //'Retencion
          elem.setName(Cairo.Language.getText(1403, ""));
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.RETENCION);
          elem.setWidth(2200);
          elem.setKey(KI_RET_ID);

          var w_rows = w_grid.getRows();

          for(var _i = 0; _i < m_data.retencion.length; _i += 1) {

            ret_id = Cairo.Util.val(Cairo.Database.valField(m_data.retencion[_i], C.CFG_VALOR));

            if(ret_id != C.NO_ID) {

              retencion = "";

              if(!Cairo.Database.getData(mTesoreriaConstantes.RETENCION, mTesoreriaConstantes.RET_ID, ret_id, mTesoreriaConstantes.RET_NAME, retencion)) { return false; }

              if(retencion != "") {

                var elem = w_rows.add(null);

                elem.Add(null);

                var elem = elem.add(null);
                elem.Value = retencion;
                elem.ID = ret_id;
                elem.setKey(KI_RET_ID);

              }
            }

          }

          return true;
        };

        var isEmptyRow = function(row,  rowIndex) {
          var cell = null;
          var strRow = null;

          strRow = " (Fila "+ rowIndex.toString()+ ")";

          var bRowIsEmpty = true;

          var _count = row.size();
          for (var _i = 0; _i < _count; _i++) {
            cell = row.item(_i);
            switch (cell.getKey()) {
              case KI_RET_ID:
                if(!ValEmpty(cell.getValue(), TEXT)) {
                  bRowIsEmpty = false;
                  break;
                }
                break;
            }
          }

          return bRowIsEmpty;
        };

        var pValidateRow = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function pValidateRow(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
          var cell = null;

          var strRow = " (Row: " + rowIndex.toString() + ")";

          var _count = row.size();
          for (var _i = 0; _i < _count; _i++) {
            cell = row.item(_i);
            switch (cell.getKey()) {
              case KI_RET_ID:
                if(ValEmpty(cell.getId(), ID)) {
                  //'Debe indicar una Retencion (1)
                  MsgInfo(Cairo.Language.getText(1386, ""));
                }
                break;
            }
          }

          return Cairo.Promises.resolvedPromise(true);
        };

        // TODO: implement grid for retenciones

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
        var editor = Cairo.TesoreriaConfig.Edit.Controller.getEditor();
        var dialog = Cairo.Dialogs.Views.Controller.newDialog();

        editor.setDialog(dialog);
        editor.edit();
      };

      Edit.Controller = { getEditor: createObject, edit: showEditor };

    });


  }());