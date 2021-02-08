// document management
//
(function() {
  "use strict";

  var C = Cairo.General.Constants;
  var CC = Cairo.Compras.Constants;
  var CV = Cairo.Ventas.Constants;
  var NO_ID = Cairo.Constants.NO_ID;
  var valField = Cairo.Database.valField;
  var bToI = Cairo.Util.boolToInt;
  var getText = Cairo.Language.getText;
  var Dialogs = Cairo.Dialogs;
  var getCell = Dialogs.cell;
  var val = Cairo.Util.val;
  var zeroDiv = Cairo.Util.zeroDiv;
  var P = Cairo.Promises;
  var DB = Cairo.Database;

  var m_apiPath = Cairo.Database.getAPIVersion();

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

    return DB.getData("load[" + m_apiPath + "general/producto/list?ids=" + ids + "]").then(
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
              if(val(vIds[i]) === prId) {
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
    TO_COMERCIAL: getText(1014, "") // Comercial
  };

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
    TRANSFERENCIA_STOCK: 14,
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

  /* csETipoFactura */
  Cairo.Documents.InvoiceWizardType = {
    directa: 0,
    pedido: 1,
    remito: 2,
    packingList: 3,
    proyecto: 4,
    orden: 5
  };

  Cairo.Documents.PackingListWizardType = {
    directo: 0,
    pedido: 1,
    remito: 2,
    manifiesto: 3
  };

  Cairo.Documents.OrderSaleWizardType = {
    directo: 0,
    presupuesto: 1
  };

  Cairo.Documents.OrderWizardType = {
    directa: 0,
    pedido: 1,
    presupuesto: 2
  };

  Cairo.Documents.ReceiptType = {
    original: 1,
    fax: 2,
    photocopy: 3,
    duplicate: 4
  };

  Cairo.Documents.getDocNumberForProveedor = function(provId, docId) {
    return DB.getData(
      "load[" + m_apiPath + "documento/" + docId.toString() + "/supplier/" + provId.toString() + "/next_number]");
  };

  Cairo.Documents.setDocNumberForProveedor = function(provId, docId, dialog) {
    return Cairo.Documents.getDocNumberForProveedor(provId, docId).then(
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

  Cairo.Documents.getDocNumberForCliente = function(cliId, docId) {
    return DB.getData(
      "load[" + m_apiPath + "documento/" + docId.toString() + "/customer/" + cliId.toString() + "/next_number]");
  };

  Cairo.Documents.setDocNumberForCliente = function(cliId, docId, dialog) {
    return Cairo.Documents.getDocNumberForCliente(cliId, docId).then(
      function(response) {

        var property = dialog.getProperties().item(CV.FV_NRODOC);
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

  Cairo.Documents.getDocNumber = function(docId) {
    return DB.getData(
      "load[" + m_apiPath + "documento/" + docId.toString() + "/next_number]");
  };

  Cairo.Documents.setDocNumber = function(docId, dialog, key) {
    return Cairo.Documents.getDocNumber(docId).then(
      function(response) {

        var property = dialog.getProperties().item(key);
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

  Cairo.Documents.getDocCliente = function(doctId, id) {
    return DB.getData(
      "load[" + m_apiPath + "documento/" + doctId.toString() + "/doc_client]", id);
  };

  Cairo.Documents.docInvalidate = function(doctId, id, dialog) {
    var p;

    if(id === NO_ID) {
                                             // you must save before invalidate
      return Cairo.Modal.showWarningWithFail(getText(2911, ""));
    }
    else {

      p = DB.getData("load[" + m_apiPath + "documento/" + doctId.toString() + "/invalidate_status]", id);

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
              p = Cairo.Modal.confirmViewYesDanger(getText(2912, ""), getText(2617, ""));
            }

            p = p || P.resolvedPromise(true);

            p = p.then(function(result) {

              var invalidate;

              if(result) {
                //
                // it is possible to go from validate to invalidate and viceversa
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

                var estId = NO_ID;
                var estado = "";
                var editable = "";
                var message = "";

                var action = invalidate ? "invalidate" : "validate";
                p = Cairo.Database.execute("put[" + m_apiPath + "documento/" + doctId.toString() + "/" + action + "]", id);

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
      editor.setFooter(Dialogs.Views.Controller.newDialog());
      editor.setItems(Dialogs.Views.Controller.newDialog());
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
    /*
     this function should return:

     info.id,
     info.total * ((info.cotizacion !== 0) ? info.cotizacion : 1),
     info.nrodoc,
     info.prov_id,
     info.proveedor,
     info.suc_id,
     info.doc_id,
     info.doct_id === D.Types.NOTA_CREDITO_COMPRA,
     info.emp_id,
     info.empresa,
     info.is_auto_apply // only when it is a payment
     */
    return DB.getData("load[" + m_apiPath + "documento/" + doctId.toString() + "/info]", id).then(function(response) {

      var info = { success: response.success };

      if(response.success === true) {
        info.id = valField(response.data, C.ID);
        info.cotizacion = valField(response.data, C.COTIZACION);
        info.total = valField(response.data, C.TOTAL) * ((info.cotizacion !== 0) ? info.cotizacion : 1);
        info.nrodoc = valField(response.data, C.NRO_DOC);
        info.prov_id = valField(response.data, C.PROV_ID);
        info.proveedor = valField(response.data, C.PROV_NAME);
        info.cli_id = valField(response.data, C.CLI_ID);
        info.cliente = valField(response.data, C.CLI_NAME);
        info.suc_id = valField(response.data, C.SUC_ID);
        info.doc_id = valField(response.data, C.DOC_ID);
        info.doct_id = valField(response.data, C.DOCT_ID);
        info.emp_id = valField(response.data, C.EMP_ID);
        info.empresa = valField(response.data, C.EMP_NAME);
        info.doct_id_cliente = valField(response.data, C.DOCT_ID_CLIENTE);
        info.id_cliente = valField(response.data, C.ID_CLIENTE);
        info.is_auto_apply = valField(response.data, C.IS_AUTO_APPLY)
      }
      return info;
    });
  };

  Cairo.Documents.showDocAux = function(id, objEditName) {
    try {

      var dialog = Dialogs.Views.Controller.newDialog();
      var editor = Cairo[objEditName].Edit.Controller.getEditor();
      editor.setDialog(dialog);

      setGenericDoc(editor);

      editor.edit(id);
    }
    catch (ex) {
      Cairo.manageErrorEx(ex.message, ex, "showDocAux", "Documents", "");
    }
  };

  var isValidDate = function(docId, date) {

    if(docId === NO_ID) {
      return Cairo.Promises.failedPromise();
    }
    else {
      var p = DB.getData("load[" + m_apiPath + "documento/" + docId.toString() + "/is_valid_date]", Cairo.Database.sqlDate(date));

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
        Cairo.Modal.showWarningWithFail(getText(2914, "", result.range));
        // La fecha del Documento está fuera del rango permitido & _
        // por(las Fechas de Control de Acceso;; rango permtido:+ rango);
      }
      return result.success === true && result.isValid;
    })
  };

  Cairo.Documents.getCuentaInfo = function(cueId) {
    return DB.getData(
        "load[" + m_apiPath + "general/cuenta/" + cueId.toString() + "/info]").then(
      function(response) {

        var info = {}

        if(response.success === true) {
          info.monId = valField(response.data, C.MON_ID);
          info.empId = valField(response.data, C.EMP_ID);
          info.success = true;
        }
        else {
          info.success = false;
        }

        return info;
      }
    );
  };

  Cairo.Documents.getCurrencyFromAccount = function(cueId) {
    return DB.getData("load[" + m_apiPath + "general/cuenta/" + cueId.toString() + "/currency]").then(
      function(response) {

        var info = {}

        if(response.success === true) {
          info.monId = valField(response.data, C.MON_ID);
          info.monName = valField(response.data, C.MON_NAME);
          info.rate = valField(response.data, C.MON_COTIZACION);
          info.success = true;
        }
        else {
          info.success = false;
        }

        return info;
      }
    );
  };

  Cairo.Documents.setDefaultCurrency = Cairo.Company.setDefaultCurrency;

  Cairo.Documents.getDefaultCurrency = Cairo.Company.getDefaultCurrency;

  Cairo.Documents.accuntUsesDefaultCurrency = function(cueId) {
    return D.getCuentaInfo(cueId).then(function(info) {
      if(info.success) {
        return info.monId === Cairo.Documents.getDefaultCurrency().id;
      }
      else {
        return false;
      }
    });
  };

  Cairo.Documents.docHasChanged = function(dialog, lastDoc) {
    var property = dialog.getProperties().item(C.DOC_ID);
    var docId = property.getSelectId();
    var docName = property.getValue();

    return {
      changed: lastDoc !== docId,
      docId: docId,
      docName: docName
    }
  };

  Cairo.Documents.confirmDeleteDocument = function() {
    return Cairo.Modal.confirmViewYesDanger("Delete", "Do you want to delete this document ?"); // TODO: use language
  };

  Cairo.Documents.getEmailFromProveedor = function(provId) {
    return DB.getData("load[" + m_apiPath + "general/proveedor/" + provId.toString() + "/email]").then(
      function(response) {
        if(response.success === true) {
          var email = valField(response.data, C.PROV_EMAIL);
          return { success: true, email: email };
        }
        else {
          return { success: false };
        }
      }
    );
  };

  Cairo.Documents.getEmailFromCliente = function(provId) {
    return DB.getData("load[" + m_apiPath + "general/cliente/" + provId.toString() + "/email]").then(
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

  Cairo.Documents.getChequeData = function(cheqId) {
    return DB.getData("load[" + m_apiPath + "tesoreria/cheque/" + cheqId.toString() + "/info]");
  };

  Cairo.Documents.getChequeNumber = function(chqId) {
    return DB.getData("load[" + m_apiPath + "tesoreria/chequera/" + chqId.toString() + "/next_number]");
  };

  Cairo.Documents.showDataAddProveedor = function(showData, dialog) {
    if(showData) {
      var provId = dialog.getProperties().item(C.PROV_ID).getSelectId();

      if(provId !== NO_ID) {
        DB.getData("load[" + m_apiPath + "general/proveedor/" + provId.toString() + "/data_add]").then(
          function(response) {
            if(response.success === true) {
              try {
                var info = valField(response.data, 'info');
                var property = dialog.getProperties().item(CC.PROVEEDOR_DATA_ADD);
                property.setValue(info);
                dialog.showValue(property);
              }
              catch(ignore) {}
            }
          }
        );
      }
    }
    return true;
  };

  Cairo.Documents.showDataAddCliente = function(showData, dialog) {
    var p = null;
    if(showData) {
      var cliId = dialog.getProperties().item(C.CLI_ID).getSelectId();

      if(cliId !== NO_ID) {
        p = DB.getData("load[" + m_apiPath + "general/cliente/" + cliId.toString() + "/data_add]")
          .then(
            function(response) {
              if(response.success === true) {
                try {
                  var info = valField(response.data, 'info');
                  var property = dialog.getProperties().item(CV.CLIENTE_DATA_ADD);
                  property.setValue(info);
                  dialog.showValue(property);
                }
                catch(ignore) {}
              }
              return true;
            });
      }
    }
    return p || P.resolvedPromise(true);
  };

  Cairo.Documents.getDepositoFisicoForLogico = function(deplId) {
    return DB.getData("load[" + m_apiPath + "general/deposito_logico/" + deplId.toString() + "/info]").then(
      function(response) {
        if(response.success === true) {
          var info = valField(response.data, 'info');
          return info.depf_id;
        }
        else {
          return NO_ID;
        }
      }
    );
  };

  Cairo.Documents.docCanBeEdited = function(canBeEdited, message) {
    if(canBeEdited !== true) {
      return Cairo.Modal.showWarningWithFalse(getText(2913, "", message));
                                              // Este documento no puede ser modificado debido a:;; & DocEditMsg
    }
    else {
      return Cairo.Promises.resolvedPromise(true);
    }
  };

  Cairo.Documents.msgApplyDisabled = function(empName) {
    return Cairo.Modal.showWarningWithFalse(getText(2910, "", empName));
                                            // Este documento pertence a la empresa  & emp_nombre &
                                            // Para poder modificar su aplicaci�n debe ingresar a & emp_nombre &
  };

  Cairo.Documents.getInfo = function(tblId, id) {
    // TODO: implement this
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
      return NO_ID;
    }
  };

  Cairo.Documents.showEditStatus = function(msg, title) {
    if(msg !== "") {
      return Cairo.Modal.showInfo(msg, title);
    }
    else {
      return Cairo.Modal.showInfo(getText(2920, ""), title);
            //Ud. puede modificar el documento
    }
  };

  Cairo.Documents.getCurrencyRate = function(monId, date) {
    return DB.getData("load[" + m_apiPath + "documento/currency/" + monId.toString() + "/rate]", date).then(
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
    var p = DB.getData("load[" + m_apiPath + "documento/" + docId.toString() + "/edit_status]", actionId);

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

  Cairo.Documents.selectFilterForCuenta = "account_in_current_company";
  Cairo.Documents.selectFilterForCuentaCheques = "account_for_cheques"; /* banco or documentos en cartera */
  Cairo.Documents.selectFilterForCuentaChequesT = "account_for_cheques_t"; /* documentos en cartera */
  Cairo.Documents.selectFilterForCuentaChequesP = "account_for_cheques_p"; /* banco */
  Cairo.Documents.selectFilterForCuentaEfectivo = "account_for_efectivo"; /* banco or caja */
  Cairo.Documents.selectFilterForCuentaCaja = "account_for_caja"; /* caja */
  Cairo.Documents.selectFilterForCuentaAnticipoCobranza = "account_for_anticipo_cobranza"; /* duedor por ventas o deposito cupones */
  Cairo.Documents.selectFilterForCuentaAnticipoPagos = "account_for_anticipo_pagos"; /* acreedores */

  Cairo.Documents.selectFilterForTarjeta = "tarjeta_in_current_company";

  Cairo.Documents.updateChequeraFilter = function(property, key, cueId, dialog) {
    var col = D.getCol(property.getGrid().getColumns(), key)
    col.setSelectFilter("chequera|cueId:" + cueId.toString());
    dialog.refreshColumnProperties(property, key);
    return true;
  };

  Cairo.Documents.getTasaFromProducto = function(prId) {
    var p = DB.getData("load[" + m_apiPath + "general/producto/" + prId.toString() + "/taxes]");

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

    register.setPath(m_apiPath + "document/sign");

    var p = Cairo.Database.saveEx(
      register,
      false,
      "",
      'signDocument',
      'Cairo.Documents',
      getText(1594, ""))

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

  Cairo.Documents.move = function(doctId, compId, moveTo) {
    var p = DB.getData("load[" + m_apiPath + "documento/"
      + doctId.toString() + "/" + compId.toString() + "/move]", moveTo);

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

  Cairo.Documents.getListaPrecioForCliente = function(docId, cliId) {
    return "customer_list_price|customerId:" + cliId.toString() + ",documentId:" + docId.toString();
  };

  Cairo.Documents.getListaDescuentoForCliente = function(docId, cliId) {
    return "customer_list_discount|customerId:" + cliId.toString() + ",documentId:" + docId.toString();
  };

  Cairo.Documents.getSelectFilterSucursalCliente = function(cliId) {
    return "customer_branch|customerId:" + cliId.toString();
  };

  Cairo.Documents.getSelectFilterChofer = function(transId) {
    return "chofer|transId:" + transId.toString();
  };

  Cairo.Documents.getSelectFilterCamion = function(transId) {
    return "camion|transId:" + transId.toString();
  };

  Cairo.Documents.getCuentaGrupoFilterForProveedor = function() {
    return "supplier_account_group";
  };
  Cairo.Documents.getCuentaFilterForProveedor = function() {
    return "supplier_account_filter";
  };

  Cairo.Documents.getCuentaGrupoFilterForCliente = function() {
    return "customer_account_group";
  };
  Cairo.Documents.getCuentaFilterForCliente = function() {
    return "customer_account_filter";
  };

  Cairo.Documents.selectFilterCuentaNotInCaja = "account_filter_not_in_caja";

  Cairo.Documents.getCuentaOtroFilterForCaja = function(isHojaRuta, cjId) {
    if(isHojaRuta) {
      return "account_filter_caja|cajaId:" + cjId;
    }
    else {
      return Cairo.Documents.selectFilterCuentaNotInCaja;
    }
  };

  Cairo.Documents.getCuentaFilterForBanco = function(bcoId) {
    var filter = "account_filter_banco";
    if(bcoId) {
      filter += "|bancoId:" + bcoId.toString();
    }
    return filter;
  };

  Cairo.Documents.getCuentaChequeFilterForCaja = function(isHojaRuta, cjId) {
    // { cuec_id = banco - caja } and filter for caja
    //
    if(isHojaRuta) {
      return "account_filter_cheque_caja|cajaId:" + cjId;
    }
    else {
      return "account_filter_cheque_not_in_caja";
    }
  };

  Cairo.Documents.getCuentaEfectivoFilterForCaja = function(isHojaRuta, cjId) {
    // { cuec_id = banco - documentos en cartera } and filter for caja
    //
    if(isHojaRuta) {
      return "account_filter_efectivo_caja|cajaId:" + cjId;
    }
    else {
      return "account_filter_efectivo_not_in_caja";
    }
  };

  Cairo.Documents.getRubroTablaItemFilter = function(rubtId) {
    return "rubro_tabla_item|rubtId:" + rubtId.toString();
  };

  Cairo.Documents.getCustomerFatherFilter = function(cliId) {
    return "customer_father|customerId:" + cliId.toString();
  };

  Cairo.Documents.getCustomerReferrerFilter = function(cliId) {
    return "customer_referer|customerId:" + cliId.toString();
  };

  Cairo.Documents.ASIENTOS_DOC_FILTER = "document|documentTypeId:"
    + Cairo.Documents.Types.ASIENTO_CONTABLE.toString()
  ;

  Cairo.Documents.MOVIMIENTO_FONDO_DOC_FILTER = "document|documentTypeId:"
    + Cairo.Documents.Types.MOVIMIENTO_FONDO.toString()
  ;

  Cairo.Documents.DEPOSITO_BANCO_DOC_FILTER = "document|documentTypeId:"
    + Cairo.Documents.Types.DEPOSITO_BANCO.toString()
  ;

  Cairo.Documents.FACTURA_COMPRAS_DOC_FILTER = "document|documentTypeId:"
    + Cairo.Documents.Types.FACTURA_COMPRA.toString()
    + "*" + Cairo.Documents.Types.NOTA_CREDITO_COMPRA.toString()
    + "*" + Cairo.Documents.Types.NOTA_DEBITO_COMPRA.toString()
  ;

  Cairo.Documents.FACTURA_COMPRAS_REMITO_DOC_FILTER = "document|documentTypeId:"
    + Cairo.Documents.Types.FACTURA_COMPRA.toString()
    + "|invoiceType:" + Cairo.Documents.InvoiceWizardType.remito.toString()
  ;

  Cairo.Documents.FACTURA_VENTAS_DOC_FILTER = "document|documentTypeId:"
    + Cairo.Documents.Types.FACTURA_VENTA.toString()
    + "*" + Cairo.Documents.Types.NOTA_CREDITO_VENTA.toString()
    + "*" + Cairo.Documents.Types.NOTA_DEBITO_VENTA.toString()
  ;

  Cairo.Documents.NOTA_CREDITO_VENTAS_DOC_FILTER = "document|documentTypeId:"
    + Cairo.Documents.Types.NOTA_CREDITO_VENTA.toString()
  ;

  Cairo.Documents.NOTA_DEBITO_VENTAS_DOC_FILTER = "document|documentTypeId:"
    + Cairo.Documents.Types.NOTA_DEBITO_VENTA.toString()
  ;

  Cairo.Documents.FACTURA_VENTAS_REMITO_DOC_FILTER = "document|documentTypeId:"
    + Cairo.Documents.Types.FACTURA_VENTA.toString()
    + "|invoiceType:" + Cairo.Documents.InvoiceWizardType.remito.toString()
  ;

  Cairo.Documents.COBRANZA_DOC_FILTER = "document|documentTypeId:"
    + Cairo.Documents.Types.COBRANZA.toString()
  ;

  Cairo.Documents.ORDEN_PAGO_DOC_FILTER = "document|documentTypeId:"
    + Cairo.Documents.Types.ORDEN_PAGO.toString()
  ;

  Cairo.Documents.PEDIDO_VENTAS_DOC_FILTER = "document|documentTypeId:"
    + Cairo.Documents.Types.PEDIDO_VENTA.toString()
    + "*" + Cairo.Documents.Types.DEVOLUCION_PEDIDO_VTA.toString()
  ;

  Cairo.Documents.TRANSFERENCIA_STOCK_DOC_FILTER = "document|documentTypeId:"
    + Cairo.Documents.Types.TRANSFERENCIA_STOCK.toString()
  ;

  Cairo.Documents.REMITO_COMPRA_DOC_FILTER = "document|documentTypeId:"
    + Cairo.Documents.Types.REMITO_COMPRA.toString()
  ;

  Cairo.Documents.REMITO_VENTA_DOC_FILTER = "document|documentTypeId:"
    + Cairo.Documents.Types.REMITO_VENTA.toString()
  ;


  Cairo.getStockLoteFilter = function(prId,
                                      deplId,
                                      stockFisico,
                                      prIdKit,
                                      depfId) {

    return Cairo.getStockLoteFilterEx(prId,
                                      deplId,
                                      stockFisico,
                                      prIdKit,
                                      depfId,
                                      NO_ID, NO_ID);
  };

  Cairo.getStockLoteFilterEx = function(prId,
                                        deplId,
                                        stockFisico,
                                        prIdKit,
                                        depfId,
                                        cliId,
                                        provId) {
    return "stock_lote|"
      +  "prId:" + prId.toString()
      + ",deplId:" + deplId.toString()
      + ",stockFisico:" + stockFisico.toString()
      + ",prIdKit:" + prIdKit.toString()
      + ",depfId:" + depfId.toString()
      + ",cliId:" + cliId.toString()
      + ",provId:" + provId.toString();
  };

  Cairo.Documents.showNotes = function() {
    /* TODO: implement this. */
    return Cairo.Promises.resolvedPromise(false);
  };

  Cairo.Documents.addNote = function(doctId, id) {
    /* TODO: implement this. */
    return Cairo.Promises.resolvedPromise(false);
  };

  Cairo.Documents.PEDIDO_VENTAS_LIST_DOC_FILTER = Cairo.Documents.PEDIDO_VENTAS_DOC_FILTER + "|empId:0";
  Cairo.Documents.FACTURA_COMPRAS_LIST_DOC_FILTER = Cairo.Documents.FACTURA_COMPRAS_DOC_FILTER + "|empId:0";
  Cairo.Documents.FACTURA_VENTAS_LIST_DOC_FILTER = Cairo.Documents.FACTURA_VENTAS_DOC_FILTER + "|empId:0";
  Cairo.Documents.ASIENTOS_LIST_DOC_FILTER = Cairo.Documents.ASIENTOS_DOC_FILTER + "|empId:0";
  Cairo.Documents.COBRANZA_LIST_DOC_FILTER = Cairo.Documents.COBRANZA_DOC_FILTER + "|empId:0";
  Cairo.Documents.ORDEN_PAGO_LIST_DOC_FILTER = Cairo.Documents.ORDEN_PAGO_DOC_FILTER + "|empId:0";
  Cairo.Documents.MOVIMIENTO_FONDO_LIST_DOC_FILTER = Cairo.Documents.MOVIMIENTO_FONDO_DOC_FILTER + "|empId:0";
  Cairo.Documents.DEPOSITO_BANCO_LIST_DOC_FILTER = Cairo.Documents.DEPOSITO_BANCO_DOC_FILTER + "|empId:0";
  Cairo.Documents.TRANSFERENCIA_STOCK_LIST_DOC_FILTER = Cairo.Documents.TRANSFERENCIA_STOCK_DOC_FILTER + "|empId:0";

  Cairo.History = {};

  Cairo.History.show = function(tableId, id, title) {

  };

  var getKey = Cairo.Util.getKey;
  var DWC = Cairo.Constants.WizardKeys;
  var WCS = Cairo.Constants.WizardSteps;
  var WCC = Cairo.Constants.WizardConstants;
  var D = Cairo.Documents;
  var T = Dialogs.PropertyType;
  var ST = Dialogs.PropertySubType;

  Cairo.Documents.wizDocHasChanged = function(wizard, lastDoc) {
    var property = Cairo.Documents.getWizProperty(wizard, WCS.SELECT_PROVEEDOR, DWC.DOC);
    var docId = property.getSelectId();
    var docName = property.getValue();

    return {
      changed: lastDoc !== docId,
      docId: docId,
      docName: docName
    }
  };

  Cairo.Documents.wizGetDeposito = function(objWiz, keyStep, keyDeposito) {
    return objWiz.getSteps().item(getKey(keyStep)).getProperties().item(keyDeposito).getSelectId();
  };

  Cairo.Documents.wizShowNewStep = function(wiz, key, nroDoc) {
    Cairo.Documents.wizShowNewStepEx(wiz, key, nroDoc, false);
  };

  Cairo.Documents.wizShowNewStepEx = function(wiz, key, nroDoc, bShowActionButton) {

    var iStep = wiz.getSteps().item(getKey(key));
    var properties = iStep.getProperties();

    var titleProperty = properties.item(DWC.MAIN_TITLE);
    titleProperty.setValue(Cairo.Constants.NEW_DOC_DESCRIP);
    wiz.getDialog().showValue(titleProperty);

    var printProperty = properties.item(DWC.PRINT_DOC);
    printProperty.setName(Cairo.Constants.PRINT_DOC_TEXT.replace("%1", nroDoc));
    printProperty.setVisible(true);

    properties.item(DWC.NEW_DOC).setVisible(true);
    properties.item(DWC.CLOSE_WIZARD).setVisible(true);

    if(bShowActionButton) {
      properties.item(DWC.ACTION_BUTTON).setVisible(true);

      properties.item(DWC.ACTION_BUTTON_AUTO).setVisible(true);
      if(properties.contains(DWC.ACTION_CANCEL_AUTO)) {
        properties.item(DWC.ACTION_CANCEL_AUTO).setVisible(true);
      }
    }

    wiz.setCancelVisible(false);
    wiz.setBackVisible(false);
    wiz.setNextVisible(false);

    wiz.getDialog().showValue(printProperty);
    wiz.getDialog().resetChanged();

    // this stop the automatic wizard
    //
    wiz.setPushVirtualNext(false);
  };

  Cairo.Documents.getWizProperty = function(objWiz, stepId, keyItem) {
    return objWiz.getSteps().item(getKey(stepId)).getProperties().item(keyItem);
  };

  Cairo.Documents.wizAddNewDocProperties = function(wiz, key) {
    Cairo.Documents.wizAddNewDocPropertiesEx(wiz, key, "", "");
  };

  Cairo.Documents.wizAddNewDocPropertiesEx = function(wiz, key, strActionButtonCaption, strActionButtonAutoCaption) {
    Cairo.Documents.wizAddNewDocPropertiesEx2(wiz, key, strActionButtonCaption, strActionButtonAutoCaption, "");
  };

  Cairo.Documents.wizAddNewDocPropertiesEx2 = function(
    wiz, key, strActionButtonCaption, strActionButtonAutoCaption, strActionButtonCancelCaption) {

    var iStep = wiz.getSteps().item(getKey(key));

    var properties = iStep.getProperties();

    var elem = properties.add(null, DWC.PRINT_DOC);
    elem.setName(Cairo.Constants.PRINT_DOC_TEXT);
    elem.setCSSClass(Cairo.Constants.PRINT_DOC_CLASS);
    elem.setType(T.button);
    elem.setVisible(false);
    elem.setFontBold(true);
    elem.setKey(WCC.KW_PRINT_DOC);
    elem.setNoShowLabel(true);

    elem = properties.add(null, DWC.NEW_DOC);
    elem.setName(Cairo.Constants.NEW_DOC_TEXT);
    elem.setCSSClass(Cairo.Constants.NEW_DOC_CLASS);
    elem.setType(T.button);
    elem.setVisible(false);
    elem.setFontBold(true);
    elem.setKey(WCC.KW_NEW_DOC);
    elem.setNoShowLabel(true);

    elem = properties.add(null, DWC.CLOSE_WIZARD);
    elem.setName(Cairo.Constants.CLOSE_WIZARD_TEXT);
    elem.setCSSClass(Cairo.Constants.CLOSE_WIZARD_CLASS);
    elem.setType(T.button);
    elem.setVisible(false);
    elem.setFontBold(true);
    elem.setKey(WCC.KW_CLOSE_WIZARD);
    elem.setNoShowLabel(true);

    elem = properties.add(null, DWC.ACTION_BUTTON);
    elem.setName(strActionButtonCaption);
    elem.setType(T.button);
    elem.setVisible(false);
    elem.setFontBold(true);
    elem.setKey(WCC.KW_ACTION_BUTTON_DOC);
    elem.setNoShowLabel(true);

    elem = properties.add(null, DWC.ACTION_BUTTON_AUTO);
    elem.setName(strActionButtonAutoCaption);
    elem.setType(T.button);
    elem.setVisible(false);
    elem.setFontBold(true);
    elem.setKey(WCC.KW_ACTION_BUTTON_DOC_AUTO);
    elem.setNoShowLabel(true);

    if(strActionButtonCancelCaption !== '') {
      elem = properties.add(null, DWC.ACTION_CANCEL_AUTO);
      elem.setName(strActionButtonCancelCaption);
      elem.setType(T.button);
      elem.setVisible(false);
      elem.setFontBold(true);
      elem.setKey(WCC.KW_ACTION_BUTTON_DOC_CANCEL_AUTO);
    }
  };

  var m_defaultCurrency = Cairo.Documents.getDefaultCurrency();

  Cairo.Documents.wizCompraShowCotizacion = function(wiz, stepId, monId, show) {
    var p = null;

    var property = Cairo.Documents.getWizProperty(wiz, stepId, DWC.COTIZACION);
    property.setVisible(monId !== m_defaultCurrency.id);

    if(monId === m_defaultCurrency.id) {
      property.setValue(0);
    }
    else {
      p = Cairo.Documents.getCurrencyRate(monId, Cairo.Dates.today()).then(function(rate) {
        property.setValue(rate);
      });
    }

    p = p || P.resolvedPromise(true);

    p = p.then(function() {
      if(show) {
        wiz.showValue(property);
      }
      return true;
    });

    return p;
  };

  Cairo.Documents.wizGetDepositoProp = function(objWiz, keyStep, keyDeposito) {
    return objWiz.getSteps().item(getKey(keyStep)).getProperties().item(keyDeposito);
  };

  Cairo.Documents.wizGetDeposito = function(objWiz, keyStep, keyDeposito) {
    return Cairo.Documents.wizGetDepositoProp(objWiz, keyStep, keyDeposito).getSelectId();
  };

  Cairo.Documents.wizCompraLoadStepDatosGenerales = function(objWiz, resource, doc_id, prov_id, formatCotiz) {

    var properties = objWiz.getSteps().add(null, getKey(WCS.DATOS_GENERALES)).getProperties();

    var elem = properties.add(null);
    elem.setType(T.label);
    elem.setFontBold(true);
    elem.setValue(getText(1663, "")); // Complete los siguientes datos de la factura

    var elem = properties.add(null, DWC.FECHA);
    elem.setType(T.date);
    elem.setName(getText(1569, "")); // Fecha
    elem.setValue(Cairo.Dates.today());

    var elem = properties.add(null, DWC.FECHA_IVA);
    elem.setType(T.date);
    elem.setName(getText(1900, "")); // F. IVA
    elem.setValue(Cairo.Dates.today());

    var elem = properties.add(null, DWC.PROVEEDOR2);
    elem.setType(T.select);
    elem.setSelectTable(Cairo.Tables.PROVEEDOR);
    elem.setEnabled(false);
    elem.setName(getText(1151, "")); // Proveedor

    var elem = properties.add(null, DWC.CONDICION_PAGO);
    elem.setType(T.select);
    elem.setSelectTable(Cairo.Tables.CONDICIONES_DE_PAGO);
    elem.setName(getText(1395, "")); // Condición de Pago
    elem.setKey(WCC.KW_CPG_ID);

    var elem = properties.add(null, DWC.FECHA_VTO);
    elem.setType(T.date);
    elem.setName(getText(1634, "")); // Vto.
    elem.setValue(Cairo.Dates.today());
    elem.setVisible(false);

    var elem = properties.add(null, DWC.SUCURSAL);
    elem.setType(T.select);
    elem.setSelectTable(Cairo.Tables.SUCURSAL);
    elem.setName(getText(1281, "")); // Sucursal
    elem.setValue(Cairo.User.getSucName());
    elem.setSelectId(Cairo.User.getSucId());

    var elem = properties.add(null, DWC.COTIZACION);
    elem.setType(T.numeric);
    elem.setSubType(ST.money);
    elem.setName(getText(1635, "")); // Cotización
    elem.setFormat(formatCotiz);

    var elem = properties.add(null, DWC.COMPROBANTE);
    elem.setType(T.text);
    elem.setName(getText(1610, "")); // Comprobante

    var elem = properties.add(null, DWC.LISTA_PRECIO);
    elem.setType(T.select);
    elem.setSelectTable(Cairo.Tables.LISTAS_DE_PRECIOS);
    elem.setName(getText(1397, "")); // Lista de Precios
    elem.setSelectFilter(Cairo.Documents.getListaPrecioForProveedor(doc_id, prov_id));

    var elem = properties.add(null, DWC.LISTA_DESCUENTO);
    elem.setType(T.select);
    elem.setSelectTable(Cairo.Tables.LISTAS_DE_DESCUENTOS);
    elem.setName(getText(1398, "")); // Lista de Descuentos
    elem.setSelectFilter(Cairo.Documents.getListaDescuentoForProveedor(doc_id, prov_id));

    var elem = properties.add(null, DWC.LEGAJO);
    elem.setType(T.select);
    elem.setSelectTable(Cairo.Tables.LEGAJOS);
    elem.setName(getText(1575, "")); // Legajo

    var elem = properties.add(null, DWC.CENTRO_COSTO);
    elem.setType(T.select);
    elem.setSelectTable(Cairo.Tables.CENTROS_DE_COSTO);
    elem.setName(getText(1057, "")); // Centro de Costo

    var elem = properties.add(null, DWC.TIPO_COMPROBANTE);
    elem.setType(T.list);
    elem.setName(getText(1903, "")); // Tipo Comprobante
    elem.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
    var list = elem.getList();

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

    var elem = properties.add(null, DWC.COTIZACION_PROV);
    elem.setType(T.numeric);
    elem.setSubType(ST.money);
    elem.setName(getText(4653, "")); // Cotización Proveedor
    elem.setFormat(formatCotiz);

    var elem = properties.add(null, DWC.OBSERVACIONES);
    elem.setType(T.text);
    elem.setSubType(ST.memo);
    elem.setName(getText(1861, "")); // Observaciones
  };

  Cairo.Documents.setPrecioIvaEx = function(
    row, kII_PRECIO_SIN_IVA, kII_IVARIPercent, kII_IVARNIPercent,
    kII_INTERNOSPercent, kII_INTERNOSPorc, kII_PRECIOIVA, bIva, bIvaRni) {

    var ivaRi = null;
    var ivaRni = null;
    var internos = null;
    var int_porc = null;

    var precio = val(Dialogs.cell(row, kII_PRECIO_SIN_IVA).getValue());
    if(bIva) {
      ivaRi = (precio * val(Dialogs.cell(row, kII_IVARIPercent).getValue())) / 100;
    }
    if(bIvaRni) {
      ivaRni = (precio * val(Dialogs.cell(row, kII_IVARNIPercent).getValue())) / 100;
    }

    if(kII_INTERNOSPercent) {
      int_porc = val(Dialogs.cell(row, kII_INTERNOSPorc).getValue());
      internos = val(Dialogs.cell(row, kII_INTERNOSPercent).getValue());
      internos = ((precio * int_porc / 100) * internos) / 100;
    }

    var precioIva = precio + ivaRi + ivaRni + internos;

    Dialogs.cell(row, kII_PRECIOIVA).setValue(precioIva);
  };

  Cairo.Documents.setPrecios = function(row, prId, lpId, KI_PRECIO_LP, KI_PRECIO_USR) {
    var p;
    var price = 0;

    if(lpId !== NO_ID) {

      p = DB.getData(
        "load[" + m_apiPath + "general/producto/" + prId.toString() + "/price]", lpId);

      p = p.whenSuccessWithResult(function(response) {
        price = valField(response.data, 'price');
        return true;
      });
    }

    p = p || P.resolvedPromise(true);

    return p.then(function() {
      getCell(row, KI_PRECIO_LP).setValue(price);
      getCell(row, KI_PRECIO_USR).setValue(price);
      return true;
    });
  };

  //
  // getCurrentPrice is a function so we can use call(getPriceFromRow, rowIndex) when calling
  // setDescuentos
  //
  Cairo.Documents.setDescuentos = function(row, prId, currentPrice, ldId, KI_DESCUENTO, KI_PRECIO) {
    var p;
    var desc;
    var price = Cairo.isFunction(currentPrice) ? currentPrice() : currentPrice;

    if(ldId !== NO_ID) {

      p = DB.getData(
        "load[" + m_apiPath + "general/producto/" + prId.toString() + "/discount/" + ldId.toString() + "/price]", price);

      p = p.whenSuccessWithResult(function(response) {
        desc = valField(response.data, 'desc');
        price = valField(response.data, 'price');
        desc = desc.replace(/\$/g, "").replace(/%/g, "");
        return true;
      }).then(function() {
          getCell(row, KI_DESCUENTO).setValue(desc);
          if(KI_PRECIO !== undefined) {
            getCell(row, KI_PRECIO).setValue(price);
          }
          return true;
        });
    }
    else {
      if(KI_PRECIO !== undefined) {
        getCell(row, KI_PRECIO).setValue(price);
      }
    }
    return p || P.resolvedPromise(true);
  };

  Cairo.Documents.setTotal = function(row, kII_TOTAL, kII_APLICAR, kII_PRECIOIVA) {
    Dialogs.cell(row, kII_TOTAL).setValue(
      val(Dialogs.cell(row, kII_APLICAR).getValue())
      * val(Dialogs.cell(row, kII_PRECIOIVA).getValue())
    );
  };

  Cairo.Documents.wizNewDoc = function(wiz, iStep) {
    wiz.getCmdCancel().setVisible(true);
    wiz.getCmdBack().setVisible(true);
    wiz.getCmdNext().setVisible(true);
    wiz.doNextStep(iStep);
  };

  Cairo.Documents.wizPrintDocEx = function(id, lastDoc, emailPromise, getUserDescription, autoPrint, docId, nroDoc) {
    var p = null;

    try {

      id = id || NO_ID;

      if(id === NO_ID) {
        Cairo.infoViewShow("Printing", "The document must be saved before printing");
      }

      var config = Cairo.Settings;
      var reportConfig = config.Reports;
      var printManager = Cairo.Entities.Printing.createManager();

      printManager.setIsForEmail(false);

      printManager.setPath(
        Cairo.Util.File.getValidPath(
          config.get(
            reportConfig.reportSection,
            reportConfig.reportPath,
            config.appPath())));

      printManager.setCommandTimeout(
        Cairo.Util.val(
          config.get(
            reportConfig.reportSection,
            reportConfig.commandTimeOut,
            0)));

      printManager.setConnectionTimeout(
        Cairo.Util.val(
          config.get(
            reportConfig.reportSection,
            reportConfig.connectionTimeOut,
            0)));

      return emailPromise
        .whenSuccessWithResult(
          function(result) {
            printManager.setEmailAddress(result.email.trim());
            return getUserDescription();
          }
        ).whenSuccess(
          function(description) {
            printManager.setUserDescription(description);
          }
        ).then(
          function() {
            printManager.setAutoPrint(autoPrint);
            return printManager.showPrint(id, NO_ID, docId, false, nroDoc);
          }
        ).then(
          function(result) {
            return result;
          }
        );
    }
    catch(e) {
      Cairo.manageError(
        "Printing",
        "An error has occurred when printing.",
        e.message,
        e);
    }

    return (p || P.resolvedPromise(false));
  };

  //-----------------------------------------------------------------------
  // IdEx is used for sale delivery notices to indicate
  // the document is based in bom documents and by sale
  // invoices to indicate it is based in hours instead of
  // orders or delivery notes
  //
  Cairo.Documents.setDocumentForDoctId = function(docProperty, wiz, doctId, doctIdApplic, vIds, idEx) {

    var p = null;

    if(docProperty.getSelectId() === NO_ID) {

      var id = 0;

      if(vIds.length > 0) { id = vIds(1); }

      p = DB.getData("load[" + m_apiPath + "documento/from_doctId/"
                  + doctId.toString() + "/" + doctIdApplic.toString()
                  + "/" + id.toString() + "/" + idEx.toString() + "]")
        .then(function(response) {
          if(response.success === true) {
            docProperty.setSelectId(valField(response.data, 'id'));
            docProperty.setValue(valField(response.data, 'name'));
            wiz.showValue(docProperty);
            var result = {
              success: true,
              info: {
                id: valField(response.data, 'id'),
                name: valField(response.data, 'name'),
                monId: valField(response.data, 'monId')
              }
            };
            return result;
          }
          else {
            return P.fail();
          }
        });
    }

    return p || P.resolvedPromise(P.getSuccess());
  };

  // TODO: complete
  //
  Cairo.Documents.getCAE = function(fvId) {
    return P.resolvedPromise(true);
  };

  // TODO: complete
  //
  Cairo.Documents.updateTalonariosAFIP = function() {
    return P.resolvedPromise(true);
  };

  // TODO: complete
  //
  Cairo.Documents.sendCAEByEmail = function(fvId) {
    return P.resolvedPromise(true);
  };

  Cairo.Documents.loadPercepcionesForCliente = function(cliId, fecha) {

    var p = DB.getData("load[" + m_apiPath + "general/cliente/" + cliId.toString() + "/percepciones]", DB.sqlDate(fecha));

    return p.then(function(response) {

      if(response.success === true) {
        return {
          success: true,
          percepciones: DB.getResultSetFromData(response.data)
        };
      }
      else {
        return {
          success: false
        };
      }
    });
  };

  Cairo.Documents.checkCuitProveedorIsNotAlreadyUsed = function(cuit, provId) {

    if(cuit === "cuit") {
      return P.resolvedPromise(true);
    }

    var p = DB.getData("load[" + m_apiPath + "general/proveedor/validate_cuit]", cuit);

    return p.then(function(response) {

      if(response.success === true) {
        var prov_id = valField(response.data, C.PROV_ID);
        var code = valField(response.data, C.PROV_CODE);
        var razonSocial = valField(response.data, C.PROV_RAZONSOCIAL);
        if(prov_id !== 0 && prov_id !== provId) {
          return Cairo.Modal.showInfoWithFalse(getText(1452, "", "[" + code + "] " + razonSocial), getText(1453, ""));
              // El CUIT ya esta usado por el proveedor (1)
              // C.U.I.T. Proveedor
        }
        else {
          return true;
        }
      }
      else {
        return false;
      }
    });
  };

  Cairo.Documents.checkCuitClienteIsNotAlreadyUsed = function(cuit, cliId) {

    if(cuit === "cuit") {
      return P.resolvedPromise(true);
    }

    var p = DB.getData("load[" + m_apiPath + "general/cliente/validate_cuit]", cuit);

    return p.then(function(response) {

      if(response.success === true) {
        var cli_id = valField(response.data, C.CLI_ID);
        var code = valField(response.data, C.CLI_CODE);
        var razonSocial = valField(response.data, C.CLI_RAZONSOCIAL);
        if(cli_id !== 0 && cli_id !== cliId) {
          return Cairo.Modal.confirmViewYesDanger("", getText(1527, "", "[" + code + "] " + razonSocial));
          // El CUIT ya esta usado por el cliente (1)
          // Confirma que desea grabar este cliente con el mismo CUIT
        }
        else {
          return true;
        }
      }
      else {
        return false;
      }
    });
  };

  Cairo.Documents.loadCajaForCurrentUser = function() {

    var p = DB.getData("load[" + m_apiPath + "general/usuarioconfig/caja_info]");

    return p.then(function(response) {

      if(response.success === true) {
        return {
          success: true,
          cajaInfo: DB.getResultSetFromData(response.data)[0]
        };
      }
      else {
        return {
          success: false
        };
      }
    });
  };

  Cairo.Documents.validateNroCuit = function(cuit, bMustByRight) {
    var p;

    switch (Cairo.getContabilidadConfig().getClaveFiscal()) {

      case C.ClaveFiscalTipo.cuit:
        p = Cairo.Documents.validateNroCuitEx(cuit, bMustByRight);
        break;

      case C.ClaveFiscalTipo.rut:
        p = Cairo.Documents.validateRutEx(cuit, bMustByRight);
        break;
    }

    return p || P.resolvedPromise(false);
  };

  Cairo.Documents.validateNroCuitEx = function(cuit, bMustByRight) {
    try {

      // the word cuit is allowed as valid cuit
      //
      if(cuit.toLowerCase() === "cuit") {
        return P.resolvedPromise(true);
      }

      var msg = Cairo.Language.getText(2925, ""); // El número de CUIT no es válido

      if(cuit.trim() === "") {
        return Cairo.Modal.showWarningWithFalse(msg);
      }

      var ask = false;
      if(cuit.trim().length < 11) {
        ask = true;
      }
      else {
        cuit = Cairo.Util.replaceAll(cuit, "-", "");
        var sum = val(cuit.substr(0, 1)) * 5;
        sum = sum + val(cuit.substr(1, 1)) * 4;
        sum = sum + val(cuit.substr(2, 1)) * 3;
        sum = sum + val(cuit.substr(3, 1)) * 2;
        sum = sum + val(cuit.substr(4, 1)) * 7;
        sum = sum + val(cuit.substr(5, 1)) * 6;
        sum = sum + val(cuit.substr(6, 1)) * 5;
        sum = sum + val(cuit.substr(7, 1)) * 4;
        sum = sum + val(cuit.substr(8, 1)) * 3;
        sum = sum + val(cuit.substr(9, 1)) * 2;
        var rest = sum % 11;

        var digit = 11 - rest;
        digit = (digit === 11) ? 0 : digit;
        digit = (digit === 10) ? 1 : digit;

        if(digit !== val(cuit.substr(10, 1))) {
          ask = true;
        }
      }

      if(ask) {
        if(!bMustByRight) {
          return Cairo.Modal.confirmViewYesDanger("", msg + "<br><br>" + Cairo.Language.getText(1529, "")); // ¿Desea guardar los cambios de todas formas?
        }
        else {
          return Cairo.Modal.showWarningWithFalse(msg);
        }
      }

      return P.resolvedPromise(true);
    }
    catch (ex) {
      return Cairo.manageErrorEx(ex.message, ex, "validateNroCuitEx", "Documents", "");
    }
  };

  Cairo.Documents.validateRutEx = function(rut, bMustByRight) {
    try {

      var suma = 0;
      var cuenta = 2;
      var rut = Cairo.Util.replaceAll(rut, ".", "");

      var msg = Cairo.Language.getText(2919, ""); // El número de RUT no es válido

      if(rut.trim().length < 10 || Cairo.Util.isNumeric(rut.substr(0, 8))) {
        return Cairo.Modal.showWarningWithFalse(msg);
      }

      var dv = rut.substr(rut.length - 1);
      var numRut = rut.substr(0, 8);

      do {
        var dig = numRut % 10;
        numRut = Cairo.Util.toInt(numRut / 10);
        suma = suma + (dig * cuenta);
        cuenta = cuenta + 1;
        if(cuenta === 8) {
          cuenta = 2;
        }
      } while (numRut > 0);

      var resto = suma % 11;
      var digito = 11 - resto;

      var rutDigito = null;

      switch (digito) {
        case 10:
          rutDigito = "K";
          break;

        case 11:
          rutDigito = "0";
          break;

        default:
          rutDigito = digito.toString().trim();
          break;
      }

      var ask = false;

      if(rutDigito !== dv) {
        ask = true;
      }

      if(ask) {
        if(!bMustByRight) {
          return Cairo.Modal.confirmViewYesDanger("", msg + "<br><br>" + Cairo.Language.getText(1529, "")); // ¿Desea guardar los cambios de todas formas?
        }
        else {
          return Cairo.Modal.showWarningWithFalse(msg);
        }
      }

      return P.resolvedPromise(true);
    }
    catch (ex) {
      return Cairo.manageErrorEx(ex.message, ex, "validateRutEx", "Documents", "");
    }
  };

  Cairo.Documents.getFacturaVentaFilter = function(cliId) {
    return "factura_venta_for_cli_id|cliId:" + cliId;
  };

  Cairo.Documents.getFacturaCompraFilter = function(provId) {
    return "factura_compra_for_prov_id|provId:" + provId;
  };

  // TODO: remove this comment after all code is translated getCtaGrupoFilter
  Cairo.Documents.getCuentaGrupoFilter = function(cuentaGrupoType) {
    var filter = "";

    switch (cuentaGrupoType) {
      case C.CuentaGrupoTipo.acreedor:
        filter = "2*8"; // Bancos y Acreedores
        break;
      case C.CuentaGrupoTipo.deudor:
        filter = "4" // Deudores
        break;
      case C.CuentaGrupoTipo.productoCompra:
        filter = "5*6*9*10"; // Bienes de cambio y de uso, y Egresos e Ingresos (para descuentos obtenidos)
        break;
      case C.CuentaGrupoTipo.productoVenta:
        filter = "9*10"; // Ingresos y Egresos (para descuentos cedidos)
        break;
      case C.CuentaGrupoTipo.banco:
        filter = "2"; // Bancos
        break;
      case C.CuentaGrupoTipo.caja:
        filter = "14"; // Caja
        break;
      default:
        filter = "-1"
        break;
    }
    return "account_for_cuec_id|cuecId:" + filter;
  }

  var getCuentaGrupoTipo = function(cuegId) {
    return DB.getData("load[" + m_apiPath + "general/cuentagrupo]", cuegId).then(
      function(response) {
        if(response.success === true) {
          var cuentaGrupoType = valField(response.data, C.CUEG_TIPO);
          return { success: true, cuentaGrupoType: cuentaGrupoType };
        }
        else {
          return { success: false };
        }
      }
    );
  };

  Cairo.Documents.getCol = function(columns, key) {
    var hasKey = function(col) {
      return col.getKey() === key;
    };
    return columns.selectFirst(hasKey);
  };

  // TODO: remove this comment after all code is translated colUpdateCuentaFilterForCuentaGrupo
  //
  Cairo.Documents.colUpdateCuentaFilterForCuentaGrupo = function(property, row, col, dialog, KI_CUEG_ID, KI_CUE_ID) {
    var p = null;
    var grid = property.getGrid();
    var columns = grid.getColumns();

    switch(columns.item(col).getKey()) {
      case KI_CUE_ID:
        var cuegId = getCell(grid.getRows().item(row), KI_CUEG_ID).getId();

        p = getCuentaGrupoTipo(cuegId)
          .whenSuccessWithResult(function(result) {
            var filter = Cairo.Documents.getCuentaGrupoFilter(result.cuentaGrupoType);
            Cairo.Documents.getCol(columns, KI_CUE_ID).setSelectFilter(filter);
            dialog.refreshColumnProperties(property, C.CUE_ID);
            return true;
          });
        break;
    }

    return p || P.resolvedPromise(true);
  }

  // tesoreria

  Cairo.Documents.setSelectFilterCuotas = function(row, property, dialog, tarjetaKey) {
    var C_CUOTAS = "Cuotas";
    var tjcId = Dialogs.cell(row, tarjetaKey).getId();
    property.getGrid().getColumns().item(C_CUOTAS).setSelectFilter("instalments_for_tjcid|tjcId:" + tjcId.toString());
    dialog.refreshColumnProperties(property, C_CUOTAS);
  };

  Cairo.Documents.getSelectChequeFilter = function(cueId) {
    return "cheque|cueId:" + cueId.toString() + ",anulado:false";
  };

  Cairo.Documents.getSelectChequeFilterEnCartera = function(cheqIds) {
    var filter = "cheque_en_cartera";
    if(cheqIds !== "") {
      filter += "|cheqId:" + Cairo.Util.removeLastColon(cheqIds.toString());
    }
    return filter;
  };

  Cairo.Documents.getClienteName = function(cliId) {
    return DB.getData("load[" + m_apiPath + "general/cliente/" + cliId.toString() + "/name]");
  };

  /*
  *
  * cobranzas
  *
  * */

  var createTesoreria = function() {

    var addFacId = function(facIds, id) {

      for(var i = 0; i < facIds.length; i++) {
        if(facIds[i] === id) {
          return;
        }
      }
      facIds.push(id);
    };

    var addCtaCte = function(value, valueOrigen, ctaCte, facturaCueId, facId) {
      var cueId = 0;
      var cueName = "";

      for(var _i = 0, _count = facturaCueId.length; _i < _count; _i++) {
        if(facturaCueId[_i].facId === facId) {
          cueId = facturaCueId[_i].cueId;
          cueName = facturaCueId[_i].cueName;
          break;
        }
      }

      addCtaCteAux(value, valueOrigen, ctaCte, cueId, cueName);
    };

    var addCtaCteAux = function(value, valueOrigen, ctaCte, cueId, cueName) {

      for(var _i = 0, _count = ctaCte.length; _i < _count; _i++) {
        if(ctaCte[_i].cueId === cueId) {
          ctaCte[_i].importe += value;
          ctaCte[_i].importeOrigen += valueOrigen;
          return;
        }
      }

      //
      // we only get here if the account is not present in the ctaCte array
      //

      ctaCte.push(
        {
          importe: value,
          importeOrigen: valueOrigen,
          cueId: cueId,
          cueName: cueName
        }
      );
    };

    var loadCuentas = function(facturas, path) {
      return DB.getData("load[" + m_apiPath + "tesoreria/" + path + "?ids=" + facturas + "]");
    };

    var getCuentasAux = function(
      facturas, KI_FAC_ID, KI_APLICAR, KI_COTIZACION,
      deudor, anticipo, cueIdAnticipo, anticipoCuenta, anticipoOrigen) {

      var facIds = [];
      var ctaCte = [];

      for(var _i = 0, _count = facturas.getRows().size(); _i < _count; _i++) {
        var row = facturas.getRows().item(_i);
        if(val(Dialogs.cell(row, KI_APLICAR).getValue())) {
          addFacId(facIds, Dialogs.cell(row, KI_FAC_ID).getId());
        }
      }

      if(facIds.length === 0 && anticipo < 0) {
        return Cairo.Modal.showWarningWithFail("Debe seleccionar al menos una factura o un anticipo");
      }

      var p = null;

      if(facIds.length > 0) {

        if(deudor) {
          p = loadCuentas(facIds.toString(), "cobranza/cuentas");
        }
        else {
          p = loadCuentas(facIds.toString(), "ordenpago/cuentas");
        }

        p = p.whenSuccessWithResult(function(response) {
            try {
              var facturaCueId = [];
              var cuentas = DB.getResultSetFromData(response.data)
              for(var _i = 0, _count = cuentas.length; _i < _count; _i += 1) {
                facturaCueId.push(
                  {
                    cueId: valField(cuentas[_i], C.CUE_ID),
                    cueName: valField(cuentas[_i], C.CUE_NAME),
                    facId: valField(cuentas[_i], 0),
                    importe: 0,
                    importeOrigen: 0
                  }
                );
              }

              for(var _i = 0, _count = facturas.getRows().size(); _i < _count; _i++) {
                row = facturas.getRows().item(_i);
                var value = val(Dialogs.cell(row, KI_APLICAR).getValue());
                if(value > 0) {
                  var cotizacion = val(Dialogs.cell(row, KI_COTIZACION).getValue());
                  var valueOrigen = zeroDiv(value, cotizacion);
                  addCtaCte(value, valueOrigen, ctaCte, facturaCueId, Dialogs.cell(row, KI_FAC_ID).getId());
                }
              }

              if(anticipo > 0) {
                addCtaCteAux(anticipo, anticipoOrigen, ctaCte, cueIdAnticipo, anticipoCuenta);
              }

              return { success: true, cuentas: ctaCte };
            }
            catch (ex) {
              Cairo.manageErrorEx(ex.message, ex, "getCuentasAux", "Documents", "");
              return P.fail();
            }
          }
        );
      }

      return p || P.resolvedPromise(P.fail());
    };

    var self = {};

    self.getCuentasAcreedor = function(
      facturas, KI_FC_ID, KI_APLICAR, KI_COTIZACION,
      anticipo, cueIdAnticipo, anticipoCuenta, anticipoOrigen) {

      return getCuentasAux(
        facturas, KI_FC_ID, KI_APLICAR, KI_COTIZACION,
        false, anticipo, cueIdAnticipo, anticipoCuenta, anticipoOrigen);
    };

    self.getCuentasDeudor = function(
      facturas, KI_FV_ID, KI_APLICAR, KI_COTIZACION,
      anticipo, cueIdAnticipo, anticipoCuenta, anticipoOrigen) {

      return getCuentasAux(
        facturas, KI_FV_ID, KI_APLICAR, KI_COTIZACION,
        true, anticipo, cueIdAnticipo, anticipoCuenta, anticipoOrigen);
    };

    return self;
  };

  Cairo.Documents.Tesoreria = createTesoreria();

  Cairo.Documents.isCobranzaContado = function(fvId) {
    return DB.getData(
      "load[" + m_apiPath + "ventas/facturaventa/" + fvId.toString() + "/incash]");
  };

  Cairo.Documents.showCobranzaContado = function() {
    Cairo.raiseError("Cairo.Documents.showCobranzaContado", "not implemented");
  };

  /*
  *
  *
  * */

}());

// serial number managment
//
(function() {
  "use strict";

  var C = Cairo.General.Constants;
  var CC = Cairo.Compras.Constants;
  var NO_ID = Cairo.Constants.NO_ID;
  var getText = Cairo.Language.getText;
  var U = Cairo.Util;
  var Dialogs = Cairo.Dialogs;
  var getKey = Cairo.Util.getKey;

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

    self.setPrnsId = function(value) {
      m_prnsId = value;
    };

    self.getCode = function() {
      return m_code;
    };

    self.setCode = function(value) {
      m_code = value;
    };

    self.getCode2 = function() {
      return m_code2;
    };

    self.setCode2 = function(value) {
      m_code2 = value;
    };

    self.getCode3 = function() {
      return m_code3;
    };

    self.setCode3 = function(value) {
      m_code3 = value;
    };

    self.getDescrip = function() {
      return m_descrip;
    };

    self.setDescrip = function(value) {
      m_descrip = value;
    };

    self.getFechaVto = function() {
      return m_fechaVto;
    };

    self.setFechaVto = function(value) {
      m_fechaVto = value;
    };

    self.getPrId = function() {
      return m_prId;
    };

    self.setPrId = function(value) {
      m_prId = value;
    };

    self.getPrIdItem = function() {
      return m_prIdItem;
    };

    self.setPrIdItem = function(value) {
      m_prIdItem = value;
    };

    self.getKitItem = function() {
      return m_kitItem;
    };

    self.setKitItem = function(value) {
      m_kitItem = value;
    };

    self.getIdGroup = function() {
      return m_idGroup;
    };

    self.setIdGroup = function(value) {
      m_idGroup = value;
    };

    self.getPrIdKit = function() {
      return m_prIdKit;
    };

    self.setPrIdKit = function(value) {
      m_prIdKit = value;
    };

    self.getDeleted = function() {
      return m_deleted;
    };

    self.setDeleted = function(value) {
      m_deleted = value;
    };

    return self;

  };

  Cairo.SerialNumber.getCount = function(serialNumbers, grupo) {

    /* TODO: complete this

    var pt = null;
    var rtn = null;

    if(grupo === 0) { return 0; }

    if(mCollection.existsObjectInColl(serialNumbers, getKey(grupo))) {

      var _count = serialNumbers.get(getKey(grupo)).size();
      for(var _i = 0; _i < _count; _i++) {
        pt = serialNumbers.get(getKey(grupo)).item(_i);
        if(!pt.Cairo.SerialNumber.getDeleted()) {
          rtn = rtn + 1;
        }
      }
    }
    */

    return Cairo.Promises.resolvedPromise(true);
  };

  Cairo.SerialNumber.validateCount2 = function(
    row, keyGroup, rowIndex, serialNumbers, cantidad, strRow, keyPrId,
    keyAmount, keyNSerie, prId, deplId, isInput) {

    return Cairo.SerialNumber.validateCount2Ex(
      row, keyGroup, rowIndex, serialNumbers, cantidad, strRow, keyPrId,
      keyAmount, keyNSerie, prId, deplId, isInput, false);
  };

  Cairo.SerialNumber.validateCount2Ex = function(
    row, keyGroup, rowIndex, serialNumbers, cantidad, strRow, keyPrId,
    keyAmount, keyNSerie, prId, deplId, isInput, silent) {

    return Cairo.SerialNumber.validateCount3Ex(
      row, keyGroup, rowIndex, serialNumbers, cantidad, strRow, keyPrId,
      keyAmount, keyNSerie, prId, deplId, isInput, silent, false);
  };

  Cairo.SerialNumber.validateCount3Ex = function(
    row, keyGroup, rowIndex, serialNumbers, cantidad, strRow, keyPrId,
    keyAmount, keyNSerie, prId, deplId, isInput, silent, superSilent) {

    /* TODO: complete this

    var grupo = null;
    var nroSerieCount = null;

    grupo = Dialogs.cell(row, keyGroup).getId();
    nroSerieCount = Cairo.SerialNumber.getCount(serialNumbers, grupo);

    if(cantidad > nroSerieCount) {

      // silent=true  and supersilent=false    doesn't ask and doesn't create auxi numbers
      //
      // silent=false and supersilent=false    asks if must create auxi numbers
      //
      // superSilent=true                      doesn't ask and create auxi numbers
      //
      if((! silent) || superSilent) {

        if(! superSilent) {

          if(!cWindow.ask(getText(2915, "", cantidad, nroSerieCount, strRow), vbYes)) {
            //"Ud ha indicado " & Cantidad & " items pero solo " & _
            nroSerieCount.toString()+ " Números de Serie"+ strRow+ ";;¿Desea que Cairo genere números auxiliares por Ud?;";
            return null;

          }
        }
      }

      if(!create(Dialogs.cell(row, keyGroup).getId(), cantidad, row, serialNumbers, keyGroup, keyNSerie, rowIndex, prId, deplId, isInput, false, false,, null, NO_ID, NO_ID, 0, NO_ID)) { return false; }

    }
    else if(cantidad < nroSerieCount) {

      cWindow.msgInfo(getText(2916, "", rowIndex));
      //La cantidad del rénglon  & RowIndex &  es menor a la cantidad de & _
      números(de serie asociados. Indique el/los números de serie a eleminar.);

      if(!Cairo.SerialNumber.destroy(Dialogs.cell(row, keyGroup).getId(), val(Dialogs.cell(row, keyAmount).getValue()), row, serialNumbers, keyGroup, keyNSerie, rowIndex, prId, deplId, isInput, nroSerieCount - cantidad)) {

        cWindow.msgWarning(getText(2917, "", rowIndex));
        //El documento no será guardado hasta que no indique los números de & _
        serie(a eliminar o modifique la cantidad indicada en el rénglon+ rowIndex.toString());
        return null;
      }
    }
    */

    return Cairo.Promises.resolvedPromise(true);
  };

  Cairo.SerialNumber.validateCount = function(
    row, keyGroup, rowIndex, serialNumbers, cantidad, strRow, keyPrId,
    keyAmount, keyNSerie, prId, deplId, isInput) {

    /* TODO: complete this

    var grupo = null;
    var nroSerieCount = null;

    grupo = Dialogs.cell(row, keyGroup).getId();
    nroSerieCount = Cairo.SerialNumber.getCount(serialNumbers, grupo);

    if(cantidad > nroSerieCount) {
      cWindow.msgInfo(getText(2918, "", cantidad, nroSerieCount, strRow));
      //Ud ha indicado  & Cantidad &  items pero solo  & nroSerieCount.toString()+ números de serie" & strRow;
      return null;

    }
    else if(cantidad < nroSerieCount) {

      cWindow.msgInfo(getText(2916, "", rowIndex));
      //La cantidad del rénglon " & RowIndex & " es menor a la cantidad de & _
      números(de serie asociados. Indique el/los números de serie a eleminar.);

      if(!Cairo.SerialNumber.destroy(Dialogs.cell(row, keyGroup).getId(), val(Dialogs.cell(row, keyAmount).getValue()), row, serialNumbers, keyGroup, keyNSerie, rowIndex, prId, deplId, isInput, nroSerieCount - cantidad)) {

        cWindow.msgWarning(getText(2917, "", rowIndex));
        //El documento no será guardado hasta que no indique los números de & _
        serie(a eliminar o modifique la cantidad indicada en el rénglon+ rowIndex.toString());
        return null;
      }
    }
    */

    return Cairo.Promises.resolvedPromise(true);
  };

  Cairo.SerialNumber.quantityChangePPK = function(
    row, lRow, keyAmount, newValue, keyGroup, serialNumbers, keyPrId, keyNSerie,
    prId, deplId, isNew) {

    return quantityChange(
      row, lRow, keyAmount, newValue, keyGroup, serialNumbers, keyPrId, keyNSerie,
      prId, deplId, false, NO_ID, true, isNew);
  };

  Cairo.SerialNumber.quantityChange = function(
    row, lRow, keyAmount, newValue, keyGroup, serialNumbers, keyPrId, keyNSerie,
    prId, deplId, isInput, provId) {

    return quantityChange(
      row, lRow, keyAmount, newValue, keyGroup, serialNumbers, keyPrId, keyNSerie,
      prId, deplId, isInput, provId, false, false);
  };

  var quantityChange = function(
    row, lRow, keyAmount, newValue, keyGroup, serialNumbers, keyPrId, keyNSerie,
    prId, deplId, isInput, provId, isParteProd, isNewParteProd) {

    /* TODO: complete this

    var oldValue = null;
    oldValue = val(Dialogs.cell(row, keyAmount).getValue());

    if(oldValue !== newValue && oldValue > 0) {

      var grupo = null;
      var nroSerieCount = null;

      grupo = Dialogs.cell(row, keyGroup).getId();
      nroSerieCount = Cairo.SerialNumber.getCount(serialNumbers, grupo);

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
            cWindow.msgWarning(getText(3038, ""));
            //"Solo se puede modificar la cantidad" & _
            " en MENOS, en un parte de producción, "(+ " cuando el parte es nuevo.;;Para partes ya guardados hay que hacer un ""Parte de Desarme"".");
            return null;
          }
          else {
            if(!Cairo.SerialNumber.destroy(Dialogs.cell(row, keyGroup).getId(), val(Dialogs.cell(row, keyAmount).getValue()), row, serialNumbers, keyGroup, keyNSerie, lRow, prId, deplId, isInput, nroSerieCount - newValue)) {
              return null;
            }
          }

        }
        else if(nroSerieCount < newValue) {

          if(!Cairo.SerialNumber.edit(Dialogs.cell(row, keyGroup).getId(), newValue, row, serialNumbers, keyGroup, keyNSerie, lRow, prId, deplId, isInput, false,, null, provId, NO_ID)) {
            return null;
          }

        }
      }
    }
    */

    return Cairo.Promises.resolvedPromise(true);
  };

  Cairo.SerialNumber.editInput = function(
    group, amount, row, serialNumbers, keyGroup, keyNSerie, lRow,
    prId, deplId, isInput, bEditKit, collKitInfo, prov_id, cli_id) {

    return edit(
      group, amount, row, serialNumbers, keyGroup, keyNSerie, lRow,
      NO_ID, deplId, isInput, bEditKit, false, collKitInfo, prov_id, cli_id, 0, prId);
  };

  Cairo.SerialNumber.edit = function(
    group, amount, row, serialNumbers, keyGroup, keyNSerie, lRow,
    prId, deplId, isInput, bEditKit, collKitInfo, prov_id, cli_id) {

    return edit(
      group, amount, row, serialNumbers, keyGroup, keyNSerie, lRow,
      prId, deplId, isInput, bEditKit, false, collKitInfo, prov_id, cli_id, 0, 0);
  };

  Cairo.SerialNumber.destroy = function(
    group, amount, row, serialNumbers, keyGroup, keyNSerie, lRow, prId, deplId, isInput, deleteCount) {

    return edit(
      group, amount, row, serialNumbers, keyGroup, keyNSerie, lRow,
      prId, deplId, isInput, false, false, null, NO_ID, NO_ID, deleteCount, 0);
  };

  Cairo.SerialNumber.editPPK = function(
    group, amount, row, serialNumbers, keyGroup, keyNSerie, lRow,
    prId, deplId, isInput, bEditKit, collKitInfo) {

    return edit(
      group, amount, row, serialNumbers, keyGroup, keyNSerie, lRow,
      prId, deplId, isInput, bEditKit, true, collKitInfo, 0, 0, 0, 0);
  };

  Cairo.SerialNumber.editPDK = function(
    group, amount, row, serialNumbers, keyGroup, keyNSerie, lRow,
    prId, deplId, isInput, bEditKit, collKitInfo) {

    return edit(
      group, amount, row, serialNumbers, keyGroup, keyNSerie, lRow,
      prId, deplId, isInput, bEditKit, false, collKitInfo, 0, 0, 0, 0);
  };

  var getAmountForKit = function(collKitInfo, amount) {
    var rtn = 0;

    var _count = collKitInfo.size();
    for (var _i = 0; _i < _count; _i++) {
      var kitS = collKitInfo.item(_i);
      if(kitS.getHasSerial()) {
        rtn += kitS.getAmount() * amount;
      }
    }
    return rtn;
  };

  var edit  = function(
    group, amount, row, serialNumbers, KI_GROUP, KI_NRO_SERIE, lRow,
    prId, deplId, isInput, isEditKit, isParteProdKit, collKitInfo,
    provId, cliId, deleteCount, prId2) {

    if(amount < 1) {
      return Cairo.Modal.showWarningWithFail(getText(2921, "")); // Debe indicar una cantidad
    }

    var serialEditor = Cairo.ProductoSerie.Edit.Controller.getEditor();

    serialEditor.setIsEditKit(isEditKit);
    serialEditor.setIsParteProdKit(isParteProdKit);

    if(isEditKit) {
      amount = getAmountForKit(collKitInfo, amount);
    }

    if(collKitInfo === null) {
      return Cairo.Modal.showWarningWithFalse(getText(2922, ""));
                                  // No se recibió la definición del kit. No se pueden editar los Números(de Serie);
    }

    var coll = null;
    var n = 0;

    // if this item already have serial numbers associated to it
    //
    if(serialNumbers.contains(getKey(group))) {

      // from colleccion to edit dialog
      //
      coll = serialNumbers.get(getKey(group));
      for(var i = 0, count = coll.size(); i < count; i++) {
        serialEditor.addProductoSerie(coll.get(i));
      }
      n = serialEditor.getSerialNumbers().size();
    }

    if(isEditKit) {

      var kitS = null;

      while (n < amount) {
        for(var _i = 0, _count = collKitInfo.size(); _i < _count; _i += 1) {
          kitS = collKitInfo.item(_i);

          if(kitS.getHasSerial()) {

            for(var j = 0, count_j = kitS.getAmount(); j < count_j ; j += 1) {

              // create rows for new serial numbers
              //
              n += 1;
              serialEditor.addProductoSerie(Cairo.ProductoSerieType.createObject());
              var coll = serialEditor.getSerialNumbers(n);
              coll.setPrnsId(n * -1);
              coll.setPrId(prId != NO_ID ? prId : prId2);
              coll.setPrIdItem(kitS.getPrId());
              coll.setPrIdKit(kitS.getPrIdKit());
              coll.setKitItem(kitS.getName());
            }
          }
        }
      }
    }
    else {

      // Add rows for new serial numbers
      //
      for(i = n; i < amount; i += 1) {
        serialEditor.addProductoSerie(Cairo.ProductoSerieType.createObject());
        var serialNumber = serialEditor.getSerialNumbers().item(i);
        serialNumber.setPrnsId(i * -1);
        serialNumber.setPrId(prId ? prId : prId2);
      }
    }

    serialEditor.setDeplId(deplId);
    serialEditor.setPrId(prId);
    serialEditor.setIsInput(isInput);
    serialEditor.setCliId(cliId);
    serialEditor.setProvId(provId);
    serialEditor.setDelete(deleteCount);
    serialEditor.setDeleteCount(deleteCount);

    return serialEditor.edit().whenSuccess(function() {

      // if this item doesn't have serial numbers
      // create a new collection and add it to items collection
      // the group is negative to flag it is new
      //
      if(coll === null) {
        group = (lRow + 1) * -1;
        Dialogs.cell(row, KI_GROUP).setId(group);
        coll = Cairo.Collections.createCollection(Cairo.SerialNumber.create);
        serialNumbers.add(coll, getKey(group));
      }
      else {
        coll.clear();
      }

      // move from dialog to item collection
      //
      var serials = [];
      for(var i = 0, count = serialEditor.getSerialNumbers().size(); i < count; i += 1) {

        var delCount = 0;

        var pt = serialEditor.getSerialNumbers().get(i);
        pt.setPrId(prId ? prId : prId2);

        if(pt.getDeleted() && delCount < deleteCount) {
          delCount = delCount + 1;
          serials.push(pt.getCode() + (pt.getCode2().length > 0 ? " | "+ pt.getCode2() : "") + "(B)");
        }
        else {
          serials.push(pt.getCode() + (pt.getCode2().length > 0 ? " | "+ pt.getCode2() : ""));
        }

        coll.add(pt, getKey(pt.getPrnsId()));
      }

      var strSerialNumbers = "";
      if(serials.length > 0) {
        strSerialNumbers = serials.join(",");
      }
      Dialogs.cell(row, KI_NRO_SERIE).setValue(strSerialNumbers);

      return Cairo.Promises.resolvedPromise(true);
    });
  };

  var create = function(
    grupo, cantidad, row, serialNumbers, KI_GRUPO, KI_NROSERIE, lRow,
    prId, deplId, isInput, bEditKit, bParteProdKit, collKitInfo,
    prov_id, cli_id, deleteCount, prId2) {

    /* TODO: complete this

    var editSerie = null;
    var i = null;
    var n = null;
    var coll = null;
    var nros = null;

    if(cantidad < 1) {
      // Debe indicar una cantidad
      cWindow.msgWarning(getText(2921, ""));
      return null;
    }

    if(bEditKit) {
      cantidad = getAmountForKit(collKitInfo, cantidad);

      if(collKitInfo === null) {
        cWindow.msgWarning(getText(2922, ""));
        //No se recibio la definicion del kit. No se pueden editar los numeros de serie
        return null;
      }

    }

    // Si ya existen numeros de serie para este item
    //
    if(mCollection.existsObjectInColl(serialNumbers, getKey(grupo))) {

      // Paso de la coleccion a la ventana de edicion
      //
      coll = serialNumbers.get(getKey(grupo));

    }
    else {

      // Si este item aun no tiene numeros de serie
      // creo una nueva coleccion y la agrego a la coleccion de items
      // el grupo esta en negativo para indicar que son nuevos
      //

      grupo = lRow * -1;
      // (NrosSerie.Count + 1) * -1
      Dialogs.cell(row, KI_GRUPO).setID(grupo);
      coll = new Collection();
      serialNumbers.Add(coll, getKey(grupo));

    }

    n = coll.size();

    if(bEditKit) {

      var kitS = null;

      while (n < cantidad) {
        var _count = collKitInfo.size();
        for(var _i = 0; _i < _count; _i++) {
          kitS = collKitInfo.item(_i);

          if(kitS.getHasSerial()) {

            for(i = 1; i <= kitS.getCantidad(); i++) {

              // Creo filas para los nuevos numeros de serie
              //
              n = n + 1;
              coll.Add(new cProductoSerieType(), getKey(n * -1));
              coll.Codigo = getNextNumber();
              coll.prns_id = n * -1;
              coll.pr_id = prId ? prId : prId2);
              coll.pr_id_item = kitS.getPrId();
              coll.pr_id_kit = kitS.getPrIdKit();
              coll.KitItem = kitS.getName();
            }
          }
        }
      }
    }
    else {

      // Creo filas para los nuevos numeros de serie
      //
      for(i = n + 1; i <= cantidad; i++) {
        coll.Add(new cProductoSerieType(), getKey(i * -1));
        coll.Codigo = getNextNumber();
        coll.prns_id = i * -1;
        coll.pr_id = prId ? prId : prId2);
      }

    }

    // Paso de la ventana a la coleccion del item
    //
    for(i = 1; i <= coll.size(); i++) {

      var pt = null;
      var delCount = null;

      pt = coll.get(i);
      pt.setPrId(prId ? prId : prId2));
      if(pt.getDeleted() && delCount < deleteCount) {
        delCount = delCount + 1;
        nros = nros+ pt.getCode()+ "(B),";
      }
      else {
        nros = nros+ pt.getCode()+ ",";
      }
    }

    Dialogs.cell(row, KI_NROSERIE).getValue() === cUtil.removeLastColon(nros);
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
      VBA.ex.Raise -1, , getText(2923, "");
      //@@ERROR_SP:No se pudo obtener un Número de Serie auxiliar.
      return null;
    }

    return valField(rs.getFields(), 0);
    */
  };

}());

// kit management
//
(function() {
  "use strict";

  var C = Cairo.General.Constants;
  var CC = Cairo.Compras.Constants;
  var NO_ID = Cairo.Constants.NO_ID;
  var U = Cairo.Util;

  Cairo.KitInfo = {};

  Cairo.KitInfo.create = function() {
    var self = {
      prId: NO_ID,
      name: "",
      amount: 0,
      hasSerial: false
    };

    var that = {};

    that.setPrId = function(prId) {
      self.prId = prId;
    };
    that.getPrId = function() {
      return self.prId;
    };

    that.setName = function(name) {
      self.name = name;
    };
    that.getName = function() {
      return self.name;
    };

    that.setAmount = function(amount) {
      self.amount = amount;
    };
    that.getAmount = function() {
      return self.amount;
    };

    that.setHasSerial = function(hasSerial) {
      self.hasSerial = hasSerial;
    };
    that.getHasSerial = function() {
      return self.hasSerial;
    };

    return that;
  };

  Cairo.KitDefinition = {};

  Cairo.KitDefinition.create = function() {
    return Cairo.Collections.createCollection(Cairo.KitInfo.create);
  }

  Cairo.Kit = {};

  Cairo.Kit.getKitDefinition = function(key, kitDefinition) {
    return kitDefinition.getOrElse(key, null);
  };

  Cairo.Kit.getKitDefinitionForPrId = function(prId, kitDefinitions) {

    var key = U.getKey(prId);
    var kitDefinition = Cairo.Kit.getKitDefinition(key, kitDefinitions)

    if(kitDefinition === null) {
      kitDefinition = kitDefinitions.add(null, key);
    }

    return kitDefinition;
  };

  Cairo.Kit.getKitInfo = function(key, kitDefinition) {
    return kitDefinition.getOrElse(key, null);
  };

  Cairo.Kit.getKitInfoForPrId = function(prId, kitDefinition) {

    var key = U.getKey(prId);
    var kitInfo = Cairo.Kit.getKitInfo(key, kitDefinition);

    if(kitInfo === null) {
      kitInfo = kitDefinition.add(null, key);
    }

    return kitInfo;
  };

}());

// virtual dates management
//
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

    self.setId = function(value) {
      m_id = value;
    };

    self.getName = function() {
      return m_name;
    };

    self.setName = function(value) {
      m_name = value;
    };

    self.getCode = function() {
      return m_code;
    };

    self.setCode = function(value) {
      m_code = value;
    };

    self.getGroup = function() {
      return m_group;
    };

    self.setGroup = function(value) {
      m_group = value;
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
    self.setDateNames = function(value) {
      m_dateNames = value;
    };

    self.getDate = function(dateName, iniDate) {
      var date;

      if(Cairo.Util.isNumeric(dateName)) {
        date = self.getDateById(dateName, iniDate);
      }
      else {
        date = self.getDateByName(dateName, iniDate);
      }

      return date;
    };

    self.getDateByName = function(dateName, iniDate) {
      var date;
      var offset = 0;

      dateName = dateName.toLowerCase();
      var t = dateName.indexOf("-");
      if(t === -1) {
        t = dateName.indexOf("+");
      }
      if(t > -1 ) {
        if(t === 0) {
          offset = val(dateName);
          dateName = "h";
        }
        else {
          offset = val(dateName.substr(t));
          dateName = dateName.substr(0, t);
        }
      }

      var _count = m_dateNames.size();
      for(var _i = 0; _i < _count; _i++) {
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

    self.getDateById = function(dateIndex, iniDate) {
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
          iniDate = addToDate("m", -(iniDate.getMonth()+1), iniDate);
          dateIndex = Cairo.Dates.VirtualDates.MONTH_LAST_DAY;
          break;
      }

      switch (dateIndex) {

        case Cairo.Dates.VirtualDates.WEECK_FIRST_DAY:
          dayNumber = iniDate.getDay();
          date = addToDate("d", -dayNumber, iniDate);
          break;

        case Cairo.Dates.VirtualDates.WEECK_LAST_DAY:
          dayNumber = (iniDate.getDay() + 1) % 7;
          date = addToDate("d", 7 -dayNumber, iniDate);
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

  Cairo.Dates.getVirtualDateOrElse = function(virtualDate, elseValue) {
    if(Cairo.Dates.DateNames.getDateNames().contains(virtualDate)) {
      return Cairo.Dates.DateNames.getDateByName(virtualDate);
    }
    else {
      return elseValue;
    }
  };

  var createDateDiff = function() {

    var MS_PER_DAY = 1000 * 60 * 60 * 24;

    // a and b are javascript Date objects
    var dateDiffInDays = function(a, b) {
      // Discard the time and time-zone information.
      var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
      var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
      return Math.floor((utc2 - utc1) / MS_PER_DAY);
    }

    var dateDiffInMonths = function(a, b) {
      var years = a.getFullYear() - b.getFullYear();
      var months;
      if(years === 0) {
        months = a.getMonth() - b.getMonth();
      }
      else {
        months = Math.abs(years * 12) + Math.abs(a.getMonth - b.getMonth);
        if(years < 0) months *= -1;
      }
      return months;
    };

    var dateDiffInYears = function(a, b) {
      return a.getFullYear() - b.getFullYear();
    };

    var dateDiff = function(datePart, dateA, dateB) {
      dateA = Cairo.Util.getDateValue(dateA);
      dateB = Cairo.Util.getDateValue(dateB);
      switch(datePart) {
        case "y":
          return dateDiffInYears(dateA, dateB);
        case "m":
          return dateDiffInMonths(dateA, dateB);
        case "d":
          return dateDiffInDays(dateA, dateB);
        default:
          Cairo.raiseError("dateDiff must be called with three arguments: datePart, dateA and dateB. datePart is y, m or d");
      }
    };

    return dateDiff;
  };

  Cairo.Dates.dateDiff = createDateDiff();

}());

// global business objects
//
(function() {
  "use strict";

  Cairo.Configuration = {};

  Cairo.Configuration.createConfigObjects = function() {
    var m_ventasConfig = null;
    var m_stockConfig = null;
    var m_contabilidadConfig = null;
    var m_tesorariaConfig = null;

    Cairo.getVentasConfig = function() {
      return m_ventasConfig;
    };

    Cairo.getStockConfig = function() {
      return m_stockConfig;
    };

    Cairo.getContabilidadConfig = function() {
      return m_contabilidadConfig;
    };

    Cairo.getTesoreriaConfig = function() {
      return m_tesorariaConfig;
    };

    var initVentasConfig = function() {
      m_ventasConfig = Cairo.VentaConfig.Edit.Controller.getEditor();
      return m_ventasConfig.load();
    };

    var initStockConfig = function() {
      m_stockConfig = Cairo.StockConfig.Edit.Controller.getEditor();
      return m_stockConfig.load();
    };

    var initContabilidadConfig = function() {
      m_contabilidadConfig = Cairo.ContConfig.Edit.Controller.getEditor();
      return m_contabilidadConfig.load();
    };

    var initTesoreriaConfig = function() {
      m_tesorariaConfig = Cairo.TesoreriaConfig.Edit.Controller.getEditor();
      return m_tesorariaConfig.load();
    };

    return Cairo.Promises.resolvedPromise(true)
      .whenSuccess(initContabilidadConfig)
      .whenSuccess(initStockConfig)
      .whenSuccess(initVentasConfig)
      .whenSuccess(initTesoreriaConfig)
      .then(Cairo.LoadingMessage.close);
  };

}());
