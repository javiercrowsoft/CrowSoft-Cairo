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
      var valField = DB.valField;
      var getValue = DB.getValue;
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

      var m_generalConfig;

      var m_id = 0;

      var m_prov_id = 0;
      var m_proveedor = "";
      var m_doc_id = 0;
      var m_documento = "";
      var m_monId = 0;
      var m_rcIds = 0;

      var m_bShowStockData;
      var m_depl_id = 0;
      var m_deposito = "";

      var m_objClient = null;

      var m_bIva;
      var m_bIvaRni;

      var m_lastProv = 0;
      var m_lastDoc = 0;

      var m_lastNroDoc = "";

      var m_userCfg;

      var m_lastCpgId = 0;

      var m_apiPath = DB.getAPIVersion();

      self.getId = function() {
        return m_id;
      };

      self.setDocId = function(rhs) {
        m_doc_id = rhs;
      };

      self.setDocumento = function(rhs) {
        m_documento = rhs;
      };

      self.setProvId = function(rhs) {
        m_prov_id = rhs;
      };

      self.setProveedor = function(rhs) {
        m_proveedor = rhs;
      };

      self.setRcIds = function(rhs) {
        m_rcIds = [];
        for (var i = 0; i < rhs.length; i++) {
          m_rcIds[i] = rhs[i];
        }
      };

      self.setObjClient = function(rhs) {
        m_objClient = rhs;
      };

      self.loadWizard = function() {
        return true;
      };

      self.isEmptyRow = function(key,  row,  rowIndex) {
        var isEmpty = null;

        try {

          switch (key) {
            case WC.KW_REMITOS:
              isEmpty = false;
              break;

            case WC.KW_ITEMS:
              isEmpty = pIsEmptyRowItems(row, rowIndex);
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

      self.columnAfterUpdate = function(key,  lRow,  lCol) {
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

      self.columnAfterEdit = function(key,  lRow,  lCol,  newValue,  newValueID) {
        var p = null;

        try {

          switch (key) {

            case WC.KW_PERCEPCIONES:
              p = Percepciones.columnAfterEditPercepciones(getPercepcionesProperty(), lRow, lCol, newValue, newValueID);
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnAfterEdit", C_MODULE, "");
        }

        return p || P.resolvedPromise(true);
      };

      self.columnBeforeEdit = function(key,  lRow,  lCol,  iKeyAscii) {
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

      self.columnButtonClick = function(key,  lRow,  lCol,  iKeyAscii) {

      };

      self.columnClick = function(key,  lRow,  lCol) {

      };

      self.deleteRow = function(key,  row,  lRow) {
        return P.resolvedPromise(false);
      };

      self.newRow = function(key,  rows) {
        return P.resolvedPromise(false);
      };

      self.validateRow = function(key,  row,  rowIndex) {
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

      var columnBeforeEditItems = function(property,  lRow,  lCol,  iKeyAscii) {

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

      var columnBeforeEditRemitos = function(property,  lRow,  lCol,  iKeyAscii) {
        switch (property.getGrid().getColumns().item(lCol).getKey()) {
          
          case KI_SELECT:
            return true;

          default:
            return false;
        }
      };

      var columnAfterUpdateRemito = function(property,  lRow,  lCol) {
        switch (property.getGrid().getColumns(lCol).Key) {

          case KI_SELECT:
            showTotalRemitos();
            break;
        }

        return true;
      };

      var columnAfterUpdateItems = function(property,  lRow,  lCol) {
        var maxVal = null;

        var grid = property.getGrid();
        switch (grid.getColumns(lCol).Key) {

          case KII_SELECT:
            
            var row = grid.getRows(lRow);
            selectItem(row, grid.getColumns());
            showTotalItems();
            break;

          case KII_APLICAR:
            
            var row = grid.getRows(lRow);
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
            
            var row = grid.getRows(lRow);
            setPrecioIvaEx(
              row, KII_PRECIO_SIN_IVA, KII_IVARIPERCENT, KII_IVARNIPERCENT,
              KII_INTERNOSPERCENT, KII_INTERNOSPORC, KII_PRECIOIVA, m_bIva, m_bIvaRni
            );
            showTotalItems();
            setTotal(row, KII_TOTAL, KII_APLICAR, KII_PRECIOIVA);
            break;
        }

        return true;
      };

      var selectAllRemitos = function(bSelect) {
        var remitos = getRemitos();
        for (var _i = 0, _count = remitos.getRows().size(); _i < _count; _i++) {
          var row = remitos.getRows().item(_i);
          getCell(row, KI_SELECT).getId() === bToI(bSelect);
        }

        m_objWizard.showValue(getRemitosProperty(), true);
      };

      var selectAllItems = function(bSelect) {
        var items = getItems();

        for (var _i = 0, _count = items.getRows().size(); _i < _count; _i++) {
          var row = items.getRows().item(_i);
          getCell(row, KII_SELECT).getId() === bToI(bSelect);
          selectItem(row, items.getColumns());
        }

        m_objWizard.showValue(getItemsProperty(), true);
      };

      var selectItem = function(row,  columns) {
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

        for (var _i = 0, _count = getRemitos().getRows().size(); _i < _count; _i++) {
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

        for (var _i = 0, _count = getItems().getRows().size(); _i < _count; _i++) {
          var row = getItems().getRows().item(_i);
          total = total + val(getCell(row, KII_APLICAR).getValue()) * val(getCell(row, KII_PRECIOIVA).getValue());
        }

        getTotalItems().setValue(total);
        m_objWizard.showValue(getTotalItems());
      };

      self.getAplication = function() {
        return Cairo.appName;
      };

      self.load = function() {
        try {
          m_objWizard.setHideTitle(true);
          return loadSteps();
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "load", C_MODULE, "");
          return false;
        }
      };

      self.setObjWizard = function(rhs) {
        m_objWizard = rhs;
      };

      self.getObjWizard = function() {
        return m_objWizard;
      };

      self.work = function(currentStep,  goingToNext) {
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

      self.nextStep = function(currentStep,  nextStep) {
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
              m_lastProv = NO_ID;
              setDatosProveedor();
              setDocumentForDoctId(
                getDocProperty(), m_objWizard, D.Types.FACTURA_COMPRA, D.Types.REMITO_COMPRA, m_rcIds, 0
              );
              self.propertyChange(WC.KW_DOC_ID);
              break;

            case WCS.SELECT_PROVEEDOR:

              if(getDoc() === NO_ID) {
                nextStep = WCS.SELECT_PROVEEDOR;
                p = M.showWarningWithFalse(Cairo.Language.getText(1562, ""), Cairo.Language.getText(1607, "")); // Debe indicar un documento, Facturas
              }
              else if(getProveedor() === NO_ID) {
                nextStep = WCS.SELECT_PROVEEDOR;
                p = M.showWarningWithFalse(Cairo.Language.getText(1860, ""), Cairo.Language.getText(1607, "")); // Debe indicar un Proveedor, Facturas
              }
              else if(D.wizGetDeposito(m_objWizard, WCS.SELECT_PROVEEDOR, DWC.DEPOSITO) === NO_ID && m_bShowStockData) {
                nextStep = WCS.SELECT_PROVEEDOR;
                p = M.showWarningWithFalse(Cairo.Language.getText(1559, ""), Cairo.Language.getText(1722, "")); // Debe indicar un deposito, Remitos                                
              }
              else {
                p = loadRemitosXProveedor()
                  .success(
                    function() {
                      nextStep = WCS.SELECT_PROVEEDOR;
                      return M.showWarningWithFalse(Cairo.Language.getText(1911, ""), Cairo.Language.getText(1607, "")); // No se pudieron cargar los Remitos para este Proveedor, Facturas                
                    },
                    function() {
                      getTodos().setName(Cairo.Constants.SELECT_ALL_TEXT);
                      m_objWizard.showValue(getTodos());
                      m_objWizard.setBackEnabled(true);
                      nextStep = WCS.SELECT_ORDEN_REMITO;
                      return true;
                    }
                );
              }
              break;

            case WCS.SELECT_ORDEN_REMITO:

              p = checkRemitos(                
                ).success(
                  loadItemsXRemitos,
                  function() { 
                    nextStep = WCS.SELECT_ORDEN_REMITO; 
                    return false; 
                  }
                ).success(
                  function() {
                    nextStep = WCS.SELECT_ITEMS;
                    return true;
                  },
                  function() {
                    nextStep = WCS.SELECT_ORDEN_REMITO;
                    return M.showWarningWithFalse(Cairo.Language.getText(1912, ""), Cairo.Language.getText(1607, "")); // No se pudieron cargar los items de los remitos para este proveedor, Facturas
                  }
              );
              break;

            case WCS.SELECT_ITEMS:

              if(!checkItems()) {
                nextStep = WCS.SELECT_ITEMS;
              }
              else {
                nextStep = WCS.PERCEPCIONES;
              }
              break;

            case WCS.PERCEPCIONES:

              if(!checkPercepciones()) {
                nextStep = WCS.PERCEPCIONES;
              }
              else {

                Percepciones.percepcionShowTotales(getPercepciones().getRows(), getTotalPercepciones());
                m_objWizard.showValue(getTotalPercepciones());
                showFechaVto();
                m_objWizard.setNextText(Cairo.Constants.FINISH_TEXT);
                nextStep = WCS.DATOS_GENERALES;
              }
              break;

            case WCS.DATOS_GENERALES:

              if(pValidateDatosGenerales()) {

                if(pSave()) {
                  D.wizShowNewStep(m_objWizard, WCS.WELCOME, m_lastNroDoc);
                  nextStep = WCS.WELCOME;
                }
                else {
                  nextStep = WCS.DATOS_GENERALES;
                }
              }
              else {
                nextStep = WCS.DATOS_GENERALES;
              }
              break;
          }

          p = p || P.resolvedPromise(true);
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "nextStep", C_MODULE, "");
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

      self.previousStep = function(nCurrentStep,  nNextStep) {
        switch (nCurrentStep) {
          case WCS.WELCOME:
            nNextStep = WCS.WELCOME;

            break;

          case WCS.SELECT_PROVEEDOR:
            nNextStep = WCS.SELECT_PROVEEDOR;

            break;

          case WCS.SELECT_ORDEN_REMITO:
            m_objWizard.disableBack();
            nNextStep = WCS.SELECT_PROVEEDOR;

            break;

          case WCS.SELECT_ITEMS:
            nNextStep = WCS.SELECT_ORDEN_REMITO;

            break;

          case WCS.PERCEPCIONES:
            nNextStep = WCS.SELECT_ITEMS;

            break;

          case WCS.DATOS_GENERALES:
            m_objWizard.setNextText(Cairo.Constants.NEXT_TEXT);
            nNextStep = WCS.PERCEPCIONES;
            break;
        }

        return true;
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
            
            D.wizPrintDocEx(m_id, m_lastDoc, D.getEmailFromProveedor(m_lastProv));
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

            m_lastDoc = getDoc();
            D.wizSetShowStockData(m_objWizard, WCS.SELECT_PROVEEDOR, m_bShowStockData);
            var prop = D.wizGetDepositoProp(m_objWizard, WCS.SELECT_PROVEEDOR, DWC.DEPOSITO);
            prop.setEnabled(m_bShowStockData);
            m_objWizard.showValue(prop);
            D.wizCompraShowCotizacion(m_objWizard, WCS.DATOS_GENERALES, m_lastDoc, true);
            break;

          case WC.KW_PROV_ID:

            setDatosProveedor();
            break;

          case WC.KW_CPG_ID:

            showFechaVto();
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

      self.getTitle = function() {
        return Cairo.Language.getText(2168, ""); // Asistente de Facturas de Compra
      };

      var loadSteps = function() {

        m_lastDoc = m_doc_id;
        m_lastProv = m_prov_id;

        loadStepWelcome();
        loadStepSelectProveedor();
        loadStepSelectRemito();
        loadStepSelectItems();
        loadStepPercepciones();

        D.wizCompraLoadStepDatosGenerales(m_objWizard, null, m_doc_id, m_prov_id, Cairo.Settings.getCurrencyRateDecimalsFormat());
        D.wizCompraShowCotizacion(m_objWizard, WCS.DATOS_GENERALES, m_lastDoc, false);
        D.getIvaFromProveedor(m_prov_id, m_bIva, m_bIvaRni);

        return true;
      };

      var loadStepWelcome = function() {
        
        // the step's key must be the constant that defines them
        // this is crucial for the navigation to work
        //
        var properties = m_objWizard.getSteps().add(null, U.getKey(WCS.WELCOME)).getProperties();

        var elem = properties.add(null, DWC.TITLE);
        elem.setType(T.title);        
        elem.setValue(Cairo.Language.getText(1913, "")); // Bienvenido al Asistente de Facturas de Compra

        var elem = properties.add(null, DWC.MAIN_TITLE);
        elem.setType(T.label);
        elem.setValue(Cairo.Language.getText(1681, "")); // Con este asistente usted podra generar las facturas sobre remitos.

        D.wizAddNewDocProperties(m_objWizard, WCS.WELCOME);

      };

      var loadStepSelectProveedor = function() {

        // the step's key must be the constant that defines them
        // this is crucial for the navigation to work
        //
        var properties = m_objWizard.getSteps().add(null, U.getKey(WCS.SELECT_PROVEEDOR)).getProperties();

        var elem = properties.add(null);
        elem.setType(T.label);
        elem.setValue(Cairo.Language.getText(1914, "")); // Indique el documento a utilizar y el Proveedor al que se le emitirá la Factura

        var elem = properties.add(null, DWC.DOC);
        elem.setName(Cairo.Language.getText(1567, "")); // Documento
        elem.setType(T.select);
        elem.setSelectFilter(D.FACTURA_COMPRAS_REMITO_DOC_FILTER);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setValue(m_documento);
        elem.setSelectId(m_doc_id);
        elem.setKey(WC.KW_DOC_ID);

        var elem = properties.add(null, DWC.PROVEEDOR);
        elem.setName(Cairo.Language.getText(1151, "")); // Proveedor
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PROVEEDOR);
        elem.setValue(m_proveedor);
        elem.setSelectId(m_prov_id);
        elem.setKey(WC.KW_PROV_ID);

        D.wizSetShowStockData(m_objWizard, WCS.SELECT_PROVEEDOR, m_bShowStockData);

        var elem = properties.add(null, DWC.DEPOSITO);        
        elem.setName(Cairo.Language.getText(1574, "")); // Deposito
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.DEPOSITO_LOGICO);
        elem.setSelectId(m_userCfg.getDeplId());
        elem.setValue(m_userCfg.getDeplNombre());
        elem.setEnabled(m_bShowStockData);

        var elem = properties.add(null, DWC.ONLY_SELECTED);
        elem.setType(T.check);
        elem.setName(Cairo.Language.getText(1682, "")); // Cargar solo remitos seleccionados
        elem.setValue(m_rcIds.length > 0);
      };

      var loadStepSelectRemito = function() {

        // the step's key must be the constant that defines them
        // this is crucial for the navigation to work
        //
        var properties = m_objWizard.getSteps().add(null, U.getKey(WCS.SELECT_ORDEN_REMITO)).getProperties();

        var elem = properties.add(null);
        elem.setType(T.label);        
        elem.setValue(Cairo.Language.getText(1683, "")); // Seleccione los remitos

        var elem = properties.add(null, DWC.REMITOS);
        elem.setType(T.grid);
        setGridRemitos(elem.getGrid());
        loadRemitos(elem.getGrid());
        elem.setKey(WC.KW_REMITOS);
        elem.setGridAddEnabled(false);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(false);

        var elem = properties.add(null, DWC.TODOS);
        elem.setName(Cairo.Constants.SELECT_ALL_TEXT);
        elem.setType(T.button);
        elem.setKey(WC.KW_TODOS);

        var elem = properties.add(null, DWC.TOTAL);
        elem.setName(Cairo.Language.getText(1584, "")); // Total
        elem.setType(T.numeric);
        elem.setSubType(T.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
      };

      var setGridRemitos = function(grid) {
        var columns = grid.getColumns();

        columns.add(null).setVisible(false);

        var elem = columns.add(null);
        elem.setType(Dialogs.PropertyType.check);
        elem.setKey(KI_SELECT);

        var elem = columns.add(null);
        elem.setName(Cairo.Language.getText(1223, "")); // Tipo
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KI_DOC);

        var elem = columns.add(null);
        elem.setName(Cairo.Language.getText(1567, "")); // Documento
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KI_NRODOC);

        var elem = columns.add(null);
        elem.setName(Cairo.Language.getText(1065, "")); // Número
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setKey(KI_RC_ID);

        var elem = columns.add(null);
        elem.setName(Cairo.Language.getText(1569, "")); // Fecha
        elem.setType(Dialogs.PropertyType.date);
        elem.setFormat("dd/mm/yy");
        elem.setKey(KI_FECHA);

        var elem = columns.add(null);
        elem.setName(Cairo.Language.getText(1584, "")); // Total
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
        elem.setValue(Cairo.Language.getText(1676, "")); // Seleccione los items he indique las cantidades que facturará de cada una de ellos

        var elem = properties.add(null, DWC.Items);
        elem.setType(T.grid);
        setGridItems(elem.getGrid());
        loadItems(elem.getGrid());
        elem.setKey(WC.KW_ITEMS);
        elem.setGridAddEnabled(false);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(false);

        var elem = properties.add(null, DWC.TODOS_ITEMS);
        elem.setName(Cairo.Constants.SELECT_ALL_TEXT);
        elem.setType(T.button);
        elem.setKey(WC.KW_TODOS_ITEMS);

        var elem = properties.add(null, DWC.TOTAL_ITEMS);
        elem.setName(Cairo.Language.getText(1584, "")); // Total
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
        elem.setValue(Cairo.Language.getText(1915, "")); // Indique las percepciones si corresponde

        var elem = properties.add(null, DWC.PERCEPCIONES);
        elem.setType(T.grid);
        setGridPercepciones(elem.getGrid());
        loadPercepciones(elem.getGrid());
        elem.setKey(WC.KW_PERCEPCIONES);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        var elem = properties.add(null, DWC.TOTAL_PERCEPCIONES);
        elem.setName(Cairo.Language.getText(1584, "")); // Total
        elem.setType(T.numeric);
        elem.setSubType(T.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
      };

      var setGridPercepciones = function(grid) {
        Percepciones.loadPercepciones(grid, m_generalConfig);
      };

      var setGridItems = function(grid) {

        var columns = grid.getColumns();

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_RVI_ID);

        var elem = columns.add(null);
        elem.setType(Dialogs.PropertyType.check);
        elem.setKey(KII_SELECT);

        var elem = columns.add(null);
        elem.setName(Cairo.Language.getText(1567, "")); // Documento
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KI_NRODOC);

        var elem = columns.add(null);
        elem.setName(Cairo.Language.getText(1065, "")); // Número
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setKey(KI_RC_ID);

        var elem = columns.add(null);
        elem.setName(Cairo.Language.getText(1367, "")); // Articulo
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KII_ARTICULO);

        var elem = columns.add(null);
        elem.setName(Cairo.Language.getText(1586, "")); // Precio
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KII_PRECIO_SIN_IVA);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setEnabled(Cairo.Security.silentHasPermissionTo(Cairo.Security.Actions.Compras.EDIT_PRICE_FAC));

        var elem = columns.add(null);
        elem.setName(Cairo.Language.getText(1374, "")); // Cantidad
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setKey(KII_CANTIDAD);
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());

        var elem = columns.add(null, DWC.PENDIENTE);
        elem.setName(Cairo.Language.getText(1609, "")); // Pendiente
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setKey(KII_PENDIENTE);
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());

        var elem = columns.add(null);
        elem.setName(Cairo.Language.getText(1662, "")); // Aplicar
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setKey(KII_APLICAR);
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());

        var elem = columns.add(null, DWC.TOTAL_ITEMS);
        elem.setName(Cairo.Language.getText(1584, "")); // Total
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KII_TOTAL);
        elem.setFormat(Cairo.Settings.getQuantityDecimalsFormat());

        var elem = columns.add(null);        
        elem.setName(Cairo.Language.getText(1661, "")); // Tipo Operación
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
          p = M.confirmViewYesDanger("", Cairo.Language.getText(1665, "")) //Desea cancelar el proceso
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
        return D.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.Proveedor2);
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
        m_objWizard.showValue(D.getWizProperty(m_objWizard, WCS.SELECT_ORDEN_REMITO, DWC.REMITOS), true);
      };

      var refreshItems = function() {
        m_objWizard.showValue(D.getWizProperty(m_objWizard, WCS.SELECT_ITEMS, DWC.Items), true);
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
        for (var _i = 0, _count = getRemitos().getRows().size(); _i < _count; _i++) {
          var row = getRemitos().getRows().item(_i);
          if(getCell(row, KI_SELECT).getId()) {
            return P.resolvedPromise(true);
          }
        }
        return M.showWarningWithFalse(Cairo.Language.getText(1677, "")); // Debe indicar uno o más remitos.
      };

      var checkPercepciones = function() {
        return true;
      };

      var checkItems = function() {
        var p = P.resolvedPromise(true);
        var existsSelected = false;

        var checkItem = function(row, i) {
          return validateRowItems(row, i).success(function() {
            existsSelected = true;
            if(!val(getCell(row, KII_PRECIO_SIN_IVA).getValue()) != 0) {
              return M.showWarningWithFalse(Cairo.Language.getText(1667, "", i + 1)); // Debe indicar un precio para el item (1)
            }
          });
        };

        for (var _i = 0, _count = getItems().getRows().size(); _i < _count; _i++) {
          var row = getItems().getRows().item(_i);
          if(val(getCell(row, KII_APLICAR).getValue()) > 0) {
            p = p.success(checkItem(row, _i));
          }
        }

        return p.success(function() {
          if(!existsSelected) {
            return M.showWarningWithFalse(Cairo.Language.getText(1678, "")); // Debe indicar uno o más items.
          }
          if(!val(getTotalItems().getValue()) > 0) {
            return M.showWarningWithFalse(Cairo.Language.getText(1678, "")); // Debe indicar uno o más items.
          }
          return true;
        });
      };

      var validateRowItems = function(row,  rowIndex) {
        var p = null;
        var strRow = " (Row: " + rowIndex.toString() + ")";

        if(U.valEmpty(getCell(row, KII_TO_ID).getId(), Cairo.Constants.Types.id)) {
          p = M.showInfo(Cairo.Language.getText(1633, "", strRow)); //Debe indicar un tipo de operación (1)
        }

        return p || Cairo.Promises.resolvedPromise(true);
      };

      var getRemitosIds = function() {
        var ids = "";
        for (var _i = 0, _count = getRemitos().getRows().size(); _i < _count; _i++) {
          var row = getRemitos().getRows().item(_i);
          if(getCell(row, KI_SELECT).getId()) {
            ids = ids + getCell(row, KI_RC_ID).getId().toString() + ",";
          }
        }

        return U.removeLastColon(ids);
      };

      var loadItemsXRemitos = function() {

        var ids = getRemitosIds();
        return DB.getData("load[" + m_apiPath + "compras/facturacompras/items_remitos/" + ids + "]")
          .then(function(response) {
            try {

              if(response.success === true) {

                var items = response.data.get('items');
                var rows = getItems().getRows();
                rows.clear();

                for(var _i = 0; _i < items.length; _i += 1) {

                  var row = rows.add(null);

                  var elem = row.add(null);
                  elem.setId(DB.valField(items[_i], CC.RCI_ID));
                  elem.setKey(KII_RVI_ID);

                  var elem = row.add(null);
                  elem.setValue(0);
                  elem.setKey(KII_SELECT);

                  var elem = row.add(null);
                  elem.setValue(DB.valField(items[_i], CC.RC_NRODOC));
                  elem.setKey(KI_NRODOC);

                  var elem = row.add(null);
                  elem.setValue(DB.valField(items[_i], CC.RC_NUMERO));
                  elem.setId(DB.valField(items[_i], CC.RC_ID));
                  elem.setKey(KI_RC_ID);

                  var elem = row.add(null);
                  elem.setValue(DB.valField(items[_i], C.PR_NAME_COMPRA));
                  elem.setId(DB.valField(items[_i], CC.PR_ID));
                  elem.setKey(KII_ARTICULO);

                  var elem = row.add(null);
                  elem.setValue(DB.valField(items[_i], CC.RCI_PRECIO+ "2"));
                  elem.setKey(KII_PRECIO_SIN_IVA);

                  var elem = row.add(null);
                  elem.setValue(DB.valField(items[_i], CC.RCI_CANTIDAD_A_REMITIR));
                  elem.setKey(KII_CANTIDAD);

                  var elem = row.add(null);
                  elem.setValue(DB.valField(items[_i], CC.RCI_PENDIENTEFAC));
                  elem.setKey(KII_PENDIENTE);

                  var elem = row.add(null);
                  elem.setValue(0);
                  elem.setKey(KII_APLICAR);

                  var elem = row.add(null);
                  elem.setValue(DB.valField(items[_i], CC.RCI_IMPORTE));
                  elem.setKey(KII_TOTAL);

                  var elem = row.add(null);
                  elem.setId(D.Constants.TO_COMERCIAL_ID);
                  elem.setValue(D.Constants.TO_COMERCIAL);
                  elem.setKey(KII_TO_ID);

                  var elem = row.add(null);
                  elem.setValue(DB.valField(items[_i], CC.RCI_DESCRIP));
                  elem.setKey(KII_DESCRIP);

                  var elem = row.add(null);
                  elem.setValue(DB.valField(items[_i], CC.RCI_PRECIO));
                  elem.setKey(KII_PRECIOIVA);

                  var elem = row.add(null);
                  elem.setValue(DB.valField(items[_i], CC.RCI_PRECIO_LISTA));
                  elem.setKey(KII_PRECIO_LP);

                  var elem = row.add(null);
                  elem.setValue(DB.valField(items[_i], CC.RCI_PRECIO_USR));
                  elem.setKey(KII_PRECIO_USR);

                  var elem = row.add(null);
                  elem.setValue(DB.valField(items[_i], CC.RCI_IVA_RIPORC));
                  elem.setKey(KII_IVARIPERCENT);

                  var elem = row.add(null);
                  elem.setValue(DB.valField(items[_i], CC.RCI_IVA_RNIPORC));
                  elem.setKey(KII_IVARNIPERCENT);

                  var elem = row.add(null);
                  elem.setValue(DB.valField(items[_i], CC.FCI_INTERNOS_PORC));
                  elem.setKey(KII_INTERNOSPERCENT);

                  var elem = row.add(null);
                  elem.setValue(DB.valField(items[_i], CC.PR_PORC_INTERNO_C));
                  elem.setKey(KII_INTERNOSPORC);

                  var elem = row.add(null);
                  elem.setValue(DB.valField(items[_i], CC.RCI_DESCUENTO));
                  elem.setKey(KII_DESCUENTO);

                  var elem = row.add(null);
                  elem.setId(DB.valField(items[_i], CC.CCOS_ID));
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
            "load[" + m_apiPath + "compras/facturacompras/remitos_proveedor/"
                    + Cairo.Company.getId().toString() + "/"
                    + getProveedor().toString() + "/"
                    + m_monId.toString()
              + "]"
          )
          .then(function(response) {
            try {

              if(response.success === true) {

                var items = response.data.get('items');
                var rows = getRemitos().getRows();
                rows.clear();

                for(var _i = 0; _i < items.length; _i += 1) {

                  var rcId = DB.valField(items[_i], CC.RC_ID);
                  var selected = getApply(rcId);

                  if(!onlySelected || selected) {

                    var row = rows.add(null);

                    row.add(null);
                    
                    var elem = row.add(null);
                    elem.setId(bToI(selected));
                    elem.setKey(KI_SELECT);

                    var elem = row.add(null);
                    elem.setValue(DB.valField(items[_i], CC.DOC_NAME));
                    elem.setKey(KI_DOC);

                    var elem = row.add(null);
                    elem.setValue(DB.valField(items[_i], CC.RC_NRODOC));
                    elem.setKey(KI_NRODOC);

                    var elem = row.add(null);
                    elem.setValue(DB.valField(items[_i], CC.RC_NUMERO));
                    elem.setId(DB.valField(items[_i], CC.RC_ID));
                    elem.setKey(KI_RC_ID);

                    var elem = row.add(null);
                    elem.setValue(DB.valField(items[_i], CC.RC_FECHA));
                    elem.setKey(KI_FECHA);

                    var elem = row.add(null);
                    elem.setValue(DB.valField(items[_i], CC.RC_TOTAL));
                    elem.setKey(KI_TOTAL);

                    var elem = row.add(null);
                    elem.setValue(DB.valField(items[_i], CC.RC_DESCRIP));
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

      // Edit From ListDoc
      //
      var getApply = function(rc_id) {
        var _rtn = null;
        var i = null;

        for (i = 1; i <= m_rcIds.Length; i++) {
          if(m_rcIds[i] === rc_id) {
            _rtn = true;
            return _rtn;
          }
        }

        return _rtn;
      };

      // Validaciones de Filas de Instrumentos de cobro
      var pIsEmptyRowItems = function(row,  rowIndex) {
        var cell = null;

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KII_RVI_ID:
            case KII_ARTICULO:
            case KII_PENDIENTE:
              if(!ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                bRowIsEmpty = false;
                break;
              }

              break;

            case KII_DESCRIP:
            case KII_CANTIDAD:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                var bRowIsEmpty = true;
                break;
              }

              break;

            case KII_APLICAR:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.date)) {
                var bRowIsEmpty = true;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var getDocNumber = function() {
        var tl = null;
        var tAL_ID = null;
        var sqlstmt = null;
        var rs = null;
        var mask = null;
        var bEditable = null;

        if(getComprobante().getValue() != "") { return; }

        sqlstmt = "sp_proveedorGetTalonario "+ getProveedor().toString()+ ","+ getDoc().toString();
        if(!DB.openRs(sqlstmt, rs)) { return; }

        tAL_ID = DB.valField(rs.getFields(), 0);

        tl = new cTalonario();

        var w_getComprobante = getComprobante();
        w_getComprobante.setValue(tl.GetNextNumber(tAL_ID, mask, bEditable));
        w_getComprobante.setTextMask(mask);
        w_getComprobante.setEnabled(bEditable);

        m_objWizard.showValue(getComprobante());
      };

      var setDatosGenerales = function() {
        var w_getProveedor2 = getProveedor2();
        w_getProveedor2.setSelectId(getProveedor());
        w_getProveedor2.setValue(getProveedorName());
        m_objWizard.showValue(getProveedor2());
        getDocNumber();
        setDatosFromAplic();
      };

      var pValidateDatosGenerales = function() {
        if(ValEmpty(getFecha().getValue(), Cairo.Constants.Types.date)) {
          // Debe indicar la fecha de la factura
          M.showWarning(Cairo.Language.getText(1669, ""));
          return null;
        }

        if(ValEmpty(getCondicionPago().getSelectId(), Cairo.Constants.Types.id)) {
          // Debe indicar la condicion de pago
          M.showWarning(Cairo.Language.getText(1561, ""));
          return null;
        }

        var w_getFechaVto = getFechaVto();
        if(ValEmpty(w_getFechaVto.getValue(), Cairo.Constants.Types.date) && w_getFechaVto.getVisible()) {
          // Debe indicar una fecha de vencimiento
          MsgInfo(Cairo.Language.getText(1625, ""));
          return null;
        }

        if(ValEmpty(getSucursal().getSelectId(), Cairo.Constants.Types.id)) {
          // Debe indicar la sucursal
          M.showWarning(Cairo.Language.getText(1560, ""));
          return null;
        }

        return true;
      };

      self.initialize = function() {
        try {

          // Error al grabar la factura de Compra
          SAVE_ERROR_MESSAGE = Cairo.Language.getText(1907, "");

          m_generalConfig = new cGeneralConfig();
          m_generalConfig.Load;

          // Preferencias del Usuario
          //
          m_userCfg = new cUsuarioConfig();
          m_userCfg.Load;

          G.redim(m_rcIds, 0);

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

          m_generalConfig = null;

          // Preferencias del Usuario
          //
          m_userCfg = null;

          G.redim(m_rcIds, 0);
          m_objClient = null;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "Class_Terminate", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      /////////////////////////////////////////////////////////////////////////////////
      var getSave = function(register,  comp,  bIvaRni,  cotizacion,  bMonedaLegal) { // TODO: Use of ByRef founded Private Sub getSave(ByRef register As cRegister, ByRef Comp As cIABMProperty, ByRef bIvaRni As Boolean, ByRef Cotizacion As Double, ByRef bMonedaLegal As Boolean)

        var neto = null;
        var ivaRi = null;
        var ivaRni = null;
        //  Internos
        var internos = null;
        var totalOrigen = null;
        var totalPercep = null;

        register.setFieldId(CC.FC_TMPID);
        register.setTable(CC.FACTURACOMPRATMP);

        register.setId(Cairo.Constants.NEW_ID);

        // Header
        var w_fields = register.getFields();
        w_fields.add2(CC.FC_NUMERO, 0, Cairo.Constants.Types.long);

        // PrintDoc
        //
        m_lastNroDoc = SetMask(comp.getValue(), comp.getTextMask());
        w_fields.add2(CC.FC_NRODOC, m_lastNroDoc, Cairo.Constants.Types.text);

        w_fields.add2(CC.FC_DESCRIP, getDescrip().getValue(), Cairo.Constants.Types.text);
        w_fields.add2(CC.FC_FECHA, getFecha().getValue(), Cairo.Constants.Types.date);
        w_fields.add2(CC.FC_FECHA_IVA, getFechaIva().getValue(), Cairo.Constants.Types.date);
        w_fields.add2(CC.FC_FECHA_VTO, getFechaVto().getValue(), Cairo.Constants.Types.date);

        w_fields.add2(CC.PROV_ID, getProveedor(), Cairo.Constants.Types.id);
        w_fields.add2(CC.CCOS_ID, getCentroCosto().getSelectId(), Cairo.Constants.Types.id);
        w_fields.add2(CC.SUC_ID, getSucursal().getSelectId(), Cairo.Constants.Types.id);
        w_fields.add2(CC.CPG_ID, getCondicionPago().getSelectId(), Cairo.Constants.Types.id);
        w_fields.add2(CC.LP_ID, getListaPrecio().getSelectId(), Cairo.Constants.Types.id);
        w_fields.add2(CC.LD_ID, getListaDescuento().getSelectId(), Cairo.Constants.Types.id);
        w_fields.add2(CC.DOC_ID, getDoc(), Cairo.Constants.Types.id);
        w_fields.add2(CC.LGJ_ID, getLegajo().getSelectId(), Cairo.Constants.Types.id);
        w_fields.add2(CC.FC_GRABAR_ASIENTO, 1, Cairo.Constants.Types.boolean);
        w_fields.add2(CC.FC_TIPO_COMPROBANTE, getTipoComprobante().getListItemData(), Cairo.Constants.Types.integer);
        w_fields.add2(CC.DEPL_ID, mPublic.self.wizGetDeposito(m_objWizard, WCS.SELECT_PROVEEDOR, DWC.DEPOSITO), Cairo.Constants.Types.id);
        w_fields.add2(CC.FC_COTIZACION_PROV, getCotizacionProv().getValue(), Cairo.Constants.Types.double);

        cotizacion = val(getCotizacion().getValue());
        w_fields.add2(CC.FC_COTIZACION, cotizacion, Cairo.Constants.Types.double);

        w_fields.add2(Cairo.Constants.EST_ID, CSGeneralEx2.csEEstado.cSEEST_PENDIENTE, Cairo.Constants.Types.id);
        w_fields.add2(CC.FC_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);

        bIvaRni = IsRNI(getProveedor());

        // Internos
        getFooter(neto, ivaRi, ivaRni, bIvaRni, internos);

        // Manejo de la moneda y la cotizacion
        //
        bMonedaLegal = GetMonedaDefault === m_monId;
        if(bMonedaLegal) {
          cotizacion = 1;
        }
        else {
          if(cotizacion === 0) { cotizacion = 1; }
        }

        totalPercep = val(getTotalPercepciones().getValue());

        // Footer
        w_fields.add2(CC.FC_SUBTOTAL, neto * cotizacion, Cairo.Constants.Types.currency);
        w_fields.add2(CC.FC_NETO, neto * cotizacion, Cairo.Constants.Types.currency);
        w_fields.add2(CC.FC_IVARI, ivaRi * cotizacion, Cairo.Constants.Types.currency);
        w_fields.add2(CC.FC_IVARNI, ivaRni * cotizacion, Cairo.Constants.Types.currency);
        // Internos
        w_fields.add2(CC.FC_INTERNOS, internos * cotizacion, Cairo.Constants.Types.currency);
        w_fields.add2(CC.FC_TOTAL_PERCEPCIONES, totalPercep * cotizacion, Cairo.Constants.Types.currency);

        totalOrigen = neto + totalPercep;
        if(m_bIva) {
          totalOrigen = totalOrigen + ivaRi;
        }
        if(m_bIvaRni) {
          totalOrigen = totalOrigen + ivaRni;
        }

        // Internos
        totalOrigen = totalOrigen + internos;

        if(bMonedaLegal) {
          w_fields.add2(CC.FC_TOTAL_ORIGEN, 0, Cairo.Constants.Types.currency);
        }
        else {
          w_fields.add2(CC.FC_TOTAL_ORIGEN, totalOrigen, Cairo.Constants.Types.currency);
        }

        //  Por ahora no hay descuentos
        w_fields.add2(CC.FC_TOTAL, totalOrigen * cotizacion, Cairo.Constants.Types.currency);

        w_fields.setHaveLastUpdate(true);
        w_fields.setHaveWhoModify(true);

      };

      var pSave = function() {
        var _rtn = null;

        if(!DocCanSaveEx(m_objWizard.getEditGeneric(), DWC.FechaIva, DWC.Doc)) {
          _rtn = false;
          return _rtn;
        }

        var register = null;
        var bIvaRni = null;
        var cotizacion = null;
        var bMonedaLegal = null;
        var mouse = null;

        mouse = new cMouseWait();

        DoEvents:(DoEvents: DoEvents: DoEvents);

        register = new cRegister();

        getSave(register, getComprobante(), bIvaRni, cotizacion, bMonedaLegal);

        if(!register.beginTrans(Cairo.Database)) { return _rtn; }

        if(!DB.save(register, , "pSave", C_MODULE, SAVE_ERROR_MESSAGE)) { return _rtn; }

        if(!pSaveItems(register.getId(), cotizacion, bMonedaLegal, bIvaRni)) { return _rtn; }

        if(!Percepciones.savePercepciones(getPercepcionesProperty(), register.getId(), cotizacion, bMonedaLegal, false, "", NO_ID, C_MODULE)) { return _rtn; }

        if(!pSaveVinculacion(register.getId())) { return _rtn; }

        if(!register.commitTrans()) { return _rtn; }

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_DocFacturaCompraSave "+ register.getId().toString();
        if(!DB.openRs(sqlstmt, rs, , , , "pSave", C_MODULE, SAVE_ERROR_MESSAGE)) { return _rtn; }

        if(rs.isEOF()) { return _rtn; }

        var id = null;
        if(!GetDocIDFromRecordset(rs, id)) { return _rtn; }

        m_id = id;

        _rtn = m_id != 0;

        return _rtn;
      };

      var pSaveItems = function(id,  cotizacion,  bMonedaLegal,  bIvaRni) {

        var transaction = new DB.Transaction();
        var iOrden = null;
        var row = null;
        var cell = null;
        var precio = null;
        var ivaRi = null;
        var ivaRni = null;
        //  Internos
        var internos = null;
        var int_porc = null;
        var neto = null;
        var importe = null;
        var cantidad = null;

        var _count = getItems().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = getItems().getRows().item(_i);

          if(val(getCell(row, KII_APLICAR).getValue())) {

            var register = new DB.Register();
            register.setFieldId(CC.FCI_TMPID);
            register.setTable(CC.FACTURACOMPRAITEMTMP);
            register.setId(Cairo.Constants.NEW_ID);

            var _count = row.size();
            for (var _j = 0; _j < _count; _j++) {
              cell = row.item(_j);
              switch (cell.getKey()) {
                case KII_APLICAR:
                  cantidad = cell.getValue();
                  register.getFields().add2(CC.FCI_CANTIDAD, cell.getValue(), Cairo.Constants.Types.double);
                  break;

                case KII_DESCRIP:
                  register.getFields().add2(CC.FCI_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KII_PRECIO_SIN_IVA:
                  precio = val(cell.getValue()) * cotizacion;
                  register.getFields().add2(CC.FCI_PRECIO, precio, Cairo.Constants.Types.currency);
                  break;

                case KII_PRECIO_LP:
                  register.getFields().add2(CC.FCI_PRECIO_LISTA, val(cell.getValue()) * cotizacion, Cairo.Constants.Types.currency);
                  break;

                case KII_PRECIO_USR:
                  register.getFields().add2(CC.FCI_PRECIO_USR, val(cell.getValue()) * cotizacion, Cairo.Constants.Types.currency);
                  break;

                case KII_DESCUENTO:
                  register.getFields().add2(CC.FCI_DESCUENTO, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KII_IVARIPERCENT:
                  ivaRi = cell.getValue();
                  register.getFields().add2(CC.FCI_IVARIPORC, ivaRi, Cairo.Constants.Types.double);
                  break;

                case KII_IVARNIPERCENT:
                  if(bIvaRni) {
                    ivaRni = cell.getValue();
                  }
                  register.getFields().add2(CC.FCI_IVARNIPORC, ivaRni, Cairo.Constants.Types.double);

                  // Internos
                  break;

                case KII_INTERNOSPERCENT:
                  internos = cell.getValue();
                  register.getFields().add2(CC.FCI_INTERNOS_PORC, internos, Cairo.Constants.Types.double);

                  // Internos
                  break;

                case KII_INTERNOSPORC:
                  int_porc = cell.getValue();

                  break;

                case KII_ARTICULO:
                  register.getFields().add2(CC.PR_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KII_CCOS_ID:
                  register.getFields().add2(CC.CCOS_ID, cell.getId(), Cairo.Constants.Types.id);
                  // TO
                  break;

                case KII_TO_ID:
                  register.getFields().add2(CC.TO_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;
              }
            }

            neto = precio * cantidad;
            register.getFields().add2(CC.FCI_NETO, neto, Cairo.Constants.Types.currency);

            ivaRi = neto * ivaRi / 100;
            register.getFields().add2(CC.FCI_IVARI, ivaRi, Cairo.Constants.Types.currency);

            ivaRni = neto * ivaRni / 100;
            register.getFields().add2(CC.FCI_IVARNI, ivaRni, Cairo.Constants.Types.currency);

            // Internos
            internos = (neto * int_porc / 100) * internos / 100;
            register.getFields().add2(CC.FCI_INTERNOS, internos, Cairo.Constants.Types.currency);

            // Internos
            importe = neto + ivaRi + ivaRni + internos;
            register.getFields().add2(CC.FCI_IMPORTE, importe, Cairo.Constants.Types.currency);

            if(bMonedaLegal) {
              register.getFields().add2(CC.FCI_IMPORTE_ORIGEN, 0, Cairo.Constants.Types.currency);
            }
            else {
              register.getFields().add2(CC.FCI_IMPORTE_ORIGEN, DivideByCero(importe, cotizacion), Cairo.Constants.Types.currency);
            }

            // Esto es muy importante ya que se usa para vincular el remitoCompraitem
            // con el nuevo FacturaCompraitem
            iOrden = iOrden + 1;
            register.getFields().add2(CC.FCI_ORDEN, iOrden, Cairo.Constants.Types.integer);

            register.getFields().add2(CC.FC_TMPID, id, Cairo.Constants.Types.id);
            register.getFields().add2(CC.FCI_ID, id, Cairo.Constants.Types.long);

            // Cuentas contables - Por ahora se resuelve asi
            register.getFields().add2(CC.CUE_ID, -1, Cairo.Constants.Types.id);
            register.getFields().add2(CC.CUE_ID_IVA_RI, -1, Cairo.Constants.Types.id);
            register.getFields().add2(CC.CUE_ID_IVA_RNI, -1, Cairo.Constants.Types.id);

            register.getFields().setHaveLastUpdate(false);
            register.getFields().setHaveWhoModify(false);

            transaction.addRegister(register);
          }
        }

        sqlstmt = "sp_DocFacturaCompraWizardSave "+ id.toString();
        if(!DB.execute(sqlstmt, "pSaveItems", C_MODULE, SAVE_ERROR_MESSAGE)) { return false; }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      var pSaveVinculacion = function(id) {
        var register = null;
        var iOrden = null;
        var bSave = null;
        var row = null;
        var cell = null;

        var _count = getItems().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = getItems().getRows().item(_i);

          register = new cRegister();
          register.setFieldId(CC.RC_FC_TMPID);
          register.setTable(CC.REMITOFACTURACOMPRATMP);
          register.setId(Cairo.Constants.NEW_ID);

          bSave = false;
          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            if(getCell(row, KII_SELECT).getId()) {
              bSave = true;
              switch (cell.getKey()) {
                case KII_RVI_ID:
                  register.getFields().add2(CC.RCI_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KII_APLICAR:
                  register.getFields().add2(CC.RC_FC_CANTIDAD, cell.getValue(), Cairo.Constants.Types.double);
                  break;
              }
            }
          }

          if(bSave) {

            register.getFields().add2(CC.RC_FC_ID, 0, Cairo.Constants.Types.long);
            register.getFields().add2(CC.FC_TMPID, id, Cairo.Constants.Types.id);

            // Esto es muy importante ya que se usa para vincular el remitoCompraitem
            // con el nuevo FacturaCompraitem
            iOrden = iOrden + 1;
            register.getFields().add2(CC.FCI_ID, iOrden, Cairo.Constants.Types.long);

            register.getFields().setHaveLastUpdate(false);
            register.getFields().setHaveWhoModify(false);

            if(!DB.save(register, , "pSaveVinculacion", C_MODULE, SAVE_ERROR_MESSAGE)) { return false; }
          }
        }

        return true;
      };

      // Internos
      var getFooter = function(neto,  ivaRi,  ivaRni,  bIvaRni,  internos) { // TODO: Use of ByRef founded Private Sub getFooter(ByRef Neto As Double, ByRef IvaRi As Double, ByRef IvaRni As Double, ByVal bIvaRni As Boolean, ByRef Internos As Double)

        var row = null;
        var cell = null;
        var precio = null;
        var cantidad = null;
        var ivaRniPercent = null;
        var ivaRiPercent = null;
        //  Internos
        var internosPercent = null;
        var int_porc = null;

        var _count = getItems().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = getItems().getRows().item(_i);

          if(getCell(row, KII_SELECT).getId()) {
            var _count = row.size();
            for (var _j = 0; _j < _count; _j++) {
              cell = row.item(_j);
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
                  if(bIvaRni) {
                    ivaRniPercent = cell.getValue();
                  }

                  // Internos
                  break;

                case KII_INTERNOSPERCENT:
                  internosPercent = cell.getValue();

                  // Internos
                  break;

                case KII_INTERNOSPORC:
                  int_porc = cell.getValue();
                  break;
              }
            }

            neto = neto + (precio * cantidad);
            ivaRi = ivaRi + ((precio * cantidad) * ivaRiPercent / 100);
            ivaRni = ivaRni + ((precio * cantidad) * ivaRniPercent / 100);

            // Internos
            internos = internos + (((precio * cantidad) * int_porc / 100) * internosPercent / 100);
          }
        }
      };
      ////////////////////////////////
      //  Codigo estandar de errores
      //  On Error GoTo ControlError
      //
      //  GoTo ExitProc
      //ControlError:
      //  MngError err,"", C_Module, ""
      //  If Err.Number Then Resume ExitProc
      //ExitProc:
      //  On Error Resume Next

      var setDatosProveedor = function() {
        var lp_id = null;
        var ld_id = null;
        var cpg_id = null;
        var cpg_nombre = null;
        var lP = null;
        var lD = null;
        var iProp = null;
        var filter = null;

        var w_getProveedorProp = getProveedorProp();
        if(m_lastProv === w_getProveedorProp.getSelectId()) {
          return;
        }
        m_lastProv = w_getProveedorProp.getSelectId();

        if(!GetProveedorDataEx(m_lastProv, lp_id, ld_id, cpg_id, m_lastDoc)) { return; }

        // Condicion de pago
        if(cpg_id != NO_ID) {

          if(!DB.getData(CC.CONDICIONPAGO, CC.CPG_ID, cpg_id, CC.CPG_NAME, cpg_nombre)) { return; }

          iProp = getCondicionPago();
          iProp.setValue(cpg_nombre);
          iProp.setSelectId(cpg_id);
          m_objWizard.showValue(iProp);
        }

        // Lista de precios
        iProp = getListaPrecio();
        iProp.setSelectFilter(GetListaPrecioGetXProveedor(m_lastDoc, m_lastProv));

        if(lp_id != NO_ID) {
          lP = new cListaPrecio();
          iProp.setValue(lP.GetData(lp_id, CC.LP_NAME, Cairo.Constants.Types.text));
          iProp.setSelectId(lp_id);
        }

        m_objWizard.showValue(iProp);

        // Lista de descuentos
        iProp = getListaDescuento();
        iProp.setSelectFilter(GetListaDescGetXProveedor(m_lastDoc, m_lastProv));

        if(ld_id != NO_ID) {
          lD = new cListaDescuento();
          iProp.setValue(lD.GetData(ld_id, CC.LD_NAME, Cairo.Constants.Types.text));
          iProp.setSelectId(ld_id);
        }

        m_objWizard.showValue(iProp);

        // Talonario y Categoria fiscal
        mWizCompra.self.getIvaFromProveedor(m_lastProv, m_bIva, m_bIvaRni);
      };

      var newEmptyProperties = function() {
        // (ByRef Grid As cIABMGrid)

        m_lastCpgId = -1;

        getRemitos().getRows().clear();
        getItems().getRows().clear();
        getPercepciones().getRows().clear();

        var w_getComprobante = getComprobante();
        w_getComprobante.setValue("");
        w_getComprobante.setTextMask("");
        var w_getCentroCosto = getCentroCosto();
        w_getCentroCosto.setSelectId(NO_ID);
        w_getCentroCosto.setValue("");
        var w_getCondicionPago = getCondicionPago();
        w_getCondicionPago.setSelectId(NO_ID);
        w_getCondicionPago.setValue("");
        var w_getListaPrecio = getListaPrecio();
        w_getListaPrecio.setSelectId(NO_ID);
        w_getListaPrecio.setValue("");
        var w_getListaDescuento = getListaDescuento();
        w_getListaDescuento.setSelectId(NO_ID);
        w_getListaDescuento.setValue("");
        var w_getLegajo = getLegajo();
        w_getLegajo.setSelectId(NO_ID);
        w_getLegajo.setValue("");
        var w_getCotizacionProv = getCotizacionProv();
        w_getCotizacionProv.setValue(0);

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
        var sqlstmt = null;
        var rs = null;
        var i = null;

        sqlstmt = "sp_DocFacturaCompraGetDataFromAplic 4,'"+ getRemitosIds()+ "'";

        if(!DB.openRs(sqlstmt, rs)) { return; }

        if(rs.isEOF()) { return; }

        var iProp = null;

        while (!rs.isEOF()) {

          iProp = getSucursal();
          if(iProp.getSelectId() === NO_ID && DB.valField(rs.getFields(), CC.SUC_ID) != NO_ID) {

            iProp.setSelectId(DB.valField(rs.getFields(), CC.SUC_ID));
            iProp.setValue(DB.valField(rs.getFields(), CC.SUC_NAME));
            m_objWizard.showValue(iProp);
          }

          iProp = getCondicionPago();
          if(iProp.getSelectId() === NO_ID && DB.valField(rs.getFields(), CC.CPG_ID) != NO_ID) {

            iProp.setSelectId(DB.valField(rs.getFields(), CC.CPG_ID));
            iProp.setValue(DB.valField(rs.getFields(), CC.CPG_NAME));
            m_objWizard.showValue(iProp);
          }

          iProp = getCentroCosto();
          if(iProp.getSelectId() === NO_ID && DB.valField(rs.getFields(), CC.CCOS_ID) != NO_ID) {

            iProp.setSelectId(DB.valField(rs.getFields(), CC.CCOS_ID));
            iProp.setValue(DB.valField(rs.getFields(), CC.CCOS_NAME));
            m_objWizard.showValue(iProp);
          }

          iProp = getLegajo();
          if(iProp.getSelectId() === NO_ID && DB.valField(rs.getFields(), CC.LGJ_ID) != NO_ID) {

            iProp.setSelectId(DB.valField(rs.getFields(), CC.LGJ_ID));
            iProp.setValue(DB.valField(rs.getFields(), CC.LGJ_TITULO));
            m_objWizard.showValue(iProp);
          }

          rs.MoveNext;
        }
      };

      var showFechaVto = function() {
        var iProp = null;
        var bEsLibre = null;

        if(getCondicionPago().getSelectId() != m_lastCpgId) {
          m_lastCpgId = getCondicionPago().getSelectId();
          if(!DB.getData(CC.CONDICIONPAGO, CC.CPG_ID, m_lastCpgId, CC.CPG_ES_LIBRE, bEsLibre)) { return; }

          iProp = getFechaVto();
          iProp.setVisible(bEsLibre);
          m_objWizard.showValue(iProp);
        }
      };


      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("FacturaCompraRemitoWiz.List", function(List, Cairo, Backbone, Marionette, $, _) {
    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.facturacompraremitowizEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.facturacompraremitowizEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "FacturaCompraRemitoWizs",
            entityName: "facturacompraremitowiz",
            entitiesName: "facturacompraremitowizs"
          });

          self.showBranch = function(branchId) {
            Cairo.log("Loading nodeId: " + branchId);
            Cairo.Tree.List.Controller.listBranch(branchId, Cairo.Tree.List.Controller.showItems, self);
          };

          self.addLeave = function(id, branchId) {
            try {
              Cairo.Tree.List.Controller.addLeave(branchId, id, self);
            }
            catch(ignore) {
              Cairo.log("Error when adding this item to the branch\n\n" + ignore.message);
            }
          };

          self.refreshBranch = function(id, branchId) {
            try {
              Cairo.Tree.List.Controller.refreshBranchIfActive(branchId, id, self);
            }
            catch(ignore) {
              Cairo.log("Error when refreshing a branch\n\n" + ignore.message);
            }
          };

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

          self.edit = function(id, treeId, branchId) {
            var key = getKey(id);
            if(editors.contains(key)) {
              editors.item(key).dialog.showDialog();
            }
            else {
              var editor = Cairo.FacturaCompraRemitoWiz.Edit.Controller.getEditor();
              var dialog = Cairo.Dialogs.Views.Controller.newDialog();

              editor.setTree(self);
              editor.setDialog(dialog);
              editor.setTreeId(treeId);
              editor.setBranchId(branchId);
              editor.edit(id);

              editors.add({editor: editor, dialog: dialog}, key);
            }
          };

          self.destroy = function(id, treeId, branchId) {
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_FACTURACOMPRAREMITOWIZ)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            var apiPath = DB.getAPIVersion();
            return DB.destroy(apiPath + "general/facturacompraremitowiz", id, Cairo.Constants.DELETE_FUNCTION, "FacturaCompraRemitoWiz").success(
              function() {
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
              }
            );
          };

          // progress message
          //
          Cairo.LoadingMessage.show("FacturaCompraRemitoWizs", "Loading facturacompraremitowiz from Crowsoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ facturacompraremitowizTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.FACTURACOMPRAREMITOWIZ,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.facturacompraremitowizTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("FacturaCompraRemitoWizs", "facturacompraremitowizTreeRegion", "#general/facturacompraremitowizs", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());
