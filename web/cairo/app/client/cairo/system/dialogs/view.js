(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Dialogs.Views", function(Views, Cairo, Backbone, Marionette, $, _) {

    Views.createView = function() {

      var self = {
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
        bottomLine: new Cairo.Controls.Control(),
        background: new Cairo.Controls.Control()
      };

      var that = {};

      that.getSaveButton = function() { /* TODO: implement self. */ };
      that.getCancelButton = function() { /* TODO: implement self. */ };
      that.getCloseButton = function() { /* TODO: implement self. */ };

      that.getTab = function() { /* TODO: implement self. */ };
      that.getTabFooter = function() { /* TODO: implement self. */ };
      that.getTabItems = function() { /* TODO: implement self. */ };

      that.getTitle = function() {
        return self.title;
      };
      that.setTitle = function(title) {
        self.title = title;
      };

      that.getTitleLabel = function() {
        return self.titles;
      };

      that.getTabs = function() {
        return self.tabs;
      };

      that.getMaskEdits = function() {
        return self.maskEdits;
      };

      that.getDatePickers = function() {
        return self.datePickers;
      };

      that.getSelects = function() {
        return self.selects;
      };
      that.getOptionButtons = function() {
        return self.optionButtons;
      };

      that.getCheckBoxes = function() {
        return self.checkBoxes;
      };

      that.getButtons = function() {
        return self.buttons;
      };

      that.getCombos = function() {
        return self.combos;
      };

      that.getTextInputs = function() {
        return self.inputs;
      };

      that.getTextAreas = function() {
        return self.textAreas;
      };

      that.getPasswordInputs = function() {
        return self.passwords;
      };

      that.getLabels = function() {
        return self.labels;
      };

      that.getCtrlLabels = function() {
        return self.ctrlLabels;
      };

      that.getProgressBars = function() {
        return self.progressBars;
      };

      that.getGrids = function() {
        return self.grids;
      };

      that.getDescription = function() { /* TODO: implement self. */ };
      that.getTitleLabel2 = function() { /* TODO: implement self. */ };
      that.getImages = function() { /* TODO: implement self. */ };

      that.getIcons = function() { /* TODO: implement self. */ };
      that.setIcon = function(index) { /* TODO: implement self. */ };

      that.getControls = function() { /* TODO: implement self. */ };

      that.getBackground = function() {
        return self.background;
      };

      that.getBottomLine = function() {
        return self.bottomLine;
      };

      that.setToolbar = function(toolbar) { /* TODO: implement self. */ };

      that.unLoadToolbar = function() { /* TODO: implement self. */ };
      that.bringToFront = function() { /* TODO: implement self. */ };
      that.firstResize = function() { /* TODO: implement self. */ };

      that.showDialog = function() { /* TODO: implement self. */ };
      that.showView = function() { /* TODO: implement self. */ };
      that.setFocusFirstControl = function() { /* TODO: implement self. */ };
      that.getActiveControl = function() { /* TODO: implement self. */ };

      that.getTextWidth = function(text) { /* TODO: implement self. */ };

      that.getIndexGrid = function(grid) { /* TODO: implement self. */ };
      that.setNoResize = function(indexGrid, noResize) { /* TODO: implement self. */ };

      that.getHeight = function() {
        return 480;
      };

      that.getWidth = function() {
        return 320;
      };

      that.addListener = function(listenerDefinition) {
        self.listeners.push(listenerDefinition);
      };

      return that;
    };

    Views.createMasterView = function() {

      var self = {
        btnEditDocument: new Cairo.Controls.Button({}),
        btnNew: new Cairo.Controls.Button({}),
        btnCopy: new Cairo.Controls.Button({}),
        btnPrint: new Cairo.Controls.Button({}),
        btnPermission: new Cairo.Controls.Button({}),
        lbTitleEx2: new Cairo.Controls.Label({}),
        saved: false
      };

      var that = Views.createView();

      that.getEditDocumentsButton = function() {
        return self.btnEditDocument;
      };
      that.getTitleLabelEx2 = function() {
        return self.lbTitleEx2;
      };
      that.getNewButton = function() {
        return self.btnNew;
      };
      that.getCopyButton = function() {
        return self.btnCopy;
      };
      that.sendAutoSave = function() { /* TODO: implement self. */ };
      that.raiseAfterLoadEvent = function() { /* TODO: implement self. */ };
      that.getPrintButton = function() {
        return self.btnPrint;
      };
      that.getPermissionsButton = function() {
        return self.btnPermission;
      };
      that.setSaved = function(saved) {
        self.saved = saved;
      };
      that.save = function() { /* TODO: implement self. */ };
      that.close = function() { /* TODO: implement self. */ };

      return that;
    };

    Views.createWizardView = function() {

      var that = Views.createView();

      that.getImgWiz1 = function() { /* TODO: implement self. */ };
      that.getImgWiz3 = function() { /* TODO: implement self. */ };
      that.getImgWiz5 = function() { /* TODO: implement self. */ };
      that.getNextButton = function() { /* TODO: implement self. */ };
      that.getBackButton = function() { /* TODO: implement self. */ };
      that.getDialogBackground = function() { /* TODO: implement self. */ };
      that.getTitleBackground = function() { /* TODO: implement self. */ };

      return that;
    };

    Views.createDocumentView = function() {

      var that = Views.createView();

      that.setLoading = function(loading) { /* TODO: implement self. */ };
      that.getCancelUnload = function() { /* TODO: implement self. */ };
      that.setCancelUnload = function(loading) { /* TODO: implement self. */ };
      that.getUnloadCount = function() { /* TODO: implement self. */ };
      that.setUnloadCount = function(count) { /* TODO: implement self. */ };
      that.getFooterBackground = function() { /* TODO: implement self. */ };

      that.setNoButtons1 = function(buttons) { /* TODO: implement self. */ };
      that.setNoButtons2 = function(buttons) { /* TODO: implement self. */ };
      that.setNoButtons3 = function(buttons) { /* TODO: implement self. */ };
      that.setButtonsEx2 = function(buttons) { /* TODO: implement self. */ };
      that.setButtonsEx3 = function(buttons) { /* TODO: implement self. */ };

      that.setToolbarButtons = function() { /* TODO: implement self. */ };
      that.setHeightToDocWithDescription = function() { /* TODO: implement self. */ };

      return that;
    };

  });

}());