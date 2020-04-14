(function() {
  "use strict";

  Cairo.module("RemitoVenta.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {
    {

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
      var K_NRODOC = 2;
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

      // HIDECOLS
      var K_HIDE_COLS = 41;

      var KI_RV_ID = 1;
      var KI_RVI_ID = 2;
      var KI_ORDEN = 3;
      var KI_CANTIDAD = 4;
      var KI_DESCRIP = 6;
      var KI_PRECIO = 7;
      var KI_IMPORTE = 8;
      var KI_NETO = 9;
      var KI_IVARI = 10;
      var KI_IVARNI = 11;
      var KI_PR_ID = 13;
      var KI_LPI_ID = 14;
      var KI_LDI_ID = 15;
      var KI_IVARIPERCENT = 16;
      var KI_IVARNIPERCENT = 17;
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
      var m_fechaentrega = null;
      var m_neto = 0;
      var m_ivari = 0;
      var m_ivarni = 0;
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
      var m_creado = null;
      var m_modificado = null;
      var m_modifico = 0;
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
      var m_lastMonId = 0;
      var m_lastCliId = 0;
      var m_lastTrans = 0;
      var m_lastChof = 0;
      var m_lastDocName = "";
      var m_lastCliName = "";

      var m_isNew;

      var m_itemsDeleted = "";

      var m_copy;

      var m_generalConfig;
      var m_stockConfig;

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
          m_lastChof = NO_ID;

          if(!m_docEditable) {
            if(m_docEditMsg !== "") {
              p = M.showWarning(m_docEditMsg);
            }
          }

          return p || P.resolvedPromise();

        }).then(function() {

          var p = null;

          var docId = getDocId();

          if(docId === NO_ID) {
            p = M.showInfo(getText(1562, ""));
          }

          return p || P.resolvedPromise();

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

                if(docDescargaBOM()) {
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
                cancelarRemito();
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

            p = getFileNamePostFix();
            break;

          case Dialogs.Message.MSG_PRINT_GET_TITLE:

            p = m_nroDoc+ " - "+ m_cliente;
            break;
        }

        return p || P.resolvedPromise();
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

            p = p || P.resolvedPromise();

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

          case K_HIDE_COLS:

            showHideCols(false);
            break;
        }

        return p || P.resolvedPromise();
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

                case K_NRODOC:
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
                  fields.add(CV.CLI_ID, property.getSelectId(), Types.id);
                  break;

                case K_COTIZACION:
                  fields.add(CV.RV_COTIZACION, property.getValue(), Types.double);
                  break;

                case K_CCOS_ID:
                  fields.add(CV.CCOS_ID, property.getSelectId(), Types.id);
                  break;

                case K_SUC_ID:
                  fields.add(CV.SUC_ID, property.getSelectId(), Types.id);
                  break;

                case K_DESCUENTO1:
                  fields.add(CV.RV_DESCUENTO1, property.getValue(), Types.currency);
                  break;

                case K_DESCUENTO2:
                  fields.add(CV.RV_DESCUENTO2, property.getValue(), Types.currency);
                  break;

                case K_DOC_ID:
                  fields.add(CV.DOC_ID, property.getSelectId(), Types.id);
                  break;

                case K_LP_ID:
                  fields.add(CV.LP_ID, property.getSelectId(), Types.id);
                  break;

                case K_LD_ID:
                  fields.add(CV.LD_ID, property.getSelectId(), Types.id);
                  break;

                case K_CPG_ID:
                  fields.add(CV.CPG_ID, property.getSelectId(), Types.id);
                  break;

                case K_VEN_ID:
                  fields.add(CV.VEN_ID, property.getSelectId(), Types.id);
                  break;

                case K_LGJ_ID:
                  fields.add(CV.LGJ_ID, property.getSelectId(), Types.id);
                  break;

                case K_PRO_ID_ORIGEN:
                  fields.add(CV.PRO_ID_ORIGEN, property.getSelectId(), Types.id);
                  break;

                case K_PRO_ID_DESTINO:
                  fields.add(CV.PRO_ID_DESTINO, property.getSelectId(), Types.id);
                  break;

                case K_TRANS_ID:
                  fields.add(CV.TRANS_ID, property.getSelectId(), Types.id);
                  break;

                case K_CLIS_ID:
                  fields.add(CV.CLIS_ID, property.getSelectId(), Types.id);
                  break;

                case K_CHOF_ID:
                  fields.add(CV.CHOF_ID, property.getSelectId(), Types.id);
                  break;

                case K_CAM_ID:
                  fields.add(CV.CAM_ID, property.getSelectId(), Types.id);
                  break;

                case K_CAM_ID_SEMI:
                  fields.add(CV.CAM_ID_SEMI, property.getSelectId(), Types.id);
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
                  fields.add(CV.RV_IMPORTEDESC1, property.getValue(), Types.currency);
                  break;

                case K_IMPORTE_DESC_2:
                  fields.add(CV.RV_IMPORTEDESC2, property.getValue(), Types.currency);
                  break;
              }
            }

            fields.add(C.EST_ID, m_estId, Types.id);


            register.prepareTransaction();
            if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return _rtn; }

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
                              p = P.resolvedPromise();
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
            if(id !== D.Constants.DOC_CHANGED && m_isNew && docDesdePedido()) {

              if(docDescargaBOM()) {
                showStartWizardBOM();
              }
              else {
                showStartWizardPedido();
              }
            }
            else if(id !== D.Constants.DOC_CHANGED && m_isNew && docDesdeOrden()) {

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
              rtn = cellId(row, KI_PR_LLEVA_NRO_SERIE) !== 0;
            }
            break;

          case KI_STL_ID:

            row = property.getGrid().getRows().item(lRow);

            if(row !== null) {

              if(cellId(row, KI_PR_LLEVA_LOTE) !== 0
                && cellId(row, KI_PR_LLEVA_NRO_SERIE) === 0) {

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

                if(cellId(row, KI_PR_LLEVA_NRO_SERIE) !== 0) {

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
              llevaNroSerie = cellId(row, KI_PR_LLEVA_NRO_SERIE) !== 0;
              if(m_showStockData && valEmpty(cell.getValue(), Types.text) && llevaNroSerie) {
                return M.showInfoWithFalse(getText(1630, "", strRow)); // Debe indicar un numero de serie (1)
              }
              break;

            case KI_STL_ID:
              if(m_showStockData) {
                if(valEmpty(cell.getId(), Types.id)
                  && cellId(row, KI_PR_LLEVA_LOTE)
                  && cellId(row, KI_PR_LLEVA_LOTE) === 0
                  && cellId(row, KI_PR_LOTE_FIFO) === 0) {
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

        elem = properties.add(null, CV.DOC_ID);
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
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.Integer);
        elem.setName(getText(1065, "")); // Número
        elem.setKey(K_NUMERO);
        elem.setValue(m_numero);
        elem.setEnabled(false);

        elem = properties.add(null, Cairo.Constants.STATUS_ID);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(getText(1568, "")); // Estado
        elem.setKey(K_EST_ID);
        elem.setValue(m_estado);
        elem.setEnabled(false);

        elem = properties.add(null, CV.RV_FECHA);
        elem.setType(Dialogs.PropertyType.date);
        elem.setName(getText(1569, "")); // Fecha
        elem.setKey(K_FECHA);
        elem.setValue(m_fecha);

        elem = properties.add(null, CV.RV_FECHAENTREGA);
        elem.setType(Dialogs.PropertyType.date);
        elem.setName(getText(1570, "")); // Entrega
        elem.setKey(K_FECHA_ENTREGA);
        elem.setValue(m_fechaentrega);

        elem = properties.add(null, CV.CLI_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CLIENTE);
        elem.setName(getText(1150, "")); // Cliente
        elem.setKey(K_CLI_ID);
        elem.setSelectId(m_cliId);
        elem.setValue(m_cliente);
        m_dialog.setNewPropertyKeyFocus(C.CLI_ID);

        elem = properties.add(null, CV.RV_NRODOC);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(getText(1065, "")); // Número
        elem.setSize(50);
        elem.setKey(K_NRODOC);
        elem.setValue(m_nroDoc);
        elem.setTextMask(m_taMascara);
        elem.setTextAlign(Dialogs.TextAlign.right);

        elem = properties.add(null, CV.CPG_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CONDICIONES_DE_PAGO);
        elem.setName(getText(1571, "")); // Cond. pago
        elem.setKey(K_CPG_ID);
        elem.setSelectId(m_cpgId);
        elem.setValue(m_condicionPago);

        elem = properties.add(null, CV.RV_COTIZACION);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1650, "")); // Cotiz.
        elem.setFormat(Cairo.Settings.getCurrencyRateDecimalsFormat());
        elem.setKey(K_COTIZACION);
        elem.setValue(m_cotizacion);

        elem = properties.add(null, CV.RV_DESCUENTO1);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
        elem.setName(getText(1573, "")); // Desc. 1
        elem.setKey(K_DESCUENTO1);
        elem.setValue(m_descuento1);

        elem = properties.add(null, CV.RV_DESCUENTO2);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
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

        elem = properties.add(null, CV.LP_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LISTAS_DE_PRECIOS);
        elem.setName(getText(1397, "")); // Lista de Precios
        elem.setSelectFilter(D.getListaPrecioForCliente(m_docId, m_cliId));
        elem.setKey(K_LP_ID);
        elem.setSelectId(m_lpId);
        elem.setValue(m_listaPrecio);

        elem = properties.add(null, CV.VEN_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.VENDEDOR);
        elem.setName(getText(1510, "")); // Vendedor
        elem.setKey(K_VEN_ID);
        elem.setSelectId(m_venId);
        elem.setValue(m_vendedor);

        elem = properties.add(null, CV.SUC_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.SUCURSAL);
        elem.setName(getText(1281, "")); // Sucursal
        elem.setKey(K_SUC_ID);
        elem.setSelectId(m_sucId);
        elem.setValue(m_sucursal);

        elem = properties.add(null, CV.RV_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setName(getText(1211, "")); // Observ.
        elem.setSize(5000);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);

        elem = properties.add(null, CV.CLIS_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.SUCURSALES_DE_CLIENTES);
        elem.setName(getText(1576, "")); // Sucursal del Cliente
        elem.setKey(K_CLIS_ID);
        elem.setValue(m_clienteSucursal);
        elem.setSelectId(m_clisId);
        elem.setSelectFilter(D.getSelectFilterSucursalCliente(m_cliId));
        elem.setTabIndex(1);

        elem = properties.add(null, CV.PRO_ID_ORIGEN);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PROVINCIA);
        elem.setName(getText(1577, "")); // Pcia. Origen
        elem.setKey(K_PRO_ID_ORIGEN);
        elem.setSelectId(m_proIdOrigen);
        elem.setValue(m_proOrigen);
        elem.setTabIndex(1);

        elem = properties.add(null, CV.PRO_ID_DESTINO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PROVINCIA);
        elem.setName(getText(1578, "")); // Pcia. Destino
        elem.setKey(K_PRO_ID_DESTINO);
        elem.setSelectId(m_proIdDestino);
        elem.setValue(m_proDestino);
        elem.setTabIndex(1);

        elem = properties.add(null, CV.CCOS_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CENTROS_DE_COSTO);
        elem.setName(getText(1057, "")); // Centro de Costo
        elem.setKey(K_CCOS_ID);
        elem.setSelectId(m_ccosId);
        elem.setValue(m_centroCosto);
        elem.setTabIndex(1);

        elem = properties.add(null, CV.RV_ORDEN_COMPRA);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(getText(1924, "")); // Orden de Compra
        elem.setKey(K_ORDEN_COMPRA);
        elem.setValue(m_ordenCompra);
        elem.setTabIndex(1);

        elem = properties.add(null, CV.LGJ_ID);
        elem.setType(T.select);
        elem.setTable(Cairo.Tables.LEGAJOS);
        elem.setName(getText(1575, "")); // Legajo
        elem.setKey(K_LGJ_ID);
        elem.setSelectId(m_lgjId);
        elem.setValue(m_legajo);
        elem.setTabIndex(1);

        elem = properties.add(null, CV.RV_RETIRO);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setName(getText(2883, "")); // Retirado Por
        elem.setKey(K_RETIRO);
        elem.setValue(m_retiro);
        elem.setTabIndex(1);

        elem = properties.add(null, CV.RV_GUIA);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setName(getText(2884, "")); // Guia de Entrega
        elem.setKey(K_GUIA);
        elem.setValue(m_guia);
        elem.setTabIndex(1);

        elem = properties.add(null, CV.LD_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LISTAS_DE_DESCUENTOS);
        elem.setName(getText(1398, "")); // Lista de Descuentos
        elem.setSelectFilter(D.getListaDescuentoForCliente(m_docId, m_cliId));
        elem.setKey(K_LD_ID);
        elem.setSelectId(m_ldId);
        elem.setValue(m_listaDescuento);
        elem.setTabIndex(1);

        elem = properties.add(null, CV.TRANS_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.TRANSPORTE);
        elem.setName(getText(1050, "")); // Transporte
        elem.setKey(K_TRANS_ID);
        elem.setValue(m_transporte);
        elem.setSelectId(m_transId);
        elem.setTabIndex(2);

        elem = properties.add(null, CV.CHOF_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CHOFER);
        elem.setName(getText(1051, "")); // Chofer
        elem.setKey(K_CHOF_ID);
        elem.setValue(m_chofer);
        elem.setSelectId(m_chofId);
        elem.setSelectFilter(D.getSelectFilterChofer(m_transId));
        elem.setTabIndex(2);

        elem = properties.add(null, CV.CAM_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CAMION);
        elem.setName(getText(3489, "")); // Camion
        elem.setKey(K_CAM_ID);
        elem.setValue(m_camion);
        elem.setSelectId(m_camId);
        elem.setSelectFilter(D.getSelectFilterCamion(m_transId));
        elem.setTabIndex(2);

        elem = properties.add(null, CV.CAM_ID_SEMI);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CAMIONES_SEMI);
        elem.setName(getText(3493, "")); // Semi
        elem.setKey(K_CAM_ID_SEMI);
        elem.setValue(m_semi);
        elem.setSelectId(m_camIdSemi);
        elem.setSelectFilter(D.getSelectFilterCamion(m_transId));
        elem.setTabIndex(2);

        elem = properties.add(null, CV.RV_DESTINATARIO);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
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
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1579, "")); // Sub Total
        elem.setKey(K_SUBTOTAL);
        elem.setValue(m_subTotal);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.RV_IMPORTEDESC1);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1573, "")); // Desc. 1
        elem.setKey(K_IMPORTE_DESC_1);
        elem.setValue(m_importeDesc1);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.RV_IMPORTEDESC2);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1580, "")); // Desc. 2
        elem.setKey(K_IMPORTE_DESC_2);
        elem.setValue(m_importeDesc2);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.RV_NETO);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1581, "")); // Neto
        elem.setKey(K_NETO);
        elem.setValue(m_neto);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.RV_IVARI);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setName(getText(1582, "")); // IVA RI
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_IVA_RI);
        elem.setValue(m_ivari);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.RV_IVARNI);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setName(getText(1583, "")); // IVA RNI
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(K_IVA_RNI);
        elem.setValue(m_ivarni);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.RV_TOTAL);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setName(getText(1584, "")); // Total
        elem.setSubType(Dialogs.PropertySubType.money);
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

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(CV.DOC_ID);
        elem.setSelectId(m_docId);
        elem.setValue(m_documento);
        elem.setSelectId(Cairo.UserConfig.getDocRvId());
        elem.setValue(Cairo.UserConfig.getDocRvNombre());

        var elem = properties.item(Cairo.Constants.NUMBER_ID);
        elem.setValue(m_numero);

        var elem = properties.item(Cairo.Constants.STATUS_ID);
        elem.setValue(m_estado);

        var elem = properties.item(CV.RV_FECHA);
        elem.setValue(m_fecha);

        var elem = properties.item(CV.RV_FECHAENTREGA);
        elem.setValue(m_fechaentrega);

        var elem = properties.item(CV.CLI_ID);
        elem.setSelectId(m_cliId);
        elem.setValue(m_cliente);

        var elem = properties.item(CV.RV_NRODOC);
        elem.setValue(m_nroDoc);

        var elem = properties.item(CV.CPG_ID);
        elem.setSelectId(m_cpgId);
        elem.setValue(m_condicionPago);

        var elem = properties.item(CV.RV_COTIZACION);
        elem.setValue(m_cotizacion);

        var elem = properties.item(CV.RV_DESCUENTO1);
        elem.setValue(m_descuento1);

        var elem = properties.item(CV.RV_DESCUENTO2);
        elem.setValue(m_descuento2);

        var elem = properties.item(CV.DEPL_ID_ORIGEN);
        elem.setSelectId(m_deplId);
        elem.setValue(m_deposito);
        elem.setSelectId(Cairo.UserConfig.getDeplId());
        elem.setValue(Cairo.UserConfig.getDeplNombre());

        var elem = properties.item(CV.LP_ID);
        elem.setSelectId(m_lpId);
        elem.setValue(m_listaPrecio);

        var elem = properties.item(CV.VEN_ID);
        elem.setSelectId(m_venId);
        elem.setValue(m_vendedor);

        var elem = properties.item(CV.SUC_ID);
        elem.setSelectId(m_sucId);
        elem.setValue(m_sucursal);

        var elem = properties.item(CV.RV_DESCRIP);
        elem.setValue(m_descrip);

        var elem = properties.item(CV.CLIS_ID);
        elem.setValue(m_clienteSucursal);
        elem.setSelectId(m_clisId);

        var elem = properties.item(CV.PRO_ID_ORIGEN);
        elem.setSelectId(m_proIdOrigen);
        elem.setValue(m_proOrigen);

        var elem = properties.item(CV.PRO_ID_DESTINO);
        elem.setSelectId(m_proIdDestino);
        elem.setValue(m_proDestino);

        var elem = properties.item(CV.CCOS_ID);
        elem.setSelectId(m_ccosId);
        elem.setValue(m_centroCosto);

        var elem = properties.item(CV.RV_ORDEN_COMPRA);
        elem.setValue(m_ordenCompra);

        var elem = properties.item(CV.LGJ_ID);
        elem.setSelectId(m_lgjId);
        elem.setValue(m_legajo);

        var elem = properties.item(CV.RV_RETIRO);
        elem.setValue(m_retiro);

        var elem = properties.item(CV.RV_GUIA);
        elem.setValue(m_guia);

        var elem = properties.item(CV.LD_ID);
        elem.setSelectId(m_ldId);
        elem.setValue(m_listaDescuento);

        var elem = properties.item(CV.TRANS_ID);
        elem.setValue(m_transporte);
        elem.setSelectId(m_transId);

        var elem = properties.item(CV.CHOF_ID);
        elem.setValue(m_chofer);
        elem.setSelectId(m_chofId);

        var elem = properties.item(CV.CAM_ID);
        elem.setValue(m_camion);
        elem.setSelectId(m_camId);

        var elem = properties.item(CV.CAM_ID_SEMI);
        elem.setValue(m_semi);
        elem.setSelectId(m_camIdSemi);

        var elem = properties.item(CV.RV_DESTINATARIO);
        elem.setValue(m_destinatario);

        var elem = properties.item(c_ClienteDataAdd);

        elem = properties.add(null);

        elem = properties.add(null);

        var elem = properties.item(CV.RV_SUBTOTAL);
        elem.setValue(m_subTotal);

        var elem = properties.item(CV.RV_IMPORTEDESC1);
        elem.setValue(m_importeDesc1);

        var elem = properties.item(CV.RV_IMPORTEDESC2);
        elem.setValue(m_importeDesc2);

        var elem = properties.item(CV.RV_NETO);
        elem.setValue(m_neto);

        var elem = properties.item(CV.RV_IVARI);
        elem.setValue(m_ivari);

        var elem = properties.item(CV.RV_IVARNI);
        elem.setValue(m_ivarni);

        var elem = properties.item(CV.RV_TOTAL);
        elem.setValue(m_total);

        return m_dialog.showValues(properties);
      };

      // Cotizacion
      var getCotizacion = function() {
        return m_properties.item(CV.RV_COTIZACION);
      };

      var showCotizacion = function() {

        var p = null;
        var monId;

        if(m_id === NO_ID) {
          if(m_lastDocId === NO_ID) {
            return P.resolvedPromise();
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
        var prId = null;
        var oCol = null;
        var iCol = null;

        // HIDECOLS
        //
        var bColVisible = null;
        bColVisible = Cairo.Util.val(m_properties.item(c_HideCols).getValue()) === 0;

        var w_grid = property.getGrid();

        w_grid.getColumns().clear();
        w_grid.getRows().clear();

        var w_columns = w_grid.getColumns();

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_RVI_ID);

        iCol = w_columns.add(null);
        oCol = iCol;
        iCol.setName(getText(1367, "")); // Articulo
        iCol.setType(Dialogs.PropertyType.select);
        iCol.setTable(Cairo.Tables.PRODUCTOVENTA);
        iCol.setKey(KI_PR_ID);
        if(Cairo.UserConfig.getMultiSelect()) {
          oCol.setHelpType(csHelpType.cSMULTISELECT);
        }
        iCol = null;
        oCol = null;

        elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setKey(KI_DESCRIP);

        elem = columns.add(null);
        elem.setName(getText(1374, "")); // Cantidad
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setKey(KI_CANTIDAD);

        elem.setDefaultValue(new cABMGridRowValue());
        elem.getDefaultValue().setValue(1);

        elem = columns.add(null);
        elem.setName(getText(1639, "")); // Nro. Serie
        elem.setType(Dialogs.PropertyType.text);
        elem.setSubType(Dialogs.PropertySubType.textButton);
        elem.setKey(KI_NRO_SERIE);
        elem.setVisible(m_showStockData); //  HIDECOLS

        // Lote
        //
        var elem = w_columns.add(null, CV.STL_ID);
        elem.setName(getText(1640, "")); // Lote
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.STOCKLOTE);
        elem.setKey(KI_STL_ID);
        elem.setVisible(m_showStockData); //  HIDECOLS

        elem = columns.add(null);
        elem.setName(getText(1585, "")); // Descuento
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_DESCUENTO);
        elem.setEnabled(false);
        elem.setVisible(bColVisible); //  HIDECOLS

        elem = columns.add(null);
        elem.setName(getText(1165, "")); // Unidad
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KI_UNIDAD);
        elem.setEnabled(false);
        elem.setVisible(bColVisible); //  HIDECOLS

        elem = columns.add(null);
        elem.setName(getText(1587, "")); // Precio (LP)
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KI_PRECIO_LP);
        elem.setEnabled(false);
        elem.setVisible(bColVisible); //  HIDECOLS

        elem = columns.add(null);
        elem.setName(getText(1586, "")); // Precio
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KI_PRECIO_USR);
        elem.setEnabled(SecurityCanAccessSilent(csPreVtaEditPriceRem));

        elem = columns.add(null);
        elem.setName(getText(1588, "")); // Precio c/desc.
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KI_PRECIO);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1581, "")); // Neto
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KI_NETO);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1582, "")); // IVA RI
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KI_IVARI);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1583, "")); // IVA RNI
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_IVARNI);
        elem.setEnabled(false);
        elem.setVisible(bColVisible); //  HIDECOLS

        elem = columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_IMPORTE);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_IVARIPERCENT);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_IVARNIPERCENT);

        elem = columns.add(null);
        elem.setName(getText(1057, "")); // Centro de Costo
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CENTROCOSTO);
        elem.setKey(KI_CCOS_ID);
        elem.setVisible(bColVisible); //  HIDECOLS

        // Lote
        //
        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_PR_LLEVA_LOTE);

        // Lote Fifo
        //
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

        var w_rows = w_grid.getRows();

        for(var _i = 0; _i < m_data.items.length; _i += 1) {

          var elem = w_rows.add(null, rs(CV.RVI_ID).Value);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], CV.RVI_ID);
          elem.setKey(KI_RVI_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], CV.PR_NOMBRE_VENTA);
          elem.id = Cairo.Database.valField(m_data.items[_i], CV.PR_ID);
          elem.setKey(KI_PR_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], CV.RVI_DESCRIP);
          elem.setKey(KI_DESCRIP);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], CV.RVI_CANTIDAD);
          elem.setKey(KI_CANTIDAD);

          var elem = elem.add(null);
          elem.Value = "";
          elem.setKey(KI_NRO_SERIE);

          // Lote
          //
          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], CV.STL_CODE);
          elem.id = Cairo.Database.valField(m_data.items[_i], CV.STL_ID);
          elem.setKey(KI_STL_ID);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], CV.RVI_DESCUENTO);
          elem.setKey(KI_DESCUENTO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], CV.UN_NAME);
          elem.setKey(KI_UNIDAD);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], CV.RVI_PRECIO_LISTA);
          elem.setKey(KI_PRECIO_LP);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], CV.RVI_PRECIO_USR);
          elem.setKey(KI_PRECIO_USR);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], CV.RVI_PRECIO);
          elem.setKey(KI_PRECIO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], CV.RVI_NETO);
          elem.setKey(KI_NETO);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], CV.RVI_IVARI);
          elem.setKey(KI_IVARI);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], CV.RVI_IVARNI);
          elem.setKey(KI_IVARNI);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], CV.RVI_IMPORTE);
          elem.setKey(KI_IMPORTE);

          var elem = elem.add(null);
          if(m_bIva) {
            elem.Value = Cairo.Database.valField(m_data.items[_i], "iva_ri_porcentaje");
          }
          else {
            elem.Value = 0;
          }
          elem.setKey(KI_IVARIPERCENT);

          var elem = elem.add(null);
          if(m_bIvaRni) {
            elem.Value = Cairo.Database.valField(m_data.items[_i], "iva_rni_porcentaje");
          }
          else {
            elem.Value = 0;
          }
          elem.setKey(KI_IVARNIPERCENT);

          var elem = elem.add(null);
          elem.Value = Cairo.Database.valField(m_data.items[_i], CV.CCOS_NAME);
          elem.id = Cairo.Database.valField(m_data.items[_i], CV.CCOS_ID);
          elem.setKey(KI_CCOS_ID);

          // Lote
          //
          var elem = elem.add(null);
          elem.id = Cairo.Database.valField(m_data.items[_i], CV.PR_LLEVA_NRO_LOTE);
          elem.setKey(KI_PR_LLEVA_LOTE);

          // Lote Fifo
          //
          var elem = elem.add(null);
          elem.id = Cairo.Database.valField(m_data.items[_i], CV.PR_LOTE_FIFO);
          elem.setKey(KI_PR_LOTE_FIFO);

          var elem = elem.add(null);
          elem.id = Cairo.Database.valField(m_data.items[_i], CV.PR_LLEVA_NRO_SERIE);
          elem.setKey(KI_PR_LLEVA_NRO_SERIE);

          var elem = elem.add(null);
          elem.id = Cairo.Database.valField(m_data.items[_i], CV.PR_ESKIT);
          elem.setKey(KI_ES_KIT);

          var elem = elem.add(null);
          elem.id = Cairo.Database.valField(m_data.items[_i], CV.RVI_ID);
          elem.setKey(KI_GRUPO);

        }

        ////////////////////////////////////////////////////
        // Numeros de Serie
        ////////////////////////////////////////////////////

        var nroSerie = null;
        var curGroup = null;
        var coll = null;
        var nrosSerie = null;

        mCollection.collClear(m_serialNumbers);

        rs = rs.NextRecordset;

        for(var _i = 0; _i < m_data.items.length; _i += 1) {

          // Si cambie de grupo
          if(curGroup !== Cairo.Database.valField(m_data.items[_i], CV.RVI_ID)) {

            pSetNrosSerieInRow(curGroup, nrosSerie);
            nrosSerie = "";

            curGroup = Cairo.Database.valField(m_data.items[_i], CV.RVI_ID);
            coll = new Collection();
            m_serialNumbers.Add(coll, GetKey(curGroup));
          }

          // Guardo el numero de serie
          nroSerie = new cProductoSerieType();
          nroSerie.setCodigo(Cairo.Database.valField(m_data.items[_i], CV.PRNS_CODE));
          nroSerie.setDescrip(Cairo.Database.valField(m_data.items[_i], CV.PRNS_DESCRIP));
          nroSerie.setFechaVto(Cairo.Database.valField(m_data.items[_i], CV.PRNS_FECHAVTO));
          nroSerie.setPrns_id(Cairo.Database.valField(m_data.items[_i], CV.PRNS_ID));
          nroSerie.setPr_id_item(Cairo.Database.valField(m_data.items[_i], CV.PR_ID));
          nroSerie.setKitItem(Cairo.Database.valField(m_data.items[_i], CV.PR_NOMBRE_COMPRA));

          nrosSerie = nrosSerie+ nroSerie.getCodigo()+ ",";

          // Lo agrego a la bolsa
          coll.Add(nroSerie, GetKey(nroSerie.getPrns_id()));

        }

        pSetNrosSerieInRow(curGroup, nrosSerie);
        nrosSerie = "";

        ////////////////////////////////////////////////////
        // Kit
        ////////////////////////////////////////////////////
        mCollection.collClear(m_kitDefinitions);

        rs = rs.NextRecordset;

        for(var _i = 0; _i < m_data.items.length; _i += 1) {

          prId = Cairo.Database.valField(m_data.items[_i], CV.PR_ID);
          coll = Object.getCollKitInfoXPrId(prId, m_kitDefinitions);

          prId = Cairo.Database.valField(m_data.items[_i], CV.PR_ID_ITEM);

          //*TODO:** can't found type for with block
          //*With GetKitInfoItem(coll, prId)
          var w___TYPE_NOT_FOUND = GetKitInfoItem(coll, prId);
          w___TYPE_NOT_FOUND.pr_id = prId;
          w___TYPE_NOT_FOUND.nombre = Cairo.Database.valField(m_data.items[_i], CV.PR_NOMBRE_COMPRA);
          w___TYPE_NOT_FOUND.Cantidad = Cairo.Database.valField(m_data.items[_i], "cantidad");
          w___TYPE_NOT_FOUND.LlevaNroSerie = Cairo.Database.valField(m_data.items[_i], CV.PR_LLEVA_NRO_SERIE);
        }

        return true;
      };

      var load = function(id) {

        var apiPath = Cairo.Database.getAPIVersion();
        return Cairo.Database.getData("load[" + apiPath + "general/remitoventa]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== NO_ID) {

              m_id = Cairo.Database.valField(response.data, CV.RV_ID);
              m_numero = Cairo.Database.valField(response.data, CV.RV_NUMERO);
              m_nroDoc = Cairo.Database.valField(response.data, CV.RV_NRODOC);
              m_descrip = Cairo.Database.valField(response.data, CV.RV_DESCRIP);
              m_fecha = Cairo.Database.valField(response.data, CV.RV_FECHA);
              m_fechaentrega = Cairo.Database.valField(response.data, CV.RV_FECHAENTREGA);
              m_neto = Cairo.Database.valField(response.data, CV.RV_NETO);
              m_ivari = Cairo.Database.valField(response.data, CV.RV_IVARI);
              m_ivarni = Cairo.Database.valField(response.data, CV.RV_IVARNI);
              m_total = Cairo.Database.valField(response.data, CV.RV_TOTAL);
              m_subTotal = Cairo.Database.valField(response.data, CV.RV_SUBTOTAL);
              m_descuento1 = Cairo.Database.valField(response.data, CV.RV_DESCUENTO1);
              m_descuento2 = Cairo.Database.valField(response.data, CV.RV_DESCUENTO2);
              m_importeDesc1 = Cairo.Database.valField(response.data, CV.RV_IMPORTEDESC1);
              m_importeDesc2 = Cairo.Database.valField(response.data, CV.RV_IMPORTEDESC2);
              m_cliId = Cairo.Database.valField(response.data, CV.CLI_ID);
              m_cliente = Cairo.Database.valField(response.data, CV.CLI_NAME);
              m_ccosId = Cairo.Database.valField(response.data, CV.CCOS_ID);
              m_centroCosto = Cairo.Database.valField(response.data, CV.CCOS_NAME);
              m_sucId = Cairo.Database.valField(response.data, CV.SUC_ID);
              m_sucursal = Cairo.Database.valField(response.data, CV.SUC_NAME);
              m_docId = Cairo.Database.valField(response.data, CV.DOC_ID);
              m_documento = Cairo.Database.valField(response.data, CV.DOC_NAME);
              m_doctId = Cairo.Database.valField(response.data, CV.DOCT_ID);
              m_lpId = Cairo.Database.valField(response.data, CV.LP_ID);
              m_listaPrecio = Cairo.Database.valField(response.data, CV.LP_NAME);
              m_cpgId = Cairo.Database.valField(response.data, CV.CPG_ID);
              m_condicionPago = Cairo.Database.valField(response.data, CV.CPG_NAME);
              m_ldId = Cairo.Database.valField(response.data, CV.LD_ID);
              m_listaDescuento = Cairo.Database.valField(response.data, CV.LD_NAME);
              m_creado = Cairo.Database.valField(response.data, Cairo.Constants.CREADO);
              m_modificado = Cairo.Database.valField(response.data, Cairo.Constants.MODIFICADO);
              m_modifico = Cairo.Database.valField(response.data, Cairo.Constants.MODIFICO);
              m_estId = Cairo.Database.valField(response.data, C.EST_ID);
              m_estado = Cairo.Database.valField(response.data, Cairo.Constants.EST_NAME);
              m_firmado = Cairo.Database.valField(response.data, CV.RV_FIRMADO);
              m_cotizacion = Cairo.Database.valField(response.data, CV.RV_COTIZACION);

              m_venId = Cairo.Database.valField(response.data, CV.VEN_ID);
              m_vendedor = Cairo.Database.valField(response.data, CV.VEN_NAME);
              m_lgjId = Cairo.Database.valField(response.data, CV.LGJ_ID);
              m_legajo = Cairo.Database.valField(response.data, CV.LGJ_CODE);
              m_proIdOrigen = Cairo.Database.valField(response.data, CV.PRO_ID_ORIGEN);
              m_proOrigen = Cairo.Database.valField(response.data, "ProOrigen");
              m_proIdDestino = Cairo.Database.valField(response.data, CV.PRO_ID_DESTINO);
              m_proDestino = Cairo.Database.valField(response.data, "ProDestino");
              m_transId = Cairo.Database.valField(response.data, CV.TRANS_ID);
              m_transporte = Cairo.Database.valField(response.data, CV.TRANS_NAME);

              m_clisId = Cairo.Database.valField(response.data, CV.CLIS_ID);
              m_clienteSucursal = Cairo.Database.valField(response.data, CV.CLIS_NAME);

              m_chofId = Cairo.Database.valField(response.data, CV.CHOF_ID);
              m_chofer = Cairo.Database.valField(response.data, CV.CHOF_NAME);

              m_camId = Cairo.Database.valField(response.data, CV.CAM_ID);
              m_camion = Cairo.Database.valField(response.data, CV.CAM_PATENTE);

              m_camIdSemi = Cairo.Database.valField(response.data, CV.CAM_ID_SEMI);
              m_semi = Cairo.Database.valField(response.data, CV.CAM_PATENTESEMI);

              m_docEditable = Cairo.Database.valField(response.data, Cairo.Constants.DOC_EDITABLE);
              m_docEditMsg = Cairo.Database.valField(response.data, Cairo.Constants.DOCEDIT_MSG);

              m_retiro = Cairo.Database.valField(response.data, CV.RV_RETIRO);
              m_guia = Cairo.Database.valField(response.data, CV.RV_GUIA);
              m_destinatario = Cairo.Database.valField(response.data, CV.RV_DESTINATARIO);

              m_ordenCompra = Cairo.Database.valField(response.data, CV.RV_ORDEN_COMPRA);

              // Lote
              //
              m_depfId = Cairo.Database.valField(response.data, CV.DEPF_ID);
              m_deplId = Cairo.Database.valField(response.data, CV.DEPL_ID);
              m_deposito = Cairo.Database.valField(response.data, CV.DEPL_NAME);

              // Para ver documentos auxiliares
              //
              m_stId = Cairo.Database.valField(response.data, CV.ST_ID);
              m_stIdConsumo = Cairo.Database.valField(response.data, CV.ST_ID_CONSUMO);
              m_stIdConsumoTemp = Cairo.Database.valField(response.data, CV.ST_ID_CONSUMO_TEMP);
              m_stIdProducido = Cairo.Database.valField(response.data, CV.ST_ID_PRODUCIDO);

              m_taPropuesto = Cairo.Database.valField(response.data, Cairo.Constants.TA__PROPUESTO);
              m_taMascara = Cairo.Database.valField(response.data, Cairo.Constants.TA__MASCARA);

              m_bIva = Cairo.Database.valField(response.data, CV.BIVA_RI);
              m_bIvaRni = Cairo.Database.valField(response.data, CV.BIVA_RNI);

              m_lastDocId = m_docId;
              m_lastMonId = m_monId;
                    m_lastDoctId = m_doctId; //  nrs devolucion
              m_lastCliId = m_cliId;
              m_lastTrans = m_transId;
              m_lastChof = m_chofId;
              m_lastDocName = m_documento;
              m_lastCliName = m_cliente;

              m_monId = Cairo.Database.valField(response.data, CV.MON_ID);
              m_lastMonIdCotizacion = m_monId;
              m_lastFecha = m_fecha;

            }
            else {
              m_id = NO_ID;
              m_numero = 0;
              m_nroDoc = "";
              m_descrip = "";
              m_fecha = VDGetDateById(csDateEnum.cSTODAY);
              m_fechaentrega = VDGetDateById(csDateEnum.cSTOMORROW);
              m_neto = 0;
              m_ivari = 0;
              m_ivarni = 0;
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
              m_creado = Cairo.Constants.cSNODATE;
              m_modificado = Cairo.Constants.cSNODATE;
              m_modifico = 0;
              m_estId = NO_ID;
              m_estado = "";
              m_sucId = cUtil.getUser().getSuc_id();
              m_sucursal = cUtil.getUser().getSucursal();
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

              // Lote
              //
              m_depfId = NO_ID;
              m_deplId = NO_ID;
              m_deposito = "";

              // Para ver documentos auxiliares
              //
              m_stId = NO_ID;
              m_stIdConsumo = NO_ID;
              m_stIdConsumoTemp = NO_ID;
              m_stIdProducido = NO_ID;

              m_taPropuesto = false;
              m_taMascara = "";

              m_docId = m_lastDocId;
                    m_doctId = m_lastDoctId; //  nrs devolucion
              m_cliId = m_lastCliId;
              m_cliente = m_lastCliName;
              m_documento = m_lastDocName;

              m_lastTrans = NO_ID;
              m_lastChof = NO_ID;

              m_bIvaRni = false;
              m_bIva = false;

              m_monId = NO_ID;
              m_lastMonIdCotizacion = NO_ID;
              m_lastFecha = Cairo.Constants.cSNODATE;

              // Cotizacion
              if(m_docId !== NO_ID) {
                m_cotizacion = DocGetCotizacion(m_docId, m_fecha);
              }

              DocEditableGet(m_docId, m_docEditable, m_docEditMsg, csPreVtaNewRemito);
            }

            return true;
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

      var saveItems = function(id) {

        // Generales
        //
        var transaction = new Cairo.Database.Transaction();
        var iOrden = null;
        var row = null;
        var cell = null;

        // Para numeros de serie
        //
        var iOrden2 = null;
        var grupo = null;
        var prId = null;

        var _count = m_items.getProperties().item(C_ITEMS).getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = m_items.getProperties().item(C_ITEMS).getGrid().getRows().item(_i);

          var register = new Cairo.Database.Register();
          register.setFieldId(CV.RVI_TMPID);
          register.setTable(CV.REMITOVENTAITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var w_var fields = register.getFields();

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KI_RVI_ID:
                var apiPath = Cairo.Database.getAPIVersion();
                register.setPath(apiPath + "general/remitoventa");

                if(m_copy) {
                  w_fields.add(CV.RVI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  w_fields.add(CV.RVI_ID, Cairo.Util.val(cell.getValue()), Types.integer);
                }
                break;

              case KI_CANTIDAD:
                w_fields.add(CV.RVI_CANTIDAD, cell.getValue(), Types.double);
                break;

              case KI_DESCRIP:
                w_fields.add(CV.RVI_DESCRIP, cell.getValue(), Types.text);
                break;

              case KI_PRECIO:
                w_fields.add(CV.RVI_PRECIO, cell.getValue(), Types.currency);
                break;

              case KI_PRECIO_LP:
                w_fields.add(CV.RVI_PRECIO_LISTA, cell.getValue(), Types.currency);
                break;

              case KI_PRECIO_USR:
                w_fields.add(CV.RVI_PRECIO_USR, cell.getValue(), Types.currency);
                break;

              case KI_DESCUENTO:
                w_fields.add(CV.RVI_DESCUENTO, cell.getValue(), Types.text);
                break;

              case KI_IMPORTE:
                w_fields.add(CV.RVI_IMPORTE, cell.getValue(), Types.currency);
                break;

              case KI_NETO:
                w_fields.add(CV.RVI_NETO, cell.getValue(), Types.currency);
                break;

              case KI_IVARI:
                if(m_bIva) {
                  w_fields.add(CV.RVI_IVARI, cell.getValue(), Types.currency);
                }
                break;

              case KI_IVARNI:
                if(m_bIvaRni) {
                  w_fields.add(CV.RVI_IVARNI, cell.getValue(), Types.currency);
                }
                break;

              case KI_IVARIPERCENT:
                w_fields.add(CV.RVI_IVARIPORC, cell.getValue(), Types.double);
                break;

              case KI_IVARNIPERCENT:
                w_fields.add(CV.RVI_IVARNIPORC, cell.getValue(), Types.double);
                break;

              case KI_PR_ID:
                prId = cell.getId();
                w_fields.add(CV.PR_ID, prId, Types.id);
                break;

              case KI_CCOS_ID:
                w_fields.add(CV.CCOS_ID, cell.getId(), Types.id);
                break;

              case KI_GRUPO:
                grupo = cell.getId();

                // Lote
                //
                break;

              case KI_STL_ID:
                w_fields.add(CV.STL_ID, cell.getId(), Types.id);
                break;
            }
          }

          iOrden = iOrden + 1;

          w_fields.add(CV.RVI_ORDEN, iOrden, Types.integer);
          w_fields.add(CV.RV_TMPID, id, Types.id);

          w_fields.setHaveLastUpdate(false);
          w_fields.setHaveWhoModify(false);

          transaction.addRegister(register);

          // Si es nuevo se usa el orden
          if(grupo === 0) { grupo = iOrden * -1; }
          if(!pSaveItemNroSerie(row, iOrden2, prId, id, register.getID(), grupo)) { return false; }
        }

        if(m_itemsDeleted !== "" && m_id !== NO_ID && !m_copy) {

          var vDeletes = null;
          var i = null;

          m_itemsDeleted = RemoveLastColon(m_itemsDeleted);
          vDeletes = Split(m_itemsDeleted, ",");

          for (i = 0; i <= vDeletes.Length; i++) {

            var register = new Cairo.Database.Register();
            register.setFieldId(CV.RVIB_TMPID);
            register.setTable(CV.REMITOVENTAITEMBORRADOTMP);
            register.setId(Cairo.Constants.NEW_ID);

            var w_var fields = register.getFields();
            w_fields.add(CV.RVI_ID, Cairo.Util.val(vDeletes(i)), Types.integer);
            w_fields.add(CV.RV_ID, m_id, Types.id);
            w_fields.add(CV.RV_TMPID, id, Types.id);

            w_fields.setHaveLastUpdate(false);
            w_fields.setHaveWhoModify(false);

            transaction.addRegister(register);
          }

        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      // Reglas del Objeto de Negocios
      var pDocDesdePedido = function() {
        var doc = null;
        var rtn = null;
        var docId = null;

        // Si todavia no se cargo el form no se que
        // documento es, asi que no puede ser sobre pedido
        if(m_properties.item(CV.DOC_ID) === null) { return false; }

        docId = m_properties.item(CV.DOC_ID).getSelectId();

        // Si no hay un documento activo no se hace nada
        if(docId === NO_ID) { return false; }

        doc = new cDocumento();

        return doc.GetData(docId, CV.DOC_RV_DESDE_PV, Types.boolean);
      };

      var docDescargaBOM = function() {
        var doc = null;
        var rtn = null;
        var docId = null;

        // Si todavia no se cargo el form no se que
        // documento es, asi que no puede ser sobre pedido
        if(m_properties.item(CV.DOC_ID) === null) { return false; }

        docId = m_properties.item(CV.DOC_ID).getSelectId();

        // Si no hay un documento activo no se hace nada
        if(docId === NO_ID) { return false; }

        doc = new cDocumento();

        return doc.GetData(docId, CV.DOC_RV_BOM, Types.boolean);
      };

      var pDocDesdeOrden = function() {
        var doc = null;
        var rtn = null;
        var docId = null;

        // Si todavia no se cargo el form no se que
        // documento es, asi que no puede ser sobre pedido
        if(m_properties.item(CV.DOC_ID) === null) { return false; }

        docId = m_properties.item(CV.DOC_ID).getSelectId();

        // Si no hay un documento activo no se hace nada
        if(docId === NO_ID) { return false; }

        doc = new cDocumento();

        return doc.GetData(docId, CV.DOC_RV_DESDE_OS, Types.boolean);
      };

      var showImporteAndIva = function(row) { // TODO: Use of ByRef founded Private Sub pShowImporteAndIva(ByRef Row As CSInterfacesABM.cIABMGridRow)
        var importe = null;
        var neto = null;
        var ivaRi = null;
        var ivaRni = null;

        neto = Cairo.Util.val(Dialogs.cell(row, KI_CANTIDAD).getValue()) * Cairo.Util.val(Dialogs.cell(row, KI_PRECIO).getValue());
        if(m_bIva) {
          ivaRi = (neto * Cairo.Util.val(Dialogs.cell(row, KI_IVARIPERCENT).getValue())) / 100;
        }
        if(m_bIvaRni) {
          ivaRni = (neto * Cairo.Util.val(Dialogs.cell(row, KI_IVARNIPERCENT).getValue())) / 100;
        }
        importe = neto + ivaRi + ivaRni;

        Dialogs.cell(row, KI_NETO).getValue() === neto;
        Dialogs.cell(row, KI_IVARI).getValue() === ivaRi;
        Dialogs.cell(row, KI_IVARNI).getValue() === ivaRni;
        Dialogs.cell(row, KI_IMPORTE).getValue() === importe;
      };

      var updateTotals = function() {

        var rows = getGrid(m_items, C_ITEMS).getRows();

        var neto = null;
        var ivaRi = null;
        var ivaRni = null;
        var desc1 = null;
        var desc2 = null;

        var row = null;

        var _count = rows.size();
        for (var _i = 0; _i < _count; _i++) {
          row = rows.item(_i);
          neto = neto + Cairo.Util.val(Dialogs.cell(row, KI_NETO).getValue());
          ivaRi = ivaRi + Cairo.Util.val(Dialogs.cell(row, KI_IVARI).getValue());
          ivaRni = ivaRni + Cairo.Util.val(Dialogs.cell(row, KI_IVARNI).getValue());
        }

        var properties = m_footer.getProperties();
        properties.item(CV.RV_SUBTOTAL).setValue(neto);

        desc1 = m_properties.item(CV.RV_DESCUENTO1).getValue();
        desc2 = m_properties.item(CV.RV_DESCUENTO2).getValue();

        ivaRi = ivaRi - (ivaRi * desc1 / 100);
        ivaRni = ivaRni - (ivaRni * desc1 / 100);

        ivaRi = ivaRi - (ivaRi * desc2 / 100);
        ivaRni = ivaRni - (ivaRni * desc2 / 100);

        desc1 = neto * desc1 / 100;
        properties.item(CV.RV_IMPORTEDESC1).setValue(desc1);

        neto = neto - desc1;

        desc2 = neto * desc2 / 100;
        properties.item(CV.RV_IMPORTEDESC2).setValue(desc2);

        neto = neto - desc2;

        properties.item(CV.RV_NETO).setValue(neto);
        properties.item(CV.RV_IVARI).setValue(ivaRi);
        properties.item(CV.RV_IVARNI).setValue(ivaRni);
        properties.item(CV.RV_TOTAL).setValue(neto + ivaRni + ivaRi);

        m_footer.refreshControls();
      };

      var pSetTasasImpositivas = function(row, pr_id, pr_nombre) { // TODO: Use of ByRef founded Private Sub pSetTasasImpositivas(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal pr_id As Long, ByVal pr_nombre As String)
        var ti_ri = null;
        var ti_rni = null;

        if(pr_id === 0) { return; }

        if(!GetTasaFromProducto(pr_id, ti_ri, ti_rni, false)) { return; }

        if(ti_ri === 0) {
          MsgWarning(getText(1597, "", pr_nombre));
          //El producto [" & pr_nombre & "] no tiene definida su tasa impositiva de ventas para el iva responsable inscripto
          return;
        }

        if(ti_rni === 0) {
          MsgWarning(getText(1598, "", pr_nombre));
          //El producto [" & pr_nombre & "] no tiene definida su tasa impositiva de ventas para el iva responsable no inscripto
          return;
        }

        var sqlstmt = null;
        var rs = null;

        if(m_bIva) {
          sqlstmt = "select ti_porcentaje,cue_id from tasaimpositiva where ti_id = "+ ti_ri.toString();
          if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

          if(!rs.isEOF()) {
            Dialogs.cell(row, KI_IVARIPERCENT).getValue() === Cairo.Database.valField(rs.getFields(), CV.TI_PORCENTAJE);
          }
        }
        else {
          Dialogs.cell(row, KI_IVARIPERCENT).getValue() === 0;
        }

        if(m_bIvaRni) {
          sqlstmt = "select ti_porcentaje,cue_id from tasaimpositiva where ti_id = "+ ti_rni.toString();
          if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

          if(!rs.isEOF()) {
            Dialogs.cell(row, KI_IVARNIPERCENT).getValue() === Cairo.Database.valField(rs.getFields(), CV.TI_PORCENTAJE);
          }
        }
        else {
          Dialogs.cell(row, KI_IVARNIPERCENT).getValue() === 0;
        }
      };

      // Reglas del Objeto de Negocios
      var pSetDataProducto = function(row, pr_id) { // TODO: Use of ByRef founded Private Sub pSetDataProducto(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal pr_id As Long)
        var sqlstmt = null;
        var rs = null;
        var bEsKit = null;

        var bChanged = null;

        bChanged = pr_id !== Dialogs.cell(row, KI_PR_ID).getID();

        sqlstmt = "sp_StockProductoGetData "+ pr_id.toString()+ ","+ pGetCliId().toString()+ ",Null";

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(!rs.isEOF()) {
          bEsKit = Cairo.Database.valField(rs.getFields(), CV.PR_ESKIT);

          Dialogs.cell(row, KI_UNIDAD).getValue() === Cairo.Database.valField(rs.getFields(), "unidadVenta");

          var w_pCell = Dialogs.cell(row, KI_CCOS_ID);
          w_pCell.setValue(Cairo.Database.valField(rs.getFields(), "centro_costo_venta"));
          w_pCell.setId(Cairo.Database.valField(rs.getFields(), CV.CCOS_ID_VENTA));

          // Si el documento no mueve stock no se exigen los numeros de serie
          //
          if(m_showStockData) {
            Dialogs.cell(row, KI_PR_LLEVA_NRO_SERIE).getID() === Cairo.Database.valField(rs.getFields(), CV.PR_LLEVA_NRO_SERIE);

            // Lote
            //
            Dialogs.cell(row, KI_PR_LLEVA_LOTE).getID() === Cairo.Database.valField(rs.getFields(), CV.PR_LLEVA_NRO_LOTE);

            // Lote Fifo
            //
            Dialogs.cell(row, KI_PR_LOTE_FIFO).getID() === Cairo.Database.valField(rs.getFields(), CV.PR_LOTE_FIFO);

          }
          else {
            Dialogs.cell(row, KI_PR_LLEVA_NRO_SERIE).getID() === false;

            // Lote
            //
            Dialogs.cell(row, KI_PR_LLEVA_LOTE).getID() === false;

            // Lote Fifo
            //
            Dialogs.cell(row, KI_PR_LOTE_FIFO).getID() === false;
          }

          Dialogs.cell(row, KI_ES_KIT).getID() === bEsKit;

          if(bEsKit) {

            var coll = null;

            sqlstmt = "sp_StockProductoGetKitInfo "+ pr_id.toString();
            if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

            coll = Object.getCollKitInfoXPrId(pr_id, m_kitDefinitions);

            while (!rs.isEOF()) {
              pr_id = Cairo.Database.valField(rs.getFields(), CV.PR_ID);
              //*TODO:** can't found type for with block
              //*With GetKitInfoItem(coll, pr_id)
              var w___TYPE_NOT_FOUND = GetKitInfoItem(coll, pr_id);
              w___TYPE_NOT_FOUND.pr_id = pr_id;
              w___TYPE_NOT_FOUND.nombre = Cairo.Database.valField(rs.getFields(), CV.PR_NOMBRE_COMPRA);
              w___TYPE_NOT_FOUND.Cantidad = Cairo.Database.valField(rs.getFields(), "cantidad");
              w___TYPE_NOT_FOUND.LlevaNroSerie = Cairo.Database.valField(rs.getFields(), CV.PR_LLEVA_NRO_SERIE);
              rs.MoveNext;
            }
          }
        }

        // Si cambio el producto borro los numeros de serie
        //
        if(bChanged || Dialogs.cell(row, KI_PR_LLEVA_NRO_SERIE).getID() === 0) {

          Dialogs.cell(row, KI_NRO_SERIE).getValue() === "";
          if(ExistsObjectInColl(m_serialNumbers, GetKey(Dialogs.cell(row, KI_GRUPO).getID()))) {

            m_serialNumbers.remove(GetKey(Dialogs.cell(row, KI_GRUPO).getID()));
          }
        }
      };

      var setEnabled = function() {
        var bState = null;

        // Si se genera desde un pedido y es nuevo
        // no puede editar, tiene que hacer click en
        // nuevo y llamar al asistente
        if(pDocDesdePedido() && m_id === NO_ID) {
          bState = false;
        }
        else if(pDocDesdeOrden() && m_id === NO_ID) {
          bState = false;
        }
        else if(m_docEditable) {
          bState = m_properties.item(CV.DOC_ID).getSelectId() !== NO_ID;
        }
        else {
          bState = false;
        }

        pSetEnabledAux(bState);
      };

      var pSetEnabledAux = function(bState) {
        var prop = null;

        var _count = m_properties.size();
        for (var _i = 0; _i < _count; _i++) {
          prop = m_properties.item(_i);
          // HIDECOLS
          if(prop.getKey() !== K_DOC_ID && prop.getKey() !== K_NUMERO && prop.getKey() !== K_EST_ID && prop.getKey() !== K_HIDE_COLS) {

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
          properties.item(CV.DEPL_ID_ORIGEN).setEnabled(m_showStockData);
        }

        var _count = m_items.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          prop = m_items.getProperties().item(_i);
          prop.setEnabled(bState);
        }

      #If PREPROC_SFS Then;
        var abmGen = null;
      #Else;
        var abmGen = null;
      #End If;

        abmGen = m_items;
        abmGen.RefreshEnabledState(m_items.getProperties());

        abmGen = m_dialog;
        abmGen.RefreshEnabledState(m_dialog.getProperties());
      };

      var pSetDatosCliente = function() {
        var lp_id = null;
        var ld_id = null;
        var cpg_id = null;
        var cpg_nombre = null;

        var trans_id = null;
        var pro_id = null;
        var ven_id = null;

        var trans_nombre = null;
        var pro_nombre = null;
        var ven_nombre = null;

        var lP = null;
        var lD = null;
        var iProp = null;
        var filter = null;

        var property = m_properties.item(CV.CLI_ID);
        if(m_lastCliId === property.getSelectId()) {
          return;
        }
        m_lastCliId = property.getSelectId();

        if(!GetClienteDataEx2(m_lastCliId, lp_id, ld_id, cpg_id, trans_id, pro_id, ven_id, trans_nombre, pro_nombre, ven_nombre, m_lastDocId)) { return; }

        // Condicion de pago
        if(cpg_id !== NO_ID) {

          if(!Cairo.Database.getData(CV.CONDICIONPAGO, CV.CPG_ID, cpg_id, CV.CPG_NAME, cpg_nombre)) { return; }

          iProp = m_properties.item(CV.CPG_ID);
          iProp.setValue(cpg_nombre);
          iProp.setSelectId(cpg_id);
          m_dialog.showValue(iProp);
        }

        // Lista de precios
        iProp = m_properties.item(CV.LP_ID);
        iProp.setSelectFilter(GetListaPrecioGetXCliente(m_lastDocId, m_lastCliId));

        if(lp_id !== NO_ID) {
          lP = new cListaPrecio();
          iProp.setValue(lP.GetData(lp_id, CV.LP_NAME, Types.text));
          iProp.setSelectId(lp_id);
        }

        m_dialog.showValue(iProp);

        // Lista de descuentos
        iProp = m_properties.item(CV.LD_ID);
        iProp.setSelectFilter(GetListaDescGetXCliente(m_lastDocId, m_lastCliId));

        if(ld_id !== NO_ID) {
          lD = new cListaDescuento();
          iProp.setValue(lD.GetData(ld_id, CV.LD_NAME, Types.text));
          iProp.setSelectId(ld_id);
        }

        //////////////////////////////////////////////////////////////
        if(ven_id !== NO_ID) {
          iProp = m_properties.item(CV.VEN_ID);
          iProp.setValue(ven_nombre);
          iProp.setSelectId(ven_id);
          m_dialog.showValue(iProp);
        }
        if(trans_id !== NO_ID) {
          iProp = m_properties.item(CV.TRANS_ID);
          iProp.setValue(trans_nombre);
          iProp.setSelectId(trans_id);
          m_dialog.showValue(iProp);
          pSetDatosTransporte();
        }
        if(pro_id !== NO_ID) {
          iProp = m_properties.item(CV.PRO_ID_DESTINO);
          iProp.setValue(pro_nombre);
          iProp.setSelectId(pro_id);
          m_dialog.showValue(iProp);
        }

        iProp = m_properties.item(CV.CLIS_ID);
        iProp.setSelectFilter(GetHelpFilterCliSuc(m_lastCliId));

        m_dialog.showValue(iProp);
        //////////////////////////////////////////////////////////////

        // Talonario y Categoria fiscal
        pGetIvaFromCliente(m_lastCliId);

        m_dialog.showValue(iProp);
      };

      var pGetIvaFromCliente = function(cli_id) {
        var sqlstmt = null;
        var rs = null;
        var bIvaChanged = null;
        var bLastIva = null;

        sqlstmt = "sp_clienteGetIva "+ cli_id.toString();
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

      var pFirmar = function() {
        var doc = null;
        var us_id = null;

        doc = new cDocumento();

        if(m_id === NO_ID) {
          MsgWarning(getText(1592, ""));
          //Antes de poder firmar el documento debe guardarlo.
          return null;
        }

        if(m_firmado) {
          if(!Ask(getText(1593, ""), vbYes, getText(1594, ""))) {
            //El documento ya ha sido firmado desea borrar la firma, vbYes, Firmar
            return null;
          }
        }

        if(!doc.Firmar(m_docId, us_id)) { return false; }

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_DocRemitoVentaFirmar "+ m_id+ ","+ us_id.toString();
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

        m_estId = Cairo.Database.valField(rs.getFields(), C.EST_ID);
        m_estado = Cairo.Database.valField(rs.getFields(), Cairo.Constants.EST_NAME);

        var iProp = null;
        iProp = m_properties.item(Cairo.Constants.STATUS_ID);

        iProp.setSelectId(m_estId);
        iProp.setValue(m_estado);

        Cairo.Database.getData(CV.REMITOVENTA, CV.RV_ID, m_id, CV.RV_FIRMADO, m_firmado);

        m_dialog.showValue(iProp);

        return true;
      };

      var move = function(moveTo) {
        var doc_id = getDocId();

        if(docId === NO_ID) {
          return M.showInfoWithFalse(
            getText(1595, "") // Debe seleccionar un documento
          );
        }

        sqlstmt = "sp_DocRemitoVentaMover "+ moveTo+ ","+ m_numero+ ","+ doc_id.toString();

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

        // Si no obtuve ningun id al moverme
        //
        if(rs.isEOF()) {

          switch (moveTo) {

            // Si era siguiente ahora busco el ultimo
            //
            case Dialogs.Message.MSG_DOC_NEXT:
              move(Dialogs.Message.MSG_DOC_LAST);

              // Si era anterior ahora busco el primero
              //
              break;

            case Dialogs.Message.MSG_DOC_PREVIOUS:
              move(Dialogs.Message.MSG_DOC_FIRST);

              // Si no encontre ni ultimo ni primero
              // es por que no hay ningun comprobante para
              // este documento
              //
              break;

            case Dialogs.Message.MSG_DOC_FIRST:
            case Dialogs.Message.MSG_DOC_LAST:

              // Limpio incluso el ultimo cliente
              //
              m_lastCliId = NO_ID;
              m_lastCliName = "";
              m_lastTrans = NO_ID;
              m_lastChof = NO_ID;

              // Cargo un registro vacio
              //
              load(NO_ID);

              // Refresco el formulario
              //
              refreshProperties();

              // Obtengo un nuevo numero de comprobante
              //
              GetDocNumber(m_lastDocId, m_dialog, m_taPropuesto, CV.RV_NRODOC);

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

        var properties = m_dialog.getProperties();

        c = properties.item(CV.DOC_ID);
        c.setSelectId(m_docId);
        c.setValue(m_documento);

        c = properties.item(CV.RV_FECHA);
        c.setValue(m_fecha);

        c = properties.item(CV.RV_FECHAENTREGA);
        c.setValue(m_fechaentrega);

        c = properties.item(CV.CLI_ID);
        c.setSelectId(m_cliId);
        c.setValue(m_cliente);

        c = properties.item(Cairo.Constants.NUMBER_ID);
        c.setValue(m_numero);

        c = properties.item(Cairo.Constants.STATUS_ID);
        c.setValue(m_estado);

        c = properties.item(CV.RV_NRODOC);
        c.setValue(m_nroDoc);
        c.setTextMask(m_taMascara);
        c.setTextAlign(Dialogs.TextAlign.right);

        c = properties.item(CV.RV_DESCUENTO1);
        c.setValue(m_descuento1);

        c = properties.item(CV.RV_DESCUENTO2);
        c.setValue(m_descuento2);

        c = properties.item(CV.DEPL_ID_ORIGEN);
        if(m_deplId !== NO_ID || !m_showStockData) {
          c.setSelectId(m_deplId);
          c.setValue(m_deposito);
        }
        else {
          // Preferencias del usuario
          //
          c.setSelectId(Cairo.UserConfig.getDeplId());
          c.setValue(Cairo.UserConfig.getDeplNombre());
          pSetStock();
        }

        c = properties.item(CV.CPG_ID);
        c.setSelectId(m_cpgId);
        c.setValue(m_condicionPago);

        c = properties.item(CV.RV_COTIZACION);
        c.setValue(m_cotizacion);

        c = properties.item(CV.LP_ID);
        c.setSelectFilter(GetListaPrecioGetXCliente(m_docId, m_cliId));
        c.setSelectId(m_lpId);
        c.setValue(m_listaPrecio);

        c = properties.item(CV.LD_ID);
        c.setSelectFilter(GetListaDescGetXCliente(m_docId, m_cliId));
        c.setSelectId(m_ldId);
        c.setValue(m_listaDescuento);

        c = properties.item(CV.CCOS_ID);
        c.setSelectId(m_ccosId);
        c.setValue(m_centroCosto);

        c = properties.item(CV.SUC_ID);
        c.setSelectId(m_sucId);
        c.setValue(m_sucursal);

        c = properties.item(CV.VEN_ID);
        c.setSelectId(m_venId);
        c.setValue(m_vendedor);

        c = properties.item(CV.RV_DESCRIP);
        c.setValue(m_descrip);

        c = properties.item(CV.LGJ_ID);
        c.setSelectId(m_lgjId);
        c.setValue(m_legajo);

        c = properties.item(CV.PRO_ID_ORIGEN);
        c.setSelectId(m_proIdOrigen);
        c.setValue(m_proOrigen);

        c = properties.item(CV.PRO_ID_DESTINO);
        c.setSelectId(m_proIdDestino);
        c.setValue(m_proDestino);

        c = properties.item(CV.TRANS_ID);
        c.setSelectId(m_transId);
        c.setValue(m_transporte);

        c = properties.item(CV.RV_RETIRO);
        c.setValue(m_retiro);

        c = properties.item(CV.RV_GUIA);
        c.setValue(m_guia);

        c = properties.item(CV.RV_DESTINATARIO);
        c.setValue(m_destinatario);

        c = properties.item(CV.RV_ORDEN_COMPRA);
        c.setValue(m_ordenCompra);

        c = properties.item(CV.CLIS_ID);
        c.setSelectId(m_clisId);
        c.setValue(m_clienteSucursal);

        c = properties.item(CV.CHOF_ID);
        c.setSelectId(m_chofId);
        c.setValue(m_chofer);
        c.setSelectFilter(D.getTransporteFilter(m_transId));

        c = properties.item(CV.CAM_ID);
        c.setSelectId(m_camId);
        c.setValue(m_camion);
        c.setSelectFilter(D.getTransporteFilter(m_transId));

        c = properties.item(CV.CAM_ID_SEMI);
        c.setSelectId(m_camIdSemi);
        c.setValue(m_semi);
        c.setSelectFilter(D.getTransporteFilter(m_transId));

        abmGen = m_dialog;
        abmGen.ShowValues(m_dialog.getProperties());

        abmGen.ResetChanged;

        c = m_items.getProperties().item(C_ITEMS);
        if(!pLoadItems(c)) { return; }

        m_itemsDeleted = "";

        abmGen = m_items;
        abmGen.ShowValues(m_items.getProperties());

        var properties = m_footer.getProperties();

        c = properties.item(CV.RV_SUBTOTAL);
        c.setValue(m_subTotal);

        c = properties.item(CV.RV_IMPORTEDESC1);
        c.setValue(m_importeDesc1);

        c = properties.item(CV.RV_IMPORTEDESC2);
        c.setValue(m_importeDesc2);

        c = properties.item(CV.RV_NETO);
        c.setValue(m_neto);

        c = properties.item(CV.RV_IVARI);
        c.setValue(m_ivari);

        c = properties.item(CV.RV_IVARNI);
        c.setValue(m_ivarni);

        c = properties.item(CV.RV_TOTAL);
        c.setValue(m_total);

        abmGen = m_footer;
        abmGen.ShowValues(m_footer.getProperties());

        setEnabled();

        showCotizacion();

        // DATADD
        mPublicVentas.self.showDataAddCliente(Cairo.UserConfig.getShowDataAddInVentas(), m_dialog);

      };

      var pShowApply = function() {

        if(!DoCairo.Security.anAccess(csPreVtaModifyAplic, m_docId, csE_DocTypePrestacion.cSEDOCTPREAPLICAR)) { return; }

        if(m_applyEditor === null) {
          m_applyEditor = new cRemitoVentaAplic();

          // Edit Apply
          //
        }
        else {
          if(m_applyEditor.id !== m_id) {
            m_applyEditor.self.setObjectClient(null);
            m_applyEditor = new cRemitoVentaAplic();
          }
        }

        // Edit Apply
        //
        m_applyEditor.self.setObjectClient(self);

        if(!m_applyEditor.self.show(m_id, m_total, m_nroDoc, m_cliId, m_cliente, m_sucId, m_docId, m_doctId === csEDocumentoTipo.cSEDT_DEVOLUCIONREMITOVTA)) {
          m_applyEditor = null;
        }
      };

      var showStartWizardPedido = function() {
        try {

          var oWizard = null;
          oWizard = new cRemitoVentaWizard();

          var mouse = null;
          mouse = new cMouseWait();

          if(!oWizard.self.load()) { return; }

          oWizard.self.setCli_id(m_cliId);
          oWizard.self.setCliente() = m_cliente;
          oWizard.self.setPvIds() = m_pvIds;
          oWizard.self.setDoc_id() = m_lastDocId;
          oWizard.self.setDocumento() = m_lastDocName;
          oWizard.self.setObjClient(self);

          //Dim iEditGeneric As cIEditGeneric
          //Set iEditGeneric = oWizard
          //Set iEditGeneric.ObjTree = m_ObjTree

          var iObjWizard = null;
          var oObjWizard = null;

          iObjWizard = CSKernelClient2.CreateObject("CSABMInterface2.cWizardGeneric");
          oObjWizard = iObjWizard;
          oObjWizard.setObjClient(oWizard);
          oObjWizard.setPushVirtualNext(m_bPushVirtualNext);

          iObjWizard.show("CSVenta2.cRemitoVentaWizard");

          oObjWizard.getObjAbm().getObjForm().ZOrder;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "pShowStartWizard", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var showStartWizardOrden = function() {
        try {

          var oWizard = null;
          oWizard = new cRemitoVentaOrdenWiz();

          var mouse = null;
          mouse = new cMouseWait();

          if(!oWizard.self.load()) { return; }

          oWizard.self.setCli_id(m_cliId);
          oWizard.self.setCliente() = m_cliente;
          oWizard.self.setOsIds() = m_osIds;
          oWizard.self.setOsiIds() = m_prnsIds;
          oWizard.self.setDoc_id() = m_lastDocId;
          oWizard.self.setDocumento() = m_lastDocName;
          oWizard.self.setAutoFactura(m_bAutoFactura);
          oWizard.self.setAutoPago(m_bAutoPago);
          oWizard.self.setCue_id_autoPago(m_cueIdAutoPago);
          oWizard.self.setModoVentaCtaCte(m_modoVentaCtaCte);
          oWizard.self.setObjClient(self);

          //Dim iEditGeneric As cIEditGeneric
          //Set iEditGeneric = oWizard
          //Set iEditGeneric.ObjTree = m_ObjTree

          var iObjWizard = null;
          var oObjWizard = null;

          iObjWizard = CSKernelClient2.CreateObject("CSABMInterface2.cWizardGeneric");
          oObjWizard = iObjWizard;
          oObjWizard.setObjClient(oWizard);
          oObjWizard.setPushVirtualNext(m_bPushVirtualNext);

          iObjWizard.show("CSVenta2.cRemitoVentaOrdenWiz");

          if(!oObjWizard.getObjAbm() === null) {
            oObjWizard.getObjAbm().getObjForm().ZOrder;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "pShowStartWizardOrden", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var showStartWizardBOM = function() {
        try {

          var oWizard = null;
          oWizard = new cRemitoVentaBOMWizard();

          var mouse = null;
          mouse = new cMouseWait();

          if(!oWizard.self.load()) { return; }

          oWizard.self.setCli_id(m_cliId);
          oWizard.self.setCliente() = m_cliente;
          oWizard.self.setPvIds() = m_pvIds;
          oWizard.self.setDoc_id() = m_lastDocId;
          oWizard.self.setDocumento() = m_lastDocName;
          oWizard.self.setObjClient(self);

          //Dim iEditGeneric As cIEditGeneric
          //Set iEditGeneric = oWizard
          //Set iEditGeneric.ObjTree = m_ObjTree

          var iObjWizard = null;
          var oObjWizard = null;

          iObjWizard = CSKernelClient2.CreateObject("CSABMInterface2.cWizardGeneric");
          oObjWizard = iObjWizard;
          oObjWizard.setObjClient(oWizard);
          oObjWizard.setPushVirtualNext(m_bPushVirtualNext);

          iObjWizard.show("CSVenta2.cRemitoVentaBOMWizard");

          oObjWizard.getObjAbm().getObjForm().ZOrder;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "pShowStartWizardBOM", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      // Construccion - Destruccion
      self.initialize = function() {
        try {

            c_ErrorSave = getText(2222, ""); // Error al grabar el Remito de Venta

          m_serialNumbers = new Collection();
          m_generalConfig = new cGeneralConfig();
          m_generalConfig.Load;

          // Lote
          //
          m_stockConfig = new cStockConfig();
          m_stockConfig.load();

          // Preferencias del Usuario
          //
          m_userCfg = new cUsuarioConfig();
          Cairo.UserConfig.Load;
          Cairo.UserConfig.ValidateRV;

          G.redim(m_pvIds, 0);
          G.redim(m_osIds, 0);
          G.redim(m_prnsIds, 0);

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "Class_Initialize", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      self.destroy = function() {
        try {

          m_dialog = null;
          m_listController = null;
          m_footer = null;
          m_items = null;
          G.redim(m_pvIds, 0);
          G.redim(m_osIds, 0);
          mCollection.collClear(m_serialNumbers);
          m_serialNumbers = null;
          m_generalConfig = null;

          // Lote
          //
          m_stockConfig = null;

          // Preferencias del Usuario
          //
          m_userCfg = null;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "Class_Terminate", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var pSetNrosSerieInRow = function(currGroup, nroSerie) {
        var row = null;

        if(currGroup === 0) { return; }

        var _count = m_items.getProperties().item(C_ITEMS).getGrid().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = m_items.getProperties().item(C_ITEMS).getGrid().getRows().item(_i);
          if(Dialogs.cell(row, KI_GRUPO).getID() === currGroup) {
            Dialogs.cell(row, KI_NRO_SERIE).getValue() === RemoveLastColon(nroSerie);
            return;
          }
        }
      };

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////
      var pSaveItemNroSerie = function(row, iOrden, prId, rvTMPId, rviTMPId, grupo) { // TODO: Use of ByRef founded Private Function pSaveItemNroSerie(ByRef Row As CSInterfacesABM.cIABMGridRow, ByRef iOrden As Long, ByVal PrId As Long, ByVal RvTMPId As Long, ByVal RviTMPId As Long, ByVal Grupo As Long) As Boolean

        var pt = null;
        var register = null;

        // Si lleva numero de serie
        //
        if(Dialogs.cell(row, KI_PR_LLEVA_NRO_SERIE).getID() && m_showStockData) {

          // Obtengo los numeros de serie y guardo un Item por cada uno
          //
          var _count = m_serialNumbers.get(GetKey(grupo)).size();
          for (var _i = 0; _i < _count; _i++) {
            pt = m_serialNumbers.get(GetKey(grupo)).item(_i);

            register = new cRegister();
            register.setFieldId(CV.RVIS_TMPID);
            register.setTable(CV.REMITOVENTAITEMSERIETMP);
            register.setId(Cairo.Constants.NEW_ID);

            var w_fields = register.getFields();
            w_fields.add2(CV.PR_ID, prId, Types.id);

            if(m_copy) {
              w_fields.add2(CV.PRNS_ID, Cairo.Constants.NEW_ID, Types.integer);
            }
            else {
              w_fields.add2(CV.PRNS_ID, pt.getPrns_id(), Types.id);
            }

            w_fields.add2(CV.PRNS_CODE, pt.getCodigo(), Types.text);
            w_fields.add2(CV.PRNS_DESCRIP, pt.getDescrip(), Types.text);
            w_fields.add2(CV.PRNS_FECHAVTO, pt.getFechaVto(), Types.date);
            w_fields.add2(CV.PR_ID_ITEM, pt.getPr_id_item(), Types.id);

            w_fields.add2(CV.RV_TMPID, rvTMPId, Types.id);
            w_fields.add2(CV.RVI_TMPID, rviTMPId, Types.id);

            iOrden = iOrden + 1;
            w_fields.add2(CV.RVIS_ORDEN, iOrden, Types.integer);

            w_fields.setHaveLastUpdate(false);
            w_fields.setHaveWhoModify(false);

            if(!Cairo.Database.save(register, , "pSaveItemNroSerie", C_MODULE, c_ErrorSave)) { return false; }
          }
        }

        return true;
      };

      //////////////////////////////////////////////////////////////////////////////////////////////////
      // nrs devolucion
      var getDeplId = function() {
        var _rtn = 0;
        if(m_lastDoctId === csEDocumentoTipo.cSEDT_DEVOLUCIONREMITOVTA) {
          _rtn = csE_DepositosInternos.cSEDEPLIDTERCERO;
        }
        else {
          _rtn = m_properties.item(CV.DEPL_ID_ORIGEN).getSelectId();
        }

        return _rtn;
      };

      var pGetCliId = function() {
        return m_properties.item(CV.CLI_ID).getSelectId();
      };

      var getFecha = function() {
        return m_properties.item(CV.RV_FECHA).getValue();
      };

      var pSetStock = function() {

        if(m_stockConfig.getStockXFisico() || m_stockConfig.getNoControlaStock()) {

          m_depfId = NO_ID;

          if(!Cairo.Database.getData(CV.DEPOSITOLOGICO, CV.DEPL_ID, getDeplId(), CV.DEPF_ID, m_depfId)) {
          }
        }

      };

      var pSetDatosTransporte = function() {
        var chof_id = null;
        var cam_id = null;
        var chofer = null;
        var camion = null;

        var iProp = null;
        var filter = null;

        var property = m_properties.item(CV.TRANS_ID);
        if(m_lastTrans === property.getSelectId()) {
          return;
        }
        m_lastTrans = property.getSelectId();

        filter = D.getTransporteFilter(m_lastTrans);

        if(!mPublicTransporte.self.getTransporteData(m_lastTrans, chof_id, chofer, cam_id, camion)) { return; }

        // Chofer
        iProp = m_properties.item(CV.CHOF_ID);
        iProp.setSelectFilter(filter);

        if(cam_id !== NO_ID) {

          iProp.setValue(chofer);
          iProp.setSelectId(chof_id);

        }

        m_dialog.showValue(iProp);

        // Camion
        iProp = m_properties.item(CV.CAM_ID);
        iProp.setSelectFilter(filter);

        if(cam_id !== NO_ID) {

          iProp.setValue(camion);
          iProp.setSelectId(cam_id);

        }

        m_dialog.showValue(iProp);
      };

      var pSetDatosChofer = function() {
        var chof_id = null;
        var cam_id = null;
        var camion = null;
        var cam_id_semi = null;
        var semi = null;
        var iProp = null;

        var property = m_properties.item(CV.CHOF_ID);
        if(m_lastChof === property.getSelectId()) {
          return;
        }
        m_lastChof = property.getSelectId();

        if(!mPublicTransporte.self.getChoferData(m_lastChof, cam_id, camion, cam_id_semi, semi)) { return; }

        // Camion
        iProp = m_properties.item(CV.CAM_ID);

        if(cam_id !== NO_ID) {

          iProp.setValue(camion);
          iProp.setSelectId(cam_id);

        }

        m_dialog.showValue(iProp);

        // Semi
        iProp = m_properties.item(CV.CAM_ID_SEMI);

        if(cam_id_semi !== NO_ID) {

          iProp.setValue(semi);
          iProp.setSelectId(cam_id_semi);

        }

        m_dialog.showValue(iProp);
      };

      var pShowFactura = function(bPushVirtualNext) {
        try {

          var o = null;
          o = new CSVenta2.cFacturaVenta();
          o.PushVirtualNext = bPushVirtualNext;
          o.ShowFacturaRemito(m_cliId, pGetRvIds());

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "pShowFactura", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      var pGetRvIds = function() {
        var rtn() = null;
        G.redim(rtn, 1);
        rtn[1] = m_id;
        return rtn;
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

        bVisible = Cairo.Util.val(m_properties.item(c_HideCols).getValue()) === 0;

        var iProp = null;
        iProp = getItems();

        abmObj.DrawGrid(iProp, false);

        var i = null;

        columns = iProp.getGrid().getColumns();
        for (i = 1; i <= columns.count(); i++) {
          switch (columns(i).Key) {

            case KI_DESCUENTO:
            case KI_UNIDAD:
            case KI_PRECIO_LP:
            case KI_IVARNI:
            case KI_CCOS_ID:

              // Solo si la llamada fue para todas las columnas
              // y no unicamente para las columnas de stock
              //
              if(!bOnlyStock) {
                columns(i).Visible = bVisible;
                abmObj.RefreshColumnPropertiesByIndex(iProp, i);
              }

              break;

            case KI_NRO_SERIE:
            case KI_STL_ID:

              // Si mueve stock se ven siempre
              //
              columns(i).Visible = m_showStockData;
              abmObj.RefreshColumnPropertiesByIndex(iProp, i);

              break;
          }
        }

        abmObj.DrawGrid(iProp, true);
      };
      //
      // HIDECOLS - fin

      var pGetFileNamePostFix = function() {
        return m_cliente.Substring(0, 50)+ "-"+ m_nroDoc;
      };

      var pShowMenuDocAction = function() {
        var abmObj = null;
        abmObj = m_dialog;

        var menu = null;

        menu = getText(4960, "")+ "~6|"+ getText(4961, "")+ "~7|"+ getText(4962, "")+ "~8";
        // Facturar el Documento|Facturar el Documento Automaticamente|Cancelar el Documento

        abmObj.ShowPopMenu(menu);
      };

      var pCancelarRemito = function() {
        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_DocRemitoVentaCancelar "+ cUtil.getUser().getId().toString()+ ","+ cUtil.getEmpId().toString()+ ","+ m_id;

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }
        if(rs.isEOF()) { return; }

        if(Cairo.Database.valField(rs.getFields(), 0) === 0) {
          MsgWarning(Cairo.Database.valField(rs.getFields(), 1));
        }
        else {
            return M.showInfoWithFalse(getText(4963, "")); //  La operación concluyo con éxito
        }

      };


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

  Cairo.module("XxxxListDoc.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;
      var P = Cairo.Promises;
      var NO_ID = NO_ID;
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

      var C_MODULE = "cRemitoVentaListDoc";

      var C_FECHA_INI = "FechaIni";
      var C_FECHA_FIN = "FechaFin";

      var C_IMG_TASK = 1;


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

      var m_objApply;

      var m_apiPath = DB.getAPIVersion();
      var SAVE_ERROR = getText(2227, ""); // Error al grabar los párametros de navegación de Xxxx

      self.list = function() {
        initialize();
        return load()
          .whenSuccess(loadCollection);
      };

      self.edit = function(xxId) {
        m_listController.edit(xxId);
      };

      self.deleteItem = function(xxId) {
        return m_listController.destroy(xxId);
      };

      self.showDocDigital = function() {
        var _rtn = false;

        try {

          var xxId = m_dialog.getId();
          if(xxId === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(CX.TABLE_NAME_XXXX);
          doc.setClientTableID(xxId);

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
              pCancelarRemito();

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
        c.setName(getText(1150, "")); // Proveedor
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
        if(!m_dialog.showDocumentList(self)) { return false; }

        return true;
      };
      var loadCollection = function() {
        var c = null;
        var o = null;
        var value = null;
        var bExists = null;

        var properties = m_dialog.getProperties();
        properties.clear();

        c = properties.add(null, C_FECHA_INI);
        c.setType(Dialogs.PropertyType.date);
        // Fecha desde
        c.setName(getText(1203, ""));
        c.setKey(K_FECHA_INI);

        if(LenB(m_fechaIniV)) {
          c.setValue(m_fechaIniV);
        }
        else {
          c.setValue(m_fechaIni);
        }

        c = properties.add(null, C_FECHA_FIN);
        c.setType(Dialogs.PropertyType.date);
        // Fecha hasta
        c.setName(getText(1204, ""));
        c.setKey(K_FECHA_FIN);

        if(LenB(m_fechaFinV)) {
          c.setValue(m_fechaFinV);
        }
        else {
          c.setValue(m_fechaFin);
        }

        c = properties.add(null, C.CLI_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CLIENTE);
        // Cliente
        c.setName(getText(1150, ""));
        c.setKey(K_CLI_ID);
        value = m_cliente;
        if(m_cliId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.CLIENTE, Cairo.Util.val(m_cliId.Substring(2)), bExists);
          if(!bExists) { m_cliId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_cliId));
        c.setSelectIntValue(m_cliId);

        c = properties.add(null, C.EST_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csEstado);
        // Estado
        c.setName(getText(1568, ""));
        c.setKey(K_EST_ID);
        value = m_estado;
        if(m_estId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csEstado, Cairo.Util.val(m_estId.Substring(2)), bExists);
          if(!bExists) { m_estId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_estId));
        c.setSelectIntValue(m_estId);

        c = properties.add(null, C.CCOS_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CENTRO_COSTO);
        // Centro de Costos
        c.setName(getText(1057, ""));
        c.setKey(K_CCOS_ID);
        value = m_centroCosto;
        if(m_ccosId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.CENTRO_COSTO, Cairo.Util.val(m_ccosId.Substring(2)), bExists);
          if(!bExists) { m_ccosId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_ccosId));
        c.setSelectIntValue(m_ccosId);

        c = properties.add(null, C.SUC_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.SUCURSAL);
        // Sucursal
        c.setName(getText(1281, ""));
        c.setKey(K_SUC_ID);
        value = m_sucursal;
        if(m_sucId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.SUCURSAL, Cairo.Util.val(m_sucId.Substring(2)), bExists);
          if(!bExists) { m_sucId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_sucId));
        c.setSelectIntValue(m_sucId);

        c = properties.add(null, C.VEN_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.VENDEDORES);
        // Vendedores
        c.setName(getText(1502, ""));
        c.setKey(K_VEN_ID);
        value = m_vendedor;
        if(m_venId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.VENDEDORES, Cairo.Util.val(m_venId.Substring(2)), bExists);
          if(!bExists) { m_venId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_venId));
        c.setSelectIntValue(m_venId);

        c = properties.add(null, C.DOC_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(csETablasDocumento.CSDocumento);
        // Documentos
        c.setName(getText(1611, ""));
        c.setKey(K_DOC_ID);
        value = m_documento;
        if(m_docId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(csETablasDocumento.CSDocumento, Cairo.Util.val(m_docId.Substring(2)), bExists);
          if(!bExists) { m_docId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_docId));
        c.setSelectIntValue(m_docId);
        c.setSelectFilter(getDocFilter());

        c = properties.add(null, C.CPG_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.CONDICIONPAGO);
        // Condicion de pago
        c.setName(getText(1395, ""));
        c.setKey(K_CPG_ID);
        value = m_condicionPago;
        if(m_cpgId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.CONDICIONPAGO, Cairo.Util.val(m_cpgId.Substring(2)), bExists);
          if(!bExists) { m_cpgId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_cpgId));
        c.setSelectIntValue(m_cpgId);


        c = properties.add(null, C.EMP_ID);
        c.setType(Dialogs.PropertyType.select);
        c.setSelectTable(Cairo.Tables.EMPRESA);
        // Empresa
        c.setName(getText(1114, ""));
        c.setKey(K_EMP_ID);
        value = m_empresa;
        if(m_empId.Substring(0, 1).toUpperCase() === KEY_NODO) {
          value = GetNombreRama(Cairo.Tables.EMPRESA, Cairo.Util.val(m_empId.Substring(2)), bExists);
          if(!bExists) { m_empId = "0"; }
        }
        c.setValue(value);
        c.setSelectId(Cairo.Util.val(m_empId));
        c.setSelectIntValue(m_empId);

        createMenu();
        if(!m_dialog.showDocumentList(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {
        return m_dialog.showValues(m_properties);
      };

      var load = function() {

        return DB.getData("load[" + m_apiPath + "general/remitoventalistdoc]", id).then(
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

              m_provId = valField(response.data, C.PROV_ID);
              m_estId = valField(response.data, C.EST_ID);
              m_ccosId = valField(response.data, C.CCOS_ID);
              m_sucId = valField(response.data, C.SUC_ID);
              m_docId = valField(response.data, C.DOC_ID);
              m_cpgId = valField(response.data, C.CPG_ID);
              m_empId = valField(response.data, C.EMP_ID);

              m_proveedor = valField(response.data, C.PROV_NAME);
              m_estado = valField(response.data, C.EST_NAME);
              m_centroCosto = valField(response.data, C.CCOS_NAME);
              m_sucursal = valField(response.data, C.SUC_NAME);
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
        var iProp = null;

        var properties = m_dialog.getProperties();
        switch (key) {

          case K_FECHA_INI:

            iProp = properties.item(C_FECHA_INI);

            if(iProp.getSelectIntValue() !== "") {
              m_fechaIniV = iProp.getSelectIntValue();
              m_fechaIni = Cairo.Dates.DateNames.getDateByName(m_fechaIniV);
            }
            else if(isDate(iProp.getValue())) {
              m_fechaIniV = "";
              m_fechaIni = iProp.getValue();
            }
            else {
              m_fechaIniV = "";
              iProp.setValue(m_fechaIni);
            }

            break;

          case K_FECHA_FIN:

            iProp = properties.item(C_FECHA_FIN);

            if(iProp.getSelectIntValue() !== "") {
              m_fechaFinV = iProp.getSelectIntValue();
              m_fechaFin = Cairo.Dates.DateNames.getDateByName(m_fechaFinV);
            }
            else if(isDate(iProp.getValue())) {
              m_fechaFinV = "";
              m_fechaFin = iProp.getValue();
            }
            else {
              m_fechaFinV = "";
              iProp.setValue(m_fechaFin);
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
          provId: m_provId,
          estId: m_estId,
          ccosId: m_ccosId,
          sucId: m_sucId,
          docId: m_docId,
          cpgId: m_cpgId,
          empId: m_empId
        };

        return DB.getData("load[" + m_apiPath + "compras/facturacompras]", null, params);
      };
      var cIABMListDocClient_Refresh = function() {
        var sqlstmt = null;

        sqlstmt = "sp_lsdoc_RemitosVenta ";

        sqlstmt = sqlstmt+ Cairo.Database.getUserId().toString()+ ",";

        if(!cDate.getDateNames(m_fechaIniV) === null) {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(Cairo.Dates.DateNames.getDateByName(m_fechaIniV))+ ",";
        }
        else {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(m_fechaIni)+ ",";
        }

        if(!cDate.getDateNames(m_fechaFinV) === null) {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(Cairo.Dates.DateNames.getDateByName(m_fechaFinV))+ ",";
        }
        else {
          sqlstmt = sqlstmt+ Cairo.Database.sqlDate(m_fechaFin)+ ",";
        }

        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_cliId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_estId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_ccosId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_sucId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_venId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_docId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_cpgId)+ ",";
        sqlstmt = sqlstmt+ Cairo.Database.sqlString(m_empId);

        return sqlstmt;
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.LDP_ID);
        register.setTable(C.LISTA_DOCUMENTO_PARAMETRO);

        register.setPath(m_apiPath + "compras/facturacompras");

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

      var cIABMListDocClient_Save = function() {

        var strError = null;

        strError = getText(2227, "");
        //Error al grabar los párametros de navegación de Remitos de Venta

        var register = null;
        var register = new DB.Register();

        var sqlstmt = null;

        sqlstmt = "delete ListaDocumentoParametro where pre_id = "+ csPreVtaListRemito+ " and us_id = "+ m_us_id+ " and (emp_id is null or emp_id = "+ cUtil.getEmpId().toString()+ ")";

        if(!Cairo.Database.execute(sqlstmt, "cIABMClient_Save", C_MODULE, strError)) { return false; }

        register.setTable(Cairo.Constants.LISTADOCUMENTOPARAMETRO);
        register.setUtilizaIdentity(true);

        var property = null;
        var _count = m_properties.size();
        for(var _i = 0; _i < _count; _i++) {
          property = m_properties.item(_i);

          register.getFields().clear();

          switch (property.getKey()) {

            case K_FECHA_INI:
              if(property.getSelectIntValue() !== "") {
                fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              }
              else {
                fields.add(Cairo.Constants.LDP_VALOR, property.getValue(), Types.text);
              }

              fields.add(Cairo.Constants.LDP_ORDEN, 10, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_FECHA_INI, Types.integer);

              break;

            case K_FECHA_FIN:

              if(property.getSelectIntValue() !== "") {
                fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              }
              else {
                fields.add(Cairo.Constants.LDP_VALOR, property.getValue(), Types.text);
              }

              fields.add(Cairo.Constants.LDP_ORDEN, 20, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_FECHA_FIN, Types.integer);

              break;

            case K_CLI_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 40, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_CLI_ID, Types.integer);
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

            case K_VEN_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 80, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_VEN_ID, Types.integer);
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


              break;

            case K_EMP_ID:
              fields.add(Cairo.Constants.LDP_VALOR, property.getSelectIntValue(), Types.text);
              fields.add(Cairo.Constants.LDP_ORDEN, 100, Types.integer);
              fields.add(Cairo.Constants.LDP_ID, K_EMP_ID, Types.integer);

              break;
          }


          fields.add(C.EMP_ID, cUtil.getEmpId(), Types.id);

          fields.add(C.US_ID, m_us_id, Types.id);
          fields.add(C.PRE_ID, csPreVtaListRemito, Types.id);



          if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, strError)) { return false; }
        }

        if(!load(m_us_id)) { return false; }

        return true;
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
        m_dialog.setIsDocument(true);
      };


      var getDocFilter = function() {
        return "'{emp_id=0}doct_id = "+ csEDocumentoTipo.cSEDT_REMITO_VENTA.toString()+ " or doct_id = "+ csEDocumentoTipo.cSEDT_DEVOLUCION_REMITO_VTA.toString()+ "'";
      };

      var createMenu = function() {


        if(m_menuLoaded) { return; }

        m_menuLoaded = true;

        m_objList.ObjClientMenu = self;
        m_objList.ClearMenu;
        // Editar Cliente
        m_menuEditCliente = m_objList.addMenu(getText(5038, ""));
        m_objList.addMenu("-");
        // Facturar este remito
        m_menuShowFactura = m_objList.addMenu(getText(3954, ""));
        // Facturar Automático
        m_menuShowFacturaAuto = m_objList.addMenu(getText(3956, ""));
        // Cancelar el Documento
        m_menuShowCancelar = m_objList.addMenu(getText(4962, ""));
        m_objList.addMenu("-");
        // Firmar
        m_menuSign = m_objList.addMenu(getText(1594, ""));
        m_objList.addMenu("-");
        // Ver Info del Cliente
        m_menuShowInfoCli = m_objList.addMenu(getText(1614, ""));
        // Agregar Nota
        m_menuAddNote = m_objList.addMenu(getText(1615, ""));
        // Ver Notas
        m_menuShowNotes = m_objList.addMenu(getText(1616, ""));
        m_objList.addMenu("-");
        // Ver Aplicaciones
        m_menuShowApply = m_objList.addMenu(getText(1617, ""));
        // Ver Documento Asociado
        m_menuShowDocAux = m_objList.addMenu(getText(1691, ""));
      };

      var showNotes = function() {
        var fcId = m_dialog.getId();
        return DB.getData("load[" + m_apiPath + "modulexxxx/xxxx/notes]", fcId)
          .whenSuccessWithResult(D.showNotes);
      };

      var addNote = function() {
        var xxId = m_dialog.getId();
        return D.addNote(D.Types.TYPEXXXX, xxId, false);
      };

      var editCliente = function() {
        var cli_id = null;
        cli_id = getCliId();
        if(cli_id === NO_ID) { return; }
        var abmObj = null;
        var o = null;
        abmObj = new CSABMInterface2.cABMGeneric();
        o = CSKernelClient2.CreateObject("CSGeneral2.cCliente");
        o.setObjABM(abmObj);
        o.edit(cli_id, true);
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
              getText(1594, ""), // Firmar
              getText(1593, "")  // El documento ya ha sido firmado desea borrar la firma

            );
          }
          return p || P.resolvedPromise(true);
        };

        var p = D.getDocumentSignStatus(D.Types.FACTURA_COMPRA, fcId)
            .whenSuccessWithResult(getAction)
            .whenSuccess(D.signDocument(D.Types.FACTURA_COMPRA, fcId))
            .whenSuccessWithResult(refreshRow)
          ;

        return p;
      };

      var showAsiento = function() {
        var fcId = m_dialog.getId();
        if(fcId !== NO_ID) {

          D.getAsientoId(D.Types.FACTURA_COMPRA, fcId).whenSuccessWithResult(function(response) {
            D.showDocAux(response.as_id, "Asiento");
          });
        }
      };

      var showDocAux = function() {

        var rvId = null;
        rvId = m_dialog.getId();

        if(rvId) {

          var stId = null;
          if(!DB.getData(CV.REMITO_VENTA, CV.RV_ID, rvId, CV.ST_ID, stId)) { return; }

          if(stId === NO_ID) {

            return M.showInfoWithFalse(getText(1693, ""));
            //Este comprobante no tiene un documento de stock asociado.
          }
          else {

            ShowDocAux(stId, "CSStock2.cStock", "CSABMInterface2.cABMGeneric");
          }
        }

      };

      var showDocAux = function() {
        var fcId = m_dialog.getId();
        if(fcId !== NO_ID) {

          D.getStockId(D.Types.TYPE_XXXX, xxId).whenSuccessWithResult(function(response) {
            D.showDocAux(response.st_id, "Stock");
          });
        }
      };

      var showApply = function() {

        var rvId = null;
        rvId = m_dialog.getId();

        if(rvId === NO_ID) { return; }

        var total = null;
        var nroDoc = null;
        var cliId = null;
        var cliente = null;
        var sucId = null;
        var docId = null;
        var doctId = null;

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "select rv_total, rv_nrodoc, rv.cli_id, cli_nombre, rv.suc_id, rv.doc_id, rv.doct_id from RemitoVenta rv inner join Cliente cli  on rv.cli_id = cli.cli_id where rv_id = "+ rvId.toString();

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(rs.isEOF()) { return; }

        total = Cairo.Database.valField(rs.getFields(), CV.RV_TOTAL);
        nroDoc = Cairo.Database.valField(rs.getFields(), CV.RV_NRODOC);
        cliId = Cairo.Database.valField(rs.getFields(), C.CLI_ID);
        cliente = Cairo.Database.valField(rs.getFields(), C.CLI_NAME);
        sucId = Cairo.Database.valField(rs.getFields(), C.SUC_ID);
        docId = Cairo.Database.valField(rs.getFields(), C.DOC_ID);
        doctId = Cairo.Database.valField(rs.getFields(), C.DOCT_ID);

        if(!DoCairo.Security.anAccess(csPreVtaModifyAplic, m_docId, csE_DocTypePrestacion.cSEDOCTPREAPLICAR)) { return; }

        if(m_objApply === null) {
          m_objApply = new cRemitoVentaAplic();

          // Edit Apply
          //
        }
        else {
          if(m_objApply.id !== rvId) {
            m_objApply = new cRemitoVentaAplic();
          }
        }

        if(!m_objApply.self.show(rvId, total, nroDoc, cliId, cliente, sucId, docId, doctId === csEDocumentoTipo.cSEDT_DEVOLUCION_REMITO_VTA)) {
          m_objApply = null;
        }

      };

      var showFactura = function(bPushVirtualNext) {
        try {

          var o = null;
          o = new CSVenta2.cFacturaVenta();

          o.PushVirtualNext = bPushVirtualNext;
          o.ShowFacturaRemito(getCliId(), getRvIds());


        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "showFactura", C_MODULE, "");

        }

      };

      var pCancelarRemito = function() {
        var sqlstmt = null;
        var rs = null;

        var vRvIds() = null;

        vRvIds = getRvIds();

        var i = null;

        for(i = 0; i <= vRvIds.Length; i++) {

          sqlstmt = "sp_DocRemitoVentaCancelar "+ Cairo.User.getId().toString()+ ","+ cUtil.getEmpId().toString()+ ","+ vRvIds[i].toString();

          if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }
          if(rs.isEOF()) { return; }

          if(Cairo.Database.valField(rs.getFields(), 0) === 0) {
            MsgWarning(Cairo.Database.valField(rs.getFields(), 1));
          }

          if(Cairo.Database.valField(rs.getFields(), 0) === -1) {
            MsgWarning(Cairo.Database.valField(rs.getFields(), 1));
            return;
          }

        }

        //  La operación concluyo con éxito
        return M.showInfo(getText(4963, ""));

      };

      var getCliId = function() {


        var rvId = null;
        var cliId = null;

        rvId = m_dialog.getId();
        DB.getData(CV.REMITO_VENTA, CV.RV_ID, rvId, C.CLI_ID, cliId);

        return cliId;
      };

      var getRvIds = function() {
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

      var initialize = function() {
        try {

          // Remitos de ventas
          m_title = getText(1712, "");

          m_properties = new cABMDocProperties();
          //Set .ImageList = fResource.iList
          m_properties.setHaveDetail(true);
          m_properties.setStartRowText(4);

          var elem = m_properties.add(null, "TypeTask");
          elem.setName("TypeTask");
          elem.setCaption(" ");
          var elem = row.add(null);
          elem.FormulaType = csConditionType.cSCONDTNONE;
          elem.IconIndex = C_IMG_TASK;
          elem.setSortType(csSortType.cSSRTTICON);

          var elem = m_properties.add(null, "Observaciones");
          elem.setName("Observaciones");
          elem.setFontName("Tahoma");
          elem.setFontSize(8);
          elem.setForeColor(vbBlue);


        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");

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

      self.destroy = function() {
        try {

          m_dialog = null;
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

  Cairo.module("Xxxx.List", function(List, Cairo, Backbone, Marionette, $, _) {

    var NO_ID = NO_ID;
    var DB = Cairo.Database;
    var C_MODULE = "cXxxx";
    var P = Cairo.Promises;

    List.Controller = {
      list: function() {

        var self = this;

        var createListDialog = function() {

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
              Cairo.LoadingMessage.show("Xxxx", "Loading Xxxxs from CrowSoft Cairo server.");

              var editor = Cairo.Xxxx.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.Modulexxxx.DELETE_XXXX)) {
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
              DB.getAPIVersion() + "modulexxxx/xxxx", id,
              Cairo.Constants.DELETE_FUNCTION, C_MODULE).whenSuccess(closeDialog, false);
          };

          // progress message
          //
          Cairo.LoadingMessage.show("Xxxx", "Loading Xxxxs from CrowSoft Cairo server.");

          self.documentList = Cairo.XxxxListDoc.Edit.Controller.getEditor();
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