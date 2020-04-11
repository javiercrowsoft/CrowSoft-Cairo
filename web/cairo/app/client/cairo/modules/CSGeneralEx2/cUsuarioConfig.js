(function() {
  "use strict";

  Cairo.module("UsuarioConfig.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var UserConfigSection = {
      purchases: 1,
      stock: 2,
      sales: 3,
      general: 4,
      treasury: 5,
      services: 6,
      preferences: 7
    };

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;

      var C_MODULE = "cUsuarioConfig";

      var K_INFORMAR_ANTICIPOS = 1;
      var K_DOC_ID_PREV = 2;
      var K_DOC_ID_PV = 3;
      var K_DOC_ID_RV = 4;
      var K_DOC_ID_RV_C = 104;
      var K_DOC_ID_FV = 5;
      var K_DOC_ID_COBZ = 106;
      var K_DOC_ID_OS = 100;
      var K_DOC_ID_PRP = 101;
      var K_PTD_FECHAINI = 102;
      var K_USE_PRINTER_SIZE = 103;

      var K_DOC_ID_PC = 6;
      var K_DOC_ID_PREC = 7;
      var K_DOC_ID_COT = 8;
      var K_DOC_ID_OC = 9;
      var K_DOC_ID_RC = 10;
      var K_DOC_ID_FC = 11;

      var K_DOC_ID_MF = 20;
      var K_DOC_ID_DBCO = 21;

      var K_DOC_ID_LIQ = 22;

      var K_DEPL_ID = 12;
      var K_DEPL_ID_SRV = 14;

      var K_DESKTOP = 13;
      var K_LENGUAJE = 200;
      var K_AUTO_SIZE_COLS = 202;
      var K_MULTI_SELECT = 203;
      var K_SHOW_SAVE_AS = 204;
      var K_SHOW_ALL_IN_WIZARD = 205;
      var K_FOLDER_TO_EXPORT_PDF = 206;

      var K_CLIENTE_X_DEFECTO = 305;
      var K_CUENTA_FVO_X_DEFECTO = 306;
      var K_NUEVO_AL_GRABAR = 307;
      var K_NUEVO_PTD_AL_GRABAR = 311;

      var K_PRINT_IN_NEW_FV = 312;
      var K_PRINT_IN_NEW_COBZ_CDO = 313;

      var K_CLOSE_WIZARD = 24;
      var K_NO_ASK_IN_PRINT = 25;

      var K_SHOW_BARCODE_INPUT_CTRLS = 201;

      var K_SHOWDATAADIC_IN_VENTAS = 308;
      var K_SHOWDATAADIC_IN_COMPRAS = 309;

      var K_PARTE_REPARACION_ESTADO_DEFAULT = 310;

      var K_VIEW_NAMES_IN_TOOLBAR = 320;

      var K_ESTADO_EN_HOJA_RUTA = 330;
      var K_ESTADO_EN_PICKING_LIST = 331;

      var K_DEBE_HABER_MF = 350;

      var K_USAR_COLORES_EN_DOCUMENTOS = 351;

      var K_PICKINLIST_DOC_ID_FACTURA = 360;
      var K_PICKINLIST_DOC_ID_INTERNO = 361;

      // Color en Empresa
      //
      var K_COLOR_BACKGROUND = 370;

      //
      // sales
      //
      var GRUPO_USUARIO_CONFIG = "Usuario-Config";
      var INFORMAR_ANTICIPOS = "Informar Anticipos";

      var CLIENTE_X_DEFECTO = "Cliente por Defecto";
      var CUENTA_FVO_X_DEFECTO = "Cuenta Efvo x Defecto";
      var NUEVO_AL_GRABAR = "Nuevo al Grabar";
      var SHOW_DATA_ADD_IN_VENTAS = "Mostrar Data en Ventas";
      var SHOW_DATA_ADD_IN_COMPRAS = "Mostrar Data en Compras";

      var NUEVO_PTD_AL_GRABAR = "Nuevo PTD al Grabar";
      var PRINT_IN_NEW_FV = "Imprimir en Nueva Factura";
      var PRINT_IN_NEW_COBZ_CDO = "Imprimir en Cobranza Cdo";

      var ESTADO_HOJA_RUTA = "Estado en Hoja de Ruta";
      var ESTADO_PICKING_LIST = "Estado en Picking List";

      var CLOSE_WIZARD = "Cerrar el Asistente al Finalizar";
      var NO_ASK_IN_PRINT = "No Pedir Confirmar al Imprimir";

      //
      // sale documents
      //
      var DOC_PREV = "Documento de Presupuesto";
      var DOC_PV = "Documento de Pedido";
      var DOC_RV = "Documento de Remito";
      var DOC_FV = "Documento de Factura";
      var DOC_COBZ = "Documento de Cobranza Contado";

      var DOC_RV_C = "Documento Cancelacion de Remito";

      //
      // purchase documents
      //
      var DOC_PC = "Documento de Pedido";
      var DOC_PREC = "Documento de Presupuesto";
      var DOC_OC = "Documento de Orden de Compra";
      var DOC_COT = "Documento de Cotizacion";
      var DOC_RC = "Documento de Remito";
      var DOC_FC = "Documento de Factura";

      //
      // treasury
      //
      var DEBE_HABER_MF = "Usar Debe Haber en Movimiento de Fondos";

      //
      // treasury documents
      //
      var DOC_MF = "Documento de Movimiento de Fondos";
      var DOC_DBCO = "Documento de Deposito Bancario";
      var DOC_LIQ = "Documento de Liquidacion";

      //
      // service documents
      //
      var DOC_OS = "Documento de Orden de Servicios";
      var DOC_PRP = "Documento de Parte de Reparacion";
      var PRP_ESTADO_X_DEF = "Usar Rep. y Aprob. x Defecto en P.Rep.";

      //
      // picking list
      //
      var PKL_DOC_FACTURA = "Documento Factura Despachos";
      var PKL_DOC_INTERNO = "Documento Interno Despachos";

      //
      // journal notes
      //
      var PTD_FECHA = "Cambiar Fecha Fin en Partes Diarios";

      //
      // printing
      //
      var USE_PRINTER_SIZE = "Usar el Tamaño de Papel que Reporta la Impresora";

      //
      // stock
      //
      var DEPOSITO = "Deposito";
      var DEPOSITO_SRV = "Deposito Servicios";

      //
      // language
      //
      var LENGUAJE = "Lenguaje";

      //
      // desktop
      //
      var DESKTOP = "Escritorio";

      //
      // grid columns
      //
      var AUTO_SIZE_COLS = "Autoajustar Columnas";

      //
      // selection
      //
      var MULTI_SELECT = "Usar Multiple Seleccion";

      //
      // barcode
      //
      var SHOW_BARCODE_INPUT_CTRLS = "Mostar Controles para Codigos de Barras";

      //
      // toolbar
      //
      var VIEW_NAMES_IN_TOOLBAR = "Ver Nombre en Toolbar";

      //
      // saving
      //
      var SHOW_SAVE_AS = "Mostrar Guardar Como";

      //
      // wizards
      //
      var SHOW_ALL_IN_WIZARD = "Mostrar todos los comprobantes en asistentes";

      //
      // export
      //
      var FOLDER_TO_EXPORT_PDF = "Carpeta destino de exportación PDF";

      //
      // colors
      //
      var USAR_COLORES_EN_DOC = "Usar colores en doc";
      var COLOR_EN_EMPRESA = "Color Empresa";

      var m_userId = NO_ID;

      var m_informarAnticipos;

      var m_docIdAs = 0;
      var m_docAsName = "";

      var m_docIdPc = 0;
      var m_docPcName = "";
      var m_docIdPrec = 0;
      var m_docPrecName = "";
      var m_docIdCot = 0;
      var m_docCotName = "";
      var m_docIdOc = 0;
      var m_docOcName = "";
      var m_docIdRc = 0;
      var m_docRcName = "";
      var m_docIdFc = 0;
      var m_docFcName = "";

      var m_lengId = 0;
      var m_lengName = "";
      var m_autoSizeCols;
      var m_multiSelect;
      var m_usePrinterSize;
      var m_showSaveAs;
      var m_showAllInWizard;
      var m_folderToExportPDF = "";

      var m_deplId = 0;
      var m_deplName = "";
      var m_deplRamId = "";

      var m_deplIdSrv = 0;
      var m_deplNameSrv = "";
      var m_deplRamIdSrv = "";

      var m_docIdPrev = 0;
      var m_docPrevName = "";
      var m_docIdPv = 0;
      var m_docPvName = "";
      var m_docIdRv = 0;
      var m_docRvName = "";
      var m_docIdRvC = 0;
      var m_docRvNameC = "";
      var m_docIdFv = 0;
      var m_docFvName = "";
      var m_docIdCobz = 0;
      var m_docCobzName = "";

      var m_docIdOs = 0;
      var m_docOSName = "";
      var m_docIdPrp = 0;
      var m_docPRPName = "";

      var m_docIdSt = 0;
      var m_docStName = "";

      var m_docIdLiq = 0;
      var m_docLiqName = "";

      var m_pklDocIdFactura = 0;
      var m_pklDocFactura = "";

      var m_pklDocIdInterno = 0;
      var m_pklDocInterno = "";

      var m_ptdFecha;

      var m_PrpEstadoDef;

      var m_docIdMf = 0;
      var m_docMfName = "";
      var m_docIdDbco = 0;
      var m_docDbcoName = "";
      var m_debeHaberMf;

      var m_desktop = "";

      var m_showBarcodeInputCtrls;

      var m_cliIdXDefecto = 0;
      var m_clienteXDefecto = "";

      var m_cueIdFvoXDefecto = 0;
      var m_cuentaFvoXDefecto = "";

      var m_nuevoAlGrabar;
      var m_printInNewFV;
      var m_printInNewCobzCdo;
      var m_closeWizard;
      var m_noAskInPrint;

      var m_showDataAddInVentas;
      var m_showDataAddInCompras;

      var m_nuevoPtdAlGrabar;

      var m_viewNamesInToolbar;
      var m_usarColoresEnDocumentos;

      var m_estIdHojaRuta = "";
      var m_estadoHojaRuta = "";

      var m_estIdPickinglist = "";
      var m_estadoPickingList = "";

      var m_colorEnEmpresa = 0;

      var m_editing;

      var m_dialog;
      var m_listController = null;

      var m_apiPath = Cairo.Database.getAPIVersion();

      var getValue = Cairo.Database.getValue;
      var val = Cairo.Util.val;
      var sq = Cairo.Database.sqlString;
      var ucs = UserConfigSection;

      var CFG_GRUPO = C.CFG_GRUPO;
      var EMP_ID = C.EMP_ID;
      var TEXT = Cairo.Constants.Types.text;
      var ID = Cairo.Constants.Types.id;

      //
      // property getters
      //

      self.getShowBarcodeInputCtrls = function() {
        return m_showBarcodeInputCtrls;
      };

      self.getInformarAnticipos = function() {
        return m_informarAnticipos;
      };
      /*
       self.getDocPreeId = function() {

       };
       */
      self.getDocAsId = function() {
        return m_docIdAs;
      };

      self.getDocStId = function() {
        return m_docIdSt;
      };
      /*      
       self.getDocRsId = function() {

       };

       self.getDocPpkId = function() {

       };

       self.getDocOpkId = function() {

       };

       self.getDocPembId = function() {

       };

       self.getDocMfcId = function() {

       };

       self.getDocImptId = function() {

       };

       self.getDocPklstId = function() {

       };
       */
      self.getDocDbcoId = function() {
        return m_docIdDbco;
      };
      /*
       self.getDocDcupId = function() {

       };
       */
      self.getDocMfId = function() {
        return m_docIdMf;
      };

      self.getDocPcId = function() {
        return m_docIdPc;
      };

      self.getDocPrecId = function() {
        return m_docIdPrec;
      };

      self.getDocCotId = function() {
        return m_docIdCot;
      };

      self.getDocOcId = function() {
        return m_docIdOc;
      };

      self.getDocRcId = function() {
        return m_docIdRc;
      };

      self.getDocFcId = function() {
        return m_docIdFc;
      };

      self.getDocPrevId = function() {
        return m_docIdPrev;
      };

      self.getDocPvId = function() {
        return m_docIdPv;
      };

      self.getDocRvId = function() {
        return m_docIdRv;
      };

      self.getDocRvId_C = function() {
        return m_docIdRvC;
      };

      self.getDocFvId = function() {
        return m_docIdFv;
      };

      self.getPklDocIdFactura = function() {
        return m_pklDocIdFactura;
      };

      self.getPklDocIdInerno = function() {
        return m_pklDocIdInterno;
      };

      self.getDocCobzId = function() {
        return m_docIdCobz;
      };

      self.getDocOsId = function() {
        return m_docIdOs;
      };

      self.getDocPrpId = function() {
        return m_docIdPrp;
      };

      self.getDocLIQId = function() {
        return m_docIdLiq;
      };

      self.getPtdFecha = function() {
        return m_ptdFecha;
      };

      self.getPrpEstadoDef = function() {
        return m_PrpEstadoDef;
      };

      self.getDeplId = function() {
        return m_deplId;
      };

      self.getDeplIdSrv = function() {
        return m_deplIdSrv;
      };

      self.getLengId = function() {
        return m_lengId;
      };

      self.getAutoSizeCols = function() {
        return m_autoSizeCols;
      };

      self.getMultiSelect = function() {
        return m_multiSelect;
      };

      self.getUsePrinterSize = function() {
        return m_usePrinterSize;
      };

      self.getShowSaveAs = function() {
        return m_showSaveAs;
      };

      self.getShowAllInWizard = function() {
        return m_showAllInWizard;
      };

      self.getDeplRamId = function() {
        return m_deplRamId;
      };

      self.getDeplRamIdSrv = function() {
        return m_deplRamIdSrv;
      };
      /*
       self.getDocPreeName = function() {

       };
       */
      self.getDocAsName = function() {
        return m_docAsName;
      };

      self.getDocStName = function() {
        return m_docStName;
      };
      /*
       self.getDocRsName = function() {

       };

       self.getDocPpkName = function() {

       };

       self.getDocOpkName = function() {

       };

       self.getDocPembName = function() {

       };

       self.getDocMfcName = function() {

       };

       self.getDocImptName = function() {

       };

       self.getDocPklstName = function() {

       };
       */
      self.getDocDbcoName = function() {
        return m_docDbcoName;
      };
      /*
       self.getDocDcupName = function() {

       };
       */
      self.getDocMfName = function() {
        return m_docMfName;
      };

      self.getDocPcName = function() {
        return m_docPcName;
      };

      self.getDocPrecName = function() {
        return m_docPrecName;
      };

      self.getDocCotName = function() {
        return m_docCotName;
      };

      self.getDocOcName = function() {
        return m_docOcName;
      };

      self.getDocRcName = function() {
        return m_docRcName;
      };

      self.getDocFcName = function() {
        return m_docFcName;
      };

      self.getDocPrevName = function() {
        return m_docPrevName;
      };

      self.getDocPvName = function() {
        return m_docPvName;
      };

      self.getDocRvName = function() {
        return m_docRvName;
      };

      self.getDocRvNameC = function() {
        return m_docRvNameC;
      };

      self.getDocFvName = function() {
        return m_docFvName;
      };

      self.getPklDocFactura = function() {
        return m_pklDocFactura;
      };

      self.getPklDocInterno = function() {
        return m_pklDocInterno;
      };

      self.getDocCobzName = function() {
        return m_docCobzName;
      };

      self.getDocOsName = function() {
        return m_docOSName;
      };

      self.getDocPrpName = function() {
        return m_docPRPName;
      };

      self.getDocLIQName = function() {
        return m_docLiqName;
      };

      self.getDeplName = function() {
        return m_deplName;
      };

      self.getDeplNameSrv = function() {
        return m_deplNameSrv;
      };

      self.getDesktop = function() {
        return m_desktop;
      };

      self.getFolderToExportPDF = function() {
        return m_folderToExportPDF;
      };

      self.getViewNamesInToolbar = function() {
        return m_viewNamesInToolbar;
      };

      self.getUseColorsInDocuments = function() {
        return m_usarColoresEnDocumentos;
      };

      self.getColorEnEmpresa = function() {
        return m_colorEnEmpresa;
      };

      self.getCueIdFvoXDefecto = function() {
        return m_cueIdFvoXDefecto;
      };

      self.getCuentaFvoXDefecto = function() {
        return m_cuentaFvoXDefecto;
      };

      self.getCliIdxDefecto = function() {
        return m_cliIdXDefecto;
      };

      self.getClienteXDefecto = function() {
        return m_clienteXDefecto;
      };

      self.getNuevoAlGrabar = function() {
        return m_nuevoAlGrabar;
      };

      self.getPrintInNewFv = function() {
        return m_printInNewFV;
      };

      self.getPrintInNewCobzCdo = function() {
        return m_printInNewCobzCdo;
      };

      self.getNuevoPTDAlGrabar = function() {
        return m_nuevoPtdAlGrabar;
      };

      self.getShowDataAddInVentas = function() {
        return m_showDataAddInVentas;
      };

      self.getShowDataAddInCompras = function() {
        return m_showDataAddInCompras;
      };

      self.getEstIdHojaRuta = function() {
        return m_estIdHojaRuta;
      };

      self.getEstadoHojaRuta = function() {
        return m_estadoHojaRuta;
      };

      self.getEstIdPickinglist = function() {
        return m_estIdPickinglist;
      };

      self.getEstadoPickingList = function() {
        return m_estadoPickingList;
      };

      self.getDebeHaberMf = function() {
        return m_debeHaberMf;
      };

      self.getCloseWizard = function() {
        return m_closeWizard;
      };

      self.getNoAskInPrint = function() {
        return m_noAskInPrint;
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
        var fields = null;

        var mainRegister = new Cairo.Database.Register();
        var transaction = Cairo.Database.createTransaction();

        var companyId = Cairo.Company.getId().toString();

        transaction.setTable(C.CONFIGURACION)

        var _count = m_dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {

          var property = m_dialog.getProperties().item(_i);

          switch (property.getKey()) {

            //
            // purchase
            //  

            case K_DOC_ID_PC:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(DOC_PC, ucs.purchases)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(DOC_PC, ucs.purchases), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_PREC:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(DOC_PREC, ucs.purchases)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(DOC_PREC, ucs.purchases), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_COT:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(DOC_COT, ucs.purchases)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(DOC_COT, ucs.purchases), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_OC:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(DOC_OC, ucs.purchases)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(DOC_OC, ucs.purchases), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_RC:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(DOC_RC, ucs.purchases)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(DOC_RC, ucs.purchases), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_FC:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(DOC_FC, ucs.purchases)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(DOC_FC, ucs.purchases), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_SHOWDATAADIC_IN_COMPRAS:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(SHOW_DATA_ADD_IN_COMPRAS, ucs.purchases)), TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(SHOW_DATA_ADD_IN_COMPRAS, ucs.purchases), TEXT);
              fields.add(C.CONFIG_VALUE, val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            //
            // stock
            //
            case K_DEPL_ID:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(DEPOSITO, ucs.stock)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(DEPOSITO, ucs.stock), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_DEPL_ID_SRV:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(DEPOSITO_SRV, ucs.stock)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(DEPOSITO_SRV, ucs.stock), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            //
            // sales
            //
            case K_INFORMAR_ANTICIPOS:

              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(INFORMAR_ANTICIPOS, ucs.sales)), TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(INFORMAR_ANTICIPOS, ucs.sales), TEXT);
              fields.add(C.CONFIG_VALUE, val(property.getValue()) ? 1 : 0, TEXT);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_PREV:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(DOC_PREV, ucs.sales)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(DOC_PREV, ucs.sales), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_PV:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(DOC_PV, ucs.sales)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(DOC_PV, ucs.sales), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_RV:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(DOC_RV, ucs.sales)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(DOC_RV, ucs.sales), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_RV_C:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(DOC_RV_C, ucs.sales)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(DOC_RV_C, ucs.sales), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_FV:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(DOC_FV, ucs.sales)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(DOC_FV, ucs.sales), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_COBZ:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(DOC_COBZ, ucs.sales)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(DOC_COBZ, ucs.sales), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_VIEW_NAMES_IN_TOOLBAR:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(VIEW_NAMES_IN_TOOLBAR, ucs.general)), TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(VIEW_NAMES_IN_TOOLBAR, ucs.general), TEXT);
              fields.add(C.CONFIG_VALUE, property.getValue(), TEXT);

              transaction.addRegister(register);
              break;

            case K_PARTE_REPARACION_ESTADO_DEFAULT:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(PRP_ESTADO_X_DEF, ucs.services)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(PRP_ESTADO_X_DEF, ucs.services), TEXT);
              fields.add(C.CONFIG_VALUE, val(property.getValue()), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_SHOWDATAADIC_IN_VENTAS:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(SHOW_DATA_ADD_IN_VENTAS, ucs.sales)), TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(SHOW_DATA_ADD_IN_VENTAS, ucs.sales), TEXT);
              fields.add(C.CONFIG_VALUE, val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_SHOW_BARCODE_INPUT_CTRLS:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(SHOW_BARCODE_INPUT_CTRLS) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, SHOW_BARCODE_INPUT_CTRLS, TEXT);
              fields.add(C.CONFIG_VALUE, val(property.getValue()), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_ESTADO_EN_HOJA_RUTA:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(ESTADO_HOJA_RUTA, ucs.sales)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(ESTADO_HOJA_RUTA, ucs.sales), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectIntValue(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            //
            // Picking List
            //  

            case K_PICKINLIST_DOC_ID_FACTURA:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(PKL_DOC_FACTURA, ucs.sales)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(PKL_DOC_FACTURA, ucs.sales), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_PICKINLIST_DOC_ID_INTERNO:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(PKL_DOC_INTERNO, ucs.sales)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(PKL_DOC_INTERNO, ucs.sales), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_ESTADO_EN_PICKING_LIST:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(ESTADO_PICKING_LIST, ucs.sales)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(ESTADO_PICKING_LIST, ucs.sales), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectIntValue(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            //
            // general
            //

            case K_DESKTOP:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(DESKTOP, ucs.general)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(DESKTOP, ucs.general), TEXT);
              fields.add(C.CONFIG_VALUE, property.getValue(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_USAR_COLORES_EN_DOCUMENTOS:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(USAR_COLORES_EN_DOC, ucs.general)), TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(USAR_COLORES_EN_DOC, ucs.general), TEXT);
              fields.add(C.CONFIG_VALUE, property.getValue(), TEXT);

              transaction.addRegister(register);
              break;

            case K_COLOR_BACKGROUND:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(COLOR_EN_EMPRESA, ucs.general)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(COLOR_EN_EMPRESA, ucs.general), TEXT);
              fields.add(C.CONFIG_VALUE, property.getValue(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_FOLDER_TO_EXPORT_PDF:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(FOLDER_TO_EXPORT_PDF, ucs.general)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(FOLDER_TO_EXPORT_PDF, ucs.general), TEXT);
              fields.add(C.CONFIG_VALUE, property.getValue(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_LENGUAJE:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(LENGUAJE, ucs.general)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(LENGUAJE, ucs.general), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_AUTO_SIZE_COLS:

              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(AUTO_SIZE_COLS, ucs.general)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(AUTO_SIZE_COLS, ucs.general), TEXT);
              fields.add(C.CONFIG_VALUE, val(property.getValue()), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_MULTI_SELECT:

              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(MULTI_SELECT, ucs.general)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(MULTI_SELECT, ucs.general), TEXT);
              fields.add(C.CONFIG_VALUE, val(property.getValue()), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_SHOW_SAVE_AS:

              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(SHOW_SAVE_AS, ucs.general)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(SHOW_SAVE_AS, ucs.general), TEXT);
              fields.add(C.CONFIG_VALUE, val(property.getValue()), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_SHOW_ALL_IN_WIZARD:

              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(SHOW_ALL_IN_WIZARD, ucs.general)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(SHOW_ALL_IN_WIZARD, ucs.general), TEXT);
              fields.add(C.CONFIG_VALUE, val(property.getValue()), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            //
            // tresaury
            //

            case K_DOC_ID_MF:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(DOC_MF, ucs.treasury)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(DOC_MF, ucs.treasury), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_DBCO:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(DOC_DBCO, ucs.treasury)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(DOC_DBCO, ucs.treasury), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_DEBE_HABER_MF:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(DEBE_HABER_MF, ucs.treasury)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(DEBE_HABER_MF, ucs.treasury), TEXT);
              fields.add(C.CONFIG_VALUE, property.getValue(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            //
            // services
            //

            case K_DOC_ID_OS:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(DOC_OS, ucs.services)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(DOC_OS, ucs.services), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_DOC_ID_PRP:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(DOC_PRP, ucs.services)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(DOC_PRP, ucs.services), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            //
            // preferences
            //

            case K_DOC_ID_LIQ:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(DOC_LIQ, ucs.preferences)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(DOC_LIQ, ucs.preferences), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_USE_PRINTER_SIZE:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(USE_PRINTER_SIZE, ucs.general)), TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(USE_PRINTER_SIZE, ucs.general), TEXT);
              fields.add(C.CONFIG_VALUE, val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_PTD_FECHAINI:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(PTD_FECHA, ucs.services)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(PTD_FECHA, ucs.services), TEXT);
              fields.add(C.CONFIG_VALUE, val(property.getValue()), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_NUEVO_AL_GRABAR:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(NUEVO_AL_GRABAR, ucs.sales)), TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(NUEVO_AL_GRABAR, ucs.sales), TEXT);
              fields.add(C.CONFIG_VALUE, val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_NUEVO_PTD_AL_GRABAR:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(NUEVO_PTD_AL_GRABAR, ucs.sales)), TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(NUEVO_PTD_AL_GRABAR, ucs.sales), TEXT);
              fields.add(C.CONFIG_VALUE, val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_PRINT_IN_NEW_FV:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(PRINT_IN_NEW_FV, ucs.sales)), TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(PRINT_IN_NEW_FV, ucs.sales), TEXT);
              fields.add(C.CONFIG_VALUE, val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_PRINT_IN_NEW_COBZ_CDO:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(PRINT_IN_NEW_COBZ_CDO, ucs.sales)), TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(PRINT_IN_NEW_COBZ_CDO, ucs.sales), TEXT);
              fields.add(C.CONFIG_VALUE, val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_CLIENTE_X_DEFECTO:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(CLIENTE_X_DEFECTO, ucs.sales)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(CLIENTE_X_DEFECTO, ucs.sales), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_CUENTA_FVO_X_DEFECTO:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(CUENTA_FVO_X_DEFECTO, ucs.sales)) + ", emp_id:" + companyId, TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(CUENTA_FVO_X_DEFECTO, ucs.sales), TEXT);
              fields.add(C.CONFIG_VALUE, property.getSelectId(), TEXT);
              fields.add(EMP_ID, Cairo.Company.getId(), ID);

              transaction.addRegister(register);
              break;

            case K_CLOSE_WIZARD:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(CLOSE_WIZARD, ucs.sales)), TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(CLOSE_WIZARD, ucs.sales), TEXT);
              fields.add(C.CONFIG_VALUE, val(property.getValue()), TEXT);

              transaction.addRegister(register);
              break;

            case K_NO_ASK_IN_PRINT:
              register = new Cairo.Database.Register();

              fields = register.getFields();
              fields.add(C.CONFIG_FILTER, "cfg_grupo:" + sq(GRUPO_USUARIO_CONFIG) + ", cfg_aspecto:" + sq(ck(NO_ASK_IN_PRINT, ucs.sales)), TEXT);
              fields.add(CFG_GRUPO, GRUPO_USUARIO_CONFIG, TEXT);
              fields.add(C.CONFIG_KEY, ck(NO_ASK_IN_PRINT, ucs.sales), TEXT);
              fields.add(C.CONFIG_VALUE, val(property.getValue()), TEXT);

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
          getText(2938, "") // Error al grabar la Configuración del Usuario

        ).then(

          function(result) {
            if(result.success) {
              return load().then(
                function (success) {
                  if(success) {
                    setColorInCompany();
                  }
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

      var setColorInCompany = function() {
        // TODO: implement this.
      };

      self.getPath = function() {
        return "#general/usuarioconfig";
      };

      self.getEditorName = function() {
        return "usuarioconfig" + m_userId.toString();
      };

      self.getTitle = function() {
        return getText(2933, ""); // Configuración del Usuario
      };

      self.validate = function() {
        return Cairo.Promises.resolvedPromise(true);
      };

      self.validatePREE = function() {

      };

      self.validateIMPT = function() {

      };

      self.validateMFC = function() {

      };

      self.validatePKLST = function() {

      };

      self.validatePEMB = function() {

      };

      self.validateDCUP = function() {

      };

      self.validateMF = function() {
        validate(m_docIdMf, m_docMfName).then(
          function(info) {
            m_docMfName = info.name;
            m_docIdMf = info.id;
          }
        );
      };

      self.validateDBCO = function() {
        validate(m_docIdDbco, m_docDbcoName).then(
          function(info) {
            m_docDbcoName = info.name;
            m_docIdDbco = info.id;
          }
        );
      };

      self.validatePPK = function() {
        self.validateDepl();
      };

      self.validateOPK = function() {
        self.validateDepl();
      };

      self.validateRS = function() {

      };

      self.validateST = function() {

      };

      self.validateAS = function() {

      };

      self.validatePC = function() {
        validate(m_docIdPc, m_docPcName).then(
          function(info) {
            m_docPcName = info.name;
            m_docIdPc = info.id;
          }
        );
      };

      self.validateOC = function() {
        validate(m_docIdOc, m_docOcName).then(
          function(info) {
            m_docOcName = info.name;
            m_docIdOc = info.id;
          }
        );
      };

      self.validateRC = function() {
        validate(m_docIdRc, m_docRcName).then(
          function(info) {
            m_docRcName = info.name;
            m_docIdRc = info.id;
          }
        );
        self.validateDepl();
      };

      self.validateFC = function() {
        validate(m_docIdFc, m_docFcName).then(
          function(info) {
            m_docFcName = info.name;
            m_docIdFc = info.id;
          }
        );
        self.validateDepl();
      };

      self.validatePV = function() {
        validate(m_docIdPv, m_docPvName).then(
          function(info) {
            m_docPvName = info.name;
            m_docIdPv = info.id;
          }
        );
        self.validateDepl();
      };

      self.validateRV = function() {
        validate(m_docIdRv, m_docRvName).then(
          function(info) {
            m_docRvName = info.name;
            m_docIdRv = info.id;
          }
        );
        self.validateDepl();
      };

      self.validateRVC = function() {
        validate(m_docIdRvC, m_docRvNameC).then(
          function(info) {
            m_docRvNameC = info.name;
            m_docIdRvC = info.id;
          }
        );
        self.validateDepl();
      };

      self.validateOS = function() {
        validate(m_docIdOs, m_docOSName).then(
          function(info) {
            m_docOSName = info.name;
            m_docIdOs = info.id;
          }
        );
        self.validateDepl();
      };

      self.validatePRP = function() {
        validate(m_docIdPrp, m_docPRPName).then(
          function(info) {
            m_docPRPName = info.name;
            m_docIdPrp = info.id;
          }
        );
        self.validateDepl();
      };

      self.validateFV = function() {
        validate(m_docIdFv, m_docFvName).then(
          function(info) {
            m_docFvName = info.name;
            m_docIdFv = info.id;
          }
        );
        self.validateDepl();
      };

      self.validatePklFactura = function() {
        validate(m_pklDocIdFactura, m_pklDocFactura).then(
          function(info) {
            m_pklDocFactura = info.name;
            m_pklDocIdFactura = info.id;
          }
        );
      };

      self.validatePklInterno = function() {
        validate(m_pklDocIdInterno, m_pklDocInterno).then(
          function(info) {
            m_pklDocInterno = info.name;
            m_pklDocIdInterno = info.id;
          }
        );
      };

      self.validateLIQ = function() {
        validate(m_docIdLiq, m_docLiqName).then(
          function(info) {
            m_docLiqName = info.name;
            m_docIdLiq = info.id;
          }
        );
      };

      self.validateDepl = function() {
        return Cairo.Select.Controller.validate(Cairo.Tables.DEPOSITO_LOGICO, m_deplName, m_deplId).then(
          function(result) {
            if(result.success) {
              m_deplName = result.info.name;
              m_deplId = Cairo.Util.val(result.info.id);
            }
            else {
              m_deplName = "";
              m_deplId = NO_ID;
            }
          }
        );
      };

      var validate = function(id, name) {
        return Cairo.Select.Controller.validate(Cairo.Tables.DOCUMENTO, name, id).then(
          function(result) {
            if(result.success) {
              return {
                name: result.info.name,
                id: Cairo.Util.val(result.info.id)
              }
            }
            else {
              return {
                name: "",
                id: NO_ID
              };
            }
          }
        );
      };

      var load = function(id) {

        m_userId = id;

        return DB.getData("load[" + m_apiPath + "general/usuarioconfig]", m_userId).then(
          function (response) {

            if(response.success === true) {

              m_informarAnticipos = false;

              var keyInfAnticipos = ck(INFORMAR_ANTICIPOS, ucs.sales);
              var keyNuevoAlGrabar = ck(NUEVO_AL_GRABAR, ucs.sales);
              var keyPrintInNewFv = ck(PRINT_IN_NEW_FV, ucs.sales);
              var keyPrintInNewCobzCdo = ck(PRINT_IN_NEW_COBZ_CDO, ucs.sales);
              var keyNuevoPTDAlGrabar = ck(NUEVO_PTD_AL_GRABAR, ucs.sales);
              var keyUsePrinterSize = ck(USE_PRINTER_SIZE, ucs.general);

              var keyShowDataAddInVentas = ck(SHOW_DATA_ADD_IN_VENTAS, ucs.sales);
              var keyShowDataAddInCompras = ck(SHOW_DATA_ADD_IN_COMPRAS, ucs.purchases);

              var keyViewNamesInTb = ck(VIEW_NAMES_IN_TOOLBAR, ucs.general);
              var keyUsarColoresEnDoc = ck(USAR_COLORES_EN_DOC, ucs.general);

              var keyCloseWizard = ck(CLOSE_WIZARD, ucs.sales);
              var keyNoAskInPrint = ck(NO_ASK_IN_PRINT, ucs.sales);

              var keyDocPc = ck(DOC_PC, ucs.purchases);
              var keyDocCot = ck(DOC_COT, ucs.purchases);
              var keyDocPrec = ck(DOC_PREC, ucs.purchases);
              var keyDocOc = ck(DOC_OC, ucs.purchases);
              var keyDocRc = ck(DOC_RC, ucs.purchases);
              var keyDocFc = ck(DOC_FC, ucs.purchases);

              var keyDocPv = ck(DOC_PV, ucs.sales);
              var keyDocPrev = ck(DOC_PREV, ucs.sales);
              var keyDocRv = ck(DOC_RV, ucs.sales);
              var keyDocRvC = ck(DOC_RV_C, ucs.sales);
              var keyDocFv = ck(DOC_FV, ucs.sales);
              var keyDocCobz = ck(DOC_COBZ, ucs.sales);

              var keyPklDocFac = ck(PKL_DOC_FACTURA, ucs.sales);
              var keyPklDocInt = ck(PKL_DOC_INTERNO, ucs.sales);

              var keyDocOs = ck(DOC_OS, ucs.services);
              var keyDocPrp = ck(DOC_PRP, ucs.services);
              var keyPtdFecha = ck(PTD_FECHA, ucs.services);
              var keyPrpEstadoDef = ck(PRP_ESTADO_X_DEF, ucs.services);

              var keyDocMF = ck(DOC_MF, ucs.treasury);
              var keyDocDBCO = ck(DOC_DBCO, ucs.treasury);
              var keyDebeHaberMf = ck(DEBE_HABER_MF, ucs.treasury);

              var keyDocLIQ = ck(DOC_LIQ, ucs.preferences);

              var keyDepl = ck(DEPOSITO, ucs.stock);
              var keyDeplSrv = ck(DEPOSITO_SRV, ucs.stock);

              var keyDesktop = ck(DESKTOP, ucs.general);
              var keyLenguaje = ck(LENGUAJE, ucs.general);
              var keyAutoSizeCols = ck(AUTO_SIZE_COLS, ucs.general);
              var keyMultiSelect = ck(MULTI_SELECT, ucs.general);
              var keyShowSaveAs = ck(SHOW_SAVE_AS, ucs.general);
              var keyShowAllInWizard = ck(SHOW_ALL_IN_WIZARD, ucs.general);
              var keyFolderToExportPDF = ck(FOLDER_TO_EXPORT_PDF, ucs.general);

              var keyCuentaFvo = ck(CUENTA_FVO_X_DEFECTO, ucs.sales);
              var keyCliente = ck(CLIENTE_X_DEFECTO, ucs.sales);

              var keyEstadoHojaRuta = ck(ESTADO_HOJA_RUTA, ucs.sales);
              var keyEstadoPickingList = ck(ESTADO_PICKING_LIST, ucs.sales);

              var keyColorEmpresa = ck(COLOR_EN_EMPRESA, ucs.general);

              var doc = null;

              m_showBarcodeInputCtrls = false;

              m_docIdPv = NO_ID;
              m_docPvName = "";

              var settings = response.data.get('settings')

              for(var _i = 0; _i < settings.length; _i += 1) {

                switch (getValue(settings[_i], C.CONFIG_KEY)) {
                  case keyInfAnticipos:
                    m_informarAnticipos = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case keyNuevoAlGrabar:
                    m_nuevoAlGrabar = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case keyNuevoPTDAlGrabar:
                    m_nuevoPtdAlGrabar = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case keyPrintInNewFv:
                    m_printInNewFV = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case keyPrintInNewCobzCdo:
                    m_printInNewCobzCdo = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case keyUsePrinterSize:
                    m_usePrinterSize = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case keyShowDataAddInVentas:
                    m_showDataAddInVentas = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case keyShowDataAddInCompras:
                    m_showDataAddInCompras = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case keyViewNamesInTb:
                    m_viewNamesInToolbar = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case keyUsarColoresEnDoc:
                    m_usarColoresEnDocumentos = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case keyCloseWizard:
                    m_closeWizard = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case keyNoAskInPrint:
                    m_noAskInPrint = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case keyDocPc:
                    doc = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdPc = doc.id;
                    m_docPcName = doc.name;
                    break;

                  case keyDocPrec:
                    doc = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdPrec = doc.id;
                    m_docPrecName = doc.name;
                    break;

                  case keyDocCot:
                    doc = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdCot = doc.id;
                    m_docCotName = doc.name;
                    break;

                  case keyDocOc:
                    doc = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdOc = doc.id;
                    m_docOcName = doc.name;
                    break;

                  case keyDocRc:
                    doc = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdRc = doc.id;
                    m_docRcName = doc.name;
                    break;

                  case keyDocFc:
                    doc = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdFc = doc.id;
                    m_docFcName = doc.name;
                    break;

                  case keyDocPv:
                    doc = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdPv = doc.id;
                    m_docPvName = doc.name;
                    break;

                  case keyDocPrev:
                    doc = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdPrev = doc.id;
                    m_docPrevName = doc.name;
                    break;

                  case keyDocRv:
                    doc = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdRv = doc.id;
                    m_docRvName = doc.name;
                    break;

                  case keyDocRvC:
                    doc = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdRvC = doc.id;
                    m_docRvNameC = doc.name;
                    break;

                  case keyDocFv:
                    doc = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdFv = doc.id;
                    m_docFvName = doc.name;
                    break;

                  case keyPklDocFac:
                    doc = getValue(settings[_i], C.CONFIG_VALUE);
                    m_pklDocIdFactura = doc.id;
                    m_pklDocFactura = doc.name;
                    break;

                  case keyPklDocInt:
                    doc = getValue(settings[_i], C.CONFIG_VALUE);
                    m_pklDocIdInterno = doc.id;
                    m_pklDocInterno = doc.name;
                    break;

                  case keyDocCobz:
                    doc = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdCobz = doc.id;
                    m_docCobzName = doc.name;
                    break;

                  case SHOW_BARCODE_INPUT_CTRLS:
                    m_showBarcodeInputCtrls = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case keyDocOs:
                    doc = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdOs = doc.id;
                    m_docOSName = doc.name;
                    break;

                  case keyDocPrp:
                    doc = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdPrp = doc.id;
                    m_docPRPName = doc.name;
                    break;

                  case keyPtdFecha:
                    m_ptdFecha = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case keyPrpEstadoDef:
                    m_PrpEstadoDef = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case keyDocMF:
                    doc = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdMf = doc.id;
                    m_docMfName = doc.name;
                    break;

                  case keyDocDBCO:
                    doc = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdDbco = doc.id;
                    m_docDbcoName = doc.name;
                    break;

                  case keyDebeHaberMf:
                    m_debeHaberMf = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case keyDocLIQ:
                    doc = getValue(settings[_i], C.CONFIG_VALUE);
                    m_docIdLiq = doc.id;
                    m_docLiqName = doc.name;
                    break;

                  case keyDepl:
                    var value = getValue(settings[_i], C.CONFIG_VALUE);
                    m_deplId = value.id;
                    m_deplName = value.name;
                    break;

                  case keyDeplSrv:
                    var value = getValue(settings[_i], C.CONFIG_VALUE);
                    m_deplIdSrv = value.id;
                    m_deplNameSrv = value.name;
                    break;

                  case keyDesktop:
                    m_desktop = getValue(settings[_i], C.CONFIG_VALUE);
                    break;

                  case keyFolderToExportPDF:
                    m_folderToExportPDF = getValue(settings[_i], C.CONFIG_VALUE);
                    break;

                  case keyLenguaje:
                    var language = getValue(settings[_i], C.CONFIG_VALUE);
                    m_lengId = language.id;
                    m_lengName = language.name;
                    break;

                  case keyAutoSizeCols:
                    m_autoSizeCols = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case keyMultiSelect:
                    m_multiSelect = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case keyShowSaveAs:
                    m_showSaveAs = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case keyShowAllInWizard:
                    m_showAllInWizard = val(getValue(settings[_i], C.CONFIG_VALUE));
                    break;

                  case keyCliente:
                    var customer = getValue(settings[_i], C.CONFIG_VALUE);
                    m_cliIdXDefecto = customer.id;
                    m_clienteXDefecto = customer.name;
                    break;

                  case keyCuentaFvo:
                    var account = getValue(settings[_i], C.CONFIG_VALUE);
                    m_cueIdFvoXDefecto = account.id;
                    m_cuentaFvoXDefecto = account.name;
                    break;

                  case keyEstadoHojaRuta:
                    var status = getValue(settings[_i], C.CONFIG_VALUE);
                    m_estIdHojaRuta = status.id;
                    m_estadoHojaRuta = status.name;
                    break;

                  case keyEstadoPickingList:
                    var status = getValue(settings[_i], C.CONFIG_VALUE);
                    m_estIdPickinglist = status.id;
                    m_estadoPickingList = status.name;
                    break;

                  case keyColorEmpresa:
                    m_colorEnEmpresa = val(getValue(settings[_i], C.CONFIG_VALUE));
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

          if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.MODIFY_CONFIG_USUARIO)) { return p; }

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
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.EDIT_FUNCTION, "cUsuarioConfig", "");
        }

        return p;
      };

      self.setTree = function(value) {
        m_listController = value;
      };

      var loadCollection = function() {

        m_dialog.setUseSelectIntValue(true);

        var TAB_GENERAL = 0;
        var TAB_COMPRAS = 1;
        var TAB_STOCK = 2;
        var TAB_VENTAS = 3;
        var TAB_TESORERIA = 4;
        var TAB_SERVICIOS = 5;
        var TAB_PERSONAL = 6;
        var TAB_DESPACHO = 7;
        var TAB_CANCELACION = 8;

        var tabs = m_dialog.getTabs();
        tabs.clear();

        var tab = tabs.add(null);
        tab.setIndex(TAB_GENERAL);
        tab.setName(Cairo.Constants.TAB_GENERAL);

        tab = tabs.add(null);
        tab.setIndex(TAB_COMPRAS);
        tab.setName(getText(1489, "")); // Compras

        tab = tabs.add(null);
        tab.setIndex(TAB_STOCK);
        tab.setName(getText(1298, "")); // Stock

        tab = tabs.add(null);
        tab.setIndex(TAB_VENTAS);
        tab.setName(getText(1488, "")); // Ventas

        tab = tabs.add(null);
        tab.setIndex(TAB_TESORERIA);
        tab.setName(getText(2935, "")); // Tesoreria

        tab = tabs.add(null);
        tab.setIndex(TAB_SERVICIOS);
        tab.setName(getText(2676, "")); // Servicios

        tab = tabs.add(null);
        tab.setIndex(TAB_PERSONAL);
        tab.setName(getText(3880, "")); // Personal

        tab = tabs.add(null);
        tab.setIndex(TAB_DESPACHO);
        tab.setName(getText(4885, "")); // Depachos

        tab = tabs.add(null);
        tab.setIndex(TAB_CANCELACION);
        tab.setName(getText(4959, "")); // Cancelacion

        var properties = m_dialog.getProperties();

        properties.clear();

        //
        // general
        //

        var elem = properties.add(null, DESKTOP);
        elem.setType(Dialogs.PropertyType.file);
        elem.setSelectFilter(getText(2936, "")); // Archivos de Escritorio|*.csd
        elem.setName(DESKTOP);
        elem.setKey(K_DESKTOP);
        elem.setValue(m_desktop);
        elem.setTabIndex(TAB_GENERAL);

        elem = properties.add(null, LENGUAJE);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.LENGUAJE);
        elem.setName(LENGUAJE);
        elem.setKey(K_LENGUAJE);
        elem.setSelectId(m_lengId);
        elem.setValue(m_lengName);
        elem.setTabIndex(TAB_GENERAL);

        elem = properties.add(null, AUTO_SIZE_COLS);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(AUTO_SIZE_COLS);
        elem.setKey(K_AUTO_SIZE_COLS);
        elem.setValue(Cairo.Util.boolToInt(m_autoSizeCols));
        elem.setTabIndex(TAB_GENERAL);

        elem = properties.add(null, MULTI_SELECT);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(MULTI_SELECT);
        elem.setKey(K_MULTI_SELECT);
        elem.setValue(Cairo.Util.boolToInt(m_multiSelect));
        elem.setTabIndex(TAB_GENERAL);

        elem = properties.add(null, USE_PRINTER_SIZE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(USE_PRINTER_SIZE);
        elem.setKey(K_USE_PRINTER_SIZE);
        elem.setValue(Cairo.Util.boolToInt(m_usePrinterSize));
        elem.setTabIndex(TAB_GENERAL);

        elem = properties.add(null, VIEW_NAMES_IN_TOOLBAR);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName("Ver el nombre de los bótones en las barras de herramientas");
        elem.setKey(K_VIEW_NAMES_IN_TOOLBAR);
        elem.setValue(Cairo.Util.boolToInt(m_viewNamesInToolbar));
        elem.setTabIndex(TAB_GENERAL);

        elem = properties.add(null, SHOW_SAVE_AS);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(SHOW_SAVE_AS);
        elem.setKey(K_SHOW_SAVE_AS);
        elem.setValue(Cairo.Util.boolToInt(m_showSaveAs));
        elem.setTabIndex(TAB_GENERAL);

        elem = properties.add(null, SHOW_ALL_IN_WIZARD);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(SHOW_ALL_IN_WIZARD);
        elem.setKey(K_SHOW_ALL_IN_WIZARD);
        elem.setValue(Cairo.Util.boolToInt(m_showAllInWizard));
        elem.setTabIndex(TAB_GENERAL);

        elem = properties.add(null, FOLDER_TO_EXPORT_PDF);
        elem.setType(Dialogs.PropertyType.folder);
        elem.setName(FOLDER_TO_EXPORT_PDF);
        elem.setKey(K_FOLDER_TO_EXPORT_PDF);
        elem.setValue(m_folderToExportPDF);
        elem.setTabIndex(TAB_GENERAL);

        elem = properties.add(null, USAR_COLORES_EN_DOC);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(4821, "")); // Usar colores en documentos
        elem.setKey(K_USAR_COLORES_EN_DOCUMENTOS);
        elem.setValue(m_usarColoresEnDocumentos);
        elem.setTabIndex(TAB_GENERAL);

        elem = properties.add(null, COLOR_EN_EMPRESA);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.integer);
        elem.setName(getText(4915, "")); // Color en Empresa
        elem.setKey(K_COLOR_BACKGROUND);
        elem.setValue(m_colorEnEmpresa);
        elem.setTabIndex(TAB_GENERAL);

        //
        // purchase
        //

        elem = properties.add(null, DOC_PC);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(DOC_PC);
        elem.setKey(K_DOC_ID_PC);
        elem.setSelectId(m_docIdPc);
        elem.setSelectFilter("'doctId = 6'");
        elem.setValue(m_docPcName);
        elem.setTabIndex(TAB_COMPRAS);

        elem = properties.add(null, DOC_PREC);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(DOC_PREC);
        elem.setKey(K_DOC_ID_PREC);
        elem.setSelectId(m_docIdPrec);
        elem.setSelectFilter("'doctId = 12'");
        elem.setValue(m_docPrecName);
        elem.setTabIndex(TAB_COMPRAS);

        elem = properties.add(null, DOC_COT);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(DOC_COT);
        elem.setKey(K_DOC_ID_COT);
        elem.setSelectId(m_docIdCot);
        elem.setSelectFilter("'doctId = 37'");
        elem.setValue(m_docCotName);
        elem.setTabIndex(TAB_COMPRAS);

        elem = properties.add(null, DOC_OC);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(DOC_OC);
        elem.setKey(K_DOC_ID_OC);
        elem.setSelectId(m_docIdOc);
        elem.setSelectFilter("'doctId = 35'");
        elem.setValue(m_docOcName);
        elem.setTabIndex(TAB_COMPRAS);

        elem = properties.add(null, DOC_RC);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(DOC_RC);
        elem.setKey(K_DOC_ID_RC);
        elem.setSelectId(m_docIdRc);
        elem.setSelectFilter("'doctId = 4'");
        elem.setValue(m_docRcName);
        elem.setTabIndex(TAB_COMPRAS);

        elem = properties.add(null, DOC_FC);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(DOC_FC);
        elem.setKey(K_DOC_ID_FC);
        elem.setSelectId(m_docIdFc);
        elem.setSelectFilter("'doctId = 2'");
        elem.setValue(m_docFcName);
        elem.setTabIndex(TAB_COMPRAS);

        elem = properties.add(null, SHOW_DATA_ADD_IN_COMPRAS);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(3914, "")); // Ver datos del proveedor
        elem.setKey(K_SHOWDATAADIC_IN_COMPRAS);
        elem.setValue(Cairo.Util.boolToInt(m_showDataAddInCompras));
        elem.setTabIndex(TAB_COMPRAS);

        //
        // stock
        //

        elem = properties.add(null, DEPOSITO);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DEPOSITO_LOGICO);
        elem.setName(DEPOSITO);
        elem.setKey(K_DEPL_ID);
        elem.setSelectId(m_deplId);
        elem.setValue(m_deplName);
        elem.setTabIndex(TAB_STOCK);

        elem = properties.add(null, DEPOSITO_SRV);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DEPOSITO_LOGICO);
        elem.setName(DEPOSITO_SRV);
        elem.setKey(K_DEPL_ID_SRV);
        elem.setSelectId(m_deplIdSrv);
        elem.setValue(m_deplNameSrv);
        elem.setTabIndex(TAB_STOCK);

        //
        // sales
        //

        elem = properties.add(null, INFORMAR_ANTICIPOS);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2937, "")); // Mostrar un mensaje al grabar las Facturas de venta informando si el cliente(tiene anticipos)
        elem.setKey(K_INFORMAR_ANTICIPOS);
        elem.setValue(Cairo.Util.boolToInt(m_informarAnticipos));
        elem.setTabIndex(TAB_VENTAS);

        elem = properties.add(null, DOC_PREV + "v");
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(DOC_PREV);
        elem.setKey(K_DOC_ID_PREV);
        elem.setSelectId(m_docIdPrev);
        elem.setSelectFilter("'doctId = 11'");
        elem.setValue(m_docPrevName);
        elem.setTabIndex(TAB_VENTAS);

        elem = properties.add(null, DOC_PV + "v");
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(DOC_PV);
        elem.setKey(K_DOC_ID_PV);
        elem.setSelectId(m_docIdPv);
        elem.setSelectFilter("'doctId = 5'");
        elem.setValue(m_docPvName);
        elem.setTabIndex(TAB_VENTAS);

        elem = properties.add(null, DOC_RV + "v");
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(DOC_RV);
        elem.setKey(K_DOC_ID_RV);
        elem.setSelectId(m_docIdRv);
        elem.setSelectFilter("'doctId = 3'");
        elem.setValue(m_docRvName);
        elem.setTabIndex(TAB_VENTAS);

        elem = properties.add(null, DOC_FV + "v");
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(DOC_FV);
        elem.setKey(K_DOC_ID_FV);
        elem.setSelectId(m_docIdFv);
        elem.setSelectFilter("'doctId = 1'");
        elem.setValue(m_docFvName);
        elem.setTabIndex(TAB_VENTAS);

        elem = properties.add(null, DOC_COBZ);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(DOC_COBZ);
        elem.setKey(K_DOC_ID_COBZ);
        elem.setSelectId(m_docIdCobz);
        elem.setSelectFilter("'doctId = 13'");
        elem.setValue(m_docCobzName);
        elem.setTabIndex(TAB_VENTAS);

        elem = properties.add(null, SHOW_BARCODE_INPUT_CTRLS);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(SHOW_BARCODE_INPUT_CTRLS);
        elem.setKey(K_SHOW_BARCODE_INPUT_CTRLS);
        elem.setValue(Cairo.Util.boolToInt(m_showBarcodeInputCtrls));
        elem.setTabIndex(TAB_VENTAS);

        elem = properties.add(null, CUENTA_FVO_X_DEFECTO);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setName(getText(3554, "")); // Cuenta efectivo de cobranza contado
        elem.setKey(K_CUENTA_FVO_X_DEFECTO);
        elem.setSelectId(m_cueIdFvoXDefecto);
        elem.setValue(m_cuentaFvoXDefecto);
        elem.setTabIndex(TAB_VENTAS);

        elem = properties.add(null, CLIENTE_X_DEFECTO);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CLIENTE);
        elem.setName(getText(3556, "")); // Cliente por defecto
        elem.setKey(K_CLIENTE_X_DEFECTO);
        elem.setSelectId(m_cliIdXDefecto);
        elem.setValue(m_clienteXDefecto);
        elem.setTabIndex(TAB_VENTAS);

        elem = properties.add(null, NUEVO_AL_GRABAR);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(3555, "")); // Presentar un nuevo documento despues de grabar
        elem.setKey(K_NUEVO_AL_GRABAR);
        elem.setValue(Cairo.Util.boolToInt(m_nuevoAlGrabar));
        elem.setTabIndex(TAB_VENTAS);

        elem = properties.add(null, PRINT_IN_NEW_FV);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(4837, "")); // Imprimir al grabar una nueva factura
        elem.setKey(K_PRINT_IN_NEW_FV);
        elem.setValue(Cairo.Util.boolToInt(m_printInNewFV));
        elem.setTabIndex(TAB_VENTAS);

        elem = properties.add(null, PRINT_IN_NEW_COBZ_CDO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(4838, "")); // Imprimir recibo en cobranza contado
        elem.setKey(K_PRINT_IN_NEW_COBZ_CDO);
        elem.setValue(Cairo.Util.boolToInt(m_printInNewCobzCdo));
        elem.setTabIndex(TAB_VENTAS);

        elem = properties.add(null, NUEVO_PTD_AL_GRABAR);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(4836, "")); // Presentar un nuevo parte despues de grabar
        elem.setKey(K_NUEVO_PTD_AL_GRABAR);
        elem.setValue(Cairo.Util.boolToInt(m_nuevoPtdAlGrabar));
        elem.setTabIndex(TAB_VENTAS);

        elem = properties.add(null, SHOW_DATA_ADD_IN_VENTAS);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(3913, "")); // Ver datos del cliente
        elem.setKey(K_SHOWDATAADIC_IN_VENTAS);
        elem.setValue(Cairo.Util.boolToInt(m_showDataAddInVentas));
        elem.setTabIndex(TAB_VENTAS);

        elem = properties.add(null, CLOSE_WIZARD);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(5079, "")); // Cerrar Asistente al Finalizar
        elem.setKey(K_CLOSE_WIZARD);
        elem.setValue(Cairo.Util.boolToInt(m_closeWizard));
        elem.setTabIndex(TAB_VENTAS);

        elem = properties.add(null, NO_ASK_IN_PRINT);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(5080, "")); // No Pedir Confirmar al Imprimir
        elem.setKey(K_NO_ASK_IN_PRINT);
        elem.setValue(Cairo.Util.boolToInt(m_noAskInPrint));
        elem.setTabIndex(TAB_VENTAS);

        elem = properties.add(null, ESTADO_HOJA_RUTA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.ESTADOS);
        elem.setName(getText(4549, "")); // Estado en hojas de ruta
        elem.setKey(K_ESTADO_EN_HOJA_RUTA);
        elem.setSelectId(val(m_estIdHojaRuta));
        elem.setSelectIntValue(m_estIdHojaRuta);
        elem.setValue(m_estadoHojaRuta);
        elem.setTabIndex(TAB_VENTAS);

        elem.setSelectType(Cairo.Select.SelectType.tree);
        elem.setIsEditProperty(false);

        //
        // treasury
        //

        elem = properties.add(null, DOC_MF);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(DOC_MF);
        elem.setKey(K_DOC_ID_MF);
        elem.setSelectId(m_docIdMf);
        elem.setSelectFilter("'doctId = 26'");
        elem.setValue(m_docMfName);
        elem.setTabIndex(TAB_TESORERIA);

        elem = properties.add(null, DOC_DBCO);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(DOC_DBCO);
        elem.setKey(K_DOC_ID_DBCO);
        elem.setSelectId(m_docIdDbco);
        elem.setSelectFilter("'doctId = 17'");
        elem.setValue(m_docDbcoName);
        elem.setTabIndex(TAB_TESORERIA);

        elem = properties.add(null, DEBE_HABER_MF);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(DEBE_HABER_MF);
        elem.setKey(K_DEBE_HABER_MF);
        elem.setValue(m_debeHaberMf);
        elem.setTabIndex(TAB_TESORERIA);

        //
        // services
        //

        elem = properties.add(null, DOC_OS);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(DOC_OS);
        elem.setKey(K_DOC_ID_OS);
        elem.setSelectId(m_docIdOs);
        elem.setSelectFilter("'doctId = 42'");
        elem.setValue(m_docOSName);
        elem.setTabIndex(TAB_SERVICIOS);

        elem = properties.add(null, DOC_PRP);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(DOC_PRP);
        elem.setKey(K_DOC_ID_PRP);
        elem.setSelectId(m_docIdPrp);
        elem.setSelectFilter("'doctId = 43'");
        elem.setValue(m_docPRPName);
        elem.setTabIndex(TAB_SERVICIOS);

        elem = properties.add(null, PTD_FECHA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(PTD_FECHA);
        elem.setKey(K_PTD_FECHAINI);
        elem.setValue(Cairo.Util.boolToInt(m_ptdFecha));
        elem.setTabIndex(TAB_SERVICIOS);

        elem = properties.add(null, PRP_ESTADO_X_DEF);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(3918, "")); // Estado Default en Parte Reparacion
        elem.setKey(K_PARTE_REPARACION_ESTADO_DEFAULT);
        elem.setValue(Cairo.Util.boolToInt(m_PrpEstadoDef));
        elem.setTabIndex(TAB_SERVICIOS);

        //
        // personal
        //

        elem = properties.add(null, DOC_LIQ);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(DOC_LIQ);
        elem.setKey(K_DOC_ID_LIQ);
        elem.setSelectId(m_docIdLiq);
        elem.setSelectFilter("'doctId = 47'");
        elem.setValue(m_docLiqName);
        elem.setTabIndex(TAB_PERSONAL);

        //
        // picking
        //

        elem = properties.add(null, PKL_DOC_FACTURA);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(PKL_DOC_FACTURA);
        elem.setKey(K_PICKINLIST_DOC_ID_FACTURA);
        elem.setSelectId(m_pklDocIdFactura);
        elem.setSelectFilter("'doctId = 1'");
        elem.setValue(m_pklDocFactura);
        elem.setTabIndex(TAB_DESPACHO);

        elem = properties.add(null, PKL_DOC_INTERNO);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(PKL_DOC_INTERNO);
        elem.setKey(K_PICKINLIST_DOC_ID_INTERNO);
        elem.setSelectId(m_pklDocIdInterno);
        elem.setSelectFilter("'doctId = 1'");
        elem.setValue(m_pklDocInterno);
        elem.setTabIndex(TAB_DESPACHO);

        elem = properties.add(null, ESTADO_PICKING_LIST);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.ESTADOS);
        elem.setName(getText(4861, "")); // Estado en picking list
        elem.setKey(K_ESTADO_EN_PICKING_LIST);
        elem.setSelectId(val(m_estIdPickinglist));
        elem.setSelectIntValue(m_estIdPickinglist);
        elem.setValue(m_estadoPickingList);
        elem.setTabIndex(TAB_DESPACHO);

        elem.setSelectType(Cairo.Select.SelectType.tree);
        elem.setIsEditProperty(false);

        elem = properties.add(null, DOC_RV_C + "v");
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(DOC_RV_C);
        elem.setKey(K_DOC_ID_RV_C);
        elem.setSelectId(m_docIdRvC);
        elem.setSelectFilter("'doctId = 24'");
        elem.setValue(m_docRvNameC);
        elem.setTabIndex(TAB_CANCELACION);

        if(!m_dialog.show(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        var properties = m_dialog.getProperties();

        var elem = properties.item(DESKTOP);
        elem.setValue(m_desktop);

        elem = properties.item(LENGUAJE);
        elem.setSelectId(m_lengId);
        elem.setValue(m_lengName);

        elem = properties.item(AUTO_SIZE_COLS);
        elem.setValue(Cairo.Util.boolToInt(m_autoSizeCols));

        elem = properties.item(MULTI_SELECT);
        elem.setValue(Cairo.Util.boolToInt(m_multiSelect));

        elem = properties.item(USE_PRINTER_SIZE);
        elem.setValue(Cairo.Util.boolToInt(m_usePrinterSize));

        elem = properties.item(VIEW_NAMES_IN_TOOLBAR);
        elem.setValue(Cairo.Util.boolToInt(m_viewNamesInToolbar));

        elem = properties.item(SHOW_SAVE_AS);
        elem.setValue(Cairo.Util.boolToInt(m_showSaveAs));

        elem = properties.item(SHOW_ALL_IN_WIZARD);
        elem.setValue(Cairo.Util.boolToInt(m_showAllInWizard));

        elem = properties.item(FOLDER_TO_EXPORT_PDF);
        elem.setValue(m_folderToExportPDF);

        elem = properties.item(USAR_COLORES_EN_DOC);
        elem.setValue(m_usarColoresEnDocumentos);

        elem = properties.item(COLOR_EN_EMPRESA);
        elem.setValue(m_colorEnEmpresa);

        elem = properties.item(DOC_PC);
        elem.setSelectId(m_docIdPc);
        elem.setValue(m_docPcName);

        elem = properties.item(DOC_PREC);
        elem.setSelectId(m_docIdPrec);
        elem.setValue(m_docPrecName);

        elem = properties.item(DOC_COT);
        elem.setSelectId(m_docIdCot);
        elem.setValue(m_docCotName);

        elem = properties.item(DOC_OC);
        elem.setSelectId(m_docIdOc);
        elem.setValue(m_docOcName);

        elem = properties.item(DOC_RC);
        elem.setSelectId(m_docIdRc);
        elem.setValue(m_docRcName);

        elem = properties.item(DOC_FC);
        elem.setSelectId(m_docIdFc);
        elem.setValue(m_docFcName);

        elem = properties.item(SHOW_DATA_ADD_IN_COMPRAS);
        elem.setValue(Cairo.Util.boolToInt(m_showDataAddInCompras));

        elem = properties.item(DEPOSITO);
        elem.setSelectId(m_deplId);
        elem.setValue(m_deplName);

        elem = properties.item(DEPOSITO_SRV);
        elem.setSelectId(m_deplIdSrv);
        elem.setValue(m_deplNameSrv);

        elem = properties.item(INFORMAR_ANTICIPOS);
        elem.setValue(Cairo.Util.boolToInt(m_informarAnticipos));

        elem = properties.item(DOC_PREV + "v");
        elem.setSelectId(m_docIdPrev);
        elem.setValue(m_docPrevName);

        elem = properties.item(DOC_PV + "v");
        elem.setSelectId(m_docIdPv);
        elem.setValue(m_docPvName);

        elem = properties.item(DOC_RV + "v");
        elem.setSelectId(m_docIdRv);
        elem.setValue(m_docRvName);

        elem = properties.item(DOC_FV + "v");
        elem.setSelectId(m_docIdFv);
        elem.setValue(m_docFvName);

        elem = properties.item(DOC_COBZ);
        elem.setSelectId(m_docIdCobz);
        elem.setValue(m_docCobzName);

        elem = properties.item(SHOW_BARCODE_INPUT_CTRLS);
        elem.setValue(Cairo.Util.boolToInt(m_showBarcodeInputCtrls));

        elem = properties.item(CUENTA_FVO_X_DEFECTO);
        elem.setSelectId(m_cueIdFvoXDefecto);
        elem.setValue(m_cuentaFvoXDefecto);

        elem = properties.item(CLIENTE_X_DEFECTO);
        elem.setSelectId(m_cliIdXDefecto);
        elem.setValue(m_clienteXDefecto);

        elem = properties.item(NUEVO_AL_GRABAR);
        elem.setValue(Cairo.Util.boolToInt(m_nuevoAlGrabar));

        elem = properties.item(PRINT_IN_NEW_FV);
        elem.setValue(Cairo.Util.boolToInt(m_printInNewFV));

        elem = properties.item(PRINT_IN_NEW_COBZ_CDO);
        elem.setValue(Cairo.Util.boolToInt(m_printInNewCobzCdo));

        elem = properties.item(NUEVO_PTD_AL_GRABAR);
        elem.setValue(Cairo.Util.boolToInt(m_nuevoPtdAlGrabar));

        elem = properties.item(SHOW_DATA_ADD_IN_VENTAS);
        elem.setValue(Cairo.Util.boolToInt(m_showDataAddInVentas));

        elem = properties.item(CLOSE_WIZARD);
        elem.setValue(Cairo.Util.boolToInt(m_closeWizard));

        elem = properties.item(NO_ASK_IN_PRINT);
        elem.setValue(Cairo.Util.boolToInt(m_noAskInPrint));

        elem = properties.item(DOC_MF);
        elem.setSelectId(m_docIdMf);
        elem.setValue(m_docMfName);

        elem = properties.item(DOC_DBCO);
        elem.setSelectId(m_docIdDbco);
        elem.setValue(m_docDbcoName);

        elem = properties.item(DEBE_HABER_MF);
        elem.setValue(m_debeHaberMf);

        elem = properties.item(DOC_OS);
        elem.setSelectId(m_docIdOs);
        elem.setValue(m_docOSName);

        elem = properties.item(DOC_PRP);
        elem.setSelectId(m_docIdPrp);
        elem.setValue(m_docPRPName);

        elem = properties.item(PTD_FECHA);
        elem.setValue(Cairo.Util.boolToInt(m_ptdFecha));

        elem = properties.item(PRP_ESTADO_X_DEF);
        elem.setValue(Cairo.Util.boolToInt(m_PrpEstadoDef));

        elem = properties.item(DOC_LIQ);
        elem.setSelectId(m_docIdLiq);
        elem.setValue(m_docLiqName);

        elem = properties.item(PKL_DOC_FACTURA);
        elem.setSelectId(m_pklDocIdFactura);
        elem.setValue(m_pklDocFactura);

        elem = properties.item(PKL_DOC_INTERNO);
        elem.setSelectId(m_pklDocIdInterno);
        elem.setValue(m_pklDocInterno);

        elem = properties.item(DOC_RV_C + "v");
        elem.setSelectId(m_docIdRvC);
        elem.setValue(m_docRvNameC);

        return m_dialog.showValues(properties);
      };

      var ck = function(key, iModule) {

        switch (iModule) {
          case ucs.purchases:
            key = key + " Cpra_" + m_userId;
            break;

          case ucs.stock:
            key = key + "_" + m_userId;
            break;

          case ucs.sales:
            key = key + " Vta_" + m_userId;
            break;

          case ucs.general:
            key = key + " Gral_" + m_userId;
            break;

          case ucs.treasury:
            key = key + " Tsr_" + m_userId;
            break;

          case ucs.services:
            key = key + " Srv_" + m_userId;
            break;
        }
        return key;
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
          if(m_listController !== null) {
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

    var showEditor = function() {
      var editor = Cairo.UsuarioConfig.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit(Cairo.User.getId());
    };

    Edit.Controller = { getEditor: createObject, edit: showEditor };

  });

  var createUserConfig = function() {
    var userConfig = Cairo.UsuarioConfig.Edit.Controller.getEditor();
    userConfig.load(Cairo.User.getId());
    return userConfig;
  };

  Cairo.UserConfig = createUserConfig();

}());