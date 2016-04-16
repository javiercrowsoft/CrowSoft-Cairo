(function() {
  "use strict";

  Cairo.module("FacturaVenta.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var TITLE = getText(1624, ""); // Facturas de Venta
      var SAVE_ERROR_MESSAGE = getText(2220, ""); // Error al grabar la Factura de Venta

      var P = Cairo.Promises;
      var NO_ID = Cairo.Constants.NO_ID;
      var DB = Cairo.Database;
      var Dialogs = Cairo.Dialogs;
      var Grids = Cairo.Dialogs.Grids;
      var C = Cairo.General.Constants;
      var CV = Cairo.Ventas.Constants;
      var CS = Cairo.Security.Actions.Ventas;
      var Types = Cairo.Constants.Types;
      var valField = DB.valField;
      var getValue = DB.getValue;
      var valEmpty = Cairo.Util.valEmpty;
      var Percepciones = Cairo.Ventas.Percepciones;
      var call = P.call;
      var D = Cairo.Documents;
      var getProperty = D.getProperty;
      var getGrid = D.getGrid;
      var getCell = Dialogs.cell;
      var cellId = Dialogs.cellId;
      var cellFloat = Dialogs.cellFloat;
      var val = Cairo.Util.val;
      var M = Cairo.Modal;
      var T = Dialogs.PropertyType;
      var ST = Dialogs.PropertySubType;

      var C_MODULE = "cFacturaVenta";

      var C_ITEMS = "ITEMS";
      var C_PERCEPCIONES = "PERCEPCIONES";
      var C_CAJAMSG = "CajaMsg";

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
      var K_CLI_ID = 10;
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
      var K_VEN_ID = 26;
      var K_LGJ_ID = 27;
      var K_CAI = 28;

      var K_PRO_ID_ORIGEN = 29;
      var K_PRO_ID_DESTINO = 30;
      var K_TRANS_ID = 31;
      var K_DEPL_ID = 32;
      var K_CLIS_ID = 33;

      var K_RV_NRODOC = 34;

      var K_PERCEPCIONES = 35;
      var K_TOTAL_PERCEPCIONES = 36;

      var K_ORDENCOMPRA = 40;

      var K_HIDECOLS = 41;

      var KI_FVI_ID = 2;
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
      var KI_CCOS_ID = 22;
      var KI_CUE_ID = 23;
      var KI_CUE_ID_IVA_RI = 24;
      var KI_CUE_ID_IVA_RNI = 25;

      var KI_PR_LLEVA_NRO_SERIE = 26;
      var KI_ES_KIT = 27;
      var KI_NRO_SERIE = 28;
      var KI_GRUPO = 29;

      var KI_STL_ID = 30;
      var KI_PR_LLEVALOTE = 31;

      var KI_PR_LOTEFIFO = 32;

      var KI_NOSTOCK = 33;

      var KI_TO_ID = 400;

      var m_id = 0;
      var m_numero = 0;
      var m_estado = "";
      var m_estId = 0;
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
      var m_totalPercepciones = 0;
      var m_subTotal = 0;
      var m_descuento1 = 0;
      var m_descuento2 = 0;
      var m_importeDesc1 = 0;
      var m_importeDesc2 = 0;
      var m_cpgId = 0;
      var m_condicionPago = "";
      var m_venId = 0;
      var m_vendedor = "";
      var m_lgjId = 0;
      var m_legajo = "";

      var m_clisId = 0;
      var m_clienteSucursal = "";

      var m_proIdOrigen = 0;
      var m_proOrigen = "";
      var m_proIdDestino = 0;
      var m_proDestino = "";

      var m_transId = "";
      var m_transporte = "";

      var m_ordenCompra = "";

      var m_cai = "";

      var m_deplId = 0;
      var m_deposito = "";

      var m_depfId = 0;

      var m_cotizacion = 0;
      var m_ccosId = 0;
      var m_centroCosto = "";
      var m_sucId = 0;
      var m_sucursal = "";
      var m_cliId = 0;
      var m_cliente = "";
      var m_docId = 0;
      var m_documento = "";
      var m_doctId = 0;
      var m_lpId = 0;
      var m_listaPrecio = "";
      var m_ldId = 0;
      var m_listaDescuento = "";
      var m_monId = 0;
      var m_lastMonIdCotizacion = 0;
      var m_firmado;

      var m_lastFecha = null;

      var m_asId = 0;
      var m_stId = 0;

      var m_showStockData;

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
      var m_lastCliId = 0;
      var m_lastDocName = "";
      var m_lastCliName = "";

      var m_lastCpgId = 0;

      var m_bIva;
      var m_bIvaRni;

      var m_isNew;

      var m_itemsDeleted = "";
      var m_percepcionesDeleted = "";

      var m_copy;

      var m_docEditable;
      var m_docEditMsg = "";

      var m_pvIds = 0;
      var m_pviIds = 0;
      var m_pviCantidades = 0;
      var m_rvIds = 0;
      var m_pklstIds = 0;
      var m_horaIds = 0;

      var m_taPropuesto;
      var m_taMascara = "";
      var m_rvTaPropuesto;

      var m_applyEditor;

      var m_serialNumbers;
      var m_kitDefinitions;

      var m_bPushVirtualNext;
      var m_bCloseWizardAfterSave;
      var m_bWizardCompleteSuccess;
      var m_bAutoSelectEasy;
      var m_bAutoPago;
      var m_cueIdAutoPago = 0;
      var m_modoVentaCtaCte;

      var m_docSinPerc;
      var m_percepciones = [];

      var m_cjId = 0;
      var m_cajaMsg = "";
      var m_bCajaError;

      var m_fv_id_nc_based = 0;

      var m_hojaRuta = null;
      var m_searchZona;

      var m_defaultCurrency = D.getDefaultCurrency();

      var m_apiPath = DB.getAPIVersion();

      var emptyData = {
        items: [],
        otros: [],
        percepciones: [],
        legajos: [],
        serialNumbers: [],
        kitDefinitions: []
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

      self.setHojaRuta = function(rhs) {
        m_hojaRuta = rhs;
      };

      self.setPushVirtualNext = function(rhs) {
        m_bPushVirtualNext = rhs;
      };

      self.setAutoSelectEasy = function(rhs) {
        m_bAutoSelectEasy = rhs;
      };

      self.setAutoPago = function(rhs) {
        m_bAutoPago = rhs;
      };

      self.setCueIdAutoPago = function(rhs) {
        m_cueIdAutoPago = rhs;
      };

      self.setModoVentaCtaCte = function(rhs) {
        m_modoVentaCtaCte = rhs;
      };

      self.setCloseWizardAfterSave = function(rhs) {
        m_bCloseWizardAfterSave = rhs;
      };

      self.getWizardCompleteSuccess = function() {
        return m_bWizardCompleteSuccess;
      };

      self.setDocId = function(rhs) {
        m_lastDocId = rhs;
      };

      self.setDocName = function(rhs) {
        m_lastDocName = rhs;
      };

      self.printDoc = function(fv_id, doc_id, cli_id, nroDoc, cliente) {

        // used for the dialog title
        //
        m_nrodoc = nroDoc;
        m_cliente = cliente;
        m_cliId = cli_id;

        return m_dialog.printDocWithResult(fv_id, doc_id);

      };

      self.setWizardCompleteSuccess = function(rhs) {
        m_bWizardCompleteSuccess = rhs;
      };

      var showStartWizard = function(cliId, f) {
        try {
          m_cliId = cliId;
          DB.getData("load[" + m_apiPath + "general/cliente/" + cliId.toString() + "/name]").then(function(response) {
            try {
              if(response.success === true) {
                m_cliente = valField(response.data, C.CLI_NAME);
                f();
              }
            }
            catch(ex) {
              Cairo.manageErrorEx(ex.message, ex, "showStartWizard", C_MODULE, "");
            }
          });
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "showStartWizard", C_MODULE, "");
        }
      };

      self.showFacturaProyecto = function(cliId, horaIds) {
        showStartWizard(cliId, function() {
          m_horaIds = horaIds.slice();
          if(initMembers()) {
            showStartWizardProyecto();
          }
        });
      };

      self.showFacturaRemito = function(cliId, rvIds) {
        showStartWizard(cliId, function() {
          m_rvIds = rvIds.slice();
          if(initMembers()) {
            showStartWizardRemito();
          }
        });
      };

      self.showFacturaPedido = function(cliId, pvIds) {
        showStartWizard(cliId, function() {
          m_pvIds = pvIds.slice();
          if(initMembers()) {
            showStartWizardPedido();
          }
        });
      };

      self.showFacturaPedidoAuto = function(cliId, pvIds, pviIds, pviCantidades) {
        showStartWizard(cliId, function() {
          m_pvIds = pvIds.slice();
          m_pviIds = pviIds.slice();
          m_pviCantidades = pviCantidades.slice();
          if(initMembers()) {
            showStartWizardPedido();
          }
        });
      };

      self.showFacturaPacking = function(cliId, pklstIds) {
        showStartWizard(cliId, function() {
          m_pklstIds = pklstIds.slice();
          if(initMembers()) {
            showStartWizardPackingList();
          }
        });
      };

      self.showWizardFacturaRemito = function() {
        try {
          if(initMembers()) {
            showStartWizardRemito();
          }
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showWizardFacturaRemito", C_MODULE, "");
        }
      };

      self.showWizardFacturaPedido = function() {
        try {
          if(initMembers()) {
            showStartWizardPedido();
          }
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showWizardFacturaPedido", C_MODULE, "");
        }
      };

      self.showWizardFacturaProyecto = function() {
        try {
          if(initMembers()) {
            showStartWizardProyecto();
          }
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showWizardFacturaProyecto", C_MODULE, "");
        }
      };

      self.showWizardFacturaPackingList = function() {
        try {
          if(initMembers()) {
            showStartWizardPackingList();
          }
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showWizardFacturaPackingList", C_MODULE, "");
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
        self.setFooter(Cairo.Dialogs.Views.Controller.newDialog());
        self.setItems(Cairo.Dialogs.Views.Controller.newDialog());

        return true;
      };

      self.copy = function() {

        if(!Cairo.Security.docHasPermissionTo(
          CS.NEW_FACTURA,
          m_docId,
          Cairo.Security.ActionTypes.create,
          true)) {
          return false;
        }

        updateList();

        m_isNew = true;

        if(m_listController !== null) {
          m_listController.updateEditorKey(self, NO_ID);
        }

        m_copy = true;
        m_docEditable = true;
        m_docEditMsg = "";

        D.setDocNumberForCliente(m_lastCliId, m_lastDocId, m_dialog).then(
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

        if(m_listController !== null) {
          m_listController.updateEditorKey(self, NO_ID);
        }

        p = self.edit(NO_ID).then(function() {

          var p = null;

          m_lastCliId = NO_ID;

          if(!m_docEditable) {
            if(m_docEditMsg !== "") {
              p = M.showWarning(m_docEditMsg);
            }
          }

          return p || P.resolvedPromise();

        }).then(function() {

            var p = null;

            var docId = getDocId().getSelectId();

            if(docId === NO_ID) {
              p = M.showInfo(getText(1562, ""));
            }

            return p || P.resolvedPromise();

          }).then(function() {

            setDataCliente();
            return D.setDocNumberForCliente(m_lastCliId, m_lastDocId, m_dialog)

          }).then(function(enabled) {

            m_taPropuesto = enabled;
            setColorBackground();
            return true;

          });

        return p;
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

          doc.setClientTable(CV.FACTURA_VENTA);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "showDocDigital", C_MODULE, "");
        }

        return _rtn;
      };

      self.messageEx = function(messageId, info) {
        var p = null;

        switch (messageId) {
          case Dialogs.Message.MSG_DOC_FIRST:
          case Dialogs.Message.MSG_DOC_PREVIOUS:
          case Dialogs.Message.MSG_DOC_NEXT:
          case Dialogs.Message.MSG_DOC_LAST:

            p = move(messageId);
            break;

          case Dialogs.Message.MSG_DOC_SIGNATURE:

            p = signDocument();
            break;

          case Dialogs.Message.MSG_GRID_ROW_DELETED:

            if(info !== K_PERCEPCIONES) {
              calcularPercepciones();
            }
            updateTotals();
            break;

          case Dialogs.Message.MSG_DOC_APPLY:

            showApplycation();
            break;

          case Dialogs.Message.MSG_DOC_EDIT_STATE:

            D.showEditStatus(m_docEditMsg, TITLE);
            break;

          case Dialogs.Message.MSG_DOC_DELETE:

            p = self.deleteDocument(m_id).whenSuccess(function() {
              return move(Dialogs.Message.MSG_DOC_NEXT);
            });
            break;

          case Dialogs.Message.MSG_DOC_INVALIDATE:

            p = D.docInvalidate(m_doctId, m_id, m_dialog).then(function(result) {
              if(result.success === true) {
                m_estId = result.estId;
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

          case Dialogs.Message.MSG_DOC_INFO:

            Cairo.Documentation.show("", "", CS.NEW_FACTURA);
            p = Dialogs.Message.MSG_DOC_INFO_HANDLED;
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

            D.search(D.Types.FACTURA_VENTA, self, Cairo.bool(info));
            break;

          case Dialogs.Message.MSG_DOC_DOC_AUX:

            if(m_id) {

              if(m_showStockData) {
                p = m_dialog.showPopMenu(
                  getText(1645, "") + "~1|"
                    + getText(1646, "") + "~2"); // &Ver Asiento~1|Ver Transferencia de Stock~2
              }
              else {
                D.showDocAux(m_asId, "Asiento");
              }
            }
            else {
              p = M.showInfo(getText(1620, "")); // Debe editar un comprobante guardado para poder ver los documentos auxiliares
            }
            break;

          case Dialogs.Message.MSG_DOC_DOC_EDIT:

            if(m_id) {

              if(m_docEditable) {
                p = M.showInfo(getText(1555, "")); // Este documento puede editarse normalmente
              }
              else {

                p = D.docCanBeSaved(m_dialog, CV.FV_FECHA_IVA).then(function(canBeSaved) {
                  if(canBeSaved) {

                    var editDoc = new Cairo.EditDocumento.Edit.Controller.getEditor();
                    editDoc.setClient(self);
                    editDoc.setUseLegalCurrency(m_defaultCurrency.id === m_lastMonId);
                    editDoc.setCotizacion(val(getCotizacion().getValue()));
                    return editDoc.edit(m_id, m_doctId, true);
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
                D.showDocAux(m_asId, "Asiento");
                break;

              case 2:
                D.showDocAux(m_stId, "Stock");
                break;

              case 3:
                showCobranza();
                break;

              case 4:
                showNotaCredito();
                break;

              case 5:
                getCAE();
                break;
            }

            break;

          case Dialogs.Message.MSG_DOC_DOC_ACTION:

            if(m_id) {

              if(m_doctId !== 7) {
                showMenuDocAction();
              }
              else {
                p = M.showInfo(getText(4896, "")); // Esta opción solo sirve para facturas y notas de debito
              }
            }
            else {
              p = M.showInfo(getText(3955, "")); // Esta opción sólo sirve para modificar documentos guardados
            }
            break;

          case Dialogs.Message.MSG_DOC_HISTORY:

            if(m_id !== NO_ID) {
              p = Cairo.History.show(Cairo.Tables.FACTURAS_DE_VENTA, m_id, m_documento + " " + m_nrodoc);
            }
            else {
              p = M.showInfo(getText(1552, "")); // El documento aun no ha sido guardado
            }
            break;

          case Dialogs.Message.MSG_EXPORT_GET_EMAIL:

            p = D.getEmailFromCliente(getCliId());
            break;

          case Dialogs.Message.MSG_GRID_VIRTUAL_ROW:

            p = processMultiRow(info);
            break;

          case Dialogs.Message.MSG_SAVE_AS:

            // TODO: implement this
            p = saveAsPresupuesto();
            break;

          case Dialogs.Message.MSG_EXPORT_GET_FILE_NAME_POSTFIX:

            p = getFileNamePostFix();
            break;

          case Dialogs.Message.MSG_PRINT_GET_TITLE:

            p = m_nrodoc+ " - "+ m_cliente;
            break;

          case Dialogs.Message.MSG_ABM_KEY_F3:

            // TODO: implement this
            if(info.getKey() === K_CLI_ID) {
              showNewCliente(info);
            }
            break;

          case Dialogs.Message.MSG_TOOLBAR_BUTTON_CLICK:

            if(info === "GRID") {
              p = showSearchZona();
            }
            break;
        }

        return p || P.resolvedPromise();
      };

      var showSearchZona = function() {

        if(m_searchZona === null) {
          m_searchZona = Cairo.SearchZona.Edit.Controller.getEditor();
        }

        if(!m_searchZona.getShowed()) {
          m_searchZona.edit(m_dialog);
        }
      };

      self.discardChanges = function() {
        Cairo.raiseError("FacturaVenta", "DiscardChanges was called");
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
                  m_docSinPerc = valField(response.data, C.DOC_SIN_PERC);
                }
                return response.success;

              })
                .whenSuccess(function() {

                  var p = null;

                  // when the document property is changed and the dialog was
                  // editing a saved invoice we need to move to a new invoice
                  //
                  if(m_id !== NO_ID && m_docId !== m_lastDocId) {

                    if(m_copy) {

                      // don't make questions if we are creating a credit note from an invoice
                      //
                      if(m_fv_id_nc_based) {

                        // Nothing to do

                      }
                      else {

                        // TODO: we need to check:
                        //         - currency hasn't change
                        //         - the user has permission to create new documents
                        //         - the date must be in the range defined by control dates
                        //
                        p = M.confirmViewYesDefault(
                            getText(1622, ""), // CrowSoft
                            getText(1621, "")  // Ud. ha cambiado el documento.;;¿Desea utilizar los datos ya cargados en el formulario para el nuevo comprobante?

                          ).whenSuccess(function() {
                            return self.edit(D.Constants.DOC_CHANGED);
                          });
                      }

                    }
                    else {
                      p = self.edit(D.Constants.DOC_CHANGED);
                    }
                  }

                  return p || P.resolvedPromise(true);

                })
                .whenSuccess(function() {

                  return D.setDocNumberForCliente(m_lastCliId, m_lastDocId, m_dialog)
                    .then(function(info) {

                      m_taPropuesto = info.taEnabled;
                      m_rvTaPropuesto = info.taRemitoEnabled;
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

          case K_CLI_ID:

            setDataCliente().whenSuccess(function() {

              calcularPercepciones();
              updateTotals();

              D.setDocNumberForCliente(m_lastCliId, m_lastDocId, m_dialog)
                .then(function(info) {

                  m_taPropuesto = info.taEnabled;
                  m_rvTaPropuesto = info.taRemitoEnabled;

                }).then(function() {
                  D.showDataAddCliente(Cairo.UserConfig.getShowDataAddInVentas(), m_dialog);
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
                properties.item(CV.FV_FECHA_IVA).setValue(properties.item(CV.FV_FECHA).getValue());
                m_dialog.showValue(properties.item(CV.FV_FECHA_IVA));

                return D.loadPercepcionesForCliente(m_lastCliId, getFecha())
                  .whenSuccessWithResult(function(result) {
                    m_percepciones = result.percepciones;
                    calcularPercepciones();
                    updateTotals();
                  });

              });
            }
            break;

          case K_DEPL_ID:

            p = D.getDepositoFisicoForLogico(getDeplId()).then(function(depfId) {
              m_depfId = depfId;
            });
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

        var cotizacion = 0;
        var totalOrigen = 0;
        var isDefaultCurrency = false;
        var neto = 0;
        var totalOtros = 0;
        var totalPercep = 0;
        var ivaRi = 0;
        var ivaRni = 0;
        var internos = 0;
        var docId = 0;
        var isNew = false;

        p = validateCajaState()
          .whenSuccess(
            call(D.docCanBeEdited, m_docEditable, m_docEditMsg)
          )
          .whenSuccess(
            call(D.docCanBeSaved, m_dialog, CV.FV_FECHA_IVA)
          )
          .whenSuccess(function() {
            if(getItems().getGrid().getRows().count() === 0) {
              M.showWarning(getText(3903, "")); // El documento debe contener al menos un item
              return false;
            }
            else {
              return true;
            }
          })
          .whenSuccess(function() {

            var register = new DB.Register();
            var fields = register.getFields();

            register.setFieldId(CV.FV_ID);
            register.setTable(CV.FACTURA_VENTA);

            register.setPath(m_apiPath + "ventas/facturaventa");

            if(m_copy) {
              register.setId(Cairo.Constants.NEW_ID);
              isNew = true;
            }
            else {
              register.setId(m_id);
              isNew = m_id === NO_ID;
            }

            if(register.getId() === Cairo.Constants.NEW_ID) {
              m_estId = D.Status.pendiente;
            }

            var _count = m_properties.size();
            for(var _i = 0; _i < _count; _i++) {

              var property = m_properties.item(_i);

              switch (property.getKey()) {
                case K_NUMERO:
                  fields.add(CV.FV_NUMERO, property.getValue(), Types.long);
                  break;

                case K_NRODOC:
                  fields.add(CV.FV_NRODOC, property.getValue(), Types.text);
                  break;

                case K_DESCRIP:
                  fields.add(CV.FV_DESCRIP, property.getValue(), Types.text);
                  break;

                case K_FECHA:
                  fields.add(CV.FV_FECHA, property.getValue(), Types.date);
                  break;

                case K_FECHA_ENTREGA:
                  fields.add(CV.FV_FECHA_ENTREGA, property.getValue(), Types.date);
                  break;

                case K_FECHA_IVA:
                  fields.add(CV.FV_FECHA_IVA, property.getValue(), Types.date);
                  break;

                case K_FECHA_VTO:
                  fields.add(CV.FV_FECHA_VTO, property.getValue(), Types.date);
                  break;

                case K_CLI_ID:
                  fields.add(C.CLI_ID, property.getSelectId(), Types.id);
                  break;

                case K_CCOS_ID:
                  fields.add(C.CCOS_ID, property.getSelectId(), Types.id);
                  break;

                case K_SUC_ID:
                  fields.add(C.SUC_ID, property.getSelectId(), Types.id);
                  break;

                case K_DESCUENTO1:
                  fields.add(CV.FV_DESCUENTO1, property.getValue(), Types.currency);
                  break;

                case K_DESCUENTO2:
                  fields.add(CV.FV_DESCUENTO2, property.getValue(), Types.currency);
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
                  fields.add(CV.FV_COTIZACION, property.getValue(), Types.double);
                  break;

                case K_VEN_ID:
                  fields.add(C.VEN_ID, property.getSelectId(), Types.id);
                  break;

                case K_LGJ_ID:
                  fields.add(C.LGJ_ID, property.getSelectId(), Types.id);
                  break;

                case K_CAI:
                  fields.add(CV.FV_CAI, property.getValue(), Types.text);
                  break;

                case K_PRO_ID_ORIGEN:
                  fields.add(C.PRO_ID_ORIGEN, property.getSelectId(), Types.id);
                  break;

                case K_PRO_ID_DESTINO:
                  fields.add(C.PRO_ID_DESTINO, property.getSelectId(), Types.id);
                  break;

                case K_TRANS_ID:
                  fields.add(C.TRANS_ID, property.getSelectId(), Types.id);
                  break;

                case K_CLIS_ID:
                  fields.add(C.CLIS_ID, property.getSelectId(), Types.id);
                  break;

                case K_DEPL_ID:
                  fields.add(C.DEPL_ID, property.getSelectId(), Types.id);
                  break;

                case K_ORDENCOMPRA:
                  fields.add(CV.FV_ORDEN_COMPRA, property.getValue(), Types.text);
                  break;
              }
            }

            isDefaultCurrency = m_defaultCurrency.id === m_lastMonId;
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
                  fields.add(CV.FV_NETO, neto * cotizacion, Types.currency);
                  break;

                case K_IVA_RI:
                  ivaRi = val(property.getValue());
                  fields.add(CV.FV_IVA_RI, ivaRi * cotizacion, Types.currency);
                  break;

                case K_IVA_RNI:
                  ivaRni = val(property.getValue());
                  fields.add(CV.FV_IVA_RNI, ivaRni * cotizacion, Types.currency);
                  break;

                case K_INTERNOS:
                  internos = val(property.getValue());
                  fields.add(CV.FV_INTERNOS, internos * cotizacion, Types.currency);
                  break;

                case K_SUBTOTAL:
                  fields.add(CV.FV_SUBTOTAL, val(property.getValue()) * cotizacion, Types.currency);
                  break;

                case K_IMPORTE_DESC_1:
                  fields.add(CV.FV_IMPORTE_DESC_1, val(property.getValue()) * cotizacion, Types.currency);
                  break;

                case K_IMPORTE_DESC_2:
                  fields.add(CV.FV_IMPORTE_DESC_2, val(property.getValue()) * cotizacion, Types.currency);
                  break;

                case K_TOTAL_PERCEPCIONES:
                  totalPercep = val(property.getValue());
                  fields.add(CV.FV_TOTAL_PERCEPCIONES, totalPercep * cotizacion, Types.currency);
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

            fields.add(CV.FV_TOTAL, totalOrigen * cotizacion, Types.currency);
            fields.add(CV.FV_GRABAR_ASIENTO, 1, Types.boolean);
            fields.add(C.EST_ID, m_estId, Types.id);

            if(isDefaultCurrency) {
              fields.add(CV.FV_TOTAL_ORIGEN, 0, Types.currency);
            }
            else {
              fields.add(CV.FV_TOTAL_ORIGEN, totalOrigen, Types.currency);
            }

            saveItems(register, cotizacion, isDefaultCurrency);
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

                    if(result.errors.factura_duplicada) {
                      return showFacturaDuplicada(result.errors.factura_duplicada);
                    }
                    else {
                      return M.showWarningWithFalse(result.errors.getMessage());
                    }
                  }
                  else {

                    m_copy = false;
                    Cairo.navigate(NO_ID);

                    return load(result.data.getId()).then(
                      function(success) {

                        var p = null;

                        if(success) {

                          Cairo.navigate(self.getPath());
                          if(m_listController !== null) {
                            updateList();
                            m_listController.updateEditorKey(self, m_id);
                          }

                          if(isNew) {

                            if(Cairo.UserConfig.getPrintInNewFv()) {
                              p = m_dialog.printDocument();
                            }
                            else {
                              p = P.resolvedPromise();
                            }

                            p = p.then(function() {
                              var p = null;

                              if(Cairo.getVentasConfig().isCobranzaPorCajero()) {

                                var ctaCte = false;

                                if(Cairo.getVentasConfig().ventasPorHojadeRuta()) {
                                  p = M.confirmViewNoDefault("", getText(5112, "")) // Envia la factura a una Hoja de Ruta
                                    .then(function(answer) {
                                      ctaCte = answer;
                                    });
                                }

                                p = p || P.resolvedPromise();

                                p = p.then(function() {
                                  return D.saveFacturaVentaCajero(m_id, m_cjId, ctaCte);
                                });

                              }
                              else {
                                p = D.isCobranzaContado(m_id).then(function(result) {
                                  if(result) {
                                    return D.showCobranzaContado(
                                      m_cliId, m_id, m_fecha, m_total * cotizacion,
                                      m_sucId, m_ccosId, m_lgjId, m_cjId);
                                  }
                                });
                              }
                              return p;
                            });
                          }
                          else {
                            p = P.resolvedPromise();
                          }

                          p = p.then(function() {
                            if(m_isNew) {
                              m_dialog.setSendNewDoc(Cairo.UserConfig.getNuevoAlGrabar());
                            }
                            else {
                              m_dialog.setSendNewDoc(false);
                            }
                            notifyHojaRuta();
                          });
                        }
                        else {
                          p = P.resolvedPromise();
                        }

                        return p.then(function() {
                          m_isNew = false;
                          return success;
                        });
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

      var notifyHojaRuta = function() {
        try {
          if(m_hojaRuta !== null) {
            m_hojaRuta.addFvId(m_id);
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "pNotifyHojaRuta", C_MODULE, "");
        }
      };

      var showFacturaDuplicada = function(info) {
        var msg = getText(1647, "",
          valField(info, CV.FV_NRODOC),
          valField(info, C.CLI_ID),
          valField(info, C.DOC_NAME),
          valField(info, CV.FV_FECHA)
        );

        // La factura " nroDoc " pertenece al cliente " cliName
        // " en el documento " docName " generada el " fvFecha

        return M.showWarningWithFalse(msg);
      };

      var updateList = function() {
        try {
          if(m_id === NO_ID) { return; }
          if(m_listController === null) { return; }

          if(m_isNew) {
            m_listController.addItem(m_id);
          }
          else {
            m_listController.refreshItem(m_id);
          }
        }
        catch(ignore) {
          Cairo.logError("Can't update list", ignore);
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
        return "#venta/facturadeventa/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "facturaventa" + id;
      };

      self.getTitle = function() {
        return TITLE + (m_id !== NO_ID ? " " + m_nrodoc + " - " + m_cliente : "");
      };

      self.getTabTitle = function() {
        return "FV-" + m_numero;
      };

      self.validate = function() {

        for(var _i = 0, _count = m_properties.size(); _i < _count; _i++) {

          var property = m_properties.item(_i);

          switch (property.getKey()) {

            case K_FECHA:
              if(valEmpty(property.getValue(), Types.date)) {
                return M.showInfoWithFalse(getText(1558, "")); // Debe indicar una fecha
              }
              break;

            case K_FECHA_ENTREGA:
              if(valEmpty(property.getValue(), Types.date)) {
                return M.showInfoWithFalse(getText(1564, "")); // Debe indicar una fecha de entrega
              }
              break;

            case K_FECHA_VTO:
              if(valEmpty(property.getValue(), Types.date) && property.getVisible()) {
                return M.showInfoWithFalse(getText(1625, "")); // Debe indicar una fecha de vencimiento
              }
              break;

            case K_CLI_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                return M.showInfoWithFalse(getText(1563, "")); // Debe indicar un cliente
              }
              break;

            case K_DOC_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                return M.showInfoWithFalse(getText(1562, "")); // Debe indicar un documento
              }
              break;

            case K_CPG_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                return M.showInfoWithFalse(getText(1561, "")); // Debe indicar una condición de pago
              }
              break;

            case K_SUC_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                return M.showInfoWithFalse(getText(1560, "")); // Debe indicar una sucursal
              }
              break;

            case K_COTIZACION:
              if(valEmpty(property.getValue(), Types.double) && property.getVisible()) {
                return M.showInfoWithFalse(getText(1620, "")); // Debe indicar una cotización
              }
              break;

            case K_DEPL_ID:
              if(valEmpty(property.getSelectId(), Types.id) && m_showStockData) {
                return M.showInfoWithFalse(getText(1559, "")); // Debe indicar un deposito
              }
              break;
          }
        }

        return validateCuentaMoneda().whenSuccess(function() {
          if(m_dialog.getSavingAs() !== true) {
            return validateCuit(getCliId());
          }
          else {
            return true;
          }
        });
      };

      var validateCuit = function(cliId) {
        var p = null;

        if(cliId !== NO_ID) {

          p = DB.getData("load[" + m_apiPath + "general/cliente/" + cliId.toString() + "/validate_cuit]");

          p = p.then(function(response) {

            if(response.success === true) {
              if(valField(response.data, C.IS_VALID)) {
                return true;
              }
              else {
                return M.showWarningWithFalse(getText(1627, "")); // Para poder crear la factura debe dar de alta el CUIT del cliente
              }
            }
            else {
              // TODO: add this message to language
              return M.showWarningWithFalse(getText(1, "")); // No se pudo obtener el Cuit del Cliente
            }
          });
        }

        return p || P.resolvedPromise(true);
      };

      var validateCuentaMoneda = function() {

        var validate = function(result) {

          if(result.monId !== m_lastMonId) {
            return M.showInfoWithFalse(getText(1629, "")); // La cuenta asociada al Cliente y la cuenta del documento tienen diferentes monedas
          }
          return true;
        };

        return getCueIdCliente().whenSuccessWithResult(validate, false);
      };

      self.isEmptyRow = function(key, row, rowIndex) {
        var isEmpty = true;

        try {

          switch (key) {
            case K_ITEMS:
              isEmpty = isEmptyRowItems(row, rowIndex);
              break;

            case K_PERCEPCIONES:
              isEmpty = Percepciones.isEmptyRowPercepciones(row, rowIndex);
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "isEmptyRow", C_MODULE, "");
        }

        return P.resolvedPromise(isEmpty);
      };

      self.docId = function() {
        return m_docId;
      };

      self.doctId = function() {
        return m_doctId;
      };

      self.id = function() {
        return m_id;
      };

      self.loadForPrint = function(id) {
        var loadData = function(response) {
          try {

            m_id = id;
            m_docId = valField(response.data, C.DOC_ID);
            m_doctId = valField(response.data, C.DOCT_ID);
            m_cliId = valField(response.data, C.CLI_ID);
            m_cliente = valField(response.data, C.CLI_NAME);
            m_nrodoc = valField(response.data, CV.FV_NRODOC);

            return true;

          }
          catch(ex) {
            Cairo.manageErrorEx(ex.message, ex, "loadForPrint", C_MODULE, "");
          }

          return false;
        };

        var p = DB.getData("load[" + m_apiPath + "ventas/facturaventa/info]", id)
          .whenSuccessWithResult(loadData, false);

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
          m_isNew = (id === NO_ID || id === D.Constants.DOC_CHANGED);

          var loadAllItems = function() {
            if(m_itemsProps.count() > 0) {
              var cotizacion = 0;
              if(m_cotizacion !== 0) {
                cotizacion = m_cotizacion;
              }
              else {
                cotizacion = 1;
              }
              loadItems(getItems(), cotizacion);
              loadPercepciones(getPercepciones(), cotizacion);
            }
            return P.resolvedPromise(true);
          };

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
            if(id !== D.Constants.DOC_CHANGED && m_isNew && docDesdePedido()) {

              showStartWizardPedido();
            }
            else if(id !== D.Constants.DOC_CHANGED && m_isNew && docDesdeRemito()) {

              showStartWizardRemito();
            }
            else if(id !== D.Constants.DOC_CHANGED && m_isNew && docDesdePacking()) {

              showStartWizardPackingList();
            }
            else if(id !== D.Constants.DOC_CHANGED && m_isNew && docDesdeProyecto()) {

              showStartWizardProyecto();
            }
            else {

              m_dialog.setNewPropertyKeyFocus(C.CLI_ID);
            }

            m_editing = true;
            m_copy = false;

            Cairo.navigate(self.getPath());

            return true;
          };

          p = load(id).whenSuccess(loadAllItems, false).whenSuccess(afterLoad, false);
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
        try {

          switch (key) {

            case K_ITEMS:

              var property = m_itemsProps.item(C_ITEMS);
              showImporteAndIva(property.getGrid().getRows().item(lRow));
              calcularPercepciones();
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

        return P.resolvedPromise(true);
      };

      var processMultiRow = function(virtualRow) {
        var p = null;

        virtualRow.setSuccess(false);

        switch (virtualRow.getInfo().key) {
          case K_ITEMS:
            var items = getItems();

            var row = null;
            row = items.getGrid().getRows().item(virtualRow.getInfo().row);

            if(row.item(virtualRow.getInfo().col).getKey() === KI_PR_ID) {

              var cell = getCell(row, KI_PR_ID);

              if(cell.getSelectIntValue() !== "") {
                if(cell.getSelectIntValue().indexOf(",", 1) >= 0) {
                  p = Cairo.Selections.addMultiRowsSale(cell.getSelectIntValue(), virtualRow, KI_CANTIDAD);
                }
              }
            }
            break;
        }

        return p || P.resolvedPromise(virtualRow);
      };

      self.columnAfterEdit = function(key, lRow, lCol, newValue, newValueId) {
        var p = null;

        try {

          switch (key) {

            case K_ITEMS:
              var property = getProperty(m_items, C_ITEMS);
              p = columnAfterEditItems(property, lRow, lCol, newValue, newValueId);
              break;

            case K_PERCEPCIONES:
              var property = m_itemsProps.item(C_PERCEPCIONES);
              p = Percepciones.columnAfterEditPercepciones(property, lRow, lCol, newValue, newValueId);
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

            case K_PERCEPCIONES:
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

            var row = grid.getRows().item(lRow);
            if(row !== null) {
              rtn = cellId(row, KI_PR_LLEVA_NRO_SERIE) !== 0;
            }
            break;

          case KI_STL_ID:

            row = property.getGrid().getRows().item(lRow);

            if(row !== null) {

              if(cellId(row, KI_PR_LLEVALOTE) !== 0
                && cellId(row, KI_PR_LLEVA_NRO_SERIE) === 0) {

                var prIdKit = null;
                if(cellId(row, KI_ES_KIT)) {
                  prIdKit = cellId(row, KI_PR_ID);
                }

                var column = grid.getColumns().item(C.STL_ID);
                column.setSelectFilter("'pr_id = " + cellId(row, KI_PR_ID).toString()
                  + " and "
                  + D.getStockLoteFilterEx(
                      getDeplId(),
                      Cairo.getStockConfig().getStockFisico(),
                      prIdKit,
                      m_depfId,
                      getCliId(),
                      NO_ID
                    )
                  + "'");

                m_dialog.refreshColumnProperties(property, C.STL_ID);

                rtn = true;
              }
            }
            break;

          default:

            rtn = true;
            break;
        }

        return rtn;
      };

      var getPrecioFromRow = function(row) {
        var precio;

        var cell = getCell(row, KI_PRECIO_USR);
        if(Cairo.Util.isNumeric(cell.getValue())) {
          precio = val(cell.getValue());
        }
        else {
          precio = 0;
        }

        return precio;
      };

      var columnAfterEditItems = function(property, lRow, lCol, newValue, newValueId) {

        var p = null;
        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).getKey()) {

          case KI_PR_ID:

            Cairo.LoadingMessage.show("Factura de Ventas", "Loading data for product.");

            var row = grid.getRows().item(lRow);
            p = setDataProducto(row, newValueId)
              .whenSuccess(
                call(
                  D.setPrecios, row, newValueId, m_properties.item(C.LP_ID).getSelectId(), KI_PRECIO_LP, KI_PRECIO_USR
                )
              )
              .whenSuccess(
                call(
                  D.setDescuentos, row, newValueId, getPrecioFromRow(row),
                  m_properties.item(C.LD_ID).getSelectId(), KI_DESCUENTO, KI_PRECIO
                )
              )
              .whenSuccess(call(setTasasImpositivas, row, newValueId, newValue))
              .then(function(result) { Cairo.LoadingMessage.close(); return result; });
            break;

          case KI_PRECIO_USR:

            var row = grid.getRows().item(lRow);
            p = D.setDescuentos(
              row, cellId(row, KI_PR_ID), newValue,
              m_properties.item(C.LD_ID).getSelectId(), KI_DESCUENTO, KI_PRECIO
            );
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
                    row, m_serialNumbers, KI_GRUPO, KI_NRO_SERIE, lRow, prId, getDeplId(),
                    false, false, false, D.getKitInfo(prId, m_kitDefinitions), NO_ID, getCliId());
                }
                break;
            }
            break;
        }

        return p || P.resolvedPromise(false);
      };

      self.columnClick = function(key, lRow, lCol) {

      };

      self.gridDblClick = function(key, lRow, lCol) {
        return P.resolvedPromise(false);
      };

      self.deleteRow = function(key, row, lRow) {

        switch (key) {

          case K_ITEMS:

            var id = cellFloat(row, KI_FVI_ID);
            if(id !== NO_ID) { m_itemsDeleted = m_itemsDeleted+ id.toString()+ ","; }
            break;

          case K_PERCEPCIONES:

            var id = cellFloat(row, Percepciones.KIP_FVPERC_ID);
            if(id !== NO_ID) { m_percepcionesDeleted = m_percepcionesDeleted+ id.toString()+ ","; }
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

            case K_ITEMS:
              p = validateRowItems(row, rowIndex);
              break;

            case K_PERCEPCIONES:
              p = Percepciones.validateRowPercepciones(row, rowIndex);
              break;
          }

        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "validateRow", C_MODULE, "");
        }

        return p || P.resolvedPromise(false);
      };

      var isEmptyRowItems = function(row, rowIndex) {

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KI_CANTIDAD:
              if(!valEmpty(cell.getValue(), Types.currency)) {
                if(val(cell.getValue()) !== 1) {
                  return false;
                }
              }
              break;

            case KI_PRECIO:
              if(!valEmpty(cell.getValue(), Types.currency)) {
                return false;
              }
              break;

            case KI_PR_ID:
              if(!valEmpty(cell.getId(), Types.id)) {
                return false;
              }
              break;
          }
        }

        return true;
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
              if(valEmpty(cell.getValue(), Types.currency)) {
                return M.showInfoWithFalse(getText(1365, "", strRow)); // Debe indicar una cantidad (1)
              }
              break;

            case KI_PRECIO:
              if(valEmpty(cell.getValue(), Types.currency)) {
                return M.showInfoWithFalse(getText(1631, "", strRow)); // Debe indicar un precio (1)
              }
              break;

            case KI_PR_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(1899, "", strRow)); // Debe indicar un producto de Compra (1)
              }
              break;

            case KI_NRO_SERIE:
              llevaNroSerie = cellId(row, KI_PR_LLEVA_NRO_SERIE) !== 0;
              if(m_showStockData && valEmpty(cell.getValue(), Types.text) && llevaNroSerie) {
                return M.showInfoWithFalse(getText(1630, "", strRow)); // Debe indicar un numero de serie (1)
              }
              break;

            case KI_STL_ID:
              if(m_showStockData) {
                if(valEmpty(cell.getId(), Types.id)
                  && cellId(row, KI_PR_LLEVALOTE)
                  && cellId(row, KI_PR_LLEVALOTE) === 0
                  && cellId(row, KI_PR_LOTEFIFO) === 0) {
                  return M.showInfoWithFalse(getText(1632, "", strRow)); // Debe indicar un lote (1)
                }
              }
              break;

            case KI_TO_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(1633, "", strRow)); // Debe indicar un tipo de operación (1)
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
            KI_PR_ID, KI_CANTIDAD, KI_NRO_SERIE, prId, getDeplId(), false);
        }

        return p || P.resolvedPromise(true);
      };

      var loadCollection = function() {

        var cotizacion = 0;
        var validateDocDefault = false;
        var elem;

        if(Cairo.UserConfig.getShowSaveAs()) {

          m_dialog.setButtonsEx2(Dialogs.Buttons.BUTTON_SAVE_AS);
          m_dialog.setButtonsEx3(Dialogs.Buttons.BUTTON_GRID);
          m_dialog.initButtons();

        }

        m_dialog.setSendNewDoc(Cairo.UserConfig.getNuevoAlGrabar());

        var properties = m_properties;
        properties.clear();

        var tabs = m_dialog.getTabs();
        tabs.clear();

        tabs.add(null).setIndex(0).setName(Cairo.Constants.TAB_GENERAL);
        tabs.add(null).setIndex(1).setName(getText(1566, "")); // Adicionales
        tabs.add(null).setIndex(2).setName(getText(4909, "")); // Descuentos
        tabs.add(null).setIndex(3).setName(getText(1861, "")); // Observaciones

        elem = properties.add(null, C.DOC_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(getText(1567, "")); // Documento
        elem.setKey(K_DOC_ID);

        if(m_docId !== NO_ID) {
          elem.setSelectId(m_docId);
          elem.setValue(m_documento);
        }
        else {
          // user preferences
          //
          elem.setSelectId(Cairo.UserConfig.getDocFvId());
          elem.setValue(Cairo.UserConfig.getDocFvNombre());

          validateDocDefault = elem.getSelectId() !== NO_ID;
        }

        elem.setSelectFilter(D.FACTURA_VENTAS_DOC_FILTER);

        elem = properties.add(null, Cairo.Constants.NUMBER_ID);
        elem.setType(T.numeric);
        elem.setSubType(ST.integer);
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

        elem = properties.add(null, CV.FV_FECHA);
        elem.setType(T.date);
        elem.setName(getText(1569, "")); // Fecha
        elem.setKey(K_FECHA);
        elem.setValue(m_fecha);

        elem = properties.add(null, CV.FV_FECHA_ENTREGA);
        elem.setType(T.date);
        elem.setName(getText(1570, "")); // Entrega
        elem.setKey(K_FECHA_ENTREGA);
        elem.setValue(m_fechaentrega);

        elem = properties.add(null, C.CLI_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CLIENTE);
        elem.setName(getText(1150, "")); // Cliente
        elem.setKey(K_CLI_ID);
        elem.setSelectId(m_cliId);
        elem.setValue(m_cliente);
        m_dialog.setNewPropertyKeyFocus(C.CLI_ID);

        elem = properties.add(null, CV.FV_NRODOC);
        elem.setType(T.text);
        elem.setName(getText(1065, "")); // Número
        elem.setSize(50);
        elem.setKey(K_NRODOC);
        elem.setValue(m_nrodoc);
        elem.setTextMask(m_taMascara);
        elem.setTextAlign(Dialogs.TextAlign.right);

        elem = properties.add(null, C.CPG_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CONDICIONES_DE_PAGO);
        elem.setName(getText(1571, "")); // Cond. pago
        elem.setKey(K_CPG_ID);
        elem.setSelectId(m_cpgId);
        elem.setValue(m_condicionPago);

        elem = properties.add(null, CV.FV_FECHA_VTO);
        elem.setType(T.date);
        elem.setName(getText(1634, "")); // Vto.
        elem.setKey(K_FECHA_VTO);
        elem.setValue(m_fechaVto);

        elem = properties.add(null, CV.FV_COTIZACION);
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setName(getText(1635, "")); // Cotización
        elem.setFormat(Cairo.Settings.getCurrencyRateDecimalsFormat());
        elem.setKey(K_COTIZACION);
        elem.setValue(m_cotizacion);

        if(m_cotizacion !== 0) {
          cotizacion = m_cotizacion;
        }
        else {
          cotizacion = 1;
        }

        elem = properties.add(null, CV.FV_DESCUENTO1);
        elem.setType(T.numeric);
        elem.setSubType(ST.percentage);
        elem.setName(getText(1573, "")); // Desc. 1
        elem.setKey(K_DESCUENTO1);
        elem.setValue(m_descuento1);
        elem.setTabIndex(2);

        elem = properties.add(null, CV.FV_DESCUENTO2);
        elem.setType(T.numeric);
        elem.setSubType(ST.percentage);
        elem.setName("2");
        elem.setKey(K_DESCUENTO2);
        elem.setValue(m_descuento2);
        elem.setTabIndex(2);

        elem = properties.add(null, C.LP_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LISTAS_DE_PRECIOS);
        elem.setName(getText(1397, "")); // Lista de Precios
        elem.setSelectFilter(D.getListaPrecioForCliente(m_docId, m_cliId));
        elem.setKey(K_LP_ID);
        elem.setSelectId(m_lpId);
        elem.setValue(m_listaPrecio);
        elem.setTabIndex(2);

        elem = properties.add(null, C.LD_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LISTAS_DE_DESCUENTOS);
        elem.setName(getText(4984, "")); // Lista de Descuentos
        elem.setSelectFilter(D.getListaDescuentoForCliente(m_docId, m_cliId));
        elem.setKey(K_LD_ID);
        elem.setSelectId(m_ldId);
        elem.setValue(m_listaDescuento);
        elem.setTabIndex(2);

        elem = properties.add(null, C.VEN_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.VENDEDOR);
        elem.setName(getText(1510, "")); // Vendedor
        elem.setKey(K_VEN_ID);
        elem.setSelectId(m_venId);
        elem.setValue(m_vendedor);
        elem.setTabIndex(1);

        elem = properties.add(null, C.SUC_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.SUCURSAL);
        elem.setName(getText(1281, "")); // Sucursal
        elem.setKey(K_SUC_ID);
        elem.setSelectId(m_sucId);
        elem.setValue(m_sucursal);

        elem = properties.add(null, CV.FV_DESCRIP);
        elem.setType(T.text);
        elem.setSubType(ST.memo);
        elem.setName(getText(1211, "")); // Observ.
        elem.setSize(5000);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);
        elem.setTabIndex(3);

        elem = properties.add(null, C.LGJ_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LEGAJOS);
        elem.setName(getText(1575, "")); // Legajo
        elem.setKey(K_LGJ_ID);
        elem.setSelectId(m_lgjId);
        elem.setValue(m_legajo);
        elem.setTabIndex(1);

        elem = properties.add(null, C.CLIS_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.SUCURSALES_DE_CLIENTES);
        elem.setName(getText(1576, "")); // Sucursal del Cliente
        elem.setKey(K_CLIS_ID);
        elem.setValue(m_clienteSucursal);
        elem.setSelectId(m_clisId);
        elem.setSelectFilter(D.getSelectFilterSucursalCliente(m_cliId));
        elem.setTabIndex(1);

        elem = properties.add(null, C.TRANS_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.TRANSPORTE);
        elem.setName(getText(1050, "")); // Transporte
        elem.setKey(K_TRANS_ID);
        elem.setValue(m_transporte);
        elem.setSelectId(m_transId);
        elem.setTabIndex(1);

        elem = properties.add(null, CV.FV_ORDEN_COMPRA);
        elem.setType(T.text);
        elem.setName(getText(1924, "")); // Orden de Compra
        elem.setKey(K_ORDENCOMPRA);
        elem.setValue(m_ordenCompra);
        elem.setTabIndex(1);

        elem = properties.add(null, C.PRO_ID_ORIGEN);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PROVINCIA);
        elem.setName(getText(1577, "")); // Pcia. Origen
        elem.setKey(K_PRO_ID_ORIGEN);
        elem.setSelectId(m_proIdOrigen);
        elem.setValue(m_proOrigen);
        elem.setTabIndex(1);

        elem = properties.add(null, C.PRO_ID_DESTINO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PROVINCIA);
        elem.setName(getText(1578, "")); // Pcia. Destino
        elem.setKey(K_PRO_ID_DESTINO);
        elem.setSelectId(m_proIdDestino);
        elem.setValue(m_proDestino);
        elem.setTabIndex(1);

        elem = properties.add(null, CV.FV_CAI);
        elem.setType(T.text);
        elem.setName(getText(1636, "")); // Cai
        elem.setKey(K_CAI);
        elem.setValue(m_cai);
        elem.setTabIndex(1);

        elem = properties.add(null, C.DEPL_ID_ORIGEN);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.DEPOSITO_LOGICO);
        elem.setName(getText(1574, "")); // Deposito
        elem.setKey(K_DEPL_ID);

        if(m_deplId !== NO_ID || !m_showStockData) {
          elem.setSelectId(m_deplId);
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

        elem = properties.add(null, C.CCOS_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CENTROS_DE_COSTO);
        elem.setName(getText(1057, "")); // Centro de Costo
        elem.setKey(K_CCOS_ID);
        elem.setSelectId(m_ccosId);
        elem.setValue(m_centroCosto);
        elem.setTabIndex(1);

        elem = properties.add(null, CV.RV_NRODOC);
        elem.setType(T.text);
        elem.setName(getText(1637, "")); // Remito
        elem.setSize(50);
        elem.setKey(K_RV_NRODOC);
        elem.setTextMask("");
        elem.setTextAlign(Dialogs.TextAlign.right);
        elem.setTabIndex(1);

        elem = properties.add(null, CV.FV_FECHA_IVA);
        elem.setType(T.date);
        elem.setName(getText(1638, "")); // Fecha IVA
        elem.setKey(K_FECHA_IVA);
        elem.setValue(m_fechaIva);
        elem.setTabIndex(1);

        if(Cairo.UserConfig.getShowDataAddInVentas()) {

          elem = properties.add(null, CV.CLIENTE_DATA_ADD);
          elem.setType(T.text);
          elem.setSubType(ST.memo);
          elem.setTabIndex(3);

        }

        elem = properties.add(null, Cairo.Constants.HIDE_COLUMNS);
        elem.setType(T.check);
        elem.setName(getText(3901, "")); // Ocultar Columnas
        elem.setKey(K_HIDECOLS);
        elem.setValue(true);
        elem.setIsEditProperty(false);

        if(m_cajaMsg !== "") {

          elem = properties.add(null, C_CAJAMSG);
          elem.setType(T.label);
          elem.setValue(m_cajaMsg);
          elem.setTextAlign(Dialogs.TextAlign.center);

          if(m_bCajaError) {
            elem.setForeColor("red");
          }
        }

        if(!m_dialog.show(self)) { return false; }

        /////////////////////////////////////////////////////////////////////
        // ITEMS
        /////////////////////////////////////////////////////////////////////

        tabs = m_items.getTabs();
        tabs.clear();

        tabs.add(null).setIndex(0).setName(getText(1371, "")); // Items
        tabs.add(null).setIndex(1).setName(getText(1248, "")); // Percepciones

        properties = m_itemsProps;
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

        elem = properties.add(null, C_PERCEPCIONES);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridPercepciones(elem);
        loadPercepciones(elem, cotizacion);
        elem.setName(C_PERCEPCIONES);
        elem.setKey(K_PERCEPCIONES);
        elem.setTabIndex(1);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_percepcionesDeleted = "";

        if(!m_items.show(self)) { return false; }

        /////////////////////////////////////////////////////////////////////
        // FOOTER
        /////////////////////////////////////////////////////////////////////

        properties = m_footerProps;
        properties.clear();

        elem = properties.add(null, CV.FV_SUBTOTAL);
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setName(getText(1579, "")); // Sub Total
        elem.setKey(K_SUBTOTAL);
        elem.setValue(m_subTotal);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.FV_IMPORTE_DESC_1);
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setName(getText(1573, "")); // Desc. 1
        elem.setKey(K_IMPORTE_DESC_1);
        elem.setValue(m_importeDesc1);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.FV_IMPORTE_DESC_2);
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setName(getText(1580, "")); // Desc. 2
        elem.setKey(K_IMPORTE_DESC_2);
        elem.setValue(m_importeDesc2);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.FV_NETO);
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setName(getText(1581, "")); // Neto
        elem.setKey(K_NETO);
        elem.setValue(m_neto);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.FV_IVA_RI);
        elem.setType(T.numeric);
        elem.setName(getText(1582, "")); // IVA RI
        elem.setSubType(ST.money);
        elem.setKey(K_IVA_RI);
        elem.setValue(m_ivari);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.FV_INTERNOS);
        elem.setType(T.numeric);
        elem.setName(getText(4914, "")); // Internos
        elem.setSubType(ST.money);
        elem.setKey(K_INTERNOS);
        elem.setValue(m_internos);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.FV_IVA_RNI);
        elem.setType(T.numeric);
        elem.setName(getText(1583, "")); // IVA RNI
        elem.setSubType(ST.money);
        elem.setKey(K_IVA_RNI);
        elem.setValue(m_ivarni);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.FV_TOTAL_PERCEPCIONES);
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setName(getText(1248, "")); // Percepciones
        elem.setSubType(ST.money);
        elem.setKey(K_TOTAL_PERCEPCIONES);
        elem.setValue(m_totalPercepciones);
        elem.setEnabled(false);

        elem = properties.add(null, CV.FV_TOTAL);
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setName(getText(1584, "")); // Total
        elem.setSubType(ST.money);
        elem.setKey(K_TOTAL);
        elem.setValue(m_total);
        elem.setEnabled(false);

        setEnabled();

        if(!m_footer.show(self)) { return false; }

        if(validateDocDefault) {
          self.propertyChange(K_DOC_ID);
        }

        showCotizacion();

        D.showDataAddCliente(Cairo.UserConfig.getShowDataAddInVentas(), m_dialog);

        setColorBackground();

        return true;
      };

      var getDocId = function() {
        return m_dialog.getProperties().item(C.DOC_ID);
      };

      var getCotizacion = function() {
        return m_properties.item(CV.FV_COTIZACION);
      };

      var showCotizacion = function() {

        var p = null;
        var monId;

        if(m_id === NO_ID) {
          if(m_lastDocId === NO_ID) { return; }
          monId = m_lastMonId;
        }
        else {
          monId = m_monId;
        }

        var property = getCotizacion();
        property.setVisible(monId !== m_defaultCurrency.id);

        if(monId === m_defaultCurrency.id) {
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
        var property = m_properties.item(CV.FV_FECHA_VTO);
        property.setVisible(esLibre);
        m_dialog.showValue(property);
      };

      var getCondicionPago = function() {
        return m_dialog.getProperties().item(C.CPG_ID);
      };

      var setGridItems = function(property) {

        var elem;
        var hideColumns = m_properties.item(Cairo.Constants.HIDE_COLUMNS).getValue();
        var bColVisible = val(hideColumns) === 0;

        var grid = property.getGrid();

        var columns = grid.getColumns();
        columns.clear();

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_FVI_ID);

        elem = columns.add(null);
        elem.setName(getText(1367, "")); // Articulo
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PRODUCTOS_DE_VENTA);
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
        elem.setSubType(ST.textButtonEx);
        elem.setKey(KI_DESCRIP);

        elem = columns.add(null);
        elem.setName(getText(1374, "")); // Cantidad
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());
        elem.setType(T.numeric);
        elem.setSubType(ST.double);
        elem.setKey(KI_CANTIDAD);

        elem.setDefaultValue(Grids.createCell());
        elem.getDefaultValue().setValue(1);

        elem = columns.add(null);
        elem.setName(getText(1639, "")); // Nro. Serie
        elem.setType(T.text);
        elem.setSubType(ST.textButton);
        elem.setKey(KI_NRO_SERIE);
        elem.setVisible(m_showStockData);

        elem = columns.add(null, C.STL_ID);
        elem.setName(getText(1640, "")); // Lote
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LOTES_DE_STOCK);
        elem.setKey(KI_STL_ID);
        elem.setVisible(m_showStockData);

        elem = columns.add(null);
        elem.setName(getText(1585, "")); // Descuento
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(ST.money);
        elem.setKey(KI_DESCUENTO);
        elem.setEnabled(false);
        elem.setVisible(bColVisible);

        elem = columns.add(null);
        elem.setName(getText(1165, "")); // Unidad
        elem.setType(T.text);
        elem.setKey(KI_UNIDAD);
        elem.setEnabled(false);
        elem.setVisible(bColVisible);

        elem = columns.add(null);
        elem.setName(getText(1587, "")); // Precio (LP)
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KI_PRECIO_LP);
        elem.setEnabled(false);
        elem.setVisible(bColVisible);

        elem = columns.add(null);
        elem.setName(getText(1586, "")); // Precio
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KI_PRECIO_USR);
        elem.setEnabled(Cairo.Security.silentHasPermissionTo(CS.EDIT_PRICE_FAC));

        elem = columns.add(null);
        elem.setName(getText(1588, "")); // Precio c/desc.
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KI_PRECIO);
        elem.setEnabled(false);
        elem.setVisible(bColVisible);

        elem = columns.add(null);
        elem.setName(getText(1581, "")); // Neto
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KI_NETO);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1582, "")); // IVA RI
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KI_IVA_RI);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1583, "")); // IVA RNI
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(ST.money);
        elem.setKey(KI_IVA_RNI);
        elem.setEnabled(false);
        elem.setVisible(bColVisible);

        elem = columns.add(null);
        elem.setName(getText(4914, "")); // Internos
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(ST.money);
        elem.setKey(KI_INTERNOS);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(ST.money);
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
        elem.setName(getText(1492, "")); // Tipo Operación
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.TIPOOPERACION);
        elem.setDefaultValue(Grids.createCell());
        var defaultValue = elem.getDefaultValue();
        defaultValue.setId(Cairo.Documents.Constants.TO_COMERCIAL_ID);
        defaultValue.setValue(Cairo.Documents.Constants.TO_COMERCIAL);
        elem.setKey(KI_TO_ID);
        elem.setVisible(bColVisible);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PR_LLEVALOTE);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PR_LOTEFIFO);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PR_LLEVA_NRO_SERIE);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_ES_KIT);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_GRUPO);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_NOSTOCK);

        grid.getRows().clear();
      }

      var loadItems = function(property, cotizacion) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();

        for(var _i = 0, count = m_data.items.length; _i < count; _i += 1) {

          var row = rows.add(null, getValue(m_data.items[_i], CV.FVI_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.FVI_ID));
          elem.setKey(KI_FVI_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], C.PR_NAME_VENTA));
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
          elem.setValue(getValue(m_data.items[_i], CV.FVI_DESCRIP));
          elem.setKey(KI_DESCRIP);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.FVI_CANTIDAD));
          elem.setKey(KI_CANTIDAD);

          elem = row.add(null);
          elem.setValue("");
          elem.setKey(KI_NRO_SERIE);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], C.STL_CODE));
          elem.setId(getValue(m_data.items[_i], C.STL_ID));
          elem.setKey(KI_STL_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.FVI_DESCUENTO));
          elem.setKey(KI_DESCUENTO);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], C.UN_NAME));
          elem.setKey(KI_UNIDAD);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.FVI_PRECIO_LISTA) / cotizacion);
          elem.setKey(KI_PRECIO_LP);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.FVI_PRECIO_USR) / cotizacion);
          elem.setKey(KI_PRECIO_USR);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.FVI_PRECIO) / cotizacion);
          elem.setKey(KI_PRECIO);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.FVI_NETO) / cotizacion);
          elem.setKey(KI_NETO);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.FVI_IVARI) / cotizacion);
          elem.setKey(KI_IVA_RI);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.FVI_IVARNI) / cotizacion);
          elem.setKey(KI_IVA_RNI);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.FVI_INTERNOS) / cotizacion);
          elem.setKey(KI_INTERNOS);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.FVI_IMPORTE) / cotizacion);
          elem.setKey(KI_IMPORTE);

          elem = row.add(null);
          if(m_bIva) {
            elem.setValue(getValue(m_data.items[_i], CV.FVI_IVA_RIPORC));
          }
          else {
            elem.setValue(0);
          }
          elem.setKey(KI_IVA_RI_PERCENT);

          elem = row.add(null);
          if(m_bIvaRni) {
            elem.setValue(getValue(m_data.items[_i], CV.FVI_IVA_RNIPORC));
          }
          else {
            elem.setValue(0);
          }
          elem.setKey(KI_IVA_RNI_PERCENT);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.FVI_INTERNOS_PORC));
          elem.setKey(KI_INTERNOS_PERCENT);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], C.PR_PORC_INTERNO_V));
          elem.setKey(KI_INTERNOS_PORC);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], C.CCOS_NAME));
          elem.setId(getValue(m_data.items[_i], C.CCOS_ID));
          elem.setKey(Percepciones.KI_CCOS_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], C.TO_NAME));
          elem.setId(getValue(m_data.items[_i], C.TO_ID));
          elem.setKey(KI_TO_ID);

          elem = row.add(null);
          elem.setId(getValue(m_data.items[_i], C.PR_LLEVA_NRO_LOTE));
          elem.setKey(KI_PR_LLEVALOTE);

          elem = row.add(null);
          elem.setId(getValue(m_data.items[_i], C.PR_LOTE_FIFO));
          elem.setKey(KI_PR_LOTEFIFO);

          elem = row.add(null);
          elem.setId(getValue(m_data.items[_i], C.PR_LLEVA_NRO_SERIE));
          elem.setKey(KI_PR_LLEVA_NRO_SERIE);

          elem = row.add(null);
          elem.setId(getValue(m_data.items[_i], C.PR_ES_KIT));
          elem.setKey(KI_ES_KIT);

          elem = row.add(null);
          elem.setId(getValue(m_data.items[_i], CV.FVI_ID));
          elem.setKey(KI_GRUPO);

          elem = row.add(null);
          elem.setId(getValue(m_data.items[_i], CV.FVI_NO_STOCK));
          elem.setKey(KI_NOSTOCK);

        }

        var serialNumber = null;
        var curGroup = 0;
        var coll = null;
        var serialNumbers = "";

        m_serialNumbers.clear();

        for(var _i = 0, count = m_data.serialNumbers.length; _i < count; _i += 1) {

          // check if the group has changed
          //
          if(curGroup !== getValue(m_data.serialNumbers[_i], CV.FVI_ID)) {

            setSerialNumberInRow(curGroup, serialNumbers);
            serialNumbers = "";

            curGroup = getValue(m_data.items[_i], CV.FVI_ID);
            coll = Cairo.Collections.createCollection(Cairo.SerialNumber.create);
            m_serialNumbers.add(coll, Cairo.Collections.getKey(curGroup));
          }

          var prnsId = getValue(m_data.items[_i], C.PRNS_ID);

          serialNumber = coll.add(null, Cairo.Collections.getKey(prnsId));
          serialNumber.setPrnsId(prnsId);
          serialNumber.setCodigo(getValue(m_data.items[_i], C.PRNS_CODE));
          serialNumber.setDescrip(getValue(m_data.items[_i], C.PRNS_DESCRIP));
          serialNumber.setFechaVto(getValue(m_data.items[_i], C.PRNS_FECHA_VTO));
          serialNumber.setPrIdItem(getValue(m_data.items[_i], C.PR_ID));
          serialNumber.setKitItem(getValue(m_data.items[_i], C.PR_NAME_COMPRA));

          serialNumbers = serialNumbers + serialNumber.getCode() + ",";
        }

        setSerialNumberInRow(curGroup, serialNumbers);

        m_kitDefinitions.clear();

        for(var _i = 0, count = m_data.kitDefinitions.length; _i < count; _i += 1) {

          var prId = getValue(m_data.kitDefinitions[_i], C.PR_ID);
          var kitDefinition = Cairo.Kit.getKitDefinitionForPrId(prId, m_kitDefinitions);

          prId = getValue(m_data.kitDefinitions[_i], C.PR_ID_ITEM);

          var kitInfo = Cairo.Kit.getKitInfoForPrId(prId, kitDefinition);

          kitInfo.setPrId(prId);
          kitInfo.setName(getValue(m_data.kitDefinitions[_i], C.PR_NAME_COMPRA));
          kitInfo.setAmount(getValue(m_data.kitDefinitions[_i], C.PRK_CANTIDAD));
          kitInfo.setHasSerial(getValue(m_data.kitDefinitions[_i], C.PR_LLEVA_NRO_SERIE));
        }

        return true;
      };

      var loadDataFromResponse = function(response) {
        var data = response.data;

        data.items = data.get('items');
        data.percepciones = data.get('percepciones');
        data.serialNumbers = data.get('serialNumbers');
        data.kitDefinitions = data.get('kitDefinitions');

        return data;
      };

      var load = function(id) {
        var cotizacion = 0;
        m_data = emptyData;

        return Cairo.Database.getData("load[" + m_apiPath + "ventas/facturaventa]", id).then(
          function(response) {

            var p = null;

            m_lastCpgId = -1;

            if(response.success !== true) { return false; }

            if(response.data.id !== NO_ID) {

              m_data = loadDataFromResponse(response);

              var data = response.data;

              m_cotizacion = valField(data, CV.FV_COTIZACION);
              cotizacion = (m_cotizacion !== 0) ? m_cotizacion : 1;

              m_id = valField(data, CV.FV_ID);
              m_numero = valField(data, CV.FV_NUMERO);
              m_nrodoc = valField(data, CV.FV_NRODOC);
              m_descrip = valField(data, CV.FV_DESCRIP);
              m_fecha = valField(data, CV.FV_FECHA);
              m_fechaentrega = valField(data, CV.FV_FECHA_ENTREGA);
              m_fechaVto = valField(data, CV.FV_FECHA_VTO);
              m_fechaIva = valField(data, CV.FV_FECHA_IVA);
              m_neto = valField(data, CV.FV_NETO) / cotizacion;
              m_ivari = valField(data, CV.FV_IVA_RI) / cotizacion;
              m_ivarni = valField(data, CV.FV_IVA_RNI) / cotizacion;
              m_internos = valField(data, CV.FV_INTERNOS) / cotizacion;
              m_total = valField(data, CV.FV_TOTAL) / cotizacion;
              m_totalPercepciones = valField(data, CV.FV_TOTAL_PERCEPCIONES) / cotizacion;
              m_subTotal = valField(data, CV.FV_SUBTOTAL) / cotizacion;
              m_descuento1 = valField(data, CV.FV_DESCUENTO1);
              m_descuento2 = valField(data, CV.FV_DESCUENTO2);
              m_importeDesc1 = valField(data, CV.FV_IMPORTE_DESC_1) / cotizacion;
              m_importeDesc2 = valField(data, CV.FV_IMPORTE_DESC_2) / cotizacion;
              m_cliId = valField(data, C.CLI_ID);
              m_cliente = valField(data, C.CLI_NAME);
              m_ccosId = valField(data, C.CCOS_ID);
              m_centroCosto = valField(data, C.CCOS_NAME);
              m_sucId = valField(data, C.SUC_ID);
              m_sucursal = valField(data, C.SUC_NAME);
              m_docId = valField(data, C.DOC_ID);
              m_documento = valField(data, C.DOC_NAME);
              m_doctId = valField(data, C.DOCT_ID);
              m_showStockData = valField(data, C.DOC_MUEVE_STOCK)
              m_lpId = valField(data, C.LP_ID);
              m_listaPrecio = valField(data, C.LP_NAME);
              m_cpgId = valField(data, C.CPG_ID);
              m_condicionPago = valField(data, C.CPG_NAME);
              m_ldId = valField(data, C.LD_ID);
              m_listaDescuento = valField(data, C.LD_NAME);
              m_venId = valField(data, C.VEN_ID);
              m_vendedor = valField(data, C.VEN_NAME);
              m_lgjId = valField(data, C.LGJ_ID);
              m_legajo = valField(data, C.LGJ_CODE);
              m_cai = valField(data, CV.FV_CAI);
              m_ordenCompra = valField(data, CV.FV_ORDEN_COMPRA);
              m_proIdOrigen = valField(data, C.PRO_ID_ORIGEN);
              m_proOrigen = valField(data, C.PRO_ORIGEN_NAME);
              m_proIdDestino = valField(data, C.PRO_ID_DESTINO);
              m_proDestino = valField(data, C.PRO_DESTINO_NAME);
              m_transId = valField(data, C.TRANS_ID);
              m_transporte = valField(data, C.TRANS_NAME);
              m_estId = valField(data, C.EST_ID);
              m_estado = valField(data, C.EST_NAME);
              m_firmado = valField(data, CV.FV_FIRMADO);
              m_monId = valField(data, C.MON_ID);

              m_clisId = valField(data, C.CLIS_ID);
              m_clienteSucursal = valField(data, C.CLIS_NAME);

              m_docSinPerc = valField(data, C.DOC_SIN_PERC);

              m_docEditable = valField(data, C.DOC_EDITABLE);
              m_docEditMsg = valField(data, C.DOC_EDIT_MSG);

              m_depfId = valField(data, C.DEPF_ID);
              m_deplId = valField(data, C.DEPL_ID);
              m_deposito = valField(data, C.DEPL_NAME);

              m_asId = valField(data, C.AS_ID);
              m_stId = valField(data, C.ST_ID);

              m_bIva = valField(data, C.HAS_IVA_RI);
              m_bIvaRni = valField(data, C.HAS_IVA_RNI);

              m_taPropuesto = valField(data, C.TA_PROPUESTO);
              m_taMascara = valField(data, C.TA_MASCARA);
              m_rvTaPropuesto = valField(data, CV.RV_TA_PROPUESTO);

              m_lastDocId = m_docId;
              m_lastMonId = m_monId;
              m_lastDoctId = m_doctId;
              m_lastDocTipoFactura = valField(data, C.DOC_TIPO_FACTURA);
              m_lastCliId = m_cliId;
              m_lastDocName = m_documento;
              m_lastCliName = m_cliente;

              m_lastMonIdCotizacion = m_monId;
              m_lastFecha = m_fecha;

              p = D.loadPercepcionesForCliente(m_lastCliId, m_fecha).whenSuccessWithResult(function(response) {
                m_percepciones = response.percepciones;
                return true;
              });

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
              m_totalPercepciones = 0;
              m_subTotal = 0;
              m_descuento1 = 0;
              m_descuento2 = 0;
              m_importeDesc1 = 0;
              m_importeDesc2 = 0;
              m_ccosId = NO_ID;
              m_centroCosto = "";
              m_lpId = NO_ID;
              m_ldId = NO_ID;
              m_cpgId = NO_ID;
              m_venId = NO_ID;
              m_vendedor = "";
              m_cai = "";
              m_ordenCompra = "";
              m_lgjId = NO_ID;
              m_legajo = "";
              m_proIdOrigen = NO_ID;
              m_proOrigen = "";
              m_proIdDestino = NO_ID;
              m_proDestino = "";
              m_transId = NO_ID;
              m_transporte = "";
              m_condicionPago = "";
              m_listaPrecio = "";
              m_listaDescuento = "";
              m_cotizacion = 0;
              m_monId = NO_ID;
              m_estId = NO_ID;
              m_estado = "";
              m_sucId = Cairo.User.getSucId();
              m_sucursal = Cairo.User.getSucName();
              m_firmado = false;

              m_clisId = NO_ID;
              m_clienteSucursal = "";

              m_docSinPerc = false;

              m_depfId = NO_ID;
              m_deplId = NO_ID;
              m_deposito = "";

              m_asId = NO_ID;
              m_stId = NO_ID;

              m_docId = m_lastDocId;
              m_doctId = m_lastDoctId;
              m_cliId = m_lastCliId;
              m_cliente = m_lastCliName;
              m_documento = m_lastDocName;

              m_taPropuesto = false;
              m_taMascara = "";
              m_rvTaPropuesto = false;

              m_bIvaRni = false;
              m_bIva = false;

              if(m_lastMonIdCotizacion !== m_lastMonId) {
                m_lastMonIdCotizacion = NO_ID;
              }

              m_lastFecha = Cairo.Constants.NO_DATE;

              if(m_lastMonId === m_defaultCurrency.id) {
                m_cotizacion = 0;
                m_lastMonIdCotizacion = m_lastMonId;
              }
              else {
                if(m_docId !== NO_ID && m_lastMonIdCotizacion === NO_ID) {
                  p = D.getCurrencyRate(m_lastMonId, m_fecha).then(function(rate) {
                    m_cotizacion = rate;
                  });
                }
              }

              m_data = emptyData;

              p = p || P.resolvedPromise();

              p = p
                .then(P.call(D.editableStatus, m_docId, CS.NEW_FACTURA))
                .then(function(status) {
                  m_docEditable = status.editableStatus;
                  m_docEditMsg = status.message;
                  return true;
                });

            }

            m_fv_id_nc_based = NO_ID;

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

        var transaction = DB.createTransaction();
        var orden = 0;
        var origen = 0;
        var neto = 0;
        var ivaRi = 0;
        var ivaRni = 0;
        var internos = 0;

        var order = { n: 0 };
        var grupo = 0;
        var prId = 0;

        transaction.setTable(CV.FACTURA_VENTA_ITEM_TMP);

        var rows = getGrid(m_items, C_ITEMS).getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();
          register.setFieldId(CV.FVI_TMP_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var fields = register.getFields();

          var _countj = row.size();
          for(var _j = 0; _j < _countj; _j++) {

            var cell = row.item(_j);
            switch (cell.getKey()) {

              case KI_FVI_ID:
                if(m_copy) {
                  fields.add(CV.FVI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(CV.FVI_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KI_CANTIDAD:
                fields.add(CV.FVI_CANTIDAD, cell.getValue(), Types.double);
                break;

              case KI_DESCRIP:
                fields.add(CV.FVI_DESCRIP, cell.getValue(), Types.text);
                break;

              case KI_PRECIO:
                fields.add(CV.FVI_PRECIO, val(cell.getValue()) * cotizacion, Types.currency);
                break;

              case KI_PRECIO_LP:
                fields.add(CV.FVI_PRECIO_LISTA, val(cell.getValue()) * cotizacion, Types.currency);
                break;

              case KI_PRECIO_USR:
                fields.add(CV.FVI_PRECIO_USR, val(cell.getValue()) * cotizacion, Types.currency);
                break;

              case KI_NETO:
                neto = val(cell.getValue());
                fields.add(CV.FVI_NETO, neto * cotizacion, Types.currency);
                break;

              case KI_IVA_RI:
                if(m_bIva) {
                  ivaRi = val(cell.getValue());
                  fields.add(CV.FVI_IVARI, ivaRi * cotizacion, Types.currency);
                }
                break;

              case KI_IVA_RNI:
                if(m_bIvaRni) {
                  ivaRni = val(cell.getValue());
                  fields.add(CV.FVI_IVARNI, ivaRni * cotizacion, Types.currency);
                }
                break;

              case KI_INTERNOS:
                internos = val(cell.getValue());
                fields.add(CV.FVI_INTERNOS, internos * cotizacion, Types.currency);
                break;

              case KI_IVA_RI_PERCENT:
                fields.add(CV.FVI_IVA_RIPORC, cell.getValue(), Types.double);
                break;

              case KI_IVA_RNI_PERCENT:
                fields.add(CV.FVI_IVA_RNIPORC, cell.getValue(), Types.double);
                break;

              case KI_INTERNOS_PERCENT:
                fields.add(CV.FVI_INTERNOS_PORC, cell.getValue(), Types.double);
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

              case KI_NOSTOCK:
                fields.add(CV.FVI_NO_STOCK, cell.getId(), Types.boolean);
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

          fields.add(CV.FVI_IMPORTE, origen * cotizacion, Types.currency);
          if(isDefaultCurrency) {
            fields.add(CV.FVI_IMPORTE_ORIGEN, 0, Types.currency);
          }
          else {
            fields.add(CV.FVI_IMPORTE_ORIGEN, origen, Types.currency);
          }

          orden += 1;
          fields.add(CV.FVI_ORDEN, orden, Types.integer);

          transaction.addRegister(register);

          if(grupo === 0) { grupo = orden * -1; }

          saveItemNroSerie(mainRegister, row, order, prId, grupo)
        }

        if(m_itemsDeleted !== "" && m_id !== NO_ID && !m_copy) {

          transaction.setDeletedList(m_itemsDeleted);
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var docAsistTipo = function() {
        return m_lastDocTipoFactura;
      };

      var docDesdePedido = function() {
        return docAsistTipo() === D.InvoiceWizardType.pedido;
      };

      var docDesdePacking = function() {
        return docAsistTipo() === D.InvoiceWizardType.packingList;
      };

      var docDesdeRemito = function() {
        return docAsistTipo() === D.InvoiceWizardType.remito;
      };

      var docDesdeProyecto = function() {
        return docAsistTipo() === D.InvoiceWizardType.proyecto;
      };

      var showImporteAndIva = function(row) {
        var ivaRi = 0;
        var ivaRni = 0;

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

      var calcularPercepciones = function() {
        Percepciones.calcularPercepciones(
          m_docSinPerc, m_percepciones, getItems(), getPercepciones(), m_dialog,
          KI_IVA_RI, KI_NETO, KI_IMPORTE);
      };

      var updateTotals = function() {

        var rows = getGrid(m_items, C_ITEMS).getRows();
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

        var percep = 0;

        for(var _i = 0, _count = rowsPercep.size(); _i < _count; _i++) {
          row = rowsPercep.item(_i);
          percep = percep + cellFloat(row, Percepciones.KIP_IMPORTE);
        }

        var properties = m_footerProps;
        properties.item(CV.FV_SUBTOTAL).setValue(neto);

        var desc1 = val(m_properties.item(CV.FV_DESCUENTO1).getValue());
        var desc2 = val(m_properties.item(CV.FV_DESCUENTO2).getValue());

        ivaRi = ivaRi - (ivaRi * desc1 / 100);
        ivaRni = ivaRni - (ivaRni * desc1 / 100);
        internos = internos - (internos * desc1 / 100);

        ivaRi = ivaRi - (ivaRi * desc2 / 100);
        ivaRni = ivaRni - (ivaRni * desc2 / 100);
        internos = internos - (internos * desc2 / 100);

        desc1 = neto * desc1 / 100;
        properties.item(CV.FV_IMPORTE_DESC_1).setValue(desc1);

        neto = neto - desc1;

        desc2 = neto * desc2 / 100;
        properties.item(CV.FV_IMPORTE_DESC_2).setValue(desc2);

        neto = neto - desc2;

        properties.item(CV.FV_NETO).setValue(neto);
        properties.item(CV.FV_IVA_RI).setValue(ivaRi);
        properties.item(CV.FV_IVA_RNI).setValue(ivaRni);

        properties.item(CV.FV_INTERNOS).setValue(internos);
        properties.item(CV.FV_TOTAL_PERCEPCIONES).setValue(percep);
        properties.item(CV.FV_TOTAL).setValue(neto + ivaRni + ivaRi + percep + internos);

        m_footer.refreshControls();
      };

      var setTasasImpositivas = function(row, prId, prName) {
        var p = null;

        if(prId !== 0) {

          p = D.getTasaFromProducto(prId).whenSuccessWithResult(function(data) {

            if(data.ti_ri_venta === 0) {
              return M.showWarningWithFalse(getText(1597, "", prName));
              // El producto [" & prName & "] no tiene definida su tasa impositiva de ventas para el iva responsable inscripto
            }

            if(data.ti_rni_venta === 0) {
              return M.showWarningWithFalse(getText(1598, "", prName));
              // El producto [" & prName & "] no tiene definida su tasa impositiva de ventas para el iva responsable no inscripto
            }

            if(m_bIva) {
              getCell(row, KI_IVA_RI_PERCENT).setValue(data.ri_percent_venta);
              getCell(row, KI_CUE_ID_IVA_RI).setValue(data.ri_cue_id_venta);
            }
            else {
              getCell(row, KI_IVA_RI_PERCENT).setValue(0);
              getCell(row, KI_CUE_ID_IVA_RI).setValue(NO_ID);
            }

            if(m_bIvaRni) {
              getCell(row, KI_IVA_RNI_PERCENT).setValue(data.rni_percent_venta);
              getCell(row, KI_CUE_ID_IVA_RNI).setValue(data.rni_cue_id_venta);
            }
            else {
              getCell(row, KI_IVA_RNI_PERCENT).setValue(0);
              getCell(row, KI_CUE_ID_IVA_RNI).setValue(NO_ID);
            }

            getCell(row, KI_INTERNOS_PERCENT).setValue(data.int_percent_venta);
            getCell(row, KI_INTERNOS_PORC).setValue(data.porc_internos_venta);

            return true;

          });

        }
        return p || P.resolvedPromise(false);
      };

      var setDataProducto = function(row, prId) {

        var bChanged = prId !== cellId(row, KI_PR_ID);

        var p = DB.getData(
          "load[" + m_apiPath + "general/producto/" + prId.toString() + "/stock/cliente]", getCliId());

        return p.whenSuccessWithResult(function(response) {
          var isKit = valField(response.data, C.PR_ES_KIT);

          getCell(row, KI_UNIDAD).setValue(valField(response.data, C.UN_NAME_VENTA));

          var cell = getCell(row, KI_CCOS_ID);
          cell.setValue(valField(response.data, C.CCOS_NAME_VENTA));
          cell.setId(valField(response.data, C.CCOS_ID_VENTA));

          getCell(row, KI_CUE_ID).setValue(valField(response.data, C.CUE_ID_VENTA));

          // serial numbers are required only if the document generates an stock transaction
          //
          if(m_showStockData) {
            getCell(row, KI_PR_LLEVA_NRO_SERIE).setId(valField(response.data, C.PR_LLEVA_NRO_SERIE));
            getCell(row, KI_PR_LLEVALOTE).setId(valField(response.data, C.PR_LLEVA_NRO_LOTE));
            getCell(row, KI_PR_LOTEFIFO).setId(valField(response.data, C.PR_LOTE_FIFO));
          }
          else {
            getCell(row, KI_PR_LLEVA_NRO_SERIE).setId(0);
            getCell(row, KI_PR_LLEVALOTE).setId(0);
            getCell(row, KI_PR_LOTEFIFO).setId(0);
          }

          if(isKit) {

            var kitDefinition = Cairo.Kit.getKitDefinitionForPrId(prId, m_kitDefinitions);
            var kitDefinitionData = response.data.kitDefinition;

            for(var _i = 0, count = kitDefinitionData.length; _i < count; _i += 1) {

              var prIdItem = getValue(kitDefinitionData[_i], C.PR_ID);

              var kitInfo = Cairo.Kit.getKitInfoForPrId(prIdItem, kitDefinition);

              kitInfo.setPrId(prIdItem);
              kitInfo.setName(getValue(kitDefinitionData[_i], C.PR_NAME_COMPRA));
              kitInfo.setAmount(getValue(kitDefinitionData[_i], C.PRK_CANTIDAD));
              kitInfo.setHasSerial(getValue(kitDefinitionData[_i], C.PR_LLEVA_NRO_SERIE));
            }
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

      var setEnabled = function() {
        var bState = false;

        // when the document requires base document like a purchase order or a delivery note
        // it can't be edited. the user must click the new button and use the wizard.
        //
        if(docDesdePedido() && m_id === NO_ID) {
          bState = false;
        }
        else if(docDesdeRemito() && m_id === NO_ID) {
          bState = false;
        }
        else if(docDesdePacking() && m_id === NO_ID) {
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

        var _count = m_properties.size();
        for(var _i = 0; _i < _count; _i++) {
          var prop = m_properties.item(_i);
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
          properties.item(C.DEPL_ID_ORIGEN).setEnabled(m_showStockData);
        }

        var _count = m_itemsProps.size();
        for(var _i = 0; _i < _count; _i++) {
          var prop = m_itemsProps.item(_i);
          prop.setEnabled(bState);
        }

        m_items.refreshEnabledState(m_itemsProps);
        m_dialog.refreshEnabledState(m_properties);
      };

      var setDataCliente = function() {
        var p;
        var property = m_properties.item(C.CLI_ID);

        if(m_lastCliId !== property.getSelectId()) {

          m_lastCliId = property.getSelectId();

          p = DB.getData(
            "load[" + m_apiPath + "general/cliente/" + m_lastCliId.toString() + "/info]", m_lastDocId);

          p = p.whenSuccessWithResult(function(response) {

            var lpId = valField(response.data, C.LP_ID);
            var lpName = valField(response.data, C.LP_NAME);
            var ldId = valField(response.data, C.LD_ID);
            var ldName = valField(response.data, C.LD_NAME);
            var venId = valField(response.data, C.VEN_ID);
            var transId = valField(response.data, C.TRANS_ID);
            var proId = valField(response.data, C.PRO_ID);
            var cpgId = valField(response.data, C.CPG_ID);
            var lpFilter = D.getListaPrecioForCliente(m_docId, m_cliId);
            var ldFilter = D.getListaDescuentoForCliente(m_docId, m_cliId);
            var clisFilter = D.getListaDescuentoForCliente(m_docId, m_cliId);

            if(cpgId !== NO_ID) {

              var cpgName = valField(response.data, C.CPG_NAME);

              var prop = m_properties
                .item(C.CPG_ID)
                .setValue(cpgName)
                .setSelectId(cpgId);

              m_dialog.showValue(prop);
            }

            var prop = m_properties.item(C.LP_ID)
              .setSelectFilter(lpFilter);

            if(lpId !== NO_ID) {
              prop.setValue(lpName);
              prop.setSelectId(lpId);
            }

            m_dialog.showValue(prop);

            prop = m_properties.item(C.LD_ID);
            prop.setSelectFilter(ldFilter);

            if(ldId !== NO_ID) {
              prop.setValue(ldName);
              prop.setSelectId(ldId);
            }

            m_dialog.showValue(prop);

            if(venId !== NO_ID) {

              var venName = valField(response.data, C.VEN_NAME);

              var prop = m_properties
                .item(C.VEN_ID)
                .setValue(venName)
                .setSelectId(venId);

              m_dialog.showValue(prop);
            }

            if(transId !== NO_ID) {

              var transName = valField(response.data, C.TRANS_NAME);

              var prop = m_properties
                .item(C.TRANS_ID)
                .setValue(transName)
                .setSelectId(transId);

              m_dialog.showValue(prop);
            }

            if(proId !== NO_ID) {

              var proName = valField(response.data, C.PRO_NAME);

              var prop = m_properties
                .item(C.PRO_ID)
                .setValue(proName)
                .setSelectId(proId);

              m_dialog.showValue(prop);
            }

            prop = m_properties.item(C.CLIS_ID);
            prop.setSelectFilter(clisFilter);
            m_dialog.showValue(prop);

            var bLastIva = m_bIva;
            var ivaChanged = false;
            m_bIva = valField(response.data, C.HAS_IVA_RI);
            if(bLastIva !== m_bIva) { ivaChanged = true; }

            bLastIva = m_bIvaRni;
            m_bIvaRni = valField(response.data, C.HAS_IVA_RNI);
            if(bLastIva !== m_bIvaRni) { ivaChanged = true; }

            var p;

            if(ivaChanged) {
              p = updateIva();
              updateTotals();
            }

            p = p || P.resolvedPromise(true);

            return p.then(function() {
              setFechaVto(cpgId, response);

              return D.loadPercepcionesForCliente(m_lastCliId, getFecha())
                .whenSuccessWithResult(function(result) {
                  m_percepciones = result.percepciones;
                  calcularPercepciones();
                  updateTotals();
                  return true;
                });
            });
          });
        }
        return p || P.resolvedPromise(false);
      };

      var getCueIdCliente = function() {

        var getCueId = function(response) {

          try {

            var cueId = valField(response.data, C.CUE_ID);
            var monId = valField(response.data, C.MON_ID);

            return { success: true, monId: monId, cueId: cueId };
          }
          catch(ex) {
            Cairo.manageErrorEx(ex.message, ex, "getCueIdCliente", C_MODULE, "");
          }

          return { success: false };
        };

        var p = DB.getData(
            "load[" + m_apiPath + "documento/" + m_lastDocId.toString() + "/customer/" + m_lastCliId.toString() + "/account]")
          .whenSuccessWithResult(getCueId, false);

        return p;
      };

      var signDocument = function() {

        if(m_id === NO_ID) {
          return M.showWarningWithFalse(getText(1592, ""));
          // Antes de poder firmar el documento debe guardarlo.
        }

        var refreshState = function(response) {

          m_estId = response.est_id;
          m_estado = response.estado;
          m_firmado = response.firmado;

          var prop = m_properties.item(Cairo.Constants.STATUS_ID);

          prop.setSelectId(m_estId);
          prop.setValue(m_estado);

          m_dialog.showValue(prop);
        };

        var p = null;

        if(m_firmado) {
          p = M.confirmViewYesDefault(
            getText(1594, ""), // Firmar
            getText(1593, "")  // El documento ya ha sido firmado desea borrar la firma
          );
        }

        p = p || P.resolvedPromise(true);

        p = p
          .whenSuccess(D.signDocument(m_doctId, m_id))
          .whenSuccessWithResult(refreshState);

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

            m_lastCliId = NO_ID;
            m_lastCliName = "";

            return load(NO_ID)
              .whenSuccess(call(D.setDocNumberForCliente, m_lastCliId, m_docId, m_dialog))
              .then(function(enabled) { m_taPropuesto = enabled; })
              .then(refreshProperties);
          }
          else {
            return load(response.id)
              .whenSuccess(refreshProperties);
          }
        }
        return D.move(m_docId, moveTo)
          .whenSuccessWithResult(completeMove);
      };

      var refreshProperties = function() {

        m_properties.item(C.DOC_ID)
          .setSelectId(m_docId)
          .setValue(m_documento);

        m_properties.item(CV.FV_FECHA)
          .setValue(m_fecha);

        m_properties.item(CV.FV_FECHA_ENTREGA)
          .setValue(m_fechaentrega);

        m_properties.item(C.CLI_ID)
          .setSelectId(m_cliId)
          .setValue(m_cliente);

        m_properties.item(Cairo.Constants.NUMBER_ID)
          .setValue(m_numero);

        m_properties.item(Cairo.Constants.STATUS_ID)
          .setValue(m_estado);

        m_properties.item(CV.FV_NRODOC)
          .setValue(m_nrodoc)
          .setTextMask(m_taMascara)
          .setTextAlign(Dialogs.TextAlign.right);

        m_properties.item(CV.FV_DESCUENTO1)
          .setValue(m_descuento1);

        m_properties.item(CV.FV_DESCUENTO2)
          .setValue(m_descuento2);

        m_properties.item(C.CPG_ID)
          .setSelectId(m_cpgId)
          .setValue(m_condicionPago);

        m_properties.item(CV.FV_FECHA_VTO)
          .setValue(m_fechaVto);

        m_properties.item(C.VEN_ID)
          .setSelectId(m_venId)
          .setValue(m_vendedor);

        m_properties.item(CV.FV_COTIZACION)
          .setValue(m_cotizacion);

        m_properties.item(C.LP_ID)
          .setSelectFilter(D.getListaPrecioForCliente(m_docId, m_cliId))
          .setSelectId(m_lpId)
          .setValue(m_listaPrecio);

        m_properties.item(C.LD_ID)
          .setSelectFilter(D.getListaDescuentoForCliente(m_docId, m_cliId))
          .setSelectId(m_ldId)
          .setValue(m_listaDescuento);

        m_properties.item(C.CCOS_ID)
          .setSelectId(m_ccosId)
          .setValue(m_centroCosto);

        m_properties.item(C.SUC_ID)
          .setSelectId(m_sucId)
          .setValue(m_sucursal);

        m_properties.item(CV.FV_DESCRIP)
          .setValue(m_descrip);

        m_properties.item(C.LGJ_ID)
          .setSelectId(m_lgjId)
          .setValue(m_legajo);

        m_properties.item(C.PRO_ID_ORIGEN)
          .setSelectId(m_proIdOrigen)
          .setValue(m_proOrigen);

        m_properties.item(C.PRO_ID_DESTINO)
          .setSelectId(m_proIdDestino)
          .setValue(m_proDestino);

        m_properties.item(C.TRANS_ID)
          .setSelectId(m_transId)
          .setValue(m_transporte);

        m_properties.item(C.CLIS_ID)
          .setSelectId(m_clisId)
          .setValue(m_clienteSucursal);

        m_properties.item(CV.FV_CAI)
          .setValue(m_cai);

        m_properties.item(CV.FV_ORDEN_COMPRA)
          .setValue(m_ordenCompra);

        if(m_deplId !== NO_ID || !m_showStockData) {
          m_properties.item(C.DEPL_ID_ORIGEN)
            .setSelectId(m_deplId)
            .setValue(m_deposito);
        }
        else {
          m_properties.item(C.DEPL_ID_ORIGEN)
            .setSelectId(Cairo.UserConfig.getDeplId())
            .setValue(Cairo.UserConfig.getDeplNombre());
        }

        m_properties.item(CV.RV_NRODOC)
          .setValue("")
          .setTextMask("");

        m_properties.item(CV.FV_FECHA_IVA)
          .setValue(m_fechaIva);

        m_dialog.showValues(m_dialog.getProperties());
        m_dialog.resetChanged();

        var cotizacion = (m_cotizacion !== 0) ? m_cotizacion : 1;

        m_itemsDeleted = "";
        m_percepcionesDeleted = "";

        loadItems(getProperty(m_items, C_ITEMS), cotizacion);
        loadPercepciones(getProperty(m_items, C_PERCEPCIONES), cotizacion);

        m_items.showValues(m_itemsProps);

        m_footerProps.item(CV.FV_SUBTOTAL)
          .setValue(m_subTotal);

        m_footerProps.item(CV.FV_IMPORTE_DESC_1)
          .setValue(m_importeDesc1);

        m_footerProps.item(CV.FV_IMPORTE_DESC_2)
          .setValue(m_importeDesc2);

        m_footerProps.item(CV.FV_NETO)
          .setValue(m_neto);

        m_footerProps.item(CV.FV_IVA_RI)
          .setValue(m_ivari);

        m_footerProps.item(CV.FV_IVA_RNI)
          .setValue(m_ivarni);

        m_footerProps.item(CV.FV_INTERNOS)
          .setValue(m_internos);

        m_footerProps.item(CV.FV_TOTAL_PERCEPCIONES)
          .setValue(m_totalPercepciones);

        m_footerProps.item(CV.FV_TOTAL)
          .setValue(m_total);

        m_footer.showValues(m_footerProps);

        setEnabled();

        return showCotizacion()
          .then(showFechaVto)
          .then(call(D.showDataAddCliente, Cairo.UserConfig.getShowDataAddInVentas(), m_dialog));
      };

      var showApplycation = function() {

        if(!Cairo.Security.docHasPermissionTo(
          CS.MODIFY_APLIC,
          m_docId,
          Cairo.Security.ActionTypes.apply)) {
          return false;
        }

        if(m_applyEditor === null) {
          m_applyEditor = Cairo.FacturaVentaAplic.createObject();
        }
        else {
          if(m_applyEditor.getId() !== m_id) {
            m_applyEditor.setClient(null);
            m_applyEditor = Cairo.FacturaVentaAplic.createObject();
          }
        }

        m_applyEditor.setClient(self);

        m_applyEditor.show(
            m_id,
            m_total * ((m_cotizacion !== 0) ? m_cotizacion : 1),
            m_nrodoc,
            m_cliId,
            m_cliente,
            m_sucId,
            m_docId,
            m_doctId === D.Types.NOTA_CREDITO_VENTA).then(function(result) {
            if(result !== true) {
              m_applyEditor = null;
            }
          });
      };

      var startWizard = function(wizard, wizardConstructor) {
        wizard.setCliId(m_cliId);
        wizard.setCliente(m_cliente);
        wizard.setDocId(m_lastDocId);
        wizard.setMonId(m_lastMonId);
        wizard.setIva(m_bIva, m_bIvaRni);
        wizard.setShowStockData(m_showStockData);
        wizard.setDocumento(m_lastDocName);
        wizard.setObjClient(self);
        wizard.setPushVirtualNext(m_bPushVirtualNext);
        wizard.setCloseWizardAfterSave(m_bCloseWizardAfterSave);

        var wizardDialog = Cairo.Dialogs.WizardViews.Controller.newWizard();
        wizardDialog.setClient(wizard);
        wizardDialog.show(wizardConstructor);
      };

      var showStartWizardProyecto = function() {
        try {
          var wizConstructor = Cairo.FacturaVentaProyectoWiz.Edit.Controller.getEditor;
          var wizard = wizConstructor();
          wizard.setHoraIds(m_horaIds);
          wizard.loadWizard().whenSuccess(call(startWizard, wizard, wizConstructor));
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showStartWizardProyecto", C_MODULE, "");
        }
      };

      var showStartWizardPackingList = function() {
        try {
          var wizConstructor = Cairo.FacturaCompraPackingWiz.Edit.Controller.getEditor;
          var wizard = wizConstructor();
          wizard.setPklstIds(m_pklstIds);
          wizard.loadWizard().whenSuccess(call(startWizard, wizard, wizConstructor));
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showStartWizardPackingList", C_MODULE, "");
        }
      };

      var showStartWizardRemito = function() {
        try {
          var wizConstructor = Cairo.FacturaVentaRemitoWiz.Edit.Controller.getEditor;
          var wizard = wizConstructor();
          wizard.setRvIds(m_rvIds);
          wizard.setAutoPago(m_bAutoPago);
          wizard.setCueIdAutoPago(m_cueIdAutoPago);
          wizard.setModoVentaCtaCte(m_modoVentaCtaCte);
          wizard.loadWizard().whenSuccess(call(startWizard, wizard, wizConstructor));
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showStartWizardRemito", C_MODULE, "");
        }
      };

      var showStartWizardPedido = function() {
        try {
          var wizConstructor = Cairo.FacturaCompraRemitoWiz.Edit.Controller.getEditor;
          var wizard = wizConstructor();
          wizard.setPvIds(m_pvIds);
          wizard.setPviIds(m_pviIds);
          wizard.setPviCantidades(m_pviCantidades);
          wizard.setAutoSelectEasy(m_bAutoSelectEasy);
          wizard.setAutoPago(m_bAutoPago);
          wizard.setCueIdAutoPago(m_cueIdAutoPago);
          wizard.setModoVentaCtaCte(m_modoVentaCtaCte);
          wizard.loadWizard().whenSuccess(call(startWizard, wizard, wizConstructor));
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showStartWizardPedido", C_MODULE, "");
        }
      };

      var initialize = function() {
        try {

          m_serialNumbers = Cairo.Collections.createCollection(null);
          m_kitDefinitions = Cairo.Collections.createCollection(Cairo.KitDefinition.create);
          m_pvIds = [];
          m_pviIds = [];
          m_pviCantidades = [];
          m_rvIds = [];
          m_horaIds = [];
          m_pklstIds = [];

          Cairo.UserConfig.validateFV();

          loadCajaForCurrentUser(false);
        }
        catch (ex) {
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
          m_pvIds = [];
          m_pviIds = [];
          m_pviCantidades = [];
          m_rvIds = [];
          m_horaIds = [];
          m_pklstIds = [];
          m_hojaRuta = null;
          m_searchZona = null;
          m_serialNumbers = null;

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");
        }
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

      var saveItemNroSerie = function(mainRegister, row, order, prId, grupo) {

        if(cellId(row, KI_PR_LLEVA_NRO_SERIE) !== 0 && m_showStockData) {

          var transaction = DB.createTransaction();
          var deleted = [];

          transaction.setTable(CV.FACTURA_VENTA_ITEM_SERIE_TMP);

          var _count = m_serialNumbers.get(Cairo.Collections.getKey(grupo)).size();
          for(var _i = 0; _i < _count; _i++) {

            var pt = m_serialNumbers.get(Cairo.Collections.getKey(grupo)).item(_i);

            var register = new DB.Register();
            var fields = register.getFields();

            register.setFieldId(C.FVIS_TMP_ID);
            register.setId(Cairo.Constants.NEW_ID);

            fields.add(C.PR_ID, prId, Types.id);

            if(m_copy) {
              fields.add(C.PRNS_ID, Cairo.Constants.NEW_ID, Types.integer);
            }
            else {
              fields.add(C.PRNS_ID, pt.getPrnsId(), Types.id);
            }

            fields.add(C.PRNS_CODE, pt.getCode(), Types.text);
            fields.add(C.PRNS_DESCRIP, pt.getDescrip(), Types.text);
            fields.add(C.PRNS_FECHA_VTO, pt.getFechaVto(), Types.date);

            order.n += 1;
            fields.add(CV.FVIS_ORDEN, order.n, Types.integer);

            transaction.addRegister(register);
          }

          transaction.setDeletedList(deleted.toString());

          mainRegister.addTransaction(transaction);
        }

        return true;
      };

      var getDeplId = function() {
        var deplId = 0;

        if(m_lastDoctId !== D.Types.NOTA_CREDITO_COMPRA) {
          deplId = C.DepositosInternos.deplIdTercero;
        }
        else {
          deplId = m_properties.item(C.DEPL_ID_ORIGEN).getSelectId();
        }

        return deplId;
      };

      var getCliId = function() {
        return m_properties.item(C.CLI_ID).getSelectId();
      };

      var getFecha = function() {
        return m_properties.item(CV.FV_FECHA).getValue();
      };

      var showCobranza = function() {
        try {
          var cobranza = Cairo.Cobranza.Edit.Controller.getEditor();
          cobranza.showCobranza(getCliId(), getFvIds());
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showCobranza", C_MODULE, "");
        }
      };

      var getFvIds = function() {
        return [m_id];
      };

      var setGridPercepciones = function(property) {

        var grid = property.getGrid();
        grid.getColumns().clear();

        Percepciones.setGridPercepciones(grid, Cairo.Settings);

        grid.getRows().clear();
      };

      var loadPercepciones = function(property, cotizacion) {

        var elem;
        var rows = property.getGrid().getRows();

        rows.clear()

        for(var _i = 0, count = m_data.percepciones.length; _i < count; _i += 1) {

          var row = rows.add(null, getValue(m_data.percepciones[_i], CV.FVPERC_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.percepciones[_i], CV.FVPERC_ID));
          elem.setKey(Percepciones.KIP_FCPERC_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.percepciones[_i], C.PERC_NAME));
          elem.setId(getValue(m_data.percepciones[_i], C.PERC_ID));
          elem.setKey(Percepciones.KIP_PERC_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.percepciones[_i], CV.FVPERC_BASE) / cotizacion);
          elem.setKey(Percepciones.KIP_BASE);

          elem = row.add(null);
          elem.setValue(getValue(m_data.percepciones[_i], CV.FVPERC_PORCENTAJE));
          elem.setKey(Percepciones.KIP_PORCENTAJE);

          elem = row.add(null);
          elem.setValue(getValue(m_data.percepciones[_i], CV.FVPERC_IMPORTE) / cotizacion);
          elem.setKey(Percepciones.KIP_IMPORTE);

          elem = row.add(null);
          elem.setValue(getValue(m_data.percepciones[_i], CV.FVPERC_DESCRIP));
          elem.setKey(Percepciones.KIP_DESCRIP);

          elem = row.add(null);
          elem.setValue(getValue(m_data.percepciones[_i], C.CCOS_NAME));
          elem.setId(getValue(m_data.percepciones[_i], C.CCOS_ID));
          elem.setKey(Percepciones.KI_CCOS_ID);
        }
      };

      var getItems = function() {
        return m_items.getProperties().item(C_ITEMS);
      };

      var getPercepciones = function() {
        return m_items.getProperties().item(C_PERCEPCIONES);
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
              case KI_PRECIO:
              case KI_IVA_RNI:
              case KI_TO_ID:

                if(! onlyStock) {
                  columns.item(i).setVisible(visible);
                  m_dialog.refreshColumnPropertiesByIndex(prop, i);
                }
                break;

              case KI_NRO_SERIE:
              case KI_STL_ID:

                columns.item(i).setVisible(m_showStockData);
                m_dialog.refreshColumnPropertiesByIndex(prop, i);
                break;
            }
          }
        }
        m_dialog.drawGrid(prop, true);
      };

      var updateIva = function() {
        var p = P.resolvedPromise(true);
        var rows = getItems().getGrid().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {
          var row = rows.item(_i);
          var cell = getCell(row, KI_PR_ID);
          p = p
            .then(call(setTasasImpositivas, row, cell.getId(), cell.getValue()))
          ;
          showImporteAndIva(row);
        }

        m_dialog.showValue(getItems(), true);

        return p;
      };
      /*
       var saveAsPresupuesto = function() {
       var _rtn = null;
       var register = null;

       var docId = null;

       docId = Cairo.UserConfig.getDocPrevId();

       if(docId === NO_ID) {
       Cairo.UserConfig.Load;
       }

       docId = Cairo.UserConfig.getDocPrevId();

       if(docId === NO_ID) {
       // Debe seleccionar un documento para persupuestos en sus preferencias. Use la opcion de menu [Configuración -> General -> Preferencias]
       MsgWarning(getText(3950, ""));
       return _rtn;
       }

       // Save and State
       //
       if(!DocCanSave(m_dialog, CV.FV_FECHA)) {
       _rtn = false;
       return _rtn;
       }

       if(getItems().getGrid().getRows().count() === 0) {
       // El documento debe contener al menos un item
       MsgWarning(getText(3903, ""));
       _rtn = false;
       return _rtn;
       }

       var register = new DB.Register();
       register.setFieldId(CV.PRV_TMPID);
       register.setTable(CV.PRESUPUESTOVENTATMP);

       register.setId(Cairo.Constants.NEW_ID);
       fields.add(CV.PRV_ID, Cairo.Constants.NEW_ID, Types.long);

       var property = null;
       var _count = m_dialog.getProperties().size();
       for(var _i = 0; _i < _count; _i++) {
       property = m_dialog.getProperties().item(_i);
       switch (property.getKey()) {
       case K_NUMERO:
       fields.add(CV.PRV_NUMERO, property.getValue(), Types.long);
       break;

       case K_NRODOC:
       fields.add(CV.PRV_NRODOC, property.getValue(), Types.text);
       break;

       case K_DESCRIP:
       fields.add(CV.PRV_DESCRIP, property.getValue(), Types.text);
       break;

       case K_FECHA:
       fields.add(CV.PRV_FECHA, property.getValue(), Types.date);
       break;

       case K_FECHA_ENTREGA:
       fields.add(CV.PRV_FECHAENTREGA, property.getValue(), Types.date);
       break;

       case K_CLI_ID:
       fields.add(C.CLI_ID, property.getSelectId(), Types.id);
       break;

       case K_CCOS_ID:
       fields.add(CV.CCOS_ID, property.getSelectId(), Types.id);
       break;

       case K_SUC_ID:
       fields.add(CV.SUC_ID, property.getSelectId(), Types.id);
       break;

       case K_DESCUENTO1:
       fields.add(CV.PRV_DESCUENTO1, property.getValue(), Types.currency);
       break;

       case K_DESCUENTO2:
       fields.add(CV.PRV_DESCUENTO2, property.getValue(), Types.currency);
       break;

       case K_DOC_ID:
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

       case K_VEN_ID:
       fields.add(C.VEN_ID, property.getSelectId(), Types.id);
       break;

       case K_LGJ_ID:
       fields.add(C.LGJ_ID, property.getSelectId(), Types.id);
       break;

       case K_PRO_ID_ORIGEN:
       fields.add(C.PRO_ID_ORIGEN, property.getSelectId(), Types.id);
       break;

       case K_PRO_ID_DESTINO:
       fields.add(C.PRO_ID_DESTINO, property.getSelectId(), Types.id);
       break;

       case K_TRANS_ID:
       fields.add(CV.TRANS_ID, property.getSelectId(), Types.id);
       break;

       case K_CLIS_ID:
       fields.add(CV.CLIS_ID, property.getSelectId(), Types.id);
       break;
       }
       }

       var _count = m_footer.getProperties().size();
       for(var _i = 0; _i < _count; _i++) {
       property = m_footer.getProperties().item(_i);
       switch (property.getKey()) {
       case K_TOTAL:
       fields.add(CV.PRV_TOTAL, property.getValue(), Types.currency);
       break;

       case K_NETO:
       fields.add(CV.PRV_NETO, property.getValue(), Types.currency);
       break;

       case K_IVARI:
       fields.add(CV.PRV_IVARI, property.getValue(), Types.currency);
       break;

       case K_IVARNI:
       fields.add(CV.PRV_IVARNI, property.getValue(), Types.currency);
       break;

       case K_SUBTOTAL:
       fields.add(CV.PRV_SUBTOTAL, property.getValue(), Types.currency);
       break;

       case K_IMPORTEDESC1:
       fields.add(CV.PRV_IMPORTE_DESC1, property.getValue(), Types.currency);
       break;

       case K_IMPORTEDESC2:
       fields.add(CV.PRV_IMPORTE_DESC2, property.getValue(), Types.currency);
       break;
       }
       }

       fields.add(C.EST_ID, CSGeneralEx2.csEEstado.cSEEST_PENDIENTE, Types.id);

       register.getFields().setHaveLastUpdate(true);
       register.getFields().setHaveWhoModify(true);

       if(!register.beginTrans(Cairo.Database)) { return _rtn; }

       if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return _rtn; }

       if(!pSaveItemsPresupuesto(register.getId())) { return _rtn; }
       if(!register.commitTrans()) { return _rtn; }

       var sqlstmt = null;
       var rs = null;
       sqlstmt = "sp_DocPresupuestoVentaSave "+ register.getId().toString();

       if(!Cairo.Database.openRs(sqlstmt, rs, , , , "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return _rtn; }

       if(rs.isEOF()) { return _rtn; }

       var id = null;
       if(!GetDocIDFromRecordset(rs, id)) { return _rtn; }

       self.editNew();

       var abmObj = null;
       abmObj = m_dialog;
       abmObj.SetFocusInGridItems;

       showSaveAsPresupuesto(id);

       _rtn = false;

       return _rtn;
       };

       var saveItemsPresupuesto = function(id) {
       var transaction = new Cairo.Database.Transaction();
       var iOrden = null;

       var row = null;
       var cell = null;

       var _count = m_items.getProperties().item(C_ITEMS).getGrid().getRows().size();
       for(var _i = 0; _i < _count; _i++) {
       row = m_items.getProperties().item(C_ITEMS).getGrid().getRows().item(_i);

       var register = new Cairo.Database.Register();
       register.setFieldId(CV.PRVI_TMPID);
       register.setTable(CV.PRESUPUESTOVENTAITEMTMP);
       register.setId(Cairo.Constants.NEW_ID);

       var _countj = row.size();
       for(var _j = 0; _j < _countj; _j++) {
       cell = row.item(_j);
       switch (cell.getKey()) {

       case KI_FVI_ID:
       fields.add(CV.PRVI_ID, Cairo.Constants.NEW_ID, Types.integer);
       break;

       case KI_CANTIDAD:
       fields.add(CV.PRVI_CANTIDAD, cell.getValue(), Types.double);
       break;

       case KI_DESCRIP:
       fields.add(CV.PRVI_DESCRIP, cell.getValue(), Types.text);
       break;

       case KI_PRECIO:
       fields.add(CV.PRVI_PRECIO, cell.getValue(), Types.currency);
       break;

       case KI_PRECIO_LP:
       fields.add(CV.PRVI_PRECIO_LISTA, cell.getValue(), Types.currency);
       break;

       case KI_PRECIO_USR:
       fields.add(CV.PRVI_PRECIO_USR, cell.getValue(), Types.currency);
       break;

       case KI_DESCUENTO:
       fields.add(CV.PRVI_DESCUENTO, cell.getValue(), Types.text);
       break;

       case KI_IMPORTE:
       fields.add(CV.PRVI_IMPORTE, cell.getValue(), Types.currency);
       break;

       case KI_NETO:
       fields.add(CV.PRVI_NETO, cell.getValue(), Types.currency);
       break;

       case KI_IVA_RI:
       if(m_bIva) {
       fields.add(CV.PRVI_IVARI, cell.getValue(), Types.currency);
       }
       break;

       case KI_IVA_RNI:
       if(m_bIvaRni) {
       fields.add(CV.PRVI_IVARNI, cell.getValue(), Types.currency);
       }
       break;

       case KI_IVA_RI_PERCENT:
       if(m_bIva) {
       fields.add(CV.PRVI_IVARI_PORC, cell.getValue(), Types.double);
       }
       break;

       case KI_IVA_RNI_PERCENT:
       if(m_bIvaRni) {
       fields.add(CV.PRVI_IVARNI_PORC, cell.getValue(), Types.double);
       }
       break;

       case KI_PR_ID:
       fields.add(CV.PR_ID, cell.getId(), Types.id);
       break;

       case Percepciones.kI_CCOS_ID:
       fields.add(CV.CCOS_ID, cell.getId(), Types.id);
       break;
       }
       }

       iOrden = iOrden + 1;
       fields.add(CV.PRVI_ORDEN, iOrden, Types.integer);
       fields.add(CV.PRV_TMPID, id, Types.id);




       transaction.addRegister(register);
       }

       mainTransaction.addTransaction(transaction);

       return true;
       };

       var showSaveAsPresupuesto = function(prvId) {
       ShowDocAux(prvId, "CSVenta2.cPresupuestoVenta", "CSABMInterface2.cm_dialogeric");
       };

       var showNewCliente = function(iProp) {
       var _rtn = null;
       try {

       var objEdit = null;
       var iEdit = null;
       var editor = null;

       objEdit = CSKernelClient2.CreateObject("CSGeneralEx2.cClientePV");
       iEdit = objEdit;
       iEdit.setObjABM(CSKernelClient2.CreateObject("CSABMInterface2.cm_dialogeric"));

       if(iEdit.edit(NO_ID, true)) {

       iProp.setValue(objEdit.nombre);
       iProp.setSelectId(objEdit.id);

       m_dialog.showValue(iProp);

       self.propertyChange(K_CLI_ID);

       }

       _rtn = true;


       }
       catch (ex) {
       Cairo.manageErrorEx(ex.message, ex, "showNewCliente", C_MODULE, "");

       }


       return _rtn;
       };

       var validateCajaState = function() {
       var iProp = null;
       var abmObj = null;
       abmObj = m_dialog;

       if(Cairo.getVentasConfig().getExigirCaja() && (m_cjId !== NO_ID || m_bCajaError)) {

       loadCajaForCurrentUser(true);

       iProp = m_dialog.getProperties().item(C_CAJAMSG);
       iProp.setValue(m_cajaMsg);

       if(m_bCajaError) {

       iProp.setForeColor(vbRed);

       MsgWarning(getText(4825, ""));
       // Antes de poder generar facturas debe abrir la caja.
       }
       else {

       iProp.setForeColor(vbWindowText);

       }

       setCajaMsgPosition();
       abmObj.ShowValue(iProp);
       abmObj.RefreshFont(iProp);
       abmObj.RefreshPosition(iProp);
       iProp = m_dialog.getProperties().item(C_CAJAMSGBOX);
       abmObj.RefreshPosition(iProp);

       }

       return m_bCajaError === false;

       };

       var getPendiente = function(fv_id) {
       var pendiente = null;
       if(!Cairo.Database.getData(CV.FACTURAVENTA, CV.FV_ID, fv_id, CV.FV_PENDIENTE, pendiente)) { return 0; }
       return pendiente;
       };


       var docIsNotActive = function(doc_id) {
       var activo = null;
       if(!Cairo.Database.getData(CV.DOCUMENTO, CV.DOC_ID, doc_id, Cairo.Constants.ACTIVE, activo)) { return false; }
       return activo === false;
       };
       */

      var validateCajaState = function() {
        var p;

        if(Cairo.getVentasConfig().getExigirCaja() && (m_cjId !== NO_ID || m_bCajaError)) {

          p = loadCajaForCurrentUser(true).whenSuccess(function() {
            var property = m_properties.item(C_CAJAMSG);
            property.setValue(m_cajaMsg);

            if(m_bCajaError) {

              property.setForeColor('red');
              M.showWarningWithFalse(getText(4825, "")); // Antes de poder generar facturas debe abrir la caja.

            }
            else {

              property.setForeColor('black');

            }

            m_dialog.showValue(property);
            m_dialog.refreshFont(property);

            return m_bCajaError === false;
          });
        }

        return p || P.resolvedPromise(true);
      };

      var getFileNamePostFix = function() {
        return m_cliente.substring(0, 50) + "-" + m_nrodoc;
      };

      var showMenuDocAction = function() {
        // Cobrar el Documento|Generar una Nota de Credito|Obtener CAE
        var menu = getText(4895, "")+ "~3|"+ getText(4894, "")+ "~4|"+ getText(5125, "")+ "~5";
        m_dialog.showPopMenu(menu);
      };

      var showNotaCredito = function() {
        /* TODO: implement
        var hl = null;
        var hr = null;

        hl = new cHelp();

        hr = hl.show(null, CSDocumento, NO_ID, "", NO_ID, csHelpType.cSNORMAL, "doct_id = 7 and mon_id = "+ m_monId);

        if(hr.getCancel()) { return; }

        var iProp = null;
        iProp = m_dialog.getProperties().item(CV.DOC_ID);

        iProp.setSelectId(hr.getId());
        iProp.setValue(hr.getValue());

        m_dialog.showValue(iProp);

        // Me guardo la factura que genero esta NC
        //
        m_fv_id_nc_based = m_id;

        self.copy();
        */
      };

      var getCAE = function() {
        return D.getCAE(m_id)
          .whenSuccess(call(load, m_id))
          .whenSuccess(call(refreshProperties));
      };

      var loadCajaForCurrentUser = function(silent) {

        m_cjId = NO_ID;

        return D.loadCajaForCurrentUser().then(
          function(result) {
            if(result.success) {
              m_cajaMsg = valField(result.cajaInfo, "info");
              m_bCajaError = false;
              var warningMessage = valField(result.cajaInfo, "warning");
              if(warningMessage !== "") {
                m_cajaMsg = warningMessage;
                m_bCajaError = true;
                return M.showWarningWithFalse(warningMessage);
              }
              else {
                m_cjId = valField(result.cajaInfo, C.CJ_ID);
                return P.resolvedPromise(true);
              }
            }
            else {
              return P.resolvedPromise(false);
            }
          }
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

      self.getObjectType = function() {
        return "cairo.modules.ventas.facturaVenta";
      };

      initialize();

      return self;
    };

    Edit.Controller = { getEditor: createObject };

    Edit.Controller.edit = function(id) {

      Cairo.LoadingMessage.show("Factura de Ventas", "Loading Factura de Venta from Crowsoft Cairo server.");
      var editor = Cairo.FacturaVenta.Edit.Controller.getEditor();
      //
      // wizards
      //
      if(id === 'sobreremito') {
        return editor.showWizardFacturaRemito();
      }
      else if(id === 'sobrepedido') {
        return editor.showWizardFacturaPedido();
      }
      else if(id === 'sobreproyecto') {
        return editor.showWizardFacturaProyecto();
      }
      else if(id === 'sobreppackinglist') {
        return editor.showWizardFacturaPackingList();
      }
      else {

        var dialog = Cairo.Dialogs.Views.Controller.newDialog();
        var dialogItems = Cairo.Dialogs.Views.Controller.newDialog();
        var dialogFooter = Cairo.Dialogs.Views.Controller.newDialog();

        editor.setDialog(dialog);
        editor.setItems(dialogItems);
        editor.setFooter(dialogFooter);
        editor.edit(id).then(Cairo.LoadingMessage.close);
      }
    };

  });

  Cairo.module("FacturaVentaListDoc.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;
      var P = Cairo.Promises;
      var NO_ID = Cairo.Constants.NO_ID;
      var DB = Cairo.Database;
      var D = Cairo.Documents;
      var M = Cairo.Modal;
      var C = Cairo.General.Constants;
      var CV = Cairo.Ventas.Constants;
      var Types = Cairo.Constants.Types;
      var Dialogs = Cairo.Dialogs;
      var T = Dialogs.PropertyType;
      var val = Cairo.Util.val;
      var isDate = Cairo.Util.isDate;
      var getDateValue = Cairo.Util.getDateValue;
      var today = Cairo.Dates.today;
      var valField = DB.valField;
      var CS = Cairo.Security.Actions.Ventas;
      var call = P.call;

      var C_MODULE = "cFacturaVtaListDoc";

      var C_FECHAINI = "FechaIni";
      var C_FECHAFIN = "FechaFin";

      var K_FECHAINI = 1;
      var K_FECHAFIN = 2;
      var K_CLI_ID = 4;
      var K_EST_ID = 5;
      var K_CCOS_ID = 6;
      var K_SUC_ID = 7;
      var K_VEN_ID = 8;
      var K_DOC_ID = 9;
      var K_CPG_ID = 10;
      var K_EMP_ID = 100;

      var m_fechaIni = null;
      var m_fechaFin = null;
      var m_cliId = "";
      var m_cliente = "";
      var m_estId = "";
      var m_estado = "";
      var m_ccosId = "";
      var m_centroCosto = "";
      var m_sucId = "";
      var m_sucursal = "";
      var m_venId = "";
      var m_vendedor = "";
      var m_docId = "";
      var m_documento = "";
      var m_cpgId = "";
      var m_condicionPago = "";
      var m_empId = "";
      var m_empresa = "";
      var m_fechaIniV = "";
      var m_fechaFinV = "";

      var m_dialog;
      var m_properties;

      var m_listController;

      var m_title = "";

      var m_menuLoaded;

      var m_menuShowCobranza = 0;
      var m_menuShowNotes = 0;
      var m_menuShowInfoCli = 0;
      var m_menuAddNote = 0;
      var m_menuShowAplic = 0;
      var m_menuShowAsiento = 0;
      var m_menuShowDocAux = 0;
      var m_menuSign = 0;
      var m_menuEditCliente = 0;

      var m_menuGetCae = 0;
      var m_menuUpdateTalonarios = 0;
      var m_sendCAEByEmail = 0;

      var m_apiPath = DB.getAPIVersion();
      var SAVE_ERROR = getText(2226, ""); // Error al grabar los párametros de navegación de Factura de Ventas

      self.list = function() {
        initialize();
        return load()
          .whenSuccess(loadCollection);
      };

      self.edit = function(fvId) {
        m_listController.edit(fvId);
      };

      self.deleteItem = function(fvId) {
        return m_listController.destroy(fvId);
      };

      self.showDocDigital = function() {
        var _rtn = null;

        try {

          var fvId = m_dialog.getId();
          if(fvId === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(CV.FACTURA_VENTA);
          doc.setClientTableID(fvId);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showDocDigital", C_MODULE, "");
        }

        return _rtn;
      };

      self.getEnabledSearchParam = function() {
        return true;
      };

      self.getSearchParamTable = function() {
        return Cairo.Tables.CLIENTE;
      };

      self.getBackgroundColor = function() {
        return "#fff";
      };

      self.setSearchParam = function(id, name) {

        var property = m_dialog.getProperties().item(C.CLI_ID);
        property.setValue(name);
        property.setSelectId(id);
        property.setSelectIntValue(id);
        m_dialog.showValue(m_dialog.getProperties().item(C.CLI_ID));
      };

      self.processMenu = function(index) {
        try {

          switch (index) {
            case m_menuShowCobranza:
              showCobranza();
              break;

            case m_menuShowInfoCli:
              D.showInfo(Cairo.Tables.CLIENTE, getCliId());
              break;

            case m_menuShowNotes:
              showNotes();
              break;

            case m_menuAddNote:
              addNote();
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

            case m_menuSign:
              signDocument();
              break;

            case m_menuEditCliente:
              editCliente();
              break;

            case m_menuGetCae:
              getCAE();
              break;

            case m_menuUpdateTalonarios:
              D.updateTalonariosAFIP();
              break;

            case m_sendCAEByEmail:
              sendCAEByEmail();
              break;
          }

        }
        catch (ex) {
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

        c = m_properties.add(null, C.CLI_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.CLIENTE);
        c.setName(getText(1150, "")); // Cliente
        c.setKey(K_CLI_ID);
        c.setValue(m_cliente);
        c.setSelectId(val(m_cliId));
        c.setSelectIntValue(m_cliId);

        c = m_properties.add(null, C.EST_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.ESTADOS);
        c.setName(getText(1568, "")); // Estado
        c.setKey(K_EST_ID);
        c.setValue(m_estado);
        c.setSelectId(val(m_estId));
        c.setSelectIntValue(m_estId);

        c = m_properties.add(null, C.CCOS_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.CENTROS_DE_COSTO);
        c.setName(getText(1057, "")); // Centro de Costos
        c.setKey(K_CCOS_ID);
        c.setValue(m_centroCosto);
        c.setSelectId(val(m_ccosId));
        c.setSelectIntValue(m_ccosId);

        c = m_properties.add(null, C.SUC_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.SUCURSAL);
        c.setName(getText(1281, "")); // Sucursal
        c.setKey(K_SUC_ID);
        c.setValue(m_sucursal);
        c.setSelectId(val(m_sucId));
        c.setSelectIntValue(m_sucId);

        c = m_properties.add(null, C.VEN_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.VENDEDOR);
        c.setName(getText(1510, "")); // Vendedor
        c.setKey(K_VEN_ID);
        c.setValue(m_vendedor);
        c.setSelectId(val(m_venId));
        c.setSelectIntValue(m_venId);

        c = m_properties.add(null, C.DOC_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.DOCUMENTO);
        c.setName(getText(1567, "")); // Documentos
        c.setKey(K_DOC_ID);
        c.setValue(m_documento);
        c.setSelectId(val(m_docId));
        c.setSelectIntValue(m_docId);
        c.setSelectFilter(D.FACTURA_VENTAS_LIST_DOC_FILTER);

        c = m_properties.add(null, C.CPG_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.CONDICIONES_DE_PAGO);
        c.setName(getText(1395, "")); // Condicion de pago
        c.setKey(K_CPG_ID);
        c.setValue(m_condicionPago);
        c.setSelectId(val(m_cpgId));
        c.setSelectIntValue(m_cpgId);

        c = m_properties.add(null, C.EMP_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.EMPRESA);
        c.setName(getText(1114, "")); // Empresa
        c.setKey(K_EMP_ID);
        c.setValue(m_empresa);
        c.setSelectId(val(m_empId));
        c.setSelectIntValue(m_empId);

        createMenu();
        if(!m_dialog.showDocumentList(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {
        return m_dialog.showValues(m_properties);
      };

      var load = function() {

        return DB.getData("load[" + m_apiPath + "ventas/facturaventas/parameters]").then(
          function(response) {

            m_empId = Cairo.Company.getId();
            m_empresa = Cairo.Company.getName();

            if(response.success !== true) { return false; }

            if(response.data.id === NO_ID) {

              m_fechaIniV = "";
              m_fechaIni = Cairo.Dates.today();
              m_fechaFinV = "";
              m_fechaFin = Cairo.Dates.DateNames.getDateByName('h-60');

              m_cliId = NO_ID;
              m_cliente = "";
              m_estId = NO_ID;
              m_estado = "";
              m_ccosId = NO_ID;
              m_centroCosto = "";
              m_sucId = NO_ID;
              m_sucursal = "";
              m_venId = NO_ID;
              m_vendedor = "";
              m_docId = NO_ID;
              m_documento = "";
              m_cpgId = NO_ID;
              m_condicionPago = "";

            }
            else {

              m_fechaIniV = valField(response.data, C.FROM);
              m_fechaIni = valField(response.data, C.FROM);
              m_fechaIni = isDate(m_fechaIni) ? getDateValue(m_fechaIni) : today();

              m_fechaFinV = valField(response.data, C.TO);
              m_fechaFin = valField(response.data, C.TO);
              m_fechaFin = isDate(m_fechaFin) ? getDateValue(m_fechaFin) : today();

              m_cliId = valField(response.data, C.CLI_ID);
              m_estId = valField(response.data, C.EST_ID);
              m_ccosId = valField(response.data, C.CCOS_ID);
              m_sucId = valField(response.data, C.SUC_ID);
              m_venId = valField(response.data, C.VEN_ID);
              m_docId = valField(response.data, C.DOC_ID);
              m_cpgId = valField(response.data, C.CPG_ID);
              m_empId = valField(response.data, C.EMP_ID);

              m_cliente = valField(response.data, C.CLI_NAME);
              m_estado = valField(response.data, C.EST_NAME);
              m_centroCosto = valField(response.data, C.CCOS_NAME);
              m_sucursal = valField(response.data, C.SUC_NAME);
              m_vendedor = valField(response.data, C.VEN_NAME);
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
            m_estId = property.getSelectIntValue();
            break;

          case K_CLI_ID:
            var property = properties.item(C.CLI_ID);
            m_cliente = property.getValue();
            m_cliId = property.getSelectIntValue();
            break;

          case K_CCOS_ID:
            var property = properties.item(C.CCOS_ID);
            m_centroCosto = property.getValue();
            m_ccosId = property.getSelectIntValue();
            break;

          case K_SUC_ID:
            var property = properties.item(C.SUC_ID);
            m_sucursal = property.getValue();
            m_sucId = property.getSelectIntValue();
            break;

          case K_VEN_ID:
            var property = properties.item(C.VEN_ID);
            m_vendedor = property.getValue();
            m_venId = property.getSelectIntValue();
            break;

          case K_DOC_ID:
            var property = properties.item(C.DOC_ID);
            m_documento = property.getValue();
            m_docId = property.getSelectIntValue();
            break;

          case K_CPG_ID:
            var property = properties.item(C.CPG_ID);
            m_condicionPago = property.getValue();
            m_cpgId = property.getSelectIntValue();
            break;

          case K_EMP_ID:
            var property = properties.item(C.EMP_ID);
            m_empresa = property.getValue();
            m_empId = property.getSelectIntValue();
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

        endDate = Cairo.Dates.DateNames.addToDate("d", 1, endDate);

        startDate = DB.sqlDate(startDate);
        endDate = DB.sqlDate(endDate);

        var params = {
          from: startDate,
          to: endDate,
          cliId: m_cliId,
          estId: m_estId,
          ccosId: m_ccosId,
          sucId: m_sucId,
          venId: m_venId,
          docId: m_docId,
          cpgId: m_cpgId,
          empId: m_empId
        };

        return DB.getData("load[" + m_apiPath + "ventas/facturaventas]", null, params);
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.LDP_ID);
        register.setTable(C.LISTA_DOCUMENTO_PARAMETRO);

        register.setPath(m_apiPath + "ventas/facturaventas");

        register.setId(Cairo.Constants.NEW_ID);

        var _count = m_dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {

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

            case K_CLI_ID:
              fields.add(C.CLI_ID, property.getSelectIntValue(), Types.text);
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

            case K_VEN_ID:
              fields.add(C.VEN_ID, property.getSelectIntValue(), Types.text);
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
        return "#venta/facturasdeventa";
      };

      self.getEditorName = function() {
        return "facturaventas";
      };

      self.getTitle = function() {
        return m_title;
      };

      self.validate = function() {
        return P.resolvedPromise(true);
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

        m_menuEditCliente = m_dialog.addMenu(getText(5038, "")); // Editar Cliente
        m_dialog.addMenu("-");

        m_menuShowCobranza = m_dialog.addMenu(getText(1690, "")); // Cobrar
        m_dialog.addMenu("-");

        m_menuSign = m_dialog.addMenu(getText(1594, "")); // Firmar
        m_dialog.addMenu("-");

        m_menuShowInfoCli = m_dialog.addMenu(getText(1614, "")); // Ver Info del Cliente
        m_menuAddNote = m_dialog.addMenu(getText(1615, "")); // Agregar Nota
        m_menuShowNotes = m_dialog.addMenu(getText(1616, "")); // Ver Notas
        m_dialog.addMenu("-");

        m_menuShowAplic = m_dialog.addMenu(getText(1617, "")); // Ver Aplicaciones
        m_menuShowAsiento = m_dialog.addMenu(getText(1692, "")); // Ver Asiento Contable
        m_menuShowDocAux = m_dialog.addMenu(getText(1691, "")); // Ver Documento Asociado
        m_dialog.addMenu("-");

        m_menuGetCae = m_dialog.addMenu(getText(5125, "")); // Obtener CAE
        m_menuUpdateTalonarios = m_dialog.addMenu(getText(5130, "")); // Actualizar Talonarios AFIP
        m_sendCAEByEmail = m_dialog.addMenu(getText(5131, "")); // Enviar Factura Electronica por e-mail
      };

      var showNotes = function() {
        var fvId = m_dialog.getId();
        return DB.getData("load[" + m_apiPath + "ventas/facturaventa/notes]", fvId)
          .whenSuccessWithResult(D.showNotes);
      };

      var addNote = function() {
        var fvId = m_dialog.getId();
        return D.addNote(D.Types.FACTURA_VENTA, fvId, false);
      };

      var editCliente = function() {
        var cliId = getCliId();
        if(cliId === NO_ID) { return; }
        Cairo.Cliente.Edit.Controller.edit(cliId);
      };

      var signDocument = function() {

        var fvId = m_dialog.getId();

        if(fvId === NO_ID) {
          return P.resolvedPromise();
        }

        var refreshRow = function(response) {
          m_dialog.refreshRow(response.data);
        };

        var getAction = function(response) {
          var p = null;

          if(response.signed) {
            p = M.confirmViewYesDefault(
              getText(1594, ""), // Firmar
              getText(1593, "")  // El documento ya ha sido firmado desea borrar la firma
            );
          }
          return p || P.resolvedPromise(true);
        };

        var p = D.getDocumentSignStatus(D.Types.FACTURA_VENTA, fvId)
            .whenSuccessWithResult(getAction)
            .whenSuccess(D.signDocument(D.Types.FACTURA_VENTA, fvId))
            .whenSuccessWithResult(refreshRow)
          ;

        return p;
      };

      var getCAE = function() {

        var p = P.resolvedPromise(true);
        var ids = m_dialog.getIds();

        for(var i = 0, count = ids.length; i < count; i++) {

          var fvId = ids[i];
          if(fvId !== NO_ID) {
            p = p.then(call(D.getCAE, fvId));
          }
        }

        return p;
      };

      var sendCAEByEmail = function() {

        var p = P.resolvedPromise(true);
        var ids = m_dialog.getIds();

        for(var i = 0, count = ids.length; i < count; i++) {

          var fvId = ids[i];
          if(fvId !== NO_ID) {
            p = p.then(call(D.sendCAEByEmail, fvId));
          }
        }

        return p.then(call(M.showInfo, getText(5133, ""))); // La solicitud de envio de e-mail se genero con éxito
      };

      var showAsiento = function() {
        var fvId = m_dialog.getId();
        if(fvId !== NO_ID) {

          D.getAsientoId(D.Types.FACTURA_VENTA, fvId).whenSuccessWithResult(function(response) {
            D.showDocAux(response.as_id, "Asiento");
          });
        }
      };

      var showDocAux = function() {
        var fvId = m_dialog.getId();
        if(fvId !== NO_ID) {

          D.getStockId(D.Types.FACTURA_VENTA, fvId).whenSuccessWithResult(function(response) {
            D.showDocAux(response.st_id, "Stock");
          });
        }
      };

      var showApplycation = function() {

        var showEditor = function(info) {
          if(!Cairo.Security.docHasPermissionTo(
            CS.MODIFY_APLIC,
            m_docId,
            Cairo.Security.ActionTypes.apply)) {
            return false;
          }

          var applyEditor = Cairo.FacturaVentaAplic.createObject();

          applyEditor.setClient(self);

          applyEditor.show(
            info.id,
            info.total * ((info.cotizacion !== 0) ? info.cotizacion : 1),
            info.nrodoc,
            info.cli_id,
            info.cliente,
            info.suc_id,
            info.doc_id,
            info.doct_id === D.Types.NOTA_CREDITO_VENTA);
        };

        var fvId = m_dialog.getId();
        if(fvId !== NO_ID) {
          D.getDocumentInfo(D.Types.FACTURA_VENTA, fvId).whenSuccessWithResult(showEditor);
        }
      };

      var showCobranza = function() {
        try {
          var cobranza = Cairo.Cobranza.Edit.Controller.getEditor();
          cobranza.showCobranza(NO_ID, getFvIds());
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showCobranza", C_MODULE, "");
        }
      };

      var getFvIds = function() {
        return m_dialog.getIds();
      };

      var initialize = function() {
        try {
          m_title = getText(1624, ""); // Facturas de Venta
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
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");
        }
      };

      self.validate = function() {
        return P.resolvedPromise(true);
      };

      var getCliId = function() {
        // TODO: implement it.
      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("FacturaVenta.List", function(List, Cairo, Backbone, Marionette, $, _) {

    var NO_ID = Cairo.Constants.NO_ID;
    var CS = Cairo.Security.Actions.Ventas;
    var DB = Cairo.Database;
    var C_MODULE = "cFacturaVenta";
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

          var editors = Cairo.Editors.facturaVentaEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.facturaVentaEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "FacturaVenta",
            entityName: "facturaventa",
            entitiesName: "facturaventas"
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
              Cairo.LoadingMessage.show("FacturaVenta", "Loading Factura de Ventas from Crowsoft Cairo server.");

              var editor = Cairo.FacturaVenta.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(CS.DELETE_FACTURA)) {
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
              DB.getAPIVersion() + "ventas/facturaventa", id,
              Cairo.Constants.DELETE_FUNCTION, C_MODULE).whenSuccess(closeDialog, false);
          };

          // progress message
          //
          Cairo.LoadingMessage.show("FacturaVenta", "Loading Factura de Ventas from Crowsoft Cairo server.");

          self.documentList = Cairo.FacturaVentaListDoc.Edit.Controller.getEditor();
          var dialog = Cairo.Dialogs.Views.ListController.newDialogList();

          self.documentList.setListController(self);
          self.documentList.setDialog(dialog);
          self.documentList.list().then(Cairo.LoadingMessage.close);

        };

        createListDialog();
      }
    };
  });

}());
