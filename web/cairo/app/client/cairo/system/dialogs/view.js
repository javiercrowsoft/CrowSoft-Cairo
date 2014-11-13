(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Dialogs.Views", function(Views, Cairo, Backbone, Marionette, $, _) {

    /*
     the main view which contains all other views in the tree dialog
     this view is created by the tree client object
     */
    Views.DialogLayout = Marionette.Layout.extend({
      template: "#dialog-layout-template"
    });

    Views.createView = function() {
      var controls = Cairo.Collections.createCollection(null);
      var self = {
        listeners: [],

        text: "",
        title: new Cairo.Controls.Label(),
        subTitle: new Cairo.Controls.Label(),

        path: "",
        name: "",

        controls: controls,
        tabs: Cairo.Collections.createCollection(Cairo.Controls.createTab, controls),
        maskEdits: Cairo.Collections.createCollection(Cairo.Controls.createInput, controls),
        datePickers: Cairo.Collections.createCollection(Cairo.Controls.createDatePicker, controls),
        selects: Cairo.Collections.createCollection(Cairo.Controls.createSelect, controls),
        optionButtons: Cairo.Collections.createCollection(Cairo.Controls.createOptionButton, controls),
        checkBoxes: Cairo.Collections.createCollection(Cairo.Controls.createCheckBox, controls),
        buttons: Cairo.Collections.createCollection(Cairo.Controls.createButton, controls),
        combos: Cairo.Collections.createCollection(Cairo.Controls.createCombo, controls),
        passwords: Cairo.Collections.createCollection(Cairo.Controls.createPassword, controls),
        grids: Cairo.Collections.createCollection(Cairo.Controls.createGrid, controls),
        inputs: Cairo.Collections.createCollection(Cairo.Controls.createInput, controls),
        progressBars: Cairo.Collections.createCollection(Cairo.Controls.createProgressBar, controls),
        textAreas: Cairo.Collections.createCollection(Cairo.Controls.createTextArea, controls),
        labels: Cairo.Collections.createCollection(Cairo.Controls.createLabel, controls),
        ctrlLabels: Cairo.Collections.createCollection(Cairo.Controls.createLabel, controls),
        titles: Cairo.Collections.createCollection(Cairo.Controls.createLabel, controls),

        bottomLine: new Cairo.Controls.Control(),
        background: new Cairo.Controls.Control(),
        saveButton: new Cairo.Controls.Control(),
        cancelButton: new Cairo.Controls.Control(),
        closeButton: new Cairo.Controls.Control(),

        width: 320,
        heithg: 480,
        visible: false,
        loading: true
      };

      var that = {};

      self.tabs.add();

      that.getText = function() {
        return self.text;
      };
      that.setText = function(text) {
        self.text = text;
      };

      that.setPath = function(path) {
        self.path = path;
      };

      that.setName = function(name) {
        self.name = name;
      };

      that.getTitle = function() {
        return self.title;
      };
      that.setTitle = function(title) {
        self.title.setText(title);
      };

      that.getSubTitle = function() {
        return self.subTitle;
      };

      that.getVisible = function() {
        return self.visible;
      }
      that.setVisible = function(visible) {
        self.visible = visible;
      }

      that.getSaveButton = function() {
        return self.saveButton;
      };
      that.getCancelButton = function() {
        return self.cancelButton;
      };
      that.getCloseButton = function() {
        return self.closeButton
      };

      that.getTab = function() { /* TODO: implement self. */ };
      that.getTabFooter = function() { /* TODO: implement self. */ };
      that.getTabItems = function() { /* TODO: implement self. */ };

      that.getTitleLabels = function() {
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

      that.getImages = function() { /* TODO: implement self. */ };

      that.getIcons = function() { /* TODO: implement self. */ };
      that.setIcon = function(index) { /* TODO: implement self. */ };

      that.getControls = function() {
        return self.controls;
      };

      that.getBackground = function() {
        return self.background;
      };

      that.getBottomLine = function() {
        return self.bottomLine;
      };

      that.setToolbar = function(toolbar) { /* TODO: implement self. */ };

      that.unLoadToolbar = function() { /* TODO: implement self. */ };

      that.bringToFront = function() {
        showTab(self);
      };

      that.setLoading = function(loading) {
        self.loading = loading;
      };

      that.firstResize = function() { /* TODO: implement self. */ };

      var getRegion = function() {
        return self.name.toLowerCase() + "DialogRegion";
      };

      var showTab = function(view) {

        var self = {};

        var showView = function(mainView, mainRegion, viewController) {
          Cairo.LoadingMessage.show();

          //////////////
          mainRegion.show(mainView);

          Cairo.LoadingMessage.close();
        }

        /*
         this function will be called by the tab manager every time the
         view must be created. when the tab is not visible the tab manager
         will not call this function but only make the tab visible
         */
        var createDialog = function(tabId) {


          // viewController properties and methods
          //
          self.entityInfo = new Backbone.Model({
            entityTitle: view.text
          });

          // create the tree region
          //
          var regionName = getRegion();
          var region = {};
          region[regionName] = tabId;
          Cairo.addRegions(region);

          // create the dialog
          //
          showView(
            new Cairo.Dialogs.Views.DialogLayout({ model: self.entityInfo }),
            Cairo[regionName],
            self);
        };

        var destroyDialog = function() {
          for(var i = 0; i < view.listeners.length; i += 1) {
            var listener = view.listeners[i];
            if(listener.viewDestroy !== undefined) {
              listener.viewDestroy();
            }
          }
        };

        // create the tab
        //
        Cairo.mainTab.showTab(view.text, getRegion(), view.path, createDialog, destroyDialog);

        return true;
      }

      that.showDialog = function() {
        showTab(self);
        self.visible = true;
      };

      that.showView = function() { /* TODO: implement self. */ };
      that.setFocusFirstControl = function() { /* TODO: implement self. */ };
      that.getActiveControl = function() { /* TODO: implement self. */ };

      that.getTextWidth = function(text) { /* TODO: implement self. */ };

      that.getIndexGrid = function(grid) { /* TODO: implement self. */ };
      that.setNoResize = function(indexGrid, noResize) { /* TODO: implement self. */ };

      that.getHeight = function() {
        return self.height;
      };

      that.setHeight = function(height) {
        self.height = height;
      };

      that.getWidth = function() {
        return self.width;
      };

      that.setWidth = function(width) {
        self.width = width;
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
        saved: false
      };

      var that = Views.createView();

      that.getEditDocumentsButton = function() {
        return self.btnEditDocument;
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