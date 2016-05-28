(function() {
  "use strict";

  Cairo.module("OrdenPagoWizard.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      var getText = Cairo.Language.getText;

      var C_MODULE = "cOrdenPagoWizard";

      var SAVE_ERROR_MESSAGE = getText(1910, ""); // Error al grabar la Orden de Pago

      var P = Cairo.Promises;
      var NO_ID = Cairo.Constants.NO_ID;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var CT = Cairo.Tesoreria.Constants;
      var CC = Cairo.Compras.Constants;
      var Types = Cairo.Constants.Types;
      var valField = DB.valField;
      var getValue = DB.getValue;
      var valEmpty = Cairo.Util.valEmpty;
      var call = P.call;
      var D = Cairo.Documents;
      var U = Cairo.Util;
      var getCell = Dialogs.cell;
      var Grids = Cairo.Dialogs.Grids;
      var val = U.val;
      var round = U.round;
      var bToI = U.boolToInt;
      var WC = Cairo.Constants.WizardConstants;
      var WCS = Cairo.Constants.WizardSteps;
      var DWC = Cairo.Constants.WizardKeys;
      var M = Cairo.Modal;
      var T = Dialogs.PropertyType;
      var ST = Dialogs.PropertySubType;

      var C_CHEQUERA = "Chequera";
      var C_CHEQUET = "chqt";

      var LABEL_PAGOS = "LabelPagos";

      var KI_IMPORTE = 1;
      var KI_FC_ID = 2;
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
      var KI_FCD_ID = 16;

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
      var KIO_FC_ID_RET = 12;
      var KIO_MON_ID = 13;

      var K_COPY_CHEQUE = 500;

      var KICH_CUE_ID = 2;
      var KICH_IMPORTE = 3;
      var KICH_IMPORTEORIGEN = 4;
      var KICH_CHEQUERA = 5;
      var KICH_CHEQUE = 6;
      var KICH_MON_ID = 7;
      var KICH_FECHACOBRO = 10;
      var KICH_FECHAVTO = 11;
      var KICH_CLE_ID = 12;
      var KICH_DESCRIP = 13;

      var KICHT_CUE_ID = 2;
      var KICHT_IMPORTE = 3;
      var KICHT_IMPORTEORIGEN = 4;
      var KICHT_CLI_ID = 5;
      var KICHT_BCO_ID = 6;
      var KICHT_CHEQUE = 7;
      var KICHT_MON_ID = 8;
      var KICHT_FECHACOBRO = 10;
      var KICHT_FECHAVTO = 11;
      var KICHT_CLE_ID = 12;
      var KICHT_DESCRIP = 13;
      var KICHT_CHEQ_ID = 14;

      var KIE_CUE_ID = 2;
      var KIE_MON_ID = 3;
      var KIE_IMPORTE = 4;
      var KIE_IMPORTEORIGEN = 5;
      var KIE_DESCRIP = 6;

      var KICC_CUE_ID = 2;
      var KICC_IMPORTE = 3;
      var KICC_IMPORTEORIGEN = 4;

      var LABEL_PAGOS_TEXT = getText(2207, ""); // Indique los instrumentos de Pago

      var m_objWizard;
      var m_wizardProcessing;
      var m_wizardCancel;

      var m_bMultiCurrency;

      var m_id = 0;

      var m_orden = 0;

      var m_provId = 0;
      var m_proveedor = "";

      var m_fcIds = null;

      var m_objClient = null;

      var m_lastDoc = 0;
      var m_lastProvId = 0;
      
      var m_lastNroDoc = "";

      var m_defaultCurrency = D.getDefaultCurrency();

      var m_apiPath = DB.getAPIVersion();

      self.getId = function() {
        return m_id;
      };

      self.setProvId = function(value) {
        m_provId = value;
      };

      self.setProveedor = function(value) {
        m_proveedor = value;
      };

      self.setFcIds = function(value) {
        m_fcIds = value.slice();
      };

      self.setObjClient = function(value) {
        m_objClient = value;
      };

      self.loadWizard = function() {
        return P.resolvedPromise(true);
      };

      self.messageEx = function(messageID, info) {
        var p = null;

        switch (messageID) {

          case Dialogs.Message.MSG_GRID_ROW_DELETED:

            switch (info) {
              case WC.KW_CHEQUES:
              case WC.KW_EFECTIVO:
              case WC.KW_CHEQUEST:
                showPagoNeto();
                break;

              case WC.KW_OTROS:
                showPagoOtro();
                break;
            }
            showPagoTotal();
            break;
        }

        return p || P.resolvedPromise(true);
      };

      self.isEmptyRow = function(key, row, rowIndex) {
        var isEmpty = true;
        
        try {

          switch (key) {
            case WC.KW_FACTURAS:
              isEmpty = false;
              break;

            case WC.KW_CHEQUES:
              isEmpty = isEmptyRowCheques(row, rowIndex);
              break;

            case WC.KW_CHEQUEST:
              isEmpty = isEmptyRowTCheques(row, rowIndex);
              break;

            case WC.KW_OTROS:
              isEmpty = isEmptyRowOtros(row, rowIndex);
              break;

            case WC.KW_EFECTIVO:
              isEmpty = isEmptyRowEfectivo(row, rowIndex);
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "isEmptyRow", C_MODULE, "");
        }

        return P.resolvedPromise(isEmpty);
      };

      self.columnAfterUpdate = function(key, lRow, lCol) {
        var p = null;
        
        try {

          switch (key) {
            case WC.KW_FACTURAS:
              columnAfterUpdateFactura(getFacturasProperty(), lRow, lCol);
              break;

            case WC.KW_CHEQUES:
              p = columnAfterUpdateCheque(getChequesProperty(), lRow, lCol);
              break;

            case WC.KW_CHEQUEST:
              p = columnAfterUpdateChequeT(getChequesTProperty(), lRow, lCol);
              break;

            case WC.KW_OTROS:
              p = columnAfterUpdateOtro(getOtrosProperty(), lRow, lCol);
              break;

            case WC.KW_EFECTIVO:
              p = columnAfterUpdateEfectivo(getEfectivoProperty(), lRow, lCol);
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "columnAfterUpdate", C_MODULE, "");
        }

        return p || P.resolvedPromise(true);
      };

      self.columnAfterEdit = function(key, lRow, lCol, newValue, newValueId) {
        var p = null;

        switch(key) {

          case WC.KW_OTROS:

            var grid = getOtros();
            var columnKey = grid.getColumns().item(lCol).getKey();

            switch (columnKey) {

              case KIO_CUE_ID:
                var cueId = newValueId;

                if(cueId !== NO_ID) {

                  p = D.getCuentaInfo(cueId).then(function(info) {
                    if(info.success) {
                      var row = grid.getRows().item(lRow);
                      getCell(row, KIO_MON_ID).setId(info.monId);
                      return true;
                    }
                    else {
                      return false;
                    }
                  });
                }
                break;
            }
            break;
        }

        return p || P.resolvedPromise(true);
      };

      self.columnBeforeEdit = function(key, lRow, lCol, iKeyAscii) {
        var rtn = false;

        try {

          switch (key) {
            case WC.KW_FACTURAS:
              rtn = columnBeforeEditFacturas(getFacturasProperty(), lRow, lCol, iKeyAscii);
              break;

            default:
              rtn = true;
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "columnBeforeEdit", C_MODULE, "");
        }

        return P.resolvedPromise(rtn);
      };

      self.columnButtonClick = function(key, lRow, lCol, iKeyAscii) {

      };

      self.columnClick = function(key, lRow, lCol) {

      };

      self.gridDblClick = function(key, lRow, lCol) {
        try {

          switch (key) {

            case WC.KW_FACTURAS:

              D.showDocAux(getCell(getFacturas().getRows().item(lRow), KI_FC_ID).getId(), "FacturaCompra");
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "gridDblClick", C_MODULE, "");
        }
        return P.resolvedPromise(true);
      };

      self.deleteRow = function(key, row, lRow) {
        var rtn;

        switch (key) {
          case WC.KW_FACTURAS:
            rtn = false;
            break;

          default:
            rtn = true;
            break;
        }

        return P.resolvedPromise(rtn);
      };

      var newRow = function(key, rows) {
        return P.resolvedPromise(false);
      };

      self.validateRow = function(key, row, rowIndex) {
        var p = null;

        try {

          switch (key) {
            case WC.KW_FACTURAS:
              p = P.resolvedPromise(true);
              break;

            case WC.KW_CHEQUES:
              p = validateRowCheques(row, rowIndex);
              break;

            case WC.KW_CHEQUEST:
              p = validateRowChequesT(row, rowIndex);
              break;

            case WC.KW_OTROS:
              p = validateRowOtros(row, rowIndex);
              break;

            case WC.KW_EFECTIVO:
              p = validateRowEfectivo(row, rowIndex);
              break;

            case WC.KW_CTA_CTE:
              p = true;
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "validateRow", C_MODULE, "");
        }

        return p || P.resolvedPromise(false);
      };

      var columnBeforeEditFacturas = function(property, lRow, lCol, iKeyAscii) {
        switch (property.getGrid().getColumns().item(lCol).getKey()) {

          case KI_APLICAR:
          case KI_SELECT:
          case KI_COTIZACION2:

            return true;

          default:

            return false;
        }
      };

      var columnAfterUpdateFactura = function(property, lRow, lCol) {

        var grid = property.getGrid();
        
        switch (grid.getColumns().item(lCol).getKey()) {
          case KI_SELECT:
            var row = grid.getRows().item(lRow);
            selectFactura(row, grid.getColumns());
            showTotalFacturas();
            break;

          case KI_COTIZACION2:
            var row = grid.getRows().item(lRow);
            var cotiz = val(getCell(row, KI_COTIZACION2).getValue());
            if(D.getCol(grid.getColumns(), KI_IMPORTE).getVisible()) {
              var cell = getCell(row, KI_IMPORTE);
              cell.setValue(getCell(row, KI_IMPORTEORIGEN).getValue() * cotiz);
            }
            else {
              var cell = getCell(row, KI_PENDIENTE);
              cell.setValue(getCell(row, KI_IMPORTEORIGEN).getValue() * cotiz);
            }
            break;

          case KI_APLICAR:
            var row = grid.getRows().item(lRow);
            var visible = D.getCol(grid.getColumns(), KI_IMPORTE).getVisible();
            var cell = getCell(row, KI_APLICAR);
            if(visible) {
              var maxVal = val(getCell(row, KI_IMPORTE).getValue());
              if(val(cell.getValue()) > maxVal) {
                cell.setValue(maxVal);
              }
              else if(val(cell.getValue()) < 0) {
                cell.setValue(0);
              }
            }
            else {
              var maxVal = val(getCell(row, KI_PENDIENTE).getValue());
              if(val(cell.getValue()) > maxVal) {
                cell.setValue(maxVal);
              }
              else if(val(cell.getValue()) < 0) {
                cell.setValue(0);
              }
            }
            showTotalFacturas();
            break;
        }

        return true;
      };

      var columnAfterUpdateCheque = function(property, lRow, lCol) {
        var p = null;
        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).getKey()) {
          
          case KICH_IMPORTEORIGEN:
            
            var row = grid.getRows().item(lRow);
            var cell = getCell(row, KICH_MON_ID);
            
            if(cell.getId() !== m_defaultCurrency.id || cell.getId() === 0) {
              getCell(row, KICH_IMPORTE).setValue(
                val(getCell(row, KICH_IMPORTEORIGEN).getValue()) 
                  * val(getCotizacion().getValue())
              ) ;
            }
            else {
              getCell(row, KICH_IMPORTEORIGEN).setValue(0);
            }
            showPagoNeto();
            showPagoTotal();
            break;

          case KICH_IMPORTE:

            showPagoNeto();
            showPagoTotal();
            break;

          case KICH_CUE_ID:

            var row = grid.getRows().item(lRow);

            p = D.getCurrencyFromAccount(getCell(row, KICH_CUE_ID).getId())
              .whenSuccessWithResult(function(info) {

                var cell = getCell(row, KICH_MON_ID);

                cell.setValue(info.monName);
                cell.setId(info.monId);

                if(info.monId === m_defaultCurrency.id || info.monId === 0) {
                  getCell(row, KICH_IMPORTEORIGEN).setValue(0);
                }

                if(val(getCell(row, KICH_IMPORTE).getValue()) === 0) {
                  getCell(row, KICH_IMPORTE).setValue(
                    val(getTotal().getValue())
                      - val(getPagoTotal().getValue())
                  );
                  showPagoNeto();
                  showPagoTotal();
                }
                return true;
              }
            );
            break;

          case KICH_CHEQUERA:

            var row = grid.getRows().item(lRow);

            D.getChequeNumber(getCell(row, KICH_CHEQUERA).getId()).whenSuccessWithResult(function(response) {
              getCell(row, KICH_CHEQUE).setValue(valField(response.data, C.CHEQ_NUMERO_DOC));
            });
            break;

          case KICH_FECHACOBRO:

            var row = grid.getRows().item(lRow);
            var cell = getCell(row, KICH_FECHACOBRO);

            if(Cairo.Util.isDate(cell.getValue())) {
              getCell(row, KICH_FECHAVTO).getValue(Cairo.Dates.DateNames.addToDate("m", 1, cell.getValue()));
            }
            break;
        }

        return p || P.resolvedPromise(true);
      };

      var columnAfterUpdateEfectivo = function(property, lRow, lCol) {
        var p = null;
        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).getKey()) {
          
          case KIE_IMPORTEORIGEN:

            var row = grid.getRows().item(lRow);
            var cell = getCell(row, KIE_MON_ID);

            if(cell.getId() !== m_defaultCurrency.id || cell.getId() === 0) {
              getCell(row, KIE_IMPORTE).setValue(
                val(getCell(row, KIE_IMPORTEORIGEN).getValue())
                  * val(getCotizacion().getValue())
              );
            }
            else {
              getCell(row, KIE_IMPORTEORIGEN).setValue(0);
            }

            showPagoNeto();
            showPagoTotal();
            break;

          case KIE_IMPORTE:

            showPagoNeto();
            showPagoTotal();
            break;

          case KIE_CUE_ID:

            var row = grid.getRows().item(lRow);
            p = D.getCurrencyFromAccount(getCell(row, KIE_CUE_ID).getId())
              .whenSuccessWithResult(function(info) {

                var cell = getCell(row, KIE_MON_ID);

                cell.setValue(info.monName);
                cell.setId(info.monId);

                if(info.monId === m_defaultCurrency.id || info.monId === 0) {
                  getCell(row, KIE_IMPORTEORIGEN).setValue(0);
                }

                if(val(getCell(row, KIE_IMPORTE).getValue()) === 0) {
                  getCell(row, KIE_IMPORTE).setValue(
                    val(getTotal().getValue())
                      - val(getPagoTotal().getValue())
                  );
                  showPagoNeto();
                  showPagoTotal();
                }
                return true;
              }
            );
            break;
        }

        return p || P.resolvedPromise(true);
      };

      var columnAfterUpdateChequeT = function(property, lRow, lCol) {
        var p = null;
        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).getKey()) {

          case KICHT_IMPORTEORIGEN:
            
            var row = grid.getRows().item(lRow);
            var cell = getCell(row, KICHT_MON_ID);
            
            if(cell.getId() !== m_defaultCurrency.id || cell.getId() === 0) {
              getCell(row, KICHT_IMPORTE).getValue() === val(getCell(row, KICHT_IMPORTEORIGEN).getValue()) * val(getCotizacion().getValue());
            }
            else {
              getCell(row, KICHT_IMPORTEORIGEN).setValue(0);
            }

            break;

          case KICHT_CUE_ID:

            var row = grid.getRows().item(lRow);

            D.getCurrencyFromAccount(getCell(row, KICH_CUE_ID).getId())
              .whenSuccessWithResult(function(info) {
                var cell = getCell(row, KICH_MON_ID);
                cell.setValue(info.monName);
                cell.setId(info.monId);
                if(info.monId === m_defaultCurrency.id || info.monId === 0) {
                  getCell(row, KICH_IMPORTEORIGEN).setValue(0);
                }
                return true;
              });
            break;

          case KICHT_CHEQUE:

            var row = grid.getRows().item(lRow);

            D.getChequeData(getCell(row, KICHT_CHEQUE).getId())
              .then(function(response) {
                if(response.success === true) {

                  Dialogs.cell(row, KICHT_BCO_ID).setValue(valField(response.data, C.BCO_NAME));
                  Dialogs.cell(row, KICHT_CLI_ID).setValue(valField(response.data, C.CLI_NAME));
                  Dialogs.cell(row, KICHT_FECHAVTO).setValue(valField(response.data, CT.CHEQ_FECHA_VTO));
                  Dialogs.cell(row, KICHT_FECHACOBRO).setValue(valField(response.data, CT.CHEQ_FECHA_COBRO));
                  Dialogs.cell(row, KICHT_CLE_ID).setValue(valField(response.data, C.CLE_NAME));
                  Dialogs.cell(row, KICHT_IMPORTE).setValue(valField(response.data, CT.CHEQ_IMPORTE));
                  Dialogs.cell(row, KICHT_IMPORTEORIGEN).setValue(valField(response.data, CT.CHEQ_IMPORTE_ORIGEN));

                }
                else {

                  Dialogs.cell(row, KICHT_BCO_ID).setValue("");
                  Dialogs.cell(row, KICHT_CLI_ID).setValue(0);
                  Dialogs.cell(row, KICHT_FECHAVTO).setValue("");
                  Dialogs.cell(row, KICHT_FECHACOBRO).setValue("");
                  Dialogs.cell(row, KICHT_CLE_ID).setValue(0);
                  Dialogs.cell(row, KICHT_IMPORTE).setValue(0);
                  Dialogs.cell(row, KICHT_IMPORTEORIGEN).setValue(0);

                }
                showPagoNeto();
                showPagoTotal();

                return true;
              });
            break;
        }

        return P.resolvedPromise(true);
      };

      var columnAfterUpdateOtro = function(property, lRow, lCol) {

        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).getKey()) {

          case KIO_DEBE:
            var row = grid.getRows().item(lRow);
            getCell(row, KIO_IMPORTEORIGEN).setValue(val(getCell(row, KIO_DEBE).getValue()));
            getCell(row, KIO_HABER).setValue(0);
            showPagoOtro();
            showPagoTotal();
            break;

          case KIO_HABER:
            var row = grid.getRows().item(lRow);
            getCell(row, KIO_IMPORTEORIGEN).setValue(val(getCell(row, KIO_HABER).getValue()));
            getCell(row, KIO_DEBE).setValue(0);
            showPagoOtro();
            showPagoTotal();
            break;
        }

        return P.resolvedPromise(true);
      };

      var selectAllFactura = function(select) {
        var facturas = getFacturas();

        for(var _i = 0, _count = facturas.getRows().size(); _i < _count; _i++) {
          var row = facturas.getRows().item(_i);
          getCell(row, KI_SELECT).getId() === parseInt(select);
          selectFactura(row, facturas.getColumns());
        }

        m_objWizard.showValue(getFacturasProperty(), true);
      };

      var refreshCotizacion = function() {
        var cotiz = getCotizacion().getValue();
        var facturas = getFacturas();

        for(var _i = 0, _count = facturas.getRows().size(); _i < _count; _i++) {

          var row = facturas.getRows().item(_i);

          if(val(getCell(row, KI_IMPORTEORIGEN).getValue())) {

            if(m_bMultiCurrency) {
              cotiz = val(getCell(row, KI_COTIZACION2).getValue());
            }
            else {
              getCell(row, KI_COTIZACION2).setValue(cotiz);
            }

            if(D.getCol(facturas.getColumns(), KI_IMPORTE).getVisible()) {
              var cell = getCell(row, KI_IMPORTE);
              cell.setValue(getCell(row, KI_IMPORTEORIGEN).getValue() * cotiz);
            }
            else {
              var cell = getCell(row, KI_PENDIENTE);
              cell.setValue(getCell(row, KI_IMPORTEORIGEN).getValue() * cotiz);
            }
            selectFactura(row, facturas.getColumns());
          }
        }

        m_objWizard.showValue(getFacturasProperty());
      };

      var selectFactura = function(row, columns) {
        var visible = D.getCol(columns, KI_IMPORTE).getVisible();
        var cell = getCell(row, KI_APLICAR);
        
        if(getCell(row, KI_SELECT).getId()) {
          if(val(cell.getValue()) === 0) {
            if(visible) {
              cell.setValue(getCell(row, KI_IMPORTE).getValue());
            }
            else {
              cell.setValue(getCell(row, KI_PENDIENTE).getValue());
            }
          }
        }
        else {
          cell.setValue(0);
        }
      };

      var validateAnticipo = function() {
        if(val(getAnticipo().getValue()) < 0) {
          getAnticipo().setValue(0);
        }
        m_objWizard.showValue(getAnticipo());
      };

      var showPagoNeto = function() {
        var total = 0;

        for(var _i = 0, _count = getCheques().getRows().size(); _i < _count; _i++) {
          var row = getCheques().getRows().item(_i);
          total = total + val(getCell(row, KICH_IMPORTE).getValue());
        }

        for(var _i = 0, _count = getEfectivo().getRows().size(); _i < _count; _i++) {
          var row = getEfectivo().getRows().item(_i);
          total = total + val(getCell(row, KIE_IMPORTE).getValue());
        }

        for(var _i = 0, _count = getChequesT().getRows().size(); _i < _count; _i++) {
          var row = getChequesT().getRows().item(_i);
          total = total + val(getCell(row, KICHT_IMPORTE).getValue());
        }

        getPagoNeto().setValue(total);
        m_objWizard.showValue(getPagoNeto());
      };

      var showPagoOtro = function() {
        var total = 0;

        for(var _i = 0, _count = getOtros().getRows().size(); _i < _count; _i++) {
          var row = getOtros().getRows().item(_i);
          total = total + val(getCell(row, KIO_DEBE).getValue()) - val(getCell(row, KIO_HABER).getValue());
        }

        getPagoOtros().setValue(total);
        m_objWizard.showValue(getPagoOtros());
      };

      var showPagoTotal = function() {
        getPagoTotal().setValue(val(getPagoNeto().getValue()) + val(getPagoOtros().getValue()));
        m_objWizard.showValue(getPagoTotal());
      };

      var showAnticipo = function() {
        getAnticipoImporte().setValue(val(getAnticipo().getValue()));
        m_objWizard.showValue(getAnticipoImporte());
      };
      
      var showMonedaAnticipo = function(show) {

        var cueId = getCuentaAnticipo().getSelectId();
        if(cueId !== NO_ID) {
          D.getCurrencyFromAccount(cueId)
            .whenSuccessWithResult(function(info) {

              var monedaAnticipo = getMonedaAnticipo();
              monedaAnticipo.setSelectId(info.monId);
              monedaAnticipo.setValue(info.monName);

              if(show) {
                m_objWizard.showValue(getMonedaAnticipo());
              }

              var cotizacionAnticipo = getCotizacionAnticipo();
              if(info.monId !== m_defaultCurrency.id) {
                cotizacionAnticipo.setEnabled(true);
                cotizacionAnticipo.setValue(info.rate);
              }
              else {
                cotizacionAnticipo.setValue(1);
                cotizacionAnticipo.setEnabled(false);
              }

              if(show) {
                m_objWizard.showValue(getCotizacionAnticipo());
              }
            }
          );
        }
      };

      var showTotalFacturas = function() {
        var row = null;
        var total = null;
        var totalOrigen = null;

        var _count = getFacturas().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getFacturas().getRows().item(_i);
          total = total + val(getCell(row, KI_APLICAR).getValue());
          if(val(getCell(row, KI_IMPORTEORIGEN).getValue()) !== 0) {
            totalOrigen = totalOrigen + val(getCell(row, KI_APLICAR).getValue());
          }
        }

        getTotal().setValue(total + val(getAnticipo().getValue()));
        getTotalOrigen().setValue(Cairo.Util.zeroDiv(totalOrigen, val(getCotizacion().getValue())));

        m_objWizard.showValue(getTotal());
        m_objWizard.showValue(getTotalOrigen());
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

      self.getApplication = function() {
        return Cairo.Application.getName();
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

            case WCS.SELECT_PAGOS:
              
              if(goingToNext) {
                p = getCuentasAcreedor()
                  .whenSuccess(function() {
                    setFilterColFactura();
                    return true;
                  }
                );
              }
              break;

            case WCS.DATOS_GENERALES:

              p = setDatosGenerales();
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, "work", C_MODULE, "");
        }

        return p || P.resolvedPromise(true);
      };

      self.nextStep = function(nCurrentStep, nextStep) {
        var p = null;
        
        try {

          switch (nCurrentStep) {

            // this is the first step called
            // it is used to inform the wizard manager which is the first step
            //
            case -1:
              
              nextStep = WCS.WELCOME;
              m_objWizard.disableBack();
              break;

            case WCS.WELCOME:

              nextStep = WCS.SELECT_PROVEEDOR;
              m_objWizard.getCmdNext().Caption = Cairo.Constants.NEXT_TEXT;
              m_objWizard.disableBack();
              break;

            case WCS.SELECT_PROVEEDOR:

              if(getDoc() === NO_ID) {
                nextStep = WCS.SELECT_PROVEEDOR;
                p = M.showWarningWithFalse(getText(1562, ""), getText(2202, "")); // Debe indicar un documento, Ordenes de pago
              }
              else if(getProveedor() === NO_ID) {
                nextStep = WCS.SELECT_PROVEEDOR;
                p = M.showWarningWithFalse(getText(1860, ""), getText(2202, "")); // Debe indicar un proveedor, Ordenes de pago               
              }
              else {
                p = loadFacturasXProveedor()
                  .whenSuccess(
                  function() {
                    showMessages();
                    getTodos().setName(Cairo.Constants.SELECT_ALL_TEXT);
                    m_objWizard.showValue(getTodos());
                    m_objWizard.enableBack();
                    nextStep = WCS.SELECT_FACTURA;
                    return true;
                  },
                  function() {
                    nextStep = WCS.SELECT_PROVEEDOR;
                    return M.showWarningWithFalse(getText(2203, ""), getText(2202, "")); // No se pudieron cargar las Facturas para este Proveedor, Ordenes de Pago
                  }
                );  
              }
              break;

            case WCS.SELECT_FACTURA:

              p = checkFacturas()
                .whenSuccess(
                function() {
                  showAnticipo();
                  nextStep = WCS.ANTICIPO;
                  return true;
                },
                function() {
                  nextStep = WCS.SELECT_FACTURA;
                  return false;
                }
              );
              break;

            case WCS.ANTICIPO:

              nextStep = WCS.SELECT_PAGOS;
              break;

            case WCS.SELECT_PAGOS:

              p = validatePago()
                .whenSuccess(
                function() {
                  m_objWizard.enableBack();
                  m_objWizard.setNextText(Cairo.Constants.FINISH_TEXT);

                  nextStep = WCS.DATOS_GENERALES;
                  return true;
                },
                function() {
                  nextStep = WCS.SELECT_PAGOS;
                  return false;
                }
              );
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
          Cairo.manageErrorEx(ex.message, "nextStep", C_MODULE, "");
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

          case WCS.SELECT_FACTURA:
            m_objWizard.disableBack();
            nextStep = WCS.SELECT_PROVEEDOR;
            break;

          case WCS.ANTICIPO:
            nextStep = WCS.SELECT_FACTURA;
            break;

          case WCS.SELECT_PAGOS:
            nextStep = WCS.ANTICIPO;
            break;

          case WCS.DATOS_GENERALES:
            m_objWizard.setNextText(Cairo.Constants.NEXT_TEXT);
            nextStep = WCS.SELECT_PAGOS;
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

            D.wizPrintDocEx(m_id, m_lastDoc, D.getEmailFromProveedor(m_lastProvId));
            break;

          case WC.KW_NEW_DOC:

            newEmptyProperties();
            D.wizNewDoc(m_objWizard, WCS.WELCOME);
            break;

          case WC.KW_VENCIDOS:
          case WC.KW_AGRUPADOS:

            loadFacturasXProveedor();
            break;

          case WC.KW_COTIZACION:

            refreshCotizacion();
            showTotalFacturas();
            break;

          case WC.KW_ANTICIPO:

            validateAnticipo();
            showTotalFacturas();
            break;

          case WC.KW_TODOS:
            
            if(getTodos().getName() === Cairo.Constants.SELECT_ALL_TEXT) {
              selectAllFactura(true);
              getTodos().setName(Cairo.Constants.UN_SELECT_ALL_TEXT);
            }
            else {
              selectAllFactura(false);
              getTodos().setName(Cairo.Constants.SELECT_ALL_TEXT);
            }
            m_objWizard.showValue(getTodos());
            showTotalFacturas();
            break;

          case WC.KW_CUENTA_ANTICIPO:
            
            showMonedaAnticipo(true);
            break;

          case WC.KW_DOC_ID:
            
            m_lastDoc = getDoc();
            break;

          case K_COPY_CHEQUE:
            
            copyCheque();
            break;
        }

        return p || P.resolvedPromise();
      };

      self.terminate = function() {
        try {
          m_objClient.setWizardCompleteSuccess(m_id !== NO_ID);
          m_objClient.terminateWizard(m_id);
        }
        catch(ignore) {
          Cairo.logError('Error in terminate', ignore);
        }
      };

      self.getPath = function() {
        return "#tesoreria/ordendepago/sobrefactura";
      };

      self.getEditorName = function() {
        var id = "N" + (new Date).getTime().toString();
        return "ordendepago/sobrefactura/" + id;
      };
      
      self.getTitle = function() {
        return "Asistente de Ordenes de Pago"; //TODO: use getText(???, ""); // Asistente de Ordenes de Pago
      };

      var loadSteps = function() {

        m_lastProvId = m_provId;
        m_lastDoc = Cairo.getTesoreriaConfig().getDocIdOrdenPago();

        loadStepWelcome();
        loadStepSelectProveedor();
        loadStepSelectFactura();
        loadStepAnticipo();
        loadStepPagos();
        loadStepDatosGenerales();

        return P.resolvedPromise(true);
      };

      var loadStepWelcome = function(property) {
        // the step's key must be the constant that defines them
        // this is crucial for the navigation to work
        //
        var step = m_objWizard.getSteps().add(null, U.getKey(WCS.WELCOME));

        step.getProperties().setLayout(Dialogs.Layout.verticalOneColumn);

        var properties = step.getProperties();

        var elem;

        elem = properties.add(null, DWC.TITLE);
        elem.setType(T.label);
        elem.setSubType(ST.mainTitle);
        elem.setValue(getText(2204, "")); // Bienvenido al Asistente de Ordenes de Pago

        elem = properties.add(null, DWC.MAIN_TITLE);
        elem.setType(T.label);
        elem.setSubType(ST.subTitle);
        elem.setValue(getText(2205, "")); // Con este Asistente usted podrá generar las Ordenes de Pago.

        D.wizAddNewDocProperties(m_objWizard, WCS.WELCOME);

      };

      var loadStepSelectProveedor = function() {

        // the step's key must be the constant that defines them
        // this is crucial for the navigation to work
        //
        var step = m_objWizard.getSteps().add(null, U.getKey(WCS.SELECT_PROVEEDOR));

        step.getProperties().setLayout(Dialogs.Layout.verticalOneColumn);

        var properties = step.getProperties();

        var elem = properties.add(null);

        elem.setType(T.label);
        elem.setSubType(ST.title);
        elem.setValue(getText(2206, "")); // Indique el documento a utilizar y el Proveedor al que se le emitirá el Recibo

        elem = properties.add(null, DWC.DOC);
        elem.setName(getText(1567, "")); // Documento
        elem.setType(T.select);
        elem.setSelectFilter(Cairo.Documents.ORDEN_PAGO_DOC_FILTER);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setValue(Cairo.getTesoreriaConfig().getDocOrdenPago());
        elem.setSelectId(Cairo.getTesoreriaConfig().getDocIdOrdenPago());
        elem.setKey(WC.KW_DOC_ID);

        elem = properties.add(null, DWC.PROVEEDOR);
        elem.setName(getText(1151, "")); // Proveedor
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PROVEEDOR);
        elem.setValue(m_proveedor);
        elem.setSelectId(m_provId);

        elem = properties.add(null, DWC.ONLY_SELECTED);
        elem.setType(T.check);
        elem.setName(getText(2133, "")); // Cargar sólo Facturas seleccionadas
        elem.setValue(m_fcIds.length);
      };

      var loadStepSelectFactura = function() {

        // the step's key must be the constant that defines them
        // this is crucial for the navigation to work
        //
        var properties = m_objWizard.getSteps().add(null, U.getKey(WCS.SELECT_FACTURA)).getProperties();

        var elem = properties.add(null);

        elem.setType(T.label);
        elem.setSubType(ST.title);
        elem.setValue(getText(2134, "")); // Seleccione las Facturas he indique los importes que cancelará en cada una de ellas

        elem = properties.add(null, DWC.AGRUPADOS);
        elem.setName(getText(2135, "")); // Agrupar
        elem.setType(T.check);
        elem.setKey(WC.KW_AGRUPADOS);

        elem = properties.add(null, DWC.VENCIDOS);
        elem.setName(getText(2136, "")); // Ver solo vencidos
        elem.setType(T.check);
        elem.setKey(WC.KW_VENCIDOS);

        elem = properties.add(null, DWC.COTIZACION);
        elem.setName(getText(1635, "")); // Cotización
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getCurrencyRateDecimalsFormat());
        elem.setSubType(ST.money);
        elem.setKey(WC.KW_COTIZACION);

        elem = properties.add(null, DWC.FACTUAS);

        elem.setType(T.grid);
        setGridFacturas(elem.getGrid());
        elem.setKey(WC.KW_FACTURAS);
        elem.setGridAddEnabled(false);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(false);

        elem = properties.add(null, DWC.TODOS);
        elem.setName(Cairo.Constants.SELECT_ALL_TEXT);
        elem.setType(T.button);
        elem.setKey(WC.KW_TODOS);
        elem.setNoShowLabel(true);

        elem = properties.add(null, DWC.ANTICIPO);
        elem.setName(getText(2137, "")); // Anticipo
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(WC.KW_ANTICIPO);

        elem = properties.add(null, DWC.TOTAL_PAGO_ORIGEN);
        elem.setName(getText(2138, "")); // Total Origen
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setEnabled(false);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());

        elem = properties.add(null, DWC.TOTAL_PAGO);
        elem.setName(getText(1584, "")); // Total
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setEnabled(false);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());

      };

      var setGridFacturas = function(grid) {

        var columns = grid.getColumns();
        columns.clear();

        columns.add(null).setVisible(false);

        var elem;

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_FCD_ID);

        elem = columns.add(null);
        elem.setType(Dialogs.PropertyType.check);
        elem.setKey(KI_SELECT);

        elem = columns.add(null);
        elem.setName(getText(1223, "")); // Tipo
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KI_DOC);

        elem = columns.add(null);
        elem.setName(getText(1567, "")); // Documento
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KI_NRODOC);

        elem = columns.add(null);
        elem.setName(getText(1065, "")); // Número
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setKey(KI_FC_ID);

        elem = columns.add(null);
        elem.setName(getText(1569, "")); // Fecha
        elem.setType(Dialogs.PropertyType.date);
        elem.setFormat("dd/mm/yy");
        elem.setKey(KI_FECHA);

        elem = columns.add(null, DWC.PENDIENTE);
        elem.setName(getText(2139, "", m_defaultCurrency.symbol)); // Importe  & Signo
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_PENDIENTE);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());

        elem = columns.add(null, DWC.IMPORTE);
        elem.setName(getText(2139, "", m_defaultCurrency.symbol)); // Importe  & Signo
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_IMPORTE);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());

        elem = columns.add(null);
        elem.setName(getText(1662, "")); // Aplicar
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_APLICAR);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());

        elem = columns.add(null, DWC.MONEDA);
        elem.setName(getText(2063, "")); // Mon
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KI_MONEDA);

        elem = columns.add(null);
        elem.setName(getText(1901, "")); // Origen
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_IMPORTEORIGEN);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());

        elem = columns.add(null, DWC.COTIZACION);
        elem.setName(getText(1650, "")); // Cotiz.
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_COTIZACION);
        elem.setFormat(Cairo.Settings.getCurrencyRateDecimalsFormat());

        elem = columns.add(null);
        elem.setName(m_defaultCurrency.symbol);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_TOTAL);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());

        elem = columns.add(null, DWC.COTIZACION2);
        elem.setName(getText(1650, "")); // Cotiz.
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_COTIZACION2);
        elem.setVisible(false);
        elem.setFormat(Cairo.Settings.getCurrencyRateDecimalsFormat());

        elem = columns.add(null);
        elem.setName(getText(1634, "")); // Vto.
        elem.setType(Dialogs.PropertyType.date);
        elem.setFormat("dd/mm/yy");
        elem.setKey(KI_VTO);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KI_DESCRIP);
      };

      var loadStepAnticipo = function() {

        // the step's key must be the constant that defines them
        // this is crucial for the navigation to work
        //
        var step = m_objWizard.getSteps().add(null, U.getKey(WCS.ANTICIPO));

        step.getProperties().setLayout(Dialogs.Layout.verticalTwoColumn);

        var properties = step.getProperties();

        var elem = properties.add(null);
        elem.setType(T.label);
        elem.setSubType(ST.title);
        elem.setValue(getText(2140, "")); // Indique los datos del anticipo

        elem = properties.add(null, DWC.CUENTA_ANTICIPO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setSelectFilter(D.selectFilterForCuentaAnticipoPagos);
        elem.setName(getText(1267, "")); // Cuenta
        elem.setValue(Cairo.getTesoreriaConfig().getCueAnticipoCobz());
        elem.setSelectId(Cairo.getTesoreriaConfig().getCueIdAntCobz());
        elem.setKey(WC.KW_CUENTA_ANTICIPO);

        elem = properties.add(null, DWC.MONEDA_ANTICIPO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setName(getText(1113, "")); // Moneda
        elem.setKey(WC.KW_MONEDA_ANTICIPO);
        elem.setEnabled(false);

        elem = properties.add(null, DWC.COTIZACION_ANTICIPO);
        elem.setName(getText(1635, "")); // Cotización
        elem.setFormat(Cairo.Settings.getCurrencyRateDecimalsFormat());
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setKey(WC.KW_COTIZACION_ANTICIPO);

        elem = properties.add(null, DWC.ANTICIPO_IMPORTE);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setKey(WC.KW_IMPORTE_ANTICIPO);

        if(Cairo.getTesoreriaConfig().getCueIdAntOpg() !== NO_ID) {
          showMonedaAnticipo(false);
        }

      };

      var loadStepPagos = function() {

        // the step's key must be the constant that defines them
        // this is crucial for the navigation to work
        //
        var keyCobros = U.getKey(WCS.SELECT_PAGOS);

        var properties = m_objWizard.getSteps().add(null, keyCobros).getProperties();

        elem = properties.add(null, LABEL_PAGOS);

        elem.setType(T.label);
        elem.setSubType(ST.title);
        elem.setValue(LABEL_PAGOS_TEXT);

        var dialog = m_objWizard.getDialog();

        var tab = dialog.getTabs().add(null);
        tab.setFatherTab(keyCobros);
        tab.setName(getText(2099, "")); // Cheques
        tab.setIndex(-1);

        tab = dialog.getTabs().add(null);
        tab.setFatherTab(keyCobros);
        tab.setName(getText(2100, "")); // Efectivo
        tab.setIndex(-2);

        tab = dialog.getTabs().add(null);
        tab.setFatherTab(keyCobros);
        tab.setName(getText(2195, "")); // Cheque de Tercero
        tab.setIndex(-3);

        tab = dialog.getTabs().add(null);
        tab.setFatherTab(keyCobros);
        tab.setName(getText(1070, "")); // Otros
        tab.setIndex(-4);

        tab = dialog.getTabs().add(null);
        tab.setFatherTab(keyCobros);
        tab.setName(getText(2102, "")); // Cta Corriente
        tab.setIndex(-5);

        var elem = properties.add(null, DWC.COPY_CHEQUES);

        elem.setType(T.button);
        elem.setName(getText(3839, ""));
        elem.setKey(K_COPY_CHEQUE);
        elem.setTabIndex(-1);

        elem = properties.add(null, DWC.CHEQUES);

        elem.setType(T.grid);
        setGridCheques(elem.getGrid());
        elem.setKey(WC.KW_CHEQUES);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);
        elem.setTabIndex(-1);

        elem = properties.add(null, DWC.EFECTIVO);

        elem.setType(T.grid);
        setGridEfectivo(elem.getGrid());
        elem.setKey(WC.KW_EFECTIVO);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);
        elem.setTabIndex(-2);

        elem = properties.add(null, DWC.CHEQUES_TERCERO);

        elem.setType(T.grid);
        setGridChequesT(elem.getGrid());
        elem.setKey(WC.KW_CHEQUEST);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);
        elem.setTabIndex(-3);

        elem = properties.add(null, DWC.OTROS);

        elem.setType(T.grid);
        setGridOtros(elem.getGrid());
        elem.setKey(WC.KW_OTROS);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);
        elem.setTabIndex(-4);

        elem = properties.add(null, DWC.CTA_CTE);

        elem.setType(T.grid);
        setGridCtaCte(elem.getGrid());
        elem.setKey(WC.KW_CTA_CTE);
        elem.setGridAddEnabled(false);
        elem.setGridEditEnabled(false);
        elem.setGridRemoveEnabled(false);
        elem.setTabIndex(-5);

        elem = properties.add(null, DWC.PAGO_INDICADO);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setName(getText(2208, "")); // A Pagar
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setEnabled(false);
        elem.setKey(WC.KW_IMPORTE_INDICADO);

        elem = properties.add(null, DWC.PAGO_NETO);
        elem.setName(getText(1581, "")); // Neto
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setEnabled(false);
        elem.setKey(WC.KW_IMPORTE_NETO);

        elem = properties.add(null, DWC.PAGO_OTROS);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setName(getText(1070, "")); // Otros
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setEnabled(false);
        elem.setKey(WC.KW_IMPORTE_OTROS);

        elem = properties.add(null, DWC.PAGO_TOTAL);
        elem.setName(getText(1584, "")); // Total
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setEnabled(false);
        elem.setKey(WC.KW_IMPORTE_TOTAL);
      };

      var setGridOtros = function(grid) {

        var columns = grid.getColumns();
        columns.clear();

        columns.add(null).setVisible(false);

        var elem;

        elem = columns.add(null);
        elem.setName(getText(1267, "")); // Cuenta
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setKey(KIO_CUE_ID);
        elem.setSelectFilter(D.getCuentaOtroFilterForCaja(false));

        elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KIO_MON_ID);

        elem = columns.add(null);
        elem.setName(getText(1904, "")); // Debe
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIO_DEBE);

        elem = columns.add(null);
        elem.setName(getText(1905, "")); // Haber
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIO_HABER);

        elem = columns.add(null);
        elem.setName(getText(1901, "")); // Origen
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIO_IMPORTEORIGEN);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIO_DESCRIP);

        elem = columns.add(null);
        elem.setName(getText(1403, "")); // Retención
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.RETENCION);
        elem.setKey(KIO_RET_ID);

        elem = columns.add(null);
        elem.setName(getText(2103, "")); // C. Retención
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIO_NRORETENCION);

        elem = columns.add(null);
        elem.setName(getText(2104, "")); // % Retención
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
        elem.setKey(KIO_PORCRETENCION);

        elem = columns.add(null);
        elem.setName(getText(1569, "")); // Fecha
        elem.setType(Dialogs.PropertyType.date);
        elem.setKey(KIO_FECHARETENCION);

        elem = columns.add(null);
        elem.setName(getText(1057, "")); // Centro de Costo
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTRO_COSTO);
        elem.setKey(KIO_CCOS_ID);

        elem = columns.add(null, CT.FC_ID_RET);
        elem.setName(getText(1866, "")); // Factura
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.FACTURAS_DE_COMPRA);
        elem.setKey(KIO_FC_ID_RET);
      };

      var setGridChequesT = function(grid) {

        var columns = grid.getColumns();
        columns.clear();

        columns.add(null).setVisible(false);

        var elem;

        elem = columns.add(null);
        elem.setName(getText(1267, "")); // Cuenta
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setSelectFilter(D.selectFilterForCuentaChequesT);
        elem.setKey(KICHT_CUE_ID);

        elem = columns.add(null, C_CHEQUET);
        elem.setName(getText(2059, "")); // Nr. Cheque
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CHEQUE);
        elem.setSelectFilter("1 = 2");
        elem.setSubType(Dialogs.PropertySubType.integer);
        elem.setKey(KICHT_CHEQUE);

        elem = columns.add(null);
        elem.setName(getText(1150, "")); // Cliente
        elem.setType(T.text);
        elem.setKey(KICHT_CLI_ID);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1122, "")); // Banco
        elem.setType(T.text);
        elem.setKey(KICHT_BCO_ID);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(2063, "")); // Mon
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setKey(KICHT_MON_ID);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1901, "")); // Origen
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KICHT_IMPORTEORIGEN);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KICHT_IMPORTE);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(2065, "")); // Depositar el
        elem.setType(Dialogs.PropertyType.date);
        elem.setKey(KICHT_FECHACOBRO);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1634, "")); // Vto.
        elem.setType(Dialogs.PropertyType.date);
        elem.setKey(KICHT_FECHAVTO);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1083, "")); // Clering
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CLEARING);
        elem.setKey(KICHT_CLE_ID);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KICHT_DESCRIP);
      };

      var setGridCheques = function(grid) {

        var columns = grid.getColumns();
        columns.clear();

        columns.add(null).setVisible(false);

        var elem;

        elem = columns.add(null);
        elem.setName(getText(1267, "")); // Cuenta
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setSelectFilter(D.selectFilterForCuentaChequesP);
        elem.setKey(KICH_CUE_ID);

        elem = columns.add(null, C_CHEQUERA);
        elem.setName(getText(2064, "")); // Chequera
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CHEQUERA);
        elem.setKey(KICH_CHEQUERA);

        elem = columns.add(null);
        elem.setName(getText(2059, "")); // Nr. Cheque
        elem.setType(T.text);
        elem.setKey(KICH_CHEQUE);

        elem = columns.add(null);
        elem.setName(getText(2063, "")); // Mon
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setKey(KICH_MON_ID);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1901, "")); // Origen
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KICH_IMPORTEORIGEN);

        elem = columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KICH_IMPORTE);

        elem = columns.add(null);
        elem.setName(getText(2065, "")); // Depositar el
        elem.setType(T.date);
        elem.setDefaultValue(Grids.createCell());
        elem.getDefaultValue().setValue(Cairo.Dates.today());
        elem.setKey(KICH_FECHACOBRO);

        elem = columns.add(null);
        elem.setName(getText(1634, "")); // Vto.
        elem.setType(T.date);
        elem.setDefaultValue(Grids.createCell());
        elem.getDefaultValue().setValue(Cairo.Dates.DateNames.addToDate("y", 1, Cairo.Dates.today()));
        elem.setKey(KICH_FECHAVTO);

        elem = columns.add(null);
        elem.setName(getText(1083, "")); // Clering
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CLEARING);
        elem.setKey(KICH_CLE_ID);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(T.text);
        elem.setSubType(Dialogs.PropertySubType.textButtonEx);
        elem.setKey(KICH_DESCRIP);
      };

      var setGridEfectivo = function(grid) {

        var columns = grid.getColumns();
        columns.clear();

        columns.add(null).setVisible(false);

        var elem;

        elem = columns.add(null);
        elem.setName(getText(1267, "")); // Cuenta
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setSelectFilter(D.getCuentaEfectivoFilterForCaja(false));
        elem.setKey(KIE_CUE_ID);

        elem = columns.add(null);
        elem.setName(getText(2063, "")); // Mon
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setKey(KIE_MON_ID);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1901, "")); // Origen
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIE_IMPORTEORIGEN);

        elem = columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIE_IMPORTE);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIE_DESCRIP);
      };

      var setGridCtaCte = function(grid) {

        var columns = grid.getColumns();
        columns.clear();

        columns.add(null).setVisible(false);

        var elem;

        elem = columns.add(null);
        elem.setName(getText(1267, "")); // Cuenta
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setSelectFilter(D.selectFilterCuentaNotInCaja);
        elem.setKey(KICC_CUE_ID);

        elem = columns.add(null);
        elem.setName(getText(1901, "")); // Origen
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KICC_IMPORTEORIGEN);

        elem = columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KICC_IMPORTE);
      };

      var loadStepDatosGenerales = function() {

        // the step's key must be the constant that defines them
        // this is crucial for the navigation to work
        //
        var step = m_objWizard.getSteps().add(null, U.getKey(WCS.DATOS_GENERALES));

        step.getProperties().setLayout(Dialogs.Layout.verticalTwoColumn);

        var properties = step.getProperties();

        var elem = properties.add(null);
        elem.setType(T.label);
        elem.setSubType(ST.title);
        elem.setValue(getText(2148, "")); // Complete los siguientes datos del Recibo

        elem = properties.add(null, DWC.FECHA);
        elem.setType(T.date);
        elem.setName(getText(1569, "")); // Fecha
        elem.setKey(WC.KW_FECHA);
        elem.setValue(Cairo.Dates.today());

        elem = properties.add(null, DWC.PROVEEDOR2);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PROVEEDOR);
        elem.setEnabled(false);
        elem.setName(getText(1151, "")); // Proveedor
        elem.setKey(WC.KW_PROVEEDOR2);

        elem = properties.add(null, DWC.SUCURSAL);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.SUCURSAL);
        elem.setName(getText(1281, "")); // Sucursal
        elem.setValue(Cairo.User.getSucName());
        elem.setSelectId(Cairo.User.getSucId());
        elem.setKey(WC.KW_SUCURSAL);

        elem = properties.add(null, DWC.COMPROBANTE);
        elem.setType(T.text);
        elem.setName(getText(1610, "")); // Comprobante
        elem.setKey(WC.KW_COMPROBANTE);

        elem = properties.add(null, DWC.LEGAJO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LEGAJOS);
        elem.setName(getText(1575, "")); // Legajo
        elem.setKey(WC.KW_LEGAJO);

        elem = properties.add(null, DWC.CENTRO_COSTO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CENTROS_DE_COSTO);
        elem.setName(getText(1057, "")); // Centro de Costo
        elem.setKey(WC.KW_CENTRO_COSTO);

        elem = properties.add(null, DWC.OBSERVACIONES);
        elem.setType(T.text);
        elem.setName(getText(1861, "")); // Observaciones
        elem.setKey(WC.KW_DESCRIP);
      };

      var checkFacturas = function() {
        if(val(getTotal().getValue()) === 0) {
          return M.showWarningWithFail(getText(2149, "")); // Debe indicar una o más facturas, un importe como anticipo, o ambas cosas.
        }
        else {
          return P.resolvedPromise(true);
        }
      };

      var loadFacturasXProveedor = function() {
        
        var onlySelected = getOnlySelected().getValue();

        return DB.getData(
            "load[" + m_apiPath + "tesoreria/ordenespago/proveedor/"
              + getProveedor().toString()
              + "/facturas]"
          )
          .then(function(response) {
            try {

              if(response.success === true) {

                var facturas = getFacturas();

                if(getAgrupados()) {
                  facturas.getColumns().item(DWC.IMPORTE).setVisible(false);
                  facturas.getColumns().item(DWC.PENDIENTE).setVisible(true);
                }
                else {
                  facturas.getColumns().item(DWC.IMPORTE).setVisible(true);
                  facturas.getColumns().item(DWC.PENDIENTE).setVisible(false);
                }

                var items = DB.getResultSetFromData(response.data.get('facturas'));
                var rates = DB.getResultSetFromData(response.data.get('rates'));

                var rows = facturas.getRows();
                rows.clear();

                var showCotizacion = false;

                for(var _i = 0, count = items.length; _i < count; _i += 1) {

                  var fcId = valField(items[_i], CC.FC_ID);
                  var selected = getApply(fcId);
                  
                  if(!onlySelected || selected) {

                    var row = rows.add(null);

                    row.add(null);

                    var elem = row.add(null);
                    elem.setId(valField(items[_i], CT.FCD_ID));
                    elem.setKey(KI_FCD_ID);

                    elem = row.add(null);
                    elem.setId(parseInt(selected));
                    elem.setKey(KI_SELECT);

                    elem = row.add(null);
                    elem.setValue(valField(items[_i], C.DOC_NAME));
                    elem.setKey(KI_DOC);

                    elem = row.add(null);
                    elem.setValue(valField(items[_i], CC.FC_NRODOC));
                    elem.setKey(KI_NRODOC);

                    elem = row.add(null);
                    elem.setValue(valField(items[_i], CC.FC_NUMERO));
                    elem.setId(valField(items[_i], CC.FC_ID));
                    elem.setKey(KI_FC_ID);

                    elem = row.add(null);
                    elem.setValue(valField(items[_i], CC.FC_FECHA));
                    elem.setKey(KI_FECHA);

                    elem = row.add(null);
                    elem.setValue(valField(items[_i], CC.FC_PENDIENTE));
                    elem.setKey(KI_PENDIENTE);

                    elem = row.add(null);
                    elem.setValue(valField(items[_i], CT.FCD_PENDIENTE));
                    elem.setKey(KI_IMPORTE);

                    elem = row.add(null);
                    if(selected) {
                      elem.setValue(valField(items[_i], CT.FCD_PENDIENTE));
                    }
                    else {
                      elem.setValue(0);
                    }
                    elem.setKey(KI_APLICAR);

                    elem = row.add(null);
                    elem.setValue(valField(items[_i], C.MON_NAME));
                    elem.setId(valField(items[_i], C.MON_ID));
                    elem.setKey(KI_MONEDA);

                    elem = row.add(null);
                    var origen = valField(items[_i], CC.FC_TOTAL_ORIGEN);
                    elem.setValue(origen ? origen : "");
                    elem.setKey(KI_IMPORTEORIGEN);
                    if(val(elem.getValue()) !== 0) { showCotizacion = true; }

                    elem = row.add(null);
                    var cotiz = valField(items[_i], CC.FC_COTIZACION);
                    elem.setValue(cotiz ? cotiz : "");
                    elem.setKey(KI_COTIZACION);

                    elem = row.add(null);
                    elem.setValue(valField(items[_i], CC.FC_TOTAL));
                    elem.setKey(KI_TOTAL);

                    elem = row.add(null);
                    elem.setValue(0);
                    elem.setKey(KI_COTIZACION2);

                    elem = row.add(null);
                    elem.setValue(valField(items[_i], CT.FCD_FECHA));
                    elem.setKey(KI_VTO);

                    elem = row.add(null);
                    elem.setValue(valField(items[_i], CC.FC_DESCRIP));
                    elem.setKey(KI_DESCRIP);
                  }
                }

                if(!showCotizacion) {
                  getFacturas().getColumns().item(DWC.COTIZACION).setVisible(false);
                  getFacturas().getColumns().item(DWC.MONEDA).setVisible(false);
                  getCotizacion().setVisible(false);
                  getTotalOrigen().setVisible(false);
                }
                else {
                  getFacturas().getColumns().item(DWC.COTIZACION).setVisible(true);
                  getFacturas().getColumns().item(DWC.MONEDA).setVisible(true);
                  getCotizacion().setVisible(true);
                  getTotalOrigen().setVisible(true);
                }

                m_bMultiCurrency = false;

                if(rates.length > 0) {

                  m_bMultiCurrency = true;

                  getFacturas().getColumns().item(DWC.COTIZACION2).setVisible(true);

                  for(var _i = 0, _count = getFacturas().getRows().size(); _i < _count; _i++) {

                    var row = getFacturas().getRows().item(_i);

                    for(var _j = 0, _countj = rates.length; _j < _countj; _j++) {
                      if(valField(rates[_j], C.MON_ID) === getCell(row, KI_MONEDA).getId()) {
                        getCell(row, KI_COTIZACION2).setValue(valField(rates[_j], C.MON_PRECIO));
                        break;
                      }
                    }
                  }

                  getCotizacion().setValue(valField(rates[0], C.MON_PRECIO));
                  refreshCotizacion(false);

                }
                else {
                  getCotizacion().setVisible(false);
                  getFacturas().getColumns().item(DWC.COTIZACION2).Visible = false;
                }

                m_objWizard.showValue(getCotizacion());
                m_objWizard.showValue(getTotalOrigen());

                refreshFacturas();
                showTotalFacturas();

                return true;
              }
            }
            catch(ex) {
              Cairo.manageErrorEx(ex.message, ex, "showFacturaRemito", C_MODULE, "");
              return false;
            }
          });
      };

      var getApply = function(fcId) {
        var selected = false;
        
        for(var _i = 0; _i < m_fcIds.length; _i++) {
          if(m_fcIds[_i] === fcId) {
            selected = true;
            break;
          }
        }

        return selected;
      };

      var getCuentasAcreedor = function() {
        var total = 0;
        var anticipoOrigen = 0;

        getCtaCte().getRows().clear();

        var cuentaProperty = getCuentaAnticipo();
        var cueIdAnticipo = cuentaProperty.getSelectId();
        var cuentaAnticipo = cuentaProperty.getValue();

        var monId = getMonedaAnticipo().getSelectId();
        var anticipo = val(getAnticipoImporte().getValue());

        if(monId !== m_defaultCurrency.id) {
          var cotizacion = val(getCotizacionAnticipo().getValue());
          anticipoOrigen = anticipo;
          anticipo = anticipo * cotizacion;
        }
        else {
          anticipoOrigen = 0;
        }

        return D.Tesoreria.getCuentasAcreedor(
            getFacturas(), KI_FC_ID, KI_APLICAR, KI_COTIZACION2,
            anticipo, cueIdAnticipo, cuentaAnticipo, anticipoOrigen)
          .whenSuccessWithResult(function(response) {

            var cuentas = response.cuentas;

            for(var _i = 0, _count = cuentas.length; _i < _count; _i++) {

              var row = getCtaCte().getRows().add(null);

              var cell = row.add(null);

              cell = row.add(null);
              cell.setValue(cuentas[_i].cueName);
              cell.setId(cuentas[_i].cueId);
              cell.setKey(KICC_CUE_ID);

              cell = row.add(null);
              cell.setValue(cuentas[_i].importeOrigen);
              cell.setKey(KICC_IMPORTEORIGEN);

              cell = row.add(null);
              cell.setValue(cuentas[_i].importe);
              cell.setKey(KICC_IMPORTE);

              total = total + cuentas[_i].importe;
            }

            getPagoIndicado().setValue(total);
            m_objWizard.showValue(getPagoIndicado());

            refreshCtaCte();

            var p = null;

            if(Cairo.getTesoreriaConfig().getCalcularRetenciones()) {

              getOtros().getRows().clear();

              p = getRetencionForProveedor(total, getFacturarForRetencion()).whenSuccessWithResult(function(response) {

                var retenciones = DB.getResultSetFromData(response.data);

                if(retenciones.length === 0) {

                  return M.showWarningWithFalse(getText(2210, ""));
                  // Cairo está configurado para calcular retenciones, pero no sea ha
                  // indicado la Retención a usar.
                }
                else {

                  for(var i = 0, count = retenciones.length; i < count; i += 1) {

                    var retId = valField(retenciones[i], C.RET_ID);
                    var retNombre = valField(retenciones[i], C.RET_NAME);

                    var cueId = valField(retenciones[i], C.CUE_ID);
                    var cueNombre = valField(retenciones[i], C.CUE_NAME);
                    var monId = valField(retenciones[i], C.MON_ID);

                    if(cueId !== NO_ID) {

                      var retencionInfo = {
                        retencion: valField(retenciones[i], C.RETENCION_INFO_RETENCION),
                        porcentaje: valField(retenciones[i], C.RETENCION_INFO_PORCENTAJE),
                        comprobante: valField(retenciones[i], C.RETENCION_INFO_COMPROBANTE),
                        base: valField(retenciones[i], C.RETENCION_INFO_BASE),
                      };

                      if(retencionInfo.retencion > 0) {

                        var retencion = retencionInfo.retencion;
                        var porcentaje = retencionInfo.porcentaje/100; // TODO: check this division is needed
                        var comprobante = retencionInfo.comprobante;
                        var base = retencionInfo.base;

                        var row = getOtros().getRows().add(null);

                        row.add(null);
                        row.add(null).setKey(KIO_CUE_ID);
                        row.add(null).setKey(KIO_MON_ID);
                        row.add(null).setKey(KIO_DEBE);
                        row.add(null).setKey(KIO_HABER);
                        row.add(null).setKey(KIO_IMPORTEORIGEN);
                        row.add(null).setKey(KIO_DESCRIP);
                        row.add(null).setKey(KIO_RET_ID);
                        row.add(null).setKey(KIO_NRORETENCION);
                        row.add(null).setKey(KIO_PORCRETENCION);
                        row.add(null).setKey(KIO_FECHARETENCION);
                        row.add(null).setKey(KIO_CCOS_ID);
                        row.add(null).setKey(KIO_FC_ID_RET);

                        var cell = getCell(row, KIO_CUE_ID);
                        if(cell.getId() === NO_ID || cell.getId() === cueId) {
                          cell.setId(cueId);
                          cell.setValue(cueNombre);
                        }

                        var cell = getCell(row, KIO_MON_ID);
                        cell.setId(monId);

                        var cell = getCell(row, KIO_RET_ID);
                        if(cell.getId() === NO_ID || cell.getId() === retId) {
                          cell.setId(retId);
                          cell.setValue(retNombre);
                        }

                        getCell(row, KIO_DEBE).setValue(retencion);
                        getCell(row, KIO_PORCRETENCION).setValue(porcentaje);
                        getCell(row, KIO_NRORETENCION).setValue(comprobante);
                        getCell(row, KIO_DESCRIP)
                          .setValue(
                            getText(2972, "",
                              Cairo.accounting.formatNumber(base, Cairo.Settings.getCurrencyRateDecimalsFormat())));

                      }
                      else {

                        // if the amount for this tax is zero and the
                        // first row belongs to this tax we remove the row
                        //
                        var rows = getOtros().getRows();
                        if(rows.count() > 0) {
                          if(getCell(rows.item(0), KIO_RET_ID).getId() === retId && retId !== NO_ID) {
                            rows.remove(0);
                          }
                        }
                      }
                    }
                    else {
                      p = M.showWarningWithFalse(getText(2209, "", retNombre));
                      // Cairo está configurado para calcular retenciones, pero no se ha
                      // configurado la Cuenta Contable para la Retención " & retNombre & "."
                    }
                  }
                }

                return true;
              });
            }

            p = p || P.resolvedPromise();

            return p.then(function() {

              refreshOtros();
              showPagoOtro();
              showPagoTotal();

              return true;

            });
          });
      };

      var getFacturarForRetencion = function() {
        var rtn = "";
        var rows = getFacturas().getRows();
        var _count = rows.size();

        for (var _i = 0; _i < _count; _i++) {

          var row = rows.item(_i);

          if(Dialogs.cell(row, KI_SELECT).getId()) {
            var value = Cairo.Util.val(Dialogs.cell(row, KI_APLICAR).getValue());
            if(value) {
              if(value !== Cairo.Util.val(Dialogs.cell(row, KI_PENDIENTE).getValue())) {
                rtn = rtn + Dialogs.cell(row, KI_FC_ID).getValue() + "-" + Cairo.Database.sqlNumber(value) + "*";
              }
              else {
                rtn = rtn + Dialogs.cell(row, KI_FC_ID).getValue() + "*";
              }
            }
          }
        }

        if(rtn.substring(rtn.length - 1) === "*") {
          rtn = rtn.substring(0, rtn.length - 1);
        }

        return rtn;
      };

      var getRetencionForProveedor = function(total, facturas) {
        var params = {
          fecha: DB.sqlDate(getFecha().getValue()),
          pago: DB.sqlNumber(total),
          facturas: facturas
        }
        return DB.getData(
          "load[" + m_apiPath
            + "general/proveedor/" + getProveedor().toString()
            + "/retenciones]", null, params);

      };

      var isEmptyRowCheques = function(row, rowIndex) {

        for(var _i = 0, _count = row.size(); _i < _count; _i++) {
          
          var cell = row.item(_i);
          
          switch (cell.getKey()) {
            
            case KICH_CUE_ID:
            case KICH_CHEQUERA:
            case KICH_MON_ID:
            case KICH_CLE_ID:
              if(!valEmpty(cell.getId(), Types.id)) {
                return false;
              }
              break;

            case KICH_IMPORTE:
            case KICH_IMPORTEORIGEN:
              if(!valEmpty(val(cell.getValue()), Types.double)) {
                return false;
              }
              break;

            case KICH_DESCRIP:
            case KICH_CHEQUE:
              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var isEmptyRowTCheques = function(row, rowIndex) {

        for(var _i = 0, _count = row.size(); _i < _count; _i++) {
          
          var cell = row.item(_i);
          
          switch (cell.getKey()) {
            case KICHT_CUE_ID:
            case KICHT_MON_ID:
            case KICHT_CLE_ID:
              if(!valEmpty(cell.getId(), Types.id)) {
                return false;
              }
              break;

            case KICHT_IMPORTE:
            case KICHT_IMPORTEORIGEN:
              if(!valEmpty(val(cell.getValue()), Types.double)) {
                return false;
              }
              break;

            case KICHT_DESCRIP:
            case KICHT_CHEQUE:
              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var validateRowCheques = function(row, rowIndex) {
        var bOrigen = false;
        var monId = NO_ID;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        for(var _i = 0, _count = row.size(); _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KICH_CUE_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2113, "", strRow)); // Debe indicar una cuenta contable (1)
              }
              break;

            case KICH_MON_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2114, "", strRow)); // Debe indicar una moneda (1)
              }
              monId = cell.getId();
              break;

            case KICH_CLE_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2115, "", strRow)); // Debe indicar un clearing (1)
              }
              break;

            case KICH_IMPORTEORIGEN:
              bOrigen = !valEmpty(val(cell.getValue()), Types.double);
              break;

            case KICH_IMPORTE:
              if(valEmpty(val(cell.getValue()), Types.double)) {
                return M.showInfoWithFalse(getText(1897, "", strRow)); // Debe indicar un importe (1)
              }
              break;

            case KICH_CHEQUERA:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2193, "", strRow)); // Debe indicar una chequera (1)
              }
              break;

            case KICH_CHEQUE:
              if(valEmpty(cell.getValue(), Types.text)) {
                return M.showInfoWithFalse(getText(2197, "", strRow)); // Debe indicar un cheque (1)
              }
              break;

            case KICH_FECHACOBRO:
              if(valEmpty(cell.getValue(), Types.date)) {
                return M.showInfoWithFalse(getText(2117, "", strRow)); // Debe indicar una fecha para depositar (1)
              }
              break;

            case KICH_FECHAVTO:
              if(valEmpty(cell.getValue(), Types.date)) {
                return M.showInfoWithFalse(getText(1384, "", strRow)); // Debe indicar una fecha de vencimiento (1)
              }
              break;
          }
        }

        if(!bOrigen && monId !== m_defaultCurrency.id) {
          return M.showInfoWithFalse(getText(2211, "", strRow)); // Debe indicar un importe para la moneda extranjera en la solapa de Cheques (1)
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var validateRowChequesT = function(row, rowIndex) {

        var strRow = " (Row: " + rowIndex.toString() + ")";

        for(var _i = 0, _count = row.size(); _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KICHT_CUE_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2113, "", strRow)); // Debe indicar una cuenta contable (1)
              }
              break;

            case KICHT_CHEQUE:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2197, "", strRow)); // Debe indicar un cheque (1)
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var isEmptyRowOtros = function(row, rowIndex) {

        for(var _i = 0, _count = row.size(); _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {
            case KIO_CUE_ID:
            case KIO_CCOS_ID:
            case KIO_RET_ID:
              if(!valEmpty(cell.getId(), Types.id)) {
                return false;
              }
              break;

            case KIO_DEBE:
            case KIO_HABER:
            case KIO_IMPORTEORIGEN:
            case KIO_PORCRETENCION:
              if(!valEmpty(val(cell.getValue()), Types.double)) {
                return false;
              }
              break;

            case KIO_NRORETENCION:
            case KIO_DESCRIP:
              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;

            case KIO_FECHARETENCION:
              if(!valEmpty(cell.getValue(), Types.date)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var validateRowOtros = function(row, rowIndex) {
        var bOrigen = 0;
        var bDebe = false;
        var bHaber = false;
        var monId = 0;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        for(var _i = 0, _count = row.size(); _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KIO_CUE_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2113, "", strRow)); // Debe indicar una cuenta contable (1)
              }
              break;

            case KIO_MON_ID:
              monId = cell.getId();
              break;

            case KIO_DEBE:
              bDebe = !valEmpty(val(cell.getValue()), Types.double);
              break;

            case KIO_HABER:
              bHaber = !valEmpty(val(cell.getValue()), Types.double);
              break;

            case KIO_IMPORTEORIGEN:
              bOrigen = !valEmpty(val(cell.getValue()), Types.double);
              break;
          }
        }

        if(!bDebe && !bHaber) {
          return M.showInfoWithFalse(getText(1898, "", strRow)); // Debe indicar un importe en el debe o en el haber (1)
        }

        if(!bOrigen && monId !== m_defaultCurrency.id) {
          return M.showInfoWithFalse(getText(2118, "", strRow)); // Debe indicar un importe para la moneda extranjera en la solapa de otros (1)
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var isEmptyRowEfectivo = function(row, rowIndex) {

        for(var _i = 0, _count = row.size(); _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {
            case KIE_CUE_ID:
              if(!valEmpty(cell.getId(), Types.id)) {
                return false;
              }
              break;

            case KIE_IMPORTE:
            case KIE_IMPORTEORIGEN:

              if(!valEmpty(val(cell.getValue()), Types.double)) {
                return false;
              }

            case KIE_DESCRIP:
              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
          }
        }

        return true;
      };

      var validateRowEfectivo = function(row, rowIndex) {
        var bOrigen = 0;
        var monId = 0;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        for(var _i = 0, _count = row.size(); _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KIE_CUE_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2113, "", strRow)); // Debe indicar una cuenta contable (1)
              }
              break;

            case KIE_MON_ID:
              monId = cell.getId();
              break;

            case KIE_IMPORTEORIGEN:
              bOrigen = !valEmpty(val(cell.getValue()), Types.double);
              break;

            case KIE_IMPORTE:
              if(valEmpty(val(cell.getValue()), Types.double)) {
                return M.showInfoWithFalse(getText(1897, "", strRow)); // Debe indicar un importe (1)
              }
              break;
          }
        }

        if(!bOrigen && monId !== m_defaultCurrency.id) {
          return M.showInfoWithFalse(getText(2118, "", strRow)); // Debe indicar un importe para la moneda extranjera en la solapa de efectivo (1)
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var validatePago = function() {
        var p = P.resolvedPromise(true);

        for(var _i = 0, _count = getCheques().getRows().size(); _i < _count; _i++) {
          var row = getCheques().getRows().item(_i);
          if(!isEmptyRowCheques(row, _i + 1)) {
            p = p.whenSuccess(call(validateRowCheques, row, _i + 1));
          }
        }

        for(var _i = 0, _count = getChequesT().getRows().size(); _i < _count; _i++) {
          var row = getChequesT().getRows().item(_i);
          if(!isEmptyRowTCheques(row, _i + 1)) {
            p = p.whenSuccess(call(validateRowChequesT, row, _i + 1));
          }
        }

        for(var _i = 0, _count = getEfectivo().getRows().size(); _i < _count; _i++) {
          var row = getEfectivo().getRows().item(_i);
          if(!isEmptyRowEfectivo(row, _i + 1)) {
            p = p.whenSuccess(call(validateRowEfectivo, row, _i + 1));
          }
        }

        for(var _i = 0, _count = getOtros().getRows().size(); _i < _count; _i++) {
          var row = getOtros().getRows().item(_i);
          if(!isEmptyRowOtros(row, _i + 1)) {
            p = p.whenSuccess(call(validateRowOtros, row, _i + 1));
          }
        }

        p = p.whenSuccess(function() {
          if(round(val(getPagoIndicado().getValue()), Cairo.Settings.getAmountDecimals())
            !== round(val(getPagoTotal().getValue()), Cairo.Settings.getAmountDecimals())) {
            return M.showWarningWithFalse(getText(2214, "")); // El total de los instrumentos de pago no coincide con el monto a pagar
          }
          return true;
        });

        return p;
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
          return M.showWarningWithFalse(getText(2215, "")); // Debe indicar la fecha de la Orden de Pago
        }

        if(valEmpty(getSucursal().getSelectId(), Types.id)) {
          return M.showWarningWithFalse(getText(1560, "")); // Debe indicar la sucursal
        }

        return P.resolvedPromise(true);
      };

      var initialize = function() {
        try {

          m_fcIds = [];

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "initialize", C_MODULE, "");
        }
      };

      self.destroy = function() {
        try {

          m_fcIds = null;

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");
        }
      };

      var getSave = function(register) {

        register.setFieldId(CT.OPG_ID);
        register.setTable(CT.ORDEN_PAGO);
        register.setPath(m_apiPath + "tesoreria/ordenpago/from_facturas");
        register.setId(Cairo.Constants.NEW_ID);

        var fields = register.getFields();

        fields.add(CT.OPG_NUMERO, 0, Types.long);
        fields.add(CT.OPG_NRODOC, m_lastNroDoc, Types.text);
        fields.add(CT.OPG_DESCRIP, getDescrip().getValue(), Types.text);
        fields.add(CT.OPG_FECHA, getFecha().getValue(), Types.date);

        fields.add(C.PROV_ID, m_lastProvId, Types.id);
        fields.add(C.CCOS_ID, getCentroCosto().getSelectId(), Types.id);
        fields.add(C.SUC_ID, getSucursal().getSelectId(), Types.id);
        fields.add(C.DOC_ID, getDoc(), Types.id);
        fields.add(CT.OPG_COTIZACION, val(getCotizacion().getValue()), Types.double);
        fields.add(C.LGJ_ID, getLegajo().getSelectId(), Types.id);

        fields.add(CT.OPG_NETO, val(getPagoNeto().getValue()), Types.currency);
        fields.add(CT.OPG_OTROS, val(getPagoOtros().getValue()), Types.currency);
        fields.add(CT.OPG_TOTAL, val(getPagoTotal().getValue()), Types.currency);

        fields.add(CT.OPG_GRABAR_ASIENTO, 1, Types.boolean);
        fields.add(C.EST_ID, D.Status.pendiente, Types.id);
        fields.add(CT.OPG_ID, Cairo.Constants.NEW_ID, Types.long);
        
      };
      
      var save = function() {
        return D.docCanBeSavedEx(m_objWizard.getDialog(), DWC.FECHA, DWC.DOC)
          .whenSuccess(function() {

            var register = new DB.Register();

            // TODO: check if this setMask call is nedeed
            //
            //m_lastNroDoc = SetMask(w_getComprobante.getValue(), w_getComprobante.getTextMask());
            m_lastNroDoc = getComprobante().getValue();;
            m_lastProvId = getProveedor();

            //
            // the orden is share between the five types of items (cheques, chequesT, efectivo, otros and cta cte)
            //
            m_orden = 0;

            getSave(register);

            saveCheques(register);
            saveChequesT(register);
            saveEfectivo(register);
            saveOtros(register);
            saveCtaCte(register);
            saveFacturas(register);

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
              });
          }
        );
      };

      var saveCheques = function(mainRegister) {

        var transaction = new DB.createTransaction();

        transaction.setTable(CT.ORDEN_PAGO_ITEM_CHEQUE_TMP);

        var rows = getCheques().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {
          
          var row = rows.item(_i);

          if(!isEmptyRowCheques(row, _i)) {

            var register = new DB.Register();

            register.setFieldId(CT.OPGI_TMP_ID);
            register.setId(Cairo.Constants.NEW_ID);

            var fields = register.getFields();

            for(var _j = 0, _countj = row.size(); _j < _countj; _j++) {
              
              var cell = row.item(_j);
              switch (cell.getKey()) {

                case KICH_DESCRIP:
                  fields.add(CT.OPGI_DESCRIP, cell.getValue(), Types.text);
                  break;

                case KICH_CHEQUERA:
                  fields.add(CT.CHQ_ID, cell.getId(), Types.id);
                  break;

                case KICH_CHEQUE:
                  fields.add(CT.OPGI_TMP_CHEQUE, cell.getValue(), Types.text);
                  break;

                case KICH_CLE_ID:
                  fields.add(C.CLE_ID, cell.getId(), Types.id);
                  break;

                case KICH_MON_ID:
                  fields.add(C.MON_ID, cell.getId(), Types.id);
                  break;

                case KICH_FECHACOBRO:
                  fields.add(CT.OPGI_TMP_FECHA_COBRO, cell.getValue(), Types.date);
                  break;

                case KICH_FECHAVTO:
                  fields.add(CT.OPGI_TMP_FECHA_VTO, cell.getValue(), Types.date);
                  break;

                case KICH_CUE_ID:
                  fields.add(C.CUE_ID, NO_ID, Types.id);
                  break;

                case KICH_IMPORTEORIGEN:
                  fields.add(CT.OPGI_IMPORTE_ORIGEN, val(cell.getValue()), Types.currency);
                  break;

                case KICH_IMPORTE:
                  fields.add(CT.OPGI_IMPORTE, val(cell.getValue()), Types.currency);
                  break;
              }
            }

            m_orden = m_orden + 1;
            fields.add(CT.OPGI_ORDEN, m_orden, Types.integer);
            fields.add(CT.OPGI_TIPO, CT.OrdenPagoItemTipo.ITEM_CHEQUES, Types.integer);
            fields.add(CT.OPGI_ID, Cairo.Constants.NEW_ID, Types.long);
            fields.add(CT.OPGI_OTRO_TIPO, CT.OtroTipo.OTRO_HABER, Types.integer);

            transaction.addRegister(register);
          }          
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveChequesT = function(mainRegister) {

        var transaction = new DB.createTransaction();

        transaction.setTable(CT.ORDEN_PAGO_ITEM_CHEQUET_TMP);

        var rows = getChequesT().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          if(!isEmptyRowTCheques(row, _i)) {

            var register = new DB.Register();
            register.setFieldId(CT.OPGI_TMP_ID);
            register.setId(Cairo.Constants.NEW_ID);

            var fields = register.getFields();

            for(var _j = 0, _countj = row.size(); _j < _countj; _j++) {

              var cell = row.item(_j);
              switch (cell.getKey()) {

                case KICHT_DESCRIP:
                  fields.add(CT.OPGI_DESCRIP, cell.getValue(), Types.text);
                  break;

                case KICHT_CHEQUE:
                  fields.add(CT.CHEQ_ID, cell.getId(), Types.id);
                  break;

                case KICHT_CLE_ID:
                  fields.add(C.CLE_ID, cell.getId(), Types.id);
                  break;

                case KICHT_MON_ID:
                  fields.add(C.MON_ID, cell.getId(), Types.id);
                  break;

                case KICHT_FECHACOBRO:
                  fields.add(CT.OPGI_TMP_FECHA_COBRO, cell.getValue(), Types.date);
                  break;

                case KICHT_FECHAVTO:
                  fields.add(CT.OPGI_TMP_FECHA_VTO, cell.getValue(), Types.date);
                  break;

                case KICHT_CUE_ID:
                  fields.add(C.CUE_ID, cell.getId(), Types.id);
                  break;

                case KICHT_IMPORTEORIGEN:
                  fields.add(CT.OPGI_IMPORTE_ORIGEN, val(cell.getValue()), Types.currency);
                  break;

                case KICHT_IMPORTE:
                  fields.add(CT.OPGI_IMPORTE, val(cell.getValue()), Types.currency);
                  break;
              }
            }

            m_orden = m_orden + 1;
            fields.add(CT.OPGI_ORDEN, m_orden, Types.integer);
            fields.add(CT.OPGI_TIPO, CT.OrdenPagoItemTipo.ITEM_CHEQUEST, Types.integer);
            fields.add(CT.OPGI_ID, Cairo.Constants.NEW_ID, Types.long);
            fields.add(CT.OPGI_OTRO_TIPO, CT.OtroTipo.OTRO_HABER, Types.integer);

            transaction.addRegister(register);
          }
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveOtros = function(mainRegister) {

        var transaction = new DB.createTransaction();

        transaction.setTable(CT.ORDEN_PAGO_ITEM_OTRO_TMP);

        var rows = getOtros().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = getOtros().getRows().item(_i);

          if(!isEmptyRowOtros(row, _i)) {

            var register = new DB.Register();

            register.setFieldId(CT.OPGI_TMP_ID);
            register.setId(Cairo.Constants.NEW_ID);

            var fields = register.getFields();

            for(var _j = 0, _countj = row.size(); _j < _countj; _j++) {

              var cell = row.item(_j);
              switch (cell.getKey()) {

                case KIO_DESCRIP:
                  fields.add(CT.OPGI_DESCRIP, cell.getValue(), Types.text);
                  break;

                case KIO_RET_ID:
                  fields.add(C.RET_ID, cell.getId(), Types.id);
                  break;

                case KIO_NRORETENCION:
                  fields.add(CT.OPGI_NRO_RETENCION, cell.getValue(), Types.text);
                  break;

                case KIO_PORCRETENCION:
                  fields.add(CT.OPGI_PORC_RETENCION, val(cell.getValue()), Types.double);
                  break;

                case KIO_CCOS_ID:
                  fields.add(C.CCOS_ID, cell.getId(), Types.id);
                  break;

                case KIO_FC_ID_RET:
                  fields.add(CT.FC_ID_RET, cell.getId(), Types.id);
                  break;

                case KIO_CUE_ID:
                  fields.add(C.CUE_ID, cell.getId(), Types.id);
                  break;

                case KIO_FECHARETENCION:
                  if(!valEmpty(cell.getValue(), Types.date)) {
                    fields.add(CT.OPGI_FECHA_RETENCION, cell.getValue(), Types.date);
                  }
                  break;

                case KIO_IMPORTEORIGEN:
                  fields.add(CT.OPGI_IMPORTE_ORIGEN, val(cell.getValue()), Types.currency);
                  break;

                case KIO_DEBE:
                  if(val(cell.getValue()) !== 0) {
                    fields.add(CT.OPGI_IMPORTE, val(cell.getValue()), Types.currency);
                    fields.add(CT.OPGI_OTRO_TIPO, CT.OtroTipo.OTRO_HABER, Types.integer);
                  }
                  break;

                case KIO_HABER:
                  if(val(cell.getValue()) !== 0) {
                    fields.add(CT.OPGI_IMPORTE, val(cell.getValue()), Types.currency);
                    fields.add(CT.OPGI_OTRO_TIPO, CT.OtroTipo.OTRO_DEBE, Types.integer);
                  }
                  break;
              }
            }

            m_orden = m_orden + 1;
            fields.add(CT.OPGI_ORDEN, m_orden, Types.integer);
            fields.add(CT.OPGI_TIPO, CT.OrdenPagoItemTipo.ITEM_OTROS, Types.integer);
            fields.add(CT.OPGI_ID, Cairo.Constants.NEW_ID, Types.long);

            transaction.addRegister(register);
          }
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveEfectivo = function(mainRegister) {

        var transaction = new DB.createTransaction();

        transaction.setTable(CT.ORDEN_PAGO_ITEM_EFECTIVO_TMP);

        var rows = getEfectivo().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          if(!isEmptyRowEfectivo(row, _i)) {

            var register = new DB.Register();

            register.setFieldId(CT.OPGI_TMP_ID);
            register.setId(Cairo.Constants.NEW_ID);

            var fields = register.getFields();

            for(var _j = 0, _countj = row.size(); _j < _countj; _j++) {

              var cell = row.item(_j);
              switch (cell.getKey()) {

                case KIE_DESCRIP:
                  fields.add(CT.OPGI_DESCRIP, cell.getValue(), Types.text);
                  break;

                case KIE_CUE_ID:
                  fields.add(C.CUE_ID, cell.getId(), Types.id);
                  break;

                case KIE_IMPORTEORIGEN:
                  fields.add(CT.OPGI_IMPORTE_ORIGEN, val(cell.getValue()), Types.currency);
                  break;

                case KIE_IMPORTE:
                  fields.add(CT.OPGI_IMPORTE, val(cell.getValue()), Types.currency);
                  break;
              }
            }

            m_orden = m_orden + 1;
            fields.add(CT.OPGI_ORDEN, m_orden, Types.integer);
            fields.add(CT.OPGI_TIPO, CT.OrdenPagoItemTipo.ITEM_EFECTIVO, Types.integer);
            fields.add(CT.OPGI_ID, Cairo.Constants.NEW_ID, Types.long);
            fields.add(CT.OPGI_OTRO_TIPO, CT.OtroTipo.OTRO_HABER, Types.integer);

            transaction.addRegister(register);
          }
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveCtaCte = function(mainRegister) {

        var transaction = new DB.createTransaction();

        transaction.setTable(CT.ORDEN_PAGO_ITEM_CUENTA_CORRIENTE_TMP);

        var rows = getCtaCte().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();

          register.setFieldId(CT.OPGI_TMP_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var fields = register.getFields();

          for(var _j = 0, _countj = row.size(); _j < _countj; _j++) {

            var cell = row.item(_j);
            switch (cell.getKey()) {

              case KICC_CUE_ID:
                fields.add(C.CUE_ID, cell.getId(), Types.id);
                break;

              case KICC_IMPORTEORIGEN:
                fields.add(CT.OPGI_IMPORTE_ORIGEN, val(cell.getValue()), Types.currency);
                break;

              case KICC_IMPORTE:
                fields.add(CT.OPGI_IMPORTE, val(cell.getValue()), Types.currency);
                break;
            }
          }

          m_orden = m_orden + 1;
          fields.add(CT.OPGI_ORDEN, m_orden, Types.integer);
          fields.add(CT.OPGI_TIPO, CT.OrdenPagoItemTipo.ITEM_CTA_CTE, Types.integer);
          fields.add(CT.OPGI_ID, Cairo.Constants.NEW_ID, Types.long);
          fields.add(CT.OPGI_OTRO_TIPO, CT.OtroTipo.OTRO_DEBE, Types.integer);

          transaction.addRegister(register);
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var getIva = function(vIva) {
        return DB.getData("load[" + m_apiPath + "tesoreria/ordenpago/facturas/taxes?ids=" + getFcIds() + "]");
      };

      var getFcIds = function() {
        var ids = [];
        var rows = getFacturas().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = getFacturas().getRows().item(_i);

          if(getCell(row, KI_SELECT).getId()) {
            if(val(getCell(row, KI_APLICAR).getValue())) {
              ids.push(getCell(row, KI_FC_ID).getId().toString());
            }
          }
        }

        return ids.toString();
      };

      var saveFacturas = function(mainRegister) {

        var transaction = new DB.createTransaction();

        transaction.setTable(CT.FACTURA_COMPRA_ORDEN_PAGO_TMP);

        var rows = getFacturas().getRows();

        var mustSave;
        var pago = 0;
        var cotiOrigen = 0;
        var cotiOrdenPago = 0;

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();

          register.setFieldId(CT.FC_OPG_TMP_ID);
          register.setId(Cairo.Constants.NEW_ID);

          mustSave = false;

          var fields = register.getFields();

          for(var _j = 0, _countj = row.size(); _j < _countj; _j++) {

            var cell = row.item(_j);

            if(getCell(row, KI_SELECT).getId()) {

              mustSave = true;

              switch (cell.getKey()) {
                case KI_FC_ID:
                  fields.add(CC.FC_ID, cell.getId(), Types.id);
                  break;

                case KI_FCD_ID:
                  fields.add(CT.FCD_ID, cell.getId(), Types.id);
                  break;

                case KI_APLICAR:
                  pago = val(cell.getValue());
                  break;

                case KI_IMPORTEORIGEN:
                  fields.add(CT.FC_OPG_IMPORTE_ORIGEN, val(cell.getValue()), Types.double);
                  break;

                case KI_COTIZACION:
                  cotiOrigen = val(cell.getValue());
                  break;

                case KI_COTIZACION2:
                  cotiOrdenPago = val(cell.getValue());
                  fields.add(CT.FC_OPG_COTIZACION, cotiOrdenPago, Types.double);
                  break;
              }
            }
          }

          if(mustSave) {

            // if there are differences between the rates and the
            // invoice rate is lower than the payment rate
            // we apply using the invoice rate
            //
            if(cotiOrigen < cotiOrdenPago) {
              pago = pago / cotiOrdenPago * cotiOrigen;
            }

            fields.add(CT.FC_OPG_IMPORTE, pago, Types.double);
            fields.add(CT.FC_OPG_ID, 0, Types.long);
            fields.add(CT.OPG_ID, 0, Types.long);

            transaction.addRegister(register);
          }

        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var newEmptyProperties = function() {

        getAnticipo().setValue(0);

        getFacturas().getRows().clear();
        getOtros().getRows().clear();
        getCheques().getRows().clear();
        getChequesT().getRows().clear();
        getEfectivo().getRows().clear();
        getCtaCte().getRows().clear();

        getPagoNeto().setValue(0);
        getPagoOtros().setValue(0);
        getPagoTotal().setValue(0);

        var comprobante = getComprobante();
        comprobante.setValue("");
        comprobante.setTextMask("");
        
        var centroCosto = getCentroCosto();
        centroCosto.setSelectId(NO_ID);
        centroCosto.setValue("");
        
        getDescrip().setValue("");

        m_objWizard.showValue(getFacturasProperty());
        m_objWizard.showValue(getOtrosProperty());
        m_objWizard.showValue(getChequesProperty());
        m_objWizard.showValue(getChequesTProperty());
        m_objWizard.showValue(getEfectivoProperty());
        m_objWizard.showValue(getCtaCteProperty());
        m_objWizard.showValue(getAnticipo());
        m_objWizard.showValue(getPagoNeto());
        m_objWizard.showValue(getPagoOtros());
        m_objWizard.showValue(getPagoTotal());
        m_objWizard.showValue(getComprobante());
        m_objWizard.showValue(getCentroCosto());
        m_objWizard.showValue(getDescrip());

      };

      var setDatosFromAplic = function() {
        // TODO: use the code of this function in TRANSLATED to create an scala implementation
        //
        return DB.getData("load[" + m_apiPath + "tesoreria/ordenpago/facturas?ids=" + getFcIds() + "]")
          .whenSuccessWithResult(function(response) {

            var facturas = DB.getResultSetFromData(response.data);

            for(var _i = 0, count = facturas.length; _i < count; _i++) {

              var property = getSucursal();
              if(property.getSelectId() === NO_ID && valField(facturas[_i], C.SUC_ID) !== NO_ID) {
                property.setSelectId(valField(facturas[_i], C.SUC_ID));
                property.setValue(valField(facturas[_i], C.SUC_NAME));
                m_objWizard.showValue(property);
              }
    
              property = getCentroCosto();
              if(property.getSelectId() === NO_ID && valField(facturas[_i], C.CCOS_ID) !== NO_ID) {
                property.setSelectId(valField(facturas[_i], C.CCOS_ID));
                property.setValue(valField(facturas[_i], C.CCOS_NAME));
                m_objWizard.showValue(property);
              }
    
              property = getLegajo();
              if(property.getSelectId() === NO_ID && valField(facturas[_i], C.LGJ_ID) !== NO_ID) {
                property.setSelectId(valField(facturas[_i], C.LGJ_ID));
                property.setValue(valField(facturas[_i], C.LGJ_TITLE));
                m_objWizard.showValue(property);
              }
            }
          
            return true;
          });
      };

      //--------------------------------------------------------------------

      var copyCheque = function() {

        if(getCheques().getRows().count()) {

          var count = 1;
          var message = getText(3840, ""); // Ingrese la cantidad de veces que desea copiar el cheque

          return M.inputFormView("", message, count).then(function(text) {

            count = val(text);
            if(count === 0) { return; }

            var meses = 1;
            var message = getText(3841, "") // Ingrese la cantidad de meses entre vencimientos

            M.inputFormView("", message, meses).then(function(text) {

              meses = val(text);
              if(meses === 0) { return; }

              var rows = getCheques().getRows();
              var row = rows.item(rows.count()-1);

              var numero = val(getCell(row, KICH_CHEQUE).getValue());
              var fechaCobro = getCell(row, KICH_FECHACOBRO).getValue();

              for(var _i = 0; _i <= count; _i++) {

                fechaCobro = Cairo.Dates.DateNames.addToDate("m", meses, fechaCobro);
                numero = numero + 1;

                var newRow = rows.add(null);

                for(var _j = 0; _j < row.count(); _j++) {

                  var cell = row.item(_j);
                  var newCell = newRow.add(null);

                  newCell.setFormat(cell.getFormat());
                  newCell.setId(cell.getId());
                  newCell.setKey(cell.getKey());

                  if(cell.getKey() === KICH_FECHACOBRO) {
                    newCell.setValue(fechaCobro);
                  }
                  else if(cell.getKey() === KICH_FECHAVTO) {
                    newCell.setValue(Cairo.Dates.DateNames.addToDate("m", 1, fechaCobro));
                  }
                  else if(cell.getKey() === KICH_CHEQUE) {
                    newCell.setValue(numero);
                  }
                  else {
                    newCell.setValue(cell.getValue());
                  }

                }
              }

              m_objWizard.getDialog().showValue(getChequesProperty(), true);

              showPagoNeto();
              showPagoTotal();
            });
          });
        }
        else {
          return M.showWarningWithFalse(getText(3841, "")); // Debe agregar al menos un cheque para poder copiarlo
        }
      };

      var setFilterColFactura = function() {

        var filter = D.getFacturaVentaFilter(getProveedor());
        D.getCol(getOtros().getColumns(), KIO_FC_ID_RET).setSelectFilter(filter);
        m_objWizard.getDialog().refreshColumnProperties(getOtrosProperty(), CT.FC_ID_RET);

      };

      var showMessages = function() {
        // TODO: implement this api
        return DB.getData(
            "load[" + m_apiPath + "tesoreria/ordenespago/proveedor/"
              + getProveedor().toString()
              + "/messages]"
          )
          .whenSuccessWithResult(function(response) {

            if(response.success === true) {
              var message = valField(response.data, CT.OPG_MESSAGES);
              if(message !== "") {
                return M.showInfo(message);
              }
              else {
                return true;
              }
            }

          });
      };

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      var getMonedaAnticipo = function() {
        return D.getWizProperty(m_objWizard, WCS.ANTICIPO, DWC.MONEDA_ANTICIPO);
      };

      var getCuentaAnticipo = function() {
        return D.getWizProperty(m_objWizard, WCS.ANTICIPO, DWC.CUENTA_ANTICIPO);
      };

      var getPagoIndicado = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_PAGOS, DWC.PAGO_INDICADO);
      };

      var getPagoNeto = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_PAGOS, DWC.PAGO_NETO);
      };

      var getPagoOtros = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_PAGOS, DWC.PAGO_OTROS);
      };

      var getPagoTotal = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_PAGOS, DWC.PAGO_TOTAL);
      };

      var getTotal = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.TOTAL_PAGO);
      };

      var getTotalOrigen = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.TOTAL_PAGO_ORIGEN);
      };

      var getProveedor2 = function() {
        return D.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.PROVEEDOR2);
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

      var getChequesT = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_PAGOS, DWC.CHEQUES_TERCERO).getGrid();
      };

      var getCheques = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_PAGOS, DWC.CHEQUES).getGrid();
      };

      var getChequesProperty = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_PAGOS, DWC.CHEQUES);
      };

      var getChequesTProperty = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_PAGOS, DWC.CHEQUES_TERCERO);
      };

      var getEfectivo = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_PAGOS, DWC.EFECTIVO).getGrid();
      };

      var getEfectivoProperty = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_PAGOS, DWC.EFECTIVO);
      };

      var getOtros = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_PAGOS, DWC.OTROS).getGrid();
      };

      var getOtrosProperty = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_PAGOS, DWC.OTROS);
      };

      var getFacturas = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.FACTUAS).getGrid();
      };

      var getCtaCte = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_PAGOS, DWC.CTA_CTE).getGrid();
      };

      var getFacturasProperty = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.FACTUAS);
      };

      var getCtaCteProperty = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_PAGOS, DWC.CTA_CTE);
      };

      var refreshFacturas = function() {
        m_objWizard.showValue(D.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.FACTUAS));
      };

      var refreshCtaCte = function() {
        m_objWizard.showValue(D.getWizProperty(m_objWizard, WCS.SELECT_PAGOS, DWC.CTA_CTE));
      };

      var refreshOtros = function() {
        m_objWizard.showValue(D.getWizProperty(m_objWizard, WCS.SELECT_PAGOS, DWC.OTROS));
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

      var getSucursal = function() {
        return D.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.SUCURSAL);
      };

      var getFecha = function() {
        return D.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.FECHA);
      };

      var getDoc = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_PROVEEDOR, DWC.DOC).getSelectId();
      };

      var getDocName = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_PROVEEDOR, DWC.DOC).getValue();
      };

      var getVencidos = function() {
        return val(D.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.VENCIDOS).getValue());
      };

      var getTodos = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.TODOS);
      };

      var getAgrupados = function() {
        return val(D.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.AGRUPADOS).getValue());
      };

      var getCotizacion = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.COTIZACION);
      };

      var getCotizacionAnticipo = function() {
        return D.getWizProperty(m_objWizard, WCS.ANTICIPO, DWC.COTIZACION_ANTICIPO);
      };

      var getAnticipo = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.ANTICIPO);
      };

      var getAnticipoImporte = function() {
        return D.getWizProperty(m_objWizard, WCS.ANTICIPO, DWC.ANTICIPO_IMPORTE);
      };

      initialize();

      return self;
    };

    Edit.Controller = { getEditor: createObject };

  });

}());