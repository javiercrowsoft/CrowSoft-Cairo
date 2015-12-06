(function() {
  "use strict";

  Cairo.module("FacturaCompraRemitoWiz.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      var C_MODULE = "cFacturaCompraRemitoWiz";

      var getText = Cairo.Language.getText;

      var TITLE = getText(1892, ""); // Facturas de Compra
      var SAVE_ERROR_MESSAGE = getText(1907, ""); // Error al grabar la factura de compra      

      var P = Cairo.Promises;
      var NO_ID = Cairo.Constants.NO_ID;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var CC = Cairo.Compras.Constants;
      var Types = Cairo.Constants.Types;
      var valField = DB.valField;
      var getValue = DB.getValue;
      var valEmpty = Cairo.Util.valEmpty;
      var call = P.call;
      var D = Cairo.Documents;
      var U = Cairo.Util;
      var Percepciones = Cairo.Compras.Percepciones;
      var getCell = Dialogs.cell;
      var val = U.val;
      var bToI = U.boolToInt;
      var WC = Cairo.Constants.WizardConstants;
      var WCS = Cairo.Constants.WizardSteps;
      var DWC = Cairo.Constants.WizardKeys;
      var M = Cairo.Modal;
      var T = Dialogs.PropertyType;

      var KI_RC_ID = 1;
      var KI_SELECT = 2;
      var KI_DOC = 3;
      var KI_NRODOC = 4;
      var KI_FECHA = 5;
      var KI_DESCRIP = 8;
      var KI_TOTAL = 10;

      var KII_TO_ID = 400;

      var KII_SELECT = 1;
      var KII_RVI_ID = 2;
      var KII_ARTICULO = 5;
      var KII_CANTIDAD = 6;
      var KII_PENDIENTE = 7;
      var KII_APLICAR = 8;
      var KII_PRECIOIVA = 9;
      var KII_TOTAL = 10;
      var KII_DESCRIP = 11;
      var KII_PRECIO_SIN_IVA = 12;
      var KII_PRECIO_LP = 13;
      var KII_PRECIO_USR = 14;
      var KII_IVARIPERCENT = 15;
      var KII_IVARNIPERCENT = 16;
      var KII_DESCUENTO = 17;
      var KII_CCOS_ID = 18;

      var KII_INTERNOSPERCENT = 19;
      var KII_INTERNOSPORC = 20;

      var m_objWizard;

      var m_wizardProcessing;
      var m_wizardCancel;

      var m_id = 0;

      var m_provId = 0;
      var m_proveedor = "";
      var m_docId = 0;
      var m_documento = "";
      var m_monId = 0;
      var m_rcIds = 0;

      var m_showStockData;
      var m_deplId = 0;
      var m_deposito = "";

      var m_objClient = null;

      var m_bIva;
      var m_bIvaRni;

      var m_lastProvId = 0;
      var m_lastDocId = 0;

      var m_lastNroDoc = "";
      var m_lastCpgId = 0;

      var m_defaultCurrency = D.getDefaultCurrency();

      var m_apiPath = DB.getAPIVersion();

      self.getId = function() {
        return m_id;
      };

      self.setDocId = function(value) {
        m_docId = value;
        m_lastDocId = value;
      };

      self.setDocumento = function(value) {
        m_documento = value;
      };

      self.setShowStockData = function(value) {
        m_showStockData = value;
      };

      self.setMonId = function(value) {
        m_monId = value;
      };

      self.setProvId = function(value) {
        m_provId = value;
      };

      self.setProveedor = function(value) {
        m_proveedor = value;
      };

      self.setIva = function(iva, ivarni) {
        m_bIva = iva;
        m_bIvaRni = ivarni;
      };

      self.setRcIds = function(value) {
        m_rcIds = [];
        for(var i = 0; i < value.length; i++) {
          m_rcIds[i] = value[i];
        }
      };

      self.setObjClient = function(value) {
        m_objClient = value;
      };

      self.loadWizard = function() {
        return P.resolvedPromise(true);
      };

      self.isEmptyRow = function(key, row, rowIndex) {
        var isEmpty = null;

        try {

          switch (key) {
            case WC.KW_REMITOS:
              isEmpty = false;
              break;

            case WC.KW_ITEMS:
              isEmpty = isEmptyRowItems(row, rowIndex);
              break;

            case WC.KW_PERCEPCIONES:
              isEmpty = Percepciones.isEmptyRowPercepciones(row, rowIndex);
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "isEmptyRow", C_MODULE, "");
        }

        return P.resolvedPromise(isEmpty);
      };

      self.columnAfterUpdate = function(key, lRow, lCol) {
        try {

          switch (key) {

            case WC.KW_REMITOS:
              columnAfterUpdateRemito(getRemitosProperty(), lRow, lCol);
              break;

            case WC.KW_ITEMS:
              columnAfterUpdateItems(getItemsProperty(), lRow, lCol);
              break;

            case WC.KW_PERCEPCIONES:
              Percepciones.percepcionShowTotales(getPercepciones().getRows(), getTotalPercepciones());
              m_objWizard.showValue(getTotalPercepciones());
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnAfterUpdate", C_MODULE, "");
        }

        return P.resolvedPromise(true);
      };

      self.columnAfterEdit = function(key, lRow, lCol, newValue, newValueId) {
        var p = null;

        try {

          switch (key) {

            case WC.KW_PERCEPCIONES:
              p = Percepciones.columnAfterEditPercepciones(getPercepcionesProperty(), lRow, lCol, newValue, newValueId);
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

            case WC.KW_REMITOS:
              rtn = columnBeforeEditRemitos(getRemitosProperty(), lRow, lCol, iKeyAscii);
              break;

            case WC.KW_ITEMS:
              rtn = columnBeforeEditItems(getItemsProperty(), lRow, lCol, iKeyAscii);
              break;

            case WC.KW_PERCEPCIONES:
              rtn = true;
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnBeforeEdit", C_MODULE, "");
        }

        return P.resolvedPromise(rtn);
      };

      self.columnButtonClick = function(key, lRow, lCol, iKeyAscii) {

      };

      self.columnClick = function(key, lRow, lCol) {

      };

      self.deleteRow = function(key, row, lRow) {
        return P.resolvedPromise(false);
      };

      self.newRow = function(key, rows) {
        return P.resolvedPromise(false);
      };

      self.validateRow = function(key, row, rowIndex) {
        var p = null;
        
        try {

          switch (key) {
            
            case WC.KW_REMITOS:
              p = P.resolvedPromise(true);
              break;

            case WC.KW_ITEMS:
              p = validateRowItems(row, rowIndex);
              break;

            case WC.KW_PERCEPCIONES:
              p = Percepciones.validateRowPercepciones(row, rowIndex);
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "validateRow", C_MODULE, "");
        }

        return p || P.resolvedPromise(false);
      };

      var columnBeforeEditItems = function(property, lRow, lCol, iKeyAscii) {

        switch (property.getGrid().getColumns().item(lCol).getKey()) {
          
          case KII_SELECT:
          case KII_APLICAR:
          case KII_PRECIO_SIN_IVA:
          case KII_TO_ID:
            return true;

          default:
            return false;
        }
      };

      var columnBeforeEditRemitos = function(property, lRow, lCol, iKeyAscii) {
        switch (property.getGrid().getColumns().item(lCol).getKey()) {
          
          case KI_SELECT:
            return true;

          default:
            return false;
        }
      };

      var columnAfterUpdateRemito = function(property, lRow, lCol) {
        switch (property.getGrid().getColumns().get(lCol).getKey()) {

          case KI_SELECT:
            showTotalRemitos();
            break;
        }

        return true;
      };

      var columnAfterUpdateItems = function(property, lRow, lCol) {
        var maxVal = null;

        var grid = property.getGrid();
        switch (grid.getColumns().get(lCol).getKey()) {

          case KII_SELECT:
            
            var row = grid.getRows().get(lRow);
            selectItem(row, grid.getColumns());
            showTotalItems();
            break;

          case KII_APLICAR:
            
            var row = grid.getRows().get(lRow);
            var cell = getCell(row, KII_APLICAR);
            maxVal = val(getCell(row, KII_PENDIENTE).getValue());
            if(val(cell.getValue()) > maxVal) {
              cell.setValue(maxVal);
            }
            else if(val(cell.getValue()) < 0) {
              cell.setValue(0);
            }
            showTotalItems();
            break;

          case KII_PRECIO_SIN_IVA:
            
            var row = grid.getRows().get(lRow);
            D.setPrecioIvaEx(
              row,
              KII_PRECIO_SIN_IVA, KII_IVARIPERCENT, KII_IVARNIPERCENT,
              KII_INTERNOSPERCENT, KII_INTERNOSPORC, KII_PRECIOIVA,
              m_bIva, m_bIvaRni
            );
            showTotalItems();
            D.setTotal(row, KII_TOTAL, KII_APLICAR, KII_PRECIOIVA);
            break;
        }

        return true;
      };

      var selectAllRemitos = function(bSelect) {
        var remitos = getRemitos();
        for(var _i = 0, _count = remitos.getRows().size(); _i < _count; _i++) {
          var row = remitos.getRows().item(_i);
          getCell(row, KI_SELECT).setId(bToI(bSelect));
        }

        m_objWizard.showValueEx(getRemitosProperty(), true);
      };

      var selectAllItems = function(bSelect) {
        var items = getItems();

        for(var _i = 0, _count = items.getRows().size(); _i < _count; _i++) {
          var row = items.getRows().item(_i);
          getCell(row, KII_SELECT).setId(bToI(bSelect));
          selectItem(row, items.getColumns());
        }

        m_objWizard.showValueEx(getItemsProperty(), true);
      };

      var selectItem = function(row, columns) {
        var cell = getCell(row, KII_APLICAR);
        if(getCell(row, KII_SELECT).getId()) {
          if(val(cell.getValue()) === 0) {
            cell.setValue(getCell(row, KII_PENDIENTE).getValue());
          }
        }
        else {
          cell.setValue(0);
        }
      };

      var showTotalRemitos = function() {
        var total = 0;

        for(var _i = 0, _count = getRemitos().getRows().size(); _i < _count; _i++) {
          var row = getRemitos().getRows().item(_i);
          if(getCell(row, KI_SELECT).getId()) {
            total = total + val(getCell(row, KI_TOTAL).getValue());
          }
        }

        getTotal().setValue(total);
        m_objWizard.showValue(getTotal());
      };

      var showTotalItems = function() {
        var total = 0;

        for(var _i = 0, _count = getItems().getRows().size(); _i < _count; _i++) {
          var row = getItems().getRows().item(_i);
          total = total + val(getCell(row, KII_APLICAR).getValue()) * val(getCell(row, KII_PRECIOIVA).getValue());
        }

        getTotalItems().setValue(total);
        m_objWizard.showValue(getTotalItems());
      };

      self.getAplication = function() {
        return Cairo.Application.getName();
      };

      self.load = function() {
        try {
          m_objWizard.getDialog().setHideTitle(true);
          return loadSteps();
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "load", C_MODULE, "");
          return P.resolvedPromise(false);
        }
      };

      self.setObjWizard = function(value) {
        m_objWizard = value;
      };

      self.getObjWizard = function() {
        return m_objWizard;
      };

      self.work = function(currentStep, goingToNext) {
        var p = null;
        
        try {

          switch (currentStep) {
            case -1:

              break;

            case WCS.WELCOME:

              // first step, disable back
              m_objWizard.disableBack();
              break;

            case WCS.SELECT_ITEMS:

              if(goingToNext) {
                var iProp = null;
                iProp = getTodosItems();
                iProp.setName(Cairo.Constants.SELECT_ALL_TEXT);
                m_objWizard.showValue(iProp);
              }
              break;

            case WCS.PERCEPCIONES:

              break;

            case WCS.DATOS_GENERALES:

              p = setDatosGenerales();
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "work", C_MODULE, "");
        }

        return p || P.resolvedPromise(true);
      };

      self.nextStep = function(currentStep, nextStep) {
        var p = null;
        
        try {

          switch (currentStep) {

            // this is the first step called
            // it is used to inform the wizard manager which is the first step
            //
            case -1:

              nextStep = WCS.WELCOME;
              m_objWizard.disableBack();
              break;

            case WCS.WELCOME:

              nextStep = WCS.SELECT_PROVEEDOR;
              m_objWizard.setNextText(Cairo.Constants.NEXT_TEXT);
              m_objWizard.disableBack();
              m_lastProvId = NO_ID;
              setDatosProveedor();
              D.setDocumentForDoctId(
                getDocProperty(), m_objWizard, D.Types.FACTURA_COMPRA, D.Types.REMITO_COMPRA, m_rcIds, 0
              ).whenSuccessWithResult(function(result) {
                  if(result.info) {
                    m_docId = result.info.id;
                    m_documento = result.info.name;
                    m_monId = result.info.monId;
                  }
                }
              );
              self.propertyChange(WC.KW_DOC_ID);
              break;

            case WCS.SELECT_PROVEEDOR:

              if(getDoc() === NO_ID) {
                nextStep = WCS.SELECT_PROVEEDOR;
                p = M.showWarningWithFalse(getText(1562, ""), getText(1607, "")); // Debe indicar un documento, Facturas
              }
              else if(getProveedor() === NO_ID) {
                nextStep = WCS.SELECT_PROVEEDOR;
                p = M.showWarningWithFalse(getText(1860, ""), getText(1607, "")); // Debe indicar un Proveedor, Facturas
              }
              else if(D.wizGetDeposito(m_objWizard, WCS.SELECT_PROVEEDOR, DWC.DEPOSITO) === NO_ID && m_showStockData) {
                nextStep = WCS.SELECT_PROVEEDOR;
                p = M.showWarningWithFalse(getText(1559, ""), getText(1722, "")); // Debe indicar un deposito, Remitos
              }
              else {
                p = loadRemitosXProveedor()
                  .whenSuccess(
                    function() {
                      getTodos().setName(Cairo.Constants.SELECT_ALL_TEXT);
                      m_objWizard.showValue(getTodos());
                      m_objWizard.enableBack();
                      nextStep = WCS.SELECT_ORDEN_REMITO;
                      return true;
                    },
                    function() {
                      nextStep = WCS.SELECT_PROVEEDOR;
                      return M.showWarningWithFalse(getText(1911, ""), getText(1607, "")); // No se pudieron cargar los Remitos para este Proveedor, Facturas
                    }
                );
              }
              break;

            case WCS.SELECT_ORDEN_REMITO:

              p = checkRemitos(                
                ).whenSuccess(
                  function() {
                    return loadItemsXRemitos().whenSuccess(
                      function() {
                        nextStep = WCS.SELECT_ITEMS;
                        return true;
                      },
                      function() {
                        nextStep = WCS.SELECT_ORDEN_REMITO;
                        return M.showWarningWithFalse(getText(1912, ""), getText(1607, "")); // No se pudieron cargar los items de los remitos para este proveedor, Facturas
                      }
                    );
                  },
                  function() { 
                    nextStep = WCS.SELECT_ORDEN_REMITO; 
                    return false;
                  }
                );
              break;

            case WCS.SELECT_ITEMS:

              p = checkItems().whenSuccess(
                function() {
                  nextStep = WCS.PERCEPCIONES;
                  return true;
                },
                function() {
                  nextStep = WCS.SELECT_ITEMS;
                  return false;
                }
              );
              break;

            case WCS.PERCEPCIONES:

              if(!checkPercepciones()) {
                nextStep = WCS.PERCEPCIONES;
              }
              else {

                Percepciones.percepcionShowTotales(getPercepciones().getRows(), getTotalPercepciones());
                m_objWizard.showValue(getTotalPercepciones());
                p = showFechaVto().then(function() {
                  m_objWizard.setNextText(Cairo.Constants.FINISH_TEXT);
                  nextStep = WCS.DATOS_GENERALES;
                  return true;
                });
              }
              break;

            case WCS.DATOS_GENERALES:

              p = validateDatosGenerales().whenSuccess(
                function() {

                  return save().whenSuccess(
                    function() {
                      D.wizShowNewStep(m_objWizard, WCS.WELCOME, m_lastNroDoc);
                      nextStep = WCS.WELCOME;
                      return true;
                    },
                    function() {
                      nextStep = WCS.DATOS_GENERALES;
                      return false;
                    }
                  );
                },
                function() {
                  nextStep = WCS.DATOS_GENERALES;
                  return false;
                }
              )
              break;
          }

          p = p || P.resolvedPromise(true);
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "nextStep", C_MODULE, "");
          p = P.resolvedPromise(false);
        }

        return p.then(function(success) {
          if(success) {
            return {
              success: true,
              nextStep: nextStep
            }
          }
          else {
            return P.fail();
          }
        });
      };

      self.previousStep = function(nCurrentStep, nextStep) {
        var p = null;

        switch (nCurrentStep) {
          case WCS.WELCOME:
            nextStep = WCS.WELCOME;
            break;

          case WCS.SELECT_PROVEEDOR:
            nextStep = WCS.SELECT_PROVEEDOR;
            break;

          case WCS.SELECT_ORDEN_REMITO:
            m_objWizard.disableBack();
            nextStep = WCS.SELECT_PROVEEDOR;
            break;

          case WCS.SELECT_ITEMS:
            nextStep = WCS.SELECT_ORDEN_REMITO;
            break;

          case WCS.PERCEPCIONES:
            nextStep = WCS.SELECT_ITEMS;
            break;

          case WCS.DATOS_GENERALES:
            m_objWizard.setNextText(Cairo.Constants.NEXT_TEXT);
            nextStep = WCS.PERCEPCIONES;
            break;
        }

        p = p || P.resolvedPromise(true);

        return p.then(function(success) {
          if(success) {
            return {
              success: true,
              nextStep: nextStep
            }
          }
          else {
            return P.fail();
          }
        });
      };

      self.propertyChange = function(key) {
        var p = null;

        switch (key) {
          
          case WC.KW_CANCEL:
            
            if(m_wizardProcessing) {
              m_wizardCancel = true;
            }
            break;

          case WC.KW_CLOSE_WIZARD:
            
            // finish, now close wizard
            //
            m_objWizard.closeWizard();
            break;

          case WC.KW_PRINT_DOC:
            
            D.wizPrintDocEx(m_id, m_lastDocId, D.getEmailFromProveedor(m_lastProvId));
            break;

          case WC.KW_NEW_DOC:
            
            newEmptyProperties();
            D.wizNewDoc(m_objWizard, WCS.WELCOME);
            break;

          case WC.KW_TODOS:
            
            if(getTodos().getName() === Cairo.Constants.SELECT_ALL_TEXT) {
              selectAllRemitos(true);
              getTodos().setName(Cairo.Constants.UN_SELECT_ALL_TEXT);
            }
            else {
              selectAllRemitos(false);
              getTodos().setName(Cairo.Constants.SELECT_ALL_TEXT);
            }
            m_objWizard.showValue(getTodos());
            showTotalRemitos();
            break;

          case WC.KW_TODOS_ITEMS:

            if(getTodosItems().getName() === Cairo.Constants.SELECT_ALL_TEXT) {
              selectAllItems(true);
              getTodosItems().setName(Cairo.Constants.UN_SELECT_ALL_TEXT);
            }
            else {
              selectAllItems(false);
              getTodosItems().setName(Cairo.Constants.SELECT_ALL_TEXT);
            }
            m_objWizard.showValue(getTodosItems());
            showTotalItems();
            break;

          case WC.KW_DOC_ID:

            // if the document has changed
            //
            var changeInfo = D.wizDocHasChanged(m_objWizard, m_lastDocId);
            if(changeInfo.changed) {

              m_lastDocId = changeInfo.docId;

              p = DB.getData("load[" + m_apiPath + "documento/" + m_lastDocId.toString() + "/info]")
              .then(function(response) {
                if(response.success === true) {
                  m_monId = valField(response.data, C.MON_ID);
                  m_showStockData = valField(response.data, C.DOC_MUEVE_STOCK);
                }
                return response.success;
              })
              .whenSuccess(function() {
                  return D.wizCompraShowCotizacion(m_objWizard, WCS.DATOS_GENERALES, m_monId, true);
              })
              .whenSuccess(function() {
                var prop = D.wizGetDepositoProp(m_objWizard, WCS.SELECT_PROVEEDOR, DWC.DEPOSITO);
                prop.setEnabled(m_showStockData);
                m_objWizard.showValue(prop);
              });

            }
            break;

          case WC.KW_PROV_ID:

            setDatosProveedor();
            break;

          case WC.KW_CPG_ID:

            p = showFechaVto();
            break;
        }

        return p || P.resolvedPromise();
      };

      self.terminate = function() {
        try {
          m_objClient.terminateWizard(m_id);
        }
        catch(ignore) {
          Cairo.logError('Error in terminate', ignore);
        }
      };

      self.getPath = function() {
        return "#compra/facturadecompra/sobreremito";
      };

      self.getEditorName = function() {
        var id = "N" + (new Date).getTime().toString();
        return "facturacompra/sobreremito/" + id;
      };

      self.getTitle = function() {
        return getText(2168, ""); // Asistente de Facturas de Compra
      };

      var loadSteps = function() {

        m_lastDocId = m_docId;
        m_lastProvId = m_provId;

        loadStepWelcome();
        loadStepSelectProveedor();
        loadStepSelectRemito();
        loadStepSelectItems();
        loadStepPercepciones();

        D.wizCompraLoadStepDatosGenerales(
          m_objWizard, null, m_docId, m_provId, Cairo.Settings.getCurrencyRateDecimalsFormat()
        );
        return D.wizCompraShowCotizacion(m_objWizard, WCS.DATOS_GENERALES, m_lastDocId, false);
      };

      var loadStepWelcome = function() {
        
        // the step's key must be the constant that defines them
        // this is crucial for the navigation to work
        //
        var properties = m_objWizard.getSteps().add(null, U.getKey(WCS.WELCOME)).getProperties();

        var elem = properties.add(null, DWC.TITLE);
        elem.setType(T.title);        
        elem.setValue(getText(1913, "")); // Bienvenido al Asistente de Facturas de Compra

        var elem = properties.add(null, DWC.MAIN_TITLE);
        elem.setType(T.label);
        elem.setValue(getText(1681, "")); // Con este asistente usted podra generar las facturas sobre remitos.

        D.wizAddNewDocProperties(m_objWizard, WCS.WELCOME);

      };

      var loadStepSelectProveedor = function() {

        // the step's key must be the constant that defines them
        // this is crucial for the navigation to work
        //
        var properties = m_objWizard.getSteps().add(null, U.getKey(WCS.SELECT_PROVEEDOR)).getProperties();

        var elem = properties.add(null);
        elem.setType(T.label);
        elem.setValue(getText(1914, "")); // Indique el documento a utilizar y el Proveedor al que se le emitirá la Factura

        var elem = properties.add(null, DWC.DOC);
        elem.setName(getText(1567, "")); // Documento
        elem.setType(T.select);
        elem.setSelectFilter(D.FACTURA_COMPRAS_REMITO_DOC_FILTER);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setValue(m_documento);
        elem.setSelectId(m_docId);
        elem.setKey(WC.KW_DOC_ID);

        var elem = properties.add(null, DWC.PROVEEDOR);
        elem.setName(getText(1151, "")); // Proveedor
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PROVEEDOR);
        elem.setValue(m_proveedor);
        elem.setSelectId(m_provId);
        elem.setKey(WC.KW_PROV_ID);

        var elem = properties.add(null, DWC.DEPOSITO);
        elem.setName(getText(1574, "")); // Deposito
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.DEPOSITO_LOGICO);
        elem.setSelectId(Cairo.UserConfig.getDeplId());
        elem.setValue(Cairo.UserConfig.getDeplNombre());
        elem.setEnabled(m_showStockData);

        var elem = properties.add(null, DWC.ONLY_SELECTED);
        elem.setType(T.check);
        elem.setName(getText(1682, "")); // Cargar solo remitos seleccionados
        elem.setValue(m_rcIds.length > 0);
      };

      var loadStepSelectRemito = function() {

        // the step's key must be the constant that defines them
        // this is crucial for the navigation to work
        //
        var properties = m_objWizard.getSteps().add(null, U.getKey(WCS.SELECT_ORDEN_REMITO)).getProperties();

        var elem = properties.add(null);
        elem.setType(T.label);        
        elem.setValue(getText(1683, "")); // Seleccione los remitos

        var elem = properties.add(null, DWC.REMITOS);
        elem.setType(T.grid);
        setGridRemitos(elem.getGrid());
        elem.setKey(WC.KW_REMITOS);
        elem.setGridAddEnabled(false);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(false);

        var elem = properties.add(null, DWC.TODOS);
        elem.setName(Cairo.Constants.SELECT_ALL_TEXT);
        elem.setType(T.button);
        elem.setKey(WC.KW_TODOS);
        elem.setNoShowLabel(true);

        var elem = properties.add(null, DWC.TOTAL);
        elem.setName(getText(1584, "")); // Total
        elem.setType(T.numeric);
        elem.setSubType(T.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
      };

      var setGridRemitos = function(grid) {
        var columns = grid.getColumns();
        columns.clear();

        columns.add(null).setVisible(false);

        var elem = columns.add(null);
        elem.setType(Dialogs.PropertyType.check);
        elem.setKey(KI_SELECT);

        var elem = columns.add(null);
        elem.setName(getText(1223, "")); // Tipo
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KI_DOC);

        var elem = columns.add(null);
        elem.setName(getText(1567, "")); // Documento
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KI_NRODOC);

        var elem = columns.add(null);
        elem.setName(getText(1065, "")); // Número
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.integer);
        elem.setKey(KI_RC_ID);

        var elem = columns.add(null);
        elem.setName(getText(1569, "")); // Fecha
        elem.setType(Dialogs.PropertyType.date);
        elem.setFormat("dd/mm/yy");
        elem.setKey(KI_FECHA);

        var elem = columns.add(null);
        elem.setName(getText(1584, "")); // Total
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_TOTAL);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());

        var elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KI_DESCRIP);
      };

      var loadStepSelectItems = function() {

        // the step's key must be the constant that defines them
        // this is crucial for the navigation to work
        //
        var properties = m_objWizard.getSteps().add(null, U.getKey(WCS.SELECT_ITEMS)).getProperties();

        var elem = properties.add(null);
        elem.setType(T.label);
        elem.setValue(getText(1676, "")); // Seleccione los items he indique las cantidades que facturará de cada una de ellos

        var elem = properties.add(null, DWC.ITEMS);
        elem.setType(T.grid);
        setGridItems(elem.getGrid());
        elem.setKey(WC.KW_ITEMS);
        elem.setGridAddEnabled(false);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(false);

        var elem = properties.add(null, DWC.TODOS_ITEMS);
        elem.setName(Cairo.Constants.SELECT_ALL_TEXT);
        elem.setType(T.button);
        elem.setKey(WC.KW_TODOS_ITEMS);

        var elem = properties.add(null, DWC.TOTAL_ITEMS);
        elem.setName(getText(1584, "")); // Total
        elem.setType(T.numeric);
        elem.setSubType(T.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
      };

      var loadStepPercepciones = function() {

        // the step's key must be the constant that defines them
        // this is crucial for the navigation to work
        //
        var properties = m_objWizard.getSteps().add(null, U.getKey(WCS.PERCEPCIONES)).getProperties();

        var elem = properties.add(null);
        elem.setType(T.label);
        elem.setValue(getText(1915, "")); // Indique las percepciones si corresponde

        var elem = properties.add(null, DWC.PERCEPCIONES);
        elem.setType(T.grid);
        setGridPercepciones(elem.getGrid());
        elem.setKey(WC.KW_PERCEPCIONES);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        var elem = properties.add(null, DWC.TOTAL_PERCEPCIONES);
        elem.setName(getText(1584, "")); // Total
        elem.setType(T.numeric);
        elem.setSubType(T.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
      };

      var setGridPercepciones = function(grid) {
        grid.getColumns().clear();
        Percepciones.setGridPercepciones(grid, Cairo.Settings);
      };

      var setGridItems = function(grid) {

        var columns = grid.getColumns();
        columns.clear();

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_RVI_ID);

        var elem = columns.add(null);
        elem.setType(Dialogs.PropertyType.check);
        elem.setKey(KII_SELECT);

        var elem = columns.add(null);
        elem.setName(getText(1567, "")); // Documento
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KI_NRODOC);

        var elem = columns.add(null);
        elem.setName(getText(1065, "")); // Número
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.integer);
        elem.setKey(KI_RC_ID);

        var elem = columns.add(null);
        elem.setName(getText(1367, "")); // Articulo
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KII_ARTICULO);

        var elem = columns.add(null);
        elem.setName(getText(1586, "")); // Precio
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KII_PRECIO_SIN_IVA);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(Cairo.Security.silentHasPermissionTo(Cairo.Security.Actions.Compras.EDIT_PRICE_FAC));

        var elem = columns.add(null);
        elem.setName(getText(1374, "")); // Cantidad
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setKey(KII_CANTIDAD);
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());

        var elem = columns.add(null, DWC.PENDIENTE);
        elem.setName(getText(1609, "")); // Pendiente
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setKey(KII_PENDIENTE);
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());

        var elem = columns.add(null);
        elem.setName(getText(1662, "")); // Aplicar
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setKey(KII_APLICAR);
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());

        var elem = columns.add(null, DWC.TOTAL_ITEMS);
        elem.setName(getText(1584, "")); // Total
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KII_TOTAL);
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());

        var elem = columns.add(null);        
        elem.setName(getText(1661, "")); // Tipo Operación
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TIPOOPERACION);
        elem.setKey(KII_TO_ID);

        var elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KII_DESCRIP);

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_PRECIOIVA);

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_PRECIO_LP);

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_PRECIO_USR);

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_IVARIPERCENT);

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_IVARNIPERCENT);

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_INTERNOSPERCENT);

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_INTERNOSPORC);

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_DESCUENTO);

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_CCOS_ID);
      };

      var userCancel = function() {
        var p = null;

        if(m_wizardCancel) {
          p = M.confirmViewYesDanger("", getText(1665, "")) //Desea cancelar el proceso
                  .then(function(answer) { return answer === "yes"; });
        }
        m_wizardCancel = false;

        return p || P.resolvedPromise(false);
      };

      var getCotizacion = function() {
        return D.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.COTIZACION);
      };

      var getDocProperty = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_PROVEEDOR, DWC.DOC);
      };

      var getDoc = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_PROVEEDOR, DWC.DOC).getSelectId();
      };

      var getDocName = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_PROVEEDOR, DWC.DOC).getValue();
      };

      var getTodos = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_ORDEN_REMITO, DWC.TODOS);
      };

      var getTodosItems = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_ITEMS, DWC.TODOS_ITEMS);
      };

      var getTotal = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_ORDEN_REMITO, DWC.TOTAL);
      };

      var getTotalItems = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_ITEMS, DWC.TOTAL_ITEMS);
      };

      var getTotalPercepciones = function() {
        return D.getWizProperty(m_objWizard, WCS.PERCEPCIONES, DWC.TOTAL_PERCEPCIONES);
      };

      var getProveedor2 = function() {
        return D.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.PROVEEDOR2);
      };

      var getProveedorProp = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_PROVEEDOR, DWC.PROVEEDOR);
      };

      var getProveedor = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_PROVEEDOR, DWC.PROVEEDOR).getSelectId();
      };

      var getProveedorName = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_PROVEEDOR, DWC.PROVEEDOR).getValue();
      };

      var getOnlySelected = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_PROVEEDOR, DWC.ONLY_SELECTED);
      };

      var getItems = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_ITEMS, DWC.ITEMS).getGrid();
      };

      var getPercepciones = function() {
        return D.getWizProperty(m_objWizard, WCS.PERCEPCIONES, DWC.PERCEPCIONES).getGrid();
      };

      var getItemsProperty = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_ITEMS, DWC.ITEMS);
      };

      var getPercepcionesProperty = function() {
        return D.getWizProperty(m_objWizard, WCS.PERCEPCIONES, DWC.PERCEPCIONES);
      };

      var getRemitos = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_ORDEN_REMITO, DWC.REMITOS).getGrid();
      };

      var getRemitosProperty = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_ORDEN_REMITO, DWC.REMITOS);
      };

      var refreshRemitos = function() {
        m_objWizard.showValueEx(D.getWizProperty(m_objWizard, WCS.SELECT_ORDEN_REMITO, DWC.REMITOS), true);
      };

      var refreshItems = function() {
        m_objWizard.showValueEx(D.getWizProperty(m_objWizard, WCS.SELECT_ITEMS, DWC.ITEMS), true);
      };

      var getComprobante = function() {
        return D.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.COMPROBANTE);
      };

      var getLegajo = function() {
        return D.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.LEGAJO);
      };

      var getDescrip = function() {
        return D.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.OBSERVACIONES);
      };

      var getCentroCosto = function() {
        return D.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.CENTRO_COSTO);
      };

      var getCondicionPago = function() {
        return D.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.CONDICION_PAGO);
      };

      var getListaPrecio = function() {
        return D.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.LISTA_PRECIO);
      };

      var getListaDescuento = function() {
        return D.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.LISTA_DESCUENTO);
      };

      var getSucursal = function() {
        return D.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.SUCURSAL);
      };

      var getTipoComprobante = function() {
        return D.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.TIPO_COMPROBANTE);
      };

      var getFecha = function() {
        return D.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.FECHA);
      };

      var getFechaIva = function() {
        return D.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.FECHA_IVA);
      };

      var getFechaVto = function() {
        return D.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.FECHA_VTO);
      };

      var getCotizacionProv = function() {
        return D.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.COTIZACION_PROV);
      };

      var checkRemitos = function() {
        for(var _i = 0, _count = getRemitos().getRows().size(); _i < _count; _i++) {
          var row = getRemitos().getRows().item(_i);
          if(getCell(row, KI_SELECT).getId()) {
            return P.resolvedPromise(true);
          }
        }
        return M.showWarningWithFalse(getText(1677, "")); // Debe indicar uno o más remitos.
      };

      var checkPercepciones = function() {
        return true;
      };

      var checkItems = function() {
        var p = P.resolvedPromise(true);
        var existsSelected = false;

        var checkItem = function(row, i) {
          return validateRowItems(row, i).whenSuccess(function() {
            existsSelected = true;
            if(!val(getCell(row, KII_PRECIO_SIN_IVA).getValue()) !== 0) {
              return M.showWarningWithFalse(getText(1667, "", i + 1)); // Debe indicar un precio para el item (1)
            }
            return true;
          });
        };

        for(var _i = 0, _count = getItems().getRows().size(); _i < _count; _i++) {
          var row = getItems().getRows().item(_i);
          if(val(getCell(row, KII_APLICAR).getValue()) > 0) {
            p = p.whenSuccess(call(checkItem, row, _i));
          }
        }

        return p.whenSuccess(function() {
          if(!existsSelected) {
            return M.showWarningWithFalse(getText(1678, "")); // Debe indicar uno o más items.
          }
          if(!val(getTotalItems().getValue()) > 0) {
            return M.showWarningWithFalse(getText(1678, "")); // Debe indicar uno o más items.
          }
          return true;
        });
      };

      var validateRowItems = function(row, rowIndex) {
        var p = null;
        var strRow = " (Row: " + rowIndex.toString() + ")";

        if(valEmpty(getCell(row, KII_TO_ID).getId(), Types.id)) {
          p = M.showInfo(getText(1633, "", strRow)); //Debe indicar un tipo de operación (1)
        }

        return p || Cairo.Promises.resolvedPromise(true);
      };

      var getRemitosIds = function() {
        var ids = "";
        for(var _i = 0, _count = getRemitos().getRows().size(); _i < _count; _i++) {
          var row = getRemitos().getRows().item(_i);
          if(getCell(row, KI_SELECT).getId()) {
            ids = ids + getCell(row, KI_RC_ID).getId().toString() + ",";
          }
        }

        return U.removeLastColon(ids);
      };

      var loadItemsXRemitos = function() {

        var ids = getRemitosIds();
        return DB.getData("load[" + m_apiPath + "compras/facturacompras/remitos/items?ids=" + ids + "]")
          .then(function(response) {
            try {

              if(response.success === true) {

                var items = DB.getResultSetFromData(response.data);
                var rows = getItems().getRows();
                rows.clear();

                for(var _i = 0; _i < items.length; _i += 1) {

                  var row = rows.add(null);

                  var elem = row.add(null);
                  elem.setId(valField(items[_i], CC.RCI_ID));
                  elem.setKey(KII_RVI_ID);

                  var elem = row.add(null);
                  elem.setValue(0);
                  elem.setKey(KII_SELECT);

                  var elem = row.add(null);
                  elem.setValue(valField(items[_i], CC.RC_NRODOC));
                  elem.setKey(KI_NRODOC);

                  var elem = row.add(null);
                  elem.setValue(valField(items[_i], CC.RC_NUMERO));
                  elem.setId(valField(items[_i], CC.RC_ID));
                  elem.setKey(KI_RC_ID);

                  var elem = row.add(null);
                  elem.setValue(valField(items[_i], C.PR_NAME_COMPRA));
                  elem.setId(valField(items[_i], C.PR_ID));
                  elem.setKey(KII_ARTICULO);

                  var elem = row.add(null);
                  elem.setValue(valField(items[_i], CC.RCI_PRECIO+ "2"));
                  elem.setKey(KII_PRECIO_SIN_IVA);

                  var elem = row.add(null);
                  elem.setValue(valField(items[_i], CC.RCI_CANTIDAD_A_REMITIR));
                  elem.setKey(KII_CANTIDAD);

                  var elem = row.add(null);
                  elem.setValue(valField(items[_i], CC.RCI_PENDIENTEFAC));
                  elem.setKey(KII_PENDIENTE);

                  var elem = row.add(null);
                  elem.setValue(0);
                  elem.setKey(KII_APLICAR);

                  var elem = row.add(null);
                  elem.setValue(valField(items[_i], CC.RCI_IMPORTE));
                  elem.setKey(KII_TOTAL);

                  var elem = row.add(null);
                  elem.setId(D.Constants.TO_COMERCIAL_ID);
                  elem.setValue(D.Constants.TO_COMERCIAL);
                  elem.setKey(KII_TO_ID);

                  var elem = row.add(null);
                  elem.setValue(valField(items[_i], CC.RCI_DESCRIP));
                  elem.setKey(KII_DESCRIP);

                  var elem = row.add(null);
                  elem.setValue(valField(items[_i], CC.RCI_PRECIO));
                  elem.setKey(KII_PRECIOIVA);

                  var elem = row.add(null);
                  elem.setValue(valField(items[_i], CC.RCI_PRECIO_LISTA));
                  elem.setKey(KII_PRECIO_LP);

                  var elem = row.add(null);
                  elem.setValue(valField(items[_i], CC.RCI_PRECIO_USR));
                  elem.setKey(KII_PRECIO_USR);

                  var elem = row.add(null);
                  elem.setValue(valField(items[_i], CC.RCI_IVA_RIPORC));
                  elem.setKey(KII_IVARIPERCENT);

                  var elem = row.add(null);
                  elem.setValue(valField(items[_i], CC.RCI_IVA_RNIPORC));
                  elem.setKey(KII_IVARNIPERCENT);

                  var elem = row.add(null);
                  elem.setValue(valField(items[_i], CC.FCI_INTERNOS_PORC));
                  elem.setKey(KII_INTERNOSPERCENT);

                  var elem = row.add(null);
                  elem.setValue(valField(items[_i], C.PR_PORC_INTERNO_C));
                  elem.setKey(KII_INTERNOSPORC);

                  var elem = row.add(null);
                  elem.setValue(valField(items[_i], CC.RCI_DESCUENTO));
                  elem.setKey(KII_DESCUENTO);

                  var elem = row.add(null);
                  elem.setId(valField(items[_i], C.CCOS_ID));
                  elem.setKey(KII_CCOS_ID);

                }

                refreshItems();
                showTotalItems();
              }

              return response.success;
            }
            catch(ex) {
              Cairo.manageErrorEx(ex.message, ex, "showFacturaRemito", C_MODULE, "");
              return false;
            }
          });
      };

      var loadRemitosXProveedor = function(property) {
        var onlySelected = getOnlySelected().getValue();

        return DB.getData(
            "load[" + m_apiPath + "compras/facturacompras/proveedor/"
                    + getProveedor().toString()
                    + "/remitos/"
                    + m_monId.toString()
              + "]"
          )
          .then(function(response) {
            try {

              if(response.success === true) {

                var items = DB.getResultSetFromData(response.data);
                var rows = getRemitos().getRows();
                rows.clear();

                for(var _i = 0; _i < items.length; _i += 1) {

                  var rcId = valField(items[_i], CC.RC_ID);
                  var selected = getApply(rcId);

                  if(!onlySelected || selected) {

                    var row = rows.add(null);

                    row.add(null);

                    var elem = row.add(null);
                    elem.setId(bToI(selected));
                    elem.setKey(KI_SELECT);

                    var elem = row.add(null);
                    elem.setValue(valField(items[_i], C.DOC_NAME));
                    elem.setKey(KI_DOC);

                    var elem = row.add(null);
                    elem.setValue(valField(items[_i], CC.RC_NRODOC));
                    elem.setKey(KI_NRODOC);

                    var elem = row.add(null);
                    elem.setValue(valField(items[_i], CC.RC_NUMERO));
                    elem.setId(valField(items[_i], CC.RC_ID));
                    elem.setKey(KI_RC_ID);

                    var elem = row.add(null);
                    elem.setValue(valField(items[_i], CC.RC_FECHA));
                    elem.setKey(KI_FECHA);

                    var elem = row.add(null);
                    elem.setValue(valField(items[_i], CC.RC_TOTAL));
                    elem.setKey(KI_TOTAL);

                    var elem = row.add(null);
                    elem.setValue(valField(items[_i], CC.RC_DESCRIP));
                    elem.setKey(KI_DESCRIP);
                  }
                }

                refreshRemitos();
                showTotalRemitos();
              }

              return response.success;
            }
            catch(ex) {
              Cairo.manageErrorEx(ex.message, ex, "showFacturaRemito", C_MODULE, "");
              return false;
            }
          });
      };

      var getApply = function(rcId) {
        for(var i = 1, count = m_rcIds.length; i <= count; i++) {
          if(m_rcIds[i] === rcId) {
            return true;
          }
        }
        return false;
      };

      var isEmptyRowItems = function(row, rowIndex) {
        var rowIsEmpty = true;

        for(var _i = 0, _count = row.size(); _i < _count; _i++) {
          var cell = row.item(_i);

          switch (cell.getKey()) {
            case KII_RVI_ID:
            case KII_ARTICULO:
            case KII_PENDIENTE:

              if(!valEmpty(cell.getId(), Types.id)) {
                rowIsEmpty = false;
              }
              break;

            case KII_DESCRIP:
            case KII_CANTIDAD:

              if(!valEmpty(cell.getValue(), Types.text)) {
                rowIsEmpty = true;
              }
              break;

            case KII_APLICAR:

              if(!valEmpty(cell.getValue(), Types.date)) {
                rowIsEmpty = true;
              }
              break;
          }
        }

        return rowIsEmpty;
      };

      var getDocNumber = function() {
        var p = null;

        if(getComprobante().getValue() !== "") {
          p = P.resolvedPromise(true);
        }
        else {
          p = D.getDocNumberForProveedor(getProveedor(), getDoc()).then(
            function(response) {

              if(response.success === true) {

                var property = getComprobante();

                property.setValue(valField(response.data, C.TA_NUMBER));
                property.setTextMask(valField(response.data, C.TA_MASCARA));
                property.setEnabled(valField(response.data, C.TA_ENABLED));

                m_objWizard.showValue(property);
              }

              return response.success;
            }
          );
        }
        return p;
      };

      var setDatosGenerales = function() {
        var property = getProveedor2();
        property.setSelectId(getProveedor());
        property.setValue(getProveedorName());
        m_objWizard.showValue(getProveedor2());

        return getDocNumber().then(setDatosFromAplic);
      };

      var validateDatosGenerales = function() {
        if(valEmpty(getFecha().getValue(), Types.date)) {
          return M.showWarningWithFalse(getText(1669, "")); // Debe indicar la fecha de la factura
        }

        if(valEmpty(getCondicionPago().getSelectId(), Types.id)) {
          return M.showWarningWithFalse(getText(1561, "")); // Debe indicar la condicion de pago
        }

        var fechaVto = getFechaVto();
        if(valEmpty(fechaVto.getValue(), Types.date) && fechaVto.getVisible()) {
          return M.showWarningWithFalse(getText(1625, "")); // Debe indicar una fecha de vencimiento
        }

        if(valEmpty(getSucursal().getSelectId(), Types.id)) {
          return M.showWarningWithFalse(getText(1560, "")); // Debe indicar la sucursal
        }

        return P.resolvedPromise(true);
      };

      var initialize = function() {
        try {

          m_rcIds = [];

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "initialize", C_MODULE, "");
        }
      };

      self.destroy = function() {
        try {

          m_rcIds = null;
          m_objClient = null;

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");
        }
      };

      var getSave = function(register, cotizacion, isDefaultCurrency) {

        register.setFieldId(CC.FC_ID);
        register.setTable(CC.FACTURA_COMPRA);
        register.setPath(m_apiPath + "compras/facturacompra/from_remitos");
        register.setId(Cairo.Constants.NEW_ID);

        var fields = register.getFields();

        fields.add(CC.FC_NUMERO, 0, Types.long);
        fields.add(CC.FC_NRODOC, m_lastNroDoc, Types.text);
        fields.add(CC.FC_DESCRIP, getDescrip().getValue(), Types.text);
        fields.add(CC.FC_FECHA, getFecha().getValue(), Types.date);
        fields.add(CC.FC_FECHA_IVA, getFechaIva().getValue(), Types.date);
        fields.add(CC.FC_FECHA_VTO, getFechaVto().getValue(), Types.date);
        fields.add(C.PROV_ID, getProveedor(), Types.id);
        fields.add(C.CCOS_ID, getCentroCosto().getSelectId(), Types.id);
        fields.add(C.SUC_ID, getSucursal().getSelectId(), Types.id);
        fields.add(C.CPG_ID, getCondicionPago().getSelectId(), Types.id);
        fields.add(C.LP_ID, getListaPrecio().getSelectId(), Types.id);
        fields.add(C.LD_ID, getListaDescuento().getSelectId(), Types.id);
        fields.add(C.DOC_ID, getDoc(), Types.id);
        fields.add(C.LGJ_ID, getLegajo().getSelectId(), Types.id);
        fields.add(CC.FC_GRABAR_ASIENTO, 1, Types.boolean);
        fields.add(CC.FC_TIPO_COMPROBANTE, getTipoComprobante().getListItemData(), Types.integer);
        fields.add(C.DEPL_ID, D.wizGetDeposito(m_objWizard, WCS.SELECT_PROVEEDOR, DWC.DEPOSITO), Types.id);
        fields.add(CC.FC_COTIZACION_PROV, getCotizacionProv().getValue(), Types.double);
        fields.add(CC.FC_COTIZACION, cotizacion, Types.double);
        fields.add(C.EST_ID, D.Status.pendiente, Types.id);
        fields.add(CC.FC_ID, Cairo.Constants.NEW_ID, Types.long);

        // dummy fields
        //
        fields.add(CC.FC_FECHA_ENTREGA, Cairo.Constants.NO_DATE, Types.date);
        fields.add(CC.FC_CAI, '', Types.text);
        fields.add(C.PRO_ID_ORIGEN, NO_ID, Types.id);
        fields.add(C.PRO_ID_DESTINO, NO_ID, Types.id);
        fields.add(CC.FC_DESCUENTO1, 0, Types.currency);
        fields.add(CC.FC_DESCUENTO2, 0, Types.currency);
        fields.add(CC.FC_IMPORTE_DESC_1, 0, Types.currency);
        fields.add(CC.FC_IMPORTE_DESC_2, 0, Types.currency);
        fields.add(CC.FC_TOTAL_OTROS, 0, Types.currency);

        var footer = getFooter();

        var totalPercep = val(getTotalPercepciones().getValue());

        fields.add(CC.FC_SUBTOTAL, footer.neto * cotizacion, Types.currency);
        fields.add(CC.FC_NETO, footer.neto * cotizacion, Types.currency);
        fields.add(CC.FC_IVA_RI, footer.ivaRi * cotizacion, Types.currency);
        fields.add(CC.FC_IVA_RNI, footer.ivaRni * cotizacion, Types.currency);
        fields.add(CC.FC_INTERNOS, footer.internos * cotizacion, Types.currency);
        fields.add(CC.FC_TOTAL_PERCEPCIONES, totalPercep * cotizacion, Types.currency);

        var totalOrigen = footer.neto + totalPercep;
        if(m_bIva) {
          totalOrigen = totalOrigen + footer.ivaRi;
        }
        if(m_bIvaRni) {
          totalOrigen = totalOrigen + footer.ivaRni;
        }

        totalOrigen = totalOrigen + footer.internos;

        if(isDefaultCurrency) {
          fields.add(CC.FC_TOTAL_ORIGEN, 0, Types.currency);
        }
        else {
          fields.add(CC.FC_TOTAL_ORIGEN, totalOrigen, Types.currency);
        }

        fields.add(CC.FC_TOTAL, totalOrigen * cotizacion, Types.currency);
      };

      var save = function() {

        return D.docCanBeSavedEx(m_objWizard.getDialog(), DWC.FECHA_IVA, DWC.DOC)
          .whenSuccess(function() {

            var register = new DB.Register();

            var isDefaultCurrency = m_defaultCurrency === m_monId;
            var cotizacion = val(getCotizacion().getValue());

            if(isDefaultCurrency) {
              cotizacion = 1;
            }
            else {
              if(cotizacion === 0) { cotizacion = 1; }
            }

            m_lastNroDoc = getComprobante().getValue();

            getSave(register, cotizacion, isDefaultCurrency);
            saveItems(register, cotizacion, isDefaultCurrency);
            saveVinculacion(register);
            Percepciones.savePercepciones(
              register,
              getPercepcionesProperty(),
              cotizacion, isDefaultCurrency,
              false,
              "",
              NO_ID,
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
                      return M.showWarningWithFalse(result.errors.getMessage());
                    }
                    else {
                      m_id = result.data.getId();
                      return true;
                    }
                  }
                  else {
                    return false;
                  }
                }
              );
            }
          );
      };

      var saveItems = function(mainRegister, cotizacion, isDefaultCurrency) {

        var transaction = new DB.createTransaction();
        var orden = 0;
        var precio = 0;
        var ivaRi = 0;
        var ivaRni = 0;
        var internos = 0;
        var internosPorc = 0;
        var neto = 0;
        var importe = 0;
        var cantidad = 0;

        transaction.setTable(CC.FACTURA_COMPRA_ITEM_TMP);

        var rows = getItems().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          if(val(getCell(row, KII_APLICAR).getValue())) {

            var register = new DB.Register();
            register.setFieldId(CC.FCI_TMP_ID);
            register.setId(Cairo.Constants.NEW_ID);

            var fields = register.getFields();

            fields.add(CC.FCI_ID, Cairo.Constants.NEW_ID, Types.integer);
            
            for(var _j = 0, _countj = row.size(); _j < _countj; _j++) {

              var cell = row.item(_j);
              switch (cell.getKey()) {

                case KII_APLICAR:
                  cantidad = cell.getValue();
                  fields.add(CC.FCI_CANTIDAD, cell.getValue(), Types.double);
                  break;

                case KII_DESCRIP:
                  fields.add(CC.FCI_DESCRIP, cell.getValue(), Types.text);
                  break;

                case KII_PRECIO_SIN_IVA:
                  precio = val(cell.getValue()) * cotizacion;
                  fields.add(CC.FCI_PRECIO, precio, Types.currency);
                  break;

                case KII_PRECIO_LP:
                  fields.add(CC.FCI_PRECIO_LISTA, val(cell.getValue()) * cotizacion, Types.currency);
                  break;

                case KII_PRECIO_USR:
                  fields.add(CC.FCI_PRECIO_USR, val(cell.getValue()) * cotizacion, Types.currency);
                  break;

                case KII_DESCUENTO:
                  fields.add(CC.FCI_DESCUENTO, cell.getValue(), Types.text);
                  break;

                case KII_IVARIPERCENT:
                  ivaRi = cell.getValue();
                  fields.add(CC.FCI_IVA_RIPORC, ivaRi, Types.double);
                  break;

                case KII_IVARNIPERCENT:
                  if(m_bIvaRni) {
                    ivaRni = cell.getValue();
                  }
                  fields.add(CC.FCI_IVA_RNIPORC, ivaRni, Types.double);
                  break;

                case KII_INTERNOSPERCENT:
                  internos = cell.getValue();
                  fields.add(CC.FCI_INTERNOS_PORC, internos, Types.double);
                  break;

                case KII_INTERNOSPORC:
                  internosPorc = cell.getValue();
                  break;

                case KII_ARTICULO:
                  fields.add(C.PR_ID, cell.getId(), Types.id);
                  break;

                case KII_CCOS_ID:
                  fields.add(C.CCOS_ID, cell.getId(), Types.id);
                  break;

                case KII_TO_ID:
                  fields.add(C.TO_ID, cell.getId(), Types.id);
                  break;
              }
            }

            neto = precio * cantidad;
            fields.add(CC.FCI_NETO, neto, Types.currency);

            ivaRi = neto * ivaRi / 100;
            fields.add(CC.FCI_IVA_RI, ivaRi, Types.currency);

            ivaRni = neto * ivaRni / 100;
            fields.add(CC.FCI_IVA_RNI, ivaRni, Types.currency);

            internos = (neto * internosPorc / 100) * internos / 100;
            fields.add(CC.FCI_INTERNOS, internos, Types.currency);

            importe = neto + ivaRi + ivaRni + internos;
            fields.add(CC.FCI_IMPORTE, importe, Types.currency);

            if(isDefaultCurrency) {
              fields.add(CC.FCI_IMPORTE_ORIGEN, 0, Types.currency);
            }
            else {
              fields.add(CC.FCI_IMPORTE_ORIGEN, Cairo.Util.zeroDiv(importe, cotizacion), Types.currency);
            }

            // dummy fields
            //
            fields.add(C.STL_CODE, '', Types.text);
            fields.add(C.STL_ID, NO_ID, Types.id);
            fields.add(C.CUE_ID, -1, Types.id);
            fields.add(C.CUE_ID_IVA_RI, -1, Types.id);
            fields.add(C.CUE_ID_IVA_RNI, -1, Types.id);

            // this is very important. it is used to associate remitoCompraitem
            // with the new FacturaCompraitem
            //
            orden = orden + 1;
            fields.add(CC.FCI_ORDEN, orden, Types.integer);

            transaction.addRegister(register);
          }
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveVinculacion = function(mainRegister) {

        var transaction = new DB.createTransaction();
        var orden = 0;
        var bSave;

        transaction.setTable(CC.REMITO_FACTURA_COMPRA_TMP);

        var rows = getItems().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();
          register.setFieldId(CC.RC_FC_TMP_ID);
          register.setId(Cairo.Constants.NEW_ID);

          bSave = false;
          for(var _j = 0, _countj = row.size(); _j < _countj; _j++) {

            var cell = row.item(_j);

            if(getCell(row, KII_SELECT).getId()) {

              bSave = true;

              switch (cell.getKey()) {
                case KII_RVI_ID:
                  register.getFields().add(CC.RCI_ID, cell.getId(), Types.id);
                  break;

                case KII_APLICAR:
                  register.getFields().add(CC.RC_FC_CANTIDAD, cell.getValue(), Types.double);
                  break;
              }
            }
          }

          if(bSave) {

            // this is very important. it is used to associate remitoCompraitem
            // with the new FacturaCompraitem
            //
            orden = orden + 1;
            register.getFields().add(CC.FCI_ID, orden, Types.long);

            transaction.addRegister(register);
          }
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var getFooter = function() {
        var neto = 0;
        var ivaRi = 0;
        var ivaRni = 0;
        var internos = 0;

        var precio = 0;
        var cantidad = 0;
        var ivaRniPercent = 0;
        var ivaRiPercent = 0;
        var internosPercent = 0;
        var internosPorc = 0;

        var rows = getItems().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          if(getCell(row, KII_SELECT).getId()) {

            for(var _j = 0, _countj = row.size(); _j < _countj; _j++) {
              var cell = row.item(_j);
              switch (cell.getKey()) {
                case KII_APLICAR:
                  cantidad = cell.getValue();
                  break;

                case KII_PRECIO_SIN_IVA:
                  precio = cell.getValue();
                  break;

                case KII_IVARIPERCENT:
                  ivaRiPercent = cell.getValue();
                  break;

                case KII_IVARNIPERCENT:
                  if(m_bIvaRni) {
                    ivaRniPercent = cell.getValue();
                  }
                  break;

                case KII_INTERNOSPERCENT:
                  internosPercent = cell.getValue();
                  break;

                case KII_INTERNOSPORC:
                  internosPorc = cell.getValue();
                  break;
              }
            }

            neto = neto + (precio * cantidad);
            ivaRi = ivaRi + ((precio * cantidad) * ivaRiPercent / 100);
            ivaRni = ivaRni + ((precio * cantidad) * ivaRniPercent / 100);

            internos = internos + (((precio * cantidad) * internosPorc / 100) * internosPercent / 100);
          }
        }

        return {
          neto: neto,
          ivaRi: ivaRi,
          ivaRni: ivaRni,
          internos: internos
        }
      };

      var setDatosProveedor = function() {
        var p;
        var property = getProveedorProp();

        if(m_lastProvId !== property.getSelectId()) {

          m_lastProvId = property.getSelectId();

          p = DB.getData(
            "load[" + m_apiPath + "general/proveedor/" + m_lastProvId.toString() + "/info]", m_lastDocId);

          p = p.whenSuccessWithResult(function(response) {

            var lp_id = valField(response.data, C.LP_ID);
            var lp_name = valField(response.data, C.LP_NAME);
            var ld_id = valField(response.data, C.LD_ID);
            var ld_name = valField(response.data, C.LD_NAME);
            var cpg_id = valField(response.data, C.CPG_ID);
            var lp_filter = D.getListaPrecioForProveedor(m_docId, m_provId);
            var ld_filter = D.getListaDescuentoForProveedor(m_docId, m_provId);

            if(cpg_id !== NO_ID) {

              var cpg_name = valField(response.data, C.CPG_NAME);

              var prop = getCondicionPago()
                .setValue(cpg_name)
                .setSelectId(cpg_id);

              m_objWizard.showValue(prop);
            }

            var prop = getListaPrecio()
              .setSelectFilter(lp_filter);

            if(lp_id !== NO_ID) {
              prop.setValue(lp_name);
              prop.setSelectId(lp_id);
            }

            m_objWizard.showValue(prop);

            prop = getListaDescuento()
              .setSelectFilter(ld_filter);

            if(ld_id !== NO_ID) {
              prop.setValue(ld_name);
              prop.setSelectId(ld_id);
            }

            m_objWizard.showValue(prop);

            m_bIva = valField(response.data, C.HAS_IVA_RI);
            m_bIvaRni = valField(response.data, C.HAS_IVA_RNI);

          });

        }
        return p || P.resolvedPromise(false);        
      };

      var newEmptyProperties = function() {

        m_lastCpgId = -1;

        getRemitos().getRows().clear();
        getItems().getRows().clear();
        getPercepciones().getRows().clear();

        getComprobante()
          .setValue("")
          .setTextMask("");
        getCentroCosto()
          .setSelectId(NO_ID)
          .setValue("");
        getCondicionPago()
          .setSelectId(NO_ID)
          .setValue("");
        getListaPrecio()
          .setSelectId(NO_ID)
          .setValue("");
        getListaDescuento()
          .setSelectId(NO_ID)
          .setValue("");
        getLegajo()
          .setSelectId(NO_ID)
          .setValue("");
        getCotizacionProv()
          .setValue(0);

        getDescrip().setValue("");

        m_objWizard.showValue(getRemitosProperty());
        m_objWizard.showValue(getItemsProperty());
        m_objWizard.showValue(getPercepcionesProperty());
        m_objWizard.showValue(getComprobante());
        m_objWizard.showValue(getCentroCosto());
        m_objWizard.showValue(getCondicionPago());
        m_objWizard.showValue(getListaPrecio());
        m_objWizard.showValue(getListaDescuento());
        m_objWizard.showValue(getLegajo());
        m_objWizard.showValue(getDescrip());
        m_objWizard.showValue(getCotizacionProv());

      };

      var setDatosFromAplic = function() {
        var p = null;

        if(getComprobante().getValue() !== "") {
          p = P.resolvedPromise(true);
        }
        else {
          p = D.facturaCompraGetDataFromAplic(D.Types.REMITO_COMPRA, getRemitosIds()).then(
            function(response) {

              if(response.success === true) {

                var items = response.data.get('items');

                for(var i = 0, count = items.length; i < count; i += 1) {

                  var prop = getSucursal();
                  if(prop.getSelectId() === NO_ID && valField(items[i], C.SUC_ID) !== NO_ID) {

                    prop.setSelectId(valField(items[i], C.SUC_ID));
                    prop.setValue(valField(items[i], C.SUC_NAME));
                    m_objWizard.showValue(prop);
                  }

                  prop = getCondicionPago();
                  if(prop.getSelectId() === NO_ID && valField(items[i], C.CPG_ID) !== NO_ID) {

                    prop.setSelectId(valField(items[i], C.CPG_ID));
                    prop.setValue(valField(items[i], C.CPG_NAME));
                    m_objWizard.showValue(prop);
                  }

                  prop = getCentroCosto();
                  if(prop.getSelectId() === NO_ID && valField(items[i], C.CCOS_ID) !== NO_ID) {

                    prop.setSelectId(valField(items[i], C.CCOS_ID));
                    prop.setValue(valField(items[i], C.CCOS_NAME));
                    m_objWizard.showValue(prop);
                  }

                  prop = getLegajo();
                  if(prop.getSelectId() === NO_ID && valField(items[i], C.LGJ_ID) !== NO_ID) {

                    prop.setSelectId(valField(items[i], C.LGJ_ID));
                    prop.setValue(valField(items[i], C.LGJ_TITLE));
                    m_objWizard.showValue(prop);
                  }
                }
              }

              return response.success;
            }
          );
        }
        
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
              return response.success;
            }
          );
        }
        return p || P.resolvedPromise();
      };

      var setFechaVto = function(cpgId, response) {
        m_lastCpgId = cpgId;
        var esLibre = valField(response.data, C.CPG_ES_LIBRE);
        var property = getFechaVto();
        property.setVisible(esLibre);
        m_objWizard.showValue(property);
      };

      self.getObjectType = function() {
        return "cairo.modules.facturaCompraRemitoWiz";
      };

      initialize();

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

}());
