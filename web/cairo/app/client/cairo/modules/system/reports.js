(function() {
  "use strict";

  var C_REPORT_PATH = "reports/report/";

  Cairo.module("Reports", function(Reports, Cairo, Backbone, Marionette, $, _) {

    Reports.createReports = function() {

      var C = Cairo.General.Constants;
      var DB = Cairo.Database;
      var valField = DB.valField;

      var getNextId = function() {
        return "rpt_" + Cairo.Util.getNextRandomId();
      };

      var createReport = function() {
        var self = {
          id: 0,
          name: '',
          descrip: ''
        };
        var that = {};
        that.init = function(id, name, descrip) {
          self.id = id;
          self.name = name;
          self.descrip = descrip;
        };
        that.getId = function() {
          return self.id;
        };
        that.getName = function() {
          return self.name;
        };
        that.getDescrip = function() {
          return self.descrip;
        };
        that.getPath = function() {
          return C_REPORT_PATH + self.id;
        };
        return that;
      };

      var createGroup = function() {
        var self = {
          id: getNextId(),
          name: '',
          reports: Cairo.Collections.createCollection(createReport)
        };
        var that = {};
        that.init = function(name) {
          self.name = name;
        };
        that.getId = function() {
          return self.id;
        };
        that.getName = function() {
          return self.name;
        };
        that.getReports = function() {
          return self.reports;
        };
        return that;
      };

      var m_groups = Cairo.Collections.createCollection(createGroup);

      var m_apiPath = Cairo.Database.getAPIVersion();

      var load = function() {

        m_groups.clear();

        return DB.getData("load[" + m_apiPath + "desktop/reports]").then(

          function(response) {

            if(response.success === true) {

              var lastGroup = '';
              var group = null;

              var reports = DB.getResultSetFromData(response.data);

              for(var _i = 0, count = reports.length; _i < count; _i += 1) {

                var infModulo = valField(reports[_i], C.INF_MODULO);
                if(lastGroup !== infModulo) {

                  lastGroup = infModulo;
                  group = m_groups.add(null);

                  group.init(infModulo);
                }
                var report = group.getReports().add(null);
                report.init(
                  valField(reports[_i], C.RPT_ID),
                  valField(reports[_i], C.RPT_NAME),
                  valField(reports[_i], C.RPT_DESCRIP)
                );
              }
            }

          });
      };

      var that = {};

      that.init = function() {
        return load();
      };

      that.getGroups = function() {
        return m_groups;
      };

      return that;
    };

  });

  Cairo.module("Reports.Report", function(Report, Cairo, Backbone, Marionette, $, _) {

    Cairo.Reports.ParameterType = {
      date: 1,
      select: 2,
      numeric: 3,
      sqlstmt: 4,
      text: 5,
      list: 6,
      check: 7
    };

    var T = Cairo.Dialogs.PropertyType;
    var RT = Cairo.Reports.ParameterType;

    var PROPERTY_TYPE_FROM_PARAM_TYPE = [];
    PROPERTY_TYPE_FROM_PARAM_TYPE[RT.date] = T.date;
    PROPERTY_TYPE_FROM_PARAM_TYPE[RT.select] = T.select;
    PROPERTY_TYPE_FROM_PARAM_TYPE[RT.numeric] = T.numeric;
    PROPERTY_TYPE_FROM_PARAM_TYPE[RT.sqlstmt] = T.list;
    PROPERTY_TYPE_FROM_PARAM_TYPE[RT.text] = T.text;
    PROPERTY_TYPE_FROM_PARAM_TYPE[RT.list] = T.list;
    PROPERTY_TYPE_FROM_PARAM_TYPE[RT.check] = T.check;

    var NO_ID = Cairo.Constants.NO_ID;
    var CS = Cairo.Security.Actions.Ventas;
    var DB = Cairo.Database;
    var C_MODULE = "Reports";
    var P = Cairo.Promises;

    var createParam = function() {
      var self = {
        id: 0,
        name: "",
        value: "",
        visible: false,
        paramType: 0,
        infpId: 0,
        tblId: 0,
        valueId: "0"
      }

      var that = {};

      that.getId = function() {
        return self.id;
      };
      that.setId = function(id) {
        self.id = id;
        return that;
      };
      that.getName = function() {
        return self.name;
      };
      that.setName = function(name) {
        self.name = name;
        return that;
      };
      that.getValue = function() {
        return self.value;
      };
      that.setValue = function(value) {
        self.value = value;
        return that;
      };
      that.getValueId = function() {
        return self.valueId;
      };
      that.setValueId = function(valueId) {
        self.valueId = valueId;
        return that;
      };
      that.getVisible = function() {
        return self.visible;
      };
      that.setVisible = function(visible) {
        self.visible = visible;
        return that;
      };
      that.getParamType = function() {
        return self.paramType;
      };
      that.setParamType = function(paramType) {
        self.paramType = paramType;
        return that;
      };
      that.getInfpId = function() {
        return self.infpId;
      };
      that.setInfpId = function(infpId) {
        self.infpId = infpId;
        return that;
      };
      that.getTblId = function() {
        return self.tblId;
      };
      that.setTblId = function(tblId) {
        self.tblId = tblId;
        return that;
      };
      return that;
    };

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;
      var NO_ID = Cairo.Constants.NO_ID;
      var D = Cairo.Documents;
      var M = Cairo.Modal;
      var C = Cairo.General.Constants;
      var Types = Cairo.Constants.Types;
      var Dialogs = Cairo.Dialogs;
      var val = Cairo.Util.val;
      var isDate = Cairo.Util.isDate;
      var getDateValue = Cairo.Util.getDateValue;
      var today = Cairo.Dates.today;
      var valField = DB.valField;
      var getValue = DB.getValue;
      var call = P.call;

      var m_dialog;
      var m_properties;

      var m_listController;

      var m_title = "";

      var m_id = NO_ID;
      var m_infId = NO_ID;
      var m_code = "";
      var m_descrip = "";

      var m_params = Cairo.Collections.createCollection(createParam);

      var m_menuLoaded;

      var m_apiPath = DB.getAPIVersion();
      var SAVE_ERROR = getText(2226, ""); //TODO: add new entry in language for this message // Error al grabar los párametros del reporte #1#

      self.show = function(id) {
        initialize();
        return load(id)
          .whenSuccess(loadCollection);
      };

      self.edit = function(rptId) {
        m_listController.edit(rptId);
      };

      self.deleteItem = function(rptId) {
        return m_listController.destroy(rptId);
      };

      self.showDocDigital = function() {
        Cairo.log('Error showDocDigital was called in reports editor');
      };

      self.getEnabledSearchParam = function() {
        return false;
      };

      self.getSearchParamTable = function() {
        return NO_ID;
      };

      self.getBackgroundColor = function() {
        return "#fff";
      };

      self.setSearchParam = function(id, name) {
        Cairo.log('Error setSearchParam was called in reports editor');
      };

      self.processMenu = function(index) {

      };

      var getPropertyType = function(type) {
        return PROPERTY_TYPE_FROM_PARAM_TYPE[type];
      };

      var createParamProperty = function(item, index, properties) {
        var p = m_properties.add(null)
          .setName(item.getName())
          .setType(getPropertyType(item.getParamType()))
          .setValue(item.getValue);

        switch(item.getParamType())

          case RT.date:


            break;

          case RT.select:

            p.setSelectTable(item.getTblId())
              .setSelectId(item.getValueId())
            break;

          case RT.numeric:

            p.setSubType(Dialogs.PropertySubType.double);
            break;

          case RT.sqlstmt:
          case RT.list:

            // TODO:
            break;
        }

      };

      var loadCollection = function() {

        m_properties.clear();

        m_params.each(createParamProperty, m_properties);

        createMenu();
        if(!m_dialog.showDocumentList(self)) { return false; }

        return true;
      };

      var refreshCollection = function() {
        return m_dialog.showValues(m_properties);
      };

      var load = function(id) {

        return DB.getData("load[" + m_apiPath + C_REPORT_PATH + "]", id).then(
          function(response) {

            if(response.success !== true) { return false; }

            if(response.data.id !== NO_ID) {

              m_id = response.data.id;
              m_infId = valField(response.data, C.INF_ID);
              m_code = valField(response.data, C.INF_CODE);
              m_descrip = valField(response.data, C.RPT_DESCRIP);

              loadParams(response.data.get('params'));

            }

            return true;
          }
        );
      };

      var loadParams = function(params) {

        m_params.clear();

        for(var i = 0, count = params.length; i < count; i += 1) {
          m_params.add(null)
            .setId(getValue(params[i], C.RPTP_ID))
            .setName(getValue(params[i], C.INFP_NAME))
            .setValue(getValue(params[i], C.RPTP_VALUE))
            .setVisible(getValue(params[i], C.RPTP_VISIBLE))
            .setInfpId(getValue(params[i], C.INFP_ID))
            .setParamType(getValue(params[i], C.INFP_TYPE))
        }
      };

      self.getProperties = function() {
        return m_properties;
      };

      self.propertyChange = function(key) {
        return true;
      };

      self.refresh = function() {

        var params = {
        };

        return DB.getData("load[" + m_apiPath + C_REPORT_PATH + "show]", m_id, params);
      };

      self.save = function() {

        var register = new DB.Register();
        var fields = register.getFields();

        register.setFieldId(C.RPT_ID);
        register.setTable(C.REPORTE_PARAMETRO);

        register.setPath(m_apiPath + C_REPORT_PATH);

        register.setId(Cairo.Constants.NEW_ID);

        var _count = m_dialog.getProperties().size();
        for(var _i = 0; _i < _count; _i++) {

          var property = m_dialog.getProperties().item(_i);

        }

        return DB.saveEx(
            register,
            false,
            "",
            Cairo.Constants.CLIENT_SAVE_FUNCTION,
            C_MODULE,
            SAVE_ERROR).then(

          function(result) {
            if(result.success) {
              return load(result.data.getId()).then(
                function (success) {
                  if(success) {
                    refreshCollection();
                  };
                  return success;
                }
              );
            }
            else {
              return false;
            }
          }
        );
      };

      self.getPath = function() {
        return "#" + C_REPORT_PATH + m_id.toString();
      };

      self.getEditorName = function() {
        return "reporte";
      };

      self.getTitle = function() {
        return m_title;
      };

      self.validate = function() {
        return P.resolvedPromise(true);
      };

      self.setDialog = function(dialog) {
        m_dialog = dialog;
        m_properties = dialog.getProperties();
      };

      self.setListController = function(controller) {
        m_listController = controller;
      };

      var createMenu = function() {

        if(m_menuLoaded) { return; }

        m_menuLoaded = true;

        m_dialog.clearMenu();
      };

      var initialize = function() {
        try {
          m_title = getText(2708, ""); // Reporte
          m_dialog.setHaveDetail(false);
        }
        catch(ex) {
          Cairo.manageErrorEx(ex.message, ex, "initialize", C_MODULE, "");
        }
      };

      self.terminate = function() {
        try {
          m_dialog = null;
          m_properties = null;
          m_listController = null;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");
        }
      };

      self.validate = function() {
        return P.resolvedPromise(true);
      };

      return self;
    };

    Report.Controller = { getEditor: createObject };

    Report.Controller.show = function(id) {

      var self = this;

      /*
       this function will be called by the tab manager every time the
       view must be created. when the tab is not visible the tab manager
       will not call this function but only make the tab visible
       */
      var createReportDialog = function(tabId) {

        var editors = Cairo.Editors.reportEditors || Cairo.Collections.createCollection(null);
        Cairo.Editors.reportEditors = editors;

        // ListController properties and methods
        //
        self.entityInfo = new Backbone.Model({
          entitiesTitle: "Reporte",
          entityName: "reporte",
          entitiesName: "reportes" // TODO: check if it is needed or should be remove
        });

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

        self.edit = function(id) {
          Cairo.log('Error edit was called in reports editor');
        };

        self.destroy = function(id) {
          Cairo.log('Error destroy was called in reports editor');
        };

        // progress message
        //
        Cairo.LoadingMessage.show("Reportes", "Loading Reporte from Crowsoft Cairo server.");

        self.reportDialog = Report.Controller.getEditor();
        var dialog = Cairo.Dialogs.Views.ListController.newDialogList();

        self.reportDialog.setListController(self);
        self.reportDialog.setDialog(dialog);
        self.reportDialog.show(id).then(Cairo.LoadingMessage.close);

      };

      createReportDialog();
    }

  });

}());
