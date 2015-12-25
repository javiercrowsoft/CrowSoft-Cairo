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
      var Types = Cairo.Constants.Types;
      var valField = DB.valField;
      var valEmpty = Cairo.Util.valEmpty;
      var val = Cairo.Util.val;
      var call = P.call;
      var D = Cairo.Documents;
      var U = Cairo.Util;
      var getCell = Dialogs.cell;
      var Grids = Cairo.Dialogs.Grids;
      var val = U.val;
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

      var m_defaultCurrency = D.getDefaultCurrency();

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

      var m_lastDocId = 0;
      var m_lastCliId = 0;

      var m_lastNroDoc = "";

      var m_nextCliIdIndex = 0;
      var m_useCliIds;

      var m_autoSelect;
      var m_wizWasClosed;

      var m_bVirtualNextStopInPagos;
      var m_restarVirtualPush;

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

      self.loadWizard = function() {
        var p = null;

        try {
          if(m_isHojaRuta) {
            p = loadCajaForUsuario();
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

        return p || P.resolvedPromise();
      };

      self.isEmptyRow = function(key, row, rowIndex) {
        var isEmpty = true;

        try {

          switch (key) {
            case WC.KW_FACTURAS:
              isEmpty = false;
              break;

            case WC.KW_CHEQUES:
              isEmpty = pIsEmptyRowCheques(row, rowIndex);
              break;

            case WC.KW_TARJETAS:
              isEmpty = pIsEmptyRowTarjetas(row, rowIndex);
              break;

            case WC.KW_OTROS:
              isEmpty = pIsEmptyRowOtros(row, rowIndex);
              break;

            case WC.KW_EFECTIVO:
              isEmpty = pIsEmptyRowEfectivo(row, rowIndex);
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

      self.columnAfterEdit = function(key, lRow, lCol, newValue, newValueID) {
        return P.resolvedPromise(true);
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
            D.setSelectFilterCuotas(grid.getRows(lRow), property, m_objWizard.getDialog(), KIT_TJC_ID);
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
            break;

          default:

            return false;
            break;
        }
      };

      var columnAfterUpdateFactura = function(property, lRow, lCol) {

        var grid = property.getGrid();

        switch (grid.getColumns(lCol).getKey()) {
          case KI_SELECT:
            var row = grid.getRows(lRow);
            selectFactura(row, grid.getColumns());
            showTotalFacturas();
            break;

          case KI_COTIZACION2:
            var cotiz = null;
            var row = grid.getRows(lRow);
            cotiz = val(getCell(row, KI_COTIZACION2).getValue());
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
            row = grid.getRows(lRow);
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

        switch (grid.getColumns(lCol).getKey()) {

          case KICH_IMPORTEORIGEN:

            var row = grid.getRows(lRow);
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

            var row = grid.getRows(lRow);

            p = D.getCurrencyFromAccount(getCell(row, KICH_CUE_ID).getId())
              .whenSuccess(function(response) {

                var monId = valField(response.data, C.MON_ID);
                var moneda = valField(response.data, C.MON_NAME);
                var cell = getCell(row, KICH_MON_ID);

                cell.setValue(moneda);
                cell.setId(monId);

                if(monId === m_defaultCurrency.id || monId === 0) {
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

            var row = grid.getRows(lRow);
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

        switch (grid.getColumns(lCol).getKey()) {

          case KIT_IMPORTEORIGEN:

            var row = grid.getRows(lRow);
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

            var row = grid.getRows(lRow);
            var cell = getCell(row, KIT_TJCCU_ID);
            var tjcId = getCell(row, KIT_TJC_ID).getId();

            D.setSelectFilterCuotas(row, property, m_objWizard.getDialog(), KIT_TJC_ID);

            p = D.validateCuota(tjcId, cell.getId())
              .whenSuccess(function(response) {
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

        switch (grid.getColumns(lCol).getKey()) {

          case KIE_IMPORTEORIGEN:

            var row = grid.getRows(lRow);
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

            var row = grid.getRows(lRow);
            p = D.getCurrencyFromAccount(getCell(row, KIE_CUE_ID).getId())
              .whenSuccess(function(response) {

                var monId = valField(response.data, C.MON_ID);
                var moneda = valField(response.data, C.MON_NAME);
                var cell = getCell(row, KIE_MON_ID);

                cell.setValue(moneda);
                cell.setId(monId);

                if(monId === m_defaultCurrency.id || monId === 0) {
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

        switch (grid.getColumns(lCol).getKey()) {

          case KIO_DEBE:
            var row = grid.getRows(lRow);
            getCell(row, KIO_IMPORTEORIGEN).setValue(val(getCell(row, KIO_DEBE).getValue()));
            getCell(row, KIO_HABER).setValue(0);
            showCobroOtro();
            showCobroTotal();
            break;

          case KIO_HABER:
            var row = grid.getRows(lRow);
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
          D.getCurrencyFromAccount(cueId, Cairo.Dates.today())
            .whenSuccess(function(response) {
              var monId = valField(response.data, C.MON_ID);
              var monName = valField(response.data, C.MON_NAME);
              var cotizacion = valField(response.data, C.MON_COTIZACION)

              var monedaAnticipo = getMonedaAnticipo();
              monedaAnticipo.setSelectId(monId);
              monedaAnticipo.setValue(monName);

              if(show) {
                m_objWizard.showValue(getMonedaAnticipo());
              }

              var cotizacionAnticipo = getCotizacionAnticipo();
              if(monId !== m_defaultCurrency.id) {
                cotizacionAnticipo.setEnabled(true);
                cotizacionAnticipo.setValue(cotizacion);
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
                Cairo.Util.round(val(getCell(row, KI_COTIZACION2).getValue()), decimalesCotiz)
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

      self.getAplication = function() {
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
                if(!getCuentasDeudor()) { return _rtn; }
                setFilterColFactura();
                refreshLabelPagos();
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

              validateCobro()
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

        return true;
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
        var properties = m_objWizard.getSteps().add(null, U.getKey(WCS.WELCOME)).getProperties();

        var elem = properties.add(null, DWC.TITLE);
        elem.setType(T.title);
        elem.setValue(getText(2130, "")); // Bienvenido al Asistente de Cobranza

        var elem = properties.add(null, DWC.MAIN_TITLE);
        elem.setType(T.label);
        elem.setValue(getText(2131, "")); // Con este Asistente usted podra generar los Recibos por Cobranzas.

        D.wizAddNewDocProperties(m_objWizard, WCS.WELCOME);

      };

      var loadStepSelectCliente = function() {

        // the step's key must be the constant that defines them
        // this is crucial for the navigation to work
        //
        var properties = m_objWizard.getSteps().add(null, U.getKey(WCS.SELECT_CLIENTE)).getProperties();

        var elem = properties.add(null);

        elem.setType(T.label);
        elem.setValue(getText(2132, "")); // Indique el documento a utilizar y el Cliente al que se le emitirá el Recibo

        var elem = properties.add(null, DWC.DOC);
        elem.setName(getText(1567, "")); // Documento
        elem.setType(T.select);
        elem.setSelectFilter(Cairo.Documents.COBRANZA_DOC_FILTER);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setValue(Cairo.getTesoreriaConfig().getDocCobranza());
        elem.setSelectId(Cairo.getTesoreriaConfig().getDocIdCobranza());
        elem.setKey(WC.KW_DOC_ID);

        setMultyCliente();

        var elem = properties.add(null, DWC.CLIENTE);
        elem.setName(getText(1150, "")); // Cliente
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CLIENTE);
        elem.setValue(m_clienteDoc);
        elem.setSelectId(m_cliIdDoc);

        var elem = properties.add(null, DWC.ONLY_SELECTED);
        elem.setType(T.check);
        elem.setName(getText(2133, "")); // Cargar sólo Facturas seleccionadas
        elem.setValue(m_fvIds.length);
      };

      var loadStepFactura = function() {

        // the step's key must be the constant that defines them
        // this is crucial for the navigation to work
        //
        var properties = m_objWizard.getSteps().add(null, U.getKey(WCS.SELECT_FACTURA));

        var elem = properties.add(null);

        elem.setType(T.label);
        elem.setValue(getText(2134, "")); // Seleccione las Facturas he indique los importes que cancelará en cada una de ellas

        var elem = properties.add(null, DWC.AGRUPADOS);
        elem.setName(getText(2135, "")); // Agrupar
        elem.setType(T.check);
        elem.setKey(WC.KW_AGRUPADOS);

        var elem = properties.add(null, DWC.VENCIDOS);
        elem.setName(getText(2136, "")); // Ver solo vencidos
        elem.setType(T.check);
        elem.setKey(WC.KW_VENCIDOS);

        var elem = properties.add(null, DWC.COTIZACION);
        elem.setName(getText(1635, "")); // Cotización
        elem.setType(T.numeric);
        elem.setFormat(Cairo.Settings.getCurrencyRateDecimalsFormat());
        elem.setSubType(ST.money);
        elem.setKey(WC.KW_COTIZACION);

        var elem = properties.add(null, DWC.FACTUAS);

        elem.setType(T.grid);
        setGridFacturas(elem.getGrid());
        elem.setKey(WC.KW_FACTURAS);
        elem.setGridAddEnabled(false);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(false);

        var elem = properties.add(null, DWC.TODOS);
        elem.setName(Cairo.Constants.SELECT_ALL_TEXT);
        elem.setType(T.button);
        elem.setKey(WC.KW_TODOS);

        var elem = properties.add(null, DWC.ANTICIPO);
        elem.setName(getText(2137, "")); // Anticipo
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setKey(WC.KW_ANTICIPO);

        var elem = properties.add(null, DWC.TOTAL_PAGO_ORIGEN);
        elem.setName(getText(2138, "")); // Total Origen
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setEnabled(false);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());

        var elem = properties.add(null, DWC.TOTAL_PAGO);
        elem.setName(getText(1584, "")); // Total
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setEnabled(false);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
      };

      var setGridFacturas = function(property) {

        var columns = property.getGrid().getColumns();

        columns.add(null).setVisible(false);

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_FVD_ID);

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
        elem.setKey(KI_FV_ID);

        var elem = columns.add(null);
        elem.setName(getText(1569, "")); // Fecha
        elem.setType(Dialogs.PropertyType.date);
        elem.setFormat("dd/mm/yy");
        elem.setKey(KI_FECHA);

        var elem = columns.add(null, DWC.MONEDA);
        elem.setName(getText(2063, "")); // Mon
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KI_MONEDA);

        var elem = columns.add(null);
        elem.setName(getText(1901, "")); // Origen
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_IMPORTEORIGEN);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());

        var elem = columns.add(null, DWC.COTIZACION);
        elem.setName(getText(1650, "")); // Cotiz.
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_COTIZACION);
        elem.setFormat(Cairo.Settings.getCurrencyRateDecimalsFormat());

        var elem = columns.add(null);
        elem.setName(m_defaultCurrency.symbol);
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_TOTAL);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());

        var elem = columns.add(null, DWC.COTIZACION2);
        elem.setName(getText(1650, "")); // Cotiz.
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_COTIZACION2);
        elem.setVisible(false);
        elem.setFormat(Cairo.Settings.getCurrencyRateDecimalsFormat());

        var elem = columns.add(null);
        elem.setName(getText(1634, "")); // Vto.
        elem.setType(Dialogs.PropertyType.date);
        elem.setFormat("dd/mm/yy");
        elem.setKey(KI_VTO);

        var elem = columns.add(null, DWC.PENDIENTE);
        elem.setName(getText(2139, "", m_defaultCurrency.symbol)); // Importe  & Signo
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_PENDIENTE);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());

        var elem = columns.add(null, DWC.IMPORTE);
        elem.setName(getText(2139, "", m_defaultCurrency.symbol)); // Importe  & Signo
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_IMPORTE);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());

        var elem = columns.add(null);
        elem.setName(getText(1662, "")); // Aplicar
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KI_APLICAR);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());

        var elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KI_DESCRIP);
      };

      var loadStepAnticipo = function() {

        // the step's key must be the constant that defines them
        // this is crucial for the navigation to work
        //
        var properties = m_objWizard.getSteps().add(null, U.getKey(WCS.ANTICIPO));


        var elem = properties.add(null);
        elem.setType(T.label);
        elem.setValue(getText(2140, "")); // Indique los datos del anticipo

        var elem = properties.add(null, DWC.CUENTA_ANTICIPO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setSelectFilter(D.selectFilterForCuentaAnticipoCobranza);
        elem.setName(getText(1267, "")); // Cuenta
        elem.setValue(Cairo.getTesoreriaConfig().getCueAnticipoCobz());
        elem.setSelectId(Cairo.getTesoreriaConfig().getCueIdAntCobz());
        elem.setKey(WC.KW_CUENTA_ANTICIPO);

        var elem = properties.add(null, DWC.MONEDA_ANTICIPO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setName(getText(1113, "")); // Moneda
        elem.setKey(WC.KW_MONEDA_ANTICIPO);
        elem.setEnabled(false);

        var elem = properties.add(null, DWC.COTIZACION_ANTICIPO);
        elem.setName(getText(1635, "")); // Cotización
        elem.setFormat(Cairo.Settings.getCurrencyRateDecimalsFormat());
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setKey(WC.KW_COTIZACION_ANTICIPO);

        var elem = properties.add(null, DWC.ANTICIPO_IMPORTE);
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
        var properties = m_objWizard.getSteps().add(null, U.getKey(WCS.DIF_CAMBIO));

        var elem = properties.add(null);
        elem.setType(T.label);
        elem.setValue(getText(2141, "")); // Indique como tratar las diferencias de cambio

        var elem = properties.add(null, DWC.DEFAULT_DIF_CAMBIO);
        elem.setType(T.list);
        elem.setName(getText(2286, "")); // Utilizar
        elem.setKey(WC.KW_DEFALUT_DIF_CAMBIO);
        elem.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
        elem.setListItemData(Cairo.getTesoreriaConfig().getDefaultDifCambio());

        var list = elem.getList();

        var elem = list.add(null);
        elem.setId(CT.ModoDifCambio.DIF_CAMBIO_CUENTA);
        elem.setValue(getText(2142, "")); // Una cuenta contable

        var elem = list.add(null);
        elem.setId(CT.ModoDifCambio.DIF_CAMBIO_NC_ND);
        elem.setValue(getText(2143, "")); // Una Nota de Débito o Crédito

        var elem = properties.add(null, DWC.CUE_ID_DIF_CAMBIO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setName(getText(2288, "")); // Cuenta contable
        elem.setKey(WC.KW_CUE_ID_DIF_CAMBIO);
        elem.setSelectId(Cairo.getTesoreriaConfig().getCueIdDifCambio());
        elem.setValue(Cairo.getTesoreriaConfig().getCuentaDifCambio());

        var elem = properties.add(null, DWC.NC_DIF_CAMBIO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(getText(2289, "")); // Nota de Crédito
        elem.setKey(WC.KW_DOC_ID_NC_DIF_CAMBIO);
        elem.setSelectId(Cairo.getTesoreriaConfig().getDocIdNCDifCambio());
        elem.setSelectFilter(D.NOTA_CREDITO_VENTAS_DOC_FILTER);
        elem.setValue(Cairo.getTesoreriaConfig().getDocNCDifCambio());

        var elem = properties.add(null, DWC.ND_DIF_CAMBIO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.DOCUMENTO);
        elem.setName(getText(2230, "")); // Nota de Débito
        elem.setKey(WC.KW_DOC_ID_ND_DIF_CAMBIO);
        elem.setSelectId(Cairo.getTesoreriaConfig().getDocIdNDDifCambio());
        elem.setSelectFilter(D.NOTA_DEBITO_VENTAS_DOC_FILTER);
        elem.setValue(Cairo.getTesoreriaConfig().getDocNDDifCambio());

        var elem = properties.add(null, DWC.PR_ID_DIF_CAMBIO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PRODUCTOS_DE_VENTA);
        elem.setName(getText(1367, "")); // Artículo
        elem.setKey(WC.KW_PR_ID_DIF_CAMBIO);
        elem.setSelectId(Cairo.getTesoreriaConfig().getPrIdDifCambio());
        elem.setValue(Cairo.getTesoreriaConfig().getProductoDifCambio());

        var elem = properties.add(null, DWC.MODO_IVA_DIF_CAMBIO);
        elem.setType(T.list);
        elem.setName(getText(2290, "")); // Tratamiento del IVA
        elem.setKey(WC.KW_MODO_IVA_DIF_CAMBIO);
        elem.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
        elem.setListItemData(Cairo.getTesoreriaConfig().getModoIvaDifCambio());

        var list = elem.getList();

        var elem = list.add(null);
        elem.setId(CT.ModoIvaDifCambio.DIF_IVA_IMPONIBLE);
        elem.setValue(getText(2144, "")); // Tomar la diferencia de cambio como base imponible para el IVA

        var elem = list.add(null);
        elem.setId(CT.ModoIvaDifCambio.DIF_IVA_NO_IMPONIBLE);
        elem.setValue(getText(2145, "")); // IVA incluido en la diferencia de cambio

        var elem = properties.add(null, DWC.FECHA_ND_NC);
        elem.setType(T.date);
        elem.setName(getText(1569, "")); // Fecha
        elem.setKey(WC.KW_FECHA_NDNC);
        elem.setValue(Date);

        var elem = properties.add(null, DWC.APLICACION_ND);
        elem.setType(T.list);
        elem.setName(getText(2479, "")); // Aplicación
        elem.setKey(WC.KW_APLICACION_DIF_CAMBIO);
        elem.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
        elem.setListItemData(Cairo.getTesoreriaConfig().getAplicacionDifCambio());

        var list = elem.getList();

        var elem = list.add(null);
        elem.setId(CT.AplicacionDifCambio.DIF_APLICACION_ND);
        elem.setValue(getText(2480, "")); // Cobrar la Nota de Débito y aplicar el resto a las Facturas

        var elem = list.add(null);
        elem.setId(CT.AplicacionDifCambio.DIF_APLICACION_FV);
        elem.setValue(getText(2481, "")); // Cobrar las Facturas y aplicar el resto a la Note de Débito

      };

      var loadStepCobros = function() {

        // the step's key must be the constant that defines them
        // this is crucial for the navigation to work
        //
        var keyCobros = U.getKey(WCS.SELECT_COBROS);

        var properties = m_objWizard.getSteps().add(null, keyCobros);

        var elem = properties.add(null, LABEL_COBROS);

        elem.setType(T.label);
        elem.setValue(LABEL_COBROS_TEXT);

        var dialog = m_objWizard.getDialog();

        var tab = dialog.getTabs().add(null);
        tab.setFatherTab(keyCobros);
        tab.setName("Cheques");
        tab.setIndex(-1);

        tab = dialog.getTabs().add(null);
        tab.setFatherTab(keyCobros);
        tab.setName("Efectivo");
        tab.setIndex(-2);

        tab = dialog.getTabs().add(null);
        tab.setFatherTab(keyCobros);
        tab.setName("Tarjetas");
        tab.setIndex(-3);

        tab = dialog.getTabs().add(null);
        tab.setFatherTab(keyCobros);
        tab.setName("Otros");
        tab.setIndex(-4);

        tab = dialog.getTabs().add(null);
        tab.setFatherTab(keyCobros);
        tab.setName("Cuenta Corriente");
        tab.setIndex(-5);

        var elem = properties.add(null, DWC.CHEQUES);

        elem.setType(T.grid);
        setGridCheques(elem.getGrid());
        elem.setKey(WC.KW_CHEQUES);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);
        elem.setTabIndex(-1);

        var elem = properties.add(null, DWC.EFECTIVO);

        elem.setType(T.grid);
        setGridEfectivo(elem.getGrid());
        elem.setKey(WC.KW_EFECTIVO);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);
        elem.setTabIndex(-2);

        var elem = properties.add(null, DWC.TARJETAS);

        elem.setType(T.grid);
        setGridTarjetas(elem.getGrid());
        elem.setKey(WC.KW_TARJETAS);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);
        elem.setTabIndex(-3);

        var elem = properties.add(null, DWC.OTROS);

        elem.setType(T.grid);
        setGridOtros(elem.getGrid());
        elem.setKey(WC.KW_OTROS);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);
        elem.setTabIndex(-4);

        var elem = properties.add(null, DWC.CTA_CTE);

        elem.setType(T.grid);
        setGridCtaCte(elem.getGrid());
        elem.setKey(WC.KW_CTA_CTE);
        elem.setGridAddEnabled(false);
        elem.setGridEditEnabled(false);
        elem.setGridRemoveEnabled(false);
        elem.setTabIndex(-5);

        var elem = properties.add(null, DWC.COBRO_INDICADO);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setName(getText(2147, "")); // A cobrar
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setEnabled(false);
        elem.setKey(WC.KW_IMPORTE_INDICADO);

        var elem = properties.add(null, DWC.COBRO_NETO);
        elem.setName(getText(1581, "")); // Neto
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setEnabled(false);
        elem.setKey(WC.KW_IMPORTE_NETO);

        var elem = properties.add(null, DWC.COBRO_OTROS);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setName(getText(1070, "")); // Otros
        elem.setType(T.numeric);
        elem.setSubType(ST.money);
        elem.setEnabled(false);
        elem.setKey(WC.KW_IMPORTE_OTROS);

        var elem = properties.add(null, DWC.COBRO_TOTAL);
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

        var elem = columns.add(null);
        elem.setName(getText(1267, "")); // Cuenta
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setKey(KIO_CUE_ID);
        elem.setSelectFilter(D.getCuentaOtroFilterForCaja(m_isHojaRuta, m_cjId));

        var elem = columns.add(null);
        elem.setName(getText(1904, "")); // Debe
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIO_DEBE);

        var elem = columns.add(null);
        elem.setName(getText(1905, "")); // Haber
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIO_HABER);

        var elem = columns.add(null);
        elem.setName(getText(1901, "")); // Origen
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIO_IMPORTEORIGEN);

        var elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIO_DESCRIP);

        var elem = columns.add(null);
        elem.setName(getText(1403, "")); // Retención
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.RETENCION);
        elem.setKey(KIO_RET_ID);

        var elem = columns.add(null);
        elem.setName(getText(2103, "")); // C. Retención
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIO_NRORETENCION);

        var elem = columns.add(null);
        elem.setName(getText(2104, "")); // % Retención
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
        elem.setKey(KIO_PORCRETENCION);

        var elem = columns.add(null);
        elem.setName(getText(1569, "")); // Fecha
        elem.setType(Dialogs.PropertyType.date);
        elem.setKey(KIO_FECHARETENCION);

        var elem = columns.add(null);
        elem.setName(getText(1057, "")); // Centro de Costo
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CENTRO_COSTO);
        elem.setKey(KIO_CCOS_ID);

        var elem = columns.add(null, C.FV_ID_RET);
        elem.setName(getText(1866, "")); // Factura
        elem.setType(Dialogs.PropertyType.select);
        elem.setTable(T.FACTURAS_DE_VENTA);
        elem.setKey(KIO_FV_ID_RET);
      };

      var setGridCheques = function(grid) {

        var columns = grid.getColumns();
        columns.clear();

        columns.add(null).setVisible(false);

        var elem = columns.add(null);
        elem.setName(getText(1267, "")); // Cuenta
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setSelectFilter(D.getCuentaChequeFilterForCaja(m_isHojaRuta, m_cjId));
        elem.setKey(KICH_CUE_ID);

        var elem = columns.add(null);
        elem.setName(getText(2063, "")); // Mon
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setKey(KICH_MON_ID);
        elem.setEnabled(false);

        var elem = columns.add(null);
        elem.setName(getText(1901, "")); // Origen
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KICH_IMPORTEORIGEN);

        var elem = columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KICH_IMPORTE);

        var elem = columns.add(null);
        elem.setName(getText(1122, "")); // Banco
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.BANCO);
        elem.setKey(KICH_BCO_ID);

        var elem = columns.add(null);
        elem.setName(getText(2059, "")); // Nro. Cheque
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KICH_CHEQUE);

        var elem = columns.add(null);
        elem.setName(getText(3719, "")); // Propio
        elem.setType(Dialogs.PropertyType.check);
        elem.setKey(KICH_PROPIO);

        var elem = columns.add(null);
        elem.setName(getText(2065, "")); // Depositar el
        elem.setDefaultValue(Grids.createCell());
        elem.getDefaultValue().setValue(Date);
        elem.setType(Dialogs.PropertyType.date);
        elem.setKey(KICH_FECHACOBRO);

        var elem = columns.add(null);
        elem.setName(getText(1634, "")); // Vto.
        elem.setDefaultValue(Grids.createCell());
        elem.getDefaultValue().setValue(Cairo.Dates.addToDate("m", 1, Date));
        elem.setType(Dialogs.PropertyType.date);
        elem.setKey(KICH_FECHAVTO);

        var elem = columns.add(null);
        elem.setName(getText(1083, "")); // Clering
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CLEARING);
        elem.setKey(KICH_CLE_ID);

        var elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KICH_DESCRIP);
      };

      var setGridEfectivo = function(grid) {

        var columns = grid.getColumns();
        columns.clear();

        columns.add(null).setVisible(false);

        var elem = columns.add(null);
        elem.setName(getText(1267, "")); // Cuenta
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setSelectFilter(D.getCuentaChequeFilterForCaja(m_isHojaRuta, m_cjId));
        elem.setKey(KIE_CUE_ID);

        var elem = columns.add(null);
        elem.setName(getText(2063, "")); // Mon
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setKey(KIE_MON_ID);
        elem.setEnabled(false);

        var elem = columns.add(null);
        elem.setName(getText(1901, "")); // Origen
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIE_IMPORTEORIGEN);

        var elem = columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIE_IMPORTE);

        var elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIE_DESCRIP);
      };

      var setGridTarjetas = function(grid) {

        var columns = grid.getColumns();
        columns.clear();

        columns.add(null).setVisible(false);

        var elem = columns.add(null);
        elem.setName(getText(2105, "")); // Cupon
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIT_CUPON);

        var elem = columns.add(null);
        elem.setName(getText(2106, "")); // Tarjeta
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectFilter(D.selectFilterForTarjeta);
        elem.setSelectTable(Cairo.Tables.TARJETACREDITO);
        elem.setKey(KIT_TJC_ID);

        var elem = columns.add(null, C_CUOTAS);
        elem.setName(getText(1473, "")); // Cuotas
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TARJETACREDITOCUOTA);
        elem.setKey(KIT_TJCCU_ID);
        m_lColCuotas = columns.count();

        var elem = columns.add(null);
        elem.setName(getText(2063, "")); // Mon
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.MONEDA);
        elem.setKey(KIT_MON_ID);

        var elem = columns.add(null);
        elem.setName(getText(1901, "")); // Origen
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIT_IMPORTEORIGEN);

        var elem = columns.add(null);
        elem.setName(getText(1228, "")); // Importe
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KIT_IMPORTE);

        var elem = columns.add(null);
        elem.setName(getText(1634, "")); // Vto.
        elem.setType(Dialogs.PropertyType.date);
        elem.setDefaultValue(Grids.createCell());
        elem.getDefaultValue().setValue(Cairo.Dates.addToDate("d", 1, Date));
        elem.setKey(KIT_FECHAVTO);

        var elem = columns.add(null);
        elem.setName(getText(2107, "")); // Nro. Tarjeta
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIT_NROTARJETA);

        var elem = columns.add(null);
        elem.setName(getText(2123, "")); // Cod. Autoriz.
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIT_NROAUTORIZACION);

        var elem = columns.add(null);
        elem.setName(getText(2108, "")); // Operacion
        elem.setType(Dialogs.PropertyType.list);
        elem.setDefaultValue(Grids.createCell());
        elem.getDefaultValue().setId(C.CuponTipo.CUPON_POSNET);
        elem.setKey(KIT_TARJETA_TIPO);

        var list = elem.getList();

        var elem = list.add(null);
        elem.setId(C.CuponTipo.CUPON_POSNET);
        elem.setValue(getText(2110, "")); // Posnet

        var elem = list.add(null);
        elem.setId(C.CuponTipo.CUPON_MANUAL);
        elem.setValue(getText(2111, "")); // Manual

        var elem = columns.add(null);
        elem.setName(getText(2109, "")); // Titular
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIT_TITULAR);

        var elem = columns.add(null);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setType(Dialogs.PropertyType.text);
        elem.setKey(KIT_DESCRIP);
      };

      var setGridCtaCte = function(grid) {

        var columns = grid.getColumns();
        columns.clear();

        columns.add(null).setVisible(false);

        var elem = columns.add(null);
        elem.setName(getText(1267, "")); // Cuenta
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.CUENTA);
        elem.setSelectFilter(D.selectFilterCuentaNotInCaja);
        elem.setKey(KICC_CUE_ID);

        var elem = columns.add(null);
        elem.setName(getText(1901, "")); // Origen
        elem.setType(Dialogs.PropertyType.numeric);
        elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setKey(KICC_IMPORTEORIGEN);

        var elem = columns.add(null);
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
        var properties = m_objWizard.getSteps().add(null, U.getKey(WCS.DATOS_GENERALES));

        var elem = properties.add(null);

        elem.setType(T.label);
        elem.setValue(getText(2148, "")); // Complete los siguientes datos del Recibo

        var elem = properties.add(null, DWC.FECHA);
        elem.setType(T.date);
        elem.setName(getText(1569, "")); // Fecha
        elem.setKey(WC.KW_FECHA);
        elem.setValue(Date);

        var elem = properties.add(null, DWC.CLIENTE2);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CLIENTE);
        elem.setEnabled(false);
        elem.setName(getText(1150, "")); // Cliente
        elem.setKey(WC.KW_CLIENTE2);

        var elem = properties.add(null, DWC.SUCURSAL);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.SUCURSAL);
        elem.setName(getText(1281, "")); // Sucursal
        elem.setValue(Cairo.User.getSucName());
        elem.setSelectId(Cairo.User.getSucId());
        elem.setKey(WC.KW_SUCURSAL);

        var elem = properties.add(null, DWC.COMPROBANTE);
        elem.setType(T.text);
        elem.setName(getText(1610, "")); // Comprobante
        elem.setKey(WC.KW_COMPROBANTE);

        var elem = properties.add(null, DWC.COBRADOR);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.COBRADOR);
        elem.setName(getText(1088, "")); // Cobrador
        elem.setKey(WC.KW_COBRADOR);

        var elem = properties.add(null, DWC.LEGAJO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.LEGAJOS);
        elem.setName(getText(1575, "")); // Legajo
        elem.setKey(WC.KW_LEGAJO);

        var elem = properties.add(null, DWC.CENTRO_COSTO);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CENTRO_COSTO);
        elem.setName(getText(1057, "")); // Centro de Costo
        elem.setKey(WC.KW_CENTRO_COSTO);

        var elem = properties.add(null, DWC.OBSERVACIONES);
        elem.setType(T.text);
        elem.setName(getText(1861, "")); // Observaciones
        elem.setKey(WC.KW_DESCRIP);
      };

      var checkAnticipo = function() {
        return true;
      };

      var checkFacturas = function() {
        if(val(getTotal().getValue()) === 0) {
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

        bAgrupados = getAgrupados();

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

        // Edit From ListDoc
        //
        bOnlySelected = getOnlySelected().getValue();

        var w_getFacturas = getFacturas();

        G.redim(vMonId, 0);

        if(getAgrupados()) {
          w_getFacturas.getColumns(DWC.IMPORTE).Visible = false;
          w_getFacturas.getColumns(DWC.PENDIENTE).Visible = true;
        }
        else {
          w_getFacturas.getColumns(DWC.IMPORTE).Visible = true;
          w_getFacturas.getColumns(DWC.PENDIENTE).Visible = false;
        }

        var w_rows = w_getFacturas.getRows();

        w_rows.clear();
        return true;
      };

      var loadFacturasXCliente = function() {


        for(var _i = 0; _i < m_data.facturasXCliente.length; _i += 1) {

          // Edit From ListDoc
          //
          fv_id = Cairo.Database.valField(m_data.facturasXCliente[_i], C.FV_ID);

          bSelected = getApply(fv_id);
          if(!bOnlySelected || bSelected) {

            var elem = w_rows.add(null);

            // La primera no se usa
            elem.add(null);

            var elem = properties.add(null);
            elem.setId(Cairo.Database.valField(m_data.facturasXCliente[_i], C.FVD_ID));
            elem.setKey(KI_FVD_ID);

            var elem = properties.add(null);
            elem.setId(parseInt(bSelected));
            elem.setKey(KI_SELECT);

            var elem = properties.add(null);
            elem.setValue(Cairo.Database.valField(m_data.facturasXCliente[_i], C.DOC_NAME));
            elem.setKey(KI_DOC);

            var elem = properties.add(null);
            elem.setValue(Cairo.Database.valField(m_data.facturasXCliente[_i], C.FV_NRODOC));
            elem.setKey(KI_NRODOC);

            var elem = properties.add(null);
            elem.setValue(Cairo.Database.valField(m_data.facturasXCliente[_i], C.FV_NUMERO));
            elem.setId(Cairo.Database.valField(m_data.facturasXCliente[_i], C.FV_ID));
            elem.setKey(KI_FV_ID);

            var elem = properties.add(null);
            elem.setValue(Cairo.Database.valField(m_data.facturasXCliente[_i], C.FV_FECHA));
            elem.setKey(KI_FECHA);

            var elem = properties.add(null);
            elem.setValue(Cairo.Database.valField(m_data.facturasXCliente[_i], C.MON_NAME));
            elem.setId(Cairo.Database.valField(m_data.facturasXCliente[_i], C.MON_ID));
            elem.setKey(KI_MONEDA);

            var elem = properties.add(null);
            origen = Cairo.Database.valField(m_data.facturasXCliente[_i], C.FV_TOTAL_ORIGEN);
            elem.setValue(origen ? origen : ""));
            elem.setKey(KI_IMPORTEORIGEN);
            if(val(elem.Value) !== 0) { bShowCotizacion = true; }

            var elem = properties.add(null);
            cotiz = Cairo.Database.valField(m_data.facturasXCliente[_i], C.FV_COTIZACION);
            elem.setValue(cotiz ? cotiz : ""));
            elem.setKey(KI_COTIZACION);

            var elem = properties.add(null);
            elem.setValue(Cairo.Database.valField(m_data.facturasXCliente[_i], C.FV_TOTAL));
            elem.setKey(KI_TOTAL);

            var elem = properties.add(null);
            elem.setValue(0);
            elem.setKey(KI_COTIZACION2);

            var elem = properties.add(null);
            elem.setValue(Cairo.Database.valField(m_data.facturasXCliente[_i], C.FVD_FECHA));
            elem.setKey(KI_VTO);

            var elem = properties.add(null);
            elem.setValue(Cairo.Database.valField(m_data.facturasXCliente[_i], C.FV_PENDIENTE));
            elem.setKey(KI_PENDIENTE);

            var elem = properties.add(null);
            elem.setValue(Cairo.Database.valField(m_data.facturasXCliente[_i], C.FVD_PENDIENTE));
            elem.setKey(KI_IMPORTE);

            var elem = properties.add(null);
            if(bSelected) {
              elem.setValue(getApplyImporte(fv_id, Cairo.Database.valField(m_data.facturasXCliente[_i], C.FVD_PENDIENTE)));
            }
            else {
              elem.setValue(0);
            }
            elem.setKey(KI_APLICAR);

            var elem = properties.add(null);
            elem.setValue(Cairo.Database.valField(m_data.facturasXCliente[_i], C.FV_DESCRIP));
            elem.setKey(KI_DESCRIP);

            monId = Cairo.Database.valField(m_data.facturasXCliente[_i], C.MON_ID);
            if(m_defaultCurrency.id !== monId) {
              pAddMoneda(vMonId[], monId);
            }
          }

        }

        if(!bShowCotizacion) {
          getFacturas().getColumns(DWC.COTIZACION).Visible = false;
          getFacturas().getColumns(DWC.MONEDA).Visible = false;
          getCotizacion().setVisible(false);
          getTotalOrigen().setVisible(false);
          m_bDifCambio = false;
        }
        else {
          getFacturas().getColumns(DWC.COTIZACION).Visible = true;
          getFacturas().getColumns(DWC.MONEDA).Visible = true;
          getCotizacion().setVisible(true);
          getTotalOrigen().setVisible(true);
          m_bDifCambio = true;
        }

        if(vMonId.length > 0) {
          moneda = new cMoneda();

          getFacturas().getColumns(DWC.COTIZACION2).Visible = true;

          G.redim(vCotiz, vMonId.length);
          for(i = 1; i <= vMonId.length; i++) {
            vCotiz[i] = moneda.getCotizacion(vMonId[i], Date);
          }

          var row = null;
          var _count = getFacturas().getRows().size();
          for(var _i = 0; _i < _count; _i++) {
            row = getFacturas().getRows().item(_i);
            for(i = 1; i <= vMonId.length; i++) {
              if(vMonId[i] === getCell(row, KI_MONEDA).getId()) {
                getCell(row, KI_COTIZACION2).setValue(vCotiz[i]);
                break;
              }
            }
          }

          moneda = new cMoneda();

          getCotizacion().setValue(moneda.getCotizacion(vMonId[1], Date));
          refreshCotizacion(false);

        }
        else {
          getCotizacion().setVisible(false);
          getFacturas().getColumns(DWC.COTIZACION2).Visible = false;
        }

        m_objWizard.showValue(getCotizacion());
        m_objWizard.showValue(getTotalOrigen());

        refreshFacturas();
        showTotalFacturas();

        return true;
      };

      // Edit From ListDoc
      //
      var getApplyImporte = function(fv_id, pendiente) {
        var _rtn = 0;
        var i = null;
        var j = null;
        var cobrado = null;

        if(m_useCliIds) {

          if(m_cobranzaInfo !== null) {

            // Cobranza por Info
            //
            var fvInfo = null;

            var _count = m_cobranzaInfo.getFacturas().size();
            for(var _i = 0; _i < _count; _i++) {
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

            for(j = 1; j <= (m_fvIdsxCliId, 2).length; j++) {

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

      var getApply = function(fv_id) {
        var _rtn = null;
        var i = null;
        var j = null;

        if(m_useCliIds) {

          if(m_cobranzaInfo !== null) {

            // Cobranza por Info
            //
            var fvInfo = null;

            var _count = m_cobranzaInfo.getFacturas().size();
            for(var _i = 0; _i < _count; _i++) {
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

            for(j = 1; j <= (m_fvIdsxCliId, 2).length; j++) {

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

          for(i = 1; i <= m_fvIds.length; i++) {
            if(m_fvIds[i] === fv_id) {
              _rtn = true;
              return _rtn;
            }
          }
        }

        return _rtn;
      };

      var pAddMoneda = function(vMonIds, monId) {
        var i = null;

        for(i = 1; i <= vMonIds.length; i++) {
          if(vMonIds(i) === monId) { return; }
        }

        G.redimPreserve(vMonIds, vMonIds.length + 1);
        vMonIds(vMonIds.length) = monId;
      };

      var getCuentasDeudor = function() {
        var total = 0;
        var anticipoOrigen = 0;

        // Dimensiono la grilla y el vector de facturas
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

        return D.getCuentasDeudor(getFacturas(), KI_FV_ID, KI_APLICAR, KI_COTIZACION2, anticipo, cueIdAnticipo, cuentaAnticipo, anticipoOrigen)
          .whenSuccess(function(response) {

            var ctaCte = response.cta_cte;

            for(var i = 0; i < ctaCte.length; i++) {

              var row = getCtaCte().getRows().add(null);

              var cell = row.add(null);

              cell = row.add(null);
              cell.setValue(valField(ctaCte[i], C.CUE_NAME));
              cell.setId(valField(ctaCte[i], C.CUE_NAME));
              cell.setKey(KICC_CUE_ID);

              cell = row.add(null);
              cell.setValue(valField(ctaCte[i], C.COBZI_IMPORTE_ORIGEN));
              cell.setKey(KICC_IMPORTEORIGEN);

              var importe = val(valField(ctaCte[i], C.COBZI_IMPORTE));

              cell = row.add(null);
              cell.setValue(importe);
              cell.setKey(KICC_IMPORTE);

              total = total + importe;
            }


            getCobroIndicado().setValue(total);
            m_objWizard.showValue(getCobroIndicado());

            refreshCtaCte();

            return true;
          }
        );
      };

      // Validaciones de Filas de Instrumentos de cobro
      var pIsEmptyRowCheques = function(row, rowIndex) {
        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var bRowIsEmpty = true;

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
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
              if(!ValEmpty(val(cell.getValue()), Cairo.Constants.Types.double)) {
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

      var validateRowCheques = function(row, rowIndex) {
        var cell = null;
        var bOrigen = null;
        var monId = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case KICH_CUE_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                        MsgInfo(getText(2113, "", strRow)); // Debe indicar una cuenta contable (1)
              }

              break;

            case KICH_BCO_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                        MsgInfo(getText(2094, "", strRow)); // Debe indicar un banco (1)
              }

              break;

            case KICH_MON_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                        MsgInfo(getText(2114, "", strRow)); // Debe indicar una moneda (1)
              }
              monId = cell.getId();

              break;

            case KICH_CLE_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                        MsgInfo(getText(2115, "", strRow)); // Debe indicar un clearing (1)
              }

              break;

            case KICH_IMPORTEORIGEN:
              bOrigen = !ValEmpty(val(cell.getValue()), Cairo.Constants.Types.double);

              break;

            case KICH_IMPORTE:
              if(ValEmpty(val(cell.getValue()), Cairo.Constants.Types.double)) {
                        MsgInfo(getText(1897, "", strRow)); // Debe indicar un importe (1)
              }

              break;

            case KICH_CHEQUE:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                        MsgInfo(getText(2116, "", strRow)); // Debe indicar un número de cheque (1)
              }

              break;

            case KICH_FECHACOBRO:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.date)) {
                        MsgInfo(getText(2117, "", strRow)); // Debe indicar una fecha para depositar (1)
              }

              break;

            case KICH_FECHAVTO:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.date)) {
                        MsgInfo(getText(1384, "", strRow)); // Debe indicar una fecha de vencimiento (1)
              }
              break;
          }
        }

        if(!bOrigen && monId !== m_defaultCurrency.id) {
          MsgInfo(getText(2118, "", strRow));
          //Debe indicar un importe para la moneda extranjera (1)
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var pIsEmptyRowTarjetas = function(row, rowIndex) {
        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var bRowIsEmpty = true;

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
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
              if(!ValEmpty(val(cell.getValue()), Cairo.Constants.Types.double)) {
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

      var validateRowTarjetas = function(row, rowIndex) {
        var cell = null;
        var bOrigen = null;
        var monId = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case KIT_TJC_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                        MsgInfo(getText(2113, "", strRow)); // Debe indicar una cuenta contable (1)
              }

              break;

            case KIT_TJCCU_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                        MsgInfo(getText(1478, "", strRow)); // Debe indicar la cantidad de cuotas (1)
              }

              break;

            case KIT_MON_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                        MsgInfo(getText(2114, "", strRow)); // Debe indicar una moneda (1)
              }
              monId = cell.getId();

              break;

            case KIT_IMPORTEORIGEN:
              bOrigen = !ValEmpty(val(cell.getValue()), Cairo.Constants.Types.double);

              break;

            case KIT_IMPORTE:
              if(ValEmpty(val(cell.getValue()), Cairo.Constants.Types.double)) {
                        MsgInfo(getText(1897, "", strRow)); // Debe indicar un importe (1)
              }

              break;

            case KIT_NROTARJETA:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                        MsgInfo(getText(2120, "", strRow)); // Debe indicar un número tarjeta (1)
              }

              break;

            case KIT_NROAUTORIZACION:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                        MsgInfo(getText(2121, "", strRow)); // Debe indicar un número autorización (1)
              }

              break;

            case KIT_FECHAVTO:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.date)) {
                        MsgInfo(getText(1384, "", strRow)); // Debe indicar una fecha de vencimiento (1)
              }

              break;

            case KIT_TITULAR:
              if(ValEmpty(cell.getValue(), Cairo.Constants.Types.text)) {
                        MsgInfo(getText(2122, "", strRow)); // Debe indicar un Titular (1)
              }
              break;
          }
        }

        if(!bOrigen && monId !== m_defaultCurrency.id) {
            MsgInfo(getText(2118, "", strRow)); // Debe indicar un importe para la moneda extranjera (1)
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var pIsEmptyRowOtros = function(row, rowIndex) {
        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var bRowIsEmpty = true;

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
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
              if(!ValEmpty(val(cell.getValue()), Cairo.Constants.Types.double)) {
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

      var validateRowOtros = function(row, rowIndex) {
        var cell = null;
        var bOrigen = null;
        var bDebe = null;
        var bHaber = null;
        var monId = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case KIO_CUE_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                        MsgInfo(getText(2113, "", strRow)); // Debe indicar una cuenta contable (1)
              }

              break;

            case KIO_DEBE:
              bDebe = !ValEmpty(val(cell.getValue()), Cairo.Constants.Types.double);

              break;

            case KIO_HABER:
              bHaber = !ValEmpty(val(cell.getValue()), Cairo.Constants.Types.double);

              break;

            case KIO_IMPORTEORIGEN:
              bOrigen = !ValEmpty(val(cell.getValue()), Cairo.Constants.Types.double);

              break;
          }
        }

        if(!bDebe && !bHaber) {
          MsgInfo(getText(1898, "", strRow));
          //Debe indicar un importe en el debe o en el haber (1)
        }

        if(!bOrigen && monId !== m_defaultCurrency.id) {
          MsgInfo(getText(2118, "", strRow));
          //Debe indicar un importe para la moneda extranjera (1)
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var pIsEmptyRowEfectivo = function(row, rowIndex) {
        var cell = null;
        var strRow = null;

        strRow = " (Fila "+ rowIndex.toString()+ ")";

        var bRowIsEmpty = true;

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
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
              if(!ValEmpty(val(cell.getValue()), Cairo.Constants.Types.double)) {
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

      var validateRowEfectivo = function(row, rowIndex) {
        var cell = null;
        var bOrigen = null;
        var monId = null;

        var strRow = " (Row: " + rowIndex.toString() + ")";

        var _count = row.size();
        for(var _i = 0; _i < _count; _i++) {
          cell = row.item(_i);
          switch (cell.getKey()) {

            case KIE_CUE_ID:
              if(ValEmpty(cell.getId(), Cairo.Constants.Types.id)) {
                        MsgInfo(getText(2113, "", strRow)); // Debe indicar una cuenta contable (1)
              }

              if(!Cairo.Database.getData(C.CUENTA, C.CUE_ID, cell.getId(), C.MON_ID, monId)) { return false; }

              break;

            case KIE_IMPORTEORIGEN:
              bOrigen = !ValEmpty(val(cell.getValue()), Cairo.Constants.Types.double);

              break;

            case KIE_IMPORTE:
              if(ValEmpty(val(cell.getValue()), Cairo.Constants.Types.double)) {
                        MsgInfo(getText(1897, "", strRow)); // Debe indicar un importe (1)
              }
              break;
          }
        }

        if(!bOrigen && monId !== m_defaultCurrency.id) {
          MsgInfo(getText(2118, "", strRow));
          //Debe indicar un importe para la moneda extranjera (1)
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      var validateCobro = function() {
        var row = null;
        var i = null;

        i = 0;
        var _count = getCheques().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getCheques().getRows().item(_i);
          i = i + 1;
          if(!pIsEmptyRowCheques(row, i)) {
            if(!validateRowCheques(row, i)) { return false; }
          }
        }

        i = 0;
        var _count = getEfectivo().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getEfectivo().getRows().item(_i);
          i = i + 1;
          if(!pIsEmptyRowEfectivo(row, i)) {
            if(!validateRowEfectivo(row, i)) { return false; }
          }
        }

        i = 0;
        var _count = getOtros().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getOtros().getRows().item(_i);
          i = i + 1;
          if(!pIsEmptyRowOtros(row, i)) {
            if(!validateRowOtros(row, i)) { return false; }
          }
        }

        i = 0;
        var _count = getTarjetas().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getTarjetas().getRows().item(_i);
          i = i + 1;
          if(!pIsEmptyRowTarjetas(row, i)) {
            if(!validateRowTarjetas(row, i)) { return false; }
          }
        }

        if(Cairo.Util.round(val(getCobroIndicado().getValue()), Cairo.Settings.getAmountDecimals()) !== Cairo.Util.round(val(getCobroTotal().getValue()), Cairo.Settings.getAmountDecimals())) {

          // Si me tengo que detener en pagos y estoy en una
          // cobranza semi-automatica (las que se disparan desde
          // la recepcion de hojas de ruta), no presento un mensaje
          //
          if(m_bVirtualNextStopInPagos && m_autoSelect) {

            // Apago el flag por que a la proxima que de next y no
            // alcance para el pago ya le tengo que avisar
            //
            m_bVirtualNextStopInPagos = false;
            m_restarVirtualPush = true;

          }
          else {

            MsgWarning(getText(2151, ""));
            //El total de los instrumentos de cobro no coincide con el monto a cobrar
          }

          return null;
        }
        return true;
      };

      var getDocNumber = function() {
        var tl = null;
        var tAL_ID = null;
        var sqlstmt = null;
        var rs = null;
        var mask = null;
        var bEditable = null;

        if(LenB(getComprobante().getValue())) { return; }

        sqlstmt = "sp_clienteGetTalonario "+ getCliente().toString()+ ","+ getDoc().toString();
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
        var w_getCliente2 = getCliente2();
        w_getCliente2.setSelectId(getCliente());
        w_getCliente2.setValue(getClienteName());
        m_objWizard.showValue(getCliente2());
        getDocNumber();
        setDatosFromAplic();
      };

      var validateDatosGenerales = function() {
        if(ValEmpty(getFecha().getValue(), Cairo.Constants.Types.date)) {
            MsgWarning(getText(2152, "")); // Debe indicar la fecha de la Cobranza
          return null;
        }

        if(ValEmpty(getSucursal().getSelectId(), Cairo.Constants.Types.id)) {
            MsgWarning(getText(1560, "")); // Debe indicar la sucursal
          return null;
        }

        return true;
      };

      self.initialize = function() {
        try {

          m_fvIds = [];
          m_cliIds = [];
          m_fvIdsxCliId = [];

          m_isHojaRuta = Cairo.getTesoreriaConfig().getCobranzasXHojaRuta();
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "Class_Initialize", C_MODULE, "");
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
          Cairo.manageErrorEx(ex.message, ex, "Class_Terminate", C_MODULE, "");
        }
      };

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

        register.setFieldId(C.COBZ_TMPID);
        register.setTable(C.COBRANZATMP);
        register.setId(Cairo.Constants.NEW_ID);

        var fields = register.getFields();
        fields.add(C.COBZ_NUMERO, 0, Cairo.Constants.Types.long);
        var w_getComprobante = getComprobante();
        // PrintDoc
        //
        m_lastNroDoc = SetMask(w_getComprobante.getValue(), w_getComprobante.getTextMask());
        register.getFields().add2(C.COBZ_NRODOC, m_lastNroDoc, Cairo.Constants.Types.text);
        fields.add(C.COBZ_DESCRIP, getDescrip().getValue(), Cairo.Constants.Types.text);
        fields.add(C.COBZ_FECHA, getFecha().getValue(), Cairo.Constants.Types.date);
        m_lastCliId = getCliente();
        fields.add(C.CLI_ID, m_lastCliId, Cairo.Constants.Types.id);
        fields.add(C.CCOS_ID, getCentroCosto().getSelectId(), Cairo.Constants.Types.id);
        fields.add(C.SUC_ID, getSucursal().getSelectId(), Cairo.Constants.Types.id);
        fields.add(C.DOC_ID, getDoc(), Cairo.Constants.Types.id);
        fields.add(C.COBZ_COTIZACION, val(getCotizacion().getValue()), Cairo.Constants.Types.double);
        fields.add(C.COB_ID, getCobrador().getSelectId(), Cairo.Constants.Types.id);
        fields.add(C.LGJ_ID, getLegajo().getSelectId(), Cairo.Constants.Types.id);
        fields.add(C.COBZ_HOJA_RUTA, CInt(m_isHojaRuta), Cairo.Constants.Types.boolean);

        fields.add(C.COBZ_NETO, val(getCobroNeto().getValue()), Cairo.Constants.Types.currency);
        fields.add(C.COBZ_OTROS, val(getCobroOtros().getValue()), Cairo.Constants.Types.currency);
        fields.add(C.COBZ_TOTAL, val(getCobroTotal().getValue()), Cairo.Constants.Types.currency);

        fields.add(C.COBZ_GRABAR_ASIENTO, 1, Cairo.Constants.Types.boolean);
        fields.add(Cairo.Constants.EST_ID, CSGeneralEx2.csEEstado.cSEEST_PENDIENTE, Cairo.Constants.Types.id);
        fields.add(C.COBZ_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);

        if(!register.beginTrans(Cairo.Database)) { return _rtn; }

        if(!Cairo.Database.save(register, , "pSave", C_MODULE, c_ErrorSave)) { return _rtn; }

        m_iOrden = 0;
        if(!pSaveCheques(register.getId())) { return _rtn; }
        if(!pSaveEfectivo(register.getId())) { return _rtn; }
        if(!pSaveTarjetas(register.getId())) { return _rtn; }
        if(!pSaveOtros(register.getId())) { return _rtn; }
        if(!pSaveCtaCte(register.getId())) { return _rtn; }
        if(!pSaveFacturas(register.getId(), aplicado)) { return _rtn; }

        if(!pSaveDifCambio(register.getId(), aplicado)) { return _rtn; }

        if(!register.commitTrans()) { return _rtn; }

        var sqlstmt = null;
        var rs = null;

        sqlstmt = "sp_DocCobranzaSave "+ register.getId().toString();
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

        var _count = getCheques().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getCheques().getRows().item(_i);

          i = i + 1;
          if(!pIsEmptyRowCheques(row, i)) {

            register = new cRegister();

            register.setFieldId(C.COBZI_TMPID);
            register.setTable(C.COBRANZAITEMTMP);
            register.setId(Cairo.Constants.NEW_ID);

            var fields = register.getFields();

            var _count = row.size();
            for(var _j = 0; _j < _count; _j++) {
              cell = row.item(_j);
              switch (cell.getKey()) {

                case KICH_DESCRIP:
                  fields.add(C.COBZI_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KICH_CHEQUE:
                  fields.add(C.COBZI_TMPCHEQUE, cell.getValue(), Cairo.Constants.Types.text);

                  break;

                case KICH_CLE_ID:
                  fields.add(C.CLE_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KICH_BCO_ID:
                  fields.add(C.BCO_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KICH_MON_ID:
                  fields.add(C.MON_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KICH_FECHACOBRO:
                  fields.add(C.COBZI_TMPFECHA_COBRO, cell.getValue(), Cairo.Constants.Types.date);
                  break;

                case KICH_FECHAVTO:
                  fields.add(C.COBZI_TMPFECHA_VTO, cell.getValue(), Cairo.Constants.Types.date);

                  break;

                case KICH_CUE_ID:
                  fields.add(C.CUE_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KICH_IMPORTEORIGEN:
                  fields.add(C.COBZI_IMPORTE_ORIGEN, val(cell.getValue()), Cairo.Constants.Types.currency);
                  break;

                case KICH_IMPORTE:
                  fields.add(C.COBZI_IMPORTE, val(cell.getValue()), Cairo.Constants.Types.currency);
                  break;

                case KICH_PROPIO:
                  fields.add(C.COBZI_TMPPROPIO, cell.getId(), Cairo.Constants.Types.boolean);
                  break;
              }
            }

            m_iOrden = m_iOrden + 1;
            fields.add(C.COBZI_ORDEN, m_iOrden, Cairo.Constants.Types.integer);
            fields.add(C.COBZI_TIPO, csECobranzaItemTipo.cSECOBZITCHEQUES, Cairo.Constants.Types.integer);
            fields.add(C.COBZ_TMPID, id, Cairo.Constants.Types.id);
            fields.add(C.COBZI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);
            fields.add(C.COBZI_OTRO_TIPO, csEItemOtroTipo.cSEOTRODEBE, Cairo.Constants.Types.integer);

            if(!Cairo.Database.save(register, , "pSaveCheques", C_MODULE, c_ErrorSave)) { return false; }
          }
        }

        return true;
      };

      var pSaveFacturas = function(id, aplicado) {

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

        aplicarND = getAplicDifCambio().getListItemData() === CT.AplicacionDifCambio.cSEDIFAPLICACION_ND;

        //-------------------------------------------------
        // Determinamos la aplicacion de cada factura
        //
        var _count = getFacturas().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getFacturas().getRows().item(_i);

          register = new cRegister();

          register.setFieldId(C.FV_COBZ_TMPID);
          register.setTable(C.FACTURAVENTACOBRANZATMP);
          register.setId(Cairo.Constants.NEW_ID);

          bSave = false;

          var fields = register.getFields();

          var _count = row.size();
          for(var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            if(getCell(row, KI_SELECT).getId()) {
              bSave = true;
              switch (cell.getKey()) {
                case KI_FV_ID:
                  fields.add(C.FV_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KI_FVD_ID:
                  fields.add(C.FVD_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KI_APLICAR:
                  pago = val(cell.getValue());
                  break;

                case KI_IMPORTEORIGEN:
                  fields.add(C.FV_COBZ_IMPORTE_ORIGEN, val(cell.getValue()), Cairo.Constants.Types.double);
                  break;

                case KI_COTIZACION:
                  cotiOrigen = val(cell.getValue());
                  break;

                case KI_COTIZACION2:
                  cotiCobranza = val(cell.getValue());
                  fields.add(C.FV_COBZ_COTIZACION, cotiCobranza, Cairo.Constants.Types.double);
                  break;

                case KI_PENDIENTE:
                  maxPago = val(cell.getValue());
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

            fields.add(C.FV_COBZ_IMPORTE, pago, Cairo.Constants.Types.double);
            fields.add(C.FV_COBZ_ID, 0, Cairo.Constants.Types.long);
            fields.add(C.COBZ_TMPID, id, Cairo.Constants.Types.id);
            fields.add(C.COBZ_ID, 0, Cairo.Constants.Types.long);

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

        var _count = getTarjetas().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getTarjetas().getRows().item(_i);

          i = i + 1;
          if(!pIsEmptyRowTarjetas(row, i)) {

            register = new cRegister();

            register.setFieldId(C.COBZI_TMPID);
            register.setTable(C.COBRANZAITEMTMP);
            register.setId(Cairo.Constants.NEW_ID);

            var fields = register.getFields();

            var _count = row.size();
            for(var _j = 0; _j < _count; _j++) {
              cell = row.item(_j);
              switch (cell.getKey()) {

                case KIT_DESCRIP:
                  fields.add(C.COBZI_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KIT_CUPON:
                  fields.add(C.COBZI_TMPCUPON, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KIT_TJC_ID:
                  fields.add(C.TJC_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KIT_TJCCU_ID:
                  fields.add(C.TJCCU_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KIT_MON_ID:
                  fields.add(C.MON_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KIT_FECHAVTO:
                  fields.add(C.COBZI_TMPFECHA_VTO, cell.getValue(), Cairo.Constants.Types.date);
                  break;

                case KIT_TITULAR:
                  fields.add(C.COBZI_TMPTITULAR, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KIT_NROTARJETA:
                  fields.add(C.COBZI_TMPNRO_TARJETA, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KIT_NROAUTORIZACION:
                  fields.add(C.COBZI_TMPAUTORIZACION, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KIT_TARJETA_TIPO:
                  fields.add(C.COBZI_TARJETA_TIPO, cell.getId(), Cairo.Constants.Types.long);
                  break;

                case KIT_IMPORTEORIGEN:
                  fields.add(C.COBZI_IMPORTE_ORIGEN, val(cell.getValue()), Cairo.Constants.Types.currency);
                  break;

                case KIT_IMPORTE:
                  fields.add(C.COBZI_IMPORTE, val(cell.getValue()), Cairo.Constants.Types.currency);
                  break;
              }
            }

            m_iOrden = m_iOrden + 1;
            fields.add(C.COBZI_ORDEN, m_iOrden, Cairo.Constants.Types.integer);
            fields.add(C.COBZI_TIPO, csECobranzaItemTipo.cSECOBZITTARJETA, Cairo.Constants.Types.integer);
            fields.add(C.COBZ_TMPID, id, Cairo.Constants.Types.id);
            fields.add(C.COBZI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);
            fields.add(C.COBZI_OTRO_TIPO, csEItemOtroTipo.cSEOTRODEBE, Cairo.Constants.Types.integer);

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

        var _count = getOtros().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getOtros().getRows().item(_i);

          i = i + 1;
          if(!pIsEmptyRowOtros(row, i)) {

            register = new cRegister();

            register.setFieldId(C.COBZI_TMPID);
            register.setTable(C.COBRANZAITEMTMP);
            register.setId(Cairo.Constants.NEW_ID);

            var fields = register.getFields();

            var _count = row.size();
            for(var _j = 0; _j < _count; _j++) {
              cell = row.item(_j);
              switch (cell.getKey()) {

                case KIO_DESCRIP:
                  fields.add(C.COBZI_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KIO_RET_ID:
                  fields.add(C.RET_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KIO_NRORETENCION:
                  fields.add(C.COBZI_NRO_RETENCION, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KIO_PORCRETENCION:
                  fields.add(C.COBZI_PORC_RETENCION, val(cell.getValue()), Cairo.Constants.Types.double);
                  break;

                case KIO_CCOS_ID:
                  fields.add(C.CCOS_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KIO_FV_ID_RET:
                  fields.add(C.FV_ID_RET, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KIO_CUE_ID:
                  fields.add(C.CUE_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KIO_FECHARETENCION:
                  if(!ValEmpty(cell.getValue(), Cairo.Constants.Types.date)) {
                    fields.add(C.COBZI_FECHA_RETENCION, cell.getValue(), Cairo.Constants.Types.date);
                  }
                  break;

                case KIO_IMPORTEORIGEN:
                  fields.add(C.COBZI_IMPORTE_ORIGEN, val(cell.getValue()), Cairo.Constants.Types.currency);
                  break;

                case KIO_DEBE:
                  if(val(cell.getValue()) !== 0) {
                    fields.add(C.COBZI_IMPORTE, val(cell.getValue()), Cairo.Constants.Types.currency);
                    fields.add(C.COBZI_OTRO_TIPO, csEItemOtroTipo.cSEOTRODEBE, Cairo.Constants.Types.integer);
                  }
                  break;

                case KIO_HABER:
                  if(val(cell.getValue()) !== 0) {
                    fields.add(C.COBZI_IMPORTE, val(cell.getValue()), Cairo.Constants.Types.currency);
                    fields.add(C.COBZI_OTRO_TIPO, csEItemOtroTipo.cSEOTROHABER, Cairo.Constants.Types.integer);
                  }
                  break;
              }
            }

            m_iOrden = m_iOrden + 1;
            fields.add(C.COBZI_ORDEN, m_iOrden, Cairo.Constants.Types.integer);
            fields.add(C.COBZI_TIPO, csECobranzaItemTipo.cSECOBZITOTROS, Cairo.Constants.Types.integer);
            fields.add(C.COBZ_TMPID, id, Cairo.Constants.Types.id);
            fields.add(C.COBZI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);

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

        var _count = getEfectivo().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getEfectivo().getRows().item(_i);

          i = i + 1;
          if(!pIsEmptyRowEfectivo(row, i)) {

            register = new cRegister();

            register.setFieldId(C.COBZI_TMPID);
            register.setTable(C.COBRANZAITEMTMP);
            register.setId(Cairo.Constants.NEW_ID);

            var fields = register.getFields();

            var _count = row.size();
            for(var _j = 0; _j < _count; _j++) {
              cell = row.item(_j);
              switch (cell.getKey()) {

                case KIE_DESCRIP:
                  fields.add(C.COBZI_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);
                  break;

                case KIE_CUE_ID:
                  fields.add(C.CUE_ID, cell.getId(), Cairo.Constants.Types.id);
                  break;

                case KIE_IMPORTEORIGEN:
                  fields.add(C.COBZI_IMPORTE_ORIGEN, val(cell.getValue()), Cairo.Constants.Types.currency);
                  break;

                case KIE_IMPORTE:
                  fields.add(C.COBZI_IMPORTE, val(cell.getValue()), Cairo.Constants.Types.currency);
                  break;
              }
            }

            m_iOrden = m_iOrden + 1;
            fields.add(C.COBZI_ORDEN, m_iOrden, Cairo.Constants.Types.integer);
            fields.add(C.COBZI_TIPO, csECobranzaItemTipo.cSECOBZITEFECTIVO, Cairo.Constants.Types.integer);
            fields.add(C.COBZ_TMPID, id, Cairo.Constants.Types.id);
            fields.add(C.COBZI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);
            fields.add(C.COBZI_OTRO_TIPO, csEItemOtroTipo.cSEOTRODEBE, Cairo.Constants.Types.integer);

            if(!Cairo.Database.save(register, , "pSaveEfectivo", C_MODULE, c_ErrorSave)) { return false; }
          }
        }

        return true;
      };

      var pSaveCtaCte = function(id) {
        var register = null;
        var row = null;
        var cell = null;

        var _count = getCtaCte().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getCtaCte().getRows().item(_i);

          register = new cRegister();

          register.setFieldId(C.COBZI_TMPID);
          register.setTable(C.COBRANZAITEMTMP);
          register.setId(Cairo.Constants.NEW_ID);

          var fields = register.getFields();

          var _count = row.size();
          for(var _j = 0; _j < _count; _j++) {
            cell = row.item(_j);
            switch (cell.getKey()) {

              case KICC_CUE_ID:
                fields.add(C.CUE_ID, cell.getId(), Cairo.Constants.Types.id);
                break;

              case KICC_IMPORTEORIGEN:
                fields.add(C.COBZI_IMPORTE_ORIGEN, val(cell.getValue()), Cairo.Constants.Types.currency);
                break;

              case KICC_IMPORTE:
                fields.add(C.COBZI_IMPORTE, val(cell.getValue()), Cairo.Constants.Types.currency);
                break;
            }
          }

          m_iOrden = m_iOrden + 1;
          fields.add(C.COBZI_ORDEN, m_iOrden, Cairo.Constants.Types.integer);
          fields.add(C.COBZI_TIPO, csECobranzaItemTipo.cSECOBZITCTA_CTE, Cairo.Constants.Types.integer);
          fields.add(C.COBZ_TMPID, id, Cairo.Constants.Types.id);
          fields.add(C.COBZI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);
          fields.add(C.COBZI_OTRO_TIPO, csEItemOtroTipo.cSEOTROHABER, Cairo.Constants.Types.integer);

          if(!Cairo.Database.save(register, , "pSaveCtaCte", C_MODULE, c_ErrorSave)) { return false; }
        }

        return true;
      };

      var pSaveDifCambio = function(id, aplicado) {
        var _rtn = null;
        if(getDefaultDifCambio().getListItemData() === CT.ModoDifCambio.cSEDIF_CAMBIOCUENTA) {
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

        deudaOrigen = getDeudaOrigen();
        cobrado = getCobrado();

        diferencia = Abs(deudaOrigen - cobrado);

        if(Cairo.Util.round(diferencia, 2) === 0) {
          _rtn = true;
          return _rtn;
        }

        cue_id = getCueIdDifCambio().getSelectId();

        if(cue_id === NO_ID) {
          MsgWarning(getText(2153, ""));
          //Debe configurar la cuenta de "Diferencia de Cambio" para que el sistema pueda contabilizar los importes cobrados.
          return _rtn;
        }

        register = new cRegister();

        register.setFieldId(C.COBZI_TMPID);
        register.setTable(C.COBRANZAITEMTMP);
        register.setId(Cairo.Constants.NEW_ID);

        var fields = register.getFields();

        fields.add(C.COBZI_DESCRIP, "Diferencia de cambio", Cairo.Constants.Types.text);
        fields.add(C.CUE_ID, cue_id, Cairo.Constants.Types.id);

        if(deudaOrigen > cobrado) {
          fields.add(C.COBZI_IMPORTE, deudaOrigen - cobrado, Cairo.Constants.Types.currency);
          fields.add(C.COBZI_OTRO_TIPO, csEItemOtroTipo.cSEOTRODEBE, Cairo.Constants.Types.integer);
        }
        else {
          fields.add(C.COBZI_IMPORTE, Abs(deudaOrigen - cobrado), Cairo.Constants.Types.currency);
          fields.add(C.COBZI_OTRO_TIPO, csEItemOtroTipo.cSEOTROHABER, Cairo.Constants.Types.integer);
        }

        m_iOrden = m_iOrden + 1;
        fields.add(C.COBZI_ORDEN, m_iOrden, Cairo.Constants.Types.integer);
        fields.add(C.COBZI_TIPO, csECobranzaItemTipo.cSECOBZITOTROS, Cairo.Constants.Types.integer);
        fields.add(C.COBZ_TMPID, id, Cairo.Constants.Types.id);
        fields.add(C.COBZI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);

        if(!Cairo.Database.save(register, , "pSaveOtros", C_MODULE, c_ErrorSave)) { return _rtn; }

        _rtn = true;

        return _rtn;
      };

      var pSaveDifCambioNCND = function(id, aplicado) {
        var _rtn = null;
        var cobrado = null;
        var deudaOrigen = null;
        var diferencia = null;
        var fvTMPId = null;

        deudaOrigen = getDeudaOrigen();
        cobrado = getCobrado();

        diferencia = Abs(deudaOrigen - cobrado);

        if(Cairo.Util.round(diferencia, 2) === 0) {
          _rtn = true;
          return _rtn;
        }

        // Nota de debito
        if(deudaOrigen < cobrado) {

          if(!pSaveDocVta(id, getNDDifCambio().getSelectId(), diferencia, true, fvTMPId)) { return _rtn; }

          // Agrego la nota de debito a la coleccion de
          // aplicaciones con la cobranza
          //
          if(!pSaveCobranzaND(id, fvTMPId, diferencia, aplicado)) { return _rtn; }

          // Nota de credito
        }
        else {

          if(!pSaveDocVta(id, getNCDifCambio().getSelectId(), diferencia, false, fvTMPId)) { return _rtn; }

          // Aplico la nota de credito con cada una de las
          // facturas que generaron diferencias de cambio
          //
          if(!pSaveFacturaVentaNotaCredito(fvTMPId, diferencia)) { return _rtn; }

        }

        _rtn = true;

        return _rtn;
      };

      var getNCNDDocNumber = function(docId) {
        var tl = null;
        var tAL_ID = null;
        var sqlstmt = null;
        var rs = null;
        var mask = null;
        var rtn = null;

        if(docId === NO_ID) {

          VBA.ex.Raise -1, , getText(2154, "");

          //"@@ERROR_SP:Debe configurar un documento " & _
          "para las notas de crédito/debito que se generan automaticamente.;;"(+ "Debe indicar estos documentos en el paso anterior para poder guardar esta cobranza.;;Utilize la opción [Configuracion\\Tesoreria\\General] en la solapa [Diferencia de Cambio] para indicar los documentos por defecto y evitará tener que indicarlos en cada cobranza.");

        }

        sqlstmt = "sp_clienteGetTalonario "+ getCliente().toString()+ ","+ docId.toString();
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return ""; }

        if(rs.isEOF()) {

          VBA.ex.Raise -1, , getText(2155, "");
          //@@ERROR_SP:No fue posible encontrar el talonario asociado al documento para notas de debito/crédito que se generan automaticamente.

        }

        tAL_ID = Cairo.Database.valField(rs.getFields(), 0);

        tl = new cTalonario();

        rtn = tl.GetNextNumber(tAL_ID, mask, false);
        if(LenB(mask)) { mask = mask.Substring(1, mask.length - rtn.length); }
        return mask+ rtn;
      };

      var pSaveDocVta = function(cobzTMPId, docId, diferencia, bIsND, fvTMPId) {
        var register = null;
        var neto = null;
        var ivaRi = null;
        var vIva() = null;
        var vItems() = null;

        if(!getIva(vIva)) { return false; }
        if(!getItems(vIva, vItems, diferencia, bIsND, neto, ivaRi)) { return false; }

        register = new cRegister();

        register.setFieldId(C.FV_TMPID);
        register.setTable(C.FACTURAVENTATMP);
        register.setId(Cairo.Constants.NEW_ID);

        var fields = register.getFields();

        fields.add(C.FV_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.long);
        fields.add(C.COBZ_TMPID, cobzTMPId, Cairo.Constants.Types.id);

        fields.add(C.FV_NUMERO, 0, Cairo.Constants.Types.long);
        fields.add(C.FV_NRODOC, getNCNDDocNumber(docId), Cairo.Constants.Types.text);

        fields.add(C.FV_DESCRIP, getDescripNDNC(), Cairo.Constants.Types.text);
        fields.add(C.FV_FECHA, getFechaNdNc().getValue(), Cairo.Constants.Types.date);
        fields.add(C.FV_FECHAENTREGA, getFecha().getValue(), Cairo.Constants.Types.date);
        fields.add(C.CLI_ID, getCliente(), Cairo.Constants.Types.id);
        fields.add(C.SUC_ID, getSucursal().getSelectId(), Cairo.Constants.Types.id);
        fields.add(C.DOC_ID, docId, Cairo.Constants.Types.id);
        fields.add(C.CPG_ID, csECpgTipo.cSECPGT_FECHADOCUMENTO, Cairo.Constants.Types.id);
        fields.add(C.LGJ_ID, getLegajo().getSelectId(), Cairo.Constants.Types.id);

        fields.add(C.FV_NETO, neto, Cairo.Constants.Types.currency);
        fields.add(C.FV_SUBTOTAL, neto, Cairo.Constants.Types.currency);
        fields.add(C.FV_IVARI, ivaRi, Cairo.Constants.Types.currency);

        fields.add(C.FV_TOTAL, neto + ivaRi, Cairo.Constants.Types.currency);
        fields.add(C.FV_GRABAR_ASIENTO, 1, Cairo.Constants.Types.boolean);
        fields.add(Cairo.Constants.EST_ID, CSGeneralEx2.csEEstado.cSEEST_PENDIENTE, Cairo.Constants.Types.id);

        var c_ErrorSave = null;

        if(bIsND) {
            c_ErrorSave = getText(2156, ""); //  Error al grabar la Nota de Débito
        }
        else {
            c_ErrorSave = getText(2157, ""); //  Error al grabar la Nota de Crédito
        }

        if(!register.beginTrans(Cairo.Database)) { return false; }

        if(!Cairo.Database.save(register, , "cIABMClient_Save", C_MODULE, c_ErrorSave)) { return false; }

        if(!pSaveItemsNCND(register.getId(), vItems[], c_ErrorSave)) { return false; }
        if(!register.commitTrans()) { return false; }

        fvTMPId = register.getId();

        return true;
      };

      var pSaveItemsNCND = function(id, vItems, strError) {
        var transaction = new Cairo.Database.Transaction();
        var iOrden = null;
        var pR_ID = null;
        var cue_id = null;
        var cue_id_ivari = null;

        var register = new Cairo.Database.Register();

        var fields = register.getFields();
        register.setFieldId(C.FVI_TMPID);
        register.setTable(C.FACTURAVENTAITEMTMP);

        pR_ID = getPrIdDifCambio().getSelectId();
        if(!getCuentas(pR_ID, cue_id, cue_id_ivari)) { return false; }

        for(iOrden = 1; iOrden <= vItems.length; iOrden++) {
          fields.add(C.FVI_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.integer);
          fields.add(C.FVI_CANTIDAD, 1, Cairo.Constants.Types.double);
          fields.add(C.FVI_PRECIO, vItems.importe, Cairo.Constants.Types.currency);
          fields.add(C.FVI_PRECIO_USR, vItems.importe, Cairo.Constants.Types.currency);
          fields.add(C.FVI_NETO, vItems.importe, Cairo.Constants.Types.currency);
          fields.add(C.FVI_IVARI, vItems.ImporteIva, Cairo.Constants.Types.currency);
          fields.add(C.FVI_IVARIPORC, vItems.TasaIva, Cairo.Constants.Types.double);
          fields.add(C.PR_ID, pR_ID, Cairo.Constants.Types.id);
          fields.add(C.FVI_IMPORTE, vItems.importe + vItems.ImporteIva, Cairo.Constants.Types.currency);
          fields.add(C.CUE_ID, cue_id, Cairo.Constants.Types.id);
          fields.add(C.CUE_ID_IVA_RI, cue_id_ivari, Cairo.Constants.Types.id);
          fields.add(C.FVI_ORDEN, iOrden, Cairo.Constants.Types.integer);
          fields.add(C.FV_TMPID, id, Cairo.Constants.Types.id);

          register.setId(Cairo.Constants.NEW_ID);

          var w_var fields = register.getFields();

          transaction.addRegister(register);

          register.getFields().clear();

        }

        mainTransaction.addTransaction(transaction);

        return true;
      };

      var getItems = function(vIva, vItems, diferencia, bIsND, neto, totalIva) {
        var i = null;
        var iva = null;
        var base = null;
        var modoIva = null;
        var importe = null;
        var importeIva = null;

        G.redim(vItems, vIva.length);
        modoIva = getModoIvaDifCambio().getListItemData();

        neto = 0;
        totalIva = 0;

        for(i = 1; i <= vIva.length; i++) {
          iva = iva + vIva(i).importe;
        }

        // Solo voy hasta el anteultimo
        // El ultimo me lo reservo para liquidar lo
        // que quede de la diferencia y me evito problemas
        // de redondeo
        for(i = 1; i <= vIva.length - 1; i++) {

          // Porcentaje del Neto imponible para cada tasa de iva
          base = diferencia * DivideByCero(vIva(i).importe, iva);

          // Si hay que usar el iva como base imponible y se trata
          // de una nota de debito
          if(modoIva === CT.ModoIvaDifCambio.DIF_IVA_IMPONIBLE && bIsND) {
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
        if((diferencia !== neto && modoIva === CT.ModoIvaDifCambio.DIF_IVA_IMPONIBLE && bIsND) || (diferencia !== neto + importeIva && (modoIva === CT.ModoIvaDifCambio.cSEDIFIVANOIMPONIBLE || !bIsND))) {

          i = vIva.length;

          if(modoIva === CT.ModoIvaDifCambio.DIF_IVA_IMPONIBLE && bIsND) {
            // Porcentaje del Neto imponible para cada tasa de iva
            base = diferencia - neto;

              } // (ModoIva = csEDifIvaNoImponible Or Not bIsND)
          else {
            base = diferencia - neto - totalIva;
          }

          // Si hay que usar el iva como base imponible y se trata
          // de una nota de debito
          if(modoIva === CT.ModoIvaDifCambio.DIF_IVA_IMPONIBLE && bIsND) {
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

      var getIva = function(vIva) {
        var sqlstmt = null;
        var rs = null;
        var fvIds = null;
        var i = null;

        G.redim(vIva, 0);

        fvIds = getFvIds();
        sqlstmt = "select fvi_ivariporc, sum(fvi_ivari) as fvi_ivari from FacturaVentaItem where fv_id in("+ fvIds+ ") group by fvi_ivariporc  order by fvi_ivariporc desc";

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }

        if(!rs.isEOF()) {
          rs.MoveLast;
          rs.MoveFirst;
          G.redim(vIva, rs.RecordCount);
        }

        while (!rs.isEOF()) {
          i = i + 1;
          vIva.importe = Cairo.Database.valField(rs.getFields(), C.FVI_IVARI);
          vIva.porcentaje = Cairo.Database.valField(rs.getFields(), C.FVI_IVARIPORC);
          rs.MoveNext;
        }
        return true;
      };

      var getFvIds = function() {
        var rtn = null;
        var row = null;

        var _count = getFacturas().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getFacturas().getRows().item(_i);
          if(getCell(row, KI_SELECT).getId()) {
            if(val(getCell(row, KI_APLICAR).getValue())) {
              rtn = rtn+ getCell(row, KI_FV_ID).getId().toString()+ ",";
            }
          }
        }

        return RemoveLastColon(rtn);
      };

      // Proposito: Vincula la nota de debito por dif. de cambio con la cobranza
      //
      var pSaveCobranzaND = function(id, fvTMPId, importe, aplicado) {

        var aplicar = null;

        // Vemos cuanta guita queda sin aplicar
        //
        aplicar = val(getCobroTotal().getValue()) - aplicado;

        //
        // Solo aplicamos si queda algo de guita
        //
        if(aplicar > 0) {

          if(importe > aplicar) {
            importe = aplicar;
          }

          var register = null;

          register = new cRegister();

          register.setFieldId(C.FV_COBZ_TMPID);
          register.setTable(C.FACTURAVENTACOBRANZATMP);
          register.setId(Cairo.Constants.NEW_ID);

          var fields = register.getFields();

            fields.add(C.FV_ID, fvTMPId * -1, Cairo.Constants.Types.id); //  Indica que se trata de una ND aun
          // no generada el sp_DocCobranzaSave
          // Graba la ND y luego la vincula con
          // la cobranza
          //
            fields.add(C.FVD_ID, -1, Cairo.Constants.Types.id); //  Indica que la deuda sera generada
          // por el sp_DocCobranzaSave
          //

          fields.add(C.FV_COBZ_IMPORTE, importe, Cairo.Constants.Types.double);
          fields.add(C.FV_COBZ_ID, 0, Cairo.Constants.Types.long);
          fields.add(C.COBZ_TMPID, id, Cairo.Constants.Types.id);
          fields.add(C.COBZ_ID, 0, Cairo.Constants.Types.long);

          if(!Cairo.Database.save(register, , "pSaveCobranzaND", C_MODULE, c_ErrorSave)) { return false; }

        }

        return true;
      };

      // Proposito: Vincular la nota de credito por dif. de cambio con las facturas de
      //            esta cobranza
      var pSaveFacturaVentaNotaCredito = function(fvTMPId, importe) {
        var row = null;
        var aCobrar = null;
        var cobrado = null;
        var diferencia = null;

        // Por cada factura con diferencia de cambio
        // aplico contra esta nota de credito
        var _count = getFacturas().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getFacturas().getRows().item(_i);

          if(getCell(row, KI_MONEDA).getId() !== m_defaultCurrency.id) {

            cobrado = val(getCell(row, KI_APLICAR).getValue());
            // (Cobrado dividido la cotizacion a la que estoy cobrando) por la cotizacion de la factura

            aCobrar = DivideByCero(cobrado, val(getCell(row, KI_COTIZACION2).getValue())) * val(getCell(row, KI_COTIZACION).getValue());

            diferencia = aCobrar - cobrado;
            if(importe < diferencia) { diferencia = importe; }

            if(!pSaveFVNCAux(fvTMPId, getCell(row, KI_FV_ID).getId(), getCell(row, KI_FVD_ID).getId(), diferencia)) { return false; }

            importe = importe - diferencia;

            if(importe <= 0) { break; }
          }
        }

        return true;
      };

      var pSaveFVNCAux = function(fvTMPId, fvIdFactura, fvdIdFactura, importe) {
        var register = null;

        register = new cRegister();

        register.setFieldId(C.FV_NC_TMPID);
        register.setTable(C.FACTURAVENTANOTACREDITOTMP);
        register.setId(Cairo.Constants.NEW_ID);

        var fields = register.getFields();

        fields.add(C.FV_TMPID, fvTMPId, Cairo.Constants.Types.id);

        // Indica que se trata de una NC aun
        // no generada el sp_DocCobranzaSave
        // Graba la NC y luego la vincula con
        // las facturas
        //
        fields.add(C.FV_ID_NOTA_CREDITO, fvTMPId * -1, Cairo.Constants.Types.id);

        // Indica que la deuda sera generada
        // por el sp_DocCobranzaSave
        //
        fields.add(C.FVD_ID_NOTA_CREDITO, -1, Cairo.Constants.Types.id);

        fields.add(C.FV_ID_FACTURA, fvIdFactura, Cairo.Constants.Types.id);
        fields.add(C.FVD_ID_FACTURA, fvdIdFactura, Cairo.Constants.Types.id);
        fields.add(C.FV_NC_IMPORTE, importe, Cairo.Constants.Types.double);
        fields.add(C.FV_NC_ID, 0, Cairo.Constants.Types.long);

        if(!Cairo.Database.save(register, , "pSaveFVNCAux", C_MODULE, c_ErrorSave)) { return false; }

        return true;
      };

      var getCuentas = function(pR_ID, cue_id, cue_id_ivari) {
        var sqlstmt = null;
        var rs = null;
        var ti_id = null;
        var cueg_id = null;

        sqlstmt = "select cueg_id_venta, ti_id_ivariventa from producto where pr_id = "+ pR_ID.toString();
        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }
        if(!rs.isEOF()) {
          cueg_id = Cairo.Database.valField(rs.getFields(), "cueg_id_venta");
          ti_id = Cairo.Database.valField(rs.getFields(), C.PR_TI_ID_RI_VENTA);

          sqlstmt = "select cue_id from ClienteCuentaGrupo where cli_id = "+ getCliente().toString()+ " and cueg_id = "+ cueg_id.toString();
          if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }
          if(!rs.isEOF()) {
            cue_id = Cairo.Database.valField(rs.getFields(), C.CUE_ID);
          }
          else {
            sqlstmt = "select cue_id from CuentaGrupo where cueg_id = "+ cueg_id.toString();
            if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }
            if(!rs.isEOF()) {
              cue_id = Cairo.Database.valField(rs.getFields(), C.CUE_ID);
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
        if(!rs.isEOF()) { cue_id_ivari = Cairo.Database.valField(rs.getFields(), C.CUE_ID); }

        return true;
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

      // Edit From ListDoc
      //
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
        // (ByRef Grid As cIABMGrid)
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

        var w_getClienteProperty = getClienteProperty();
        w_getClienteProperty.setSelectId(m_cliIdDoc);
        w_getClienteProperty.setValue(m_clienteDoc);

        var w_getCliente2 = getCliente2();
        w_getCliente2.setSelectId(m_cliIdDoc);
        w_getCliente2.setValue(m_clienteDoc);

        var w_getComprobante = getComprobante();
        w_getComprobante.setValue("");
        w_getComprobante.setTextMask("");
        var w_getCentroCosto = getCentroCosto();
        w_getCentroCosto.setSelectId(NO_ID);
        w_getCentroCosto.setValue("");
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
        var facturas = null;
        var cobranza = null;

        var row = null;
        var total = null;

        var _count = getFacturas().getRows().size();
        for(var _i = 0; _i < _count; _i++) {
          row = getFacturas().getRows().item(_i);
          if(val(getCell(row, KI_APLICAR).getValue())) {
            facturas = facturas+ getCell(row, KI_NRODOC).getValue()+ ",";
          }
        }

        facturas = RemoveLastColon(facturas);
        cobranza = getComprobante().getValue();

        return NC_ND_DESCRIP_DIF_CAMBIO+ "\\r\\n\\r\\n"+ getText(2483, "", cobranza, facturas);
      };

      var setDatosFromAplic = function() {
        var sqlstmt = null;
        var rs = null;
        var i = null;

        sqlstmt = "sp_DocCobranzaGetDataFromAplic 1,'"+ getFvIds()+ "'";

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return; }

        if(rs.isEOF()) { return; }

        var iProp = null;

        while (!rs.isEOF()) {

          iProp = getSucursal();
          if(iProp.getSelectId() === NO_ID && Cairo.Database.valField(rs.getFields(), C.SUC_ID) !== NO_ID) {

            iProp.setSelectId(Cairo.Database.valField(rs.getFields(), C.SUC_ID));
            iProp.setValue(Cairo.Database.valField(rs.getFields(), C.SUC_NAME));
            m_objWizard.showValue(iProp);
          }

          iProp = getCentroCosto();
          if(iProp.getSelectId() === NO_ID && Cairo.Database.valField(rs.getFields(), C.CCOS_ID) !== NO_ID) {

            iProp.setSelectId(Cairo.Database.valField(rs.getFields(), C.CCOS_ID));
            iProp.setValue(Cairo.Database.valField(rs.getFields(), C.CCOS_NAME));
            m_objWizard.showValue(iProp);
          }

          iProp = getLegajo();
          if(iProp.getSelectId() === NO_ID && Cairo.Database.valField(rs.getFields(), C.LGJ_ID) !== NO_ID) {

            iProp.setSelectId(Cairo.Database.valField(rs.getFields(), C.LGJ_ID));
            iProp.setValue(Cairo.Database.valField(rs.getFields(), C.LGJ_TITULO));
            m_objWizard.showValue(iProp);
          }

          rs.MoveNext;
        }
      };

      var setFilterColFactura = function() {

        var wizObj = null;
        var abmObj = null;

        wizObj = m_objWizard;
        abmObj = wizObj.getDialog();

        D.getCol(getOtros().getColumns(), KIO_FV_ID_RET).getHelpFilter() === "cli.cli_id = "+ getCliente().toString();
        abmObj.RefreshColumnProperties(getOtrosProperty(), C.FV_ID_RET);

      };

      var refreshLabelPagos = function() {
        var iProp = null;
        iProp = getLabelCobros();
        iProp.setValue(LABEL_COBROS_TEXT + " - " + getClienteProperty().getValue());
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
        for(var _i = 0; _i < _count; _i++) {
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
          var w_getEfectivo = getEfectivo().getRows().add(null);

          w_getEfectivo.Add(null);

          //*TODO:** can't found type for with block
          //*With .Object.add(null)
          var elem = w_getEfectivo.Add(null);
          elem.setValue(m_cobranzaInfo.getCuentaEfectivo());
          elem.setId(m_cobranzaInfo.getCueIdEfectivo());
          elem.setKey(KIE_CUE_ID);

          D.getCurrencyFromAccount(monId, moneda, m_cobranzaInfo.getCueIdEfectivo());

          //*TODO:** can't found type for with block
          //*With .Object.add(null)
          var elem = w_getEfectivo.Add(null);
          elem.setValue(moneda);
          elem.setId(monId);
          elem.setKey(KIE_MON_ID);

          //*TODO:** can't found type for with block
          //*With .Object.add(null)
          var elem = w_getEfectivo.Add(null);
          if(monId !== m_defaultCurrency.id) {
            elem.setValue(efectivo);
          }
          else {
            elem.setValue(0);
          }
          elem.setKey(KIE_IMPORTEORIGEN);

          //*TODO:** can't found type for with block
          //*With .Object.add(null)
          var elem = w_getEfectivo.Add(null);
          if(monId !== m_defaultCurrency.id) {
            elem.setValue(efectivo * val(getCotizacion().getValue()));
          }
          else {
            elem.setValue(efectivo);
          }
          elem.setKey(KIE_IMPORTE);

          //*TODO:** can't found type for with block
          //*With .Object.add(null)
          var elem = w_getEfectivo.Add(null);
          elem.setValue("");
          elem.setKey(KIE_DESCRIP);

        }

        if(tickets !== 0) {

          var w_getEfectivo = getEfectivo().getRows().add(null);

          w_getEfectivo.Add(null);

          //*TODO:** can't found type for with block
          //*With .Object.add(null)
          var elem = w_getEfectivo.Add(null);
          elem.setValue(m_cobranzaInfo.getCuentaTicket());
          elem.setId(m_cobranzaInfo.getCueIdTicket());
          elem.setKey(KIE_CUE_ID);

          D.getCurrencyFromAccount(monId, moneda, m_cobranzaInfo.getCueIdTicket());

          //*TODO:** can't found type for with block
          //*With .Object.add(null)
          var elem = w_getEfectivo.Add(null);
          elem.setValue(moneda);
          elem.setId(monId);
          elem.setKey(KIE_MON_ID);

          //*TODO:** can't found type for with block
          //*With .Object.add(null)
          var elem = w_getEfectivo.Add(null);
          if(monId !== m_defaultCurrency.id) {
            elem.setValue(tickets);
          }
          else {
            elem.setValue(0);
          }
          elem.setKey(KIE_IMPORTEORIGEN);

          //*TODO:** can't found type for with block
          //*With .Object.add(null)
          var elem = w_getEfectivo.Add(null);
          if(monId !== m_defaultCurrency.id) {
            elem.setValue(tickets * val(getCotizacion().getValue()));
          }
          else {
            elem.setValue(tickets);
          }
          elem.setKey(KIE_IMPORTE);

          //*TODO:** can't found type for with block
          //*With .Object.add(null)
          var elem = w_getEfectivo.Add(null);
          elem.setValue("");
          elem.setKey(KIE_DESCRIP);

        }

        if(efectivo !== 0 || tickets !== 0) {

          refreshEfectivo();

          showCobroNeto();
          showCobroOtro();
          showCobroTotal();

        }

      };

      var refreshEfectivo = function() {
        m_objWizard.showValue(D.getWizProperty(m_objWizard, WCS.SELECT_COBROS, DWC.EFECTIVO));
      };

      var loadCajaForUsuario = function(property) {
        var msg = null;

        if(!Cairo.Database.openRs(sqlstmt, rs)) { return false; }
        if(response.success !== true) { return false; }

        if(response.data.id === NO_ID) {

          msg = Cairo.Database.valField(m_data.cajaForUsuario[_i], "warning");
          if(LenB(msg)) {
            MsgWarning(msg);
            return null;
          }

          m_cjId = Cairo.Database.valField(m_data.cajaForUsuario[_i], C.CJ_ID);

          return true;

        };


        return self;
      };

      Edit.Controller = { getEditor: createObject };

    });

  }());
