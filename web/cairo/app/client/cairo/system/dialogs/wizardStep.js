(function() {
  "use strict";

  /*
      this module define a wizard step and a collection of wizard steps ...
  */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Dialogs.WizardSteps", function(WizardSteps, Cairo, Backbone, Marionette, $, _) {

    var Dialogs = Cairo.Dialogs;

    WizardSteps.createObject = function() {

      var self = {};

      var C_MODULE = "cWizardStep";

      var m_index = 0;
      var m_properties = null;
      var m_tabIndex = 0;
      var m_key = "";

      var createProperties = function() {

        var self = {
          wizard: null,
          stepIndex: 0
        };

        var that = Cairo.Collections.createCollection(Dialogs.createProperty);

        that.setWizard = function(wizard) {
          self.wizard = wizard;
        };

        that.getWizard = function() {
          return self.wizard;
        };

        that.setStepIndex = function(stepIndex) {
          self.stepIndex = stepIndex;
        };

        that.getStepIndex = function() {
          return self.stepIndex;
        };

        return that;
      };

      self.setIndex = function(value) {
        m_index = value;
      };

      self.getIndex = function() {
        return m_index;
      };

      self.setProperties = function(value) {
        m_properties = value;
      };

      self.getProperties = function() {
        return m_properties;
      };

      self.getTabIndex = function() {
        return m_tabIndex;
      };

      self.setTabIndex = function(value) {
        m_tabIndex = value;
      };

      self.getKey = function() {
        return m_key;
      };

      self.setKey = function(value) {
        m_key = value;
      };

      self.destroy = function() {
        try {
          m_properties.clear();
          m_properties = null;
        }
        catch (ex) {
          Cairo.manageErrorEx(ex.message, ex, "destroy", C_MODULE, "");
        }
      };

      var initalize = function() {
        m_properties = createProperties();
      };

      initalize();

      return self;
    };

  });

}());