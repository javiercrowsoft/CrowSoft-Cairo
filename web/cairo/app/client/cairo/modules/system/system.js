(function() {
  "use strict";

  var C = Cairo.General.Constants;
  var CC = Cairo.Compras.Constants;
  var valField = Cairo.Database.valField;
  var bToI = Cairo.Util.boolToInt;

  // this file will contain all the code translated from cPublicDoc
  // the functions in cPublicDoc will be grouped by functionality
  // ex:
  //     addMultiRowsPurchase will be put in the object Selection
  //     setDocumentForDoctId will be put in the object Documents
  //     wizAddNewDocProperties will be put in object Wizards (and the wiz prefix will be removed)

  Cairo.Selections = {};

  var getAmountForId = function(prId, arrayInfo) {
    for(var k = 0, count = arrayInfo.length; k < count; k += 1) {
      if(arrayInfo[k][0] === prId) {
        return arrayInfo[k][1];
      }
    }
  };

  var addMultiRows = function(ids, virtualRow, amountKey, columnName) {
    var vArrayInfo = [];
    var arrayInfo = ids.split(",");
    ids = "";

    for(var t = 0, count = arrayInfo.length; t < count; t += 1) {
      vArrayInfo.push(arrayInfo[t].split("|"));
      ids = ids + vArrayInfo[t][0] + ",";
    }

    ids = Cairo.Util.removeLastColon(ids);

    var apiPath = Cairo.Database.getAPIVersion();
    return Cairo.Database.getData("load[" + apiPath + "general/producto/list]", ids).then(
      function(response) {

        if(response.success === true) {

          var vIds2 = ids.split(",");
          var vIds = [];

          for(var i = 0, z = vIds2.length; i < z; i += 1) {
            var bFound = false;
            for(var j = 0, y = vIds.length; j < y; j += 1) {

              if(vIds2[i] = vIds[j]) {
                bFound = true;
                break;
              }

            }
            if(bFound === false) {
              vIds.push(vIds2[i]);
            }
          }

          //
          // we must respect the selection order
          //

          var items = response.data.get('items');
          var getValue = Cairo.Database.getValue;

          for(var i = 0, z = vIds.length; i < z; i += 1) {

            for(var j = 0, y = items.length; j < y; j += 1) {
              var prId = getValue(items[j], C.PR_ID);
              virtualRow.setColAmountKey(amountKey);
              if(Cairo.Util.val(vIds[i]) === prId) {
                virtualRow.getNewId().push(prId);
                virtualRow.getNewValue().push(getValue(items[j], columnName));
                virtualRow.getNewAmount().push(getAmountForId(prId, vArrayInfo))
                break;
              }
            }
          }

          virtualRow.setRowsToAdd(virtualRow.getNewId().length);
        }
        return virtualRow;
      }
    );
  };
  
  Cairo.Selections.addMultiRowsPurchase = function(ids, virtualRow, amountKey) {
    return addMultiRows(ids, virtualRow, amountKey, C.PR_NAME_COMPRA);
  };

  Cairo.Selections.addMultiRowsSale = function(ids, virtualRow, amountKey) {
    return addMultiRows(ids, virtualRow, amountKey, C.PR_NAME_VENTA);
  };

  Cairo.Documents = {};

  Cairo.Documents.Constants = {
    DOC_CHANGED: -2,
    TO_COMERCIAL_ID: 1,
    TO_COMERCIAL: Cairo.Language.getText(1014, "") // Comercial
  }

  Cairo.Documents.Status = {
    error: 0,
    pendiente: 1,
    pendienteDespacho: 2,
    pendienteCredito: 3,
    pendienteFirma: 4,
    finalizado: 5,
    rechazado: 6,
    anulado: 7
  };

  Cairo.Documents.Types = {
    FACTURA_VENTA: 1,
    FACTURA_COMPRA: 2,
    REMITO_VENTA: 3,
    REMITO_COMPRA: 4,
    PEDIDO_VENTA: 5,
    PEDIDO_COMPRA: 6,
    NOTA_CREDITO_VENTA: 7,
    NOTA_CREDITO_COMPRA: 8,
    NOTA_DEBITO_VENTA: 9,
    NOTA_DEBITO_COMPRA: 10,
    PRESUPUESTO_VENTA: 11,
    PRESUPUESTO_COMPRA: 12,
    COBRANZA: 13,
    TRASFERENCIA_STOCK: 14,
    ASIENTO_CONTABLE: 15,
    ORDEN_PAGO: 16,
    DEPOSITO_BANCO: 17,
    PRESUPUESTO_ENVIO: 18,
    PERMISO_EMBARQUE: 19,
    MANIFIESTO_CARGA: 20,
    PACKING_LIST: 21,
    DEVOLUCION_PEDIDO_VTA: 22,
    DEVOLUCION_PEDIDO_CPRA: 23,
    DEVOLUCION_REMITO_VTA: 24,
    DEVOLUCION_REMITO_CPRA: 25,
    MOVIMIENTO_FONDO: 26,
    RECUENTO_STOCK: 28,
    IMPORTACION_TEMP: 29,
    PARTE_PROD_KIT: 30,
    PACKING_LIST_DEVOLUCION: 31,
    DEPOSITO_CUPON: 32,
    RESOLUCION_CUPON: 33,
    PARTE_DESARME_KIT: 34,
    ORDEN_COMPRA: 35,
    DEVOLUCION_ORDEN_CPRA: 36,
    COTIZACION_COMPRA: 37,
    DEVOLUCION_COTIZACION_CPRA: 38,
    DEVOLUCION_PRESU_VTA: 39,
    DEVOLUCION_PRESU_CPRA: 40,
    DEVOLUCION_MANIFIESTO: 41,
    ORDEN_SERVICIO: 42,
    PARTE_REPARACION: 43,
    STOCK_PROVEEDOR: 44,
    STOCK_CLIENTE: 45,
    ORDEN_PROD_KIT: 46,
    LIQUIDACION: 47
  
    /*
    * NOTICE:
    * 
    * this enum is repeated in sp_doc_set_impreso
    * it is used to set the document as printed
    * if you change this enum you must update the copy
    * in sp_doc_set_impreso
    * 
    * */
  };
  
  Cairo.Documents.InvoiceWizardType = {
    directa: 0,
    pedido: 1,
    remito: 2,
    packingList: 3,
    proyecto: 4,
    orden: 5
  };

  Cairo.Documents.ReceiptType = {
    original: 1,
    fax: 2,
    photocopy: 3,
    duplicate: 4
  };

  Cairo.Documents.getDocNumberForProveedor = function(provId, docId, dialog) {
    var apiPath = Cairo.Database.getAPIVersion();
    return Cairo.Database.getData("load[" + apiPath + "documento/" + docId.toString() + "/supplier/" + provId.toString() + "/next_number]").then(
      function(response) {

        var property = dialog.getProperties().item(CC.FC_NRODOC);
        var number = "";
        var mask = "";
        var enabled = false;

        if(response.success === true) {
          number = valField(response.data, C.TA_NUMBER);
          mask = valField(response.data, C.TA_MASCARA);
          enabled = valField(response.data, C.TA_ENABLED);
        }

        property.setValue(number);
        property.setTextMask(mask);
        property.setEnabled(enabled);

        dialog.showValue(property);

        return enabled;
      }
    );
  };

  Cairo.Documents.docInvalidate = function(doctId, id, dialog) {
    var p;

    if(id === Cairo.Constants.NO_ID) {
                                             // you must save before invalidate
      return Cairo.Modal.showWarningWithFail(Cairo.Language.getText(2911, ""));
    }
    else {

      var apiPath = Cairo.Database.getAPIVersion();
      p = Cairo.Database.getData("load[" + apiPath + "documento/" + doctId.toString() + "/invalidate_status]", id);

      p.then(function(response) {

        if(response.success === true) {

          var p = null;

          var isEditable = valField(response.data, C.DOC_EDITABLE);
          var estId = valField(response.data, C.EST_ID);
          var actionInvalidate =  valField(response.data, "actionInvalidate");
          var actionValidate = valField(response.data, "actionValidate");
          var docId = valField(response.data, Cairo.Constants.DOC_ID);

          if(isEditable) {
            //
            // if the status is invalidated we ask the user if he/she wants to undo the invalidation
            // aka restore the status of the document to validated
            //
            if(estId === Cairo.Documents.Status.anulado) {
              p = Cairo.Modal.confirmViewYesDanger(Cairo.Language.getText(2912, ""), Cairo.Language.getText(2617, ""));
            }

            p = p || Cairo.Promise.resolvedPromise(true);

            p = p.then(function(result) {

              var invalidate;

              if(result) {
                //
                // it is posible to go from validate to invalidate and viceversa
                //
                if(estId === Cairo.Documents.Status.anulado) {
                  result = Cairo.Security.docHasPermissionTo(actionValidate, docId, Cairo.Security.ActionTypes.validate);
                  invalidate = false; // go to validated
                }
                else {
                  result = Cairo.Security.docHasPermissionTo(actionInvalidate, docId, Cairo.Security.ActionTypes.invalidate);
                  invalidate = true; // go to invalidated
                }
              }

              if(result) {

                var p;

                var estId = Cairo.Constants.NO_ID;
                var estado = "";
                var editable = "";
                var message = "";

                var action = invalidate ? "invalidate" : "validate";
                p = Cairo.Database.execute("put[" + apiPath + "documento/" + doctId.toString() + "/" + action + "]", id);

                p = p.then(function(response) {

                  if(response.success === true) {

                    estId = valField(response.data, C.EST_ID);
                    estado = valField(response.data, C.EST_NAME);

                    var property = dialog.getProperties().item(Cairo.Constants.STATUS_ID);

                    property.setSelectId(estId);
                    property.setValue(estado);

                    dialog.showValue(property);

                    editable = valField(response.data, C.DOC_EDITABLE);
                    message = valField(response.data, C.DOC_EDIT_MSG);

                  }

                  return { success: response.success, editable: editable, message: message, estId: estId, estado: estado };
                });

                return p;
              }
              else {
                return { success: false };
              }
            });

          }
          else {
            var message = valField(response.data, C.DOC_EDIT_MSG)
            p = Cairo.Modal.showWarningWithFail(message);
          }

          return p;
        }
        else {
          return Cairo.Promises.failedPromise();
        }
      });

      return p;
    };

  };

  var setGenericDoc = function(editor) {
    if(editor.getEditorType() === "document") {
      editor.setFooter(Cairo.Dialogs.Views.Controller.newDialog());
      editor.setItems(Cairo.Dialogs.Views.Controller.newDialog());
    }
  };

  Cairo.Documents.getAsientoId = function(doctId, id) {
    /* TODO: implement this. */
    return Cairo.Promises.resolvedPromise({ success: false });
  };

  Cairo.Documents.getStockId = function(doctId, id) {
    /* TODO: implement this. */
    return Cairo.Promises.resolvedPromise({ success: false });
  };

  Cairo.Documents.getDocumentInfo = function(doctId, id) {
    /* TODO: implement this. */
    return Cairo.Promises.resolvedPromise({ success: false });
  };

  Cairo.Documents.showDocAux = function(id, objEditName) {
    try {

      var dialog = Cairo.Dialogs.Views.Controller.newDialog();
      var editor = Cairo[objEditName].Edit.Controller.getEditor();
      editor.setTree(null);
      editor.setDialog(dialog);

      setGenericDoc(editor);

      editor.edit(id);
    }
    catch (ex) {
      Cairo.manageErrorEx(ex.message, ex, "showDocAux", "Documents", "");
    }
  };

  var isValidDate = function(docId, date) {

    if(docId === Cairo.Constants.NO_ID) {
      return Cairo.Promises.failedPromise();
    }
    else {
      var apiPath = Cairo.Database.getAPIVersion();
      var p = Cairo.Database.getData("load[" + apiPath + "documento/" + docId.toString() + "/is_valid_date]", Cairo.Database.sqlDate(date));

      return p.then(function(response) {

        var isValid = false;
        var range = "";
        if(response.success === true) {
          isValid = valField(response.data, "isvalid");
          range = valField(response.data, "range");
        }

        return { success: true, isValid: isValid, range: range};
      });
    }
  };

  Cairo.Documents.docCanBeSaved = function(dialog, dateKey) {
    return Cairo.Documents.docCanBeSavedEx(dialog, dateKey, C.DOC_ID);
  };

  Cairo.Documents.docCanBeSavedEx = function(dialog, dateKey, documentKey) {

    var properties = dialog.getProperties();
    var docId = properties.item(documentKey).getSelectId();
    var date = properties.item(dateKey).getValue();

    return isValidDate(docId, date).then(function(result) {
      if(result.isValid !== true) {
        Cairo.Modal.showWarningWithFail(Cairo.Language.getText(2914, "", result.range));
        // La fecha del Documento está fuera del rango permitido & _
        // por(las Fechas de Control de Acceso;; rango permtido:+ rango);
      }
      return result.success === true && result.isValid;
    })
  };

  Cairo.Documents.setDefaultCurrency = Cairo.Company.setDefaultCurrency;

  Cairo.Documents.getDefaultCurrency = Cairo.Company.getDefaultCurrency;

  Cairo.Documents.docHasChanged = function(dialog,  lastDoc) {
    var property = dialog.getProperties().item(C.DOC_ID);
    var docId = property.getSelectId();
    var docName = property.getValue();

    return {
      changed: lastDoc !== docId,
      docId: docId,
      docName: docName
    }
  };

  Cairo.Documents.getEmailFromProveedor = function(provId) {
    var apiPath = Cairo.Database.getAPIVersion();
    return Cairo.Database.getData("load[" + apiPath + "general/proveedor/" + provId.toString() + "/email]").then(
      function(response) {
        if(response.success === true) {
          var email = valField(response.data, 'email');
          return { success: true, email: email };
        }
        else {
          return { success: false };
        }
      }
    );
  };

  Cairo.Documents.showDataAddProveedor = function(showData, dialog) {
    if(showData) {
      var provId = dialog.getProperties().item(C.PROV_ID).getSelectId();

      if(provId !== Cairo.Constants.NO_ID) {
        var apiPath = Cairo.Database.getAPIVersion();
        Cairo.Database.getData("load[" + apiPath + "general/proveedor/" + provId.toString() + "/data_add]").then(
          function(response) {
            if(response.success === true) {
              var info = valField(response.data, 'info');
              var property = dialog.getProperties().item(CC.PROVEEDOR_DATA_ADD);
              property.setValue(info);
              dialog.showValue(property);
            }
          }
        );
      }
    }
  };

  Cairo.Documents.docCanBeEdited = function(canBeEdited, message) {
    if(canBeEdited !== true) {
      return Cairo.Modal.showWarningWithFalse(Cairo.Language.getText(2913, "", message));
                                              //Este documento no puede ser modificado debido a:;; & DocEditMsg
    }
    else {
      return Cairo.Promises.resolvedPromise(true);
    }
  };

  Cairo.Documents.getProperty = function(dialog, key) {
    return dialog.getProperties().item(key);
  };

  Cairo.Documents.getGrid = function(dialog, key) {
    return dialog.getProperties().item(key).getGrid();
  };

  Cairo.Documents.getDocIdFromDialog = function(dialog) {
    var properties = dialog.getProperties();
    var keyDoc = Cairo.General.Constants.DOC_ID;
    if(properties.contains(keyDoc)) {
      return properties.item(keyDoc).getSelectId();
    }
    else {
      return Cairo.Constants.NO_ID;
    }
  };

  Cairo.Documents.showEditStatus = function(msg, title) {
    if(msg !== "") {
      return Cairo.Modal.showInfo(msg, title);
    }
    else {
      return Cairo.Modal.showInfo(Cairo.Language.getText(2920, ""), title);
            //Ud. puede modificar el documento
    }
  };

  Cairo.Documents.getCurrencyRate = function(monId, date) {
    var apiPath = Cairo.Database.getAPIVersion();
    return Cairo.Database.getData("load[" + apiPath + "documento/currency/" + monId.toString() + "/rate]", date).then(
      function(response) {
        var rate = 0;
        if(response.success === true) {
          rate = valField(response.data, C.MON_PRECIO);
          rate = Cairo.Util.round(rate, Cairo.Settings.getCurrencyRateDecimals());
        }
        return rate;
      }
    );
  };

  Cairo.Documents.editableStatus = function(docId, actionId) {
    var apiPath = Cairo.Database.getAPIVersion();
    var p = Cairo.Database.getData("load[" + apiPath + "documento/" + docId.toString() + "/edit_status]", actionId);

    return p.then(function(response) {

      if(response.success === true) {
        return {
          editableStatus: valField(response.data, 'doc_editable_status') !== 0,
          message: valField(response.data, 'doc_editable_message')
        };
      }
      else {
        return {
          status: Cairo.Documents.Status.error,
          message: "An error has occurred when requesting the editable status for this document."
        };
      }
    });
  };

  Cairo.Documents.getSelectFilterForCuenta = "account_in_current_company";

  Cairo.Documents.getTasaFromProducto = function(prId, isCompra) {
    var apiPath = Cairo.Database.getAPIVersion();
    var p = Cairo.Database.getData("load[" + apiPath + "general/producto/" + prId.toString() + "/taxes]");

    return p.then(function(response) {

      if(response.success === true) {
        return {
          
          ti_ri_compra: valField(response.data, 'ti_id_ivaricompra'),
          ri_percent_compra: valField(response.data, 'ti_ri_porc_compra'),
          ri_cue_id_compra: valField(response.data, 'cue_id_ri_compra'),

          ti_rni_compra: valField(response.data, 'ti_id_ivarnicompra'),
          rni_percent_compra: valField(response.data, 'ti_rni_porc_compra'),
          rni_cue_id_compra: valField(response.data, 'cue_id_rni_compra'),

          ti_internos_compra: valField(response.data, 'ti_id_internosc'),
          int_percent_compra: valField(response.data, 'ti_int_porc_compra'),
          porc_internos_compra: valField(response.data, 'pr_porcinternoc'),

          ti_ri_venta: valField(response.data, 'ti_id_ivariventa'),
          ri_percent_venta: valField(response.data, 'ti_ri_porc_venta'),
          ri_cue_id_venta: valField(response.data, 'cue_id_ri_venta'),

          ti_rni_venta: valField(response.data, 'ti_id_ivarniventa'),
          rni_percent_venta: valField(response.data, 'ti_rni_porc_venta'),
          rni_cue_id_venta: valField(response.data, 'cue_id_rni_venta'),

          ti_internos_venta: valField(response.data, 'ti_id_internosc'),
          int_percent_venta: valField(response.data, 'ti_int_porc_venta'),
          porc_internos_venta: valField(response.data, 'pr_porcinternov'),

          success: true
        };
      }
      else {
        return {
          success: false
        };
      }
    });
  };

  Cairo.Documents.getDocumentSignStatus = function(doctId, id) {
    /* TODO: implement this. */
    return Cairo.Promises.resolvedPromise(false);
  };

  Cairo.Documents.signDocument = function(doctId, id) {

    var register = new Cairo.Database.Register();
    var fields = register.getFields();

    register.setFieldId(C.ID);
    register.setTable(C.DOCUMENTO);
    register.setId(id);

    fields.add(C.DOCT_ID, doctId, Cairo.Constants.Types.id);

    var apiPath = Cairo.Database.getAPIVersion();
    register.setPath(apiPath + "document/sign");

    var p = Cairo.Database.saveEx(
      register,
      false,
      "",
      'signDocument',
      'Cairo.Documents',
      Cairo.Language.getText(1594, ""))

    return p.then(function(response) {

      if(response.success === true) {
        return {
          est_id: valField(response.data, C.EST_ID),
          estado: valField(response.data, C.EST_NAME),
          firmado: valField(response.data, CC.FC_FIRMADO),
          success: true
        };
      }
      else {
        return {
          success: false
        };
      }
    });
  };

  Cairo.Documents.move = function(docId, moveTo) {
    var apiPath = Cairo.Database.getAPIVersion();
    var p = Cairo.Database.getData("load[" + apiPath + "documento/" + docId.toString() + "/move]", moveTo);

    return p.then(function(response) {

      if(response.success === true) {
        return {
          id: valField(response.data, 'id'),
          success: true
        };
      }
      else {
        return {
          success: false
        };
      }
    });
  };

  Cairo.Documents.getListaPrecioForProveedor = function(docId, provId) {
    return "supplier_list_price|supplierId:" + provId.toString() + ",documentId:" + docId.toString();
  };

  Cairo.Documents.getListaDescuentoForProveedor = function(docId, provId) {
    return "supplier_list_discount|supplierId:" + provId.toString() + ",documentId:" + docId.toString();
  };

  Cairo.Documents.FACTURA_COMPRAS_DOC_FILTER = "document|documentTypeId:"
    + Cairo.Documents.Types.FACTURA_COMPRA.toString()
    + "*" + Cairo.Documents.Types.NOTA_CREDITO_COMPRA.toString()
    + "*" + Cairo.Documents.Types.NOTA_DEBITO_COMPRA.toString()
  ;

  Cairo.Documents.showNotes = function() {
    /* TODO: implement this. */
    return Cairo.Promises.resolvedPromise(false);
  };

  Cairo.Documents.addNote = function(doctId, id) {
    /* TODO: implement this. */
    return Cairo.Promises.resolvedPromise(false);
  };

  Cairo.Documents.FACTURA_COMPRAS_LIST_DOC_FILTER = Cairo.Documents.FACTURA_COMPRAS_DOC_FILTER + "|empId:0";

  Cairo.History = {};

  Cairo.History.show = function (tableId, id, title) {

  };

    

}());

(function() {
  "use strict";

  var C = Cairo.General.Constants;
  var CC = Cairo.Compras.Constants;

  Cairo.SerialNumber = {};

  Cairo.SerialNumber.create = function() {

    var self = {};

    var m_prnsId = 0;
    var m_prId = 0;
    var m_code = "";
    var m_code2 = "";
    var m_code3 = "";
    var m_descrip = "";
    var m_fechaVto = null;
    var m_prIdItem = 0;
    var m_kitItem = "";
    var m_prIdKit = 0;
    var m_idGroup = 0;

    // this flag defines if this number must be deleted in the database
    // because the quantity has changed when editing purchase document
    var m_deleted;

    self.getPrnsId = function() {
      return m_prnsId;
    };

    self.setPrnsId = function(rhs) {
      m_prnsId = rhs;
    };

    self.getCode = function() {
      return m_code;
    };

    self.setCode = function(rhs) {
      m_code = rhs;
    };

    self.getCode2 = function() {
      return m_code2;
    };

    self.setCode2 = function(rhs) {
      m_code2 = rhs;
    };

    self.getCode3 = function() {
      return m_code3;
    };

    self.setCode3 = function(rhs) {
      m_code3 = rhs;
    };

    self.getDescrip = function() {
      return m_descrip;
    };

    self.setDescrip = function(rhs) {
      m_descrip = rhs;
    };

    self.getFechaVto = function() {
      return m_fechaVto;
    };

    self.setFechaVto = function(rhs) {
      m_fechaVto = rhs;
    };

    self.getPrId = function() {
      return m_prId;
    };

    self.setPrId = function(rhs) {
      m_prId = rhs;
    };

    self.getPrIdItem = function() {
      return m_prIdItem;
    };

    self.setPrIdItem = function(rhs) {
      m_prIdItem = rhs;
    };

    self.getKitItem = function() {
      return m_kitItem;
    };

    self.setKitItem = function(rhs) {
      m_kitItem = rhs;
    };

    self.getIdGroup = function() {
      return m_idGroup;
    };

    self.setIdGroup = function(rhs) {
      m_idGroup = rhs;
    };

    self.getPrIdKit = function() {
      return m_prIdKit;
    };

    self.setPrIdKit = function(rhs) {
      m_prIdKit = rhs;
    };

    self.getDeleted = function() {
      return m_deleted;
    };

    self.setDeleted = function(rhs) {
      m_deleted = rhs;
    };

    return self;

  };

  Cairo.SerialNumber.getCount = function(nrosSerie, grupo) {

    /* TODO: complete this
    
    var pt = null;
    var rtn = null;
  
    if(grupo === 0) { return 0; }
  
    if(mCollection.existsObjectInColl(nrosSerie, mCollection.getKey(grupo))) {
  
      var _count = nrosSerie.get(mCollection.getKey(grupo)).size();
      for (var _i = 0; _i < _count; _i++) {
        pt = nrosSerie.get(mCollection.getKey(grupo)).item(_i);
        if(!pt.Cairo.SerialNumber.getDeleted()) {
          rtn = rtn + 1;
        }
      }
    }
    */

    return Cairo.Promises.resolvedPromise(true);
  };

  Cairo.SerialNumber.validateCount2 = function(
    row, keyGroup, rowIndex, nrosSerie, cantidad, strRow, keyPrId,
    keyCantidad, keyNSerie, prId, deplId, isInput) {

    return Cairo.SerialNumber.validateCount2Ex(
      row, keyGroup, rowIndex, nrosSerie, cantidad, strRow, keyPrId, 
      keyCantidad, keyNSerie, prId, deplId, isInput, false);
  };

  Cairo.SerialNumber.validateCount2Ex = function(
    row, keyGroup, rowIndex, nrosSerie, cantidad, strRow, keyPrId, 
    keyCantidad, keyNSerie, prId, deplId, isInput, silent) {

    return Cairo.SerialNumber.validateCount3Ex(
      row, keyGroup, rowIndex, nrosSerie, cantidad, strRow, keyPrId, 
      keyCantidad, keyNSerie, prId, deplId, isInput, silent, false);
  };

  Cairo.SerialNumber.validateCount3Ex = function(
    row, keyGroup, rowIndex, nrosSerie, cantidad, strRow, keyPrId, 
    keyCantidad, keyNSerie, prId, deplId, isInput, silent, superSilent) {

    /* TODO: complete this

    var grupo = null;
    var nroSerieCount = null;

    grupo = Dialogs.cell(row, keyGroup).getID();
    nroSerieCount = Cairo.SerialNumber.getCount(nrosSerie, grupo);

    if(cantidad > nroSerieCount) {

      // silent=true  and supersilent=false    doesn't ask and doesn't create auxi numbers
      //
      // silent=false and supersilent=false    asks if must create auxi numbers
      //
      // superSilent=true                      doesn't ask and create auxi numbers
      //
      if((! silent) || superSilent) {

        if(! superSilent) {

          if(!cWindow.ask(Cairo.Language.getText(2915, "", cantidad, nroSerieCount, strRow), vbYes)) {
            //"Ud ha indicado " & Cantidad & " items pero solo " & _
            nroSerieCount.toString()+ " Números de Serie"+ strRow+ ";;¿Desea que Cairo genere números auxiliares por Ud?;";
            return null;

          }
        }
      }

      if(!create(Dialogs.cell(row, keyGroup).getID(), cantidad, row, nrosSerie, keyGroup, keyNSerie, rowIndex, prId, deplId, isInput, false, false,, null, Cairo.Constants.NO_ID, Cairo.Constants.NO_ID, 0, Cairo.Constants.NO_ID)) { return false; }

    }
    else if(cantidad < nroSerieCount) {

      cWindow.msgInfo(Cairo.Language.getText(2916, "", rowIndex));
      //La cantidad del rénglon  & RowIndex &  es menor a la cantidad de & _
      números(de serie asociados. Indique el/los números de serie a eleminar.);

      if(!Cairo.SerialNumber.destroy(Dialogs.cell(row, keyGroup).getID(), Cairo.Util.val(Dialogs.cell(row, keyCantidad).getValue()), row, nrosSerie, keyGroup, keyNSerie, rowIndex, prId, deplId, isInput, nroSerieCount - cantidad)) {

        cWindow.msgWarning(Cairo.Language.getText(2917, "", rowIndex));
        //El documento no será guardado hasta que no indique los números de & _
        serie(a eliminar o modifique la cantidad indicada en el rénglon+ rowIndex.toString());
        return null;
      }
    }
    */

    return Cairo.Promises.resolvedPromise(true);
  };

  Cairo.SerialNumber.validateCount = function(
    row, keyGroup, rowIndex, nrosSerie, cantidad, strRow, keyPrId,
    keyCantidad, keyNSerie, prId, deplId, isInput) {

    /* TODO: complete this

    var grupo = null;
    var nroSerieCount = null;

    grupo = Dialogs.cell(row, keyGroup).getID();
    nroSerieCount = Cairo.SerialNumber.getCount(nrosSerie, grupo);

    if(cantidad > nroSerieCount) {
      cWindow.msgInfo(Cairo.Language.getText(2918, "", cantidad, nroSerieCount, strRow));
      //Ud ha indicado  & Cantidad &  items pero solo  & nroSerieCount.toString()+ números de serie" & strRow;
      return null;

    }
    else if(cantidad < nroSerieCount) {

      cWindow.msgInfo(Cairo.Language.getText(2916, "", rowIndex));
      //La cantidad del rénglon " & RowIndex & " es menor a la cantidad de & _
      números(de serie asociados. Indique el/los números de serie a eleminar.);

      if(!Cairo.SerialNumber.destroy(Dialogs.cell(row, keyGroup).getID(), Cairo.Util.val(Dialogs.cell(row, keyCantidad).getValue()), row, nrosSerie, keyGroup, keyNSerie, rowIndex, prId, deplId, isInput, nroSerieCount - cantidad)) {

        cWindow.msgWarning(Cairo.Language.getText(2917, "", rowIndex));
        //El documento no será guardado hasta que no indique los números de & _
        serie(a eliminar o modifique la cantidad indicada en el rénglon+ rowIndex.toString());
        return null;
      }
    }
    */

    return Cairo.Promises.resolvedPromise(true);
  };

  Cairo.SerialNumber.quantityChangePPK = function(
    row, lRow, keyCantidad, newValue, keyGroup, nrosSerie, keyPrId, keyNSerie,
    prId, deplId, isNew) {

    return quantityChange(
      row, lRow, keyCantidad, newValue, keyGroup, nrosSerie, keyPrId, keyNSerie,
      prId, deplId, false, Cairo.Constants.NO_ID, true, isNew);
  };

  Cairo.SerialNumber.quantityChange = function(
    row, lRow, keyCantidad, newValue, keyGroup, nrosSerie, keyPrId, keyNSerie,
    prId, deplId, isInput, provId) {

    return quantityChange(
      row, lRow, keyCantidad, newValue, keyGroup, nrosSerie, keyPrId, keyNSerie,
      prId, deplId, isInput, provId, false, false);
  };

  var quantityChange = function(
    row, lRow, keyCantidad, newValue, keyGroup, nrosSerie, keyPrId, keyNSerie,
    prId, deplId, isInput, provId, isParteProd, isNewParteProd) {

    /* TODO: complete this

    var oldValue = null;
    oldValue = Cairo.Util.val(Dialogs.cell(row, keyCantidad).getValue());

    if(oldValue != newValue && oldValue > 0) {

      var grupo = null;
      var nroSerieCount = null;

      grupo = Dialogs.cell(row, keyGroup).getID();
      nroSerieCount = Cairo.SerialNumber.getCount(nrosSerie, grupo);

      // Si no hay cargado ningun numero de serie
      // no muestro la ventana por que es que se
      // equivoco al cargar la cantidad y antes de
      // ingresar los numeros corrige la el valor de la
      // columna (cantidad) o se trata del default que es 1
      // y ahora esta ingresando la cantidad real
      //
      if(nroSerieCount > 0) {

        if(nroSerieCount > newValue) {

          if(isParteProd && !isNewParteProd) {
            cWindow.msgWarning(Cairo.Language.getText(3038, ""));
            //"Solo se puede modificar la cantidad" & _
            " en MENOS, en un parte de producción, "(+ " cuando el parte es nuevo.;;Para partes ya guardados hay que hacer un ""Parte de Desarme"".");
            return null;
          }
          else {
            if(!Cairo.SerialNumber.destroy(Dialogs.cell(row, keyGroup).getID(), Cairo.Util.val(Dialogs.cell(row, keyCantidad).getValue()), row, nrosSerie, keyGroup, keyNSerie, lRow, prId, deplId, isInput, nroSerieCount - newValue)) {
              return null;
            }
          }

        }
        else if(nroSerieCount < newValue) {

          if(!Cairo.SerialNumber.edit(Dialogs.cell(row, keyGroup).getID(), newValue, row, nrosSerie, keyGroup, keyNSerie, lRow, prId, deplId, isInput, false,, null, provId, Cairo.Constants.NO_ID)) {
            return null;
          }

        }
      }
    }
    */

    return Cairo.Promises.resolvedPromise(true);
  };

  Cairo.SerialNumber.editInput = function(
    grupo, cantidad, row, nrosSerie, keyGroup, keyNSerie, lRow,
    prId, deplId, isInput, bEditKit, collKitInfo, prov_id, cli_id) {

    return edit (
      grupo, cantidad, row, nrosSerie, keyGroup, keyNSerie, lRow,
      Cairo.Constants.NO_ID, deplId, isInput, bEditKit, false, collKitInfo, prov_id, cli_id, 0, prId);
  };

  Cairo.SerialNumber.edit = function(
    grupo, cantidad, row, nrosSerie, keyGroup, keyNSerie, lRow,
    prId, deplId, isInput, bEditKit, collKitInfo, prov_id, cli_id) {

    return edit (
      grupo, cantidad, row, nrosSerie, keyGroup, keyNSerie, lRow,
      prId, deplId, isInput, bEditKit, false, collKitInfo, prov_id, cli_id, 0, 0);
  };

  Cairo.SerialNumber.destroy = function(
    grupo, cantidad, row, nrosSerie, keyGroup, keyNSerie, lRow, prId, deplId, isInput, deleteCount) {

    return edit (
      grupo, cantidad, row, nrosSerie, keyGroup, keyNSerie, lRow,
      prId, deplId, isInput, false, false, null, Cairo.Constants.NO_ID, Cairo.Constants.NO_ID, deleteCount, 0);
  };

  Cairo.SerialNumber.editPPK = function(
    grupo, cantidad, row, nrosSerie, keyGroup, keyNSerie, lRow,
    prId, deplId, isInput, bEditKit, collKitInfo) {

    return edit (
      grupo, cantidad, row, nrosSerie, keyGroup, keyNSerie, lRow,
      prId, deplId, isInput, bEditKit, true, collKitInfo, 0, 0, 0, 0);
  };

  Cairo.SerialNumber.editPDK = function(
    grupo, cantidad, row, nrosSerie, keyGroup, keyNSerie, lRow,
    prId, deplId, isInput, bEditKit, collKitInfo) {

    return edit (
      grupo, cantidad, row, nrosSerie, keyGroup, keyNSerie, lRow,
      prId, deplId, isInput, bEditKit, false, collKitInfo, 0, 0, 0, 0);
  };

  var edit  = function(
    grupo, cantidad, row, nrosSerie, kI_GRUPO, kI_NROSERIE, lRow, 
    prId, deplId, isInput, bEditKit, bParteProdKit, collKitInfo, 
    prov_id, cli_id, deleteCount, prId2) {

    /* TODO: complete this

    var editSerie = null;
    var i = null;
    var n = null;
    var coll = null;

    if(cantidad < 1) {
      //'Debe indicar una cantidad
      cWindow.msgWarning(Cairo.Language.getText(2921, ""));
      return null;
    }

    editSerie = new cProductoSerie();

    editSerie.self.setBEditKit(bEditKit);
    editSerie.self.setBParteProdKit(bParteProdKit);

    if(bEditKit) {

      cantidad = pGetCantidadForKit(collKitInfo, cantidad);

      if(collKitInfo === null) {
        cWindow.msgWarning(Cairo.Language.getText(2922, ""));
        //No se recibió la definición del kit. No se pueden editar los & _
        Números(de Serie);
        return null;
      }
    }

    // Si ya existen numeros de serie para este item
    //
    if(mCollection.existsObjectInColl(nrosSerie, mCollection.getKey(grupo))) {

      // Paso de la coleccion a la ventana de edicion
      //
      coll = nrosSerie.get(mCollection.getKey(grupo));
      for (i = 1; i <= coll.size(); i++) {
        editSerie.self.addProductoSerie(coll.get(i));
      }
      n = editSerie.self.getColl().size();
    }

    if(bEditKit) {

      var kitS = null;

      while (n < cantidad) {
        var _count = collKitInfo.size();
        for (var _i = 0; _i < _count; _i++) {
          kitS = collKitInfo.item(_i);

          if(kitS.self.getLlevaNroSerie()) {

            for (i = 1; i <= kitS.self.getCantidad(); i++) {

              // Creo filas para los nuevos numeros de serie
              //
              n = n + 1;
              editSerie.self.addProductoSerie(new cProductoSerieType());
              var w_coll = editSerie.self.cProductoSerie.getColl(n);
              w_coll.prns_id = n * -1;
              w_coll.pr_id = prId ? prId : prId2);
              w_coll.pr_id_item = kitS.self.getPr_id();
              w_coll.pr_id_kit = kitS.self.getPr_id_kit();
              w_coll.KitItem = kitS.self.getName();
            }
          }
        }
      }
    }
    else {

      // Creo filas para los nuevos numeros de serie
      //
      for (i = n + 1; i <= cantidad; i++) {
        editSerie.self.addProductoSerie(new cProductoSerieType());
        editSerie.self.getColl(i).prns_id = i * -1;
        editSerie.self.getColl(i).pr_id = prId ? prId : prId2);
      }

    }

    editSerie.self.setDepl_id(deplId);
    editSerie.self.setPr_id(prId);
    editSerie.self.setIsInput(isInput);
    editSerie.self.setCli_id(cli_id);
    editSerie.self.setProv_id(prov_id);
    editSerie.self.setDelete(deleteCount);
    editSerie.self.setDeleteCount(deleteCount);

    if(!editSerie.self.edit()) { return false; }

    var vSeries() = null;
    var idx = null;
    var ubSeries = null;

    ubSeries = 400;
    G.redim(vSeries, ubSeries);

    // Si este item aun no tiene numeros de serie
    // creo una nueva coleccion y la agrego a la coleccion de items
    // el grupo esta en negativo para indicar que son nuevos
    //
    if(coll === null) {
      grupo = lRow * -1;
      //'(NrosSerie.Count + 1) * -1
      Dialogs.cell(row, kI_GRUPO).getID() === grupo;
      coll = new Collection();
      nrosSerie.Add(coll, mCollection.getKey(grupo));
    }

    mCollection.collClear(coll);

    // Paso de la ventana a la coleccion del item
    //
    for (i = 1; i <= editSerie.self.getColl().size(); i++) {

      var pt = null;
      var delCount = null;

      pt = editSerie.self.getColl().get(i);
      pt.self.setPr_id(prId ? prId : prId2));

      if(idx > ubSeries) {
        ubSeries = ubSeries + 400;
        G.redimPreserve(vSeries, ubSeries);
      }

      if(pt.self.getDeleted() && delCount < deleteCount) {
        delCount = delCount + 1;
        vSeries[idx] = pt.self.getCode()+ (LenB(pt.self.getCode2()) ? " | "+ pt.self.getCode2() : "")).toString()+ "(B)";
      }
      else {
        vSeries[idx] = pt.self.getCode()+ (LenB(pt.self.getCode2()) ? " | "+ pt.self.getCode2() : "")).toString();
      }

      idx = idx + 1;

      coll.Add(pt, mCollection.getKey(pt.self.getPrns_id()));
    }

    idx = idx - 1;
    if(idx >= 0) {
      G.redimPreserve(vSeries, idx);
      Dialogs.cell(row, kI_NROSERIE).getValue() === Join(vSeries, ",");
    }
    else {
      Dialogs.cell(row, kI_NROSERIE).getValue() === "";
    }
    */

    return Cairo.Promises.resolvedPromise(true);
  };

  var create = function(
    grupo, cantidad, row, nrosSerie, kI_GRUPO, kI_NROSERIE, lRow, 
    prId, deplId, isInput, bEditKit, bParteProdKit, collKitInfo, 
    prov_id, cli_id, deleteCount, prId2) {

    /* TODO: complete this
    
    var editSerie = null;
    var i = null;
    var n = null;
    var coll = null;
    var nros = null;

    if(cantidad < 1) {
      //'Debe indicar una cantidad
      cWindow.msgWarning(Cairo.Language.getText(2921, ""));
      return null;
    }

    if(bEditKit) {
      cantidad = pGetCantidadForKit(collKitInfo, cantidad);

      if(collKitInfo === null) {
        cWindow.msgWarning(Cairo.Language.getText(2922, ""));
        //No se recibio la definicion del kit. No se pueden editar los numeros de serie
        return null;
      }

    }

    // Si ya existen numeros de serie para este item
    //
    if(mCollection.existsObjectInColl(nrosSerie, mCollection.getKey(grupo))) {

      // Paso de la coleccion a la ventana de edicion
      //
      coll = nrosSerie.get(mCollection.getKey(grupo));

    }
    else {

      // Si este item aun no tiene numeros de serie
      // creo una nueva coleccion y la agrego a la coleccion de items
      // el grupo esta en negativo para indicar que son nuevos
      //

      grupo = lRow * -1;
      //'(NrosSerie.Count + 1) * -1
      Dialogs.cell(row, kI_GRUPO).getID() === grupo;
      coll = new Collection();
      nrosSerie.Add(coll, mCollection.getKey(grupo));

    }

    n = coll.size();

    if(bEditKit) {

      var kitS = null;

      while (n < cantidad) {
        var _count = collKitInfo.size();
        for (var _i = 0; _i < _count; _i++) {
          kitS = collKitInfo.item(_i);

          if(kitS.self.getLlevaNroSerie()) {

            for (i = 1; i <= kitS.self.getCantidad(); i++) {

              // Creo filas para los nuevos numeros de serie
              //
              n = n + 1;
              coll.Add(new cProductoSerieType(), mCollection.getKey(n * -1));
              coll.Codigo = getNextNumber();
              coll.prns_id = n * -1;
              coll.pr_id = prId ? prId : prId2);
              coll.pr_id_item = kitS.self.getPr_id();
              coll.pr_id_kit = kitS.self.getPr_id_kit();
              coll.KitItem = kitS.self.getName();
            }
          }
        }
      }
    }
    else {

      // Creo filas para los nuevos numeros de serie
      //
      for (i = n + 1; i <= cantidad; i++) {
        coll.Add(new cProductoSerieType(), mCollection.getKey(i * -1));
        coll.Codigo = getNextNumber();
        coll.prns_id = i * -1;
        coll.pr_id = prId ? prId : prId2);
      }

    }

    // Paso de la ventana a la coleccion del item
    //
    for (i = 1; i <= coll.size(); i++) {

      var pt = null;
      var delCount = null;

      pt = coll.get(i);
      pt.self.setPr_id(prId ? prId : prId2));
      if(pt.self.getDeleted() && delCount < deleteCount) {
        delCount = delCount + 1;
        nros = nros+ pt.self.getCode()+ "(B),";
      }
      else {
        nros = nros+ pt.self.getCode()+ ",";
      }
    }

    Dialogs.cell(row, kI_NROSERIE).getValue() === cUtil.removeLastColon(nros);
    */

    return Cairo.Promises.resolvedPromise(true);
  };

  var getNextNumber = function() {
    /* TODO: complete this
    var sqlstmt = null;
    var rs = null;

    sqlstmt = "sp_StockNumeroSerieAuxGetNext";
    if(!Cairo.Database.openRs(sqlstmt, rs)) { return ""; }

    if(rs.isEOF()) {
      VBA.ex.Raise -1, , Cairo.Language.getText(2923, "");
      //@@ERROR_SP:No se pudo obtener un Número de Serie auxiliar.
      return null;
    }

    return valField(rs.getFields(), 0);
    */
  };  
  
}());

(function() {
  "use strict";

  Cairo.Dates = {};

  Cairo.Dates.VirtualDates = {
    TODAY: 1,
    YESTERDAY: 2,
    TOMORROW: 3,
    WEECK_FIRST_DAY: 4,
    WEECK_LAST_DAY: 5,
    WEECK_LAST_FIRST_DAY: 6,
    WEECK_LAST_LAST_DAY: 7,
    WEECK_NEXT_FIRST_DAY: 8,
    WEECK_NEXT_LAST_DAY: 9,
    MONTH_FIRST_DAY: 10,
    MONTH_LAST_DAY: 11,
    MONTH_LAST_FIRST_DAY: 12,
    MONTH_LAST_LAST_DAY: 13,
    MONTH_NEXT_FIRST_DAY: 14,
    MONTH_NEXT_LAST_DAY: 15,
    YEAR_FIRST_DAY: 16,
    YEAR_LAST_DAY: 17,
    YEAR_LAST_FIRST_DAY: 18,
    YEAR_LAST_LAST_DAY: 19,
    YEAR_NEXT_FIRST_DAY: 20,
    YEAR_NEXT_LAST_DAY: 21
  };

  var createDateName = function() {

    var self = {};

    var m_id;
    var m_name = "";
    var m_code = "";
    var m_group = "";

    self.getId = function() {
      return m_id;
    };

    self.setId = function(rhs) {
      m_id = rhs;
    };

    self.getName = function() {
      return m_name;
    };

    self.setName = function(rhs) {
      m_name = rhs;
    };

    self.getCode = function() {
      return m_code;
    };

    self.setCode = function(rhs) {
      m_code = rhs;
    };

    self.getGroup = function() {
      return m_group;
    };

    self.setGroup = function(rhs) {
      m_group = rhs;
    };

    self.value = function(iniDate) {
      return Cairo.Dates.DateNames.getDateById(m_id, iniDate);
    };

    return self;
  };

  var createDateNames = function() {

    var self = {};

    var m_dateNames;

    self.getDateNames = function() {
      return m_dateNames;
    };
    self.setDateNames = function(rhs) {
      m_dateNames = rhs;
    };

    self.getDate = function(dateName,  iniDate) {
      var date;
      
      if(Cairo.Util.isNumeric(dateName)) {
        date = self.getDateById(dateName, iniDate);
      }
      else {
        date = self.getDateByName(dateName, iniDate);
      }

      return date;
    };

    self.getDateByName = function(dateName,  iniDate) {
      var date;
      var offset = 0;

      dateName = dateName.toLowerCase();
      var t = dateName.indexOf("-");
      if(t === -1) {
        t = dateName.indexOf("+");
      }
      if(t > -1 ) {
        if(t === 0) {
          offset = Cairo.Util.val(dateName);
          dateName = "h";
        }
        else {
          offset = Cairo.Util.val(dateName.substr(t));
          dateName = dateName.substr(0, t);
        }
      }

      var _count = m_dateNames.size();
      for (var _i = 0; _i < _count; _i++) {
        var dn = m_dateNames.item(_i);
        if(dn.getCode() === dateName || dn.getName() === dateName) {
          date = self.getDateById(dn.getId(), iniDate);
          if(offset !== 0) {
            date = addToDate('d', offset, date);
          }
          break;
        }
      }

      return date;
    };

    var addToDate = function(part, amount, date) {
      if(typeof date === "string") {
        date = Cairo.Util.getDateValue(date);
      }

      switch (part) {
        case "yyyy":
          date.setYear(date.getFullYear() + amount);
          break;
        case "d":
          date.setDate(date.getDate() + amount);
          break;
        case "m":
          date.setMonth(date.getMonth() + amount);
          break;
        case "h":
          date.setHours(date.getHours() + amount);
          break;
        case "n":
          date.setMinutes(date.getMinutes() + amount);
          break;
        case "s":
          date.setSeconds(date.getSeconds() + amount);
          break;
      }

      return date;
    };

    self.addToDate = addToDate;

    self.getDateById = function(dateIndex,  iniDate) {
      if(iniDate === undefined) {
        iniDate = new Date();
      }

      switch (dateIndex) {
        case Cairo.Dates.VirtualDates.TODAY:
          return iniDate;

        case Cairo.Dates.VirtualDates.YESTERDAY:
          return addToDate("d", -1, iniDate);

        case Cairo.Dates.VirtualDates.TOMORROW:
          return addToDate("d", 1, iniDate);
      }

      var date;
      var dayNumber;

      switch (dateIndex) {
        case Cairo.Dates.VirtualDates.YEAR_LAST_FIRST_DAY:
          iniDate = addToDate("yyyy", -1, iniDate);
          dateIndex = Cairo.Dates.VirtualDates.YEAR_FIRST_DAY;
          break;

        case Cairo.Dates.VirtualDates.YEAR_LAST_LAST_DAY:
          iniDate = addToDate("yyyy", -1, iniDate);
          dateIndex = Cairo.Dates.VirtualDates.YEAR_LAST_DAY;
          break;

        case Cairo.Dates.VirtualDates.YEAR_NEXT_FIRST_DAY:
          iniDate = addToDate("yyyy", 1, iniDate);
          dateIndex = Cairo.Dates.VirtualDates.YEAR_FIRST_DAY;
          break;

        case Cairo.Dates.VirtualDates.YEAR_NEXT_LAST_DAY:
          iniDate = addToDate("yyyy", 1, iniDate);
          dateIndex = Cairo.Dates.VirtualDates.YEAR_LAST_DAY;
          break;
      }

      switch (dateIndex) {
        case Cairo.Dates.VirtualDates.WEECK_LAST_FIRST_DAY:
          iniDate = addToDate("d", -7, iniDate);
          dateIndex = Cairo.Dates.VirtualDates.WEECK_FIRST_DAY;
          break;

        case Cairo.Dates.VirtualDates.WEECK_LAST_LAST_DAY:
          iniDate = addToDate("d", -7, iniDate);
          dateIndex = Cairo.Dates.VirtualDates.WEECK_LAST_DAY;
          break;

        case Cairo.Dates.VirtualDates.WEECK_NEXT_FIRST_DAY:
          iniDate = addToDate("d", 7, iniDate);
          dateIndex = Cairo.Dates.VirtualDates.WEECK_FIRST_DAY;
          break;

        case Cairo.Dates.VirtualDates.WEECK_NEXT_LAST_DAY:
          iniDate = addToDate("d", 7, iniDate);
          dateIndex = Cairo.Dates.VirtualDates.WEECK_LAST_DAY;
          break;

        case Cairo.Dates.VirtualDates.MONTH_LAST_FIRST_DAY:
          iniDate = addToDate("m", -1, iniDate);
          dateIndex = Cairo.Dates.VirtualDates.MONTH_FIRST_DAY;
          break;

        case Cairo.Dates.VirtualDates.MONTH_LAST_LAST_DAY:
          iniDate = addToDate("m", -1, iniDate);
          dateIndex = Cairo.Dates.VirtualDates.MONTH_LAST_DAY;
          break;

        case Cairo.Dates.VirtualDates.MONTH_NEXT_FIRST_DAY:
          iniDate = addToDate("m", 1, iniDate);
          dateIndex = Cairo.Dates.VirtualDates.MONTH_FIRST_DAY;
          break;

        case Cairo.Dates.VirtualDates.MONTH_NEXT_LAST_DAY:
          iniDate = addToDate("m", 1, iniDate);
          dateIndex = Cairo.Dates.VirtualDates.MONTH_LAST_DAY;
          break;

        case Cairo.Dates.VirtualDates.YEAR_FIRST_DAY:
          iniDate = addToDate("m", -iniDate.getMonth(), iniDate);
          dateIndex = Cairo.Dates.VirtualDates.MONTH_FIRST_DAY;
          break;

        case Cairo.Dates.VirtualDates.YEAR_LAST_DAY:
          iniDate = addToDate("yyyy", 1, iniDate);
          iniDate = addToDate("m", -iniDate.getMonth(), iniDate);
          dateIndex = Cairo.Dates.VirtualDates.MONTH_LAST_DAY;
          break;
      }

      switch (dateIndex) {

        case Cairo.Dates.VirtualDates.WEECK_FIRST_DAY:
          dayNumber = iniDate.getDay();
          date = addToDate("d", -dayNumber, iniDate);
          break;

        case Cairo.Dates.VirtualDates.WEECK_LAST_DAY:
          dayNumber = iniDate.getDay() + 2;
          date = addToDate("d", -dayNumber, iniDate);
          break;

        case Cairo.Dates.VirtualDates.MONTH_FIRST_DAY:
          dayNumber = iniDate.getDate();
          date = addToDate("d", -dayNumber + 1, iniDate);
          break;

        case Cairo.Dates.VirtualDates.MONTH_LAST_DAY:
          iniDate = addToDate("m", 1, iniDate);
          dayNumber = iniDate.getDate();
          date = addToDate("d", -dayNumber, iniDate);
          break;
      }

      return date;
    };

    var initialize = function() {
      try {

        var dn;

        m_dateNames = Cairo.Collections.createCollection(createDateName);

        dn = m_dateNames.add(null, "a");
        dn.setId(Cairo.Dates.VirtualDates.YESTERDAY);
        dn.setName("Ayer");
        dn.setCode("a");
        dn.setGroup("Dias");

        dn = m_dateNames.add(null, "h");
        dn.setId(Cairo.Dates.VirtualDates.TODAY);
        dn.setName("Hoy");
        dn.setCode("h");
        dn.setGroup("Dias");

        dn = m_dateNames.add(null, "m");
        dn.setId(Cairo.Dates.VirtualDates.TOMORROW);
        dn.setName("Mañana");
        dn.setCode("m");
        dn.setGroup("Dias");

        dn = m_dateNames.add(null, "psa");
        dn.setId(Cairo.Dates.VirtualDates.WEECK_LAST_FIRST_DAY);
        dn.setName("Primer dia de la semana anterior");
        dn.setCode("psa");
        dn.setGroup("Semana");

        dn = m_dateNames.add(null, "usa");
        dn.setId(Cairo.Dates.VirtualDates.WEECK_LAST_LAST_DAY);
        dn.setName("Ultimo dia de la semana anterior");
        dn.setCode("usa");
        dn.setGroup("Semana");

        dn = m_dateNames.add(null, "ps");
        dn.setId(Cairo.Dates.VirtualDates.WEECK_FIRST_DAY);
        dn.setName("Primer dia de la semana");
        dn.setCode("ps");
        dn.setGroup("Semana");

        dn = m_dateNames.add(null, "us");
        dn.setId(Cairo.Dates.VirtualDates.WEECK_LAST_DAY);
        dn.setName("Ultimo dia de la semana");
        dn.setCode("us");
        dn.setGroup("Semana");

        dn = m_dateNames.add(null, "psp");
        dn.setId(Cairo.Dates.VirtualDates.WEECK_NEXT_FIRST_DAY);
        dn.setName("Primer dia de la semana proxima");
        dn.setCode("psp");
        dn.setGroup("Semana");

        dn = m_dateNames.add(null, "usp");
        dn.setId(Cairo.Dates.VirtualDates.WEECK_NEXT_LAST_DAY);
        dn.setName("Ultimo dia de la semana proxima");
        dn.setCode("usp");
        dn.setGroup("Semana");

        dn = m_dateNames.add(null, "pma");
        dn.setId(Cairo.Dates.VirtualDates.MONTH_LAST_FIRST_DAY);
        dn.setName("Primer dia del mes anterior");
        dn.setCode("pma");
        dn.setGroup("Mes");                                    

        dn = m_dateNames.add(null, "uma");
        dn.setId(Cairo.Dates.VirtualDates.MONTH_LAST_LAST_DAY);
        dn.setName("Ultimo dia del mes anterior");
        dn.setCode("uma");
        dn.setGroup("Mes");

        dn = m_dateNames.add(null, "pm");
        dn.setId(Cairo.Dates.VirtualDates.MONTH_FIRST_DAY);
        dn.setName("Primer dia del mes");
        dn.setCode("pm");
        dn.setGroup("Mes");

        dn = m_dateNames.add(null, "um");
        dn.setId(Cairo.Dates.VirtualDates.MONTH_LAST_DAY);
        dn.setName("Ultimo dia del mes");
        dn.setCode("um");
        dn.setGroup("Mes");

        dn = m_dateNames.add(null, "pmp");
        dn.setId(Cairo.Dates.VirtualDates.MONTH_NEXT_FIRST_DAY);
        dn.setName("Primer dia del mes proximo");
        dn.setCode("pmp");
        dn.setGroup("Mes");

        dn = m_dateNames.add(null, "ump");
        dn.setId(Cairo.Dates.VirtualDates.MONTH_NEXT_LAST_DAY);
        dn.setName("Ultimo dia del mes proximo");
        dn.setCode("ump");
        dn.setGroup("Mes");

        dn = m_dateNames.add(null, "paa");                   
        dn.setId(Cairo.Dates.VirtualDates.YEAR_LAST_FIRST_DAY);
        dn.setName("Primer dia del año anterior");
        dn.setCode("paa");
        dn.setGroup("Año");
                                                       
        dn = m_dateNames.add(null, "uaa");
        dn.setId(Cairo.Dates.VirtualDates.YEAR_LAST_LAST_DAY);
        dn.setName("Ultimo dia del año anterior");
        dn.setCode("uaa");
        dn.setGroup("Año");                                      

        dn = m_dateNames.add(null, "pa");
        dn.setId(Cairo.Dates.VirtualDates.YEAR_FIRST_DAY);
        dn.setName("Primer dia del año");
        dn.setCode("pa");
        dn.setGroup("Año");

        dn = m_dateNames.add(null, "ua");
        dn.setId(Cairo.Dates.VirtualDates.YEAR_LAST_DAY);
        dn.setName("Ultimo dia del año");
        dn.setCode("ua");
        dn.setGroup("Año");                      

        dn = m_dateNames.add(null, "pap");
        dn.setId(Cairo.Dates.VirtualDates.YEAR_NEXT_FIRST_DAY);
        dn.setName("Primer dia del año proximo");
        dn.setCode("pap");
        dn.setGroup("Año");

        dn = m_dateNames.add(null, "uap");
        dn.setId(Cairo.Dates.VirtualDates.YEAR_NEXT_LAST_DAY);
        dn.setName("Ultimo dia del año proximo");
        dn.setCode("uap");
        dn.setGroup("Año");

      }
      catch (ex) {
        Cairo.manageErrorEx(ex.message, ex, "initialize", "Dates", "");
      }
    };

    initialize();

    return self;
  };

  Cairo.Dates.DateNames = createDateNames();

  Cairo.Dates.today = function() {
    return Cairo.Dates.DateNames.getDateById(Cairo.Dates.VirtualDates.TODAY);
  };

  Cairo.Dates.tomorrow = function() {
    return Cairo.Dates.DateNames.getDateById(Cairo.Dates.VirtualDates.TOMORROW);
  };


}());