(function() {
  "use strict";

  Cairo.module("Documento.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

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
      var D = Cairo.Documents;
      var U = Cairo.Util;
      var bToI = U.boolToInt;
      var bool = U.bool;
      var valField = DB.valField;
      var getValue = DB.getValue;
      var getDateValue = DB.getDateValue;
      var M = Cairo.Modal;
      var T = Dialogs.PropertyType;
      var val = U.val;
      var valEmpty = U.valEmpty;

      var C_MODULE = "cDocumento";

      var C_FACTURA_DESDE_PACKING_LIST = "facpacklst";
      var C_FACTURA_DESDE_REMITO = "facremito";
      var C_FACTURA_DESDE_PEDIDO = "facpedido";
      var C_FACTURA_DESDE_PROYECTO = "facproyecto";
      var C_FACTURA_DIRECTA = "facdirecta";
      var C_FACTURA_DESDE_ORDEN = "facorden";

      var C_PACKING_LIST_DESDE_PEDIDO = "packlstpedido";
      var C_PACKING_LIST_DESDE_REMITO = "packlstremito";
      var C_PACKING_LIST_DESDE_MANIFIESTO = "packlstmanif";
      var C_PACKING_LIST_DIRECTO = "packlstdirecto";

      var C_ORDEN_DIRECTA = "orddirecta";
      var C_ORDEN_DESDE_PEDIDO = "ordpedido";
      var C_ORDEN_DESDE_PRESUPUESTO = "ordpresu";

      var C_REPORTES = "Reportes";
      var C_FIRMAS = "Firmas";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_DESCRIP = 3;
      var K_DOCT_ID = 4;
      var K_ACTIVE = 5;
      var K_EDITAR_IMPRESOS = 6;
      var K_MON_ID = 7;
      var K_LLEVA_FIRMA = 8;
      var K_ES_RESUMEN_BCO = 802;

      var K_ES_CREDITO_BANCO = 810;
      var K_ES_VENTA_ACCION = 811;
      var K_ES_VENTA_CHEQUE = 812;
      var K_ES_COB_CHEQUE_SGR = 813;
      var K_ES_COB_CAIDA_SGR = 814;

      var K_LLEVA_FIRMA_CREDITO = 800;
      var K_LLEVA_FIRMA_PRINT_0 = 801;
      var K_CICO_ID = 9;
      var K_EMP_ID = 10;

      var K_TA_ID = 11;

      var K_REPORTES = 14;
      var K_FIRMAS = 15;

      var K_FCA_ID = 18;
      var K_CUEG_ID = 19;

      var K_TA_ID_FINAL = 20;
      var K_TA_ID_INSCRIPTO = 21;
      var K_TA_ID_EXTERNO = 22;
      var K_TA_ID_INSCRIPTOM = 37;

      var K_TA_ID_HABERES = 47;

      var K_DOC_ID_ASIENTO = 23;

      //Remito Venta/Compra
      var K_RV_DESDE_PV = 24;
      var K_RV_DESDE_OS = 400;
      var K_RC_DESDE_OC = 24;
      var K_RV_BOM = 41;
      var K_RC_DESPACHOIMPO = 44;

      var K_PV_DESDE_PRV = 42;

      //Factura
      var K_FV_DIRECTA = 25;
      var K_FV_DESDE_PV = 26;
      var K_FV_DESDE_RV = 27;
      var K_FV_DESDE_PKLST = 28;
      var K_FV_DESDE_PROY = 29;

      var K_FV_SIN_PERCEPCION = 30;

      var K_FC_DIRECTA = 25;
      var K_FC_DESDE_OC = 26;
      var K_FC_DESDE_RC = 27;

      var K_DOCG_ID = 600;

      var K_FACTURA_ELECTRONICA = 601;

      //Packing List
      var K_PKLST_DIRECTO = 29;
      var K_PKLST_DESDE_PV = 30;
      var K_PKLST_DESDE_RV = 31;
      var K_PKLST_DESDE_MFC = 32;

      var K_GENERA_REMITO = 33;
      var K_MUEVE_STOCK = 34;

      var K_DOC_ID_STOCK = 35;
      var K_DOC_ID_REMITO = 36;

      //Orden de compra
      var K_OC_DIRECTA = 38;
      var K_OC_DESDE_PC = 39;
      var K_OC_DESDE_PRC = 40;

      //Stock
      var K_ST_CONSUMO = 45;

      var K_DOC_EDIT_OBJECT = 46;

      var KI_RPTF_ID = 1;
      var KI_NOMBRE = 2;
      var KI_CSRFILE = 3;
      var KI_SUGERIDO = 5;
      var KI_COPIAS = 6;
      var KI_PRINTINNEW = 7;
      var KI_RPT_OBJ = 8;
      var KI_SUGERIDOMAIL = 9;

      var KI_DOCFR_ID = 1;
      var KI_US_ID = 3;

      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_descrip = "";
      var m_doct_id = 0;
      var m_documentoTipo = "";

      var m_cico_id = 0;
      var m_circuitoContable = "";

      var m_emp_id = 0;
      var m_empresa = "";

      var m_doc_id_Asiento = 0;
      var m_documentoAsiento = "";

      var m_doc_id_Remito = 0;
      var m_documentoRemito = "";
      var m_doc_id_Stock = 0;
      var m_documentoStock = "";

      var m_fv_SinPercepcion;
      var m_esFacturaElectronica;

      var m_fca_id = 0;
      var m_fechaControlAcceso = "";
      var m_active;
      var m_editarImpresos;
      var m_llevaFirma;
      var m_llevaFirmaCredito;
      var m_llevaFirmaPrint0;
      var m_esResumenBco;

      var m_esCreditoBanco;
      var m_esVentaAccion;
      var m_esVentaCheque;
      var m_esCobChequesgr;
      var m_esCobCaidasgr;

      var m_rvDesdePv;
      var m_rvDesdeOs;
      var m_rcDesdeOc;
      var m_rcDespachoImpo;
      var m_rvBom;
      var m_pvDesdePrv;
      var m_tipoFactura;
      var m_tipoPackingList;
      var m_tipoORDEN_COMPRA;

      var m_generaRemito;
      var m_mueveStock;

      var m_talonario = "";
      var m_ta_id = 0;

      var m_talonarioFinal = "";
      var m_ta_id_Final = 0;

      var m_talonarioInscripto = "";
      var m_ta_id_Inscripto = 0;

      var m_talonarioInscriptoM = "";
      var m_ta_id_InscriptoM = 0;

      var m_talonarioHaberes = "";
      var m_ta_id_Haberes = 0;

      var m_documentoGrupo = "";
      var m_docg_id = 0;

      var m_talonarioExterno = "";
      var m_ta_id_Externo = 0;

      var m_moneda = "";
      var m_mon_id = 0;

      var m_cuentaGrupo = "";
      var m_cueg_id = 0;

      var m_stConsumo;
      var m_object_edit = "";

      var m_editing;

      var m_dialog;
      var m_listController = null;

      var m_isNew;

      var m_branchId = 0;
      var m_treeId = 0;

      var m_copy;

      var m_itemsDeletedReportes = "";
      var m_firmasDeleted = "";

      var m_apiPath = DB.getAPIVersion();

      var emptyData = {
        firmas: [],
        reportes: []
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

        var properties = m_dialog.getProperties();
        var property = properties.item(C.DOC_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        properties.item(C.EMP_ID).setEnabled(true);

        m_dialog.showValue(properties.item(C.DOC_CODE));
        m_dialog.showValue(properties.item(C.EMP_ID));

        m_copy = true;
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

          doc.setClientTable(C.DOCUMENTO);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.SHOW_DOCUMENTS_FUNCTION, C_MODULE, "");
        }
              
        return _rtn;
      };

      self.messageEx = function(messageId, info) {
        var _rtn = null;

        switch (messageId) {
        
          case Dialogs.Message.MSG_EDIT_PERMISSIONS:

            if(m_id === NO_ID) {
              // Debe grabar el Documento para poder editar sus permisos, Documento
              return M.showInfo(getText(2559, ""), getText(1567, "")).then(function () {
                return false;
              });
            } 
            else {
              // TODO: implement this
              //
              var permisos = new cDocumentoPermiso();
              permisos.edit(m_id, true);
            }

            _rtn = true;
            break;

          case Dialogs.Message.MSG_SHOW_EDIT_PERMISSIONS:

            _rtn = Dialogs.Message.MSG_SHOW_EDIT_PERMISSIONS;
            break;

          default:

            _rtn = true;
            break;
        }
      
        return P.resolvedPromise(_rtn);
      };

      self.discardChanges = function() {
        return P.resolvedPromise(refreshCollection());
      };

      self.propertyChange = function(key) {

        switch (key) {
          case K_MUEVE_STOCK:
            var properties = m_dialog.getProperties();
            if(val(properties.item(C.DOC_MUEVE_STOCK).getValue())) {
              properties.item(C.DOC_ID_STOCK).setEnabled(true);
            }
            break;

          case K_GENERA_REMITO:
            var properties = m_dialog.getProperties();
            if(val(properties.item(C.DOC_GENERA_REMITO).getValue())) {
              properties.item(C.DOC_ID_REMITO).setEnabled(true);
            }
            break;

          case K_EMP_ID:
            pChangeEmpresa();
            break;
        }

        return P.resolvedPromise(false);
      };

      self.save = function() {

        var bIsNew = m_id === Cairo.Constants.NEW_ID;
        var lastId = m_id;

        var register = new DB.Register();
        var fields = register.getFields();
        
        register.setFieldId(C.DOC_ID);
        register.setTable(C.DOCUMENTO);

        register.setPath(m_apiPath + "general/documento");

        if(m_copy) {
          register.setId(Cairo.Constants.NEW_ID);
        } 
        else {
          register.setId(m_id);
        }

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {

          var property = m_dialog.getProperties().item(_i);
          
          switch (property.getKey()) {
            case K_NAME:
              fields.add(C.DOC_NAME, property.getValue(), Types.text);
              break;

            case K_CODE:
              fields.add(C.DOC_CODE, property.getValue(), Types.text);
              break;

            case K_DESCRIP:
              fields.add(C.DOC_DESCRIP, property.getValue(), Types.text);
              break;

            case K_CICO_ID:
              fields.add(C.CICO_ID, property.getSelectId(), Types.id);
              break;

            case K_EMP_ID:
              fields.add(C.EMP_ID, property.getSelectId(), Types.id);
              break;

            case K_DOCT_ID:
              fields.add(C.DOCT_ID, property.getSelectId(), Types.id);
              break;

            case K_FCA_ID:
              fields.add(C.FCA_ID, property.getSelectId(), Types.id);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, getActive(val(property.getValue())), Types.boolean);
              break;

            case K_EDITAR_IMPRESOS:
              fields.add(C.DOC_EDITAR_IMPRESOS, val(property.getValue()), Types.boolean);
              break;

            case K_LLEVA_FIRMA:
              fields.add(C.DOC_LLEVA_FIRMA, val(property.getValue()), Types.boolean);
              break;

            case K_LLEVA_FIRMA_CREDITO:
              fields.add(C.DOC_LLEVA_FIRMA_CREDITO, val(property.getValue()), Types.boolean);
              break;

            case K_LLEVA_FIRMA_PRINT_0:
              fields.add(C.DOC_LLEVA_FIRMA_PRINT0, val(property.getValue()), Types.boolean);
              break;

            case K_DOC_EDIT_OBJECT:
              fields.add(C.DOC_OBJECT_EDIT, property.getValue(), Types.text);
              break;
          }
        }

        if(m_id !== Cairo.Constants.NEW_ID) { 
          saveDocEx(register); 
        }

        if(!bIsNew) {
          saveItemsReportes(register);
          saveSignatures(register);
        }

        var p = savePermisos1(lastId, register)
          .then(function() {
            return DB.saveTransaction(
              register,
              false,
              C.PR_CODE,
              Cairo.Constants.CLIENT_SAVE_FUNCTION,
              C_MODULE,
              getText(2861, "") // Error al grabar el Documento
            );
          })
          .then(function(result) {
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
                    savePermisos2(bIsNew);
                  }
                  m_isNew = false;
                  return success;
                }
              );
            }
            else {
              return false;
            }
          });

        return p;
      };

      var getActive = function(value) {

        // if not active just return
        // 
        if(!value) { return false; }

        // if it is not valid or is new inform user the document will be save as inactive
        // 
        if(!validate(true) || m_id === NO_ID) {
          return M.showInfoWithFalse(getText(3527, ""));
          // Este documento quedara inactivo por que posee campos obligatorios sin completar.
          // Para poder usuarlo debe completar estos campos y volver a grabar el documento.
        }

        // if we reach this lines is because the document is active
        // 
        return true;
      };

      // TODO move this to backend
      var pSavePrestacion = function(id) {
        var sqlstmt = null;
        sqlstmt = "sp_DocumentoSavePrestacion "+ id.toString();
        return DB.execute(sqlstmt);
      };

      var saveSignatures = function(mainRegister) {
        if(m_llevaFirma || m_llevaFirmaCredito || m_llevaFirmaPrint0) {

          var transaction = DB.createTransaction();

          transaction.setTable(C.DOCUMENTO_FIRMA);
  
          var property = m_dialog.getProperties().item(C_FIRMAS);

          var rows = property.getGrid().getRows();
          var _count = rows.size();
          for(var _i = 0; _i < _count; _i++) {

            var row = rows.item(_i);

            var register = new DB.Register();

            var fields = register.getFields();
            register.setFieldId(C.DOCFR_ID);
            register.setId(Cairo.Constants.NEW_ID);
  
            var _countj = row.size();
            for(var _j = 0; _j < _countj; _j++) {

              var cell = row.item(_j);

              switch (cell.getKey()) {
                case KI_DOCFR_ID:
                  if(m_copy) {
                    fields.add(C.DOCFR_ID, Cairo.Constants.NEW_ID, Types.integer);
                  }
                  else {
                    fields.add(C.DOCFR_ID, val(cell.getValue()), Types.integer);
                  }
                  break;

                case KI_US_ID:
                  fields.add(C.US_ID, cell.getId(), Types.id);
                  break;
              }
            }

            fields.add(C.DOC_ID, m_id, Types.id);

            transaction.addRegister(register);
          }

          if(m_firmasDeleted !== "" && !m_copy) {
            transaction.setDeletedList(m_firmasDeleted);
          }
        }

        mainRegister.addTransaction(transaction);
      };

      var saveDocEx = function(register) { 

        var fields = register.getFields();

        var properties = m_dialog.getProperties();
        var _count = properties.size();
        var property = null;
        var bMueveStock = false;
        var bGeneraRto = false;
        var docIdRemito = NO_ID;
        var docIdStock = NO_ID;

        switch (m_doct_id) {
          case D.Types.FACTURA_VENTA:
          case D.Types.NOTA_CREDITO_VENTA:
          case D.Types.NOTA_DEBITO_VENTA:
            
            for (var _i = 0; _i < _count; _i++) {
              property = properties.item(_i);
              switch (property.getKey()) {
                case K_DOC_ID_ASIENTO:
                  fields.add(C.DOC_ID_ASIENTO, property.getSelectId(), Types.id);
                  break;

                case K_GENERA_REMITO:
                  bGeneraRto = val(property.getValue());
                  fields.add(C.DOC_GENERA_REMITO, bGeneraRto, Types.boolean);
                  break;

                case K_MUEVE_STOCK:
                  bMueveStock = val(property.getValue());
                  fields.add(C.DOC_MUEVE_STOCK, bMueveStock, Types.boolean);
                  break;

                case K_DOC_ID_REMITO:
                  docIdRemito = property.getSelectId();
                  break;

                case K_DOC_ID_STOCK:
                  docIdStock = property.getSelectId();
                  break;

                case K_MON_ID:
                  fields.add(C.MON_ID, property.getSelectId(), Types.id);
                  break;

                case K_TA_ID_FINAL:
                  fields.add(C.TA_ID_FINAL, property.getSelectId(), Types.id);
                  break;

                case K_TA_ID_INSCRIPTO:
                  fields.add(C.TA_ID_INSCRIPTO, property.getSelectId(), Types.id);
                  break;

                case K_TA_ID_EXTERNO:
                  fields.add(C.TA_ID_EXTERNO, property.getSelectId(), Types.id);
                  break;

                case K_CUEG_ID:
                  fields.add(C.CUEG_ID, property.getSelectId(), Types.id);
                  break;

                case K_FV_DESDE_PKLST:
                  if(val(property.getValue()) !== 0) {
                    fields.add(C.DOC_TIPO_FACTURA, D.InvoiceWizardType.packingList, Types.long);
                  }
                  break;

                case K_FV_DESDE_PV:
                  if(val(property.getValue()) !== 0) {
                    fields.add(C.DOC_TIPO_FACTURA, D.InvoiceWizardType.pedido, Types.long);
                  }
                  break;

                case K_FV_DESDE_RV:
                  if(val(property.getValue()) !== 0) {
                    fields.add(C.DOC_TIPO_FACTURA, D.InvoiceWizardType.remito, Types.long);
                  }
                  break;

                case K_FV_DIRECTA:
                  if(val(property.getValue()) !== 0) {
                    fields.add(C.DOC_TIPO_FACTURA, D.InvoiceWizardType.directa, Types.long);
                  }
                  break;

                case K_FV_DESDE_PROY:
                  if(val(property.getValue()) !== 0) {
                    fields.add(C.DOC_TIPO_FACTURA, D.InvoiceWizardType.proyecto, Types.long);
                  }
                  break;

                case K_FACTURA_ELECTRONICA:
                  fields.add(C.DOCES_FACTURA_ELECTRONICA, property.getValue(), Types.boolean);
                  break;

                case K_FV_SIN_PERCEPCION:
                  fields.add(C.DOC_FV_SIN_PERCEPCION, property.getValue(), Types.boolean);
                  break;

                case K_ES_CREDITO_BANCO:
                  fields.add(C.DOC_ES_CREDITO_BANCO, property.getValue(), Types.boolean);
                  break;

                case K_ES_VENTA_ACCION:
                  fields.add(C.DOC_ES_VENTA_ACCION, property.getValue(), Types.boolean);
                  break;

                case K_ES_VENTA_CHEQUE:
                  fields.add(C.DOC_ES_VENTA_CHEQUE, property.getValue(), Types.boolean);
                  break;
              }
            }

            if(!bGeneraRto) { docIdRemito = NO_ID; }
            if(!bMueveStock) { docIdStock = NO_ID; }
            fields.add(C.DOC_ID_REMITO, docIdRemito, Types.id);
            fields.add(C.DOC_ID_STOCK, docIdStock, Types.id);

            break;

          case D.Types.FACTURA_COMPRA:
          case D.Types.NOTA_CREDITO_COMPRA:
          case D.Types.NOTA_DEBITO_COMPRA:
            
            for (var _i = 0; _i < _count; _i++) {
              property = properties.item(_i);
              switch (property.getKey()) {
                case K_DOC_ID_ASIENTO:
                  fields.add(C.DOC_ID_ASIENTO, property.getSelectId(), Types.id);
                  break;

                case K_GENERA_REMITO:
                  bGeneraRto = val(property.getValue());
                  fields.add(C.DOC_GENERA_REMITO, bGeneraRto, Types.boolean);
                  break;

                case K_MUEVE_STOCK:
                  bMueveStock = val(property.getValue());
                  fields.add(C.DOC_MUEVE_STOCK, bMueveStock, Types.boolean);
                  break;

                case K_DOC_ID_REMITO:
                  docIdRemito = property.getSelectId();
                  break;

                case K_DOC_ID_STOCK:
                  docIdStock = property.getSelectId();
                  break;

                case K_MON_ID:
                  fields.add(C.MON_ID, property.getSelectId(), Types.id);
                  break;

                case K_TA_ID_FINAL:
                  fields.add(C.TA_ID_FINAL, property.getSelectId(), Types.id);
                  break;

                case K_TA_ID_INSCRIPTO:
                  fields.add(C.TA_ID_INSCRIPTO, property.getSelectId(), Types.id);
                  break;

                case K_TA_ID_EXTERNO:
                  fields.add(C.TA_ID_EXTERNO, property.getSelectId(), Types.id);
                  break;

                case K_TA_ID_INSCRIPTOM:
                  fields.add(C.TA_ID_INSCRIPTO_M, property.getSelectId(), Types.id);
                  break;

                case K_CUEG_ID:
                  fields.add(C.CUEG_ID, property.getSelectId(), Types.id);
                  break;

                case K_FC_DESDE_OC:
                  if(val(property.getValue()) !== 0) {
                    fields.add(C.DOC_TIPO_FACTURA, D.InvoiceWizardType.orden, Types.long);
                  }
                  break;

                case K_FC_DESDE_RC:
                  if(val(property.getValue()) !== 0) {
                    fields.add(C.DOC_TIPO_FACTURA, D.InvoiceWizardType.remito, Types.long);
                  }
                  break;

                case K_FC_DIRECTA:
                  if(val(property.getValue()) !== 0) {
                    fields.add(C.DOC_TIPO_FACTURA, D.InvoiceWizardType.directa, Types.long);
                  }
                  break;

                case K_DOCG_ID:
                  fields.add(C.DOCG_ID, property.getSelectId(), Types.id);
                  break;

                case K_ES_RESUMEN_BCO:
                  fields.add(C.DOC_ES_RESUMEN_BANCO, val(property.getValue()), Types.boolean);
                  break;
              }
            }

            if(!bGeneraRto) { docIdRemito = NO_ID; }
            if(!bMueveStock) { docIdStock = NO_ID; }
            fields.add(C.DOC_ID_REMITO, docIdRemito, Types.id);
            fields.add(C.DOC_ID_STOCK, docIdStock, Types.id);

            break;

          case D.Types.REMITO_VENTA:
          case D.Types.DEVOLUCION_REMITO_VTA:

            for (var _i = 0; _i < _count; _i++) {
              property = properties.item(_i);
              switch (property.getKey()) {
                case K_MON_ID:
                  fields.add(C.MON_ID, property.getSelectId(), Types.id);
                  break;

                case K_TA_ID:
                  fields.add(C.TA_ID, property.getSelectId(), Types.id);
                  break;

                case K_RV_DESDE_PV:
                  fields.add(C.DOC_RV_DESDE_PV, val(property.getValue()), Types.boolean);
                  break;

                case K_RV_DESDE_OS:
                  fields.add(C.DOC_RV_DESDE_OS, val(property.getValue()), Types.boolean);
                  break;

                case K_DOC_ID_STOCK:
                  fields.add(C.DOC_ID_STOCK, property.getSelectId(), Types.id);
                  break;

                case K_MUEVE_STOCK:
                  fields.add(C.DOC_MUEVE_STOCK, val(property.getValue()), Types.boolean);
                  break;

                case K_RV_BOM:
                  fields.add(C.DOC_RV_BOM, val(property.getValue()), Types.boolean);
                  break;
              }
            }
            break;

          case D.Types.LIQUIDACION:

            for (var _i = 0; _i < _count; _i++) {
              property = properties.item(_i);
              switch (property.getKey()) {
                case K_MON_ID:
                  fields.add(C.MON_ID, property.getSelectId(), Types.id);
                  break;

                case K_TA_ID:
                  fields.add(C.TA_ID, property.getSelectId(), Types.id);
                  break;

                case K_TA_ID_HABERES:
                  fields.add(C.TA_ID_HABERES, property.getSelectId(), Types.id);
                  break;

                case K_DOC_ID_ASIENTO:
                  fields.add(C.DOC_ID_ASIENTO, property.getSelectId(), Types.id);
                  break;
              }
            }
            break;

          case D.Types.MOVIMIENTO_FONDO:

            for (var _i = 0; _i < _count; _i++) {
              property = properties.item(_i);
              switch (property.getKey()) {
                case K_MON_ID:
                  fields.add(C.MON_ID, property.getSelectId(), Types.id);
                  break;

                case K_TA_ID:
                  fields.add(C.TA_ID, property.getSelectId(), Types.id);
                  break;

                case K_DOC_ID_ASIENTO:
                  fields.add(C.DOC_ID_ASIENTO, property.getSelectId(), Types.id);
                  break;
              }
            }
            break;

          case D.Types.DEPOSITO_BANCO:
          case D.Types.DEPOSITO_CUPON:
          case D.Types.RESOLUCION_CUPON:

            for (var _i = 0; _i < _count; _i++) {
              property = properties.item(_i);
              switch (property.getKey()) {
                case K_TA_ID:
                  fields.add(C.TA_ID, property.getSelectId(), Types.id);
                  break;

                case K_DOC_ID_ASIENTO:
                  fields.add(C.DOC_ID_ASIENTO, property.getSelectId(), Types.id);
                  break;
              }
            }
            break;

          case D.Types.PERMISO_EMBARQUE:

            for (var _i = 0; _i < _count; _i++) {
              property = properties.item(_i);
              switch (property.getKey()) {
                case K_MON_ID:
                  fields.add(C.MON_ID, property.getSelectId(), Types.id);
                  break;
              }
            }
            break;

          case D.Types.MANIFIESTO_CARGA:

            for (var _i = 0; _i < _count; _i++) {
              property = properties.item(_i);
              switch (property.getKey()) {
                case K_TA_ID:
                  fields.add(C.TA_ID, property.getSelectId(), Types.id);
                  break;
              }
            }
            break;

          case D.Types.PACKING_LIST:
          case D.Types.PACKING_LIST_DEVOLUCION:

            for (var _i = 0; _i < _count; _i++) {
              property = properties.item(_i);
              switch (property.getKey()) {
                case K_TA_ID:
                  fields.add(C.TA_ID, property.getSelectId(), Types.id);
                  break;

                case K_MON_ID:
                  fields.add(C.MON_ID, property.getSelectId(), Types.id);
                  break;

                case K_PKLST_DESDE_MFC:
                  if(val(property.getValue()) !== 0) {
                    fields.add(C.DOC_TIPO_PACKING_LIST, Cairo.Documents.PackingListWizardType.manifiesto, Types.long);
                  }
                  break;

                case K_PKLST_DESDE_PV:
                  if(val(property.getValue()) !== 0) {
                    fields.add(C.DOC_TIPO_PACKING_LIST, Cairo.Documents.PackingListWizardType.pedido, Types.long);
                  }
                  break;

                case K_PKLST_DESDE_RV:
                  if(val(property.getValue()) !== 0) {
                    fields.add(C.DOC_TIPO_PACKING_LIST, Cairo.Documents.PackingListWizardType.remito, Types.long);
                  }
                  break;

                case K_PKLST_DIRECTO:
                  if(val(property.getValue()) !== 0) {
                    fields.add(C.DOC_TIPO_PACKING_LIST, Cairo.Documents.PackingListWizardType.directo, Types.long);
                  }
                  break;
              }
            }
            break;

          case D.Types.ORDEN_SERVICIO:

            for (var _i = 0; _i < _count; _i++) {
              property = properties.item(_i);
              switch (property.getKey()) {
                case K_MON_ID:
                  fields.add(C.MON_ID, property.getSelectId(), Types.id);
                  break;

                case K_TA_ID:
                  fields.add(C.TA_ID, property.getSelectId(), Types.id);
                  break;

                case K_DOC_ID_STOCK:
                  fields.add(C.DOC_ID_STOCK, property.getSelectId(), Types.id);
                  break;

                case K_MUEVE_STOCK:
                  fields.add(C.DOC_MUEVE_STOCK, val(property.getValue()), Types.boolean);
                  break;
              }
            }
            break;

          case D.Types.REMITO_COMPRA:
          case D.Types.DEVOLUCION_REMITO_CPRA:

            for (var _i = 0; _i < _count; _i++) {
              property = properties.item(_i);
              switch (property.getKey()) {
                case K_MON_ID:
                  fields.add(C.MON_ID, property.getSelectId(), Types.id);
                  break;

                case K_TA_ID:
                  fields.add(C.TA_ID, property.getSelectId(), Types.id);
                  break;

                case K_DOC_ID_STOCK:
                  fields.add(C.DOC_ID_STOCK, property.getSelectId(), Types.id);
                  break;

                case K_RC_DESDE_OC:
                  fields.add(C.DOC_RC_DESDE_OC, val(property.getValue()), Types.boolean);
                  break;

                case K_RC_DESPACHOIMPO:
                  fields.add(C.DOC_RC_DESPACHO_IMPO, val(property.getValue()), Types.boolean);
                  break;

                case K_MUEVE_STOCK:
                  fields.add(C.DOC_MUEVE_STOCK, val(property.getValue()), Types.boolean);
                  break;
              }
            }
            break;

          case D.Types.IMPORTACION_TEMP:

            for (var _i = 0; _i < _count; _i++) {
              property = properties.item(_i);
              switch (property.getKey()) {
                case K_MON_ID:
                  fields.add(C.MON_ID, property.getSelectId(), Types.id);
                  break;

                case K_TA_ID:
                  fields.add(C.TA_ID, property.getSelectId(), Types.id);
                  break;

                case K_DOC_ID_STOCK:
                  fields.add(C.DOC_ID_STOCK, property.getSelectId(), Types.id);
                  break;

                case K_MUEVE_STOCK:
                  fields.add(C.DOC_MUEVE_STOCK, val(property.getValue()), Types.boolean);
                  break;
              }
            }
            break;

          case D.Types.PEDIDO_VENTA:
          case D.Types.DEVOLUCION_PEDIDO_VTA:

            for (var _i = 0; _i < _count; _i++) {
              property = properties.item(_i);
              switch (property.getKey()) {
                case K_TA_ID:
                  fields.add(C.TA_ID, property.getSelectId(), Types.id);
                  break;

                case K_MON_ID:
                  fields.add(C.MON_ID, property.getSelectId(), Types.id);
                  break;

                case K_PV_DESDE_PRV:
                  fields.add(C.DOC_PV_DESDE_PRV, val(property.getValue()), Types.boolean);
                  break;
              }
            }
            break;

          case D.Types.PEDIDO_COMPRA:
          case D.Types.DEVOLUCION_PEDIDO_CPRA:
          case D.Types.PRESUPUESTO_VENTA:
          case D.Types.DEVOLUCION_PRESU_VTA:
          case D.Types.PRESUPUESTO_COMPRA:
          case D.Types.DEVOLUCION_PRESU_CPRA:
          case D.Types.COTIZACION_COMPRA:
          case D.Types.DEVOLUCION_COTIZACION_CPRA:

            for (var _i = 0; _i < _count; _i++) {
              property = properties.item(_i);
              switch (property.getKey()) {
                case K_TA_ID:
                  fields.add(C.TA_ID, property.getSelectId(), Types.id);
                  break;

                case K_MON_ID:
                  fields.add(C.MON_ID, property.getSelectId(), Types.id);
                  break;
              }
            }
            break;

          case D.Types.ORDEN_COMPRA:
          case D.Types.DEVOLUCION_ORDEN_CPRA:

            for (var _i = 0; _i < _count; _i++) {
              property = properties.item(_i);
              switch (property.getKey()) {
                case K_TA_ID:
                  fields.add(C.TA_ID, property.getSelectId(), Types.id);
                  break;

                case K_MON_ID:
                  fields.add(C.MON_ID, property.getSelectId(), Types.id);
                  break;

                case K_OC_DESDE_PC:
                  if(val(property.getValue()) !== 0) {
                    fields.add(C.DOC_TIPO_ORDEN_COMPRA, Cairo.Documents.OrderWizardType.pedido, Types.long);
                  }
                  break;

                case K_OC_DESDE_PRC:
                  if(val(property.getValue()) !== 0) {
                    fields.add(C.DOC_TIPO_ORDEN_COMPRA, Cairo.Documents.OrderWizardType.presupuesto, Types.long);
                  }
                  break;

                case K_OC_DIRECTA:
                  if(val(property.getValue()) !== 0) {
                    fields.add(C.DOC_TIPO_ORDEN_COMPRA, Cairo.Documents.OrderWizardType.directa, Types.long);
                  }
                  break;
              }
            }
            break;

          case D.Types.COBRANZA:

            for (var _i = 0; _i < _count; _i++) {
              property = properties.item(_i);
              switch (property.getKey()) {
                case K_DOC_ID_ASIENTO:
                  fields.add(C.DOC_ID_ASIENTO, property.getSelectId(), Types.id);
                  break;

                case K_TA_ID:
                  fields.add(C.TA_ID, property.getSelectId(), Types.id);
                  break;

                case K_ES_COB_CHEQUE_SGR:
                  fields.add(C.DOC_ES_COB_CHEQUE_SGR, property.getValue(), Types.boolean);
                  break;

                case K_ES_COB_CAIDA_SGR:
                  fields.add(C.DOC_ES_COB_CAIDA_SGR, property.getValue(), Types.boolean);
                  break;
              }
            }
            break;

          case D.Types.TRANSFERENCIA_STOCK                            :

            for (var _i = 0; _i < _count; _i++) {
              property = properties.item(_i);
              switch (property.getKey()) {
                case K_TA_ID:
                  fields.add(C.TA_ID, property.getSelectId(), Types.id);
                  break;

                case K_ST_CONSUMO:
                  fields.add(C.DOC_ST_CONSUMO, val(property.getValue()), Types.boolean);
                  break;
              }
            }
            break;

          case D.Types.PARTE_REPARACION:

            for (var _i = 0; _i < _count; _i++) {
              property = properties.item(_i);
              switch (property.getKey()) {
                case K_TA_ID:
                  fields.add(C.TA_ID, property.getSelectId(), Types.id);
                  break;

                case K_MON_ID:
                  fields.add(C.MON_ID, property.getSelectId(), Types.id);
                  break;

                case K_DOC_ID_STOCK:
                  fields.add(C.DOC_ID_STOCK, property.getSelectId(), Types.id);
                  break;
              }
            }
            break;

          case D.Types.RECUENTO_STOCK:
          case D.Types.PARTE_PROD_KIT:
          case D.Types.PARTE_DESARME_KIT:
          case D.Types.STOCK_PROVEEDOR:
          case D.Types.STOCK_CLIENTE:

            for (var _i = 0; _i < _count; _i++) {
              property = properties.item(_i);
              switch (property.getKey()) {
                case K_TA_ID:
                  fields.add(C.TA_ID, property.getSelectId(), Types.id);
                  break;

                case K_DOC_ID_STOCK:
                  fields.add(C.DOC_ID_STOCK, property.getSelectId(), Types.id);
                  break;
              }
            }
            break;

          case D.Types.ORDEN_PROD_KIT:

            for (var _i = 0; _i < _count; _i++) {
              property = properties.item(_i);
              switch (property.getKey()) {
                case K_TA_ID:
                  fields.add(C.TA_ID, property.getSelectId(), Types.id);
                  break;
              }
            }
            break;

          case D.Types.ASIENTO_CONTABLE                              :

            for (var _i = 0; _i < _count; _i++) {
              property = properties.item(_i);
              switch (property.getKey()) {
                case K_TA_ID:
                  fields.add(C.TA_ID, property.getSelectId(), Types.id);
                  break;
              }
            }
            break;

          case D.Types.ORDEN_PAGO                              :

            for (var _i = 0; _i < _count; _i++) {
              property = properties.item(_i);
              switch (property.getKey()) {
                case K_DOC_ID_ASIENTO:
                  fields.add(C.DOC_ID_ASIENTO, property.getSelectId(), Types.id);
                  break;

                case K_TA_ID:
                  fields.add(C.TA_ID, property.getSelectId(), Types.id);
                  break;
              }
            }
            break;

          case D.Types.PRESUPUESTO_ENVIO:

            for (var _i = 0; _i < _count; _i++) {
              property = properties.item(_i);
              switch (property.getKey()) {
                case K_TA_ID:
                  fields.add(C.TA_ID, property.getSelectId(), Types.id);
                  break;

                case K_MON_ID:
                  fields.add(C.MON_ID, property.getSelectId(), Types.id);
                  break;
              }
            }
            break;
        }
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
        return "#general/documento/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "documento" + id;
      };

      self.getTitle = function() {
        return getText(1611, ""); // 'Documentos
      };

      self.validate = function() {
        return validate(false);
      };

      var validate = function(bSilent) {
        var property = null;

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {

          property = m_dialog.getProperties().item(_i);

          switch (property.getKey()) {
            case K_NAME:
              if(valEmpty(property.getValue(), Types.text)) {
                if(!bSilent) { return M.showInfoWithFalse(getText(1007, "")); } // Debe indicar un nombre
              }
              break;

            case K_CODE:
              if(valEmpty(property.getValue(), Types.text)) {
                if(!bSilent) { return M.showInfoWithFalse(getText(1008, "")); } // Debe indicar un código
              }
              break;

            case K_EMP_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                if(!bSilent) { return M.showInfoWithFalse(getText(1129, "")); } // Debe indicar una empresa
              }
              break;

            case K_CICO_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                if(!bSilent) { return M.showInfoWithFalse(getText(1974, "")); } // Debe indicar un circuito contable
              }
              break;

            case K_DOCT_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                if(!bSilent) { return M.showInfoWithFalse(getText(2560, "")); } // Debe indicar un Tipo de Documento
              }
              break;

            case K_FCA_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                if(!bSilent) { return M.showInfoWithFalse(getText(3526, "")); } // Debe indicar una fecha de control de acceso
              }
              break;
          }
        }

        return validateEx(bSilent);
      };

      var validateEx = function(bSilent) {
        var property = null;
        var bGeneraRto = null;
        var bDocRto = null;
        var bGeneraStock = null;
        var bDocStock = null;

        switch (m_doct_id) {
          case D.Types.FACTURA_VENTA:
          case D.Types.NOTA_CREDITO_VENTA:
          case D.Types.NOTA_DEBITO_VENTA:
            
            var _count = m_dialog.getProperties().size();
            for (var _i = 0; _i < _count; _i++) {
              
              property = m_dialog.getProperties().item(_i);
              
              switch (property.getKey()) {

                case K_TA_ID_EXTERNO:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(2561, "")); } // Debe indicar un Talonario Externo
                  }
                  break;

                case K_TA_ID_FINAL:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(2562, "")); } // Debe indicar un Talonario Exento/Mono/C.F.
                  }
                  break;

                case K_TA_ID_INSCRIPTO:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(2563, "")); } // Debe indicar un Talonario Inscripto
                  }
                  break;

                case K_DOC_ID_ASIENTO:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(2564, "")); } // Debe indicar un Documento para guardar el Asiento Contable
                  }
                  break;

                case K_GENERA_REMITO:
                  bGeneraRto = val(property.getValue());
                  break;

                case K_MUEVE_STOCK:
                  bGeneraStock = val(property.getValue());
                  break;

                case K_DOC_ID_REMITO:
                  bDocRto = !valEmpty(property.getSelectId(), Types.id);
                  break;

                case K_DOC_ID_STOCK:
                  bDocStock = !valEmpty(property.getSelectId(), Types.id);
                  break;

                case K_MON_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1108, "")); } // Debe indicar una moneda
                  }
                  break;

                case K_CUEG_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(2565, "")); } // Debe indicar un Grupo de Cuentas
                  }
                  break;
              }
            }
            break;

          case D.Types.FACTURA_COMPRA:
          case D.Types.NOTA_CREDITO_COMPRA:
          case D.Types.NOTA_DEBITO_COMPRA:

            var _count = m_dialog.getProperties().size();
            for (var _i = 0; _i < _count; _i++) {

              property = m_dialog.getProperties().item(_i);

              switch (property.getKey()) {

                case K_TA_ID_EXTERNO:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(2561, "")); } // Debe indicar un talonario externo
                  }
                  break;

                case K_TA_ID_FINAL:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(2562, "")); } // Debe indicar un talonario exento/mono/C.F.
                  }
                  break;

                case K_TA_ID_INSCRIPTO:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(2563, "")); } // Debe indicar un talonario inscripto
                  }
                  break;

                case K_TA_ID_INSCRIPTOM:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(2566, "")); } // Debe indicar un Talonario Inscripto M
                  }
                  break;

                case K_DOC_ID_ASIENTO:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(2564, "")); } // Debe indicar un documento para guardar el asiento contable
                  }
                  break;

                case K_MON_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1108, "")); } // Debe indicar una moneda
                  }
                  break;
              }
            }
            break;

          case D.Types.REMITO_VENTA:
          case D.Types.DEVOLUCION_REMITO_VTA:

            var _count = m_dialog.getProperties().size();
            for (var _i = 0; _i < _count; _i++) {

              property = m_dialog.getProperties().item(_i);
              switch (property.getKey()) {

                case K_TA_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1250, "")); } // Debe indicar un talonario
                  }
                  break;

                case K_MON_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1108, "")); } // Debe indicar una moneda
                  }
                  break;
              }
            }
            break;

          case D.Types.PERMISO_EMBARQUE:
            
            var _count = m_dialog.getProperties().size();
            for (var _i = 0; _i < _count; _i++) {
            
              property = m_dialog.getProperties().item(_i);
            
              switch (property.getKey()) {

                case K_MON_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1108, "")); } // Debe indicar una moneda
                  }
                  break;
              }
            }
            break;

          case D.Types.MANIFIESTO_CARGA:
            
            var _count = m_dialog.getProperties().size();
            for (var _i = 0; _i < _count; _i++) {
            
              property = m_dialog.getProperties().item(_i);
            
              switch (property.getKey()) {

                case K_TA_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1250, "")); } // Debe indicar un talonario
                  }
                  break;
              }
            }
            break;

          case D.Types.PACKING_LIST:
          case D.Types.PACKING_LIST_DEVOLUCION:
            
            var _count = m_dialog.getProperties().size();
            for (var _i = 0; _i < _count; _i++) {
            
              property = m_dialog.getProperties().item(_i);
            
              switch (property.getKey()) {

                case K_TA_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1250, "")); } // Debe indicar un talonario
                  }
                  break;
              }
            }
            break;

          case D.Types.ORDEN_SERVICIO:

            var _count = m_dialog.getProperties().size();
            for (var _i = 0; _i < _count; _i++) {

              property = m_dialog.getProperties().item(_i);

              switch (property.getKey()) {

                case K_TA_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1250, "")); } // Debe indicar un talonario
                  }
                  break;

                case K_MON_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1108, "")); } // Debe indicar una moneda
                  }
                  break;
              }
            }
            break;

          case D.Types.REMITO_COMPRA:
          case D.Types.DEVOLUCION_REMITO_CPRA:

            var _count = m_dialog.getProperties().size();
            for (var _i = 0; _i < _count; _i++) {

              property = m_dialog.getProperties().item(_i);

              switch (property.getKey()) {

                case K_TA_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1250, "")); } // Debe indicar un talonario
                  }
                  break;

                case K_MON_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1108, "")); } // Debe indicar una moneda
                  }
                  break;
              }
            }
            break;

          case D.Types.IMPORTACION_TEMP:

            bGeneraStock = true;

            var _count = m_dialog.getProperties().size();
            for (var _i = 0; _i < _count; _i++) {

              property = m_dialog.getProperties().item(_i);

              switch (property.getKey()) {

                case K_TA_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1250, "")); } // Debe indicar un talonario
                  }
                  break;

                case K_MON_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1108, "")); } // Debe indicar una moneda
                  }
                  break;
              }
            }
            break;

          case D.Types.PEDIDO_VENTA:
          case D.Types.DEVOLUCION_PEDIDO_VTA:
          case D.Types.PEDIDO_COMPRA:
          case D.Types.DEVOLUCION_PEDIDO_CPRA:
          case D.Types.PRESUPUESTO_VENTA:
          case D.Types.DEVOLUCION_PRESU_VTA:
          case D.Types.PRESUPUESTO_COMPRA:
          case D.Types.DEVOLUCION_PRESU_CPRA:
          case D.Types.COTIZACION_COMPRA:
          case D.Types.DEVOLUCION_COTIZACION_CPRA:
          case D.Types.ORDEN_COMPRA:
          case D.Types.DEVOLUCION_ORDEN_CPRA:

            var _count = m_dialog.getProperties().size();
            for (var _i = 0; _i < _count; _i++) {

              property = m_dialog.getProperties().item(_i);

              switch (property.getKey()) {

                case K_TA_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1250, "")); } // Debe indicar un talonario
                  }
                  break;

                case K_MON_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1108, "")); } // Debe indicar una moneda
                  }
                  break;
              }
            }
            break;

          case D.Types.COBRANZA:

            var _count = m_dialog.getProperties().size();
            for (var _i = 0; _i < _count; _i++) {

              property = m_dialog.getProperties().item(_i);

              switch (property.getKey()) {

                case K_TA_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1250, "")); } // Debe indicar un talonario
                  }
                  break;

                case K_DOC_ID_ASIENTO:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(2564, "")); } // Debe indicar un documento para guardar el asiento contable
                  }
                  break;
              }
            }
            break;

          case D.Types.TRASFERENCIASTOCK:

            var _count = m_dialog.getProperties().size();
            for (var _i = 0; _i < _count; _i++) {

              property = m_dialog.getProperties().item(_i);

              switch (property.getKey()) {

                case K_TA_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1250, "")); } // Debe indicar un talonario
                  }
                  break;
              }
            }
            break;

          case D.Types.PARTE_REPARACION:

            var _count = m_dialog.getProperties().size();
            for (var _i = 0; _i < _count; _i++) {

              property = m_dialog.getProperties().item(_i);

              switch (property.getKey()) {

                case K_TA_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1250, "")); } // Debe indicar un talonario
                  }
                  break;

                case K_DOC_ID_STOCK:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(2567, "")); } // Debe indicar un Documento para generar el Movimiento de Stock
                  }
                  break;

                case K_MON_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1108, "")); } // Debe indicar una moneda
                  }
                  break;
              }
            }
            break;

          case D.Types.ORDENPRODKIT:

            var _count = m_dialog.getProperties().size();
            for (var _i = 0; _i < _count; _i++) {

              property = m_dialog.getProperties().item(_i);

              switch (property.getKey()) {

                case K_TA_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1250, "")); } // Debe indicar un talonario
                  }
                  break;
              }
            }
            break;

          case D.Types.RECUENTO_STOCK:
          case D.Types.PARTE_PROD_KIT:
          case D.Types.PARTE_DESARME_KIT:
          case D.Types.STOCK_PROVEEDOR:
          case D.Types.STOCK_CLIENTE:

            var _count = m_dialog.getProperties().size();
            for (var _i = 0; _i < _count; _i++) {
              property = m_dialog.getProperties().item(_i);
              switch (property.getKey()) {

                case K_TA_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1250, "")); } // Debe indicar un talonario
                  }
                  break;

                case K_DOC_ID_STOCK:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(2567, "")); } // Debe indicar un documento para generar el movimiento de stock
                  }
                  break;
              }
            }
            break;

          case D.Types.ASIENTOCONTABLE:
            var _count = m_dialog.getProperties().size();
            for (var _i = 0; _i < _count; _i++) {
              property = m_dialog.getProperties().item(_i);
              switch (property.getKey()) {

                case K_TA_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1250, "")); } // Debe indicar un talonario
                  }
                  break;
              }
            }
            break;

          case D.Types.LIQUIDACION:
            var _count = m_dialog.getProperties().size();
            for (var _i = 0; _i < _count; _i++) {
              property = m_dialog.getProperties().item(_i);
              switch (property.getKey()) {

                case K_TA_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1250, "")); } // Debe indicar un talonario
                  }
                  break;

                case K_TA_ID_HABERES:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(4640, "")); } // Debe indicar un talonario para los recibos de haberes
                  }
                  break;

                case K_DOC_ID_ASIENTO:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(2564, "")); } // Debe indicar un documento para guardar el asiento contable
                  }
                  break;
              }
            }
            break;

          case D.Types.ORDEN_PAGO:
          case D.Types.MOVIMIENTO_FONDO:
          case D.Types.DEPOSITO_BANCO:
          case D.Types.DEPOSITO_CUPON:
          case D.Types.RESOLUCION_CUPON:

            var _count = m_dialog.getProperties().size();
            for (var _i = 0; _i < _count; _i++) {
              property = m_dialog.getProperties().item(_i);
              switch (property.getKey()) {

                case K_TA_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1250, "")); } // Debe indicar un talonario
                  }
                  break;

                case K_DOC_ID_ASIENTO:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(2564, "")); } // Debe indicar un documento para guardar el asiento contable
                  }
                  break;
              }
            }
            break;

          case D.Types.PRESUPUESTOENVIO:
            var _count = m_dialog.getProperties().size();
            for (var _i = 0; _i < _count; _i++) {
              property = m_dialog.getProperties().item(_i);
              switch (property.getKey()) {

                case K_TA_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1250, "")); } // Debe indicar un talonario
                  }
                  break;

                case K_MON_ID:
                  if(valEmpty(property.getSelectId(), Types.id)) {
                    if(!bSilent) { return M.showInfoWithFalse(getText(1108, "")); } // Debe indicar una moneda
                  }
                  break;
              }
            }
            break;
        }

        if(bGeneraRto && !bDocRto) {
          if(!bSilent) { return M.showInfoWithFalse(getText(2568, "")); } // Debe indicar un Documento para generar el Remito
        }

        if(bGeneraStock && !bDocStock) {
          if(!bSilent) { return M.showInfoWithFalse(getText(2567, "")); } // Debe indicar un documento para generar el movimiento de stock
        }

        return true;
      };

      self.columnAfterEdit = function(key, lRow, lCol, newValue, newValueId) {
        return P.resolvedPromise(true);
      };

      self.columnAfterUpdate = function(key, lRow, lCol) {
        switch (key) {
          case K_REPORTES:
            var property = m_dialog.getProperties().item(C_REPORTES).getGrid();

            if(property.getColumns().items(lCol).getKey() === KI_CSRFILE) {

              var fileEx = new cFileEx();
              var row = property.getRows().items(lRow);

              Dialogs.cell(row, KI_CSRFILE).setValue(fileEx.fileGetName(Dialogs.cell(row, KI_CSRFILE).getValue()));
            }
            break;
        }
        return P.resolvedPromise(true);
      };

      self.columnBeforeEdit = function(key, lRow, lCol, iKeyAscii) {
        return P.resolvedPromise(true);
      };

      self.columnButtonClick = function(key, lRow, lCol, iKeyAscii) {

      };

      self.columnClick = function(key, lRow, lCol) {

      };

      self.gridDblClick = function(key, lRow, lCol) {
        return P.resolvedPromise(false);
      };

      self.deleteRow = function(key, row, lRow) {
        var id = null;

        switch (key) {

          case K_FIRMAS:
            id = val(Dialogs.cell(row, KI_DOCFR_ID).getValue());
            if(id !== NO_ID) { m_firmasDeleted = m_firmasDeleted+ id.toString()+ ","; }
            break;

          case K_REPORTES:
            id = val(Dialogs.cell(row, KI_RPTF_ID).getValue());
            if(id !== NO_ID) { m_itemsDeletedReportes = m_itemsDeletedReportes+ id.toString()+ ","; }
            break;
        }

        return P.resolvedPromise(true);
      };

      self.isEmptyRow = function(key, row, rowIndex) {
        var isEmpty = true;
        try {

          switch (key) {
            case K_REPORTES:
              isEmpty = isEmptyRow(row, rowIndex);
              break;

            case K_FIRMAS:
              isEmpty = isEmptyRowFirmas(row, rowIndex);
              break;
          }
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.IS_EMPTY_ROW_FUNCTION, C_MODULE, "");
        }

        return P.resolvedPromise(isEmpty);
      };

      self.newRow = function(key, rows) {
        return P.resolvedPromise(true);
      };

      self.validateRow = function(key, row, rowIndex) {
        var p = null;

        try {

          switch (key) {
            
            case K_REPORTES:
              p = validateRowReportes(row, rowIndex);
              break;

            case K_FIRMAS:
              p = validateRowFirmas(row, rowIndex);
              break;
          }
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.VALIDATE_ROW_FUNCTION, C_MODULE, "");
        }

        return p || P.resolvedPromise(false);
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
        return Cairo.Security.hasPermissionTo(csPreDListDocumento);
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
          if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_DOCUMENTO)) { return false; }
        }
        else {
          m_isNew = false;
          if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_DOCUMENTO)) { return false; }
        }
        return true;
      };

      var loadCollection = function() {

        m_dialog.getTabs().clear();
        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, C.DOCT_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO_TIPO);
        elem.setName(getText(2366, "")); // Tipo de Documento
        elem.setKey(K_DOCT_ID);
        elem.setValue(m_documentoTipo);
        elem.setSelectId(m_doct_id);

        elem = properties.add(null, C.EMP_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.EMPRESA);
        elem.setName(getText(1114, "")); // Empresa
        elem.setKey(K_EMP_ID);
        elem.setValue(m_empresa);
        elem.setSelectId(m_emp_id);

        elem = properties.add(null, C.CICO_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CIRCUITO_CONTABLE);
        elem.setName(getText(1073, "")); // Circuito Contable
        elem.setKey(K_CICO_ID);
        elem.setValue(m_circuitoContable);
        elem.setSelectId(m_cico_id);

        elem = properties.add(null, C.DOC_NAME);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(255);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        elem = properties.add(null, C.DOC_CODE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setSize(50);
        elem.setKey(K_CODE);
        elem.setValue(m_code);

        elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVE);
        elem.setValue(m_active === true ? 1 : 0);

        elem = properties.add(null, C.DOC_EDITAR_IMPRESOS);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(3482, "")); // Permitir la edición de comprobantes impresos
        elem.setKey(K_EDITAR_IMPRESOS);
        elem.setValue(Cairo.Util.boolToInt(m_editarImpresos));

        elem = properties.add(null, C.FCA_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.FECHAS_DE_CONTROL_DE_ACCESO);
        elem.setName(getText(2571, "")); // Fecha Control de Acceso
        elem.setKey(K_FCA_ID);
        elem.setValue(m_fechaControlAcceso);
        elem.setSelectId(m_fca_id);

        setTipoDoc();

        elem = properties.add(null, C.DOC_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setSize(5000);
        elem.setKey(K_DESCRIP);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setValue(m_descrip);

        elem = properties.add(null, C.DOC_OBJECT_EDIT);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(getText(2775, "")); // Objeto Edición
        elem.setKey(K_DOC_EDIT_OBJECT);
        elem.setValue(m_object_edit);

        m_itemsDeletedReportes = "";

        if(!m_dialog.show(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var property = properties.item(C.DOCT_ID);
        property.setValue(m_documentoTipo);
        property.setSelectId(m_doct_id);

        property = properties.item(C.EMP_ID);
        property.setValue(m_empresa);
        property.setSelectId(m_emp_id);

        property = properties.item(C.CICO_ID);
        property.setValue(m_circuitoContable);
        property.setSelectId(m_cico_id);

        property = properties.item(C.DOC_NAME);
        property.setValue(m_name);

        property = properties.item(C.DOC_CODE);
        property.setValue(m_code);

        property = properties.item(Cairo.Constants.ACTIVE);
        property.setValue(m_active === true ? 1 : 0);

        property = properties.item(C.DOC_EDITAR_IMPRESOS);
        property.setValue(Cairo.Util.boolToInt(m_editarImpresos));

        property = properties.item(C.FCA_ID);
        property.setValue(m_fechaControlAcceso);
        property.setSelectId(m_fca_id);

        property = properties.item(C.DOC_DESCRIP);
        property.setValue(m_descrip);

        property = properties.item(C.DOC_OBJECT_EDIT);
        property.setValue(m_object_edit);

        return m_dialog.showValues(properties);
      };

      var load = function(id) {

        return DB.getData("load[" + m_apiPath + "general/documento]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            m_data = loadDataFromResponse(response);

            if(response.data.id !== NO_ID) {

              m_id = valField(response.data, C.DOC_ID);
              m_name = valField(response.data, C.DOC_NAME);
              m_code = valField(response.data, C.DOC_CODE);
              m_descrip = valField(response.data, C.DOC_DESCRIP);
              m_doct_id = valField(response.data, C.DOCT_ID);
              m_documentoTipo = valField(response.data, C.DOCT_NAME);
              m_cico_id = valField(response.data, C.CICO_ID);
              m_circuitoContable = valField(response.data, C.CICO_NAME);
              m_llevaFirma = valField(response.data, C.DOC_LLEVA_FIRMA);

              m_esResumenBco = valField(response.data, C.DOC_ES_RESUMEN_BANCO);
              m_esCreditoBanco = valField(response.data, C.DOC_ES_CREDITO_BANCO);
              m_esVentaAccion = valField(response.data, C.DOC_ES_VENTA_ACCION);
              m_esVentaCheque = valField(response.data, C.DOC_ES_VENTA_CHEQUE);
              m_esCobChequesgr = valField(response.data, C.DOC_ES_COB_CHEQUE_SGR);
              m_esCobCaidasgr = valField(response.data, C.DOC_ES_COB_CAIDA_SGR);

              m_llevaFirmaCredito = valField(response.data, C.DOC_LLEVA_FIRMA_CREDITO);
              m_llevaFirmaPrint0 = valField(response.data, C.DOC_LLEVA_FIRMA_PRINT0);
              m_tipoFactura = valField(response.data, C.DOC_TIPO_FACTURA);
              m_tipoPackingList = valField(response.data, C.DOC_TIPO_PACKING_LIST);
              m_tipoORDEN_COMPRA = valField(response.data, C.DOC_TIPO_ORDEN_COMPRA);

              m_rvDesdePv = valField(response.data, C.DOC_RV_DESDE_PV);
              m_rvDesdeOs = valField(response.data, C.DOC_RV_DESDE_OS);
              m_rcDesdeOc = valField(response.data, C.DOC_RC_DESDE_OC);
              m_rcDespachoImpo = valField(response.data, C.DOC_RC_DESPACHO_IMPO);
              m_rvBom = valField(response.data, C.DOC_RV_BOM);
              m_pvDesdePrv = valField(response.data, C.DOC_PV_DESDE_PRV);

              m_fv_SinPercepcion = valField(response.data, C.DOC_FV_SIN_PERCEPCION);
              m_esFacturaElectronica = valField(response.data, C.DOC_ES_FACTURA_ELECTRONICA);

              m_stConsumo = valField(response.data, C.DOC_ST_CONSUMO);

              m_fechaControlAcceso = valField(response.data, C.FCA_NAME);
              m_fca_id = valField(response.data, C.FCA_ID);

              m_ta_id = valField(response.data, C.TA_ID);
              m_talonario = valField(response.data, C.TA_NAME);

              m_ta_id_Externo = valField(response.data, C.TA_ID_EXTERNO);
              m_talonarioExterno = valField(response.data, "taExterno");

              m_ta_id_Final = valField(response.data, C.TA_ID_FINAL);
              m_talonarioFinal = valField(response.data, "taFinal");

              m_ta_id_Inscripto = valField(response.data, C.TA_ID_INSCRIPTO);
              m_talonarioInscripto = valField(response.data, "taInscripto");

              m_ta_id_InscriptoM = valField(response.data, C.TA_ID_INSCRIPTO_M);
              m_talonarioInscriptoM = valField(response.data, "taInscriptoM");

              m_ta_id_Haberes = valField(response.data, C.TA_ID_HABERES);
              m_talonarioHaberes = valField(response.data, "taHaberes");

              m_doc_id_Asiento = valField(response.data, C.DOC_ID_ASIENTO);
              m_documentoAsiento = valField(response.data, "docAsiento");

              m_mon_id = valField(response.data, C.MON_ID);
              m_moneda = valField(response.data, C.MON_NAME);

              m_cueg_id = valField(response.data, C.CUEG_ID);
              m_cuentaGrupo = valField(response.data, C.CUEG_NAME);

              m_generaRemito = valField(response.data, C.DOC_GENERA_REMITO);
              m_mueveStock = valField(response.data, C.DOC_MUEVE_STOCK);

              m_doc_id_Remito = valField(response.data, C.DOC_ID_REMITO);
              m_documentoRemito = valField(response.data, "docRemito");

              m_doc_id_Stock = valField(response.data, C.DOC_ID_STOCK);
              m_documentoStock = valField(response.data, "docStock");

              m_emp_id = valField(response.data, C.EMP_ID);
              m_empresa = valField(response.data, C.EMP_NAME);

              m_active = valField(response.data, Cairo.Constants.ACTIVE);
              m_editarImpresos = valField(response.data, C.DOC_EDITAR_IMPRESOS);

              m_docg_id = valField(response.data, C.DOCG_ID);
              m_documentoGrupo = valField(response.data, C.DOCG_NAME);

              m_object_edit = valField(response.data, C.DOC_OBJECT_EDIT);

            } 
            else {
              m_id = NO_ID;
              m_name = "";
              m_code = "";
              m_descrip = "";
              m_doct_id = NO_ID;
              m_documentoTipo = "";
              m_llevaFirma = false;
              m_esResumenBco = false;
              m_esCreditoBanco = false;
              m_esVentaAccion = false;
              m_esVentaCheque = false;
              m_esCobChequesgr = false;
              m_esCobCaidasgr = false;
              m_llevaFirmaCredito = false;
              m_llevaFirmaPrint0 = false;
              m_rvDesdePv = false;
              m_rvDesdeOs = false;
              m_rvBom = false;
              m_pvDesdePrv = false;
              m_fv_SinPercepcion = false;
              m_esFacturaElectronica = false;
              m_rcDesdeOc = false;
              m_rcDespachoImpo = false;
              m_tipoFactura = csETFacDirecta;
              m_tipoPackingList = csETPackManifiesto;
              m_tipoORDEN_COMPRA = csETOrdenDirecta;
              m_cico_id = NO_ID;
              m_circuitoContable = "";
              m_stConsumo = false;

              m_fechaControlAcceso = "";
              m_fca_id = NO_ID;

              m_ta_id = NO_ID;
              m_talonario = "";

              m_mon_id = NO_ID;
              m_moneda = "";

              m_cueg_id = NO_ID;
              m_cuentaGrupo = "";

              m_ta_id_Externo = NO_ID;
              m_talonarioExterno = "";

              m_ta_id_Final = NO_ID;
              m_talonarioFinal = "";

              m_ta_id_Inscripto = NO_ID;
              m_talonarioInscripto = "";

              m_ta_id_InscriptoM = NO_ID;
              m_talonarioInscriptoM = "";

              m_ta_id_Haberes = NO_ID;
              m_talonarioHaberes = "";

              m_doc_id_Asiento = NO_ID;
              m_documentoAsiento = "";

              m_generaRemito = false;
              m_mueveStock = false;

              m_doc_id_Remito = NO_ID;
              m_documentoRemito = "";

              m_doc_id_Stock = NO_ID;
              m_documentoStock = "";

              m_emp_id = NO_ID;
              m_empresa = "";

              m_active = true;
              m_editarImpresos = false;

              m_docg_id = NO_ID;
              m_documentoGrupo = "";

              m_object_edit = "";

            }

            return true;
          });
      };

      var setGridFirmas = function(property) {

        var elem;
        var grid = property.getGrid();

        var columns = grid.getColumns();
        columns.clear();

        elem = columns.add(null);
        elem.setName("docfr_id");
        elem.setVisible(false);
        elem.setKey(KI_DOCFR_ID);

        elem = columns..add(null);
        elem.setName(getText(1137, "")); // Usuario
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(csUsuario);
        elem.setKey(KI_US_ID);

        grid.getRows().clear();
      };

      var loadFirmas = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();

        for(var _i = 0, count = m_data.firmas.length; _i < count; _i += 1) {

          var row = rows.add(null, getValue(m_data.firmas[_i], C.DOCFR_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.firmas[_i]);
          elem.setKey(KI_DOCFR_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.firmas[_i], C.US_NAME));
          elem.setId(getValue(m_data.firmas[_i], C.US_ID));
          elem.setKey(KI_US_ID);

        }
      };

      var setGridReportes = function(property) {

        var elem;
        var grid = property.getGrid();
        var columns = grid.getColumns();

        columns.clear();

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_RPTF_ID);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KI_NOMBRE);

        elem = columns.add(null);
        elem.setName(getText(2572, "")); // Archivo CSR
        elem.setType(Dialogs.PropertyType.file);
        elem.setSelectFilter("Reportes|*.csr");
        elem.setKey(KI_CSRFILE);

        elem = columns.add(null);
        elem.setName(getText(2573, "")); // Sugerido
        elem.setType(Dialogs.PropertyType.check);
        elem.setKey(KI_SUGERIDO);

        elem = columns.add(null);
        elem.setName(getText(3915, "")); // Sugerido Mail
        elem.setType(Dialogs.PropertyType.check);
        elem.setKey(KI_SUGERIDOMAIL);

        elem = columns.add(null);
        elem.setName(getText(2574, "")); // Copias
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.integer);
        elem.setKey(KI_COPIAS);

        elem = columns.add(null);
        elem.setName(getText(2575, "")); // Imprimir al grabar un Documento nuevo
        elem.setType(Dialogs.PropertyType.check);
        elem.setKey(KI_PRINTINNEW);

        elem = columns.add(null);
        elem.setName(getText(2576, "")); // Objeto ActiveX
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KI_RPT_OBJ);

        grid.getRows().clear();
      };

      var loadReports = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();

        for(var _i = 0; _i < m_data.reportes.length; _i += 1) {

          var row = rows.add(null, getValue(m_data.reports[_i], C.RPTF_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.reports[_i], C.RPTF_ID));
          elem.setKey(KI_RPTF_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.reportes[_i], C.RPTF_NAME));
          elem.setKey(KI_NOMBRE);

          elem = row.add(null);
          elem.setValue(getValue(m_data.reportes[_i], C.RPTF_CSRFILE));
          elem.setKey(KI_CSRFILE);

          elem = row.add(null);
          elem.setId(getValue(m_data.reportes[_i], C.RPTF_SUGERIDO));
          elem.setKey(KI_SUGERIDO);

          elem = row.add(null);
          elem.setId(getValue(m_data.reportes[_i], C.RPTF_SUGERIDO_EMAIL));
          elem.setKey(KI_SUGERIDOMAIL);

          elem = row.add(null);
          elem.setValue(getValue(m_data.reportes[_i], C.RPTF_COPIAS));
          elem.setKey(KI_COPIAS);

          elem = row.add(null);
          elem.setId(getValue(m_data.reportes[_i], C.RPTF_DOC_IMPRIMIR_EN_ALTA));
          elem.setKey(KI_PRINTINNEW);

          elem = row.add(null);
          elem.setValue(getValue(m_data.reportes[_i], C.RPTF_OBJECT));
          elem.setKey(KI_RPT_OBJ);

        }
      };

      var validateRowFirmas = function(row, rowIndex) {
        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          var cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_US_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(1153, "", strRow)); // Debe indicar un usuario (1)
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var validateRowReportes = function(row, rowIndex) {
        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          var cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_NOMBRE:
              if(valEmpty(cell.getValue(), Types.text)) {
                return M.showInfoWithFalse(getText(1811, "", strRow)); // Debe indicar un nombre (1)
              }
              break;

            case KI_CSRFILE:
              if(valEmpty(cell.getValue(), Types.text)) {
                return M.showInfoWithFalse(getText(2579, "", strRow)); // Debe indicar un Archivo CSR (1)
              }
              break;

            case KI_COPIAS:
              if(val(cell.getValue()) < 1) {
                return M.showInfoWithFalse(getText(2578, "", strRow)); // La cantidad de copias debe ser mayor o igual a 1 (1)
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var saveItemsReportes = function(mainRegister) {
        var transaction = DB.createTransaction();
        transaction.setTable(C.REPORTE_FORMULARIO);

        var property = m_dialog.getProperties().item(C_CAIS);
        var rows = property.getGrid().getRows();

        var _count = rows.size();
        for(var _i = 0; _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();

          var fields = register.getFields();
          register.setFieldId(C.RPTF_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var _countj = row.size();
          for(var _j = 0; _j < _countj; _j++) {

            var cell = row.item(_j);
            switch (cell.getKey()) {

              case KI_RPTF_ID:
                if(m_copy) {
                  fields.add(C.RPTF_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(C.RPTF_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KI_NOMBRE:
                fields.add(C.RPTF_NAME, cell.getValue(), Types.text);
                break;

              case KI_CSRFILE:
                fields.add(C.RPTF_CSRFILE, cell.getValue(), Types.text);
                break;

              case KI_SUGERIDO:
                fields.add(C.RPTF_SUGERIDO, cell.getId(), Types.boolean);
                break;

              case KI_SUGERIDOMAIL:
                fields.add(C.RPTF_SUGERIDO_EMAIL, cell.getId(), Types.boolean);
                break;

              case KI_COPIAS:
                fields.add(C.RPTF_COPIAS, val(cell.getValue()), Types.integer);
                break;

              case KI_PRINTINNEW:
                fields.add(C.RPTF_DOC_IMPRIMIR_EN_ALTA, cell.getId(), Types.boolean);
                break;

              case KI_RPT_OBJ:
                fields.add(C.RPTF_OBJECT, cell.getValue(), Types.text);
                break;
            }
          }

          fields.add(C.RPTF_TIPO, C.ReporteFormularioTipo.maestro, Types.integer);
          fields.add(C.DOC_ID, m_id, Types.id);
          fields.add(Cairo.Constants.ACTIVE, -1, Types.boolean);

          transaction.addRegister(register);
        }

        if(m_itemsDeletedReportes !== "" && !m_copy) {

          transaction.setDeletedList(m_itemsDeletedReportes);

        }

        mainRegister.addTransaction(transaction);
      };

      var setTipoDoc = function() {
        if(m_id === NO_ID) {

          m_dialog.getProperties().item(C.DOCT_ID).setEnabled(true);
          m_dialog.getProperties().item(C.EMP_ID).setEnabled(true);
        } 
        else {

          var iTab = null;

          m_dialog.getTabs().clear();

          iTab = m_dialog.getTabs().add(iTab);
          iTab.setIndex(0);
          iTab.setName(Cairo.Constants.c_strGeneral);
          iTab = null;

          m_dialog.getProperties().item(C.DOCT_ID).setEnabled(false);
          m_dialog.getProperties().item(C.EMP_ID).setEnabled(false);

          switch (m_doct_id) {
            case D.Types.FACTURA_VENTA:
            case D.Types.NOTA_CREDITO_VENTA:
            case D.Types.NOTA_DEBITO_VENTA:
              pShowFacturaVenta();
              break;

            case D.Types.FACTURA_COMPRA:
            case D.Types.NOTA_CREDITO_COMPRA:
            case D.Types.NOTA_DEBITO_COMPRA:
              pShowFacturaCompra();
              break;

            case D.Types.REMITO_VENTA:
            case D.Types.DEVOLUCION_REMITO_VTA:
              pShowRemitoVenta();
              break;

            case D.Types.PACKING_LIST:
            case D.Types.PACKING_LIST_DEVOLUCION:
              pShowPackingList();
              break;

            case D.Types.MANIFIESTO_CARGA:
              pShowManifiestoCarga();
              break;

            case D.Types.PERMISO_EMBARQUE:
              pShowPermisoEmbarque();
              break;

            case D.Types.ORDEN_SERVICIO:
              pShowOrdenServicio();
              break;

            case D.Types.REMITO_COMPRA:
            case D.Types.DEVOLUCION_REMITO_CPRA:
              pShowRemitoCompra();
              break;

            case D.Types.IMPORTACION_TEMP:
              pShowImportacionTemp();
              break;

            case D.Types.PEDIDO_VENTA:
            case D.Types.DEVOLUCION_PEDIDO_VTA:
              pShowPedidoVenta();
              break;

            case D.Types.PEDIDO_COMPRA:
            case D.Types.DEVOLUCION_PEDIDO_CPRA:
              pShowDoc();
              break;

            case D.Types.PRESUPUESTO_VENTA:
            case D.Types.DEVOLUCION_PRESU_VTA:
              pShowDoc();
              break;

            case D.Types.PRESUPUESTO_COMPRA:
            case D.Types.DEVOLUCION_PRESU_CPRA:
              pShowDoc();
              break;

            case D.Types.ORDEN_COMPRA:
            case D.Types.DEVOLUCION_ORDEN_CPRA:
              pShowDoc();
              pShowORDEN_COMPRA();
              break;

            case D.Types.COTIZACION_COMPRA:
            case D.Types.DEVOLUCION_COTIZACION_CPRA:
              pShowDoc();
              break;

            case D.Types.MOVIMIENTO_FONDO:
              pShowMovimientoFondo();
              break;

            case D.Types.LIQUIDACION:
              pShowLiquidacion();
              break;

            case D.Types.DEPOSITO_BANCO:
            case D.Types.DEPOSITO_CUPON:
            case D.Types.RESOLUCION_CUPON:
              pShowDepositoBanco();
              break;

            case D.Types.COBRANZA:
              pShowCobranza();
              break;

            case D.Types.TRASFERENCIASTOCK:
              pShowStock();
              break;

            case D.Types.PARTE_REPARACION:
              pShowPARTE_REPARACION();
              break;

            case D.Types.ORDENPRODKIT:
              pShowOrdenProdKit();
              break;

            case D.Types.RECUENTO_STOCK:
            case D.Types.PARTE_PROD_KIT:
            case D.Types.PARTE_DESARME_KIT:
            case D.Types.STOCK_PROVEEDOR:
            case D.Types.STOCK_CLIENTE:
              pShowRECUENTO_STOCK();
              break;

            case D.Types.ASIENTOCONTABLE:
              pShowAsiento();
              break;

            case D.Types.ORDEN_PAGO:
              pShowORDEN_PAGO();
              break;

            case D.Types.PRESUPUESTOENVIO:
              pShowPresupuestoEnvio();
              break;
          }

          pShowReportes();
          pShowFirmas();
        }
      };

      var pShowAsiento = function() {

        var properties = m_dialog.getProperties();

        elem = properties.add(null, C.TA_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(1256, "")); // Talonario
        elem.setKey(K_TA_ID);
        elem.setValue(m_talonario);
        elem.setSelectId(m_ta_id);
      };

      var pShowStock = function() {

        var properties = m_dialog.getProperties();

        elem = properties.add(null, C.TA_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(1256, "")); // Talonario
        elem.setKey(K_TA_ID);
        elem.setValue(m_talonario);
        elem.setSelectId(m_ta_id);

        elem = properties.add(null, C.DOC_ST_CONSUMO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(3524, "")); // Es Consumo de Stock
        elem.setKey(K_ST_CONSUMO);
        elem.setValue(Integer.parseInt(m_stConsumo));

      };

      var pShowPARTE_REPARACION = function() {
        var properties = m_dialog.getProperties();

        var elem = properties.add(null, C.TA_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(1256, "")); // Talonario
        elem.setKey(K_TA_ID);
        elem.setValue(m_talonario);
        elem.setSelectId(m_ta_id);

        elem = properties.add(null, C.MON_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setName(getText(1113, "")); // Moneda
        elem.setKey(K_MON_ID);
        elem.setValue(m_moneda);
        elem.setSelectId(m_mon_id);

        elem = properties.add(null, C.DOC_ID_STOCK);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setSelectFilter(D.TRANSFERENCIA_STOCK_DOC_FILTER + "|emp_id:"+ m_emp_id.toString());
        elem.setName("Documento Stock");
        elem.setValue(m_documentoStock);
        elem.setSelectId(m_doc_id_Stock);
        elem.setKey(K_DOC_ID_STOCK);

        elem.setSelectNoUseActive(true);

      };

      var pShowRECUENTO_STOCK = function() {
        var properties = m_dialog.getProperties();

        var elem = properties.add(null, C.TA_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(1256, "")); // Talonario
        elem.setKey(K_TA_ID);
        elem.setValue(m_talonario);
        elem.setSelectId(m_ta_id);

        c = properties.add(null, C.DOC_ID_STOCK);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(C.DOCUMENTO);
        c.setSelectFilter("'emp_id = "+ m_emp_id+ " and doct_id = "+ D.Types.TRASFERENCIASTOCK.toString()+ "'");
        c.setName(getText(2580, "")); // Documento Stock
        c.setValue(m_documentoStock);
        c.setSelectId(m_doc_id_Stock);
        c.setKey(K_DOC_ID_STOCK);

        o = c;
        o.setSelectNoUseActive(true);

      };

      var pShowOrdenProdKit = function() {
        var c = null;
        var o = null;

        var properties = m_dialog.getProperties();

        elem = properties.add(null, C.TA_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(1256, "")); // Talonario
        elem.setKey(K_TA_ID);
        elem.setValue(m_talonario);
        elem.setSelectId(m_ta_id);

      };

      var pShowPedidoVenta = function() {

        var iTab = null;

        iTab = m_dialog.getTabs().add(iTab);
        iTab.setIndex(m_dialog.getTabs().count() - 1);
        iTab.setName(getText(2581, "")); // Configuración

        var properties = m_dialog.getProperties();

        elem = properties.add(null, C.DOC_LLEVA_FIRMA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2582, "")); // Lleva Firma
        elem.setKey(K_LLEVA_FIRMA);
        elem.setValue(Integer.parseInt(m_llevaFirma));

        elem = properties.add(null, C.DOC_LLEVA_FIRMA_CREDITO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2583, "")); // Lleva Firma Crédito
        elem.setKey(K_LLEVA_FIRMA_CREDITO);
        elem.setValue(Integer.parseInt(m_llevaFirmaCredito));

        elem = properties.add(null, C.DOC_PV_DESDE_PRV);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2584, "")); // Requiere Presupuesto de Venta
        elem.setKey(K_PV_DESDE_PRV);
        elem.setValue(Integer.parseInt(m_pvDesdePrv));

        elem = properties.add(null, C.TA_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(1256, "")); // Talonario
        elem.setKey(K_TA_ID);
        elem.setValue(m_talonario);
        elem.setSelectId(m_ta_id);
        elem.setSelectFilter("emp_id = "+ m_emp_id);

        elem = properties.add(null, C.MON_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setName(getText(1113, "")); // Moneda
        elem.setKey(K_MON_ID);
        elem.setValue(m_moneda);
        elem.setSelectId(m_mon_id);
      };

      var pShowRemitoVenta = function() {
        var c = null;
        var o = null;

        var iTab = null;

        iTab = m_dialog.getTabs().add(iTab);
        iTab.setIndex(m_dialog.getTabs().count() - 1);
        iTab.setName(getText(2581, "")); // Configuración

        var properties = m_dialog.getProperties();

        elem = properties.add(null, C.DOC_LLEVA_FIRMA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2582, "")); // Lleva Firma
        elem.setKey(K_LLEVA_FIRMA);
        elem.setValue(Integer.parseInt(m_llevaFirma));

        elem = properties.add(null, C.DOC_RV_DESDE_PV);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2585, "")); // Requiere Pedido de Venta
        elem.setKey(K_RV_DESDE_PV);
        elem.setValue(Integer.parseInt(m_rvDesdePv));

        elem = properties.add(null, C.DOC_RV_DESDE_OS);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2586, "")); // Requiere Orden de Servicio
        elem.setKey(K_RV_DESDE_OS);
        elem.setValue(Integer.parseInt(m_rvDesdeOs));

        elem = properties.add(null, C.DOC_RV_BOM);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2587, "")); // Consume Stock x B.O.M.
        elem.setKey(K_RV_BOM);
        elem.setValue(Integer.parseInt(m_rvBom));

        elem = properties.add(null, C.TA_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(1256, "")); // Talonario
        elem.setKey(K_TA_ID);
        elem.setValue(m_talonario);
        elem.setSelectId(m_ta_id);
        elem.setSelectFilter("emp_id = "+ m_emp_id);

        elem = properties.add(null, C.MON_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setName(getText(1113, "")); // Moneda
        elem.setKey(K_MON_ID);
        elem.setValue(m_moneda);
        elem.setSelectId(m_mon_id);

        elem = properties.add(null, C.DOC_MUEVE_STOCK);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2588, "")); // Mueve Stock
        elem.setKey(K_MUEVE_STOCK);
        elem.setValue(Integer.parseInt(m_mueveStock));
        elem.setTabIndex(iTab.getIndex());

        c = properties.add(null, C.DOC_ID_STOCK);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CSDocumento);
        c.setSelectFilter("'emp_id = "+ m_emp_id+ " and doct_id = "+ D.Types.TRASFERENCIASTOCK.toString()+ "'");
        c.setName(getText(2580, "")); // Documento Stock
        c.setValue(m_documentoStock);
        c.setSelectId(m_doc_id_Stock);
        c.setKey(K_DOC_ID_STOCK);
        c.setTabIndex(iTab.getIndex());

        o = c;
        o.setSelectNoUseActive(true);

      };

      var pShowManifiestoCarga = function() {

        var properties = m_dialog.getProperties();

        elem = properties.add(null, C.DOC_LLEVA_FIRMA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2582, "")); // Lleva Firma
        elem.setKey(K_LLEVA_FIRMA);
        elem.setValue(Integer.parseInt(m_llevaFirma));

        elem = properties.add(null, C.TA_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(1256, "")); // Talonario
        elem.setKey(K_TA_ID);
        elem.setValue(m_talonario);
        elem.setSelectId(m_ta_id);
      };

      var pShowPackingList = function() {

        var iTab = null;

        iTab = m_dialog.getTabs().add(iTab);
        iTab.setIndex(m_dialog.getTabs().count() - 1);
        iTab.setName(getText(2581, "")); // Configuración

        var properties = m_dialog.getProperties();

        elem = properties.add(null, C.DOC_LLEVA_FIRMA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2582, "")); // Lleva Firma
        elem.setKey(K_LLEVA_FIRMA);
        elem.setValue(Integer.parseInt(m_llevaFirma));

        elem = properties.add(null, C.TA_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(1256, "")); // Talonario
        elem.setKey(K_TA_ID);
        elem.setValue(m_talonario);
        elem.setSelectId(m_ta_id);

        elem = properties.add(null, C.MON_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setName(getText(1113, "")); // Moneda
        elem.setKey(K_MON_ID);
        elem.setValue(m_moneda);
        elem.setSelectId(m_mon_id);

        elem = properties.add(null, C_PACKING_LIST_DIRECTO);
        elem.setType(Dialogs.PropertyType.option);
        elem.setOptionGroup(0);
        elem.setName(getText(2589, "")); // Sin Documento previo
        elem.setKey(K_PKLST_DIRECTO);
        elem.setValue(0);
        elem.setTabIndex(iTab.getIndex());

        elem = properties.add(null, C_PACKING_LIST_DESDE_PEDIDO);
        elem.setType(Dialogs.PropertyType.option);
        elem.setOptionGroup(0);
        elem.setName(getText(2590, "")); // Desde Pedido Venta
        elem.setKey(K_PKLST_DESDE_PV);
        elem.setValue(0);
        elem.setTabIndex(iTab.getIndex());

        elem = properties.add(null, C_PACKING_LIST_DESDE_REMITO);
        elem.setType(Dialogs.PropertyType.option);
        elem.setOptionGroup(0);
        elem.setName(getText(2591, "")); // Desde remito
        elem.setKey(K_PKLST_DESDE_RV);
        elem.setValue(0);
        elem.setTabIndex(iTab.getIndex());

        elem = properties.add(null, C_PACKING_LIST_DESDE_MANIFIESTO);
        elem.setType(Dialogs.PropertyType.option);
        elem.setOptionGroup(0);
        elem.setName(getText(2592, "")); // Desde manifiesto
        elem.setKey(K_PKLST_DESDE_MFC);
        elem.setValue(0);
        elem.setTabIndex(iTab.getIndex());

        switch (m_tipoPackingList) {
          case csETPackDirecto:
            m_dialog.getProperties().item(C_PACKING_LIST_DIRECTO).setValue(1);
            break;

          case csETPackPedido:
            m_dialog.getProperties().item(C_PACKING_LIST_DESDE_PEDIDO).setValue(1);
            break;

          case csETPackRemito:
            m_dialog.getProperties().item(C_PACKING_LIST_DESDE_REMITO).setValue(1);
            break;

          case csETPackManifiesto:
            m_dialog.getProperties().item(C_PACKING_LIST_DESDE_MANIFIESTO).setValue(1);
            break;
        }
      };

      var pShowPermisoEmbarque = function() {

        var properties = m_dialog.getProperties();

        elem = properties.add(null, C.DOC_LLEVA_FIRMA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2582, "")); // Lleva Firma
        elem.setKey(K_LLEVA_FIRMA);
        elem.setValue(Integer.parseInt(m_llevaFirma));

        elem = properties.add(null, C.MON_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setName(getText(1113, "")); // Moneda
        elem.setKey(K_MON_ID);
        elem.setValue(m_moneda);
        elem.setSelectId(m_mon_id);
      };

      var pShowRemitoCompra = function() {
        var c = null;
        var o = null;

        var iTab = null;

        iTab = m_dialog.getTabs().add(iTab);
        iTab.setIndex(m_dialog.getTabs().count() - 1);
        iTab.setName(getText(2581, "")); // Configuración

        var properties = m_dialog.getProperties();

        elem = properties.add(null, C.DOC_LLEVA_FIRMA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2582, "")); // Lleva Firma
        elem.setKey(K_LLEVA_FIRMA);
        elem.setValue(Integer.parseInt(m_llevaFirma));

        elem = properties.add(null, C.DOC_RC_DESDE_OC);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2593, "")); // Requiere Orden de Compra
        elem.setKey(K_RC_DESDE_OC);
        elem.setValue(Integer.parseInt(m_rcDesdeOc));

        elem = properties.add(null, C.DOC_RC_DESPACHO_IMPO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2594, "")); // Es un Despacho de Importación"
        elem.setKey(K_RC_DESPACHOIMPO);
        elem.setValue(Integer.parseInt(m_rcDespachoImpo));

        elem = properties.add(null, C.TA_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(1256, "")); // Talonario
        elem.setKey(K_TA_ID);
        elem.setValue(m_talonario);
        elem.setSelectId(m_ta_id);
        elem.setSelectFilter("emp_id = "+ m_emp_id);

        elem = properties.add(null, C.MON_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setName(getText(1113, "")); // Moneda
        elem.setKey(K_MON_ID);
        elem.setValue(m_moneda);
        elem.setSelectId(m_mon_id);

        elem = properties.add(null, C.DOC_MUEVE_STOCK);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2588, "")); // Mueve Stock
        elem.setKey(K_MUEVE_STOCK);
        elem.setValue(Integer.parseInt(m_mueveStock));
        elem.setTabIndex(iTab.getIndex());

        c = properties.add(null, C.DOC_ID_STOCK);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CSDocumento);
        c.setSelectFilter("'emp_id = "+ m_emp_id+ " and doct_id = "+ D.Types.TRASFERENCIASTOCK.toString()+ "'");
        c.setName(getText(2580, "")); // Documento Stock
        c.setValue(m_documentoStock);
        c.setSelectId(m_doc_id_Stock);
        c.setKey(K_DOC_ID_STOCK);
        c.setTabIndex(iTab.getIndex());

        o = c;
        o.setSelectNoUseActive(true);

      };

      var pShowOrdenServicio = function() {
        var c = null;
        var o = null;

        var iTab = null;

        iTab = m_dialog.getTabs().add(iTab);
        iTab.setIndex(m_dialog.getTabs().count() - 1);
        iTab.setName(getText(2581, "")); // Configuración

        var properties = m_dialog.getProperties();

        elem = properties.add(null, C.DOC_LLEVA_FIRMA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2582, "")); // Lleva Firma
        elem.setKey(K_LLEVA_FIRMA);
        elem.setValue(Integer.parseInt(m_llevaFirma));

        elem = properties.add(null, C.TA_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(1256, "")); // Talonario
        elem.setKey(K_TA_ID);
        elem.setValue(m_talonario);
        elem.setSelectId(m_ta_id);
        elem.setSelectFilter("emp_id = "+ m_emp_id);

        elem = properties.add(null, C.MON_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setName(getText(1113, "")); // Moneda
        elem.setKey(K_MON_ID);
        elem.setValue(m_moneda);
        elem.setSelectId(m_mon_id);

        elem = properties.add(null, C.DOC_MUEVE_STOCK);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2588, "")); // Mueve Stock
        elem.setKey(K_MUEVE_STOCK);
        elem.setValue(Integer.parseInt(m_mueveStock));
        elem.setTabIndex(iTab.getIndex());

        c = properties.add(null, C.DOC_ID_STOCK);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CSDocumento);
        c.setSelectFilter("'emp_id = "+ m_emp_id+ " and doct_id = "+ D.Types.TRASFERENCIASTOCK.toString()+ "'");
        c.setName(getText(2580, "")); // Documento Stock
        c.setValue(m_documentoStock);
        c.setSelectId(m_doc_id_Stock);
        c.setKey(K_DOC_ID_STOCK);
        c.setTabIndex(iTab.getIndex());

        o = c;
        o.setSelectNoUseActive(true);

      };

      var pShowImportacionTemp = function() {
        var c = null;
        var o = null;

        var iTab = null;

        iTab = m_dialog.getTabs().add(iTab);
        iTab.setIndex(m_dialog.getTabs().count() - 1);
        iTab.setName(getText(2581, "")); // Configuración

        var properties = m_dialog.getProperties();

        elem = properties.add(null, C.DOC_LLEVA_FIRMA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2582, "")); // Lleva Firma
        elem.setKey(K_LLEVA_FIRMA);
        elem.setValue(Integer.parseInt(m_llevaFirma));

        elem = properties.add(null, C.TA_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(1256, "")); // Talonario
        elem.setKey(K_TA_ID);
        elem.setValue(m_talonario);
        elem.setSelectId(m_ta_id);

        elem = properties.add(null, C.MON_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setName(getText(1113, "")); // Moneda
        elem.setKey(K_MON_ID);
        elem.setValue(m_moneda);
        elem.setSelectId(m_mon_id);

        elem = properties.add(null, C.DOC_MUEVE_STOCK);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2588, "")); // Mueve Stock
        elem.setKey(K_MUEVE_STOCK);
        elem.setValue(Integer.parseInt(m_mueveStock));
        elem.setTabIndex(iTab.getIndex());

        c = properties.add(null, C.DOC_ID_STOCK);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CSDocumento);
        c.setSelectFilter("'emp_id = "+ m_emp_id+ " and doct_id = "+ D.Types.TRASFERENCIASTOCK.toString()+ "'");
        c.setName(getText(2580, "")); // Documento Stock
        c.setValue(m_documentoStock);
        c.setSelectId(m_doc_id_Stock);
        c.setKey(K_DOC_ID_STOCK);
        c.setTabIndex(iTab.getIndex());

        o = c;
        o.setSelectNoUseActive(true);

      };

      var pShowDoc = function() {

        var properties = m_dialog.getProperties();

        elem = properties.add(null, C.DOC_LLEVA_FIRMA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2582, "")); // Lleva Firma
        elem.setKey(K_LLEVA_FIRMA);
        elem.setValue(Integer.parseInt(m_llevaFirma));

        elem = properties.add(null, C.TA_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(1256, "")); // Talonario
        elem.setKey(K_TA_ID);
        elem.setValue(m_talonario);
        elem.setSelectId(m_ta_id);

        elem = properties.add(null, C.MON_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setName(getText(1113, "")); // Moneda
        elem.setKey(K_MON_ID);
        elem.setValue(m_moneda);
        elem.setSelectId(m_mon_id);
      };

      var pShowMovimientoFondo = function() {
        var c = null;
        var o = null;

        var properties = m_dialog.getProperties();

        elem = properties.add(null, C.DOC_LLEVA_FIRMA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2582, "")); // Lleva Firma
        elem.setKey(K_LLEVA_FIRMA);
        elem.setValue(Integer.parseInt(m_llevaFirma));

        elem = properties.add(null, C.TA_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(1256, "")); // Talonario
        elem.setKey(K_TA_ID);
        elem.setValue(m_talonario);
        elem.setSelectId(m_ta_id);

        elem = properties.add(null, C.MON_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setName(getText(1113, "")); // Moneda
        elem.setKey(K_MON_ID);
        elem.setValue(m_moneda);
        elem.setSelectId(m_mon_id);

        c = properties.add(null, C.DOC_ID_ASIENTO);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CSDocumento);
        c.setSelectFilter(pGetAsIdFilter(m_emp_id));
        c.setName(getText(2596, "")); // Documento Asiento
        c.setValue(m_documentoAsiento);
        c.setSelectId(m_doc_id_Asiento);
        c.setKey(K_DOC_ID_ASIENTO);

        o = c;
        o.setSelectNoUseActive(true);

      };

      var pShowDepositoBanco = function() {
        var c = null;
        var o = null;

        var properties = m_dialog.getProperties();

        elem = properties.add(null, C.DOC_LLEVA_FIRMA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2582, "")); // Lleva Firma
        elem.setKey(K_LLEVA_FIRMA);
        elem.setValue(Integer.parseInt(m_llevaFirma));

        elem = properties.add(null, C.TA_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(1256, "")); // Talonario
        elem.setKey(K_TA_ID);
        elem.setValue(m_talonario);
        elem.setSelectId(m_ta_id);

        c = properties.add(null, C.DOC_ID_ASIENTO);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CSDocumento);
        c.setSelectFilter(pGetAsIdFilter(m_emp_id));
        c.setName(getText(2596, "")); // Documento Asiento
        c.setValue(m_documentoAsiento);
        c.setSelectId(m_doc_id_Asiento);
        c.setKey(K_DOC_ID_ASIENTO);

        o = c;
        o.setSelectNoUseActive(true);

      };

      var pShowFacturaVenta = function() {
        var c = null;
        var o = null;

        var iTab = null;

        iTab = m_dialog.getTabs().add(iTab);
        iTab.setIndex(m_dialog.getTabs().count() - 1);
        iTab.setName(getText(2581, "")); // Configuración

        var properties = m_dialog.getProperties();

        elem = properties.add(null, C.DOC_LLEVA_FIRMA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2582, "")); // Lleva Firma
        elem.setKey(K_LLEVA_FIRMA);
        elem.setValue(Integer.parseInt(m_llevaFirma));

        elem = properties.add(null, C.DOC_LLEVA_FIRMA_PRINT0);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(3495, "")); // Lleva Firma por Importes en Cero
        elem.setKey(K_LLEVA_FIRMA_PRINT_0);
        elem.setValue(Integer.parseInt(m_llevaFirmaPrint0));

        elem = properties.add(null, C.MON_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setName(getText(1113, "")); // Moneda
        elem.setKey(K_MON_ID);
        elem.setValue(m_moneda);
        elem.setSelectId(m_mon_id);

        elem = properties.add(null, C.CUEG_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTAGRUPO);
        elem.setName(getText(2597, "")); // Cuenta Grupo
        elem.setValue(m_cuentaGrupo);
        elem.setSelectId(m_cueg_id);
        elem.setKey(K_CUEG_ID);
        elem.setSelectFilter("cueg_tipo = 4");

        c = properties.add(null, C.DOC_ID_ASIENTO);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CSDocumento);
        c.setSelectFilter(pGetAsIdFilter(m_emp_id));
        c.setName(getText(2596, "")); // Documento Asiento
        c.setValue(m_documentoAsiento);
        c.setSelectId(m_doc_id_Asiento);
        c.setKey(K_DOC_ID_ASIENTO);

        o = c;
        o.setSelectNoUseActive(true);

        elem = properties.add(null, C.TA_ID_INSCRIPTO);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(2598, "")); // Talonario Inscripto
        elem.setKey(K_TA_ID_INSCRIPTO);
        elem.setValue(m_talonarioInscripto);
        elem.setSelectId(m_ta_id_Inscripto);
        elem.setTabIndex(iTab.getIndex());
        elem.setSelectFilter("emp_id = "+ m_emp_id);

        elem = properties.add(null, C.TA_ID_FINAL);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(2599, "")); // Talonario Exento/Mono/C.F.
        elem.setKey(K_TA_ID_FINAL);
        elem.setValue(m_talonarioFinal);
        elem.setSelectId(m_ta_id_Final);
        elem.setTabIndex(iTab.getIndex());
        elem.setSelectFilter("emp_id = "+ m_emp_id);

        elem = properties.add(null, C.TA_ID_EXTERNO);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(2600, "")); // Talonario Externo
        elem.setKey(K_TA_ID_EXTERNO);
        elem.setValue(m_talonarioExterno);
        elem.setSelectId(m_ta_id_Externo);
        elem.setTabIndex(iTab.getIndex());
        elem.setSelectFilter("emp_id = "+ m_emp_id);

        elem = properties.add(null, C_FACTURA_DIRECTA);
        elem.setType(Dialogs.PropertyType.option);
        elem.setOptionGroup(0);
        elem.setName(getText(2589, "")); // Sin documento previo
        elem.setKey(K_FV_DIRECTA);
        elem.setValue(0);
        elem.setTabIndex(iTab.getIndex());

        elem = properties.add(null, C_FACTURA_DESDE_PEDIDO);
        elem.setType(Dialogs.PropertyType.option);
        elem.setOptionGroup(0);
        elem.setName(getText(2590, "")); // Desde pedido de venta
        elem.setKey(K_FV_DESDE_PV);
        elem.setValue(0);
        elem.setTabIndex(iTab.getIndex());

        elem = properties.add(null, C_FACTURA_DESDE_REMITO);
        elem.setType(Dialogs.PropertyType.option);
        elem.setOptionGroup(0);
        elem.setName(getText(2591, "")); // Desde remito
        elem.setKey(K_FV_DESDE_RV);
        elem.setValue(0);
        elem.setTabIndex(iTab.getIndex());

        elem = properties.add(null, C_FACTURA_DESDE_PACKING_LIST);
        elem.setType(Dialogs.PropertyType.option);
        elem.setOptionGroup(0);
        elem.setName(getText(2601, "")); // Desde Packing List
        elem.setKey(K_FV_DESDE_PKLST);
        elem.setValue(0);
        elem.setTabIndex(iTab.getIndex());

        elem = properties.add(null, C_FACTURA_DESDE_PROYECTO);
        elem.setType(Dialogs.PropertyType.option);
        elem.setOptionGroup(0);
        elem.setName(getText(2602, "")); // Desde proyectos
        elem.setKey(K_FV_DESDE_PROY);
        elem.setValue(0);
        elem.setTabIndex(iTab.getIndex());

        switch (m_tipoFactura) {
          case csETFacDirecta:
            m_dialog.getProperties().item(C_FACTURA_DIRECTA).setValue(1);
            break;

          case csETFacPedido:
            m_dialog.getProperties().item(C_FACTURA_DESDE_PEDIDO).setValue(1);
            break;

          case csETFacRemito:
            m_dialog.getProperties().item(C_FACTURA_DESDE_REMITO).setValue(1);
            break;

          case csETFacPackingList:
            m_dialog.getProperties().item(C_FACTURA_DESDE_PACKING_LIST).setValue(1);
            break;

          case csETFacProyecto:
            m_dialog.getProperties().item(C_FACTURA_DESDE_PROYECTO).setValue(1);
            break;
        }

        elem = properties.add(null, C.DOC_GENERA_REMITO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2603, "")); // Genera Remito
        elem.setKey(K_GENERA_REMITO);
        elem.setValue(Integer.parseInt(m_generaRemito));
        elem.setTabIndex(iTab.getIndex());

        c = properties.add(null, C.DOC_ID_REMITO);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CSDocumento);
        c.setSelectFilter("'emp_id = "+ m_emp_id+ " and doct_id = "+ D.Types.REMITO_VENTA.toString()+ "'");
        c.setName(getText(2604, "")); // Documento Remito
        c.setValue(m_documentoRemito);
        c.setSelectId(m_doc_id_Remito);
        c.setKey(K_DOC_ID_REMITO);
        c.setTabIndex(iTab.getIndex());

        o = c;
        o.setSelectNoUseActive(true);

        elem = properties.add(null, C.DOC_MUEVE_STOCK);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2588, "")); // Mueve Stock
        elem.setKey(K_MUEVE_STOCK);
        elem.setValue(Integer.parseInt(m_mueveStock));
        elem.setTabIndex(iTab.getIndex());

        c = properties.add(null, C.DOC_ID_STOCK);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CSDocumento);
        c.setSelectFilter("'emp_id = "+ m_emp_id+ " and doct_id = "+ D.Types.TRASFERENCIASTOCK.toString()+ "'");
        c.setName(getText(2580, "")); // Documento Stock
        c.setValue(m_documentoStock);
        c.setSelectId(m_doc_id_Stock);
        c.setKey(K_DOC_ID_STOCK);
        c.setTabIndex(iTab.getIndex());

        o = c;
        o.setSelectNoUseActive(true);

        elem = properties.add(null, C.DOC_ES_CREDITOBANCO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(3695, "")); // Factura de Aval x Credito Bancario
        elem.setKey(K_ES_CREDITO_BANCO);
        elem.setValue(Integer.parseInt(m_esCreditoBanco));

        elem = properties.add(null, C.DOC_ES_VENTA_ACCION);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(3696, "")); // Factura por Venta de Acciones
        elem.setKey(K_ES_VENTA_ACCION);
        elem.setValue(Integer.parseInt(m_esVentaAccion));

        elem = properties.add(null, C.DOC_ES_VENTA_CHEQUE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(3697, "")); // Factura por Venta de Cheques en Bolsa de Comercio
        elem.setKey(K_ES_VENTA_CHEQUE);
        elem.setValue(Integer.parseInt(m_esVentaCheque));

        elem = properties.add(null, C.DOCES_FACTURA_ELECTRONICA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(5123, "")); // Factura Electronica
        elem.setKey(K_FACTURA_ELECTRONICA);
        elem.setValue(Integer.parseInt(m_esFacturaElectronica));
        elem.setTabIndex(iTab.getIndex());

        elem = properties.add(null, C.DOC_FV_SIN_PERCEPCION);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2605, "")); // Sin Percepción
        elem.setKey(K_FV_SIN_PERCEPCION);
        elem.setValue(Integer.parseInt(m_fv_SinPercepcion));
        elem.setTabIndex(iTab.getIndex());

        m_topDescrip = 4500;
      };

      var pShowFacturaCompra = function() {
        var c = null;
        var o = null;

        var iTab = null;

        iTab = m_dialog.getTabs().add(iTab);
        iTab.setIndex(m_dialog.getTabs().count() - 1);
        iTab.setName(getText(2581, "")); // Configuración

        var properties = m_dialog.getProperties();

        elem = properties.add(null, C.DOC_LLEVA_FIRMA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2582, "")); // Lleva Firma
        elem.setKey(K_LLEVA_FIRMA);
        elem.setValue(Integer.parseInt(m_llevaFirma));

        elem = properties.add(null, C.DOC_ES_RESUMEN_BCO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(3584, "")); // Es un Resumen Bancario
        elem.setKey(K_ES_RESUMEN_BCO);
        elem.setValue(Integer.parseInt(m_esResumenBco));

        elem = properties.add(null, C.MON_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setName(getText(1113, "")); // Moneda
        elem.setKey(K_MON_ID);
        elem.setValue(m_moneda);
        elem.setSelectId(m_mon_id);

        elem = properties.add(null, C.CUEG_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTAGRUPO);
        elem.setName(getText(2597, "")); // Cuenta grupo
        elem.setValue(m_cuentaGrupo);
        elem.setSelectId(m_cueg_id);
        elem.setKey(K_CUEG_ID);
        elem.setSelectFilter("cueg_tipo = 3");

        c = properties.add(null, C.DOC_ID_ASIENTO);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CSDocumento);
        c.setSelectFilter(pGetAsIdFilter(m_emp_id));
        c.setName(getText(2596, "")); // Documento Asiento
        c.setValue(m_documentoAsiento);
        c.setSelectId(m_doc_id_Asiento);
        c.setKey(K_DOC_ID_ASIENTO);

        o = c;
        o.setSelectNoUseActive(true);

        elem = properties.add(null, C.TA_ID_INSCRIPTO);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(2598, "")); // Talonario Inscripto
        elem.setKey(K_TA_ID_INSCRIPTO);
        elem.setValue(m_talonarioInscripto);
        elem.setSelectId(m_ta_id_Inscripto);
        elem.setTabIndex(iTab.getIndex());
        elem.setSelectFilter("emp_id = "+ m_emp_id);

        elem = properties.add(null, C.TA_ID_FINAL);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(2599, "")); // Talonario Exento/Mono/C.F./R.N.I.
        elem.setKey(K_TA_ID_FINAL);
        elem.setValue(m_talonarioFinal);
        elem.setSelectId(m_ta_id_Final);
        elem.setTabIndex(iTab.getIndex());
        elem.setSelectFilter("emp_id = "+ m_emp_id);

        elem = properties.add(null, C.TA_ID_EXTERNO);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(2600, "")); // Talonario Externo
        elem.setKey(K_TA_ID_EXTERNO);
        elem.setValue(m_talonarioExterno);
        elem.setSelectId(m_ta_id_Externo);
        elem.setTabIndex(iTab.getIndex());
        elem.setSelectFilter("emp_id = "+ m_emp_id);

        elem = properties.add(null, C.TA_ID_INSCRIPTO_M);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(2606, "")); // Talonario Inscripto M
        elem.setKey(K_TA_ID_INSCRIPTOM);
        elem.setValue(m_talonarioInscriptoM);
        elem.setSelectId(m_ta_id_InscriptoM);
        elem.setTabIndex(iTab.getIndex());
        elem.setSelectFilter("emp_id = "+ m_emp_id);

        elem = properties.add(null, C_FACTURA_DIRECTA);
        elem.setType(Dialogs.PropertyType.option);
        elem.setOptionGroup(0);
        elem.setName(getText(2589, "")); // Sin documento previo
        elem.setKey(K_FC_DIRECTA);
        elem.setValue(0);
        elem.setTabIndex(iTab.getIndex());

        elem = properties.add(null, C_FACTURA_DESDE_ORDEN);
        elem.setType(Dialogs.PropertyType.option);
        elem.setOptionGroup(0);
        elem.setName(getText(2607, "")); // Desde Orden de Compra
        elem.setKey(K_FC_DESDE_OC);
        elem.setValue(0);
        elem.setTabIndex(iTab.getIndex());

        elem = properties.add(null, C_FACTURA_DESDE_REMITO);
        elem.setType(Dialogs.PropertyType.option);
        elem.setOptionGroup(0);
        elem.setName(getText(2591, "")); // Desde remito
        elem.setKey(K_FC_DESDE_RC);
        elem.setValue(0);
        elem.setTabIndex(iTab.getIndex());

        switch (m_tipoFactura) {
          case csETFacDirecta:
            m_dialog.getProperties().item(C_FACTURA_DIRECTA).setValue(1);
            break;

          case csETFacOrden:
            m_dialog.getProperties().item(C_FACTURA_DESDE_ORDEN).setValue(1);
            break;

          case csETFacRemito:
            m_dialog.getProperties().item(C_FACTURA_DESDE_REMITO).setValue(1);
            break;
        }

        elem = properties.add(null, C.DOC_GENERA_REMITO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2603, "")); // Genera Remito
        elem.setKey(K_GENERA_REMITO);
        elem.setValue(Integer.parseInt(m_generaRemito));
        elem.setTabIndex(iTab.getIndex());

        c = properties.add(null, C.DOC_ID_REMITO);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CSDocumento);
        c.setSelectFilter("'emp_id = "+ m_emp_id+ " and doct_id = "+ D.Types.REMITO_COMPRA.toString()+ "'");
        c.setName(getText(2604, "")); // Documento Remito
        c.setValue(m_documentoRemito);
        c.setSelectId(m_doc_id_Remito);
        c.setKey(K_DOC_ID_REMITO);
        c.setTabIndex(iTab.getIndex());

        o = c;
        o.setSelectNoUseActive(true);

        elem = properties.add(null, C.DOC_MUEVE_STOCK);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2588, "")); // Mueve Stock
        elem.setKey(K_MUEVE_STOCK);
        elem.setValue(Integer.parseInt(m_mueveStock));
        elem.setTabIndex(iTab.getIndex());

        c = properties.add(null, C.DOC_ID_STOCK);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CSDocumento);
        c.setSelectFilter("'emp_id = "+ m_emp_id+ " and doct_id = "+ D.Types.TRASFERENCIASTOCK.toString()+ "'");
        c.setName(getText(2580, "")); // Documento Stock
        c.setValue(m_documentoStock);
        c.setSelectId(m_doc_id_Stock);
        c.setKey(K_DOC_ID_STOCK);
        c.setTabIndex(iTab.getIndex());

        o = c;
        o.setSelectNoUseActive(true);

        elem = properties.add(null, C.DOCG_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(csDocumentoGrupo);
        elem.setName(getText(1404, "")); //  Grupo
        elem.setValue(m_documentoGrupo);
        elem.setSelectId(m_docg_id);
        elem.setTabIndex(iTab.getIndex());
        elem.setKey(K_DOCG_ID);

      };

      var pShowPresupuestoEnvio = function() {

        var properties = m_dialog.getProperties();

        elem = properties.add(null, C.DOC_LLEVA_FIRMA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2582, "")); // Lleva Firma
        elem.setKey(K_LLEVA_FIRMA);
        elem.setValue(Integer.parseInt(m_llevaFirma));

        elem = properties.add(null, C.TA_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(1256, "")); // Talonario
        elem.setKey(K_TA_ID);
        elem.setValue(m_talonario);
        elem.setSelectId(m_ta_id);

        elem = properties.add(null, C.MON_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setName(getText(1113, "")); // Moneda
        elem.setKey(K_MON_ID);
        elem.setValue(m_moneda);
        elem.setSelectId(m_mon_id);
      };

      var pShowCobranza = function() {
        var c = null;
        var o = null;

        var properties = m_dialog.getProperties();

        elem = properties.add(null, C.DOC_LLEVA_FIRMA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2582, "")); // Lleva Firma
        elem.setKey(K_LLEVA_FIRMA);
        elem.setValue(Integer.parseInt(m_llevaFirma));

        elem = properties.add(null, C.TA_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(1256, "")); // Talonario
        elem.setKey(K_TA_ID);
        elem.setValue(m_talonario);
        elem.setSelectId(m_ta_id);
        elem.setSelectFilter("emp_id = "+ m_emp_id);

        c = properties.add(null, C.DOC_ID_ASIENTO);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CSDocumento);
        c.setSelectFilter(pGetAsIdFilter(m_emp_id));
        c.setName(getText(2596, "")); // Documento Asiento
        c.setValue(m_documentoAsiento);
        c.setSelectId(m_doc_id_Asiento);
        c.setKey(K_DOC_ID_ASIENTO);

        o = c;
        o.setSelectNoUseActive(true);

        elem = properties.add(null, C.DOC_ES_COB_CHEQUE_SGR);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(3698, "")); // Es cobranza de cheques comerciados en la bolsa de comercio
        elem.setKey(K_ES_COB_CHEQUE_SGR);
        elem.setValue(Integer.parseInt(m_esCobChequesgr));

        elem = properties.add(null, C.DOC_ES_COB_CAIDA_SGR);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(3699, "")); // Es cobranza de cheques o prestamos caidos
        elem.setKey(K_ES_COB_CAIDA_SGR);
        elem.setValue(Integer.parseInt(m_esCobCaidasgr));

        m_topDescrip = 3800;

      };

      var pShowORDEN_PAGO = function() {
        var c = null;
        var o = null;

        var properties = m_dialog.getProperties();

        elem = properties.add(null, C.DOC_LLEVA_FIRMA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2582, "")); // Lleva Firma
        elem.setKey(K_LLEVA_FIRMA);
        elem.setValue(Integer.parseInt(m_llevaFirma));

        elem = properties.add(null, C.TA_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(1256, "")); // Talonario
        elem.setKey(K_TA_ID);
        elem.setValue(m_talonario);
        elem.setSelectId(m_ta_id);
        elem.setSelectFilter("emp_id = "+ m_emp_id);

        c = properties.add(null, C.DOC_ID_ASIENTO);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CSDocumento);
        c.setSelectFilter(pGetAsIdFilter(m_emp_id));
        c.setName(getText(2596, "")); // Documento Asiento
        c.setValue(m_documentoAsiento);
        c.setSelectId(m_doc_id_Asiento);
        c.setKey(K_DOC_ID_ASIENTO);

        o = c;
        o.setSelectNoUseActive(true);

      };

      var pShowORDEN_COMPRA = function() {

        var iTab = null;

        iTab = m_dialog.getTabs().add(iTab);
        iTab.setIndex(m_dialog.getTabs().count() - 1);
        iTab.setName(getText(2581, "")); // Configuración

        var properties = m_dialog.getProperties();

        elem = properties.add(null, C_ORDEN_DIRECTA);
        elem.setType(Dialogs.PropertyType.option);
        elem.setOptionGroup(0);
        elem.setName(getText(2589, "")); // Sin documento previo
        elem.setKey(K_OC_DIRECTA);
        elem.setValue(0);
        elem.setTabIndex(iTab.getIndex());

        elem = properties.add(null, C_ORDEN_DESDE_PEDIDO);
        elem.setType(Dialogs.PropertyType.option);
        elem.setOptionGroup(0);
        elem.setName(getText(2608, "")); // Desde pedido
        elem.setKey(K_OC_DESDE_PC);
        elem.setValue(0);
        elem.setTabIndex(iTab.getIndex());

        elem = properties.add(null, C_ORDEN_DESDE_PRESUPUESTO);
        elem.setType(Dialogs.PropertyType.option);
        elem.setOptionGroup(0);
        elem.setName(getText(2609, "")); // Desde presupuesto
        elem.setKey(K_OC_DESDE_PRC);
        elem.setValue(0);
        elem.setTabIndex(iTab.getIndex());

        switch (m_tipoORDEN_COMPRA) {
          case csETOrdenDirecta:
            m_dialog.getProperties().item(C_ORDEN_DIRECTA).setValue(1);
            break;

          case csETOrdenPedido:
            m_dialog.getProperties().item(C_ORDEN_DESDE_PEDIDO).setValue(1);
            break;

          case csETOrdenPresupuesto:
            m_dialog.getProperties().item(C_ORDEN_DESDE_PRESUPUESTO).setValue(1);
            break;
        }
      };

      var pShowLiquidacion = function() {
        var c = null;
        var o = null;

        var properties = m_dialog.getProperties();

        elem = properties.add(null, C.DOC_LLEVA_FIRMA);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(2582, "")); // Lleva Firma
        elem.setKey(K_LLEVA_FIRMA);
        elem.setValue(Integer.parseInt(m_llevaFirma));

        elem = properties.add(null, C.TA_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(1256, "")); // Talonario
        elem.setKey(K_TA_ID);
        elem.setValue(m_talonario);
        elem.setSelectId(m_ta_id);

        elem = properties.add(null, C.TA_ID_HABERES);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(4641, "")); // Talonario de Recibo
        elem.setKey(K_TA_ID_HABERES);
        elem.setValue(m_talonarioHaberes);
        elem.setSelectId(m_ta_id_Haberes);

        elem = properties.add(null, C.MON_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setName(getText(1113, "")); // Moneda
        elem.setKey(K_MON_ID);
        elem.setValue(m_moneda);
        elem.setSelectId(m_mon_id);

        c = properties.add(null, C.DOC_ID_ASIENTO);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CSDocumento);
        c.setSelectFilter(pGetAsIdFilter(m_emp_id));
        c.setName(getText(2596, "")); // Documento Asiento
        c.setValue(m_documentoAsiento);
        c.setSelectId(m_doc_id_Asiento);
        c.setKey(K_DOC_ID_ASIENTO);

        o = c;
        o.setSelectNoUseActive(true);

      };

      var pShowReportes = function() {
        var iTab = null;
        var c = null;

        iTab = m_dialog.getTabs().add(iTab);
        iTab.setIndex(m_dialog.getTabs().count() - 1);
        iTab.setName(getText(2577, "")); // Reportes

        var properties = m_dialog.getProperties();

        c = properties.add(null, C_REPORTES);
        c.setType(Dialogs.PropertyType.grid);
        c.hideLabel();;
        if(!pLoadReportes(c)) { return; }
        // TODO VER CON JAVIER
        c.setName("Reportes");
        c.setKey(K_REPORTES);
        c.setTabIndex(iTab.getIndex());
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);
      };

      var pShowFirmas = function() {
        var iTab = null;
        var c = null;

        if(!(m_llevaFirma || m_llevaFirmaCredito || m_llevaFirmaPrint0)) { return; }

        iTab = m_dialog.getTabs().add(iTab);
        iTab.setIndex(m_dialog.getTabs().count() - 1);
        iTab.setName(getText(2610, "")); // Firmas

        var properties = m_dialog.getProperties();

        c = properties.add(null, C_FIRMAS);
        c.setType(Dialogs.PropertyType.grid);
        c.hideLabel();;
        if(!pLoadFirmas(c)) { return; }
        c.setName("Firmas");
        c.setKey(K_FIRMAS);
        c.setTabIndex(iTab.getIndex());
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        m_firmasDeleted = "";
      };

      var isEmptyRow = function(row, rowIndex) {
        var cell = null;

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_NOMBRE:
              if(!valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KI_CSRFILE:
              if(!valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var isEmptyRowFirmas = function(row, rowIndex) {
        var cell = null;

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_US_ID:
              if(!valEmpty(cell.getId(), Types.id)) {
                bRowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pChangeEmpresa = function() {
        var emp_id = null;
        var abmObj = null;

        abmObj = m_dialog;

        var properties = m_dialog.getProperties();

        emp_id = properties.item(C.EMP_ID).getSelectId();

        switch (m_doct_id) {

          case D.Types.FACTURA_VENTA:
          case D.Types.NOTA_CREDITO_VENTA:
          case D.Types.NOTA_DEBITO_VENTA:

            var property = properties.item(C.DOC_ID_ASIENTO);
            property.setSelectFilter(pGetAsIdFilter(emp_id));
            m_dialog.validateProp(null, C.DOC_ID_ASIENTO);

            var property = properties.item(C.TA_ID_INSCRIPTO);
            property.setSelectFilter("emp_id:" + emp_id.toString());
            m_dialog.validateProp(null, C.TA_ID_INSCRIPTO);

            var property = properties.item(C.TA_ID_FINAL);
            property.setSelectFilter("emp_id:" + emp_id.toString());
            m_dialog.validateProp(null, C.TA_ID_FINAL);

            var property = properties.item(C.TA_ID_EXTERNO);
            property.setSelectFilter("emp_id:" + emp_id.toString());
            m_dialog.validateProp(null, C.TA_ID_EXTERNO);

            var property = properties.item(C.DOC_ID_REMITO);
            property.setSelectFilter("'emp_id = "+ emp_id.toString()+ " and doct_id = "+ D.Types.REMITO_VENTA.toString()+ "'");
            m_dialog.validateProp(null, C.DOC_ID_REMITO);

            var property = properties.item(C.DOC_ID_STOCK);
            property.setSelectFilter("'emp_id = "+ emp_id.toString()+ " and doct_id = "+ D.Types.TRASFERENCIASTOCK.toString()+ "'");
            m_dialog.validateProp(null, C.DOC_ID_STOCK);

            break;

          case D.Types.FACTURA_COMPRA:
          case D.Types.NOTA_CREDITO_COMPRA:
          case D.Types.NOTA_DEBITO_COMPRA:

            var property = properties.item(C.DOC_ID_ASIENTO);
            property.setSelectFilter("'emp_id = "+ emp_id.toString()+ " and doct_id = "+ D.Types.ASIENTOCONTABLE.toString()+ "'");
            m_dialog.validateProp(null, C.DOC_ID_ASIENTO);

            var property = properties.item(C.TA_ID_INSCRIPTO);
            property.setSelectFilter("emp_id:" + emp_id.toString());
            m_dialog.validateProp(null, C.TA_ID_INSCRIPTO);

            var property = properties.item(C.TA_ID_FINAL);
            property.setSelectFilter("emp_id:" + emp_id.toString());
            m_dialog.validateProp(null, C.TA_ID_FINAL);

            var property = properties.item(C.TA_ID_EXTERNO);
            property.setSelectFilter("emp_id:" + emp_id.toString());
            m_dialog.validateProp(null, C.TA_ID_EXTERNO);

            var property = properties.item(C.TA_ID_INSCRIPTO_M);
            property.setSelectFilter("emp_id:" + emp_id.toString());
            m_dialog.validateProp(null, C.TA_ID_INSCRIPTO_M);

            var property = properties.item(C.DOC_ID_REMITO);
            property.setSelectFilter("'emp_id = "+ emp_id.toString()+ " and doct_id = "+ D.Types.REMITO_COMPRA.toString()+ "'");
            m_dialog.validateProp(null, C.DOC_ID_REMITO);

            var property = properties.item(C.DOC_ID_STOCK);
            property.setSelectFilter("'emp_id = "+ emp_id.toString()+ " and doct_id = "+ D.Types.TRASFERENCIASTOCK.toString()+ "'");
            m_dialog.validateProp(null, C.DOC_ID_STOCK);

            break;

          case D.Types.REMITO_VENTA:
          case D.Types.DEVOLUCION_REMITO_VTA:

            var property = properties.item(C.TA_ID);
            property.setSelectFilter("emp_id:" + emp_id.toString());
            m_dialog.validateProp(null, C.TA_ID);

            var property = properties.item(C.DOC_ID_STOCK);
            property.setSelectFilter("'emp_id = "+ emp_id.toString()+ " and doct_id = "+ D.Types.TRASFERENCIASTOCK.toString()+ "'");
            m_dialog.validateProp(null, C.DOC_ID_STOCK);

            //     Case csEDT_PackingList, csEDT_PackingListDevolucion
            //       pShowPackingList
            //     Case csEDT_ManifiestoCarga
            //       pShowManifiestoCarga
            //     Case csEDT_PermisoEmbarque
            //       pShowPermisoEmbarque
            break;

          case D.Types.ORDEN_SERVICIO:

            var property = properties.item(C.TA_ID);
            property.setSelectFilter("emp_id:" + emp_id.toString());
            m_dialog.validateProp(null, C.TA_ID);

            var property = properties.item(C.DOC_ID_STOCK);
            property.setSelectFilter("'emp_id = "+ emp_id.toString()+ " and doct_id = "+ D.Types.TRASFERENCIASTOCK.toString()+ "'");
            m_dialog.validateProp(null, C.DOC_ID_STOCK);

            break;

          case D.Types.REMITO_COMPRA:
          case D.Types.DEVOLUCION_REMITO_CPRA:

            var property = properties.item(C.TA_ID);
            property.setSelectFilter("emp_id:" + emp_id.toString());
            m_dialog.validateProp(null, C.TA_ID);

            var property = properties.item(C.DOC_ID_STOCK);
            property.setSelectFilter("'emp_id = "+ emp_id.toString()+ " and doct_id = "+ D.Types.TRASFERENCIASTOCK.toString()+ "'");
            m_dialog.validateProp(null, C.DOC_ID_STOCK);

            break;

          case D.Types.IMPORTACION_TEMP:
            var property = properties.item(C.DOC_ID_STOCK);
            property.setSelectFilter("'emp_id = "+ emp_id.toString()+ " and doct_id = "+ D.Types.TRASFERENCIASTOCK.toString()+ "'");
            m_dialog.validateProp(null, C.DOC_ID_STOCK);

            //     Case csEDT_PedidoVenta, csEDT_DevolucionPedidoVta
            //       pShowDoc
            //     Case csEDT_PedidoCompra, csEDT_DEVOLUCION_PEDIDO_CPRA
            //       pShowDoc
            //     Case csEDT_PRESUPUESTO_VENTA, csEDT_DEVOLUCION_PRESU_VTA
            //       pShowDoc
            //     Case csEDT_PRESUPUESTO_COMPRA, csEDT_DEVOLUCION_PRESU_CPRA
            //       pShowDoc
            //     Case csEDT_ORDEN_COMPRA, csEDT_DEVOLUCION_ORDEN_CPRA
            //       pShowDoc
            //       pShowORDEN_COMPRA
            //     Case csEDT_COTIZACION_COMPRA, csEDT_DEVOLUCION_COTIZACION_CPRA
            //       pShowDoc
            break;

          case D.Types.MOVIMIENTO_FONDO:
            var property = properties.item(C.DOC_ID_ASIENTO);
            property.setSelectFilter("'emp_id = "+ emp_id.toString()+ " and doct_id = "+ D.Types.ASIENTOCONTABLE.toString()+ "'");
            m_dialog.validateProp(null, C.DOC_ID_ASIENTO);

            break;

          case D.Types.DEPOSITO_BANCO:
          case D.Types.DEPOSITO_CUPON:
          case D.Types.RESOLUCION_CUPON:
            var property = properties.item(C.DOC_ID_ASIENTO);
            property.setSelectFilter("'emp_id = "+ emp_id.toString()+ " and doct_id = "+ D.Types.ASIENTOCONTABLE.toString()+ "'");
            m_dialog.validateProp(null, C.DOC_ID_ASIENTO);

            break;

          case D.Types.COBRANZA:
            var property = properties.item(C.TA_ID);
            property.setSelectFilter("emp_id:" + emp_id.toString());
            m_dialog.validateProp(null, C.TA_ID);

            var property = properties.item(C.DOC_ID_ASIENTO);
            property.setSelectFilter("'emp_id = "+ emp_id.toString()+ " and doct_id = "+ D.Types.ASIENTOCONTABLE.toString()+ "'");
            m_dialog.validateProp(null, C.DOC_ID_ASIENTO);

            break;

          case D.Types.RECUENTO_STOCK:
          case D.Types.PARTE_PROD_KIT:
          case D.Types.PARTE_DESARME_KIT:
          case D.Types.PARTE_REPARACION:
          case D.Types.STOCK_PROVEEDOR:
          case D.Types.STOCK_CLIENTE:

            var property = properties.item(C.DOC_ID_STOCK);
            property.setSelectFilter("'emp_id = "+ emp_id.toString()+ " and doct_id = "+ D.Types.TRASFERENCIASTOCK.toString()+ "'");
            m_dialog.validateProp(null, C.DOC_ID_STOCK);

            break;

          case D.Types.ORDEN_PAGO:
            var property = properties.item(C.TA_ID);
            property.setSelectFilter("emp_id:" + emp_id.toString());
            m_dialog.validateProp(null, C.TA_ID);

            var property = properties.item(C.DOC_ID_ASIENTO);
            property.setSelectFilter(D.ASIENTOS_DOC_FILTER + "|emp_id:"+ emp_id.toString());
            m_dialog.validateProp(null, C.DOC_ID_ASIENTO);

            break;
        }
      };

      var savePermisos1 = function(lastId, register) {
        var p = P.resolvedPromise(false);
        var copy = false;
        if(m_copy) {
          p = M.confirmViewYesDefault(
            getText(1622, ""), // CrowSoft
            getText(3478, "")  // desea copiar los permisos ?

          ).whenSuccess(function() {
            return copy = true;
          });
        }

        p = p.then(function() {
          register.getFields().add(C.DOC_COPY_PERMISSIONS, copy, Types.boolean);
        });

        return p;
      };

      var savePermisos2 = function(bIsNew) {
        if(bIsNew) {
          M.confirmViewYesDefault(
            getText(1622, ""), // CrowSoft
            getText(3525, "")  // desea editar los permisos ?

          ).whenSuccess(function() {
            self.messageEx(Dialogs.Message.MSG_EDIT_PERMISSIONS, null);
          });
        }
        return true;
      };


      // TODO: move to backend
      /*
      var pSavePermisos = function(idFrom, idTo, bIsNew) {
        var sqlstmt = null;

        if(m_copy) {
          if(Ask(getText(3478, "", m_name), vbYes)) {

            sqlstmt = "sp_DocumentoDuplicarPermisos "+ cUtil.getUser().getId().toString()+ ","+ idFrom.toString()+ ","+ idTo.toString();
            DB.execute(sqlstmt);

            //Refrezca la seguridad
            // 
            CSOAPI2.cIABMGenericListDoc.refresh();
          }
        }

        if(bIsNew) {
          if(Ask(getText(3525, ""), vbYes)) {
            self.messageEx(Dialogs.Message.MSG_EDIT_PERMISOS, null);
          }
        }
      };
      */
      
      var pGetAsIdFilter = function(emp_id) {
        return "'emp_id = "+ emp_id.toString()+ " and doct_id = "+ D.Types.ASIENTOCONTABLE.toString()+ " and activo <> 0'";
      };

      self.initialize = function() {
        try {

          c_ErrorSave = getText(2611, ""); // Error al grabar Documento

          //**TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "Class_Initialize", C_MODULE, "");
          //**TODO:** label found: ExitProc:;
        }
        //**TODO:** on error resume next found !!!
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

      initialize();

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("Documento.List", function(List, Cairo, Backbone, Marionette, $, _) {
    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.documentoEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.documentoEditors = editors;

          //ListController properties and methods
          // 
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Documentos",
            entityName: "documento",
            entitiesName: "documentos"
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
              var editor = Cairo.Documento.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_DOCUMENTO)) {
              return P.resolvedPromise(false);
            }
            var apiPath = DB.getAPIVersion();
            return DB.destroy(apiPath + "general/documento", id, Cairo.Constants.DELETE_FUNCTION, "Documento").success(
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

          //progress message
          // 
          Cairo.LoadingMessage.show("Documentos", "Loading documento from Crowsoft Cairo server.");

          //create the tree region
          // 
          Cairo.addRegions({ documentoTreeRegion: tabId });

          //create the dialog
          // 
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.DOCUMENTO,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.documentoTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        //create the tab
        // 
        Cairo.mainTab.showTab("Documentos", "documentoTreeRegion", "#general/documentos", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());
