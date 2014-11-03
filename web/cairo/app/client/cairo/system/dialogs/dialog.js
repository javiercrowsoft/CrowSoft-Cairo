(function() {
  "use strict";

  /*
      this module manages a dialog view ...
  */

  ///////////////
  // Entities
  ///////////////

  Cairo.module("Dialogs", function(Dialogs, Cairo, Backbone, Marionette, $, _) {

    Dialogs.TabIndexType = {
      TAB_ID_XT_ALL:  -1000,
      TAB_ID_XT_ALL2: -1001
    };

    Dialogs.Constants = {
      innerTab: "_INNER_TAB_",

      toolbarKeyPrint: "PRINTOBJ",
      toolbarKeyNext: "NEXT",
      toolbarKeyFirst: "FIRST",
      toolbarKeyPrevious: "PREVIOUS",
      toolbarKeyLast: "LAST",
      toolbarKeySearch: "SEARCH",
      toolbarKeySave: "SAVE",
      toolbarKeySaveAs: "SAVE_AS",
      toolbarKeyNew: "NEW",
      toolbarKeyApply: "APPLY",
      toolbarKeyCopy: "COPY",
      toolbarKeyReload: "RELOAD",
      toolbarKeyClose: "EXIT",
      toolbarKeyHelp: "HELP",
      toolbarKeyHistory: "HISTORY",
      toolbarKeySignature: "SIGNATURE",
      toolbarKeyAttach: "ATTACH",
      toolbarKeyDelete: "DELETE",
      toolbarKeyInvalidate: "INVALIDATE",
      toolbarKeyEditState: "EDIT_STATE",
      toolbarKeyDocAux: "DOC_AUX",
      toolbarKeyDocEdit: "DOC_EDIT",
      toolbarKeyDocMerge: "DOC_MERGE",
      toolbarKeyDocTip: "DOC_TIP",
      toolbarKeyDocAlert: "DOC_ALERT",
      toolbarKeyDocAction: "DOC_ACTION",
      toolbarKeyDocMail: "SEND_EMAIL",

      keyRowItem: "#RI#"
    };

    /* TODO: check if this has to be moved to Cairo.Keys or something similar */
    Dialogs.Keys = {
      KeyF2: 1,
      KeyF3: 2
    };

    Dialogs.GridSelectChangeType = {
      GRID_SELECTION_CHANGE: 1,
      GRID_ROW_CHANGE:       3
    };

    Dialogs.Message = {
      MSG_BUTTON_TEXT_CLICK: 1,

      //
      // documents
      //
      MSG_DOC_FIRST: 101,
      MSG_DOC_PREVIOUS: 102,
      MSG_DOC_NEXT: 103,
      MSG_DOC_LAST: 104,

      MSG_DOC_SIGNATURE: 105,
      MSG_DOC_DELETE: 106,

      MSG_DOC_INVALIDATE: 107,
      MSG_DOC_REFRESH: 108,

      MSG_DOC_EDIT_STATE: 109,
      MSG_DOC_NEW_WITH_WIZARD: 110,

      MSG_DOC_APPLY: 111,

      MSG_DOC_EX_GET_ITEMS: 112,
      MSG_DOC_EX_GET_FOOTERS: 113,

      MSG_DOC_INFO: 114,
      MSG_DOC_SEARCH: 115,
      MSG_DOC_HISTORY: 116,

      MSG_DOC_DOC_AUX: 117,
      MSG_DOC_DOC_EDIT: 119,
      MSG_DOC_DOC_ACTION: 122,

      MSG_MENU_AUX: 118,
      MSG_DOC_MERGE: 120,
      MSG_DOC_ALERT: 121,

      MSG_DOC_INFO_HANDLED: -100,

      //
      // grid
      //
      MSG_GRID_ROW_DELETED: 201,
      MSG_GRID_ROW_CHANGE: 202,
      MSG_GRID_VIRTUAL_ROW: 203,

      //
      // master
      //
      MSG_ABM_PRINT: 300,
      MSG_ABM_CAN_PRINT: 310,
      MSG_ABM_KEY_F2: 320,
      MSG_ABM_KEY_F3: 330,

      MSG_DOC_EX_PRE_VALIDATE: 400,

      MSG_EDIT_PERMISSIONS: 500,
      MSG_SHOW_EDIT_PERMISSIONS: 501,

      MSG_EXPORT_GET_EMAIL: 800,

      MSG_EXPORT_GET_FILE_NAME_POSTFIX: 801,

      MSG_SAVE_AS: 900,

      MSG_DOC_NEW_EVENT_COMPLETE: 901,

      MSG_POP_MENU_ITEM: 700,

      MSG_PRINT_GET_TITLE: 902,

      MSG_TOOLBAR_BUTTON_CLICK: 903,

      MSG_FORM_AFTER_SHOW_MODAL: 600,

      MSG_KEY_DOWN: 850
    };

    Dialogs.Colors = {
      buttonFace: '#cecece',
      buttonShadow: '#cecece',
      tabBackColor: '#ffffff',
      backgroundColor: '#cecece'
    };

    Dialogs.BackgroundType = {
      opaque: 1,
      transparent: 2
    };

    Dialogs.ButtonStyle = {
      none: 1,
      sinlge: 2
    };

    Dialogs.AlignText = {
      left:   0,
      center: 1,
      right:  2
    }

  });

  ///////////////
  // Handler
  ///////////////

  Cairo.module("Dialogs", function(Tree, Cairo, Backbone, Marionette, $, _) {

  });

  ///////////////
  // Views
  ///////////////

  Cairo.module("Dialogs.View", function(View, Cairo, Backbone, Marionette, $, _) {

    View.Document = Backbone.View.extend({
      tagName: "select",
      className: "form-control",

      render: function() {
          var template = _.template( $("#dialog-main-template").html(), {} );
          this.$el.html( template );
      }
    });

    View.Wizard = Backbone.View.extend({
      tagName: "select",
      className: "form-control",

      render: function() {
          var template = _.template( $("#dialog-main-template").html(), {} );
          this.$el.html( template );
      }
    });

    View.Master = Backbone.View.extend({
      tagName: "select",
      className: "form-control",

      render: function() {
          var template = _.template( $("#dialog-main-template").html(), {} );
          this.$el.html( template );
      }
    });

  });

  ///////////////
  // Controller
  ///////////////

  Cairo.module("Dialogs.Actions", function(Actions, Cairo, Backbone, Marionette, $, _) {

  });

  Cairo.module("Dialogs.View", function(View, Cairo, Backbone, Marionette, $, _) {

    View.Controller = {

      newDialog: function() {

        var Dialogs = Cairo.Dialogs;

        var C_OFFSET_V1 = 280;
        var C_OFFSET_V3 = 225;
        var C_OFFSET_H  = 1190;
        var C_OFFSET_H2 = 3780;
        var C_OFFSET_H3 = 1300;

        var C_LINE_HEIGHT = 440;
        var C_LINE_LIGHT = 155;

        var K_W_CANCEL = -10;

        var m_enabledState = [];

        var m_inProcess = false;

        var m_client;

        var m_properties = null;
        var m_menu = null;

        var m_popMenuClient = "";

        // tabs
        //
        var m_tabs = null;
        var m_currentTab = 0;
        var m_currentInnerTab = 0;

        // controls position
        //
        var m_nextTop     = [];
        var m_nextTopOp   = [];
        var m_left        = [];
        var m_leftOp      = [];
        var m_lastTop     = 0;
        var m_lastLeft    = 0;
        var m_lastLeftOp  = 0;
        var m_lastTopOp   = 0;
        var m_labelLeft   = 0;

        var m_gridManager = new Cairo.Dialogs.Grids.Manager();

        // minimum size of the view
        //
        var m_minHeight = 0;
        var m_minWidth = 0;

        // text input box's width
        //
        var m_textOrigWidth = 0;

        // flag: avoid recursive refresh
        //
        var m_showingForm = false;

        // flag: client implement grid
        //
        var m_clientManageGrid = false;

        // flag: editing a document
        //
        var m_isDocument = false;

        // flag: it is the items manager of a document edition
        //
        var m_isItems = false;

        // flag: it is the footer manager of a document edition
        //
        var m_isFooter = false;

        // flag: editing a wizard
        //
        var m_isWizard = false;

        // title customization
        //
        var m_hideTitle = false;
        var m_title = "";
        var m_viewText = "";

        // flag: unloading dialog
        //
        var m_unloading = false;

        // flag: used in wizard. hide tab's button
        //
        var m_hideTabButtons = false;

        // flag: when the dialog is shown as modal
        //
        var m_inModalWindow = false;

        // flag: to avoid load the view more than once
        //
        var m_mustCompleteLoading = false;

        // flag: don't show dialog asking to save changes
        //
        var m_noAskForSave = false;

        // flag: true if there are unsaved changes
        //
        var m_changed = false;

        // flag: to avoid show more than once in modals
        //
        var m_viewShowed = false;

        // flag: to avoid processing changes in controls when we are refreshing the view
        //
        var m_refreshing = false;

        // first tab index
        //
        var m_firstTab = 0;

        // flag: show okay cancel instead of save cancel
        //
        var m_showOkCancel = false;

        // flag:
        //
        // true:  save or okay was pressed
        // false: cancel was pressed
        //
        var m_okCancelResult = false;

        var m_tabIndex = 0;

        // controls position
        //
        var m_constLeft = 0;
        var m_constLeftOp = 0;
        var m_constTop = 0;
        var m_constTopOp = 0;

        // flag: don't move the buttons save and cancel when resizing
        //
        var m_noMoveGenericButton = false;

        var m_cancelText = "";
        var m_saveText = "";

        var m_saveWidth = 0;
        var m_saveTop = 0;
        var m_saveLeft = 0;
        var m_cancelTop = 0;
        var m_cancelLeft = 0;

        // key of the control to be activated when this dialog get focus
        // or the new button is clicked
        //
        var m_newPropertyKeyFocus = "";

        var m_useSelectIntValue = false;

        // flag: special case for grid edition
        //       used in kit production
        //
        var m_createRowInBeforeEdit = false;

        // flag: don't change columns when refreshing grid controls
        //
        var m_noChangeColsInRefresh = false;

        // flag: to allow the client to force a save, close or new
        //       after processing a change property event
        //
        var m_sendSave   = false;
        var m_sendClose  = false;
        var m_sendNewDoc = false;
        var m_sendNewABM = false;

        // auto save in modal dialogs
        //
        var m_sendAutoSave = false;

        var m_setFocusFirstCtrlInNew = false;
        var m_savingAs = false;
        var m_inSave = false;

        var m_noButtons1 = 0;
        var m_noButtons2 = 0;
        var m_noButtons3 = 0;

        var m_buttonsEx2 = 0;
        var m_buttonsEx3 = 0;

        var m_noChangeBackColorCell = false;

        var m_autoPrint = false;

        var m_tabTopHeight = 0;

        var m_tabHideControlsInAllTab = 0;

        var m_masterView   = null;
        var m_wizardView   = null;
        var m_documentView = null;

        var m_backgroundColor = 0;

        var m_sendRefresh = false;

        var m_owner = null;

        var self = {};

        self.setTabHideControlsInAllTab = function(rhs) {
          m_tabHideControlsInAllTab = rhs;
        };

        self.setBNoChangeBackColorCell = function(rhs) {
          m_noChangeBackColorCell = rhs;
        };

        self.setFormText = function(rhs) {
          m_viewText = rhs;
        };

        self.setPopMenuClient = function(rhs) {
          m_popMenuClient = rhs;
        };

        self.getSetFocusFirstCtrlInNew = function() {
          return m_setFocusFirstCtrlInNew;
        };

        self.setSetFocusFirstCtrlInNew = function(rhs) {
          m_setFocusFirstCtrlInNew = rhs;
        };

        self.setNoButtons1 = function(rhs) {
          m_noButtons1 = rhs;
        };

        self.setNoButtons2 = function(rhs) {
          m_noButtons2 = rhs;
        };

        self.setNoButtons3 = function(rhs) {
          m_noButtons3 = rhs;
        };

        self.setButtonsEx2 = function(rhs) {
          m_buttonsEx2 = rhs;
        };

        self.setButtonsEx3 = function(rhs) {
          m_buttonsEx3 = rhs;
        };

        self.setBSendSave = function(rhs) {
          m_sendSave = rhs;
        };

        self.setBSendClose = function(rhs) {
          m_sendClose = rhs;
        };

        self.setBSendAutoSave = function(rhs) {
          m_sendAutoSave = rhs;
        };

        self.setSendNewDoc = function(rhs) {
          m_sendNewDoc = rhs;
        };

        self.setSendNewABM = function(rhs) {
          m_sendNewABM = rhs;
        };

        self.getInSave = function() {
          return m_inSave;
        };

        self.getBSavingAs = function() {
          return m_savingAs;
        };

        self.setIsWizard = function(rhs) {
          m_isWizard = rhs;
        };

        self.setNoAskForSave = function(rhs) {
          m_noAskForSave = rhs;
        };

        self.setNoMoveGenericButton = function(rhs) {
          m_noMoveGenericButton = rhs;
        };

        self.setSaveText = function(rhs) {
          m_saveText = rhs;
        };

        self.setSaveWidth = function(rhs) {
          m_saveWidth = rhs;
        };

        self.setCancelText = function(rhs) {
          m_cancelText = rhs;
        };

        self.setSaveTop = function(rhs) {
          m_saveTop = rhs;
        };

        self.setSaveLeft = function(rhs) {
          m_saveLeft = rhs;
        };

        self.setCancelTop = function(rhs) {
          m_cancelTop = rhs;
        };

        self.setCancelLeft = function(rhs) {
          m_cancelLeft = rhs;
        };

        self.setSendRefresh = function(sendRefresh) {
          m_sendRefresh = sendRefresh;
        };

        // returns the view
        //
        // @return Dialogs.View
        //
        var getView = function() {
          var mustInitialize = false;

          // documents
          //
          if(m_isDocument) {
            if(m_documentView === null) {
              m_documentView = new View.Document({});

              m_documentView.addListener({
                commandClick:               docHandlerCommandClick,
                selectKeyDown:              docHandlerSelectKeyDown,

                tabClick:                   docHandlerTabClick,
                tabGetFirstCtrl:            docHandlerTabGetFirstCtrl,

                viewLoad:                   docHandlerViewLoad,
                viewBeforeDestroy:          docHandlerViewBeforeDestroy,
                viewDestroy:                docHandlerViewDestroy,

                toolBarClick:               docHandlerToolbarClick,
                comboChange:                docHandlerComboChange,
                checkBoxClick:              docHandlerCheckBoxClick,

                gridDblClick:               docHandlerGridDblClick,
                gridAfterDeleteRow:         docHandlerGridAfterDeleteRow,
                gridDeleteRow:              docHandlerGridDeleteRow,
                gridNewRow:                 docHandlerGridNewRow,
                gridValidateRow:            docHandlerGridValidateRow,

                gridColumnButtonClick:      docHandlerGridColumnButtonClick,
                gridColumnAfterEdit:        docHandlerGridColumnAfterEdit,
                gridColumnAfterUpdate:      docHandlerGridColumnAfterUpdate,
                gridColumnBeforeEdit:       docHandlerGridColumnBeforeEdit,

                gridSelectionChange:        docHandlerGridSelectionChange,
                gridSelectionRowChange:     docHandlerGridSelectionRowChange,

                selectChange:               docHandlerSelectChange,

                maskEditChange:             docHandlerMaskEditChange,

                dateChange:                 docHandlerDateChange,

                optionButtonClick:          docHandlerOptionButtonClick,

                textChange:                 docHandlerTextChange,
                textAreaChange:             docHandlerTextAreaChange,
                textPasswordChange:         docHandlerTextPasswordChange
              });

              m_mustCompleteLoading = true;
              mustInitialize = true;
            }
            return m_documentView;
          }
          //
          // wizards
          //
          else if(m_isWizard) {
            if(m_wizardView === null) {
              m_wizardView = new View.Wizard({});

              m_wizardView.addListener({
                comboChange:              wizHandlerComboChange,

                tabGetFirstCtrl:          wizHandlerTabGetFirstCtrl,
                tabClick:                 wizHandlerTabClick,

                checkBoxClick:            wizHandlerCheckBoxClick,

                cancelClick:              wizHandlerCancelClick,
                backClick:                wizHandlerBackClick,
                commandClick:             wizHandlerCommandClick,
                nextClick:                wizHandlerNextClick,

                viewLoad:                 wizHandlerViewLoad,
                viewBeforeDestroy:        wizHandlerViewBeforeDestroy,
                viewDestroy:              wizHandlerViewDestroy,

                gridDblClick:             wizHandlerGridDblClick,
                gridAfterDeleteRow:       wizHandlerGridAfterDeleteRow,
                gridDeleteRow:            wizHandlerGridDeleteRow,
                gridNewRow:               wizHandlerGridNewRow,
                gridValidateRow:          wizHandlerGridValidateRow,

                gridColumnButtonClick:    wizHandlerGridColumnButtonClick,
                gridColumnAfterEdit:      wizHandlerGridColumnAfterEdit,
                gridColumnAfterUpdate:    wizHandlerGridColumnAfterUpdate,
                gridColumnBeforeEdit:     wizHandlerGridColumnBeforeEdit,

                gridSelectionChange:      wizHandlerGridSelectionChange,
                gridSelectionRowChange:   wizHandlerGridSelectionRowChange,

                selectChange:             wizHandlerSelectChange,

                maskEditChange:           wizHandlerMaskEditChange,

                dateChange:               wizHandlerDateChange,

                optionButtonClick:        wizHandlerOptionButtonClick,

                toolBarButtonClick:       wizHandlerToolbarButtonClick,

                textChange:               wizHandlerTextChange,
                textAreaChange:           wizHandlerTextAreaChange,
                textPasswordChange:       wizHandlerTextPasswordChange
              });

              m_mustCompleteLoading = true;
              mustInitialize = true;
            }
            return m_wizardView;
          }
          //
          // masters
          //
          else {
            if(m_masterView === null) {
              m_masterView = new View.Master({});;

              m_masterView.addListener({
                viewKeyDown:               masterHandlerViewKeyDown,

                afterShowModal:            masterHandlerAfterShowModal,

                popItemClick:              masterHandlerPopItemClick,

                setResizeGrid:             masterHandlerSetResizeGrid,

                tabGetFirstCtrl:           masterHandlerTabGetFirstCtrl,
                tabClick:                  masterHandlerTabClick,

                comboChange:               masterHandlerComboChange,
                checkBoxClick:             masterHandlerCheckBoxClick,

                commandClick:              masterHandlerCommandClick,
                cancelClick:               masterHandlerCancelClick,
                closeClick:                masterHandlerCloseClick,
                copyClick:                 masterHandlerCopyClick,
                documentsClick:            masterHandlerDocumentsClick,
                newClick:                  masterHandlerNewClick,
                printClick:                masterHandlerPrintClick,
                permissionsClick:          masterHandlerPermissionsClick,
                saveClick:                 masterHandlerSaveClick,

                viewLoad:                  masterHandlerViewLoad,
                viewBeforeDestroy:         masterHandlerViewBeforeDestroy,
                viewDestroy:               masterHandlerViewDestroy,

                gridDblClick:              masterHandlerGridDblClick,
                gridAfterDeleteRow:        masterHandlerGridAfterDeleteRow,
                gridDeleteRow:             masterHandlerGridDeleteRow,
                gridNewRow:                masterHandlerGridNewRow,
                gridValidateRow:           masterHandlerGridValidateRow,

                gridColumnAfterEdit:       masterHandlerGridColumnAfterEdit,
                gridColumnAfterUpdate:     masterHandlerGridColumnAfterUpdate,
                gridColumnBeforeEdit:      masterHandlerGridColumnBeforeEdit,
                gridColumnButtonClick:     masterHandlerGridColumnButtonClick,

                gridSelectionChange:       masterHandlerGridSelectionChange,
                gridSelectionRowChange:    masterHandlerGridSelectionRowChange,

                showSelect:                masterHandlerShowSelect,

                selectChange:              masterHandlerSelectChange,

                maskEditChange:            masterHandlerMaskEditChange,

                dateChange:                masterHandlerDateChange,

                optionButtonClick:         masterHandlerOptionButtonClick,

                toolBarButtonClick:        masterHandlerToolbarButtonClick,

                textButtonClick:           masterHandlerTextButtonClick,
                textChange:                masterHandlerTextChange,
                textAreaChange:            masterHandlerTextAreaChange,
                textPasswordChange:        masterHandlerTextPasswordChange
              });

              m_mustCompleteLoading = true;
              mustInitialize = true;
              setCanPrint();
              setShowPermissions();

              // only master dialogs can be of OkCancel type
              //
              if(m_showOkCancel) {

                m_masterView.getCancelButton().setText("Cancel");
                m_masterView.getCancelButton().setIsCancel(true);

                m_masterView.getSaveButton().setText("Ok");
                m_masterView.getCancelButton().setWidth(m_masterView.getSaveButton().getWidth());

                m_masterView.getCloseButton().setVisible(false);
              }

              if(m_saveText)  { m_masterView.getSaveButton().setText(m_saveText); }
              if(m_saveWidth) { m_masterView.getSaveButton().setWidth(m_saveWidth); }
              if(m_saveTop)   { m_masterView.getSaveButton().setTop(m_saveTop); }
              if(m_saveLeft)  { m_masterView.getSaveButton().setLeft(m_saveLeft); }

              if(m_cancelText) { m_masterView.getCancelButton().setText(m_cancelText); }
              if(m_cancelTop)  { m_masterView.getCancelButton().setTop(m_cancelTop); }
              if(m_cancelLeft) { m_masterView.getCancelButton().setLeft(m_cancelLeft); }
            }

            return m_masterView;
          }

          if(mustInitialize) {
            initCtrlPosition();
            initVectorsPosition();
          }
        };

        // hide tab buttons is used in wizards
        //
        self.setHideTabButtons = function(rhs) {
          m_hideTabButtons = rhs;
        };

        // min size height of dialog's view
        //
        self.setMinHeight = function(rhs) {
          m_minHeight = rhs;
        };

        self.setMinWidth = function(rhs) {
          m_minWidth = rhs;
        };

        self.setOkCancelDialog = function(rhs) {
          m_showOkCancel = rhs;
        };

        self.getOkCancelDialogResult = function() {
          return m_okCancelResult;
        };

        self.setTabs = function(rhs) {
          m_tabs = rhs;
        };

        self.setNewPropertyKeyFocus = function(rhs) {
          m_newPropertyKeyFocus = rhs;
        };

        self.getNewPropertyKeyFocus = function() {
          return m_newPropertyKeyFocus;
        };

        self.setUseSelectIntValue = function(rhs) {
          m_useSelectIntValue = rhs;
        };

        self.setRowSelected = function(property, rowIndex) {
          try {
            var grid = property.getControl();
            if(grid) {
              grid.selectRow(rowIndex);
              property.setSelectedRow(rowIndex);
            }
          }
          catch(ignore) {}
        };

        self.getMngGrid = function() {
          return m_gridManager;
        };

        self.setTabTopHeight = function(rhs) {
          m_tabTopHeight = rhs;
        };

        var getChanged = function() {
          // in documents the view define if it was changed
          //
          if(m_isDocument) {
            if(getView() === null) {
              return false;
            }
            else {
              return getView().changed;
            }
          }
          else {
            return m_changed;
          }
        };

        self.setChanged = function(rhs) {
          // in documents the view define if it was changed
          //
          if(m_isDocument) {
            if(getView()) {
              getView().changed = rhs;
            }
          }
          else {
            m_changed = rhs;
          }
        };

        // in some edit cases we need to know the value
        // of a cell to handle the beforeEdit event.
        // for example this happens in kit edition.
        // there we need to know the pr_id of an alternative
        // component to get how many serial numbers it needs
        // before allow the edition of the serial number
        //
        self.setCreateRowInBeforeEdit = function(rhs) {
          m_createRowInBeforeEdit = rhs;
        };

        self.setNoChangeColsInRefresh = function(rhs) {
          m_noChangeColsInRefresh = rhs;
        };

        self.getAutoPrint = function() {
          return m_autoPrint;
        };

        self.setAutoPrint = function(rhs) {
          m_autoPrint = rhs;
        };

        self.setBackColorTagMain = function(color) {
          if(m_documentView) {
            m_documentView.getTab().setBackColor(color);
            m_documentView.getTabFooter().setBackColor(color);
            m_documentView.getTabItems().setBackColor(color);
          }
        };

        self.setHeightToDocWithDescription = function() {
          if(m_documentView) {
            if(m_isDocument && !m_isItems) {
              m_documentView.setHeightToDocWithDescription();
            }

            if(m_isItems) {
              m_constTop = m_documentView.getTabItems().getTop() + 100;

              for(var q = 0; q < m_nextTop.length; q++) {
                m_nextTop[q] = m_constTop;
                m_left[q] = m_constLeft;
              }
            }
          }
        };

        self.refreshSelStartToEnd = function(property) {
          try {
            var c = property.getControl()
            c.selStart(c.getText().length);
          }
          catch(ignore) {}
        };

        self.showMessage = function(msg) {
          showMsg(msg, true);
        };

        self.hideMessage = function() {
          hideMsg();
        };

        self.setFocusCtrl = function(property) {
          try {
            property.getControl().setFocus();
          }
          catch(ignore) {}
        };

        var setFocusInGrid = function() {
          try {
            setFocusControl(m_documentView.getGrids().get(0));
            Cairo.Util.sendKeys("{ENTER}");

          }
          catch(ignore) {}
        };

        var setFocusInFirstControl = function() {
          // by default the focus is set to the second column
          // in the item grid
          //
          if(!m_setFocusFirstCtrlInNew) {
            setFocusInGrid();
          }
        };

        self.setFocusInGridForDocs = function() {
          setFocusInGrid();
        };

        self.setFocusInGridItems = function() {
          setFocusInGrid();
        };

        self.printMaster = function(id, tblId) {
          var R = Cairo.Configuration.Reports;
          var U = Cairo.Util;
          var C = Cairo.Configuration;

          var printManager = new Cairo.Entities.Printing.Manager();

          printManager.setPath(U.File.getValidPath(C.get(R.reportSection, R.reportPath, Cairo.Configuration.appPath())));
          printManager.setCommandTimeout(U.val(C.get(R.reportSection, R.commandTimeOut, 0)));
          printManager.setConnectionTimeout(U.val(C.get(R.reportSection, R.connectionTimeOut, 0)));

          printManager.showPrint(id, tblId, Cairo.Constants.NO_ID);
        };

        self.autoWidthColumn = function(property, keyCol) {
          // if kyeCol was given we only apply to that column
          //
          if(keyCol) {
            property.getControl().autoWidthColumn(property.getGrid().getColumns().get(keyCol).getIndex());
          }
          else {
            property.getControl().autoWidthColumns();
          }
        };

        // allows to group the grid in edition
        //
        // IMPORTANT: this is a work in progress
        //       it only allows to group by one column
        //       and sort by other column.
        //       in addition there is a limitation in the
        //       position of the columns used to group and
        //       sort. the grouping column have to be the third column
        //       and the sort column has to be the fifth column
        //       i don't know why :) but if this rules is broken
        //       the edition fails
        //
        //       hope I will fix it before 2015 :P
        //
        self.groupGrid = function(property, keyCol, keyColSort) {
          groupGridEx(property, keyCol, keyColSort);
        };

        //
        // IMPORTANT: offSetColSort allows to insert columns between
        //            the first and the sort column but we need to
        //            add 3 to the number of inserted columns
        //
        //   by default the grid must have five columns
        //
        //                 col 1 anything
        //                 col 2 anything
        //                 col 3 the grouping column
        //                 col 4 anything
        //                 col 5 the sorting column
        //
        //   if col 5 doesn't contains the sorting column we need to set
        //   the value of offSetColSort
        //
        //   example: in the waybill and picking list grids we have this configuration:
        //
        //                 col 1 KI_PKLPV_ID
        //                 col 2 KI_PV_ID
        //                 col 3 KI_CLIENTE               - grouping column IT MUST BE THE THIRD
        //                 col 4 KI_TIPO
        //                 col 5 KI_SELECT
        //                 col 6 KI_FECHA / KI_NRODOC     - sorting column
        //
        //                 so the value of offSetColSort is 4
        //

        self.groupGridEx = function(property, keyCol, keyColSort, offSetColSort) {

          if(property !== null && property.getControl() !== null) {

            var canRemove = false;
            var isVisible = false;

            try {

              Cairo.LoadingMessage.showWait();

              // hide ctrl to avoid refresh
              //
              canRemove = property.getGridRemoveEnable();
              isVisible = property.getControl().getVisible();

              property.setGridRemoveEnable(false);
              property.getControl().setVisible(false);
              property.getControl().setRedraw(false);

              var col = property.getGrid().getColumns().get(keyCol);

              var grid = property.getControl();

              grid.clearGroups();
              grid.refreshGroupsAndFormulasEx(true);

              // remove all grouping data in this control
              //
              grid.clearEx(true, true, true, true, true);

              // load this grid creating the columns
              //
              m_gridManager.loadFromRows(property.getControl(), property.getGrid(), false, property.getName());

              // add grouping
              //
              var group = grid.addGroup();
              group.setName(col.getName());
              group.setIndex(1);
              group.setKey(Cairo.Util.val(col.Key) + 2);
              group.setSortType(Cairo.Constants.ShellSortOrder.ascending);

              // add sorting
              //
              col = property.getGrid().getColumns().get(keyColSort);

              group = grid.addGroup();
              group.setName(col.getName());
              group.setIndex(2);
              group.setKey(Cairo.Util.val(col.Key) + offSetColSort);
              group.setSortType(Cairo.Constants.ShellSortOrder.ascending);
              group.setIsSortCol(true);

              // do the grouping and sorting
              //
              grid.refreshGroupsAndFormulasEx(true);
              grid.expandAllGroups();
              grid.autoWidthColumns();
              grid.setGridLines(true);

              // remove auxiliary rows added to property.getGrid().rows
              // to match rows.count() in property with rows.count() in
              // the grid control
              //
              var rows = property.getGrid().getRows().count();

              var i = 1;
              while (i < rows.count()) {
                if(rows.get(i).getIsGroup()) {
                  rows.remove(i);
                }
                else {
                  i = i + 1;
                }
              }

              // add auxiliary rows to match the two collections
              //
              var count = grid.getRows().count();
              for(var j = 0; j < count; j++) {
                if(grid.rowIsGroup(j)) {
                  var row = new Cairo.Dialogs.Grids.Row();
                  row.setIsGroup(true);
                  row.setIndex(j);
                  rows.add(row);
                }
              }

              // sort the property rows collection to match sort in control
              //
              var sortedRows = new Dialogs.Grids.Rows();

              var count = grid.getRows().count();
              for(var j = 0; j < count; j++) {
                var index = Cairo.Util.val(grid.cellText(j, 3));
                if(grid.rowIsGroup(j)) {
                  sortedRows.add(rows(j));
                }
                else {
                  var count = rows.count();
                  for(var i = 0; i < count; i++) {
                    var row = rows.get(i);
                    if(!row.getIsGroup()) {
                      if(index === row.getIndex()) {

                        // index must be 0 to be inserted at the end
                        //
                        row.setIndex(0);
                        if(row.getKey()) {
                          sortedRows.add(row, row.getKey());
                        }
                        else {
                          sortedRows.add(row);
                        }
                        row.setIndex(-1);
                        break;
                      }
                    }
                  }
                }
              }

              // refresh grid
              //
              var k = 0;
              var count = grid.getRows().count();
              for(var j = 0; j < count; j++) {
                if(!grid.rowIsGroup(j)) {
                  k = k + 1;
                  grid.cellText(j, 3) === k;
                }
              }

              // select first column
              //
              if(grid.getRows().count()) {
                grid.setSelectedRow(2);
                grid.setSelectedCol(5);
              }

              grid.setColumnWidth(1, 10);
              grid.setColumnWidth(2, 10);

              grid.setRowMode(false);

              property.getGrid().setRows(sortedRows);

              // update indexes
              //
              rows = sortedRows;
              k = 0;
              var count = rows.count();
              for(var j = 0; j < count; j++) {
                  row = rows.get(j);
                  if(!row.getIsGroup()) {
                      k = k + 1;
                      row.setIndex(k);
                      row.get(1).setValue(k);
                  }
              }

              addAuxCol(property);
            }
            catch(e) {
              Cairo.manageError(
                "Grouping",
                "An error has occurred when grouping a grid.",
                e.message);
            }
            finally {

              Cairo.LoadingMessage.close();

              if(property !== null && property.getControl() !== null) {
                property.getControl().setRedraw(true);
                property.getControl().setVisible(isVisible);
                property.setGridRemoveEnable(canRemove);
              }
            }
          }
        };

        self.refreshButtonStyle = function(property) {
          try {
            if(property.getControl() !== null) {

              if(property.getForeColor() !== -1) {
                property.getControl().setForeColor(property.getForeColor());
              }

              if(property.getBackColor() !== -1) {
                property.getControl().setBackColor(property.getBackColor());
                property.getControl().setBackColorUnpressed(property.getBackColor());
              }
              property.getControl().refresh();
            }
          }
          catch(ignore) {}
        };

        // add auxiliary columns in the property to match
        // the columns in the control
        //
        var addAuxCol = function(property) {
          var c_col_aux_group1 = "#aux_group_1";
          var c_col_aux_group2 = "#aux_group_2";

          try {
            var cols = property.getGrid().getColumns();

            // columns
            //
            if(cols.get(c_col_aux_group1) === null) {
              var col = cols.add(null, c_col_aux_group1, 1);
              col.setVisible(false);
            }

            if(cols.get(c_col_aux_group2) === null) {
              var col = cols.add(null, c_col_aux_group2, 1);
              col.setVisible(false);
            }

            // cells
            //
            var rows = property.getGrid().getRows();

            for(var _i = 0; _i < rows.count(); _i++) {
              var row = rows.get(_i);
              if(row.get(c_col_aux_group1) === null) {
                row.add(null, c_col_aux_group1, 1);
              }
              if(row.get(c_col_aux_group2) === null) {
                row.add(null, c_col_aux_group2, 1);
              }
            }

            cols = property.getControl().getColumns();

            if(cols.get(c_col_aux_group1) === null) {
              cols.add(null, c_col_aux_group1);
            }

            if(cols.get(c_col_aux_group2) === null) {
              cols.add(null, c_col_aux_group2);
            }
          }
          catch(ignore) {}
        };

        self.drawGrid = function(property, redraw) {
          try {
            var grid = getView().getGrids().get(property.getIndex());
            if(grid !== null) {
              grid.setRedraw(redraw);
            }
          }
          catch(ignore) {}
        };

        self.refreshColumnPropertiesByIndex = function(property, keyCol) {
          return self.refreshColumnProperties(property, keyCol);
        };

        self.refreshColumnProperties = function(property, keyCol) {
          var column = property.getGrid().getColumns().get(keyCol);
          var grid = getView().getGrids().get(property.getIndex());

          // this is to avoid losing the column's width when refreshing
          //
          var colGrid = grid.getColumns().get(column.getIndex());
          column.setWidth(colGrid.Width);

          m_gridManager.setColumnProperties(grid, column, colGrid);
        };

        // update edit status in all properties
        //
        self.refreshEnabledState = function(properties) {
          for(var _i = 0; _i < m_properties.count(); _i++) {
            setEnabled(properties.get(_i));
          }
          self.setTabIndexDescription();
        };

        // update value in all properties
        //
        self.showValues = function(properties) {
          if(m_isDocument) {
            // documents are edited using three dialog objects
            //
            for(var _i = 0; _i < properties.count(); _i++) {
              var property = properties.get(_i);

              if(m_isFooter) {
                self.showValueEx(property, true, Cairo.Constants.DocumentSections.footer);
              }
              else if(m_isItems) {
                self.showValueEx(property, true, Cairo.Constants.DocumentSections.items);
              }
              else {
                self.showValueEx(property, true, Cairo.Constants.DocumentSections.header);
              }
            }
          }
          else {
            // masters and wizards
            //
            for(var _i = 0; _i < properties.count(); _i++) {
              self.showValueEx(properties.get(_i), true, "");
            }
          }
        };

        // it is the fastest way to refresh a grid
        // it is used in Cash Flow dialog
        //
        // colsToRefresh set the maximum column index to be refreshed
        // it is useful for grids with many columns which are not editable
        // the editable columns must be on the left and the non editable columns
        // must be on the right
        //
        // if colsToRefresh === 0 all columns will be refreshed
        //
        self.refreshGridRows = function(property, colsToRefresh) {

          if(property.getType() === Dialogs.PropertyType.grid && property.getControl() !== null) {

            var grid = property.getControl();
            var rows = property.getGrid().getRows();
            var columns = property.getGrid().getColumns();

            if(colsToRefresh > columns.count()) {
              colsToRefresh = columns.count();
            }

            if(colsToRefresh <= 0) {
              colsToRefresh = columns.count();
            }

            grid.setRedraw(false);
            var count = grid.getRows().count();
            for(var rowIndex = 0; rowIndex < count; rowIndex++) {

              var row = rows.get(rowIndex);

              for(var colIndex = 0; colIndex < colsToRefresh; colIndex++) {

                var col = columns.get(colIndex);
                var cell = row.get(colIndex);

                var gridCell = grid.cell(rowIndex, colIndex);
                gridCell.setItemData(cell.getId());

                if(col.getType() === Dialogs.PropertyType.date) {
                  gridCell.setText(Cairo.Util.getDateValueForGrid(cell.getValue()));
                }
                else if(col.getSubType() === Dialogs.PropertySubType.percentage) {
                  gridCell.setText(Cairo.Util.val(cell.getValue()) / 100);
                }
                else {
                  gridCell.setText(cell.getValue());
                }

                // cell format
                //
                var format = cell.getFormat();
                if(format !== null) {

                  gridCell.setForeColor(format.getColor());
                  gridCell.setBackColor(format.getBackColor());
                  gridCell.setTextAlign(format.getTextAlign());

                  var font = new  Cairo.Font();
                  font.setName(format.getFontName());
                  font.setItalic(format.getItalic());
                  font.setBold(format.getBold());
                  font.setSize(format.getFontSize());
                  font.setStrikeThrough(format.getStrike());
                  font.setUnderline(format.getUnderline());

                  gridCell.setFont(font);
                }
              }

              grid.setRowBackColor(rowIndex, row.getBackColor());
              grid.setRowForeColor(rowIndex, row.getForeColor());

            }
            grid.setRedraw(true);
          }
        };

        self.refreshRowColor = function(property, rowIndex, row) {
          var grid = property.getControl();
          if(grid !== null) {
            grid.setRowBackColor(rowIndex, row.getBackColor());
            grid.setRowForeColor(rowIndex, row.getForeColor());
          }
        };

        // initialize auxiliary variables
        //
        self.resetLayoutMembers = function() {
          m_nextTop   = [];
          m_nextTopOp = [];
          m_left      = [];
          m_leftOp    = [];

          initVectorsPosition();

          m_lastTop     = 0;
          m_lastLeft    = 0;
          m_lastLeftOp  = 0;
          m_lastTopOp   = 0;
          m_labelLeft   = 0;
        };

        // initialize tab's left and top
        //
        self.resetTabLeftTop = function(tabIndex) {
          m_nextTop[tabIndex] = m_constTop;
          m_left[tabIndex] = 2500;
          m_labelLeft = C_OFFSET_H;
        };

        // modify cell's content
        //
        self.showCellValue = function(property, row, col) {
          m_gridManager.showCellValue(getView().getGrids().get(property.getIndex()), property.getGrid(), row, col);
        };

        // modify property's value
        //
        self.showValueEx = function(property, noChangeColumns, strTag) {
          var lbl = null;
          var view = getView();

          switch(property.getType()) {

            case Dialogs.PropertyType.list:

              var c = view.getCombos().get(property.getIndex());
              c.clear();

              for(var _i = 0; _i < property.getList().count(); _i++) {
                var item = property.getList().get(_i);
                c.add(item.getValue());
                c.setItemData(c.getNewIndex(), item.getId());
              }

              switch(property.getListWhoSetItem()) {

                case Dialogs.ListWhoSetItem.itemData:
                  Cairo.Util.List.setListIndexForId(c, property.getListItemData());
                  break;

                case Dialogs.ListWhoSetItem.index:
                  Cairo.Util.List.setListIndex(c, property.getListIndex());
                  break;

                case Dialogs.ListWhoSetItem.text:
                  Cairo.Util.List.setListIndexForText(c, property.getListText());
                  break;
              }

              if(c.getListIndex() === -1 && c.count() > 0) { c.setListIndex(0); }
              c.setEnabled(property.getEnabled());

              break;

            case Dialogs.PropertyType.select:

              var c = view.getSelects().get(property.getIndex());
              c.setId(property.getSelectId());

              if(m_useSelectIntValue) {
                c.setIntValue((property.getSelectIntValue() !== "") ? property.getSelectIntValue() : property.getSelectId());
              }
              else {
                c.setIntValue(property.getSelectId());
              }

              c.setValue(property.getValue());
              c.setIntValue(property.getSelectIntValue());
              c.setFieldIntValue(property.getSelectFieldIntValue());
              c.setFilter(property.getSelectFilter());
              c.setTable(property.getSelectTable());
              c.setEnabled(property.getEnabled());

              break;

            case Dialogs.PropertyType.numeric:

              var c = view.getMaskEdits().get(property.getIndex());
              c.setValue(property.getValue());
              c.setEnabled(property.getEnabled());

              break;

            case Dialogs.PropertyType.date:
            case Dialogs.PropertyType.time:

              var c = view.getDatePickers().get(property.getIndex());
              c.setValue(property.getValue());
              c.setEnabled(property.getEnabled());

              break;

            case Dialogs.PropertyType.option:

              var c = view.getOptionButtons().get(property.getIndex());
              c.setValue(property.getValue());
              c.setEnabled(property.getEnabled());

              break;

            case Dialogs.PropertyType.text:
            case Dialogs.PropertyType.file:
            case Dialogs.PropertyType.folder:

              var c = null;
              if(property.getSubType() === Dialogs.PropertySubType.memo) {
                c = view.getTextAreas().get(property.getIndex());
              }
              else {
                c = view.getTextInputs().get(property.getIndex());
                if(c.setMask !== undefined) {
                  c.setMask(property.getTextMask());
                }
              }

              c.setText(property.getValue());
              c.setEnabled(property.getEnabled());

              // if there is a mask we need to update the value applying this mask
              //
              if(c.getMask !== undefined) {
                if(c.getMask() !== "") {
                  property.setValue(c.getText());
                }
              }

              break;

            case Dialogs.PropertyType.password:

              var c = view.getPasswordInputs().get(property.getIndex());
              c.setText(property.getValue());
              c.setEnabled(property.getEnabled());

              break;

            case Dialogs.PropertyType.check:

              var c = view.getCheckBoxes().get(property.getIndex());
              c.setValue(Cairo.Util.val(property.getValue()) !== 0);
              c.setEnabled(property.getEnabled());

              break;

            case Dialogs.PropertyType.button:

              var c = view.getButtons().get(property.getIndex());
              c.setText(property.getName());
              c.setEnabled(property.getEnabled());

              break;

            case Dialogs.PropertyType.label:

              var c = view.getCtlLabels().get(property.getIndex());
              c.setText(property.getValue());
              if(property.getBackColor() >= 0) {
                c.setBackColor(property.getBackColor());
              }

              break;

            case Dialogs.PropertyType.image:

              var c = view.getImages().get(property.getIndex());

              if(m_isWizard) {
                switch(Cairo.Util.val(property.getValue())) {
                  case 1:
                    c.setImage(m_wizardView.getImgWiz1());
                    break;

                  case 3:
                    c.setImage(m_wizardView.getImgWiz3());
                    break;

                  case 5:
                    c.setImage(m_wizardView.getImgWiz5());
                    break;

                  default:
                    c.setImage(property.getImage());
                    break;
                }
              }
              else {
                c.setImage(property.getImage());
              }

              break;

            case Dialogs.PropertyType.title:

              var c = view.getTitle(property.getIndex());
              c.setText(property.getValue());

              break;

            case Dialogs.PropertyType.description:

              var c = view.getDescription(property.getIndex());
              c.setText(property.getValue());

              break;

            case Dialogs.PropertyType.grid:

              var c = view.getGrids().get(property.getIndex());
              c.setEnabled(property.getEnabled());
              c.setMultiSelect(property.getGrid().getMultiSelect());

              m_gridManager.setAddEnabled(c, property.getGridAddEnabled());
              m_gridManager.setEditEnabled(c, property.getGridEditEnabled());
              m_gridManager.setDeleteEnabled(c, property.getGridRemoveEnabled());

              if(!m_gridManager.loadFromRows(c, property.getGrid(), noChangeColumns, getGridName(property))) {
                return null;
              }

              if(property.getGridAddEnabled()) {
                setDefaults(property, c.getRows());
              }

              break;

            case Dialogs.PropertyType.progressBar:

              var c = view.getProgressBars().get(property.getIndex());
              var val = Cairo.Util.val(property.getValue());
              c.setValue((val <= 100) ? val : 100);

              break;
          }

          // get the label for this control
          //
          if(property.getLabelIndex() !== 0) {
            lbl = view.getLabels().get(property.getLabelIndex());
          }

          if(c !== null) {

            var inCurrentTag = false;
            var lenStrTag = strTag.length;

            if(m_isDocument) {

              if(m_currentTab < m_firstTab) {
                m_currentTab = m_firstTab;
              }

              // strTag is used to know if this tab is owned
              // by the document dialog calling this method
              // (header, items or footer)
              //
              inCurrentTag = (c.getTag().substring(0, lenStrTag) === strTag
                              && c.getTag() !== ""
                              && !("cbTab" === c.getName())
                              && (Cairo.Util.val(c.getTag().substring(lenStrTag + 1)) + m_firstTab) === m_currentTab);
            }
            else {
              var valTag = Cairo.Util.val(c.getTag());
              if(valTag < 0 && valTag > Dialogs.TabIndexType.TAB_ID_XT_ALL) {
                inCurrentTag = ((valTag === m_currentInnerTab)
                                || (valTag === Dialogs.TabIndexType.TAB_ID_XT_ALL
                                      && m_currentInnerTab !== m_tabHideControlsInAllTab)
                                || (valTag === Dialogs.TabIndexType.TAB_ID_XT_ALL2));
              }
              else {
                inCurrentTag = ((valTag === m_currentTab)
                                || (valTag === Dialogs.TabIndexType.TAB_ID_XT_ALL
                                      && m_currentTab !== m_tabHideControlsInAllTab)
                                || (valTag === Dialogs.TabIndexType.TAB_ID_XT_ALL2));
              }
            }

            if(inCurrentTag) {
              c.setVisible(property.getVisible());
              if(lbl !== null) {
                if(Cairo.Util.val(lbl.getTag()) !== -1) {
                  lbl.setVisible(property.getVisible());
                }
              }
            }
            else {
              if(!(property.getKeyCol() === Cairo.Constants.NUMBER_ID
                    || property.getKeyCol() === Cairo.Constants.STATUS_ID
                    || (property.getSelectTable() === Cairo.Tables.DOCUMENTO && m_isDocument))) {
                c.setVisible(false);
                if(lbl !== null) {
                  lbl.setVisible(false);
                }
              }
              else {
                c.setVisible(true);
              }
            }
          }

          return true;
        };

        // update the edit status in controls
        //
        self.setEnabled = function(property) {

          var index = property.getIndex();
          var enabled = property.getEnabled();

          var view = getView();

          switch(property.getType()) {

            case Dialogs.PropertyType.list:
              view.getCombos().get(index).setEnabled(enabled);
              break;

            case Dialogs.PropertyType.select:
              view.getSelects().get(index).setEnabled(enabled);
              break;

            case Dialogs.PropertyType.numeric:
              view.getMaskEdits().get(index).setEnabled(enabled);
              break;

            case Dialogs.PropertyType.date:
            case Dialogs.PropertyType.time:
              view.getDatePickers().get(index).setEnabled(enabled);
              break;

            case Dialogs.PropertyType.option:
              view.getOptionButtons().get(index).setEnabled(enabled);
              break;

            case Dialogs.PropertyType.text:
            case Dialogs.PropertyType.file:
            case Dialogs.PropertyType.folder:
              if(property.getSubType() === Dialogs.PropertySubType.memo) {
                  view.getTextAreas().get(index).setEnabled(enabled);
              }
              else {
                  view.getTextInputs().get(index).setEnabled(enabled);
              }
              break;

            case Dialogs.PropertyType.password:
              view.getPasswordInputs().get(index).setEnabled(enabled);
              break;

            case Dialogs.PropertyType.check:
              view.getCheckBoxes().get(index).setEnabled(enabled);
              break;

            case Dialogs.PropertyType.button:
              view.getButtons().get(index).setEnabled(enabled);
              break;

            case Dialogs.PropertyType.grid:
              view.getGrids().get(index).setEnabled(enabled);
              break;
          }
        };

        // load property's control
        //
        self.loadControlEx = function(property, noGrids) {

          if(!property.getControlLoaded()) {
            if(!loadControl(property)) {
              return null;
            }
            property.setControlLoaded(true);
          }

          if(property.getType() !== Dialogs.PropertyType.grid || !noGrids) {
            self.showValueEx(property, false, "");
          }

          self.setTabIndexDescription();
          setBackgroundColor();
          return true;
        };

        // unload property's control
        //
        self.unloadControl = function(property) {

          if(property.getControlLoaded()) {

            property.setControl(null);

            var index = property.getIndex();

            var view = getView();

            switch(property.getType()) {

              case Dialogs.PropertyType.list:

                removeControl(view.getCombos().get(index));
                break;

              case Dialogs.PropertyType.select:

                removeControl(view.getSelects().get(index));
                break;

              case Dialogs.PropertyType.numeric:

                removeControl(view.getMaskEdits().get(index));
                break;

              case Dialogs.PropertyType.date:
              case Dialogs.PropertyType.time:

                removeControl(view.getDatePickers().get(index));
                break;

              case Dialogs.PropertyType.label:

                removeControl(view.getCtlLabels().get(index));
                break;

              case Dialogs.PropertyType.title:

                removeControl(view.getTitleLabel2().get(index));
                break;

              case Dialogs.PropertyType.progressBar:

                removeControl(view.getProgressBars().get(index));
                break;

              case Dialogs.PropertyType.description:

                removeControl(view.getDescription(index));
                break;

              case Dialogs.PropertyType.image:

                removeControl(view.getImages().get(index));
                break;

              case Dialogs.PropertyType.text:
              case Dialogs.PropertyType.file:
              case Dialogs.PropertyType.folder:

                if(property.getSubType() === Dialogs.PropertySubType.memo) {
                  removeControl(view.getTextAreas().get(index));
                }
                else {
                  removeControl(view.getTextInputs().get(index));
                }
                break;

              case Dialogs.PropertyType.password:

                removeControl(view.getPasswordInputs().get(index));
                break;

              case Dialogs.PropertyType.check:

                removeControl(view.getCheckBoxes().get(index));
                break;

              case Dialogs.PropertyType.grid:

                removeControl(view.getGrids().get(index));
                break;

              case Dialogs.PropertyType.button:

                removeControl(view.getButtons().get(index));
                break;
            }

            index = property.getLabelIndex();
            if(index > 0) {
              removeControl(getView().getLabels().get(index));
            }
          }
        };

        self.closeWizard = function() {
          self.setChanged(false);
          removeControl(m_wizardView);
        };

        var controlIsButton = function(control) { /* TODO: implement this. */ };
        var controlIsLabel = function(control) { /* TODO: implement this. */ };
        var controlIsToolbar = function(control) { /* TODO: implement this. */ };
        var controlIsImage = function(control) { /* TODO: implement this. */ };
        var controlIsGrid = function(control) { /* TODO: implement this. */ };
        var controlIsCheckbox = function(control) { /* TODO: implement this. */ };

        self.tabGetFirstCtrl = function(index) {

          var tabIndex = 999;
          var view = getView();
          var controls = view.getControls();
          var controlsCount = controls.count();
          var c = null;

          if(view.getTabs().get(index).getTag().indexOf(Dialogs.Constants.innerTab, 1)) {

            var childIndex = getTagChildIndex(view.getTabs().get(index).getTag());
            var fatherIndex = getTagFatherIndex(view.getTabs().get(index).getTag());

            for(var _i = 0; _i < controlsCount; _i++) {

              c = controls.get(_i);

              if(!(controlIsButton(c) && c.getName().indexOf("cbTab", 1))) {
                if(c.getTag().trim() !== "") {
                  if(Cairo.Util.val(c.getTag()) !== fatherIndex) {
                    if(getControlVisible(c, isControlVisibleInTab(c, childIndex))) {
                      if(!controlIsLabel(c) && !controlIsToolbar(c)) {
                        if(c.getTabIndex() < tabIndex) {
                          tabIndex = c.getTabIndex();
                        }
                      }
                    }
                  }
                }
              }
            }
            return c;
          }
          else {

            for(var _i = 0; _i < controlsCount; _i++) {

              c = controls.get(_i);

              if(!(controlIsButton(c) && c.getName().indexOf("cbTab", 1))) {
                if(c.getTag().trim() !== "") {
                  if(getControlVisible(c, isControlVisibleInTab(c, index))) {
                    if(!controlIsLabel(c) && !controlIsToolbar(c) && !controlIsImage(c)) {
                      if(c.getTabIndex() < tabIndex) {
                        tabIndex = c.getTabIndex();
                      }
                    }
                  }
                }
              }
            }
            return c;
          }
        };

        var docTabGetFirstCtrlAux = function(strTag, index) {

          var tabIndex = 999;
          var view = getView();
          var c = null;
          var controls = view.getControls();
          var controlsCount = controls.count();

          for(var _i = 0; _i < controlsCount; _i++) {
            c = controls.get(_i);
            if(c.getTag().substring(0, strTag.length) === strTag
                && c.getTag() !== ""
                && !(c.getName() === "cbTab")) {

              var isVisible = Cairo.Util.val(c.getTag().substring(strTag.length + 1)) + m_firstTab === index;

              if(getControlVisible(c, isVisible)) {
                if(!controlIsLabel(c) && !controlIsToolbar(c) && !controlIsImage(c)) {
                  if(c.getTabIndex() < tabIndex) {
                    tabIndex = c.getTabIndex();
                  }
                }
              }
            }
          }
          return c;
        };

        self.docTabGetFirstCtrl = function(index, tag) {

          switch(tag) {

            // in documents controls 's tags are set to
            // the word 'Items', 'Footers' or '' (null string)
            // used to know the group to which them belong
            //
            case Cairo.Constants.DocumentSections.items:
              if(m_isItems) {
                return docTabGetFirstCtrlAux(Cairo.Constants.DocumentSections.items, index);
              }
              break;

            case Cairo.Constants.DocumentSections.footer:
              if(m_isFooter) {
                return docTabGetFirstCtrlAux(Cairo.Constants.DocumentSections.footer, index);
              }
              break;

            default:
              if(m_isItems || m_isFooter) {
                return null;
              }
              else {
                return docTabGetFirstCtrlAux(Cairo.Constants.DocumentSections.header, index);
              }
              break;
          }
        };

        self.docTabClick = function(index, tag) {

          switch(tag) {

            // in documents controls 's tags are set to
            // the word 'Items', 'Footers' or '' (null string)
            // used to know the group to which them belong
            //
            case Cairo.Constants.DocumentSections.items:
              if(m_isItems) {
                docTabClickEx(Cairo.Constants.DocumentSections.items, index);
              }
              break;

            case Cairo.Constants.DocumentSections.footer:
              if(m_isFooter) {
                docTabClickEx(Cairo.Constants.DocumentSections.footer, index);
              }
              break;

            default:
              if(m_isItems || m_isFooter) {
                return null;
              }
              else {
                docTabClickEx(Cairo.Constants.DocumentSections.header, index);
              }
              break;
          }
        };

        var docTabClickEx = function(strTag, index) {

          m_currentTab = index;
          var view = getView();
          var controls = view.getControls();
          var controlsCount = controls.count();

          for(var _i = 0; _i < controlsCount; _i++) {

            var c = controls.get(_i);

            if(c.getTag().substring(0, strTag.length) === strTag
                && c.getTag() !== ""
                && !(c.getName() === "cbTab")) {

              var isVisible = Cairo.Util.val(c.getTag().substring(strTag.length + 1)) + m_firstTab === index;
              c.setVisible(getControlVisible(c, isVisible));

              if(controlIsLabel(c)) {
                if(c.getBackColor() === Dialogs.Colors.buttonFace) {
                  c.setBackColor(view.getBackground().getBackColor());
                }
                if(c.getName().toLowerCase() === "lb") {
                  if(c.getText().trim() === "") {
                    c.setVisible(false);
                  }
                }
              }
              else if(controlIsCheckbox(c)) {
                c.BackColor = view.getBackground().getBackColor();
              }
              if(controlIsToolbar(c) && c.getVisible()) {
                view.setToolbar(c);
              }
            }
          }
        };

        var getControlVisible = function(ctl, isVisible) {

          var propertyCount = m_properties.count();
          for(var _i = 0; _i < propertyCount; _i++) {
            var property = m_properties.get(_i);
            var c = property.getControl();
            if(c.getType() === ctrl.getType()) {
              if(!property.getVisible()) {
                isVisible = false;
              }
              break;
            }
            else if(controlIsLabel(c)) {
              if(!(ctl.getName().substring(0, 3) === "lb2")) {
                if(property.getLabelIndex() === ctl.getIndex()) {
                  if(!property.getVisible()) {
                    isVisible = false;
                  }
                  break;
                }
              }
            }
          }
          return isVisible;
        };

        self.tabClick = function(index) {

          var firstTab = null;
          var view = getView();
          var controlsCount = view.getControls().count();
          var controls = view.getControls();
          m_currentInnerTab = 0;

          if(view.getTabs().get(index).getTag().indexOf(Dialogs.Constants.innerTab, 1)) {

            var childIndex = getTagChildIndex(view.getTabs().get(index).getTag());
            var fatherIndex = getTagFatherIndex(view.getTabs().get(index).getTag());

            for(var _i = 0; _i < controlsCount; _i++) {
              var c = controls.get(_i);
              if(!(controlIsButton(c) && c.getName().indexOf("cbTab", 1))) {
                if(c.getTag().trim() === "") {
                  if(Cairo.Util.val(c.getTag()) !== fatherIndex) {
                    setVisible(c, childIndex);
                  }
                }
              }
            }

            var tab = view.getTabs().get(index);
            tab.virtualPush();

            m_currentInnerTab = childIndex;

          }
          else {
            m_currentTab = index;

            for(var _i = 0; _i < controlsCount; _i++) {
              var c = controls.get(_i);
              if(controlIsButton(c) && c.getName().indexOf("cbTab", 1)) {
                if(c.getTag().indexOf(Dialogs.Constants.innerTab, 1)) {
                  var isVisible = getTagFatherIndex(c.getTag()) === index;
                  c.setVisible(isVisible);
                  if(isVisible) {
                    if(firstTab === null) {
                      firstTab = c;
                    }
                  }
                }
              }
              else if(c.getTag().trim() === "") {
                setVisible(c, index);
              }
            }
          }

          if(firstTab !== null) {
            self.tabClick(firstTab.getIndex());
            m_currentInnerTab = getTagChildIndex(firstTab.getTag());
          }
        };

        var setVisible = function(c, index) {

          var view = getView();
          c.setVisible(getControlVisible(c, isControlVisibleInTab(c, index)));

          if(controlIsLabel(c)) {
            if(c.getBackColor() === Dialogs.Colors.buttonFace) {
              c.setBackColor(view.getBackground().getBackColor());
            }
            if(c.getName().toLowerCase() === "lb") {
              if(c.getText().trim() === "") {
                c.setVisible(false);
              }
            }
          }
          else if(controlIsCheckbox(c)) {
            c.setBackColor(view.getBackground().getBackColor());
          }
          else if(controlIsToolbar(c) && c.getVisible()) {
            view.setToolbar(c);
          }
        };

        self.showEx = function(obj, indexTag, addProp) {
          return showDialog(obj, indexTag, !addProp);
        };

        self.show = function(obj, indexTag) {
          try {
            Cairo.LoadingMessage.showWait();
            return showDialog(obj, indexTag, true);
          }
          catch(e) {
            Cairo.manageError(
              "Showing Dialog",
              "An error has occurred when showing a dialog.",
              e.message);
            return false;
          }
          finally {
            Cairo.LoadingMessage.close();
          }
        };

        self.setIconInDocument = function(iconIndex) {
          if(m_documentView !== null) {
            if(m_documentView.getIcons().count() >= iconIndex) {
              m_documentView.setIcon(m_documentView.getIcons().get(iconIndex));
            }
          }
        };

        self.setIconInMaster = function(iconIndex) {
          if(m_masterView !== null) {
            if(m_masterView.getIcons.count() >= iconIndex) {
              m_masterView.setIcon(m_masterView.getIcons().get(iconIndex));
            }
          }
        };

        // show pop menu for document aux button in document views
        //
        self.showPopMenu = function(strMenuDef) {

          var c_menu_sep = "|";
          var c_menu_sep2 = "~";

          var menus = strMenuDef.split(c_menu_sep);

          m_menu.addListener(menuClick);
          m_menu.clear();
          var count = menus.length;
          for(var i = 0; i < count; i++) {
            var menu = menus[i].split(c_menu_sep2);
            m_menu.add(menu[0], menu[1]);
          }

          m_menu.showPopupMenu();
        };

        var implementsGrid = function(obj) { /* TODO: implements this. */ };
        var loadView = function(view, id) { /* TODO: implements this. */ };
        var loadViewConfiguration = function(view, id) { /* TODO: implements this. */ };
        var viewIsMaster = function(view) { /* TODO: implements this. */ };
        var viewIsDocument = function(view) { /* TODO: implements this. */ };
        var viewIsWizard = function(view) { /* TODO: implements this. */ };

        var showDialog = function(obj, indexTag) {
          var success = false;

          indexTag = indexTag || 0;

          if(obj !== null) {

            m_client = obj;

            var view = getView();

            m_clientManageGrid = implementsGrid(m_client);

            if(m_mustCompleteLoading) {
              m_mustCompleteLoading = false;

              if(m_owner === null) {
                if(m_minHeight < view.getHeight()) {
                  m_minHeight = view.getHeight();
                }
                if(m_minWidth < view.getWidth()) {
                  m_minWidth = view.getWidth();
                }
              }

              if(viewIsMaster(view)) {
                view.setNoMoveGenericButton(m_noMoveGenericButton);
                view.setPopMenuClient(m_popMenuClient);
              }

              if(viewIsWizard(view)) {
                loadView(getView(), "wiz");
              }
              else {
                loadView(getView(), "view_"+ m_client.getTitle());
              }

              if(viewIsMaster(view) || viewIsWizard(view)) {
                if(view.getHeight() < m_minHeight) {
                  view.setHeight(m_minHeight);
                }
                if(view.getWidth() < m_minWidth) {
                  view.setWidth(m_minWidth);
                }
              }
            }

            showView(indexTag);

            view.setText(getViewText());

            if(m_hideTitle) {
              view.getTitleLabel().setVisible(false);
            }
            else {
              view.getTitleLabel().setText(m_client.getTitle());
            }

            if(viewIsMaster(view)) {
              view.getEditDocumentsButton().setVisible(m_client.editDocumentsEnabled());
              view.getNewButton().setVisible(m_client.addEnabled());
              view.getCopyButton().setVisible(m_client.copyEnabled());
            }

            self.refreshTitle();

            if(view.getVisible()) {
              view.bringToFront();
            }
            else {
              if(m_isDocument) {
                if(m_isFooter) {
                  view.setLoading(false);
                  if(m_inModalWindow) {
                    if(!m_viewShowed) {
                      m_viewShowed = true;
                      view.showDialog();
                    }
                  }
                  else {
                    view.showView();
                  }
                }
              }
              else {
                view.setLoading(false);
                if(m_inModalWindow) {
                  if(!m_viewShowed) {
                    m_viewShowed = true;
                    if(viewIsMaster(view) || viewIsWizard(view)) {
                      view.showView();
                      setNoResize();
                      view.firstResize();

                      if(viewIsWizard(view)) {
                        loadViewConfiguration(getView(), "master_" + Cairo.Company.name + " - "+ m_client.getTitle());
                      }
                    }
                    if(m_sendAutoSave) {
                      if(viewIsMaster(view)) {
                        view.sendAutoSave();
                      }
                    }
                    if(viewIsMaster(view)) {
                      view.raiseAfterLoadEvent();
                    }
                    view.showDialog();
                  }
                }
                else {
                  if(viewIsMaster(view) || viewIsWizard(view)) {
                    view.showView();
                    setNoResize();
                    view.firstResize();

                    if(viewIsWizard(view)) {
                      loadViewConfiguration(getView(), "master_" + Cairo.Company.name + " - "+ m_client.getTitle());
                    }
                  }
                  view.showDialog();
                }
              }
              success = true;
            }
          }
          return success;
        };

        self.setHideTitle = function(rhs) {
          m_hideTitle = rhs;
        };

        self.setInModalWindow = function(rhs) {
          m_inModalWindow = rhs;
        };

        self.getInModalWindow = function() {
          return m_inModalWindow;
        };

        self.setIsDocument = function(rhs) {
          m_isDocument = rhs;
        };

        self.setIsFooter = function(rhs) {
          m_isFooter = rhs;
        };

        self.setIsItems = function(rhs) {
          m_isItems = rhs;
        };

        self.setLeft = function(rhs) {
          getView().setLeft(rhs);
        };

        self.getLeft = function() {
          return getView().getLeft();
        };

        self.setView = function(rhs) {
          m_documentView = rhs;
          initCtrlPosition();
          initVectorsPosition();
        };

        self.getViewMainImage = function() {
          return getView().getImage();
        };

        self.getProperties = function() {
          return m_properties;
        };

        self.refreshControls = function(noGrids) {
          if(!m_unloading) {
            showView(-1, noGrids, false);
            try {
              var tab = getView().getTabs().get(m_currentTab);
              tab.virtualPush();
            }
            catch(ignore) {}
          }
        };

        self.getShapeMain = function() {
          return getView().getTab();
        };

        self.showValue = function(property) {
          var strTag = "";
          if(m_isDocument) {
            strTag = getStrTag(property);
          }
          self.showValueEx(property, false, strTag);
        };

        var getStrTag = function(property) {
          return Cairo.safeExecute(
            function() {
              if(property.getControl() !== null) {
                var tag = property.getControl().getTag();
                return tag.substring(1, tag.length - 1);
              }
              else {
                return "";
              }
            },
            ""
          );
        };

        self.getTabs = function() {
          if(m_tabs === null) {
            m_tabs = Cairo.Tab.Controller.createTab("#viewMainTabBar", "#viewMainTabBody", "view_main_tab");;
          }
          return m_tabs;
        };

        self.setTitle = function(rhs) {
          m_title = rhs;
        };

        self.setTop = function(rhs) {
          getView().setTop(rhs);
        };

        self.getTop = function() {
          return getView().getTop();
        };

        var masterHandlerViewKeyDown = function(keyCode, shift) {
          return Cairo.safeExecute(function() {
            m_client.messageEx(Dialogs.Message.MSG_KEY_DOWN, keyCode);
          });
        };

        var masterHandlerAfterShowModal = function() {
          return Cairo.safeExecute(function() {
            m_client.messageEx(Dialogs.Message.MSG_FORM_AFTER_SHOW_MODAL, null);
          });
        };

        var masterHandlerPopItemClick = function(index) {
          return Cairo.safeExecute(function() {
            m_client.messageEx(Dialogs.Message.MSG_POP_MENU_ITEM, index);
          });
        };

        var masterHandlerSetResizeGrid = function() {
          setNoResize();
        };

        var masterHandlerTabGetFirstCtrl = function(index) {
          return tabGetFirstCtrl(index);
        };

        var docHandlerCommandClick = function(index) {
          propertyHasChanged(Dialogs.PropertyType.button, index, getView().getButtons().get(index));
        };

        var docHandlerGridDblClick = function(index, rowIndex, colIndex) {
          if(m_isItems) {
            if(m_clientManageGrid) {
              var property = getProperty(Dialogs.PropertyType.grid, index, 0);
              m_client.gridDblClick(property.getKey(), rowIndex, colIndex);
            }
          }
        };

        var docHandlerSelectKeyDown = function(index, keyCode, shift) {
          var property = getProperty(Dialogs.PropertyType.select, index, 0);
          if(property !== null) {
            if(keyCode === Dialogs.Keys.KeyF2) {
              m_client.messageEx(Dialogs.Message.MSG_ABM_KEY_F2, property);
            }
            else if(keyCode === Dialogs.Keys.KeyF3) {
              m_client.messageEx(Dialogs.Message.MSG_ABM_KEY_F3, property);
            }
          }
        };

        var wizHandlerGridDblClick = function(index, rowIndex, colIndex) {
          if(m_clientManageGrid) {
            var property = getProperty(Dialogs.PropertyType.grid, index, 0);
            m_client.gridDblClick(property.getKey(), rowIndex, colIndex);
          }
        };

        var wizHandlerTabGetFirstCtrl = function(index) {
          return self.tabGetFirstCtrl(index);
        };

        ///////////////////////////////////////////////////////////////////////////////////////////
        // UI events

        //-----------
        // menu
        //
        var menuClick = function(id) {
          try {
            m_client.messageEx(Dialogs.Message.MSG_MENU_AUX, m_menu.getItemData(id));
          }
          catch(e) {
            Cairo.manageError(
              "Error in Menu Click Handler",
              "An error has occurred when handling a menu action.",
              e.message);
          }
        };

        //------------
        // masters
        //
        var masterHandlerComboChange = function(index) {
          comboChange(index);
        };

        var masterHandlerTabClick = function(index) {
          self.tabClick(index);
        };

        var masterHandlerCheckBoxClick = function(index) {
          checkBoxClick(index);
        };

        var masterHandlerCancelClick = function() {
          var p = null;

          try {
            if(m_showOkCancel) {
              masterHandlerCloseClick();
              m_okCancelResult = false;
            }
            else {
              if(m_sendRefresh) {
                m_client.messageEx(Dialogs.Message.MSG_DOC_REFRESH, null);
                self.refreshTitle();
                self.setChanged(false);
              }
              else {
                p = discardChanges();
              }
            }
          }
          catch(e) {
            Cairo.manageError(
              "Error in Master Cancel Click Handler",
              "An error has occurred when handling a 'cancel' action.",
              e.message);
          }
          return (p || Cairo.Promises.resolvedPromise(true));
        };

        var masterHandlerCommandClick = function(index) {
          propertyHasChanged(Dialogs.PropertyType.button, index, getView().getButtons().get(index));
        };

        var masterHandlerCloseClick = function() {
          if(m_masterView !== null) {
            removeControl(m_masterView);
          }
        };

        var masterHandlerCopyClick = function() {
          m_client.copy();
          /* TODO: maybe we have to remove this */
          try {
            m_masterView.bringToFront();
          }
          catch(ignore) {}
        };

        var masterHandlerDocumentsClick = function() {
          m_client.showDocDigital();
        };

        var masterHandlerNewClick = function() {
          try {
            if(m_client.addEnabled()) {
              doNew(m_masterView);
              try {
                m_masterView.bringToFront();
              }
              catch(ignore) {}
            }
          }
          catch(e) {
            Cairo.manageError(
              "Error in Master New Click Handler",
              "An error has occurred when handling a 'new' action.",
              e.message);
          }
        };

        var doNew = function(view) {
          Cairo.LoadingMessage.showWait();

          var p = null;

          // only in master or header of documents
          //
          if(!m_isItems && !m_isFooter) {
            p = saveChanges(false).then(
              function() {
                var p = null;

                m_title = "";

                if(!m_isDocument && !m_sendRefresh) {
                  p = discardChanges(true);
                }

                p = p || Cairo.Promises.resolvedPromise();

                p.then(
                  function(ignored) {
                    m_client.editNew().then(
                      function(ignored) {
                        var p = null;

                        if(m_sendRefresh) {
                          self.refreshTitle();
                        }

                        if(m_isDocument) {
                          p = newWithWizard().then(
                            function(newHandledByAWizard) {
                              if(!newHandledByAWizard) {
                                moveFocus();
                              }
                            }
                          );
                        }

                        p = p || Cairo.Promises.resolvedPromise();

                        return p.then(
                          function(ignored) {
                            var p = null;

                            self.setChanged(false);

                            if(m_newPropertyKeyFocus !== "") {
                              self.setFocusFromPropertyKey(m_newPropertyKeyFocus);
                            }
                            else {
                              if(m_isDocument) {
                                p = newWithWizard().then(
                                  function(ignored) {
                                    view.setFocusFirstControl();
                                    return true;
                                  }
                                );
                              }
                            }
                            return (p || Cairo.Promises.resolvedPromise(true));
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
          return (p || Cairo.Promises.resolvedPromise(true));
        };

        var moveFocus = function() {
          if(m_documentView !== null) {
            Cairo.safeExecute(function() { m_documentView.getDatePickers().get(0).setFocus() });
            Cairo.safeExecute(function() { m_documentView.getActiveControl().setFocus() });
          }
        };

        self.setFocusFromPropertyKey = function(propertyKey) {
          Cairo.safeExecute(function() { m_properties.get(propertyKey).getControl().setFocus() });
        };

        var masterHandlerPrintClick = function() {
          Cairo.safeExecute(function() {
            var answer = m_client.messageEx(Dialogs.Message.MSG_ABM_PRINT, null);
            if(answer !== true) {
              Cairo.infoViewShow("Printing", "This dialog doesn't have a print option");
            }
          });
        };

        var setCanPrint = function() {
          Cairo.safeExecute(function() {
            m_client.messageEx(
              Dialogs.Message.MSG_ABM_CAN_PRINT,
              null
            ).then(
              function(result) {
                getView().getPrintButton().setVisible(Cairo.Util.val(result) === Dialogs.Message.MSG_ABM_CAN_PRINT);
              },
              Cairo.manageErrorHandler("Printing")
            );
          });
        };

        var masterHandlerPermissionsClick = function() {
          Cairo.safeExecute(function() {
            m_client.messageEx(
              Dialogs.Message.MSG_EDIT_PERMISSIONS,
              null
            ).then(
              function(answer) {
                if(answer === true) {
                  /* TODO: implement this. the server can't present a dialog so we have to initiate the edition
                           of permitions here. I think we have to return an action definition that handle the edition.
                           this action could be a route.
                  */
                }
                else {
                  Cairo.infoViewShow("Printing", "This dialog doesn't allow to edit permissions");
                }
              },
              Cairo.manageErrorHandler("Permissions")
            );
          });
        };

        var setShowPermissions = function() {
          Cairo.safeExecute(function() {
            m_client.messageEx(
              Dialogs.Message.MSG_SHOW_EDIT_PERMISSIONS,
              null
            ).then(
              function(result) {
                getView().getPermissionsButton().setVisible(
                  Cairo.Util.val(result) === Dialogs.Message.MSG_SHOW_EDIT_PERMISSIONS);
              },
              Cairo.manageErrorHandler("Permissions")
            );
          });
        };

        var showSelect = function() {
          Cairo.safeExecute(function() {
            m_client.messageEx(
              Dialogs.Message.MSG_DOC_INFO,
              null
            ).then(
              function(result) {
                if(Cairo.Util.val(result) !== Dialogs.Message.MSG_DOC_INFO_HANDLED) {
                  self.showHelpAux();
                }
              },
              Cairo.manageErrorHandler("Show Info")
            );
          });
        };

        self.showHelpAux = function() {
          Cairo.safeExecute(function() {
            Cairo.Util.File.editFile(Cairo.Util.File.getValidPath(Cairo.Configuration.appPath()) + "cairo.html");
          });
        };

        var masterHandlerSaveClick = function() {
          saveDialog(false, false).then(
            function(saved) {
              if(saved) {
                if(m_showOkCancel) {
                  m_okCancelResult = true;
                  if(m_masterView !== null) {
                    m_masterView.setSaved();
                    masterHandlerCloseClick();
                  }
                }
                else {
                  if(m_sendNewABM) {
                    masterHandlerNewClick();
                  }
                }
              }
            }
          );
        };

        var masterHandlerViewLoad = function() {
          self.resetChanged();
        };

        var masterHandlerViewBeforeDestroy = function(cancel, unloadMode) {
          if(m_client !== null) {
            saveChanges(true);
          }
        };

        var masterHandlerViewDestroy = function(cancel) {
          try {
            if(m_client !== null) {
              saveColumnsGrids();
              destroyGrids(getView());
              m_unloading = true;
              m_client.terminate();
              m_client = null;
            }
            m_masterView = null;
          }
          catch(ignore) {}
        };

        /*
          we need to ask the user if she/he wants to save changes
          so this function returns a promise which depends of the
          answer:

            the user have three options: Yes, No or Cancel

            when Yes:     it returns the promise with the result of calling saveDialog()

            when No:      it returns true. because the user want to discard the changes

            when Cancel:  it returns false. because the user neither want to save these
                          changes or discard them. Probably he/she wants to continue
                          editing before saving

            NOTE: maybe the unloading param will be removed in the future. it was used
                  in the desktop version to prevent the window to be closed when the
                  user decided to continue editing. I don't know if that could be done
                  in the web. the idea is to present a message asking the user if she/he
                  really wants to close the tab in the browser. we have two different tabs
                  one is the Cairo Tab the other is the browser tab. We have total control
                  of the former but I don't know about cross browser compatibility in
                  preventing a browser tab/window close action from javascript.
        */
        var saveChanges = function(unloading) {
          var p;

          unloading = unloading || false;

          /*
            Document edition:

            for footers or items it returns always true
            because the saving is done in the header
          */
          if(!m_isFooter && !m_isItems) {

            /*
              there are some dialogs which are used to
              show information or present parameters
              to launch a process like import or export.
              in these cases m_noAskForSave defines
              we don't need to ask the user because these
              changes never will be persisted.
            */
            if(getChanged() && !m_noAskForSave) {
              getView().bringToFront();

              p = Cairo.Modal.confirmCancelViewNoDanger(
                "Saving",
                "Do you want to save changes ?"
              ).then(
                function(answer) {
                  /*
                    if the user wants to save changes
                    it returns a promise with the result
                    of calling saveDialog()
                    save is asynchronous (ajax call to server)
                  */
                  if(answer === "yes") {
                    return saveDialog(unloading, false).then(
                        function(saved) {
                          if(saved) {
                            self.setChanged(false);
                          }
                          return saved;
                        }
                      );
                  }
                  /*
                    the user wants to discard these changes
                  */
                  else if(answer === "no") {
                    self.setChanged(false);
                    return true;
                  }
                  /*
                    the user wants to continue editing
                  */
                  else { /* answer === "cancel" */
                    return false;
                  }
                }
              );
            }
          }
          return (p || Cairo.Promises.resolvedPromise(true));
        };

        /*
        * TODO:
        *
        * _cancel_
        *
        * sadly in the vb6 version I have used this style of passing a byref boolean cancel parameter
        * to allow this methods to indicate the action must be cancelled
        *
        * this has to be changed
        *
        * all function which has a _cancel_ should be refactor to return boolean:
        *
        *   returns true when it is success or false when the edition has to be cancelled
        *
        * if any function has a return value in its original vb6 version it should return an object
        *
        *   { cancel: boolean, originalReturn: any type }
        *
        * NOTICE: if the function makes a call to any method of m_client it should return a promise
        *
        * */

        // TODO: refactor promise is returned by this function
        //
        var masterHandlerGridColumnAfterEdit = function(index, rowIndex, colIndex, newValue, newValueID) {
          return gridColumnEdit(true, index, rowIndex, colIndex, 0, newValue, newValueID);
        };

        var masterHandlerGridColumnAfterUpdate = function(index, rowIndex, colIndex, newValue, newValueID) {
          gridColumnAfterUpdate(index, rowIndex, colIndex, 0, newValue, newValueID);
        };

        // TODO: refactor promise is returned by this function
        //
        var masterHandlerGridColumnBeforeEdit = function(index, rowIndex, colIndex, keyAscii) {
          // TODO: investigate why it calls gridColumnEdit instead of gridBeforeColumnEdit()
          return gridColumnEdit(false, index, rowIndex, colIndex, keyAscii, 0, 0);
        };

        var masterHandlerGridColumnButtonClick = function(index, rowIndex, colIndex) {
          return gridColumnButtonClick(index, rowIndex, colIndex);
        };

        var masterHandlerGridDblClick = function(index, rowIndex, colIndex) {
          if(m_clientManageGrid) {
            var property = getProperty(Dialogs.PropertyType.grid, index, 0);
            m_client.gridDblClick(property.getKey(), rowIndex, colIndex);
          }
        };

        var masterHandlerGridDeleteRow = function(index, rowIndex) {
          return gridDeleteRow(index, rowIndex);
        };

        var masterHandlerGridNewRow = function(index, rowIndex) {
          gridNewRow(index, rowIndex);
        };

        var masterHandlerGridAfterDeleteRow = function(index, rowIndex) {
          gridAfterDeleteRow(index, rowIndex);
        };

        var masterHandlerGridSelectionChange = function(index, rowIndex, colIndex) {
          gridSelectionChange(index, rowIndex, colIndex, Dialogs.GridSelectChangeType.GRID_SELECTION_CHANGE);
        };

        var masterHandlerGridSelectionRowChange = function(index, rowIndex, colIndex) {
          gridSelectionChange(index, rowIndex, colIndex, Dialogs.GridSelectChangeType.GRID_ROW_CHANGE);
        };

        var masterHandlerGridValidateRow = function(index, rowIndex) {
          return gridValidateRow(index, rowIndex, true);
        };

        var masterHandlerSelectChange = function(index) {
          selectChange(index);
        };

        var masterHandlerMaskEditChange = function(index) {
          maskEditChange(index);
        };

        var masterHandlerDateChange = function(index) {
          dateChange(index);
        };

        var masterHandlerOptionButtonClick = function(index) {
          optionButtonClick(index);
        };

        var masterHandlerShowSelect = function() {
          showSelect();
        };

        var masterHandlerToolbarButtonClick = function(button) {
          toolBarButtonClick(button);
        };

        var masterHandlerTextButtonClick = function(index, cancel) {
          textButtonClick(index, cancel);
        };

        var masterHandlerTextChange = function(index) {
          textChange(index);
        };

        var masterHandlerTextAreaChange = function(index) {
          textAreaChange(index);
        };

        var masterHandlerTextPasswordChange = function(index) {
          textPasswordChange(index);
        };

        var docHandlerTabClick = function(index, tag) {
          self.docTabClick(index, tag);
        };

        // only change ctrl if there is a control in this tab
        // under this index
        //
        var docHandlerTabGetFirstCtrl = function(index, tag, ctrl) {
          var ctrlAux = self.docTabGetFirstCtrl(index, tag);
          if(ctrlAux !== null) {
            ctrl = ctrlAux;
          }
          return ctrl;
        };

        var docHandlerViewLoad = function() {
          self.resetChanged();
        };

        var docHandlerGridAfterDeleteRow = function(index, rowIndex) {
            gridAfterDeleteRow(index, rowIndex);
        };

        var docHandlerToolbarClick = function(button) {
          try {

            if(!m_isItems && !m_isFooter && button !== null) {

              switch(button.getKey()) {

                case Dialogs.Constants.toolbarKeyNew:

                  toolBarClickNew().then(
                    function() {
                      if(m_sendNewDoc) {
                        setFocusInFirstControl();
                      }
                      m_client.messageEx(Dialogs.Message.MSG_DOC_NEW_EVENT_COMPLETE, null);
                    }
                  );
                  break;

                case Dialogs.Constants.toolbarKeySave:

                  showMsg("Saving document ...");
                  saveDialog(false, false).then(
                    function() {
                      if(m_sendNewDoc) {
                        toolBarClickNew().then(
                          function() {
                            setFocusInFirstControl();
                          }
                        );
                      }
                      else {
                        hideMsg();
                      }
                    }
                  );
                  break;

                case Dialogs.Constants.toolbarKeySaveAs:

                  showMsg("Saving document ...");
                  m_savingAs = true;
                  saveDialog(false, true).then(
                    function() {
                      if(m_sendNewDoc) {
                        toolBarClickNew().then(
                          function() {
                            setFocusInFirstControl();
                          }
                        );
                      }
                      else {
                        hideMsg();
                      }
                      m_savingAs = false;
                    }
                  );
                  break;

                case Dialogs.Constants.toolbarKeyInvalidate:

                  showMsg("Invalidating document ...");
                  m_client.messageEx(Dialogs.Message.MSG_DOC_INVALIDATE, null).then(hideMsg);
                  break;

                case Dialogs.Constants.toolbarKeyReload:

                  reloadDocument();
                  break;

                case Dialogs.Constants.toolbarKeyCopy:

                   masterHandlerCopyClick();
                   break;

                case Dialogs.Constants.toolbarKeyEditState:

                  m_client.messageEx(Dialogs.Message.MSG_DOC_EDIT_STATE, null);
                  break;

                case Dialogs.Constants.toolbarKeyDocAux:

                  m_client.messageEx(Dialogs.Message.MSG_DOC_DOC_AUX, null);
                  break;

                case Dialogs.Constants.toolbarKeyDocAction:
                  m_client.messageEx(Dialogs.Message.MSG_DOC_DOC_ACTION, null);
                  break;

                case Dialogs.Constants.toolbarKeyDocEdit:

                  m_client.messageEx(Dialogs.Message.MSG_DOC_DOC_EDIT, null);
                  break;

                case Dialogs.Constants.toolbarKeyDelete:

                  showMsg("Deleting document ...");
                  askDelete("Confirm you want to delete this document ?").then(
                    function(answer) {
                      if(answer) {
                        m_client.messageEx(Dialogs.Message.MSG_DOC_DELETE, null).then(
                          function(success) {
                            if(success) {
                              self.resetChanged();
                            }
                            hideMsg();
                          }
                        );
                      }
                      else {
                        hideMsg();
                      }
                    }
                  );

                  break;

                case Dialogs.Constants.toolbarKeySearch:

                  m_client.messageEx(Dialogs.Message.MSG_DOC_SEARCH, getChanged());
                  break;

                case Dialogs.Constants.toolbarKeyPrint:

                  print(false);
                  break;

                case Dialogs.Constants.toolbarKeyDocMail:

                  print(true);
                  break;

                case Dialogs.Constants.toolbarKeySignature:

                  m_client.messageEx(Dialogs.Message.MSG_DOC_SIGNATURE, null);
                  break;

                case Dialogs.Constants.toolbarKeyApply:

                  showMsg("Load document applications ...");
                  m_client.messageEx(Dialogs.Message.MSG_DOC_APPLY, null).then(hideMsg);
                  break;

                case Dialogs.Constants.toolbarKeyAttach:

                  masterHandlerDocumentsClick();
                  break;

                case Dialogs.Constants.toolbarKeyHistory:

                  m_client.messageEx(Dialogs.Message.MSG_DOC_HISTORY, null);
                  break;

                case Dialogs.Constants.toolbarKeyFirst:

                  showMsg("Loading first document ...");
                  move(Dialogs.Message.MSG_DOC_FIRST).then(hideMsg);
                  break;

                case Dialogs.Constants.toolbarKeyPrevious:

                  showMsg("Loading previous document ...");
                  move(Dialogs.Message.MSG_DOC_PREVIOUS).then(hideMsg);
                  break;

                case Dialogs.Constants.toolbarKeyNext:

                  showMsg("Loading next document ...");
                  move(Dialogs.Message.MSG_DOC_NEXT).then(hideMsg);
                  break;

                case Dialogs.Constants.toolbarKeyLast:

                  showMsg("Loading last document ...");
                  move(Dialogs.Message.MSG_DOC_LAST).then(hideMsg);
                  break;

                case Dialogs.Constants.toolbarKeyHelp:

                  showSelect();
                  break;

                case Dialogs.Constants.toolbarKeyDocMerge:

                  showMsg("Executing compensation process ...");
                  m_client.messageEx(Dialogs.Message.MSG_DOC_MERGE, null).then(hideMsg);
                  break;

                case Dialogs.Constants.toolbarKeyDocAlert:
                  showMsg("Loading notifications for this document...");
                  m_client.messageEx(Dialogs.Message.MSG_DOC_ALERT, null).then(hideMsg);
                  break;

                case Dialogs.Constants.toolbarKeyDocTip:

                  Cairo.Util.sendEmailToCrowSoft("Suggestions for CrowSoft Cairo", "Documents: " + m_title);
                  break;

                case Dialogs.Constants.toolbarKeyClose:

                  formDocClose();
                  break;

                default:

                  m_client.messageEx(Dialogs.Message.MSG_TOOLBAR_BUTTON_CLICK, button.getKey());
                  break;
              }
            }
          }
          catch(e) {
            Cairo.manageError(
              "Error in Document Toolbar Click Handler",
              "An error has occurred when processing '" + button.getName() + button.getKey().toString()  + "' action.",
              e.message);
              hideMsg();
              m_savingAs = false;
          }
        };

        self.raiseNewDocEven = function() {
          toolBarClickNew().then(
            function() {
              if(m_sendNewDoc) {
                if(!m_setFocusFirstCtrlInNew) {
                  setFocusControl(m_documentView.getGrids().get(0));
                  Cairo.Util.sendKeys("{ENTER}");
                }
              }
            }
          );
        };

        // update the rows collection of the property's grid object
        // with the value contained in the selected row of the
        // grid control
        //
        // there is always a row selected because the row which
        // has the focus is always selected
        //
        self.refreshSelectedInGrid = function(property) {
          m_gridManager.refreshSelectedInGrid(property);
        };

        // only take selected rows if the focus is in the first column
        //
        // this is to differentiate rows which are explicitly selected
        // from implicitly selected row because it has the focus
        //
        self.refreshSelectedInGrid2 = function(property) {
          m_gridManager.refreshSelectedInGrid2(property);
        };

        var toolBarClickNew = function() {
          showMsg("Loading a new document ...");
          doNew(m_documentView).then(hideMsg);
        };

        // TODO: remove changeTop from all places which call this function
        //       then remove this param :D
        //
        var showMsg = function(msg, changeTop) {
          Cairo.LoadingMessage.show("Documents", msg);
        };

        var hideMsg = function() {
          Cairo.LoadingMessage.close();
        };

        var move = function(moveTo) {
          if(m_client !== null) {
            if(!saveChanges(false)) { return; }
            return m_client.messageEx(moveTo, null).then(
              function() {
                if(m_isDocument) {
                  moveFocus();
                }
                self.setChanged(false);
              }
            );
          }
        };

        //------------
        // Wizard
        var wizHandlerComboChange = function(index) {
          comboChange(index);
        };

        var wizHandlerTabClick = function(index) {
          self.tabClick(index);
        };

        var wizHandlerCheckBoxClick = function(index) {
          checkBoxClick(index);
        };

        var wizHandlerCancelClick = function() {
          try {
            if(!m_inProcess) {
              wizDisableButtons();
              m_client.propertyChange(K_W_CANCEL).then(
                function(result) {
                  wizEnableButtons();
                  if(result) {
                    self.setChanged(false);
                    removeControl(m_wizardView);
                  }
                }
              );
            }
          }
          catch(ignore) {}
        };

        var wizHandlerBackClick = function() {
          try {
            if(!m_inProcess) {
              wizDisableButtons();
              moveBack().then(wizEnableButtons);
            }
          }
          catch(ignore) {}
        };

        var wizHandlerCommandClick = function(index) {
          propertyHasChanged(Dialogs.PropertyType.button, index, getView().getButtons().get(index));
        };

        var wizHandlerNextClick = function() {
          try {
            if(!m_inProcess) {
              wizDisableButtons();
              moveNext().then(wizEnableButtons);
            }
          }
          catch(ignore) {}
        };

        var wizHandlerViewLoad = function() {
          self.resetChanged();
        };

        // TODO: implement a mechanic to prevent losing changes when close the tab or the window browser
        //
        var wizHandlerViewBeforeDestroy = function(cancel, unloadMode) {
          try {
            if(m_client !== null) {
              saveChanges(true);
            }
          }
          catch(ignore) {}
        };

        var wizHandlerViewDestroy = function(cancel) {
          try {
            if(m_client !== null) {
              saveColumnsGrids();
              destroyGrids(getView());
              m_unloading = true;
              m_client.terminate();
              m_client = null;
            }
            m_wizardView = null;
          }
          catch(ignore) {}
        };

        // TODO: refactor promise is returned by this function
        //
        var wizHandlerGridColumnAfterEdit = function(index, rowIndex, colIndex, newValue, newValueID) {
          return gridColumnEdit(true, index, rowIndex, colIndex, 0, newValue, newValueID);
        };

        var wizHandlerGridColumnAfterUpdate = function(index, rowIndex, colIndex, newValue, newValueID) {
          gridColumnAfterUpdate(index, rowIndex, colIndex, 0, newValue, newValueID);
        };

        // TODO: refactor promise is returned by this function
        //
        var wizHandlerGridColumnBeforeEdit = function(index, rowIndex, colIndex, keyAscii) {
          // TODO: investigate why it calls gridColumnEdit instead of gridBeforeColumnEdit()
          return gridColumnEdit(false, index, rowIndex, colIndex, keyAscii, 0, 0);
        };

        var wizHandlerGridColumnButtonClick = function(index, rowIndex, colIndex, keyAscii) {
          return gridColumnButtonClick(index, rowIndex, colIndex, keyAscii);
        };

        var wizHandlerGridDeleteRow = function(index, rowIndex) {
          return gridDeleteRow(index, rowIndex);
        };

        var wizHandlerGridNewRow = function(index, rowIndex) {
          gridNewRow(index, rowIndex);
        };

        var wizHandlerGridAfterDeleteRow = function(index, rowIndex) {
          gridAfterDeleteRow(index, rowIndex);
        };

        var wizHandlerGridSelectionChange = function(index, rowIndex, colIndex) {
          gridSelectionChange(index, rowIndex, colIndex, Dialogs.GridSelectChangeType.GRID_SELECTION_CHANGE);
        };

        var wizHandlerGridSelectionRowChange = function(index, rowIndex, colIndex) {
          gridSelectionChange(index, rowIndex, colIndex, Dialogs.GridSelectChangeType.GRID_ROW_CHANGE);
        };

        var wizHandlerGridValidateRow = function(index, rowIndex) {
          return gridValidateRow(index, rowIndex, true);
        };

        var wizHandlerSelectChange = function(index) {
          selectChange(index);
        };

        var wizHandlerMaskEditChange = function(index) {
          maskEditChange(index);
        };

        var wizHandlerDateChange = function(index) {
          dateChange(index);
        };

        var wizHandlerOptionButtonClick = function(index) {
          optionButtonClick(index);
        };

        var wizHandlerToolbarButtonClick = function(button) {
          toolBarButtonClick(button);
        };

        var wizHandlerTextChange = function(index) {
          try {
            textChange(index);
          }
          catch(e) {
            Cairo.manageError(
              "Update",
              "An error has occurred when updating a text input.",
              e.message);
          }
        };

        var wizHandlerTextAreaChange = function(index) {
          try {
            textAreaChange(index);
          }
          catch(e) {
            Cairo.manageError(
              "Edit",
              "An error has occurred when updating a text area.",
              e.message);
          }
        };

        var wizHandlerTextPasswordChange = function(index) {
          textPasswordChange(index);
        };

        //------------
        // Documentos
        var docHandlerComboChange = function(index) {
          comboChange(index);
        };

        var docHandlerCheckBoxClick = function(index) {
          checkBoxClick(index);
        };

        var formDocClose = function() {
          if(m_documentView !== null) {
            removeControl(m_documentView);
          }
        };

        // TODO: check where this functions is called and define if parameters cancel and unloadMode are needed
        //
        var docHandlerViewBeforeDestroy = function(cancel, unloadMode) {
          if(!m_isFooter && !m_isItems) {
            if(m_client !== null) {
              var view = getView();
              view.setCancelUnload(false);
              if(!saveChanges(true)) {
                view.setCancelUnload(true);
              }
            }
          }
        };

        // TODO: check where this functions is called and define if parameters cancel is needed
        //
        var docHandlerViewDestroy = function(cancel) {

          var view = getView();
          view.setUnloadCount(view.getUnloadCount() + 1);

          if(m_isFooter || m_isItems) {

            // only if the user didn't cancel the close tab or window action
            //
            if(!view.getCancelUnload()) {
              saveColumnsGrids();
              m_unloading = true;
              m_client = null;
            }
          }
          else {

            if(m_client !== null) {

              view.CancelUnload = false;

              saveColumnsGrids();
              m_unloading = true;

              m_client.terminate();
              m_client = null;
            }
          }

          // grids are destroyed only on footer because it the last to process the unload event
          //
          if(view.getUnloadCount() === 3) {
            destroyGrids(view);
          }

          m_documentView = null;
        };

        var docHandlerGridColumnButtonClick = function(index, rowIndex, colIndex, keyAscii) {
          return gridColumnButtonClick(index, rowIndex, colIndex, keyAscii);
        };

        var docHandlerGridColumnAfterEdit = function(index, rowIndex, colIndex, newValue, newValueID) {
          return gridColumnEdit(true, index, rowIndex, colIndex, 0, newValue, newValueID);
        };

        var docHandlerGridColumnAfterUpdate = function(index, rowIndex, colIndex, newValue, newValueID) {
          gridColumnAfterUpdate(index, rowIndex, colIndex, 0, newValue, newValueID);
        };

        // TODO: refactor promise is returned by this function
        //
        var docHandlerGridColumnBeforeEdit = function(index, rowIndex, colIndex, keyAscii) {
          if(gridColumnBeforeEdit(index, rowIndex, colIndex)) {
            return gridColumnEdit(false, index, rowIndex, colIndex, keyAscii, 0, 0);
          }
          else {
            return Cairo.Promises.resolvedPromise(false);
          }
        };

        var docHandlerGridDeleteRow = function(index, rowIndex) {
          return gridDeleteRow(index, rowIndex);
        };

        var docHandlerGridNewRow = function(index, rowIndex) {
          gridNewRow(index, rowIndex);
        };

        var docHandlerGridValidateRow = function(index, rowIndex) {
          return gridValidateRow(index, rowIndex, true);
        };

        var docHandlerGridSelectionChange = function(index, rowIndex, colIndex) {
          gridSelectionChange(index, rowIndex, colIndex, Dialogs.GridSelectChangeType.GRID_SELECTION_CHANGE);
        };

        var docHandlerGridSelectionRowChange = function(index, rowIndex, colIndex) {
          gridSelectionChange(index, rowIndex, colIndex, Dialogs.GridSelectChangeType.GRID_ROW_CHANGE);
        };

        var docHandlerSelectChange = function(index) {
          selectChange(index);
        };

        var docHandlerMaskEditChange = function(index) {
          maskEditChange(index);
        };

        var docHandlerDateChange = function(index) {
          dateChange(index);
        };

        var docHandlerOptionButtonClick = function(index) {
          optionButtonClick(index);
        };

        var docHandlerTextChange = function(index) {
          textChange(index);
        };

        var docHandlerTextAreaChange = function(index) {
          textAreaChange(index);
        };

        var docHandlerTextPasswordChange = function(index) {
          textPasswordChange(index);
        };

        // funciones del objeto
        var comboChange = function(index) {
          propertyHasChanged(Dialogs.PropertyType.list, index, getView().combos.get(index));
        };

        var checkBoxClick = function(index) {
          propertyHasChanged(Dialogs.PropertyType.check, index, getView().checkBoxes().get(index));
        };

        var gridDeleteRow = function(index, rowIndex) {
          var p = null;
          try {
            if(m_clientManageGrid) {

              var property = getProperty(Dialogs.PropertyType.grid, index, 0);

              if(property !== null) {
                p = m_client.deleteRow(getPropertyKey(property), createRow(index, property, rowIndex), rowIndex).then(
                  function(success) {
                    if(success) {
                      property.getGrid().getRows().remove(rowIndex);
                      return m_client.messageEx(Dialogs.Message.MSG_GRID_ROW_DELETED, property.getKey()).then(
                        function() {
                          var grid = getView().getGrids().get(property.getIndex());
                          if(grid.getRows().count() <= 1) {
                            grid.getRows().setCount(2);
                          }
                          return true;
                        }
                      );
                    }
                    else
                      return false;
                  }
                );
              }
            }
          }
          catch(e) {
            Cairo.manageError(
              "Delete a row",
              "An error has occurred when deleting a row in a grid.",
              e.message);
          }
          return (p || Cairo.Promises.resolvedPromise(false));
        };

        var gridAfterDeleteRow = function(index, rowIndex) {
          var property = getProperty(Dialogs.PropertyType.grid, index, 0);
          refreshRowsIndex(property, rowIndex);
          var grid = getView().getGrids().get(index);
          if(grid.getRows().count() < 1) {
            grid.getRows.add();
          }
        };

        var refreshRowsIndex = function(property, rowIndex) {
          try {

            var count = property.getGrid().getRows().count();
            for(rowIndex = rowIndex; rowIndex < count; rowIndex++) {
              self.showCellValue(property, rowIndex, 1);
            }

            var grid = property.getControl();
            if(rowIndex <= grid.getRows().count()) {
              grid.Cell(rowIndex, 1).getText() === rowIndex;
            }

          }
          catch(ignore) {}
        };

        var setRowBackground = function(index, property, rowIndex, colIndex) {
          try {
            var grid = getView().getGrids().get(index);
            if(property.getGrid().getColumns(colIndex).getType() === Dialogs.PropertyType.grid) {
              grid.selectRow(rowIndex);
            }
            else {
              grid.unSelectRow();
            }
          }
          catch(ignore) {}
        };

        var gridSelectionChange = function(index, rowIndex, colIndex, what) {
          var property = getProperty(Dialogs.PropertyType.grid, index, 0);

          if(property !== null) {
            property.setSelectedRow(rowIndex);

            if(what === Dialogs.GridSelectChangeType.GRID_SELECTION_CHANGE) {
              setRowBackground(index, property, rowIndex, colIndex);
            }
            else if(what === Dialogs.GridSelectChangeType.GRID_ROW_CHANGE) {
              if(m_client !== null) {
                m_client.messageEx(Dialogs.Message.MSG_GRID_ROW_CHANGE, property);
              }
            }
          }
        };

        var gridNewRow = function(index, rowIndex) {
          if(m_clientManageGrid) {
            var property = getProperty(Dialogs.PropertyType.grid, index, 0);
            if(property !== null) {
              m_client.newRow(getPropertyKey(property), rowIndex).then(
                function(rowIndex) {
                  setDefaults(property, rowIndex);
                }
              );
            }
          }
        };

        var setDefaults = function(property, rowIndex) {

          var row = createRow(property.getIndex(), property, rowIndex);
          row.get(1).setValue(property.getGrid().getRows().count() + 1);

          var colIndex = 0;
          var columnsCount = property.getGrid().getColumns().count();
          for(var _i = 0; _i < columnsCount; _i++) {
            var col = property.getGrid().getColumns().get(_i);
            colIndex = colIndex + 1;
            if(col.getDefaultValue() !== null) {
              var cell = row.get(colIndex);
              cell.setId(col.getDefaultValue().getId());
              cell.setValue(col.getDefaultValue().getValue());
            }
          }

          if(row !== null) {
            var grid = getView().getGrids().get(property.getIndex());
            m_gridManager.loadFromRow(grid, row, rowIndex, property.getGrid().getColumns());
          }
        };

        var gridColumnAfterUpdate = function(index, rowIndex, colIndex, keyAscii, newValue, newValueID) {
          try {

            if(m_clientManageGrid) {

              var property = getProperty(Dialogs.PropertyType.grid, index, 0);

              if(property !== null) {

                var propertyKey = getPropertyKey(property);

                // If the row not exists we have to create it because the client need it to hold
                // calculated data
                createRowIfNotExists(property, index, rowIndex);

                setColumnValueInProperty(property, index, rowIndex, colIndex, newValue, newValueID);

                // Multi
                // if virtual rows were not created in this call
                // we update the grid
                //
                processVirtualRow(property, index, rowIndex, colIndex, propertyKey).then(
                  function(result) {
                    var p = null;

                    if(result) {
                      // Let client one chance to calculate columns
                      p = m_client.columnAfterUpdate(propertyKey, rowIndex, colIndex).then(
                        function() {
                          setRowValueInGrid(index, property, rowIndex, property.getGrid().getRows(rowIndex));
                        }
                      );
                    }

                    p = p || Cairo.Promises.resolvedPromise();

                    p.then(
                      function() {
                        if(columnIsEditable(property, colIndex)) {
                          self.setChanged(true);
                        }
                      }
                    );
                  }
                );
              }
            }
          }
          catch(e) {
            Cairo.manageError(
              "Edit",
              "An error has occurred after editing in a grid.",
              e.message);
          }
        };

        var columnIsEditable = function(property, colIndex) {
          return property.getGrid().getColumns().get(colIndex).getColumnIsEditable();
        };

        var processVirtualRow = function(property, index, rowIndex, colIndex, propertyKey) {

          return addVirtualRows(getPropertyKey(property), rowIndex, colIndex).then(
            function(info) {
              if(info.success) {
                return false;
              }
              else {
                var n = property.getGrid().getRows().count();

                property.getControl().getRows().setCount(n + info.getRowsToAdd());

                var rowsToAdd = n + info.getRowsToAdd();

                var colAmount = getColIndexFromKey(property, info.getColAmount());
                var q = 0;

                for(var i = n; i < rowsToAdd; i++) {
                  q = q + 1;
                  gridNewRow(index, i);
                  createRowIfNotExists(property, index, i);

                  if(i < rowsToAdd) {
                    setColumnValueInProperty(property, index, i, colIndex, info.getNewValue(q), Cairo.Util.val(info.getNewId(q)));

                    m_client.columnAfterEdit(propertyKey, i, colIndex, info.getNewValue(q), Cairo.Util.val(info.getNewId(q)));

                    // Let client one chance to calculate columns
                    m_client.columnAfterUpdate(propertyKey, i, colIndex);

                    if(colAmount > 0) {
                      setColumnValueInProperty(property, index, i, colAmount, info.getNewAmount(q), 0);

                      m_client.columnAfterEdit(propertyKey, i, colAmount, info.getNewAmount(q), 0);

                      // Let client one chance to calculate columns
                      m_client.columnAfterUpdate(propertyKey, i, colAmount);
                    }
                  }

                  setRowValueInGrid(index, property, i, property.getGrid().getRows(i));
                }
                return true;
              }
            }
          );
        };

        var addVirtualRows = function(key, rowIndex, colIndex) {
          if(m_client === null) {
            return Cairo.Promises.resolvedPromise(new Cairo.Dialogs.Grids.VirtualRow({
              result: false,
              info: null,
              rowsToAdd: 0
            }));
          }
          else {
            var info = {
              key: key,
              row: rowIndex,
              col: colIndex
            };

            return m_client.messageEx(Dialogs.Message.MSG_GRID_VIRTUAL_ROW, info);
          }
        };

        // TODO: check uses of this function to refactor _cancel_
        //
        var gridColumnBeforeEdit = function(index, rowIndex, colIndex) {
          var cancel = true;
          try {

            if(m_clientManageGrid) {

              var property = getProperty(Dialogs.PropertyType.grid, index, 0);

              if(property !== null) {
                if(rowIndex > property.getGrid().getRows().count()) {

                  var column = property.getGrid().getColumns().get(colIndex);
                  var col = getView().getGrids().get(property.getIndex()).getColumns().get(colIndex);
                  var cell = property.getGrid().getRows().get(rowIndex).get(colIndex);
                  var format = cell.getFormat();

                  if(format === null) {
                    col.setType(column.getType());
                    col.setSubType(column.getSubType());
                    col.setTable(column.getSelectTable());
                    col.setEditEnabled(column.getEnabled());
                    col.setEnabled(column.getEnabled());
                    col.setSelectFilter(column.getSelectFilter());
                    col.setSize(column.getSize());
                    col.setFormat(column.getFormat());

                    if(column.getType() === Dialogs.PropertyType.list) {
                      col.setList(column.getList());
                    }
                    else {
                      col.setList(null);
                    }

                    if(column.getSubType() === Dialogs.PropertySubType.percentage) {
                      if(column.getFormat() === "") {
                        col.setFormat("0.00 %");
                      }
                    }
                  }
                  else {
                    col.setType(format.getType());
                    col.setSubType(format.getSubType());
                    col.setTable(format.getSelectTable());
                    col.setEditEnabled(format.getEnabled());
                    col.setEnabled(format.getEnabled());
                    col.setSelectFilter(format.getSelectFilter());
                    col.setSize(format.getSize());
                    col.setFormat(format.getFormat());

                    if(format.getType() === Dialogs.PropertyType.list) {
                      col.setList(format.getList());
                    }
                    else {
                      col.setList(null);
                    }

                    if(format.getSubType() === Dialogs.PropertySubType.percentage) {
                      if(format.getFormat() === "") {
                        col.setFormat("0.00 %");
                      }
                    }
                  }
                  cancel = col.getEnabled() && col.getEditEnabled();
                }
              }
            }
          }
          catch(e) {
            Cairo.manageError(
              "Edit",
              "An error has occurred before editing in a grid.",
              e.message);
          }
          return !cancel;
        };

        var gridColumnEdit = function(after, index, rowIndex, colIndex, keyAscii, newValue, newValueID) {
          var p = null;
          try {

            if(m_clientManageGrid) {

              var property = getProperty(Dialogs.PropertyType.grid, index, 0);

              if(property !== null) {

                var propertyKey = getPropertyKey(property);

                if(after) {

                  // If the row doesn't exists we have to create it because the client need it to hold
                  // calculated data
                  createRowIfNotExists(property, index, rowIndex);

                  p = m_client.columnAfterEdit(propertyKey, rowIndex, colIndex, newValue, newValueID);
                }
                else {

                  if(m_createRowInBeforeEdit) {
                    // If the row doesn't exists we have to create it because the client need it to hold
                    // calculated data
                    createRowIfNotExists(property, index, rowIndex);
                  }

                  p = m_client.columnBeforeEdit(propertyKey, rowIndex, colIndex, keyAscii);
                }
              }
            }
          }
          catch(e) {
            Cairo.manageError(
              "Edit",
              "An error has occurred when editing in a grid.",
              e.message);
          }
          return (p || Cairo.Promises.resolvedPromise(false));
        };

        // TODO: refactor promise is returned by this function
        //
        // TODO: check that the code which calls this function uses
        //       the return value to determine if the button click must
        //       by handle by the caller
        //
        // this function is returning true to indicate the button
        // has to be handle by the grid (calculator in numeric columns, date picker in date columns, etc)
        // and false is returned when the event has ben handle by m_client or by
        // this function (when column.subType == textButtonEx)
        //
        var gridColumnButtonClick = function(index, rowIndex, colIndex, keyAscii) {
          var p = null;
          try {

            if(m_clientManageGrid) {

              var property = getProperty(Dialogs.PropertyType.grid, index, 0);

              if(property !== null) {

                var propertyKey = getPropertyKey(property);
                m_client = m_client;

                // If the row not exists we have to create it because the client need it to hold
                // calculated data
                createRowIfNotExists(property, index, rowIndex);

                p = m_client.columnButtonClick(propertyKey, rowIndex, colIndex, keyAscii).then(
                  function(mustHandleEvent) {
                    var p = null;
                    var grid = property.getGrid();

                    //
                    // the mustHandleEvent is passed to the grid to inform that the client has handled the button
                    // this code is executed either mustHandleEvent == true or false
                    //
                    var updateCell = function() {
                      setRowValueInGrid(index, property, rowIndex, grid.getRows(rowIndex));
                      self.setChanged(true);
                    };

                    if(mustHandleEvent) {
                      // if this column's type is textButtonEx we show the input text dialog
                      //
                      if(grid.getColumns().get(colIndex).getSubType() === Dialogs.PropertyType.textButtonEx) {
                        var cell = grid.getRows().get(rowIndex).get(colIndex);
                        p = Cairo.Modal.inputFormView("", "", cell.getValue()).then(
                          function(text) {
                            cell.setValue(text);
                            updateCell();
                            return false;
                          },
                          function() {
                            updateCell();
                            return false;
                          }
                        );
                      }
                      else {
                        updateCell();
                      }
                    }
                    else {
                      updateCell();
                    }

                    return (p || Cairo.Promises.resolvedPromise(mustHandleEvent));
                  }
                );
              }
            }
          }
          catch(e) {
            Cairo.manageError(
              "Edit",
              "An error has occurred when editing in a grid.",
              e.message);
          }
          return (p || Cairo.Promises.resolvedPromise(false));
        };

        var createRowIfNotExists = function(property, index, rowIndex) {
          var rows = property.getGrid().getRows();
          var row = rows.get(rowIndex);
          if(row === null) {
            row = createRow(index, property, rowIndex);
            rows.add(row);
          }
        };

        var getColIndexFromKey = function(property, lKey) {
          var colIndex = -1;
          if(lKey !== -1) {
            var row = property.getGrid().getRows().get(1);
            if(row !== null) {
              var rowCount = row.count();
              for(var i = 1; i <= rowCount; i++) {
                var cell = row.get(i);
                if(cell.getKey() === lKey) {
                  colIndex = i;
                  break;
                }
              }
            }
          }
          return colIndex;
        };

        var setColumnValueInProperty = function(property, index, rowIndex, colIndex, newValue, newValueID) {
          var rows = property.getGrid().getRows();
          var row = rows.get(rowIndex);

          if(row === null) {
            row = createRow(index, property, rowIndex);
            rows.add(row);
          }

          var cell = row.get(colIndex);

          Cairo.safeExecute(function() {
            cell.setId(newValueID);
            cell.setValue(newValue);
            cell.setSelectIntValue(property.getControl().cell(rowIndex, colIndex).getTag());
          });
        };

        // TODO: refactor promise is returned by this function
        //
        var gridValidateRow = function(index, rowIndex, bAddRow) {
          var p = null;

          if(m_clientManageGrid) {

            var property = getProperty(Dialogs.PropertyType.grid, index, 0);

            if(property !== null) {

              var propertyKey = getPropertyKey(property);
              var row = createRow(index, property, rowIndex);

              p = m_client.isEmptyRow(propertyKey, row, rowIndex).then(
                function(isEmpty) {

                  if(isEmpty) {
                    Cairo.Util.sendKeys("{TAB}");
                    return {
                      cancel:  true,
                      isEmpty: true,
                      isValid: true // empty rows are valid
                    };
                  }
                  else {
                    //
                    // let the client one chance to validate and modify row values
                    //
                    return m_client.validateRow(propertyKey, row, rowIndex).then(
                      function(isValid) {
                        if(isValid) {
                          return {
                            cancel:  true,
                            isEmpty: false,
                            isValid: false // m_client set this row as invalid
                          };
                        }
                        else {

                          // put client's values into the grid
                          setRowValueInGrid(index, property, rowIndex, row);

                          if(bAddRow) {
                            var rows = property.getGrid().getRows();
                            rows.remove(rowIndex, false);
                            row.setIndex(rowIndex);
                            rows.add(row);

                            if(!row.get(Dialogs.Constants.keyRowItem) === null) {
                              row.get(Dialogs.Constants.keyRowItem).setValue(rowIndex);
                            }

                            return {
                              cancel:  !property.getGridAddEnabled(),
                              isEmpty: false,
                              isValid: true
                            };
                          }
                          else {
                            return {
                              cancel:  true,
                              isEmpty: true,
                              isValid: true // empty rows are valid
                            };
                          }
                        }
                      }
                    );
                  }
                }
              );
            }
          }

          return (p || Cairo.Promises.resolvedPromise({
            cancel:  true,
            isEmpty: false,
            isValid: false
          }));
        };

        var selectChange = function(index) {
          propertyHasChanged(Dialogs.PropertyType.select, index, getView().getSelects().get(index));
        };

        var maskEditChange = function(index) {
          propertyHasChanged(Dialogs.PropertyType.numeric, index, getView().getMaskEdits().get(index));
        };

        var dateChange = function(index) {
          var c = getView().getDatePickers().get(index);
          if(c.getType() === Dialogs.PropertyType.time) {
            propertyHasChanged(Dialogs.PropertyType.time, index, c);
          }
          else {
            propertyHasChanged(Dialogs.PropertyType.date, index, c);
          }
        };

        var optionButtonClick = function(index) {
          propertyHasChanged(Dialogs.PropertyType.option, index, getView().getOptionButtons().get(index));
        };

        var textButtonClick = function(index) {
          var p = null;
          var property = getProperty(Dialogs.PropertyType.text, index, 0);

          if(property !== null) {

            p = m_client.messageEx(Dialogs.Message.MSG_BUTTON_TEXT_CLICK, property).then(
              function() {

                if(property.getSubType() === Dialogs.PropertyType.textButtonEx) {
                  var c = getView().getTextInputs().get(index);
                  return Cairo.Modal.inputFormView("", "", c.getText()).then(
                    function(text) {
                      c.setText(text);
                    }
                  );
                }
              }
            );
          }
          return (p || Cairo.Promises.resolvedPromise());
        };

        var toolBarButtonClick = function(button) {
          propertyHasChanged(Dialogs.PropertyType.toolbar, 0, button);
        };

        var textChange = function(index) {
          propertyHasChanged(Dialogs.PropertyType.text, index, getView().getTextInputs().get(index));
        };

        var textAreaChange = function(index) {
          propertyHasChanged(Dialogs.PropertyType.text, index, getView().getTextAreas().get(index), false, Dialogs.PropertySubType.memo);
        };

        var textPasswordChange = function(index) {
          propertyHasChanged(Dialogs.PropertyType.password, index, getView().getPasswordInputs().get(index));
        };

        // TODO: refactor all calls to this function should be replace by property.getKey() it is legacy from vb6 interfaces :P
        var getPropertyKey = function(property) {
          return property.getKey();
        };

        var getKeyFromRowValue = function(rows, rowIndex, colIndex) {
          var key = "";
          if(rows.count() >= rowIndex && rows.get(rowIndex).count() >= colIndex) {
            var cell = rows.get(rowIndex).get(colIndex);
            if(cell !== null) {
              key = cell.getKey();
            }
          }
          return key;
        };

        var createRow = function(index, property, rowIndex) {
          var colIndex = 0;
          var row = new Cairo.Controls.Grids.Row();
          var cell = null;

          var count = property.getGrid().getColumns().count();
          for(var _i = 0; _i < count; _i++) {

            var col = property.getGrid().getColumns().get(_i);
            colIndex = colIndex + 1;
            if(colIndex === 1) {
              cell = row.add(null, Dialogs.Constants.keyRowItem);
            }
            else {
              var key = getKeyFromRowValue(property.getGrid().getRows(), rowIndex, colIndex);
              if(key !== "") {
                cell = row.add(null, key);
              }
              else {
                cell = row.add(null);
              }
            }

            var gridCell = getView().getGrids().get(index).cell(rowIndex, colIndex);
            cell.Id = gridCell.getItemData();
            cell.setSelectIntValue(gridCell.getTag());

            if(col.getType() === Dialogs.PropertyType.date) {
              cell.setValue(Cairo.Util.getDateValueFromGrid(gridCell.getText()));
            }
            else if(col.getSubType() === Dialogs.PropertySubType.percentage) {
              cell.setValue(Cairo.Util.val(gridCell.getText())) * 100;
            }
            else {
              cell.setValue(gridCell.getText());
            }
            cell.Key = col.Key;
          }

          return row;
        };

        var setRowValueInGrid = function(index, property, rowIndex, row) {
          var colIndex = 0;
          var grid = getView().getGrids().get(index);

          grid.setRowBackColor(rowIndex, row.getBackColor());
          grid.setRowForeColor(rowIndex, row.getForeColor());

          for(var _i = 0; _i < property.getGrid().getColumns().count(); _i++) {
            var col = property.getGrid().getColumns().get(_i);
            colIndex = colIndex + 1;
            var cell = row.get(colIndex);

            var gridCell = grid.Cell(rowIndex, colIndex);
            gridCell.setItemData(cell.getId());

            if(col.getType() === Dialogs.PropertyType.date) {
              gridCell.setText(Cairo.Util.getDateValueForGrid(cell.getValue()));
            }
            else if(col.getSubType() === Dialogs.PropertySubType.percentage) {
              gridCell.setText(Cairo.Util.val(cell.getValue()) / 100);
            }
            else {
              gridCell.setText(cell.getValue());
            }

            // cell format
            //
            var format = cell.getFormat();
            if(format !== null) {

              if(!format.getEnabled() || !col.getEnabled()) {
                gridCell.setBackColor(Dialogs.Colors.buttonFace);
                format.setBold(true);
              }
              else {
                gridCell.setBackColor(format.getBackColor());
              }

              gridCell.setForeColor(format.getColor());
              gridCell.setTextAlign(format.getTextAlign());

              var font = {
                name:           format.getFontName(),
                italic:         format.getItalic(),
                bold:           format.getBold(),
                size:           format.getFontSize(),
                strikethrough:  format.getStrike(),
                underline:      format.getUnderline()
              };

              gridCell.setFont(font);
            }
            else {

              if(!col.getEnabled() && !m_noChangeBackColorCell) {
                gridCell.setBackColor(Dialogs.Colors.buttonFace);
              }
            }
          }
        };

        var showView = function(tabIndex, noGrids, bSetFocus) {
          var tabs = 0;
          var property = null;

          m_labelLeft = C_OFFSET_H;

          var propertyCount = m_properties.count();
          for(var _i = 0; _i < propertyCount; _i++) {
            property = m_properties.get(_i);
            if(getTabIndex(property) > tabs) {
              tabs = getTabIndex(property);
            }
          }

          showTabs(tabs);

          m_showingForm = true;
          m_tabIndex = 0;

          for(var _i = 0; _i < propertyCount; _i++) {
            property = m_properties.get(_i);
            self.loadControlEx(property, noGrids);
          }

          m_showingForm = false;

          var view = getView();

          var count = view.getControls().count();

          if(!m_isDocument) {
            if(m_isWizard) {
              view.getNextButton().setTabIndex(count);
              view.getCancelButton().setTabIndex(count);
              view.getBackButton().setTabIndex(count);
            }
            else {
              view.getSaveButton().setTabIndex(count);
              view.getCancelButton().setTabIndex(count);
              view.getCloseButton().setTabIndex(count);
            }
          }

          if(tabIndex !== -1) {
            if(m_isDocument) {
              docTabClickEx(Cairo.Constants.DocumentSections.items, tabIndex);
              docTabClickEx(Cairo.Constants.DocumentSections.footer, tabIndex);
              docTabClickEx(Cairo.Constants.DocumentSections.header, tabIndex);
              view.getTabs().get(tabIndex + m_firstTab).setTabSelected(true);
            }
            else {
              self.tabClick(tabIndex);
              view.getTabs().get(tabIndex).setTabSelected(true);
            }
          }

          if(bSetFocus) {
            view.setFocusFirstControl();
          }
        };

        var loadControl = function(property) {

          var nTabIndex = getTabIndex(property);
          var view = getView();
          var controlType = property.getType();
          var subType = property.getSubType();

          var c = addControl(controlType, subType);

          switch(controlType) {

            case Dialogs.PropertyType.select:

              c.setSelectType(property.getSelectType());
              c.setSelectNoUseActive(property.getSelectNoUseActive());
              c.setTable(property.getSelectTable());
              c.reset();
              setFont(c, property);
              break;

            case Dialogs.PropertyType.numeric:

              c.setType(subType);
              if(subType === 0) {
                Cairo.raiseError("Dialogs.loadControl", "subType wasn't set for property: " + property.getName());
              }

              if(m_isFooter) {
                c.setWidth(1100);
                c.setBackColor(view.getFooterBackground().getBackColor());
                c.setEnabledNoChangeBkColor(true);
              }
              setFont(c, property);
              c.setFormatNumber(property.getFormat());
              break;

            case Dialogs.PropertyType.date:
            case Dialogs.PropertyType.time:

              c.setType(controlType);
              setFont(c, property);
              break;

            case Dialogs.PropertyType.option:

              c.setOptionGroup(property.getOptionGroup());
              break;

            case Dialogs.PropertyType.label:

              setFont(c, property);
              if(property.getBackColor() !== -1) {
                c.setBackStyle(Dialogs.BackgroundType.opaque);
              }
              else {
                c.setBackStyle(Dialogs.BackgroundType.transparent);
              }
              c.setTextAlign(property.getTextAlign());
              break;

            // this is here to avoid confuse someone reading the code and thinking we forgot this type
            //
            // case Dialogs.PropertyType.progressBar:
            // case Dialogs.PropertyType.image:

              // nothing to do :D
              //break;

            case Dialogs.PropertyType.title:
            case Dialogs.PropertyType.list:
            case Dialogs.PropertyType.description:
            case Dialogs.PropertyType.button:

              setFont(c, property);
              break;

            case Dialogs.PropertyType.text:

              if(subType !== Dialogs.PropertyType.memo) {
                if(c.getMask() !== "") {
                  var buttonStyle = subType === Dialogs.PropertyType.textButton || subType === Dialogs.PropertyType.textButtonEx;
                  buttonStyle = buttonStyle ? Dialogs.ButtonStyle.single : Dialogs.ButtonStyle.none;
                  c.setButtonStyle(buttonStyle);
                  c.setMask(property.getTextMask());
                  c.setType(Dialogs.PropertyType.text);
                }
                c.setPasswordChar("");
              }

              c.setMaxLength(property.getSize());
              c.setTextAlign(property.getTextAlign());

              // to allow disbled text areas which allow using
              // arrow keys to scroll content but not allow edition
              //
              c.setInputDisabled(property.getInputDisabled());

              setFont(c, property);
              break;

            case Dialogs.PropertyType.file:

              c.setMaxLength(property.getSize());
              c.setType(Dialogs.PropertyType.file);
              c.setFileFilter(property.getSelectFilter());
              c.setPasswordChar("");
              setFont(c, property);
              break;

            case Dialogs.PropertyType.folder:

              c.setMaxLength(property.getSize());
              c.setType(Dialogs.PropertyType.folder);
              c.setPasswordChar("");
              setFont(c, property);
              break;

            case Dialogs.PropertyType.password:

              c.setButtonStyle(Dialogs.ButtonStyle.none);
              c.setPasswordChar("*");
              setFont(c, property);
              break;

            case Dialogs.PropertyType.check:

              c.setWidth(400);
              break;

            case Dialogs.PropertyType.grid:

              c.setEnabled(property.getGridEditEnabled());
              m_gridManager.setProperties(c);

              var grid = property.getGrid();
              c.setNoSelectInGotFocus(grid.getNoSelectInGotFocus());
              c.setRowMode(grid.getRowMode());
              break;

            case Dialogs.PropertyType.toolbar:

              c.setTop(0);
              c.setLeft(0);
              property.setToolbar(c);
              break;
          }

          if(property.getType() !== Dialogs.PropertyType.toolbar) {
            property.setIndex(c.getIndex());
          }

          pSetTabIndex(c);
          m_tabIndex += 1;

          property.setControl(c);

          // apply custom setings
          //
          if(property.getHeight() > 0) {
            c.setHeight(property.getHeight());
          }

          if(property.getWidth() > 0) {
            c.setWidth(property.getWidth());
          }

          // top from property
          //
          if(property.getTopFromProperty() !== "") {
            //
            // update m_lastTop to be able to use
            // topFromProperty and topToPrevious in the same call
            //
            m_lastTop = m_properties.get(property.getTopFromProperty()).getTop();
            property.setTop(m_lastTop);
          }

          // top to previous
          //
          if(property.getTopToPrevious() !== 0) {

            if(property.getType() === Dialogs.PropertyType.option) {
              m_lastTop = m_lastTopOp;
            }

            // topToPrevious == 1 means same top than previous control
            //
            if(property.getTopToPrevious() === -1) {
              property.setTop(m_lastTop);
            }
            else {
              property.setTop(m_lastTop + property.getTopToPrevious());
            }
          }

          // the client set a fixed top
          //
          if(property.getTop() !== -1) {
            c.setTop(property.getTop());
          }

          // left from property
          //
          if(property.getLeftFromProperty() !== "") {

            // update m_lastLeft to be able to use
            // leftFromProperty and leftToPrevious in the same call
            //
            m_lastLeft = m_properties.get(property.getLeftFromProperty()).getLeft();
            property.setLeft(m_lastLeft);

            // if left is set but the client but the label'left hasn't be defined
            // we use the default left
            //
            if(property.getLeftLabel() === 0) {
              property.setLeftLabel(-C_OFFSET_H);
            }
          }

          // left to previous
          //
          if(property.getLeftToPrevious() !== 0) {

            if(property.getType() === Dialogs.PropertyType.option) {
              m_lastLeft = m_lastLeftOp;
            }

            // leftToPrevious == 1 means same left than previous control
            //
            if(property.getLeftToPrevious() === -1) {
              property.setLeft(m_lastLeft);
            }
            else {
              property.setLeft(m_lastLeft + property.getLeftToPrevious());
            }
          }

          if(property.getLeft() !== -1) {
            // if left is set but the client but the label'left hasn't be defined
            // we use the default left
            //
            if(property.getLeftLabel() === 0) {
              property.setLeftLabel(-C_OFFSET_H);
            }

            c.setLeft(property.Left);
          }

          //
          // if the control is going to be placed over the bottom
          // line it is moved to the top in the next column
          //

          var view = getView();

          if(m_isItems) {

            var tabs = view.getTabItems();
            if(m_nextTop[nTabIndex] + c.getHeight() > tabs.getTop() + tabs.getHeight() - 50) {
              setNewTopAndLeft(property);
            }
          }
          else if(m_isFooter) {

            var footerTab = view.getTabFooter();
            if(m_nextTop[nTabIndex] + c.getHeight() > footerTab.getTop() + footerTab.getHeight()) {
              setNewTopAndLeft(property);
            }
          }
          else {
            if(m_nextTop[nTabIndex] + c.getHeight() + C_LINE_LIGHT + 50 > view.getBottomLine().getTop()) {
              setNewTopAndLeft(property);
            }
          }

          if(m_isDocument) {
            if(m_isItems) {
              c.setTag(Cairo.Constants.DocumentSections.items + property.getTabIndex().toString());
            }
            else if(m_isFooter) {
              c.setTag(Cairo.Constants.DocumentSections.footer + property.getTabIndex().toString());
            }
            else {
              c.setTag(Cairo.Constants.DocumentSections.header + property.getTabIndex().toString());
            }
          }
          else {
            if(property.getTabIndex()) {
              c.setTag(property.getTabIndex());
            }
            else {
              c.setTag(property.getTabIndex());
            }
          }

          c.setEnabled(property.getEnabled());
          setBackColor(c, property);
          setButton(c, property);

          if(property.getType() === Dialogs.PropertyType.option) {
            var r = 0;
            var q = 0;
            if(property.getOptionGroup() - 1 > m_leftOp.length) {
              r = m_leftOp.length;
              var view = getView();
              for(q = r; q <= m_leftOp.length; q++) {
                m_leftOp[q] = view.getOptionButtons().get(0).getLeft();
              }
            }
            if(property.getOptionGroup() - 1 > m_nextTopOp.length) {
              r = m_nextTopOp.length;
              var view = getView();
              for(q = r; q <= m_nextTopOp.length; q++) {
                m_nextTopOp[q] = view.getOptionButtons().get(0).getTop();
              }
            }

            if(property.getLeft() === -1) {
              c.setLeft(m_leftOp[property.getOptionGroup()]);
            }
            if(property.getTop() === -1) {
              c.setTop(m_nextTopOp[property.getOptionGroup()]);
            }
            if(property.getWidth() === 0) {
              c.setWidth(1500);
            }
            c.setText(property.getName());

            // TODO: implement a main frame (it doesn't need to be a dom element)
            var f = null;

            // increase the with of this tab
            //
            if(c.getTop() + c.getHeight() > f.getHeight()) {
              f.setHeight(c.getTop() + c.getHeight() + 50);
            }

            if(f.getHeight() + f.getTop() > getView().getBottomLine().getTop()) {
              f.setTop(m_nextTop[nTabIndex] - 100);
              f.setLeft(m_left[nTabIndex]);
            }

            if(c.getLeft() + c.getWidth() > f.getWidth()) {
              f.setWidth(c.getLeft() + c.getWidth() + 20);
            }

            if(property.getTopFrame() !== 0) {
              f.setTop(property.getTopFrame());
            }
            if(property.getLeftFrame() !== 0) {
              f.setLeft(property.getLeftFrame());
            }

            m_nextTopOp[property.getOptionGroup()] = m_nextTopOp[property.getOptionGroup()] + C_LINE_HEIGHT;
          }
          else if(property.getType() === Dialogs.PropertyType.toolbar) {

            // TODO: implement frameToolbar
            //
            var frameToolbar = null;
            frameToolbar.setWidth(property.getWidth());
            frameToolbar.setTop(property.getTopFrame());
            frameToolbar.setLeft(property.getLeftFrame());
            if(property.getHeight() > 0) {
              frameToolbar.setHeight(property.getHeight());
            }
            else {
              frameToolbar.setHeight(c.getHeight());
            }
            frameToolbar.setTag(property.getTabIndex());
            frameToolbar.setBackColor(getView().getBackground().getBackColor());

            setToolbar(tbl, property.getButtons());

            property.setLeftNotChange(true);
            property.setTopNotChange(true);

          }
          else if(property.getType() === Dialogs.PropertyType.label
                  || property.getType() === Dialogs.PropertyType.title
                  || property.getType() === Dialogs.PropertyType.description) {

            if(property.getTop() === -1) {
              c.setTop(m_nextTop[nTabIndex]);
            }

            if(property.getLeft() === -1) {
              c.setLeft(m_left[nTabIndex] + m_labelLeft);
            }
          }
          else {

            var label = addControl(Dialogs.PropertyType.controlLabel);

            property.setLabelIndex(label.getIndex());
            label.setText(property.getName());
            label.setLeft(m_left[nTabIndex]);
            label.setBackStyle(Dialogs.BackgroundType.transparent);
            label.setTag(c.getTag());
            label.bringToFront();
            if(property.getType() === Dialogs.PropertyType.button) {
              label.setVisible(false);
            }

            // hide labels for grids, buttons and images
            //
            if(property.getLeftLabel() === -1) {
              label.setVisible(false);
              // labels with tag == -1 aren't modified by showValue
              label.setTag("-1");
            }

            // special formats for grids
            //
            if(property.getType() === Dialogs.PropertyType.grid) {
              if(property.getLeft() === -1) {
                c.setLeft(m_left[nTabIndex]);
              }

              if(m_isItems) {
                c.setTop(m_nextTop[nTabIndex]);
                label.setVisible(false);
                // labels with tag == -1 aren't modified by showValue
                label.setTag("-1");
              }
              else {
                if(property.getTop() === 0) {
                  c.setTop(m_nextTop[nTabIndex] + 300);
                  label.setTop(m_nextTop[nTabIndex]);
                  label.setWidth(c.getWidth());
                }
              }
              if(property.getWidth() === -1 || property.getWidth() === 0) {
                c.setWidth(getView().getWidth() - c.getLeft() - 300);
              }

            }
            else if(m_isDocument && property.getSelectTable() === Cairo.Tables.DOCUMENTO) {

              c.setLeft(3600);
              c.setTop(80);
              c.setWidth(3500);
              c.setFontSize(11);
              c.setFontBold(true);
              c.setHeight(330);
              c.setTag("");
              c.setBorderColor(Dialogs.Colors.buttonFace);

              label.setVisible(false);
              label.setTag("-1");
            }
            else if(m_isDocument && (property.getKeyCol() === Cairo.Constants.NUMBER_ID || property.getKeyCol() === Cairo.Constants.STATUS_ID)) {

              if(property.getKeyCol() === Cairo.Constants.NUMBER_ID) {
                c.setLeft(7300);
                c.setWidth(1200);
              }
              else {
                c.setLeft(8700);
                c.setWidth(3000);
              }
              c.setTop(80);
              c.setFontSize(11);
              c.setFontBold(true);
              c.setHeight(330);
              c.setEnabledNoChangeBkColor(true);
              c.setForeColor(Dialogs.Colors.white);
              c.setBackColor(Dialogs.Colors.buttonShadow);
              c.setBorderColor(Dialogs.Colors.buttonFace);
              label.setVisible(false);
              label.setTag("-1");
              c.setTag("");

            }
            else {

              if(property.getTop() !== -1) {
                label.setTop(property.getTop());
              }
              else {
                // optionGroup is used to define an offeset
                // when the property type !==  option
                // allows a fine control over the label position
                // ugly but legacy.
                // TODO: fixme. use a new field like labelOffset or similar
                //
                label.setTop(m_nextTop[nTabIndex] + property.getOptionGroup());
                c.setTop(m_nextTop[nTabIndex] + property.getOptionGroup());
              }

              switch(property.getType()) {
                case Dialogs.PropertyType.date:
                  c.setWidth(1400);
                  break;
                case Dialogs.PropertyType.time:
                  c.setWidth(800);
                  break;
              }

              if(m_isFooter) {
                if(property.getLeft() === -1) {
                  c.setLeft(m_left[nTabIndex]);
                }
                label.setLeft(c.getLeft());
                label.setTop(c.getTop() - C_OFFSET_V3);
                label.setHeight(225);
                label.setTextAlign(Dialogs.AlignText.right);
                label.setWidth(1000);
              }
              else {
                if(property.getLeft() !== -1) {
                  label.setLeft(c.getLeft() + property.getLeftLabel());
                  label.setWidth(Math.abs(property.getLeftLabel()));
                }
                else {
                  c.setLeft = m_left[nTabIndex] + m_labelLeft;
                  if(property.getLeftLabel() !== 0) {
                    label.setLeft(c.getLeft() + property.getLeftLabel());
                    label.setWidth(Math.abs(property.getLeftLabel()));
                  }
                }
              }

            }
          }

          property.setTop(c.getTop());
          property.setLeft(c.getLeft());
          property.setWidth(c.getWidth());
          property.setHeight(c.getHeight());

          // only if this control changes the left of next controls
          //
          if(!property.getLeftNotChange()) {

            //
            if(property.getType() === Dialogs.PropertyType.option) {
              if(property.getLeftFrame() !== 0  && !property.getLeftNotChange()) {
                m_left[nTabIndex] = property.getLeft(); // TODO: check if there is a frame as in vb6
              }
            }
            else {
              if(property.getLeft() !== -1  && property.getLeftToPrevious() === 0) {
                m_left[nTabIndex] = property.getLeft() + property.getLeftLabel();
                m_labelLeft = Math.abs(property.getLeftLabel());
              }
            }
          }

          m_lastLeft = m_left[nTabIndex];
          m_lastLeftOp = c.getLeft();

          m_lastTop = m_nextTop[nTabIndex];
          m_lastTopOp = c.getTop();

          // define the top of next row

          // only if this control changes the top of next controls
          //
          if(!property.getTopNotChange()) {
            // if the control has set a custom top and it is not an option button
            //
            if(property.getTop() !== -1
                && property.getType() !== Dialogs.PropertyType.option
                && !property.getTopNotChange()) {

              m_lastTop = property.getTop();

              // if the control defines a custom height
              //
              if(property.getHeight() > 0) {
                m_nextTop[nTabIndex] = property.getTop() + c.getHeight() + C_LINE_LIGHT;
              }
              else {
                m_nextTop[nTabIndex] = property.getTop() + C_LINE_HEIGHT;
              }
            }
            else {
              // if the control defines a custom height and it is not an option button
              //
              if(property.getHeight() > 0 && property.getType() !== Dialogs.PropertyType.option) {
                m_nextTop[nTabIndex] = m_nextTop[nTabIndex] + c.getHeight() + C_LINE_LIGHT;
              }
              else {
                //
                // nextTop is always updated. even when type == option group. this fails with grids (we need to fix it)
                //
                // exception: in documents the select for document is placed in the title bar
                //
                if(!(m_isDocument
                    && (property.getSelectTable() === Cairo.Tables.DOCUMENTO
                        || property.getKeyCol() === Cairo.Constants.NUMBER_ID
                        || property.getKeyCol() === Cairo.Constants.STATUS_ID))) {
                  m_nextTop[nTabIndex] = m_nextTop[nTabIndex] + C_LINE_HEIGHT;
                }
              }
            }
          }

          if(property.getType() === Dialogs.PropertyType.option) {
            setNewWidthForm(property, f.getWidth() + f.getLeft());
          }
          else {
            setNewWidthForm(property, 0);
          }

          return true;
        };

        var setNewTopAndLeft = function(property) {
          var nTabIndex = getTabIndex(property);
          var view = getView();
          if(m_isItems) {
            m_nextTop[nTabIndex] = view.getTabItems().getTop() + 100;
            m_left[nTabIndex] = m_left[nTabIndex] + C_OFFSET_H2;

          }
          else if(m_isFooter) {
            m_nextTop[nTabIndex] = view.getFooterBackground().getTop() + C_OFFSET_V1;
            m_left[nTabIndex] = m_left[nTabIndex] + C_OFFSET_H3;

          }
          else {
            m_nextTop[nTabIndex] = m_constTop;
            m_left[nTabIndex] = m_left[nTabIndex] + C_OFFSET_H2;
          }
        }

        var pSetTabIndex = function(c) {
          Cairo.safeExecute(function() { c.setTabIndex(m_tabIndex); });
        };

        var setNewWidthForm = function(property, frameSize) {
          var view = getView();
          var offsetH = 0;

          if(view.getBackground().getLeft() === 0) {
            offsetH = 120;
          }
          else {
            offsetH = 400;
          }

          if(frameSize > 0) {
            if(view.getWidth() < frameSize + offsetH) {
              view.setWidth(frameSize + offsetH);
              view.getBackground().setWidth(view.getWidth() - view.getBackground().getLeft() * 2);
            }
          }
          else {
            if(view.getWidth() < property.getWidth() + property.getLeft() + offsetH) {
              view.setWidth(property.getWidth() + property.getLeft() + offsetH);
            }
            view.getBackground().setWidth(view.getWidth() - view.getBackground().getLeft() * 2);
          }
        };

        var getProperty = function(type, index, subType) {

          var property = null;
          var found = false;
          var propertyCount = m_properties.count();

          if(m_properties !== null) {

            // toolbars doesn't have index
            //
            if(type === Dialogs.PropertyType.toolbar) {
              var tbl = getView().getToolbar();
              for(var _i = 0; _i < propertyCount; _i++) {
                property = m_properties.get(_i);
                if(property.getType() === type) {
                  if(property.getToolbar() === tbl) {
                    return property;
                    break;
                  }
                }
              }
            }
            else {
              for(var _i = 0; _i < propertyCount; _i++) {
                property = m_properties.get(_i);

                found = false;

                // properties of type text can be text, file or folder
                //
                if(type === Dialogs.PropertyType.text) {

                  if(property.getType() === Dialogs.PropertyType.text  && subType === Dialogs.PropertySubType.memo) {
                    if(property.getSubType() === subType) {
                      found = true;
                    }
                  }
                  else {

                    // text, file and folder are in the same array
                    //
                    if((property.getType() === Dialogs.PropertyType.text
                      || property.getType() === Dialogs.PropertyType.file
                      || property.getType() === Dialogs.PropertyType.folder)
                      && property.getSubType() !== Dialogs.PropertySubType.memo
                      && property.getSubType() === subType) {

                      found = true;
                    }
                    // finally it can be a text with a button
                    //   subType == Dialogs.PropertyType.textButton or Dialogs.PropertyType.textButtonEx
                    // textButtonClick call will pass 0 as subType
                    //
                    // so this if handles text controls which has a button and aren't file or folder
                    //
                    else if((property.getType() === Dialogs.PropertyType.text
                      && (property.getSubType() === Dialogs.PropertyType.textButton
                      || property.getSubType() === Dialogs.PropertyType.textButtonEx))) {

                      found = true;
                    }
                  }
                }
                else {
                  if(property.getType() === type) {
                    found = true;
                  }
                }

                // we have found a control of the same type we were looking
                // know we need to check if this is the control we want
                // there can be more than one control of this type in the view
                //
                // we use index to check this
                //
                if(found) {
                  if(property.getIndex() === index) {
                    return property;
                    break;
                  }
                }
              }
            }
          }
        };

        // TODO: refactor promise is returned by this function
        //
        var propertyHasChanged = function(type, index, c, bNoRefresh, subType) {
          var p = null;

          try {

            if(m_refreshing || m_showingForm) {
              m_refreshing = false;
            }
            else {

              var property = getProperty(type, index, subType);

              if(property !== null) {

                var propertyCount = m_properties.count();

                switch(type) {
                  case Dialogs.PropertyType.list:

                    property.setListIndex(c.getListIndex());
                    property.setListText(c.getText());
                    if(c.getListIndex() >= 0) {
                      property.setListItemData(c.getItemData(c.getListIndex()));
                    }
                    else {
                      property.setListItemData(0);
                    }
                    break;

                  case Dialogs.PropertyType.text:
                  case Dialogs.PropertyType.password:
                  case Dialogs.PropertyType.file:
                  case Dialogs.PropertyType.folder:

                    property.setValue(c.getText());
                    break;

                  case Dialogs.PropertyType.numeric:

                    property.setValue(c.getValue());
                    break;

                  case Dialogs.PropertyType.date:
                  case Dialogs.PropertyType.time:

                    property.setValue(c.getValue());
                    break;

                  case Dialogs.PropertyType.option:

                    if(c.getValue()) {
                      // all options in a group must be updated
                      //
                      for(var _i = 0; _i < propertyCount; _i++) {
                        var property2 = m_properties.get(_i);
                        if(property2 !== property) {
                          if(property2.getType() === Dialogs.PropertyType.option
                              && property2.getOptionGroup() === property.getOptionGroup()) {
                            property2.setValue(0);
                          }
                        }
                      }
                    }

                    property.setValue(c.getValue());
                    break;

                  case Dialogs.PropertyType.select:

                    property.setValue(c.getValue());
                    property.setSelectId(Cairo.Util.val(c.getId()));
                    property.setSelectIntValue(c.getId());
                    break;

                  case Dialogs.PropertyType.check:

                    property.setValue(c.getValue());
                    break;

                  case Dialogs.PropertyType.toolbar:

                    property.setValue(c.getKey());
                    break;
                }

                p = m_client.propertyChange(property.getKey()).then(
                  function(success) {
                    if(success && !bNoRefresh) {
                      m_refreshing = true;
                      for(var _i = 0; _i < propertyCount; _i++) {
                        property = m_properties.get(_i);
                        self.showValueEx(property, m_noChangeColsInRefresh);
                      }
                    }
                  }
                );
              }

              // TODO: I don't like this code because I think it should be
              // including in the above if. I don't se a reason to execute
              // this code if property is null
              // the original code was coded this way. It should be refactored.

              p == p || Cairo.Promises.resolvedPromise(true);

              p.then(
                function() {
                  var p = null;
                  if(!isButton(property) && isEditProperty(property)) {

                    if(m_isDocument) {
                      if(property !== null) {
                        if(property.getSelectTable() !== Cairo.Tables.DOCUMENTO) {
                          self.setChanged(true);
                        }
                      }
                    }
                    else {
                      self.setChanged(true);
                    }
                  }

                  m_refreshing = false;

                  // master edition can close this view
                  //
                  if(m_masterView !== null) {
                    if(m_sendSave) {
                      p = m_masterView.save();
                    }
                    else if(m_sendClose) {
                      p = m_masterView.close();
                    }
                  }

                  return (p || Cairo.Promises.resolvedPromise(true));
                }
              );
            }
          }
          catch(e) {
            Cairo.manageError(
              "Update",
              "An error has occurred when updating a property.",
              e.message);
          }
        }

        var isButton = function(property) {
          if(property === null) {
            return false;
          }
          else {
            return property.getType() === Dialogs.PropertyType.button;
          }
        };

        var isEditProperty = function(property) {
          if(property === null) {
            return false;
          }
          else {
            return property.getIsEditProperty();
          }
        };

        // TODO: refactor promise is returned by this function
        //
        self.validateEx = function() {
          return fillGrids().then(
            function(success) {
              if(success) {
                return validate();
              }
              else {
                return false;
              }
            }
          );
        };

        self.validateProp = function(property, strKey) {
          if(property === null) {
            property = m_properties.get(strKey);
          }
          if(property.getControl().getType() === Dialogs.PropertyType.select) {
            property.getControl().validate();
          }
        };

        // TODO: refactor promise is returned by this function
        //
        var validateItemsAndFooter = function() {
          var p = null;
          if(m_isDocument) {
            p = m_client.messageEx(Dialogs.Message.MSG_DOC_EX_GET_ITEMS, null).then(
              function(genDocEx) {
                return genDocEx.validateEx();
              }
            ).then(
              function(success) {
                if(success) {
                  return m_client.messageEx(Dialogs.Message.MSG_DOC_EX_GET_FOOTERS, null).then(
                    function(genDocEx) {
                      return genDocEx.validateEx();
                    }
                  )
                }
                else {
                  return false;
                }
              }
            );
          }
          else {
            p = Cairo.Promises.resolvedPromise(true);
          }
          return p;
        };

        // TODO: refactor promise is returned by this function
        //
        self.save = function() {
          return saveDialog(false, false).then(
            function() {
              var view = getView();
              if(m_showOkCancel) {
                m_okCancelResult = true;
                if(viewIsMaster(view)) {
                  masterHandlerCloseClick();
                }
                else if(viewIsDocument(view)) {
                  formDocClose();
                }
                else if(viewIsWizard(view)) {
                  wizHandlerCancelClick();
                }
              }
            }
          );
        };

        // TODO: refactor promise is returned by this function
        //
        var saveDialog = function(unloading, saveAs) {
          var p = null;

          try {

            if(!m_isItems && !m_isFooter) {

              m_inSave = true;

              Cairo.LoadingMessage.showWait();

              refreshAux();
              fillList();

              p = fillGrids().then(
                function(success) {
                  if(success) {
                    var p = null;

                    if(!m_isDocument) {
                      setEnabled(false);
                    }

                    // tell the document client the validation is starting
                    //
                    if(m_isDocument) {
                      p = m_client.messageEx(Dialogs.Message.MSG_DOC_EX_PRE_VALIDATE, null);
                    }

                    p = p || Cairo.Promises.resolvedPromise();

                    return p.then(
                      function() {
                        var p = null;

                        if(!validate()) {
                          if(!m_isDocument) {
                            setEnabled(true);
                          }
                        }
                        else {
                          if(!validateItemsAndFooter()) {
                            if(!m_isDocument) {
                              setEnabled(true);
                            }
                          }
                          else {

                            var afterSave = function() {
                              var p = null;

                              if(!m_isDocument) {
                                setEnabled(true);
                              }

                              if(!unloading) {

                                if(!m_isDocument && !m_sendRefresh && !m_showOkCancel) {
                                  discardChanges(false);
                                }
                                else {
                                  p = m_client.messageEx(Dialogs.Message.MSG_DOC_REFRESH, null).then(
                                    function() {
                                      if(!m_isDocument) {
                                        self.refreshTitle();
                                      }
                                      getView().setFocusFirstControl();
                                    }
                                  );
                                }
                              }

                              p = p || Cairo.Promises.resolvedPromise();

                              return p.then(
                                function() {
                                  self.setChanged(false);
                                  return true;
                                }
                              );
                            };

                            // standard document, wizard or master save
                            //
                            if(!saveAs) {

                              p = m_client.save().then(
                                function(success) {
                                  var p = null;
                                  if(success) {
                                    p = afterSave();
                                  }
                                  else {
                                    if(!m_isDocument) {
                                      setEnabled(true);
                                    }
                                  }
                                  return (p || false);
                                }
                              );
                            }
                            else {

                              // saveAs allows to save copys of documents between different document types
                              // like save an invoice like budget
                              //
                              p = m_client.messageEx(Dialogs.Message.MSG_SAVE_AS, null).then(
                                function(success) {
                                  var p = null;
                                  if(success) {
                                    p = afterSave();
                                  }
                                  else {
                                    if(!m_isDocument) {
                                      setEnabled(true);
                                    }
                                  }
                                  return (p || false);
                                }
                              );
                            }
                          }
                        }
                        return (p || false);
                      }
                    );
                  }
                  else {
                    return false;
                  }
                }
              );
            }
          }
          catch(e) {
            Cairo.manageError(
              "Saving",
              "An error has occurred when saving.",
              e.message);
          }

          p = p || Cairo.Promises.resolvedPromise(false);

          return p.then(
            function(success) {
              m_inSave = false;
              return success;
            }
          );
        };

        var fillList = function() {
          var listCount = getView().getCombos().count();
          var propertyCount = m_properties.count();
          var view = getView();
          for(var index = 1; index <= listCount; index++) {
            for(var _j = 0; _j < propertyCount; _j++) {
              var property = m_properties.get(_j);
              if(property.getType() === Dialogs.PropertyType.list) {
                if(property.getIndex() === index) {
                  property.setListItemData(Cairo.Util.List.getListId(view.getCombos().get(index)));
                  property.setListIndex(view.getCombos().get(index).getListIndex());
                  property.setListText(view.getCombos().get(index).getText());
                }
              }
            }
          }
        };

        // TODO: refactor promise is returned by this function
        //
        var fillGrids = function() {
          //
          // this function is optimistic
          //
          var p = Cairo.Promises.resolvedPromise(true);

          var view = getView();
          var gridCount = view.getGrids().count();
          var propertyCount = m_properties.count();

          for(var index = 0; index <= gridCount; index++) {
            for(var _j = 0; _j < propertyCount; _j++) {
              var property = m_properties.get(_j);
              if(property.getType() === Dialogs.PropertyType.grid) {
                if(property.getIndex() === index) {
                  p = p.then(
                    function(success) {
                      if(success) {
                        return fillRows(property.getGrid(), view.getGrids().get(index));
                      }
                      else {
                        return false; // cancel next promises
                      }
                    }
                  );
                }
              }
            }
          }
          return p;
        };

        // TODO: refactor promise is returned by this function
        //
        var fillRows = function(grid, gridCtrl) {
          var p = null;
          var colIndex = 0;
          var rowIndex = 0;
          var rowCount = 0;
          var columnCount = 0;

          var keys = [];
          var rows = grid.getRows();

          // TODO: check if when implement this clear method it is needed to clear haveKey

          ///////////////////////////////////////////////////////////////////////
          //
          // make a copy of all the keys
          //
          var haveKey = rows.getHaveKey();
          if(haveKey) {

            rowCount = grid.getRows().count();
            for(rowIndex = 0; rowIndex < rowCount; rowIndex++) {
              var row = grid.getRows().get(rowIndex);
              keys[rowIndex][0] = row.getKey();

              columnCount = grid.getColumns().count();
              var colCount = row.count();
              // column at zero doesn't contain a key
              for(colIndex = 1; colIndex < columnCount; colIndex++) {
                if(colIndex < colCount) {
                  keys[rowIndex][colIndex] = row.get(colIndex).getKey();
                }
              }
            }
          }

          grid.getRows().clear();

          rows.setHaveKey(haveKey);
          //
          // end copy keys
          ///////////////////////////////////////////////////////////////////////

          var fillRow = function(result) {
            if(!result.cancel) {
              if(!result.isEmpty) {

                if(haveKey) {
                  if(rowIndex < keys.length) {
                    if(keys[rowIndex][0] !== "") {
                      row = grid.getRows().add(null, keys[rowIndex][0]);
                    }
                    else {
                      row = grid.getRows().add(null);
                    }
                  }
                  else {
                    row = grid.getRows().add(null);
                  }
                }
                else {
                  row = grid.getRows().add(null);
                }

                columnCount = grid.getColumns().count();
                // column at zero only have row number
                //
                for(colIndex = 1; colIndex < columnCount; colIndex++) {

                  var col = grid.getColumns(colIndex);
                  var cellCtrl = gridCtrl.cell(rowIndex, colIndex);
                  var cell = null;

                  if(haveKey) {
                    if(rowIndex < keys.length && colIndex < keys[rowIndex].length) {
                      if(keys[rowIndex][colIndex] !== "") {
                        if(keys[rowIndex][colIndex] === Dialogs.Constants.keyRowItem) {
                          if(row.get(Dialogs.Constants.keyRowItem) === null) {
                            cell = row.add(null, keys[rowIndex][colIndex]);
                          }
                          else {
                            cell = row.add(null);
                          }
                        }
                        else {
                          cell = row.add(null, keys[rowIndex][colIndex]);
                        }
                      }
                      else {
                        cell = row.add(null);
                      }
                    }
                    else {
                      cell = row.add(null);
                    }
                  }
                  else {
                    cell = row.add(null);
                  }

                  cell.setId(cellCtrl.getItemData());
                  cell.setSelectIntValue(cellCtrl.getTag());

                  if(col.getType() === Dialogs.PropertyType.date) {
                    cell.setValue(Cairo.Util.getDateValueFromGrid(cellCtrl.getText()));
                  }
                  else if(col.getSubType() === Dialogs.PropertySubType.percentage) {
                    cell.setValue(Cairo.Util.val(cellCtrl.getText()) * 100);
                  }
                  else {
                    cell.setValue(cellCtrl.getText());
                  }

                  cell.setKey(col.getKey());
                }
              }
            }
            return result;
          };

          // by default all rows are valid and aren't empty
          //
          var result = {
            cancel:  false,
            isEmpty: false,
            isValid: true
          };

          rowCount = gridCtrl.getRows().count();
          var lastRowIndex = rowCount -1;
          for(rowIndex = 0; rowIndex < rowCount; rowIndex++) {

            // the last row can be empty because it is for new items
            // so if no columns with values exists don't add to grid.rows
            //
            if(rowIndex === lastRowIndex) {

              // only when the grid allows add new rows
              //
              var property = getProperty(Dialogs.PropertyType.grid, gridCtrl.getIndex(), 0);
              if(property.getGridAddEnabled()) {
                p = gridValidateRow(gridCtrl.getIndex(), rowIndex, false);
              }
            }

            if(p === null) {
              fillRow(result);
            }
            else {
              p.then(
                function(result) {
                  return fillRow(result);
                }
              );
            }
          }

          p = (p || Cairo.Promises.resolvedPromise(result));

          return p.then(
            function(result) {
              return !result.cancel;
            }
          );
        };

        var saveColumnsGrids = function() {
          var view = getView();
          for(var i = 0; i <= view.getGrids().count(); i++) {
            var property = getProperty(Dialogs.PropertyType.grid, i, 0);
            if(property !== null) {
              m_gridManager.saveColumnWidth(view.getGrids().get(i), getGridName(property));
              m_gridManager.saveColumnOrder(view.getGrids().get(i), getGridName(property));
            }
          }
        };

        // TODO: refactor promise is returned by this function
        //
        var discardChanges = function(dontCallClient) {
          var p = null;

          try {

            Cairo.LoadingMessage.showWait();

            var i, count;
            var propertyCount = m_properties.count();
            for(i = 0; i < propertyCount; i++) {
              m_properties.get(i).setControl(null);
            }

            var view = getView();

            saveColumnsGrids();

            initVectorsPosition();

            view.getMaskEdits().get(0).setVisible(false);
            count = view.getMaskEdits().count();
            for(i = 0; i < count; i++) {
              removeControl(view.getMaskEdits().get(i));
            }

            view.getDatePickers().get(0).setVisible(false);
            count = view.getDatePickers().count()
            for(i = 0; i < count; i++) {
              removeControl(view.getDatePickers().get(i));
            }

            view.getSelects().get(0).setVisible(false);
            count = view.getSelects().count();
            for(i = 0; i < count; i++) {
              removeControl(view.getSelects().get(i));
            }

            count = view.getOptionButtons.count();
            for(i = 0; i < count; i++) {
              removeControl(view.getOptionButtons().get(i));
            }

            view.getCheckBoxes().get(0).setVisible(false);
            count = view.getCheckBoxes().count();
            for(i = 0; i < count; i++) {
              removeControl(view.getCheckBoxes().get(i));
            }

            view.getButtons().get(0).setVisible(false);
            count = view.getButtons().count();
            for(i = 0; i < count; i++) {
              removeControl(view.getButtons().get(i));
            }

            view.getCombos().get(0).setVisible(false);
            count = view.getCombos().count();
            for(i = 0; i < count; i++) {
              removeControl(view.getCombos().get(i));
            }

            view.getTextInputs().get(0).setVisible(false);
            count = view.getTextInputs().count();
            for(i = 0; i < count; i++) {
              removeControl(view.getTextInputs().get(i));
            }

            view.getTextAreas().get(0).setVisible(false);
            count = view.getTextAreas().count();
            for(i = 0; i < count; i++) {
              removeControl(view.getTextAreas().get(i));
            }

            view.getPasswordInputs().get(0).setVisible(false);
            count = view.getPasswordInputs().count();
            for(i = 0; i < count; i++) {
              removeControl(view.getPasswordInputs().get(i));
            }

            view.getLabels().get(0).setVisible(false);
            count = view.getLabels().count();
            for(i = 0; i < count; i++) {
              removeControl(view.getLabels().get(i));
            }

            destroyGrids(getView());

            if(viewIsWizard(view) || viewIsMaster(view)) {
              count = view.getCtlLabels().count();
              for(i = 0; i < count; i++) {
                removeControl(view.getCtlLabels().get(i));
              }
            }

            if(viewIsWizard(view)) {
              count = view.getProgressBars().count();
              for(i = 0; i < count; i++) {
                removeControl(view.getProgressBars().get(i));
              }
              count = view.getDescription().count();
              for(i = 0; i < count; i++) {
                removeControl(view.getDescription(i));
              }
            }

            if(viewIsWizard(view) || viewIsMaster(view)) {
              count = view.getTitleLabel2().count();
              for(i = 0; i < count; i++) {
                removeControl(view.getTitleLabel2().get(i));
              }
              count = view.getImages().count();
              for(i = 0; i < count; i++) {
                removeControl(view.getImages().get(i));
              }
            }

            view.unLoadToolbar();

            if(!dontCallClient) {
              p = m_client.discardChanges();
            }
          }
          catch(e) {
            Cairo.manageError(
              "Discard Changes",
              "An error has occurred when discarding changes.",
              e.message);
          }
          return (p || Cairo.Promises.resolvedPromise(true));
        };

        // TODO: refactor promise is returned by this function
        //
        var validate = function() {
          //
          // ask the client to validate all input but grids
          //
          return m_client.validate().then(
            function(success) {
              //
              // if the client validates all input but grids
              //
              if(success) {
                //
                // the first promise is a completed promise set to true
                // this allows as to chain all promises and only call
                // gridValidateRow for one row at a time because the call
                // to this function is done only in the success callback
                // of the promise
                //
                var p = Cairo.Promises.resolvedPromise(true);
                //
                // we have to validate all grids. that means all rows (for -> for)
                //
                if(m_clientManageGrid) {
                  var rowIndex = 0;
                  var propertyCount = m_properties.count();

                  //
                  // we need this function to make a clousure with this three parameters
                  // which are set in: for every grid -> for every row
                  //
                  var getCall = function(property, rowIndex, oldRedraw) {
                    //
                    // this function will handle the client validation of every row
                    //
                    return function(success) {
                      //
                      // if a promise is completed we make a call to validate the next row
                      // so the validation is serialized and execute only if the previous
                      // validation has completed
                      //
                      if(success) {
                        //
                        // gridValidateRow will ask the client to validate one row
                        // and will returns a promise
                        //
                        return gridValidateRow(property.getIndex(), rowIndex, true).then(
                          function(success) {
                            if(!success) {
                              property.getControl().setRedraw(oldRedraw);
                            }
                            return success; // propagate the result to the next promise in the chain
                          }
                        );
                      }
                      //
                      // if the validation has failed we just return false and no more
                      // calls to gridValidateRow will be made
                      //
                      else {
                        return false;
                      }
                    }
                  };

                  //
                  // another function to create a clousure. this time we need to redraw the grid
                  // after all its rows are validated
                  //
                  var getGridCall = function(property, oldRedraw) {
                    return function(success) {
                      //
                      // only refresh after a succes validation of all rows in the grid
                      // if the validation has failed the refresh is handled by the above
                      // function
                      //
                      if(success) {
                        property.getControl().setRedraw(oldRedraw);
                      }
                      return success;  // propagate the result to the next promise in the chain
                    };
                  };

                  //
                  // for every grid
                  //
                  for(var _i = 0; _i < propertyCount; _i++) {
                    var property = m_properties.get(_i);

                    if(property.getType() === Dialogs.PropertyType.grid) {

                      var oldRedraw = property.getControl().getRedraw();
                      property.getControl().setRedraw(false);

                      //
                      // for every row
                      //
                      var rowCount = property.getGrid().getRows().count();
                      for(rowIndex = 0; rowIndex < rowCount; rowIndex++) {
                        //
                        // chain the promises to serialize the validation
                        //
                        p = p.then(getCall(property, rowIndex, oldRedraw));
                      }
                      //
                      // redraw the grid if applicable
                      //
                      p = p.then(getGridCall(property, oldRedraw));
                    }
                  }
                }
                //
                // if the client doesn't has a grid the validation is completed
                //
                else {
                  return true;
                }
              }
              //
              // the client has rejected the validation
              //
              else {
                return false;
              }
            }
          );
        };

        self.setTabCtlIndex = function() {

          var index = 0;
          var propertyCount = m_properties.count();
          var tabCount = m_tabs.count();

          for(var _i = 0; _i < tabCount; _i++) {
            m_tabs.get(_i).setControlIndex(index);
            index = index + 1;
          }

          for(var _i = 0; _i < propertyCount; _i++) {
            var property = m_properties.get(_i);

            if(property.getTabIndex() < 0) {

              var tab = getTabFather(property.getTabIndex());

              property.setTabIndex2(property.getTabIndex());
              property.setTabIndex(tab.getIndex());

            }
          }
        };

        var getTabFather = function(index) {
          var tabCount = m_tabs.count();
          for(var _i = 0; _i < tabCount; _i++) {
            var tab = m_tabs.get(_i);
            if(tab.getIndex() === index) {
              if(tab.getFatherTab() !== "") {
                return m_tabs.get(tab.getFatherTab());
              }
            }
          }
        };

        var showTabs = function(tabs) {
          var tabTopHeight = 0;
          var left = 90;
          var top = 0;
          var topItems = 0;
          var noResize = false;

          if(m_tabTopHeight === 0) {
            tabTopHeight = 540;
          }
          else {
            tabTopHeight = m_tabTopHeight;
            getView().getBackground().setTop(m_tabTopHeight + getView().getTabs().get(0).getHeight() - 10);
            m_constTop = getView().getBackground().getTop() + 200;
          }

          var view = getView();

          if(m_isItems) {
            top = view.getTabItems().getTop() - view.getTabs().get(0).getHeight();
            topItems = 10;
          }
          else if(m_isFooter) {
            top = view.getFooterBackground().getTop() - view.getTabs().get(0).getHeight();
          }
          else {
            if(m_isDocument) {
              top = 1080;
            }
            else {
              top = tabTopHeight;
            }
          }

          var tabCount = view.getTabs().count();
          for(var i = 0; i < tabCount; i++) {
            if(m_isItems) {
              if(view.getTabs().get(i).getTag() === Cairo.Constants.DocumentSections.footer
                || view.getTabs().get(i).getTag() === Cairo.Constants.DocumentSections.items) {
                removeControl(view.getTabs().get(i));
              }
            }
            else if(m_isFooter) {
              if(view.getTabs().get(i).getTag() === Cairo.Constants.DocumentSections.footer) {
                removeControl(view.getTabs().get(i));
              }
            }
            else {
              removeControl(view.getTabs().get(i));
            }
          }

          var k = 0;

          if(m_tabs !== null) {
            tabs = (m_tabs.count() - 1 > tabs) ? m_tabs.count() - 1 : tabs;
          }

          if(tabs > 0) {
            var tabsCtrl = view.getTabs();
            if(tabsCtrl.count() === 1) {
              m_firstTab = 0;
            }
            else {
              m_firstTab = tabsCtrl.count();
            }

            for(i = m_firstTab; i <= tabs + m_firstTab; i++) {
              if(i > 0) {
                addControl(view.getTabs().get(i));
              }

              var tabCtrl = view.getTabs().get(i);
              if(m_isDocument) {
                if(m_isItems) {
                  tabCtrl.setTag(Cairo.Constants.DocumentSections.items);
                  tabCtrl.setTabGroup(1);
                }
                else if(m_isFooter) {
                  tabCtrl.setTag(Cairo.Constants.DocumentSections.footer);
                  tabCtrl.setTabGroup(2);
                }
                else {
                  tabCtrl.setTag(Cairo.Constants.DocumentSections.header);
                  tabCtrl.setTabGroup(3);
                }
              }

              k += 1;

              var tab = m_tabs.get(k);
              if(tab.getFatherTab() !== "") {
                var fatherTab = m_tabs.get(tab.getFatherTab());
                tabCtrl.setTag = tabCtrl.getTag()
                              + Dialogs.Constants.innerTab
                              + ((fatherTab.getIndex() * 100) + Math.abs(tab.getIndex())).toString();

                if(tab.getLeft() !== 0) {
                  noResize = true;
                  left = tab.getLeft();
                }
                if(tab.getTop() !== 0) {
                  noResize = true;
                  top = tab.getTop();
                }
              }

              tabCtrl.setText("Tab" + i.toString());
              tabCtrl.setTabStop(false);
              tabCtrl.setVisible(!m_hideTabButtons);
              if(left + tabCtrl.getWidth() > getView().Width) {
                left = 90;
                top = top + tabCtrl.getHeight() - 20;
              }
              tabCtrl.setTop(top + topItems);
              tabCtrl.setLeft(left);
              tabCtrl.bringToFront();
              tabCtrl.setBackColorPressed(Dialogs.Colors.tabBackColor);
              left = left + tabCtrl.getWidth() - 20;
            }

            m_left = [];
            m_nextTop = [];

            for(var q = 0; q < tabs; q++) {
              m_nextTop[q] = m_constTop;
              m_left[q] = m_constLeft;
            }

            if(m_tabs !== null) {

              left = 90;
              if(m_isItems) {
                top = view.getTabItems().getTop() - view.getTabs().get(0).getHeight();
                topItems = 10;
              }
              else if(m_isFooter) {
                top = view.getFooterBackground().getTop() - view.getTabs().get(0).getHeight();
              }
              else {
                if(m_isDocument) {
                  top = 1080;
                }
                else {
                  top = tabTopHeight;
                }
              }

              tabCount = m_tabs.count();
              for(var _i = 0; _i < tabCount; _i++) {
                tab = m_tabs.get(_i);
                if(tab.getIndex() < 0) {
                  tabCtrl = view.getTabs().get(tab.getControlIndex() + m_firstTab);
                  tabCtrl.setText("&" + Math.abs(tab.getIndex()).toString() + "-" + tab.getName());
                }
                else {
                  tabCtrl = view.getTabs().get(tab.getIndex() + m_firstTab);
                  tabCtrl.setText("&" + tab.getIndex() + m_firstTab + 1 + "-" + tab.getName());
                }

                if(!noResize) {
                  tabCtrl.setWidth(view.getTextWidth(tabCtrl.getText())) + 300;
                  if(left + tabCtrl.getWidth() > view.getWidth()) {
                    left = 100;
                    top = top + tabCtrl.getHeight() - 20;
                  }
                  tabCtrl.setLeft(left);
                  tabCtrl.setTop(top + topItems);
                  left = left + tabCtrl.getWidth() - 20;
                }
              }

              view.getBackground().bringToFront();
            }
          }
        };

        var setButton = function(control, property) {

          if(c.getType !== undefined) {
            if(control.getType() !== Dialogs.PropertyType.time
                && control.getType() !== Dialogs.PropertyType.time) {

              if(control.getEnabled()) {

                if(property.getNoShowButton()) {
                  control.ButtonStyle = Dialogs.ButtonStyle.none;
                }
                else {
                  control.ButtonStyle = Dialogs.ButtonStyle.single;
                }
              }
              else {
                control.ButtonStyle = Dialogs.ButtonStyle.none;
              }
            }
          }
        };

        var moveNext = function() {
          try {
            m_client.moveNext();
            return;
          }
          catch(e) {
            Cairo.manageError(
              "Moving",
              "An error has occurred when moving to the next document.",
              e.message);
          }
        };

        var moveBack = function() {
          m_client.moveBack();
        };

        self.refreshFont = function(property) {
          if(property.getControl() !== null) {
            setFont(property.getControl(), property);
          }
        };

        self.refreshPosition = function(property) {
          try {
            var c = property.getControl()
            if(c !== null) {
              c.setLeft(property.getLeft());
              c.setTop(property.getTop());
              c.setWidth(property.getWidth());
              c.setHeight(property.getHeight());
            }
          }
          catch(ignore) {}
        };

        var setFont = function(c, property) {
          if(property.getFontName() !== "") {
            c.setFontName(property.getFontName());
          }
          if(property.getFontSize() > 0) {
            c.setFontSize(property.getFontSize());
          }
          c.setFontUnderline(property.getFontUnderline());
          c.setFontBold(property.getFontBold());
          c.setFontItalic(property.getFontItalic());
          if(property.getForeColor() !== -1) {
            c.setForeColor(property.getForeColor());
          }
        };

        var setBackColor = function(c, property) {
          if(property.getBackColor() !== -1) {
            c.setBackColor(property.getBackColor());
          }
        };

        self.setTabIndexDescription = function() {
          if(m_isDocument) {
            var view = getView();
            var propertyCount = m_properties.count();
            for(var _i = 0; _i < propertyCount; _i++) {
              var property = m_properties.get(_i);
              if(property.getSubType() === Dialogs.PropertySubType.memo) {
                view.getTextAreas().get(property.getIndex()).setTabIndex(view.getControls().count());
              }
            }
          }
        };

        var refreshAux = function() {
          var view = getView();

          var count = m_properties.count();
          for(var i = 0; i < count; i++) {

            var property = m_properties.get(i);
            var index = property.getIndex();

            switch(m_properties.get(i).PropertyType) {

              case Dialogs.PropertyType.check:
                propertyHasChanged(Dialogs.PropertyType.check, index, view.getCheckBoxes().get(index), true);
                break;

              case Dialogs.PropertyType.date:
              case Dialogs.PropertyType.time:
                propertyHasChanged(Dialogs.PropertyType.date, index, view.getDatePickers().get(index), true);
                break;

              case Dialogs.PropertyType.select:
                propertyHasChanged(Dialogs.PropertyType.select, index, view.getSelects().get(index), true);
                break;

              case Dialogs.PropertyType.list:
                propertyHasChanged(Dialogs.PropertyType.list, index, view.getCombos().get(index), true);
                break;

              case Dialogs.PropertyType.numeric:
                propertyHasChanged(Dialogs.PropertyType.numeric, index, view.getMaskEdits().get(index), true);
                break;

              case Dialogs.PropertyType.option:
                propertyHasChanged(Dialogs.PropertyType.option, index, view.getOptionButtons().get(index), true);
                break;

              case Dialogs.PropertyType.password:
                propertyHasChanged(Dialogs.PropertyType.password, index, view.getPasswordInputs().get(index), true);
                break;

              case Dialogs.PropertyType.text:
              case Dialogs.PropertyType.file:
              case Dialogs.PropertyType.folder:
                if(m_properties.get(i).getSubType() === Dialogs.PropertySubType.memo) {
                  propertyHasChanged(Dialogs.PropertyType.text, index, view.getTextAreas().get(index), true, Dialogs.PropertySubType.memo);
                }
                else {
                  propertyHasChanged(Dialogs.PropertyType.text, index, view.getTextInputs().get(index), true);
                }
                break;
            }
          }
        };

        self.resetChanged = function() {
          self.setChanged(false);
          m_unloading = false;
        };

        var askDelete = function(msg) {
          return Cairo.Modal.confirmCancelViewYesDanger(
            "Delete",
            msg
          );
        };

        var reloadDocument = function() {
          if(!m_unloading) {
            showMsg("Discarding changes ...");
            m_client.messageEx(Dialogs.Message.MSG_DOC_REFRESH, null).then(
              function() {
                self.setChanged(false);
                hideMsg();
              }
            );
          }
        };

        self.printDocument = function() {
          return print(false);
        }

        self.printDocEx = function(id) {
          return print(false, id);
        }

        // TODO: check if this can be refactor in a cleaner code
        //
        self.printDocumentAux = function(client) {
          var oldClient = m_client;
          m_client = client;
          return print(false).then(
            function() {
              m_client = oldClient;
            }
          );
        };

        self.printDocumentWithResult = function(client, id, docId) {
          var oldClient = m_client;
          m_client = client;
          return self.printDocWithResult(id, docId).then(
            function(result) {
              m_client = oldClient;
              return result;
            }
          );
        };

        self.printDocWithResult = function(id, docId) {
          if(id === Cairo.Constants.NO_ID) {
            return Cairo.Promises.resolvedPromise(false);
          }
          else {
            var config = Cairo.Configuration;
            var reportConfig = config.Reports;
            var printManager = new Cairo.Entities.Printing.Manager();

            printManager.setIsForEmail(false);

            printManager.setPath(
              Cairo.Util.File.getValidPath(
                config.get(
                  reportConfig.reportSection,
                  reportConfig.reportPath,
                  config.appPath())));

            printManager.setCommandTimeout(
              Cairo.Util.val(
                config.get(
                  reportConfig.reportSection,
                  reportConfig.commandTimeOut,
                  0)));

            printManager.setConnectionTimeout(
              Cairo.Util.val(
                config.get(
                  reportConfig.reportSection,
                  reportConfig.connectionTimeOut,
                  0)));

            return getEmailAddress()
            .then(
              function(email) {
                printManager.setEmailAddress(email.trim());
                return getUserDescription();
              }
            ).then(
              function(description) {
                printManager.setUserDescription(description);
                return getPrintTitle();
              }
            ).then(
              function(title) {
                printManager.setTitle(title);
                return printManager.showPrint(id, Cairo.Constants.NO_ID, docId);
              }
            ).then(
              function(result) {
                printManager.setDocumentAsPrinted();
                return result;
              }
            );
          }
        };

        var print = function(byEmail, id) {
          var p = null;

          try {
            if(m_client.isDocument === true) {

              if(id === Cairo.Constants.NO_ID) {
                id = m_client.getId();
              }

              if(id === Cairo.Constants.NO_ID) {
                Cairo.infoViewShow("Printing", "The document must be saved before printing");
              }

              if(!m_inSave) {
                p = saveChanges(false);
              }

              p = p || Cairo.Promises.resolvedPromise(true);

              p.then(
                function() {
                  var config = Cairo.Configuration;
                  var reportConfig = config.Reports;
                  var printManager = new Cairo.Entities.Printing.Manager();

                  printManager.setIsForEmail(byEmail);

                  printManager.setPath(
                    Cairo.Util.File.getValidPath(
                      config.get(
                        reportConfig.reportSection,
                        reportConfig.reportPath,
                        config.appPath())));

                  printManager.setCommandTimeout(
                    Cairo.Util.val(
                      config.get(
                        reportConfig.reportSection,
                        reportConfig.commandTimeOut,
                        0)));

                  printManager.setConnectionTimeout(
                    Cairo.Util.val(
                      config.get(
                        reportConfig.reportSection,
                        reportConfig.connectionTimeOut,
                        0)));

                  return getEmailAddress()
                  .then (
                    function(email) {
                      printManager.setEmailAddress(email.trim());
                      return getUserDescription();
                    }
                  ).then(
                    function(description) {
                      printManager.setUserDescription(description);
                    }
                  ).then(
                    function() {
                      printManager.setAutoPrint(m_autoPrint);
                      return printManager.showPrint(id, Cairo.Constants.NO_ID, m_client.getDocumentId())
                    }
                  ).then(
                    function(result) {
                      if(printManager.getDocumentIsPrinted()) {
                        reloadDocument();
                      }
                      return result;
                    }
                  );
                }
              );
            }
          }
          catch(e) {
            Cairo.manageError(
              "Printing",
              "An error has occurred when printing.",
              e.message);
          }

          return (p || Cairo.Promises.resolvedPromise(false));
        };

        var getUserDescription = function() {
          return m_client.messageEx(Dialogs.Message.MSG_EXPORT_GET_FILE_NAME_POSTFIX, null);
        };

        var getPrintTitle = function() {
          return m_client.messageEx(Dialogs.Message.MSG_PRINT_GET_TITLE, null);
        };

        var getEmailAddress = function() {
          return m_client.messageEx(Dialogs.Message.MSG_EXPORT_GET_EMAIL, null);
        };

        var newWithWizard = function() {
          var p = null;
          try {
            p = m_client.messageEx(Dialogs.Message.MSG_DOC_NEW_WITH_WIZARD, null);
          }
          catch(ignore) {}
          return (p || Cairo.Promises.resolvedPromise(false));
        };

        var getTabIndex = function(property) {
          var index = 0;
          if(property.getTabIndex() !== Dialogs.TabIndexType.TAB_ID_XT_ALL
            && property.getTabIndex() !== Dialogs.TabIndexType.TAB_ID_XT_ALL2) {
            index = property.getTabIndex();
          }
          return index;
        };

        var initVectorsPosition = function() {
          m_left[0] = m_constLeft;
          m_leftOp[0] = m_constLeftOp;
          m_nextTop[0] = m_constTop;
          m_nextTopOp[0] = m_constTopOp;
        };

        var initCtrlPosition = function() {
          m_constLeft = getView().getLabels().get(0).getLeft();
          m_constLeftOp = getView().getOptionButtons().get(0).getLeft();
          m_textOrigWidth = getView().getTextInputs().get(0).getWidth();

          if(m_isItems) {
            m_constTop = getView().getTabItems().getTop() + 100;
          }
          else if(m_isFooter) {
            m_constTop = getView().getFooterBackground().getTop() + C_OFFSET_V1;
            m_constLeft = getView().getFooterBackground().getLeft() + 200;
          }
          else {
            m_constTop = getView().getSelects().get(0).getTop();
          }

          m_constTopOp = getView().getOptionButtons().get(0).getTop();
        };

        self.initButtons = function() {
          var view = getView();
          if(viewIsDocument(view)) {
            view.setNoButtons1(m_noButtons1);
            view.setNoButtons2(m_noButtons2);
            view.setNoButtons3(m_noButtons3);
            view.setButtonsEx2(m_buttonsEx2);
            view.setButtonsEx3(m_buttonsEx3);
            view.setToolbarButtons();
          }
        };

        // construccion - destruccion
        self.initialize = function() {

          m_isDocument = false;
          m_isFooter   = false;
          m_isItems    = false;
          m_viewShowed = false;
          m_minHeight  = 5310;
          m_minWidth   = 8640;

          m_tabHideControlsInAllTab = -1;

          m_properties = new Dialogs.createProperties();

          m_nextTop   = [0];
          m_nextTopOp = [0];
          m_left      = [0];
          m_leftOp    = [0];
        };

        self.terminate = function() {

          m_menu = null;

          m_nextTop   = null;
          m_nextTopOp = null;
          m_left      = null;
          m_leftOp    = null;

          m_properties  = null;
          m_client      = null;
          m_tabs        = null;
          m_gridManager = null;

          if(m_masterView !== null) {
            removeControl(m_masterView);
          }
          if(m_documentView !== null) {
            removeControl(m_documentView);
          }
          if(m_wizardView !== null) {
            removeControl(m_wizardView);
          }

          m_masterView   = null;
          m_documentView = null;
          m_wizardView   = null;
        };

        var getGridName = function(property) {
          if(property.getName() !== "") {
            return m_client.getTitle() + "_" + property.getName();
          }
          else {
            return m_client.getTitle() + "_" + property.getKey();
          }
        };

        var setNoResize = function() {
          var indexGrid = 0;
          var i = 0;

          var propertyCount = m_properties.count();
          for(var _i = 0; _i < propertyCount; _i++) {

            var property = m_properties.get(_i);
            var view = getView();

            if(property.getType() === Dialogs.PropertyType.grid) {

              i += 1;
              var grid = property.getGrid();

              if(!property.getControl() === null && viewIsMaster(view)) {
                indexGrid = getView().getIndexGrid(property.getControl());
                if(indexGrid === 0) {
                  indexGrid = i;
                }
              }
              else {
                indexGrid = i;
              }

              getView().setNoResize(indexGrid, grid.getNoResize());

              if(grid.setNoResizeHeight()) {
                getView().setNoResizeHeight(indexGrid, true);

                if(!property.getControl() === null) {
                  setGridHeight(property.getControl(), property.getHeight());
                }
              }
            }
          }
        };

        var setGridHeight = function(ctl, height) {
          Cairo.safeExecute(function() {
            if(height > 0) {
               ctl.setHeight(height);
            }
          });
        };

        var setEnabled = function(bEnabled) {
          var view = getView();
          var controlCount = view.getControls().count();
          var i = 0;

          if(bEnabled) {
            for(var _i = 0; _i < controlCount; _i++) {
              var ctl = view.getControls().get(_i);
              if(controlIsGrid(ctl)) {
                i = i + 1;
                if(m_enabledState[i]) {
                  ctl.setEnabled(true);
                }
              }
            }
            m_enabledState = [];
          }
          else {

            m_enabledState = [];

            for(var _i = 0; _i < controlCount; _i++) {
              var ctl = view.getControls().get(_i);
              if(controlIsGrid(ctl)) {
                m_enabledState.push(ctl.getEnabled());
                ctl.setEnabled(false);
              }
            }
          }
        };

        self.refreshTitle = function() {
          var view = getView();
          if(m_title !== "") {
            view.getTitleLabelEx2().setText(" - "+ m_title);
            view.getTitleLabelEx2().setLeft(view.getTitleLabel().getLeft() + view.getTitleLabel().getWidth() + 50);
          }
          else {
            view.getTitleLabelEx2().setText("");
          }
        };

        self.refreshViewText = function() {
          Cairo.safeExecute(function() {
            getView().setText(getViewText());
          });
        };

        var getViewText = function() {
          return m_viewText + Cairo.Company.name + " - " + m_client.getTitle() + " || Press F12 to see the a shortcut key list";
        };

        // TODO: implement or remove
        var setBackgroundColor = function() {
          if(m_backgroundColor !== 0) {
            self.setBackColorTagMainEx(Dialogs.Colors.backgroundColor);
          }
        };

        self.setBackColorTagMainEx = function(color) {
          m_backgroundColor = color;
          if(m_masterView !== null) {
            m_masterView.getBackground().setBackColor(color);
          }
          else if(m_documentView !== null) {
            m_documentView.getBackground().setBackColor(color);
            m_documentView.getFooterBackground().setBackColor(color);
            m_documentView.getTabItems().setBackColor(color);
          }
          else if(m_wizardView !== null) {
            m_wizardView.getBackground().setBackColor(color);
            m_wizardView.getDialogBackground().setBackColor(color);
            m_wizardView.getTitleBackground().setBackColor(Dialogs.Colors.tabBackColor);
          }
        };

        var isControlVisibleInTab = function(c, index) {
          return (Cairo.Util.val(c.getTag()) === index
                  || (Cairo.Util.val(c.getTag()) === Dialogs.TabIndexType.TAB_ID_XT_ALL
                        && index !== m_tabHideControlsInAllTab)
                  || Cairo.Util.val(c.getTag()) === Dialogs.TabIndexType.TAB_ID_XT_ALL2);
        };

        var wizDisableButtons = function() {
          Cairo.safeExecute(function() {
            if(m_wizardView === null) { return; }
            m_inProcess = true;
          });
        };

        var wizEnableButtons = function() {
          Cairo.safeExecute(function() {
            if(m_wizardView === null) { return; }
            m_inProcess = false;
          });
        };

        var setFocusControl = function(c) {
          Cairo.safeExecute(function() { c.setFocus(); });
        };

        var removeControl = function(c) {
          // TODO: implement this.
        };

        var addControl = function(c) {
          // TODO: implement this.
        };

        var groupGridEx = function(property, keyCol, keyColSort) {
          // TODO: implement this.
        };

        var getTagChildIndex = function(tag) {
          var i = tag.indexOf(Dialogs.Constants.innerTab, 1);
          if(i > 0) {
            var n = Cairo.Util.val(tag.substring(1, i + Dialogs.Constants.innerTab.length));
            var q = Math.abs(Cairo.Math.truncate(n / 100));
            return (n - q * 100) * -1;
          }
        };

        var getTagFatherIndex = function(tag) {
          var i = tag.indexOf(Dialogs.Constants.innerTab, 1);
          if(i > 0) {
            return Math.abs(Math.truncate(Cairo.Util.val(tag.substring(1, i + Dialogs.Constants.innerTab.length)) / 100));
          }
        };

        var destroyGrids = function(view) {
          for(var i = view.getGrids().count()-1; i < view.getGrids().count(); i -= 1) {
            removeControl(view.getGrids().get(i));
          }
        };

        self.initialize();

        return self;
      }
    };

  });

}());