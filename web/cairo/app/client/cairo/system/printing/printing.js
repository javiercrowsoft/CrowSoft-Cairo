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

      self.setPath = function(path) {
        m_path = path;
      };

      self.setCommandTimeout = function(timeout) {
        m_timeout = timeout;
      };

      self.setConnectionTimeout = function(timeout) {
        m_connectionTimeout = timeout;
      };

      self.showPrint = function(id, tblId, docId) {
        //Controls.createGrid
        Cairo.printViewShow("Printing", "This dialog doesn't have a print option", []);
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