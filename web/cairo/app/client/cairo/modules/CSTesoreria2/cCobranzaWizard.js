(function() {
  "use strict";

  Cairo.module("CobranzaWizard.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      var getText = Cairo.Language.getText;

      var C_MODULE = "cCobranzaWizard";

      var SAVE_ERROR_MESSAGE = getText(2098, ""); // Error al grabar la Cobranza

      var P = Cairo.Promises;
      var NO_ID = Cairo.Constants.NO_ID;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var CC = Cairo.Compras.Constants;
      var Types = Cairo.Constants.Types;
      var valField = DB.valField;
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

      var C_CUOTAS = "Cuotas";

      var C_LABELCOBROS = "LabelCobros";

      var KI_IMPORTE = 1;
      var KI_FV_ID = 2;
      var KI_SELECT = 3;
      var KI_FECHA = 4;
      var KI_APLICAR = 5;
      var KI_DESCRIP = 6;
      var KI_DOC = 7;
      var KI_PENDIENTE = 8;
      var KI_VTO = 9;
      var KI_TOTAL = 10;
      var KI_COTIZACION = 11;
      var KI_NRODOC = 12;
      var KI_IMPORTEORIGEN = 13;
      var KI_MONEDA = 14;
      var KI_COTIZACION2 = 15;
      var KI_FVD_ID = 16;

      var KIO_CUE_ID = 2;
      var KIO_DEBE = 3;
      var KIO_HABER = 4;
      var KIO_IMPORTEORIGEN = 5;
      var KIO_DESCRIP = 6;
      var KIO_RET_ID = 7;
      var KIO_NRORETENCION = 8;
      var KIO_PORCRETENCION = 9;
      var KIO_FECHARETENCION = 10;
      var KIO_CCOS_ID = 11;
      var KIO_FV_ID_RET = 12;

      var KICH_CUE_ID = 2;
      var KICH_IMPORTE = 3;
      var KICH_IMPORTEORIGEN = 4;
      var KICH_BCO_ID = 5;
      var KICH_CHEQUE = 6;
      var KICH_MON_ID = 7;
      var KICH_FECHACOBRO = 8;
      var KICH_FECHAVTO = 9;
      var KICH_CLE_ID = 10;
      var KICH_DESCRIP = 11;
      var KICH_PROPIO = 12;

      var KIE_CUE_ID = 2;
      var KIE_MON_ID = 3;
      var KIE_IMPORTE = 4;
      var KIE_IMPORTEORIGEN = 5;
      var KIE_DESCRIP = 6;

      var KIT_CUPON = 2;
      var KIT_TJC_ID = 3;
      var KIT_IMPORTE = 4;
      var KIT_IMPORTEORIGEN = 5;
      var KIT_FECHAVTO = 7;
      var KIT_NROTARJETA = 8;
      var KIT_NROAUTORIZACION = 9;
      var KIT_TITULAR = 10;
      var KIT_MON_ID = 11;
      var KIT_DESCRIP = 12;
      var KIT_TARJETA_TIPO = 13;
      var KIT_TJCCU_ID = 14;

      var KICC_CUE_ID = 2;
      var KICC_IMPORTE = 3;
      var KICC_IMPORTEORIGEN = 4;

      var C_WIZARDTITLE = "Asistente de cobranzas";

      var c_NCNDDescripDifCambio = "";
      var c_LabelCobrosText = "";

      var m_objWizard;
      var m_wizardProcessing;
      var m_wizardCancel;

      var m_bDifCambio;

      var m_tesoreriaConfig;
      var m_generalConfig;

      var m_monDefault = 0;

      var m_id = 0;

      var m_iOrden = 0;

      var m_cliId = 0;
      var m_cliente = "";

      var m_cliIdDoc = 0;
      var m_clienteDoc = "";

      var m_fvIds = 0;

      var m_cliIds = 0;
      var m_fvIdsxCliId = 0;
      var m_cobranzaInfo;
      var m_isHojaRuta;
      var m_cjId = 0;

      var m_lColCuotas = 0;

      var m_objClient = null;

      var m_lastDoc = 0;
      var m_lastCli = 0;

      var m_lastNroDoc = "";

      var m_nextCliIdIndex = 0;
      var m_bUseCliIds;

      var m_bAutoSelect;
      var m_bWizWasClosed;

      var m_bVirtualNextStopInPagos;
      var m_bRestarVirtualPush;

      self.getId = function() {
        return m_id;
      };

      self.setCliId = function(value) {
        m_cliId = value;
      };

      self.setCliente = function(value) {
        m_cliente = value;
      };

      self.setFvIds = function(value) {
        m_fvIds = value.slice();
      };

      self.setCliIds = function(value) {
        m_cliIds = value.slice();
      };

      self.setFvIdsxCliId = function(value) {
        m_fvIdsxCliId = value.slice();
      };

      self.setObjClient = function(value) {
        m_objClient = value;
      };

      self.setCobranzaInfo = function(value) {
        m_cobranzaInfo = value;
      };

      self.setIsHojaRuta = function(value) {
        // only check for true because if the caller uses false
        // the value is taken from tesoreria general config
        //
        if(value) {
          m_isHojaRuta = value;
        }
      };

      self.load = function() {
        var _rtn = null;
        try {

          if(m_isHojaRuta) {

            if(!pLoadCajaForUsuario()) { return _rtn; }

          }

          _rtn = true;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, C_LoadFunction, C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      self.messageEx = function(messageID,  info) {
        var _rtn = null;

        _rtn = true;

        switch (messageID) {

          case Dialogs.Message.MSG_GRID_ROW_DELETED:

            switch (info) {
              case KW_CHEQUES:
              case KW_EFECTIVO:
              case KW_TARJETAS:
                pShowCobroNeto();
                break;

              case KW_OTROS:
                pShowCobroOtro();
                break;
            }
            pShowCobroTotal();

            break;
        }


        return _rtn;
      };

      // Implementacion de cIABMClientGrid
      var isEmptyRow = function(key,  row,  rowIndex) {
        var _rtn = null;
        try {

          switch (key) {
            case KW_FACTURAS:
              _rtn = false;
              break;

            case KW_CHEQUES:
              _rtn = pIsEmptyRowCheques(row, rowIndex);
              break;

            case KW_TARJETAS:
              _rtn = pIsEmptyRowTarjetas(row, rowIndex);
              break;

            case KW_OTROS:
              _rtn = pIsEmptyRowOtros(row, rowIndex);
              break;

            case KW_EFECTIVO:
              _rtn = pIsEmptyRowEfectivo(row, rowIndex);
              break;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "validateRow", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var columnAfterUpdate = function(key,  lRow,  lCol) {
        var _rtn = null;
        try {

          switch (key) {
            case KW_FACTURAS:
              _rtn = pColAUpdateFactura(pGetFacturasProperty(), lRow, lCol);
              break;

            case KW_CHEQUES:
              _rtn = pColAUpdateCheque(pGetChequesProperty(), lRow, lCol);
              break;

            case KW_TARJETAS:
              _rtn = pColAUpdateTarjeta(pGetTarjetasProperty(), lRow, lCol);
              break;

            case KW_OTROS:
              _rtn = pColAUpdateOtro(pGetOtrosProperty(), lRow, lCol);
              break;

            case KW_EFECTIVO:
              _rtn = pColAUpdateEfectivo(pGetEfectivoProperty(), lRow, lCol);
              break;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "columnAfterUpdate", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var columnAfterEdit = function(key,  lRow,  lCol,  newValue,  newValueID) {
        var _rtn = null;
        try {

          switch (key) {
            case KW_FACTURAS:
              _rtn = true;
              break;

            case KW_CHEQUES:
              _rtn = true;
              break;

            case KW_TARJETAS:
              _rtn = true;
              break;

            case KW_OTROS:
              _rtn = true;
              break;

            case KW_EFECTIVO:
              _rtn = true;
              break;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "columnAfterEdit", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var columnBeforeEdit = function(key,  lRow,  lCol,  iKeyAscii) {
        var _rtn = null;
        try {

          switch (key) {
            case KW_FACTURAS:
              _rtn = pColBEditFacturas(pGetFacturasProperty(), lRow, lCol, iKeyAscii);
              break;

            case KW_CHEQUES:
              _rtn = true;
              break;

            case KW_TARJETAS:
              _rtn = pColBeforeEditTarjeta(key, lRow, lCol, iKeyAscii);
              break;

            case KW_OTROS:
              _rtn = true;
              break;

            case KW_EFECTIVO:
              _rtn = true;
              break;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "columnBeforeEdit", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var pColBeforeEditTarjeta = function(key,  lRow,  lCol,  iKeyAscii) {
        var row = null;
        var property = null;
        var wizObj = null;

        wizObj = m_objWizard;
        property = wizObj.getObjAbm().getProperties().item(DWC.TARJETAS);
        var w_grid = property.getGrid();
        switch (w_grid.getColumns(lCol).Key) {
          case KIT_TJCCU_ID:
            row = w_grid.getRows(lRow);
            mPublic.self.setFilterCuotas(row, property, wizObj.getObjAbm(), KIT_TJC_ID);
            break;
        }
        return true;
      };

      var columnButtonClick = function(key,  lRow,  lCol,  iKeyAscii) {

      };

      var columnClick = function(key,  lRow,  lCol) {

      };

      var dblClick = function(key,  lRow,  lCol) {
        try {

          switch (key) {

            case KW_FACTURAS:

              var w_pGetFacturas = pGetFacturas().getRows();
              ShowDocAux(Dialogs.cell(w_pGetFacturas.Item(lRow), KI_FV_ID).getID(), "CSVenta2.cFacturaVenta", "CSABMInterface2.cABMGeneric");

              break;
          }

          return;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "dblClick", C_MODULE, "");
        }
      };

      var deleteRow = function(key,  row,  lRow) {
        var _rtn = null;
        var id = null;

        switch (key) {
          case KW_FACTURAS:
            break;

          default:
            _rtn = true;
            break;
        }

        return _rtn;
      };

      var listAdHock = function(key,  row,  colIndex,  list) {

      };

      var newRow = function(key,  rows) {

      };

      var validateRow = function(key,  row,  rowIndex) {
        var _rtn = null;
        try {

          switch (key) {
            case KW_FACTURAS:
              _rtn = true;
              break;

            case KW_CHEQUES:
              _rtn = pValidateRowCheques(row, rowIndex);
              break;

            case KW_TARJETAS:
              _rtn = pValidateRowTarjetas(row, rowIndex);
              break;

            case KW_OTROS:
              _rtn = pValidateRowOtros(row, rowIndex);
              break;

            case KW_EFECTIVO:
              _rtn = pValidateRowEfectivo(row, rowIndex);
              break;

            case KW_CTA_CTE:
              _rtn = true;
              break;
          }

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "validateRow", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var pColBEditFacturas = function(property,  lRow,  lCol,  iKeyAscii) { // TODO: Use of ByRef founded Private Function pColBEditFacturas(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long, ByVal iKeyAscii As Integer)
        switch (cABMUtil.pGetKeyFromCol(property.getGrid().getColumns(), lCol)) {
          // Facturas
          case KI_APLICAR:
          case KI_SELECT:
          case KI_COTIZACION2:
            break;

          default:
            return null;
            break;
        }

        return true;
      };

      var pCol = function(columns,  key) { // TODO: Use of ByRef founded Private Function pCol(ByRef Columns As cIABMGridColumns, ByVal Key As Long) As cIABMGridColumn
        var col = null;
        var _count = columns.size();
        for (var _i = 0; _i < _count; _i++) {
          col = columns.item(_i);
          if(col.getKey() === key) {
            return col;
          }
        }
      };

      var pColAUpdateFactura = function(property,  lRow,  lCol) { // TODO: Use of ByRef founded Private Function pColAUpdateFactura(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long) As Boolean
        var row = null;
        var maxVal = null;
        var bVisible = null;

        var w_grid = property.getGrid();
        switch (w_grid.getColumns(lCol).Key) {
          case KI_SELECT:
            row = w_grid.getRows(lRow);
            pSelectFactura(row, w_grid.getColumns());
            pShowTotalFacturas();
            break;

          case KI_COTIZACION2:
            var cotiz = null;
            row = w_grid.getRows(lRow);
            cotiz = Cairo.Util.val(Dialogs.cell(row, KI_COTIZACION2).getValue());
            if(pCol(w_grid.getColumns(), KI_IMPORTE).getVisible()) {
              var w_pCell = Dialogs.cell(row, KI_IMPORTE);
              w_pCell.setValue(Dialogs.cell(row, KI_IMPORTEORIGEN).getValue() * cotiz);
            }
            else {
              var w_pCell = Dialogs.cell(row, KI_PENDIENTE);
              w_pCell.setValue(Dialogs.cell(row, KI_IMPORTEORIGEN).getValue() * cotiz);
            }
            break;

          case KI_APLICAR:
            row = w_grid.getRows(lRow);
            bVisible = pCol(w_grid.getColumns(), KI_IMPORTE).getVisible();
            var w_pCell = Dialogs.cell(row, KI_APLICAR);
            if(bVisible) {
              maxVal = Cairo.Util.val(Dialogs.cell(row, KI_IMPORTE).getValue());
              if(Cairo.Util.val(w_pCell.getValue()) > maxVal) {
                w_pCell.setValue(maxVal);
              }
              else if(Cairo.Util.val(w_pCell.getValue()) < 0) {
                w_pCell.setValue(0);
              }
            }
            else {
              maxVal = Cairo.Util.val(Dialogs.cell(row, KI_PENDIENTE).getValue());
              if(Cairo.Util.val(w_pCell.getValue()) > maxVal) {
                w_pCell.setValue(maxVal);
              }
              else if(Cairo.Util.val(w_pCell.getValue()) < 0) {
                w_pCell.setValue(0);
              }
            }
            pShowTotalFacturas();
            break;
        }

        return true;
      };

      var pColAUpdateCheque = function(property,  lRow,  lCol) { // TODO: Use of ByRef founded Private Function pColAUpdateCheque(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long) As Boolean
        var _rtn = null;
        var row = null;
        var value = null;

        var w_grid = property.getGrid();
        switch (w_grid.getColumns(lCol).Key) {
          case KICH_IMPORTEORIGEN:
            row = w_grid.getRows(lRow);
            var w_pCell = Dialogs.cell(row, KICH_MON_ID);
            if(w_pCell.getID() !== m_monDefault || w_pCell.getID() === 0) {
              Dialogs.cell(row, KICH_IMPORTE).getValue() === Cairo.Util.val(Dialogs.cell(row, KICH_IMPORTEORIGEN).getValue()) * Cairo.Util.val(pGetCotizacion().getValue());
            }
            else {
              Dialogs.cell(row, KICH_IMPORTEORIGEN).getValue() === 0;
            }
            break;

          case KICH_IMPORTE:

            break;

          case KICH_CUE_ID:
            var monId = null;
            var moneda = null;
            row = w_grid.getRows(lRow);
            GetMonedaFromCuenta(monId, moneda, Dialogs.cell(row, KICH_CUE_ID).getID());
            var w_pCell = Dialogs.cell(row, KICH_MON_ID);
            w_pCell.setValue(moneda);
            w_pCell.setID(monId);

            if(monId === m_monDefault || monId === 0) {
              Dialogs.cell(row, KICH_IMPORTEORIGEN).getValue() === 0;
            }

            if(Cairo.Util.val(Dialogs.cell(row, KICH_IMPORTE).getValue()) === 0) {
              Dialogs.cell(row, KICH_IMPORTE).getValue() === Cairo.Util.val(pGetTotal().getValue()) - Cairo.Util.val(pGetCobroTotal().getValue());
              pShowCobroNeto();
              pShowCobroTotal();
            }

            _rtn = true;
            return _rtn;

            break;

          case KICH_FECHACOBRO:
            row = w_grid.getRows(lRow);
            var w_pCell = Dialogs.cell(row, KICH_FECHACOBRO);
            if(IsDate(w_pCell.getValue())) {
              Dialogs.cell(row, KICH_FECHAVTO).getValue() === DateAdd("m", 1, w_pCell.getValue());
            }

            break;

          default:
            _rtn = true;
            return _rtn;
            break;
        }

        pShowCobroNeto();
        pShowCobroTotal();
        _rtn = true;

        return _rtn;
      };

      var pColAUpdateTarjeta = function(property,  lRow,  lCol) { // TODO: Use of ByRef founded Private Function pColAUpdateTarjeta(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long) As Boolean
        var _rtn = null;
        var row = null;
        var value = null;

        var w_grid = property.getGrid();
        switch (w_grid.getColumns(lCol).Key) {
          case KIT_IMPORTEORIGEN:
            row = w_grid.getRows(lRow);
            Dialogs.cell(row, KIT_IMPORTE).getValue() === Cairo.Util.val(Dialogs.cell(row, KIT_IMPORTEORIGEN).getValue()) * Cairo.Util.val(pGetCotizacion().getValue());
            break;

          case KIT_IMPORTE:

            break;

          case KIT_TJC_ID:
            var tjcId = null;
            var wizObj = null;
            var abmObj = null;

            wizObj = m_objWizard;
            abmObj = wizObj.getObjAbm();
            row = w_grid.getRows(lRow);

            tjcId = Dialogs.cell(row, KIT_TJC_ID).getID();
            //IProperty.Grid.Columns(c_Cuotas).HelpFilter = "tjc_id = " & TjcId
            //AbmObj.RefreshColumnProperties IProperty, c_Cuotas
            mPublic.self.setFilterCuotas(row, property, abmObj, KIT_TJC_ID);

            var w_pCell = Dialogs.cell(row, KIT_TJCCU_ID);
            if(!mPublic.self.validateCuota(tjcId, w_pCell.getID())) {
              w_pCell.setID(Cairo.Constants.NO_ID);
              w_pCell.setValue("");
              abmObj.ShowCellValue(property, lRow, m_lColCuotas);
            }

            if(Cairo.Util.val(Dialogs.cell(row, KIT_IMPORTE).getValue()) === 0) {
              Dialogs.cell(row, KIT_IMPORTE).getValue() === Cairo.Util.val(pGetTotal().getValue()) - Cairo.Util.val(pGetCobroTotal().getValue());
              pShowCobroNeto();
              pShowCobroTotal();
            }

            _rtn = true;
            return _rtn;
            break;

          default:
            _rtn = true;
            return _rtn;
            break;
        }

        pShowCobroNeto();
        pShowCobroTotal();
        _rtn = true;

        return _rtn;
      };

      var pColAUpdateEfectivo = function(property,  lRow,  lCol) { // TODO: Use of ByRef founded Private Function pColAUpdateEfectivo(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long) As Boolean
        var _rtn = null;
        var row = null;
        var value = null;

        var w_grid = property.getGrid();
        switch (w_grid.getColumns(lCol).Key) {
          case KIE_IMPORTEORIGEN:
            row = w_grid.getRows(lRow);
            var w_pCell = Dialogs.cell(row, KIE_MON_ID);
            if(w_pCell.getID() !== m_monDefault || w_pCell.getID() === 0) {
              Dialogs.cell(row, KIE_IMPORTE).getValue() === Cairo.Util.val(Dialogs.cell(row, KIE_IMPORTEORIGEN).getValue()) * Cairo.Util.val(pGetCotizacion().getValue());
            }
            else {
              Dialogs.cell(row, KIE_IMPORTEORIGEN).getValue() === 0;
            }
            break;

          case KIE_IMPORTE:

            break;

          case KIE_CUE_ID:
            var monId = null;
            var moneda = null;
            row = w_grid.getRows(lRow);
            GetMonedaFromCuenta(monId, moneda, Dialogs.cell(row, KIE_CUE_ID).getID());
            var w_pCell = Dialogs.cell(row, KIE_MON_ID);
            w_pCell.setValue(moneda);
            w_pCell.setID(monId);

            if(monId === m_monDefault || monId === 0) {
              Dialogs.cell(row, KIE_IMPORTEORIGEN).getValue() === 0;
            }

            if(Cairo.Util.val(Dialogs.cell(row, KIE_IMPORTE).getValue()) === 0) {
              Dialogs.cell(row, KIE_IMPORTE).getValue() === Cairo.Util.val(pGetTotal().getValue()) - Cairo.Util.val(pGetCobroTotal().getValue());
              pShowCobroNeto();
              pShowCobroTotal();
            }

            _rtn = true;
            return _rtn;
            break;

          default:
            _rtn = true;
            return _rtn;
            break;
        }

        pShowCobroNeto();
        pShowCobroTotal();
        _rtn = true;

        return _rtn;
      };

      var pColAUpdateOtro = function(property,  lRow,  lCol) { // TODO: Use of ByRef founded Private Function pColAUpdateOtro(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long) As Boolean
        var _rtn = null;
        var row = null;
        var value = null;

        var w_grid = property.getGrid();
        switch (w_grid.getColumns(lCol).Key) {
          case KIO_DEBE:
            row = w_grid.getRows(lRow);
            Dialogs.cell(row, KIO_IMPORTEORIGEN).getValue() === Cairo.Util.val(Dialogs.cell(row, KIO_DEBE).getValue());
            Dialogs.cell(row, KIO_HABER).getValue() === 0;
            break;

          case KIO_HABER:
            row = w_grid.getRows(lRow);
            Dialogs.cell(row, KIO_IMPORTEORIGEN).getValue() === Cairo.Util.val(Dialogs.cell(row, KIO_HABER).getValue());
            Dialogs.cell(row, KIO_DEBE).getValue() === 0;
            break;

          default:
            _rtn = true;
            return _rtn;
            break;
        }

        pShowCobroOtro();
        pShowCobroTotal();
        _rtn = true;

        return _rtn;
      };

      var pSelectAllFactura = function(bSelect) {
        var row = null;

        var w_pGetFacturas = pGetFacturas();
        var _count = w_pGetFacturas.getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = w_pGetFacturas.getRows().item(_i);
          Dialogs.cell(row, KI_SELECT).getID() === Integer.parseInt(bSelect);
          pSelectFactura(row, w_pGetFacturas.getColumns());
        }

        #If PREPROC_SFS Then;
        var objWizard = null;
        #Else;
        var objWizard = null;
        #End If;

        objWizard = m_objWizard;
        objWizard.ShowValue(pGetFacturasProperty(), true);
      };

      var pRefreshCotizacion = function(takeFromCotizCtrl) {
        var row = null;
        var cotiz = null;

        cotiz = pGetCotizacion().getValue();

        var w_pGetFacturas = pGetFacturas();
        var _count = w_pGetFacturas.getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = w_pGetFacturas.getRows().item(_i);
          if(Cairo.Util.val(Dialogs.cell(row, KI_IMPORTEORIGEN).getValue())) {

            if(takeFromCotizCtrl) {
              Dialogs.cell(row, KI_COTIZACION2).getValue() === cotiz;
            }
            else {
              cotiz = Cairo.Util.val(Dialogs.cell(row, KI_COTIZACION2).getValue());
            }

            if(pCol(w_pGetFacturas.getColumns(), KI_IMPORTE).getVisible()) {
              var w_pCell = Dialogs.cell(row, KI_IMPORTE);
              w_pCell.setValue(Dialogs.cell(row, KI_IMPORTEORIGEN).getValue() * cotiz);
            }
            else {
              var w_pCell = Dialogs.cell(row, KI_PENDIENTE);
              w_pCell.setValue(Dialogs.cell(row, KI_IMPORTEORIGEN).getValue() * cotiz);
            }
            pSelectFactura(row, w_pGetFacturas.getColumns());
          }
        }

        m_objWizard.showValue(pGetFacturasProperty());
      };

      var pSelectFactura = function(row,  columns) { // TODO: Use of ByRef founded Private Sub pSelectFactura(ByRef Row As cIABMGridRow, ByRef Columns As cIABMGridColumns)
        var bVisible = null;
        bVisible = pCol(columns, KI_IMPORTE).getVisible();
        var w_pCell = Dialogs.cell(row, KI_APLICAR);
        if(Dialogs.cell(row, KI_SELECT).getID()) {
          if(Cairo.Util.val(w_pCell.getValue()) === 0) {
            if(bVisible) {
              w_pCell.setValue(Dialogs.cell(row, KI_IMPORTE).getValue());
            }
            else {
              w_pCell.setValue(Dialogs.cell(row, KI_PENDIENTE).getValue());
            }
          }
        }
        else {
          w_pCell.setValue(0);
        }
      };

      var pValidateAnticipo = function() {
        if(Cairo.Util.val(pGetAnticipo().getValue()) < 0) {
          pGetAnticipo().setValue(0);
        }
        m_objWizard.showValue(pGetAnticipo());
      };

      var pShowCobroNeto = function() {
        var row = null;
        var total = null;

        var _count = pGetCheques().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetCheques().getRows().item(_i);
          total = total + Cairo.Util.val(Dialogs.cell(row, KICH_IMPORTE).getValue());
        }

        var _count = pGetEfectivo().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetEfectivo().getRows().item(_i);
          total = total + Cairo.Util.val(Dialogs.cell(row, KIE_IMPORTE).getValue());
        }

        var _count = pGetTarjetas().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetTarjetas().getRows().item(_i);
          total = total + Cairo.Util.val(Dialogs.cell(row, KIE_IMPORTE).getValue());
        }

        pGetCobroNeto().setValue(total);
        m_objWizard.showValue(pGetCobroNeto());
      };

      var pShowCobroOtro = function() {
        var row = null;
        var total = null;

        var _count = pGetOtros().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetOtros().getRows().item(_i);
          total = total + Cairo.Util.val(Dialogs.cell(row, KIO_DEBE).getValue()) - Cairo.Util.val(Dialogs.cell(row, KIO_HABER).getValue());
        }

        pGetCobroOtros().setValue(total);
        m_objWizard.showValue(pGetCobroOtros());
      };

      var pShowCobroTotal = function() {
        pGetCobroTotal().setValue(Cairo.Util.val(pGetCobroNeto().getValue()) + Cairo.Util.val(pGetCobroOtros().getValue()));
        m_objWizard.showValue(pGetCobroTotal());
      };

      var pShowAnticipo = function() {
        pGetAnticipoImporte().setValue(Cairo.Util.val(pGetAnticipo().getValue()));
        m_objWizard.showValue(pGetAnticipoImporte());
      };

      var pShowMonedaAnticipo = function(bShow) {
        var sqlstmt = null;
        var rs = null;
        var cue_id = null;
        var mon_id = null;
        var mon_nombre = null;

        cue_id = pGetCuentaAnticipo().getSelectId();
        if(cue_id !== Cairo.Constants.NO_ID) {
          sqlstmt = "select moneda.mon_id, mon_nombre from cuenta inner join moneda on cuenta.mon_id = moneda.mon_id where cue_id = "+ cue_id.toString();
          if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }
          if(!rs.isEOF()) {
            mon_id = rs.getFields(0).Value;
            mon_nombre = rs.getFields(1).Value;
          }
        }

        var w_pGetMonedaAnticipo = pGetMonedaAnticipo();
        w_pGetMonedaAnticipo.setSelectId(mon_id);
        w_pGetMonedaAnticipo.setValue(mon_nombre);

        if(bShow) {
          m_objWizard.showValue(pGetMonedaAnticipo());
        }

        var w_pGetCotizacionAnticipo = pGetCotizacionAnticipo();
        if(mon_id !== m_monDefault) {
          var moneda = null;
          moneda = new cMoneda();
          w_pGetCotizacionAnticipo.setEnabled(true);
          w_pGetCotizacionAnticipo.setValue(moneda.getCotizacion(mon_id, Date));
        }
        else {
          w_pGetCotizacionAnticipo.setValue(1);
          w_pGetCotizacionAnticipo.setEnabled(false);
        }

        if(bShow) {
          m_objWizard.showValue(pGetCotizacionAnticipo());
        }
      };

      var pShowTotalFacturas = function() {
        var row = null;
        var total = null;
        var totalOrigen = null;

        var _count = pGetFacturas().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetFacturas().getRows().item(_i);
          total = total + Cairo.Util.val(Dialogs.cell(row, KI_APLICAR).getValue());
          if(Cairo.Util.val(Dialogs.cell(row, KI_IMPORTEORIGEN).getValue()) !== 0) {
            totalOrigen = totalOrigen + Cairo.Util.val(Dialogs.cell(row, KI_APLICAR).getValue());
          }
        }

        pGetTotal().setValue(total + Cairo.Util.val(pGetAnticipo().getValue()));
        pGetTotalOrigen().setValue(DivideByCero(totalOrigen, Cairo.Util.val(pGetCotizacion().getValue())));

        m_objWizard.showValue(pGetTotal());
        m_objWizard.showValue(pGetTotalOrigen());
      };

      // Proposito: Obtiene la deuda en moneda extranjera a la cotizacion original de la operacion
      var pGetDeudaOrigen = function() {
        var row = null;
        var total = null;
        var decimalesCotiz = null;

        decimalesCotiz = Cairo.Settings.getCurrencyRateDecimals();

        var _count = pGetFacturas().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetFacturas().getRows().item(_i);
          total = total + DivideByCero(Cairo.Util.val(Dialogs.cell(row, KI_APLICAR).getValue()), Cairo.Util.round(Cairo.Util.val(Dialogs.cell(row, KI_COTIZACION2).getValue()), decimalesCotiz)) * Cairo.Util.val(Dialogs.cell(row, KI_COTIZACION).getValue());
        }

        return total;
      };

      // Obtiene los pesos cobrados por operaciones en moneda extranjera a la cotizacion de la cobranza
      var pGetCobrado = function() {
        var row = null;
        var total = null;

        var _count = pGetFacturas().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetFacturas().getRows().item(_i);

          // Solo si es moneda extranjera
          //
          if(Cairo.Util.val(Dialogs.cell(row, KI_COTIZACION).getValue())) {
            total = total + Cairo.Util.val(Dialogs.cell(row, KI_APLICAR).getValue());
          }
        }

        return total;
      };

      // Implementacion de cIWizardClient
      var getCIWizardClient_Aplication = function() {
        return Cairo.appName;
      };

      var cIWizardClient_ListAdHock = function(list) {

      };

      var cIWizardClient_Load = function() {
        var _rtn = null;
        try {

          var wizObj = null;
          wizObj = m_objWizard;
          // Autorun
          m_bAutoSelect = wizObj.getPushVirtualNext();

          #If !PREPROC_SFS Then;
          pSetObjectForm();
          #End If;

          m_objWizard.getEditGeneric().setHideTitle(true);
          _rtn = loadSteps();

          return _rtn;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "cIWizardClient_Load", C_MODULE, "");
        }

        return _rtn;
      };

      var setCIWizardClient_ObjWizard = function(value) {
        m_objWizard = value;

        if(value !== null) {
          var objWiz = null;
          objWiz = value;
          objWiz.setObjClientObj(self);
        }
      };

      var getCIWizardClient_ObjWizard = function() {
        return m_objWizard;
      };

      var cIWizardClient_Work = function(currentStep,  goingToNext) {
        var _rtn = null;
        try {

          switch (currentStep) {
            case -1:

              break;

            case WCS.WELCOME:
              // First step, Disable back
              m_objWizard.getCmdBack().Enabled = false;

              break;

            case WCS.SELECT_COBROS:
              if(goingToNext) {
                if(!pGetCuentasDeudor()) { return _rtn; }
                pSetFilterColFactura();
                pRefreshLabelPagos();
              }

              break;

            case WCS.DATOS_GENERALES:
              pSetDatosGenerales();

              break;
          }

          _rtn = true;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "cIWizardClient_Work", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var cIWizardClient_NextStep = function(nCurrentStep,  nNextStep) {
        var _rtn = null;
        try {

          switch (nCurrentStep) {

            // Este paso es el primero que se recibe
            // su proposito es darle una oportunidad al cliente del wizard
            // de indicar cual es el primer paso
            case -1:
              nNextStep = WCS.WELCOME;
              m_objWizard.getCmdBack().Enabled = false;

              break;

            case WCS.WELCOME:
              nNextStep = WCS.SELECT_CLIENTE;
              m_objWizard.getCmdNext().Caption = Cairo.Constants.c_WizStr_Next;
              m_objWizard.getCmdBack().Enabled = false;

              // Cada vez que paso por aca activo este flag
              // para detenerme en pagos sin mostrar un cartel
              //
              m_bVirtualNextStopInPagos = true;
              m_bRestarVirtualPush = false;

              break;

            case WCS.SELECT_CLIENTE:

              if(pGetDoc() === Cairo.Constants.NO_ID) {
                //'Cobranzas
                MsgWarning(getText(1562, ""), getText(2128, ""));
                //Debe indicar un documento
                nNextStep = WCS.SELECT_CLIENTE;
              }
              else if(pGetCliente() === Cairo.Constants.NO_ID) {
                //'Cobranzas
                MsgWarning(getText(1563, ""), getText(2128, ""));
                //Debe indicar un cliente
                nNextStep = WCS.SELECT_CLIENTE;
              }
              else if(!pLoadFacturasXCliente()) {
                //'Cobranzas
                MsgWarning(getText(2129, ""), getText(2128, ""));
                //No se pudieron cargar las facturas para este cliente
                nNextStep = WCS.SELECT_CLIENTE;
              }
              else {
                pGetTodos().setName(Cairo.Constants.c_selectall);
                m_objWizard.showValue(pGetTodos());
                m_objWizard.getCmdBack().Enabled = true;
                nNextStep = WCS.SELECT_FACTURA;
              }

              break;

            case WCS.SELECT_FACTURA:
              if(pChecFacturas()) {
                pShowAnticipo();
                nNextStep = WCS.ANTICIPO;
              }
              else {
                nNextStep = WCS.SELECT_FACTURA;
              }

              break;

            case WCS.ANTICIPO:
              if(pCheckAnticipo()) {
                if(m_bDifCambio) {
                  nNextStep = WCS.DIF_CAMBIO;
                }
                else {

                  pLoadVirtualNextCobros();

                  nNextStep = WCS.SELECT_COBROS;
                }
              }
              else {
                nNextStep = WCS.ANTICIPO;
              }

              break;

            case WCS.DIF_CAMBIO:

              pLoadVirtualNextCobros();

              nNextStep = WCS.SELECT_COBROS;

              break;

            case WCS.SELECT_COBROS:
              if(!pValidateCobro()) {
                nNextStep = WCS.SELECT_COBROS;
              }
              else {

                m_objWizard.getCmdBack().Enabled = true;
                m_objWizard.getCmdNext().Caption = Cairo.Constants.c_WizStr_Finish;

                nNextStep = WCS.DATOS_GENERALES;

                if(m_bAutoSelect) {

                  var wizObj = null;
                  wizObj = m_objWizard;

                  if(m_bRestarVirtualPush) {

                    wizObj.setRestartVirtualPush(true);

                  }
                }
              }

              break;

            case WCS.DATOS_GENERALES:

              if(pValidateDatosGenerales()) {

                if(pSave()) {

                  // Si esta en automatico no pasamos por la impresion,
                  // vamos directamente a crear un nuevo documento
                  //
                  if(m_bAutoSelect) {

                    cIWizardClient_PropertyChange(KW_NEW_DOC);
                    nNextStep = WCS.WELCOME;

                  }
                  else {

                    // PrintDoc
                    //
                    WizShowNewStep(m_objWizard, WCS.WELCOME, m_lastNroDoc);
                    nNextStep = WCS.WELCOME;

                  }

                }
                else {
                  nNextStep = WCS.DATOS_GENERALES;
                }
              }
              else {
                nNextStep = WCS.DATOS_GENERALES;
              }
              break;
          }

          _rtn = true;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "cIWizardClient_NextStep", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!

        return _rtn;
      };

      var cIWizardClient_PreviousStep = function(nCurrentStep,  nNextStep) {
        switch (nCurrentStep) {
          case WCS.WELCOME:
            nNextStep = WCS.WELCOME;

            break;

          case WCS.SELECT_CLIENTE:
            nNextStep = WCS.SELECT_CLIENTE;

            break;

          case WCS.SELECT_FACTURA:
            m_objWizard.getCmdBack().Enabled = false;
            nNextStep = WCS.SELECT_CLIENTE;

            break;

          case WCS.ANTICIPO:
            nNextStep = WCS.SELECT_FACTURA;

            break;

          case WCS.DIF_CAMBIO:
            nNextStep = WCS.ANTICIPO;

            break;

          case WCS.SELECT_COBROS:
            if(m_bDifCambio) {
              nNextStep = WCS.DIF_CAMBIO;
            }
            else {
              nNextStep = WCS.ANTICIPO;
            }

            break;

          case WCS.DATOS_GENERALES:
            m_objWizard.getCmdNext().Caption = Cairo.Constants.c_WizStr_Next;
            nNextStep = WCS.SELECT_COBROS;
            break;
        }

        return true;
      };

      var cIWizardClient_PropertyChange = function(key) {
        var _rtn = null;
        switch (key) {
          case KW_CANCEL:
            if(m_wizardProcessing) {
              m_wizardCancel = true;
            }
            else {
              _rtn = true;
            }

            break;

          case KW_CLOSE_WIZARD:
            // Finish, now close wizard
            m_objWizard.closeWizard();

            // PrintDoc
            //
            break;

          case KW_PRINT_DOC:
            WizPrintDocEx(m_id, m_lastDoc, cIABMProperty.getEmailFromCliente(m_lastCli));

            break;

          case KW_NEW_DOC:
            pSetMultyCliente();

            // Si el wizard se cerro no hay mas nada que hacer
            //
            if(!m_bWizWasClosed) {

              pNewEmptyProperties();
              WizNewDoc(m_objWizard, WCS.WELCOME);

            }

            break;

          case KW_VENCIDOS:
          case KW_AGRUPADOS:
            pLoadFacturasXCliente();
            break;

          case KW_COTIZACION:
            pRefreshCotizacion(true);
            pShowTotalFacturas();
            break;

          case KW_ANTICIPO:
            pValidateAnticipo();
            pShowTotalFacturas();
            break;

          case KW_TODOS:
            if(pGetTodos().getName() === Cairo.Constants.c_selectall) {
              pSelectAllFactura(true);
              pGetTodos().setName(Cairo.Constants.c_unselectall);
            }
            else {
              pSelectAllFactura(false);
              pGetTodos().setName(Cairo.Constants.c_selectall);
            }
            m_objWizard.showValue(pGetTodos());
            pShowTotalFacturas();
            break;

          case KW_CUENTA_ANTICIPO:
            pShowMonedaAnticipo(true);

            break;

          case KW_DOC_ID:
            m_lastDoc = pGetDoc();

            break;
        }

        return _rtn;
      };

      var cIWizardClient_Terminate = function() {
        var _rtn = null;
        _rtn = true;
        //Unload m_Resource
        //Set m_Resource = Nothing

        // Puede fallar y no importa
        // ya que no conozco si el
        // objecto Proveedor soporta
        // la interfaz
        // **TODO:** on error resume next found !!!

        m_objClient.SetWizardCompleteSuccess(m_id !== Cairo.Constants.NO_ID);

        // Autorun
        if(m_bAutoSelect) {
          m_objClient.TerminateWizard(Cairo.Constants.NO_ID);
        }
        else {
          m_objClient.TerminateWizard(m_id);
        }


        return _rtn;
      };

      var getCIWizardClient_Title = function() {
        return C_WIZARDTITLE;
      };

      // funciones friend
      // funciones privadas
      var loadSteps = function() {

        //If m_Resource Is Nothing Then Set m_Resource = New fResource

        #If PREPROC_SFS Then;
        var wizard = null;
        var abmObj = null;

        var sh = null;
        sh = m_objWizard.getEditGeneric().getShapeMain();

        sh.Move(0, 0, 9000, 7000);
        sh.BorderStyle = 0;
        sh.BackColor = vbWhite;

        var img = null;
        img = m_objWizard.getEditGeneric().getPicMain();

        img.Visible = false;

        #Else;
        var wizard = null;
        var abmObj = null;
        #End If;

        wizard = m_objWizard;
        abmObj = wizard.getObjAbm();
        abmObj.MinHeight = 7000;

        m_lastDoc = m_tesoreriaConfig.getDocIdCobranza();

        pSetMultyDoc();

        pLoadStepWelcome();
        pLoadStepSelectCliente();
        pLoadStepSelectFactura();
        pLoadStepAnticipo();
        pLoadStepDifCambio();
        pLoadStepSelectCobros();
        pLoadStepDatosGenerales();

        return true;
      };

      var pSetMultyDoc = function() {
        if(m_cliIds.Length > 0) {

          m_nextCliIdIndex = 1;
          m_bUseCliIds = true;
        }
        else {
          m_nextCliIdIndex = 0;
        }
      };

      var pSetMultyCliente = function() {

        if(m_nextCliIdIndex) {

          m_cliIdDoc = m_cliIds[m_nextCliIdIndex];
          m_clienteDoc = pGetCliNombre(m_cliIdDoc);

          m_nextCliIdIndex = m_nextCliIdIndex + 1;

          // Termine
          //
          if(m_nextCliIdIndex > m_cliIds.Length) {

            m_nextCliIdIndex = 0;

          }

        }
        else {

          if(m_bAutoSelect) {

            var wizObj = null;
            wizObj = m_objWizard;

            if(wizObj.getCloseWizardAfterSave()) {

              m_objWizard.closeWizard();

              m_bWizWasClosed = true;

            }

          }

          if(!m_bWizWasClosed) {

            m_bUseCliIds = false;
            m_clienteDoc = m_cliente;
            m_cliIdDoc = m_cliId;

          }

        }
      };

      var pGetCliNombre = function(cli_id) {
        var rtn = null;
        if(!Cairo.Database.getData(mTesoreriaConstantes.CLIENTE, mTesoreriaConstantes.CLI_ID, cli_id, mTesoreriaConstantes.CLI_NAME, rtn)) { return ""; }
        return rtn;
      };

      var setGridStepWelcome = function(property) {
        // La clave de los pasos debe ser la constante que los define
        // Esto es vital para que la navegacion funcione correctamente
        var elem = m_objWizard.getSteps().add(null, GetKey(WCS.WELCOME));
        var elem = elem.add(null);
        //.Name = vbNullString
        elem.Top = 0;
        elem.Left = 0;
        elem.TopNotChange = true;
        elem.LeftNotChange = true;
        elem.PropertyType = cspImage;
        elem.Value = 1;
        //Set .Picture = m_Resource.ImgWiz1.Picture

        var elem = elem.add(null, c_Wiz_Key_Title);
        //.Name = vbNullString
        elem.Top = 100;
        elem.Left = 2700;
        elem.TopNotChange = true;
        elem.LeftNotChange = true;
        elem.Height = 880;
        elem.Width = 7000;
        elem.PropertyType = cspTitle;
        //'Bienvenido al Asistente de Cobranza
        elem.Value = getText(2130, "");

        var elem = elem.add(null, c_Wiz_Key_MainTitle);
        elem.Top = 1200;
        elem.Left = 3000;
        //.Name = vbNullString
        elem.PropertyType = cspLabel;
        elem.Width = 6000;
        elem.Height = 880;
        elem.FontBold = true;
        elem.Value = getText(2131, "");
        //Con este Asistente usted podra generar los Recibos por Cobranzas.

        WizAddNewDocProperties(m_objWizard, WCS.WELCOME);

      };

      var setGridStepSelectCliente = function(property) {
        // La clave de los pasos debe ser la constante que los define
        // Esto es vital para que la navegacion funcione correctamente
        var elem = m_objWizard.getSteps().add(null, GetKey(WCS.SELECT_CLIENTE)).getProperties();
        //*TODO:** can't found type for with block
        //*With .Object.add(null)
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
        //*With .Object.add(null)
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
        w___TYPE_NOT_FOUND.Value = getText(2132, "");
        //Indique el documento a utilizar y el Cliente al que se le emitirá el Recibo

        //*TODO:** can't found type for with block
        //*With .Object.add(null, DWC.DOC)
        var w___TYPE_NOT_FOUND = elem.Add(null, DWC.DOC);
        w___TYPE_NOT_FOUND.Top = 1500;
        w___TYPE_NOT_FOUND.Left = 3700;
        //'Documento
        w___TYPE_NOT_FOUND.Name = getText(1567, "");
        w___TYPE_NOT_FOUND.PropertyType = cspHelp;
        w___TYPE_NOT_FOUND.HelpFilter = "'doct_id = "+ csEDocumentoTipo.cSEDT_COBRANZA.toString()+ "'";
        w___TYPE_NOT_FOUND.Table = CSDocumento2.CSDocumento;
        w___TYPE_NOT_FOUND.Width = 4000;
        w___TYPE_NOT_FOUND.Value = m_tesoreriaConfig.getDocCobranza();
        w___TYPE_NOT_FOUND.HelpId = m_tesoreriaConfig.getDocIdCobranza();
        w___TYPE_NOT_FOUND.Key = KW_DOC_ID;

        pSetMultyCliente();

        //*TODO:** can't found type for with block
        //*With .Object.add(null, DWC.CLIENTE)
        var w___TYPE_NOT_FOUND = elem.Add(null, DWC.CLIENTE);
        w___TYPE_NOT_FOUND.Top = 2000;
        w___TYPE_NOT_FOUND.Left = 3700;
        //'Cliente
        w___TYPE_NOT_FOUND.Name = getText(1150, "");
        w___TYPE_NOT_FOUND.PropertyType = cspHelp;
        w___TYPE_NOT_FOUND.Table = Cairo.Tables.CLIENTE;
        w___TYPE_NOT_FOUND.Width = 4000;
        w___TYPE_NOT_FOUND.Value = m_clienteDoc;
        w___TYPE_NOT_FOUND.HelpId = m_cliIdDoc;

        // Edit From ListDoc
        //
        //*TODO:** can't found type for with block
        //*With .Object.add(null, DWC.ONLY_SELECTED)
        var w___TYPE_NOT_FOUND = elem.Add(null, DWC.ONLY_SELECTED);
        w___TYPE_NOT_FOUND.PropertyType = cspCheck;
        //'Cargar sólo Facturas seleccionadas
        w___TYPE_NOT_FOUND.Name = getText(2133, "");
        w___TYPE_NOT_FOUND.Value = m_fvIds.Length;
        w___TYPE_NOT_FOUND.Left = 5310;
        w___TYPE_NOT_FOUND.LeftLabel = -2800;
      };

      var setGridStepSelectFactura = function(property) {
        // La clave de los pasos debe ser la constante que los define
        // Esto es vital para que la navegacion funcione correctamente
        var elem = m_objWizard.getSteps().add(null, GetKey(WCS.SELECT_FACTURA));
        var elem = elem.add(null);
        //.Name = vbNullString
        elem.Top = 100;
        elem.Left = 100;
        elem.TopNotChange = true;
        elem.LeftNotChange = true;
        elem.PropertyType = cspImage;
        elem.Value = 3;
        //Set .Picture = m_Resource.ImgWiz3.Picture

        var elem = elem.add(null);
        //.Name = vbNullString
        elem.Top = 400;
        elem.Left = 1500;
        elem.TopNotChange = true;
        elem.LeftNotChange = true;
        elem.Height = 880;
        elem.Width = 8000;
        elem.PropertyType = cspLabel;
        elem.FontBold = true;
        elem.Value = getText(2134, "");
        //Seleccione las Facturas he indique los importes que cancelará en cada una de ellas

        var elem = elem.add(null, DWC.AGRUPADOS);
        //'Agrupar
        elem.Name = getText(2135, "");
        elem.Top = 100;
        elem.Left = 11400;
        elem.LeftLabel = -700;
        elem.Width = 370;
        elem.PropertyType = cspCheck;
        elem.Key = KW_AGRUPADOS;

        var elem = elem.add(null, DWC.VENCIDOS);
        //'Ver solo vencidos
        elem.Name = getText(2136, "");
        elem.Top = 400;
        elem.Left = 11400;
        elem.LeftLabel = -1400;
        elem.Width = 370;
        elem.PropertyType = cspCheck;
        elem.Key = KW_VENCIDOS;

        var elem = elem.add(null, DWC.COTIZACION);
        //'Cotización
        elem.Name = getText(1635, "");
        elem.Top = 750;
        elem.Left = 10650;
        elem.LeftLabel = -1400;
        elem.Width = 1200;
        elem.PropertyType = cspNumeric;
        elem.Format = Cairo.Settings.getCurrencyRateDecimalsFormat();
        elem.SubType = cspMoney;
        elem.Key = KW_COTIZACION;

        var elem = elem.add(null, DWC.FACTUAS);
        elem.Top = 1100;
        elem.Left = 150;
        //.Name = vbNullString
        elem.PropertyType = cspGrid;
        elem.LeftLabel = -1;
        pLoadFacturas(elem.Grid);
        elem.Width = 11500;
        elem.Height = 4400;
        elem.Key = KW_FACTURAS;
        elem.GridAdd = false;
        elem.GridEdit = true;
        elem.GridRemove = false;

        var elem = elem.add(null, DWC.TODOS);
        elem.Name = Cairo.Constants.c_selectall;
        elem.Top = 5550;
        elem.Left = 200;
        elem.LeftLabel = -1;
        elem.Width = 2200;
        elem.PropertyType = cspButton;
        elem.Key = KW_TODOS;

        var elem = elem.add(null, DWC.ANTICIPO);
        //'Anticipo
        elem.Name = getText(2137, "");
        elem.Top = 5550;
        elem.Left = 3500;
        elem.LeftLabel = -1000;
        elem.Width = 1800;
        elem.PropertyType = cspNumeric;
        elem.SubType = cspMoney;
        elem.Format = Cairo.Settings.getAmountDecimalsFormat();
        elem.Key = KW_ANTICIPO;

        var elem = elem.add(null, DWC.TOTAL_PAGO_ORIGEN);
        //'Total Origen
        elem.Name = getText(2138, "");
        elem.Top = 5550;
        elem.Left = 7000;
        elem.LeftLabel = -1000;
        elem.Width = 1800;
        elem.PropertyType = cspNumeric;
        elem.SubType = cspMoney;
        elem.Enabled = false;
        elem.Format = Cairo.Settings.getAmountDecimalsFormat();

        var elem = elem.add(null, DWC.TOTAL_PAGO);
        //'Total
        elem.Name = getText(1584, "");
        elem.Top = 5550;
        elem.Left = 9820;
        elem.LeftLabel = -600;
        elem.Width = 1800;
        elem.PropertyType = cspNumeric;
        elem.SubType = cspMoney;
        elem.Enabled = false;
        elem.Format = Cairo.Settings.getAmountDecimalsFormat();
      };

      var setGridFacturas = function(property) {
        var signo = null;

        // La primera simpre esta invisible
        var w_columns = grid.getColumns();

        w_columns.add(null).setVisible(false);

        var elem = w_columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_FVD_ID);

        var elem = w_columns.add(null);
        //.Name = vbNullString
        elem.setType(Dialogs.PropertyType.check);
        elem.setWidth(320);
        elem.setKey(KI_SELECT);

        var elem = w_columns.add(null);
        //'Tipo
        elem.setName(getText(1223, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1320);
        elem.setKey(KI_DOC);

        var elem = w_columns.add(null);
        //'Documento
        elem.setName(getText(1567, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1340);
        elem.setKey(KI_NRODOC);

        var elem = w_columns.add(null);
        //'Número
        elem.setName(getText(1065, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setWidth(800);
        elem.setKey(KI_FV_ID);

        var elem = w_columns.add(null);
        //'Fecha
        elem.setName(getText(1569, ""));
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(740);
        elem.setFormat("dd/mm/yy");
        elem.setKey(KI_FECHA);

        signo = pGetNomMonedaDefault();

        var elem = w_columns.add(null, DWC.MONEDA);
        //'Mon
        elem.setName(getText(2063, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(520);
        elem.setKey(KI_MONEDA);

        var elem = w_columns.add(null);
        //'Origen
        elem.setName(getText(1901, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KI_IMPORTEORIGEN);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());

        var elem = w_columns.add(null, DWC.COTIZACION);
        //'Cotiz.
        elem.setName(getText(1650, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(570);
        elem.setKey(KI_COTIZACION);
        elem.setFormat(Cairo.Settings.getCurrencyRateDecimalsFormat());

        var elem = w_columns.add(null);
        elem.setName(signo);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KI_TOTAL);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());

        var elem = w_columns.add(null, DWC.COTIZACION2);
        //'Cotiz.
        elem.setName(getText(1650, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(570);
        elem.setKey(KI_COTIZACION2);
        elem.setVisible(false);
        elem.setFormat(Cairo.Settings.getCurrencyRateDecimalsFormat());

        var elem = w_columns.add(null);
        //'Vto.
        elem.setName(getText(1634, ""));
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(740);
        elem.setFormat("dd/mm/yy");
        elem.setKey(KI_VTO);

        var elem = w_columns.add(null, DWC.PENDIENTE);
        //'Importe  & Signo
        elem.setName(getText(2139, "", signo));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KI_PENDIENTE);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());

        var elem = w_columns.add(null, DWC.IMPORTE);
        //'Importe  & Signo
        elem.setName(getText(2139, "", signo));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KI_IMPORTE);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());

        var elem = w_columns.add(null);
        //'Aplicar
        elem.setName(getText(1662, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KI_APLICAR);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(3000);
        elem.setKey(KI_DESCRIP);
      };

      var setGridStepAnticipo = function(property) {
        // La clave de los pasos debe ser la constante que los define
        // Esto es vital para que la navegacion funcione correctamente
        var elem = m_objWizard.getSteps().add(null, GetKey(WCS.ANTICIPO));

        var elem = elem.add(null);
        //.Name = vbNullString
        elem.Top = 100;
        elem.Left = 100;
        elem.TopNotChange = true;
        elem.LeftNotChange = true;
        elem.PropertyType = cspImage;
        elem.Value = 3;
        //Set .Picture = m_Resource.ImgWiz3.Picture

        var elem = elem.add(null);
        //.Name = vbNullString
        elem.Top = 400;
        elem.Left = 1500;
        elem.TopNotChange = true;
        elem.LeftNotChange = true;
        elem.Height = 880;
        elem.Width = 8000;
        elem.PropertyType = cspLabel;
        elem.FontBold = true;
        //'Indique los datos del anticipo
        elem.Value = getText(2140, "");

        var elem = elem.add(null, DWC.CUENTA_ANTICIPO);
        elem.Left = 2800;
        elem.Width = 3000;
        elem.LeftLabel = -1500;
        elem.PropertyType = cspHelp;
        elem.Table = Cairo.Tables.CUENTA;
        elem.HelpFilter = "("+ mTesoreriaConstantes.CUEC_ID+ " = "+ csECuentaCategoria.cSECUECDEUDPORVENTAS.toString()+ " or "+ mTesoreriaConstantes.CUEC_ID+ " = "+ csECuentaCategoria.cSECUECDEPOSITOCUPONES.toString()+ ")and "+ GetHelpFilterCuenta();

        //'Cuenta
        elem.Name = getText(1267, "");

        elem.Value = m_tesoreriaConfig.getCueAnticipoCobz();
        elem.HelpId = m_tesoreriaConfig.getCue_id_ant_cobz();

        elem.Key = KW_CUENTA_ANTICIPO;

        var elem = elem.add(null, DWC.MONEDA_ANTICIPO);
        elem.Left = 2800;
        elem.Width = 3000;
        elem.LeftLabel = -1500;
        elem.PropertyType = cspHelp;
        elem.Table = Cairo.Tables.MONEDA;
        //'Moneda
        elem.Name = getText(1113, "");
        elem.Key = KW_MONEDA_ANTICIPO;
        elem.Enabled = false;

        var elem = elem.add(null, DWC.COTIZACION_ANTICIPO);
        elem.Left = 2800;
        elem.Width = 3000;
        elem.LeftLabel = -1500;
        //'Cotización
        elem.Name = getText(1635, "");
        elem.Format = Cairo.Settings.getCurrencyRateDecimalsFormat();
        elem.PropertyType = cspNumeric;
        elem.SubType = cspMoney;
        elem.Key = KW_COTIZACION_ANTICIPO;

        var elem = elem.add(null, DWC.ANTICIPO_IMPORTE);
        elem.Left = 2800;
        elem.Width = 3000;
        elem.LeftLabel = -1500;
        //'Importe
        elem.Name = getText(1228, "");
        elem.PropertyType = cspNumeric;
        elem.SubType = cspMoney;
        elem.Key = KW_IMPORTE_ANTICIPO;

        if(m_tesoreriaConfig.getCue_id_ant_cobz() !== Cairo.Constants.NO_ID) {
          pShowMonedaAnticipo(false);
        }

      };

      var setGridStepDifCambio = function(property) {
        // La clave de los pasos debe ser la constante que los define
        // Esto es vital para que la navegacion funcione correctamente
        var elem = m_objWizard.getSteps().add(null, GetKey(WCS.DIF_CAMBIO));

        var elem = elem.add(null);
        //.Name = vbNullString
        elem.Top = 100;
        elem.Left = 100;
        elem.TopNotChange = true;
        elem.LeftNotChange = true;
        elem.PropertyType = cspImage;
        elem.Value = 3;
        //Set .Picture = m_Resource.ImgWiz3.Picture

        var elem = elem.add(null);
        //.Name = vbNullString
        elem.Top = 400;
        elem.Left = 1500;
        elem.TopNotChange = true;
        elem.LeftNotChange = true;
        elem.Height = 880;
        elem.Width = 8000;
        elem.PropertyType = cspLabel;
        elem.FontBold = true;
        //'Indique como tratar las diferencias de cambio
        elem.Value = getText(2141, "");

        var elem = elem.add(null, DWC.DEFAULT_DIF_CAMBIO);
        elem.PropertyType = cspList;
        elem.Left = 2800;
        elem.Width = 3000;
        elem.LeftLabel = -1500;
        //'Utilizar
        elem.Name = getText(2286, "");
        elem.Key = KW_DEFALUT_DIF_CAMBIO;
        elem.ListWhoSetItem = csListItemData;
        elem.ListItemData = m_tesoreriaConfig.getDefaultDifCambio();
        var elem = elem.add(null);
        elem.Id = csEModoDifCambio.cSEDIF_CAMBIOCUENTA;
        //'Una cuenta contable
        elem.Value = getText(2142, "");
        var elem = elem.add(null);
        elem.Id = csEModoDifCambio.cSEDIF_CAMBIONCND;
        //'Una Nota de Débito o Crédito
        elem.Value = getText(2143, "");

        var elem = elem.add(null, DWC.CUE_ID_DIF_CAMBIO);
        elem.PropertyType = cspHelp;
        elem.Table = Cairo.Tables.CUENTA;
        elem.Left = 2800;
        elem.Width = 3000;
        elem.LeftLabel = -1500;
        //'Cuenta contable
        elem.Name = getText(2288, "");
        elem.Key = KW_CUE_ID_DIF_CAMBIO;
        elem.HelpId = m_tesoreriaConfig.getCueIdDifCambio();
        elem.Value = m_tesoreriaConfig.getCuentaDifCambio();

        var elem = elem.add(null, DWC.NC_DIF_CAMBIO);
        elem.PropertyType = cspHelp;
        elem.Table = CSDocumento2.CSDocumento;
        elem.Left = 2800;
        elem.Width = 3000;
        elem.LeftLabel = -1500;
        //'Nota de Crédito
        elem.Name = getText(2289, "");
        elem.Key = KW_DOC_ID_NC_DIF_CAMBIO;
        elem.HelpId = m_tesoreriaConfig.getDocIdNCDifCambio();
        elem.HelpFilter = "'doct_id = 7'";
        elem.Value = m_tesoreriaConfig.getDocNCDifCambio();

        var elem = elem.add(null, DWC.ND_DIF_CAMBIO);
        elem.PropertyType = cspHelp;
        elem.Table = CSDocumento2.CSDocumento;
        elem.Left = 2800;
        elem.Width = 3000;
        elem.LeftLabel = -1500;
        //'Nota de Débito
        elem.Name = getText(2230, "");
        elem.Key = KW_DOC_ID_ND_DIF_CAMBIO;
        elem.HelpId = m_tesoreriaConfig.getDocIdNDDifCambio();
        elem.HelpFilter = "'doct_id = 9'";
        elem.Value = m_tesoreriaConfig.getDocNDDifCambio();

        var elem = elem.add(null, DWC.PR_ID_DIF_CAMBIO);
        elem.PropertyType = cspHelp;
        elem.Table = Cairo.Tables.PRODUCTOVENTA;
        elem.Left = 2800;
        elem.Width = 3000;
        elem.LeftLabel = -1500;
        //'Artículo
        elem.Name = getText(1367, "");
        elem.Key = KW_PR_ID_DIF_CAMBIO;
        elem.HelpId = m_tesoreriaConfig.getPrIdDifCambio();
        elem.Value = m_tesoreriaConfig.getProductoDifCambio();

        var elem = elem.add(null, DWC.MODO_IVA_DIF_CAMBIO);
        elem.PropertyType = cspList;
        elem.Left = 2800;
        elem.Width = 5000;
        elem.LeftLabel = -1500;
        //'Tratamiento del IVA
        elem.Name = getText(2290, "");
        elem.Key = KW_MODO_IVA_DIF_CAMBIO;
        elem.ListWhoSetItem = csListItemData;
        elem.ListItemData = m_tesoreriaConfig.getModoIvaDifCambio();
        var elem = elem.add(null);
        elem.Id = csEModoIvaDifCambio.cSEDIFIVAIMPONIBLE;
        //'Tomar la diferencia de cambio como base imponible para el IVA
        elem.Value = getText(2144, "");
        var elem = elem.add(null);
        elem.Id = csEModoIvaDifCambio.cSEDIFIVANOIMPONIBLE;
        //'IVA incluido en la diferencia de cambio
        elem.Value = getText(2145, "");

        var elem = elem.add(null, DWC.FECHA_ND_NC);
        elem.PropertyType = cspDate;
        elem.Left = 2800;
        //'Fecha
        elem.Name = getText(1569, "");
        elem.Key = KW_FECHA_NDNC;
        elem.Value = Date;

        var elem = elem.add(null, DWC.APLICACION_ND);
        elem.PropertyType = cspList;
        elem.Left = 2800;
        elem.Width = 5000;
        elem.LeftLabel = -1500;
        //'Aplicación
        elem.Name = getText(2479, "");
        elem.Key = KW_APLICACION_DIF_CAMBIO;
        elem.ListWhoSetItem = csListItemData;
        elem.ListItemData = m_tesoreriaConfig.getAplicacionDifCambio();
        var elem = elem.add(null);
        elem.Id = csEAplicacionDifCambio.cSEDIFAPLICACION_ND;
        //'Cobrar la Nota de Débito y aplicar el resto a las Facturas
        elem.Value = getText(2480, "");
        var elem = elem.add(null);
        elem.Id = csEAplicacionDifCambio.cSEDIFAPLICACIONFV;
        //'Cobrar las Facturas y aplicar el resto a la Note de Débito
        elem.Value = getText(2481, "");

      };

      var setGridStepSelectCobros = function(property) {
        var keyCobros = null;

        keyCobros = GetKey(WCS.SELECT_COBROS);
        // La clave de los pasos debe ser la constante que los define
        // Esto es vital para que la navegacion funcione correctamente
        var elem = m_objWizard.getSteps().add(null, keyCobros);

        var elem = elem.add(null);
        //.Name = vbNullString
        elem.Top = 100;
        elem.Left = 100;
        elem.TopNotChange = true;
        elem.LeftNotChange = true;
        elem.PropertyType = cspImage;
        elem.Value = 3;
        //Set .Picture = m_Resource.ImgWiz3.Picture

        c_LabelCobrosText = getText(2146, "");

        var elem = elem.add(null, C_LABELCOBROS);
        //.Name = vbNullString
        elem.Top = 400;
        elem.Left = 1500;
        elem.TopNotChange = true;
        elem.LeftNotChange = true;
        elem.Height = 880;
        elem.Width = 8000;
        elem.PropertyType = cspLabel;
        elem.FontBold = true;
        //'Indique los instrumentos de cobro
        elem.Value = c_LabelCobrosText;

        var objAbm = null;
        #If PREPROC_SFS Then;
        var wizard = null;
        #Else;
        var wizard = null;
        #End If;
        var oTab = null;
        var iTab = null;
        wizard = m_objWizard;
        objAbm = wizard.getObjAbm();

        iTab = objAbm.getTabs().add(null);
        oTab = iTab;
        oTab.setFatherTab(keyCobros);
        oTab.setLeft(150);
        oTab.setTop(1100);
        iTab.setName("Cheques");
        iTab.setIndex(-1);

        iTab = objAbm.getTabs().add(null);
        oTab = iTab;
        oTab.setFatherTab(keyCobros);
        iTab.setName("Efectivo");
        iTab.setIndex(-2);

        iTab = objAbm.getTabs().add(null);
        oTab = iTab;
        oTab.setFatherTab(keyCobros);
        iTab.setName("Tarjetas");
        iTab.setIndex(-3);

        iTab = objAbm.getTabs().add(null);
        oTab = iTab;
        oTab.setFatherTab(keyCobros);
        iTab.setName("Otros");
        iTab.setIndex(-4);

        iTab = objAbm.getTabs().add(null);
        oTab = iTab;
        oTab.setFatherTab(keyCobros);
        iTab.setName("Cuenta Corriente");
        iTab.setIndex(-5);

        var elem = elem.add(null, DWC.CHEQUES);
        elem.Top = 1600;
        elem.Left = 150;
        //.Name = vbNullString
        elem.PropertyType = cspGrid;
        elem.LeftLabel = -1;
        pLoadCheques(elem.Grid);
        elem.Width = 11500;
        elem.Height = 4000;
        elem.Key = KW_CHEQUES;
        elem.GridAdd = true;
        elem.GridEdit = true;
        elem.GridRemove = true;
        elem.TabIndex = -1;

        var elem = elem.add(null, DWC.EFECTIVO);
        elem.Top = 1600;
        elem.Left = 150;
        //.Name = vbNullString
        elem.PropertyType = cspGrid;
        elem.LeftLabel = -1;
        pLoadEfectivo(elem.Grid);
        elem.Width = 11500;
        elem.Height = 4000;
        elem.Key = KW_EFECTIVO;
        elem.GridAdd = true;
        elem.GridEdit = true;
        elem.GridRemove = true;
        elem.TabIndex = -2;

        var elem = elem.add(null, DWC.TARJETAS);
        elem.Top = 1600;
        elem.Left = 150;
        //.Name = vbNullString
        elem.PropertyType = cspGrid;
        elem.LeftLabel = -1;
        pLoadTarjetas(elem.Grid);
        elem.Width = 11500;
        elem.Height = 4000;
        elem.Key = KW_TARJETAS;
        elem.GridAdd = true;
        elem.GridEdit = true;
        elem.GridRemove = true;
        elem.TabIndex = -3;

        var elem = elem.add(null, DWC.OTROS);
        elem.Top = 1600;
        elem.Left = 150;
        //.Name = vbNullString
        elem.PropertyType = cspGrid;
        elem.LeftLabel = -1;
        pLoadOtros(elem.Grid);
        elem.Width = 11500;
        elem.Height = 4000;
        elem.Key = KW_OTROS;
        elem.GridAdd = true;
        elem.GridEdit = true;
        elem.GridRemove = true;
        elem.TabIndex = -4;

        var elem = elem.add(null, DWC.CTA_CTE);
        elem.Top = 1600;
        elem.Left = 150;
        //.Name = vbNullString
        elem.PropertyType = cspGrid;
        elem.LeftLabel = -1;
        pLoadCtaCte(elem.Grid);
        elem.Width = 11500;
        elem.Height = 4000;
        elem.Key = KW_CTA_CTE;
        elem.GridAdd = false;
        elem.GridEdit = false;
        elem.GridRemove = false;
        elem.TabIndex = -5;

        var elem = elem.add(null, DWC.COBRO_INDICADO);
        elem.Top = 5580;
        elem.Left = 1800;
        elem.LeftLabel = -1000;
        elem.Width = 1800;
        elem.Format = Cairo.Settings.getAmountDecimalsFormat();
        //'A cobrar
        elem.Name = getText(2147, "");
        elem.PropertyType = cspNumeric;
        elem.SubType = cspMoney;
        elem.Enabled = false;
        elem.Key = KW_IMPORTE_INDICADO;

        var elem = elem.add(null, DWC.COBRO_NETO);
        elem.Top = 5580;
        elem.Left = 4800;
        //'Neto
        elem.Name = getText(1581, "");
        elem.LeftLabel = -500;
        elem.Width = 1800;
        elem.Format = Cairo.Settings.getAmountDecimalsFormat();
        elem.PropertyType = cspNumeric;
        elem.SubType = cspMoney;
        elem.Enabled = false;
        elem.Key = KW_IMPORTE_NETO;

        var elem = elem.add(null, DWC.COBRO_OTROS);
        elem.Top = 5580;
        elem.Left = 7200;
        elem.LeftLabel = -500;
        elem.Width = 1800;
        elem.Format = Cairo.Settings.getAmountDecimalsFormat();
        //'Otros
        elem.Name = getText(1070, "");
        elem.PropertyType = cspNumeric;
        elem.SubType = cspMoney;
        elem.Enabled = false;
        elem.Key = KW_IMPORTE_OTROS;

        var elem = elem.add(null, DWC.COBRO_TOTAL);
        elem.Top = 5580;
        elem.Left = 9850;
        elem.LeftLabel = -500;
        elem.Width = 1800;
        //'Total
        elem.Name = getText(1584, "");
        elem.Format = Cairo.Settings.getAmountDecimalsFormat();
        elem.PropertyType = cspNumeric;
        elem.SubType = cspMoney;
        elem.Enabled = false;
        elem.Key = KW_IMPORTE_TOTAL;
      };

      var setGridOtros = function(property) {
        // La primera simpre esta invisible
        var w_columns = grid.getColumns();

        w_columns.add(null).setVisible(false);

        var elem = w_columns.add(null);
        //'Cuenta
        elem.setName(getText(1267, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setWidth(2200);
        elem.setKey(KIO_CUE_ID);
        //'c_filter_cuentas_de_caja
        elem.setSelectFilter("(emp_id = "+ cUtil.getEmpId().toString()+ " or emp_id is null)"+ pGetFilterCuentaXCaja());

        var elem = w_columns.add(null);
        //'Debe
        elem.setName(getText(1904, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KIO_DEBE);

        var elem = w_columns.add(null);
        //'Haber
        elem.setName(getText(1905, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KIO_HABER);

        var elem = w_columns.add(null);
        //'Origen
        elem.setName(getText(1901, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KIO_IMPORTEORIGEN);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(KIO_DESCRIP);

        var elem = w_columns.add(null);
        //'Retención
        elem.setName(getText(1403, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.RETENCION);
        elem.setWidth(1500);
        elem.setKey(KIO_RET_ID);

        var elem = w_columns.add(null);
        //'C. Retención
        elem.setName(getText(2103, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1200);
        elem.setKey(KIO_NRORETENCION);

        var elem = w_columns.add(null);
        //'% Retención
        elem.setName(getText(2104, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
        elem.setWidth(1200);
        elem.setKey(KIO_PORCRETENCION);

        var elem = w_columns.add(null);
        //'Fecha
        elem.setName(getText(1569, ""));
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(920);
        elem.setKey(KIO_FECHARETENCION);

        var elem = w_columns.add(null);
        //'Centro de Costo
        elem.setName(getText(1057, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTRO_COSTO);
        elem.setWidth(1800);
        elem.setKey(KIO_CCOS_ID);

        var elem = w_columns.add(null, mTesoreriaConstantes.FV_ID_RET);
        //' Factura
        elem.setName(getText(1866, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(csFacturaVenta);
        elem.setWidth(1200);
        elem.setKey(KIO_FV_ID_RET);
      };

      var setGridCheques = function(property) {
        // La primera simpre esta invisible
        var w_columns = grid.getColumns();

        w_columns.add(null).setVisible(false);

        var elem = w_columns.add(null);
        //'Cuenta
        elem.setName(getText(1267, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);

        //.HelpFilter = "(" & cscCuecId & "=" & csECuecBancos & " or " _
        +(mTesoreriaConstantes.CUEC_ID+ "="+ csECuentaCategoria.cSECUECDOCENCARTERA.toString()+ ") and (emp_id = "+ cUtil.getEmpId().toString()+ " or emp_id is null)");
        //'c_filter_cuentas_de_caja
        elem.setSelectFilter(mPublic.self.getHelpFilterCheques()+ pGetFilterCuentaXCaja());

        elem.setWidth(2200);
        elem.setKey(KICH_CUE_ID);

        var elem = w_columns.add(null);
        //'Mon
        elem.setName(getText(2063, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setWidth(520);
        elem.setKey(KICH_MON_ID);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        //'Origen
        elem.setName(getText(1901, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KICH_IMPORTEORIGEN);

        var elem = w_columns.add(null);
        //'Importe
        elem.setName(getText(1228, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KICH_IMPORTE);

        var elem = w_columns.add(null);
        //'Banco
        elem.setName(getText(1122, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.BANCO);
        elem.setWidth(1620);
        elem.setKey(KICH_BCO_ID);

        var elem = w_columns.add(null);
        //'Nro. Cheque
        elem.setName(getText(2059, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(KICH_CHEQUE);

        var elem = w_columns.add(null);
        //'Propio
        elem.setName(getText(3719, ""));
        elem.setType(Dialogs.PropertyType.check);
        elem.setWidth(800);
        elem.setKey(KICH_PROPIO);

        var elem = w_columns.add(null);
        //'Depositar el
        elem.setName(getText(2065, ""));
        elem.setDefaultValue(new cABMGridRowValue());
        elem.getDefaultValue().setValue(Date);
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(970);
        elem.setKey(KICH_FECHACOBRO);

        var elem = w_columns.add(null);
        //'Vto.
        elem.setName(getText(1634, ""));
        elem.setDefaultValue(new cABMGridRowValue());
        elem.getDefaultValue().setValue(DateAdd("m", 1, Date));
        elem.setType(Dialogs.PropertyType.date);
        elem.setWidth(970);
        elem.setKey(KICH_FECHAVTO);

        var elem = w_columns.add(null);
        //'Clering
        elem.setName(getText(1083, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CLEARING);
        elem.setWidth(800);
        elem.setKey(KICH_CLE_ID);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1600);
        elem.setKey(KICH_DESCRIP);

      };

      var setGridEfectivo = function(property) {
        // La primera simpre esta invisible
        var w_columns = grid.getColumns();

        w_columns.add(null).setVisible(false);

        var elem = w_columns.add(null);
        //'Cuenta
        elem.setName(getText(1267, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);

        //.HelpFilter = "(" & cscCuecId & "=" & csECuecCaja & " or " _
        +(mTesoreriaConstantes.CUEC_ID+ "="+ csECuentaCategoria.cSECUECBANCOS.toString()+ ") and (emp_id = "+ cUtil.getEmpId().toString()+ " or emp_id is null)");
        //'c_filter_cuentas_de_caja
        elem.setSelectFilter(mPublic.self.getHelpFilterEfectivo()+ pGetFilterCuentaXCaja());

        elem.setWidth(3000);
        elem.setKey(KIE_CUE_ID);

        var elem = w_columns.add(null);
        //'Mon
        elem.setName(getText(2063, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setWidth(520);
        elem.setKey(KIE_MON_ID);
        elem.setEnabled(false);

        var elem = w_columns.add(null);
        //'Origen
        elem.setName(getText(1901, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KIE_IMPORTEORIGEN);

        var elem = w_columns.add(null);
        //'Importe
        elem.setName(getText(1228, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KIE_IMPORTE);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(2500);
        elem.setKey(KIE_DESCRIP);
      };

      var setGridTarjetas = function(property) {
        // La primera simpre esta invisible
        var w_columns = grid.getColumns();

        w_columns.add(null).setVisible(false);

        var elem = w_columns.add(null);
        //'Cupon
        elem.setName(getText(2105, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1500);
        elem.setKey(KIT_CUPON);

        var elem = w_columns.add(null);
        //'Tarjeta
        elem.setName(getText(2106, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectFilter("emp_id = "+ cUtil.getEmpId().toString());
        elem.setSelectTable(Cairo.Tables.TARJETACREDITO);
        elem.setWidth(1800);
        elem.setKey(KIT_TJC_ID);

        var elem = w_columns.add(null, C_CUOTAS);
        //'Cuotas
        elem.setName(getText(1473, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TARJETACREDITOCUOTA);
        elem.setWidth(900);
        elem.setKey(KIT_TJCCU_ID);
        m_lColCuotas = w_columns.count();

        var elem = w_columns.add(null);
        //'Mon
        elem.setName(getText(2063, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setWidth(520);
        elem.setKey(KIT_MON_ID);

        var elem = w_columns.add(null);
        //'Origen
        elem.setName(getText(1901, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KIT_IMPORTEORIGEN);

        var elem = w_columns.add(null);
        //'Importe
        elem.setName(getText(1228, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KIT_IMPORTE);

        var elem = w_columns.add(null);
        //'Vto.
        elem.setName(getText(1634, ""));
        elem.setType(Dialogs.PropertyType.date);
        elem.setDefaultValue(new cABMGridRowValue());
        elem.getDefaultValue().setValue(DateAdd("d", 1, Date));
        elem.setWidth(970);
        elem.setKey(KIT_FECHAVTO);

        var elem = w_columns.add(null);
        //'Nro. Tarjeta
        elem.setName(getText(2107, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1300);
        elem.setKey(KIT_NROTARJETA);

        var elem = w_columns.add(null);
        //'Cod. Autoriz.
        elem.setName(getText(2123, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(KIT_NROAUTORIZACION);

        var elem = w_columns.add(null);
        //'Operacion
        elem.setName(getText(2108, ""));
        elem.setType(Dialogs.PropertyType.list);
        var elem = elem.add(null);
        elem.Id = csECuponTipo.cSECUPONPOSNET;
        //'Posnet
        elem.Value = getText(2110, "");
        var elem = elem.add(null);
        elem.Id = csECuponTipo.cSECUPONMANUAL;
        //'Manual
        elem.Value = getText(2111, "");
        elem.setDefaultValue(new cABMGridRowValue());
        elem.getDefaultValue().setID(csECuponTipo.cSECUPONPOSNET);
        elem.setWidth(1000);
        elem.setKey(KIT_TARJETA_TIPO);

        var elem = w_columns.add(null);
        //'Titular
        elem.setName(getText(2109, ""));
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1000);
        elem.setKey(KIT_TITULAR);

        var elem = w_columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setWidth(1300);
        elem.setKey(KIT_DESCRIP);
      };

      var setGridCtaCte = function(property) {
        // La primera simpre esta invisible
        var w_columns = grid.getColumns();

        w_columns.add(null).setVisible(false);

        var elem = w_columns.add(null);
        //'Cuenta
        elem.setName(getText(1267, ""));
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setWidth(3000);
        elem.setSelectFilter("(1=1)"+ c_filter_cuentas_de_caja);
        elem.setKey(KICC_CUE_ID);

        var elem = w_columns.add(null);
        //'Origen
        elem.setName(getText(1901, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KICC_IMPORTEORIGEN);

        var elem = w_columns.add(null);
        //'Importe
        elem.setName(getText(1228, ""));
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setWidth(920);
        elem.setKey(KICC_IMPORTE);
      };

      var setGridStepDatosGenerales = function(property) {
        // La clave de los pasos debe ser la constante que los define
        // Esto es vital para que la navegacion funcione correctamente
        var elem = m_objWizard.getSteps().add(null, GetKey(WCS.DATOS_GENERALES));

        var elem = elem.add(null);
        //.Name = vbNullString
        elem.Top = 100;
        elem.Left = 100;
        elem.TopNotChange = true;
        elem.LeftNotChange = true;
        elem.PropertyType = cspImage;
        elem.Value = 3;
        //Set .Picture = m_Resource.ImgWiz3.Picture

        var elem = elem.add(null);
        //.Name = vbNullString
        elem.Top = 400;
        elem.Left = 1500;
        elem.TopNotChange = true;
        elem.LeftNotChange = true;
        elem.Height = 880;
        elem.Width = 8000;
        elem.PropertyType = cspLabel;
        elem.FontBold = true;
        //'Complete los siguientes datos del Recibo
        elem.Value = getText(2148, "");

        var elem = elem.add(null, DWC.FECHA);
        elem.PropertyType = cspDate;
        elem.Left = 2800;
        //'Fecha
        elem.Name = getText(1569, "");
        elem.Key = KW_FECHA;
        elem.Value = Date;

        var elem = elem.add(null, DWC.CLIENTE2);
        elem.PropertyType = cspHelp;
        elem.Table = Cairo.Tables.CLIENTE;
        elem.Enabled = false;
        //'Cliente
        elem.Name = getText(1150, "");
        elem.Key = KW_CLIENTE2;

        var elem = elem.add(null, DWC.SUCURSAL);
        elem.PropertyType = cspHelp;
        elem.Table = Cairo.Tables.SUCURSAL;
        //'Sucursal
        elem.Name = getText(1281, "");
        elem.Value = cUtil.getUser().getSucursal();
        elem.HelpId = cUtil.getUser().getSuc_id();
        elem.Key = KW_SUCURSAL;

        var elem = elem.add(null, DWC.COMPROBANTE);
        elem.PropertyType = cspText;
        elem.Left = 6800;
        elem.TopFromProperty = DWC.FECHA;
        //'Comprobante
        elem.Name = getText(1610, "");
        elem.Key = KW_COMPROBANTE;

        var elem = elem.add(null, DWC.COBRADOR);
        elem.PropertyType = cspHelp;
        elem.Table = Cairo.Tables.COBRADOR;
        //'Cobrador
        elem.Name = getText(1088, "");
        elem.Key = KW_COBRADOR;

        var elem = elem.add(null, DWC.LEGAJO);
        elem.PropertyType = cspHelp;
        elem.Table = mTesoreriaConstantes.cSLEGAJO;
        //'Legajo
        elem.Name = getText(1575, "");
        elem.Key = KW_LEGAJO;

        var elem = elem.add(null, DWC.CENTRO_COSTO);
        elem.PropertyType = cspHelp;
        elem.Table = Cairo.Tables.CENTRO_COSTO;
        //'Centro de Costo
        elem.Name = getText(1057, "");
        elem.Key = KW_CENTRO_COSTO;

        var elem = elem.add(null, DWC.OBSERVACIONES);
        elem.PropertyType = cspText;
        elem.Left = 2800;
        elem.TopFromProperty = DWC.CENTRO_COSTO;
        elem.TopToPrevious = 440;
        elem.Height = 880;
        elem.Width = 6250;
        //'Observaciones
        elem.Name = getText(1861, "");
        elem.Key = KW_DESCRIP;
      };

      var pUserCancel = function() {
        var _rtn = null;
        if(m_wizardCancel) {

          if(Ask(getText(1665, ""), vbNo)) {
            //Desea cancelar el proceso
            _rtn = true;
          }
        }
        m_wizardCancel = false;

        return _rtn;
      };

      var pGetAnticipo2 = function(origen) { // TODO: Use of ByRef founded Private Function pGetAnticipo2(ByRef Origen As Double) As Double
        var monId = null;
        var cotizacion = null;
        var anticipo = null;

        monId = pGetMonedaAnticipo().getSelectId();
        anticipo = Cairo.Util.val(pGetAnticipoImporte().getValue());

        if(monId !== m_monDefault) {
          cotizacion = Cairo.Util.val(pGetCotizacionAnticipo().getValue());
          origen = anticipo;
          anticipo = anticipo * cotizacion;
        }
        else {
          origen = 0;
        }

        return anticipo;
      };

      var pCheckAnticipo = function() {
        return true;
      };

      var pChecFacturas = function() {
        if(Cairo.Util.val(pGetTotal().getValue()) === 0) {
          MsgWarning(getText(2149, ""));
          //Debe indicar una o más Facturas, un importe como anticipo, o ambas cosas.
          return null;
        }
        return true;
      };

      var setGridFacturasXCliente = function(property) {
        var bAgrupados = null;
        var bShowCotizacion = null;
        var vMonId() = null;
        var vCotiz() = null;
        var monId = null;
        var i = null;
        var moneda = null;
        var cotiz = null;
        var origen = null;

        var fv_id = null;

        // Edit From ListDoc
        //
        var bSelected = null;
        var bOnlySelected = null;

        m_bDifCambio = false;

        bAgrupados = pGetAgrupados();

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

        // Edit From ListDoc
        //
        bOnlySelected = pGetOnlySelected().getValue();

        var w_pGetFacturas = pGetFacturas();

        G.redim(vMonId, 0);

        if(pGetAgrupados()) {
          w_pGetFacturas.getColumns(DWC.IMPORTE).Visible = false;
          w_pGetFacturas.getColumns(DWC.PENDIENTE).Visible = true;
        }
        else {
          w_pGetFacturas.getColumns(DWC.IMPORTE).Visible = true;
          w_pGetFacturas.getColumns(DWC.PENDIENTE).Visible = false;
        }

        var w_rows = w_pGetFacturas.getRows();

        w_rows.clear();
        return true;
      };

      var pLoadFacturasXCliente = function() {


        for(var _i = 0; _i < m_data.facturasXCliente.length; _i += 1) {

          // Edit From ListDoc
          //
          fv_id = Cairo.Database.valField(m_data.facturasXCliente[_i], mTesoreriaConstantes.FV_ID);

          bSelected = pGetApply(fv_id);
          if(!bOnlySelected || bSelected) {

            var elem = w_rows.add(null);

            // La primera no se usa
            elem.add(null);

            var elem = elem.add(null);
            elem.Id = Cairo.Database.valField(m_data.facturasXCliente[_i], mTesoreriaConstantes.FVD_ID);
            elem.Key = KI_FVD_ID;

            var elem = elem.add(null);
            elem.Id = Integer.parseInt(bSelected);
            elem.Key = KI_SELECT;

            var elem = elem.add(null);
            elem.Value = Cairo.Database.valField(m_data.facturasXCliente[_i], mTesoreriaConstantes.DOC_NAME);
            elem.Key = KI_DOC;

            var elem = elem.add(null);
            elem.Value = Cairo.Database.valField(m_data.facturasXCliente[_i], mTesoreriaConstantes.FV_NRODOC);
            elem.Key = KI_NRODOC;

            var elem = elem.add(null);
            elem.Value = Cairo.Database.valField(m_data.facturasXCliente[_i], mTesoreriaConstantes.FV_NUMERO);
            elem.Id = Cairo.Database.valField(m_data.facturasXCliente[_i], mTesoreriaConstantes.FV_ID);
            elem.Key = KI_FV_ID;

            var elem = elem.add(null);
            elem.Value = Cairo.Database.valField(m_data.facturasXCliente[_i], mTesoreriaConstantes.FV_FECHA);
            elem.Key = KI_FECHA;

            var elem = elem.add(null);
            elem.Value = Cairo.Database.valField(m_data.facturasXCliente[_i], mTesoreriaConstantes.MON_NAME);
            elem.Id = Cairo.Database.valField(m_data.facturasXCliente[_i], mTesoreriaConstantes.MON_ID);
            elem.Key = KI_MONEDA;

            var elem = elem.add(null);
            origen = Cairo.Database.valField(m_data.facturasXCliente[_i], mTesoreriaConstantes.FV_TOTAL_ORIGEN);
            elem.Value = origen ? origen : "");
            elem.Key = KI_IMPORTEORIGEN;
            if(Cairo.Util.val(elem.Value) !== 0) { bShowCotizacion = true; }

            var elem = elem.add(null);
            cotiz = Cairo.Database.valField(m_data.facturasXCliente[_i], mTesoreriaConstantes.FV_COTIZACION);
            elem.Value = cotiz ? cotiz : "");
            elem.Key = KI_COTIZACION;

            var elem = elem.add(null);
            elem.Value = Cairo.Database.valField(m_data.facturasXCliente[_i], mTesoreriaConstantes.FV_TOTAL);
            elem.Key = KI_TOTAL;

            var elem = elem.add(null);
            elem.Value = 0;
            elem.Key = KI_COTIZACION2;

            var elem = elem.add(null);
            elem.Value = Cairo.Database.valField(m_data.facturasXCliente[_i], mTesoreriaConstantes.FVD_FECHA);
            elem.Key = KI_VTO;

            var elem = elem.add(null);
            elem.Value = Cairo.Database.valField(m_data.facturasXCliente[_i], mTesoreriaConstantes.FV_PENDIENTE);
            elem.Key = KI_PENDIENTE;

            var elem = elem.add(null);
            elem.Value = Cairo.Database.valField(m_data.facturasXCliente[_i], mTesoreriaConstantes.FVD_PENDIENTE);
            elem.Key = KI_IMPORTE;

            var elem = elem.add(null);
            if(bSelected) {
              elem.Value = pGetApplyImporte(fv_id, Cairo.Database.valField(m_data.facturasXCliente[_i], mTesoreriaConstantes.FVD_PENDIENTE));
            }
            else {
              elem.Value = 0;
            }
            elem.Key = KI_APLICAR;

            var elem = elem.add(null);
            elem.Value = Cairo.Database.valField(m_data.facturasXCliente[_i], mTesoreriaConstantes.FV_DESCRIP);
            elem.Key = KI_DESCRIP;

            monId = Cairo.Database.valField(m_data.facturasXCliente[_i], mTesoreriaConstantes.MON_ID);
            if(m_monDefault !== monId) {
              pAddMoneda(vMonId[], monId);
            }
          }

        }

        if(!bShowCotizacion) {
          pGetFacturas().getColumns(DWC.COTIZACION).Visible = false;
          pGetFacturas().getColumns(DWC.MONEDA).Visible = false;
          pGetCotizacion().setVisible(false);
          pGetTotalOrigen().setVisible(false);
          m_bDifCambio = false;
        }
        else {
          pGetFacturas().getColumns(DWC.COTIZACION).Visible = true;
          pGetFacturas().getColumns(DWC.MONEDA).Visible = true;
          pGetCotizacion().setVisible(true);
          pGetTotalOrigen().setVisible(true);
          m_bDifCambio = true;
        }

        if(vMonId.Length > 0) {
          moneda = new cMoneda();

          pGetFacturas().getColumns(DWC.COTIZACION2).Visible = true;

          G.redim(vCotiz, vMonId.Length);
          for (i = 1; i <= vMonId.Length; i++) {
            vCotiz[i] = moneda.getCotizacion(vMonId[i], Date);
          }

          var row = null;
          var _count = pGetFacturas().getRows().size();
          for (var _i = 0; _i < _count; _i++) {
            row = pGetFacturas().getRows().item(_i);
            for (i = 1; i <= vMonId.Length; i++) {
              if(vMonId[i] === Dialogs.cell(row, KI_MONEDA).getID()) {
                Dialogs.cell(row, KI_COTIZACION2).getValue() === vCotiz[i];
                break;
              }
            }
          }

          moneda = new cMoneda();

          pGetCotizacion().setValue(moneda.getCotizacion(vMonId[1], Date));
          pRefreshCotizacion(false);

        }
        else {
          pGetCotizacion().setVisible(false);
          pGetFacturas().getColumns(DWC.COTIZACION2).Visible = false;
        }

        m_objWizard.showValue(pGetCotizacion());
        m_objWizard.showValue(pGetTotalOrigen());

        pRefreshFacturas();
        pShowTotalFacturas();

        return true;
      };

      // Edit From ListDoc
      //
      var pGetApplyImporte = function(fv_id,  pendiente) {
        var _rtn = 0;
        var i = null;
        var j = null;
        var cobrado = null;

        if(m_bUseCliIds) {

          if(m_cobranzaInfo !== null) {

            // Cobranza por Info
            //
            var fvInfo = null;

            var _count = m_cobranzaInfo.getFacturas().size();
            for (var _i = 0; _i < _count; _i++) {
              fvInfo = m_cobranzaInfo.getFacturas().item(_i);

              if(fvInfo.getCliId() === m_cliIdDoc) {

                if(fvInfo.getFvId() === fv_id) {

                  cobrado = fvInfo.getImporteCobrado();

                  if(pendiente < cobrado) {
                    _rtn = pendiente;
                  }
                  else {
                    _rtn = cobrado;
                  }
                  return _rtn;

                }

              }
            }

          }
          else {

            // Cobranza por vector
            //

            for (j = 1; j <= (m_fvIdsxCliId, 2).Length; j++) {

              if(m_fvIdsxCliId[1, j] === m_cliIdDoc) {

                if(m_fvIdsxCliId[2, j] === fv_id) {

                  cobrado = m_fvIdsxCliId[3, j] / 100;
                  if(pendiente < cobrado) {
                    _rtn = pendiente;
                  }
                  else {
                    _rtn = cobrado;
                  }
                  return _rtn;
                }
              }
            }

          }

        }
        else {

          _rtn = pendiente;

        }


        return _rtn;
      };

      var pGetApply = function(fv_id) {
        var _rtn = null;
        var i = null;
        var j = null;

        if(m_bUseCliIds) {

          if(m_cobranzaInfo !== null) {

            // Cobranza por Info
            //
            var fvInfo = null;

            var _count = m_cobranzaInfo.getFacturas().size();
            for (var _i = 0; _i < _count; _i++) {
              fvInfo = m_cobranzaInfo.getFacturas().item(_i);

              if(fvInfo.getCliId() === m_cliIdDoc) {

                if(fvInfo.getFvId() === fv_id) {

                  _rtn = true;
                  return _rtn;

                }

              }
            }

          }
          else {

            // Cobranza por vector
            //

            for (j = 1; j <= (m_fvIdsxCliId, 2).Length; j++) {

              if(m_fvIdsxCliId[1, j] === m_cliIdDoc) {

                if(m_fvIdsxCliId[2, j] === fv_id) {
                  _rtn = true;
                  return _rtn;
                }
              }
            }

          }

        }
        else {

          for (i = 1; i <= m_fvIds.Length; i++) {
            if(m_fvIds[i] === fv_id) {
              _rtn = true;
              return _rtn;
            }
          }
        }

        return _rtn;
      };

      var pAddMoneda = function(vMonIds,  monId) { // TODO: Use of ByRef founded Private Sub pAddMoneda(ByRef vMonIds() As Long, ByVal MonId As Long)
        var i = null;

        for (i = 1; i <= vMonIds.Length; i++) {
          if(vMonIds(i) === monId) { return; }
        }

        G.redimPreserve(vMonIds, vMonIds.Length + 1);
        vMonIds(vMonIds.Length) = monId;
      };

      var pGetNomMonedaDefault = function() {
        var sqlstmt = null;
        var rs = null;

        sqlstmt = "select mon_signo from Moneda where mon_legal <> 0";
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return ""; }

        if(rs.isEOF()) {
          MsgWarning(getText(2150, ""));
          //Debe definir cual es la moneda legal con la que opera el Sistema
          return null;
        }

        return Cairo.Database.valField(rs.getFields(), "mon_signo");
      };

      var pGetCuentasDeudor = function() {
        var i = null;
        var row = null;
        var cell = null;
        var total = null;
        var vCtaCte() = null;
        var anticipo = null;
        var anticipoOrigen = null;
        var cue_id_anticipo = null;
        var cuentaAnticipo = null;

        // Dimensiono la grilla y el vector de facturas
        pGetCtaCte().getRows().clear();

        var w_pGetCuentaAnticipo = pGetCuentaAnticipo();
        cue_id_anticipo = w_pGetCuentaAnticipo.getSelectId();
        cuentaAnticipo = w_pGetCuentaAnticipo.getValue();

        anticipo = pGetAnticipo2(anticipoOrigen);

        // Obtengo las cuentas del tercero
        if(!mCobranza.self.getCuentasDeudor(pGetFacturas(), vCtaCte[], KI_FV_ID, KI_APLICAR, KI_COTIZACION2, anticipo, cue_id_anticipo, cuentaAnticipo, anticipoOrigen)) { return false; }

        // Agrego las cuentas a la grilla
        for (i = 1; i <= vCtaCte.Length; i++) {
          row = pGetCtaCte().getRows().add(null);

          // La primera no se usa
          cell = row.add(null);

          cell = row.add(null);
          cell.setValue(vCtaCte[i].cuenta);
          cell.setID(vCtaCte[i].cue_id);
          cell.setKey(KICC_CUE_ID);

          cell = row.add(null);
          cell.setValue(vCtaCte[i].importeOrigen);
          cell.setKey(KICC_IMPORTEORIGEN);

          cell = row.add(null);
          cell.setValue(vCtaCte[i].importe);
          cell.setKey(KICC_IMPORTE);

          total = total + vCtaCte[i].importe;
        }

        // Refrezco la grilla
        pGetCobroIndicado().setValue(total);
        m_objWizard.showValue(pGetCobroIndicado());

        pRefreshCtaCte();
        return true;
      };

      // Validaciones de Filas de Instrumentos de cobro
      var pIsEmptyRowCheques = function(row,  rowIndex) {
        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KICH_CUE_ID:
            case KICH_BCO_ID:
            case KICH_MON_ID:
            case KICH_CLE_ID:
              if(!ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                bRowIsEmpty = false;
                break;
              }

              break;

            case KICH_IMPORTE:
            case KICH_IMPORTEORIGEN:
              if(!ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double)) {
                var bRowIsEmpty = true;
                break;
              }

              break;

            case KICH_DESCRIP:
            case KICH_CHEQUE:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                var bRowIsEmpty = true;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pValidateRowCheques = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function pValidateRowCheques(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var bOrigen = null;
        var monId = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case KICH_CUE_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                //'Debe indicar una cuenta contable (1)
                MsgInfo(getText(2113, "", strRow));
              }

              break;

            case KICH_BCO_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                //'Debe indicar un banco (1)
                MsgInfo(getText(2094, "", strRow));
              }

              break;

            case KICH_MON_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                //'Debe indicar una moneda (1)
                MsgInfo(getText(2114, "", strRow));
              }
              monId = cell.getId();

              break;

            case KICH_CLE_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                //'Debe indicar un clearing (1)
                MsgInfo(getText(2115, "", strRow));
              }

              break;

            case KICH_IMPORTEORIGEN:
              bOrigen = !ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double);

              break;

            case KICH_IMPORTE:
              if(ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double)) {
                //'Debe indicar un importe (1)
                MsgInfo(getText(1897, "", strRow));
              }

              break;

            case KICH_CHEQUE:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                //'Debe indicar un número de cheque (1)
                MsgInfo(getText(2116, "", strRow));
              }

              break;

            case KICH_FECHACOBRO:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.date)) {
                //'Debe indicar una fecha para depositar (1)
                MsgInfo(getText(2117, "", strRow));
              }

              break;

            case KICH_FECHAVTO:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.date)) {
                //'Debe indicar una fecha de vencimiento (1)
                MsgInfo(getText(1384, "", strRow));
              }
              break;
          }
        }

        if(!bOrigen && monId !== m_monDefault) {
          MsgInfo(getText(2118, "", strRow));
          //Debe indicar un importe para la moneda extranjera (1)
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var pIsEmptyRowTarjetas = function(row,  rowIndex) {
        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIT_TJC_ID:
            case KIT_MON_ID:
            case KIT_TJCCU_ID:
              if(!ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                bRowIsEmpty = false;
                break;
              }

              break;

            case KIT_IMPORTE:
            case KIT_IMPORTEORIGEN:
              if(!ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double)) {
                var bRowIsEmpty = true;
                break;
              }

              break;

            case KIT_NROTARJETA:
            case KIT_NROAUTORIZACION:
            case KIT_TITULAR:
            case KIT_DESCRIP:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                var bRowIsEmpty = true;
                break;
              }

              break;

            case KIT_FECHAVTO:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.date)) {
                var bRowIsEmpty = true;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pValidateRowTarjetas = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function pValidateRowTarjetas(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var bOrigen = null;
        var monId = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case KIT_TJC_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                //'Debe indicar una cuenta contable (1)
                MsgInfo(getText(2113, "", strRow));
              }

              break;

            case KIT_TJCCU_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                //'Debe indicar la cantidad de cuotas (1)
                MsgInfo(getText(1478, "", strRow));
              }

              break;

            case KIT_MON_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                //'Debe indicar una moneda (1)
                MsgInfo(getText(2114, "", strRow));
              }
              monId = cell.getId();

              break;

            case KIT_IMPORTEORIGEN:
              bOrigen = !ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double);

              break;

            case KIT_IMPORTE:
              if(ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double)) {
                //'Debe indicar un importe (1)
                MsgInfo(getText(1897, "", strRow));
              }

              break;

            case KIT_NROTARJETA:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                //'Debe indicar un número tarjeta (1)
                MsgInfo(getText(2120, "", strRow));
              }

              break;

            case KIT_NROAUTORIZACION:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                //'Debe indicar un número autorización (1)
                MsgInfo(getText(2121, "", strRow));
              }

              break;

            case KIT_FECHAVTO:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.date)) {
                //'Debe indicar una fecha de vencimiento (1)
                MsgInfo(getText(1384, "", strRow));
              }

              break;

            case KIT_TITULAR:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                //'Debe indicar un Titular (1)
                MsgInfo(getText(2122, "", strRow));
              }
              break;
          }
        }

        if(!bOrigen && monId !== m_monDefault) {
          //'Debe indicar un importe para la moneda extranjera (1)
          MsgInfo(getText(2118, "", strRow));
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var pIsEmptyRowOtros = function(row,  rowIndex) {
        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIO_CUE_ID:
            case KIO_CCOS_ID:
            case KIO_RET_ID:
              if(!ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                bRowIsEmpty = false;
                break;
              }

              break;

            case KIO_DEBE:
            case KIO_HABER:
            case KIO_IMPORTEORIGEN:
            case KIO_PORCRETENCION:
              if(!ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double)) {
                var bRowIsEmpty = true;
                break;
              }

              break;

            case KIO_NRORETENCION:
            case KIO_DESCRIP:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                var bRowIsEmpty = true;
                break;
              }

              break;

            case KIO_FECHARETENCION:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.date)) {
                var bRowIsEmpty = true;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pValidateRowOtros = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function pValidateRowOtros(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var bOrigen = null;
        var bDebe = null;
        var bHaber = null;
        var monId = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case KIO_CUE_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                //'Debe indicar una cuenta contable (1)
                MsgInfo(getText(2113, "", strRow));
              }

              break;

            case KIO_DEBE:
              bDebe = !ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double);

              break;

            case KIO_HABER:
              bHaber = !ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double);

              break;

            case KIO_IMPORTEORIGEN:
              bOrigen = !ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double);

              break;
          }
        }

        if(!bDebe && !bHaber) {
          MsgInfo(getText(1898, "", strRow));
          //Debe indicar un importe en el debe o en el haber (1)
        }

        if(!bOrigen && monId !== m_monDefault) {
          MsgInfo(getText(2118, "", strRow));
          //Debe indicar un importe para la moneda extranjera (1)
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var pIsEmptyRowEfectivo = function(row,  rowIndex) {
        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var bRowIsEmpty = true;

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {
            case KIE_CUE_ID:
              if(!ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                bRowIsEmpty = false;
                break;
              }

              break;

            case KIE_IMPORTE:
            case KIE_IMPORTEORIGEN:
              if(!ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double)) {
                var bRowIsEmpty = true;
                break;
              }

              break;

            case KIE_DESCRIP:
              if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                var bRowIsEmpty = true;
                break;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var pValidateRowEfectivo = function(row,  rowIndex) { // TODO: Use of ByRef founded Private Function pValidateRowEfectivo(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
        var cell = null;
        var bOrigen = null;
        var monId = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for (var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case KIE_CUE_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                //'Debe indicar una cuenta contable (1)
                MsgInfo(getText(2113, "", strRow));
              }

              if(!Cairo.Database.getData(mTesoreriaConstantes.CUENTA, mTesoreriaConstantes.CUE_ID, cell.getId(), mTesoreriaConstantes.MON_ID, monId)) { return false; }

              break;

            case KIE_IMPORTEORIGEN:
              bOrigen = !ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double);

              break;

            case KIE_IMPORTE:
              if(ValEmpty(Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double)) {
                //'Debe indicar un importe (1)
                MsgInfo(getText(1897, "", strRow));
              }
              break;
          }
        }

        if(!bOrigen && monId !== m_monDefault) {
          MsgInfo(getText(2118, "", strRow));
          //Debe indicar un importe para la moneda extranjera (1)
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var pValidateCobro = function() {
        var row = null;
        var i = null;

        i = 0;
        var _count = pGetCheques().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetCheques().getRows().item(_i);
          i = i + 1;
          if(!pIsEmptyRowCheques(row, i)) {
            if(!pValidateRowCheques(row, i)) { return false; }
          }
        }

        i = 0;
        var _count = pGetEfectivo().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetEfectivo().getRows().item(_i);
          i = i + 1;
          if(!pIsEmptyRowEfectivo(row, i)) {
            if(!pValidateRowEfectivo(row, i)) { return false; }
          }
        }

        i = 0;
        var _count = pGetOtros().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetOtros().getRows().item(_i);
          i = i + 1;
          if(!pIsEmptyRowOtros(row, i)) {
            if(!pValidateRowOtros(row, i)) { return false; }
          }
        }

        i = 0;
        var _count = pGetTarjetas().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetTarjetas().getRows().item(_i);
          i = i + 1;
          if(!pIsEmptyRowTarjetas(row, i)) {
            if(!pValidateRowTarjetas(row, i)) { return false; }
          }
        }

        if(Cairo.Util.round(Cairo.Util.val(pGetCobroIndicado().getValue()), Cairo.Settings.getAmountDecimals()) !== Cairo.Util.round(Cairo.Util.val(pGetCobroTotal().getValue()), Cairo.Settings.getAmountDecimals())) {

          // Si me tengo que detener en pagos y estoy en una
          // cobranza semi-automatica (las que se disparan desde
          // la recepcion de hojas de ruta), no presento un mensaje
          //
          if(m_bVirtualNextStopInPagos && m_bAutoSelect) {

            // Apago el flag por que a la proxima que de next y no
            // alcance para el pago ya le tengo que avisar
            //
            m_bVirtualNextStopInPagos = false;
            m_bRestarVirtualPush = true;

          }
          else {

            MsgWarning(getText(2151, ""));
            //El total de los instrumentos de cobro no coincide con el monto a cobrar
          }

          return null;
        }
        return true;
      };

      var pGetDocNumber = function() {
        var tl = null;
        var tAL_ID = null;
        var sqlstmt = null;
        var rs = null;
        var mask = null;
        var bEditable = null;

        if(LenB(pGetComprobante().getValue())) { return; }

        sqlstmt = "sp_clienteGetTalonario "+ pGetCliente().toString()+ ","+ pGetDoc().toString();
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        tAL_ID = Cairo.Database.valField(rs.getFields(), 0);

        tl = new cTalonario();

        var w_pGetComprobante = pGetComprobante();
        w_pGetComprobante.setValue(tl.GetNextNumber(tAL_ID, mask, bEditable));
        w_pGetComprobante.setTextMask(mask);
        w_pGetComprobante.setEnabled(bEditable);

        m_objWizard.showValue(pGetComprobante());
      };

      var pSetDatosGenerales = function() {
        var w_pGetCliente2 = pGetCliente2();
        w_pGetCliente2.setSelectId(pGetCliente());
        w_pGetCliente2.setValue(pGetClienteName());
        m_objWizard.showValue(pGetCliente2());
        pGetDocNumber();
        pSetDatosFromAplic();
      };

      var pValidateDatosGenerales = function() {
        if(ValEmpty(pGetFecha().getValue(), Cairo.Constants.Types.date)) {
          //'Debe indicar la fecha de la Cobranza
          MsgWarning(getText(2152, ""));
          return null;
        }

        if(ValEmpty(pGetSucursal().getSelectId(), Cairo.Constants.Types.id)) {
          //'Debe indicar la sucursal
          MsgWarning(getText(1560, ""));
          return null;
        }

        return true;
      };

      self.initialize = function() {
        try {

          

          //'Generado automáticamente por diferencia de cambio
          c_NCNDDescripDifCambio = getText(2281, "");


          m_tesoreriaConfig = new cTesoreriaConfig();
          m_tesoreriaConfig.load();

          m_monDefault = GetMonedaDefault();

          G.redim(m_fvIds, 0);
          G.redim(m_cliIds, 0);
          G.redim(m_fvIdsxCliId, 0, 0);

          // Hay que agregarlo a la configuracion de tesoreria
          //
          m_isHojaRuta = m_tesoreriaConfig.getCobranzasXHojaRuta();

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "Class_Initialize", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
      };

      self.destroy = function() {
        try {

          m_generalConfig = null;
          m_tesoreriaConfig = null;
          G.redim(m_fvIds, 0);
          G.redim(m_cliIds, 0);
          G.redim(m_fvIdsxCliId, 0, 0);
          m_objClient = null;
          m_cobranzaInfo = null;

          // **TODO:** goto found: GoTo ExitProc;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "Class_Terminate", C_MODULE, "");
          // **TODO:** label found: ExitProc:;
        }
        // **TODO:** on error resume next found !!!
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

      /////////////////////////////////////////////////////////////////////////////////
      var pSave = function() {
        var _rtn = null;

        if(!DocCanSaveEx(m_objWizard.getEditGeneric(), DWC.FECHA, DWC.DOC)) {
          _rtn = false;
          return _rtn;
        }

        var register = null;

        // Para determinar la aplicacion de las diferencias de cambio
        //
        var aplicado = null;

        var mouse = null;
        mouse = new cMouseWait();

        DoEvents:(DoEvents: DoEvents: DoEvents);

        register = new cRegister();

        register.setFieldId(mTesoreriaConstantes.COBZ_TMPID);
        register.setTable(mTesoreriaConstantes.COBRANZATMP);
        register.setId(Cairo.Constants.NEW_ID);

        var w_fields = register.getFields();
        w_fields.add2(mTesoreriaConstantes.COBZ_NUMERO, 0, Cairo.Constants.Types.long);
        var w_pGetComprobante = pGetComprobante();
        // PrintDoc
        //
        m_lastNroDoc = SetMask(w_pGetComprobante.getValue(), w_pGetComprobante.getTextMask());
        register.getFields().add2(mTesoreriaConstantes.COBZ_NRODOC, m_lastNroDoc, Cairo.Constants.Types.text);
        w_fields.add2(mTesoreriaConstantes.COBZ_DESCRIP, pGetDescrip().getValue(), Cairo.Constants.Types.text);
        w_fields.add2(mTesoreriaConstantes.COBZ_FECHA, pGetFecha().getValue(), Cairo.Constants.Types.date);
        m_lastCli = pGetCliente();
        w_fields.add2(mTesoreriaConstantes.CLI_ID, m_lastCli, Cairo.Constants.Types.id);
        w_fields.add2(mTesoreriaConstantes.CCOS_ID, pGetCentroCosto().getSelectId(), Cairo.Constants.Types.id);
        w_fields.add2(mTesoreriaConstantes.SUC_ID, pGetSucursal().getSelectId(), Cairo.Constants.Types.id);
        w_fields.add2(mTesoreriaConstantes.DOC_ID, pGetDoc(), Cairo.Constants.Types.id);
        w_fields.add2(mTesoreriaConstantes.COBZ_COTIZACION, Cairo.Util.val(pGetCotizacion().getValue()), Cairo.Constants.Types.double);
        w_fields.add2(mTesoreriaConstantes.COB_ID, pGetCobrador().getSelectId(), Cairo.Constants.Types.id);
        w_fields.add2(mTesoreriaConstantes.LGJ_ID, pGetLegajo().getSelectId(), Cairo.Constants.Types.id);
        w_fields.add2(mTesoreriaConstantes.COBZ_HOJA_RUTA, CInt(m_isHojaRuta), Cairo.Constants.Types.boolean);

        w_fields.add2(mTesoreriaConstantes.COBZ_NETO, Cairo.Util.val(pGetCobroNeto().getValue()), Cairo.Constants.Types.currency);
        w_fields.add2(mTesoreriaConstantes.COBZ_OTROS, Cairo.Util.val(pGetCobroOtros().getValue()), Cairo.Constants.Types.currency);
        w_fields.add2(mTesoreriaConstantes.COBZ_TOTAL, Cairo.Util.val(pGetCobroTotal().getValue()), Cairo.Constants.Types.currency);

        w_fields.add2(mTesoreriaConstantes.COBZ_GRABAR_ASIENTO, 1, Cairo.Constants.Types.boolean);
        w_fields.add2(Cairo.Constants.EST_ID, CSGeneralEx2.csEEstado.cSEEST_PENDIENTE, Cairo.Constants.Types.id);
        w_fields.add2(mTesoreriaConstantes.COBZ_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);

        w_fields.setHaveLastUpdate(true);
        w_fields.setHaveWhoModify(true);

        if(!register.beginTrans(Cairo.Database)) { return _rtn; }

        if(!Cairo.Database.save(register, , "pSave", C_MODULE, c_ErrorSave)) { return _rtn; }

        m_iOrden = 0;
        if(!pSaveCheques(register.getID())) { return _rtn; }
        if(!pSaveEfectivo(register.getID())) { return _rtn; }
        if(!pSaveTarjetas(register.getID())) { return _rtn; }
        if(!pSaveOtros(register.getID())) { return _rtn; }
        if(!pSaveCtaCte(register.getID())) { return _rtn; }
        if(!pSaveFacturas(register.getID(), aplicado)) { return _rtn; }

        if(!pSaveDifCambio(register.getID(), aplicado)) { return _rtn; }

        if(!register.commitTrans()) { return _rtn; }

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_DocCobranzaSave "+ register.getID().toString();
        if(!Cairo.Database.openRs(sqlstmt, rs, , , , "pSave", C_MODULE, c_ErrorSave)) { return _rtn; }

        if(rs.isEOF()) { return _rtn; }

        var id = null;
        if(!GetDocIDFromRecordset(rs, id)) { return _rtn; }

        m_id = id;

        _rtn = m_id !== 0;

        return _rtn;
      };

      var pSaveCheques = function(id) {
        var register = null;
        var row = null;
        var cell = null;
        var i = null;

        var _count = pGetCheques().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetCheques().getRows().item(_i);

          i = i + 1;
          if(!pIsEmptyRowCheques(row, i)) {

            register = new cRegister();

            register.setFieldId(mTesoreriaConstantes.COBZI_TMPID);
            register.setTable(mTesoreriaConstantes.COBRANZAITEMTMP);
            register.setId(Cairo.Constants.NEW_ID);

            var w_fields = register.getFields();

            var _count = row.size();
            for (var _j = 0; _j < _count; _j++) {
              cell = row.item(_j);
              switch (cell.getKey()) {

                case KICH_DESCRIP:
                  w_fields.add2(mTesoreriaConstantes.COBZI_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KICH_CHEQUE:
                  w_fields.add2(mTesoreriaConstantes.COBZI_TMPCHEQUE, cell.getValue(), Cairo.Constants.Types.text);

                  break;

                case KICH_CLE_ID:
                  w_fields.add2(mTesoreriaConstantes.CLE_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KICH_BCO_ID:
                  w_fields.add2(mTesoreriaConstantes.BCO_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KICH_MON_ID:
                  w_fields.add2(mTesoreriaConstantes.MON_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KICH_FECHACOBRO:
                  w_fields.add2(mTesoreriaConstantes.COBZI_TMPFECHA_COBRO, cell.getValue(), Cairo.Constants.Types.date);
                  break;

                case KICH_FECHAVTO:
                  w_fields.add2(mTesoreriaConstantes.COBZI_TMPFECHA_VTO, cell.getValue(), Cairo.Constants.Types.date);

                  break;

                case KICH_CUE_ID:
                  w_fields.add2(mTesoreriaConstantes.CUE_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KICH_IMPORTEORIGEN:
                  w_fields.add2(mTesoreriaConstantes.COBZI_IMPORTE_ORIGEN, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                  break;

                case KICH_IMPORTE:
                  w_fields.add2(mTesoreriaConstantes.COBZI_IMPORTE, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                  break;

                case KICH_PROPIO:
                  w_fields.add2(mTesoreriaConstantes.COBZI_TMPPROPIO, cell.getId(), Cairo.Constants.Types.boolean);
                  break;
              }
            }

            m_iOrden = m_iOrden + 1;
            w_fields.add2(mTesoreriaConstantes.COBZI_ORDEN, m_iOrden, Cairo.Constants.Types.integer);
            w_fields.add2(mTesoreriaConstantes.COBZI_TIPO, csECobranzaItemTipo.cSECOBZITCHEQUES, Cairo.Constants.Types.integer);
            w_fields.add2(mTesoreriaConstantes.COBZ_TMPID, id, Cairo.Constants.Types.id);
            w_fields.add2(mTesoreriaConstantes.COBZI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);
            w_fields.add2(mTesoreriaConstantes.COBZI_OTRO_TIPO, csEItemOtroTipo.cSEOTRODEBE, Cairo.Constants.Types.integer);

            w_fields.setHaveLastUpdate(false);
            w_fields.setHaveWhoModify(false);

            if(!Cairo.Database.save(register, , "pSaveCheques", C_MODULE, c_ErrorSave)) { return false; }
          }
        }

        return true;
      };

      var pSaveFacturas = function(id,  aplicado) { // TODO: Use of ByRef founded Private Function pSaveFacturas(ByVal Id As Long, ByRef Aplicado As Double) As Boolean

        var register = null;
        var bSave = null;
        var row = null;
        var cell = null;
        var pago = null;
        var cotiOrigen = null;
        var cotiCobranza = null;

        var maxPago = null;

        //-------------------------------------------------
        // Aplicacion de Diferencias de cambio
        //
        var aplicarND = null;

        aplicarND = pGetAplicDifCambio().getListItemData() === csEAplicacionDifCambio.cSEDIFAPLICACION_ND;

        //-------------------------------------------------
        // Determinamos la aplicacion de cada factura
        //
        var _count = pGetFacturas().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetFacturas().getRows().item(_i);

          register = new cRegister();

          register.setFieldId(mTesoreriaConstantes.FV_COBZ_TMPID);
          register.setTable(mTesoreriaConstantes.FACTURAVENTACOBRANZATMP);
          register.setId(Cairo.Constants.NEW_ID);

          bSave = false;

          var w_fields = register.getFields();

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            if(Dialogs.cell(row, KI_SELECT).getID()) {
              bSave = true;
              switch (cell.getKey()) {
                case KI_FV_ID:
                  w_fields.add2(mTesoreriaConstantes.FV_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KI_FVD_ID:
                  w_fields.add2(mTesoreriaConstantes.FVD_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KI_APLICAR:
                  pago = Cairo.Util.val(cell.getValue());
                  break;

                case KI_IMPORTEORIGEN:
                  w_fields.add2(mTesoreriaConstantes.FV_COBZ_IMPORTE_ORIGEN, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double);
                  break;

                case KI_COTIZACION:
                  cotiOrigen = Cairo.Util.val(cell.getValue());
                  break;

                case KI_COTIZACION2:
                  cotiCobranza = Cairo.Util.val(cell.getValue());
                  w_fields.add2(mTesoreriaConstantes.FV_COBZ_COTIZACION, cotiCobranza, Cairo.Constants.Types.double);
                  break;

                case KI_PENDIENTE:
                  maxPago = Cairo.Util.val(cell.getValue());
                  break;
              }
            }
          }

          if(bSave) {

            // Si hay diferencia de cambio y la cotizacion original
            // del comprobante es menor que la de la cobranza aplico
            // SIEMPRE por la cotizacion del comprobante
            if(cotiOrigen < cotiCobranza) {

              // Si aplica primero sobre la ND por dif. de cambio
              //
              if(aplicarND) {

                pago = pago / cotiCobranza * cotiOrigen;

              }
              else {

                if(pago > maxPago) { pago = maxPago; }

              }

            }

            aplicado = aplicado + pago;

            w_fields.add2(mTesoreriaConstantes.FV_COBZ_IMPORTE, pago, Cairo.Constants.Types.double);
            w_fields.add2(mTesoreriaConstantes.FV_COBZ_ID, 0, Cairo.Constants.Types.long);
            w_fields.add2(mTesoreriaConstantes.COBZ_TMPID, id, Cairo.Constants.Types.id);
            w_fields.add2(mTesoreriaConstantes.COBZ_ID, 0, Cairo.Constants.Types.long);

            w_fields.setHaveLastUpdate(false);
            w_fields.setHaveWhoModify(false);

            if(!Cairo.Database.save(register, , "pSaveFacturas", C_MODULE, c_ErrorSave)) { return false; }
          }

        }

        return true;
      };

      var pSaveTarjetas = function(id) {
        var register = null;
        var property = null;

        var row = null;
        var cell = null;
        var i = null;

        var _count = pGetTarjetas().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetTarjetas().getRows().item(_i);

          i = i + 1;
          if(!pIsEmptyRowTarjetas(row, i)) {

            register = new cRegister();

            register.setFieldId(mTesoreriaConstantes.COBZI_TMPID);
            register.setTable(mTesoreriaConstantes.COBRANZAITEMTMP);
            register.setId(Cairo.Constants.NEW_ID);

            var w_fields = register.getFields();

            var _count = row.size();
            for (var _j = 0; _j < _count; _j++) {
              cell = row.item(_j);
              switch (cell.getKey()) {

                case KIT_DESCRIP:
                  w_fields.add2(mTesoreriaConstantes.COBZI_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KIT_CUPON:
                  w_fields.add2(mTesoreriaConstantes.COBZI_TMPCUPON, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KIT_TJC_ID:
                  w_fields.add2(mTesoreriaConstantes.TJC_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KIT_TJCCU_ID:
                  w_fields.add2(mTesoreriaConstantes.TJCCU_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KIT_MON_ID:
                  w_fields.add2(mTesoreriaConstantes.MON_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KIT_FECHAVTO:
                  w_fields.add2(mTesoreriaConstantes.COBZI_TMPFECHA_VTO, cell.getValue(), Cairo.Constants.Types.date);
                  break;

                case KIT_TITULAR:
                  w_fields.add2(mTesoreriaConstantes.COBZI_TMPTITULAR, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KIT_NROTARJETA:
                  w_fields.add2(mTesoreriaConstantes.COBZI_TMPNRO_TARJETA, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KIT_NROAUTORIZACION:
                  w_fields.add2(mTesoreriaConstantes.COBZI_TMPAUTORIZACION, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KIT_TARJETA_TIPO:
                  w_fields.add2(mTesoreriaConstantes.COBZI_TARJETA_TIPO, cell.getId(), Cairo.Constants.Types.long);
                  break;

                case KIT_IMPORTEORIGEN:
                  w_fields.add2(mTesoreriaConstantes.COBZI_IMPORTE_ORIGEN, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                  break;

                case KIT_IMPORTE:
                  w_fields.add2(mTesoreriaConstantes.COBZI_IMPORTE, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                  break;
              }
            }

            m_iOrden = m_iOrden + 1;
            w_fields.add2(mTesoreriaConstantes.COBZI_ORDEN, m_iOrden, Cairo.Constants.Types.integer);
            w_fields.add2(mTesoreriaConstantes.COBZI_TIPO, csECobranzaItemTipo.cSECOBZITTARJETA, Cairo.Constants.Types.integer);
            w_fields.add2(mTesoreriaConstantes.COBZ_TMPID, id, Cairo.Constants.Types.id);
            w_fields.add2(mTesoreriaConstantes.COBZI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);
            w_fields.add2(mTesoreriaConstantes.COBZI_OTRO_TIPO, csEItemOtroTipo.cSEOTRODEBE, Cairo.Constants.Types.integer);

            w_fields.setHaveLastUpdate(false);
            w_fields.setHaveWhoModify(false);

            if(!Cairo.Database.save(register, , "pSaveTarjetas", C_MODULE, c_ErrorSave)) { return false; }
          }
        }

        return true;
      };

      var pSaveOtros = function(id) {
        var register = null;
        var property = null;

        var row = null;
        var cell = null;
        var i = null;

        var _count = pGetOtros().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetOtros().getRows().item(_i);

          i = i + 1;
          if(!pIsEmptyRowOtros(row, i)) {

            register = new cRegister();

            register.setFieldId(mTesoreriaConstantes.COBZI_TMPID);
            register.setTable(mTesoreriaConstantes.COBRANZAITEMTMP);
            register.setId(Cairo.Constants.NEW_ID);

            var w_fields = register.getFields();

            var _count = row.size();
            for (var _j = 0; _j < _count; _j++) {
              cell = row.item(_j);
              switch (cell.getKey()) {

                case KIO_DESCRIP:
                  w_fields.add2(mTesoreriaConstantes.COBZI_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KIO_RET_ID:
                  w_fields.add2(mTesoreriaConstantes.RET_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KIO_NRORETENCION:
                  w_fields.add2(mTesoreriaConstantes.COBZI_NRO_RETENCION, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KIO_PORCRETENCION:
                  w_fields.add2(mTesoreriaConstantes.COBZI_PORC_RETENCION, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.double);
                  break;

                case KIO_CCOS_ID:
                  w_fields.add2(mTesoreriaConstantes.CCOS_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KIO_FV_ID_RET:
                  w_fields.add2(mTesoreriaConstantes.FV_ID_RET, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KIO_CUE_ID:
                  w_fields.add2(mTesoreriaConstantes.CUE_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KIO_FECHARETENCION:
                  if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.date)) {
                    w_fields.add2(mTesoreriaConstantes.COBZI_FECHA_RETENCION, cell.getValue(), Cairo.Constants.Types.date);
                  }
                  break;

                case KIO_IMPORTEORIGEN:
                  w_fields.add2(mTesoreriaConstantes.COBZI_IMPORTE_ORIGEN, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                  break;

                case KIO_DEBE:
                  if(Cairo.Util.val(cell.getValue()) !== 0) {
                    w_fields.add2(mTesoreriaConstantes.COBZI_IMPORTE, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                    w_fields.add2(mTesoreriaConstantes.COBZI_OTRO_TIPO, csEItemOtroTipo.cSEOTRODEBE, Cairo.Constants.Types.integer);
                  }
                  break;

                case KIO_HABER:
                  if(Cairo.Util.val(cell.getValue()) !== 0) {
                    w_fields.add2(mTesoreriaConstantes.COBZI_IMPORTE, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                    w_fields.add2(mTesoreriaConstantes.COBZI_OTRO_TIPO, csEItemOtroTipo.cSEOTROHABER, Cairo.Constants.Types.integer);
                  }
                  break;
              }
            }

            m_iOrden = m_iOrden + 1;
            w_fields.add2(mTesoreriaConstantes.COBZI_ORDEN, m_iOrden, Cairo.Constants.Types.integer);
            w_fields.add2(mTesoreriaConstantes.COBZI_TIPO, csECobranzaItemTipo.cSECOBZITOTROS, Cairo.Constants.Types.integer);
            w_fields.add2(mTesoreriaConstantes.COBZ_TMPID, id, Cairo.Constants.Types.id);
            w_fields.add2(mTesoreriaConstantes.COBZI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);

            w_fields.setHaveLastUpdate(false);
            w_fields.setHaveWhoModify(false);

            if(!Cairo.Database.save(register, , "pSaveOtros", C_MODULE, c_ErrorSave)) { return false; }
          }
        }

        return true;
      };

      var pSaveEfectivo = function(id) {
        var register = null;
        var row = null;
        var cell = null;
        var i = null;

        var _count = pGetEfectivo().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetEfectivo().getRows().item(_i);

          i = i + 1;
          if(!pIsEmptyRowEfectivo(row, i)) {

            register = new cRegister();

            register.setFieldId(mTesoreriaConstantes.COBZI_TMPID);
            register.setTable(mTesoreriaConstantes.COBRANZAITEMTMP);
            register.setId(Cairo.Constants.NEW_ID);

            var w_fields = register.getFields();

            var _count = row.size();
            for (var _j = 0; _j < _count; _j++) {
              cell = row.item(_j);
              switch (cell.getKey()) {

                case KIE_DESCRIP:
                  w_fields.add2(mTesoreriaConstantes.COBZI_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KIE_CUE_ID:
                  w_fields.add2(mTesoreriaConstantes.CUE_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KIE_IMPORTEORIGEN:
                  w_fields.add2(mTesoreriaConstantes.COBZI_IMPORTE_ORIGEN, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                  break;

                case KIE_IMPORTE:
                  w_fields.add2(mTesoreriaConstantes.COBZI_IMPORTE, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                  break;
              }
            }

            m_iOrden = m_iOrden + 1;
            w_fields.add2(mTesoreriaConstantes.COBZI_ORDEN, m_iOrden, Cairo.Constants.Types.integer);
            w_fields.add2(mTesoreriaConstantes.COBZI_TIPO, csECobranzaItemTipo.cSECOBZITEFECTIVO, Cairo.Constants.Types.integer);
            w_fields.add2(mTesoreriaConstantes.COBZ_TMPID, id, Cairo.Constants.Types.id);
            w_fields.add2(mTesoreriaConstantes.COBZI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);
            w_fields.add2(mTesoreriaConstantes.COBZI_OTRO_TIPO, csEItemOtroTipo.cSEOTRODEBE, Cairo.Constants.Types.integer);

            w_fields.setHaveLastUpdate(false);
            w_fields.setHaveWhoModify(false);

            if(!Cairo.Database.save(register, , "pSaveEfectivo", C_MODULE, c_ErrorSave)) { return false; }
          }
        }

        return true;
      };

      var pSaveCtaCte = function(id) {
        var register = null;
        var row = null;
        var cell = null;

        var _count = pGetCtaCte().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetCtaCte().getRows().item(_i);

          register = new cRegister();

          register.setFieldId(mTesoreriaConstantes.COBZI_TMPID);
          register.setTable(mTesoreriaConstantes.COBRANZAITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var w_fields = register.getFields();

          var _count = row.size();
          for (var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KICC_CUE_ID:
                w_fields.add2(mTesoreriaConstantes.CUE_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KICC_IMPORTEORIGEN:
                w_fields.add2(mTesoreriaConstantes.COBZI_IMPORTE_ORIGEN, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                break;

              case KICC_IMPORTE:
                w_fields.add2(mTesoreriaConstantes.COBZI_IMPORTE, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
                break;
            }
          }

          m_iOrden = m_iOrden + 1;
          w_fields.add2(mTesoreriaConstantes.COBZI_ORDEN, m_iOrden, Cairo.Constants.Types.integer);
          w_fields.add2(mTesoreriaConstantes.COBZI_TIPO, csECobranzaItemTipo.cSECOBZITCTA_CTE, Cairo.Constants.Types.integer);
          w_fields.add2(mTesoreriaConstantes.COBZ_TMPID, id, Cairo.Constants.Types.id);
          w_fields.add2(mTesoreriaConstantes.COBZI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);
          w_fields.add2(mTesoreriaConstantes.COBZI_OTRO_TIPO, csEItemOtroTipo.cSEOTROHABER, Cairo.Constants.Types.integer);

          w_fields.setHaveLastUpdate(false);
          w_fields.setHaveWhoModify(false);

          if(!Cairo.Database.save(register, , "pSaveCtaCte", C_MODULE, c_ErrorSave)) { return false; }
        }

        return true;
      };

      var pSaveDifCambio = function(id,  aplicado) {
        var _rtn = null;
        if(pGetDefaultDifCambio().getListItemData() === csEModoDifCambio.cSEDIF_CAMBIOCUENTA) {
          _rtn = pSaveDifCambioCtaCble(id);
        }
        else {
          _rtn = pSaveDifCambioNCND(id, aplicado);
        }

        return _rtn;
      };

      var pSaveDifCambioCtaCble = function(id) {
        var _rtn = null;
        var register = null;
        var property = null;
        var row = null;
        var cell = null;
        var cobrado = null;
        var deudaOrigen = null;
        var diferencia = null;
        var cue_id = null;

        deudaOrigen = pGetDeudaOrigen();
        cobrado = pGetCobrado();

        diferencia = Abs(deudaOrigen - cobrado);

        if(Cairo.Util.round(diferencia, 2) === 0) {
          _rtn = true;
          return _rtn;
        }

        cue_id = pGetCueIdDifCambio().getSelectId();

        if(cue_id === Cairo.Constants.NO_ID) {
          MsgWarning(getText(2153, ""));
          //Debe configurar la cuenta de "Diferencia de Cambio" para que el sistema pueda contabilizar los importes cobrados.
          return _rtn;
        }

        register = new cRegister();

        register.setFieldId(mTesoreriaConstantes.COBZI_TMPID);
        register.setTable(mTesoreriaConstantes.COBRANZAITEMTMP);
        register.setId(Cairo.Constants.NEW_ID);

        var w_fields = register.getFields();

        w_fields.add2(mTesoreriaConstantes.COBZI_DESCRIP, "Diferencia de cambio", Cairo.Constants.Types.text);
        w_fields.add2(mTesoreriaConstantes.CUE_ID, cue_id, Cairo.Constants.Types.id);

        if(deudaOrigen > cobrado) {
          w_fields.add2(mTesoreriaConstantes.COBZI_IMPORTE, deudaOrigen - cobrado, Cairo.Constants.Types.currency);
          w_fields.add2(mTesoreriaConstantes.COBZI_OTRO_TIPO, csEItemOtroTipo.cSEOTRODEBE, Cairo.Constants.Types.integer);
        }
        else {
          w_fields.add2(mTesoreriaConstantes.COBZI_IMPORTE, Abs(deudaOrigen - cobrado), Cairo.Constants.Types.currency);
          w_fields.add2(mTesoreriaConstantes.COBZI_OTRO_TIPO, csEItemOtroTipo.cSEOTROHABER, Cairo.Constants.Types.integer);
        }

        m_iOrden = m_iOrden + 1;
        w_fields.add2(mTesoreriaConstantes.COBZI_ORDEN, m_iOrden, Cairo.Constants.Types.integer);
        w_fields.add2(mTesoreriaConstantes.COBZI_TIPO, csECobranzaItemTipo.cSECOBZITOTROS, Cairo.Constants.Types.integer);
        w_fields.add2(mTesoreriaConstantes.COBZ_TMPID, id, Cairo.Constants.Types.id);
        w_fields.add2(mTesoreriaConstantes.COBZI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);

        w_fields.setHaveLastUpdate(false);
        w_fields.setHaveWhoModify(false);

        if(!Cairo.Database.save(register, , "pSaveOtros", C_MODULE, c_ErrorSave)) { return _rtn; }

        _rtn = true;

        return _rtn;
      };

      var pSaveDifCambioNCND = function(id,  aplicado) {
        var _rtn = null;
        var cobrado = null;
        var deudaOrigen = null;
        var diferencia = null;
        var fvTMPId = null;

        deudaOrigen = pGetDeudaOrigen();
        cobrado = pGetCobrado();

        diferencia = Abs(deudaOrigen - cobrado);

        if(Cairo.Util.round(diferencia, 2) === 0) {
          _rtn = true;
          return _rtn;
        }

        // Nota de debito
        if(deudaOrigen < cobrado) {

          if(!pSaveDocVta(id, pGetNDDifCambio().getSelectId(), diferencia, true, fvTMPId)) { return _rtn; }

          // Agrego la nota de debito a la coleccion de
          // aplicaciones con la cobranza
          //
          if(!pSaveCobranzaND(id, fvTMPId, diferencia, aplicado)) { return _rtn; }

          // Nota de credito
        }
        else {

          if(!pSaveDocVta(id, pGetNCDifCambio().getSelectId(), diferencia, false, fvTMPId)) { return _rtn; }

          // Aplico la nota de credito con cada una de las
          // facturas que generaron diferencias de cambio
          //
          if(!pSaveFacturaVentaNotaCredito(fvTMPId, diferencia)) { return _rtn; }

        }

        _rtn = true;

        return _rtn;
      };

      var pGetNCNDDocNumber = function(docId) {
        var tl = null;
        var tAL_ID = null;
        var sqlstmt = null;
        var rs = null;
        var mask = null;
        var rtn = null;

        if(docId === Cairo.Constants.NO_ID) {

          VBA.ex.Raise -1, , getText(2154, "");

          //"@@ERROR_SP:Debe configurar un documento " & _
          "para las notas de crédito/debito que se generan automaticamente.;;"(+ "Debe indicar estos documentos en el paso anterior para poder guardar esta cobranza.;;Utilize la opción [Configuracion\\Tesoreria\\General] en la solapa [Diferencia de Cambio] para indicar los documentos por defecto y evitará tener que indicarlos en cada cobranza.");

        }

        sqlstmt = "sp_clienteGetTalonario "+ pGetCliente().toString()+ ","+ docId.toString();
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return ""; }

        if(rs.isEOF()) {

          VBA.ex.Raise -1, , getText(2155, "");
          //@@ERROR_SP:No fue posible encontrar el talonario asociado al documento para notas de debito/crédito que se generan automaticamente.

        }

        tAL_ID = Cairo.Database.valField(rs.getFields(), 0);

        tl = new cTalonario();

        rtn = tl.GetNextNumber(tAL_ID, mask, false);
        if(LenB(mask)) { mask = mask.Substring(1, mask.Length - rtn.Length); }
        return mask+ rtn;
      };

      var pSaveDocVta = function(cobzTMPId,  docId,  diferencia,  bIsND,  fvTMPId) { // TODO: Use of ByRef founded Private Function pSaveDocVta(ByVal CobzTMPId As Long, ByVal DocId As Long, ByVal Diferencia As Double, ByVal bIsND As Boolean, ByRef FvTMPId As Long) As Boolean
        var register = null;
        var neto = null;
        var ivaRi = null;
        var vIva() = null;
        var vItems() = null;

        if(!pGetIva(vIva)) { return false; }
        if(!pGetItems(vIva, vItems, diferencia, bIsND, neto, ivaRi)) { return false; }

        register = new cRegister();

        register.setFieldId(mTesoreriaConstantes.FV_TMPID);
        register.setTable(mTesoreriaConstantes.FACTURAVENTATMP);
        register.setId(Cairo.Constants.NEW_ID);

        var w_fields = register.getFields();

        w_fields.add2(mTesoreriaConstantes.FV_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);
        w_fields.add2(mTesoreriaConstantes.COBZ_TMPID, cobzTMPId, Cairo.Constants.Types.id);

        w_fields.add2(mTesoreriaConstantes.FV_NUMERO, 0, Cairo.Constants.Types.long);
        w_fields.add2(mTesoreriaConstantes.FV_NRODOC, pGetNCNDDocNumber(docId), Cairo.Constants.Types.text);

        w_fields.add2(mTesoreriaConstantes.FV_DESCRIP, pGetDescripNDNC(), Cairo.Constants.Types.text);
        w_fields.add2(mTesoreriaConstantes.FV_FECHA, pGetFechaNdNc().getValue(), Cairo.Constants.Types.date);
        w_fields.add2(mTesoreriaConstantes.FV_FECHAENTREGA, pGetFecha().getValue(), Cairo.Constants.Types.date);
        w_fields.add2(mTesoreriaConstantes.CLI_ID, pGetCliente(), Cairo.Constants.Types.id);
        w_fields.add2(mTesoreriaConstantes.SUC_ID, pGetSucursal().getSelectId(), Cairo.Constants.Types.id);
        w_fields.add2(mTesoreriaConstantes.DOC_ID, docId, Cairo.Constants.Types.id);
        w_fields.add2(mTesoreriaConstantes.CPG_ID, csECpgTipo.cSECPGT_FECHADOCUMENTO, Cairo.Constants.Types.id);
        w_fields.add2(mTesoreriaConstantes.LGJ_ID, pGetLegajo().getSelectId(), Cairo.Constants.Types.id);

        w_fields.add2(mTesoreriaConstantes.FV_NETO, neto, Cairo.Constants.Types.currency);
        w_fields.add2(mTesoreriaConstantes.FV_SUBTOTAL, neto, Cairo.Constants.Types.currency);
        w_fields.add2(mTesoreriaConstantes.FV_IVARI, ivaRi, Cairo.Constants.Types.currency);

        w_fields.add2(mTesoreriaConstantes.FV_TOTAL, neto + ivaRi, Cairo.Constants.Types.currency);
        w_fields.add2(mTesoreriaConstantes.FV_GRABAR_ASIENTO, 1, Cairo.Constants.Types.boolean);
        w_fields.add2(Cairo.Constants.EST_ID, CSGeneralEx2.csEEstado.cSEEST_PENDIENTE, Cairo.Constants.Types.id);

        w_fields.setHaveLastUpdate(true);
        w_fields.setHaveWhoModify(true);

        var c_ErrorSave = null;

        if(bIsND) {
          //' Error al grabar la Nota de Débito
          c_ErrorSave = getText(2156, "");
        }
        else {
          //' Error al grabar la Nota de Crédito
          c_ErrorSave = getText(2157, "");
        }

        if(!register.beginTrans(Cairo.Database)) { return false; }

        if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return false; }

        if(!pSaveItemsNCND(register.getID(), vItems[], c_ErrorSave)) { return false; }
        if(!register.commitTrans()) { return false; }

        fvTMPId = register.getID();

        return true;
      };

      var pSaveItemsNCND = function(id,  vItems,  strError) { // TODO: Use of ByRef founded Private Function pSaveItemsNCND(ByVal Id As Long, ByRef vItems(mainTransaction) As T_Item, ByVal strError As String) As Boolean
        var transaction = new Cairo.Database.Transaction();
        var iOrden = null;
        var pR_ID = null;
        var cue_id = null;
        var cue_id_ivari = null;

        var register = new Cairo.Database.Register();

        var fields = register.getFields();
        register.setFieldId(mTesoreriaConstantes.FVI_TMPID);
        register.setTable(mTesoreriaConstantes.FACTURAVENTAITEMTMP);

        pR_ID = pGetPrIdDifCambio().getSelectId();
        if(!pGetCuentas(pR_ID, cue_id, cue_id_ivari)) { return false; }

        for (iOrden = 1; iOrden <= vItems.Length; iOrden++) {
          fields.add(mTesoreriaConstantes.FVI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.integer);
          fields.add(mTesoreriaConstantes.FVI_CANTIDAD, 1, Cairo.Constants.Types.double);
          fields.add(mTesoreriaConstantes.FVI_PRECIO, vItems.importe, Cairo.Constants.Types.currency);
          fields.add(mTesoreriaConstantes.FVI_PRECIO_USR, vItems.importe, Cairo.Constants.Types.currency);
          fields.add(mTesoreriaConstantes.FVI_NETO, vItems.importe, Cairo.Constants.Types.currency);
          fields.add(mTesoreriaConstantes.FVI_IVARI, vItems.ImporteIva, Cairo.Constants.Types.currency);
          fields.add(mTesoreriaConstantes.FVI_IVARIPORC, vItems.TasaIva, Cairo.Constants.Types.double);
          fields.add(mTesoreriaConstantes.PR_ID, pR_ID, Cairo.Constants.Types.id);
          fields.add(mTesoreriaConstantes.FVI_IMPORTE, vItems.importe + vItems.ImporteIva, Cairo.Constants.Types.currency);
          fields.add(mTesoreriaConstantes.CUE_ID, cue_id, Cairo.Constants.Types.id);
          fields.add(mTesoreriaConstantes.CUE_ID_IVA_RI, cue_id_ivari, Cairo.Constants.Types.id);
          fields.add(mTesoreriaConstantes.FVI_ORDEN, iOrden, Cairo.Constants.Types.integer);
          fields.add(mTesoreriaConstantes.FV_TMPID, id, Cairo.Constants.Types.id);

          register.setId(Cairo.Constants.NEW_ID);

          var w_var fields = register.getFields();
          w_fields.setHaveLastUpdate(false);
          w_fields.setHaveWhoModify(false);

          transaction.addRegister(register);

          register.getFields().clear();

        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      var pGetItems = function(vIva,  vItems,  diferencia,  bIsND,  neto,  totalIva) { // TODO: Use of ByRef founded Private Function pGetItems(ByRef vIva() As T_Iva, ByRef vItems() As T_Item, ByVal Diferencia As Double, ByVal bIsND As Boolean, ByRef Neto As Double, ByRef TotalIva As Double) As Boolean
        var i = null;
        var iva = null;
        var base = null;
        var modoIva = null;
        var importe = null;
        var importeIva = null;

        G.redim(vItems, vIva.Length);
        modoIva = pGetModoIvaDifCambio().getListItemData();

        neto = 0;
        totalIva = 0;

        for (i = 1; i <= vIva.Length; i++) {
          iva = iva + vIva(i).importe;
        }

        // Solo voy hasta el anteultimo
        // El ultimo me lo reservo para liquidar lo
        // que quede de la diferencia y me evito problemas
        // de redondeo
        for (i = 1; i <= vIva.Length - 1; i++) {

          // Porcentaje del Neto imponible para cada tasa de iva
          base = diferencia * DivideByCero(vIva(i).importe, iva);

          // Si hay que usar el iva como base imponible y se trata
          // de una nota de debito
          if(modoIva === csEModoIvaDifCambio.cSEDIFIVAIMPONIBLE && bIsND) {
            importeIva = base * vIva(i).porcentaje / 100;
            importe = base;

            // Si es una nota de credito o no hay que usar el iva como
            // base imponible
          }
          else {
            importe = base / (1 + vIva(i).porcentaje / 100);
            importeIva = importe * vIva(i).porcentaje / 100;
          }

          vItems.importe = importe;
          vItems.ImporteIva = importeIva;
          vItems.TasaIva = vIva(i).porcentaje;

          neto = neto + importe;
          totalIva = totalIva + importeIva;
        }

        // Si la diferencia es distinta del neto y use el iva como base imponible y es una nota de debito
        // o
        // si la diferencia es distinta del neto mas el iva y
        //         (no tome el iva como base imponible o es una nota de credito) -> {en ambos casos no se toma el iva como base imponible}
        //
        if((diferencia !== neto && modoIva === csEModoIvaDifCambio.cSEDIFIVAIMPONIBLE && bIsND) || (diferencia !== neto + importeIva && (modoIva === csEModoIvaDifCambio.cSEDIFIVANOIMPONIBLE || !bIsND))) {

          i = vIva.Length;

          if(modoIva === csEModoIvaDifCambio.cSEDIFIVAIMPONIBLE && bIsND) {
            // Porcentaje del Neto imponible para cada tasa de iva
            base = diferencia - neto;

            //'(ModoIva = csEDifIvaNoImponible Or Not bIsND)
          }
          else {
            base = diferencia - neto - totalIva;
          }

          // Si hay que usar el iva como base imponible y se trata
          // de una nota de debito
          if(modoIva === csEModoIvaDifCambio.cSEDIFIVAIMPONIBLE && bIsND) {
            importeIva = base * vIva(i).porcentaje / 100;
            importe = base;

            // Si es una nota de credito o no hay que usar el iva como
            // base imponible
          }
          else {
            importe = base / (1 + vIva(i).porcentaje / 100);
            importeIva = importe * vIva(i).porcentaje / 100;
          }

          vItems.importe = importe;
          vItems.ImporteIva = importeIva;
          vItems.TasaIva = vIva(i).porcentaje;

          neto = neto + importe;
          totalIva = totalIva + importeIva;
        }

        return true;
      };

      var pGetIva = function(vIva) { // TODO: Use of ByRef founded Private Function pGetIva(ByRef vIva() As T_Iva) As Boolean
        var sqlstmt = null;
        var rs = null;
        var fvIds = null;
        var i = null;

        G.redim(vIva, 0);

        fvIds = pGetFvIds();
        sqlstmt = "select fvi_ivariporc, sum(fvi_ivari) as fvi_ivari from FacturaVentaItem where fv_id in("+ fvIds+ ") group by fvi_ivariporc  order by fvi_ivariporc desc";

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

        if(!rs.isEOF()) {
          rs.MoveLast;
          rs.MoveFirst;
          G.redim(vIva, rs.RecordCount);
        }

        while (!rs.isEOF()) {
          i = i + 1;
          vIva.importe = Cairo.Database.valField(rs.getFields(), mTesoreriaConstantes.FVI_IVARI);
          vIva.porcentaje = Cairo.Database.valField(rs.getFields(), mTesoreriaConstantes.FVI_IVARIPORC);
          rs.MoveNext;
        }
        return true;
      };

      var pGetFvIds = function() {
        var rtn = null;
        var row = null;

        var _count = pGetFacturas().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetFacturas().getRows().item(_i);
          if(Dialogs.cell(row, KI_SELECT).getID()) {
            if(Cairo.Util.val(Dialogs.cell(row, KI_APLICAR).getValue())) {
              rtn = rtn+ Dialogs.cell(row, KI_FV_ID).getID().toString()+ ",";
            }
          }
        }

        return RemoveLastColon(rtn);
      };

      // Proposito: Vincula la nota de debito por dif. de cambio con la cobranza
      //
      var pSaveCobranzaND = function(id,  fvTMPId,  importe,  aplicado) {

        var aplicar = null;

        // Vemos cuanta guita queda sin aplicar
        //
        aplicar = Cairo.Util.val(pGetCobroTotal().getValue()) - aplicado;

        //
        // Solo aplicamos si queda algo de guita
        //
        if(aplicar > 0) {

          if(importe > aplicar) {
            importe = aplicar;
          }

          var register = null;

          register = new cRegister();

          register.setFieldId(mTesoreriaConstantes.FV_COBZ_TMPID);
          register.setTable(mTesoreriaConstantes.FACTURAVENTACOBRANZATMP);
          register.setId(Cairo.Constants.NEW_ID);

          var w_fields = register.getFields();

          //' Indica que se trata de una ND aun
          w_fields.add2(mTesoreriaConstantes.FV_ID, fvTMPId * -1, Cairo.Constants.Types.id);
          // no generada el sp_DocCobranzaSave
          // Graba la ND y luego la vincula con
          // la cobranza
          //
          //' Indica que la deuda sera generada
          w_fields.add2(mTesoreriaConstantes.FVD_ID, -1, Cairo.Constants.Types.id);
          // por el sp_DocCobranzaSave
          //

          w_fields.add2(mTesoreriaConstantes.FV_COBZ_IMPORTE, importe, Cairo.Constants.Types.double);
          w_fields.add2(mTesoreriaConstantes.FV_COBZ_ID, 0, Cairo.Constants.Types.long);
          w_fields.add2(mTesoreriaConstantes.COBZ_TMPID, id, Cairo.Constants.Types.id);
          w_fields.add2(mTesoreriaConstantes.COBZ_ID, 0, Cairo.Constants.Types.long);

          w_fields.setHaveLastUpdate(false);
          w_fields.setHaveWhoModify(false);

          if(!Cairo.Database.save(register, , "pSaveCobranzaND", C_MODULE, c_ErrorSave)) { return false; }

        }

        return true;
      };

      // Proposito: Vincular la nota de credito por dif. de cambio con las facturas de
      //            esta cobranza
      var pSaveFacturaVentaNotaCredito = function(fvTMPId,  importe) {
        var row = null;
        var aCobrar = null;
        var cobrado = null;
        var diferencia = null;

        // Por cada factura con diferencia de cambio
        // aplico contra esta nota de credito
        var _count = pGetFacturas().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetFacturas().getRows().item(_i);

          if(Dialogs.cell(row, KI_MONEDA).getID() !== m_monDefault) {

            cobrado = Cairo.Util.val(Dialogs.cell(row, KI_APLICAR).getValue());
            // (Cobrado dividido la cotizacion a la que estoy cobrando) por la cotizacion de la factura

            aCobrar = DivideByCero(cobrado, Cairo.Util.val(Dialogs.cell(row, KI_COTIZACION2).getValue())) * Cairo.Util.val(Dialogs.cell(row, KI_COTIZACION).getValue());

            diferencia = aCobrar - cobrado;
            if(importe < diferencia) { diferencia = importe; }

            if(!pSaveFVNCAux(fvTMPId, Dialogs.cell(row, KI_FV_ID).getID(), Dialogs.cell(row, KI_FVD_ID).getID(), diferencia)) { return false; }

            importe = importe - diferencia;

            if(importe <= 0) { break; }
          }
        }

        return true;
      };

      var pSaveFVNCAux = function(fvTMPId,  fvIdFactura,  fvdIdFactura,  importe) {
        var register = null;

        register = new cRegister();

        register.setFieldId(mTesoreriaConstantes.FV_NC_TMPID);
        register.setTable(mTesoreriaConstantes.FACTURAVENTANOTACREDITOTMP);
        register.setId(Cairo.Constants.NEW_ID);

        var w_fields = register.getFields();

        w_fields.add2(mTesoreriaConstantes.FV_TMPID, fvTMPId, Cairo.Constants.Types.id);

        // Indica que se trata de una NC aun
        // no generada el sp_DocCobranzaSave
        // Graba la NC y luego la vincula con
        // las facturas
        //
        w_fields.add2(mTesoreriaConstantes.FV_ID_NOTA_CREDITO, fvTMPId * -1, Cairo.Constants.Types.id);

        // Indica que la deuda sera generada
        // por el sp_DocCobranzaSave
        //
        w_fields.add2(mTesoreriaConstantes.FVD_ID_NOTA_CREDITO, -1, Cairo.Constants.Types.id);

        w_fields.add2(mTesoreriaConstantes.FV_ID_FACTURA, fvIdFactura, Cairo.Constants.Types.id);
        w_fields.add2(mTesoreriaConstantes.FVD_ID_FACTURA, fvdIdFactura, Cairo.Constants.Types.id);
        w_fields.add2(mTesoreriaConstantes.FV_NC_IMPORTE, importe, Cairo.Constants.Types.double);
        w_fields.add2(mTesoreriaConstantes.FV_NC_ID, 0, Cairo.Constants.Types.long);

        w_fields.setHaveLastUpdate(false);
        w_fields.setHaveWhoModify(false);

        if(!Cairo.Database.save(register, , "pSaveFVNCAux", C_MODULE, c_ErrorSave)) { return false; }

        return true;
      };

      var pGetCuentas = function(pR_ID,  cue_id,  cue_id_ivari) { // TODO: Use of ByRef founded Private Function pGetCuentas(ByVal PR_ID As Long, ByRef cue_id As Long, cue_id_ivari As Long) As Boolean
        var sqlstmt = null;
        var rs = null;
        var ti_id = null;
        var cueg_id = null;

        sqlstmt = "select cueg_id_venta, ti_id_ivariventa from producto where pr_id = "+ pR_ID.toString();
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }
        if(!rs.isEOF()) {
          cueg_id = Cairo.Database.valField(rs.getFields(), "cueg_id_venta");
          ti_id = Cairo.Database.valField(rs.getFields(), mTesoreriaConstantes.PR_TI_ID_RI_VENTA);

          sqlstmt = "select cue_id from ClienteCuentaGrupo where cli_id = "+ pGetCliente().toString()+ " and cueg_id = "+ cueg_id.toString();
          if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }
          if(!rs.isEOF()) {
            cue_id = Cairo.Database.valField(rs.getFields(), mTesoreriaConstantes.CUE_ID);
          }
          else {
            sqlstmt = "select cue_id from CuentaGrupo where cueg_id = "+ cueg_id.toString();
            if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }
            if(!rs.isEOF()) {
              cue_id = Cairo.Database.valField(rs.getFields(), mTesoreriaConstantes.CUE_ID);
            }
            else {
              MsgWarning(getText(2158, "", cueg_id));
              //No se pudo encontrar el grupo de cuentas con id  & cueg_id &  para que el Cairo pueda grabar la Nota de Débito/Crédito automáticamente.
              return null;
            }
          }
        }
        else {
          MsgWarning(getText(2159, ""));
          //Debe configurar el artículo "Diferencia de Cambio" en "Configuración > Tesorería > General", para que Cairo pueda grabar la Nota de Débito/Crédito automáticamente.
          return null;
        }

        sqlstmt = "select cue_id from TasaImpositiva where ti_id = "+ ti_id.toString();
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }
        if(!rs.isEOF()) { cue_id_ivari = Cairo.Database.valField(rs.getFields(), mTesoreriaConstantes.CUE_ID); }

        return true;
      };

      *#If Not PREPROC_SFS Then
      var pSetObjectForm = function() {
        var abmGen = null;
        var wizGen = null;

        wizGen = m_objWizard;
        abmGen = wizGen.ObjAbm;

        abmGen.FactoryObject = "CSABMInterface2.cFactory";
        abmGen.ObjForm = "CSABMInterface2.fwCobranza";
      };
      *#End If

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      var pGetMonedaAnticipo = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.ANTICIPO, DWC.MONEDA_ANTICIPO);
      };

      var pGetCuentaAnticipo = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.ANTICIPO, DWC.CUENTA_ANTICIPO);
      };

      var pGetCobroIndicado = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.COBRO_INDICADO);
      };

      var pGetCobroNeto = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.COBRO_NETO);
      };

      var pGetCobroOtros = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.COBRO_OTROS);
      };

      var pGetCobroTotal = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.COBRO_TOTAL);
      };

      var pGetTotal = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.TOTAL_PAGO);
      };

      var pGetTotalOrigen = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.TOTAL_PAGO_ORIGEN);
      };

      var pGetCliente2 = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.CLIENTE2);
      };

      var pGetClienteProperty = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_CLIENTE, DWC.CLIENTE);
      };

      var pGetCliente = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_CLIENTE, DWC.CLIENTE).getSelectId();
      };

      var pGetClienteName = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_CLIENTE, DWC.CLIENTE).getValue();
      };

      // Edit From ListDoc
      //
      var pGetOnlySelected = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_CLIENTE, DWC.ONLY_SELECTED);
      };

      var pGetCheques = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.CHEQUES).getGrid();
      };

      var pGetChequesProperty = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.CHEQUES);
      };

      var pGetTarjetas = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.TARJETAS).getGrid();
      };

      var pGetTarjetasProperty = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.TARJETAS);
      };

      var pGetEfectivo = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.EFECTIVO).getGrid();
      };

      var pGetEfectivoProperty = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.EFECTIVO);
      };

      var pGetOtros = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.OTROS).getGrid();
      };

      var pGetOtrosProperty = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.OTROS);
      };

      var pGetFacturas = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.FACTUAS).getGrid();
      };

      var pGetCtaCte = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.CTA_CTE).getGrid();
      };

      var pGetFacturasProperty = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.FACTUAS);
      };

      var pGetCtaCteProperty = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.CTA_CTE);
      };

      var pRefreshFacturas = function() {
        m_objWizard.showValue(cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.FACTUAS));
      };

      var pRefreshCtaCte = function() {
        m_objWizard.showValue(cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.CTA_CTE));
      };

      var pGetComprobante = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.COMPROBANTE);
      };

      var pGetCobrador = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.COBRADOR);
      };

      var pGetLegajo = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.LEGAJO);
      };

      var pGetDescrip = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.OBSERVACIONES);
      };

      var pGetCentroCosto = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.CENTRO_COSTO);
      };

      var pGetSucursal = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.SUCURSAL);
      };

      var pGetFecha = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.FECHA);
      };

      var pGetFechaNdNc = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.DIF_CAMBIO, DWC.FECHA_ND_NC);
      };

      var pGetDoc = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_CLIENTE, DWC.DOC).getSelectId();
      };

      var pGetDocName = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_CLIENTE, DWC.DOC).getValue();
      };

      var pGetVencidos = function() {
        return Cairo.Util.val(cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.VENCIDOS).getValue());
      };

      var pGetTodos = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.TODOS);
      };

      var pGetAgrupados = function() {
        return Cairo.Util.val(cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.AGRUPADOS).getValue());
      };

      var pGetCotizacion = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.COTIZACION);
      };

      var pGetCotizacionAnticipo = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.ANTICIPO, DWC.COTIZACION_ANTICIPO);
      };

      var pGetAnticipo = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.ANTICIPO);
      };

      var pGetAnticipoImporte = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.ANTICIPO, DWC.ANTICIPO_IMPORTE);
      };

      var pGetLabelCobros = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_COBROS, C_LABELCOBROS);
      };

      // Diferencias de cambio
      var pGetModoIvaDifCambio = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.DIF_CAMBIO, DWC.MODO_IVA_DIF_CAMBIO);
      };

      var pGetAplicDifCambio = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.DIF_CAMBIO, DWC.APLICACION_ND);
      };

      var pGetDefaultDifCambio = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.DIF_CAMBIO, DWC.DEFAULT_DIF_CAMBIO);
      };

      var pGetCueIdDifCambio = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.DIF_CAMBIO, DWC.CUE_ID_DIF_CAMBIO);
      };

      var pGetNCDifCambio = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.DIF_CAMBIO, DWC.NC_DIF_CAMBIO);
      };

      var pGetNDDifCambio = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.DIF_CAMBIO, DWC.ND_DIF_CAMBIO);
      };

      var pGetPrIdDifCambio = function() {
        return cIABMProperty.getWizProperty(m_objWizard, WCS.DIF_CAMBIO, DWC.PR_ID_DIF_CAMBIO);
      };

      var pNewEmptyProperties = function() {
        // (ByRef Grid As cIABMGrid)
        pGetAnticipo().setValue(0);

        pGetFacturas().getRows().clear();
        pGetOtros().getRows().clear();
        pGetCheques().getRows().clear();
        pGetEfectivo().getRows().clear();
        pGetTarjetas().getRows().clear();
        pGetCtaCte().getRows().clear();

        pGetCobroNeto().setValue(0);
        pGetCobroOtros().setValue(0);
        pGetCobroTotal().setValue(0);

        var w_pGetClienteProperty = pGetClienteProperty();
        w_pGetClienteProperty.setSelectId(m_cliIdDoc);
        w_pGetClienteProperty.setValue(m_clienteDoc);

        var w_pGetCliente2 = pGetCliente2();
        w_pGetCliente2.setSelectId(m_cliIdDoc);
        w_pGetCliente2.setValue(m_clienteDoc);

        var w_pGetComprobante = pGetComprobante();
        w_pGetComprobante.setValue("");
        w_pGetComprobante.setTextMask("");
        var w_pGetCentroCosto = pGetCentroCosto();
        w_pGetCentroCosto.setSelectId(Cairo.Constants.NO_ID);
        w_pGetCentroCosto.setValue("");
        pGetDescrip().setValue("");

        m_objWizard.showValue(pGetClienteProperty());
        m_objWizard.showValue(pGetCliente2());
        m_objWizard.showValue(pGetFacturasProperty());
        m_objWizard.showValue(pGetOtrosProperty());
        m_objWizard.showValue(pGetChequesProperty());
        m_objWizard.showValue(pGetEfectivoProperty());
        m_objWizard.showValue(pGetTarjetasProperty());
        m_objWizard.showValue(pGetCtaCteProperty());
        m_objWizard.showValue(pGetAnticipo());
        m_objWizard.showValue(pGetCobroNeto());
        m_objWizard.showValue(pGetCobroOtros());
        m_objWizard.showValue(pGetCobroTotal());
        m_objWizard.showValue(pGetComprobante());
        m_objWizard.showValue(pGetCentroCosto());
        m_objWizard.showValue(pGetDescrip());

      };

      var pGetDescripNDNC = function() {
        var facturas = null;
        var cobranza = null;

        var row = null;
        var total = null;

        var _count = pGetFacturas().getRows().size();
        for (var _i = 0; _i < _count; _i++) {
          row = pGetFacturas().getRows().item(_i);
          if(Cairo.Util.val(Dialogs.cell(row, KI_APLICAR).getValue())) {
            facturas = facturas+ Dialogs.cell(row, KI_NRODOC).getValue()+ ",";
          }
        }

        facturas = RemoveLastColon(facturas);
        cobranza = pGetComprobante().getValue();

        return c_NCNDDescripDifCambio+ "\\r\\n\\r\\n"+ getText(2483, "", cobranza, facturas);
      };

      var pSetDatosFromAplic = function() {
        var sqlstmt = null;
        var rs = null;
        var i = null;

        sqlstmt = "sp_DocCobranzaGetDataFromAplic 1,'"+ pGetFvIds()+ "'";

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(rs.isEOF()) { return; }

        var iProp = null;

        while (!rs.isEOF()) {

          iProp = pGetSucursal();
          if(iProp.getSelectId() === Cairo.Constants.NO_ID && Cairo.Database.valField(rs.getFields(), mTesoreriaConstantes.SUC_ID) !== Cairo.Constants.NO_ID) {

            iProp.setSelectId(Cairo.Database.valField(rs.getFields(), mTesoreriaConstantes.SUC_ID));
            iProp.setValue(Cairo.Database.valField(rs.getFields(), mTesoreriaConstantes.SUC_NAME));
            m_objWizard.showValue(iProp);
          }

          iProp = pGetCentroCosto();
          if(iProp.getSelectId() === Cairo.Constants.NO_ID && Cairo.Database.valField(rs.getFields(), mTesoreriaConstantes.CCOS_ID) !== Cairo.Constants.NO_ID) {

            iProp.setSelectId(Cairo.Database.valField(rs.getFields(), mTesoreriaConstantes.CCOS_ID));
            iProp.setValue(Cairo.Database.valField(rs.getFields(), mTesoreriaConstantes.CCOS_NAME));
            m_objWizard.showValue(iProp);
          }

          iProp = pGetLegajo();
          if(iProp.getSelectId() === Cairo.Constants.NO_ID && Cairo.Database.valField(rs.getFields(), mTesoreriaConstantes.LGJ_ID) !== Cairo.Constants.NO_ID) {

            iProp.setSelectId(Cairo.Database.valField(rs.getFields(), mTesoreriaConstantes.LGJ_ID));
            iProp.setValue(Cairo.Database.valField(rs.getFields(), mTesoreriaConstantes.LGJ_TITULO));
            m_objWizard.showValue(iProp);
          }

          rs.MoveNext;
        }
      };

      var pSetFilterColFactura = function() {

        var wizObj = null;
        var abmObj = null;

        wizObj = m_objWizard;
        abmObj = wizObj.getObjAbm();

        pCol(pGetOtros().getColumns(), KIO_FV_ID_RET).getHelpFilter() === "cli.cli_id = "+ pGetCliente().toString();
        abmObj.RefreshColumnProperties(pGetOtrosProperty(), mTesoreriaConstantes.FV_ID_RET);

      };

      var pRefreshLabelPagos = function() {
        var iProp = null;
        iProp = pGetLabelCobros();
        iProp.setValue(c_LabelCobrosText+ " - "+ pGetClienteProperty().getValue());
        m_objWizard.showValue(iProp);
      };

      var setGridVirtualNextCobros = function(property) {

        // Si no hay objeto de info de cobranzas
        // no hay pagos automaticos
        //
        if(m_cobranzaInfo === null) { return; }

        var fvInfo = null;
        var efectivo = null;
        var tickets = null;
        var monId = null;
        var moneda = null;

        var _count = m_cobranzaInfo.getFacturas().size();
        for (var _i = 0; _i < _count; _i++) {
          fvInfo = m_cobranzaInfo.getFacturas().item(_i);
          if(fvInfo.getCliId() === m_cliIdDoc) {

            switch (fvInfo.getFormaDePago()) {
              case csE_HojaRutaCobranzaTipo.cSHRCT_EFECTIVO:
                efectivo = efectivo + fvInfo.getImporteCobrado();
                break;

              case csE_HojaRutaCobranzaTipo.cSHRCT_TICKETS:
                tickets = tickets + fvInfo.getImporteCobrado();
                break;
            }
          }
        }

        if(efectivo !== 0) {
          var w_pGetEfectivo = pGetEfectivo().getRows().add(null);

          w_pGetEfectivo.Add(null);

          //*TODO:** can't found type for with block
          //*With .Object.add(null)
          var w___TYPE_NOT_FOUND = w_pGetEfectivo.Add(null);
          w___TYPE_NOT_FOUND.Value = m_cobranzaInfo.getCuentaEfectivo();
          w___TYPE_NOT_FOUND.Id = m_cobranzaInfo.getCueIdEfectivo();
          w___TYPE_NOT_FOUND.Key = KIE_CUE_ID;

          GetMonedaFromCuenta(monId, moneda, m_cobranzaInfo.getCueIdEfectivo());

          //*TODO:** can't found type for with block
          //*With .Object.add(null)
          var w___TYPE_NOT_FOUND = w_pGetEfectivo.Add(null);
          w___TYPE_NOT_FOUND.Value = moneda;
          w___TYPE_NOT_FOUND.Id = monId;
          w___TYPE_NOT_FOUND.Key = KIE_MON_ID;

          //*TODO:** can't found type for with block
          //*With .Object.add(null)
          var w___TYPE_NOT_FOUND = w_pGetEfectivo.Add(null);
          if(monId !== m_monDefault) {
            w___TYPE_NOT_FOUND.Value = efectivo;
          }
          else {
            w___TYPE_NOT_FOUND.Value = 0;
          }
          w___TYPE_NOT_FOUND.Key = KIE_IMPORTEORIGEN;

          //*TODO:** can't found type for with block
          //*With .Object.add(null)
          var w___TYPE_NOT_FOUND = w_pGetEfectivo.Add(null);
          if(monId !== m_monDefault) {
            w___TYPE_NOT_FOUND.Value = efectivo * Cairo.Util.val(pGetCotizacion().getValue());
          }
          else {
            w___TYPE_NOT_FOUND.Value = efectivo;
          }
          w___TYPE_NOT_FOUND.Key = KIE_IMPORTE;

          //*TODO:** can't found type for with block
          //*With .Object.add(null)
          var w___TYPE_NOT_FOUND = w_pGetEfectivo.Add(null);
          w___TYPE_NOT_FOUND.Value = "";
          w___TYPE_NOT_FOUND.Key = KIE_DESCRIP;

        }

        if(tickets !== 0) {

          var w_pGetEfectivo = pGetEfectivo().getRows().add(null);

          w_pGetEfectivo.Add(null);

          //*TODO:** can't found type for with block
          //*With .Object.add(null)
          var w___TYPE_NOT_FOUND = w_pGetEfectivo.Add(null);
          w___TYPE_NOT_FOUND.Value = m_cobranzaInfo.getCuentaTicket();
          w___TYPE_NOT_FOUND.Id = m_cobranzaInfo.getCueIdTicket();
          w___TYPE_NOT_FOUND.Key = KIE_CUE_ID;

          GetMonedaFromCuenta(monId, moneda, m_cobranzaInfo.getCueIdTicket());

          //*TODO:** can't found type for with block
          //*With .Object.add(null)
          var w___TYPE_NOT_FOUND = w_pGetEfectivo.Add(null);
          w___TYPE_NOT_FOUND.Value = moneda;
          w___TYPE_NOT_FOUND.Id = monId;
          w___TYPE_NOT_FOUND.Key = KIE_MON_ID;

          //*TODO:** can't found type for with block
          //*With .Object.add(null)
          var w___TYPE_NOT_FOUND = w_pGetEfectivo.Add(null);
          if(monId !== m_monDefault) {
            w___TYPE_NOT_FOUND.Value = tickets;
          }
          else {
            w___TYPE_NOT_FOUND.Value = 0;
          }
          w___TYPE_NOT_FOUND.Key = KIE_IMPORTEORIGEN;

          //*TODO:** can't found type for with block
          //*With .Object.add(null)
          var w___TYPE_NOT_FOUND = w_pGetEfectivo.Add(null);
          if(monId !== m_monDefault) {
            w___TYPE_NOT_FOUND.Value = tickets * Cairo.Util.val(pGetCotizacion().getValue());
          }
          else {
            w___TYPE_NOT_FOUND.Value = tickets;
          }
          w___TYPE_NOT_FOUND.Key = KIE_IMPORTE;

          //*TODO:** can't found type for with block
          //*With .Object.add(null)
          var w___TYPE_NOT_FOUND = w_pGetEfectivo.Add(null);
          w___TYPE_NOT_FOUND.Value = "";
          w___TYPE_NOT_FOUND.Key = KIE_DESCRIP;

        }

        if(efectivo !== 0 || tickets !== 0) {

          pRefreshEfectivo();

          pShowCobroNeto();
          pShowCobroOtro();
          pShowCobroTotal();

        }

      };

      var pRefreshEfectivo = function() {
        m_objWizard.showValue(cIABMProperty.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.EFECTIVO));
      };

      var pGetFilterCuentaXCaja = function() {
        var _rtn = "";

        if(m_isHojaRuta) {

          // Debo obtener la caja abierta para saber que cuentas puedo usar
          //
          _rtn = " and cue_id in (select cue_id_trabajo from cajacuenta where cj_id = "+ m_cjId+ ")";

        }
        else {

          _rtn = c_filter_cuentas_de_caja;

        }


        return _rtn;
      };

      var setGridCajaForUsuario = function(property) {
        var msg = null;

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }
        if(response.success !== true) { return false; }

        if(response.data.id === Cairo.Constants.NO_ID) {

          msg = Cairo.Database.valField(m_data.cajaForUsuario[_i], "warning");
          if(LenB(msg)) {
            MsgWarning(msg);
            return null;
          }

          m_cjId = Cairo.Database.valField(m_data.cajaForUsuario[_i], mTesoreriaConstantes.CJ_ID);

          return true;

        };


        return self;
      };

      Edit.Controller = { getEditor: createObject };

    });

  }());
