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
      
      var K = {
        NUMERO: 1,
        NRO_DOC: 2,
        DESCRIP: 3,
        FECHA: 4,
        FECHA_ENTREGA: 5,
        NETO: 6,
        IVA_RI: 7,
        IVA_RNI: 8,
        TOTAL: 9,
        CLI_ID: 10,
        DOC_ID: 11,
        LP_ID: 13,
        LD_ID: 14,
        ITEMS: 15,
        CPG_ID: 16,
        EST_ID: 17,
        CCOS_ID: 18,
        SUC_ID: 19,
        DESCUENTO1: 20,
        DESCUENTO2: 21,
        IMPORTE_DESC1: 22,
        IMPORTE_DESC2: 23,
        SUBTOTAL: 24,
        RAM_ID_STOCK: 25,

        VEN_ID: 26,
        LGJ_ID: 27,
        PRO_ID_ORIGEN: 29,
        PRO_ID_DESTINO: 30,
        TRANS_ID: 31,
        CLIS_ID: 33,

        CHOF_ID: 36,
        CAM_ID: 37,
        CAM_ID_SEMI: 38,
        DESTINATARIO: 39,

        ORDEN_COMPRA: 40,

        HIDE_COLS: 41
      };

      var KI = {
        PVI_ID: 2,
        CANTIDAD: 4,
        STOCK: 500,
        STOCK_REAL: 501,
        STOCK_PEDIDOS: 502,
        DESCRIP: 6,
        PRECIO: 7,
        IMPORTE: 8,
        NETO: 9,
        IVA_RI: 10,
        IVA_RNI: 11,
        PR_ID: 13,
        IVA_RI_PERCENT: 16,
        IVA_RNI_PERCENT: 17,
        DESCUENTO: 18,
        UNIDAD: 19,
        PRECIO_LP: 20,
        PRECIO_USR: 21,
        CCOS_ID: 22        
      };

      var emptyData = {
        items: []
      };

      var m = {
        id: 0,
        numero: 0,
        estado: "",
        estId: 0,
        nroDoc: "",
        descrip: "",
        fecha: null,
        fechaEntrega: null,
        neto: 0,
        ivaRi: 0,
        ivaRni: 0,
        total: 0,
        subTotal: 0,
        descuento1: 0,
        descuento2: 0,
        importeDesc1: 0,
        importeDesc2: 0,
        cpgId: 0,
        condicionPago: "",
        ccosId: 0,
        centroCosto: "",
        sucId: 0,
        sucursal: "",
        cliId: 0,
        cliente: "",
        docId: 0,
        documento: "",
        doctId: 0,
        lpId: 0,
        listaPrecio: "",
        ldId: 0,
        listaDescuento: "",
        ramaStock: "",
        ramIdStock: "",
        firmado: false,

        venId: 0,
        vendedor: "",
        lgjId: 0,
        legajo: "",

        clisId: 0,
        clienteSucursal: "",

        proIdOrigen: 0,
        proOrigen: "",
        proIdDestino: 0,
        proDestino: "",

        transId: "",
        transporte: "",

        chofId: 0,
        chofer: "",

        camId: 0,
        camion: "",

        camIdSemi: 0,
        semi: "",

        destinatario: "",

        ordenCompra: "",

        taPropuesto: false,
        taMascara: "",

        editing: false,

        footer: null,
        footerProps: null,
        items: null,
        itemsProps: null,
        dialog: null,
        properties: null,
        listController: null,

        lastDocId: 0,
        lastCliId: 0,
        lastDocTipoPedido: 0,
        lastDocName: "",
        lastCliName: "",

        lastDoctId: 0,

        lastTransId: 0,
        lastChofId: 0,

        bIva: false,
        bIvaRni: false,

        isNew: false,

        itemsDeleted: "",

        copy: false,

        docEditable: false,
        docEditMsg: "",

        applyEditor: null,

        prvIds: 0,

        apiPath: DB.getAPIVersion(),

        data: emptyData
        
      };

      self.getEditorType = function() {
        return "document"
      };

      self.refresh = function() {
        load(m.id);
        refreshProperties();
      };

      self.terminateWizard = function(id) {
        if(id !== NO_ID) {
          self.edit(id);
        }
      };

      var startWizard = function(wizard, wizardConstructor) {
        wizard.setCliId(m.cliId);
        wizard.setCliente(m.cliente);
        wizard.setDocId(m.lastDocId);
        wizard.setDocumento(m.lastDocName);
        wizard.setObjClient(self);

        var wizardDialog = Cairo.Dialogs.WizardViews.Controller.newWizard();
        wizardDialog.setClient(wizard);
        wizardDialog.show(wizardConstructor);
      };

      var showStartWizardPresupuesto = function() {
        try {
          var wizConstructor = Cairo.PedidoVentaWiz.Edit.Controller.getEditor;
          var wizard = wizConstructor();
          wizard.setPrvIds(m.prvIds);
          wizard.loadWizard().whenSuccess(call(startWizard, wizard, wizConstructor));
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "showStartWizardPresupuesto", C_MODULE, "");
        }
      };

      var showStartWizard = function(cliId, f) {
        try {
          m.cliId = cliId;
          DB.getData("load[" + m.apiPath + "general/cliente/" + cliId.toString() + "/name]").then(function(response) {
            try {
              if(response.success === true) {
                m.cliente = valField(response.data, C.CLI_NAME);
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
          m.prvIds = prvIds.slice();
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
          m.docId,
          Cairo.Security.ActionTypes.create,
          true)) {
          return false;
        }

        updateList();

        m.isNew = true;

        if(m.listController !== null) {
          m.listController.updateEditorKey(self, NO_ID);
        }

        m.copy = true;
        m.docEditable = true;
        m.docEditMsg = "";

        return D.setDocNumberForCliente(m.lastCliId, m.lastDocId, m.dialog).then(
          function(enabled) {
            m.taPropuesto = enabled;
            setEnabled();
          }
        );
      };

      self.editNew = function() {

        var p;

        updateList();

        m.isNew = true;

        if(m.listController !== null) {
          m.listController.updateEditorKey(self, NO_ID);
        }

        p = self.edit(NO_ID).then(function() {

          var p = null;

          m.lastCliId = NO_ID;

          if(!m.docEditable) {
            if(m.docEditMsg !== "") {
              p = M.showWarning(m.docEditMsg);
            }
          }

          return p || P.resolvedPromise(true);

        }).then(function() {

            var p = null;

            var docId = m.properties.item(C.DOC_ID).getSelectId();

            if(docId === NO_ID) {
              p = M.showInfo(getText(1562, ""));
            }

            return p || P.resolvedPromise(true);

          }).then(function() {

            setDataCliente();
            return D.setDocNumber(m.lastDocId, m.dialog, CV.PV_NRODOC);

          }).then(function(enabled) {

            m.taPropuesto = enabled;
            setColorBackground();
            return true;

          });

        return p;
      };

      self.getApplication = function() {
        return Cairo.Application.appName;
      };

      self.editDocumentsEnabled = function() {
        return m.id !== NO_ID;
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

          if(m.id === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(CV.PEDIDO_VENTA);
          doc.setClientTableID(m.id);

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
            
            D.showEditStatus(m.docEditMsg, TITLE);
            break;

          case Dialogs.Message.MSG_DOC_DELETE:

            p = self.deleteDocument(m.id).whenSuccess(function() {
              return move(Dialogs.Message.MSG_DOC_NEXT);
            });
            break;

          case Dialogs.Message.MSG_DOC_APPLY:
            
            showApply();
            break;

          case Dialogs.Message.MSG_DOC_INVALIDATE:

            p = D.docInvalidate(m.doctId, m.id, m.dialog).then(function(result) {
              if(result.success === true) {
                m.estId = result.estId;
                m.estado = result.estado;
                m.docEditable = result.editable;
                m.docEditMsg = result.message;
                setEnabled();
              }
            });
            break;

          case Dialogs.Message.MSG_DOC_REFRESH:
            
            p = load(m.id).then(function(success) {
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

            p = P.resolvedPromise(m.items);
            break;

          case Dialogs.Message.MSG_DOC_EX_GET_FOOTERS:

            p = P.resolvedPromise(m.footer);
            break;

          case Dialogs.Message.MSG_DOC_SEARCH:
            
            D.search(D.Types.PEDIDO_VENTA, self, Cairo.bool(info));
            break;

          case Dialogs.Message.MSG_DOC_DOC_EDIT:

            if(m.id) {

              if(m.docEditable) {
                P = M.showInfo(getText(1555, "")); // Este documento puede editarse normalmente
              }
              else {

                p = D.docCanBeSaved(m.dialog, CV.PV_FECHA).then(function(canBeSaved) {
                  if(canBeSaved) {

                    var editDoc = new Cairo.EditDocumento.Edit.Controller.getEditor();
                    editDoc.setClient(self);
                    return editDoc.edit(m.id, m.doctId, true);
                  }
                });
              }
            }
            else {
              P = M.showInfo(getText(1556, "")); // Esta opción solo sirve para modificar documentos guardados y aplicados
            }
            break;

          case Dialogs.Message.MSG_DOC_DOC_ACTION:

            if(m.id) {
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
                if(m.id !== NO_ID) {
                  showInfo();
                }
                else {
                  M.showWarning(getText(1554, "")); // Antes de pedir Info sobre el Pedido debe guardarlo
                }
                break;
            }

            break;

          case Dialogs.Message.MSG_DOC_HISTORY:

            if(m.id !== NO_ID) {
              p = Cairo.History.show(Cairo.Tables.PEDIDOS_DE_VENTA, m.id, m.documento + " " + m.nroDoc);
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
        }

        return p || P.resolvedPromise(true);
      };

      // TODO: implement this
      var showInfo = function() {        
        // getText(1596, "") // Pendientes de Stock
        // "sp_DocPedidoVentaStockInfo "+ m.id
      };

      self.discardChanges = function() {
        Cairo.raiseError("PedidoVenta", "DiscardChanges was called");
      };

      self.propertyChange = function(key) {

        var p = null;
        
        switch (key) {
          
          case K.DOC_ID:

            // if the document has changed
            //
            var changeInfo = D.docHasChanged(m.dialog, m.lastDocId);
            if(changeInfo.changed) {

              m.lastDocId = changeInfo.docId;
              m.lastDocName = changeInfo.docName;

              p = DB.getData("load[" + m.apiPath + "documento/" + m.lastDocId.toString() + "/info]");

              p = p.then(function(response) {

                if(response.success === true) {
                  m.lastDoctId = valField(response.data, C.DOCT_ID);
                  m.lastDocTipoPedido = valField(response.data, C.DOC_TIPO_PEDIDO);
                }
                return response.success;

              })
                .whenSuccess(function() {

                  var p = null;

                  // when the document property is changed and the dialog was
                  // editing a saved invoice we need to move to a new invoice
                  //
                  if(m.id !== NO_ID && m.docId !== m.lastDocId) {
                    p = self.edit(D.Constants.DOC_CHANGED);
                  }

                  return p || P.resolvedPromise(true);

                })
                .whenSuccess(function() {

                  return D.setDocNumber(m.lastDocId, m.dialog, CV.PV_NRODOC)
                    .then(function(enabled) {

                      m.taPropuesto = enabled;
                    });
                })
                .then(function() {

                  showHideCols(true);
                  setColorBackground();

                });
            }

            p = p || P.resolvedPromise(true);

            p = p.then(function() {
              setEnabled();
            });
            break;

          case K.CLI_ID:

            setDataCliente().whenSuccess(function() {

              updateTotals();

              D.setDocNumberForCliente(m.lastCliId, m.lastDocId, m.dialog)
                .then(function(info) {

                  m.taPropuesto = info.taEnabled;

                }).then(function() {
                  D.showDataAddCliente(Cairo.UserConfig.getShowDataAddInVentas(), m.dialog);
                });
            });
            break;

          case K.DESCUENTO1:
          case K.DESCUENTO2:

            updateTotals();
            break;

          case K.TRANS_ID:

            p = setDataTransporte();
            break;

          case K.CHOF_ID:

            p = setDataChofer();
            break;

          case K.HIDE_COLS:

            showHideCols(false);
            break;
        }

        return p || P.resolvedPromise(true);
      };

      self.save = function() {
      
        var p = D.docCanBeEdited(m.docEditable, m.docEditMsg)
          .whenSuccess(function() {
            return D.docCanBeSaved(m.dialog, CV.PV_FECHA);
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

            register.setPath(m.apiPath + "ventas/pedidoventa");

            if(m.copy) {
              register.setId(Cairo.Constants.NEW_ID);
            }
            else {
              register.setId(m.id);
            }

            if(register.getId() === Cairo.Constants.NEW_ID) {
              m.estId = D.Status.pendiente;
            }

            var _count = m.properties.size();
            for(var _i = 0; _i < _count; _i++) {

              var property = m.properties.item(_i);

              switch (property.getKey()) {
                case K.NUMERO:
                  fields.add(CV.PV_NUMERO, property.getValue(), Types.long);
                  break;

                case K.NRO_DOC:
                  fields.add(CV.PV_NRODOC, property.getValue(), Types.text);
                  break;

                case K.DESCRIP:
                  fields.add(CV.PV_DESCRIP, property.getValue(), Types.text);
                  break;

                case K.FECHA:
                  fields.add(CV.PV_FECHA, property.getValue(), Types.date);
                  break;

                case K.FECHA_ENTREGA:
                  fields.add(CV.PV_FECHA_ENTREGA, property.getValue(), Types.date);
                  break;

                case K.CLI_ID:
                  fields.add(C.CLI_ID, property.getSelectId(), Types.id);
                  break;

                case K.CCOS_ID:
                  fields.add(C.CCOS_ID, property.getSelectId(), Types.id);
                  break;

                case K.SUC_ID:
                  fields.add(C.SUC_ID, property.getSelectId(), Types.id);
                  break;

                case K.RAM_ID_STOCK:
                  fields.add(CV.RAM_ID_STOCK, property.getSelectIntValue(), Types.text);
                  break;

                case K.DESCUENTO1:
                  fields.add(CV.PV_DESCUENTO1, property.getValue(), Types.currency);
                  break;

                case K.DESCUENTO2:
                  fields.add(CV.PV_DESCUENTO2, property.getValue(), Types.currency);
                  break;

                case K.DOC_ID:
                  fields.add(C.DOC_ID, property.getSelectId(), Types.id);
                  break;

                case K.LP_ID:
                  fields.add(C.LP_ID, property.getSelectId(), Types.id);
                  break;

                case K.LD_ID:
                  fields.add(C.LD_ID, property.getSelectId(), Types.id);
                  break;

                case K.CPG_ID:
                  fields.add(C.CPG_ID, property.getSelectId(), Types.id);
                  break;

                case K.VEN_ID:
                  fields.add(C.VEN_ID, property.getSelectId(), Types.id);
                  break;

                case K.LGJ_ID:
                  fields.add(C.LGJ_ID, property.getSelectId(), Types.id);
                  break;

                case K.PRO_ID_ORIGEN:
                  fields.add(C.PRO_ID_ORIGEN, property.getSelectId(), Types.id);
                  break;

                case K.PRO_ID_DESTINO:
                  fields.add(C.PRO_ID_DESTINO, property.getSelectId(), Types.id);
                  break;

                case K.TRANS_ID:
                  fields.add(C.TRANS_ID, property.getSelectId(), Types.id);
                  break;

                case K.CHOF_ID:
                  fields.add(C.CHOF_ID, property.getSelectId(), Types.id);
                  break;

                case K.CAM_ID:
                  fields.add(C.CAM_ID, property.getSelectId(), Types.id);
                  break;

                case K.CAM_ID_SEMI:
                  fields.add(C.CAM_ID_SEMI, property.getSelectId(), Types.id);
                  break;

                case K.DESTINATARIO:
                  fields.add(CV.PV_DESTINATARIO, property.getValue(), Types.text);
                  break;

                case K.ORDEN_COMPRA:
                  fields.add(CV.PV_ORDEN_COMPRA, property.getValue(), Types.text);
                  break;

                case K.CLIS_ID:
                  fields.add(C.CLIS_ID, property.getSelectId(), Types.id);
                  break;
              }
            }

            var _count = m.footerProps.size();
            for(var _i = 0; _i < _count; _i++) {
              
              property = m.footerProps.item(_i);

              switch (property.getKey()) {

                case K.TOTAL:
                  fields.add(CV.PV_TOTAL, property.getValue(), Types.currency);
                  break;

                case K.NETO:
                  fields.add(CV.PV_NETO, property.getValue(), Types.currency);
                  break;

                case K.IVA_RI:
                  fields.add(CV.PV_IVA_RI, property.getValue(), Types.currency);
                  break;

                case K.IVA_RNI:
                  fields.add(CV.PV_IVA_RNI, property.getValue(), Types.currency);
                  break;

                case K.SUBTOTAL:
                  fields.add(CV.PV_SUBTOTAL, property.getValue(), Types.currency);
                  break;

                case K.IMPORTE_DESC1:
                  fields.add(CV.PV_IMPORTE_DESC1, property.getValue(), Types.currency);
                  break;

                case K.IMPORTE_DESC2:
                  fields.add(CV.PV_IMPORTE_DESC2, property.getValue(), Types.currency);
                  break;
              }
            }

            fields.add(C.EST_ID, m.estId, Types.id);

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

                    m.copy = false;
                    Cairo.navigate(NO_ID);

                    return load(result.data.getId()).then(
                      function(success) {

                        if(success) {

                          Cairo.navigate(self.getPath());
                          if(m.listController !== null) {
                            updateList();
                            m.listController.updateEditorKey(self, m.id);
                          }
                        }
                        m.isNew = false;
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
          if(m.id === NO_ID) { return; }
          if(m.listController === null) { return; }

          if(m.isNew) {
            m.listController.addItem(m.id);
          }
          else {
            m.listController.refreshItem(m.id);
          }
        }
        catch(ignore) {
          Cairo.logError("Can't update list", ignore);
        }
      };

      var destroy = function() {
        try {

          m.dialog = null;
          m.properties = null;
          m.listController = null;
          m.footer = null;
          m.footerProps = null;
          m.items = null;
          m.itemsProps = null;
          m.prvIds = [];

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");
        }
      };

      self.terminate = function() {

        m.editing = false;

        try {
          if(m.listController !== null) {
            updateList();
            m.listController.removeEditor(self);
          }
        }
        catch (ignored) {
          Cairo.logError('Error in terminate', ignored);
        }

        destroy();
      };

      self.getPath = function() {
        return "#venta/pedidodeventa/" + m.id.toString();
      };

      self.getEditorName = function() {
        var id = m.id ? m.id.toString() : "N" + (new Date).getTime().toString();
        return "pedidoventa" + id;
      };

      self.getTitle = function() {
        return TITLE + (m.id !== NO_ID ? " " + m.nroDoc + " - " + m.cliente : "");
      };

      self.getTabTitle = function() {
        return "PV-" + m.nroDoc;
      };

      self.validate = function() {

        for(var _i = 0, _count = m.properties.size(); _i < _count; _i++) {

          var property = m.properties.item(_i);

          switch (property.getKey()) {
            case K.FECHA:
              if(valEmpty(property.getValue(), Types.date)) {
                M.showInfo(getText(1558, "")); // Debe indicar una fecha
              }
              break;

            case K.FECHA_ENTREGA:
              if(valEmpty(property.getValue(), Types.date)) {
                M.showInfo(getText(1564, "")); // Debe indicar una Fecha de entrega
              }
              break;

            case K.CLI_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                M.showInfo(getText(1563, "")); // Debe indicar un Cliente
              }
              break;

            case K.DOC_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                M.showInfo(getText(1562, "")); // Debe indicar un Documento
              }
              break;

            case K.CPG_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                M.showInfo(getText(1561, "")); // Debe indicar una Condición de Pago
              }
              break;

            case K.SUC_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                M.showInfo(getText(1560, "")); // Debe indicar una Sucursal
              }
              break;

            case K.RAM_ID_STOCK:
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
            case K.ITEMS:
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
        return m.docId;
      };

      self.nroDoc = function() {
        return m.nroDoc;
      };

      self.doctId = function() {
        return m.doctId;
      };

      self.id = function() {
        return m.id;
      };

      self.loadForPrint = function(id) {
        var loadData = function(response) {
          try {

            m.id = id;
            m.docId = valField(response.data, C.DOC_ID);
            m.doctId = valField(response.data, C.DOCT_ID);

            return true;

          }
          catch(ex) {
            Cairo.manageErrorEx(ex.message, ex, "loadForPrint", C_MODULE, "");
          }

          return false;
        };

        return DB.getData("load[" + m.apiPath + "ventas/pedidoventa/info]",id)
          .whenSuccessWithResult(loadData, false);
      };

      self.getDialog = function() {
        return m.dialog;
      };

      self.list = function() {
        return Cairo.Security.hasPermissionTo(CS.LIST_PEDIDO);
      };

      self.setDialog = function(dialog) {
        m.dialog = dialog;
        m.properties = m.dialog.getProperties();
        m.dialog.setIsDocument(true);
      };

      self.isEditing = function() {
        return m.editing;
      };

      self.edit = function(id, inModalWindow) {

        var p = null;

        try {

          if(!Cairo.Security.docHasPermissionTo(
            CS.LIST_PEDIDO,
            D.getDocIdFromDialog(m.dialog),
            Cairo.Security.ActionTypes.list)) {
            return P.resolvedPromise(false);
          }

          // Id = DOC_CHANGED when the document is changed
          //                  when editing a document
          //
          m.isNew = (id === NO_ID || id === D.Constants.DOC_CHANGED);

          var loadAllItems = function() {
            if(m.itemsProps.count() > 0) {
              loadItems(getItems());
            }
            return P.resolvedPromise(true);
          };

          var afterLoad = function() {
            if(m.properties.count() === 0) {
              if(!loadCollection()) { return false; }
            }
            else {
              refreshProperties();
            }

            m.dialog.setNewPropertyKeyFocus("");

            // only show the wizard if the new action is not
            // originated by a change on document
            //
            if(id !== D.Constants.DOC_CHANGED && m.isNew && docDesdePresupuesto()) {

              showStartWizardPresupuesto();
            }
            else {

              m.dialog.setNewPropertyKeyFocus(C.CLI_ID);
            }

            m.editing = true;
            m.copy = false;

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
        m.listController = controller;
      };

      self.columnAfterUpdate = function(key, lRow, lCol) {
        var p = null;

        try {

          switch (key) {

            case K.ITEMS:

              var property = m.items.getProperties().item(C_ITEMS);
              showImporteAndIva(property.getGrid().getRows().item(lRow));
              updateTotals();

              var colKey = null;
              colKey = property.getGrid().getColumns().item(lCol).getKey();
              if(colKey === KI.PR_ID || colKey === KI.CANTIDAD) {
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
        return m.properties.item(CV.RAM_ID_STOCK);
      };

      var processMultiRow = function(virtualRow) {
        var p = null;

        virtualRow.setSuccess(false);

        switch (virtualRow.getInfo().key) {
          case K.ITEMS:
            var items = getItems();

            var row = null;
            row = items.getGrid().getRows.item(virtualRow.getInfo().row);

            if(row.item(virtualRow.getInfo().col).getKey() === KI.PR_ID) {

              var cell = getCell(row, KI.PR_ID);

              if(cell.getSelectIntValue() !== "") {
                if(cell.getSelectIntValue().indexOf(",", 1) >= 0) {
                  p = Cairo.Selections.addMultiRowsSale(cell.getSelectIntValue(), virtualRow, KI.CANTIDAD);
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
            case K.ITEMS:
              var property = getProperty(m.items, C_ITEMS);
              p = columnAfterEditItems(property, lRow, lCol, newValue, newValueId);
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

            case K.ITEMS:
              var property = getProperty(m.items, C_ITEMS);
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

        var cell = getCell(row, KI.PRECIO_USR);
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

          case KI.PR_ID:

            Cairo.LoadingMessage.show("Pedido de Ventas", "Loading data for product.");

            var row = grid.getRows().item(lRow);
            p = setDataProducto(row, newValueId)
              .whenSuccess(
                call(
                  D.setPrecios, row, newValueId, m.properties.item(C.LP_ID).getSelectId(), KI.PRECIO_LP, KI.PRECIO_USR
                )
              )
              .whenSuccess(
                call(
                  D.setDescuentos, row, newValueId, call(getPrecioFromRow, row),
                  m.properties.item(C.LD_ID).getSelectId(), KI.DESCUENTO, KI.PRECIO
                )
              )
              .whenSuccess(call(setTasasImpositivas, row, newValueId, newValue))
              .then(function(result) { Cairo.LoadingMessage.close(); return result; });
            break;

          case KI.PRECIO_USR:

            var row = grid.getRows().item(lRow);
            p = D.setDescuentos(
              row, cellId(row, KI.PR_ID), newValue,
              m.properties.item(C.LD_ID).getSelectId(), KI.DESCUENTO, KI.PRECIO
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

          case K.ITEMS:

            var id = cellFloat(row, KI.PVI_ID);
            if(id !== NO_ID) { m.itemsDeleted = m.itemsDeleted+ id.toString()+ ","; }
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

            case K.ITEMS:
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
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {
            
            case KI.CANTIDAD:
              if(!valEmpty(cell.getValue(), Types.currency)) {
                if(val(cell.getValue()) !== 1) {
                  return false;
                }
              }
              break;

            case KI.PRECIO:
              if(!valEmpty(cell.getValue(), Types.currency)) {
                return false;
              }
              break;

            case KI.PR_ID:
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
        for(var _i = 0; _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KI.CANTIDAD:
              if(valEmpty(cell.getValue(), Types.currency)) {
                return M.showInfoWithFalse(getText(1365, "", strRow)); // Debe indicar una cantidad (1)
              }
              break;

            case KI.PR_ID:
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

        m.dialog.setUseSelectIntValue(true);

        var properties = m.properties;
        m.properties.clear();

        var tabs = m.dialog.getTabs();
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
        elem.setKey(K.DOC_ID);

        if(m.docId !== NO_ID) {
          elem.setSelectId(m.docId);
          elem.setValue(m.documento);
        }
        else {
          // user preferences
          //
          elem.setSelectId(Cairo.UserConfig.getDocPvId());
          elem.setValue(Cairo.UserConfig.getDocPvName());

          validateDocDefault = elem.getSelectId() !== NO_ID;
        }

        elem.setSelectFilter(D.PEDIDO_VENTAS_DOC_FILTER);

        elem = properties.add(null, Cairo.Constants.NUMBER_ID);
        elem.setType(T.numeric);
        elem.setSubType(ST.integer);
        elem.setName(getText(1065, "")); // Número
        elem.setKey(K.NUMERO);
        elem.setValue(m.numero);
        elem.setEnabled(false);

        elem = properties.add(null, Cairo.Constants.STATUS_ID);
        elem.setType(T.text);
        elem.setName(getText(1568, "")); // Estado
        elem.setKey(K.EST_ID);
        elem.setValue(m.estado);
        elem.setEnabled(false);

        elem = properties.add(null, CV.PV_FECHA);
        elem.setType(T.date);
        elem.setName(getText(1569, "")); // Fecha
        elem.setKey(K.FECHA);
        elem.setValue(m.fecha);

        elem = properties.add(null, CV.PV_FECHA_ENTREGA);
        elem.setType(T.date);
        elem.setName(getText(1570, "")); // Entrega
        elem.setKey(K.FECHA_ENTREGA);
        elem.setValue(m.fechaEntrega);

        elem = properties.add(null, C.CLI_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CLIENTE);
        elem.setName(getText(1150, "")); // Cliente
        elem.setKey(K.CLI_ID);
        elem.setSelectId(m.cliId);
        elem.setValue(m.cliente);
        m.dialog.setNewPropertyKeyFocus(C.CLI_ID);

        elem = properties.add(null, CV.PV_NRODOC);
        elem.setType(T.text);
        elem.setName(getText(1065, "")); // Número
        elem.setSize(50);
        elem.setKey(K.NRO_DOC);
        elem.setValue(m.nroDoc);
        elem.setTextMask(m.taMascara);
        elem.setTextAlign(Dialogs.TextAlign.right);

        elem = properties.add(null, C.CPG_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CONDICIONES_DE_PAGO);
        elem.setName(getText(1571, "")); // Cond. Pago
        elem.setKey(K.CPG_ID);
        elem.setSelectId(m.cpgId);
        elem.setValue(m.condicionPago);

        elem = properties.add(null, CV.PV_DESCUENTO1);
        elem.setType(T.numeric);
        elem.setSubType(ST.percentage);
        elem.setName(getText(1573, "")); // Desc. 1
        elem.setKey(K.DESCUENTO1);
        elem.setValue(m.descuento1);
        elem.setTabIndex(2);

        elem = properties.add(null, CV.PV_DESCUENTO2);
        elem.setType(T.numeric);
        elem.setSubType(ST.percentage);
        elem.setName("2");
        elem.setKey(K.DESCUENTO2);
        elem.setValue(m.descuento2);
        elem.setTabIndex(2);

        elem = properties.add(null, C.LP_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LISTAS_DE_PRECIOS);
        elem.setName(getText(1397, "")); // Lista de Precios
        elem.setSelectFilter(D.getListaPrecioForCliente(m.docId, m.cliId));
        elem.setKey(K.LP_ID);
        elem.setSelectId(m.lpId);
        elem.setValue(m.listaPrecio);
        elem.setTabIndex(2);

        elem = properties.add(null, C.LD_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LISTAS_DE_DESCUENTOS);
        elem.setName(getText(1398, "")); // Lista de Descuentos
        elem.setSelectFilter(D.getListaDescuentoForCliente(m.docId, m.cliId));
        elem.setKey(K.LD_ID);
        elem.setSelectId(m.ldId);
        elem.setValue(m.listaDescuento);
        elem.setTabIndex(2);

        elem = properties.add(null, CV.RAM_ID_STOCK);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.DEPOSITO_LOGICO);
        elem.setName(getText(1574, "")); // Depósito
        elem.setKey(K.RAM_ID_STOCK);

        if(val(m.ramIdStock) !== NO_ID) {

          elem.setSelectId(val(m.ramIdStock));
          elem.setSelectIntValue(m.ramIdStock);
          elem.setValue(m.ramaStock);

        }
        else {
          
          elem.setSelectIntValue(Cairo.UserConfig.getDeplRamId());
          elem.setSelectId(Cairo.UserConfig.getDeplId());
          elem.setValue(Cairo.UserConfig.getDeplName());
          
        }

        elem.setSelectType(Cairo.Select.SelectType.tree);

        elem = properties.add(null, C.VEN_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.VENDEDOR);
        elem.setName(getText(1510, "")); // Vendedor
        elem.setKey(K.VEN_ID);
        elem.setSelectId(m.venId);
        elem.setValue(m.vendedor);
        elem.setTabIndex(1);

        elem = properties.add(null, C.CCOS_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CENTROS_DE_COSTO);
        elem.setName(getText(1057, "")); // Centro de Costo
        elem.setKey(K.CCOS_ID);
        elem.setSelectId(m.ccosId);
        elem.setValue(m.centroCosto);

        elem = properties.add(null, C.SUC_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.SUCURSAL);
        elem.setName(getText(1281, "")); // Sucursal
        elem.setKey(K.SUC_ID);
        elem.setSelectId(m.sucId);
        elem.setValue(m.sucursal);

        elem = properties.add(null, CV.PV_DESCRIP);
        elem.setType(T.text);
        elem.setSubType(ST.memo);
        elem.setName(getText(1618, ""));
        elem.setSize(5000);
        elem.setKey(K.DESCRIP);
        elem.setValue(m.descrip);
        elem.setTabIndex(4);

        elem = properties.add(null, C.LGJ_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LEGAJOS);
        elem.setName(getText(1575, "")); // Legajo
        elem.setKey(K.LGJ_ID);
        elem.setSelectId(m.lgjId);
        elem.setValue(m.legajo);
        elem.setTabIndex(1);

        elem = properties.add(null, C.CLIS_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.SUCURSALES_DE_CLIENTES);
        elem.setName(getText(1576, "")); // Sucursal del Cliente
        elem.setKey(K.CLIS_ID);
        elem.setValue(m.clienteSucursal);
        elem.setSelectId(m.clisId);
        elem.setTabIndex(1);

        elem = properties.add(null, C.PRO_ID_ORIGEN);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PROVINCIA);
        elem.setName(getText(1577, "")); // Pcia. Origen
        elem.setKey(K.PRO_ID_ORIGEN);
        elem.setSelectId(m.proIdOrigen);
        elem.setValue(m.proOrigen);
        elem.setTabIndex(1);

        elem = properties.add(null, C.PRO_ID_DESTINO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PROVINCIA);
        elem.setName(getText(1578, "")); // Pcia. Destino
        elem.setKey(K.PRO_ID_DESTINO);
        elem.setSelectId(m.proIdDestino);
        elem.setValue(m.proDestino);
        elem.setTabIndex(1);

        elem = properties.add(null, CV.PV_ORDEN_COMPRA);
        elem.setType(T.text);
        elem.setName(getText(1924, "")); // Orden de Compra
        elem.setKey(K.ORDEN_COMPRA);
        elem.setValue(m.ordenCompra);
        elem.setTabIndex(1);

        elem = properties.add(null, C.TRANS_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.TRANSPORTE);
        elem.setName(getText(1050, "")); // Transporte
        elem.setKey(K.TRANS_ID);
        elem.setValue(m.transporte);
        elem.setSelectId(m.transId);
        elem.setTabIndex(3);

        elem = properties.add(null, C.CHOF_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CHOFER);
        elem.setName(getText(1051, "")); // Chofer
        elem.setKey(K.CHOF_ID);
        elem.setValue(m.chofer);
        elem.setSelectId(m.chofId);
        elem.setSelectFilter(D.getSelectFilterChofer(m.transId));
        elem.setTabIndex(3);

        elem = properties.add(null, C.CAM_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CAMIONES);
        elem.setName(getText(3489, "")); // Camion
        elem.setKey(K.CAM_ID);
        elem.setValue(m.camion);
        elem.setSelectId(m.camId);
        elem.setSelectFilter(D.getSelectFilterCamion(m.transId));
        elem.setTabIndex(3);

        elem = properties.add(null, C.CAM_ID_SEMI);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CAMIONES_SEMI);
        elem.setName(getText(3493, "")); // Semi
        elem.setKey(K.CAM_ID_SEMI);
        elem.setValue(m.semi);
        elem.setSelectId(m.camIdSemi);
        elem.setSelectFilter(D.getSelectFilterCamion(m.transId));
        elem.setTabIndex(3);

        elem = properties.add(null, CV.PV_DESTINATARIO);
        elem.setType(T.text);
        elem.setSubType(ST.memo);
        elem.setName(getText(3494, "")); // Destinatario
        elem.setKey(K.DESTINATARIO);
        elem.setValue(m.destinatario);
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
        elem.setKey(K.HIDE_COLS);
        elem.setValue(true);
        elem.setIsEditProperty(false);

        if(!m.dialog.show(self)) { return false; }

        /////////////////////////////////////////////////////////////////////
        // ITEMS
        /////////////////////////////////////////////////////////////////////

        tabs = m.items.getTabs();
        tabs.clear();

        tabs.add(null).setName(getText(1371, "")); // Items

        properties = m.itemsProps;
        properties.clear();

        elem = properties.add(null, C_ITEMS);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridItems(elem);
        loadItems(elem);
        elem.setName(C_ITEMS);
        elem.setKey(K.ITEMS);
        elem.setTabIndex(0);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m.itemsDeleted = "";

        if(!m.items.show(self)) { return false; }

        /////////////////////////////////////////////////////////////////////
        // FOOTER
        /////////////////////////////////////////////////////////////////////

        properties = m.footerProps;
        properties.clear();

        elem = properties.add(null, CV.PV_SUBTOTAL);
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setName(getText(1579, "")); // Sub Total
        elem.setKey(K.SUBTOTAL);
        elem.setValue(m.subTotal);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.PV_IMPORTE_DESC1);
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setName(getText(1573, "")); // Desc. 1
        elem.setKey(K.IMPORTE_DESC1);
        elem.setValue(m.importeDesc1);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.PV_IMPORTE_DESC2);
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setName(getText(1580, "")); // Desc. 2
        elem.setKey(K.IMPORTE_DESC2);
        elem.setValue(m.importeDesc2);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.PV_NETO);
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setName(getText(1581, "")); // Neto
        elem.setKey(K.NETO);
        elem.setValue(m.neto);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.PV_IVA_RI);
        elem.setType(T.numeric);
        elem.setName(getText(1582, "")); // IVA RI
        elem.setSubType(ST.money);
        elem.setKey(K.IVA_RI);
        elem.setValue(m.ivaRi);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.PV_IVA_RNI);
        elem.setType(T.numeric);
        elem.setName(getText(1583, "")); // IVA RNI
        elem.setSubType(ST.money);
        elem.setKey(K.IVA_RNI);
        elem.setValue(m.ivaRni);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(false);

        elem = properties.add(null, CV.PV_TOTAL);
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setName(getText(1584, "")); // Total
        elem.setSubType(ST.money);
        elem.setKey(K.TOTAL);
        elem.setValue(m.total);
        elem.setEnabled(false);

        setEnabled();

        if(!m.footer.show(self)) { return false; }

        if(validateDocDefault) {
          self.propertyChange(K.DOC_ID);
        }

        D.showDataAddCliente(Cairo.UserConfig.getShowDataAddInVentas(), m.dialog);

        setColorBackground();

        return true;
      };

      var getDocId = function() {
        return m.properties.item(C.DOC_ID).getSelectId();
      };

      var setGridItems = function(property) {
        var hideColumns = m.properties.item(Cairo.Constants.HIDE_COLUMNS).getValue();
        var bColVisible = val(hideColumns) === 0;

        var grid = property.getGrid();
        var columns = grid.getColumns();
        columns.clear();

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI.PVI_ID);

        elem = columns.add(null);
        elem.setName(getText(1367, "")); // Articulo
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PRODUCTOS_DE_VENTA);
        elem.setKey(KI.PR_ID);
        if(Cairo.UserConfig.getMultiSelect()) {
          elem.setSelectType(Cairo.Select.SelectType.tree);
        }

        elem = columns.add(null);
        elem.setName(getText(1618, ""));
        elem.setType(T.text);
        elem.setSubType(ST.textButtonEx);
        elem.setKey(KI.DESCRIP);

        elem = columns.add(null);
        elem.setName(getText(1374, "")); // Cantidad
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());
        elem.setType(T.numeric);
        elem.setSubType(ST.double);
        elem.setKey(KI.CANTIDAD);

        elem.setDefaultValue(Grids.createCell());
        elem.getDefaultValue().setValue(1);

        elem = columns.add(null);
        elem.setName(getText(3568, "")); // Disponible
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());
        elem.setType(T.text);
        elem.setEnabled(false);
        elem.setKey(KI.STOCK);

        elem = columns.add(null);
        elem.setName(getText(3567, "")); // Sotck Real
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());
        elem.setType(T.text);
        elem.setEnabled(false);
        elem.setKey(KI.STOCK_REAL);

        elem = columns.add(null);
        elem.setName(getText(1694, "")); // Pedidos
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());
        elem.setType(T.text);
        elem.setEnabled(false);
        elem.setKey(KI.STOCK_PEDIDOS);

        elem = columns.add(null);
        elem.setName(getText(1585, "")); // Descuento
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(ST.money);
        elem.setKey(KI.DESCUENTO);
        elem.setEnabled(false);
        elem.setVisible(bColVisible);

        elem = columns.add(null);
        elem.setName(getText(1165, "")); // Unidad
        elem.setType(T.text);
        elem.setKey(KI.UNIDAD);
        elem.setEnabled(false);
        elem.setVisible(bColVisible);

        elem = columns.add(null);
        elem.setName(getText(1587, "")); // Precio (LP)
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KI.PRECIO_LP);
        elem.setEnabled(false);
        elem.setVisible(bColVisible);

        elem = columns.add(null);
        elem.setName(getText(1586, "")); // Precio
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KI.PRECIO_USR);
        elem.setEnabled(Cairo.Security.silentHasPermissionTo(CS.EDIT_PRICE_PED));

        elem = columns.add(null);
        elem.setName(getText(1588, "")); // Precio c/desc.
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KI.PRECIO);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1581, "")); // Neto
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KI.NETO);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1582, "")); // IVA RI
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(KI.IVA_RI);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1583, "")); // IVA RNI
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(ST.money);
        elem.setKey(KI.IVA_RNI);
        elem.setEnabled(false);
        elem.setVisible(bColVisible);

        elem = columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(ST.money);
        elem.setKey(KI.IMPORTE);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI.IVA_RI_PERCENT);

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI.IVA_RNI_PERCENT);

        elem = columns.add(null);
        elem.setName(getText(1057, "")); // Centro de Costo
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CENTROS_DE_COSTO);
        elem.setKey(KI.CCOS_ID);
        elem.setVisible(bColVisible);

        grid.getRows().clear();
      };

      var loadItems = function(property) {

        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        rows.clear();

        for(var _i = 0, count = m.data.items.length; _i < count; _i += 1) {

          var row = rows.add(null, getValue(m.data.items[_i], CV.PVI_ID));

          elem = row.add(null);
          elem.setValue(getValue(m.data.items[_i], CV.PVI_ID));
          elem.setKey(KI.PVI_ID);

          elem = row.add(null);
          elem.setValue(getValue(m.data.items[_i], C.PR_NAME_VENTA));
          elem.setId(getValue(m.data.items[_i], C.PR_ID));
          elem.setKey(KI.PR_ID);

          elem = row.add(null);
          elem.setValue(getValue(m.data.items[_i], CV.PVI_DESCRIP));
          elem.setKey(KI.DESCRIP);

          elem = row.add(null);
          elem.setValue(getValue(m.data.items[_i], CV.PVI_CANTIDAD));
          elem.setKey(KI.CANTIDAD);

          elem = row.add(null);
          elem.setValue("");
          elem.setKey(KI.STOCK);

          elem = row.add(null);
          elem.setValue("");
          elem.setKey(KI.STOCK_REAL);

          elem = row.add(null);
          elem.setValue("");
          elem.setKey(KI.STOCK_PEDIDOS);

          elem = row.add(null);
          elem.setValue(getValue(m.data.items[_i], CV.PVI_DESCUENTO));
          elem.setKey(KI.DESCUENTO);

          elem = row.add(null);
          elem.setValue(getValue(m.data.items[_i], C.UN_NAME));
          elem.setKey(KI.UNIDAD);

          elem = row.add(null);
          elem.setValue(getValue(m.data.items[_i], CV.PVI_PRECIO_LISTA));
          elem.setKey(KI.PRECIO_LP);

          elem = row.add(null);
          elem.setValue(getValue(m.data.items[_i], CV.PVI_PRECIO_USR));
          elem.setKey(KI.PRECIO_USR);

          elem = row.add(null);
          elem.setValue(getValue(m.data.items[_i], CV.PVI_PRECIO));
          elem.setKey(KI.PRECIO);

          elem = row.add(null);
          elem.setValue(getValue(m.data.items[_i], CV.PVI_NETO));
          elem.setKey(KI.NETO);

          elem = row.add(null);
          elem.setValue(getValue(m.data.items[_i], CV.PVI_IVA_RI));
          elem.setKey(KI.IVA_RI);

          elem = row.add(null);
          elem.setValue(getValue(m.data.items[_i], CV.PVI_IVA_RNI));
          elem.setKey(KI.IVA_RNI);

          elem = row.add(null);
          elem.setValue(getValue(m.data.items[_i], CV.PVI_IMPORTE));
          elem.setKey(KI.IMPORTE);

          elem = row.add(null);
          if(m.bIva) {
            elem.setValue(getValue(m.data.items[_i], CV.PVI_IVA_RIPORC));
          }
          else {
            elem.setValue(0);
          }
          elem.setKey(KI.IVA_RI_PERCENT);

          elem = row.add(null);
          if(m.bIvaRni) {
            elem.setValue(getValue(m.data.items[_i], CV.PVI_IVA_RNIPORC));
          }
          else {
            elem.setValue(0);
          }
          elem.setKey(KI.IVA_RNI_PERCENT);

          elem = row.add(null);
          elem.setValue(getValue(m.data.items[_i], C.CCOS_NAME));
          elem.setId(getValue(m.data.items[_i], C.CCOS_ID));
          elem.setKey(KI.CCOS_ID);

        }

        return true;
      };

      var loadDataFromResponse = function(response) {
        var data = response.data;

        data.items = data.get('items');

        return data;
      };

      var load = function(id) {

        m.data = emptyData;

        return DB.getData("load[" + m.apiPath + "ventas/pedidoventa]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            var p = null;

            if(response.data.id !== NO_ID) {

              m.data = loadDataFromResponse(response);

              var data = response.data;

              m.id = valField(data, CV.PV_ID);
              m.numero = valField(data, CV.PV_NUMERO);
              m.nroDoc = valField(data, CV.PV_NRODOC);
              m.descrip = valField(data, CV.PV_DESCRIP);
              m.fecha = valField(data, CV.PV_FECHA);
              m.fechaEntrega = valField(data, CV.PV_FECHA_ENTREGA);
              m.neto = valField(data, CV.PV_NETO);
              m.ivaRi = valField(data, CV.PV_IVA_RI);
              m.ivaRni = valField(data, CV.PV_IVA_RNI);
              m.total = valField(data, CV.PV_TOTAL);
              m.subTotal = valField(data, CV.PV_SUBTOTAL);
              m.descuento1 = valField(data, CV.PV_DESCUENTO1);
              m.descuento2 = valField(data, CV.PV_DESCUENTO2);
              m.importeDesc1 = valField(data, CV.PV_IMPORTE_DESC1);
              m.importeDesc2 = valField(data, CV.PV_IMPORTE_DESC2);
              m.cliId = valField(data, C.CLI_ID);
              m.cliente = valField(data, C.CLI_NAME);
              m.ccosId = valField(data, C.CCOS_ID);
              m.centroCosto = valField(data, C.CCOS_NAME);
              m.sucId = valField(data, C.SUC_ID);
              m.sucursal = valField(data, C.SUC_NAME);
              m.docId = valField(data, C.DOC_ID);
              m.documento = valField(data, C.DOC_NAME);
              m.doctId = valField(data, C.DOCT_ID);
              m.lpId = valField(data, C.LP_ID);
              m.listaPrecio = valField(data, C.LP_NAME);
              m.cpgId = valField(data, C.CPG_ID);
              m.condicionPago = valField(data, C.CPG_NAME);
              m.ldId = valField(data, C.LD_ID);
              m.listaDescuento = valField(data, C.LD_NAME);
              m.estId = valField(data, C.EST_ID);
              m.estado = valField(data, C.EST_NAME);
              m.firmado = valField(data, CV.PV_FIRMADO);
              m.ramIdStock = valField(data, CV.RAM_ID_STOCK);
              m.ramaStock = valField(data, CV.RAMA_STOCK);
              m.docEditable = valField(data, C.DOC_EDITABLE);
              m.docEditMsg = valField(data, C.DOC_EDIT_MSG);

              m.venId = valField(data, C.VEN_ID);
              m.vendedor = valField(data, C.VEN_NAME);
              m.lgjId = valField(data, C.LGJ_ID);
              m.legajo = valField(data, C.LGJ_CODE);
              m.proIdOrigen = valField(data, C.PRO_ID_ORIGEN);
              m.proOrigen = valField(data, C.PRO_ORIGEN_NAME);
              m.proIdDestino = valField(data, C.PRO_ID_DESTINO);
              m.proDestino = valField(data, C.PRO_DESTINO_NAME);
              m.transId = valField(data, C.TRANS_ID);
              m.transporte = valField(data, C.TRANS_NAME);

              m.chofId = valField(data, C.CHOF_ID);
              m.chofer = valField(data, C.CHOF_NAME);

              m.camId = valField(data, C.CAM_ID);
              m.camion = valField(data, C.CAM_PATENTE);

              m.camIdSemi = valField(data, C.CAM_ID_SEMI);
              m.semi = valField(data, C.CAM_PATENTE_SEMI);

              m.destinatario = valField(data, CV.PV_DESTINATARIO);
              m.ordenCompra = valField(data, CV.PV_ORDEN_COMPRA);

              m.clisId = valField(data, C.CLIS_ID);
              m.clienteSucursal = valField(data, C.CLIS_NAME);

              m.taPropuesto = valField(data, C.TA_PROPUESTO);
              m.taMascara = valField(data, C.TA_MASCARA);

              m.bIva = valField(data, C.HAS_IVA_RI);
              m.bIvaRni = valField(data, C.HAS_IVA_RNI);

              m.lastDocId = m.docId;
              m.lastCliId = m.cliId;
              m.lastDocTipoPedido = valField(data, C.DOC_TIPO_PEDIDO);
              m.lastTransId = m.transId;
              m.lastChofId = m.chofId;
              m.lastDocName = m.documento;
              m.lastCliName = m.cliente;

            }
            else {
              m.id = NO_ID;
              m.numero = 0;
              m.nroDoc = "";
              m.descrip = "";
              m.fecha = Cairo.Dates.today();
              m.fechaEntrega = Cairo.Dates.tomorrow();
              m.neto = 0;
              m.ivaRi = 0;
              m.ivaRni = 0;
              m.total = 0;
              m.subTotal = 0;
              m.descuento1 = 0;
              m.descuento2 = 0;
              m.importeDesc1 = 0;
              m.importeDesc2 = 0;
              m.ccosId = NO_ID;
              m.centroCosto = "";
              m.doctId = NO_ID;
              m.lpId = NO_ID;
              m.ldId = NO_ID;
              m.cpgId = NO_ID;
              m.condicionPago = "";
              m.listaPrecio = "";
              m.listaDescuento = "";
              m.estId = NO_ID;
              m.estado = "";
              m.sucId = Cairo.User.getSucId();
              m.sucursal = Cairo.User.getSucName();
              m.firmado = false;

              m.ramIdStock = "0";
              m.ramaStock = "";

              m.clisId = NO_ID;
              m.clienteSucursal = "";

              m.venId = NO_ID;
              m.vendedor = "";
              m.lgjId = NO_ID;
              m.legajo = "";
              m.proIdOrigen = NO_ID;
              m.proOrigen = "";
              m.proIdDestino = NO_ID;
              m.proDestino = "";
              m.transId = NO_ID;
              m.transporte = "";
              m.chofId = NO_ID;
              m.chofer = "";
              m.camId = NO_ID;
              m.camion = "";
              m.camIdSemi = NO_ID;
              m.semi = "";
              m.destinatario = "";
              m.ordenCompra = "";

              m.taPropuesto = false;
              m.taMascara = "";

              m.docId = m.lastDocId;
              m.cliId = m.lastCliId;
              m.cliente = m.lastCliName;
              m.documento = m.lastDocName;

              m.lastTransId = NO_ID;
              m.lastChofId = NO_ID;

              m.bIvaRni = false;
              m.bIva = false;

              p = D.editableStatus(m.docId, CS.NEW_PEDIDO)
                .then(function(status) {
                  m.docEditable = status.editableStatus;
                  m.docEditMsg = status.message;
                  return true;
                });
            }

            return p || P.resolvedPromise(true);
          });
      };

      self.setFooter = function(footer) {
        m.footer = footer;
        m.footerProps = footer.getProperties();

        if(footer !== null) {
          m.footer.setIsDocument(true);
          m.footer.setIsFooter(true);
          m.footer.setView(m.dialog.getView());
        }
      };

      self.setItems = function(items) {
        m.items = items;
        m.itemsProps = m.items.getProperties();

        if(items !== null) {
          m.items.setIsDocument(true);
          m.items.setIsItems(true);
          m.items.setView(m.dialog.getView());
        }
      };

      var saveItems = function(mainRegister) {

        var transaction = DB.createTransaction();
        var orden = 0;

        transaction.setTable(CV.PEDIDO_VENTA_ITEM_TMP);

        var rows = getGrid(m.items, C_ITEMS).getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();
          register.setFieldId(CV.PVI_TMP_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var fields = register.getFields();

          var _countj = row.size();
          for(var _j = 0; _j < _countj; _j++) {

            var cell = row.item(_j);
            switch (cell.getKey()) {

              case KI.PVI_ID:
                if(m.copy) {
                  fields.add(CV.PVI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(CV.PVI_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KI.CANTIDAD:
                fields.add(CV.PVI_CANTIDAD, cell.getValue(), Types.double);
                break;

              case KI.DESCRIP:
                fields.add(CV.PVI_DESCRIP, cell.getValue(), Types.text);
                break;

              case KI.PRECIO:
                fields.add(CV.PVI_PRECIO, cell.getValue(), Types.currency);
                break;

              case KI.PRECIO_LP:
                fields.add(CV.PVI_PRECIO_LISTA, cell.getValue(), Types.currency);
                break;

              case KI.PRECIO_USR:
                fields.add(CV.PVI_PRECIO_USR, cell.getValue(), Types.currency);
                break;

              case KI.DESCUENTO:
                fields.add(CV.PVI_DESCUENTO, cell.getValue(), Types.text);
                break;

              case KI.IMPORTE:
                fields.add(CV.PVI_IMPORTE, cell.getValue(), Types.currency);
                break;

              case KI.NETO:
                fields.add(CV.PVI_NETO, cell.getValue(), Types.currency);
                break;

              case KI.IVA_RI:
                if(m.bIva) {
                  fields.add(CV.PVI_IVA_RI, cell.getValue(), Types.currency);
                }
                break;

              case KI.IVA_RNI:
                if(m.bIvaRni) {
                  fields.add(CV.PVI_IVA_RNI, cell.getValue(), Types.currency);
                }
                break;

              case KI.IVA_RI_PERCENT:
                  fields.add(CV.PVI_IVA_RIPORC, cell.getValue(), Types.double);
                break;

              case KI.IVA_RNI_PERCENT:
                  fields.add(CV.PVI_IVA_RNIPORC, cell.getValue(), Types.double);
                break;

              case KI.PR_ID:
                fields.add(C.PR_ID, cell.getId(), Types.id);
                break;

              case KI.CCOS_ID:
                fields.add(C.CCOS_ID, cell.getId(), Types.id);
                break;
            }
          }

          orden += 1;
          fields.add(CV.PVI_ORDEN, orden, Types.integer);

          transaction.addRegister(register);
        }

        if(m.itemsDeleted !== "" && m.id !== NO_ID && !m.copy) {

          transaction.setDeletedList(m.itemsDeleted);
        }

        mainRegister.addTransaction(transaction);
      };

      var docAsistTipo = function() {
        return m.lastDocTipoPedido;
      };
      
      var docDesdePresupuesto = function() {
        return docAsistTipo() === D.OrderSaleWizardType.presupuesto;
      };

      var showImporteAndIva = function(row) {
        var ivaRi = 0;
        var ivaRni = 0;

        var neto = cellFloat(row, KI.CANTIDAD) * cellFloat(row, KI.PRECIO);
        if(m.bIva) {
          ivaRi = (neto * cellFloat(row, KI.IVA_RI_PERCENT)) / 100;
        }
        if(m.bIvaRni) {
          ivaRni = (neto * cellFloat(row, KI.IVA_RNI_PERCENT)) / 100;
        }
        
        var importe = neto + ivaRi + ivaRni;

        getCell(row, KI.NETO).setValue(neto);
        getCell(row, KI.IVA_RI).setValue(ivaRi);
        getCell(row, KI.IVA_RNI).setValue(ivaRni);
        getCell(row, KI.IMPORTE).setValue(importe);
      };

      var updateTotals = function() { // TODO: Use of ByRef founded Private Sub updateTotals(ByRef Rows As CSInterfacesABM.cIABMGridRows)

        var rows = getGrid(m.items, C_ITEMS).getRows();

        var neto = 0;
        var ivaRi = 0;
        var ivaRni = 0;

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {
          var row = rows.item(_i);
          neto = neto + cellFloat(row, KI.NETO);
          ivaRi = ivaRi + cellFloat(row, KI.IVA_RI);
          ivaRni = ivaRni + cellFloat(row, KI.IVA_RNI);
        }

        var properties = m.footer.getProperties();
        properties.item(CV.PV_SUBTOTAL).setValue(neto);

        var desc1 = val(m.properties.item(CV.PV_DESCUENTO1).getValue());
        var desc2 = val(m.properties.item(CV.PV_DESCUENTO2).getValue());

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

        m.footer.refreshControls();
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

            if(m.bIva) {
              getCell(row, KI.IVA_RI_PERCENT).setValue(data.ri_percent_venta);
            }
            else {
              getCell(row, KI.IVA_RI_PERCENT).setValue(0);
            }

            if(m.bIvaRni) {
              getCell(row, KI.IVA_RNI_PERCENT).setValue(data.rni_percent_venta);
            }
            else {
              getCell(row, KI.IVA_RNI_PERCENT).setValue(0);
            }

            return true;
          });

        }

        return p || P.resolvedPromise(false);
      };

      var setDataProducto = function(row, prId) {

        var p = DB.getData(
          "load[" + m.apiPath + "general/producto/" + prId.toString() + "/stock/cliente]", getCliId());

        return p.whenSuccessWithResult(function(response) {
          getCell(row, KI.UNIDAD).setValue(valField(response.data, C.UN_NAME_VENTA));

          var cell = getCell(row, KI.CCOS_ID);
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
        if(docDesdePresupuesto() && m.id === NO_ID) {
          bState = false;
        }
        else if(m.docEditable) {
          bState = getDocId() !== NO_ID;
        }

        var _count = m.properties.size();
        for(var _i = 0; _i < _count; _i++) {
          var prop = m.properties.item(_i);
          if(prop.getKey() !== K.DOC_ID
            && prop.getKey() !== K.NUMERO
            && prop.getKey() !== K.EST_ID
            && prop.getKey() !== K.HIDE_COLS) {

            if(bState) {
              if(prop.getKey() !== K.NRO_DOC) {
                prop.setEnabled(bState);
              }
              else {
                prop.setEnabled(m.taPropuesto);
              }
            }
            else {
              prop.setEnabled(false);
            }
          }
        }

        var _count = m.itemsProps.size();
        for(var _i = 0; _i < _count; _i++) {
          m.itemsProps.item(_i).setEnabled(bState);
        }

        m.items.refreshEnabledState(m.itemsProps);
        m.dialog.refreshEnabledState(m.properties);
      };

      var setDataCliente = function() {
        var p;
        var property = m.properties.item(C.CLI_ID);

        if(m.lastCliId !== property.getSelectId()) {

          m.lastCliId = property.getSelectId();

          p = DB.getData(
            "load[" + m.apiPath + "general/cliente/" + m.lastCliId.toString() + "/info]", m.lastDocId);

          p = p.whenSuccessWithResult(function(response) {

            var lpId = valField(response.data, C.LP_ID);
            var lpName = valField(response.data, C.LP_NAME);
            var ldId = valField(response.data, C.LD_ID);
            var ldName = valField(response.data, C.LD_NAME);
            var venId = valField(response.data, C.VEN_ID);
            var transId = valField(response.data, C.TRANS_ID);
            var proId = valField(response.data, C.PRO_ID);
            var cpgId = valField(response.data, C.CPG_ID);
            var lpFilter = D.getListaPrecioForCliente(m.docId, m.cliId);
            var ldFilter = D.getListaDescuentoForCliente(m.docId, m.cliId);

            if(cpgId !== NO_ID) {

              var cpgName = valField(response.data, C.CPG_NAME);

              var prop = m.properties
                .item(C.CPG_ID)
                .setValue(cpgName)
                .setSelectId(cpgId);

              m.dialog.showValue(prop);
            }

            var prop = m.properties.item(C.LP_ID)
              .setSelectFilter(lpFilter);

            if(lpId !== NO_ID) {
              prop.setValue(lpName);
              prop.setSelectId(lpId);
            }

            m.dialog.showValue(prop);

            prop = m.properties.item(C.LD_ID);
            prop.setSelectFilter(ldFilter);

            if(ldId !== NO_ID) {
              prop.setValue(ldName);
              prop.setSelectId(ldId);
            }

            m.dialog.showValue(prop);

            if(venId !== NO_ID) {

              var venName = valField(response.data, C.VEN_NAME);

              var prop = m.properties
                .item(C.VEN_ID)
                .setValue(venName)
                .setSelectId(venId);

              m.dialog.showValue(prop);
            }

            if(transId !== NO_ID) {

              var transName = valField(response.data, C.TRANS_NAME);

              var prop = m.properties
                .item(C.TRANS_ID)
                .setValue(transName)
                .setSelectId(transId);

              m.dialog.showValue(prop);
            }

            if(proId !== NO_ID) {

              var proName = valField(response.data, C.PRO_NAME);

              var prop = m.properties
                .item(C.PRO_ID_DESTINO)
                .setValue(proName)
                .setSelectId(proId);

              m.dialog.showValue(prop);
            }

            var bLastIva = m.bIva;
            var ivaChanged = false;
            m.bIva = valField(response.data, C.HAS_IVA_RI);
            if(bLastIva !== m.bIva) { ivaChanged = true; }

            bLastIva = m.bIvaRni;
            m.bIvaRni = valField(response.data, C.HAS_IVA_RNI);
            if(bLastIva !== m.bIvaRni) { ivaChanged = true; }

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

      // TODO: dry this method it is copied in all documents
      //
      var signDocument = function() {

        if(m.id === NO_ID) {
          return M.showWarningWithFalse(getText(1592, ""));
          // Antes de poder firmar el documento debe guardarlo.
        }

        var refreshState = function(response) {

          m.estId = response.est_id;
          m.estado = response.estado;
          m.firmado = response.firmado;

          var prop = m.properties.item(Cairo.Constants.STATUS_ID);

          prop.setSelectId(m.estId);
          prop.setValue(m.estado);

          m.dialog.showValue(prop);
        };

        var p = null;

        if(m.firmado) {
          p = M.confirmViewYesDefault(
            getText(1594, ""), // Firmar
            getText(1593, "")  // El documento ya ha sido firmado desea borrar la firma
          );
        }

        p = p || P.resolvedPromise(true);

        p = p
          .whenSuccess(D.signDocument(m.doctId, m.id))
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

            m.lastCliId = NO_ID;
            m.lastCliName = "";

            return load(NO_ID)
              .whenSuccess(call(D.setDocNumberForCliente, m.lastCliId, m.docId, m.dialog))
              .then(function(enabled) { m.taPropuesto = enabled; })
              .then(refreshProperties);
          }
          else {
            return load(response.id)
              .whenSuccess(refreshProperties);
          }
        };
        return D.move(m.docId, moveTo)
          .whenSuccessWithResult(completeMove);
      };

      var refreshProperties = function() {

        m.properties.item(C.DOC_ID)
          .setSelectId(m.docId)
          .setSelectIntValue("")
          .setValue(m.documento);

        m.properties.item(CV.PV_FECHA)
          .setValue(m.fecha);

        m.properties.item(CV.PV_FECHA_ENTREGA)
          .setValue(m.fechaEntrega);

        m.properties.item(C.CLI_ID)
          .setSelectId(m.cliId)
          .setSelectIntValue("")
          .setValue(m.cliente);

        m.properties.item(Cairo.Constants.NUMBER_ID)
          .setValue(m.numero);

        m.properties.item(Cairo.Constants.STATUS_ID)
          .setValue(m.estado);

        m.properties.item(CV.PV_NRODOC)
          .setValue(m.nroDoc)
          .setTextMask(m.taMascara)
          .setTextAlign(Dialogs.TextAlign.right);

        m.properties.item(CV.PV_DESCUENTO1)
          .setValue(m.descuento1);

        m.properties.item(CV.PV_DESCUENTO2)
          .setValue(m.descuento2);

        if(val(m.ramIdStock) !== NO_ID) {
          m.properties.item(CV.RAM_ID_STOCK)
            .setSelectIntValue(m.ramIdStock)
            .setSelectId(val(m.ramIdStock))
            .setValue(m.ramaStock);
        }
        else {
          m.properties.item(CV.RAM_ID_STOCK)
            .setSelectIntValue(Cairo.UserConfig.getDeplRamId())
            .setSelectId(Cairo.UserConfig.getDeplId())
            .setValue(Cairo.UserConfig.getDeplName());
        }

        m.properties.item(C.CPG_ID)
          .setSelectId(m.cpgId)
          .setSelectIntValue("")
          .setValue(m.condicionPago);

        m.properties.item(C.LP_ID)
          .setSelectFilter(D.getListaPrecioForCliente(m.docId, m.cliId))
          .setSelectId(m.lpId)
          .setSelectIntValue("")
          .setValue(m.listaPrecio);

        m.properties.item(C.LD_ID)
          .setSelectFilter(D.getListaDescuentoForCliente(m.docId, m.cliId))
          .setSelectId(m.ldId)
          .setSelectIntValue("")
          .setValue(m.listaDescuento);

        m.properties.item(C.CCOS_ID)
          .setSelectId(m.ccosId)
          .setSelectIntValue("")
          .setValue(m.centroCosto);

        m.properties.item(C.SUC_ID)
          .setSelectId(m.sucId)
          .setSelectIntValue("")
          .setValue(m.sucursal);

        m.properties.item(C.VEN_ID)
          .setSelectId(m.venId)
          .setSelectIntValue("")
          .setValue(m.vendedor);

        m.properties.item(CV.PV_DESCRIP)
          .setValue(m.descrip);

        m.properties.item(C.LGJ_ID)
          .setSelectId(m.lgjId)
          .setSelectIntValue("")
          .setValue(m.legajo);

        m.properties.item(C.PRO_ID_ORIGEN)
          .setSelectId(m.proIdOrigen)
          .setSelectIntValue("")
          .setValue(m.proOrigen);

        m.properties.item(C.PRO_ID_DESTINO)
          .setSelectId(m.proIdDestino)
          .setSelectIntValue("")
          .setValue(m.proDestino);

        m.properties.item(C.TRANS_ID)
          .setSelectId(m.transId)
          .setSelectIntValue("")
          .setValue(m.transporte);

        m.properties.item(CV.PV_DESTINATARIO)
          .setValue(m.destinatario);

        m.properties.item(CV.PV_ORDEN_COMPRA)
          .setValue(m.ordenCompra);

        m.properties.item(C.CHOF_ID)
          .setSelectId(m.chofId)
          .setValue(m.chofer)
          .setSelectFilter(D.getSelectFilterChofer(m.transId));

        m.properties.item(C.CAM_ID)
          .setSelectId(m.camId)
          .setValue(m.camion)
          .setSelectFilter(D.getSelectFilterCamion(m.transId));

        m.properties.item(C.CAM_ID_SEMI)
          .setSelectId(m.camIdSemi)
          .setValue(m.semi)
          .setSelectFilter(D.getSelectFilterCamion(m.transId));

        m.properties.item(C.CLIS_ID)
          .setSelectId(m.clisId)
          .setSelectIntValue("")
          .setValue(m.clienteSucursal);

        m.dialog.showValues(m.dialog.getProperties());
        m.dialog.resetChanged();

        m.itemsDeleted = "";
        loadItems(getProperty(m.items, C_ITEMS));

        m.items.showValues(m.itemsProps);

        m.footerProps.item(CV.PV_SUBTOTAL)
          .setValue(m.subTotal);

        m.footerProps.item(CV.PV_IMPORTE_DESC1)
          .setValue(m.importeDesc1);

        m.footerProps.item(CV.PV_IMPORTE_DESC2)
          .setValue(m.importeDesc2);

        m.footerProps.item(CV.PV_NETO)
          .setValue(m.neto);

        m.footerProps.item(CV.PV_IVA_RI)
          .setValue(m.ivaRi);

        m.footerProps.item(CV.PV_IVA_RNI)
          .setValue(m.ivaRni);

        m.footerProps.item(CV.PV_TOTAL)
          .setValue(m.total);

        m.footer.showValues(m.footerProps);

        setEnabled();

        return D.showDataAddCliente(Cairo.UserConfig.getShowDataAddInVentas(), m.dialog);
      };

      var showApply = function() {

        if(!Cairo.Security.docHasPermissionTo(
          CS.MODIFY_APLIC,
          m.docId,
          Cairo.Security.ActionTypes.apply)) {
          return false;
        }

        if(m.applyEditor === null) {
          m.applyEditor = Cairo.PedidoVentaAplic.createObject();
        }
        else {
          if(m.applyEditor.getId() !== m.id) {
            m.applyEditor.setClient(null);
            m.applyEditor = Cairo.PedidoVentaAplic.createObject();
          }
        }

        m.applyEditor.setClient(self);

        m.applyEditor.show(
            m.id,
            m.total,
            m.nroDoc,
            m.cliId,
            m.cliente,
            m.sucId,
            m.docId,
            m.doctId === D.Types.DEVOLUCION_PEDIDO_VTA).then(function(result) {
            if(result !== true) {
              m.applyEditor = null;
            }
          });
      };

      var setDataTransporte = function() {
        var p;
        var property = m.properties.item(C.TRANS_ID);

        if(m.lastTransId !== property.getSelectId()) {

          m.lastTransId = property.getSelectId();

          p = DB.getData(
            "load[" + m.apiPath + "general/transporte/" + m.lastTransId.toString() + "/info]");

          p = p.whenSuccessWithResult(function(response) {

            var chofId = valField(response.data, C.CHOF_ID);
            var camId = valField(response.data, C.CAM_ID);
            var chofer = valField(response.data, C.CHOF_NAME);
            var camion = valField(response.data, C.CAM_CODE);

            property = m.properties.item(C.CHOF_ID);
            property.setSelectFilter(D.getSelectFilterChofer(m.transId));

            if(camId !== NO_ID) {

              property.setValue(chofer);
              property.setSelectId(chofId);

            }

            m.dialog.showValue(property);

            property = m.properties.item(C.CAM_ID);
            property.setSelectFilter(D.getSelectFilterCamion(m.transId));

            if(camId !== NO_ID) {

              property.setValue(camion);
              property.setSelectId(camId);

            }

            m.dialog.showValue(property);

          });
        }
        return p || P.resolvedPromise(false);
      };

      var setDataChofer = function() {
        var p;
        var property = m.properties.item(C.CHOF_ID);

        if(m.lastChofId !== property.getSelectId()) {
          m.lastChofId = property.getSelectId();

          p = DB.getData(
            "load[" + m.apiPath + "general/chofer/" + m.lastChofId.toString() + "/info]");

          p = p.whenSuccessWithResult(function(response) {

            var camId = valField(response.data, C.CAM_ID);
            var camion = valField(response.data, C.CAM_CODE);
            var camIdSemi = valField(response.data, C.CAM_ID_SEMI);
            var semi = valField(response.data, C.CAM_CODE_SEMI);

            property = m.properties.item(C.CAM_ID); // Camion

            if(camId !== NO_ID) {

              property.setValue(camion);
              property.setSelectId(camId);

            }

            m.dialog.showValue(property);

            property = m.properties.item(C.CAM_ID_SEMI); // Semi

            if(camIdSemi !== NO_ID) {

              property.setValue(semi);
              property.setSelectId(camIdSemi);

            }

            m.dialog.showValue(property);

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
        return [m.id];
      };

      var getCliId = function() {
        return m.properties.item(C.CLI_ID).getSelectId();
      };

      var getItems = function() {
        return m.items.getProperties().item(C_ITEMS);
      };

      var showHideCols = function(onlyStock) {

        if(! m.dialog.getInSave()) {

          var visible = val(m.properties.item(Cairo.Constants.HIDE_COLUMNS).getValue()) === 0;
          var prop = getItems();

          m.dialog.drawGrid(prop, false);

          var columns = prop.getGrid().getColumns();

          for(var i = 1, count = columns.count(); i < count; i++) {
            switch (columns.item(i).getKey()) {

              case KI.DESCUENTO:
              case KI.UNIDAD:
              case KI.PRECIO_LP:
              case KI.IVA_RNI:

                if(! onlyStock) {
                  columns.item(i).setVisible(visible);
                  m.dialog.refreshColumnPropertiesByIndex(prop, i);
                }
                break;
            }
          }
        }
        m.dialog.drawGrid(prop, true);
      };

      var updateIva = function() {
        var p = P.resolvedPromise(true);
        var rows = getItems().getGrid().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {
          var row = rows.item(_i);
          var cell = getCell(row, KI.PR_ID);
          p = p
            .then(call(setTasasImpositivas, row, cell.getId(), cell.getValue()))
          ;
          showImporteAndIva(row);
        }

        m.dialog.showValue(getItems(), true);

        return p;
      };

      var getFileNamePostFix = function() {
        return m.cliente.substring(0, 50) + "-" + m.nroDoc;
      };

      var showMenuDocAction = function() {
        // Remitir el pedido|Facturar el pedido|Show stock info
        var menu = getText(3966, "") + "~1|" + getText(3967, "") + "~2|" + getText("9999"); // TODO: complete language
        m.dialog.showPopMenu(menu);
      };

      var setColorBackground = function() {
        if(Cairo.UserConfig.getUseColorsInDocuments()) {
          if(m.lastDoctId === D.Types.DEVOLUCION_PEDIDO_VTA) {
            m.dialog.setBackColorTabMain("#ffaa00");
          }
          else {
            m.dialog.setBackColorTabMain("white");
          }
        }
      };

      var initialize = function() {
        try {

          m.prvIds = [];

          Cairo.UserConfig.validatePV();

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "initialize", C_MODULE, "");
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

      Cairo.LoadingMessage.show("Pedido de Ventas", "Loading Pedido de Ventas from CrowSoft Cairo server.");
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

      var C_FECHA_INI = "FechaIni";
      var C_FECHA_FIN = "FechaFin";

      var K = {
        FECHA_INI : 1,
        FECHA_FIN : 2,
        CLI_ID : 4,
        EST_ID : 5,
        CCOS_ID : 6,
        SUC_ID : 7,
        VEN_ID : 8,
        DOC_ID : 9,
        CPG_ID : 10,
        EMP_ID : 100
      };

      var emptyData = {
        ventaModos: []
      };
      
      var m = {
        fechaIni: null,
        fechaFin: null,
        cliId: "",
        cliente: "",
        estId: "",
        estado: "",
        ccosId: "",
        centroCosto: "",
        sucId: "",
        sucursal: "",
        venId: "",
        vendedor: "",
        docId: "",
        documento: "",
        cpgId: "",
        condicionPago: "",
        empId: "",
        empresa: "",
        fechaIniV: "",
        fechaFinV: "",

        dialog: null,
        properties: null,

        listController: null,

        title: "",

        menuLoaded: false,

        menuShowRemito: 0,
        menuShowPacking: 0,
        menuShowFactura: 0,

        menuShowNotes: 0,
        menuShowInfoCli: 0,
        menuAddNote: 0,
        menuShowApply: 0,
        menuSign: 0,
        menuShowFacturaAuto: 0,
        menuEditCliente: 0,

        menuModoPago: [],
        data: emptyData,

        apiPath: DB.getAPIVersion()
      };

      var SAVE_ERROR = getText(2179, ""); // Error al grabar los párametros de navegación de PedidoVenta

      self.list = function() {
        initialize();
        return load()
          .whenSuccess(loadCollection);
      };

      self.edit = function(pvId) {
        m.listController.edit(pvId);
      };

      self.deleteItem = function(pvId) {
        return m.listController.destroy(pvId);
      };

      self.showDocDigital = function() {
        var _rtn = false;

        try {

          var pvId = m.dialog.getId();
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

        var property = m.properties.item(C.CLI_ID);
        property.setValue(name);
        property.setSelectId(id);
        property.setSelectIntValue(id);
        m.dialog.showValue(m.properties.item(C.CLI_ID));
      };

      self.processMenu = function(index) {
        try {

          switch (index) {

            case m.menuShowFactura:
              showFactura(false, false, NO_ID, false);
              break;

            case m.menuShowFacturaAuto:
              showFactura(true, false, NO_ID, false);
              break;

            case m.menuShowPacking:
              showPacking();
              break;

            case m.menuShowRemito:
              showRemito();
              break;

            case m.menuShowInfoCli:
              D.showInfo(Cairo.Tables.CLIENTE, getCliId());
              break;

            case m.menuShowNotes:
              showNotes();
              break;

            case m.menuAddNote:
              addNote();
              break;

            case m.menuShowApply:
              showApply();
              break;

            case m.menuSign:
              signDocument();
              break;

            case m.menuEditCliente:
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

        m.properties.clear();

        c = m.properties.add(null, C_FECHA_INI);
        c.setType(T.date);
        c.setName(getText(1203, "")); // Fecha desde
        c.setKey(K.FECHA_INI);
        c.setValue((m.fechaIniV !== "") ? m.fechaIniV : m.fechaIni);

        c = m.properties.add(null, C_FECHA_FIN);
        c.setType(T.date);
        c.setName(getText(1204, "")); // Fecha hasta
        c.setKey(K.FECHA_FIN);
        c.setValue((m.fechaFinV !== "") ? m.fechaFinV : m.fechaFin);

        c = m.properties.add(null, C.CLI_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.CLIENTE);
        c.setName(getText(1150, "")); // Proveedor
        c.setKey(K.CLI_ID);
        c.setValue(m.cliente);
        c.setSelectId(val(m.cliId));
        c.setSelectIntValue(m.cliId);

        c = m.properties.add(null, C.EST_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.ESTADOS);
        c.setName(getText(1568, "")); // Estado
        c.setKey(K.EST_ID);
        c.setValue(m.estado);
        c.setSelectId(val(m.estId));
        c.setSelectIntValue(m.estId);

        c = m.properties.add(null, C.CCOS_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.CENTROS_DE_COSTO);
        c.setName(getText(1057, "")); // Centro de Costos
        c.setKey(K.CCOS_ID);
        c.setValue(m.centroCosto);
        c.setSelectId(val(m.ccosId));
        c.setSelectIntValue(m.ccosId);

        c = m.properties.add(null, C.SUC_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.SUCURSAL);
        c.setName(getText(1281, "")); // Sucursal
        c.setKey(K.SUC_ID);
        c.setValue(m.sucursal);
        c.setSelectId(val(m.sucId));
        c.setSelectIntValue(m.sucId);

        c = m.properties.add(null, C.VEN_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.VENDEDOR);
        c.setName(getText(1510, "")); // Vendedor
        c.setKey(K.VEN_ID);
        c.setValue(m.vendedor);
        c.setSelectId(val(m.venId));
        c.setSelectIntValue(m.venId);

        c = m.properties.add(null, C.DOC_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.DOCUMENTO);
        c.setName(getText(1567, "")); // Documentos
        c.setKey(K.DOC_ID);
        c.setValue(m.documento);
        c.setSelectId(val(m.docId));
        c.setSelectIntValue(m.docId);
        c.setSelectFilter(D.PEDIDO_VENTAS_LIST_DOC_FILTER);

        c = m.properties.add(null, C.CPG_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.CONDICIONES_DE_PAGO);
        c.setName(getText(1395, "")); // Condicion de pago
        c.setKey(K.CPG_ID);
        c.setValue(m.condicionPago);
        c.setSelectId(val(m.cpgId));
        c.setSelectIntValue(m.cpgId);

        c = m.properties.add(null, C.EMP_ID);
        c.setType(T.select);
        c.setSelectTable(Cairo.Tables.EMPRESA);
        c.setName(getText(1114, "")); // Empresa
        c.setKey(K.EMP_ID);
        c.setValue(m.empresa);
        c.setSelectId(val(m.empId));
        c.setSelectIntValue(m.empId);

        createMenu();
        if(!m.dialog.showDocumentList(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {
        return m.dialog.showValues(m.properties);
      };

      var loadDataFromResponse = function(response) {
        var data = response.data;

        data.ventaModos = data.get('ventaModos');

        return data;
      };
      
      var load = function() {

        m.data = emptyData;
        
        return DB.getData("load[" + m.apiPath + "ventas/pedidoventas/parameters]").then(
          function(response) {

            m.empId = Cairo.Company.getId();
            m.empresa = Cairo.Company.getName();

            if(response.success !== true) { return false; }

            //
            // this is a special case. venta_modos list is not related with params
            //
            m.data = loadDataFromResponse(response);

            if(response.data.id === NO_ID) {

              m.fechaIniV = "";
              m.fechaIni = Cairo.Dates.today();
              m.fechaFinV = "";
              m.fechaFin = Cairo.Dates.DateNames.getDateByName('h-60');

              m.cliId = NO_ID;
              m.cliente = "";
              m.estId = NO_ID;
              m.estado = "";
              m.ccosId = NO_ID;
              m.centroCosto = "";
              m.sucId = NO_ID;
              m.sucursal = "";
              m.venId = NO_ID;
              m.vendedor = "";
              m.docId = NO_ID;
              m.documento = "";
              m.cpgId = NO_ID;
              m.condicionPago = "";

            }
            else {

              m.fechaIniV = valField(response.data, C.FROM);
              m.fechaIni = valField(response.data, C.FROM);
              m.fechaIni = isDate(m.fechaIni) ? getDateValue(m.fechaIni) : today();

              m.fechaFinV = valField(response.data, C.TO);
              m.fechaFin = valField(response.data, C.TO);
              m.fechaFin = isDate(m.fechaFin) ? getDateValue(m.fechaFin) : today();

              m.cliId = valField(response.data, C.CLI_ID);
              m.estId = valField(response.data, C.EST_ID);
              m.ccosId = valField(response.data, C.CCOS_ID);
              m.sucId = valField(response.data, C.SUC_ID);
              m.venId = valField(response.data, C.VEN_ID);
              m.docId = valField(response.data, C.DOC_ID);
              m.cpgId = valField(response.data, C.CPG_ID);
              m.empId = valField(response.data, C.EMP_ID);

              m.cliente = valField(response.data, C.CLI_NAME);
              m.estado = valField(response.data, C.EST_NAME);
              m.centroCosto = valField(response.data, C.CCOS_NAME);
              m.sucursal = valField(response.data, C.SUC_NAME);
              m.vendedor = valField(response.data, C.VEN_NAME);
              m.documento = valField(response.data, C.DOC_NAME);
              m.condicionPago = valField(response.data, C.CPG_NAME);
              m.empresa = valField(response.data, C.EMP_NAME);

            }
            return true;
          }
        );
      };

      self.getProperties = function() {
        return m.properties;
      };

      self.propertyChange = function(key) {

        var property;
        var properties = m.properties;

        switch (key) {

          case K.FECHA_INI:

            property = properties.item(C_FECHA_INI);

            if(property.getSelectIntValue() !== "") {
              m.fechaIniV = property.getSelectIntValue();
              m.fechaIni = Cairo.Dates.DateNames.getDateByName(m.fechaIniV);
            }
            else if(isDate(property.getValue())) {
              m.fechaIniV = "";
              m.fechaIni = property.getValue();
            }
            else {
              m.fechaIniV = "";
              property.setValue(m.fechaIni);
            }
            break;

          case K.FECHA_FIN:

            property = properties.item(C_FECHA_FIN);

            if(property.getSelectIntValue() !== "") {
              m.fechaFinV = property.getSelectIntValue();
              m.fechaFin = Cairo.Dates.DateNames.getDateByName(m.fechaFinV);
            }
            else if(isDate(property.getValue())) {
              m.fechaFinV = "";
              m.fechaFin = property.getValue();
            }
            else {
              m.fechaFinV = "";
              property.setValue(m.fechaFin);
            }
            break;

          case K.EST_ID:
            var property = properties.item(C.EST_ID);
            m.estado = property.getValue();
            m.estId = property.getSelectIntValue();
            break;

          case K.CLI_ID:
            var property = properties.item(C.CLI_ID);
            m.cliente = property.getValue();
            m.cliId = property.getSelectIntValue();
            break;

          case K.CCOS_ID:
            var property = properties.item(C.CCOS_ID);
            m.centroCosto = property.getValue();
            m.ccosId = property.getSelectIntValue();
            break;

          case K.SUC_ID:
            var property = properties.item(C.SUC_ID);
            m.sucursal = property.getValue();
            m.sucId = property.getSelectIntValue();
            break;

          case K.VEN_ID:
            var property = properties.item(C.VEN_ID);
            m.vendedor = property.getValue();
            m.venId = property.getSelectIntValue();
            break;

          case K.DOC_ID:
            var property = properties.item(C.DOC_ID);
            m.documento = property.getValue();
            m.docId = property.getSelectIntValue();
            break;

          case K.CPG_ID:
            var property = properties.item(C.CPG_ID);
            m.condicionPago = property.getValue();
            m.cpgId = property.getSelectIntValue();
            break;

          case K.EMP_ID:
            var property = properties.item(C.EMP_ID);
            m.empresa = property.getValue();
            m.empId = property.getSelectIntValue();
            break;
        }

        return true;
      };

      self.refresh = function() {

        var startDate;
        if(Cairo.Dates.DateNames.getDateNames().contains(m.fechaIniV)) {
          startDate = Cairo.Dates.DateNames.getDateByName(m.fechaIniV);
        }
        else {
          startDate = m.fechaIni
        }

        var endDate;
        if(Cairo.Dates.DateNames.getDateNames().contains(m.fechaFinV)) {
          endDate = Cairo.Dates.DateNames.getDateByName(m.fechaFinV);
        }
        else {
          endDate = m.fechaFin
        }

        endDate = Cairo.Dates.DateNames.addToDate("d", 1, endDate);

        startDate = DB.sqlDate(startDate);
        endDate = DB.sqlDate(endDate);

        var params = {
          from: startDate,
          to: endDate,
          cliId: m.cliId,
          estId: m.estId,
          ccosId: m.ccosId,
          sucId: m.sucId,
          venId: m.venId,
          docId: m.docId,
          cpgId: m.cpgId,
          empId: m.empId
        };

        return DB.getData("load[" + m.apiPath + "ventas/pedidoventas]", null, params);
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.LDP_ID);
        register.setTable(C.LISTA_DOCUMENTO_PARAMETRO);

        register.setPath(m.apiPath + "ventas/pedidoventas");

        register.setId(Cairo.Constants.NEW_ID);

        var _count = m.dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {

          var property = m.dialog.getProperties().item(_i);

          switch (property.getKey()) {

            case K.FECHA_INI:
              var value = property.getSelectIntValue();
              if(value === "") { value = property.getValue(); }
              fields.add(C.FROM, value, Types.text);
              break;

            case K.FECHA_FIN:
              var value = property.getSelectIntValue();
              if(value === "") { value = property.getValue(); }
              fields.add(C.TO, value, Types.text);
              break;

            case K.CLI_ID:
              fields.add(C.CLI_ID, property.getSelectIntValue(), Types.text);
              break;

            case K.EST_ID:
              fields.add(C.EST_ID, property.getSelectIntValue(), Types.text);
              break;

            case K.CCOS_ID:
              fields.add(C.CCOS_ID, property.getSelectIntValue(), Types.text);
              break;

            case K.SUC_ID:
              fields.add(C.SUC_ID, property.getSelectIntValue(), Types.text);
              break;

            case K.VEN_ID:
              fields.add(C.VEN_ID, property.getSelectIntValue(), Types.text);
              break;

            case K.DOC_ID:
              fields.add(C.DOC_ID, property.getSelectIntValue(), Types.text);
              break;

            case K.CPG_ID:
              fields.add(C.CPG_ID, property.getSelectIntValue(), Types.text);
              break;

            case K.EMP_ID:
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
        return "#venta/pedidosdeventa";
      };

      self.getEditorName = function() {
        return "pedidoventas";
      };

      self.getTitle = function() {
        return m.title;
      };

      self.validate = function() {
        return P.resolvedPromise(true);
      };

      self.setDialog = function(dialog) {
        m.dialog = dialog;
        m.properties = dialog.getProperties();
      };

      self.setListController = function(controller) {
        m.listController = controller;
      };

      var createMenu = function() {

        if(m.menuLoaded) { return; }

        m.menuLoaded = true;

        m.dialog.clearMenu();

        m.menuEditCliente = m.dialog.addMenu(getText(5038, "")); // Editar Cliente
        m.dialog.addMenu("-");

        addMenuModoPago();

        m.menuShowRemito = m.dialog.addMenu(getText(1612, "")); // Remitir
        m.menuShowPacking = m.dialog.addMenu(getText(1602, "")); // Packing List
        m.menuShowFactura = m.dialog.addMenu(getText(1613, "")); // Facturar
        m.menuShowFacturaAuto = m.dialog.addMenu(getText(5039, "")); // Facturar Automático
        m.dialog.addMenu("-");

        m.menuSign = m.dialog.addMenu(getText(1594, "")); // Firmar
        m.dialog.addMenu("-");

        m.menuShowInfoCli = m.dialog.addMenu(getText(1614, ""));
        m.menuAddNote = m.dialog.addMenu(getText(1615, "")); // Agregar Nota
        m.menuShowNotes = m.dialog.addMenu(getText(1616, "")); // Ver Notas
        m.dialog.addMenu("-");

        m.menuShowApply = m.dialog.addMenu(getText(1617, "")); // Ver Aplicaciones
      };

      // show a list of menus to allow creating an invoice
      // without requiring payment methods because the
      // the account is defined in sale mode
      //
      var addMenuModoPago = function() {

        var count = m.data.ventaModos.length;

        if (count > 0) {

          m.dialog.addMenu("-");

          for(var _i = 0; _i < count; _i += 1) {

            var menuId = m.dialog.addMenu(getValue(m.data.ventaModos[_i], C.VM_NAME));
            var isContado = getValue(m.data.ventaModos[_i], C.VM_CTA_CTE) !== C.VentaModoCtaCte.hojaRuta;

            m.menuModoPago.push({
              vmId: getValue(m.data.ventaModos[_i], C.VM_ID),
              menuId: menuId,
              isContado: isContado,
              cueId: getValue(m.data.ventaModos[_i], C.CUE_ID)
            });

            m.dialog.addMenu("-");
          }
        }
      };

      var processModoPago = function(idMenu) {
        for(var i = 0, count = m.menuModoPago.length; i < count; i++) {
          if(m.menuModoPago[i].menuId === idMenu) {

            if(m.menuModoPago[i].isContado) {
              showFactura(true, true, m.menuModoPago[i].cueId, false);
            }
            else {
              showFactura(true, false, NO_ID, true);
            }
          }
        }
      };

      var showNotes = function() {
        var fcId = m.dialog.getId();
        return DB.getData("load[" + m.apiPath + "ventas/pedidoventa/notes]", fcId)
          .whenSuccessWithResult(D.showNotes);
      };

      var addNote = function() {
        var pvId = m.dialog.getId();
        return D.addNote(D.Types.PEDIDO_VENTA, pvId, false);
      };

      var editCliente = function() {
        var cliId = getCliId();
        if(cliId === NO_ID) { return; }
        Cairo.Cliente.Edit.Controller.edit(cliId);
      };

      var signDocument = function() {
        var pvId = m.dialog.getId();

        if(pvId === NO_ID) {
          return P.resolvedPromise(true);
        }

        var refreshRow = function(response) {
          m.dialog.refreshRow(response.data);
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

        return D.getDocumentSignStatus(D.Types.PEDIDO_VENTA, pvId)
            .whenSuccessWithResult(getAction)
            .whenSuccess(D.signDocument(D.Types.PEDIDO_VENTA, pvId))
            .whenSuccessWithResult(refreshRow)
          ;
      };

      var showApply = function() {

        var showEditor = function(info) {
          if(!Cairo.Security.docHasPermissionTo(
            CS.MODIFY_APLIC,
            m.docId,
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
            info.doct_id === D.Types.DEVOLUCION_PEDIDO_VTA,
            info.emp_id,
            info.empresa);
        };

        var pvId = m.dialog.getId();
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
        return m.dialog.getIds();
      };

      var initialize = function() {
        try {
          m.title = getText(1557, ""); // Pedidos de Venta
          m.dialog.setHaveDetail(true);
          m.dialog.setStartRowText(4);
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "initialize", C_MODULE, "");
        }
      };

      self.terminate = function() {
        try {
          m.dialog = null;
          m.properties = null;
          m.listController = null;
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

        var createListDialog = function() {

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
              Cairo.LoadingMessage.show("PedidoVenta", "Loading Pedido de Ventas from CrowSoft Cairo server.");

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
          Cairo.LoadingMessage.show("PedidoVenta", "Loading Pedido de Ventas from CrowSoft Cairo server.");

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
