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
      var CT = Cairo.Tesoreria.Constants;
      var CV = Cairo.Ventas.Constants;
      var Types = Cairo.Constants.Types;
      var valField = DB.valField;
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

      var C_CUOTAS = "Cuotas";

      var LABEL_COBROS = "LabelCobros";

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
      var KIO_MON_ID = 13;

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

      var NC_ND_DESCRIP_DIF_CAMBIO = getText(2281, ""); // Generado automáticamente por diferencia de cambio

      var LABEL_COBROS_TEXT = getText(2146, ""); // Indique los instrumentos de cobro

      var m_objWizard;
      var m_wizardProcessing;
      var m_wizardCancel;

      var m_bDifCambio;

      var m_id = 0;

      var m_orden = 0;

      var m_cliId = 0;
      var m_cliente = "";

      var m_cliIdDoc = 0;
      var m_clienteDoc = "";

      var m_fvIds = 0;

      var m_cliIds = 0;
      var m_fvIdsxCliId = 0;
      var m_cobranzaInfo = null;
      var m_isHojaRuta = false;
      var m_cjId = 0;

      var m_lColCuotas = 0;

      var m_objClient = null;

      var m_lastCliId = 0;
      var m_lastDocId = 0;

      var m_lastNroDoc = "";

      var m_nextCliIdIndex = 0;
      var m_useCliIds;

      var m_autoSelect;
      var m_wizWasClosed;

      var m_bVirtualNextStopInPagos;
      var m_restarVirtualPush;

      var m_defaultCurrency = D.getDefaultCurrency();

      var m_apiPath = DB.getAPIVersion();

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
        m_cobranzaInfo = value ? value : null;
      };

      self.setIsHojaRuta = function(value) {
        // only check for true because if the caller uses false
        // the value is taken from tesoreria general config
        //
        if(value) {
          m_isHojaRuta = value;
        }
      };

      self.loadWizard = function() {
        var p = null;

        try {
          if(m_isHojaRuta) {
            p = loadCajaForCurrentUser();
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "loadWizard", C_MODULE, "");
          p = P.resolvedPromise(false);
        }

        return p || P.resolvedPromise(true);
      };

      self.messageEx = function(messageId, info) {
        var p = null;

        switch (messageId) {

          case Dialogs.Message.MSG_GRID_ROW_DELETED:

            switch (info) {
              case WC.KW_CHEQUES:
              case WC.KW_EFECTIVO:
              case WC.KW_TARJETAS:
                showCobroNeto();
                break;

              case WC.KW_OTROS:
                showCobroOtro();
                break;
            }
            showCobroTotal();
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

            case WC.KW_TARJETAS:
              isEmpty = isEmptyRowTarjetas(row, rowIndex);
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
          Cairo.manageErrorEx(ex.message, ex, "isEmptyRow", C_MODULE, "");
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

            case WC.KW_TARJETAS:
              p = columnAfterUpdateTarjeta(getTarjetasProperty(), lRow, lCol);
              break;

            case WC.KW_OTROS:
              columnAfterUpdateOtro(getOtrosProperty(), lRow, lCol);
              break;

            case WC.KW_EFECTIVO:
              p = columnAfterUpdateEfectivo(getEfectivoProperty(), lRow, lCol);
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnAfterUpdate", C_MODULE, "");
        }

        return p || P.resolvedPromise(true);
      };

      self.columnAfterEdit = function(key, lRow, lCol, newValue, newValueId) {
        var p = null;
        var grid = property.getGrid();
        var columnKey = grid.getColumns().item(lCol).getKey();

        switch (columnKey) {

          case KIO_CUE_ID:
            var cueId = newValueId;

            if(cueId !== NO_ID) {

              p = D.getCurrencyFromAccount(cueId).whenSuccessWithResult(function(info) {
                var row = grid.getRows().item(lRow);
                getCell(row, KIO_MON_ID).setId(info.monId);
                return true;
              });
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

            case WC.KW_CHEQUES:
              rtn = true;
              break;

            case WC.KW_TARJETAS:
              rtn = columnBeforeEditTarjeta(getTarjetasProperty(), lRow, lCol, iKeyAscii);
              break;

            case WC.KW_OTROS:
              rtn = true;
              break;

            case WC.KW_EFECTIVO:
              rtn = true;
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "columnBeforeEdit", C_MODULE, "");
        }

        return P.resolvedPromise(rtn);
      };

      var columnBeforeEditTarjeta = function(property, lRow, lCol, iKeyAscii) {

        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).getKey()) {

          case KIT_TJCCU_ID:
            D.setSelectFilterCuotas(grid.getRows().item(lRow), property, m_objWizard.getDialog(), KIT_TJC_ID);
            break;
        }
        return true;
      };

      self.columnButtonClick = function(key, lRow, lCol, iKeyAscii) {

      };

      self.columnClick = function(key, lRow, lCol) {

      };

      self.gridDblClick = function(key, lRow, lCol) {
        try {

          switch (key) {

            case WC.KW_FACTURAS:

              D.showDocAux(getCell(getFacturas().getRows().item(lRow), KI_FV_ID).getId(), "FacturaVenta");
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "gridDblClick", C_MODULE, "");
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

      self.newRow = function(key, rows) {
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

            case WC.KW_TARJETAS:
              p = validateRowTarjetas(row, rowIndex);
              break;

            case WC.KW_OTROS:
              p = validateRowOtros(row, rowIndex);
              break;

            case WC.KW_EFECTIVO:
              p = validateRowEfectivo(row, rowIndex);
              break;

            case WC.KW_CTA_CTE:
              p = P.resolvedPromise(true);
              break;
          }

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "validateRow", C_MODULE, "");
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
            row = grid.getRows().item(lRow);
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
            showCobroNeto();
            showCobroTotal();
            break;

          case KICH_IMPORTE:

            showCobroNeto();
            showCobroTotal();
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
                      - val(getCobroTotal().getValue())
                  );
                  showCobroNeto();
                  showCobroTotal();
                }
                return true;
              }
            );
            break;

          case KICH_FECHACOBRO:

            var row = grid.getRows().item(lRow);
            var cell = getCell(row, KICH_FECHACOBRO);

            if(Cairo.Util.isDate(cell.getValue())) {
              getCell(row, KICH_FECHAVTO).setValue(Cairo.Dates.DateNames.addToDate("m", 1, cell.getValue()));
            }
            break;
        }

        return p || P.resolvedPromise(true);
      };

      var columnAfterUpdateTarjeta = function(property, lRow, lCol) {
        var p = null;
        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).getKey()) {

          case KIT_IMPORTEORIGEN:

            var row = grid.getRows().item(lRow);
            getCell(row, KIT_IMPORTE).setValue(
              val(getCell(row, KIT_IMPORTEORIGEN).getValue())
                * val(getCotizacion().getValue())
            );

            showCobroNeto();
            showCobroTotal();
            break;

          case KIT_IMPORTE:

            showCobroNeto();
            showCobroTotal();
            break;

          case KIT_TJC_ID:

            var row = grid.getRows().item(lRow);
            var cell = getCell(row, KIT_TJCCU_ID);
            var tjcId = getCell(row, KIT_TJC_ID).getId();

            D.setSelectFilterCuotas(row, property, m_objWizard.getDialog(), KIT_TJC_ID);

            p = D.validateCuota(tjcId, cell.getId())
              .whenSuccessWithResult(function(response) {
                if(!response.is_valid) {

                  cell.setId(NO_ID);
                  cell.setValue("");
                  m_objWizard.getDialog().showCellValue(property, lRow, m_lColCuotas);

                  if(val(getCell(row, KIT_IMPORTE).getValue()) === 0) {

                    getCell(row, KIT_IMPORTE).setValue(
                      val(getTotal().getValue())
                        - val(getCobroTotal().getValue())
                    );

                    showCobroNeto();
                    showCobroTotal();
                  }

                  return true;
                }
              }
            );
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

            showCobroNeto();
            showCobroTotal();
            break;

          case KIE_IMPORTE:

            showCobroNeto();
            showCobroTotal();
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
                      - val(getCobroTotal().getValue())
                  );
                  showCobroNeto();
                  showCobroTotal();
                }
                return true;
              }
            );
            break;
        }

        return p || P.resolvedPromise(true);
      };

      var columnAfterUpdateOtro = function(property, lRow, lCol) {

        var grid = property.getGrid();

        switch (grid.getColumns().item(lCol).getKey()) {

          case KIO_DEBE:
            var row = grid.getRows().item(lRow);
            getCell(row, KIO_IMPORTEORIGEN).setValue(val(getCell(row, KIO_DEBE).getValue()));
            getCell(row, KIO_HABER).setValue(0);
            showCobroOtro();
            showCobroTotal();
            break;

          case KIO_HABER:
            var row = grid.getRows().item(lRow);
            getCell(row, KIO_IMPORTEORIGEN).setValue(val(getCell(row, KIO_HABER).getValue()));
            getCell(row, KIO_DEBE).setValue(0);
            showCobroOtro();
            showCobroTotal();
            break;
        }

        return true;
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

      var refreshCotizacion = function(takeFromCotizCtrl) {
        var cotiz = getCotizacion().getValue();
        var facturas = getFacturas();

        for(var _i = 0, _count = facturas.getRows().size(); _i < _count; _i++) {

          var row = facturas.getRows().item(_i);

          if(val(getCell(row, KI_IMPORTEORIGEN).getValue())) {

            if(takeFromCotizCtrl) {
              getCell(row, KI_COTIZACION2).setValue(cotiz);
            }
            else {
              cotiz = val(getCell(row, KI_COTIZACION2).getValue());
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

      var showCobroNeto = function() {
        var total = 0;

        for(var _i = 0, _count = getCheques().getRows().size(); _i < _count; _i++) {
          var row = getCheques().getRows().item(_i);
          total = total + val(getCell(row, KICH_IMPORTE).getValue());
        }

        for(var _i = 0, _count = getEfectivo().getRows().size(); _i < _count; _i++) {
          var row = getEfectivo().getRows().item(_i);
          total = total + val(getCell(row, KIE_IMPORTE).getValue());
        }

        for(var _i = 0, _count = getTarjetas().getRows().size(); _i < _count; _i++) {
          var row = getTarjetas().getRows().item(_i);
          total = total + val(getCell(row, KIE_IMPORTE).getValue());
        }

        getCobroNeto().setValue(total);
        m_objWizard.showValue(getCobroNeto());
      };

      var showCobroOtro = function() {
        var total = 0;

        for(var _i = 0, _count = getOtros().getRows().size(); _i < _count; _i++) {
          var row = getOtros().getRows().item(_i);
          total = total + val(getCell(row, KIO_DEBE).getValue()) - val(getCell(row, KIO_HABER).getValue());
        }

        getCobroOtros().setValue(total);
        m_objWizard.showValue(getCobroOtros());
      };

      var showCobroTotal = function() {
        getCobroTotal().setValue(val(getCobroNeto().getValue()) + val(getCobroOtros().getValue()));
        m_objWizard.showValue(getCobroTotal());
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
        var total = 0;
        var totalOrigen = 0;

        for(var _i = 0, _count = getFacturas().getRows().size(); _i < _count; _i++) {
          var row = getFacturas().getRows().item(_i);
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

      var getDeudaOrigen = function() {
        var total = 0;
        var decimalesCotiz = Cairo.Settings.getCurrencyRateDecimals();

        for(var _i = 0, _count = getFacturas().getRows().size(); _i < _count; _i++) {
          var row = getFacturas().getRows().item(_i);
          total = total
            + Cairo.Util.zeroDiv(
            val(getCell(row, KI_APLICAR).getValue()),
            round(val(getCell(row, KI_COTIZACION2).getValue()), decimalesCotiz)
          ) * val(getCell(row, KI_COTIZACION).getValue());
        }

        return total;
      };

      var getCobrado = function() {
        var total = null;

        for(var _i = 0, _count = getFacturas().getRows().size(); _i < _count; _i++) {
          var row = getFacturas().getRows().item(_i);

          if(val(getCell(row, KI_COTIZACION).getValue())) {
            total = total + val(getCell(row, KI_APLICAR).getValue());
          }
        }

        return total;
      };

      self.load = function() {
        try {
          m_objWizard.getDialog().setHideTitle(true);

          // autorun
          //
          m_autoSelect = m_objWizard.getPushVirtualNext();

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

            case WCS.SELECT_COBROS:

              if(goingToNext) {
                p = getCuentasDeudor()
                  .whenSuccess(function() {
                    setFilterColFactura();
                    refreshLabelPagos();
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

              nextStep = WCS.SELECT_CLIENTE;
              m_objWizard.setNextText(Cairo.Constants.NEXT_TEXT);
              m_objWizard.disableBack();

              // every time we get here this flag is turned on
              // to stop in payments without showing a message
              //
              m_bVirtualNextStopInPagos = true;
              m_restarVirtualPush = false;
              break;

            case WCS.SELECT_CLIENTE:

              if(getDoc() === NO_ID) {
                nextStep = WCS.SELECT_CLIENTE;
                p = M.showWarningWithFalse(getText(1562, ""), getText(2128, "")); // Debe indicar un documento, Cobranzas
              }
              else if(getCliente() === NO_ID) {
                nextStep = WCS.SELECT_CLIENTE;
                p = M.showWarningWithFalse(getText(1563, ""), getText(2128, "")); // Debe indicar un cliente, Cobranzas
              }
              else {
                p = loadFacturasXCliente()
                  .whenSuccess(
                  function() {
                    getTodos().setName(Cairo.Constants.SELECT_ALL_TEXT);
                    m_objWizard.showValue(getTodos());
                    m_objWizard.enableBack();
                    nextStep = WCS.SELECT_FACTURA;
                    return true;
                  },
                  function() {
                    nextStep = WCS.SELECT_CLIENTE;
                    return M.showWarningWithFalse(getText(2129, ""), getText(2128, "")); // No se pudieron cargar las facturas para este cliente, Cobranzas
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

              if(m_bDifCambio) {
                nextStep = WCS.DIF_CAMBIO;
              }
              else {

                p = loadVirtualNextCobros()
                  .whenSuccess(
                  function() {
                    nextStep = WCS.SELECT_COBROS;
                    return true;
                  },
                  function() {
                    nextStep = WCS.ANTICIPO;
                    return false;
                  }
                );
              }
              break;

            case WCS.DIF_CAMBIO:

              p = loadVirtualNextCobros()
                .whenSuccess(
                function() {
                  nextStep = WCS.SELECT_COBROS;
                  return true;
                },
                function() {
                  nextStep = WCS.DIF_CAMBIO;
                  return false;
                }
              );
              break;

            case WCS.SELECT_COBROS:

              p = validateCobro()
                .whenSuccess(
                  function() {
                    m_objWizard.enableBack();
                    m_objWizard.setNextText(Cairo.Constants.FINISH_TEXT);

                    nextStep = WCS.DATOS_GENERALES;

                    if(m_autoSelect && m_restarVirtualPush) {
                      m_objWizard.setRestartVirtualPush(true);
                    }
                    return true;
                  },
                  function() {
                    nextStep = WCS.SELECT_COBROS;
                    return false;
                  }
                );
              break;

            case WCS.DATOS_GENERALES:

              p = validateDatosGenerales().whenSuccess(
                function() {

                  return save().whenSuccess(
                    function() {
                      if(m_autoSelect) {
                        self.propertyChange(WC.KW_NEW_DOC);
                        nextStep = WCS.WELCOME;
                      }
                      else {
                        D.wizShowNewStep(m_objWizard, WCS.WELCOME, m_lastNroDoc);
                        nextStep = WCS.WELCOME;
                      }
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

          case WCS.SELECT_CLIENTE:
            nextStep = WCS.SELECT_CLIENTE;
            break;

          case WCS.SELECT_FACTURA:
            m_objWizard.disableBack();
            nextStep = WCS.SELECT_CLIENTE;
            break;

          case WCS.ANTICIPO:
            nextStep = WCS.SELECT_FACTURA;
            break;

          case WCS.DIF_CAMBIO:
            nextStep = WCS.ANTICIPO;
            break;

          case WCS.SELECT_COBROS:
            if(m_bDifCambio) {
              nextStep = WCS.DIF_CAMBIO;
            }
            else {
              nextStep = WCS.ANTICIPO;
            }
            break;

          case WCS.DATOS_GENERALES:
            m_objWizard.setNextText(Cairo.Constants.NEXT_TEXT);
            nextStep = WCS.SELECT_COBROS;
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

            D.wizPrintDocEx(m_id, m_lastDocId, D.getEmailFromCliente(m_lastCliId));
            break;

          case WC.KW_NEW_DOC:

            setMultyCliente();

            // if the wizard was closed there is nothing to do
            //
            if(!m_wizWasClosed) {
              newEmptyProperties();
              D.wizNewDoc(m_objWizard, WCS.WELCOME);
            }
            break;

          case WC.KW_VENCIDOS:
          case WC.KW_AGRUPADOS:

            p = loadFacturasXCliente();
            break;

          case WC.KW_COTIZACION:

            refreshCotizacion(true);
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

          case WC.KW_DOC_ID:

            m_lastDocId = getDoc();
            break;
        }

        return p || P.resolvedPromise();
      };

      self.terminate = function() {
        try {
          m_objClient.setWizardCompleteSuccess(m_id !== NO_ID);
          m_objClient.terminateWizard(m_autoSelect ? NO_ID : m_id);
        }
        catch(ignore) {
          Cairo.logError('Error in terminate', ignore);
        }
      };

      self.getPath = function() {
        return "#tesoreria/cobranza/sobrefactura";
      };

      self.getEditorName = function() {
        var id = "N" + (new Date).getTime().toString();
        return "cobranza/sobrefactura/" + id;
      };

      self.getTitle = function() {
        return "Asistente de Cobranzas"; //TODO: use getText(???, ""); // Asistente de Cobranzas
      };

      var loadSteps = function() {

        m_lastCliId = m_cliId;
        m_lastDocId = Cairo.getTesoreriaConfig().getDocIdCobranza();

        setMultyDoc();

        loadStepWelcome();
        loadStepSelectCliente();
        loadStepFactura();
        loadStepAnticipo();
        loadStepDifCambio();
        loadStepCobros();
        loadStepDatosGenerales();

        return P.resolvedPromise(true);
      };

      var setMultyDoc = function() {
        if(m_cliIds.length > 0) {

          m_nextCliIdIndex = 1;
          m_useCliIds = true;
        }
        else {
          m_nextCliIdIndex = 0;
        }
      };

      var setMultyCliente = function() {
        var p = null;

        if(m_nextCliIdIndex) {

          m_cliIdDoc = m_cliIds[m_nextCliIdIndex];

          p = D.getClienteName(m_cliIdDoc).then(function(response) {
            try {
              if(response.success === true) {
                m_clienteDoc = valField(response.data, C.CLI_NAME);

                m_nextCliIdIndex = m_nextCliIdIndex + 1;

                if(m_nextCliIdIndex > m_cliIds.length) {
                  m_nextCliIdIndex = 0;
                }
                return true;
              }
              else {
                return false;
              }
            }
            catch(ex) {
              Cairo.manageErrorEx(ex.message, ex, "setMultyCliente", C_MODULE, "");
            }
          });
        }
        else {

          if(m_autoSelect) {

            if(m_objWizard.getCloseWizardAfterSave()) {
              m_objWizard.closeWizard();
              m_wizWasClosed = true;
            }
          }

          if(!m_wizWasClosed) {

            m_useCliIds = false;
            m_clienteDoc = m_cliente;
            m_cliIdDoc = m_cliId;
          }
        }

        return p || P.resolvedPromise(false);
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
        elem.setValue(getText(2130, "")); // Bienvenido al Asistente de Cobranza

        elem = properties.add(null, DWC.MAIN_TITLE);
        elem.setType(T.label);
        elem.setSubType(ST.subTitle);
        elem.setValue(getText(2131, "")); // Con este Asistente usted podra generar los Recibos por Cobranzas.

        D.wizAddNewDocProperties(m_objWizard, WCS.WELCOME);

      };

      var loadStepSelectCliente = function() {

        // the step's key must be the constant that defines them
        // this is crucial for the navigation to work
        //
        var step = m_objWizard.getSteps().add(null, U.getKey(WCS.SELECT_CLIENTE));

        step.getProperties().setLayout(Dialogs.Layout.verticalOneColumn);

        var properties = step.getProperties();

        var elem = properties.add(null);

        elem.setType(T.label);
        elem.setSubType(ST.title);
        elem.setValue(getText(2132, "")); // Indique el documento a utilizar y el Cliente al que se le emitirá el Recibo

        elem = properties.add(null, DWC.DOC);
        elem.setName(getText(1567, "")); // Documento
        elem.setType(T.select);
        elem.setSelectFilter(Cairo.Documents.COBRANZA_DOC_FILTER);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setValue(Cairo.getTesoreriaConfig().getDocCobranza());
        elem.setSelectId(Cairo.getTesoreriaConfig().getDocIdCobranza());
        elem.setKey(WC.KW_DOC_ID);

        setMultyCliente();

        elem = properties.add(null, DWC.CLIENTE);
        elem.setName(getText(1150, "")); // Cliente
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CLIENTE);
        elem.setValue(m_clienteDoc);
        elem.setSelectId(m_cliIdDoc);

        elem = properties.add(null, DWC.ONLY_SELECTED);
        elem.setType(T.check);
        elem.setName(getText(2133, "")); // Cargar sólo Facturas seleccionadas
        elem.setValue(m_fvIds.length);
      };

      var loadStepFactura = function() {

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
        elem.setKey(KI_FVD_ID);

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
        elem.setKey(KI_FV_ID);

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
        elem.setSelectFilter(D.selectFilterForCuentaAnticipoCobranza);
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

        if(Cairo.getTesoreriaConfig().getCueIdAntCobz() !== NO_ID) {
          showMonedaAnticipo(false);
        }

      };

      var loadStepDifCambio = function() {

        // the step's key must be the constant that defines them
        // this is crucial for the navigation to work
        //
        var step = m_objWizard.getSteps().add(null, U.getKey(WCS.DIF_CAMBIO));

        step.getProperties().setLayout(Dialogs.Layout.verticalTwoColumn);

        var properties = step.getProperties();

        var elem = properties.add(null);
        elem.setType(T.label);
        elem.setSubType(ST.title);
        elem.setValue(getText(2141, "")); // Indique como tratar las diferencias de cambio

        elem = properties.add(null, DWC.DEFAULT_DIF_CAMBIO);
        elem.setType(T.list);
        elem.setName(getText(2286, "")); // Utilizar
        elem.setKey(WC.KW_DEFALUT_DIF_CAMBIO);
        elem.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
        elem.setListItemData(Cairo.getTesoreriaConfig().getDefaultDifCambio());

        var list = elem.getList();

        elem = list.add(null);
        elem.setId(CT.ModoDifCambio.DIF_CAMBIO_CUENTA);
        elem.setValue(getText(2142, "")); // Una cuenta contable

        elem = list.add(null);
        elem.setId(CT.ModoDifCambio.DIF_CAMBIO_NC_ND);
        elem.setValue(getText(2143, "")); // Una Nota de Débito o Crédito

        elem = properties.add(null, DWC.CUE_ID_DIF_CAMBIO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setName(getText(2288, "")); // Cuenta contable
        elem.setKey(WC.KW_CUE_ID_DIF_CAMBIO);
        elem.setSelectId(Cairo.getTesoreriaConfig().getCueIdDifCambio());
        elem.setValue(Cairo.getTesoreriaConfig().getCuentaDifCambio());

        elem = properties.add(null, DWC.NC_DIF_CAMBIO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(getText(2289, "")); // Nota de Crédito
        elem.setKey(WC.KW_DOC_ID_NC_DIF_CAMBIO);
        elem.setSelectId(Cairo.getTesoreriaConfig().getDocIdNCDifCambio());
        elem.setSelectFilter(D.NOTA_CREDITO_VENTAS_DOC_FILTER);
        elem.setValue(Cairo.getTesoreriaConfig().getDocNCDifCambio());

        elem = properties.add(null, DWC.ND_DIF_CAMBIO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(getText(2230, "")); // Nota de Débito
        elem.setKey(WC.KW_DOC_ID_ND_DIF_CAMBIO);
        elem.setSelectId(Cairo.getTesoreriaConfig().getDocIdNDDifCambio());
        elem.setSelectFilter(D.NOTA_DEBITO_VENTAS_DOC_FILTER);
        elem.setValue(Cairo.getTesoreriaConfig().getDocNDDifCambio());

        elem = properties.add(null, DWC.PR_ID_DIF_CAMBIO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PRODUCTOS_DE_VENTA);
        elem.setName(getText(1367, "")); // Artículo
        elem.setKey(WC.KW_PR_ID_DIF_CAMBIO);
        elem.setSelectId(Cairo.getTesoreriaConfig().getPrIdDifCambio());
        elem.setValue(Cairo.getTesoreriaConfig().getProductoDifCambio());

        elem = properties.add(null, DWC.MODO_IVA_DIF_CAMBIO);
        elem.setType(T.list);
        elem.setName(getText(2290, "")); // Tratamiento del IVA
        elem.setKey(WC.KW_MODO_IVA_DIF_CAMBIO);
        elem.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
        elem.setListItemData(Cairo.getTesoreriaConfig().getModoIvaDifCambio());

        var list = elem.getList();

        elem = list.add(null);
        elem.setId(CT.ModoIvaDifCambio.DIF_IVA_IMPONIBLE);
        elem.setValue(getText(2144, "")); // Tomar la diferencia de cambio como base imponible para el IVA

        elem = list.add(null);
        elem.setId(CT.ModoIvaDifCambio.DIF_IVA_NO_IMPONIBLE);
        elem.setValue(getText(2145, "")); // IVA incluido en la diferencia de cambio

        elem = properties.add(null, DWC.FECHA_ND_NC);
        elem.setType(T.date);
        elem.setName(getText(1569, "")); // Fecha
        elem.setKey(WC.KW_FECHA_NDNC);
        elem.setValue(Cairo.Dates.today());

        elem = properties.add(null, DWC.APLICACION_ND);
        elem.setType(T.list);
        elem.setName(getText(2479, "")); // Aplicación
        elem.setKey(WC.KW_APLICACION_DIF_CAMBIO);
        elem.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
        elem.setListItemData(Cairo.getTesoreriaConfig().getAplicacionDifCambio());

        var list = elem.getList();

        elem = list.add(null);
        elem.setId(CT.AplicacionDifCambio.DIF_APLICACION_ND);
        elem.setValue(getText(2480, "")); // Cobrar la Nota de Débito y aplicar el resto a las Facturas

        elem = list.add(null);
        elem.setId(CT.AplicacionDifCambio.DIF_APLICACION_FV);
        elem.setValue(getText(2481, "")); // Cobrar las Facturas y aplicar el resto a la Note de Débito

      };

      var loadStepCobros = function() {

        // the step's key must be the constant that defines them
        // this is crucial for the navigation to work
        //
        var keyCobros = U.getKey(WCS.SELECT_COBROS);

        var properties = m_objWizard.getSteps().add(null, keyCobros).getProperties();

        var elem;

        elem = properties.add(null, LABEL_COBROS);

        elem.setType(T.label);
        elem.setSubType(ST.title);
        elem.setValue(LABEL_COBROS_TEXT);

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
        tab.setName(getText(2101, "")); // Tarjetas
        tab.setIndex(-3);

        tab = dialog.getTabs().add(null);
        tab.setFatherTab(keyCobros);
        tab.setName(getText(1070, "")); // Otros
        tab.setIndex(-4);

        tab = dialog.getTabs().add(null);
        tab.setFatherTab(keyCobros);
        tab.setName(getText(2102, "")); // Cta Corriente
        tab.setIndex(-5);

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

        elem = properties.add(null, DWC.TARJETAS);

        elem.setType(T.grid);
        setGridTarjetas(elem.getGrid());
        elem.setKey(WC.KW_TARJETAS);
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

        elem = properties.add(null, DWC.COBRO_INDICADO);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setName(getText(2147, "")); // A cobrar
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setEnabled(false);
        elem.setKey(WC.KW_IMPORTE_INDICADO);

        elem = properties.add(null, DWC.COBRO_NETO);
        elem.setName(getText(1581, "")); // Neto
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setEnabled(false);
        elem.setKey(WC.KW_IMPORTE_NETO);

        elem = properties.add(null, DWC.COBRO_OTROS);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setName(getText(1070, "")); // Otros
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setEnabled(false);
        elem.setKey(WC.KW_IMPORTE_OTROS);

        elem = properties.add(null, DWC.COBRO_TOTAL);
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
        elem.setSelectFilter(D.getCuentaOtroFilterForCaja(m_isHojaRuta, m_cjId));

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

        elem = columns.add(null, CT.FV_ID_RET);
        elem.setName(getText(1866, "")); // Factura
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.FACTURAS_DE_VENTA);
        elem.setKey(KIO_FV_ID_RET);
      };

      var setGridCheques = function(grid) {

        var columns = grid.getColumns();
        columns.clear();

        columns.add(null).setVisible(false);

        var elem;

        elem = columns.add(null);
        elem.setName(getText(1267, "")); // Cuenta
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setSelectFilter(D.getCuentaChequeFilterForCaja(m_isHojaRuta, m_cjId));
        elem.setKey(KICH_CUE_ID);

        elem = columns.add(null);
        elem.setName(getText(2063, "")); // Mon
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setKey(KICH_MON_ID);
        elem.setEnabled(false);

        elem = columns.add(null);
        elem.setName(getText(1901, "")); // Origen
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KICH_IMPORTEORIGEN);

        elem = columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KICH_IMPORTE);

        elem = columns.add(null);
        elem.setName(getText(1122, "")); // Banco
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.BANCO);
        elem.setKey(KICH_BCO_ID);

        elem = columns.add(null);
        elem.setName(getText(2059, "")); // Nro. Cheque
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KICH_CHEQUE);

        elem = columns.add(null);
        elem.setName(getText(3719, "")); // Propio
        elem.setType(Dialogs.PropertyType.check);
        elem.setKey(KICH_PROPIO);

        elem = columns.add(null);
        elem.setName(getText(2065, "")); // Depositar el
        elem.setDefaultValue(Grids.createCell());
        elem.getDefaultValue().setValue(Cairo.Dates.today());
        elem.setType(Dialogs.PropertyType.date);
        elem.setKey(KICH_FECHACOBRO);

        elem = columns.add(null);
        elem.setName(getText(1634, "")); // Vto.
        elem.setDefaultValue(Grids.createCell());
        elem.getDefaultValue().setValue(Cairo.Dates.DateNames.addToDate("m", 1, Cairo.Dates.today()));
        elem.setType(Dialogs.PropertyType.date);
        elem.setKey(KICH_FECHAVTO);

        elem = columns.add(null);
        elem.setName(getText(1083, "")); // Clering
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CLEARING);
        elem.setKey(KICH_CLE_ID);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
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
        elem.setSelectFilter(D.getCuentaEfectivoFilterForCaja(m_isHojaRuta, m_cjId));
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

      var setGridTarjetas = function(grid) {

        var columns = grid.getColumns();
        columns.clear();

        columns.add(null).setVisible(false);

        var elem;

        elem = columns.add(null);
        elem.setName(getText(2105, "")); // Cupon
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIT_CUPON);

        elem = columns.add(null);
        elem.setName(getText(2106, "")); // Tarjeta
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectFilter(D.selectFilterForTarjeta);
        elem.setSelectTable(Cairo.Tables.TARJETACREDITO);
        elem.setKey(KIT_TJC_ID);

        elem = columns.add(null, C_CUOTAS);
        elem.setName(getText(1473, "")); // Cuotas
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TARJETACREDITOCUOTA);
        elem.setKey(KIT_TJCCU_ID);
        m_lColCuotas = columns.count();

        elem = columns.add(null);
        elem.setName(getText(2063, "")); // Mon
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setKey(KIT_MON_ID);

        elem = columns.add(null);
        elem.setName(getText(1901, "")); // Origen
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIT_IMPORTEORIGEN);

        elem = columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIT_IMPORTE);

        elem = columns.add(null);
        elem.setName(getText(1634, "")); // Vto.
        elem.setType(Dialogs.PropertyType.date);
        elem.setDefaultValue(Grids.createCell());
        elem.getDefaultValue().setValue(Cairo.Dates.DateNames.addToDate("d", 1, Cairo.Dates.today()));
        elem.setKey(KIT_FECHAVTO);

        elem = columns.add(null);
        elem.setName(getText(2107, "")); // Nro. Tarjeta
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIT_NROTARJETA);

        elem = columns.add(null);
        elem.setName(getText(2123, "")); // Cod. Autoriz.
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIT_NROAUTORIZACION);

        elem = columns.add(null);
        elem.setName(getText(2108, "")); // Operacion
        elem.setType(Dialogs.PropertyType.list);
        elem.setDefaultValue(Grids.createCell());
        elem.getDefaultValue().setId(CT.CuponTipo.CUPON_POSNET);
        elem.setKey(KIT_TARJETA_TIPO);

        var list = elem.getList();

        elem = list.add(null);
        elem.setId(CT.CuponTipo.CUPON_POSNET);
        elem.setValue(getText(2110, "")); // Posnet

        elem = list.add(null);
        elem.setId(CT.CuponTipo.CUPON_MANUAL);
        elem.setValue(getText(2111, "")); // Manual

        elem = columns.add(null);
        elem.setName(getText(2109, "")); // Titular
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIT_TITULAR);

        elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIT_DESCRIP);
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

        elem = properties.add(null, DWC.CLIENTE2);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CLIENTE);
        elem.setEnabled(false);
        elem.setName(getText(1150, "")); // Cliente
        elem.setKey(WC.KW_CLIENTE2);

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

        elem = properties.add(null, DWC.COBRADOR);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.COBRADOR);
        elem.setName(getText(1088, "")); // Cobrador
        elem.setKey(WC.KW_COBRADOR);

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
          return M.showWarningWithFail(getText(2149, "")); // Debe indicar una o más Facturas, un importe como anticipo, o ambas cosas.
        }
        else {
          return P.resolvedPromise(true);
        }
      };

      var loadFacturasXCliente = function() {

        var onlySelected = getOnlySelected().getValue();

        return DB.getData(
            "load[" + m_apiPath + "tesoreria/cobranzas/cliente/"
              + getCliente().toString()
              + "/facturas]"
          )
          .then(function(response) {
            try {

              if(response.success === true) {

                m_bDifCambio = false;

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

                for(var _i = 0; _i < items.length; _i += 1) {

                  var fvId = valField(items[_i], CV.FV_ID);
                  var selected = getApply(fvId);

                  if(!onlySelected || selected) {

                    var row = rows.add(null);

                    row.add(null);

                    var elem = row.add(null);
                    elem.setId(valField(items[_i], CT.FVD_ID));
                    elem.setKey(KI_FVD_ID);

                    elem = row.add(null);
                    elem.setId(parseInt(selected));
                    elem.setKey(KI_SELECT);

                    elem = row.add(null);
                    elem.setValue(valField(items[_i], C.DOC_NAME));
                    elem.setKey(KI_DOC);

                    elem = row.add(null);
                    elem.setValue(valField(items[_i], CV.FV_NRODOC));
                    elem.setKey(KI_NRODOC);

                    elem = row.add(null);
                    elem.setValue(valField(items[_i], CV.FV_NUMERO));
                    elem.setId(valField(items[_i], CV.FV_ID));
                    elem.setKey(KI_FV_ID);

                    elem = row.add(null);
                    elem.setValue(valField(items[_i], CV.FV_FECHA));
                    elem.setKey(KI_FECHA);

                    elem = row.add(null);
                    elem.setValue(valField(items[_i], CV.FV_PENDIENTE));
                    elem.setKey(KI_PENDIENTE);

                    elem = row.add(null);
                    elem.setValue(valField(items[_i], CT.FVD_PENDIENTE));
                    elem.setKey(KI_IMPORTE);

                    elem = row.add(null);
                    if(selected) {
                      elem.setValue(getApplyImporte(fvId, valField(items[_i], CT.FVD_PENDIENTE)));
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
                    var origen = valField(items[_i], CV.FV_TOTAL_ORIGEN);
                    elem.setValue(origen ? origen : "");
                    elem.setKey(KI_IMPORTEORIGEN);
                    if(val(elem.getValue()) !== 0) { showCotizacion = true; }

                    elem = row.add(null);
                    var cotiz = valField(items[_i], CV.FV_COTIZACION);
                    elem.setValue(cotiz ? cotiz : "");
                    elem.setKey(KI_COTIZACION);

                    elem = row.add(null);
                    elem.setValue(valField(items[_i], CV.FV_TOTAL));
                    elem.setKey(KI_TOTAL);

                    elem = row.add(null);
                    elem.setValue(0);
                    elem.setKey(KI_COTIZACION2);

                    elem = row.add(null);
                    elem.setValue(valField(items[_i], CT.FVD_FECHA));
                    elem.setKey(KI_VTO);

                    elem = row.add(null);
                    elem.setValue(valField(items[_i], CV.FV_DESCRIP));
                    elem.setKey(KI_DESCRIP);
                  }
                }

                if(!showCotizacion) {
                  getFacturas().getColumns().item(DWC.COTIZACION).setVisible(false);
                  getFacturas().getColumns().item(DWC.MONEDA).setVisible(false);
                  getCotizacion().setVisible(false);
                  getTotalOrigen().setVisible(false);
                  m_bDifCambio = false;
                }
                else {
                  getFacturas().getColumns().item(DWC.COTIZACION).setVisible(true);
                  getFacturas().getColumns().item(DWC.MONEDA).setVisible(true);
                  getCotizacion().setVisible(true);
                  getTotalOrigen().setVisible(true);
                  m_bDifCambio = true;
                }

                if(rates.length > 0) {

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

      var getApplyImporte = function(fvId, pendiente) {
        var importe = 0;
        var cobrado = 0;

        if(m_useCliIds) {

          if(m_cobranzaInfo !== null) {

            var facturas = m_cobranzaInfo.getFacturas();

            for(var _i = 0, _count = facturas.length; _i < _count; _i++) {

              var fvInfo = facturas[_i];

              if(fvInfo.cliId === m_cliIdDoc) {

                if(fvInfo.fvId === fvId) {

                  cobrado = fvInfo.importeCobrado;

                  if(pendiente < cobrado) {
                    importe = pendiente;
                  }
                  else {
                    importe = cobrado;
                  }

                  break;
                }
              }
            }
          }
          else {

            var size = m_fvIdsxCliId.length > 0 ? m_fvIdsxCliId[0].length : 0;
            for(var _i = 0, _count = size; _i < _count; _i++) {

              if(m_fvIdsxCliId[0, _i] === m_cliIdDoc) {

                if(m_fvIdsxCliId[1, _i] === fvId) {

                  cobrado = m_fvIdsxCliId[2, _i] / 100;

                  if(pendiente < cobrado) {
                    importe = pendiente;
                  }
                  else {
                    importe = cobrado;
                  }

                  break;
                }
              }
            }
          }
        }
        else {
          importe = pendiente;
        }
        return importe;
      };

      var getApply = function(fvId) {
        var selected = false;

        if(m_useCliIds) {

          if(m_cobranzaInfo !== null) {

            var facturas = m_cobranzaInfo.getFacturas();

            for(var _i = 0, _count = facturas.length; _i < _count; _i++) {

              var fvInfo = facturas[_i];

              if(fvInfo.cliId === m_cliIdDoc) {

                if(fvInfo.fvId === fvId) {

                  selected = true;
                  break;
                }
              }
            }
          }
          else {

            var size = m_fvIdsxCliId.length > 0 ? m_fvIdsxCliId[0].length : 0;
            for(var _i = 0, _count = size; _i < _count; _i++) {

              if(m_fvIdsxCliId[0, _i] === m_cliIdDoc) {

                if(m_fvIdsxCliId[1, _i] === fvId) {

                  selected = true;
                  break;
                }
              }
            }
          }
        }
        else {

          for(var _i = 0; _i < m_fvIds.length; _i++) {
            if(m_fvIds[_i] === fvId) {
              selected = true;
              break;
            }
          }
        }

        return selected;
      };

      var getCuentasDeudor = function() {
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

        return D.Tesoreria.getCuentasDeudor(
            getFacturas(), KI_FV_ID, KI_APLICAR, KI_COTIZACION2,
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

            getCobroIndicado().setValue(total);
            m_objWizard.showValue(getCobroIndicado());

            refreshCtaCte();

            return true;
          }
        );
      };

      var isEmptyRowCheques = function(row, rowIndex) {

        for(var _i = 0, _count = row.size(); _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KICH_CUE_ID:
            case KICH_BCO_ID:
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

            case KICH_BCO_ID:

              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2094, "", strRow)); // Debe indicar un banco (1)
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

            case KICH_CHEQUE:

              if(valEmpty(cell.getValue(), Types.text)) {
                return M.showInfoWithFalse(getText(2116, "", strRow)); // Debe indicar un número de cheque (1)
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
          return M.showInfoWithFalse(getText(2118, "", strRow)); // Debe indicar un importe para la moneda extranjera (1)
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var isEmptyRowTarjetas = function(row, rowIndex) {

        for(var _i = 0, _count = row.size(); _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KIT_TJC_ID:
            case KIT_MON_ID:
            case KIT_TJCCU_ID:

              if(!valEmpty(cell.getId(), Types.id)) {
                return false;
              }
              break;

            case KIT_IMPORTE:
            case KIT_IMPORTEORIGEN:

              if(!valEmpty(val(cell.getValue()), Types.double)) {
                return false;
              }
              break;

            case KIT_NROTARJETA:
            case KIT_NROAUTORIZACION:
            case KIT_TITULAR:
            case KIT_DESCRIP:

              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;

            case KIT_FECHAVTO:

              if(!valEmpty(cell.getValue(), Types.date)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var validateRowTarjetas = function(row, rowIndex) {
        var bOrigen = 0;
        var monId = NO_ID;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        for(var _i = 0, _count = row.size(); _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KIT_TJC_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2113, "", strRow)); // Debe indicar una cuenta contable (1)
              }
              break;

            case KIT_TJCCU_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(1478, "", strRow)); // Debe indicar la cantidad de cuotas (1)
              }
              break;

            case KIT_MON_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2114, "", strRow)); // Debe indicar una moneda (1)
              }
              monId = cell.getId();
              break;

            case KIT_IMPORTEORIGEN:
              bOrigen = !valEmpty(val(cell.getValue()), Types.double);
              break;

            case KIT_IMPORTE:
              if(valEmpty(val(cell.getValue()), Types.double)) {
                return M.showInfoWithFalse(getText(1897, "", strRow)); // Debe indicar un importe (1)
              }
              break;

            case KIT_NROTARJETA:
              if(valEmpty(cell.getValue(), Types.text)) {
                return M.showInfoWithFalse(getText(2120, "", strRow)); // Debe indicar un número tarjeta (1)
              }
              break;

            case KIT_NROAUTORIZACION:
              if(valEmpty(cell.getValue(), Types.text)) {
                return M.showInfoWithFalse(getText(2121, "", strRow)); // Debe indicar un número autorización (1)
              }
              break;

            case KIT_FECHAVTO:
              if(valEmpty(cell.getValue(), Types.date)) {
                return M.showInfoWithFalse(getText(1384, "", strRow)); // Debe indicar una fecha de vencimiento (1)
              }
              break;

            case KIT_TITULAR:
              if(valEmpty(cell.getValue(), Types.text)) {
                return M.showInfoWithFalse(getText(2122, "", strRow)); // Debe indicar un Titular (1)
              }
              break;
          }
        }

        if(!bOrigen && monId !== m_defaultCurrency.id) {
          return M.showInfoWithFalse(getText(2118, "", strRow)); // Debe indicar un importe para la moneda extranjera (1)
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
          return M.showInfoWithFalse(getText(2118, "", strRow)); // Debe indicar un importe para la moneda extranjera (1)
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
              break;

            case KIE_DESCRIP:
              if(!valEmpty(cell.getValue(), Types.text)) {
                return false;
              }
              break;
          }
        }

        return true;
      };

      var validateRowEfectivo = function(row, rowIndex) {
        var bOrigen = 0;
        var monId = NO_ID;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        for(var _i = 0, _count = row.size(); _i < _count; _i++) {

          var cell = row.item(_i);

          switch (cell.getKey()) {

            case KIE_CUE_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(2113, "", strRow)); // Debe indicar una cuenta contable (1)
              }
              break;

            case KIE_CUE_ID:
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
          return M.showInfoWithFalse(getText(2118, "", strRow)); // Debe indicar un importe para la moneda extranjera (1)
        }

        return P.resolvedPromise(true);
      };

      var validateCobro = function() {
        var p = P.resolvedPromise(true);

        for(var _i = 0, _count = getCheques().getRows().size(); _i < _count; _i++) {
          var row = getCheques().getRows().item(_i);
          if(!isEmptyRowCheques(row, _i + 1)) {
            p = p.whenSuccess(call(validateRowCheques, row, _i + 1));
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

        for(var _i = 0, _count = getTarjetas().getRows().size(); _i < _count; _i++) {
          var row = getTarjetas().getRows().item(_i);
          if(!isEmptyRowTarjetas(row, _i + 1)) {
            p = p.whenSuccess(call(validateRowTarjetas, row, _i + 1));
          }
        }

        p = p.whenSuccess(function() {
          if(round(val(getCobroIndicado().getValue()), Cairo.Settings.getAmountDecimals())
            !== round(val(getCobroTotal().getValue()), Cairo.Settings.getAmountDecimals())) {

            // if we need to stop in payments and the wizard is running in
            // autosave (those which are launched by the waybill reception
            // dialog), we don't show the message
            //
            if(m_bVirtualNextStopInPagos && m_autoSelect) {

              // turn off the flag because in the next round
              // if there aren't enough founds we need to show
              // a warning message
              //
              m_bVirtualNextStopInPagos = false;
              m_restarVirtualPush = true;
            }
            else {
              return M.showWarningWithFalse(getText(2151, "")); // El total de los instrumentos de cobro no coincide con el monto a cobrar
            }
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
          p = D.getDocNumberForCliente(getCliente(), getDoc()).then(
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
        var property = getCliente2();
        property.setSelectId(getCliente());
        property.setValue(getClienteName());
        m_objWizard.showValue(getCliente2());

        return getDocNumber().then(setDatosFromAplic);
      };

      var validateDatosGenerales = function() {
        if(valEmpty(getFecha().getValue(), Types.date)) {
          return M.showWarningWithFalse(getText(2152, "")); // Debe indicar la fecha de la Cobranza
        }

        if(valEmpty(getSucursal().getSelectId(), Types.id)) {
          return M.showWarningWithFalse(getText(1560, "")); // Debe indicar la sucursal
        }

        return validateDifCambio();
      };

      var initialize = function() {
        try {

          m_fvIds = [];
          m_cliIds = [];
          m_fvIdsxCliId = [];

          m_isHojaRuta = Cairo.getTesoreriaConfig().getCobranzasXHojaRuta();
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "initialize", C_MODULE, "");
        }
      };

      self.destroy = function() {
        try {

          m_fvIds = null;
          m_cliIds = null;
          m_fvIdsxCliId = null;
          m_objClient = null;
          m_cobranzaInfo = null;

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");
        }
      };

      var getSave = function(register) {

        register.setFieldId(CT.COBZ_ID);
        register.setTable(CT.COBRANZA);
        register.setPath(m_apiPath + "tesoreria/cobranza/from_facturas");
        register.setId(Cairo.Constants.NEW_ID);

        var fields = register.getFields();

        fields.add(CT.COBZ_NUMERO, 0, Types.long);
        fields.add(CT.COBZ_NRODOC, m_lastNroDoc, Types.text);
        fields.add(CT.COBZ_DESCRIP, getDescrip().getValue(), Types.text);
        fields.add(CT.COBZ_FECHA, getFecha().getValue(), Types.date);

        fields.add(C.CLI_ID, m_lastCliId, Types.id);
        fields.add(C.CCOS_ID, getCentroCosto().getSelectId(), Types.id);
        fields.add(C.SUC_ID, getSucursal().getSelectId(), Types.id);
        fields.add(C.DOC_ID, getDoc(), Types.id);
        fields.add(CT.COBZ_COTIZACION, val(getCotizacion().getValue()), Types.double);
        fields.add(C.COB_ID, getCobrador().getSelectId(), Types.id);
        fields.add(C.LGJ_ID, getLegajo().getSelectId(), Types.id);
        fields.add(CT.COBZ_HOJA_RUTA, bToI(m_isHojaRuta), Types.boolean);

        fields.add(CT.COBZ_NETO, val(getCobroNeto().getValue()), Types.currency);
        fields.add(CT.COBZ_OTROS, val(getCobroOtros().getValue()), Types.currency);
        fields.add(CT.COBZ_TOTAL, val(getCobroTotal().getValue()), Types.currency);

        fields.add(CT.COBZ_GRABAR_ASIENTO, 1, Types.boolean);
        fields.add(C.EST_ID, D.Status.pendiente, Types.id);
        fields.add(CT.COBZ_ID, Cairo.Constants.NEW_ID, Types.long);

      };

      var save = function() {
        return D.docCanBeSavedEx(m_objWizard.getDialog(), DWC.FECHA, DWC.DOC)
          .whenSuccess(function() {

            var register = new DB.Register();

            // TODO: check if this setMask call is nedeed
            //
            //m_lastNroDoc = SetMask(w_getComprobante.getValue(), w_getComprobante.getTextMask());
            m_lastNroDoc = getComprobante().getValue();;
            m_lastCliId = getCliente();

            //
            // the orden is share between the five types of items (cheques, efectivo, tarjetas, otros and cta cte)
            //
            m_orden = 0;

            getSave(register);

            saveCheques(register);
            saveEfectivo(register);
            saveTarjetas(register);
            saveOtros(register);
            saveCtaCte(register);

            var aplicado = saveFacturas(register);

            return saveDifCambio(register, aplicado)

              .whenSuccess(function() {

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
              });
          }
        );
      };

      var saveCheques = function(mainRegister) {

        var transaction = new DB.createTransaction();

        transaction.setTable(CT.COBRANZA_ITEM_CHEQUE_TMP);

        var rows = getCheques().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          if(!isEmptyRowCheques(row, _i)) {

            var register = new DB.Register();
            register.setFieldId(CT.COBZI_TMP_ID);
            register.setId(Cairo.Constants.NEW_ID);

            var fields = register.getFields();

            for(var _j = 0, _countj = row.size(); _j < _countj; _j++) {

              var cell = row.item(_j);
              switch (cell.getKey()) {

                case KICH_DESCRIP:
                  fields.add(CT.COBZI_DESCRIP, cell.getValue(), Types.text);
                  break;

                case KICH_CHEQUE:
                  fields.add(CT.COBZI_TMP_CHEQUE, cell.getValue(), Types.text);
                  break;

                case KICH_CLE_ID:
                  fields.add(C.CLE_ID, cell.getId(), Types.id);
                  break;

                case KICH_BCO_ID:
                  fields.add(C.BCO_ID, cell.getId(), Types.id);
                  break;

                case KICH_MON_ID:
                  fields.add(C.MON_ID, cell.getId(), Types.id);
                  break;

                case KICH_FECHACOBRO:
                  fields.add(CT.COBZI_TMP_FECHA_COBRO, cell.getValue(), Types.date);
                  break;

                case KICH_FECHAVTO:
                  fields.add(CT.COBZI_TMP_FECHA_VTO, cell.getValue(), Types.date);
                  break;

                case KICH_CUE_ID:
                  fields.add(C.CUE_ID, cell.getId(), Types.id);
                  break;

                case KICH_IMPORTEORIGEN:
                  fields.add(CT.COBZI_IMPORTE_ORIGEN, val(cell.getValue()), Types.currency);
                  break;

                case KICH_IMPORTE:
                  fields.add(CT.COBZI_IMPORTE, val(cell.getValue()), Types.currency);
                  break;

                case KICH_PROPIO:
                  fields.add(CT.COBZI_TMP_PROPIO, cell.getId(), Types.boolean);
                  break;
              }
            }

            m_orden = m_orden + 1;
            fields.add(CT.COBZI_ORDEN, m_orden, Types.integer);
            fields.add(CT.COBZI_TIPO, CT.CobranzaItemTipo.ITEM_CHEQUES, Types.integer);
            fields.add(CT.COBZI_ID, Cairo.Constants.NEW_ID, Types.long);
            fields.add(CT.COBZI_OTRO_TIPO, CT.OtroTipo.OTRO_DEBE, Types.integer);

            transaction.addRegister(register);
          }
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveFacturas = function(mainRegister) {

        var transaction = new DB.createTransaction();

        transaction.setTable(CT.FACTURA_VENTA_COBRANZA_TMP);

        var rows = getFacturas().getRows();

        //-------------------------------------------------
        // rate currency differences
        //
        var aplicarND = getAplicDifCambio().getListItemData() === CT.AplicacionDifCambio.DIF_APLICACION_ND;

        var mustSave;
        var pago = 0;
        var cotiOrigen = 0;
        var cotiCobranza = 0;
        var maxPago = 0;
        var aplicado = 0;

        //-------------------------------------------------
        // application for every invoice
        //
        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();

          register.setFieldId(CT.FV_COBZ_TMP_ID);
          register.setId(Cairo.Constants.NEW_ID);

          mustSave = false;

          var fields = register.getFields();

          for(var _j = 0, _countj = row.size(); _j < _countj; _j++) {

            var cell = row.item(_j);

            if(getCell(row, KI_SELECT).getId()) {

              mustSave = true;

              switch (cell.getKey()) {
                case KI_FV_ID:
                  fields.add(CV.FV_ID, cell.getId(), Types.id);
                  break;

                case KI_FVD_ID:
                  fields.add(CT.FVD_ID, cell.getId(), Types.id);
                  break;

                case KI_APLICAR:
                  pago = val(cell.getValue());
                  break;

                case KI_IMPORTEORIGEN:
                  fields.add(CT.FV_COBZ_IMPORTE_ORIGEN, val(cell.getValue()), Types.double);
                  break;

                case KI_COTIZACION:
                  cotiOrigen = val(cell.getValue());
                  break;

                case KI_COTIZACION2:
                  cotiCobranza = val(cell.getValue());
                  fields.add(CT.FV_COBZ_COTIZACION, cotiCobranza, Types.double);
                  break;

                case KI_PENDIENTE:
                  maxPago = val(cell.getValue());
                  break;
              }
            }
          }

          if(mustSave) {

            // if there are differences between the rates and the
            // invoice rate is lower than the payment rate
            // we apply using the invoice rate
            //
            if(cotiOrigen < cotiCobranza) {

              // if configuration is set to apply first to the ND
              //
              if(aplicarND) {

                pago = pago / cotiCobranza * cotiOrigen;

              }
              else {

                if(pago > maxPago) { pago = maxPago; }

              }
            }

            aplicado = aplicado + pago;

            fields.add(CT.FV_COBZ_IMPORTE, pago, Types.double);
            fields.add(CT.FV_COBZ_ID, 0, Types.long);
            fields.add(CT.COBZ_ID, 0, Types.long);

            transaction.addRegister(register);
          }

        }

        mainRegister.addTransaction(transaction);

        return aplicado;
      };

      var saveTarjetas = function(mainRegister) {

        var transaction = new DB.createTransaction();

        transaction.setTable(CT.COBRANZA_ITEM_TARJETA_TMP);

        var rows = getTarjetas().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          if(!isEmptyRowTarjetas(row, _i)) {

            var register = new DB.Register();

            register.setFieldId(CT.COBZI_TMP_ID);
            register.setId(Cairo.Constants.NEW_ID);

            var fields = register.getFields();

            for(var _j = 0, _countj = row.size(); _j < _countj; _j++) {

              var cell = row.item(_j);
              switch (cell.getKey()) {

                case KIT_DESCRIP:
                  fields.add(CT.COBZI_DESCRIP, cell.getValue(), Types.text);
                  break;

                case KIT_CUPON:
                  fields.add(CT.COBZI_TMP_CUPON, cell.getValue(), Types.text);
                  break;

                case KIT_TJC_ID:
                  fields.add(C.TJC_ID, cell.getId(), Types.id);
                  break;

                case KIT_TJCCU_ID:
                  fields.add(C.TJCCU_ID, cell.getId(), Types.id);
                  break;

                case KIT_MON_ID:
                  fields.add(C.MON_ID, cell.getId(), Types.id);
                  break;

                case KIT_FECHAVTO:
                  fields.add(CT.COBZI_TMP_FECHA_VTO, cell.getValue(), Types.date);
                  break;

                case KIT_TITULAR:
                  fields.add(CT.COBZI_TMP_TITULAR, cell.getValue(), Types.text);
                  break;

                case KIT_NROTARJETA:
                  fields.add(CT.COBZI_TMP_NRO_TARJETA, cell.getValue(), Types.text);
                  break;

                case KIT_NROAUTORIZACION:
                  fields.add(CT.COBZI_TMP_AUTORIZACION, cell.getValue(), Types.text);
                  break;

                case KIT_TARJETA_TIPO:
                  fields.add(CT.COBZI_TARJETA_TIPO, cell.getId(), Types.long);
                  break;

                case KIT_IMPORTEORIGEN:
                  fields.add(CT.COBZI_IMPORTE_ORIGEN, val(cell.getValue()), Types.currency);
                  break;

                case KIT_IMPORTE:
                  fields.add(CT.COBZI_IMPORTE, val(cell.getValue()), Types.currency);
                  break;
              }
            }

            m_orden = m_orden + 1;
            fields.add(CT.COBZI_ORDEN, m_orden, Types.integer);
            fields.add(CT.COBZI_TIPO, CT.CobranzaItemTipo.ITEM_TARJETA, Types.integer);
            fields.add(CT.COBZI_ID, Cairo.Constants.NEW_ID, Types.long);
            fields.add(CT.COBZI_OTRO_TIPO, CT.OtroTipo.OTRO_DEBE, Types.integer);

            transaction.addRegister(register);
          }
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveOtros = function(mainRegister) {

        var transaction = new DB.createTransaction();

        transaction.setTable(CT.COBRANZA_ITEM_OTRO_TMP);

        var rows = getOtros().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          if(!isEmptyRowOtros(row, _i)) {

            var register = new DB.Register();

            register.setFieldId(CT.COBZI_TMP_ID);
            register.setId(Cairo.Constants.NEW_ID);

            var fields = register.getFields();

            for(var _j = 0, _countj = row.size(); _j < _countj; _j++) {

              var cell = row.item(_j);
              switch (cell.getKey()) {

                case KIO_DESCRIP:
                  fields.add(CT.COBZI_DESCRIP, cell.getValue(), Types.text);
                  break;

                case KIO_RET_ID:
                  fields.add(C.RET_ID, cell.getId(), Types.id);
                  break;

                case KIO_NRORETENCION:
                  fields.add(CT.COBZI_NRO_RETENCION, cell.getValue(), Types.text);
                  break;

                case KIO_PORCRETENCION:
                  fields.add(CT.COBZI_PORC_RETENCION, val(cell.getValue()), Types.double);
                  break;

                case KIO_CCOS_ID:
                  fields.add(C.CCOS_ID, cell.getId(), Types.id);
                  break;

                case KIO_FV_ID_RET:
                  fields.add(CT.FV_ID_RET, cell.getId(), Types.id);
                  break;

                case KIO_CUE_ID:
                  fields.add(C.CUE_ID, cell.getId(), Types.id);
                  break;

                case KIO_FECHARETENCION:
                  if(!valEmpty(cell.getValue(), Types.date)) {
                    fields.add(CT.COBZI_FECHA_RETENCION, cell.getValue(), Types.date);
                  }
                  break;

                case KIO_IMPORTEORIGEN:
                  fields.add(CT.COBZI_IMPORTE_ORIGEN, val(cell.getValue()), Types.currency);
                  break;

                case KIO_DEBE:
                  if(val(cell.getValue()) !== 0) {
                    fields.add(CT.COBZI_IMPORTE, val(cell.getValue()), Types.currency);
                    fields.add(CT.COBZI_OTRO_TIPO, CT.OtroTipo.OTRO_DEBE, Types.integer);
                  }
                  break;

                case KIO_HABER:
                  if(val(cell.getValue()) !== 0) {
                    fields.add(CT.COBZI_IMPORTE, val(cell.getValue()), Types.currency);
                    fields.add(CT.COBZI_OTRO_TIPO, CT.OtroTipo.OTRO_HABER, Types.integer);
                  }
                  break;
              }
            }

            m_orden = m_orden + 1;
            fields.add(CT.COBZI_ORDEN, m_orden, Types.integer);
            fields.add(CT.COBZI_TIPO, CT.CobranzaItemTipo.ITEM_OTROS, Types.integer);
            fields.add(CT.COBZI_ID, Cairo.Constants.NEW_ID, Types.long);

            transaction.addRegister(register);
          }
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveEfectivo = function(mainRegister) {

        var transaction = new DB.createTransaction();

        transaction.setTable(CT.COBRANZA_ITEM_EFECTIVO_TMP);

        var rows = getEfectivo().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          if(!isEmptyRowEfectivo(row, _i)) {

            var register = new DB.Register();

            register.setFieldId(CT.COBZI_TMP_ID);
            register.setId(Cairo.Constants.NEW_ID);

            var fields = register.getFields();

            for(var _j = 0, _countj = row.size(); _j < _countj; _j++) {

              var cell = row.item(_j);
              switch (cell.getKey()) {

                case KIE_DESCRIP:
                  fields.add(CT.COBZI_DESCRIP, cell.getValue(), Types.text);
                  break;

                case KIE_CUE_ID:
                  fields.add(C.CUE_ID, cell.getId(), Types.id);
                  break;

                case KIE_IMPORTEORIGEN:
                  fields.add(CT.COBZI_IMPORTE_ORIGEN, val(cell.getValue()), Types.currency);
                  break;

                case KIE_IMPORTE:
                  fields.add(CT.COBZI_IMPORTE, val(cell.getValue()), Types.currency);
                  break;
              }
            }

            m_orden = m_orden + 1;
            fields.add(CT.COBZI_ORDEN, m_orden, Types.integer);
            fields.add(CT.COBZI_TIPO, CT.CobranzaItemTipo.ITEM_EFECTIVO, Types.integer);
            fields.add(CT.COBZI_ID, Cairo.Constants.NEW_ID, Types.long);
            fields.add(CT.COBZI_OTRO_TIPO, CT.OtroTipo.OTRO_DEBE, Types.integer);

            transaction.addRegister(register);
          }
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var saveCtaCte = function(mainRegister) {

        var transaction = new DB.createTransaction();

        transaction.setTable(CT.COBRANZA_ITEM_CUENTA_CORRIENTE_TMP);

        var rows = getCtaCte().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          var register = new DB.Register();

          register.setFieldId(CT.COBZI_TMP_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var fields = register.getFields();

          for(var _j = 0, _countj = row.size(); _j < _countj; _j++) {

            var cell = row.item(_j);
            switch (cell.getKey()) {

              case KICC_CUE_ID:
                fields.add(C.CUE_ID, cell.getId(), Types.id);
                break;

              case KICC_IMPORTEORIGEN:
                fields.add(CT.COBZI_IMPORTE_ORIGEN, val(cell.getValue()), Types.currency);
                break;

              case KICC_IMPORTE:
                fields.add(CT.COBZI_IMPORTE, val(cell.getValue()), Types.currency);
                break;
            }
          }

          m_orden = m_orden + 1;
          fields.add(CT.COBZI_ORDEN, m_orden, Types.integer);
          fields.add(CT.COBZI_TIPO, CT.CobranzaItemTipo.ITEM_CTA_CTE, Types.integer);
          fields.add(CT.COBZI_ID, Cairo.Constants.NEW_ID, Types.long);
          fields.add(CT.COBZI_OTRO_TIPO, CT.OtroTipo.OTRO_HABER, Types.integer);

          transaction.addRegister(register);
        }

        mainRegister.addTransaction(transaction);

        return true;
      };

      var validateDifCambio = function() {
        var p = null;

        var deudaOrigen = getDeudaOrigen();
        var cobrado = getCobrado();

        var diferencia = Math.abs(deudaOrigen - cobrado);

        if(round(diferencia, 2) !== 0.0) {

          if(getDefaultDifCambio().getListItemData() === CT.ModoDifCambio.DIF_CAMBIO_CUENTA) {

            var cueId = getCueIdDifCambio().getSelectId();

            if(cueId === NO_ID) {
              p = M.showWarningWithFalse(getText(2153, ""));
              // Debe configurar la cuenta de "Diferencia de Cambio" para que el sistema
              // pueda contabilizar los importes cobrados.
            }
          }
          else {
            var docId = getNDDifCambio().getSelectId();

            if(docId === NO_ID) {

              p = M.showWarningWithFalse(getText(2154, ""));

              // @@ERROR_SP:Debe configurar un documento
              // para las notas de crédito/debito que se generan automaticamente.;;
              // Debe indicar estos documentos en el paso anterior para poder guardar
              // esta cobranza.;;Utilize la opción [Configuracion\\Tesoreria\\General]
              // en la solapa [Diferencia de Cambio] para indicar los documentos por
              // defecto y evitará tener que indicarlos en cada cobranza.

            }
          }
        }

        return p || P.resolvedPromise(true);
      };

      var saveDifCambio = function(mainRegister, aplicado) {
        var p = null;

        if(getDefaultDifCambio().getListItemData() === CT.ModoDifCambio.DIF_CAMBIO_CUENTA) {
          saveDifCambioCtaCble(mainRegister);
        }
        else {
          p = saveDifCambioNCND(mainRegister, aplicado);
        }

        return p || P.resolvedPromise(true);
      };

      var saveDifCambioCtaCble = function(mainRegister) {

        var deudaOrigen = getDeudaOrigen();
        var cobrado = getCobrado();

        var diferencia = Math.abs(deudaOrigen - cobrado);

        if(round(diferencia, 2) !== 0.0) {

          var cueId = getCueIdDifCambio().getSelectId();

          var transaction = new DB.createTransaction();

          transaction.setTable(CT.COBRANZA_ITEM_DIF_TMP);

          var register = new DB.Register();

          register.setFieldId(CT.COBZI_TMP_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var fields = register.getFields();

          fields.add(CT.COBZI_DESCRIP, "Diferencia de cambio", Types.text);
          fields.add(C.CUE_ID, cueId, Types.id);

          if(deudaOrigen > cobrado) {
            fields.add(CT.COBZI_IMPORTE, deudaOrigen - cobrado, Types.currency);
            fields.add(CT.COBZI_OTRO_TIPO, CT.OtroTipo.OTRO_DEBE, Types.integer);
          }
          else {
            fields.add(CT.COBZI_IMPORTE, Math.abs(deudaOrigen - cobrado), Types.currency);
            fields.add(CT.COBZI_OTRO_TIPO, CT.OtroTipo.OTRO_HABER, Types.integer);
          }

          m_orden = m_orden + 1;
          fields.add(CT.COBZI_ORDEN, m_orden, Types.integer);
          fields.add(CT.COBZI_TIPO, CT.CobranzaItemTipo.ITEM_OTROS, Types.integer);
          fields.add(CT.COBZI_ID, Cairo.Constants.NEW_ID, Types.long);

          transaction.addRegister(register);

          mainRegister.addTransaction(transaction);
        }

        return true;
      };

      var saveDifCambioNCND = function(mainRegister, aplicado) {
        var p = null;

        var deudaOrigen = getDeudaOrigen();
        var cobrado = getCobrado();

        var diferencia = Math.abs(deudaOrigen - cobrado);

        if(round(diferencia, 2) !== 0.0) {

          // debit note
          //
          if(deudaOrigen < cobrado) {

            p = saveDocVta(mainRegister, getNDDifCambio().getSelectId(), diferencia, true)
              // add this debit note to the application
              //
              .whenSuccess(call(saveCobranzaND, mainRegister, diferencia, aplicado));
          }
          // credit note
          //
          else {

            p = saveDocVta(mainRegister, getNCDifCambio().getSelectId(), diferencia, false)
              // add this credit note to the application
              //
              .whenSuccess(call(saveFacturaVentaNotaCredito, mainRegister, diferencia));
          }
        }

        return p || P.resolvedPromise(true);
      };

      var saveDocVta = function(mainRegister, docId, diferencia, isND) {
        return getIva()
          .whenSuccessWithResult(function(result) {

            var itemsDefinition = getItems(result.taxes, diferencia, isND);

            var neto = itemsDefinition.neto;
            var ivaRi = itemsDefinition.ivaRi;
            var items = itemsDefinition.items;

            var transaction = new DB.createTransaction();

            transaction.setTable(CV.FACTURA_VENTA_TMP);

            var register = new DB.Register();

            register.setFieldId(CV.FV_TMP_ID);
            register.setId(Cairo.Constants.NEW_ID);

            var fields = register.getFields();

            fields.add(CV.FV_ID, Cairo.Constants.NEW_ID, Types.long);

            fields.add(CV.FV_NUMERO, 0, Types.long);
            fields.add(CV.FV_NRODOC, "", Types.text);

            fields.add(CV.FV_DESCRIP, getDescripNDNC(), Types.text);
            fields.add(CV.FV_FECHA, getFechaNdNc().getValue(), Types.date);
            fields.add(CV.FV_FECHA_ENTREGA, getFecha().getValue(), Types.date);
            fields.add(C.CLI_ID, getCliente(), Types.id);
            fields.add(C.SUC_ID, getSucursal().getSelectId(), Types.id);
            fields.add(C.DOC_ID, docId, Types.id);
            fields.add(C.CPG_ID, C.CondicionPagoTipo.fechaDocumento, Types.id);
            fields.add(C.LGJ_ID, getLegajo().getSelectId(), Types.id);

            fields.add(CV.FV_NETO, neto, Types.currency);
            fields.add(CV.FV_SUBTOTAL, neto, Types.currency);
            fields.add(CV.FV_IVA_RI, ivaRi, Types.currency);

            fields.add(CV.FV_TOTAL, neto + ivaRi, Types.currency);
            fields.add(CV.FV_GRABAR_ASIENTO, 1, Types.boolean);
            fields.add(C.EST_ID, D.Status.pendiente, Types.id);

            transaction.addRegister(register);

            mainRegister.addTransaction(transaction);

            return saveItemsNCND(mainRegister, items);
          });
      };

      var saveItemsNCND = function(mainRegister, items) {

        var transaction = new DB.createTransaction();

        transaction.setTable(CV.FACTURA_VENTA_ITEM_TMP);

        var prId = getPrIdDifCambio().getSelectId();

        return getCuentas(prId)
          .whenSuccessWithResult(function(result) {

            var cueId = result.cueId;
            var cueIdIvaRi = result.cueIdIvaRi;

            for(var _i = 0; _i < items.length; _i++) {

              var register = new DB.Register();

              register.setFieldId(CV.FVI_TMP_ID);
              register.setId(Cairo.Constants.NEW_ID);

              var fields = register.getFields();

              fields.add(CV.FVI_ID, Cairo.Constants.NEW_ID, Types.integer);
              fields.add(CV.FVI_CANTIDAD, 1, Types.double);
              fields.add(CV.FVI_PRECIO, items[_i].importe, Types.currency);
              fields.add(CV.FVI_PRECIO_USR, items[_i].importe, Types.currency);
              fields.add(CV.FVI_NETO, items[_i].importe, Types.currency);
              fields.add(CV.FVI_IVARI, items[_i].importeIva, Types.currency);
              fields.add(CV.FVI_IVA_RIPORC, items[_i].tasaIva, Types.double);
              fields.add(C.PR_ID, prId, Types.id);
              fields.add(CV.FVI_IMPORTE, items[_i].importe + items[_i].importeIva, Types.currency);
              fields.add(C.CUE_ID, cueId, Types.id);
              fields.add(C.CUE_ID_IVA_RI, cueIdIvaRi, Types.id);
              fields.add(CV.FVI_ORDEN, _i, Types.integer);

              transaction.addRegister(register);

              register.getFields().clear();

            }

            mainRegister.addTransaction(transaction);

            return true;
          });
      };

      var getItems = function(rates, diferencia, isND) {

        var modoIva = getModoIvaDifCambio().getListItemData();

        var neto = 0;
        var totalIva = 0;
        var iva = 0;
        var items;

        for(var i = 1, count = rates.length; i < count; i++) {
          iva += rates[i].importe;
        }

        // the last item is used to register de what is left
        // in diferencia
        //
        for(var i = 0, count = rates.length -1; i < count; i++) {

          // get percentage of net amount to calculate each rate
          //
          var base = diferencia * U.zeroDiv(rates[i].importe, iva);
          var importeIva, importe;

          // Si hay que usar el iva como base imponible y se trata
          // de una nota de debito
          if(modoIva === CT.ModoIvaDifCambio.DIF_IVA_IMPONIBLE && isND) {
            importeIva = base * rates[i].porcentaje / 100;
            importe = base;

            // Si es una nota de credito o no hay que usar el iva como
            // base imponible
          }
          else {
            importe = base / (1 + rates[i].porcentaje / 100);
            importeIva = importe * rates[i].porcentaje / 100;
          }

          items.push(
            {
              importe: importe,
              importeIva: importeIva,
              tasaIva: rates[i].porcentaje
            }
          );

          neto += importe;
          totalIva += importeIva;
        }

        // for this two cases we don't use iva as base imponible
        //
        // if the difference is not equal to neto and iva was used as base and it is a ND
        // or
        // if the difference is not equal to neto plus importeIva and iva was not taken as base
        // and it is a NC
        //
        if((diferencia !== neto
          && modoIva === CT.ModoIvaDifCambio.DIF_IVA_IMPONIBLE
          && isND)
          || (diferencia !== neto + importeIva
          && (modoIva === CT.ModoIvaDifCambio.DIF_IVA_NO_IMPONIBLE || !isND))) {

          i = rates.length -1;

          if(modoIva === CT.ModoIvaDifCambio.DIF_IVA_IMPONIBLE && isND) {
            base = diferencia - neto; // percentage of neto for each tax
          }
          else {
            base = diferencia - neto - totalIva; // (modoIva == DIF_IVA_NO_IMPONIBLE || !isND)
          }

          // if we have to use iva as base and it is a ND
          //
          if(modoIva === CT.ModoIvaDifCambio.DIF_IVA_IMPONIBLE && isND) {
            importeIva = base * rates[i].porcentaje / 100;
            importe = base;
          }
          // if it is a NC and iva is not base
          //
          else {
            importe = base / (1 + rates[i].porcentaje / 100);
            importeIva = importe * rates[i].porcentaje / 100;
          }

          items.push(
            {
              importe: importe,
              importeIva: importeIva,
              tasaIva: rates[i].porcentaje
            }
          );

          neto = neto + importe;
          totalIva = totalIva + importeIva;
        }

        return {
          neto: neto,
          totalIva: totalIva,
          items: items
        };
      };

      var getIva = function() {
        return DB.getData("load[" + m_apiPath + "tesoreria/cobranza/facturas/taxes?ids=" + getFvIds() + "]");
      };

      var getFvIds = function() {
        var ids = [];
        var rows = getFacturas().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          if(getCell(row, KI_SELECT).getId()) {
            if(val(getCell(row, KI_APLICAR).getValue()) !== 0) {
              ids.push(getCell(row, KI_FV_ID).getId().toString());
            }
          }
        }

        return ids.toString();
      };

      // apply currency rate difference debit note with this payment
      //
      var saveCobranzaND = function(mainRegister, importe, aplicado) {

        if(aplicar > 0) {

          var transaction = new DB.createTransaction();

          transaction.setTable(CT.FACTURA_VENTA_COBRANZA_TMP);

          var aplicar = val(getCobroTotal().getValue()) - aplicado;

          if(importe > aplicar) {
            importe = aplicar;
          }

          var register = new DB.Register();

          register.setFieldId(CT.FV_COBZ_TMP_ID);
          register.setId(Cairo.Constants.NEW_ID);

          var fields = register.getFields();

          // this means the ND must be generated by the payment
          //
          fields.add(CV.FV_ID, -1, Types.id);
          fields.add(CT.FVD_ID, -1, Types.id);

          fields.add(CT.FV_COBZ_IMPORTE, importe, Types.double);
          fields.add(CT.FV_COBZ_ID, 0, Types.long);
          fields.add(CT.COBZ_ID, 0, Types.long);

          transaction.addRegister(register);

          mainRegister.addTransaction(transaction);
        }

        return true;
      };

      // apply NC to inovices in this payment which has currency rate differences
      //
      var saveFacturaVentaNotaCredito = function(mainRegister, importe) {

        // for each invoice with a different currency rate
        //
        var rows = getFacturas().getRows();
        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = rows.item(_i);

          if(getCell(row, KI_MONEDA).getId() !== m_defaultCurrency.id) {

            var cobrado = val(getCell(row, KI_APLICAR).getValue());

            // (Payed divided by payment currency rate) by invoice currency rate
            //
            var aCobrar =
              U.zeroDiv(cobrado, val(getCell(row, KI_COTIZACION2).getValue()))
                * val(getCell(row, KI_COTIZACION).getValue());

            var diferencia = aCobrar - cobrado;
            if(importe < diferencia) { diferencia = importe; }

            saveFVNCAux(
              mainRegister,
              getCell(row, KI_FV_ID).getId(),
              getCell(row, KI_FVD_ID).getId(),
              diferencia);

            importe = importe - diferencia;

            if(importe <= 0) { break; }
          }
        }

        return true;
      };

      var saveFVNCAux = function(mainRegister, fvIdFactura, fvdIdFactura, importe) {
        var transaction = new DB.createTransaction();

        transaction.setTable(CT.FACTURA_VENTA_NOTA_CREDITO_TMP);

        var register = new DB.Register();

        register.setFieldId(CV.FV_NC_TMP_ID);
        register.setId(Cairo.Constants.NEW_ID);

        var fields = register.getFields();

        // this means the NC must be generated by the payment
        //
        fields.add(CT.FV_ID_NOTA_CREDITO, -1, Types.id);
        fields.add(CT.FVD_ID_NOTA_CREDITO, -1, Types.id);

        fields.add(CT.FV_ID_FACTURA, fvIdFactura, Types.id);
        fields.add(CT.FVD_ID_FACTURA, fvdIdFactura, Types.id);
        fields.add(CT.FV_NC_IMPORTE, importe, Types.double);
        fields.add(CT.FV_NC_ID, 0, Types.long);

        transaction.addRegister(register);

        mainRegister.addTransaction(transaction);

        return true;
      };

      var getCuentas = function(prId) {
        // TODO: use the code of this function in TRANSLATED to create an scala implementation
        //
        return DB.getData("load[" + m_apiPath + "tesoreria/cobranzas/producto/get_info]", prId)
          .whenSuccessWithResult(function(result) {
            if(result.producto_info.error !== 0) {
              return M.showWarningWithFalse(result.producto_info.error_message);
            }
            else {
              return result.producto_info;
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

      var getCobroIndicado = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.COBRO_INDICADO);
      };

      var getCobroNeto = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.COBRO_NETO);
      };

      var getCobroOtros = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.COBRO_OTROS);
      };

      var getCobroTotal = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.COBRO_TOTAL);
      };

      var getTotal = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.TOTAL_PAGO);
      };

      var getTotalOrigen = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.TOTAL_PAGO_ORIGEN);
      };

      var getCliente2 = function() {
        return D.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.CLIENTE2);
      };

      var getClienteProperty = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_CLIENTE, DWC.CLIENTE);
      };

      var getCliente = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_CLIENTE, DWC.CLIENTE).getSelectId();
      };

      var getClienteName = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_CLIENTE, DWC.CLIENTE).getValue();
      };

      var getOnlySelected = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_CLIENTE, DWC.ONLY_SELECTED);
      };

      var getCheques = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.CHEQUES).getGrid();
      };

      var getChequesProperty = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.CHEQUES);
      };

      var getTarjetas = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.TARJETAS).getGrid();
      };

      var getTarjetasProperty = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.TARJETAS);
      };

      var getEfectivo = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.EFECTIVO).getGrid();
      };

      var getEfectivoProperty = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.EFECTIVO);
      };

      var getOtros = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.OTROS).getGrid();
      };

      var getOtrosProperty = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.OTROS);
      };

      var getFacturas = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.FACTUAS).getGrid();
      };

      var getCtaCte = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.CTA_CTE).getGrid();
      };

      var getFacturasProperty = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.FACTUAS);
      };

      var getCtaCteProperty = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.CTA_CTE);
      };

      var refreshFacturas = function() {
        m_objWizard.showValue(D.getWizProperty(m_objWizard, WCS.SELECT_FACTURA, DWC.FACTUAS));
      };

      var refreshCtaCte = function() {
        m_objWizard.showValue(D.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.CTA_CTE));
      };

      var getComprobante = function() {
        return D.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.COMPROBANTE);
      };

      var getCobrador = function() {
        return D.getWizProperty(m_objWizard, WCS.DATOS_GENERALES, DWC.COBRADOR);
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

      var getFechaNdNc = function() {
        return D.getWizProperty(m_objWizard, WCS.DIF_CAMBIO, DWC.FECHA_ND_NC);
      };

      var getDoc = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_CLIENTE, DWC.DOC).getSelectId();
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

      var getLabelCobros = function() {
        return D.getWizProperty(m_objWizard, WCS.SELECT_COBROS, LABEL_COBROS);
      };

      var getModoIvaDifCambio = function() {
        return D.getWizProperty(m_objWizard, WCS.DIF_CAMBIO, DWC.MODO_IVA_DIF_CAMBIO);
      };

      var getAplicDifCambio = function() {
        return D.getWizProperty(m_objWizard, WCS.DIF_CAMBIO, DWC.APLICACION_ND);
      };

      var getDefaultDifCambio = function() {
        return D.getWizProperty(m_objWizard, WCS.DIF_CAMBIO, DWC.DEFAULT_DIF_CAMBIO);
      };

      var getCueIdDifCambio = function() {
        return D.getWizProperty(m_objWizard, WCS.DIF_CAMBIO, DWC.CUE_ID_DIF_CAMBIO);
      };

      var getNCDifCambio = function() {
        return D.getWizProperty(m_objWizard, WCS.DIF_CAMBIO, DWC.NC_DIF_CAMBIO);
      };

      var getNDDifCambio = function() {
        return D.getWizProperty(m_objWizard, WCS.DIF_CAMBIO, DWC.ND_DIF_CAMBIO);
      };

      var getPrIdDifCambio = function() {
        return D.getWizProperty(m_objWizard, WCS.DIF_CAMBIO, DWC.PR_ID_DIF_CAMBIO);
      };

      var newEmptyProperties = function() {

        getAnticipo().setValue(0);

        getFacturas().getRows().clear();
        getOtros().getRows().clear();
        getCheques().getRows().clear();
        getEfectivo().getRows().clear();
        getTarjetas().getRows().clear();
        getCtaCte().getRows().clear();

        getCobroNeto().setValue(0);
        getCobroOtros().setValue(0);
        getCobroTotal().setValue(0);

        var cliente = getClienteProperty();
        cliente.setSelectId(m_cliIdDoc);
        cliente.setValue(m_clienteDoc);

        var cliente2 = getCliente2();
        cliente2.setSelectId(m_cliIdDoc);
        cliente2.setValue(m_clienteDoc);

        var comprobante = getComprobante();
        comprobante.setValue("");
        comprobante.setTextMask("");

        var centroCosto = getCentroCosto();
        centroCosto.setSelectId(NO_ID);
        centroCosto.setValue("");

        getDescrip().setValue("");

        m_objWizard.showValue(getClienteProperty());
        m_objWizard.showValue(getCliente2());
        m_objWizard.showValue(getFacturasProperty());
        m_objWizard.showValue(getOtrosProperty());
        m_objWizard.showValue(getChequesProperty());
        m_objWizard.showValue(getEfectivoProperty());
        m_objWizard.showValue(getTarjetasProperty());
        m_objWizard.showValue(getCtaCteProperty());
        m_objWizard.showValue(getAnticipo());
        m_objWizard.showValue(getCobroNeto());
        m_objWizard.showValue(getCobroOtros());
        m_objWizard.showValue(getCobroTotal());
        m_objWizard.showValue(getComprobante());
        m_objWizard.showValue(getCentroCosto());
        m_objWizard.showValue(getDescrip());

      };

      var getDescripNDNC = function() {
        var facturas = [];
        var rows = getFacturas().getRows();

        for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

          var row = getFacturas().getRows().item(_i);

          if(val(getCell(row, KI_APLICAR).getValue())) {
            facturas.push(getCell(row, KI_NRODOC).getValue());
          }
        }

        var cobranza = getComprobante().getValue();

        return NC_ND_DESCRIP_DIF_CAMBIO + "\\r\\n\\r\\n" + getText(2483, "", cobranza, facturas.toString());
      };

      var setDatosFromAplic = function() {
        // TODO: use the code of this function in TRANSLATED to create an scala implementation
        //
        return DB.getData("load[" + m_apiPath + "tesoreria/cobranza/facturas?ids=" + getFvIds() + "]")
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

      var setFilterColFactura = function() {

        var filter = D.getFacturaVentaFilter(getCliente());
        D.getCol(getOtros().getColumns(), KIO_FV_ID_RET).setSelectFilter(filter);
        m_objWizard.getDialog().refreshColumnProperties(getOtrosProperty(), CT.FV_ID_RET);

      };

      var refreshLabelPagos = function() {

        var prop = getLabelCobros();
        prop.setValue(LABEL_COBROS_TEXT + " - " + getClienteProperty().getValue());
        m_objWizard.showValue(prop);

      };

      var loadVirtualNextCobros = function(property) {
        var p = null;

        // if the info payment object is null there is not automatic payments
        //
        if(m_cobranzaInfo !== null) {
          var efectivo = 0;
          var tickets = 0;
          var facturas = m_cobranzaInfo.getFacturas();
          for(var _i = 0, _count = facturas.length; _i < _count; _i++) {

            var fvInfo = facturas[_i];

            if(fvInfo.cliId === m_cliIdDoc) {

              switch (fvInfo.formaDePago) {

                case CT.HojaRutaCobranzaTipo.EFECTIVO:
                  efectivo += fvInfo.importeCobrado;
                  break;

                case CT.HojaRutaCobranzaTipo.TICKETS:
                  tickets += fvInfo.importeCobrado;
                  break;
              }
            }
          }

          if(efectivo !== 0) {

            p = D.getCurrencyFromAccount(m_cobranzaInfo.cueIdEfectivo)
              .whenSuccessWithResult(function(info) {

                var row = getEfectivo().getRows().add(null);

                row.add(null);

                var elem = row.add(null);
                elem.setValue(m_cobranzaInfo.cuentaEfectivo);
                elem.setId(m_cobranzaInfo.cueIdEfectivo);
                elem.setKey(KIE_CUE_ID);

                elem = row.add(null);
                elem.setValue(info.monName);
                elem.setId(info.monId);
                elem.setKey(KIE_MON_ID);

                elem = row.add(null);
                if(info.monId !== m_defaultCurrency.id) {
                  elem.setValue(efectivo);
                }
                else {
                  elem.setValue(0);
                }
                elem.setKey(KIE_IMPORTEORIGEN);

                elem = row.add(null);
                if(info.monId !== m_defaultCurrency.id) {
                  elem.setValue(efectivo * val(getCotizacion().getValue()));
                }
                else {
                  elem.setValue(efectivo);
                }
                elem.setKey(KIE_IMPORTE);

                elem = row.add(null);
                elem.setValue("");
                elem.setKey(KIE_DESCRIP);

                return true;
              });
          }

          if(tickets !== 0) {

            p = p || P.resolvedPromise(true);

            p = p
              .whenSuccess(call(D.getCurrencyFromAccount, m_cobranzaInfo.cueIdTicket))
              .whenSuccessWithResult(function(info) {

                var row = getEfectivo().getRows().add(null);

                row.add(null);

                var elem = row.add(null);
                elem.setValue(m_cobranzaInfo.cuentaTicket);
                elem.setId(m_cobranzaInfo.cueIdTicket);
                elem.setKey(KIE_CUE_ID);

                elem = row.add(null);
                elem.setValue(info.monName);
                elem.setId(info.monId);
                elem.setKey(KIE_MON_ID);

                elem = row.add(null);
                if(info.monId !== m_defaultCurrency.id) {
                  elem.setValue(tickets);
                }
                else {
                  elem.setValue(0);
                }
                elem.setKey(KIE_IMPORTEORIGEN);

                elem = row.add(null);
                if(info.monId !== m_defaultCurrency.id) {
                  elem.setValue(tickets * val(getCotizacion().getValue()));
                }
                else {
                  elem.setValue(tickets);
                }
                elem.setKey(KIE_IMPORTE);

                elem = row.add(null);
                elem.setValue("");
                elem.setKey(KIE_DESCRIP);
              });
          }

          if(efectivo !== 0 || tickets !== 0) {

            p = p.whenSuccess(function() {
              refreshEfectivo();

              showCobroNeto();
              showCobroOtro();
              showCobroTotal();
            });
          }
        }

        return p || P.resolvedPromise(true);
      };

      var refreshEfectivo = function() {
        m_objWizard.showValue(D.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.EFECTIVO));
      };

      var loadCajaForCurrentUser = function() {

        m_cjId = NO_ID;

        return D.loadCajaForCurrentUser().whenSuccessWithResult(
          function(result) {
            var warningMessage = valField(result.cajaInfo, "warning");
            if(warningMessage !== "") {
              return M.showWarningWithFalse(warningMessage);
            }
            else {
              m_cjId = valField(result.cajaInfo, C.CJ_ID);
              return P.resolvedPromise(true);
            }
          }
        );
      };

      initialize();

      return self;

    };

    Edit.Controller = { getEditor: createObject };

  });

}());
