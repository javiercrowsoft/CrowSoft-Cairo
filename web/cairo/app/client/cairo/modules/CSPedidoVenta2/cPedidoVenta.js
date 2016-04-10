(function() {
  "use strict";

  Cairo.module("PedidoVenta.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var TITLE = getText(1557, ""); // Pedidos de Venta
      var SAVE_ERROR_MESSAGE = getText(1591, ""); // Error al grabar el Pedido de Venta

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

      var C_MODULE = "cPedidoVenta";

      var C_ITEMS = "ITEMS";

      var MENU_SHOW_REMITO = 1;
      var MENU_SHOW_FACTURA = 2;
      var MENU_SHOW_INFO = 3;

      var K_NUMERO = 1;
      var K_NRODOC = 2;
      var K_DESCRIP = 3;
      var K_FECHA = 4;
      var K_FECHAENTREGA = 5;
      var K_NETO = 6;
      var K_IVA_RI = 7;
      var K_IVA_RNI = 8;
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
      var K_IMPORTEDESC1 = 22;
      var K_IMPORTEDESC2 = 23;
      var K_SUBTOTAL = 24;
      var K_RAM_ID_STOCK = 25;

      var K_VEN_ID = 26;
      var K_LGJ_ID = 27;
      var K_PRO_ID_ORIGEN = 29;
      var K_PRO_ID_DESTINO = 30;
      var K_TRANS_ID = 31;
      var K_CLIS_ID = 33;

      var K_CHOF_ID = 36;
      var K_CAM_ID = 37;
      var K_CAM_ID_SEMI = 38;
      var K_DESTINATARIO = 39;

      var K_ORDENCOMPRA = 40;

      var K_HIDECOLS = 41;

      var KI_PVI_ID = 2;
      var KI_CANTIDAD = 4;
      var KI_STOCK = 500;
      var KI_STOCK_REAL = 501;
      var KI_STOCK_PEDIDOS = 502;
      var KI_DESCRIP = 6;
      var KI_PRECIO = 7;
      var KI_IMPORTE = 8;
      var KI_NETO = 9;
      var KI_IVA_RI = 10;
      var KI_IVA_RNI = 11;
      var KI_PR_ID = 13;
      var KI_IVA_RI_PERCENT = 16;
      var KI_IVA_RNI_PERCENT = 17;
      var KI_DESCUENTO = 18;
      var KI_UNIDAD = 19;
      var KI_PRECIO_LP = 20;
      var KI_PRECIO_USR = 21;
      var KI_CCOS_ID = 22;

      var m_id = 0;
      var m_numero = 0;
      var m_estado = "";
      var m_estId = 0;
      var m_nrodoc = "";
      var m_descrip = "";
      var m_fecha = null;
      var m_fechaentrega = null;
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
      var m_ramaStock = "";
      var m_ramIdStock = "";
      var m_firmado;

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

      var m_chofId = 0;
      var m_chofer = "";

      var m_camId = 0;
      var m_camion = "";

      var m_camIdSemi = 0;
      var m_semi = "";

      var m_destinatario = "";

      var m_ordenCompra = "";

      var m_taPropuesto;
      var m_taMascara = "";

      var m_editing;

      var m_footer;
      var m_footerProps;
      var m_items;
      var m_itemsProps;
      var m_dialog;
      var m_properties;
      var m_listController = null;

      var m_lastDocId = 0;
      var m_lastCliId = 0;
      var m_lastDocTipoPedido = 0;
      var m_lastDocName = "";
      var m_lastCliName = "";

      var m_lastDoctId = 0;
      
      var m_lastTransId = 0;
      var m_lastChofId = 0;

      var m_bIva;
      var m_bIvaRni;

      var m_isNew;

      var m_itemsDeleted = "";

      var m_copy;

      var m_docEditable;
      var m_docEditMsg = "";

      var m_applyEditor;

      var m_prvIds = 0;

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

      var startWizard = function(wizard, wizardConstructor) {
        wizard.setCliId(m_cliId);
        wizard.setCliente(m_cliente);
        wizard.setDocId(m_lastDocId);
        wizard.setDocumento(m_lastDocName);
        wizard.setObjClient(self);

        var wizardDialog = Cairo.Dialogs.WizardViews.Controller.newWizard();
        wizardDialog.setClient(wizard);
        wizardDialog.show(wizardConstructor);
      };

      var showStartWizardPresupuesto = function() {
        try {
          var wizConstructor = Cairo.PedidoVentaWiz.Edit.Controller.getEditor;
          var wizard = wizConstructor();
          wizard.setPrvIds(m_prvIds);
          wizard.loadWizard().whenSuccess(call(startWizard, wizard, wizConstructor));
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "showStartWizardPresupuesto", C_MODULE, "");
        }
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

      self.showPedido = function(cliId, prvIds) {
        showStartWizard(cliId, function() {
          m_prvIds = prvIds.slice();
          if(initMembers()) {
            showStartWizardPresupuesto();
          }
        });
      };

      self.showWizardPedidoPresupuesto = function() {
        try {
          if(initMembers()) {
            showStartWizardPresupuesto();
          }
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "showWizardPedidoPresupuesto", C_MODULE, "");
        }
      };

      var initMembers = function() {

        if(!Cairo.Security.docHasPermissionTo(
          CS.NEW_PEDIDO,
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
          CS.NEW_PEDIDO,
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

            var docId = m_properties.item(C.DOC_ID).getSelectId();

            if(docId === NO_ID) {
              p = M.showInfo(getText(1562, ""));
            }

            return p || P.resolvedPromise();

          }).then(function() {

            setDataCliente();
            return D.setDocNumber(m_lastDocId, m_dialog, CV.PV_NRODOC)

          }).then(function(enabled) {

            m_taPropuesto = enabled;
            setColorBackground();
            return true;

          });

        return p;
      };

      self.getApplication = function() {
        return Cairo.Application.appName;
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

          doc.setClientTable(CV.PEDIDO_VENTA);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch (ex) {
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
            
            p = true;
            updateTotals();
            break;

          case Dialogs.Message.MSG_DOC_EDIT_STATE:
            
            D.showEditStatus(m_docEditMsg, TITLE);
            break;

          case Dialogs.Message.MSG_DOC_DELETE:

            p = self.deleteDocument(m_id).whenSuccess(function() {
              return move(Dialogs.Message.MSG_DOC_NEXT);
            });
            break;

          case Dialogs.Message.MSG_DOC_APPLY:
            
            showApplycationcation();
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

          case Dialogs.Message.MSG_DOC_SEARCH                    :
            
            D.search(D.Types.PEDIDO_VENTA, self, Cairo.bool(info));
            break;

          case Dialogs.Message.MSG_DOC_DOC_EDIT:

            if(m_id) {

              if(m_docEditable) {
                P = M.showInfo(getText(1555, "")); // Este documento puede editarse normalmente
              }
              else {

                p = D.docCanBeSaved(m_dialog, CV.PV_FECHA).then(function(canBeSaved) {
                  if(canBeSaved) {

                    var editDoc = new Cairo.EditDocumento.Edit.Controller.getEditor();
                    editDoc.setClient(self);
                    return editDoc.edit(m_id, m_doctId, true);
                  }
                });
              }
            }
            else {
              P = M.showInfo(getText(1556, "")); // Esta opción solo sirve para modificar documentos guardados y aplicados
            }
            break;

          case Dialogs.Message.MSG_DOC_DOC_ACTION:

            if(m_id) {
              showMenuDocAction();
            }
            else {
              p = M.showInfo(getText(3955, "")); // Esta opción sólo sirve para modificar documentos guardados
            }
            break;

          case Dialogs.Message.MSG_MENU_AUX:

            switch (val(info)) {

              case MENU_SHOW_REMITO:
                showRemito();

                break;

              case MENU_SHOW_FACTURA:
                showFactura();
                break;

              case MENU_SHOW_INFO:
                if(m_id !== NO_ID) {
                  showInfo();
                }
                else {
                  M.showWarning(getText(1554, "")); // Antes de pedir Info sobre el Pedido debe guardarlo
                }
                break;
            }

            break;

          case Dialogs.Message.MSG_DOC_HISTORY:

            if(m_id !== NO_ID) {
              p = Cairo.History.show(Cairo.Tables.PEDIDOS_DE_VENTA, m_id, m_documento + " " + m_nrodoc);
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
        }

        return p || P.resolvedPromise();
      };

      // TODO: implement this
      var showInfo = function() {        
        // getText(1596, "") // Pendientes de Stock
        // "sp_DocPedidoVentaStockInfo "+ m_id
      };

      self.discardChanges = function() {
        Cairo.raiseError("PedidoVenta", "DiscardChanges was called");
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
                  m_lastDoctId = valField(response.data, C.DOCT_ID);
                  m_lastDocTipoPedido = valField(response.data, C.DOC_TIPO_PEDIDO);
                }
                return response.success;

              })
                .whenSuccess(function() {

                  var p = null;

                  // when the document property is changed and the dialog was
                  // editing a saved invoice we need to move to a new invoice
                  //
                  if(m_id !== NO_ID && m_docId !== m_lastDocId) {
                    p = self.edit(D.Constants.DOC_CHANGED);
                  }

                  return p || P.resolvedPromise(true);

                })
                .whenSuccess(function() {

                  return D.setDocNumber(m_lastDocId, m_dialog, CC.AS_NRODOC)
                    .then(function(enabled) {

                      m_taPropuesto = enabled;
                    });
                })
                .then(function() {

                  showHideCols(true);
                  setColorBackground();

                });
            }

            p = p || P.resolvedPromise();

            p.then(function() {
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

          case K_TRANS_ID:

            p = setDataTransporte();
            break;

          case K_CHOF_ID:

            p = setDataChofer();
            break;

          case K_HIDECOLS:

            showHideCols(false);
            break;
        }

        return p || P.resolvedPromise();
      };

      self.save = function() {
      
        var p = null;

        p = D.docCanBeEdited(m_docEditable, m_docEditMsg)
          .whenSuccess(function() {
            return D.docCanBeSaved(m_dialog, CV.PV_FECHA);
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
            
            register.setFieldId(CV.PV_ID);
            register.setTable(CV.PEDIDO_VENTA);

            register.setPath(m_apiPath + "ventas/pedidoventa");

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
                  fields.add(CV.PV_NUMERO, property.getValue(), Types.long);
                  break;

                case K_NRODOC:
                  fields.add(CV.PV_NRODOC, property.getValue(), Types.text);
                  break;

                case K_DESCRIP:
                  fields.add(CV.PV_DESCRIP, property.getValue(), Types.text);
                  break;

                case K_FECHA:
                  fields.add(CV.PV_FECHA, property.getValue(), Types.date);
                  break;

                case K_FECHAENTREGA:
                  fields.add(CV.PV_FECHA_ENTREGA, property.getValue(), Types.date);
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

                case K_RAM_ID_STOCK:
                  fields.add(CV.RAM_ID_STOCK, property.getSelectIntValue(), Types.text);
                  break;

                case K_DESCUENTO1:
                  fields.add(CV.PV_DESCUENTO1, property.getValue(), Types.currency);
                  break;

                case K_DESCUENTO2:
                  fields.add(CV.PV_DESCUENTO2, property.getValue(), Types.currency);
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
                  fields.add(CV.PV_DESTINATARIO, property.getValue(), Types.text);
                  break;

                case K_ORDENCOMPRA:
                  fields.add(CV.PV_ORDEN_COMPRA, property.getValue(), Types.text);
                  break;

                case K_CLIS_ID:
                  fields.add(C.CLIS_ID, property.getSelectId(), Types.id);
                  break;
              }
            }

            var _count = m_footerProps.size();
            for (var _i = 0; _i < _count; _i++) {
              
              property = m_footerProps.item(_i);

              switch (property.getKey()) {

                case K_TOTAL:
                  fields.add(CV.PV_TOTAL, property.getValue(), Types.currency);
                  break;

                case K_NETO:
                  fields.add(CV.PV_NETO, property.getValue(), Types.currency);
                  break;

                case K_IVA_RI:
                  fields.add(CV.PV_IVA_RI, property.getValue(), Types.currency);
                  break;

                case K_IVA_RNI:
                  fields.add(CV.PV_IVA_RNI, property.getValue(), Types.currency);
                  break;

                case K_SUBTOTAL:
                  fields.add(CV.PV_SUBTOTAL, property.getValue(), Types.currency);
                  break;

                case K_IMPORTEDESC1:
                  fields.add(CV.PV_IMPORTE_DESC1, property.getValue(), Types.currency);
                  break;

                case K_IMPORTEDESC2:
                  fields.add(CV.PV_IMPORTE_DESC2, property.getValue(), Types.currency);
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

                        if(success) {

                          Cairo.navigate(self.getPath());
                          if(m_listController !== null) {
                            updateList();
                            m_listController.updateEditorKey(self, m_id);
                          }
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
        return "#venta/pedidodeventa/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "pedidoventa" + id;
      };

      self.getTitle = function() {
        return TITLE + (m_id !== NO_ID ? " " + m_nrodoc + " - " + m_cliente : "");
      };

      self.getTabTitle = function() {
        return "PV-" + m_numero;
      };

      self.validate = function() {

        for (var _i = 0, _count = m_properties.size(); _i < _count; _i++) {

          var property = m_properties.item(_i);

          switch (property.getKey()) {
            case K_FECHA:
              if(valEmpty(property.getValue(), Types.date)) {
                M.showInfo(getText(1558, "")); // Debe indicar una fecha
              }
              break;

            case K_FECHAENTREGA:
              if(valEmpty(property.getValue(), Types.date)) {
                M.showInfo(getText(1564, "")); // Debe indicar una Fecha de entrega
              }
              break;

            case K_CLI_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                M.showInfo(getText(1563, "")); // Debe indicar un Cliente
              }
              break;

            case K_DOC_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                M.showInfo(getText(1562, "")); // Debe indicar un Documento
              }
              break;

            case K_CPG_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                M.showInfo(getText(1561, "")); // Debe indicar una Condición de Pago
              }
              break;

            case K_SUC_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                M.showInfo(getText(1560, "")); // Debe indicar una Sucursal
              }
              break;

            case K_RAM_ID_STOCK:
              if(Cairo.getStockConfig().getStockPedidoVta()) {
                if(valEmpty(property.getSelectIntValue(), Types.text)) {
                  M.showInfo(getText(1559, "")); // Debe indicar un Depósito
                }
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
          Cairo.manageErrorEx(ex.message, ex, "validateRow", C_MODULE, "");
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

            return true;

          }
          catch(ex) {
            Cairo.manageErrorEx(ex.message, ex, "loadForPrint", C_MODULE, "");
          }

          return false;
        };

        var p = DB.getData("load[" + m_apiPath + "ventas/pedidoventa/info]",id)
          .whenSuccessWithResult(loadData, false);

        return p;
      };

      self.getDialog = function() {
        return m_dialog;
      };

      self.list = function() {
        return Cairo.Security.hasPermissionTo(CS.LIST_PEDIDO);
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
            CS.LIST_PEDIDO,
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
            if(id !== D.Constants.DOC_CHANGED && m_isNew && docDesdePresupuesto()) {

              showStartWizardPresupuesto();
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
        var p = null;

        try {

          switch (key) {

            case K_ITEMS:

              var property = m_items.getProperties().item(C_ITEMS);
              showImporteAndIva(property.getGrid().getRows().item(lRow));
              updateTotals();

              var colKey = null;
              colKey = property.getGrid().getColumns().item(lCol).getKey();
              if(colKey === KI_PR_ID || colKey === KI_CANTIDAD) {
                var rows = property.getGrid().getRows();
                p = showStock(rows.item(lRow), rows);
              }
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnAfterUpdate", C_MODULE, "");
        }

        return p || P.resolvedPromise(true);
      };

      var showStock = function(row, rows) {
        // TODO: implement this (take a look at original code in translated)
        return P.resolvedPromise(true);
      };

      var getRamIdStock = function() {
        return m_properties.item(CV.RAM_ID_STOCK);
      };

      var processMultiRow = function(virtualRow) {
        var p = null;

        virtualRow.setSuccess(false);

        switch (virtualRow.getInfo().getKey()) {
          case K_ITEMS:
            var items = getItems();

            var row = null;
            row = items.getGrid().getRows.item(virtualRow.row);

            if(row.item(virtualRow.col).getKey() === KI_PR_ID) {

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

      self.columnAfterEdit = function(key, lRow, lCol, newValue, newValueID) {
        var p = null;

        try {

          switch (key) {
            case K_ITEMS:
              var property = getProperty(m_items, C_ITEMS);
              p = columnAfterEditItems(property, lRow, lCol, newValue, newValueID);
              break;
          }

        }
        catch (ex) {
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
              rtn = columnBeforeEdit(property, lRow, lCol, iKeyAscii);
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnBeforeEdit", C_MODULE, "");
        }

        return P.resolvedPromise(rtn);
      };

      var columnBeforeEdit = function(property, lRow, lCol, iKeyAscii) {
        return true;
      };

      var getPrecioFromRow = function(row) {
        var precio = null;

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

            Cairo.LoadingMessage.show("Pedido de Ventas", "Loading data for product.");

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
        return P.resolvedPromise(false);
      };

      self.columnClick = function(key, lRow, lCol) {

      };

      self.gridDblClick = function(key, lRow, lCol) {
        return P.resolvedPromise(false);
      };

      self.deleteRow = function(key, row, lRow) {

        switch (key) {

          case K_ITEMS:

            var id = cellFloat(row, KI_PVI_ID);
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
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "validateRow", C_MODULE, "");
        }

        return p || P.resolvedPromise(false);
      };

      var isEmptyRowItems = function(row, rowIndex) {

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {

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

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KI_CANTIDAD:
              if(valEmpty(cell.getValue(), Types.currency)) {
                return M.showInfoWithFalse(getText(1365, "", strRow)); // Debe indicar una cantidad (1)
              }
              break;

            case KI_PR_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(1565, "", strRow)); // Debe indicar un Producto de Venta (1)
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var loadCollection = function() {

        var validateDocDefault = false;
        var elem;

        m_dialog.setUseSelectIntValue(true);

        var properties = m_properties;
        m_properties.clear();

        var tabs = m_dialog.getTabs();
        tabs.clear();

        tabs.add(null).setIndex(0).setName(Cairo.Constants.TAB_GENERAL);
        tabs.add(null).setIndex(1).setName(getText(1566, "")); // Adicionales
        tabs.add(null).setIndex(2).setName(getText(4909, "")); // Descuentos
        tabs.add(null).setIndex(3).setName(getText(1050, "")); // Transporte
        tabs.add(null).setIndex(4).setName(getText(1861, "")); // Observaciones

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
          elem.setSelectId(Cairo.UserConfig.getDocPvId());
          elem.setValue(Cairo.UserConfig.getDocPvNombre());

          validateDocDefault = elem.getSelectId() !== NO_ID;
        }

        elem.setSelectFilter(D.PEDIDO_VENTAS_DOC_FILTER);

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

        elem = properties.add(null, CV.PV_FECHA);
        elem.setType(T.date);
        elem.setName(getText(1569, "")); // Fecha
        elem.setKey(K_FECHA);
        elem.setValue(m_fecha);

        elem = properties.add(null, CV.PV_FECHA_ENTREGA);
        elem.setType(T.date);
        elem.setName(getText(1570, "")); // Entrega
        elem.setKey(K_FECHAENTREGA);
        elem.setValue(m_fechaentrega);

        elem = properties.add(null, C.CLI_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CLIENTE);
        elem.setName(getText(1150, "")); // Cliente
        elem.setKey(K_CLI_ID);
        elem.setSelectId(m_cliId);
        elem.setValue(m_cliente);
        m_dialog.setNewPropertyKeyFocus(C.CLI_ID);

        elem = properties.add(null, CV.PV_NRODOC);
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
        elem.setName(getText(1571, "")); // Cond. Pago
        elem.setKey(K_CPG_ID);
        elem.setSelectId(m_cpgId);
        elem.setValue(m_condicionPago);

        elem = properties.add(null, CV.PV_DESCUENTO1);
        elem.setType(T.numeric);
        elem.setSubType(ST.percentage);
        elem.setName(getText(1573, "")); // Desc. 1
        elem.setKey(K_DESCUENTO1);
        elem.setValue(m_descuento1);
        elem.setTabIndex(2);

        elem = properties.add(null, CV.PV_DESCUENTO2);
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
        elem.setName(getText(1398, "")); // Lista de Descuentos
        elem.setSelectFilter(D.getListaDescuentoForCliente(m_docId, m_cliId));
        elem.setKey(K_LD_ID);
        elem.setSelectId(m_ldId);
        elem.setValue(m_listaDescuento);
        elem.setTabIndex(2);

        elem = properties.add(null, CV.RAM_ID_STOCK);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.DEPOSITO_LOGICO);
        elem.setName(getText(1574, "")); // Depósito
        elem.setKey(K_RAM_ID_STOCK);

        if(val(m_ramIdStock) !== NO_ID) {

          elem.setSelectId(val(m_ramIdStock));
          elem.setSelectIntValue(m_ramIdStock);
          elem.setValue(m_ramaStock);

        }
        else {
          
          elem.setSelectIntValue(Cairo.UserConfig.getDeplRamId());
          elem.setSelectId(Cairo.UserConfig.getDeplId());
          elem.setValue(Cairo.UserConfig.getDeplNombre());
          
        }

        elem.setSelectType(Cairo.Select.SelectType.tree);

        elem = properties.add(null, C.VEN_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.VENDEDOR);
        elem.setName(getText(1510, "")); // Vendedor
        elem.setKey(K_VEN_ID);
        elem.setSelectId(m_venId);
        elem.setValue(m_vendedor);
        elem.setTabIndex(1);

        elem = properties.add(null, C.CCOS_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CENTROS_DE_COSTO);
        elem.setName(getText(1057, "")); // Centro de Costo
        elem.setKey(K_CCOS_ID);
        elem.setSelectId(m_ccosId);
        elem.setValue(m_centroCosto);

        elem = properties.add(null, C.SUC_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.SUCURSAL);
        elem.setName(getText(1281, "")); // Sucursal
        elem.setKey(K_SUC_ID);
        elem.setSelectId(m_sucId);
        elem.setValue(m_sucursal);

        elem = properties.add(null, CV.PV_DESCRIP);
        elem.setType(T.text);
        elem.setSubType(ST.memo);
        elem.setName(getText(1618, ""));
        elem.setSize(5000);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);
        elem.setTabIndex(4);

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

        elem = properties.add(null, CV.PV_ORDEN_COMPRA);
        elem.setType(T.text);
        elem.setName(getText(1924, "")); // Orden de Compra
        elem.setKey(K_ORDENCOMPRA);
        elem.setValue(m_ordenCompra);
        elem.setTabIndex(1);

        elem = properties.add(null, C.TRANS_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.TRANSPORTE);
        elem.setName(getText(1050, "")); // Transporte
        elem.setKey(K_TRANS_ID);
        elem.setValue(m_transporte);
        elem.setSelectId(m_transId);
        elem.setTabIndex(3);

        elem = properties.add(null, C.CHOF_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CHOFER);
        elem.setName(getText(1051, "")); // Chofer
        elem.setKey(K_CHOF_ID);
        elem.setValue(m_chofer);
        elem.setSelectId(m_chofId);
        elem.setSelectFilter(D.getSelectFilterChofer(m_transId));
        elem.setTabIndex(3);

        elem = properties.add(null, C.CAM_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CAMIONES);
        elem.setName(getText(3489, "")); // Camion
        elem.setKey(K_CAM_ID);
        elem.setValue(m_camion);
        elem.setSelectId(m_camId);
        elem.setSelectFilter(D.getSelectFilterCamion(m_transId));
        elem.setTabIndex(3);

        elem = properties.add(null, C.CAM_ID_SEMI);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CAMIONES_SEMI);
        elem.setName(getText(3493, "")); // Semi
        elem.setKey(K_CAM_ID_SEMI);
        elem.setValue(m_semi);
        elem.setSelectId(m_camIdSemi);
        elem.setSelectFilter(D.getSelectFilterCamion(m_transId));
        elem.setTabIndex(3);

        elem = properties.add(null, CV.PV_DESTINATARIO);
        elem.setType(T.text);
        elem.setSubType(ST.memo);
        elem.setName(getText(3494, "")); // Destinatario
        elem.setKey(K_DESTINATARIO);
        elem.setValue(m_destinatario);
        elem.setTabIndex(3);

        if(Cairo.UserConfig.getShowDataAddInVentas()) {

          elem = properties.add(null, CV.CLIENTE_DATA_ADD);
          elem.setType(T.text);
          elem.setSubType(ST.memo);
          elem.setTabIndex(4);

        }

        elem = properties.add(null, Cairo.Constants.HIDE_COLUMNS);
        elem.setType(T.check);
        elem.setName(getText(3901, "")); // Ocultar Columnas
        elem.setKey(K_HIDECOLS);
        elem.setValue(true);
        elem.setIsEditProperty(false);

        if(!m_dialog.show(self)) { return false; }

        /////////////////////////////////////////////////////////////////////
        // ITEMS
        /////////////////////////////////////////////////////////////////////

        tabs = m_items.getTabs();
        tabs.clear();

        tabs.add(null).setName(getText(1371, "")); // Items

        properties = m_itemsProps;
        properties.clear();

        elem = properties.add(null, C_ITEMS);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridItems(elem);
        loadItems(elem);
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

        properties = m_footerProps;
        properties.clear();

        elem = properties.add(null, CV.PV_SUBTOTAL);
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setName(getText(1579, "")); // Sub Total
        elem.setKey(K_SUBTOTAL);
        elem.setValue(m_subTotal);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.PV_IMPORTE_DESC1);
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setName(getText(1573, "")); // Desc. 1
        elem.setKey(K_IMPORTEDESC1);
        elem.setValue(m_importeDesc1);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.PV_IMPORTE_DESC2);
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setName(getText(1580, "")); // Desc. 2
        elem.setKey(K_IMPORTEDESC2);
        elem.setValue(m_importeDesc2);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.PV_NETO);
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setName(getText(1581, "")); // Neto
        elem.setKey(K_NETO);
        elem.setValue(m_neto);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.PV_IVA_RI);
        elem.setType(T.numeric);
        elem.setName(getText(1582, "")); // IVA RI
        elem.setSubType(ST.money);
        elem.setKey(K_IVA_RI);
        elem.setValue(m_ivaRi);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.PV_IVA_RNI);
        elem.setType(T.numeric);
        elem.setName(getText(1583, "")); // IVA RNI
        elem.setSubType(ST.money);
        elem.setKey(K_IVA_RNI);
        elem.setValue(m_ivaRni);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.PV_TOTAL);
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

        D.showDataAddCliente(Cairo.UserConfig.getShowDataAddInVentas(), m_dialog);

        setColorBackground();

        return true;
      };

      var getDocId = function() {
        return m_dialog.getProperties().item(C.DOC_ID);
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
        elem.setKey(KI_PVI_ID);

        elem = columns.add(null);
        elem.setName(getText(1367, "")); // Articulo
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PRODUCTOS_DE_VENTA);
        elem.setKey(KI_PR_ID);
        if(Cairo.UserConfig.getMultiSelect()) {
          elem.setSelectType(Cairo.Select.SelectType.tree);
        }

        elem = columns.add(null);
        elem.setName(getText(1618, ""));
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
        elem.setName(getText(3568, "")); // Disponible
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());
        elem.setType(T.text);
        elem.setEnabled(false);
        elem.setKey(KI_STOCK);

        elem = columns.add(null);
        elem.setName(getText(3567, "")); // Sotck Real
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());
        elem.setType(T.text);
        elem.setEnabled(false);
        elem.setKey(KI_STOCK_REAL);

        elem = columns.add(null);
        elem.setName(getText(1694, "")); // Pedidos
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());
        elem.setType(T.text);
        elem.setEnabled(false);
        elem.setKey(KI_STOCK_PEDIDOS);

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
        elem.setEnabled(Cairo.Security.silentHasPermissionTo(CS.EDIT_PRICE_PED));

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

        grid.getRows().clear();
      };

      var loadItems = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();

        for(var _i = 0, count = m_data.items.length; _i < count; _i += 1) {

          var row = rows.add(null, getValue(m_data.items[_i], CV.PVI_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.PVI_ID));
          elem.setKey(KI_PVI_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], C.PR_NAME_VENTA));
          elem.setId(getValue(m_data.items[_i], C.PR_ID));
          elem.setKey(KI_PR_ID);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.PVI_DESCRIP));
          elem.setKey(KI_DESCRIP);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.PVI_CANTIDAD));
          elem.setKey(KI_CANTIDAD);

          elem = row.add(null);
          elem.setValue("");
          elem.setKey(KI_STOCK);

          elem = row.add(null);
          elem.setValue("");
          elem.setKey(KI_STOCK_REAL);

          elem = row.add(null);
          elem.setValue("");
          elem.setKey(KI_STOCK_PEDIDOS);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.PVI_DESCUENTO));
          elem.setKey(KI_DESCUENTO);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], C.UN_NAME));
          elem.setKey(KI_UNIDAD);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.PVI_PRECIO_LISTA));
          elem.setKey(KI_PRECIO_LP);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.PVI_PRECIO_USR));
          elem.setKey(KI_PRECIO_USR);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.PVI_PRECIO));
          elem.setKey(KI_PRECIO);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.PVI_NETO));
          elem.setKey(KI_NETO);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.PVI_IVA_RI));
          elem.setKey(KI_IVA_RI);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.PVI_IVA_RNI));
          elem.setKey(KI_IVA_RNI);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], CV.PVI_IMPORTE));
          elem.setKey(KI_IMPORTE);

          elem = row.add(null);
          if(m_bIva) {
            elem.setValue(getValue(m_data.items[_i], CV.PVI_IVA_RIPORC));
          }
          else {
            elem.setValue(0);
          }
          elem.setKey(KI_IVA_RI_PERCENT);

          elem = row.add(null);
          if(m_bIvaRni) {
            elem.setValue(getValue(m_data.items[_i], CV.PVI_IVA_RNIPORC));
          }
          else {
            elem.setValue(0);
          }
          elem.setKey(KI_IVA_RNI_PERCENT);

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[_i], C.CCOS_NAME));
          elem.setId(getValue(m_data.items[_i], C.CCOS_ID));
          elem.setKey(KI_CCOS_ID);

        }

        return true;
      };

      var loadDataFromResponse = function(response) {
        var data = response.data;

        data.items = data.get('items');

        return data;
      };

      var load = function(id) {

        m_data = emptyData;

        return DB.getData("load[" + m_apiPath + "ventas/pedidoventa]", id).then(
          function(response) {

            var p = null;

            if(response.success !== true) { return false; }

            if(response.data.id !== NO_ID) {

              m_data = loadDataFromResponse(response);

              var data = response.data;

              m_id = valField(data, CV.PV_ID);
              m_numero = valField(data, CV.PV_NUMERO);
              m_nrodoc = valField(data, CV.PV_NRODOC);
              m_descrip = valField(data, CV.PV_DESCRIP);
              m_fecha = valField(data, CV.PV_FECHA);
              m_fechaentrega = valField(data, CV.PV_FECHA_ENTREGA);
              m_neto = valField(data, CV.PV_NETO);
              m_ivaRi = valField(data, CV.PV_IVA_RI);
              m_ivaRni = valField(data, CV.PV_IVA_RNI);
              m_total = valField(data, CV.PV_TOTAL);
              m_subTotal = valField(data, CV.PV_SUBTOTAL);
              m_descuento1 = valField(data, CV.PV_DESCUENTO1);
              m_descuento2 = valField(data, CV.PV_DESCUENTO2);
              m_importeDesc1 = valField(data, CV.PV_IMPORTE_DESC1);
              m_importeDesc2 = valField(data, CV.PV_IMPORTE_DESC2);
              m_cliId = valField(data, C.CLI_ID);
              m_cliente = valField(data, C.CLI_NAME);
              m_ccosId = valField(data, C.CCOS_ID);
              m_centroCosto = valField(data, C.CCOS_NAME);
              m_sucId = valField(data, C.SUC_ID);
              m_sucursal = valField(data, C.SUC_NAME);
              m_docId = valField(data, C.DOC_ID);
              m_documento = valField(data, C.DOC_NAME);
              m_doctId = valField(data, C.DOCT_ID);
              m_lpId = valField(data, C.LP_ID);
              m_listaPrecio = valField(data, C.LP_NAME);
              m_cpgId = valField(data, C.CPG_ID);
              m_condicionPago = valField(data, C.CPG_NAME);
              m_ldId = valField(data, C.LD_ID);
              m_listaDescuento = valField(data, C.LD_NAME);
              m_estId = valField(data, C.EST_ID);
              m_estado = valField(data, C.EST_NAME);
              m_firmado = valField(data, CV.PV_FIRMADO);
              m_ramIdStock = valField(data, CV.RAM_ID_STOCK);
              m_ramaStock = valField(data, CV.RAMA_STOCK);
              m_docEditable = valField(data, C.DOC_EDITABLE);
              m_docEditMsg = valField(data, C.DOC_EDIT_MSG);

              m_venId = valField(data, C.VEN_ID);
              m_vendedor = valField(data, C.VEN_NAME);
              m_lgjId = valField(data, C.LGJ_ID);
              m_legajo = valField(data, C.LGJ_CODE);
              m_proIdOrigen = valField(data, C.PRO_ID_ORIGEN);
              m_proOrigen = valField(data, C.PRO_ORIGEN_NAME);
              m_proIdDestino = valField(data, C.PRO_ID_DESTINO);
              m_proDestino = valField(data, C.PRO_DESTINO_NAME);
              m_transId = valField(data, C.TRANS_ID);
              m_transporte = valField(data, C.TRANS_NAME);

              m_chofId = valField(data, C.CHOF_ID);
              m_chofer = valField(data, C.CHOF_NAME);

              m_camId = valField(data, C.CAM_ID);
              m_camion = valField(data, C.CAM_PATENTE);

              m_camIdSemi = valField(data, C.CAM_ID_SEMI);
              m_semi = valField(data, C.CAM_PATENTE_SEMI);

              m_destinatario = valField(data, CV.PV_DESTINATARIO);
              m_ordenCompra = valField(data, CV.PV_ORDEN_COMPRA);

              m_clisId = valField(data, C.CLIS_ID);
              m_clienteSucursal = valField(data, C.CLIS_NAME);

              m_taPropuesto = valField(data, C.TA_PROPUESTO);
              m_taMascara = valField(data, C.TA_MASCARA);

              m_bIva = valField(data, C.HAS_IVA_RI);
              m_bIvaRni = valField(data, C.HAS_IVA_RNI);

              m_lastDocId = m_docId;
              m_lastCliId = m_cliId;
              m_lastDocTipoPedido = valField(data, C.DOC_TIPO_PEDIDO);
              m_lastTransId = m_transId;
              m_lastChofId = m_chofId;
              m_lastDocName = m_documento;
              m_lastCliName = m_cliente;

            }
            else {
              m_id = NO_ID;
              m_numero = 0;
              m_nrodoc = "";
              m_descrip = "";
              m_fecha = Cairo.Dates.today();
              m_fechaentrega = Cairo.Dates.tomorrow();
              m_neto = 0;
              m_ivaRi = 0;
              m_ivaRni = 0;
              m_total = 0;
              m_subTotal = 0;
              m_descuento1 = 0;
              m_descuento2 = 0;
              m_importeDesc1 = 0;
              m_importeDesc2 = 0;
              m_ccosId = NO_ID;
              m_centroCosto = "";
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

              m_ramIdStock = "0";
              m_ramaStock = "";

              m_clisId = NO_ID;
              m_clienteSucursal = "";

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
              m_chofId = NO_ID;
              m_chofer = "";
              m_camId = NO_ID;
              m_camion = "";
              m_camIdSemi = NO_ID;
              m_semi = "";
              m_destinatario = "";
              m_ordenCompra = "";

              m_taPropuesto = false;
              m_taMascara = "";

              m_docId = m_lastDocId;
              m_cliId = m_lastCliId;
              m_cliente = m_lastCliName;
              m_documento = m_lastDocName;

              m_lastTransId = NO_ID;
              m_lastChofId = NO_ID;

              m_bIvaRni = false;
              m_bIva = false;

              p = D.editableStatus(m_docId, CS.NEW_PEDIDO)
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

        transaction.setTable(CV.PEDIDO_VENTA_ITEM_TMP);

        var rows = getGrid(m_items, C_ITEMS).getRows();

        for (var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();
          register.setFieldId(CV.PVI_TMP_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var fields = register.getFields();

          var _countj = row.size();
          for (var _j = 0; _j < _countj; _j++) {

            var cell = row.item(_j);
            switch (cell.getKey()) {

              case KI_PVI_ID:
                if(m_copy) {
                  fields.add(CV.PVI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(CV.PVI_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KI_CANTIDAD:
                fields.add(CV.PVI_CANTIDAD, cell.getValue(), Types.double);
                break;

              case KI_DESCRIP:
                fields.add(CV.PVI_DESCRIP, cell.getValue(), Types.text);
                break;

              case KI_PRECIO:
                fields.add(CV.PVI_PRECIO, cell.getValue(), Types.currency);
                break;

              case KI_PRECIO_LP:
                fields.add(CV.PVI_PRECIO_LISTA, cell.getValue(), Types.currency);
                break;

              case KI_PRECIO_USR:
                fields.add(CV.PVI_PRECIO_USR, cell.getValue(), Types.currency);
                break;

              case KI_DESCUENTO:
                fields.add(CV.PVI_DESCUENTO, cell.getValue(), Types.text);
                break;

              case KI_IMPORTE:
                fields.add(CV.PVI_IMPORTE, cell.getValue(), Types.currency);
                break;

              case KI_NETO:
                fields.add(CV.PVI_NETO, cell.getValue(), Types.currency);
                break;

              case KI_IVA_RI:
                if(m_bIva) {
                  fields.add(CV.PVI_IVA_RI, cell.getValue(), Types.currency);
                }
                break;

              case KI_IVA_RNI:
                if(m_bIvaRni) {
                  fields.add(CV.PVI_IVA_RNI, cell.getValue(), Types.currency);
                }
                break;

              case KI_IVA_RI_PERCENT:
                  fields.add(CV.PVI_IVA_RIPORC, cell.getValue(), Types.double);
                break;

              case KI_IVA_RNI_PERCENT:
                  fields.add(CV.PVI_IVA_RNIPORC, cell.getValue(), Types.double);
                break;

              case KI_PR_ID:
                fields.add(C.PR_ID, cell.getId(), Types.id);
                break;

              case KI_CCOS_ID:
                fields.add(C.CCOS_ID, cell.getId(), Types.id);
                break;
            }
          }

          orden += 1;
          fields.add(CV.PVI_ORDEN, orden, Types.integer);

          transaction.addRegister(register);
        }

        if(m_itemsDeleted !== "" && m_id !== NO_ID && !m_copy) {

          transaction.setDeletedList(m_itemsDeleted);
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var docAsistTipo = function() {
        return m_lastDocTipoPedido;
      };
      
      var docDesdePresupuesto = function() {
        return docAsistTipo() === D.OrderWizardType.presupuesto;
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

      var updateTotals = function() { // TODO: Use of ByRef founded Private Sub updateTotals(ByRef Rows As CSInterfacesABM.cIABMGridRows)

        var rows = getGrid(m_items, C_ITEMS).getRows();

        var neto = 0;
        var ivaRi = 0;
        var ivaRni = 0;

        for (var _i = 0, _count = rows.size(); _i < _count; _i++) {
          var row = rows.item(_i);
          neto = neto + cellFloat(row, KI_NETO);
          ivaRi = ivaRi + cellFloat(row, KI_IVA_RI);
          ivaRni = ivaRni + cellFloat(row, KI_IVA_RNI);
        }

        var properties = m_footer.getProperties();
        properties.item(CV.PV_SUBTOTAL).setValue(neto);

        var desc1 = val(m_properties.item(CV.PV_DESCUENTO1).getValue());
        var desc2 = val(m_properties.item(CV.PV_DESCUENTO2).getValue());

        ivaRi = ivaRi - (ivaRi * desc1 / 100);
        ivaRni = ivaRni - (ivaRni * desc1 / 100);

        ivaRi = ivaRi - (ivaRi * desc2 / 100);
        ivaRni = ivaRni - (ivaRni * desc2 / 100);

        desc1 = neto * desc1 / 100;
        properties.item(CV.PV_IMPORTE_DESC1).setValue(desc1);

        neto = neto - desc1;

        desc2 = neto * desc2 / 100;
        properties.item(CV.PV_IMPORTE_DESC2).setValue(desc2);

        neto = neto - desc2;

        properties.item(CV.PV_NETO).setValue(neto);
        properties.item(CV.PV_IVA_RI).setValue(ivaRi);
        properties.item(CV.PV_IVA_RNI).setValue(ivaRni);
        properties.item(CV.PV_TOTAL).setValue(neto + ivaRni + ivaRi);

        m_footer.refreshControls();
      };

      var setTasasImpositivas = function(row, pr_id, pr_nombre) {
        var p = null;

        if(pr_id === 0) {

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

        var p = DB.getData(
          "load[" + m_apiPath + "general/producto/" + prId.toString() + "/stock/cliente]", getCliId());

        return p.whenSuccessWithResult(function(response) {
          getCell(row, KI_UNIDAD).setValue(valField(response.data, C.UN_NAME_VENTA));

          var cell = getCell(row, KI_CCOS_ID);
          cell.setValue(valField(response.data, C.CCOS_NAME_VENTA));
          cell.setId(valField(response.data, C.CCOS_ID_VENTA));

          return true;
        });
      };

      var setEnabled = function() {
        var bState = false;

        // when the document requires base document like a purchase order or a delivery note
        // it can't be edited. the user must click the new button and use the wizard.
        //
        if(docDesdePresupuesto() && m_id === NO_ID) {
          bState = false;
        }
        else if(m_docEditable) {
          bState = getDocId().getSelectId() !== NO_ID;
        }
        else {
          bState = false;
        }

        var _count = m_properties.size();
        for (var _i = 0; _i < _count; _i++) {
          var prop = m_properties.item(_i);
          if(prop.getKey() !== K_DOC_ID
            && prop.getKey() !== K_NUMERO
            && prop.getKey() !== K_EST_ID
            && prop.getKey() !== K_HIDECOLS) {

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

        var _count = m_itemsProps.size();
        for (var _i = 0; _i < _count; _i++) {
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
          .setSelectIntValue("")
          .setValue(m_documento);

        m_properties.item(CV.PV_FECHA)
          .setValue(m_fecha);

        m_properties.item(CV.PV_FECHA_ENTREGA)
          .setValue(m_fechaentrega);

        m_properties.item(C.CLI_ID)
          .setSelectId(m_cliId)
          .setSelectIntValue("")
          .setValue(m_cliente);

        m_properties.item(Cairo.Constants.NUMBER_ID)
          .setValue(m_numero);

        m_properties.item(Cairo.Constants.STATUS_ID)
          .setValue(m_estado);

        m_properties.item(CV.PV_NRODOC)
          .setValue(m_nrodoc)
          .setTextMask(m_taMascara)
          .setTextAlign(Dialogs.TextAlign.right);

        m_properties.item(CV.PV_DESCUENTO1)
          .setValue(m_descuento1);

        m_properties.item(CV.PV_DESCUENTO2)
          .setValue(m_descuento2);

        if(val(m_ramIdStock) !== NO_ID) {
          m_properties.item(CV.RAM_ID_STOCK)
            .setSelectIntValue(m_ramIdStock)
            .setSelectId(val(m_ramIdStock))
            .setValue(m_ramaStock);
        }
        else {
          m_properties.item(CV.RAM_ID_STOCK)
            .setSelectIntValue(Cairo.UserConfig.getDeplRamId())
            .setSelectId(Cairo.UserConfig.getDeplId())
            .setValue(Cairo.UserConfig.getDeplNombre());
        }

        m_properties.item(C.CPG_ID)
          .setSelectId(m_cpgId)
          .setSelectIntValue("")
          .setValue(m_condicionPago);

        m_properties.item(C.LP_ID)
          .setSelectFilter(D.getListaPrecioForCliente(m_docId, m_cliId))
          .setSelectId(m_lpId)
          .setSelectIntValue("")
          .setValue(m_listaPrecio);

        m_properties.item(C.LD_ID)
          .setSelectFilter(D.getListaDescuentoForCliente(m_docId, m_cliId))
          .setSelectId(m_ldId)
          .setSelectIntValue("")
          .setValue(m_listaDescuento);

        m_properties.item(C.CCOS_ID)
          .setSelectId(m_ccosId)
          .setSelectIntValue("")
          .setValue(m_centroCosto);

        m_properties.item(C.SUC_ID)
          .setSelectId(m_sucId)
          .setSelectIntValue("")
          .setValue(m_sucursal);

        m_properties.item(C.VEN_ID)
          .setSelectId(m_venId)
          .setSelectIntValue("")
          .setValue(m_vendedor);

        m_properties.item(CV.PV_DESCRIP)
          .setValue(m_descrip);

        m_properties.item(C.LGJ_ID)
          .setSelectId(m_lgjId)
          .setSelectIntValue("")
          .setValue(m_legajo);

        m_properties.item(C.PRO_ID_ORIGEN)
          .setSelectId(m_proIdOrigen)
          .setSelectIntValue("")
          .setValue(m_proOrigen);

        m_properties.item(C.PRO_ID_DESTINO)
          .setSelectId(m_proIdDestino)
          .setSelectIntValue("")
          .setValue(m_proDestino);

        m_properties.item(C.TRANS_ID)
          .setSelectId(m_transId)
          .setSelectIntValue("")
          .setValue(m_transporte);

        m_properties.item(CV.PV_DESTINATARIO)
          .setValue(m_destinatario);

        m_properties.item(CV.PV_ORDEN_COMPRA)
          .setValue(m_ordenCompra);

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

        m_properties.item(C.CLIS_ID)
          .setSelectId(m_clisId)
          .setSelectIntValue("")
          .setValue(m_clienteSucursal);

        m_dialog.showValues(m_dialog.getProperties());
        m_dialog.resetChanged();

        m_itemsDeleted = "";
        loadItems(getProperty(m_items, C_ITEMS));

        m_items.showValues(m_itemsProps);

        m_footerProps.item(CV.PV_SUBTOTAL)
          .setValue(m_subTotal);

        m_footerProps.item(CV.PV_IMPORTE_DESC1)
          .setValue(m_importeDesc1);

        m_footerProps.item(CV.PV_IMPORTE_DESC2)
          .setValue(m_importeDesc2);

        m_footerProps.item(CV.PV_NETO)
          .setValue(m_neto);

        m_footerProps.item(CV.PV_IVA_RI)
          .setValue(m_ivaRi);

        m_footerProps.item(CV.PV_IVA_RNI)
          .setValue(m_ivaRni);

        m_footerProps.item(CV.PV_TOTAL)
          .setValue(m_total);

        m_footer.showValues(m_footerProps);

        setEnabled();

        return D.showDataAddCliente(Cairo.UserConfig.getShowDataAddInVentas(), m_dialog)

      };

      var showApplycationcation = function() {

        if(!Cairo.Security.docHasPermissionTo(
          CS.MODIFY_APLIC,
          m_docId,
          Cairo.Security.ActionTypes.apply)) {
          return false;
        }

        if(m_applyEditor === null) {
          m_applyEditor = Cairo.PedidoVentaAplic.createObject();
        }
        else {
          if(m_applyEditor.getId() !== m_id) {
            m_applyEditor.setClient(null);
            m_applyEditor = Cairo.PedidoVentaAplic.createObject();
          }
        }

        m_applyEditor.setClient(self);

        m_applyEditor.show(
            m_id,
            m_total,
            m_nrodoc,
            m_cliId,
            m_cliente,
            m_sucId,
            m_docId,
            m_doctId === D.Types.DEVOLUCION_PEDIDO_VTA).then(function(result) {
            if(result !== true) {
              m_applyEditor = null;
            }
          });
      };

      var setDataTransporte = function() {
        var p;
        var property = m_properties.item(C.TRANS_ID);

        if(m_lastTransId !== property.getSelectId()) {

          m_lastTransId = property.getSelectId();

          p = DB.getData(
            "load[" + m_apiPath + "general/transporte/" + m_lastTransId.toString() + "/info]");

          p = p.whenSuccessWithResult(function(response) {

            var chofId = valField(response.data, C.CHOF_ID);
            var camId = valField(response.data, C.CAM_ID);
            var chofer = valField(response.data, C.CHOF_NAME);
            var camion = valField(response.data, C.CAM_CODE);

            property = m_properties.item(C.CHOF_ID);
            property.setSelectFilter(D.getSelectFilterChofer(m_transId));

            if(camId !== NO_ID) {

              property.setValue(chofer);
              property.setSelectId(chofId);

            }

            m_dialog.showValue(property);

            property = m_properties.item(C.CAM_ID);
            property.setSelectFilter(D.getSelectFilterCamion(m_transId));

            if(camId !== NO_ID) {

              property.setValue(camion);
              property.setSelectId(camId);

            }

            m_dialog.showValue(property);

          });
        }
        return p || P.resolvedPromise(false);
      };

      var setDataChofer = function() {
        var p;
        var property = m_properties.item(C.CHOF_ID);

        if(m_lastChofId !== property.getSelectId()) {
          m_lastChofId = property.getSelectId();

          p = DB.getData(
            "load[" + m_apiPath + "general/chofer/" + m_lastChofId.toString() + "/info]");

          p = p.whenSuccessWithResult(function(response) {

            var camId = valField(response.data, C.CAM_ID);
            var camion = valField(response.data, C.CAM_CODE);
            var camIdSemi = valField(response.data, C.CAM_ID_SEMI);
            var semi = valField(response.data, C.CAM_CODE_SEMI);

            property = m_properties.item(C.CAM_ID); // Camion

            if(camId !== NO_ID) {

              property.setValue(camion);
              property.setSelectId(camId);

            }

            m_dialog.showValue(property);

            property = m_properties.item(C.CAM_ID_SEMI); // Semi

            if(camIdSemi !== NO_ID) {

              property.setValue(semi);
              property.setSelectId(camIdSemi);

            }

            m_dialog.showValue(property);

          });
        }
        return p || P.resolvedPromise(false);
      };

      var showRemito = function() {
        try {
          var factura = Cairo.RemitoVenta.Edit.Controller.getEditor();
          factura.showRemitoPedido(getCliId(), getPvIds());
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "showRemito", C_MODULE, "");
        }
      };

      var showFactura = function() {
        try {
          var factura = Cairo.FacturaVenta.Edit.Controller.getEditor();
          factura.showFacturaPedido(getCliId(), getPvIds());
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "showFactura", C_MODULE, "");
        }
      };

      var getPvIds = function() {
        return [m_id];
      };

      var getCliId = function() {
        return m_properties.item(C.CLI_ID).getSelectId();
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
              case KI_IVA_RNI:

                if(! onlyStock) {
                  columns.item(i).setVisible(visible);
                  m_dialog.refreshColumnPropertiesByIndex(prop, i);
                }
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

      var getFileNamePostFix = function() {
        return m_cliente.substring(0, 50) + "-" + m_nrodoc;
      };

      var showMenuDocAction = function() {
        // Remitir el pedido|Facturar el pedido|Show stock info
        var menu = getText(3966, "") + "~1|" + getText(3967, "") + "~2|" + getText("9999"); // TODO: complete language
        m_dialog.showPopMenu(menu);
      };

      var setColorBackground = function() {
        if(Cairo.UserConfig.getUsarColoresEnDocumentos()) {
          if(m_lastDoctId === D.Types.DEVOLUCION_PEDIDO_VTA) {
            m_dialog.setBackColorTabMain("#ffaa00");
          }
          else {
            m_dialog.setBackColorTabMain("white");
          }
        }
      };

      var getDocId = function() {
        return m_properties.item(C.DOC_ID);
      };

      var initialize = function() {
        try {

          m_prvIds = [];

          Cairo.UserConfig.validatePV();

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
          m_prvIds = [];

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");
        }
      };

      self.getObjectType = function() {
        return "cairo.modules.ventas.pedidoVenta";
      };

      initialize();

      return self;
    };

    Edit.Controller = { getEditor: createObject };

    Edit.Controller.edit = function(id) {

      Cairo.LoadingMessage.show("Pedido de Ventas", "Loading Pedido de Ventas from Crowsoft Cairo server.");
      var editor = Cairo.PedidoVenta.Edit.Controller.getEditor();
      //
      // wizards
      //
      if(id === 'sobrepresupuesto') {
        return editor.showWizardPedidoPresupuesto();
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

  Cairo.module("PedidoVentaListDoc.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;
      var P = Cairo.Promises;
      var NO_ID = Cairo.Constants.NO_ID;
      var DB = Cairo.Database;
      var getValue = DB.getValue;
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

      var C_MODULE = "cPedidoVtaListDoc";

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

      var m_menuShowRemito = 0;
      var m_menuShowPacking = 0;
      var m_menuShowFactura = 0;

      var m_menuShowNotes = 0;
      var m_menuShowInfoCli = 0;
      var m_menuAddNote = 0;
      var m_menuShowAplic = 0;
      var m_menuSign = 0;
      var m_menuShowFacturaAuto = 0;
      var m_menuEditCliente = 0;

      var m_menuModoPago = [];

      var emptyData = {
        ventaModos: []
      };
      
      var m_data = emptyData;

      var m_apiPath = DB.getAPIVersion();
      var SAVE_ERROR = getText(2179, ""); // Error al grabar los párametros de navegación de PedidoVenta

      self.list = function() {
        initialize();
        return load()
          .whenSuccess(loadCollection);
      };

      self.edit = function(pvId) {
        m_listController.edit(pvId);
      };

      self.deleteItem = function(pvId) {
        return m_listController.destroy(pvId);
      };

      self.showDocDigital = function() {
        var _rtn = null;

        try {

          var pvId = m_dialog.getId();
          if(pvId === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(CV.PEDIDO_VENTA);
          doc.setClientTableID(pvId);

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
              showFactura(false, false, NO_ID, false);
              break;

            case m_menuShowFacturaAuto:
              showFactura(true, false, NO_ID, false);
              break;

            case m_menuShowPacking:
              showPacking();
              break;

            case m_menuShowRemito:
              showRemito();
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

            case m_menuSign:
              signDocument();
              break;

            case m_menuEditCliente:
              editCliente();
              break;

            default:
              processModoPago(index);
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
        c.setSelectFilter(D.PEDIDO_VENTAS_LIST_DOC_FILTER);

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

      var loadDataFromResponse = function(response) {
        var data = response.data;

        data.ventaModos = data.get('ventaModos');

        return data;
      };
      
      var load = function() {

        m_data = emptyData;
        
        return DB.getData("load[" + m_apiPath + "ventas/pedidoventas/parameters]").then(
          function(response) {

            m_empId = Cairo.Company.getId();
            m_empresa = Cairo.Company.getName();

            if(response.success !== true) { return false; }

            //
            // this is a special case. venta_modos list is not related with params
            //
            m_data = loadDataFromResponse(response);

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

        return DB.getData("load[" + m_apiPath + "ventas/pedidoventas]", null, params);
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.LDP_ID);
        register.setTable(C.LISTA_DOCUMENTO_PARAMETRO);

        register.setPath(m_apiPath + "ventas/pedidoventas");

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
        return "#venta/pedidosdeventa";
      };

      self.getEditorName = function() {
        return "pedidoventas";
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

        addMenuModoPago();

        m_menuShowRemito = m_dialog.addMenu(getText(1612, "")); // Remitir
        m_menuShowPacking = m_dialog.addMenu(getText(1602, "")); // Packing List
        m_menuShowFactura = m_dialog.addMenu(getText(1613, "")); // Facturar
        m_menuShowFacturaAuto = m_dialog.addMenu(getText(5039, "")); // Facturar Automático
        m_dialog.addMenu("-");

        m_menuSign = m_dialog.addMenu(getText(1594, "")); // Firmar
        m_dialog.addMenu("-");

        m_menuShowInfoCli = m_dialog.addMenu(getText(1614, ""));
        m_menuAddNote = m_dialog.addMenu(getText(1615, "")); // Agregar Nota
        m_menuShowNotes = m_dialog.addMenu(getText(1616, "")); // Ver Notas
        m_dialog.addMenu("-");

        m_menuShowAplic = m_dialog.addMenu(getText(1617, "")); // Ver Aplicaciones
      };

      // show a list of menus to allow creating an invoice
      // without requiring payment methods because the
      // the account is defined in sale mode
      //
      var addMenuModoPago = function() {

        var count = m_data.ventaModos.length;

        if (count > 0) {

          m_dialog.addMenu("-");

          for(var _i = 0; _i < count; _i += 1) {

            var menuId = m_dialog.addMenu(getValue(m_data.ventaModos[_i], C.VM_NAME));
            var isContado = getValue(m_data.ventaModos[_i], C.VM_CTA_CTE) !== C.VentaModoCtaCte.hojaRuta;

            m_menuModoPago.push({
              vmId: getValue(m_data.ventaModos[_i], C.VM_ID),
              menuId: menuId,
              isContado: isContado,
              cueId: getValue(m_data.ventaModos[_i], C.CUE_ID)
            });

            m_dialog.addMenu("-");
          }
        }
      };

      var processModoPago = function(idMenu) {
        for(var i = 0, count = m_menuModoPago.length; i < count; i++) {
          if(m_menuModoPago[i].menuId === idMenu) {

            if(m_menuModoPago[i].isContado) {
              showFactura(true, true, m_menuModoPago[i].cueId, false);
            }
            else {
              showFactura(true, false, NO_ID, true);
            }
          }
        }
      };

      var showNotes = function() {
        var fcId = m_dialog.getId();
        return DB.getData("load[" + m_apiPath + "ventas/pedidoventa/notes]", fcId)
          .whenSuccessWithResult(D.showNotes);
      };

      var addNote = function() {
        var pvId = m_dialog.getId();
        return D.addNote(D.Types.PEDIDO_VENTA, pvId, false);
      };

      var editCliente = function() {
        var cliId = getCliId();
        if(cliId === NO_ID) { return; }
        Cairo.Cliente.Edit.Controller.edit(cliId);
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

        var p = D.getDocumentSignStatus(D.Types.PEDIDO_VENTA, fcId)
            .whenSuccessWithResult(getAction)
            .whenSuccess(D.signDocument(D.Types.PEDIDO_VENTA, fcId))
            .whenSuccessWithResult(refreshRow)
          ;

        return p;
      };

      var showApplycation = function() {

        var showEditor = function(info) {
          if(!Cairo.Security.docHasPermissionTo(
            CS.MODIFY_APLIC,
            m_docId,
            Cairo.Security.ActionTypes.apply)) {
            return false;
          }

          var applyEditor = Cairo.PedidoVentaAplic.createObject();

          applyEditor.setClient(self);

          applyEditor.show(
            info.id,
            info.total * ((info.cotizacion !== 0) ? info.cotizacion : 1),
            info.nrodoc,
            info.cli_id,
            info.cliente,
            info.suc_id,
            info.doc_id,
            info.doct_id === D.Types.DEVOLUCION_PEDIDO_VTA);
        };

        var pvId = m_dialog.getId();
        if(pvId !== NO_ID) {
          D.getDocumentInfo(D.Types.PEDIDO_VENTA, pvId).whenSuccessWithResult(showEditor);
        }
      };

      var showRemito = function() {
        try {
          var remito = Cairo.RemitoVenta.Edit.Controller.getEditor();
          remito.showRemitoPedido(getCliId(), getPvIds());
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "showRemito", C_MODULE, "");
        }
      };

      var showFactura = function(bPushVirtualNext, bAutoPago, cueId, bModoVentaCtaCte) {
        try {
          var factura = Cairo.FacturaVenta.Edit.Controller.getEditor();
          factura.setPushVirtualNext(bPushVirtualNext);
          factura.setAutoSelectEasy(bPushVirtualNext);
          factura.setAutoPago(bAutoPago);
          factura.setModoVentaCtaCte(bModoVentaCtaCte);
          factura.setCueIdAutoPago(cueId);
          factura.showFacturaPedido(getCliId(), getPvIds());
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "showFactura", C_MODULE, "");
        }
      };

      var showPacking = function() {
        try {
          var factura = Cairo.PackingList.Edit.Controller.getEditor();
          factura.showPackingPedido(getCliId(), getPvIds());
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "showPacking", C_MODULE, "");
        }
      };

      var getCliId = function() {
        // TODO: implement it.
      };

      var getPvIds = function() {
        return m_dialog.getIds();
      };

      var initialize = function() {
        try {
          m_title = getText(1557, ""); // Pedidos de Venta
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

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("PedidoVenta.List", function(List, Cairo, Backbone, Marionette, $, _) {

    var NO_ID = Cairo.Constants.NO_ID;
    var CS = Cairo.Security.Actions.Ventas;
    var DB = Cairo.Database;
    var C_MODULE = "cPedidoVenta";
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

          var editors = Cairo.Editors.pedidoVentaEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.pedidoVentaEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "PedidoVenta",
            entityName: "pedidoventa",
            entitiesName: "pedidoventas"
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
              Cairo.LoadingMessage.show("PedidoVenta", "Loading Pedido de Ventas from Crowsoft Cairo server.");

              var editor = Cairo.PedidoVenta.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(CS.DELETE_PEDIDO)) {
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
              DB.getAPIVersion() + "ventas/pedidoventa", id,
              Cairo.Constants.DELETE_FUNCTION, C_MODULE).whenSuccess(closeDialog, false);
          };

          // progress message
          //
          Cairo.LoadingMessage.show("PedidoVenta", "Loading Pedido de Ventas from Crowsoft Cairo server.");

          self.documentList = Cairo.PedidoVentaListDoc.Edit.Controller.getEditor();
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
