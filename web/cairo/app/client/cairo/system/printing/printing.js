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

      var m_path = "";
      var m_timeout = 0;
      var m_connectionTimeout = 0;
      var m_isForEmail = false;
      var m_emailAddress = "";
      var m_userDescription = "";
      var m_isPrinted = false;
      var m_autoPrint = false;

      var NO_ID = Cairo.Constants.NO_ID;
      var DB = Cairo.Database;
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

      self.showPrint = function(id, tblId, docId, forMail) {
        forMail = forMail || false;

        var p = null;

        if(tblId !== NO_ID) {
          p = DB.getData("load[" + m_apiPath + "tabla/" + tblId.toString() + "/reports]");
        }
        else {
          p = DB.getData("load[" + m_apiPath + "documento/" + docId.toString() + "/reports/" + forMail + "]");
        }

        return p.then(function(response) {

          var reports = [];
          if(response.success === true) {
            reports = DB.getResultSetFromData(response.data);
          }
          return Cairo.printViewShow("Printing", "Select the report(s) you want to print", reports);

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