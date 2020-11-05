(function() {
  "use strict";

  Cairo.module("Rubro.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;
      var D = Cairo.Documents;
      var Types = Cairo.Constants.Types;

      var C_MODULE = "cRubro";

      var K_NAME = 1;
      var K_CODE = 2;
      var K_DESCRIP = 3;
      var K_ESCRITERIO = 104;

      var K_RUBT_ID1 = 4;
      var K_RUBT_ID2 = 5;
      var K_RUBT_ID3 = 6;
      var K_RUBT_ID4 = 7;
      var K_RUBT_ID5 = 8;
      var K_RUBT_ID6 = 9;
      var K_RUBT_ID7 = 10;
      var K_RUBT_ID8 = 11;
      var K_RUBT_ID9 = 12;
      var K_RUBT_ID10 = 13;
      var K_RUBTI_ID1 = 14;
      var K_RUBTI_ID2 = 15;
      var K_RUBTI_ID3 = 16;
      var K_RUBTI_ID4 = 17;
      var K_RUBTI_ID5 = 18;
      var K_RUBTI_ID6 = 19;
      var K_RUBTI_ID7 = 20;
      var K_RUBTI_ID8 = 21;
      var K_RUBTI_ID9 = 22;
      var K_RUBTI_ID10 = 23;

      var K_ACTIVE = 24;
      var m_id = 0;
      var m_name = "";
      var m_code = "";
      var m_active;
      var m_esCriterio;
      var m_descrip = "";

      var m_rubtId1 = 0;
      var m_tabla1 = "";
      var m_rubtId2 = 0;
      var m_tabla2 = "";
      var m_rubtId3 = 0;
      var m_tabla3 = "";
      var m_rubtId4 = 0;
      var m_tabla4 = "";
      var m_rubtId5 = 0;
      var m_tabla5 = "";
      var m_rubtId6 = 0;
      var m_tabla6 = "";
      var m_rubtId7 = 0;
      var m_tabla7 = "";
      var m_rubtId8 = 0;
      var m_tabla8 = "";
      var m_rubtId9 = 0;
      var m_tabla9 = "";
      var m_rubtId10 = 0;
      var m_tabla10 = "";
      var m_rubtiId1 = 0;
      var m_tablaItem1 = "";
      var m_rubtiId2 = 0;
      var m_tablaItem2 = "";
      var m_rubtiId3 = 0;
      var m_tablaItem3 = "";
      var m_rubtiId4 = 0;
      var m_tablaItem4 = "";
      var m_rubtiId5 = 0;
      var m_tablaItem5 = "";
      var m_rubtiId6 = 0;
      var m_tablaItem6 = "";
      var m_rubtiId7 = 0;
      var m_tablaItem7 = "";
      var m_rubtiId8 = 0;
      var m_tablaItem8 = "";
      var m_rubtiId9 = 0;
      var m_tablaItem9 = "";
      var m_rubtiId10 = 0;
      var m_tablaItem10 = "";

      var m_editing;

      var m_dialog;
      var m_listController = null;

      var m_isNew;

      var m_branchId = 0;
      var m_treeId = 0;

      var m_copy;

      var m_apiPath = DB.getAPIVersion();
      
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

        m_listController.updateEditorKey(self, NO_ID);

        var property = m_dialog.getProperties().item(C.RUB_CODE);
        property.setValue(Cairo.Constants.COPY_OF + property.getValue());

        m_dialog.showValue(m_dialog.getProperties().item(C.RUB_CODE));

        m_copy = true;
      };

      self.editNew = function() {

        updateList();

        m_isNew = true;

        m_listController.updateEditorKey(self, NO_ID);

        return load(NO_ID).then(
          function() {
            Cairo.navigate(self.getPath());
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
        var _rtn = false;
        try {

          if(m_id === NO_ID) { return _rtn; }

          var doc = new Cairo.DocDigital();

          doc.setClientTable(C.RUBRO);
          doc.setClientTableID(m_id);

          _rtn = doc.showDocs(Cairo.Database);

        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, Cairo.Constants.SHOW_DOCUMENTS_FUNCTION, C_MODULE, "");
        }

        return _rtn;
      };

      self.messageEx = function(messageId,  info) {
        var _rtn = null;
        switch (messageId) {

          case Dialogs.Message.MSG_DOC_INFO:

            Cairo.Documentation.show("", "", Cairo.Security.Actions.General.NEW_RUBRO);
            _rtn = Dialogs.Message.MSG_DOC_INFO_HANDLED;
            break;

          default:
            _rtn = true;
            break;
        }

        return Cairo.Promises.resolvedPromise(_rtn);
      };

      self.discardChanges = function() {
        return Cairo.Promises.resolvedPromise(refreshCollection());
      };

      self.propertyChange = function(key) {

        var properties = m_dialog.getProperties();
        switch (key) {
          case K_RUBT_ID1:
            properties.item(C.RUBTI_ID_1).setSelectFilter(D.getRubroTablaItemFilter(properties.item(C.RUBT_ID_1).getSelectId()));
            m_dialog.showValue(properties.item(C.RUBTI_ID_1));
            break;

          case K_RUBT_ID2:
            properties.item(C.RUBTI_ID_2).setSelectFilter(D.getRubroTablaItemFilter(properties.item(C.RUBT_ID_2).getSelectId()));
            m_dialog.showValue(properties.item(C.RUBTI_ID_2));
            break;

          case K_RUBT_ID3:
            properties.item(C.RUBTI_ID_3).setSelectFilter(D.getRubroTablaItemFilter(properties.item(C.RUBT_ID_3).getSelectId()));
            m_dialog.showValue(properties.item(C.RUBTI_ID_3));
            break;

          case K_RUBT_ID4:
            properties.item(C.RUBTI_ID_4).setSelectFilter(D.getRubroTablaItemFilter(properties.item(C.RUBT_ID_4).getSelectId()));
            m_dialog.showValue(properties.item(C.RUBTI_ID_4));
            break;

          case K_RUBT_ID5:
            properties.item(C.RUBTI_ID_5).setSelectFilter(D.getRubroTablaItemFilter(properties.item(C.RUBT_ID_5).getSelectId()));
            m_dialog.showValue(properties.item(C.RUBTI_ID_5));
            break;

          case K_RUBT_ID6:
            properties.item(C.RUBTI_ID_6).setSelectFilter(D.getRubroTablaItemFilter(properties.item(C.RUBT_ID_6).getSelectId()));
            m_dialog.showValue(properties.item(C.RUBTI_ID_6));
            break;

          case K_RUBT_ID7:
            properties.item(C.RUBTI_ID_7).setSelectFilter(D.getRubroTablaItemFilter(properties.item(C.RUBT_ID_7).getSelectId()));
            m_dialog.showValue(properties.item(C.RUBTI_ID_7));
            break;

          case K_RUBT_ID8:
            properties.item(C.RUBTI_ID_8).setSelectFilter(D.getRubroTablaItemFilter(properties.item(C.RUBT_ID_8).getSelectId()));
            m_dialog.showValue(properties.item(C.RUBTI_ID_8));
            break;

          case K_RUBT_ID9:
            properties.item(C.RUBTI_ID_9).setSelectFilter(D.getRubroTablaItemFilter(properties.item(C.RUBT_ID_9).getSelectId()));
            m_dialog.showValue(properties.item(C.RUBTI_ID_9));
            break;

          case K_RUBT_ID10:
            properties.item(C.RUBTI_ID_10).setSelectFilter(D.getRubroTablaItemFilter(properties.item(C.RUBT_ID_10).getSelectId()));
            m_dialog.showValue(properties.item(C.RUBTI_ID_10));
            break;
        }
        return Cairo.Promises.resolvedPromise(false);
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.RUB_ID);
        register.setTable(C.RUBRO);

        register.setPath(m_apiPath + "general/rubro");

        if(m_copy) {
          register.setId(Cairo.Constants.NEW_ID);
        }
        else {
          register.setId(m_id);
        }

        var _count = m_dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {
          var property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NAME:
              fields.add(C.RUB_NAME, property.getValue(), Types.text);
              break;

            case K_CODE:
              fields.add(C.RUB_CODE, property.getValue(), Types.text);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, property.getValue(), Types.boolean);
              break;

            case K_DESCRIP:
              fields.add(C.RUB_DESCRIP, property.getValue(), Types.text);
              break;

            case K_ESCRITERIO:
              fields.add(C.RUB_ES_CRITERIO, Cairo.Util.val(property.getValue()), Types.boolean);
              break;

            case K_RUBT_ID1:
              fields.add(C.RUBT_ID_1, property.getSelectId(), Types.id);
              break;

            case K_RUBT_ID2:
              fields.add(C.RUBT_ID_2, property.getSelectId(), Types.id);
              break;

            case K_RUBT_ID3:
              fields.add(C.RUBT_ID_3, property.getSelectId(), Types.id);
              break;

            case K_RUBT_ID4:
              fields.add(C.RUBT_ID_4, property.getSelectId(), Types.id);
              break;

            case K_RUBT_ID5:
              fields.add(C.RUBT_ID_5, property.getSelectId(), Types.id);
              break;

            case K_RUBT_ID6:
              fields.add(C.RUBT_ID_6, property.getSelectId(), Types.id);
              break;

            case K_RUBT_ID7:
              fields.add(C.RUBT_ID_7, property.getSelectId(), Types.id);
              break;

            case K_RUBT_ID8:
              fields.add(C.RUBT_ID_8, property.getSelectId(), Types.id);
              break;

            case K_RUBT_ID9:
              fields.add(C.RUBT_ID_9, property.getSelectId(), Types.id);
              break;

            case K_RUBT_ID10:
              fields.add(C.RUBT_ID_10, property.getSelectId(), Types.id);
              break;

            case K_RUBTI_ID1:
              fields.add(C.RUBTI_ID_1, property.getSelectId(), Types.id);
              break;

            case K_RUBTI_ID2:
              fields.add(C.RUBTI_ID_2, property.getSelectId(), Types.id);
              break;

            case K_RUBTI_ID3:
              fields.add(C.RUBTI_ID_3, property.getSelectId(), Types.id);
              break;

            case K_RUBTI_ID4:
              fields.add(C.RUBTI_ID_4, property.getSelectId(), Types.id);
              break;

            case K_RUBTI_ID5:
              fields.add(C.RUBTI_ID_5, property.getSelectId(), Types.id);
              break;

            case K_RUBTI_ID6:
              fields.add(C.RUBTI_ID_6, property.getSelectId(), Types.id);
              break;

            case K_RUBTI_ID7:
              fields.add(C.RUBTI_ID_7, property.getSelectId(), Types.id);
              break;

            case K_RUBTI_ID8:
              fields.add(C.RUBTI_ID_8, property.getSelectId(), Types.id);
              break;

            case K_RUBTI_ID9:
              fields.add(C.RUBTI_ID_9, property.getSelectId(), Types.id);
              break;

            case K_RUBTI_ID10:
              fields.add(C.RUBTI_ID_10, property.getSelectId(), Types.id);
              break;
          }
        }

        return Cairo.Database.saveEx(
          register,
          false,
          C.PRO_CODE,
          Cairo.Constants.CLIENT_SAVE_FUNCTION,
          C_MODULE,
          getText(1451, "")).then(

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
        return "#general/rubro/" + m_id.toString();
      };

      self.getEditorName = function() {
        var id = m_id ? m_id.toString() : "N" + (new Date).getTime().toString();
        return "rubro" + id;
      };

      self.getTitle = function() {
        return getText(1299, ""); // Rubro
      };

      self.validate = function() {
        var property = null;

        var _count = m_dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {
          property = m_dialog.getProperties().item(_i);
          switch (property.getKey()) {
            case K_NAME:
              if(Cairo.Util.valEmpty(property.getValue(), Types.text)) {
                return Cairo.Modal.showInfoWithFalse(Cairo.Constants.MUST_SET_A_NAME);
              }
              break;

            case K_CODE:
              if(Cairo.Util.valEmpty(property.getValue(), Types.text)) {
                property.setValue(Cairo.Constants.GET_CODE_FROM_ID);
              }
              break;
          }
        }

        return Cairo.Promises.resolvedPromise(true);
      };

      self.getDialog = function() {
        return m_dialog;
      };

      self.setTreeId = function(rhs) {
        m_treeId = rhs;
      };

      self.getTreeId = function() {
        return m_treeId;
      };

      self.list = function() {
        return Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.LIST_RUBRO);
      };

      self.setDialog = function(rhs) {
        m_dialog = rhs;
      };

      self.isEditing = function() {
        return m_editing;
      };

      self.edit = function(id, inModalWindow) {
        var p = Cairo.Promises.resolvedPromise(false);
        try {

          if(id === NO_ID) {
            m_isNew = true;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.NEW_RUBRO)) { return p; }
          }
          else {
            m_isNew = false;
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.EDIT_RUBRO)) { return p; }
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
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, Cairo.Constants.EDIT_FUNCTION, "cProvincia", "");
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

        var w_tabs = m_dialog.getTabs();

        w_tabs.clear();

        var tab = w_tabs.add(null);
        tab.setName(Cairo.Constants.TAB_GENERAL);

        tab = w_tabs.add(null);
        tab.setIndex(1);
        tab.setName(getText(1430, "")); // Tablas

        m_dialog.setTitle(m_name);
        
        var properties = m_dialog.getProperties();

        properties.clear();

        var elem = properties.add(null, C.RUB_NAME);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.NAME_LABEL);
        elem.setSize(100);
        elem.setKey(K_NAME);
        elem.setValue(m_name);

        elem = properties.add(null, C.RUB_CODE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setSize(15);
        elem.setValue(m_code);
        elem.setKey(K_CODE);

        elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVE);
        elem.setValue(Cairo.Util.boolToInt(m_active));

        elem = properties.add(null, C.RUB_ES_CRITERIO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(4736, "")); // Es un criterio de busqueda
        elem.setKey(K_ESCRITERIO);
        elem.setValue(Cairo.Util.boolToInt(m_esCriterio));

        elem = properties.add(null, C.RUB_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setSize(255);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);
        elem.setSubType(Dialogs.PropertySubType.memo);

        elem = properties.add(null, C.RUBT_ID_1);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setName(getText(1431, "")); // Tabla 1
        elem.setKey(K_RUBT_ID1);
        elem.setValue(m_tabla1);
        elem.setSelectId(m_rubtId1);
        elem.setTabIndex(1);

        elem = properties.add(null, C.RUBTI_ID_1);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setSelectFilter(D.getRubroTablaItemFilter(m_rubtId1));
        elem.setName(getText(1432, "")); // Item 1
        elem.setKey(K_RUBTI_ID1);
        elem.setValue(m_tablaItem1);
        elem.setSelectId(m_rubtiId1);
        elem.setTabIndex(1);

        elem = properties.add(null, C.RUBT_ID_2);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setName(getText(1433, "")); // Tabla 2
        elem.setKey(K_RUBT_ID2);
        elem.setValue(m_tabla2);
        elem.setSelectId(m_rubtId2);
        elem.setTabIndex(1);

        elem = properties.add(null, C.RUBTI_ID_2);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setSelectFilter(D.getRubroTablaItemFilter(m_rubtId2));
        elem.setName(getText(1434, "")); // Item 2
        elem.setKey(K_RUBTI_ID2);
        elem.setValue(m_tablaItem2);
        elem.setSelectId(m_rubtiId2);
        elem.setTabIndex(1);

        elem = properties.add(null, C.RUBT_ID_3);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setName(getText(1435, "")); // Tabla 3
        elem.setKey(K_RUBT_ID3);
        elem.setValue(m_tabla3);
        elem.setSelectId(m_rubtId3);
        elem.setTabIndex(1);

        elem = properties.add(null, C.RUBTI_ID_3);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setSelectFilter(D.getRubroTablaItemFilter(m_rubtId3));
        elem.setName(getText(1436, "")); // Item 3
        elem.setKey(K_RUBTI_ID3);
        elem.setValue(m_tablaItem3);
        elem.setSelectId(m_rubtiId3);
        elem.setTabIndex(1);

        elem = properties.add(null, C.RUBT_ID_4);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setName(getText(1437, "")); // Tabla 4
        elem.setKey(K_RUBT_ID4);
        elem.setValue(m_tabla4);
        elem.setSelectId(m_rubtId4);
        elem.setTabIndex(1);

        elem = properties.add(null, C.RUBTI_ID_4);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setSelectFilter(D.getRubroTablaItemFilter(m_rubtId4));
        elem.setName(getText(1438, "")); // Item 4
        elem.setKey(K_RUBTI_ID4);
        elem.setValue(m_tablaItem4);
        elem.setSelectId(m_rubtiId4);
        elem.setTabIndex(1);

        elem = properties.add(null, C.RUBT_ID_5);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setName(getText(1439, "")); // Tabla 5
        elem.setKey(K_RUBT_ID5);
        elem.setValue(m_tabla5);
        elem.setSelectId(m_rubtId5);
        elem.setTabIndex(1);

        elem = properties.add(null, C.RUBTI_ID_5);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setSelectFilter(D.getRubroTablaItemFilter(m_rubtId5));
        elem.setName(getText(1440, "")); // Item 5
        elem.setKey(K_RUBTI_ID5);
        elem.setValue(m_tablaItem5);
        elem.setSelectId(m_rubtiId5);
        elem.setTabIndex(1);

        elem = properties.add(null, C.RUBT_ID_6);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setName(getText(1441, "")); // Tabla 6
        elem.setKey(K_RUBT_ID6);
        elem.setValue(m_tabla6);
        elem.setSelectId(m_rubtId6);
        elem.setTabIndex(1);

        elem = properties.add(null, C.RUBTI_ID_6);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setSelectFilter(D.getRubroTablaItemFilter(m_rubtId6));
        elem.setName(getText(1442, "")); // Item 6
        elem.setKey(K_RUBTI_ID6);
        elem.setValue(m_tablaItem6);
        elem.setSelectId(m_rubtiId6);
        elem.setTabIndex(1);

        elem = properties.add(null, C.RUBT_ID_7);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setName(getText(1443, "")); // Tabla 7
        elem.setKey(K_RUBT_ID7);
        elem.setValue(m_tabla7);
        elem.setSelectId(m_rubtId7);
        elem.setTabIndex(1);

        elem = properties.add(null, C.RUBTI_ID_7);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setSelectFilter(D.getRubroTablaItemFilter(m_rubtId7));
        elem.setName(getText(1444, "")); // Item 7
        elem.setKey(K_RUBTI_ID7);
        elem.setValue(m_tablaItem7);
        elem.setSelectId(m_rubtiId7);
        elem.setTabIndex(1);

        elem = properties.add(null, C.RUBT_ID_8);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setName(getText(1445, "")); // Tabla 8
        elem.setKey(K_RUBT_ID8);
        elem.setValue(m_tabla8);
        elem.setSelectId(m_rubtId8);
        elem.setTabIndex(1);

        elem = properties.add(null, C.RUBTI_ID_8);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setSelectFilter(D.getRubroTablaItemFilter(m_rubtId8));
        elem.setName(getText(1446, "")); // Item 8
        elem.setKey(K_RUBTI_ID8);
        elem.setValue(m_tablaItem8);
        elem.setSelectId(m_rubtiId8);
        elem.setTabIndex(1);

        elem = properties.add(null, C.RUBT_ID_9);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setName(getText(1447, "")); // Tabla 9
        elem.setKey(K_RUBT_ID9);
        elem.setValue(m_tabla9);
        elem.setSelectId(m_rubtId9);
        elem.setTabIndex(1);

        elem = properties.add(null, C.RUBTI_ID_9);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setSelectFilter(D.getRubroTablaItemFilter(m_rubtId9));
        elem.setName(getText(1448, "")); // Item 9
        elem.setKey(K_RUBTI_ID9);
        elem.setValue(m_tablaItem9);
        elem.setSelectId(m_rubtiId9);
        elem.setTabIndex(1);

        elem = properties.add(null, C.RUBT_ID_10);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setName(getText(1449, "")); // Tabla 10
        elem.setKey(K_RUBT_ID10);
        elem.setValue(m_tabla10);
        elem.setSelectId(m_rubtId10);
        elem.setTabIndex(1);

        elem = properties.add(null, C.RUBTI_ID_10);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setSelectFilter(D.getRubroTablaItemFilter(m_rubtId10));
        elem.setName(getText(1450, "")); // Item 10
        elem.setKey(K_RUBTI_ID10);
        elem.setValue(m_tablaItem10);
        elem.setSelectId(m_rubtiId10);
        elem.setTabIndex(1);

        return m_dialog.show(self);
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(C.RUB_NAME);
        elem.setValue(m_name);

        elem = properties.item(C.RUB_CODE);
        elem.setValue(m_code);

        elem = properties.item(Cairo.Constants.ACTIVE);
        elem.setValue(Cairo.Util.boolToInt(m_active));

        elem = properties.item(C.RUB_ES_CRITERIO);
        elem.setValue(Cairo.Util.boolToInt(m_esCriterio));

        elem = properties.item(C.RUB_DESCRIP);
        elem.setValue(m_descrip);

        elem = properties.item(C.RUBT_ID_1);
        elem.setValue(m_tabla1);
        elem.setSelectId(m_rubtId1);

        elem = properties.item(C.RUBTI_ID_1);
        elem.setValue(m_tablaItem1);
        elem.setSelectId(m_rubtiId1);

        elem = properties.item(C.RUBT_ID_2);
        elem.setValue(m_tabla2);
        elem.setSelectId(m_rubtId2);

        elem = properties.item(C.RUBTI_ID_2);
        elem.setValue(m_tablaItem2);
        elem.setSelectId(m_rubtiId2);

        elem = properties.item(C.RUBT_ID_3);
        elem.setValue(m_tabla3);
        elem.setSelectId(m_rubtId3);

        elem = properties.item(C.RUBTI_ID_3);
        elem.setValue(m_tablaItem3);
        elem.setSelectId(m_rubtiId3);

        elem = properties.item(C.RUBT_ID_4);
        elem.setValue(m_tabla4);
        elem.setSelectId(m_rubtId4);

        elem = properties.item(C.RUBTI_ID_4);
        elem.setValue(m_tablaItem4);
        elem.setSelectId(m_rubtiId4);

        elem = properties.item(C.RUBT_ID_5);
        elem.setValue(m_tabla5);
        elem.setSelectId(m_rubtId5);

        elem = properties.item(C.RUBTI_ID_5);
        elem.setValue(m_tablaItem5);
        elem.setSelectId(m_rubtiId5);

        elem = properties.item(C.RUBT_ID_6);
        elem.setValue(m_tabla6);
        elem.setSelectId(m_rubtId6);

        elem = properties.item(C.RUBTI_ID_6);
        elem.setValue(m_tablaItem6);
        elem.setSelectId(m_rubtiId6);

        elem = properties.item(C.RUBT_ID_7);
        elem.setValue(m_tabla7);
        elem.setSelectId(m_rubtId7);

        elem = properties.item(C.RUBTI_ID_7);
        elem.setValue(m_tablaItem7);
        elem.setSelectId(m_rubtiId7);

        elem = properties.item(C.RUBT_ID_8);
        elem.setValue(m_tabla8);
        elem.setSelectId(m_rubtId8);

        elem = properties.item(C.RUBTI_ID_8);
        elem.setValue(m_tablaItem8);
        elem.setSelectId(m_rubtiId8);

        elem = properties.item(C.RUBT_ID_9);
        elem.setValue(m_tabla9);
        elem.setSelectId(m_rubtId9);

        elem = properties.item(C.RUBTI_ID_9);
        elem.setValue(m_tablaItem9);
        elem.setSelectId(m_rubtiId9);

        elem = properties.item(C.RUBT_ID_10);
        elem.setValue(m_tabla10);
        elem.setSelectId(m_rubtId10);

        elem = properties.item(C.RUBTI_ID_10);
        elem.setValue(m_tablaItem10);
        elem.setSelectId(m_rubtiId10);

        return m_dialog.showValues(properties);
      };

      var load = function(id) {

        return DB.getData("load[" + m_apiPath + "general/rubro]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id === NO_ID) {
              m_active = true;
              m_esCriterio = false;
              m_name = "";
              m_code = "";
              m_id = NO_ID;
              m_descrip = "";

              m_rubtId1 = NO_ID;
              m_rubtId2 = NO_ID;
              m_rubtId3 = NO_ID;
              m_rubtId4 = NO_ID;
              m_rubtId5 = NO_ID;
              m_rubtId6 = NO_ID;
              m_rubtId7 = NO_ID;
              m_rubtId8 = NO_ID;
              m_rubtId9 = NO_ID;
              m_rubtId10 = NO_ID;

              m_tabla1 = "";
              m_tabla2 = "";
              m_tabla3 = "";
              m_tabla4 = "";
              m_tabla5 = "";
              m_tabla6 = "";
              m_tabla7 = "";
              m_tabla8 = "";
              m_tabla9 = "";
              m_tabla10 = "";

              m_rubtiId1 = NO_ID;
              m_rubtiId2 = NO_ID;
              m_rubtiId3 = NO_ID;
              m_rubtiId4 = NO_ID;
              m_rubtiId5 = NO_ID;
              m_rubtiId6 = NO_ID;
              m_rubtiId7 = NO_ID;
              m_rubtiId8 = NO_ID;
              m_rubtiId9 = NO_ID;
              m_rubtiId10 = NO_ID;

              m_tablaItem1 = "";
              m_tablaItem2 = "";
              m_tablaItem3 = "";
              m_tablaItem4 = "";
              m_tablaItem5 = "";
              m_tablaItem6 = "";
              m_tablaItem7 = "";
              m_tablaItem8 = "";
              m_tablaItem9 = "";
              m_tablaItem10 = "";

            }
            else {
              m_active = DB.valField(response.data, Cairo.Constants.ACTIVE);
              m_esCriterio = DB.valField(response.data, C.RUB_ES_CRITERIO);
              m_name = DB.valField(response.data, C.RUB_NAME);
              m_code = DB.valField(response.data, C.RUB_CODE);
              m_id = DB.valField(response.data, C.RUB_ID);
              m_descrip = DB.valField(response.data, C.RUB_DESCRIP);

              m_rubtId1 = DB.valField(response.data, C.RUBT_ID_1);
              m_rubtId2 = DB.valField(response.data, C.RUBT_ID_2);
              m_rubtId3 = DB.valField(response.data, C.RUBT_ID_3);
              m_rubtId4 = DB.valField(response.data, C.RUBT_ID_4);
              m_rubtId5 = DB.valField(response.data, C.RUBT_ID_5);
              m_rubtId6 = DB.valField(response.data, C.RUBT_ID_6);
              m_rubtId7 = DB.valField(response.data, C.RUBT_ID_7);
              m_rubtId8 = DB.valField(response.data, C.RUBT_ID_8);
              m_rubtId9 = DB.valField(response.data, C.RUBT_ID_9);
              m_rubtId10 = DB.valField(response.data, C.RUBT_ID_10);

              m_tabla1 = DB.valField(response.data, C.RUBT_NAME_1);
              m_tabla2 = DB.valField(response.data, C.RUBT_NAME_2);
              m_tabla3 = DB.valField(response.data, C.RUBT_NAME_3);
              m_tabla4 = DB.valField(response.data, C.RUBT_NAME_4);
              m_tabla5 = DB.valField(response.data, C.RUBT_NAME_5);
              m_tabla6 = DB.valField(response.data, C.RUBT_NAME_6);
              m_tabla7 = DB.valField(response.data, C.RUBT_NAME_7);
              m_tabla8 = DB.valField(response.data, C.RUBT_NAME_8);
              m_tabla9 = DB.valField(response.data, C.RUBT_NAME_9);
              m_tabla10 = DB.valField(response.data, C.RUBT_NAME_10);

              m_rubtiId1 = DB.valField(response.data, C.RUBTI_ID_1);
              m_rubtiId2 = DB.valField(response.data, C.RUBTI_ID_2);
              m_rubtiId3 = DB.valField(response.data, C.RUBTI_ID_3);
              m_rubtiId4 = DB.valField(response.data, C.RUBTI_ID_4);
              m_rubtiId5 = DB.valField(response.data, C.RUBTI_ID_5);
              m_rubtiId6 = DB.valField(response.data, C.RUBTI_ID_6);
              m_rubtiId7 = DB.valField(response.data, C.RUBTI_ID_7);
              m_rubtiId8 = DB.valField(response.data, C.RUBTI_ID_8);
              m_rubtiId9 = DB.valField(response.data, C.RUBTI_ID_9);
              m_rubtiId10 = DB.valField(response.data, C.RUBTI_ID_10);

              m_tablaItem1 = DB.valField(response.data, C.RUBTI_NAME_1);
              m_tablaItem2 = DB.valField(response.data, C.RUBTI_NAME_2);
              m_tablaItem3 = DB.valField(response.data, C.RUBTI_NAME_3);
              m_tablaItem4 = DB.valField(response.data, C.RUBTI_NAME_4);
              m_tablaItem5 = DB.valField(response.data, C.RUBTI_NAME_5);
              m_tablaItem6 = DB.valField(response.data, C.RUBTI_NAME_6);
              m_tablaItem7 = DB.valField(response.data, C.RUBTI_NAME_7);
              m_tablaItem8 = DB.valField(response.data, C.RUBTI_NAME_8);
              m_tablaItem9 = DB.valField(response.data, C.RUBTI_NAME_9);
              m_tablaItem10 = DB.valField(response.data, C.RUBTI_NAME_10);
            }

            return true;
          });
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

      return self;
    };

    Edit.Controller = { getEditor: createObject };

    Edit.Controller.edit = function(id) {
      var editor = Cairo.Rubro.Edit.Controller.getEditor();
      var dialog = Cairo.Dialogs.Views.Controller.newDialog();

      editor.setDialog(dialog);
      editor.edit(id);
    };

  });

  Cairo.module("Rubro.List", function(List, Cairo, Backbone, Marionette, $, _) {

    var NO_ID = Cairo.Constants.NO_ID;

    List.Controller = {
      list: function() {

        var self = this;
        var m_apiPath = Cairo.Database.getAPIVersion();

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createTreeDialog = function(tabId) {

          var editors = Cairo.Editors.rubroEditors || Cairo.Collections.createCollection(null);
          Cairo.Editors.rubroEditors = editors;

          // ListController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entitiesTitle: "Rubros",
            entityName: "rubro",
            entitiesName: "rubros"
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
              var editor = Cairo.Rubro.Edit.Controller.getEditor();
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
            if(!Cairo.Security.hasPermissionTo(Cairo.Security.Actions.General.DELETE_RUBRO)) {
              return Cairo.Promises.resolvedPromise(false);
            }
            return Cairo.Database.destroy(m_apiPath + "general/rubro", id, Cairo.Constants.DELETE_FUNCTION, "Rubro").whenSuccess(
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
          Cairo.LoadingMessage.show("Rubros", "Loading Rubros from CrowSoft Cairo server.");

          // create the tree region
          //
          Cairo.addRegions({ rubroTreeRegion: tabId });

          // create the dialog
          //
          Cairo.Tree.List.Controller.list(
            Cairo.Tables.RUBROS,
            new Cairo.Tree.List.TreeLayout({ model: self.entityInfo }),
            Cairo.rubroTreeRegion,
            self);

        };

        var showTreeDialog = function() {
          Cairo.Tree.List.Controller.showTreeDialog(self);
        };

        var closeTreeDialog = function() {

        }

        // create the tab
        //
        Cairo.mainTab.showTab("Rubros", "rubroTreeRegion", "#general/rubros", createTreeDialog, closeTreeDialog, showTreeDialog);

      }
    };
  });
  
}());