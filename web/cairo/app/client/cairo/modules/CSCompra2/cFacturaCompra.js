(function() {
  "use strict";

  Cairo.module("FacturaCompra.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var TITLE = Cairo.Language.getText(1892, ""); // Facturas de Compra
      var SAVE_ERROR_MESSAGE = Cairo.Language.getText(1907, ""); // Error al grabar la factura de compra      
      
      var Dialogs = Cairo.Dialogs;
      var C = Cairo.General.Constants;
      var CC = Cairo.Compras.Constants;
      var CS = Cairo.Security.Actions.Compras;
      var Types = Cairo.Constants.Types;
      var bToI = Cairo.Util.boolToInt;
      var valField = Cairo.Database.valField;
      var getValue = Cairo.Database.getValue;
      var getDateValue = Cairo.Database.getDateValue;
      var Percepciones = Cairo.Compras.Percepciones;
      var call = Cairo.Promises.call;

      var C_MODULE = "cFacturaCompra";

      var C_ITEMS = "ITEMS";
      var C_OTROS = "OTROS";
      var C_PERCEPCIONES = "PERCEPCIONES";
      var C_LEGAJOS = "LEGAJOS";

      var C_HIDECOLSFC = "HideColsFc";

      var K_NUMERO = 1;
      var K_NRODOC = 2;
      var K_DESCRIP = 3;
      var K_FECHA = 4;
      var K_FECHA_ENTREGA = 5;
      var K_FECHA_IVA = 501;
      var K_FECHA_VTO = 500;
      var K_NETO = 6;
      var K_IVA_RI = 7;
      var K_IVA_RNI = 8;
      var K_INTERNOS = 101;
      var K_TOTAL = 9;
      var K_PROV_ID = 10;
      var K_DOC_ID = 11;
      var K_LP_ID = 13;
      var K_LD_ID = 14;
      var K_ITEMS = 15;
      var K_CPG_ID = 16;
      var K_EST_ID = 17;
      var K_CCOS_ID = 18;
      var K_SUC_ID = 19;
      var K_DESCUENTO1 = 20;
      var K_DESCUENTO2 = 21;
      var K_IMPORTE_DESC_1 = 22;
      var K_IMPORTE_DESC_2 = 23;
      var K_SUBTOTAL = 24;
      var K_COTIZACION = 25;
      var K_LGJ_ID = 27;
      var K_CAI = 28;

      var K_PRO_ID_ORIGEN = 29;
      var K_PRO_ID_DESTINO = 30;

      var K_OTROS = 31;
      var K_TOTAL_OTROS = 32;
      var K_PERCEPCIONES = 33;
      var K_TOTAL_PERCEPCIONES = 34;
      var K_LEGAJOS = 35;

      var K_DEPL_ID = 36;

      var K_TIPO_COMPRABANTE = 37;
      var K_COTIZACION_PROV = 40;

      var K_HIDECOLS = 41;

      var KI_TO_ID = 400;

      var KI_FCI_ID = 2;
      var KI_CANTIDAD = 4;
      var KI_DESCRIP = 6;
      var KI_PRECIO = 7;
      var KI_IMPORTE = 8;
      var KI_NETO = 9;
      var KI_IVA_RI = 10;
      var KI_IVA_RNI = 11;
      var KI_INTERNOS = 101;
      var KI_INTERNOS_PORC = 103;
      var KI_PR_ID = 13;
      var KI_IVA_RI_PERCENT = 16;
      var KI_IVA_RNI_PERCENT = 17;
      var KI_INTERNOS_PERCENT = 102;
      var KI_DESCUENTO = 18;
      var KI_UNIDAD = 19;
      var KI_PRECIO_LP = 20;
      var KI_PRECIO_USR = 21;
      var KI_CUE_ID = 23;
      var KI_CUE_ID_IVA_RI = 24;
      var KI_CUE_ID_IVA_RNI = 25;

      var KI_PR_LLEVA_NRO_SERIE = 30;
      var KI_NRO_SERIE = 31;
      var KI_GRUPO = 32;

      var KI_DEBE = 26;
      var KI_HABER = 27;
      var KI_FCOT_ID = 28;

      var KIL_LGJ_ID = 1;
      var KIL_FCLGJ_ID = 2;
      var KIL_IMPORTE = 3;
      var KIL_DESCRIP = 4;

      var KI_STL_ID = 26;
      var KI_STL_CODIGO = 29;
      var KI_PR_LLEVALOTE = 27;

      var m_id = 0;
      var m_numero = 0;
      var m_estado = "";
      var m_est_id = 0;
      var m_nrodoc = "";
      var m_descrip = "";
      var m_fecha = null;
      var m_fechaentrega = null;
      var m_fechaVto = null;
      var m_fechaIva = null;
      var m_neto = 0;
      var m_ivari = 0;
      var m_ivarni = 0;
      var m_internos = 0;
      var m_total = 0;
      var m_totalOtros = 0;
      var m_totalPercepciones = 0;
      var m_subTotal = 0;
      var m_descuento1 = 0;
      var m_descuento2 = 0;
      var m_importeDesc1 = 0;
      var m_importeDesc2 = 0;
      var m_cpg_id = 0;
      var m_condicionPago = "";
      var m_lgj_id = 0;
      var m_legajo = "";
      var m_cai = "";

      var m_pro_id_origen = 0;
      var m_proOrigen = "";
      var m_pro_id_destino = 0;
      var m_proDestino = "";

      var m_depl_id = 0;
      var m_deposito = "";

      var m_tipoComprobante;
      var m_cotizacion = 0;
      var m_cotizacionProv = 0;
      var m_ccos_id = 0;
      var m_centroCosto = "";
      var m_suc_id = 0;
      var m_sucursal = "";
      var m_prov_id = 0;
      var m_proveedor = "";
      var m_doc_id = 0;
      var m_documento = "";
      var m_doct_id = 0;
      var m_lp_id = 0;
      var m_listaPrecio = "";
      var m_ld_id = 0;
      var m_listaDescuento = "";
      var m_mon_id = 0;
      var m_lastMonIdCotizacion = 0;
      var m_creado = null;
      var m_modificado = null;
      var m_modifico = 0;
      var m_firmado;

      var m_lastFecha = null;

      var m_as_id = 0;
      var m_st_id = 0;

      var m_editing;

      var m_footer;
      var m_items;
      var m_dialog;
      var m_listController = null;

      var m_lastDocId = 0;
      var m_lastDocIdtId = 0;
      var m_lastProvId = 0;
      var m_lastDocName = "";
      var m_lastProvName = "";

      var m_lastCpgId = 0;

      var m_showStockData;

      var m_bIva;
      var m_bIvaRni;

      var m_isNew;

      var m_itemsDeleted = "";
      var m_otrosDeleted = "";
      var m_percepcionesDeleted = "";
      var m_legajosDeleted = "";

      var m_copy;

      var m_generalConfig;

      var m_docEditable;
      var m_docEditMsg = "";

      var m_taPropuesto;
      var m_taMascara = "";

      var m_objApply;

      var m_ocIds = 0;
      var m_rcIds = 0;

      var m_nrosSerie;

      var m_defaultCurrency = Cairo.Documents.getDefaultCurrency();
      var m_mon_id_document = 0;

      var m_apiPath = Cairo.Database.getAPIVersion();

      self.getEditorType = function() {
        return "document"
      };

      self.refresh = function() {
        load(m_id);
        refreshProperties();
      };

      self.terminateWizard = function(id) {
        if(id !== Cairo.Constants.NO_ID) {
          self.edit(id);
        }
      };

      self.showFacturaRemito = function(provId,  vRcIds) {
        try {

          m_prov_id = provId;

          Cairo.Database.getData("load[" + m_apiPath + "proveedor/info]", provId).then(function(response) {

            try {

              if(response.success === true) {

                m_proveedor = Cairo.Database.valField(response.data, C.PROV_NAME);

                m_rcIds = [];
                for(var i = 1; i < vRcIds.length; i++) {
                  m_rcIds[i] = vRcIds[i];
                }

                if(initMembers()) {
                  showStartWizardRemito();
                }
              }
            }
            catch (ex) {
              Cairo.manageErrorEx(ex.message, ex, "showFacturaRemito", C_MODULE, "");
            }

          });
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "showFacturaRemito", C_MODULE, "");
        }
      };

      var initMembers = function() {

        if(!Cairo.Security.docHasPermissionTo(
          CS.NEW_FACTURA,
          Cairo.Constants.NO_ID,
          Cairo.Security.ActionTypes.create)) {
          return false;
        }

        self.setDialog(Cairo.Dialogs.Views.Controller.newDialog());
        self.footer(Cairo.Dialogs.Views.Controller.newDialog());
        self.items(Cairo.Dialogs.Views.Controller.newDialog());

        return true;
      };

      self.showFacturaOrden = function(provId,  vOcIds) {
        try {

          m_prov_id = provId;

          Cairo.Database.getData("load[" + m_apiPath + "proveedor/info]", provId).then(function(response) {

            try {

              if(response.success === true) {

                m_proveedor = Cairo.Database.valField(response.data, C.PROV_NAME);

                m_ocIds = [];
                for(var i = 1; i < vOcIds.length + 1; i++) {
                  m_ocIds[i] = vOcIds[i];
                }

                if(initMembers()) {
                  showStartWizard();
                }
              }
            }
            catch (ex) {
              Cairo.manageErrorEx(ex.message, ex, "showFacturaOrden", C_MODULE, "");
            }

          });
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "ShowFacturaOrden", C_MODULE, "");
        }
      };
        
      self.copy = function() {

        if(!Cairo.Security.docHasPermissionTo(
            CS.NEW_FACTURA,
            m_doc_id,
            Cairo.Security.ActionTypes.create,
            true)) {
          return false;
        }

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, Cairo.Constants.NO_ID);
          
        m_copy = true;
        m_docEditable = true;
        m_docEditMsg = "";

        Cairo.Documents.getDocNumberForProveedor(m_lastProvId, m_lastDocId, m_dialog).then(
          function(enabled) {
            m_taPropuesto = enabled;
            setEnabled();
          }
        );
      };

      self.editNew = function() {

        var p;

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, Cairo.Constants.NO_ID);

        p = load(Cairo.Constants.NO_ID).then(function(ignored) {

          var p = null;

          m_lastProvId = Cairo.Constants.NO_ID;

          if(!m_docEditable) {
            if(m_docEditMsg !== "") {
              p = Cairo.Modal.showWarning(m_docEditMsg);
            }
          }

          return p || Cairo.Promises.resolvedPromise();

        }).then(function(ignored) {

          var p = null;

          var docId = m_dialog.getProperties().item(C.DOC_ID).getSelectId();

          if(docId === Cairo.Constants.NO_ID) {
            p = Cairo.Modal.showInfo(Cairo.Language.getText(1562, ""));
          }

          return p || Cairo.Promises.resolvedPromise();

        }).then(function(ignored){

          setDatosProveedor();
          return Cairo.Documents.getDocNumberForProveedor(m_lastProvId, m_lastDocId, m_dialog)

        }).then(function(enabled) {

          m_taPropuesto = enabled;
          setColorBackground();
          return refreshCollection();

        });

        return p;
      };

      self.getApplication = function() {
        return Cairo.appName;
      };

      self.editDocumentsEnabled = function() {
        return m_id !== Cairo.Constants.NO_ID;
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

          if(m_id === Cairo.Constants.NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(C.FACTURA_COMPRA);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "cIABMClient_ShowDocDigital", C_MODULE, "");
        }

        return _rtn;
      };

      self.messageEx = function(messageID,  info) {
        var p = null;

        switch (messageID) {
          case Dialogs.Message.MSG_DOC_FIRST:
          case Dialogs.Message.MSG_DOC_PREVIOUS:
          case Dialogs.Message.MSG_DOC_NEXT:
          case Dialogs.Message.MSG_DOC_LAST:

            p = move(messageID);
            break;

          case Dialogs.Message.MSG_DOC_SIGNATURE:

            p = signDocument();
            break;

          case Dialogs.Message.MSG_GRID_ROW_DELETED:

            updateTotals();
            break;

          case Dialogs.Message.MSG_DOC_APPLY:

            showApplyCation();
            break;

          case Dialogs.Message.MSG_DOC_EDIT_STATE:

            Cairo.Documents.showEditStatus(m_docEditMsg, Cairo.Language.getText(1889, ""));
            break;

          case Dialogs.Message.MSG_DOC_DELETE:

            p = self.deleteDocument(m_id).success(function() {
              return move(Dialogs.Message.MSG_DOC_NEXT);
            });            
            break;

          case Dialogs.Message.MSG_DOC_INVALIDATE:

            p = Cairo.Documents.docInvalidate(m_doct_id, m_id, m_dialog).then(function(result) {
              if(result.success === true) {
                m_est_id = result.estId;
                m_estado = result.estado;
                m_docEditable = result.editable;
                m_docEditMsg = result.message;
                setEnabled();
              }
            });
            break;

          case Dialogs.Message.MSG_DOC_REFRESH:

            p = load(m_id).then(function(success) {
              if(success === true) {
                refreshProperties();
              }
            });
            break;

          case Dialogs.Message.MSG_DOC_NEW_WITH_WIZARD:

            p = Cairo.Promises.resolvedPromise(true);
            break;

          case Dialogs.Message.MSG_DOC_EX_GET_ITEMS:

            p = Cairo.Promises.resolvedPromise(m_items);
            break;

          case Dialogs.Message.MSG_DOC_EX_GET_FOOTERS:

            p = Cairo.Promises.resolvedPromise(m_footer);
            break;

          case Dialogs.Message.MSG_DOC_SEARCH:

            Cairo.Documents.search(Cairo.Documents.FACTURA_COMPRA, self, Cairo.bool(info));
            break;

          case Dialogs.Message.MSG_DOC_DOC_AUX:

            if(m_id) {

              if(m_showStockData) {
                m_dialog.showPopMenu(Cairo.Language.getText(1890, "")+ "~1|"+ Cairo.Language.getText(1891, "")+ "~2");
                                      //&Ver Asiento~1|Ver Transferencia de Stock~2
              }
              else {
                Cairo.Documents.showDocAux(m_as_id, "Asiento");
              }
            }
            else {
              Cairo.Modal.showInfo(Cairo.Language.getText(1620, ""));
                                    //Debe editar un comprobante guardado para poder ver los documentos auxiliares
            }
            break;

          case Dialogs.Message.MSG_DOC_DOC_EDIT:

            if(m_id) {

              if(m_docEditable) {

                Cairo.Modal.showInfo(Cairo.Language.getText(1555, ""));
                                      //Este documento puede editarse normalmente
              }
              else {

                Cairo.Documents.docCanBeSaved(m_dialog, CC.FC_FECHA_IVA).then(function(canBeSaved) {
                  if(canBeSaved) {

                    var docId = getDocId().getSelectId();
                    var editDoc = null;
                    editDoc = new Cairo.EditDocEx.Edit.Controller.getEditor();

                    editDoc.setClient(self);
                    editDoc.setUseLegalCurrency(m_defaultCurrency === m_mon_id_document);
                    editDoc.setCotizacion(Cairo.Util.val(getCotizacion().getValue()));
                    editDoc.edit(m_id, m_doct_id, C.FACTURA_COMPRA, CC.FC_ID, C.FACTURA_COMPRA_ITEM, CC.FCI_ID, CS.NEW_FACTURA, CS.EDIT_FACTURA, Cairo.Constants.NO_ID, m_prov_id, true);
                  }                  
                });
              }
            }
            else {
              Cairo.Modal.showInfo(Cairo.Language.getText(1556, ""));
                                    //Esta opción solo sirve para modificar documentos guardados y aplicados
            }
            break;

          case Dialogs.Message.MSG_MENU_AUX:

            switch (Cairo.Util.val(info)) {

              case 1:
                Cairo.Documents.showDocAux(m_as_id, "Asiento");
                break;

              case 2:
                Cairo.Documents.showDocAux(m_st_id, "Stock");
                break;
            }
            break;

          case Dialogs.Message.MSG_DOC_DOC_ACTION:

            if(m_id) {
              showOrdenPago();
            }
            else {
              Cairo.Modal.showInfo(Cairo.Language.getText(1556, ""));
                                    //Esta opción solo sirve para modificar documentos guardados y aplicados
            }
            break;

          case Dialogs.Message.MSG_DOC_HISTORY:

            if(m_id !== Cairo.Constants.NO_ID) {
              Cairo.History.show(Cairo.Tables.FACTURAS_DE_COMPRA, m_id, m_documento + " " + m_nrodoc);
            }
            else {
              Cairo.Modal.showInfo(Cairo.Language.getText(1552, ""));
                                    // El documento aun no ha sido guardado
            }

            break;

          case Dialogs.Message.MSG_EXPORT_GET_EMAIL:

            var property = m_dialog.getProperties().item(C.PROV_ID);
            p = Cairo.Documents.getEmailFromProveedor(property.getSelectId());

            break;

          case Dialogs.Message.MSG_GRID_VIRTUAL_ROW:

            p = processMultiRow(info);

            break;

          case Dialogs.Message.MSG_EXPORT_GET_FILE_NAME_POSTFIX:

            p = getFileNamePostFix();

            break;
        }
        
        return p || Cairo.Promises.resolvedPromise();
      };

      self.discardChanges = function() {
        return Cairo.Promises.resolvedPromise(refreshCollection());
      };

      self.propertyChange = function(key) {
        
        var p = null;
        
        switch (key) {

          case K_DOC_ID:

            // if the document has changed
            //
            var changeInfo = Cairo.Documents.docHasChanged(m_dialog, m_lastDocId);
            if(changeInfo.changed) {
              
              m_lastDocId = changeInfo.docId;
              m_lastDocName = changeInfo.docName;
              
              p = Cairo.Database.getData("load[" + m_apiPath + "documento/info]", m_lastDocId);

              p.then(function(response) {
                if(response.success === true) {
                  m_lastDocIdtId = Cairo.Database.valField(response.data, C.DOCT_ID);
                  m_mon_id_document = Cairo.Database.valField(response.data, C.MON_ID);
                }
                return response.success;
              }).success(function() {

                var p = null;

                // when the document property is changed and the dialog was
                // editing a saved invoice we need to move to a new invoice
                //
                if(m_id !== Cairo.Constants.NO_ID && m_doc_id !== m_lastDocId) {
                  p = self.edit(Cairo.Documents.Constants.DOC_CHANGED);
                }

                return p || Cairo.Promises.resolvedPromise(true);

              }).success(function() {
                var p = Cairo.Documents.getDocNumberForProveedor(m_lastProvId, m_lastDocId, m_dialog);
                p.then(function(enabled) {
                  
                  m_taPropuesto = enabled;
                  return showCotizacion();
                  
                }).then(function() {
                    
                  setShowStockData(false);
                  setColorBackground();
                    
                });
              });
            }
            
            p = p || Cairo.Promises.resolvedPromise();
            
            p.then(function() {
              setEnabled();
            });
            break;

          case K_PROV_ID:

            setDatosProveedor().success(function() {
              Cairo.Documents.getDocNumberForProveedor(m_lastProvId, m_lastDocId, m_dialog)
              .then(function(enabled) {
                m_taPropuesto = enabled;
              }).then(function() {
                Cairo.Documents.showDataAddProveedor(Cairo.UserConfig.getShowDataAddInCompras(), m_dialog);
              });
            });
            break;

          case K_DESCUENTO1:
          case K_DESCUENTO2:
            
            updateTotals();
            break;

          case K_FECHA:

            if(m_lastFecha !== getFecha()) {
              m_lastFecha = getFecha();
              m_lastMonIdCotizacion = Cairo.Constants.NO_ID;
              
              p = showCotizacion().then(function() {
                var properties = m_dialog.getProperties();
                properties.item(CC.FC_FECHA_IVA).setValue(properties.item(CC.FC_FECHA).getValue());
                m_dialog.showValue(properties.item(CC.FC_FECHA_IVA));                
              });
            }
            break;

          case K_CPG_ID:

            p = showFechaVto();
            break;

          case K_HIDECOLS:

            showHideCols(false);
            break;
        }
        
        return p || Cairo.Promises.resolvedPromise();
      };

      self.save = function() {

        var p;

        var cotizacion = null;
        var totalOrigen = null;
        var isDefaultCurrency = null;
        var neto = null;
        var totalOtros = null;
        var totalPercep = null;
        var ivaRi = null;
        var ivaRni = null;
        var internos = null;
        var docId = null;

        p = Cairo.Documents.docCanBeEdited(m_docEditable, m_docEditMsg)
          .success(function() {
            return Cairo.Documents.docCanBeSaved(m_dialog, CC.FC_FECHA_IVA);
          })
          .success(function() {
            if(getItems().getGrid().getRows().count() === 0) {              
              Cairo.Modal.showWarning(Cairo.Language.getText(3903, "")); // El documento debe contener al menos un item
              return false;
            }
            else {
              return true;
            }
          })
          .success(function() {

            var register = new Cairo.Database.Register();
            var fields = register.getFields();

            register.setFieldId(CC.FC_TMPID);
            register.setTable(C.FACTURA_COMPRA_TMP);

            register.setId(Cairo.Constants.NEW_ID);

            register.setPath(m_apiPath + "compras/facturacompra");

            if(m_copy) {
              fields.add(CC.FC_ID, Cairo.Constants.NEW_ID, Types.long);
            }
            else {
              fields.add(CC.FC_ID, m_id, Types.long);
            }

            if(register.getId() === Cairo.Constants.NEW_ID) {
              m_est_id = Cairo.Documents.Status.pendiente;
            }

            var _count = m_dialog.getProperties().size();
            for(var _i = 0; _i < _count; _i++) {

              var property = m_dialog.getProperties().item(_i);

              switch (property.getKey()) {
                case K_NUMERO:
                  fields.add(CC.FC_NUMERO, property.getValue(), Types.long);
                  break;

                case K_NRODOC:
                  fields.add(CC.FC_NRODOC, property.getValue(), Types.text);
                  break;

                case K_DESCRIP:
                  fields.add(CC.FC_DESCRIP, property.getValue(), Types.text);
                  break;

                case K_FECHA:
                  fields.add(CC.FC_FECHA, property.getValue(), Types.date);
                  break;

                case K_FECHA_ENTREGA:
                  fields.add(CC.FC_FECHA_ENTREGA, property.getValue(), Types.date);
                  break;

                case K_FECHA_IVA:
                  fields.add(CC.FC_FECHA_IVA, property.getValue(), Types.date);
                  break;

                case K_FECHA_VTO:
                  fields.add(CC.FC_FECHA_VTO, property.getValue(), Types.date);
                  break;

                case K_PROV_ID:
                  fields.add(C.PROV_ID, property.getSelectId(), Types.id);
                  break;

                case K_CCOS_ID:
                  fields.add(C.CCOS_ID, property.getSelectId(), Types.id);
                  break;

                case K_SUC_ID:
                  fields.add(C.SUC_ID, property.getSelectId(), Types.id);
                  break;

                case K_DESCUENTO1:
                  fields.add(CC.FC_DESCUENTO1, property.getValue(), Types.currency);
                  break;

                case K_DESCUENTO2:
                  fields.add(CC.FC_DESCUENTO2, property.getValue(), Types.currency);
                  break;

                case K_DOC_ID:
                  docId = property.getSelectId();
                  fields.add(C.DOC_ID, docId, Types.id);
                  break;

                case K_LP_ID:
                  fields.add(C.LP_ID, property.getSelectId(), Types.id);
                  break;

                case K_LD_ID:
                  fields.add(C.LD_ID, property.getSelectId(), Types.id);
                  break;

                case K_CPG_ID:
                  fields.add(C.CPG_ID, property.getSelectId(), Types.id);
                  break;

                case K_COTIZACION:
                  cotizacion = Cairo.Util.val(property.getValue());
                  fields.add(CC.FC_COTIZACION, property.getValue(), Types.double);
                  break;

                case K_PROV_ID:
                  fields.add(C.PROV_ID, property.getSelectId(), Types.id);
                  break;

                case K_LGJ_ID:
                  fields.add(CC.LGJ_ID, property.getSelectId(), Types.id);
                  break;

                case K_CAI:
                  fields.add(CC.FC_CAI, property.getValue(), Types.text);
                  break;

                case K_PRO_ID_ORIGEN:
                  fields.add(C.PRO_ID_ORIGEN, property.getSelectId(), Types.id);
                  break;

                case K_PRO_ID_DESTINO:
                  fields.add(C.PRO_ID_DESTINO, property.getSelectId(), Types.id);
                  break;

                case K_DEPL_ID:
                  fields.add(C.DEPL_ID, property.getSelectId(), Types.id);
                  break;

                case K_TIPO_COMPRABANTE:
                  fields.add(CC.FC_TIPO_COMPROBANTE, property.getListItemData(), Types.integer);
                  break;

                case K_COTIZACION_PROV:
                  fields.add(CC.FC_COTIZACION_PROV, property.getValue(), Types.double);
                  break;
              }
            }

            isDefaultCurrency = m_defaultCurrency === m_mon_id_document;
            if(isDefaultCurrency) {
              cotizacion = 1;
            }
            else {
              if(cotizacion === 0) { cotizacion = 1; }
            }

            var _count = m_footer.getProperties().size();
            for(var _i = 0; _i < _count; _i++) {
              
              property = m_footer.getProperties().item(_i);
              
              switch (property.getKey()) {
                case K_NETO:
                  neto = Cairo.Util.val(property.getValue());
                  fields.add(CC.FC_NETO, neto * cotizacion, Types.currency);
                  break;

                case K_IVA_RI:
                  ivaRi = Cairo.Util.val(property.getValue());
                  fields.add(CC.FC_IVA_RI, ivaRi * cotizacion, Types.currency);
                  break;

                case K_IVA_RNI:
                  ivaRni = Cairo.Util.val(property.getValue());
                  fields.add(CC.FC_IVA_RNI, ivaRni * cotizacion, Types.currency);
                  break;

                case K_INTERNOS:
                  internos = Cairo.Util.val(property.getValue());
                  fields.add(CC.FC_IVA_RNI, internos * cotizacion, Types.currency);
                  break;

                case K_SUBTOTAL:
                  fields.add(CC.FC_SUBTOTAL, Cairo.Util.val(property.getValue()) * cotizacion, Types.currency);
                  break;

                case K_IMPORTE_DESC_1:
                  fields.add(CC.FC_IMPORTE_DESC_1, Cairo.Util.val(property.getValue()) * cotizacion, Types.currency);
                  break;

                case K_IMPORTE_DESC_2:
                  fields.add(CC.FC_IMPORTE_DESC_2, Cairo.Util.val(property.getValue()) * cotizacion, Types.currency);
                  break;

                case K_TOTAL_OTROS:
                  totalOtros = Cairo.Util.val(property.getValue());
                  fields.add(CC.FC_TOTAL_OTROS, totalOtros * cotizacion, Types.currency);
                  break;

                case K_TOTAL_PERCEPCIONES:
                  totalPercep = Cairo.Util.val(property.getValue());
                  fields.add(CC.FC_TOTAL_PERCEPCIONES, totalPercep * cotizacion, Types.currency);
                  break;
              }
            }

            totalOrigen = neto + totalOtros + totalPercep + internos;

            if(m_bIva) {
              totalOrigen = totalOrigen + ivaRi;
            }
            if(m_bIvaRni) {
              totalOrigen = totalOrigen + ivaRni;
            }

            fields.add(CC.FC_TOTAL, totalOrigen * cotizacion, Types.currency);
            fields.add(CC.FC_GRABAR_ASIENTO, 1, Types.boolean);
            fields.add(Cairo.Constants.EST_ID, m_est_id, Types.id);

            if(isDefaultCurrency) {
              fields.add(CC.FC_TOTAL_ORIGEN, 0, Types.currency);
            }
            else {
              fields.add(CC.FC_TOTAL_ORIGEN, totalOrigen, Types.currency);
            }            

            register.prepareTransaction();

            saveItems(register, cotizacion, isDefaultCurrency);
            saveOtros(register, cotizacion, isDefaultCurrency);
            saveLegajos(register, cotizacion, isDefaultCurrency);
            Percepciones.savePercepciones(
              register,
              Cairo.Documents.getItems(m_items, C_PERCEPCIONES),
              cotizacion, isDefaultCurrency,
              m_copy,
              m_percepcionesDeleted,
              m_id,
              C_MODULE);

            return Cairo.Database.saveTransaction(
                register,
                false,
                "",
                Cairo.Constants.CLIENT_SAVE_FUNCTION,
                C_MODULE,
                SAVE_ERROR_MESSAGE

            ).then(

              function(result) {
                if(result.success) {

                  if(result.errors) {
                    return Cairo.Modal.showWarningWithFalse(result.errors.message);
                  }
                  else {
                    m_copy = false;
                    return load(result.data.getId()).then(
                      function (success) {
                        if(success) {
                          updateList();
                          m_listController.updateEditorKey(self, m_id);
                        };
                        m_isNew = false;
                        return success;
                      }
                    );
                  }
                }
                else {
                  return false;
                }
              }
            );
          });

        return p;
      };

      var updateList = function() {
        if(m_id === Cairo.Constants.NO_ID) { return; }
        if(m_listController === null) { return; }

        if(m_isNew) {
          m_listController.addItem(m_id);
        }
        else {
          m_listController.refreshItem(m_id);
        }
      };

      self.terminate = function() {

        m_editing = false;

        try {
          if(m_listController !== null) {
            updateList();
            m_listController.removeEditor(self);
          }
        }
        catch (ignored) {
          Cairo.logError('Error in terminate', ignored);
        }
      };

      self.getPath = function() {
        return "#general/facturacompra/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "facturacompra" + id;
      };

      self.getTitle = function() {
        return TITLE;
      };

      self.validate = function() {

        var _count = m_dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {

          var property = m_dialog.getProperties().item(_i);

          switch (property.getKey()) {
            case K_FECHA:
              if(Cairo.Util.valEmpty(property.getValue(), Types.date)) {
                // Debe indicar una fecha
                return Cairo.Modal.showInfoWithFalse(Cairo.Language.getText(1558, ""));
              }
              break;

            case K_FECHA_ENTREGA:
              if(Cairo.Util.valEmpty(property.getValue(), Types.date)) {
                // Debe indicar una fecha de entrega
                return Cairo.Modal.showInfoWithFalse(Cairo.Language.getText(1564, ""));
              }
              break;

            case K_FECHA_VTO:
              if(Cairo.Util.valEmpty(property.getValue(), Types.date) && property.getVisible()) {
                // Debe indicar una fecha de vencimiento
                return Cairo.Modal.showInfoWithFalse(Cairo.Language.getText(1625, ""));
              }
              break;

            case K_PROV_ID:
              if(Cairo.Util.valEmpty(property.getSelectId(), Types.id)) {
                // Debe indicar un Proveedor
                return Cairo.Modal.showInfoWithFalse(Cairo.Language.getText(1860, ""));
              }
              break;

            case K_DOC_ID:
              if(Cairo.Util.valEmpty(property.getSelectId(), Types.id)) {
                // Debe indicar un documento
                return Cairo.Modal.showInfoWithFalse(Cairo.Language.getText(1562, ""));
              }
              break;

            case K_CPG_ID:
              if(Cairo.Util.valEmpty(property.getSelectId(), Types.id)) {
                // Debe indicar una condición de pago
                return Cairo.Modal.showInfoWithFalse(Cairo.Language.getText(1561, ""));
              }
              break;

            case K_SUC_ID:
              if(Cairo.Util.valEmpty(property.getSelectId(), Types.id)) {
                // Debe indicar una sucursal
                return Cairo.Modal.showInfoWithFalse(Cairo.Language.getText(1560, ""));
              }
              break;

            case K_COTIZACION:
              if(Cairo.Util.valEmpty(property.getValue(), Types.double) && property.getVisible()) {
                // Debe indicar una cotización
                return Cairo.Modal.showInfoWithFalse(Cairo.Language.getText(1620, ""));
              }
              break;

            case K_DEPL_ID:
              if(Cairo.Util.valEmpty(property.getSelectId(), Types.id) && m_showStockData) {
                // Debe indicar un deposito
                return Cairo.Modal.showInfoWithFalse(Cairo.Language.getText(1559, ""));
              }
              break;
          }
        }

        return validateCuentaMoneda();
      };

      var validateCuit = function(provId) {
        var p = null;

        try {

          if(provId !== Cairo.Constants.NO_ID) {

            var validate = function(response) {

              if(response.success) {
                var cuit = Cairo.Database.valField(response.data, C.PROV_CUIT);
                var catFiscal = Cairo.Database.valField(response.data, C.PROV_CAT_FISCAL);

                switch (catFiscal) {
                  case C.CategoriaFiscal.consumidorFinal:
                  case C.CategoriaFiscal.exento:
                  case C.CategoriaFiscal.extranjero:
                  case C.CategoriaFiscal.noCategorizado:
                    break;

                  default:

                    // extranjeroIva, monotributo, inscripto,
                    // noInscripto, noResponsableExento, inscriptoM

                    if(cuit.trim() === "") {
                      return Cairo.Modal.showWarningWithFalse(Cairo.Language.getText(1893, ""));
                      //Para poder crear la factura debe dar de alta el CUIT del Proveedor
                    }
                    break;
                }
                return true;
              }
              else {
                return Cairo.Modal.showWarningWithFalse(Cairo.Language.getText(1894, ""));
                //No se pudo obtener el CUIT del Proveedor
              }
            };

            p = Cairo.Database.getData("load[" + m_apiPath + "proveedor/info]", provId).then(validate);
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "validateCuit", C_MODULE, "");
        }

        return p || Cairo.Promises.resolvedPromise(false);
      };

      var getCueIdProveedor = function() {

        var getCueId = function(response) {

          try {

            var cueId = Cairo.Database.valField(response.data, C.CUE_ID);
            var monId = Cairo.Database.valField(response.data, C.MON_ID);

            return { success: true, monId: monId, cueId: cueId };
          }
          catch (ex) {
            Cairo.manageErrorEx(ex.message, ex, "getCueIdProveedor", C_MODULE, "");
          }

          return { success: false };
        };

        var p = Cairo.Database.getData(
            "load[" + m_apiPath + "documento/" + m_lastDocId.toString() + "/cuenta_proveedor/]",
            m_lastProvId)
          .successWithResult(getCueId, false);

        return p;
      };

      var validateCuentaMoneda = function() {

        var validate = function(result) {

          if(result.monId !== m_mon_id_document) {
            return Cairo.Modal.showInfoWithFalse(Cairo.Language.getText(1895, ""));
            //La cuenta asociada al Proveedor y la cuenta del documento tienen diferentes monedas
          }
          return true;
        };

        return getCueIdProveedor().successWithResult(validate, false);
      };

      self.isEmptyRow = function(key,  row,  rowIndex) {
        var isEmpty = true;

        try {

          switch (key) {
            case K_ITEMS:
              isEmpty = pIsEmptyRowItems(row, rowIndex);
              break;

            case K_OTROS:
              isEmpty = pIsEmptyRowOtros(row, rowIndex);
              break;

            case K_PERCEPCIONES:
              isEmpty = Percepciones.isEmptyRowPercepciones(row, rowIndex);
              break;

            case K_LEGAJOS:
              isEmpty = pIsEmptyRowLegajos(row, rowIndex);
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "validateRow", C_MODULE, "");
        }

        return Cairo.Promises.resolvedPromise(isEmpty);
      };

      self.docId = function() {
        return m_doc_id;
      };

      self.doctId = function() {
        return m_doct_id;
      };

      self.id = function() {
        return m_id;
      };

      self.loadForPrint = function(id) {
        var loadData = function(response) {
          try {

            m_id = id;
            m_doc_id = Cairo.Database.valField(response.data, C.DOC_ID);
            m_doct_id = Cairo.Database.valField(response.data, C.DOCT_ID);

            return true;

          }
          catch (ex) {
            Cairo.manageErrorEx(ex.message, ex, "loadForPrint", C_MODULE, "");
          }

          return false;
        };

        var p = Cairo.Database.getData("load[" + m_apiPath + "compras/facturacompra/info]",id)
          .successWithResult(loadData, false);

        return p;
      };

      self.getDialog = function() {
        return m_dialog;
      };

      self.list = function() {
        return Cairo.Security.hasPermissionTo(CS.LIST_FACTURA);
      };

      self.setDialog = function(rhs) {
        m_dialog = rhs;
        m_dialog.setIsDocument(true);
      };

      self.isEditing = function() {
        return m_editing;
      };

      self.deleteDocument = function(id) {

        if(m_dialog !== null) {
          if(!Cairo.Security.docHasPermissionTo(
                CS.DELETE_FACTURA,
                Cairo.Documents.getdocIdFromDialog(m_dialog),
                Cairo.Security.ActionTypes.destroy)) {
            return Cairo.Promises.resolvedPromise(false);
          }
        }

        return Cairo.Database.destroy(
            m_apiPath + "compras/facturacompra",
            id, 
            Cairo.Constants.DELETE_FUNCTION, C_MODULE);
      };

      self.edit = function(id,  inModalWindow) {

        var p = null;

        try {

          if(!Cairo.Security.docHasPermissionTo(
                CS.LIST_FACTURA,
                Cairo.Documents.getdocIdFromDialog(m_dialog),
                Cairo.Security.ActionTypes.list)) {
            return Cairo.Promises.resolvedPromise(false);
          }

          // Id = DOC_CHANGED esto significa que se cambio
          //                   el documento estando en un
          //                   comprobante ya guardado
          //
          m_isNew = (id === Cairo.Constants.NO_ID 
                      || id === Cairo.Documents.Constants.DOC_CHANGED);

          var afterLoad = function() {
            if(m_dialog.getProperties().count() === 0) {
              if(!loadCollection()) { return false; }
            }
            else {
              refreshProperties();
            }

            m_dialog.setNewPropertyKeyFocus("");

            // Solo muestro asistentes si el nuevo no se esta dando por
            // un cambio de documento
            //
            if(id !== Cairo.Documents.Constants.DOC_CHANGED
                && m_isNew && docDesdeOrden()) {

              showStartWizard();

            }
            else if(id !== Cairo.Documents.Constants.DOC_CHANGED
                      && m_isNew && docDesdeRemito()) {

              showStartWizardRemito();

            }
            else {

              m_dialog.setNewPropertyKeyFocus(C.PROV_ID);
            }

            m_editing = true;
            m_copy = false;

            return true;
          };
          
          p = load(id).success(afterLoad, false);
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "edit", C_MODULE, "");
        }

        return p || Cairo.Promises.resolvedPromise(false);
      };

      self.setListController = function(rhs) {
        m_listController = rhs;
      };

      var columnAfterUpdate = function(key,  lRow,  lCol) {
        var p = null;
        
        try {

          switch (key) {

            case K_ITEMS:

              var property = m_items.getProperties().item(C_ITEMS);
              var colKey = property.getGrid().getColumns().item(lCol).getKey();

              if(colKey === KI_IVA_RI) {
                showImporteAndIvaManual(property.getGrid().getRows().item(lRow));
              }
              else {
                showImporteAndIva(property.getGrid().getRows().item(lRow));
              }

              updateTotals();
              break;

            case K_OTROS:
              
              updateTotals();
              break;

            case K_PERCEPCIONES:
              
              updateTotals();
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnAfterUpdate", C_MODULE, "");
        }

        return p || Cairo.Promises.resolvedPromise(true);
      };

      var columnAfterEdit = function(key,  lRow,  lCol,  newValue,  newValueID) {
        var p = null;
        try {

          switch (key) {

            case K_ITEMS:
              var property = Cairo.Documents.getItems(m_items, C_ITEMS);
              p = columnAfterEditItems(property, lRow, lCol, newValue, newValueID);
              break;

            case K_OTROS:
              var property = m_items.getProperties().item(C_OTROS);
              p = columnAfterEditOtros(property, lRow, lCol, newValue, newValueID);
              break;

            case K_PERCEPCIONES:
              var property = m_items.getProperties().item(C_PERCEPCIONES);
              p = Percepciones.columnAfterEditPercepciones(property, lRow, lCol, newValue, newValueID);
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnAfterEdit", C_MODULE, "");
        }

        return p || Cairo.Promises.resolvedPromise(true);
      };

      var columnBeforeEdit = function(key,  lRow,  lCol,  iKeyAscii) {
        var rtn = false;
        try {

          switch (key) {

            case K_ITEMS:
              var property = Cairo.Documents.getItems(m_items, C_ITEMS);
              rtn = columnBeforeEditItems(property, lRow, lCol, iKeyAscii);
              break;

            case K_OTROS:
              var property = m_items.getProperties().item(C_OTROS);
              rtn = columnBeforeEditOtros(property, lRow, lCol, iKeyAscii);
              break;

            case K_PERCEPCIONES:
              rtn = true;
              break;

            case K_LEGAJOS:
              rtn = true;
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnBeforeEdit", C_MODULE, "");
        }

        return Cairo.Promises.resolvedPromise(rtn);
      };

      var columnBeforeEditItems = function(property,  lRow,  lCol,  iKeyAscii) {

        var rtn = false;
        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).getKey()) {

          case KI_NRO_SERIE:

            var row = property.getGrid().getRows().item(lRow);
            if(row !== null) {
              rtn = Dialogs.cell(row, KI_PR_LLEVA_NRO_SERIE).getId();
            }
            break;

          case KI_STL_CODIGO:

            var row = grid.getRows().item(lRow);
            if(row !== null) {
              rtn = Dialogs.cell(row, KI_PR_LLEVALOTE).getId();
            }
            break;

          default:

            rtn = true;
            break;
        }

        return rtn;
      };

      var columnBeforeEditOtros = function(property,  lRow,  lCol,  iKeyAscii) {
        return true;
      };

      var getPrecioFromRow = function(row) {
        var cell = Dialogs.cell(row, KI_PRECIO_USR);
        return Cairo.Util.val(cell.getValue());
      };

      var columnAfterEditOtros = function(property,  lRow,  lCol,  newValue,  newValueID) {

        var columns = property.getGrid().getColumns().item(lCol);

        switch (columns.getKey()) {

          case KI_DEBE:
          case KI_HABER:

            var row = property.getGrid().getRows().item(lRow);
            if(columns.getKey() === KI_DEBE) {
              var cell = Dialogs.cell(row, KI_DEBE);
              if(Cairo.Util.val(newValue) < 0) {
                cell.setValue(0);
              }
              else if(Cairo.Util.val(newValue) > 0) {
                Dialogs.cell(row, KI_HABER).setValue(0);
              }
            }
            else if(columns.getKey() === KI_HABER) {
              var cell = Dialogs.cell(row, KI_HABER);
              if(Cairo.Util.val(newValue) < 0) {
                cell.setValue(0);
              }
              else if(Cairo.Util.val(newValue) > 0) {
                Dialogs.cell(row, KI_DEBE).setValue(0);
              }
            }
            break;
        }

        return true;
      };

      var columnAfterEditItems = function(property,  lRow,  lCol,  newValue,  newValueID) {

        var p = null;
        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).getKey()) {
          
          case KI_PR_ID:

            var row = property.getGrid().getRows().item(lRow);
            p = setDataProducto(row, newValueID)
              .success(call(setPrecios, row, newValueID))
              .success(call(setDescuentos, row, newValueID, getPrecioFromRow(row)))
              .success(call(setTasasImpositivas, row, newValueID, newValue))
            ;
            break;

          case KI_PRECIO_USR:

            var row = property.getGrid().getRows().item(lRow);
            p = setDescuentos(row, Dialogs.cell(row, KI_PR_ID).getId(), newValue);
            break;

          case KI_CANTIDAD:

            var row = property.getGrid().getRows().item(lRow);

            if(Dialogs.cell(row, KI_PR_LLEVA_NRO_SERIE).getId()) {

              var prId = Dialogs.cell(row, KI_PR_ID).getId();

              p = Cairo.SerialNumber.quantityChange(
                row, lRow, KI_CANTIDAD, newValue, KI_GRUPO, m_nrosSerie, KI_PR_ID, KI_NRO_SERIE,
                getPrId(prId), getDeplId(), getIsInput(), getProvId());
            }
            break;
        }

        return p || Cairo.Promises.resolvedPromise(true);
      };

      self.columnButtonClick = function(key,  lRow,  lCol,  iKeyAscii) {

        var p = null;

        switch (key) {

          case K_ITEMS:

            var grid = Cairo.Documents.getItems(m_items, C_ITEMS).getGrid();

            switch (grid.getColumns().item(lCol).getKey()) {

              case KI_NRO_SERIE:

                var row = grid.getRows().item(lRow);

                if(Dialogs.cell(row, KI_PR_LLEVA_NRO_SERIE).getId() !== 0) {

                  var prId = Dialogs.cell(row, KI_PR_ID).getId();

                  p = Cairo.SerialNumber.edit(
                    Dialogs.cell(row, KI_GRUPO).getId(), Cairo.Util.val(Dialogs.cell(row, KI_CANTIDAD).getValue()),
                    row, m_nrosSerie, KI_GRUPO, KI_NRO_SERIE, lRow, getPrId(prId), getDeplId(),
                    getIsInput(), false, false, null, getProvId(), Cairo.Constants.NO_ID);
                }
                break;
            }
            break;
        }

        return p || Cairo.Promises.resolvedPromise(false);
      };

      self.deleteRow = function(key,  row,  lRow) {

        switch (key) {
          
          case K_ITEMS:
            
            var id = Cairo.Util.val(Dialogs.cell(row, KI_FCI_ID).getValue());
            if(id !== Cairo.Constants.NO_ID) { m_itemsDeleted = m_itemsDeleted+ id.toString()+ ","; }
            break;

          case K_OTROS:
            
            var id = Cairo.Util.val(Dialogs.cell(row, KI_FCOT_ID).getValue());
            if(id !== Cairo.Constants.NO_ID) { m_otrosDeleted = m_otrosDeleted+ id.toString()+ ","; }
            break;

          case K_PERCEPCIONES:
            
            var id = Cairo.Util.val(Dialogs.cell(row, Percepciones.KIP_FCPERC_ID).getValue());
            if(id !== Cairo.Constants.NO_ID) { m_percepcionesDeleted = m_percepcionesDeleted+ id.toString()+ ","; }
            break;

          case K_LEGAJOS:
            
            id = Cairo.Util.val(Dialogs.cell(row, KIL_FCLGJ_ID).getValue());
            if(id !== Cairo.Constants.NO_ID) { m_legajosDeleted = m_legajosDeleted+ id.toString()+ ","; }
            break;
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var listAdHock = function(key,  row,  colIndex,  list) {

      };

      var newRow = function(key,  rows) {

      };

      var validateRow = function(key,  row,  rowIndex) {
        var _rtn = null;
        try {

          switch (key) {
            case K_ITEMS:
              _rtn = pValidateRowItems(row, rowIndex);
              break;

            case K_OTROS:
              _rtn = pValidateRowOtros(row, rowIndex);
              break;

            case K_PERCEPCIONES:
              _rtn = Percepciones.validateRowPercepciones(row, rowIndex);
              break;

            case K_LEGAJOS:
              _rtn = pValidateRowLegajos(row, rowIndex);
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "validateRow", C_MODULE, "");
        }

        return _rtn;
      };

      var pIsEmptyRowLegajos = function(row,  rowIndex) {
        var cell = null;

        var bRowIsEmpty = true;

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIL_IMPORTE:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.currency)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KIL_LGJ_ID:
              if(!Cairo.Util.valEmpty(cell.getId(), Types.id)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KIL_DESCRIP:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                bRowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pIsEmptyRowOtros = function(row,  rowIndex) {
        var cell = null;

        var bRowIsEmpty = true;

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_DEBE:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.currency)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KI_HABER:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.currency)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KI_CUE_ID:
              if(!Cairo.Util.valEmpty(cell.getId(), Types.id)) {
                bRowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pIsEmptyRowItems = function(row,  rowIndex) {
        var cell = null;

        var bRowIsEmpty = true;

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_CANTIDAD:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.currency)) {
                if(Cairo.Util.val(cell.getValue()) !== 1) {
                  bRowIsEmpty = false;
                  break;
                }
              }
              break;

            case KI_PRECIO:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.currency)) {
                bRowIsEmpty = false;
                break;
              }
              break;

            case KI_PR_ID:
              if(!Cairo.Util.valEmpty(cell.getId(), Types.id)) {
                bRowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pValidateRowLegajos = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function pValidateRowLegajos(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIL_LGJ_ID:
              if(Cairo.Util.valEmpty(cell.getId(), Types.id)) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1896, "", strRow)).then(function() {return false;});
                //Debe indicar un legajo (1)
              }
              break;

            case KIL_IMPORTE:
              if(Cairo.Util.valEmpty(cell.getValue(), Types.currency)) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1897, "", strRow)).then(function() {return false;});
                //Debe indicar un importe (1)
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var pValidateRowOtros = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function pValidateRowOtros(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var bDebeHaber = null;
        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KI_CUE_ID:
              if(Cairo.Util.valEmpty(cell.getId(), Types.id)) {
                return Cairo.Modal.showInfo(Cairo.Language.getText(1388, "", strRow)).then(function() {return false;});
                //Debe indicar una cuenta (1)
              }
              break;

            case KI_DEBE:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.currency)) {
                bDebeHaber = true;
              }
              break;

            case KI_HABER:
              if(Cairo.Util.valEmpty(cell.getId(), Types.id)) {
                bDebeHaber = true;
              }
              break;
          }
        }

        if(!bDebeHaber) {
          return Cairo.Modal.showInfo(Cairo.Language.getText(1898, "", strRow)).then(function() {return false;});
          //Debe indicar un importe en el Debe o en el Haber (1)
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var pValidateRowItems = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function pValidateRowItems(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var bLlevaNroSerie = null;
        var cantidad = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case KI_CANTIDAD:
              cantidad = Cairo.Util.val(cell.getValue());
              if(Cairo.Util.valEmpty(cell.getValue(), Types.currency)) {
                // Debe indicar una cantidad (1)
                Cairo.Modal.showInfo(Cairo.Language.getText(1365, "", strRow));
              }

              break;

            case KI_PRECIO:
              if(Cairo.Util.valEmpty(cell.getValue(), Types.currency)) {
                // Debe indicar un precio (1)
                Cairo.Modal.showInfo(Cairo.Language.getText(1631, "", strRow));
              }

              break;

            case KI_PR_ID:
              if(Cairo.Util.valEmpty(cell.getId(), Types.id)) {
                // Debe indicar un producto de Compra (1)
                Cairo.Modal.showInfo(Cairo.Language.getText(1899, "", strRow));
              }

              break;

            case KI_NRO_SERIE:
              bLlevaNroSerie = Dialogs.cell(row, KI_PR_LLEVA_NRO_SERIE).getId();
              if(Cairo.Util.valEmpty(cell.getValue(), Types.text) && bLlevaNroSerie) {
                // Debe indicar un numero de serie (1)
                Cairo.Modal.showInfo(Cairo.Language.getText(1630, "", strRow));
              }

              // Lote
              //
              break;

            case KI_STL_CODIGO:
              if(m_showStockData) {
                if(Cairo.Util.valEmpty(cell.getValue(), Types.text) && Dialogs.cell(row, KI_PR_LLEVALOTE).getId()) {
                  // Debe indicar un lote (1)
                  Cairo.Modal.showInfo(Cairo.Language.getText(1632, "", strRow));
                }
              }

              // TO
              break;

            case KI_TO_ID:
              if(Cairo.Util.valEmpty(cell.getId(), Types.id)) {
                // Debe indicar un tipo de operación (1)
                Cairo.Modal.showInfo(Cairo.Language.getText(1633, "", strRow));
              }
              break;
          }
        }

        // Si lleva numero de serie valido que
        // la cantidad indicada sea la misma
        // que en la coleccion de numeros de serie
        //
        if(bLlevaNroSerie && m_showStockData) {

          var prId = null;

          prId = Dialogs.cell(row, KI_PR_ID).getId();

          if(!NroSerieValidateCount(row, KI_GRUPO, rowIndex, m_nrosSerie, cantidad, strRow, KI_PR_ID, KI_CANTIDAD, KI_NRO_SERIE, getPrId(prId), getDeplId(), getIsInput())) {
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      // funciones privadas
      var loadCollection = function() {
        var filter = null;
        var c = null;

                #If PREPROC_SFS Then;
        var abmGen = null;
                #Else;
        var abmGen = null;
                #End If;

        var cotizacion = null;

        // Preferencias del usuario
        //
        var bValidateDocDefault = null;

        abmGen = m_dialog;
        abmGen.resetLayoutMembers();

        // DATADD
        if(Cairo.UserConfig.getShowDataAddInCompras()) {
          abmGen.setHeightToDocWithDescrip();
        }

        m_dialog.getProperties().clear();

        var w_tabs = m_dialog.getTabs();
        w_tabs.clear();

        var tab = w_tabs.add(null);
        tab.setName(Cairo.Constants.c_strGeneral);

        var tab = w_tabs.add(null);
        tab.setIndex(1);
        // Adicionales
        tab.setName(Cairo.Language.getText(1566, ""));

        var properties = m_dialog.getProperties();

        var elem = properties.add(null, C.DOC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSDocumento2.CSDocumento);
        // Documento
        elem.setName(Cairo.Language.getText(1567, ""));
        elem.setKey(K_DOC_ID);

        if(m_doc_id !== Cairo.Constants.NO_ID) {
          elem.setSelectId(m_doc_id);
          elem.setValue(m_documento);
        }
        else {
          // Preferencias del usuario
          //
          elem.setSelectId(Cairo.UserConfig.getDocFcId());
          elem.setValue(Cairo.UserConfig.getDocFcNombre());

          bValidateDocDefault = elem.getSelectId() !== Cairo.Constants.NO_ID;
        }

        elem.setSelectFilter(pGetDocFilter());

        var elem = properties.add(null, Cairo.Documents.DialogKeys.number);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.Integer);
        // Número
        elem.setName(Cairo.Language.getText(1065, ""));
        elem.setKey(K_NUMERO);
        elem.setValue(m_numero);
        elem.setEnabled(false);

        var elem = properties.add(null, Cairo.Documents.DialogKeys.status);
        elem.setType(Dialogs.PropertyType.text);
        // Estado
        elem.setName(Cairo.Language.getText(1568, ""));
        elem.setKey(K_EST_ID);
        elem.setValue(m_estado);
        elem.setEnabled(false);

        var elem = properties.add(null, CC.FC_FECHA);
        elem.setType(Dialogs.PropertyType.date);
        // Fecha
        elem.setName(Cairo.Language.getText(1569, ""));
        elem.setLeftLabel(-580);
        elem.setLeft(700);
        elem.setKey(K_FECHA);
        elem.setValue(m_fecha);

        var elem = properties.add(null, CC.FC_FECHA_IVA);
        elem.setType(Dialogs.PropertyType.date);
        // F. IVA
        elem.setName(Cairo.Language.getText(1900, ""));
        elem.setKey(K_FECHA_IVA);
        elem.setValue(m_fechaIva);

        var elem = properties.add(null, C.PROV_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROVEEDOR);
        elem.setTopFromProperty(CC.FC_FECHA);
        elem.setLeft(2900);
        elem.setLeftLabel(-800);
        // Proveedor
        elem.setName(Cairo.Language.getText(1151, ""));
        elem.setKey(K_PROV_ID);
        elem.setSelectId(m_prov_id);
        elem.setValue(m_proveedor);
        m_dialog.setNewPropertyKeyFocus(C.PROV_ID);

        var elem = properties.add(null, CC.FC_NRODOC);
        elem.setType(Dialogs.PropertyType.text);
        // Número
        elem.setName(Cairo.Language.getText(1065, ""));
        elem.setSize(50);
        elem.setKey(K_NRODOC);
        elem.setValue(m_nrodoc);
        elem.setTextMask(m_taMascara);
        elem.setTextAlign(vbRightJustify);

        var elem = properties.add(null, C.CPG_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CONDICIONPAGO);
        // C. pago
        elem.setName(Cairo.Language.getText(1835, ""));
        elem.setTopFromProperty(CC.FC_FECHA);
        elem.setLeft(5900);
        elem.setLeftLabel(-620);
        elem.setKey(K_CPG_ID);
        elem.setSelectId(m_cpg_id);
        elem.setValue(m_condicionPago);

        var elem = properties.add(null, CC.FC_FECHA_VTO);
        elem.setType(Dialogs.PropertyType.date);
        // Vto.
        elem.setName(Cairo.Language.getText(1634, ""));
        elem.setLeftLabel(-350);
        elem.setKey(K_FECHA_VTO);
        elem.setValue(m_fechaVto);

        var elem = properties.add(null, C.LGJ_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(CSLEGAJO);
        // Legajo
        elem.setName(Cairo.Language.getText(1575, ""));
        elem.setKey(K_LGJ_ID);
        elem.setSelectId(m_lgj_id);
        elem.setValue(m_legajo);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.PRO_ID_ORIGEN);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROVINCIA);
        // Origen
        elem.setName(Cairo.Language.getText(1901, ""));
        elem.setKey(K_PRO_ID_ORIGEN);
        elem.setSelectId(m_pro_id_origen);
        elem.setValue(m_proOrigen);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.PRO_ID_DESTINO);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.PROVINCIA);
        // Destino
        elem.setName(Cairo.Language.getText(1902, ""));
        elem.setKey(K_PRO_ID_DESTINO);
        elem.setSelectId(m_pro_id_destino);
        elem.setValue(m_proDestino);
        elem.setTabIndex(1);

        var elem = properties.add(null, CC.FC_CAI);
        elem.setType(Dialogs.PropertyType.text);
        // Cai
        elem.setName(Cairo.Language.getText(1636, ""));
        elem.setKey(K_CAI);
        elem.setValue(m_cai);
        elem.setTabIndex(1);

        var elem = properties.add(null, CC.FC_FECHA_ENTREGA);
        elem.setType(Dialogs.PropertyType.date);
        // Entrega
        elem.setName(Cairo.Language.getText(1570, ""));
        elem.setLeftLabel(-1080);
        elem.setKey(K_FECHA_ENTREGA);
        elem.setValue(m_fechaentrega);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.DEPL_ID_ORIGEN);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.DEPOSITOLOGICO);
        // Deposito
        elem.setName(Cairo.Language.getText(1574, ""));
        elem.setLeftLabel(-1080);
        elem.setKey(K_DEPL_ID);

        if(m_depl_id !== Cairo.Constants.NO_ID || !m_showStockData) {
          elem.setSelectId(m_depl_id);
          elem.setValue(m_deposito);
        }
        else {
          // Preferencias del usuario
          //
          elem.setSelectId(Cairo.UserConfig.getDeplId());
          elem.setValue(Cairo.UserConfig.getDeplNombre());
        }

        elem.setEnabled(m_showStockData);
        elem.setTabIndex(1);

        var elem = properties.add(null, CC.FC_TIPO_COMPROBANTE);
        elem.setType(Dialogs.PropertyType.list);
        // Tipo Comprobante
        elem.setName(Cairo.Language.getText(1903, ""));
        elem.setLeftLabel(-1080);
        elem.setKey(K_TIPO_COMPRABANTE);
        elem.setListWhoSetItem(csListItemData);
        var w_list = elem.getList();
        var elem = w_list.add(null);
        elem.Id = csETipoComprobante.cSETC_ORIGINAL;
        // Original
        elem.setValue(Cairo.Language.getText(2090, ""));

        var elem = w_list.add(null);
        elem.Id = csETipoComprobante.cSETC_FAX;
        // Fax
        elem.setValue(Cairo.Language.getText(1200, ""));

        var elem = w_list.add(null);
        elem.Id = csETipoComprobante.cSETC_FOTOCOPIA;
        // Fotocopia
        elem.setValue(Cairo.Language.getText(2091, ""));

        var elem = w_list.add(null);
        elem.Id = csETipoComprobante.cSETC_DUPLICADO;
        // Duplicado
        elem.setValue(Cairo.Language.getText(2092, ""));

        elem.setListItemData(m_tipoComprobante);
        elem.setTabIndex(1);

        var elem = properties.add(null, CC.FC_COTIZACION_PROV);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        // Cotizacion Proveedor
        elem.setName(Cairo.Language.getText(4653, ""));
        elem.setKey(K_COTIZACION_PROV);
        elem.setValue(m_cotizacionProv);
        elem.setTabIndex(1);
        elem.setLeftLabel(-1100);
        elem.setWidth(1000);

        var elem = properties.add(null, CC.FC_COTIZACION);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setLeftLabel(-600);
        // Cotiz.
        elem.setName(Cairo.Language.getText(1650, ""));
        elem.setFormat(m_generalConfig.getFormatDecCotizacion());
        elem.setKey(K_COTIZACION);
        elem.setValue(m_cotizacion);
        elem.setWidth(1000);

        if(m_cotizacion !== 0) {
          cotizacion = m_cotizacion;
        }
        else {
          cotizacion = 1;
        }

        var elem = properties.add(null, CC.FC_DESCUENTO1);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
        elem.setLeftLabel(-600);
        // Desc. 1
        elem.setName(Cairo.Language.getText(1573, ""));
        elem.setKey(K_DESCUENTO1);
        elem.setValue(m_descuento1);
        elem.setWidth(1000);

        var elem = properties.add(null, CC.FC_DESCUENTO2);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
        elem.setTopFromProperty(CC.FC_DESCUENTO1);
        elem.setLeft(7150);
        elem.setLeftLabel(-150);
        elem.setName("2");
        elem.setKey(K_DESCUENTO2);
        elem.setValue(m_descuento2);
        elem.setWidth(1000);

        var elem = properties.add(null, C.LP_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.LISTAPRECIO);
        // Lista de Precios
        elem.setName(Cairo.Language.getText(1397, ""));
        elem.setSelectFilter(GetListaPrecioGetXProveedor(m_doc_id, m_prov_id));
        elem.setTopFromProperty(CC.FC_FECHA);
        elem.setLeft(9400);
        elem.setKey(K_LP_ID);
        elem.setSelectId(m_lp_id);
        elem.setValue(m_listaPrecio);

        var elem = properties.add(null, C.LD_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.LISTADESCUENTO);
        // Lista de Descuentos
        elem.setName(Cairo.Language.getText(1398, ""));
        elem.setSelectFilter(GetListaDescGetXProveedor(m_doc_id, m_prov_id));
        elem.setKey(K_LD_ID);
        elem.setSelectId(m_ld_id);
        elem.setValue(m_listaDescuento);

        var elem = properties.add(null, C.CCOS_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTROCOSTO);
        // Centro de Costo
        elem.setName(Cairo.Language.getText(1057, ""));
        elem.setKey(K_CCOS_ID);
        elem.setSelectId(m_ccos_id);
        elem.setValue(m_centroCosto);

        var elem = properties.add(null, C.SUC_ID);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.SUCURSAL);
        // Sucursal
        elem.setName(Cairo.Language.getText(1281, ""));
        elem.setKey(K_SUC_ID);
        elem.setSelectId(m_suc_id);
        elem.setValue(m_sucursal);

        var elem = properties.add(null, CC.FC_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        // Observ.
        elem.setName(Cairo.Language.getText(1211, ""));
        elem.setLeftLabel(-600);
        elem.setSize(5000);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);
        elem.setLeftFromProperty(CC.FC_FECHA);
        elem.setTopFromProperty(CC.FC_NRODOC);
        elem.setWidth(4480);
        elem.setHeight(800);
        elem.setTopToPrevious(440);

        // DATADD
        if(Cairo.UserConfig.getShowDataAddInCompras()) {

          var elem = properties.add(null, c_ProveedorDataAdd);
          elem.setType(Dialogs.PropertyType.text);
          elem.setSubType(Dialogs.PropertySubType.memo);
          elem.setWidth(10970);
          elem.setTopFromProperty(CC.FC_DESCRIP);
          elem.setTopToPrevious(860);
          elem.setLeftFromProperty(CC.FC_DESCRIP);
          elem.setHeight(600);

        }

        // HIDECOLS
        //
        var elem = properties.add(null);
        elem.setType(Dialogs.PropertyType.label);
        elem.setBackColor(vbButtonShadow);
        elem.setWidth(2540);
        elem.setTopNotChange(true);
        elem.setLeftNotChange(true);

        // DATADD
        // Aca van las preferencias del usuario
        //
        if(Cairo.UserConfig.getShowDataAddInCompras()) {
          elem.setTop(4000);
        }
        else {
          elem.setTop(3460);
        }

        elem.setLeft(9210);
        elem.setHeight(330);

        var elem = properties.add(null);
        elem.setType(Dialogs.PropertyType.label);
        elem.setBackColor(vbWindowBackground);
        elem.setWidth(2500);
        elem.setTopNotChange(true);
        elem.setLeftNotChange(true);

        // DATADD
        // Aca van las preferencias del usuario
        //
        if(Cairo.UserConfig.getShowDataAddInCompras()) {
          elem.setTop(4020);
        }
        else {
          elem.setTop(3480);
        }

        elem.setLeft(9220);
        elem.setHeight(300);

        var iProp = null;
        var oProp = null;
        iProp = properties.add(null, c_HideCols);
        oProp = iProp;
        iProp.setType(Dialogs.PropertyType.check);
        // Ocultar Columnas
        iProp.setName(Cairo.Language.getText(3901, ""));
        iProp.setKey(K_HIDECOLS);
        iProp.setValue(Cairo.Util.boolToInt(CSKernelClient2.cUtil.getRegistry(csSeccionSetting.cSINTERFACE, C_HIDECOLSFC, 1)));
        iProp.setTopNotChange(true);
        iProp.setLeftNotChange(true);

        // DATADD
        // Aca van las preferencias del usuario
        //
        if(Cairo.UserConfig.getShowDataAddInCompras()) {
          iProp.setTop(4040);
        }
        else {
          iProp.setTop(3500);
        }

        iProp.setLeft(11120);
        iProp.setLeftLabel(-1500);
        oProp.setIsEditProperty(false);
        //
        // HIDECOLS - fin

        if(!m_dialog.show(self)) { return false; }

        pSetShowStockData(true);

        var w_tabs = m_items.getTabs();
        w_tabs.clear();

        var tab = w_tabs.add(null);
        tab.setIndex(0);
        // Items
        tab.setName(Cairo.Language.getText(1371, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(1);
        // Otros
        tab.setName(Cairo.Language.getText(1070, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(2);
        // Percepciones
        tab.setName(Cairo.Language.getText(1248, ""));

        var tab = w_tabs.add(null);
        tab.setIndex(3);
        // Legajos
        tab.setName(Cairo.Language.getText(1575, ""));

        abmGen = m_items;
        abmGen.resetLayoutMembers();

        // DATADD
        if(Cairo.UserConfig.getShowDataAddInCompras()) {
          abmGen.setHeightToDocWithDescrip();
        }

        var properties = m_items.getProperties();

        properties.clear();

        c = properties.add(null, C_ITEMS);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        setGridItems(c);
        if(!pLoadItems(c, cotizacion)) { return false; }
        c.setName(C_ITEMS);
        c.setKey(K_ITEMS);
        c.setTabIndex(0);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        m_itemsDeleted = "";

        c = properties.add(null, C_OTROS);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        setGridOtros(c);
        if(!pLoadOtros(c, cotizacion)) { return false; }
        c.setName(C_OTROS);
        c.setKey(K_OTROS);
        c.setTabIndex(1);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        m_otrosDeleted = "";

        c = properties.add(null, C_PERCEPCIONES);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        setGridPercepciones(c);
        if(!pLoadPercepciones(c, cotizacion)) { return false; }
        c.setName(C_PERCEPCIONES);
        c.setKey(K_PERCEPCIONES);
        c.setTabIndex(2);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        m_percepcionesDeleted = "";

        c = properties.add(null, C_LEGAJOS);
        c.setType(Dialogs.PropertyType.grid);
        c.setLeftLabel(-1);
        setGridLegajos(c);
        if(!pLoadLegajos(c, cotizacion)) { return false; }
        c.setName(C_LEGAJOS);
        c.setKey(K_LEGAJOS);
        c.setTabIndex(3);
        c.setGridAddEnabled(true);
        c.setGridEditEnabled(true);
        c.setGridRemoveEnabled(true);

        m_legajosDeleted = "";

        if(!m_items.show(self)) { return false; }

        abmGen = m_footer;
        abmGen.resetLayoutMembers();

        var properties = m_footer.getProperties();

        properties.clear();

        var elem = properties.add(null, CC.FC_SUBTOTAL);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        // Sub Total
        elem.setName(Cairo.Language.getText(1579, ""));
        elem.setKey(K_SUBTOTAL);
        elem.setValue(m_subTotal);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setEnabled(false);

        var elem = properties.add(null, CC.FC_IMPORTE_DESC_1);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        // Desc. 1
        elem.setName(Cairo.Language.getText(1573, ""));
        elem.setKey(K_IMPORTE_DESC_1);
        elem.setValue(m_importeDesc1);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setEnabled(false);

        var elem = properties.add(null, CC.FC_IMPORTE_DESC_2);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        // Desc. 2
        elem.setName(Cairo.Language.getText(1580, ""));
        elem.setKey(K_IMPORTE_DESC_2);
        elem.setValue(m_importeDesc2);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setEnabled(false);

        var elem = properties.add(null, CC.FC_NETO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        // Neto
        elem.setName(Cairo.Language.getText(1581, ""));
        elem.setKey(K_NETO);
        elem.setValue(m_neto);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setEnabled(false);

        var elem = properties.add(null, CC.FC_IVA_RI);
        elem.setType(Dialogs.PropertyType.numeric);
        // IVA RI
        elem.setName(Cairo.Language.getText(1582, ""));
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_IVA_RI);
        elem.setValue(m_ivari);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setEnabled(false);

        // Internos
        var elem = properties.add(null, CC.FC_INTERNOS);
        elem.setType(Dialogs.PropertyType.numeric);
        // Internos
        elem.setName(Cairo.Language.getText(4914, ""));
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_INTERNOS);
        elem.setValue(m_internos);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setEnabled(false);
        //.LeftFromProperty = cscFcIvarni

        var elem = properties.add(null, CC.FC_TOTAL_OTROS);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        // Otros
        elem.setName(Cairo.Language.getText(1070, ""));
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_TOTAL_OTROS);
        elem.setValue(m_totalOtros);
        elem.setEnabled(false);

        var elem = properties.add(null, CC.FC_TOTAL_PERCEPCIONES);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        // Percepciones
        elem.setName(Cairo.Language.getText(1248, ""));
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_TOTAL_PERCEPCIONES);
        elem.setValue(m_totalPercepciones);
        elem.setEnabled(false);

        var elem = properties.add(null, CC.FC_TOTAL);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        // Total
        elem.setName(Cairo.Language.getText(1584, ""));
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_TOTAL);
        elem.setValue(m_total);
        elem.setEnabled(false);

        // Lo pongo al final por que ahora es invisible
        //
        var elem = properties.add(null, CC.FC_IVA_RNI);
        elem.setType(Dialogs.PropertyType.numeric);
        // IVA RNI
        elem.setName(Cairo.Language.getText(1583, ""));
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_IVA_RNI);
        elem.setValue(m_ivarni);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setEnabled(false);
        elem.setVisible(false);

        setEnabled();

        if(!m_footer.show(self)) { return false; }

        // Preferencias del Usuario
        //
        if(bValidateDocDefault) {
          self.propertyChange(K_DOC_ID);
        }

        showCotizacion();

        // DATADD
        mPublic.self.showDataAddProveedor(Cairo.UserConfig.getShowDataAddInCompras(), m_dialog);

        setColorBackground();

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(C.DOC_ID);
        elem.setSelectId(m_doc_id);
        elem.setValue(m_documento);
        elem.setSelectId(Cairo.UserConfig.getDocFcId());
        elem.setValue(Cairo.UserConfig.getDocFcNombre());

        var elem = properties.item(Cairo.Documents.DialogKeys.number);
        elem.setValue(m_numero);

        var elem = properties.item(Cairo.Documents.DialogKeys.status);
        elem.setValue(m_estado);

        var elem = properties.item(CC.FC_FECHA);
        elem.setValue(m_fecha);

        var elem = properties.item(CC.FC_FECHA_IVA);
        elem.setValue(m_fechaIva);

        var elem = properties.item(C.PROV_ID);
        elem.setSelectId(m_prov_id);
        elem.setValue(m_proveedor);

        var elem = properties.item(CC.FC_NRODOC);
        elem.setValue(m_nrodoc);

        var elem = properties.item(C.CPG_ID);
        elem.setSelectId(m_cpg_id);
        elem.setValue(m_condicionPago);

        var elem = properties.item(CC.FC_FECHA_VTO);
        elem.setValue(m_fechaVto);

        var elem = properties.item(C.LGJ_ID);
        elem.setSelectId(m_lgj_id);
        elem.setValue(m_legajo);

        var elem = properties.item(C.PRO_ID_ORIGEN);
        elem.setSelectId(m_pro_id_origen);
        elem.setValue(m_proOrigen);

        var elem = properties.item(C.PRO_ID_DESTINO);
        elem.setSelectId(m_pro_id_destino);
        elem.setValue(m_proDestino);

        var elem = properties.item(CC.FC_CAI);
        elem.setValue(m_cai);

        var elem = properties.item(CC.FC_FECHA_ENTREGA);
        elem.setValue(m_fechaentrega);

        var elem = properties.item(C.DEPL_ID_ORIGEN);
        elem.setSelectId(m_depl_id);
        elem.setValue(m_deposito);
        elem.setSelectId(Cairo.UserConfig.getDeplId());
        elem.setValue(Cairo.UserConfig.getDeplNombre());

        var elem = properties.item(CC.FC_TIPO_COMPROBANTE);

        var elem = properties.item(CC.FC_COTIZACION_PROV);
        elem.setValue(m_cotizacionProv);

        var elem = properties.item(CC.FC_COTIZACION);
        elem.setValue(m_cotizacion);

        var elem = properties.item(CC.FC_DESCUENTO1);
        elem.setValue(m_descuento1);

        var elem = properties.item(CC.FC_DESCUENTO2);
        elem.setValue(m_descuento2);

        var elem = properties.item(C.LP_ID);
        elem.setSelectId(m_lp_id);
        elem.setValue(m_listaPrecio);

        var elem = properties.item(C.LD_ID);
        elem.setSelectId(m_ld_id);
        elem.setValue(m_listaDescuento);

        var elem = properties.item(C.CCOS_ID);
        elem.setSelectId(m_ccos_id);
        elem.setValue(m_centroCosto);

        var elem = properties.item(C.SUC_ID);
        elem.setSelectId(m_suc_id);
        elem.setValue(m_sucursal);

        var elem = properties.item(CC.FC_DESCRIP);
        elem.setValue(m_descrip);

        var elem = properties.item(c_ProveedorDataAdd);

        var elem = properties.add(null);

        var elem = properties.add(null);

        var elem = properties.item(CC.FC_SUBTOTAL);
        elem.setValue(m_subTotal);

        var elem = properties.item(CC.FC_IMPORTE_DESC_1);
        elem.setValue(m_importeDesc1);

        var elem = properties.item(CC.FC_IMPORTE_DESC_2);
        elem.setValue(m_importeDesc2);

        var elem = properties.item(CC.FC_NETO);
        elem.setValue(m_neto);

        var elem = properties.item(CC.FC_IVA_RI);
        elem.setValue(m_ivari);

        var elem = properties.item(CC.FC_INTERNOS);
        elem.setValue(m_internos);

        var elem = properties.item(CC.FC_TOTAL_OTROS);
        elem.setValue(m_totalOtros);

        var elem = properties.item(CC.FC_TOTAL_PERCEPCIONES);
        elem.setValue(m_totalPercepciones);

        var elem = properties.item(CC.FC_TOTAL);
        elem.setValue(m_total);

        var elem = properties.item(CC.FC_IVA_RNI);
        elem.setValue(m_ivarni);

        return m_dialog.showValues(properties);
      };

      var getDocId = function() {
        return m_dialog.getProperties().item(C.DOC_ID);
      };

      // Cotizacion
      var getCotizacion = function() {
        return m_dialog.getProperties().item(CC.FC_COTIZACION);
      };

      var showCotizacion = function() {
        var monId = null;
        var dDate = null;
        var iProp = null;

        if(m_id === Cairo.Constants.NO_ID) {
          if(m_lastDocId === Cairo.Constants.NO_ID) { return; }
          if(!Cairo.Database.getData(C.DOCUMENTO, C.DOC_ID, m_lastDocId, C.MON_ID, monId)) { return; }
        }
        else {
          monId = m_mon_id;
        }

        iProp = getCotizacion();
        iProp.setVisible(monId !== m_defaultCurrency);

        if(m_lastMonIdCotizacion !== monId || iProp.getValue() === 0) {
          dDate = getFecha();
          if(!IsDate(dDate)) { dDate = Date; }
          iProp.setValue(cMoneda.getCotizacion(monId, dDate));
          m_lastFecha = dDate;
          m_lastMonIdCotizacion = monId;
        }

        m_dialog.showValue(iProp);
      };

      var getCondicionPago = function() {
        return m_dialog.getProperties().item(C.CPG_ID);
      };

      var showFechaVto = function() {
        var p = null;
        var cpgId = getCondicionPago().getSelectId();
        if(cpgId !== m_lastCpgId) {
          p = Cairo.Database.getData("load[" + m_apiPath + "condicionpago/info]", cpgId).then(
            function(response) {
              if(response.success === true) {
                m_lastCpgId = cpgId;
                var esLibre = Cairo.Database.valField(response.data, C.CPG_ES_LIBRE);
                var property = m_dialog.getProperties().item(CC.FC_FECHA_VTO);
                property.setVisible(esLibre);
                m_dialog.showValue(property);
              }
            }
          );
        }
        return p || Cairo.Promises.resolvedPromise();
      };

      var setGridItems = function(property) {
                var oCol = null;
                var iCol = null;

                // HIDECOLS
                //
                var bColVisible = null;
                bColVisible = Cairo.Util.val(m_dialog.getProperties().item(c_HideCols).getValue()) === 0;

                var w_grid = property.getGrid();

                w_grid.getColumns().clear();
                w_grid.getRows().clear();

                var w_columns = w_grid.getColumns();
                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KI_FCI_ID);

                iCol = w_columns.add(null);
                oCol = iCol;
                // Producto
                iCol.setName(Cairo.Language.getText(1619, ""));
                iCol.setType(Dialogs.PropertyType.select);
                iCol.setTable(Cairo.Tables.PRODUCTOCOMPRA);
                iCol.setWidth(1800);
                iCol.setKey(KI_PR_ID);
                if(Cairo.UserConfig.getMultiSelect()) {
                  oCol.setHelpType(csHelpType.cSMULTISELECT);
                }
                iCol = null;
                oCol = null;

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KI_CUE_ID);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KI_CUE_ID_IVA_RI);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KI_CUE_ID_IVA_RNI);

                var elem = w_columns.add(null);
                elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
                elem.setType(Dialogs.PropertyType.text);
                elem.setSubType(Dialogs.PropertySubType.textButtonEx);
                elem.setWidth(1200);
                elem.setKey(KI_DESCRIP);

                var elem = w_columns.add(null);
                // Cantidad
                elem.setName(Cairo.Language.getText(1374, ""));
                elem.setFormat(m_generalConfig.getFormatDecCantidad());
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setSubType(Dialogs.PropertySubType.double);
                elem.setWidth(1000);
                elem.setKey(KI_CANTIDAD);

                elem.setDefaultValue(new cABMGridRowValue());
                elem.getDefaultValue().setValue(1);

                var elem = w_columns.add(null);
                // Nro. Serie
                elem.setName(Cairo.Language.getText(1639, ""));
                elem.setType(Dialogs.PropertyType.text);
                elem.setSubType(Dialogs.PropertySubType.textButton);
                elem.setWidth(3000);
                elem.setKey(KI_NRO_SERIE);
                //  HIDECOLS
                elem.setVisible(m_showStockData);

                // Lote
                //
                var elem = w_columns.add(null);
                // Lote
                elem.setName(Cairo.Language.getText(1640, ""));
                elem.setType(Dialogs.PropertyType.text);
                elem.setWidth(2000);
                elem.setKey(KI_STL_CODIGO);
                //  HIDECOLS
                elem.setVisible(m_showStockData);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KI_STL_ID);

                var elem = w_columns.add(null);
                // Unidad
                elem.setName(Cairo.Language.getText(1165, ""));
                elem.setType(Dialogs.PropertyType.text);
                elem.setWidth(1000);
                elem.setKey(KI_UNIDAD);
                elem.setEnabled(false);
                //  HIDECOLS
                elem.setVisible(bColVisible);

                var elem = w_columns.add(null);
                // Precio (LP)
                elem.setName(Cairo.Language.getText(1587, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setFormat(m_generalConfig.getFormatDecImporte());
                elem.setWidth(1200);
                elem.setKey(KI_PRECIO_LP);
                elem.setEnabled(false);
                //  HIDECOLS
                elem.setVisible(bColVisible);

                var elem = w_columns.add(null);
                // Precio
                elem.setName(Cairo.Language.getText(1586, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setWidth(1200);
                elem.setFormat(m_generalConfig.getFormatDecImporte());
                elem.setKey(KI_PRECIO_USR);

                var elem = w_columns.add(null);
                // Descuento
                elem.setName(Cairo.Language.getText(1585, ""));
                elem.setType(Dialogs.PropertyType.text);
                elem.setWidth(1000);
                elem.setKey(KI_DESCUENTO);
                elem.setEnabled(true);

                var elem = w_columns.add(null);
                // Precio c/desc.
                elem.setName(Cairo.Language.getText(1588, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setWidth(1200);
                elem.setFormat(m_generalConfig.getFormatDecImporte());
                elem.setKey(KI_PRECIO);
                elem.setEnabled(false);

                var elem = w_columns.add(null);
                // Neto
                elem.setName(Cairo.Language.getText(1581, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setFormat(m_generalConfig.getFormatDecImporte());
                elem.setWidth(1200);
                elem.setKey(KI_NETO);
                elem.setEnabled(false);

                var elem = w_columns.add(null);
                // IVA RI
                elem.setName(Cairo.Language.getText(1582, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setFormat(m_generalConfig.getFormatDecImporte());
                elem.setWidth(1200);
                elem.setKey(KI_IVA_RI);

                var elem = w_columns.add(null);
                // IVA RNI
                elem.setName(Cairo.Language.getText(1583, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setFormat(m_generalConfig.getFormatDecImporte());
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setWidth(1200);
                elem.setKey(KI_IVA_RNI);
                elem.setEnabled(false);
                //  HIDECOLS
                elem.setVisible(bColVisible);

                // Internos
                var elem = w_columns.add(null);
                // Internos
                elem.setName(Cairo.Language.getText(4914, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setFormat(m_generalConfig.getFormatDecImporte());
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setWidth(1200);
                elem.setKey(KI_INTERNOS);
                elem.setEnabled(false);

                var elem = w_columns.add(null);
                // Importe
                elem.setName(Cairo.Language.getText(1228, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setFormat(m_generalConfig.getFormatDecImporte());
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setWidth(1200);
                elem.setKey(KI_IMPORTE);
                elem.setEnabled(false);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KI_IVA_RI_PERCENT);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KI_IVA_RNI_PERCENT);

                // Internos
                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KI_INTERNOS_PERCENT);

                // Internos
                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KI_INTERNOS_PORC);

                var elem = w_columns.add(null);
                // Centro de Costo
                elem.setName(Cairo.Language.getText(1057, ""));
                elem.setType(Dialogs.PropertyType.select);
                elem.setSelectTable(Cairo.Tables.CENTROCOSTO);
                elem.setWidth(1800);
                elem.setKey(Percepciones.KI_CCOS_ID);

                // Lote
                //
                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KI_PR_LLEVALOTE);

                // TO
                var elem = w_columns.add(null);
                // Tipo Operación
                elem.setName(Cairo.Language.getText(1661, ""));
                elem.setType(Dialogs.PropertyType.select);
                elem.setSelectTable(Cairo.Tables.TIPOOPERACION);
                elem.setWidth(1800);
                elem.setDefaultValue(new cABMGridRowValue());
                elem.getDefaultValue().setID(Cairo.Constants.c_TO_COMERCIALID);
                elem.getDefaultValue().setValue(Cairo.Constants.c_TO_Comercial);
                elem.setKey(KI_TO_ID);
                //  HIDECOLS
                elem.setVisible(bColVisible);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KI_PR_LLEVA_NRO_SERIE);

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KI_GRUPO);

                var w_rows = w_grid.getRows();

                  for(var _i = 0; _i < m_data.items.length; _i += 1) {

                  var elem = w_rows.add(null, rs(CC.FCI_ID).Value);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.items[_i], CC.FCI_ID);
                  elem.setKey(KI_FCI_ID);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.items[_i], C.PR_NOMBRECOMPRA);
                  elem.Id = Cairo.Database.valField(m_data.items[_i], C.PR_ID);
                  elem.setKey(KI_PR_ID);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.items[_i], C.CUE_ID);
                  elem.setKey(KI_CUE_ID);

                  var elem = elem.add(null);
                  if(m_bIva) {
                    elem.Value = Cairo.Database.valField(m_data.items[_i], C.CUE_ID_IVA_RI);
                  }
                  else {
                    elem.Value = Cairo.Constants.NO_ID;
                  }
                  elem.setKey(KI_CUE_ID_IVA_RI);

                  var elem = elem.add(null);
                  if(m_bIvaRni) {
                    elem.Value = Cairo.Database.valField(m_data.items[_i], C.CUE_ID_IVA_RNI);
                  }
                  else {
                    elem.Value = Cairo.Constants.NO_ID;
                  }
                  elem.setKey(KI_CUE_ID_IVA_RNI);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.items[_i], CC.FCI_DESCRIP);
                  elem.setKey(KI_DESCRIP);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.items[_i], CC.FCI_CANTIDAD);
                  elem.setKey(KI_CANTIDAD);

                  var elem = elem.add(null);
                  elem.Value = "";
                  elem.setKey(KI_NRO_SERIE);

                  // Lote
                  //
                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.items[_i], C.STL_CODE);
                  elem.setKey(KI_STL_CODIGO);

                  var elem = elem.add(null);
                  elem.Id = Cairo.Database.valField(m_data.items[_i], C.STL_ID);
                  elem.setKey(KI_STL_ID);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.items[_i], C.UN_NAME);
                  elem.setKey(KI_UNIDAD);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.items[_i], CC.FCI_PRECIO_LISTA) / cotizacion;
                  elem.setKey(KI_PRECIO_LP);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.items[_i], CC.FCI_PRECIO_USR) / cotizacion;
                  elem.setKey(KI_PRECIO_USR);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.items[_i], CC.FCI_DESCUENTO);
                  elem.setKey(KI_DESCUENTO);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.items[_i], CC.FCI_PRECIO) / cotizacion;
                  elem.setKey(KI_PRECIO);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.items[_i], CC.FCI_NETO) / cotizacion;
                  elem.setKey(KI_NETO);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.items[_i], CC.FCI_IVA_RI) / cotizacion;
                  elem.setKey(KI_IVA_RI);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.items[_i], CC.FCI_IVA_RNI) / cotizacion;
                  elem.setKey(KI_IVA_RNI);

                  // Internos
                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.items[_i], CC.FCI_INTERNOS) / cotizacion;
                  elem.setKey(KI_INTERNOS);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.items[_i], CC.FCI_IMPORTE) / cotizacion;
                  elem.setKey(KI_IMPORTE);

                  var elem = elem.add(null);
                  if(m_bIva) {
                    elem.Value = Cairo.Database.valField(m_data.items[_i], "iva_ri_porcentaje");
                  }
                  else {
                    elem.Value = 0;
                  }
                  elem.setKey(KI_IVA_RI_PERCENT);

                  var elem = elem.add(null);
                  if(m_bIvaRni) {
                    elem.Value = Cairo.Database.valField(m_data.items[_i], "iva_rni_porcentaje");
                  }
                  else {
                    elem.Value = 0;
                  }
                  elem.setKey(KI_IVA_RNI_PERCENT);

                  // Internos
                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.items[_i], "internos_porcentaje");
                  elem.setKey(KI_INTERNOS_PERCENT);

                  // Internos
                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.items[_i], C.PR_PORC_INTERNO_C);
                  elem.setKey(KI_INTERNOS_PORC);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.items[_i], C.CCOS_NAME);
                  elem.Id = Cairo.Database.valField(m_data.items[_i], C.CCOS_ID);
                  elem.setKey(Percepciones.KI_CCOS_ID);

                  // Lote
                  //
                  var elem = elem.add(null);
                  elem.Id = Cairo.Database.valField(m_data.items[_i], C.PR_LLEVA_NRO_LOTE);
                  elem.setKey(KI_PR_LLEVALOTE);

                  // TO
                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.items[_i], C.TO_NAME);
                  elem.Id = Cairo.Database.valField(m_data.items[_i], C.TO_ID);
                  elem.setKey(KI_TO_ID);

                  var elem = elem.add(null);
                  if(m_showStockData) {
                    elem.Id = Cairo.Database.valField(m_data.items[_i], C.PR_LLEVA_NRO_SERIE);
                  }
                  else {
                    elem.Id = false;
                  }
                  elem.setKey(KI_PR_LLEVA_NRO_SERIE);

                  var elem = elem.add(null);
                  elem.Id = Cairo.Database.valField(m_data.items[_i], CC.FCI_ID);
                  elem.setKey(KI_GRUPO);

                }

                var nroSerie = null;
                var curGroup = null;
                var coll = null;
                var nrosSerie = null;

                mCollection.collClear(m_nrosSerie);

                rs = rs.NextRecordset;

                  for(var _i = 0; _i < m_data.items.length; _i += 1) {

                  // Si cambie de grupo
                  if(curGroup !== Cairo.Database.valField(m_data.items[_i], CC.FCI_ID)) {

                    pSetNrosSerieInRow(curGroup, nrosSerie);
                    nrosSerie = "";

                    curGroup = Cairo.Database.valField(m_data.items[_i], CC.FCI_ID);
                    coll = new Collection();
                    m_nrosSerie.Add(coll, mCollection.getKey(curGroup));
                  }

                  // Guardo el numero de serie
                  nroSerie = new cProductoSerieType();
                  nroSerie.setCodigo(Cairo.Database.valField(m_data.items[_i], C.PRNS_CODE));
                  nroSerie.setDescrip(Cairo.Database.valField(m_data.items[_i], C.PRNS_DESCRIP));
                  nroSerie.setFechaVto(Cairo.Database.valField(m_data.items[_i], C.PRNS_FECHA_VTO));
                  nroSerie.setPrns_id(Cairo.Database.valField(m_data.items[_i], C.PRNS_ID));

                  nrosSerie = nrosSerie+ nroSerie.getCodigo()+ ",";

                  // Lo agrego a la bolsa
                  coll.Add(nroSerie, mCollection.getKey(nroSerie.getPrns_id()));

                }

                pSetNrosSerieInRow(curGroup, nrosSerie);

                return true;
              };

      var setGridPercepciones = function(property) {

                var w_grid = property.getGrid();
                w_grid.getColumns().clear();
                w_grid.getRows().clear();

                Percepciones.loadPercepciones(property.getGrid(), m_generalConfig);

                var w_rows = property.getGrid().getRows();

                  for(var _i = 0; _i < m_data.percepciones.length; _i += 1) {

                  var elem = w_rows.add(null, rs(CC.FCPERC_ID).Value);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.percepciones[_i], CC.FCPERC_ID);
                  elem.Key = Percepciones.KIP_FCPERC_ID;

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.percepciones[_i], C.PERC_NAME);
                  elem.Id = Cairo.Database.valField(m_data.percepciones[_i], C.PERC_ID);
                  elem.Key = Percepciones.KIP_PERC_ID;

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.percepciones[_i], CC.FCPERC_BASE) / cotizacion;
                  elem.Key = Percepciones.KIP_BASE;

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.percepciones[_i], CC.FCPERC_PORCENTAJE);
                  elem.Key = Percepciones.KIP_PORCENTAJE;

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.percepciones[_i], CC.FCPERC_IMPORTE) / cotizacion;
                  elem.Key = Percepciones.KIP_IMPORTE;

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.percepciones[_i], CC.FCPERC_DESCRIP);
                  elem.Key = Percepciones.KIP_DESCRIP;

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.percepciones[_i], C.CCOS_NAME);
                  elem.Id = Cairo.Database.valField(m_data.percepciones[_i], C.CCOS_ID);
                  elem.Key = Percepciones.KI_CCOS_ID;

                }

                return true;
              };

      var setGridLegajos = function(property) {

                var w_grid = property.getGrid();

                var w_columns = w_grid.getColumns();

                w_columns.clear();

                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KIL_FCLGJ_ID);

                var elem = w_columns.add(null);
                // Legajo
                elem.setName(Cairo.Language.getText(1575, ""));
                elem.setType(Dialogs.PropertyType.select);
                elem.setTable(CSLEGAJO);
                elem.setWidth(1800);
                elem.setKey(KIL_LGJ_ID);

                var elem = w_columns.add(null);
                // Importe
                elem.setName(Cairo.Language.getText(1228, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setFormat(m_generalConfig.getFormatDecImporte());
                elem.setWidth(1200);
                elem.setKey(KIL_IMPORTE);

                var elem = w_columns.add(null);
                // Observaciones
                elem.setName(Cairo.Language.getText(1861, ""));
                elem.setType(Dialogs.PropertyType.text);
                elem.setWidth(1800);
                elem.setKey(KIL_DESCRIP);

                var w_rows = w_grid.getRows();

                w_rows.clear();
                return true;
      };

      var pLoadLegajos = function() {


                  for(var _i = 0; _i < m_data.legajos.length; _i += 1) {

                  var elem = w_rows.add(null, rs(CC.FCLGJ_ID).Value);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.legajos[_i], CC.FCLGJ_ID);
                  elem.setKey(KIL_FCLGJ_ID);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.legajos[_i], C.LGJ_CODE);
                  elem.Id = Cairo.Database.valField(m_data.legajos[_i], C.LGJ_ID);
                  elem.setKey(KIL_LGJ_ID);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.legajos[_i], CC.FCLGJ_IMPORTE) / cotizacion;
                  elem.setKey(KIL_IMPORTE);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.legajos[_i], CC.FCLGJ_DESCRIP);
                  elem.setKey(KIL_DESCRIP);

                }

                return true;
              };

      var setGridOtros = function(property) {

                var w_grid = property.getGrid();
                w_grid.getColumns().clear();
                w_grid.getRows().clear();

                var w_columns = w_grid.getColumns();
                var elem = w_columns.add(null);
                elem.setVisible(false);
                elem.setKey(KI_FCOT_ID);

                var elem = w_columns.add(null);
                // Cuenta
                elem.setName(Cairo.Language.getText(1267, ""));
                elem.setType(Dialogs.PropertyType.select);
                elem.setSelectTable(Cairo.Tables.CUENTA);
                elem.setWidth(1800);
                elem.setKey(KI_CUE_ID);
                elem.setSelectFilter(GetHelpFilterCuenta());

                var elem = w_columns.add(null);
                // Debe
                elem.setName(Cairo.Language.getText(1904, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setFormat(m_generalConfig.getFormatDecImporte());
                elem.setWidth(1200);
                elem.setKey(KI_DEBE);

                var elem = w_columns.add(null);
                // Haber
                elem.setName(Cairo.Language.getText(1905, ""));
                elem.setType(Dialogs.PropertyType.numeric);
                elem.setFormat(m_generalConfig.getFormatDecImporte());
                elem.setSubType(Dialogs.PropertySubType.money);
                elem.setWidth(1200);
                elem.setKey(KI_HABER);

                var elem = w_columns.add(null);
                // Observaciones
                elem.setName(Cairo.Language.getText(1861, ""));
                elem.setType(Dialogs.PropertyType.text);
                elem.setWidth(1800);
                elem.setKey(KI_DESCRIP);

                var elem = w_columns.add(null);
                // Centro de Costo
                elem.setName(Cairo.Language.getText(1057, ""));
                elem.setType(Dialogs.PropertyType.select);
                elem.setSelectTable(Cairo.Tables.CENTROCOSTO);
                elem.setWidth(1800);
                elem.setKey(Percepciones.KI_CCOS_ID);

                var w_rows = w_grid.getRows();

                  for(var _i = 0; _i < m_data.otros.length; _i += 1) {

                  var elem = w_rows.add(null, rs(C.FCOT_ID).Value);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.otros[_i], C.FCOT_ID);
                  elem.setKey(KI_FCOT_ID);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.otros[_i], C.CUE_NAME);
                  elem.Id = Cairo.Database.valField(m_data.otros[_i], C.CUE_ID);
                  elem.setKey(KI_CUE_ID);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.otros[_i], C.FCOT_DEBE) / cotizacion;
                  elem.setKey(KI_DEBE);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.otros[_i], C.FCOT_HABER) / cotizacion;
                  elem.setKey(KI_HABER);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.otros[_i], C.FCOT_DESCRIP);
                  elem.setKey(KI_DESCRIP);

                  var elem = elem.add(null);
                  elem.Value = Cairo.Database.valField(m_data.otros[_i], C.CCOS_NAME);
                  elem.Id = Cairo.Database.valField(m_data.otros[_i], C.CCOS_ID);
                  elem.setKey(Percepciones.KI_CCOS_ID);

                }

                return true;
              };

              var pSetNrosSerieInRow = function(currGroup,  nroSerie) {
                var row = null;

                if(currGroup === 0) { return; }

                var _count = Cairo.Documents.getItems(m_items, C_ITEMS).Grid.cIABMGrid.getRows().size();
                for(var _i = 0; _i < _count; _i++) {
                  row = Cairo.Documents.getItems(m_items, C_ITEMS).Grid.cIABMGrid.getRows().item(_i);
                  if(Dialogs.cell(row, KI_GRUPO).getId() === currGroup) {
                    Dialogs.cell(row, KI_NRO_SERIE).getValue() === cUtil.removeLastColon(nroSerie);
                    return;
                  }
                }
              };

              var load = function(id) {
                var cotizacion = null;

                return Cairo.Database.getData("load[" + m_apiPath + "general/facturacompra]", id).then(
                  function(response) {

                    m_lastCpgId = -1;

                    if(response.success !== true) { return false; }

                    if(response.data.id !== Cairo.Constants.NO_ID) {

                      m_cotizacion = Cairo.Database.valField(response.data, CC.FC_COTIZACION);
                      cotizacion = (m_cotizacion !== 0) ? m_cotizacion : 1);

                      m_id = Cairo.Database.valField(response.data, CC.FC_ID);
                      m_numero = Cairo.Database.valField(response.data, CC.FC_NUMERO);
                      m_nrodoc = Cairo.Database.valField(response.data, CC.FC_NRODOC);
                      m_descrip = Cairo.Database.valField(response.data, CC.FC_DESCRIP);
                      m_fecha = Cairo.Database.valField(response.data, CC.FC_FECHA);
                      m_fechaentrega = Cairo.Database.valField(response.data, CC.FC_FECHA_ENTREGA);
                      m_fechaVto = Cairo.Database.valField(response.data, CC.FC_FECHA_VTO);
                      m_fechaIva = Cairo.Database.valField(response.data, CC.FC_FECHA_IVA);
                      m_neto = Cairo.Database.valField(response.data, CC.FC_NETO) / cotizacion;
                      m_ivari = Cairo.Database.valField(response.data, CC.FC_IVA_RI) / cotizacion;
                      m_ivarni = Cairo.Database.valField(response.data, CC.FC_IVA_RNI) / cotizacion;

                      // Internos
                      m_internos = Cairo.Database.valField(response.data, CC.FC_INTERNOS) / cotizacion;

                      m_total = Cairo.Database.valField(response.data, CC.FC_TOTAL) / cotizacion;
                      m_totalOtros = Cairo.Database.valField(response.data, CC.FC_TOTAL_OTROS) / cotizacion;
                      m_totalPercepciones = Cairo.Database.valField(response.data, CC.FC_TOTAL_PERCEPCIONES) / cotizacion;
                      m_subTotal = Cairo.Database.valField(response.data, CC.FC_SUBTOTAL) / cotizacion;
                      m_descuento1 = Cairo.Database.valField(response.data, CC.FC_DESCUENTO1);
                      m_descuento2 = Cairo.Database.valField(response.data, CC.FC_DESCUENTO2);
                      m_importeDesc1 = Cairo.Database.valField(response.data, CC.FC_IMPORTE_DESC_1) / cotizacion;
                      m_importeDesc2 = Cairo.Database.valField(response.data, CC.FC_IMPORTE_DESC_2) / cotizacion;
                      m_prov_id = Cairo.Database.valField(response.data, C.PROV_ID);
                      m_proveedor = Cairo.Database.valField(response.data, C.PROV_NAME);
                      m_ccos_id = Cairo.Database.valField(response.data, C.CCOS_ID);
                      m_centroCosto = Cairo.Database.valField(response.data, C.CCOS_NAME);
                      m_suc_id = Cairo.Database.valField(response.data, C.SUC_ID);
                      m_sucursal = Cairo.Database.valField(response.data, C.SUC_NAME);
                      m_doc_id = Cairo.Database.valField(response.data, C.DOC_ID);
                      m_documento = Cairo.Database.valField(response.data, C.DOC_NAME);
                      m_doct_id = Cairo.Database.valField(response.data, C.DOCT_ID);
                      m_lp_id = Cairo.Database.valField(response.data, C.LP_ID);
                      m_listaPrecio = Cairo.Database.valField(response.data, C.LP_NAME);
                      m_cpg_id = Cairo.Database.valField(response.data, C.CPG_ID);
                      m_condicionPago = Cairo.Database.valField(response.data, C.CPG_NAME);
                      m_ld_id = Cairo.Database.valField(response.data, C.LD_ID);
                      m_listaDescuento = Cairo.Database.valField(response.data, C.LD_NAME);
                      m_lgj_id = Cairo.Database.valField(response.data, C.LGJ_ID);
                      m_legajo = Cairo.Database.valField(response.data, C.LGJ_CODE);
                      m_cai = Cairo.Database.valField(response.data, CC.FC_CAI);
                      m_pro_id_origen = Cairo.Database.valField(response.data, C.PRO_ID_ORIGEN);
                      m_proOrigen = Cairo.Database.valField(response.data, "ProOrigen");
                      m_pro_id_destino = Cairo.Database.valField(response.data, C.PRO_ID_DESTINO);
                      m_proDestino = Cairo.Database.valField(response.data, "ProDestino");
                      m_creado = Cairo.Database.valField(response.data, Cairo.Constants.CREADO);
                      m_modificado = Cairo.Database.valField(response.data, Cairo.Constants.MODIFICADO);
                      m_modifico = Cairo.Database.valField(response.data, Cairo.Constants.MODIFICO);
                      m_est_id = Cairo.Database.valField(response.data, Cairo.Constants.EST_ID);
                      m_estado = Cairo.Database.valField(response.data, Cairo.Constants.EST_NAME);
                      m_firmado = Cairo.Database.valField(response.data, CC.FC_FIRMADO);
                      m_mon_id = Cairo.Database.valField(response.data, C.MON_ID);

                      m_docEditable = Cairo.Database.valField(response.data, Cairo.Constants.DOC_EDITABLE);
                      m_docEditMsg = Cairo.Database.valField(response.data, Cairo.Constants.DOCEDIT_MSG);

                      m_depl_id = Cairo.Database.valField(response.data, C.DEPL_ID);
                      m_deposito = Cairo.Database.valField(response.data, C.DEPL_NAME);

                      m_tipoComprobante = Cairo.Database.valField(response.data, CC.FC_TIPO_COMPROBANTE);

                      m_bIva = Cairo.Database.valField(response.data, C.BIVA_RI);
                      m_bIvaRni = Cairo.Database.valField(response.data, C.BIVA_RNI);

                      m_cotizacionProv = Cairo.Database.valField(response.data, CC.FC_COTIZACION_PROV);

                      // Para ver documentos auxiliares
                      //
                      m_as_id = Cairo.Database.valField(response.data, C.AS_ID);
                      m_st_id = Cairo.Database.valField(response.data, C.ST_ID);

                      m_taMascara = Cairo.Database.valField(response.data, Cairo.Constants.TA__MASCARA);
                      m_taPropuesto = Cairo.Database.valField(response.data, Cairo.Constants.TA__PROPUESTO);

                      m_lastDocId = m_doc_id;
                      //  nrs devolucion
                      m_lastDocIdtId = m_doct_id;
                      m_lastProvId = m_prov_id;
                      m_lastDocName = m_documento;
                      m_lastProvName = m_proveedor;

                      m_lastMonIdCotizacion = m_mon_id;
                      m_lastFecha = m_fecha;

                    }
                    else {
                      m_id = Cairo.Constants.NO_ID;
                      m_numero = 0;
                      m_nrodoc = "";
                      m_descrip = "";
                      m_fecha = cDate.vDGetDateById(csDateEnum.cSTODAY);
                      m_fechaentrega = cDate.vDGetDateById(csDateEnum.cSTOMORROW);
                      m_fechaVto = Cairo.Constants.cSNODATE;
                      m_fechaIva = m_fecha;
                      m_neto = 0;
                      m_ivari = 0;
                      m_ivarni = 0;

                      // Internos
                      m_internos = 0;

                      m_total = 0;
                      m_totalOtros = 0;
                      m_totalPercepciones = 0;
                      m_subTotal = 0;
                      m_descuento1 = 0;
                      m_descuento2 = 0;
                      m_importeDesc1 = 0;
                      m_importeDesc2 = 0;
                      m_prov_id = Cairo.Constants.NO_ID;
                      m_proveedor = "";
                      m_ccos_id = Cairo.Constants.NO_ID;
                      m_centroCosto = "";
                      m_doc_id = Cairo.Constants.NO_ID;
                      m_documento = "";
                      m_doct_id = Cairo.Constants.NO_ID;
                      m_lp_id = Cairo.Constants.NO_ID;
                      m_ld_id = Cairo.Constants.NO_ID;
                      m_cpg_id = Cairo.Constants.NO_ID;
                      m_lgj_id = Cairo.Constants.NO_ID;
                      m_legajo = "";
                      m_cai = "";
                      m_pro_id_origen = Cairo.Constants.NO_ID;
                      m_proOrigen = "";
                      m_pro_id_destino = Cairo.Constants.NO_ID;
                      m_proDestino = "";
                      m_condicionPago = "";
                      m_listaPrecio = "";
                      m_listaDescuento = "";
                      m_cotizacion = 0;
                      m_mon_id = Cairo.Constants.NO_ID;

                      m_creado = Cairo.Constants.cSNODATE;
                      m_modificado = Cairo.Constants.cSNODATE;
                      m_modifico = 0;
                      m_est_id = Cairo.Constants.NO_ID;
                      m_estado = "";
                      m_suc_id = cUtil.getUser().getSuc_id();
                      m_sucursal = cUtil.getUser().getSucursal();
                      m_firmado = false;

                      m_depl_id = Cairo.Constants.NO_ID;
                      m_deposito = "";

                      m_tipoComprobante = csETipoComprobante.cSETC_ORIGINAL;

                      m_doc_id = m_lastDocId;
                      //  nrs devolucion
                      m_doct_id = m_lastDocIdtId;
                      m_prov_id = m_lastProvId;
                      m_proveedor = m_lastProvName;
                      m_documento = m_lastDocName;

                      m_cotizacionProv = 0;

                      // Para ver documentos auxiliares
                      //
                      m_as_id = Cairo.Constants.NO_ID;
                      m_st_id = Cairo.Constants.NO_ID;

                      m_taMascara = "";
                      m_taPropuesto = false;

                      m_bIvaRni = false;
                      m_bIva = false;

                      m_lastMonIdCotizacion = Cairo.Constants.NO_ID;
                      m_lastFecha = Cairo.Constants.cSNODATE;

                      // Cotizacion
                      if(m_doc_id !== Cairo.Constants.NO_ID) {
                        m_cotizacion = DocGetCotizacion(m_doc_id, m_fecha);
                      }

                      DocEditableGet(m_doc_id, m_docEditable, m_docEditMsg, CS.NEW_FACTURA);

                    }

                    m_mon_id_document = m_mon_id;

                  return true;
                });
              };

              var self.Footer = function(rhs) {
                m_footer = rhs;

                if(rhs === null) { Exit Property; }

                m_footer.setIsDocument(true);
                m_footer.setIsFooter(true);
                m_footer.setObjForm(m_dialog.getObjForm());
              };

              var self.Items = function(rhs) {
                m_items = rhs;

                if(rhs === null) { Exit Property; }

                m_items.setIsDocument(true);
                m_items.setIsItems(true);
                m_items.setObjForm(m_dialog.getObjForm());
              };

              var pSaveItems = function(id,  cotizacion,  isDefaultCurrency) {

                // Generales
                //
                var transaction = new Cairo.Database.Transaction();
                var iOrden = null;
                var origen = null;
                var neto = null;
                var ivaRi = null;
                var ivaRni = null;
                //  Internos
                var internos = null;

                // Para numeros de serie
                //
                var iOrden2 = null;
                var grupo = null;
                var prId = null;

                var row = null;
                var cell = null;

                var _count = Cairo.Documents.getItems(m_items, C_ITEMS).Grid.cIABMGrid.getRows().size();
                for(var _i = 0; _i < _count; _i++) {
                  row = Cairo.Documents.getItems(m_items, C_ITEMS).Grid.cIABMGrid.getRows().item(_i);

                  var register = new Cairo.Database.Register();
                  register.setFieldId(CC.FCI_TMPID);
                  register.setTable(C.FACTURA_COMPRA_ITEM_TMP);
                  register.setId(Cairo.Constants.NEW_ID);

                  var _count = row.size();
                  for(var _j = 0; _j < _count; _j++) {
                    cell = row.item(_j);
                    switch (cell.getKey()) {

                      case KI_FCI_ID:
        register.setPath(m_apiPath + "general/facturacompra");

        if(m_copy) {
                          fields.add(CC.FCI_ID, Cairo.Constants.NEW_ID, Types.integer);
                        }
                        else {
                          fields.add(CC.FCI_ID, Cairo.Util.val(cell.getValue()), Types.integer);
                        }
                        break;

                      case KI_CANTIDAD:
                        fields.add(CC.FCI_CANTIDAD, cell.getValue(), Types.double);
                        break;

                      case KI_DESCRIP:
                        fields.add(CC.FCI_DESCRIP, cell.getValue(), Types.text);
                        break;

                      case KI_DESCUENTO:
                        fields.add(CC.FCI_DESCUENTO, cell.getValue(), Types.text);
                        break;

                      case KI_PRECIO:
                        fields.add(CC.FCI_PRECIO, Cairo.Util.val(cell.getValue()) * cotizacion, Types.currency);
                        break;

                      case KI_PRECIO_LP:
                        fields.add(CC.FCI_PRECIO_LISTA, Cairo.Util.val(cell.getValue()) * cotizacion, Types.currency);
                        break;

                      case KI_PRECIO_USR:
                        fields.add(CC.FCI_PRECIO_USR, Cairo.Util.val(cell.getValue()) * cotizacion, Types.currency);
                        break;

                      case KI_NETO:
                        neto = Cairo.Util.val(cell.getValue());
                        fields.add(CC.FCI_NETO, neto * cotizacion, Types.currency);
                        break;

                      case KI_IVA_RI:
                        // Por seguridad
                        if(m_bIva) {
                          ivaRi = Cairo.Util.val(cell.getValue());
                          fields.add(CC.FCI_IVA_RI, ivaRi * cotizacion, Types.currency);
                        }
                        break;

                      case KI_IVA_RNI:
                        // Por seguridad
                        if(m_bIvaRni) {
                          ivaRni = Cairo.Util.val(cell.getValue());
                          fields.add(CC.FCI_IVA_RNI, ivaRni * cotizacion, Types.currency);
                        }

                        // Internos
                        break;

                      case KI_INTERNOS:
                        internos = Cairo.Util.val(cell.getValue());
                        fields.add(CC.FCI_INTERNOS, internos * cotizacion, Types.currency);

                        break;

                      case KI_IVA_RI_PERCENT:
                        fields.add(CC.FCI_IVA_RIPORC, cell.getValue(), Types.double);
                        break;

                      case KI_IVA_RNI_PERCENT:
                        fields.add(CC.FCI_IVA_RNIPORC, cell.getValue(), Types.double);

                        // Internos
                        break;

                      case KI_INTERNOS_PERCENT:
                        fields.add(CC.FCI_INTERNOS_PORC, cell.getValue(), Types.double);

                        break;

                      case KI_PR_ID:
                        prId = cell.getId();
                        fields.add(C.PR_ID, prId, Types.id);
                        break;

                      case Percepciones.KI_CCOS_ID:
                        fields.add(C.CCOS_ID, cell.getId(), Types.id);
                        // TO
                        break;

                      case KI_TO_ID:
                        fields.add(C.TO_ID, cell.getId(), Types.id);
                        break;

                      case KI_CUE_ID:
                        fields.add(C.CUE_ID, Cairo.Util.val(cell.getValue()), Types.id);
                        break;

                      case KI_CUE_ID_IVA_RI:
                        fields.add(C.CUE_ID_IVA_RI, Cairo.Util.val(cell.getValue()), Types.id);
                        break;

                      case KI_CUE_ID_IVA_RNI:
                        fields.add(C.CUE_ID_IVA_RNI, Cairo.Util.val(cell.getValue()), Types.id);
                        break;

                      case KI_GRUPO:
                        grupo = cell.getId();

                        // Lote
                        //
                        break;

                      case KI_STL_CODIGO:
                        fields.add(C.STL_CODE, cell.getValue(), Types.text);
                        break;

                      case KI_STL_ID:
                        fields.add(C.STL_ID, cell.getId(), Types.id);
                        break;
                    }
                  }

                  // Por seguridad
                  origen = neto;
                  if(m_bIva) {
                    origen = origen + ivaRi;
                  }
                  if(m_bIvaRni) {
                    origen = origen + ivaRni;
                  }

                  // Internos
                  origen = origen + internos;

                  fields.add(CC.FCI_IMPORTE, origen * cotizacion, Types.currency);
                  if(isDefaultCurrency) {
                    fields.add(CC.FCI_IMPORTE_ORIGEN, 0, Types.currency);
                  }
                  else {
                    fields.add(CC.FCI_IMPORTE_ORIGEN, origen, Types.currency);
                  }

                  iOrden = iOrden + 1;
                  fields.add(CC.FCI_ORDEN, iOrden, Types.integer);
                  fields.add(CC.FC_TMPID, id, Types.id);

                  register.getFields().setHaveLastUpdate(false);
                  register.getFields().setHaveWhoModify(false);

                  transaction.addRegister(register);

                  // Si es nuevo se usa el orden
                  if(grupo === 0) { grupo = iOrden * -1; }
                  if(!pSaveItemNroSerie(row, iOrden2, prId, id, register.getId(), grupo)) { return false; }
                }

                if(m_itemsDeleted !== "" && m_id !== Cairo.Constants.NO_ID && !m_copy) {

                  var vDeletes = null;
                  var i = null;

                  vDeletes = Split(m_itemsDeleted, ",");

                  for(i = 0; i <= vDeletes.Length; i++) {

                    var register = new Cairo.Database.Register();
                    register.setFieldId(C.FCIB_TMPID);
                    register.setTable(C.FACTURA_COMPRA_ITEMBORRADO_TMP);
                    register.setId(Cairo.Constants.NEW_ID);

                    fields.add(CC.FCI_ID, Cairo.Util.val(vDeletes(i)), Types.integer);
                    fields.add(CC.FC_ID, m_id, Types.id);
                    fields.add(CC.FC_TMPID, id, Types.id);

                    register.getFields().setHaveLastUpdate(false);
                    register.getFields().setHaveWhoModify(false);

                    transaction.addRegister(register);
                  }

                }

                mainTransaction.addTransaction(transaction);

                return true;
              };

              var pSaveOtros = function(id, cotizacion, isDefaultCurrency) {
                var register = null;
                var property = null;
                var iOrden = null;
                var origen = null;

                var property = m_items.getProperties().item(C_OTROS);
                var row = null;
                var cell = null;

                var _count = property.getGrid().getRows().size();
                for(var _i = 0; _i < _count; _i++) {
                  row = property.getGrid().getRows().item(_i);

                  register = new cRegister();
                  register.setFieldId(C.FCOT_TMPID);
                  register.setTable(C.FACTURA_COMPRA_OTRO_TMP);
                  register.setId(Cairo.Constants.NEW_ID);

                  var _count = row.size();
                  for(var _j = 0; _j < _count; _j++) {
                    cell = row.item(_j);
                    switch (cell.getKey()) {

                      case KI_FCOT_ID:
                        if(m_copy) {
                          fields.add(C.FCOT_ID, Cairo.Constants.NEW_ID, Types.integer);
                        }
                        else {
                          fields.add(C.FCOT_ID, Cairo.Util.val(cell.getValue()), Types.integer);
                        }
                        break;

                      case KI_CUE_ID:
                        fields.add(C.CUE_ID, cell.getId(), Types.id);
                        break;

                      case KI_DEBE:
                        if(Cairo.Util.val(cell.getValue()) > 0) { origen = Cairo.Util.val(cell.getValue()); }
                        fields.add(C.FCOT_DEBE, Cairo.Util.val(cell.getValue()) * cotizacion, Types.currency);
                        break;

                      case KI_HABER:
                        if(Cairo.Util.val(cell.getValue()) > 0) { origen = Cairo.Util.val(cell.getValue()); }
                        fields.add(C.FCOT_HABER, Cairo.Util.val(cell.getValue()) * cotizacion, Types.currency);
                        break;

                      case Percepciones.KI_CCOS_ID:
                        fields.add(C.CCOS_ID, cell.getId(), Types.id);
                        break;

                      case KI_DESCRIP:
                        fields.add(C.FCOT_DESCRIP, cell.getValue(), Types.text);
                        break;
                    }
                  }

                  if(isDefaultCurrency) {
                    fields.add(C.FCOT_ORIGEN, 0, Types.currency);
                  }
                  else {
                    fields.add(C.FCOT_ORIGEN, origen, Types.currency);
                  }

                  iOrden = iOrden + 1;
                  fields.add(C.FCOT_ORDEN, iOrden, Types.integer);
                  fields.add(CC.FC_TMPID, id, Types.id);

                  register.getFields().setHaveLastUpdate(false);
                  register.getFields().setHaveWhoModify(false);

                  if(!Cairo.Database.save(register, , "pSaveotros", C_MODULE, SAVE_ERROR_MESSAGE)) { return false; }
                }

                var sqlstmt = null;

                if(m_otrosDeleted !== "" && m_id !== Cairo.Constants.NO_ID && !m_copy) {

                  var vDeletes = null;
                  var i = null;

                  m_otrosDeleted = cUtil.removeLastColon(m_otrosDeleted);
                  vDeletes = Split(m_otrosDeleted, ",");

                  for(i = 0; i <= vDeletes.Length; i++) {

                    register = new cRegister();
                    register.setFieldId(C.FCOTB_TMPID);
                    register.setTable(C.FACTURA_COMPRA_OTRO_BORRADO_TMP);
                    register.setId(Cairo.Constants.NEW_ID);

                    fields.add(C.FCOT_ID, Cairo.Util.val(vDeletes(i)), Types.integer);
                    fields.add(CC.FC_ID, m_id, Types.id);
                    fields.add(CC.FC_TMPID, id, Types.id);

                    register.getFields().setHaveLastUpdate(false);
                    register.getFields().setHaveWhoModify(false);

                    if(!Cairo.Database.save(register, , "pSaveotros", C_MODULE, SAVE_ERROR_MESSAGE)) { return false; }
                  }

                }

                return true;
              };

              var pSaveLegajos = function(id,  cotizacion,  isDefaultCurrency) {
                var register = null;
                var property = null;
                var iOrden = null;
                var origen = null;

                var property = m_items.getProperties().item(C_LEGAJOS);
                var row = null;
                var cell = null;

                var _count = property.getGrid().getRows().size();
                for(var _i = 0; _i < _count; _i++) {
                  row = property.getGrid().getRows().item(_i);

                  register = new cRegister();

                  register.setFieldId(CC.FCLGJ_TMPID);
                  register.setTable(C.FACTURA_COMPRA_LEGAJO_TMP);
                  register.setId(Cairo.Constants.NEW_ID);

                  var w_fields = register.getFields();

                  var _count = row.size();
                  for(var _j = 0; _j < _count; _j++) {
                    cell = row.item(_j);
                    switch (cell.getKey()) {

                      case KIL_FCLGJ_ID:
                        if(m_copy) {
                          w_fields.add2(CC.FCLGJ_ID, Cairo.Constants.NEW_ID, Types.integer);
                        }
                        else {
                          w_fields.add2(CC.FCLGJ_ID, Cairo.Util.val(cell.getValue()), Types.integer);
                        }
                        break;

                      case KIL_LGJ_ID:
                        w_fields.add2(C.LGJ_ID, cell.getId(), Types.id);
                        break;

                      case KIL_IMPORTE:
                        origen = Cairo.Util.val(cell.getValue());
                        w_fields.add2(CC.FCLGJ_IMPORTE, origen * cotizacion, Types.currency);
                        break;

                      case Percepciones.KI_CCOS_ID:
                        w_fields.add2(C.CCOS_ID, cell.getId(), Types.id);
                        break;

                      case KIL_DESCRIP:
                        w_fields.add2(CC.FCLGJ_DESCRIP, cell.getValue(), Types.text);
                        break;
                    }
                  }

                  if(isDefaultCurrency) {
                    w_fields.add2(CC.FCLGJ_IMPORTE_ORIGEN, 0, Types.currency);
                  }
                  else {
                    w_fields.add2(CC.FCLGJ_IMPORTE_ORIGEN, origen, Types.currency);
                  }

                  iOrden = iOrden + 1;
                  w_fields.add2(CC.FCLGJ_ORDEN, iOrden, Types.integer);
                  w_fields.add2(CC.FC_TMPID, id, Types.id);

                  w_fields.setHaveLastUpdate(false);
                  w_fields.setHaveWhoModify(false);

                  if(!Cairo.Database.save(register, , "pSaveLegajos", C_MODULE, SAVE_ERROR_MESSAGE)) { return false; }
                }

                var sqlstmt = null;

                if(m_legajosDeleted !== "" && m_id !== Cairo.Constants.NO_ID && !m_copy) {

                  var vDeletes = null;
                  var i = null;

                  m_legajosDeleted = cUtil.removeLastColon(m_legajosDeleted);
                  vDeletes = Split(m_legajosDeleted, ",");

                  for(i = 0; i <= vDeletes.Length; i++) {

                    register = new cRegister();
                    register.setFieldId(CC.FC_LGJB_TMPID);
                    register.setTable(C.FACTURA_COMPRA_LEGAJO_BORRADO_TMP);
                    register.setId(Cairo.Constants.NEW_ID);

                    var w_fields = register.getFields();
                    w_fields.add2(CC.FCLGJ_ID, Cairo.Util.val(vDeletes(i)), Types.integer);
                    w_fields.add2(CC.FC_ID, m_id, Types.id);
                    w_fields.add2(CC.FC_TMPID, id, Types.id);

                    w_fields.setHaveLastUpdate(false);
                    w_fields.setHaveWhoModify(false);

                    if(!Cairo.Database.save(register, , "pSaveLegajos", C_MODULE, SAVE_ERROR_MESSAGE)) { return false; }
                  }

                }

                return true;
              };

              // Reglas del Objeto de Negocios
              var pDocAsistTipo = function() {
                var doc = null;
                var rtn = null;
                var docId = null;

                // Si todavia no se cargo el form no se que
                // documento es, asi que no puede ser sobre orden
                if(getDocId() === null) { return; }

                docId = getDocId().getSelectId();

                // Si no hay un documento activo no se hace nada
                if(docId === Cairo.Constants.NO_ID) { return; }

                doc = new cDocumento();

                return doc.GetData(docId, C.DOC_TIPO_FACTURA, Types.integer);
              };

              var docDesdeOrden = function() {
                return pDocAsistTipo() === csETFacOrden;
              };

              var docDesdeRemito = function() {
                return pDocAsistTipo() === csETFacRemito;
              };

              var showImporteAndIva = function(row) { // TODO: Use of ByRef founded Private Sub showImporteAndIva(ByRef Row As CSInterfacesABM.cIABMGridRow)
                var importe = null;
                var neto = null;
                var ivaRi = null;
                var ivaRni = null;
                //  Internos
                var internos = null;

                pApplyDescuentos(row);

                neto = Cairo.Util.val(Dialogs.cell(row, KI_CANTIDAD).getValue()) * Cairo.Util.val(Dialogs.cell(row, KI_PRECIO).getValue());
                if(m_bIva) {
                  ivaRi = (neto * Cairo.Util.val(Dialogs.cell(row, KI_IVA_RI_PERCENT).getValue())) / 100;
                }
                if(m_bIvaRni) {
                  ivaRni = (neto * Cairo.Util.val(Dialogs.cell(row, KI_IVA_RNI_PERCENT).getValue())) / 100;
                }

                // Internos
                internos = (neto * (Cairo.Util.val(Dialogs.cell(row, KI_INTERNOS_PORC).getValue()) / 100) * Cairo.Util.val(Dialogs.cell(row, KI_INTERNOS_PERCENT).getValue())) / 100;

                // Internos
                importe = neto + ivaRi + ivaRni + internos;

                Dialogs.cell(row, KI_NETO).getValue() === neto;
                Dialogs.cell(row, KI_IVA_RI).getValue() === ivaRi;
                Dialogs.cell(row, KI_IVA_RNI).getValue() === ivaRni;

                // Internos
                Dialogs.cell(row, KI_INTERNOS).getValue() === internos;
                Dialogs.cell(row, KI_IMPORTE).getValue() === importe;
              };

              var pApplyDescuentos = function(row) { // TODO: Use of ByRef founded Private Sub pApplyDescuentos(ByRef Row As CSInterfacesABM.cIABMGridRow)
                var vDesc = null;
                var sDesc = null;
                var i = null;
                var precio = null;

                sDesc = Dialogs.cell(row, KI_DESCUENTO).getValue();
                precio = Cairo.Util.val(Dialogs.cell(row, KI_PRECIO_USR).getValue());

                if(sDesc !== "") {

                  vDesc = Split(sDesc, "+");

                  for(i = 0; i <= vDesc.Length; i++) {

                    precio = precio - (precio * Cairo.Util.val(vDesc(i)) / 100);

                  }

                }

                Dialogs.cell(row, KI_PRECIO).getValue() === precio;
              };

              var showImporteAndIvaManual = function(row) { // TODO: Use of ByRef founded Private Sub showImporteAndIvaManual(ByRef Row As CSInterfacesABM.cIABMGridRow)
                var importe = null;
                var neto = null;
                var ivaRi = null;
                var ivaRni = null;
                //  Internos
                var internos = null;

                pApplyDescuentos(row);

                neto = Cairo.Util.val(Dialogs.cell(row, KI_CANTIDAD).getValue()) * Cairo.Util.val(Dialogs.cell(row, KI_PRECIO).getValue());
                ivaRi = Dialogs.cell(row, KI_IVA_RI).getValue();
                if(m_bIvaRni) {
                  ivaRni = (neto * Cairo.Util.val(Dialogs.cell(row, KI_IVA_RNI_PERCENT).getValue())) / 100;
                }

                // Internos
                internos = (neto * (Cairo.Util.val(Dialogs.cell(row, KI_INTERNOS_PORC).getValue()) / 100) * Cairo.Util.val(Dialogs.cell(row, KI_INTERNOS_PERCENT).getValue())) / 100;

                // Internos
                importe = neto + ivaRi + ivaRni + internos;

                Dialogs.cell(row, KI_NETO).getValue() === neto;
                Dialogs.cell(row, KI_IVA_RNI).getValue() === ivaRni;

                // Internos
                Dialogs.cell(row, KI_INTERNOS).getValue() === internos;
                Dialogs.cell(row, KI_IMPORTE).getValue() === importe;
              };

              var updateTotals = function() {
                var rows = null;
                var rowsOtros = null;
                var rowsPercep = null;

                var neto = null;
                var ivaRi = null;
                var ivaRni = null;
                var desc1 = null;
                var desc2 = null;
                var otros = null;
                var percep = null;
                //  Internos
                var internos = null;
                var row = null;

                rows = Cairo.Documents.getItems(m_items, C_ITEMS).Grid.rows;
                rowsOtros = m_items.getProperties().item(C_OTROS).getGrid().getRows();
                rowsPercep = m_items.getProperties().item(C_PERCEPCIONES).getGrid().getRows();

                var _count = rows.size();
                for(var _i = 0; _i < _count; _i++) {
                  row = rows.item(_i);
                  neto = neto + Cairo.Util.val(Dialogs.cell(row, KI_NETO).getValue());
                  ivaRi = ivaRi + Cairo.Util.val(Dialogs.cell(row, KI_IVA_RI).getValue());
                  ivaRni = ivaRni + Cairo.Util.val(Dialogs.cell(row, KI_IVA_RNI).getValue());

                  // Internos
                  internos = internos + Cairo.Util.val(Dialogs.cell(row, KI_INTERNOS).getValue());
                }

                var _count = rowsOtros.size();
                for(var _i = 0; _i < _count; _i++) {
                  row = rowsOtros.item(_i);
                  otros = otros + Cairo.Util.val(Dialogs.cell(row, KI_DEBE).getValue()) - Cairo.Util.val(Dialogs.cell(row, KI_HABER).getValue());
                }

                var _count = rowsPercep.size();
                for(var _i = 0; _i < _count; _i++) {
                  row = rowsPercep.item(_i);
                  percep = percep + Cairo.Util.val(Dialogs.cell(row, Percepciones.KIP_IMPORTE).getValue());
                }

                var properties = m_footer.getProperties();
                properties.item(CC.FC_SUBTOTAL).setValue(neto);

                desc1 = m_dialog.getProperties().item(CC.FC_DESCUENTO1).getValue();
                desc2 = m_dialog.getProperties().item(CC.FC_DESCUENTO2).getValue();

                ivaRi = ivaRi - (ivaRi * desc1 / 100);
                ivaRni = ivaRni - (ivaRni * desc1 / 100);
                internos = internos - (internos * desc1 / 100);

                ivaRi = ivaRi - (ivaRi * desc2 / 100);
                ivaRni = ivaRni - (ivaRni * desc2 / 100);
                internos = internos - (internos * desc2 / 100);

                desc1 = neto * desc1 / 100;
                properties.item(CC.FC_IMPORTE_DESC_1).setValue(desc1);

                neto = neto - desc1;

                desc2 = neto * desc2 / 100;
                properties.item(CC.FC_IMPORTE_DESC_2).setValue(desc2);

                neto = neto - desc2;

                properties.item(CC.FC_NETO).setValue(neto);
                properties.item(CC.FC_IVA_RI).setValue(ivaRi);
                properties.item(CC.FC_IVA_RNI).setValue(ivaRni);

                // Internos
                properties.item(CC.FC_INTERNOS).setValue(internos);
                properties.item(CC.FC_TOTAL_OTROS).setValue(otros);
                properties.item(CC.FC_TOTAL_PERCEPCIONES).setValue(percep);

                // Internos
                properties.item(CC.FC_TOTAL).setValue(neto + ivaRni + ivaRi + otros + percep + internos);

                m_footer.refreshControls();
              };

              var setTasasImpositivas = function(row,  pR_ID,  pr_nombre) { // TODO: Use of ByRef founded Private Sub setTasasImpositivas(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal PR_ID As Long, ByVal pr_nombre As String)
                var ti_ri = null;
                var ti_rni = null;
                //  Internos
                var ti_internos = null;
                var porc_internos = null;

                if(pR_ID === 0) { return; }

                // Internos
                if(!GetTasaFromProductoEx(pR_ID, ti_ri, ti_rni, ti_internos, porc_internos, true)) { return; }

                if(ti_ri === 0) {
                  Cairo.Modal.showWarning(Cairo.Language.getText(1597, "", pr_nombre));
                  //El producto [" & pr_nombre & "] no tiene definida su tasa impositiva de Compras para el iva responsable inscripto
                  return;
                }

                if(ti_rni === 0) {
                  Cairo.Modal.showWarning(Cairo.Language.getText(1598, "", pr_nombre));
                  //El producto [" & pr_nombre & "] no tiene definida su tasa impositiva de Compras para el iva responsable no inscripto
                  return;
                }

                var sqlstmt = null;
                var rs = null;

                if(m_bIva) {
                  sqlstmt = "select ti_porcentaje,cue_id from tasaimpositiva where ti_id = "+ ti_ri.toString();
                  if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

                  if(!rs.isEOF()) {
                    Dialogs.cell(row, KI_IVA_RI_PERCENT).getValue() === Cairo.Database.valField(rs.getFields(), C.TI_PORCENTAJE);
                    Dialogs.cell(row, KI_CUE_ID_IVA_RI).getValue() === Cairo.Database.valField(rs.getFields(), C.CUE_ID);
                  }
                }
                else {
                  Dialogs.cell(row, KI_IVA_RI_PERCENT).setValue(0);
                  Dialogs.cell(row, KI_CUE_ID_IVA_RI).setValue(Cairo.Constants.NO_ID);
                }

                if(m_bIvaRni) {
                  sqlstmt = "select ti_porcentaje,cue_id from tasaimpositiva where ti_id = "+ ti_rni.toString();
                  if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

                  if(!rs.isEOF()) {
                    Dialogs.cell(row, KI_IVA_RNI_PERCENT).getValue() === Cairo.Database.valField(rs.getFields(), C.TI_PORCENTAJE);
                    Dialogs.cell(row, KI_CUE_ID_IVA_RNI).getValue() === Cairo.Database.valField(rs.getFields(), C.CUE_ID);
                  }
                }
                else {
                  Dialogs.cell(row, KI_IVA_RNI_PERCENT).setValue(0);
                  Dialogs.cell(row, KI_CUE_ID_IVA_RNI).setValue(Cairo.Constants.NO_ID);
                }

                // Internos
                sqlstmt = "select ti_porcentaje from tasaimpositiva where ti_id = "+ ti_internos.toString();
                if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

                if(!rs.isEOF()) {
                  // Internos
                  Dialogs.cell(row, KI_INTERNOS_PERCENT).getValue() === Cairo.Database.valField(rs.getFields(), C.TI_PORCENTAJE);
                  Dialogs.cell(row, KI_INTERNOS_PORC).setValue(porc_internos);
                }

              };

              var setDataProducto = function(row,  pR_ID) { // TODO: Use of ByRef founded Private Sub setDataProducto(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal PR_ID As Long)
                var sqlstmt = null;
                var rs = null;

                var bChanged = null;

                bChanged = pR_ID !== Dialogs.cell(row, KI_PR_ID).getId();

                sqlstmt = "sp_StockProductoGetData "+ pR_ID.toString()+ ",Null,"+ getProvId().toString();

                if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

                if(!rs.isEOF()) {
                  Dialogs.cell(row, KI_UNIDAD).getValue() === Cairo.Database.valField(rs.getFields(), "unidadCompra");

                  var w_pCell = Dialogs.cell(row, Percepciones.KI_CCOS_ID);
                  w_pCell.setValue(Cairo.Database.valField(rs.getFields(), "centro_costo_compra"));
                  w_pCell.setID(Cairo.Database.valField(rs.getFields(), C.CCOS_ID_COMPRA));

                  Dialogs.cell(row, KI_CUE_ID).getValue() === Cairo.Database.valField(rs.getFields(), C.CUEID_COMPRA);

                  // Si el documento no mueve stock no se exigen los numeros de serie
                  //
                  if(m_showStockData) {
                    Dialogs.cell(row, KI_PR_LLEVA_NRO_SERIE).getId() === Cairo.Database.valField(rs.getFields(), C.PR_LLEVA_NRO_SERIE);
                    // Lote
                    //
                    Dialogs.cell(row, KI_PR_LLEVALOTE).getId() === Cairo.Database.valField(rs.getFields(), C.PR_LLEVA_NRO_LOTE);
                  }
                  else {
                    Dialogs.cell(row, KI_PR_LLEVA_NRO_SERIE).getId() === false;
                    Dialogs.cell(row, KI_PR_LLEVALOTE).getId() === false;
                  }
                }

                // Si cambio el producto borro los numeros de serie
                //
                if(bChanged || Dialogs.cell(row, KI_PR_LLEVA_NRO_SERIE).getId() === 0) {

                  Dialogs.cell(row, KI_NRO_SERIE).getValue() === "";
                  if(mCollection.existsObjectInColl(m_nrosSerie, mCollection.getKey(Dialogs.cell(row, KI_GRUPO).getId()))) {

                    m_nrosSerie.remove(mCollection.getKey(Dialogs.cell(row, KI_GRUPO).getId()));
                  }
                }
              };

              var setPrecios = function(row,  pR_ID) { // TODO: Use of ByRef founded Private Sub setPrecios(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal PR_ID As Long)
                var lP = null;
                var lp_id = null;
                var precio = null;

                lp_id = m_dialog.getProperties().item(C.LP_ID).getSelectId();

                if(lp_id !== Cairo.Constants.NO_ID) {
                  lP = new cListaPrecio();
                  precio = lP.getPrecio(lp_id, pR_ID);
                }

                Dialogs.cell(row, KI_PRECIO_LP).getValue() === precio;
                Dialogs.cell(row, KI_PRECIO_USR).getValue() === precio;
              };

              var setDescuentos = function(row,  pR_ID,  precio) { // TODO: Use of ByRef founded Private Sub setDescuentos(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal PR_ID As Long, ByVal Precio As Double)
                var lD = null;
                var ld_id = null;
                var descuento = null;

                ld_id = m_dialog.getProperties().item(C.LD_ID).getSelectId();

                if(ld_id !== Cairo.Constants.NO_ID) {
                  lD = new cListaDescuento();

                  // En compras no utilizamos el precio, sino que
                  // calculamos el descuento en funcion de lo
                  // que se define en el string descuentos
                  //
                  precio = lD.GetPrecio(ld_id, pR_ID, precio);
                  descuento = lD.getDescuentoStr(ld_id, pR_ID);
                  descuento = descuento.Replace("$", "");
                  descuento = descuento.Replace("%", "");
                  Dialogs.cell(row, KI_DESCUENTO).getValue() === descuento;
                }

              };

              var setEnabled = function() {
                var bState = null;

                // Si se genera desde una orden de compra y es nuevo
                // no puede editar, tiene que hacer click en
                // nuevo y llamar al asistente
                if(docDesdeOrden() && m_id === Cairo.Constants.NO_ID) {
                  bState = false;
                }
                else if(docDesdeRemito() && m_id === Cairo.Constants.NO_ID) {
                  bState = false;
                }
                else if(m_docEditable) {
                  bState = getDocId().getSelectId() !== Cairo.Constants.NO_ID;
                }
                else {
                  bState = false;
                }

                setEnabledAux(bState);
              };

              var setEnabledAux = function(bState) {
                var prop = null;

                var _count = m_dialog.getProperties().size();
                for(var _i = 0; _i < _count; _i++) {
                  prop = m_dialog.getProperties().item(_i);
                  // HIDECOLS
                  if(prop.getKey() !== K_DOC_ID && prop.getKey() !== K_NUMERO && prop.getKey() !== K_EST_ID && prop.getKey() !== K_HIDECOLS) {

                    if(bState) {
                      if(prop.getKey() !== K_NRODOC) {
                        prop.setEnabled(bState);
                      }
                      else {
                        prop.setEnabled(m_taPropuesto);
                      }
                    }
                    else {
                      prop.setEnabled(false);
                    }
                  }
                }

                if(bState) {
                  var properties = m_dialog.getProperties();
                  properties.item(C.DEPL_ID_ORIGEN).setEnabled(m_showStockData);
                }

                var _count = m_items.getProperties().size();
                for(var _i = 0; _i < _count; _i++) {
                  prop = m_items.getProperties().item(_i);
                  prop.setEnabled(bState);
                }

                #If PREPROC_SFS Then;
                var abmGen = null;
                #Else;
                var abmGen = null;
                #End If;

                abmGen = m_items;
                abmGen.refreshEnabledState(m_items.getProperties());

                abmGen = m_dialog;
                abmGen.refreshEnabledState(m_dialog.getProperties());

              };

              var setDatosProveedor = function() {
                var _rtn = null;
                var lp_id = null;
                var ld_id = null;
                var cpg_id = null;
                var cpg_nombre = null;
                var lP = null;
                var lD = null;
                var iProp = null;
                var filter = null;
                var bProveedorChange = null;

                var property = m_dialog.getProperties().item(C.PROV_ID);
                if(m_lastProvId === property.getSelectId()) {
                  return _rtn;
                }
                bProveedorChange = true;
                m_lastProvId = property.getSelectId();

                _rtn = bProveedorChange;

                if(!GetProveedorDataEx(m_lastProvId, lp_id, ld_id, cpg_id, m_lastDocId)) { return _rtn; }

                // Condicion de pago
                if(cpg_id !== Cairo.Constants.NO_ID) {

                  if(!Cairo.Database.getData(C.CONDICIONPAGO, C.CPG_ID, cpg_id, C.CPG_NAME, cpg_nombre)) { return _rtn; }

                  iProp = m_dialog.getProperties().item(C.CPG_ID);
                  iProp.setValue(cpg_nombre);
                  iProp.setSelectId(cpg_id);
                  m_dialog.showValue(iProp);
                }

                // Lista de precios
                iProp = m_dialog.getProperties().item(C.LP_ID);
                iProp.setSelectFilter(GetListaPrecioGetXProveedor(m_lastDocId, m_lastProvId));

                if(lp_id !== Cairo.Constants.NO_ID) {
                  lP = new cListaPrecio();
                  iProp.setValue(lP.GetData(lp_id, C.LP_NAME, Types.text));
                  iProp.setSelectId(lp_id);
                }

                m_dialog.showValue(iProp);

                // Lista de descuentos
                iProp = m_dialog.getProperties().item(C.LD_ID);
                iProp.setSelectFilter(GetListaDescGetXProveedor(m_lastDocId, m_lastProvId));

                if(ld_id !== Cairo.Constants.NO_ID) {
                  lD = new cListaDescuento();
                  iProp.setValue(lD.GetData(ld_id, C.LD_NAME, Types.text));
                  iProp.setSelectId(ld_id);
                }

                m_dialog.showValue(iProp);

                // Talonario y Categoria fiscal
                pGetIvaFromProveedor(m_lastProvId);

                showFechaVto();

                return _rtn;
              };

              var pGetIvaFromProveedor = function(prov_id) {
                var sqlstmt = null;
                var rs = null;
                var bIvaChanged = null;
                var bLastIva = null;

                sqlstmt = "sp_ProveedorGetIva "+ prov_id.toString();
                if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

                if(rs.isEOF()) { return; }

                bLastIva = m_bIva;
                m_bIva = Cairo.Database.valField(rs.getFields(), "bIva");
                if(bLastIva !== m_bIva) { bIvaChanged = true; }

                bLastIva = m_bIvaRni;
                m_bIvaRni = Cairo.Database.valField(rs.getFields(), "bIvaRni");
                if(bLastIva !== m_bIvaRni) { bIvaChanged = true; }

                if(bIvaChanged) {
                  updateTotals();
                }
              };

              var signDocument = function() {
                var doc = null;
                var us_id = null;

                doc = new cDocumento();

                if(m_id === Cairo.Constants.NO_ID) {
                  Cairo.Modal.showWarning(Cairo.Language.getText(1592, ""));
                  //Antes de poder firmar el documento debe guardarlo.
                  return null;
                }

                if(m_firmado) {
                  if(!cWindow.ask(Cairo.Language.getText(1593, ""), vbYes, Cairo.Language.getText(1594, ""))) {
                    //El documento ya ha sido firmado desea borrar la firma,Firmar
                    return null;
                  }
                }

                if(!doc.Firmar(m_doc_id, us_id)) { return false; }

                var sqlstmt = null;
                var rs = null;

                sqlstmt = "sp_DocFacturaCompraFirmar "+ m_id+ ","+ us_id.toString();
                if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

                m_est_id = Cairo.Database.valField(rs.getFields(), Cairo.Constants.EST_ID);
                m_estado = Cairo.Database.valField(rs.getFields(), Cairo.Constants.EST_NAME);

                var iProp = null;
                iProp = m_dialog.getProperties().item(Cairo.Documents.DialogKeys.status);

                iProp.setSelectId(m_est_id);
                iProp.setValue(m_estado);

                Cairo.Database.getData(C.FACTURA_COMPRA, CC.FC_ID, m_id, CC.FC_FIRMADO, m_firmado);

                m_dialog.showValue(iProp);

                return true;
              };

              var move = function(moveTo) {
                var sqlstmt = null;
                var rs = null;
                var doc_id = null;

                doc_id = getDocId().getSelectId();

                // Debe seleccionar un documento
                if(doc_id === Cairo.Constants.NO_ID) { Cairo.Modal.showInfo(Cairo.Language.getText(1595, "")); }

                sqlstmt = "sp_DocFacturaCompraMover "+ moveTo+ ","+ m_numero+ ","+ doc_id.toString();

                if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

                // Si no obtuve ningun id al moverme
                //
                if(rs.isEOF()) {

                  switch (moveTo) {

                      // Si era siguiente ahora busco el ultimo
                      //
                    case Dialogs.Message.MSG_DOC_NEXT:
                      //  Llamada recursiva
                      move(Dialogs.Message.MSG_DOC_LAST);

                      // Si era anterior ahora busco el primero
                      //
                      break;

                    case Dialogs.Message.MSG_DOC_PREVIOUS:
                      //  Llamada recursiva
                      move(Dialogs.Message.MSG_DOC_FIRST);

                      // Si no encontre ni ultimo ni primero
                      // es por que no hay ningun comprobante para
                      // este documento
                      //
                      break;

                    case Dialogs.Message.MSG_DOC_FIRST:
                    case Dialogs.Message.MSG_DOC_LAST:

                      // Limpio incluso el ultimo proveedor
                      //
                      m_lastProvId = Cairo.Constants.NO_ID;
                      m_lastProvName = "";

                      // Cargo un registro vacio
                      //
                      load(Cairo.Constants.NO_ID);

                      // Obtengo un nuevo numero de comprobante
                      //
                      Cairo.Documents.getDocNumberForProveedor(m_lastProvId, m_lastDocId, m_dialog, m_taPropuesto);

                      // Refresco el formulario
                      //
                      refreshProperties();
                      break;
                  }
                }
                else {
                  if(!load(Cairo.Database.valField(rs.getFields(), 0))) { return false; }

                  refreshProperties();
                }

                return true;
              };

              var refreshProperties = function() {
                var c = null;
                #If PREPROC_SFS Then;
                var abmGen = null;
                #Else;
                var abmGen = null;
                #End If;
                var filter = null;
                var cotizacion = null;

                var properties = m_dialog.getProperties();

                c = properties.item(C.DOC_ID);
                c.setSelectId(m_doc_id);
                c.setValue(m_documento);

                c = properties.item(CC.FC_FECHA);
                c.setValue(m_fecha);

                c = properties.item(CC.FC_FECHA_ENTREGA);
                c.setValue(m_fechaentrega);

                c = properties.item(CC.FC_FECHA_IVA);
                c.setValue(m_fechaIva);

                c = properties.item(C.PROV_ID);
                c.setSelectId(m_prov_id);
                c.setValue(m_proveedor);

                c = properties.item(Cairo.Documents.DialogKeys.number);
                c.setValue(m_numero);

                c = properties.item(Cairo.Documents.DialogKeys.status);
                c.setValue(m_estado);

                c = properties.item(CC.FC_NRODOC);
                c.setValue(m_nrodoc);
                c.setTextMask(m_taMascara);
                c.setTextAlign(vbRightJustify);

                c = properties.item(CC.FC_DESCUENTO1);
                c.setValue(m_descuento1);

                c = properties.item(CC.FC_DESCUENTO2);
                c.setValue(m_descuento2);

                c = properties.item(C.CPG_ID);
                c.setSelectId(m_cpg_id);
                c.setValue(m_condicionPago);

                c = properties.item(CC.FC_FECHA_VTO);
                c.setValue(m_fechaVto);

                c = properties.item(CC.FC_COTIZACION);
                c.setValue(m_cotizacion);

                c = properties.item(C.LP_ID);
                c.setSelectFilter(GetListaPrecioGetXProveedor(m_doc_id, m_prov_id));
                c.setSelectId(m_lp_id);
                c.setValue(m_listaPrecio);

                c = properties.item(C.LD_ID);
                c.setSelectFilter(GetListaDescGetXProveedor(m_doc_id, m_prov_id));
                c.setSelectId(m_ld_id);
                c.setValue(m_listaDescuento);

                c = properties.item(C.CCOS_ID);
                c.setSelectId(m_ccos_id);
                c.setValue(m_centroCosto);

                c = properties.item(C.SUC_ID);
                c.setSelectId(m_suc_id);
                c.setValue(m_sucursal);

                c = properties.item(CC.FC_DESCRIP);
                c.setValue(m_descrip);

                c = properties.item(CC.FC_CAI);
                c.setValue(m_cai);

                c = properties.item(C.LGJ_ID);
                c.setSelectId(m_lgj_id);
                c.setValue(m_legajo);

                c = properties.item(C.PRO_ID_ORIGEN);
                c.setSelectId(m_pro_id_origen);
                c.setValue(m_proOrigen);

                c = properties.item(C.PRO_ID_DESTINO);
                c.setSelectId(m_pro_id_destino);
                c.setValue(m_proDestino);

                c = properties.item(C.DEPL_ID_ORIGEN);
                if(m_depl_id !== Cairo.Constants.NO_ID || !m_showStockData) {
                  c.setSelectId(m_depl_id);
                  c.setValue(m_deposito);
                }
                else {
                  // Preferencias del usuario
                  //
                  c.setSelectId(Cairo.UserConfig.getDeplId());
                  c.setValue(Cairo.UserConfig.getDeplNombre());
                }

                c = properties.item(CC.FC_COTIZACION_PROV);
                c.setValue(m_cotizacionProv);

                c = properties.item(CC.FC_TIPO_COMPROBANTE);
                c.setListItemData(m_tipoComprobante);

                abmGen = m_dialog;
                abmGen.showValues(m_dialog.getProperties());

                abmGen.resetChanged();

                if(m_cotizacion !== 0) {
                  cotizacion = m_cotizacion;
                }
                else {
                  cotizacion = 1;
                }

                c = Cairo.Documents.getItems(m_items, C_ITEMS);
                if(!pLoadItems(c, cotizacion)) { return; }

                m_itemsDeleted = "";

                c = m_items.getProperties().item(C_OTROS);
                if(!pLoadOtros(c, cotizacion)) { return; }

                m_otrosDeleted = "";

                c = m_items.getProperties().item(C_PERCEPCIONES);
                if(!pLoadPercepciones(c, cotizacion)) { return; }

                m_percepcionesDeleted = "";

                c = m_items.getProperties().item(C_LEGAJOS);
                if(!pLoadLegajos(c, cotizacion)) { return; }

                m_legajosDeleted = "";

                abmGen = m_items;
                abmGen.showValues(m_items.getProperties());

                var properties = m_footer.getProperties();

                c = properties.item(CC.FC_SUBTOTAL);
                c.setValue(m_subTotal);

                c = properties.item(CC.FC_IMPORTE_DESC_1);
                c.setValue(m_importeDesc1);

                c = properties.item(CC.FC_IMPORTE_DESC_2);
                c.setValue(m_importeDesc2);

                c = properties.item(CC.FC_NETO);
                c.setValue(m_neto);

                c = properties.item(CC.FC_IVA_RI);
                c.setValue(m_ivari);

                c = properties.item(CC.FC_IVA_RNI);
                c.setValue(m_ivarni);

                // Internos
                c = properties.item(CC.FC_INTERNOS);
                c.setValue(m_internos);

                c = properties.item(CC.FC_TOTAL_OTROS);
                c.setValue(m_totalOtros);

                c = properties.item(CC.FC_TOTAL_PERCEPCIONES);
                c.setValue(m_totalPercepciones);

                c = properties.item(CC.FC_TOTAL);
                c.setValue(m_total);

                abmGen = m_footer;
                abmGen.showValues(m_footer.getProperties());

                setEnabled();

                showCotizacion();
                showFechaVto();

                // DATADD
                mPublic.self.showDataAddProveedor(Cairo.UserConfig.getShowDataAddInCompras(), m_dialog);

              };

              var pGetDocFilter = function() {
                return "'doct_id = "+ csEDocumentoTipo.cSEDT_FACTURA_COMPRA.toString()+ " or  doct_id = "+ csEDocumentoTipo.cSEDT_NOTACREDITOCOMPRA.toString()+ " or  doct_id = "+ csEDocumentoTipo.cSEDT_NOTADEBITOCOMPRA.toString()+ "'";
              };

              var showApplycation = function() {

                if(!DoCairo.Security.anAccess(CS.MODIFY_APLIC, m_doc_id, Cairo.Security.ActionTypes.cSEDOCTPREAPLICAR)) { return; }

                if(m_objApply === null) {
                  m_objApply = new cFacturaCompraAplic();

                  // Edit Apply
                  //
                }
                else {
                  if(m_objApply.self.getId() !== m_id) {
                    m_objApply.self.setObjectClient(null);
                    m_objApply = new cFacturaCompraAplic();
                  }
                }

                // Edit Apply
                //
                m_objApply.self.setObjectClient(self);

                if(!m_objApply.self.show(m_id, m_total * (m_cotizacion !== 0) ? m_cotizacion : 1), m_nrodoc, m_prov_id, m_proveedor, m_suc_id, m_doc_id, m_doct_id === csEDocumentoTipo.cSEDT_NOTACREDITOCOMPRA)) {
                  m_objApply = null;
                }
              };

              var showStartWizardRemito = function() {
                try {

                  var oWizard = null;
                  oWizard = new cFacturaCompraRemitoWiz();

                  if(!oWizard.self.load()) { return; }

                  oWizard.self.setProv_id(m_prov_id);
                  oWizard.self.setProveedor() = m_proveedor;
                  oWizard.self.setRcIds() = m_rcIds;
                  oWizard.self.setDoc_id() = m_lastDocId;
                  oWizard.self.setDocumento() = m_lastDocName;
                  oWizard.self.setObjClient(self);

                  var iObjWizard = null;
                  var oObjWizard = null;

                  iObjWizard = CSKernelClient2.cUtil.createObject("CSABMInterface2.cWizardGeneric");
                  oObjWizard = iObjWizard;
                  oObjWizard.setObjClient(oWizard);

                  iObjWizard.show("CSCompra2.cFacturaCompraRemitoWiz");

                  oObjWizard.getObjAbm().getObjForm().ZOrder;

                }
                catch (ex) {
                  Cairo.manageErrorEx(ex.message, ex, "showStartWizardRemito", C_MODULE, "");
                }
              };

              var showStartWizard = function() {
                try {

                  var oWizard = null;
                  oWizard = new cFacturaCompraWizard();

                  if(!oWizard.self.load()) { return; }

                  oWizard.self.setProv_id(m_prov_id);
                  oWizard.self.setProveedor() = m_proveedor;
                  oWizard.self.setOcIds() = m_ocIds;
                  oWizard.self.setDoc_id() = m_lastDocId;
                  oWizard.self.setDocumento() = m_lastDocName;
                  oWizard.self.setObjClient(self);

                  var iObjWizard = null;
                  var oObjWizard = null;

                  iObjWizard = CSKernelClient2.cUtil.createObject("CSABMInterface2.cWizardGeneric");
                  oObjWizard = iObjWizard;
                  oObjWizard.setObjClient(oWizard);

                  iObjWizard.show("CSCompra2.cFacturaCompraWizard");

                  oObjWizard.getObjAbm().getObjForm().ZOrder;

                }
                catch (ex) {
                  Cairo.manageErrorEx(ex.message, ex, "showStartWizard", C_MODULE, "");
                }
              };
              // Construccion - Destruccion
              self.initialize = function() {
                try {

                  m_nrosSerie = new Collection();
                  m_generalConfig = new cGeneralConfig();
                  m_generalConfig.Load;
                  G.redim(m_ocIds, 0);
                  G.redim(m_rcIds, 0);

                }
                catch (ex) {
                  Cairo.manageErrorEx(ex.message, ex, "Class_Initialize", C_MODULE, "");
                }
              };

              self.destroy = function() {
                try {

                  m_dialog = null;
                  m_listController = null;
                  m_footer = null;
                  m_items = null;
                  m_generalConfig = null;
                  m_host = null;
                  G.redim(m_ocIds, 0);
                  G.redim(m_rcIds, 0);
                  mCollection.collClear(m_nrosSerie);
                  m_nrosSerie = null;
                }
                catch (ex) {
                  Cairo.manageErrorEx(ex.message, ex, "Class_Terminate", C_MODULE, "");
                }
              };

              var pSetShowStockData = function(bInLoadCollection) {
                var docId = null;
                var docIdRto = null;
                var doc = null;

                doc = new cDocumento();

                m_showStockData = false;

                docId = getDocId().getSelectId();

                // Si la factura mueve stock
                //
                if(CBool(doc.GetData(docId, C.DOC_MUEVE_STOCK, Types.boolean))) {
                  m_showStockData = true;

                  // Verifico si genera remito que mueve stock
                  //
                }
                else {
                  // Si genera remito
                  //
                  if(CBool(doc.GetData(docId, C.DOC_GENERA_REMITO, Types.boolean))) {
                    // Obtengo el docid del remito
                    //
                    docIdRto = doc.GetData(docId, C.DOC_ID_REMITO, Types.long);

                    // Si el remito mueve stock
                    //
                    m_showStockData = CBool(doc.GetData(docIdRto, C.DOC_MUEVE_STOCK, Types.boolean));
                  }
                }

                // HIDECOLS
                //
                if(!bInLoadCollection) { showHideCols(true); }

              };

              /////////////////////////////////////////////////////////////////////////////////////////////////////////////
              var pSaveItemNroSerie = function(row,  iOrden,  prId,  fcTMPId,  fciTMPId,  grupo) { // TODO: Use of ByRef founded Private Function pSaveItemNroSerie(ByRef Row As CSInterfacesABM.cIABMGridRow, ByRef iOrden As Long, ByVal PrId As Long, ByVal FcTMPId As Long, ByVal FciTMPId As Long, ByVal Grupo As Long) As Boolean

                var pt = null;
                var register = null;

                // Si lleva numero de serie
                //
                if(Dialogs.cell(row, KI_PR_LLEVA_NRO_SERIE).getId()) {

                  // Obtengo los numeros de serie y guardo un Item por cada uno
                  //
                  var _count = m_nrosSerie.get(mCollection.getKey(grupo)).size();
                  for(var _i = 0; _i < _count; _i++) {
                    pt = m_nrosSerie.get(mCollection.getKey(grupo)).item(_i);

                    if(pt.getDeleted()) {

                      if(!m_copy && pt.getPrns_id()) {

                        register = new cRegister();
                        register.setFieldId(C.FCISB_TMPID);
                        register.setTable(C.FACTURA_COMPRA_ITEMSERIEBTMP);
                        register.setId(Cairo.Constants.NEW_ID);

                        fields.add(CC.FC_TMPID, fcTMPId, Types.id);
                        fields.add(C.PRNS_ID, pt.getPrns_id(), Types.id);

                        register.getFields().setHaveLastUpdate(false);
                        register.getFields().setHaveWhoModify(false);

                        if(!Cairo.Database.save(register, , "pSaveItemNroSerie", C_MODULE, SAVE_ERROR_MESSAGE)) { return false; }
                      }

                    }
                    else {

                      register = new cRegister();
                      register.setFieldId(C.FCIS_TMPID);
                      register.setTable(C.FACTURA_COMPRA_ITEMSERIETMP);
                      register.setId(Cairo.Constants.NEW_ID);

                      fields.add(C.PR_ID, prId, Types.id);

                      if(m_copy) {
                        fields.add(C.PRNS_ID, Cairo.Constants.NEW_ID, Types.integer);
                      }
                      else {
                        fields.add(C.PRNS_ID, pt.getPrns_id(), Types.id);
                      }

                      fields.add(C.PRNS_CODE, pt.getCodigo(), Types.text);
                      fields.add(C.PRNS_DESCRIP, pt.getDescrip(), Types.text);
                      fields.add(C.PRNS_FECHA_VTO, pt.getFechaVto(), Types.date);

                      fields.add(CC.FC_TMPID, fcTMPId, Types.id);
                      fields.add(CC.FCI_TMPID, fciTMPId, Types.id);

                      iOrden = iOrden + 1;
                      fields.add(C.FCIS_ORDEN, iOrden, Types.integer);

                      register.getFields().setHaveLastUpdate(false);
                      register.getFields().setHaveWhoModify(false);

                      if(!Cairo.Database.save(register, , "pSaveItemNroSerie", C_MODULE, SAVE_ERROR_MESSAGE)) { return false; }
                    }
                  }
                }

                return true;
              };

              var getPrId = function(prId) {
                var _rtn = 0;
                if(!getIsInput()) {
                  _rtn = prId;
                }

                return _rtn;
              };

              var getIsInput = function() {
                return m_lastDocIdtId !== csEDocumentoTipo.cSEDT_NOTACREDITOCOMPRA;
              };

              //////////////////////////////////////////////////////////////////////////////////////////////////
              // nrs devolucion
              var getDeplId = function() {
                var _rtn = 0;
                if(m_lastDocIdtId !== csEDocumentoTipo.cSEDT_NOTACREDITOCOMPRA) {
                  _rtn = csE_DepositosInternos.cSEDEPLIDTERCERO;
                }
                else {
                  _rtn = m_dialog.getProperties().item(C.DEPL_ID_ORIGEN).getSelectId();
                }

                return _rtn;
              };

              var getProvId = function() {
                return m_dialog.getProperties().item(C.PROV_ID).getSelectId();
              };

              var getFecha = function() {
                return m_dialog.getProperties().item(CC.FC_FECHA).getValue();
              };

              var showOrdenPago = function() {
                try {

                  var o = null;

                  o = CSKernelClient2.cUtil.createObject("CSTesoreria2.cOrdenPago");

                  o.ShowOrdenPago(getProvId(), getFcIds());

                }
                catch (ex) {
                  Cairo.manageErrorEx(ex.message, ex, "pShowCobranza", C_MODULE, "");
                }
              };

              var getFcIds = function() {
                return [m_id];
              };

              var processMultiRow = function(info) {
                var _rtn = null;

                info.bAddRows = false;

                switch (info.Key) {
                  case K_ITEMS:
                    var w_getItems = getItems();

                    var row = null;
                    row = w_getItems.getGrid().getRows(info.lRow);

                    if(row.item(info.lCol).getKey() === KI_PR_ID) {

                      var oCell = null;

                      oCell = Dialogs.cell(row, KI_PR_ID);

                      if(LenB(oCell.getSelectIntValue())) {
                        if(oCell.getSelectIntValue().indexOf(",", 1)) {
                          AddMultiRowsCompras(oCell.getSelectIntValue(), info, KI_CANTIDAD);
                          _rtn = true;
                        }
                      }
                    }
                    break;
                }


                return _rtn;
              };

              var getItems = function() {
                return m_items.getProperties().item(C_ITEMS);
              };

              // HIDECOLS
              //
              var showHideCols = function(bOnlyStock) {
                var columns = null;
                var bVisible = null;
                var abmObj = null;
                abmObj = m_dialog;

                if(abmObj.getInSave()) { return; }

                bVisible = Cairo.Util.val(m_dialog.getProperties().item(c_HideCols).getValue()) === 0;

                var iProp = null;
                iProp = getItems();

                abmObj.drawGrid(iProp, false);

                var i = null;

                columns = iProp.getGrid().getColumns();
                for(i = 1; i <= columns.count(); i++) {
                  switch (columns.item(i).getKey()) {

                    case KI_DESCUENTO:
                    case KI_UNIDAD:
                    case KI_PRECIO_LP:
                    case KI_IVA_RNI:
                    case KI_TO_ID:

                      // Solo si la llamada fue para todas las columnas
                      // y no unicamente para las columnas de stock
                      //
                      if(!bOnlyStock) {
                        columns.item(i).setVisible(bVisible);
                        abmObj.refreshColumnPropertiesByIndex(iProp, i);
                      }

                      break;

                    case KI_NRO_SERIE:
                    case KI_STL_CODIGO:

                      // Si mueve stock se ven siempre
                      //
                      columns.item(i).setVisible(m_showStockData);
                      abmObj.refreshColumnPropertiesByIndex(iProp, i);

                      break;
                  }
                }

                abmObj.drawGrid(iProp, true);
              };

              var getFileNamePostFix = function() {
                var rtn = null;

                rtn = m_dialog.getProperties().item(C.PROV_ID).getValue().Substring(0, 50)+ "-"+ m_dialog.getProperties().item(CC.FC_NRODOC).getValue();

                return rtn;
              };

              var setColorBackground = function() {
                var doct_id = null;
                var doc_id = null;
                var abmGen = null;

                abmGen = m_dialog;

                doc_id = getDocId().getSelectId();
                if(!Cairo.Database.getData(C.DOCUMENTO, C.DOC_ID, doc_id, C.DOCT_ID, doct_id)) { return; }

                //c1c1f6
                if(Cairo.UserConfig.getUsarColoresEnDocumentos()) {
                  if(doct_id === csEDocumentoTipo.cSEDT_NOTACREDITOCOMPRA) {
                    abmGen.setBakcColorTagMain(RGB(&HF0, &H7F, &H7F));
                  }
                  else {
                    abmGen.setBakcColorTagMain(vbWhite);
                  }
                }

              };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("FacturaCpraListDoc.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      // cFacturaCpraListDoc
      // 03-01-04

      var C_MODULE = "FacturaCpraListDoc";

      var C_FECHAINI = "FechaIni";
      var C_FECHAFIN = "FechaFin";

      var C_IMG_TASK = 1;

      // ACA VAN LAS K GENERADAS POR EL ASISTENTE.
      var K_FECHAINI = 1;
      var K_FECHAFIN = 2;
      var K_PROV_ID = 4;
      var K_EST_ID = 5;
      var K_CCOS_ID = 6;
      var K_SUC_ID = 7;
      var K_DOC_ID = 9;
      var K_CPG_ID = 10;
      // empid
      var K_EMP_ID = 100;
      var m_fechaIni = null;
      var m_fechaFin = null;
      var m_prov_id = "";
      var m_proveedor = "";
      var m_est_id = "";
      var m_estado = "";
      var m_ccos_id = "";
      var m_centroCosto = "";
      var m_suc_id = "";
      var m_sucursal = "";
      var m_doc_id = "";
      var m_documento = "";
      var m_cpg_id = "";
      var m_condicionPago = "";
      // empid
      var m_emp_id = "";
      var m_empresa = "";
      var m_fechaIniV = "";
      var m_fechaFinV = "";

      // ACA VAN LAS m_ GENERADAS POR EL ASISTENTE.

      //OJO HASTA ACA

      var m_dialog;
      var m_objList = null;
      var m_us_id = 0;
      var m_properties;

      var m_title = "";

      var m_menuLoaded;

      var m_menuShowOrdenPago = 0;

      var m_menuShowMensajes = 0;
      var m_menuShowInfoProv = 0;
      var m_menuAddMensaje = 0;
      var m_menuShowAplic = 0;
      var m_menuShowAsiento = 0;
      var m_menuShowDocAux = 0;
      var m_menuFirmar = 0;

      var m_objApply;

      // Properties publicas
      // Properties privadas
      self.processMenu = function(index) {
        try {

          switch (index) {

            case m_menuShowOrdenPago:
              showOrdenPago();

              break;

            case m_menuShowInfoProv:
              HelpShowInfo(Cairo.Tables.PROVEEDOR, getProvId());

              break;

            case m_menuShowMensajes:
              pShowMensajes();

              break;

            case m_menuAddMensaje:
              pAddMensaje();

              break;

            case m_menuShowAplic:
              showApplycation();

              break;

            case m_menuShowAsiento:
              pShowAsiento();

              break;

            case m_menuShowDocAux:
              pShowDocAux();

              break;

            case m_menuFirmar:
              signDocument();
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "ProcessMenu", C_MODULE, "");
        }
      };

      var loadCollection = function() {
        var c = null;
        var o = null;
        var value = null;
        var bExists = null;

        var properties = m_dialog.getProperties();
        properties.clear();

        c = properties.add(null, C_FECHAINI);
        c.setType(Dialogs.PropertyType.date);
        // Fecha desde
        c.setName(Cairo.Language.getText(1203, ""));
        c.setKey(K_FECHAINI);
        if(LenB(m_fechaIniV)) {
          c.setValue(m_fechaIniV);
        }
        else {
          c.setValue(m_fechaIni);
        }

        c = properties.add(null, C_FECHAFIN);
        c.setType(Dialogs.PropertyType.date);
        // Fecha hasta
        c.setName(Cairo.Language.getText(1204, ""));
        c.setKey(K_FECHAFIN);
        if(LenB(m_fechaFinV)) {
          c.setValue(m_fechaFinV);
        }
        else {
          c.setValue(m_fechaFin);
        }

        c = properties.add(null, C.PROV_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(Cairo.Tables.PROVEEDOR);
        // Proveedor
        c.setName(Cairo.Language.getText(1151, ""));
        c.setKey(K_PROV_ID);
        value = m_proveedor;
        if(m_prov_id.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.PROVEEDOR, Cairo.Util.val(m_prov_id.Substring(2)), bExists);
          if(!bExists) { m_prov_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_prov_id));
        c.setHelpValueProcess(m_prov_id);

        c = properties.add(null, Cairo.Constants.EST_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(csEstado);
        // Estado
        c.setName(Cairo.Language.getText(1568, ""));
        c.setKey(K_EST_ID);
        value = m_estado;
        if(m_est_id.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csEstado, Cairo.Util.val(m_est_id.Substring(2)), bExists);
          if(!bExists) { m_est_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_est_id));
        c.setHelpValueProcess(m_est_id);

        c = properties.add(null, C.CCOS_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(Cairo.Tables.CENTROCOSTO);
        // Centro de Costos
        c.setName(Cairo.Language.getText(1057, ""));
        c.setKey(K_CCOS_ID);
        value = m_centroCosto;
        if(m_ccos_id.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.CENTROCOSTO, Cairo.Util.val(m_ccos_id.Substring(2)), bExists);
          if(!bExists) { m_ccos_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_ccos_id));
        c.setHelpValueProcess(m_ccos_id);

        c = properties.add(null, C.SUC_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(Cairo.Tables.SUCURSAL);
        // Sucursal
        c.setName(Cairo.Language.getText(1281, ""));
        c.setKey(K_SUC_ID);
        value = m_sucursal;
        if(m_suc_id.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.SUCURSAL, Cairo.Util.val(m_suc_id.Substring(2)), bExists);
          if(!bExists) { m_suc_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_suc_id));
        c.setHelpValueProcess(m_suc_id);

        c = properties.add(null, C.DOC_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(csETablasDocumento.CSDocumento);
        // Documentos
        c.setName(Cairo.Language.getText(1567, ""));
        c.setKey(K_DOC_ID);
        value = m_documento;
        if(m_doc_id.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csETablasDocumento.CSDocumento, Cairo.Util.val(m_doc_id.Substring(2)), bExists);
          if(!bExists) { m_doc_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_doc_id));
        c.setHelpValueProcess(m_doc_id);
        c.setSelectFilter(pGetDocFilter());

        c = properties.add(null, C.CPG_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(Cairo.Tables.CONDICIONPAGO);
        // Condicion de pago
        c.setName(Cairo.Language.getText(1395, ""));
        c.setKey(K_CPG_ID);
        value = m_condicionPago;
        if(m_cpg_id.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.CONDICIONPAGO, Cairo.Util.val(m_cpg_id.Substring(2)), bExists);
          if(!bExists) { m_cpg_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_cpg_id));
        c.setHelpValueProcess(m_cpg_id);

        // empid
        c = properties.add(null, Cairo.Constants.EMP_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setTable(Cairo.Tables.EMPRESA);
        // Empresa
        c.setName(Cairo.Language.getText(1114, ""));
        c.setKey(K_EMP_ID);
        value = m_empresa;
        if(m_emp_id.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.EMPRESA, Cairo.Util.val(m_emp_id.Substring(2)), bExists);
          if(!bExists) { m_emp_id = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_emp_id));
        c.setHelpValueProcess(m_emp_id);

        pCreateMenu();
        if(!m_dialog.show(self, m_objList)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        return m_dialog.showValues(properties);
      };

      var load = function(us_id) {

        return Cairo.Database.getData("load[" + m_apiPath + "general/facturacpralistdoc]", id).then(
          function(response) {

            // empid
            m_emp_id = cUtil.getEmpId();
            m_empresa = cUtil.getEmpNombre();

            if(response.success !== true) { return false; }

            if(response.data.id === Cairo.Constants.NO_ID) {

              m_fechaIni = Date;
              m_fechaFin = Date;
              m_prov_id = Cairo.Constants.NO_ID;
              m_proveedor = "";
              m_est_id = Cairo.Constants.NO_ID;
              m_estado = "";
              m_ccos_id = Cairo.Constants.NO_ID;
              m_centroCosto = "";
              m_suc_id = Cairo.Constants.NO_ID;
              m_sucursal = "";
              m_doc_id = Cairo.Constants.NO_ID;
              m_documento = "";
              m_cpg_id = Cairo.Constants.NO_ID;
              m_condicionPago = "";

            }
            else {

              rs.MoveLast;
              rs.MoveFirst;

              var i = null;
              while (!rs.isEOF()) {

                switch (Cairo.Database.valField(response.data, Cairo.Constants.LDP_ID)) {

                  case K_FECHAINI:
                    m_fechaIniV = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);
                    m_fechaIni = IsDate(Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR)) ? Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR) : Date);

                    break;

                  case K_FECHAFIN:
                    m_fechaFinV = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);
                    m_fechaFin = IsDate(Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR)) ? Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR) : Date);

                    break;

                  case K_PROV_ID:
                    m_prov_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

                    break;

                  case K_EST_ID:
                    m_est_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

                    break;

                  case K_CCOS_ID:
                    m_ccos_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

                    break;

                  case K_SUC_ID:
                    m_suc_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

                    break;

                  case K_DOC_ID:
                    m_doc_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

                    break;

                  case K_CPG_ID:
                    m_cpg_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

                    // empid
                    break;

                  case K_EMP_ID:
                    m_emp_id = Cairo.Database.valField(response.data, Cairo.Constants.LDP_VALOR);

                    break;
                }

                rs.MoveNext;
              }

              var data = null;
              var strLoad = null;

              strLoad = Cairo.Language.getText(2179, "");
              //Error al cargar los párametros de navegación de Facturas de Compra

              m_fechaIni = (m_fechaIni !== Cairo.Constants.cSNODATE) ? m_fechaIni : Date);
              m_fechaFin = (m_fechaFin !== Cairo.Constants.cSNODATE) ? m_fechaFin : Date);

              if(m_prov_id.Substring(0, 1).toUpperCase() !== KEY_NODO) {
                if(!Cairo.Database.getData(C.PROVEEDOR, C.PROV_ID, Cairo.Util.val(m_prov_id), C.PROV_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_proveedor = data;
              }
              if(m_est_id.Substring(0, 1).toUpperCase() !== KEY_NODO) {
                if(!Cairo.Database.getData(Cairo.Constants.ESTADO, Cairo.Constants.EST_ID, Cairo.Util.val(m_est_id), Cairo.Constants.EST_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_estado = data;
              }
              if(m_ccos_id.Substring(0, 1).toUpperCase() !== KEY_NODO) {
                if(!Cairo.Database.getData(C.CENTROCOSTO, C.CCOS_ID, Cairo.Util.val(m_ccos_id), C.CCOS_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_centroCosto = data;
              }
              if(m_suc_id.Substring(0, 1).toUpperCase() !== KEY_NODO) {
                if(!Cairo.Database.getData(C.SUCURSAL, C.SUC_ID, Cairo.Util.val(m_suc_id), C.SUC_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_sucursal = data;
              }
              if(m_doc_id.Substring(0, 1).toUpperCase() !== KEY_NODO) {
                if(!Cairo.Database.getData(C.DOCUMENTO, C.DOC_ID, Cairo.Util.val(m_doc_id), C.DOC_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_documento = data;
              }
              if(m_cpg_id.Substring(0, 1).toUpperCase() !== KEY_NODO) {
                if(!Cairo.Database.getData(C.CONDICIONPAGO, C.CPG_ID, Cairo.Util.val(m_cpg_id), C.CPG_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_condicionPago = data;
              }
              // empid
              if(m_emp_id.Substring(0, 1).toUpperCase() !== KEY_NODO) {
                if(!Cairo.Database.getData(Cairo.Constants.EMPRESA, Cairo.Constants.EMP_ID, Cairo.Util.val(m_emp_id), Cairo.Constants.EMP_NAME, data, C_LoadFunction, C_MODULE, strLoad)) { return false; }
                m_empresa = data;
              }

            }

          return true;
        });
      };

      var getCIABMListDocClient_Aplication = function() {
        return Cairo.appName;
      };

      var cIABMListDocClient_DiscardChanges = function() {
        loadCollection();
      };

      var cIABMListDocClient_ListAdHock = function(list) {

      };

      var cIABMListDocClient_Load = function() {

      };

      var getCIABMListDocClient_Properties = function() {
        return m_properties;
      };

      // OJO: NUEVAMENTE LA EXISTENCIA DE FECHAS VIRTUALES HACE QUE EL CODIGO GENERADO POR EL ASISTENTE ESTE MAL
      //      CORRIJALO UTILIZANDO ESTE CODIGO COMO EJEMPLO.
      var cIABMListDocClient_PropertyChange = function(key) {
        var iProp = null;

        var properties = m_dialog.getProperties();

        switch (key) {

          case K_FECHAINI:

            iProp = properties.item(C_FECHAINI);

            if(iProp.getSelectIntValue() !== "") {
              m_fechaIniV = iProp.getSelectIntValue();
              m_fechaIni = cDate.vDGetDateByName(m_fechaIniV);
            }
            else if(IsDate(iProp.getValue())) {
              m_fechaIniV = "";
              m_fechaIni = iProp.getValue();
            }
            else {
              m_fechaIniV = "";
              iProp.setValue(m_fechaIni);
            }

            break;

          case K_FECHAFIN:

            iProp = properties.item(C_FECHAFIN);

            if(iProp.getSelectIntValue() !== "") {
              m_fechaFinV = iProp.getSelectIntValue();
              m_fechaFin = cDate.vDGetDateByName(m_fechaFinV);
            }
            else if(IsDate(iProp.getValue())) {
              m_fechaFinV = "";
              m_fechaFin = iProp.getValue();
            }
            else {
              m_fechaFinV = "";
              iProp.setValue(m_fechaFin);
            }

            break;

          case K_EST_ID:
            var property = properties.item(Cairo.Constants.EST_ID);
            m_estado = property.getValue();
            m_est_id = property.getSelectIntValue();

            break;

          case K_PROV_ID:
            var property = properties.item(C.PROV_ID);
            m_proveedor = property.getValue();
            m_prov_id = property.getSelectIntValue();

            break;

          case K_CCOS_ID:
            var property = properties.item(C.CCOS_ID);
            m_centroCosto = property.getValue();
            m_ccos_id = property.getSelectIntValue();

            break;

          case K_SUC_ID:
            var property = properties.item(C.SUC_ID);
            m_sucursal = property.getValue();
            m_suc_id = property.getSelectIntValue();

            break;

          case K_DOC_ID:
            var property = properties.item(C.DOC_ID);
            m_documento = property.getValue();
            m_doc_id = property.getSelectIntValue();

            break;

          case K_CPG_ID:
            var property = properties.item(C.CPG_ID);
            m_condicionPago = property.getValue();
            m_cpg_id = property.getSelectIntValue();

            // empid
            break;

          case K_EMP_ID:
            var property = properties.item(Cairo.Constants.EMP_ID);
            m_empresa = property.getValue();
            m_emp_id = property.getSelectIntValue();
            break;
        }

        return true;
      };

      var cIABMListDocClient_Refresh = function() {
        var sqlstmt = null;

        sqlstmt = "sp_lsdoc_FacturasCompra ";

        sqlstmt = sqlstmt+ Cairo.Database.getUserId().toString()+ ",";

        if(!cDate.getDateNames(m_fechaIniV) === null) {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(cDate.vDGetDateByName(m_fechaIniV))+ ",";
        }
        else {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(m_fechaIni)+ ",";
        }

        if(!cDate.getDateNames(m_fechaFinV) === null) {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(cDate.vDGetDateByName(m_fechaFinV))+ ",";
        }
        else {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(m_fechaFin)+ ",";
        }

        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_prov_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_est_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_ccos_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_suc_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_doc_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_cpg_id)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_emp_id);

        return sqlstmt;
      };

      var cIABMListDocClient_Save = function() {

        var strError = null;

        strError = Cairo.Language.getText(2179, "");
        //Error al grabar los párametros de navegación de Facturas de Compra

        var register = null;
        register = new cRegister();

        var sqlstmt = null;

        sqlstmt = "delete ListaDocumentoParametro  where pre_id = "+ LIST_Factura+ " and us_id = "+ m_us_id+ " and (emp_id is null or emp_id = "+ cUtil.getEmpId().toString()+ ")";

        if(!Cairo.Database.execute(sqlstmt, "cIABMClient_Save", C_MODULE, strError)) { return false; }

        register.setTable(Cairo.Constants.LISTADOCUMENTOPARAMETRO);
        register.setUtilizaIdentity(true);

        var property = null;
        var _count = m_dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);

          register.getFields().clear();

          switch (property.getKey()) {

            case K_FECHAINI:
              if(property.getSelectIntValue() !== "") {
                fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              }
              else {
                fields.add(Cairo.Constants.LDP_VALOR, property.getValue(), Types.text);
              }

              fields.add(Cairo.Constants.LDP_ORDEN, 10, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_FECHAINI, Types.integer);
              break;

            case K_FECHAFIN:

              if(property.getSelectIntValue() !== "") {
                fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              }
              else {
                fields.add(Cairo.Constants.LDP_VALOR, property.getValue(), Types.text);
              }

              fields.add(Cairo.Constants.LDP_ORDEN, 20, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_FECHAFIN, Types.integer);

              break;

            case K_PROV_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 40, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_PROV_ID, Types.integer);
              break;

            case K_EST_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 50, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_EST_ID, Types.integer);
              break;

            case K_CCOS_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 60, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_CCOS_ID, Types.integer);
              break;

            case K_SUC_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 70, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_SUC_ID, Types.integer);
              break;

            case K_DOC_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 90, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_DOC_ID, Types.integer);
              break;

            case K_CPG_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 100, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_CPG_ID, Types.integer);

              // empid
              break;

            case K_EMP_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 100, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_EMP_ID, Types.integer);

              break;
          }

          // empid
          fields.add(Cairo.Constants.EMP_ID, cUtil.getEmpId(), Types.id);

          fields.add(Cairo.Constants.US_ID, m_us_id, Types.id);
          fields.add(Cairo.Constants.PRE_ID, LIST_Factura, Types.id);

          register.getFields().setHaveLastUpdate(false);
          register.getFields().setHaveWhoModify(false);
          if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, strError)) { return false; }
        }

        if(!load(m_us_id)) { return false; }

        return true;
      };

      var cIABMListDocClient_Terminate = function() {
        return true;
      };

      var getCIABMListDocClient_Title = function() {
        return m_title;
      };

      var cIABMListDocClient_Validate = function() {
        return true;
      };

      var cIEditGenericListDoc_GridAdd = function(keyProperty) {

      };

      var cIEditGenericListDoc_GridEdit = function(keyProperty) {

      };

      var cIEditGenericListDoc_GridRemove = function(keyProperty) {

      };

      var setCIEditGenericListDoc_ObjAbm = function(rhs) {
        m_dialog = rhs;
      };

      var setCIEditGenericListDoc_ObjList = function(rhs) {
        m_objList = rhs;
      };

      var cIEditGenericListDoc_PropertyChange = function(key) {
      };

      var cIEditGenericListDoc_ShowParams = function(us_id) {
        var _rtn = null;
        try {

          if(us_id === Cairo.Constants.NO_ID) { return _rtn; }

          m_us_id = us_id;

          if(!load(us_id)) { return _rtn; }

          if(!loadCollection()) { return _rtn; }

          _rtn = true;
          return _rtn;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "cIEditGenericListDoc_ShowParams", C_MODULE, "");
      }

        return _rtn;
      };

      var cIEditGenericListDoc_TabClick = function(index) {

      };

      var pGetDocFilter = function() {
        return "'{emp_id=0}doct_id = "+ csEDocumentoTipo.cSEDT_FACTURA_COMPRA.toString()+ " or doct_id = "+ csEDocumentoTipo.cSEDT_NOTACREDITOCOMPRA.toString()+ " or doct_id = "+ csEDocumentoTipo.cSEDT_NOTADEBITOCOMPRA.toString()+ "'";
      };

      var pCreateMenu = function() {
        // **TODO:** on error resume next found !!!

        if(m_menuLoaded) { return; }

        m_menuLoaded = true;

        m_objList.ObjClientMenu = self;
        m_objList.ClearMenu;
        // Orden de Pago
        m_menuShowOrdenPago = m_objList.AddMenu(Cairo.Language.getText(1922, ""));
        m_objList.AddMenu("-");
        // Firmar
        m_menuFirmar = m_objList.AddMenu(Cairo.Language.getText(1594, ""));
        m_objList.AddMenu("-");
        // Ver Info del Proveedor
        m_menuShowInfoProv = m_objList.AddMenu(Cairo.Language.getText(1887, ""));
        // Agregar Nota
        m_menuAddMensaje = m_objList.AddMenu(Cairo.Language.getText(1615, ""));
        // Ver Notas
        m_menuShowMensajes = m_objList.AddMenu(Cairo.Language.getText(1616, ""));
        m_objList.AddMenu("-");
        // Ver Aplicaciones
        m_menuShowAplic = m_objList.AddMenu(Cairo.Language.getText(1617, ""));
        // Ver Asiento Contable
        m_menuShowAsiento = m_objList.AddMenu(Cairo.Language.getText(1692, ""));
        // Ver Documento Asociado
        m_menuShowDocAux = m_objList.AddMenu(Cairo.Language.getText(1691, ""));
      };

      var pShowMensajes = function() {
        var sqlstmt = null;
        var fcId = null;
        var rs = null;

        fcId = m_objList.Id;

        sqlstmt = "sp_ParteDiarioGetTitleForDoc "+ csEDocumentoTipo.cSEDT_FACTURA_COMPRA.toString()+ ","+ fcId.toString();

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(rs.isEOF()) { return; }

        var infodoc = null;
        var doctId = null;

        doctId = Cairo.Database.valField(rs.getFields(), C.DOCT_ID);
        infodoc = Cairo.Database.valField(rs.getFields(), "info_doc");

        sqlstmt = "sp_PartesDiarioGetForDoc "+ Cairo.Database.getUserId().toString()+ ","+ cUtil.getEmpId().toString()+ ","+ doctId.toString()+ ","+ fcId.toString();
        ShowNotes(Cairo.Language.getText(1923, "", infodoc), sqlstmt);
        //Notas sobre Factura  & infodoc, sqlstmt
      };

      var pAddMensaje = function() {
        var parte = null;
        parte = CSKernelClient2.cUtil.createObject("CSEnvio2.cParteDiario");

        parte.AddParteToDoc(csEDocumentoTipo.cSEDT_FACTURA_COMPRA, m_objList.Id, false);
      };

      var signDocument = function() {

        var fcId = null;
        fcId = m_objList.Id;

        if(fcId === Cairo.Constants.NO_ID) { return; }

        var firmado = null;
        var docId = null;

        if(!Cairo.Database.getData(C.FACTURA_COMPRA, CC.FC_ID, fcId, CC.FC_FIRMADO, firmado)) { return; }
        if(!Cairo.Database.getData(C.FACTURA_COMPRA, CC.FC_ID, fcId, C.DOC_ID, docId)) { return; }

        if(firmado) {
          if(!cWindow.ask(Cairo.Language.getText(1593, ""), vbYes, Cairo.Language.getText(1594, ""))) {
            //El documento ya ha sido firmado desea borrar la firma, Firmar
            return;
          }
        }

        var doc = null;
        var us_id = null;

        doc = new cDocumento();

        if(!doc.Firmar(docId, us_id)) { return; }

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_DocFacturaCompraFirmar "+ fcId.toString()+ ","+ us_id.toString();
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        m_objList.sqlstmt = "sp_lsdoc_FacturaCompra";

        m_objList.RefreshLine(fcId);

      };

      var pShowAsiento = function() {

        var fcId = null;
        fcId = m_objList.Id;

        if(fcId) {

          var asId = null;
          if(!Cairo.Database.getData(C.FACTURA_COMPRA, CC.FC_ID, fcId, C.AS_ID, asId)) { return; }

          ShowDocAux(asId, "CSContabilidad2.cAsiento", "CSABMInterface2.cABMGeneric");
        }

      };

      var pShowDocAux = function() {

        var fcId = null;
        fcId = m_objList.Id;

        if(fcId) {

          var stId = null;
          if(!Cairo.Database.getData(C.FACTURA_COMPRA, CC.FC_ID, fcId, C.ST_ID, stId)) { return; }

          if(stId === Cairo.Constants.NO_ID) {

            Cairo.Modal.showInfo(Cairo.Language.getText(1693, ""));
            //Este comprobante no tiene un documento de stock asociado.
          }
          else {

            ShowDocAux(stId, "CSStock2.cStock", "CSABMInterface2.cABMGeneric");
          }
        }

      };

      var showApplycation = function() {

        var fcId = null;
        fcId = m_objList.Id;

        if(fcId === Cairo.Constants.NO_ID) { return; }

        var total = null;
        var cotiz = null;
        var nroDoc = null;
        var provId = null;
        var proveedor = null;
        var sucId = null;
        var docId = null;
        var doctId = null;

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "select fc_total, fc_cotizacion, fc_nrodoc, fc.prov_id, prov_nombre, fc.suc_id, fc.doc_id, fc.doct_id from FacturaCompra fc inner join Proveedor prov  on fc.prov_id = prov.prov_id where fc_id = "+ fcId.toString();

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(rs.isEOF()) { return; }

        total = Cairo.Database.valField(rs.getFields(), CC.FC_TOTAL);
        cotiz = Cairo.Database.valField(rs.getFields(), CC.FC_COTIZACION);
        nroDoc = Cairo.Database.valField(rs.getFields(), CC.FC_NRODOC);
        provId = Cairo.Database.valField(rs.getFields(), C.PROV_ID);
        proveedor = Cairo.Database.valField(rs.getFields(), C.PROV_NAME);
        sucId = Cairo.Database.valField(rs.getFields(), C.SUC_ID);
        docId = Cairo.Database.valField(rs.getFields(), C.DOC_ID);
        doctId = Cairo.Database.valField(rs.getFields(), C.DOCT_ID);

        if(!DoCairo.Security.anAccess(MODIFY_APLIC, m_doc_id, Cairo.Security.ActionTypes.cSEDOCTPREAPLICAR)) { return; }

        if(m_objApply === null) {
          m_objApply = new cFacturaCompraAplic();

          // Edit Apply
          //
        }
        else {
          if(m_objApply.self.getId() !== fcId) {
            m_objApply = new cFacturaCompraAplic();
          }
        }

        if(!m_objApply.self.show(fcId, total * (cotiz !== 0) ? cotiz : 1), nroDoc, provId, proveedor, sucId, docId, doctId === csEDocumentoTipo.cSEDT_NOTADEBITOCOMPRA)) {
          m_objApply = null;
        }

      };

      var showOrdenPago = function() {
        try {

          var o = null;

          o = CSKernelClient2.cUtil.createObject("CSTesoreria2.cOrdenPago");

          o.ShowOrdenPago(getProvId(), getFcIds());

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "pShowCobranza", C_MODULE, "");
        }
      };

      var getProvId = function() {

        var fcId = null;
        var provId = null;

        fcId = m_objList.Id;
        Cairo.Database.getData(C.FACTURA_COMPRA, CC.FC_ID, fcId, C.PROV_ID, provId);

        return provId;
      };

      var getFcIds = function() {
        return m_objList.SelectedItems;
      };

      self.initialize = function() {
        try {

          m_title = Cairo.Language.getText(1892, ""); // Facturas de Compras
          m_properties = new cABMDocProperties();
          m_properties.setHaveDetail(true);
          m_properties.setStartRowText(4);

          var elem = m_properties.add(null, "TypeTask");
          elem.setName("TypeTask");
          elem.setCaption(" ");
          var elem = elem.add(null);
          elem.FormulaType = csConditionType.cSCONDTNONE;
          elem.IconIndex = C_IMG_TASK;
          elem.setWidth(500);
          elem.setSortType(csSortType.cSSRTTICON);

          var elem = m_properties.add(null, "Descripción");
          elem.setName("Descripción");
          elem.setFontName("Tahoma");
          elem.setFontSize(8);
          elem.setForeColor(vbBlue);

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "initialize", C_MODULE, "");
        }
      };

      self.destroy = function() {
        try {

          m_dialog = null;
          m_objList = null;
          m_properties = null;

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");
        }
      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("FacturaCompra.List", function(List, Cairo, Backbone, Marionette, $, _) {

    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.facturacompraEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.facturacompraEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "FacturaCompras",
            entityName: "facturacompra",
            entitiesName: "facturacompras"
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
              var editor = Cairo.FacturaCompra.Edit.Controller.getEditor();
              var dialog = Cairo.Dialogs.Views.Controller.newDialog();

              editor.setListController(self);
              editor.setDialog(dialog);
              editor.edit(id);

              editors.add({editor: editor, dialog: dialog}, key);
            }
          };

          self.destroy = function(id, treeId, branchId) {
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_FACTURA_COMPRA)) {
              return Cairo.Promises.resolvedPromise(false);
            }

            var closeDialog = function() {
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
            };

            return Cairo.Database.destroy(
                m_apiPath + "general/facturacompra", id,
                Cairo.Constants.DELETE_FUNCTION, C_MODULE).success(closeDialog, false);
          };

          // progress message
          //
          Cairo.LoadingMessage.show("FacturaCompras", "Loading facturacompra from Crowsoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ facturacompraTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.FACTURA_COMPRA,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.facturacompraTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("FacturaCompras", "facturacompraTreeRegion", "#general/facturacompras", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());


