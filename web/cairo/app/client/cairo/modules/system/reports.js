(function() {
  "use strict";

  var C_REPORT_PATH = "reports/report/";
  var C_REPORT_FORM_PATH = "reports/reportForm/";
  var C_REPORT_PREVIEW_PATH = "reports/preview/";

  var SMALL_LOGO_DATA_SOURCE = "SP_RptGetLogosChico";
  var BIG_LOGO_DATA_SOURCE = "SP_RptGetLogosGrande";

  var createCSReportConnection = function() {

    var m_pendingMessages = [];
    var m_reports = []; // contains a collection of Reports.Report which comunicate with the native application

    var that = {};

    // TODO: move this to configuration
    //
    Cairo.CSREPORTS_EXTENSION_ID = 'gfladhgjbflfogopjcjkmokdddcboika';

    var extension_url = "chrome-extension://"+ Cairo.CSREPORTS_EXTENSION_ID +"/";

    window.addEventListener( "message", function(event) {
      if(event.source != window) return;
      var envelope = event.data;
      if(envelope.source && (envelope.source === extension_url))
      {
        var pm;
        if(envelope.message.id !== undefined && (pm = m_pendingMessages[envelope.message.id])) {
          pm.defer.resolve({ request: pm.message, response: envelope.message });
        }
        var rpt;
        if(envelope.message.webReportId !== undefined && (rpt = m_reports[envelope.message.webReportId])) {
          rpt.processWebReportMessage(envelope.message);
        }
      }
    }, false );

    var MAX_MESSAGE_LENGTH = 2000;
    var __PARTIAL_MESSAGE__ = "__PARTIAL_MESSAGE__";

    var sendMessage = function(message) {

      var defer = new Cairo.Promises.Defer();

      // TODO: use JSON.stringify( message.data ).length > X to determine if we need to split the message
      //       if true append prefix __PARTIAL_MESSAGE__ to message.action
      //       split message.data into chunks of size X
      //       when sending the last message don't append the prefix
      //       CSReportWebServer will join message.data before parse the json string

      var msgData = JSON.stringify(message.data);
      var chunk = msgData.substr(0, MAX_MESSAGE_LENGTH);
      var index = MAX_MESSAGE_LENGTH;

      var msgId = Cairo.Util.getNextRandomId();

      while (true) {

        var msg = {
          destination: 'chrome-extension://' + Cairo.CSREPORTS_EXTENSION_ID + '/',
          message: {
            action: (index >= msgData.length ? "" : __PARTIAL_MESSAGE__ ) + message.action,
            data: chunk,
            webReportId: message.webReportId
          },
          id: msgId
        };

        var pendingMessage = {
          message: msg,
          defer: defer
        };

        m_pendingMessages[msgId] = pendingMessage;

        window.postMessage(msg, window.location.href);

        chunk = msgData.substr(index, MAX_MESSAGE_LENGTH);
        index += MAX_MESSAGE_LENGTH;

        if(chunk.length === 0) break;
      }

      return defer.promise;
    };

    that.registerReport = function(report) {
      var id = Cairo.Util.getNextRandomId();
      m_reports[id] = report;
      return id;
    };

    that.unRegisterReport = function(id) {
      m_reports[id] = null;
    };

    that.checkCSReportsExtension = function() {
      sendMessage({action: "debugger", data: ""}).then(function(response) {
        console.log(JSON.stringify(response.request));
        console.log(JSON.stringify(response.response));
      });
    };

    /*
    *
    * CSReportWeb message has this definition:
    *
    * {
    *   action: _ACTION_,
    *   data: { _REPORT_DATA_ | _REPORT_PAGE_DATA_ },    *
    *   webReportId: _string_
    * }
    *
    * _REPORT_DATA_ : {
    *   report_type: _string_,
    *   report_title: _string_,
    *   report_name: _string_,
    *   report_code: _string_,
    *   report_file: _string_,
    *   report_params: [ _REPORT_PARAM_ ],
    *   data: [{ _data_source_name_: _DATA_SOURCE_ }],
    * }
    *
    * _REPORT_PARAM_ : {
    *   name: _string_,
    *   value: _string_
    * }
    *
    * _DATA_SOURCE_ : {
    *   name: _string_,
    *   data: _RECORDSET_
    * }
    *
    * _REPORT_PAGE_DATA_ : {
    *   report_page: _int_
    * }
    *
    * */

    that.ACTIONS = {
      PREVIEW: 'preview',
      MOVE_TO_PAGE: 'moveToPage',
      PDF: 'pdf',
      EXCEL: 'excel',
      PRINT: 'print'
    };

    that.createReportDataSource = function(dataSourceName, recordset) {
      return { name: dataSourceName, data: recordset };
    };

    that.createReportParam = function(name, value) {
      return { name: name, value: value };
    };

    that.createReportData = function(url, type, title, name, code, file, params, data) {
      return {
        url: url,
        type: type,
        title: title,
        name: name,
        code: code,
        file: file,
        params: params,
        data: data
      };
    };

    that.createReportDefinition = function(action, data, reportId) {
      if(reportId === undefined) {
        Cairo.raiseError("Reports", "CSReportConnection.createReportDefinition can't be called without a reportId. To get a reportId you must call CSReportConnection.registerReport.");
      }
      return {
        action: action,
        data: data,
        webReportId: reportId // this is used to allow the native application to send messages to an instance of Cairo.Reports.Report
      };
    };

    that.printReport = function(reportDefinition) {
      return sendMessage(reportDefinition).then(function(response) {
        console.log(JSON.stringify(response.request));
        console.log(JSON.stringify(response.response));
        response.success = true;
        return response;
      });
    };

    var csEMoveTo =
    {
        C_FIRSTPAGE: 1,
        C_NEXTPAGE: -1,
        C_PREVIOUSPAGE: -2,
        C_LASTPAGE: -3
    };

    var createReportPageData = function(page, reportId) {
      return {
        report_page: page,
        reportId: reportId
      };
    };

    var moveToPage = function(page, webReportId, reportId) {
      var rd = that.createReportDefinition(
        that.ACTIONS.MOVE_TO_PAGE,
        createReportPageData(page, reportId),
        webReportId
      );
      return sendMessage(rd).then(function(response) {
        console.log(JSON.stringify(response.request));
        console.log(JSON.stringify(response.response));
        response.success = true;
        return response;
      });
    };

    that.firstPage = function(webReportId, reportId) {
      moveToPage(csEMoveTo.C_FIRSTPAGE, webReportId, reportId);
    };

    that.previousPage = function(webReportId, reportId) {
      moveToPage(csEMoveTo.C_PREVIOUSPAGE, webReportId, reportId);
    };

    that.currentPage = function(page, webReportId, reportId) {
      moveToPage(page, webReportId, reportId);
    };

    that.nextPage = function(webReportId, reportId) {
      moveToPage(csEMoveTo.C_NEXTPAGE, webReportId, reportId);
    };

    that.lastPage = function(webReportId, reportId) {
      moveToPage(csEMoveTo.C_LASTPAGE, webReportId, reportId);
    };

    return that;
  };

  Cairo.CSReportConnection = createCSReportConnection();

  // -------------------------------------------------------------------------------------------------------------------
  // report commons
  //

  var DB = Cairo.Database;
  var m_apiPath = Cairo.Database.getAPIVersion();
  var url = window.location.protocol + "//" + window.location.host + "/client/cairo/reports/"; //http://www.cairodigital.com.ar/client/cairo/reports/

  var createRecordset = function(data) {
    return {
      columns: data.get('columns'),
      rows: data.get('rows')
    };
  };

  var getLogos = function() {
    var logos = {};
    return DB.getData("load[" + m_apiPath + "reports/logo/small]", null)
      .whenSuccessWithResult(function(response) {
        logos.small = createRecordset(response.data);
        return DB.getData("load[" + m_apiPath + "reports/logo/big]", null)
          .whenSuccessWithResult(function(response) {
            logos.big = createRecordset(response.data);
            return {success: true, logos: logos };
          });
      });
  };

  // -------------------------------------------------------------------------------------------------------------------

  Cairo.module("Reports", function(Reports, Cairo, Backbone, Marionette, $, _) {

    Reports.createReports = function() {

      var C = Cairo.General.Constants;
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

  Cairo.module("Reports.ReportForm", function(ReportForm, Cairo, Backbone, Marionette, $, _) {

    var createObject = function(id, name, nroDoc) {

      var self = {};

      var FORMULARIOS = "formularios";

      var valField = DB.valField;

      var m_id = id;
      var m_name = name;

      var m_title = name + " " + nroDoc;
      var m_webReportId = Cairo.CSReportConnection.registerReport(self);

      self.print = function(paramId, reportFile) {
        Cairo.LoadingMessage.show("Printing", "Loading data from Crowsoft Cairo server.");
        return print(Cairo.CSReportConnection.ACTIONS.PRINT, paramId, reportFile)
          .then(Cairo.LoadingMessage.close);
      };

      self.preview = function(paramId, reportFile) {
        debugger;
        var preview = Cairo.Reports.Preview.Controller.show(name, nroDoc);
        return print(Cairo.CSReportConnection.ACTIONS.PREVIEW, paramId, reportFile, preview.getWebReportId());
      };

      var print = function(action, paramId, reportFile, webReportId) {
        return DB.getData("load[" + m_apiPath + C_REPORT_FORM_PATH + m_id + "/" + paramId + "]", null).then(function(response) {

          var params = Cairo.CSReportConnection.createReportParam("docId", paramId);

          var dataSourceName = valField(response.data, "data_source");
          var recordset = valField(response.data, "recordset");

          var data = [Cairo.CSReportConnection.createReportDataSource(dataSourceName, recordset)];

          return getLogos().whenSuccessWithResult(function(response) {

            data.push(Cairo.CSReportConnection.createReportDataSource(SMALL_LOGO_DATA_SOURCE, response.logos.small));
            data.push(Cairo.CSReportConnection.createReportDataSource(BIG_LOGO_DATA_SOURCE, response.logos.big));

            var rd = Cairo.CSReportConnection.createReportDefinition(
              action,
              Cairo.CSReportConnection.createReportData(url, FORMULARIOS, m_title, m_name, dataSourceName, reportFile, params, data),
              webReportId != undefined ? webReportId : m_webReportId
            );

            return Cairo.CSReportConnection.printReport(rd);

          });
        });
      };

      self.processWebReportMessage = function(message) {
        Cairo.log('Error processWebReportMessage was called in reportForm');
      };

      return self;

    };

    ReportForm.Controller = { getEditor: createObject };

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
    var C_MODULE = "Reports";
    var P = Cairo.Promises;

    var createParam = function() {
      var self = {
        id: 0,
        name: "",
        value: "",           /* value is always the internal value not what is shown to the user. ex: in selects is id or branch id */
        visible: false,
        paramType: 0,
        infpId: 0,
        tblId: 0,
        sqlstmt: "",         /* this is the worst posible name. I keep it to avoid confusing you more. it contains a list of tuples { id, name } */
        selectValueName: "", /* for selects it is the name or the branch name */
        property: null
      };

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
      that.getSelectValueName = function() {
        return self.selectValueName;
      };
      that.setSelectValueName = function(selectValueName) {
        self.selectValueName = selectValueName;
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
      that.getSqlstmt = function() {
        return self.sqlstmt;
      };
      that.setSqlstmt = function(sqlstmt) {
        self.sqlstmt = sqlstmt;
        return that;
      };
      that.getProperty = function() {
        return self.property;
      };
      that.setProperty = function(property) {
        self.property = property;
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

      var m_title = "";

      var m_id = NO_ID;
      var m_name = "";
      var m_infId = NO_ID;
      var m_code = "";
      var m_reportFile = "";
      var m_descrip = "";

      var m_params = Cairo.Collections.createCollection(createParam);

      var m_menuLoaded;

      var m_apiPath = DB.getAPIVersion();
      var SAVE_ERROR = getText(2226, ""); //TODO: add new entry in language for this message // Error al grabar los párametros del reporte #1#

      var m_webReportId = Cairo.CSReportConnection.registerReport(self);
      var m_reportId = ""; // this is returned by CSReportWebServer in the REPORT_PREVIEW_DONE message
                           // it is used to call methods over an instance of a report like moveToPage

      var INFORMES = "informes";

      self.show = function(id) {
        initialize();
        return load(id)
          .whenSuccess(loadCollection);
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
        if(item.getVisible()) {
          var p = m_properties.add(null)
            .setName(item.getName())
            .setType(getPropertyType(item.getParamType()))
            .setValue(item.getValue());

          switch(item.getParamType()) {

            case RT.select:

              p.setSelectTable(item.getTblId())
                .setSelectId(item.getValue())
                .setValue(item.getSelectValueName())
              break;

            case RT.numeric:

              p.setSubType(Dialogs.PropertySubType.double);
              break;

            case RT.sqlstmt:
            case RT.list:

              // TODO:
              break;
          }

          item.setProperty(p);
        }
      };

      var loadCollection = function() {

        m_properties.clear();

        m_params.each(createParamProperty, m_properties);

        createMenu();
        if(!m_dialog.showParams(self)) { return false; }

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
              m_name = valField(response.data, C.RPT_NAME);
              m_infId = valField(response.data, C.INF_ID);
              m_code = valField(response.data, C.INF_CODE);
              m_reportFile = valField(response.data, C.INF_REPORT_FILE);
              m_descrip = valField(response.data, C.RPT_DESCRIP);

              loadParams(response.data.get('params'));

            }

            m_title = m_name;

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
            .setTblId(getValue(params[i], C.TBL_ID))
            .setSqlstmt(getValue(params[i], C.INFP_SQLSTMT))
            .setSelectValueName(getValue(params[i], C.SELECT_VALUE_NAME));
        }
      };

      self.getProperties = function() {
        return m_properties;
      };

      self.propertyChange = function(key) {
        return true;
      };

      var getParam = function(item, index, params) {
        var p = item.getProperty();
        var paramName = "p" + item.getInfpId();
        var value = p.getValue();

        switch(item.getParamType()) {

          case RT.date:

            var date;
            if((date = p.getSelectIntValue()) !== "") {
              value = Cairo.Dates.DateNames.getDateByName(date);
            }
            else if(isDate((date = p.getValue()))) {
              value = date;
            }
            else {
              Cairo.raiseError("Reports", "Date is invalid"); // TODO: use language
            }
            value = DB.sqlDate(value);
            break;

          case RT.select:

            value = p.getSelectIntValue();
            break;

          case RT.numeric:

            value = val(value);
            break;

          case RT.sqlstmt:
          case RT.list:

            // TODO:
            break;
        }

        params[paramName] = value;
      };

      var getParams = function() {
        var params = {};
        m_params.map(getParam, params);
        return params;
      };

      self.refresh = function() {
        var params = getParams();
        return DB.getData("load[" + m_apiPath + C_REPORT_PATH + m_id + "/show]", null, params);
      };

      var getReportParam = function(item, index) {
        var p = item.getProperty();
        return Cairo.CSReportConnection.createReportParam(p.getName(), p.getValue());
      };

      self.preview = function() {
        return print(Cairo.CSReportConnection.ACTIONS.PREVIEW);
      };

      self.print = function() {
        return print(Cairo.CSReportConnection.ACTIONS.PRINT);
      };

      var print = function(action) {
        var params = getParams();
        return DB.getData("load[" + m_apiPath + C_REPORT_PATH + m_id + "/show]", null, params).then(function(response) {

          var params = m_params.map(getReportParam);

          var data = [Cairo.CSReportConnection.createReportDataSource(m_code, createRecordset(response.data))];

          return getLogos().whenSuccessWithResult(function(response) {

            data.push(Cairo.CSReportConnection.createReportDataSource(SMALL_LOGO_DATA_SOURCE, response.logos.small));
            data.push(Cairo.CSReportConnection.createReportDataSource(BIG_LOGO_DATA_SOURCE, response.logos.big));

            var rd = Cairo.CSReportConnection.createReportDefinition(
              action,
              Cairo.CSReportConnection.createReportData(url, INFORMES, m_title, m_name, m_code, m_reportFile, params, data),
              m_webReportId
            );

            return Cairo.CSReportConnection.printReport(rd);
          });
        });
      };

      self.firstPage = function() {
        Cairo.CSReportConnection.firstPage(m_webReportId, m_reportId);
      };

      self.previousPage = function() {
        Cairo.CSReportConnection.previousPage(m_webReportId, m_reportId);
      };

      self.currentPage = function(page) {
        Cairo.CSReportConnection.currentPage(page, m_webReportId, m_reportId);
      };

      self.nextPage = function() {
        Cairo.CSReportConnection.nextPage(m_webReportId, m_reportId);
      };

      self.lastPage = function() {
        Cairo.CSReportConnection.lastPage(m_webReportId, m_reportId);
      };

      self.processWebReportMessage = function(message) {
        switch(message.messageType) {
          case 'REPORT_PREVIEW_DONE':
            m_reportId = message.reportId;
            m_dialog.showPage(message.page);
            m_dialog.setCurrentPage(1);
            m_dialog.setTotalPages(message.totalPages);
            break;
          case 'REPORT_PREVIEW_PAGE':
            m_dialog.showPage(message.page);
            m_dialog.setCurrentPage(message.pageIndex);
            break;
        }
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
                  }
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

      self.getTabTitle = function() {
        return m_code;
      };

      self.validate = function() {
        return P.resolvedPromise(true);
      };

      self.setDialog = function(dialog) {
        m_dialog = dialog;
        m_properties = dialog.getProperties();
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
          Cairo.CSReportConnection.unRegisterReport(m_webReportId);
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

      var createReportDialog = function() {

        // ListController properties and methods
        //
        self.entityInfo = new Backbone.Model({
          entitiesTitle: "Reporte",
          entityName: "reporte",
          entitiesName: "reportes" // TODO: check if it is needed or should be remove
        });

        // progress message
        //
        Cairo.LoadingMessage.show("Reportes", "Loading Reporte from Crowsoft Cairo server.");

        self.reportDialog = Report.Controller.getEditor();
        var dialog = Cairo.Dialogs.Views.ListController.newDialogList();

        self.reportDialog.setDialog(dialog);
        self.reportDialog.show(id).then(Cairo.LoadingMessage.close);

      };

      createReportDialog();
    }

  });

  Cairo.module("Reports.Preview", function(Preview, Cairo, Backbone, Marionette, $, _) {

    var C_MODULE = "Reports.Preview";
    var P = Cairo.Promises;

    var createObject = function() {

      var self = {};

      var getText = Cairo.Language.getText;
      var NO_ID = Cairo.Constants.NO_ID;

      var m_dialog;
      var m_properties;

      var m_title = "";

      var m_id = NO_ID;
      var m_name = "";
      var m_nroDoc = "";

      var m_webReportId = Cairo.CSReportConnection.registerReport(self);
      var m_reportId = ""; // this is returned by CSReportWebServer in the REPORT_PREVIEW_DONE message
                           // it is used to call methods over an instance of a report like moveToPage

      self.getWebReportId = function() {
        return m_webReportId;
      };

      self.show = function(name, nroDoc) {
        m_name = name;
        m_nroDoc = nroDoc;
        initialize();
        return P.resolvedPromise(true).whenSuccess(loadCollection);
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
        Cairo.log('Error setSearchParam was called in reports.preview editor');
      };

      self.processMenu = function(index) {

      };

      var loadCollection = function() {

        m_properties.clear();

        if(!m_dialog.showPreview(self)) { return false; }

        return true;
      };

      self.getProperties = function() {
        return m_properties;
      };

      self.propertyChange = function(key) {
        return true;
      };

      self.firstPage = function() {
        Cairo.CSReportConnection.firstPage(m_webReportId, m_reportId);
      };

      self.previousPage = function() {
        Cairo.CSReportConnection.previousPage(m_webReportId, m_reportId);
      };

      self.currentPage = function(page) {
        Cairo.CSReportConnection.currentPage(page, m_webReportId, m_reportId);
      };

      self.nextPage = function() {
        Cairo.CSReportConnection.nextPage(m_webReportId, m_reportId);
      };

      self.lastPage = function() {
        Cairo.CSReportConnection.lastPage(m_webReportId, m_reportId);
      };

      self.processWebReportMessage = function(message) {
        switch(message.messageType) {
          case 'REPORT_PREVIEW_DONE':
            m_reportId = message.reportId;
            m_dialog.showPage(message.page);
            m_dialog.setCurrentPage(1);
            m_dialog.setTotalPages(message.totalPages);
            break;
          case 'REPORT_PREVIEW_PAGE':
            m_dialog.showPage(message.page);
            m_dialog.setCurrentPage(message.pageIndex);
            break;
        }
      };

      self.getPath = function() {
        return "#" + C_REPORT_PREVIEW_PATH + m_id.toString();
      };

      self.getEditorName = function() {
        return "preview";
      };

      self.getTitle = function() {
        return m_title;
      };

      self.getTabTitle = function() {
        return "Prev " + (m_nroDoc != undefined ? m_nroDoc : m_name); // TODO: use language
      };

      self.validate = function() {
        return P.resolvedPromise(true);
      };

      self.setDialog = function(dialog) {
        m_dialog = dialog;
        m_properties = dialog.getProperties();
      };

      var initialize = function() {
        try {
          m_title = "Preview: " + m_name + (m_nroDoc != undefined ? ": " + m_nroDoc : "") // TODO: use language
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
          Cairo.CSReportConnection.unRegisterReport(m_webReportId);
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

    var show = function(name, nroDoc) {

      var createPreviewDialog = function() {

        var self = {};

        // progress message
        //
        Cairo.LoadingMessage.show("Previews", "Loading Preview from Crowsoft Cairo.");

        self.previewDialog = Preview.Controller.getEditor();
        var dialog = Cairo.Dialogs.Views.ListController.newDialogList();

        self.previewDialog.setDialog(dialog);
        self.previewDialog.show(name, nroDoc).then(Cairo.LoadingMessage.close);

        return self.previewDialog;
      };

      return createPreviewDialog();
    };

    Preview.Controller = { 
      getEditor: createObject, 
      show: show
    };

  });

}());
