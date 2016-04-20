(function() {
  "use strict";

  Cairo.module("Rubro.Load", function(Load, Cairo, Backbone, Marionette, $, _) {

    Load.createRubro = function() {

      var init = function() {
        return {
          rubId: 0,
          rubName: "",
          rubtId1: 0,
          rubtName1: "",
          rubtId2: 0,
          rubtName2: "",
          rubtId3: 0,
          rubtName3: "",
          rubtId4: 0,
          rubtName4: "",
          rubtId5: 0,
          rubtName5: "",
          rubtId6: 0,
          rubtName6: "",
          rubtId7: 0,
          rubtName7: "",
          rubtId8: 0,
          rubtName8: "",
          rubtId9: 0,
          rubtName9: "",
          rubtId10: 0,
          rubtName10: "",
          rubtiId1: 0,
          rubtiName1: "",
          rubtiId2: 0,
          rubtiName2: "",
          rubtiId3: 0,
          rubtiName3: "",
          rubtiId4: 0,
          rubtiName4: "",
          rubtiId5: 0,
          rubtiName5: "",
          rubtiId6: 0,
          rubtiName6: "",
          rubtiId7: 0,
          rubtiName7: "",
          rubtiId8: 0,
          rubtiName8: "",
          rubtiId9: 0,
          rubtiName9: "",
          rubtiId10: 0,
          rubtiName10: ""
        };
      };

      var self = init();

      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;

      var m_apiPath = DB.getAPIVersion();

      var that = {};

      that.load = function(rubId) {
        return DB.getData("load[" + m_apiPath + "general/rubro]", rubId).then(
          function(response) {

            if(response.success !== true) { return false; }

            that.loadFromData(response.data);

            return true;
          });
      };

      that.loadFromData = function(data) {

        if(data.id === NO_ID) {
          self = init;
        }
        else {
          self.rubId = DB.valField(data, C.RUB_ID);
          self.rubName = DB.valField(data, C.RUB_NAME);
          
          self.rubtId1 = DB.valField(data, C.RUBT_ID_1);
          self.rubtName1 = DB.valField(data, C.RUBT_NAME_1);
          self.rubtId2 = DB.valField(data, C.RUBT_ID_2);
          self.rubtName2 = DB.valField(data, C.RUBT_NAME_2);
          self.rubtId3 = DB.valField(data, C.RUBT_ID_3);
          self.rubtName3 = DB.valField(data, C.RUBT_NAME_3);
          self.rubtId4 = DB.valField(data, C.RUBT_ID_4);
          self.rubtName4 = DB.valField(data, C.RUBT_NAME_4);
          self.rubtId5 = DB.valField(data, C.RUBT_ID_5);
          self.rubtName5 = DB.valField(data, C.RUBT_NAME_5);
          self.rubtId6 = DB.valField(data, C.RUBT_ID_6);
          self.rubtName6 = DB.valField(data, C.RUBT_NAME_6);
          self.rubtId7 = DB.valField(data, C.RUBT_ID_7);
          self.rubtName7 = DB.valField(data, C.RUBT_NAME_7);
          self.rubtId8 = DB.valField(data, C.RUBT_ID_8);
          self.rubtName8 = DB.valField(data, C.RUBT_NAME_8);
          self.rubtId9 = DB.valField(data, C.RUBT_ID_9);
          self.rubtName9 = DB.valField(data, C.RUBT_NAME_9);
          self.rubtId10 = DB.valField(data, C.RUBT_ID_10);
          self.rubtName10 = DB.valField(data, C.RUBT_NAME_10);

          self.rubtiId1 = DB.valField(data, C.RUBTI_ID_1);
          self.rubtiName1 = DB.valField(data, C.RUBTI_NAME_1);
          self.rubtiId2 = DB.valField(data, C.RUBTI_ID_2);
          self.rubtiName2 = DB.valField(data, C.RUBTI_NAME_2);
          self.rubtiId3 = DB.valField(data, C.RUBTI_ID_3);
          self.rubtiName3 = DB.valField(data, C.RUBTI_NAME_3);
          self.rubtiId4 = DB.valField(data, C.RUBTI_ID_4);
          self.rubtiName4 = DB.valField(data, C.RUBTI_NAME_4);
          self.rubtiId5 = DB.valField(data, C.RUBTI_ID_5);
          self.rubtiName5 = DB.valField(data, C.RUBTI_NAME_5);
          self.rubtiId6 = DB.valField(data, C.RUBTI_ID_6);
          self.rubtiName6 = DB.valField(data, C.RUBTI_NAME_6);
          self.rubtiId7 = DB.valField(data, C.RUBTI_ID_7);
          self.rubtiName7 = DB.valField(data, C.RUBTI_NAME_7);
          self.rubtiId8 = DB.valField(data, C.RUBTI_ID_8);
          self.rubtiName8 = DB.valField(data, C.RUBTI_NAME_8);
          self.rubtiId9 = DB.valField(data, C.RUBTI_ID_9);
          self.rubtiName9 = DB.valField(data, C.RUBTI_NAME_9);
          self.rubtiId10 = DB.valField(data, C.RUBTI_ID_10);
          self.rubtiName10 = DB.valField(data, C.RUBTI_NAME_10);
          
        }

      };

      that.getRubtId1 = function() { return self.rubtId1; };
      that.getRubtId2 = function() { return self.rubtId2; };
      that.getRubtId3 = function() { return self.rubtId3; };
      that.getRubtId4 = function() { return self.rubtId4; };
      that.getRubtId5 = function() { return self.rubtId5; };
      that.getRubtId6 = function() { return self.rubtId6; };
      that.getRubtId7 = function() { return self.rubtId7; };
      that.getRubtId8 = function() { return self.rubtId8; };
      that.getRubtId9 = function() { return self.rubtId9; };
      that.getRubtId10 = function() { return self.rubtId10; };

      that.getRubtName1 = function() { return self.rubtName1; };
      that.getRubtName2 = function() { return self.rubtName2; };
      that.getRubtName3 = function() { return self.rubtName3; };
      that.getRubtName4 = function() { return self.rubtName4; };
      that.getRubtName5 = function() { return self.rubtName5; };
      that.getRubtName6 = function() { return self.rubtName6; };
      that.getRubtName7 = function() { return self.rubtName7; };
      that.getRubtName8 = function() { return self.rubtName8; };
      that.getRubtName9 = function() { return self.rubtName9; };
      that.getRubtName10 = function() { return self.rubtName10; };

      that.getRubtiId1 = function() { return self.rubtiId1; };
      that.getRubtiId2 = function() { return self.rubtiId2; };
      that.getRubtiId3 = function() { return self.rubtiId3; };
      that.getRubtiId4 = function() { return self.rubtiId4; };
      that.getRubtiId5 = function() { return self.rubtiId5; };
      that.getRubtiId6 = function() { return self.rubtiId6; };
      that.getRubtiId7 = function() { return self.rubtiId7; };
      that.getRubtiId8 = function() { return self.rubtiId8; };
      that.getRubtiId9 = function() { return self.rubtiId9; };
      that.getRubtiId10 = function() { return self.rubtiId10; };

      that.getRubtiName1 = function() { return self.rubtiName1; };
      that.getRubtiName2 = function() { return self.rubtiName2; };
      that.getRubtiName3 = function() { return self.rubtiName3; };
      that.getRubtiName4 = function() { return self.rubtiName4; };
      that.getRubtiName5 = function() { return self.rubtiName5; };
      that.getRubtiName6 = function() { return self.rubtiName6; };
      that.getRubtiName7 = function() { return self.rubtiName7; };
      that.getRubtiName8 = function() { return self.rubtiName8; };
      that.getRubtiName9 = function() { return self.rubtiName9; };
      that.getRubtiName10 = function() { return self.rubtiName10; };      
      
      return that;
    };

  });

  Cairo.module("Rubro.Edit", function(Edit, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;

      var Dialogs = Cairo.Dialogs;
      var DB = Cairo.Database;
      var C = Cairo.General.Constants;
      var NO_ID = Cairo.Constants.NO_ID;
      var D = Cairo.Documents;

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
        var _rtn = null;
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
              fields.add(C.RUB_NAME, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_CODE:
              fields.add(C.RUB_CODE, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_ACTIVE:
              fields.add(Cairo.Constants.ACTIVE, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.boolean);
              break;

            case K_DESCRIP:
              fields.add(C.RUB_DESCRIP, property.getValue(), Cairo.Constants.Types.text);
              break;

            case K_ESCRITERIO:
              fields.add(C.RUB_ES_CRITERIO, Cairo.Util.val(property.getValue()), Cairo.Constants.Types.boolean);
              break;

            case K_RUBT_ID1:
              fields.add(C.RUBT_ID_1, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBT_ID2:
              fields.add(C.RUBT_ID_2, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBT_ID3:
              fields.add(C.RUBT_ID_3, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBT_ID4:
              fields.add(C.RUBT_ID_4, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBT_ID5:
              fields.add(C.RUBT_ID_5, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBT_ID6:
              fields.add(C.RUBT_ID_6, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBT_ID7:
              fields.add(C.RUBT_ID_7, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBT_ID8:
              fields.add(C.RUBT_ID_8, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBT_ID9:
              fields.add(C.RUBT_ID_9, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBT_ID10:
              fields.add(C.RUBT_ID_10, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBTI_ID1:
              fields.add(C.RUBTI_ID_1, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBTI_ID2:
              fields.add(C.RUBTI_ID_2, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBTI_ID3:
              fields.add(C.RUBTI_ID_3, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBTI_ID4:
              fields.add(C.RUBTI_ID_4, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBTI_ID5:
              fields.add(C.RUBTI_ID_5, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBTI_ID6:
              fields.add(C.RUBTI_ID_6, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBTI_ID7:
              fields.add(C.RUBTI_ID_7, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBTI_ID8:
              fields.add(C.RUBTI_ID_8, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBTI_ID9:
              fields.add(C.RUBTI_ID_9, property.getSelectId(), Cairo.Constants.Types.id);
              break;

            case K_RUBTI_ID10:
              fields.add(C.RUBTI_ID_10, property.getSelectId(), Cairo.Constants.Types.id);
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
                  };
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
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.text)) {
                return Cairo.Modal.showInfoWithFalse(Cairo.Constants.MUST_SET_A_NAME);
              }
              break;

            case K_CODE:
              if(Cairo.Util.valEmpty(property.getValue(), Cairo.Constants.Types.text)) {
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

        var tab = w_tabs.add(null);
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

        var elem = properties.add(null, C.RUB_CODE);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.CODE_LABEL);
        elem.setSize(15);
        elem.setValue(m_code);
        elem.setKey(K_CODE);

        var elem = properties.add(null, Cairo.Constants.ACTIVE);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(Cairo.Constants.ACTIVE_LABEL);
        elem.setKey(K_ACTIVE);
        elem.setValue(Cairo.Util.boolToInt(m_active));

        var elem = properties.add(null, C.RUB_ES_CRITERIO);
        elem.setType(Dialogs.PropertyType.check);
        elem.setName(getText(4736, "")); // Es un criterio de busqueda
        elem.setKey(K_ESCRITERIO);
        elem.setValue(Cairo.Util.boolToInt(m_esCriterio));

        var elem = properties.add(null, C.RUB_DESCRIP);
        elem.setType(Dialogs.PropertyType.text);
        elem.setName(Cairo.Constants.DESCRIPTION_LABEL);
        elem.setSize(255);
        elem.setKey(K_DESCRIP);
        elem.setValue(m_descrip);
        elem.setSubType(Dialogs.PropertySubType.memo);

        var elem = properties.add(null, C.RUBT_ID_1);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setName(getText(1431, "")); // Tabla 1
        elem.setKey(K_RUBT_ID1);
        elem.setValue(m_tabla1);
        elem.setSelectId(m_rubtId1);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.RUBTI_ID_1);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.RUBRO_TABLA_ITEM);
        elem.setSelectFilter(D.getRubroTablaItemFilter(m_rubtId1));
        elem.setName(getText(1432, "")); // Item 1
        elem.setKey(K_RUBTI_ID1);
        elem.setValue(m_tablaItem1);
        elem.setSelectId(m_rubtiId1);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.RUBT_ID_2);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setName(getText(1433, "")); // Tabla 2
        elem.setKey(K_RUBT_ID2);
        elem.setValue(m_tabla2);
        elem.setSelectId(m_rubtId2);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.RUBTI_ID_2);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.RUBRO_TABLA_ITEM);
        elem.setSelectFilter(D.getRubroTablaItemFilter(m_rubtId2));
        elem.setName(getText(1434, "")); // Item 2
        elem.setKey(K_RUBTI_ID2);
        elem.setValue(m_tablaItem2);
        elem.setSelectId(m_rubtiId2);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.RUBT_ID_3);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setName(getText(1435, "")); // Tabla 3
        elem.setKey(K_RUBT_ID3);
        elem.setValue(m_tabla3);
        elem.setSelectId(m_rubtId3);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.RUBTI_ID_3);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.RUBRO_TABLA_ITEM);
        elem.setSelectFilter(D.getRubroTablaItemFilter(m_rubtId3));
        elem.setName(getText(1436, "")); // Item 3
        elem.setKey(K_RUBTI_ID3);
        elem.setValue(m_tablaItem3);
        elem.setSelectId(m_rubtiId3);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.RUBT_ID_4);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setName(getText(1437, "")); // Tabla 4
        elem.setKey(K_RUBT_ID4);
        elem.setValue(m_tabla4);
        elem.setSelectId(m_rubtId4);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.RUBTI_ID_4);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.RUBRO_TABLA_ITEM);
        elem.setSelectFilter(D.getRubroTablaItemFilter(m_rubtId4));
        elem.setName(getText(1438, "")); // Item 4
        elem.setKey(K_RUBTI_ID4);
        elem.setValue(m_tablaItem4);
        elem.setSelectId(m_rubtiId4);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.RUBT_ID_5);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setName(getText(1439, "")); // Tabla 5
        elem.setKey(K_RUBT_ID5);
        elem.setValue(m_tabla5);
        elem.setSelectId(m_rubtId5);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.RUBTI_ID_5);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.RUBRO_TABLA_ITEM);
        elem.setSelectFilter(D.getRubroTablaItemFilter(m_rubtId5));
        elem.setName(getText(1440, "")); // Item 5
        elem.setKey(K_RUBTI_ID5);
        elem.setValue(m_tablaItem5);
        elem.setSelectId(m_rubtiId5);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.RUBT_ID_6);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setName(getText(1441, "")); // Tabla 6
        elem.setKey(K_RUBT_ID6);
        elem.setValue(m_tabla6);
        elem.setSelectId(m_rubtId6);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.RUBTI_ID_6);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.RUBRO_TABLA_ITEM);
        elem.setSelectFilter(D.getRubroTablaItemFilter(m_rubtId6));
        elem.setName(getText(1442, "")); // Item 6
        elem.setKey(K_RUBTI_ID6);
        elem.setValue(m_tablaItem6);
        elem.setSelectId(m_rubtiId6);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.RUBT_ID_7);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setName(getText(1443, "")); // Tabla 7
        elem.setKey(K_RUBT_ID7);
        elem.setValue(m_tabla7);
        elem.setSelectId(m_rubtId7);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.RUBTI_ID_7);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.RUBRO_TABLA_ITEM);
        elem.setSelectFilter(D.getRubroTablaItemFilter(m_rubtId7));
        elem.setName(getText(1444, "")); // Item 7
        elem.setKey(K_RUBTI_ID7);
        elem.setValue(m_tablaItem7);
        elem.setSelectId(m_rubtiId7);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.RUBT_ID_8);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setName(getText(1445, "")); // Tabla 8
        elem.setKey(K_RUBT_ID8);
        elem.setValue(m_tabla8);
        elem.setSelectId(m_rubtId8);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.RUBTI_ID_8);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.RUBRO_TABLA_ITEM);
        elem.setSelectFilter(D.getRubroTablaItemFilter(m_rubtId8));
        elem.setName(getText(1446, "")); // Item 8
        elem.setKey(K_RUBTI_ID8);
        elem.setValue(m_tablaItem8);
        elem.setSelectId(m_rubtiId8);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.RUBT_ID_9);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setName(getText(1447, "")); // Tabla 9
        elem.setKey(K_RUBT_ID9);
        elem.setValue(m_tabla9);
        elem.setSelectId(m_rubtId9);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.RUBTI_ID_9);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.RUBRO_TABLA_ITEM);
        elem.setSelectFilter(D.getRubroTablaItemFilter(m_rubtId9));
        elem.setName(getText(1448, "")); // Item 9
        elem.setKey(K_RUBTI_ID9);
        elem.setValue(m_tablaItem9);
        elem.setSelectId(m_rubtiId9);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.RUBT_ID_10);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.TABLAS_DE_RUBROS);
        elem.setName(getText(1449, "")); // Tabla 10
        elem.setKey(K_RUBT_ID10);
        elem.setValue(m_tabla10);
        elem.setSelectId(m_rubtId10);
        elem.setTabIndex(1);

        var elem = properties.add(null, C.RUBTI_ID_10);
        elem.setType(Dialogs.PropertyType.select);
        elem.setSelectTable(Cairo.Tables.RUBRO_TABLA_ITEM);
        elem.setSelectFilter(D.getRubroTablaItemFilter(m_rubtId10));
        elem.setName(getText(1450, "")); // Item 10
        elem.setKey(K_RUBTI_ID10);
        elem.setValue(m_tablaItem10);
        elem.setSelectId(m_rubtiId10);
        elem.setTabIndex(1);

        if(!m_dialog.show(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {

        m_dialog.setTitle(m_name);

        var properties = m_dialog.getProperties();

        var elem = properties.item(C.RUB_NAME);
        elem.setValue(m_name);

        var elem = properties.item(C.RUB_CODE);
        elem.setValue(m_code);

        var elem = properties.item(Cairo.Constants.ACTIVE);
        elem.setValue(Cairo.Util.boolToInt(m_active));

        var elem = properties.item(C.RUB_ES_CRITERIO);
        elem.setValue(Cairo.Util.boolToInt(m_esCriterio));

        var elem = properties.item(C.RUB_DESCRIP);
        elem.setValue(m_descrip);

        var elem = properties.item(C.RUBT_ID_1);
        elem.setValue(m_tabla1);
        elem.setSelectId(m_rubtId1);

        var elem = properties.item(C.RUBTI_ID_1);
        elem.setValue(m_tablaItem1);
        elem.setSelectId(m_rubtiId1);

        var elem = properties.item(C.RUBT_ID_2);
        elem.setValue(m_tabla2);
        elem.setSelectId(m_rubtId2);

        var elem = properties.item(C.RUBTI_ID_2);
        elem.setValue(m_tablaItem2);
        elem.setSelectId(m_rubtiId2);

        var elem = properties.item(C.RUBT_ID_3);
        elem.setValue(m_tabla3);
        elem.setSelectId(m_rubtId3);

        var elem = properties.item(C.RUBTI_ID_3);
        elem.setValue(m_tablaItem3);
        elem.setSelectId(m_rubtiId3);

        var elem = properties.item(C.RUBT_ID_4);
        elem.setValue(m_tabla4);
        elem.setSelectId(m_rubtId4);

        var elem = properties.item(C.RUBTI_ID_4);
        elem.setValue(m_tablaItem4);
        elem.setSelectId(m_rubtiId4);

        var elem = properties.item(C.RUBT_ID_5);
        elem.setValue(m_tabla5);
        elem.setSelectId(m_rubtId5);

        var elem = properties.item(C.RUBTI_ID_5);
        elem.setValue(m_tablaItem5);
        elem.setSelectId(m_rubtiId5);

        var elem = properties.item(C.RUBT_ID_6);
        elem.setValue(m_tabla6);
        elem.setSelectId(m_rubtId6);

        var elem = properties.item(C.RUBTI_ID_6);
        elem.setValue(m_tablaItem6);
        elem.setSelectId(m_rubtiId6);

        var elem = properties.item(C.RUBT_ID_7);
        elem.setValue(m_tabla7);
        elem.setSelectId(m_rubtId7);

        var elem = properties.item(C.RUBTI_ID_7);
        elem.setValue(m_tablaItem7);
        elem.setSelectId(m_rubtiId7);

        var elem = properties.item(C.RUBT_ID_8);
        elem.setValue(m_tabla8);
        elem.setSelectId(m_rubtId8);

        var elem = properties.item(C.RUBTI_ID_8);
        elem.setValue(m_tablaItem8);
        elem.setSelectId(m_rubtiId8);

        var elem = properties.item(C.RUBT_ID_9);
        elem.setValue(m_tabla9);
        elem.setSelectId(m_rubtId9);

        var elem = properties.item(C.RUBTI_ID_9);
        elem.setValue(m_tablaItem9);
        elem.setSelectId(m_rubtiId9);

        var elem = properties.item(C.RUBT_ID_10);
        elem.setValue(m_tabla10);
        elem.setSelectId(m_rubtId10);

        var elem = properties.item(C.RUBTI_ID_10);
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