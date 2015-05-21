(function() {
  "use strict";

  /*
      this module manages a wizard view ...
  */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Dialogs.WizardViews", function(WizardViews, Cairo, Backbone, Marionette, $, _) {

    WizardViews.Controller = {

      newDialog: function() {

        var Dialogs = Cairo.Dialogs;

        var m_dialog = null;
        var m_steps = new Dialogs.createSteps();
        var m_objClient = null;

        var m_currentStep;
        var m_wizardShowed = false;

        var m_pushVirtualNext = false;
        var m_closeWizardAfterSave = false;
        var m_wizardClosed = false;
        var m_restartVirtualPush = false;
        
        var self = {};

        self.getDialog = function() {
          return m_dialog;
        };

        self.setObjClient = function(value) {
          m_objClient = value;
        };

        self.getObjClient = function() {
          return m_objClient;
        };

        self.getPushVirtualNext = function() {
          return m_pushVirtualNext;
        };

        self.setPushVirtualNext = function(value) {
          m_pushVirtualNext = value;
        };

        self.setRestartVirtualPush = function(value) {
          m_restartVirtualPush = value
        };

        self.getCloseWizardAfterSave = function() {
          return m_closeWizardAfterSave;
        };

        self.setCloseWizardAfterSave = function(value) {
          m_closeWizardAfterSave = value;
        };

        self.getWizardClosed = function() {
          return m_wizardClosed;
        };

        var initialize = function() {

        };

        initialize();

        return self;

      }

    };

  });

}());