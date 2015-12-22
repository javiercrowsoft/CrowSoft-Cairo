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
      var NO_ID = Cairo.Constants.NO_ID;
      var T = Dialogs.PropertyType;
      var D = Cairo.Documents;

      var C_MODULE = "cTesoreriaConfigEdit";

      var K_CUE_ID_DIFCAMBIO = 1;
      var K_DOC_ID_NC_DIF_CAMBIO = 2;
      var K_DOC_ID_ND_DIF_CAMBIO = 3;
      var K_DEFAULT_DIF_CAMBIO = 4;
      var K_MODO_IVA_DIF_CAMBIO = 5;
      var K_APLICACION_DIF_CAMBIO = 101;
      var K_PR_ID_DIF_CAMBIO = 6;

      var K_DOC_ID_COBRANZA = 7;
      var K_DOC_ID_ORDEN_PAGO = 8;

      var K_GRABAR_ASIENTO_COBRANZA = 9;
      var K_GRABAR_ASIENTO_ORDEN_PAGO = 10;
      var K_GRABAR_ASIENTO_MOVIMIENTO_FONDO = 11;
      var K_GRABAR_ASIENTO_RENDICION = 12;
      var K_GRABAR_ASIENTO_DEPOSITO_BANCO = 13;
      var K_GRABAR_ASIENTO_DEPOSITO_CUPON = 14;
      var K_GRABAR_ASIENTO_RESOLUCION_CUPON = 15;

      var K_CALCULAR_RETENCIONES = 16;
      var K_RET_ID = 17;
      var KI_RET_ID = 1;

      var K_CUE_ID_ANT_COBZ = 18;
      var K_CUE_ID_ANT_OPG = 19;

      var K_GRABAR_ASIENTO_AGRUPADO = 20;

      var K_EXIGIR_CENTRO_COSTO = 21;
      var K_COBRANZAS_XHOJARUTA = 22;

      var C_GRUPO_GENERAL = "Tesoreria-General";
      var C_CUE_ID_DIF_CAMBIO = "Cuenta contable";
      var C_NC_DIF_CAMBIO = "Nota de credito";
      var C_ND_DIF_CAMBIO = "Nota de debito";
      var C_DEFAULT_DIF_CAMBIO = "Utilizar";
      var C_MODO_IVA_DIF_CAMBIO = "Tratamiento del Iva";
      var C_APLICACION_DIF_CAMBIO = "Aplicación Dif. Cambio";
      var C_PR_ID_DIF_CAMBIO = "Articulo";

      var C_GRABAR_ASIENTO_COBRANZA = "Cobranza-Grabar Asiento";
      var C_GRABAR_ASIENTO_ORDEN_PAGO = "OrdenPago-Grabar Asiento";
      var C_GRABAR_ASIENTO_MOVIMIENTO_FONDO = "MovimientoFondo-Grabar Asiento";
      var C_GRABAR_ASIENTO_RENDICION = "Rendicion-Grabar Asiento";
      var C_GRABAR_ASIENTO_DEPOSITO_BANCO = "DepositoBanco-Grabar Asiento";
      var C_GRABAR_ASIENTO_DEPOSITO_CUPON = "DepositoCupon-Grabar Asiento";
      var C_GRABAR_ASIENTO_RESOLUCION_CUPON = "ResolucionCupon-Grabar Asiento";
      var C_GRABAR_ASIENTO_AGRUPADO = "Asiento Agrupado";

      var C_CALCULAR_RETENCIONES = "Calcular Retenciones";
      var C_RETENCION = "Retencion";

      var C_DOC_ID_COBRANZA = "Cobranza";
      var C_DOC_ID_ORDEN_PAGO = "Orden Pago";

      var C_CUENTA_ANTICIPO_COBRANZA = "Cuenta Anticipo Cobranzas";
      var C_CUENTA_ANTICIPO_PAGOS = "Cuenta Anticipo Ordenes de Pago";

      var C_EXIGIR_CENTRO_COSTO = "Exigir Centro Costo";
      var C_COBRANZAS_X_HOJA_RUTA = "Cobranzas por Hoja de Ruta";

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
      var TEXT = Cairo.Constants.Types.text;
      var ID = Cairo.Constants.Types.id;

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

            case K_CUE_ID_DIFCAMBIO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_CUE_ID_DIF_CAMBIO));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_CUE_ID_DIF_CAMBIO, TEXT);
              fields.add(C.CFG_VALOR, property.getSelectId(), TEXT);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_COBRANZA:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_DOC_ID_COBRANZA) + ", emp_id:" + companyId);

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_DOC_ID_COBRANZA, TEXT);
              fields.add(C.CFG_VALOR, property.getSelectId(), TEXT);
              fields.add(C.EMP_ID, companyId, TEXT);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_ORDEN_PAGO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_DOC_ID_ORDEN_PAGO) + ", emp_id:" + companyId);

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_DOC_ID_ORDEN_PAGO, TEXT);
              fields.add(C.CFG_VALOR, property.getSelectId(), TEXT);
              fields.add(C.EMP_ID, companyId, TEXT);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_NC_DIF_CAMBIO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_NC_DIF_CAMBIO) + ", emp_id:" + companyId);

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_NC_DIF_CAMBIO, TEXT);
              fields.add(C.CFG_VALOR, property.getSelectId(), TEXT);
              fields.add(C.EMP_ID, companyId, TEXT);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_ND_DIF_CAMBIO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_ND_DIF_CAMBIO) + ", emp_id:" + companyId);

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_ND_DIF_CAMBIO, TEXT);
              fields.add(C.CFG_VALOR, property.getSelectId(), TEXT);
              fields.add(C.EMP_ID, companyId, TEXT);

              transaction.addRegister(register);
              break;

            case K_DEFAULT_DIF_CAMBIO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_DEFAULT_DIF_CAMBIO));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_DEFAULT_DIF_CAMBIO, TEXT);
              fields.add(C.CFG_VALOR, property.getListItemData(), TEXT);

              transaction.addRegister(register);
              break;

            case K_MODO_IVA_DIF_CAMBIO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_MODO_IVA_DIF_CAMBIO));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_MODO_IVA_DIF_CAMBIO, TEXT);
              fields.add(C.CFG_VALOR, property.getListItemData(), TEXT);

              transaction.addRegister(register);
              break;

            case K_APLICACION_DIF_CAMBIO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_APLICACION_DIF_CAMBIO));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_APLICACION_DIF_CAMBIO, TEXT);
              fields.add(C.CFG_VALOR, property.getListItemData(), TEXT);

              transaction.addRegister(register);
              break;

            case K_PR_ID_DIF_CAMBIO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_PR_ID_DIF_CAMBIO));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_PR_ID_DIF_CAMBIO, TEXT);
              fields.add(C.CFG_VALOR, property.getSelectId(), TEXT);

              transaction.addRegister(register);
              break;

            case K_GRABAR_ASIENTO_COBRANZA:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_GRABAR_ASIENTO_COBRANZA));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_GRABAR_ASIENTO_COBRANZA, TEXT);
              fields.add(C.CFG_VALOR, val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_GRABAR_ASIENTO_ORDEN_PAGO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_GRABAR_ASIENTO_ORDEN_PAGO));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_GRABAR_ASIENTO_ORDEN_PAGO, TEXT);
              fields.add(C.CFG_VALOR, val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_GRABAR_ASIENTO_MOVIMIENTO_FONDO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_GRABAR_ASIENTO_MOVIMIENTO_FONDO));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_GRABAR_ASIENTO_MOVIMIENTO_FONDO, TEXT);
              fields.add(C.CFG_VALOR, val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_GRABAR_ASIENTO_RENDICION:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_GRABAR_ASIENTO_RENDICION));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_GRABAR_ASIENTO_RENDICION, TEXT);
              fields.add(C.CFG_VALOR, val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_GRABAR_ASIENTO_DEPOSITO_BANCO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_GRABAR_ASIENTO_DEPOSITO_BANCO));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_GRABAR_ASIENTO_DEPOSITO_BANCO, TEXT);
              fields.add(C.CFG_VALOR, val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_GRABAR_ASIENTO_DEPOSITO_CUPON:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_GRABAR_ASIENTO_DEPOSITO_CUPON));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_GRABAR_ASIENTO_DEPOSITO_CUPON, TEXT);
              fields.add(C.CFG_VALOR, val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_GRABAR_ASIENTO_AGRUPADO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_GRABAR_ASIENTO_AGRUPADO));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_GRABAR_ASIENTO_AGRUPADO, TEXT);
              fields.add(C.CFG_VALOR, val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_GRABAR_ASIENTO_RESOLUCION_CUPON:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_GRABAR_ASIENTO_RESOLUCION_CUPON));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_GRABAR_ASIENTO_RESOLUCION_CUPON, TEXT);
              fields.add(C.CFG_VALOR, val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_CALCULAR_RETENCIONES:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_CALCULAR_RETENCIONES) + ", emp_id:" + companyId);

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_CALCULAR_RETENCIONES, TEXT);
              fields.add(C.CFG_VALOR, val(property.getValue()), TEXT);
              fields.add(C.EMP_ID, companyId, TEXT);

              transaction.addRegister(register);
              break;

            case K_CUE_ID_ANT_COBZ:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_CUENTA_ANTICIPO_COBRANZA) + ", emp_id:" + companyId);

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_CUENTA_ANTICIPO_COBRANZA, TEXT);
              fields.add(C.CFG_VALOR, property.getSelectId(), TEXT);
              fields.add(C.EMP_ID, companyId, TEXT);

              transaction.addRegister(register);
              break;

            case K_CUE_ID_ANT_OPG:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_CUENTA_ANTICIPO_PAGOS) + ", emp_id:" + companyId);

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_CUENTA_ANTICIPO_PAGOS, TEXT);
              fields.add(C.CFG_VALOR, property.getSelectId(), TEXT);
              fields.add(C.EMP_ID, companyId, TEXT);

              transaction.addRegister(register);
              break;

            case K_EXIGIR_CENTRO_COSTO:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_EXIGIR_CENTRO_COSTO));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_EXIGIR_CENTRO_COSTO, TEXT);
              fields.add(C.CFG_VALOR, property.getValue(), TEXT);

              transaction.addRegister(register);
              break;

            case K_COBRANZAS_XHOJARUTA:
              register = createRegister();

              register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_COBRANZAS_X_HOJA_RUTA));

              var fields = register.getFields();
              fields.add(C.CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
              fields.add(C.CFG_ASPECTO, C_COBRANZAS_X_HOJA_RUTA, TEXT);
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

      var saveRetencion = function(transaction, companyId) {

        var rows = getRetencion().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);
          var register = createRegister();

          register.setFilter("cfg_grupo:" + sq(C_GRUPO_GENERAL) + ", cfg_aspecto:" + sq(C_RETENCION));

          var fields = register.getFields();
          fields.add(CFG_GRUPO, C_GRUPO_GENERAL, TEXT);
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

              m_cueIdDifCambio = NO_ID;
              m_cuentaDifCambio = "";

              m_docIdNCdifCambio = NO_ID;
              m_docNCDifCambio = "";

              m_docIdNDdifCambio = NO_ID;
              m_docNDDifCambio = "";

              m_prIdDifCambio = NO_ID;
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

              m_cueIdAntCobz = NO_ID;
              m_cueAnticipoCobz = "";

              m_cueIdAntOpg = NO_ID;
              m_cueAnticipoOpg = "";

              m_exigirCentroCosto = false;

              var settings = response.data.get('settings')

              m_settings = settings;

              for(var _i = 0; _i < settings.length; _i += 1) {

                switch (getValue(settings[_i], C.CFG_ASPECTO)) {

                  case C_CUE_ID_DIF_CAMBIO:
                    var value = getValue(settings[_i], C.CONFIG_VALUE);
                    m_cueIdDifCambio = value.id;
                    m_cuentaDifCambio = value.name;
                    break;

                  case C_PR_ID_DIF_CAMBIO:
                    var value = getValue(settings[_i], C.CONFIG_VALUE);
                    m_prIdDifCambio = value.id;
                    m_productoDifCambio = value.name;
                    break;

                  case C_MODO_IVA_DIF_CAMBIO:
                    m_modoIvaDifCambio = getValue(settings[_i], C.CONFIG_VALUE);
                    break;

                  case C_APLICACION_DIF_CAMBIO:
                    m_aplicacionDifCambio = getValue(settings[_i], C.CONFIG_VALUE);
                    break;

                  case C_DEFAULT_DIF_CAMBIO:
                    m_defaultDifCambio = getValue(settings[_i], C.CONFIG_VALUE);
                    break;

                  case C_GRABAR_ASIENTO_COBRANZA:
                    m_grabarAsientoCobranza = getValue(settings[_i], C.CONFIG_VALUE);
                    break;

                  case C_GRABAR_ASIENTO_DEPOSITO_BANCO:
                    m_grabarAsientoDepositoBanco = getValue(settings[_i], C.CONFIG_VALUE);
                    break;

                  case C_GRABAR_ASIENTO_ORDEN_PAGO:
                    m_grabarAsientoOrdenPago = getValue(settings[_i], C.CONFIG_VALUE);
                    break;

                  case C_GRABAR_ASIENTO_MOVIMIENTO_FONDO:
                    m_grabarAsientoMovimientoFondo = getValue(settings[_i], C.CONFIG_VALUE);
                    break;

                  case C_GRABAR_ASIENTO_RENDICION:
                    m_grabarAsientoRendicion = getValue(settings[_i], C.CONFIG_VALUE);
                    break;

                  case C_GRABAR_ASIENTO_RESOLUCION_CUPON:
                    m_grabarAsientoResolucionCupon = getValue(settings[_i], C.CONFIG_VALUE);
                    break;

                  case C_GRABAR_ASIENTO_AGRUPADO:
                    m_grabarAsientoAgrupado = getValue(settings[_i], C.CONFIG_VALUE);
                    break;

                  case C_GRABAR_ASIENTO_DEPOSITO_CUPON:
                    m_grabarAsientoDepositoCupon = getValue(settings[_i], C.CONFIG_VALUE);
                    break;

                  case C_EXIGIR_CENTRO_COSTO:
                    m_exigirCentroCosto = bool(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case C_COBRANZAS_X_HOJA_RUTA:
                    m_cobranzasXHojaRuta = getValue(settings[_i], C.CONFIG_VALUE);
                    break;

                  case C_NC_DIF_CAMBIO:
                    var value = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdNCdifCambio = value.id;
                    m_docNCDifCambio = value.name;
                    break;

                  case C_ND_DIF_CAMBIO:
                    var value = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdNDdifCambio = value.id;
                    m_docNDDifCambio = value.name;
                    break;

                  case C_DOC_ID_COBRANZA:
                    var value = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdCobranza = value.id;
                    m_docCobranza = value.name;
                    break;

                  case C_DOC_ID_ORDEN_PAGO:
                    var value = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdOrdenPago = value.id;
                    m_docOrdenPago = value.name;
                    break;

                  case C_CALCULAR_RETENCIONES:
                    m_calcularRetenciones = bool(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case C_CUENTA_ANTICIPO_COBRANZA:
                    var value = getValue(settings[_i], C.CONFIG_VALUE);
                    m_cueIdAntCobz = value.id;
                    m_cueAnticipoCobz = value.name;
                    break;

                  case C_CUENTA_ANTICIPO_PAGOS:
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
          Cairo.manageErrorEx(ex.message, ex, C.EDIT_FUNCTION, C_MODULE, "");
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
        tab.setName(C.TAB_GENERAL);

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

        var elem = properties.add(null, C_DEFAULT_DIF_CAMBIO);
        elem.setType(T.list);
        elem.setName(C_DEFAULT_DIF_CAMBIO);
        elem.setKey(K_DEFAULT_DIF_CAMBIO);
        elem.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
        elem.setListItemData(m_defaultDifCambio);
        elem.setTabIndex(c_tab_difCambio);
        
        var list = elem.getList();
        
        var elem = list.add(null);
        elem.setId(CT.ModoDifCambio.DIF_CAMBIO_CUENTA);
        elem.setValue(Cairo.Language.getText(2142, "")); // Una cuenta contable
        
        var elem = list.add(null);
        elem.setId(CT.ModoDifCambio.DIF_CAMBIO_NC_ND);
        elem.setValue(Cairo.Language.getText(2143, "")); // Una nota de debito o credito

        var elem = properties.add(null, C_CUE_ID_DIF_CAMBIO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setName(C_CUE_ID_DIF_CAMBIO);
        elem.setKey(K_CUE_ID_DIFCAMBIO);
        elem.setSelectId(m_cueIdDifCambio);
        elem.setValue(m_cuentaDifCambio);
        elem.setTabIndex(c_tab_difCambio);

        var elem = properties.add(null, C_NC_DIF_CAMBIO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(C_NC_DIF_CAMBIO);
        elem.setKey(K_DOC_ID_NC_DIF_CAMBIO);
        elem.setSelectId(m_docIdNCdifCambio);
        elem.setSelectFilter("'doct_id = 7'");
        elem.setValue(m_docNCDifCambio);
        elem.setTabIndex(c_tab_difCambio);

        var elem = properties.add(null, C_ND_DIF_CAMBIO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(C_ND_DIF_CAMBIO);
        elem.setKey(K_DOC_ID_ND_DIF_CAMBIO);
        elem.setSelectId(m_docIdNDdifCambio);
        elem.setSelectFilter("'doct_id = 9'");
        elem.setValue(m_docNDDifCambio);
        elem.setTabIndex(c_tab_difCambio);

        var elem = properties.add(null, C_PR_ID_DIF_CAMBIO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PRODUCTOS_DE_VENTA);
        elem.setName(C_PR_ID_DIF_CAMBIO);
        elem.setKey(K_PR_ID_DIF_CAMBIO);
        elem.setSelectId(m_prIdDifCambio);
        elem.setValue(m_productoDifCambio);
        elem.setTabIndex(c_tab_difCambio);

        var elem = properties.add(null, C_MODO_IVA_DIF_CAMBIO);
        elem.setType(T.list);
        elem.setName(C_MODO_IVA_DIF_CAMBIO);
        elem.setKey(K_MODO_IVA_DIF_CAMBIO);
        elem.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
        elem.setListItemData(m_modoIvaDifCambio);
        elem.setTabIndex(c_tab_difCambio);

        var list = elem.getList();

        var elem = list.add(null);
        elem.setId(CT.ModoIvaDifCambio.DIF_IVA_IMPONIBLE);
        elem.setValue(Cairo.Language.getText(2144, "")); // Tomar la diferencia de cambio como base imponible para el IVA

        var elem = list.add(null);
        elem.setId(CT.ModoIvaDifCambio.DIF_IVA_NO_IMPONIBLE);
        elem.setValue(Cairo.Language.getText(2145, "")); // IVA incluido en la diferencia de cambio

        var elem = properties.add(null, C_APLICACION_DIF_CAMBIO);
        elem.setType(T.list);
        elem.setName(C_APLICACION_DIF_CAMBIO);
        elem.setKey(K_APLICACION_DIF_CAMBIO);
        elem.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
        elem.setListItemData(m_aplicacionDifCambio);
        elem.setTabIndex(c_tab_difCambio);

        var list = elem.getList();

        var elem = list.add(null);
        elem.setId(CT.AplicacionDifCambio.DIF_APLICACION_ND);
        elem.setValue(Cairo.Language.getText(2480, "")); // Cobrar la Nota de Débito y aplicar el resto a las Facturas

        var elem = list.add(null);
        elem.setId(CT.AplicacionDifCambio.DIF_APLICACION_FV);
        elem.setValue(Cairo.Language.getText(2481, "")); // Cobrar las Facturas y aplicar el resto a la Note de Débito

        var elem = properties.add(null, C_DOC_ID_COBRANZA);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(C_DOC_ID_COBRANZA);
        elem.setKey(K_DOC_ID_COBRANZA);
        elem.setSelectId(m_docIdCobranza);
        elem.setSelectFilter("'doct_id = 13'");
        elem.setValue(m_docCobranza);

        var elem = properties.add(null, C_DOC_ID_ORDEN_PAGO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(C_DOC_ID_ORDEN_PAGO);
        elem.setKey(K_DOC_ID_ORDEN_PAGO);
        elem.setSelectId(m_docIdOrdenPago);
        elem.setSelectFilter("'doct_id = 16'");
        elem.setValue(m_docOrdenPago);

        var elem = properties.add(null, C_CUENTA_ANTICIPO_COBRANZA);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setName(C_CUENTA_ANTICIPO_COBRANZA);
        elem.setKey(K_CUE_ID_ANT_COBZ);
        elem.setValue(m_cueAnticipoCobz);
        elem.setSelectId(m_cueIdAntCobz);
        elem.setSelectFilter(D.getSelectFilterForCuentaAnticipoCobranza);

        var elem = properties.add(null, C_CUENTA_ANTICIPO_PAGOS);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setName(C_CUENTA_ANTICIPO_PAGOS);
        elem.setKey(K_CUE_ID_ANT_OPG);
        elem.setValue(m_cueAnticipoOpg);
        elem.setSelectId(m_cueIdAntOpg);
        elem.setSelectFilter(D.getSelectFilterForCuentaAnticipoPagos);

        var elem = properties.add(null, C_CALCULAR_RETENCIONES);
        elem.setType(T.check);
        elem.setName(C_CALCULAR_RETENCIONES);
        elem.setKey(K_CALCULAR_RETENCIONES);
        elem.setValue(Cairo.Util.boolToInt(m_calcularRetenciones));

        var elem = properties.add(null, C_COBRANZAS_X_HOJA_RUTA);
        elem.setType(T.check);
        elem.setName(Cairo.Language.getText(5122, "")); // Cobranzas por Hoja de Ruta
        elem.setKey(K_COBRANZAS_XHOJARUTA);
        elem.setValue(m_cobranzasXHojaRuta);

        var elem = properties.add(null, C_GRABAR_ASIENTO_COBRANZA);
        elem.setType(T.check);
        elem.setName(Cairo.Language.getText(3126, "")); // Grabar asiento al grabar la Cobranza
        elem.setKey(K_GRABAR_ASIENTO_COBRANZA);
        elem.setValue(m_grabarAsientoCobranza);
        elem.setTabIndex(c_tab_contabilidad);

        var elem = properties.add(null, C_GRABAR_ASIENTO_ORDEN_PAGO);
        elem.setType(T.check);
        elem.setName(Cairo.Language.getText(3127, "")); // Grabar asiento al grabar la Orden de Pago
        elem.setKey(K_GRABAR_ASIENTO_ORDEN_PAGO);
        elem.setValue(m_grabarAsientoOrdenPago);
        elem.setTabIndex(c_tab_contabilidad);

        var elem = properties.add(null, C_GRABAR_ASIENTO_MOVIMIENTO_FONDO);
        elem.setType(T.check);
        elem.setName(Cairo.Language.getText(3128, "")); // Grabar asiento al grabar el Movimiento de Fondos
        elem.setKey(K_GRABAR_ASIENTO_MOVIMIENTO_FONDO);
        elem.setValue(m_grabarAsientoMovimientoFondo);
        elem.setTabIndex(c_tab_contabilidad);

        var elem = properties.add(null, C_GRABAR_ASIENTO_RENDICION);
        elem.setType(T.check);
        elem.setName(Cairo.Language.getText(3129, "")); // Grabar asiento al grabar la Rendición
        elem.setKey(K_GRABAR_ASIENTO_RENDICION);
        elem.setValue(m_grabarAsientoRendicion);
        elem.setTabIndex(c_tab_contabilidad);

        var elem = properties.add(null, C_GRABAR_ASIENTO_DEPOSITO_BANCO);
        elem.setType(T.check);
        elem.setName(Cairo.Language.getText(3130, "")); // Grabar asiento al grabar el Depósito Bancario
        elem.setKey(K_GRABAR_ASIENTO_DEPOSITO_BANCO);
        elem.setValue(m_grabarAsientoDepositoBanco);
        elem.setTabIndex(c_tab_contabilidad);

        var elem = properties.add(null, C_GRABAR_ASIENTO_DEPOSITO_CUPON);
        elem.setType(T.check);
        elem.setName(Cairo.Language.getText(3131, "")); // Grabar asiento al grabar la presentación de Cupones
        elem.setKey(K_GRABAR_ASIENTO_DEPOSITO_CUPON);
        elem.setValue(m_grabarAsientoDepositoCupon);
        elem.setTabIndex(c_tab_contabilidad);

        var elem = properties.add(null, C_GRABAR_ASIENTO_RESOLUCION_CUPON);
        elem.setType(T.check);
        elem.setName(Cairo.Language.getText(3132, "")); // Grabar asiento al grabar la Resolución de Cupones
        elem.setKey(K_GRABAR_ASIENTO_RESOLUCION_CUPON);
        elem.setValue(m_grabarAsientoResolucionCupon);
        elem.setTabIndex(c_tab_contabilidad);

        var elem = properties.add(null, C_GRABAR_ASIENTO_AGRUPADO);
        elem.setType(T.check);
        elem.setName(Cairo.Language.getText(4820, "")); // Grabar el asiento agrupado por cuentas
        elem.setKey(K_GRABAR_ASIENTO_AGRUPADO);
        elem.setValue(m_grabarAsientoAgrupado);
        elem.setTabIndex(c_tab_contabilidad);

        var elem = properties.add(null, C_EXIGIR_CENTRO_COSTO);
        elem.setType(T.check);
        elem.setName(C_EXIGIR_CENTRO_COSTO);
        elem.setValue(Cairo.Util.boolToInt(m_exigirCentroCosto));
        elem.setKey(K_EXIGIR_CENTRO_COSTO);
        elem.setTabIndex(c_tab_contabilidad);

        var elem = properties.add(null, C_RETENCION);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridRetencion(elem);
        loadRetencion(elem);
        elem.setName(C_RETENCION);
        elem.setKey(K_RET_ID);
        elem.setTabIndex(c_tab_retencion);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        if(!m_dialog.show(self)) { return false; }

        return true;
      };

      var setGridRetencion = function(property) {
        var grid = property.getGrid();

        var columns = grid.getColumns();
        columns.clear();

        var elem = columns.add(null);
        elem.setVisible(false);

        var elem = columns.add(null);
        elem.setName(Cairo.Language.getText(1403, "")); // Retencion
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.RETENCION);
        elem.setKey(KI_RET_ID);

        grid.getRows().clear();
      }

      var loadRetencion = function(property) {
        var rows = property.getGrid().getRows();
        rows.clear();

        for(var _i = 0; _i < m_settings.length; _i += 1) {

          switch (getValue(m_settings[_i], C.CONFIG_KEY)) {

            case C_RETENCION:

              var row = rows.add(null);
              row.add(null);

              var value = getValue(m_settings[_i], C.CONFIG_VALUE);
              var elem = row.add(null);
              elem.setValue(value.name);
              elem.setId(value.id);
              elem.setKey(KI_RET_ID);

              break;
          }
        }
        return true;
      };

      var refreshCollection = function() {

        var properties = m_dialog.getProperties();

        var elem = properties.item(C_DEFAULT_DIF_CAMBIO);
        elem.setListItemData(m_defaultDifCambio);

        var elem = properties.item(C_CUE_ID_DIF_CAMBIO);
        elem.setSelectId(m_cueIdDifCambio);
        elem.setValue(m_cuentaDifCambio);

        var elem = properties.item(C_NC_DIF_CAMBIO);
        elem.setSelectId(m_docIdNCdifCambio);
        elem.setValue(m_docNCDifCambio);

        var elem = properties.item(C_ND_DIF_CAMBIO);
        elem.setSelectId(m_docIdNDdifCambio);
        elem.setValue(m_docNDDifCambio);

        var elem = properties.item(C_PR_ID_DIF_CAMBIO);
        elem.setSelectId(m_prIdDifCambio);
        elem.setValue(m_productoDifCambio);

        var elem = properties.item(C_MODO_IVA_DIF_CAMBIO);
        elem.setListItemData(m_modoIvaDifCambio);

        var elem = properties.item(C_APLICACION_DIF_CAMBIO);
        elem.setListItemData(m_aplicacionDifCambio);

        var elem = properties.item(C_DOC_ID_COBRANZA);
        elem.setSelectId(m_docIdCobranza);
        elem.setValue(m_docCobranza);

        var elem = properties.item(C_DOC_ID_ORDEN_PAGO);
        elem.setSelectId(m_docIdOrdenPago);
        elem.setValue(m_docOrdenPago);

        var elem = properties.item(C_CUENTA_ANTICIPO_COBRANZA);
        elem.setValue(m_cueAnticipoCobz);
        elem.setSelectId(m_cueIdAntCobz);

        var elem = properties.item(C_CUENTA_ANTICIPO_PAGOS);
        elem.setValue(m_cueAnticipoOpg);
        elem.setSelectId(m_cueIdAntOpg);

        var elem = properties.item(C_CALCULAR_RETENCIONES);
        elem.setValue(Cairo.Util.boolToInt(m_calcularRetenciones));

        var elem = properties.item(C_COBRANZAS_X_HOJA_RUTA);
        elem.setValue(m_cobranzasXHojaRuta);

        var elem = properties.item(C_GRABAR_ASIENTO_COBRANZA);
        elem.setValue(m_grabarAsientoCobranza);

        var elem = properties.item(C_GRABAR_ASIENTO_ORDEN_PAGO);
        elem.setValue(m_grabarAsientoOrdenPago);

        var elem = properties.item(C_GRABAR_ASIENTO_MOVIMIENTO_FONDO);
        elem.setValue(m_grabarAsientoMovimientoFondo);

        var elem = properties.item(C_GRABAR_ASIENTO_RENDICION);
        elem.setValue(m_grabarAsientoRendicion);

        var elem = properties.item(C_GRABAR_ASIENTO_DEPOSITO_BANCO);
        elem.setValue(m_grabarAsientoDepositoBanco);

        var elem = properties.item(C_GRABAR_ASIENTO_DEPOSITO_CUPON);
        elem.setValue(m_grabarAsientoDepositoCupon);

        var elem = properties.item(C_GRABAR_ASIENTO_RESOLUCION_CUPON);
        elem.setValue(m_grabarAsientoResolucionCupon);

        var elem = properties.item(C_GRABAR_ASIENTO_AGRUPADO);
        elem.setValue(m_grabarAsientoAgrupado);

        var elem = properties.item(C_EXIGIR_CENTRO_COSTO);
        elem.setValue(Cairo.Util.boolToInt(m_exigirCentroCosto));

        loadRetencion(getRetencion());

        return m_dialog.showValues(properties);
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