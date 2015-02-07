(function() {
  "use strict";

  var createObject = function() {

    var self = {};

    var Dialogs = Cairo.Dialogs;

    var KI_CCOS_ID = 22;
    var KIP_IMPORTE = 1;
    var KIP_PERC_ID = 2;
    var KIP_PORCENTAJE = 3;
    var KIP_BASE = 4;
    var KIP_DESCRIP = 5;
    var KIP_FCPERC_ID = 7;

    var c_Wiz_Key_percepciones = "PERCEP"
    var c_Wiz_Key_TotalPercepciones = "TotalPercep"

    self.loadPercepciones = function(grid, grlCfg) {
      // La primera simpre esta invisible
      var w_columns = grid.getColumns();
      var elem = w_columns.add(null);
      elem.setVisible(false);
      elem.setKey(KIP_FCPERC_ID);

      var elem = w_columns.add(null);
      //'Percepcion
      elem.setName(Cairo.Language.getText(1252, ""));
      elem.setType(Dialogs.PropertyType.select);
      elem.setSelectTable(Cairo.Tables.PERCEPCION);
      elem.setWidth(1800);
      elem.setKey(KIP_PERC_ID);

      var elem = w_columns.add(null);
      //'Base Imponible
      elem.setName(Cairo.Language.getText(2546, ""));
      elem.setType(Dialogs.PropertyType.numeric);
      elem.setSubType(Dialogs.PropertySubType.money);
      elem.setFormat(grlCfg.getFormatDecImporte());
      elem.setWidth(1200);
      elem.setKey(KIP_BASE);

      var elem = w_columns.add(null);
      //'Porcentaje
      elem.setName(Cairo.Language.getText(1105, ""));
      elem.setType(Dialogs.PropertyType.numeric);
      elem.setSubType(Dialogs.PropertySubType.percentage);
      elem.setWidth(1200);
      elem.setKey(KIP_PORCENTAJE);

      var elem = w_columns.add(null);
      //'Importe
      elem.setName(Cairo.Language.getText(1228, ""));
      elem.setType(Dialogs.PropertyType.numeric);
      elem.setFormat(grlCfg.getFormatDecImporte());
      elem.setSubType(Dialogs.PropertySubType.money);
      elem.setWidth(1200);
      elem.setKey(KIP_IMPORTE);

      var elem = w_columns.add(null);
      //'Observaciones
      elem.setName(Cairo.Language.getText(1861, ""));
      elem.setType(Dialogs.PropertyType.text);
      elem.setWidth(1800);
      elem.setKey(KIP_DESCRIP);

      var elem = w_columns.add(null);
      //'Centro de Costo
      elem.setName(Cairo.Language.getText(1057, ""));
      elem.setType(Dialogs.PropertyType.select);
      elem.setSelectTable(Cairo.Tables.CENTROCOSTO);
      elem.setWidth(1800);
      elem.setKey(KI_CCOS_ID);
    };

    self.validateRowPercepciones = function(row, rowIndex) {
      var cell = null;
      var strRow = null;
      strRow = " (Fila "+ rowIndex.toString()+ ")";

      var _count = row.size();
      for (var _i = 0; _i < _count; _i++) {
        cell = row.item(_i);
        switch (cell.getKey()) {
          case KIP_PERC_ID:
            if(Cairo.Util.valEmpty(cell.getId(), Cairo.Constants.Types.id)) {
              //'Debe indicar una percepcion
              Cairo.Modal.showInfo(Cairo.Language.getText(1535, "", strRow));
              return null;
            }
            break;

          case KIP_BASE:
            if(Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.currency)) {
              //'Debe indicar una base imponible
              Cairo.Modal.showInfo(Cairo.Language.getText(2547, "", strRow));
              return null;
            }
            break;

          case KIP_PORCENTAJE:
            if(Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.currency)) {
              //'Debe indicar un porcentaje
              Cairo.Modal.showInfo(Cairo.Language.getText(1098, "", strRow));
              return null;
            }
            break;

          case KIP_IMPORTE:
            if(Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.currency)) {
              //'Debe indicar un importe
              Cairo.Modal.showInfo(Cairo.Language.getText(1897, "", strRow));
              return null;
            }
            break;
        }
      }

      return true;
    };

    self.isEmptyRowPercepciones = function(row, rowIndex) {
      var cell = null;
      var strRow = null;
      var bRowIsEmpty = null;

      strRow = " (Fila "+ rowIndex.toString()+ ")";

      bRowIsEmpty = true;

      var _count = row.size();
      for (var _i = 0; _i < _count; _i++) {
        cell = row.item(_i);
        switch (cell.getKey()) {
          case KIP_IMPORTE:
            if(!Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.currency)) {
              bRowIsEmpty = false;
              break;
            }
            break;

          case KIP_PERC_ID:
            if(!Cairo.Util.valEmpty(cell.getId(), Cairo.Constants.Types.id)) {
              bRowIsEmpty = false;
              break;
            }
            break;

          case KIP_PORCENTAJE:
            if(!Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.double)) {
              bRowIsEmpty = false;
              break;
            }
            break;

          case KIP_BASE:
            if(!Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.currency)) {
              bRowIsEmpty = false;
              break;
            }
            break;
        }
      }

      return bRowIsEmpty;
    };

    self.percepcionShowTotales = function(rowsPercep, iPropPercep) {
      var percep = null;
      var row = null;

      var _count = rowsPercep.size();
      for (var _i = 0; _i < _count; _i++) {
        row = rowsPercep.item(_i);
        percep = percep + Cairo.Util.val(Dialogs.cell(row, KIP_IMPORTE).getValue());
      }

      iPropPercep.setValue(percep);
    };

    self.columnAfterEditPercepciones = function(property,  lRow,  lCol,  newValue,  newValueID) {
      var row = null;

      var w_columns = property.getGrid().getColumns(lCol);
      switch (w_columns.Key) {
        case KIP_BASE:
          row = property.getGrid().getRows(lRow);
          var w_pCell = Dialogs.cell(row, KIP_BASE);
          if(Cairo.Util.val(newValue) < 0) {
            w_pCell.setValue(0);
          }
          else if(Cairo.Util.val(newValue) > 0) {
            Dialogs.cell(row, KIP_IMPORTE).getValue() == (newValue * Cairo.Util.val(Dialogs.cell(row, KIP_PORCENTAJE).getValue())) / 100;
          }
          break;

        case KIP_IMPORTE:
          row = property.getGrid().getRows(lRow);
          var w_pCell = Dialogs.cell(row, KIP_IMPORTE);
          if(Cairo.Util.val(newValue) < 0) {
            w_pCell.setValue(0);
          }
          else if(Cairo.Util.val(newValue) > 0) {
            var percent = null;
            percent = Cairo.Util.val(Dialogs.cell(row, KIP_PORCENTAJE).getValue());
            if(percent == 0) {
              percent = 1;
              Dialogs.cell(row, KIP_PORCENTAJE).getValue() == 1;
            }
            Dialogs.cell(row, KIP_BASE).getValue() == cUtil.divideByCero(newValue, percent) * 100;
          }
          break;

        case KIP_PORCENTAJE:
          row = property.getGrid().getRows(lRow);
          var w_pCell = Dialogs.cell(row, KIP_PORCENTAJE);
          if(Cairo.Util.val(newValue) < 0) {
            w_pCell.setValue(0);
          }
          else if(Cairo.Util.val(newValue) > 0) {
            Dialogs.cell(row, KIP_IMPORTE).getValue() == (Cairo.Util.val(Dialogs.cell(row, KIP_BASE).getValue()) * newValue) / 100;
          }
          break;
      }

      return true;
    };

    self.savePercepciones = function(iProp,  id,  cotizacion,  bMonedaLegal,  copy,  deleted,  fcId,  module) {

      var c_ErrorSave = null;

      //'Error al grabar la factura de compra
      c_ErrorSave = Cairo.Language.getText(1907, "");

      var register = null;
      var iOrden = null;
      var origen = null;

      var row = null;
      var cell = null;

      var _count = iProp.getGrid().getRows().size();
      for (var _i = 0; _i < _count; _i++) {
        row = iProp.getGrid().getRows().item(_i);

        register = new cRegister();
        register.setFieldId(mComprasConstantes.FCPERC_TMPID);
        register.setTable(mComprasConstantes.FACTURACOMPRAPERCEPCIONTMP);
        register.setId(Cairo.Constants.NEW_ID);

        var _count = row.size();
        for (var _j = 0; _j < _count; _j++) {
          cell = row.item(_j);
          switch (cell.getKey()) {

            case KIP_FCPERC_ID:
              if(copy) {
                register.getFields().add2(mComprasConstantes.FCPERC_ID, Cairo.Constants.NEW_ID, Cairo.Constants.Types.integer);
              }
              else {
                register.getFields().add2(mComprasConstantes.FCPERC_ID, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.integer);
              }
              break;

            case KIP_PERC_ID:
              register.getFields().add2(mComprasConstantes.PERC_ID, cell.getId(), Cairo.Constants.Types.id);
              break;

            case KIP_BASE:
              register.getFields().add2(mComprasConstantes.FCPERC_BASE, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
              break;

            case KIP_PORCENTAJE:
              register.getFields().add2(mComprasConstantes.FCPERC_PORCENTAJE, Cairo.Util.val(cell.getValue()), Cairo.Constants.Types.currency);
              break;

            case KIP_IMPORTE:
              origen = Cairo.Util.val(cell.getValue());
              register.getFields().add2(mComprasConstantes.FCPERC_IMPORTE, origen * cotizacion, Cairo.Constants.Types.currency);
              break;

            case KI_CCOS_ID:
              register.getFields().add2(mComprasConstantes.CCOS_ID, cell.getId(), Cairo.Constants.Types.id);
              break;

            case KIP_DESCRIP:
              register.getFields().add2(mComprasConstantes.FCPERC_DESCRIP, cell.getValue(), Cairo.Constants.Types.text);
              break;
          }
        }

        if(bMonedaLegal) {
          register.getFields().add2(mComprasConstantes.FCPERC_ORIGEN, 0, Cairo.Constants.Types.currency);
        }
        else {
          register.getFields().add2(mComprasConstantes.FCPERC_ORIGEN, origen, Cairo.Constants.Types.currency);
        }

        iOrden = iOrden + 1;
        register.getFields().add2(mComprasConstantes.FCPERC_ORDEN, iOrden, Cairo.Constants.Types.integer);
        register.getFields().add2(mComprasConstantes.FC_TMPID, id, Cairo.Constants.Types.id);

        register.getFields().setHaveLastUpdate(false);
        register.getFields().setHaveWhoModify(false);

        if(!Cairo.Database.save(register, , "pSavePercepciones", module, c_ErrorSave)) { return false; }
      }

      var sqlstmt = null;

      if(deleted != "" && fcId != Cairo.Constants.NO_ID) {

        var vDeletes = null;
        var i = null;

        deleted = cUtil.removeLastColon(deleted);
        vDeletes = Split(deleted, ",");

        for (i = 0; i <= vDeletes.Length; i++) {

          register = new cRegister();
          register.setFieldId(mComprasConstantes.FC_PERCB_TMPID);
          register.setTable(mComprasConstantes.FACTURACOMPRAPERCEPCIONBORRADOTMP);
          register.setId(Cairo.Constants.NEW_ID);

          register.getFields().add2(mComprasConstantes.FCPERC_ID, Cairo.Util.val(vDeletes(i)), Cairo.Constants.Types.integer);
          register.getFields().add2(mComprasConstantes.FC_ID, fcId, Cairo.Constants.Types.id);
          register.getFields().add2(mComprasConstantes.FC_TMPID, id, Cairo.Constants.Types.id);

          register.getFields().setHaveLastUpdate(false);
          register.getFields().setHaveWhoModify(false);

          if(!Cairo.Database.save(register, , "pSavePercepciones", module, c_ErrorSave)) { return false; }
        }

      }

      return true;
    };

    return self;
  };

  Cairo.Compras.Percepciones = createObject();

}());