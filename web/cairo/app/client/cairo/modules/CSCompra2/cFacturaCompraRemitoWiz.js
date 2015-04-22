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
      var D = Cairo.Documents;
      var Percepciones = Cairo.Compras.Percepciones;
      var getCell = Dialogs.cell;
      var val = Cairo.Util.val;
      var bToI = Cairo.Util.boolToInt;
      var WC = Cairo.Constants.WizardConstants;
      var M = Cairo.Modal;

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

      self.getId = function() {
        return m_id;
      };

      self.setDoc_id = function(rhs) {
        m_doc_id = rhs;
      };

      self.setDocumento = function(rhs) {
        m_documento = rhs;
      };

      self.setProv_id = function(rhs) {
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

      self.load = function() {
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

            case Cairo.Constants.WizardSteps.WELCOME:

              // first step, disable back
              m_objWizard.disableBack();
              break;

            case Cairo.Constants.WizardSteps.SELECT_ITEMS:

              if(goingToNext) {
                var iProp = null;
                iProp = getTodosItems();
                iProp.setName(Cairo.Constants.SELECT_ALL_TEXT);
                m_objWizard.showValue(iProp);
              }
              break;

            case Cairo.Constants.WizardSteps.PERCEPCIONES:

              break;

            case Cairo.Constants.WizardSteps.DATOS_GENERALES:

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

              nextStep = Cairo.Constants.WizardSteps.WELCOME;
              m_objWizard.disableBack();
              break;

            case Cairo.Constants.WizardSteps.WELCOME:

              nextStep = Cairo.Constants.WizardSteps.SELECT_PROVEEDOR;
              m_objWizard.setNextText(Cairo.Constants.NEXT_TEXT);
              m_objWizard.disableBack();
              m_lastProv = Cairo.Constants.NO_ID;
              setDatosProveedor();
              setDocumentForDoctId(
                getDocProperty(), m_objWizard, D.Types.FACTURA_COMPRA, D.Types.REMITO_COMPRA, m_rcIds, 0
              );
              self.propertyChange(WC.KW_DOC_ID);
              break;

            case Cairo.Constants.WizardSteps.SELECT_PROVEEDOR:

              if(getDoc() === Cairo.Constants.NO_ID) {
                p = M.showWarningWithFalse(Cairo.Language.getText(1562, ""), Cairo.Language.getText(1607, "")); // Debe indicar un documento, Facturas
                nextStep = Cairo.Constants.WizardSteps.SELECT_PROVEEDOR;
              }
              else if(getProveedor() === Cairo.Constants.NO_ID) {
                p = M.showWarningWithFalse(Cairo.Language.getText(1860, ""), Cairo.Language.getText(1607, "")); // Debe indicar un Proveedor, Facturas
                nextStep = Cairo.Constants.WizardSteps.SELECT_PROVEEDOR;
              }
              else if(D.wizGetDeposito(m_objWizard, Cairo.Constants.WizardSteps.SELECT_PROVEEDOR, Cairo.Constants.WizardKeys.DEPOSITO) === Cairo.Constants.NO_ID && m_bShowStockData) {
                p = M.showWarningWithFalse(Cairo.Language.getText(1559, ""), Cairo.Language.getText(1722, "")); // Debe indicar un deposito, Remitos
                nextStep = Cairo.Constants.WizardSteps.SELECT_PROVEEDOR;
              }
              else if(!loadRemitosXProveedor()) {
                p = M.showWarningWithFalse(Cairo.Language.getText(1911, ""), Cairo.Language.getText(1607, "")); // No se pudieron cargar los Remitos para este Proveedor, Facturas
                nextStep = Cairo.Constants.WizardSteps.SELECT_PROVEEDOR;
              }
              else {
                getTodos().setName(Cairo.Constants.SELECT_ALL_TEXT);
                m_objWizard.showValue(getTodos());
                m_objWizard.setBackEnabled(true);
                nextStep = Cairo.Constants.WizardSteps.SELECT_ORDEN_REMITO;
              }
              break;

            case Cairo.Constants.WizardSteps.SELECT_ORDEN_REMITO:

              if(!pChecRemitos()) {
                nextStep = Cairo.Constants.WizardSteps.SELECT_ORDEN_REMITO;
              }
              else if(!loadItemsXRemitos()) {
                p = M.showWarningWithFalse(Cairo.Language.getText(1912, ""), Cairo.Language.getText(1607, "")); // No se pudieron cargar los items de los remitos para este proveedor, Facturas
                nextStep = Cairo.Constants.WizardSteps.SELECT_ORDEN_REMITO;
              }
              else {
                nextStep = Cairo.Constants.WizardSteps.SELECT_ITEMS;
              }
              break;

            case Cairo.Constants.WizardSteps.SELECT_ITEMS:

              if(!pCheckItems()) {
                nextStep = Cairo.Constants.WizardSteps.SELECT_ITEMS;
              }
              else {
                nextStep = Cairo.Constants.WizardSteps.PERCEPCIONES;
              }
              break;

            case Cairo.Constants.WizardSteps.PERCEPCIONES:

              if(!pCheckPercepciones()) {
                nextStep = Cairo.Constants.WizardSteps.PERCEPCIONES;
              }
              else {

                Percepciones.percepcionShowTotales(getPercepciones().getRows(), getTotalPercepciones());
                m_objWizard.showValue(getTotalPercepciones());
                showFechaVto();
                m_objWizard.setNextText(Cairo.Constants.FINISH_TEXT);
                nextStep = Cairo.Constants.WizardSteps.DATOS_GENERALES;
              }
              break;

            case Cairo.Constants.WizardSteps.DATOS_GENERALES:

              if(pValidateDatosGenerales()) {

                if(pSave()) {

                  // PrintDoc
                  //
                  D.wizShowNewStep(m_objWizard, Cairo.Constants.WizardSteps.WELCOME, m_lastNroDoc);
                  nextStep = Cairo.Constants.WizardSteps.WELCOME;
                }
                else {
                  nextStep = Cairo.Constants.WizardSteps.DATOS_GENERALES;
                }
              }
              else {
                nextStep = Cairo.Constants.WizardSteps.DATOS_GENERALES;
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
          case Cairo.Constants.WizardSteps.WELCOME:
            nNextStep = Cairo.Constants.WizardSteps.WELCOME;

            break;

          case Cairo.Constants.WizardSteps.SELECT_PROVEEDOR:
            nNextStep = Cairo.Constants.WizardSteps.SELECT_PROVEEDOR;

            break;

          case Cairo.Constants.WizardSteps.SELECT_ORDEN_REMITO:
            m_objWizard.disableBack();
            nNextStep = Cairo.Constants.WizardSteps.SELECT_PROVEEDOR;

            break;

          case Cairo.Constants.WizardSteps.SELECT_ITEMS:
            nNextStep = Cairo.Constants.WizardSteps.SELECT_ORDEN_REMITO;

            break;

          case Cairo.Constants.WizardSteps.PERCEPCIONES:
            nNextStep = Cairo.Constants.WizardSteps.SELECT_ITEMS;

            break;

          case Cairo.Constants.WizardSteps.DATOS_GENERALES:
            m_objWizard.setNextText(Cairo.Constants.NEXT_TEXT);
            nNextStep = Cairo.Constants.WizardSteps.PERCEPCIONES;
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
            D.wizNewDoc(m_objWizard, Cairo.Constants.WizardSteps.WELCOME);
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
            D.wizSetShowStockData(m_objWizard, Cairo.Constants.WizardSteps.SELECT_PROVEEDOR, m_bShowStockData);
            var prop = D.wizGetDepositoProp(m_objWizard, Cairo.Constants.WizardSteps.SELECT_PROVEEDOR, Cairo.Constants.WizardKeys.DEPOSITO);
            prop.setEnabled(m_bShowStockData);
            m_objWizard.showValue(prop);
            D.wizCpraShowCotizacion(m_objWizard, Cairo.Constants.WizardSteps.DATOS_GENERALES, m_lastDoc, true);
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

      var getCIWizardClient_Title = function() {
        //'Asistente de Facturas de Compra
        return Cairo.Language.getText(2168, "");
      };

      // funciones friend
      // funciones privadas
      var loadSteps = function() {
        var sh = null;
        sh = m_objWizard.getEditGeneric().getShapeMain();

        //If m_Resource Is Nothing Then Set m_Resource = New fResource

        var wizard = null;
        var abmObj = null;

        wizard = m_objWizard;
        abmObj = wizard.ObjAbm;
        abmObj.MinHeight = 7000;

        sh.Move(0, 0, 9000, 7000);
        sh.BorderStyle = 0;
        sh.BackColor = vbWhite;

        var img = null;
        img = m_objWizard.getEditGeneric().getPicMain();

        img.Visible = false;

        m_lastDoc = m_doc_id;
        m_lastProv = m_prov_id;

        loadStepWelcome();
        loadSteselectProveedor();
        loadSteselectRemito();
        loadSteselectItems();
        loadStepPercepciones();

        mWizCompra.self.wizCpraLoadStepDatosGrales(m_objWizard,, null, m_doc_id, m_prov_id, m_generalConfig.getFormatDecCotizacion());
        mWizCompra.self.wizCpraShowCotizacion(m_objWizard, Cairo.Constants.WizardSteps.DATOS_GENERALES, m_lastDoc, false);
        mWizCompra.self.getIvaFromProveedor(m_prov_id, m_bIva, m_bIvaRni);

        return true;
      };

      var setGridStepWelcome = function(property) {
        // La clave de los pasos debe ser la constante que los define
        // Esto es vital para que la navegacion funcione correctamente
        var elem = m_objWizard.getSteps().add(null, GetKey(Cairo.Constants.WizardSteps.WELCOME)).getProperties();
        //*TODO:** can't found type for with block
        //*With .cIABMList.add(null)
        var w___TYPE_NOT_FOUND = elem.Add(null);
        //.Name = vbNullString
        w___TYPE_NOT_FOUND.Top = 0;
        w___TYPE_NOT_FOUND.Left = 0;
        w___TYPE_NOT_FOUND.TopNotChange = true;
        w___TYPE_NOT_FOUND.LeftNotChange = true;
        w___TYPE_NOT_FOUND.PropertyType = cspImage;
        w___TYPE_NOT_FOUND.Value = 1;
        //Set .Picture = m_Resource.ImgWiz1.Picture

        //*TODO:** can't found type for with block
        //*With .cIABMList.add(null, c_Wiz_Key_Title)
        var w___TYPE_NOT_FOUND = elem.Add(null, c_Wiz_Key_Title);
        //.Name = vbNullString
        w___TYPE_NOT_FOUND.Top = 100;
        w___TYPE_NOT_FOUND.Left = 2700;
        w___TYPE_NOT_FOUND.TopNotChange = true;
        w___TYPE_NOT_FOUND.LeftNotChange = true;
        w___TYPE_NOT_FOUND.Height = 880;
        w___TYPE_NOT_FOUND.Width = 7000;
        w___TYPE_NOT_FOUND.PropertyType = cspTitle;
        //'Bienvenido al Asistente de Facturas de Compra
        w___TYPE_NOT_FOUND.Value = Cairo.Language.getText(1913, "");

        //*TODO:** can't found type for with block
        //*With .cIABMList.add(null, c_Wiz_Key_MainTitle)
        var w___TYPE_NOT_FOUND = elem.Add(null, c_Wiz_Key_MainTitle);
        w___TYPE_NOT_FOUND.Top = 1200;
        w___TYPE_NOT_FOUND.Left = 3000;
        //.Name = vbNullString
        w___TYPE_NOT_FOUND.PropertyType = cspLabel;
        w___TYPE_NOT_FOUND.Width = 6000;
        w___TYPE_NOT_FOUND.Height = 880;
        w___TYPE_NOT_FOUND.FontBold = true;
        w___TYPE_NOT_FOUND.Value = Cairo.Language.getText(1681, "");
        //Con este asistente usted podra generar las facturas sobre remitos.

        WizAddNewDocProperties(m_objWizard, Cairo.Constants.WizardSteps.WELCOME);

      };

      var setGridSteselectProveedor = function(property) {
        // La clave de los pasos debe ser la constante que los define
        // Esto es vital para que la navegacion funcione correctamente
        var elem = m_objWizard.getSteps().add(null, GetKey(Cairo.Constants.WizardSteps.SELECT_PROVEEDOR)).getProperties();
        //*TODO:** can't found type for with block
        //*With .cIABMList.add(null)
        var w___TYPE_NOT_FOUND = elem.Add(null);
        //.Name = vbNullString
        w___TYPE_NOT_FOUND.Top = 100;
        w___TYPE_NOT_FOUND.Left = 100;
        w___TYPE_NOT_FOUND.TopNotChange = true;
        w___TYPE_NOT_FOUND.LeftNotChange = true;
        w___TYPE_NOT_FOUND.PropertyType = cspImage;
        w___TYPE_NOT_FOUND.Value = 3;
        //Set .Picture = m_Resource.ImgWiz3.Picture

        //*TODO:** can't found type for with block
        //*With .cIABMList.add(null)
        var w___TYPE_NOT_FOUND = elem.Add(null);
        //.Name = vbNullString
        w___TYPE_NOT_FOUND.Top = 400;
        w___TYPE_NOT_FOUND.Left = 1500;
        w___TYPE_NOT_FOUND.TopNotChange = true;
        w___TYPE_NOT_FOUND.LeftNotChange = true;
        w___TYPE_NOT_FOUND.Height = 880;
        w___TYPE_NOT_FOUND.Width = 8000;
        w___TYPE_NOT_FOUND.PropertyType = cspLabel;
        w___TYPE_NOT_FOUND.FontBold = true;
        w___TYPE_NOT_FOUND.Value = Cairo.Language.getText(1914, "");
        //Indique el documento a utilizar y el Proveedor al que se le emitirá la Factura

        //*TODO:** can't found type for with block
        //*With .cIABMList.add(null, c_Wiz_Key_Doc)
        var w___TYPE_NOT_FOUND = elem.Add(null, c_Wiz_Key_Doc);
        w___TYPE_NOT_FOUND.Top = 1500;
        w___TYPE_NOT_FOUND.Left = 3700;
        //'Documento
        w___TYPE_NOT_FOUND.Name = Cairo.Language.getText(1567, "");
        w___TYPE_NOT_FOUND.PropertyType = cspHelp;
        w___TYPE_NOT_FOUND.HelpFilter = "'doct_id = "+ csEDocumentoTipo.cSEDT_FACTURACOMPRA.toString()+ " and doc_tipofactura = "+ csETFacRemito+ "'";
        w___TYPE_NOT_FOUND.Table = CSDocumento2.CSDocumento;
        w___TYPE_NOT_FOUND.Width = 4000;
        w___TYPE_NOT_FOUND.Value = m_documento;
        w___TYPE_NOT_FOUND.HelpId = m_doc_id;
        w___TYPE_NOT_FOUND.Key = WC.KW_DOC_ID;

        //*TODO:** can't found type for with block
        //*With .cIABMList.add(null, c_Wiz_Key_Proveedor)
        var w___TYPE_NOT_FOUND = elem.Add(null, c_Wiz_Key_Proveedor);
        w___TYPE_NOT_FOUND.Top = 2000;
        w___TYPE_NOT_FOUND.Left = 3700;
        //'Proveedor
        w___TYPE_NOT_FOUND.Name = Cairo.Language.getText(1151, "");
        w___TYPE_NOT_FOUND.PropertyType = cspHelp;
        w___TYPE_NOT_FOUND.Table = Cairo.Tables.PROVEEDOR;
        w___TYPE_NOT_FOUND.Width = 4000;
        w___TYPE_NOT_FOUND.Value = m_proveedor;
        w___TYPE_NOT_FOUND.HelpId = m_prov_id;
        w___TYPE_NOT_FOUND.Key = WC.KW_PROV_ID;

        mPublic.self.wizSetShowStockData(m_objWizard, Cairo.Constants.WizardSteps.SELECT_PROVEEDOR, m_bShowStockData);

        //*TODO:** can't found type for with block
        //*With .cIABMList.add(null, Cairo.Constants.WizardKeys.DEPOSITO)
        var w___TYPE_NOT_FOUND = elem.Add(null, Cairo.Constants.WizardKeys.DEPOSITO);
        w___TYPE_NOT_FOUND.Top = 2500;
        w___TYPE_NOT_FOUND.Left = 3700;
        //'Deposito
        w___TYPE_NOT_FOUND.Name = Cairo.Language.getText(1574, "");
        w___TYPE_NOT_FOUND.PropertyType = cspHelp;
        w___TYPE_NOT_FOUND.Table = Cairo.Tables.DEPOSITOLOGICO;
        w___TYPE_NOT_FOUND.Width = 4000;

        w___TYPE_NOT_FOUND.HelpId = m_userCfg.getDeplId();
        w___TYPE_NOT_FOUND.Value = m_userCfg.getDeplNombre();
        w___TYPE_NOT_FOUND.Enabled = m_bShowStockData;

        // Edit From ListDoc
        //
        //*TODO:** can't found type for with block
        //*With .cIABMList.add(null, c_Wiz_Key_OnlySelected)
        var w___TYPE_NOT_FOUND = elem.Add(null, c_Wiz_Key_OnlySelected);
        w___TYPE_NOT_FOUND.PropertyType = cspCheck;
        //'Cargar solo remitos seleccionados
        w___TYPE_NOT_FOUND.Name = Cairo.Language.getText(1682, "");
        w___TYPE_NOT_FOUND.Value = m_rcIds.Length;
        w___TYPE_NOT_FOUND.Left = 5310;
        w___TYPE_NOT_FOUND.LeftLabel = -2800;

      };

      var setGridSteselectRemito = function(property) {
        // La clave de los pasos debe ser la constante que los define
        // Esto es vital para que la navegacion funcione correctamente
        var elem = m_objWizard.getSteps().add(null, GetKey(Cairo.Constants.WizardSteps.SELECT_ORDEN_REMITO)).getProperties();
        //*TODO:** can't found type for with block
        //*With .cIABMList.add(null)
        var w___TYPE_NOT_FOUND = elem.Add(null);
        //.Name = vbNullString
        w___TYPE_NOT_FOUND.Top = 100;
        w___TYPE_NOT_FOUND.Left = 100;
        w___TYPE_NOT_FOUND.TopNotChange = true;
        w___TYPE_NOT_FOUND.LeftNotChange = true;
        w___TYPE_NOT_FOUND.PropertyType = cspImage;
        w___TYPE_NOT_FOUND.Value = 3;
        //Set .Picture = m_Resource.ImgWiz3.Picture

        //*TODO:** can't found type for with block
        //*With .cIABMList.add(null)
        var w___TYPE_NOT_FOUND = elem.Add(null);
        //.Name = vbNullString
        w___TYPE_NOT_FOUND.Top = 400;
        w___TYPE_NOT_FOUND.Left = 1500;
        w___TYPE_NOT_FOUND.TopNotChange = true;
        w___TYPE_NOT_FOUND.LeftNotChange = true;
        w___TYPE_NOT_FOUND.Height = 880;
        w___TYPE_NOT_FOUND.Width = 8000;
        w___TYPE_NOT_FOUND.PropertyType = cspLabel;
        w___TYPE_NOT_FOUND.FontBold = true;
        //'Seleccione los remitos
        w___TYPE_NOT_FOUND.Value = Cairo.Language.getText(1683, "");

        //*TODO:** can't found type for with block
        //*With .cIABMList.add(null, c_Wiz_Key_Remitos)
        var w___TYPE_NOT_FOUND = elem.Add(null, c_Wiz_Key_Remitos);
        w___TYPE_NOT_FOUND.Top = 1100;
        w___TYPE_NOT_FOUND.Left = 150;
        //.Name = vbNullString
        w___TYPE_NOT_FOUND.PropertyType = cspGrid;
        w___TYPE_NOT_FOUND.LeftLabel = -1;
        loadRemitos(w___TYPE_NOT_FOUND.Grid);
        w___TYPE_NOT_FOUND.Width = 11500;
        w___TYPE_NOT_FOUND.Height = 4400;
        w___TYPE_NOT_FOUND.Key = WC.KW_REMITOS;
        w___TYPE_NOT_FOUND.GridAdd = false;
        w___TYPE_NOT_FOUND.GridEdit = true;
        w___TYPE_NOT_FOUND.GridRemove = false;

        //*TODO:** can't found type for with block
        //*With .cIABMList.add(null, c_Wiz_Key_Todos)
        var w___TYPE_NOT_FOUND = elem.Add(null, c_Wiz_Key_Todos);
        w___TYPE_NOT_FOUND.Name = Cairo.Constants.SELECT_ALL_TEXT;
        w___TYPE_NOT_FOUND.Top = 5550;
        w___TYPE_NOT_FOUND.Left = 200;
        w___TYPE_NOT_FOUND.LeftLabel = -1;
        w___TYPE_NOT_FOUND.Width = 2200;
        w___TYPE_NOT_FOUND.PropertyType = cspButton;
        w___TYPE_NOT_FOUND.Key = WC.KW_TODOS;

        //*TODO:** can't found type for with block
        //*With .cIABMList.add(null, c_Wiz_Key_Total)
        var w___TYPE_NOT_FOUND = elem.Add(null, c_Wiz_Key_Total);
        //'Total
        w___TYPE_NOT_FOUND.Name = Cairo.Language.getText(1584, "");
        w___TYPE_NOT_FOUND.Top = 5550;
        w___TYPE_NOT_FOUND.Left = 9820;
        w___TYPE_NOT_FOUND.LeftLabel = -600;
        w___TYPE_NOT_FOUND.Width = 1800;
        w___TYPE_NOT_FOUND.PropertyType = cspNumeric;
        w___TYPE_NOT_FOUND.SubType = cspMoney;
        w___TYPE_NOT_FOUND.Format = m_generalConfig.getFormatDecImporte();
      };

      var setGridRemitos = function(property) {
        var signo = null;

        var w_columns = grid.getColumns();

        // La primera simpre esta invisible
        w_columns.add(null).setVisible(false);

        var elem = w_columns.add(null);
        //.Name = vbNullString
        elem.setType(Dialogs.PropertyType.check);
        elem.setWidth(320);
        elem.setKey(KI_SELECT);

        var elem = w_columns.add(null);
        //'Tipo
        elem.setName(Cairo.Language.getText(1223, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(3000);
        elem.setKey(KI_DOC);

        var elem = w_columns.add(null);
        //'Documento
        elem.setName(Cairo.Language.getText(1567, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1800);
        elem.setKey(KI_NRODOC);

        var elem = w_columns.add(null);
        //'Número
        elem.setName(Cairo.Language.getText(1065, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setWidth(800);
        elem.setKey(KI_RC_ID);

        var elem = w_columns.add(null);
        //'Fecha
        elem.setName(Cairo.Language.getText(1569, ""));
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(1040);
        elem.setFormat("dd/mm/yy");
        elem.setKey(KI_FECHA);

        var elem = w_columns.add(null);
        //'Total
        elem.setName(Cairo.Language.getText(1584, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KI_TOTAL);
        elem.setFormat(m_generalConfig.getFormatDecImporte());

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(3000);
        elem.setKey(KI_DESCRIP);
      };

      var setGridSteselectItems = function(property) {
        // La clave de los pasos debe ser la constante que los define
        // Esto es vital para que la navegacion funcione correctamente
        var elem = m_objWizard.getSteps().add(null, GetKey(Cairo.Constants.WizardSteps.SELECT_ITEMS)).getProperties();
        //*TODO:** can't found type for with block
        //*With .cIABMList.add(null)
        var w___TYPE_NOT_FOUND = elem.Add(null);
        //.Name = vbNullString
        w___TYPE_NOT_FOUND.Top = 100;
        w___TYPE_NOT_FOUND.Left = 100;
        w___TYPE_NOT_FOUND.TopNotChange = true;
        w___TYPE_NOT_FOUND.LeftNotChange = true;
        w___TYPE_NOT_FOUND.PropertyType = cspImage;
        w___TYPE_NOT_FOUND.Value = 3;
        //Set .Picture = m_Resource.ImgWiz3.Picture

        //*TODO:** can't found type for with block
        //*With .cIABMList.add(null)
        var w___TYPE_NOT_FOUND = elem.Add(null);
        //.Name = vbNullString
        w___TYPE_NOT_FOUND.Top = 400;
        w___TYPE_NOT_FOUND.Left = 1500;
        w___TYPE_NOT_FOUND.TopNotChange = true;
        w___TYPE_NOT_FOUND.LeftNotChange = true;
        w___TYPE_NOT_FOUND.Height = 880;
        w___TYPE_NOT_FOUND.Width = 8000;
        w___TYPE_NOT_FOUND.PropertyType = cspLabel;
        w___TYPE_NOT_FOUND.FontBold = true;
        w___TYPE_NOT_FOUND.Value = Cairo.Language.getText(1676, "");
        //Seleccione los items he indique las cantidades que facturará de cada una de ellos

        //*TODO:** can't found type for with block
        //*With .cIABMList.add(null, c_Wiz_Key_Items)
        var w___TYPE_NOT_FOUND = elem.Add(null, c_Wiz_Key_Items);
        w___TYPE_NOT_FOUND.Top = 1100;
        w___TYPE_NOT_FOUND.Left = 150;
        //.Name = vbNullString
        w___TYPE_NOT_FOUND.PropertyType = cspGrid;
        w___TYPE_NOT_FOUND.LeftLabel = -1;
        loadItems(w___TYPE_NOT_FOUND.Grid);
        w___TYPE_NOT_FOUND.Width = 11500;
        w___TYPE_NOT_FOUND.Height = 4400;
        w___TYPE_NOT_FOUND.Key = WC.KW_ITEMS;
        w___TYPE_NOT_FOUND.GridAdd = false;
        w___TYPE_NOT_FOUND.GridEdit = true;
        w___TYPE_NOT_FOUND.GridRemove = false;

        //*TODO:** can't found type for with block
        //*With .cIABMList.add(null, c_Wiz_Key_TodosItems)
        var w___TYPE_NOT_FOUND = elem.Add(null, c_Wiz_Key_TodosItems);
        w___TYPE_NOT_FOUND.Name = Cairo.Constants.SELECT_ALL_TEXT;
        w___TYPE_NOT_FOUND.Top = 5550;
        w___TYPE_NOT_FOUND.Left = 200;
        w___TYPE_NOT_FOUND.LeftLabel = -1;
        w___TYPE_NOT_FOUND.Width = 2200;
        w___TYPE_NOT_FOUND.PropertyType = cspButton;
        w___TYPE_NOT_FOUND.Key = WC.KW_TODOS_ITEMS;

        //*TODO:** can't found type for with block
        //*With .cIABMList.add(null, c_Wiz_Key_TotalItems)
        var w___TYPE_NOT_FOUND = elem.Add(null, c_Wiz_Key_TotalItems);
        //'Total
        w___TYPE_NOT_FOUND.Name = Cairo.Language.getText(1584, "");
        w___TYPE_NOT_FOUND.Top = 5550;
        w___TYPE_NOT_FOUND.Left = 9820;
        w___TYPE_NOT_FOUND.LeftLabel = -600;
        w___TYPE_NOT_FOUND.Width = 1800;
        w___TYPE_NOT_FOUND.PropertyType = cspNumeric;
        w___TYPE_NOT_FOUND.SubType = cspMoney;
        w___TYPE_NOT_FOUND.Format = m_generalConfig.getFormatDecImporte();
      };

      var setGridStepPercepciones = function(property) {
        // La clave de los pasos debe ser la constante que los define
        // Esto es vital para que la navegacion funcione correctamente
        var elem = m_objWizard.getSteps().add(null, GetKey(Cairo.Constants.WizardSteps.PERCEPCIONES)).getProperties();
        //*TODO:** can't found type for with block
        //*With .cIABMList.add(null)
        var w___TYPE_NOT_FOUND = elem.Add(null);
        //.Name = vbNullString
        w___TYPE_NOT_FOUND.Top = 100;
        w___TYPE_NOT_FOUND.Left = 100;
        w___TYPE_NOT_FOUND.TopNotChange = true;
        w___TYPE_NOT_FOUND.LeftNotChange = true;
        w___TYPE_NOT_FOUND.PropertyType = cspImage;
        w___TYPE_NOT_FOUND.Value = 3;
        //Set .Picture = m_Resource.ImgWiz3.Picture

        //*TODO:** can't found type for with block
        //*With .cIABMList.add(null)
        var w___TYPE_NOT_FOUND = elem.Add(null);
        //.Name = vbNullString
        w___TYPE_NOT_FOUND.Top = 400;
        w___TYPE_NOT_FOUND.Left = 1500;
        w___TYPE_NOT_FOUND.TopNotChange = true;
        w___TYPE_NOT_FOUND.LeftNotChange = true;
        w___TYPE_NOT_FOUND.Height = 880;
        w___TYPE_NOT_FOUND.Width = 8000;
        w___TYPE_NOT_FOUND.PropertyType = cspLabel;
        w___TYPE_NOT_FOUND.FontBold = true;
        //'Indique las percepciones si corresponde
        w___TYPE_NOT_FOUND.Value = Cairo.Language.getText(1915, "");

        //*TODO:** can't found type for with block
        //*With .cIABMList.add(null, c_Wiz_Key_percepciones)
        var w___TYPE_NOT_FOUND = elem.Add(null, c_Wiz_Key_percepciones);
        w___TYPE_NOT_FOUND.Top = 1100;
        w___TYPE_NOT_FOUND.Left = 150;
        //.Name = vbNullString
        w___TYPE_NOT_FOUND.PropertyType = cspGrid;
        w___TYPE_NOT_FOUND.LeftLabel = -1;
        loadPercepciones(w___TYPE_NOT_FOUND.Grid);
        w___TYPE_NOT_FOUND.Width = 11500;
        w___TYPE_NOT_FOUND.Height = 4400;
        w___TYPE_NOT_FOUND.Key = WC.KW_PERCEPCIONES;
        w___TYPE_NOT_FOUND.GridAdd = true;
        w___TYPE_NOT_FOUND.GridEdit = true;
        w___TYPE_NOT_FOUND.GridRemove = true;

        //*TODO:** can't found type for with block
        //*With .cIABMList.add(null, c_Wiz_Key_TotalPercepciones)
        var w___TYPE_NOT_FOUND = elem.Add(null, c_Wiz_Key_TotalPercepciones);
        //'Total
        w___TYPE_NOT_FOUND.Name = Cairo.Language.getText(1584, "");
        w___TYPE_NOT_FOUND.Top = 5550;
        w___TYPE_NOT_FOUND.Left = 9820;
        w___TYPE_NOT_FOUND.LeftLabel = -600;
        w___TYPE_NOT_FOUND.Width = 1800;
        w___TYPE_NOT_FOUND.PropertyType = cspNumeric;
        w___TYPE_NOT_FOUND.SubType = cspMoney;
        w___TYPE_NOT_FOUND.Format = m_generalConfig.getFormatDecImporte();
      };

      var setGridPercepciones = function(property) {
        Percepciones.loadPercepciones(grid, m_generalConfig);
      };

      var setGridItems = function(property) {
        // La primera simpre esta invisible
        var w_columns = grid.getColumns();
        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_RVI_ID);

        var elem = w_columns.add(null);
        //.Name = vbNullString
        elem.setType(Dialogs.PropertyType.check);
        elem.setWidth(320);
        elem.setKey(KII_SELECT);

        var elem = w_columns.add(null);
        //'Documento
        elem.setName(Cairo.Language.getText(1567, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1600);
        elem.setKey(KI_NRODOC);

        var elem = w_columns.add(null);
        //'Número
        elem.setName(Cairo.Language.getText(1065, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setWidth(800);
        elem.setKey(KI_RC_ID);

        var elem = w_columns.add(null);
        //'Articulo
        elem.setName(Cairo.Language.getText(1367, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(3000);
        elem.setKey(KII_ARTICULO);

        var elem = w_columns.add(null);
        //'Precio
        elem.setName(Cairo.Language.getText(1586, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KII_PRECIO_SIN_IVA);
        elem.setFormat(m_generalConfig.getFormatDecImporte());
        elem.setEnabled(SecurityCanAccessSilent(csComprasPrestacion.cSPRECPRAEDITPRICEFAC));

        var elem = w_columns.add(null);
        //'Cantidad
        elem.setName(Cairo.Language.getText(1374, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setWidth(920);
        elem.setKey(KII_CANTIDAD);
        elem.setFormat(m_generalConfig.getFormatDecCantidad());

        var elem = w_columns.add(null, c_Wiz_Key_Pendiente);
        //'Pendiente
        elem.setName(Cairo.Language.getText(1609, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setWidth(920);
        elem.setKey(KII_PENDIENTE);
        elem.setFormat(m_generalConfig.getFormatDecCantidad());

        var elem = w_columns.add(null);
        //'Aplicar
        elem.setName(Cairo.Language.getText(1662, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.double);
        elem.setWidth(920);
        elem.setKey(KII_APLICAR);
        elem.setFormat(m_generalConfig.getFormatDecCantidad());

        var elem = w_columns.add(null, c_Wiz_Key_TotalItems);
        //'Total
        elem.setName(Cairo.Language.getText(1584, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KII_TOTAL);
        elem.setFormat(m_generalConfig.getFormatDecImporte());

        // TO
        var elem = w_columns.add(null);
        //'Tipo Operación
        elem.setName(Cairo.Language.getText(1661, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TIPOOPERACION);
        elem.setWidth(1800);
        elem.setKey(KII_TO_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(3000);
        elem.setKey(KII_DESCRIP);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_PRECIOIVA);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_PRECIO_LP);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_PRECIO_USR);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_IVARIPERCENT);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_IVARNIPERCENT);

        // Internos
        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_INTERNOSPERCENT);

        // Internos
        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_INTERNOSPORC);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_DESCUENTO);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KII_CCOS_ID);
      };

      var pUserCancel = function() {
        var _rtn = null;
        if(m_wizardCancel) {

          if(Ask(Cairo.Language.getText(1665, ""), vbNo)) {
            //Desea cancelar el proceso

            _rtn = true;
          }
        }
        m_wizardCancel = false;

        return _rtn;
      };

      var getCotizacion = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.DATOS_GENERALES, c_Wiz_Key_Cotizacion);
      };

      var getDocProperty = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.SELECT_PROVEEDOR, c_Wiz_Key_Doc);
      };

      var getDoc = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.SELECT_PROVEEDOR, c_Wiz_Key_Doc).getSelectId();
      };

      var getDocName = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.SELECT_PROVEEDOR, c_Wiz_Key_Doc).getValue();
      };

      var getTodos = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.SELECT_ORDEN_REMITO, c_Wiz_Key_Todos);
      };

      var getTodosItems = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.SELECT_ITEMS, c_Wiz_Key_TodosItems);
      };

      var getTotal = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.SELECT_ORDEN_REMITO, c_Wiz_Key_Total);
      };

      var getTotalItems = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.SELECT_ITEMS, c_Wiz_Key_TotalItems);
      };

      var getTotalPercepciones = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.PERCEPCIONES, c_Wiz_Key_TotalPercepciones);
      };

      var getProveedor2 = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.DATOS_GENERALES, c_Wiz_Key_Proveedor2);
      };

      var getProveedorProp = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.SELECT_PROVEEDOR, c_Wiz_Key_Proveedor);
      };

      var getProveedor = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.SELECT_PROVEEDOR, c_Wiz_Key_Proveedor).getSelectId();
      };

      var getProveedorName = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.SELECT_PROVEEDOR, c_Wiz_Key_Proveedor).getValue();
      };

      // Edit From ListDoc
      //
      var getOnlySelected = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.SELECT_PROVEEDOR, c_Wiz_Key_OnlySelected);
      };

      var getItems = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.SELECT_ITEMS, c_Wiz_Key_Items).getGrid();
      };

      var getPercepciones = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.PERCEPCIONES, c_Wiz_Key_percepciones).getGrid();
      };

      var getItemsProperty = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.SELECT_ITEMS, c_Wiz_Key_Items);
      };

      var getPercepcionesProperty = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.PERCEPCIONES, c_Wiz_Key_percepciones);
      };

      var getRemitos = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.SELECT_ORDEN_REMITO, c_Wiz_Key_Remitos).getGrid();
      };

      var getRemitosProperty = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.SELECT_ORDEN_REMITO, c_Wiz_Key_Remitos);
      };

      var pRefreshRemitos = function() {
        var objWiz = null;
        objWiz = m_objWizard;

        objWiz.showValue(cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.SELECT_ORDEN_REMITO, c_Wiz_Key_Remitos), true);
      };

      var pRefreshItems = function() {
        var objWiz = null;
        objWiz = m_objWizard;

        objWiz.showValue(cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.SELECT_ITEMS, c_Wiz_Key_Items), true);
      };

      var getComprobante = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.DATOS_GENERALES, c_Wiz_Key_Comprobante);
      };

      var getLegajo = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.DATOS_GENERALES, c_Wiz_Key_Legajo);
      };

      var getDescrip = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.DATOS_GENERALES, c_Wiz_Key_Observaciones);
      };

      var getCentroCosto = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.DATOS_GENERALES, c_Wiz_Key_CentroCosto);
      };

      var getCondicionPago = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.DATOS_GENERALES, c_Wiz_Key_CondicionPago);
      };

      var getListaPrecio = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.DATOS_GENERALES, c_Wiz_Key_ListaPrecio);
      };

      var getListaDescuento = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.DATOS_GENERALES, c_Wiz_Key_ListaDescuento);
      };

      var getSucursal = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.DATOS_GENERALES, c_Wiz_Key_Sucursal);
      };

      var getTipoComprobante = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.DATOS_GENERALES, c_Wiz_Key_TipoComprobante);
      };

      var getFecha = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.DATOS_GENERALES, c_Wiz_Key_Fecha);
      };

      var getFechaIva = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.DATOS_GENERALES, c_Wiz_Key_FechaIva);
      };

      var getFechaVto = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.DATOS_GENERALES, c_Wiz_Key_FechaVto);
      };

      var getCotizacionProv = function() {
        return cIABMProperty.getWizProperty(m_objWizard, Cairo.Constants.WizardSteps.DATOS_GENERALES, c_Wiz_Key_CotizacionProv);
      };

      var pChecRemitos = function() {
        var _rtn = null;
        var row = null;
        var _count = getRemitos().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = getRemitos().getRows().item(_i);
          if(getCell(row, KI_SELECT).getId()) {
            _rtn = true;
            return _rtn;
          }
        }

        //'Debe indicar uno o más remitos.
        M.showWarning(Cairo.Language.getText(1677, ""));

        return _rtn;
      };

      var pCheckPercepciones = function() {
        return true;
      };

      var pCheckItems = function() {
        var row = null;
        var bExistsSelected = null;
        var i = null;

        var _count = getItems().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = getItems().getRows().item(_i);
          i = i + 1;
          if(val(getCell(row, KII_APLICAR).getValue()) > 0) {
            if(!validateRowItems(row, i)) { return false; }
            bExistsSelected = true;
            if(!val(getCell(row, KII_PRECIO_SIN_IVA).getValue()) != 0) {
              M.showWarning(Cairo.Language.getText(1667, "", i));
              //Debe indicar un precio para el item (1)
              return null;
            }
          }
        }

        if(!bExistsSelected) {
          //'Debe indicar uno o más items.
          M.showWarning(Cairo.Language.getText(1678, ""));
          return null;
        }

        if(!val(getTotalItems().getValue()) > 0) {
          //'Debe indicar uno o más items.
          M.showWarning(Cairo.Language.getText(1678, ""));
          return null;
        }

        return true;
      };

      var validateRowItems = function(row,  rowIndex) {
        var p = null;
        var strRow = " (Row: " + rowIndex.toString() + ")";

        if(ValEmpty(getCell(row, KII_TO_ID).getId(), Cairo.Constants.Types.id)) {
          p = M.showInfo(Cairo.Language.getText(1633, "", strRow));
          //Debe indicar un tipo de operación (1)
        }

        return p || Cairo.Promises.resolvedPromise(true);
      };

      var getRemitosIds = function() {
        var row = null;
        var ids = null;

        var _count = getRemitos().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = getRemitos().getRows().item(_i);
          if(getCell(row, KI_SELECT).getId()) {
            ids = ids+ getCell(row, KI_RC_ID).getId().toString()+ ",";
          }
        }

        return RemoveLastColon(ids);
      };

      var setGridItemsXRemitos = function(property) {
        var f = null;
        var fv = null;
        var i = null;

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

        var w_getItems = getItems().getRows();

        w_getItems.Clear;

        for(var _i = 0; _i < m_data.itemsXRemitos.length; _i += 1) {

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w_getItems.Add(null);

          // La primera no se usa
          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Id = Cairo.Database.valField(m_data.itemsXRemitos[_i], mComprasConstantes.RCI_ID);
          w___TYPE_NOT_FOUND.Key = KII_RVI_ID;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = 0;
          w___TYPE_NOT_FOUND.Key = KII_SELECT;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(m_data.itemsXRemitos[_i], mComprasConstantes.RC_NRODOC);
          w___TYPE_NOT_FOUND.Key = KI_NRODOC;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(m_data.itemsXRemitos[_i], mComprasConstantes.RC_NUMERO);
          w___TYPE_NOT_FOUND.Id = Cairo.Database.valField(m_data.itemsXRemitos[_i], mComprasConstantes.RC_ID);
          w___TYPE_NOT_FOUND.Key = KI_RC_ID;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(m_data.itemsXRemitos[_i], mComprasConstantes.PR_NOMBRECOMPRA);
          w___TYPE_NOT_FOUND.Id = Cairo.Database.valField(m_data.itemsXRemitos[_i], mComprasConstantes.PR_ID);
          w___TYPE_NOT_FOUND.Key = KII_ARTICULO;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(m_data.itemsXRemitos[_i], mComprasConstantes.RCI_PRECIO+ "2");
          w___TYPE_NOT_FOUND.Key = KII_PRECIO_SIN_IVA;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(m_data.itemsXRemitos[_i], mComprasConstantes.RCI_CANTIDADAREMITIR);
          w___TYPE_NOT_FOUND.Key = KII_CANTIDAD;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(m_data.itemsXRemitos[_i], mComprasConstantes.RCI_PENDIENTEFAC);
          w___TYPE_NOT_FOUND.Key = KII_PENDIENTE;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = 0;
          w___TYPE_NOT_FOUND.Key = KII_APLICAR;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(m_data.itemsXRemitos[_i], mComprasConstantes.RCI_IMPORTE);
          w___TYPE_NOT_FOUND.Key = KII_TOTAL;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Id = Cairo.Constants.c_TO_COMERCIALID;
          w___TYPE_NOT_FOUND.Value = Cairo.Constants.c_TO_Comercial;
          w___TYPE_NOT_FOUND.Key = KII_TO_ID;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(m_data.itemsXRemitos[_i], mComprasConstantes.RCI_DESCRIP);
          w___TYPE_NOT_FOUND.Key = KII_DESCRIP;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(m_data.itemsXRemitos[_i], mComprasConstantes.RCI_PRECIO);
          w___TYPE_NOT_FOUND.Key = KII_PRECIOIVA;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(m_data.itemsXRemitos[_i], mComprasConstantes.RCI_PRECIO_LISTA);
          w___TYPE_NOT_FOUND.Key = KII_PRECIO_LP;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(m_data.itemsXRemitos[_i], mComprasConstantes.RCI_PRECIO_USR);
          w___TYPE_NOT_FOUND.Key = KII_PRECIO_USR;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(m_data.itemsXRemitos[_i], mComprasConstantes.RCI_IVARIPORC);
          w___TYPE_NOT_FOUND.Key = KII_IVARIPERCENT;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(m_data.itemsXRemitos[_i], mComprasConstantes.RCI_IVARNIPORC);
          w___TYPE_NOT_FOUND.Key = KII_IVARNIPERCENT;

          // Internos
          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(m_data.itemsXRemitos[_i], mComprasConstantes.FCI_INTERNOS_PORC);
          w___TYPE_NOT_FOUND.Key = KII_INTERNOSPERCENT;

          // Internos
          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(m_data.itemsXRemitos[_i], mComprasConstantes.PR_PORC_INTERNO_C);
          w___TYPE_NOT_FOUND.Key = KII_INTERNOSPORC;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(m_data.itemsXRemitos[_i], mComprasConstantes.RCI_DESCUENTO);
          w___TYPE_NOT_FOUND.Key = KII_DESCUENTO;

          //*TODO:** can't found type for with block
          //*With .cIABMList.add(null)
          var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
          w___TYPE_NOT_FOUND.Id = Cairo.Database.valField(m_data.itemsXRemitos[_i], mComprasConstantes.CCOS_ID);
          w___TYPE_NOT_FOUND.Key = KII_CCOS_ID;

        }

        pRefreshItems();
        showTotalItems();

        return true;
      };

      var setGridRemitosXProveedor = function(property) {
        var rc_id = null;

        // Edit From ListDoc
        //
        var bSelected = null;
        var bOnlySelected = null;

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

        // Edit From ListDoc
        //
        bOnlySelected = getOnlySelected().getValue();

        var w_getRemitos = getRemitos().getRows();

        w_getRemitos.Clear;

        for(var _i = 0; _i < m_data.remitosXProveedor.length; _i += 1) {

          // Edit From ListDoc
          //
          rc_id = Cairo.Database.valField(m_data.remitosXProveedor[_i], mComprasConstantes.RC_ID);

          bSelected = getApply(rc_id);
          if(!bOnlySelected || bSelected) {

            //*TODO:** can't found type for with block
            //*With .cIABMList.add(null)
            var w___TYPE_NOT_FOUND = w_getRemitos.Add(null);

            // La primera no se usa
            w___TYPE_NOT_FOUND.Add(null);

            //*TODO:** can't found type for with block
            //*With .cIABMList.add(null)
            var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
            w___TYPE_NOT_FOUND.Id = Integer.parseInt(bSelected);
            w___TYPE_NOT_FOUND.Key = KI_SELECT;

            //*TODO:** can't found type for with block
            //*With .cIABMList.add(null)
            var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
            w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(m_data.remitosXProveedor[_i], mComprasConstantes.DOC_NAME);
            w___TYPE_NOT_FOUND.Key = KI_DOC;

            //*TODO:** can't found type for with block
            //*With .cIABMList.add(null)
            var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
            w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(m_data.remitosXProveedor[_i], mComprasConstantes.RC_NRODOC);
            w___TYPE_NOT_FOUND.Key = KI_NRODOC;

            //*TODO:** can't found type for with block
            //*With .cIABMList.add(null)
            var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
            w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(m_data.remitosXProveedor[_i], mComprasConstantes.RC_NUMERO);
            w___TYPE_NOT_FOUND.Id = Cairo.Database.valField(m_data.remitosXProveedor[_i], mComprasConstantes.RC_ID);
            w___TYPE_NOT_FOUND.Key = KI_RC_ID;

            //*TODO:** can't found type for with block
            //*With .cIABMList.add(null)
            var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
            w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(m_data.remitosXProveedor[_i], mComprasConstantes.RC_FECHA);
            w___TYPE_NOT_FOUND.Key = KI_FECHA;

            //*TODO:** can't found type for with block
            //*With .cIABMList.add(null)
            var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
            w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(m_data.remitosXProveedor[_i], mComprasConstantes.RC_TOTAL);
            w___TYPE_NOT_FOUND.Key = KI_TOTAL;

            //*TODO:** can't found type for with block
            //*With .cIABMList.add(null)
            var w___TYPE_NOT_FOUND = w___TYPE_NOT_FOUND.Add(null);
            w___TYPE_NOT_FOUND.Value = Cairo.Database.valField(m_data.remitosXProveedor[_i], mComprasConstantes.RC_DESCRIP);
            w___TYPE_NOT_FOUND.Key = KI_DESCRIP;
          }

        }

        pRefreshRemitos();
        showTotalRemitos();

        return true;
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
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        tAL_ID = Cairo.Database.valField(rs.getFields(), 0);

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
          //'Debe indicar la fecha de la factura
          M.showWarning(Cairo.Language.getText(1669, ""));
          return null;
        }

        if(ValEmpty(getCondicionPago().getSelectId(), Cairo.Constants.Types.id)) {
          //'Debe indicar la condicion de pago
          M.showWarning(Cairo.Language.getText(1561, ""));
          return null;
        }

        var w_getFechaVto = getFechaVto();
        if(ValEmpty(w_getFechaVto.getValue(), Cairo.Constants.Types.date) && w_getFechaVto.getVisible()) {
          //'Debe indicar una fecha de vencimiento
          MsgInfo(Cairo.Language.getText(1625, ""));
          return null;
        }

        if(ValEmpty(getSucursal().getSelectId(), Cairo.Constants.Types.id)) {
          //'Debe indicar la sucursal
          M.showWarning(Cairo.Language.getText(1560, ""));
          return null;
        }

        return true;
      };

      self.initialize = function() {
        try {

          //'Error al grabar la factura de Compra
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
        //' Internos
        var internos = null;
        var totalOrigen = null;
        var totalPercep = null;

        register.setFieldId(mComprasConstantes.FC_TMPID);
        register.setTable(mComprasConstantes.FACTURACOMPRATMP);

        register.setId(Cairo.Constants.NEW_ID);

        // Header
        var w_fields = register.getFields();
        w_fields.add2(mComprasConstantes.FC_NUMERO, 0, Cairo.Constants.Types.long);

        // PrintDoc
        //
        m_lastNroDoc = SetMask(comp.getValue(), comp.getTextMask());
        w_fields.add2(mComprasConstantes.FC_NRODOC, m_lastNroDoc, Cairo.Constants.Types.text);

        w_fields.add2(mComprasConstantes.FC_DESCRIP, getDescrip().getValue(), Cairo.Constants.Types.text);
        w_fields.add2(mComprasConstantes.FC_FECHA, getFecha().getValue(), Cairo.Constants.Types.date);
        w_fields.add2(mComprasConstantes.FC_FECHA_IVA, getFechaIva().getValue(), Cairo.Constants.Types.date);
        w_fields.add2(mComprasConstantes.FC_FECHA_VTO, getFechaVto().getValue(), Cairo.Constants.Types.date);

        w_fields.add2(mComprasConstantes.PROV_ID, getProveedor(), Cairo.Constants.Types.id);
        w_fields.add2(mComprasConstantes.CCOS_ID, getCentroCosto().getSelectId(), Cairo.Constants.Types.id);
        w_fields.add2(mComprasConstantes.SUC_ID, getSucursal().getSelectId(), Cairo.Constants.Types.id);
        w_fields.add2(mComprasConstantes.CPG_ID, getCondicionPago().getSelectId(), Cairo.Constants.Types.id);
        w_fields.add2(mComprasConstantes.LP_ID, getListaPrecio().getSelectId(), Cairo.Constants.Types.id);
        w_fields.add2(mComprasConstantes.LD_ID, getListaDescuento().getSelectId(), Cairo.Constants.Types.id);
        w_fields.add2(mComprasConstantes.DOC_ID, getDoc(), Cairo.Constants.Types.id);
        w_fields.add2(mComprasConstantes.LGJ_ID, getLegajo().getSelectId(), Cairo.Constants.Types.id);
        w_fields.add2(mComprasConstantes.FC_GRABAR_ASIENTO, 1, Cairo.Constants.Types.boolean);
        w_fields.add2(mComprasConstantes.FC_TIPO_COMPROBANTE, getTipoComprobante().getListItemData(), Cairo.Constants.Types.integer);
        w_fields.add2(mComprasConstantes.DEPL_ID, mPublic.self.wizGetDeposito(m_objWizard, Cairo.Constants.WizardSteps.SELECT_PROVEEDOR, Cairo.Constants.WizardKeys.DEPOSITO), Cairo.Constants.Types.id);
        w_fields.add2(mComprasConstantes.FC_COTIZACION_PROV, getCotizacionProv().getValue(), Cairo.Constants.Types.double);

        cotizacion = val(getCotizacion().getValue());
        w_fields.add2(mComprasConstantes.FC_COTIZACION, cotizacion, Cairo.Constants.Types.double);

        w_fields.add2(Cairo.Constants.EST_ID, CSGeneralEx2.csEEstado.cSEEST_PENDIENTE, Cairo.Constants.Types.id);
        w_fields.add2(mComprasConstantes.FC_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);

        bIvaRni = IsRNI(getProveedor());

        // Internos
        getFooter(neto, ivaRi, ivaRni, bIvaRni, internos);

        // Manejo de la moneda y la cotizacion
        //
        bMonedaLegal = GetMonedaDefault === GetMonIdFromDoc(getDoc());
        if(bMonedaLegal) {
          cotizacion = 1;
        }
        else {
          if(cotizacion === 0) { cotizacion = 1; }
        }

        totalPercep = val(getTotalPercepciones().getValue());

        // Footer
        w_fields.add2(mComprasConstantes.FC_SUBTOTAL, neto * cotizacion, Cairo.Constants.Types.currency);
        w_fields.add2(mComprasConstantes.FC_NETO, neto * cotizacion, Cairo.Constants.Types.currency);
        w_fields.add2(mComprasConstantes.FC_IVARI, ivaRi * cotizacion, Cairo.Constants.Types.currency);
        w_fields.add2(mComprasConstantes.FC_IVARNI, ivaRni * cotizacion, Cairo.Constants.Types.currency);
        // Internos
        w_fields.add2(mComprasConstantes.FC_INTERNOS, internos * cotizacion, Cairo.Constants.Types.currency);
        w_fields.add2(mComprasConstantes.FC_TOTAL_PERCEPCIONES, totalPercep * cotizacion, Cairo.Constants.Types.currency);

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
          w_fields.add2(mComprasConstantes.FC_TOTAL_ORIGEN, 0, Cairo.Constants.Types.currency);
        }
        else {
          w_fields.add2(mComprasConstantes.FC_TOTAL_ORIGEN, totalOrigen, Cairo.Constants.Types.currency);
        }

        //' Por ahora no hay descuentos
        w_fields.add2(mComprasConstantes.FC_TOTAL, totalOrigen * cotizacion, Cairo.Constants.Types.currency);

        w_fields.setHaveLastUpdate(true);
        w_fields.setHaveWhoModify(true);

      };

      var pSave = function() {
        var _rtn = null;

        if(!DocCanSaveEx(m_objWizard.getEditGeneric(), c_Wiz_Key_FechaIva, c_Wiz_Key_Doc)) {
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

        if(!Cairo.Database.save(register, , "pSave", C_MODULE, SAVE_ERROR_MESSAGE)) { return _rtn; }

        if(!pSaveItems(register.getId(), cotizacion, bMonedaLegal, bIvaRni)) { return _rtn; }

        if(!Percepciones.savePercepciones(getPercepcionesProperty(), register.getId(), cotizacion, bMonedaLegal, false, "", Cairo.Constants.NO_ID, C_MODULE)) { return _rtn; }

        if(!pSaveVinculacion(register.getId())) { return _rtn; }

        if(!register.commitTrans()) { return _rtn; }

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_DocFacturaCompraSave "+ register.getId().toString();
        if(!Cairo.Database.openRs(sqlstmt, rs, , , , "pSave", C_MODULE, SAVE_ERROR_MESSAGE)) { return _rtn; }

        if(rs.isEOF()) { return _rtn; }

        var id = null;
        if(!GetDocIDFromRecordset(rs, id)) { return _rtn; }

        m_id = id;

        _rtn = m_id != 0;

        return _rtn;
      };

      var pSaveItems = function(id,  cotizacion,  bMonedaLegal,  bIvaRni) {

        var transaction = new Cairo.Database.Transaction();
        var iOrden = null;
        var row = null;
        var cell = null;
        var precio = null;
        var ivaRi = null;
        var ivaRni = null;
        //' Internos
        var internos = null;
        var int_porc = null;
        var neto = null;
        var importe = null;
        var cantidad = null;

        var _count = getItems().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = getItems().getRows().item(_i);

          if(val(getCell(row, KII_APLICAR).getValue())) {

            var register = new Cairo.Database.Register();
            register.setFieldId(mComprasConstantes.FCI_TMPID);
            register.setTable(mComprasConstantes.FACTURACOMPRAITEMTMP);
            register.setId(Cairo.Constants.NEW_ID);

            var _count = row.size();
            for (var _j = 0; _j < _count; _j++) {
              cell = row.item(_j);
              switch (cell.getKey()) {
                case KII_APLICAR:
                  cantidad = cell.getValue();
                  register.getFields().add2(mComprasConstantes.FCI_CANTIDAD, cell.getValue(), Cairo.Constants.Types.double);
                  break;

                case KII_DESCRIP:
                  register.getFields().add2(mComprasConstantes.FCI_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KII_PRECIO_SIN_IVA:
                  precio = val(cell.getValue()) * cotizacion;
                  register.getFields().add2(mComprasConstantes.FCI_PRECIO, precio, Cairo.Constants.Types.currency);
                  break;

                case KII_PRECIO_LP:
                  register.getFields().add2(mComprasConstantes.FCI_PRECIO_LISTA, val(cell.getValue()) * cotizacion, Cairo.Constants.Types.currency);
                  break;

                case KII_PRECIO_USR:
                  register.getFields().add2(mComprasConstantes.FCI_PRECIO_USR, val(cell.getValue()) * cotizacion, Cairo.Constants.Types.currency);
                  break;

                case KII_DESCUENTO:
                  register.getFields().add2(mComprasConstantes.FCI_DESCUENTO, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KII_IVARIPERCENT:
                  ivaRi = cell.getValue();
                  register.getFields().add2(mComprasConstantes.FCI_IVARIPORC, ivaRi, Cairo.Constants.Types.double);
                  break;

                case KII_IVARNIPERCENT:
                  if(bIvaRni) {
                    ivaRni = cell.getValue();
                  }
                  register.getFields().add2(mComprasConstantes.FCI_IVARNIPORC, ivaRni, Cairo.Constants.Types.double);

                  // Internos
                  break;

                case KII_INTERNOSPERCENT:
                  internos = cell.getValue();
                  register.getFields().add2(mComprasConstantes.FCI_INTERNOS_PORC, internos, Cairo.Constants.Types.double);

                  // Internos
                  break;

                case KII_INTERNOSPORC:
                  int_porc = cell.getValue();

                  break;

                case KII_ARTICULO:
                  register.getFields().add2(mComprasConstantes.PR_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KII_CCOS_ID:
                  register.getFields().add2(mComprasConstantes.CCOS_ID, cell.getId(), Cairo.Constants.Types.id);
                  // TO
                  break;

                case KII_TO_ID:
                  register.getFields().add2(mComprasConstantes.TO_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;
              }
            }

            neto = precio * cantidad;
            register.getFields().add2(mComprasConstantes.FCI_NETO, neto, Cairo.Constants.Types.currency);

            ivaRi = neto * ivaRi / 100;
            register.getFields().add2(mComprasConstantes.FCI_IVARI, ivaRi, Cairo.Constants.Types.currency);

            ivaRni = neto * ivaRni / 100;
            register.getFields().add2(mComprasConstantes.FCI_IVARNI, ivaRni, Cairo.Constants.Types.currency);

            // Internos
            internos = (neto * int_porc / 100) * internos / 100;
            register.getFields().add2(mComprasConstantes.FCI_INTERNOS, internos, Cairo.Constants.Types.currency);

            // Internos
            importe = neto + ivaRi + ivaRni + internos;
            register.getFields().add2(mComprasConstantes.FCI_IMPORTE, importe, Cairo.Constants.Types.currency);

            if(bMonedaLegal) {
              register.getFields().add2(mComprasConstantes.FCI_IMPORTE_ORIGEN, 0, Cairo.Constants.Types.currency);
            }
            else {
              register.getFields().add2(mComprasConstantes.FCI_IMPORTE_ORIGEN, DivideByCero(importe, cotizacion), Cairo.Constants.Types.currency);
            }

            // Esto es muy importante ya que se usa para vincular el remitoCompraitem
            // con el nuevo FacturaCompraitem
            iOrden = iOrden + 1;
            register.getFields().add2(mComprasConstantes.FCI_ORDEN, iOrden, Cairo.Constants.Types.integer);

            register.getFields().add2(mComprasConstantes.FC_TMPID, id, Cairo.Constants.Types.id);
            register.getFields().add2(mComprasConstantes.FCI_ID, id, Cairo.Constants.Types.long);

            // Cuentas contables - Por ahora se resuelve asi
            register.getFields().add2(mComprasConstantes.CUE_ID, -1, Cairo.Constants.Types.id);
            register.getFields().add2(mComprasConstantes.CUE_ID_IVA_RI, -1, Cairo.Constants.Types.id);
            register.getFields().add2(mComprasConstantes.CUE_ID_IVA_RNI, -1, Cairo.Constants.Types.id);

            register.getFields().setHaveLastUpdate(false);
            register.getFields().setHaveWhoModify(false);

            transaction.addRegister(register);
          }
        }

        sqlstmt = "sp_DocFacturaCompraWizardSave "+ id.toString();
        if(!Cairo.Database.execute(sqlstmt, "pSaveItems", C_MODULE, SAVE_ERROR_MESSAGE)) { return false; }

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
          register.setFieldId(mComprasConstantes.RC_FC_TMPID);
          register.setTable(mComprasConstantes.REMITOFACTURACOMPRATMP);
          register.setId(Cairo.Constants.NEW_ID);

          bSave = false;
          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            if(getCell(row, KII_SELECT).getId()) {
              bSave = true;
              switch (cell.getKey()) {
                case KII_RVI_ID:
                  register.getFields().add2(mComprasConstantes.RCI_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KII_APLICAR:
                  register.getFields().add2(mComprasConstantes.RC_FC_CANTIDAD, cell.getValue(), Cairo.Constants.Types.double);
                  break;
              }
            }
          }

          if(bSave) {

            register.getFields().add2(mComprasConstantes.RC_FC_ID, 0, Cairo.Constants.Types.long);
            register.getFields().add2(mComprasConstantes.FC_TMPID, id, Cairo.Constants.Types.id);

            // Esto es muy importante ya que se usa para vincular el remitoCompraitem
            // con el nuevo FacturaCompraitem
            iOrden = iOrden + 1;
            register.getFields().add2(mComprasConstantes.FCI_ID, iOrden, Cairo.Constants.Types.long);

            register.getFields().setHaveLastUpdate(false);
            register.getFields().setHaveWhoModify(false);

            if(!Cairo.Database.save(register, , "pSaveVinculacion", C_MODULE, SAVE_ERROR_MESSAGE)) { return false; }
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
        //' Internos
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
        if(cpg_id != Cairo.Constants.NO_ID) {

          if(!Cairo.Database.getData(mComprasConstantes.CONDICIONPAGO, mComprasConstantes.CPG_ID, cpg_id, mComprasConstantes.CPG_NAME, cpg_nombre)) { return; }

          iProp = getCondicionPago();
          iProp.setValue(cpg_nombre);
          iProp.setSelectId(cpg_id);
          m_objWizard.showValue(iProp);
        }

        // Lista de precios
        iProp = getListaPrecio();
        iProp.setSelectFilter(GetListaPrecioGetXProveedor(m_lastDoc, m_lastProv));

        if(lp_id != Cairo.Constants.NO_ID) {
          lP = new cListaPrecio();
          iProp.setValue(lP.GetData(lp_id, mComprasConstantes.LP_NAME, Cairo.Constants.Types.text));
          iProp.setSelectId(lp_id);
        }

        m_objWizard.showValue(iProp);

        // Lista de descuentos
        iProp = getListaDescuento();
        iProp.setSelectFilter(GetListaDescGetXProveedor(m_lastDoc, m_lastProv));

        if(ld_id != Cairo.Constants.NO_ID) {
          lD = new cListaDescuento();
          iProp.setValue(lD.GetData(ld_id, mComprasConstantes.LD_NAME, Cairo.Constants.Types.text));
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
        w_getCentroCosto.setSelectId(Cairo.Constants.NO_ID);
        w_getCentroCosto.setValue("");
        var w_getCondicionPago = getCondicionPago();
        w_getCondicionPago.setSelectId(Cairo.Constants.NO_ID);
        w_getCondicionPago.setValue("");
        var w_getListaPrecio = getListaPrecio();
        w_getListaPrecio.setSelectId(Cairo.Constants.NO_ID);
        w_getListaPrecio.setValue("");
        var w_getListaDescuento = getListaDescuento();
        w_getListaDescuento.setSelectId(Cairo.Constants.NO_ID);
        w_getListaDescuento.setValue("");
        var w_getLegajo = getLegajo();
        w_getLegajo.setSelectId(Cairo.Constants.NO_ID);
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

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(rs.isEOF()) { return; }

        var iProp = null;

        while (!rs.isEOF()) {

          iProp = getSucursal();
          if(iProp.getSelectId() === Cairo.Constants.NO_ID && Cairo.Database.valField(rs.getFields(), mComprasConstantes.SUC_ID) != Cairo.Constants.NO_ID) {

            iProp.setSelectId(Cairo.Database.valField(rs.getFields(), mComprasConstantes.SUC_ID));
            iProp.setValue(Cairo.Database.valField(rs.getFields(), mComprasConstantes.SUC_NAME));
            m_objWizard.showValue(iProp);
          }

          iProp = getCondicionPago();
          if(iProp.getSelectId() === Cairo.Constants.NO_ID && Cairo.Database.valField(rs.getFields(), mComprasConstantes.CPG_ID) != Cairo.Constants.NO_ID) {

            iProp.setSelectId(Cairo.Database.valField(rs.getFields(), mComprasConstantes.CPG_ID));
            iProp.setValue(Cairo.Database.valField(rs.getFields(), mComprasConstantes.CPG_NAME));
            m_objWizard.showValue(iProp);
          }

          iProp = getCentroCosto();
          if(iProp.getSelectId() === Cairo.Constants.NO_ID && Cairo.Database.valField(rs.getFields(), mComprasConstantes.CCOS_ID) != Cairo.Constants.NO_ID) {

            iProp.setSelectId(Cairo.Database.valField(rs.getFields(), mComprasConstantes.CCOS_ID));
            iProp.setValue(Cairo.Database.valField(rs.getFields(), mComprasConstantes.CCOS_NAME));
            m_objWizard.showValue(iProp);
          }

          iProp = getLegajo();
          if(iProp.getSelectId() === Cairo.Constants.NO_ID && Cairo.Database.valField(rs.getFields(), mComprasConstantes.LGJ_ID) != Cairo.Constants.NO_ID) {

            iProp.setSelectId(Cairo.Database.valField(rs.getFields(), mComprasConstantes.LGJ_ID));
            iProp.setValue(Cairo.Database.valField(rs.getFields(), mComprasConstantes.LGJ_TITULO));
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
          if(!Cairo.Database.getData(mComprasConstantes.CONDICIONPAGO, mComprasConstantes.CPG_ID, m_lastCpgId, mComprasConstantes.CPG_ES_LIBRE, bEsLibre)) { return; }

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
            if(id === Cairo.Constants.NO_ID) {
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
            var apiPath = Cairo.Database.getAPIVersion();
            return Cairo.Database.destroy(apiPath + "general/facturacompraremitowiz", id, Cairo.Constants.DELETE_FUNCTION, "FacturaCompraRemitoWiz").success(
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
