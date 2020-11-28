(function() {
  "use strict";

  Cairo.module("RemitoVenta.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var TITLE = getText(1712, ""); // Remitos de Venta
      var SAVE_ERROR_MESSAGE = getText(2222, ""); // Error al grabar el Remito de Venta

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

      var C_MODULE = "cRemitoVenta";

      var C_ITEMS = "ITEMS";
      var C_HIDECOLSRV = "HideColsRv";

      var K_NUMERO = 1;
      var K_NRO_DOC = 2;
      var K_DESCRIP = 3;
      var K_FECHA = 4;
      var K_FECHA_ENTREGA = 5;
      var K_NETO = 6;
      var K_IVA_RI = 7;
      var K_IVA_RNI = 8;
      var K_TOTAL = 9;
      var K_CLI_ID = 10;
      var K_DOC_ID = 11;
      var K_DOCT_ID = 12;
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

      var K_DEPL_ID = 25;
      var K_VEN_ID = 26;
      var K_LGJ_ID = 27;
      var K_PRO_ID_ORIGEN = 29;
      var K_PRO_ID_DESTINO = 30;
      var K_TRANS_ID = 31;
      var K_CLIS_ID = 33;

      var K_COTIZACION = 28;

      var K_RETIRO = 34;
      var K_GUIA = 35;

      var K_CHOF_ID = 36;
      var K_CAM_ID = 37;
      var K_CAM_ID_SEMI = 38;
      var K_DESTINATARIO = 39;

      var K_ORDEN_COMPRA = 40;

      var K_HIDE_COLS = 41;

      var KI_RV_ID = 1;
      var KI_RVI_ID = 2;
      var KI_ORDEN = 3;
      var KI_CANTIDAD = 4;
      var KI_DESCRIP = 6;
      var KI_PRECIO = 7;
      var KI_IMPORTE = 8;
      var KI_NETO = 9;
      var KI_IVA_RI = 10;
      var KI_IVA_RNI = 11;
      var KI_PR_ID = 13;
      var KI_LPI_ID = 14;
      var KI_LDI_ID = 15;
      var KI_IVA_RI_PERCENT = 16;
      var KI_IVA_RNI_PERCENT = 17;
      var KI_DESCUENTO = 18;
      var KI_UNIDAD = 19;
      var KI_PRECIO_LP = 20;
      var KI_PRECIO_USR = 21;
      var KI_CCOS_ID = 22;

      var KI_PR_LLEVA_NRO_SERIE = 23;
      var KI_ES_KIT = 24;
      var KI_NRO_SERIE = 25;
      var KI_GRUPO = 26;

      var KI_STL_ID = 27;
      var KI_PR_LLEVA_LOTE = 28;

      var KI_PR_LOTE_FIFO = 32;

      var m_id = 0;
      var m_numero = 0;
      var m_estado = "";
      var m_estId = 0;
      var m_nroDoc = "";
      var m_descrip = "";
      var m_fecha = null;
      var m_fechaEntrega = null;
      var m_neto = 0;
      var m_ivaRi = 0;
      var m_ivaRni = 0;
      var m_total = 0;
      var m_subTotal = 0;
      var m_descuento1 = 0;
      var m_descuento2 = 0;
      var m_importeDesc1 = 0;
      var m_importeDesc2 = 0;
      var m_cpgId = 0;
      var m_condicionPago = "";
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
      var m_firmado;

      var m_venId = 0;
      var m_vendedor = "";
      var m_lgjId = 0;
      var m_legajo = "";

      var m_clisId = 0;
      var m_clienteSucursal = "";

      var m_chofId = 0;
      var m_chofer = "";

      var m_camId = 0;
      var m_camion = "";

      var m_camIdSemi = 0;
      var m_semi = "";

      var m_destinatario = "";

      var m_ordenCompra = "";

      var m_proIdOrigen = 0;
      var m_proOrigen = "";
      var m_proIdDestino = 0;
      var m_proDestino = "";

      var m_transId = "";
      var m_transporte = "";

      var m_editing;

      var m_showStockData;
      var m_deplId = 0;
      var m_deposito = "";

      var m_cotizacion = 0;
      var m_monId = 0;
      var m_lastFecha = null;
      var m_lastMonIdCotizacion = 0;

      var m_retiro = "";
      var m_guia = "";

      var m_depfId = 0;

      var m_stId = 0;
      var m_stIdConsumo = 0;
      var m_stIdConsumoTemp = 0;
      var m_stIdProducido = 0;

      var m_footer;
      var m_footerProps;
      var m_items;
      var m_itemsProps;
      var m_dialog;
      var m_properties;
      var m_listController = null;

      var m_lastDocId = 0;
      var m_lastDoctId = 0;

      var m_lastDocDesdePv = false;
      var m_lastDocDesdeBOM = false;
      var m_lastDocDesdeOs = false;

      var m_lastMonId = 0;
      var m_lastCliId = 0;
      var m_lastTrans = 0;
      var m_lastChofId = 0;
      var m_lastDocName = "";
      var m_lastCliName = "";

      var m_isNew;

      var m_itemsDeleted = "";

      var m_copy;

      var m_generalConfig;

      var m_docEditable;
      var m_docEditMsg = "";

      var m_pvIds = 0;
      var m_osIds = 0;

      var m_prnsIds = 0;

      var m_bIva;
      var m_bIvaRni;

      var m_taPropuesto;
      var m_taMascara = "";

      var m_applyEditor = null;

      var m_serialNumbers;
      var m_kitDefinitions;

      var m_bPushVirtualNext;
      var m_bAutoFactura;
      var m_bAutoPago;
      var m_modoVentaCtaCte;
      var m_cueIdAutoPago = 0;

      var m_defaultCurrency = D.getDefaultCurrency();

      var m_apiPath = DB.getAPIVersion();

      var emptyData = {
        items: []
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

      self.setPushVirtualNext = function(rhs) {
        m_bPushVirtualNext = rhs;
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

      self.setAutoFactura = function(rhs) {
        m_bAutoFactura = rhs;
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

      self.showRemito = function(cliId, pvIds) {
        showStartWizard(cliId, function() {
          m_pvIds = pvIds.slice();
          if(initMembers()) {
            showStartWizardPedido();
          }
        });
      };

      self.showRemitoOrden = function(cliId, osIds) {
        showStartWizard(cliId, function() {
          m_osIds = osIds.slice();
          if(initMembers()) {
            showStartWizardOrden();
          }
        });
      };

      self.showRemitoOrdenAuto = function(cliId, osIds, prnsIds) {
        showStartWizard(cliId, function() {
          m_osIds = osIds.slice();
          m_prnsIds = prnsIds.slice();
          if(initMembers()) {
            showStartWizardOrden();
          }
        });
      };

      var initMembers = function() {

        if(!Cairo.Security.docHasPermissionTo(
          CS.NEW_REMITO,
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
          CS.NEW_REMITO,
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

        return D.setDocNumberForCliente(m_lastCliId, m_lastDocId, m_dialog).then(
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
          m_lastTrans = NO_ID;
          m_lastChofId = NO_ID;

          if(!m_docEditable) {
            if(m_docEditMsg !== "") {
              p = M.showWarning(m_docEditMsg);
            }
          }

          return p || P.resolvedPromise(true);

        }).then(function() {

          var p = null;

          var docId = getDocId();

          if(docId === NO_ID) {
            p = M.showInfo(getText(1562, ""));
          }

          return p || P.resolvedPromise(true);

        }).then(function() {

          setDataCliente();
          return D.setDocNumber(m_lastDocId, m_dialog, CV.RV_NRODOC);

        }).then(function(enabled) {

          m_taPropuesto = enabled;
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
        var _rtn = false;

        try {

          if(m_id === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(CV.REMITO_VENTA);
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

            updateTotals();
            break;

          case Dialogs.Message.MSG_DOC_APPLY:

            showApply();
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

            Cairo.Documentation.show("", "", CS.NEW_REMITO);
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

            D.search(D.Types.REMITO_VENTA, self, Cairo.bool(info));
            break;

          case Dialogs.Message.MSG_DOC_DOC_AUX:

            if(m_id) {

              if(m_showStockData) {

                if(m_lastDocDesdeBOM) {
                  var menu = getText(1713, "")+ "~1"; // Ver &Transferencia de Stock~1
                  if(m_stIdConsumo !== NO_ID) {
                    menu = menu+ "|"+ getText(1714, "")+ "~2"; // |Ver &Consumo~2
                  }
                  if(m_stIdConsumoTemp !== NO_ID) {
                    menu = menu+ "|"+ getText(1715, "")+ "~3"; // |Ver Consumo de T&emporales~3
                  }
                  if(m_stIdProducido !== NO_ID) {
                    menu = menu+ "|"+ getText(1716, "")+ "~4"; // |Ver &Producción~4
                  }
                  menu = menu+ "|"+ getText(1717, "")+ "~5"; // |Ver T&odos~5
                  p = m_dialog.showPopMenu(menu);
                }
                else {
                  p = self.messageEx(Dialogs.Message.MSG_MENU_AUX, 1);
                }
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
                D.showDocAux(m_stId, "Stock");
                break;

              case 2:
                D.showDocAux(m_stIdConsumo, "Stock");
                break;

              case 3:
                D.showDocAux(m_stIdConsumoTemp, "Stock");
                break;

              case 4:
                D.showDocAux(m_stIdProducido, "Stock");
                break;

              case 5:
                D.showDocAux(m_stId, "Stock");

                if(m_stIdConsumo !== NO_ID) {
                  D.showDocAux(m_stIdConsumo, "Stock");
                }
                if(m_stIdConsumoTemp !== NO_ID) {
                  D.showDocAux(m_stIdConsumoTemp, "Stock");
                }
                if(m_stIdProducido !== NO_ID) {
                  D.showDocAux(m_stIdProducido, "Stock");
                }
                break;

              case 6:
                showFactura(false);
                break;

              case 7:
                showFactura(true);
                break;

              case 8:
                cancelRemito();
                break;
            }
            break;

          case Dialogs.Message.MSG_DOC_DOC_ACTION:

            if(m_id) {
              showMenuDocAction();
            }
            else {
              p = M.showInfo(getText(4896, "")); // Esta opción solo sirve para facturas y notas de debito
            }
            break;

          case Dialogs.Message.MSG_DOC_HISTORY:

            if(m_id !== NO_ID) {
              p = Cairo.History.show(Cairo.Tables.REMITOS_DE_VENTA, m_id, m_documento + " " + m_nroDoc);
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

          case Dialogs.Message.MSG_EXPORT_GET_FILE_NAME_POSTFIX:

            p = P.resolvedPromise(getFileNamePostFix());
            break;

          case Dialogs.Message.MSG_PRINT_GET_TITLE:

            p = m_nroDoc+ " - "+ m_cliente;
            break;
        }

        return p || P.resolvedPromise(true);
      };

      self.discardChanges = function() {
        Cairo.raiseError("RemitoVenta", "DiscardChanges was called");
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
                  m_lastDocDesdePv = valField(response.data, C.DOC_RV_DESDE_PV);
                  m_lastDocDesdeOs = valField(response.data, C.DOC_RV_DESDE_OS);
                  m_lastDocDesdeBOM = valField(response.data, C.DOC_RV_BOM);

                  m_showStockData = valField(response.data, C.DOC_MUEVE_STOCK);
                }
                return response.success;

              })
                .whenSuccess(function() {

                  var p = null;

                  // when the document property is changed and the dialog was
                  // editing a saved delivery note we need to move to a new note
                  //
                  if(m_id !== NO_ID && m_docId !== m_lastDocId) {

                    if(m_copy) {
                      return self.edit(D.Constants.DOC_CHANGED);
                    }
                    else {
                      p = self.edit(D.Constants.DOC_CHANGED);
                    }
                  }

                  return p || P.resolvedPromise(true);

                })
                .whenSuccess(function() {

                  return D.setDocNumber(m_lastCliId, m_lastDocId, m_dialog)
                    .then(function(info) {

                      m_taPropuesto = info.taEnabled;
                      return showCotizacion();

                    })
                    .then(function() {
                      showHideCols(true);
                    });
                });
            }

            p = p || P.resolvedPromise(true);

            p = p.then(function() {
              setEnabled();
            });

            break;

          case K_CLI_ID:

            setDataCliente().whenSuccess(function() {

              updateTotals();

              D.setDocNumberForCliente(m_lastCliId, m_lastDocId, m_dialog)
                .then(function(info) {

                  m_taPropuesto = info.taEnabled;

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

                return true;

              });
            }
            break;

          case K_DEPL_ID:

            p = D.getDepositoFisicoForLogico(getDeplId()).then(function(depfId) {
              m_depfId = depfId;
            });
            break;

          case K_CHOF_ID:

            p = setDataChofer();
            break;

          case K_HIDE_COLS:

            showHideCols(false);
            break;
        }

        return p || P.resolvedPromise(true);
      };

      self.save = function() {

        var isNew = false;

        var p = D.docCanBeEdited(m_docEditable, m_docEditMsg)
          .whenSuccess(function() {
            return D.docCanBeSaved(m_dialog, CV.RV_FECHA);
          })
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

            register.setFieldId(CV.RV_ID);
            register.setTable(CV.REMITO_VENTA);

            register.setPath(m_apiPath + "ventas/remitoventa");

            if(m_copy) {
              register.setId(Cairo.Constants.NEW_ID);
            }
            else {
              register.setId(m_id);
            }

            if(register.getId() === Cairo.Constants.NEW_ID) {
              m_estId = D.Status.pendiente;
            }

            var _count = m_properties.size();
            for (var _i = 0; _i < _count; _i++) {
              
              var property = m_properties.item(_i);
              
              switch (property.getKey()) {
                case K_NUMERO:
                  fields.add(CV.RV_NUMERO, property.getValue(), Types.long);
                  break;

                case K_NRO_DOC:
                  fields.add(CV.RV_NRODOC, property.getValue(), Types.text);
                  break;

                case K_DESCRIP:
                  fields.add(CV.RV_DESCRIP, property.getValue(), Types.text);
                  break;

                case K_FECHA:
                  fields.add(CV.RV_FECHA, property.getValue(), Types.date);
                  break;

                case K_FECHA_ENTREGA:
                  fields.add(CV.RV_FECHAENTREGA, property.getValue(), Types.date);
                  break;

                case K_CLI_ID:
                  fields.add(C.CLI_ID, property.getSelectId(), Types.id);
                  break;

                case K_COTIZACION:
                  fields.add(CV.RV_COTIZACION, property.getValue(), Types.double);
                  break;

                case K_CCOS_ID:
                  fields.add(C.CCOS_ID, property.getSelectId(), Types.id);
                  break;

                case K_SUC_ID:
                  fields.add(C.SUC_ID, property.getSelectId(), Types.id);
                  break;

                case K_DESCUENTO1:
                  fields.add(CV.RV_DESCUENTO1, property.getValue(), Types.currency);
                  break;

                case K_DESCUENTO2:
                  fields.add(CV.RV_DESCUENTO2, property.getValue(), Types.currency);
                  break;

                case K_DOC_ID:
                  fields.add(C.DOC_ID, property.getSelectId(), Types.id);
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
                  fields.add(C.TRANS_ID, property.getSelectId(), Types.id);
                  break;

                case K_CLIS_ID:
                  fields.add(C.CLIS_ID, property.getSelectId(), Types.id);
                  break;

                case K_CHOF_ID:
                  fields.add(C.CHOF_ID, property.getSelectId(), Types.id);
                  break;

                case K_CAM_ID:
                  fields.add(C.CAM_ID, property.getSelectId(), Types.id);
                  break;

                case K_CAM_ID_SEMI:
                  fields.add(C.CAM_ID_SEMI, property.getSelectId(), Types.id);
                  break;

                case K_DESTINATARIO:
                  fields.add(CV.RV_DESTINATARIO, property.getValue(), Types.text);
                  break;

                case K_ORDEN_COMPRA:
                  fields.add(CV.RV_ORDEN_COMPRA, property.getValue(), Types.text);
                  break;

                case K_DEPL_ID:
                  fields.add(CV.DEPL_ID, property.getSelectId(), Types.id);
                  break;

                case K_RETIRO:
                  fields.add(CV.RV_RETIRO, property.getValue(), Types.text);
                  break;

                case K_GUIA:
                  fields.add(CV.RV_GUIA, property.getValue(), Types.text);
                  break;
              }
            }

            var _count = m_footerProps.size();
            for (var _i = 0; _i < _count; _i++) {

              property = m_footerProps.item(_i);

              switch (property.getKey()) {

                case K_TOTAL:
                  fields.add(CV.RV_TOTAL, property.getValue(), Types.currency);
                  break;

                case K_NETO:
                  fields.add(CV.RV_NETO, property.getValue(), Types.currency);
                  break;

                case K_IVA_RI:
                  fields.add(CV.RV_IVARI, property.getValue(), Types.currency);
                  break;

                case K_IVA_RNI:
                  fields.add(CV.RV_IVARNI, property.getValue(), Types.currency);
                  break;

                case K_SUBTOTAL:
                  fields.add(CV.RV_SUBTOTAL, property.getValue(), Types.currency);
                  break;

                case K_IMPORTE_DESC_1:
                  fields.add(CV.RV_IMPORTE_DESC_1, property.getValue(), Types.currency);
                  break;

                case K_IMPORTE_DESC_2:
                  fields.add(CV.RV_IMPORTE_DESC_2, property.getValue(), Types.currency);
                  break;
              }
            }

            fields.add(C.EST_ID, m_estId, Types.id);

            saveItems(register);

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
                    return M.showWarningWithFalse(result.errors.getMessage());
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
                              p = P.resolvedPromise(true);
                            }
                          }

                          p = p.then(function() {
                            if(m_isNew) {
                              m_dialog.setSendNewDoc(Cairo.UserConfig.getNuevoAlGrabar());
                            }
                            else {
                              m_dialog.setSendNewDoc(false);
                            }
                          });
                        }
                        else {
                          p = P.resolvedPromise(true);
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
        return "#venta/remitoventa/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "remitoventa" + id;
      };

      self.getTitle = function() {
        return TITLE + (m_id !== NO_ID ? " " + m_nroDoc + " - " + m_cliente : "");
      };

      self.getTabTitle = function() {
        return "RV-" + m_nroDoc;
      };
      
      self.validate = function() {

        for (var _i = 0, _count = m_properties.size(); _i < _count; _i++) {
          
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

            case K_CLI_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                return M.showInfoWithFalse(getText(1563, "")); // Debe indicar un Cliente
              }
              break;

            case K_DOC_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                return M.showInfoWithFalse(getText(1562, "")); // Debe indicar un documento
              }
              break;

            case K_SUC_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                return M.showInfoWithFalse(getText(1560, "")); // Debe indicar una sucursal
              }
              break;

            case K_COTIZACION:
              if(valEmpty(property.getValue(), Types.double) && property.getVisible()) {
                return M.showInfoWithFalse(getText(1626, "")); // Debe indicar una cotización
              }
              break;

            case K_DEPL_ID:
              if(valEmpty(property.getSelectId(), Types.id) && m_showStockData) {
                return M.showInfoWithFalse(getText(1559, "")); // Debe indicar un deposito
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      self.isEmptyRow = function(key, row, rowIndex) {
        var isEmpty = true;

        try {

          switch (key) {
            case K_ITEMS:
              isEmpty = isEmptyRowItems(row, rowIndex);
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

      self.nroDoc = function() {
        return m_nroDoc;
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
            m_nroDoc = valField(response.data, CV.FV_NRODOC);

            return true;

          }
          catch(ex) {
            Cairo.manageErrorEx(ex.message, ex, "loadForPrint", C_MODULE, "");
          }

          return false;
        };

        return DB.getData("load[" + m_apiPath + "ventas/facturaventa/info]", id)
          .whenSuccessWithResult(loadData, false);
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
            CS.LIST_REMITO,
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
              loadItems(getItems());
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
            if(id !== D.Constants.DOC_CHANGED && m_isNew && m_lastDocDesdePv) {

              if(m_lastDocDesdeBOM) {
                showStartWizardBOM();
              }
              else {
                showStartWizardPedido();
              }
            }
            else if(id !== D.Constants.DOC_CHANGED && m_isNew && m_lastDocDesdeOs) {

              showStartWizardOrden();
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
              
              var property = m_items.getProperties().item(C_ITEMS);
              showImporteAndIva(property.getGrid().getRows().item(lRow));
              updateTotals();
              break;
          }
        }
        catch (ex) {
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

            var row = items.getGrid().getRows().item(virtualRow.getInfo().row);

            if(row.item(virtualRow.getInfo().col).getKey() === KI_PR_ID) {

              var cell = Dialogs.cell(row, KI_PR_ID);

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
              rtn = cellId(row, KI_PR_LLEVA_NRO_SERIE) === true;
            }
            break;

          case KI_STL_ID:

            row = property.getGrid().getRows().item(lRow);

            if(row !== null) {

              if(cellId(row, KI_PR_LLEVA_LOTE) === true
                && cellId(row, KI_PR_LLEVA_NRO_SERIE) === false) {

                var prIdKit = null;
                if(cellId(row, KI_ES_KIT)) {
                  prIdKit = cellId(row, KI_PR_ID);
                }

                var column = grid.getColumns().item(C.STL_ID);
                column.setSelectFilter(D.getStockLoteFilterEx(
                  cellId(row, KI_PR_ID),
                  getDeplId(),
                  Cairo.getStockConfig().getStockXFisico(),
                  prIdKit,
                  m_depfId,
                  getCliId(),
                  NO_ID
                ));

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

            Cairo.LoadingMessage.show("Remito de Ventas", "Loading data for product.");

            var row = grid.getRows().item(lRow);
            p = setDataProducto(row, newValueId)
              .whenSuccess(
                call(
                  D.setPrecios, row, newValueId, m_properties.item(C.LP_ID).getSelectId(), KI_PRECIO_LP, KI_PRECIO_USR
                )
              )
              .whenSuccess(
                call(
                  D.setDescuentos, row, newValueId, call(getPrecioFromRow, row),
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

                if(cellId(row, KI_PR_LLEVA_NRO_SERIE) === true) {

                  var prId = cellId(row, KI_PR_ID);

                  p = Cairo.SerialNumber.edit(
                    cellId(row, KI_GRUPO), cellFloat(row, KI_CANTIDAD),
                    row, m_serialNumbers, KI_GRUPO, KI_NRO_SERIE, lRow, prId, getDeplId(),
                    false, false, Cairo.Kit.getKitInfo(prId, m_kitDefinitions), NO_ID, getCliId());
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

            var id = cellFloat(row, KI_RVI_ID);
            if(id !== NO_ID) { m_itemsDeleted = m_itemsDeleted+ id.toString()+ ","; }
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

            case KI_PR_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(1899, "", strRow)); // Debe indicar un producto de Compra (1)
              }
              break;

            case KI_NRO_SERIE:
              llevaNroSerie = cellId(row, KI_PR_LLEVA_NRO_SERIE) === true;
              if(m_showStockData && valEmpty(cell.getValue(), Types.text) && llevaNroSerie) {
                return M.showInfoWithFalse(getText(1630, "", strRow)); // Debe indicar un numero de serie (1)
              }
              break;

            case KI_STL_ID:
              if(m_showStockData) {
                if(valEmpty(cell.getId(), Types.id)
                  && cellId(row, KI_PR_LLEVA_LOTE)
                  && cellId(row, KI_PR_LLEVA_LOTE) === false
                  && cellId(row, KI_PR_LOTE_FIFO) === false) {
                  return M.showInfoWithFalse(getText(1632, "", strRow)); // Debe indicar un lote (1)
                }
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

        var validateDocDefault = false;
        var elem;

        var properties = m_properties;
        properties.clear();

        var tabs = m_dialog.getTabs();
        tabs.clear();

        tabs.add(null).setIndex(0).setName(Cairo.Constants.TAB_GENERAL);

        tabs.add(null).setIndex(1).setName(getText(1566, "")); // Adicionales
        tabs.add(null).setIndex(2).setName(getText(1050, "")); // Transporte

        elem = properties.add(null, C.DOC_ID);
        elem.setType(T.select);
        elem.setTable(Cairo.Tables.DOCUMENTO);
        elem.setName(getText(1567, "")); // Documento
        elem.setKey(K_DOC_ID);

        if(m_docId !== NO_ID) {
          elem.setSelectId(m_docId);
          elem.setValue(m_documento);
        }
        else {
          // Preferencias del usuario
          //
          elem.setSelectId(Cairo.UserConfig.getDocRvId());
          elem.setValue(Cairo.UserConfig.getDocRvName());

          validateDocDefault = elem.getSelectId() !== NO_ID;
        }

        elem.setSelectFilter(D.REMITO_VENTA_DOC_FILTER);

        elem = properties.add(null, Cairo.Constants.NUMBER_ID);
        elem.setType(T.numeric);
        elem.setSubType(ST.Integer);
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

        elem = properties.add(null, CV.RV_FECHA);
        elem.setType(T.date);
        elem.setName(getText(1569, "")); // Fecha
        elem.setKey(K_FECHA);
        elem.setValue(m_fecha);

        elem = properties.add(null, CV.RV_FECHAENTREGA);
        elem.setType(T.date);
        elem.setName(getText(1570, "")); // Entrega
        elem.setKey(K_FECHA_ENTREGA);
        elem.setValue(m_fechaEntrega);

        elem = properties.add(null, C.CLI_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CLIENTE);
        elem.setName(getText(1150, "")); // Cliente
        elem.setKey(K_CLI_ID);
        elem.setSelectId(m_cliId);
        elem.setValue(m_cliente);
        m_dialog.setNewPropertyKeyFocus(C.CLI_ID);

        elem = properties.add(null, CV.RV_NRODOC);
        elem.setType(T.text);
        elem.setName(getText(1065, "")); // Número
        elem.setSize(50);
        elem.setKey(K_NRO_DOC);
        elem.setValue(m_nroDoc);
        elem.setTextMask(m_taMascara);
        elem.setTextAlign(Dialogs.TextAlign.right);

        elem = properties.add(null, C.CPG_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CONDICIONES_DE_PAGO);
        elem.setName(getText(1571, "")); // Cond. pago
        elem.setKey(K_CPG_ID);
        elem.setSelectId(m_cpgId);
        elem.setValue(m_condicionPago);

        elem = properties.add(null, CV.RV_COTIZACION);
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setName(getText(1650, "")); // Cotiz.
        elem.setFormat(Cairo.Settings.getCurrencyRateDecimalsFormat());
        elem.setKey(K_COTIZACION);
        elem.setValue(m_cotizacion);

        elem = properties.add(null, CV.RV_DESCUENTO1);
        elem.setType(T.numeric);
        elem.setSubType(ST.percentage);
        elem.setName(getText(1573, "")); // Desc. 1
        elem.setKey(K_DESCUENTO1);
        elem.setValue(m_descuento1);

        elem = properties.add(null, CV.RV_DESCUENTO2);
        elem.setType(T.numeric);
        elem.setSubType(ST.percentage);
        elem.setName("2");
        elem.setKey(K_DESCUENTO2);
        elem.setValue(m_descuento2);

        elem = properties.add(null, CV.DEPL_ID_ORIGEN);
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
          elem.setValue(Cairo.UserConfig.getDeplName());
        }

        elem.setEnabled(m_showStockData);

        elem = properties.add(null, C.LP_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LISTAS_DE_PRECIOS);
        elem.setName(getText(1397, "")); // Lista de Precios
        elem.setSelectFilter(D.getListaPrecioForCliente(m_docId, m_cliId));
        elem.setKey(K_LP_ID);
        elem.setSelectId(m_lpId);
        elem.setValue(m_listaPrecio);

        elem = properties.add(null, C.VEN_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.VENDEDOR);
        elem.setName(getText(1510, "")); // Vendedor
        elem.setKey(K_VEN_ID);
        elem.setSelectId(m_venId);
        elem.setValue(m_vendedor);

        elem = properties.add(null, C.SUC_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.SUCURSAL);
        elem.setName(getText(1281, "")); // Sucursal
        elem.setKey(K_SUC_ID);
        elem.setSelectId(m_sucId);
        elem.setValue(m_sucursal);

        elem = properties.add(null, CV.RV_DESCRIP);
        elem.setType(T.text);
        elem.setSubType(ST.memo);
        elem.setName(getText(1211, "")); // Observ.
        elem.setSize(5000);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);

        elem = properties.add(null, C.CLIS_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.SUCURSALES_DE_CLIENTES);
        elem.setName(getText(1576, "")); // Sucursal del Cliente
        elem.setKey(K_CLIS_ID);
        elem.setValue(m_clienteSucursal);
        elem.setSelectId(m_clisId);
        elem.setSelectFilter(D.getSelectFilterSucursalCliente(m_cliId));
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

        elem = properties.add(null, C.CCOS_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CENTROS_DE_COSTO);
        elem.setName(getText(1057, "")); // Centro de Costo
        elem.setKey(K_CCOS_ID);
        elem.setSelectId(m_ccosId);
        elem.setValue(m_centroCosto);
        elem.setTabIndex(1);

        elem = properties.add(null, CV.RV_ORDEN_COMPRA);
        elem.setType(T.text);
        elem.setName(getText(1924, "")); // Orden de Compra
        elem.setKey(K_ORDEN_COMPRA);
        elem.setValue(m_ordenCompra);
        elem.setTabIndex(1);

        elem = properties.add(null, C.LGJ_ID);
        elem.setType(T.select);
        elem.setTable(Cairo.Tables.LEGAJOS);
        elem.setName(getText(1575, "")); // Legajo
        elem.setKey(K_LGJ_ID);
        elem.setSelectId(m_lgjId);
        elem.setValue(m_legajo);
        elem.setTabIndex(1);

        elem = properties.add(null, CV.RV_RETIRO);
        elem.setType(T.text);
        elem.setSubType(ST.textButtonEx);
        elem.setName(getText(2883, "")); // Retirado Por
        elem.setKey(K_RETIRO);
        elem.setValue(m_retiro);
        elem.setTabIndex(1);

        elem = properties.add(null, CV.RV_GUIA);
        elem.setType(T.text);
        elem.setSubType(ST.textButtonEx);
        elem.setName(getText(2884, "")); // Guia de Entrega
        elem.setKey(K_GUIA);
        elem.setValue(m_guia);
        elem.setTabIndex(1);

        elem = properties.add(null, C.LD_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LISTAS_DE_DESCUENTOS);
        elem.setName(getText(1398, "")); // Lista de Descuentos
        elem.setSelectFilter(D.getListaDescuentoForCliente(m_docId, m_cliId));
        elem.setKey(K_LD_ID);
        elem.setSelectId(m_ldId);
        elem.setValue(m_listaDescuento);
        elem.setTabIndex(1);

        elem = properties.add(null, C.TRANS_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.TRANSPORTE);
        elem.setName(getText(1050, "")); // Transporte
        elem.setKey(K_TRANS_ID);
        elem.setValue(m_transporte);
        elem.setSelectId(m_transId);
        elem.setTabIndex(2);

        elem = properties.add(null, C.CHOF_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CHOFER);
        elem.setName(getText(1051, "")); // Chofer
        elem.setKey(K_CHOF_ID);
        elem.setValue(m_chofer);
        elem.setSelectId(m_chofId);
        elem.setSelectFilter(D.getSelectFilterChofer(m_transId));
        elem.setTabIndex(2);

        elem = properties.add(null, C.CAM_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CAMION);
        elem.setName(getText(3489, "")); // Camion
        elem.setKey(K_CAM_ID);
        elem.setValue(m_camion);
        elem.setSelectId(m_camId);
        elem.setSelectFilter(D.getSelectFilterCamion(m_transId));
        elem.setTabIndex(2);

        elem = properties.add(null, C.CAM_ID_SEMI);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CAMIONES_SEMI);
        elem.setName(getText(3493, "")); // Semi
        elem.setKey(K_CAM_ID_SEMI);
        elem.setValue(m_semi);
        elem.setSelectId(m_camIdSemi);
        elem.setSelectFilter(D.getSelectFilterCamion(m_transId));
        elem.setTabIndex(2);

        elem = properties.add(null, CV.RV_DESTINATARIO);
        elem.setType(T.text);
        elem.setSubType(ST.memo);
        elem.setName(getText(3494, "")); // Destinatario
        elem.setKey(K_DESTINATARIO);
        elem.setValue(m_destinatario);
        elem.setTabIndex(2);

        if(Cairo.UserConfig.getShowDataAddInVentas()) {

          elem = properties.add(null, CV.CLIENTE_DATA_ADD);
          elem.setType(T.text);
          elem.setSubType(ST.memo);

        }

        elem = properties.add(null, Cairo.Constants.HIDE_COLUMNS);
        elem.setType(T.check);
        elem.setName(getText(3901, "")); // Ocultar Columnas
        elem.setKey(K_HIDE_COLS);
        elem.setValue(true);
        elem.setIsEditProperty(false);

        if(!m_dialog.show(self)) { return false; }

        /////////////////////////////////////////////////////////////////////
        // ITEMS
        /////////////////////////////////////////////////////////////////////

        tabs = m_items.getTabs();
        tabs.clear();

        tabs.add(null).setIndex(0).setName(getText(1371, "")); // Items

        var properties = m_itemsProps;

        properties.clear();

        elem = properties.add(null, C_ITEMS);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridItems(elem);
        loadGridItems(elem);
        elem.setName(C_ITEMS);
        elem.setKey(K_ITEMS);
        elem.setTabIndex(0);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_itemsDeleted = "";

        if(!m_items.show(self)) { return false; }

        /////////////////////////////////////////////////////////////////////
        // FOOTER
        /////////////////////////////////////////////////////////////////////

        var properties = m_footerProps;
        properties.clear();

        elem = properties.add(null, CV.RV_SUBTOTAL);
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setName(getText(1579, "")); // Sub Total
        elem.setKey(K_SUBTOTAL);
        elem.setValue(m_subTotal);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.RV_IMPORTE_DESC_1);
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setName(getText(1573, "")); // Desc. 1
        elem.setKey(K_IMPORTE_DESC_1);
        elem.setValue(m_importeDesc1);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.RV_IMPORTE_DESC_2);
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setName(getText(1580, "")); // Desc. 2
        elem.setKey(K_IMPORTE_DESC_2);
        elem.setValue(m_importeDesc2);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.RV_NETO);
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setName(getText(1581, "")); // Neto
        elem.setKey(K_NETO);
        elem.setValue(m_neto);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.RV_IVARI);
        elem.setType(T.numeric);
        elem.setName(getText(1582, "")); // IVA RI
        elem.setSubType(ST.money);
        elem.setKey(K_IVA_RI);
        elem.setValue(m_ivaRi);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.RV_IVARNI);
        elem.setType(T.numeric);
        elem.setName(getText(1583, "")); // IVA RNI
        elem.setSubType(ST.money);
        elem.setKey(K_IVA_RNI);
        elem.setValue(m_ivaRni);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.RV_TOTAL);
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

        if(Cairo.UserConfig.getUseColorsInDocuments()) {
          m_dialog.setBackColorTabMain("#c8f6c1");
        }

        return true;
      };

      var getCotizacion = function() {
        return m_properties.item(CV.RV_COTIZACION);
      };

      var showCotizacion = function() {
        var p = null;
        var monId;

        if(m_id === NO_ID) {
          if(m_lastDocId === NO_ID) {
            return P.resolvedPromise(true);
          }
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

      var setGridItems = function(property) {
        var hideColumns = m_properties.item(Cairo.Constants.HIDE_COLUMNS).getValue();
        var bColVisible = val(hideColumns) === 0;

        var grid = property.getGrid();
        var columns = grid.getColumns();
        columns.clear();

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_RVI_ID);

        elem = columns.add(null);
        elem.setName(getText(1367, "")); // Articulo
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PRODUCTOS_DE_VENTA);
        elem.setKey(KI_PR_ID);
        if(Cairo.UserConfig.getMultiSelect()) {
          elem.setSelectType(Cairo.Select.SelectType.tree);
        }

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

        var elem = columns.add(null, CV.STL_ID);
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
        elem.setEnabled(Cairo.Security.silentHasPermissionTo(CS.EDIT_PRICE_REM));

        elem = columns.add(null);
        elem.setName(getText(1588, "")); // Precio c/desc.
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KI_PRECIO);
        elem.setEnabled(false);

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
        elem.setName(getText(1057, "")); // Centro de Costo
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CENTROS_DE_COSTO);
        elem.setKey(KI_CCOS_ID);
        elem.setVisible(bColVisible);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PR_LLEVA_LOTE);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PR_LOTE_FIFO);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PR_LLEVA_NRO_SERIE);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_ES_KIT);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_GRUPO);

        grid.getRows().clear();
      }

      var loadItems = function(property, cotizacion) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();

        for(var _i = 0, count = m_data.items.length; _i < count; _i += 1) {

          var row = rows.add(null, getValue(m_data.items[_i], CV.RVI_ID));

          elem = elem.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.RVI_ID));
          elem.setKey(KI_RVI_ID);

          elem = elem.add(null);
          elem.setValue(getValue(m_data.items[_i], C.PR_NAME_VENTA));
          elem.setId(getValue(m_data.items[_i], C.PR_ID));
          elem.setKey(KI_PR_ID);

          elem = elem.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.RVI_DESCRIP));
          elem.setKey(KI_DESCRIP);

          elem = elem.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.RVI_CANTIDAD));
          elem.setKey(KI_CANTIDAD);

          elem = elem.add(null);
          elem.setValue("");
          elem.setKey(KI_NRO_SERIE);

          elem = elem.add(null);
          elem.setValue(getValue(m_data.items[_i], C.STL_CODE));
          elem.setId(getValue(m_data.items[_i], C.STL_ID));
          elem.setKey(KI_STL_ID);

          elem = elem.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.RVI_DESCUENTO));
          elem.setKey(KI_DESCUENTO);

          elem = elem.add(null);
          elem.setValue(getValue(m_data.items[_i], C.UN_NAME));
          elem.setKey(KI_UNIDAD);

          elem = elem.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.RVI_PRECIO_LISTA));
          elem.setKey(KI_PRECIO_LP);

          elem = elem.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.RVI_PRECIO_USR));
          elem.setKey(KI_PRECIO_USR);

          elem = elem.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.RVI_PRECIO));
          elem.setKey(KI_PRECIO);

          elem = elem.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.RVI_NETO));
          elem.setKey(KI_NETO);

          elem = elem.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.RVI_IVARI));
          elem.setKey(KI_IVA_RI);

          elem = elem.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.RVI_IVARNI));
          elem.setKey(KI_IVA_RNI);

          elem = elem.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.RVI_IMPORTE));
          elem.setKey(KI_IMPORTE);

          elem = elem.add(null);
          if(m_bIva) {
            elem.setValue(getValue(m_data.items[_i], CV.RVI_IVA_RI_PORC));
          }
          else {
            elem.setValue(0);
          }
          elem.setKey(KI_IVA_RI_PERCENT);

          elem = elem.add(null);
          if(m_bIvaRni) {
            elem.setValue(getValue(m_data.items[_i], CV.RVI_IVA_RNI_PORC));
          }
          else {
            elem.setValue(0);
          }
          elem.setKey(KI_IVA_RNI_PERCENT);

          elem = elem.add(null);
          elem.setValue(getValue(m_data.items[_i], C.CCOS_NAME));
          elem.setId(getValue(m_data.items[_i], C.CCOS_ID));
          elem.setKey(KI_CCOS_ID);

          elem = elem.add(null);
          elem.setId(getValue(m_data.items[_i], C.PR_LLEVA_NRO_LOTE));
          elem.setKey(KI_PR_LLEVA_LOTE);

          elem = elem.add(null);
          elem.setId(getValue(m_data.items[_i], C.PR_LOTE_FIFO));
          elem.setKey(KI_PR_LOTE_FIFO);

          elem = elem.add(null);
          elem.setId(getValue(m_data.items[_i], C.PR_LLEVA_NRO_SERIE));
          elem.setKey(KI_PR_LLEVA_NRO_SERIE);

          elem = elem.add(null);
          elem.setId(getValue(m_data.items[_i], C.PR_ES_KIT));
          elem.setKey(KI_ES_KIT);

          elem = elem.add(null);
          elem.setId(getValue(m_data.items[_i], CV.RVI_ID));
          elem.setKey(KI_GRUPO);

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

            curGroup = getValue(m_data.serialNumbers[_i], CV.FVI_ID);
            coll = Cairo.Collections.createCollection(Cairo.SerialNumber.create);
            m_serialNumbers.add(coll, Cairo.Collections.getKey(curGroup));
          }

          var prnsId = getValue(m_data.serialNumbers[_i], C.PRNS_ID);

          serialNumber = coll.add(null, Cairo.Collections.getKey(prnsId));
          serialNumber.setPrnsId(prnsId);
          serialNumber.setCode(getValue(m_data.serialNumbers[_i], C.PRNS_CODE));
          serialNumber.setDescrip(getValue(m_data.serialNumbers[_i], C.PRNS_DESCRIP));
          serialNumber.setFechaVto(getValue(m_data.serialNumbers[_i], C.PRNS_FECHA_VTO));
          serialNumber.setPrIdItem(getValue(m_data.serialNumbers[_i], C.PR_ID));
          serialNumber.setKitItem(getValue(m_data.serialNumbers[_i], C.PR_NAME_COMPRA));

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
        data.serialNumbers = data.get('serialNumbers');
        data.kitDefinitions = data.get('kitDefinitions');

        return data;
      };

      var load = function(id) {
        m_data = emptyData;

        return Cairo.Database.getData("load[" + m_apiPath + "ventas/remitoventa]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            var p = null;

            if(response.data.id !== NO_ID) {

              m_data = loadDataFromResponse(response);

              var data = response.data;

              m_id = getValue(data, CV.RV_ID);
              m_numero = getValue(data, CV.RV_NUMERO);
              m_nroDoc = getValue(data, CV.RV_NRODOC);
              m_descrip = getValue(data, CV.RV_DESCRIP);
              m_fecha = getValue(data, CV.RV_FECHA);
              m_fechaEntrega = getValue(data, CV.RV_FECHAENTREGA);
              m_neto = getValue(data, CV.RV_NETO);
              m_ivaRi = getValue(data, CV.RV_IVARI);
              m_ivaRni = getValue(data, CV.RV_IVARNI);
              m_total = getValue(data, CV.RV_TOTAL);
              m_subTotal = getValue(data, CV.RV_SUBTOTAL);
              m_descuento1 = getValue(data, CV.RV_DESCUENTO1);
              m_descuento2 = getValue(data, CV.RV_DESCUENTO2);
              m_importeDesc1 = getValue(data, CV.RV_IMPORTE_DESC_1);
              m_importeDesc2 = getValue(data, CV.RV_IMPORTE_DESC_2);
              m_cliId = getValue(data, C.CLI_ID);
              m_cliente = getValue(data, C.CLI_NAME);
              m_ccosId = getValue(data, C.CCOS_ID);
              m_centroCosto = getValue(data, C.CCOS_NAME);
              m_sucId = getValue(data, C.SUC_ID);
              m_sucursal = getValue(data, C.SUC_NAME);
              m_docId = getValue(data, C.DOC_ID);
              m_documento = getValue(data, C.DOC_NAME);
              m_doctId = getValue(data, C.DOCT_ID);
              m_lpId = getValue(data, C.LP_ID);
              m_listaPrecio = getValue(data, C.LP_NAME);
              m_cpgId = getValue(data, C.CPG_ID);
              m_condicionPago = getValue(data, C.CPG_NAME);
              m_ldId = getValue(data, C.LD_ID);
              m_listaDescuento = getValue(data, C.LD_NAME);
              m_estId = getValue(data, C.EST_ID);
              m_estado = getValue(data, C.EST_NAME);
              m_firmado = getValue(data, CV.RV_FIRMADO);
              m_cotizacion = getValue(data, CV.RV_COTIZACION);

              m_venId = getValue(data, C.VEN_ID);
              m_vendedor = getValue(data, C.VEN_NAME);
              m_lgjId = getValue(data, C.LGJ_ID);
              m_legajo = getValue(data, C.LGJ_CODE);
              m_proIdOrigen = getValue(data, C.PRO_ID_ORIGEN);
              m_proOrigen = getValue(data, C.PRO_ORIGEN_NAME);
              m_proIdDestino = getValue(data, C.PRO_ID_ORIGEN);
              m_proDestino = getValue(data, C.PRO_ID_DESTINO);
              m_transId = getValue(data, C.TRANS_ID);
              m_transporte = getValue(data, C.TRANS_NAME);

              m_clisId = getValue(data, C.CLIS_ID);
              m_clienteSucursal = getValue(data, C.CLIS_NAME);

              m_chofId = getValue(data, C.CHOF_ID);
              m_chofer = getValue(data, C.CHOF_NAME);

              m_camId = getValue(data, C.CAM_ID);
              m_camion = getValue(data, C.CAM_PATENTE);

              m_camIdSemi = getValue(data, C.CAM_ID_SEMI);
              m_semi = getValue(data, C.CAM_PATENTE_SEMI);

              m_docEditable = getValue(data, C.DOC_EDITABLE);
              m_docEditMsg = getValue(data, C.DOC_EDIT_MSG);

              m_retiro = getValue(data, CV.RV_RETIRO);
              m_guia = getValue(data, CV.RV_GUIA);
              m_destinatario = getValue(data, CV.RV_DESTINATARIO);

              m_ordenCompra = getValue(data, CV.RV_ORDEN_COMPRA);

              m_depfId = getValue(data, C.DEPF_ID);
              m_deplId = getValue(data, C.DEPL_ID);
              m_deposito = getValue(data, C.DEPL_NAME);

              m_stId = getValue(data, C.ST_ID);
              m_stIdConsumo = getValue(data, C.ST_ID_CONSUMO);
              m_stIdConsumoTemp = getValue(data, C.ST_ID_CONSUMO_TEMP);
              m_stIdProducido = getValue(data, C.ST_ID_PRODUCIDO);

              m_taPropuesto = getValue(data, C.TA_PROPUESTO);
              m_taMascara = getValue(data, C.TA_MASCARA);

              m_bIva = getValue(data, C.HAS_IVA_RI);
              m_bIvaRni = getValue(data, C.HAS_IVA_RNI);

              m_monId = getValue(data, CV.MON_ID);

              m_lastDocDesdePv = valField(data, C.DOC_RV_DESDE_PV);
              m_lastDocDesdeOs = valField(data, C.DOC_RV_DESDE_OS);
              m_lastDocDesdeBOM = valField(data, C.DOC_RV_BOM);

              m_lastDocId = m_docId;
              m_lastDocName = m_documento;
              m_lastDoctId = m_doctId;
              m_lastMonId = m_monId;
              m_lastCliId = m_cliId;
              m_lastCliName = m_cliente;
              m_lastTrans = m_transId;
              m_lastChofId = m_chofId;
              m_lastMonIdCotizacion = m_monId;
              m_lastFecha = m_fecha;

            }
            else {
              m_id = NO_ID;
              m_numero = 0;
              m_nroDoc = "";
              m_descrip = "";
              m_fecha = Cairo.Dates.today();
              m_fechaEntrega = Cairo.Dates.tomorrow();
              m_neto = 0;
              m_ivaRi = 0;
              m_ivaRni = 0;
              m_total = 0;
              m_subTotal = 0;
              m_descuento1 = 0;
              m_descuento2 = 0;
              m_importeDesc1 = 0;
              m_importeDesc2 = 0;
              m_cliId = NO_ID;
              m_cliente = "";
              m_ccosId = NO_ID;
              m_centroCosto = "";
              m_docId = NO_ID;
              m_documento = "";
              m_doctId = NO_ID;
              m_lpId = NO_ID;
              m_ldId = NO_ID;
              m_cpgId = NO_ID;
              m_condicionPago = "";
              m_listaPrecio = "";
              m_listaDescuento = "";
              m_estId = NO_ID;
              m_estado = "";
              m_sucId = Cairo.User.getSucId();
              m_sucursal = Cairo.User.getSucName();
              m_firmado = false;
              m_cotizacion = 0;

              m_retiro = "";
              m_guia = "";
              m_destinatario = "";
              m_ordenCompra = "";

              m_clisId = NO_ID;
              m_clienteSucursal = "";

              m_chofId = NO_ID;
              m_chofer = "";

              m_camId = NO_ID;
              m_camion = "";

              m_camIdSemi = NO_ID;
              m_semi = "";

              m_venId = NO_ID;
              m_vendedor = "";
              m_lgjId = NO_ID;
              m_legajo = "";
              m_proIdOrigen = NO_ID;
              m_proOrigen = "";
              m_proIdDestino = NO_ID;
              m_proDestino = "";
              m_transId = NO_ID;
              m_transporte = "";

              m_depfId = NO_ID;
              m_deplId = NO_ID;
              m_deposito = "";

              m_stId = NO_ID;
              m_stIdConsumo = NO_ID;
              m_stIdConsumoTemp = NO_ID;
              m_stIdProducido = NO_ID;

              m_taPropuesto = false;
              m_taMascara = "";

              m_docId = m_lastDocId;
              m_doctId = m_lastDoctId;
              m_cliId = m_lastCliId;
              m_cliente = m_lastCliName;
              m_documento = m_lastDocName;

              m_lastTrans = NO_ID;
              m_lastChofId = NO_ID;

              m_bIvaRni = false;
              m_bIva = false;

              m_monId = NO_ID;

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

              p = p || P.resolvedPromise(true);

              p = p
                .then(P.call(D.editableStatus, m_docId, CS.NEW_REMITO))
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

      var saveItems = function(mainRegister) {

        var transaction = DB.createTransaction();
        var orden = 0;

        var order = { n: 0 };
        var grupo = 0;
        var prId = 0;

        transaction.setTable(CV.REMITO_VENTA_ITEM_TMP);

        var rows = getGrid(m_items, C_ITEMS).getRows();

        for (var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();
          register.setFieldId(CV.RVI_TMP_ID);
          register.setTable(CV.REMITO_VENTA_ITEM_TMP);
          register.setId(Cairo.Constants.NEW_ID);

          var fields = register.getFields();

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            
            var cell = row.item(_j);
            switch (cell.getKey()) {

              case KI_RVI_ID:
                if(m_copy) {
                  fields.add(CV.RVI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(CV.RVI_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KI_CANTIDAD:
                fields.add(CV.RVI_CANTIDAD, cell.getValue(), Types.double);
                break;

              case KI_DESCRIP:
                fields.add(CV.RVI_DESCRIP, cell.getValue(), Types.text);
                break;

              case KI_PRECIO:
                fields.add(CV.RVI_PRECIO, cell.getValue(), Types.currency);
                break;

              case KI_PRECIO_LP:
                fields.add(CV.RVI_PRECIO_LISTA, cell.getValue(), Types.currency);
                break;

              case KI_PRECIO_USR:
                fields.add(CV.RVI_PRECIO_USR, cell.getValue(), Types.currency);
                break;

              case KI_DESCUENTO:
                fields.add(CV.RVI_DESCUENTO, cell.getValue(), Types.text);
                break;

              case KI_IMPORTE:
                fields.add(CV.RVI_IMPORTE, cell.getValue(), Types.currency);
                break;

              case KI_NETO:
                fields.add(CV.RVI_NETO, cell.getValue(), Types.currency);
                break;

              case KI_IVA_RI:
                if(m_bIva) {
                  fields.add(CV.RVI_IVARI, cell.getValue(), Types.currency);
                }
                break;

              case KI_IVA_RNI:
                if(m_bIvaRni) {
                  fields.add(CV.RVI_IVARNI, cell.getValue(), Types.currency);
                }
                break;

              case KI_IVA_RI_PERCENT:
                fields.add(CV.RVI_IVA_RI_PORC, cell.getValue(), Types.double);
                break;

              case KI_IVA_RNI_PERCENT:
                fields.add(CV.RVI_IVA_RNI_PORC, cell.getValue(), Types.double);
                break;

              case KI_PR_ID:
                prId = cell.getId();
                fields.add(CV.PR_ID, prId, Types.id);
                break;

              case KI_CCOS_ID:
                fields.add(C.CCOS_ID, cell.getId(), Types.id);
                break;

              case KI_GRUPO:
                grupo = cell.getId();
                break;

              case KI_STL_ID:
                fields.add(CV.STL_ID, cell.getId(), Types.id);
                break;
            }
          }

          orden += 1;
          fields.add(CV.RVI_ORDEN, orden, Types.integer);

          transaction.addRegister(register);

          if(grupo === 0) { grupo = orden * -1; }
          saveItemNroSerie(mainRegister, row, order, prId, grupo);
        }

        if(m_itemsDeleted !== "" && m_id !== NO_ID && !m_copy) {

          transaction.setDeletedList(m_itemsDeleted);
        }

        mainRegister.addTransaction(transaction);
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

        var importe = neto + ivaRi + ivaRni;

        getCell(row, KI_NETO).setValue(neto);
        getCell(row, KI_IVA_RI).setValue(ivaRi);
        getCell(row, KI_IVA_RNI).setValue(ivaRni);
        getCell(row, KI_IMPORTE).setValue(importe);
      };

      var updateTotals = function() {

        var rows = getGrid(m_items, C_ITEMS).getRows();

        var neto = 0;
        var ivaRi = 0;
        var ivaRni = 0;

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {
          var row = rows.item(_i);
          neto = neto + cellFloat(row, KI_NETO);
          ivaRi = ivaRi + cellFloat(row, KI_IVA_RI);
          ivaRni = ivaRni + cellFloat(row, KI_IVA_RNI);
        }

        var properties = m_footer.getProperties();
        properties.item(CV.RV_SUBTOTAL).setValue(neto);

        var desc1 = val(m_properties.item(CV.RV_DESCUENTO1).getValue());
        var desc2 = val(m_properties.item(CV.RV_DESCUENTO2).getValue());

        ivaRi = ivaRi - (ivaRi * desc1 / 100);
        ivaRni = ivaRni - (ivaRni * desc1 / 100);

        ivaRi = ivaRi - (ivaRi * desc2 / 100);
        ivaRni = ivaRni - (ivaRni * desc2 / 100);

        desc1 = neto * desc1 / 100;
        properties.item(CV.RV_IMPORTE_DESC_1).setValue(desc1);

        neto = neto - desc1;

        desc2 = neto * desc2 / 100;
        properties.item(CV.RV_IMPORTE_DESC_2).setValue(desc2);

        neto = neto - desc2;

        properties.item(CV.RV_NETO).setValue(neto);
        properties.item(CV.RV_IVARI).setValue(ivaRi);
        properties.item(CV.RV_IVARNI).setValue(ivaRni);
        properties.item(CV.RV_TOTAL).setValue(neto + ivaRni + ivaRi);

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
            }
            else {
              getCell(row, KI_IVA_RI_PERCENT).setValue(0);
            }

            if(m_bIvaRni) {
              getCell(row, KI_IVA_RNI_PERCENT).setValue(data.rni_percent_venta);
            }
            else {
              getCell(row, KI_IVA_RNI_PERCENT).setValue(0);
            }

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
            getCell(row, KI_PR_LLEVA_LOTE).setId(valField(response.data, C.PR_LLEVA_NRO_LOTE));
            getCell(row, KI_PR_LOTE_FIFO).setId(valField(response.data, C.PR_LOTE_FIFO));
          }
          else {
            getCell(row, KI_PR_LLEVA_NRO_SERIE).setId(false);
            getCell(row, KI_PR_LLEVA_LOTE).setId(false);
            getCell(row, KI_PR_LOTE_FIFO).setId(false);
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
          if(bChanged || cellId(row, KI_PR_LLEVA_NRO_SERIE) === false) {
            getCell(row, KI_NRO_SERIE).setValue("");
            var key = Cairo.Collections.getKey(cellId(row, KI_GRUPO));
            if(m_serialNumbers.contains(key)) {
              m_serialNumbers.remove(key);
            }
          }

          return true;
        });
      };

      var getDocId = function() {
        return m_properties.item(C.DOC_ID).getSelectId();
      };

      var setEnabled = function() {
        var bState = null;

        // Si se genera desde un pedido y es nuevo
        // no puede editar, tiene que hacer click en
        // nuevo y llamar al asistente
        if(m_lastDocDesdePv && m_id === NO_ID) {
          bState = false;
        }
        else if(m_lastDocDesdeOs && m_id === NO_ID) {
          bState = false;
        }
        else if(m_docEditable) {
          bState = getDocId() !== NO_ID;
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
            && prop.getKey() !== K_HIDE_COLS) {

            if(bState) {
              if(prop.getKey() !== K_NRO_DOC) {
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
          m_properties.item(C.DEPL_ID_ORIGEN).setEnabled(m_showStockData);
        }

        var _count = m_itemsProps.size();
        for(var _i = 0; _i < _count; _i++) {
          m_itemsProps.item(_i).setEnabled(bState);
        }

        m_items.refreshEnabledState(m_itemsProps);
        m_dialog.refreshEnabledState(m_properties);
      };

      var setDataChofer = function() {
        var p;
        var property = m_properties.item(C.CHOF_ID);

        if(m_lastChofId !== property.getSelectId()) {

          m_lastChofId = property.getSelectId();

          p = DB.getData(
            "load[" + m_apiPath + "general/chofer/" + m_lastChofId.toString() + "/info]", m_lastDocId);

          p = p.whenSuccessWithResult(function(response) {

            var chofId = valField(response.data, C.CHOF_ID);
            var camId = valField(response.data, C.CAM_ID);
            var camIdSemi = valField(response.data, C.CAM_ID_SEMI);

            if(chofId !== NO_ID) {

              var chofName = valField(response.data, C.CHOF_NAME);

              var prop = m_properties.item(C.CHOF_ID)
                .setSelectFilter(D.getSelectFilterChofer(m_transId))
                .setValue(chofName)
                .setSelectId(chofId);

              m_dialog.showValue(prop);
            }

            if(camId !== NO_ID) {

              var camName = valField(response.data, C.CAM_PATENTE);

              var prop = m_properties.item(C.CAM_ID)
                .setSelectFilter(D.getSelectFilterCamion(m_transId))
                .setValue(camName)
                .setSelectId(camId);

              m_dialog.showValue(prop);
            }

            if(camIdSemi !== NO_ID) {

              var camNameSemi = valField(response.data, C.CAM_PATENTE_SEMI);

              var prop = m_properties.item(C.CAM_ID_SEMI)
                .setSelectFilter(D.getSelectFilterCamion(m_transId))
                .setValue(camNameSemi)
                .setSelectId(camIdSemi);

              m_dialog.showValue(prop);
            }

            return p || P.resolvedPromise(true);
          });
        }
        return p || P.resolvedPromise(false);
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
            var ldId = valField(response.data, C.LD_ID);
            var venId = valField(response.data, C.VEN_ID);
            var transId = valField(response.data, C.TRANS_ID);
            var chofId = valField(response.data, C.CHOF_ID);
            var camId = valField(response.data, C.CAM_ID);
            var camIdSemi = valField(response.data, C.CAM_ID_SEMI);
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
              var lpName = valField(response.data, C.LP_NAME);
              prop.setValue(lpName);
              prop.setSelectId(lpId);
            }

            m_dialog.showValue(prop);

            prop = m_properties.item(C.LD_ID);
            prop.setSelectFilter(ldFilter);

            if(ldId !== NO_ID) {
              var ldName = valField(response.data, C.LD_NAME);
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

            if(chofId !== NO_ID) {

              var chofName = valField(response.data, C.CHOF_NAME);

              var prop = m_properties.item(C.CHOF_ID)
                .setSelectFilter(D.getSelectFilterChofer(m_transId))
                .setValue(chofName)
                .setSelectId(chofId);

              m_dialog.showValue(prop);
            }

            if(camId !== NO_ID) {

              var camName = valField(response.data, C.CAM_PATENTE);

              var prop = m_properties.item(C.CAM_ID)
                .setSelectFilter(D.getSelectFilterCamion(m_transId))
                .setValue(camName)
                .setSelectId(camId);

              m_dialog.showValue(prop);
            }

            if(camIdSemi !== NO_ID) {

              var camNameSemi = valField(response.data, C.CAM_PATENTE_SEMI);

              var prop = m_properties.item(C.CAM_ID_SEMI)
                .setSelectFilter(D.getSelectFilterCamion(m_transId))
                .setValue(camNameSemi)
                .setSelectId(camIdSemi);

              m_dialog.showValue(prop);
            }

            if(proId !== NO_ID) {

              var proName = valField(response.data, C.PRO_NAME);

              m_properties
                .item(C.PRO_ID_DESTINO)
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

            return p || P.resolvedPromise(true);
          });
        }
        return p || P.resolvedPromise(false);
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

      // TODO: dry this method it is copied in all documents
      //
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
        var docId = getDocId();

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
        };
        return D.move(m_docId, moveTo)
          .whenSuccessWithResult(completeMove);
      };
      
      var refreshProperties = function() {

        m_properties.item(C.DOC_ID)
          .setSelectId(m_docId)
          .setValue(m_documento);

        m_properties.item(CV.RV_FECHA)
          .setValue(m_fecha);

        m_properties.item(CV.RV_FECHAENTREGA)
          .setValue(m_fechaEntrega);

        m_properties.item(C.CLI_ID)
          .setSelectId(m_cliId)
          .setValue(m_cliente);

        m_properties.item(Cairo.Constants.NUMBER_ID)
          .setValue(m_numero);

        m_properties.item(Cairo.Constants.STATUS_ID)
          .setValue(m_estado);

        m_properties.item(CV.RV_NRODOC)
          .setValue(m_nroDoc)
          .setTextMask(m_taMascara)
          .setTextAlign(Dialogs.TextAlign.right);

        m_properties.item(CV.RV_DESCUENTO1)
          .setValue(m_descuento1);

        m_properties.item(CV.RV_DESCUENTO2)
          .setValue(m_descuento2);

        if(m_deplId !== NO_ID || !m_showStockData) {
          m_properties.item(C.DEPL_ID_ORIGEN)
            .setSelectId(m_deplId)
            .setValue(m_deposito);
        }
        else {
          m_properties.item(C.DEPL_ID_ORIGEN)
            .setSelectId(Cairo.UserConfig.getDeplId())
            .setValue(Cairo.UserConfig.getDeplName());
          setStock();
        }

        m_properties.item(C.CPG_ID)
          .setSelectId(m_cpgId)
          .setValue(m_condicionPago);

        m_properties.item(CV.RV_COTIZACION)
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

        m_properties.item(C.VEN_ID)
          .setSelectId(m_venId)
          .setValue(m_vendedor);

        m_properties.item(CV.RV_DESCRIP)
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

        m_properties.item(CV.RV_RETIRO)
          .setValue(m_retiro);

        m_properties.item(CV.RV_GUIA)
          .setValue(m_guia);

        m_properties.item(CV.RV_DESTINATARIO)
          .setValue(m_destinatario);

        m_properties.item(CV.RV_ORDEN_COMPRA)
          .setValue(m_ordenCompra);

        m_properties.item(C.CLIS_ID)
          .setSelectId(m_clisId)
          .setValue(m_clienteSucursal);

        m_properties.item(C.CHOF_ID)
          .setSelectId(m_chofId)
          .setValue(m_chofer)
          .setSelectFilter(D.getSelectFilterChofer(m_transId));

        m_properties.item(C.CAM_ID)
          .setSelectId(m_camId)
          .setValue(m_camion)
          .setSelectFilter(D.getSelectFilterCamion(m_transId));

        m_properties.item(C.CAM_ID_SEMI)
          .setSelectId(m_camIdSemi)
          .setValue(m_semi)
          .setSelectFilter(D.getSelectFilterCamion(m_transId));

        m_itemsDeleted = "";
        loadItems(getProperty(m_items, C_ITEMS));

        m_items.showValues(m_itemsProps);

        m_footerProps.item(CV.RV_SUBTOTAL)
          .setValue(m_subTotal);

        m_footerProps.item(CV.RV_IMPORTE_DESC_1)
          .setValue(m_importeDesc1);

        m_footerProps.item(CV.RV_IMPORTE_DESC_2)
          .setValue(m_importeDesc2);

        m_footerProps.item(CV.RV_NETO)
          .setValue(m_neto);

        m_footerProps.item(CV.RV_IVARI)
          .setValue(m_ivaRi);

        m_footerProps.item(CV.RV_IVARNI)
          .setValue(m_ivaRni);

        m_footerProps.item(CV.RV_TOTAL)
          .setValue(m_total);

        setEnabled();
        showCotizacion();

        return D.showDataAddCliente(Cairo.UserConfig.getShowDataAddInVentas(), m_dialog);
      };

      var showApply = function() {

        if(!Cairo.Security.docHasPermissionTo(
          CS.MODIFY_APLIC,
          m_docId,
          Cairo.Security.ActionTypes.apply)) {
          return false;
        }

        if(m_applyEditor === null) {
          m_applyEditor = Cairo.RemitoVentaAplic.Edit.Controller.getEditor();
        }
        else {
          if(m_applyEditor.getId() !== m_id) {
            m_applyEditor.setClient(null);
            m_applyEditor = Cairo.RemitoVentaAplic.Edit.Controller.getEditor();
          }
        }

        m_applyEditor.setClient(self);

        m_applyEditor.show(
          m_id,
          m_total,
          m_nroDoc,
          m_cliId,
          m_cliente,
          m_sucId,
          m_docId,
          m_doctId === D.Types.DEVOLUCION_REMITO_VTA).then(function(result) {
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

        var wizardDialog = Cairo.Dialogs.WizardViews.Controller.newWizard();
        wizardDialog.setClient(wizard);
        wizardDialog.show(wizardConstructor);
      };

      var showStartWizardPedido = function() {
        try {
          var wizConstructor = Cairo.RemitoVentaPedidoWiz.Edit.Controller.getEditor;
          var wizard = wizConstructor();
          wizard.setPvIds(m_pvIds);
          wizard.loadWizard().whenSuccess(call(startWizard, wizard, wizConstructor));
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showStartWizardPedido", C_MODULE, "");
        }
      };

      var showStartWizardOrden = function() {
        try {
          var wizConstructor = Cairo.RemitoVentaPedidoWiz.Edit.Controller.getEditor;
          var wizard = wizConstructor();
          wizard.setOsIds(m_osIds);
          wizard.setOsiIds(m_prnsIds);
          wizard.setAutoFactura(m_bAutoFactura);
          wizard.setAutoPago(m_bAutoPago);
          wizard.setCueIdAutoPago(m_cueIdAutoPago);
          wizard.setModoVentaCtaCte(m_modoVentaCtaCte);
          wizard.loadWizard().whenSuccess(call(startWizard, wizard, wizConstructor));
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showStartWizardOrden", C_MODULE, "");
        }
      };

      var showStartWizardBOM = function() {
        try {
          var wizConstructor = Cairo.RemitoVentaBOMWiz.Edit.Controller.getEditor;
          var wizard = wizConstructor();
          wizard.setPvIds(m_pvIds);
          wizard.loadWizard().whenSuccess(call(startWizard, wizard, wizConstructor));
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showStartWizardBOM", C_MODULE, "");
        }
      };

      var initialize = function() {
        try {

          m_serialNumbers = Cairo.Collections.createCollection(null);
          m_kitDefinitions = Cairo.Collections.createCollection(Cairo.KitDefinition.create);
          m_pvIds = [];
          m_osIds = [];
          m_prnsIds = [];

          Cairo.UserConfig.validateRV();
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "initialize", C_MODULE, "");
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

        destroy();
      };

      var destroy = function() {
        try {
          m_dialog = null;
          m_listController = null;
          m_footer = null;
          m_footerProps = null;
          m_items = null;
          m_itemsProps = null;
          m_pvIds = [];
          m_osIds = [];
          m_serialNumbers = null;
          m_generalConfig = null;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");
        }
      };

      var setSerialNumberInRow = function(curGroup, nroSerie) {

        if(curGroup === 0) { return; }

        var rows = getGrid(m_items, C_ITEMS).getRows();

        var _count = rows.size();
        for(var _i = 0; _i < _count; _i++) {

          var row = rows.item(_i);
          if(cellId(row, KI_GRUPO) === curGroup) {
            getCell(row, KI_NRO_SERIE).setValue(Cairo.Util.removeLastColon(nroSerie));
            return;
          }
        }
      };

      var saveItemNroSerie = function(mainRegister, row, order, prId, grupo) {

        if(cellId(row, KI_PR_LLEVA_NRO_SERIE) === true && m_showStockData) {

          var transaction = DB.createTransaction();
          var deleted = [];

          transaction.setTable(CV.REMITO_VENTA_ITEM_SERIE_TMP);

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
            fields.add(CV.RVIS_ORDEN, order.n, Types.integer);

            transaction.addRegister(register);
          }

          transaction.setDeletedList(deleted.toString());

          mainRegister.addTransaction(transaction);
        }
      };

      var getDeplId = function() {
        var deplId = 0;

        if(m_lastDoctId !== D.Types.DEVOLUCION_REMITO_VTA) {
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
        return m_properties.item(C.RV_FECHA).getValue();
      };

      var setStock = function() {
        if(Cairo.getStockConfig().getStockXFisico()
          || Cairo.getStockConfig().getNoControlaStock()) {
          m_depfId = NO_ID;
        }
      };

      var showFactura = function(pushVirtualNext) {
        try {
          var factura = Cairo.FacturaVenta.Edit.Controller.getEditor();
          factura.setRestartVirtualPush(pushVirtualNext);
          factura.showFacturaRemito(getCliId(), getRvIds());
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "showFactura", C_MODULE, "");
        }
      };

      var getRvIds = function() {
        return [m_id];
      };

      var getItems = function() {
        return m_items.getProperties().item(C_ITEMS);
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
              case KI_CCOS_ID:

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

      var getFileNamePostFix = function() {
        return m_cliente.substring(0, 50) + "-" + m_nroDoc;
      };

      var showMenuDocAction = function() {
        // Facturar el Documento|Facturar el Documento Automaticamente|Cancelar el Documento
        var menu = getText(4960, "")+ "~6|"+ getText(4961, "")+ "~7|"+ getText(4962, "")+ "~8";
        m_dialog.showPopMenu(menu);
      };

      var cancelRemito = function() {

        return DB.execute(m_apiPath + "ventas/remitoventa/cancel", m_id,
          "cancelRemito", C_MODULE, SAVE_ERROR_MESSAGE).then(
          function(result) {
            if(result.success) {
              return M.showInfo(getText(4963, "")); // La operación concluyo con éxito
            }
            else {
              return M.showWarning(result.error);
            }
          });
      };

      self.getObjectType = function() {
        return "cairo.modules.ventas.remitoVenta";
      };

      initialize();

      return self;
    };

    Edit.Controller = { getEditor: createObject };

    Edit.Controller.edit = function(id) {

      Cairo.LoadingMessage.show("Remito de Ventas", "Loading Remito de Venta from CrowSoft Cairo server.");
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

  Cairo.module("RemitoVentaListDoc.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;
      var P = Cairo.Promises;
      var NO_ID = NO_ID;
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

      var C_MODULE = "cRemitoVentaListDoc";

      var SAVE_ERROR_MESSAGE = getText(2222, ""); // Error al grabar el Remito de Venta

      var C_FECHA_INI = "FechaIni";
      var C_FECHA_FIN = "FechaFin";

      var K_FECHA_INI = 1;
      var K_FECHA_FIN = 2;
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

      var m_menuShowFactura = 0;
      var m_menuShowNotes = 0;
      var m_menuShowInfoCli = 0;
      var m_menuAddNote = 0;
      var m_menuShowApply = 0;
      var m_menuShowDocAux = 0;
      var m_menuSign = 0;
      var m_menuShowFacturaAuto = 0;
      var m_menuShowCancelar = 0;
      var m_menuEditCliente = 0;

      var m_apiPath = DB.getAPIVersion();
      var SAVE_ERROR = getText(2227, ""); // Error al grabar los párametros de navegación de Xxxx

      self.list = function() {
        initialize();
        return load()
          .whenSuccess(loadCollection);
      };

      self.edit = function(rvId) {
        m_listController.edit(rvId);
      };

      self.deleteItem = function(rvId) {
        return m_listController.destroy(rvId);
      };

      self.showDocDigital = function() {
        var _rtn = false;

        try {

          var rvId = m_dialog.getId();
          if(rvId === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(CV.REMITO_VENTA);
          doc.setClientTableID(rvId);

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

        var property = m_properties.item(C.CLI_ID);
        property.setValue(name);
        property.setSelectId(id);
        property.setSelectIntValue(id);
        m_dialog.showValue(m_properties.item(C.CLI_ID));
      };

      self.processMenu = function(index) {
        try {

          switch (index) {
            case m_menuShowFactura:
              showFactura(false);
              break;

            case m_menuShowFacturaAuto:
              showFactura(true);
              break;

            case m_menuShowCancelar:
              cancelRemito();
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

            case m_menuShowApply:
              showApply();
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
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "ProcessMenu", C_MODULE, "");
        }
      };

      var loadCollection = function() {
        var c;

        m_properties.clear();

        c = m_properties.add(null, C_FECHA_INI);
        c.setType(T.date);
        c.setName(getText(1203, "")); // Fecha desde
        c.setKey(K_FECHA_INI);
        c.setValue((m_fechaIniV !== "") ? m_fechaIniV : m_fechaIni);

        c = m_properties.add(null, C_FECHA_FIN);
        c.setType(T.date);
        c.setName(getText(1204, "")); // Fecha hasta
        c.setKey(K_FECHA_FIN);
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
        c.setSelectFilter(D.FACTURA_COMPRAS_LIST_DOC_FILTER);

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

        return m_dialog.showDocumentList(self);
      };

      var refreshCollection = function() {
        return m_dialog.showValues(m_properties);
      };

      var load = function() {

        return DB.getData("load[" + m_apiPath + "ventas/remitoventas/parameters]", id).then(
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
          });
      };

      self.getApplication = function() {
        return Cairo.Application.getName();
      };

      self.getProperties = function() {
        return m_properties;
      };

      self.propertyChange = function(key) {
        var property;
        var properties = m_properties;

        switch (key) {

          case K_FECHA_INI:

            property = properties.item(C_FECHA_INI);

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

          case K_FECHA_FIN:

            property = properties.item(C_FECHA_FIN);

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
            property = properties.item(C.EST_ID);
            m_estado = property.getValue();
            m_estId = property.getSelectIntValue();
            break;

          case K_CLI_ID:
            property = properties.item(C.CLI_ID);
            m_cliente = property.getValue();
            m_cliId = property.getSelectIntValue();
            break;

          case K_CCOS_ID:
            property = properties.item(C.CCOS_ID);
            m_centroCosto = property.getValue();
            m_ccosId = property.getSelectIntValue();
            break;

          case K_SUC_ID:
            property = properties.item(C.SUC_ID);
            m_sucursal = property.getValue();
            m_sucId = property.getSelectIntValue();
            break;

          case K_VEN_ID:
            property = properties.item(C.VEN_ID);
            m_vendedor = property.getValue();
            m_venId = property.getSelectIntValue();
            break;

          case K_DOC_ID:
            property = properties.item(C.DOC_ID);
            m_documento = property.getValue();
            m_docId = property.getSelectIntValue();
            break;

          case K_CPG_ID:
             property = properties.item(C.CPG_ID);
            m_condicionPago = property.getValue();
            m_cpgId = property.getSelectIntValue();
            break;

          case K_EMP_ID:
            property = properties.item(C.EMP_ID);
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

        return DB.getData("load[" + m_apiPath + "ventas/remitoventas]", null, params);
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.LDP_ID);
        register.setTable(C.LISTA_DOCUMENTO_PARAMETRO);

        register.setPath(m_apiPath + "ventas/remitoventas");

        register.setId(Cairo.Constants.NEW_ID);

        var _count = m_properties.size();
        for(var _i = 0; _i < _count; _i++) {

          var property = m_properties.item(_i);

          switch (property.getKey()) {

            case K_FECHA_INI:
              var value = property.getSelectIntValue();
              if(value === "") { value = property.getValue(); }
              fields.add(C.FROM, value, Types.text);
              break;

            case K_FECHA_FIN:
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

      self.getPath = function() {
        return "#venta/remitosdeventa";
      };

      self.getEditorName = function() {
        return "remitoventas";
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

        m_menuShowFactura = m_dialog.addMenu(getText(3954, "")); // Facturar este remito
        m_menuShowFacturaAuto = m_dialog.addMenu(getText(3956, "")); // Facturar Automático
        m_menuShowCancelar = m_dialog.addMenu(getText(4962, "")); // Cancelar el Documento
        m_dialog.addMenu("-");

        m_menuSign = m_dialog.addMenu(getText(1594, "")); // Firmar
        m_dialog.addMenu("-");

        m_menuShowInfoCli = m_dialog.addMenu(getText(1614, "")); // Ver Info del Cliente
        m_menuAddNote = m_dialog.addMenu(getText(1615, "")); // Agregar Nota
        m_menuShowNotes = m_dialog.addMenu(getText(1616, "")); // Ver Notas
        m_dialog.addMenu("-");

        m_menuShowApply = m_dialog.addMenu(getText(1617, "")); // Ver Aplicaciones
        m_menuShowDocAux = m_dialog.addMenu(getText(1691, "")); // Ver Documento Asociado
      };

      var showNotes = function() {
        var rvId = m_dialog.getId();
        return DB.getData("load[" + m_apiPath + "ventas/remitoventa/notes]", rvId)
          .whenSuccessWithResult(D.showNotes);
      };

      var addNote = function() {
        var rvId = m_dialog.getId();
        return D.addNote(D.Types.REMITO_VENTA, rvId, false);
      };

      var editCliente = function() {
        var cliId = getCliId();
        if(cliId === NO_ID) { return; }
        Cairo.Cliente.Edit.Controller.edit(cliId);
      };

      var signDocument = function() {
        var rvId = m_dialog.getId();

        if(rvId === NO_ID) {
          return P.resolvedPromise(true);
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

        return D.getDocumentSignStatus(D.Types.FACTURA_COMPRA, rvId)
            .whenSuccessWithResult(getAction)
            .whenSuccess(D.signDocument(D.Types.FACTURA_COMPRA, rvId))
            .whenSuccessWithResult(refreshRow)
          ;
      };

      var showDocAux = function() {
        var rvId = m_dialog.getId();
        if(rvId !== NO_ID) {

          D.getStockId(D.Types.REMITO_VENTA, rvId).whenSuccessWithResult(function(response) {
            D.showDocAux(response.st_id, "Stock");
          });
        }
      };

      var showApply = function() {

        var showEditor = function(info) {
          if(!Cairo.Security.docHasPermissionTo(
            CS.MODIFY_APLIC,
            m_docId,
            Cairo.Security.ActionTypes.apply)) {
            return false;
          }

          var applyEditor = Cairo.RemitoVentaAplic.Edit.Controller.getEditor();

          applyEditor.setClient(self);

          applyEditor.show(
            info.id,
            info.total * ((info.cotizacion !== 0) ? info.cotizacion : 1),
            info.nrodoc,
            info.cli_id,
            info.cliente,
            info.suc_id,
            info.doc_id,
            info.doct_id === D.Types.NOTA_CREDITO_VENTA,
            info.emp_id,
            info.empresa);
        };

        var rvId = m_dialog.getId();
        if(rvId !== NO_ID) {
          D.getDocumentInfo(D.Types.REMITO_VENTA, rvId).whenSuccessWithResult(showEditor);
        }
      };

      var showFactura = function(bPushVirtualNext) {
        try {
          var factura = Cairo.FacturaVenta.Edit.Controller.getEditor();
          factura.showFacturaRemito(getCliId(), getRvIds());
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showCobranza", C_MODULE, "");
        }
      };

      var cancelRemito = function() {
        var p = P.resolvedPromise(true);
        var vRvIds = getRvIds();
        var errors = 0;

        var cancel = function(rvId) {
          return DB.execute(m_apiPath + "ventas/remitoventa/cancel", rvId,
            "cancelRemito", C_MODULE, SAVE_ERROR_MESSAGE).then(
            function (result) {
              if (result.success !== true) {
                errors += 1;
                return M.showWarning(result.error);
              }
            });
        };

        for(var i = 0, _count = vRvIds.length; i < _count; i++) {
          p = p.then(P.call(cancel, vRvIds(i)));
        }

        return p.then(
          function (result) {
            if (errors === 0) {
              return M.showInfo(getText(4963, "")); // La operación concluyo con éxito
            } else {
              // TODO: create a new message in lenguajeitem
              return M.showWarning(getText(, "")); // La operación concluyo pero ocurrieron algunos errores
            }
          });
      };

      var getRvIds = function() {
        return m_dialog.getIds();
      };

      var getCliId = function() {
        // TODO: implement it.
        Cairo.raiseError("RemitoVenta", "getCliId not implemented");
      };

      var initialize = function() {
        try {
          m_title = getText(1712, ""); // Remitos de ventas
          m_dialog.setHaveDetail(true);
          m_dialog.setStartRowText(4);
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "initialize", C_MODULE, "");
        }
      };

      self.terminate = function() {
        try {
          m_dialog = null;
          m_properties = null;
          m_listController.terminate();
          m_listController = null;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");
        }
      };

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("RemitoVenta.List", function(List, Cairo, Backbone, Marionette, $, _) {

    var NO_ID = Cairo.Constants.NO_ID;
    var CS = Cairo.Security.Actions.Ventas;
    var DB = Cairo.Database;
    var C_MODULE = "cRemitoVenta";
    var P = Cairo.Promises;

    var listDialog = null;

    var showListDialog = function() {

      var self = this;

      var editors = Cairo.Editors.xxxxEditors || Cairo.Collections.createCollection(null);
      Cairo.Editors.xxxxEditors = editors;

      // ListController properties and methods
      //
      self.entityInfo = new Backbone.Model({
        entitiesTitle: "Xxxx",
        entityName: "xxxx",
        entitiesName: "xxxxs"
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
          Cairo.LoadingMessage.show("RemitoVenta", "Loading Remitos de Venta from CrowSoft Cairo server.");

          var editor = Cairo.RemitoVenta.Edit.Controller.getEditor();
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
        if(!Cairo.Security.hasPermissionTo(CS.DELETE_REMITO)) {
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
          DB.getAPIVersion() + "ventas/remitoventa", id,
          Cairo.Constants.DELETE_FUNCTION, C_MODULE).whenSuccess(closeDialog, false);
      };

      // this function has a clouser over listDialog
      // when the tab is closed we clear the reference
      // to this listDialog so when List.Controller.list
      // is called a new listDialog will be created
      //
      self.terminate = function() {
        listDialog = null;
      };

      // progress message
      //
      Cairo.LoadingMessage.show("Xxxx", "Loading Xxxxs from CrowSoft Cairo server.");

      self.documentList = Cairo.XxxxListDoc.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.ListController.newDialogList();

      self.documentList.setListController(self);
      self.documentList.setDialog(dialog);
      self.documentList.list().then(Cairo.LoadingMessage.close);

      listDialog = self;

    };

    List.Controller = {
      list: function() {

        if(listDialog === null) {
          showListDialog();
        }
        else {
          listDialog.documentList.bringToFront();
        }
      }
    };
  });

}());