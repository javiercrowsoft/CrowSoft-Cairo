(function() {
  "use strict";

  Cairo.module("Lenguaje.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {
 
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
      var C_FILTER = "filter";
      var C_TOP = "top";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_DESCRIP = 3;
      var K_ID_PADRE = 4;
      var K_ACTIVE = 5;
      var K_ITEMS = 6;
      var K_CMD_FILTER = 7;
      var K_FILTER = 8;
      var K_TOP = 9;

      var KI_LENGI_ID = 1;
      var KI_CODIGO = 2;
      var KI_TEXTO = 4;

      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_descrip = "";
      var m_padre = "";
      var m_id_padre = "";
      var m_active = "";

      var m_hasChanged = false;

      var m_editing;

      var m_dialog;
      var m_listController = null;

      var m_isNew;

      var m_branchId = 0;
      var m_treeId = 0;
      var m_copy;

      var m_itemsDeleted = "";

      var m_apiPath = DB.getAPIVersion();

      var emptyData = {
        items: []
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
        switch (key) {
          case K_CMD_FILTER, K_TOP:
            var filter = function() {
              return load(getRolId()).then(
                function (success) {
                  if (success) {
                    refreshCollection();
                  }
                  return false; // to avoid refresh controls by property change, so grid don't load twice
                }
              );
            }
            var p;
            if(m_hasChanged) {
              p = Cairo.Modal.confirmCancelViewNoDanger(
                "Loading permissions",
                "You have changes which aren't save yet. Press yes if you want to save the changes or press No to continue without saving. You can also cancel this action."
              ).then(
                function(answer) {
                  /*
                    if the user wants to save changes
                    it returns a promise with the result
                    of calling saveDialog()
                    save is asynchronous (ajax call to server)
                  */
                  if(answer === "yes") {
                    return m_dialog.save();
                  } else {
                    return answer === "no";
                  }
                });
            } else {
              p = P.resolvedPromise(true);
            }
            return p.whenSuccess(filter);
        }

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
            case K_NAME:
              fields.add(C.LENG_NAME, property.getValue(), Types.text);
              break;

            case K_CODE:
              fields.add(C.LENG_CODE, property.getValue(), Types.text);
              break;

            case K_ID_PADRE:
              fields.add(C.LENG_ID_PADRE, property.getId(), Types.id);
              break;

            case K_DESCRIP:
              fields.add(C.LENG_DESCRIP, property.getValue(), Types.text);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, property.getValue(), Types.boolean);
              break;
          }
        }

        saveItems(register);

        return DB.saveTransaction(
          register,
          false,
          C.LENG_CODE,
          Cairo.Constants.CLIENT_SAVE_FUNCTION,
          C_MODULE,
          getText(3433, "") // Error al grabar lenguaje

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
        m_hasChanged = true;
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
        elem.hideLabel();;
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
        elem.hideLabel();;
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
        elem.hideLabel();;
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

        transaction.setTable(C.LENGUAJE_ITEM);

        var property = m_dialog.getProperties().item(C_ITEMS);

        var rows = property.getGrid().getRows();
        for (var i = 0, count = rows.size(); i < count; i++) {

          var row = rows.item(i);

          var register = new Cairo.Database.Register();

          var fields = register.getFields();
          register.setFieldId(C.LENGI_ID);
          register.setId(Cairo.Constants.NEW_ID);

          for (var j = 0, countj = row.size(); j < countj; j++) {

            var cell = row.item(j);
            switch (cell.getKey()) {

              case KI_LENGI_ID:
                if(m_copy) {
                  fields.add(C.LENGI_ID, Cairo.Constants.NEW_ID, Types.integer);
                }
                else {
                  fields.add(C.LENGI_ID, val(cell.getValue()), Types.integer);
                }
                break;

              case KI_CODIGO:
                fields.add(C.LENGI_CODIGO, cell.getValue(), Types.text);
                break;

              case KI_TEXTO:
                fields.add(C.LENGI_TEXTO, cell.getValue(), Types.text);
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

      var validateRowItems = function(row, rowIndex) {
        var strRow = " (Row: " + rowIndex.toString() + ")";
        for (var i = 0, count = row.size(); i < count; i++) {
          var cell = row.item(i);
          switch (cell.getKey()) {
            case KI_CODIGO:
              if(valEmpty(cell.getValue(), Types.text)) {
                return M.showInfoWithFalse(getText(1526, "", strRow)); // Debe indicar un código #1#
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
}());




' funciones privadas
Private Function LoadCollection() As Boolean
  Dim c As cIABMProperty
  Dim iProp As cABMProperty
  
  With m_ObjAbm.Tabs
    .Clear
      
    With .Add(Nothing)
      .Name = C_strGeneral
    End With
  
    With .Add(Nothing)
      .Index = 1
      .Name = c_Items
    End With
    
  End With
      
  With m_ObjAbm.Properties
    
    .Clear

    With .Add(Nothing, cscLengNombre)
      .PropertyType = cspText
      .Name = C_strNombre
      .Size = 100
      .Key = K_NOMBRE
      .Value = m_name
      .Width = 6500
    End With
  
    With .Add(Nothing, cscLengCodigo)
      .PropertyType = cspText
      .Name = C_strCodigo
      .Size = 15
      .Key = K_CODIGO
      .Value = m_code
    End With
  
    With .Add(Nothing, cscActivo)
      .PropertyType = cspCheck
      .Name = C_strActivo
      .Key = K_ACTIVO
      .Value = CInt(m_active)
    End With
    
    With .Add(Nothing, cscLengIdpadre)
      .PropertyType = cspHelp
      .Table = csTblLenguaje
      .Name = LNGGetText(1002, vbNullString) '"Lenguaje Padre"
      .Key = K_ID_PADRE
      .Value = m_padre
      .HelpId = m_id_padre
      .HelpFilter = "IsNull(leng_id_padre,0) <> " & m_id & " and leng_id <> " & m_id
    End With
  
    With .Add(Nothing, cscLengDescrip)
      .PropertyType = cspText
      .SubType = cspMemo
      .Name = C_strDescrip
      .Size = 255
      .Width = 6500
      .Height = 880
      .Key = K_DESCRIP
      .Value = m_descrip
    End With
  
    Set c = .Add(Nothing, c_Filter)
    With c
      .Name = LNGGetText(2826, vbNullString) 'Filtro
      .PropertyType = cspText
      .TabIndex = 1
      Set iProp = c
      iProp.IsEditProperty = False
      .Key = K_FILTER
    End With
        
    With .Add(Nothing)
      .PropertyType = cspButton
      .TopFromProperty = c_Filter
      .Left = 4000
      .LeftNotChange = True
      .TopNotChange = True
      .LeftLabel = -1
      .Name = LNGGetText(3432, vbNullString) 'Filtrar
      .TabIndex = 1
      .Key = K_CMD_FILTER
    End With
    
    Set c = .Add(Nothing, c_Top)
    With c
      .PropertyType = cspCheck
      .Name = LNGGetText(3479, vbNullString) 'Top 50
      .TopFromProperty = c_Filter
      .Left = 7500
      .LeftNotChange = True
      .TopNotChange = True
      .LeftLabel = -800
      .TabIndex = 1
      .Key = K_TOP
      .Value = -1
      Set iProp = c
      iProp.IsEditProperty = False
    End With
    
    Set c = .Add(Nothing, c_Items)
    With c
      .PropertyType = cspGrid
      .LeftLabel = -1
      If Not pLoadItems(c) Then Exit Function
      .Name = c_Items
      .Key = K_ITEMS
      .TabIndex = 1
      .Top = 1500
      .Left = 200
      .GridAdd = True
      .GridEdit = True
      .GridRemove = True
    End With
    
  End With
  
  m_ItemsDeletedItems = vbNullString
  
  m_MaxCodigo = 0
  
  If Not m_ObjAbm.Show(Me) Then Exit Function
  
  LoadCollection = True
End Function

Private Function Load(ByVal Id As Long) As Boolean
  Dim sqlstmt As String
  Dim rs As Recordset
  
  sqlstmt = "select Lenguaje.*,L2.leng_nombre as padre " & _
              " from Lenguaje left join Lenguaje L2 on Lenguaje.leng_id_padre = L2.leng_id" & _
              " where Lenguaje.leng_id = " & Id

  If Not gDB.OpenRs(sqlstmt, rs, csRsStatic, csLockReadOnly, csCmdText, "Load", C_Module) Then Exit Function

  If Not rs.EOF Then

    m_id = gDB.ValField(rs.fields, cscLengId)
    m_name = gDB.ValField(rs.fields, cscLengNombre)
    m_code = gDB.ValField(rs.fields, cscLengCodigo)
    m_descrip = gDB.ValField(rs.fields, cscLengDescrip)
    m_id_padre = gDB.ValField(rs.fields, cscLengIdpadre)
    m_padre = gDB.ValField(rs.fields, "padre")
    m_Creado = gDB.ValField(rs.fields, cscCreado)
    m_Modificado = gDB.ValField(rs.fields, cscModificado)
    m_Modifico = gDB.ValField(rs.fields, cscModifico)
    m_active = gDB.ValField(rs.fields, cscActivo)

  Else
    
    m_id = csNO_ID
    m_name = vbNullString
    m_code = vbNullString
    m_descrip = vbNullString
    m_id_padre = csNO_ID
    m_padre = vbNullString
    m_Creado = csNoDate
    m_Modificado = csNoDate
    m_Modifico = 0
    m_active = True
    
  End If

  m_MaxCodigo = 0

  Load = True
End Function

Private Function pIsEmptyRowItems(ByRef Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
  Dim Cell                  As cIABMGridCellValue
  Dim bRowIsEmpty           As Boolean
  
  bRowIsEmpty = True
  
  For Each Cell In Row
    Select Case Cell.Key
      Case KI_CODIGO
        If Not ValEmpty(Cell.Value, csText) Then
          bRowIsEmpty = False
          Exit For
        End If
      Case KI_TEXTO
        If Not ValEmpty(Cell.Value, csText) Then
          bRowIsEmpty = False
          Exit For
        End If
    End Select
  Next
  
  pIsEmptyRowItems = bRowIsEmpty
End Function

Private Function pValidateRowItems(Row As CSInterfacesABM.cIABMGridRow, ByVal RowIndex As Long) As Boolean
  Dim Cell   As cIABMGridCellValue
  Dim strRow As String
  Dim Codigo As String
  
  strRow = " (Fila " & RowIndex & ")"
  
  For Each Cell In Row
    Select Case Cell.Key
        Case KI_CODIGO
          If ValEmpty(Cell.Value, csText) Then
          
                  ' "No ha indicado un c�digo" & strRow & ";;�Desea que el sistema le sugiera el proximo numero a usar?"
                  '
            If Ask(LNGGetText(1003, vbNullString, strRow), vbYes) Then
            
              If Not pItemCodigoGet(Codigo) Then Exit Function
              Cell.Value = Codigo
            Else
              Exit Function
            End If
          End If
        Case KI_TEXTO
          If ValEmpty(Cell.Value, csText) Then
                                    ' Debe indicar un texto
            MsgInfo LNGGetText(1004, vbNullString, strRow)
            Exit Function
          End If
    End Select
  Next
  
  pValidateRowItems = True
End Function

Private Function pLoadItems(ByRef Propiedad As cIABMProperty) As Boolean
  Dim sqlstmt As String
  Dim rs As ADODB.Recordset
  
  m_WasChanged = False
  
  Dim filter As String
  
  With m_ObjAbm.Properties
    filter = .Item(c_Filter).Value
    sqlstmt = "select " & IIf(Val(.Item(c_Top).Value), "top 50 ", vbNullString) & "* from LenguajeItem where leng_id = " & m_id
  End With
  
  If LenB(filter) Then
  
    filter = gDB.sqlString(filter)
  
    sqlstmt = sqlstmt & _
              " and (lengi_texto like " & filter & _
              " or lengi_codigo like " & filter & ")"
  End If
  
  sqlstmt = sqlstmt & " order by lengi_texto"
  
  If Not gDB.OpenRs(sqlstmt, rs, csRsStatic, csLockReadOnly, csCmdText, "pLoadItems", C_Module) Then Exit Function
  
  With Propiedad.Grid
  
    With .Columns
    
      .Clear
    
      With .Add(Nothing)
        .Visible = False
        .Key = KI_LENGI_ID
      End With
  
      With .Add(Nothing)
        .Name = C_strCodigo
        .PropertyType = cspText
        .Width = 3500
        .Key = KI_CODIGO
      End With
      
      With .Add(Nothing)
        .Name = LNGGetText(1005, vbNullString)
        .PropertyType = cspText
        .SubType = cspTextButtonEx
        .Width = 1200
        .Key = KI_TEXTO
      End With
    
    End With
    
    With .Rows
      
      .Clear
      
      While Not rs.EOF
      
        With .Add(Nothing, rs(csclengiId).Value)
        
          With .Add(Nothing)
            .Value = rs(csclengiId).Value
            .Key = KI_LENGI_ID
          End With
          
          With .Add(Nothing)
            .Value = gDB.ValField(rs.fields, csclengiCodigo)
            .Key = KI_CODIGO
          End With
          
          With .Add(Nothing)
            .Value = gDB.ValField(rs.fields, csclengiTexto)
            .Key = KI_TEXTO
          End With
          
        End With
        
        rs.MoveNext
      Wend
    
    End With
  
  End With
  
  pLoadItems = True
End Function

Private Function pItemCodigoGet(ByRef rtn As String) As Boolean
  Dim sqlstmt As String
  Dim rs      As ADODB.Recordset
  
  If m_MaxCodigo = 0 Then
  
    sqlstmt = "sp_LenguajeItemGetCodigo"
    
    If Not gDB.OpenRs(sqlstmt, rs) Then Exit Function
    
    rtn = gDB.ValField(rs.fields, 0)
    
    m_MaxCodigo = Val(rtn)
  
  Else
  
    m_MaxCodigo = m_MaxCodigo + 1
    
    rtn = m_MaxCodigo
    
  End If
  
  pItemCodigoGet = True
End Function

