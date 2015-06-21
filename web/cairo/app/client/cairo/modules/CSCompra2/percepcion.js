(function() {
  "use strict";

  var createObject = function() {

    var self = {};

    var Dialogs = Cairo.Dialogs;
    var val = Cairo.Util.val;
    var getCell = Dialogs.cell;

    var valEmpty = Cairo.Util.valEmpty;
    var zeroDiv = Cairo.Util.zeroDiv;

    var CC = Cairo.Compras.Constants;

    var KI_CCOS_ID = 22;
    var KIP_IMPORTE = 1;
    var KIP_PERC_ID = 2;
    var KIP_PORCENTAJE = 3;
    var KIP_BASE = 4;
    var KIP_DESCRIP = 5;
    var KIP_FCPERC_ID = 7;

    self.KI_CCOS_ID = KI_CCOS_ID;
    self.KIP_IMPORTE = KIP_IMPORTE;
    self.KIP_PERC_ID = KIP_PERC_ID;
    self.KIP_PORCENTAJE = KIP_PORCENTAJE;
    self.KIP_BASE = KIP_BASE;
    self.KIP_DESCRIP = KIP_DESCRIP;
    self.KIP_FCPERC_ID = KIP_FCPERC_ID;
    
    self.loadPercepciones = function(grid, grlCfg) {

      var w_columns = grid.getColumns();
      var elem = w_columns.add(null);
      elem.setVisible(false);
      elem.setKey(KIP_FCPERC_ID);

      var elem = w_columns.add(null);
      elem.setName(Cairo.Language.getText(1252, "")); //'Percepcion
      elem.setType(Dialogs.PropertyType.select);
      elem.setSelectTable(Cairo.Tables.PERCEPCION);
      elem.setKey(KIP_PERC_ID);

      var elem = w_columns.add(null);
      elem.setName(Cairo.Language.getText(2546, "")); //'Base Imponible
      elem.setType(Dialogs.PropertyType.numeric);
      elem.setSubType(Dialogs.PropertySubType.money);
      elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
      elem.setKey(KIP_BASE);

      var elem = w_columns.add(null);
      elem.setName(Cairo.Language.getText(1105, "")); //'Porcentaje
      elem.setType(Dialogs.PropertyType.numeric);
      elem.setSubType(Dialogs.PropertySubType.percentage);
      elem.setKey(KIP_PORCENTAJE);

      var elem = w_columns.add(null);
      elem.setName(Cairo.Language.getText(1228, "")); //'Importe
      elem.setType(Dialogs.PropertyType.numeric);
      elem.setFormat(Cairo.Settings.getAmountDecimalsFormat());
      elem.setSubType(Dialogs.PropertySubType.money);
      elem.setKey(KIP_IMPORTE);

      var elem = w_columns.add(null);
      elem.setName(Cairo.Language.getText(1861, "")); //'Observaciones
      elem.setType(Dialogs.PropertyType.text);
      elem.setKey(KIP_DESCRIP);

      var elem = w_columns.add(null);
      elem.setName(Cairo.Language.getText(1057, "")); //'Centro de Costo
      elem.setType(Dialogs.PropertyType.select);
      elem.setSelectTable(Cairo.Tables.CENTROS_DE_COSTO);
      elem.setKey(KI_CCOS_ID);
    };

    self.validateRowPercepciones = function(row, rowIndex) {

      var strRow = " (Fila "+ rowIndex.toString()+ ")";

      var _count = row.size();
      for (var _i = 0; _i < _count; _i++) {

        var cell = row.item(_i);

        switch (cell.getKey()) {

          case KIP_PERC_ID:
            if(valEmpty(cell.getId(), Cairo.Constants.Types.id)) {
              //'Debe indicar una percepcion
              return Cairo.Modal.showInfo(Cairo.Language.getText(1535, "", strRow));
            }
            break;

          case KIP_BASE:
            if(valEmpty(cell.getValue(), Cairo.Constants.Types.currency)) {
              //'Debe indicar una base imponible
              return Cairo.Modal.showInfo(Cairo.Language.getText(2547, "", strRow));
            }
            break;

          case KIP_PORCENTAJE:
            if(valEmpty(cell.getValue(), Cairo.Constants.Types.currency)) {
              //'Debe indicar un porcentaje
              return Cairo.Modal.showInfo(Cairo.Language.getText(1098, "", strRow));
            }
            break;

          case KIP_IMPORTE:
            if(valEmpty(cell.getValue(), Cairo.Constants.Types.currency)) {
              //'Debe indicar un importe
              return Cairo.Modal.showInfo(Cairo.Language.getText(1897, "", strRow));
            }
            break;
        }
      }

      return Cairo.Promises.resolvedPromise(true);
    };

    self.isEmptyRowPercepciones = function(row, rowIndex) {
      var bRowIsEmpty = true;

      var _count = row.size();
      for (var _i = 0; _i < _count; _i++) {

        var cell = row.item(_i);

        switch (cell.getKey()) {

          case KIP_IMPORTE:
            if(!valEmpty(cell.getValue(), Cairo.Constants.Types.currency)) {
              bRowIsEmpty = false;
              break;
            }
            break;

          case KIP_PERC_ID:
            if(!valEmpty(cell.getId(), Cairo.Constants.Types.id)) {
              bRowIsEmpty = false;
              break;
            }
            break;

          case KIP_PORCENTAJE:
            if(!valEmpty(cell.getValue(), Cairo.Constants.Types.double)) {
              bRowIsEmpty = false;
              break;
            }
            break;

          case KIP_BASE:
            if(!valEmpty(cell.getValue(), Cairo.Constants.Types.currency)) {
              bRowIsEmpty = false;
              break;
            }
            break;
        }
      }

      return Cairo.Promises.resolvedPromise(bRowIsEmpty);
    };

    self.percepcionShowTotales = function(rows, property) {
      var percep = 0;

      var _count = rows.size();
      for (var _i = 0; _i < _count; _i++) {
        var row = rows.item(_i);
        percep += val(getCell(row, KIP_IMPORTE).getValue());
      }

      property.setValue(percep);
    };

    self.columnAfterEditPercepciones = function(property, lRow, lCol, newValue, newValueID) {

      var columns = property.getGrid().getColumns().item(lCol);

      switch (columns.getKey()) {

        case KIP_BASE:
          var row = property.getGrid().getRows().item(lRow);
          var cell = getCell(row, KIP_BASE);
          if(val(newValue) < 0) {
            cell.setValue(0);
          }
          else if(val(newValue) > 0) {
            getCell(row, KIP_IMPORTE).setValue((newValue * val(getCell(row, KIP_PORCENTAJE).getValue())) / 100);
          }
          break;

        case KIP_IMPORTE:
          var row = property.getGrid().getRows().item(lRow);
          var cell = getCell(row, KIP_IMPORTE);
          if(val(newValue) < 0) {
            cell.setValue(0);
          }
          else if(val(newValue) > 0) {
            var percent = null;
            percent = val(getCell(row, KIP_PORCENTAJE).getValue());
            if(percent == 0) {
              percent = 1;
              getCell(row, KIP_PORCENTAJE).setValue(1);
            }
            getCell(row, KIP_BASE).setValue(zeroDiv(newValue, percent) * 100);
          }
          break;

        case KIP_PORCENTAJE:
          var row = property.getGrid().getRows().item(lRow);
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
      mainRegister, property, id, cotizacion, isDefaultCurrency, isCopy, deleted, fcId, module) {

      var transaction = Cairo.Database.createTransaction();
      transaction.setTable(CC.FACTURA_COMPRA_PERCEPCION_TMP);

      var origen = 0;

      var _count = property.getGrid().getRows().size();
      for (var _i = 0; _i < _count; _i++) {

        var row = property.getGrid().getRows().item(_i);

        var register = new Cairo.Database.Register();
        var fields = register.getFields();
        register.setFieldId(CC.FCPERC_TMP_ID);
        register.setId(Cairo.Constants.NEW_ID);

        var _count = row.size();
        for (var _j = 0; _j < _count; _j++) {
          
          var cell = row.item(_j);
          
          switch (cell.getKey()) {

            case KIP_FCPERC_ID:
              if(isCopy) {
                fields.add(CC.FCPERC_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.integer);
              }
              else {
                fields.add(CC.FCPERC_ID, val(cell.getValue()), Cairo.Constants.Types.integer);
              }
              break;

            case KIP_PERC_ID:
              fields.add(CC.PERC_ID, cell.getId(), Cairo.Constants.Types.id);
              break;

            case KIP_BASE:
              fields.add(CC.FCPERC_BASE, val(cell.getValue()), Cairo.Constants.Types.currency);
              break;

            case KIP_PORCENTAJE:
              fields.add(CC.FCPERC_PORCENTAJE, val(cell.getValue()), Cairo.Constants.Types.currency);
              break;

            case KIP_IMPORTE:
              origen = val(cell.getValue());
              fields.add(CC.FCPERC_IMPORTE, origen * cotizacion, Cairo.Constants.Types.currency);
              break;

            case KI_CCOS_ID:
              fields.add(CC.CCOS_ID, cell.getId(), Cairo.Constants.Types.id);
              break;

            case KIP_DESCRIP:
              fields.add(CC.FCPERC_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);
              break;
          }
        }

        if(isDefaultCurrency) {
          fields.add(CC.FCPERC_ORIGEN, 0, Cairo.Constants.Types.currency);
        }
        else {
          fields.add(CC.FCPERC_ORIGEN, origen, Cairo.Constants.Types.currency);
        }

        transaction.addRegister(register);
      }

      if(deleted != "" && fcId != Cairo.Constants.NO_ID && !isCopy) {

        transaction.setDeletedList(deleted);
      }

      mainRegister.addTransaction(transaction);

      return true;
    };

    return self;
  };

  Cairo.Compras.Percepciones = createObject();

}());