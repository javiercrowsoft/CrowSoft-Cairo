(function() {
  "use strict";

  /*
      this module brings printing services ...
  */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Entities.Printing", function(Printing, Cairo, Backbone, Marionette, $, _) {

    var createObject = function() {

      var self = {};

      var NO_ID = Cairo.Constants.NO_ID;
      var DB = Cairo.Database;
      var valField = DB.valField;
      var P = Cairo.Promises;
      var call = P.call;
      var C = Cairo.General.Constants;

      var m_path = "";
      var m_timeout = 0;
      var m_connectionTimeout = 0;
      var m_isForEmail = false;
      var m_emailAddress = "";
      var m_userDescription = "";
      var m_isPrinted = false;
      var m_autoPrint = false;

      var m_apiPath = DB.getAPIVersion();

      self.setPath = function(path) {
        m_path = path;
      };

      self.setCommandTimeout = function(timeout) {
        m_timeout = timeout;
      };

      self.setConnectionTimeout = function(timeout) {
        m_connectionTimeout = timeout;
      };

      var reportDefinition = function(id, reportInfo, nroDoc) {
        var rptfId = valField(reportInfo, C.RPTF_ID);
        var name = valField(reportInfo, C.RPTF_NAME);
        return { 
          reportFile: valField(reportInfo, C.RPTF_CSRFILE),
          report: Cairo.Reports.ReportForm.Controller.getEditor(rptfId, name, nroDoc)
        }
      }

      var printReport = function(id, reportInfo) {
        var rptDef = reportDefinition(id, reportInfo);
        rptDef.report.print(id, rptDef.reportFile);
      };

      var previewReport = function(id, reportInfo, nroDoc) {
        var rptDef = reportDefinition(id, reportInfo, nroDoc);
        rptDef.report.preview(id, rptDef.reportFile);
      };

      self.showPrint = function(id, tblId, docId, forMail, nroDoc) {
        forMail = forMail || false;

        var p = null;

        if(tblId !== NO_ID) {
          p = DB.getData("load[" + m_apiPath + "tabla/" + tblId.toString() + "/reports]");
        }
        else {
          p = DB.getData("load[" + m_apiPath + "documento/" + docId.toString() + "/reports/" + forMail + "]");
        }

        return p.then(function(response) {
          var defer = new Cairo.Promises.Defer();
          var reports = [];
          if(response.success === true) {
            reports = DB.getResultSetFromData(response.data);
          }
          Cairo.printViewShow(
            "Printing", "Select the report(s) you want to print",
            reports,
            function(action, reports) {

              switch(action) {
                case "print":
                  var p = P.resolvedPromise(true);
                  for(var i = 0, count = reports.length; i < count; i += 1) {
                    p = p.then(call(printReport, id, reports[i]));
                  }
                  break;
                case "preview":
                  var p = P.resolvedPromise(true);
                  for(var i = 0, count = reports.length; i < count; i += 1) {
                    p = p.then(call(previewReport, id, reports[i], nroDoc));
                  }
                  break;
                case "pdf":
                  break;
                case "email":
                  break;
                case "folder":
                  break;
                case "cancel":
                  break;
              }
            });
          return defer.promise;
        });
      };

      self.setIsForEmail = function(isForEmail) {
        m_isForEmail = isForEmail;
      };

      self.setEmailAddress = function(email) {
        m_emailAddress = email;
      };

      self.setUserDescription = function(description) {
        m_userDescription = description;
      };

      self.getDocumentIsPrinted = function() {
        return m_isPrinted;
      };

      self.setAutoPrint = function(autoPrint) {
        m_autoPrint = autoPrint;
      };

      return self;

    };

    Printing.createManager = createObject;

  });

  ///////////////
  // Handler
  ///////////////

  Cairo.module("Printing", function(Printing, Cairo, Backbone, Marionette, $, _) {

  });

  ///////////////
  // Views
  ///////////////

  Cairo.module("Printing.View", function(View, Cairo, Backbone, Marionette, $, _) {

  });

  ///////////////
  // Controller
  ///////////////

  Cairo.module("Printing.Actions", function(Actions, Cairo, Backbone, Marionette, $, _) {

  });

  Cairo.module("Printing.View", function(View, Cairo, Backbone, Marionette, $, _) {

    View.Controller = {

    };

  });

}());