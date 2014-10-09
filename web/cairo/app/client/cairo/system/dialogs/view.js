(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Entities.Dialogs.Views", function(Views, Cairo, Backbone, Marionette, $, _) {

    Views.View = Backbone.Model.extend({
      urlRoot: "",

      defaults: {
      },

      addListener: function(listenerDefinition) { /* TODO: implement this. */ },

      getSaveButton: function() { /* TODO: implement this. */ },
      getCancelButton: function() { /* TODO: implement this. */ },
      getCloseButton: function() { /* TODO: implement this. */ },

      getTab: function() { /* TODO: implement this. */ },
      getTabFooter: function() { /* TODO: implement this. */ },
      getTabItems: function() { /* TODO: implement this. */ },
      getTitle2: function() { /* TODO: implement this. */ },
      getTitleLabel: function() { /* TODO: implement this. */ },

      getMaskEdits: function() { /* TODO: implement this. */ },
      getDatePickers: function() { /* TODO: implement this. */ },
      getSelects: function() { /* TODO: implement this. */ },
      getOptionButtons: function() { /* TODO: implement this. */ },
      getCheckBoxes: function() { /* TODO: implement this. */ },
      getButtons: function() { /* TODO: implement this. */ },
      getCombos: function() { /* TODO: implement this. */ },
      getTextInputs: function() { /* TODO: implement this. */ },
      getTextAreas: function() { /* TODO: implement this. */ },
      getPasswordInputs: function() { /* TODO: implement this. */ },
      getLabels: function() { /* TODO: implement this. */ },
      getCtlLabels: function() { /* TODO: implement this. */ },
      getProgressBars: function() { /* TODO: implement this. */ },
      getDescription: function() { /* TODO: implement this. */ },
      getTitleLabel2: function() { /* TODO: implement this. */ },
      getImages: function() { /* TODO: implement this. */ },

      getIcons: function() { /* TODO: implement this. */ },
      setIcon: function(index) { /* TODO: implement this. */ },

      getControls: function() { /* TODO: implement this. */ },
      getBackground: function() { /* TODO: implement this. */ },

      setToolbar: function(toolbar) { /* TODO: implement this. */ },

      unLoadToolbar: function() { /* TODO: implement this. */ },
      bringToFront: function() { /* TODO: implement this. */ },
      firstResize: function() { /* TODO: implement this. */ },

      showDialog: function() { /* TODO: implement this. */ },
      showView: function() { /* TODO: implement this. */ },
      setFocusFirstControl: function() { /* TODO: implement this. */ },
      getActiveControl: function() { /* TODO: implement this. */ }

    });

    Views.MasterView = Views.View.extend({

      getEditDocumentsButton: function() { /* TODO: implement this. */ },
      getNewButton: function() { /* TODO: implement this. */ },
      getCopyButton: function() { /* TODO: implement this. */ },
      sendAutoSave: function() { /* TODO: implement this. */ },
      raiseAfterLoadEvent: function() { /* TODO: implement this. */ },
      getPrintButton: function() { /* TODO: implement this. */ },
      getPermissionsButton: function() { /* TODO: implement this. */ },
      setSaved: function() { /* TODO: implement this. */ }

    });

    Views.WizardView = Views.View.extend({

      getImgWiz1: function() { /* TODO: implement this. */ },
      getImgWiz3: function() { /* TODO: implement this. */ },
      getImgWiz5: function() { /* TODO: implement this. */ }

    });

    Views.DocumentView = Views.View.extend({

      setLoading: function(loading) { /* TODO: implement this. */ },
      setCancelUnload: function(loading) { /* TODO: implement this. */ },
      setUnloadCount: function(loading) { /* TODO: implement this. */ },
      getCancelUnload: function(loading) { /* TODO: implement this. */ },
      getUnloadCount: function(loading) { /* TODO: implement this. */ }

    });

  });

}());