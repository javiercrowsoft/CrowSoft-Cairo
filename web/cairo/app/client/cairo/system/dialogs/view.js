(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Dialogs.Views", function(Views, Cairo, Backbone, Marionette, $, _) {

    Views.View = Backbone.Model.extend({
      urlRoot: "",

      defaults: {

      },
      listeners: [],
      tabs: Cairo.Collections.createCollection(Cairo.Dialogs.createTab),
      maskEdits: Cairo.Collections.createCollection(Cairo.Controls.createInput),
      datePickers: Cairo.Collections.createCollection(Cairo.Controls.createDatePicker),
      selects: Cairo.Collections.createCollection(Cairo.Controls.createSelect),
      optionButtons: Cairo.Collections.createCollection(Cairo.Controls.createOptionButton),
      checkBoxes: Cairo.Collections.createCollection(Cairo.Controls.createCheckBox),
      buttons: Cairo.Collections.createCollection(Cairo.Controls.createButton),
      combos: Cairo.Collections.createCollection(Cairo.Controls.createCombo),
      passwords: Cairo.Collections.createCollection(Cairo.Controls.createPassword),
      grids: Cairo.Collections.createCollection(Cairo.Controls.createGrid),
      inputs: Cairo.Collections.createCollection(Cairo.Controls.createInput),
      progressBars: Cairo.Collections.createCollection(Cairo.Controls.createProgressBar),
      textAreas: Cairo.Collections.createCollection(Cairo.Controls.createTextArea),
      labels: Cairo.Collections.createCollection(Cairo.Controls.createLabel),
      ctrlLabels: Cairo.Collections.createCollection(Cairo.Controls.createLabel),
      titles: Cairo.Collections.createCollection(Cairo.Controls.createLabel),
      title: "",

      getSaveButton: function() { /* TODO: implement this. */ },
      getCancelButton: function() { /* TODO: implement this. */ },
      getCloseButton: function() { /* TODO: implement this. */ },

      getTab: function() { /* TODO: implement this. */ },
      getTabFooter: function() { /* TODO: implement this. */ },
      getTabItems: function() { /* TODO: implement this. */ },

      getTitle: function() {
        return this.title;
      },
      setTitle: function() {
        this.title = title;
      },

      getTitleLabel: function() {
        return this.titles;
      },

      getTabs: function() {
        return this.tabs;
      },

      getMaskEdits: function() {
        return this.maskEdits;
      },

      getDatePickers: function() {
        return this.datePickers;
      },

      getSelects: function() {
        return this.selects;
      },
      getOptionButtons: function() {
        return this.optionButtons;
      },

      getCheckBoxes: function() {
        return this.checkBoxes;
      },

      getButtons: function() {
        return this.buttons;
      },

      getCombos: function() {
        return this.combos;
      },

      getTextInputs: function() {
        return this.inputs;
      },

      getTextAreas: function() {
        return this.textAreas;
      },

      getPasswordInputs: function() {
        return this.passwords;
      },

      getLabels: function() {
        return this.labels;
      },

      getCtrlLabels: function() {
        return this.ctrlLabels;
      },

      getProgressBars: function() {
        return this.progressBars;
      },

      getGrids: function() {
        return this.grids;
      },

      getDescription: function() { /* TODO: implement this. */ },
      getTitleLabel2: function() { /* TODO: implement this. */ },
      getImages: function() { /* TODO: implement this. */ },

      getIcons: function() { /* TODO: implement this. */ },
      setIcon: function(index) { /* TODO: implement this. */ },

      getControls: function() { /* TODO: implement this. */ },
      getBackground: function() { /* TODO: implement this. */ },
      getBottomLine: function() { /* TODO: implement this. */ },

      setToolbar: function(toolbar) { /* TODO: implement this. */ },

      unLoadToolbar: function() { /* TODO: implement this. */ },
      bringToFront: function() { /* TODO: implement this. */ },
      firstResize: function() { /* TODO: implement this. */ },

      showDialog: function() { /* TODO: implement this. */ },
      showView: function() { /* TODO: implement this. */ },
      setFocusFirstControl: function() { /* TODO: implement this. */ },
      getActiveControl: function() { /* TODO: implement this. */ },

      getTextWidth: function(text) { /* TODO: implement this. */ },

      getIndexGrid: function(grid) { /* TODO: implement this. */ },
      setNoResize: function(indexGrid, noResize) { /* TODO: implement this. */ },

      getHeight: function() {
        return 480;
      },

      getWidth: function() {
        return 320;
      },

      addListener: function(listenerDefinition) {
        this.listeners.push(listenerDefinition);
      }

    });

    Views.MasterView = Views.View.extend({

      btnEditDocument: new Cairo.Controls.Button({}),
      btnNew: new Cairo.Controls.Button({}),
      btnCopy: new Cairo.Controls.Button({}),
      btnPrint: new Cairo.Controls.Button({}),
      btnPermission: new Cairo.Controls.Button({}),
      lbTitleEx2: new Cairo.Controls.Label({}),

      saved: false,

      getEditDocumentsButton: function() { return this.btnEditDocument; },
      getTitleLabelEx2: function() { return this.lbTitleEx2; },
      getNewButton: function() { return this.btnNew; },
      getCopyButton: function() { return this.btnCopy; },
      sendAutoSave: function() { /* TODO: implement this. */ },
      raiseAfterLoadEvent: function() { /* TODO: implement this. */ },
      getPrintButton: function() { return this.btnPrint; },
      getPermissionsButton: function() { return this.btnPermission; },
      setSaved: function(saved) { this.saved = saved; },
      save: function() { /* TODO: implement this. */ },
      close: function() { /* TODO: implement this. */ }

    });

    Views.WizardView = Views.View.extend({

      getImgWiz1: function() { /* TODO: implement this. */ },
      getImgWiz3: function() { /* TODO: implement this. */ },
      getImgWiz5: function() { /* TODO: implement this. */ },
      getNextButton: function() { /* TODO: implement this. */ },
      getBackButton: function() { /* TODO: implement this. */ },
      getDialogBackground: function() { /* TODO: implement this. */ },
      getTitleBackground: function() { /* TODO: implement this. */ }

    });

    Views.DocumentView = Views.View.extend({

      setLoading: function(loading) { /* TODO: implement this. */ },
      getCancelUnload: function() { /* TODO: implement this. */ },
      setCancelUnload: function(loading) { /* TODO: implement this. */ },
      getUnloadCount: function() { /* TODO: implement this. */ },
      setUnloadCount: function(count) { /* TODO: implement this. */ },
      getFooterBackground: function() { /* TODO: implement this. */ },

      setNoButtons1: function(buttons) { /* TODO: implement this. */ },
      setNoButtons2: function(buttons) { /* TODO: implement this. */ },
      setNoButtons3: function(buttons) { /* TODO: implement this. */ },
      setButtonsEx2: function(buttons) { /* TODO: implement this. */ },
      setButtonsEx3: function(buttons) { /* TODO: implement this. */ },

      setToolbarButtons: function() { /* TODO: implement this. */ },
      setHeightToDocWithDescription: function() { /* TODO: implement this. */ }

    });

  });

}());