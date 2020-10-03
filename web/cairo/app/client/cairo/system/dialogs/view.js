(function() {
  "use strict";

  /*
   this module manages a view ...
   */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Dialogs.Views", function(Views, Cairo, Backbone, Marionette, $, _) {

    var C_MODULE = "Dialogs.Views.view";

    var Controls = Cairo.Controls;
    
    var createControls = function(view, viewManager, existingForm) {
      var tabsCount = view.tabs.count();
      var count = view.controls.count();
      var form = existingForm || $('<div class="dialog-form"></div>');
      var tabs = [];
      var tabGroups = [];
      var row = null;
      var column = null;
      var lastTabIndex = -1;

      //
      // creates a tab definition object with
      //    count: amount of controls,
      //    columns: how many columns this tab has,
      //    colIndex: used to know in which column should the control be added
      //
      var setTabDefinition = function(index, group) {
        if(tabs[group] === undefined) {
          tabs[group]= [];
        }
        tabs[group].push({ count: 0, columns: 0, colIndex: 0 });
        for(var j = 0; j < count; j += 1) {
          var c = view.controls.item(j);
          var tabIndex = getTabIndexInGroup(index, group);
          if(c.getTabGroupIndex() === index && c.getTabGroup() === group) {
            tabs[group][tabIndex].count += 1;
          }
        }
        if(view.type === 'ListDoc' || view.type === 'Params' || view.type === 'Preview') {
          tabs[group][tabIndex].columns = 1;
        }
        else {
          var tab = view.tabs.get(index);
          switch(tab.getLayout()) {
            case Cairo.Dialogs.Layout.verticalOneColumn:
              tabs[group][tabIndex].columns = 1;
              break;
            case Cairo.Dialogs.Layout.verticalTwoColumn:
              tabs[group][tabIndex].columns = 2;
              break;
            default:
              tabs[group][tabIndex].columns = view.tabs.get(index).getColumns();
              break;
          }
        }
      };

      var getTabIndexInGroup = function(index, group) {
        if(group > 0) {
          for(var i = 0; i < group; i += 1) {
            index -= tabGroups[i];
          }
        }
        return index;
      };

      var m_groupBox = null;
      var m_lastTabIndex = -1;

      var getTabBox = function(index) {
        var clazz = "";
        if(index !== m_lastTabIndex + 1) {
          m_groupBox = null;
          clazz = " secondary-tab-box";
        }
        m_lastTabIndex = index;
        if(m_groupBox === null) {
          m_groupBox = $('<ul class="nav nav-tabs tab-control" role="tablist"></ul>');

          var tabColumn = $('<div class="col-lg-12 col-md-12 col-sm-12' + clazz + '"></div>');
          tabColumn.append(m_groupBox);

          var tabsRow = $('<div class="row"></div>');
          tabsRow.append(tabColumn);

          form.append(tabsRow);
        }
        return m_groupBox;
      };

      if(tabsCount > 1) {
        for(var i = 0; i < tabsCount; i += 1) {
          var group = view.tabs.get(i).getTabGroup();
          if(tabGroups[group] === undefined) {
            tabGroups[group] = 1;
          }
          else {
            tabGroups[group] += 1;
          }
        }
        for(var i = 0; i < tabsCount; i += 1) {
          setTabDefinition(i, view.tabs.get(i).getTabGroup());
        }
      }
      else {
        setTabDefinition(0, 0);
      }

      //
      // add a row with one or more elements
      //
      var getRow = function(elements, clazz, tabIndex, tabGroup, isLabel, isBigColumn) {
        if(row === null
          || tabs[tabGroup][tabIndex].colIndex >= tabs[tabGroup][tabIndex].columns
          || lastTabIndex !== tabIndex
          || isBigColumn) {
          row = $('<div class="row dialog-row"></div>');
          tabs[tabGroup][tabIndex].colIndex = 0;
          lastTabIndex = tabIndex;
        }
        if(isLabel || column === null) {
          column = $('<div class="' + clazz + '"></div>');
        }
        column.append(elements);
        row.append(column);

        if(! isLabel) {
          tabs[tabGroup][tabIndex].colIndex += 1;
          column = null;
        }

        if(isBigColumn) {
          tabs[tabGroup][tabIndex].colIndex = tabs[tabGroup][tabIndex].columns;
        }

        return row;
      };

      var isLabelForControl = function(control) {
        return control.getObjectType() === 'cairo.controls.label' ? control.getLabelFor() !== "" : false;
      };

      var checkBigColumn = function(control, index) {
        if(view.type === 'ListDoc' || view.type === 'Params' || view.type === 'Preview') {
          return true;
        }
        else {
          if(isLabelForControl(control)) {
            control = view.controls.item(index+1);
          }
          return (
               control.getObjectType() === 'cairo.controls.textArea'
            || control.getObjectType() === 'cairo.controls.grid'
            || control.getObjectType() === 'cairo.controls.label'
            );
        }
      };

      var getColumnClass = function(tab, tabIndex, group) {
        switch(tab.getLayout()) {
          case Cairo.Dialogs.Layout.verticalOneColumn:
            return "col-lg-4 col-md-4 col-sm-4 vertical-one-column";

          case Cairo.Dialogs.Layout.verticalTwoColumn:
            return "col-lg-4 col-md-4 col-sm-4 vertical-two-column";

          default:

            switch(tabs[group][tabIndex].columns) {
              case 1: /* it is not a bug when 1 column per tab the class must be col-xx-12 */
                return "col-lg-12 col-md-12 col-sm-12";

              case 3:
                return "col-lg-4 col-md-4 col-sm-6";

              case 4:
                return "col-lg-3 col-md-3 col-sm-6";

              case 6:
                return "col-lg-2 col-md-2 col-sm-2";

              case 12: /* it is not a bug when 12 column per tab the class must be col-xx-1 */
              default:
                return "col-lg-1 col-md-1 col-sm-1"
            }
            break;
        }
      };

      var m_documentHeader = null;
      var m_headerColIndex = 0;

      var getDocumentHeader = function() {
        if(existingForm && m_documentHeader === null) {
          m_documentHeader = $('.document_header_box', existingForm);
        }
        if(m_documentHeader === null) {
          m_documentHeader = $('<div class="row document_header_box"></div>');
          form.append(m_documentHeader);
        }
        return m_documentHeader;
      };

      var addToDocumentHeader = function(element) {
        var clazz = "";
        switch(m_headerColIndex) {
          case 0:
            clazz = "col-lg-3 col-md-4 col-sm-5";
            break;
          case 1:
            clazz = "col-lg-1 col-md-2 col-sm-2";
            break;
          case 2:
            clazz = "col-lg-3 col-md-4 col-sm-5";
            break;
        }
        m_headerColIndex += 1;
        var col = $('<div class="' + clazz + '"></div>');
        col.append(element);
        getDocumentHeader().append(col);
      };

      var inHeaderBox = function(control) {
        return control.getTag() === 'document_header';
      };

      if(view.controls.selectFirst(inHeaderBox)) {
        getDocumentHeader();
      }

      //
      // now controls
      //
      if(tabsCount === 0) {
        tabsCount = 1;
      }

      for(var j = 0; j < tabsCount; j++) {
        var tab = view.tabs.get(j);
        var tabGroup = tab.getTabGroup();
        var tabIndex = getTabIndexInGroup(j, tabGroup);
        for(var i = 0; i < count; i += 1) {
          var control = view.controls.item(i);
          if(control.getElement() === null) {
            if(Controls.isTab(control)) {
              if(tabGroups[control.getTabGroup()] > 1 && tabGroup === control.getTabGroup()) {
                var element = $(control.htmlTag);
                control.setElement(element, viewManager);
                getTabBox(i).append(element);
              }
            }
            else if(tabGroup === control.getTabGroup() && tabIndex === control.getTabGroupIndex()) {
              var element = $(control.htmlTag);
              control.setElement(element, viewManager);
              control.setSelectOnFocus(true);
              if(control.getTag() === 'document_header') {
                addToDocumentHeader(element);
              }
              else {
                var isBigColumn = checkBigColumn(control, i);
                var tabGroup = control.getTabGroup();
                var tabIndex = control.getTabGroupIndex();
                var clazz = isBigColumn ? "col-lg-12 col-md-12 col-sm-12" : getColumnClass(tab, tabIndex, tabGroup);
                form.append(getRow(element, clazz, tabIndex, tabGroup, isLabelForControl(control), isBigColumn));
              }
            }
          }
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

    Views.DocumentLayout = Marionette.Layout.extend({
      template: "#document-layout-template",

      onRender: function(){
        var viewManager = this.model.get('viewManager');
        var viewDef = this.model.get('viewDef');
        this.$("#formBody").append(createControls(viewDef, viewManager));
        viewManager.bindView(this);
      }

    });

    Views.WizardLayout = Marionette.Layout.extend({
      template: "#wizard-layout-template",

      onRender: function(){
        var viewManager = this.model.get('viewManager');
        var viewDef = this.model.get('viewDef');
        this.$("#formBody").append(createControls(viewDef, viewManager));
        viewManager.bindView(this);
      }

    });

    Views.DocumentListLayout = Marionette.Layout.extend({
      template: "#document-list-layout-template",

      onRender: function(){
        var viewManager = this.model.get('viewManager');
        var viewDef = this.model.get('viewDef');
        this.$("#formBody").append(createControls(viewDef, viewManager));
        viewManager.bindView(this);
      }

    });

    Views.ParamsLayout = Marionette.Layout.extend({
      template: "#params-layout-template",

      onRender: function(){
        var viewManager = this.model.get('viewManager');
        var viewDef = this.model.get('viewDef');
        this.$("#formBody").append(createControls(viewDef, viewManager));
        viewManager.bindView(this);
      }

    });

    Views.PreviewLayout = Marionette.Layout.extend({
      template: "#preview-layout-template",

      onRender: function(){
        var viewManager = this.model.get('viewManager');
        var viewDef = this.model.get('viewDef');
        this.$("#formBody").append(createControls(viewDef, viewManager));
        viewManager.bindView(this);
      }

    });

    Views.createView = function(viewType) {

      var _viewId = "view" + (new Date).getTime().toString();

      var controls = Cairo.Collections.createCollection(null);

      var self = {
        type: viewType,

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
        checkboxes: Cairo.Collections.createCollection(Controls.createCheckbox, controls),
        buttons: Cairo.Collections.createCollection(Controls.createButton, controls),
        combos: Cairo.Collections.createCollection(Controls.createCombo, controls),
        passwords: Cairo.Collections.createCollection(Controls.createPassword, controls),
        grids: Cairo.Collections.createCollection(Controls.createGrid, controls),
        inputs: Cairo.Collections.createCollection(Controls.createInput, controls),
        progressBars: Cairo.Collections.createCollection(Controls.createProgressBar, controls),
        textAreas: Cairo.Collections.createCollection(Controls.createTextArea, controls),
        labels: Cairo.Collections.createCollection(Controls.createLabel, controls),     // used for properties of type label
        ctrlLabels: Cairo.Collections.createCollection(Controls.createLabel, controls), // used to associate a label to a property
        titles: Cairo.Collections.createCollection(Controls.createLabel, controls),

        bottomLine: Controls.createButton(),
        background: Controls.createButton(),
        btnSave: Controls.createButton(),
        btnCancel: Controls.createButton(),
        btnClose: Controls.createButton(),
        form: null,

        visible: false,
        loading: true
      };

      var that = {};

      that.getType = function() {
        return self.type;
      };

      that.getText = function() {
        return self.text;
      };
      that.setText = function(text) {
        Cairo.validateAssignmentIsNotNull(text, C_MODULE, "createView.setText");
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

      that.getCheckboxes = function() {
        return self.checkboxes;
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
        };

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
          var LayoutConstructor = null;
          switch(that.getType()) {
            case 'Dialog':
              LayoutConstructor = Cairo.Dialogs.Views.DialogLayout;
              break;
            case 'Document':
              LayoutConstructor = Cairo.Dialogs.Views.DocumentLayout;
              break;
            case 'Wizard':
              LayoutConstructor = Cairo.Dialogs.Views.WizardLayout;
              break;
            case 'ListDoc':
              LayoutConstructor = Cairo.Dialogs.Views.DocumentListLayout;
              break;
            case 'Params':
              LayoutConstructor = Cairo.Dialogs.Views.ParamsLayout;
              break;
            case 'Preview':
              LayoutConstructor = Cairo.Dialogs.Views.PreviewLayout;
          }
          var mainView = new LayoutConstructor({ model: self.entityInfo });

          showView(
            mainView,
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
      };

      that.showModalDialog = function () {
        that.showDialog();
      };

      that.showDialog = function() {
        showTab();
        self.visible = true;
        Cairo.resizeComponents();
      };

      that.closeDialog = function() {
        that.close();
      };

      that.save = function() { /* TODO: implement this. */ };

      that.close = function() {
        Cairo.mainTab.closeTab(getRegion());
      };

      that.preShowView = function() { /* TODO: implement this. */ };
      that.setFocusFirstControl = function() { /* TODO: implement this. */ };
      that.getActiveControl = function() { /* TODO: implement this. */ };

      that.getTextWidth = function(text) { /* TODO: implement this. */ };

      that.getIndexGrid = function(grid) { /* TODO: implement this. */ };

      that.addListener = function(listenerDefinition) {
        self.listeners.push(listenerDefinition);
      };

      var completePendingEdits = function() {
        for(var i = 0, count = self.grids.size(); i < count; i +=1) {
          self.grids.item(i).endEdit();
        }
        $(':focus').blur();
      };

      var onSaveClick = function() {
        completePendingEdits();
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

      /*
       *  This function will call all listeners
       * */
      that.raiseEvent = function(eventName, eventData) {
        if(eventName.endsWith("Click")) {
          Cairo.execLater(function(){ raiseEventAux(eventName, eventData); });
        }
        else {
          raiseEventAux(eventName, eventData);
        }
      };

      var raiseEventAux = function(eventName, eventData) {
        for(var i = 0; i < self.listeners.length; i += 1) {
          var listener = self.listeners[i];
          if(listener[eventName] !== undefined) {
            listener[eventName](eventData);
          }
        }
      };

      /*
      *  This function will call only one listener (the first registered) and return the value of that call
      *  which must be a promise (that is the listener responsibility)
      * */
      that.raiseEventWithPromise = function(eventName, eventData, eventArgs, control) {
        for(var i = 0; i < self.listeners.length; i += 1) {
          var listener = self.listeners[i];
          if(listener[eventName] !== undefined) {
            /*
            *
            * if the client has registered a containsProperty callback
            * we call it to check if the listener is the owner of the property
            * which has raised the event.
            *
            * this is needed because this raise only call one listener and returns
            * the answer from that call.
            *
            * in the case of documents we have three listeners and we need to know
            * which one of them we must call
            *
            * */
            if(listener['containsProperty'] !== undefined) {
              if(listener['containsProperty'](control)) {
                return listener[eventName](eventData, eventArgs);
              }
            }
            /*
            *
            * master and wizard don't register this containsProperty callback
            * because there is only one listener
            *
            * */
            else {
              return listener[eventName](eventData, eventArgs);
            }
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

      that.onCheckboxClick = function(control) {
        return function() {
          that.raiseEvent("checkboxClick", control.getIndex());
        };
      };

      that.onOptionButtonClick = function(control) {
        return function() {
          that.raiseEvent("optionButtonClick", control.getIndex());
        };
      };

      that.onTabClick = function(control) {
        return function() {
          that.raiseEvent("tabClick", { index: control.getIndex(), tag: control.getTag() });
        };
      };

      that.onButtonClick = function(control) {
        return function() {
          debugger;
          that.raiseEvent("buttonClick", control.getIndex());
        };
      };

      //
      // grid
      //
      that.onGridDblClick = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("gridDblClick", control.getIndex(), eventArgs, control);
        };
      };

      that.onGridAfterDeleteRow = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("gridAfterDeleteRow", control.getIndex(), eventArgs, control);
        };
      };

      that.onGridDeleteRow = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("gridDeleteRow", control.getIndex(), eventArgs, control);
        };
      };

      that.onGridNewRow = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("gridNewRow", control.getIndex(), eventArgs, control);
        };
      };

      that.onGridValidateRow = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("gridValidateRow", control.getIndex(), eventArgs, control);
        };
      };

      that.onGridColumnAfterEdit = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("gridColumnAfterEdit", control.getIndex(), eventArgs, control);
        };
      };

      that.onGridColumnAfterUpdate = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("gridColumnAfterUpdate", control.getIndex(), eventArgs, control);
        };
      };

      that.onGridColumnBeforeEdit = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("gridColumnBeforeEdit", control.getIndex(), eventArgs, control);
        };
      };

      that.onGridColumnButtonClick = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("gridColumnButtonClick", control.getIndex(), eventArgs, control);
        };
      };

      that.onGridSelectionChange = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("gridSelectionChange", control.getIndex(), eventArgs, control);
        };
      };

      that.onGridSelectionRowChange = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("gridSelectionRowChange", control.getIndex(), eventArgs, control);
        };
      };

      that.showAddedControls = function() {
        //
        // the first time the view is not binded yet but
        // no controls couldn't have been added becuase it
        // it is the first show anyways :)
        //
        if(self.form !== null) {
          createControls(self, that, self.form.children('.dialog-form'));
        }
      };

      that.removeControl = function(ctrl) {
        if(ctrl.getElement() !== null) {
          $(ctrl.getElement()).remove();
        }
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
        saved: false,
        noMoveGenericButton: false,
        popMenuClient: null
      };

      var that = Views.createView('Dialog');

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
      that.setNoMoveGenericButton = function(value) {
        self.noMoveGenericButton = value;
      };
      that.setPopMenuClient = function(value) {
        self.popMenuClient = value;
      };

      var superBindView = that.bindView;

      var onEditDocumentClick = function() {
        that.raiseEvent("documentsClick");
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
        superBindView(view);

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

      var self = {
        btnBack: Controls.createButton(),
        btnNext: Controls.createButton(),
        btnCancel: Controls.createButton()
      };

      var that = Views.createView('Wizard');

      that.getBackButton = function() {
        return self.btnBack;
      };

      that.getNextButton = function() {
        return self.btnNext;
      };

      that.getCancelButton = function() {
        return self.btnCancel;
      };

      var superBindView = that.bindView;

      var onBackClick = function() {
        that.raiseEvent("backClick");
      };

      var onNextClick = function() {
        that.raiseEvent("nextClick");
      };

      var onCancelClick = function() {
        that.raiseEvent("cancelClick");
      };

      that.bindView = function(view) {
        superBindView(view);

        self.btnBack.setElement(view.$('.dialog-wizard-back-button'));
        self.btnBack.getElement().click(onBackClick);

        self.btnNext.setElement(view.$('.dialog-wizard-next-button'));
        self.btnNext.getElement().click(onNextClick);

        self.btnCancel.setElement(view.$('.dialog-wizard-cancel-button'));
        self.btnCancel.getElement().click(onCancelClick);
      };

      return that;
    };

    Views.createDocumentView = function() {

      var self = {
        btnEditDocument: Controls.createButton(),
        btnNew: Controls.createButton(),
        btnCopy: Controls.createButton(),
        btnPrint: Controls.createButton(),
        btnDiscardChanges: Controls.createButton(),
        menuEdit: Controls.createMenu(),
        menuInvalidate: Controls.createMenu(),
        menuDelete: Controls.createMenu(),
        menuApply: Controls.createMenu(),
        menuDocuments: Controls.createMenu(),
        menuStatus: Controls.createMenu(),
        menuAlarms: Controls.createMenu(),
        menuHistory: Controls.createMenu(),
        saved: false
      };

      var that = Views.createView('Document');

      /* TODO: some of this methods will be removed */
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
      /* TODO: end => some of this methods will be removed */

      that.getEditDocumentsButton = function() {
        return self.btnEditDocument;
      };
      that.getNewButton = function() {
        return self.btnNew;
      };
      that.getCopyButton = function() {
        return self.btnCopy;
      };
      that.getPrintButton = function() {
        return self.btnPrint;
      };
      that.setSaved = function(saved) {
        self.saved = saved;
      };

      var superBindView = that.bindView;

      var onEditDocumentClick = function() {
        that.raiseEvent("documentsClick");
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

      var onEditClick = function(e) {
        e.preventDefault();
        that.raiseEvent("editClick");
      };

      var onInvalidateClick = function(e) {
        e.preventDefault();
        that.raiseEvent("invalidateClick");
      };

      var onDeleteClick = function(e) {
        e.preventDefault();
        that.raiseEvent("deleteClick");
      };

      var onApplyClick = function(e) {
        e.preventDefault();
        that.raiseEvent("applyClick");
      };

      var onDocumentsClick = function(e) {
        e.preventDefault();
        that.raiseEvent("documentsClick");
      };

      var onStatusClick = function(e) {
        e.preventDefault();
        that.raiseEvent("statusClick");
      };

      var onAlarmsClick = function(e) {
        e.preventDefault();
        that.raiseEvent("alarmsClick");
      };

      var onHistoryClick = function(e) {
        e.preventDefault();
        that.raiseEvent("historyClick");
      };

      that.bindView = function(view) {
        superBindView(view);

        self.btnEditDocument.setElement(view.$('.dialog-documents-button'));
        self.btnEditDocument.getElement().click(onEditDocumentClick);

        self.btnPrint.setElement(view.$('.dialog-print-button'));
        self.btnPrint.getElement().click(onPrintClick);

        self.btnDiscardChanges.setElement(view.$('.dialog-discard-button'));
        self.btnDiscardChanges.getElement().click(onDiscardChangesClick);

        self.btnCopy.setElement(view.$('.dialog-copy-button'));
        self.btnCopy.getElement().click(onCopyClick);

        self.btnNew.setElement(view.$('.dialog-new-button'));
        self.btnNew.getElement().click(onNewClick);

        self.btnNew.setElement(view.$('.dialog-new-button'));
        self.btnNew.getElement().click(onNewClick);

        self.menuEdit.setElement(view.$('.doc-menu-edit'));
        self.menuEdit.getElement().click(onEditClick);

        self.menuInvalidate.setElement(view.$('.doc-menu-invalidate'));
        self.menuInvalidate.getElement().click(onInvalidateClick);

        self.menuDelete.setElement(view.$('.doc-menu-delete'));
        self.menuDelete.getElement().click(onDeleteClick);

        self.menuApply.setElement(view.$('.doc-menu-apply'));
        self.menuApply.getElement().click(onApplyClick);

        self.menuDocuments.setElement(view.$('.doc-menu-documents'));
        self.menuDocuments.getElement().click(onDocumentsClick);

        self.menuStatus.setElement(view.$('.doc-menu-status'));
        self.menuStatus.getElement().click(onStatusClick);

        self.menuAlarms.setElement(view.$('.doc-menu-alarms'));
        self.menuAlarms.getElement().click(onAlarmsClick);

        self.menuHistory.setElement(view.$('.doc-menu-history'));
        self.menuHistory.getElement().click(onHistoryClick);
      };

      return that;
    };

    Views.createDocumentListView = function() {

      var self = {
        btnEditDocument: Controls.createButton(),
        btnNew: Controls.createButton(),
        btnPrint: Controls.createButton(),
        btnRefresh: Controls.createButton(),
        listGrid: Controls.createListGrid(),
        saved: false
      };

      var that = Views.createView('ListDoc');

      that.getEditDocumentsButton = function() {
        return self.btnEditDocument;
      };
      that.getNewButton = function() {
        return self.btnNew;
      };
      that.getPrintButton = function() {
        return self.btnPrint;
      };
      that.getRefreshButton = function() {
        return self.btnRefresh;
      };
      that.getListGrid = function() {
        return self.listGrid;
      };
      that.setSaved = function(saved) {
        self.saved = saved;
      };

      var superBindView = that.bindView;

      var onEditDocumentClick = function() {
        that.raiseEvent("documentsClick");
      };

      var onPrintClick = function() {
        that.raiseEvent("printClick");
      };

      var onNewClick = function() {
        that.raiseEvent("newClick");
      };

      var completePendingEdits = function() {
        $(':focus').blur();
      };

      var onRefreshClick = function() {
        completePendingEdits();
        that.raiseEvent("refreshClick");
      };

      that.bindView = function(view) {
        superBindView(view);

        self.btnEditDocument.setElement(view.$('.dialog-documents-button'));
        self.btnEditDocument.getElement().click(onEditDocumentClick);

        self.btnPrint.setElement(view.$('.dialog-print-button'));
        self.btnPrint.getElement().click(onPrintClick);

        self.btnNew.setElement(view.$('.dialog-new-button'));
        self.btnNew.getElement().click(onNewClick);

        self.btnRefresh.setElement(view.$('.dialog-refresh-button'));
        self.btnRefresh.getElement().click(onRefreshClick);

        self.listGrid.setContainer(view.$('.document-list-grid-body'), that);

      };

      that.onListGridEditRow = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("editClick", control.getIndex(), eventArgs, control);
        };
      };

      that.onListGridDeleteRow = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("deleteClick", control.getIndex(), eventArgs, control);
        };
      };

      return that;
    };

    Views.createParametersView = function() {

      var self = {
        btnPrint: Controls.createButton(),
        btnPreview: Controls.createButton(),
        btnGrid: Controls.createButton(),
        btnPDF: Controls.createButton(),
        btnEmail: Controls.createButton(),
        btnExport: Controls.createButton(),
        btnInfo: Controls.createButton(),
        listGrid: Controls.createListGrid(),
        pageImage: Controls.createImage(),
        previewTab: null,
        gridTab: null,
        chartTab: null,
        btnFirstPage: Controls.createButton(),
        btnPreviousPage: Controls.createButton(),
        currentPage: Controls.createInput(),
        totalPages: Controls.createInput(),
        btnNextPage: Controls.createButton(),
        btnLastPage: Controls.createButton(),
        saved: false
      };

      self.listGrid.setShowEditButtons(false);

      var that = Views.createView('Params');

      that.getPrintButton = function() {
        return self.btnPrint;
      };
      that.getPreviewButton = function() {
        return self.btnPreview;
      };
      that.getGridButton = function() {
        return self.btnGrid;
      };
      that.getPDFButton = function() {
        return self.btnPDF;
      };
      that.getEmailButton = function() {
        return self.btnEmail;
      };
      that.getExportButton = function() {
        return self.btnExport;
      };
      that.getInfoButton = function() {
        return self.btnInfo;
      };
      that.getListGrid = function() {
        return self.listGrid;
      };
      that.setSaved = function(saved) {
        self.saved = saved;
      };

      var superBindView = that.bindView;

      var onPrintClick = function() {
        that.raiseEvent("printClick");
      };

      var onPreviewClick = function() {
        that.raiseEvent("previewClick");
      };

      var onGridClick = function() {
        that.raiseEvent("gridClick");
      };

      var onPDFClick = function() {
        that.raiseEvent("pdfClick");
      };

      var onEmailClick = function() {
        that.raiseEvent("emailClick");
      };

      var onInfoClick = function() {
        that.raiseEvent("infoClick");
      };

      var onFirstPageClick = function() {
        that.raiseEvent("firstPageClick");
      };

      var onPreviousPageClick = function() {
        that.raiseEvent("previousPageClick");
      };

      var onCurrentPageChange = function() {
        that.raiseEvent("currentPageChange");
      };

      var onNextPageClick = function() {
        that.raiseEvent("nextPageClick");
      };

      var onLastPageClick = function() {
        that.raiseEvent("lastPageClick");
      };

      that.bindView = function(view) {
        superBindView(view);

        self.btnPrint.setElement(view.$('.dialog-print-button'));
        self.btnPrint.getElement().click(onPrintClick);

        self.btnPreview.setElement(view.$('.dialog-preview-button'));
        self.btnPreview.getElement().click(onPreviewClick);

        self.btnGrid.setElement(view.$('.dialog-grid-button'));
        self.btnGrid.getElement().click(onGridClick);

        self.btnPDF.setElement(view.$('.dialog-pdf-button'));
        self.btnPDF.getElement().click(onPDFClick);

        self.btnEmail.setElement(view.$('.dialog-email-button'));
        self.btnEmail.getElement().click(onEmailClick);

        self.btnInfo.setElement(view.$('.dialog-info-button'));
        self.btnInfo.getElement().click(onInfoClick);

        self.listGrid.setContainer(view.$('.document-list-grid-body'), that);

        self.pageImage.setElement(view.$('.dialog-page-image'));

        self.previewTab = view.$('.report-preview-tab');
        self.gridTab = view.$('.report-grid-tab');
        self.chartTab = view.$('.report-chart-tab');

        self.btnFirstPage.setElement(view.$('.report-first-page'));
        self.btnFirstPage.getElement().click(onFirstPageClick);
        self.btnPreviousPage.setElement(view.$('.report-previous-page'));
        self.btnPreviousPage.getElement().click(onPreviousPageClick);
        self.currentPage.setElement(view.$('.report-current-page'), that, onCurrentPageChange);
        self.totalPages.setElement(view.$('.report-total-pages'), that);
        self.totalPages.setEnabled(false);
        self.btnNextPage.setElement(view.$('.report-next-page'));
        self.btnNextPage.getElement().click(onNextPageClick);
        self.btnLastPage.setElement(view.$('.report-last-page'));
        self.btnLastPage.getElement().click(onLastPageClick);

      };

      that.onListGridEditRow = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("editClick", control.getIndex(), eventArgs, control);
        };
      };

      that.onListGridDeleteRow = function(control) {
        return function(eventArgs) {
          return that.raiseEventWithPromise("deleteClick", control.getIndex(), eventArgs, control);
        };
      };

      that.showPage = function(page) {
        self.pageImage.setImage(page);
      };

      that.showPreviewTab = function() {
        self.previewTab.tab('show');
      };

      that.showGridTab = function() {
        self.gridTab.tab('show');
      };

      that.showChartTab = function() {
        self.chartTab.tab('show');
      };

      that.setTotalPages = function(totalPages) {
        self.totalPages.setValue(totalPages);
      };

      that.setCurrentPage = function(page) {
        self.currentPage.setValue(page);
      };

      that.getCurrentPage = function() {
        return self.currentPage.getValue();
      };

      return that;
    };

    Views.createPreviewView = function() {

      var self = {
        pageImage: Controls.createImage(),
        previewTab: null,
        btnFirstPage: Controls.createButton(),
        btnPreviousPage: Controls.createButton(),
        currentPage: Controls.createInput(),
        totalPages: Controls.createInput(),
        btnNextPage: Controls.createButton(),
        btnLastPage: Controls.createButton(),
        saved: false
      };

      var that = Views.createView('Preview');

      that.setSaved = function(saved) {
        self.saved = saved;
      };

      var superBindView = that.bindView;

      var onFirstPageClick = function() {
        that.raiseEvent("firstPageClick");
      };

      var onPreviousPageClick = function() {
        that.raiseEvent("previousPageClick");
      };

      var onCurrentPageChange = function() {
        that.raiseEvent("currentPageChange");
      };

      var onNextPageClick = function() {
        that.raiseEvent("nextPageClick");
      };

      var onLastPageClick = function() {
        that.raiseEvent("lastPageClick");
      };

      that.bindView = function(view) {
        superBindView(view);

        self.pageImage.setElement(view.$('.dialog-page-image'));

        self.previewTab = view.$('.report-preview-tab');

        self.btnFirstPage.setElement(view.$('.report-first-page'));
        self.btnFirstPage.getElement().click(onFirstPageClick);
        self.btnPreviousPage.setElement(view.$('.report-previous-page'));
        self.btnPreviousPage.getElement().click(onPreviousPageClick);
        self.currentPage.setElement(view.$('.report-current-page'), that, onCurrentPageChange);
        self.totalPages.setElement(view.$('.report-total-pages'), that);
        self.totalPages.setEnabled(false);
        self.btnNextPage.setElement(view.$('.report-next-page'));
        self.btnNextPage.getElement().click(onNextPageClick);
        self.btnLastPage.setElement(view.$('.report-last-page'));
        self.btnLastPage.getElement().click(onLastPageClick);

      };

      that.showPage = function(page) {
        self.pageImage.setImage(page);
      };

      that.showPreviewTab = function() {
        self.previewTab.tab('show');
      };

      that.showGridTab = function() {
        self.gridTab.tab('show');
      };

      that.showChartTab = function() {
        self.chartTab.tab('show');
      };

      that.setTotalPages = function(totalPages) {
        self.totalPages.setValue(totalPages);
      };

      that.setCurrentPage = function(page) {
        self.currentPage.setValue(page);
      };

      that.getCurrentPage = function() {
        return self.currentPage.getValue();
      };

      return that;
    };
  });

  /*
  *
  * this module contains very specialized views.
  * this views know about their controller.
  * they are not generic views.
  *
  * */

  Cairo.module("Views", function(Views, Cairo, Backbone, Marionette, $, _) {

    /*
    *
    * reports is a controller which just returns a collection of group objects
    * which are basically a name and a collection of reports which are a text,
    * a description and a path used to create a link
    *
    * getGroups() => [{ group }]
    * group       => [ name, reports [{ report }] }
    * report      => { text, description, path }
    *
    * */
    Views.createReportsView = function(reports) {

      var groups = reports.getGroups();

      var createTab = function(group, index, tabs) {
        var link = $('<a data-toggle="tab" href="#' + group.getId() + '-pills">');
        link.text(group.getName());
        var tab = $('<li>');
        tab.append(link);
        tabs.append(tab);
      };

      var createTabs = function() {
        var tabs = $('<ul class="nav nav-pills">');
        groups.each(createTab, tabs);
        return tabs;
      };

      var createReportLink = function(report, index, container) {
        var row = $('<div class="row">');
        var linkCol = $('<div class="col-sm-5">');
        var link = $('<a href="#' + report.getPath() + '">');
        var descripCol = $('<div class="col-sm-7">');
        var descrip = $('<p>');
        var code = $('<p>');

        link.text(report.getName());
        linkCol.append(link);

        descrip.text(report.getDescrip());
        code.text(report.getCode());
        descripCol.append(descrip).append(code);

        row.append(linkCol).append(descripCol);
        container.append(row);
      };

      var createReportLinks = function(reports) {
        var container = $('<div>')
        reports.each(createReportLink, container);
        return container;
      };

      var createPanel = function(group, index, panels) {
        var reports = createReportLinks(group.getReports());
        var container = $('<div id="' + group.getId() + '-pills" class="tab-pane fade">');
        var title = $('<h4>');
        title.text(group.getName());
        container.append(title);
        container.append(reports);
        panels.append(container);
      };

      var createPanels = function() {
        var panels = $('<div class="tab-content inner-tab-content">');
        groups.each(createPanel, panels);
        return panels;
      };

      var setFirstGroupActive = function(tabs, panels) {
        // TODO: implement this
      };

      var that = {};

      that.render = function(view) {
        var container = $('#reports', view.el);
        var tabs = createTabs();
        var panels = createPanels();
        container.append(tabs);
        container.append(panels);
        setFirstGroupActive(tabs, panels);
      };

      return that;
    };

    /*
    *
    * modules is a controller which just returns a collection of module objects
    * which are basically a name and a collection of links which are a text and
    * a path used to create a link
    *
    * getModules() => [{ module }]
    * module       => { name, modules [{ link }] }
    * link         => { text, path }
    *
    * */
    Views.createModulesView = function(modules) {

      var that = {};

      that.render = function(view) {

      };

      return that;
    };

    /*
    *
    * tasks is a controller which just returns a collection of task objects
    * which are basically a type, a text, a date and a path used to create a link
    *
    * getTasks() => [{ task }]
    * task       => { type, text, date, path }
    *
    * */

    Views.createTasksView = function(tasks) {

      var that = {};

      that.render = function(view) {

      };

      return that;
    };

  });

}());