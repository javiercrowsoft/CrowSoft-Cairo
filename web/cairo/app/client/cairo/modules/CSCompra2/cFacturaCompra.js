(function() {
  "use strict";

  Cairo.module("FacturaCompra.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;
      
      var TITLE = getText(1892, ""); // Facturas de Compra
      var SAVE_ERROR_MESSAGE = getText(1907, ""); // Error al grabar la factura de compra      

      var P = Cairo.Promises;
      var NO_ID = Cairo.Constants.NO_ID;
      var DB = Cairo.Database;
      var Dialogs = Cairo.Dialogs;
      var Grids = Cairo.Dialogs.Grids;
      var C = Cairo.General.Constants;
      var CC = Cairo.Compras.Constants;
      var CS = Cairo.Security.Actions.Compras;
      var Types = Cairo.Constants.Types;
      var valField = DB.valField;
      var getValue = DB.getValue;
      var Percepciones = Cairo.Compras.Percepciones;
      var call = P.call;
      var D = Cairo.Documents; 
      var getProperty = D.getProperty;
      var getGrid = D.getGrid;
      var getCell = Dialogs.cell;
      var cellVal = Dialogs.cellVal;
      var cellId = Dialogs.cellId;
      var cellFloat = Dialogs.cellFloat;
      var val = Cairo.Util.val;
      var M = Cairo.Modal;
      var T = Dialogs.PropertyType;

      var C_MODULE = "cFacturaCompra";

      var C_ITEMS = "ITEMS";
      var C_OTROS = "OTROS";
      var C_PERCEPCIONES = "PERCEPCIONES";
      var C_LEGAJOS = "LEGAJOS";

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
      var m_firmado;

      var m_lastFecha = null;

      var m_as_id = 0;
      var m_st_id = 0;

      var m_editing;

      var m_footer;
      var m_footerProps;
      var m_items;
      var m_itemsProps;
      var m_dialog;
      var m_properties;
      var m_listController = null;

      var m_lastDocId = 0;
      var m_lastMonId = 0;
      var m_lastDocTipoFactura = 0;
      var m_lastDoctId = 0;
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

      var m_docEditable;
      var m_docEditMsg = "";

      var m_taPropuesto;
      var m_taMascara = "";

      var m_applyEditor;

      var m_ocIds = 0;
      var m_rcIds = 0;

      var m_serialNumbers;

      var m_defaultCurrency = D.getDefaultCurrency();

      var m_apiPath = DB.getAPIVersion();

      var emptyData = {
        items: [],
        otros: [],
        percepciones: [],
        legajos: [],
        serialNumbers: []
      };

      var m_data = emptyData;

      self.getEditorType = function() {
        return "document"
      };

      self.refresh = function() {
        load(m_id);
        refreshProperties();
      };

      self.terminateWizard = function(id) {
        if(id !== NO_ID) {
          self.edit(id);
        }
      };

      self.showFacturaRemito = function(provId, vRcIds) {
        try {

          m_prov_id = provId;

          DB.getData("load[" + m_apiPath + "general/proveedor/" + provId.toString() + "/name]").then(function(response) {

            try {

              if(response.success === true) {

                m_proveedor = valField(response.data, C.PROV_NAME);

                m_rcIds = [];
                for(var i = 1; i < vRcIds.length; i++) {
                  m_rcIds[i] = vRcIds[i];
                }

                if(initMembers()) {
                  showStartWizardRemito();
                }
              }
            }
            catch(ex) {
              Cairo.manageErrorEx(ex.message, ex, "showFacturaRemito", C_MODULE, "");
            }

          });
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showFacturaRemito", C_MODULE, "");
        }
      };

      var initMembers = function() {

        if(!Cairo.Security.docHasPermissionTo(
          CS.NEW_FACTURA,
          NO_ID,
          Cairo.Security.ActionTypes.create)) {
          return false;
        }

        self.setDialog(Cairo.Dialogs.Views.Controller.newDialog());
        self.footer(Cairo.Dialogs.Views.Controller.newDialog());
        self.items(Cairo.Dialogs.Views.Controller.newDialog());

        return true;
      };

      self.showFacturaOrden = function(provId, vOcIds) {
        try {

          m_prov_id = provId;

          DB.getData("load[" + m_apiPath + "general/proveedor/" + provId.toString() + "/name]").then(function(response) {

            try {

              if(response.success === true) {

                m_proveedor = valField(response.data, C.PROV_NAME);

                m_ocIds = [];
                for(var i = 1; i < vOcIds.length + 1; i++) {
                  m_ocIds[i] = vOcIds[i];
                }

                if(initMembers()) {
                  showStartWizard();
                }
              }
            }
            catch(ex) {
              Cairo.manageErrorEx(ex.message, ex, "showFacturaOrden", C_MODULE, "");
            }

          });
        }
        catch(ex) {
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

        m_listController.updateEditorKey(self, NO_ID);
          
        m_copy = true;
        m_docEditable = true;
        m_docEditMsg = "";

        D.getDocNumberForProveedor(m_lastProvId, m_lastDocId, m_dialog).then(
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

        m_listController.updateEditorKey(self, NO_ID);

        // p = load(NO_ID).then(function() {
        p = self.edit(NO_ID).then(function() {

          var p = null;

          m_lastProvId = NO_ID;

          if(!m_docEditable) {
            if(m_docEditMsg !== "") {
              p = M.showWarning(m_docEditMsg);
            }
          }

          return p || P.resolvedPromise();

        }).then(function() {

          var p = null;

          var docId = m_properties.item(C.DOC_ID).getSelectId();

          if(docId === NO_ID) {
            p = M.showInfo(getText(1562, ""));
          }

          return p || P.resolvedPromise();

        }).then(function() {

          setDatosProveedor();
          return D.getDocNumberForProveedor(m_lastProvId, m_lastDocId, m_dialog)

        }).then(function(enabled) {

          m_taPropuesto = enabled;
          setColorBackground();
          return true;

        });

        return p;
      };

      self.getApplication = function() {
        return Cairo.appName;
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

          doc.setClientTable(C.FACTURA_COMPRA);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showDocDigital", C_MODULE, "");
        }

        return _rtn;
      };

      self.messageEx = function(messageID, info) {
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

            showApplycation();
            break;

          case Dialogs.Message.MSG_DOC_EDIT_STATE:

            D.showEditStatus(m_docEditMsg, getText(1889, ""));
            break;

          case Dialogs.Message.MSG_DOC_DELETE:

            p = self.deleteDocument(m_id).success(function() {
              return move(Dialogs.Message.MSG_DOC_NEXT);
            });            
            break;

          case Dialogs.Message.MSG_DOC_INVALIDATE:

            p = D.docInvalidate(m_doct_id, m_id, m_dialog).then(function(result) {
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

            p = P.resolvedPromise(true);
            break;

          case Dialogs.Message.MSG_DOC_EX_GET_ITEMS:

            p = P.resolvedPromise(m_items);
            break;

          case Dialogs.Message.MSG_DOC_EX_GET_FOOTERS:

            p = P.resolvedPromise(m_footer);
            break;

          case Dialogs.Message.MSG_DOC_SEARCH:

            D.search(D.FACTURA_COMPRA, self, Cairo.bool(info));
            break;

          case Dialogs.Message.MSG_DOC_DOC_AUX:

            if(m_id) {

              if(m_showStockData) {
                p = m_dialog.showPopMenu(
                  getText(1890, "") + "~1|"
                + getText(1891, "") + "~2"); // &Ver Asiento~1|Ver Transferencia de Stock~2
              }
              else {
                D.showDocAux(m_as_id, "Asiento");
              }
            }
            else {
              p = M.showInfo(
                getText(1620, "")); // Debe editar un comprobante guardado para poder ver los documentos auxiliares
            }
            break;

          case Dialogs.Message.MSG_DOC_DOC_EDIT:

            if(m_id) {

              if(m_docEditable) {
                p = M.showInfo(getText(1555, "")); // Este documento puede editarse normalmente
              }
              else {

                p = D.docCanBeSaved(m_dialog, CC.FC_FECHA_IVA).then(function(canBeSaved) {
                  if(canBeSaved) {

                    var editDoc = new Cairo.EditDocumento.Edit.Controller.getEditor();
                    editDoc.setClient(self);
                    editDoc.setUseLegalCurrency(m_defaultCurrency === m_lastMonId);
                    editDoc.setCotizacion(val(getCotizacion().getValue()));
                    return editDoc.edit(m_id, m_doct_id, true);
                  }
                });
              }
            }
            else {
              p = M.showInfo(getText(1556, "")); // Esta opción solo sirve para modificar documentos guardados y aplicados
            }
            break;

          case Dialogs.Message.MSG_MENU_AUX:

            switch (val(info)) {

              case 1:
                D.showDocAux(m_as_id, "Asiento");
                break;

              case 2:
                D.showDocAux(m_st_id, "Stock");
                break;
            }
            break;

          case Dialogs.Message.MSG_DOC_DOC_ACTION:

            if(m_id) {
              showOrdenPago();
            }
            else {
              p = M.showInfo(getText(1556, "")); // Esta opción solo sirve para modificar documentos guardados y aplicados
            }
            break;

          case Dialogs.Message.MSG_DOC_HISTORY:

            if(m_id !== NO_ID) {
              p = Cairo.History.show(Cairo.Tables.FACTURAS_DE_COMPRA, m_id, m_documento + " " + m_nrodoc);
            }
            else {
              p = M.showInfo(getText(1552, "")); // El documento aun no ha sido guardado
            }
            break;

          case Dialogs.Message.MSG_EXPORT_GET_EMAIL:

            var property = m_properties.item(C.PROV_ID);
            p = D.getEmailFromProveedor(property.getSelectId());
            break;

          case Dialogs.Message.MSG_GRID_VIRTUAL_ROW:

            p = processMultiRow(info);
            break;

          case Dialogs.Message.MSG_EXPORT_GET_FILE_NAME_POSTFIX:

            p = getFileNamePostFix();
            break;
        }

        return p || P.resolvedPromise();
      };

      self.discardChanges = function() {
        Cairo.raiseError("FacturaCompra", "DiscardChanges was called");
      };

      self.propertyChange = function(key) {

        var p = null;

        switch (key) {

          case K_DOC_ID:

            // if the document has changed
            // 
            var changeInfo = D.docHasChanged(m_dialog, m_lastDocId);
            if(changeInfo.changed) {

              m_lastDocId = changeInfo.docId;
              m_lastDocName = changeInfo.docName;

              p = DB.getData("load[" + m_apiPath + "documento/" + m_lastDocId.toString() + "/info]");

              p = p.then(function(response) {

                if(response.success === true) {
                  m_lastMonId = valField(response.data, C.MON_ID);
                  m_lastDoctId = valField(response.data, C.DOCT_ID);
                  m_lastDocTipoFactura = valField(response.data, C.DOC_TIPO_FACTURA);
                  m_showStockData = valField(response.data, C.DOC_MUEVE_STOCK);
                }
                return response.success;

              })
              .success(function() {

                var p = null;

                // when the document property is changed and the dialog was
                // editing a saved invoice we need to move to a new invoice
                // 
                if(m_id !== NO_ID && m_doc_id !== m_lastDocId) {
                  p = self.edit(D.Constants.DOC_CHANGED);
                }

                return p || P.resolvedPromise(true);

              })
              .success(function() {

                return D.getDocNumberForProveedor(m_lastProvId, m_lastDocId, m_dialog)
                .then(function(enabled) {

                  m_taPropuesto = enabled;
                  return showCotizacion();

                })
                .then(function() {

                  showHideCols(true);
                  setColorBackground();

                });
              });
            }

            p = p || P.resolvedPromise();

            p.then(function() {
              setEnabled();
            });

            break;

          case K_PROV_ID:

            setDatosProveedor().success(function() {
              D.getDocNumberForProveedor(m_lastProvId, m_lastDocId, m_dialog)
              .then(function(enabled) {
                m_taPropuesto = enabled;
              }).then(function() {
                D.showDataAddProveedor(Cairo.UserConfig.getShowDataAddInCompras(), m_dialog);
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
              m_lastMonIdCotizacion = NO_ID;

              p = showCotizacion().then(function() {
                var properties = m_properties;
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

        return p || P.resolvedPromise();
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

        p = D.docCanBeEdited(m_docEditable, m_docEditMsg)
          .success(function() {
            return D.docCanBeSaved(m_dialog, CC.FC_FECHA_IVA);
          })
          .success(function() {
            if(getItems().getGrid().getRows().count() === 0) {
              M.showWarning(getText(3903, "")); // El documento debe contener al menos un item
              return false;
            }
            else {
              return true;
            }
          })
          .success(function() {

            var register = new DB.Register();
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
              m_est_id = D.Status.pendiente;
            }

            var _count = m_properties.size();
            for(var _i = 0; _i < _count; _i++) {

              var property = m_properties.item(_i);

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
                  cotizacion = val(property.getValue());
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
                  fields.add(CC.PRO_ID_ORIGEN, property.getSelectId(), Types.id);
                  break;

                case K_PRO_ID_DESTINO:
                  fields.add(CC.PRO_ID_DESTINO, property.getSelectId(), Types.id);
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

            isDefaultCurrency = m_defaultCurrency === m_lastMonId;
            if(isDefaultCurrency) {
              cotizacion = 1;
            }
            else {
              if(cotizacion === 0) {
                cotizacion = 1;
              }
            }

            var _count = m_footerProps.size();
            for(var _i = 0; _i < _count; _i++) {

              property = m_footerProps.item(_i);

              switch (property.getKey()) {

                case K_NETO:
                  neto = val(property.getValue());
                  fields.add(CC.FC_NETO, neto * cotizacion, Types.currency);
                  break;

                case K_IVA_RI:
                  ivaRi = val(property.getValue());
                  fields.add(CC.FC_IVA_RI, ivaRi * cotizacion, Types.currency);
                  break;

                case K_IVA_RNI:
                  ivaRni = val(property.getValue());
                  fields.add(CC.FC_IVA_RNI, ivaRni * cotizacion, Types.currency);
                  break;

                case K_INTERNOS:
                  internos = val(property.getValue());
                  fields.add(CC.FC_IVA_RNI, internos * cotizacion, Types.currency);
                  break;

                case K_SUBTOTAL:
                  fields.add(CC.FC_SUBTOTAL, val(property.getValue()) * cotizacion, Types.currency);
                  break;

                case K_IMPORTE_DESC_1:
                  fields.add(CC.FC_IMPORTE_DESC_1, val(property.getValue()) * cotizacion, Types.currency);
                  break;

                case K_IMPORTE_DESC_2:
                  fields.add(CC.FC_IMPORTE_DESC_2, val(property.getValue()) * cotizacion, Types.currency);
                  break;

                case K_TOTAL_OTROS:
                  totalOtros = val(property.getValue());
                  fields.add(CC.FC_TOTAL_OTROS, totalOtros * cotizacion, Types.currency);
                  break;

                case K_TOTAL_PERCEPCIONES:
                  totalPercep = val(property.getValue());
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
            fields.add(C.EST_ID, m_est_id, Types.id);

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
              getProperty(m_items, C_PERCEPCIONES),
              cotizacion, isDefaultCurrency,
              m_copy,
              m_percepcionesDeleted,
              m_id,
              C_MODULE);

            return DB.saveTransaction(
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
                    return M.showWarningWithFalse(result.errors.message);
                  }
                  else {
                    m_copy = false;
                    return load(result.data.getId()).then(
                      function(success) {
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
        if(m_id === NO_ID) { return; }
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
        catch (ignore) {
          Cairo.logError('Error in terminate', ignore);
        }
      };

      self.getPath = function() {
        return "#compras/facturacompra/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "facturacompra" + id;
      };

      self.getTitle = function() {
        return TITLE;
      };

      self.validate = function() {

        var _count = m_properties.size();
        for(var _i = 0; _i < _count; _i++) {

          var property = m_properties.item(_i);

          switch (property.getKey()) {

            case K_FECHA:
              if(Cairo.Util.valEmpty(property.getValue(), Types.date)) {
                return M.showInfoWithFalse(getText(1558, "")); // Debe indicar una fecha
              }
              break;

            case K_FECHA_ENTREGA:
              if(Cairo.Util.valEmpty(property.getValue(), Types.date)) {
                return M.showInfoWithFalse(getText(1564, "")); // Debe indicar una fecha de entrega
              }
              break;

            case K_FECHA_VTO:
              if(Cairo.Util.valEmpty(property.getValue(), Types.date) && property.getVisible()) {
                return M.showInfoWithFalse(getText(1625, "")); // Debe indicar una fecha de vencimiento
              }
              break;

            case K_PROV_ID:
              if(Cairo.Util.valEmpty(property.getSelectId(), Types.id)) {
                return M.showInfoWithFalse(getText(1860, "")); // Debe indicar un Proveedor
              }
              break;

            case K_DOC_ID:
              if(Cairo.Util.valEmpty(property.getSelectId(), Types.id)) {
                return M.showInfoWithFalse(getText(1562, "")); // Debe indicar un documento
              }
              break;

            case K_CPG_ID:
              if(Cairo.Util.valEmpty(property.getSelectId(), Types.id)) {
                return M.showInfoWithFalse(getText(1561, "")); // Debe indicar una condición de pago
              }
              break;

            case K_SUC_ID:
              if(Cairo.Util.valEmpty(property.getSelectId(), Types.id)) {
                return M.showInfoWithFalse(getText(1560, "")); // Debe indicar una sucursal
              }
              break;

            case K_COTIZACION:
              if(Cairo.Util.valEmpty(property.getValue(), Types.double) && property.getVisible()) {
                return M.showInfoWithFalse(getText(1620, "")); // Debe indicar una cotización
              }
              break;

            case K_DEPL_ID:
              if(Cairo.Util.valEmpty(property.getSelectId(), Types.id) && m_showStockData) {
                return M.showInfoWithFalse(getText(1559, "")); // Debe indicar un deposito
              }
              break;
          }
        }

        return validateCuentaMoneda();
      };

      var validateCuit = function(provId) {
        var p = null;

        try {

          if(provId !== NO_ID) {

            var validate = function(response) {

              if(response.success) {
                var cuit = valField(response.data, C.PROV_CUIT);
                var catFiscal = valField(response.data, C.PROV_CAT_FISCAL);

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
                      return M.showWarningWithFalse(getText(1893, "")); // Para poder crear la factura debe dar de alta el CUIT del Proveedor
                    }
                    break;
                }
                return true;
              }
              else {
                return M.showWarningWithFalse(getText(1894, "")); // No se pudo obtener el CUIT del Proveedor
              }
            };

            p = DB.getData("load[" + m_apiPath + "general/proveedor/" + provId.toString() + "/cat_fiscal]").then(validate);
          }
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "validateCuit", C_MODULE, "");
        }

        return p || P.resolvedPromise(false);
      };

      var getCueIdProveedor = function() {

        var getCueId = function(response) {

          try {

            var cueId = valField(response.data, C.CUE_ID);
            var monId = valField(response.data, C.MON_ID);

            return { success: true, monId: monId, cueId: cueId };
          }
          catch(ex) {
            Cairo.manageErrorEx(ex.message, ex, "getCueIdProveedor", C_MODULE, "");
          }

          return { success: false };
        };

        var p = DB.getData(
            "load[" + m_apiPath + "documento/" + m_lastDocId.toString() + "/supplier/" + m_lastProvId.toString() + "/account]")
          .successWithResult(getCueId, false);

        return p;
      };

      var validateCuentaMoneda = function() {

        var validate = function(result) {

          if(result.monId !== m_lastMonId) {
            return M.showInfoWithFalse(getText(1895, "")); // La cuenta asociada al Proveedor y la cuenta del documento tienen diferentes monedas
          }
          return true;
        };

        return getCueIdProveedor().successWithResult(validate, false);
      };

      self.isEmptyRow = function(key, row, rowIndex) {
        var isEmpty = true;

        try {

          switch (key) {
            case K_ITEMS:
              isEmpty = isEmptyRowItems(row, rowIndex);
              break;

            case K_OTROS:
              isEmpty = isEmptyRowOtros(row, rowIndex);
              break;

            case K_PERCEPCIONES:
              isEmpty = Percepciones.isEmptyRowPercepciones(row, rowIndex);
              break;

            case K_LEGAJOS:
              isEmpty = isEmptyRowLegajos(row, rowIndex);
              break;
          }

        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "validateRow", C_MODULE, "");
        }

        return P.resolvedPromise(isEmpty);
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
            m_doc_id = valField(response.data, C.DOC_ID);
            m_doct_id = valField(response.data, C.DOCT_ID);

            return true;

          }
          catch(ex) {
            Cairo.manageErrorEx(ex.message, ex, "loadForPrint", C_MODULE, "");
          }

          return false;
        };

        var p = DB.getData("load[" + m_apiPath + "compras/facturacompra/info]",id)
          .successWithResult(loadData, false);

        return p;
      };

      self.getDialog = function() {
        return m_dialog;
      };

      self.list = function() {
        return Cairo.Security.hasPermissionTo(CS.LIST_FACTURA);
      };

      self.setDialog = function(dialog) {
        m_dialog = dialog;
        m_properties = m_dialog.getProperties();
        m_dialog.setIsDocument(true);
      };

      self.isEditing = function() {
        return m_editing;
      };

      self.deleteDocument = function(id) {

        if(m_dialog !== null) {
          if(!Cairo.Security.docHasPermissionTo(
                CS.DELETE_FACTURA,
                D.getDocIdFromDialog(m_dialog),
                Cairo.Security.ActionTypes.destroy)) {
            return P.resolvedPromise(false);
          }
        }

        return DB.destroy(
            m_apiPath + "compras/facturacompra",
            id,
            Cairo.Constants.DELETE_FUNCTION, C_MODULE);
      };

      self.edit = function(id, inModalWindow) {

        var p = null;

        try {

          if(!Cairo.Security.docHasPermissionTo(
                CS.LIST_FACTURA,
                D.getDocIdFromDialog(m_dialog),
                Cairo.Security.ActionTypes.list)) {
            return P.resolvedPromise(false);
          }

          // Id = DOC_CHANGED when the document is changed
          //                  when editing a document
          // 
          m_isNew = (id === NO_ID
                      || id === D.Constants.DOC_CHANGED);

          var afterLoad = function() {
            if(m_properties.count() === 0) {
              if(!loadCollection()) { return false; }
            }
            else {
              refreshProperties();
            }

            m_dialog.setNewPropertyKeyFocus("");

            // only show the wizard if the new action is not
            // originated by a change on document
            // 
            if(id !== D.Constants.DOC_CHANGED
                && m_isNew && docDesdeOrden()) {

              showStartWizard();
            }
            else if(id !== D.Constants.DOC_CHANGED
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
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "edit", C_MODULE, "");
        }

        return p || P.resolvedPromise(false);
      };

      self.setListController = function(controller) {
        m_listController = controller;
      };

      self.columnAfterUpdate = function(key, lRow, lCol) {
        var p = null;

        try {

          switch (key) {

            case K_ITEMS:

              var property = m_itemsProps.item(C_ITEMS);
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
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnAfterUpdate", C_MODULE, "");
        }

        return p || P.resolvedPromise(true);
      };

      self.columnClick = function(key,  lRow,  lCol) {

      };

      self.gridDblClick = function(key,  lRow,  lCol) {
        return Cairo.Promises.resolvedPromise(false);
      };

      self.columnAfterEdit = function(key, lRow, lCol, newValue, newValueID) {
        var p = null;

        try {

          switch (key) {

            case K_ITEMS:
              var property = getProperty(m_items, C_ITEMS);
              p = columnAfterEditItems(property, lRow, lCol, newValue, newValueID);
              break;

            case K_OTROS:
              var property = m_itemsProps.item(C_OTROS);
              p = columnAfterEditOtros(property, lRow, lCol, newValue, newValueID);
              break;

            case K_PERCEPCIONES:
              var property = m_itemsProps.item(C_PERCEPCIONES);
              p = Percepciones.columnAfterEditPercepciones(property, lRow, lCol, newValue, newValueID);
              break;
          }

        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnAfterEdit", C_MODULE, "");
        }

        return p || P.resolvedPromise(true);
      };

      self.columnBeforeEdit = function(key, lRow, lCol, iKeyAscii) {
        var rtn = false;

        try {

          switch (key) {

            case K_ITEMS:
              var property = getProperty(m_items, C_ITEMS);
              rtn = columnBeforeEditItems(property, lRow, lCol, iKeyAscii);
              break;

            case K_OTROS:
              var property = m_itemsProps.item(C_OTROS);
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
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnBeforeEdit", C_MODULE, "");
        }

        return P.resolvedPromise(rtn);
      };

      var columnBeforeEditItems = function(property, lRow, lCol, iKeyAscii) {

        var rtn = false;
        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).getKey()) {

          case KI_NRO_SERIE:

            var row = property.getGrid().getRows().item(lRow);
            if(row !== null) {
              rtn = cellId(row, KI_PR_LLEVA_NRO_SERIE);
            }
            break;

          case KI_STL_CODIGO:

            var row = grid.getRows().item(lRow);
            if(row !== null) {
              rtn = cellId(row, KI_PR_LLEVALOTE);
            }
            break;

          default:

            rtn = true;
            break;
        }

        return rtn;
      };

      var columnBeforeEditOtros = function(property, lRow, lCol, iKeyAscii) {
        return true;
      };

      var getPrecioFromRow = function(row) {
        var cell = getCell(row, KI_PRECIO_USR);
        return val(cell.getValue());
      };

      var columnAfterEditOtros = function(property, lRow, lCol, newValue, newValueID) {

        var columns = property.getGrid().getColumns().item(lCol);

        switch (columns.getKey()) {

          case KI_DEBE:
          case KI_HABER:

            var row = property.getGrid().getRows().item(lRow);
            if(columns.getKey() === KI_DEBE) {
              var cell = getCell(row, KI_DEBE);
              if(val(newValue) < 0) {
                cell.setValue(0);
              }
              else if(val(newValue) > 0) {
                getCell(row, KI_HABER).setValue(0);
              }
            }
            else if(columns.getKey() === KI_HABER) {
              var cell = getCell(row, KI_HABER);
              if(val(newValue) < 0) {
                cell.setValue(0);
              }
              else if(val(newValue) > 0) {
                getCell(row, KI_DEBE).setValue(0);
              }
            }
            break;
        }

        return true;
      };

      var columnAfterEditItems = function(property, lRow, lCol, newValue, newValueID) {

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
            p = setDescuentos(row, cellId(row, KI_PR_ID), newValue);
            break;

          case KI_CANTIDAD:

            var row = property.getGrid().getRows().item(lRow);

            if(cellId(row, KI_PR_LLEVA_NRO_SERIE)) {

              var prId = cellId(row, KI_PR_ID);

              p = Cairo.SerialNumber.quantityChange(
                row, lRow, KI_CANTIDAD, newValue, KI_GRUPO, m_serialNumbers, KI_PR_ID, KI_NRO_SERIE,
                getPrId(prId), getDeplId(), getIsInput(), getProvId());
            }
            break;
        }

        return p || P.resolvedPromise(true);
      };

      self.columnButtonClick = function(key, lRow, lCol, iKeyAscii) {

        var p = null;

        switch (key) {

          case K_ITEMS:

            var grid = getProperty(m_items, C_ITEMS).getGrid();

            switch (grid.getColumns().item(lCol).getKey()) {

              case KI_NRO_SERIE:

                var row = grid.getRows().item(lRow);

                if(cellId(row, KI_PR_LLEVA_NRO_SERIE) !== 0) {

                  var prId = cellId(row, KI_PR_ID);

                  p = Cairo.SerialNumber.edit(
                    cellId(row, KI_GRUPO), cellFloat(row, KI_CANTIDAD),
                    row, m_serialNumbers, KI_GRUPO, KI_NRO_SERIE, lRow, getPrId(prId), getDeplId(),
                    getIsInput(), false, false, null, getProvId(), NO_ID);
                }
                break;
            }
            break;
        }

        return p || P.resolvedPromise(false);
      };

      self.deleteRow = function(key, row, lRow) {

        switch (key) {

          case K_ITEMS:

            var id = cellFloat(row, KI_FCI_ID);
            if(id !== NO_ID) { m_itemsDeleted = m_itemsDeleted+ id.toString()+ ","; }
            break;

          case K_OTROS:

            var id = cellFloat(row, KI_FCOT_ID);
            if(id !== NO_ID) { m_otrosDeleted = m_otrosDeleted+ id.toString()+ ","; }
            break;

          case K_PERCEPCIONES:

            var id = cellFloat(row, Percepciones.KIP_FCPERC_ID);
            if(id !== NO_ID) { m_percepcionesDeleted = m_percepcionesDeleted+ id.toString()+ ","; }
            break;

          case K_LEGAJOS:

            id = cellFloat(row, KIL_FCLGJ_ID);
            if(id !== NO_ID) { m_legajosDeleted = m_legajosDeleted+ id.toString()+ ","; }
            break;
        }

        return P.resolvedPromise(true);
      };

      self.newRow = function(key,  rows) {
        return P.resolvedPromise(true);
      };

      var validateRow = function(key, row, rowIndex) {
        var p = null;

        try {

          switch (key) {

            case K_ITEMS:
              p = validateRowItems(row, rowIndex);
              break;

            case K_OTROS:
              p = validateRowOtros(row, rowIndex);
              break;

            case K_PERCEPCIONES:
              p = Percepciones.validateRowPercepciones(row, rowIndex);
              break;

            case K_LEGAJOS:
              p = validateRowLegajos(row, rowIndex);
              break;
          }

        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "validateRow", C_MODULE, "");
        }

        return p || P.resolvedPromise(false);
      };

      var isEmptyRowLegajos = function(row, rowIndex) {

        var rowIsEmpty = true;

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {
            case KIL_IMPORTE:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.currency)) {
                rowIsEmpty = false;
                break;
              }
              break;

            case KIL_LGJ_ID:
              if(!Cairo.Util.valEmpty(cell.getId(), Types.id)) {
                rowIsEmpty = false;
                break;
              }
              break;

            case KIL_DESCRIP:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.text)) {
                rowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return rowIsEmpty;
      };

      var isEmptyRowOtros = function(row, rowIndex) {

        var rowIsEmpty = true;

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KI_DEBE:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.currency)) {
                rowIsEmpty = false;
                break;
              }
              break;

            case KI_HABER:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.currency)) {
                rowIsEmpty = false;
                break;
              }
              break;

            case KI_CUE_ID:
              if(!Cairo.Util.valEmpty(cell.getId(), Types.id)) {
                rowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return rowIsEmpty;
      };

      var isEmptyRowItems = function(row, rowIndex) {

        var rowIsEmpty = true;

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KI_CANTIDAD:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.currency)) {
                if(val(cell.getValue()) !== 1) {
                  rowIsEmpty = false;
                  break;
                }
              }
              break;

            case KI_PRECIO:
              if(!Cairo.Util.valEmpty(cell.getValue(), Types.currency)) {
                rowIsEmpty = false;
                break;
              }
              break;

            case KI_PR_ID:
              if(!Cairo.Util.valEmpty(cell.getId(), Types.id)) {
                rowIsEmpty = false;
                break;
              }
              break;
          }
        }

        return rowIsEmpty;
      };

      var validateRowLegajos = function(row, rowIndex) {

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KIL_LGJ_ID:
              if(Cairo.Util.valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(1896, "", strRow)); // Debe indicar un legajo (1)
              }
              break;

            case KIL_IMPORTE:
              if(Cairo.Util.valEmpty(cell.getValue(), Types.currency)) {
                return M.showInfoWithFalse(getText(1897, "", strRow)); // Debe indicar un importe (1)
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var validateRowOtros = function(row, rowIndex) {

        var bDebeHaber = false;
        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KI_CUE_ID:
              if(Cairo.Util.valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(1388, "", strRow)); // Debe indicar una cuenta (1)
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
          return M.showInfoWithFalse(getText(1898, "", strRow)); // Debe indicar un importe en el Debe o en el Haber (1)
        }

        return P.resolvedPromise(true);
      };

      var validateRowItems = function(row, rowIndex) {

        var p = null;
        var llevaNroSerie = false;
        var cantidad = 0;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KI_CANTIDAD:
              cantidad = val(cell.getValue());
              if(Cairo.Util.valEmpty(cell.getValue(), Types.currency)) {
                p = M.showInfoWithFalse(getText(1365, "", strRow)); // Debe indicar una cantidad (1)
              }
              break;

            case KI_PRECIO:
              if(Cairo.Util.valEmpty(cell.getValue(), Types.currency)) {
                p = M.showInfoWithFalse(getText(1631, "", strRow)); // Debe indicar un precio (1)
              }
              break;

            case KI_PR_ID:
              if(Cairo.Util.valEmpty(cell.getId(), Types.id)) {
                p = M.showInfoWithFalse(getText(1899, "", strRow)); // Debe indicar un producto de Compra (1)
              }
              break;

            case KI_NRO_SERIE:
              llevaNroSerie = cellId(row, KI_PR_LLEVA_NRO_SERIE);
              if(Cairo.Util.valEmpty(cell.getValue(), Types.text) && llevaNroSerie) {
                p = M.showInfoWithFalse(getText(1630, "", strRow)); // Debe indicar un numero de serie (1)
              }
              break;

            case KI_STL_CODIGO:
              if(m_showStockData) {
                if(Cairo.Util.valEmpty(cell.getValue(), Types.text) && cellId(row, KI_PR_LLEVALOTE)) {
                  p = M.showInfoWithFalse(getText(1632, "", strRow)); // Debe indicar un lote (1)
                }
              }
              break;

            case KI_TO_ID:
              if(Cairo.Util.valEmpty(cell.getId(), Types.id)) {
                p = M.showInfoWithFalse(getText(1633, "", strRow)); // Debe indicar un tipo de operación (1)
              }
              break;
          }
        }

        // if the product has a serial number
        // we need validate quantity match the
        // count of serial numbers collection
        // 
        if(llevaNroSerie && m_showStockData) {

          var prId = cellId(row, KI_PR_ID);

          p = Cairo.SerialNumber.quantityChange(
            row, KI_GRUPO, rowIndex, m_serialNumbers, cantidad, strRow,
            KI_PR_ID, KI_CANTIDAD, KI_NRO_SERIE, getPrId(prId), getDeplId(), getIsInput());
        }

        return p || P.resolvedPromise(true);
      };

      var loadCollection = function() {

        var cotizacion = 0;
        var validateDocDefault = false;
        var elem, list;

        m_properties.clear();

        var tabs = m_dialog.getTabs();
        tabs.clear();

        tabs.add(null).setName(Cairo.Constants.TAB_GENERAL);
        tabs.add(null).setIndex(1).setName(getText(1566, "")); // Adicionales
        tabs.add(null).setIndex(2).setName(getText(4909, "")); // Descuentos
        tabs.add(null).setIndex(3).setName(getText(1861, "")); // Observaciones

        var properties = m_properties;

        elem = properties.add(null, C.DOC_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(getText(1567, "")); // Documento
        elem.setKey(K_DOC_ID);

        if(m_doc_id !== NO_ID) {
          elem.setSelectId(m_doc_id);
          elem.setValue(m_documento);
        }
        else {
          // user preferences
          // 
          elem.setSelectId(Cairo.UserConfig.getDocFcId());
          elem.setValue(Cairo.UserConfig.getDocFcNombre());

          validateDocDefault = elem.getSelectId() !== NO_ID;
        }

        elem.setSelectFilter(D.FACTURA_COMPRAS_DOC_FILTER);

        elem = properties.add(null, Cairo.Constants.NUMBER_ID);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.integer);
        elem.setName(getText(1065, "")); // Número
        elem.setKey(K_NUMERO);
        elem.setValue(m_numero);
        elem.setEnabled(false);

        elem = properties.add(null, Cairo.Constants.STATUS_ID);
        elem.setType(T.text);
        elem.setName(getText(1568, "")); // Estado
        elem.setKey(K_EST_ID);
        elem.setValue(m_estado);
        elem.setEnabled(false);

        elem = properties.add(null, CC.FC_FECHA);
        elem.setType(T.date);
        elem.setName(getText(1569, "")); // Fecha
        elem.setKey(K_FECHA);
        elem.setValue(m_fecha);

        elem = properties.add(null, CC.FC_FECHA_IVA);
        elem.setType(T.date);
        elem.setName(getText(1900, "")); // F. IVA
        elem.setKey(K_FECHA_IVA);
        elem.setValue(m_fechaIva);

        elem = properties.add(null, C.PROV_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PROVEEDOR);
        elem.setName(getText(1151, "")); // Proveedor
        elem.setKey(K_PROV_ID);
        elem.setSelectId(m_prov_id);
        elem.setValue(m_proveedor);
        m_dialog.setNewPropertyKeyFocus(C.PROV_ID);

        elem = properties.add(null, CC.FC_NRODOC);
        elem.setType(T.text);
        elem.setName(getText(1065, "")); // Número
        elem.setSize(50);
        elem.setKey(K_NRODOC);
        elem.setValue(m_nrodoc);
        elem.setTextMask(m_taMascara);
        elem.setTextAlign(Dialogs.TextAlign.right);

        elem = properties.add(null, C.CPG_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CONDICION_PAGO);
        elem.setName(getText(1835, "")); // C. pago
        elem.setKey(K_CPG_ID);
        elem.setSelectId(m_cpg_id);
        elem.setValue(m_condicionPago);

        elem = properties.add(null, CC.FC_FECHA_VTO);
        elem.setType(T.date);
        elem.setName(getText(1634, "")); // Vto.
        elem.setKey(K_FECHA_VTO);
        elem.setValue(m_fechaVto);

        elem = properties.add(null, CC.LGJ_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LEGAJOS);
        elem.setName(getText(1575, "")); // Legajo
        elem.setKey(K_LGJ_ID);
        elem.setSelectId(m_lgj_id);
        elem.setValue(m_legajo);
        elem.setTabIndex(1);

        elem = properties.add(null, CC.PRO_ID_ORIGEN);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PROVINCIA);
        elem.setName(getText(1901, "")); // Origen
        elem.setKey(K_PRO_ID_ORIGEN);
        elem.setSelectId(m_pro_id_origen);
        elem.setValue(m_proOrigen);
        elem.setTabIndex(1);

        elem = properties.add(null, CC.PRO_ID_DESTINO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PROVINCIA);
        elem.setName(getText(1902, "")); // Destino
        elem.setKey(K_PRO_ID_DESTINO);
        elem.setSelectId(m_pro_id_destino);
        elem.setValue(m_proDestino);
        elem.setTabIndex(1);

        elem = properties.add(null, CC.FC_CAI);
        elem.setType(T.text);
        elem.setName(getText(1636, "")); // Cai
        elem.setKey(K_CAI);
        elem.setValue(m_cai);
        elem.setTabIndex(1);

        elem = properties.add(null, CC.FC_FECHA_ENTREGA);
        elem.setType(T.date);
        elem.setName(getText(1570, "")); // Entrega
        elem.setKey(K_FECHA_ENTREGA);
        elem.setValue(m_fechaentrega);
        elem.setTabIndex(1);

        elem = properties.add(null, CC.DEPL_ID_ORIGEN);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.DEPOSITO_LOGICO);
        elem.setName(getText(1574, "")); // Deposito
        elem.setKey(K_DEPL_ID);

        if(m_depl_id !== NO_ID || !m_showStockData) {
          elem.setSelectId(m_depl_id);
          elem.setValue(m_deposito);
        }
        else {
          // user preferences
          // 
          elem.setSelectId(Cairo.UserConfig.getDeplId());
          elem.setValue(Cairo.UserConfig.getDeplNombre());
        }

        elem.setEnabled(m_showStockData);
        elem.setTabIndex(1);

        elem = properties.add(null, CC.FC_TIPO_COMPROBANTE);
        elem.setType(T.list);
        elem.setName(getText(1903, "")); // Tipo Comprobante
        elem.setKey(K_TIPO_COMPRABANTE);
        elem.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
        list = elem.getList();

        list.add(null)
          .setId(D.ReceiptType.original)
          .setValue(getText(2090, "")); // Original

        list.add(null)
          .setId(D.ReceiptType.fax)
          .setValue(getText(1200, "")); // Fax

        list.add(null)
          .setId(D.ReceiptType.photocopy)
          .setValue(getText(2091, "")); // Fotocopia

        list.add(null)
          .setId(D.ReceiptType.duplicate)
          .setValue(getText(2092, "")); // Duplicado

        elem.setListItemData(m_tipoComprobante);
        elem.setTabIndex(1);

        elem = properties.add(null, CC.FC_COTIZACION_PROV);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setName(getText(4653, "")); // Cotizacion Proveedor
        elem.setKey(K_COTIZACION_PROV);
        elem.setValue(m_cotizacionProv);
        elem.setTabIndex(1);

        elem = properties.add(null, CC.FC_DESCUENTO1);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
        elem.setName(getText(1573, "")); // Desc. 1
        elem.setKey(K_DESCUENTO1);
        elem.setValue(m_descuento1);
        elem.setTabIndex(2);

        elem = properties.add(null, CC.FC_DESCUENTO2);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
        elem.setName("2");
        elem.setKey(K_DESCUENTO2);
        elem.setValue(m_descuento2);
        elem.setTabIndex(2);

        elem = properties.add(null, C.LP_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LISTAPRECIO);
        elem.setName(getText(1397, "")); // Lista de Precios
        elem.setSelectFilter(D.getListaPrecioForProveedor(m_doc_id, m_prov_id));
        elem.setKey(K_LP_ID);
        elem.setSelectId(m_lp_id);
        elem.setValue(m_listaPrecio);
        elem.setTabIndex(2);

        elem = properties.add(null, C.LD_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LISTADESCUENTO);
        elem.setName(getText(1398, "")); // Lista de Descuentos
        elem.setSelectFilter(D.getListaDescuentoForProveedor(m_doc_id, m_prov_id));
        elem.setKey(K_LD_ID);
        elem.setSelectId(m_ld_id);
        elem.setValue(m_listaDescuento);
        elem.setTabIndex(2);

        elem = properties.add(null, C.CCOS_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CENTROS_DE_COSTO);
        elem.setName(getText(1057, "")); // Centro de Costo
        elem.setKey(K_CCOS_ID);
        elem.setSelectId(m_ccos_id);
        elem.setValue(m_centroCosto);

        elem = properties.add(null, C.SUC_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.SUCURSAL);
        elem.setName(getText(1281, "")); // Sucursal
        elem.setKey(K_SUC_ID);
        elem.setSelectId(m_suc_id);
        elem.setValue(m_sucursal);

        elem = properties.add(null, CC.FC_COTIZACION);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1650, "")); // Cotiz.
        elem.setFormat(Cairo.Settings.getCurrencyRateDecimalsFormat());
        elem.setKey(K_COTIZACION);
        elem.setValue(m_cotizacion);

        if(m_cotizacion !== 0) {
          cotizacion = m_cotizacion;
        }
        else {
          cotizacion = 1;
        }

        elem = properties.add(null, CC.FC_DESCRIP);
        elem.setType(T.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setName(getText(1211, "")); // Observ.
        elem.setSize(5000);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);
        elem.setTabIndex(3);

        if(Cairo.UserConfig.getShowDataAddInCompras()) {

          elem = properties.add(null, Cairo.Constants.PROVEEDOR_DATA_ADD);
          elem.setType(T.text);
          elem.setSubType(Dialogs.PropertySubType.memo);

        }

        elem = properties.add(null);
        elem.setType(T.label);
        elem.setBackColor(Dialogs.Colors.buttonShadow);

        if(Cairo.UserConfig.getShowDataAddInCompras()) {
        }
        else {
        }


        elem = properties.add(null);
        elem.setType(T.label);
        elem.setBackColor(Dialogs.Colors.windowBackground);

        if(Cairo.UserConfig.getShowDataAddInCompras()) {
        }
        else {
        }


        elem = properties.add(null, Cairo.Constants.HIDE_COLUMNS);
        elem.setType(T.check);
        elem.setName(getText(3901, "")); // Ocultar Columnas
        elem.setKey(K_HIDECOLS);
        elem.setValue(false);

        if(Cairo.UserConfig.getShowDataAddInCompras()) {
        }
        else {
        }

        elem.setIsEditProperty(false);

        if(!m_dialog.show(self)) { return false; }

        var tabs = m_items.getTabs();
        tabs.clear();

        var tab = tabs.add(null);
        tab.setIndex(0);
        tab.setName(getText(1371, "")); // Items

        var tab = tabs.add(null);
        tab.setIndex(1);
        tab.setName(getText(1070, "")); // Otros

        var tab = tabs.add(null);
        tab.setIndex(2);
        tab.setName(getText(1248, "")); // Percepciones

        var tab = tabs.add(null);
        tab.setIndex(3);
        tab.setName(getText(1575, "")); // Legajos

        var properties = m_itemsProps;

        properties.clear();

        elem = properties.add(null, C_ITEMS);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridItems(elem);
        loadItems(elem, cotizacion);
        elem.setName(C_ITEMS);
        elem.setKey(K_ITEMS);
        elem.setTabIndex(0);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_itemsDeleted = "";

        elem = properties.add(null, C_OTROS);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridOtros(elem);
        loadOtros(elem, cotizacion);
        elem.setName(C_OTROS);
        elem.setKey(K_OTROS);
        elem.setTabIndex(1);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_otrosDeleted = "";

        elem = properties.add(null, C_PERCEPCIONES);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridPercepciones(elem);
        loadPercepciones(elem, cotizacion);
        elem.setName(C_PERCEPCIONES);
        elem.setKey(K_PERCEPCIONES);
        elem.setTabIndex(2);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_percepcionesDeleted = "";

        elem = properties.add(null, C_LEGAJOS);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridLegajos(elem);
        loadLegajos(elem, cotizacion);
        elem.setName(C_LEGAJOS);
        elem.setKey(K_LEGAJOS);
        elem.setTabIndex(3);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_legajosDeleted = "";

        if(!m_items.show(self)) { return false; }

        var properties = m_footerProps;

        properties.clear();

        elem = properties.add(null, CC.FC_SUBTOTAL);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1579, "")); // Sub Total
        elem.setKey(K_SUBTOTAL);
        elem.setValue(m_subTotal);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CC.FC_IMPORTE_DESC_1);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1573, "")); // Desc. 1
        elem.setKey(K_IMPORTE_DESC_1);
        elem.setValue(m_importeDesc1);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CC.FC_IMPORTE_DESC_2);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1580, "")); // Desc. 2
        elem.setKey(K_IMPORTE_DESC_2);
        elem.setValue(m_importeDesc2);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CC.FC_NETO);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1581, "")); // Neto
        elem.setKey(K_NETO);
        elem.setValue(m_neto);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CC.FC_IVA_RI);
        elem.setType(T.numeric);
        elem.setName(getText(1582, "")); // IVA RI
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_IVA_RI);
        elem.setValue(m_ivari);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);


        elem = properties.add(null, CC.FC_INTERNOS);
        elem.setType(T.numeric);
        elem.setName(getText(4914, "")); // Internos
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_INTERNOS);
        elem.setValue(m_internos);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CC.FC_TOTAL_OTROS);
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setName(getText(1070, "")); // Otros
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_TOTAL_OTROS);
        elem.setValue(m_totalOtros);
        elem.setEnabled(false);

        elem = properties.add(null, CC.FC_TOTAL_PERCEPCIONES);
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setName(getText(1248, "")); // Percepciones
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_TOTAL_PERCEPCIONES);
        elem.setValue(m_totalPercepciones);
        elem.setEnabled(false);

        elem = properties.add(null, CC.FC_TOTAL);
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setName(getText(1584, "")); // Total
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_TOTAL);
        elem.setValue(m_total);
        elem.setEnabled(false);

        elem = properties.add(null, CC.FC_IVA_RNI);
        elem.setType(T.numeric);
        elem.setName(getText(1583, "")); // IVA RNI
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_IVA_RNI);
        elem.setValue(m_ivarni);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);
        elem.setVisible(false);

        setEnabled();

        if(!m_footer.show(self)) { return false; }

        if(validateDocDefault) {
          self.propertyChange(K_DOC_ID);
        }

        showCotizacion();

        D.showDataAddProveedor(Cairo.UserConfig.getShowDataAddInCompras(), m_dialog);

        setColorBackground();

        return true;
      };

      var getDocId = function() {
        return m_properties.item(C.DOC_ID);
      };

      var getCotizacion = function() {
        return m_properties.item(CC.FC_COTIZACION);
      };

      var showCotizacion = function() {

        var p = null;
        var monId;

        if(m_id === NO_ID) {
          if(m_lastDocId === NO_ID) { return; }
          monId = m_lastMonId;
        }
        else {
          monId = m_mon_id;
        }

        var property = getCotizacion();
        property.setVisible(monId !== m_defaultCurrency);

        if(monId === m_defaultCurrency) {
          property.setValue(0);
          m_lastMonIdCotizacion = monId;
        }
        else {
          if(m_lastMonIdCotizacion !== monId || property.getValue() === 0) {

            var date = getFecha();
            if(! Cairo.Util.isDate(date)) {
              date = new Date();
            }

            p = D.getCurrencyRate(monId, date).then(function(rate) {
              property.setValue(rate);
              m_lastFecha = date;
              m_lastMonIdCotizacion = monId;
            });
          }
        }

        p = p || P.resolvedPromise(true);

        p = p.then(function() {
          m_dialog.showValue(property);
        });

        return p;
      };

      var getCondicionPago = function() {
        return m_properties.item(C.CPG_ID);
      };

      var showFechaVto = function() {
        var p = null;
        var cpgId = getCondicionPago().getSelectId();
        if(cpgId !== m_lastCpgId) {
          p = DB.getData("load[" + m_apiPath + "general/condicionpago/" + cpgId.toString() + "/info]").then(
            function(response) {
              if(response.success === true) {
                setFechaVto(cpgId, response);
              }
            }
          );
        }
        return p || P.resolvedPromise();
      };

      var setFechaVto = function(cpgId, response) {
        m_lastCpgId = cpgId;
        var esLibre = valField(response.data, C.CPG_ES_LIBRE);
        var property = m_properties.item(CC.FC_FECHA_VTO);
        property.setVisible(esLibre);
        m_dialog.showValue(property);
      };

      var setGridItems = function(property) {

        var elem;
        var hideColumns = m_properties.item(Cairo.Constants.HIDE_COLUMNS).getValue();
        var bColVisible = val(hideColumns) === 0;

        var grid = property.getGrid();

        grid.getColumns().clear();
        grid.getRows().clear();

        var columns = grid.getColumns();
        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_FCI_ID);

        elem = columns.add(null);

        elem.setName(getText(1619, "")); // Producto
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PRODUCTOS_DE_COMPRA);
        elem.setKey(KI_PR_ID);
        if(Cairo.UserConfig.getMultiSelect()) {
          elem.setSelectType(Cairo.Select.SelectType.tree);
        }

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_CUE_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_CUE_ID_IVA_RI);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_CUE_ID_IVA_RNI);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(T.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setKey(KI_DESCRIP);

        elem = columns.add(null);
        elem.setName(getText(1374, "")); // Cantidad
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setKey(KI_CANTIDAD);

        elem.setDefaultValue(Dialogs.Grids.createCell());
        elem.getDefaultValue().setValue(1);

        elem = columns.add(null);
        elem.setName(getText(1639, "")); // Nro. Serie
        elem.setType(T.text);
        elem.setSubType(Dialogs.PropertySubType.textButton);
        elem.setKey(KI_NRO_SERIE);
        elem.setVisible(m_showStockData);

        elem = columns.add(null);
        elem.setName(getText(1640, "")); // Lote
        elem.setType(T.text);
        elem.setKey(KI_STL_CODIGO);
        elem.setVisible(m_showStockData);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_STL_ID);

        elem = columns.add(null);
        elem.setName(getText(1165, "")); // Unidad
        elem.setType(T.text);
        elem.setKey(KI_UNIDAD);
        elem.setEnabled(false);
        elem.setVisible(bColVisible);

        elem = columns.add(null);
        elem.setName(getText(1587, "")); // Precio (LP)
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KI_PRECIO_LP);
        elem.setEnabled(false);
        elem.setVisible(bColVisible);

        elem = columns.add(null);
        elem.setName(getText(1586, "")); // Precio
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KI_PRECIO_USR);

        elem = columns.add(null);
        elem.setName(getText(1585, "")); // Descuento
        elem.setType(T.text);
        elem.setKey(KI_DESCUENTO);
        elem.setEnabled(true);

        elem = columns.add(null);
        elem.setName(getText(1588, "")); // Precio c/desc.
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KI_PRECIO);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1581, "")); // Neto
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KI_NETO);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1582, "")); // IVA RI
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KI_IVA_RI);

        elem = columns.add(null);
        elem.setName(getText(1583, "")); // IVA RNI
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_IVA_RNI);
        elem.setEnabled(false);
        elem.setVisible(bColVisible);

        elem = columns.add(null);
        elem.setName(getText(4914, "")); // Internos
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_INTERNOS);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_IMPORTE);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_IVA_RI_PERCENT);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_IVA_RNI_PERCENT);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_INTERNOS_PERCENT);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_INTERNOS_PORC);

        elem = columns.add(null);
        elem.setName(getText(1057, "")); // Centro de Costo
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CENTROS_DE_COSTO);
        elem.setKey(Percepciones.KI_CCOS_ID);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PR_LLEVALOTE);

        elem = columns.add(null);
        elem.setName(getText(1661, "")); // Tipo Operación
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.TIPO_DE_OPERACION);
        elem.setDefaultValue(Grids.createCell());
        elem.getDefaultValue()
          .setId(D.Constants.TO_COMERCIAL_ID)
          .setValue(Cairo.Constants.TO_COMERCIAL);
        elem.setKey(KI_TO_ID);
        elem.setVisible(bColVisible);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PR_LLEVA_NRO_SERIE);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_GRUPO);

        grid.getRows().clear();
      };

      var loadItems = function(property, cotizacion) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        for(var _i = 0; _i < m_data.items.length; _i += 1) {

          var row = rows.add(null, getValue(m_data.items[_i], CC.FCI_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CC.FCI_ID));
          elem.setKey(KI_FCI_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], C.PR_NAME_COMPRA));
          elem.setId(getValue(m_data.items[_i], C.PR_ID));
          elem.setKey(KI_PR_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], C.CUE_ID));
          elem.setKey(KI_CUE_ID);

          elem = row.add(null);
          if(m_bIva) {
            elem.setValue(getValue(m_data.items[_i], C.CUE_ID_IVA_RI));
          }
          else {
            elem.setValue(NO_ID);
          }
          elem.setKey(KI_CUE_ID_IVA_RI);

          elem = row.add(null);
          if(m_bIvaRni) {
            elem.setValue(getValue(m_data.items[_i], C.CUE_ID_IVA_RNI));
          }
          else {
            elem.setValue(NO_ID);
          }
          elem.setKey(KI_CUE_ID_IVA_RNI);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CC.FCI_DESCRIP));
          elem.setKey(KI_DESCRIP);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CC.FCI_CANTIDAD));
          elem.setKey(KI_CANTIDAD);

          elem = row.add(null);
          elem.setValue("");
          elem.setKey(KI_NRO_SERIE);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], C.STL_CODE));
          elem.setKey(KI_STL_CODIGO);

          elem = row.add(null);
          elem.setId(getValue(m_data.items[_i], C.STL_ID));
          elem.setKey(KI_STL_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], C.UN_NAME));
          elem.setKey(KI_UNIDAD);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CC.FCI_PRECIO_LISTA) / cotizacion);
          elem.setKey(KI_PRECIO_LP);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CC.FCI_PRECIO_USR) / cotizacion);
          elem.setKey(KI_PRECIO_USR);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CC.FCI_DESCUENTO));
          elem.setKey(KI_DESCUENTO);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CC.FCI_PRECIO) / cotizacion);
          elem.setKey(KI_PRECIO);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CC.FCI_NETO) / cotizacion);
          elem.setKey(KI_NETO);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CC.FCI_IVA_RI) / cotizacion);
          elem.setKey(KI_IVA_RI);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CC.FCI_IVA_RNI) / cotizacion);
          elem.setKey(KI_IVA_RNI);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CC.FCI_INTERNOS) / cotizacion);
          elem.setKey(KI_INTERNOS);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CC.FCI_IMPORTE) / cotizacion);
          elem.setKey(KI_IMPORTE);

          elem = row.add(null);
          if(m_bIva) {
            elem.setValue(getValue(m_data.items[_i], "iva_ri_porcentaje"));
          }
          else {
            elem.setValue(0);
          }
          elem.setKey(KI_IVA_RI_PERCENT);

          elem = row.add(null);
          if(m_bIvaRni) {
            elem.setValue(getValue(m_data.items[_i], "iva_rni_porcentaje"));
          }
          else {
            elem.setValue(0);
          }
          elem.setKey(KI_IVA_RNI_PERCENT);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], "internos_porcentaje"));
          elem.setKey(KI_INTERNOS_PERCENT);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], C.PR_PORC_INTERNO_C));
          elem.setKey(KI_INTERNOS_PORC);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], C.CCOS_NAME));
          elem.setId(getValue(m_data.items[_i], C.CCOS_ID));
          elem.setKey(Percepciones.KI_CCOS_ID);

          elem = row.add(null);
          elem.setId(getValue(m_data.items[_i], C.PR_LLEVA_NRO_LOTE));
          elem.setKey(KI_PR_LLEVALOTE);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], C.TO_NAME));
          elem.setId(getValue(m_data.items[_i], C.TO_ID));
          elem.setKey(KI_TO_ID);

          elem = row.add(null);
          if(m_showStockData) {
            elem.setId(getValue(m_data.items[_i], C.PR_LLEVA_NRO_SERIE));
          }
          else {
            elem.setId(false);
          }
          elem.setKey(KI_PR_LLEVA_NRO_SERIE);

          elem = row.add(null);
          elem.setId(getValue(m_data.items[_i], CC.FCI_ID));
          elem.setKey(KI_GRUPO);
        }

        var serialNumber;
        var curGroup = "";
        var coll = null;
        var serialNumbers = "";

        m_serialNumbers.clear();

        for(var _i = 0; _i < m_data.serialNumbers.length; _i += 1) {

          // check if the group has changed
          // 
          if(curGroup !== getValue(m_data.serialNumbers[_i], CC.FCI_ID)) {

            setSerialNumberInRow(curGroup, serialNumbers);
            serialNumbers = "";

            curGroup = getValue(m_data.serialNumbers[_i], CC.FCI_ID);
            coll = Cairo.Collections.createCollection(Cairo.SerialNumber.create);
            m_serialNumbers.add(coll, Cairo.Collections.getKey(curGroup));
          }

          serialNumber = coll.add(null);
          serialNumber.setCode(getValue(m_data.serialNumbers[_i], CC.PRNS_CODE));
          serialNumber.setDescrip(getValue(m_data.serialNumbers[_i], CC.PRNS_DESCRIP));
          serialNumber.setFechaVto(getValue(m_data.serialNumbers[_i], CC.PRNS_FECHA_VTO));
          serialNumber.setPrnsId(getValue(m_data.serialNumbers[_i], CC.PRNS_ID));

          serialNumbers = serialNumbers + serialNumber.getCode() + ",";

          coll.add(serialNumber, Cairo.Collections.getKey(serialNumber.getPrnsId()));
        }

        setSerialNumberInRow(curGroup, serialNumbers);
      };

      var setGridPercepciones = function(property) {

        var grid = property.getGrid();
        grid.getColumns().clear();
        grid.getRows().clear();

        Percepciones.loadPercepciones(property.getGrid(), Cairo.Settings);

        property.getGrid().getRows().clear();
      };

      var loadPercepciones = function(property, cotizacion) {

        var elem;
        var rows = property.getGrid().getRows();

        for(var _i = 0; _i < m_data.percepciones.length; _i += 1) {

          var row = rows.add(null, getValue(m_data.percepciones[_i], CC.FCPERC_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.percepciones[_i], CC.FCPERC_ID));
          elem.setKey(Percepciones.KIP_FCPERC_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.percepciones[_i], C.PERC_NAME));
          elem.setId(getValue(m_data.percepciones[_i], C.PERC_ID));
          elem.setKey(Percepciones.KIP_PERC_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.percepciones[_i], CC.FCPERC_BASE) / cotizacion);
          elem.setKey(Percepciones.KIP_BASE);

          elem = row.add(null);
          elem.setValue(getValue(m_data.percepciones[_i], CC.FCPERC_PORCENTAJE));
          elem.setKey(Percepciones.KIP_PORCENTAJE);

          elem = row.add(null);
          elem.setValue(getValue(m_data.percepciones[_i], CC.FCPERC_IMPORTE) / cotizacion);
          elem.setKey(Percepciones.KIP_IMPORTE);

          elem = row.add(null);
          elem.setValue(getValue(m_data.percepciones[_i], CC.FCPERC_DESCRIP));
          elem.setKey(Percepciones.KIP_DESCRIP);

          elem = row.add(null);
          elem.setValue(getValue(m_data.percepciones[_i], C.CCOS_NAME));
          elem.setId(getValue(m_data.percepciones[_i], C.CCOS_ID));
          elem.setKey(Percepciones.KI_CCOS_ID);
        }
      };

      var setGridLegajos = function(property) {

        var elem;
        var grid = property.getGrid();
        var columns = grid.getColumns();

        columns.clear();

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIL_FCLGJ_ID);

        elem = columns.add(null);
        elem.setName(getText(1575, "")); // Legajo
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LEGAJOS);
        elem.setKey(KIL_LGJ_ID);

        elem = columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KIL_IMPORTE);

        elem = columns.add(null);
        elem.setName(getText(1861, "")); // Observaciones
        elem.setType(T.text);
        elem.setKey(KIL_DESCRIP);

        grid.getRows().clear();

      };

      var loadLegajos = function(property, cotizacion) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        for(var _i = 0; _i < m_data.legajos.length; _i += 1) {

          var row = rows.add(null, getValue(m_data.legajos[_i], CC.FCLGJ_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.legajos[_i], CC.FCLGJ_ID));
          elem.setKey(KIL_FCLGJ_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.legajos[_i], CC.LGJ_CODE));
          elem.setId(getValue(m_data.legajos[_i], CC.LGJ_ID));
          elem.setKey(KIL_LGJ_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.legajos[_i], CC.FCLGJ_IMPORTE) / cotizacion);
          elem.setKey(KIL_IMPORTE);

          elem = row.add(null);
          elem.setValue(getValue(m_data.legajos[_i], CC.FCLGJ_DESCRIP));
          elem.setKey(KIL_DESCRIP);
        }
      };

      var setGridOtros = function(property) {

        var elem;
        var grid = property.getGrid();
        grid.getColumns().clear();
        grid.getRows().clear();

        var columns = grid.getColumns();
        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_FCOT_ID);

        elem = columns.add(null);
        elem.setName(getText(1267, "")); // Cuenta
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setKey(KI_CUE_ID);
        elem.setSelectFilter(D.getSelectFilterForCuenta);

        elem = columns.add(null);
        elem.setName(getText(1904, "")); // Debe
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KI_DEBE);

        elem = columns.add(null);
        elem.setName(getText(1905, "")); // Haber
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_HABER);

        elem = columns.add(null);
        elem.setName(getText(1861, "")); // Observaciones
        elem.setType(T.text);
        elem.setKey(KI_DESCRIP);

        elem = columns.add(null);
        elem.setName(getText(1057, "")); // Centro de Costo
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CENTROS_DE_COSTO);
        elem.setKey(Percepciones.KI_CCOS_ID);

        grid.getRows().clear();
      };

      var loadOtros = function(property, cotizacion) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        for(var _i = 0; _i < m_data.otros.length; _i += 1) {

          var row = rows.add(null, getValue(m_data.otros[_i], C.FCOT_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.otros[_i], C.FCOT_ID));
          elem.setKey(KI_FCOT_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.otros[_i], C.CUE_NAME));
          elem.setId(getValue(m_data.otros[_i], C.CUE_ID));
          elem.setKey(KI_CUE_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.otros[_i], C.FCOT_DEBE) / cotizacion);
          elem.setKey(KI_DEBE);

          elem = row.add(null);
          elem.setValue(getValue(m_data.otros[_i], C.FCOT_HABER) / cotizacion);
          elem.setKey(KI_HABER);

          elem = row.add(null);
          elem.setValue(getValue(m_data.otros[_i], C.FCOT_DESCRIP));
          elem.setKey(KI_DESCRIP);

          elem = row.add(null);
          elem.setValue(getValue(m_data.otros[_i], C.CCOS_NAME));
          elem.setId(getValue(m_data.otros[_i], C.CCOS_ID));
          elem.setKey(Percepciones.KI_CCOS_ID);
        }

        return true;
      };

      var setSerialNumberInRow = function(currGroup, nroSerie) {

        if(currGroup === 0) { return; }

        var rows = getGrid(m_items, C_ITEMS).getRows();

        var _count = rows.size();
        for(var _i = 0; _i < _count; _i++) {

          var row = rows.item(_i);
          if(cellId(row, KI_GRUPO) === currGroup) {
            getCell(row, KI_NRO_SERIE).setValue(Cairo.Util.removeLastColon(nroSerie));
            return;
          }
        }
      };

      var loadDataFromResponse = function(response) {
        var data = response.data;

        data.items = data.get('items');
        data.otros = data.get('otros');
        data.percepciones = data.get('percepciones');
        data.legajos = data.get('legajos');
        data.serialNumbers = data.get('serialNumbers');

        return data;
      };

      var load = function(id) {

        m_data = emptyData;

        var cotizacion = 0;

        return DB.getData("load[" + m_apiPath + "compras/facturacompra]", id).then(
          function(response) {

            var p = null;

            m_lastCpgId = -1;

            if(response.success !== true) { return false; }

            if(response.data.id !== NO_ID) {

              m_data = loadDataFromResponse(response);

              var data = response.data;

              m_cotizacion = valField(data, CC.FC_COTIZACION);
              cotizacion = (m_cotizacion !== 0) ? m_cotizacion : 1;

              m_id = valField(data, CC.FC_ID);
              m_numero = valField(data, CC.FC_NUMERO);
              m_nrodoc = valField(data, CC.FC_NRODOC);
              m_descrip = valField(data, CC.FC_DESCRIP);
              m_fecha = valField(data, CC.FC_FECHA);
              m_fechaentrega = valField(data, CC.FC_FECHA_ENTREGA);
              m_fechaVto = valField(data, CC.FC_FECHA_VTO);
              m_fechaIva = valField(data, CC.FC_FECHA_IVA);
              m_neto = valField(data, CC.FC_NETO) / cotizacion;
              m_ivari = valField(data, CC.FC_IVA_RI) / cotizacion;
              m_ivarni = valField(data, CC.FC_IVA_RNI) / cotizacion;
              m_internos = valField(data, CC.FC_INTERNOS) / cotizacion;
              m_total = valField(data, CC.FC_TOTAL) / cotizacion;
              m_totalOtros = valField(data, CC.FC_TOTAL_OTROS) / cotizacion;
              m_totalPercepciones = valField(data, CC.FC_TOTAL_PERCEPCIONES) / cotizacion;
              m_subTotal = valField(data, CC.FC_SUBTOTAL) / cotizacion;
              m_descuento1 = valField(data, CC.FC_DESCUENTO1);
              m_descuento2 = valField(data, CC.FC_DESCUENTO2);
              m_importeDesc1 = valField(data, CC.FC_IMPORTE_DESC_1) / cotizacion;
              m_importeDesc2 = valField(data, CC.FC_IMPORTE_DESC_2) / cotizacion;
              m_prov_id = valField(data, C.PROV_ID);
              m_proveedor = valField(data, C.PROV_NAME);
              m_ccos_id = valField(data, C.CCOS_ID);
              m_centroCosto = valField(data, C.CCOS_NAME);
              m_suc_id = valField(data, C.SUC_ID);
              m_sucursal = valField(data, C.SUC_NAME);
              m_doc_id = valField(data, C.DOC_ID);
              m_documento = valField(data, C.DOC_NAME);
              m_doct_id = valField(data, C.DOCT_ID);
              m_showStockData = valField(data, C.DOC_MUEVE_STOCK)
              m_lp_id = valField(data, C.LP_ID);
              m_listaPrecio = valField(data, C.LP_NAME);
              m_cpg_id = valField(data, C.CPG_ID);
              m_condicionPago = valField(data, C.CPG_NAME);
              m_ld_id = valField(data, C.LD_ID);
              m_listaDescuento = valField(data, C.LD_NAME);
              m_lgj_id = valField(data, CC.LGJ_ID);
              m_legajo = valField(data, CC.LGJ_CODE);
              m_cai = valField(data, CC.FC_CAI);
              m_pro_id_origen = valField(data, CC.PRO_ID_ORIGEN);
              m_proOrigen = valField(data, "ProOrigen");
              m_pro_id_destino = valField(data, CC.PRO_ID_DESTINO);
              m_proDestino = valField(data, "ProDestino");
              m_est_id = valField(data, C.EST_ID);
              m_estado = valField(data, C.EST_NAME);
              m_firmado = valField(data, CC.FC_FIRMADO);
              m_mon_id = valField(data, C.MON_ID);

              m_docEditable = valField(data, C.DOC_EDITABLE);
              m_docEditMsg = valField(data, C.DOC_EDIT_MSG);

              m_depl_id = valField(data, C.DEPL_ID);
              m_deposito = valField(data, C.DEPL_NAME);

              m_tipoComprobante = valField(data, CC.FC_TIPO_COMPROBANTE);

              m_bIva = valField(data, C.HAS_IVA_RI);
              m_bIvaRni = valField(data, C.HAS_IVA_RNI);

              m_cotizacionProv = valField(data, CC.FC_COTIZACION_PROV);

              m_as_id = valField(data, CC.AS_ID);
              m_st_id = valField(data, CC.ST_ID);

              m_taMascara = valField(data, C.TA_MASCARA);
              m_taPropuesto = valField(data, C.TA_PROPUESTO);

              m_lastDocId = m_doc_id;
              m_lastMonId = m_mon_id;
              m_lastDoctId = m_doct_id;
              m_lastDocTipoFactura = valField(data, C.DOC_TIPO_FACTURA);
              m_lastProvId = m_prov_id;
              m_lastDocName = m_documento;
              m_lastProvName = m_proveedor;

              m_lastMonIdCotizacion = m_mon_id;
              m_lastFecha = m_fecha;

            }
            else {
              m_id = NO_ID;
              m_numero = 0;
              m_nrodoc = "";
              m_descrip = "";
              m_fecha = Cairo.Dates.today();
              m_fechaentrega = Cairo.Dates.tomorrow();
              m_fechaVto = Cairo.Constants.NO_DATE;
              m_fechaIva = m_fecha;
              m_neto = 0;
              m_ivari = 0;
              m_ivarni = 0;
              m_internos = 0;
              m_total = 0;
              m_totalOtros = 0;
              m_totalPercepciones = 0;
              m_subTotal = 0;
              m_descuento1 = 0;
              m_descuento2 = 0;
              m_importeDesc1 = 0;
              m_importeDesc2 = 0;
              m_ccos_id = NO_ID;
              m_centroCosto = "";
              m_lp_id = NO_ID;
              m_ld_id = NO_ID;
              m_cpg_id = NO_ID;
              m_lgj_id = NO_ID;
              m_legajo = "";
              m_cai = "";
              m_pro_id_origen = NO_ID;
              m_proOrigen = "";
              m_pro_id_destino = NO_ID;
              m_proDestino = "";
              m_condicionPago = "";
              m_listaPrecio = "";
              m_listaDescuento = "";
              m_cotizacion = 0;
              m_est_id = NO_ID;
              m_estado = "";
              m_suc_id = Cairo.User.getSucId();
              m_sucursal = Cairo.User.getSucName();
              m_firmado = false;

              m_depl_id = NO_ID;
              m_deposito = "";

              m_tipoComprobante = D.ReceiptType.original;

              m_doc_id = m_lastDocId;
              m_mon_id = m_lastMonId;
              m_doct_id = m_lastDoctId;
              m_prov_id = m_lastProvId;
              m_proveedor = m_lastProvName;
              m_documento = m_lastDocName;

              m_cotizacionProv = 0;

              m_as_id = NO_ID;
              m_st_id = NO_ID;

              m_taMascara = "";
              m_taPropuesto = false;

              m_bIvaRni = false;
              m_bIva = false;

              if(m_lastMonIdCotizacion !== m_lastMonId) {
                m_lastMonIdCotizacion = NO_ID;
              }

              m_lastFecha = Cairo.Constants.NO_DATE;

              if(m_lastMonId === m_defaultCurrency) {
                m_cotizacion = 0;
                m_lastMonIdCotizacion = m_lastMonId;
              }
              else {
                if(m_doc_id !== NO_ID && m_lastMonIdCotizacion === NO_ID) {
                  p = D.getCurrencyRate(m_lastMonId, m_fecha).then(function(rate) {
                    m_cotizacion = rate;
                  });
                }
              }

              p = p || P.resolvedPromise();

              p = p
                .then(P.call(D.editableStatus, m_doc_id, CS.NEW_FACTURA))
                .then(function(status) {
                  m_docEditable = status.editableStatus;
                  m_docEditMsg = status.message;
                  return true;
                });
            }

            return p || P.resolvedPromise(true);
          });
      };

      self.setFooter = function(footer) {
        m_footer = footer;
        m_footerProps = footer.getProperties();

        if(footer !== null) {
          m_footer.setIsDocument(true);
          m_footer.setIsFooter(true);
          m_footer.setView(m_dialog.getView());
        }
      };

      self.setItems = function(items) {
        m_items = items;
        m_itemsProps = m_items.getProperties();

        if(items !== null) {
          m_items.setIsDocument(true);
          m_items.setIsItems(true);
          m_items.setView(m_dialog.getView());
        }
      };

      var saveItems = function(mainRegister, cotizacion, isDefaultCurrency) {

        var transaction = new DB.Transaction();
        var orden = 0;
        var origen = 0;
        var neto = 0;
        var ivaRi = 0;
        var ivaRni = 0;
        var internos = 0;

        var order = { n: 0 };
        var grupo = 0;
        var prId = 0;

        var _count = getGrid(m_items, C_ITEMS).getRows().size();
        for(var _i = 0; _i < _count; _i++) {

          var row = getGrid(m_items, C_ITEMS).getRows().item(_i);

          var register = new DB.Register();
          register.setFieldId(CC.FCI_TMPID);
          register.setTable(C.FACTURA_COMPRA_ITEM_TMP);
          register.setId(Cairo.Constants.NEW_ID);

          var fields = register.getFields();

          var _count = row.size();
          for(var _j = 0; _j < _count; _j++) {

            var cell = row.item(_j);
            switch (cell.getKey()) {

              case KI_FCI_ID:
                register.setPath(m_apiPath + "compras/facturacompra");

                if(m_copy) {
                  fields.add(CC.FCI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(CC.FCI_ID, val(cell.getValue()), Types.integer);
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
                fields.add(CC.FCI_PRECIO, val(cell.getValue()) * cotizacion, Types.currency);
                break;

              case KI_PRECIO_LP:
                fields.add(CC.FCI_PRECIO_LISTA, val(cell.getValue()) * cotizacion, Types.currency);
                break;

              case KI_PRECIO_USR:
                fields.add(CC.FCI_PRECIO_USR, val(cell.getValue()) * cotizacion, Types.currency);
                break;

              case KI_NETO:
                neto = val(cell.getValue());
                fields.add(CC.FCI_NETO, neto * cotizacion, Types.currency);
                break;

              case KI_IVA_RI:
                if(m_bIva) {
                  ivaRi = val(cell.getValue());
                  fields.add(CC.FCI_IVA_RI, ivaRi * cotizacion, Types.currency);
                }
                break;

              case KI_IVA_RNI:
                if(m_bIvaRni) {
                  ivaRni = val(cell.getValue());
                  fields.add(CC.FCI_IVA_RNI, ivaRni * cotizacion, Types.currency);
                }
                break;

              case KI_INTERNOS:
                internos = val(cell.getValue());
                fields.add(CC.FCI_INTERNOS, internos * cotizacion, Types.currency);
                break;

              case KI_IVA_RI_PERCENT:
                fields.add(CC.FCI_IVA_RIPORC, cell.getValue(), Types.double);
                break;

              case KI_IVA_RNI_PERCENT:
                fields.add(CC.FCI_IVA_RNIPORC, cell.getValue(), Types.double);
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
                break;

              case KI_TO_ID:
                fields.add(C.TO_ID, cell.getId(), Types.id);
                break;

              case KI_CUE_ID:
                fields.add(C.CUE_ID, val(cell.getValue()), Types.id);
                break;

              case KI_CUE_ID_IVA_RI:
                fields.add(C.CUE_ID_IVA_RI, val(cell.getValue()), Types.id);
                break;

              case KI_CUE_ID_IVA_RNI:
                fields.add(C.CUE_ID_IVA_RNI, val(cell.getValue()), Types.id);
                break;

              case KI_GRUPO:
                grupo = cell.getId();
                break;

              case KI_STL_CODIGO:
                fields.add(C.STL_CODE, cell.getValue(), Types.text);
                break;

              case KI_STL_ID:
                fields.add(C.STL_ID, cell.getId(), Types.id);
                break;
            }
          }

          origen = neto;
          if(m_bIva) {
            origen = origen + ivaRi;
          }
          if(m_bIvaRni) {
            origen = origen + ivaRni;
          }

          origen = origen + internos;

          fields.add(CC.FCI_IMPORTE, origen * cotizacion, Types.currency);
          if(isDefaultCurrency) {
            fields.add(CC.FCI_IMPORTE_ORIGEN, 0, Types.currency);
          }
          else {
            fields.add(CC.FCI_IMPORTE_ORIGEN, origen, Types.currency);
          }

          orden = orden + 1;
          fields.add(CC.FCI_ORDEN, orden, Types.integer);

          transaction.addRegister(register);

          if(grupo === 0) { grupo = orden * -1; }

          saveItemNroSerie(mainRegister, row, order, prId, grupo);
        }

        if(m_itemsDeleted !== "" && m_id !== NO_ID && !m_copy) {

          transaction.setDeletedList(m_itemsDeleted)
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveOtros = function(mainRegister, cotizacion, isDefaultCurrency) {

        var transaction = new DB.Transaction();
        var orden = 0;
        var origen = 0;
        var property = m_itemsProps.item(C_OTROS);

        var _count = property.getGrid().getRows().size();
        for(var _i = 0; _i < _count; _i++) {

          var row = property.getGrid().getRows().item(_i);

          var register = new DB.Register();
          register.setFieldId(C.FCOT_TMPID);
          register.setTable(C.FACTURA_COMPRA_OTRO_TMP);
          register.setId(Cairo.Constants.NEW_ID);

          var fields = register.getFields();

          var _count = row.size();
          for(var _j = 0; _j < _count; _j++) {

            var cell = row.item(_j);

            switch (cell.getKey()) {

              case KI_FCOT_ID:
                if(m_copy) {
                  fields.add(C.FCOT_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(C.FCOT_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KI_CUE_ID:
                fields.add(C.CUE_ID, cell.getId(), Types.id);
                break;

              case KI_DEBE:
                if(val(cell.getValue()) > 0) { origen = val(cell.getValue()); }
                fields.add(C.FCOT_DEBE, val(cell.getValue()) * cotizacion, Types.currency);
                break;

              case KI_HABER:
                if(val(cell.getValue()) > 0) { origen = val(cell.getValue()); }
                fields.add(C.FCOT_HABER, val(cell.getValue()) * cotizacion, Types.currency);
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

          orden = orden + 1;
          fields.add(C.FCOT_ORDEN, orden, Types.integer);

          transaction.addRegister(register);
        }

        if(m_otrosDeleted !== "" && m_id !== NO_ID && !m_copy) {

          transaction.setDeletedList(m_otrosDeleted)
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveLegajos = function(mainRegister, cotizacion, isDefaultCurrency) {

        var transaction = new DB.Transaction();
        var orden = 0;
        var origen = 0;

        var property = m_itemsProps.item(C_LEGAJOS);

        var _count = property.getGrid().getRows().size();
        for(var _i = 0; _i < _count; _i++) {

          var row = property.getGrid().getRows().item(_i);

          var register = new DB.Register();
          register.setFieldId(CC.FCLGJ_TMPID);
          register.setTable(C.FACTURA_COMPRA_LEGAJO_TMP);
          register.setId(Cairo.Constants.NEW_ID);

          var fields = register.getFields();

          var _count = row.size();
          for(var _j = 0; _j < _count; _j++) {

            var cell = row.item(_j);

            switch (cell.getKey()) {

              case KIL_FCLGJ_ID:
                if(m_copy) {
                  fields.add(CC.FCLGJ_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(CC.FCLGJ_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KIL_LGJ_ID:
                fields.add(CC.LGJ_ID, cell.getId(), Types.id);
                break;

              case KIL_IMPORTE:
                origen = val(cell.getValue());
                fields.add(CC.FCLGJ_IMPORTE, origen * cotizacion, Types.currency);
                break;

              case Percepciones.KI_CCOS_ID:
                fields.add(C.CCOS_ID, cell.getId(), Types.id);
                break;

              case KIL_DESCRIP:
                fields.add(CC.FCLGJ_DESCRIP, cell.getValue(), Types.text);
                break;
            }
          }

          if(isDefaultCurrency) {
            fields.add(CC.FCLGJ_IMPORTE_ORIGEN, 0, Types.currency);
          }
          else {
            fields.add(CC.FCLGJ_IMPORTE_ORIGEN, origen, Types.currency);
          }

          orden = orden + 1;
          fields.add(CC.FCLGJ_ORDEN, orden, Types.integer);

          transaction.addRegister(register);
        }


        if(m_legajosDeleted !== "" && m_id !== NO_ID && !m_copy) {

          transaction.setDeletedList(m_legajosDeleted)
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var docAsistTipo = function() {
        return m_lastDocTipoFactura;
      };

      var docDesdeOrden = function() {
        return docAsistTipo() === D.InvoiceWizardType.orden;
      };

      var docDesdeRemito = function() {
        return docAsistTipo() === D.InvoiceWizardType.remito;
      };

      var showImporteAndIva = function(row) {
        var ivaRi = 0;
        var ivaRni = 0;

        applyDescuentos(row);

        var neto = cellFloat(row, KI_CANTIDAD) * cellFloat(row, KI_PRECIO);
        if(m_bIva) {
          ivaRi = (neto * cellFloat(row, KI_IVA_RI_PERCENT)) / 100;
        }
        if(m_bIvaRni) {
          ivaRni = (neto * cellFloat(row, KI_IVA_RNI_PERCENT)) / 100;
        }

        var internos = (neto * (cellFloat(row, KI_INTERNOS_PORC) / 100) * cellFloat(row, KI_INTERNOS_PERCENT)) / 100;
        var importe = neto + ivaRi + ivaRni + internos;

        getCell(row, KI_NETO).setValue(neto);
        getCell(row, KI_IVA_RI).setValue(ivaRi);
        getCell(row, KI_IVA_RNI).setValue(ivaRni);
        getCell(row, KI_INTERNOS).setValue(internos);
        getCell(row, KI_IMPORTE).setValue(importe);
      };

      var applyDescuentos = function(row) {

        var desc = cellVal(row, KI_DESCUENTO);
        var precio = cellFloat(row, KI_PRECIO_USR);

        if(desc !== "") {

          var desc = desc.split("+");

          for(var i = 0, count = desc.length; i < count; i++) {
            precio = precio - (precio * val(desc(i)) / 100);
          }
        }

        getCell(row, KI_PRECIO).setValue(precio);
      };

      var showImporteAndIvaManual = function(row) {
        applyDescuentos(row);

        var neto = cellFloat(row, KI_CANTIDAD) * cellFloat(row, KI_PRECIO);
        var ivaRi = cellVal(row, KI_IVA_RI);

        var ivaRni = 0;
        if(m_bIvaRni) {
          ivaRni = (neto * cellFloat(row, KI_IVA_RNI_PERCENT)) / 100;
        }

        var internos = (neto * (cellFloat(row, KI_INTERNOS_PORC) / 100) * cellFloat(row, KI_INTERNOS_PERCENT)) / 100;
        var importe = neto + ivaRi + ivaRni + internos;

        getCell(row, KI_NETO).setValue(neto);
        getCell(row, KI_IVA_RNI).setValue(ivaRni);
        getCell(row, KI_INTERNOS).setValue(internos);
        getCell(row, KI_IMPORTE).setValue(importe);
      };

      var updateTotals = function() {

        var rows = getGrid(m_items, C_ITEMS).getRows();
        var rowsOtros = getGrid(m_items, C_OTROS).getRows();
        var rowsPercep = getGrid(m_items, C_PERCEPCIONES).getRows();

        var neto = 0;
        var ivaRi = 0;
        var ivaRni = 0;
        var internos = 0;

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {
          var row = rows.item(_i);
          neto = neto + cellFloat(row, KI_NETO);
          ivaRi = ivaRi + cellFloat(row, KI_IVA_RI);
          ivaRni = ivaRni + cellFloat(row, KI_IVA_RNI);
          internos = internos + cellFloat(row, KI_INTERNOS);
        }

        var otros = 0;

        for(var _i = 0, _count = rowsOtros.size(); _i < _count; _i++) {
          row = rowsOtros.item(_i);
          otros = otros + cellFloat(row, KI_DEBE) - cellFloat(row, KI_HABER);
        }

        var percep = 0;

        for(var _i = 0, _count = rowsPercep.size(); _i < _count; _i++) {
          row = rowsPercep.item(_i);
          percep = percep + cellFloat(row, Percepciones.KIP_IMPORTE);
        }

        var properties = m_footerProps;
        properties.item(CC.FC_SUBTOTAL).setValue(neto);

        var desc1 = m_properties.item(CC.FC_DESCUENTO1).getValue();
        var desc2 = m_properties.item(CC.FC_DESCUENTO2).getValue();

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

        properties.item(CC.FC_INTERNOS).setValue(internos);
        properties.item(CC.FC_TOTAL_OTROS).setValue(otros);
        properties.item(CC.FC_TOTAL_PERCEPCIONES).setValue(percep);
        properties.item(CC.FC_TOTAL).setValue(neto + ivaRni + ivaRi + otros + percep + internos);

        m_footer.refreshControls();
      };

      var setTasasImpositivas = function(row, prId, pr_nombre) {
        var p = null;

        if(prId !== 0) {

        p = D.getTasaFromProducto(prId, true).successWithResult(function(data) {

          if(data.ti_ri === 0) {
            return M.showWarningWithFalse(getText(1597, "", pr_nombre));
            // El producto [" & pr_nombre & "] no tiene definida su tasa impositiva de Compras para el iva responsable inscripto
          }

          if(data.ti_rni === 0) {
            return M.showWarningWithFalse(getText(1598, "", pr_nombre));
            // El producto [" & pr_nombre & "] no tiene definida su tasa impositiva de Compras para el iva responsable no inscripto
          }

          if(m_bIva) {
            getCell(row, KI_IVA_RI_PERCENT).setValue(data.ri_percent);
            getCell(row, KI_CUE_ID_IVA_RI).setValue(data.ri_cue_id);
          }
          else {
            getCell(row, KI_IVA_RI_PERCENT).setValue(0);
            getCell(row, KI_CUE_ID_IVA_RI).setValue(NO_ID);
          }

          if(m_bIvaRni) {
            getCell(row, KI_IVA_RNI_PERCENT).setValue(data.rni_percent);
            getCell(row, KI_CUE_ID_IVA_RNI).setValue(data.rni_cue_id);
          }
          else {
            getCell(row, KI_IVA_RNI_PERCENT).setValue(0);
            getCell(row, KI_CUE_ID_IVA_RNI).setValue(NO_ID);
          }

          getCell(row, KI_INTERNOS_PERCENT).setValue(data.int_percent);
          getCell(row, KI_INTERNOS_PORC).setValue(data.porc_internos);

          return true;

        });

        }
        return p || P.resolvedPromise(false);
      };

      var setDataProducto = function(row, prId) {

        var bChanged = prId !== cellId(row, KI_PR_ID);

        var apiPath = DB.getAPIVersion();
        var p = DB.getData(
          "load[" + apiPath + "general/producto/" + prId.toString() + "/stock/proveedor]", getProvId());

        return p.successWithResult(function(response) {
          getCell(row, KI_UNIDAD).setValue(valField(response.data, "unidadCompra"));

          var cell = getCell(row, Percepciones.KI_CCOS_ID);
          cell.setValue(valField(response.data, "centro_costo_compra"));
          cell.setId(valField(response.data, C.CCOS_ID_COMPRA));

          getCell(row, KI_CUE_ID).setValue(valField(response.data, C.CUE_ID_COMPRA));

          // serial numbers are required only if the document generates an stock transaction
          // 
          if(m_showStockData) {
            getCell(row, KI_PR_LLEVA_NRO_SERIE).setId(valField(response.data, C.PR_LLEVA_NRO_SERIE));
            getCell(row, KI_PR_LLEVALOTE).setId(valField(response.data, C.PR_LLEVA_NRO_LOTE));
          }
          else {
            getCell(row, KI_PR_LLEVA_NRO_SERIE).setId(0);
            getCell(row, KI_PR_LLEVALOTE).setId(0);
          }

          // if the product has changed we remove all serial numbers
          // 
          if(bChanged || cellId(row, KI_PR_LLEVA_NRO_SERIE) === 0) {

            getCell(row, KI_NRO_SERIE).setValue("");
            if(m_serialNumbers.contains(Cairo.Collections.getKey(cellId(row, KI_GRUPO)))) {

              m_serialNumbers.remove(Cairo.Collections.getKey(cellId(row, KI_GRUPO)));
            }
          }

          return true;
        });
      };

      var setPrecios = function(row, prId) {
        var p;
        var lpId = m_properties.item(C.LP_ID).getSelectId();
        var price = 0;

        if(lpId !== NO_ID) {

          var apiPath = DB.getAPIVersion();
          p = DB.getData(
            "load[" + apiPath + "general/producto/" + prId.toString() + "/price]", lpId);

          p = p.successWithResult(function(response) {
            price = valField(response.data, 'price');
            return true;
          });
        }

        p = p || P.resolvedPromise();

        return p.then(function() {
          getCell(row, KI_PRECIO_LP).setValue(price);
          getCell(row, KI_PRECIO_USR).setValue(price);
          return true;
        });
      };

      var setDescuentos = function(row, prId, precio) {
        var p;
        var ldId = m_properties.item(C.LD_ID).getSelectId();
        var desc;

        if(ldId !== NO_ID) {

          var apiPath = DB.getAPIVersion();
          p = DB.getData(
            "load[" + apiPath + "general/producto/" + prId.toString() + "/discount]", ldId);

          p = p.successWithResult(function(response) {
            desc = valField(response.data, 'desc');
            desc = desc.replace(/\$/g, "").replace(/%/g, "");
            return true;
          }).then(function() {
            getCell(row, KI_DESCUENTO).setValue(desc);
            return true;
          });
        }
        return p || P.resolvedPromise(true);
      };

      var setEnabled = function() {
        var bState = false;

        // when the document requires base document like a purchase order or a delivery note
        // it can't be edited. the user must click the new button and use the wizard.
        // 
        if(docDesdeOrden() && m_id === NO_ID) {
          bState = false;
        }
        else if(docDesdeRemito() && m_id === NO_ID) {
          bState = false;
        }
        else if(m_docEditable) {
          bState = getDocId().getSelectId() !== NO_ID;
        }
        else {
          bState = false;
        }

        setEnabledAux(bState);
      };

      var setEnabledAux = function(bState) {
        var prop = null;

        var _count = m_properties.size();
        for(var _i = 0; _i < _count; _i++) {
          prop = m_properties.item(_i);
          if(prop.getKey() !== K_DOC_ID
            && prop.getKey() !== K_NUMERO
            && prop.getKey() !== K_EST_ID
            && prop.getKey() !== K_HIDECOLS) {

            if(bState) {
              if(prop.getKey() !== K_NRODOC) {
                prop.setEnabled(true);
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
          var properties = m_properties;
          properties.item(CC.DEPL_ID_ORIGEN).setEnabled(m_showStockData);
        }

        var _count = m_itemsProps.size();
        for(var _i = 0; _i < _count; _i++) {
          prop = m_itemsProps.item(_i);
          prop.setEnabled(bState);
        }

        m_items.refreshEnabledState(m_itemsProps);
        m_dialog.refreshEnabledState(m_properties);
      };

      var setDatosProveedor = function() {
        var p;
        var property = m_properties.item(C.PROV_ID);

        if(m_lastProvId !== property.getSelectId()) {

          m_lastProvId = property.getSelectId();

          var apiPath = DB.getAPIVersion();
          p = DB.getData(
            "load[" + apiPath + "general/proveedor/" + m_lastProvId.toString() + "/info]", m_lastDocId);

          p = p.successWithResult(function(response) {

            var lp_id = valField(response.data, C.LP_ID);
            var lp_name = valField(response.data, C.LP_NAME);
            var ld_id = valField(response.data, C.LD_ID);
            var ld_name = valField(response.data, C.LD_NAME);
            var cpg_id = valField(response.data, C.CPG_ID);
            var lp_filter = D.getListaPrecioForProveedor(m_doc_id, m_prov_id);
            var ld_filter = D.getListaDescuentoForProveedor(m_doc_id, m_prov_id);

            if(cpg_id !== NO_ID) {

              var cpg_name = valField(response.data, C.CPG_NAME);

              var prop = m_properties
                .item(C.CPG_ID)
                .setValue(cpg_name)
                .setSelectId(cpg_id);

              m_dialog.showValue(prop);
            }

            var prop = m_properties.item(C.LP_ID)
              .setSelectFilter(lp_filter);

            if(lp_id !== NO_ID) {
              prop.setValue(lp_name);
              prop.setSelectId(lp_id);
            }

            m_dialog.showValue(prop);

            prop = m_properties.item(C.LD_ID);
            prop.setSelectFilter(ld_filter);

            if(ld_id !== NO_ID) {
              prop.setValue(ld_name);
              prop.setSelectId(ld_id);
            }

            m_dialog.showValue(prop);

            var bLastIva = m_bIva;
            var ivaChanged = false;
            m_bIva = valField(response.data, C.HAS_IVA_RI);
            if(bLastIva !== m_bIva) { ivaChanged = true; }

            bLastIva = m_bIvaRni;
            m_bIvaRni = valField(response.data, C.HAS_IVA_RNI);
            if(bLastIva !== m_bIvaRni) { ivaChanged = true; }

            if(ivaChanged) {
              updateTotals();
            }

            setFechaVto(cpg_id, response);

            return true;
          });
        }
        return p || P.resolvedPromise(false);
      };

      var signDocument = function() {

        if(m_id === NO_ID) {
          return M.showWarningWithFalse(getText(1592, ""));
          // Antes de poder firmar el documento debe guardarlo.
        }

        var refreshState = function(response) {

          m_est_id = response.est_id;
          m_estado = response.estado;
          m_firmado = response.firmado;

          var prop = m_properties.item(Cairo.Constants.STATUS_ID);

          prop.setSelectId(m_est_id);
          prop.setValue(m_estado);

          m_dialog.showValue(prop);
        };

        var p = null;

        if(m_firmado) {
          p = M.confirmViewYesDefault(
            getText(1593, ""), // El documento ya ha sido firmado desea borrar la firma
            getText(1594, "")  // Firmar
          );
        }

        p = p || P.resolvedPromise(true);

        p = p
          .success(D.signDocument(m_doct_id, m_id))
          .successWithResult(refreshState);

        return p;
      };

      var move = function(moveTo) {

        var docId = getDocId().getSelectId();

        if(docId === NO_ID) {
          return M.showInfoWithFalse(
            getText(1595, "") // Debe seleccionar un documento
          );
        }

        var completeMove = function(response) {
          // id === NO_ID means this document doesn't have any transaction
          //
          if(response.id === NO_ID) {

            m_lastProvId = NO_ID;
            m_lastProvName = "";

            return load(NO_ID)
              .success(call(D.getDocNumberForProveedor, m_lastProvId, m_doc_id, m_dialog))
              .then(function(enabled) { m_taPropuesto = enabled; })
              .then(refreshProperties);
          }
          else {
            return load(response.id)
              .success(refreshProperties);
          }
        }
        return D.move(m_doc_id, moveTo)
          .successWithResult(completeMove);
      };

      var refreshProperties = function() {
        var c;

        m_properties.item(C.DOC_ID)
        .setSelectId(m_doc_id)
        .setValue(m_documento);

        m_properties.item(CC.FC_FECHA)
        .setValue(m_fecha);

        m_properties.item(CC.FC_FECHA_ENTREGA)
        .setValue(m_fechaentrega);

        m_properties.item(CC.FC_FECHA_IVA)
        .setValue(m_fechaIva);

        m_properties.item(C.PROV_ID)
        .setSelectId(m_prov_id)
        .setValue(m_proveedor);

        m_properties.item(Cairo.Constants.NUMBER_ID)
        .setValue(m_numero);

        m_properties.item(Cairo.Constants.STATUS_ID)
        .setValue(m_estado);

        m_properties.item(CC.FC_NRODOC)
        .setValue(m_nrodoc)
        .setTextMask(m_taMascara)
        .setTextAlign(Dialogs.TextAlign.right);

        m_properties.item(CC.FC_DESCUENTO1)
        .setValue(m_descuento1);

        m_properties.item(CC.FC_DESCUENTO2)
        .setValue(m_descuento2);

        m_properties.item(C.CPG_ID)
        .setSelectId(m_cpg_id)
        .setValue(m_condicionPago);

        m_properties.item(CC.FC_FECHA_VTO)
        .setValue(m_fechaVto);

        m_properties.item(CC.FC_COTIZACION)
        .setValue(m_cotizacion);

        m_properties.item(C.LP_ID)
        .setSelectFilter(D.getListaPrecioForProveedor(m_doc_id, m_prov_id))
        .setSelectId(m_lp_id)
        .setValue(m_listaPrecio);

        m_properties.item(C.LD_ID)
        .setSelectFilter(D.getListaDescuentoForProveedor(m_doc_id, m_prov_id))
        .setSelectId(m_ld_id)
        .setValue(m_listaDescuento);

        m_properties.item(C.CCOS_ID)
        .setSelectId(m_ccos_id)
        .setValue(m_centroCosto);

        m_properties.item(C.SUC_ID)
        .setSelectId(m_suc_id)
        .setValue(m_sucursal);

        m_properties.item(CC.FC_DESCRIP)
        .setValue(m_descrip);

        m_properties.item(CC.FC_CAI)
        .setValue(m_cai);

        m_properties.item(CC.LGJ_ID)
        .setSelectId(m_lgj_id)
        .setValue(m_legajo);

        m_properties.item(CC.PRO_ID_ORIGEN)
        .setSelectId(m_pro_id_origen)
        .setValue(m_proOrigen);

        m_properties.item(CC.PRO_ID_DESTINO)
        .setSelectId(m_pro_id_destino)
        .setValue(m_proDestino);

        c = m_properties.item(CC.DEPL_ID_ORIGEN);
        if(m_depl_id !== NO_ID || !m_showStockData) {
          c.setSelectId(m_depl_id);
          c.setValue(m_deposito);
        }
        else {
          c.setSelectId(Cairo.UserConfig.getDeplId());
          c.setValue(Cairo.UserConfig.getDeplNombre());
        }

        m_properties.item(CC.FC_COTIZACION_PROV)
        .setValue(m_cotizacionProv);

        m_properties.item(CC.FC_TIPO_COMPROBANTE)
        .setListItemData(m_tipoComprobante);

        m_dialog.showValues(m_properties);
        m_dialog.resetChanged();

        var cotizacion = (m_cotizacion !== 0) ? m_cotizacion : 1;

        m_itemsDeleted = "";
        m_otrosDeleted = "";
        m_percepcionesDeleted = "";
        m_legajosDeleted = "";

        m_items.showValues(m_itemsProps);

        var properties = m_footerProps;

        properties.item(CC.FC_SUBTOTAL)
        .setValue(m_subTotal);

        properties.item(CC.FC_IMPORTE_DESC_1)
        .setValue(m_importeDesc1);

        properties.item(CC.FC_IMPORTE_DESC_2)
        .setValue(m_importeDesc2);

        properties.item(CC.FC_NETO)
        .setValue(m_neto);

        properties.item(CC.FC_IVA_RI)
        .setValue(m_ivari);

        properties.item(CC.FC_IVA_RNI)
        .setValue(m_ivarni);

        properties.item(CC.FC_INTERNOS)
        .setValue(m_internos);

        properties.item(CC.FC_TOTAL_OTROS)
        .setValue(m_totalOtros);

        properties.item(CC.FC_TOTAL_PERCEPCIONES)
        .setValue(m_totalPercepciones);

        properties.item(CC.FC_TOTAL)
        .setValue(m_total);

        m_footer.showValues(m_footerProps);

        setEnabled();

        loadItems(getProperty(m_items, C_ITEMS), cotizacion);
        loadPercepciones(getProperty(m_items, C_OTROS), cotizacion);
        loadOtros(getProperty(m_items, C_PERCEPCIONES), cotizacion);
        loadLegajos(getProperty(m_items, C_LEGAJOS), cotizacion);

        return showCotizacion()
          .then(showFechaVto)
          .then(call(D.showDataAddProveedor, Cairo.UserConfig.getShowDataAddInCompras(), m_dialog));
      };

      var showApplycation = function() {

        if(!Cairo.Security.docHasPermissionTo(
          CS.MODIFY_APLIC,
          m_doc_id,
          Cairo.Security.ActionTypes.apply)) {
          return false;
        }

        if(m_applyEditor === null) {
          m_applyEditor = Cairo.FacturaCompraAplic.createObject();
        }
        else {
          if(m_applyEditor.getId() !== m_id) {
            m_applyEditor.setClient(null);
            m_applyEditor = Cairo.FacturaCompraAplic.createObject();
          }
        }

        m_applyEditor.setClient(self);

        m_applyEditor.show(
          m_id,
          m_total * ((m_cotizacion !== 0) ? m_cotizacion : 1),
          m_nrodoc,
          m_prov_id,
          m_proveedor,
          m_suc_id,
          m_doc_id,
          m_doct_id === D.Types.NOTA_CREDITO_COMPRA).then(function(result) {
            if(result !== true) {
              m_applyEditor = null;
            }
        });
      };

      var startWizard = function(wizard, wizardConstructor) {
        wizard.setProvId(m_prov_id);
        wizard.setProveedor(m_proveedor);
        wizard.setDocId(m_lastDocId);
        wizard.setDocumento(m_lastDocName);
        wizard.setObjClient(self);

        var wizardDialog = Cairo.Dialogs.Views.Controller.newDialog();
        wizardDialog.setObjClient(wizard);
        wizardDialog.show(wizardConstructor);
      };

      var showStartWizardRemito = function() {
        try {
          var wizConstructor = Cairo.FacturaCompraRemitoWiz.createObject;
          var wizard = wizConstructor();
          wizard.setRcIds(m_rcIds);
          wizard.load().success(call(startWizard, wizard, wizConstructor));
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showStartWizardRemito", C_MODULE, "");
        }
      };

      var showStartWizard = function() {
        try {
          var wizConstructor = Cairo.FacturaCompraWiz.createObject;
          var wizard = wizConstructor();
          wizard.setOcIds(m_ocIds);
          wizard.load().success(call(startWizard, wizard, wizConstructor));
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showStartWizard", C_MODULE, "");
        }
      };

      var initialize = function() {
        try {

          m_serialNumbers = Cairo.Collections.createCollection(null);
          m_ocIds = [];
          m_rcIds = [];

        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "initialize", C_MODULE, "");
        }
      };

      self.destroy = function() {
        try {
          m_dialog = null;
          m_properties = null;
          m_listController = null;
          m_footer = null;
          m_footerProps = null;
          m_items = null;
          m_itemsProps = null;
          m_ocIds = [];
          m_rcIds = [];
          m_serialNumbers = null;
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");
        }
      };

      var saveItemNroSerie = function(mainRegister, row, order, prId, grupo) {

        if(cellId(row, KI_PR_LLEVA_NRO_SERIE)) {

          var transaction = new DB.Transaction();
          var deleted = [];

          var _count = m_serialNumbers.get(Cairo.Collections.getKey(grupo)).size();
          for(var _i = 0; _i < _count; _i++) {

            var pt = m_serialNumbers.get(Cairo.Collections.getKey(grupo)).item(_i);

            if(pt.getDeleted()) {

              if(!m_copy && pt.getPrnsId() !== 0) {
                deleted.push(pt.getPrnsId());
              }
            }
            else {

              var register = new DB.Register();
              var fields = register.getFields();

              register.setFieldId(C.FCIS_TMPID);
              register.setTable(C.FACTURA_COMPRA_ITEMSERIETMP);
              register.setId(Cairo.Constants.NEW_ID);

              fields.add(C.PR_ID, prId, Types.id);

              if(m_copy) {
                fields.add(CC.PRNS_ID, Cairo.Constants.NEW_ID, Types.integer);
              }
              else {
                fields.add(CC.PRNS_ID, pt.getPrnsId(), Types.id);
              }

              fields.add(CC.PRNS_CODE, pt.getCode(), Types.text);
              fields.add(CC.PRNS_DESCRIP, pt.getDescrip(), Types.text);
              fields.add(CC.PRNS_FECHA_VTO, pt.getFechaVto(), Types.date);

              order.n += 1;
              fields.add(C.FCIS_ORDEN, order.n, Types.integer);

              transaction.addRegister(register);
            }
          }

          transaction.setDeletedList(deleted.toString());

          mainRegister.addTransaction(transaction);
        }

        return true;
      };

      var getPrId = function(prId) {
        return !getIsInput() ? prId : 0;
      };

      var getIsInput = function() {
        return m_lastDoctId !== D.Types.NOTA_CREDITO_COMPRA;
      };

      ////////////////////////////////////////////////////////////////////////////////////////////////// 
      // nrs devolucion
      var getDeplId = function() {
        var deplId = 0;

        if(m_lastDoctId !== D.Types.NOTA_CREDITO_COMPRA) {
          deplId = C.DepositosInternos.deplIdTercero;
        }
        else {
          deplId = m_properties.item(CC.DEPL_ID_ORIGEN).getSelectId();
        }

        return deplId;
      };

      var getProvId = function() {
        return m_properties.item(C.PROV_ID).getSelectId();
      };

      var getFecha = function() {
        return m_properties.item(CC.FC_FECHA).getValue();
      };

      var showOrdenPago = function() {
        try {
          var ordenPago = Cairo.OrdenPago.createObject();
          ordenPago.showOrdenPago(getProvId(), getFcIds());
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showOrdenPago", C_MODULE, "");
        }
      };

      var getFcIds = function() {
        return [m_id];
      };

      var processMultiRow = function(virtualRow) {
        var p = null;

        virtualRow.setSuccess(false);

        switch (virtualRow.getInfo().key) {
          case K_ITEMS:
            var items = getItems();

            var row = null;
            row = items.getGrid().getRows(virtualRow.getInfo().row);

            if(row.item(virtualRow.getInfo().col).getKey() === KI_PR_ID) {

              var cell = getCell(row, KI_PR_ID);

              if(cell.getSelectIntValue() !== "") {
                if(cell.getSelectIntValue().indexOf(",", 1) >= 0) {
                  p = Cairo.Selections.addMultiRowsPurchase(cell.getSelectIntValue(), virtualRow, KI_CANTIDAD);
                }
              }
            }
            break;
        }

        return p || P.resolvedPromise(virtualRow);
      };

      var getItems = function() {
        return m_itemsProps.item(C_ITEMS);
      };

      var showHideCols = function(onlyStock) {

        if(! m_dialog.getInSave()) {

          var visible = val(m_properties.item(Cairo.Constants.HIDE_COLUMNS).getValue()) === 0;
          var prop = getItems();

          m_dialog.drawGrid(prop, false);

          var columns = prop.getGrid().getColumns();

          for(var i = 1, count = columns.count(); i < count; i++) {
            switch (columns.item(i).getKey()) {

              case KI_DESCUENTO:
              case KI_UNIDAD:
              case KI_PRECIO_LP:
              case KI_IVA_RNI:
              case KI_TO_ID:

                if(! onlyStock) {
                  columns.item(i).setVisible(visible);
                  m_dialog.refreshColumnPropertiesByIndex(prop, i);
                }
                break;

              case KI_NRO_SERIE:
              case KI_STL_CODIGO:

                columns.item(i).setVisible(m_showStockData);
                m_dialog.refreshColumnPropertiesByIndex(prop, i);
                break;
            }
          }
        }
        m_dialog.drawGrid(prop, true);
      };

      var getFileNamePostFix = function() {
        return (
          m_properties.item(C.PROV_ID).getValue().substring(0, 50)
            + "-" + m_properties.item(CC.FC_NRODOC).getValue()
          );
      };

      var setColorBackground = function() {
        if(Cairo.UserConfig.getUsarColoresEnDocumentos()) {
          if(m_lastDoctId === D.Types.NOTA_CREDITO_COMPRA) {
            m_dialog.setBackColorTabMain("#c1c1f6");
          }
          else {
            m_dialog.setBackColorTabMain("white");
          }
        }

      };

      initialize();

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("FacturaCompraListDoc.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;
      var P = Cairo.Promises;
      var NO_ID = Cairo.Constants.NO_ID;
      var DB = Cairo.Database;
      var D = Cairo.Documents;
      var M = Cairo.Modal;
      var C = Cairo.General.Constants;
      var Types = Cairo.Constants.Types;
      var Dialogs = Cairo.Dialogs;
      var T = Dialogs.PropertyType;
      var val = Cairo.Util.val;
      var isDate = Cairo.Util.isDate;
      var getDateValue = Cairo.Util.getDateValue;
      var today = Cairo.Dates.today;
      var valField = DB.valField;
      var CS = Cairo.Security.Actions.Compras;

      var C_MODULE = "FacturaCpraListDoc";

      var C_FECHAINI = "FechaIni";
      var C_FECHAFIN = "FechaFin";

      var K_FECHAINI = 1;
      var K_FECHAFIN = 2;
      var K_PROV_ID = 4;
      var K_EST_ID = 5;
      var K_CCOS_ID = 6;
      var K_SUC_ID = 7;
      var K_DOC_ID = 9;
      var K_CPG_ID = 10;
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
      var m_emp_id = "";
      var m_empresa = "";
      var m_fechaIniV = "";
      var m_fechaFinV = "";

      var m_dialog;
      var m_properties;

      var m_listController;

      var m_title = "";

      var m_menuLoaded;

      var m_menuShowOrdenPago = 0;

      var m_menuShowNotes = 0;
      var m_menuShowInfoProv = 0;
      var m_menuAddMensaje = 0;
      var m_menuShowAplic = 0;
      var m_menuShowAsiento = 0;
      var m_menuShowDocAux = 0;
      var m_menuFirmar = 0;

      var m_apiPath = DB.getAPIVersion();
      var SAVE_ERROR = getText(2179, ""); // Error al grabar los párametros de navegación de Facturas de Compra

      self.list = function() {
        initialize();
        return load()
          .success(loadCollection);
      };

      self.edit = function(fcId) {
        m_listController.edit(fcId);
      };

      self.deleteItem = function(fcId) {
        return m_listController.destroy(fcId);
      };

      self.showDocDigital = function() {
        var _rtn = null;

        try {

          var fcId = m_dialog.getId();
          if(fcId === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(C.FACTURA_COMPRA);
          doc.setClientTableID(fcId);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showDocDigital", C_MODULE, "");
        }

        return _rtn;
      };

      self.processMenu = function(index) {
        try {

          switch (index) {

            case m_menuShowOrdenPago:
              showOrdenPago();
              break;

            case m_menuShowInfoProv:
              D.showInfo(Cairo.Tables.PROVEEDOR, getProvId());
              break;

            case m_menuShowNotes:
              showNotes();
              break;

            case m_menuAddMensaje:
              addMensaje();
              break;

            case m_menuShowAplic:
              showApplycation();
              break;

            case m_menuShowAsiento:
              showAsiento();
              break;

            case m_menuShowDocAux:
              showDocAux();
              break;

            case m_menuFirmar:
              signDocument();
              break;
          }

        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "processMenu", C_MODULE, "");
        }
      };

      var loadCollection = function() {
        var c;

        m_properties.clear();

        c = m_properties.add(null, C_FECHAINI);
        c.setType(T.date);
        c.setName(getText(1203, "")); // Fecha desde
        c.setKey(K_FECHAINI);
        c.setValue((m_fechaIniV !== "") ? m_fechaIniV : m_fechaIni);
        
        c = m_properties.add(null, C_FECHAFIN);
        c.setType(T.date);
        c.setName(getText(1204, "")); // Fecha hasta
        c.setKey(K_FECHAFIN);
        c.setValue((m_fechaFinV !== "") ? m_fechaFinV : m_fechaFin);

        c = m_properties.add(null, C.PROV_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.PROVEEDOR);
        c.setName(getText(1151, "")); // Proveedor
        c.setKey(K_PROV_ID);
        c.setValue(m_proveedor);
        c.setSelectId(val(m_prov_id));
        c.setSelectIntValue(m_prov_id);

        c = m_properties.add(null, C.EST_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.ESTADO);
        c.setName(getText(1568, "")); // Estado
        c.setKey(K_EST_ID);
        c.setValue(m_estado);
        c.setSelectId(val(m_est_id));
        c.setSelectIntValue(m_est_id);

        c = m_properties.add(null, C.CCOS_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.CENTRO_COSTO);
        c.setName(getText(1057, "")); // Centro de Costos
        c.setKey(K_CCOS_ID);
        c.setValue(m_centroCosto);
        c.setSelectId(val(m_ccos_id));
        c.setSelectIntValue(m_ccos_id);

        c = m_properties.add(null, C.SUC_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.SUCURSAL);
        c.setName(getText(1281, "")); // Sucursal
        c.setKey(K_SUC_ID);
        c.setValue(m_sucursal);
        c.setSelectId(val(m_suc_id));
        c.setSelectIntValue(m_suc_id);

        c = m_properties.add(null, C.DOC_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.DOCUMENTO);
        c.setName(getText(1567, "")); // Documentos
        c.setKey(K_DOC_ID);
        c.setValue(m_documento);
        c.setSelectId(val(m_doc_id));
        c.setSelectIntValue(m_doc_id);
        c.setSelectFilter(D.FACTURA_COMPRAS_LIST_DOC_FILTER);

        c = m_properties.add(null, C.CPG_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.CONDICION_PAGO);
        c.setName(getText(1395, "")); // Condicion de pago
        c.setKey(K_CPG_ID);
        c.setValue(m_condicionPago);
        c.setSelectId(val(m_cpg_id));
        c.setSelectIntValue(m_cpg_id);

        c = m_properties.add(null, C.EMP_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.EMPRESA);
        c.setName(getText(1114, "")); // Empresa
        c.setKey(K_EMP_ID);
        c.setValue(m_empresa);
        c.setSelectId(val(m_emp_id));
        c.setSelectIntValue(m_emp_id);

        createMenu();
        if(!m_dialog.showDocumentList(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_title);

        var properties = m_properties;

        return m_dialog.showValues(properties);
      };

      var load = function() {

        return DB.getData("load[" + m_apiPath + "compras/facturacompras/parameters]").then(
          function(response) {

            m_emp_id = Cairo.Company.getId();
            m_empresa = Cairo.Company.getName();

            if(response.success !== true) { return false; }

            if(response.data.id === NO_ID) {

              m_fechaIniV = "";
              m_fechaIni = Cairo.Dates.today();
              m_fechaFinV = "";
              m_fechaFin = new Date("01/01/2000");
              m_prov_id = NO_ID;
              m_proveedor = "";
              m_est_id = NO_ID;
              m_estado = "";
              m_ccos_id = NO_ID;
              m_centroCosto = "";
              m_suc_id = NO_ID;
              m_sucursal = "";
              m_doc_id = NO_ID;
              m_documento = "";
              m_cpg_id = NO_ID;
              m_condicionPago = "";

            }
            else {

              m_fechaIniV = valField(response.data, C.FROM);
              m_fechaIni = valField(response.data, C.FROM);
              m_fechaIni = isDate(m_fechaIni) ? getDateValue(m_fechaIni) : today();

              m_fechaFinV = valField(response.data, C.TO);
              m_fechaFin = valField(response.data, C.TO);
              m_fechaFin = isDate(m_fechaFin) ? getDateValue(m_fechaFin) : today();

              m_prov_id = valField(response.data, C.PROV_ID);
              m_est_id = valField(response.data, C.EST_ID);
              m_ccos_id = valField(response.data, C.CCOS_ID);
              m_suc_id = valField(response.data, C.SUC_ID);
              m_doc_id = valField(response.data, C.DOC_ID);
              m_cpg_id = valField(response.data, C.CPG_ID);
              m_emp_id = valField(response.data, C.EMP_ID);

              m_proveedor = valField(response.data, C.PROV_NAME);
              m_estado = valField(response.data, C.EST_NAME);
              m_centroCosto = valField(response.data, C.CCOS_NAME);
              m_sucursal = valField(response.data, C.SUC_NAME);
              m_documento = valField(response.data, C.DOC_NAME);
              m_condicionPago = valField(response.data, C.CPG_NAME);
              m_empresa = valField(response.data, C.EMP_NAME);

            }
            return true;
          }
        );
      };

      self.getProperties = function() {
        return m_properties;
      };

      self.propertyChange = function(key) {

        var property;

        var properties = m_properties;

        switch (key) {

          case K_FECHAINI:

            property = properties.item(C_FECHAINI);

            if(property.getSelectIntValue() !== "") {
              m_fechaIniV = property.getSelectIntValue();
              m_fechaIni = Cairo.Dates.DateNames.getDateByName(m_fechaIniV);
            }
            else if(isDate(property.getValue())) {
              m_fechaIniV = "";
              m_fechaIni = property.getValue();
            }
            else {
              m_fechaIniV = "";
              property.setValue(m_fechaIni);
            }
            break;

          case K_FECHAFIN:

            property = properties.item(C_FECHAFIN);

            if(property.getSelectIntValue() !== "") {
              m_fechaFinV = property.getSelectIntValue();
              m_fechaFin = Cairo.Dates.DateNames.getDateByName(m_fechaFinV);
            }
            else if(isDate(property.getValue())) {
              m_fechaFinV = "";
              m_fechaFin = property.getValue();
            }
            else {
              m_fechaFinV = "";
              property.setValue(m_fechaFin);
            }
            break;

          case K_EST_ID:
            var property = properties.item(C.EST_ID);
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
            break;

          case K_EMP_ID:
            var property = properties.item(C.EMP_ID);
            m_empresa = property.getValue();
            m_emp_id = property.getSelectIntValue();
            break;
        }

        return true;
      };

      self.refresh = function() {

        var startDate;
        if(Cairo.Dates.DateNames.getDateNames().contains(m_fechaIniV)) {
          startDate = Cairo.Dates.DateNames.getDateByName(m_fechaIniV);
        }
        else {
          startDate = m_fechaIni
        }

        var endDate;
        if(Cairo.Dates.DateNames.getDateNames().contains(m_fechaFinV)) {
          endDate = Cairo.Dates.DateNames.getDateByName(m_fechaFinV);
        }
        else {
          endDate = m_fechaFin
        }

        startDate = DB.sqlDate(startDate);
        endDate = DB.sqlDate(endDate);

        var params = {
          from: startDate,
          to: endDate,
          provId: m_prov_id,
          estId: m_est_id,
          ccosId: m_ccos_id,
          sucId: m_suc_id,
          docId: m_doc_id,
          cpgId: m_cpg_id,
          empId: m_emp_id
        };

        return DB.getData("load[" + m_apiPath + "compras/facturacompras]", null, params);
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.LDP_ID);
        register.setTable(C.LISTA_DOCUMENTO_PARAMETRO);

        var apiPath = DB.getAPIVersion();
        register.setPath(apiPath + "compras/facturacompras");

        register.setId(Cairo.Constants.NEW_ID);

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {

          var property = m_dialog.getProperties().item(_i);

          switch (property.getKey()) {

            case K_FECHAINI:
              var value = property.getSelectIntValue();
              if(value === "") { value = property.getValue(); }
              fields.add(C.FROM, value, Types.text);
              break;

            case K_FECHAFIN:
              var value = property.getSelectIntValue();
              if(value === "") { value = property.getValue(); }
              fields.add(C.TO, value, Types.text);
              break;

            case K_PROV_ID:
              fields.add(C.PROV_ID, property.getSelectIntValue(), Types.text);
              break;

            case K_EST_ID:
              fields.add(C.EST_ID, property.getSelectIntValue(), Types.text);
              break;

            case K_CCOS_ID:
              fields.add(C.CCOS_ID, property.getSelectIntValue(), Types.text);
              break;

            case K_SUC_ID:
              fields.add(C.SUC_ID, property.getSelectIntValue(), Types.text);
              break;

            case K_DOC_ID:
              fields.add(C.DOC_ID, property.getSelectIntValue(), Types.text);
              break;

            case K_CPG_ID:
              fields.add(C.CPG_ID, property.getSelectIntValue(), Types.text);
              break;

            case K_EMP_ID:
              fields.add(C.EMP_ID, property.getSelectIntValue(), Types.text);
              break;

          }
        }

        return DB.saveEx(
            register,
            false,
            "",
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            SAVE_ERROR).then(

          function(result) {
            if(result.success) {
              return load(result.data.getId()).then(
                function (success) {
                  if(success) {
                    refreshCollection();
                  };
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

      self.getPath = function() {
        return "#compra/facturasdecompra";
      };

      self.getEditorName = function() {
        return "facturacompras";
      };

      self.getTitle = function() {
        return m_title;
      };

      self.setDialog = function(dialog) {
        m_dialog = dialog;
        m_properties = dialog.getProperties();
      };

      self.setListController = function(controller) {
        m_listController = controller;
      };

      var createMenu = function() {

        if(m_menuLoaded) { return; }

        m_menuLoaded = true;

        m_dialog.clearMenu();
        
        m_menuShowOrdenPago = m_dialog.addMenu(getText(1922, "")); // Orden de Pago
        m_dialog.addMenu("-");
        
        m_menuFirmar = m_dialog.addMenu(getText(1594, "")); // Firmar
        m_dialog.addMenu("-");
        
        m_menuShowInfoProv = m_dialog.addMenu(getText(1887, "")); // Ver Info del Proveedor
        
        m_menuAddMensaje = m_dialog.addMenu(getText(1615, "")); // Agregar Nota
        
        m_menuShowNotes = m_dialog.addMenu(getText(1616, "")); // Ver Notas
        m_dialog.addMenu("-");
        
        m_menuShowAplic = m_dialog.addMenu(getText(1617, "")); // Ver Aplicaciones
        
        m_menuShowAsiento = m_dialog.addMenu(getText(1692, "")); // Ver Asiento Contable
        
        m_menuShowDocAux = m_dialog.addMenu(getText(1691, "")); // Ver Documento Asociado
      };

      var showNotes = function() {
        var fcId = m_dialog.getId();
        return DB.getData("load[" + m_apiPath + "compras/facturacompra/notes]", fcId)
          .successWithResult(D.showNotes);
      };

      var addMensaje = function() {
        var fcId = m_dialog.getId();
        return D.addNote(D.Types.FACTURA_COMPRA, fcId, false);
      };

      var signDocument = function() {

        var fcId = m_dialog.getId();

        if(fcId === NO_ID) {
          return P.resolvedPromise();
        }

        var refreshRow = function(response) {
          m_dialog.refreshRow(response.data);
        };

        var getAction = function(response) {
          var p = null;

          if(response.signed) {
            p = M.confirmViewYesDefault(
              getText(1593, ""), // El documento ya ha sido firmado desea borrar la firma
              getText(1594, "")  // Firmar
            );
          }
          return p || P.resolvedPromise(true);
        };

        var p = D.getDocumentSignStatus(D.Types.FACTURA_COMPRA, fcId)
          .successWithResult(getAction)
          .success(D.signDocument(D.Types.FACTURA_COMPRA, fcId))
          .successWithResult(refreshRow)
        ;

        return p;
      };

      var showAsiento = function() {
        var fcId = m_dialog.getId();
        if(fcId != NO_ID) {

          D.getAsientoId(D.Types.FACTURA_COMPRA, fcId).successWithResult(function(response) {
            D.showDocAux(response.as_id, "Asiento");
          });
        }
      };

      var showDocAux = function() {
        var fcId = m_dialog.Id;
        if(fcId != NO_ID) {

          D.getStockId(D.Types.FACTURA_COMPRA, fcId).successWithResult(function(response) {
            D.showDocAux(response.st_id, "Stock");
          });
        }
      };

      var showApplycation = function() {

        var showEditor = function(info) {
          if(!Cairo.Security.docHasPermissionTo(
            CS.MODIFY_APLIC,
            m_doc_id,
            Cairo.Security.ActionTypes.apply)) {
            return false;
          }

          var applyEditor = Cairo.FacturaCompraAplic.createObject();

          applyEditor.setClient(self);

          applyEditor.show(
              info.id,
              info.total * ((info.cotizacion !== 0) ? info.cotizacion : 1),
              info.nrodoc,
              info.prov_id,
              info.proveedor,
              info.suc_id,
              info.doc_id,
              info.doct_id === D.Types.NOTA_CREDITO_COMPRA);
        };
        
        var fcId = m_dialog.getId();
        if(fcId !== NO_ID) {
          D.getDocumentInfo(D.Types.FACTURA_COMPRA, fcId).successWithResult(showEditor);
        }
      };

      var showOrdenPago = function() {
        try {
          var ordenPago = Cairo.OrdenPago.createObject();
          ordenPago.showOrdenPago(NO_ID, getFcIds());
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showOrdenPago", C_MODULE, "");
        }
      };

      var getFcIds = function() {
        return m_dialog.getIds();
      };

      var initialize = function() {
        try {
          m_title = getText(1892, ""); // Facturas de Compras
          m_dialog.setHaveDetail(true);
          m_dialog.setStartRowText(4);
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "initialize", C_MODULE, "");
        }
      };

      self.destroy = function() {
        try {
          m_dialog = null;
          m_properties = null;
          m_listController = null;
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");
        }
      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("FacturaCompra.List", function(List, Cairo, Backbone, Marionette, $, _) {

    var NO_ID = Cairo.Constants.NO_ID;
    var DB = Cairo.Database;
    var C_MODULE = "cFacturaCompra";
    var P = Cairo.Promises;

    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createListDialog = function(tabId) {

          var editors = Cairo.Editors.facturaCompraEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.facturaCompraEditors = editors;

          // ListController properties and methods
          // 
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "FacturaCompras",
            entityName: "facturacompra",
            entitiesName: "facturacompras"
          });

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

          self.edit = function(id) {
            var key = getKey(id);
            if(editors.contains(key)) {
              editors.item(key).dialog.showDialog();
            }
            else {
              Cairo.LoadingMessage.show("FacturaCompras", "Loading Factura de Compras from Crowsoft Cairo server.");

              var editor = Cairo.FacturaCompra.Edit.Controller.getEditor();
              var dialog = Cairo.Dialogs.Views.Controller.newDialog();
              var dialogItems = Cairo.Dialogs.Views.Controller.newDialog();
              var dialogFooter = Cairo.Dialogs.Views.Controller.newDialog();

              editor.setListController(self);
              editor.setDialog(dialog);
              editor.setItems(dialogItems);
              editor.setFooter(dialogFooter);
              editor.edit(id).then(Cairo.LoadingMessage.close);

              editors.add({editor: editor, dialog: dialog}, key);
            }
          };

          self.destroy = function(id) {
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.Compras.DELETE_FACTURA)) {
              return P.resolvedPromise(false);
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

            return DB.destroy(
                DB.getAPIVersion() + "compras/facturacompra", id,
                Cairo.Constants.DELETE_FUNCTION, C_MODULE).success(closeDialog, false);
          };

          // progress message
          // 
          Cairo.LoadingMessage.show("FacturaCompras", "Loading Factura de Compras from Crowsoft Cairo server.");

          self.documentList = Cairo.FacturaCompraListDoc.Edit.Controller.getEditor();
          var dialog = Cairo.Dialogs.Views.ListController.newDialogList();

          self.documentList.setListController(self);
          self.documentList.setDialog(dialog);
          self.documentList.list().then(Cairo.LoadingMessage.close);

        };

        var showListDialog = function() {
          self.documentList.show();
        };

        var closeListDialog = function() {

        }

        createListDialog();
      }
    };
  });

}());


/*
*
 search: val\(getCell\((.*?)\)\.getValue\(\)\)
 replace: cellFloat($1)

 search: getCell\((.*)?\)\.getValue\(\)
 replace: cellVal($1)

 search: getValue\(\) === (.*?);
 repalce: setValue($1);

 search: .*elem\.set((Left)|(Top)|(Width)|(Height)).*?\(.+\n
 replace:
* */