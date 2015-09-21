(function() {
  "use strict";

  var createObject = function() {

    var self = {};

    var getText = Cairo.Language.getText;

    var Dialogs = Cairo.Dialogs;
    var val = Cairo.Util.val;
    var getCell = Dialogs.cell;
    var cellFloat = Dialogs.cellFloat;

    var valEmpty = Cairo.Util.valEmpty;
    var zeroDiv = Cairo.Util.zeroDiv;

    var C = Cairo.General.Constants;
    var CV = Cairo.Ventas.Constants;
    var Types = Cairo.Constants.Types;
    var NO_ID = Cairo.Constants.NO_ID;

    var KI_CCOS_ID = 22;
    var KIP_IMPORTE = 1;
    var KIP_PERC_ID = 2;
    var KIP_PORCENTAJE = 3;
    var KIP_BASE = 4;
    var KIP_DESCRIP = 5;
    var KIP_FVPERC_ID = 7;

    self.KI_CCOS_ID = KI_CCOS_ID;
    self.KIP_IMPORTE = KIP_IMPORTE;
    self.KIP_PERC_ID = KIP_PERC_ID;
    self.KIP_PORCENTAJE = KIP_PORCENTAJE;
    self.KIP_BASE = KIP_BASE;
    self.KIP_DESCRIP = KIP_DESCRIP;
    self.KIP_FVPERC_ID = KIP_FVPERC_ID;

    self.BaseType = {
      NETO: 1,
      NETO_GRAVADO: 2,
      TOTAL: 3
    };

    self.loadPercepciones = function(grid, grlCfg) {

      var w_columns = grid.getColumns();
      var elem = w_columns.add(null);
      elem.setVisible(false);
      elem.setKey(KIP_FVPERC_ID);

      var elem = w_columns.add(null);
      elem.setName(getText(1252, "")); // Percepcion
      elem.setType(Dialogs.PropertyType.select);
      elem.setSelectTable(Cairo.Tables.PERCEPCION);
      elem.setKey(KIP_PERC_ID);

      var elem = w_columns.add(null);
      elem.setName(getText(2546, "")); // Base Imponible
      elem.setType(Dialogs.PropertyType.numeric);
      elem.setSubType(Dialogs.PropertySubType.money);
      elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
      elem.setKey(KIP_BASE);

      var elem = w_columns.add(null);
      elem.setName(getText(1105, "")); // Porcentaje
      elem.setType(Dialogs.PropertyType.numeric);
      elem.setSubType(Dialogs.PropertySubType.percentage);
      elem.setKey(KIP_PORCENTAJE);

      var elem = w_columns.add(null);
      elem.setName(getText(1228, "")); // Importe
      elem.setType(Dialogs.PropertyType.numeric);
      elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
      elem.setSubType(Dialogs.PropertySubType.money);
      elem.setKey(KIP_IMPORTE);

      var elem = w_columns.add(null);
      elem.setName(getText(1861, "")); // Observaciones
      elem.setType(Dialogs.PropertyType.text);
      elem.setKey(KIP_DESCRIP);

      var elem = w_columns.add(null);
      elem.setName(getText(1057, "")); // Centro de Costo
      elem.setType(Dialogs.PropertyType.select);
      elem.setSelectTable(Cairo.Tables.CENTROS_DE_COSTO);
      elem.setKey(KI_CCOS_ID);
    };

    self.validateRowPercepciones = function(row, rowIndex) {

      var strRow = " (Fila "+ rowIndex.toString()+ ")";

      var _count = row.size();
      for(var _i = 0; _i < _count; _i++) {

        var cell = row.item(_i);

        switch (cell.getKey()) {

          case KIP_PERC_ID:
            if(valEmpty(cell.getId(), Types.id)) {
              return Cairo.Modal.showInfoWithFalse(getText(1535, "", strRow)); // Debe indicar una percepcion
            }
            break;

          case KIP_BASE:
            if(valEmpty(cell.getValue(), Types.currency)) {
              return Cairo.Modal.showInfoWithFalse(getText(2547, "", strRow)); // Debe indicar una base imponible
            }
            break;

          case KIP_PORCENTAJE:
            if(valEmpty(cell.getValue(), Types.currency)) {
              return Cairo.Modal.showInfoWithFalse(getText(1098, "", strRow)); // Debe indicar un porcentaje
            }
            break;

          case KIP_IMPORTE:
            if(valEmpty(cell.getValue(), Types.currency)) {
              return Cairo.Modal.showInfoWithFalse(getText(1897, "", strRow)); // Debe indicar un importe
            }
            break;
        }
      }

      return Cairo.Promises.resolvedPromise(true);
    };

    self.isEmptyRowPercepciones = function(row, rowIndex) {
      var bRowIsEmpty = true;

      var _count = row.size();
      for(var _i = 0; _i < _count; _i++) {

        var cell = row.item(_i);

        switch (cell.getKey()) {

          case KIP_IMPORTE:
            if(!valEmpty(cell.getValue(), Types.currency)) {
              bRowIsEmpty = false;
              break;
            }
            break;

          case KIP_PERC_ID:
            if(!valEmpty(cell.getId(), Types.id)) {
              bRowIsEmpty = false;
              break;
            }
            break;

          case KIP_PORCENTAJE:
            if(!valEmpty(cell.getValue(), Types.double)) {
              bRowIsEmpty = false;
              break;
            }
            break;

          case KIP_BASE:
            if(!valEmpty(cell.getValue(), Types.currency)) {
              bRowIsEmpty = false;
              break;
            }
            break;
        }
      }

      return bRowIsEmpty;
    };

    self.percepcionShowTotales = function(rows, property) {
      var percep = 0;

      var _count = rows.size();
      for(var _i = 0; _i < _count; _i++) {
        var row = rows.item(_i);
        percep += val(getCell(row, KIP_IMPORTE).getValue());
      }

      property.setValue(percep);
    };

    self.columnAfterEditPercepciones = function(property, lRow, lCol, newValue, newValueId) {

      var grid = property.getGrid();
      var columns = grid.getColumns().item(lCol);

      switch (columns.getKey()) {

        case KIP_BASE:
          var row = grid.getRows().item(lRow);
          var cell = getCell(row, KIP_BASE);
          if(val(newValue) < 0) {
            cell.setValue(0);
          }
          else if(val(newValue) > 0) {
            getCell(row, KIP_IMPORTE).setValue((newValue * val(getCell(row, KIP_PORCENTAJE).getValue())) / 100);
          }
          break;

        case KIP_IMPORTE:
          var row = grid.getRows().item(lRow);
          var cell = getCell(row, KIP_IMPORTE);
          if(val(newValue) < 0) {
            cell.setValue(0);
          }
          else if(val(newValue) > 0) {
            var percent = null;
            percent = val(getCell(row, KIP_PORCENTAJE).getValue());
            if(percent === 0) {
              percent = 1;
              getCell(row, KIP_PORCENTAJE).setValue(1);
            }
            getCell(row, KIP_BASE).setValue(zeroDiv(newValue, percent) * 100);
          }
          break;

        case KIP_PORCENTAJE:
          var row = grid.getRows().item(lRow);
          var cell = getCell(row, KIP_PORCENTAJE);
          if(val(newValue) < 0) {
            cell.setValue(0);
          }
          else if(val(newValue) > 0) {
            getCell(row, KIP_IMPORTE).setValue((val(getCell(row, KIP_BASE).getValue()) * newValue) / 100);
          }
          break;
      }

      return Cairo.Promises.resolvedPromise(true);
    };

    self.savePercepciones = function(
      mainRegister, property, cotizacion, isDefaultCurrency, isCopy, deleted, fvId, module) {

      var transaction = Cairo.Database.createTransaction();
      transaction.setTable(CV.FACTURA_VENTA_PERCEPCION_TMP);
      var orden = 0;
      var origen = 0;
      var rows = property.getGrid().getRows()

      for(var _i = 0, _count = rows.size(); _i < _count; _i++) {

        var row = rows.item(_i);

        var register = new Cairo.Database.Register();
        var fields = register.getFields();
        register.setFieldId(CV.FVPERC_TMP_ID);
        register.setId(Cairo.Constants.NEW_ID);

        for(var _j = 0, _countj = row.size(); _j < _countj; _j++) {

          var cell = row.item(_j);

          switch (cell.getKey()) {

            case KIP_FVPERC_ID:
              if(isCopy) {
                fields.add(CV.FVPERC_ID, Cairo.Constants.NEW_ID, Types.integer);
              }
              else {
                fields.add(CV.FVPERC_ID, val(cell.getValue()), Types.integer);
              }
              break;

            case KIP_PERC_ID:
              fields.add(C.PERC_ID, cell.getId(), Types.id);
              break;

            case KIP_BASE:
              fields.add(CV.FVPERC_BASE, val(cell.getValue()), Types.currency);
              break;

            case KIP_PORCENTAJE:
              fields.add(CV.FVPERC_PORCENTAJE, val(cell.getValue()), Types.currency);
              break;

            case KIP_IMPORTE:
              origen = val(cell.getValue());
              fields.add(CV.FVPERC_IMPORTE, origen * cotizacion, Types.currency);
              break;

            case KI_CCOS_ID:
              fields.add(C.CCOS_ID, cell.getId(), Types.id);
              break;

            case KIP_DESCRIP:
              fields.add(CV.FVPERC_DESCRIP, cell.getValue(), Types.text);
              break;
          }
        }

        if(isDefaultCurrency) {
          fields.add(CV.FVPERC_ORIGEN, 0, Types.currency);
        }
        else {
          fields.add(CV.FVPERC_ORIGEN, origen, Types.currency);
        }

        orden = orden + 1;
        fields.add(CV.FVPERC_ORDEN, orden, Types.integer);

        transaction.addRegister(register);
      }

      if(deleted !== "" && fvId !== NO_ID && !isCopy) {

        transaction.setDeletedList(deleted);
      }

      mainRegister.addTransaction(transaction);

      return true;
    };

    self.calcularPercepciones = function(
      docSinPerc, percepciones, items, property, dialog,
      KI_IVA_RI, KI_NETO, KI_IMPORTE) {

      if(docSinPerc) { return; }

      var rows = property.getGrid().getRows();

      var percepcionesDeleted = "";

      for(var _i = 0, _count = rows.size(); _i < _count; _i++) {
        var percId = cellFloat(rows.item(_i), self.KIP_FVPERC_ID);
        if(percId) {
          percepcionesDeleted = percepcionesDeleted + percId.toString() + ",";
        }
      }

      var itemRows = items.getGrid().getRows();

      for(var i = 0, _count = percepciones.length; i < _count; i++) {

        percepciones[i].base = 0;

        for(var _j = 0, _countj = itemRows.size(); _j < _countj; _j++) {

          switch (percepciones[i].tipoBase) {
            case self.BaseType.NETO:
              percepciones[i].base = percepciones[i].base + cellFloat(itemRows[i], KI_NETO);
              break;

            case self.BaseType.NETO_GRAVADO:
              if(cellFloat(itemRows[i], KI_IVA_RI) !== 0) {
                percepciones[i].base = percepciones[i].base + cellFloat(itemRows[i], KI_NETO);
              }
              break;

            case self.BaseType.TOTAL:
              percepciones[i].base = percepciones[i].base + cellFloat(itemRows[i], KI_IMPORTE);
              break;
          }
        }

        if(percepciones[i].base > percepciones[i].minimo) {

          if(percepciones[i].base >= percepciones[i].desde && percepciones[i].base <= percepciones[i].hasta) {

            percepciones[i].percepcion = percepciones[i].base * percepciones[i].porc / 100 + percepciones[i].fijo;
          }
        }

      }

      rows.clear();

      for(var i = 0, _count = percepciones.length; i < _count; i++) {

        if(percepciones[i].percepcion > 0) {

          var row = rows.add(null);

          row.add(null)
          .setValue(0)
          .setKey(self.KIP_FVPERC_ID);

          row.add(null)
          .setValue(percepciones[i].name)
          .setId(percepciones[i].percId)
          .setKey(self.KIP_PERC_ID);

          row.add(null)
          .setValue(percepciones[i].base)
          .setKey(self.KIP_BASE);

          row.add(null)
          .setValue(percepciones[i].porc)
          .setKey(self.KIP_PORCENTAJE);

          row.add(null)
          .setValue(percepciones[i].percepcion)
          .setKey(self.KIP_IMPORTE);

          row.add(null)
          .setValue("")
          .setKey(self.KIP_DESCRIP);

          row.add(null)
          .setValue("")
          .setId(NO_ID)
          .setKey(self.KI_CCOS_ID);

        }
      }

      dialog.showValue(property, true);
    };

    return self;
  };

  Cairo.Ventas.Percepciones = createObject();

}());