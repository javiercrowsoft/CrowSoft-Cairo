(function() {
  "use strict";

  Cairo.module("Retencion.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var P = Cairo.Promises;
      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;
      var Types = Cairo.Constants.Types;
      var U = Cairo.Util;
      var b2i = U.boolToInt;
      var valField = DB.valField;
      var getValue = DB.getValue;
      var M = Cairo.Modal;
      var T = Dialogs.PropertyType;
      var val = U.val;
      var valEmpty = U.valEmpty;

      var C_MODULE = "cRetencion";

      var C_ITEMS = "Items";
      var C_PROVINCIAS = "provincias";
      var C_CAT_FISCAL = "catFiscal";

      var K_RETT_ID = 1;
      var K_NAME = 2;
      var K_CODE = 3;
      var K_IMPORTE_MINIMO = 4;
      var K_REGIMEN_SICORE = 5;
      var K_TA_ID = 6;
      var K_DESCRIP = 7;
      var K_ACTIVE = 8;
      var K_IBC_ID = 12;
      var K_ACUMULA_POR = 13;
      var K_TIPO_MINIMO = 14;
      var K_ITEMS = 9;

      var K_CAT_FISCAL = 10;
      var K_PROVINCIAS = 11;

      var K_ES_IIBB = 15;

      var KI_RETI_ID = 2;
      var KI_IMPORTE_DESDE = 3;
      var KI_IMPORTE_HASTA = 4;
      var KI_PORCENTAJE = 5;
      var KI_IMPORTE_FIJO = 6;

      var KI_RET_CATF_ID = 1;
      var KI_CATF_ID = 2;
      var KI_BASE = 3;

      var KI_RET_PRO_ID = 1;
      var KI_PRO_ID = 2;

      var m_rett_id = 0;
      var m_retencionTipo = "";
      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_importeMinimo = 0;
      var m_regimenSicore = "";
      var m_ta_id = 0;
      var m_talonario = "";

      var m_ibc_id = 0;
      var m_iGBCategoria = "";

      var m_acumulaPor;
      var m_tipoMinimo;

      var m_esIIBB;

      var m_descrip = "";
      var m_active;

      var m_editing;

      var m_dialog;
      var m_listController = null;

      var m_isNew;

      var m_branchId = 0;
      var m_treeId = 0;
      var m_copy;

      var m_itemsDeleted = "";
      var m_catFiscalDeleted = "";
      var m_provinciasDeleted = "";

      var m_apiPath = DB.getAPIVersion();

      var emptyData = {
        items: [],
        categoriasFiscales: [],
        provincias: []
      };

      var m_data = emptyData;

      self.getId = function() {
        return m_id;
      };

      self.getName = function() {
        return m_name;
      };

      self.getCode = function() {
        return m_code;
      };

      self.copy = function() {

        updateList();

        m_isNew = true;

        if(m_listController !== null) {
          m_listController.updateEditorKey(self, NO_ID);
        }

        var property = m_dialog.getProperties().item(C.RET_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(C.RET_CODE));

        m_copy = true;
      };

      self.editNew = function() {

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, NO_ID);

        return load(NO_ID).then(
          function(ignored) {
            return refreshCollection();
          }
        );
      };

      self.getApplication = function() {
        return Cairo.Application.getName();
      };

      self.editDocumentsEnabled = function() {
        return m_id !== NO_ID;
      };

      self.copyEnabled = function() {
        return true;
      };

      self.addEnabled = function() {
        return true;
      };

      self.showDocDigital = function() {
        var _rtn = null;
        try {

          if(m_id === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(C.RETENCION);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.SHOW_DOCUMENTS_FUNCTION, C_MODULE, "");
        }

        return _rtn;
      };

      self.messageEx = function(messageID, info) {
        var _rtn = null;
        switch (messageID) {

          case Dialogs.Message.MSG_DOC_INFO:

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_RETENCION);
            _rtn = Dialogs.Message.MSG_DOC_INFO_HANDLED;
            break;

          default:
            _rtn = true;
            break;
        }

        return P.resolvedPromise(_rtn);
      };

      self.discardChanges = function() {
        return P.resolvedPromise(refreshCollection());
      };

      self.propertyChange = function(key) {
        return P.resolvedPromise(false);
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.RET_ID);
        register.setTable(C.RETENCION);

        register.setPath(m_apiPath + "general/retencion");

        if(m_copy) {
          register.setId(Cairo.Constants.NEW_ID);
        }
        else {
          register.setId(m_id);
        }

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          var property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_RETT_ID:
              fields.add(C.RETT_ID, property.getSelectId(), Types.id);
              break;

            case K_NAME:
              fields.add(C.RET_NAME, property.getValue(), Types.text);
              break;

            case K_CODE:
              fields.add(C.RET_CODE, property.getValue(), Types.text);
              break;

            case K_IMPORTE_MINIMO:
              fields.add(C.RET_IMPORTE_MINIMO, property.getValue(), Types.currency);
              break;

            case K_REGIMEN_SICORE:
              fields.add(C.RET_REGIMEN_SICORE, property.getValue(), Types.text);
              break;

            case K_TA_ID:
              fields.add(C.TA_ID, property.getSelectId(), Types.id);
              break;

            case K_IBC_ID:
              fields.add(C.IBC_ID, property.getSelectId(), Types.id);
              break;

            case K_ACUMULA_POR:
              fields.add(C.RET_ACUMULA_POR, property.getListItemData(), Types.integer);
              break;

            case K_TIPO_MINIMO:
              fields.add(C.RET_TIPO_MINIMO, property.getListItemData(), Types.integer);
              break;

            case K_ES_IIBB:
              fields.add(C.RET_ES_IIBB, property.getValue(), Types.boolean);
              break;

            case K_DESCRIP:
              fields.add(C.RET_DESCRIP, property.getValue(), Types.text);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, property.getValue(), Types.boolean);
              break;
          }
        }

        saveItems(register);
        saveCatFiscal(register);
        saveProvincias(register);

        return DB.saveTransaction(
            register,
            false,
            C.RET_CODE,
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            getText(1417, "") // Error al grabar retencion

        ).then(

          function(result) {
            if(result.success) {
              m_copy = false;
              return load(result.data.getId()).then(
                function (success) {
                  if(success) {
                    Cairo.navigate(self.getPath());
                    if(m_listController !== null) {
                      updateList();
                      m_listController.updateEditorKey(self, m_id);
                    }
                  }
                  m_isNew = false;
                  return success;
                }
              );
            }
            else {
              return false;
            }
          });
      };

      var updateList = function() {
        if(m_id === NO_ID) { return; }
        if(m_listController === null) { return; }

        if(m_isNew) {
          m_listController.addLeave(m_id, m_branchId);
        }
        else {
          m_listController.refreshBranch(m_id, m_branchId);
        }
      };

      self.getPath = function() {
        return "#general/retencion/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "retencion" + id;
      };      
   
      self.getTitle = function() {
        return getText(1393, ""); // Retenciones
      };

      self.validate = function() {
        var property = null;

        var _count = m_dialog.getProperties().size();
        for (var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_RETT_ID:
              if(valEmpty(property.getSelectId(), Types.id)) {
                return M.showInfoWithFalse(getText(1418, "")); // Debe indicar un tipo de retención
              }
              break;

            case K_NAME:
              if(valEmpty(property.getValue(), Types.text)) {
                return M.showInfoWithFalse(Cairo.Constants.MUST_SET_A_NAME);
              }
              break;

            case K_CODE:
              if(valEmpty(property.getValue(), Types.text)) {
                property.setValue(Cairo.Constants.GET_CODE_FROM_ID);
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      //
      // grid
      //

      self.columnAfterEdit = function(key, lRow, lCol, newValue, newValueId) {
        return P.resolvedPromise(true);
      };

      self.columnBeforeEdit = function(key, lRow, lCol, iKeyAscii) {
        return P.resolvedPromise(true);
      };

      self.columnButtonClick = function(key, lRow, lCol, iKeyAscii) {

      };
      
      self.deleteRow = function(key, row, lRow) {
        var id = null;

        switch (key) {
          case K_ITEMS:
            id = val(Dialogs.cell(row, KI_RETI_ID).getValue());
            if(id !== NO_ID) { m_itemsDeleted = m_itemsDeleted + id.toString() + ","; }
            break;

          case K_CAT_FISCAL:
            id = val(Dialogs.cell(row, KI_RET_CATF_ID).getValue());
            if(id !== NO_ID) { m_catFiscalDeleted = m_catFiscalDeleted + id.toString() + ","; }
            break;

          case K_PROVINCIAS:
            id = val(Dialogs.cell(row, KI_RET_PRO_ID).getValue());
            if(id !== NO_ID) { m_provinciasDeleted = m_provinciasDeleted + id.toString() + ","; }
            break;
        }

        return P.resolvedPromise(true);
      };

      self.newRow = function(key, rows) {
        return P.resolvedPromise(true);
      };

      self.columnAfterUpdate = function(key, lRow, lCol) {
        return P.resolvedPromise(true);
      };

      self.columnClick = function(key, lRow, lCol) {

      };

      self.gridDblClick = function(key, lRow, lCol) {
        return P.resolvedPromise(false);
      };

      self.isEmptyRow = function(key, row, rowIndex) {
        var isEmpty = true;

        try {

          switch (key) {
            case K_ITEMS:
              isEmpty = isEmptyRowItems(row, rowIndex);
              break;

            case K_PROVINCIAS:
              isEmpty = isEmptyRowProvincia(row, rowIndex);
              break;

            case K_CAT_FISCAL:
              isEmpty = isEmptyRowCatFiscal(row, rowIndex);
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.IS_EMPTY_ROW_FUNCTION, C_MODULE, "");
        }

        return isEmpty;
      };

      self.validateRow = function(key, row, rowIndex) {
        var p = null;

        try {

          switch (key) {
            case K_ITEMS:
              p = validateRowItems(row, rowIndex);
              break;

            case K_CAT_FISCAL:
              p = validateRowCatFiscal(row, rowIndex);
              break;

            case K_PROVINCIAS:
              p = validateRowProvincia(row, rowIndex);
              break;
          }
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.VALIDATE_ROW_FUNCTION, C_MODULE, "");
        }

        return p || P.resolvedPromise(false);
      };

      self.setTreeId = function(value) {
        m_treeId = value;
      };

      self.getTreeId = function() {
        return m_treeId;
      };

      self.list = function() {
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_RETENCION);
      };

      self.getDialog = function() {
        return m_dialog;
      };

      self.setDialog = function(value) {
        m_dialog = value;
      };

      self.isEditing = function() {
        return m_editing;
      };

      self.edit = function(id, inModalWindow) {
        var p = P.resolvedPromise(false);
        
        try {

          if(id === NO_ID) {
            m_isNew = true;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_RETENCION)) { return p; }
          }
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_RETENCION)) { return p; }
          }

          m_dialog.setInModalWindow(inModalWindow);

          p = load(id).then(
            function(success) {
              if(success) {

                if(!loadCollection()) { return false; }

                m_editing = true;
                m_copy = false;

                if(inModalWindow) {
                  success = m_id !== NO_ID;
                }
                else {
                  success = true;
                }

              }
              return success;
            });
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.EDIT_FUNCTION, C_MODULE, "");
        }

        return p;
      };

      self.setTree = function(rhs) {
        m_listController = rhs;
      };

      self.setBranchId = function(rhs) {
        m_branchId = rhs;
      };

      self.getBranchId = function() {
        return m_branchId;
      };

      var loadCollection = function() {

        m_dialog.setTitle(m_name);

        var tabs = m_dialog.getTabs();

        tabs.clear();

        var tab = tabs.add(null);
        tab.setName(Cairo.Constants.TAB_GENERAL);

        tab = tabs.add(null);
        tab.setIndex(1);
        tab.setName(C_ITEMS);

        tab = tabs.add(null);
        tab.setIndex(2);
        tab.setName(getText(1181, "")); // Categoria Fiscales

        tab = tabs.add(null);
        tab.setIndex(3);
        tab.setName(getText(1410, "")); // Provincias

        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, C.RET_NAME);
        elem.setType(T.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(100);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        elem = properties.add(null, C.RET_CODE);
        elem.setType(T.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setSize(15);
        elem.setKey(K_CODE);
        elem.setValue(m_code);

        elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(T.check);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVE);
        elem.setValue(b2i(m_active));

        elem = properties.add(null, C.RETT_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.RETENCIONTIPO);
        elem.setName(getText(1420, "")); // Tipo de Retención
        elem.setKey(K_RETT_ID);
        elem.setValue(m_retencionTipo);
        elem.setSelectId(m_rett_id);

        elem = properties.add(null, C.RET_IMPORTE_MINIMO);
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setName(getText(1255, "")); // Importe Minimo
        elem.setKey(K_IMPORTE_MINIMO);
        elem.setValue(m_importeMinimo);
        elem.setWidth(1000);

        elem = properties.add(null, C.RET_ES_IIBB);
        elem.setType(T.check);
        elem.setName(getText(3753, "")); // Es de IIBB
        elem.setKey(K_ES_IIBB);
        elem.setValue(Cairo.Util.boolToInt(m_esIIBB));

        elem = properties.add(null, C.RET_REGIMEN_SICORE);
        elem.setType(T.text);
        elem.setName(getText(1254, "")); // Regimen Sicore
        elem.setSize(50);
        elem.setKey(K_REGIMEN_SICORE);
        elem.setValue(m_regimenSicore);

        elem = properties.add(null, C.TA_ID);
        elem.setType(T.select);
        elem.setTable(Cairo.Tables.TALONARIO);
        elem.setName(getText(1256, "")); // Talonario
        elem.setKey(K_TA_ID);
        elem.setValue(m_talonario);
        elem.setSelectId(m_ta_id);

        elem = properties.add(null, C.IBC_ID);
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.INGRESOS_BRUTOS_CATEGORIA);
        elem.setName(getText(1308, "")); // Categoría Ingresos Brutos
        elem.setKey(K_IBC_ID);
        elem.setValue(m_iGBCategoria);
        elem.setSelectId(m_ibc_id);

        elem = properties.add(null, C.RET_ACUMULA_POR);
        elem.setType(T.list);
        elem.setName(getText(2939, "")); // Acumula Por
        elem.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
        elem.setListItemData(m_acumulaPor);
        elem.setKey(K_ACUMULA_POR);
        var list = elem.getList();
        list.add(null)
          .setId(Cairo.General.Constants.RetencionTipoAcumulado.noAcumula)
          .setValue(getText(2940, "")); // No Acumula
        list.add(null)
          .setId(Cairo.General.Constants.RetencionTipoAcumulado.mensual)
          .setValue(getText(1215, "")); // Mes

        elem = properties.add(null, C.RET_TIPO_MINIMO);
        elem.setType(T.list);
        elem.setName(getText(2969, "")); // Tipo Minimo
        elem.setListWhoSetItem(Dialogs.ListWhoSetItem.itemData);
        elem.setListItemData(m_tipoMinimo);
        elem.setKey(K_TIPO_MINIMO);
        list = elem.getList();
        list.add(null)
          .setId(Cairo.General.Constants.RetencionTipoMinimo.noImponible)
          .setValue(getText(2971, "")); // No Imponible
        list.add(null)
          .setId(Cairo.General.Constants.RetencionTipoMinimo.imponible)
          .setValue(getText(2970, "")); // Imponible

        elem = properties.add(null, C.RET_DESCRIP);
        elem.setType(T.text);
        elem.setSubType(Dialogs.PropertySubType.memo);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setSize(255);
        elem.setWidth(6250);
        elem.setHeight(600);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);

        elem = properties.add(null, C_ITEMS);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridItems(elem);
        loadItems(elem);
        elem.setName(C_ITEMS);
        elem.setKey(K_ITEMS);
        elem.setTabIndex(1);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_itemsDeleted = "";

        elem = properties.add(null, C_CAT_FISCAL);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridCatFiscal(elem);
        loadCatFiscal(elem);
        elem.setName(C_CAT_FISCAL);
        elem.setKey(K_CAT_FISCAL);
        elem.setTabIndex(2);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_catFiscalDeleted = "";

        elem = properties.add(null, C_PROVINCIAS);
        elem.setType(T.grid);
        elem.hideLabel();
        setGridProvincias(elem);
        loadProvincias(elem);
        elem.setName(C_PROVINCIAS);
        elem.setKey(K_PROVINCIAS);
        elem.setTabIndex(3);
        elem.setGridAddEnabled(true);
        elem.setGridEditEnabled(true);
        elem.setGridRemoveEnabled(true);

        m_provinciasDeleted = "";

        return m_dialog.show(self);
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(C.RET_NAME);
        elem.setValue(m_name);

        elem = properties.item(C.RET_CODE);
        elem.setValue(m_code);

        elem = properties.item(Cairo.Constants.ACTIVE);
        elem.setValue(b2i(m_active));

        elem = properties.item(C.RETT_ID);
        elem.setValue(m_retencionTipo);
        elem.setSelectId(m_rett_id);

        elem = properties.item(C.RET_IMPORTE_MINIMO);
        elem.setValue(m_importeMinimo);

        elem = properties.item(C.RET_ES_IIBB);
        elem.setValue(b2i(m_esIIBB));

        elem = properties.item(C.RET_REGIMEN_SICORE);
        elem.setValue(m_regimenSicore);

        elem = properties.item(C.TA_ID);
        elem.setValue(m_talonario);
        elem.setSelectId(m_ta_id);

        elem = properties.item(C.IBC_ID);
        elem.setValue(m_iGBCategoria);
        elem.setSelectId(m_ibc_id);

        elem = properties.item(C.RET_ACUMULA_POR);
        elem.setItemData(m_acumulaPor);

        elem = properties.item(C.RET_TIPO_MINIMO);
        elem.setItemData(m_tipoMinimo);

        elem = properties.item(C.RET_DESCRIP);
        elem.setValue(m_descrip);

        elem = properties.item(C_ITEMS);
        loadItems(elem);
        m_itemsDeleted = "";

        elem = properties.item(C_PROVINCIAS);
        loadProvincias(elem);
        m_provinciasDeleted = "";

        elem = properties.item(C_CAT_FISCAL);
        loadCatFiscal(elem);
        m_catFiscalDeleted = "";

        return m_dialog.showValues(properties);
      };

      var loadDataFromResponse = function(response) {
        var data = response.data;

        data.items = data.get('items');
        data.categoriasFiscales = data.get('categoriasFiscales');
        data.provincias = data.get('provincias');

        return data;
      };

      var load = function(id) {
        m_data = emptyData;

        return Cairo.Database.getData("load[" + m_apiPath + "general/retencion]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== NO_ID) {

              m_data = loadDataFromResponse(response);

              var data = response.data;
              
              m_rett_id = valField(data, C.RETT_ID);
              m_retencionTipo = valField(data, C.RETT_NAME);
              m_id = valField(data, C.RET_ID);
              m_name = valField(data, C.RET_NAME);
              m_code = valField(data, C.RET_CODE);
              m_acumulaPor = valField(data, C.RET_ACUMULA_POR);
              m_tipoMinimo = valField(data, C.RET_TIPO_MINIMO);
              m_active = valField(data, Cairo.Constants.ACTIVE);
              m_descrip = valField(data, C.RET_DESCRIP);
              m_importeMinimo = valField(data, C.RET_IMPORTE_MINIMO);
              m_regimenSicore = valField(data, C.RET_REGIMEN_SICORE);
              m_ta_id = valField(data, C.TA_ID);
              m_talonario = valField(data, C.TA_NAME);
              m_ibc_id = valField(data, C.IBC_ID);
              m_iGBCategoria = valField(data, C.IBC_NAME);
              m_esIIBB = valField(data, C.RET_ES_IIBB);

            }
            else {
              m_rett_id = NO_ID;
              m_retencionTipo = "";
              m_id = NO_ID;
              m_name = "";
              m_code = "";
              m_acumulaPor = Cairo.General.RetencionTipoAcumulado.noAcumula;
              m_tipoMinimo = Cairo.General.RetencionTipoAcumulado.noImponible;
              m_active = true;
              m_descrip = "";
              m_importeMinimo = 0;
              m_regimenSicore = "";
              m_ta_id = NO_ID;
              m_talonario = "";
              m_ibc_id = NO_ID;
              m_iGBCategoria = "";
              m_esIIBB = false;
            }

            return true;
          });
      };

      var saveItems = function(mainRegister) {

        var transaction = DB.createTransaction();

        transaction.setTable(C.RETENCION_ITEM);

        var property = m_dialog.getProperties().item(C_ITEMS);

        var rows = property.getGrid().getRows();
        for (var i = 0, count = rows.size(); i < count; i++) {

          var row = rows.item(i);

          var register = new Cairo.Database.Register();

          var fields = register.getFields();
          register.setFieldId(C.RETI_ID);
          register.setId(Cairo.Constants.NEW_ID);

          for (var j = 0, countj = row.size(); j < countj; j++) {

            var cell = row.item(j);
            switch (cell.getKey()) {

              case KI_RETI_ID:
                if(m_copy) {
                  fields.add(C.RETI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(C.RETI_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KI_IMPORTE_DESDE:
                fields.add(C.RETI_IMPORTE_DESDE, cell.getValue(), Types.currency);
                break;

              case KI_IMPORTE_HASTA:
                fields.add(C.RETI_IMPORTE_HASTA, cell.getValue(), Types.currency);
                break;

              case KI_PORCENTAJE:
                fields.add(C.RETI_PORCENTAJE, cell.getValue(), Types.currency);
                break;

              case KI_IMPORTE_FIJO:
                fields.add(C.RETI_IMPORTEFIJO, cell.getValue(), Types.currency);
                break;
            }
          }

          transaction.addRegister(register);
        }

        if(m_itemsDeleted !== "" && m_id !== NO_ID && !m_copy) {

          transaction.setDeletedList(m_itemsDeleted);
        }

        mainRegister.addTransaction(transaction);
      };

      var saveCatFiscal = function(mainRegister) {

        var transaction = DB.createTransaction();

        transaction.setTable(C.RETENCION_CATEGORIA_FISCAL);

        var property = m_dialog.getProperties().item(C_CAT_FISCAL);

        var rows = property.getGrid().getRows();
        for (var i = 0, count = rows.size(); i < count; i++) {
          var row = rows.item(i);

          var register = new Cairo.Database.Register();

          var fields = register.getFields();
          register.setFieldId(C.RET_CATF_ID);
          register.setId(Cairo.Constants.NEW_ID);

          for (var j = 0, countj = row.size(); j < countj; j++) {

            var cell = row.item(j);
            switch (cell.getKey()) {

              case KI_RET_CATF_ID:
                if(!m_copy) {
                  register.setId(val(cell.getValue()));
                }
                break;

              case KI_CATF_ID:
                fields.add(C.CATF_ID, cell.getId(), Types.id);
                break;

              case KI_BASE:
                fields.add(C.RET_CATF_BASE, cell.getId(), Types.integer);
                break;
            }
          }

          transaction.addRegister(register);
        }

        if(m_catFiscalDeleted !== "" && m_id !== NO_ID && !m_copy) {

          transaction.setDeletedList(m_catFiscalDeleted);
        }

        mainRegister.addTransaction(transaction);
      };

      var saveProvincias = function(mainRegister) {
        var transaction = DB.createTransaction();

        transaction.setTable(C.RETENCION_PROVINCIA);

        var property = m_dialog.getProperties().item(C_CAT_FISCAL);

        var rows = property.getGrid().getRows();
        for (var i = 0, count = rows.size(); i < count; i++) {
          var row = rows.item(i);

          var register = new Cairo.Database.Register();

          var fields = register.getFields();
          register.setFieldId(C.RET_PRO_ID);
          register.setId(Cairo.Constants.NEW_ID);

          for (var j = 0, countj = row.size(); j < countj; j++) {

            var cell = row.item(j);
            switch (cell.getKey()) {

              case KI_RET_PRO_ID:
                if(m_copy) {
                  fields.add(C.RET_PRO_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(C.RET_PRO_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KI_PRO_ID:
                fields.add(C.PRO_ID, cell.getId(), Types.id);
                break;
            }
          }
          transaction.addRegister(register);
        }

        if(m_provinciasDeleted !== "" && m_id !== NO_ID && !m_copy) {

          transaction.setDeletedList(m_provinciasDeleted);
        }

        mainRegister.addTransaction(transaction);
      };

      var setGridItems = function(property) {
        var grid = property.getGrid();
        var columns = grid.getColumns();
        columns.clear();

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_RETI_ID);

        elem = columns.add(null);
        elem.setName(getText(1257, "")); // Importe Desde
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat("#,###,##0.00");
        elem.setKey(KI_IMPORTE_DESDE);

        elem = columns.add(null);
        elem.setName(getText(1258, "")); // Importe Hasta
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat("#,###,##0.00");
        elem.setKey(KI_IMPORTE_HASTA);

        elem = columns.add(null);
        elem.setName(getText(1259, "")); // Importe Fijo
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.money);
        elem.setFormat("#,###,##0.00");
        elem.setKey(KI_IMPORTE_FIJO);

        elem = columns.add(null);
        elem.setName(getText(1105, "")); // Porcentaje
        elem.setType(T.numeric);
        elem.setSubType(Dialogs.PropertySubType.percentage);
        elem.setKey(KI_PORCENTAJE);

        grid.getRows().clear();
      };

      var loadItems = function(property) {
        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();
        
        for(var i = 0, count = m_data.items.length; i < count; i += 1) {

          var row = rows.add(null, getValue(m_data.items[i], C.RETI_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.items[i], C.RETI_ID));
          elem.setKey(KI_RETI_ID);

          elem = row.add(null);
          elem.setValue(valField(m_data.items[i], C.RETI_IMPORTE_DESDE));
          elem.setKey(KI_IMPORTE_DESDE);

          elem = row.add(null);
          elem.setValue(valField(m_data.items[i], C.RETI_IMPORTE_HASTA));
          elem.setKey(KI_IMPORTE_HASTA);

          elem = row.add(null);
          elem.setValue(valField(m_data.items[i], C.RETI_IMPORTEFIJO));
          elem.setKey(KI_IMPORTE_FIJO);

          elem = row.add(null);
          elem.setValue(valField(m_data.items[i], C.RETI_PORCENTAJE));
          elem.setKey(KI_PORCENTAJE);

        }
      };

      var setGridCatFiscal = function(property) {
        var grid = property.getGrid();
        var columns = grid.getColumns();
        columns.clear();

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_RET_CATF_ID);

        elem = columns.add(null);
        elem.setName(getText(1181, "")); // Categoria Fiscal
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.CATEGORIA_FISCAL);
        elem.setKey(KI_CATF_ID);

        elem = columns.add(null);
        elem.setName(getText(2550, "")); // Base
        elem.setType(T.list);
        var list = elem.getList();
        list.add(null)
          .setId(Cairo.General.Constants.RetencionBase.neto)
          .setValue(getText(1581, "")); // Neto
        list.add(null)
          .setId(Cairo.General.Constants.RetencionBase.netoGravado)
          .setValue(getText(2551, "")); // Neto Gravado
        list.add(null)
          .setId(Cairo.General.Constants.RetencionBase.total)
          .setValue(getText(1584, "")); // Total
        elem.setKey(KI_BASE);

        grid.getRows().clear();
      };

      var loadCatFiscal = function(property) {
        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        for(var i = 0, count = m_data.categoriasFiscales.length; i < count; i += 1) {

          var row = rows.add(null, getValue(m_data.categoriasFiscales[i], C.RET_CATF_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.categoriasFiscales[i], C.RET_CATF_ID));
          elem.setKey(KI_RET_CATF_ID);

          elem = row.add(null);
          elem.setValue(valField(m_data.categoriasFiscales[i], C.CATF_NAME));
          elem.setId(valField(m_data.categoriasFiscales[i], C.CATF_ID));
          elem.setKey(KI_CATF_ID);

          elem = row.add(null);
          elem.setId(valField(m_data.categoriasFiscales[i], C.RET_CATF_BASE));
          elem.setKey(KI_BASE);

        }
      };

      var setGridProvincias = function(property) {
        var grid = property.getGrid();
        var columns = grid.getColumns();
        columns.clear();

        var elem = columns.add(null);
        elem.setVisible(false);
        elem.setKey(KI_RET_PRO_ID);

        elem = columns.add(null);
        elem.setName(getText(1080, "")); // Provincia
        elem.setType(T.select);
        elem.setSelectTable(Cairo.Tables.PROVINCIA);
        elem.setKey(KI_PRO_ID);

        grid.getRows().clear();
      };

      var loadProvincias = function(property) {
        var elem;
        var grid = property.getGrid();
        var rows = grid.getRows();

        for(var i = 0, count = m_data.provincias.length; i < count; i += 1) {

          var row = rows.add(null, getValue(m_data.provincias[i], C.RET_PRO_ID));

          elem = row.add(null);
          elem.setValue(getValue(m_data.provincias[i], C.RET_PRO_ID));
          elem.setKey(KI_RET_PRO_ID);

          elem = row.add(null);
          elem.setValue(valField(m_data.provincias[i], C.PRO_NAME));
          elem.setId(valField(m_data.provincias[i], C.PRO_ID));
          elem.setKey(KI_PRO_ID);

        }
      };

      var isEmptyRowItems = function(row, rowIndex) {
        var bRowIsEmpty = true;
        for (var i = 0, count = row.size(); i < count; i++) {
          var cell = row.item(i);
          switch (cell.getKey()) {
            case KI_IMPORTE_DESDE:
              if(!valEmpty(cell.getValue(), Types.currency)) {
                bRowIsEmpty = false;
              }
              break;

            case KI_IMPORTE_HASTA:
              if(!valEmpty(cell.getValue(), Types.currency)) {
                bRowIsEmpty = false;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var isEmptyRowCatFiscal = function(row, rowIndex) {
        var bRowIsEmpty = true;
        for (var i = 0, count = row.size(); i < count; i++) {
          var cell = row.item(i);
          switch (cell.getKey()) {
            case KI_CATF_ID:
              if(!valEmpty(cell.getId(), Types.id)) {
                bRowIsEmpty = false;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var isEmptyRowProvincia = function(row, rowIndex) {
        var bRowIsEmpty = true;
        for (var i = 0, count = row.size(); i < count; i++) {
          var cell = row.item(i);
          switch (cell.getKey()) {
            case KI_PRO_ID:
              if(!valEmpty(cell.getId(), Types.id)) {
                bRowIsEmpty = false;
              }
              break;
          }
        }

        return bRowIsEmpty;
      };

      var validateRowItems = function(row, rowIndex) {
        var strRow = " (Row: " + rowIndex.toString() + ")";
        for (var i = 0, count = row.size(); i < count; i++) {
          var cell = row.item(i);
          switch (cell.getKey()) {
            case KI_IMPORTE_HASTA:
              if(valEmpty(cell.getValue(), Types.currency)) {
                return M.showInfoWithFalse(getText(1260, "", strRow)); // Debe indicar un importe hasta (1)
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var validateRowCatFiscal = function(row, rowIndex) {
        var strRow = " (Row: " + rowIndex.toString() + ")";
        for (var i = 0, count = row.size(); i < count; i++) {
          var cell = row.item(i);
          switch (cell.getKey()) {
            case KI_CATF_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(1109, "", strRow)); // Debe indicar una categoria
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var validateRowProvincia = function(row, rowIndex) {
        var strRow = " (Row: " + rowIndex.toString() + ")";
        for (var i = 0, count = row.size(); i < count; i++) {
          var cell = row.item(i);
          switch (cell.getKey()) {
            case KI_PRO_ID:
              if(valEmpty(cell.getId(), Types.id)) {
                return M.showInfoWithFalse(getText(1077, "", strRow)); // Debe indicar una provincia (1)
              }
              break;
          }
        }

        return P.resolvedPromise(true);
      };

      var initialize = function() {
        
      };

      var destroy = function() {
        m_dialog = null;
        m_listController = null;
      };

      self.terminate = function() {

        m_editing = false;

        try {
          if(m_listController !== null) {
            updateList();
            m_listController.removeEditor(self);
          }
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "terminate", C_MODULE, "");
        }

        try {
          destroy();
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "terminate", C_MODULE, "");
        }
      };

      initialize();

      return self;
    };

    Edit.Controller = { getEditor: createObject };

    Edit.Controller.edit = function(id) {
      var editor = Cairo.Producto.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit(id);
    };
    
  });

  Cairo.module("Retencion.List", function(List, Cairo, Backbone, Marionette, $, _) {

    var NO_ID = Cairo.Constants.NO_ID;
    var getText = Cairo.Language.getText;

    List.Controller = {
      list: function() {

        var self = this;

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.retencionEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.retencionEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: getText(1393, ""),
            entityName: getText(1403, ""),
            entitiesName: getText(1393, "")
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
              var editor = Cairo.Retencion.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_RETENCION)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            var apiPath = Cairo.Database.getAPIVersion();
            return Cairo.Database.destroy(apiPath + "general/retencion", id, Cairo.Constants.DELETE_FUNCTION, "Retencion").success(
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
          Cairo.LoadingMessage.show("Retenciones", "Loading Retenciones from CrowSoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ retencionTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.RETENCION,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.retencionTreeRegion,
            self);
        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("Retenciones", "retencionTreeRegion", "#general/retenciones", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });

}());


