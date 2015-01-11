(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Dialogs.Views", function(Views, Cairo, Backbone, Marionette, $, _) {

    var Controls = Cairo.Controls;
    
    var createControls = function(view, viewManager) {
      var tabs = view.tabs.count();
      var count = view.controls.count();
      var form = $('<div class="dialog-form"></div>');
      //
      // first tabs
      //
      if(tabs > 1) {
        var row = $('<div class="row"></div>');
        var column = $('<div class="col-lg-12 col-md-12 col-sm-12"></div>');
        var group = $('<div class="btn-group" role="group" aria-label="..."></div>')
        for (var i = 0; i < tabs; i += 1) {
          var control = view.controls.item(i);
          var element = $(control.htmlTag);
          control.setElement(element, viewManager);
          group.append(element);
          row.append(column);
        }
        column.append(group);
        form.append(row);
      }
      //
      // add a row with one or more elements
      //
      var newRow = function(elements, clazz) {
        var row = $('<div class="row dialog-row"></div>');
        var column = $('<div class="' + clazz + '"></div>');
        column.append(elements);
        row.append(column);
        return row;
      };
      //
      // now controls
      //
      for(var i = 0; i < count; i += 1) {
        var control = view.controls.item(i);
        if(!Controls.isTab(control)) {
          var element = $(control.htmlTag);
          var clazz = control.getObjectType() === 'cairo.controls.grid' ? "col-lg-7 col-md-9 col-sm-12" : "col-lg-4 col-md-5 col-sm-7";
          control.setElement(element, viewManager);
          form.append(newRow(element, clazz));
        }
      }
      return form;
    };

    /*
     the main view which contains all other views in the dialog
     this view is created by the dialog client object
     */
    Views.DialogLayout = Marionette.Layout.extend({
      template: "#dialog-layout-template",

      onRender: function(){
        var viewManager = this.model.get('viewManager');
        var viewDef = this.model.get('viewDef');
        this.$("#formBody").append(createControls(viewDef, viewManager));
        viewManager.bindView(this);
      }

    });

    Views.createView = function() {

      var _viewId = "view" + (new Date).getTime().toString();

      var controls = Cairo.Collections.createCollection(null);

      var self = {
        listeners: [],

        text: "",
        title: Controls.createLabel(),
        subTitle: Controls.createLabel(),

        path: "",
        name: "",

        controls: controls,
        tabs: Cairo.Collections.createCollection(Controls.createTab, controls),
        maskEdits: Cairo.Collections.createCollection(Controls.createInput, controls),
        datePickers: Cairo.Collections.createCollection(Controls.createDatePicker, controls),
        selects: Cairo.Collections.createCollection(Controls.createSelect, controls),
        optionButtons: Cairo.Collections.createCollection(Controls.createOptionButton, controls),
        checkBoxes: Cairo.Collections.createCollection(Controls.createCheckBox, controls),
        buttons: Cairo.Collections.createCollection(Controls.createButton, controls),
        combos: Cairo.Collections.createCollection(Controls.createCombo, controls),
        passwords: Cairo.Collections.createCollection(Controls.createPassword, controls),
        grids: Cairo.Collections.createCollection(Controls.createGrid, controls),
        inputs: Cairo.Collections.createCollection(Controls.createInput, controls),
        progressBars: Cairo.Collections.createCollection(Controls.createProgressBar, controls),
        textAreas: Cairo.Collections.createCollection(Controls.createTextArea, controls),
        labels: Cairo.Collections.createCollection(Controls.createLabel, controls),      // used for properties of type label
        ctrlLabels: Cairo.Collections.createCollection(Controls.createLabel, controls),  // used to associate a label to a property
        titles: Cairo.Collections.createCollection(Controls.createLabel, controls),

        bottomLine: Controls.createControl(),
        background: Controls.createControl(),
        btnSave: Controls.createControl(),
        btnCancel: Controls.createControl(),
        btnClose: Controls.createControl(),
        form: null,

        width: 320,
        height: 480,
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
        return self.btnSave;
      };
      that.getCancelButton = function() {
        return self.btnCancel;
      };
      that.getCloseButton = function() {
        return self.btnClose;
      };

      that.getTab = function() { /* TODO: implement this. */ };
      that.getTabFooter = function() { /* TODO: implement this. */ };
      that.getTabItems = function() { /* TODO: implement this. */ };

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

      that.getDescription = function() { /* TODO: implement this. */ };

      that.getImages = function() { /* TODO: implement this. */ };

      that.getIcons = function() { /* TODO: implement this. */ };
      that.setIcon = function(index) { /* TODO: implement this. */ };

      that.getControls = function() {
        return self.controls;
      };

      that.getBackground = function() {
        return self.background;
      };

      that.getBottomLine = function() {
        return self.bottomLine;
      };

      that.setToolbar = function(toolbar) { /* TODO: implement this. */ };

      that.unLoadToolbar = function() { /* TODO: implement this. */ };

      that.bringToFront = function() {
        showTab(self);
      };

      that.setLoading = function(loading) {
        self.loading = loading;
      };

      var getControlId = function(control) {
        var id = control.data('_ID_');
        return id !== undefined ? id : control.parent().data('_ID_');
      };

      var controlIsVisible = function(control) {
        var isVisible = false;
        controls.each(function(c) {
          if(c._ID_() === getControlId(control)) {
            isVisible = c.getVisible();
            return false;
          }
        });
        return isVisible;
      };

      that.showRows = function() {
        var setVisible = function() {
          var row = $(this);
          var almostOneIsVisible = false;
          var checkForVisibleElements = function() {
            var child = $(this);
            if(child.is("div")) {
              child.children().each(checkForVisibleElements);
            }
            else {
              if(controlIsVisible(child)) {
                almostOneIsVisible = true;
              }
            }
            if(almostOneIsVisible) {
              return false;
            }
          };
          row.children().each(checkForVisibleElements);
          if(almostOneIsVisible) {
            row.show();
          }
          else {
            row.hide();
          }
        };
        if(self.form !== null) {
          self.form.children('.dialog-form').children('.dialog-row').each(setVisible);
        }
      };

      that.firstResize = function() { /* TODO: implement this. */ };

      var getRegion = function() {
        return _viewId + "DialogRegion";
      };

      var createTab = function(view, viewManager) {
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
            entityTitle: view.subTitle.getText(),
            viewDef: view,
            viewManager: viewManager
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

        return {
          createDialog: createDialog,
          destroyDialog: destroyDialog
        };
      };

      self.tabHandler = createTab(self, that);

      var showTab = function() {

        // create the tab
        //
        Cairo.mainTab.showTab(
          self.text,
          getRegion(),
          self.path,
          self.tabHandler.createDialog,
          self.tabHandler.destroyDialog);

        return true;
      }

      that.showModalDialog = function () { /* TODO: implement this. */ };

      that.showDialog = function() {
        showTab();
        self.visible = true;
      };

      that.closeDialog = function() {
        that.close();
      };

      that.save = function() { /* TODO: implement this. */ };

      that.close = function() {
        Cairo.mainTab.closeTab(getRegion());
      };

      that.showView = function() { /* TODO: implement this. */ };
      that.setFocusFirstControl = function() { /* TODO: implement this. */ };
      that.getActiveControl = function() { /* TODO: implement this. */ };

      that.getTextWidth = function(text) { /* TODO: implement this. */ };

      that.getIndexGrid = function(grid) { /* TODO: implement this. */ };
      that.setNoResize = function(indexGrid, noResize) { /* TODO: implement this. */ };

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

      var onSaveClick = function() {
        that.raiseEvent("saveClick");
      };

      var onCloseClick = function() {
        that.raiseEvent("closeClick");
      };

      that.bindView = function(view) {
        self.btnSave.setElement(view.$('.dialog-save-button'));
        self.btnSave.getElement().click(onSaveClick);

        self.btnClose.setElement(view.$('.dialog-close-button'));
        self.btnClose.getElement().click(onCloseClick);

        self.subTitle.setElement(view.$('.dialog-subtitle'));

        self.btnCancel = self.btnClose;
        self.form = view.$("#formBody");
      };

      that.raiseEvent = function(eventName, eventData) {
        for(var i = 0; i < self.listeners.length; i += 1) {
          var listener = self.listeners[i];
          if(listener[eventName] !== undefined) {
            listener[eventName](eventData);
          }
        }
      };

      that.raiseEventWithPromise = function(eventName, eventData, eventArgs) {
        for(var i = 0; i < self.listeners.length; i += 1) {
          var listener = self.listeners[i];
          if(listener[eventName] !== undefined) {
            return listener[eventName](eventData, eventArgs);
          }
        }
      };

      that.onMaskEditChange = function(control) {
        return function() {
          that.raiseEvent("maskEditChange", control.getIndex());
        };
      };

      that.onDateChange = function(control) {
        return function() {
          that.raiseEvent("dateChange", control.getIndex());
        };
      };

      that.onTextChange = function(control) {
        return function() {
          that.raiseEvent("textChange", control.getIndex());
        };
      };

      that.onTextAreaChange = function(control) {
        return function() {
          that.raiseEvent("textAreaChange", control.getIndex());
        };
      };

      that.onSelectChange = function(control) {
        return function() {
          that.raiseEvent("selectChange", control.getIndex());
        };
      };

      that.onTabClick = function(control) {
        return function() {
          that.raiseEvent("tabClick", control.getIndex());
        };
      };

      //
      // grid
      //
      that.onGridDblClick = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("gridDblClick", control.getIndex(), eventArgs);
        };
      };

      that.onGridAfterDeleteRow = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("gridAfterDeleteRow", control.getIndex(), eventArgs);
        };
      };

      that.onGridDeleteRow = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("gridDeleteRow", control.getIndex(), eventArgs);
        };
      };

      that.onGridNewRow = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("gridNewRow", control.getIndex(), eventArgs);
        };
      };

      that.onGridValidateRow = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("gridValidateRow", control.getIndex(), eventArgs);
        };
      };

      that.onGridColumnAfterEdit = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("gridColumnAfterEdit", control.getIndex(), eventArgs);
        };
      };

      that.onGridColumnAfterUpdate = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("gridColumnAfterUpdate", control.getIndex(), eventArgs);
        };
      };

      that.onGridColumnBeforeEdit = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("gridColumnBeforeEdit", control.getIndex(), eventArgs);
        };
      };

      that.onGridColumnButtonClick = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("gridColumnButtonClick", control.getIndex(), eventArgs);
        };
      };

      that.onGridSelectionChange = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("gridSelectionChange", control.getIndex(), eventArgs);
        };
      };

      that.onGridSelectionRowChange = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("gridSelectionRowChange", control.getIndex(), eventArgs);
        };
      };

      return that;
    };

    Views.createMasterView = function() {

      var self = {
        btnEditDocument: Controls.createButton(),
        btnNew: Controls.createButton(),
        btnCopy: Controls.createButton(),
        btnPrint: Controls.createButton(),
        btnPermission: Controls.createButton(),
        btnDiscardChanges: Controls.createButton(),
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
      that.sendAutoSave = function() { /* TODO: implement this. */ };
      that.raiseAfterLoadEvent = function() { /* TODO: implement this. */ };
      that.getPrintButton = function() {
        return self.btnPrint;
      };
      that.getPermissionsButton = function() {
        return self.btnPermission;
      };
      that.setSaved = function(saved) {
        self.saved = saved;
      };

      var supperBindView = that.bindView;

      var onEditDocumentClick = function() {
        that.raiseEvent("saveClick");
      };

      var onPermissionClick = function() {
        that.raiseEvent("permissionsClick");
      };

      var onPrintClick = function() {
        that.raiseEvent("printClick");
      };

      var onDiscardChangesClick = function() {
        that.raiseEvent("cancelClick");
      };

      var onCopyClick = function() {
        that.raiseEvent("copyClick");
      };

      var onNewClick = function() {
        that.raiseEvent("newClick");
      };


      that.bindView = function(view) {
        supperBindView(view);
        self.btnEditDocument.setElement(view.$('.dialog-documents-button'));
        self.btnEditDocument.getElement().click(onEditDocumentClick);

        self.btnPermission.setElement(view.$('.dialog-permissions-button'));
        self.btnPermission.getElement().click(onPermissionClick);

        self.btnPrint.setElement(view.$('.dialog-print-button'));
        self.btnPrint.getElement().click(onPrintClick);

        self.btnDiscardChanges.setElement(view.$('.dialog-discard-button'));
        self.btnDiscardChanges.getElement().click(onDiscardChangesClick);

        self.btnCopy.setElement(view.$('.dialog-copy-button'));
        self.btnCopy.getElement().click(onCopyClick);

        self.btnNew.setElement(view.$('.dialog-new-button'));
        self.btnNew.getElement().click(onNewClick);
      };

      return that;
    };

    Views.createWizardView = function() {

      var that = Views.createView();

      that.getImgWiz1 = function() { /* TODO: implement this. */ };
      that.getImgWiz3 = function() { /* TODO: implement this. */ };
      that.getImgWiz5 = function() { /* TODO: implement this. */ };
      that.getNextButton = function() { /* TODO: implement this. */ };
      that.getBackButton = function() { /* TODO: implement this. */ };
      that.getDialogBackground = function() { /* TODO: implement this. */ };
      that.getTitleBackground = function() { /* TODO: implement this. */ };

      return that;
    };

    Views.createDocumentView = function() {

      var that = Views.createView();

      that.setLoading = function(loading) { /* TODO: implement this. */ };
      that.getCancelUnload = function() { /* TODO: implement this. */ };
      that.setCancelUnload = function(loading) { /* TODO: implement this. */ };
      that.getUnloadCount = function() { /* TODO: implement this. */ };
      that.setUnloadCount = function(count) { /* TODO: implement this. */ };
      that.getFooterBackground = function() { /* TODO: implement this. */ };

      that.setNoButtons1 = function(buttons) { /* TODO: implement this. */ };
      that.setNoButtons2 = function(buttons) { /* TODO: implement this. */ };
      that.setNoButtons3 = function(buttons) { /* TODO: implement this. */ };
      that.setButtonsEx2 = function(buttons) { /* TODO: implement this. */ };
      that.setButtonsEx3 = function(buttons) { /* TODO: implement this. */ };

      that.setToolbarButtons = function() { /* TODO: implement this. */ };
      that.setHeightToDocWithDescription = function() { /* TODO: implement this. */ };

      return that;
    };

  });

}());