(function() {
  "use strict";

  Cairo.module("Percepciones.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var Dialogs = Cairo.Dialogs;

      public const Integer KI_CCOS_ID = 22;
      public const Integer KIP_IMPORTE = 1;
      public const Integer KIP_PERC_ID = 2;
      public const Integer KIP_PORCENTAJE = 3;
      public const Integer KIP_BASE = 4;
      public const Integer KIP_DESCRIP = 5;
      public const Integer KIP_FCPERC_ID = 7;

      *Public Const c_Wiz_Key_percepciones = "PERCEP"
      *Public Const c_Wiz_Key_TotalPercepciones = "TotalPercep"

      self.loadPercepciones = function(grid,  grlCfg) { // TODO: Use of ByRef founded Public Sub LoadPercepciones(ByRef Grid As cIABMGrid, ByRef grlCfg As cGeneralConfig)
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

      self.validateRowPercepciones = function(row,  rowIndex) { // TODO: Use of ByRef founded Public Function ValidateRowPercepciones(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
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
                cWindow.msgInfo(Cairo.Language.getText(1535, "", strRow));
                return null;
              }
              break;

            case KIP_BASE:
              if(Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.currency)) {
                //'Debe indicar una base imponible
                cWindow.msgInfo(Cairo.Language.getText(2547, "", strRow));
                return null;
              }
              break;

            case KIP_PORCENTAJE:
              if(Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.currency)) {
                //'Debe indicar un porcentaje
                cWindow.msgInfo(Cairo.Language.getText(1098, "", strRow));
                return null;
              }
              break;

            case KIP_IMPORTE:
              if(Cairo.Util.valEmpty(cell.getValue(), Cairo.Constants.Types.currency)) {
                //'Debe indicar un importe
                cWindow.msgInfo(Cairo.Language.getText(1897, "", strRow));
                return null;
              }
              break;
          }
        }

        return true;
      };

      self.isEmptyRowPercepciones = function(row,  rowIndex) { // TODO: Use of ByRef founded Public Function IsEmptyRowPercepciones(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
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

      self.percepcionShowTotales = function(rowsPercep,  iPropPercep) { // TODO: Use of ByRef founded Public Sub PercepcionShowTotales(ByRef RowsPercep As cIABMGridRows, ByRef iPropPercep As cIABMProperty)
        var percep = null;
        var row = null;

        var _count = rowsPercep.size();
        for (var _i = 0; _i < _count; _i++) {
          row = rowsPercep.item(_i);
          percep = percep + Cairo.Util.val(Dialogs.cell(row, KIP_IMPORTE).getValue());
        }

        iPropPercep.setValue(percep);
      };

      self.columnAfterEditPercepciones = function(property,  lRow,  lCol,  newValue,  newValueID) { // TODO: Use of ByRef founded Public Function ColumnAfterEditPercepciones(ByRef IProperty As cIABMProperty, ByVal lRow As Long, ByVal lCol As Long, ByVal NewValue As Variant, ByVal NewValueID As Long)
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

      self.savePercepciones = function(iProp,  id,  cotizacion,  bMonedaLegal,  copy,  deleted,  fcId,  module) { // TODO: Use of ByRef founded Public Function SavePercepciones(ByRef iProp As cIABMProperty, ByVal Id As Long, ByVal Cotizacion As Double, ByVal bMonedaLegal As Boolean, ByVal Copy As Boolean, ByVal deleted As String, ByVal FcId As Long, ByVal Module As String) As Boolean

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

    Edit.Controller = { getEditor: createObject };

  });

  Cairo.module("Percepciones.List", function(List, Cairo, Backbone, Marionette, $, _) {
    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.percepcionesEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.percepcionesEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Percepcioness",
            entityName: "percepciones",
            entitiesName: "percepcioness"
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
              var editor = Cairo.Percepciones.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_PERCEPCIONES)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            var apiPath = Cairo.Database.getAPIVersion();
            return Cairo.Database.destroy(apiPath + "general/percepciones", id, Cairo.Constants.DELETE_FUNCTION, "Percepciones").success(
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
          Cairo.LoadingMessage.show("Percepcioness", "Loading percepciones from Crowsoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ percepcionesTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.PERCEPCIONES,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.percepcionesTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("Percepcioness", "percepcionesTreeRegion", "#general/percepcioness", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });


}());