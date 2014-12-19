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

      var Dialogs = Cairo.Dialogs;

      var C_MODULE = "cUsuarioConfig";

      var CSESTADO = 4005;
      var CSTBLLENGUAJE = 14000;
      var CSTBLDOCUMENTO = 4001;
      var CSCDEPL_NAME = "depl_nombre";

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
      var K_AUTOSIZECOLS = 202;
      var K_MULTISELECT = 203;
      var K_SHOWSAVEAS = 204;
      var K_SHOW_ALL_IN_WIZARD = 205;
      var K_FOLDER_TO_EXPORT_PDF = 206;

      var K_CLIENTEXDEFECTO = 305;
      var K_CUENTAFVOXDEFECTO = 306;
      var K_NUEVOALGRABAR = 307;
      var K_NUEVOPTDALGRABAR = 311;

      var K_PRINT_IN_NEW_FV = 312;
      var K_PRINT_IN_NEW_COBZ_CDO = 313;

      var K_CLOSE_WIZARD = 24;
      var K_NO_ASK_IN_PRINT = 25;

      var K_SHOWBARCODEINPUTCTRLS = 201;

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

      var CONFIG_KEY = "cfg_aspecto";
      var CONFIG_VALUE = "cfg_valor";

      var c_ErrorSave = "";

      var m_informarAnticipos;

      var m_docId_pc = 0;
      var m_docPCNombre = "";
      var m_docId_prec = 0;
      var m_docPRECNombre = "";
      var m_docId_cot = 0;
      var m_docCOTNombre = "";
      var m_docId_oc = 0;
      var m_docOCNombre = "";
      var m_docId_rc = 0;
      var m_docRCNombre = "";
      var m_docId_fc = 0;
      var m_docFCNombre = "";

      var m_lengId = 0;
      var m_lengName = "";
      var m_autoSizeCols;
      var m_multiSelect;
      var m_usePrinterSize;
      var m_showSaveAs;
      var m_showAllInWizard;
      var m_folderToExportPDF = "";

      var m_deplId = 0;
      var m_deplNombre = "";
      var m_deplRamId = "";

      var m_deplId_srv = 0;
      var m_deplNombreSrv = "";
      var m_deplRamId_srv = "";

      var m_docId_prev = 0;
      var m_docPREVNombre = "";
      var m_docId_pv = 0;
      var m_docPVNombre = "";
      var m_docId_rv = 0;
      var m_docRVNombre = "";
      var m_docId_rv_C = 0;
      var m_docRVNombre_C = "";
      var m_docId_fv = 0;
      var m_docFVNombre = "";
      var m_docId_cobz = 0;
      var m_docCobzNombre = "";

      var m_docId_os = 0;
      var m_docOSNombre = "";
      var m_docId_prp = 0;
      var m_docPRPNombre = "";

      var m_docId_liq = 0;
      var m_docLIQNombre = "";

      var m_pkl_docId_factura = 0;
      var m_pklDocFactura = "";

      var m_pkl_docId_interno = 0;
      var m_pklDocInterno = "";

      var m_ptdFecha;

      var m_prpEstadoDef;

      var m_docId_mf = 0;
      var m_docMFNombre = "";
      var m_docId_dbco = 0;
      var m_docDBCONombre = "";
      var m_debe_haber_mf;

      var m_desktop = "";

      var m_showBarcodeInputCtrls;

      var m_cliId_xdefecto = 0;
      var m_clienteXDefecto = "";

      var m_cueId_FvoxDefecto = 0;
      var m_cuentaFvoxDefecto = "";

      var m_nuevoAlGrabar;
      var m_printInNewFV;
      var m_printInNewCobzCdo;
      var m_closeWizard;
      var m_noAskInPrint;

      var m_showDataAddInVentas;
      var m_showDataAddInCompras;

      var m_nuevoPTDAlGrabar;

      var m_viewNamesInToolbar;
      var m_usarColoresEnDocumentos;

      var m_estId_hojaRuta = "";
      var m_estadoHojaRuta = "";

      var m_estId_pickinglist = "";
      var m_estadoPickingList = "";

      var m_colorEnEmpresa = 0;

      var m_editing;
      var m_dialog;

      var valField = Cairo.Database.valField;
      var val = Cairo.Util.val;

      self.getShowBarcodeInputCtrls = function() {
        return m_showBarcodeInputCtrls;
      };

      self.getInformarAnticipos = function() {
        return m_informarAnticipos;
      };
      /*
      self.getDocPreeId = function() {

      };

      self.getDocAsId = function() {

      };

      self.getDocStId = function() {

      };

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
        return m_docId_dbco;
      };
      /*
      self.getDocDcupId = function() {

      };
      */
      self.getDocMfId = function() {
        return m_docId_mf;
      };

      self.getDocPcId = function() {
        return m_docId_pc;
      };

      self.getDocPrecId = function() {
        return m_docId_prec;
      };

      self.getDocCotId = function() {
        return m_docId_cot;
      };

      self.getDocOcId = function() {
        return m_docId_oc;
      };

      self.getDocRcId = function() {
        return m_docId_rc;
      };

      self.getDocFcId = function() {
        return m_docId_fc;
      };

      self.getDocPrevId = function() {
        return m_docId_prev;
      };

      self.getDocPvId = function() {
        return m_docId_pv;
      };

      self.getDocRvId = function() {
        return m_docId_rv;
      };

      self.getDocRvId_C = function() {
        return m_docId_rv_C;
      };

      self.getDocFvId = function() {
        return m_docId_fv;
      };

      self.getPklDocIdFactura = function() {
        return m_pkl_docId_factura;
      };

      self.getPklDocIdInerno = function() {
        return m_pkl_docId_interno;
      };

      self.getDocCobzId = function() {
        return m_docId_cobz;
      };

      self.getDocOsId = function() {
        return m_docId_os;
      };

      self.getDocPrpId = function() {
        return m_docId_prp;
      };

      self.getDocLIQId = function() {
        return m_docId_liq;
      };

      self.getPtdFecha = function() {
        return m_ptdFecha;
      };

      self.getPrpEstadoDef = function() {
        return m_prpEstadoDef;
      };

      self.getDeplId = function() {
        return m_deplId;
      };

      self.getDeplIdSrv = function() {
        return m_deplId_srv;
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
        return m_deplRamId_srv;
      };
      /*
      self.getDocPreeNombre = function() {

      };

      self.getDocAsNombre = function() {

      };

      self.getDocStNombre = function() {

      };

      self.getDocRsNombre = function() {

      };

      self.getDocPpkNombre = function() {

      };

      self.getDocOpkNombre = function() {

      };

      self.getDocPembNombre = function() {

      };

      self.getDocMfcNombre = function() {

      };

      self.getDocImptNombre = function() {

      };

      self.getDocPklstNombre = function() {

      };
      */
      self.getDocDbcoNombre = function() {
        return m_docDBCONombre;
      };
      /*
      self.getDocDcupNombre = function() {

      };
      */
      self.getDocMfNombre = function() {
        return m_docMFNombre;
      };

      self.getDocPcNombre = function() {
        return m_docPCNombre;
      };

      self.getDocPrecNombre = function() {
        return m_docPRECNombre;
      };

      self.getDocCotNombre = function() {
        return m_docCOTNombre;
      };

      self.getDocOcNombre = function() {
        return m_docOCNombre;
      };

      self.getDocRcNombre = function() {
        return m_docRCNombre;
      };

      self.getDocFcNombre = function() {
        return m_docFCNombre;
      };

      self.getDocPrevNombre = function() {
        return m_docPREVNombre;
      };

      self.getDocPvNombre = function() {
        return m_docPVNombre;
      };

      self.getDocRvNombre = function() {
        return m_docRVNombre;
      };

      self.getDocRvNombre_C = function() {
        return m_docRVNombre_C;
      };

      self.getDocFvNombre = function() {
        return m_docFVNombre;
      };

      self.getPklDocFactura = function() {
        return m_pklDocFactura;
      };

      self.getPklDocInterno = function() {
        return m_pklDocInterno;
      };

      self.getDocCobzNombre = function() {
        return m_docCobzNombre;
      };

      self.getDocOsNombre = function() {
        return m_docOSNombre;
      };

      self.getDocPrpNombre = function() {
        return m_docPRPNombre;
      };

      self.getDocLIQNombre = function() {
        return m_docLIQNombre;
      };

      self.getDeplNombre = function() {
        return m_deplNombre;
      };

      self.getDeplNombreSrv = function() {
        return m_deplNombreSrv;
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

      self.getUsarColoresEnDocumentos = function() {
        return m_usarColoresEnDocumentos;
      };

      self.getColorEnEmpresa = function() {
        return m_colorEnEmpresa;
      };

      self.getCueIdFvoxDefecto = function() {
        return m_cueId_FvoxDefecto;
      };

      self.getCuentaFvoxDefecto = function() {
        return m_cuentaFvoxDefecto;
      };

      self.getCliIdxDefecto = function() {
        return m_cliId_xdefecto;
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
        return m_nuevoPTDAlGrabar;
      };

      self.getShowDataAddInVentas = function() {
        return m_showDataAddInVentas;
      };

      self.getShowDataAddInCompras = function() {
        return m_showDataAddInCompras;
      };

      self.getEstId_hojaRuta = function() {
        return m_estId_hojaRuta;
      };

      self.getEstadoHojaRuta = function() {
        return m_estadoHojaRuta;
      };

      self.getEstId_pickinglist = function() {
        return m_estId_pickinglist;
      };

      self.getEstadoPickingList = function() {
        return m_estadoPickingList;
      };

      self.getDebeHaberMf = function() {
        return m_debe_haber_mf;
      };

      self.getCloseWizard = function() {
        return m_closeWizard;
      };

      self.getNoAskInPrint = function() {
        return m_noAskInPrint;
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

      self.save = function() {

        var isNew = null;
        var bAutoSize = null;

        var mainRegister = new Cairo.Database.Register();

        var createRegister = function() {
          var register = new Cairo.Database.Register();
          register.setTable(Cairo.Constants.CONFIGURACION);
          register.getFields().setHaveLastUpdate(true);
          register.getFields().setHaveWhoModify(true);
          register.setUtilizaIdentity(true);
        };
        

        //
        // tell databas this is not a NEW record
        //
        register.setId(-1);

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {          
        
          var property = m_dialog.getProperties().item(_i);
          
          switch (property.getKey()) {

            //
            // purchase
            //  

            case K_DOC_ID_PC:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(DOC_PC, UserConfigSection.purchases))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(DOC_PC, UserConfigSection.purchases), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_DOC_ID_PREC:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(DOC_PREC, UserConfigSection.purchases))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(DOC_PREC, UserConfigSection.purchases), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_DOC_ID_COT:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(DOC_COT, UserConfigSection.purchases))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(DOC_COT, UserConfigSection.purchases), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_DOC_ID_OC:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(DOC_OC, UserConfigSection.purchases))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(DOC_OC, UserConfigSection.purchases), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_DOC_ID_RC:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(DOC_RC, UserConfigSection.purchases))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(DOC_RC, UserConfigSection.purchases), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_DOC_ID_FC:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(DOC_FC, UserConfigSection.purchases))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(DOC_FC, UserConfigSection.purchases), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_SHOWDATAADIC_IN_COMPRAS:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(SHOW_DATA_ADD_IN_COMPRAS, UserConfigSection.purchases)));

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(SHOW_DATA_ADD_IN_COMPRAS, UserConfigSection.purchases), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, val(property.getValue()), Cairo.Constants.Types.text);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              // Stock

              break;

            case K_DEPL_ID:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(DEPOSITO, UserConfigSection.stock))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(DEPOSITO, UserConfigSection.stock), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_DEPL_ID_SRV:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(DEPOSITO_SRV, UserConfigSection.stock))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(DEPOSITO_SRV, UserConfigSection.stock), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              // Ventas

              break;

            case K_INFORMAR_ANTICIPOS:

              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(INFORMAR_ANTICIPOS, UserConfigSection.sales)));

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(INFORMAR_ANTICIPOS, UserConfigSection.sales), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, val(property.getValue()) ? 1 : 0), Cairo.Constants.Types.text);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_DOC_ID_PREV:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(DOC_PREV, UserConfigSection.sales))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(DOC_PREV, UserConfigSection.sales), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_DOC_ID_PV:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(DOC_PV, UserConfigSection.sales))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(DOC_PV, UserConfigSection.sales), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_DOC_ID_RV:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(DOC_RV, UserConfigSection.sales))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(DOC_RV, UserConfigSection.sales), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_DOC_ID_RV_C:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(DOC_RV_C, UserConfigSection.sales))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(DOC_RV_C, UserConfigSection.sales), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_DOC_ID_FV:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(DOC_FV, UserConfigSection.sales))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(DOC_FV, UserConfigSection.sales), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_DOC_ID_COBZ:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(DOC_COBZ, UserConfigSection.sales))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(DOC_COBZ, UserConfigSection.sales), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_VIEW_NAMES_IN_TOOLBAR:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(VIEW_NAMES_IN_TOOLBAR, UserConfigSection.general)));

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(VIEW_NAMES_IN_TOOLBAR, UserConfigSection.general), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getValue(), Cairo.Constants.Types.text);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_PARTE_REPARACION_ESTADO_DEFAULT:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(PRP_ESTADO_X_DEF, UserConfigSection.services))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(PRP_ESTADO_X_DEF, UserConfigSection.services), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, val(property.getValue()), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_SHOWDATAADIC_IN_VENTAS:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(SHOW_DATA_ADD_IN_VENTAS, UserConfigSection.sales)));

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(SHOW_DATA_ADD_IN_VENTAS, UserConfigSection.sales), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, val(property.getValue()), Cairo.Constants.Types.text);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_SHOWBARCODEINPUTCTRLS:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(SHOW_BARCODE_INPUT_CTRLS)+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, SHOW_BARCODE_INPUT_CTRLS, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, val(property.getValue()), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_ESTADO_EN_HOJA_RUTA:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(ESTADO_HOJA_RUTA, UserConfigSection.sales))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(ESTADO_HOJA_RUTA, UserConfigSection.sales), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectIntValue(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              // Picking List

              break;

            case K_PICKINLIST_DOC_ID_FACTURA:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(PKL_DOC_FACTURA, UserConfigSection.sales))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(PKL_DOC_FACTURA, UserConfigSection.sales), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_PICKINLIST_DOC_ID_INTERNO:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(PKL_DOC_INTERNO, UserConfigSection.sales))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(PKL_DOC_INTERNO, UserConfigSection.sales), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_ESTADO_EN_PICKING_LIST:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(ESTADO_PICKING_LIST, UserConfigSection.sales))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(ESTADO_PICKING_LIST, UserConfigSection.sales), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectIntValue(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              // General

              break;

            case K_DESKTOP:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(DESKTOP, UserConfigSection.general))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(DESKTOP, UserConfigSection.general), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getValue(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_USAR_COLORES_EN_DOCUMENTOS:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(USAR_COLORES_EN_DOC, UserConfigSection.general)));

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(USAR_COLORES_EN_DOC, UserConfigSection.general), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getValue(), Cairo.Constants.Types.text);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_COLOR_BACKGROUND:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(COLOR_EN_EMPRESA, UserConfigSection.general))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(COLOR_EN_EMPRESA, UserConfigSection.general), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getValue(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_FOLDER_TO_EXPORT_PDF:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(FOLDER_TO_EXPORT_PDF, UserConfigSection.general))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(FOLDER_TO_EXPORT_PDF, UserConfigSection.general), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getValue(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_LENGUAJE:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(LENGUAJE, UserConfigSection.general))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(LENGUAJE, UserConfigSection.general), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_AUTOSIZECOLS:

              bAutoSize = val(property.getValue());

              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(AUTO_SIZE_COLS, UserConfigSection.general))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(AUTO_SIZE_COLS, UserConfigSection.general), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, bAutoSize, Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_MULTISELECT:

              bAutoSize = val(property.getValue());

              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(MULTI_SELECT, UserConfigSection.general))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(MULTI_SELECT, UserConfigSection.general), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, val(property.getValue()), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_SHOWSAVEAS:

              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(SHOW_SAVE_AS, UserConfigSection.general))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(SHOW_SAVE_AS, UserConfigSection.general), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, val(property.getValue()), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_SHOW_ALL_IN_WIZARD:

              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(SHOW_ALL_IN_WIZARD, UserConfigSection.general))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(SHOW_ALL_IN_WIZARD, UserConfigSection.general), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, val(property.getValue()), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              // Tesoreria

              break;

            case K_DOC_ID_MF:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(DOC_MF, UserConfigSection.treasury))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(DOC_MF, UserConfigSection.treasury), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_DOC_ID_DBCO:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(DOC_DBCO, UserConfigSection.treasury))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(DOC_DBCO, UserConfigSection.treasury), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_DEBE_HABER_MF:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(DEBE_HABER_MF, UserConfigSection.treasury))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(DEBE_HABER_MF, UserConfigSection.treasury), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getValue(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              // Servicios

              break;

            case K_DOC_ID_OS:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(DOC_OS, UserConfigSection.services))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(DOC_OS, UserConfigSection.services), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_DOC_ID_PRP:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(DOC_PRP, UserConfigSection.services))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(DOC_PRP, UserConfigSection.services), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              // Personal

              break;

            case K_DOC_ID_LIQ:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(DOC_LIQ, UserConfigSection.preferences))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(DOC_LIQ, UserConfigSection.preferences), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_USE_PRINTER_SIZE:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(USE_PRINTER_SIZE, UserConfigSection.general)));

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(USE_PRINTER_SIZE, UserConfigSection.general), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, val(property.getValue()), Cairo.Constants.Types.text);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_PTD_FECHAINI:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(PTD_FECHA, UserConfigSection.services))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(PTD_FECHA, UserConfigSection.services), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, val(property.getValue()), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_NUEVOALGRABAR:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(NUEVO_AL_GRABAR, UserConfigSection.sales)));

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(NUEVO_AL_GRABAR, UserConfigSection.sales), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, val(property.getValue()), Cairo.Constants.Types.text);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_NUEVOPTDALGRABAR:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(NUEVO_PTD_AL_GRABAR, UserConfigSection.sales)));

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(NUEVO_PTD_AL_GRABAR, UserConfigSection.sales), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, val(property.getValue()), Cairo.Constants.Types.text);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_PRINT_IN_NEW_FV:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(PRINT_IN_NEW_FV, UserConfigSection.sales)));

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(PRINT_IN_NEW_FV, UserConfigSection.sales), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, val(property.getValue()), Cairo.Constants.Types.text);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_PRINT_IN_NEW_COBZ_CDO:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(PRINT_IN_NEW_COBZ_CDO, UserConfigSection.sales)));

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(PRINT_IN_NEW_COBZ_CDO, UserConfigSection.sales), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, val(property.getValue()), Cairo.Constants.Types.text);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_CLIENTEXDEFECTO:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(CLIENTE_X_DEFECTO, UserConfigSection.sales))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(CLIENTE_X_DEFECTO, UserConfigSection.sales), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_CUENTAFVOXDEFECTO:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(CUENTA_FVO_X_DEFECTO, UserConfigSection.sales))+ " and emp_id = "+ cUtil.getEmpId().toString());

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(CUENTA_FVO_X_DEFECTO, UserConfigSection.sales), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, property.getSelectId(), Cairo.Constants.Types.text);
              w_fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Cairo.Constants.Types.id);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_CLOSE_WIZARD:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(CLOSE_WIZARD, UserConfigSection.sales)));

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(CLOSE_WIZARD, UserConfigSection.sales), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, val(property.getValue()), Cairo.Constants.Types.text);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;

            case K_NO_ASK_IN_PRINT:
              register.getFields().clear();

              register.setFilter("cfg_grupo = "+ Cairo.Database.sqlString(GRUPO_USUARIO_CONFIG)+ " and cfg_aspecto = "+ Cairo.Database.sqlString(getConfigKey(NO_ASK_IN_PRINT, UserConfigSection.sales)));

              if(!register.exists(Cairo.Database, isNew)) { return _rtn; }
              isNew = !isNew;

              var w_fields = register.getFields();
              w_fields.add(Cairo.Constants.CFG_GRUPO, GRUPO_USUARIO_CONFIG, Cairo.Constants.Types.text);
              w_fields.add(CONFIG_KEY, getConfigKey(NO_ASK_IN_PRINT, UserConfigSection.sales), Cairo.Constants.Types.text);
              w_fields.add(CONFIG_VALUE, val(property.getValue()), Cairo.Constants.Types.text);

              if(!Cairo.Database.save(register, isNew, C_ABMClientSave, C_MODULE, c_ErrorSave)) { return _rtn; }

              break;
          }
        }

        Cairo.UserConfig.setAutoSizeCols(bAutoSize);

        return load().then(
          function (success) {
            if(success) {
              setColorInCompany();
            }
          }
        );

        return _rtn;
      };

      var setColorInCompany = function() {
        var abmGen = null;

        abmGen = m_dialog;

        if(m_colorEnEmpresa) {
          abmGen.setBakcColorTagMainEx(m_colorEnEmpresa);
        }
        else {
          abmGen.setBakcColorTagMainEx(vbWhite);
        }
      };

      self.terminate = function() {

        m_editing = false;

        try {
          if(m_listController != null) {
            updateList();
            m_listController.removeEditor(self);
          }
        }
        catch (ignored) {
          Cairo.logError('Error in terminate', ignored);
        }
      };

      self.getPath = function() {
        return "#general/usuarioconfig";
      };

      self.getEditorName = function() {
        return "usuarioconfig";
      };

      self.getTitle = function() {
        //'Configuración del Usuario
        return Cairo.Language.getText(2933, "");
      };

      self.validate = function() {
        return Cairo.Promises.resolvedPromise(true);
      };

      // ////////////////////////////////
      // ////////////////////////////////
      // ////////////////////////////////
      // ////////////////////////////////
      // ////////////////////////////////
      // ////////////////////////////////

      // Menu
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
        pValidate(m_docId_mf, m_docMFNombre);
      };

      self.validateDBCO = function() {
        pValidate(m_docId_dbco, m_docDBCONombre);
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
        pValidate(m_docId_pc, m_docPCNombre);
      };

      self.validateOC = function() {
        pValidate(m_docId_oc, m_docOCNombre);
      };

      self.validateRC = function() {
        pValidate(m_docId_rc, m_docRCNombre);
        self.validateDepl();
      };

      self.validateFC = function() {
        pValidate(m_docId_fc, m_docFCNombre);
        self.validateDepl();
      };

      self.validatePV = function() {
        pValidate(m_docId_pv, m_docPVNombre);
        self.validateDepl();
      };

      self.validateRV = function() {
        pValidate(m_docId_rv, m_docRVNombre);
        self.validateDepl();
      };

      self.validateRV_C = function() {
        pValidate(m_docId_rv_C, m_docRVNombre_C);
        self.validateDepl();
      };

      self.validateOS = function() {
        pValidate(m_docId_os, m_docOSNombre);
        self.validateDepl();
      };

      self.validatePRP = function() {
        pValidate(m_docId_prp, m_docPRPNombre);
        self.validateDepl();
      };

      self.validateFV = function() {
        pValidate(m_docId_fv, m_docFVNombre);
        self.validateDepl();
      };

      self.validatePklFactura = function() {
        pValidate(m_pkl_docId_factura, m_pklDocFactura);
      };

      self.validatePklInterno = function() {
        pValidate(m_pkl_docId_interno, m_pklDocInterno);
      };

      self.validateLIQ = function() {
        pValidate(m_docId_liq, m_docLIQNombre);
      };

      self.validateDepl = function() {
        var help = null;
        help = new CSOAPI2.cHelp();

        //*TODO:** can't found type for with block
        //*With help.ValidateEx(Cairo.Tables.DEPOSITOLOGICO, m_deplNombre, m_deplId)
        var w___TYPE_NOT_FOUND = help.ValidateEx(Cairo.Tables.DEPOSITOLOGICO, m_deplNombre, m_deplId);
        m_deplNombre = w___TYPE_NOT_FOUND.Value;
        m_deplId = val(w___TYPE_NOT_FOUND.Id);
      };

      var pValidate = function(id,  nombre) { // TODO: Use of ByRef founded Private Sub pValidate(ByRef Id As Long, ByRef Nombre As String)
        var help = null;
        help = new CSOAPI2.cHelp();

        //*TODO:** can't found type for with block
        //*With help.ValidateEx(CSTBLDOCUMENTO, nombre, id)
        var w___TYPE_NOT_FOUND = help.ValidateEx(CSTBLDOCUMENTO, nombre, id);
        nombre = w___TYPE_NOT_FOUND.Value;
        id = val(w___TYPE_NOT_FOUND.Id);
      };

      self.load = function() {

        var apiPath = Cairo.Database.getAPIVersion();
        return Cairo.Database.getData("load[" + apiPath + "general/usuarioconfig]", id).then(
          function(response) {

            m_informarAnticipos = false;

            var keyInfAnticipos = getConfigKey(INFORMAR_ANTICIPOS, UserConfigSection.sales);
            var keyNuevoAlGrabar = getConfigKey(NUEVO_AL_GRABAR, UserConfigSection.sales);
            var keyPrintInNewFv = getConfigKey(PRINT_IN_NEW_FV, UserConfigSection.sales);
            var keyPrintInNewCobzCdo = getConfigKey(PRINT_IN_NEW_COBZ_CDO, UserConfigSection.sales);
            var keyNuevoPTDAlGrabar = getConfigKey(NUEVO_PTD_AL_GRABAR, UserConfigSection.sales);
            var keyUsePrinterSize = getConfigKey(USE_PRINTER_SIZE, UserConfigSection.general);

            var keyShowDataAddInVentas = getConfigKey(SHOW_DATA_ADD_IN_VENTAS, UserConfigSection.sales);
            var keyShowDataAddInCompras = getConfigKey(SHOW_DATA_ADD_IN_COMPRAS, UserConfigSection.purchases);

            var keyViewNamesInTb = getConfigKey(VIEW_NAMES_IN_TOOLBAR, UserConfigSection.general);
            var keyUsarColoresEnDoc = getConfigKey(USAR_COLORES_EN_DOC, UserConfigSection.general);

            var keyCloseWizard = getConfigKey(CLOSE_WIZARD, UserConfigSection.sales);
            var keyNoAskInPrint = getConfigKey(NO_ASK_IN_PRINT, UserConfigSection.sales);

            var keyDocPc = getConfigKey(DOC_PC, UserConfigSection.purchases);
            var keyDocPrec = getConfigKey(DOC_PREC, UserConfigSection.purchases);
            var keyDocCot = getConfigKey(DOC_COT, UserConfigSection.purchases);
            var keyDocOc = getConfigKey(DOC_OC, UserConfigSection.purchases);
            var keyDocRc = getConfigKey(DOC_RC, UserConfigSection.purchases);
            var keyDocFc = getConfigKey(DOC_FC, UserConfigSection.purchases);

            var keyDocPv = getConfigKey(DOC_PV, UserConfigSection.sales);
            var keyDocPrev = getConfigKey(DOC_PREV, UserConfigSection.sales);
            var keyDocRv = getConfigKey(DOC_RV, UserConfigSection.sales);
            var keyDocRv_C = getConfigKey(DOC_RV_C, UserConfigSection.sales);
            var keyDocFv = getConfigKey(DOC_FV, UserConfigSection.sales);
            var keyDocCobz = getConfigKey(DOC_COBZ, UserConfigSection.sales);

            var keyPklDocFac = getConfigKey(PKL_DOC_FACTURA, UserConfigSection.sales);
            var keyPklDocInt = getConfigKey(PKL_DOC_INTERNO, UserConfigSection.sales);

            var keyDocOs = getConfigKey(DOC_OS, UserConfigSection.services);
            var keyDocPrp = getConfigKey(DOC_PRP, UserConfigSection.services);
            var keyPtdFecha = getConfigKey(PTD_FECHA, UserConfigSection.services);
            var keyPrpEstadoDef = getConfigKey(PRP_ESTADO_X_DEF, UserConfigSection.services);

            var keyDocMF = getConfigKey(DOC_MF, UserConfigSection.treasury);
            var keyDocDBCO = getConfigKey(DOC_DBCO, UserConfigSection.treasury);
            var keyDebeHaberMf = getConfigKey(DEBE_HABER_MF, UserConfigSection.treasury);

            var keyDocLIQ = getConfigKey(DOC_LIQ, UserConfigSection.preferences);

            var keyDepl = getConfigKey(DEPOSITO, UserConfigSection.stock);
            var keyDeplSrv = getConfigKey(DEPOSITO_SRV, UserConfigSection.stock);

            var keyDesktop = getConfigKey(DESKTOP, UserConfigSection.general);
            var keyLenguaje = getConfigKey(LENGUAJE, UserConfigSection.general);
            var keyAutoSizeCols = getConfigKey(AUTO_SIZE_COLS, UserConfigSection.general);
            var keyMultiSelect = getConfigKey(MULTI_SELECT, UserConfigSection.general);
            var keyShowSaveAs = getConfigKey(SHOW_SAVE_AS, UserConfigSection.general);
            var keyShowAllInWizard = getConfigKey(SHOW_ALL_IN_WIZARD, UserConfigSection.general);
            var keyFolderToExportPDF = getConfigKey(FOLDER_TO_EXPORT_PDF, UserConfigSection.general);

            var keyCuentaFvo = getConfigKey(CUENTA_FVO_X_DEFECTO, UserConfigSection.sales);
            var keyCliente = getConfigKey(CLIENTE_X_DEFECTO, UserConfigSection.sales);

            var keyEstadoHojaRuta = getConfigKey(ESTADO_HOJA_RUTA, UserConfigSection.sales);
            var keyEstadoPickingList = getConfigKey(ESTADO_PICKING_LIST, UserConfigSection.sales);

            var keyColorEmpresa = getConfigKey(COLOR_EN_EMPRESA, UserConfigSection.general);            

            for(var _i = 0; _i < m_data.proveedor.length; _i += 1) {
              switch (valField(response.data[_i], CONFIG_KEY)) {
                case keyInfAnticipos:
                  m_informarAnticipos = val(valField(response.data[_i], CONFIG_VALUE));
                  break;

                case keyNuevoAlGrabar:
                  m_nuevoAlGrabar = val(valField(response.data[_i], CONFIG_VALUE));
                  break;

                case keyNuevoPTDAlGrabar:
                  m_nuevoPTDAlGrabar = val(valField(response.data[_i], CONFIG_VALUE));
                  break;

                case keyPrintInNewFv:
                  m_printInNewFV = val(valField(response.data[_i], CONFIG_VALUE));
                  break;

                case keyPrintInNewCobzCdo:
                  m_printInNewCobzCdo = val(valField(response.data[_i], CONFIG_VALUE));
                  break;

                case keyUsePrinterSize:
                  m_usePrinterSize = val(valField(response.data[_i], CONFIG_VALUE));
                  break;

                case keyShowDataAddInVentas:
                  m_showDataAddInVentas = val(valField(response.data[_i], CONFIG_VALUE));
                  break;

                case keyShowDataAddInCompras:
                  m_showDataAddInCompras = val(valField(response.data[_i], CONFIG_VALUE));
                  break;

                case keyViewNamesInTb:
                  m_viewNamesInToolbar = val(valField(response.data[_i], CONFIG_VALUE));
                  break;

                case keyUsarColoresEnDoc:
                  m_usarColoresEnDocumentos = val(valField(response.data[_i], CONFIG_VALUE));
                  break;

                case keyCloseWizard:
                  m_closeWizard = val(valField(response.data[_i], CONFIG_VALUE));
                  break;

                case keyNoAskInPrint:
                  m_noAskInPrint = val(valField(response.data[_i], CONFIG_VALUE));
                  break;
              }
            }

            var apiPath = Cairo.Database.getAPIVersion();
            return Cairo.Database.getData("load[" + apiPath + "general/usuarioconfig]", id).then(
              function (response) {

                m_showBarcodeInputCtrls = false;

                m_docId_pv = Cairo.Constants.NO_ID;
                m_docPVNombre = "";

                var keyDocPc = null;
                var keyDocPrec = null;
                var keyDocCot = null;
                var keyDocOc = null;
                var keyDocRc = null;
                var keyDocFc = null;

                var keyDepl = null;
                var keyDeplSrv = null;

                var keyDocPv = null;
                var keyDocPrev = null;
                var keyDocRv = null;
                var keyDocRv_C = null;
                var keyDocFv = null;

                var keyPklDocFac = null;
                var keyPklDocInt = null;

                var keyDocOs = null;
                var keyDocPrp = null;
                var keyPtdFecha = null;
                var keyPrpEstadoDef = null;

                var keyDocMF = null;
                var keyDocDBCO = null;
                var keyDebeHaberMf = null;

                var keyDocLIQ = null;

                var keyDesktop = null;
                var keyLenguaje = null;
                var keyAutoSizeCols = null;
                var keyMultiSelect = null;
                var keyShowSaveAs = null;
                var keyShowAllInWizard = null;
                var keyFolderToExportPDF = null;

                var keyCuentaFvo = null;
                var keyCliente = null;
                var keyDocCobz = null;

                var keyEstadoHojaRuta = null;
                var keyEstadoPickingList = null;

                var keyColorEmpresa = null;

                var bExists = null;

                

                while (!rs.isEOF()) {
                  switch (valField(response.data[_i], CONFIG_KEY)) {

                    case keyDocPc:
                      m_docId_pc = val(valField(response.data[_i], CONFIG_VALUE));
                      if (!Cairo.Database.getData(Cairo.General.Constants.DOCUMENTO, Cairo.General.Constants.DOC_ID, m_docId_pc, Cairo.General.Constants.DOC_NAME, m_docPCNombre)) {
                        return false;
                      }
                      break;

                    case keyDocPrev:
                      m_docId_prev = val(valField(response.data[_i], CONFIG_VALUE));
                      if (!Cairo.Database.getData(Cairo.General.Constants.DOCUMENTO, Cairo.General.Constants.DOC_ID, m_docId_prev, Cairo.General.Constants.DOC_NAME, m_docPREVNombre)) {
                        return false;
                      }
                      break;

                    case keyDocCot:
                      m_docId_cot = val(valField(response.data[_i], CONFIG_VALUE));
                      if (!Cairo.Database.getData(Cairo.General.Constants.DOCUMENTO, Cairo.General.Constants.DOC_ID, m_docId_cot, Cairo.General.Constants.DOC_NAME, m_docCOTNombre)) {
                        return false;
                      }
                      break;

                    case keyDocOc:
                      m_docId_oc = val(valField(response.data[_i], CONFIG_VALUE));
                      if (!Cairo.Database.getData(Cairo.General.Constants.DOCUMENTO, Cairo.General.Constants.DOC_ID, m_docId_oc, Cairo.General.Constants.DOC_NAME, m_docOCNombre)) {
                        return false;
                      }
                      break;

                    case keyDocRc:
                      m_docId_rc = val(valField(response.data[_i], CONFIG_VALUE));
                      if (!Cairo.Database.getData(Cairo.General.Constants.DOCUMENTO, Cairo.General.Constants.DOC_ID, m_docId_rc, Cairo.General.Constants.DOC_NAME, m_docRCNombre)) {
                        return false;
                      }
                      break;

                    case keyDocFc:
                      m_docId_fc = val(valField(response.data[_i], CONFIG_VALUE));
                      if (!Cairo.Database.getData(Cairo.General.Constants.DOCUMENTO, Cairo.General.Constants.DOC_ID, m_docId_fc, Cairo.General.Constants.DOC_NAME, m_docFCNombre)) {
                        return false;
                      }

                      break;

                    case keyDocPv:
                      m_docId_pv = val(valField(response.data[_i], CONFIG_VALUE));
                      if (!Cairo.Database.getData(Cairo.General.Constants.DOCUMENTO, Cairo.General.Constants.DOC_ID, m_docId_pv, Cairo.General.Constants.DOC_NAME, m_docPVNombre)) {
                        return false;
                      }
                      break;

                    case keyDocPrev:
                      m_docId_prev = val(valField(response.data[_i], CONFIG_VALUE));
                      if (!Cairo.Database.getData(Cairo.General.Constants.DOCUMENTO, Cairo.General.Constants.DOC_ID, m_docId_prev, Cairo.General.Constants.DOC_NAME, m_docPREVNombre)) {
                        return false;
                      }
                      break;

                    case keyDocRv:
                      m_docId_rv = val(valField(response.data[_i], CONFIG_VALUE));
                      if (!Cairo.Database.getData(Cairo.General.Constants.DOCUMENTO, Cairo.General.Constants.DOC_ID, m_docId_rv, Cairo.General.Constants.DOC_NAME, m_docRVNombre)) {
                        return false;
                      }
                      break;

                    case keyDocRv_C:
                      m_docId_rv_C = val(valField(response.data[_i], CONFIG_VALUE));
                      if (!Cairo.Database.getData(Cairo.General.Constants.DOCUMENTO, Cairo.General.Constants.DOC_ID, m_docId_rv_C, Cairo.General.Constants.DOC_NAME, m_docRVNombre_C)) {
                        return false;
                      }
                      break;

                    case keyDocFv:
                      m_docId_fv = val(valField(response.data[_i], CONFIG_VALUE));
                      if (!Cairo.Database.getData(Cairo.General.Constants.DOCUMENTO, Cairo.General.Constants.DOC_ID, m_docId_fv, Cairo.General.Constants.DOC_NAME, m_docFVNombre)) {
                        return false;
                      }

                      break;

                    case keyPklDocFac:
                      m_pkl_docId_factura = val(valField(response.data[_i], CONFIG_VALUE));
                      if (!Cairo.Database.getData(Cairo.General.Constants.DOCUMENTO, Cairo.General.Constants.DOC_ID, m_pkl_docId_factura, Cairo.General.Constants.DOC_NAME, m_pklDocFactura)) {
                        return false;
                      }
                      break;

                    case keyPklDocInt:
                      m_pkl_docId_interno = val(valField(response.data[_i], CONFIG_VALUE));
                      if (!Cairo.Database.getData(Cairo.General.Constants.DOCUMENTO, Cairo.General.Constants.DOC_ID, m_pkl_docId_interno, Cairo.General.Constants.DOC_NAME, m_pklDocInterno)) {
                        return false;
                      }

                      break;

                    case keyDocCobz:
                      m_docId_cobz = val(valField(response.data[_i], CONFIG_VALUE));
                      if (!Cairo.Database.getData(Cairo.General.Constants.DOCUMENTO, Cairo.General.Constants.DOC_ID, m_docId_cobz, Cairo.General.Constants.DOC_NAME, m_docCobzNombre)) {
                        return false;
                      }
                      break;

                    case SHOW_BARCODE_INPUT_CTRLS:
                      m_showBarcodeInputCtrls = val(valField(response.data[_i], CONFIG_VALUE));

                      break;

                    case keyDocOs:
                      m_docId_os = val(valField(response.data[_i], CONFIG_VALUE));
                      if (!Cairo.Database.getData(Cairo.General.Constants.DOCUMENTO, Cairo.General.Constants.DOC_ID, m_docId_os, Cairo.General.Constants.DOC_NAME, m_docOSNombre)) {
                        return false;
                      }
                      break;

                    case keyDocPrp:
                      m_docId_prp = val(valField(response.data[_i], CONFIG_VALUE));
                      if (!Cairo.Database.getData(Cairo.General.Constants.DOCUMENTO, Cairo.General.Constants.DOC_ID, m_docId_prp, Cairo.General.Constants.DOC_NAME, m_docPRPNombre)) {
                        return false;
                      }

                      break;

                    case keyPtdFecha:
                      m_ptdFecha = val(valField(response.data[_i], CONFIG_VALUE));

                      break;

                    case keyPrpEstadoDef:
                      m_prpEstadoDef = val(valField(response.data[_i], CONFIG_VALUE));

                      break;

                    case keyDocMF:
                      m_docId_mf = val(valField(response.data[_i], CONFIG_VALUE));
                      if (!Cairo.Database.getData(Cairo.General.Constants.DOCUMENTO, Cairo.General.Constants.DOC_ID, m_docId_mf, Cairo.General.Constants.DOC_NAME, m_docMFNombre)) {
                        return false;
                      }
                      break;

                    case keyDocDBCO:
                      m_docId_dbco = val(valField(response.data[_i], CONFIG_VALUE));
                      if (!Cairo.Database.getData(Cairo.General.Constants.DOCUMENTO, Cairo.General.Constants.DOC_ID, m_docId_dbco, Cairo.General.Constants.DOC_NAME, m_docDBCONombre)) {
                        return false;
                      }
                      break;

                    case keyDebeHaberMf:
                      m_debe_haber_mf = val(valField(response.data[_i], CONFIG_VALUE));

                      break;

                    case keyDocLIQ:
                      m_docId_liq = val(valField(response.data[_i], CONFIG_VALUE));
                      if (!Cairo.Database.getData(Cairo.General.Constants.DOCUMENTO, Cairo.General.Constants.DOC_ID, m_docId_liq, Cairo.General.Constants.DOC_NAME, m_docLIQNombre)) {
                        return false;
                      }

                      break;

                    case keyDepl:
                      m_deplId = val(valField(response.data[_i], CONFIG_VALUE));
                      if (!Cairo.Database.getData(Cairo.General.Constants.DEPOSITOLOGICO, Cairo.General.Constants.DEPL_ID, m_deplId, CSCDEPL_NAME, m_deplNombre)) {
                        return false;
                      }
                      break;

                    case keyDeplSrv:
                      m_deplId_srv = val(valField(response.data[_i], CONFIG_VALUE));
                      if (!Cairo.Database.getData(Cairo.General.Constants.DEPOSITOLOGICO, Cairo.General.Constants.DEPL_ID, m_deplId_srv, CSCDEPL_NAME, m_deplNombreSrv)) {
                        return false;
                      }

                      break;

                    case keyDesktop:
                      m_desktop = valField(response.data[_i], CONFIG_VALUE);

                      break;

                    case keyFolderToExportPDF:
                      m_folderToExportPDF = valField(response.data[_i], CONFIG_VALUE);

                      break;

                    case keyLenguaje:
                      m_lengId = val(valField(response.data[_i], CONFIG_VALUE));
                      if (!Cairo.Database.getData(Cairo.General.Constants.LENGUAJE, Cairo.General.Constants.LENG_ID, m_lengId, Cairo.General.Constants.LENG_NAME, m_lengName)) {
                        return false;
                      }

                      break;

                    case keyAutoSizeCols:
                      m_autoSizeCols = val(valField(response.data[_i], CONFIG_VALUE));

                      break;

                    case keyMultiSelect:
                      m_multiSelect = val(valField(response.data[_i], CONFIG_VALUE));

                      break;

                    case keyShowSaveAs:
                      m_showSaveAs = val(valField(response.data[_i], CONFIG_VALUE));

                      break;

                    case keyShowAllInWizard:
                      m_showAllInWizard = val(valField(response.data[_i], CONFIG_VALUE));

                      break;

                    case keyCliente:
                      m_cliId_xdefecto = val(valField(response.data[_i], CONFIG_VALUE));
                      if (!Cairo.Database.getData(Cairo.General.Constants.CLIENTE, Cairo.General.Constants.CLI_ID, m_cliId_xdefecto, Cairo.General.Constants.CLI_NAME, m_clienteXDefecto)) {
                        return false;
                      }

                      break;

                    case keyCuentaFvo:
                      m_cueId_FvoxDefecto = val(valField(response.data[_i], CONFIG_VALUE));
                      if (!Cairo.Database.getData(Cairo.General.Constants.CUENTA, Cairo.General.Constants.CUE_ID, m_cueId_FvoxDefecto, Cairo.General.Constants.CUE_NAME, m_cuentaFvoxDefecto)) {
                        return false;
                      }

                      break;

                    case keyEstadoHojaRuta:
                      m_estId_hojaRuta = valField(response.data[_i], CONFIG_VALUE);

                      if (m_estId_hojaRuta.Substring(0, 1).toUpperCase() == KEY_NODO) {
                        m_estadoHojaRuta = pGetNombreRama(CSESTADO, val(m_estId_hojaRuta.Substring(2)), bExists);
                        if (!bExists) {
                          m_estId_hojaRuta = "0";
                        }
                      }
                      else {
                        if (!Cairo.Database.getData(Cairo.Constants.ESTADO, Cairo.Constants.EST_ID, m_estId_hojaRuta, Cairo.Constants.EST_NAME, m_estadoHojaRuta)) {
                          return false;
                        }
                      }

                      break;

                    case keyEstadoPickingList:
                      m_estId_pickinglist = valField(response.data[_i], CONFIG_VALUE);

                      if (m_estId_pickinglist.Substring(0, 1).toUpperCase() == KEY_NODO) {
                        m_estadoPickingList = pGetNombreRama(CSESTADO, val(m_estId_pickinglist.Substring(2)), bExists);
                        if (!bExists) {
                          m_estId_pickinglist = "0";
                        }
                      }
                      else {
                        if (!Cairo.Database.getData(Cairo.Constants.ESTADO, Cairo.Constants.EST_ID, m_estId_pickinglist, Cairo.Constants.EST_NAME, m_estadoPickingList)) {
                          return false;
                        }
                      }

                      break;

                    case keyColorEmpresa:
                      m_colorEnEmpresa = val(valField(response.data[_i], CONFIG_VALUE));

                      break;
                  }

                  rs.MoveNext;
                }

                return true;
              });
          
          };

        var pEdit = function() {
          try {

            m_dialog = new cABMGeneric();

            if(!Cairo.Security.hasPermissionTo(csGeneralPrestacion.cSPREGMODIFYCONFIGUSUARIO)) { return; }

            if(!cGenericEdit.self.load()) { return; }

            if(!loadCollection()) { return; }

            m_editing = true;

            return;
          }
          catch (ex) {
            Cairo.manageErrorEx(ex.message, "pEdit", C_MODULE, "");
          }
        };

        var loadCollection = function() {

          var c = null;
          var oProp = null;

          var abmObj = null;
          abmObj = m_dialog;

          abmObj.setMinHeight(8400);
          abmObj.setMinWidth(11000);
          abmObj.setUseHelpValueProcess(true);

          var c_tab_General = 0;
          var c_tab_Compras = 1;
          var c_tab_Stock = 2;
          var c_tab_Ventas = 3;
          var c_tab_Tesoreria = 4;
          var c_tab_Servicios = 5;
          var c_tab_Personal = 6;
          var c_tab_Despachos = 7;
          var c_tab_Cancelacion = 8;

          var w_tabs = m_dialog.getTabs();
          w_tabs.clear();

          var tab = w_tabs.add(null);
          tab.setIndex(c_tab_General);
          tab.setName(Cairo.Constants.c_strGeneral);

          var tab = w_tabs.add(null);
          tab.setIndex(c_tab_Compras);
          //'Compras
          tab.setName(Cairo.Language.getText(1489, ""));

          var tab = w_tabs.add(null);
          tab.setIndex(c_tab_Stock);
          //'Stock
          tab.setName(Cairo.Language.getText(1298, ""));

          var tab = w_tabs.add(null);
          tab.setIndex(c_tab_Ventas);
          //'Ventas
          tab.setName(Cairo.Language.getText(1488, ""));

          var tab = w_tabs.add(null);
          tab.setIndex(c_tab_Tesoreria);
          //'Tesoreria
          tab.setName(Cairo.Language.getText(2935, ""));

          var tab = w_tabs.add(null);
          tab.setIndex(c_tab_Servicios);
          //'Servicios
          tab.setName(Cairo.Language.getText(2676, ""));

          var tab = w_tabs.add(null);
          tab.setIndex(c_tab_Personal);
          //'Personal
          tab.setName(Cairo.Language.getText(3880, ""));

          var tab = w_tabs.add(null);
          tab.setIndex(c_tab_Despachos);
          //'Depachos
          tab.setName(Cairo.Language.getText(4885, ""));

          var tab = w_tabs.add(null);
          tab.setIndex(c_tab_Cancelacion);
          //'Cancelacion
          tab.setName(Cairo.Language.getText(4959, ""));

          var properties = m_dialog.getProperties();

          properties.clear();

          // General
          var elem = properties.add(null, DESKTOP);
          elem.setType(Dialogs.PropertyType.file);
          //'Archivos de Escritorio|*.csd
          elem.setSelectFilter(Cairo.Language.getText(2936, ""));
          elem.setWidth(6700);
          elem.setName(DESKTOP);
          elem.setKey(K_DESKTOP);
          elem.setValue(m_desktop);
          elem.setTabIndex(c_tab_General);

          var elem = properties.add(null, LENGUAJE);
          elem.setType(Dialogs.PropertyType.select);
          elem.setTable(CSTBLLENGUAJE);
          elem.setWidth(4000);
          elem.setName(LENGUAJE);
          elem.setKey(K_LENGUAJE);
          elem.setSelectId(m_lengId);
          elem.setValue(m_lengName);
          elem.setTabIndex(c_tab_General);

          var elem = properties.add(null, AUTO_SIZE_COLS);
          elem.setType(Dialogs.PropertyType.check);
          elem.setWidth(4000);
          elem.setName(AUTO_SIZE_COLS);
          elem.setKey(K_AUTOSIZECOLS);
          elem.setValue(Cairo.Util.boolToInt(m_autoSizeCols));
          elem.setTabIndex(c_tab_General);
          elem.setLeft(2360);
          elem.setLeftLabel(-2000);

          var elem = properties.add(null, MULTI_SELECT);
          elem.setType(Dialogs.PropertyType.check);
          elem.setWidth(4000);
          elem.setName(MULTI_SELECT);
          elem.setKey(K_MULTISELECT);
          elem.setValue(Cairo.Util.boolToInt(m_multiSelect));
          elem.setTabIndex(c_tab_General);
          elem.setLeft(2360);
          elem.setLeftLabel(-2000);

          var elem = properties.add(null, USE_PRINTER_SIZE);
          elem.setType(Dialogs.PropertyType.check);
          elem.setLeft(4150);
          elem.setLeftLabel(-3800);
          elem.setName(USE_PRINTER_SIZE);
          elem.setKey(K_USE_PRINTER_SIZE);
          elem.setValue(Cairo.Util.boolToInt(m_usePrinterSize));
          elem.setTabIndex(c_tab_General);

          var elem = properties.add(null, VIEW_NAMES_IN_TOOLBAR);
          elem.setType(Dialogs.PropertyType.check);
          elem.setName("Ver el nombre de los bótones en las barras de herramientas");
          elem.setKey(K_VIEW_NAMES_IN_TOOLBAR);
          elem.setValue(Cairo.Util.boolToInt(m_viewNamesInToolbar));
          elem.setLeft(4660);
          elem.setLeftLabel(-4300);
          elem.setTabIndex(c_tab_General);

          var elem = properties.add(null, SHOW_SAVE_AS);
          elem.setType(Dialogs.PropertyType.check);
          elem.setWidth(4000);
          elem.setName(SHOW_SAVE_AS);
          elem.setKey(K_SHOWSAVEAS);
          elem.setValue(Cairo.Util.boolToInt(m_showSaveAs));
          elem.setTabIndex(c_tab_General);
          elem.setLeft(2360);
          elem.setLeftLabel(-2000);

          var elem = properties.add(null, SHOW_ALL_IN_WIZARD);
          elem.setType(Dialogs.PropertyType.check);
          elem.setWidth(4000);
          elem.setName(SHOW_ALL_IN_WIZARD);
          elem.setKey(K_SHOW_ALL_IN_WIZARD);
          elem.setValue(Cairo.Util.boolToInt(m_showAllInWizard));
          elem.setTabIndex(c_tab_General);
          elem.setLeft(3860);
          elem.setLeftLabel(-3500);

          var elem = properties.add(null, FOLDER_TO_EXPORT_PDF);
          elem.setType(Dialogs.PropertyType.folder);
          elem.setWidth(6000);
          //.LeftFromProperty = DESKTOP
          elem.setName(FOLDER_TO_EXPORT_PDF);
          elem.setKey(K_FOLDER_TO_EXPORT_PDF);
          elem.setValue(m_folderToExportPDF);
          elem.setTabIndex(c_tab_General);
          elem.setLeft(3200);
          elem.setLeftLabel(-2830);
          elem.setWidth(5000);

          var elem = properties.add(null, USAR_COLORES_EN_DOC);
          elem.setType(Dialogs.PropertyType.check);
          elem.setWidth(6000);
          //'Usar colores en documentos
          elem.setName(Cairo.Language.getText(4821, ""));
          elem.setKey(K_USAR_COLORES_EN_DOCUMENTOS);
          elem.setValue(m_usarColoresEnDocumentos);
          elem.setTabIndex(c_tab_General);
          elem.setLeft(3200);
          elem.setLeftLabel(-2830);

          var elem = properties.add(null, COLOR_EN_EMPRESA);
          elem.setType(Dialogs.PropertyType.numeric);
          elem.setSubType(Dialogs.PropertySubType.Integer);
          elem.setWidth(6000);
          //'Color en Empresa
          elem.setName(Cairo.Language.getText(4915, ""));
          elem.setKey(K_COLOR_BACKGROUND);
          elem.setValue(m_colorEnEmpresa);
          elem.setTabIndex(c_tab_General);
          elem.setLeft(3200);
          elem.setLeftLabel(-2830);
          elem.setWidth(1500);

          // Compras

          var elem = properties.add(null, DOC_PC);
          elem.setType(Dialogs.PropertyType.select);
          elem.setTable(CSTBLDOCUMENTO);
          elem.setLeft(2800);
          elem.setWidth(4000);
          elem.setLeftLabel(-2500);
          elem.setName(DOC_PC);
          elem.setKey(K_DOC_ID_PC);
          elem.setSelectId(m_docId_pc);
          elem.setSelectFilter("'doctId = 6'");
          elem.setValue(m_docPCNombre);
          elem.setTabIndex(c_tab_Compras);

          var elem = properties.add(null, DOC_PREC);
          elem.setType(Dialogs.PropertyType.select);
          elem.setTable(CSTBLDOCUMENTO);
          elem.setLeft(2800);
          elem.setWidth(4000);
          elem.setLeftLabel(-2500);
          elem.setName(DOC_PREC);
          elem.setKey(K_DOC_ID_PREC);
          elem.setSelectId(m_docId_prec);
          elem.setSelectFilter("'doctId = 12'");
          elem.setValue(m_docPRECNombre);
          elem.setTabIndex(c_tab_Compras);

          var elem = properties.add(null, DOC_COT);
          elem.setType(Dialogs.PropertyType.select);
          elem.setTable(CSTBLDOCUMENTO);
          elem.setLeft(2800);
          elem.setWidth(4000);
          elem.setLeftLabel(-2500);
          elem.setName(DOC_COT);
          elem.setKey(K_DOC_ID_COT);
          elem.setSelectId(m_docId_cot);
          elem.setSelectFilter("'doctId = 37'");
          elem.setValue(m_docCOTNombre);
          elem.setTabIndex(c_tab_Compras);

          var elem = properties.add(null, DOC_OC);
          elem.setType(Dialogs.PropertyType.select);
          elem.setTable(CSTBLDOCUMENTO);
          elem.setLeft(2800);
          elem.setWidth(4000);
          elem.setLeftLabel(-2500);
          elem.setName(DOC_OC);
          elem.setKey(K_DOC_ID_OC);
          elem.setSelectId(m_docId_oc);
          elem.setSelectFilter("'doctId = 35'");
          elem.setValue(m_docOCNombre);
          elem.setTabIndex(c_tab_Compras);

          var elem = properties.add(null, DOC_RC);
          elem.setType(Dialogs.PropertyType.select);
          elem.setTable(CSTBLDOCUMENTO);
          elem.setLeft(2800);
          elem.setWidth(4000);
          elem.setLeftLabel(-2500);
          elem.setName(DOC_RC);
          elem.setKey(K_DOC_ID_RC);
          elem.setSelectId(m_docId_rc);
          elem.setSelectFilter("'doctId = 4'");
          elem.setValue(m_docRCNombre);
          elem.setTabIndex(c_tab_Compras);

          var elem = properties.add(null, DOC_FC);
          elem.setType(Dialogs.PropertyType.select);
          elem.setTable(CSTBLDOCUMENTO);
          elem.setLeft(2800);
          elem.setWidth(4000);
          elem.setLeftLabel(-2500);
          elem.setName(DOC_FC);
          elem.setKey(K_DOC_ID_FC);
          elem.setSelectId(m_docId_fc);
          elem.setSelectFilter("'doctId = 2'");
          elem.setValue(m_docFCNombre);
          elem.setTabIndex(c_tab_Compras);

          var elem = properties.add(null, SHOW_DATA_ADD_IN_COMPRAS);
          elem.setType(Dialogs.PropertyType.check);
          elem.setLeft(2800);
          elem.setWidth(400);
          elem.setLeftLabel(-2500);
          //'Ver datos del proveedor
          elem.setName(Cairo.Language.getText(3914, ""));
          elem.setKey(K_SHOWDATAADIC_IN_COMPRAS);
          elem.setValue(Cairo.Util.boolToInt(m_showDataAddInCompras));
          elem.setTabIndex(c_tab_Compras);

          // Stock

          var elem = properties.add(null, DEPOSITO);
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.DEPOSITOLOGICO);
          elem.setLeft(1100);
          elem.setWidth(4000);
          elem.setLeftLabel(-800);
          elem.setName(DEPOSITO);
          elem.setKey(K_DEPL_ID);
          elem.setSelectId(m_deplId);
          elem.setValue(m_deplNombre);
          elem.setTabIndex(c_tab_Stock);

          var elem = properties.add(null, DEPOSITO_SRV);
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.DEPOSITOLOGICO);
          elem.setLeft(1100);
          elem.setWidth(4000);
          elem.setLeftLabel(-800);
          elem.setName(DEPOSITO_SRV);
          elem.setKey(K_DEPL_ID_SRV);
          elem.setSelectId(m_deplId_srv);
          elem.setValue(m_deplNombreSrv);
          elem.setTabIndex(c_tab_Stock);

          // Ventas

          var elem = properties.add(null, INFORMAR_ANTICIPOS);
          elem.setType(Dialogs.PropertyType.check);
          elem.setName(Cairo.Language.getText(2937, ""));
          //Mostrar un mensaje al grabar las Facturas de venta informando si el & _
          cliente(tiene anticipos);
          elem.setLeftLabel(-6450);
          elem.setLeft(6750);
          elem.setKey(K_INFORMAR_ANTICIPOS);
          elem.setValue(Cairo.Util.boolToInt(m_informarAnticipos));
          elem.setTabIndex(c_tab_Ventas);

          var elem = properties.add(null, DOC_PREV+ "v");
          elem.setType(Dialogs.PropertyType.select);
          elem.setTable(CSTBLDOCUMENTO);
          elem.setLeft(2800);
          elem.setWidth(4000);
          elem.setLeftLabel(-2500);
          elem.setName(DOC_PREV);
          elem.setKey(K_DOC_ID_PREV);
          elem.setSelectId(m_docId_prev);
          elem.setSelectFilter("'doctId = 11'");
          elem.setValue(m_docPREVNombre);
          elem.setTabIndex(c_tab_Ventas);
          elem.setTopToPrevious(400);

          var elem = properties.add(null, DOC_PV+ "v");
          elem.setType(Dialogs.PropertyType.select);
          elem.setTable(CSTBLDOCUMENTO);
          elem.setLeft(2800);
          elem.setWidth(4000);
          elem.setLeftLabel(-2500);
          elem.setName(DOC_PV);
          elem.setKey(K_DOC_ID_PV);
          elem.setSelectId(m_docId_pv);
          elem.setSelectFilter("'doctId = 5'");
          elem.setValue(m_docPVNombre);
          elem.setTabIndex(c_tab_Ventas);
          elem.setTopToPrevious(400);

          var elem = properties.add(null, DOC_RV+ "v");
          elem.setType(Dialogs.PropertyType.select);
          elem.setTable(CSTBLDOCUMENTO);
          elem.setLeft(2800);
          elem.setWidth(4000);
          elem.setLeftLabel(-2500);
          elem.setName(DOC_RV);
          elem.setKey(K_DOC_ID_RV);
          elem.setSelectId(m_docId_rv);
          elem.setSelectFilter("'doctId = 3'");
          elem.setValue(m_docRVNombre);
          elem.setTabIndex(c_tab_Ventas);
          elem.setTopToPrevious(400);

          var elem = properties.add(null, DOC_FV+ "v");
          elem.setType(Dialogs.PropertyType.select);
          elem.setTable(CSTBLDOCUMENTO);
          elem.setLeft(2800);
          elem.setWidth(4000);
          elem.setLeftLabel(-2500);
          elem.setName(DOC_FV);
          elem.setKey(K_DOC_ID_FV);
          elem.setSelectId(m_docId_fv);
          elem.setSelectFilter("'doctId = 1'");
          elem.setValue(m_docFVNombre);
          elem.setTabIndex(c_tab_Ventas);
          elem.setTopToPrevious(400);

          var elem = properties.add(null, DOC_COBZ);
          elem.setType(Dialogs.PropertyType.select);
          elem.setTable(CSTBLDOCUMENTO);
          elem.setLeft(2800);
          elem.setWidth(4000);
          elem.setLeftLabel(-2500);
          elem.setName(DOC_COBZ);
          elem.setKey(K_DOC_ID_COBZ);
          elem.setSelectId(m_docId_cobz);
          elem.setSelectFilter("'doctId = 13'");
          elem.setValue(m_docCobzNombre);
          elem.setTabIndex(c_tab_Ventas);
          elem.setTopToPrevious(400);

          var elem = properties.add(null, SHOW_BARCODE_INPUT_CTRLS);
          elem.setType(Dialogs.PropertyType.check);
          elem.setLeft(3300);
          elem.setLeftLabel(-3000);
          elem.setName(SHOW_BARCODE_INPUT_CTRLS);
          elem.setKey(K_SHOWBARCODEINPUTCTRLS);
          elem.setValue(Cairo.Util.boolToInt(m_showBarcodeInputCtrls));
          elem.setTabIndex(c_tab_Ventas);
          elem.setTopToPrevious(400);

          var elem = properties.add(null, CUENTA_FVO_X_DEFECTO);
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.CUENTA);
          elem.setLeft(3100);
          elem.setWidth(3000);
          elem.setLeftLabel(-2800);
          //'Cuenta efectivo de cobranza contado
          elem.setName(Cairo.Language.getText(3554, ""));
          elem.setKey(K_CUENTAFVOXDEFECTO);
          elem.setSelectId(m_cueId_FvoxDefecto);
          elem.setValue(m_cuentaFvoxDefecto);
          elem.setTabIndex(c_tab_Ventas);
          elem.setTopToPrevious(400);

          var elem = properties.add(null, CLIENTE_X_DEFECTO);
          elem.setType(Dialogs.PropertyType.select);
          elem.setSelectTable(Cairo.Tables.CLIENTE);
          elem.setLeft(3100);
          elem.setWidth(3000);
          elem.setLeftLabel(-2800);
          //'Cliente por defecto
          elem.setName(Cairo.Language.getText(3556, ""));
          elem.setKey(K_CLIENTEXDEFECTO);
          elem.setSelectId(m_cliId_xdefecto);
          elem.setValue(m_clienteXDefecto);
          elem.setTabIndex(c_tab_Ventas);
          elem.setTopToPrevious(400);

          var elem = properties.add(null, NUEVO_AL_GRABAR);
          elem.setType(Dialogs.PropertyType.check);
          elem.setLeft(4050);
          elem.setWidth(400);
          elem.setLeftLabel(-3750);
          //'Presentar un nuevo documento despues de grabar
          elem.setName(Cairo.Language.getText(3555, ""));
          elem.setKey(K_NUEVOALGRABAR);
          elem.setValue(Cairo.Util.boolToInt(m_nuevoAlGrabar));
          elem.setTabIndex(c_tab_Ventas);
          elem.setTopToPrevious(360);

          var elem = properties.add(null, PRINT_IN_NEW_FV);
          elem.setType(Dialogs.PropertyType.check);
          elem.setLeft(4050);
          elem.setWidth(400);
          elem.setLeftLabel(-3750);
          //'Imprimir al grabar una nueva factura
          elem.setName(Cairo.Language.getText(4837, ""));
          elem.setKey(K_PRINT_IN_NEW_FV);
          elem.setValue(Cairo.Util.boolToInt(m_printInNewFV));
          elem.setTabIndex(c_tab_Ventas);
          elem.setTopToPrevious(360);

          var elem = properties.add(null, PRINT_IN_NEW_COBZ_CDO);
          elem.setType(Dialogs.PropertyType.check);
          elem.setLeft(4050);
          elem.setWidth(400);
          elem.setLeftLabel(-3750);
          //'Imprimir recibo en cobranza contado
          elem.setName(Cairo.Language.getText(4838, ""));
          elem.setKey(K_PRINT_IN_NEW_COBZ_CDO);
          elem.setValue(Cairo.Util.boolToInt(m_printInNewCobzCdo));
          elem.setTabIndex(c_tab_Ventas);
          elem.setTopToPrevious(360);

          var elem = properties.add(null, NUEVO_PTD_AL_GRABAR);
          elem.setType(Dialogs.PropertyType.check);
          elem.setLeft(4050);
          elem.setWidth(400);
          elem.setLeftLabel(-3750);
          //'Presentar un nuevo parte despues de grabar
          elem.setName(Cairo.Language.getText(4836, ""));
          elem.setKey(K_NUEVOPTDALGRABAR);
          elem.setValue(Cairo.Util.boolToInt(m_nuevoPTDAlGrabar));
          elem.setTabIndex(c_tab_Ventas);
          elem.setTopToPrevious(360);

          var elem = properties.add(null, SHOW_DATA_ADD_IN_VENTAS);
          elem.setType(Dialogs.PropertyType.check);
          elem.setWidth(400);
          elem.setLeftLabel(-2750);
          //'Ver datos del cliente
          elem.setName(Cairo.Language.getText(3913, ""));
          elem.setKey(K_SHOWDATAADIC_IN_VENTAS);
          elem.setValue(Cairo.Util.boolToInt(m_showDataAddInVentas));
          elem.setTabIndex(c_tab_Ventas);
          elem.setTopFromProperty(NUEVO_AL_GRABAR);
          elem.setLeft(8000);

          var elem = properties.add(null, CLOSE_WIZARD);
          elem.setType(Dialogs.PropertyType.check);
          elem.setWidth(400);
          elem.setLeftLabel(-2750);
          //'Cerrar Asistente al Finalizar
          elem.setName(Cairo.Language.getText(5079, ""));
          elem.setKey(K_CLOSE_WIZARD);
          elem.setValue(Cairo.Util.boolToInt(m_closeWizard));
          elem.setTabIndex(c_tab_Ventas);
          elem.setTopToPrevious(360);
          elem.setLeft(8000);

          var elem = properties.add(null, NO_ASK_IN_PRINT);
          elem.setType(Dialogs.PropertyType.check);
          elem.setWidth(400);
          elem.setLeftLabel(-2750);
          //'No Pedir Confirmar al Imprimir
          elem.setName(Cairo.Language.getText(5080, ""));
          elem.setKey(K_NO_ASK_IN_PRINT);
          elem.setValue(Cairo.Util.boolToInt(m_noAskInPrint));
          elem.setTabIndex(c_tab_Ventas);
          elem.setTopToPrevious(360);
          elem.setLeft(8000);

          c = properties.add(null, ESTADO_HOJA_RUTA);
          c.setType(Dialogs.PropertyType.select);
          c.setTable(CSESTADO);
          c.setLeftFromProperty(DOC_COBZ);
          c.setLeftLabel(-2500);
          //'Estado en hojas de ruta
          c.setName(Cairo.Language.getText(4549, ""));
          c.setKey(K_ESTADO_EN_HOJA_RUTA);
          c.setSelectId(val(m_estId_hojaRuta));
          c.setHelpValueProcess(m_estId_hojaRuta);
          c.setValue(m_estadoHojaRuta);
          c.setTabIndex(c_tab_Ventas);
          c.setTopToPrevious(720);

          oProp = c;
          oProp.setHelpType(csHelpType.cSTREE);
          oProp.setIsEditProperty(false);
          oProp = null;

          // Tesoreria

          var elem = properties.add(null, DOC_MF);
          elem.setType(Dialogs.PropertyType.select);
          elem.setTable(CSTBLDOCUMENTO);
          elem.setLeft(2800);
          elem.setWidth(4000);
          elem.setLeftLabel(-2500);
          elem.setName(DOC_MF);
          elem.setKey(K_DOC_ID_MF);
          elem.setSelectId(m_docId_mf);
          elem.setSelectFilter("'doctId = 26'");
          elem.setValue(m_docMFNombre);
          elem.setTabIndex(c_tab_Tesoreria);

          var elem = properties.add(null, DOC_DBCO);
          elem.setType(Dialogs.PropertyType.select);
          elem.setTable(CSTBLDOCUMENTO);
          elem.setLeft(2800);
          elem.setWidth(4000);
          elem.setLeftLabel(-2500);
          elem.setName(DOC_DBCO);
          elem.setKey(K_DOC_ID_DBCO);
          elem.setSelectId(m_docId_dbco);
          elem.setSelectFilter("'doctId = 17'");
          elem.setValue(m_docDBCONombre);
          elem.setTabIndex(c_tab_Tesoreria);

          var elem = properties.add(null, DEBE_HABER_MF);
          elem.setType(Dialogs.PropertyType.check);
          elem.setLeft(2800);
          elem.setLeftLabel(-2500);
          elem.setName(DEBE_HABER_MF);
          elem.setKey(K_DEBE_HABER_MF);
          elem.setValue(m_debe_haber_mf);
          elem.setTabIndex(c_tab_Tesoreria);

          // Servicios

          var elem = properties.add(null, DOC_OS);
          elem.setType(Dialogs.PropertyType.select);
          elem.setTable(CSTBLDOCUMENTO);
          elem.setLeft(2800);
          elem.setWidth(4000);
          elem.setLeftLabel(-2650);
          elem.setName(DOC_OS);
          elem.setKey(K_DOC_ID_OS);
          elem.setSelectId(m_docId_os);
          elem.setSelectFilter("'doctId = 42'");
          elem.setValue(m_docOSNombre);
          elem.setTabIndex(c_tab_Servicios);

          var elem = properties.add(null, DOC_PRP);
          elem.setType(Dialogs.PropertyType.select);
          elem.setTable(CSTBLDOCUMENTO);
          elem.setLeft(2800);
          elem.setWidth(4000);
          elem.setLeftLabel(-2650);
          elem.setName(DOC_PRP);
          elem.setKey(K_DOC_ID_PRP);
          elem.setSelectId(m_docId_prp);
          elem.setSelectFilter("'doctId = 43'");
          elem.setValue(m_docPRPNombre);
          elem.setTabIndex(c_tab_Servicios);

          var elem = properties.add(null, PTD_FECHA);
          elem.setType(Dialogs.PropertyType.check);
          elem.setLeft(2800);
          elem.setWidth(4000);
          elem.setLeftLabel(-2650);
          elem.setName(PTD_FECHA);
          elem.setKey(K_PTD_FECHAINI);
          elem.setValue(Cairo.Util.boolToInt(m_ptdFecha));
          elem.setTabIndex(c_tab_Servicios);

          var elem = properties.add(null, PRP_ESTADO_X_DEF);
          elem.setType(Dialogs.PropertyType.check);
          elem.setLeft(5500);
          elem.setWidth(400);
          elem.setLeftLabel(-5350);
          //'Estado Default en Parte Reparacion
          elem.setName(Cairo.Language.getText(3918, ""));
          elem.setKey(K_PARTE_REPARACION_ESTADO_DEFAULT);
          elem.setValue(Cairo.Util.boolToInt(m_prpEstadoDef));
          elem.setTabIndex(c_tab_Servicios);

          // Personal

          var elem = properties.add(null, DOC_LIQ);
          elem.setType(Dialogs.PropertyType.select);
          elem.setTable(CSTBLDOCUMENTO);
          elem.setLeft(2800);
          elem.setWidth(4000);
          elem.setLeftLabel(-2500);
          elem.setName(DOC_LIQ);
          elem.setKey(K_DOC_ID_LIQ);
          elem.setSelectId(m_docId_liq);
          elem.setSelectFilter("'doctId = 47'");
          elem.setValue(m_docLIQNombre);
          elem.setTabIndex(c_tab_Personal);

          // Despachos

          var elem = properties.add(null, PKL_DOC_FACTURA);
          elem.setType(Dialogs.PropertyType.select);
          elem.setTable(CSTBLDOCUMENTO);
          elem.setLeft(2800);
          elem.setWidth(4000);
          elem.setLeftLabel(-2500);
          elem.setName(PKL_DOC_FACTURA);
          elem.setKey(K_PICKINLIST_DOC_ID_FACTURA);
          elem.setSelectId(m_pkl_docId_factura);
          elem.setSelectFilter("'doctId = 1'");
          elem.setValue(m_pklDocFactura);
          elem.setTabIndex(c_tab_Despachos);

          var elem = properties.add(null, PKL_DOC_INTERNO);
          elem.setType(Dialogs.PropertyType.select);
          elem.setTable(CSTBLDOCUMENTO);
          elem.setLeft(2800);
          elem.setWidth(4000);
          elem.setLeftLabel(-2500);
          elem.setName(PKL_DOC_INTERNO);
          elem.setKey(K_PICKINLIST_DOC_ID_INTERNO);
          elem.setSelectId(m_pkl_docId_interno);
          elem.setSelectFilter("'doctId = 1'");
          elem.setValue(m_pklDocInterno);
          elem.setTabIndex(c_tab_Despachos);

          c = properties.add(null, ESTADO_PICKING_LIST);
          c.setType(Dialogs.PropertyType.select);
          c.setTable(CSESTADO);
          c.setLeftLabel(-2500);
          //'Estado en picking list
          c.setName(Cairo.Language.getText(4861, ""));
          c.setKey(K_ESTADO_EN_PICKING_LIST);
          c.setSelectId(val(m_estId_pickinglist));
          c.setHelpValueProcess(m_estId_pickinglist);
          c.setValue(m_estadoPickingList);
          c.setTabIndex(c_tab_Despachos);

          oProp = c;
          oProp.setHelpType(csHelpType.cSTREE);
          oProp.setIsEditProperty(false);
          oProp = null;

          var elem = properties.add(null, DOC_RV_C+ "v");
          elem.setType(Dialogs.PropertyType.select);
          elem.setTable(CSTBLDOCUMENTO);
          elem.setLeft(3300);
          elem.setWidth(4000);
          elem.setLeftLabel(-3000);
          elem.setName(DOC_RV_C);
          elem.setKey(K_DOC_ID_RV_C);
          elem.setSelectId(m_docId_rv_C);
          elem.setSelectFilter("'doctId = 24'");
          elem.setValue(m_docRVNombre_C);
          elem.setTabIndex(c_tab_Cancelacion);

          if(!m_dialog.show(self)) { return false; }

          return true;
        };

        var refreshCollection = function() {

          m_dialog.setTitle(m_name);

          var properties = m_dialog.getProperties();

          var elem = properties.item(DESKTOP);
          elem.setValue(m_desktop);

          var elem = properties.item(LENGUAJE);
          elem.setSelectId(m_lengId);
          elem.setValue(m_lengName);

          var elem = properties.item(AUTO_SIZE_COLS);
          elem.setValue(Cairo.Util.boolToInt(m_autoSizeCols));

          var elem = properties.item(MULTI_SELECT);
          elem.setValue(Cairo.Util.boolToInt(m_multiSelect));

          var elem = properties.item(USE_PRINTER_SIZE);
          elem.setValue(Cairo.Util.boolToInt(m_usePrinterSize));

          var elem = properties.item(VIEW_NAMES_IN_TOOLBAR);
          elem.setValue(Cairo.Util.boolToInt(m_viewNamesInToolbar));

          var elem = properties.item(SHOW_SAVE_AS);
          elem.setValue(Cairo.Util.boolToInt(m_showSaveAs));

          var elem = properties.item(SHOW_ALL_IN_WIZARD);
          elem.setValue(Cairo.Util.boolToInt(m_showAllInWizard));

          var elem = properties.item(FOLDER_TO_EXPORT_PDF);
          elem.setValue(m_folderToExportPDF);

          var elem = properties.item(USAR_COLORES_EN_DOC);
          elem.setValue(m_usarColoresEnDocumentos);

          var elem = properties.item(COLOR_EN_EMPRESA);
          elem.setValue(m_colorEnEmpresa);

          var elem = properties.item(DOC_PC);
          elem.setSelectId(m_docId_pc);
          elem.setValue(m_docPCNombre);

          var elem = properties.item(DOC_PREC);
          elem.setSelectId(m_docId_prec);
          elem.setValue(m_docPRECNombre);

          var elem = properties.item(DOC_COT);
          elem.setSelectId(m_docId_cot);
          elem.setValue(m_docCOTNombre);

          var elem = properties.item(DOC_OC);
          elem.setSelectId(m_docId_oc);
          elem.setValue(m_docOCNombre);

          var elem = properties.item(DOC_RC);
          elem.setSelectId(m_docId_rc);
          elem.setValue(m_docRCNombre);

          var elem = properties.item(DOC_FC);
          elem.setSelectId(m_docId_fc);
          elem.setValue(m_docFCNombre);

          var elem = properties.item(SHOW_DATA_ADD_IN_COMPRAS);
          elem.setValue(Cairo.Util.boolToInt(m_showDataAddInCompras));

          var elem = properties.item(DEPOSITO);
          elem.setSelectId(m_deplId);
          elem.setValue(m_deplNombre);

          var elem = properties.item(DEPOSITO_SRV);
          elem.setSelectId(m_deplId_srv);
          elem.setValue(m_deplNombreSrv);

          var elem = properties.item(INFORMAR_ANTICIPOS);
          elem.setValue(Cairo.Util.boolToInt(m_informarAnticipos));

          var elem = properties.item(DOC_PREV+ "v");
          elem.setSelectId(m_docId_prev);
          elem.setValue(m_docPREVNombre);

          var elem = properties.item(DOC_PV+ "v");
          elem.setSelectId(m_docId_pv);
          elem.setValue(m_docPVNombre);

          var elem = properties.item(DOC_RV+ "v");
          elem.setSelectId(m_docId_rv);
          elem.setValue(m_docRVNombre);

          var elem = properties.item(DOC_FV+ "v");
          elem.setSelectId(m_docId_fv);
          elem.setValue(m_docFVNombre);

          var elem = properties.item(DOC_COBZ);
          elem.setSelectId(m_docId_cobz);
          elem.setValue(m_docCobzNombre);

          var elem = properties.item(SHOW_BARCODE_INPUT_CTRLS);
          elem.setValue(Cairo.Util.boolToInt(m_showBarcodeInputCtrls));

          var elem = properties.item(CUENTA_FVO_X_DEFECTO);
          elem.setSelectId(m_cueId_FvoxDefecto);
          elem.setValue(m_cuentaFvoxDefecto);

          var elem = properties.item(CLIENTE_X_DEFECTO);
          elem.setSelectId(m_cliId_xdefecto);
          elem.setValue(m_clienteXDefecto);

          var elem = properties.item(NUEVO_AL_GRABAR);
          elem.setValue(Cairo.Util.boolToInt(m_nuevoAlGrabar));

          var elem = properties.item(PRINT_IN_NEW_FV);
          elem.setValue(Cairo.Util.boolToInt(m_printInNewFV));

          var elem = properties.item(PRINT_IN_NEW_COBZ_CDO);
          elem.setValue(Cairo.Util.boolToInt(m_printInNewCobzCdo));

          var elem = properties.item(NUEVO_PTD_AL_GRABAR);
          elem.setValue(Cairo.Util.boolToInt(m_nuevoPTDAlGrabar));

          var elem = properties.item(SHOW_DATA_ADD_IN_VENTAS);
          elem.setValue(Cairo.Util.boolToInt(m_showDataAddInVentas));

          var elem = properties.item(CLOSE_WIZARD);
          elem.setValue(Cairo.Util.boolToInt(m_closeWizard));

          var elem = properties.item(NO_ASK_IN_PRINT);
          elem.setValue(Cairo.Util.boolToInt(m_noAskInPrint));

          var elem = properties.item(DOC_MF);
          elem.setSelectId(m_docId_mf);
          elem.setValue(m_docMFNombre);

          var elem = properties.item(DOC_DBCO);
          elem.setSelectId(m_docId_dbco);
          elem.setValue(m_docDBCONombre);

          var elem = properties.item(DEBE_HABER_MF);
          elem.setValue(m_debe_haber_mf);

          var elem = properties.item(DOC_OS);
          elem.setSelectId(m_docId_os);
          elem.setValue(m_docOSNombre);

          var elem = properties.item(DOC_PRP);
          elem.setSelectId(m_docId_prp);
          elem.setValue(m_docPRPNombre);

          var elem = properties.item(PTD_FECHA);
          elem.setValue(Cairo.Util.boolToInt(m_ptdFecha));

          var elem = properties.item(PRP_ESTADO_X_DEF);
          elem.setValue(Cairo.Util.boolToInt(m_prpEstadoDef));

          var elem = properties.item(DOC_LIQ);
          elem.setSelectId(m_docId_liq);
          elem.setValue(m_docLIQNombre);

          var elem = properties.item(PKL_DOC_FACTURA);
          elem.setSelectId(m_pkl_docId_factura);
          elem.setValue(m_pklDocFactura);

          var elem = properties.item(PKL_DOC_INTERNO);
          elem.setSelectId(m_pkl_docId_interno);
          elem.setValue(m_pklDocInterno);

          var elem = properties.item(DOC_RV_C+ "v");
          elem.setSelectId(m_docId_rv_C);
          elem.setValue(m_docRVNombre_C);

          return m_dialog.showValues(properties);
        };
        // funciones friend
        // funciones privadas
        var getConfigKey = function(key,  iModule) {
          switch (iModule) {
            case UserConfigSection.purchases:
              key = key+ " Cpra_"+ cUtil.getUser().getId().toString();
              break;

            case UserConfigSection.stock:
              key = key+ "_"+ cUtil.getUser().getId().toString();
              break;

            case UserConfigSection.sales:
              key = key+ " Vta_"+ cUtil.getUser().getId().toString();
              break;

            case UserConfigSection.general:
              key = key+ " Gral_"+ cUtil.getUser().getId().toString();
              break;

            case UserConfigSection.treasury:
              key = key+ " Tsr_"+ cUtil.getUser().getId().toString();
              break;

            case UserConfigSection.services:
              key = key+ " Srv_"+ cUtil.getUser().getId().toString();
              break;
          }
          return key;
        };

        var pGetNombreRama = function(tblId,  ram_ID,  bExists) { // TODO: Use of ByRef founded Private Function pGetNombreRama(ByVal tblId As Long, ByVal Ram_ID As Long, ByRef bExists As Boolean) As String
          var sqlstmt = null;
          var rs = null;

          sqlstmt = "select ram_nombre from rama,arbol  where rama.arbId = arbol.arbId  and ramId = "+ ram_ID.toString()+ " and tblId = "+ tblId.toString();

          if(!Cairo.Database.openRs(sqlstmt, rs)) { return ""; }

          if(rs.isEOF()) { return ""; }

          bExists = true;

          return valField(rs.getFields(), Cairo.Constants.RAM_NAME);
        };

        self.initialize = function() {
          try {

            //'Error al grabar la Configuración del Usuario
            c_ErrorSave = Cairo.Language.getText(2938, "");

            // **TODO:** goto found: GoTo ExitProc;
          }
          catch (ex) {
            Cairo.manageErrorEx(ex.message, "Class_Initialize", C_MODULE, "");
            // **TODO:** label found: ExitProc:;
          }
          // **TODO:** on error resume next found !!!
        };

        self.destroy = function() {
          m_dialog = null;
        };

        return self;
      };

      Edit.Controller = { getEditor: createObject };

    });

    Cairo.module("UsuarioConfig.List", function(List, Cairo, Backbone, Marionette, $, _) {
      List.Controller = {
        list: function() {

          var self = this;

          /*
           this function will be called by the tab manager every time the
           view must be created. when the tab is not visible the tab manager
           will not call this function but only make the tab visible
           */
          var createTreeDialog = function(tabId) {

            var editors = Cairo.Editors.usuarioconfigEditors || Cairo.Collections.createCollection(null);
            Cairo.Editors.usuarioconfigEditors = editors;

            // ListController properties and methods
            //
            self.entityInfo = new Backbone.Model({
              entitiesTitle: "UsuarioConfigs",
              entityName: "usuarioconfig",
              entitiesName: "usuarioconfigs"
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
                var editor = Cairo.UsuarioConfig.Edit.Controller.getEditor();
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
              if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_USUARIOCONFIG)) {
                return Cairo.Promises.resolvedPromise(false);
              }
              var apiPath = Cairo.Database.getAPIVersion();
              return Cairo.Database.destroy(apiPath + "general/usuarioconfig", id, Cairo.Constants.DELETE_FUNCTION, "UsuarioConfig").success(
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
            Cairo.LoadingMessage.show("UsuarioConfigs", "Loading usuarioconfig from Crowsoft Cairo server.");

            // create the tree region
            //
            Cairo.addRegions({ usuarioconfigTreeRegion: tabId });

            // create the dialog
            //
            Cairo.Tree.List.Controller.list(
              Cairo.Tables.USUARIOCONFIG,
              new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
              Cairo.usuarioconfigTreeRegion,
              self);

          };

          var showTreeDialog = function() {
            Cairo.Tree.List.Controller.showTreeDialog(self);
          };

          var closeTreeDialog = function() {

          }

          // create the tab
          //
          Cairo.mainTab.showTab("UsuarioConfigs", "usuarioconfigTreeRegion", "#general/usuarioconfigs", createTreeDialog, closeTreeDialog, showTreeDialog);

        }
      };
    });


  }());