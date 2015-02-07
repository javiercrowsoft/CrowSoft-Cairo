(function() {
  "use strict";

  var C = Cairo.General.Constants;
  var CC = Cairo.Compras.Constants;

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
    DOC_CHANGED: -2
  }

  Cairo.Documents.Status = {
    pendiente: 1,
    pendienteDespacho: 2,
    pendienteCredito: 3,
    pendienteFirma: 4,
    finalizado: 5,
    rechazado: 6,
    anulado: 7
  };

  Cairo.Documents.types = {
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
  }

  Cairo.Documents.DialogKeys = {
    number: 'NUMBER_ID',
    status: 'STATUS_ID'
  }

  Cairo.Documents.getDocNumberForProveedor = function(provId, docId, dialog) {
    var apiPath = Cairo.Database.getAPIVersion();
    return Cairo.Database.getData("load[" + apiPath + "documents/" + docId.toString() + "/proveedor]", provId).then(
      function(response) {

        var property = dialog.getProperties().item(CC.FC_NRODOC);
        var number = "";
        var mask = "";
        var enabled = false;

        if(response.success === true) {
          number = Cairo.Database.valField(response.data, 'number');
          mask = Cairo.Database.valField(response.data, 'mask');
          enabled = Cairo.Database.valField(response.data, 'enabled');
        }

        property.setValue(number);
        property.setTextMask(mask);
        property.setEnabled(enabled);

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
      p = Cairo.Database.getData("load[" + apiPath + "documents/" + doctId + "/invalidate_status]", id)

      p.then(function(response) {

        if(response.success === true) {

          var p = null;

          var isEditable = Cairo.Database.valField(response.data, Cairo.Constants.DOC_EDITABLE);
          var estId = Cairo.Database.valField(response.data, Cairo.Constants.EST_ID);
          var actionInvalidate =  Cairo.Database.valField(response.data, "actionInvalidate");
          var actionValidate = Cairo.Database.valField(response.data, "actionValidate");
          var docId = Cairo.Database.valField(response.data, Cairo.Constants.DOC_ID);

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
                p = Cairo.Database.execute("put[" + apiPath + "documents/" + doctId + "/" + action + "]", id);

                p = p.then(function(response) {

                  if(response.success === true) {

                    estId = Cairo.Database.valField(response.data, Cairo.Constants.EST_ID);
                    estado = Cairo.Database.valField(response.data, Cairo.Constants.EST_NAME);

                    var property = dialog.getProperties().item(Cairo.Documents.DialogKeys.status);

                    property.setSelectId(estId);
                    property.setValue(estado);

                    dialog.showValue(property);

                    editable = Cairo.Database.valField(response.data, Cairo.Constants.DOC_EDITABLE);
                    message = Cairo.Database.valField(response.data, Cairo.Constants.DOC_EDIT_MSG);

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
            var message = Cairo.Database.valField(response.data, Cairo.Constants.DOC_EDIT_MSG)
            p = Cairo.Modal.showWarningWithFail(message);
          }

          return p;
        }
        else {
          return Cairo.Promises.failedPromise();
        }
      });

      return p;
    }
  };

  var setGenericDoc = function(editor) {
    if(editor.getEditorType() === "document") {
      editor.setFooter(Cairo.Dialogs.Views.Controller.newDialog());
      editor.setItems(Cairo.Dialogs.Views.Controller.newDialog());
    }
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
      var p = Cairo.Database.getData("load[" + apiPath + "documents/" + docId + "/is_validate_date]", Cairo.Database.sqlDate(date));

      p.then(function(response) {

        var isValid = false;
        var range = "";
        if(response.success === true) {
          isValid = Cairo.Database.valField(response.data, 0);
          range = Cairo.Database.valField(response.data, 1);
        }

        return { success: true, isValid: isValid, range: range};
      });

      return p;
    }
  };

  Cairo.Documents.docCanBeSaved = function(dialog, dateKey) {
    return self.docCanBeSavedEx(dialog, dateKey, C.DOC_ID);
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

  var defaultCurrency = Cairo.Constants.NO_ID;

  Cairo.Documents.setDefaultCurrency = function(value) {
    defaultCurrency = value;
  };

  Cairo.Documents.getDefaultCurrency = function() {
    return defaultCurrency;
  };

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
    return Cairo.Database.getData("load[" + apiPath + "proveedor/email]", provId).then(
      function(response) {
        if(response.success === true) {
          var email = Cairo.Database.valField(response.data, 'email');
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
        Cairo.Database.getData("load[" + apiPath + "proveedor/info]", provId).then(
          function(response) {
            if(response.success === true) {
              var info = Cairo.Database.valField(response.data, 'info');
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

  Cairo.Documents.getItems = function(dialog, key) {
    return dialog.getProperties().item(key);
  };

  Cairo.History = {};

  Cairo.History.show = function (tableId, id, title) {

  };

}());